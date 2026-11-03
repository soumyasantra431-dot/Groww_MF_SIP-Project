# Problem statement — Groww SIP continuation

**Project role:** Growth PM at Groww, as chosen from the assignment's Groww, Zerodha Coin and INDmoney options.  
**Submission deadline:** 9 November 2026, 3:59:00 PM IST.  
**Status:** assignment and PM interpretation; this document does not claim a discovered root cause or choose a solution.  
**Original brief:** [user-supplied assignment](C:/Users/DELL/.codex/attachments/3d37e2de-7109-428e-bd2c-e05ec98c1652/Pasted%20text.txt). See also [project charter](PROJECT_CHARTER.md).

The original-brief attachment link is local to this computer. This file restates its requirements so the decision contract remains readable without that attachment.

## 1. The assignment in plain language

The company wants more **first-time mutual fund investors** to have an **active SIP twelve months after starting their first one**. Starting is easy; continuing can be affected by circumstances, payment execution, changing intent and the way an investor interprets what happens. The brief does **not** specify which underlying user problem is most important. We must discover a defensible problem before proposing a customer-facing solution.

The exact north star metric (NSM) is:

> Increase the percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one.

The brief defines **active** as **at least one successful instalment in the last 30 days**. A mandate marked active, an investment holding, an app visit, a payment attempt or twelve consecutive payments is not, by itself, this success event. A smaller instalment can still qualify. Several SIPs or retries do not create several investors.

The brief says investors who remain invested may benefit and have greater platform value. That is a strategic premise, **not evidence that every pause is bad for a person**. A deliberate, informed pause can be the right outcome; our product should protect that choice even if the company metric records inactivity.

## 2. Measurement contract and arithmetic

**Unit:** one eligible investor, counted once. **Cohort:** first-time MF investors who start their first SIP, with Groww as the project product. **Checkpoint:** twelve months after that start. **Numerator:** eligible investors with at least one qualifying successful SIP instalment in the preceding 30 days. **Denominator:** eligible investors whose checkpoint is mature and whose eligibility and observation status are accounted for. The exact cohort-entry event, cross-platform first-time test, on-Groww versus any-SIP scope, transaction finality and window boundaries require an explicit metric-owner definition; they must not be invented by the engine.

For a fully defined mature cohort, record `N = A + I + U`: `A` confirmed active, `I` confirmed inactive under complete observation and `U` unresolved status/coverage. Report `A/N` as a confirmed-active lower bound and show `U`; do not quietly relabel unknown as inactive or delete it. If policy permits a bounded sensitivity view, the possible range is `A/N` to `(A + U)/N`. This is a **measurement design**, not a calculation we can make from public posts. Do not include cohorts that have not yet reached month twelve in this checkpoint denominator.

An instalment is a transaction event; a SIP is an arrangement; an account/folio is a record; a rupee flow is money; an investor is a person. These units cannot be substituted. A scheduled debit may fail while the investor still intends to continue. A separate lump-sum payment is not automatically a successful SIP instalment. One SIP stopped while another continues is not automatically investor-level inactivity.

## 3. The PM question behind the metric

**Decision to make later:** which first-year situation, for which eligible or plausibly eligible investor segment, is both consequential to the investor and plausibly changeable by Groww without violating the constraints?

The discovery engine's job is earlier in the chain: find and compare **candidate situations** worth focused validation. It cannot select a final segment, prove a root cause, predict a person's churn, compute Groww retention or show that an intervention will improve the NSM. The later PM decision needs first-hand research and, if available, Groww cohort and payment data.

Possible pathway labels are **involuntary interruption, voluntary change, passive drift, recovery, continuation, legitimate/end-of-plan exit and unknown**. They are coding aids, not an exhaustive causal partition: an account can move through more than one state. Record the initiating event, stated intention, action and final reported state separately. Market moves can be context or a trigger; “markets fell” is explicitly insufficient as a root cause.

## 4. Required AI discovery engine

