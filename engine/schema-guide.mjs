// Compact, generated notation for the same local JSON schema. No field removal.
// JSON mode does not enforce this guide: the original Zod schema remains mandatory.
export function schemaGuide(schema){
 const supported=new Set(['$schema','$defs','$ref','type','enum','const','anyOf','properties','required','additionalProperties','items','minItems','maxItems','minLength','maxLength','minimum','maximum']);
 const render=s=>{
  for(const key of Object.keys(s))if(!supported.has(key))throw Error('Unsupported guide keyword: '+key);
  if(s.$ref){if(!s.$ref.startsWith('#/$defs/')||!schema.$defs?.[s.$ref.slice(8)])throw Error('Invalid guide reference');return s.$ref.slice(8);}
  if(s.enum)return s.enum.map(x=>JSON.stringify(x)).join('|');
  if('const' in s)return JSON.stringify(s.const);
  if(s.anyOf)return '('+s.anyOf.map(render).join('|')+')';
  if(s.type==='object'){
   const keys=Object.keys(s.properties||{});
   if(s.additionalProperties!==false||keys.length!==s.required?.length||!keys.every(k=>s.required.includes(k)))throw Error('Guide requires closed objects with every key required');
   return '{'+keys.map(k=>k+':'+render(s.properties[k])).join(',')+'}';
  }
  if(s.type==='array')return 'Array<'+render(s.items)+'>['+(s.minItems??0)+'..'+(s.maxItems??'unbounded')+']';
  if(s.type==='string')return 'string['+(s.minLength??0)+'..'+(s.maxLength??'unbounded')+']';
  if(s.type==='integer'||s.type==='number')return s.type+'['+(s.minimum??'-infinity')+'..'+(s.maximum??'infinity')+']';
  if(s.type==='null'||s.type==='boolean')return s.type;
  throw Error('Unsupported guide type');
 };
 return 'Return a JSON object, not this notation. Every object key is required; no extra keys. | means allowed alternatives; Array<T>[a..b] bounds element count; string[a..b] bounds length; integer[a..b] bounds value. Null is JSON null. Definitions:\n'+Object.entries(schema.$defs||{}).map(([key,value])=>key+'='+render(value)).join('\n')+'\nOUTPUT='+render(schema);
}
