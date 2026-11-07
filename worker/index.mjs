import { filtered,rollup } from '../engine/analysis.mjs';
import { questionCards } from '../engine/question-cards.mjs';
import { modelStatus } from '../engine/provider.mjs';
import { corpusReadiness,driverEvidence } from '../engine/scope.mjs';
import { researchPlan } from '../engine/research-plan.mjs';
import { privateSignals } from '../engine/contracts.mjs';
const response=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const answerCalls=new Map();
function allowedRequest(request){
 const ip=request.headers.get('CF-Connecting-IP')||'unknown',now=Date.now(),old=answerCalls.get(ip)||[];
 const recent=old.filter(t=>now-t<3600000);
 if(recent.length>=5)return false;
 recent.push(now);answerCalls.set(ip,recent);
 return true;
}
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/api/workspace'&&request.method==='GET'){
  const raw=await env.ASSETS.fetch(new Request(new URL('/snapshot.json',request.url)));
  if(!raw.ok)return response({error:'Published snapshot unavailable'},503);
  const s=await raw.json(),items=filtered(s.items,Object.fromEntries(url.searchParams));
  const spend=env.LIMITS?await env.LIMITS.prepare("SELECT COUNT(*) AS calls,COALESCE(SUM(CASE WHEN state='settled' THEN actual ELSE reserved END),0) AS committed_usd FROM spend").first():null;
  return response({mode:'public',items,research_plan:researchPlan(items),global_research_plan:s.global_research_plan||null,global_rollup:s.global_rollup||null,source_ledger:s.source_ledger||null,preliminary_comparison:s.preliminary_comparison||null,question_cards:s.provisional_cards||questionCards(s.items,{publicOnly:true,approvedAnswers:s.approved_answers||{}}),review_collection:s.review_collection||null,rollup:rollup(items),readiness:s.local_readiness||corpusReadiness(s.items),drivers:driverEvidence(items),model:modelStatus(env),pipeline:{lean_batch_ready:false,live_paste_ready:false,reason:'Lean extraction and the live tester have not passed validation.'},spend,development:s.development||null,quality:s.quality||null});
 }
 if(url.pathname==='/api/answer'&&request.method==='POST'){
  if(request.headers.get('content-length')&&Number(request.headers.get('content-length'))>2048)return response({error:'Question too long'},413);
  let input;try{const body=await request.text();if(body.length>2048)return response({error:'Question too long'},413);input=JSON.parse(body);}catch{return response({error:'Invalid question'},400);}
  const id=String(input?.question_id||''),query=String(input?.question||'').trim();
  if(!/^Q[1-9]$/.test(id)||query.length>300||privateSignals(query).length)return response({error:'Choose one of the nine questions and remove private details'},400);
  const raw=await env.ASSETS.fetch(new Request(new URL('/snapshot.json',request.url)));
  if(!raw.ok)return response({error:'Research snapshot unavailable'},503);
  const s=await raw.json(),card=s.provisional_cards?.find(c=>c.id===id);
  if(!card)return response({error:'Question unavailable'},404);
  const fallback={question_id:id,answer:card.working_reading?.text||'This question is not answered by the reviewed material yet.',source:card.working_reading?{url:card.working_reading.url,family:card.working_reading.source_family,scope:card.working_reading.scope_lane}:null,rival:card.rival_to_check,unknown:card.unknown,next_test:card.next_decision,status:'provisional_research_direction',generated:false};
  if(env.ALLOW_ANSWER_CALLS!=='true'||env.ANSWER_KILL_SWITCH!=='false'||!env.GROQ_API_KEY)return response(fallback);
  if(!allowedRequest(request))return response({...fallback,note:'Free-tier demo limit reached; showing the checked reading.'});
  const facts=[card.working_reading?.text,card.rival_to_check,card.unknown].filter(Boolean).join('\n');
  const prompt=`You are drafting one plain-English PM research reading. Return only one paragraph. Use ONLY the supplied research reading. State it as one public account, never as a prevalence claim or a confirmed Groww cohort finding. If the reading does not answer the question, say what remains unknown. No investment advice, fund recommendation, invented cause, number, age, or outcome. Maximum 70 words.\nQuestion: ${card.title}\nResearch reading: ${facts}`;
  try{
   const reply=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${env.GROQ_API_KEY}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(12000),body:JSON.stringify({model:env.ANSWER_MODEL_ID||'openai/gpt-oss-20b',temperature:0,reasoning_effort:'low',max_completion_tokens:700,messages:[{role:'system',content:'Write only one plain-English paragraph. The provided research reading is the entire evidence base.'},{role:'user',content:prompt}]})});
   if(!reply.ok)return response({...fallback,note:'AI unavailable; showing the checked reading.'});
   const data=await reply.json();let draft=data.choices?.[0]?.message?.content?.trim();
   if(draft?.startsWith('{')){try{const parsed=JSON.parse(draft);draft=parsed.answer||parsed.sentence;}catch{draft=null;}}
   if(data.choices?.[0]?.finish_reason!=='stop'||typeof draft!=='string'||draft.length<20||draft.length>550||privateSignals(draft).length)return response({...fallback,note:'AI draft did not pass the response check; showing the checked reading.'});
   if(/\b(proves?|most|all|majority|typically|generally|often|retention|prevalence|caused)\b/i.test(draft))return response({...fallback,note:'AI overgeneralized; showing the checked reading.'});
   const factsNumbers=new Set((facts.match(/\b\d+(?:\.\d+)?\b/g)||[]));
   if((draft.match(/\b\d+(?:\.\d+)?\b/g)||[]).some(n=>!factsNumbers.has(n)))return response({...fallback,note:'AI introduced an unsupported number; showing the checked reading.'});
   return response({...fallback,answer:draft,generated:true,model:env.ANSWER_MODEL_ID||'openai/gpt-oss-20b'});
  }catch{return response({...fallback,note:'AI unavailable; showing the checked reading.'});}
 }
 if(url.pathname==='/api/classify'&&request.method==='POST')return response({error:'Live classifier held until the lean path passes validation. No pasted text stored and no model call made.'},503);
 // No upload, review, batch, admin, evaluation-write or publication API exists in production.
 if(url.pathname.startsWith('/api/'))return response({error:'Not found'},404);
 return env.ASSETS.fetch(request);
}};
