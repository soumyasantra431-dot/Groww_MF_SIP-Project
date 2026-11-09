import test from 'node:test';
import assert from 'node:assert/strict';
import {score} from '../mvp/eval-score.mjs';

test('synthetic scoring fixture cannot pass without independent adjudication',()=>{
 const refs=Array.from({length:20},(_,i)=>({id:`synthetic-${i}`,human_labelled:true,expected_state:i<4?'unknown':'failed_reported'}));
 const predictions=refs.map(x=>({id:x.id,reported_state:x.expected_state,human_adjudicated:false}));
 const result=score(refs,predictions);
 assert.equal(result.pass,false);assert.equal(result.gates.complete,false);
 assert.equal(result.counts.correct,20);
});
test('a severe error blocks a fully adjudicated synthetic fixture',()=>{
 const refs=Array.from({length:20},(_,i)=>({id:`synthetic-${i}`,human_labelled:true,expected_state:i<4?'unknown':'failed_reported'}));
 const predictions=refs.map((x,i)=>({id:x.id,reported_state:x.expected_state,human_adjudicated:true,severe_error:i===0,invented_fields:i===0?1:0,missed_fields:0}));
 const result=score(refs,predictions);
 assert.equal(result.pass,false);assert.equal(result.counts.severe,1);assert.equal(result.counts.invented_fields,1);
});
