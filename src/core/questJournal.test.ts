import {describe,it,expect} from 'vitest';
import {questJournal,EP01_MILESTONES} from './questJournal';
describe('episode-one journal',()=>{
 it('begins with first quest and no milestones',()=>{const j=questJournal([]);expect(j.completed).toEqual([]);expect(j.target).toBe('어머니');});
 it('lists only completed story milestones',()=>{const j=questJournal(['intro_home','intro_office']);expect(j.completed).toHaveLength(2);expect(j.target).toBe('철거 현장');});
 it('ends with a complete journal',()=>{const j=questJournal(EP01_MILESTONES.map(x=>x.flag));expect(j.completed).toHaveLength(EP01_MILESTONES.length);expect(j.progress).toBe('18/18');});
});
