import { describe, expect, it } from 'vitest';
import { movePlayer } from '../systems/MovementSystem';
const bounds = { left: 0, top: 0, right: 200, bottom: 200 };
const obstacles = [{ id: 'wall', x: 100, y: 40, width: 20, height: 90 }];
describe('engine-independent movement', () => {
  it('normalizes diagonal movement', () => {
    const result = movePlayer({x:30,y:30}, {x:1,y:1}, 10, bounds, []);
    expect(Math.hypot(result.position.x - 30, result.position.y - 30)).toBeCloseTo(10);
  });
  it('stops at world bounds', () => {
    expect(movePlayer({x:180,y:180},{x:1,y:1},100,bounds,[]).position).toEqual({x:180,y:180});
  });
  it('blocks collision and allows axis sliding', () => {
    const result = movePlayer({x:75,y:75},{x:1,y:1},30,bounds,obstacles);
    expect(result.blockedX).toBe(true);
    expect(result.position.y).toBeGreaterThan(75);
  });
  it('rejects invalid movement', () => {
    expect(() => movePlayer({x:20,y:20},{x:1,y:0},-1,bounds,[])).toThrow(RangeError);
  });
});
