# Edge cases — Groww SIP AI Discovery Engine

**Date:** 4 November 2026. **Status:** design and test register, not a claim that these cases already pass.
**Read with:** [Problem Statement.md](Problem%20Statement.md), [architecture.md](architecture.md), and [implementation-plan.md](implementation-plan.md).

## How to use this file

This register covers plausible corner scenarios across source collection, investor meaning, extraction, counting, evaluation and the public demo. It is not possible to enumerate every future post or product state. Add a case when real evidence or a failure reveals a new boundary; do not quietly change a definition to make a test pass.

**Priority:** `P0` can cause a false research claim, privacy/source-use breach, misleading metric, investment advice or unsafe public release; it blocks the affected path. `P1` can materially distort an answer or evaluator understanding and must be reviewed before publishing a claim. `P2` is a usability/coverage limit that must be disclosed if unresolved. A case's **expected behavior** is the acceptance rule; its **check** says how to exercise it. Synthetic fixtures test software only. Real, permission-cleared accounts are needed to test evidence quality. No fixture is counted as investor research.

## A. Source access, collection and evidence lanes

- **S01 · P0 — A source page is public, but its terms restrict scraping or model analysis.** Expected: mark `restricted`; do not collect, import or send text to the LLM. Check: source-register entry and a dry run make zero model calls. Applies to the currently recorded App Store route.
- **S02 · P0 — Reddit text is visible in search results but approved research access is absent.** Expected: URL may remain a lead, not corpus text or model input. Check: attempted intake is blocked and coverage shows `0 analysed` for that lane.
- **S03 · P0 — A user provides a spreadsheet copied from a restricted source and calls it “mock data.”** Expected: identify its real provenance; do not admit it as a synthetic fixture or licensed corpus. Check: import requires source family and permission basis, not just CSV columns.
- **S04 · P0 — An API key can read the user's own app reviews, not Groww reviews.** Expected: no claim of Groww API access; route stays unresolved. Check: source register names app-owner scope and no collector points to an unauthorised Groww endpoint.
- **S05 · P1 — A collector is permitted for one forum or video but another source in the same family has different terms.** Expected: source-specific decision, not family-wide clearance. Check: second origin remains pending until its own record is approved.
- **S06 · P1 — A link is pasted without original text.** Expected: `lead_only`, no analysed-item count and no LLM answer. Check: link-only intake cannot increment the research funnel.
- **S07 · P1 — A page disappears, is edited, or changes visibility after collection.** Expected: keep dated locator and derived review trail, flag source unavailability/version uncertainty; do not imply the original is still verifiable. Check: broken-link review changes answer status or shows a limitation.
- **S08 · P1 — A search query returns many relevant-looking snippets but no inspected original.** Expected: zero admitted accounts until originals and source-use basis are checked. Check: search-result count is separate from screened-original count.
- **S09 · P1 — A source quotes another person's story or a platform support reply.** Expected: label second-hand/quoted material and speaker; do not count it as the poster's own episode. Check: thread fixture with author, reply and quoted story yields one clearly attributed focal account or stays uncertain.
- **S10 · P1 — A company help page, expert newsletter or industry study describes a SIP problem.** Expected: context/hypothesis lane, not a user-voice episode or prevalence denominator. Check: user-voice count is unchanged after import.
- **S11 · P1 — The same public item is used to answer several questions.** Expected: link it to multiple Q IDs but count its source root once within each question; do not add question totals as distinct people. Check: Q1 and Q3 both cite one item without producing two investors.
- **S12 · P1 — Seven source families are listed but only two have permitted, relevant content.** Expected: show all seven lanes with actual zero/status; do not synthesize rows to fill them. Check: coverage view names the absent families and reason.
- **S13 · P2 — A permitted source yields no MF-SIP accounts despite a search.** Expected: log the exact query/date and `no relevant yield`; do not treat zero as proof users have no issue. Check: collection run exists with screened and kept counts.
- **S14 · P1 — YouTube creator advice is mixed with comments describing a viewer's own experience.** Expected: separate creator context from commenter user voice; do not treat “you should pause” as “I paused.” Check: two-speaker fixture.
- **S15 · P0 — A private group, login wall, CAPTCHA or anti-bot block appears.** Expected: stop that collection route, record access limit, and proceed with other permitted routes. Check: no bypass attempt or hidden scrape.
- **S16 · P1 — A source date is missing, malformed, future-dated, or reflects an edit rather than the event.** Expected: retain date type and precision separately; do not assign a journey month or calendar trigger from the page timestamp. Check: date fixtures and source-review note.

