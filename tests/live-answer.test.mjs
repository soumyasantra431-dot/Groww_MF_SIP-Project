import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';

const card={id:'Q1',title:'Why start?',working_reading:{text:'One person planned a SIP after starting work.',url:'https://example.com/source',source_family:'Investing forums',scope_lane:'adjacent'},rival_to_check:'Another reason is possible.',unknown:'Groww outcome unknown.',next_decision:'Check a first-year account.'};
const env={ASSETS:{fetch:async()=>new Response(JSON.stringify({provisional_cards:[card]}))},ALLOW_ANSWER_CALLS:'true',ANSWER_KILL_SWITCH:'false',GROQ_API_KEY:'fixture'};
const ask=(question='Why start?')=>worker.fetch(new Request('https://viewer.example/api/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question_id:'Q1',question})}),env);

test('bounded public answer keeps source and unknown; rejects invented numbers',async()=>{
 const previous=globalThis.fetch;
 try{
  globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({answer:'One person planned a SIP after starting work; the later Groww outcome is unknown.'})}}]}));
  let result=await (await ask()).json();
  assert.equal(result.generated,true);assert.match(result.answer,/One person planned/);assert.equal(result.source.url,card.working_reading.url);assert.equal(result.status,'provisional_research_direction');assert.equal(result.unknown,card.unknown);
  globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify({answer:'This proves that 90 percent of investors remain active.'})}}]}));
  result=await (await ask()).json();assert.equal(result.generated,false);assert.equal(result.answer,card.working_reading.text);
 }finally{globalThis.fetch=previous;}
});

test('answer path rejects private details before a model call',async()=>{
 const r=await ask('my email is person@example.com');assert.equal(r.status,400);
});
