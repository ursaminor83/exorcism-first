import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getRegion, START_REGION, travel, type Direction } from '../../core/world';
import { SAVE_KEY, encounterCheck, initialProgress, isProgress, rewardBattle, type Progress } from '../../core/progression';
import { episode01Status, sitesIn, type Site } from '../../core/story';
import { currentQuest } from '../../core/quest';

/** Playable graybox world: geometry and gameplay state are independent of final art. */
export class WorldScene extends Phaser.Scene {
  private regionId = 'home';
  private progress: Progress = initialProgress();
  private encounterDistance = 0;
  private safeDistance = 0;
  private info!: Phaser.GameObjects.Text;
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<'W'|'A'|'S'|'D'|'M', Phaser.Input.Keyboard.Key>;
  private scenery: Phaser.GameObjects.GameObject[] = [];
  private walls: Phaser.Geom.Rectangle[] = [];
  private title!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;
  private label!: Phaser.GameObjects.Text;
  private readonly speed = 320;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private dialogue!: Phaser.GameObjects.Text;
  private dialogueOpen = false;
  private nearSite: Site | null = null;
  private questPanel!: Phaser.GameObjects.Text;
  constructor() { super('WorldScene'); }

  create(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keys = this.input.keyboard!.addKeys('W,A,S,D,M') as typeof this.keys;
    this.title = this.add.text(42, 24, '', {fontFamily:'sans-serif',fontSize:'36px',color:'#fff0c8'}).setDepth(100);
    this.hint = this.add.text(42, 78, 'WASD / 방향키 이동 · E 대화/조사 · 출구 이동 · M 기존 1화', {fontFamily:'sans-serif',fontSize:'23px',color:'#f5e5c9'}).setDepth(100);
    this.label = this.add.text(42, 1022, '', {fontFamily:'sans-serif',fontSize:'23px',color:'#fff0c8',backgroundColor:'#172123dd',padding:{x:10,y:6}}).setDepth(100);
    this.info = this.add.text(42, 120, '', {fontFamily:'sans-serif',fontSize:'24px',color:'#fff0c8',backgroundColor:'#182522cc',padding:{x:10,y:7}}).setDepth(100);
    this.questPanel = this.add.text(26, 245, '', {fontFamily:'sans-serif',fontSize:'25px',color:'#fff4dc',backgroundColor:'#192428ed',padding:{x:18,y:20},wordWrap:{width:340},lineSpacing:13}).setDepth(110);
    this.dialogue = this.add.text(200, 775, '', {fontFamily:'sans-serif',fontSize:'30px',color:'#fff2d8',backgroundColor:'#1c2526f5',padding:{x:28,y:24},wordWrap:{width:1440}}).setDepth(200).setVisible(false);
    this.player = this.add.rectangle(960, 540, 38, 48, 0xf2c230).setStrokeStyle(4,0x171b1d).setDepth(90);
    try {
      const raw=localStorage.getItem(SAVE_KEY);
      const saved:unknown=raw?JSON.parse(raw):null;
      if(isProgress(saved)) {
        this.progress=saved;
        if(saved.flags.includes('intro_home')) {this.regionId=saved.regionId;this.player.setPosition(saved.x,saved.y);}
      }
    }catch { /* invalid save: start at home */ }
    this.events.on('wake', (_scene: unknown, data: {won?:boolean}|undefined) => {
      if(data?.won){this.progress=rewardBattle(this.progress);if(!this.progress.flags.includes('ep01_first_battle'))this.progress.flags.push('ep01_first_battle');this.save();this.safeDistance=700;}
      this.updateInfo();
    });
    this.input.keyboard!.on('keydown-F5', (e:KeyboardEvent)=>{e.preventDefault();this.save();});
    this.input.keyboard!.on('keydown-L', ()=>this.load());
    this.drawRegion();
    this.updateInfo();
  }

