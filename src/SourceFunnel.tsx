import React,{useState} from 'react';
import './source-funnel.css';

export function SourceFunnel({ledger}:{ledger:any}){
 const [status,setStatus]=useState('all');
 if(!ledger)return <section className="panel"><h3>Source accounting unavailable</h3><p>The local ledger has not been reconciled.</p></section>;
 const c=ledger.counts,visible=ledger.entries.filter((e:any)=>status==='all'||e.status===status);
 return <section className="panel source-funnel" aria-label="Source intake ledger">
  <p className="eyebrow">SOURCE INTAKE / RECONCILED UNITS</p>
  <h2>Which accounts can the engine examine?</h2>
  <p>Each row is a source-screen decision or a stored input, not one investor. Some older inputs share a locator and cannot yet be treated as distinct posts. “Admitted” means the text can be assessed locally; it does not mean an AI label or PM finding has been verified.</p>
  <div className="source-funnel-stats">
   {(['all','admitted','pending','rejected'] as const).map(s=><button key={s} className={status===s?'selected':''} onClick={()=>setStatus(s)} aria-pressed={status===s}><strong>{s==='all'?c.tracked_decisions:c[s]}</strong><span>{s==='all'?'tracked source decisions':s==='admitted'?'local use admitted':s==='pending'?'source/use screen pending':'excluded from corpus'}</span></button>)}
  </div>
  <p className="source-equation">{ledger.formulas[0]}. {c.stored_items} stored inputs and {c.rejected} excluded source locators are shown separately; no excluded body is stored.</p>
  <div className="source-split">
   <div><strong>{c.selected_run_screened} source decisions screened</strong><span>{c.screened_local_admitted} admitted for local assessment + {c.selected_run_pending} pending + {c.selected_run_rejected} excluded. Duplicate attempts in the original Phase 1 run: {c.selected_run_duplicates??'unknown'}.</span></div>
   <div><strong>{c.screened_relevance_candidates} MF-SIP candidates</strong><span>Provisional source screen: {c.screened_fit.direct} direct Groww target + {c.screened_fit.adjacent} adjacent + {c.screened_fit.unknown} unknown fit. This is not an AI result.</span></div>
   <div><strong>{c.accepted_findings} accepted local findings</strong><span>Admitted inputs still need source-based coding and review. Public use requires a separate decision. One thread can contain several posts.</span></div>
  </div>
  <p className="small">Stored evidence lanes: {c.stored_evidence_lanes.user_voice} user-voice + {c.stored_evidence_lanes.context} context + {c.stored_evidence_lanes.control} controls + {c.stored_evidence_lanes.unknown} unresolved = {c.stored_items} items. Among admitted decisions: {c.distinct_admitted_source_items} source units, {c.distinct_admitted_source_roots} thread or review roots. {c.source_unit_conflict_rows} older inputs share {c.source_unit_conflict_groups} unresolved source locators; they stay pending. {c.copy_review_groups} possible cross-site copy groups need review.</p>
  <details><summary>Counting and duplicate rules</summary><p>{ledger.limits}</p>{ledger.unit_conflicts.map((g:any)=><p key={g.source_item_id}>{g.item_ids.length} inputs at one locator: {g.decision}</p>)}{ledger.copy_candidates.length?<ul>{ledger.copy_candidates.map((g:any,i:number)=><li key={i}>{g.item_ids.length} stored items: {g.decision}</li>)}</ul>:<p>No exact long-text cross-site copy candidate is flagged in the current stored corpus. This does not rule out paraphrased reposts.</p>}<p>{ledger.formulas[1]}. {ledger.formulas[2]}.</p></details>
  <h3>{status==='all'?'All tracked source decisions':`${status[0].toUpperCase()+status.slice(1)} source decisions`} · {visible.length}</h3>
  <div className="tablewrap"><table><caption>Open the original behind each count. Relevance and fit are provisional; no authors or source text are shown.</caption><thead><tr><th>Source</th><th>Disposition</th><th>Scope screen</th><th>Source unit and dependency root</th><th>Review</th></tr></thead><tbody>{visible.map((e:any)=><tr key={e.source_item_id+'|'+(e.item_id||'excluded')}><td><a href={e.url} target="_blank" rel="noreferrer">{e.source_family} · {e.source_locator||'open source'} ↗</a><br/><span className="small">{e.date||'Date unknown'}</span></td><td><strong>{e.status}</strong><br/><span className="small">{e.reason}</span></td><td>{e.relevance==='mf_sip_candidate_unreviewed'?'MF-SIP candidate · unreviewed':e.relevance==='not_mf_sip'?'Not MF-SIP':e.relevance==='mixed_instrument_review'?'Mixed instrument · review needed':'Not assessed'}<br/><span className="small">{e.target_fit.replaceAll('_',' ')}</span></td><td><code>{e.source_item_id}</code><br/><span className="small">Root: {e.source_root_id}</span>{e.source_unit_conflict&&<p className="warning">Repeated historical locator · distinct post unknown</p>}{e.copy_review_pending&&<p className="warning">Possible copied account · review dependency</p>}</td><td>{e.review_state.replaceAll('_',' ')}<br/><span className="small">{e.speaker_position.replaceAll('_',' ')}</span></td></tr>)}</tbody></table></div>
 </section>;
}
