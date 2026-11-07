import React,{useRef,useState} from 'react';
import {labelFor} from './evidence-language';

const cues:Record<string,string[]>={
 Q1:['start','begin','why','expect','motivation'],Q2:['change','month','after starting','behavior','behaviour'],
 Q3:['pause','reduce','stop','miss','fail','cancel'],Q4:['check','how often','frequency','returns','statement'],
 Q5:['confus','worr','inside','app','control'],Q6:['outside','unsure','support','friend','advice'],
 Q7:['continue','drop off','drop-off','difference','separat'],Q8:['segment','income','age','influence','source of money'],
 Q9:['unmet','need','opportun','gap']
};
export function AskResearch({cards,publicMode,development,onInspect}:{cards:any[],publicMode:boolean,development?:any,onInspect:(id:string)=>void}){
 const [input,setInput]=useState(''),[selected,setSelected]=useState<string|null>('Q1'),[unmatched,setUnmatched]=useState(false);
 const [live,setLive]=useState<any>(null),[loading,setLoading]=useState(false);
 const answerRef=useRef<HTMLElement|null>(null);
 const card=cards.find(c=>c.id===selected);
 function reveal(){requestAnimationFrame(()=>answerRef.current?.scrollIntoView({behavior:'smooth',block:'start'}));}
 async function fetchAnswer(id:string,question:string){if(!publicMode)return;setLoading(true);setLive(null);try{const r=await fetch('/api/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question_id:id,question})});if(r.ok){const value=await r.json();setLive(value);}}catch{}finally{setLoading(false);}}
 function ask(){const q=input.trim().toLowerCase();if(!q){setUnmatched(false);setSelected(null);setLive(null);return;}
  const exact=cards.find(c=>c.title.toLowerCase()===q);
  const ranked=cards.map(c=>({id:c.id,score:(cues[c.id]||[]).filter(word=>q.includes(word)).length})).sort((a,b)=>b.score-a.score);
  const best=exact?.id||(ranked[0]?.score>0&&ranked[0].score>ranked[1]?.score?ranked[0].id:null);
  setSelected(best||null);setUnmatched(!best);setLive(null);if(best){void fetchAnswer(best,input.trim());reveal();}
 }
 return <section className="ask-research" aria-label="Ask the research">
  <div className="ask-top"><p className="eyebrow">NINE QUESTIONS · ONE ANSWER AT A TIME</p><h1>What do public SIP stories tell us?</h1><p>Ask about the first-year SIP journey. Each draft answer gives you a source, another explanation and what is still unknown.</p>
   <form className="ask-form" onSubmit={e=>{e.preventDefault();ask();}}><label htmlFor="research-query">Your research question</label><div><input id="research-query" value={input} onChange={e=>setInput(e.target.value)} placeholder="Why do people stop or pause a SIP?"/><button className="primary" type="submit">Find answer →</button></div></form>
  </div>
  {unmatched&&<div className="research-answer"><h3>Choose a brief question</h3><p>I cannot safely map that wording to one of the nine questions. Select the closest one below; the engine will not invent an answer.</p></div>}
  {card&&<article ref={answerRef} className="research-answer" aria-live="polite"><div className="answer-head"><span className="badge">{card.status==='researcher_approved'?'Source-reviewed answer':'Endorsed draft answer'}</span><span>{card.id} / 9</span></div><h3>{card.title}</h3>
   <p className="eyebrow">RESEARCH ANSWER</p><p className="answer-lead">{loading?'Preparing the source-linked answer…':live?.answer||card.direct_answer||card.working_reading?.text||'This source set cannot yet answer the question for first-time Groww investors.'}</p>
   {live&&<p className="small">{live.generated?'AI wording from the linked provisional reading · not researcher-validated':'Checked reading from the saved research snapshot'}{live.note?` · ${live.note}`:''}</p>}
   {card.working_reading&&<p className="source-line">Based on <a href={card.working_reading.url} target="_blank" rel="noreferrer">this public {card.working_reading.source_family.toLowerCase()} account ↗</a> · {card.working_reading.scope_lane==='adjacent'?'another platform or investor group':card.working_reading.scope_lane==='eligibility_unknown'?'Groww/first-year fit not stated':'target cohort stated'}</p>}
   {card.status==='researcher_approved'&&card.sources?.length>0&&<p className="source-line">{card.source_root_count} distinct reviewed source roots linked to this question. <button className="textbutton" onClick={()=>onInspect(card.id)}>Inspect sources →</button></p>}
   <div className="answer-limits"><div><b>What else could explain it?</b><p>{card.counterexample_or_rival||card.rival_to_check}</p></div><div><b>What is still unknown?</b><p>{card.unknown}</p></div></div>
   <p className="next-question"><b>What to check next:</b> {card.next_decision}</p>
   <details className="answer-method"><summary>How this answer was made</summary><p>The project owner endorsed this reading as a research direction. Its linked source still needs individual coding review. {card.working_reading?`The proposed journey stage is ${labelFor(card.working_reading.metric_node)} and the initiating event is ${labelFor(card.working_reading.exit_form)}.`:''} Public posts do not measure Groww’s month-12 SIP retention.</p></details>
  </article>}
  <h3 className="other-questions-title">Explore another question</h3><div className="question-choices" aria-label="Brief questions">{cards.map(c=><button className={selected===c.id?'chosen':''} key={c.id} onClick={()=>{setSelected(c.id);setInput(c.title);setUnmatched(false);setLive(null);void fetchAnswer(c.id,c.title);reveal();}}><span>{c.id}</span><span className="question-choice-body">{c.title}</span></button>)}</div>
  <details className="overview-detail"><summary>What is the AI allowed to do?</summary><p>It can reword one linked, provisional research reading for one of the nine questions. It cannot classify a new post or turn this reading into a verified investor insight. That separate extraction task recovered {development?.supported?.exact??0} of {development?.supported?.denominator??0} stated fields in a development check, below its preset gate. Its live tester remains off.</p></details>
 </section>;
}
