import Phaser from 'phaser';
import { advanceClock, clockLabel, remainingMinutes, initialClock, isClock, travelCost, BUILDING_ENTRY_MINUTES, CLOSE_INSPECTION_MINUTES, type ClockState } from '../../core/episodeClock';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { getRegion, START_REGION, travel, type Direction } from '../../core/world';
import { SAVE_KEY, encounterCheck, initialProgress, isProgress, rewardBattle, xpNeeded, type Progress } from '../../core/progression';
import { episode01Status, sitesIn, resolveDialogue, type Site } from '../../core/story';
import { currentQuest } from '../../core/quest';
import { addItem, buyItem, equip, equipmentStats, useHealingItem, item, type Inventory } from '../../core/inventory';

/** Playable graybox world: geometry and gameplay state are independent of final art. */
export class WorldScene extends Phaser.Scene {
  private regionId = 'home';
  private clock: ClockState = initialClock();
  private clockHud!: Phaser.GameObjects.Text;
  private endingShown = false;
  private doorCooldown = 0;
  private pendingBattle: 'first'|'second'|'final'|null=null;
  private readonly clockSaveKey = SAVE_KEY + '-clock';
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
  private readonly clueItems:Record<string,string>={ep01_boots:'red_boot',ep01_doll:'doll',ep01_drawing:'drawing',ep01_shaman:'fake_charm'};
  private interactKey!: Phaser.Input.Keyboard.Key;
  private dialogue!: Phaser.GameObjects.Text;
  private dialogueOpen = false;
  private dialoguePages:string[]=[];
  private dialogueIndex=0;
  private nearSite: Site | null = null;
  private questPanel!: Phaser.GameObjects.Text;
  private menuPanel!: Phaser.GameObjects.Text;
  private menuMode:'inventory'|'status'|null=null;
  private menuPage=0;
  constructor() { super('WorldScene'); }

