import {privateSignals} from '../engine/contracts.mjs';

export const STATUS_VERSION='payment-state-v1-2026-11-07';
export const states=['not_due','unpaid_unclear','failed_reported','debited_processing','completed_reported','intentional_pause','unknown'];
const official={
 not_due:{title:'Check the actual next SIP date',detail:'A later displayed date can be normal for a new SIP. Check the date shown in your Groww SIP details before calling a payment missed.',url:'https://groww.in/help/mutual-funds/order/my-sip-was-not-deducted-on-the-date-i-chose--60'},
 unpaid_unclear:{title:'Check the unpaid order and mandate',detail:'If the bank was not debited, inspect the SIP order and Pending SIP payments in Groww. The reason and the status of the next scheduled payment cannot be determined here.',url:'https://groww.in/help/mutual-funds/mf-dashboard/why-is-money-not-getting-deducted-automatically-from-groww-balance-for-upcoming-sip---40'},
 failed_reported:{title:'Check the failed order and linked AutoPay',detail:'Groww lists several possible reasons for a failed instalment. Check the actual failed order and linked mandate. If you still intend to pay, review the official missed-payment options; a one-time payment does not prove the next AutoPay is repaired.',url:'https://groww.in/help/mutual-funds/order/why-did-my-installment-fail--25'},
 debited_processing:{title:'Check the order’s expected completion date',detail:'A bank debit can precede completed SIP processing. Check the order details and expected completion date. Do not assume another payment is needed while the status is unresolved.',url:'https://groww.in/help/mutual-funds/order/why-is-my-sip-order-not-completed-1'},
 completed_reported:{title:'Verify the completed order in Groww',detail:'You reported a completed payment. This page cannot verify it or guarantee that the next scheduled AutoPay will work. Check the order and SIP details in Groww.',url:'https://groww.in/help/mutual-funds/order/why-is-my-sip-order-not-completed-1'},
 intentional_pause:{title:'Check what your chosen change affects',detail:'A deliberate pause or skip can be a valid decision. Check the instalment month shown in Groww’s confirmation. This tool will not urge you to continue or choose an amount.',url:'https://groww.in/help/mutual-funds/mf-sip/how-to-skip-an-sip-instalment--79'},
 unknown:{title:'Check the status in Groww or contact support',detail:'Your description does not establish whether this instalment is due, pending, failed or complete. Check its order and payment status in Groww. If it remains unclear, use official support.',url:'https://groww.in/help/mutual-funds/order/why-did-my-sip-installment-fail--36'}
};
export function screenInput(value){
 const text=typeof value==='string'?value.trim():'';
 if(text.length<12||text.length>700)return {ok:false,error:'Describe the event in 12–700 characters without personal or account details.'};
 if(privateSignals(text).length||/\+?91[\s-]?[6-9]\d{9}\b|\b(?:my name is|i am named|folio\s*(?:no|number|id))\b|(?:₹|rs\.?|inr)\s*\d[\d,]*/i.test(text))return {ok:false,error:'Remove names, exact amounts, PAN, phone, email, folio, bank or account identifiers before continuing.'};
 return {ok:true,text};
}
export function validateProposal(text,p){
 if(!p||!states.includes(p.state)||typeof p.anchor!=='string'||p.anchor.length<4||p.anchor.length>130)return {state:'unknown',reason:'invalid_model_structure'};
 if(!text.toLocaleLowerCase().includes(p.anchor.trim().toLocaleLowerCase()))return {state:'unknown',reason:'unanchored_model_claim'};
 const lower=text.toLocaleLowerCase();
 const state=p.state;
 const positiveDebit=/\b(debited|deducted|money taken|amount taken)\b/i.test(lower)&&!/\b(not|never|wasn't|didn't)\s+(?:get\s+)?(?:debited|deducted)\b/i.test(lower);
 if(/\b(fail(?:ed|ure)?|rejected)\b/i.test(lower)&&positiveDebit)return {state:'unknown',reason:'conflicting_payment_signals'};
 if(positiveDebit&&['unpaid_unclear','not_due'].includes(state))return {state:'unknown',reason:'debit_conflicts_with_route'};
 if(/\b(fail(?:ed|ure)?|rejected)\b/i.test(lower)&&state==='completed_reported')return {state:'unknown',reason:'mixed_payment_outcomes'};
 if(/\b(?:not sure|don't know|do not know|maybe|perhaps|might have|could have)\b/i.test(lower)&&['failed_reported','completed_reported','not_due'].includes(state))return {state:'unknown',reason:'uncertain_report'};
 if(/\b(?:not|never|didn't|don't|do not|wasn't)\s+(?:want\s+to\s+)?(?:skip|pause|stop|cancel|reduce)\b/i.test(lower)&&state==='intentional_pause')return {state:'unknown',reason:'negated_intent'};
 if(/\b(?:not|never|didn't|wasn't)\s+(?:get\s+)?(?:failed|successful|completed)\b/i.test(lower)&&['failed_reported','completed_reported'].includes(state))return {state:'unknown',reason:'negated_outcome'};
 if(state==='failed_reported'&&!/\b(fail(?:ed|ure)?|rejected|unsuccessful)\b/i.test(lower))return {state:'unknown',reason:'failure_not_stated'};
 if(state==='not_due'&&!/\b(not due|due next|next month|later date|next sip|next installment|next instalment)\b/i.test(lower))return {state:'unknown',reason:'due_state_not_stated'};
 if(state==='not_due'&&/\b(fail(?:ed|ure)?|rejected)\b/i.test(lower))return {state:'unknown',reason:'mixed_due_and_failure'};
 if(state==='unpaid_unclear'&&!/\b(not debited|not deducted|wasn't debited|didn't debit|no debit|pending|unpaid)\b/i.test(lower))return {state:'unknown',reason:'unpaid_state_not_stated'};
 if(state==='debited_processing'&&(!/\b(debited|deducted|money taken|amount taken)\b/i.test(lower)||/\b(not|never|wasn't|didn't)\s+(?:get\s+)?(?:debited|deducted)\b/i.test(lower)))return {state:'unknown',reason:'debit_not_supported'};
 if(state==='completed_reported'&&!/\b(completed|successful|succeeded|units allotted|went through)\b/i.test(lower))return {state:'unknown',reason:'completion_not_stated'};
 if(state==='intentional_pause'&&!/\b(skip|pause|stop|cancel|reduce)\b/i.test(lower))return {state:'unknown',reason:'pause_not_stated'};
 if(state==='intentional_pause'&&!/\bi\s+(?:(?:chose|decided|opted)\s+to\s+(?:pause|skip|stop|cancel|reduce)|(?:paused|skipped|stopped|cancelled|reduced)|(?:have|had)\s+(?:paused|skipped|stopped|cancelled|reduced)|am\s+pausing)\b/i.test(lower))return {state:'unknown',reason:'intent_not_stated'};
 return {state,reason:'source_anchored_proposal'};
}
function buildReceipt(state,reason,anchor,proposal){
 const g=official[state];
 return {version:STATUS_VERSION,proposal,reported_state:state,reason,anchor:state==='unknown'?null:anchor,title:g.title,detail:g.detail,official_url:g.url,
  receipt:{reported:state==='unknown'?'The information provided does not establish a clear payment state.':`${proposal?'Your words suggest':'You selected'}: ${state.replaceAll('_',' ')}. This is not your verified account status.`,
   unknown:'Whether this SIP order finally succeeded, what caused any failure, and whether another SIP already succeeded are not verified here.',
   next_check:'At the next scheduled instalment, check the actual SIP order and linked AutoPay in Groww. Record whether the instalment completed, failed, or is still unresolved. A manual or one-time payment this month does not establish that the next automatic payment will work.'},
  account_verified:false,next_scheduled_payment_verified:false,disclaimer:'Research prototype. Not investment advice. This tool cannot see your Groww account, bank or SIP order.'};
}
export function responseFor(text,proposal){
 const checked=validateProposal(text,proposal);
 return buildReceipt(checked.state,checked.reason,checked.state==='unknown'?null:proposal.anchor,true);
}
export function selectedResponse(state){
 if(!states.includes(state))throw Error('Choose a listed reported state.');
 return buildReceipt(state,'user_selected',null,false);
}
export function safeFallback(){return responseFor('',{state:'unknown',anchor:'none'});}
