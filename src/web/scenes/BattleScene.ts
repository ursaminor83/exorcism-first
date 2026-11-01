import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { SAVE_KEY, initialProgress, isProgress, type Hero } from '../../core/progression';
import { damage, defenseCounter, encounterEnemy, enemy, type EnemyDef } from '../../core/combat';
import { equipmentStats, useHealingItem, type Inventory, type Equipment } from '../../core/inventory';

/** Test-only speed and auto-battle controls for the episode-one prototype. */
export class BattleScene extends Phaser.Scene {
  private hp = 100;
  private scriptedLoss=false;
  private lost=false;
  private scriptedTurns=0;
  private encounterNumber=1;
  private returnScene = 'ExploreScene';
  private party: Hero[] = initialProgress().party;
  private partyInfo!: Phaser.GameObjects.Text;
  private enemyHp = 90;
  private enemyDef:EnemyDef=enemy('drunk')!;
  private regionId='kkachi';
  private inventory:Inventory={};
  private equipment:Equipment={};
  private maxEnemyHp=90;
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

  init(data?: {returnScene?:string;scriptedLoss?:boolean;encounterNumber?:number}):void { this.returnScene=data?.returnScene==='WorldScene'?'WorldScene':'ExploreScene';this.scriptedLoss=!!data?.scriptedLoss;this.lost=false;this.scriptedTurns=0;this.encounterNumber=data?.encounterNumber??1; }

  create(): void {
    try {const raw=localStorage.getItem(SAVE_KEY);const saved:unknown=raw?JSON.parse(raw):null;
      this.party=isProgress(saved)?saved.party.map(h=>({...h})):initialProgress().party;
      if(isProgress(saved)){this.regionId=saved.regionId;this.inventory={...(saved.inventory??{})};this.equipment={...(saved.equipment??{})};}
    }catch{this.party=initialProgress().party;}
    this.enemyDef=this.scriptedLoss?enemy('foreman')!:encounterEnemy(this.regionId);
    this.hp = this.party[0]?.hp??100; this.maxEnemyHp=this.enemyDef.hp;this.enemyHp=this.maxEnemyHp; this.guarding = false; this.ended = false;
    this.speed = 1; this.auto = false; this.controls = [];
    this.autoTimer?.remove(); this.autoTimer = undefined;
    this.cameras.main.setBackgroundColor('#23292b');
    this.add.rectangle(960, 560, 1840, 880, 0x333b39).setStrokeStyle(6, 0xb49a77);
    this.add.text(100, 75, this.scriptedLoss?(this.encounterNumber===2?'금요일 오후 — 다시 마주친 덩치':'첫 출근 — 용역 반장 덩치'):'골목의 시비', { fontFamily: 'sans-serif', fontSize: '48px', color: '#f6d9a5' });
    this.add.text(160, 260, '손대성', { fontFamily: 'sans-serif', fontSize: '40px', color: '#f5d466' });
    this.add.text(1410, 260, this.enemyDef.name, { fontFamily: 'sans-serif', fontSize: '40px', color: '#f5d6c9' });
    const p = this.add.graphics();
    p.fillStyle(0xe2bd38).fillRoundedRect(265, 385, 105, 190, 18);
    p.fillStyle(0xe9b991).fillCircle(317, 351, 55);
    p.fillStyle(0x282727).fillEllipse(317, 319, 115, 43);
    const e = this.add.graphics();
    e.fillStyle(0x55525b).fillRoundedRect(1480, 380, 130, 200, 20);
    e.fillStyle(0xc69b86).fillCircle(1545, 347, 58);
    e.fillStyle(0x252324).fillEllipse(1545, 318, 120, 45);
    this.partyInfo = this.add.text(130, 620, '', {fontFamily:'sans-serif',fontSize:'24px',color:'#e9d9a9'});
    this.status = this.add.text(130, 680, '', { fontFamily: 'sans-serif', fontSize: '34px', color: '#ffffff' });
    this.log = this.add.text(130, 770, this.scriptedLoss?(this.encounterNumber===2?'대성: 일당 못 받아서요.\n덩치: 또 맞으러 왔냐?':'할머니가 진흙탕에 넘어졌다. 대성이 덩치 앞을 가로막았다.'):'상대가 길을 막아섰다.', { fontFamily: 'sans-serif', fontSize: '29px', color: '#e8e0d0', wordWrap: { width: 1650 } });
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
    if(this.scriptedLoss)this.scriptedTurns++;
    let msg = '';
    if (choice === 1) { const dealt=damage(this.party[0].atk+equipmentStats(this.equipment).attack,this.enemyDef.def,Phaser.Math.FloatBetween(0.85,1.15),Math.random()<0.15); this.enemyHp = Math.max(0, this.enemyHp - dealt); msg = `주먹질! ${dealt} 피해.`; }
    if (choice === 2) msg = '겁에 질려 몸을 웅크렸다. 이번 공격 피해 감소.';
    if (choice === 3) { const dealt=damage(this.party[0].atk+3,this.enemyDef.def,Phaser.Math.FloatBetween(0.85,1.15)); this.enemyHp = Math.max(0, this.enemyHp - dealt); msg = `허세로 상대를 흔들었다! ${dealt} 피해.`; }
    if (choice === 4) { const used=useHealingItem(this.inventory,'bandage',this.hp,this.party[0].maxHp);if(used){this.inventory=used.bag;this.hp=used.hp;msg='붕대를 사용해 체력을 회복했다.';}else msg='사용할 붕대가 없거나 이미 체력이 가득 찼다.'; }
    if(this.returnScene==='WorldScene'&&!this.scriptedLoss){
      const allies=this.party.slice(1);
      const support=allies.reduce((sum,h)=>sum+Math.max(1,h.atk-Math.floor(5)),0);
      this.enemyHp=Math.max(0,this.enemyHp-support);
      msg+=' 동료 3명의 협공! '+support+' 피해.';
    }
    if (this.enemyHp <= 0) { if(this.scriptedLoss){this.enemyHp=1;msg+=' 상대는 쓰러지지 않는다.';}else{this.win();return;} }
    const taken=damage(this.enemyDef.atk,this.party[0].def+equipmentStats(this.equipment).defense,Phaser.Math.FloatBetween(0.85,1.15),Math.random()<0.15,this.guarding);
    this.hp = Math.max(0, this.hp - taken);
    if(this.guarding)this.enemyHp=Math.max(this.scriptedLoss?1:0,this.enemyHp-defenseCounter(taken));
    if(this.scriptedLoss && this.scriptedTurns>=7)this.hp=0;
    if (this.hp <= 0) {
      if(this.scriptedLoss){this.lost=true;this.ended=true;this.auto=false;this.autoTimer?.remove();this.log.setText('손대성이 덩치에게 쓰러졌다.\nEnter 또는 Space로 현장에 돌아간다.');this.refresh();return;}
      this.hp = 45; this.enemyHp = 90;
      msg += ' 상대에게 쓰러졌다! 가까스로 일어났다. 다시 시도하자.';
    } else msg += ` 상대의 반격! ${taken} 피해.`;
    this.log.setText(msg);
    this.refresh();
  }