## B. Privacy, consent and local storage

- **P01 · P0 — PAN, bank/account number, phone, email, username, full name or exact balance appears in text.** Expected: reject or safely de-identify **before** local storage and model use; keep only useful non-identifying meaning. Check: privacy fixtures plus manual review. Existing regexes are not proof every name or amount is caught.
- **P02 · P0 — An identifier is in the URL, query string, screenshot, OCR text, file name or source locator rather than body text.** Expected: sanitize/reject the whole record. Check: sensitive strings never appear in DB, logs, exports or public bundle.
- **P03 · P0 — A forum reply quotes another user's personal details.** Expected: redact/reject the quoted details before model input; do not preserve the quote as an evidence anchor. Check: nested-quote fixture.
- **P04 · P0 — A survey answer is first-hand but AI-processing consent is unclear.** Expected: keep it in a separate blocked/secondary lane; do not send to a model or public snapshot until documented consent and de-identification are established. Check: no provider request from that ID.
- **P05 · P1 — An investor's exact rupee amount matters to affordability interpretation.** Expected: retain a qualitative cue or broad range only if justified and de-identified; no exact balance in paraphrase. Check: generated label contains meaning without the amount.
- **P06 · P0 — A model echoes raw text or private data in a paraphrase or error.** Expected: reject output; log only safe failure codes; no publication. Check: synthetic PII echo and provider-error fixture.
- **P07 · P0 — A pasted public-demo item is logged or stored.** Expected: transient processing only, minimal disclosed operational logs, no body retention. Check: inspect Worker logs/storage and network response after a test paste.
- **P08 · P0 — Raw local CSV, SQLite, `.dev.vars`, key, survey file or reviewer note enters `dist`/snapshot/Git.** Expected: fail snapshot/deployment gate. Check: scan staged files and built assets for sensitive paths and known fixture strings.
- **P09 · P1 — A source contains a real person's name as author but the post text otherwise has useful evidence.** Expected: use a non-identifying link/locator and paraphrase; do not display or store author name. Check: public item card has no name.
- **P10 · P1 — A source is later deleted or permission is withdrawn.** Expected: restrict it, invalidate dependent answers, rebuild snapshot and retain only a safe audit reason. Check: exclusion propagates to counts and citations.

## C. Duplicate, speaker and source-root arithmetic

- **D01 · P1 — Same item appears twice with tracking parameters or URL fragments.** Expected: canonical locator/fingerprint groups it once; source item and duplicate counts remain visible. Check: two URL variants yield one root.
- **D02 · P1 — Same text appears on two platforms as a repost.** Expected: flag cross-post for manual review; do not count as independent corroboration until source/speaker independence is established. Check: near-duplicate fixture.
- **D03 · P1 — A long thread has one original poster and ten replies.** Expected: distinguish replies/advice from OP actions; count the discussion/root once for source breadth unless an independent first-hand account is separately identified. Check: root count differs from comment count.
- **D04 · P1 — OP updates the thread after a week and reports recovery.** Expected: attach update to same episode, preserve earlier failure and later state; do not count two people or erase the failure. Check: timeline fixture.
- **D05 · P1 — Two investors report different experiences in one thread.** Expected: separate speaker-attributed episodes if both are truly first-hand; keep one dependent thread for cross-source corroboration. Check: episode count may be two, root count one.
- **D06 · P1 — Identical wording describes genuinely different people.** Expected: text similarity alone does not merge them; manual independence review. Check: separate stable locators retained with an ambiguity flag.
- **D07 · P1 — One person has several SIPs or retries.** Expected: episode/payment-event count can exceed one, but no verified investor-level count is inflated. Check: one-person fixture with two SIPs and three attempts.
- **D08 · P1 — A duplicate is discovered after an answer was approved.** Expected: invalidate downstream counts, answer and snapshot; rerun and review. Check: version/staleness flag changes.

