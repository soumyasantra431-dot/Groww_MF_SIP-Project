import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { resolve,join } from 'node:path';
import { randomUUID } from 'node:crypto';
export function openStore(dir=process.env.SIP_DATA_DIR||resolve('.local')){
 mkdirSync(dir,{recursive:true});const db=new DatabaseSync(join(dir,'workspace.sqlite'));
 db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS items(id TEXT PRIMARY KEY,source_family TEXT NOT NULL,url TEXT NOT NULL,date TEXT,raw_file TEXT,row_index INTEGER,platform_hint TEXT,tier_a TEXT,tier_b TEXT,review_state TEXT NOT NULL DEFAULT 'unreviewed',hypothesis TEXT NOT NULL DEFAULT '',terms_status TEXT NOT NULL DEFAULT 'pending',origin TEXT NOT NULL DEFAULT 'corpus',revision INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,item_id TEXT,tier TEXT,state TEXT,attempts INTEGER DEFAULT 0,error TEXT,created_at TEXT,model TEXT);
 CREATE TABLE IF NOT EXISTS spend(id TEXT PRIMARY KEY,state TEXT,reserved REAL,actual REAL,input_tokens INTEGER,output_tokens INTEGER,created_at TEXT);
 CREATE TABLE IF NOT EXISTS corrections(id TEXT PRIMARY KEY,item_id TEXT,old_value TEXT,new_value TEXT,reason TEXT,actor TEXT,created_at TEXT);
 CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value TEXT);
 CREATE TABLE IF NOT EXISTS request_limits(key TEXT PRIMARY KEY,count INTEGER);
 `);
 if(!db.prepare('PRAGMA table_info(items)').all().some(c=>c.name==='source_locator'))db.exec("ALTER TABLE items ADD COLUMN source_locator TEXT NOT NULL DEFAULT ''");
 for(const [name,defaultValue] of [['evidence_lane','unknown'],['independence_group',''],['copy_key','']])if(!db.prepare('PRAGMA table_info(items)').all().some(c=>c.name===name))db.exec(`ALTER TABLE items ADD COLUMN ${name} TEXT NOT NULL DEFAULT '${defaultValue}'`);
 if(!db.prepare('PRAGMA table_info(items)').all().some(c=>c.name==='coding_origin'))db.exec("ALTER TABLE items ADD COLUMN coding_origin TEXT NOT NULL DEFAULT 'unknown'");
 if(!db.prepare('PRAGMA table_info(items)').all().some(c=>c.name==='local_use_status'))db.exec("ALTER TABLE items ADD COLUMN local_use_status TEXT NOT NULL DEFAULT 'pending'");
 for(const [name,type,defaultValue] of [['billing_mode','TEXT',"'paid'"],['reserved_tokens','INTEGER','0']])if(!db.prepare('PRAGMA table_info(spend)').all().some(c=>c.name===name))db.exec(`ALTER TABLE spend ADD COLUMN ${name} ${type} NOT NULL DEFAULT ${defaultValue}`);
 db.exec('CREATE TABLE IF NOT EXISTS collection_runs(id TEXT PRIMARY KEY,created_at TEXT,source_family TEXT,query TEXT,route TEXT,state TEXT,counts TEXT,permission_basis TEXT)');
 db.exec('CREATE TABLE IF NOT EXISTS question_answers(question_id TEXT PRIMARY KEY,payload TEXT NOT NULL,source_revisions TEXT NOT NULL,approved_at TEXT NOT NULL)');
 return {
 db,dir,
 items(){return db.prepare('SELECT * FROM items ORDER BY id').all().map(({raw_file,row_index,platform_hint,...r})=>({...r,tier_a:r.tier_a?JSON.parse(r.tier_a):null,tier_b:r.tier_b?JSON.parse(r.tier_b):null}));},
 item(id){return db.prepare('SELECT * FROM items WHERE id=?').get(id);},
 insert(r){db.prepare('INSERT INTO items(id,source_family,url,date,raw_file,row_index,platform_hint,terms_status,origin,hypothesis,source_locator,evidence_lane,independence_group,copy_key) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(r.id||randomUUID(),r.source_family,r.url,r.date||null,r.raw_file||null,r.row_index??null,r.platform_stated||null,r.terms_status||'pending',r.origin||'corpus',r.hypothesis||'',r.source_locator||'',r.evidence_lane||'unknown',r.independence_group||'',r.copy_key||'');},
 setResult(id,tier,result,codingOrigin=null){if(!['a','b'].includes(tier))throw Error('Invalid tier');db.prepare(`UPDATE items SET tier_${tier}=?,review_state='proposal',coding_origin=COALESCE(?,coding_origin),revision=revision+1 WHERE id=?`).run(JSON.stringify(result),codingOrigin,id);},
 meta(key,value){if(value!==undefined)db.prepare('INSERT INTO meta(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,JSON.stringify(value));const r=db.prepare('SELECT value FROM meta WHERE key=?').get(key);return r?JSON.parse(r.value):null;},
 reserve(max,cap,calls,limits={}){db.exec('BEGIN IMMEDIATE');try{if(!Number.isFinite(max)||max<=0||!Number.isFinite(cap)||cap<=0||!Number.isFinite(calls)||calls<1)throw Error('Invalid budget limits');const now=new Date().toISOString();const row=db.prepare("SELECT COALESCE(SUM(CASE WHEN state='settled' THEN actual ELSE reserved END),0) AS spent,COUNT(*) AS calls FROM spend").get();const daily=db.prepare("SELECT COALESCE(SUM(CASE WHEN state='settled' THEN actual ELSE reserved END),0) AS spent FROM spend WHERE created_at>=?").get(now.slice(0,10)+'T00:00:00.000Z');if(row.spent+max>cap||row.calls>=calls||limits.dailyCap!==undefined&&(!Number.isFinite(limits.dailyCap)||limits.dailyCap<=0||daily.spent+max>limits.dailyCap))throw Error('Approved spend/call or daily cap would be exceeded');const id=randomUUID();db.prepare("INSERT INTO spend(id,state,reserved,created_at) VALUES(?,'reserved',?,?)").run(id,max,now);db.exec('COMMIT');return id;}catch(e){db.exec('ROLLBACK');throw e;}},
 settle(id,actual,usage){db.prepare("UPDATE spend SET state='settled',actual=?,input_tokens=?,output_tokens=? WHERE id=?").run(actual,usage.prompt_tokens,usage.completion_tokens,id);},
 reserveFree(tokens,dailyTokens,calls,intervalSeconds=65){db.exec('BEGIN IMMEDIATE');try{
  if(!Number.isInteger(tokens)||tokens<=0||!Number.isFinite(dailyTokens)||dailyTokens<=0||!Number.isFinite(calls)||calls<1||!Number.isFinite(intervalSeconds)||intervalSeconds<0)throw Error('Invalid free-tier limits');
  const now=new Date(),date=now.toISOString(),start=date.slice(0,10)+'T00:00:00.000Z';
  const last=db.prepare("SELECT created_at FROM spend WHERE billing_mode='free' ORDER BY created_at DESC LIMIT 1").get();
  if(last&&now.getTime()-Date.parse(last.created_at)<intervalSeconds*1000){const e=Error('Free-tier pacing: resume after '+new Date(Date.parse(last.created_at)+intervalSeconds*1000).toISOString());e.code='FREE_PACING';throw e;}
  const used=db.prepare("SELECT COALESCE(SUM(CASE WHEN state='settled' THEN input_tokens+output_tokens ELSE reserved_tokens END),0) AS tokens,COUNT(*) AS calls FROM spend WHERE billing_mode='free' AND created_at>=?").get(start);
  const total=db.prepare("SELECT COUNT(*) AS calls FROM spend WHERE billing_mode='free'").get();
  if(used.tokens+tokens>dailyTokens||total.calls>=calls)throw Error('Free-tier token/call envelope reached; wait for quota reset or review the pilot call limit, no paid fallback');
  const id=randomUUID();db.prepare("INSERT INTO spend(id,state,reserved,created_at,billing_mode,reserved_tokens) VALUES(?,'reserved',0,?,'free',?)").run(id,date,tokens);db.exec('COMMIT');return id;
 }catch(e){db.exec('ROLLBACK');throw e;}},
 spend(){return db.prepare("SELECT COUNT(*) AS calls,COALESCE(SUM(CASE WHEN state='settled' THEN actual ELSE reserved END),0) AS committed_usd,COALESCE(SUM(CASE WHEN state='reserved' THEN 1 ELSE 0 END),0) AS unreconciled FROM spend").get();},
 logCollection(r){const id=randomUUID();db.prepare('INSERT INTO collection_runs(id,created_at,source_family,query,route,state,counts,permission_basis) VALUES(?,?,?,?,?,?,?,?)').run(id,new Date().toISOString(),r.source_family,r.query,r.route,r.state,JSON.stringify(r.counts||{}),r.permission_basis||'unreviewed');return id;},
 limit(key,cap){db.exec('BEGIN IMMEDIATE');try{const n=db.prepare('SELECT count FROM request_limits WHERE key=?').get(key)?.count||0;if(n>=cap)throw Error('Hourly request cap reached');db.prepare('INSERT INTO request_limits(key,count) VALUES(?,1) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}},
 close(){db.close();}
 };
}
