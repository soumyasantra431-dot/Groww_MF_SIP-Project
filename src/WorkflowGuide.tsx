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
 const playRuns=(data.collection_runs||[]).filter((r:any)=>r.source_family==='Play Store'&&r.route==='apify_k_data_lab_keyword_export');
 const runCounts=(r:any)=>{try{return JSON.parse(r?.counts||'{}');}catch{return {};}};
 const playCollected=Math.max(0,...playRuns.map((r:any)=>runCounts(r).dataset_rows||0));
 const playCandidates=Math.max(0,...playRuns.map((r:any)=>runCounts(r).valid_topic_reviews||0));
 const screenedRuns=playRuns.filter((r:any)=>Number.isInteger(runCounts(r).selected));
 const playScreened=screenedRuns.reduce((n:number,r:any)=>n+(runCounts(r).dataset_rows||0),0);
 const playSelected=screenedRuns.reduce((n:number,r:any)=>n+(runCounts(r).selected||0),0);
 const appleRun=(data.collection_runs||[]).find((r:any)=>r.source_family==='App Store'&&r.route==='apify_zkill3r_apple_export');
 const appleCounts=runCounts(appleRun),appleCollected=appleCounts.dataset_rows||0,appleSelected=appleCounts.selected||0;
 const forum=families.find((s:any)=>s.source_family==='Investing forums')?.user_voice_inputs??0;
 const reddit=families.find((s:any)=>s.source_family==='Reddit')?.user_voice_inputs??0;
 const cells=(data.global_rollup||data.rollup)?.cells??[];
 const stageRows=Object.entries(stageNames).map(([key,name])=>({name,count:cells.filter((c:any)=>c.metric_node===key).reduce((n:number,c:any)=>n+c.count,0)}));
 const outcomeRows=Object.entries(outcomeNames).map(([key,name])=>({name,count:cells.filter((c:any)=>c.exit_form===key).reduce((n:number,c:any)=>n+c.count,0)}));
 return <section className="overview" aria-label="Discovery engine overview">
  <div className="overview-purpose"><p className="eyebrow">THE RESEARCH JOB</p><h2>Find what might break a first SIP journey.</h2><p>The workspace reads locally imported public SIP experiences, marks the event and reported outcome, then shows what each of the nine questions can and cannot be answered from the sources.</p><button className="primary" onClick={()=>onNavigate('Nine questions')}>Ask the nine questions →</button></div>
  <section className="evidence-journey" aria-label="What has entered the engine"><div className="section-heading"><div><p className="eyebrow">WHAT ACTUALLY ENTERED</p><h2>From collected posts to checked answers</h2></div><span>{playCollected+appleCollected} app reviews retrieved</span></div>
   {playCollected>0&&<p className="small"><strong>Play Store intake:</strong> {playCollected} retrieved → {playCandidates} passed the mechanical MF/SIP term and source checks → {playScreened} assistant-screened → {playSelected} decision-relevant candidates saved locally. These are review counts, not first-time investor counts; none is an approved finding yet.</p>}
   {appleCollected>0&&<p className="small"><strong>App Store intake:</strong> {appleCollected} retrieved → {appleCounts.valid_topic_reviews} topic hits read → {appleSelected} SIP adjustment accounts saved locally. Their exact Apple reviews still need independent original-page verification; no finding is approved.</p>}
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
   <p className="small">Bars count saved user-voice entries, not all reviews retrieved. {playCollected>0?`${playCollected} Play reviews were collected; ${playSelected} are saved as provisional source candidates after the assistant screened ${playScreened}.`:''} {appleCollected>0?`${appleCollected} Apple reviews were collected; ${appleSelected} SIP-specific candidates are saved provisionally, with original-page verification pending.`:''} A zero means no item from that source has entered this corpus. The Reddit entries are held; they are not part of the answer evidence.</p>
  </section>
  <section className="signal-section"><div className="section-heading"><div><p className="eyebrow">WHAT THE EARLY READINGS SHOW</p><h2>Most accounts leave the important detail unclear</h2></div><span>{coded} provisional readings</span></div><div className="distribution-grid"><Distribution title="When in the SIP journey?" rows={stageRows} total={coded}/><Distribution title="How did the event begin?" rows={outcomeRows} total={coded}/></div><p className="small">These bars group {coded} assistant-coded source entries, mostly from other platforms or with unclear Groww fit. The second chart is about the initiating event, not the final payment outcome. These are not a distribution of first-time Groww investors, and they do not establish why a SIP stopped.</p></section>
  <div className="overview-main"><div className="overview-action"><p className="eyebrow">NEXT: THE NINE QUESTIONS</p><h2>See the answer and the “why”.</h2><p>Each question opens one bounded reading with the original source, an alternative explanation and the missing fact that matters next.</p><button className="primary" onClick={()=>onNavigate('Nine questions')}>Explore answers →</button></div><div className="overview-action"><p className="eyebrow">THEN: PM DECISION</p><h2>Compare possible problems.</h2><p>Four situations remain research leads. Compare their evidence and rivals before choosing a segment, cause or feature.</p><button onClick={()=>onNavigate('Compare opportunities')}>Compare leads →</button></div></div>
  <details className="overview-detail"><summary>How does the analysis work?</summary><div className="method-grid"><div><b>1. Collect</b><p>Save a public source link and its text locally.</p></div><div><b>2. Filter</b><p>Remove personal details, duplicates and irrelevant items.</p></div><div><b>3. Interpret</b><p>AI proposes labels; a researcher checks the original.</p></div><div><b>4. Answer</b><p>Count distinct sources and show claims, rivals and unknowns.</p></div></div><p>Live AI extraction is currently held after a failed development quality check. Early readings are proposals, not approved findings.</p></details>
 </section>;
}