  create(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keys = this.input.keyboard!.addKeys('W,A,S,D,M') as typeof this.keys;
    this.title = this.add.text(42, 24, '', {fontFamily:'sans-serif',fontSize:'36px',color:'#fff0c8'}).setDepth(100);
    this.hint = this.add.text(42, 78, 'WASD / 방향키 이동 · E 대화/조사 · 출구 이동 · M 기존 1화', {fontFamily:'sans-serif',fontSize:'23px',color:'#f5e5c9'}).setDepth(100);
    this.label = this.add.text(42, 1022, '', {fontFamily:'sans-serif',fontSize:'23px',color:'#fff0c8',backgroundColor:'#172123dd',padding:{x:10,y:6}}).setDepth(100);
    this.info = this.add.text(42, 120, '', {fontFamily:'sans-serif',fontSize:'24px',color:'#fff0c8',backgroundColor:'#182522cc',padding:{x:10,y:7}}).setDepth(100);
    this.clockHud = this.add.text(1280, 28, '', {fontFamily:'sans-serif',fontSize:'27px',color:'#fff0c8',backgroundColor:'#26302bef',padding:{x:14,y:10}}).setDepth(160);
    this.questPanel = this.add.text(26, 245, '', {fontFamily:'sans-serif',fontSize:'25px',color:'#fff4dc',backgroundColor:'#192428ed',padding:{x:18,y:20},wordWrap:{width:340},lineSpacing:13}).setDepth(110);
    this.menuPanel=this.add.text(420,170,'',{fontFamily:'sans-serif',fontSize:'29px',color:'#fff4dc',backgroundColor:'#172225f5',padding:{x:32,y:26},wordWrap:{width:1030},lineSpacing:10}).setDepth(230).setVisible(false);
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
    this.restoreClock();
    this.events.on('wake', (_scene: unknown, data: {won?:boolean;lost?:boolean;finalEncounter?:boolean}|undefined) => {
      try{const raw=localStorage.getItem(SAVE_KEY);const loaded:unknown=raw?JSON.parse(raw):null;if(isProgress(loaded)){this.progress.party=loaded.party;this.progress.inventory=loaded.inventory;this.progress.equipment=loaded.equipment;}}catch{/* preserve current progress */}
      if(data?.won&&data.finalEncounter&&this.pendingBattle==='final'){this.pendingBattle=null;if(!this.progress.flags.includes('ep01_final_battle'))this.progress.flags.push('ep01_final_battle');this.safeDistance=9999;this.save();this.showMessage('순이의 그림자가 빗속으로 사라졌다.\n대성: ……정말 끝난 건가?\n할머니에게 돌아가자.');}
      if(data?.won && this.pendingBattle===null&&!data.finalEncounter){this.progress=rewardBattle(this.progress);this.save();this.safeDistance=700;}
      if(data?.lost && this.pendingBattle&&this.pendingBattle!=='final'){this.progress.party[0].hp=this.progress.party[0].maxHp;const flag=this.pendingBattle==='first'?'ep01_first_battle':'ep01_second_battle';if(!this.progress.flags.includes(flag))this.progress.flags.push(flag);this.pendingBattle=null;if(flag==='ep01_second_battle'){this.clock=initialClock();}this.save();this.safeDistance=700;this.updateQuest();this.label.setText(episode01Status(this.progress.flags));}
      this.updateInfo();this.refreshClock();this.drawRegion();
      if(data?.lost&&!data.finalEncounter&&!this.pendingBattle){this.progress.party[0].hp=Math.max(1,Math.ceil(this.progress.party[0].maxHp*0.35));this.safeDistance=1500;this.save();this.showMessage('손대성이 가까스로 도망쳤다.\n체력을 회복하고 다시 도전하자.');}
      if(data?.lost&&data.finalEncounter){this.pendingBattle=null;this.progress.party[0].hp=this.progress.party[0].maxHp;this.save();this.showMessage('대성: 으아악! 잠깐, 잠깐!\n가까스로 현장에서 빠져나왔다. 다시 마음을 다잡고 들어가자.');}
      else if(data?.lost&&this.progress.flags.includes('ep01_first_battle')){this.showMessage(this.progress.flags.includes('ep01_second_battle')?'폭우가 쏟아졌다. 작업은 중단됐다.\n할머니가 쓰러진 대성을 발견하고 집으로 데려갔다.\n할머니: 내가 대신 줄 테니, 몸 다치게 나서지 마.':'대표: 내일이 마지막입니다.\n용역들이 철수했다. 할머니가 떨어뜨린 사진이 진흙 위에 남아 있다.');}
    });
    this.input.keyboard!.on('keydown-F5', (e:KeyboardEvent)=>{e.preventDefault();this.save();});
    this.input.keyboard!.on('keydown-L', ()=>this.load());
    this.input.keyboard!.on('keydown-I', ()=>this.toggleMenu('inventory'));
    this.input.keyboard!.on('keydown-C', ()=>this.toggleMenu('status'));
    this.input.keyboard!.on('keydown-ESC', ()=>this.closeMenu());
    this.input.keyboard!.on('keydown-Q', ()=>this.changeMenuPage(-1));
    this.input.keyboard!.on('keydown-R', ()=>this.changeMenuPage(1));
    this.input.keyboard!.on('keydown-ONE', ()=>this.useInventoryItem(0));
    this.input.keyboard!.on('keydown-TWO', ()=>this.useInventoryItem(1));
    this.input.keyboard!.on('keydown-THREE', ()=>this.useInventoryItem(2));
    this.input.keyboard!.on('keydown-FOUR', ()=>this.useInventoryItem(3));
    this.input.keyboard!.on('keydown-FIVE', ()=>this.useInventoryItem(4));
    this.input.keyboard!.on('keydown-B', ()=>this.buySupplies());
    this.input.keyboard!.on('keydown-K', ()=>this.equipWeapon());
    this.drawRegion();
    this.updateInfo();
    this.refreshClock();
  }

