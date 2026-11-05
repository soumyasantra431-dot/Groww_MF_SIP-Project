import {useState} from 'react';
import {labelFor} from './evidence-language';

const examples=[
 ['I-ee755f7ea081bce89add','First payment and next-date uncertainty'],
 ['I-50a772eddc9a02120c1e','Payment workaround reported later'],
 ['I-14cd3dbb137c38498cf3','About a year of continued SIPs']
] as const;
const code=(item:any)=>item.tier_b?.classification||item.tier_a;

export function SampleWalkthrough({items,cards,onQuestion}:{items:any[],cards:any[],onQuestion:(id:string)=>void}){
 const available=examples.map(([id,title])=>({item:items.find(r=>r.id===id&&r.local_use_status==='cleared'&&code(r)),title})).filter(x=>x.item);
 const [selectedId,setSelectedId]=useState(available[0]?.item?.id||'');
 const chosen=available.find(x=>x.item.id===selectedId)||available[0];
 if(!chosen)return <p className="empty">No locally usable, coded sample is available. A sample walkthrough cannot be shown.</p>;
 const item=chosen.item,c=code(item),questionId=c.question_ids?.[0],card=cards.find(q=>q.id===questionId);
 return <section className="sample-walkthrough" aria-label="Walk through one real source">
  <p className="eyebrow">LOCAL DEMO · NO MODEL CALL</p><h3>Follow one source through the engine</h3>
  <p>Select a real account. The text below is an <strong>assistant coding proposal</strong> from that source. Opening the original lets you challenge it. This demonstration does not change review status or invent a new classification.</p>
  <label>Choose an episode<select value={item.id} onChange={e=>setSelectedId(e.target.value)}>{available.map(x=><option key={x.item.id} value={x.item.id}>{x.title}</option>)}</select></label>
  <ol>
   <li><strong>Source.</strong> <a href={item.source_review_url||item.url} target="_blank" rel="noreferrer">Open {item.source_family}, {item.source_locator||item.id} ↗</a>. The original is the check on every proposed label.</li>
   <li><strong>What is reported.</strong> {c.paraphrase}</li>
   <li><strong>How it is coded.</strong> Initiating moment: {labelFor(c.metric_node)}. Form of interruption or continuation: {labelFor(c.exit_form)}. Reported ending: {c.final_state||'not stated'}.</li>
   <li><strong>Whose metric it might inform.</strong> {labelFor(c.scope_lane)}. An account outside or unconfirmed for the first-time Groww cohort cannot be counted as a Groww month-12 outcome.</li>
   <li><strong>What follows.</strong> {card?<>{card.title} — {card.status==='researcher_approved'?'a reviewed answer is available.':'the formal answer remains open.'} {card.next_decision}</>:'This proposed record is not yet linked to a research question.'}</li>
  </ol>
  {card&&<button className="textbutton" onClick={()=>onQuestion(card.id)}>Inspect source records tagged to {card.id} →</button>}
  <p className="small">This is a walkthrough of existing local evidence. It is not a fresh AI run, a human-verified label or a measurement of how often this happens to investors.</p>
 </section>;
}
