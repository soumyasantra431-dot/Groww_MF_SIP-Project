// Local preparation only: no API calls, crawling or publication.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {prepareSmokePack,hash} from '../engine/smoke-pilot.mjs';

const [file,version,...flags]=process.argv.slice(2);
if(!file||!/^v\d+$/.test(version||''))throw Error('Usage: node scripts/prepare-smoke-pack.mjs <local-admitted-input.json> <v1> [--public-only-fallback]');
if(flags.some(f=>f!=='--public-only-fallback'))throw Error('Unknown preparation option');
const protocolPath=resolve('research/pilot_smoke_2026-11-01/PRE_REGISTRATION.md');
const registrationDir=resolve('research/pilot_smoke_2026-11-01');
const activePath=join(registrationDir,'ACTIVE_PROTOCOL.json');
const active=existsSync(activePath)?JSON.parse(readFileSync(activePath,'utf8')):{lock_file:'PROTOCOL_LOCK.json'};
if(!/^PROTOCOL_LOCK(?:_v\d+)?\.json$/.test(active.lock_file))throw Error('Invalid registration pointer');
const lock=JSON.parse(readFileSync(join(registrationDir,active.lock_file),'utf8'));
const protocol=readFileSync(protocolPath,'utf8');if(hash(protocol)!==lock.protocol_sha256)throw Error('Protocol changed after registration; version it explicitly before input freeze');
for(const [name,digest]of Object.entries(lock.engine_sha256||{}))if(hash(readFileSync(resolve(name),'utf8'))!==digest)throw Error('Engine or scoring rules changed; register a new version before freezing inputs');
for(const [name,digest]of Object.entries(lock.addendum_sha256||{}))if(hash(readFileSync(resolve(name),'utf8'))!==digest)throw Error('Registered addendum changed; version it explicitly');
// Fellow supplies only already de-identified input; this tool never writes rejected content.
const source=JSON.parse(readFileSync(resolve(file),'utf8'));
const prepared=prepareSmokePack(source.items,source.terms,{protocolHash:hash(protocol),fallbackPublicOnly:flags.includes('--public-only-fallback')});
prepared.manifest.engine_sha256=lock.engine_sha256;prepared.manifest.model_configuration=lock.model_configuration;prepared.fellow_labels.manifest_sha256=hash(prepared.manifest);
prepared.manifest.registration_version=lock.version;prepared.manifest.addendum_sha256=lock.addendum_sha256||{};prepared.fellow_labels.manifest_sha256=hash(prepared.manifest);
const root=resolve('.local/smoke-pilot');mkdirSync(root,{recursive:true});
const out=join(root,version);if(existsSync(out))throw Error('Frozen version exists; never overwrite it');mkdirSync(out);
const save=(name,value)=>writeFileSync(join(out,name),JSON.stringify(value,null,2),{flag:'wx'});
save('manifest.json',prepared.manifest);save('inputs.json',prepared.inputs);save('fellow-labels.json',prepared.fellow_labels);
const lines=['# Blinded input pack — '+version,'','Label independently before any model output. Assistant labels and per-item selection expectations are withheld. Do not infer platform from the URL or treat public wording as verified transactions. Complete fellow-labels.json, or return answers with the same IDs and field names.','','For each field: supported (state the short meaning), unknown (not stated/ambiguous), or not applicable (explain why). Never enter identifiers or exact amounts.'];
for(const r of prepared.inputs)lines.push('','## '+r.id,'','Source family: '+r.source_family,'Source URL: '+(r.url||'local de-identified survey snapshot'),'Publication date: '+(r.date||'unknown exact day'),'Source locator: '+r.source_locator,'Input hash: '+r.input_sha256,'','Frozen source text:','',r.text,'','Label: platform; instrument; journey stage; action status; trigger; reported reason; whom the writer blames; outcome; continuer; source family; initiating metric node; initiating exit form; episode/flagged non-episode/excluded.');
writeFileSync(join(out,'FELLOW_PACK.md'),lines.join('\n'),{flag:'wx'});
console.log(JSON.stringify({frozen_version:version,counts:prepared.manifest.counts,model_calls:0,pack:join(out,'FELLOW_PACK.md'),note:'Input files and labels remain local/gitignored. No model runner is activated.'},null,2));
