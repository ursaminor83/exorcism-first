import { describe, it, expect } from 'vitest';
import { initialClock, advanceClock, clockLabel, remainingMinutes, DEADLINE_MINUTE, travelCost } from './episodeClock';
describe('episode 1 clock', () => {
  it('starts Friday at 15:00 with 67 hours remaining', () => {
    expect(clockLabel(initialClock())).toBe('금요일 15:00');
    expect(remainingMinutes(initialClock())).toBe(67 * 60);
  });
  it('advances only by charged actions', () => {
    expect(clockLabel(advanceClock(initialClock(), 15))).toBe('금요일 15:15');
    expect(travelCost('kkachi', 'kkachi')).toBe(0);
  });
  it('ends exactly at Monday 10:00 and cannot advance further', () => {
    const end = advanceClock(initialClock(), 10000);
    expect(end.elapsed).toBe(DEADLINE_MINUTE);
    expect(end.ending).toBe('demolition');
    expect(advanceClock(end, 10)).toEqual(end);
  });
});
