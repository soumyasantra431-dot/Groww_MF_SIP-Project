import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { resolve,join } from 'node:path';
import { createHash } from 'node:crypto';
import { normalizeApifyPlay } from '../engine/apify-play.mjs';
import { corpusCsv,importCorpus } from '../engine/intake.mjs';
import { INPUT_COLUMNS } from '../engine/collection.mjs';
import { openStore } from '../engine/store.mjs';
import { parseSourceScreen } from '../engine/source-ledger.mjs';

const args=process.argv.slice(2),options={};
for(let i=0;i<args.length;i++){if(args[i]==='--import')options.import=true;else if(args[i].startsWith('--')&&args[i+1]&&!args[i+1].startsWith('--'))options[args[i].slice(2)]=args[++i];else throw Error('Use --file export.csv --run-id ApifyRunId [--screen-config decisions.json --import]');}
if(!options.file||!/^[A-Za-z0-9]{10,30}$/.test(options['run-id']||'')||options.import&&!options['screen-config'])throw Error('Give an export file and Apify run ID; import also requires an independently reviewed screen config');
const raw=readFileSync(resolve(options.file),'utf8');
const sha256=createHash('sha256').update(raw).digest('hex').toUpperCase();
const {rows,counts}=normalizeApifyPlay(raw);
const runId=options['run-id'],outDir=resolve('.local','apify-play',runId);mkdirSync(outDir,{recursive:true});
const files=[];
for(let i=0;i<rows.length;i+=200){const file=join(outDir,`candidate-${String(i/200+1).padStart(3,'0')}.csv`);writeFileSync(file,corpusCsv(INPUT_COLUMNS,rows.slice(i,i+200)),{mode:0o600});files.push(file);}
let screenCounts=null,importResult=null,screenFile=null;
if(options['screen-config']){
 const config=JSON.parse(readFileSync(resolve(options['screen-config']),'utf8'));
 if(config.sha256!==sha256||!Array.isArray(config.selected)||!Array.isArray(config.needs_review)||!Array.isArray(config.cross_instrument))throw Error('Screen decisions do not match this frozen export');
 const decisions=new Map();
 for(const x of config.selected){if(!Number.isInteger(x.row)||!x.reason||!Array.isArray(x.questions)||decisions.has(x.row))throw Error('Invalid selected source-screen decision');decisions.set(x.row,{kind:'selected',...x});}
 for(const kind of ['needs_review','cross_instrument'])for(const n of config[kind]){if(!Number.isInteger(n)||decisions.has(n))throw Error('Overlapping source-screen decision');decisions.set(n,{kind});}
 if([...decisions.keys()].some(n=>n<1||n>rows.length))throw Error('Source-screen row outside frozen export');
 const metadata=[],selected=[];
 rows.forEach((r,i)=>{
  const d=decisions.get(i+1)||{kind:'thin'};
  if(d.kind==='selected')selected.push(r);
  metadata.push({source_family:'Play Store',url:r.url,date:r.date,source_locator:r.source_locator,speaker_position:'review_author',disposition:d.kind==='selected'?'admitted_local_unreviewed':'excluded',relevance_screen:d.kind==='selected'?'mf_sip_candidate_unreviewed':'not_assessed',target_fit:d.kind==='selected'?(d.target_fit||'unknown'):'not_assessed',questions:d.kind==='selected'?d.questions.join('|'):'',reported_state:d.kind==='selected'?(d.reported_state||'unknown'):'not_assessed',journey_window:d.kind==='selected'?(d.journey_window||'unknown'):'not_assessed',redaction:r.text.includes('[amount redacted]')?'exact_amount_redacted':'none',independence_group:'',reason:d.kind==='selected'?d.reason:d.kind==='cross_instrument'?'IPO, stock or other product issue; keyword match is not an MF-SIP account':d.kind==='needs_review'?'MF/SIP relation or first-hand action unclear; held for further review':'Bare praise, general opinion or thin mention; cannot answer the discovery questions'});
 });
 const columns=Object.keys(metadata[0]);screenFile=join(outDir,'source_screen.csv');writeFileSync(screenFile,corpusCsv(columns,metadata),{mode:0o600});parseSourceScreen(readFileSync(screenFile,'utf8'));
 screenCounts={selected:selected.length,needs_review:config.needs_review.length,cross_instrument:config.cross_instrument.length,thin:rows.length-selected.length-config.needs_review.length-config.cross_instrument.length};
 if(Object.values(screenCounts).reduce((a,b)=>a+b,0)!==rows.length)throw Error('Screen counts do not reconcile');
 if(options.import){const store=openStore();try{importResult=importCorpus(store,corpusCsv(INPUT_COLUMNS,selected));store.logCollection({source_family:'Play Store',query:'Groww; India; English; newest; since 2025-05-01; SIP|mutual fund|mandate|autopay|instalment|installment|XIRR',route:'apify_k_data_lab_keyword_export',state:'selected_local_pending_source_use_and_coding',counts:{...counts,...screenCounts,imported:importResult.inserted,duplicate_imports:importResult.duplicates},permission_basis:'User-authorized bounded Apify Free collection; public Play review IDs spot-checked; downstream source-use and model-processing decision pending'});store.meta('apify_play_'+runId,{sha256,screenCounts,imported:importResult.inserted});}finally{store.close();}}
}
else{const store=openStore();try{if(!store.meta('apify_play_'+runId)){store.logCollection({source_family:'Play Store',query:'Groww; India; English; newest; since 2025-05-01; SIP|mutual fund|mandate|autopay|instalment|installment|XIRR',route:'apify_k_data_lab_keyword_export',state:'normalized_candidates_not_source_screened_or_imported',counts,permission_basis:'User-authorized bounded Apify Free collection; public Play review ID spot check; downstream source-use and model-processing decision pending'});store.meta('apify_play_'+runId,{sha256,screenCounts:null,imported:0});}}finally{store.close();}}
const summary={run_id:runId,raw_sha256:sha256,counts,screen_counts:screenCounts,imported:importResult?.inserted??0,duplicate_imports:importResult?.duplicates??0,normalized_files:files,source_screen_file:screenFile,contains_reviewer_names:false,model_calls:0,note:'Candidate count is not first-time Groww investor count or retention prevalence. Assistant selection is provisional; local source use and coding remain pending.'};
writeFileSync(join(outDir,'summary.json'),JSON.stringify(summary,null,2),{mode:0o600});
console.log(JSON.stringify(summary,null,2));
