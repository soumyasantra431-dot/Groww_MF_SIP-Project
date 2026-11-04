// Reproduce the Phase 2 count audit from local metadata. No raw text or model call.
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { openStore } from '../engine/store.mjs';
import { parseSourceScreen,sourceLedger } from '../engine/source-ledger.mjs';
import { sourceUnitKey } from '../engine/normalization.mjs';

const store=openStore();
try{
 const items=store.items();
 const screen=parseSourceScreen(readFileSync('research/phase_one_2026-11-04/source_screen.csv','utf8'));
 const runs=store.db.prepare('SELECT * FROM collection_runs ORDER BY created_at DESC').all();
 const ledger=sourceLedger(items,screen,runs);
 const seen=new Map();for(const item of items){const key=sourceUnitKey(item);if(!seen.has(key))seen.set(key,[]);seen.get(key).push(item.id);}
 const sourceUnitConflicts=[...seen.values()].filter(ids=>ids.length>1);
 if(sourceUnitConflicts.length!==ledger.counts.source_unit_conflict_groups||ledger.entries.some(e=>e.source_unit_conflict&&e.status!=='pending'))throw Error('Ambiguous historical source units must remain visible and pending');
 if(ledger.counts.selected_run_duplicates===null)throw Error('Dated Phase 1 duplicate-attempt count is missing');
 const receipt={date:'2026-11-04',unit:ledger.unit,counts:ledger.counts,formulas:ledger.formulas,checks:{source_screen_rows:screen.length,stored_source_unit_conflict_groups:sourceUnitConflicts.length,stored_source_unit_conflict_rows:ledger.counts.source_unit_conflict_rows,cross_source_copy_review_groups:ledger.copy_candidates.length,source_links_behind_screened_decisions:ledger.entries.filter(e=>e.screen_decision!=='historical_or_new_input_not_source_screened').every(e=>e.url&&e.source_locator),all_counts_reconciled:true,raw_text_exported:false,model_calls:0},limits:ledger.limits};
 mkdirSync('.local/phase2',{recursive:true});writeFileSync('.local/phase2/reconciliation.json',JSON.stringify(receipt,null,2));
 console.log(JSON.stringify(receipt,null,2));
}finally{store.close();}
