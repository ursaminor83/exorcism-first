/** Deterministic episode-one inventory and equipment rules. */
export type ItemKind='consumable'|'equipment'|'evidence'|'key';
export type EquipmentSlot='weapon'|'armor'|'charm';
export interface ItemDef {id:string;name:string;kind:ItemKind;description:string;price:number;heal?:number;attack?:number;defense?:number;slot?:EquipmentSlot;unique?:boolean}
export const ITEMS:readonly ItemDef[]=[
{id:'bandage',name:'붕대',kind:'consumable',description:'체력 30 회복',price:500,heal:30},
{id:'soda',name:'쌍화탕',kind:'consumable',description:'체력 50 회복',price:1200,heal:50},
{id:'rice',name:'삼각김밥',kind:'consumable',description:'체력 20 회복',price:350,heal:20},
{id:'stick',name:'낡은 각목',kind:'equipment',description:'철거 현장에서 주운 각목',price:2000,attack:5,slot:'weapon'},
{id:'gloves',name:'작업용 반장갑',kind:'equipment',description:'주먹 보호',price:1200,attack:2,slot:'weapon'},
{id:'jacket',name:'두꺼운 작업복',kind:'equipment',description:'작업복 방어구',price:3500,defense:4,slot:'armor'},
{id:'vest',name:'방한 조끼',kind:'equipment',description:'낡은 방한 조끼',price:2000,defense:3,slot:'armor'},
{id:'fake_charm',name:'사오정의 부적',kind:'key',description:'대성은 효험을 굳게 믿는다',price:50000,unique:true},
{id:'red_boot',name:'빨간 장화 한 짝',kind:'evidence',description:'순이의 유품',price:0,unique:true},
{id:'doll',name:'낡은 인형',kind:'evidence',description:'순이 이름이 수놓인 인형',price:0,unique:true},
{id:'drawing',name:'도면 뒷면의 그림',kind:'evidence',description:'도면의 보강 구조와 실제 건물이 다르다',price:0,unique:true},
];
export type Inventory=Record<string,number>;
export type Equipment=Partial<Record<EquipmentSlot,string>>;
export const START_ITEMS:Inventory={bandage:3,rice:2};
export const item=(id:string):ItemDef|undefined=>ITEMS.find(i=>i.id===id);
export function addItem(bag:Inventory,id:string,count=1):Inventory{
 const def=item(id);if(!def||!Number.isInteger(count)||count<1)throw new Error('Invalid item grant');
 return {...bag,[id]:def.unique?1:(bag[id]??0)+count};
}
export function removeItem(bag:Inventory,id:string,count=1):Inventory|null{
 if(!Number.isInteger(count)||count<1||(bag[id]??0)<count)return null;
 const next={...bag,[id]:bag[id]-count};if(next[id]===0)delete next[id];return next;
}
export function equip(bag:Inventory,equipment:Equipment,id:string):Equipment|null{
 const def=item(id);if(!def||def.kind!=='equipment'||!def.slot||(bag[id]??0)<1)return null;
 return {...equipment,[def.slot]:id};
}
export function equipmentStats(equipment:Equipment):{attack:number;defense:number}{
 let attack=0,defense=0;
 for(const id of Object.values(equipment)){const def=id?item(id):undefined;if(def){attack+=def.attack??0;defense+=def.defense??0;}}
 return {attack,defense};
}
export function useHealingItem(bag:Inventory,id:string,hp:number,maxHp:number):{bag:Inventory;hp:number}|null{
 const def=item(id);if(!def?.heal||hp>=maxHp)return null;
 const next=removeItem(bag,id);return next?{bag:next,hp:Math.min(maxHp,hp+def.heal)}:null;
}
export function buyItem(bag:Inventory,gold:number,id:string):{bag:Inventory;gold:number}|null{
 const def=item(id);if(!def||def.kind==='evidence'||def.kind==='key'||gold<def.price)return null;
 return {bag:addItem(bag,id),gold:gold-def.price};
}
