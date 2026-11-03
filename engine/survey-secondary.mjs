// Private written responses are a separate, descriptive lane. Never return text or IDs.
const DISPOSITIONS = [
  'usable_for_limited_descriptive_analysis',
  'non_starter_screening_only',
  'combined_consent_age_gate_not_passed',
  'genuine_response_narrative_uninterpretable'
];

export function summarizeSurvey(rows) {
  if (!Array.isArray(rows)) throw Error('Survey records must be an array');
  const counts = Object.fromEntries(DISPOSITIONS.map(key => [key, 0]));
  let attempted = 0, selfReportedFit = 0, measuredMonth12 = 0;
  const ids = new Set();
  for (const row of rows) {
    if (!row || typeof row.id !== 'string' || ids.has(row.id) || !DISPOSITIONS.includes(row.analysis_disposition)) {
      throw Error('Survey accounting needs unique records and recognised dispositions');
    }
    ids.add(row.id);
    counts[row.analysis_disposition]++;
    if (row.attempted_sip === true) attempted++;
    if (row.self_reported_first_ever_first_year_groww_fit === true) selfReportedFit++;
    if (row.exact_month12_outcome !== 'not_measurable' && row.exact_month12_outcome != null) measuredMonth12++;
  }
  return {
    evidence_lane: 'private_written_survey_secondary',
    unit: 'submitted response, not verified investor or successful instalment',
    total_submissions: rows.length,
    dispositions: counts,
    attempted_sip_self_report: attempted,
    self_reported_first_year_groww_fit: selfReportedFit,
    month12_outcome_measurable: measuredMonth12,
    target_metric_calculable: false,
    corpus_included: false,
    independent_interviews: false,
    interpretation: 'A small, selected set of written self-reports can shape follow-up questions. It cannot establish Groww cohort retention, a cause, or population frequency.'
  };
}
