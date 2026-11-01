import Phaser from 'phaser';
import { gameConfig } from './config';

// Browser-only composition root. Core modules never import Phaser.
new Phaser.Game(gameConfig);
