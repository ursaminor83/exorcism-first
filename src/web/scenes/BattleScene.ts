import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/** Test-only speed and auto-battle controls for the episode-one prototype. */
export class BattleScene extends Phaser.Scene {
  private hp = 100;
  private enemyHp = 90;
  private guarding = false;
  private ended = false;
  private speed: 1 | 2 = 1;
  private auto = false;
  private autoTimer?: Phaser.Time.TimerEvent;
  private status!: Phaser.GameObjects.Text;
  private log!: Phaser.GameObjects.Text;
  private speedButton!: Phaser.GameObjects.Text;
  private autoButton!: Phaser.GameObjects.Text;
  private controls: Phaser.GameObjects.Text[] = [];

  constructor() { super('BattleScene'); }

  create(): void {
    this.hp = 100; this.enemyHp = 90; this.guarding = false; this.ended = false;
    this.speed = 1; this.auto = false; this.controls = [];
    this.autoTimer?.remove(); this.autoTimer = undefined;
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
      button.on('pointerdown', () => { if (!this.auto) this.act(i + 1); });
      this.controls.push(button);
    });
    this.speedButton = this.add.text(1280, 165, '', {fontFamily:'sans-serif',fontSize:'27px',color:'#fff0cc',backgroundColor:'#4b514d',padding:{x:18,y:12}})
      .setInteractive({useHandCursor:true}).on('pointerdown', () => this.toggleSpeed());
    this.autoButton = this.add.text(1530, 165, '', {fontFamily:'sans-serif',fontSize:'27px',color:'#fff0cc',backgroundColor:'#4b514d',padding:{x:18,y:12}})
      .setInteractive({useHandCursor:true}).on('pointerdown', () => this.toggleAuto());
    this.input.keyboard!.on('keydown', this.onKeyDown, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.autoTimer?.remove(); this.autoTimer = undefined;
      this.input.keyboard?.off('keydown', this.onKeyDown, this);
    });
    this.add.text(130, GAME_HEIGHT - 55, '1~4 행동 · T 2배속 · A 위임 전투 · 승리 후 Enter 복귀', { fontFamily: 'sans-serif', fontSize: '24px', color: '#b9b8ac' });
    this.refresh();
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this.ended) {
      if (event.key === 'Enter' || event.key === ' ') this.finish();
      return;
    }
    if (event.key.toLowerCase() === 't') { this.toggleSpeed(); return; }
    if (event.key.toLowerCase() === 'a') { this.toggleAuto(); return; }
    if (this.auto) return;
    const n = Number(event.key);
    if (n >= 1 && n <= 4) this.act(n);
  }

  private toggleSpeed(): void {
    if (this.ended) return;
    this.speed = this.speed === 1 ? 2 : 1;
    if (this.auto) this.scheduleAuto();
    this.refresh();
  }

  private toggleAuto(): void {
    if (this.ended) return;
    this.auto = !this.auto;
    if (this.auto) this.scheduleAuto();
    else { this.autoTimer?.remove(); this.autoTimer = undefined; }
    this.refresh();
  }

  private scheduleAuto(): void {
    this.autoTimer?.remove();
    if (!this.auto || this.ended) return;
    this.autoTimer = this.time.addEvent({
      delay: 900 / this.speed,
      loop: true,
      callback: () => {
        if (!this.auto || this.ended) return;
        // Heal when critically injured; otherwise use the reliable basic attack.
        this.act(this.hp <= 35 ? 4 : 1);
      }
    });
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
    this.auto = false;
    this.autoTimer?.remove(); this.autoTimer = undefined;
    this.enemyHp = 0;
    this.log.setText('상대가 도망쳤다! 첫 전투 승리. Enter 또는 Space로 돌아가자.');
    this.controls.forEach(c => c.setAlpha(0.4).disableInteractive());
    this.refresh();
  }

  private refresh(): void {
    this.status.setText(`손대성 HP ${this.hp}/100                                    상대 HP ${this.enemyHp}/90`);
    this.speedButton.setText(`속도 ${this.speed}배 [T]`);
    this.autoButton.setText(`위임 ${this.auto ? 'ON' : 'OFF'} [A]`);
    this.autoButton.setBackgroundColor(this.auto ? '#37684e' : '#4b514d');
    this.controls.forEach(c => c.setAlpha(this.auto || this.ended ? 0.4 : 1));
  }

  private finish(): void {
    this.autoTimer?.remove(); this.autoTimer = undefined;
    this.scene.stop();
    this.scene.wake('ExploreScene', { won: true });
  }
}
