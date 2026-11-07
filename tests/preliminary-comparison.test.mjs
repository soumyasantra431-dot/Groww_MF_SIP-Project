import test from 'node:test';
import assert from 'node:assert/strict';
import {preliminaryComparison} from '../engine/preliminary-comparison.mjs';

const c={evidence_class:'public_user_account',relevant:'yes',scope_lane:'adjacent',metric_node:'unknown',exit_form:'unknown',question_ids:['Q3']};
const row=(id,post,extra={})=>({id,origin:'corpus',source_family:'Investing forums',url:`https://tradingqna.com/t/sip-cancel-on-mf/190338/${post}`,source_locator:`post-${post}`,evidence_lane:'user_voice',review_state:'proposal',local_use_status:'cleared',terms_status:'flagged',tier_a:c,...extra});

test('preliminary situations require every cited proposal and never count dependent posts as people',()=>{
 const first=row('I-ee755f7ea081bce89add','1');
 const duplicate=row('duplicate','2');
 const pending=row('unusable','3',{local_use_status:'pending'});
 const out=preliminaryComparison([first,duplicate,pending]);
 assert.equal(out.candidates.length,1);
 assert.equal(out.candidates[0].id,'schedule_meaning');
 assert.equal(out.candidates[0].source_root_count,1);
 assert.equal(out.proposal_records,2);
 assert.equal(out.proposal_roots,1);
 assert.equal(preliminaryComparison([row(first.id,'1',{review_state:'accepted'})]).candidates.length,0);
});

test('a SIP modification question does not count as a trust or support pause',()=>{
 const trust=row('I-0fdc1add96cfb39774ac','935',{url:'https://tradingqna.com/t/discontinuation-of-pooling-for-mutual-funds-and-how-it-affects-coin/120947/935'});
 const modification=row('I-21f5cec36a90bef96234','1',{url:'https://tradingqna.com/t/coin-sip-vs-amc-sip/127618/1'});
 const out=preliminaryComparison([trust,modification]);
 const lead=out.candidates.find(x=>x.id==='trust_support');
 assert.equal(lead.source_root_count,1);
 assert.deepEqual(lead.sources.map(x=>x.id),[trust.id]);
});
