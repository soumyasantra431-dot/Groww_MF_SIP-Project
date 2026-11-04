import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync,readdirSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { corpusCsv,importCorpus,parseCorpus } from '../engine/intake.mjs';
import { parseSourceScreen,sourceLedger } from '../engine/source-ledger.mjs';
import { openStore } from '../engine/store.mjs';

const columns=['source_family','url','date','source_locator','speaker_position','disposition','relevance_screen','target_fit','reason'];
const base={source_family:'Investing forums',url:'https://forum.example.org/t/synthetic/321',date:'2026-10-01',speaker_position:'reply_author_identity_unverified',reason:'Synthetic fixture; no investor inference'};
const screen=(locator,overrides={})=>({...base,source_locator:locator,disposition:'admitted_local_unreviewed',relevance_screen:'mf_sip_candidate_unreviewed',target_fit:'adjacent_platform',...overrides});
const item=(id,locator,overrides={})=>({id,source_family:'Investing forums',url:base.url,date:base.date,source_locator:locator,local_use_status:'cleared',evidence_lane:'user_voice',review_state:'unreviewed',terms_status:'flagged',...overrides});

test('Source ledger reconciles selected, excluded and historical inventory without calling posts people',()=>{
 const screens=parseSourceScreen(corpusCsv(columns,[screen('post-1'),screen('post-9'),screen('post-5',{disposition:'excluded',relevance_screen:'not_assessed',target_fit:'not_assessed'})]));
 const items=[item('a','post-1'),item('b','post-9'),{...item('control','control-1',{source_family:'Other',url:'https://example.org/control',evidence_lane:'control',local_use_status:'pending'})}];
 const runs=[{route:'bounded_manual_original_page_intake_no_crawler',counts:JSON.stringify({seen:3,selected:2,excluded:1,imported:2,duplicates:0})}];
 const result=sourceLedger(items,screens,runs);
 assert.deepEqual([result.counts.tracked_decisions,result.counts.admitted,result.counts.pending,result.counts.rejected],[4,2,1,1]);
 assert.deepEqual([result.counts.distinct_admitted_source_items,result.counts.distinct_admitted_source_roots],[2,1]);
 assert.equal(result.counts.screened_relevance_candidates,2);
 assert.equal(result.counts.stored_evidence_lanes.control,1);
 assert.equal(result.entries.filter(e=>e.status==='rejected'&&e.item_id===null).length,1);
});

test('Stock SIP and mixed-instrument screens do not become MF-SIP or direct-target counts',()=>{
 const screens=parseSourceScreen(corpusCsv(columns,[screen('post-1',{relevance_screen:'not_mf_sip',target_fit:'not_assessed'}),screen('post-2',{relevance_screen:'mixed_instrument_review',target_fit:'unknown'})]));
 const result=sourceLedger([item('stock','post-1'),item('mixed','post-2')],screens);
 assert.equal(result.counts.admitted,2);
 assert.equal(result.counts.screened_relevance_candidates,0);
 assert.deepEqual(result.counts.screened_fit,{direct:0,adjacent:0,unknown:0});
 assert.equal(result.counts.accepted_findings,0);
});

test('Possible cross-site copy is flagged while both source items and links remain visible',()=>{
 const items=[item('a','post-1',{copy_key:'same-long-copy'}),{...item('b','reply-2',{source_family:'Other',url:'https://example.org/other',copy_key:'same-long-copy'})}];
 const result=sourceLedger(items,[]);
 assert.equal(result.counts.copy_review_groups,1);
 assert.equal(result.counts.distinct_admitted_source_items,2);
 assert.equal(result.entries.filter(e=>e.copy_review_pending).length,2);
 assert.equal(result.copy_candidates[0].item_ids.length,2);
});

test('Older excerpts sharing one locator remain pending instead of counting as distinct source units',()=>{
 const items=[item('old-a','post-7'),item('old-b','post-7')];
 const result=sourceLedger(items,[]);
 assert.deepEqual([result.counts.tracked_decisions,result.counts.pending,result.counts.admitted],[2,2,0]);
 assert.deepEqual([result.counts.source_unit_conflict_groups,result.counts.source_unit_conflict_rows],[1,2]);
 assert.ok(result.entries.every(e=>e.source_unit_conflict));
});

test('Malformed source dates, duplicate post locators and private metadata fail closed',()=>{
 assert.throws(()=>parseSourceScreen(corpusCsv(columns,[screen('post-1',{date:'2026-02-30'})])));
 assert.throws(()=>parseSourceScreen(corpusCsv(columns,[screen('post-1'),screen('post-1')])));
 assert.throws(()=>parseSourceScreen(corpusCsv(columns,[screen('post-1',{reason:'Contact test@example.org'})])));
 assert.throws(()=>parseCorpus(corpusCsv(['source_family','url','date','text'],[{source_family:'Investing forums',url:base.url,date:'2026-13-01',text:'SIP fixture'}])));
});

test('A changed excerpt for the same post locator cannot silently create a second item',()=>{
 const dir=mkdtempSync(join(tmpdir(),'sip-phase2-'));const store=openStore(dir);
 try{
  const cols=['source_family','url','date','text','source_locator'];
  const first={source_family:'Investing forums',url:base.url,date:base.date,text:'Synthetic mutual fund SIP account A.',source_locator:'post-1'};
  assert.equal(importCorpus(store,corpusCsv(cols,[first])).inserted,1);
  const before=readdirSync(join(dir,'raw')).length;
  assert.throws(()=>importCorpus(store,corpusCsv(cols,[{...first,text:'Synthetic mutual fund SIP account B.'}])),/source locator has different text/);
  assert.equal(readdirSync(join(dir,'raw')).length,before);
  assert.equal(store.items().length,1);
 }finally{store.close();rmSync(dir,{recursive:true,force:true});}
});
