# Project charter — Groww SIP continuation

**Latest state, 31 October:** read `PROJECT_STATE.md` and `research/project_audit_2026-10-31/AUDIT.md` for subsequent build authorisations, zero-cost preference and the user's pause of next tasks. Historical stage restrictions below describe the charter when written; the NSM and evidence guardrails remain in force.

Version 1.0 · 30 October 2026 · Scope review only; no new external research performed.

**Execution update, later on 30 October:** the user released the research hold and authorised the proposed next bounded public-source pass. [Behaviour-sequence findings](research/behaviour_sequences_2026-10-30/findings.md) record the completed manual pass and its collection window, evidence limits and decisions. Earlier statements below about a paused/proposed pass describe the charter's state when written. No change to the NSM/cohort, segment/moment/feature selection, automated collector, outreach or engineering was authorised or performed in that pass. Subsequent research still needs a defined purpose and scope; other decision rights remain intact.

**Status:** adapted from the user's scoping prompt and checked against existing project documents and the original assignment. This charter governs future project work alongside explicit user instructions. It does not approve cohort changes, segment selection, the proposed 56-field engine contract, architecture or engineering.

**Role:** Growth PM at Groww, using expert AI-PM research methods. **Submission deadline:** 9 November 2026, 3:59 PM IST.

## 1. Problem restated — fewer than 200 words

We need to discover which situations prevent first-time mutual fund investors who begin their first SIP on Groww from carrying out their intended investing plans during their first year, and whether addressing a supported problem could increase the share with a successful SIP instalment near their twelve-month anniversary.

The assignment specifies the outcome, not the underlying problem. We must distinguish intentional changes, financial circumstances, operational failures, recovery and measurement artefacts. A person may reduce contributions, pause responsibly, switch arrangements or continue without opening the app; these actions do not share one meaning.

A good project produces a traceable discovery engine, an evidence-supported segment and first-year situation, a defensible problem explanation, and a tested AI-native MVP whose AI role and fallback are justified. It documents counterevidence, limitations and actual user learning without claiming measured twelve-month lift from a short prototype test. The final submission connects the business metric to user value, behaviour, evidence, product outcomes and proportionate evaluation, while protecting informed choices, privacy and legitimate stopping.

## 2. Why this charter helps, and what was corrected

**PM assessment — inference:** the prompt is useful now as a boundary and decision contract. It reduces scope drift and unsupported conclusions. It is not a reason to restart completed company/context work, conduct more generic research or assume our problem is understood in full.

Applied:
- Exact NSM, investor-level counting, source-to-question fit, chronology, counterexamples, unknowns and clear decision rights.
- Both continuers and interrupted journeys, within-app and outside-app behaviour.
- Investor circumstances, system conditions and possible actor incentives as explanatory lenses.
- Existing controls and calendar context before claiming a missing capability.
- Purpose and a consequential decision before each research pass.

Corrections:
1. **Reduction is not necessarily exit.** A smaller successful instalment can still qualify. Preserve amount change separately from activity.
2. **Switching, maturity and platform migration are not automatically “not-real drop-off.”** They may represent successful or legitimate investor choices while still producing Groww-level inactivity under the agreed metric. Preserve investor outcome and metric outcome separately; do not remove these people from the denominator because their reason is legitimate.
3. **Involuntary / voluntary / passive are exploratory pathway labels, not a complete causal partition.** Events can overlap or evolve. A missed payment does not establish intention; absence of an app visit does not establish passive drift. Keep mixed, other and unknown.
4. **“Markets fell” is insufficient as a root cause.** Retain an author's actual attribution, labelled public user account, then investigate the mechanism and alternatives. Do not censor inconvenient evidence or infer market exposure from dates.
5. **Marketing pages remain capability/positioning evidence only.** They can explain promises or documented options but cannot establish what users experienced.
6. **Written responses are not interviews.** The user's chosen practical method is preserved and labelled honestly. The original brief's 5–6-interview requirement remains a submission-compliance gap unless the programme accepts the alternative; acceptance is unknown.
7. **A real small public-evidence pilot already exists.** What is not established is a reproducibly assembled, permission-checked, audited engine corpus with evaluated model outputs. Do not erase existing accounts or describe them as a validated population.
8. **Use conditional fields.** The 56 proposed semantic fields are not 56 compulsory answers per source. Define a small core and applicable optional fields during architecture finalisation; not-stated is expected.
9. **Evidence classes apply to empirical claims.** Project instructions, definitions, proposals and decision records carry their own provenance rather than being mislabelled company-reported or pretending to be investor evidence.
10. **Stopping is local and proportionate.** A protected/unusable source is stopped and logged; it need not stop unrelated authorised planning. A company KPI differing from our NSM is not a contradiction to be “fixed”; substituting it for our NSM is prohibited.

