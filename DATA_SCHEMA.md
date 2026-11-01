# Data Schema v0.1

No gameplay content schema has been finalized or populated in stage 1.

Initial runtime state contract:

```json
{
  "schemaVersion": 1,
  "mode": "explore",
  "mapId": "map_test_001",
  "playerPosition": { "x": 960, "y": 540 }
}
```

IDs must be stable strings. Coordinates are logical world units; the screen design resolution is 1920×1080. JSON files must contain no engine class names, callbacks or executable JavaScript. Future schemas will explicitly distinguish content version, runtime state and save version.
