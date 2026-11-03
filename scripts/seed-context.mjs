import { readFileSync,existsSync,mkdirSync,writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { openStore } from '../engine/store.mjs';
import { importCorpus,corpusCsv } from '../engine/intake.mjs';
import { csv } from '../engine/analysis.mjs';
import { MATERIAL_FIELDS,unknownDatum } from '../engine/contracts.mjs';
const store=openStore();
try{
 const inputs=[],refs=[];
 for(const file of ['research/pilot_accounts.json','research/public_episodes_2026-10-28.json']){
  for(const r of JSON.parse(readFileSync(file,'utf8')).records){
   for(const key of ['excerpt','counterevidence_excerpt'])if(r[key])inputs.push({source_family:'Reddit',url:r.url,date:r.publication_date||'',text:r[key],origin_id:r.id,scope:'previously inspected original excerpt; not the full post'});
  }
 }
 const batch=JSON.parse(readFileSync('research/web_batch_2026-10-29.json','utf8'));
 const records=batch.records||batch.content_records||Object.values(batch).find(v=>Array.isArray(v)&&v.some(r=>r.id==='B09'));
 for(const r of records||[])if(r.id==='B09'||r.id==='B10')for(const t of (r.quotes||[r.quote]).filter(Boolean))inputs.push({source_family:'Investing forums',url:r.url,date:r.publication_date||'',text:t,origin_id:r.account_id,scope:'previously inspected short original excerpt; author/status context omitted, unknowns preserved'});
 const controls=[
  {source_family:'Other',url:'https://console.groq.com/docs/structured-outputs',date:'',text:'Structured Outputs is a feature that ensures your model responses conform to your provided JSON Schema.',origin_id:'CONTROL-1'},
  {source_family:'Other',url:'https://developers.cloudflare.com/queues/platform/pricing/',date:'',text:'Cloudflare Queues charges for operations and for queues above the included amount on the Workers Paid plan.',origin_id:'CONTROL-2'},
  {source_family:'Other',url:'https://developers.google.com/android-publisher/reply-to-reviews',date:'',text:'The Google Play Developer Reply to Reviews API allows you to view user feedback for your app and reply to this feedback.',origin_id:'CONTROL-3'}
 ];
 inputs.push(...controls.map(r=>({...r,scope:'real official documentation excerpt; deliberately out-of-scope negative control'})));
 if(inputs.length!==20)throw Error(`Expected 20 seed excerpts, found ${inputs.length}; inspect source manifest`);
 for(const r of inputs)r.evidence_lane=r.origin_id.startsWith('CONTROL-')?'control':'user_voice';
 const content=corpusCsv(['source_family','url','date','text','evidence_lane'],inputs);console.log(importCorpus(store,content));
 const supported=(value)=>({state:'supported',value});
 for(const r of inputs){
  const id='I-'+createHash('sha256').update(r.url.trim()+'\n'+r.text).digest('hex').slice(0,20);
  const material=Object.fromEntries(MATERIAL_FIELDS.map(k=>[k,unknownDatum()]));material.source_family=supported(r.source_family);
  if(r.origin_id==='P01') {material.instrument=supported('mutual_fund');material.action_status=supported('completed');}
  if(['P03','P05','P09','P11'].includes(r.origin_id)){material.instrument=supported(r.origin_id==='P09'?'mutual_fund_sip':'sip_unspecified');material.action_status=supported(r.origin_id==='P03'?'intended':'completed');}
  if(r.origin_id==='P03')material.reported_reason=supported('could not afford monthly amounts');
  if(r.origin_id==='P09')material.reported_reason=supported('buy physical gold');
  if(r.origin_id==='P11')material.trigger=supported('salary hike');
  if(r.origin_id.startsWith('CONTROL-'))for(const field of MATERIAL_FIELDS.filter(f=>f!=='source_family'))material[field]={state:'not_applicable',value:null,missing_reason:'not_applicable'};
  refs.push({id,input_sha256:createHash('sha256').update(r.text).digest('hex'),source_url:r.url,input_scope:r.scope,origin_id:r.origin_id,label_basis:'assistant-labelled excerpt reference; NOT independent human verification',material,rubric:'Only the exact excerpt plus source-family metadata is visible to both reference labeller and model. Wider post context excluded. Canonical values require manual semantic adjudication for free text.'});
 }
 mkdirSync('.local/evaluation',{recursive:true});
 if(!existsSync('.local/evaluation/reference_labels.json')||process.argv.includes('--refresh-reference')){
  const predPath='.local/evaluation/predictions.json';if(existsSync(predPath)&&JSON.parse(readFileSync(predPath,'utf8')).length)throw Error('Reference refresh blocked after predictions; create a new version and disclose reuse');
  writeFileSync('.local/evaluation/reference_labels.json',JSON.stringify(refs,null,2));
 }
 if(!existsSync('.local/evaluation/predictions.json'))writeFileSync('.local/evaluation/predictions.json','[]\n');
 if(!existsSync('.dev.vars'))writeFileSync('.dev.vars',readFileSync('.env.example','utf8'));
 mkdirSync('templates',{recursive:true});writeFileSync('templates/corpus.csv','source_family,url,date,text,platform_stated\n');
 console.log({seed_items:inputs.length,reddit_excerpt_items:inputs.filter(r=>r.source_family==='Reddit').length,distinct_reddit_threads:new Set(inputs.filter(r=>r.source_family==='Reddit').map(r=>r.url)).size,reference_labels:refs.length,model_predictions:0,scope:'20 real excerpts, including 3 off-topic documentation controls; not 20 full posts, not target corpus, not an untouched holdout. Terms flagged. No model calls.'});
}finally{store.close();}
