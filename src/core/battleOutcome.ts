/** Terminal battle decision. Scripted defeats are resolved by story, not HP resets. */
export type BattleOutcome='continue'|'victory'|'defeat';
export function battleOutcome(heroHp:number,enemyHp:number,scriptedLoss=false,finalEncounter=false):BattleOutcome {
 if(heroHp<=0)return 'defeat';
 if(enemyHp<=0&&!scriptedLoss&&!finalEncounter)return 'victory';
 return 'continue';
}
