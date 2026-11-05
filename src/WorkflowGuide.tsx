import React from 'react';
import {labelFor} from './evidence-language';
import './workflow.css';

export function WorkflowGuide({data,onNavigate}:{data:any,onNavigate:(tab:string)=>void}){
 const plan=data.research_plan,flow=plan?.workflow;
 if(!flow)return <p>The research workflow is unavailable in this snapshot.</p>;
 const reviewedTarget=data.items.filter((r:any)=>r.review_state==='accepted'&&r.terms_status==='cleared'&&(r.tier_b?.classification||r.tier_a)?.scope_lane==='target').length;
 const answered=data.question_cards.filter((q:any)=>q.status==='researcher_approved').length;
 const example=data.items.find((r:any)=>r.source_family==='Investing forums'&&r.tier_a?.metric_node==='setup_mandate');
 return <section className="workflow-guide" aria-label="Discovery engine purpose and current result">
  <div className="engine-status" aria-label="Current research result">
   <div><strong>{answered} / 9</strong><span>questions answered with reviewed evidence</span></div>
   <div><strong>{reviewedTarget}</strong><span>reviewed first-year Groww accounts</span></div>
   <div><strong>{data.readiness?.distinct_user_voice_source_units??0}</strong><span>locally permitted source units across {data.readiness?.source_families?.length??0} source {(data.readiness?.source_families?.length??0)===1?'family':'families'}</span></div>
  </div>
  <p className="boundary"><strong>Current result:</strong> {data.rollup?.total??0} stored rows are a seed and testing inventory, not analysed investors. {data.rollup?.coded??0} rows have classification proposals; {data.rollup?.uncoded??0} have no classification. No validated Groww continuation problem has been established.</p>
  <p className="eyebrow">THE RESEARCH JOB</p>
  <h2>Find a first-year SIP situation worth investigating.</h2>
  <p>This engine collects permitted, source-linked accounts of mutual-fund SIP experiences. One LLM proposes what each account says. Code groups duplicates and counts the evidence; a researcher checks the source and decides which findings are usable. The nine answers then show what is supported, challenged or still unknown. This is a research tool, not an investing assistant.</p>
  <p>We are looking for what changes between an investor’s intended next contribution and what actually happens. The engine can suggest a situation for deeper research; it cannot measure Groww’s month-12 retention from public posts or choose the final problem for us.</p>
  <h3>How an answer is made</h3>
  <ol className="workflow-steps">{flow.steps.map(([title,detail]:string[])=><li key={title}><strong>{title}</strong><p>{detail}</p></li>)}</ol>
  {example&&<div className="panel example"><p className="eyebrow">ONE REAL INPUT · UNREVIEWED PROPOSAL</p><h3>See the processing on a source</h3><p>A public forum writer described a mandate-approval problem on another investing platform. The source-linked proposal tags the initiating point as <strong>{labelFor(example.tier_a.metric_node)}</strong> and the form as <strong>{labelFor(example.tier_a.exit_form)}</strong>. Its final payment and month-12 outcome remain unknown.</p><p>This can sharpen a question about setup friction. It cannot become a Groww dropout finding or a count of affected investors.</p><a href={example.url} target="_blank" rel="noreferrer">Read the original forum post ↗</a></div>}
  <div className="buttonrow"><button onClick={()=>onNavigate('Nine questions')}>Read nine working questions →</button><button onClick={()=>onNavigate('Evidence')}>Inspect source and labels →</button><button onClick={()=>onNavigate('Compare opportunities')}>Compare research leads →</button></div>
  <h3>Where the text comes from</h3>
  <p>There is no live seven-platform scrape running. This prototype accepts locally prepared, source-linked CSVs; the optional YouTube collector has not run. Each source must have an actual collection route and use decision. The seven families below are in the research plan, while the counts show what has really reached this workspace.</p>
  <div className="tablewrap"><table><caption>Seven source families named for investigation; stored rows are not analysed findings.</caption><thead><tr><th>Source</th><th>Current access</th><th>Stored user-voice rows</th><th>Reviewed target accounts</th><th>Current route or limit</th></tr></thead><tbody>{plan.sources.map((s:any)=>{const reviewed=data.items.filter((r:any)=>r.source_family===s.source_family&&r.review_state==='accepted'&&r.terms_status==='cleared'&&(r.tier_b?.classification||r.tier_a)?.scope_lane==='target').length;return <tr key={s.source_family}><th>{s.source_family}</th><td>{s.status||'unreviewed'}</td><td>{s.user_voice_inputs}</td><td>{reviewed}</td><td>{s.limit}</td></tr>;})}</tbody></table></div>
  <p className="small">Survey responses are separate first-hand written evidence; expert and company documents are context. Synthetic examples test code and never count as investor evidence. When a source cannot support a question, the answer must say what is unknown and which research method could resolve it.</p>
  <h3>What the finished answer must show</h3>
  <ol>{flow.answer_order.map((s:string)=><li key={s}>{s}</li>)}</ol>
  <p className="boundary">This is the output contract. {data.question_cards.filter((q:any)=>q.working_reading).length} question cards show narrow working readings and four situations can be compared locally. None is a reviewed answer or a selected Groww problem. AI extraction remains held after its development quality check; the current source review is manual and labelled as such.</p>
 </section>;
}
