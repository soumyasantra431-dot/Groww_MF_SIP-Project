import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openStore } from '../engine/store.mjs';
import { manualClassification,importManualReview,reviewedFieldDatum } from '../engine/manual-review.mjs';

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
test('material corrections need one exact source anchor and preserve missingness',()=>{
 const supported=reviewedFieldDatum(text,{state:'supported',value:'Asked support',quote:'I asked support how to start a SIP.'});
 assert.equal(supported.start,text.indexOf('I asked support'));
 assert.throws(()=>reviewedFieldDatum(text,{state:'supported',value:'bank failure',quote:'bank failed'}),/Review quote/);
 assert.equal(reviewedFieldDatum(text,{state:'unknown'}).state,'unknown');
 assert.deepEqual(reviewedFieldDatum(text,{state:'not_applicable'}),{state:'not_applicable',value:null,missing_reason:'not_applicable',start:null,end:null});
});
test('target lane needs explicit cohort support',()=>{
 assert.throws(()=>manualClassification({source,text,judgment:{...judgment,scope_lane:'target'}}),/Target lane/);
});
test('bounded TradingQ&A import clears local use but keeps public redistribution flagged',()=>{
 const dir=mkdtempSync(join(tmpdir(),'sip-manual-rights-')),store=openStore(dir);
 try{
  const imported=importManualReview(store,{source:{...source,url:'https://tradingqna.com/t/example/42/1'},text,judgment});
  const row=store.item(imported.id);
  assert.equal(row.local_use_status,'cleared');
  assert.equal(row.terms_status,'flagged');
  assert.equal(row.review_state,'proposal');
 }finally{store.close();rmSync(dir,{recursive:true,force:true});}
});
