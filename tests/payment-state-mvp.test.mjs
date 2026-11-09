import test from 'node:test';
import assert from 'node:assert/strict';
import {screenInput,validateProposal,responseFor,selectedResponse} from '../mvp/payment-state.mjs';
import worker from '../worker/index.mjs';

test('privacy screen rejects identifiers before a model request',()=>{
 assert.equal(screenInput('My PAN is ABCDE1234F and SIP failed').ok,false);
 assert.equal(screenInput('My email is investor@example.com and SIP failed').ok,false);
 assert.equal(screenInput('My balance was ₹12,345 and SIP failed').ok,false);
 assert.equal(screenInput('My SIP failed and I do not know why').ok,true);
});
test('source anchors and negation force unknown rather than invented status',()=>{
 assert.equal(validateProposal('The bank was not debited', {state:'debited_processing',anchor:'bank was not debited'}).state,'unknown');
 assert.equal(validateProposal('I do not want to cancel my SIP', {state:'intentional_pause',anchor:'cancel my SIP'}).state,'unknown');
 assert.equal(validateProposal('Maybe my SIP failed', {state:'failed_reported',anchor:'SIP failed'}).state,'unknown');
 assert.equal(validateProposal('My AutoPay failed', {state:'failed_reported',anchor:'AutoPay failed'}).state,'failed_reported');
 assert.equal(validateProposal('My AutoPay failed', {state:'failed_reported',anchor:'mandate expired'}).state,'unknown');
 assert.equal(validateProposal('My bank was debited but Groww says failed', {state:'failed_reported',anchor:'Groww says failed'}).state,'unknown');
 assert.equal(validateProposal('My bank was debited but Groww says failed', {state:'debited_processing',anchor:'bank was debited'}).state,'unknown');
 assert.equal(validateProposal('My bank was debited but Groww says pending payment', {state:'unpaid_unclear',anchor:'pending payment'}).state,'unknown');
 assert.equal(validateProposal('Can I pause my SIP?', {state:'intentional_pause',anchor:'pause my SIP'}).state,'unknown');
 assert.equal(validateProposal('I decided not to pause my SIP', {state:'intentional_pause',anchor:'pause my SIP'}).state,'unknown');
 assert.equal(validateProposal('I chose to pause this SIP for now', {state:'intentional_pause',anchor:'chose to pause'}).state,'intentional_pause');
});
test('a reported bank debit never becomes verified completed investment',()=>{
 const r=responseFor('My bank was debited but the SIP order is processing',{state:'debited_processing',anchor:'bank was debited'});
 assert.equal(r.reported_state,'debited_processing');
 assert.equal(r.account_verified,false);assert.equal(r.next_scheduled_payment_verified,false);
 assert.match(r.detail,/Do not assume another payment/);
 assert.match(r.receipt.next_check,/next scheduled instalment/);
 assert.equal(r.next_scheduled_payment_verified,false);
 assert.match(r.official_url,/groww\.in\/help/);
});
test('a user correction remains self-reported and never verifies the next cycle',()=>{
 const r=selectedResponse('completed_reported');
 assert.equal(r.proposal,false);assert.equal(r.reason,'user_selected');
 assert.equal(r.account_verified,false);assert.equal(r.next_scheduled_payment_verified,false);
 assert.match(r.receipt.reported,/not your verified account status/);
 assert.throws(()=>selectedResponse('mandate_fixed'));
});
test('fixed receipt endpoint has no model dependency and rejects arbitrary states',async()=>{
 let r=await worker.fetch(new Request('https://viewer.example/api/sip-receipt',{method:'POST',body:JSON.stringify({state:'intentional_pause'})}),{});
 let j=await r.json();assert.equal(r.status,200);assert.equal(j.model_used,false);assert.equal(j.reported_state,'intentional_pause');
 r=await worker.fetch(new Request('https://viewer.example/api/sip-receipt',{method:'POST',body:JSON.stringify({state:'bank_fault_proven'})}),{});
 assert.equal(r.status,400);
});
test('public AI route falls back safely when the model is off',async()=>{
 const r=await worker.fetch(new Request('https://viewer.example/api/sip-status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({description:'My AutoPay failed this month'})}),{MVP_KILL_SWITCH:'true',MODEL_BILLING_MODE:'free',MODEL_SPEND_CAP_USD:'0',GROQ_API_KEY:'fixture'});
 const j=await r.json();assert.equal(r.status,200);assert.equal(j.reported_state,'unknown');assert.equal(j.model_used,false);
});
test('public AI route rejects private input and validates model proposal',async()=>{
 const old=globalThis.fetch;
 try{
  globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({state:'debited_processing',anchor:'bank was debited'})}}]}));
  const env={MVP_KILL_SWITCH:'false',MODEL_BILLING_MODE:'free',MODEL_SPEND_CAP_USD:'0',GROQ_API_KEY:'fixture'};
  let r=await worker.fetch(new Request('https://viewer.example/api/sip-status',{method:'POST',headers:{'CF-Connecting-IP':'test-a'},body:JSON.stringify({description:'The bank was debited, but my SIP is still processing.'})}),env);
  let j=await r.json();assert.equal(j.reported_state,'debited_processing');assert.equal(j.model_used,true);assert.equal(j.account_verified,false);
  r=await worker.fetch(new Request('https://viewer.example/api/sip-status',{method:'POST',headers:{'CF-Connecting-IP':'test-b'},body:JSON.stringify({description:'My phone is 9876543210 and AutoPay failed'})}),env);
  assert.equal(r.status,400);
 }finally{globalThis.fetch=old;}
});
