// Explicit synthetic engineering fixtures. No participant evidence or live provider calls.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MATERIAL_FIELDS,BUNDLES,FACTORS,PROTECTIVE_FACTORS,unknownDatum} from '../engine/contracts.mjs';
import {prepareSmokePack,validatePilotConsent,validateBlindReceipt,hash,scoreSmoke,pairwiseLabels,freeCapacity,PILOT_STRATA} from '../engine/smoke-pilot.mjs';
import {classify} from '../engine/provider.mjs';

const supported=value=>({state:'supported',value,missing_reason:null,start:0,end:4});
const unknown=()=>({state:'unknown',value:null});
const terms=[{id:'fixture',domain:'example.org',terms_url:'https://example.org/terms',collection_allowed:true,model_processing_allowed:true,checked_on:'2026-11-01',basis:'Synthetic test permission; never authorises real source use'}];
const candidates=()=>Array.from({length:10},(_,i)=>({id:'P'+String(i+1).padStart(2,'0'),source_family:'Other',url:'https://example.org/fictional/'+i,source_locator:'post-'+i,text:'Synthetic engineering fixture; no actual investor. Main SIP band nahi kiya.',origin:'public_account',terms_id:'fixture',eligibility:{first_time_mf:'unknown',first_sip_on_groww:'unknown',within_first_12_months:'unknown'},privacy_review:'manually_checked_deidentified',redaction_categories:[],coverage:[PILOT_STRATA[i]],language:i===0?'Hinglish':'English',negation:i===0,speaker_roles:['op'],dependency_root:'fixture-root-'+i}));
const pack=()=>prepareSmokePack(candidates(),terms,{protocolHash:'a'.repeat(64),fallbackPublicOnly:true,now:'2026-11-01T12:00:00Z'});
const references=()=>Array.from({length:10},(_,i)=>({id:'P'+String(i+1).padStart(2,'0'),input_sha256:hash('fictional-'+i),material:Object.fromEntries(MATERIAL_FIELDS.map((f,j)=>[f,j<4?supported('fixture-'+f):unknown()])),metric_node:unknown(),exit_form:unknown()}));
const attempts=()=>Array.from({length:10},()=>({processing_status:'completed'}));
const reviewed={severeReviewComplete:true,semanticReviewComplete:true,severeErrors:0,nonEpisodeReviewComplete:true,attempts:attempts()};

test('Pilot freeze rejects unresolved terms, private patterns, missing manual review and unconsented first-hand accounts',()=>{
 const rows=candidates();assert.throws(()=>prepareSmokePack(rows,[{...terms[0],model_processing_allowed:false}],{protocolHash:'a'.repeat(64),fallbackPublicOnly:true}),/basis/);
 for(const text of ['9'.repeat(10),['ABCDE','1234','F'].join(''),'private@bank','HDFC0'+'0'.repeat(6),'Rs '+123]){const r=candidates();r[0].text=text;assert.throws(()=>prepareSmokePack(r,terms,{protocolHash:'a'.repeat(64),fallbackPublicOnly:true}),/Private/);}
 const r=candidates();r[0].privacy_review='not_checked';assert.throws(()=>prepareSmokePack(r,terms,{protocolHash:'a'.repeat(64),fallbackPublicOnly:true}),/Manual/);
 const f=candidates();Object.assign(f[0],{origin:'consented_first_hand',url:null,participant_id:'R01'});assert.throws(()=>prepareSmokePack(f,terms,{protocolHash:'a'.repeat(64)}),/Permission/);
 assert.throws(()=>prepareSmokePack(candidates(),terms,{protocolHash:'a'.repeat(64)}),/three distinct/);
});

test('Fellow permission attestation is accepted without fabricating individual consent receipts or dates',()=>{
 const permission={affirmative:true,external_ai_processing:true,basis:'fellow_attestation',date:null,confirmed_on:'2026-11-01'};
 const r=validatePilotConsent(permission,'2026-11-01T15:00:00Z');assert.equal(r.basis,'fellow_attestation');assert.equal(r.participant_consent_date,null);
 assert.throws(()=>validatePilotConsent({...permission,date:'2026-11-01'},'2026-11-01T15:00:00Z'),/substitute/);
 assert.throws(()=>validatePilotConsent({...permission,affirmative:false},'2026-11-01T15:00:00Z'),/Permission/);
});

