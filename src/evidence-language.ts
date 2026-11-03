export type EvidenceDatum={state?:string;value?:string|null;missing_reason?:string|null};

const labels:Record<string,string>={
 source_family:'Source type',platform:'Investing app',instrument:'Investment type',
 journey_stage:'When this event happened in the SIP journey',action_status:'Status of the reported action',
 trigger:'What set this event off',reported_reason:'The writer’s explanation',
 blamed_actor:'Who the writer holds responsible',outcome:'Latest reported result',
 continuer:'Explicit ongoing SIP contributions',
 supported:'Stated in the source',unknown:'Not stated or unclear',not_applicable:'Does not apply to this content',
 proposal:'Proposal · not verified',needs_review:'Needs a closer look',accepted:'Accepted by a reviewer',rejected:'Excluded from this analysis',
 flagged:'Flagged for review',flagged_non_episode:'Context or possible non-event · check before counting',
 setup_mandate:'Setup or AutoPay permission',first_instalment:'First payment of the described SIP',second_instalment:'Second payment of the described SIP',
 first_payment:'First payment of the described SIP',second_payment:'Second payment of the described SIP',
 months_3_6:'Months 3–6',months_7_12:'Months 7–12',recovery:'Recovery attempt or return',
 involuntary:'Intended payment interrupted',voluntary:'User-initiated pause or stop',passive:'Reported drift without an explicit stop',
 not_real:'Apparent drop-off explained by another event',
 mutual_fund_sip:'Mutual fund SIP',mutual_fund_SIP:'Mutual fund SIP',mutual_fund:'Mutual fund; SIP not stated',mutual_fund_without_stated_SIP:'Mutual fund; SIP not stated',
 sip_unspecified:'SIP; investment type not stated',unspecified_SIP:'SIP; investment type not stated',
 eligibility_unknown:'Target-cohort eligibility not established',adjacent:'Useful comparison outside the confirmed target',
 target:'Provisional target-cohort fit',context:'Background context',out_of_scope:'Outside this research scope'
};
export function labelFor(value:string){return labels[value]||value.replaceAll('_',' ');}

const questions:Record<string,string>={
 journey_stage:'The event needs a stated time relative to the first SIP. A later SIP does not reset the investor’s first-year clock.',
 reported_reason:'A reason must come from the writer. Starting motivation, reason for continuing, and reason for an interruption are different facts.',
 blamed_actor:'This records whom the writer explicitly holds responsible. It does not establish who actually caused the issue.',
 trigger:'A retry or cancellation is an action. What prompted that action must be supported separately.',
 outcome:'A promised refund, successful AutoPay permission or suggested workaround is not proof of a completed SIP investment.',
 continuer:'One completed payment or one cancelled SIP does not establish whether the person continued all SIP contributions.'
};
const missing:Record<string,string>={
 not_stated:'The source does not give this detail.',ambiguous:'The wording allows more than one interpretation.',
 conflicting:'Statements need to be reconciled before choosing an answer.',source_unavailable:'Supporting source text is unavailable for this check.'
};
export function presentField(field:string,datum?:EvidenceDatum|null){
 const title=labelFor(field),help=questions[field]||'';
 if(!datum||!datum.state)return {title,status:'Not analysed yet',value:null,explanation:'No extraction result exists for this field. This is different from a source that leaves a fact unstated.'};
 if(datum.state==='supported'){
  const value=field==='continuer'?(datum.value==='yes'?'Ongoing SIP contributions explicitly reported':datum.value==='no'?'Ended SIP contributions explicitly reported':datum.value):datum.value?labelFor(datum.value):null;
  return {title,status:'Stated in the source · proposal',value,explanation:help};
 }
 if(datum.state==='not_applicable')return {title,status:'Does not apply to this content · proposal',value:null,explanation:'Marked as inapplicable to this account. If a relevant detail is simply missing, it should be “Not stated or unclear” instead.'+(help?' '+help:'')};
 return {title,status:'Not stated or unclear',value:null,explanation:(missing[datum.missing_reason||'']||'The source does not establish this detail.')+(help?' '+help:'')};
}
