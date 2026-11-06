import { parse } from 'csv-parse/sync';
import { privateSignals,safeUrl } from './contracts.mjs';
import { parseCorpus,corpusCsv } from './intake.mjs';
import { INPUT_COLUMNS,SIP_TERMS } from './collection.mjs';

const AMOUNT=/(?:\b(?:Rs\.?|INR)\s*|₹\s*)[\d,]+(?:\.\d+)?/gi;
const TICKET=/\b((?:ticket|case|complaint|reference)\s*(?:number|no\.?|id)?\s*(?:is|:|#)?\s*)\d{5,20}\b/gi;

export function normalizeApifyPlay(content,{appId='com.nextbillion.groww'}={}){
 const input=parse(content,{columns:true,bom:true,skip_empty_lines:true});
 const required=['type','appId','reviewId','reviewUrl','date','text'];
 if(!input.length||required.some(key=>!(key in input[0])))throw Error('Expected Apify review export fields are missing');
 const counts={dataset_rows:input.length,non_review_rows:0,wrong_app:0,invalid_or_private:0,non_topic:0,duplicate_ids:0,valid_topic_reviews:0,amounts_redacted:0};
 const rows=[],seen=new Set();
 for(const r of input){
  if(r.type!=='review'){counts.non_review_rows++;continue;}
  if(r.appId!==appId){counts.wrong_app++;continue;}
  const url=safeUrl(r.reviewUrl),date=String(r.date||'').slice(0,10),id=String(r.reviewId||'').trim();
  let linked=false;try{const u=new URL(url);linked=u.hostname==='play.google.com'&&u.pathname==='/store/apps/details'&&u.searchParams.get('id')===appId&&u.searchParams.get('reviewId')===id&&/^[a-f0-9-]{36}$/i.test(id);}catch{}
  const cleaned=String(r.text||'').replace(TICKET,'$1[reference redacted]');
  if(!linked||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!cleaned.trim()||privateSignals(cleaned).length){counts.invalid_or_private++;continue;}
  if(!SIP_TERMS.test(cleaned)){counts.non_topic++;continue;}
  if(seen.has(id)){counts.duplicate_ids++;continue;}seen.add(id);
  const cleanText=cleaned.replace(AMOUNT,'[amount redacted]');
  if(cleanText!==r.text)counts.amounts_redacted++;
  const row={source_family:'Play Store',url,date,text:cleanText,platform_stated:'Groww',source_locator:id,evidence_lane:'user_voice'};
  try{parseCorpus(corpusCsv(INPUT_COLUMNS,[row]));}catch{counts.invalid_or_private++;continue;}
  rows.push(row);
 }
 counts.valid_topic_reviews=rows.length;
 if(counts.dataset_rows!==counts.non_review_rows+counts.wrong_app+counts.invalid_or_private+counts.non_topic+counts.duplicate_ids+counts.valid_topic_reviews)throw Error('Apify row accounting did not reconcile');
 return {rows,counts};
}
