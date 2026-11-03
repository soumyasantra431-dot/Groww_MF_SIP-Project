import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { openStore } from '../engine/store.mjs';
import { importManualReview } from '../engine/manual-review.mjs';
const file=process.argv[2];
if(!file||!resolve(file).startsWith(resolve('.local')+'\\'))throw Error('Pass a JSON source-review spec inside ignored .local');
const store=openStore();
try{console.log(JSON.stringify(importManualReview(store,JSON.parse(readFileSync(file,'utf8'))),null,2));}
finally{store.close();}
