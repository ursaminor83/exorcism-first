/** Authorable scene content, separate from graybox geometry and rendering. */
export interface Site { id:string; region:string; name:string; x:number; y:number; type:'npc'|'clue'|'place'; lines:readonly string[]; flag?:string; requires?:readonly string[] }
export const EP01_FLAGS=['ep01_first_battle','ep01_grandma','ep01_album','ep01_second_battle','ep01_puddle','ep01_grandma_story','ep01_shaman'] as const;
export const SITES:readonly Site[]=[
 {id:'mother',region:'home',name:'어머니',x:1180,y:535,type:'npc',flag:'intro_home',lines:['어머니: 대성아! 첫 출근부터 늦겠다! 얼른 일어나!','손대성: 아악! 등짝은 왜 때려! 오늘부터 철거 용역 나간다니까!','어머니: 말만 무림고수면 뭐 해. 일당 받아서 밥값부터 보태!','손대성: 알았어요! 출근합니다, 출근!']},
 {id:'sleep',region:'home',name:'이불',x:930,y:650,type:'place',lines:[]},
 {id:'home_exit',region:'home',name:'집 밖으로',x:960,y:870,type:'place',lines:['낡은 셋방 문을 열고 까치골 골목으로 나간다.']},
 {id:'house',region:'kkachi',name:'대성의 집',x:660,y:740,type:'place',lines:['손대성이 사는 낡은 셋방이다.']},
 {id:'haunted',region:'kkachi',name:'철거 현장',x:1290,y:410,type:'place',lines:['철거 예정지의 폐가 입구. 문틈에서 서늘한 기운이 느껴진다.']},
 {id:'grandma',region:'kkachi',name:'철거민 할머니',x:1535,y:360,type:'npc',flag:'ep01_grandma',lines:['할머니: 그 집은 건드리지 말아라. 아직 거기 기다리는 애가 있어.','손대성: 애요? 철거는 내일부터라던데요.','할머니: 비가 많이 오던 날, 빨간 장화를 신은 아이가 있었지.']},
 {id:'album',region:'kkachi',name:'할머니 집 사진첩',x:1655,y:345,type:'clue',lines:[]},
 {id:'puddle',region:'kkachi',name:'마당의 빗물',x:1395,y:450,type:'clue',lines:[]},
 {id:'notice',region:'kkachi',name:'철거 안내문',x:1200,y:385,type:'clue',flag:'ep01_notice',lines:['조사: 철거 공고의 날짜가 몇 차례 덧칠되어 있다.','손대성: 누가 급하게 공사를 밀어붙인 것 같은데?']},
 {id:'boots',region:'kkachi',name:'담장 아래 낡은 물건',x:1460,y:405,type:'clue',flag:'ep01_boots',lines:['조사: 마른 흙 위에 작은 장화 자국이 남아 있다.','손대성: 발자국이... 집 안으로 이어지는데?']},
 {id:'doll',region:'kkachi',name:'무너진 방 안',x:1355,y:300,type:'clue',lines:[]},
 {id:'drawing',region:'kkachi',name:'낡은 서류더미',x:1700,y:400,type:'clue',lines:[]},
 {id:'agency',region:'kkachi',name:'철거 용역 사무실',x:1250,y:700,type:'place',flag:'intro_office',lines:['용역 반장: 너 오늘부터 일하는 손대성이지? 늦었잖아!','손대성: 아닙니다! 아직 출근 시간 1분 전입니다!','용역 반장: 말대꾸 말고 철거지에 가서 할머니부터 설득해.','손대성: (첫날부터 왜 이런 일을 시키는 거야...)']},
 {id:'foreman_tools',region:'kkachi',name:'버려진 작업도구',x:1130,y:685,type:'clue',lines:[]},
 {id:'phone',region:'market',name:'공중전화',x:1530,y:560,type:'place',lines:['공중전화 옆에는 동전이 떨어져 있다.','대성: 엄마한테 전화하면 잔소리만 듣겠지.']},
 {id:'shopkeeper',region:'market',name:'까치상회 주인',x:950,y:330,type:'npc',lines:['주인: 붕대는 오백 원이야. 돈 있으면 B를 눌러 사.','대성: 외상은요?','주인: 외상은 네 엄마한테 물어봐.']},
 {id:'priest',region:'church',name:'바오로 신부',x:830,y:340,type:'npc',lines:[]},
 {id:'doctor',region:'church',name:'동네 약사',x:690,y:620,type:'npc',lines:['약사: 철거지에서 다쳤다고? 무리하지 말고 쉬어.','대성: 약보다 일당이 급한데요.']},
 {id:'foreman_office',region:'newtown',name:'재개발 담당자',x:1250,y:690,type:'npc',lines:[]},
 {id:'fisher',region:'riverside',name:'둔치 낚시꾼',x:1250,y:590,type:'npc',lines:['낚시꾼: 비만 오면 수로 쪽에서 어린애 우는 소리가 난다더라.','낚시꾼: 그래도 난 낚시나 할란다.']},
 {id:'church',region:'church',name:'까치골 성당',x:1240,y:350,type:'place',lines:['붉은 벽돌 성당. 사제관과 작은 마당이 이어져 있다.']},
 {id:'shrine',region:'forest',name:'산 아래 신당',x:680,y:350,type:'place',lines:['오색천이 매달린 커다란 나무 옆에 오래된 당집이 있다.','안쪽에서는 방울 소리가 들리는 듯하지만 아무도 보이지 않는다.']},
 {id:'tree',region:'forest',name:'오색천 큰 나무',x:1240,y:350,type:'clue',lines:['낡은 오색천이 바람도 없는데 흔들린다.','나무 아래에는 누군가 최근 놓고 간 제물이 있다.']},
 {id:'fake',region:'market',name:'사오정의 점집',x:680,y:350,type:'npc',lines:['사오정: 관상이 아주 안 좋으시네. 액막이 부적 하나 어때요?','손대성: 이거 그냥 빨간 종이에 낙서한 거 아니에요?','사오정: 쉿. 남들이 듣잖아!']},
 {id:'soup',region:'market',name:'국밥집',x:1240,y:350,type:'place',lines:['시장 사람들의 소문이 모이는 국밥집이다.','주인: 요새 철거지 쪽에 밤마다 이상한 소리가 난다더라.']},
 {id:'pawn',region:'oldtown',name:'흥신소 겸 전당포',x:680,y:350,type:'npc',lines:[]},
 {id:'inn',region:'oldtown',name:'낡은 여관',x:1240,y:350,type:'place',lines:['방명록 일부가 찢겨 있다. 최근 투숙객들의 행방이 묘연하다.']},
 {id:'grave',region:'temple',name:'공동묘지',x:680,y:350,type:'place',lines:['오래된 묘비들 사이로 새로 파헤친 흙이 보인다.']},
 {id:'cult',region:'cult',name:'교단 무료 급식소',x:680,y:350,type:'npc',lines:['봉사자: 어려운 분들은 누구나 환영합니다.','벽에는 교단 집회 날짜가 적힌 안내문이 붙어 있다.']},
 {id:'school',region:'outskirts',name:'외곽 폐교',x:680,y:350,type:'place',lines:['폐교 운동장에 작은 발자국들이 남아 있다.']},
 {id:'construction',region:'newtown',name:'재개발 회사',x:680,y:350,type:'place',lines:['건물 앞에 철거 예정지의 지번이 적힌 서류가 쌓여 있다.']},
 {id:'drain',region:'sewer',name:'복개 수로 출구',x:680,y:350,type:'place',lines:['철창 너머로 물소리가 들린다. 하천 쪽으로 이어지는 것 같다.']},
 {id:'factory',region:'industrial',name:'폐공장',x:680,y:350,type:'place',lines:['가동을 멈춘 공장. 누군가 드나든 흔적이 있다.']},
 {id:'slum',region:'riverside',name:'강변 판자촌',x:680,y:350,type:'place',lines:['한강 둔치의 판자촌. 주민들이 낯선 사람을 경계한다.']},
 {id:'boat',region:'ferry',name:'폐유람선',x:680,y:350,type:'place',lines:['녹슨 폐유람선이 나루터에 묶여 있다.']},
 {id:'confessional',region:'church',name:'성당 고해소',x:1510,y:650,type:'place',lines:['고해소 문이 반쯤 열려 있다.','대성: 신부님, 귀신이 보이면 고해성사부터 해야 하나요?','바오로: 우선 무엇을 보았는지 정확히 말씀해 주세요.']},
 {id:'forest_trail',region:'forest',name:'젖은 산길',x:930,y:680,type:'clue',lines:['나뭇가지에 오래된 오색천이 걸려 있다.','흙길에는 최근 사람이 지나간 발자국이 보인다.']},
 {id:'temple_bell',region:'temple',name:'녹슨 범종',x:1260,y:620,type:'place',lines:['종소리가 멈춘 지 오래된 범종이다.','대성: 이렇게 큰 종도 누가 가져가려나?']},
 {id:'cult_visitor',region:'cult',name:'무료급식 봉사자',x:1220,y:650,type:'npc',lines:['봉사자: 식사하러 오셨나요?','대성: 아니요. 사람을 찾고 있어서요.','봉사자: 이곳에서는 누구나 새 삶을 시작할 수 있어요.']},
 {id:'school_board',region:'outskirts',name:'폐교 게시판',x:1220,y:650,type:'clue',lines:['낡은 게시판에 오래된 운동회 사진이 붙어 있다.','사진 뒷면에는 학급 명단이 남아 있다.']},
 {id:'market_vendor',region:'market',name:'채소 장수',x:1260,y:710,type:'npc',lines:['장수: 철거지 할머니? 매일 장화 한 짝을 닦으러 나오시지.','대성: 한 짝이요?','장수: 별일 아니면 그걸 왜 묻겠어.']},
 {id:'oldtown_clerk',region:'oldtown',name:'낡은 인쇄소',x:1250,y:710,type:'place',lines:['인쇄소 주인: 옛날 도면 복사본이라면 찾아볼 수 있지.','대성: 기록이 남아 있으면 좋겠는데요.']},
 {id:'newtown_agent',region:'newtown',name:'부동산 중개인',x:680,y:690,type:'npc',lines:['중개인: 철거만 끝나면 땅값이 뛸 거야.','대성: 그곳에 아직 사람이 살잖아요.','중개인: 세상일이 다 그렇지 뭐.']},
 {id:'sewer_gate',region:'sewer',name:'배수문',x:1270,y:700,type:'place',lines:['배수문은 녹이 슬어 움직이지 않는다.','안쪽에서 물이 떨어지는 소리가 울린다.']},
 {id:'factory_worker',region:'industrial',name:'퇴직 공장 노동자',x:1250,y:680,type:'npc',lines:['노동자: 여기 공장은 몇 년 전에 문을 닫았지.','노동자: 그래도 밤이면 기계 돌아가는 소리가 들린다더라.']},
 {id:'riverside_seller',region:'riverside',name:'강변 구멍가게',x:680,y:700,type:'place',lines:['강변 구멍가게에는 비에 젖은 신문이 쌓여 있다.','주인: 오래된 사고를 찾는다면 신문부터 뒤져 봐.']},
 {id:'ferry_keeper',region:'ferry',name:'나루터 관리인',x:1250,y:680,type:'npc',lines:['관리인: 유람선은 운항 안 해. 함부로 들어가지 마.','대성: 배 안에서 소리가 들리던데요.','관리인: 바람 소리겠지.']},
 {id:'final_gate',region:'final',name:'봉쇄선 경고문',x:1260,y:680,type:'clue',lines:['경고: 관계자 외 출입 금지.','대성: 이 뒤에는 뭐가 있는 거지?']},
 {id:'sealed',region:'final',name:'봉쇄된 시설',x:680,y:350,type:'place',lines:['두꺼운 철문이 잠겨 있다. 아직 이곳의 비밀을 풀 단서가 부족하다.']}
];
/** Dialogue is resolved at interaction time, not permanently attached to a map marker. */
export interface DialogueResult { lines:readonly string[]; grantFlag?:string; available:boolean }
const has=(flags:readonly string[],flag:string)=>flags.includes(flag);
export function resolveDialogue(site:Site,flags:readonly string[]):DialogueResult {
 const done=site.flag?has(flags,site.flag):false;
 switch(site.id){
 case 'foreman_tools':return has(flags,'ep01_first_battle')?{available:true,grantFlag:has(flags,'ep01_tools')?undefined:'ep01_tools',lines:['공사장에서 쓰다 버린 각목과 작업 장갑을 주웠다.','대성: 무림의 보물은 의외로 가까운 데 있군.'] }:{available:false,lines:[]};
 case 'pawn':return !has(flags,'ep01_drawing')?{available:true,lines:['주팔복: 흥신소 겸 전당포야. 오래된 물건이라면 나한테 가져와.','대성: 사장님, 인상은 무서운데 의외로 빠르시네요.','주팔복: 몸집이랑 머리 회전은 별개거든.']}:{available:true,grantFlag:has(flags,'ep01_palbok_joined')?undefined:'ep01_palbok_joined',lines:['대성: 이 도면 좀 봐 주세요.','주팔복: 건축 전공은 아니지만 서류 위조 흔적은 알아.','주팔복: 같이 가자. 이런 건 혼자 들고 다니면 위험해.']};
 case 'priest':return !has(flags,'ep01_grandma_story')?{available:true,lines:['바오로: 다친 사람을 돕는 데 이유가 필요합니까?','대성: 신부님도 싸움 잘하세요?','바오로: 그건 별개 문제죠.']}:{available:true,grantFlag:has(flags,'ep01_priest_met')?undefined:'ep01_priest_met',lines:['대성: 철거지에서 죽은 아이를 본 것 같아요.','바오로: 두려워도 혼자 해결하려 하지 마세요.','바오로: 증거를 먼저 찾읍시다. 성급한 구마는 위험합니다.']};
 case 'foreman_office':return !has(flags,'ep01_drawing')?{available:true,lines:['담당자: 공사 기록은 외부인에게 공개할 수 없습니다.']}:{available:true,grantFlag:has(flags,'ep01_reported')?undefined:'ep01_reported',lines:['대성: 도면에 적힌 보강재가 현장에는 없었습니다.','담당자: ……확인해 보겠습니다. 기록을 남겨 두죠.','대성: 말만 하지 말고 문서로 남기세요.']};
 case 'mother':return has(flags,'intro_home')?{available:true,lines:['어머니: 밥은 먹었냐?','대성: 아직요.']}:{available:true,grantFlag:'intro_home',lines:['어머니: 언제까지 집에서 뒹굴 거야?','대성: 일하러 나간다니까요!','어머니: 그럼 얼른 나가!']};
 case 'sleep':return !has(flags,'ep01_album')||has(flags,'ep01_next_day')?{available:false,lines:[]}:{available:true,grantFlag:'ep01_next_day',lines:['그날 밤, 대성은 좀처럼 잠들지 못했다.','사진 속 아이와 철거 현장이 자꾸 떠올랐다.','다음 날 금요일 오후. 못 받은 일당을 받으러 다시 현장에 가기로 했다.']};
 case 'agency':return !has(flags,'intro_home')?{available:true,lines:['오늘은 아직 출근할 준비가 안 됐다.']}:done?{available:true,lines:['직원: 배정받은 현장으로 가.']}:{available:true,grantFlag:'intro_office',lines:['직원: 손대성? 철거 현장으로 가. 일당은 오만 원.','대성: 철거요?','직원: 가서 반장 찾으면 돼.']};
 case 'grandma':
  if(has(flags,'ep01_final_battle')&&!has(flags,'ep01_resolved'))return {available:true,grantFlag:'ep01_resolved',lines:['할머니: ……순이가 웃었니?','대성: 네. 마지막에는 분명히 웃었어요.','할머니: 그 아이가 아프지 않았다면 됐다. 그거면 됐어.','대성: 저도 겁나 죽는 줄 알았거든요. 근데…… 도망가면 안 될 것 같아서요.','할머니: 너도 참, 못 말리는 녀석이구나.','아침 햇살이 젖은 마당에 비쳤다. 철거 작업은 안전 조사 결과가 나올 때까지 중지되었다.']};
  if(!has(flags,'ep01_first_battle'))return {available:true,lines:['할머니: 위험하니 물러나거라.']};
  if(!has(flags,'ep01_grandma'))return {available:true,grantFlag:'ep01_grandma',lines:['대성: 이 사진, 아까 떨어뜨리셨어요.','할머니: ……고맙다. 밥이라도 먹고 가.']};
  if(!has(flags,'ep01_second_battle'))return {available:true,lines:['할머니: 조심해서 다녀. 괜히 또 나서지 말고.']};
  if(!has(flags,'ep01_payment'))return {available:true,grantFlag:'ep01_payment',lines:['빗소리가 지붕을 두드렸다. 할머니가 다친 대성에게 따뜻한 밥을 내밀었다.','할머니: 몸은 괜찮으냐? 그 일당 내가 대신 줄게.','대성: 저 사실 일당 받으러 왔죠. 하하……','할머니: 못 말리는 녀석. 오만 원이다. 다시는 다치지 마라.']};
  if(!has(flags,'ep01_puddle'))return {available:true,lines:['할머니: 비가 많이 오는구나. 다친 데는 괜찮아?']};
  if(!has(flags,'ep01_grandma_story'))return {available:true,grantFlag:'ep01_grandma_story',lines:['대성: 할머니, 사진 속 아이요. 아까 마당에서 본 것 같아요.','할머니: ……그럴 리가.','대성: 네?','할머니: 죽었어. 오래전에.','할머니: 그때도 이렇게 비가 왔었는데……','할머니: 진짜 본 거 맞아? 우리 순이 본 거 맞아? 나도 보게 해줘. 한 번만……']};
  return {available:true,lines:['할머니: 순이를 다시 볼 수 있을까……']};
 case 'notice':return done?{available:true,lines:['며칠 전 붙인 철거 안내문이다.']}:{available:true,grantFlag:'ep01_notice',lines:['철거 안내문. 철거 예정일이 적혀 있다.','대성: 이 집도 철거 대상이구나.']};
 case 'doll':return !has(flags,'ep01_shaman')?{available:false,lines:[]}:{available:true,grantFlag:has(flags,'ep01_doll')?undefined:'ep01_doll',lines:['대성: 여기서 무슨 소리가…… 으아악!','구석에서 들개 한 마리가 튀어나왔다. 대성은 엉덩방아를 찧었다.','들개는 물러나고, 먼지투성이 인형 하나가 드러났다.','옷깃에는 순이라는 이름이 수놓아져 있다.','등에 달린 단추를 누르자 잡음만 들린다.','대성: 고장 났나? 일단 가져가자.']};
 case 'drawing':return !has(flags,'ep01_shaman')?{available:false,lines:[]}:{available:true,grantFlag:has(flags,'ep01_drawing')?undefined:'ep01_drawing',lines:['서류더미에서 쥐가 튀어나왔다!','대성: 으악! ……쥐였어? 소림고수의 심장을 시험하는구나.','낡은 공사 도면의 뒷면에 아이의 그림이 있다.','엄마 아프지 마. 삐뚤빼뚤한 글씨가 남아 있다.','도면에 표시된 보강 구조와 실제 무너진 벽이 다르다.','대성: 이건 그냥 넘어갈 일이 아닌데.']};
 case 'boots':
  if(!has(flags,'ep01_shaman')||!has(flags,'ep01_puddle'))return {available:false,lines:[]};
  return done?{available:true,lines:['담장 옆에 빨간 장화 한 짝이 놓여 있다.']}:{available:true,grantFlag:'ep01_boots',lines:['담장 아래 낡은 빨간 장화 한 짝.','대성: 사진에서 본 것 같은데……']};
 case 'album':
  if(!has(flags,'ep01_grandma'))return {available:false,lines:[]};
  return has(flags,'ep01_album')?{available:true,lines:['사진첩을 제자리에 두었다.']}:{available:true,grantFlag:'ep01_album',lines:['할머니가 부엌에 있는 사이 사진첩을 펼쳤다.','빨간 장화를 신은 어린 여자아이. 사진 아래에 ‘순이’라고 쓰여 있다.','대성: ……괜히 봤네.']};
 case 'puddle':
  if(!has(flags,'ep01_payment')||has(flags,'ep01_puddle'))return {available:false,lines:[]};
  return {available:true,grantFlag:'ep01_puddle',lines:['빗물 위로 어린 여자아이의 얼굴이 스쳤다.','대성: 어?','고개를 들었지만 아무도 없다.']};
 case 'fake':
  if(!has(flags,'ep01_grandma_story'))return {available:true,lines:['사오정: 점 보러 왔어?','대성: 아니요. 그냥요.']};
  if(has(flags,'ep01_shaman'))return has(flags,'ep01_shaman_joined')?{available:true,lines:['사오정: 내가 같이 가긴 하지만 귀신은 네가 먼저 봐.']}: {available:true,grantFlag:'ep01_shaman_joined',lines:['대성: 이 부적이 효과가 있는지 같이 확인해 주세요.','사오정: 내가 왜? ……일당 준다면 생각해 보지.','대성: 일단 같이 가는 걸로!','사오정: 야, 잠깐! 말은 끝까지 들어!']};
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
