// Research preparation/scoring only. This module makes no model or network calls.
import {createHash} from 'node:crypto';
import {MATERIAL_FIELDS,NODES,EXITS,privateSignals,safeUrl} from './contracts.mjs';

export const PILOT_FIELDS=MATERIAL_FIELDS.filter(f=>f!=='source_family');
export const PILOT_STRATA=['continuer','interruption_manual_workaround','deliberate_pause','recovery','ambiguous_ending','hypothetical','one_of_several_stopped','op_vs_commenter','adjacent_platform','non_episode_control'];
export const hash=value=>createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
const allowedKeys=(object,keys)=>Object.keys(object).every(k=>keys.includes(k));
const datum=()=>({state:null,value:null,evidence_note:''});
const canonical=v=>String(v??'').normalize('NFC').trim().replace(/\s+/g,' ').toLowerCase();

export function strictMatch(eligibility={}){
 const values=['first_time_mf','first_sip_on_groww','within_first_12_months'].map(k=>eligibility[k]);
 if(values.some(v=>!['yes','no','unknown'].includes(v)))throw Error('Complete all three eligibility audit fields');
 return values.every(v=>v==='yes')?'direct':values.includes('no')?'adjacent':'unknown';
}

export function validatePilotConsent(consent,now=new Date().toISOString()){
 if(!consent||!allowedKeys(consent,['affirmative','external_ai_processing','date','basis','confirmed_on'])||consent.affirmative!==true||consent.external_ai_processing!==true)throw Error('Permission for external AI processing is required');
 const attested=consent.basis==='fellow_attestation';
 if(consent.basis&&!['fellow_attestation','participant_record'].includes(consent.basis))throw Error('Unknown permission basis');
 const date=attested?consent.confirmed_on:consent.date;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||!Number.isFinite(Date.parse(date))||Date.parse(date)>Date.parse(now))throw Error('Record a valid permission or confirmation date');
 if(attested&&consent.date!==null)throw Error('Do not substitute the Fellow confirmation date for an unknown participant consent date');
 return {basis:attested?'fellow_attestation':'participant_record',confirmed_on:attested?date:null,participant_consent_date:consent.date||null};
}

