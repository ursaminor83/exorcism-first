/** Logical world coordinates, independent of render resolution. */
export interface Vec2 { readonly x: number; readonly y: number }
export type GameMode = 'explore' | 'battle';
export interface GameState {
  readonly schemaVersion: 1;
  readonly mode: GameMode;
  readonly mapId: string;
  readonly playerPosition: Vec2;
}
