# Current Groww flow versus a plain-language guide

**7 November 2026 IST. Status: documented-flow review and six synthetic-case desk comparison; no logged-in SIP inspection, transaction, participant test, or AI evaluation.** This follows the [knowledge and product-outcome audit](PART3_4_KNOWLEDGE_AND_PRODUCT_OUTCOME_AUDIT_2026-11-07.md). The provisional behavior under study is a first-year Groww SIP investor deciding how to handle an upcoming instalment after a change in cash flow or obligations. An informed pause is a valid outcome.

## Purpose and decision rule

**Question:** Is there an unmet explanation/decision task that an AI MVP could do better than Groww's current controls and a simpler static guide? If the static guide can safely cover the relevant cases and no varied real-language difficulty is observed, an AI layer is not yet justified by evidence. A working demo would test feasibility, not prove demand or month-12 impact.

The comparison uses [six explicitly synthetic cases](fixtures/synthetic_sip_adjustment_cases.json). For each, check: (1) correct official rule, (2) which instalment changes, (3) unknowns/fallback, (4) no pressure or investment advice, (5) source link. These are a **coverage checklist**, not an accuracy percentage from users. The author created the guide and judged its coverage; independent comprehension remains untested.

## What the current flow actually established

**Browser observation:** The user's existing Groww Chrome tab was at a PIN sign-in boundary. No account, SIP-detail, mandate, confirmation, or transaction screen was accessed. No name, contact, account or financial identifier was stored. Thus **0 live SIP flows were observed**, and no claim about current in-app button availability or layout is made.

**Company documentation, inspected on 7 November:**

