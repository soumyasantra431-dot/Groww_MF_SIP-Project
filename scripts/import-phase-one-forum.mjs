// One dated, manual, rights-screened forum batch. Original text stays in .local.
// This is source intake, not AI coding or a Groww cohort finding.
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { resolve,join } from 'node:path';
import { createHash } from 'node:crypto';
import { openStore } from '../engine/store.mjs';
import { corpusCsv,importCorpus,parseCorpus } from '../engine/intake.mjs';
import { sourceRootKey,sourceUnitKey } from '../engine/normalization.mjs';

const privateDir=resolve('.local/phase1');
const selected=JSON.parse(readFileSync(join(privateDir,'forum-selected-2026-11-04.json'),'utf8'));
const excluded=JSON.parse(readFileSync(join(privateDir,'forum-excluded-2026-11-04.json'),'utf8'));
const register=JSON.parse(readFileSync('research/ENGINE_V1_TERMS_REGISTER.json','utf8'));
const permission=register.find(r=>r.source_family==='Investing forums');
if(!permission?.status?.includes('bounded local use')||permission.checked_on!=='2026-11-04'||permission.url!=='https://tradingqna.com/tos')throw Error('A current TradingQ&A local-use decision is required');
if(!selected.length||!excluded.length)throw Error('Dated selected and excluded manifests are required');
const allowedFits=new Set(['direct','adjacent_platform','adjacent_platform_experienced','adjacent_experienced','unknown']);
const seen=new Set();
for(const r of selected){
 if(r.source_family!=='Investing forums'||new URL(r.url).hostname!=='tradingqna.com'||r.evidence_lane!=='user_voice'||!/^post-\d+$/.test(r.source_locator)||!/^T\d+$/.test(r.independence_group)||!allowedFits.has(r.target_fit)||!r.questions?.split(';').every(q=>/^Q[1-9]$/.test(q))||!r.text?.trim())throw Error('Selected row lacks bounded source, locator, source-fit or text');
 const key=sourceUnitKey(r);if(seen.has(key))throw Error('Repeated selected source unit');seen.add(key);
}
for(const r of excluded){if(new URL(r.url).hostname!=='tradingqna.com'||!/^post-\d+$/.test(r.source_locator)||!r.reason||seen.has(sourceUnitKey({...r,source_family:'Investing forums'})))throw Error('Invalid or overlapping exclusion');}
const columns=['source_family','url','date','text','platform_stated','source_locator','evidence_lane','independence_group'];
const csv=corpusCsv(columns,selected);
parseCorpus(csv); // reject identifiers, invalid URLs/dates and unsupported columns before writing or import
mkdirSync(privateDir,{recursive:true});
writeFileSync(join(privateDir,'forum-intake-2026-11-04.csv'),csv,{encoding:'utf8',mode:0o600});
const store=openStore();
try{
 const intake=importCorpus(store,csv);
 for(const r of selected){
  const id='I-'+createHash('sha256').update(r.url.trim()+'\n'+r.text+'\nlocator:'+r.source_locator).digest('hex').slice(0,20);
  const row=store.item(id);if(!row||row.url!==r.url||row.source_locator!==r.source_locator||row.evidence_lane!=='user_voice')throw Error('Imported source identity mismatch');
  store.db.prepare("UPDATE items SET local_use_status='cleared',terms_status='flagged' WHERE id=?").run(id);
 }
 const counts={seen:selected.length+excluded.length,selected:selected.length,imported:intake.inserted,duplicates:intake.duplicates,excluded:excluded.length,user_voice:selected.length,context:0,direct:selected.filter(r=>r.target_fit==='direct').length,adjacent:selected.filter(r=>r.target_fit.startsWith('adjacent')).length,unknown:selected.filter(r=>r.target_fit==='unknown').length,distinct_source_units:new Set(selected.map(sourceUnitKey)).size,distinct_topic_roots:new Set(selected.map(sourceRootKey)).size};
 if(counts.seen!==counts.selected+counts.excluded||counts.selected!==counts.imported+counts.duplicates||counts.user_voice!==counts.direct+counts.adjacent+counts.unknown)throw Error('Phase 1 accounting does not reconcile');
 const runId=store.logCollection({source_family:'Investing forums',query:'Purposive first-SIP setup, interruption, pause, recovery, ordinary continuation and checking search; original TradingQ&A posts inspected 4 Nov 2026',route:'bounded_manual_original_page_intake_no_crawler',state:'imported_local_review_pending',counts,permission_basis:'TradingQ&A terms section 3, CC BY-NC-SA 3.0, inspected 2026-11-04; 2026-11-01 bounded noncommercial local-use decision; public redistribution held'});
 const metadata=selected.map(r=>({source_family:r.source_family,url:r.url,date:r.date,source_locator:r.source_locator,speaker_position:r.speaker_position|| (r.source_locator==='post-1'?'thread_starter':'reply_author_identity_unverified'),disposition:'admitted_local_unreviewed',relevance_screen:'mf_sip_candidate_unreviewed',target_fit:r.target_fit,questions:r.questions,reported_state:r.state,journey_window:r.window,redaction:r.redaction,independence_group:r.independence_group,reason:'source-linked first-hand account; no Groww target or payment finality inferred'}));
 metadata.push(...excluded.map(r=>({source_family:'Investing forums',url:r.url,date:'',source_locator:r.source_locator,speaker_position:'not_assessed',disposition:'excluded',relevance_screen:'not_assessed',target_fit:'not_assessed',questions:'',reported_state:'',journey_window:'',redaction:'body_not_stored',independence_group:'',reason:r.reason})));
 const metaColumns=['source_family','url','date','source_locator','speaker_position','disposition','relevance_screen','target_fit','questions','reported_state','journey_window','redaction','independence_group','reason'];
 const reportDir='research/phase_one_2026-11-04';mkdirSync(reportDir,{recursive:true});writeFileSync(join(reportDir,'source_screen.csv'),corpusCsv(metaColumns,metadata));
 const questions=Array.from({length:9},(_,i)=>'Q'+(i+1));
 const coverage=questions.map(q=>{const rows=selected.filter(r=>r.questions.split(';').includes(q));return {question:q,candidate_items:rows.length,candidate_roots:new Set(rows.map(sourceRootKey)).size,direct_target_items:rows.filter(r=>r.target_fit==='direct').length,reviewed_answers:0,meaning:'manual candidate tags only; not AI extraction or accepted finding'};});
 writeFileSync(join(reportDir,'question_coverage.csv'),corpusCsv(['question','candidate_items','candidate_roots','direct_target_items','reviewed_answers','meaning'],coverage));
 const receipt={run_id:runId,at:new Date().toISOString(),source_family:'Investing forums',counts,question_coverage:coverage,source_use:'local bounded use only; public redistribution held',model_calls:0};
 writeFileSync(join(privateDir,'run-receipt-2026-11-04.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify({counts,run_id:runId,question_coverage:coverage.map(({question,candidate_items,candidate_roots})=>({question,candidate_items,candidate_roots})),raw_location:'.local/phase1 and .local/raw; ignored',model_calls:0},null,2));
}finally{store.close();}
