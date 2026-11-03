// Synthetic engineering responses, not model-quality or investor evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {safeProviderFailure} from '../engine/provider-failure.mjs';
import {classify,modelStatus} from '../engine/provider.mjs';
import {buildRequest} from '../engine/request.mjs';
const env={MODEL_BILLING_MODE:'free',GROQ_FREE_PLAN_CONFIRMED:'true',GROQ_API_KEY:'fixture',MODEL_SPEND_CAP_USD:'0',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false'};
const response=message=>new Response(JSON.stringify({error:{code:'rate_limit_exceeded',message}}),{status:413});
test('Error diagnostics retain aggregate TPM pair, never identifiers or echoed source',async()=>{
 const r=await safeProviderFailure(response('Untrusted echo fixture@example.test; tokens per minute (TPM): Limit 8000, Requested 9000.'));
 assert.deepEqual(r,{code:'rate_limit_exceeded',body_status:'parsed',limit:8000,requested:9000,unit:'tokens_per_minute'});
 assert.equal(JSON.stringify(r).includes('fixture@'),false);
 const unknown=await safeProviderFailure(new Response(JSON.stringify({error:{code:'echoed secret',message:'account 1234567890 Limit 8000 Requested 9000'}})));
 assert.equal(unknown.code,'unrecognised');assert.equal(unknown.limit,null);
});
test('Malformed or oversized error bodies cannot enter diagnostics',async()=>{
 assert.equal((await safeProviderFailure(new Response('not JSON'))).body_status,'unreadable');
 assert.equal((await safeProviderFailure(new Response('x'.repeat(17000)))).body_status,'too_large');
});
test('413 is not 429; no retry, settlement, or text stored in error telemetry',async()=>{
 let calls=0,reservations=0,settled=0;
 await assert.rejects(classify({reserveFree:async()=>{reservations++;return 'fixture';},settle:async()=>settled++},{source_family:'Other',text:'Synthetic fixture only.'},'a',{env,fetcher:async()=>{calls++;return response('tokens per minute (TPM): Limit 8000, Requested 9000.');}}),e=>{
  assert.equal(e.code,'PROVIDER_REQUEST_TOO_LARGE');assert.equal(e.telemetry.rate_limited,false);assert.equal(e.telemetry.total_tokens,null);assert.equal(e.telemetry.provider_failure.requested,9000);return true;
 });
 assert.equal(calls,1);assert.equal(reservations,1);assert.equal(settled,0);
});
test('Paid configuration, nonzero and malformed caps fail closed before any request',async()=>{
 let calls=0;
 for(const extra of [{MODEL_BILLING_MODE:'paid',MODEL_SPEND_CAP_USD:'10'},{MODEL_SPEND_CAP_USD:'1'},{MODEL_SPEND_CAP_USD:'NaN'}]){
  const config={...env,...extra};assert.equal(modelStatus(config).enabled,false);
  await assert.rejects(classify({},{source_family:'Other',text:'fixture'},'a',{env:config,fetcher:async()=>calls++}),/AI disabled/);
 }
 assert.equal(calls,0);assert.throws(()=>buildRequest({text:'fixture'},'a',{free:false}),/Free-only/);
});
