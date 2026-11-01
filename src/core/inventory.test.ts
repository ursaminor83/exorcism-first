import {describe,it,expect} from 'vitest';
import {START_ITEMS,addItem,removeItem,equip,equipmentStats,useHealingItem,buyItem} from './inventory';
describe('inventory and equipment',()=>{
 it('stacks supplies and keeps unique evidence unique',()=>{expect(addItem(START_ITEMS,'bandage',2).bandage).toBe(5);expect(addItem(addItem({},'red_boot'),'red_boot').red_boot).toBe(1);});
 it('cannot consume absent items',()=>expect(removeItem({},'bandage')).toBeNull());
 it('heals only when injured and consumes one',()=>{expect(useHealingItem({bandage:2},'bandage',80,100)).toEqual({bag:{bandage:1},hp:100});expect(useHealingItem({bandage:1},'bandage',100,100)).toBeNull();});
 it('requires ownership to equip and calculates bonuses',()=>{expect(equip({}, {},'stick')).toBeNull();const equipped=equip({stick:1,jacket:1},{},'stick')!;const both=equip({stick:1,jacket:1},equipped,'jacket')!;expect(equipmentStats(both)).toEqual({attack:5,defense:4});});
 it('cannot buy evidence or spend more than owned',()=>{expect(buyItem({},100,'red_boot')).toBeNull();expect(buyItem({},100,'jacket')).toBeNull();expect(buyItem({},500,'bandage')).toEqual({bag:{bandage:1},gold:0});});
});