import { describe, expect, it } from 'vitest';
import {
  acquireItem, canAscendSuni, ghostVisibility, newEpisodeState,
  resolveSuniAtZeroHp, setEpisodeFlag, SUNI_REQUIRED_ITEMS,
} from './episode01';

describe('episode 01 ghost resolution', () => {
  const ready = () => {
    let state = newEpisodeState();
    for (const item of SUNI_REQUIRED_ITEMS) state = acquireItem(state, item);
    state = setEpisodeFlag(state, 'suni_mystery_solved');
    return setEpisodeFlag(state, 'suni_regret_resolved');
  };
  it('requires all relics AND both narrative flags', () => {
    expect(canAscendSuni(newEpisodeState())).toBe(false);
    expect(canAscendSuni(ready())).toBe(true);
    expect(canAscendSuni(acquireItem(newEpisodeState(), SUNI_REQUIRED_ITEMS[0]))).toBe(false);
  });
  it('does not resolve before HP reaches zero', () => {
    const state = ready();
    expect(resolveSuniAtZeroHp(state, 1)).toEqual({ state, outcome: null, eventId: null });
  });
  it('automatically ascends and grants the unlock at zero HP', () => {
    const result = resolveSuniAtZeroHp(ready(), 0);
    expect(result.outcome).toBe('ascension');
    expect(result.eventId).toBe('ep01_suni_ascension');
    expect(result.state.flags.ep01_spirit_resonance_unlocked).toBe(true);
  });
  it('defaults to exorcism if conditions are missing', () => {
    const result = resolveSuniAtZeroHp(newEpisodeState(), -3);
    expect(result.outcome).toBe('exorcism');
    expect(result.state.flags.ep01_spirit_resonance_unlocked).toBeUndefined();
  });
  it('is idempotent and never replays rewards or cutscenes', () => {
    const first = resolveSuniAtZeroHp(ready(), 0);
    const second = resolveSuniAtZeroHp(first.state, 0);
    expect(second.outcome).toBe('ascension');
    expect(second.eventId).toBeNull();
  });
  it('preserves item uniqueness', () => {
    const once = acquireItem(newEpisodeState(), 'red_boot');
    expect(acquireItem(once, 'red_boot').items).toEqual(['red_boot']);
  });
  it('allows manifestation to be seen without innate spirit sight', () => {
    expect(ghostVisibility({ hasSpiritSight: false, ghostManifested: true, hasPresenceClue: false })).toBe('manifested');
    expect(ghostVisibility({ hasSpiritSight: false, ghostManifested: false, hasPresenceClue: true })).toBe('presence');
  });
});