## D. Instrument and target-cohort fit

- **C01 · P0 — “SIP” means stock SIP, insurance premium, subscription or recurring deposit.** Expected: not a mutual-fund SIP episode; exclude or mark instrument uncertain. Check: adversarial acronym fixtures.
- **C02 · P1 — A post mixes stocks, MF lump sum and SIP but does not say which product the complaint concerns.** Expected: `instrument=unknown` and no MF-SIP problem claim. Check: mixed-product fixture.
- **C03 · P1 — First SIP on Groww, but investor previously held mutual funds elsewhere.** Expected: first-SIP-on-Groww may be supported; first-time-MF is contradicted or unknown. Keep adjacent, not confirmed target. Check: independent eligibility fields.
- **C04 · P1 — First mutual-fund purchase was a lump sum; first SIP begins later.** Expected: do not silently redefine “first-time MF”; preserve both dates and cohort ambiguity. Check: eligibility remains unresolved until metric convention is approved.
- **C05 · P1 — “I am new” could mean new to Groww or investing.** Expected: first-ever MF stays unknown. Check: no target label from that phrase alone.
- **C06 · P1 — Platform is inferred from subreddit/forum/listing URL but not stated by the writer.** Expected: metadata may suggest source location, but platform experience is stated only if the text supports it; otherwise unknown/adjacent. Check: platform field and source family remain distinct.
- **C07 · P1 — Coin or INDmoney investor describes a relevant first-year sequence.** Expected: adjacent contrast, not Groww target count. Check: question card labels platform and separates denominators.
- **C08 · P1 — User does not know whether direct, regular or MF Prime route applied.** Expected: route `unknown`; never infer from app screen, date or marketing. Check: missing route fixture.
- **C09 · P1 — First-year timing is vague (“a while ago,” “last year”).** Expected: time bucket unknown or broad; do not assign months 3–6/7–12 without support. Check: no exact month in output.
- **C10 · P1 — Experienced investor speaks about their first difficult year retrospectively.** Expected: adjacent/contrast unless first-time and platform facts are explicit; not a verified month-12 payment record. Check: source-fit label with limitation.
- **C11 · P1 — AMC-managed SIP and platform-managed SIP are discussed as if their controls are identical.** Expected: preserve the stated route and responsible actor; leave route unknown if unstated. Check: competitor/AMC fixture.
- **C12 · P1 — Manual payment, bank mandate, UPI AutoPay and one-time purchase are conflated.** Expected: separate payment rail and action type; do not infer that a workaround changed the SIP schedule. Check: payment-mode fixture.

## E. SIP lifecycle, intention, action and outcome

