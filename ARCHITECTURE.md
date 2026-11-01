# Architecture v0.1

- `src/core`: deterministic, immutable game state. No Phaser or browser dependencies.
- `src/systems`: future pure game rules. Not implemented in stage 1.
- `src/adapters`: future data loading, persistence and runtime integration.
- `src/web`: Phaser composition root, scenes and presentation.
- `src/data`: future portable JSON content.
- `public/assets`: original media assets (do not modify originals).

## Stage 1

`BootScene` transitions to `ExploreScene`. A fixed 1920×1080 logical viewport uses FIT scaling. The exploration view displays placeholders. Movement, dialogue, NPC interaction and battle transitions are **not implemented**.

## Constraints

Game state cannot reference Phaser, the DOM, localStorage or browser-specific objects. Screen rendering must read state rather than become authoritative game state. Future runtime state must survive scene transitions. World coordinates are logical 2D units, not original PNG pixel dimensions; stage 2 will formalize collision and world boundaries.
