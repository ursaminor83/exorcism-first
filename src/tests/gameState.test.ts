import { describe, expect, it } from 'vitest';
import { createInitialGameState, setGameMode, setPlayerPosition } from '../core/GameState';

describe('engine-independent game state', () => {
  it('initializes deterministic exploration state', () => {
    expect(createInitialGameState()).toEqual({
      schemaVersion: 1, mode: 'explore', mapId: 'map_test_001', playerPosition: { x: 960, y: 540 },
    });
  });
  it('changes mode without mutating the previous state', () => {
    const before = createInitialGameState();
    const after = setGameMode(before, 'battle');
    expect(after.mode).toBe('battle');
    expect(before.mode).toBe('explore');
  });
  it('updates positions immutably and rejects non-finite coordinates', () => {
    const before = createInitialGameState();
    expect(setPlayerPosition(before, { x: 10, y: 20 }).playerPosition).toEqual({ x: 10, y: 20 });
    expect(before.playerPosition.x).toBe(960);
    expect(() => setPlayerPosition(before, { x: NaN, y: 20 })).toThrow(RangeError);
  });
});
