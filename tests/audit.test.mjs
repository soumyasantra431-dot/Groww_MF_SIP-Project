// Engineering fixtures only; no investor or model-quality evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {MATERIAL_FIELDS,unknownDatum,validateEvidence} from '../engine/contracts.mjs';
import {rollup,selectTierB,deckExports,evaluate} from '../engine/analysis.mjs';
import {driverEvidence,corpusReadiness} from '../engine/scope.mjs';
import {researchPlan} from '../engine/research-plan.mjs';
import {openStore} from '../engine/store.mjs';
import {classify,modelStatus} from '../engine/provider.mjs';
const c=(x={})=>({evidence_class:'public_user_account',relevant:'yes',metric_node:'unknown',exit_form:'unknown',reason_families:['execution'],journey_bucket:'unknown',initiating_event:'fixture',final_state:'unknown',paraphrase:'Engineering fixture.',question_ids:['Q3'],scope_lane:'eligibility_unknown',plan_route:'unknown',eligibility:{first_time_mf:unknownDatum(),first_sip_on_groww:unknownDatum(),within_first_12_months:unknownDatum()},narrative:{trigger:unknownDatum(),action:unknownDatum()},material:Object.fromEntries(MATERIAL_FIELDS.map(f=>[f,unknownDatum()])),...x});
const r=(id,code,extra={})=>({id,source_family:'Other',url:'https://example.org/'+id,origin:'corpus',evidence_lane:'user_voice',tier_a:code,...extra});
const withStore=async fn=>{const prefix=join(tmpdir(),'sip-audit-'),dir=mkdtempSync(prefix),store=openStore(dir);try{await fn(store);}finally{store.close();assert.ok(dir.startsWith(prefix));rmSync(dir,{recursive:true,force:true});}};
test('Scope exclusions agree across question counts, driver support, exports and readiness',()=>{
 const out=r('out',c({scope_lane:'out_of_scope'})),stock=r('stock',c());stock.tier_a.material.instrument={state:'supported',value:'stock'};
 const rows=[out,stock,r('valid',c())],roll=rollup(rows);assert.equal(roll.user_voice_coded,1);assert.equal(roll.questions[2].count,1);assert.equal(Object.values(roll.analysis_dispositions).reduce((n,v)=>n+v,0),roll.coded);assert.equal(roll.analysis_dispositions.out_of_scope,2);
 assert.ok(!deckExports(rows).triangulation.includes('https://example.org/out'));assert.equal(corpusReadiness(rows).user_voice_records,1);assert.equal(selectTierB([out,stock]).selected,0);
 out.tier_b={classification:out.tier_a,driver_hypotheses:[{hypothesis:'unsupported grouping'}]};assert.equal(driverEvidence([out]).length,0);
});
test('Conflicting scope labels are rejected rather than quietly becoming findings',()=>{
 assert.throws(()=>validateEvidence(c({scope_lane:'out_of_scope'}),'source fixture text','Other'),/Inconsistent scope/);
 const bad=c();bad.material.instrument={state:'supported',value:'stock',missing_reason:null,start:0,end:5};assert.throws(()=>validateEvidence(bad,'stock fixture text','Other'),/Inconsistent scope/);
});
test('Synthetic cases remain outside research counts even if given public-looking labels',()=>{
 const fake=r('synthetic',c(),{data_kind:'synthetic_fixture'});assert.equal(rollup([fake]).user_voice_coded,0);assert.equal(corpusReadiness([fake]).user_voice_records,0);assert.equal(rollup([fake]).analysis_dispositions.synthetic_fixture,1);
});
test('The nine-question plan discloses unrun analysis and all seven source families',()=>{
 const p=researchPlan([]);assert.equal(p.questions.length,9);assert.equal(p.sources.length,7);assert.ok(p.questions.every(q=>q.status==='analysis_unrun'));assert.match(p.decision_boundary,/none is selected/);
 assert.ok(p.questions.every(q=>q.answer_requirement));assert.ok(p.sources.every(s=>s.seek&&s.route&&s.tier&&s.limit));assert.match(p.workflow.dataset_rule,/Invented investor stories are test fixtures/);
});

test('Unprocessed input coverage cannot be presented as coded evidence or finished answers',()=>{
 const plan=researchPlan([r('unrun',null,{source_family:'Investing forums'})]);
 const forum=plan.sources.find(s=>s.source_family==='Investing forums');
 assert.equal(forum.user_voice_inputs,1);assert.equal(forum.coded_user_voice,0);assert.equal(forum.dependency_grouped_roots,0);
 assert.ok(plan.questions.every(q=>q.denominator===0&&q.proposed_items===0));assert.match(plan.narrative_status,/not built/);
});
test('Echoed metadata cannot inflate source-text recall; omitted fields remain unrun',()=>{
 const material=c().material;material.source_family={state:'supported',value:'Other'};material.platform={state:'supported',value:'Groww'};
 const prediction=c().material;prediction.source_family=material.source_family;
 const result=evaluate([{id:'g',material}],[{id:'g',material:prediction}]);assert.equal(result.K,2);assert.equal(result.C,1);assert.equal(result.source_text.K,1);assert.equal(result.source_text.C,0);assert.equal(result.source_text.explicit_field_recall,0);
 const partial=evaluate([{id:'g',material}],[{id:'g',material:{source_family:material.source_family}}]);assert.equal(partial.status,'partial_missing_fields');assert.equal(partial.unrun_fields,9);
 assert.throws(()=>evaluate([{id:'g',material,input_sha256:'frozen'}],[{id:'g',material:prediction,input_sha256:'different'}]),/frozen reference/);
});
test('Free mode requires confirmed Free-plan status and never falls back to paid',async()=>{
 const env={MODEL_BILLING_MODE:'free',GROQ_API_KEY:'fixture-only',MODEL_SPEND_CAP_USD:'0',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false'};assert.equal(modelStatus(env).enabled,false);
 let calls=0;await assert.rejects(classify({},{text:'engineering fixture',source_family:'Other'},'a',{env,fetcher:()=>{calls++;}}),/AI disabled/);assert.equal(calls,0);
 assert.equal(modelStatus({...env,GROQ_FREE_PLAN_CONFIRMED:'true'}).enabled,true);assert.equal(modelStatus({...env,GROQ_FREE_PLAN_CONFIRMED:'true',MODEL_SPEND_CAP_USD:'1'}).enabled,false);
});
test('Confirmed free-plan mock request records zero monetary spend, quota use and pacing',()=>withStore(async store=>{
 const env={MODEL_BILLING_MODE:'free',GROQ_FREE_PLAN_CONFIRMED:'true',GROQ_API_KEY:'fixture-only',MODEL_SPEND_CAP_USD:'0',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',RESEARCH_SPEND_ALLOCATION_USD:'0',PUBLIC_SPEND_ALLOCATION_USD:'0'};let calls=0;
 const options={env,fetcher:async(_url,args)=>{calls++;const packet=JSON.parse(args.body);assert.ok(packet.response_format.json_schema.schema.$defs);return new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(c())}}],usage:{prompt_tokens:500,completion_tokens:100}}));}};
 const result=await classify(store,{text:'Engineering fixture only.',source_family:'Other'},'a',{...options,publicDemo:true});assert.equal(result.run.billing_mode,'free');assert.equal(store.spend().calls,1);assert.equal(store.spend().committed_usd,0);assert.equal(store.spend().unreconciled,0);
 await assert.rejects(classify(store,{text:'Engineering fixture only.',source_family:'Other'},'a',options),/pacing/);assert.equal(calls,1);
}));
