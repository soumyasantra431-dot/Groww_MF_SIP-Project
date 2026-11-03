import React from 'react';

export function WorkflowGuide({data,onNavigate}:{data:any,onNavigate:(tab:string)=>void}){
 const plan=data.research_plan,flow=plan?.workflow;
 if(!flow)return <p>The workflow description is unavailable in this snapshot. Open the evidence and quality views for its actual coverage.</p>;
 return <section className="workflow-guide" aria-label="Discovery engine purpose and workflow">
  <p className="eyebrow">START HERE / PURPOSE AND CURRENT STATE</p>
  <h2>Find a situation worth investigating.<br/>See the evidence behind it.</h2>
  <p>{flow.purpose}</p><p>{flow.boundary}</p>
  <div className="workflow-status"><strong>{data.rollup.coded===0?'Preparation stage — no engine findings yet':'Extraction proposals — review before drawing conclusions'}</strong><p>This view contains {data.rollup.total} inputs: {data.rollup.source_lanes.user_voice} user-voice records, {data.rollup.source_lanes.context} context documents, {data.rollup.source_lanes.control} controls and {data.rollup.source_lanes.unknown} with unresolved provenance. {data.rollup.coded} have a classification. These are records, not verified investors.</p><p>Narrative answers: {plan.narrative_status}.</p>{data.mode==='local'&&<p>Local request ledger: {data.spend.calls} reservations/attempts; ${data.spend.committed_usd} recorded monetary spend. Attempts are not successful results. Free service limits still apply.</p>}</div>
  <h3>How evidence becomes an answer</h3>
  <ol className="workflow-steps">{flow.steps.map(([title,detail]:string[])=> <li key={title}><strong>{title}</strong><p>{detail}</p></li>)}</ol>
  <p className="boundary">{flow.selection}</p>
  <h3>What a useful answer must contain</h3><ol>{flow.answer_order.map((s:string)=><li key={s}>{s}</li>)}</ol>
  <p>This is the answer format, not generated research. The nine-question view currently shows coverage and missing evidence; it does not contain completed narrative answers.</p>
  <div className="buttonrow"><button onClick={()=>onNavigate('Nine questions')}>Open the nine research questions →</button><button onClick={()=>onNavigate('Compare opportunities')}>See the final comparison →</button><button onClick={()=>onNavigate('Evidence')}>Inspect actual records →</button></div>
  <h3>Where the evidence will come from</h3><p>{flow.collection_priority}</p>
  <div className="workflow-sources">{plan.sources.map((s:any)=><details key={s.source_family}><summary>{s.source_family} <span>{s.user_voice_inputs} user-voice inputs · {s.coded_user_voice} eligible coded proposals</span></summary><p><strong>Look for:</strong> {s.seek}</p><p><strong>Collection route:</strong> {s.route}</p><p><strong>Processing:</strong> {s.tier}</p><p><strong>Current limitation:</strong> {s.limit}</p><p>{s.context_or_controls} context/control records, counted separately. Access notes reflect the project register and are not blanket platform permission.</p></details>)}</div>
  <h3>Can we use Excel or Google Sheets?</h3><p>{flow.dataset_rule}</p><p>The working import is CSV with source_family, url, date and text; a stable review/comment locator is strongly preferred. Keep restricted original text in the local ignored folder. A Google Sheet is not connected, and uploading source text there needs its own sharing and source-use check.</p>
  <h3>What happens after discovery?</h3><p>Compare candidate problems and test the strongest rival explanation using appropriate first-hand evidence. Only then choose the segment, moment and customer MVP. This research engine is a separate deliverable from that MVP.</p>
 </section>;
}
