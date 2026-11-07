import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openStore } from '../engine/store.mjs';
import { importCorpus } from '../engine/intake.mjs';
import { rollup,selectTierB,deckExports,evaluate } from '../engine/analysis.mjs';
import { corpusReadiness,driverEvidence,rootGroups } from '../engine/scope.mjs';
import { reviewedAnswers } from '../engine/answer-review.mjs';
import { questionCards } from '../engine/question-cards.mjs';
import { preliminaryComparison } from '../engine/preliminary-comparison.mjs';
import { researchPlan } from '../engine/research-plan.mjs';
import { privateSignals } from '../engine/contracts.mjs';
function developmentSummary(){try{
 const r=JSON.parse(readFileSync('.local/lean-frozen-2026-11-06-v12-development-reuse/development-comparison.json','utf8'));
 const x=r.episode_only_diagnostic.source_text;
 return {kind:r.kind,inputs:r.input_count,episode_inputs:r.episode_only_diagnostic.denominator_items,requests:r.model_requests,structural_proposals:r.structure_pass,processing_failures:r.processing_failures,supported:{exact:x.C,denominator:x.K},unknown:{preserved:x.unknown_retention.numerator,denominator:x.unknown_retention.denominator},decision:'failed development gate; live AI held',independent_accuracy:false};
}catch{return null;}}
export function snapshot(store){
 const all=store.items();const rs=all.filter(r=>r.origin==='corpus'&&r.review_state==='accepted'&&r.terms_status==='cleared'&&(r.tier_a||r.tier_b));
 const roots=rootGroups(all);
 const items=rs.filter(r=>!['context','control'].includes(r.evidence_lane)).map(r=>({id:r.id,source_family:r.source_family,url:r.url,source_locator:r.source_locator,date:r.date,tier_a:r.tier_a,tier_b:r.tier_b,review_state:r.review_state,coding_origin:r.coding_origin,hypothesis:r.hypothesis,terms_status:r.terms_status,origin:r.origin,revision:r.revision,evidence_lane:r.evidence_lane,independence_group:'DEP-'+roots.get(r.id)}));
 const answers=reviewedAnswers(store,all,{publicOnly:true});
 // Fellow-endorsed directions are a separate publication lane: short factual
 // research interpretations and source links, never raw posts, source labels
 // promoted to accepted, or approved answers. Publication still needs review.
 const provisional_cards=questionCards(all).filter(c=>c.working_reading).map(c=>({
  id:c.id,title:c.title,status:'fellow_endorsed_provisional',direct_answer:null,
  working_reading:c.working_reading,signal_breakdown:c.signal_breakdown,source_root_count:0,reviewed_root_denominator:0,
  unreviewed_lead_roots:c.unreviewed_lead_roots,rival_to_check:c.rival_to_check,
  unknown:c.unknown,next_decision:c.next_decision
 }));
 const comparison=preliminaryComparison(all);
 const preliminary_comparison={status:'fellow_endorsed_provisional',candidates:comparison.candidates,
  limitation:'Unscored research leads from unreviewed, adjacent or eligibility-unknown accounts; not selected Groww problems.'};
 if((provisional_cards.length||preliminary_comparison.candidates.length)&&(provisional_cards.length!==9||preliminary_comparison.candidates.length!==4))throw Error('Editorial publication packet changed; inspect all nine readings and four leads before snapshot');
 if(privateSignals(JSON.stringify({provisional_cards,preliminary_comparison})).length)throw Error('Private pattern in editorial publication packet');
 const plan=researchPlan(all),global_rollup=rollup(all),localReadiness=corpusReadiness(all);
 return {schema:'sip-snapshot-v1-depth-addendum',editorial_briefs_version:1,created_at:new Date().toISOString(),review_basis:'Fellow-endorsed provisional directions; zero source-level approval unless separately recorded',items,approved_answers:Object.fromEntries(Object.entries(answers).filter(([,v])=>v.status==='researcher_approved')),provisional_cards,preliminary_comparison,global_research_plan:{sources:plan.sources},global_rollup:{coded:global_rollup.coded,cells:global_rollup.cells.map(({metric_node,exit_form,count})=>({metric_node,exit_form,count}))},local_readiness:{user_voice_records:localReadiness.user_voice_records,distinct_user_voice_source_units:localReadiness.distinct_user_voice_source_units,local_use_unresolved_records:localReadiness.local_use_unresolved_records},source_ledger:{counts:{stored_evidence_lanes:{user_voice:all.filter(r=>r.evidence_lane==='user_voice'&&r.origin==='corpus').length,control:all.filter(r=>r.evidence_lane==='control'&&r.origin==='corpus').length}}},review_collection:JSON.parse(readFileSync('REVIEW_COLLECTION_AUDIT_2026-11-07.json','utf8')),rollup:rollup(items),drivers:driverEvidence(items),development:developmentSummary(),quality:store.meta('evaluation')||null};
}
async function main(){const store=openStore();const [command,arg]=process.argv.slice(2);try{
 if(command==='import'){console.log(importCorpus(store,readFileSync(resolve(arg),'utf8')));}
 else if(command==='select'){console.log(JSON.stringify(selectTierB(store.items()),null,2));}
 else if(command==='run-a'||command==='run-b'||command==='predict-gold')throw Error('Legacy full-packet model route held until the lean pilot passes and is integrated; no model call made');
 else if(command==='evaluate'){
  const gold=JSON.parse(readFileSync(resolve(arg||'.local/evaluation/reference_labels.json'),'utf8'));const preds=JSON.parse(readFileSync(resolve('.local/evaluation/predictions.json'),'utf8'));const report=evaluate(gold,preds);store.meta('evaluation',report);mkdirSync('exports',{recursive:true});writeFileSync('exports/evaluation.json',JSON.stringify(report,null,2));console.log(report);
 }else if(command==='snapshot'){
  const result=snapshot(store);mkdirSync('public',{recursive:true});writeFileSync('public/snapshot.json',JSON.stringify(result,null,2));console.log({published_snapshot_items:result.items.length,warning:'Local file only. No deployment. Only accepted corpus results with cleared terms included.'});
 }else if(command==='export'){
  const ex=deckExports(store.items());mkdirSync('exports',{recursive:true});for(const [k,v]of Object.entries(ex))writeFileSync('exports/'+k+(k==='flow'?'.mmd':'.csv'),v);console.log('Local exports written; survey cells are unlinked, not triangulated findings.');
 }else console.log(JSON.stringify({rollup:rollup(store.items()),readiness:corpusReadiness(store.items()),drivers:driverEvidence(store.items()),selection:selectTierB(store.items()),spend:store.spend()},null,2));
 }finally{store.close();}}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
