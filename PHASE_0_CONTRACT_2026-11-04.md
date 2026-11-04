# Phase 0 contract and baseline — Groww SIP discovery engine

**Contract version:** `2026-11-04-phase-0`
**Date:** 4 November 2026 IST
**Decision served:** define exactly what the engine should do, what existing code can be reused, and what is still unrun before corpus collection or model execution. This is a **build contract**, not a research finding or a claim that the engine works.

## 1. Fixed product job

The [original brief](Problem%20Statement.md) gives the North Star Metric: “Increase the percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one.” Active means at least one successful instalment in the preceding 30 days. The underlying investor problem is unknown. This engine helps the researcher examine permitted accounts of first-year mutual-fund SIP experiences, answer the brief's nine questions within the evidence, and compare candidate situations for **further research**. It does not calculate Groww's NSM, choose the final segment/problem/feature, or give investment advice.

**Architecture decision:** one LLM can propose source-anchored extraction and later draft prose. Code validates, deduplicates and counts; a human checks sources and findings. Separate prompts are processing steps, not independent agents. The decision follows the requirement for traceable evidence and the five-day deadline. A second model or autonomous agent would be reconsidered only if a specific error or unmet evaluator task demonstrates a need.

**Question IDs:** Q1 starting purpose/expectation; Q2 within-person change; Q3 pause/reduce/stop; Q4 checking and stated frequency; Q5 in-app confusion/worry; Q6 outside-app action; Q7 continuer/interruption contrast; Q8 stated segment circumstances; Q9 recurring candidate unmet need. All nine remain visible even if unsupported.

## 2. Frozen input, extraction and answer contracts

### Source item

Minimum local input is `source_family, url, date, text` with optional source locator, platform hint, evidence lane and dependency group. A link without original text is a lead, not an analysed item. Every admitted item needs a recorded source-specific collection and model-use basis before an LLM call. Reject or de-identify personal details before local storage. Raw permitted text is local and gitignored; never place it in the public snapshot.

### Lean extraction

The existing material fields are `source_family`, `platform`, `instrument`, `journey_stage`, `action_status`, `trigger`, `reported_reason`, `blamed_actor`, `outcome`, and `continuer`. Also preserve MF-SIP relevance, direct/adjacent/unknown target fit, first-ever MF/first-SIP/Groww/first-year evidence separately, `metric_node`, `exit_form`, initiating event, final state, short de-identified paraphrase and source anchor. A supported value requires an original-text anchor; missing evidence is `unknown`, not a guess. `not_applicable` is only for a genuinely inapplicable field. The initiating event tags do not overwrite the later ending. Current `exit_form` enum lacks `mixed`; overlapping sequences use supported separate events and `unknown` if one focal tag is not defensible.

Optional deeper extraction reconstructs purpose → circumstance → intention → event → action → outcome on **selected** source-linked narratives. It is not compulsory for a short review. Reported reason, supported situation and researcher driver hypothesis remain different fields.

### Nine-answer output template

Each question uses the same five parts: (1) direct answer within evidence, or `insufficient evidence`; (2) linked supporting episodes; (3) actual count, denominator, unit, cohort fit and source mix; (4) counterexample or strongest rival; (5) unknown and smallest next test. No LLM-written percentage can bypass deterministic count validation. A source can inform several questions but is one source root per question. Question counts do not sum to distinct investors.

### Opportunity comparison

The researcher names candidate problems only from accepted, rights-cleared evidence. Cards compare first-year situation, independent source breadth, reported consequence/workaround, existing Groww control, plausible metric pathway, constraint fit, rival explanation and next test. Reach is `unknown` unless a defensible proxy exists. No automatic ranking or final segment choice.

### Public snapshot allowlist and release check

The intended **item allowlist** is: stable research ID, source family, original public URL and non-identifying locator, source date or `unknown`, short de-identified model-written paraphrase, reviewed derived labels and metric tags, target-fit label with its stated basis, review state, and a dependency-root alias. A **question answer** may add reviewed claim text, supporting item IDs, declared count/denominator/unit, rival or counterexample, limits and snapshot version. Aggregate quality counts and collection totals may be released after checking their provenance. The public file must omit raw original text, exact quote/offset, author identity, private contact or financial details, local raw-file path, API keys, prompt/response transcript, individual survey material, golden labels, reviewer notes and correction history.

