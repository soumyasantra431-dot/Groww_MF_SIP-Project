import test from 'node:test';import assert from 'node:assert/strict';
import {opportunityComparisons} from '../engine/opportunity-comparison.mjs';
import {deckExports} from '../engine/analysis.mjs';
import {MATERIAL_FIELDS,unknownDatum} from '../engine/contracts.mjs';
const code={evidence_class:'public_user_account',relevant:'yes',scope_lane:'eligibility_unknown',metric_node:'setup_mandate',exit_form:'unknown',reason_families:['execution'],question_ids:['Q3'],material:Object.fromEntries(MATERIAL_FIELDS.map(k=>[k,unknownDatum()])),eligibility:{first_time_mf:unknownDatum(),first_sip_on_groww:unknownDatum(),within_first_12_months:unknownDatum()}};
const row=(id,extra={})=>({id,source_family:'Investing forums',url:'https://tradingqna.com/t/topic/123/'+id,origin:'corpus',evidence_lane:'user_voice',review_state:'accepted',terms_status:'cleared',hypothesis:'Mandate status hard to interpret',tier_a:code,...extra});
test('Comparison counts reviewed dependent roots, never reason-only or rejected records',()=>{
 const a=row('1'),b=row('2'),pending=row('3',{review_state:'proposal'}),restricted=row('4',{terms_status:'restricted'}),synthetic=row('5',{origin:'synthetic_fixture'}),reasonOnly=row('6',{hypothesis:''});
 const data=opportunityComparisons([a,b,pending,restricted,synthetic,reasonOnly]);
 assert.equal(data.candidates.length,1);assert.equal(data.candidates[0].record_count,2);assert.equal(data.candidates[0].source_root_count,1);assert.equal(data.candidates[0].denominator_roots,1);assert.equal(data.candidates[0].population_reach,'unknown');
 const out=deckExports([a,b,pending,restricted,synthetic,reasonOnly]);assert.ok(out.opportunities.includes('Mandate status hard to interpret'));assert.equal(out.opportunities.includes('"execution"'),false);
});
test('No accepted named source means no candidate problem',()=>{
 const data=opportunityComparisons([row('1',{hypothesis:''})]);assert.equal(data.candidates.length,0);assert.equal(data.status,'no_reviewed_candidate_problems');
});
