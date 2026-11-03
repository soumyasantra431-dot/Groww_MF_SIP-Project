// Offline fixtures only; no model quality inference.
import test from 'node:test';
import assert from 'node:assert/strict';
import {z} from 'zod';
import {episodeSchema,classificationSchema,FACTORS,PROTECTIVE_FACTORS,BUNDLES,MATERIAL_FIELDS} from '../engine/contracts.mjs';
import {schemaGuide} from '../engine/schema-guide.mjs';
import {buildRequest,compactSchema,requestSize,GUIDE_REQUEST_PROFILE} from '../engine/request.mjs';
import {classify} from '../engine/provider.mjs';
test('Generated guide includes every key, enum, bound and reference in the approved schemas',()=>{
 for(const schema of [classificationSchema,episodeSchema]){
  const json=compactSchema(z.toJSONSchema(schema,{reused:'ref'})),guide=schemaGuide(json);
  const visit=s=>{
   if(s.properties)for(const [key,v]of Object.entries(s.properties)){assert.ok(guide.includes(key+':'));visit(v);}
   if(s.enum)for(const value of s.enum)assert.ok(guide.includes(JSON.stringify(value)));
   if('const' in s)assert.ok(guide.includes(JSON.stringify(s.const)));
   if(s.items){assert.ok(guide.includes('['+(s.minItems??0)+'..'+(s.maxItems??'unbounded')+']'));visit(s.items);}
   if(s.type==='string'&&!s.enum&&!('const' in s))assert.ok(guide.includes('string['+(s.minLength??0)+'..'+(s.maxLength??'unbounded')+']'));
   if(s.type==='integer')assert.ok(guide.includes('integer['+(s.minimum??'-infinity')+'..'+(s.maximum??'infinity')+']'));
   for(const v of s.anyOf||[])visit(v);
   for(const [name,v]of Object.entries(s.$defs||{})){assert.ok(guide.includes(name+'='));visit(v);}
   if(s.$ref)assert.ok(guide.includes(s.$ref.slice(8)));
  };visit(json);
 }
});
test('Guide rejects unsupported constraints rather than silently omitting them',()=>{
 assert.throws(()=>schemaGuide({type:'string',pattern:'x'}),/Unsupported guide keyword/);
 assert.throws(()=>schemaGuide({type:'object',properties:{a:{type:'string'}},required:[],additionalProperties:false}),/every key required/);
});
test('Guide transport keeps original text and full depth requirements with a lower request estimate',()=>{
 const input={text:'Synthetic negation: I did not stop. Nahi roka.',source_family:'Other'};
 const guided=buildRequest(input,'b',{transport:'json_guide'}),old=buildRequest(input,'b');
 assert.equal(JSON.parse(guided.messages[1].content).original_text,input.text);
 for(const key of [...FACTORS,...PROTECTIVE_FACTORS,...BUNDLES,...MATERIAL_FIELDS])assert.ok(guided.messages[0].content.includes(key+':'));
 assert.equal(guided.max_completion_tokens,4000);assert.equal(guided.reasoning_effort,'low');
 assert.equal(requestSize(guided).request_profile,GUIDE_REQUEST_PROFILE);
 assert.ok(requestSize(guided).serialized_request_tokens<requestSize(old).serialized_request_tokens);
});
test('JSON-mode malformed structure is rejected, never filled with unknowns or promoted to evidence',async()=>{
 let calls=0;const env={MODEL_BILLING_MODE:'free',GROQ_FREE_PLAN_CONFIRMED:'true',GROQ_API_KEY:'fixture',MODEL_SPEND_CAP_USD:'0',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false'};
 await assert.rejects(classify({reserveFree:async()=> 'fixture',settle:async()=>{}},{text:'Synthetic fixture only.',source_family:'Other'},'b',{env,transport:'json_guide',fetcher:async(_url,options)=>{
  calls++;assert.equal(JSON.parse(options.body).response_format.type,'json_object');
  return new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:'{}'}}],usage:{prompt_tokens:10,completion_tokens:2}}));
 }}),e=>{assert.match(e.message,/failed structure checks/);assert.equal(e.telemetry.validation.stage,'schema');assert.ok(e.telemetry.validation.issues.some(i=>i.path==='classification'));return true;});assert.equal(calls,1);
});