export function prepareSmokePack(items,terms,{protocolHash,fallbackPublicOnly=false,now=new Date().toISOString()}={}){
 if(items.length!==10||new Set(items.map(r=>r.id)).size!==10)throw Error('Freeze exactly ten distinct safe inputs');
 if(!/^[a-f0-9]{64}$/.test(protocolHash||''))throw Error('Hash the preregistration before freezing inputs');
 const keys=['id','source_family','url','source_locator','date','text','origin','participant_id','consent','terms_id','eligibility','privacy_review','redaction_categories','coverage','language','negation','speaker_roles','dependency_root'];
 for(const r of items){
  if(!allowedKeys(r,keys)||!/^P\d{2}$/.test(r.id))throw Error('Use pilot IDs and approved non-identifying input fields only');
  if(!r.text?.trim()||r.text.length>24000||privateSignals(JSON.stringify(r)).length||/\b[A-Z]{4}0[A-Z0-9]{6}\b|[a-z0-9._+-]+@[a-z0-9.-]+|(?:₹|\brs\.?\s*|\binr\s*)\d|\d[\d,.]*\s*(?:lakh|crore|rupees)/i.test(r.text))throw Error('Private or invalid input rejected before storage');
  if(r.privacy_review!=='manually_checked_deidentified')throw Error('Manual review for names, identifiers and exact personal amounts is required before storage');
  if(!['public_account','consented_first_hand','context_control'].includes(r.origin))throw Error('Declare evidence provenance');
  if(['Reddit','YouTube'].includes(r.source_family))throw Error('Reddit and YouTube are excluded from this pilot');
  if(!['Investing forums','Other'].includes(r.source_family))throw Error('Pilot source family must match its permitted source route');
  if(r.origin==='consented_first_hand'){
   if(!/^R\d{2}$/.test(r.participant_id||''))throw Error('Use a pseudonymous first-hand record ID');
   validatePilotConsent(r.consent,now);
   if(r.url)throw Error('First-hand accounts use a local pseudonymous locator, not a private response link');
  }else if(!safeUrl(r.url)||!r.source_locator||r.participant_id||r.consent)throw Error('Use a safe public original locator without identity fields');
  const t=terms.find(t=>t.id===r.terms_id);
  if(!t||t.collection_allowed!==true||t.model_processing_allowed!==true||!/^\d{4}-\d{2}-\d{2}$/.test(t.checked_on||'')||!Number.isFinite(Date.parse(t.checked_on))||!t.basis?.trim()||Date.parse(t.checked_on)>Date.parse(now))throw Error('Source-specific dated collection and model-processing basis required');
  if(r.origin!=='consented_first_hand'&&(!safeUrl(t.terms_url)||new URL(r.url).hostname.replace(/^www\./,'')!==t.domain))throw Error('Terms decision must belong to the source domain');
  if(!r.dependency_root||privateSignals(r.dependency_root).length)throw Error('A non-identifying dependency root is required');
  if(!Array.isArray(r.coverage)||r.coverage.some(v=>!PILOT_STRATA.includes(v))||!Array.isArray(r.speaker_roles)||r.speaker_roles.some(v=>!['op','commenter_1','commenter_2','platform_reply','reader_question','expert_answer','participant'].includes(v)))throw Error('Use anonymous speaker roles and predefined coverage tags');
  if(r.speaker_roles.length>1&&!r.speaker_roles.every(role=>r.text.includes('['+role+']')))throw Error('Multi-speaker inputs need explicit anonymous role delimiters in the frozen text');
  strictMatch(r.eligibility);
 }
 const firstHand=items.filter(r=>r.origin==='consented_first_hand');
 if(!fallbackPublicOnly&&new Set(firstHand.map(r=>r.participant_id)).size<3)throw Error('Reserve three distinct consented participants, or explicitly version the authorised public-only fallback');
 if(fallbackPublicOnly&&firstHand.length)throw Error('Public-only fallback must actually be public-only');
 const coverage=new Set(items.flatMap(r=>r.coverage));
 const missing=PILOT_STRATA.filter(s=>!coverage.has(s));
 if(missing.length||!items.some(r=>r.language==='Hinglish')||!items.some(r=>r.negation===true))throw Error('Coverage incomplete; report gaps instead of fabricating or silently changing strata');
 // Exact text and roles seen by both labelers and model; selection expectations are withheld.
 const inputs=items.map(r=>({id:r.id,source_family:r.source_family,url:r.url||null,source_locator:r.source_locator,date:r.date||null,text:r.text,speaker_roles:r.speaker_roles,origin:r.origin,input_sha256:hash({text:r.text,source_family:r.source_family,speaker_roles:r.speaker_roles,origin:r.origin,date:r.date||null})}));
 const manifest={schema:'sip-smoke-v1',frozen_at:now,protocol_sha256:protocolHash,fallback_public_only:fallbackPublicOnly,items:items.map((r,i)=>({id:r.id,input_sha256:inputs[i].input_sha256,strict_match:strictMatch(r.eligibility),dependency_root:r.dependency_root,participant_id:r.participant_id||null,terms_id:r.terms_id,coverage:r.coverage,privacy_review:r.privacy_review,redaction_categories:r.redaction_categories||[]})),counts:{items:10,direct:items.filter(r=>strictMatch(r.eligibility)==='direct').length,adjacent:items.filter(r=>strictMatch(r.eligibility)==='adjacent').length,unknown:items.filter(r=>strictMatch(r.eligibility)==='unknown').length,dependency_roots:new Set(items.map(r=>r.dependency_root)).size,consented_first_hand_participants:new Set(firstHand.map(r=>r.participant_id)).size}};
 manifest.first_hand_permission=firstHand.map(r=>({id:r.id,participant_id:r.participant_id,...validatePilotConsent(r.consent,now)}));
 return {manifest,inputs,fellow_labels:{schema:'sip-smoke-labels-v1',rater:'Fellow',manifest_sha256:hash(manifest),completed_at:null,blind_before_model_output:null,items:inputs.map(r=>({id:r.id,input_sha256:r.input_sha256,material:Object.fromEntries(MATERIAL_FIELDS.map(f=>[f,datum()])),metric_node:datum(),exit_form:datum(),disposition:null,notes:''}))}};
}

