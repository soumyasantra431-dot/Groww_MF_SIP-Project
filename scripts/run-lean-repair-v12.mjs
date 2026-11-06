// One constructed case per invocation. No real source text, corpus write or retry.
import {mkdirSync,writeFileSync,existsSync,readFileSync} from 'node:fs';
import {openStore} from '../engine/store.mjs';
import {classify,modelStatus} from '../engine/provider.mjs';
import {requestSize,buildRequest} from '../engine/request.mjs';

const cases={
 payment:{text:'The second instalment of my mutual fund SIP on Groww failed because my bank balance was low. I paid once manually, but I do not know whether the next scheduled debit will work.',expected:{platform:'Groww',instrument:'mutual_fund_sip',metric_node:'second_instalment',journey_stage:'second_payment',exit_form:'involuntary',action_status:'attempted',reported_reason:'low bank balance',outcome:'manual one-time payment; next scheduled debit unknown',continuer:'unknown'}},
 pause:{text:'I paused my only mutual fund SIP on Groww in month five because I needed money for hospital bills. No instalment was paid this month.',expected:{platform:'Groww',instrument:'mutual_fund_sip',metric_node:'months_3_6',journey_stage:'months_3_6',exit_form:'voluntary',action_status:'completed',reported_reason:'hospital bills',outcome:'paused; no instalment paid this month',continuer:'no'}},
 pause_explicit:{text:'I started my first mutual fund SIP on Groww five months ago. Yesterday I paused that only SIP because my hospital costs rose. Its scheduled instalment this month did not occur.',expected:{platform:'Groww',instrument:'mutual_fund_sip',metric_node:'months_3_6',journey_stage:'months_3_6',exit_form:'voluntary',action_status:'completed',reported_reason:'hospital costs rose',outcome:'scheduled instalment did not occur',continuer:'no'}},
 hypothetical:{text:'If I lose my job, I might stop a SIP next month. I have not started one yet. What would happen?',expected:{metric_node:'unknown',exit_form:'unknown',action_status:'hypothetical',outcome:'unknown',continuer:'unknown'}},
 several:{text:'I stopped one of my two mutual fund SIPs on Groww after eight months because the amount was too high. The other SIP paid successfully this month.',expected:{platform:'Groww',instrument:'mutual_fund_sip',metric_node:'months_7_12',journey_stage:'months_7_12',exit_form:'voluntary',action_status:'completed',reported_reason:'amount too high',outcome:'one SIP stopped; another paid successfully',continuer:'yes'}}
};
const id=process.argv[2];if(!cases[id])throw Error('Choose payment, pause, pause_explicit, hypothetical or several');
const input={source_family:'Other',origin:'synthetic_fixture',text:cases[id].text};
const status=modelStatus();if(!status.key_configured||!status.free_plan_confirmed||status.enabled||status.cap_usd!==0)throw Error('Free-only development configuration mismatch');
const size=requestSize(buildRequest(input,'lean'));if(!size.fits_estimate)throw Error('Synthetic request exceeds local envelope');
const dir='.local/lean-repair-v12';mkdirSync(dir,{recursive:true});const path=`${dir}/${id}.json`;
if(existsSync(path)){
 const prior=JSON.parse(readFileSync(path,'utf8'));
 if(prior.attempts!==0||prior.status!=='held_before_request'||prior.error_code!=='FREE_PACING')throw Error('Synthetic case already called; no silent retry');
}
const report={kind:'synthetic_development_only',case:id,request_profile:size.request_profile,source_text_stored:false,attempts:0,status:'not_started',expected:cases[id].expected};
writeFileSync(path,JSON.stringify(report,null,2));
const store=openStore();try{
 const env={...process.env,ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_BILLING_MODE:'free',MODEL_SPEND_CAP_USD:'0',MODEL_FREE_MAX_CALLS:'1000'};
 try{const output=await classify(store,input,'lean',{env,fetcher:async(url,options)=>{report.attempts++;writeFileSync(path,JSON.stringify(report,null,2));return fetch(url,options);}});report.status='proposal_returned';report.telemetry=output.run.telemetry;report.proposal=output.result;}
 catch(error){report.status=report.attempts?'failed_after_request':'held_before_request';report.error_code=error.code||'validation_or_transport_failure';report.telemetry=error.telemetry||null;}
 report.finished_at=new Date().toISOString();report.ledger=store.spend();writeFileSync(path,JSON.stringify(report,null,2));
 console.log(JSON.stringify({case:id,status:report.status,attempts:report.attempts,error_code:report.error_code||null,tokens:report.telemetry?.total_tokens||null,latency_ms:report.telemetry?.latency_ms||null,finish_reason:report.telemetry?.finish_reason||null,rejected_fields:report.telemetry?.field_rejections||[],proposal:report.proposal||null}));
}finally{store.close();}
