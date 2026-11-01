import Phaser from 'phaser';
import { createInitialGameState, setPlayerPosition } from '../../core/GameState';
import type { GameState } from '../../core/types';
import { movePlayer, type RectObstacle, type WalkBounds } from '../../systems/MovementSystem';
import mapData from '../../data/maps/testVillage.json';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import dialogues from '../../data/dialogues/intro.json';

const bounds: WalkBounds = mapData.bounds;
const obstacles: RectObstacle[] = mapData.obstacles;

export class ExploreScene extends Phaser.Scene {
  private state: GameState = createInitialGameState();
  private actor!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private layers: Phaser.GameObjects.Container[] = [];
  private interactKey!: Phaser.Input.Keyboard.Key;
  private nextKey!: Phaser.Input.Keyboard.Key;
  private hint!: Phaser.GameObjects.Text;
  private dialogBox!: Phaser.GameObjects.Container;
  private dialogName!: Phaser.GameObjects.Text;
  private dialogText!: Phaser.GameObjects.Text;
  private currentLines: { speaker: string; text: string }[] | null = null;
  private lineIndex = 0;
  private acquiredClues = new Set<string>();
  private journalOpen = false;
  private journal!: Phaser.GameObjects.Container;
  private journalText!: Phaser.GameObjects.Text;
  private journalKey!: Phaser.Input.Keyboard.Key;
  private objective!: Phaser.GameObjects.Text;
  private battleReady = false;
  private readonly targets = [
    { id: 'grandma', x: 1100, y: 720, label: '대화', range: 135 },
    { id: 'notice', x: 760, y: 690, label: '조사', range: 135 },
    { id: 'relic', x: 1480, y: 790, label: '조사', range: 135 },
    { id: 'gate', x: 960, y: 445, label: '진입', range: 160 }
  ];

  constructor() { super('ExploreScene'); }