Before proposing the customer solution, build an AI-powered research workflow that gathers and analyses relevant public conversations. The brief names possible source families: **App Store reviews, Play Store reviews, Reddit discussions, investing forums such as TradingQ&A, public social conversations, YouTube comments on personal finance videos, and other public SIP/first-time-investing conversations in India**. “Sources such as” defines breadth of consideration, not permission to collect all seven or proof that seven live APIs are available. Each source needs a documented collection and model-use basis. Company documents and expert articles explain context; they do not count as investor voice.

The engine must help answer these nine questions, with explicit unknowns when the material cannot support an answer:

1. Why do people start a SIP, and what do they expect?
2. What changes in their behaviour in the following months?
3. What leads them to pause, reduce or stop?
4. What do they check, and how often, after starting?
5. What confuses or worries them inside the app?
6. What do they do outside the app when unsure?
7. What separates people who continue from those who quietly drop off?
8. How do patterns differ by stated income stability, age, funding source and influence?
9. What unmet needs recur across conversations?

The engine must show **how** data was gathered, screened, coded, reviewed and turned into grounded answers. It must **identify, quantify where the evidence permits, and compare possible opportunity areas** that could influence the NSM. Counts from a selected corpus need a unit and denominator and are **not population prevalence**. Sentiment alone or a review summary does not meet the brief. An answer must point to its original sources, distinguish public self-report from verified activity, preserve counterexamples and give the next discriminating research question.

## 5. Work after the engine

The submission must connect **business metric → product outcomes and behaviours → AI discovery → primary research → problem definition**. The PM then chooses a target segment and opportunity, and the original brief asks for **five to six interviews** with that segment about the start, expectations, experience, interruption/continuation, checks, off-app behaviour and what might help. The project currently has seven written survey responses. Written responses can triangulate or challenge engine hypotheses but are **not interviews**; the interview requirement remains a compliance gap unless accepted by the programme.

The eventual problem definition must state the target segment, the specific moment in months 0–12, intended product outcome, evidenced root-cause hypothesis, existing workarounds, user value and business sense. Only then should the team design a **separate customer-facing, AI-native MVP** with an eval-gated AI function, visible quality check/safe fallback, and a clear reason AI improves on a simpler approach. Deploy it so mentors can attempt a real task, then ask **at least three target users** to use it on a real task and record what changed. Short task tests do not prove twelve-month metric lift.

Define leading measures, guardrails, AI quality measures and failure risks for that selected MVP. No fund or stock recommendations; no investment advice; no fear, FOMO or urgency nudges. Do not collect respondent PAN, account numbers or portfolio screenshots. Protect privacy and allow informed pausing.

## 6. Submission artifacts and presentation requirements

- **Testable AI discovery engine link** and one slide showing its source-to-answer workflow.
- **PDF deck of at most ten slides** covering metric decomposition, discovery, user research, segment, root cause, solution, MVP/task test, metrics, risks and limits.
- **Publicly accessible AI-native MVP link** for a real task.
- **Shareable AI Evidence Log** stating sources and real volume analysed; around twenty genuinely **hand-labelled** golden items and the engine's agreement/failures; and two or three **real** AI outputs rejected or corrected with reasons. Assistant/Claude/GPT labels and post-output review do not become blind human gold by renaming them.

Deck: no Fellow name; message-led slide titles; accessible colour/contrast; linked supporting artifacts with viewer access; less than 40 MB; minimum type size 14 in Slides/PPT, 26 in 1920×1080 Figma or 22 in 1920×1080 Canva. The title slide, if present, counts toward ten.

## 7. Current boundaries and reversal conditions

The research engine is a **prototype** that must make its job and evidence legible to an evaluator. It is not a full production analytics system. Its first version can change when source review or a real model check exposes an error; that does not reopen the project's NSM. A public post cannot verify first-ever eligibility, successful bank-to-fund settlement or month-twelve status without additional data. Keep `direct`, `adjacent` and `unknown` cohort-fit lanes separate.

If source evidence cannot distinguish two plausible causes, use a different method (targeted written follow-up, interview, observed task or internal data) instead of declaring a winner. If the model fabricates a supported field, misreads negation or fails its quality gate, block model-based findings and use an honestly labelled manual evidence workspace until repaired. Final segment, problem and feature choices remain open.
