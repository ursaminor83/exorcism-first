import type { Vec2 } from '../core/types';

export interface RectObstacle { readonly id: string; readonly x: number; readonly y: number; readonly width: number; readonly height: number }
export interface WalkBounds { readonly left: number; readonly top: number; readonly right: number; readonly bottom: number }
export interface MoveResult { readonly position: Vec2; readonly blockedX: boolean; readonly blockedY: boolean }

function overlaps(x: number, y: number, radius: number, obstacle: RectObstacle): boolean {
  const nearestX = Math.max(obstacle.x, Math.min(x, obstacle.x + obstacle.width));
  const nearestY = Math.max(obstacle.y, Math.min(y, obstacle.y + obstacle.height));
  return (x - nearestX) ** 2 + (y - nearestY) ** 2 < radius ** 2;
}

/** Deterministic, engine-free movement with axis-separated sliding. */
export function movePlayer(position: Vec2, direction: Vec2, distance: number, bounds: WalkBounds, obstacles: readonly RectObstacle[], radius = 20): MoveResult {
  if (![position.x, position.y, direction.x, direction.y, distance, radius].every(Number.isFinite) || distance < 0 || radius < 0) throw new RangeError('Invalid movement input');
  const length = Math.hypot(direction.x, direction.y);
  const dx = length > 0 ? direction.x / length * distance : 0;
  const dy = length > 0 ? direction.y / length * distance : 0;
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const nextX = clamp(position.x + dx, bounds.left + radius, bounds.right - radius);
  const x = obstacles.some(o => overlaps(nextX, position.y, radius, o)) ? position.x : nextX;
  const nextY = clamp(position.y + dy, bounds.top + radius, bounds.bottom - radius);
  const y = obstacles.some(o => overlaps(x, nextY, radius, o)) ? position.y : nextY;
  return { position: { x, y }, blockedX: dx !== 0 && x === position.x, blockedY: dy !== 0 && y === position.y };
}