These adaptations are methodological corrections, not changes to the assigned NSM or approved cohort.

## 3. Fixed objective and measurement discipline

**NSM — verbatim:** “Increase the percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one.”

**Active — brief definition:** at least one successful instalment in the last 30 days.

For an agreed, fully observed mature cohort:

**NSM = qualifying unique investors at the twelve-month checkpoint / all eligible unique investors whose checkpoint has arrived × 100.**

One investor counts once, even with several SIPs or retries. Inactivity, cancellation or legitimate stopping does not remove an otherwise eligible person from the denominator. Unknown follow-up is not automatically inactive; report it separately. Not-yet-mature cohorts are censored separately.

For mature-cohort accounting, **N = A + I + U**: confirmed active, confirmed inactive with complete relevant observation, and unresolved outcome. With the stated coverage assumptions, confirmed-active bounds can be **A/N to (A+U)/N**; do not present the lower bound as the exact NSM. No numerical baseline or target lift is established.

Percentage-point change is **new percentage minus baseline percentage**. Relative percentage improvement is **(new percentage minus baseline percentage) / baseline percentage × 100**, only for a nonzero compatible baseline. A higher headcount, higher inflow or more arrangements alone does not demonstrate a higher NSM.

The checkpoint is not a requirement for an uninterrupted twelve-payment streak. Recovery can contribute. Exact cohort entry, clock origin, qualifying success, location and same-versus-any SIP rules remain under the defaults below and require user agreement before a final measurement definition.

## 4. Scope

### In scope

- The user-stated target: first-time MF investors starting their first SIP on Groww and months 0–12; pre-start expectations/setup only where they help explain that journey.
- Motivations, expectations, actual circumstances and specific action sequences; both successful and difficult experiences.
- Involuntary interruption; intentional skip/pause/reduction/cancel; possible passive drift only where supported; recovery, adaptation, continued activity and unknown states.
- Existing Groww controls: skip, edit, conditional Pay Now, separate One-Time purchase, step-up, AutoPay, reporting, support, GR-1 and MF Prime, with source/version/route limits.
- Direct, regular, mixed or unknown plan routes; Prime exposure distinct from opt-in and actual investment route.
- Investor circumstances, system conditions and actor incentives as hypotheses requiring attributed evidence; the existing actor map labels detection location and possible responsibility without inferring blame.
- Within-app and outside-app actions, information sources and workarounds; calendar and first-SIP-relative time kept separate.
- Original public user accounts; company capability material; regulator/industry research and context, kept in separate evidence lanes.
- Relevant experienced-investor or other-platform accounts as explicitly adjacent contrasts, not target-cohort evidence.
- Source-access/terms/privacy checks before collection; manual coding and a source-to-claim trail.
- Unknown eligibility, missing outcomes, duplicate posts, self-selection and invisible silent continuers.
- Feasibility of evidence, measurement and AI evaluation, at a planning level.

**Added omissions to track:** investor-level versus arrangement-level outcomes; attempted versus completed actions; ordinary processing gaps; reversals and linkage; conditional rollout; language/channel coverage; accessibility and comprehension where supported; informed exit; current workarounds; multiple overlapping reasons; within-person changes versus differences between people; and the gap between prototype learning and twelve-month impact.

### Out of scope for the current research stage

- Stock, F&O, IPO and credit behaviour as opportunities; exclude instrument-ambiguous SIP material from MF findings until resolved.
- Repeating Q1 revenue/business modelling, market predictions, fund comparisons or recommendations.
- Generic “SIPs are good” material, marketing testimonials as independent user evidence, or internet volume for its own sake.
- Experienced-investor research as the primary investigation; competitor parity benchmarking, which is a later task.
- Login-walled content, private groups, identity/account/portfolio data, exact balances, usernames or participant-identifying screenshots.
- The seven survey responses in this public-source pass; future use needs an explicit source/consent/scope decision.
- Contacting people, automated scraping, acquiring credentials, paid services or extending an approved time box without asking.
- Segment, moment or feature commitment; final architecture approval, engineering, localhost builds, GitHub pushes or Cloudflare deployment now.

