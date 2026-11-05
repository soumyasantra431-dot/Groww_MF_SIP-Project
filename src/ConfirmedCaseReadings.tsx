type Source = {url:string;locator:string};
type CaseReading = {id:string;title:string;sources:Source[];supported:string;unknown:string;rival:string;candidate_question:string;target_fit:string;metric_tag:string};
type CasePacket = {date:string;review_class:string;roots:number;post_units:number;direct_first_year_groww_with_next_payment:number;cases:CaseReading[];q3_draft?:{status:string;observation:string;rival:string;unknown:string;next_test:string}};

export function ConfirmedCaseReadings({packet}:{packet:CasePacket|null|undefined}){
 if(!packet?.cases?.length)return null;
 return <section className="case-readings" aria-label="Three source-reviewed contrast cases">
  <p className="eyebrow">SOURCE REVIEW · {packet.date}</p>
  <h3>Three cases we can read clearly. The Groww outcome is still open.</h3>
  <p>The Fellow confirmed these narrow readings after seeing a draft. This is source review, not a blind AI test or approval of a nine-question answer. These are <strong>{packet.roots} distinct discussion roots and {packet.post_units} posts</strong>, not a sample of {packet.roots} Groww investors. <strong>{packet.direct_first_year_groww_with_next_payment}</strong> confirms both first-year Groww status and the next scheduled SIP payment outcome.</p>
  <div className="case-reading-grid">{packet.cases.map(c=><article key={c.id}>
   <p className="eyebrow">CASE {c.id} · {c.target_fit}</p><h4>{c.title}</h4>
   <p><strong>Reported:</strong> {c.supported}</p><p><strong>Still unknown:</strong> {c.unknown}</p>
   <details><summary>What this helps us investigate</summary><p><strong>Rival explanation:</strong> {c.rival}</p><p><strong>Next question:</strong> {c.candidate_question}</p><p><strong>Metric tag:</strong> {c.metric_tag}</p></details>
   <p className="case-links">Original {c.sources.map((s,i)=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.locator}{i<c.sources.length-1?', ':' ↗'}</a>)}</p>
  </article>)}</div>
  {packet.q3_draft&&<div className="case-draft"><p className="eyebrow">Q3 · BOUNDED DRAFT · NOT AN APPROVED ANSWER</p><h4>What these accounts let us investigate</h4><p>{packet.q3_draft.observation}</p><p><strong>Rival:</strong> {packet.q3_draft.rival}</p><p><strong>Unknown:</strong> {packet.q3_draft.unknown}</p><p><strong>Next evidence:</strong> {packet.q3_draft.next_test}</p></div>}
  <p className="small">These cases illustrate schedule confusion, a payment workaround and a trust-related investment pause. They do not establish a cause mix, an SIP stop in Case C, or a month-12 retention rate. The Q3 answer remains open.</p>
 </section>;
}
