import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeSurvey } from '../engine/survey-secondary.mjs';

test('private survey accounting stays separate and omits answer text and identifiers', () => {
  const rows=[
   ...[1,2,3].map(id=>({id:`S0${id}`,analysis_disposition:'usable_for_limited_descriptive_analysis',attempted_sip:true,self_reported_first_ever_first_year_groww_fit:id===2,exact_month12_outcome:'not_measurable',answers:{Q10:'Private description'}})),
   {id:'S04',analysis_disposition:'non_starter_screening_only',attempted_sip:false},
   {id:'S05',analysis_disposition:'combined_consent_age_gate_not_passed',attempted_sip:false},
   {id:'S06',analysis_disposition:'non_starter_screening_only',attempted_sip:false},
   {id:'S07',analysis_disposition:'genuine_response_narrative_uninterpretable',attempted_sip:true}
  ];
  const summary=summarizeSurvey(rows);
  assert.equal(summary.total_submissions,7);
  assert.equal(Object.values(summary.dispositions).reduce((a,b)=>a+b,0),7);
  assert.equal(summary.attempted_sip_self_report,4);
  assert.equal(summary.self_reported_first_year_groww_fit,1);
  assert.equal(summary.month12_outcome_measurable,0);
  assert.equal(summary.corpus_included,false);
  assert.equal(summary.target_metric_calculable,false);
  const safe=JSON.stringify(summary);
  assert.ok(!safe.includes('S01'));
  assert.ok(!safe.includes('Q10'));
  assert.ok(!safe.includes('Private description'));
});

test('duplicate survey IDs fail accounting', () => {
  const row={id:'X',analysis_disposition:'non_starter_screening_only'};
  assert.throws(()=>summarizeSurvey([row,row]),/unique records/);
});
