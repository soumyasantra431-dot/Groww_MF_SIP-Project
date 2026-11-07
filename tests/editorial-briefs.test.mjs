import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';
import {deskSources,editorialBriefs,validateEditorialBriefs} from '../engine/editorial-briefs.mjs';

test('all nine desk readings have linked sources, rivals and explicit gaps',()=>{
 assert.equal(validateEditorialBriefs(),true);
 assert.equal(Object.keys(editorialBriefs).length,9);
 const used=new Set();
 for(const [id,brief] of Object.entries(editorialBriefs)){
  assert.ok(brief.answer.length>80,id);
  assert.ok(brief.rival&&brief.unknown&&brief.next,id);
  for(const point of brief.points)for(const key of point.sources){used.add(key);assert.match(deskSources[key].url,/^https:\/\//);}
 }
 assert.deepEqual([...used].sort(),Object.keys(deskSources).sort());
 assert.match(editorialBriefs.Q4.unknown,/frequency/i);
 assert.match(editorialBriefs.Q7.unknown,/month-12/i);
});

test('published answer returns a cited reading without calling a model',async()=>{
 const previous=globalThis.fetch;
 globalThis.fetch=async()=>{throw Error('Model must not be called for desk reading');};
 try{
  const env={ASSETS:{fetch:async()=>new Response(JSON.stringify({editorial_briefs_version:1,provisional_cards:[{id:'Q3'}]}))},ALLOW_ANSWER_CALLS:'true',ANSWER_KILL_SWITCH:'false',GROQ_API_KEY:'fixture'};
  const request=new Request('https://viewer.example/api/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question_id:'Q3',question:'Why pause?'})});
  const result=await (await worker.fetch(request,env)).json();
  assert.equal(result.generated,false);
  assert.equal(result.status,'source_checked_desk_reading');
  assert.ok(result.points.length>=3);
  assert.ok(result.points.some(p=>p.sources.some(s=>s.url.startsWith('https://'))));
  assert.match(result.unknown,/unknown/i);
 }finally{globalThis.fetch=previous;}
});
