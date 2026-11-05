import React from 'react';
import './workflow.css';

export function WorkflowGuide({data,onNavigate}:{data:any,onNavigate:(tab:string)=>void}){
 const rows=data.rollup?.total??0, voice=(data.research_plan?.sources??[]).reduce((n:number,s:any)=>n+(s.user_voice_inputs??0),0), units=data.readiness?.distinct_user_voice_source_units??0;
 const proposed=data.rollup?.coded??0, approved=data.question_cards?.filter((q:any)=>q.status==='researcher_approved').length??0;
 const families=data.research_plan?.sources??[], max=Math.max(1,...families.map((s:any)=>s.user_voice_inputs??0));
 return <section className="overview" aria-label="Discovery engine overview">
  <div className="overview-counts">
   <div><strong>{rows}</strong><span>stored inputs</span><small>{voice} user-voice rows + {rows-voice} controls</small></div>
   <div><strong>{units}</strong><span>distinct usable sources</span><small>after local source and duplicate checks</small></div>
   <div><strong>{proposed}</strong><span>coding proposals</span><small>need original-source review</small></div>
   <div><strong>{approved}<em> / 9</em></strong><span>approved answers</span><small>no problem selected yet</small></div>
  </div>
  <p className="overview-caution">These are different units, so they are not a conversion funnel or a measure of Groww investors. No live seven-platform scrape is running.</p>
  <div className="overview-main">
   <div className="overview-action"><p className="eyebrow">START HERE</p><h2>Ask what the evidence can say.</h2><p>Choose one of the nine brief questions. See a plain-language reading, original source, rival explanation and what remains unknown.</p><button className="primary" onClick={()=>onNavigate('Nine questions')}>Explore nine questions →</button></div>
   <div className="overview-action"><p className="eyebrow">CURRENT DECISION</p><h2>Where should we investigate next?</h2><p>Sources suggest situations to test. They do not establish a first-year Groww drop-off cause or how common it is.</p><button onClick={()=>onNavigate('Compare opportunities')}>Compare research leads →</button></div>
  </div>
  <section className="source-chart" aria-label="Stored user-voice rows by source family"><div className="chart-title"><div><p className="eyebrow">SOURCE COVERAGE</p><h2>Where current inputs came from</h2></div><strong>{families.filter((s:any)=>s.user_voice_inputs>0).length} of {families.length} families have rows</strong></div>
   {families.map((s:any)=><div className={'source-bar-row '+(s.source_family==='Reddit'?'source-held':'')} key={s.source_family}><span>{s.source_family}{s.source_family==='Reddit'?' · held':''}</span><div className="source-bar-track"><div style={{width:`${100*(s.user_voice_inputs??0)/max}%`}}/></div><b>{s.user_voice_inputs??0}</b></div>)}
   <p className="small">Bars count stored user-voice rows, including restricted Reddit seed rows. A stored row is not a cleared, coded or reviewed finding. Company documents and surveys are separate.</p>
  </section>
  <details className="overview-detail"><summary>How does a post become an answer?</summary><div className="method-grid"><div><b>1. Collect</b><p>Keep a source link and original public text locally.</p></div><div><b>2. Check</b><p>Remove identifiers; mark duplicates, source rights and target fit.</p></div><div><b>3. Interpret</b><p>AI proposes labels. A researcher checks the source. Code counts distinct sources.</p></div><div><b>4. Answer</b><p>Show a bounded reading, source, rival and next question.</p></div></div><p>AI extraction and live classification are held after a failed development quality gate. Working readings are proposals, not approved answers.</p></details>
 </section>;
}
