/** Authorable scene content, separate from graybox geometry and rendering. */
export interface Site { id:string; region:string; name:string; x:number; y:number; type:'npc'|'clue'|'place'; lines:readonly string[]; flag?:string; requires?:readonly string[] }
export const EP01_FLAGS=['ep01_first_battle','ep01_grandma','ep01_album','ep01_second_battle','ep01_puddle','ep01_grandma_story','ep01_shaman'] as const;
export const SITES:readonly Site[]=[
 {id:'mother',region:'home',name:'어머니',x:1180,y:535,type:'npc',flag:'intro_home',lines:['어머니: 대성아! 첫 출근부터 늦겠다! 얼른 일어나!','손대성: 아악! 등짝은 왜 때려! 오늘부터 철거 용역 나간다니까!','어머니: 말만 무림고수면 뭐 해. 일당 받아서 밥값부터 보태!','손대성: 알았어요! 출근합니다, 출근!']},
 {id:'home_exit',region:'home',name:'집 밖으로',x:960,y:870,type:'place',lines:['낡은 셋방 문을 열고 까치골 골목으로 나간다.']},
 {id:'house',region:'kkachi',name:'대성의 집',x:660,y:740,type:'place',lines:['손대성이 사는 낡은 셋방이다.']},
 {id:'haunted',region:'kkachi',name:'철거 현장',x:1290,y:410,type:'place',lines:['철거 예정지의 폐가 입구. 문틈에서 서늘한 기운이 느껴진다.']},
 {id:'grandma',region:'kkachi',name:'철거민 할머니',x:1535,y:360,type:'npc',flag:'ep01_grandma',lines:['할머니: 그 집은 건드리지 말아라. 아직 거기 기다리는 애가 있어.','손대성: 애요? 철거는 내일부터라던데요.','할머니: 비가 많이 오던 날, 빨간 장화를 신은 아이가 있었지.']},
 {id:'album',region:'kkachi',name:'할머니 집 사진첩',x:1655,y:345,type:'clue',lines:[]},
 {id:'puddle',region:'kkachi',name:'마당의 빗물',x:1395,y:450,type:'clue',lines:[]},
 {id:'notice',region:'kkachi',name:'철거 안내문',x:1200,y:385,type:'clue',flag:'ep01_notice',lines:['조사: 철거 공고의 날짜가 몇 차례 덧칠되어 있다.','손대성: 누가 급하게 공사를 밀어붙인 것 같은데?']},
 {id:'boots',region:'kkachi',name:'담장 아래',x:1460,y:405,type:'clue',flag:'ep01_boots',lines:['조사: 마른 흙 위에 작은 장화 자국이 남아 있다.','손대성: 발자국이... 집 안으로 이어지는데?']},
 {id:'agency',region:'kkachi',name:'철거 용역 사무실',x:1250,y:700,type:'place',flag:'intro_office',lines:['용역 반장: 너 오늘부터 일하는 손대성이지? 늦었잖아!','손대성: 아닙니다! 아직 출근 시간 1분 전입니다!','용역 반장: 말대꾸 말고 철거지에 가서 할머니부터 설득해.','손대성: (첫날부터 왜 이런 일을 시키는 거야...)']},
 {id:'church',region:'church',name:'까치골 성당',x:1240,y:350,type:'place',lines:['붉은 벽돌 성당. 사제관과 작은 마당이 이어져 있다.']},
 {id:'shrine',region:'forest',name:'산 아래 신당',x:680,y:350,type:'place',lines:['오색천이 매달린 커다란 나무 옆에 오래된 당집이 있다.','안쪽에서는 방울 소리가 들리는 듯하지만 아무도 보이지 않는다.']},
 {id:'tree',region:'forest',name:'오색천 큰 나무',x:1240,y:350,type:'clue',lines:['낡은 오색천이 바람도 없는데 흔들린다.','나무 아래에는 누군가 최근 놓고 간 제물이 있다.']},
 {id:'fake',region:'market',name:'사오정의 점집',x:680,y:350,type:'npc',lines:['사오정: 관상이 아주 안 좋으시네. 액막이 부적 하나 어때요?','손대성: 이거 그냥 빨간 종이에 낙서한 거 아니에요?','사오정: 쉿. 남들이 듣잖아!']},
 {id:'soup',region:'market',name:'국밥집',x:1240,y:350,type:'place',lines:['시장 사람들의 소문이 모이는 국밥집이다.','주인: 요새 철거지 쪽에 밤마다 이상한 소리가 난다더라.']},
 {id:'pawn',region:'oldtown',name:'흥신소 겸 전당포',x:680,y:350,type:'npc',lines:['주팔복: 물건만 맡기는 곳이 아냐. 사람 찾는 일도 해.','주팔복: 오래된 물건은 거짓말을 안 하지. 사람은 몰라도.']},
 {id:'inn',region:'oldtown',name:'낡은 여관',x:1240,y:350,type:'place',lines:['방명록 일부가 찢겨 있다. 최근 투숙객들의 행방이 묘연하다.']},
 {id:'grave',region:'temple',name:'공동묘지',x:680,y:350,type:'place',lines:['오래된 묘비들 사이로 새로 파헤친 흙이 보인다.']},
 {id:'cult',region:'cult',name:'교단 무료 급식소',x:680,y:350,type:'npc',lines:['봉사자: 어려운 분들은 누구나 환영합니다.','벽에는 교단 집회 날짜가 적힌 안내문이 붙어 있다.']},
 {id:'school',region:'outskirts',name:'외곽 폐교',x:680,y:350,type:'place',lines:['폐교 운동장에 작은 발자국들이 남아 있다.']},
 {id:'construction',region:'newtown',name:'재개발 회사',x:680,y:350,type:'place',lines:['건물 앞에 철거 예정지의 지번이 적힌 서류가 쌓여 있다.']},
 {id:'drain',region:'sewer',name:'복개 수로 출구',x:680,y:350,type:'place',lines:['철창 너머로 물소리가 들린다. 하천 쪽으로 이어지는 것 같다.']},
 {id:'factory',region:'industrial',name:'폐공장',x:680,y:350,type:'place',lines:['가동을 멈춘 공장. 누군가 드나든 흔적이 있다.']},
 {id:'slum',region:'riverside',name:'강변 판자촌',x:680,y:350,type:'place',lines:['한강 둔치의 판자촌. 주민들이 낯선 사람을 경계한다.']},
 {id:'boat',region:'ferry',name:'폐유람선',x:680,y:350,type:'place',lines:['녹슨 폐유람선이 나루터에 묶여 있다.']},
 {id:'sealed',region:'final',name:'봉쇄된 시설',x:680,y:350,type:'place',lines:['두꺼운 철문이 잠겨 있다. 아직 이곳의 비밀을 풀 단서가 부족하다.']}
];
/** Dialogue is resolved at interaction time, not permanently attached to a map marker. */
export interface DialogueResult { lines:readonly string[]; grantFlag?:string; available:boolean }
const has=(flags:readonly string[],flag:string)=>flags.includes(flag);
export function resolveDialogue(site:Site,flags:readonly string[]):DialogueResult {
 const done=site.flag?has(flags,site.flag):false;
 switch(site.id){
 case 'mother':return has(flags,'intro_home')?{available:true,lines:['어머니: 밥은 먹었냐?','대성: 아직요.']}:{available:true,grantFlag:'intro_home',lines:['어머니: 언제까지 집에서 뒹굴 거야?','대성: 일하러 나간다니까요!','어머니: 그럼 얼른 나가!']};
 case 'agency':return !has(flags,'intro_home')?{available:true,lines:['오늘은 아직 출근할 준비가 안 됐다.']}:done?{available:true,lines:['직원: 배정받은 현장으로 가.']}:{available:true,grantFlag:'intro_office',lines:['직원: 손대성? 철거 현장으로 가. 일당은 오만 원.','대성: 철거요?','직원: 가서 반장 찾으면 돼.']};
 case 'grandma':
  if(!has(flags,'ep01_first_battle'))return {available:true,lines:['할머니: 여기서 뭐 하는 거야? 위험하니 비켜.']};
  if(!has(flags,'ep01_grandma'))return {available:true,grantFlag:'ep01_grandma',lines:['대성: 이 사진, 아까 떨어뜨리셨어요.','할머니: ……고맙다. 밥이라도 먹고 가.']};
  if(!has(flags,'ep01_second_battle'))return {available:true,lines:['할머니: 조심해서 다녀. 괜히 또 나서지 말고.']};
  if(!has(flags,'ep01_puddle'))return {available:true,lines:['할머니: 비가 많이 오는구나. 다친 데는 괜찮아?']};
  if(!has(flags,'ep01_grandma_story'))return {available:true,grantFlag:'ep01_grandma_story',lines:['대성: 할머니, 사진 속 아이요. 아까 마당에서 본 것 같아요.','할머니: ……그럴 리가.','대성: 네?','할머니: 죽었어. 오래전에.','할머니: 그때도 이렇게 비가 왔었는데……','할머니: 진짜 본 거 맞아? 우리 순이 본 거 맞아? 나도 보게 해줘. 한 번만……']};
  return {available:true,lines:['할머니: 순이를 다시 볼 수 있을까……']};
 case 'notice':return done?{available:true,lines:['며칠 전 붙인 철거 안내문이다.']}:{available:true,grantFlag:'ep01_notice',lines:['철거 안내문. 철거 예정일이 적혀 있다.','대성: 이 집도 철거 대상이구나.']};
 case 'boots':
  if(!has(flags,'ep01_album'))return {available:false,lines:[]};
  return done?{available:true,lines:['담장 옆에 빨간 장화 한 짝이 놓여 있다.']}:{available:true,grantFlag:'ep01_boots',lines:['담장 아래 낡은 빨간 장화 한 짝.','대성: 사진에서 본 것 같은데……']};
 case 'album':
  if(!has(flags,'ep01_grandma'))return {available:false,lines:[]};
  return has(flags,'ep01_album')?{available:true,lines:['사진첩을 제자리에 두었다.']}:{available:true,grantFlag:'ep01_album',lines:['할머니가 부엌에 있는 사이 사진첩을 펼쳤다.','빨간 장화를 신은 어린 여자아이. 사진 아래에 ‘순이’라고 쓰여 있다.','대성: ……괜히 봤네.']};
 case 'puddle':
  if(!has(flags,'ep01_second_battle')||has(flags,'ep01_puddle'))return {available:false,lines:[]};
  return {available:true,grantFlag:'ep01_puddle',lines:['빗물 위로 어린 여자아이의 얼굴이 스쳤다.','대성: 어?','고개를 들었지만 아무도 없다.']};
 case 'fake':
  if(!has(flags,'ep01_grandma_story'))return {available:true,lines:['사오정: 점 보러 왔어?','대성: 아니요. 그냥요.']};
  if(has(flags,'ep01_shaman'))return {available:true,lines:['사오정: 부적 잘 갖고 다녀. 잃어버리면 또 사야 하니까.']};
  return {available:true,grantFlag:'ep01_shaman',lines:['대성: 저…… 죽은 사람도 볼 수 있나요?','사오정: 있지. 재수 없으면.','대성: 다섯 살쯤 된 여자아이요.','사오정: 니 딸이야?','대성: 아뇨. 할머니가 보고 싶어 하셔서요.','사오정: 흐음…… 망자의 한이 깊어. 부적 하나 갖고 있어 봐.','대성: 복채는 얼마예요?','사오정: 얼마 있는데?','대성: 오만 원이요.','사오정: 뭐, 그거라도 줘.']};
 default:
  if(done)return {available:true,lines:[site.name+' — 이미 확인했다.']};
  if(site.requires?.some(f=>!has(flags,f)))return {available:false,lines:[]};
  return {available:true,lines:site.lines,grantFlag:site.flag};
 }
}
export const sitesIn=(region:string):readonly Site[]=>SITES.filter(site=>site.region===region);
export function episode01Status(flags:readonly string[]):string {
 const found=EP01_FLAGS.filter(flag=>flags.includes(flag)).length;
 return '1화 진행 · 사건 '+found+'/'+EP01_FLAGS.length;
}
