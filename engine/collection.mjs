import { parse } from 'csv-parse/sync';
import { createHash } from 'node:crypto';
import { privateSignals,safeUrl } from './contracts.mjs';
import { parseCorpus,corpusCsv } from './intake.mjs';
import { fingerprint,normalizeSourceFamily } from './normalization.mjs';

export const INPUT_COLUMNS=['source_family','url','date','text','platform_stated','source_locator','evidence_lane'];
export const SIP_TERMS=/\bSIPs?\b|systematic investment|auto[ -]?pay|auto[ -]?debit|mandate|XIRR|instal+ment|installment|mutual fund|\bMF\b/i;
export function permissionFor(register,route){
 const r=register?.[route];
 if(r?.decision!=='approved'||!r.basis?.trim()||!safeUrl(r.terms_url||'')||!/^\d{4}-\d{2}-\d{2}$/.test(r.checked_on||'')||r.collection_allowed!==true||r.model_processing_allowed!==true)throw Error('Record the Fellow’s source-specific collection and model-use permission basis before running this optional route');
 if(privateSignals(r.basis).length)throw Error('Permission basis must not include identifiers');
 return r;
}
export function filterStoreExport(content,{family='Play Store'}={}){
 family=normalizeSourceFamily(family);if(!['Play Store','App Store'].includes(family))throw Error('Choose Play Store or App Store');
 const input=parse(content,{columns:true,bom:true,skip_empty_lines:true});if(input.length>10000)throw Error('Export exceeds 10,000 local rows');
 const rows=[],seen=new Set(),counts={input:input.length,non_sip:0,private_or_invalid:0,missing_locator:0,duplicates:0,kept:0};
 for(const r of input){
  if(!['url','date','text'].every(k=>k in r))throw Error('Map the lawful export to url,date,text and source_locator or review_id first; no review author columns are used');
  if(!SIP_TERMS.test(r.text)){counts.non_sip++;continue;}
  const locator=(r.source_locator||r.review_id||'').trim();
  let identifiable=false;try{const u=new URL(r.url);identifiable=['reviewId','reviewid'].some(k=>u.searchParams.has(k))||/\/review\//.test(u.pathname);}catch{}
  if(!locator&&!identifiable){counts.missing_locator++;continue;}
  const row={source_family:family,url:r.url,date:r.date||'',text:r.text,platform_stated:'',source_locator:locator,evidence_lane:'user_voice'};
  try{parseCorpus(corpusCsv(INPUT_COLUMNS,[row]));}catch{counts.private_or_invalid++;continue;}
  const key=fingerprint(row);if(seen.has(key)){counts.duplicates++;continue;}seen.add(key);rows.push(row);
 }
 counts.kept=rows.length;return {rows,counts,query:SIP_TERMS.source};
}
export async function collectYouTube({videoId,query='SIP',maxPages=1,key,permission,fetcher=fetch,onPage=()=>{}}){
 permissionFor({youtube:permission},'youtube');
 if(!/^[A-Za-z0-9_-]{11}$/.test(videoId)||!query.trim()||query.length>160||privateSignals(query).length||!Number.isInteger(maxPages)||maxPages<1||maxPages>3)throw Error('Use one public video ID, a non-identifying query and 1–3 pages');
 if(!key)throw Error('YOUTUBE_API_KEY is required; Groq credentials cannot access YouTube');
 const rows=[],seen=new Set(),counts={pages:0,received:0,kept:0,non_sip:0,private_or_invalid:0,duplicates:0};let token;
 for(let page=0;page<maxPages;page++){
  const url=new URL('https://www.googleapis.com/youtube/v3/commentThreads');
  const params={part:'snippet',videoId,maxResults:'100',searchTerms:query,order:'time',textFormat:'plainText',fields:'nextPageToken,items(snippet(topLevelComment(id,snippet(textOriginal,publishedAt))))',...(token?{pageToken:token}:{}),key};
  for(const [k,v]of Object.entries(params))url.searchParams.set(k,v);
  // Never log the request URL (contains key), response body or original comments.
  let response;try{response=await fetcher(url,{signal:AbortSignal.timeout(30000)});}catch{throw Error('YouTube request failed; no URL, credential or response text logged');}
  if(!response.ok)throw Error(`YouTube request failed (${response.status}); no retries or scraping fallback`);
  const data=await response.json();counts.pages++;
  for(const item of data.items||[]){counts.received++;const c=item.snippet?.topLevelComment;
   if(!c?.id||!/^[A-Za-z0-9_-]{1,160}$/.test(c.id)||!c.snippet?.textOriginal){counts.private_or_invalid++;continue;}
   if(!SIP_TERMS.test(c.snippet.textOriginal)){counts.non_sip++;continue;}
   const row={source_family:'YouTube',url:`https://www.youtube.com/watch?v=${videoId}&lc=${c.id}`,date:(c.snippet.publishedAt||'').slice(0,10),text:c.snippet.textOriginal,source_locator:c.id,platform_stated:'',evidence_lane:'user_voice'};
   try{parseCorpus(corpusCsv(INPUT_COLUMNS,[row]));}catch{counts.private_or_invalid++;continue;}
   const f=fingerprint(row);if(seen.has(f)){counts.duplicates++;continue;}seen.add(f);rows.push(row);
  }
  onPage({...counts});token=data.nextPageToken;if(!token)break;
 }
 counts.kept=rows.length;
 return {rows,counts,query,scope:'Filtered top-level comments only, time order, explicit page cap; no replies, author metadata, likes or completeness claim. Never a representative sample.',delete_or_refresh_by:new Date(Date.now()+29*86400000).toISOString().slice(0,10),run_key:createHash('sha256').update(videoId+'|'+query).digest('hex').slice(0,16)};
}
