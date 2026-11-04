import { parse } from 'csv-parse/sync';
import { FAMILIES,privateSignals,safeUrl } from './contracts.mjs';
import { sourceRootKey,sourceUnitKey } from './normalization.mjs';

const states=['admitted','pending','rejected'];
const fits=['direct','adjacent_platform','adjacent_platform_experienced','adjacent_experienced','unknown','not_assessed'];
const relevance=['mf_sip_candidate_unreviewed','not_mf_sip','mixed_instrument_review','unknown','not_assessed'];

// This is a metadata ledger. Original post text and identifiers never enter it.
export function parseSourceScreen(csv){
 const rows=parse(csv,{columns:true,bom:true,skip_empty_lines:true});
 const units=new Set();
 for(const r of rows){
  if(!FAMILIES.includes(r.source_family)||!safeUrl(r.url)||!r.source_locator||r.source_locator.length>220||!fits.includes(r.target_fit)||!relevance.includes(r.relevance_screen)||!['admitted_local_unreviewed','excluded'].includes(r.disposition)||r.disposition==='excluded'&&r.relevance_screen!=='not_assessed')throw Error('Invalid source-screen metadata');
  if(r.date&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||new Date(r.date+'T00:00:00Z').toISOString().slice(0,10)!==r.date))throw Error('Invalid source-screen date');
  if(privateSignals(JSON.stringify(r)).length)throw Error('Private detail in source-screen metadata');
  const key=sourceUnitKey(r);if(units.has(key))throw Error('Repeated source-screen unit');units.add(key);
 }
 return rows;
}

