import {MATERIAL_FIELDS} from './contracts.mjs';

const states=new Set(['supported','unknown','not_applicable']);
const fields=[...MATERIAL_FIELDS,'metric_node','exit_form','disposition'];
const kind=field=>field==='source_family'?'provided_metadata':field==='metric_node'||field==='exit_form'?'metric_tag':field==='disposition'?'disposition':'source_text';

// A development reference formed after AI output was inspected. Never call it blind gold.
export function importAdjudicatedReference(payload,manifest,inputs){
 const ids=manifest.items.map(r=>r.id);
 if(ids.length!==10||new Set(ids).size!==10||Object.keys(payload).length!==10||inputs.length!==10)throw Error('Expected the ten frozen pilot IDs');
 const frozen=new Map(inputs.map(r=>[r.id,r]));
 const counts={total:0,source_text:{supported:0,unknown:0,not_applicable:0},provided_metadata:0,metric_tag:0,disposition:0};
 const items=ids.map(id=>{
  const source=payload[id],meta=manifest.items.find(r=>r.id===id),input=frozen.get(id);
  if(!source||!input||input.input_sha256!==meta.input_sha256||Object.keys(source).length!==fields.length||fields.some(f=>!Object.hasOwn(source,f)))throw Error('Reference does not match frozen input manifest');
  const material={};
  for(const field of fields){
   const d=source[field],expectedKind=kind(field);
   if(!d||d.field_kind!==expectedKind||![0,1].includes(d.literal_match)||typeof d.value!=='string'&&d.value!==null)throw Error(`Invalid reference field ${id}/${field}`);
   if(field==='disposition'){
    if(!['episode','flagged_non_episode'].includes(d.state)||d.value!==null)throw Error(`Invalid disposition ${id}`);
   }else if(!states.has(d.state)||(d.state==='supported'?!d.value?.trim():d.value!==null))throw Error(`Invalid state/value ${id}/${field}`);
   if(field==='source_family'&&d.value!==input.source_family)throw Error(`Source metadata mismatch ${id}`);
   counts.total++;
   if(expectedKind==='source_text')counts.source_text[d.state]++;
   else counts[expectedKind]++;
   const label={state:d.state,value:d.value,evidence_note:'Post-AI adjudication; source anchor not supplied in this payload.'};
   if(MATERIAL_FIELDS.includes(field))material[field]=label;
  }
  return {id,input_sha256:meta.input_sha256,material,metric_node:{state:source.metric_node.state,value:source.metric_node.value,evidence_note:''},exit_form:{state:source.exit_form.state,value:source.exit_form.value,evidence_note:''},disposition:source.disposition.state};
 });
 if(counts.total!==130||counts.provided_metadata!==10||counts.metric_tag!==20||counts.disposition!==10||JSON.stringify(counts.source_text)!==JSON.stringify({supported:44,unknown:34,not_applicable:12}))throw Error('Reference arithmetic differs from supplied audit breakdown');
 return {schema:'sip-post-audit-reference-v1',provenance:'Fellow-described post-AI adjudication, supplied in 2 Nov 2026 attachment',independent_blind_reference:false,allowed_use:'development comparison only; not an independent accuracy claim',frozen_protocol_sha256:manifest.protocol_sha256,counts,items};
}
