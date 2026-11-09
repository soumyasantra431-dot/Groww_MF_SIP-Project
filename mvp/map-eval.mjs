import {readFileSync} from 'node:fs';
import {MAP_FIELDS} from './continuity-map.mjs';

const keys=Object.keys(MAP_FIELDS);
function load(path){const x=JSON.parse(readFileSync(path,'utf8'));if(!Array.isArray(x))throw Error('Expected an array of cases');return x;}
export function scoreMap(reference,predictions){
 if(reference.length<20||new Set(reference.map(x=>x.id)).size!==reference.length)throw Error('Freeze at least 20 distinct real-item IDs');
 if(reference.some(x=>x.human_labelled!==true||keys.some(k=>!MAP_FIELDS[k].includes(x.expected?.[k]))))throw Error('Each case needs six independent human labels');
 const byId=new Map(predictions.map(x=>[x.id,x]));
 const tally={correct_explicit:0,correct_unknown:0,wrong:0,missed:0,invented:0,processing_failure:0};
 const fieldCoverage=Object.fromEntries(keys.map(k=>[k,0]));
 let explicitTotal=0,unknownTotal=0,failures=0,severe=0,adjudicated=true;
 const items=[];
 for(const r of reference){
  const p=byId.get(r.id),failed=!p||p.processing_failure===true||p.model_used!==true;
  if(failed)failures++;if(!p||p.human_adjudicated!==true)adjudicated=false;if(p?.severe_error===true)severe++;
  const item={id:r.id,fields:{},severe:p?.severe_error===true,processing_failure:failed};
  for(const k of keys){
   const expected=r.expected[k],predicted=p?.fields?.[k];
   if(expected==='unknown')unknownTotal++;else {explicitTotal++;fieldCoverage[k]++;}
   let outcome;
   if(failed||!MAP_FIELDS[k].includes(predicted))outcome='processing_failure';
   else if(expected==='unknown'&&predicted==='unknown')outcome='correct_unknown';
   else if(expected==='unknown')outcome='invented';
   else if(predicted==='unknown')outcome='missed';
   else if(predicted===expected)outcome='correct_explicit';
   else outcome='wrong';
   tally[outcome]++;item.fields[k]=outcome;
  }items.push(item);
 }
 const accounted=Object.values(tally).reduce((a,b)=>a+b,0)===reference.length*keys.length;
 const gates={complete:adjudicated&&accounted&&explicitTotal>0&&unknownTotal>0&&Object.values(fieldCoverage).every(n=>n>0),explicit_recall:tally.correct_explicit/explicitTotal>=.7,unknown_preservation:tally.correct_unknown/unknownTotal>=.9,severe_errors:severe===0,processing_failures:failures*10<=reference.length};
 return {items:reference.length,fields_per_item:keys.length,field_count:reference.length*keys.length,tally,explicit:{correct:tally.correct_explicit,denominator:explicitTotal},unknown:{preserved:tally.correct_unknown,denominator:unknownTotal},field_coverage:fieldCoverage,severe_items:severe,processing_failures:failures,gates,pass:Object.values(gates).every(Boolean),item_results:items};
}
if(process.argv[1]&&new URL(import.meta.url).pathname.toLowerCase().endsWith(process.argv[1].replaceAll('\\','/').toLowerCase())){
 if(process.argv.length!==4)throw Error('Usage: node mvp/map-eval.mjs <local-reference.json> <local-predictions.json>');
 console.log(JSON.stringify(scoreMap(load(process.argv[2]),load(process.argv[3])),null,2));
}
