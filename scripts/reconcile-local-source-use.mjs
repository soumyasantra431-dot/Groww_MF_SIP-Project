import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {openStore} from '../engine/store.mjs';

// One-time migration for the two reviewed TradingQ&A records. Public use remains flagged.
const register=JSON.parse(readFileSync('research/ENGINE_V1_TERMS_REGISTER.json','utf8'));
const decision=register.find(x=>x.source_family==='Investing forums'&&x.url==='https://tradingqna.com/tos');
if(!decision?.status.includes('bounded local use recorded'))throw Error('Dated TradingQ&A local-use decision missing');
const store=openStore();
try{
 const rows=store.items().filter(r=>r.source_family==='Investing forums'&&new URL(r.url).hostname==='tradingqna.com'&&r.coding_origin==='assistant_source_review_proposal'&&r.terms_status==='flagged'&&r.local_use_status!=='cleared');
 if(rows.length>2)throw Error('More than two known assistant-reviewed records; reconcile individually');
 for(const r of rows){
  store.db.prepare("UPDATE items SET local_use_status='cleared',revision=revision+1 WHERE id=?").run(r.id);
  store.db.prepare('INSERT INTO corrections(id,item_id,old_value,new_value,reason,actor,created_at) VALUES(?,?,?,?,?,?,?)')
   .run(randomUUID(),r.id,r.local_use_status,'cleared','Dated 1 Nov TradingQ&A bounded local academic-use interpretation; public redistribution remains flagged','local_source_use_reconciliation',new Date().toISOString());
 }
 console.log(JSON.stringify({local_use_reconciled:rows.length,public_redistribution_cleared:0}));
}finally{store.close();}
