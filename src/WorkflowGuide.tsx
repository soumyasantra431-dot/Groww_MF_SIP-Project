import React from 'react';
import './workflow.css';

const stageNames:Record<string,string>={setup_mandate:'Setting up payment',first_instalment:'First payment',second_instalment:'Second payment',months_3_6:'Months 3–6',months_7_12:'Months 7–12',recovery:'Trying to recover',unknown:'Timing not stated'};
const outcomeNames:Record<string,string>={involuntary:'Payment interrupted',voluntary:'Investor chose to change',passive:'Quiet drift',not_real:'Not a true stop',continuer:'Continued paying',unknown:'Ending not clear'};
function Distribution({title,rows,total}:{title:string,rows:{name:string,count:number}[],total:number}){
 return <div className="distribution"><h3>{title}</h3>{rows.filter(r=>r.count>0).map(r=><div className="distribution-row" key={r.name}><span>{r.name}</span><div className="distribution-track"><i style={{width:`${total?100*r.count/total:0}%`}}/></div><b>{r.count}</b></div>)}</div>;
}
export function WorkflowGuide({data,onNavigate}:{data:any,onNavigate:(tab:string)=>void}){
 const families=(data.global_research_plan||data.research_plan)?.sources??[],voice=data.source_ledger?.counts?.stored_evidence_lanes?.user_voice??0;
 const admitted=data.readiness?.user_voice_records??0,coded=(data.global_rollup||data.rollup)?.coded??0;
 const approved=data.question_cards?.filter((q:any)=>q.status==='researcher_approved').length??0;
 const reviewAudit=data.review_collection;
 const playCollected=reviewAudit?.play_distinct_lower_bound??0;
 const playCandidates=reviewAudit?.play_topic_candidates_distinct??0;
 const playSelected=reviewAudit?.play_saved_provisional??0;
 const appleCollected=reviewAudit?.apple_retrieved??0,appleSelected=reviewAudit?.apple_saved_provisional??0;
 const forum=families.find((s:any)=>s.source_family==='Investing forums')?.user_voice_inputs??0;
 const reddit=families.find((s:any)=>s.source_family==='Reddit')?.user_voice_inputs??0;
 const cells=(data.global_rollup||data.rollup)?.cells??[];
 const stageRows=Object.entries(stageNames).map(([key,name])=>({name,count:cells.filter((c:any)=>c.metric_node===key).reduce((n:number,c:any)=>n+c.count,0)}));
 const outcomeRows=Object.entries(outcomeNames).map(([key,name])=>({name,count:cells.filter((c:any)=>c.exit_form===key).reduce((n:number,c:any)=>n+c.count,0)}));
 return <section className="overview" aria-label="Discovery engine overview">
  <div className="overview-purpose"><p className="eyebrow">THE RESEARCH JOB</p><h2>Find what might break a first SIP journey.</h2><p>The workspace reads locally imported public SIP experiences, marks the event and reported outcome, then shows what each of the nine questions can and cannot be answered from the sources.</p><button className="primary" onClick={()=>onNavigate('Nine questions')}>Ask the nine questions →</button></div>
  <section className="evidence-journey" aria-label="What has entered the engine"><div className="section-heading"><div><p className="eyebrow">COLLECTED → FILTERED → CHECKED</p><h2>More reviews, fewer usable SIP accounts</h2></div><span>At least {playCollected+appleCollected} distinct app-review IDs</span></div>
   {playCollected>0&&<p className="small"><strong>Groww Play Store:</strong> at least {playCollected} distinct review IDs retrieved → {playCandidates} passed a mechanical MF/SIP term and link screen → {playSelected} decision-relevant accounts saved provisionally. The broad 600-review run contributed only three topic matches. The 303-review older-date rerun was a duplicate and is counted zero times. These are reviews, not first-time investors or approved findings.</p>}
   {appleCollected>0&&<p className="small"><strong>Groww App Store:</strong> {appleCollected} reviews retrieved → {reviewAudit.apple_topic_candidates} topic matches → {appleSelected} accounts saved provisionally. Exact originals and source use still need clearance.</p>}
   <div className="journey-steps">
    <div><strong>{voice}</strong><b>public conversation entries saved</b><p>{forum} forum excerpts + {reddit} Reddit excerpts + {playSelected} Play reviews + {appleSelected} Apple reviews</p></div>
    <div><strong>{admitted}</strong><b>can be used in local research</b><p>Source-specific checks; forums only</p></div>
    <div><strong>{coded}</strong><b>given an early reading</b><p>Assistant labels awaiting source review</p></div>
    <div><strong>{approved} <small>/ 9</small></strong><b>questions have approved answers</b><p>No validated Groww problem selected</p></div>
   </div>
   <p className="small">Each step has a different unit: saved entries, admitted source posts, proposed labels, then approved answers. The figures describe this research set, not Groww users or SIP continuation rates. Three non-investor test controls are excluded from these counts.</p>
  </section>
  <section className="source-chart" aria-label="Collected SIP conversations by source"><div className="chart-title"><div><p className="eyebrow">WHERE THE DATA CAME FROM</p><h2>Seven source types named in the brief</h2></div><button onClick={()=>onNavigate(data.mode==='public'?'Evidence':'Sources & runs')}>See collection details →</button></div>
   {families.map((s:any)=><div className={'source-bar-row '+(s.source_family==='Reddit'?'source-held':'')} key={s.source_family}><span>{s.source_family}</span><div className="source-bar-track"><div style={{width:`${100*(s.user_voice_inputs??0)/Math.max(1,...families.map((f:any)=>f.user_voice_inputs??0))}%`}}/></div><b>{s.user_voice_inputs??0}</b><small>{s.source_family==='Investing forums'?`${admitted} locally usable`:s.source_family==='Reddit'?'held from analysis':s.user_voice_inputs?'use pending':'not collected'}</small></div>)}
   <p className="small">Bars count saved user-voice entries, not all reviews retrieved. {playCollected>0?`At least ${playCollected} Play review IDs were retrieved; ${playCandidates} passed a topic screen and ${playSelected} are saved as provisional candidates.`:''} {appleCollected>0?`${appleCollected} Apple reviews were retrieved; ${appleSelected} SIP-specific candidates are saved provisionally, with original-page verification pending.`:''} A zero means no item from that source has entered this corpus. The Reddit entries are held; they are not part of the answer evidence.</p>
  </section>
  <section className="signal-section"><div className="section-heading"><div><p className="eyebrow">WHAT THE EARLY READINGS SHOW</p><h2>Most accounts leave the important detail unclear</h2></div><span>{coded} provisional readings</span></div><div className="distribution-grid"><Distribution title="When in the SIP journey?" rows={stageRows} total={coded}/><Distribution title="How did the event begin?" rows={outcomeRows} total={coded}/></div><p className="small">These bars group {coded} assistant-coded source entries, mostly from other platforms or with unclear Groww fit. The second chart is about the initiating event, not the final payment outcome. These are not a distribution of first-time Groww investors, and they do not establish why a SIP stopped.</p></section>
  <div className="overview-main"><div className="overview-action"><p className="eyebrow">NEXT: THE NINE QUESTIONS</p><h2>See the answer and the “why”.</h2><p>Each question opens one bounded reading with the original source, an alternative explanation and the missing fact that matters next.</p><button className="primary" onClick={()=>onNavigate('Nine questions')}>Explore answers →</button></div><div className="overview-action"><p className="eyebrow">THEN: PM DECISION</p><h2>Compare possible problems.</h2><p>Four situations remain research leads. Compare their evidence and rivals before choosing a segment, cause or feature.</p><button onClick={()=>onNavigate('Compare opportunities')}>Compare leads →</button></div></div>
  <details className="overview-detail"><summary>How does the analysis work?</summary><div className="method-grid"><div><b>1. Collect</b><p>Save a public source link and its text locally.</p></div><div><b>2. Filter</b><p>Remove personal details, duplicates and irrelevant items.</p></div><div><b>3. Interpret</b><p>AI proposes labels; a researcher checks the original.</p></div><div><b>4. Answer</b><p>Count distinct sources and show claims, rivals and unknowns.</p></div></div><p>Live AI extraction is currently held after a failed development quality check. Early readings are proposals, not approved findings.</p></details>
 </section>;
}
