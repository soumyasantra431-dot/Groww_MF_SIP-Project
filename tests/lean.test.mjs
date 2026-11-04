import test from 'node:test';import assert from 'node:assert/strict';
import {buildRequest,requestSize} from '../engine/request.mjs';
import {leanSchema,leanWireSchema,validateLean,expandLeanWire,expandLeanWireTolerant,ambiguousLeanAnchors,LEAN_TEXT_FIELDS} from '../engine/lean.mjs';
import {MATERIAL_FIELDS,persistable} from '../engine/contracts.mjs';
const empty={state:'unknown',value:null,start:null,end:null};
test('Lean strict packet proposes supported quotes and fits frozen-style long synthetic text',()=>{
 const p=buildRequest({source_family:'Other',text:'Synthetic SIP fixture. '.repeat(150)},'lean');
 assert.equal(p.response_format.type,'json_schema');assert.equal(p.response_format.json_schema.strict,true);
 assert.deepEqual(Object.keys(leanSchema.shape.material.shape),MATERIAL_FIELDS);
 assert.deepEqual(leanWireSchema.properties.findings.items.properties.field.enum,LEAN_TEXT_FIELDS);
 assert.ok(requestSize(p).estimated_total<8000);
});
test('Lean wire expansion derives anchors, unknowns and trusted source metadata',()=>{
 const text='I started a mutual fund SIP on Groww. The second instalment failed.';
 const result=expandLeanWire({findings:[
  {field:'platform',value:'Groww',quote:'on Groww'},
  {field:'action_status',value:'attempted',quote:'instalment failed'},
  {field:'metric_node',value:'second_instalment',quote:'second instalment'}
 ]},text,'Other');
 assert.deepEqual(result.material.source_family,{state:'supported',value:'Other',start:null,end:null});
 assert.equal(result.material.platform.start,text.indexOf('on Groww'));
 assert.equal(result.material.reported_reason.state,'unknown');
 assert.equal(result.material.blamed_actor.state,'unknown');
 assert.equal(result.metric_node.value,'second_instalment');
});
test('Lean wire rejects invented or repeated fields and flags repeated quotes for review',()=>{
 const text='I paid, then I paid again.';
 assert.throws(()=>expandLeanWire({findings:[{field:'outcome',value:'settled',quote:'settled'}]},text,'Other'),/quote/);
 assert.deepEqual(ambiguousLeanAnchors({findings:[{field:'outcome',value:'paid',quote:'I paid'}]},text),['outcome']);
 assert.equal(expandLeanWire({findings:[{field:'outcome',value:'paid',quote:'I paid'}]},text,'Other').material.outcome.state,'supported');
 assert.throws(()=>expandLeanWire({findings:[{field:'outcome',value:'paid',quote:'I paid,'},{field:'outcome',value:'paid',quote:'then I paid'}]},'I paid, then I paid again.','Other'),/Repeated/);
});
test('Lean validation keeps metadata and source anchors honest',()=>{
 const value={metric_node:empty,exit_form:empty,material:Object.fromEntries(MATERIAL_FIELDS.map(k=>[k,empty]))};
 value.material.source_family={state:'supported',value:'Other',start:null,end:null};
 assert.doesNotThrow(()=>validateLean(leanSchema.parse(value),'Synthetic fixture','Other'));
 value.metric_node={state:'supported',value:'recovery',start:0,end:9};
 assert.doesNotThrow(()=>validateLean(value,'Synthetic fixture','Other'));
 value.metric_node.end=100;assert.throws(()=>validateLean(value,'Synthetic fixture','Other'),/anchor/);
 value.metric_node=empty;value.material.continuer={state:'supported',value:'yes',start:0,end:9};assert.doesNotThrow(()=>validateLean(value,'Synthetic fixture','Other'));
 value.material.continuer.value='maybe';assert.throws(()=>validateLean(value,'Synthetic fixture','Other'),/continuer/);
});
test('An open SIP is not proof of continued contributions',()=>{
 const text='I have not stopped the SIP.';
 assert.throws(()=>expandLeanWire({findings:[{field:'continuer',value:'yes',quote:'I have not stopped the SIP'}]},text,'Other'),/local validation/);
});
test('One bad quote or value is logged without discarding supported fields',()=>{
 const text='I started a mutual fund SIP on Groww. The second instalment failed.';
 const r=expandLeanWireTolerant({findings:[
  {field:'platform',value:'Groww',quote:'on Groww'},
  {field:'outcome',value:'settled',quote:'settled'},
  {field:'metric_node',value:'not_a_node',quote:'second instalment'}
 ]},text,'Other');
 assert.equal(r.value.material.platform.value,'Groww');
 assert.equal(r.value.material.outcome.state,'unknown');
 assert.equal(r.value.metric_node.state,'unknown');
 assert.deepEqual(r.rejected_fields,[{field:'outcome',code:'quote_absent'},{field:'metric_node',code:'invalid_value'}]);
});
test('Conflicting focal timing tags are held for review instead of counted',()=>{
 const text='I began a SIP four months ago and paused it today.';
 const wire={findings:[
  {field:'metric_node',value:'months_3_6',quote:'four months ago and paused it today'},
  {field:'journey_stage',value:'setup',quote:'I began a SIP'}
 ]};
 assert.throws(()=>expandLeanWire(wire,text,'Other'),/local validation/);
 const result=expandLeanWireTolerant(wire,text,'Other');
 assert.equal(result.value.metric_node.state,'unknown');
 assert.equal(result.value.material.journey_stage.state,'unknown');
 assert.deepEqual(result.rejected_fields.map(x=>x.code),['tag_pair_conflict','tag_pair_conflict']);
});
test('Lean proposal retains only offsets and derived labels for local source review',()=>{
 const text='The second instalment failed.';
 const result=expandLeanWire({findings:[{field:'metric_node',value:'second_instalment',quote:'second instalment'}]},text,'Other');
 const kept=persistable(result,{retainOffsets:true});
 assert.equal(kept.metric_node.start,4);
 assert.equal(kept.metric_node.end,21);
 assert.equal(JSON.stringify(kept).includes(text),false);
});
test('First SIP wording cannot anchor a first-instalment tag',()=>{
 const text='My first SIP on Groww had an auto-debit failure last month.';
 const r=expandLeanWireTolerant({findings:[{field:'metric_node',value:'first_instalment',quote:'first SIP on Groww had an auto-debit failure'}]},text,'Other');
 assert.equal(r.value.metric_node.state,'unknown');
 assert.deepEqual(r.rejected_fields,[{field:'metric_node',code:'invalid_value'}]);
});
