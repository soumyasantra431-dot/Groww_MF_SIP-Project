import { filtered,rollup } from '../engine/analysis.mjs';
import { questionCards } from '../engine/question-cards.mjs';
import { modelStatus } from '../engine/provider.mjs';
import { corpusReadiness,driverEvidence } from '../engine/scope.mjs';
import { researchPlan } from '../engine/research-plan.mjs';
const response=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/api/workspace'&&request.method==='GET'){
  const raw=await env.ASSETS.fetch(new Request(new URL('/snapshot.json',request.url)));
  if(!raw.ok)return response({error:'Published snapshot unavailable'},503);
  const s=await raw.json(),items=filtered(s.items,Object.fromEntries(url.searchParams));
  const spend=env.LIMITS?await env.LIMITS.prepare("SELECT COUNT(*) AS calls,COALESCE(SUM(CASE WHEN state='settled' THEN actual ELSE reserved END),0) AS committed_usd FROM spend").first():null;
  return response({mode:'public',items,research_plan:researchPlan(items),global_research_plan:s.global_research_plan||null,global_rollup:s.global_rollup||null,source_ledger:s.source_ledger||null,preliminary_comparison:s.preliminary_comparison||null,question_cards:s.provisional_cards||questionCards(s.items,{publicOnly:true,approvedAnswers:s.approved_answers||{}}),review_collection:s.review_collection||null,rollup:rollup(items),readiness:corpusReadiness(s.items),drivers:driverEvidence(items),model:modelStatus(env),pipeline:{lean_batch_ready:false,live_paste_ready:false,reason:'Lean extraction and the live tester have not passed validation.'},spend,quality:s.quality||null});
 }
 if(url.pathname==='/api/classify'&&request.method==='POST')return response({error:'Live classifier held until the lean path passes validation. No pasted text stored and no model call made.'},503);
 // No upload, review, batch, admin, evaluation-write or publication API exists in production.
 if(url.pathname.startsWith('/api/'))return response({error:'Not found'},404);
 return env.ASSETS.fetch(request);
}};
