/** Pure combat calculations; values are deterministic when the random roll is injected. */
export type EnemyKind='human'|'ghost';
export interface EnemyDef{id:string;name:string;kind:EnemyKind;hp:number;atk:number;def:number;xp:number;gold:number;description:string}
export const ENEMIES:readonly EnemyDef[]=[
{id:'foreman',name:'덩치',kind:'human',hp:165,atk:25,def:12,xp:0,gold:0,description:'철거 용역 반장. 초반 강제 패배 상대'},
{id:'pipe_thug',name:'담배',kind:'human',hp:105,atk:20,def:7,xp:45,gold:1800,description:'녹슨 파이프를 든 용역'},
{id:'stray_dog',name:'사나운 들개',kind:'human',hp:48,atk:12,def:3,xp:20,gold:0,description:'골목을 지키는 들개'},
{id:'drunk',name:'술 취한 시비꾼',kind:'human',hp:72,atk:15,def:5,xp:28,gold:300,description:'시장 뒷골목의 시비꾼'},
{id:'shadow',name:'그림자',kind:'ghost',hp:62,atk:17,def:6,xp:36,gold:0,description:'어둠에 남은 원념'},
{id:'water_spirit',name:'물귀신',kind:'ghost',hp:92,atk:21,def:9,xp:55,gold:0,description:'복개 수로에 머무는 원령'},
{id:'yard_spirit',name:'터줏귀',kind:'ghost',hp:110,atk:19,def:12,xp:62,gold:0,description:'낡은 집터의 원령'},
{id:'factory_wraith',name:'폐공장 망령',kind:'ghost',hp:125,atk:25,def:13,xp:78,gold:0,description:'공단에 떠도는 망령'}
];
export const enemy=(id:string):EnemyDef|undefined=>ENEMIES.find(e=>e.id===id);
export function damage(atk:number,def:number,roll=1,critical=false,guard=false):number{
 if(!Number.isFinite(atk)||!Number.isFinite(def)||!Number.isFinite(roll))throw new Error('Invalid combat stats');
 const base=Math.max(1,atk-def*0.8);
 const variance=Math.max(0.85,Math.min(1.15,roll));
 return Math.max(1,Math.floor(base*variance*(critical&&!guard?1.5:1)*(guard?0.4:1)));
}
export function defenseCounter(damageTaken:number):number{return Math.max(0,Math.floor(damageTaken*0.3));}
export function encounterEnemy(region:string):EnemyDef{
 const id:Record<string,string>={kkachi:'pipe_thug',forest:'shadow',temple:'yard_spirit',cult:'shadow',outskirts:'stray_dog',oldtown:'drunk',sewer:'water_spirit',industrial:'factory_wraith',riverside:'water_spirit',ferry:'water_spirit',final:'factory_wraith'};
 return enemy(id[region]??'drunk')!;
}
