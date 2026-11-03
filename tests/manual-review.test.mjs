import test from 'node:test';
import assert from 'node:assert/strict';
import { manualClassification } from '../engine/manual-review.mjs';

const source={source_family:'Investing forums',url:'https://example.org/t/42/1',date:'2026-10-01',source_locator:'post-1',evidence_lane:'user_voice'};
const text='I am new to AnotherApp. I asked support how to start a SIP. No instalment was reported.';
const judgment={evidence_class:'public_user_account',relevant:'yes',metric_node:'unknown',exit_form:'unknown',reason_families:['unknown'],journey_bucket:'setup',initiating_event:'Asked how to start a SIP.',final_state:'No instalment reported.',paraphrase:'A person asked another platform about SIP setup; no payment outcome is stated.',question_ids:['Q6'],scope_lane:'adjacent',plan_route:'unknown',material:{platform:{value:'AnotherApp',quote:'new to AnotherApp'},journey_stage:{value:'setup',quote:'how to start a SIP'},action_status:{value:'attempted',quote:'I asked support how to start a SIP.'}},narrative:{action:{value:'asked support',quote:'I asked support how to start a SIP.'}}};
test('manual source review keeps uncertainty and source anchors',()=>{
 const result=manualClassification({source,text,judgment});
 assert.equal(result.material.platform.state,'supported');
 assert.equal(result.material.continuer.state,'unknown');
 assert.equal(result.eligibility.first_sip_on_groww.state,'unknown');
 assert.equal(result.scope_lane,'adjacent');
});
test('manual source review rejects a value without a matching original quote',()=>{
 assert.throws(()=>manualClassification({source,text,judgment:{...judgment,material:{platform:{value:'AnotherApp',quote:'not in original'}}}}),/Review quote/);
});
test('target lane needs explicit cohort support',()=>{
 assert.throws(()=>manualClassification({source,text,judgment:{...judgment,scope_lane:'target'}}),/Target lane/);
});
