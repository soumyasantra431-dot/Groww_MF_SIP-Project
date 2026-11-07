# From discovery evidence to a justified SIP MVP

**8 November 2026 IST.** This is the working decision path for Parts 2–8 of the brief. It uses the [research decision gate](RESEARCH_DECISION_GATE_2026-11-08.md) and the current engine's limited evidence. It does not declare a final segment, root cause, or solution.

## Outcome and decision to make

The business outcome is the **percentage of eligible first-time mutual-fund investors with at least one successful SIP instalment in the 30 days before month 12**. The project decision is: which first-year *unwanted* break in an intended investing routine can Groww credibly help a defined group avoid, and does an AI feature help more than a simpler explanation or existing control? A legitimate pause is a good user outcome even if it does not improve this metric.

## Step 1 — Map the metric before picking a problem (Part 2)

**Why:** a missed debit, a paused plan and an inactive *person* are different units. Count each eligible person once. For a cohort of `N` eligible starters, the numerator is the count of distinct people with at least one qualifying successful instalment in the last 30 days at their month-12 checkpoint; continuation = numerator / `N`. The public corpus cannot supply either company count. Do not estimate this rate from posts or review volume.

**Product paths to inspect:** setup and mandate completed → first and second instalments → months 3–6 → months 7–12 → recovery or informed adjustment. At each path ask what the person meant to do, what payment/order state actually occurred, what they understood, what they did next, and whether any other SIP still qualified. Separate bank/mandate execution, Groww status/control experience, and changed personal circumstances. A visibility improvement may reduce anxiety without increasing completed instalments; a payment reminder may encourage an unsuitable investment. Those second-order effects are decision inputs, not footnotes.

**Output:** a person-level KPI tree with observable *leading* measures (for example, successful recovery before the next due date among eligible interrupted people) and guardrails (unwanted investment pressure, mistaken status interpretation, duplicate payment, advice-like output). Baselines and reach remain `needs Groww data owner` unless actual event counts are supplied.

## Step 2 — Compare problems, not complaint totals (Parts 2–4)

**Current candidates:** A repeated/unexplained intended payment interruption; B difficult adjustment under changed circumstances; C confusion about the initial next due date. The engine may surface these as **leads**. The bounded desk review found 10 selected public user-voice locators, across two source families, and no fully confirmed target-cohort month-12 outcome. The separate survey has nine submissions, not nine eligible episodes. These sets cannot establish incidence or rank reach.

**Comparison questions for every candidate:** Who had the intention and ability to continue? At which first-year moment? What did they see and do? Was the ending unwanted? What existing Groww control or outside workaround was available? Which actor owns the failure? What is the rival explanation? What subsequent scheduled instalment happened? Which proposed behavior change could plausibly affect the person-level numerator, and could it harm the user? Record `unknown` when the evidence stops.

**Decision rule:** prioritize a candidate only when a direct eligible episode demonstrates an unwanted outcome, a specific Groww-addressable step, and a credible path to the metric without violating the user guardrails. If evidence supports only a usability issue, state that narrower claim. Do not use a weighted score with invented reach or lift.

## Step 3 — Validate the opportunity with people (Part 3)

**Method:** 5–6 neutral critical-incident written interviews, or short live interviews if available, with people screened for first-ever mutual-fund investment, first Groww SIP and first-year timing. Recruit both an interruption/adjustment account and a comparable continuer who had a difficult month. A convenience survey is a separate, weaker lane. If five eligible respondents cannot be reached, report the achieved number and the brief requirement as unmet. Never present simulated stories as interviews.

**Question order:** (1) why they started and expected the first payments to work; (2) one specific recent due date and intended action; (3) what bank/app showed in their own words; (4) how they interpreted it and what they actually did inside and outside Groww; (5) the immediate result **and the following scheduled instalment**; (6) other active SIPs or platform moves; (7) what would have helped and what they would *not* want. Ask about concrete past behavior before hypothetical preferences. Do not collect PAN, account numbers, exact balances or screenshots.

**Analysis:** code intent, event, interpretation, action and outcome separately. Compare at least one contrary case for each candidate. Separate reported reason from observed situation and PM driver hypothesis. A five-whys chain is a *questioning aid*: stop when the next “why” requires an assumption. Contrast what people say they value with what they did. Note which source or follow-up would reverse the interpretation.

## Step 4 — Commit to a problem, then compare solutions (Parts 4–5)

Write one falsifiable problem statement: **for [screened behavior-based segment], at [specific first-year moment], [observed circumstance] leads to [unwanted action/outcome] because [supported mechanism], despite [good initial intent]; current workaround is [observed action].** Link the user value and business path, and list the rival explanation and missing data. Avoid demographics as a substitute for behavior, and do not call market decline the root cause.

Map the actor whose behavior must change: investor, Groww interface/support, bank/mandate, order rail or AMC. Then compare three approaches on the same real task: existing Groww flow, a plain non-AI explanation/control, and the proposed AI aid. AI earns its place only if it can interpret a varied user-described state or question **more safely and usefully** than the simpler alternative. The paused payment-status prototype is one candidate, not the selected answer.

**MVP gate:** freeze a small set of real, de-identified test inputs and hand-labelled expected classifications; add contrary/unknown cases. Report correct, wrong, abstained and invented fields with denominators. Block investment advice, unsupported payment diagnosis and pressure to continue. Show a safe fallback to official help when the state is unknown. A technical build passing tests is not evidence that the opportunity is valid.

## Step 5 — Test, measure, present (Parts 6–8)

Ask at least three screened users to complete a real non-transactional task using the deployed MVP. Record task, initial interpretation, action, final understanding, errors, trust and whether they would use the existing flow instead. Never invent this test if participants are unavailable. Define the success chain from eligible month-12 person-level continuation to the specific leading behavior, then guardrails and AI quality; propose an experiment only after the user problem and task are supported. Record the most likely failure modes for the selected solution and how the fallback handles each.

The ten-slide deck should show the chronological decision: metric → evidence limits → contrasting behavior → primary research → chosen segment and problem → alternatives → MVP and eval → user test → metrics → risks. The Evidence Log must distinguish collected IDs, admitted user accounts, human labels, model proposals, corrections and unknowns. Percentage graphics require the actual unit and denominator. Missing research is shown as missing, not filled with mock results.
