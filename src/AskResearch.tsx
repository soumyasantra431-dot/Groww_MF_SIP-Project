import React,{useState} from 'react';
import {labelFor} from './evidence-language';

const cues:Record<string,string[]>={
 Q1:['start','begin','why','expect','motivation'],Q2:['change','month','after starting','behavior','behaviour'],
 Q3:['pause','reduce','stop','miss','fail','cancel'],Q4:['check','how often','frequency','returns','statement'],
 Q5:['confus','worr','inside','app','control'],Q6:['outside','unsure','support','friend','advice'],
 Q7:['continue','drop off','drop-off','difference','separat'],Q8:['segment','income','age','influence','source of money'],
 Q9:['unmet','need','opportun','gap']
};
export function AskResearch({cards,publicMode,development,onInspect}:{cards:any[],publicMode:boolean,development?:any,onInspect:(id:string)=>void}){
 const [input,setInput]=useState(''),[selected,setSelected]=useState<string|null>('Q3'),[unmatched,setUnmatched]=useState(false);
 const [live,setLive]=useState<any>(null),[loading,setLoading]=useState(false);
 const card=cards.find(c=>c.id===selected);
 async function fetchAnswer(id:string,question:string){if(!publicMode)return;setLoading(true);setLive(null);try{const r=await fetch('/api/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question_id:id,question})});if(r.ok){const value=await r.json();setLive(value);}}catch{}finally{setLoading(false);}}
 function ask(){const q=input.trim().toLowerCase();if(!q){setUnmatched(false);setSelected(null);setLive(null);return;}
  const exact=cards.find(c=>c.title.toLowerCase()===q);
  const ranked=cards.map(c=>({id:c.id,score:(cues[c.id]||[]).filter(word=>q.includes(word)).length})).sort((a,b)=>b.score-a.score);
  const best=exact?.id||(ranked[0]?.score>0&&ranked[0].score>ranked[1]?.score?ranked[0].id:null);
  setSelected(best||null);setUnmatched(!best);setLive(null);if(best)void fetchAnswer(best,input.trim());
 }
 return <section className="ask-research" aria-label="Ask the research">
  <div className="ask-top"><p className="eyebrow">NINE QUESTIONS · ONE READING AT A TIME</p><h2>What do we know about first-year SIPs?</h2><p>Search within the nine brief questions or choose one below. AI can put a provisional, source-linked reading in plain English. It cannot establish the Groww cohort outcome or replace source review.</p>
   <form className="ask-form" onSubmit={e=>{e.preventDefault();ask();}}><label htmlFor="research-query">Your research question</label><div><input id="research-query" value={input} onChange={e=>setInput(e.target.value)} placeholder="Why do people stop or pause a SIP?"/><button className="primary" type="submit">Find answer →</button></div></form>
  </div>
  <div className="question-choices" aria-label="Brief questions">{cards.map(c=><button className={selected===c.id?'chosen':''} key={c.id} onClick={()=>{setSelected(c.id);setInput(c.title);setUnmatched(false);setLive(null);void fetchAnswer(c.id,c.title);}}><span>{c.id}</span><span className="question-choice-body">{c.title}<small>{c.unreviewed_lead_roots} early source {c.unreviewed_lead_roots===1?'lead':'leads'} · {c.source_root_count} checked</small></span></button>)}</div>
  {unmatched&&<div className="research-answer"><h3>Choose a brief question</h3><p>I cannot safely map that wording to one of the nine questions. Select the closest one above; the engine will not invent an answer.</p></div>}
  {card&&<article className="research-answer" aria-live="polite"><div className="answer-head"><span className="badge">{card.status==='researcher_approved'?'Researcher-approved answer':card.status==='fellow_endorsed_provisional'||card.working_reading&&!publicMode?'Fellow endorsed research direction':'Early reading · needs source review'}</span><span>{card.id}</span></div><h3>{card.title}</h3>
   {card.working_reading&&<p className="small">The Fellow approved pursuing this early reading. Its source coding and Groww cohort fit still need review; it is not a validated answer.</p>}
   <p className="eyebrow">WHAT THE SOURCE CAN SAY</p><p className="answer-lead">{loading?'Preparing a bounded reading…':live?.answer||card.direct_answer||card.working_reading?.text||'We do not yet have a reviewed source account that answers this for first-time Groww investors.'}</p>
   {live&&<p className="small">{live.generated?'AI wording from the linked provisional reading · not researcher-validated':'Checked reading from the saved research snapshot'}{live.note?` · ${live.note}`:''}</p>}
   {card.working_reading&&<p className="source-line">From <a href={card.working_reading.url} target="_blank" rel="noreferrer">one {card.working_reading.source_family} account ↗</a> · {card.working_reading.scope_lane.replaceAll('_',' ')} · assistant proposal</p>}
   {card.working_reading&&<div className="answer-reason"><b>Why this reading appears</b><p>The linked account gives an event that bears on this question. Its proposed labels are <strong>{labelFor(card.working_reading.metric_node)}</strong> for the initiating point and <strong>{labelFor(card.working_reading.exit_form)}</strong> for the event form. Those labels still need independent source review.</p></div>}
   {card.status==='researcher_approved'&&card.sources?.length>0&&<p className="source-line">{card.source_root_count} distinct reviewed source roots linked to this question. <button className="textbutton" onClick={()=>onInspect(card.id)}>Inspect sources →</button></p>}
   <div className="answer-limits"><div><b>Another explanation</b><p>{card.counterexample_or_rival||card.rival_to_check}</p></div><div><b>Still unknown</b><p>{card.unknown}</p></div></div>
   <p className="next-question"><b>What would change the decision:</b> {card.next_decision}</p>
   <p className="small">{card.reviewed_root_denominator? `${card.source_root_count} of ${card.reviewed_root_denominator} reviewed source roots linked`:'No source has passed full answer review yet'}. Source counts are not investor prevalence or Groww retention. Public posts cannot measure the month-12 metric.</p>
  </article>}
  <details className="overview-detail"><summary>What is the AI allowed to do?</summary><p>It can reword one linked, provisional research reading for one of the nine questions. It cannot classify a new post or turn this reading into a verified investor insight. That separate extraction task recovered {development?.supported?.exact??0} of {development?.supported?.denominator??0} stated fields in a development check, below its preset gate. Its live tester remains off.</p></details>
 </section>;
}
