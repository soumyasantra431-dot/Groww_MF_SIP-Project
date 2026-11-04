import {coding,isStudyEvidence,rootGroups,sourceUsable} from './scope.mjs';

export const COMPARISON_CONTRACT={
 purpose:'Compare researcher-named candidate problems that may influence first-year SIP continuation; preserve rivals and unknown reach.',
 unit:'distinct dependency-grouped source roots in the reviewed user-voice set, not people or Groww cohort prevalence',
 dimensions:[
  ['Evidence strength','Source-linked episodes, independent roots, source-family mix, counterexamples and cohort fit.'],
  ['Reach proxy','Supporting roots / reviewed user-voice roots in this collected corpus; cohort fit is shown separately and population reach stays unknown.'],
  ['User consequence','Reported goal, blocked action, workaround and ending; do not infer harm from a pause alone.'],
  ['Metric pathway','Which initiating node and exit form could affect a qualifying month-12 payment; causal effect and size unknown.'],
  ['Constraint fit and next test','Whether Groww can influence the situation without advice or pressure, strongest rival, discriminating follow-up.']
 ],
 publication_gate:'Local comparison uses accepted, locally permitted user accounts. Public comparison also requires public-use clearance. AI tags alone do not name or rank a problem.'
};
export function opportunityComparisons(items,{publicOnly=false}={}){
 const reviewed=items.filter(r=>r.review_state==='accepted'&&sourceUsable(r,{publicOnly})&&isStudyEvidence(r));
 const roots=rootGroups(reviewed),rootCount=rs=>new Set(rs.map(r=>roots.get(r.id))).size;
 const names=[...new Set(reviewed.map(r=>r.hypothesis?.trim()).filter(Boolean))];
 return {status:names.length?'reviewed_candidates_require_pm_judgement':'no_reviewed_candidate_problems',reviewed_user_voice_records:reviewed.length,reviewed_source_roots:rootCount(reviewed),unit:COMPARISON_CONTRACT.unit,contract:COMPARISON_CONTRACT,
  candidates:names.map(name=>{const rs=reviewed.filter(r=>r.hypothesis.trim()===name);return {name,source_root_count:rootCount(rs),denominator_roots:rootCount(reviewed),record_count:rs.length,source_families:[...new Set(rs.map(r=>r.source_family))],target_records:rs.filter(r=>coding(r).scope_lane==='target').length,adjacent_records:rs.filter(r=>coding(r).scope_lane==='adjacent').length,eligibility_unknown_records:rs.filter(r=>coding(r).scope_lane==='eligibility_unknown').length,metric_tags:[...new Set(rs.map(r=>coding(r).metric_node+'/'+coding(r).exit_form))],sources:rs.map(r=>({id:r.id,url:r.url})),user_consequence:'requires source review',rival:'requires researcher comparison',next_test:'requires researcher choice',population_reach:'unknown',causal_metric_effect:'unknown'};})};
}
