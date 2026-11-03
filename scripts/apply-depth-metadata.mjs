import {readFileSync} from 'node:fs';
import {openStore} from '../engine/store.mjs';
import {originalInput} from '../engine/intake.mjs';
import {copyCandidateKey} from '../engine/normalization.mjs';
const store=openStore();
try{
 const refs=JSON.parse(readFileSync('.local/evaluation/reference_labels.json','utf8'));
 let labelled=0;
 for(const ref of refs){
  const r=store.item(ref.id);if(!r)throw Error('Reference item missing; do not recreate or replace it');
  const lane=ref.origin_id.startsWith('CONTROL-')?'control':'user_voice';
  if(r.evidence_lane!=='unknown'&&r.evidence_lane!==lane)throw Error('Existing provenance decision conflicts; review manually');
  const input=originalInput(store,r.id);
  store.db.prepare('UPDATE items SET evidence_lane=?,copy_key=? WHERE id=?').run(lane,copyCandidateKey(input.text)||'',r.id);labelled++;
 }
 store.meta('depth_addendum',{date:'2026-10-31',schema:'v1-depth-addendum',source:'confirmed user addendum',reference_labels_changed:false});
 console.log({existing_seed_provenance_labelled:labelled,new_corpus_items:0,model_requests:store.spend().calls,reference_labels_changed:false});
}finally{store.close();}
