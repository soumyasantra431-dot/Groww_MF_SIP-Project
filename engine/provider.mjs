import { EXTRACTION_VERSION,classificationSchema,episodeSchema,validateEvidence,privateSignals,persistable } from './contracts.mjs';
import {buildRequest,enforceRequestSize,REQUEST_PROFILE} from './request.mjs';
import {safeProviderFailure} from './provider-failure.mjs';
import {validationDiagnostics} from './validation-diagnostics.mjs';
import {z} from 'zod';
import {leanSchema,leanWireResultSchema,expandLeanWireTolerant} from './lean.mjs';
export const sourceUseAllowed=(family,env=process.env)=>family==='Reddit'?env.REDDIT_RESEARCH_USE_APPROVED==='true':family==='YouTube'?env.YOUTUBE_DERIVED_USE_APPROVED==='true':true;
export function modelStatus(env=process.env){const cap=Number(env.MODEL_SPEND_CAP_USD??0),valid=(!env.MODEL_BILLING_MODE||env.MODEL_BILLING_MODE==='free')&&cap===0;return {provider:env.MODEL_PROVIDER||'groq',model:env.MODEL_ID||'openai/gpt-oss-120b',billing_mode:'free',free_only:true,configuration_valid:valid,free_plan_confirmed:env.GROQ_FREE_PLAN_CONFIRMED==='true',key_configured:!!env.GROQ_API_KEY,enabled:valid&&env.ALLOW_MODEL_CALLS==='true'&&env.MODEL_KILL_SWITCH==='false'&&env.GROQ_FREE_PLAN_CONFIRMED==='true'&&!!env.GROQ_API_KEY,kill_switch:env.MODEL_KILL_SWITCH!=='false',cap_usd:0};}
export async function classify(store,input,tier='a',options={}){
 const env=options.env||process.env;const state=modelStatus(env);
 if(!state.enabled)throw Error('AI disabled. This project supports Free-only calls with a confirmed Free plan, key and run enable flags; monetary caps must be zero.');
 if(state.provider!=='groq')throw Error('Provider adapter not configured; no silent substitution');
 if(!['a','b','lean'].includes(tier))throw Error('Invalid tier');
 if(!input.text?.trim()||input.text.length>24000)throw Error('Paste 1–24,000 characters of public text');
 if(privateSignals(input.text).length)throw Error('Private-data pattern detected; remove it before processing');
 if(input.source_family==='Reddit'&&env.REDDIT_RESEARCH_USE_APPROVED!=='true')throw Error('Reddit research/model use is unresolved under the inspected policy. Record a valid researcher-programme or other explicit permission basis first. No call made.');
 if(input.source_family==='YouTube'&&env.YOUTUBE_DERIVED_USE_APPROVED!=='true')throw Error('YouTube derived-analysis use is unresolved under the inspected policy. Establish a valid permission basis first. No call made.');
 const schema=tier==='a'?classificationSchema:tier==='lean'?leanSchema:episodeSchema;
 const packet=buildRequest(input,tier,{model:state.model,free:state.billing_mode==='free',transport:options.transport||'structured'});
 const preflight=enforceRequestSize(packet,{free:state.billing_mode==='free',limit:Math.min(Number(env.MODEL_FREE_REQUEST_TOKEN_LIMIT)||8000,8000)});
 const maxOutput=packet.max_completion_tokens;
 // Retain the conservative byte-based reservation for accounting. The per-request
 // token estimate is a separate gate; neither is actual provider usage.
 const inputUpper=new TextEncoder().encode(JSON.stringify(packet)).length+2048;
 let id;
  if(!store.reserveFree)throw Error('Free-tier quota ledger unavailable; no paid fallback');
  id=await store.reserveFree(inputUpper+maxOutput,Math.min(Number(env.MODEL_FREE_DAILY_TOKEN_CAP)||180000,200000),Math.min(Number(env.MODEL_FREE_MAX_CALLS)||10,1000),65);
 const telemetry={request_attempted:true,tier,processing_status:'attempted',http_status:null,prompt_tokens:null,completion_tokens:null,total_tokens:null,latency_ms:null,finish_reason:null,truncated:null,rate_limited:false,rate_headers:{},preflight};
 const started=performance.now();
 try{
 const reply=await (options.fetcher||fetch)('https://api.groq.com/openai/v1/chat/completions',{
  method:'POST',headers:{Authorization:`Bearer ${env.GROQ_API_KEY}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(60000),
  body:JSON.stringify(packet)
 });
 telemetry.http_status=reply.status;telemetry.rate_limited=reply.status===429;
 for(const name of ['retry-after','x-ratelimit-limit-requests','x-ratelimit-limit-tokens','x-ratelimit-remaining-requests','x-ratelimit-remaining-tokens','x-ratelimit-reset-requests','x-ratelimit-reset-tokens']){const v=reply.headers?.get(name);if(v&&v.length<=60&&/^[\d.\smdhs]+$/.test(v))telemetry.rate_headers[name]=v;}
 // Read only a bounded transient error body. Persist a fixed vocabulary and
 // aggregate limit numbers, never provider prose that may echo source text.
 if(!reply.ok){telemetry.provider_failure=await safeProviderFailure(reply);const e=Error(`Provider request failed (${reply.status}); reservation retained; no paid fallback`);e.code=reply.status===429?'FREE_RATE_LIMIT':reply.status===413?'PROVIDER_REQUEST_TOO_LARGE':'PROVIDER_FAILURE';throw e;}
 const body=await reply.json();
 for(const k of ['prompt_tokens','completion_tokens','total_tokens'])if(Number.isInteger(body.usage?.[k])&&body.usage[k]>=0)telemetry[k]=body.usage[k];
 if(telemetry.total_tokens===null&&telemetry.prompt_tokens!==null&&telemetry.completion_tokens!==null)telemetry.total_tokens=telemetry.prompt_tokens+telemetry.completion_tokens;
 const finish=body.choices?.[0]?.finish_reason;telemetry.finish_reason=['stop','length','content_filter','tool_calls','function_call'].includes(finish)?finish:'other';telemetry.truncated=finish==='length';
 if(body.usage&&Number.isInteger(body.usage.prompt_tokens)&&body.usage.prompt_tokens>=0&&Number.isInteger(body.usage.completion_tokens)&&body.usage.completion_tokens>=0)await store.settle(id,0,body.usage);
 if(body.choices?.[0]?.finish_reason!=='stop')throw Error('Incomplete model response; not a successful classification');
 let decoded;try{decoded=JSON.parse(body.choices?.[0]?.message?.content);}catch{telemetry.validation={stage:'json',issue_count:null,issues:[],details_capped:false};throw Error('Provider output failed structure checks; no raw output retained');}
 const outputSchema=tier==='lean'?leanWireResultSchema:schema;
 const checked=outputSchema.safeParse(decoded);
 if(!checked.success){telemetry.validation=validationDiagnostics(checked.error,z.toJSONSchema(outputSchema,{reused:'ref'}));throw Error('Provider output failed structure checks; no raw output retained');}
 let value;
 if(tier==='lean'){
  try{const expanded=expandLeanWireTolerant(checked.data,input.text,input.source_family);value=expanded.value;telemetry.anchor_ambiguous_fields=expanded.anchor_ambiguous_fields;telemetry.field_rejections=expanded.rejected_fields;}
  catch(error){telemetry.validation={stage:'source_anchor',issue_count:1,issues:[{code:['LEAN_REPEAT_FIELD','LEAN_PRIVATE_VALUE','LEAN_QUOTE_ABSENT','LEAN_QUOTE_AMBIGUOUS','LEAN_VALUE_INVALID'].includes(error.code)?error.code:'LEAN_VALUE_INVALID'}],details_capped:false};throw Error('Lean proposal failed source checks; no raw output retained');}
 }else value=checked.data;
 if(tier!=='lean')validateEvidence(tier==='a'?value:{...value,...value.classification},input.text,input.source_family);
 // Only derived labels/paraphrases and evidence offsets (not spans) can leave transient memory.
 telemetry.processing_status=telemetry.field_rejections?.length?'partial_proposal':'completed';telemetry.latency_ms=Math.round(performance.now()-started);
 return {result:persistable(value,{retainOffsets:tier==='lean'}),run:{model:state.model,extraction_version:EXTRACTION_VERSION,request_profile:preflight.request_profile,proposal:true,reservation:id,billing_mode:state.billing_mode,telemetry}};
 }catch(error){telemetry.processing_status='failed';telemetry.latency_ms=Math.round(performance.now()-started);error.telemetry=telemetry;throw error;}
}