  private restoreClock():void {
    try { const raw=localStorage.getItem(this.clockSaveKey); const value:unknown=raw?JSON.parse(raw):null; this.clock=isClock(value)?value:initialClock(); }
    catch { this.clock=initialClock(); }
  }
  private refreshClock():void {
    if(!this.clockHud)return;
    const left=remainingMinutes(this.clock);
    this.clockHud.setText(!this.progress.flags.includes('ep01_second_battle')?'첫 출근 · 철거 일정 확인 중':clockLabel(this.clock)+'  |  철거까지 '+Math.floor(left/60)+'시간 '+left%60+'분');
    if(this.clock.ending==='success' && !this.endingShown){
      this.endingShown=true;
      this.showMessage('GOOD END — 순이의 흔적\n\n할머니는 마지막으로 딸의 물건을 품에 안았다.\n대성은 철거 전에 공사 기록의 불일치를 알렸다.\n순이의 사연은 더 이상 잊히지 않는다.\n\n1화 완료');
    }
    if(this.clock.ending==='demolition' && !this.endingShown) {
      this.endingShown=true;
      this.showMessage('월요일 오전 10시. 굴삭기가 할머니의 집을 무너뜨렸다.\n순이의 사건은 미궁으로 남았다.\n\nBAD END — 철거\n새 게임으로 다시 도전해 주세요.');
    }
  }
  private spendTime(minutes:number):boolean {
    if(this.clock.ending!=='none')return false;
    if(!this.progress.flags.includes('ep01_second_battle'))return true;
    this.clock=advanceClock(this.clock,minutes);
    this.refreshClock();
    this.save();
    return this.clock.ending==='none';
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
      if(this.regionId==='kkachi' && i===1)return; // one open demolition compound replaces the northeast block
      this.walls.push(new Phaser.Geom.Rectangle(b.x,b.y,b.w,b.h));
      add(this.add.rectangle(b.x+b.w/2,b.y+b.h/2,b.w,b.h,i%2?0x777d82:0x9a9184).setStrokeStyle(5,0x292c2e).setDepth(5));
      add(this.add.text(b.x+18,b.y+16,(this.regionId==='kkachi' ? ['빈 상가','철거 구역','낡은 셋방','용역 사무실'][i] : region.landmarks[i%region.landmarks.length]),{fontFamily:'sans-serif',fontSize:'25px',color:'#fff9e8',backgroundColor:'#292d2daa',padding:{x:8,y:5}}).setDepth(6));
    });
    if(this.regionId==='kkachi') {
      // One fenced demolition site, with the grandmother's occupied house INSIDE it.
      const zone=this.add.graphics().setDepth(4);
      zone.fillStyle(0x9b8b72,1).fillRect(1120,140,620,290);
      zone.lineStyle(7,0x6e5743).strokeRect(1120,140,620,290);
      zone.fillStyle(0x696761).fillRect(1160,170,145,105);
      zone.fillStyle(0x817c70).fillRect(1160,170,145,15);
      zone.fillStyle(0x555049).fillRect(1340,160,100,80);
      zone.fillStyle(0xd2b58b).fillRect(1470,195,225,135);
      zone.fillStyle(0x5c4640).fillPoints([{x:1445,y:197},{x:1580,y:125},{x:1720,y:197}],true);
      zone.fillStyle(0x49423c).fillRect(1565,265,45,65);
      zone.lineStyle(3,0xe8c68a).strokeRect(1470,195,225,135);
      add(zone);
      add(this.add.text(1135,150,'철거 구역 — 출입 통제',{fontFamily:'sans-serif',fontSize:'25px',color:'#fff1ce',backgroundColor:'#523c2ce0',padding:{x:8,y:5}}).setDepth(22));
      add(this.add.text(1585,210,'할머니 집 · 철거 거부',{fontFamily:'sans-serif',fontSize:'22px',color:'#fff5d9',backgroundColor:'#43382bcf',padding:{x:6,y:4}}).setOrigin(0.5).setDepth(22));
    }
    for(const site of sitesIn(this.regionId)){
      if(site.id==='home_exit'||site.id==='house')continue;
      if(site.id==='boots'&&!this.progress.flags.includes('ep01_shaman'))continue;
      if((site.id==='doll'||site.id==='drawing')&&!this.progress.flags.includes('ep01_shaman'))continue;
      if(site.id==='album'&&!this.progress.flags.includes('ep01_grandma'))continue;
      if(site.id==='sleep'&&(!this.progress.flags.includes('ep01_album')||this.progress.flags.includes('ep01_next_day')))continue;
      if(site.id==='foreman_tools'&&!this.progress.flags.includes('ep01_first_battle'))continue;

      if(site.id==='puddle'&&(!this.progress.flags.includes('ep01_payment')||this.progress.flags.includes('ep01_puddle')))continue; // doors are spatial triggers, not E interaction circles
      const color=site.type==='npc'?0x61b8c1:site.type==='clue'?0xf2c230:0xd1a36b;
      add(this.add.circle(site.x,site.y,24,color).setStrokeStyle(4,0x24292a).setDepth(20));
      add(this.add.text(site.x,site.y-57,site.name,{fontFamily:'sans-serif',fontSize:'24px',color:'#ffffff',backgroundColor:'#26302ad9',padding:{x:9,y:5}}).setOrigin(0.5).setDepth(21));
    }
    const gates: {dir:Direction,x:number,y:number}[]=[
      {dir:'north',x:960,y:65},{dir:'south',x:960,y:1005},
      {dir:'west',x:65,y:540},{dir:'east',x:1855,y:540}
    ];
    if(isHome) {
      add(this.add.rectangle(960,925,220,65,0x3d715b).setStrokeStyle(4,0xdceccf).setDepth(10));
      add(this.add.text(960,925,'골목으로 나가기 →',{fontFamily:'sans-serif',fontSize:'23px',color:'#ffffff'}).setOrigin(0.5).setDepth(11));
    } else if(this.regionId==='kkachi') {
      add(this.add.rectangle(665,735,170,75,0x3d715b).setStrokeStyle(4,0xdceccf).setDepth(10));
      add(this.add.text(665,735,'대성의 집 ↳',{fontFamily:'sans-serif',fontSize:'22px',color:'#ffffff'}).setOrigin(0.5).setDepth(11));
    }
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

  private inventoryIds():string[]{return Object.entries(this.progress.inventory??{}).filter(([,n])=>n>0).map(([id])=>id);}
  private toggleMenu(mode:'inventory'|'status'):void {
    if(this.dialogueOpen||this.clock.ending!=='none')return;
    if(this.menuMode===mode){this.closeMenu();return;}
    this.menuMode=mode;this.menuPage=0;this.renderMenu();
  }
  private closeMenu():void {this.menuMode=null;this.menuPanel.setVisible(false);}
  private changeMenuPage(dir:number):void {if(this.menuMode!=='inventory')return;const pages=Math.max(1,Math.ceil(this.inventoryIds().length/5));this.menuPage=(this.menuPage+dir+pages)%pages;this.renderMenu();}
  private useInventoryItem(index:number):void {
    if(this.menuMode!=='inventory'||this.clock.ending!=='none')return;
    const id=this.inventoryIds()[this.menuPage*5+index];if(!id)return;
    const def=item(id);if(!def)return;
    if(def.kind==='equipment'){
      const next=equip(this.progress.inventory??{},this.progress.equipment??{},id);
      if(next){this.progress.equipment=next;this.save();this.renderMenu();this.updateInfo();}return;
    }
    if(def.kind==='consumable'){
      const hero=this.progress.party[0];
      const used=useHealingItem(this.progress.inventory??{},id,hero.hp,hero.maxHp);
      if(used){this.progress.inventory=used.bag;hero.hp=used.hp;this.save();this.renderMenu();this.updateInfo();}return;
    }
  }
  private renderMenu():void {
    if(!this.menuMode)return;
    const hero=this.progress.party[0];
    if(this.menuMode==='status'){
      const stats=equipmentStats(this.progress.equipment??{});
      const xp=xpNeeded(hero.level);
      const eq=this.progress.equipment??{};
      this.menuPanel.setText('손대성 · 상태창 [C / ESC 닫기]\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n레벨 '+hero.level+'   경험치 '+hero.xp+' / '+xp+'\nHP '+hero.hp+' / '+hero.maxHp+'\n공격력 '+hero.atk+' + '+stats.attack+'   방어력 '+hero.def+' + '+stats.defense+'\n전투 승리 '+this.progress.wins+'회   소지금 '+this.progress.gold+'원\n\n장비\n무기: '+(item(eq.weapon??'')?.name??'없음')+'\n방어구: '+(item(eq.armor??'')?.name??'없음')+'\n부적: '+(item(eq.charm??'')?.name??'없음')+'\n\nI 인벤토리 · C 닫기');
    }else{
      const ids=this.inventoryIds();const pages=Math.max(1,Math.ceil(ids.length/5));this.menuPage=Math.min(this.menuPage,pages-1);
      const lines=ids.slice(this.menuPage*5,this.menuPage*5+5).map((id,i)=>{const d=item(id)!;const equipped=Object.values(this.progress.equipment??{}).includes(id)?' [장착]':'';return (i+1)+'. '+d.name+' ×'+this.progress.inventory![id]+equipped+'\n    '+d.description+(d.kind==='evidence'?' [단서]':'');});
      this.menuPanel.setText('소지품 · 인벤토리 [I / ESC 닫기]\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n'+(lines.join('\n\n')||'소지품 없음')+'\n\n[1~5] 소비 아이템 사용 / 장비 장착\n[Q / R] 페이지 '+(this.menuPage+1)+' / '+pages+'\n[C] 상태창 · 소지금 '+this.progress.gold+'원');
    }
    this.menuPanel.setVisible(true);
  }
  private showInventory():void {
    const bag=this.progress.inventory??{};const lines=Object.entries(bag).filter(([,n])=>n>0).map(([id,n])=>(item(id)?.name??id)+' ×'+n);
    this.showMessage('소지품\n'+(lines.join('\n')||'비어 있음')+'\n\n장비: '+Object.values(this.progress.equipment??{}).map(id=>item(id)?.name??id).join(', '));
  }
  private buySupplies():void {
    if(this.regionId!=='market'){this.showMessage('물건은 재래시장에서 구입할 수 있다.');return;}
    const result=buyItem(this.progress.inventory??{},this.progress.gold,'bandage');
    if(!result){this.showMessage('붕대 가격 500원. 돈이 부족하다.');return;}
    this.progress.inventory=result.bag;this.progress.gold=result.gold;this.save();this.updateInfo();this.showMessage('붕대 1개를 500원에 구입했다.');
  }
  private equipWeapon():void {
    const bag=this.progress.inventory??{};const owned=['stick','gloves'].find(id=>(bag[id]??0)>0);
    if(!owned){this.showMessage('장착할 무기가 없다.');return;}
    const next=equip(bag,this.progress.equipment??{},owned);if(next){this.progress.equipment=next;this.save();this.showMessage((item(owned)?.name??owned)+' 장착 완료.');}
  }
  private updateInfo():void {
    if(!this.info)return;
    const h=this.progress.party[0];
    this.info.setText('전투 '+this.progress.wins+'승 · '+this.progress.gold+'원 · 손대성 Lv.'+h.level+' XP '+h.xp+' · I 인벤토리 / C 상태 / B 구매 / K 장비 / F5 저장 / L 불러오기');
  }
  private save():void {
    this.progress={...this.progress,regionId:this.regionId,x:this.player.x,y:this.player.y};
    try{localStorage.setItem(SAVE_KEY,JSON.stringify(this.progress));localStorage.setItem(this.clockSaveKey,JSON.stringify(this.clock));}catch{this.info.setText('저장 실패: 브라우저 저장 공간 확인');}
  }
  private load():void {
    try{const raw=localStorage.getItem(SAVE_KEY);const data:unknown=raw?JSON.parse(raw):null;
      if(!isProgress(data))return;
      this.progress=data;this.restoreClock();this.endingShown=false;this.regionId=data.flags.includes('intro_home')?data.regionId:'home';this.player.setPosition(data.x,data.y);this.drawRegion();this.updateInfo();this.refreshClock();
    }catch{this.info.setText('저장 데이터 읽기 실패');}
  }
  private interact(site:Site):void {
    if(this.clock.ending!=='none')return;
    if(site.id==='home_exit'){
      if(!this.progress.flags.includes('intro_home')){this.showMessage('어머니에게 먼저 인사하고 출근하자.');return;}
      if(!this.spendTime(travelCost(this.regionId,'kkachi')))return;
      this.regionId='kkachi';this.player.setPosition(960,540);this.drawRegion();this.save();return;
    }
    if(site.id==='house') {if(!this.spendTime(BUILDING_ENTRY_MINUTES))return;this.regionId='home';this.player.setPosition(960,540);this.drawRegion();this.save();return;}
    if(site.id==='haunted'){
      if(this.progress.flags.includes('ep01_final_ready')&&!this.progress.flags.includes('ep01_final_battle')){this.pendingBattle='final';this.save();this.scene.launch('BattleScene',{returnScene:'WorldScene',finalEncounter:true});this.scene.sleep();return;}
      if(!this.progress.flags.includes('intro_office')){this.showMessage('먼저 용역 사무실에서 배정을 받자.');return;}
      if(!this.progress.flags.includes('ep01_first_battle'))this.pendingBattle='first';
      else if(this.progress.flags.includes('ep01_next_day')&&!this.progress.flags.includes('ep01_second_battle')){this.pendingBattle='second';}
      else {this.showMessage('철거 현장이다. 지금은 작업이 멈춰 있다.');return;}
      this.save();this.scene.launch('BattleScene',{returnScene:'WorldScene',scriptedLoss:true,encounterNumber:this.pendingBattle==='second'?2:1});this.scene.sleep();return;
    }
    if(site.flag==='intro_office'&&!this.progress.flags.includes('intro_home')){this.showMessage('먼저 집에서 출발해야 한다.');return;}
    const result=resolveDialogue(site,this.progress.flags);
    if(!result.available)return;
    if(result.grantFlag==='ep01_shaman' && this.progress.gold<50000){this.showMessage('대성: 오만 원…… 할머니가 주신 돈은 어디 갔지?');return;}
    if(site.type==='clue' && result.grantFlag) { if(!this.spendTime(CLOSE_INSPECTION_MINUTES))return; }
    this.openDialogue(site.name,result.lines);
    if(result.grantFlag&&!this.progress.flags.includes(result.grantFlag)){
      this.progress={...this.progress,flags:[...this.progress.flags,result.grantFlag],gold:result.grantFlag==='ep01_shaman'?this.progress.gold-50000:this.progress.gold};
      if(result.grantFlag==='ep01_next_day')this.player.setPosition(960,690);
      if(result.grantFlag==='ep01_payment')this.progress.gold+=50000;
      const clue=this.clueItems[result.grantFlag];if(clue)this.progress.inventory=addItem(this.progress.inventory??{},clue);
      if(result.grantFlag==='ep01_tools'){this.progress.inventory=addItem(this.progress.inventory??{},'stick');this.progress.inventory=addItem(this.progress.inventory??{},'gloves');}
      if(result.grantFlag==='ep01_resolved'){this.clock={...this.clock,ending:'success'};this.save();this.refreshClock();}
      this.label.setText(episode01Status(this.progress.flags)+' · E 조사/대화');
      this.updateQuest();
      this.save();this.drawRegion();
    }
  }
  private openDialogue(title:string,lines:readonly string[]):void {
    this.dialoguePages=lines.length?lines.map(line=>title+'\n\n'+line):[title];
    this.dialogueIndex=0;this.dialogueOpen=true;this.renderDialogue();
  }
  private renderDialogue():void {
    this.dialogue.setText(this.dialoguePages[this.dialogueIndex]+'\n\n[E] '+(this.dialogueIndex+1<this.dialoguePages.length?'다음 ▶':'닫기')).setVisible(true);
  }
  private nextDialogue():void {
    if(++this.dialogueIndex<this.dialoguePages.length)this.renderDialogue();
    else {this.dialogueOpen=false;this.dialogue.setVisible(false);}
  }
  private showMessage(message:string):void {
    this.openDialogue('이벤트',message.split('\n').filter(Boolean));
  }
  update(_time:number,delta:number): void {
    if(this.clock.ending!=='none') { if(this.dialogueOpen && Phaser.Input.Keyboard.JustDown(this.interactKey))this.nextDialogue(); return; }
    if(this.dialogueOpen){if(Phaser.Input.Keyboard.JustDown(this.interactKey))this.nextDialogue();return;}
    if(this.menuMode)return;
    this.doorCooldown=Math.max(0,this.doorCooldown-delta);
    if(this.doorCooldown===0 && this.regionId==='home' && this.progress.flags.includes('intro_home') && Math.hypot(this.player.x-960,this.player.y-925)<85){
      if(!this.spendTime(travelCost('home','kkachi')))return;
      this.regionId='kkachi';this.player.setPosition(780,740);this.doorCooldown=1200;this.drawRegion();this.save();return;
    }
    if(this.doorCooldown===0 && this.regionId==='kkachi' && Math.hypot(this.player.x-665,this.player.y-735)<78){
      if(!this.spendTime(BUILDING_ENTRY_MINUTES))return;
      this.regionId='home';this.player.setPosition(960,690);this.doorCooldown=1200;this.drawRegion();this.save();return;
    }
    const candidates=sitesIn(this.regionId).filter(site=>site.id!=='house'&&site.id!=='home_exit'&&!(site.id==='boots'&&!this.progress.flags.includes('ep01_shaman'))&&!( (site.id==='doll'||site.id==='drawing')&&!this.progress.flags.includes('ep01_shaman'))&&!(site.id==='album'&&!this.progress.flags.includes('ep01_grandma'))&&!(site.id==='sleep'&&(!this.progress.flags.includes('ep01_album')||this.progress.flags.includes('ep01_next_day')))&&!(site.id==='foreman_tools'&&!this.progress.flags.includes('ep01_first_battle'))&&!(site.id==='puddle'&&(!this.progress.flags.includes('ep01_payment')||this.progress.flags.includes('ep01_puddle'))));
    this.nearSite=candidates.filter(site=>Math.hypot(site.x-this.player.x,site.y-this.player.y)<105).sort((a,b)=>Math.hypot(a.x-this.player.x,a.y-this.player.y)-Math.hypot(b.x-this.player.x,b.y-this.player.y))[0]??null;
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
      if(this.regionId!=='home'&&!this.progress.flags.includes('ep01_final_ready')&&this.progress.flags.includes('ep01_second_battle')&&this.safeDistance===0&&encounterCheck(this.progress.steps,getRegion(this.regionId)!.kind,Math.random())){
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
        if(!this.spendTime(travelCost(this.regionId,next)))return;
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