**Stage distinction:** engineering and publication remain eventual deliverables, not permanent exclusions. Once architecture/logic is finalised, the agreed path is local implementation and review, explicit user confirmation, then GitHub and Cloudflare. Researching the customer problem must not be steered toward a convenient AI feature.

## 5. Five biggest ambiguities and current defaults

### 1. Who exactly qualifies as first-time?

**Unresolved:** first-ever MF versus first SIP versus first Groww purchase; whether an earlier lump-sum MF investment affects eligibility; whether prior ownership across platforms is knowable.

**Default:** preserve the user's stated first-time-MF/first-SIP-on-Groww target. Code independently stated first-ever MF, first-SIP and platform facts with self-report/verification status. Ambiguous cases remain eligibility-unknown or adjacent evidence, not confirmed cohort members. Do not introduce a new exclusion rule for prior lump sums.

**Before measurement:** ask the user to approve the exact cohort interpretation. A public claim of being “new” is not independent verification.

### 2. When does the twelve-month clock start?

**Unresolved:** setup, scheduled first instalment, first debit or first qualifying success; exact anniversary/window boundaries.

**Default:** retain available timestamps separately; use a stated tenure interval for exploratory coding. Do not invent a precise journey month, freeze a new start definition or compute a final NSM. Preserve existing conventions as proposals only.

**Before measurement:** approve the start event, timezone, anniversary convention and preceding-30-day boundaries. Registration-only cases must not be silently counted or excluded.

### 3. What is a qualifying success, and where may it occur?

**Unresolved:** finality, reversals, delayed allocation, manual recovery linkage, any SIP versus original SIP and on-Groww versus another platform.

**Default:** separate bank debit, order acceptance, unit allotment, dashboard visibility and SIP linkage. Treat settled SIP-linked success as a proposed measurement mapping, not a verified Groww rule. Keep any-SIP/on-Groww as an existing working scope assumption requiring confirmation; off-platform continuation is contextual evidence, not automatically qualifying.

**Before measurement:** ask for the user's agreement and data-owner mapping if accessible. Do not count an unrelated lump sum as a SIP success.

### 4. What does interruption mean for the person?

**Unresolved:** desired temporary break, financial constraint, involuntary failure, changed goal, passive drift, fulfilled plan, switching or mixed reasons.

**Default:** code event, stated intent, circumstance, recovery and metric status separately. Unknown intent remains unknown. A legitimate pause is a valid investor outcome and may still be metric-inactive; reduction may remain active. Do not assume that “not active” means “bad experience.”

**Before opportunity selection:** evidence must distinguish the proposed mechanism from credible alternatives sufficiently for the decision; unresolved mechanisms stay visible.

### 5. What can the available evidence establish?

**Unresolved:** source access and coverage, strict cohort fit, hidden continuers, written-response acceptance, sufficient human labels and causal validation.

**Default:** public material supports attributed episodes and hypotheses, not population incidence or twelve-month lift. Existing assistant labels are proposals. Structured written responses, if later authorised and consented, stay in a separate primary-evidence lane and are never renamed interviews. The seven responses remain unused here. Submission acceptance and unseen outcomes remain unknown.

**Before stronger claims:** match the method to the claim, document gaps and use a suitable evaluation/comparison. No model agreement or prototype test is evidence of increased twelve-month continuation.

## 6. Existing coverage and remaining research

### What will not be repeated

Project-record status: Q1 business value and actors; documented user-base definitions and journey activities; selected product/rule/market calendar; selected public contrasts; engine logical architecture draft 0.3 and proposed coding requirements. Sources and dates remain in the existing research files. These context tasks are complete to their published scope, not proofs of the underlying user problem.

### All nine required discovery questions remain in the design

**Premise check:** first-time investors and the twelve-month horizon are assignment priorities, not evidence that this population has the highest dropout rate or the largest avoidable problem. Their comparative strategic advantage remains unknown. Use experienced investors only as a relevant contrast; do not launch a new broad market study to justify the assigned scope. The submission deadline creates a delivery constraint, not evidence of investor urgency.

