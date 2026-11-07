# Remaining graduation project: decision-led research plan

**Scope:** Parts 2–8 and the final deliverables. This plan follows the brief's North Star Metric and the current discovery engine. It does not claim a chosen problem, completed interviews, validated AI accuracy, or a deployed investor MVP.

## Starting position and decision rule

- The public discovery viewer has nine Fellow-endorsed **draft research directions** and four unranked problem leads. Eight public source pages sit behind the nine drafts; most accounts are on adjacent platforms or have unknown first-year Groww fit.
- The local ledger has 100 user-voice entries plus three controls. Fifteen have assistant coding proposals; 31 distinct forum source units are locally usable. The store review collection recorded 932 IDs, 309 keyword matches and 52 selected review candidates. The 52 are not the basis of the nine answers. None of these counts measures Groww retention or investor prevalence.
- The independent approximately 20-item human golden set is incomplete. The earlier extraction development check failed; its numbers cannot be reported as validated model accuracy. The live answer rewording and the failed post classifier are separate capabilities.
- Decide each step with: **decision → unknown → method → evidence and rival → updated decision → reversal condition**. Preserve a legitimate pause as a valid user choice. Do not select a feature to rescue the metric before showing a user problem.

## Part 2 — Decompose the business metric

**Decision served:** which changeable moment could plausibly increase the share of eligible investors with a successful SIP instalment at month 12, without pressuring an unsuitable continuation?

1. Freeze a measurement contract for a hypothetical Groww cohort: first-ever mutual-fund investor, first SIP start on Groww, day-zero event, month-12 checkpoint, and payment-finality rules. Ask a Groww data owner to resolve start event, reversal, original-versus-any SIP, and exclusion rules if internal access becomes available.
2. Arithmetic: `month-12 active rate = unique eligible cohort investors with ≥1 successful qualifying SIP instalment in the preceding 30 days / unique eligible cohort investors reaching the month-12 checkpoint`. Count one person once. Multiple SIPs, retries and rupees are separate units. Baseline and cohort size are **unknown** publicly.
3. Map the first-year journey: setup and mandate → first payment → repeated scheduled payments → checking and interpretation → deliberate adjustment or interruption → recovery or continued non-payment → month-12 state. Recovery can loop; do not multiply stage rates as if the funnel were strictly linear.
4. At each checkpoint, use mutually exclusive **observed payment states**: qualifying success, no qualifying success, or status unknown. Separately code intent and reason: intended payment blocked, informed pause/change, passive drift, moved platform/plan ended, or unknown. Do not force a bank failure, a deliberate pause and an unclear app status into one “churn” cause.
5. Build a metric tree with proximate product outcomes: correct setup, clear due/payment status, successful intended instalment, informed control use, recovery by the next scheduled payment, and appropriate continuation. Add guardrails for unwanted/pressured continuation and misleading advice.
6. For each node, attach the evidence and its limit. Public accounts can reveal a mechanism; only Groww cohort events could estimate node rates or the North Star. Internal data request, if available: month-1 through month-12 unique-person survival by cohort, payment outcome/reason/actor, skipped or edited before cancellation, recovery by next due date, direct versus regular route, and segment cuts. Keep the denominator and missing statuses in every cut.

**Output:** one metric tree, a one-page data dictionary and an unknowns list. **Gate:** every proposed opportunity has a plausible path to a qualifying month-12 payment and a separate user-value test; no public-post count is called reach.

## Parts 2–3 — Compare leads, then choose a provisional research segment

The discovery engine's four leads are: initial payment and next-date meaning; an intended payment that does not complete; consequences of pause/delete/cancel; and weakened trust after unclear payment or support. Compare them **without an automatic score** on source strength, observed user consequence, proximity to the metric, Groww's ability to influence it, rival explanation, and a feasible discriminating test. Mark reach and month-12 impact unknown.

The first **provisional** fieldwork focus is a first-time Groww mutual-fund investor in months 1–12 who intended to make a scheduled SIP payment but saw a failed, delayed, or unclear status. This is a recruitment hypothesis, **not** a selected root cause. It is a useful first test because an intended payment has a direct path to the qualifying event and the rival (bank/mandate condition versus app comprehension/recovery) is observable. Recruit comparable continuers who faced a difficult or confusing month so that a problem report is not mistaken for a drop-off cause. If direct Groww cases cannot be found, leave the opportunity unresolved and report the gap; do not promote Coin accounts into the target cohort.

## Part 3 — First-hand research methodology

**Purpose:** find the sequence and next scheduled-payment outcome that public accounts usually omit, and learn whether the investor wanted to continue, adjust, or pause.

- Recruit **5–6 eligible people**: approximately 3–4 with an intended payment interruption or uncertainty and 2 with a comparable difficult month who continued or made an informed change. Screen separately for first-ever mutual-fund investing, first SIP on Groww, and first-year timing; record unknown or ineligible honestly. The nine existing survey responses are a secondary lead and possible recruitment pool, not six interviews.
- Use a 20–30 minute, semi-structured **critical-incident interview** or interactive written exchange with follow-up probes if a call is impractical. A one-off form answer is a survey response, not an interview. The Fellow contacts participants and records consent; the assistant prepares questions and analyses de-identified notes. Do not request PAN, bank/account numbers, exact balances, portfolio screenshots or names in the research dataset.
- Start with the participant's goal and expected SIP behavior. Ask for one recent difficult or ordinary month: what was due, what they saw in Groww and outside it, what they believed, what they did, who helped, what happened immediately, and what happened at the **next scheduled instalment**. Ask what they normally check and when; probe a deliberate pause/change as a valid outcome. Avoid asking “Did market falls make you stop?” or suggesting a feature.
- Record each account as `intent → trigger/event → app/bank signal → interpretation → action/workaround → immediate result → next scheduled result`. Keep verbatim meaning, observed fact, participant belief and researcher inference separate. Make a comparable continuer/interrupter matrix; look for disconfirming cases.
- Stop a provisional explanation if a participant's account contradicts it; update the comparison. Five or six interviews can establish mechanisms and language, not population prevalence.