- **M01 · P0 — SIP is registered and mandate approved, but no first instalment succeeded.** Expected: setup success is not payment success or active status. Check: separate mandate and instalment states.
- **M02 · P0 — Bank debit occurred but order was rejected, reversed or refunded.** Expected: no qualifying success claimed without finality; keep bank debit, order and refund as separate events. Check: outcome remains unknown/non-success as supported.
- **M03 · P0 — App says “pending” while bank shows debit.** Expected: status conflict, not a proven platform fault or completed instalment. Check: actor/blame and outcome remain attributed/unknown.
- **M04 · P1 — AutoPay expired, limit was exceeded, bank balance was low, or bank account changed.** Expected: code only the reason stated in the source; actor responsibility remains unverified unless supported. Check: four separate fixtures plus unknown-reason case.
- **M05 · P1 — Manual “Pay Now” recovers a missed due date.** Expected: record recovery attempt and reported result; do not equate a one-time MF purchase with a SIP-linked successful instalment. Check: separate action types.
- **M06 · P1 — Investor intentionally skips/pauses for a planned expense or loss of income.** Expected: voluntary choice and welfare context; no “bad churn” language. Active status at checkpoint is a separate measurement question. Check: pause story has no fear nudge.
- **M07 · P1 — One of several SIPs stops but another continues successfully.** Expected: one arrangement stops; investor-level inactivity is not established. Check: `exit_form` and final investor state do not imply churn.
- **M08 · P1 — Amount is reduced or SIP date changes, with contributions still succeeding.** Expected: adjustment, not automatic exit; classify status by actual reported contribution. Check: amount-change fixture.
- **M09 · P1 — SIP is cancelled but holdings remain invested.** Expected: holding status and future SIP contributions are separate. Check: “still invested” never becomes “SIP continues.”
- **M10 · P1 — Investor silently stops posting or deletes app.** Expected: no `passive` exit inferred; payment and intention unknown. Check: no activity update is not a lifecycle event.
- **M11 · P1 — Investor restarts after several missed months.** Expected: initiating interruption and later recovery both recorded; a later success does not erase the earlier event or prove month-12 active. Check: two-timepoint fixture.
- **M12 · P1 — SIP tenure ends as planned, or investor moves to another platform.** Expected: describe `not_real` as a *reason for apparent drop-off* only; do not automatically remove an otherwise eligible investor from Groww's metric denominator. Check: metric and welfare outcomes stay separate.
- **M13 · P1 — Market fall is mentioned near a pause.** Expected: market is context/trigger; do not call it the root cause without the person's interpretation and action sequence. Check: rival explanation remains visible.
- **M14 · P1 — Advice says “stop the SIP,” but the author only asks whether they should.** Expected: hypothetical/considered, not completed stop. Check: speaker and action status.
- **M15 · P1 — A second SIP starts; its first payment occurs in the first investor's month eight.** Expected: investor clock does not reset to month zero. Check: original and arrangement start dates stored separately.
- **M16 · P1 — 12-month anniversary falls near a month with no scheduled payment in the preceding 30 days.** Expected: follow the brief's last-30-days definition, not a twelve-payment-streak assumption; record unresolved measurement convention where transaction data is absent. Check: date-boundary fixture.
- **M17 · P1 — Success occurred exactly on the boundary of the 30-day window, or date is ambiguous.** Expected: no exact active calculation until timezone, inclusion/exclusion and clock origin are agreed; public account remains unknown. Check: boundary dates and `Asia/Kolkata` handling.
- **M18 · P1 — A debit retry succeeds after the first failed attempt.** Expected: one investor and one due-date episode with two attempts; final outcome separated from initiating failure. Check: no double-counted person.
- **M19 · P1 — Source says “12 months of SIP” but reports holding value, not actual instalments.** Expected: continuation at month 12 remains unknown; do not infer successful payments from portfolio value. Check: retrospective story fixture.
- **M20 · P1 — Voluntary and involuntary events overlap (planned pause after a failed debit).** Expected: preserve sequence and multiple stated reasons; use supported initiating tag or `unknown` when focal boundary cannot be resolved. Do not force `mixed` into the current enum: `engine/contracts.mjs` currently has no such `exit_form` value. A future schema change needs a migration and tests. Check: output validates and both events remain available.

## F. Question-specific answer traps

