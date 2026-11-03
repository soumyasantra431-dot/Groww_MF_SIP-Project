import React from 'react';

export function SurveySecondary({summary}:{summary:any}) {
 if (!summary?.total_submissions) return <section className="panel"><h2>Written survey · secondary evidence</h2><p>Private survey accounting is unavailable in this local session.</p></section>;
 const d=summary.dispositions;
 return <section className="panel" aria-label="Private survey accounting">
  <p className="eyebrow">SEPARATE EVIDENCE LANE / WRITTEN SELF-REPORTS</p>
  <h2>What can the written responses tell us?</h2>
  <p><strong>{summary.total_submissions} submissions</strong> = {d.usable_for_limited_descriptive_analysis} limited descriptive accounts + {d.non_starter_screening_only} non-starters + {d.combined_consent_age_gate_not_passed} consent/age gate exclusion + {d.genuine_response_narrative_uninterpretable} genuine but uninterpretable account.</p>
  <p>{summary.attempted_sip_self_report} / {summary.total_submissions} report attempting a SIP. {summary.self_reported_first_year_groww_fit} / {summary.total_submissions} self-reports the first-year Groww cohort fit. {summary.month12_outcome_measurable} / {summary.total_submissions} provide a measurable month-12 outcome.</p>
  <p className="boundary">These are selected written responses, not interviews, verified transactions or a representative Groww sample. None enters the public-post corpus or its counts. The month-12 active-SIP percentage cannot be calculated here.</p>
  <p><strong>PM use:</strong> refine follow-up questions about cohort entry, the latest successful instalment, and the event preceding a change. Keep explanations and opportunity choice open until source-linked accounts and contrasting cases have been reviewed.</p>
 </section>;
}
