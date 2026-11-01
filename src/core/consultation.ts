/** Mandatory consultation: never block the main quest because of optional purchases. */
export function consultationPayment(gold:number,price=50000):{remaining:number;debt:number}{
 const paid=Math.min(Math.max(0,gold),price);
 return {remaining:Math.max(0,gold-paid),debt:price-paid};
}
