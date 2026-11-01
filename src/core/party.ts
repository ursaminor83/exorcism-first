/** Episode one is Daeseong's story. Saojeong appears as a supporting NPC, not a combat ally. */
export const RECRUIT_FLAGS:Readonly<Record<string,string>>={};
export function activePartyIds(_flags:readonly string[]):string[]{return ['daeseong'];}
