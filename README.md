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


## 2단계: NPC 대화 및 조사 (프로토타입)

- 방향키 / WASD: 이동
- 할머니 NPC(길 오른쪽)에게 접근해 `E`: 대화 시작
- 게시판(길 왼쪽)에 접근해 `E`: 조사 및 단서 획득
- 대화 중 `E` 또는 `Space`: 다음 대사, 마지막 대사 이후 닫힘
- 대화 중 이동 중지
- 대사 데이터: `src/data/dialogues/intro.json`
- 임시 도형과 문구는 추후 실제 에피소드 1 자산으로 교체 예정

## 에피소드 1 프로토타입 — 조사에서 전투까지

- 방향키 / WASD: 이동, E: 대화·조사, J: 사건 수첩, ESC: 수첩 닫기.
- 할머니 대화, 철거 안내문 조사, 수상한 물건 조사로 단서 3개를 모읍니다.
- 중앙 폐가 진입로에서 E를 누르면 첫 전투가 시작됩니다.
- 전투: 1 주먹질, 2 방어, 3 허세, 4 붕대. 승리 후 Enter로 복귀합니다.
- 임시 도형과 임시 대사로 만든 기술·플레이 흐름 검증 버전입니다. 실제 시나리오 확정본이 아닙니다.