test('Blind pack withholds expected answers/strata, preserves exact inputs and enforces pre-output chronology',()=>{
 const p=pack();assert.equal(p.manifest.counts.unknown,10);assert.equal(p.manifest.counts.direct,0);assert.equal(p.inputs[0].text,candidates()[0].text);
 assert.equal('coverage' in p.inputs[0],false);assert.equal(p.fellow_labels.items[0].material.platform.state,null);assert.equal(p.fellow_labels.completed_at,null);
 const l=structuredClone(p.fellow_labels);l.completed_at='2026-11-01T12:20:00Z';l.blind_before_model_output=true;for(const r of l.items){r.material=Object.fromEntries(MATERIAL_FIELDS.map(f=>[f,unknown()]));r.metric_node=unknown();r.exit_form=unknown();r.disposition='flagged_non_episode';}
 assert.equal(validateBlindReceipt(p.manifest,l,'2026-11-01T12:30:00Z'),true);
 assert.throws(()=>validateBlindReceipt(p.manifest,l,'2026-11-01T12:10:00Z'),/before/);
 l.items[0].input_sha256='b'.repeat(64);assert.throws(()=>validateBlindReceipt(p.manifest,l,'2026-11-01T12:30:00Z'),/hash/);
});

test('Smoke scorer excludes echoed metadata, reports unrun separately and preserves K=C+W+A+U',()=>{
 const refs=references();const unrun=scoreSmoke(refs,[]);assert.equal(unrun.decision,'incomplete_or_inconclusive');assert.equal(unrun.source_text.K,30);assert.equal(unrun.source_text.U,30);assert.equal(unrun.source_text.abstained,0);
 const preds=structuredClone(refs);preds[0].material.platform=unknown();preds[1].material.instrument=supported('wrong instrument');preds[2].material.trigger=supported('unsupported assertion');
 const r=scoreSmoke(refs,preds,reviewed);assert.equal(r.source_text.C,28);assert.equal(r.source_text.W,1);assert.equal(r.source_text.A,1);assert.equal(r.source_text.U,0);assert.equal(r.source_text.K,r.source_text.C+r.source_text.W+r.source_text.A+r.source_text.U);assert.equal(r.source_text.invented_value_flags,1);assert.equal(r.source_text.missed_explicit,2);assert.equal(r.provided_metadata.correct,10);
 preds[0].input_sha256='c'.repeat(64);assert.throws(()=>scoreSmoke(refs,preds),/hash/);
});

test('Smoke gates stop severe/low recall; do not hide tag errors or a failed non-episode guard',()=>{
 const refs=references(),preds=structuredClone(refs);assert.equal(scoreSmoke(refs,preds,reviewed).decision,'scale_bounded_batch');
 assert.equal(scoreSmoke(refs,preds,{...reviewed,severeErrors:1}).decision,'simplify_and_report');
 assert.equal(scoreSmoke(refs,preds,{...reviewed,nonEpisodeFailures:1}).decision,'hold_scaling_repair_and_report');
 preds[0].exit_form=supported('voluntary');assert.equal(scoreSmoke(refs,preds,reviewed).decision,'hold_scaling_repair_and_report');
 for(const p of preds)for(const f of ['platform','instrument','journey_stage'])p.material[f]=unknown();assert.equal(scoreSmoke(refs,preds,reviewed).decision,'simplify_and_report');
});

test('One allowed processing failure remains in field denominators rather than disappearing',()=>{
 const refs=references(),preds=structuredClone(refs).slice(0,9),ops=attempts();ops[9].processing_status='failed';
 const r=scoreSmoke(refs,preds,{...reviewed,attempts:ops});assert.equal(r.source_text.explicit_field_recall.value,27/30);assert.equal(r.source_text.unknown_retention.value,54/60);assert.equal(r.source_text.U,3);assert.equal(r.processing.failures,1);assert.equal(r.decision,'scale_bounded_batch');
 const pair=pairwiseLabels(refs,preds);assert.equal(pair.comparable,9*12);assert.equal(pair.exact_agreement,9*12);
});

test('One-field misses trigger development reuse; no supported/unknown denominator can manufacture pass',()=>{
 const refs=references(),preds=structuredClone(refs);for(const i of [0,1])preds[i].material.trigger=supported('invented');const r=scoreSmoke(refs,preds,reviewed);assert.equal(r.decision,'repair_and_rerun_development_reuse');
 const empty=references();for(const r of empty)for(const f of MATERIAL_FIELDS)r.material[f]=unknown();assert.notEqual(scoreSmoke(empty,structuredClone(empty),reviewed).decision,'scale_bounded_batch');
});

