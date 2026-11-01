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
  private readonly targets = [
    { id: 'grandma', x: 1100, y: 720, label: '대화', range: 135 },
    { id: 'notice', x: 760, y: 690, label: '조사', range: 135 }
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
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as typeof this.keys;
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.nextKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.add.text(45, 30, '퇴마는 처음이라', { fontFamily: 'sans-serif', fontSize: '48px', fontStyle: 'bold', color: '#fff2d3' }).setDepth(2000);
    this.add.text(48, 96, '2.5D 탐험 기술 검증 · 방향키 / WASD 이동', { fontFamily: 'sans-serif', fontSize: '24px', color: '#fff2d3' }).setDepth(2000);
    this.add.text(48, 1020, '원화 대신 임시 도형 사용 | 발 위치 기반 깊이 정렬 | 건물 충돌 테스트', { fontFamily: 'sans-serif', fontSize: '24px', color: '#fff2d3', backgroundColor: '#29342cb0', padding: { x: 12, y: 7 } }).setDepth(2000);
    this.createDialogueUI();
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
    return this.targets.find(t => Math.hypot(t.x - pos.x, t.y - pos.y) <= t.range);
  }

  private beginInteraction(id: string): void {
    const lines = id === 'grandma' ? dialogues.grandma : dialogues.notice;
    if (id === 'notice') this.acquiredClues.add('notice_red_writing');
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
      this.hint.setText(`E ${target.label}`);
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
