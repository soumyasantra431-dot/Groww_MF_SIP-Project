import {QUESTIONS} from './contracts.mjs';
import {coding,isStudyEvidence,rootGroups,sourceUsable} from './scope.mjs';
import {sourceReviewUrl} from './normalization.mjs';
import {ANSWER_REQUIREMENTS,NEXT_EVIDENCE} from './workflow.mjs';

const UNKNOWN_BY_QUESTION={
 Q1:'Starting expectations for the first-time Groww cohort remain unknown unless the investor states them.',
 Q2:'A change needs at least two timepoints from the same investor; separate posts cannot make a trajectory.',
 Q3:'A stated reason does not prove the payment system’s cause or a month-12 outcome.',
 Q4:'Checking frequency is unknown unless a person states a cadence and reference period.',
 Q5:'A documented control does not prove that investors noticed or understood it.',
 Q6:'Advice received, support contacted and action completed are different events.',
 Q7:'Public posts cannot reveal silent continuers or silent drop-offs, or establish a causal difference.',
 Q8:'Age, income stability and source of money stay unknown unless the person states them.',
 Q9:'Repeated complaint language is a need hypothesis until the desired progress and current alternative are checked.'
};
const RIVAL_BY_QUESTION={
 Q1:'An apparent starting expectation may have come from an adviser or creator rather than the investor.',
 Q2:'Different stages across different writers may resemble change within one person.',
 Q3:'A missed payment may reflect a bank or mandate condition, a deliberate decision, or an unresolved status.',
 Q4:'People who post about checking may check more often than quiet investors.',
 Q5:'The control may be available but hard to find, or the underlying payment status may be unclear.',
 Q6:'A reply may suggest a workaround that the original writer never tried.',
 Q7:'A continuation difference may reflect circumstances rather than the app experience.',
 Q8:'A visible pattern may reflect who posts publicly rather than a meaningful investor segment.',
 Q9:'An apparent unmet need may already be met by an existing control that the writer did not know about.'
};
// A narrow reading of a named source proposal. This is not an approved answer
// and disappears if its exact locally usable source is no longer a proposal.
const WORKING_READINGS={
 Q1:{id:'I-4ee83186cfa8a499dfbe',text:'A new graduate describes a plan to organise investments, keep an emergency buffer and start SIP contributions. This is stated intention before starting, not evidence of an actual SIP or later outcome.'},
 Q2:{id:'I-ee755f7ea081bce89add',text:'The same writer describes a start followed by cancellation of the initial buy. That is one short sequence; it does not establish a change over later months or a stopped scheduled SIP.'},
 Q3:{id:'I-2744286d3dd5472dcdb8',text:'An adjacent-platform writer reports two months when an intended mandate-funded SIP debit did not occur. The cause and later successful instalment are not confirmed.'},
 Q4:{id:'I-0e88524ab2d6876e29b7',text:'One experienced Paytm Money investor says they had not checked individual SIP transaction status, then checked after noticing rejected transactions and considered reviewing past transactions. This is one before-and-after checking account, not a frequency estimate for first-year Groww investors.'},
 Q5:{id:'I-58c3ce0df1ef992c0688',text:'A writer reports pausing then accidentally deleting one SIP and asks what happens to the holding. This shows a stated control question, while its later payment consequence remains unknown.'},
 Q6:{id:'I-50a772eddc9a02120c1e',text:'In a follow-up to a Coin payment problem, the same poster reports using another UPI app and says current payments work. The later scheduled SIP outcome is not verified.'},
 Q7:{id:'I-14cd3dbb137c38498cf3',text:'One writer reports roughly a year of SIP investing and considers increasing the amount. Their platform, first-ever MF status and a comparable difficult-month outcome are unknown.'},
 Q8:{id:'I-4ee83186cfa8a499dfbe',text:'One pre-start writer explicitly mentions a new job, a planned emergency buffer and a support system. This describes one person’s circumstances; there is no observed SIP outcome or basis for a segment comparison.'},
 Q9:{id:'I-b07a7a3c97ad3462ebf3',text:'A Coin writer reports a missing due-date payment link, an inconsistent next-instalment display and no visible modify/cancel tab, then asks for help. A need for clearer status or control discovery is a hypothesis; the source does not establish the current option, payment outcome or Groww fit.'}
};
const rootsOf=(rows,root)=>new Set(rows.map(r=>root.get(r.id)));
const fitCounts=rows=>Object.fromEntries(['target','adjacent','eligibility_unknown'].map(fit=>[fit,rows.filter(r=>coding(r).scope_lane===fit).length]));

