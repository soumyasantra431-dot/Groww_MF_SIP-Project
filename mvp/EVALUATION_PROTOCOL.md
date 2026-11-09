# SIP Continuity Receipt: independent AI quality check

**Status 9 November 2026:** engineering and one synthetic free-tier request passed. An independently human-labelled real-item golden set has **not** been completed. Public AI remains off; the fixed guide is the deployed fallback.

## Freeze before model output

Select about 20 distinct, de-identified **real** SIP-payment descriptions that the project may process. Preserve source locator and source-use basis locally; do not publish original text. Cover a wanted failed debit, debit but processing, missed/unpaid, reported completion, intentional pause, changed amount, one of several SIPs, manual/one-time current-cycle payment, next-cycle uncertainty, negation, Hinglish, and genuinely unknown cases. Avoid complaint-only selection. A sample story written by the project is a **synthetic fixture**, not a golden item.

For each frozen input, the Fellow independently labels the focal current state from the seven-state enum in [ARCHITECTURE.md](ARCHITECTURE.md), marks whether a proposed duplicate-payment instruction, invented finality/cause, advice or pressure would be severe, and records the supported phrase or why the state is unknown. Do this **before** reading model output. Keep private source text and labels in `.local/` only. Assistant labels cannot be renamed human labels.

## Compare and decide

Run the frozen inputs through the same Worker and model configuration used for the demo. Record actual output or processing failure, latency, model ID and whether the deterministic validator fell back to unknown. Human-review each prediction for severe errors and counts of invented or missed fields; mark `human_adjudicated: true` only after that check. Score each item as correct, wrong, abstained, invented or missed; report counts and denominators before percentages. The headline state checks are: explicit-state recall at least 70%, unknown preservation at least 90%, no severe error, and at most one processing failure per ten calls. If an applicable denominator is zero, the gate is unmeasured, not passed. Code cannot certify semantic safety from a JSON shape alone.

**Release decision:** all gates pass → consider enabling the public AI proposal path with the runtime validator and fixed fallback. Any severe error → keep AI off, simplify or repair, and report the failure. One-field development repairs must be labelled development reuse; rerunning the same frozen inputs does not create a fresh independent result. Compare the same cases with current Groww help and the fixed guide before claiming incremental AI value.

## What has actually happened

- Synthetic development call: **1**; proposed `debited_processing`, source-anchored; account and next-payment verification flags false; latency about **611 ms**. No general accuracy claim.
- Focused engineering tests in the release checkout: **7/7 passed**. Full project tests: **135/135 passed** before the final pause-guard tightening; rerun after it.
- Independently human-labelled real golden items for this MVP: **0** evidenced. Real target-user MVP task tests: **0** evidenced. Thus the public AI release gate is **pending**.
