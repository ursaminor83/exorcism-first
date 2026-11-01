import {describe,it,expect} from 'vitest';
import {battleOutcome} from './battleOutcome';
describe('battle terminal outcomes',()=>{
 it('ends when player HP reaches zero',()=>expect(battleOutcome(0,30)).toBe('defeat'));
 it('ends when enemy HP reaches zero',()=>expect(battleOutcome(30,0)).toBe('victory'));
 it('handles simultaneous zero HP as defeat',()=>expect(battleOutcome(0,0)).toBe('defeat'));
 it('does not permit scripted enemy defeat by HP',()=>expect(battleOutcome(30,0,true)).toBe('continue'));
 it('does not permit spirit defeat by HP',()=>expect(battleOutcome(30,0,false,true)).toBe('continue'));
 it('continues with both alive',()=>expect(battleOutcome(30,20)).toBe('continue'));
});
