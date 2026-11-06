// One new pass on the old frozen ten inputs after synthetic repair. Development
// reuse only: the reference was adjudicated after the earlier V7 model output.
import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
import {openStore} from '../engine/store.mjs';import {classify,modelStatus} from '../engine/provider.mjs';import {privateSignals,persistable} from '../engine/contracts.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
const base='.local/lean-frozen-2026-11-06-v12-development-reuse',receipt=base+'/progress.json';
const inputs=JSON.parse(await fs.readFile('.local/smoke-pilot/v1/inputs.json','utf8'));
if(inputs.length!==10||inputs.map(x=>x.id).join(',')!=='P01,P02,P03,P04,P05,P06,P07,P08,P09,P10')throw Error('Frozen pack changed');
const terms=JSON.parse(await fs.readFile('research/pilot_smoke_2026-11-01/TERMS_REGISTER.json','utf8'));
const forum=terms.sources.find(s=>s.id==='tradingqna'),survey=terms.sources.find(s=>s.id==='consented_first_hand');
if(!forum?.model_processing_allowed||!forum.collection_allowed||forum.public_raw_text_allowed!==false||!survey?.model_processing_allowed)throw Error('Source permission basis changed; hold run');
for(const x of inputs){if(privateSignals(x.text).length)throw Error('Private data in frozen input; hold run');if(x.origin==='consented_first_hand'){if(x.url||x.source_family!=='Other')throw Error('Survey lane mismatch');}else if(x.source_family!=='Investing forums'||new URL(x.url).hostname!=='tradingqna.com')throw Error('Forum source mismatch');}
const status=modelStatus();if(!status.key_configured||!status.free_plan_confirmed||status.enabled||status.cap_usd!==0)throw Error('Free-only configuration mismatch');
for(const id of ['hypothetical','pause_explicit','several']){const prior=JSON.parse(await fs.readFile(`.local/lean-repair-v12/${id}.json`,'utf8'));if(prior.status!=='proposal_returned'||prior.attempts!==1||prior.telemetry?.finish_reason!=='stop')throw Error('V12 constructed-case structure gate did not pass');}
await fs.mkdir(base,{recursive:true});const run={kind:'frozen_lean_v12_development_reuse_not_independent_accuracy',request_profile:'2026-11-06-lean-disposition-v12',independent_human_gold:false,started_at:new Date().toISOString(),frozen_input_hash:sha(await fs.readFile('.local/smoke-pilot/v1/inputs.json')),source_basis:{forum:'2026-11-01 bounded local noncommercial CC BY-NC-SA interpretation; public redistribution held',survey:'Fellow attestation; individual consent receipts not independently verified'},results:[]};await fs.writeFile(receipt,JSON.stringify(run,null,2),{flag:'wx'});
const store=openStore();try{
 const env={...process.env,ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_BILLING_MODE:'free',MODEL_SPEND_CAP_USD:'0',MODEL_FREE_MAX_CALLS:'1000'};
 for(const x of inputs){
  const row={id:x.id,origin:x.origin,source_lane:x.origin==='consented_first_hand'?'first_hand':x.origin==='context_control'?'context':'public_user_voice',input_sha256:sha(x.text),attempts:0,structure_pass:false};
  try{const result=await classify(store,x,'lean',{env,fetcher:async(url,options)=>{row.attempts++;return fetch(url,options);}});row.structure_pass=true;row.validation=result.run.telemetry.field_rejections?.length?'partial_proposal_needs_field_review':result.run.telemetry.anchor_ambiguous_fields?.length?'structure_pass_needs_anchor_review':'structure_and_basic_evidence_pass';row.telemetry=result.run.telemetry;await fs.writeFile(base+'/'+x.id+'.json',JSON.stringify({id:x.id,proposal:true,result:result.result,run:result.run},null,2));}
  catch(e){row.validation='failed';row.error_code=e.code||'validation_or_transport_failure';row.telemetry=e.telemetry||null;}
  run.results.push(row);run.updated_at=new Date().toISOString();run.ledger=store.spend();await fs.writeFile(receipt,JSON.stringify(run,null,2));console.log(JSON.stringify({id:row.id,pass:row.structure_pass,attempts:row.attempts,status:row.telemetry?.http_status??null,prompt_tokens:row.telemetry?.prompt_tokens??null,completion_tokens:row.telemetry?.completion_tokens??null,latency_ms:row.telemetry?.latency_ms??null,finish_reason:row.telemetry?.finish_reason??null,validation:row.validation,failed_fields:[...(row.telemetry?.validation?.issues||[]),...(row.telemetry?.field_rejections||[])],ambiguous_anchor_fields:row.telemetry?.anchor_ambiguous_fields||[]}));
  // No automatic retry. The ledger enforces at least 65 seconds between calls.
  if(x!==inputs.at(-1))await new Promise(r=>setTimeout(r,66000));
 }
 run.finished_at=new Date().toISOString();await fs.writeFile(receipt,JSON.stringify(run,null,2));
}finally{store.close();}
