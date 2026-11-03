import { readFileSync,writeFileSync,mkdirSync,statSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { openStore } from '../engine/store.mjs';
import { corpusCsv } from '../engine/intake.mjs';
import {privateSignals} from '../engine/contracts.mjs';
import {normalizeSourceFamily} from '../engine/normalization.mjs';
import { permissionFor,filterStoreExport,collectYouTube,INPUT_COLUMNS } from '../engine/collection.mjs';

const [route,...args]=process.argv.slice(2),options={};
for(let i=0;i<args.length;i++){if(args[i]==='--run')options.run=true;else if(args[i].startsWith('--')&&args[i+1]&&!args[i+1].startsWith('--'))options[args[i].slice(2)]=args[++i];else throw Error('Expected --option value or --run');}
if(!['youtube','store-export'].includes(route))throw Error('Usage: collect.mjs youtube --video-id ID --query SIP [--pages 1] [--run], or store-export --file lawful.csv --family "Play Store" [--run]');
if(!options.run){console.log(JSON.stringify({mode:'dry_run',route,network_requests:0,files_written:0,requires:'For --run, record approved collection and model-processing rights in .local/source-permissions.json. YouTube also needs YOUTUBE_API_KEY. Do not bypass source restrictions.'},null,2));}
else{
 const store=openStore();let permission,counts={};
 const loggedFamily=route==='youtube'?'YouTube':normalizeSourceFamily(options.family||'Play Store')||'unknown';
 const loggedQuery=route==='youtube'?JSON.stringify({searchTerms:privateSignals(options.query||'').length?'invalid query omitted':String(options.query||'SIP').slice(0,160),videoId:/^[A-Za-z0-9_-]{11}$/.test(options['video-id']||'')?options['video-id']:'invalid video ID omitted',order:'time',maxPages:Math.min(Number(options.pages)||1,3)}):'SIP/MF/AutoPay/mandate/XIRR/instalment keyword export filter';
 try{
  const register=JSON.parse(readFileSync(join(store.dir,'source-permissions.json'),'utf8'));
  permission=permissionFor(register,route==='youtube'?'youtube':'store_export');
  let result;
  if(route==='youtube')result=await collectYouTube({videoId:options['video-id'],query:options.query||'SIP',maxPages:Number(options.pages||1),key:process.env.YOUTUBE_API_KEY,permission,onPage:n=>counts=n});
  else{
   if(!options.file||statSync(options.file).size>20e6)throw Error('Provide a lawful local export no larger than 20 MB');
   result=filterStoreExport(readFileSync(options.file,'utf8'),{family:options.family||'Play Store'});
  }
  counts=result.counts;const files=[],dir=join(store.dir,'intake');mkdirSync(dir,{recursive:true});
  for(let i=0;i<result.rows.length;i+=200){const path=join(dir,randomUUID()+'.csv');writeFileSync(path,corpusCsv(INPUT_COLUMNS,result.rows.slice(i,i+200)),{mode:0o600});files.push(path);}
  const run=store.logCollection({source_family:loggedFamily,query:loggedQuery,route,state:'completed_local_export_not_imported',counts,permission_basis:permission.basis});
  if(result.delete_or_refresh_by)store.meta('collection_expiry:'+run,{files,delete_or_refresh_by:result.delete_or_refresh_by,scope:result.scope});
  console.log(JSON.stringify({run,counts,files,imported:0,model_requests:0,delete_or_refresh_by:result.delete_or_refresh_by,scope:result.scope||'Keyword-filtered authorised local store export; not all reviews. Exact originals retained locally; private-pattern items excluded. Review query false positives before interpretation.'},null,2));
 }catch(e){store.logCollection({source_family:loggedFamily,query:loggedQuery,route,state:'failed_no_model_call',counts,permission_basis:permission?.basis||'unreviewed'});console.error('Collector stopped. Check arguments, recorded permissions, local file and credentials. No response body or original text logged.');process.exitCode=1;}
 finally{store.close();}
}
