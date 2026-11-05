import test from 'node:test';
import assert from 'node:assert/strict';
import {questionCards} from '../engine/question-cards.mjs';
import {MATERIAL_FIELDS,unknownDatum} from '../engine/contracts.mjs';

const material=Object.fromEntries(MATERIAL_FIELDS.map(f=>[f,unknownDatum()]));
const code={evidence_class:'public_user_account',relevant:'yes',scope_lane:'eligibility_unknown',metric_node:'setup_mandate',exit_form:'unknown',question_ids:['Q3','Q5'],material,final_state:'unresolved'};
const row=(id,extra={})=>({id,origin:'corpus',source_family:'Investing forums',url:`https://tradingqna.com/t/example/123/${id}`,source_locator:'post-'+id,evidence_lane:'user_voice',review_state:'accepted',local_use_status:'cleared',terms_status:'flagged',tier_a:code,...extra});

test('Nine answer packets count accepted local roots but do not manufacture answers',()=>{
 const cards=questionCards([row('one'),row('two'),row('pending',{review_state:'proposal'}),row('restricted',{local_use_status:'pending'}),row('synthetic',{origin:'synthetic_fixture'})]);
 assert.equal(cards.length,9);
 const q3=cards.find(x=>x.id==='Q3');
 assert.equal(q3.record_count,2);
 assert.equal(q3.source_root_count,1);
 assert.equal(q3.reviewed_root_denominator,1);
 assert.equal(q3.direct_answer,null);
 assert.equal(q3.fit_records.eligibility_unknown,2);
 assert.equal(cards.find(x=>x.id==='Q4').source_root_count,0);
 assert.match(cards.find(x=>x.id==='Q4').unknown,/frequency/i);
 assert.match(cards.find(x=>x.id==='Q4').next_decision,/cadence/i);
 assert.match(cards.find(x=>x.id==='Q7').next_decision,/continuer and an interrupter/i);
 assert.match(cards.find(x=>x.id==='Q8').next_decision,/explicitly stated income pattern/i);
});
test('Public answer packets exclude locally usable sources without publication clearance',()=>{
 const items=[row('local'),row('publish',{terms_status:'cleared'})];
 assert.equal(questionCards(items).find(x=>x.id==='Q3').record_count,2);
 assert.equal(questionCards(items,{publicOnly:true}).find(x=>x.id==='Q3').record_count,1);
});
test('Unreviewed leads are dependency grouped, local only and excluded from reviewed counts',()=>{
 const pending={...code,paraphrase:'Mandate did not debit; later payment unknown.'};
 const items=[row('one',{review_state:'proposal',tier_a:pending}),row('two',{review_state:'proposal',tier_a:pending}),row('blocked',{review_state:'proposal',local_use_status:'pending',tier_a:pending})];
 const local=questionCards(items).find(x=>x.id==='Q3');
 assert.equal(local.source_root_count,0);
 assert.equal(local.unreviewed_lead_roots,1);
 assert.equal(local.unreviewed_leads.length,1);
 assert.equal(local.unreviewed_leads[0].paraphrase,pending.paraphrase);
 assert.equal(questionCards(items,{publicOnly:true}).find(x=>x.id==='Q3').unreviewed_leads.length,0);
});
test('Working readings require their named usable proposal and never become approved answers',()=>{
 const first=row('I-4ee83186cfa8a499dfbe',{review_state:'proposal',tier_a:{...code,question_ids:['Q1','Q8'],paraphrase:'Planned SIP with emergency buffer.'}});
 const q1=questionCards([first]).find(x=>x.id==='Q1');
 assert.match(q1.working_reading.text,/emergency buffer/);
 assert.equal(q1.direct_answer,null);
 assert.equal(q1.source_root_count,0);
 assert.equal(questionCards([{...first,local_use_status:'pending'}]).find(x=>x.id==='Q1').working_reading,null);
 assert.equal(questionCards([first],{publicOnly:true}).find(x=>x.id==='Q1').working_reading,null);
});
