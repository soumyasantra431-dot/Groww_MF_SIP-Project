// Engineering checks using explicit synthetic data. No investor evidence or live API calls.
import test from 'node:test';
import assert from 'node:assert/strict';
import {presentField,labelFor} from '../src/evidence-language.ts';
import {classify} from '../engine/provider.mjs';
import {EXTRACTION_VERSION,MATERIAL_FIELDS,unknownDatum} from '../engine/contracts.mjs';
import {COMPACT_RULES,REQUEST_PROFILE} from '../engine/request.mjs';

test('An unrun field is visibly different from an analysed source with a missing fact',()=>{
 const unrun=presentField('journey_stage');const missing=presentField('journey_stage',{state:'unknown',value:null,missing_reason:'not_stated'});
 assert.equal(unrun.status,'Not analysed yet');assert.equal(missing.status,'Not stated or unclear');
 assert.equal(unrun.value,null);assert.equal(missing.value,null);assert.match(missing.explanation,/first-year clock/);
});

test('Unknown explanations retain ambiguity and conflict instead of inventing an answer',()=>{
 const ambiguous=presentField('reported_reason',{state:'unknown',missing_reason:'ambiguous'});
 const conflicting=presentField('reported_reason',{state:'unknown',missing_reason:'conflicting'});
 assert.match(ambiguous.explanation,/more than one interpretation/);assert.match(conflicting.explanation,/reconciled/);
 assert.equal(ambiguous.value,null);assert.equal(conflicting.value,null);
});

test('Inapplicable is explained without claiming that missing data or actor responsibility was resolved',()=>{
 const p=presentField('blamed_actor',{state:'not_applicable',value:null});
 assert.match(p.status,/Does not apply/);assert.match(p.explanation,/simply missing/);assert.match(p.explanation,/does not establish who actually caused/);
 const unknown=presentField('blamed_actor',{state:'unknown',value:null});assert.notEqual(p.status,unknown.status);
});

test('Completed setup and explicit continuation remain different claims in the reader',()=>{
 assert.equal(presentField('continuer',{state:'unknown'}).value,null);
 assert.equal(presentField('continuer',{state:'supported',value:'yes'}).value,'Ongoing SIP contributions explicitly reported');
 assert.match(presentField('outcome',{state:'supported',value:'Mandate created'}).explanation,/not proof of a completed SIP investment/);
 assert.match(labelFor('needs_review'),/closer look/);
});

test('Provider request uses the versioned clarification and returns its version without a real network request',async()=>{
 let requestBody=null;let settled=0;
 const fakeStore={reserveFree:async()=> 'synthetic-reservation',settle:async()=>{settled++;}};
 const result={evidence_class:'unknown',relevant:'uncertain',metric_node:'unknown',exit_form:'unknown',reason_families:['unknown'],journey_bucket:'unknown',initiating_event:'Not established in synthetic fixture',final_state:'Not stated',paraphrase:'Synthetic engineering fixture only.',question_ids:[],scope_lane:'eligibility_unknown',plan_route:'unknown',eligibility:{first_time_mf:unknownDatum(),first_sip_on_groww:unknownDatum(),within_first_12_months:unknownDatum()},narrative:{trigger:unknownDatum(),action:unknownDatum()},material:Object.fromEntries(MATERIAL_FIELDS.map(k=>[k,unknownDatum()]))};
 result.material.source_family={state:'supported',value:'Other',missing_reason:null,start:null,end:null};
 const env={MODEL_PROVIDER:'groq',MODEL_ID:'openai/gpt-oss-120b',MODEL_BILLING_MODE:'free',GROQ_FREE_PLAN_CONFIRMED:'true',GROQ_API_KEY:'synthetic-test-key',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_SPEND_CAP_USD:'0',MODEL_INPUT_USD_PER_MILLION:'.15',MODEL_OUTPUT_USD_PER_MILLION:'.6'};
 const got=await classify(fakeStore,{source_family:'Other',text:'Synthetic non-investor engineering input.'},'a',{env,fetcher:async(_url,options)=>{requestBody=JSON.parse(options.body);return new Response(JSON.stringify({usage:{prompt_tokens:50,completion_tokens:30},choices:[{finish_reason:'stop',message:{content:JSON.stringify(result)}}]}),{status:200});}});
 assert.ok(requestBody.messages[0].content.includes(COMPACT_RULES.attribution));assert.ok(requestBody.messages[0].content.includes(EXTRACTION_VERSION));assert.equal(got.run.request_profile,REQUEST_PROFILE);
 assert.equal(got.run.extraction_version,EXTRACTION_VERSION);assert.equal(got.run.telemetry.total_tokens,80);assert.equal(settled,1);
 assert.equal(got.result.material.reported_reason.state,'unknown');
});
