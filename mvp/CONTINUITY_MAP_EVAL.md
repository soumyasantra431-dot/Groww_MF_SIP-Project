# Continuity Map quality gate

**Status 9 November 2026:** one synthetic free-tier development call worked; no independent real-item accuracy result exists. Public AI remains off.

## Input freeze

Use about 20 distinct, de-identified real source accounts that may lawfully be used for local/model evaluation. The Fellow labels all six fields in [CONTINUITY_MAP_CONTRACT.md](CONTINUITY_MAP_CONTRACT.md) **before** model output. Every field may be `unknown`. Preserve source locator, actual focal event, negative statements and whether other SIPs are involved in the local gitignored pack. Deliberate pauses and ordinary continuers must not be replaced by fabricated problem posts. Synthetic sample stories are development fixtures only.

## Scoring

Run the frozen text through the same Worker/model path that would be enabled publicly. Human-review each prediction for severe semantic errors. For each of the six fields per item, count: `correct_explicit`, `correct_unknown`, `wrong`, `missed` (abstained despite stated evidence), `invented` (specific value when the reference is unknown), or `processing_failure`. The six categories must sum to `6 × item count`; print counts and denominators before percentages. Explicit-field recall is `correct_explicit / expected-explicit fields`; unknown preservation is `correct_unknown / expected-unknown fields`. A failed call stays in both denominators and cannot inflate a score by disappearing.

Pre-registered minimums: zero severe errors (false SIP finality, duplicate-payment direction, advice, pressure, privacy leak or invented actor fault); explicit recall at least 70%; unknown preservation at least 90%; at most one processing failure per ten items; and at least one explicit example for each material field. A missing human label, a missing adjudication or a zero relevant denominator leaves the gate **unmeasured**. Real task benefit versus existing Groww help and the fixed receipt is a separate test; passing extraction alone does not prove value.

Use `node mvp/map-eval.mjs <local-reference.json> <local-predictions.json>`. Files stay under `.local/`; never commit raw descriptions or identity details. The script checks accounting and reports a gate decision; it does not create human labels.
