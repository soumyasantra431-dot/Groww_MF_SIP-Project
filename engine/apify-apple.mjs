import { parse } from 'csv-parse/sync';
import { privateSignals,safeUrl,isAppleReviewLocator } from './contracts.mjs';
import { parseCorpus,corpusCsv } from './intake.mjs';
import { INPUT_COLUMNS,SIP_TERMS } from './collection.mjs';

const AMOUNT=/(?:\b(?:Rs\.?|INR)\s*|₹\s*)[\d,]+(?:\.\d+)?/gi;

export function normalizeApifyApple(content,{appId='1404871703'}={}){
 const input=parse(content,{columns:true,bom:true,skip_empty_lines:true});
 const required=['type','appId','reviewId','url','date','text'];
 if(!input.length||required.some(key=>!(key in input[0])))throw Error('Expected App Store review export fields are missing');
 const counts={dataset_rows:input.length,non_review_rows:0,wrong_app:0,invalid_or_private:0,non_topic:0,duplicate_ids:0,valid_topic_reviews:0,amounts_redacted:0};
 const rows=[],seen=new Set();
 for(const r of input){
  if(r.type!=='review'){counts.non_review_rows++;continue;}
  if(r.appId!==appId||r.country!=='in'){counts.wrong_app++;continue;}
  const id=String(r.reviewId||'').trim(),url=safeUrl(r.url),date=String(r.date||'').slice(0,10);
  let linked=false;try{const u=new URL(url);linked=isAppleReviewLocator(url,id)&&u.pathname.endsWith('/id'+appId);}catch{}
  if(!linked||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!r.text?.trim()||privateSignals(r.text).length){counts.invalid_or_private++;continue;}
  if(!SIP_TERMS.test(r.text)){counts.non_topic++;continue;}
  if(seen.has(id)){counts.duplicate_ids++;continue;}seen.add(id);
  const cleanText=r.text.replace(AMOUNT,'[amount redacted]');if(cleanText!==r.text)counts.amounts_redacted++;
  const row={source_family:'App Store',url,date,text:cleanText,platform_stated:'Groww',source_locator:id,evidence_lane:'user_voice'};
  try{parseCorpus(corpusCsv(INPUT_COLUMNS,[row]));}catch{counts.invalid_or_private++;continue;}
  rows.push(row);
 }
 counts.valid_topic_reviews=rows.length;
 if(counts.dataset_rows!==counts.non_review_rows+counts.wrong_app+counts.invalid_or_private+counts.non_topic+counts.duplicate_ids+counts.valid_topic_reviews)throw Error('App Store row accounting did not reconcile');
 return {rows,counts};
}
