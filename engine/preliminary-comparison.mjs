import {coding,isStudyEvidence,rootGroups,sourceUsable} from './scope.mjs';
import {sourceReviewUrl} from './normalization.mjs';

// Research situations, not accepted opportunities. Each entry names the exact
// source proposals that led to the question; absent proposals cannot be padded.
const SITUATIONS=[
 {id:'schedule_meaning',name:'What does the first payment set up?',ids:['I-ee755f7ea081bce89add'],
  observed:'A first-SIP writer reported cancelling the initial buy while unsure when the next payment would occur.',
  consequence:'The initial order was reportedly cancelled; the recurring SIP and later payment outcomes are unknown.',
  pathway:'A misunderstood schedule could affect an intended contribution, but this account does not establish a lost scheduled instalment.',
  rival:'Normal first-time learning or a deliberate order cancellation with no missed later payment.',
  next_test:'Ask a first-year Groww investor to distinguish the initial buy, next due date and next successful instalment; check the actual next-payment outcome.'},
 {id:'payment_recovery',name:'When an intended payment does not complete',ids:['I-2744286d3dd5472dcdb8','I-4a433e8feec6d06a4d97','I-50a772eddc9a02120c1e','I-49ae1e3cd8f37349df1f'],
  observed:'Adjacent-platform writers described mandate or payment-route trouble; one later reported that another UPI app worked.',
  consequence:'Payment execution was reported as interrupted in some posts. The later update describes a workaround, not a verified scheduled SIP recovery.',
  pathway:'If an intended scheduled instalment fails and recovery is possible, clarity about status and options may matter to a later qualifying payment.',
  rival:'Bank or UPI rail conditions, normal processing delay, or payment recovery unrelated to the platform interface.',
  next_test:'For one Groww due-date episode, record the intended payment, bank/mandate status, app status, action and next scheduled instalment.'},
 {id:'control_meaning',name:'What does pause, delete or cancel change?',ids:['I-58c3ce0df1ef992c0688','I-ee755f7ea081bce89add','I-c8e7e6f6237819690bb7'],
  observed:'Writers asked about or acted on pause, delete, initial-order cancellation and stopping SIP transactions; later contribution or redemption states were not established.',
  consequence:'A paused SIP was reportedly deleted in one account; whether holdings changed or future payments stopped is unknown.',
  pathway:'Understanding control consequences could help an investor carry out an informed choice; continuation is not automatically the right outcome.',
  rival:'The controls may behave correctly and the writer may simply be seeking confirmation after a valid choice.',
  next_test:'Observe a safe, non-transactional Groww task: explain what each control changes, then verify the current product behaviour.'},
 {id:'trust_support',name:'What happens when payment trust weakens?',ids:['I-0fdc1add96cfb39774ac','I-21f5cec36a90bef96234'],
  observed:'Adjacent-platform writers raised support or control questions; one reported pausing investments amid redemption and support concerns.',
  consequence:'A reported investment pause is not proof that a scheduled SIP stopped or that support caused it.',
  pathway:'Unresolved status or support may change an investor’s next choice, but its link to a qualifying month-12 payment is unmeasured.',
  rival:'The pause may reflect circumstances outside the app, and the support question may never have affected a payment.',
  next_test:'Ask what the investor sought from support, what response arrived, what choice followed, and what happened to the next due payment.'}
];

export function preliminaryComparison(items){
 const proposals=items.filter(r=>r.origin==='corpus'&&['proposal','needs_review'].includes(r.review_state)&&sourceUsable(r)&&isStudyEvidence(r));
 const roots=rootGroups(proposals),rootCount=rows=>new Set(rows.map(r=>roots.get(r.id))).size;
 const candidates=SITUATIONS.map(s=>{
  const rows=s.ids.map(id=>proposals.find(r=>r.id===id)).filter(Boolean);
  // The wording combines every listed source; never show it from a partial set.
  if(rows.length!==s.ids.length)return null;
  return {id:s.id,name:s.name,observed:s.observed,consequence:s.consequence,pathway:s.pathway,rival:s.rival,next_test:s.next_test,
   source_root_count:rootCount(rows),denominator_roots:rootCount(proposals),record_count:rows.length,
   target_records:rows.filter(r=>coding(r).scope_lane==='target').length,
   adjacent_records:rows.filter(r=>coding(r).scope_lane==='adjacent').length,
   eligibility_unknown_records:rows.filter(r=>coding(r).scope_lane==='eligibility_unknown').length,
   source_families:[...new Set(rows.map(r=>r.source_family))],
   metric_tags:[...new Set(rows.map(r=>coding(r).metric_node+'/'+coding(r).exit_form))],
   sources:rows.map(r=>({id:r.id,url:sourceReviewUrl(r),locator:r.source_locator||r.id,platform:coding(r).material?.platform?.value||'unknown'}))};
 }).filter(Boolean);
 return {status:'assistant_proposals_only',candidates,proposal_records:proposals.length,proposal_roots:rootCount(proposals),
  unit:'distinct dependent source roots among locally usable, coded proposals; not people, Groww prevalence or population reach',
  limitation:'All four situations are adjacent or eligibility-unknown leads. They are not accepted findings, automatic rankings or a selected segment/problem/feature.'};
}
