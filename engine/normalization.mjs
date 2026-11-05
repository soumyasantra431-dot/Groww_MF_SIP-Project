import { createHash } from 'node:crypto';

const sha=value=>createHash('sha256').update(value).digest('hex');
export function normalizeSourceFamily(value){
 const key=String(value||'').trim().toLowerCase().replace(/\s+/g,' ');
 return ({'app store':'App Store','apple app store':'App Store','play store':'Play Store','google play':'Play Store','reddit':'Reddit','investing forums':'Investing forums','tradingq&a':'Investing forums','tradingqna':'Investing forums','social':'Social','youtube':'YouTube','other':'Other'})[key]||null;
}
// Shadow text is for fingerprints only. Never replace the original model/gold input.
export const normalizeForFingerprint=text=>String(text).normalize('NFC').replace(/\s+/gu,' ').trim();
export function canonicalUrl(value){
 const u=new URL(value.trim());
 for(const key of [...u.searchParams.keys()])if(/^utm_/i.test(key)||['gclid','fbclid','msclkid'].includes(key.toLowerCase()))u.searchParams.delete(key);
 u.searchParams.sort();
 if(u.hash.includes(':~:text='))u.hash=u.hash.split(':~:text=')[0];
 if(!u.hash||u.hash==='#')u.hash='';
 if(u.hostname==='reddit.com'||u.hostname.endsWith('.reddit.com'))u.hostname='www.reddit.com';
 return u.href;
}
// An item's forum URL may be a topic URL while its locator identifies a later
// post. Return an inspectable link without changing the stored source identity.
export function sourceReviewUrl(row){
 const u=new URL(canonicalUrl(row.url));
 const locatorPost=/^post-(\d+)$/.exec(String(row.source_locator||'').trim())?.[1];
 if(row.source_family!=='Investing forums'||!locatorPost)return u.href;
 const parts=u.pathname.split('/').filter(Boolean),t=parts.indexOf('t');
 const topicIndex=t>=0?parts.findIndex((part,i)=>i>t&&/^\d+$/.test(part)):-1;
 if(topicIndex<0)return u.href;
 const urlPost=/^\d+$/.test(parts[topicIndex+1]||'')?parts[topicIndex+1]:null;
 if(urlPost&&urlPost!==locatorPost)throw Error('Forum URL post ID and source locator disagree');
 u.pathname='/'+[...parts.slice(0,topicIndex+1),locatorPost].join('/');
 u.search='';u.hash='';
 return u.href;
}
export function sourceUnitKey(row){
 const u=new URL(canonicalUrl(row.url));const segments=u.pathname.split('/').filter(Boolean);
 // A Discourse title can change; topic and post IDs identify the source unit.
 // This is source identity, never speaker or investor identity.
 if(row.source_family==='Investing forums'){
  const t=segments.indexOf('t'),topicIndex=t>=0?segments.findIndex((p,i)=>i>t&&/^\d+$/.test(p)):-1;
  if(topicIndex>=0){
   const urlPost=/^\d+$/.test(segments[topicIndex+1]||'')?segments[topicIndex+1]:null;
   const locator=String(row.source_locator||'').trim(),locatorPost=/^post-(\d+)$/.exec(locator)?.[1]||null;
   if(urlPost&&locatorPost&&urlPost!==locatorPost)throw Error('Forum URL post ID and source locator disagree');
   const post=urlPost||locatorPost||'1';
   return `${u.hostname}:topic:${segments[topicIndex]}:post:${post}`+(locator&&!locatorPost?'|locator:'+locator:'');
  }
 }
 if(['Play Store','App Store'].includes(row.source_family)){
  const review=u.searchParams.get('reviewId')||u.searchParams.get('reviewid')||row.source_locator;
  if(review)return row.source_family+':review:'+u.hostname+':'+String(review).trim();
 }
 let unit=u.href;
 if(u.hostname==='redd.it'&&segments[0])unit='reddit:thread:'+segments[0].toLowerCase()+':root';
 if(u.hostname==='www.reddit.com'){
  const index=segments.indexOf('comments');
  if(index>=0&&segments[index+1]){
   const thread=segments[index+1].toLowerCase(),tail=segments.slice(index+2);
   const comment=tail[0]==='comment'?tail[1]:tail.length>=2?tail[1]:null;
   unit=`reddit:thread:${thread}:${comment?'comment:'+comment.toLowerCase():'root'}`;
  }
 }
 // Preserve explicit source locators; never infer a speaker from a thread URL.
 if(row.source_locator)unit+='|locator:'+String(row.source_locator).trim();
 return unit;
}
export function sourceRootKey(r){
 if(!r.url)return 'unresolved:'+r.id;
 const key=sourceUnitKey(r);
 if(key.startsWith('reddit:thread:'))return key.split(':').slice(0,3).join(':');
 if(r.source_family==='Investing forums'&&key.includes(':topic:'))return key.split(':post:')[0];
 if(r.source_family==='YouTube'){
  const u=new URL(canonicalUrl(r.url));return u.hostname+':comment:'+(u.searchParams.get('lc')||r.source_locator||u.searchParams.get('v')||key);
 }
 return key;
}
export function fingerprint(row){return sha(sourceUnitKey(row)+'\n'+normalizeForFingerprint(row.text));}
export function copyCandidateKey(text){
 const normalized=normalizeForFingerprint(text);
 // Heuristic for a REVIEW flag, not a confidence score or automatic merge.
 return normalized.length>=120&&normalized.split(' ').length>=20?sha(normalized):null;
}
export function duplicateAudit(rows){
 const groups=new Map(),copies=new Map();
 for(const r of rows){const key=fingerprint(r),copy=copyCandidateKey(r.text);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r.id);if(copy){if(!copies.has(copy))copies.set(copy,[]);copies.get(copy).push({id:r.id,unit:sourceUnitKey(r)});}}
 return {unit:'input records; not people',input_rows:rows.length,canonical_input_groups:groups.size,
  repeated_inputs:[...groups.values()].filter(x=>x.length>1).map(ids=>({ids,decision:'same source unit + whitespace-normalised text; duplicate input, not proof of matching people'})),
  cross_source_copy_candidates:[...copies.values()].filter(rs=>new Set(rs.map(r=>r.unit)).size>1).map(rs=>({ids:rs.map(r=>r.id),decision:'review only; copied advice, quotations and independent reports must be distinguished'})),
  distinct_source_roots:new Set(rows.map(sourceRootKey)).size,
  distinct_reddit_threads:new Set(rows.map(r=>sourceUnitKey(r)).filter(key=>key.startsWith('reddit:thread:')).map(key=>key.split(':').slice(0,3).join(':'))).size,
  limit:'Different located posts in one thread remain separate input records. Revised text at one source-unit locator requires a version review before import. Root grouping does not establish a shared speaker, a new episode, or independent corroboration.'};
}
