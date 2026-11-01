import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/** Episode 1 combat prototype. Separate scene; no character assets required. */
export class BattleScene extends Phaser.Scene {
  private hp = 100;
  private enemyHp = 90;
  private guarding = false;
  private ended = false;
  private status!: Phaser.GameObjects.Text;
  private log!: Phaser.GameObjects.Text;
  private controls: Phaser.GameObjects.Text[] = [];

  constructor() { super('BattleScene'); }

  create(): void {
    this.hp = 100; this.enemyHp = 90; this.guarding = false; this.ended = false;
    this.cameras.main.setBackgroundColor('#23292b');
    this.add.rectangle(960, 560, 1840, 880, 0x333b39).setStrokeStyle(6, 0xb49a77);
    this.add.text(100, 75, '첫 전투 — 철거 예정지의 수상한 남자', { fontFamily: 'sans-serif', fontSize: '48px', color: '#f6d9a5' });
    this.add.text(160, 260, '손대성', { fontFamily: 'sans-serif', fontSize: '40px', color: '#f5d466' });
    this.add.text(1410, 260, '수상한 남자', { fontFamily: 'sans-serif', fontSize: '40px', color: '#f5d6c9' });
    const p = this.add.graphics();
    p.fillStyle(0xe2bd38).fillRoundedRect(265, 385, 105, 190, 18);
    p.fillStyle(0xe9b991).fillCircle(317, 351, 55);
    p.fillStyle(0x282727).fillEllipse(317, 319, 115, 43);
    const e = this.add.graphics();
    e.fillStyle(0x55525b).fillRoundedRect(1480, 380, 130, 200, 20);
    e.fillStyle(0xc69b86).fillCircle(1545, 347, 58);
    e.fillStyle(0x252324).fillEllipse(1545, 318, 120, 45);
    this.status = this.add.text(130, 680, '', { fontFamily: 'sans-serif', fontSize: '34px', color: '#ffffff' });
    this.log = this.add.text(130, 770, '갑자기 남자가 길을 막아섰다. 싸움이라곤 해 본 적이 없다!', { fontFamily: 'sans-serif', fontSize: '29px', color: '#e8e0d0', wordWrap: { width: 1650 } });
    const labels = ['1 주먹질', '2 방어', '3 허세', '4 붕대'];
    labels.forEach((label, i) => {
      const x = 130 + i * 435;
      const button = this.add.text(x, 900, label, { fontFamily: 'sans-serif', fontSize: '34px', color: '#fff0cc', backgroundColor: '#525149', padding: { x: 24, y: 18 } }).setInteractive({ useHandCursor: true });
      button.on('pointerdown', () => this.act(i + 1));
      this.controls.push(button);
    });
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (this.ended) { if (event.key === 'Enter' || event.key === ' ') this.finish(); return; }
      const n = Number(event.key);
      if (n >= 1 && n <= 4) this.act(n);
    });
    this.add.text(130, GAME_HEIGHT - 55, '숫자 1~4 또는 버튼 클릭 · 승리 후 Enter로 탐험 복귀', { fontFamily: 'sans-serif', fontSize: '24px', color: '#b9b8ac' });
    this.refresh();
  }

  private act(choice: number): void {
    if (this.ended) return;
    this.guarding = choice === 2;
    let msg = '';
    if (choice === 1) { const damage = Phaser.Math.Between(14, 22); this.enemyHp = Math.max(0, this.enemyHp - damage); msg = `엉성한 주먹질! ${damage} 피해.`; }
    if (choice === 2) msg = '겁에 질려 몸을 웅크렸다. 이번 공격 피해 감소.';
    if (choice === 3) { const damage = Phaser.Math.Between(4, 13); this.enemyHp = Math.max(0, this.enemyHp - damage); msg = `허세로 상대를 흔들었다! ${damage} 피해.`; }
    if (choice === 4) { this.hp = Math.min(100, this.hp + 25); msg = '붕대를 감았다. 체력 회복.'; }
    if (this.enemyHp <= 0) { this.win(); return; }
    const damage = this.guarding ? Phaser.Math.Between(3, 7) : Phaser.Math.Between(9, 17);
    this.hp = Math.max(0, this.hp - damage);
    if (this.hp <= 0) {
      this.hp = 45; this.enemyHp = 90;
      msg += ' 상대에게 쓰러졌다! 가까스로 일어났다. 다시 시도하자.';
    } else msg += ` 상대의 반격! ${damage} 피해.`;
    this.log.setText(msg);
    this.refresh();
  }

  private win(): void {
    this.ended = true;
    this.enemyHp = 0;
    this.log.setText('상대가 도망쳤다! 첫 전투 승리. Enter 또는 Space로 돌아가자.');
    this.controls.forEach(c => c.setAlpha(0.4).disableInteractive());
    this.refresh();
  }

  private refresh(): void {
    this.status.setText(`손대성 HP ${this.hp}/100                                    상대 HP ${this.enemyHp}/90`);
  }

  private finish(): void {
    this.scene.stop();
    this.scene.wake('ExploreScene', { won: true });
  }
}
