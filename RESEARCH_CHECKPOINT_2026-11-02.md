# Active research checkpoint — Monday, 2 November, before the four build documents

**Reconstructed on 4 November 2026.** The files `problem statement.md`, `context.md`, `architecture.md` and `implementation plan.md` were first created between 11:23 and 11:27 PM IST on Monday, 2 November. There is no Git commit from the minutes before their creation. This checkpoint returns to the **PM research position** immediately before that document-writing task; it does not claim an exact historical code restore. The later documents, code and raw working files are preserved locally and are parked.

## The assignment we are solving

Product: **Groww mutual fund SIPs**. Role: **Growth PM**. North star metric, exactly as assigned: **“Increase the percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one.”** Active means **at least one successful instalment in the last 30 days**. The deadline is **9 November 2026, 3:59 PM IST**.

The brief supplies the outcome to improve, **not** the underlying customer problem. We still need to discover which first-year investor situation is consequential, supported by evidence and plausibly changeable by Groww. A responsible pause can be a good investor outcome. No fund or stock recommendations, investment advice, fear, FOMO or urgency nudges belong in the solution.

The eventual academic outputs are a testable AI discovery engine, evidence log, ten-slide PDF, and a separate AI-native customer MVP with task testing. Those deliverables remain; this checkpoint intentionally returns to research before choosing the problem or building further.

## What research had established by this checkpoint

- The [charter](PROJECT_CHARTER.md), [31 October reasoning audit](research/project_audit_2026-10-31/AUDIT.md) and later [2 November build handoff](BUILD_HANDOFF_2026-11-02.md) are the dated source records. They agree that the target, actor map, company context and many possible SIP journey events were mapped. They do not establish the size of the eligible Groww cohort, a month-12 baseline, the frequency of any failure mode, a chosen segment or a root cause.
- The 31 October audit reconciled **80 research claim records**, not 80 investors. Its archived comparison had **22 source-account records over 21 conversation roots**; all **22 independently verified month-12 outcomes were unknown**. Those self-reports were useful for framing rival explanations, not estimating investor prevalence.
- Seven written survey responses existed in a separate small sample. They were not the brief's five to six interviews and did not measure month-12 activity. The survey could generate or challenge a question, with its real response quality and limits disclosed.
- The local engine at the 2 November handoff had **20 historical seed inputs, zero accepted coded findings, zero narrative answers and no validated extraction**. Its existence did not prove a customer problem. Its code and data are parked for later reuse only after the PM research direction is clear.

## What remains open

First-time MF versus first SIP versus first on Groww; the start date and successful-instalment finality; the eligible unique-investor numerator and denominator; which experiences are involuntary failures versus intentional changes; where the reported problem occurs in months 0–12; how often people check; what happens outside the app; which continuers and recovery accounts challenge a proposed cause; the user consequence and workaround. Public posts can report experiences but cannot reveal silent drop-off or Groww transaction rates.

Keep people, SIP arrangements, instalments, accounts and rupees as different units. For a mature cohort, `eligible investors = confirmed active + confirmed inactive + unresolved`; do not treat missing follow-up as inactivity. Keep reported reason, supported situation and PM inference separate. A market movement is context or a stated trigger, not an automatically proved root cause.

## Recommended immediate PM step

Do **one research decision at a time**. First reconcile the existing user accounts and survey against the exact first-year Groww cohort and event sequence: **what did each person intend for the next contribution, what event occurred, what action followed, and what outcome is actually stated?** Record direct, adjacent and unknown cohort fit, plus a contrary continuer or informed-pause case. This determines whether we have a real candidate problem to investigate and which missing fact requires a different method. It is a short evidence audit, not a new engine design or an automatic segment choice.

For every subsequent pass, write: **decision → consequential unknown → source/method able to observe it → original evidence and denominator → rival explanation → updated decision or next test**. The seven named public-source families remain possible inputs, with source-specific access and relevance checks. Expert or company material is context; mock investor stories are demonstrations, not findings.

## Parked material and recovery

The four late-Monday build documents and later collection-to-answer/31 October-reset documents were copied to the local D: archive before removal from the active root. Tracked history is on `archive/nov04-misread-oct31-reset-before-monday-research`, with an earlier engine-work archive branch and a verified Git bundle. Ignored `research/` and `.local/` were also copied to D:. The older [build handoff](BUILD_HANDOFF_2026-11-02.md) remains as a factual record of prototype status, not an instruction to resume engineering. No research source, pilot record or code was deleted from its archive.
