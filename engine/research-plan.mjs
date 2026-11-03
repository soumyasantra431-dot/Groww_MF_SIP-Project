import {FAMILIES,QUESTIONS} from './contracts.mjs';
import {coding,evidenceLane,isStudyEvidence,rootGroups} from './scope.mjs';
import {WORKFLOW,SOURCE_ROUTES,ANSWER_REQUIREMENTS} from './workflow.mjs';
import {opportunityComparisons} from './opportunity-comparison.mjs';

const plans={
 Q1:['Understand the progress someone hoped a SIP would make possible.','A stated starting reason and expected outcome or timeline.','Ask about the original starting episode; expert explanations are context, not that investor’s motive.'],
 Q2:['Identify what changed within the same person’s journey.','At least two reported timepoints, their circumstances and actions.','Reconstruct a before-and-after episode. Different people at different stages cannot supply a personal trajectory.'],
 Q3:['Separate an intended pause, an unwanted interruption and a changed plan.','Stated intention, initiating event, action status and ending.','Ask what the next contribution was meant to do and what actually happened to it.'],
 Q4:['Understand what checking is for and whether it affects an action.','What was checked, stated frequency and reference period; unknown if omitted.','Use a focused written follow-up or diary if cadence matters. Posts cannot reveal silent checking.'],
 Q5:['Locate a concrete comprehension or task problem inside the app.','The information or control, its interpretation and its consequence.','Compare documented availability with a safe observed task; documentation does not prove usability.'],
 Q6:['Understand help, workarounds and decisions outside the app.','An attributed sequence involving a bank, support, another person, source or tool.','Separate advice received from action taken, and a reply from a resolved outcome.'],
 Q7:['Compare continuation and interruption under relevant circumstances.','Contrasting outcomes plus stated circumstances, effort and protective cues.','Seek a comparable success or recovery; a continuer may have encountered friction. Association is not causation.'],
 Q8:['Find possible groups worth investigating, without choosing one.','Stated circumstances, behaviour, timing and outcome; missing dimensions stay unknown.','Compare candidate contexts and rivals. Do not infer income, age, influence or vulnerability from stereotypes.'],
 Q9:['Find desired progress that existing options do not adequately support.','A supported need, consequence, current alternative and counterexample.','Compare problems without automatic scores; validate the important unresolved mechanism before proposing a remedy.']
};
export function researchPlan(items){
 const admitted=items.filter(r=>isStudyEvidence(r)),roots=rootGroups(admitted),coded=items.filter(r=>coding(r));
 return {workflow:WORKFLOW,opportunities:opportunityComparisons(items),purpose:'Turn selected public SIP accounts into traceable evidence and questions for the next PM decision.',decision_boundary:'The engine proposes patterns and candidate contexts. The researcher validates and selects a segment, moment and problem; none is selected now.',
  narrative_status:items.some(r=>r.tier_a)&&items.some(r=>r.tier_b)?'some extraction exists; source-grounded narrative implementation and review still required':'not built: reviewed real episodes and question-specific evidence are required first',
  questions:QUESTIONS.map(([id,title])=>({id,title,purpose:plans[id][0],needed_evidence:plans[id][1],next_method:plans[id][2],answer_requirement:ANSWER_REQUIREMENTS[id],status:!coded.length?'analysis_unrun':'proposals_require_source_review',proposed_items:admitted.filter(r=>coding(r).question_ids.includes(id)).length,denominator:admitted.length})),
  sources:FAMILIES.map(f=>{const family=items.filter(r=>r.source_family===f),voice=family.filter(r=>evidenceLane(r)==='user_voice'),rs=admitted.filter(r=>r.source_family===f);return {source_family:f,user_voice_inputs:voice.length,coded_user_voice:rs.length,tier_b:rs.filter(r=>r.tier_b).length,dependency_grouped_roots:new Set(rs.map(r=>roots.get(r.id))).size,context_or_controls:family.filter(r=>['context','control'].includes(evidenceLane(r))).length,...SOURCE_ROUTES[f],connection_status:'input supported; automated source connection not established'};})};
}