1. **Why start / expectations:** context and selected accounts exist; target-fit starting episodes and what “success” meant to the person remain thin.
2. **Changes after starting:** need paired timepoints within the same account; cross-sectional differences cannot supply a trajectory.
3. **Pause / reduce / stop:** need event-to-intent-to-outcome sequences, mixed explanations, legitimate exits and recovery; rates remain unavailable publicly.
4. **What is checked / how often:** documented screens exist; actual checking cadence and what sets it off are largely unknown.
5. **In-app confusion / worry:** require concrete information/action and consequence, rather than sentiment alone; current usability is untested.
6. **Outside-app action:** require attributed sequences involving people, information, banks/support or workarounds, not assumed influencer dependence.
7. **Continuers versus drop-offs:** need meaningful contrast cases and outcome coverage; silent continuers are under-observed.
8. **Segment differences:** require supported circumstances and behaviours; age/city/income stereotypes are not explanatory segments.
9. **Consistent unmet needs:** not established by recurring complaint words; need repeated mechanisms, current alternatives, counterexamples and bounded significance.

These are coverage gaps, not nine parallel web-search assignments.

### Recommended next research pass — proposed, not started

**Decision:** which additional evidence can distinguish execution trouble, expectation/understanding, changed circumstances and an informed choice, without selecting a leading cause?

**Method:** one bounded manual source pass focused on concrete first-year sequences and contrasting successful/recovery cases, using only permitted original public sources. Reuse existing accounts first; look for missing sequences rather than repeat generic company research. Seek source/channel diversity when it changes coverage, not equal quotas.

**Core episode questions:** what was intended; what happened immediately before; what was done inside and outside the app; what happened next; whether the outcome matched intent; tenure/platform/eligibility and uncertainties. These define what to code, not a leading interview script.

**Outputs:** a scoped source/episode ledger, source-fit exclusions, unknowns, rival explanations and an update to the next decision. No sentiment-only ranking or population proportions.

**Stop/change method:** if sources repeat the same mechanism, are mostly advice/adjacent material, omit intent/outcome, require login or prohibited collection, stop that route and report the gap. Do not expand queries indefinitely to claim completeness.

**Time box:** not yet agreed. Proposal for the next manual evidence pass: a 60-minute collection cap followed by a checkpoint, with no automatic extension. This is a planning suggestion, not permission to start or exceed it. Research remains paused under the user's current instruction.

### Subsequent work, contingent on evidence and decision rights

- Targeted capability verification only where an unresolved control would change interpretation; use public/non-personal authorised material and stop before protected financial actions.
- Internal aggregate requests only if a Groww data owner becomes available. Do not make unavailable company access a prerequisite for finishing the academic project; state which claims cannot be made.
- Finalise engine intake, mandatory/conditional fields, unknowns, citation/conflict logic, permitted collection, review workflow and evaluation before engineering. The small manual episode model informs this design.
- After approval, build/test the discovery engine before using it to propose a customer solution. An initial pilot is not “at-scale coverage”; report actual source volume and limitations.
- Propose opportunity/segment/moment candidates with rival explanations, user value, metric pathway and guardrails; ask before selection.
- Use structured written primary responses honestly, with approval before contact and clarity about the submission gap. Use them to challenge the selected hypothesis, not ratify it.
- Compare customer-solution mechanisms, including current controls and suitable non-AI baselines. Finalise the eval-gated AI role and safe fallback before MVP implementation.
- Test with at least three actual target users as required by the brief; record task, assistance and outcomes. No builder-run or synthetic test becomes user evidence.
- Complete the evidence log and final deck from the actual chronology, limitations and results. Twelve-month impact remains a hypothesis unless suitable outcome evidence exists.

## 7. Evidence, privacy and decision governance

### Evidence rules

Empirical claims receive the five agreed classes: company-reported, third-party, public user account, inference or unknown. Preserve original URL, source/event/check dates, section/page, scope, paraphrase, claim limits and review status. Documentation supplies capability, not personal experience. Do not store full source text.

Every evidential quantity has a unit, named base/window, calculation or source-reported status, missingness and exclusions. Structural numbering, version numbers and dates are not investor statistics. No missing denominator becomes zero or a guess. No prevalence/rates/probabilities are estimated from public posts.

Public-source counts may describe a clearly labelled reviewed corpus without generalisation, but retain the user's stricter preference to report counts and missingness rather than imply population percentages. Duplicates and overlapping reasons stay visible. Do not infer unique people across platforms.

Preserve counterexamples and rival explanations. Do not label assistant proposals human-verified without the user's confirmation. Synthetic fixtures can test logic, never supply investor findings, interviews or natural behaviour.

### Privacy and stopping