  create(): void {
    this.state = setPlayerPosition(createInitialGameState(), mapData.spawn);
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT).setScroll(0, 0);
    const backdrop = this.add.graphics();
    backdrop.fillGradientStyle(0x263f45, 0x263f45, 0x9ba38b, 0x9ba38b).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    backdrop.fillStyle(0x657d72).fillEllipse(960, 380, 1850, 350);
    backdrop.fillStyle(0x7e9279).fillRect(0, 370, GAME_WIDTH, 710);
    backdrop.fillStyle(0xb6a58a).fillPoints([{x:720,y:370},{x:1190,y:370},{x:1780,y:1080},{x:150,y:1080}], true);
    for (let i = 0; i < 23; i++) {
      const x = 85 + (i * 137) % 1740;
      const y = 610 + (i * 79) % 390;
      backdrop.fillStyle(i % 2 ? 0x9c977d : 0x9a8d73, 0.55).fillEllipse(x, y, 55, 12);
    }
    this.addHouse(260, 475, 350, 125, 0xb8a08b, 0x554f56);
    this.addHouse(1310, 425, 355, 145, 0xb8ad93, 0x555b58);
    this.addHouse(805, 355, 300, 100, 0xa69a81, 0x55504a);
    this.actor = this.makeActor();
    this.addGrandma();
    this.addNotice();
    this.addRelic();
    this.addGate();
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as typeof this.keys;
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.nextKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.journalKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.input.keyboard!.on('keydown-ESC', () => { if (this.journalOpen) this.toggleJournal(); });
    this.add.text(45, 30, '퇴마는 처음이라', { fontFamily: 'sans-serif', fontSize: '48px', fontStyle: 'bold', color: '#fff2d3' }).setDepth(2000);
    this.add.text(48, 96, '1998년 · 까치골 철거 예정지 · 방향키/WASD 이동 · E 조사 · J 사건 수첩', { fontFamily: 'sans-serif', fontSize: '24px', color: '#fff2d3' }).setDepth(2000);
    this.add.text(48, 1020, '원화 대신 임시 도형 사용 | 발 위치 기반 깊이 정렬 | 건물 충돌 테스트', { fontFamily: 'sans-serif', fontSize: '24px', color: '#fff2d3', backgroundColor: '#29342cb0', padding: { x: 12, y: 7 } }).setDepth(2000);
    this.createDialogueUI();
    this.createJournal();
    this.objective = this.add.text(48, 165, '', { fontFamily: 'sans-serif', fontSize: '28px', color: '#fff3d5', backgroundColor: '#202a2bdd', padding: { x: 15, y: 10 } }).setDepth(2500);
    this.updateObjective();
    this.events.on('wake', (_scene: unknown, data: { won?: boolean } | undefined) => {
      if (data?.won) { this.acquiredClues.add('first_battle'); this.updateObjective(); this.beginInteraction('victory'); }
    });
    this.refreshDepth();
  }

  private addGrandma(): void {
    const g = this.add.graphics();
    g.fillStyle(0x382d2d).fillEllipse(0, -83, 38, 22);
    g.fillStyle(0xe3b7a0).fillCircle(0, -66, 18);
    g.fillStyle(0xc77891).fillRoundedRect(-24, -50, 48, 40, 8);
    g.fillStyle(0x544b60).fillRect(-19, -12, 16, 18).fillRect(3, -12, 16, 18);
    const npc = this.add.container(1100, 720, [g]);
    npc.setDepth(720);
  }

  private addNotice(): void {
    const g = this.add.graphics();
    g.fillStyle(0x534b3d).fillRect(-42, -85, 84, 75);
    g.fillStyle(0xe5d8b9).fillRect(-35, -78, 70, 58);
    g.fillStyle(0x8c4843).fillRect(-23, -65, 46, 7);
    g.lineStyle(3, 0x5d5a4e).lineBetween(-22, -43, 22, -43);
    const notice = this.add.container(760, 690, [g]);
    notice.setDepth(690);
  }

  private addRelic(): void {
    const g = this.add.graphics();
    g.fillStyle(0x302c2a).fillEllipse(0, -3, 90, 22);
    g.fillStyle(0x7c6655).fillRoundedRect(-29, -38, 58, 35, 7);
    g.fillStyle(0xc0a376).fillCircle(0, -30, 9);
    this.add.container(1480, 790, [g]).setDepth(790);
  }

  private addGate(): void {
    const g = this.add.graphics();
    g.lineStyle(9, 0x6e5147).strokeRect(-70, -90, 140, 90);
    g.lineStyle(5, 0xc0a179).lineBetween(-50, -60, 50, -60);
    this.add.container(960, 445, [g]).setDepth(445);
    this.add.text(960, 320, '폐가 진입로', { fontFamily: 'sans-serif', fontSize: '25px', color: '#f7e5ca', backgroundColor: '#272422b9' }).setOrigin(0.5).setDepth(1500);
  }

  private createJournal(): void {
    const panel = this.add.rectangle(960, 530, 1360, 810, 0x1b2329, 0.98).setStrokeStyle(5, 0xd4b77c);
    const title = this.add.text(365, 175, '사건 수첩 — 1998년 까치골', { fontFamily: 'sans-serif', fontSize: '45px', color: '#f3d189', fontStyle: 'bold' });
    this.journalText = this.add.text(365, 275, '', { fontFamily: 'sans-serif', fontSize: '34px', color: '#f4f0e8', lineSpacing: 20, wordWrap: { width: 1180 } });
    const footer = this.add.text(365, 860, 'J 또는 ESC: 닫기', { fontFamily: 'sans-serif', fontSize: '26px', color: '#c8bba3' });
    this.journal = this.add.container(0, 0, [panel, title, this.journalText, footer]).setDepth(5000).setVisible(false);
  }

  private toggleJournal(): void {
    this.journalOpen = !this.journalOpen;
    this.journal.setVisible(this.journalOpen);
    if (this.journalOpen) {
      const rows = [
        ['grandma_warning', '철거민 할머니의 경고'],
        ['notice_red_writing', '붉은 글씨가 적힌 철거 안내문'],
        ['relic_mark', '수상한 물건에 새겨진 문양'],
        ['first_battle', '폐가에서 살아남았다']
      ];
      this.journalText.setText(rows.map(([id, label]) => `${this.acquiredClues.has(id) ? '●' : '○'}  ${label}`).join('\n\n'));
    }
  }

  private updateObjective(): void {
    const clues = ['grandma_warning', 'notice_red_writing', 'relic_mark'];
    const found = clues.filter(id => this.acquiredClues.has(id)).length;
    this.battleReady = found === 3;
    this.objective?.setText(this.acquiredClues.has('first_battle')
      ? '사건 1 완료 · J 사건 수첩 확인'
      : this.battleReady ? '단서 3/3 · 중앙 폐가 진입로로 가자'
      : `사건 1: 철거 예정지의 소문 · 단서 ${found}/3 · J 사건 수첩`);
  }

  private createDialogueUI(): void {
    this.hint = this.add.text(0, 0, '', {
      fontFamily: 'sans-serif', fontSize: '25px', color: '#fff2d3',
      backgroundColor: '#27302fe8', padding: { x: 14, y: 8 }
    }).setOrigin(0.5, 1).setDepth(3000).setVisible(false);
    const panel = this.add.rectangle(960, 907, 1780, 258, 0x1d2428, 0.96)
      .setStrokeStyle(4, 0xd2b98b);
    this.dialogName = this.add.text(120, 809, '', {
      fontFamily: 'sans-serif', fontSize: '32px', fontStyle: 'bold', color: '#f1c75d'
    });
    this.dialogText = this.add.text(120, 867, '', {
      fontFamily: 'sans-serif', fontSize: '30px', color: '#f4f0e8',
      wordWrap: { width: 1650 }, lineSpacing: 10
    });
    const help = this.add.text(1770, 997, 'E / SPACE 다음', {
      fontFamily: 'sans-serif', fontSize: '22px', color: '#c9c0ad'
    }).setOrigin(1, 0.5);
    this.dialogBox = this.add.container(0, 0, [panel, this.dialogName, this.dialogText, help])
      .setDepth(4000).setVisible(false);
  }

  private nearestTarget(): typeof this.targets[number] | undefined {
    const pos = this.state.playerPosition;
    return [...this.targets].filter(t => Math.hypot(t.x - pos.x, t.y - pos.y) <= t.range)
      .sort((a, b) => Math.hypot(a.x - pos.x, a.y - pos.y) - Math.hypot(b.x - pos.x, b.y - pos.y))[0];
  }

  private beginInteraction(id: string): void {
    if (id === 'gate' && this.battleReady && !this.acquiredClues.has('first_battle')) {
      this.scene.launch('BattleScene');
      this.scene.sleep();
      return;
    }
    const lines: { speaker: string; text: string }[] = id === 'grandma' ? dialogues.grandma : id === 'notice' ? dialogues.notice : id === 'relic' ? [
      { speaker: '조사', text: '먼지 쌓인 상자 속에서 기묘한 문양이 새겨진 물건을 발견했다.' },
      { speaker: '손대성', text: '이건... 무림비급? 아니, 왜 이렇게 차갑지?' },
      { speaker: '단서 획득', text: '수상한 문양을 사건 수첩에 기록했다.' }
    ] : id === 'victory' ? [
      { speaker: '손대성', text: '사, 살았다! 무공이 통했다기보다... 운이 좋았던 건가?' },
      { speaker: '사건 기록', text: '폐가에서 벌어진 첫 싸움. 이것은 시작에 불과했다.' }
    ] : [{ speaker: '손대성', text: this.acquiredClues.has('first_battle') ? '여긴 다시 들어가고 싶지 않아.' : '단서가 더 필요해. J를 눌러 수첩을 보자.' }];
    if (id === 'grandma') this.acquiredClues.add('grandma_warning');
    if (id === 'notice') this.acquiredClues.add('notice_red_writing');
    if (id === 'relic') this.acquiredClues.add('relic_mark');
    this.updateObjective();
    this.currentLines = lines;
    this.lineIndex = 0;
    this.dialogBox.setVisible(true);
    this.hint.setVisible(false);
    this.showLine();
  }

  private showLine(): void {
    const line = this.currentLines?.[this.lineIndex];
    if (!line) {
      this.currentLines = null;
      this.dialogBox.setVisible(false);
      return;
    }
    this.dialogName.setText(line.speaker);
    this.dialogText.setText(line.text);
  }

  private addHouse(x: number, y: number, width: number, height: number, wall: number, roof: number): void {
    const g = this.add.graphics();
    g.fillStyle(0x283c31, 0.35).fillEllipse(width / 2, height + 18, width + 100, 48);
    g.fillStyle(wall).fillRect(0, -125, width, height + 125);
    g.lineStyle(5, 0x50483f).strokeRect(0, -125, width, height + 125);
    g.fillStyle(roof).fillPoints([{x:-45,y:-120},{x:width/2,y:-250},{x:width+45,y:-120},{x:width,y:-95},{x:0,y:-95}], true);
    g.fillStyle(0x3d403b).fillRect(width * 0.42, -60, width * 0.17, 60);
    g.fillStyle(0x5d6e6b).fillRect(width * 0.12, -72, 60, 48);
    const house = this.add.container(x, y, [g]);
    house.setData('sortY', y + height);
    this.layers.push(house);
  }

  private makeActor(): Phaser.GameObjects.Container {
    const shadow = this.add.ellipse(0, -2, 55, 15, 0x202b29, 0.45);
    const body = this.add.graphics();
    body.fillStyle(0x2e302e).fillRect(-15, -32, 12, 30).fillRect(4, -32, 12, 30);
    body.fillStyle(0xe5c044).fillRoundedRect(-25, -94, 50, 66, 12);
    body.lineStyle(4, 0x262b29).strokeRoundedRect(-25, -94, 50, 66, 12);
    body.fillStyle(0xe4b999).fillCircle(0, -112, 21);
    body.fillStyle(0x2a2826).fillEllipse(0, -125, 46, 23);
    return this.add.container(this.state.playerPosition.x, this.state.playerPosition.y, [shadow, body]);
  }

  private refreshDepth(): void {
    for (const layer of this.layers) layer.setDepth(layer.getData('sortY') as number);
    this.actor.setDepth(this.state.playerPosition.y);
  }

  update(_time: number, delta: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.journalKey) && !this.currentLines) this.toggleJournal();
    if (this.journalOpen) return;
    if (this.currentLines) {
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.nextKey)) {
        this.lineIndex += 1;
        this.showLine();
      }
      return;
    }
    const target = this.nearestTarget();
    this.hint.setVisible(Boolean(target));
    if (target) {
      this.hint.setText(target.id === 'gate' && !this.battleReady ? 'E 진입로 확인' : `E ${target.label}`);
      this.hint.setPosition(target.x, target.y - 105);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.beginInteraction(target.id);
        return;
      }
    }
    const x = Number(this.cursors.right.isDown || this.keys.D.isDown) - Number(this.cursors.left.isDown || this.keys.A.isDown);
    const y = Number(this.cursors.down.isDown || this.keys.S.isDown) - Number(this.cursors.up.isDown || this.keys.W.isDown);
    const result = movePlayer(this.state.playerPosition, { x, y }, Math.min(delta, 50) / 1000 * 290, bounds, obstacles, 22);
    this.state = setPlayerPosition(this.state, result.position);
    this.actor.setPosition(result.position.x, result.position.y);
    this.refreshDepth();
  }
}
