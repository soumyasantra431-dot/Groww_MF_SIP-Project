import {mkdirSync,writeFileSync} from 'node:fs';
import {csv} from '../engine/analysis.mjs';
// Deliberate search coverage, not invented experiences or an instruction to run every combination.
const questions=[
 ['Q1','Expectations and reasons to start',['setup_mandate','first_instalment'],['starting','ordinary_continuer'],'"first SIP" why started expectations', 'Separate original intention from later return disappointment.'],
 ['Q2','Changes after starting',['second_instalment','months_3_6','months_7_12'],['ordinary_continuer','interruption'],'SIP "after starting" experience', 'Look for an actual change and its timing, not advice.'],
 ['Q3','Pause, reduce, stop and legitimate exits',['first_instalment','months_3_6','months_7_12'],['interruption','informed_pause'],'"SIP" pause reduce stop reason', 'Distinguish affordability, decision and execution; no market-root-cause presumption.'],
 ['Q4','Checking behaviour and frequency',['first_instalment','months_3_6','unknown'],['ordinary_continuer','uncertain'],'"SIP" "check portfolio" "how often"', 'Capture stated frequency and reference period; unknown is expected but not predetermined.'],
 ['Q5','Meaning and execution inside the app',['setup_mandate','first_instalment','second_instalment'],['interruption','uncertain'],'"Groww SIP" "pending" "XIRR"', 'Distinguish unclear status from an actual failed contribution.'],
 ['Q6','Outside-app actions and information',['first_instalment','months_3_6','recovery'],['interruption','recovery'],'"SIP" "bank" "support" "restarted"', 'Record who was contacted and action taken; replies are not author actions.'],
 ['Q7','Continuers, recovery and contrast',['months_3_6','months_7_12','recovery'],['ordinary_continuer','recovery'],'"SIP" "still investing" "one year"', 'Test protective cues and rival explanations without assuming continuation is always beneficial.'],
 ['Q8','Circumstances and changes',['setup_mandate','months_3_6','months_7_12'],['ordinary_continuer','informed_pause'],'"SIP" "salary" "job loss" "afford"', 'Use stated income pattern, funds source and obligations; never infer demographic segments.'],
 ['Q9','Unmet needs and existing workarounds',['first_instalment','months_3_6','recovery'],['interruption','ordinary_continuer'],'"SIP" "wish" "instead" "workaround"', 'Capture desired progress and current workaround without treating feature requests as validated demand.']
];
const stateQueries={starting:'"first SIP"',ordinary_continuer:'"still investing" OR "never missed" OR "one year SIP update"',interruption:'"SIP failed autopay" OR "SIP not deducted" OR "SIP instalment pending" OR "should I stop my SIP negative returns"',informed_pause:'"paused SIP job loss" OR "reduced SIP" OR "paused for expenses"',recovery:'"restarted my SIP" OR "SIP payment resumed"',uncertain:'"XIRR vs returns" OR "SIP pending" OR "how often"'};
const rows=[];
for(const [question,purpose,windows,states,base,decision]of questions)for(const journey_window of windows)for(const reported_state of states){
 const term=journey_window==='setup_mandate'?'setup':journey_window==='first_instalment'?'first instalment':journey_window==='second_instalment'?'second instalment':journey_window==='months_3_6'?'first six months':journey_window==='months_7_12'?'first year':journey_window==='recovery'?'restarted':'';
 rows.push({query_id:'QUERY-'+String(rows.length+1).padStart(3,'0'),question,purpose,journey_window,reported_state,query:`Groww mutual fund SIP ${base} ${term} ${stateQueries[reported_state]}`.trim(),core_families:'Play Store; Reddit; Investing forums',preferred_route:['Q5','Q3'].includes(question)?'Store export for short execution/meaning signals; Reddit/forums for chronology':'Reddit/forums first; store export for contrast',support_only_for_named_gap:question==='Q1'||question==='Q6'?'YouTube: stated influence/information gap, only with permitted use':'App Store: missing execution contrast, only with permitted export',decision_use:decision,status:'planned_not_run'});
}
mkdirSync('research/depth_addendum_2026-10-31',{recursive:true});
writeFileSync('research/depth_addendum_2026-10-31/query_queue.csv',csv(Object.keys(rows[0]),rows));
console.log({planned_query_cells:rows.length,executed:0,corpus_items_created:0,note:'Query cells are a coverage map, not mandatory parallel workstreams. Simplify Boolean phrases to source search syntax; log actual executed query. Search terms do not establish the author’s journey window or cohort.'});
