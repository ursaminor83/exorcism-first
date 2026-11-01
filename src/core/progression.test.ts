import {describe,it,expect} from 'vitest';
import {initialProgress,rewardBattle,xpNeeded,encounterCheck,isProgress} from './progression';
describe('RPG progression',()=>{
 it('creates four distinct heroes',()=>{const p=initialProgress();expect(p.party).toHaveLength(4);expect(new Set(p.party.map(h=>h.id)).size).toBe(4);});
 it('awards XP and gold and levels up',()=>{const p=rewardBattle(initialProgress(),xpNeeded(1),20);expect(p.wins).toBe(1);expect(p.gold).toBe(20);expect(p.party[0].level).toBe(2);expect(p.party.slice(1).every(h=>h.level===1)).toBe(true);});
 it('keeps safe zones encounter free',()=>{expect(encounterCheck(100,'safe',0)).toBe(false);expect(encounterCheck(2,'danger',0)).toBe(false);expect(encounterCheck(12,'danger',0)).toBe(true);});
 it('restores progress saved inside home',()=>expect(isProgress({...initialProgress(),regionId:'home'})).toBe(true));
 it('validates saved data',()=>{expect(isProgress(initialProgress())).toBe(true);expect(isProgress({version:1,regionId:'unknown'})).toBe(false);});
});
