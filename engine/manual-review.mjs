import { classificationSchema, MATERIAL_FIELDS, unknownDatum, validateEvidence, privateSignals } from './contracts.mjs';
import { corpusCsv, importCorpus, originalInput } from './intake.mjs';

// Assistant source review is a proposal, never a Fellow blind label or a model result.
// The input spec stays in ignored .local; only derived values enter the database.
function anchored(text, entry) {
  if (!entry) return unknownDatum();
  const value=String(entry.value||'').trim(), quote=String(entry.quote||'');
  if (!value||!quote||privateSignals(value+' '+quote).length) throw Error('Supported review field needs a safe value and source quote');
  const start=text.indexOf(quote);
  if(start<0||text.indexOf(quote,start+1)>=0) throw Error('Review quote must occur exactly once in the local original');
  return {state:'supported',value,missing_reason:null,start,end:start+quote.length};
}
export function manualClassification(spec) {
  const {source,text,judgment:j}=spec;
  if(!source||!text||!j)throw Error('Source, original text and review judgment required');
  const material=Object.fromEntries(MATERIAL_FIELDS.map(k=>[k,unknownDatum()]));
  material.source_family={state:'supported',value:source.source_family,missing_reason:null,start:null,end:null};
  for(const [field,entry] of Object.entries(j.material||{})){
    if(field==='source_family'||!MATERIAL_FIELDS.includes(field))throw Error('Unknown or metadata-only material field');
    material[field]=anchored(text,entry);
  }
  const eligibility=Object.fromEntries(['first_time_mf','first_sip_on_groww','within_first_12_months'].map(k=>[k,anchored(text,j.eligibility?.[k])]));
  const narrative={trigger:anchored(text,j.narrative?.trigger),action:anchored(text,j.narrative?.action)};
  const value=classificationSchema.parse({
    evidence_class:j.evidence_class,relevant:j.relevant,metric_node:j.metric_node,exit_form:j.exit_form,
    reason_families:j.reason_families,journey_bucket:j.journey_bucket,initiating_event:j.initiating_event,
    final_state:j.final_state,paraphrase:j.paraphrase,question_ids:j.question_ids,scope_lane:j.scope_lane,
    plan_route:j.plan_route||'unknown',eligibility,narrative,material
  });
  validateEvidence(value,text,source.source_family);
  return value;
}
export function importManualReview(store,spec){
  const classification=manualClassification(spec),s=spec.source;
  const csv=corpusCsv(['source_family','url','date','text','source_locator','evidence_lane'],[{...s,text:spec.text}]);
  const intake=importCorpus(store,csv);
  const match=store.db.prepare('SELECT id FROM items WHERE url=? AND source_locator=? ORDER BY id').all(s.url,s.source_locator||'');
  const exact=match.filter(r=>originalInput(store,r.id).text===spec.text);
  if(exact.length!==1)throw Error('Manual review source identity is unresolved');
  const id=exact[0].id,row=store.item(id);
  if(row.tier_a||row.tier_b)throw Error('Existing coding must be reviewed, not overwritten');
  const boundedTradingQna=s.source_family==='Investing forums'&&new URL(s.url).hostname==='tradingqna.com';
  store.db.prepare("UPDATE items SET terms_status='flagged',local_use_status=? WHERE id=?").run(boundedTradingQna?'cleared':'pending',id);
  store.setResult(id,'a',classification,'assistant_source_review_proposal');
  store.db.prepare('INSERT INTO corrections(id,item_id,old_value,new_value,reason,actor,created_at) VALUES(lower(hex(randomblob(16))),?,?,?,?,?,?)')
    .run(id,'unrun','assistant_source_review_proposal','Source-linked manual development review; not Fellow blind gold or an AI model result','assistant_source_review',new Date().toISOString());
  store.meta('snapshot_stale',true);
  return {id,intake,coding_origin:'assistant_source_review_proposal',review_state:'proposal',public_snapshot_eligible:false};
}