  private win(): void {
    this.ended = true;
    this.auto = false;
    this.autoTimer?.remove(); this.autoTimer = undefined;
    this.enemyHp = 0;
    this.log.setText(this.enemyDef.name+'을 물리쳤다! Enter 또는 Space로 돌아가자.');
    this.controls.forEach(c => c.setAlpha(0.4).disableInteractive());
    this.refresh();
  }

  private refresh(): void {
    this.status.setText(`손대성 HP ${this.hp}/${this.party[0].maxHp}  붕대 ${this.inventory.bandage??0}개                     ${this.enemyDef.name} HP ${this.enemyHp}/${this.maxEnemyHp}`);
    this.partyInfo.setText(this.returnScene==='WorldScene'?(this.scriptedLoss?this.party.slice(0,1):this.party.slice(0,1)).map(h=>h.name+' Lv.'+h.level).join('  /  '):'');
    this.speedButton.setText(`속도 ${this.speed}배 [T]`);
    this.autoButton.setText(`위임 ${this.auto ? 'ON' : 'OFF'} [A]`);
    this.autoButton.setBackgroundColor(this.auto ? '#37684e' : '#4b514d');
    this.controls.forEach(c => c.setAlpha(this.auto || this.ended ? 0.4 : 1));
  }

  private finish(): void {
    this.autoTimer?.remove(); this.autoTimer = undefined;
    try{const raw=localStorage.getItem(SAVE_KEY);const saved:unknown=raw?JSON.parse(raw):null;if(isProgress(saved)){saved.inventory=this.inventory;saved.party[0].hp=Math.max(1,this.hp);localStorage.setItem(SAVE_KEY,JSON.stringify(saved));}}catch{/* save unavailable */}
    this.scene.stop();
    this.scene.wake(this.returnScene, { won: !this.lost, lost: this.lost });
  }
}
