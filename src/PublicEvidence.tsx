import React from 'react';

export function PublicEvidence({cards}:{cards:any[]}){
 const byUrl=new Map<string,{source:any,questions:string[]}>();
 for(const card of cards){const source=card.working_reading;if(!source?.url)continue;const entry=byUrl.get(source.url);if(entry)entry.questions.push(card.id);else byUrl.set(source.url,{source,questions:[card.id]});}
 const rows=[...byUrl.values()];
 return <section className="public-evidence"><p className="eyebrow">THE ACCOUNTS BEHIND THE ANSWERS</p><h2>{rows.length} linked public accounts support the nine draft readings</h2><p>Open an original to check the writer’s action and what happened next. Some accounts come from another platform or do not state whether this is a first-year Groww SIP; they suggest questions to investigate rather than measure Groww investors.</p><div className="public-source-grid">{rows.map(({source,questions})=><article key={source.url}><span className="badge">{questions.join(' · ')}</span><h3>{source.source_family} account</h3><p>{source.text}</p><p className="small">{source.scope_lane==='adjacent'?'Another platform or investor group':source.scope_lane==='eligibility_unknown'?'Groww and first-year fit not stated':'Target fit stated'}</p><a href={source.url} target="_blank" rel="noreferrer">Read the original source ↗</a></article>)}</div><p className="small">These are short research paraphrases, not copied posts. The selected app reviews are still awaiting source checks and are not counted as evidence for these nine readings.</p></section>;
}
