import {labelFor} from './evidence-language';

export function PreliminaryComparison({data}:{data:any}){
 if(!data?.candidates?.length)return null;
 return <section className="panel preliminary-comparison" aria-label="Provisional research situations">
  <p className="eyebrow">UNSCORED RESEARCH LEADS · ASSISTANT PROPOSALS</p>
  <h2>{data.candidates.length} situations to check, no proven Groww problem yet</h2>
  <p>These situations come from real, source-linked accounts whose coding still needs review. Compare their possible consequence, rival explanation and next test. No segment, cause or feature has been selected.</p>
  <p className="boundary"><strong>{data.proposal_records} coded proposal records across {data.proposal_roots} dependent source roots</strong> form this local comparison base. Each card counts only its linked roots within that base. All observed examples here are outside or unconfirmed for the first-time Groww cohort; population reach and month-12 effect are unknown.</p>
  <div className="questiongrid">{data.candidates.map((c:any)=><article key={c.id}>
   <span className="eyebrow">PROVISIONAL SITUATION</span><h3>{c.name}</h3>
   <p><strong>What sources report:</strong> {c.observed}</p>
   <p><strong>Reported consequence:</strong> {c.consequence}</p>
   <p><strong>Possible metric path:</strong> {c.pathway}</p>
   <p className="small">{c.source_root_count} of {c.denominator_roots} locally usable proposed source roots in this selected set. {c.target_records} target-fit records; {c.adjacent_records} adjacent; {c.eligibility_unknown_records} eligibility unknown. This is a coverage count, not a frequency among investors.</p>
   <p className="small">Initiating tags: {c.metric_tags.map((tag:string)=>tag.split('/').map(labelFor).join(' / ')).join('; ')}.</p>
   <p><strong>Credible rival:</strong> {c.rival}</p><p><strong>Test that could change the decision:</strong> {c.next_test}</p>
   <details><summary>Open the original accounts</summary><ul>{c.sources.map((s:any)=><li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.locator} · {s.platform} ↗</a></li>)}</ul></details>
  </article>)}</div>
  <p className="small">Status: {data.limitation} The formal comparison below remains gated on accepted source accounts.</p>
 </section>;
}
