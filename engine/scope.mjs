import { sourceRootKey,sourceUnitKey,normalizeForFingerprint } from './normalization.mjs';
import { FAMILIES } from './contracts.mjs';
export {sourceRootKey} from './normalization.mjs';
import { scopeConsistencyIssues } from './admission.mjs';

// Phase 0: source yield and permission decide volume. Historical numeric floors
// remain in older audits; they are not current research-quality gates.
export const SOURCE_PLAN={named_families:FAMILIES,collection_rule:'Report actual permission-cleared yield by family; no fixed item minimum establishes insight quality.',tier_b_limit:5};
export const coding=r=>r.tier_b?.classification||r.tier_a;
// Local research permission and public redistribution are separate decisions.
export const sourceUsable=(r,{publicOnly=false}={})=>publicOnly?r.terms_status==='cleared':r.local_use_status==='cleared'||r.terms_status==='cleared';
export function evidenceLane(r){
 if(['control','context'].includes(r.evidence_lane))return r.evidence_lane;
 const c=coding(r);
 if(c?.evidence_class==='company_reported'||c?.scope_lane==='context')return 'context';
 if(c?.evidence_class==='public_user_account')return 'user_voice';
 return r.evidence_lane||'unknown';
}
// A mutually exclusive accounting partition. Reason/factor tags remain multi-label.
export function analysisDisposition(r){
 if(r.data_kind==='synthetic_fixture'||r.research_eligible===false||r.origin==='synthetic_fixture')return 'synthetic_fixture';
 const c=coding(r);if(!c)return 'unrun';
 const lane=evidenceLane(r);
 if(lane==='control')return 'control';if(lane==='context')return 'context';
 if(lane!=='user_voice')return 'unresolved_provenance';
 if(r.review_state==='rejected')return 'rejected';
 if(c.relevant==='no'||c.scope_lane==='out_of_scope'||c.material?.instrument?.state==='supported'&&['stock','other'].includes(c.material.instrument.value))return 'out_of_scope';
 if(scopeConsistencyIssues(c).length)return 'scope_inconsistent';
 return 'eligible_user_voice';
}
export function isStudyEvidence(r,{allowUncoded=false}={}){
 if(analysisDisposition(r)==='eligible_user_voice')return true;
 return allowUncoded&&analysisDisposition(r)==='unrun'&&evidenceLane(r)==='user_voice'&&r.review_state!=='rejected';
}
// Count dependent records conservatively together; do not merge their evidence or speakers.
export function rootGroups(items){
 const parent=new Map(items.map(r=>[r.id,r.id]));
 const root=id=>{let x=id;while(parent.get(x)!==x)x=parent.get(x);return x;};
 const seen=new Map();
 for(const r of items)for(const key of ['root:'+sourceRootKey(r),...(r.independence_group?['manual:'+r.independence_group]:[]),...(r.copy_key?['copy:'+r.copy_key]:[])]){
  if(seen.has(key))parent.set(root(r.id),root(seen.get(key)));else seen.set(key,r.id);
 }
 return new Map(items.map(r=>[r.id,root(r.id)]));
}
export function hasNarrative(r){const c=coding(r);return ['supported'].includes(c?.narrative?.trigger?.state)&&c?.narrative?.action?.state==='supported';}
export function corpusReadiness(items){
 const raw=items.filter(r=>r.origin==='corpus'),screenedVoice=raw.filter(r=>isStudyEvidence(r,{allowUncoded:true}));
 const voice=screenedVoice.filter(r=>r.local_use_status==='cleared'||r.terms_status==='cleared');
 const units=new Set(voice.map(sourceUnitKey)),families=[...new Set(voice.map(r=>r.source_family))];
 const narrative=voice.filter(hasNarrative),roots=rootGroups(voice),narrativeRoots=new Set(narrative.map(r=>roots.get(r.id)));
 return {status:units.size?'source_inputs_present_review_required':'no_permitted_source_inputs',plan:SOURCE_PLAN,
  user_voice_records:voice.length,screened_user_voice_records:screenedVoice.length,local_use_unresolved_records:screenedVoice.length-voice.length,distinct_user_voice_source_units:units.size,source_families:families,narratives_with_stated_trigger_and_action:narrative.length,distinct_narrative_roots:narrativeRoots.size,
  exclusions:{context:raw.filter(r=>evidenceLane(r)==='context').length,controls:raw.filter(r=>evidenceLane(r)==='control').length,unresolved_lane:raw.filter(r=>evidenceLane(r)==='unknown').length,known_irrelevant_or_rejected:raw.filter(r=>coding(r)?.relevant==='no'||r.review_state==='rejected').length},
  formulas:[`${units.size} distinct locally permitted source units`,`${families.length} source families represented`,`${narrativeRoots.size} distinct proposed narrative roots`],
  note:'Counts describe actual locally permitted, research-eligible source inputs; no hard corpus size proves answer quality. Pending/restricted seeds remain inventory only. Local analysis permission does not clear public redistribution. Coded narrative cues remain proposals until reviewed.'};
}
export function driverEvidence(items){
 const voice=items.filter(r=>isStudyEvidence(r)),roots=rootGroups(voice),groups=new Map();
 for(const r of voice)for(const h of r.tier_b?.driver_hypotheses||[]){
  const key=normalizeForFingerprint(h.hypothesis).toLowerCase();if(!groups.has(key))groups.set(key,[]);groups.get(key).push({r,h});
 }
 return [...groups.values()].map(rows=>{
  const rootFamilies=new Map();for(const {r} of rows){const key=roots.get(r.id);if(!rootFamilies.has(key))rootFamilies.set(key,new Set());rootFamilies.get(key).add(r.source_family);}
  // Minimum family coverage over dependency roots: a copied account can contribute
  // only one possible origin family. Never promote copied cross-posts to corroboration.
  const families=[...new Set([...rootFamilies.values()].flatMap(fs=>[...fs]))];
  let minimumFamilies=families.length;
  for(let mask=1;mask<(1<<families.length);mask++){
   const chosen=families.filter((_,i)=>mask&(1<<i));
   if(chosen.length<minimumFamilies&&[...rootFamilies.values()].every(fs=>chosen.some(f=>fs.has(f))))minimumFamilies=chosen.length;
  }
  const breadth=rootFamilies.size<2?'single-source':minimumFamilies>=2?'multi-family':'multi-source one family';
  return {hypothesis:rows[0].h.hypothesis,evidence_class:'inference',evidence_strength_tag:breadth,tag_means:'source breadth only; not causal strength or population importance',distinct_sources:rootFamilies.size,minimum_independent_families:minimumFamilies,families,item_ids:rows.map(({r})=>r.id),support:rows.map(({r,h})=>({id:r.id,url:r.url,metric_node:coding(r).metric_node,exit_form:coding(r).exit_form,scope_lane:coding(r).scope_lane,basis_fields:h.basis_fields,rival:h.rival,next_test:h.next_test})),limits:'Exact-normalised wording groups proposals only. Manual dependency groups and long exact-copy hashes collapse dependent accounts. Family minimum treats the originating family of a copied account as unresolved. Partial quotations, paraphrased cross-posts and unmarked dependency still require researcher review.'};
 });
}