- [Pause/Skip help](https://groww.in/help/mutual-funds/order/can-i-pause-sip-for-next-month) describes **My SIPs → select SIP → Edit SIP → Skip Installment** and instructs the investor to check the *month shown on the confirmation* before confirming. A separate [Skip help page](https://groww.in/help/mutual-funds/mf-sip/how-to-skip-an-sip-instalment--79) describes a direct Skip control against the upcoming instalment. The wording may reflect different surfaces or versions; the current in-app path remains unverified.
- [Skip timing help](https://groww.in/help/mutual-funds/mf-sip/what-is-the-maximum-period-for-which-i-can-skip-my-sip-installments--63) says one instalment can be skipped at a time; three consecutive skips/misses cancel the SIP; a skip request within **two days** does not affect the imminent instalment. [Edit timing help](https://groww.in/help/mutual-funds/discoverable/when-can-i-edit-my-sip--29) says amount/date/skip changes within **two working days** apply only after the upcoming instalment. The calendar-day versus working-day wording differs, so neither a guide nor AI should promise a particular date without the current confirmation.
- [Failure help](https://groww.in/help/mutual-funds/order/why-did-my-installment-fail--25) lists several possible failure conditions and a **Pay one-time** route; it cannot diagnose a person's failure from a vague description. [Cancellation help](https://groww.in/help/mutual-funds/order/i-cancelled-my-sip-instalment-but-still-my-amount-got-deducted--79) says cancellation inside three days of the upcoming instalment may not prevent that debit and existing invested units remain invested. These are distinct actions; a one-time payment does not prove a later scheduled payment succeeds.

## Static guide candidate: “What will happen to my next SIP?”

**This is a research baseline, not investment advice or a substitute for Groww's live status. Do not enter a PAN, bank/account detail, exact balance, or portfolio screenshot.**

1. **First name the action you want:** skip one upcoming instalment, edit its amount/date, check a failed payment, or cancel future instalments. If you are unsure what is affordable or appropriate, the guide cannot choose an amount or tell you to continue. A deliberate pause may be appropriate.
2. **If you want to skip:** Groww documents **My SIPs → select SIP → Skip/Edit SIP → Skip Installment**. Before confirming, read the **specific month shown in Groww's confirmation**; this, not the guide's prediction, is the month the request targets. Groww says a request close to the due date may apply only later, permits one skipped instalment at a time, and says three consecutive skips/misses cancel the SIP. [Pause steps](https://groww.in/help/mutual-funds/order/can-i-pause-sip-for-next-month); [skip limits](https://groww.in/help/mutual-funds/mf-sip/what-is-the-maximum-period-for-which-i-can-skip-my-sip-installments--63).
3. **If you want to edit amount or date:** use the Edit SIP route only if it is available for *your SIP*. Groww says an edit within two working days of the next instalment applies after that instalment. Check the effective date and processing status shown in your account; do not assume the imminent debit changes. The guide cannot decide the amount or verify mandate eligibility. [Edit timing](https://groww.in/help/mutual-funds/discoverable/when-can-i-edit-my-sip--29).
4. **If a payment seems to have failed:** check its current order/payment state first. Groww lists multiple possible causes and documents Pay one-time for a missed instalment. The guide cannot identify whether your cause is the bank, mandate, balance, a pending order or another actor, and cannot guarantee the next scheduled payment. If status remains unclear, use official support. [Failure help](https://groww.in/help/mutual-funds/order/why-did-my-installment-fail--25).
5. **If you want to cancel:** Groww says canceling stops *future* instalments; money already invested remains invested. A request in the three days before the next instalment may not prevent that debit. Check the displayed result. Stopping one SIP does not establish that a person with several SIPs has stopped investing. [Cancellation help](https://groww.in/help/mutual-funds/order/i-cancelled-my-sip-instalment-but-still-my-amount-got-deducted--79).

**Fallback printed on every route:** “I cannot see your SIP, mandate, due date or payment status. Check the exact month and status in Groww before acting. If they disagree with this guide or remain unclear, use Groww's official help/support.”

## Six-case comparison: documented help versus the guide

These are **six cases, not six investors**. No response time, comprehension, task completion, model accuracy or retention result was measured.

1. **S01, higher expenses and an early skip:** Groww's pause and skip pages state the route, one-at-a-time limit and confirmation month. The guide groups those facts and explicitly preserves the real confirmation as the source of truth. **Safe procedural route available from documentation; actual SIP state unknown.**
2. **S02, skip close to due date:** the help pages warn that an imminent instalment may not be affected but differ on “days” versus “working days.” The guide does not calculate a date; it directs attention to the actual confirmed month. **Guide avoids a false promise; calendar interpretation unresolved.**
3. **S03, variable income and lower amount:** the edit page describes timing, but neither help nor guide can decide affordability or confirm that a particular account offers editing. **Both must abstain on suitability and eligibility.**
4. **S04, informed pause:** the help pages describe Skip; the guide treats a considered pause as valid and notes the three-consecutive-skip condition. **Rule and guardrail covered; later investor outcome unknown.**
5. **S05, involuntary failure:** Groww lists possible causes and Pay one-time; the guide routes to current status and support without guessing the actor. **Troubleshooting direction covered; diagnosis and next scheduled success unknown.**
6. **S06, one of several SIPs stopped:** this is the brief's person-level metric rule, not a help-page question. The guide warns against calling the whole investor inactive. **Counting distinction covered; other-SIP payment status unknown.**

**Coverage arithmetic:** `6 = 2 skip-timing/route cases (S01–S02) + 1 amount-edit case (S03) + 1 informed-pause case (S04) + 1 payment-failure case (S05) + 1 person-versus-plan case (S06)`. The static guide safely routes all six at the *category* level, with explicit abstentions where a person's account or finances would be required. This is **6/6 fixture-category coverage by the author**, not 6/6 user success, model accuracy, or evidence of a retention opportunity. The exact affected instalment remains unconfirmed in every account-specific case.

## PM decision: what AI would have to earn

The static baseline handles the six known case **types** without an LLM. Therefore we must not claim that AI is needed merely to repeat Groww rules or to recommend an amount. The plausible incremental AI job is narrower: **interpret a varied, plain-language description into the right procedural route, preserve uncertainty, and return only the matching official rule plus the account-specific thing the investor must verify.** That is a hypothesis, not an observed advantage.

The next valid comparison should freeze new de-identified natural-language cases *before* tuning; include mixed or negated intent (“I do not want to cancel”), near-due ambiguity, several SIPs, a deliberate pause, and a bank/mandate failure. Compare the static guide and a bounded AI route/explanation on the **same inputs**, with an evaluator checking: correct route; no invented due date or actor; correct abstention; official source; no pressure/advice. A failure on a safety-critical field should trigger the static guide or official-support fallback. Real-user task comprehension remains a separate, unmet brief requirement.

**Reversal condition:** if the static guide routes varied language just as accurately and clearly, or if the live Groww confirmation already resolves the uncertainty for the target behavior, the AI route should be removed or narrowed. If the actual blocker is cash affordability or bank execution, an explanatory AI feature cannot be credited with fixing it.
