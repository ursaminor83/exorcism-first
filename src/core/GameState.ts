import type { GameState, GameMode, Vec2 } from './types';

export function createInitialGameState(): GameState {
  return { schemaVersion: 1, mode: 'explore', mapId: 'map_test_001', playerPosition: { x: 960, y: 540 } };
}

export function setGameMode(state: GameState, mode: GameMode): GameState {
  return { ...state, mode };
}

export function setPlayerPosition(state: GameState, position: Vec2): GameState {
  if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
    throw new RangeError('Player position must contain finite coordinates');
  }
  return { ...state, playerPosition: { x: position.x, y: position.y } };
}
