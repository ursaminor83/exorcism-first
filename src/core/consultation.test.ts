import {describe,it,expect} from 'vitest';
import {consultationPayment} from './consultation';
describe('mandatory shaman consultation',()=>{
 it('uses the full 50000 fee when available',()=>expect(consultationPayment(50000)).toEqual({remaining:0,debt:0}));
 it('allows a purchase before the consultation',()=>expect(consultationPayment(49500)).toEqual({remaining:0,debt:500}));
 it('does not lock a player with no money',()=>expect(consultationPayment(0)).toEqual({remaining:0,debt:50000}));
 it('preserves extra money',()=>expect(consultationPayment(52000)).toEqual({remaining:2000,debt:0}));
});
