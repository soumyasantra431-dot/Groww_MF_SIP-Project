# SIP Continuity Receipt — solution decision and MVP contract

**9 November 2026 IST.** Status: [ASSUMPTION] a bounded solution **selected for testing**, not validated user benefit, restored AutoPay, or measured retention. It follows [the final problem boundary](FINAL_PROBLEM_BOUNDARY_2026-11-09.md). This contract governs the next build; iteration and A/B design come after a working, evaluated prototype.

## Decision in one sentence

Build a **two-checkpoint SIP Continuity Receipt** for an investor describing an unexpected failed or unclear *wanted* SIP payment: it separates the **current instalment** from the **following scheduled instalment**, identifies the official check or support route, and states exactly what it cannot verify. The name is a research-prototype label, not a Groww feature claim.

## Why this concept rather than the alternatives

1. **Current Groww help/support [VERIFIED baseline]:** Groww documents [pending-payment Pay](https://groww.in/help/mutual-funds/mf-sip/how-do-i-pay-for-my-sip-installment-if-the-autopay-debit-has-failed--40), [mandate checks](https://groww.in/help/mutual-funds/searchable/my-autopay-is-approved-even-then-my-sip-failed), [ONE-TIME versus Pay Now](https://groww.in/help/mutual-funds/mf-sip/how-do-i-pay-for-a-missed-installment-3), and [processing after debit](https://groww.in/help/mutual-funds/order/why-is-my-sip-order-not-completed-1). It may already be sufficient when the investor knows their state. We must not claim a missing Pay button.
2. **Fixed state guide [ASSUMPTION comparator and fallback]:** a short questionnaire asks whether the bank was debited, Groww shows completed/failed/pending, the payment was wanted, and another SIP succeeded. It can route explicit cases without AI, cheaply and predictably. It may make a mixed or negated free-text account laborious to classify.
3. **AI Continuity Receipt [ASSUMPTION chosen experiment]:** one model proposes only supported fields from a short de-identified description; deterministic code checks the proposal, chooses a fixed official link, and produces a current-versus-next receipt. Its *possible* incremental value is reading mixed language, Hinglish and negation without asking the person to select a technical category first. This advantage is [OPEN]. It is not a bank diagnosis or payment-repair agent.

**Trade-off:** choosing C creates model error and privacy risk for a narrow comprehension gain. It wins no automatic priority over B. If the gain is absent or a severe error appears, the public path uses B and records the AI experiment as unsuccessful.

## One evaluator task and exact flow

1. The tester chooses a labelled sample or types **one** payment story, at most 700 characters, without name, PAN, account, folio, phone, email, exact amount or screenshot. Text is transient and not saved. Ask: *Was this contribution wanted? What did the bank show? What did Groww show? What did you already try?* Unknown is an allowed answer.
2. AI returns a **proposal**, with source phrase anchors, for intended action, reported current state (`not due / unpaid unclear / failed reported / bank debited but processing / completed by report / intentional pause / unknown`) and attempted workaround. It cannot fill unstated fields. The person can correct the proposal.
3. Code rejects unsupported, conflicting, sensitive or advice-like output. The result shows: **What you reported now**; **What remains unverified** (final order, cause, other SIPs); **The matching official Groww check/support page**; **What to verify at the next scheduled instalment**. If a bank debit and a failure claim conflict, show **unknown**, not an instruction to pay again.
4. The current-cycle outcome can be marked *self-reported*; the next-cycle checkpoint is separate and remains **not verified** until the investor checks their actual Groww record. A sample scenario may demonstrate this step, labelled simulation. No prototype state is described as Groww transaction truth.

## Core versus later

- **Core [ASSUMPTION]:** sample and free-text entry; source-anchored state proposal; editable correction; deterministic official route; now/next receipt; unknown fallback; privacy and advice blocks; visible quality status. This is the complete coherent two-minute evaluator task.
- **Later [OPEN]:** account-linked order/mandate data, real bank/rail diagnosis, actual AutoPay repair, saved follow-up or notifications. They require integration and permissions that this project does not have. Do not mimic them with fabricated data.

## What success and failure mean for this prototype

- [ASSUMPTION] **Immediate product outcome:** the tester correctly distinguishes debit, final SIP success, current-month catch-up and next automatic reliability, then identifies the right official check without unsafe action. Count correct/incorrect/unknown per frozen task, not investors retained.
- [OPEN] **AI release gate:** an independently labelled ~20-item task set, with varied states, negation, Hinglish, multiple SIPs, informed pauses, processing-after-debit and privacy cases. Report correct, wrong, abstained, invented and missed fields. Any invented final success, duplicate-payment direction, investment advice or pressure to continue blocks the AI path. A passing synthetic safety test alone is insufficient.
- [ASSUMPTION] **Comparator decision:** give identical cases to current help (A), fixed guide (B) and AI receipt (C). If C adds no clearer, safer interpretation than B, prefer B. A small usability test can show task comprehension, not a 12-month lift or a powered A/B estimate.
- [OPEN] **Downstream metric:** following wanted scheduled SIP finally succeeds, then the brief's person-level month-12 active share; Groww transaction/cohort data are unavailable. A correct pause remains a valid user outcome.

## Current build gap

- [VERIFIED] The local [payment-state module](mvp/payment-state.mjs) and [prototype page](public/sip-help.html) already propose a state, fixed official route, unknowns and a next-instalment instruction. The page is a **one-shot draft**; it does not yet offer editable correction, a genuine later checkpoint, independently measured model quality or a verified public MVP. Do not reuse the discovery engine's extraction test as this MVP's quality result.
