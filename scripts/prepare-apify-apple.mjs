import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {normalizeApifyApple} from '../engine/apify-apple.mjs';
import {corpusCsv,importCorpus} from '../engine/intake.mjs';
import {INPUT_COLUMNS} from '../engine/collection.mjs';
import {openStore} from '../engine/store.mjs';
import {parseSourceScreen} from '../engine/source-ledger.mjs';

const args=process.argv.slice(2),options={};
for(let i=0;i<args.length;i++){if(args[i]==='--import')options.import=true;else if(args[i].startsWith('--')&&args[i+1]&&!args[i+1].startsWith('--'))options[args[i].slice(2)]=args[++i];else throw Error('Use --file export.csv --run-id ApifyRunId --screen-config decisions.json [--import]');}
if(!options.file||!/^[A-Za-z0-9]{10,30}$/.test(options['run-id']||'')||!options['screen-config'])throw Error('Export file, Apify run ID and source-screen decisions required');
const raw=readFileSync(resolve(options.file),'utf8'),sha256=createHash('sha256').update(raw).digest('hex').toUpperCase();
const {rows,counts}=normalizeApifyApple(raw),config=JSON.parse(readFileSync(resolve(options['screen-config']),'utf8'));
const selected=new Set(config.selected),thin=new Set(config.thin),cross=new Set(config.cross_instrument);
if([...selected,...thin,...cross].length!==new Set([...selected,...thin,...cross]).size||rows.some(r=>![...selected,...thin,...cross].includes(r.source_locator))||rows.length!==selected.size+thin.size+cross.size)throw Error('Apple source-screen decisions must account for each topic hit exactly once');
const outDir=resolve('.local','apify-apple',options['run-id']);mkdirSync(outDir,{recursive:true});
const metadata=rows.map(r=>{const use=selected.has(r.source_locator);return {source_family:'App Store',url:r.url,date:r.date,source_locator:r.source_locator,speaker_position:'review_author',disposition:use?'admitted_local_unreviewed':'excluded',relevance_screen:use?'mf_sip_candidate_unreviewed':'not_assessed',target_fit:use?'unknown':'not_assessed',questions:use?'Q2|Q3|Q5|Q9':'',reported_state:use?'adjustment_attempted':'not_assessed',journey_window:'unknown',redaction:r.text.includes('[amount redacted]')?'exact_amount_redacted':'none',independence_group:'',reason:use?'First-person SIP adjustment failure reported; Apple source link did not expose the exact review in browser; original verification pending':cross.has(r.source_locator)?'Stock-only XIRR review, not MF/SIP':'General app praise, no SIP action or outcome'};});
const screenFile=join(outDir,'source_screen.csv');writeFileSync(screenFile,corpusCsv(Object.keys(metadata[0]),metadata),{mode:0o600});parseSourceScreen(readFileSync(screenFile,'utf8'));
const candidates=rows.filter(r=>selected.has(r.source_locator));writeFileSync(join(outDir,'candidate.csv'),corpusCsv(INPUT_COLUMNS,rows),{mode:0o600});
let imported=null;const store=openStore();try{if(options.import)imported=importCorpus(store,corpusCsv(INPUT_COLUMNS,candidates));store.logCollection({source_family:'App Store',query:'Groww Apple India app; newest 30 reviews; no star filter; local MF/SIP/XIRR screen',route:'apify_zkill3r_apple_export',state:options.import?'selected_local_pending_original_verification_source_use_and_coding':'normalized_candidates_not_imported',counts:{...counts,selected:candidates.length,thin:thin.size,cross_instrument:cross.size,imported:imported?.inserted??0,duplicate_imports:imported?.duplicates??0},permission_basis:'User-authorized bounded Apify Free collection; public Apple review URL opens the app reviews page but exact review not independently visible; downstream source-use/model-processing decision pending'});store.meta('apify_apple_'+options['run-id'],{sha256,selected:candidates.length,imported:imported?.inserted??0});}finally{store.close();}
const summary={run_id:options['run-id'],raw_sha256:sha256,counts,selected:candidates.length,thin:thin.size,cross_instrument:cross.size,imported:imported?.inserted??0,duplicate_imports:imported?.duplicates??0,original_review_verified:false,model_calls:0,contains_reviewer_names:false,note:'Selected items are provisional. App Store page does not independently display the specific review from its fragment URL. No first-year Groww cohort fit or retention claim.'};
writeFileSync(join(outDir,'summary.json'),JSON.stringify(summary,null,2),{mode:0o600});console.log(JSON.stringify(summary,null,2));
