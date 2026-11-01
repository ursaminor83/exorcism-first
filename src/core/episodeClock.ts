/** Episode 1 clock. Pure logic: no Phaser or browser dependencies. */
export const START_MINUTE = 15 * 60;
export const DEADLINE_MINUTE = 3 * 1440 + 10 * 60; // Monday 10:00
export const DAY_NAMES = ['금요일', '토요일', '일요일', '월요일'] as const;
export type ClockState = { elapsed: number; ending: 'none' | 'success' | 'demolition' };
export const initialClock = (): ClockState => ({ elapsed: START_MINUTE, ending: 'none' });
export function isClock(value: unknown): value is ClockState {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<ClockState>;
  return typeof c.elapsed === 'number' && Number.isFinite(c.elapsed) && c.elapsed >= START_MINUTE &&
    (c.ending === 'none' || c.ending === 'success' || c.ending === 'demolition');
}
export function advanceClock(clock: ClockState, minutes: number): ClockState {
  if (clock.ending !== 'none') return clock;
  const elapsed = Math.min(DEADLINE_MINUTE, clock.elapsed + Math.max(0, Math.floor(minutes)));
  return { elapsed, ending: elapsed >= DEADLINE_MINUTE ? 'demolition' : 'none' };
}
export function clockLabel(clock: ClockState): string {
  const day = Math.min(3, Math.floor(clock.elapsed / 1440));
  const minute = clock.elapsed % 1440;
  return DAY_NAMES[day] + ' ' + String(Math.floor(minute / 60)).padStart(2, '0') + ':' +
    String(minute % 60).padStart(2, '0');
}
export function remainingMinutes(clock: ClockState): number {
  return Math.max(0, DEADLINE_MINUTE - clock.elapsed);
}
export function travelCost(from: string, to: string): number {
  if (from === to) return 0;
  if (from === 'home' || to === 'home') return 10;
  return 10; // Adjacent exits; long-range travel can use 20-30 minutes later.
}
export const BUILDING_ENTRY_MINUTES = 5;
export const CLOSE_INSPECTION_MINUTES = 10;