Public-only desk research; no login walls or private accounts. If a source requires login, terms are uncertain or disallowed, or sensitive/identifying data appears, stop extraction from that source and do not retain the values. Record the access/privacy category and seek a permitted alternative; never reproduce identifiers in an escalation.

If a source's metric differs from ours, label it separately. If using it would contradict/replace the NSM or exceed its evidential scope, stop the claim and resolve the mismatch. Do not stop merely because a source challenges a preferred explanation.

Stop at the approved time cap. Do not bypass restrictions, harvest contacts or automate collection without explicit user authorisation and an acceptable route.

### Decision rights

**Assistant may decide:** queries, source order, method fit, coding detail, new provisional codes and analysis changes within agreed scope/time/access. For consequential decisions record date, decision, rationale, rejected alternatives, implications and reversal condition.

**Ask first:** NSM or cohort-definition changes; final operational definitions where ambiguity affects inclusion/outcome; choosing a segment, moment or feature; automated scraping; contacting people; exceeding an approved time box; and the already-agreed architecture/build/publication gates.

A scope charter is not approval for those choices. No external research, collection, model run, contact, engineering or deployment is authorised by this document alone while the current hold remains.

## 8. Delivery and quality contract

Original brief requirements retained:
- A testable AI discovery-engine link and one explanatory slide.
- A ten-slide maximum PDF, with any title slide included in that maximum; anonymous Fellow identity, readable accessible design and working supporting links.
- A deployed AI-native MVP with eval-gated output checks or safe fallback, justified AI value and a suitable baseline.
- An accessible AI Evidence Log: actual sources/volume, about twenty independently hand-labelled items, agreement/error reporting and two to three genuine AI-output corrections or rejections.
- The brief's interview requirement versus the chosen written-response method remains explicitly disclosed.
- At least three real target-user MVP tests, with results and iteration needs.
- Success metrics separate AI quality, task benefit, leading diagnostics, guardrails and the twelve-month NSM.
- Risks include evidence weakness, source access, model misclassification, missingness, harm from pressured continuation, current-product overlap, adoption and measurement.

Original formatting details remain in the assignment: under 40 MB; minimum text sizes appropriate to the authoring tool; clear key-message slide titles; no Fellow name; supporting artefacts viewable. No assurance of grading/acceptance is implied.

## 9. Decisions made in this scope review

**SC01 — adopt an adapted charter rather than restart discovery.** Rationale: existing context can be reused; duplication consumes the submission window. Alternative rejected: redo company/industry research. Reverse if an original definition is contradicted or a material new product/rule change affects the chosen research question.

**SC02 — replace the proposed fixed exit taxonomy with separate event, intent and metric-status fields.** Rationale: reduction may remain active; migration/maturity may remain metric-inactive; intent is often unknown. Alternative rejected: exclude all “not-real drop-off” cases. Reverse only if an explicitly approved cohort/metric definition requires a different treatment.

**SC03 — prioritise missing within-person sequences and continuers before broader context collection.** Rationale: these gaps can distinguish explanations; more company totals cannot. Alternative rejected: search all nine questions or expand corporate research in parallel. Reverse if review of existing evidence identifies another decision-critical, observable gap.

**SC04 — preserve written-response and human-labelling boundaries.** Rationale: method honesty and submission integrity. Alternative rejected: relabel written/synthetic material as interviews or AI labels as human labels. Submission treatment changes only with authenticated programme guidance; research labels do not.

**SC05 — keep the current research hold and unresolved definitions visible.** Rationale: the user requested scope analysis before research and retains key decisions. Alternative rejected: silently finalise the cohort or begin collection while writing the charter. Next research starts only after the user releases the hold and its scope/time box are settled.

## 10. Project references

- [Original brief](<C:/Users/DELL/.codex/attachments/3d37e2de-7109-428e-bd2c-e05ec98c1652/Pasted text.txt>)
- [Project reasoning rules](research/PROJECT_REASONING_RULES.md)
- [Population/journey findings](research/population_journey_2026-10-30/findings.md)
- [Data-owner and research gaps](research/population_journey_2026-10-30/open_questions.md)
- [Proposed coding requirements](research/population_journey_2026-10-30/engine_requirements.md)
- [Nine-question engine coverage contract](research/DISCOVERY_ENGINE_BRIEF_COVERAGE_CONTRACT.md)
- [Logical architecture draft](research/DISCOVERY_ENGINE_LOGICAL_ARCHITECTURE_DRAFT.md)

This is a scoped working agreement and decision record, not evidence that the user problem, causal mechanism or solution is already known.