// A packet is evidence for a later answer, not a generated answer. Local use
// permission and public publication rights are deliberately separate gates.
export function questionCards(items,{publicOnly=false,approvedAnswers={}}={}){
 const reviewed=items.filter(r=>r.origin==='corpus'&&r.review_state==='accepted'&&isStudyEvidence(r)&&
  (publicOnly?r.terms_status==='cleared':r.local_use_status==='cleared'||r.terms_status==='cleared'));
 const roots=rootGroups(reviewed),baseRoots=rootsOf(reviewed,roots);
 // Leads help a local researcher decide what to check next. They never enter
 // reviewed counts, public snapshots or approved answer citations.
 const pending=publicOnly?[]:items.filter(r=>r.origin==='corpus'&&['proposal','needs_review'].includes(r.review_state)&&isStudyEvidence(r)&&sourceUsable(r));
 const pendingRoots=rootGroups(pending);
 return QUESTIONS.map(([id,title])=>{
  const rows=reviewed.filter(r=>coding(r).question_ids.includes(id));
  const linkedRoots=rootsOf(rows,roots);
  const candidateRows=pending.filter(r=>coding(r).question_ids.includes(id));
  const leadByRoot=new Map();
  for(const r of candidateRows){
   const key=pendingRoots.get(r.id),existing=leadByRoot.get(key);
   const fit=coding(r).scope_lane;
   const priority=fit==='target'?0:fit==='eligibility_unknown'?1:2;
   if(!existing||priority<existing.priority)leadByRoot.set(key,{row:r,priority});
  }
  const leads=[...leadByRoot.values()].sort((a,b)=>a.priority-b.priority).slice(0,2).map(({row:r})=>({
   id:r.id,url:sourceReviewUrl(r),source_locator:r.source_locator||'',source_family:r.source_family,
   scope_lane:coding(r).scope_lane,paraphrase:coding(r).paraphrase,
   metric_node:coding(r).metric_node,exit_form:coding(r).exit_form,
   review_state:r.review_state
  }));
  const sources=rows.map(r=>({id:r.id,url:sourceReviewUrl(r),source_family:r.source_family,source_locator:r.source_locator||'',scope_lane:coding(r).scope_lane,metric_node:coding(r).metric_node,exit_form:coding(r).exit_form,reported_reason:coding(r).material?.reported_reason?.state==='supported'?coding(r).material.reported_reason.value:null,final_state:coding(r).final_state||null,root_id:roots.get(r.id)}));
  const approved=approvedAnswers[id]?.status==='researcher_approved'?approvedAnswers[id]:null;
  const workingSpec=publicOnly?null:WORKING_READINGS[id];
  const workingRow=workingSpec&&pending.find(r=>r.id===workingSpec.id&&coding(r).question_ids.includes(id));
  return {id,title,status:approved?'researcher_approved':'answer_not_approved',direct_answer:approved?.direct_answer||null,counterexample_or_rival:approved?.counterexample_or_rival||null,source_root_count:linkedRoots.size,reviewed_root_denominator:baseRoots.size,record_count:rows.length,reviewed_record_denominator:reviewed.length,source_mix:Object.fromEntries([...new Set(rows.map(r=>r.source_family))].map(f=>[f,rows.filter(r=>r.source_family===f).length])),fit_records:fitCounts(rows),source_ids:rows.map(r=>r.id),approved_source_ids:approved?.source_ids||[],sources,working_reading:workingRow?{text:workingSpec.text,id:workingRow.id,url:sourceReviewUrl(workingRow),source_family:workingRow.source_family,source_locator:workingRow.source_locator||workingRow.id,scope_lane:coding(workingRow).scope_lane,metric_node:coding(workingRow).metric_node,exit_form:coding(workingRow).exit_form}:null,unreviewed_lead_roots:leadByRoot.size,unreviewed_leads:leads,answer_requirement:ANSWER_REQUIREMENTS[id],rival_to_check:RIVAL_BY_QUESTION[id],unknown:approved?.unknown||UNKNOWN_BY_QUESTION[id],next_decision:approved?.next_question|| (rows.length?'Check the cited sequence and a counterexample, then approve bounded wording.':leadByRoot.size?'Review these proposed leads. '+NEXT_EVIDENCE[id]:NEXT_EVIDENCE[id]),unit:'dependent source roots in this locally reviewed corpus; not people or prevalence',limits:'Source links and labels are research evidence only. The card does not calculate Groww retention, infer a cause, or select a segment.'};
 });
}
