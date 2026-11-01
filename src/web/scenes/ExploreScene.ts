import Phaser from 'phaser';
import { createInitialGameState, setPlayerPosition } from '../../core/GameState';
import type { GameState } from '../../core/types';
import { movePlayer, type RectObstacle, type WalkBounds } from '../../systems/MovementSystem';
import mapData from '../../data/maps/testVillage.json';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

const bounds: WalkBounds = mapData.bounds;
const obstacles: RectObstacle[] = mapData.obstacles;

export class ExploreScene extends Phaser.Scene {
  private state: GameState = createInitialGameState();
  private actor!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private layers: Phaser.GameObjects.Container[] = [];

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
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as typeof this.keys;
    this.add.text(45, 30, '퇴마는 처음이라', { fontFamily: 'sans-serif', fontSize: '48px', fontStyle: 'bold', color: '#fff2d3' }).setDepth(2000);
    this.add.text(48, 96, '2.5D 탐험 기술 검증 · 방향키 / WASD 이동', { fontFamily: 'sans-serif', fontSize: '24px', color: '#fff2d3' }).setDepth(2000);
    this.add.text(48, 1020, '원화 대신 임시 도형 사용 | 발 위치 기반 깊이 정렬 | 건물 충돌 테스트', { fontFamily: 'sans-serif', fontSize: '24px', color: '#fff2d3', backgroundColor: '#29342cb0', padding: { x: 12, y: 7 } }).setDepth(2000);
    this.refreshDepth();
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
    const x = Number(this.cursors.right.isDown || this.keys.D.isDown) - Number(this.cursors.left.isDown || this.keys.A.isDown);
    const y = Number(this.cursors.down.isDown || this.keys.S.isDown) - Number(this.cursors.up.isDown || this.keys.W.isDown);
    const result = movePlayer(this.state.playerPosition, { x, y }, Math.min(delta, 50) / 1000 * 290, bounds, obstacles, 22);
    this.state = setPlayerPosition(this.state, result.position);
    this.actor.setPosition(result.position.x, result.position.y);
    this.refreshDepth();
  }
}
