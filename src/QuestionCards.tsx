import {useState} from 'react';
import {ConfirmedCaseReadings} from './ConfirmedCaseReadings';

function QuestionCard({card,proposed,onInspect,onApprove,publicMode}:{card:any,proposed:any,onInspect:(id:string)=>void,onApprove:(body:any)=>Promise<any>,publicMode:boolean}){
 const [ids,setIds]=useState<string[]>([]),[direct,setDirect]=useState(''),[rival,setRival]=useState(''),[unknown,setUnknown]=useState(''),[next,setNext]=useState(''),[checked,setChecked]=useState(false),[approved,setApproved]=useState(false);
 const canSave=ids.length>0&&direct.trim()&&rival.trim()&&unknown.trim()&&next.trim()&&checked&&approved;
 return <article><span className="eyebrow">{card.id} · {card.status==='researcher_approved'?'Researcher approved':'Answer open'}</span><h3>{card.title}</h3>
  <strong className="fraction">{card.source_root_count} <small>/ {card.reviewed_root_denominator} reviewed source roots</small></strong>
  <p className="small">{proposed?.count??0} coded proposals in this view · {card.record_count} accepted local records linked to this question. Target fit: {card.fit_records.target}; adjacent: {card.fit_records.adjacent}; eligibility unknown: {card.fit_records.eligibility_unknown}.</p>
  <p className="small">Source mix: {Object.entries(card.source_mix).map(([family,n])=>`${family}: ${n} records`).join('; ')||'none reviewed'}.</p>
  <p><strong>Answer:</strong> {card.direct_answer||'Insufficient reviewed evidence or approved wording. No conclusion is claimed.'}</p>
  {card.status==='researcher_approved'&&<p className="small">Approved citations: {card.sources.filter((source:any)=>card.approved_source_ids.includes(source.id)).map((source:any)=><a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.source_locator||source.id} ↗ </a>)}</p>}
  {card.counterexample_or_rival&&<p><strong>Counterexample or rival:</strong> {card.counterexample_or_rival}</p>}
  <details><summary>Inspect evidence and limits</summary>
   <p><strong>Evidence needed:</strong> {card.answer_requirement}</p><p><strong>Rival to check:</strong> {card.rival_to_check}</p>
   <p><strong>Still unknown:</strong> {card.unknown}</p><p><strong>Next:</strong> {card.next_decision}</p>
   {card.sources.length?<ul>{card.sources.map((source:any)=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.source_family} · {source.source_locator||source.id} ↗</a> <span className="small">({source.scope_lane.replaceAll('_',' ')}, {source.metric_node.replaceAll('_',' ')} / {source.exit_form.replaceAll('_',' ')})</span></li>)}</ul>:<p className="small">No accepted, locally permitted source is linked yet.</p>}
  </details>
  {!publicMode&&card.sources.length>0&&<details><summary>Write a source-checked answer</summary>
   <p className="small">Only a researcher who checked the original sources should approve this wording. A source count is not an investor prevalence estimate.</p>
   {card.sources.map((source:any)=><label key={source.id}><input type="checkbox" checked={ids.includes(source.id)} onChange={e=>setIds(e.target.checked?[...ids,source.id]:ids.filter(x=>x!==source.id))}/> Cite {source.source_locator||source.id}</label>)}
   <label>Direct answer within these sources<textarea value={direct} maxLength={700} onChange={e=>setDirect(e.target.value)}/></label>
   <label>Counterexample or credible rival<textarea value={rival} maxLength={500} onChange={e=>setRival(e.target.value)}/></label>
   <label>What remains unknown<textarea value={unknown} maxLength={500} onChange={e=>setUnknown(e.target.value)}/></label>
   <label>Next discriminating question<textarea value={next} maxLength={400} onChange={e=>setNext(e.target.value)}/></label>
   <label><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/> I checked every cited original and its speaker, sequence and outcome</label>
   <label><input type="checkbox" checked={approved} onChange={e=>setApproved(e.target.checked)}/> I approve this bounded wording as the researcher</label>
   <button disabled={!canSave} onClick={()=>onApprove({question_id:card.id,source_ids:ids,direct_answer:direct,counterexample_or_rival:rival,unknown,next_question:next,checked_sources:checked,researcher_approved:approved})}>Save reviewed answer</button>
  </details>}
  <button className="textbutton" onClick={()=>onInspect(card.id)}>Inspect source records →</button>
 </article>;
}

export function QuestionCards({cards,proposalCounts,caseReadings,onInspect,onApprove,publicMode}:{cards:any[],proposalCounts:any[],caseReadings?:any,onInspect:(id:string)=>void,onApprove:(body:any)=>Promise<any>,publicMode:boolean}){
 return <section aria-label="Nine research questions">
  <div className="sectiontitle"><div><p className="eyebrow">02 / BRIEF COVERAGE</p><h2>Nine questions. What the reviewed sources can support.</h2></div></div>
  <p className="small">Each fraction counts distinct source roots in the full locally reviewed corpus. It is not a count of investors or Groww retention. AI and assistant proposals are shown separately and never become answers by themselves.</p>
  {!publicMode&&<ConfirmedCaseReadings packet={caseReadings}/>}
  <div className="questiongrid">{cards.map((card:any)=><QuestionCard key={card.id} card={card} proposed={proposalCounts.find((q:any)=>q.id===card.id)} onInspect={onInspect} onApprove={onApprove} publicMode={publicMode}/>)}</div>
 </section>;
}
