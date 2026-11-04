# Problem Statement — Groww SIP AI Discovery Engine

**Status:** working requirements reference, 4 November 2026.

**Source of assignment:** the user-provided NextLeap graduation brief (original pasted text).
**Purpose of this file:** keep the discovery engine's job, evidence boundaries, and expected outputs clear during the local prototype build. This is not a claim that the underlying investor problem, winning segment, or solution is already known.

## 1. The assignment in plain language

The project role is Growth PM at **Groww**. The assignment gives a business outcome but does **not** give the underlying user problem. We must investigate what happens after a first-time mutual fund investor begins a first SIP, including ordinary continuation, deliberate changes, interruptions, recovery, and unclear endings. The AI discovery engine is the **first research instrument**: it helps a PM search and compare source-backed accounts, identify possible problems, and decide what to investigate next. Its outputs are starting points for later primary research and product judgment, not final answers by themselves.

The brief mentions Groww, Zerodha Coin, and INDmoney as product context. Groww is the chosen product for this project; other platforms can provide explicitly labelled contrasts. The engine's scope is mutual-fund SIP behaviour relevant to the **first 12 months**, rather than stock trading, F&O, IPOs, one-time fund purchases, or generic investment advice.

**North Star Metric (verbatim):** “Increase the percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one.”

**Active (brief definition):** at least one successful instalment in the last 30 days.

The user has interpreted the target as first-time mutual-fund investors starting their first SIP on Groww. Public accounts rarely verify first-ever MF status, precise tenure, or payment finality, so each fact must be coded as stated, unknown, or adjacent. We must not silently turn “new to Groww,” “first SIP,” and “first-ever MF investor” into equivalent statements.

### Arithmetic and interpretation

For a mature, fully defined cohort, the metric is `number of eligible unique investors with a qualifying successful SIP instalment in the preceding 30 days ÷ number of eligible unique investors reaching the 12-month checkpoint × 100`. Count an investor once, regardless of how many SIPs or payment retries they have. A contribution reduction can still leave the investor active. A legitimate, informed pause may be good for the investor while not qualifying as active. Holding fund units is not evidence that another scheduled instalment succeeded. A missed debit, a cancellation of one of several SIPs, and account inactivity are different observations.

The exact cohort entry event, start of the 12-month clock, payment finality, treatment of reversed transactions, and whether a qualifying instalment must be on the original SIP are **unresolved measurement definitions**. The engine must preserve the underlying events rather than manufacture a precise metric. No public-post count, industry SIP-account count, investment inflow, or app-review count is the numerator or denominator of Groww's NSM. No baseline, lift, or causal impact has been established.

## 2. Why the discovery engine exists

The brief requires an AI-powered workflow **before proposing a solution**. It should make a large, messy set of public conversations usable for a specific PM decision: **which first-year SIP-continuation situation deserves deeper investigation, for whom, and why?** The engine should reveal what people report doing, wanting, seeing, and deciding; what is merely inferred; what contradicts an emerging explanation; and what the available evidence cannot tell us.

This is more than sentiment analysis or a generic summary of reviews. The engine must help identify, quantify **where the sample allows**, and compare potential opportunity areas that might influence the stated business metric. Quantification means transparent counts within the collected and admitted material, each with its denominator, selection method, and exclusions. It does **not** mean population prevalence, a churn probability, or Groww's retention rate.

The evaluator should be able to understand in a short visit: **what went in → what was excluded → what AI proposed → what a person reviewed → what each answer is supported by → what remains unknown → why a candidate opportunity merits a next test.** Source links must sit behind material claims and counts.

## 3. The nine questions the engine must address

These are the brief's discovery questions; preserve all nine even when evidence is weak.

1. Why do people start a SIP, and what do they expect to happen?
2. What changes in their behaviour in the months after starting?
3. What leads investors to pause, reduce or stop a SIP?
4. What do investors check, and how often, once they have started?
5. What confuses or worries them inside the app?
6. What do they do outside the app when they feel unsure?
7. What separates investors who continue from those who quietly drop off?
8. How do these patterns differ across user segments, including income stability, age, source of money, and who influenced them?
9. What unmet needs emerge consistently across conversations?

**Honest answer rule:** for each question, show a direct evidence-bounded answer, the relevant accounts and source links, a counterexample or rival explanation where available, a count with its actual denominator where meaningful, and the remaining unknown or next discriminating question. If the evidence cannot answer a question, say so clearly. In particular, public posts usually cannot measure checking frequency, identify silent drop-offs, or establish differences across the whole eligible cohort.