export function validateBlindReceipt(manifest,labels,firstCallAt){
 if(labels.manifest_sha256!==hash(manifest)||labels.items?.length!==10||new Set(labels.items.map(r=>r.id)).size!==10||!['Fellow','assistant','adjudicated_reference'].includes(labels.rater)||labels.blind_before_model_output!==true)throw Error('A complete independent frozen label receipt is required');
 if(!Number.isFinite(Date.parse(labels.completed_at))||Date.parse(labels.completed_at)<Date.parse(manifest.frozen_at)||Date.parse(labels.completed_at)>=Date.parse(firstCallAt))throw Error('Labels must be completed after input freeze and before the first model call');
 for(const r of labels.items){
  if(manifest.items.find(i=>i.id===r.id)?.input_sha256!==r.input_sha256)throw Error('Label/input hashes differ');
  for(const f of [...MATERIAL_FIELDS,'metric_node','exit_form']){
   const d=r.material?.[f]||r[f];
   if(!['supported','unknown','not_applicable'].includes(d?.state)||d.state==='supported'&&!d.value||d.state!=='supported'&&d.value!==null)throw Error('Complete every field with a consistent state and value');
   if(d.state==='supported'&&f==='metric_node'&&!NODES.includes(d.value)||d.state==='supported'&&f==='exit_form'&&!EXITS.includes(d.value))throw Error('Invalid metric tag');
  }
  if(!['episode','flagged_non_episode','excluded'].includes(r.disposition))throw Error('Record non-episode disposition');
  if(privateSignals(JSON.stringify({material:r.material,node:r.metric_node,exit:r.exit_form,notes:r.notes})).length)throw Error('Label contains a private-data pattern');
 }
 return true;
}

function compareDatum(expected,predicted){
 if(!predicted)return {verdict:'unrun',invented:false,missed:expected.state==='supported'};
 const same=expected.state===predicted.state&&(expected.state!=='supported'||[expected.value,...(expected.accepted_values||[])].some(v=>canonical(v)===canonical(predicted.value)));
 return {verdict:same?'correct':expected.state==='supported'&&predicted.state==='unknown'?'abstained':'wrong',invented:expected.state!=='supported'&&predicted.state==='supported',missed:expected.state==='supported'&&!same};
}
export function scoreSmoke(reference,predictions,{severeReviewComplete=false,semanticReviewComplete=false,severeErrors=0,attempts=[],nonEpisodeReviewComplete=false,nonEpisodeFailures=0,adjudications=[]}={}){
 if(new Set(predictions.map(r=>r.id)).size!==predictions.length||predictions.some(r=>!reference.some(g=>g.id===r.id)))throw Error('Predictions must match unique frozen reference IDs');
 if(new Set(adjudications.map(a=>a.id+'|'+a.field)).size!==adjudications.length)throw Error('Duplicate semantic adjudication');
 for(const a of adjudications)if(!reference.some(g=>g.id===a.id)||![...MATERIAL_FIELDS,'metric_node','exit_form'].includes(a.field)||!['correct','wrong','abstained'].includes(a.verdict)||!['assistant','Fellow'].includes(a.reviewer)||!a.reason?.trim()||privateSignals(a.reason).length)throw Error('Record source-based semantic judgement with reviewer and non-identifying rationale');
 const rows=[];
 for(const g of reference){const p=predictions.find(r=>r.id===g.id);if(p&&p.input_sha256!==g.input_sha256)throw Error('Frozen input hash mismatch');
  for(const f of [...MATERIAL_FIELDS,'metric_node','exit_form']){const e=g.material?.[f]||g[f];if(!e)throw Error('Reference field missing');const pred=p?.material?.[f]||p?.[f],cell=compareDatum(e,pred),a=adjudications.find(a=>a.id===g.id&&a.field===f);if(a){if(!pred||a.verdict==='correct'&&e.state!==pred.state||a.verdict==='abstained'&&!(e.state==='supported'&&pred.state==='unknown'))throw Error('Semantic judgement cannot invent missing output or silently change missingness states');cell.exact_verdict=cell.verdict;cell.verdict=a.verdict;cell.missed=e.state==='supported'&&a.verdict!=='correct';cell.adjudication={reviewer:a.reviewer,reason:a.reason};}rows.push({id:g.id,field:f,metadata:f==='source_family',expected_state:e.state,...cell});}
 }
 const summarize=rs=>({fields:rs.length,correct:rs.filter(r=>r.verdict==='correct').length,wrong:rs.filter(r=>r.verdict==='wrong').length,abstained:rs.filter(r=>r.verdict==='abstained').length,unrun:rs.filter(r=>r.verdict==='unrun').length,invented_value_flags:rs.filter(r=>r.invented).length,missed_explicit:rs.filter(r=>r.missed).length});
 const material=rows.filter(r=>PILOT_FIELDS.includes(r.field)),supported=material.filter(r=>r.expected_state==='supported'),unknown=material.filter(r=>r.expected_state==='unknown');
 const C=supported.filter(r=>r.verdict==='correct').length,K=supported.length,retained=unknown.filter(r=>r.verdict==='correct').length;
 const failures=attempts.filter(a=>!['completed','partial_proposal'].includes(a.processing_status)).length;
 const tagErrors=rows.filter(r=>['metric_node','exit_form'].includes(r.field)&&['wrong','abstained'].includes(r.verdict)).length;
 const complete=reference.length===10&&attempts.length===10&&severeReviewComplete&&semanticReviewComplete&&nonEpisodeReviewComplete;
 const recall=K?C/K:null,unknownRate=unknown.length?retained/unknown.length:null;
 const fails=material.filter(r=>r.verdict!=='correct'),fieldFailures=new Set(fails.map(r=>r.field));
 let decision='incomplete_or_inconclusive';
 if(severeErrors>0||semanticReviewComplete&&predictions.length>0&&recall!==null&&recall<0.5)decision='simplify_and_report';
 else if(complete&&fails.length>=1&&fails.length<=2&&fieldFailures.size===1&&tagErrors===0&&failures<=1&&nonEpisodeFailures===0)decision='repair_and_rerun_development_reuse';
 else if(complete&&recall>=0.7&&unknownRate>=0.9&&failures<=1&&tagErrors===0&&nonEpisodeFailures===0)decision='scale_bounded_batch';
 else if(complete)decision='hold_scaling_repair_and_report';
 return {kind:'smoke_test_not_accuracy',status:complete?'complete_pending_source_interpretation':'incomplete_or_inconclusive',decision,source_text:{...summarize(material),K,C,W:supported.filter(r=>r.verdict==='wrong').length,A:supported.filter(r=>r.verdict==='abstained').length,U:supported.filter(r=>r.verdict==='unrun').length,explicit_field_recall:{numerator:C,denominator:K,value:recall},unknown_retention:{numerator:retained,denominator:unknown.length,value:unknownRate}},provided_metadata:summarize(rows.filter(r=>r.metadata)),metric_tags:Object.fromEntries(['metric_node','exit_form'].map(f=>[f,summarize(rows.filter(r=>r.field===f))])),processing:{attempts:attempts.length,failures,denominator_required:10},severe_errors:severeErrors,semantic_invention_count:severeReviewComplete?'requires_item_level_adjudication':null,items:reference.map(g=>({id:g.id,...summarize(rows.filter(r=>r.id===g.id&&!r.metadata&&PILOT_FIELDS.includes(r.field)))})),rows};
}

