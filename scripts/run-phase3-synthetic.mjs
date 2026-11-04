// Development-only model check. Synthetic accounts never enter the research corpus.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {openStore} from '../engine/store.mjs';
import {classify,modelStatus} from '../engine/provider.mjs';
import {privateSignals} from '../engine/contracts.mjs';
import {syntheticCases} from '../tests/fixtures/synthetic-cases.mjs';
import {LEAN_REQUEST_PROFILE} from '../engine/request.mjs';

const sha=x=>createHash('sha256').update(x).digest('hex');
const suite=['SYN01','SYN03','SYN04','SYN05','SYN12','SYN13'];
const requested=process.argv.find(x=>x.startsWith('--ids='))?.slice(6).split(',');
const selected=requested||suite;
if(!selected.length||new Set(selected).size!==selected.length||selected.some(x=>!suite.includes(x)))throw Error('Choose distinct IDs from the pre-registered synthetic suite');
// Frozen before model output. These are engineering expectations, not human labels.
const expectations={
 SYN01:{metric_node:'months_3_6',exit_form:'continuer',platform:'Groww',instrument:'mutual_fund_sip',continuer:'yes'},
 SYN03:{metric_node:'second_instalment',exit_form:'involuntary',platform:'Groww',instrument:'mutual_fund_sip',continuer:null},
 SYN04:{metric_node:'months_7_12',exit_form:'voluntary',platform:'Groww',instrument:'mutual_fund_sip',continuer:'yes'},
 SYN05:{metric_node:'months_3_6',exit_form:'voluntary',platform:'Groww',instrument:'mutual_fund_sip',reported_reason:'supported'},
 SYN12:{metric_node:null,exit_form:null,instrument:null,continuer:null},
 SYN13:{metric_node:null,exit_form:'involuntary',platform:'Groww',instrument:'mutual_fund_sip',continuer:null}
};
const runDir='.local/phase3-synthetic-'+new Date().toISOString().replaceAll(':','-');
const receiptPath=runDir+'/receipt.json';
const status=modelStatus();
if(!status.key_configured||!status.free_plan_confirmed||status.enabled||status.cap_usd!==0)throw Error('Free-only configuration mismatch');
await fs.mkdir(runDir,{recursive:true});
const receipt={kind:'synthetic_development_only',profile:LEAN_REQUEST_PROFILE,started_at:new Date().toISOString(),ids:selected,expectations,results:[],raw_text_stored:false,independent_accuracy:false};
await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2),{flag:'wx'});
const store=openStore();
const env={...process.env,ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_BILLING_MODE:'free',MODEL_SPEND_CAP_USD:'0',MODEL_FREE_MAX_CALLS:'80'};
try{
 for(const id of selected){
  const c=syntheticCases.find(x=>x.id===id);if(!c)throw Error('Missing frozen fixture '+id);
  const row={id,input_hash:sha(c.text),attempts:0,structure_pass:false,comparison:[],telemetry:null,error_code:null};
  if(privateSignals(c.text).length)throw Error('Private text in synthetic fixture');
  try{
   const output=await classify(store,{source_family:'Other',origin:'synthetic_fixture',text:c.text},'lean',{env,fetcher:async(url,options)=>{row.attempts++;return fetch(url,options);}});
   row.structure_pass=true;row.telemetry=output.run.telemetry;
   const result=output.result;
   const get=field=>field==='metric_node'||field==='exit_form'?result[field]:result.material[field];
   for(const [field,expected] of Object.entries(expectations[id])){
    const found=get(field),actual=found?.state==='supported'?found.value:null;
    row.comparison.push({field,expected,actual:field==='reported_reason'&&actual?'supported':actual,pass:expected==='supported'?!!actual:actual===expected});
   }
   if(id==='SYN03'&&result.material.outcome.state==='supported'&&/sip.{0,25}(?:recovered|successful|resumed)/i.test(result.material.outcome.value))row.comparison.push({field:'false_sip_recovery',pass:false});
   if(id==='SYN13'&&result.exit_form.value==='voluntary')row.comparison.push({field:'negation_misread',pass:false});
   await fs.writeFile(runDir+'/'+id+'.json',JSON.stringify({id,proposal:true,synthetic_only:true,result,run:output.run},null,2));
  }catch(error){row.error_code=error.code||'validation_or_transport_failure';row.telemetry=error.telemetry||null;}
  receipt.results.push(row);receipt.updated_at=new Date().toISOString();receipt.ledger=store.spend();
  await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2));
  console.log(JSON.stringify({id,attempts:row.attempts,structure_pass:row.structure_pass,passed:row.comparison.filter(x=>x.pass).length,checked:row.comparison.length,failed_fields:row.comparison.filter(x=>!x.pass).map(x=>x.field),rejected_fields:row.telemetry?.field_rejections||[],http_status:row.telemetry?.http_status||null,prompt_tokens:row.telemetry?.prompt_tokens||null,completion_tokens:row.telemetry?.completion_tokens||null,latency_ms:row.telemetry?.latency_ms||null,finish_reason:row.telemetry?.finish_reason||null,error_code:row.error_code}));
  // The Free ledger requires at least 65 seconds between any two calls.
  if(id!==selected.at(-1))await new Promise(resolve=>setTimeout(resolve,66000));
 }
 receipt.finished_at=new Date().toISOString();
 await fs.writeFile(receiptPath,JSON.stringify(receipt,null,2));
}finally{store.close();}
