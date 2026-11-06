import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApifyApple } from '../engine/apify-apple.mjs';
import { corpusCsv } from '../engine/intake.mjs';
import {safeUrl} from '../engine/contracts.mjs';

const id='14740472073',url=`https://apps.apple.com/in/app/id1404871703?see-all=reviews#${id}`;
const columns=['type','appId','country','reviewId','url','date','text','userName'];
const review={type:'review',appId:'1404871703',country:'in',reviewId:id,url,date:'2026-11-02T04:59:03.000Z',text:'Skip SIP takes me to login.',userName:'Do not persist'};
test('Apple review locator exception is limited to a public review URL',()=>{
 assert.equal(safeUrl(url),url);
 assert.equal(safeUrl('https://example.com/account/14740472073'),null);
 assert.equal(safeUrl('https://apps.apple.com/in/app/id1404871703?see-all=reviews#14740472073?x=1'),null);
});
test('Apple adapter reconciles rows and omits reviewer name',()=>{
 const rows=[review,{...review},{...review,reviewId:'14734412063',url:'https://apps.apple.com/in/app/id1404871703?see-all=reviews#14734412063',text:'Stock XIRR missing'},{...review,type:'app'},{...review,reviewId:'14728323756',url:'https://apps.apple.com/in/app/id1404871703?see-all=reviews#14728323756',text:'Only stock orders'}];
 const out=normalizeApifyApple(corpusCsv(columns,rows));
 assert.deepEqual(out.counts,{dataset_rows:5,non_review_rows:1,wrong_app:0,invalid_or_private:0,non_topic:1,duplicate_ids:1,valid_topic_reviews:2,amounts_redacted:0});
 assert.equal('userName' in out.rows[0],false);
});
