import React,{useState} from 'react';
import {labelFor} from './evidence-language';

const cues:Record<string,string[]>={
 Q1:['start','begin','why','expect','motivation'],Q2:['change','month','after starting','behavior','behaviour'],
 Q3:['pause','reduce','stop','miss','fail','cancel'],Q4:['check','how often','frequency','returns','statement'],
 Q5:['confus','worr','inside','app','control'],Q6:['outside','unsure','support','friend','advice'],
 Q7:['continue','drop off','drop-off','difference','separat'],Q8:['segment','income','age','influence','source of money'],
 Q9:['unmet','need','opportun','gap']
};
export function AskResearch({cards,publicMode,onInspect}:{cards:any[],publicMode:boolean,onInspect:(id:string)=>void}){
 const [input,setInput]=useState(''),[selected,setSelected]=useState<string|null>('Q3'),[unmatched,setUnmatched]=useState(false);
 const card=cards.find(c=>c.id===selected);
 function ask(){const q=input.trim().toLowerCase();if(!q){setUnmatched(false);setSelected(null);return;}
  const exact=cards.find(c=>c.title.toLowerCase()===q);
  const ranked=cards.map(c=>({id:c.id,score:(cues[c.id]||[]).filter(word=>q.includes(word)).length})).sort((a,b)=>b.score-a.score);
  const best=exact?.id||(ranked[0]?.score>0&&ranked[0].score>ranked[1]?.score?ranked[0].id:null);
  setSelected(best||null);setUnmatched(!best);
 }
 return <section className="ask-research" aria-label="Ask the research">
  <div className="ask-top"><p className="eyebrow">NINE QUESTIONS · ONE READING AT A TIME</p><h2>What do we know about first-year SIPs?</h2><p>Search within the nine brief questions or choose one below. This retrieves the current research reading; live LLM generation is held until it passes evaluation.</p>
   <form className="ask-form" onSubmit={e=>{e.preventDefault();ask();}}><label htmlFor="research-query">Your research question</label><div><input id="research-query" value={input} onChange={e=>setInput(e.target.value)} placeholder="Why do people stop or pause a SIP?"/><button className="primary" type="submit">Find answer →</button></div></form>
  </div>
  <div className="question-choices" aria-label="Brief questions">{cards.map(c=><button className={selected===c.id?'chosen':''} key={c.id} onClick={()=>{setSelected(c.id);setInput(c.title);setUnmatched(false);}}><span>{c.id}</span><span className="question-choice-body">{c.title}<small>{c.unreviewed_lead_roots} early source {c.unreviewed_lead_roots===1?'lead':'leads'} · {c.source_root_count} checked</small></span></button>)}</div>
  {unmatched&&<div className="research-answer"><h3>Choose a brief question</h3><p>I cannot safely map that wording to one of the nine questions. Select the closest one above; the engine will not invent an answer.</p></div>}
  {card&&<article className="research-answer" aria-live="polite"><div className="answer-head"><span className="badge">{card.status==='researcher_approved'?'Researcher-approved answer':'Early reading · needs source review'}</span><span>{card.id}</span></div><h3>{card.title}</h3>
   <p className="eyebrow">WHAT THE SOURCE CAN SAY</p><p className="answer-lead">{card.direct_answer||card.working_reading?.text||'We do not yet have a reviewed source account that answers this for first-time Groww investors.'}</p>
   {card.working_reading&&!publicMode&&<p className="source-line">From <a href={card.working_reading.url} target="_blank" rel="noreferrer">one {card.working_reading.source_family} account ↗</a> · {card.working_reading.scope_lane.replaceAll('_',' ')} · assistant proposal</p>}
   {card.working_reading&&!publicMode&&<div className="answer-reason"><b>Why this reading appears</b><p>The linked account gives an event that bears on this question. Its proposed labels are <strong>{labelFor(card.working_reading.metric_node)}</strong> for the initiating point and <strong>{labelFor(card.working_reading.exit_form)}</strong> for the event form. Those labels and the short reading still need checking against the original.</p></div>}
   {card.status==='researcher_approved'&&card.sources?.length>0&&<p className="source-line">{card.source_root_count} distinct reviewed source roots linked to this question. <button className="textbutton" onClick={()=>onInspect(card.id)}>Inspect sources →</button></p>}
   <div className="answer-limits"><div><b>Another explanation</b><p>{card.counterexample_or_rival||card.rival_to_check}</p></div><div><b>Still unknown</b><p>{card.unknown}</p></div></div>
   <p className="next-question"><b>What would change the decision:</b> {card.next_decision}</p>
   <p className="small">{card.reviewed_root_denominator? `${card.source_root_count} of ${card.reviewed_root_denominator} reviewed source roots linked`:'No source has passed full answer review yet'}. Source counts are not investor prevalence or Groww retention. Public posts cannot measure the month-12 metric.</p>
  </article>}
  <details className="overview-detail"><summary>Why is live AI answering held?</summary><p>The free-tier development extraction returned valid structures, but recovered only 12 of 44 supported fields and kept 28 of 34 unknown fields unknown. These are development diagnostics, not a blind accuracy score. The model stays off until the field quality gate and independent review pass.</p></details>
 </section>;
}
