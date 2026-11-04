// These are labelled engineering fixtures, not investor evidence or model outputs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {FACTORS,PROTECTIVE_FACTORS,MATERIAL_FIELDS,BUNDLES,unknownDatum,validateEvidence,episodeSchema} from '../engine/contracts.mjs';
import {corpusReadiness,driverEvidence,sourceRootKey} from '../engine/scope.mjs';
import {filterStoreExport,collectYouTube,permissionFor} from '../engine/collection.mjs';
import {rollup,csv,selectTierB,deckExports} from '../engine/analysis.mjs';
import {openStore} from '../engine/store.mjs';
import publicWorker from '../worker/index.mjs';
import {classify} from '../engine/provider.mjs';
import {parseCorpus,corpusCsv} from '../engine/intake.mjs';
import {snapshot} from '../scripts/pipeline.mjs';
const d=(value='a reported event')=>({state:'supported',value,missing_reason:null,start:0,end:12});
const fact=(state='unknown',value=null)=>({state,value,start:null,end:null});
const code=(extra={})=>({evidence_class:'public_user_account',relevant:'yes',metric_node:'unknown',exit_form:'unknown',reason_families:['unknown'],journey_bucket:'unknown',initiating_event:'Unknown',final_state:'Unknown',paraphrase:'A test fixture.',scope_lane:'eligibility_unknown',plan_route:'unknown',question_ids:['Q4'],eligibility:{first_time_mf:unknownDatum(),first_sip_on_groww:unknownDatum(),within_first_12_months:unknownDatum()},narrative:{trigger:d(),action:d()},material:Object.fromEntries(MATERIAL_FIELDS.map(k=>[k,unknownDatum()])),...extra});
const record=(i,extra={})=>({id:'fixture-'+i,origin:'corpus',source_family:'Reddit',url:`https://www.reddit.com/r/test/comments/t${i}/example/`,evidence_lane:'user_voice',terms_status:'cleared',tier_a:code(),...extra});
const episode=()=>({classification:code(),bundles:Object.fromEntries(BUNDLES.map(b=>[b,[]])),factors:Object.fromEntries(FACTORS.map(f=>[f,fact()])),protective_factors:Object.fromEntries(PROTECTIVE_FACTORS.map(f=>[f,fact()])),situation:unknownDatum(),driver_hypotheses:[]});
const permission={decision:'approved',basis:'Engineering fixture permission only; not permission for a real source',terms_url:'https://example.org/terms',checked_on:'2026-10-31',collection_allowed:true,model_processing_allowed:true};

