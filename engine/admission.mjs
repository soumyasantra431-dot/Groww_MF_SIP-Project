// Structural/consistency checks only. These cannot establish that a source entails a label.
export function scopeConsistencyIssues(c={}){
 const issues=[];
 if(c.scope_lane==='target'){
  if(c.evidence_class!=='public_user_account'||c.relevant!=='yes')issues.push('target_requires_relevant_user_account');
  if(['first_time_mf','first_sip_on_groww','within_first_12_months'].some(k=>c.eligibility?.[k]?.state!=='supported'||c.eligibility[k].value!=='yes'))issues.push('target_eligibility_not_supported');
 }
 if(c.scope_lane==='out_of_scope'&&c.relevant==='yes')issues.push('out_of_scope_cannot_be_relevant_yes');
 const instrument=c.material?.instrument;
 if(instrument?.state==='supported'&&['stock','other'].includes(instrument.value)&&c.relevant==='yes')issues.push('non_mf_instrument_cannot_be_target_relevant');
 if(c.evidence_class==='company_reported'&&!['context','out_of_scope'].includes(c.scope_lane))issues.push('company_documentation_is_context');
 for(const d of Object.values(c.eligibility||{}))if(d.state==='supported'&&!['yes','no'].includes(d.value))issues.push('eligibility_requires_yes_or_no');
 return [...new Set(issues)];
}
