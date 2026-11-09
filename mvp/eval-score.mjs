import {readFileSync} from 'node:fs';
import {states} from './payment-state.mjs';

function read(path){const value=JSON.parse(readFileSync(path,'utf8'));if(!Array.isArray(value))throw Error('Expected an array');return value;}
export function score(reference,predictions){
 const valid=new Set(states),byId=new Map(predictions.map(x=>[x.id,x]));
 if(reference.length<20||new Set(reference.map(x=>x.id)).size!==reference.length)throw Error('Freeze at least 20 distinct human-labelled items');
 if(reference.some(x=>!x.human_labelled||!valid.has(x.expected_state)))throw Error('Every expected state needs an independent human label');
 const rows=reference.map(r=>{const p=byId.get(r.id);if(!p)return {id:r.id,result:'processing_failure',expected:r.expected_state,predicted:null,severe:false,invented_fields:0,missed_fields:0,adjudicated:false};
  const extras={invented_fields:Number(p.invented_fields||0),missed_fields:Number(p.missed_fields||0),adjudicated:p.human_adjudicated===true};
  if(p.severe_error===true)return {id:r.id,result:'severe',expected:r.expected_state,predicted:p.reported_state,severe:true,...extras};
  if(p.processing_failure===true||!valid.has(p.reported_state))return {id:r.id,result:'processing_failure',expected:r.expected_state,predicted:null,severe:false,...extras};
  const result=p.reported_state===r.expected_state?'correct':p.reported_state==='unknown'?'abstained':'wrong';
  return {id:r.id,result,expected:r.expected_state,predicted:p.reported_state,severe:false,...extras};});
 const explicit=rows.filter(x=>x.expected!=='unknown'),unknown=rows.filter(x=>x.expected==='unknown');
 const explicitCorrect=explicit.filter(x=>x.result==='correct').length,unknownPreserved=unknown.filter(x=>x.result==='correct').length;
 const severe=rows.filter(x=>x.severe).length,failures=rows.filter(x=>x.result==='processing_failure').length;
 const counts={...Object.fromEntries(['correct','wrong','abstained','severe','processing_failure'].map(k=>[k,rows.filter(x=>x.result===k).length])),invented_fields:rows.reduce((n,x)=>n+x.invented_fields,0),missed_fields:rows.reduce((n,x)=>n+x.missed_fields,0)};
 const gates={complete:rows.length>=20&&explicit.length>0&&unknown.length>0&&rows.every(x=>x.adjudicated),explicit_recall:explicit.length>0&&explicitCorrect/explicit.length>=.7,unknown_preservation:unknown.length>0&&unknownPreserved/unknown.length>=.9,severe_errors:severe===0,processing_failures:failures*10<=rows.length};
 return {items:rows.length,counts,explicit:{correct:explicitCorrect,denominator:explicit.length},unknown:{preserved:unknownPreserved,denominator:unknown.length},gates,pass:Object.values(gates).every(Boolean),rows};
}
if(process.argv[1]&&new URL(import.meta.url).pathname.toLowerCase().endsWith(process.argv[1].replaceAll('\\','/').toLowerCase())){
 if(process.argv.length!==4)throw Error('Usage: node mvp/eval-score.mjs <local-human-labels.json> <local-model-predictions.json>');
 console.log(JSON.stringify(score(read(process.argv[2]),read(process.argv[3])),null,2));
}
