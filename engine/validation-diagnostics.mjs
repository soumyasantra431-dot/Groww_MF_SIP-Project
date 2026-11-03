// Structure diagnostics must never retain received values or provider messages.
// Only paths present in the trusted schema are allowed into a receipt.
export function validationDiagnostics(error,schema){
 const types=new Set(['invalid_type','too_big','too_small','invalid_value','invalid_union','unrecognized_keys','invalid_format','custom']);
 const resolve=s=>s?.$ref?resolve(schema.$defs?.[s.$ref.slice(8)]):s;
 const pathFor=path=>{
  let node=schema;const safe=[];
  for(const part of path||[]){
   node=resolve(node);
   if(node?.type==='object'&&typeof part==='string'&&Object.hasOwn(node.properties||{},part)){safe.push(part);node=node.properties[part];}
   else if(node?.type==='array'&&Number.isInteger(part)&&part>=0){safe.push('[]');node=node.items;}
   else {safe.push('[unrecognised]');break;}
  }
  return safe.join('.')||'$';
 };
 return {stage:'schema',issue_count:error.issues?.length??null,issues:(error.issues||[]).slice(0,20).map(i=>({code:types.has(i.code)?i.code:'other',path:pathFor(i.path)})),details_capped:(error.issues?.length??0)>20};
}
