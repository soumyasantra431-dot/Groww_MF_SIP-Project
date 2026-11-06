import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openStore } from '../engine/store.mjs';
import { importCorpus } from '../engine/intake.mjs';
import { rollup,selectTierB,deckExports,evaluate } from '../engine/analysis.mjs';
import { corpusReadiness,driverEvidence,rootGroups } from '../engine/scope.mjs';
import { reviewedAnswers } from '../engine/answer-review.mjs';
export function snapshot(store){
 const all=store.items();const rs=all.filter(r=>r.origin==='corpus'&&r.review_state==='accepted'&&r.terms_status==='cleared'&&(r.tier_a||r.tier_b));
 const roots=rootGroups(all);
 const items=rs.filter(r=>!['context','control'].includes(r.evidence_lane)).map(r=>({id:r.id,source_family:r.source_family,url:r.url,source_locator:r.source_locator,date:r.date,tier_a:r.tier_a,tier_b:r.tier_b,review_state:r.review_state,coding_origin:r.coding_origin,hypothesis:r.hypothesis,terms_status:r.terms_status,origin:r.origin,revision:r.revision,evidence_lane:r.evidence_lane,independence_group:'DEP-'+roots.get(r.id)}));
 const answers=reviewedAnswers(store,all,{publicOnly:true});
 return {schema:'sip-snapshot-v1-depth-addendum',created_at:new Date().toISOString(),review_basis:'accepted research proposals; not verified financial transactions',items,approved_answers:Object.fromEntries(Object.entries(answers).filter(([,v])=>v.status==='researcher_approved')),review_collection:JSON.parse(readFileSync('REVIEW_COLLECTION_AUDIT_2026-11-07.json','utf8')),rollup:rollup(items),drivers:driverEvidence(items),quality:store.meta('evaluation')||null};
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
