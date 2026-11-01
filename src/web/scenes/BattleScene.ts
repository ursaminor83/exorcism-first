import Phaser from 'phaser';
/** Reserved for stage 5. Not wired into gameplay yet. */
export class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }
  create(): void {
    this.cameras.main.setBackgroundColor('#24212b');
    this.add.text(100, 100, '전투 화면 — 미구현', { fontFamily: 'sans-serif', fontSize: '48px', color: '#ffffff' });
  }
}
