// One bounded development attempt under the user instruction to proceed, 2 November 2026. Keep the original failed receipt/ledger.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {openStore} from '../engine/store.mjs';
import {classify,modelStatus} from '../engine/provider.mjs';
import {buildRequest,enforceRequestSize,GUIDE_REQUEST_PROFILE as REQUEST_PROFILE} from '../engine/request.mjs';
import {privateSignals} from '../engine/contracts.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
if(process.argv[2]!=='--run-bounded-guide-check')throw Error('Explicit repaired one-call activation required');
const base='research/pilot_smoke_2026-11-01';
const planText=await fs.readFile(base+'/JSON_GUIDE_CHECK_PLAN_2026-11-02.json','utf8'),plan=JSON.parse(planText);
const auth=JSON.parse(await fs.readFile(base+'/JSON_GUIDE_CHECK_AUTHORISATION_2026-11-02.json','utf8'));
assert.equal(auth.authorisation,'Okay, thanks for the clarification, then go for it as you have planned.');
assert.equal(auth.input_id,plan.input_id);assert.equal(auth.maximum_provider_attempts,1);
assert.equal(auth.maximum_monetary_spend_usd,0);assert.equal(auth.retry,false);assert.equal(auth.paid_fallback,false);
for(const [file,digest]of Object.entries(plan.engine_sha256))assert.equal(sha(await fs.readFile(file)),digest,'Runtime differs from reviewed plan');
const input=JSON.parse(await fs.readFile('.local/smoke-pilot/v1/inputs.json','utf8')).find(r=>r.id===plan.input_id);assert.ok(input);
assert.equal(sha(JSON.stringify({text:input.text,source_family:input.source_family,speaker_roles:input.speaker_roles,origin:input.origin,date:input.date})),plan.input_sha256);
assert.equal(privateSignals(input.text).length,0);assert.equal(input.source_family,'Investing forums');
const terms=JSON.parse(await fs.readFile(base+'/TERMS_REGISTER.json','utf8')).sources.find(r=>r.id==='tradingqna');
assert.equal(terms.collection_allowed,true);assert.equal(terms.model_processing_allowed,true);assert.equal(terms.public_raw_text_allowed,false);
const configured=modelStatus();
assert.equal(configured.provider,plan.provider);assert.equal(configured.model,plan.model);
assert.equal(configured.billing_mode,'free');assert.equal(configured.free_plan_confirmed,true);assert.equal(configured.key_configured,true);
assert.equal(configured.enabled,false);assert.equal(configured.kill_switch,true);assert.equal(configured.cap_usd,0);
assert.equal(REQUEST_PROFILE,plan.request_profile);
const packet=buildRequest(input,plan.tier,{model:plan.model,free:true,transport:'json_guide'});assert.equal(sha(JSON.stringify(packet)),plan.packet_sha256);
const preflight=enforceRequestSize(packet);
const dir=path.resolve('.local/json-guide-development-check-2026-11-02');await fs.mkdir(dir,{recursive:true});
const receiptPath=path.join(dir,'receipt.json'),store=openStore();let attempts=0;
const receipt={kind:'development_reuse_not_independent_validation',started_at:new Date().toISOString(),plan_sha256:sha(planText),input_id:input.id,input_sha256:plan.input_sha256,request_profile:REQUEST_PROFILE,preflight,provider_requests:0,maximum_provider_attempts:1,result_file:null,global_enablement:false,processing_status:'preflight_complete',telemetry:null};
try{
 assert.equal(store.spend().calls,plan.existing_attempts_preserved,'Unexpected ledger; do not reset it');
 assert.equal(store.spend().committed_usd,0);
 await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
 const env={...process.env,ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_BILLING_MODE:'free',MODEL_SPEND_CAP_USD:'0',MODEL_FREE_MAX_CALLS:String(plan.existing_attempts_preserved+1)};
 try{
  const result=await classify(store,input,plan.tier,{env,transport:'json_guide',fetcher:async(url,options)=>{
   assert.equal(attempts,0);assert.equal(sha(options.body),plan.packet_sha256);attempts++;
   receipt.provider_requests=attempts;receipt.processing_status='request_started';
   await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2)+'\n');return fetch(url,options);
  }});
  assert.equal(result.run.request_profile,plan.request_profile);
  const resultFile=path.join(dir,'result.json');await fs.writeFile(resultFile,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
  receipt.result_file=resultFile;receipt.processing_status='completed';receipt.telemetry=result.run.telemetry;
 }catch(error){
  receipt.processing_status=attempts?'failed_after_authorised_attempt':'stopped_before_network';receipt.telemetry=error.telemetry||null;
  receipt.error_code=['FREE_RATE_LIMIT','FREE_PACING','REQUEST_TOO_LARGE','PROVIDER_REQUEST_TOO_LARGE','PROVIDER_FAILURE'].includes(error.code)?error.code:null;
  // Avoid provider bodies and arbitrary error content, which may echo source text.
  receipt.error=/^Provider request failed \(\d{3}\)/.test(error.message)?error.message:['Incomplete model response; not a successful classification','Provider output failed structure checks; no raw output retained'].includes(error.message)?error.message:'No validated result; inspect safe telemetry and source/structure validation locally';
 }
 receipt.finished_at=new Date().toISOString();receipt.provider_requests=attempts;receipt.ledger_after=store.spend();
 assert.ok(attempts<=1);assert.equal(receipt.ledger_after.committed_usd,0);
 await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
}finally{store.close();}
