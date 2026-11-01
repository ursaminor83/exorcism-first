import {describe,it,expect} from 'vitest';
import {SITES,EP01_FLAGS,episode01Status,sitesIn} from './story';
describe('season one narrative data',()=>{
 it('gives all fourteen regions a playable landmark',()=>{
  const regions=new Set(SITES.map(s=>s.region));expect(regions.size).toBe(14);
 });
 it('places real shrine and fake shaman shop in distinct areas',()=>{
  expect(sitesIn('forest').some(s=>s.name==='산 아래 신당')).toBe(true);
  expect(sitesIn('market').some(s=>s.name==='사오정의 점집')).toBe(true);
 });
 it('requires four unique clues for the first investigation',()=>{
  expect(new Set(EP01_FLAGS).size).toBe(4);
  expect(episode01Status([])).toContain('0/4');
  expect(episode01Status([...EP01_FLAGS])).toContain('조사 완료');
 });
});
