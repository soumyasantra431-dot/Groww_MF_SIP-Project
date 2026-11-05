import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { openStore } from '../engine/store.mjs';
import { importCorpus,originalInput } from '../engine/intake.mjs';
import { reviewedFieldDatum } from '../engine/manual-review.mjs';
import { parseSourceScreen,sourceLedger } from '../engine/source-ledger.mjs';
import { corpusReadiness,driverEvidence } from '../engine/scope.mjs';
import { researchPlan } from '../engine/research-plan.mjs';
import { questionCards } from '../engine/question-cards.mjs';
import { reviewedAnswers,saveReviewedAnswer } from '../engine/answer-review.mjs';
import { filtered,rollup,selectTierB,deckExports } from '../engine/analysis.mjs';
import { modelStatus } from '../engine/provider.mjs';
import { privateSignals } from '../engine/contracts.mjs';
import { sourceReviewUrl } from '../engine/normalization.mjs';
import { summarizeSurvey } from '../engine/survey-secondary.mjs';
import { snapshot } from './pipeline.mjs';
const port=Number(process.env.PORT)||4317,origin=`http://127.0.0.1:${port}`,store=openStore();
store.db.prepare("UPDATE runs SET state='error',error='Interrupted process; inspect spend reservations before resuming' WHERE state='running'").run();
const vite=await createViteServer({server:{middlewareMode:true,fs:{deny:['**/.local/**','**/.dev.vars*','**/.env*','**/research/**','**/exports/**','**/.git/**','**/*.sqlite*']}},appType:'spa'});
let active=false;
function developmentStatus(){try{const r=JSON.parse(readFileSync('.local/lean-frozen-2026-11-03-v7-development-reuse/development-comparison.json','utf8'));const x=r.exact_label_comparison.source_text;return {kind:r.kind,inputs:r.input_count,requests:r.model_requests,structural_proposals:r.structure_pass,whole_item_failures:r.processing_failures,rejected_fields:r.field_rejections.length,ambiguous_anchors:r.ambiguous_anchor_fields.length,provider_tokens:r.measured_tokens,latency_sum_ms:r.latency_ms.sum,supported:{exact:x.C,different_supported:x.W,abstained:x.A,denominator:x.K},unknown:{preserved:x.unknown_retention.numerator,denominator:x.unknown_retention.denominator},decision:'failed development gate; extraction, batch and live paste held',independent_accuracy:false};}catch{return null;}}
function surveySecondary(){try{return summarizeSurvey(JSON.parse(readFileSync('research/private/survey_coded_2026-10-29.json','utf8')));}catch{return {evidence_lane:'private_written_survey_secondary',available:false,corpus_included:false};}}
function send(res,value,status=200){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));}
async function body(req){let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>6e6)throw Error('Request too large');chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString());}catch{throw Error('Invalid JSON request');}}
createServer(async(req,res)=>{
 try{
  if(!['127.0.0.1:'+port,'localhost:'+port].includes(req.headers.host))return send(res,{error:'Loopback host required'},403);
  const url=new URL(req.url,origin);
  const path=decodeURIComponent(url.pathname).replaceAll('\\','/');
  if(/(^|\/)(\.local|\.dev\.vars[^/]*|\.env[^/]*|research|exports|\.git|@fs)(\/|$)|\.sqlite/i.test(path))return send(res,{error:'Private local path'},403);
  if(!url.pathname.startsWith('/api/'))return vite.middlewares(req,res,()=>send(res,{error:'Not found'},404));
  if(req.method==='POST'&&(req.headers.origin&&![origin,`http://localhost:${port}`].includes(req.headers.origin)||!req.headers['content-type']?.startsWith('application/json')))return send(res,{error:'Same-origin JSON required'},403);
  if(req.method==='GET'&&url.pathname==='/api/workspace'){
   const all=store.items(),items=filtered(all,Object.fromEntries(url.searchParams)),collectionRuns=store.db.prepare('SELECT * FROM collection_runs ORDER BY created_at DESC LIMIT 30').all();
   const screen=[
    ...parseSourceScreen(readFileSync('research/phase_one_2026-11-04/source_screen.csv','utf8')),
    ...parseSourceScreen(readFileSync('research/phase_one_2026-11-05/source_screen_additions.csv','utf8')),
   ];
   return send(res,{mode:'local',items:items.map(r=>({...r,source_review_url:sourceReviewUrl(r)})),research_plan:researchPlan(items),question_cards:questionCards(all,{approvedAnswers:reviewedAnswers(store,all)}),confirmed_case_readings:store.meta('fellow_confirmed_case_readings_2026_11_05'),rollup:rollup(items),source_ledger:sourceLedger(all,screen,collectionRuns),readiness:corpusReadiness(all),drivers:driverEvidence(items),survey_secondary:surveySecondary(),model:modelStatus(),pipeline:{lean_batch_ready:false,live_paste_ready:false,reason:'Lean extraction failed its development quality gate; source-reviewed manual evidence is the current fallback. Batch and live paste remain held.'},spend:store.spend(),selection:selectTierB(all),active,quality:store.meta('evaluation'),development:developmentStatus(),collection_runs:collectionRuns,runs:store.db.prepare('SELECT id,item_id,tier,state,attempts,error,created_at,model FROM runs ORDER BY created_at DESC LIMIT 30').all()});
  }
  if(req.method==='GET'&&url.pathname==='/api/terms'){return send(res,JSON.parse(readFileSync('research/ENGINE_V1_TERMS_REGISTER.json','utf8')));}
  if(req.method==='GET'&&url.pathname==='/api/review-source'){
   const r=store.item(url.searchParams.get('id'));
   if(!r||r.origin!=='corpus'||r.local_use_status!=='cleared')return send(res,{error:'Original unavailable for local review under the current source-use decision'},403);
   const source=originalInput(store,r.id);
   if(privateSignals(source.text).length)throw Error('Original contains private data; remove it before review');
   return send(res,{id:r.id,text:source.text,url:sourceReviewUrl(r),source_locator:r.source_locator,local_only:true,warning:'Original text is displayed only in this local review session. Open the source link to check context and speaker.'});
  }
  if(req.method!=='POST')return send(res,{error:'Not found'},404);
  const b=await body(req);
  if(url.pathname==='/api/kill'){process.env.MODEL_KILL_SWITCH='true';return send(res,{note:'Model kill switch on. New provider calls are disabled; an in-flight call may still complete.'});}
  if(url.pathname==='/api/import')return send(res,importCorpus(store,b.csv));
  if(url.pathname==='/api/select-b')return send(res,selectTierB(store.items()));
  if(url.pathname==='/api/batch')return send(res,{error:'Batch is held: the lean classifier is not yet integrated with the reviewed evidence ledger. No model call was made.'},503);
  if(url.pathname==='/api/classify')return send(res,{error:'Live paste is held until lean structure and source checks pass. No model call was made.'},503);
  if(url.pathname==='/api/review'){
   const r=store.item(b.id);if(!r)throw Error('Unknown item');
   if(!['proposal','accepted','rejected','needs_review'].includes(b.state))throw Error('Invalid review state');
   if(!b.reason?.trim()||privateSignals(b.reason).length)throw Error('A non-identifying review reason is required');
   if(b.state==='accepted'&&(!r.tier_a||r.origin!=='corpus'||r.local_use_status!=='cleared'||b.checked_original!==true))throw Error('Accept only a locally permitted, coded real source after checking its original');
   store.db.prepare('INSERT INTO corrections(id,item_id,old_value,new_value,reason,actor,created_at) VALUES(?,?,?,?,?,?,?)').run(randomUUID(),b.id,r.review_state,b.state,b.reason.slice(0,400),'local_reviewer',new Date().toISOString());
   store.db.prepare('UPDATE items SET review_state=?,revision=revision+1 WHERE id=?').run(b.state,b.id);store.meta('snapshot_stale',true);return send(res,{updated:true});
  }
  if(url.pathname==='/api/approve-answer')return send(res,saveReviewedAnswer(store,b));
  if(url.pathname==='/api/name-opportunity'){
   const r=store.item(b.id),name=String(b.name||'').trim(),why=String(b.reason||'').trim();
   if(!r?.tier_a||r.review_state!=='accepted'||r.local_use_status!=='cleared')throw Error('Accept source evidence and clear it for local use before naming a candidate');
   if(!name||name.length>140||!why||why.length>400||privateSignals(name+' '+why).length)throw Error('Use a short non-identifying problem name and source-based reason');
   store.db.prepare('INSERT INTO corrections(id,item_id,old_value,new_value,reason,actor,created_at) VALUES(?,?,?,?,?,?,?)').run(randomUUID(),b.id,r.hypothesis||'',name,why,'local_reviewer',new Date().toISOString());
   store.db.prepare('UPDATE items SET hypothesis=?,revision=revision+1 WHERE id=?').run(name,b.id);store.meta('snapshot_stale',true);
   return send(res,{updated:true,note:'Candidate problem named by researcher; compare its reviewed sources before deciding what to investigate.'});
  }
  if(url.pathname==='/api/correct-tags'){
   const {NODES,EXITS,privateSignals}=await import('../engine/contracts.mjs');const r=store.item(b.id);if(!r?.tier_a)throw Error('An actual classification is required before correction');
   if(!NODES.includes(b.metric_node)||!EXITS.includes(b.exit_form)||!b.reason?.trim()||privateSignals(b.reason).length)throw Error('Valid tags and a source-based correction reason required');
   const old=r.tier_b?JSON.parse(r.tier_b):JSON.parse(r.tier_a),value=r.tier_b?old.classification:old;
   const previous={metric_node:value.metric_node,exit_form:value.exit_form};value.metric_node=b.metric_node;value.exit_form=b.exit_form;
   if(previous.metric_node===b.metric_node&&previous.exit_form===b.exit_form)throw Error('No changed tags to log');
   store.db.prepare('INSERT INTO corrections(id,item_id,old_value,new_value,reason,actor,created_at) VALUES(?,?,?,?,?,?,?)').run(randomUUID(),b.id,JSON.stringify(previous),JSON.stringify({metric_node:b.metric_node,exit_form:b.exit_form}),b.reason.slice(0,400),'local_reviewer',new Date().toISOString());
   store.setResult(b.id,r.tier_b?'b':'a',old);store.meta('snapshot_stale',true);return send(res,{note:'Actual tag correction logged; dependent exports require regeneration.'});
  }
  if(url.pathname==='/api/correct-field'){
   const {MATERIAL_FIELDS,privateSignals}=await import('../engine/contracts.mjs');const r=store.item(b.id);if(!r?.tier_a)throw Error('Actual classification required');
   if(b.field==='source_family'||!MATERIAL_FIELDS.includes(b.field)||!['supported','unknown','not_applicable'].includes(b.state)||!b.reason?.trim()||privateSignals(b.reason).length)throw Error('Valid editable field, state and source-based reason required');
   if(b.state==='supported'&&(!b.value?.trim()||b.value.length>220||privateSignals(b.value).length))throw Error('A short non-identifying value is required');
   const old=r.tier_b?JSON.parse(r.tier_b):JSON.parse(r.tier_a),c=r.tier_b?old.classification:old;
   if(r.local_use_status!=='cleared')throw Error('Source is not cleared for local review');
   const value=reviewedFieldDatum(originalInput(store,b.id).text,{state:b.state,value:b.value,quote:b.quote}),previous=c.material[b.field];
   if(JSON.stringify(previous)===JSON.stringify(value))throw Error('No changed value to log');
   c.material[b.field]=value;
   store.db.prepare('INSERT INTO corrections(id,item_id,old_value,new_value,reason,actor,created_at) VALUES(?,?,?,?,?,?,?)').run(randomUUID(),b.id,JSON.stringify({[b.field]:previous}),JSON.stringify({[b.field]:value}),b.reason.slice(0,400),'local_reviewer',new Date().toISOString());
   store.setResult(b.id,r.tier_b?'b':'a',old);store.meta('snapshot_stale',true);return send(res,{note:'Actual field correction logged; review status returned to proposal.'});
  }
  if(url.pathname==='/api/terms-review'){
   if(!store.item(b.id)||!['pending','flagged','restricted','cleared'].includes(b.state)||!b.reason?.trim()||privateSignals(b.reason).length)throw Error('A source-specific permission basis is required');
   const old=store.item(b.id).terms_status;if(old===b.state)throw Error('No changed terms decision to log');
   store.db.prepare('INSERT INTO corrections(id,item_id,old_value,new_value,reason,actor,created_at) VALUES(?,?,?,?,?,?,?)').run(randomUUID(),b.id,old,b.state,b.reason.slice(0,400),'local_rights_review',new Date().toISOString());
   store.db.prepare('UPDATE items SET terms_status=?,revision=revision+1 WHERE id=?').run(b.state,b.id);store.meta('snapshot_stale',true);return send(res,{note:'Terms decision recorded locally. A user label is not proof of source permission.'});
  }
  if(url.pathname==='/api/export'){
   const ex=deckExports(store.items());mkdirSync('exports',{recursive:true});for(const[k,v]of Object.entries(ex))writeFileSync('exports/'+k+(k==='flow'?'.mmd':'.csv'),v);return send(res,{files:['exports/triangulation.csv','exports/opportunities.csv','exports/flow.mmd'],warning:'Researcher assessment fields remain unresolved; no fabricated survey alignment.'});
  }
  if(url.pathname==='/api/snapshot'){const s=snapshot(store);mkdirSync('public',{recursive:true});writeFileSync('public/snapshot.json',JSON.stringify(s,null,2));store.meta('snapshot_stale',false);return send(res,{snapshot_items:s.items.length,deployed:false});}
  return send(res,{error:'Not found'},404);
 }catch(e){send(res,{error:String(e.message).slice(0,240)},400);}
}).listen(port,'127.0.0.1',()=>console.log(`SIP Research Workspace: ${origin}\nLocal only; raw text stays in ignored .local/raw; no request-body logs.`));
