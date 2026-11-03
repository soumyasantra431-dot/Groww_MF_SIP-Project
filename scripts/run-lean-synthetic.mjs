// One synthetic-only live development check. Local output is never research evidence.
import fs from 'node:fs/promises';import {openStore} from '../engine/store.mjs';import {classify} from '../engine/provider.mjs';import {modelStatus} from '../engine/provider.mjs';
const path='.local/lean-synthetic-2026-11-03-field-audit-v7-call.json';
const input={source_family:'Other',origin:'synthetic_fixture',text:'I started a mutual fund SIP on Groww for the first time. I checked that SIP in the app. The second instalment failed because my bank balance was low. I then paid it manually. I have not stopped the SIP.'};
const state=modelStatus();if(!state.key_configured||!state.free_plan_confirmed||state.enabled||state.cap_usd!==0)throw Error('Local Free-only configuration mismatch');
const store=openStore();const out={kind:'synthetic_development_only',source:'constructed_fixture',started_at:new Date().toISOString(),input_text_stored:false,attempts:0};
try{
 await fs.writeFile(path,JSON.stringify(out,null,2),{flag:'wx'});
 const env={...process.env,ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_BILLING_MODE:'free',MODEL_SPEND_CAP_USD:'0',MODEL_FREE_MAX_CALLS:'40'};
 try{const r=await classify(store,input,'lean',{env,fetcher:async(url,options)=>{out.attempts++;await fs.writeFile(path,JSON.stringify(out,null,2));return fetch(url,options);}});out.status='validated_structure';out.telemetry=r.run.telemetry;out.derived_result=r.result;}
 catch(e){out.status=out.attempts?'failed_after_request':'held_before_request';out.error_code=e.code||'validation_or_transport_failure';out.telemetry=e.telemetry||null;if(!out.attempts)out.local_preflight_reason=String(e.message).slice(0,200);}
 out.finished_at=new Date().toISOString();out.ledger=store.spend();await fs.writeFile(path,JSON.stringify(out,null,2));console.log(JSON.stringify({status:out.status,attempts:out.attempts,telemetry:out.telemetry,error_code:out.error_code||null,local_preflight_reason:out.local_preflight_reason||null,ledger:out.ledger}));
}finally{store.close();}
