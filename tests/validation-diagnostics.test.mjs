import test from 'node:test';
import assert from 'node:assert/strict';
import {z} from 'zod';
import {episodeSchema} from '../engine/contracts.mjs';
import {validationDiagnostics} from '../engine/validation-diagnostics.mjs';
test('Validation diagnostics disclose known paths and codes, never values, messages or unexpected keys',()=>{
 const result=validationDiagnostics({issues:[
  {code:'invalid_type',path:['classification','material','trigger'],message:'secret value',input:'private'},
  {code:'invalid_type',path:['bundles','outcome',3,'state'],message:'private'},
  {code:'unrecognized_keys',path:['injected@example.test'],keys:['secret'],message:'private'}
 ]},z.toJSONSchema(episodeSchema,{reused:'ref'}));
 assert.equal(result.issues[0].path,'classification.material.trigger');
 assert.equal(result.issues[1].path,'bundles.outcome.[].state');
 assert.equal(result.issues[2].path,'[unrecognised]');
 for(const text of ['private','secret','injected','@'])assert.equal(JSON.stringify(result).includes(text),false);
});
test('Validation diagnostic output is bounded without losing total issue count',()=>{
 const result=validationDiagnostics({issues:Array.from({length:30},()=>({code:'custom',path:[]}))},z.toJSONSchema(episodeSchema));
 assert.equal(result.issue_count,30);assert.equal(result.issues.length,20);assert.equal(result.details_capped,true);
});
