/** Episode-one progression: narrative events, never discovery spoilers. */
export type QuestStep={title:string;objective:string;region:string;target:string;completed:boolean};
const has=(flags:readonly string[],f:string)=>flags.includes(f);
export function currentQuest(flags:readonly string[]):QuestStep {
 const q=(objective:string,region:string,target:string,completed=false):QuestStep=>({title:'1화 · 첫 출근',objective,region,target,completed});
 if(!has(flags,'intro_home'))return q('어머니와 이야기하고 출근 준비를 하자.','home','어머니');
 if(!has(flags,'intro_office'))return q('용역 사무실에서 오늘 할 일을 확인하자.','kkachi','철거 용역 사무실');
 if(!has(flags,'ep01_first_battle'))return q('철거 현장으로 가 보자.','kkachi','철거 현장');
 if(!has(flags,'ep01_grandma'))return q('떨어진 사진을 할머니께 돌려드리자.','kkachi','철거민 할머니');
 if(!has(flags,'ep01_album'))return q('할머니가 밥을 준비하는 동안 집 안을 둘러보자.','kkachi','할머니 집');
 if(!has(flags,'ep01_next_day'))return q('오늘은 이만 집으로 돌아가 쉬자.','home','손대성의 방');
 if(!has(flags,'ep01_second_battle'))return q('금요일 오후. 못 받은 일당을 확인하러 현장에 가 보자.','kkachi','철거 현장');
 if(!has(flags,'ep01_puddle'))return q('폭우가 쏟아지는 마당에서 이상한 기척을 확인하자.','kkachi','마당');
 if(!has(flags,'ep01_grandma_story'))return q('할머니에게 방금 본 아이를 이야기하자.','kkachi','철거민 할머니');
 if(!has(flags,'ep01_shaman'))return q('죽은 사람을 볼 방법을 알아보자.','market','재래시장');
 if(!has(flags,'ep01_boots'))return q('철거지 담장 근처를 다시 살펴보자.','kkachi','담장 근처');
 if(!has(flags,'ep01_doll'))return q('무너진 집 안에서 남아 있는 물건을 찾아보자.','kkachi','무너진 방');
 if(!has(flags,'ep01_drawing'))return q('철거지에 버려진 오래된 서류를 조사하자.','kkachi','서류더미');
 if(!has(flags,'ep01_resolved'))return q('찾은 물건들을 할머니께 보여 드리자.','kkachi','철거민 할머니');
 return {title:'1화 · 사건 해결',objective:'할머니와 순이의 이야기를 확인했다. 1화 완료.',region:'kkachi',target:'철거민 할머니',completed:true};
}
