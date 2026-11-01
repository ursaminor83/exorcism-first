/** Episode 1 quest milestones and left-side objective HUD. */
export type QuestStep = {title:string;objective:string;region:string;target:string;completed:boolean};
export const hasFlag=(flags:readonly string[],flag:string)=>flags.includes(flag);
export function currentQuest(flags:readonly string[]):QuestStep {
 if(!hasFlag(flags,'intro_home'))return {title:'1화 · 첫 출근',objective:'집에서 나갈 준비를 하자.\n집 안의 어머니와 대화 [E]',region:'home',target:'어머니',completed:false};
 if(!hasFlag(flags,'intro_office'))return {title:'1화 · 첫 출근',objective:'철거 용역 사무실로 출근하자.\n집 밖 출구 → 까치골 → 사무실 [E]',region:'kkachi',target:'철거 용역 사무실',completed:false};
 if(!hasFlag(flags,'ep01_grandma'))return {title:'1화 · 빨간 장화',objective:'철거 예정지의 할머니와 대화하자.\n까치골 · 철거민 할머니 [E]',region:'kkachi',target:'철거민 할머니',completed:false};
 if(!hasFlag(flags,'ep01_notice'))return {title:'1화 · 빨간 장화',objective:'철거 안내문을 조사하자.\n까치골 · 철거 안내문 [E]',region:'kkachi',target:'철거 안내문',completed:false};
 if(!hasFlag(flags,'ep01_boots'))return {title:'1화 · 빨간 장화',objective:'빨간 장화 자국을 조사하자.\n까치골 · 붉은 장화 자국 [E]',region:'kkachi',target:'붉은 장화 자국',completed:false};
 if(!hasFlag(flags,'ep01_first_battle'))return {title:'1화 · 빨간 장화',objective:'철거지의 폐가로 돌아가자.\n까치골 · 폐가 진입로 [E]',region:'kkachi',target:'폐가 진입로',completed:false};
 return {title:'1화 · 첫 사건',objective:'첫 전투를 마쳤다.\n이후 귀신 조사와 천도는 제작 예정',region:'kkachi',target:'폐가 진입로',completed:true};
}