export function pairwiseLabels(left,right){
 const rows=[];for(const a of left){const b=right.find(r=>r.id===a.id);if(!b)continue;if(a.input_sha256!==b.input_sha256)throw Error('Pairwise inputs differ');for(const f of [...MATERIAL_FIELDS,'metric_node','exit_form']){const e=a.material?.[f]||a[f],p=b.material?.[f]||b[f];if(e&&p)rows.push({id:a.id,field:f,exact_agreement:compareDatum(e,p).verdict==='correct'});}}
 return {comparable:rows.length,exact_agreement:rows.filter(r=>r.exact_agreement).length,disagreements:rows.filter(r=>!r.exact_agreement),note:'Exact label agreement is not accuracy. Source-adjudicate semantic differences; do not majority-vote ground truth.'};
}

export function freeCapacity(usage,{dailyTokenBudget=180000,dailyRequests=1000,tpm=8000,rpm=30,availableSeconds=86400}={}){
 const measured=usage.filter(r=>r.processing_status==='completed'&&Number.isInteger(r.prompt_tokens)&&Number.isInteger(r.completion_tokens)&&Number.isFinite(r.latency_ms));
 if(!measured.length)return {status:'unmeasured',items_per_available_window:null};
 const totals=measured.map(r=>r.prompt_tokens+r.completion_tokens),t=Math.max(...totals);if(t<=0)return {status:'invalid_usage',items_per_available_window:null};
 const s=Math.max(65,...measured.map(r=>r.latency_ms/1000),60*t/tpm);
 const bounds={requests:dailyRequests,daily_tokens:Math.floor(dailyTokenBudget/t),window_tokens:Math.floor(tpm*availableSeconds/60/t),window_requests:Math.floor(rpm*availableSeconds/60),serial_time:Math.floor(availableSeconds/s)};
 return {status:'conditional_projection_not_sla',measured_calls:measured.length,worst_observed_tokens_per_item:t,mean_observed_tokens_per_item:totals.reduce((n,x)=>n+x,0)/measured.length,seconds_per_item_floor:s,available_seconds:availableSeconds,bounds,items_per_available_window:Math.min(...Object.values(bounds)),note:'Assumes supplied remaining quota and no competing organisation usage; deduct failures/reservations. One call does not establish length variation. Check any single-request minute-limit rejection separately.'};
}