test('Free capacity remains unknown without real usage and exposes arithmetic when measurements exist',()=>{
 assert.equal(freeCapacity([]).items_per_available_window,null);
 const r=freeCapacity([{processing_status:'completed',prompt_tokens:3500,completion_tokens:1500,latency_ms:2000}]);assert.equal(r.worst_observed_tokens_per_item,5000);assert.equal(r.bounds.daily_tokens,Math.floor(180000/5000));assert.equal(r.items_per_available_window,36);
});

test('Free-text paraphrases need recorded semantic adjudication, never silent edits to a frozen reference',()=>{
 const refs=references(),preds=structuredClone(refs);preds[0].material.platform.value='A different wording to inspect';
 assert.equal(scoreSmoke(refs,preds,{...reviewed,semanticReviewComplete:false}).decision,'incomplete_or_inconclusive');
 const r=scoreSmoke(refs,preds,{...reviewed,adjudications:[{id:'P01',field:'platform',verdict:'correct',reviewer:'assistant',reason:'Engineering fixture: adjudicator recorded equivalent meaning after source review'}]});
 assert.equal(r.rows.find(x=>x.id==='P01'&&x.field==='platform').exact_verdict,'wrong');assert.equal(refs[0].material.platform.value,'fixture-platform');assert.equal(r.source_text.C,30);
});

const episode=()=>({classification:{evidence_class:'unknown',relevant:'no',metric_node:'unknown',exit_form:'unknown',reason_families:['unknown'],journey_bucket:'unknown',initiating_event:'No episode',final_state:'Unknown',paraphrase:'Synthetic test control.',question_ids:[],scope_lane:'out_of_scope',plan_route:'unknown',eligibility:{first_time_mf:unknownDatum(),first_sip_on_groww:unknownDatum(),within_first_12_months:unknownDatum()},narrative:{trigger:unknownDatum(),action:unknownDatum()},material:Object.fromEntries(MATERIAL_FIELDS.map(f=>[f,f==='source_family'?{...supported('Other'),start:null,end:null}:unknownDatum()]))},bundles:Object.fromEntries(BUNDLES.map(b=>[b,[]])),factors:Object.fromEntries(FACTORS.map(f=>[f,{state:'unknown',value:null,start:null,end:null}])),protective_factors:Object.fromEntries(PROTECTIVE_FACTORS.map(f=>[f,{state:'unknown',value:null,start:null,end:null}])),situation:unknownDatum(),driver_hypotheses:[]});
const env={MODEL_BILLING_MODE:'free',GROQ_FREE_PLAN_CONFIRMED:'true',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_SPEND_CAP_USD:'0',GROQ_API_KEY:'fake-not-a-key',MODEL_INPUT_USD_PER_MILLION:'1',MODEL_OUTPUT_USD_PER_MILLION:'1'};
const fakeStore={reserveFree:async()=> 'explicit-test-reservation',settle:async()=>{}};
test('Provider returns only safe measured telemetry; fake success, truncation and 429 are distinguishable',async()=>{
 const input={text:'Synthetic engineering test, not a participant.',source_family:'Other'};
 const ok=await classify(fakeStore,input,'b',{env,fetcher:async()=>new Response(JSON.stringify({usage:{prompt_tokens:123,completion_tokens:45,total_tokens:168},choices:[{finish_reason:'stop',message:{content:JSON.stringify(episode())}}]}),{status:200})});
 assert.equal(ok.run.telemetry.total_tokens,168);assert.equal(ok.run.telemetry.processing_status,'completed');assert.ok(ok.run.telemetry.latency_ms>=0);assert.equal('text' in ok.run.telemetry,false);
 await assert.rejects(classify(fakeStore,input,'b',{env,fetcher:async()=>new Response('Do not retain this body',{status:429,headers:{'retry-after':'2'}})}),e=>e.telemetry.rate_limited===true&&e.telemetry.rate_headers['retry-after']==='2'&&!e.message.includes('retain this body'));
 await assert.rejects(classify(fakeStore,input,'b',{env,fetcher:async()=>new Response(JSON.stringify({usage:{prompt_tokens:1,completion_tokens:2},choices:[{finish_reason:'length'}]}),{status:200})}),e=>e.telemetry.truncated===true&&e.telemetry.total_tokens===3);
});
