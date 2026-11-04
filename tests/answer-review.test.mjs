import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openStore} from '../engine/store.mjs';
import {saveReviewedAnswer,reviewedAnswers} from '../engine/answer-review.mjs';
import {MATERIAL_FIELDS,unknownDatum} from '../engine/contracts.mjs';

const code={evidence_class:'public_user_account',relevant:'yes',scope_lane:'eligibility_unknown',metric_node:'unknown',exit_form:'unknown',question_ids:['Q1'],material:Object.fromEntries(MATERIAL_FIELDS.map(f=>[f,unknownDatum()]))};
const answer={question_id:'Q1',source_ids:['A'],direct_answer:'This source states a reason for considering a SIP; cohort fit is unknown.',counterexample_or_rival:'The stated reason may come from advice rather than experience.',unknown:'A completed first SIP and its outcome are not established.',next_question:'Did the person start, and what happened next?',checked_sources:true,researcher_approved:true};
test('Answer approval requires reviewed local source, citations and invalidates on source revision',()=>{
 const dir=mkdtempSync(join(tmpdir(),'sip-answer-review-')),store=openStore(dir);
 try{
  store.insert({id:'A',source_family:'Investing forums',url:'https://tradingqna.com/t/example/42/1',source_locator:'post-1',evidence_lane:'user_voice',origin:'corpus'});
  store.setResult('A','a',code,'assistant_source_review_proposal');
  assert.throws(()=>saveReviewedAnswer(store,answer),/accepted/);
  store.db.prepare("UPDATE items SET review_state='accepted',local_use_status='cleared',terms_status='flagged' WHERE id='A'").run();
  assert.equal(saveReviewedAnswer(store,answer).public_ready,false);
  assert.equal(reviewedAnswers(store,store.items()).Q1.status,'researcher_approved');
  assert.equal(reviewedAnswers(store,store.items(),{publicOnly:true}).Q1.status,'stale_or_not_publishable');
  store.db.prepare("UPDATE items SET revision=revision+1 WHERE id='A'").run();
  assert.equal(reviewedAnswers(store,store.items()).Q1.status,'stale_or_not_publishable');
 }finally{store.close();rmSync(dir,{recursive:true,force:true});}
});
test('Answer approval rejects unchecked wording and source mismatch',()=>{
 const dir=mkdtempSync(join(tmpdir(),'sip-answer-review-')),store=openStore(dir);
 try{
  assert.throws(()=>saveReviewedAnswer(store,{...answer,researcher_approved:false}),/explicit/);
  assert.throws(()=>saveReviewedAnswer(store,{...answer,source_ids:['missing']}),/cited source/);
 }finally{store.close();rmSync(dir,{recursive:true,force:true});}
});
