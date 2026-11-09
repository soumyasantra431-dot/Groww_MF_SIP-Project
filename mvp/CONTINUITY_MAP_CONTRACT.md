# SIP Continuity Map: product and processing contract

**9 November 2026 IST.** A testable next iteration of the [SIP Continuity Receipt](../MVP_CREATIVITY_AUDIT_2026-11-09.md). It is a hypothesis demonstration, not a verified Groww account feature, payment repair or retention intervention.

## Decision and job

**Target situation:** an investor who wanted a scheduled MF SIP contribution after an earlier working routine, then saw a failed or unclear due event and may have paid manually or contacted support. The public source establishes repeated repair burden; first-ever-MF status, actor fault and next-cycle success remain unknown.

**Job:** turn a messy description into five distinct, correctable observations so the investor can tell what happened *this cycle*, what remains unresolved, and what to verify at the next scheduled SIP. The five rows are **intent**, **bank debit**, **Groww order**, **current-cycle workaround**, and **next scheduled result**. A separate other-SIP cue guards against treating one failed plan as a lost investor.

## Input and AI proposal

The user supplies one de-identified account, max 700 characters, or chooses a synthetic sample. The model proposes only bounded values, each with an exact supporting substring from that account. If a value is unstated, it returns `unknown` and no anchor. The model never writes the final guidance, chooses a URL, diagnoses a bank/rail fault or recommends investing. The six fields are:

- `intent`: `wanted | intentional_pause | unknown`
- `bank_debit`: `yes | no | unknown`
- `groww_order`: `completed | processing | failed | pending | not_due | unknown`
- `workaround`: `manual_payment | support_contact | mandate_change | none_stated | unknown`
- `next_scheduled`: `completed | failed | pending | not_due | unknown`
- `other_sip`: `completed | failed | unknown`

`none_stated` means the author explicitly said they took no action; silence is `unknown`. A reported completion is never account-verified. Focal current versus prior and following cycles must not be merged. If a post describes several plans and the focal one cannot be identified, the proposal must abstain.

## Code-based reconciliation

Code checks finite values, literal anchors, privacy, negation and conflicts. A failed or unanchored field becomes `unknown`; a bank debit plus reported order failure raises a conflict, never a second-payment instruction. A current manual payment never changes `next_scheduled` from `unknown`. An intentional pause is not a dropout diagnosis. An `other_sip=completed` cue does not establish the month-12 person-level metric, but prevents wording that calls the person inactive.

The output is a **continuity map** with one row per field and visible `reported / unknown / conflict` states. It then provides one neutral handoff question: check the order's final status, linked mandate, or following scheduled payment as applicable. It links only to a hard-coded official Groww page. The user can correct fields; corrections are self-reports and remain within the current browser session. No raw story, name, account detail or corrected data is saved by the public demo.

## Comparison and release decision

Test the same task with **A: current Groww help**, **B: fixed receipt**, and **C: continuity map**. C earns a place only if a tester more reliably distinguishes bank debit from SIP completion, current manual workaround from next AutoPay, and one-plan failure from person-level inactivity, without more unsafe advice or correction burden. Count correct tasks, unsafe claims, abstentions and corrections with tested-task denominators; do not infer month-12 lift. The public AI path remains off until an independently human-labelled real-item quality check passes. Synthetic calls and engineering tests establish only functionality.
