import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { ExploreScene } from './scenes/ExploreScene';
import { BattleScene } from './scenes/BattleScene';
import { WorldScene } from './scenes/WorldScene';

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#111318',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { pixelArt: false, antialias: true },
  scene: [BootScene, ExploreScene, BattleScene, WorldScene],
};