  private drawRegion(): void {
    for (const item of this.scenery) item.destroy();
    this.scenery = [];
    this.walls = [];
    const isHome=this.regionId==='home';
    const region = getRegion(isHome?START_REGION:this.regionId)!;
    const ground = isHome ? 0x77766f : region.kind === 'safe' ? 0x6d8977 : region.kind === 'mixed' ? 0x8c876e : 0x666f71;
    this.cameras.main.setBackgroundColor(ground);
    const add = (object: Phaser.GameObjects.GameObject): void => { this.scenery.push(object); };
    const road = this.add.graphics().setDepth(0);
    if(isHome){road.fillStyle(0xb5a68e).fillRect(460,165,1100,750);road.lineStyle(8,0x534c45).strokeRect(460,165,1100,750);}
    else road.fillStyle(0xc8b99c).fillRect(0, 448, GAME_WIDTH, 190).fillRect(840, 0, 240, GAME_HEIGHT);
    add(road);
    const blocks = [
      {x:160,y:175,w:400,h:200},{x:1360,y:165,w:380,h:210},
      {x:160,y:755,w:400,h:185},{x:1360,y:755,w:380,h:185}
    ];
    if(!isHome)blocks.forEach((b,i)=>{
      this.walls.push(new Phaser.Geom.Rectangle(b.x,b.y,b.w,b.h));
      add(this.add.rectangle(b.x+b.w/2,b.y+b.h/2,b.w,b.h,i%2?0x777d82:0x9a9184).setStrokeStyle(5,0x292c2e).setDepth(5));
      add(this.add.text(b.x+18,b.y+16,region.landmarks[i%region.landmarks.length],{fontFamily:'sans-serif',fontSize:'25px',color:'#fff9e8',backgroundColor:'#292d2daa',padding:{x:8,y:5}}).setDepth(6));
    });
    for(const site of sitesIn(this.regionId)){
      const color=site.type==='npc'?0x61b8c1:site.type==='clue'?0xf2c230:0xd1a36b;
      add(this.add.circle(site.x,site.y,24,color).setStrokeStyle(4,0x24292a).setDepth(20));
      add(this.add.text(site.x,site.y-57,site.name,{fontFamily:'sans-serif',fontSize:'24px',color:'#ffffff',backgroundColor:'#26302ad9',padding:{x:9,y:5}}).setOrigin(0.5).setDepth(21));
    }
    const gates: {dir:Direction,x:number,y:number}[]=[
      {dir:'north',x:960,y:65},{dir:'south',x:960,y:1005},
      {dir:'west',x:65,y:540},{dir:'east',x:1855,y:540}
    ];
    if(!isHome)gates.forEach(g=>{
      const destination = travel(this.regionId,g.dir);
      if (!destination) return;
      add(this.add.rectangle(g.x,g.y,g.dir==='east'||g.dir==='west'?85:230,g.dir==='east'||g.dir==='west'?200:80,0x3d715b,0.9).setStrokeStyle(4,0xdceccf).setDepth(10));
      add(this.add.text(g.x,g.y,getRegion(destination)!.name,{fontFamily:'sans-serif',fontSize:'20px',color:'#ffffff',backgroundColor:'#23382dcc',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(11));
    });
    this.title.setText(isHome?'1998년 여름 · 손대성의 집':'까치골 · '+region.name+'  ['+region.kind+']');
    this.label.setText(episode01Status(this.progress.flags)+' · E 조사/대화');
    this.updateQuest();
    this.updateInfo();
  }

  private updateQuest():void {
    if(!this.questPanel)return;
    const q=currentQuest(this.progress.flags);
    this.questPanel.setText('현재 퀘스트\n────────────\n'+q.title+'\n\n'+q.objective+'\n\n목표 지역: '+(q.region==='home'?'손대성의 집':getRegion(q.region)?.name??q.region)+'\n\n[E] 대화 / 조사');
  }

  private blocked(x:number,y:number): boolean {
    const radius=22;
    return this.walls.some(w=>Phaser.Geom.Rectangle.Overlaps(new Phaser.Geom.Rectangle(x-radius,y-radius,radius*2,radius*2),w));
  }

  private updateInfo():void {
    if(!this.info)return;
    const h=this.progress.party[0];
    this.info.setText('전투 '+this.progress.wins+'승 · '+this.progress.gold+'원 · 손대성 Lv.'+h.level+' XP '+h.xp+' · F5 저장 / L 불러오기');
  }
  private save():void {
    this.progress={...this.progress,regionId:this.regionId,x:this.player.x,y:this.player.y};
    try{localStorage.setItem(SAVE_KEY,JSON.stringify(this.progress));}catch{this.info.setText('저장 실패: 브라우저 저장 공간 확인');}
  }
  private load():void {
    try{const raw=localStorage.getItem(SAVE_KEY);const data:unknown=raw?JSON.parse(raw):null;
      if(!isProgress(data))return;
      this.progress=data;this.regionId=data.flags.includes('intro_home')?data.regionId:'home';this.player.setPosition(data.x,data.y);this.drawRegion();this.updateInfo();
    }catch{this.info.setText('저장 데이터 읽기 실패');}
  }
  private interact(site:Site):void {
    const q=currentQuest(this.progress.flags);
    if(site.id==='home_exit'){
      if(!this.progress.flags.includes('intro_home')){this.showMessage('어머니에게 먼저 인사하고 출근하자.');return;}
      this.regionId='kkachi';this.player.setPosition(960,540);this.drawRegion();this.save();return;
    }
    if(site.id==='house') {this.regionId='home';this.player.setPosition(960,540);this.drawRegion();this.save();return;}
    if(site.id==='haunted'){
      if(q.target!=='폐가 진입로'){this.showMessage('아직 폐가에 들어갈 때가 아니다. 현재 퀘스트를 먼저 진행하자.');return;}
      this.save();this.scene.launch('BattleScene',{returnScene:'WorldScene'});this.scene.sleep();return;
    }
    if(site.flag==='intro_office'&&!this.progress.flags.includes('intro_home')){this.showMessage('먼저 집에서 출발해야 한다.');return;}
    if(site.flag==='ep01_grandma'&&!this.progress.flags.includes('intro_office')){this.showMessage('먼저 용역 사무실에서 업무 지시를 받아야 한다.');return;}
    this.dialogueOpen=true;
    this.dialogue.setText(site.name+'\n\n'+site.lines.join('\n')+'\n\n[E] 닫기').setVisible(true);
    if(site.flag&&!this.progress.flags.includes(site.flag)){
      this.progress={...this.progress,flags:[...this.progress.flags,site.flag]};
      this.label.setText(episode01Status(this.progress.flags)+' · E 조사/대화');
      this.updateQuest();
      this.save();
    }
  }
  private showMessage(message:string):void {
    this.dialogueOpen=true;this.dialogue.setText(message+'\n\n[E] 닫기').setVisible(true);
  }
  update(_time:number,delta:number): void {
    if(this.dialogueOpen){if(Phaser.Input.Keyboard.JustDown(this.interactKey)){this.dialogueOpen=false;this.dialogue.setVisible(false);}return;}
    this.nearSite=sitesIn(this.regionId).find(site=>Math.hypot(site.x-this.player.x,site.y-this.player.y)<125)??null;
    if(this.nearSite&&Phaser.Input.Keyboard.JustDown(this.interactKey)){this.interact(this.nearSite);return;}
    if (Phaser.Input.Keyboard.JustDown(this.keys.M)) { this.scene.start('ExploreScene'); return; }
    const x=Number(this.cursors.right.isDown||this.keys.D.isDown)-Number(this.cursors.left.isDown||this.keys.A.isDown);
    const y=Number(this.cursors.down.isDown||this.keys.S.isDown)-Number(this.cursors.up.isDown||this.keys.W.isDown);
    if (!x&&!y) return;
    const beforeX=this.player.x, beforeY=this.player.y;
    const length=Math.hypot(x,y);
    const step=this.speed*Math.min(delta,50)/1000;
    const nx=Phaser.Math.Clamp(this.player.x+x/length*step,15,GAME_WIDTH-15);
    const ny=Phaser.Math.Clamp(this.player.y+y/length*step,15,GAME_HEIGHT-15);
    if (!this.blocked(nx,this.player.y)) this.player.x=nx;
    if (!this.blocked(this.player.x,ny)) this.player.y=ny;
    const moved=Math.hypot(this.player.x-beforeX,this.player.y-beforeY);
    this.encounterDistance+=moved;this.safeDistance=Math.max(0,this.safeDistance-moved);
    if(this.encounterDistance>=80){
      this.encounterDistance=0;this.progress.steps++;
      if(this.regionId!=='home'&&this.progress.flags.includes('intro_office')&&this.safeDistance===0&&encounterCheck(this.progress.steps,getRegion(this.regionId)!.kind,Math.random())){
        this.save();this.scene.launch('BattleScene',{returnScene:'WorldScene'});this.scene.sleep();return;
      }
    }
    const p=this.player;
    let direction:Direction|null=null;
    if (p.y<110 && p.x>840 && p.x<1080) direction='north';
    else if (p.y>970 && p.x>840 && p.x<1080) direction='south';
    else if (p.x<110 && p.y>440 && p.y<640) direction='west';
    else if (p.x>1810 && p.y>440 && p.y<640) direction='east';
    if (direction && this.regionId!=='home') {
      const next=travel(this.regionId,direction);
      if(next) {
        this.regionId=next;
        const spawn:Record<Direction,{x:number,y:number}>={
          north:{x:960,y:905},south:{x:960,y:175},
          east:{x:175,y:540},west:{x:1745,y:540}
        };
        p.setPosition(spawn[direction].x,spawn[direction].y);
        this.drawRegion();
        this.save();
      }
    }
  }
}