- **Q01 · P1 — Starting motivation is inferred from a friend's advice.** Expected: answer Q1 only with the investor's stated goal/expectation; who influenced them is a separate supported cue. Check: one friend-advice-only account leaves personal expectation unknown.
- **Q02 · P1 — Before and after come from different authors.** Expected: Q2 does not join them into one behavioural trajectory. Check: answer identifies cross-sectional contrast, not “the investor changed.”
- **Q03 · P1 — “I may reduce” is presented as “I reduced.”** Expected: Q3 labels contemplated versus completed action and known ending. Check: negation/modal fixture.
- **Q04 · P1 — “I check XIRR sometimes” becomes “checks weekly.”** Expected: Q4 names what was checked, but frequency remains as stated/unknown. Check: no invented cadence.
- **Q05 · P1 — Generic stock-trading or KYC complaint is framed as SIP confusion.** Expected: Q5 requires a SIP-related screen/status/control and reported consequence. Check: unrelated app review excluded from Q5.
- **Q06 · P1 — Support or forum reply suggests contacting a bank; author never did.** Expected: Q6 describes advice received, not an outside-app action taken. Check: original author versus reply separation.
- **Q07 · P0 — Public posts are used to claim what separates “quiet drop-offs” from continuers in the Groww population.** Expected: state silent people are unobserved; offer a hypothesis/contrast only, with need for Groww cohort or primary data. Check: answer contains no prevalence or causal claim.
- **Q08 · P1 — Income stability/age is guessed from city, ticket size, salary date or writing style.** Expected: unstated factor remains unknown; no demographic stereotype. Check: factor output and comparison denominator.
- **Q09 · P1 — Repeated complaint wording is labelled a proven unmet need.** Expected: require desired progress, consequence/workaround, existing control, independent roots, rival and next test. Check: candidate card stays a hypothesis.
- **Q10 · P1 — One source supports several questions and its absence later changes multiple answers.** Expected: dependency tracking invalidates each affected Q card and opportunity comparison. Check: remove source and compare versioned output.

## G. One-LLM extraction and synthesis failures

- **L01 · P0 — Source text contains “ignore previous instructions,” a fake system prompt or investment-advice request.** Expected: treat it as untrusted data; no instruction override or fund recommendation. Check: prompt-injection fixture.
- **L02 · P1 — Negation and contrast: “I did not stop,” “one SIP stopped, others did not.”** Expected: preserve the negated scope; no false exit. Check: paired negation fixtures.
- **L03 · P1 — Hinglish, Romanized Hindi, abbreviations or misspellings (“SIB,” “autopay,” “instalment”).** Expected: classify only supported meaning, allow uncertainty, do not translate into a stronger claim. Check: varied language fixtures and human review.
- **L04 · P1 — Sarcasm, quoted advice, rhetorical question or hypothetical job loss.** Expected: no completed action or actual life event inferred. Check: modality fixtures.
- **L05 · P1 — Same evidence phrase appears twice and source anchor is ambiguous.** Expected: flag for review or use a longer unique anchor; do not attach the wrong occurrence. Check: repeated-clause fixture.
- **L06 · P1 — Anchor is absent, shifted by Unicode/emoji, or points to different text.** Expected: reject supported field or convert to review-needed; do not publish it. Check: UTF-16 offset and normalization fixture.
- **L07 · P0 — Strict JSON fails, enum is invalid, field is missing or output is truncated.** Expected: processing failure; no partial answer promoted to accepted evidence. Check: malformed/truncated provider fixture.
- **L08 · P1 — A source is longer than the request limit.** Expected: reject or split with explicit source segment and speaker context; no silent truncation that changes negation or outcome. Check: long-input fixture.
- **L09 · P1 — Free-tier 429, timeout, unavailable provider or exhausted token envelope.** Expected: safe `unrun/failed` status, usage telemetry and no paid fallback or infinite retry. Check: mocked HTTP failures.
- **L10 · P0 — Model invents a date, platform, author blame, SIP success, source URL or citation ID.** Expected: schema/source-ID/anchor validation rejects it; human review before publication. Check: adversarial invented-field fixture.
- **L11 · P0 — Model turns a reported reason into a verified technical root cause or company fault.** Expected: keep reported reason, supported situation and researcher inference separate. Check: bank/platform-blame fixture.
- **L12 · P1 — Model writes an eloquent answer from zero reviewed items.** Expected: show `insufficient evidence`; do not call answer-drafting LLM or reject unsupported prose. Check: empty-corpus Q view.
- **L13 · P0 — Model introduces an unsupported percentage, “most users,” or a recommendation.** Expected: block answer publication. Check: numeric-claim and advice fixtures.
- **L14 · P1 — Same LLM is used to criticize its own draft.** Expected: any critique is an error-finding aid, not independent validation or a second human label. Check: evaluation report keeps reviewer and model roles distinct.
- **L15 · P1 — The model confuses `unknown`, `not_applicable` and `unrun`.** Expected: unknown means the item does not support a value, not_applicable means the field truly does not apply, and unrun means no valid extraction happened. Check: three-state fixture and UI labels.