export function sourceLedger(items,screenRows,collectionRuns=[]){
 const storedByUnit=new Map();
 for(const r of items){const key=sourceUnitKey(r);if(!storedByUnit.has(key))storedByUnit.set(key,[]);storedByUnit.get(key).push(r);}
 const unitConflicts=[...storedByUnit].filter(([,rs])=>rs.length>1).map(([source_item_id,rs])=>({source_item_id,item_ids:rs.map(r=>r.id),decision:'historical input has several excerpts under one locator; distinct post/speaker is unresolved, keep pending until source review'}));
 const conflictingIds=new Set(unitConflicts.flatMap(x=>x.item_ids));
 const covered=new Set(),entries=[];
 for(const r of screenRows){
  const unit=sourceUnitKey(r),matches=storedByUnit.get(unit)||[],selected=r.disposition==='admitted_local_unreviewed';
  if(selected&&matches.length!==1)throw Error('Selected source-screen unit must match exactly one stored item');
  if(!selected&&matches.length)throw Error('Excluded source-screen unit also appears in stored corpus');
  const item=matches[0];if(item)covered.add(item.id);
  const status=selected?(item.local_use_status==='cleared'?'admitted':'pending'):'rejected';
  entries.push({source_item_id:unit,source_root_id:sourceRootKey(r),item_id:item?.id||null,source_family:r.source_family,url:r.url,date:r.date||null,source_locator:r.source_locator,speaker_position:r.speaker_position||'unknown',status,screen_decision:r.disposition,reason:r.reason||'',target_fit:r.target_fit,relevance:r.relevance_screen,evidence_lane:item?.evidence_lane||'not_stored',review_state:item?.review_state||'not_applicable',local_use_status:item?.local_use_status||'not_applicable',terms_status:item?.terms_status||'not_applicable',copy_review_pending:false,source_unit_conflict:false});
 }
 for(const r of items)if(!covered.has(r.id))entries.push({source_item_id:sourceUnitKey(r),source_root_id:sourceRootKey(r),item_id:r.id,source_family:r.source_family,url:r.url,date:r.date||null,source_locator:r.source_locator||'',speaker_position:'not_assessed',status:conflictingIds.has(r.id)?'pending':r.local_use_status==='cleared'?'admitted':'pending',screen_decision:'historical_or_new_input_not_source_screened',reason:conflictingIds.has(r.id)?'several historical excerpts share this locator; distinct post unresolved':r.local_use_status==='cleared'?'local use cleared in existing ledger':'source-use or source-fit screen pending',target_fit:'not_assessed',relevance:'not_assessed',evidence_lane:r.evidence_lane||'unknown',review_state:r.review_state,local_use_status:r.local_use_status,terms_status:r.terms_status,copy_review_pending:false,source_unit_conflict:conflictingIds.has(r.id)});
 const copies=new Map();for(const r of items)if(r.copy_key){if(!copies.has(r.copy_key))copies.set(r.copy_key,[]);copies.get(r.copy_key).push(r);}
 const copyCandidates=[...copies.values()].filter(rs=>new Set(rs.map(sourceUnitKey)).size>1).map(rs=>({item_ids:rs.map(r=>r.id),source_item_ids:[...new Set(rs.map(sourceUnitKey))],source_roots:[...new Set(rs.map(sourceRootKey))],decision:'possible copied account; separate source items retained, dependency provisionally grouped for conservative corroboration; human review pending'}));
 const copyIds=new Set(copyCandidates.flatMap(c=>c.item_ids));for(const e of entries)if(e.item_id&&copyIds.has(e.item_id))e.copy_review_pending=true;
 const counts=Object.fromEntries(states.map(s=>[s,entries.filter(e=>e.status===s).length]));
 const stored=entries.filter(e=>e.item_id),admitted=entries.filter(e=>e.status==='admitted'),screened=entries.filter(e=>e.screen_decision!=='historical_or_new_input_not_source_screened');
 const admittedScreened=screened.filter(e=>e.status==='admitted'),candidateScreened=admittedScreened.filter(e=>e.relevance==='mf_sip_candidate_unreviewed'),fit={direct:candidateScreened.filter(e=>e.target_fit==='direct').length,adjacent:candidateScreened.filter(e=>e.target_fit.startsWith('adjacent')).length,unknown:candidateScreened.filter(e=>e.target_fit==='unknown').length};
 const laneCounts=Object.fromEntries(['user_voice','context','control','unknown'].map(l=>[l,stored.filter(e=>e.evidence_lane===l).length]));
 const selectedRun=collectionRuns.find(r=>r.route==='bounded_manual_original_page_intake_no_crawler');let runCounts=null;
 if(selectedRun){try{runCounts=typeof selectedRun.counts==='string'?JSON.parse(selectedRun.counts):selectedRun.counts;}catch{throw Error('Invalid collection-run counts');}}
 if(entries.length!==counts.admitted+counts.pending+counts.rejected||stored.length!==items.length||stored.length!==Object.values(laneCounts).reduce((a,b)=>a+b,0)||screened.length!==screenRows.length||candidateScreened.length!==fit.direct+fit.adjacent+fit.unknown)throw Error('Source ledger does not reconcile');
 if(runCounts&&(runCounts.seen!==screened.length||runCounts.selected!==screened.filter(e=>e.screen_decision==='admitted_local_unreviewed').length||runCounts.excluded!==screened.filter(e=>e.status==='rejected').length||runCounts.selected!==runCounts.imported+runCounts.duplicates))throw Error('Phase 1 screen and collection run disagree');
 return {unit:'tracked decisions and stored inputs; not people',counts:{tracked_decisions:entries.length,...counts,stored_items:stored.length,selected_run_screened:screened.length,selected_run_pending:screened.filter(e=>e.status==='pending').length,selected_run_rejected:screened.filter(e=>e.status==='rejected').length,selected_run_duplicates:runCounts?.duplicates??null,screened_local_admitted:admittedScreened.length,screened_relevance_candidates:candidateScreened.length,screened_fit:fit,stored_evidence_lanes:laneCounts,distinct_admitted_source_items:new Set(admitted.map(e=>e.source_item_id)).size,distinct_admitted_source_roots:new Set(admitted.map(e=>e.source_root_id)).size,copy_review_groups:copyCandidates.length,source_unit_conflict_groups:unitConflicts.length,source_unit_conflict_rows:conflictingIds.size,accepted_findings:admitted.filter(e=>e.review_state==='accepted'&&e.terms_status==='cleared').length},formulas:[`${entries.length} tracked decisions = ${counts.admitted} admitted + ${counts.pending} pending + ${counts.rejected} rejected`,`${screened.length} selected-run screened units = ${admittedScreened.length} currently admitted + ${screened.filter(e=>e.status==='pending').length} pending + ${screened.filter(e=>e.status==='rejected').length} rejected`,`${stored.length} stored items = ${Object.entries(laneCounts).map(([k,v])=>v+' '+k).join(' + ')}`],limits:'Admitted means cleared for bounded local use, not a reviewed investor finding. MF-SIP and target-fit screens are assistant-made candidates, not verified classifications. Historical and newly uploaded rows without a source screen remain pending. Repeated historical locators stay pending as separate records, not distinct confirmed posts. Potential cross-site copies are flagged, never deleted; corroboration groups them conservatively until reviewed.',copy_candidates:copyCandidates,unit_conflicts:unitConflicts,entries};
}
