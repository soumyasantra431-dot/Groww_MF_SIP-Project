import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApifyPlay } from '../engine/apify-play.mjs';
import { corpusCsv } from '../engine/intake.mjs';

const columns=['type','appId','reviewId','reviewUrl','date','text','userName'];
const id='12345678-1234-1234-1234-123456789abc';
const review={type:'review',appId:'com.nextbillion.groww',reviewId:id,reviewUrl:`https://play.google.com/store/apps/details?id=com.nextbillion.groww&reviewId=${id}`,date:'2026-10-15T10:00:00Z',text:'My SIP auto payment failed. I paid manually.',userName:'Never persist this name'};
test('Apify adapter counts metadata, false positives, duplicates and keeps no reviewer field',()=>{
 const input=corpusCsv(columns,[review,{...review},{...review,reviewId:'bad',reviewUrl:review.reviewUrl},{...review,type:'summary'},{...review,reviewId:'22345678-1234-1234-1234-123456789abc',reviewUrl:'https://play.google.com/store/apps/details?id=com.nextbillion.groww&reviewId=22345678-1234-1234-1234-123456789abc',text:'Stock trading only'}]);
 const out=normalizeApifyPlay(input);
 assert.deepEqual(out.counts,{dataset_rows:5,non_review_rows:1,wrong_app:0,invalid_or_private:1,non_topic:1,duplicate_ids:1,valid_topic_reviews:1,amounts_redacted:0});
 assert.equal(out.rows[0].text,review.text);
 assert.equal('userName' in out.rows[0],false);
});
test('Apify adapter rejects private identifiers and redacts exact amounts',()=>{
 const rows=[{...review,text:'My SIP failed; contact me at a@b.com'},{...review,reviewId:'32345678-1234-1234-1234-123456789abc',reviewUrl:'https://play.google.com/store/apps/details?id=com.nextbillion.groww&reviewId=32345678-1234-1234-1234-123456789abc',text:'My SIP is ₹5,000 monthly.'}];
 const out=normalizeApifyPlay(corpusCsv(columns,rows));
 assert.equal(out.counts.invalid_or_private,1);
 assert.equal(out.counts.amounts_redacted,1);
 assert.equal(out.rows[0].text,'My SIP is [amount redacted] monthly.');
});
