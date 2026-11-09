import {screenInput} from './payment-state.mjs';

export const MAP_VERSION='continuity-map-v1-2026-11-09';
export const MAP_FIELDS={
 intent:['wanted','intentional_pause','unknown'],
 bank_debit:['yes','no','unknown'],
 groww_order:['completed','processing','failed','pending','not_due','unknown'],
 workaround:['manual_payment','support_contact','mandate_change','none_stated','unknown'],
 next_scheduled:['completed','failed','pending','not_due','unknown'],
 other_sip:['completed','failed','unknown']
};
const LABELS={intent:'What you wanted',bank_debit:'Bank debit',groww_order:'Groww SIP order',workaround:'What you tried this cycle',next_scheduled:'Following scheduled SIP',other_sip:'Another SIP'};
const UNKNOWN=()=>({value:'unknown',anchor:null});
const official={
 processing:'https://groww.in/help/mutual-funds/order/why-is-my-sip-order-not-completed-1',
 failed:'https://groww.in/help/mutual-funds/searchable/my-autopay-is-approved-even-then-my-sip-failed',
 pending:'https://groww.in/help/mutual-funds/mf-sip/how-do-i-pay-for-my-sip-installment-if-the-autopay-debit-has-failed--40',
 intentional_pause:'https://groww.in/help/mutual-funds/mf-sip/how-to-skip-an-sip-instalment--79',
 unknown:'https://groww.in/help/mutual-funds/order/why-did-my-sip-installment-fail--36'
};
function supported(field,value,anchor){
 const a=anchor.toLowerCase();
 if(/\b(next|following|subsequent|next month|later instalment|later installment)\b/.test(a)&&field!=='next_scheduled')return false;
 if(field==='next_scheduled'&&!/\b(next|following|subsequent|next month|later instalment|later installment)\b/.test(a))return false;
 if(field==='intent'){
  if(value==='wanted')return /\b(want|wanted|intend|intended|planned to pay|still paying)\b/.test(a)&&!/\b(?:not|never|don't|didn't)\s+(?:really\s+)?(?:want|intend)/.test(a);
  return /\bi\s+(?:(?:chose|decided|opted)\s+to\s+(?:pause|skip|stop|cancel)|(?:paused|skipped|stopped|cancelled)|(?:have|had)\s+(?:paused|skipped|stopped|cancelled))\b/.test(a);
 }
 if(field==='bank_debit')return value==='yes'?/\b(debited|deducted|money taken|amount taken)\b/.test(a)&&!/\b(not|never|wasn't|didn't)\s+(?:get\s+)?(?:debited|deducted)\b/.test(a):/\b(not debited|not deducted|no debit|didn't debit|wasn't debited|wasn't deducted)\b/.test(a);
 if(field==='groww_order')return !/\b(other|another|separate)\s+(?:sip|plan|order)\b/.test(a)&&({completed:/\b(completed|successful|succeeded|units allotted)\b/,processing:/\b(processing|under process)\b/,failed:/\b(sip|order)\b.{0,25}\b(failed|rejected|unsuccessful)\b|\b(failed|rejected)\b.{0,25}\b(sip|order)\b/,pending:/\b(pending|unpaid)\b/,not_due:/\b(not due|due later)\b/}[value]||/$^/).test(a)&&!(/\bnot\s+(?:completed|successful|failed|pending)\b/.test(a)&&['completed','failed','pending'].includes(value));
 if(field==='workaround')return ({manual_payment:/\b(paid manually|manual payment|paid using pay now|used pay now|made a one-time payment|made a one time payment)\b/,support_contact:/\b(contacted|called|spoke to|raised a ticket)\b.{0,30}\b(support|bank|groww)\b/,mandate_change:/\b(changed|created|replaced|registered|set up)\b.{0,25}\b(mandate|autopay)\b/,none_stated:/\b(did nothing|took no action|haven't tried anything|have not tried anything)\b/}[value]||/$^/).test(a);
 if(field==='other_sip')return /\b(other|another|one of my|separate)\b/.test(a)&&({completed:/\b(completed|successful|succeeded|paid|debited)\b/,failed:/\b(failed|rejected)\b/}[value]||/$^/).test(a);
 if(field==='next_scheduled')return ({completed:/\b(completed|successful|succeeded)\b/,failed:/\b(failed|rejected)\b/,pending:/\b(pending|processing)\b/,not_due:/\b(not due|not yet due|due next month)\b/}[value]||/$^/).test(a);
 return false;
}
export function validateMapProposal(text,proposal){
 const screened=screenInput(text);if(!screened.ok)throw Error(screened.error);
 const result={},rejected=[];
 for(const [field,values] of Object.entries(MAP_FIELDS)){
  const item=proposal?.[field];
  if(!item||!values.includes(item.value)||item.value==='unknown'){result[field]=UNKNOWN();continue;}
  const anchor=typeof item.anchor==='string'?item.anchor.trim():'';
  if(anchor.length<4||anchor.length>130||!screened.text.toLocaleLowerCase().includes(anchor.toLocaleLowerCase())||!supported(field,item.value,anchor)){
   result[field]=UNKNOWN();rejected.push(field);continue;
  }
  result[field]={value:item.value,anchor};
 }
 return {fields:result,rejected};
}
export function selectedMap(input){
 const result={};for(const [field,values] of Object.entries(MAP_FIELDS)){
  const value=input?.[field];if(!values.includes(value))throw Error('Choose a listed value for each map field.');
  result[field]={value,anchor:null};
 }return {fields:result,rejected:[]};
}
export function buildContinuityMap(input,source='user_selected'){
 const f=input.fields;
 const conflicts=[];
 if(f.bank_debit.value==='yes'&&f.groww_order.value==='failed')conflicts.push('Bank debit and a failed SIP order are both reported. Check the actual final order before considering another payment.');
 if(f.bank_debit.value==='no'&&f.groww_order.value==='completed')conflicts.push('A completed SIP order and no bank debit are both reported. Check the actual order and bank record.');
 if(f.intent.value==='intentional_pause'&&['completed','processing'].includes(f.groww_order.value))conflicts.push('A deliberate pause and an active order state are both reported. Check which instalment each refers to.');
 const questions=[];
 if(f.groww_order.value==='processing'||conflicts.some(x=>x.startsWith('Bank debit')))questions.push('What is the final status and expected completion date of this specific SIP order in Groww?');
 else if(f.groww_order.value==='failed')questions.push('Which approved AutoPay is linked to this SIP, and what does its failed order show?');
 else if(f.groww_order.value==='unknown')questions.push('What does Groww show for this SIP order: pending, processing, failed or completed?');
 if(f.workaround.value==='manual_payment'&&f.next_scheduled.value==='unknown')questions.push('After this manual payment, is the following scheduled SIP still linked to an approved AutoPay?');
 else if(f.next_scheduled.value==='unknown')questions.push('At the following due date, what final SIP-order result does Groww show?');
 if(f.other_sip.value==='completed')questions.push('Was this completed order for a different SIP? Keep each plan’s outcome separate.');
 const route=f.intent.value==='intentional_pause'?'intentional_pause':conflicts.length?'unknown':f.groww_order.value==='processing'?'processing':f.groww_order.value==='failed'?'failed':f.groww_order.value==='pending'?'pending':'unknown';
 return {version:MAP_VERSION,source,rows:Object.entries(f).map(([field,item])=>({field,label:LABELS[field],value:item.value,anchor:item.anchor,status:item.value==='unknown'?'unknown':'reported'})),conflicts,questions:questions.slice(0,3),official_url:official[route],rejected_fields:input.rejected||[],account_verified:false,next_scheduled_payment_verified:false,disclaimer:'Self-reported research prototype. Not investment advice. No account, bank or future SIP result was verified.'};
}
export function unknownContinuityMap(){return buildContinuityMap({fields:Object.fromEntries(Object.keys(MAP_FIELDS).map(key=>[key,UNKNOWN()])),rejected:[]},'safe_fallback');}
