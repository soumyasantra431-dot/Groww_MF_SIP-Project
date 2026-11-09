import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMapProposal,selectedMap,buildContinuityMap,unknownContinuityMap} from '../mvp/continuity-map.mjs';
import worker from '../worker/index.mjs';

const unknownFields={intent:'unknown',bank_debit:'unknown',groww_order:'unknown',workaround:'unknown',next_scheduled:'unknown',other_sip:'unknown'};
test('AI proposal separates this-cycle manual payment from unknown next AutoPay',()=>{
 const text='I wanted to pay my SIP. The bank was debited, but the SIP order is processing. I paid manually. I have not checked the next scheduled SIP.';
 const proposal={intent:{value:'wanted',anchor:'wanted to pay'},bank_debit:{value:'yes',anchor:'bank was debited'},groww_order:{value:'processing',anchor:'SIP order is processing'},workaround:{value:'manual_payment',anchor:'paid manually'},next_scheduled:{value:'completed',anchor:'paid manually'},other_sip:{value:'unknown',anchor:null}};
 const checked=validateMapProposal(text,proposal);
 assert.equal(checked.fields.next_scheduled.value,'unknown');assert.ok(checked.rejected.includes('next_scheduled'));
 const map=buildContinuityMap(checked,'ai_proposal');
 assert.equal(map.account_verified,false);assert.equal(map.next_scheduled_payment_verified,false);
 assert.ok(map.questions.some(q=>q.includes('following scheduled')));
});
test('questions and negation do not become an intentional pause or confirmed order',()=>{
 const text='Can I pause my SIP? The order has not completed.';
 const proposal={intent:{value:'intentional_pause',anchor:'pause my SIP'},groww_order:{value:'completed',anchor:'order has not completed'}};
 const checked=validateMapProposal(text,proposal);
 assert.equal(checked.fields.intent.value,'unknown');assert.equal(checked.fields.groww_order.value,'unknown');
});
test('conflicting debit and failed order produce a safe handoff, not a payment instruction',()=>{
 const map=buildContinuityMap(selectedMap({...unknownFields,bank_debit:'yes',groww_order:'failed',workaround:'manual_payment'}));
 assert.equal(map.conflicts.length,1);assert.match(map.conflicts[0],/before considering another payment/);
 assert.ok(map.questions.every(q=>!/^pay\b/i.test(q)));
});
test('another successful SIP is separate from the focal plan and the person-level metric',()=>{
 const text='One of my other SIPs completed, but my focal SIP order failed.';
 const checked=validateMapProposal(text,{other_sip:{value:'completed',anchor:'other SIPs completed'},groww_order:{value:'failed',anchor:'SIP order failed'}});
 const map=buildContinuityMap(checked);
 assert.equal(map.rows.find(x=>x.field==='other_sip').value,'completed');
 assert.equal(map.next_scheduled_payment_verified,false);
});
test('another plan completion cannot become focal Groww order completion',()=>{
 const text='Another SIP completed, but this SIP has not completed.';
 const checked=validateMapProposal(text,{groww_order:{value:'completed',anchor:'Another SIP completed'},other_sip:{value:'completed',anchor:'Another SIP completed'}});
 assert.equal(checked.fields.groww_order.value,'unknown');
 assert.equal(checked.fields.other_sip.value,'completed');
});
test('public map route works without a model; AI route falls back while held',async()=>{
 const fixed=await worker.fetch(new Request('https://viewer.example/api/sip-map',{method:'POST',body:JSON.stringify({...unknownFields,bank_debit:'yes',groww_order:'processing'})}),{});
 const f=await fixed.json();assert.equal(fixed.status,200);assert.equal(f.rows.find(x=>x.field==='bank_debit').value,'yes');
 const ai=await worker.fetch(new Request('https://viewer.example/api/sip-map-propose',{method:'POST',body:JSON.stringify({description:'The bank was debited but Groww says processing'})}),{MVP_KILL_SWITCH:'true'});
 const a=await ai.json();assert.equal(ai.status,200);assert.equal(a.model_used,false);assert.equal(a.rows.find(x=>x.field==='bank_debit').value,'unknown');
});
test('private identifiers never reach the map model',async()=>{
 const ai=await worker.fetch(new Request('https://viewer.example/api/sip-map-propose',{method:'POST',body:JSON.stringify({description:'My PAN is ABCDE1234F and my SIP order failed'})}),{MVP_KILL_SWITCH:'false',MODEL_BILLING_MODE:'free',MODEL_SPEND_CAP_USD:'0',GROQ_API_KEY:'fixture'});
 assert.equal(ai.status,400);
});
test('safe empty map is explicit about uncertainty',()=>{
 const map=unknownContinuityMap();assert.equal(map.rows.length,6);assert.ok(map.rows.every(x=>x.status==='unknown'));
});