## H. Counts, comparisons and missing data

- **A01 · P0 — Numerator and denominator use different units (people vs SIP accounts vs rupees).** Expected: reject calculation; display unit mismatch. Check: deliberate cross-unit fixture.
- **A02 · P1 — A percentage is computed with zero or missing denominator.** Expected: `unknown/not computable`, never 0% or division error. Check: empty filtered view.
- **A03 · P1 — Filtering by source/stage changes numerator but leaves old denominator.** Expected: recompute both in the same selected slice and name that slice. Check: filter transitions.
- **A04 · P1 — Q1 and Q3 counts are added to claim distinct users.** Expected: no cross-question addition; overlap is disclosed. Check: shared-source fixture.
- **A05 · P1 — Many replies in one thread appear to strengthen a driver.** Expected: count distinct source roots and source families, not mentions; report dependence. Check: one-thread-many-replies fixture.
- **A06 · P1 — Source-family count is treated as causal or quality score.** Expected: breadth is one signal; preserve source quality, counterexamples and target fit. Check: opportunity card with many weak adjacent sources does not auto-win.
- **A07 · P1 — Missing segment fields are treated as the “no income instability” comparison group.** Expected: unknown is separate from an explicit “stable income” statement. Check: segment comparison arithmetic.
- **A08 · P1 — Negative review volume is divided by store ratings or all Groww users.** Expected: prohibit prevalence claim; denominator is only the selected, reviewed corpus slice. Check: output wording.
- **A09 · P1 — An informed pause is excluded from an otherwise eligible NSM denominator.** Expected: preserve investor welfare and metric result separately; no silent denominator removal. Check: metric-logic fixture.
- **A10 · P1 — `not_real` apparent exit is mistaken for active, or automatically excluded.** Expected: descriptive research tag only; exact metric status stays tied to defined successful instalment and eligibility. Check: tenure/migration fixture.
- **A11 · P1 — Published snapshot is stale after a correction or source restriction.** Expected: mark stale and rebuild all affected counts/answers before publication. Check: correction invalidation.
- **A12 · P1 — A store displays “most helpful” reviews or a video shows top comments.** Expected: disclose the ranking/selection mechanism and never call the visible set a random or representative sample. Check: source-method note next to volume.
- **A13 · P1 — Rejected, rights-pending or AI-only proposed items leak into reviewed counts.** Expected: only the declared accepted slice enters reviewed findings; proposal and exclusion volumes stay separate. Check: ledger-to-view reconciliation.

## I. Human review, golden set and evidence integrity

- **E01 · P0 — AI-generated labels are marked “human verified” without source review.** Expected: remain `proposal`; only actual human action changes review state. Check: review event log.
- **E02 · P1 — Labels made after seeing model output are called “blind” golden labels.** Expected: record `post-AI adjudicated/development reuse`, not independent validation. Check: evaluation metadata and slide wording.
- **E03 · P1 — Golden set contains only short complaint reviews.** Expected: include real permitted continuers, interruption, recovery, informed pause, ambiguity, negation and adjacent platforms; report what could not be sampled. Check: set composition audit.
- **E04 · P1 — A source later changes and its old human label is treated as current fact.** Expected: preserve source/version date, flag verification status and review again if material. Check: changed-original scenario.
- **E05 · P1 — A reviewer changes a field but does not record reason or source.** Expected: correction blocked; old/new values and rationale recorded. Check: empty-reason review request.
- **E06 · P1 — Model abstention on a supported field is counted as correct unknown.** Expected: score `abstained/missed`, not correct; report `K = C + W + A`. Check: evaluation arithmetic fixture.
- **E07 · P1 — Unknown preservation looks high because most fields were unstated.** Expected: report field-wise denominators, explicit-field recall and invented values alongside unknown rate. Check: evaluation report.
- **E08 · P1 — Two or three AI corrections are invented to satisfy the deliverable.** Expected: only logged real corrections; if fewer occurred, report actual count and remaining brief gap. Check: corrections tied to run and source IDs.
- **E09 · P1 — Survey answers are counted as interviews or folded into public-web volume.** Expected: separately labelled written responses/secondary triangulation with their own denominator and consent status. Check: Evidence Log lane counts.

