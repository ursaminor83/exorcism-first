import {describe,it,expect} from 'vitest';
import {currentQuest} from './quest';
describe('episode 1 opening objectives',()=>{
 it('starts at home with mother',()=>{expect(currentQuest([]).region).toBe('home');expect(currentQuest([]).target).toBe('어머니');});
 it('requires office after home',()=>{expect(currentQuest(['intro_home']).target).toBe('철거 용역 사무실');});
 it('directs player through demolition clues and priest',()=>{
  expect(currentQuest(['intro_home','intro_office']).target).toBe('철거 현장');
  expect(currentQuest(['intro_home','intro_office','ep01_grandma','ep01_notice','ep01_boots']).target).toBe('폐가 진입로');
 });
 it('unlocks haunted house after clues',()=>{
  const flags=['intro_home','intro_office','ep01_grandma','ep01_notice','ep01_boots'];
  expect(currentQuest(flags).target).toBe('폐가 진입로');
  expect(currentQuest([...flags,'ep01_first_battle']).completed).toBe(true);
 });
});