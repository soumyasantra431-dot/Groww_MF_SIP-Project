// One explicitly authorised live development request. Never retries or enables the workspace.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {openStore} from '../engine/store.mjs';
import {classify,modelStatus} from '../engine/provider.mjs';
import {EXTRACTION_VERSION,privateSignals} from '../engine/contracts.mjs';

if(process.argv[2]!=='--authorised-one-free-check')throw Error('Use only after explicit one-call authorisation in this conversation');
const registration='research/pilot_smoke_2026-11-01';
const plan=JSON.parse(await fs.readFile(registration+'/DEVELOPMENT_ONE_CALL_PLAN_2026-11-02.json','utf8'));
const auth=JSON.parse(await fs.readFile(registration+'/DEVELOPMENT_ONE_CALL_AUTHORISATION_2026-11-02.json','utf8'));
assert.equal(auth.maximum_provider_attempts,1);assert.equal(auth.paid_fallback,false);assert.equal(plan.maximum_monetary_spend_usd,0);
const sha=x=>createHash('sha256').update(x).digest('hex');
for(const [file,digest]of Object.entries(plan.engine_sha256))assert.equal(sha(await fs.readFile(file)),digest,'Instruction/engine changed; re-review the exact one-call plan');
assert.equal(EXTRACTION_VERSION,plan.instruction_version);
const allInputs=JSON.parse(await fs.readFile('.local/smoke-pilot/v1/inputs.json','utf8'));
const input=allInputs.find(r=>r.id===plan.input.id);assert.ok(input);
assert.equal(input.input_sha256,plan.input.input_sha256);
assert.equal(sha(JSON.stringify({text:input.text,source_family:input.source_family,speaker_roles:input.speaker_roles,origin:input.origin,date:input.date})),input.input_sha256);
assert.equal(privateSignals(input.text).length,0);assert.equal(input.source_family,'Investing forums');
const terms=JSON.parse(await fs.readFile(registration+'/TERMS_REGISTER.json','utf8')).sources.find(r=>r.id==='tradingqna');
assert.equal(terms.collection_allowed,true);assert.equal(terms.model_processing_allowed,true);assert.equal(terms.public_raw_text_allowed,false);
const configured=modelStatus();assert.equal(configured.provider,plan.provider);assert.equal(configured.model,plan.model);
assert.equal(configured.billing_mode,'free');assert.equal(configured.free_plan_confirmed,true);assert.equal(configured.key_configured,true);
assert.equal(configured.enabled,false,'Global model calls must remain disabled');assert.equal(configured.kill_switch,true);assert.equal(configured.cap_usd,0);
assert.ok(Number(process.env.MODEL_INPUT_USD_PER_MILLION)>0&&Number(process.env.MODEL_OUTPUT_USD_PER_MILLION)>0,'Provider price metadata absent; no live call');
const dir=path.resolve('.local/development-one-call-2026-11-02');await fs.mkdir(dir,{recursive:true});
const receiptPath=path.join(dir,'receipt.json');
const receipt={kind:'development_reuse_not_independent_validation',started_at:new Date().toISOString(),instruction_version:EXTRACTION_VERSION,plan_sha256:sha(await fs.readFile(registration+'/DEVELOPMENT_ONE_CALL_PLAN_2026-11-02.json')),input_id:input.id,input_sha256:input.input_sha256,source_url:input.url,source_locator:input.source_locator,maximum_provider_attempts:1,provider_requests:0,processing_status:'preflight_complete',result_file:null,global_model_calls_enabled:false,committed_usd:0,telemetry:null};
const store=openStore();let attemptCount=0;
try{
 const existing=store.spend();assert.equal(existing.calls,0,'This one-call allowance assumes zero existing research-ledger requests');
 await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
 const env={...process.env,ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_BILLING_MODE:'free',MODEL_SPEND_CAP_USD:'0',MODEL_FREE_MAX_CALLS:'1'};
 try{
  const output=await classify(store,input,'b',{env,fetcher:async(url,options)=>{
   assert.equal(attemptCount,0,'Authorised attempt already consumed; no retry');attemptCount++;receipt.provider_requests=attemptCount;receipt.processing_status='request_started';
   await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2)+'\n');return fetch(url,options);
  }});
  assert.equal(output.run.extraction_version,EXTRACTION_VERSION);
  const resultFile=path.join(dir,'result.json');await fs.writeFile(resultFile,JSON.stringify(output,null,2)+'\n',{flag:'wx'});
  receipt.processing_status='completed';receipt.result_file=resultFile;receipt.telemetry=output.run.telemetry;
 }catch(error){
  receipt.processing_status=attemptCount?'failed_after_authorised_attempt':'stopped_before_network';receipt.telemetry=error.telemetry||null;
  // Provider adapter throws safe errors; never retain arbitrary response/error bodies.
  receipt.error_code=error.code||null;receipt.error=error.message?.startsWith('Provider request failed')?error.message:error.message==='Incomplete model response; not a successful classification'?error.message:error.message==='Provider output failed structure checks; no raw output retained'?error.message:'Request did not produce a validated result; no raw response retained';
 }
 receipt.finished_at=new Date().toISOString();receipt.provider_requests=attemptCount;receipt.ledger_after=store.spend();receipt.committed_usd=receipt.ledger_after.committed_usd;
 assert.equal(receipt.committed_usd,0);assert.ok(attemptCount<=1);
 await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify(receipt,null,2));
}finally{store.close();}
