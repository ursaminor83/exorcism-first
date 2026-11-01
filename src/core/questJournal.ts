import {currentQuest} from './quest';

/** Compact journal: objective and completed milestones, no detective puzzles. */
export const EP01_MILESTONES:readonly {flag:string;label:string}[]=[
 {flag:'intro_home',label:'엄마의 등짝 스매시를 견디고 첫 출근 준비'},
 {flag:'intro_office',label:'철거 용역 사무실에서 첫 배정'},
 {flag:'ep01_first_battle',label:'할머니를 지키려다 덩치에게 패배'},
 {flag:'ep01_grandma',label:'사진을 할머니에게 돌려줌'},
 {flag:'ep01_album',label:'사진첩에서 빨간 장화의 순이를 발견'},
 {flag:'ep01_next_day',label:'집에서 밤을 보내고 금요일 시작'},
 {flag:'ep01_second_battle',label:'금요일 철거 현장에서 다시 충돌'},
 {flag:'ep01_payment',label:'할머니에게 일당을 받음'},
 {flag:'ep01_puddle',label:'빗물에 비친 순이를 목격'},
 {flag:'ep01_grandma_story',label:'순이의 사연을 들음'},
 {flag:'ep01_shaman',label:'사오정에게 부적을 받음'},
 {flag:'ep01_boots',label:'빨간 장화 확보'},
 {flag:'ep01_doll',label:'순이의 인형 확보'},
 {flag:'ep01_drawing',label:'도면 뒷면의 그림 확보'},
 {flag:'ep01_reported',label:'공사 기록의 불일치를 신고'},
 {flag:'ep01_final_ready',label:'할머니에게 유품을 보여줌'},
 {flag:'ep01_final_battle',label:'순이의 원념을 달램'},
 {flag:'ep01_resolved',label:'할머니와 마지막 대화를 나눔'}
];
export function questJournal(flags:readonly string[]):{objective:string;target:string;completed:string[];progress:string}{
 const quest=currentQuest(flags);
 const completed=EP01_MILESTONES.filter(x=>flags.includes(x.flag)).map(x=>x.label);
 return {objective:quest.objective,target:quest.target,completed,progress:completed.length+'/'+EP01_MILESTONES.length};
}