**Output:** recruitment and consent ledger without identifiers, neutral guide, 5–6 de-identified episode summaries if actually obtained, and a synthesis showing where primary accounts agree with or challenge the engine. If fewer are obtained, report actual count and use no simulated person as a participant.

## Part 4 — Define one problem only after the comparison

Write one problem statement with: **eligible segment; specific month-1 to month-12 moment; desired user progress; observed interruption; supported root-cause mechanism; existing workaround; product outcome; link to the North Star; strongest rival; unknown reach; reversal condition**. Show the chain `business metric → product outcome → discovery lead → first-hand episode → updated problem`. A market move can be context or trigger, never the entire root cause. If the mechanism is mainly an upstream bank issue or an informed pause, choose a different product problem or narrow Groww's role.

## Part 5 — Choose, build and evaluate an AI-native MVP

Compare the current Groww path, a simpler non-AI aid and one AI concept against the chosen task. AI earns its place only if it safely interprets messy, user-stated circumstances or ambiguous status in a way a fixed FAQ/control explanation misses. Do not add AI merely because the brief asks for it.

Build one narrow, real-task flow: input with private-data guard → bounded interpretation linked to an official product/payment-status source → clear options and uncertainty → safe fallback or decline when evidence is insufficient. Do not recommend funds, predict returns, assert a payment succeeded without confirmation, or nudge through fear or urgency. Deploy a public link that another person can operate. Measure its output on a **frozen, human-labelled task set** before enabling any high-stakes answer. The discovery-extraction golden set and MVP-task set may require different labels; put both in the same Evidence Log but never merge their agreement rates. If the same approximately 20 real de-identified items genuinely support both rubrics, document how.

## Part 6 — Test the MVP with users

Return to at least **three people from the chosen segment**. Let each bring a real, de-identified uncertainty or task; do not ask them to transact. Observe task completion, what they understood, whether they found and trusted the source, any mistaken inference, and whether the fallback was useful. Record actual task, result, quote/paraphrase, error, and change for the next iteration. A demo on fabricated scenarios is an engineering check, not a three-user test.

## Part 7 — Define success

- **Business:** the brief's unique-person month-12 active-SIP rate; baseline, sample and causal lift remain unknown without Groww data.
- **Leading outcomes:** for the selected eligible task, correct payment-status comprehension; appropriate next action; recovery of an **intended** missed payment by the next scheduled date; successful informed adjustment when continuing unchanged is unsuitable. Define each numerator, denominator, observation window and exclusions after the problem is chosen. Do not use clicks or answer length as success.
- **AI quality:** supported factual-field recall, unknown/abstention preservation, invented or unsafe claims, source-link correctness and task-level usefulness. Report `correct / wrong / abstained / unrun` with counts before percentages and a frozen golden-set denominator.
- **Guardrails:** false assurance of payment success, advice/recommendation output, pressured continuation, privacy leakage, unsupported actor blame, and repeat support contact caused by confusion. Any severe advice or payment-status error is a release blocker.

## Part 8 — Risks and mitigations

After choosing the actual MVP, rank only the risks that fit it. Likely candidates to test: wrong status interpretation, wrong attribution to Groww instead of bank/mandate rails, encouraging an unaffordable SIP, hiding a legitimate pause, weak source coverage, private financial details in input, poor fallback, and an apparent short-term task gain with no month-12 effect. Pair each with a detection signal, safe fallback, owner and reversal/rollback condition. Do not present a generic risk checklist as validation.

## Submission package and evidence rules

1. **10-slide PDF:** (1) objective/cohort; (2) metric decomposition; (3) one-slide discovery-engine flow and quality check; (4) evidence and nine-question gaps; (5) unscored opportunity comparison; (6) first-hand research and what it challenged; (7) chosen segment, moment and root cause; (8) solution and non-AI alternative; (9) live MVP, eval gate and three-user test; (10) success metrics, risks and limits. Put a link/QR for the discovery engine and the separate MVP on the relevant slides.
2. **Discovery-engine link:** the current public viewer exists and its nine-question search is testable. The live new-post classifier is deliberately disabled after its failed development check. Describe the actual workflow; do not claim it analysed all 932 collected review IDs.
3. **MVP link:** a separate public task flow is still required and must pass its own quality gate. A live URL and an HTTP 200 alone do not prove a user task succeeded.
4. **AI Evidence Log:** one viewable document with source-family collection **and analysed** volumes separately, exclusions, about 20 genuinely hand-labelled real items, label timing and provenance, model agreement with denominators, 2–3 actual rejected/corrected outputs, and a limitations section. Existing automatic field rejections are real diagnostics but are not three human corrections. Never fill a missing cell with a mock account or simulated interview.

**Immediate next research decision:** finish the metric tree and four-lead comparison, then use the result to screen the 5–6 people for one provisional segment. Do not choose the MVP feature before those episodes establish a moment, user value and a Groww-controllable mechanism.
