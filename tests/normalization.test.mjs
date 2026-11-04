import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalUrl,sourceUnitKey,sourceRootKey,fingerprint,normalizeForFingerprint,normalizeSourceFamily,duplicateAudit } from '../engine/normalization.mjs';
import { parseCorpus } from '../engine/intake.mjs';
import { csv } from '../engine/analysis.mjs';
const row={url:'https://www.reddit.com/r/mutualfunds/comments/abc123/title/',text:'I did not cancel my SIP.'};
test('Tracking/slug/host variants do not turn the same Reddit input into extra records',()=>{
 const variant={url:'https://old.reddit.com/r/mutualfunds/comments/abc123/different-title/?utm_source=share',text:' I did not\n cancel my SIP. '};
 assert.equal(fingerprint(row),fingerprint(variant));assert.equal(sourceUnitKey(row),sourceUnitKey({url:'https://redd.it/abc123'}));
});
test('Different replies and explicit locators remain separate despite identical words',()=>{
 assert.notEqual(fingerprint({...row,url:row.url+'reply1/'}),fingerprint({...row,url:row.url+'reply2/'}));
 assert.notEqual(fingerprint({...row,source_locator:'review-1'}),fingerprint({...row,source_locator:'review-2'}));
});
test('Negation, hypotheticals, emoji and Hinglish are not removed or rewritten',()=>{
 assert.notEqual(fingerprint(row),fingerprint({...row,text:'I did cancel my SIP.'}));
 assert.notEqual(fingerprint({...row,text:'I may pause.'}),fingerprint({...row,text:'I paused.'}));
 assert.equal(normalizeForFingerprint('  paisa nahi hai 😟\n '),'paisa nahi hai 😟');
});
test('Review identifiers and YouTube reply locators survive URL normalisation',()=>{
 assert.match(canonicalUrl('https://play.google.com/store/apps/details?id=app&reviewId=first&utm_source=x'),/reviewId=first/);
 assert.match(canonicalUrl('https://www.youtube.com/watch?v=video&lc=reply&utm_medium=x'),/lc=reply/);
});
test('Long identical text across different sources is a review candidate, never auto-deleted',()=>{
 const text=('This is a deliberately synthetic duplicate detection fixture with no investor evidence and no personal data. ').repeat(3);
 const audit=duplicateAudit([{id:'A',url:'https://example.com/a',text},{id:'B',url:'https://example.org/b',text}]);
 assert.equal(audit.canonical_input_groups,2);assert.equal(audit.cross_source_copy_candidates.length,1);assert.equal(audit.repeated_inputs.length,0);
});
test('Family aliases normalise; invalid dates are rejected instead of inventing precision',()=>{
 assert.equal(normalizeSourceFamily('  google play '),'Play Store');assert.equal(normalizeSourceFamily('unknown platform'),null);
 assert.throws(()=>parseCorpus(csv(['source_family','url','date','text'],[{source_family:'Reddit',url:row.url,date:'2026-02-30',text:row.text}])));
});

test('Forum title changes do not create new inputs; replies share a root but not a source unit',()=>{
 const a={id:'a',source_family:'Investing forums',url:'https://example.org/t/old-title/123',text:'Synthetic fixture only.'};
 const variant={...a,id:'v',url:'https://example.org/t/new-title/123/1?utm_source=share'};
 const reply={...a,id:'r',url:'https://example.org/t/new-title/123/20'};
 assert.equal(fingerprint(a),fingerprint(variant));assert.notEqual(fingerprint(a),fingerprint(reply));
 assert.equal(sourceRootKey(a),sourceRootKey(reply));
 const audit=duplicateAudit([a,variant,reply]);assert.equal(audit.input_rows,3);assert.equal(audit.canonical_input_groups,2);assert.equal(audit.distinct_source_roots,1);
});

test('Forum page and post URL variants identify the same post when the locator agrees',()=>{
 const page={source_family:'Investing forums',url:'https://tradingqna.com/t/sample/123?page=2',source_locator:'post-27',text:'Synthetic SIP fixture.'};
 const permalink={...page,url:'https://tradingqna.com/t/renamed/123/27',source_locator:''};
 assert.equal(sourceUnitKey(page),sourceUnitKey(permalink));
 assert.equal(fingerprint(page),fingerprint(permalink));
 assert.equal(sourceRootKey(page),sourceRootKey(permalink));
 assert.throws(()=>sourceUnitKey({...permalink,source_locator:'post-28'}),/disagree/);
});
