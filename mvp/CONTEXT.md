# SIP Continuity Receipt: MVP context

**9 November 2026.** This document scopes the separate customer-facing AI-native MVP. The [project context](../CONTEXT.md), [problem boundary](../FINAL_PROBLEM_BOUNDARY_2026-11-09.md), and [solution decision](../FINAL_MVP_SOLUTION_CONTRACT_2026-11-09.md) remain the evidence record.

## Who, when, and what

- **Business metric:** percentage of first-time mutual-fund investors with at least one finally successful SIP instalment in the 30 days before month 12. One person counts once across multiple SIPs. The baseline, reach and lift are unknown.
- **Working behavioral segment:** an automation-reliant first-year investor whose recurring SIP had worked, who still wants an affordable contribution, and who encounters an unexpected failed or unclear due event. Public posts establish reported repair effort, not that the authors meet the full first-time cohort definition.
- **Moment:** after a wanted instalment appears failed or unclear, before assuming the next scheduled debit is restored.
- **Job:** understand the reported current state, know which official Groww status/help route to inspect, and keep the *next* scheduled result separate. This prototype cannot repair a mandate or verify a transaction.
- **Closest rival:** an informed budget change or pause; for such a person, continuation is not automatically the right outcome. A bank/rail failure can also remain even with perfect explanation.

## Evidence boundary

Groww already documents Pay for a pending missed SIP, AutoPay linkage checks, conditional Pay Now or ONE-TIME options, and processing after bank debit. These are capabilities, not proof of comprehension or a repaired next cycle. The proposed value of AI is interpreting mixed, negated or Hinglish wording more easily than a fixed questionnaire. That incremental value is untested. No real target interviews, human golden-set result, or three-person MVP task test has been completed.

## Constraints and guardrails

No fund or stock recommendation, return prediction, investment advice, fear/FOMO/urgency, or directive to continue. Do not ask for or retain PAN, account/folio number, contact details, name, screenshot or exact balance. No account connection, payment action, fault attribution, finality claim, or prediction of next AutoPay. An intentional pause is a valid state. A model proposal must be source-anchored, editable, and safely degradable to unknown. Official help URLs and permitted action wording come from code, not the model. The public demo uses the confirmed free-tier model only; no paid fallback.

## Deliverable boundary

Build a usable, public two-minute task with an AI proposal, deterministic safety check, correction, current-cycle receipt, next-cycle verification prompt, and fixed-guide fallback. Measure task correctness and model errors separately from user benefit and month-12 impact. Report missing real-person validation plainly.