## 4. Source universe and what each source can establish

The brief says sources **such as** App Store reviews, Play Store reviews, Reddit discussions from Indian investing communities, investing forums such as TradingQ&A, social media conversations, YouTube comments on personal-finance videos, and other publicly available conversations about SIPs and first-time investing in India. These are candidate source families, **not a guarantee that seven live feeds or seven equivalent samples exist**. The engine should represent all named families and disclose their actual intake status, count, permission basis, and contribution. It must never show fabricated coverage.

Short reviews and comments may reveal a reported status, confusion, or attempted action, but often omit chronology, first-time status, intent, and final outcome. Longer first-hand accounts may support an event sequence, while still lacking verified transactions. A company help page is evidence of a documented capability, not evidence that an investor saw, understood, or used it. Industry research and expert articles are **context or hypothesis sources**; they do not pad the user-voice item count. A forum thread and its replies are one dependent discussion for evidence counting, unless independently authored experiences are clearly distinguished.

**Current access finding, dated 4 November:** the official Play and App Store owner review APIs do not grant the Fellow access to Groww's owner-side reviews. Apple's India Media Services terms restrict scraping and equivalent manual collection/analysis, so App Store reviews are not an admitted corpus under that route. Reddit research requires an approved route under its Responsible Builder Policy; search visibility is not permission for model processing. TradingQ&A has a stated CC BY-NC-SA licence for user contributions; its examples must still be screened for target fit and attributed by link, without usernames. YouTube, social, and other source-specific routes still require a terms and feasibility check. See [pre-engine source feasibility](research/PRE_ENGINE_SOURCE_FEASIBILITY_2026-11-04.md). Do not work around a restricted source by calling a copied spreadsheet “mock” or “public.”

The existing **nine survey responses** may be used later as a separately labelled secondary triangulation lane, not as the primary web corpus and not as nine interviews. Synthetic cases can test software behaviour only; they cannot supply investor evidence or make the engine's research answers appear more complete.

## 5. What the engine must do with an admitted account

The approved engine job is a traceable sequence, with human judgment retained:

1. **Record provenance and access:** source family, original link or locator, source date, collection/check date, permitted use, and whether the item is first-hand, attributed second-hand, company context, expert context, or synthetic fixture. Keep research and synthetic lanes separate.
2. **Protect privacy and normalize:** remove personal identifiers before storage; standardize platform/instrument terms, dates and statuses; group duplicate, reposted, or dependent material. Do not retain PAN, account or bank details, phone numbers, emails, names, exact balances, or portfolio screenshots.
3. **Screen relevance and fit:** distinguish mutual-fund SIP from stock SIP, one-time purchase or generic investment talk. Mark cohort fit `direct Groww first-year`, `adjacent`, or `unknown`; do not infer age, income, first-time status, or tenure from stereotypes.
4. **Reconstruct a reported episode when possible:** capture starting purpose and expectation, circumstance or trigger, what the investor intended, what occurred (including system or payment event), action inside or outside the app, reported reason, and known/unknown ending. Separate *attempted*, *completed*, *reversed*, *hypothetical* and *not stated* actions. Separate intention from payment outcome and from the author's interpretation of a cause.
5. **Code the journey and metric relationship:** note the reported first-year stage and whether the event concerns setup/mandate, first or second instalment, later months, recovery, or an unknown point. Give the *initiating focal event* one supported exit-form label: involuntary, voluntary, possible passive drift, not-real drop-off, continuer, or unknown. A mixed sequence is preserved as multiple events with a separate final outcome, rather than invented as a single root cause or current enum value. Preserve the difference between an investor's welfare and the NSM classification.
6. **Review and count:** AI proposes labels and short grounded paraphrases; the researcher accepts, corrects, or leaves them unresolved. Code computes counts deterministically from admitted, deduplicated source roots/episodes. Every visible count identifies its unit, denominator, exclusions and review status. Do not divide complaint mentions by all users or treat several posts in one thread as independent people.
7. **Answer and compare:** assemble the nine source-backed answers; then present candidate opportunity areas with evidence strength, potential reach **only if a defensible proxy exists**, fit with constraints, existing workaround/control, rival explanation and next test. The engine does not automatically rank or choose one.

The same account can inform several questions, but it is not several independent accounts. Missing fields remain `unknown` rather than being filled by a fluent model. A source may state a reason without proving it is the technical root cause; the engine should preserve **reported reason → supported situation → researcher driver hypothesis** as different layers.

