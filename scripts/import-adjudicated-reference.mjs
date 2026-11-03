import {readFileSync,writeFileSync} from 'node:fs';
import {importAdjudicatedReference} from '../engine/adjudicated-reference.mjs';

const attachment=process.argv[2];
if(!attachment)throw Error('Pass the local pasted-text path; no network or model call is made');
const text=readFileSync(attachment,'utf8'),marker=text.indexOf('```json');
if(marker<0)throw Error('Attachment has no JSON reference block');
const end=text.indexOf('```',marker+7);
const block=end<0?text.slice(marker+7):text.slice(marker+7,end);
const payload=JSON.parse(block.trim());
const base='.local/smoke-pilot/v1/';
const manifest=JSON.parse(readFileSync(base+'manifest.json','utf8'));
const inputs=JSON.parse(readFileSync(base+'inputs.json','utf8'));
const output=importAdjudicatedReference(payload,manifest,inputs);
writeFileSync(base+'post-audit-reference.json',JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({file:base+'post-audit-reference.json',counts:output.counts,independent_blind_reference:output.independent_blind_reference,note:'Original fellow-labels.json was preserved.'}));
