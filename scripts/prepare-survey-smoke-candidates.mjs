// Uses the already-authorised local survey snapshot. No network, model call or publication.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'csv-parse/sync';
import {privateSignals} from '../engine/contracts.mjs';
import {validatePilotConsent,hash,strictMatch} from '../engine/smoke-pilot.mjs';

const file='research/private/survey_coded_2026-10-29.json';
const source=fs.readFileSync(file,'utf8'),rows=JSON.parse(source);
assert.equal(rows.length,7,'Use the historical seven-response snapshot explicitly');
const headers=parse(fs.readFileSync('research/private/survey_raw_2026-10-29.csv','utf8'),{bom:true,skip_empty_lines:true})[0];
assert.equal(headers.length,18);
const selected=rows.filter(r=>r.analysis_disposition==='usable_for_limited_descriptive_analysis');
assert.deepEqual(selected.map(r=>r.id),['S01','S02','S03']);
const permission={affirmative:true,external_ai_processing:true,basis:'fellow_attestation',date:null,confirmed_on:'2026-11-01'};
validatePilotConsent(permission);
const terms=[{id:'survey_fellow_confirmation_2026-11-01',checked_on:'2026-11-01',collection_allowed:true,model_processing_allowed:true,public_raw_text_allowed:false,basis:'Fellow confirms respondents permit de-identified AI analysis and authorises any three. Participant receipts and individual consent dates not independently verified.'}];
const items=selected.map((r,i)=>{
 assert.equal(r.answers.Q0,'Yes','Respect the original combined age/participation gate');
 const text=['[participant]','De-identified written survey response. [NO ANSWER RECORDED] means the source field was blank, not an investor statement.',...Array.from({length:17},(_,q)=>'Question: '+headers[q+1]+'\nAnswer: '+(r.answers['Q'+q]||'[NO ANSWER RECORDED]'))].join('\n\n');
 if(privateSignals(text).length||/\b[A-Z]{4}0[A-Z0-9]{6}\b|[a-z0-9._+-]+@[a-z0-9.-]+|(?:₹|\brs\.?\s*|\binr\s*)\d|\d[\d,.]*\s*(?:lakh|crore|rupees)/i.test(text))throw Error('Privacy review required; do not write contaminated input');
 // These three entire answer sets have additionally been manually inspected. No names,
 // employer/location details, contacts, exact personal amounts or financial identifiers present.
 const eligibility={first_time_mf:r.answers.Q2==='No'?'yes':r.answers.Q2==='Yes'?'no':'unknown',first_sip_on_groww:r.answers.Q4==='Groww'?'yes':['INDmoney','Zerodha Coin','Directly with a mutual fund company'].includes(r.answers.Q4)?'no':'unknown',within_first_12_months:['Within the last 3 months','4–6 months ago','7–12 months ago'].includes(r.answers.Q3)?'yes':r.answers.Q3==='More than 18 months ago'?'no':'unknown'};
 return {id:'P'+String(i+1).padStart(2,'0'),source_family:'Other',url:null,source_locator:'local-survey-snapshot-2026-10-29/'+r.id,date:null,text,origin:'consented_first_hand',participant_id:'R'+String(i+1).padStart(2,'0'),consent:{...permission},terms_id:terms[0].id,eligibility,privacy_review:'manually_checked_deidentified',redaction_categories:['submission_timestamp_omitted','no_identifiers_present_in_selected_answers'],coverage:r.id==='S01'?['continuer']:r.id==='S02'?['ambiguous_ending']:['adjacent_platform'],language:'English',negation:Object.values(r.answers).some(v=>/^No(?:\b|[.!])/.test(v)),speaker_roles:['participant'],dependency_root:'survey-local-record-'+r.id};
});
assert.equal(items.length,3);assert.equal(new Set(items.map(r=>r.dependency_root)).size,3);
const out=path.resolve('.local/smoke-pilot/candidates');fs.mkdirSync(out,{recursive:true});
const payload={schema:'sip-smoke-candidates-v2',source_snapshot:'2026-10-29 seven-response export',source_sha256:hash(source),permission_basis:'fellow_attestation_2026-11-01',identities_verified:false,id_note:'R01-R03 are pilot-local response aliases for this selection, not a claimed match to any existing Fellow identity key. Source locators retain historical S-ordinals without timestamps.',input_set_frozen:false,human_labels_completed:0,model_calls:0,terms,items};
fs.writeFileSync(path.join(out,'first-hand-candidates.json'),JSON.stringify(payload,null,2));
const audit={snapshot_records:7,selected_records:3,selected_local_source_ids:selected.map(r=>r.id),not_selected:{non_starter_screening:2,combined_age_participation_gate_no:1,genuine_but_narrative_uninterpretable:1},equation:'7 response records = 3 selected + 2 non-starter + 1 combined gate not passed + 1 genuine but uninterpretable narrative',strict_match_proposals:{direct:items.filter(r=>strictMatch(r.eligibility)==='direct').length,adjacent:items.filter(r=>strictMatch(r.eligibility)==='adjacent').length,unknown:items.filter(r=>strictMatch(r.eligibility)==='unknown').length,denominator:3,limitation:'Self-report and first-attempt timing; not a verified NSM-entry cohort. No independently verified identities or financial events.'},model_calls:0,permission_basis:'Fellow attestation; individual dates unknown',limitations:['Older seven-response snapshot; later eighth submission unreviewed','Written responses, not interviews','Previously assistant-reviewed; not a fresh holdout','Different-from-expected is not a confirmed failed debit, pause or cancellation','No usable reconstructed interruption sequence among the selected records','No month-12 outcome can be established','Selected three do not cover every requested pilot stratum']};
fs.writeFileSync(path.join(out,'assistant-selection-audit.json'),JSON.stringify(audit,null,2));
const inputPreview=['# Three survey input candidates — local only','','These are candidate source texts, not the frozen ten-item labelling pack. No expected labels or assistant interpretations are included. Do not label yet; the full ten-input set will be frozen first.','Permission basis: Fellow confirmation on 1 November 2026. Individual participant consent dates unknown. These are written survey responses, not interviews.'];
for(const r of items)inputPreview.push('','## '+r.id,'','Source: de-identified survey response; submission date omitted.','',r.text);
fs.writeFileSync(path.join(out,'FIRST_HAND_INPUT_PREVIEW.md'),inputPreview.join('\n'));
console.log(JSON.stringify({selected_records:items.length,source_snapshot_records:rows.length,permission_basis:'Fellow confirmation',privacy_review:'passed for selected texts',frozen_ten_item_set:false,human_labels_completed:0,model_calls:0},null,2));
