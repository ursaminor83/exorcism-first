# Development Log

## 2026-11-01 — Stage 1 scaffold

- Approved: 1920×1080, free movement planned, fixed camera, separate BattleScene planned.
- Created Vite + Phaser 3 + TypeScript scaffold.
- Added placeholder ExploreScene and BootScene.
- Added pure initial GameState and unit tests.
- BattleScene is only a non-interactive placeholder; no transition implemented.
- No movement, dialogue, interaction, battle logic, save adapter or real media yet.
- Runtime verification results to be recorded after dependency installation.

## Verification status

- `npm install --offline`: FAILED (Phaser package not present in npm cache; ENOTCACHED).
- Registry lookup timed out in this environment.
- Therefore `npm run test`, `npm run build` and browser execution could not be performed; **stage 1 is not verified or complete**.
- Next action: install dependencies in a network-enabled Node environment, then run tests, typecheck, build and browser smoke test before stage 2.

## 2026-11-01 — StackBlitz browser workflow migration

- Preserved Phaser 3, TypeScript, Vite, core GameState, placeholder scenes and Vitest tests.
- Added `.stackblitzrc` and `start` command; repackaged ZIP with project files at archive root for direct import.
- Updated README for browser-only workflow. No local tool installation is required of the user.
- `npm install` in the authoring environment: FAILED with `EAI_AGAIN` for registry.npmjs.org.
- Browser preview, test suite, TypeScript typecheck and Vite build: **NOT VERIFIED**.
- Stage 1 completion: **PENDING** browser verification in StackBlitz.

## Stage 2 — 2.5D exploration proof of concept
- Added JSON map boundaries and collision rectangles, pure MovementSystem, diagonal normalization, and axis-separated sliding.
- Added keyboard-controlled placeholder character, three occluding houses, Y-based depth sorting and fixed-camera parallax-free illustrated layers.
- Historical Ka치골 text removed from ExploreScene; new season-one scenario and original art are not yet implemented.
- Execution and browser verification must be recorded separately from code authoring.
