// Aggregate development comparison only. No raw source text or label values leave .local.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {scoreSmoke} from '../engine/smoke-pilot.mjs';

const base='.local/lean-frozen-2026-11-06-v12-development-reuse';
const run=JSON.parse(await fs.readFile(base+'/progress.json','utf8'));
const reference=JSON.parse(await fs.readFile('.local/smoke-pilot/v1/post-audit-reference.json','utf8'));
const input=await fs.readFile('.local/smoke-pilot/v1/inputs.json');
const hash=createHash('sha256').update(input).digest('hex');
if(run.frozen_input_hash!==hash||run.results.length!==10||reference.items.length!==10||reference.independent_blind_reference!==false)throw Error('Development inputs/reference are incomplete or changed');
const predictions=[];
for(const row of run.results){
 if(!row.structure_pass)continue;
 const saved=JSON.parse(await fs.readFile(base+'/'+row.id+'.json','utf8'));
 const ref=reference.items.find(r=>r.id===row.id);
 if(!ref||saved.id!==row.id)throw Error('Frozen ID mismatch');
 predictions.push({id:row.id,input_sha256:ref.input_sha256,...saved.result});
}
const scored=scoreSmoke(reference.items,predictions,{attempts:run.results.map(r=>r.telemetry||{processing_status:'failed'})});
const episodeReference=reference.items.filter(r=>r.disposition==='episode');
const episodePredictions=predictions.filter(p=>episodeReference.some(r=>r.id===p.id));
const episodeScored=scoreSmoke(episodeReference,episodePredictions,{attempts:run.results.filter(r=>episodeReference.some(g=>g.id===r.id)).map(r=>r.telemetry||{processing_status:'failed'})});
const tokens=run.results.reduce((n,r)=>n+(r.telemetry?.total_tokens||0),0);
const latencies=run.results.map(r=>r.telemetry?.latency_ms).filter(Number.isFinite);
const report={
 kind:'post_ai_development_comparison_not_independent_accuracy',
 input_count:10,model_requests:run.results.reduce((n,r)=>n+r.attempts,0),structure_pass:run.results.filter(r=>r.structure_pass).length,
 processing_failures:scored.processing.failures,field_rejections:run.results.flatMap(r=>(r.telemetry?.field_rejections||[]).map(f=>({id:r.id,...f}))),
 ambiguous_anchor_fields:run.results.flatMap(r=>(r.telemetry?.anchor_ambiguous_fields||[]).map(field=>({id:r.id,field}))),
 measured_tokens:tokens,latency_ms:{min:Math.min(...latencies),max:Math.max(...latencies),sum:latencies.reduce((a,b)=>a+b,0)},
 exact_label_comparison:{source_text:scored.source_text,metric_tags:scored.metric_tags,provided_metadata:scored.provided_metadata},
 episode_only_diagnostic:{source_text:episodeScored.source_text,metric_tags:episodeScored.metric_tags,denominator_items:episodeReference.length,note:'P10 non-episode control is evaluated by disposition, not by episode fields; this is still development reuse'},
 by_item:scored.items,
 non_episode_controls:reference.items.filter(r=>r.disposition!=='episode').map(r=>({id:r.id,reference_disposition:r.disposition,model_disposition:predictions.find(p=>p.id===r.id)?.disposition?.value||'unrun',separate_admission_review_required:true})),
 review_status:'no independent blind human gold; semantic source review and severe-error adjudication incomplete',
 conclusion:'development reuse fails the explicit-field recall gate even at its best-case semantic ceiling; keep live classification held'
};
await fs.writeFile(base+'/development-comparison.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
