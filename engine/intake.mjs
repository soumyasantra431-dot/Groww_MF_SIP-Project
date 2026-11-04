import { parse } from 'csv-parse/sync';
import { mkdirSync,writeFileSync,readFileSync } from 'node:fs';
import { join,basename } from 'node:path';
import { createHash,randomUUID } from 'node:crypto';
import { FAMILIES,privateSignals,safeUrl } from './contracts.mjs';
import { normalizeSourceFamily,fingerprint,copyCandidateKey,sourceUnitKey } from './normalization.mjs';
// Local raw corpus is a machine input, not a spreadsheet export: never prefix a
// leading -, +, = or @ in the author's original text. Deck CSVs use a different writer.
export function corpusCsv(columns,rows){const cell=v=>'"'+String(v??'').replaceAll('"','""')+'"';return [columns.map(cell).join(','),...rows.map(r=>columns.map(c=>cell(r[c])).join(','))].join('\r\n');}
export function parseCorpus(csv){
 let rows;try{rows=parse(csv.replace(/^\uFEFF/,''),{columns:true,skip_empty_lines:true,bom:true});}catch{throw Error('CSV could not be parsed; check quoting and column counts. Original text is not included in errors.');}
 if(!rows.length||rows.length>200)throw Error('Upload 1–200 rows per Tier A batch');
 for(const r of rows){for(const k of ['source_family','url','date','text'])if(!(k in r))throw Error('Required CSV columns: source_family,url,date,text');r.source_family=normalizeSourceFamily(r.source_family);if(!FAMILIES.includes(r.source_family))throw Error('Unrecognised source_family');r.url=r.url.trim();r.date=r.date.trim();if(!safeUrl(r.url))throw Error('Use a public HTTPS source URL without identifiers');if(r.text.length>24000)throw Error('Text exceeds 24,000 character limit; split explicitly');if(privateSignals(r.text).length||privateSignals(r.source_locator||'').length)throw Error('Remove PAN, account-like numbers, contact details or usernames before import');if(r.date&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||Number.isNaN(Date.parse(r.date+'T00:00:00Z'))||new Date(r.date+'T00:00:00Z').toISOString().slice(0,10)!==r.date))throw Error('Date must be a real YYYY-MM-DD date or blank (unknown)');}
 for(const r of rows){
  if(Object.keys(r).some(k=>!['source_family','url','date','text','platform_stated','source_locator','evidence_lane','independence_group'].includes(k)))throw Error('Remove unsupported CSV columns, including author/profile/account data, before import');
  if((r.platform_stated||'').length>80||privateSignals(r.platform_stated||'').length)throw Error('Use a short platform hint without identifiers');
  if(!r.text.trim())throw Error('Original public text is required; a link alone is not an analysis input');
  if(r.evidence_lane&&!['user_voice','context','control','unknown'].includes(r.evidence_lane))throw Error('Invalid evidence_lane');
  if(r.independence_group&&!/^[A-Za-z0-9_-]{1,64}$/.test(r.independence_group))throw Error('Use a non-identifying independence-group code');
  if((r.source_locator||'').length>220)throw Error('Source locator too long');
 }
 return rows;
}
export function importCorpus(store,csv){
 const rows=parseCorpus(csv);
 const existing=new Map(),units=new Map(),cache=new Map();
 for(const r of store.db.prepare('SELECT id,raw_file,row_index FROM items WHERE raw_file IS NOT NULL ORDER BY id').all()){
  if(!cache.has(r.raw_file))cache.set(r.raw_file,parseCorpus(readFileSync(join(store.dir,'raw',basename(r.raw_file)),'utf8')));
  const input=cache.get(r.raw_file)[r.row_index];if(input){const key=fingerprint(input);if(!existing.has(key))existing.set(key,r.id);const unit=sourceUnitKey(input);if(!units.has(unit))units.set(unit,key);}
 }
 const pending=[],aliases=[];
 rows.forEach((r,i)=>{const key=fingerprint(r),unit=sourceUnitKey(r);if(existing.has(key)){aliases.push({input_row:i+1,canonical_item_id:existing.get(key),basis:'same source unit and normalised input text'});return;}
  if(units.has(unit)&&units.get(unit)!==key)throw Error('This source locator has different text in the corpus. Review the source version before importing; no new raw file was saved.');
  // Keep established IDs stable so frozen reference input hashes/links remain valid.
  const id='I-'+createHash('sha256').update(r.url.trim()+'\n'+r.text+(r.source_locator?'\nlocator:'+r.source_locator:'')).digest('hex').slice(0,20);
  existing.set(key,id);units.set(unit,key);pending.push({r,i,id});
 });
 if(!pending.length)return {inserted:0,duplicates:rows.length,rows:rows.length,aliases,note:'All inputs already present after source/text normalisation; no additional raw file saved'};
 const dir=join(store.dir,'raw');mkdirSync(dir,{recursive:true});
 const file=randomUUID()+'.csv';writeFileSync(join(dir,file),csv,{encoding:'utf8',mode:0o600});
 for(const {r,i,id} of pending)store.insert({...r,id,copy_key:copyCandidateKey(r.text)||'',raw_file:file,row_index:i});
 return {inserted:pending.length,duplicates:aliases.length,rows:rows.length,aliases,raw_location:'.local/raw/ (ignored; local only)'};
}
export function originalInput(store,id){const r=store.item(id);if(!r?.raw_file)throw Error('Original text unavailable; source link queued only');const rows=parseCorpus(readFileSync(join(store.dir,'raw',basename(r.raw_file)),'utf8'));const x=rows[r.row_index];if(!x||x.url!==r.url)throw Error('Raw source/index mismatch');return x;}
