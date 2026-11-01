# 퇴마는 처음이라 — StackBlitz Web Prototype v0.1

**No local Node.js/npm installation required.** The game runs inside a browser-based StackBlitz WebContainer.

## Import in browser

1. Visit https://stackblitz.com/ and sign in if requested.
2. Choose **Create Project / Import Project / Upload Project** (the label may differ by UI version) and upload `exorcism-first-stackblitz.zip`. If direct ZIP upload is unavailable, extract ZIP in the browser/OS file manager and import the folder, or use GitHub repository import.
3. StackBlitz should install the dependencies and run `npm run dev` as configured by `.stackblitzrc`. If it does not start, open its built-in terminal and run `npm install`, then `npm run dev` **inside StackBlitz**.
4. Open the built-in preview. It should show the placeholder title and colored shapes.
5. In the StackBlitz terminal, run `npm run test`, `npm run typecheck`, and `npm run build`.

## Expected stage-1 behavior

- Fixed 1920x1080 logical canvas scaled to fit the browser (16:9).
- BootScene automatically opens ExploreScene.
- Placeholder shapes and Korean title are visible.
- Movement, NPC, dialogue and battle transition are NOT implemented yet.

## Architecture

`src/core` has no Phaser or browser API dependency. `src/web` owns Phaser rendering. JSON content belongs in `src/data`; raw PNG assets belong in `public/assets`. See ARCHITECTURE.md, DATA_SCHEMA.md and UNITY_PORTING.md.

## Verification

The source bundle was checked for expected files and JSON validity, but package installation, build, tests, and browser preview **have not been successfully run** in the authoring environment because registry.npmjs.org DNS access failed (`EAI_AGAIN`). Do not mark stage 1 as complete until verified in StackBlitz.
