import React,{useRef,useState} from 'react';

const cues:Record<string,string[]>={
 Q1:['start','begin','why','expect','motivation'],Q2:['change','month','after starting','behavior','behaviour'],
 Q3:['pause','reduce','stop','miss','fail','cancel'],Q4:['check','how often','frequency','returns','statement'],
 Q5:['confus','worr','inside','app','control'],Q6:['outside','unsure','support','friend','advice'],
 Q7:['continue','drop off','drop-off','difference','separat'],Q8:['segment','income','age','influence','source of money'],
 Q9:['unmet','need','opportun','gap']
};
const researchTest:Record<string,string>={
 Q1:'Compare each starter’s stated goal, expected timeline and first payment with what they later report. Ask what expectation changed.',
 Q2:'Follow the same person across two dated moments. Separate continuing, adjustment, recovery and stopping.',
 Q3:'Code wanted pause, unwanted payment failure and passive drift separately. Check intent, next scheduled payment and other active SIPs.',
 Q4:'Ask for a reference period and a checking diary. Incident posts show what was checked but cannot establish routine frequency.',
 Q5:'Compare what the investor thought the app meant with the documented rule and what happened next.',
 Q6:'Trace the investor’s own bank, support, peer or video action. A commenter’s suggestion is not a completed workaround.',
 Q7:'Compare people with a similar difficult month, including a comfortable continuer and an informed pause. Check every SIP and the next due event.',
 Q8:'Compare only circumstances each author states; never infer income from age or ticket size. Cohort differences need screened users or Groww data.',
 Q9:'Find the same unfinished job across independent roots, inspect current controls and preserve successful workarounds as counterexamples.'
};
export function AskResearch({cards,briefs={},sources={},development}:{cards:any[],briefs?:Record<string,any>,sources?:Record<string,any>,publicMode:boolean,development?:any,onInspect:(id:string)=>void}){
 const [input,setInput]=useState(''),[selected,setSelected]=useState<string|null>('Q1'),[unmatched,setUnmatched]=useState(false);
 const answerRef=useRef<HTMLElement|null>(null);
 const card=cards.find(c=>c.id===selected),brief=selected?briefs[selected]:null;
 function reveal(){requestAnimationFrame(()=>answerRef.current?.scrollIntoView({behavior:'smooth',block:'start'}));}
 function ask(){const q=input.trim().toLowerCase();if(!q){setUnmatched(false);setSelected(null);return;}
  const exact=cards.find(c=>c.title.toLowerCase()===q);
  const ranked=cards.map(c=>({id:c.id,score:(cues[c.id]||[]).filter(word=>q.includes(word)).length})).sort((a,b)=>b.score-a.score);
  const best=exact?.id||(ranked[0]?.score>0&&ranked[0].score>ranked[1]?.score?ranked[0].id:null);
  setSelected(best||null);setUnmatched(!best);if(best)reveal();
 }
 return <section className="ask-research" aria-label="Ask the research">
  <div className="ask-top"><p className="eyebrow">NINE QUESTIONS · SOURCE-LINKED RESEARCH</p><h1>What do SIP investors actually describe?</h1><p>Select a question to see a bounded reading, its sources, another explanation and the PM test that would strengthen it. These are research leads, not measured Groww retention or investment advice.</p>
   <form className="ask-form" onSubmit={e=>{e.preventDefault();ask();}}><label htmlFor="research-query">Find one of the nine brief questions</label><div><input id="research-query" value={input} onChange={e=>setInput(e.target.value)} placeholder="Why do people pause or reduce a SIP?"/><button className="primary" type="submit">Open matching question →</button></div></form>
  </div>
  <h3 className="other-questions-title">Choose one of the nine brief questions</h3><div className="question-choices" aria-label="Brief questions">{cards.map(c=><button className={selected===c.id?'chosen':''} key={c.id} onClick={()=>{setSelected(c.id);setInput(c.title);setUnmatched(false);reveal();}}><span>{c.id}</span><span className="question-choice-body">{briefs[c.id]?.title||c.title}</span></button>)}</div>
  {unmatched&&<div className="research-answer"><h3>Choose one of the nine questions</h3><p>That wording could match several topics. Select the closest question below so the answer stays tied to sources.</p></div>}
  {card&&<article ref={answerRef} className="research-answer" aria-live="polite"><div className="answer-head"><span className="badge">Source-checked desk reading · research lead</span><span>{card.id} / 9</span></div><h3>{brief?.title||card.title}</h3>
   <div className="answer-evidence-status"><b>{brief?.points?.length??0}</b> source-linked observations <span>·</span> <b>{card.unreviewed_lead_roots??0}</b> coding proposals <span>·</span> <b>{card.source_root_count??0}</b> accepted corpus cases</div>
   <p className="eyebrow">THE SHORT ANSWER</p><p className="answer-lead">{brief?.answer||card.direct_answer||card.working_reading?.text||'The current material does not answer this question.'}</p>
   {brief?.points?.length>0&&<section className="brief-points"><h4>What supports this reading</h4><ol>{brief.points.map((point:any,index:number)=><li key={index}><span>{point.text}</span><span className="brief-cites">{point.sources.map((key:string)=><a key={key} href={sources[key]?.url} target="_blank" rel="noreferrer" title={sources[key]?.fit}>{sources[key]?.family||'Source'} ↗</a>)}</span></li>)}</ol></section>}
   <div className="answer-limits"><div><b>Another explanation</b><p>{brief?.rival||card.counterexample_or_rival||card.rival_to_check}</p></div><div><b>Still unknown</b><p>{brief?.unknown||card.unknown}</p></div></div>
   <div className="research-test"><b>How we would answer this more strongly</b><p>{researchTest[card.id]}</p></div>
   <p className="next-question"><b>Best next research step:</b> {brief?.next||card.next_decision}</p>
   <details className="answer-method"><summary>How to read this answer</summary><p>This is an assistant-written synthesis of linked public accounts and official context, checked against the source pages. It is separate from the stored corpus and its AI coding proposals. Each source may describe a different person; we do not join them into one journey. First-ever mutual fund status, a following scheduled SIP payment, and the month-12 result remain unknown unless explicitly stated.</p><p>The independent model extraction check has not passed. It recovered {development?.supported?.exact??0} of {development?.supported?.denominator??0} supported fields in a development test. A new-post classifier remains off.</p></details>
  </article>}
 </section>;
}