Publication requires accepted human review **and** explicit source-specific public-use clearance, privacy scan, source-link check, count reconciliation, version/cutoff date and manual inspection of the generated JSON. The current `scripts/pipeline.mjs` snapshot still serializes whole `tier_a`/`tier_b` objects and uses the older schema, so this allowlist is **not yet enforced**. Phase 7 must replace that serializer and test the output before a public release. Phase 0 does not generate a new snapshot.

## 3. Source-lane status frozen for the start of Phase 1

All seven families appear in the UI and source register, even if they contribute zero accounts. These are **access states**, not claims about user behaviour.

- **Play Store:** route unresolved. [Google's owner review API](https://developers.google.com/android-publisher/reply-to-reviews) covers the developer's own app, not Groww reviews under our key. A separate permitted public/export route needs review.
- **App Store:** restricted under the [India Media Services terms, section F](https://www.apple.com/in/legal/internet-services/itunes/in/terms-en.html) checked on 4 November. No App Store review corpus/model processing via the current route.
- **Reddit:** restricted without approved researcher access under the [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy). Existing seeds do not become model inputs.
- **Investing forums:** bounded source-specific local assessment possible for TradingQ&A under the dated source-use decision; public redistribution of raw text remains held. Coin cases are adjacent, not Groww target cases.
- **Social:** no named platform or terms decision yet.
- **YouTube:** optional official API adapter exists but has not run; collection/model-use basis remains unresolved. A key alone is insufficient.
- **Other:** each publisher and first-hand account needs original-specific provenance and rights review. Expert/company material is context, not investor volume.

The local [source register](research/ENGINE_V1_TERMS_REGISTER.json) carries exact pages and dates. Phase 1 may change a lane only after inspecting the relevant original source/terms and recording the new basis. It may not use synthetic stories or copied restricted text to fill a lane.

## 4. Baseline measured from the local checkout

**Measurement method:** read-only query of `.local/workspace.sqlite` using `engine/store.mjs`, `engine/analysis.mjs` and `engine/scope.mjs` on 4 November. These are **stored rows**, not unique Groww investors or newly collected web posts.

- `22 stored rows = 19 user-voice seed rows + 3 control rows + 0 context rows + 0 unresolved-provenance rows` in the current inventory.
- `22 stored rows = 2 coded proposal rows + 20 uncoded rows`. Both proposals are forum accounts in an **adjacent** platform lane, created by assistant source review; neither is a model output, human-accepted finding or confirmed first-year Groww case.
- `0` accepted reviews; `0` accepted plus public-use-cleared rows; `0` confirmed Groww first-year accounts in the approved evidence set; `0/9` narrative answers approved.
- `2` distinct forum source units have local-use clearance for bounded assessment, but their public `terms_status` is still flagged. `0` proposed narrative roots with both stated trigger and action under the current coded data. Local clearance is not publication clearance.
- `4` historical collection-run log entries record manual source screens; they are not four automated collectors or a current seven-source scrape. The current SQLite run table contains `0` model-run entries. Older development attempts and reports exist outside this current run table; none is an independent accuracy result.
- The checked-in `public/snapshot.json` is an older `sip-snapshot-v1` file with `0` items, created 31 October. It is not the approved Phase 0 publication snapshot.

**Implication:** the current UI is a research scaffold. It cannot yet provide source-backed narrative answers or an opportunity recommendation. Phase 1 must obtain actual permitted user voice; Phase 3 must produce validated proposals; Phase 4 must review and answer. Engineering fixtures and the nine survey responses are separate.

## 5. Reuse, repair and hold decisions

**Reuse after checks:** React/Vite viewer; local Node server; CSV parser; SQLite ledger; normalization/root grouping; Zod contracts; source terms register; review event path; deterministic roll-ups; local snapshot mechanism; Worker read-only shell. Reuse means the code exists and is worth testing, **not** that its outputs have passed research or release checks.

**Repair now in Phase 0:** the old UI hard-coded “22 rows” and displayed a historical `100 units / 3 families / 20 narratives` collection minimum as a current gate. The approved plan uses actual permitted yield and evidence quality, not a round-number proof. The home screen must state the job, actual inventory and unrun status plainly. The source register must reflect the 4 November App Store terms check. The pipeline contract is versioned in `engine/workflow.mjs` and surfaced by `engine/research-plan.mjs`.

**Hold:** local `/api/batch` and `/api/classify`, public `/api/classify`, and the oversized legacy full-packet model route remain disabled until the synthetic structure and source-use gates pass. No paid mode, new provider, corpus scrape, model call or public deployment is part of Phase 0.

## 6. Required-output mapping and check

- **Real source volume and provenance →** source register, `collection_runs`, source items/root IDs, Sources page. **Check:** stored rows reconcile by evidence lane; source and permission state are visible.
- **What happened in an account →** lean material fields, metric node, exit form, final state, optional episode. **Check:** explicit source anchor, speaker and action-status review on selected real items.
- **Nine questions →** `QUESTIONS` plus `ANSWER_REQUIREMENTS`, Nine questions view and reviewed answer records. **Check:** nine IDs render; no answer is marked complete from proposals alone.
- **Qualitative themes and quantitative comparison →** accepted episodes, deterministic source-root counts, counterexamples, opportunity cards. **Check:** units/denominators and direct/adjacent/unknown are visible; no prevalence wording.
- **AI quality →** frozen golden labels, actual predictions/corrections and failure telemetry, Quality view/Evidence Log. **Check:** independent versus post-AI labels distinguished and `K = C + W + A` reconciles.
- **Testable link and one-slide explanation →** local evaluator path, reviewed snapshot, public viewer and gated transient classifier, flow export. **Check:** two-minute source drill-down, privacy-safe bundle and local/public parity before publication.

## 7. Ranked gap list for the next phases

1. **P0 — Permitted corpus and source mix:** seven lanes are named; most do not have cleared collection/model routes and the current seed has no approved target account. Phase 1 must report actual yield and gaps.
2. **P0 — Extraction and source fidelity:** model batch and tester remain held after development failures. Phase 3 must pass structure/anchor/privacy checks on fixtures, then run a permitted real pilot.
3. **P0 — Reviewed Q1–Q9 answers:** current cards show coverage/status, not narrative answers. Phase 4 needs accepted evidence packets, counts and answer review.
4. **P0 — Genuine evaluation:** about 20 varied, permitted items must be hand-labelled with truthful label timing; no independent accuracy result exists. Phase 5.
5. **P1 — Clear evaluator journey:** current UI still contains legacy technical inventory and older wording; Phase 0 repairs the entry point, while Phase 6 must test the full two-minute path.
6. **P1 — Public release:** snapshot is old and empty; Cloudflare live classification is disabled. Phase 7 follows local verification and privacy review.
7. **P2 — Optional depth and factor breadth:** add only when the corpus contains useful real narratives; do not delay the basic nine-question path for 56 optional fields.

## 8. Phase 0 exit and reversal condition

Phase 0 is complete when: (a) this versioned contract and gap list exist, (b) the local counts above are reproducible, (c) the seven source-lane states and nine question/answer rules are explicit, (d) the homepage explains the tool and no longer mistakes seed rows for analysed investors or an old volume target for a current quality gate, and (e) focused tests/build pass. Phase 0 does **not** claim the discovery engine, corpus or research findings are complete.

**Rival approach considered:** keeping the earlier fixed 100/3/20 floor might encourage collection scale, but it would imply a hard research-quality threshold that the brief does not define and could reward low-fit volume. We retain actual counts, source mix and answer-specific coverage instead. **Reversal condition:** if an evaluator or brief explicitly requires a fixed corpus minimum, add it as a separate delivery target with its own definition; never call it proof of insight validity.
