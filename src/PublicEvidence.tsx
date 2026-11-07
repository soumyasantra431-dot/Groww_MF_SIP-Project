import React from 'react';

export function PublicEvidence({briefs={},sources={}}:{briefs?:Record<string,any>,sources?:Record<string,any>}){
 const used=new Map<string,string[]>();
 for(const [id,brief] of Object.entries(briefs))for(const point of brief.points||[])for(const key of point.sources||[])used.set(key,[...new Set([...(used.get(key)||[]),id])]);
 const rows=[...used].map(([key,questions])=>({key,questions,source:sources[key]})).filter(r=>r.source);
 const investor=rows.filter(r=>r.source.family==='Public investor account').length;
 return <section className="public-evidence"><p className="eyebrow">TRACE THE RESEARCH</p><h2>The sources behind the nine answers</h2><p><strong>{investor} public investor accounts</strong> and <strong>{rows.length-investor} context sources</strong> support the current desk readings. A linked account describes one writer’s experience. Official guidance shows a product capability; it is not proof that anyone used it successfully.</p>
 <div className="public-source-grid">{rows.map(({key,source,questions})=><article key={key}><span className="badge">{questions.join(' · ')}</span><h3>{source.family}</h3><p>{source.fit}</p><p><b>What it cannot show:</b> {source.limit}</p><a href={source.url} target="_blank" rel="noreferrer">Open original source ↗</a></article>)}</div>
 <p className="small">These desk sources are separate from the app-review collection funnel and model-coded corpus. One account may inform several questions but counts as one source. The app reviews selected for closer reading do not yet support these answers.</p></section>;
}