## 6. Visible prototype outputs and quality standard

The discovery engine link must be **testable by an evaluator**. A sufficient prototype is a usable research workspace, not a production-scale data platform. At minimum it should visibly provide:

- An orientation that names the North Star Metric, the research question, and what the engine can and cannot infer.
- A source/coverage funnel: screened, admitted user-voice, target-fit, adjacent, complete or partial episodes, human-reviewed, and excluded, with reasons and denominators. Context documents and synthetic fixtures shown separately.
- Nine question views with concise answers, underlying episode/source drill-down, counterexamples, and explicit unknowns.
- Filters for source, cohort fit, journey stage, reported action/outcome, and hypothesis or candidate problem; source links behind material counts.
- A comparison of potential opportunities **without invented prevalence or an automatic winner**, plus a next-research question for each candidate.
- A safe tester path using an allowed new public text example: structured proposed classification, uncertainty where warranted, privacy warning/filtering, and no presentation of the output as investment advice. Any live model call must respect the user's free-tier-only instruction and current source-use rules.
- A clear indication of whether a label or finding was model-proposed, human-reviewed, corrected, or still unrun.

The brief also requires a one-slide explanation of **how the workflow gathers and analyzes data, identifies themes, generates insights, and checks quality**. Its AI Evidence Log must give sources and actual volume, a golden set of about 20 items labelled by hand, the agreement rate with a clear denominator, and 2–3 real examples where AI output was rejected or corrected. Do not claim blind human evaluation if labels were adjudicated after inspecting model outputs; do not invent corrections or present a development smoke test as accuracy proof.

The engine's acceptance standard is *truthful usefulness*: an evaluator can trace an answer to real permitted material, see the quantity and limits of that material, understand why a candidate issue matters to a first-year SIP decision, and see an honest unknown when evidence does not support a claim. A polished interface or working API alone does not meet that standard.

## 7. Guardrails and non-goals

- Do **not** recommend specific funds or stocks, predict returns, or present content as investment advice. Do not use fear, FOMO, or urgency nudges.
- Do **not** assume more SIP continuation is always better for an investor. An informed pause or stop can be appropriate; record it separately from unwanted interruption.
- Do **not** use “markets fell” as the entire root cause. A market event may be a context or trigger; investigate the person's interpretation, circumstances, options and subsequent action.
- Do **not** claim internal Groww analytics, a cohort retention rate, population prevalence, causal impact, an investor's true motive, or a technical fault when only a public report is available.
- Do **not** let generic stock complaints, competitor parity, marketing copy, or mock investor stories decide the target problem.
- Do **not** automatically choose a segment, first-year moment, root cause, feature or MVP. Those are later PM decisions, informed by the engine and further research.
- Preserve counterexamples and rival explanations. Unknown evidence is an acceptable result; invented certainty is not.

## 8. Boundary with the rest of the graduation project

After the discovery engine, the full assignment still requires a metric decomposition, selection of a target segment and opportunity, primary research (the original brief asks for 5–6 interviews), a supported problem definition, a functional **separate** eval-gated AI-native MVP, tests with at least three target users, solution metrics, risks, a deployed MVP link, a public AI Evidence Log, and a maximum 10-slide PDF. Written survey responses must be labelled as such; they do not silently satisfy the interview requirement. The engine should provide evidence and questions for these later decisions, not pretend they are already complete.

Submission deadline: **9 November 2026, 3:59 PM IST**. The user approved this bounded engine contract and the local prototype build on 4 November. The agreed development sequence is to make the local version understandable and testable, review it, and only then move code to GitHub and Cloudflare. This file specifies the engine's **problem and required behavior**; subsequent `context.md`, architecture, and implementation files should say how the build will meet it and report actual progress without rewriting the brief's objective.

## 9. Source-of-truth order for disagreements

1. Original NextLeap brief for the assigned metric, nine questions, deliverables and explicit restrictions.
2. The user's latest explicit instructions for project scope, evidence handling, build sequence and free-tier preference, provided they do not silently change the metric.
3. Dated, original source pages for factual claims and source-use restrictions.
4. [Project charter](PROJECT_CHARTER.md), [nine-question evidence audit](research/NINE_QUESTION_EVIDENCE_AUDIT_2026-11-04.md), and [pre-engine source feasibility](research/PRE_ENGINE_SOURCE_FEASIBILITY_2026-11-04.md) for existing PM interpretation and unresolved gaps.

If these disagree, record the discrepancy and its consequence instead of silently merging them.