test('Factor schema requires every named factor and protective cue; unknown has no invented value',()=>{
 const e=episode();episodeSchema.parse(e);delete e.factors.income_pattern;assert.throws(()=>episodeSchema.parse(e));
 const bad={...episode(),...code()};bad.factors.buffer_cue=fact('unknown','pretend savings');assert.throws(()=>validateEvidence(bad,'some example source text','Reddit'),/null value/);
});
test('A stated factor needs source offsets and cannot retain a personal financial amount',()=>{
 const e={...episode(),...code()};e.factors.buffer_cue=fact('stated','has a buffer');assert.throws(()=>validateEvidence(e,'some example source text','Reddit'),/offsets/);
 e.factors.buffer_cue={state:'stated',value:'Rs 45000 in savings',start:0,end:12};assert.throws(()=>validateEvidence(e,'some example source text','Reddit'),/financial amount/);
});
test('Target lane cannot be guessed from platform or sentiment; all three eligibility facts required',()=>{
 const c=code({scope_lane:'target'});assert.throws(()=>validateEvidence(c,'some example source text','Reddit'),/eligibility/);
 for(const k of Object.keys(c.eligibility))c.eligibility[k]=d('yes');validateEvidence(c,'some example source text','Reddit');
});
test('Context, controls, irrelevant and rejected inputs cannot pad question or matrix denominators',()=>{
 const rs=[record(1),record(2,{evidence_lane:'control'}),record(3,{tier_a:code({evidence_class:'company_reported',scope_lane:'context'})}),record(4,{tier_a:code({relevant:'no',scope_lane:'out_of_scope'})}),record(5,{review_state:'rejected'})];
 const r=rollup(rs);assert.equal(r.total,5);assert.equal(r.coded,5);assert.equal(r.user_voice_coded,1);assert.equal(r.questions[3].denominator,1);assert.equal(r.questions[3].target_count,0);assert.equal(r.cells.reduce((s,c)=>s+c.count,0),1);
});
test('Coverage reports actual source units and narrative roots without a hard research-quality floor',()=>{
 const rs=Array.from({length:100},(_,i)=>record(i,{source_family:i<80?'Reddit':i<90?'Play Store':'Investing forums',source_locator:i>=80?'review-'+i:'',url:i<80?`https://www.reddit.com/r/test/comments/t${i}/example/`:`https://example.org/topic/${i}`}));
 assert.equal(corpusReadiness(rs).distinct_user_voice_source_units,100);
 assert.equal(corpusReadiness(rs).source_families.length,3);
 assert.equal(corpusReadiness(rs).distinct_narrative_roots,100);
 assert.equal(corpusReadiness(rs.slice(0,99)).distinct_user_voice_source_units,99);
 assert.ok(corpusReadiness(rs.map(r=>({...r,url:'https://www.reddit.com/r/test/comments/same/example/',source_locator:''}))).distinct_narrative_roots<100);
 assert.equal(corpusReadiness(rs.map(r=>({...r,tier_a:code({narrative:{trigger:unknownDatum(),action:d()}})}))).distinct_narrative_roots,0);
 assert.ok(!('floor_met' in corpusReadiness(rs)));
 const unresolved=rs.map(r=>({...r,terms_status:'pending',local_use_status:'pending'}));
 assert.equal(corpusReadiness(unresolved).distinct_user_voice_source_units,0);
 assert.equal(corpusReadiness(unresolved).local_use_unresolved_records,100);
});
test('Tier B selects one independent root and does not turn thin reviews or context into narratives',()=>{
 const a=record(1),b=record(2,{url:a.url}),c=record(3,{tier_a:code({narrative:{trigger:unknownDatum(),action:unknownDatum()}})}),ctx=record(4,{evidence_lane:'context'});
 const selected=selectTierB([a,b,c,ctx]);assert.equal(selected.selected,1);assert.equal(selected.eligible,2);assert.ok(!selected.ids.includes(c.id));assert.ok(!selected.ids.includes(ctx.id));
});
test('Driver breadth counts distinct roots; cross-post copies cannot manufacture family support',()=>{
 const h={hypothesis:'A possible mechanism',evidence_class:'inference',basis_fields:['reported_reason'],rival:'A different cause',next_test:'Ask about the episode'};
 const one=record(1,{tier_b:{...episode(),driver_hypotheses:[h]}}),same=record(2,{url:one.url,tier_b:one.tier_b}),other=record(3,{source_family:'Investing forums',url:'https://tradingqna.com/t/test/123/4',tier_b:one.tier_b});
 assert.equal(driverEvidence([one,same])[0].evidence_strength_tag,'single-source');assert.equal(driverEvidence([one,other])[0].evidence_strength_tag,'multi-family');
 one.copy_key='copy-fixture';other.copy_key='copy-fixture';const merged=driverEvidence([one,other])[0];assert.equal(merged.distinct_sources,1);assert.equal(merged.evidence_strength_tag,'single-source');
 assert.equal(sourceRootKey(other),'tradingqna.com:topic:123');
});
test('A driver cannot cite an unstated factor as its basis',()=>{
 const e={...episode(),...code(),driver_hypotheses:[{hypothesis:'proposal',basis_fields:['buffer_cue'],rival:'rival',next_test:'test'}]};assert.throws(()=>validateEvidence(e,'some example source text','Reddit'),/no stated basis/);
});
test('Store export filter requires a review locator, preserves text and logs exclusions without author fields',()=>{
 const content=csv(['url','date','text','review_id','author'],[
 {url:'https://play.google.com/store/apps/details?id=com.example',date:'',text:'My SIP is still continuing.',review_id:'review-a',author:'discard-this-field'},
 {url:'https://play.google.com/store/apps/details?id=com.example',date:'',text:'SIP not deducted.',review_id:''},
 {url:'https://example.org/review/one',date:'',text:'Great app for shares',review_id:'review-b'},
 {url:'https://example.org/review/two',date:'',text:'SIP PAN ABCDE1234F',review_id:'review-c'}]);
 const r=filterStoreExport(content);assert.equal(r.counts.kept,1);assert.equal(r.counts.missing_locator,1);assert.equal(r.counts.non_sip,1);assert.equal(r.counts.private_or_invalid,1);assert.equal(r.rows[0].text,'My SIP is still continuing.');assert.ok(!JSON.stringify(r).includes('discard-this-field'));
});
test('YouTube collector refuses unapproved use before network; approved fixture selects only top-level text',async()=>{
 let calls=0;await assert.rejects(collectYouTube({videoId:'abcdefghijk',key:'fixture',permission:{},fetcher:()=>{calls++;}}));assert.equal(calls,0);
 const result=await collectYouTube({videoId:'abcdefghijk',key:'fixture',permission,fetcher:async url=>{calls++;assert.equal(url.hostname,'www.googleapis.com');assert.ok(!url.searchParams.get('fields').includes('author'));return new Response(JSON.stringify({items:[{snippet:{topLevelComment:{id:'comment-x',snippet:{textOriginal:'SIP helped me plan.',publishedAt:'2026-10-01T00:00:00Z',authorDisplayName:'must not persist'}}}}]}));}});
 assert.equal(calls,1);assert.equal(result.counts.kept,1);assert.ok(!JSON.stringify(result).includes('must not persist'));assert.ok(result.rows[0].url.includes('lc=comment-x'));assert.throws(()=>permissionFor({store_export:{...permission,model_processing_allowed:false}},'store_export'));
});
test('Daily budget uses committed reservations atomically and resets on UTC calendar boundaries',()=>{
 const prefix=join(tmpdir(),'sip-depth-'),dir=mkdtempSync(prefix),store=openStore(dir);
 try{const id=store.reserve(.8,10,20,{dailyCap:1});assert.throws(()=>store.reserve(.3,10,20,{dailyCap:1}),/daily cap/);store.db.prepare('UPDATE spend SET created_at=? WHERE id=?').run('2026-01-01T00:00:00.000Z',id);store.reserve(.3,10,20,{dailyCap:1});assert.ok(store.spend().committed_usd>1);assert.throws(()=>store.reserve(NaN,10,20));}finally{store.close();assert.ok(dir.startsWith(prefix));rmSync(dir,{recursive:true,force:true});}
});
test('Production rejects paid configuration before any provider request',async()=>{
 const prefix=join(tmpdir(),'sip-public-depth-'),dir=mkdtempSync(prefix),store=openStore(dir);
 const LIMITS={prepare(sql){const stmt=store.db.prepare(sql);return {bind(...args){return {async run(){return stmt.run(...args);},async first(){return stmt.get(...args);}};},async first(){return stmt.get();}};}};
 try{
  const env={LIMITS,GROQ_API_KEY:'fixture-only',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_SPEND_CAP_USD:'10',MODEL_INPUT_USD_PER_MILLION:'.15',MODEL_OUTPUT_USD_PER_MILLION:'.6',PUBLIC_DAILY_CAP_USD:'0.000001'};
  const response=await publicWorker.fetch(new Request('https://example.org/api/classify',{method:'POST',headers:{Origin:'https://example.org','Content-Type':'application/json'},body:JSON.stringify({text:'A synthetic SIP engineering fixture.',source_family:'Investing forums'})}),env);
  assert.equal(response.status,503);assert.equal(store.spend().calls,0);assert.equal(store.spend().committed_usd,0);
 }finally{store.close();assert.ok(dir.startsWith(prefix));rmSync(dir,{recursive:true,force:true});}
});
test('Paid activation and private columns fail before network or persistence',async()=>{
 let calls=0;await assert.rejects(classify({},{text:'SIP engineering fixture.',source_family:'Other'},'a',{env:{GROQ_API_KEY:'fixture',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_SPEND_CAP_USD:'10',MODEL_INPUT_USD_PER_MILLION:'.15',MODEL_OUTPUT_USD_PER_MILLION:'.6',RESEARCH_SPEND_ALLOCATION_USD:'10',PUBLIC_SPEND_ALLOCATION_USD:'2'},fetcher:()=>{calls++;}}),/Free-only/);assert.equal(calls,0);
 assert.throws(()=>parseCorpus(csv(['source_family','url','date','text','author'],[{source_family:'Reddit',url:'https://example.org/post',date:'',text:'SIP fixture',author:'discard'}])),/unsupported CSV columns/);
});
test('Published snapshots exclude controls, raw data and exact-text fingerprint hashes',()=>{
 const prefix=join(tmpdir(),'sip-snapshot-depth-'),dir=mkdtempSync(prefix),store=openStore(dir);
 try{
  for(const [id,lane]of [['a','user_voice'],['b','control']]){store.insert({id,source_family:'Reddit',url:'https://example.org/'+id,evidence_lane:lane,copy_key:'private-fingerprint-fixture'});store.setResult(id,'a',code());store.db.prepare("UPDATE items SET review_state='accepted',terms_status='cleared' WHERE id=?").run(id);}
  const result=snapshot(store);assert.equal(result.items.length,1);assert.ok(!JSON.stringify(result).includes('private-fingerprint-fixture'));assert.ok(!JSON.stringify(result).includes('raw_file'));
 }finally{store.close();assert.ok(dir.startsWith(prefix));rmSync(dir,{recursive:true,force:true});}
});
test('Machine-input CSV preserves leading punctuation while deck exports neutralise spreadsheet formulas',()=>{
 for(const text of ['- My SIP is still continuing.','+ Restarted my SIP.','= XIRR confused me.','SIP hai, abhi continue kar raha hoon.']){
  const input={source_family:'Reddit',url:'https://example.org/post',date:'',text};assert.equal(parseCorpus(corpusCsv(['source_family','url','date','text'],[input]))[0].text,text);
 }
 assert.ok(csv(['value'],[{value:'=1+1'}]).includes("'=1+1"));
});
test('Known source restrictions remain closed with an enabled Free model',async()=>{
 for(const family of ['Reddit','YouTube']){
  let calls=0;await assert.rejects(classify({},{text:'Synthetic SIP fixture.',source_family:family},'a',{env:{GROQ_API_KEY:'fixture-only',ALLOW_MODEL_CALLS:'true',MODEL_KILL_SWITCH:'false',MODEL_SPEND_CAP_USD:'0',MODEL_BILLING_MODE:'free',GROQ_FREE_PLAN_CONFIRMED:'true'},fetcher:()=>{calls++;}}),/permission basis/);assert.equal(calls,0);
 }
});
test('Decision exports count topic roots and keep context out; store URL/locator variants match',()=>{
 const a=record(1,{tier_a:code({reason_families:['execution']})}),b=record(2,{url:a.url,tier_a:a.tier_a}),ctx=record(3,{evidence_lane:'context',tier_a:a.tier_a});
 for(const r of [a,b]){r.review_state='accepted';r.terms_status='cleared';r.hypothesis='execution';}const exported=deckExports([a,b,ctx]);assert.match(exported.triangulation,/"execution","1","1"/);assert.match(exported.triangulation,/"record_count"/);assert.ok(!exported.triangulation.includes(ctx.id));
 assert.equal(sourceRootKey({...a,source_family:'Investing forums',url:'https://tradingqna.com/t/123/4'}),'tradingqna.com:topic:123');
 const r={source_family:'Play Store',url:'https://play.google.com/store/apps/details?id=app&reviewId=abc',source_locator:''};
 assert.equal(sourceRootKey(r),sourceRootKey({...r,url:'https://play.google.com/store/apps/details?id=app',source_locator:'abc'}));
});
