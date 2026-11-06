// Field-level, privacy-safe diagnostics for the completed development reuse.
// This does not turn post-AI reference labels into independent ground truth.
import {readFileSync} from 'node:fs';
import {MATERIAL_FIELDS} from '../engine/contracts.mjs';

const base='.local/lean-frozen-2026-11-03-v7-development-reuse';
const reference=JSON.parse(readFileSync('.local/smoke-pilot/v1/post-audit-reference.json','utf8'));
const fields=[...MATERIAL_FIELDS.filter(f=>f!=='source_family'),'metric_node','exit_form'];
const rows=[];
for(const expected of reference.items){
 const predicted=JSON.parse(readFileSync(`${base}/${expected.id}.json`,'utf8')).result;
 for(const field of fields){
  const a=expected.material?.[field]||expected[field],b=predicted.material?.[field]||predicted[field];
  const exact=a.state===b.state&&(a.state!=='supported'||String(a.value).toLowerCase()===String(b.value).toLowerCase());
  rows.push({id:expected.id,field,reference:a.state,prediction:b.state,exact,reference_supported:a.state==='supported',value_mismatch:a.state==='supported'&&b.state==='supported'&&!exact,invented:a.state!=='supported'&&b.state==='supported'});
 }
}
const summary=fields.map(field=>{const r=rows.filter(x=>x.field===field);return {field,supported:r.filter(x=>x.reference_supported).length,exact_supported:r.filter(x=>x.reference_supported&&x.exact).length,supported_value_mismatch:r.filter(x=>x.value_mismatch).length,missed:r.filter(x=>x.reference_supported&&x.prediction!=='supported').length,unknown:r.filter(x=>x.reference==='unknown').length,unknown_kept:r.filter(x=>x.reference==='unknown'&&x.prediction==='unknown').length,invented:r.filter(x=>x.invented).length};});
console.log(JSON.stringify({kind:'development_diagnostics_not_accuracy',summary},null,2));
