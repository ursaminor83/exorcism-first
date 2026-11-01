import {describe,it,expect} from 'vitest';
import {currentQuest} from './quest';
import {SITES,resolveDialogue} from './story';
const site=(id:string)=>{const x=SITES.find(s=>s.id===id);if(!x)throw new Error(id);return x;};
describe('Episode 1 chronology and dialogue',()=>{
 it('hides red boots in initial objectives',()=>expect(currentQuest([]).objective).not.toMatch(/장화|순이|귀신/));
 it('routes first battle after assignment',()=>expect(currentQuest(['intro_home','intro_office']).target).toBe('철거 현장'));
 it('grandma cannot complete before first fight',()=>expect(resolveDialogue(site('grandma'),['intro_office']).grantFlag).toBeUndefined());
 it('grandma unlocks after first fight',()=>expect(resolveDialogue(site('grandma'),['ep01_first_battle']).grantFlag).toBe('ep01_grandma'));
 it('second fight requires overnight rest',()=>expect(currentQuest(['intro_home','intro_office','ep01_first_battle','ep01_grandma','ep01_album']).target).toBe('손대성의 방'));
 it('sleep only activates after album',()=>{expect(resolveDialogue(site('sleep'),[]).available).toBe(false);expect(resolveDialogue(site('sleep'),['ep01_album']).grantFlag).toBe('ep01_next_day');});
 it('album hidden before invitation',()=>expect(resolveDialogue(site('album'),[]).available).toBe(false));
 it('boots hidden before album',()=>expect(resolveDialogue(site('boots'),[]).available).toBe(false));
 it('grandma story never repeats',()=>expect(resolveDialogue(site('grandma'),['ep01_first_battle','ep01_grandma','ep01_second_battle','ep01_puddle','ep01_grandma_story']).grantFlag).toBeUndefined());
 it('shaman does not spoil story',()=>expect(resolveDialogue(site('fake'),[]).lines.join(' ')).not.toMatch(/순이|다섯 살|망자/));
 it('shaman first consultation only once',()=>expect(resolveDialogue(site('fake'),['ep01_grandma_story','ep01_shaman']).grantFlag).toBeUndefined());
 it('keeps ordered quest targets',()=>{
  const flags=['intro_home','intro_office','ep01_first_battle','ep01_grandma','ep01_album','ep01_next_day','ep01_second_battle','ep01_puddle','ep01_grandma_story','ep01_shaman'];
  expect(flags.map((_,i)=>currentQuest(flags.slice(0,i)).target)).toEqual(['어머니','철거 용역 사무실','철거 현장','철거민 할머니','할머니 집','손대성의 방','철거 현장','마당','철거민 할머니','재래시장']);
 });
});