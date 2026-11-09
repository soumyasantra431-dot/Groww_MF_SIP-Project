import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreMap} from '../mvp/map-eval.mjs';

function fixture(){const expected={intent:'wanted',bank_debit:'yes',groww_order:'processing',workaround:'manual_payment',next_scheduled:'unknown',other_sip:'unknown'};const refs=Array.from({length:20},(_,i)=>({id:`synthetic-${i}`,human_labelled:true,expected}));const predictions=refs.map(x=>({id:x.id,fields:{...expected},model_used:true,human_adjudicated:true}));return {refs,predictions};}
test('map scorer accounts for every synthetic field and does not hide an invented next result',()=>{
 const {refs,predictions}=fixture();predictions[0].fields.next_scheduled='completed';
 const score=scoreMap(refs,predictions);assert.equal(Object.values(score.tally).reduce((a,b)=>a+b,0),120);assert.equal(score.tally.invented,1);assert.equal(score.pass,false);
});
test('a processing failure remains in every field denominator',()=>{
 const {refs,predictions}=fixture();predictions[0].processing_failure=true;
 const score=scoreMap(refs,predictions);assert.equal(score.tally.processing_failure,6);assert.equal(score.explicit.denominator,80);assert.equal(score.unknown.denominator,40);
});
test('independent human adjudication and all-field coverage are required',()=>{
 const {refs,predictions}=fixture();predictions[0].human_adjudicated=false;
 const score=scoreMap(refs,predictions);assert.equal(score.gates.complete,false);assert.equal(score.pass,false);
});
