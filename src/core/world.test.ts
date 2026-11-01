import { describe, expect, it } from 'vitest';
import { START_REGION, WORLD_REGIONS, getRegion, travel, validateWorld } from './world';

describe('season one world topology', () => {
  it('defines fourteen unique regions', () => {
    expect(WORLD_REGIONS).toHaveLength(14);
    expect(new Set(WORLD_REGIONS.map(region => region.id)).size).toBe(14);
  });
  it('keeps every region reachable with reciprocal exits', () => {
    expect(validateWorld()).toEqual([]);
  });
  it('starts at Kkachi and connects to the market', () => {
    expect(START_REGION).toBe('kkachi');
    expect(travel('kkachi','east')).toBe('market');
    expect(travel('market','west')).toBe('kkachi');
  });
  it('places the real shrine in the forest and fake shop in the market', () => {
    expect(getRegion('forest')?.landmarks).toContain('산 아래 신당');
    expect(getRegion('market')?.landmarks).toContain('사오정의 가짜 점집');
  });
  it('rejects nonexistent passages', () => {
    expect(travel('kkachi','west')).toBeNull();
    expect(getRegion('unknown')).toBeUndefined();
  });
});
