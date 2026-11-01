/** Recruitment is a story flag, not an automatic initial party membership. */
export const RECRUIT_FLAGS:Readonly<Record<string,string>>={
 paolo:'ep01_priest_met',
 saojeong:'ep01_shaman_joined',
 palbok:'ep01_palbok_joined'
};
export function activePartyIds(flags:readonly string[]):string[]{
 return ['daeseong',...Object.entries(RECRUIT_FLAGS).filter(([,flag])=>flags.includes(flag)).map(([id])=>id)];
}
