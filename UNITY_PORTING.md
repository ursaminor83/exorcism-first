# Unity Porting Plan v0.1

## Portable

- Original PNG assets and engine-neutral JSON content once authored.
- GameState field definitions and state transition behavior as a specification.
- Deterministic test cases and ID conventions.

## Must be rewritten in C# / Unity

- TypeScript state functions and future systems (same behavior, different implementation).
- Phaser scenes, renderers, input, scaling, camera, asset loading and animation playback.
- Browser save adapter (future localStorage) into a Unity-compatible repository.

## Warning

Do not store Phaser objects in game state or content. TypeScript source cannot be executed natively as Unity C#. Preserve state transitions and tests rather than attempting to share runtime code. Importing PNG into Unity still requires Unity-specific asset configuration.
