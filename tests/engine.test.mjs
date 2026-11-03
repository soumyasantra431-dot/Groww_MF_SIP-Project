import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { classificationSchema,privateSignals,safeUrl,persistable,unknownDatum,validateEvidence,MATERIAL_FIELDS } from '../engine/contracts.mjs';
import { openStore } from '../engine/store.mjs';
import { importCorpus,parseCorpus,originalInput } from '../engine/intake.mjs';
import { rollup,selectTierB,evaluate,csv } from '../engine/analysis.mjs';
import { classify } from '../engine/provider.mjs';
import publicWorker from '../worker/index.mjs';
function example(overrides={}){return {evidence_class:'public_user_account',relevant:'uncertain',metric_node:'unknown',exit_form:'unknown',reason_families:['unknown'],journey_bucket:'unknown',initiating_event:'Unknown',final_state:'Unknown',paraphrase:'Insufficient context to classify.',question_ids:[],scope_lane:'eligibility_unknown',plan_route:'unknown',eligibility:{first_time_mf:unknownDatum(),first_sip_on_groww:unknownDatum(),within_first_12_months:unknownDatum()},narrative:{trigger:unknownDatum(),action:unknownDatum()},material:Object.fromEntries(MATERIAL_FIELDS.map(f=>[f,unknownDatum()])),...overrides};}
const withStore=fn=>{const prefix=join(tmpdir(),'sip-engine-test-'),dir=mkdtempSync(prefix);const store=openStore(dir);return Promise.resolve().then(()=>fn(store)).finally(()=>{store.close();assert.ok(dir.startsWith(prefix));rmSync(dir,{recursive:true,force:true});});};
const input={source_family:'Reddit',url:'https://www.reddit.com/r/mutualfunds/comments/example/',date:'',text:'I paused my SIP.'};
test('CSV preserves multiline text and rejects missing columns, over-cap input and private data',()=>{
 const text='First line, question\nsecond line';const parsed=parseCorpus(csv(['source_family','url','date','text'],[{...input,text}]));assert.equal(parsed[0].text,text);
 assert.throws(()=>parseCorpus('source_family,url,date\nReddit,https://example.com,\n'));
 assert.throws(()=>parseCorpus(csv(['source_family','url','date','text'],Array(201).fill(input))));
 assert.throws(()=>parseCorpus(csv(['source_family','url','date','text'],[{...input,text:'My PAN is ABCDE1234F'}])));
});
test('Identifiers, private URLs and profile links are not admitted',()=>{
 assert.equal(privateSignals('My account: 123456789012').length,1);assert.equal(privateSignals('about month 12').length,0);
 for(const u of ['http://example.com','https://127.0.0.1','https://192.168.1.2','https://name:pass@example.com','https://reddit.com/user/example','file:///secret'])assert.equal(safeUrl(u),null);
 assert.ok(safeUrl(input.url));
});
test('Raw original is separate from database item metadata; repeated uploads do not inflate items',()=>withStore(store=>{
 const content=csv(['source_family','url','date','text'],[input]);assert.equal(importCorpus(store,content).inserted,1);assert.equal(importCorpus(store,content).duplicates,1);
 const r=store.items()[0];assert.equal(originalInput(store,r.id).text,input.text);assert.ok(!JSON.stringify(r).includes(input.text));assert.equal(r.raw_file,undefined);
}));
test('Canonical duplicate intake preserves originals and frozen IDs without inflating counts',()=>withStore(store=>{
 const first=importCorpus(store,csv(['source_family','url','date','text'],[input]));const id=store.items()[0].id;
 const result=importCorpus(store,csv(['source_family','url','date','text'],[{...input,url:input.url+'?utm_source=share',text:' I paused\n my SIP. '} ]));
 assert.equal(first.inserted,1);assert.equal(result.duplicates,1);assert.equal(result.inserted,0);assert.equal(store.items()[0].id,id);assert.equal(originalInput(store,id).text,input.text);
 const separate=importCorpus(store,csv(['source_family','url','date','text','source_locator'],[{...input,source_locator:'review-one'},{...input,source_locator:'review-two'}]));
 assert.equal(separate.inserted,2);assert.equal(store.items().filter(r=>r.source_locator).length,2);
}));
test('Link-only or blank-text CSV is rejected, not counted as analysed',()=>withStore(store=>{
 assert.throws(()=>importCorpus(store,csv(['source_family','url','date','text'],[{...input,text:'  '} ])),/Original public text/);assert.equal(store.items().length,0);
}));
test('Every coded item has exactly one node×exit cell; unknown and no-relevance retained',()=>{
 const items=[{id:'1',tier_a:example()},{id:'2',tier_a:example({relevant:'no',metric_node:'first_instalment',exit_form:'involuntary'})},{id:'3'}];const r=rollup(items);assert.equal(r.total,r.coded+r.uncoded);assert.equal(r.user_voice_coded,r.cells.reduce((s,c)=>s+c.count,0));assert.equal(r.relevance.uncertain,1);assert.equal(r.questions.length,9);assert.equal(r.questions[0].denominator,1);
});
test('Tier B cap, deterministic order, uncertainty and no-relevance exclusions',()=>{
 const items=Array.from({length:80},(_,i)=>({id:String(i).padStart(3,'0'),origin:'corpus',source_family:'Reddit',tier_a:example({narrative:{trigger:{state:'supported',value:'a stated circumstance'},action:{state:'supported',value:'a reported action'}},relevant:i<15?'uncertain':i===79?'no':'yes',exit_form:i%2?'continuer':'voluntary'})}));
 const s=selectTierB(items);assert.equal(s.selected,5);assert.ok(s.ids.includes('000'));assert.ok(!s.ids.includes('079'));assert.deepEqual(s,selectTierB([...items].reverse()));
});
test('Privacy gates run before any provider call; key/cap disabled fails closed',()=>withStore(async store=>{
 let n=0;await assert.rejects(classify(store,input,'a',{env:{},fetcher:()=>{n++;}}),/AI disabled/);assert.equal(n,0);assert.equal(store.spend().calls,0);
}));
test('Atomic ledger prevents overspend, retains uncertain charges and counts attempts',()=>withStore(store=>{
 store.reserve(.4,1,10);store.reserve(.4,1,10);assert.throws(()=>store.reserve(.3,1,10));assert.ok(Math.abs(store.spend().committed_usd-.8)<1e-9);assert.equal(store.spend().unreconciled,2);
}));
test('Unsupported spans and invented missingness values are rejected; persisted output has no source spans',()=>{
 const bad=example();bad.material.platform={state:'supported',value:'Groww',start:null,end:null};assert.throws(()=>validateEvidence(bad,input.text,'Reddit'));
 assert.equal(persistable({start:0,end:3,value:'a derived label'}).start,undefined);assert.throws(()=>classificationSchema.parse({...example(),metric_node:'month_99'}));
});
test('Real provider path is tested using an explicit fake response; never calls network',()=>withStore(async store=>{
 const env={GROQ_API_KEY:'unit-test-placeholder',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_SPEND_CAP_USD:'0',MODEL_BILLING_MODE:'free',GROQ_FREE_PLAN_CONFIRMED:'true',REDDIT_RESEARCH_USE_APPROVED:'true'};
 const x=await classify(store,input,'a',{env,fetcher:async()=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(example())}}],usage:{prompt_tokens:500,completion_tokens:100}}),{status:200})});assert.equal(x.run.proposal,true);assert.equal(store.spend().calls,1);assert.equal(store.spend().unreconciled,0);
}));
test('K=C+W+A; invented values and explicit-field recall have fixed scored denominators',()=>{
 const g=['a','b','c'].map(id=>({id,material:{platform:{state:'supported',value:'Groww'},trigger:unknownDatum()}}));
 const p=[{id:'a',material:{platform:{state:'supported',value:'Groww'},trigger:{state:'supported',value:'market crash'}}},{id:'b',material:{platform:{state:'supported',value:'Coin'},trigger:unknownDatum()}},{id:'c',material:{platform:unknownDatum(),trigger:unknownDatum()}}];
 const r=evaluate(g,p);assert.equal(r.K,3);assert.equal(r.C,1);assert.equal(r.W,1);assert.equal(r.A,1);assert.equal(r.K,r.C+r.W+r.A);assert.equal(r.invented_values,1);assert.equal(r.explicit_field_recall,1/3);
 const unrun=evaluate(g,[]);assert.equal(unrun.status,'unrun');assert.equal(unrun.explicit_field_recall,null);assert.equal(unrun.A,0);assert.equal(unrun.unrun_items,3);
});
test('Production has no research write/admin routes, and tester closes without configured limits',async()=>{
 for(const path of ['import','review','batch','snapshot','export','select-b','links','correct-tags','correct-field','terms-review','kill']){const r=await publicWorker.fetch(new Request('https://example.com/api/'+path,{method:'POST'}),{});assert.equal(r.status,404);}
 const r=await publicWorker.fetch(new Request('https://example.com/api/classify',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:'{}'}),{});assert.equal(r.status,503);
});
test('Spreadsheet-formula cells are neutralised on deck CSV export',()=>{assert.ok(csv(['hypothesis'],[{hypothesis:'=HYPERLINK("x")'}]).includes("'=HYPERLINK"));});
