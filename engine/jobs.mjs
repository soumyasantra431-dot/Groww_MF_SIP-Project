import { randomUUID } from 'node:crypto';
import { originalInput } from './intake.mjs';
import { classify,modelStatus } from './provider.mjs';
export async function runBatch(store,tier,ids,options={}){
 if(!['a','b'].includes(tier)||!Array.isArray(ids)||!ids.length||ids.length>(tier==='a'?200:5)||new Set(ids).size!==ids.length)throw Error('Invalid batch: maximum Tier A 200 / Tier B stretch 5, unique item IDs');
 if(!modelStatus(options.env||process.env).enabled)throw Error('AI disabled; configured credentials and explicit run enablement required. Free mode uses a zero-dollar cap.');
 let completed=0,failed=0;
 for(const id of ids){
  const item=store.item(id);if(!item||item.origin!=='corpus')throw Error('Batch only accepts original corpus inputs');
  if(tier==='b'&&!item.tier_a)throw Error('Tier B requires a real Tier A result first');
  if(item['tier_'+tier]&&!options.rerun)continue;
  const run=randomUUID();store.db.prepare('INSERT INTO runs(id,item_id,tier,state,created_at,model) VALUES(?,?,?,?,?,?)').run(run,id,tier,'running',new Date().toISOString(),modelStatus(options.env||process.env).model);
  try{const input=originalInput(store,id);const result=await classify(store,input,tier,options);store.setResult(id,tier,result.result);store.db.prepare("UPDATE runs SET state='completed',attempts=1 WHERE id=?").run(run);completed++;}
  catch(e){const state=['FREE_PACING','FREE_RATE_LIMIT'].includes(e.code)?'deferred':'error';failed++;store.db.prepare('UPDATE runs SET state=?,attempts=?,error=? WHERE id=?').run(state,e.code==='FREE_PACING'?0:1,String(e.message).slice(0,240),run);options.onProgress?.({id,state});break;}
  options.onProgress?.({id,state:'completed'});
 }
 return {completed,failed,requested:ids.length,note:'Stopped at first failure; completed items are resumable. No automatic paid retries.'};
}
