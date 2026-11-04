import {QUESTIONS,privateSignals} from './contracts.mjs';
import {coding,isStudyEvidence} from './scope.mjs';

const ids=new Set(QUESTIONS.map(q=>q[0]));
const bounded=(value,max,name)=>{const text=String(value||'').trim();if(!text||text.length>max||privateSignals(text).length)throw Error(`${name} needs short non-identifying wording`);return text;};

export function saveReviewedAnswer(store,input){
 const question_id=String(input.question_id||'');
 if(!ids.has(question_id)||input.checked_sources!==true||input.researcher_approved!==true)throw Error('Question and explicit source/wording review required');
 const source_ids=input.source_ids;
 if(!Array.isArray(source_ids)||!source_ids.length||source_ids.length>20||new Set(source_ids).size!==source_ids.length)throw Error('Cite 1–20 distinct reviewed source IDs');
 const items=store.items(),byId=new Map(items.map(r=>[r.id,r]));
 const sources=source_ids.map(id=>byId.get(id));
 if(sources.some(r=>!r||r.origin!=='corpus'||r.review_state!=='accepted'||r.local_use_status!=='cleared'&&r.terms_status!=='cleared'||!isStudyEvidence(r)||!coding(r).question_ids.includes(question_id)))throw Error('Every cited source must be accepted, locally permitted and linked to this question');
 const payload={question_id,direct_answer:bounded(input.direct_answer,700,'Direct answer'),counterexample_or_rival:bounded(input.counterexample_or_rival,500,'Counterexample or rival'),unknown:bounded(input.unknown,500,'Unknown'),next_question:bounded(input.next_question,400,'Next question'),source_ids};
 const sourceRevisions=Object.fromEntries(sources.map(r=>[r.id,r.revision]));
 store.db.prepare('INSERT INTO question_answers(question_id,payload,source_revisions,approved_at) VALUES(?,?,?,?) ON CONFLICT(question_id) DO UPDATE SET payload=excluded.payload,source_revisions=excluded.source_revisions,approved_at=excluded.approved_at').run(question_id,JSON.stringify(payload),JSON.stringify(sourceRevisions),new Date().toISOString());
 store.meta('snapshot_stale',true);
 return {question_id,status:'researcher_approved_local',source_count:sources.length,public_ready:sources.every(r=>r.terms_status==='cleared')};
}

export function reviewedAnswers(store,items,{publicOnly=false}={}){
 const byId=new Map(items.map(r=>[r.id,r]));
 const answerRows=store.db.prepare('SELECT * FROM question_answers').all();
 return Object.fromEntries(answerRows.map(row=>{
  const payload=JSON.parse(row.payload),revisions=JSON.parse(row.source_revisions);
  const valid=payload.source_ids.every(id=>{const r=byId.get(id);return r&&r.revision===revisions[id]&&r.review_state==='accepted'&&isStudyEvidence(r)&&
   (publicOnly?r.terms_status==='cleared':r.local_use_status==='cleared'||r.terms_status==='cleared')&&coding(r).question_ids.includes(row.question_id);});
  return [row.question_id,valid?{...payload,approved_at:row.approved_at,status:'researcher_approved'}:{status:'stale_or_not_publishable'}];
 }));
}
