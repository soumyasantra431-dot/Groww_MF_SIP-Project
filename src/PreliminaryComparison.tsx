import {labelFor} from './evidence-language';

export function PreliminaryComparison({data}:{data:any}){
 if(!data?.candidates?.length)return null;
 return <section className="preliminary-comparison" aria-label="Provisional research situations">
  <p className="eyebrow">RESEARCH LEADS · NOT RANKED</p>
  <h2>Four situations worth checking</h2>
  <p>These are source-linked proposals from adjacent or unconfirmed accounts. None is a proven Groww problem. Open a card to see the rival explanation and next test.</p>
  <div className="lead-grid">{data.candidates.map((c:any)=><article key={c.id}>
   <span className="lead-count">{c.source_root_count} / {c.denominator_roots} source roots in this selected proposal set</span>
   <h3>{c.name}</h3><p>{c.observed}</p>
   <details><summary>What would we need to check?</summary><p><b>Possible metric link:</b> {c.pathway}</p><p><b>Other explanation:</b> {c.rival}</p><p><b>Next test:</b> {c.next_test}</p><p className="small">{c.target_records} target-fit records; {c.adjacent_records} adjacent; {c.eligibility_unknown_records} eligibility unknown. Tags: {c.metric_tags.map((tag:string)=>tag.split('/').map(labelFor).join(' / ')).join('; ')}</p></details>
   <details><summary>Read original sources</summary><ul>{c.sources.map((s:any)=><li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.locator} ↗</a></li>)}</ul></details>
  </article>)}</div>
  <p className="small">These are counts in a small selected source set, not investor prevalence. Reach and month-12 effect remain unknown.</p>
 </section>;
}
