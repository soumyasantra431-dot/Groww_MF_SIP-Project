# SIP Continuity Receipt: pre-build PM gate

**9 November 2026 IST. Decision: start the bounded MVP build.** This is a reversible solution experiment, not a validated intervention or a claim about Groww retention. Read with [CONTEXT.md](CONTEXT.md), [FINAL_PROBLEM_BOUNDARY_2026-11-09.md](FINAL_PROBLEM_BOUNDARY_2026-11-09.md), and [FINAL_MVP_SOLUTION_CONTRACT_2026-11-09.md](FINAL_MVP_SOLUTION_CONTRACT_2026-11-09.md).

## Decision and evidence

- **Metric [VERIFIED definition, OPEN value]:** count one eligible first-time MF investor at month 12 if any qualifying SIP instalment finally succeeded in the prior 30 days. A failed plan, bank debit, one-time order, or current-month manual workaround does not by itself settle this person-level outcome. Groww cohort size, baseline, reach and lift are unknown.
- **Observed signal [VERIFIED self-report]:** a [Groww writer](https://www.reddit.com/r/MutualfundsIndia/comments/1wtfugh/grow_autopay_failure_help/) reports a previously working AutoPay routine followed by repeated failures, manual investing and help-seeking. Other [Groww](https://www.reddit.com/r/MutualfundsIndia/comments/1t2f3wm/grow_auto_pay_failed/) [accounts](https://www.reddit.com/r/MutualfundsIndia/comments/1nhirn2/need_some_updatesclarifications/) describe current-cycle recovery and other SIPs processing. None proves strict cohort fit or the following scheduled outcome.
- **Existing solution [VERIFIED capability]:** Groww already documents [pending SIP Pay](https://groww.in/help/mutual-funds/mf-sip/how-do-i-pay-for-my-sip-installment-if-the-autopay-debit-has-failed--40), [approved AutoPay troubleshooting](https://groww.in/help/mutual-funds/searchable/my-autopay-is-approved-even-then-my-sip-failed), [ONE-TIME and conditional Pay Now](https://groww.in/help/mutual-funds/mf-sip/how-do-i-pay-for-a-missed-installment-3), and [processing after bank debit](https://groww.in/help/mutual-funds/order/why-is-my-sip-order-not-completed-1). Documentation proves available routes, not that a particular investor understood or resolved the problem.
- **Product bet [ASSUMPTION]:** an automation-reliant routine restorer may need help separating *this instalment's reported state* from *whether the next automatic instalment is actually established*. The technical fault and whether explanation changes behavior are unknown. A deliberate budget adjustment remains the closest rival; an informed pause is a valid outcome.

## Why research can stop before building

The nine discovery questions, metric tree, contrasting behaviors, current Groww help, segment choice, rival mechanism, and safe task are already documented. Another general review batch cannot verify transaction finality, silent continuation, next-month success, or month-12 retention. Those require Groww person-level data and/or real screened participants. No new broad corpus collection or gallery review is a prerequisite for this **prototype**.

## What must happen in the build and evaluation

1. Reconcile the dirty root checkout with the deployed engine branch without losing either. Keep the MVP a separate task from the discovery engine.
2. Implement the [solution contract](FINAL_MVP_SOLUTION_CONTRACT_2026-11-09.md): de-identified one-story input; AI **proposal** with a literal anchor; editable correction; deterministic state/official-link choice; current-cycle receipt; separate next-scheduled checkpoint; visible unknown and no-investment-advice fallback. No account access or payment execution claims.
3. Compare the *same frozen cases* across existing Groww guidance, a fixed non-AI guide, and the AI receipt. Freeze an independently hand-labelled set of about 20 **real, de-identified** examples for the quality report; use synthetic fixtures separately for edge-case engineering. Count correct, wrong, abstained, invented and missed fields before rates. A false completed-payment claim, duplicate-pay direction, invented cause, advice or continuation pressure blocks the AI route.
4. Test and deploy only the safe path. Record actual public link, model status, error counts and whether the fixed guide remains the fallback. Test three real target users if available; simulated walkthroughs must be labelled simulations.

## Claim boundary at handoff

**Ready to build:** yes. **Ready to call the target problem validated:** no: 0 of the requested 5–6 target interviews and no strict-fit current-versus-next-payment contrast. **Ready to call the AI useful:** no: independent golden-set agreement and real-user task comparison have not been run. **Ready to claim NSM effect:** no: no Groww cohort or payment telemetry. These limitations belong in the evidence log and final deck rather than being filled with mock interviews or invented percentages.
