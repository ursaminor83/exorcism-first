/** Season 1 graybox topology. IDs are stable save-game identifiers. */
export type Direction = 'north' | 'south' | 'east' | 'west';
export interface WorldRegion {
  id: string;
  name: string;
  kind: 'safe' | 'mixed' | 'danger';
  exits: Partial<Record<Direction, string>>;
  landmarks: readonly string[];
}
export const START_REGION = 'kkachi';
export const WORLD_REGIONS: readonly WorldRegion[] = [
  { id:'kkachi', name:'까치골 철거지구', kind:'mixed', exits:{north:'forest',east:'market',south:'church'}, landmarks:['철거 예정지','철거민 할머니 집','용역 사무실'] },
  { id:'forest', name:'북산 산림지대', kind:'danger', exits:{south:'kkachi',east:'temple'}, landmarks:['산 아래 신당','오색천 큰 나무','숲길'] },
  { id:'temple', name:'산사·공동묘지', kind:'danger', exits:{west:'forest',east:'cult'}, landmarks:['공동묘지','폐사당','산속 제단'] },
  { id:'cult', name:'사이비 교단 구역', kind:'mixed', exits:{west:'temple',south:'newtown',east:'outskirts'}, landmarks:['교단 본관','무료 급식소','공동생활관'] },
  { id:'outskirts', name:'외곽 폐교·농촌', kind:'danger', exits:{west:'cult',south:'final'}, landmarks:['폐교','농촌 마을','오래된 우물'] },
  { id:'market', name:'재래시장·상업지구', kind:'safe', exits:{west:'kkachi',east:'oldtown',south:'sewer'}, landmarks:['사오정의 가짜 점집','국밥집','재래시장'] },
  { id:'oldtown', name:'구시가지', kind:'mixed', exits:{west:'market',east:'newtown'}, landmarks:['흥신소 겸 전당포','낡은 여관','폐가'] },
  { id:'newtown', name:'신도시·재개발지구', kind:'safe', exits:{west:'oldtown',north:'cult',south:'industrial'}, landmarks:['신축 아파트','재개발 회사','부동산'] },
  { id:'church', name:'성당·주택가', kind:'safe', exits:{north:'kkachi',east:'sewer',south:'riverside'}, landmarks:['까치골 성당','사제관','병원'] },
  { id:'sewer', name:'복개 수로·지하시설', kind:'danger', exits:{north:'market',west:'church',east:'industrial',south:'ferry'}, landmarks:['복개 수로','지하 배수시설','하천 둔치'] },
  { id:'industrial', name:'공단·창고지대', kind:'danger', exits:{west:'sewer',north:'newtown'}, landmarks:['폐공장','창고 단지','공단 진입로'] },
  { id:'riverside', name:'강변 판자촌', kind:'mixed', exits:{north:'church',east:'ferry'}, landmarks:['강변 판자촌','낚시터','모래톱'] },
  { id:'ferry', name:'나루터·폐유람선', kind:'danger', exits:{west:'riverside',north:'sewer',east:'final'}, landmarks:['나루터','폐유람선','선착장'] },
  { id:'final', name:'최종 사건 구역', kind:'danger', exits:{north:'outskirts',west:'ferry'}, landmarks:['봉쇄된 시설','최종 사건 현장'] }
];
export const getRegion = (id: string): WorldRegion | undefined => WORLD_REGIONS.find(region => region.id === id);
export function travel(regionId: string, direction: Direction): string | null {
  return getRegion(regionId)?.exits[direction] ?? null;
}
export function validateWorld(): string[] {
  const errors: string[] = [];
  for (const region of WORLD_REGIONS) {
    for (const [direction, destination] of Object.entries(region.exits)) {
      if (!getRegion(destination)) errors.push(region.id + ': missing ' + destination);
      const opposite: Record<Direction, Direction> = {north:'south',south:'north',east:'west',west:'east'};
      if (getRegion(destination)?.exits[opposite[direction as Direction]] !== region.id) errors.push(region.id + ': one-way ' + direction);
    }
  }
  const seen = new Set<string>([START_REGION]);
  const queue = [START_REGION];
  while(queue.length) {
    const current = getRegion(queue.shift()!);
    for (const next of Object.values(current?.exits ?? {})) if (!seen.has(next)) {seen.add(next);queue.push(next);}
  }
  for (const region of WORLD_REGIONS) if (!seen.has(region.id)) errors.push(region.id + ': unreachable');
  return errors;
}
