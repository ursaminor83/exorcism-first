import { START_REGION, getRegion } from './world';
import { START_ITEMS, type Inventory, type Equipment } from './inventory';
export interface Hero { id:string; name:string; level:number; xp:number; hp:number; maxHp:number; atk:number; def:number; }
export interface Progress { version:1; regionId:string; x:number; y:number; steps:number; wins:number; gold:number; party:Hero[]; flags:string[]; inventory?:Inventory; equipment?:Equipment }
export const SAVE_KEY='exorcism-first-rpg-v02';
export const initialProgress=():Progress=>({
 version:1,regionId:START_REGION,x:960,y:540,steps:0,wins:0,gold:0,flags:[],inventory:{...START_ITEMS},equipment:{},
 party:[
  {id:'daeseong',name:'손대성',level:1,xp:0,hp:100,maxHp:100,atk:18,def:7},
  {id:'paolo',name:'바오로',level:1,xp:0,hp:135,maxHp:135,atk:12,def:13},
  {id:'saojeong',name:'사오정',level:1,xp:0,hp:65,maxHp:65,atk:7,def:3},
  {id:'palbok',name:'주팔복',level:1,xp:0,hp:115,maxHp:115,atk:16,def:10}
 ]
});
export const xpNeeded=(level:number):number=>40+level*20;
export function rewardBattle(progress:Progress,xp=35,gold=12):Progress {
 return {...progress,wins:progress.wins+1,gold:progress.gold+gold,party:progress.party.map(hero=>{
  let h={...hero,xp:hero.xp+xp};
  while(h.xp>=xpNeeded(h.level)) {
   h.xp-=xpNeeded(h.level);h.level++;h.maxHp+=h.id==='saojeong'?5:10;h.hp=Math.min(h.maxHp,h.hp+20);h.atk+=3;h.def+=1;
  }
  return h;
 })};
}
export function isProgress(value:unknown):value is Progress {
 if(!value||typeof value!=='object') return false;
 const p=value as Partial<Progress>;
 return p.version===1&&typeof p.regionId==='string'&&(p.regionId==='home'||!!getRegion(p.regionId))&&
 Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.steps)&&
 Number.isFinite(p.wins)&&Number.isFinite(p.gold)&&Array.isArray(p.flags)&&
 Array.isArray(p.party)&&p.party.length===4&&p.party.every(h=>h&&typeof h.id==='string'&&Number.isFinite(h.level)&&Number.isFinite(h.hp)&&Number.isFinite(h.xp));
}
export function encounterCheck(steps:number,kind:'safe'|'mixed'|'danger',roll:number):boolean {
 if(kind==='safe'||steps<12)return false;
 return roll<(kind==='danger'?0.035:0.012);
}
