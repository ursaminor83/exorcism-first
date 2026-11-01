import {describe,it,expect} from 'vitest';
import {damage,defenseCounter,ENEMIES,encounterEnemy} from './combat';
describe('combat rules',()=>{
 it('uses ATK - DEF*0.8 and floors final result',()=>expect(damage(20,10,1)).toBe(12));
 it('guards at 40% and cancels critical damage',()=>expect(damage(20,10,1,true,true)).toBe(4));
 it('critical damage is 150%',()=>expect(damage(20,10,1,true)).toBe(18));
 it('never falls below one damage',()=>expect(damage(1,100,0.85)).toBe(1));
 it('counter returns 30 percent of guarded damage',()=>expect(defenseCounter(7)).toBe(2));
 it('defines nine unique opponents and region selection',()=>{expect(new Set(ENEMIES.map(e=>e.id)).size).toBe(9);expect(encounterEnemy('sewer').id).toBe('water_spirit');});
});