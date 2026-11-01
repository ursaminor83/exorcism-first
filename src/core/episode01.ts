/** Episode 1 narrative rules. Phaser-independent and safe to serialize. */
export type GhostOutcome = 'exorcism' | 'ascension';
export type Visibility = 'hidden' | 'presence' | 'manifested' | 'spirit-sight';
export type EpisodeFlag =
  | 'suni_mystery_solved'
  | 'suni_regret_resolved'
  | 'oj_fake_talisman_bought'
  | 'oj_fake_talisman_exposed'
  | 'suni_exorcised'
  | 'suni_ascended'
  | 'ep01_spirit_resonance_unlocked';

export interface EpisodeState {
  items: string[];
  flags: Partial<Record<EpisodeFlag, boolean>>;
  outcomes: Partial<Record<'suni', GhostOutcome>>;
}
export const SUNI_REQUIRED_ITEMS = [
  'suni_red_boot_found',
  'suni_family_photo',
  'suni_flower_dress',
  'suni_red_boot_missing',
] as const;

export function newEpisodeState(): EpisodeState {
  return { items: [], flags: {}, outcomes: {} };
}
export function acquireItem(state: EpisodeState, item: string): EpisodeState {
  return { ...state, items: [...new Set([...state.items, item])] };
}
export function setEpisodeFlag(state: EpisodeState, flag: EpisodeFlag): EpisodeState {
  return { ...state, flags: { ...state.flags, [flag]: true } };
}
export function canAscendSuni(state: EpisodeState): boolean {
  return SUNI_REQUIRED_ITEMS.every(id => state.items.includes(id))
    && state.flags.suni_mystery_solved === true
    && state.flags.suni_regret_resolved === true;
}
/** Called exactly once when the ghost reaches zero HP; human enemies do not use this. */
export function resolveSuniAtZeroHp(state: EpisodeState, hp: number): {
  state: EpisodeState; outcome: GhostOutcome | null; eventId: string | null;
} {
  if (hp > 0) return { state, outcome: null, eventId: null };
  const prior = state.outcomes.suni;
  if (prior) return {
    state, outcome: prior,
    eventId: null, // Prevent duplicate cutscenes and rewards on re-entry.
  };
  const outcome: GhostOutcome = canAscendSuni(state) ? 'ascension' : 'exorcism';
  const flags: EpisodeState['flags'] = { ...state.flags };
  if (outcome === 'ascension') {
    flags.suni_ascended = true;
    flags.ep01_spirit_resonance_unlocked = true;
  } else {
    flags.suni_exorcised = true;
  }
  return {
    state: { ...state, flags, outcomes: { ...state.outcomes, suni: outcome } },
    outcome,
    eventId: outcome === 'ascension' ? 'ep01_suni_ascension' : 'ep01_suni_exorcism',
  };
}
/** Ordinary people can perceive a manifested ghost, but not a hidden one. */
export function ghostVisibility(options: {
  hasSpiritSight: boolean;
  ghostManifested: boolean;
  hasPresenceClue: boolean;
}): Visibility {
  if (options.hasSpiritSight) return 'spirit-sight';
  if (options.ghostManifested) return 'manifested';
  return options.hasPresenceClue ? 'presence' : 'hidden';
}
