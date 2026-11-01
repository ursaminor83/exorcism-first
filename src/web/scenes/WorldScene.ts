import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getRegion, START_REGION, travel, type Direction } from '../../core/world';

/** Playable graybox world: geometry and gameplay state are independent of final art. */
export class WorldScene extends Phaser.Scene {
  private regionId = START_REGION;
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<'W'|'A'|'S'|'D'|'M', Phaser.Input.Keyboard.Key>;
  private scenery: Phaser.GameObjects.GameObject[] = [];
  private walls: Phaser.Geom.Rectangle[] = [];
  private title!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;
  private label!: Phaser.GameObjects.Text;
  private readonly speed = 320;
  constructor() { super('WorldScene'); }

  create(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D,M') as typeof this.keys;
    this.title = this.add.text(42, 24, '', {fontFamily:'sans-serif',fontSize:'36px',color:'#fff0c8'}).setDepth(100);
    this.hint = this.add.text(42, 78, 'WASD / 방향키 이동 · 가장자리 출구로 이동 · M: 기존 1화 화면', {fontFamily:'sans-serif',fontSize:'23px',color:'#f5e5c9'}).setDepth(100);
    this.label = this.add.text(42, 1022, '', {fontFamily:'sans-serif',fontSize:'23px',color:'#fff0c8',backgroundColor:'#172123dd',padding:{x:10,y:6}}).setDepth(100);
    this.player = this.add.rectangle(960, 540, 38, 48, 0xf2c230).setStrokeStyle(4,0x171b1d).setDepth(90);
    this.drawRegion();
  }

  private drawRegion(): void {
    for (const item of this.scenery) item.destroy();
    this.scenery = [];
    this.walls = [];
    const region = getRegion(this.regionId)!;
    const ground = region.kind === 'safe' ? 0x6d8977 : region.kind === 'mixed' ? 0x8c876e : 0x666f71;
    this.cameras.main.setBackgroundColor(ground);
    const add = (object: Phaser.GameObjects.GameObject): void => { this.scenery.push(object); };
    const road = this.add.graphics().setDepth(0);
    road.fillStyle(0xc8b99c).fillRect(0, 448, GAME_WIDTH, 190).fillRect(840, 0, 240, GAME_HEIGHT);
    add(road);
    const blocks = [
      {x:160,y:175,w:400,h:200},{x:1360,y:165,w:380,h:210},
      {x:160,y:755,w:400,h:185},{x:1360,y:755,w:380,h:185}
    ];
    blocks.forEach((b,i)=>{
      this.walls.push(new Phaser.Geom.Rectangle(b.x,b.y,b.w,b.h));
      add(this.add.rectangle(b.x+b.w/2,b.y+b.h/2,b.w,b.h,i%2?0x777d82:0x9a9184).setStrokeStyle(5,0x292c2e).setDepth(5));
      add(this.add.text(b.x+18,b.y+16,region.landmarks[i%region.landmarks.length],{fontFamily:'sans-serif',fontSize:'25px',color:'#fff9e8',backgroundColor:'#292d2daa',padding:{x:8,y:5}}).setDepth(6));
    });
    const gates: {dir:Direction,x:number,y:number}[]=[
      {dir:'north',x:960,y:65},{dir:'south',x:960,y:1005},
      {dir:'west',x:65,y:540},{dir:'east',x:1855,y:540}
    ];
    gates.forEach(g=>{
      const destination = travel(this.regionId,g.dir);
      if (!destination) return;
      add(this.add.rectangle(g.x,g.y,g.dir==='east'||g.dir==='west'?85:230,g.dir==='east'||g.dir==='west'?200:80,0x3d715b,0.9).setStrokeStyle(4,0xdceccf).setDepth(10));
      add(this.add.text(g.x,g.y,getRegion(destination)!.name,{fontFamily:'sans-serif',fontSize:'20px',color:'#ffffff',backgroundColor:'#23382dcc',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(11));
    });
    this.title.setText('까치시 · '+region.name+'  ['+region.kind+']');
    this.label.setText('임시 도형 월드 | '+region.landmarks.join(' · '));
  }

  private blocked(x:number,y:number): boolean {
    const radius=22;
    return this.walls.some(w=>Phaser.Geom.Rectangle.Overlaps(new Phaser.Geom.Rectangle(x-radius,y-radius,radius*2,radius*2),w));
  }

  update(_time:number,delta:number): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.M)) { this.scene.start('ExploreScene'); return; }
    const x=Number(this.cursors.right.isDown||this.keys.D.isDown)-Number(this.cursors.left.isDown||this.keys.A.isDown);
    const y=Number(this.cursors.down.isDown||this.keys.S.isDown)-Number(this.cursors.up.isDown||this.keys.W.isDown);
    if (!x&&!y) return;
    const length=Math.hypot(x,y);
    const step=this.speed*Math.min(delta,50)/1000;
    const nx=Phaser.Math.Clamp(this.player.x+x/length*step,15,GAME_WIDTH-15);
    const ny=Phaser.Math.Clamp(this.player.y+y/length*step,15,GAME_HEIGHT-15);
    if (!this.blocked(nx,this.player.y)) this.player.x=nx;
    if (!this.blocked(this.player.x,ny)) this.player.y=ny;
    const p=this.player;
    let direction:Direction|null=null;
    if (p.y<110 && p.x>840 && p.x<1080) direction='north';
    else if (p.y>970 && p.x>840 && p.x<1080) direction='south';
    else if (p.x<110 && p.y>440 && p.y<640) direction='west';
    else if (p.x>1810 && p.y>440 && p.y<640) direction='east';
    if (direction) {
      const next=travel(this.regionId,direction);
      if(next) {
        this.regionId=next;
        const spawn:Record<Direction,{x:number,y:number}>={
          north:{x:960,y:905},south:{x:960,y:175},
          east:{x:175,y:540},west:{x:1745,y:540}
        };
        p.setPosition(spawn[direction].x,spawn[direction].y);
        this.drawRegion();
      }
    }
  }
}