## J. Public viewer, tester and deployment

- **U01 · P1 — First screen shows opaque labels and “22 inputs” without explaining the engine's job.** Expected: state the SIP question, real reviewed coverage, what AI did, and one inspectable example in plain language. Check: two-minute novice walkthrough.
- **U02 · P1 — A question has no accepted target-fit evidence.** Expected: show why it is open, adjacent clues separately and next research question; no filler answer. Check: empty Q card.
- **U03 · P1 — A source link opens a general listing instead of the exact post/review.** Expected: label locator precision and fix or flag the citation; no claim of direct drill-down. Check: click every published example.
- **U04 · P1 — Filter gives zero results or changes source mix sharply.** Expected: explanatory empty state, updated denominator and no stale answer. Check: filter navigation.
- **U05 · P0 — Public endpoint exposes import, review, batch, local database, raw text or credentials.** Expected: only read-only approved snapshot and gated transient classifier; all other routes absent. Check: route probes and asset scan.
- **U06 · P0 — Pasted text is PII-contaminated, source-restricted or asks for investment advice.** Expected: decline with a helpful, non-advisory message before a model call where possible. Check: tester fixtures and request counter unchanged.
- **U07 · P1 — Rate limit or kill switch activates during a demo.** Expected: clear fallback and reason; no fake output, paid call or stored paste. Check: forced limit state.
- **U08 · P1 — Public snapshot differs from reviewed localhost state.** Expected: show version/date, compare hashes/counts before release, retain rollback copy. Check: local/public parity.
- **U09 · P1 — Model provider returns a well-formed but source-unfaithful answer.** Expected: label proposal; source-anchor/claim checks and human publication gate prevent it from becoming reviewed finding. Check: adversarial response fixture.
- **U10 · P1 — Mobile/keyboard user cannot reach source evidence or read a caveat.** Expected: responsive, navigable cards, readable text, visible focus and non-color-only status. Check: phone-size and keyboard walkthrough.
- **U11 · P2 — A public source 404s after deployment.** Expected: limitation shown; do not replace with an unattributed quote. Check: link-health review and fallback wording.
- **U12 · P1 — The one-slide flow or Evidence Log claims more sources/calls/accuracy than the deployed version.** Expected: exports draw from the frozen snapshot/evaluation run and carry the same counts/date. Check: compare deck material, log and public viewer.

## Known design mismatches to resolve during implementation

1. The logical architecture mentions overlapping/mixed situations, while the current `exit_form` enum in `engine/contracts.mjs` permits only `involuntary`, `voluntary`, `passive`, `not_real`, `continuer`, and `unknown`. Use `unknown` plus separate event/reason detail for ambiguous mixed cases unless an explicit versioned schema change is justified. **Do not write invalid `mixed` into the current store.**
2. Existing private-pattern checks catch several identifier patterns but do not guarantee detection of names, location details or every sensitive financial amount. Human privacy review is part of the source gate.
3. The existing public live classifier and local batch routes are held. These edge cases are release criteria, **not** evidence that the routes already pass.
4. The source register must distinguish collection rights, model-processing rights and public-display rights. Approval of one does not silently grant the others.

## Minimum release check from this register

Before publishing the engine snapshot, exercise every `P0` case with a suitable fixture or inspection and record pass/fail; review `P1` cases that touch actual source types and published answers; disclose relevant unresolved `P2` limits. Then perform a manual end-to-end check of **one real, permitted, source-linked account** from intake through extraction, human correction, deterministic count, a nine-question card and public citation. That proves the workflow path works on that account; it does not validate the underlying opportunity or the North Star Metric.
