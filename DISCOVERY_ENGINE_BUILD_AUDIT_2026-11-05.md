# Discovery engine build audit — 5 November 2026 IST

## PM verdict

The **research workflow scaffold is built locally; the evidence-backed AI discovery engine is not yet complete**. The present app can explain its purpose, import and deduplicate permitted CSV inputs, display source/review state, render nine question cards, and keep unsupported answers open. It cannot yet run the lean model through its local batch or tester routes, show an approved source-backed answer, compare accepted Groww target opportunities, or provide a nonempty safe public snapshot. Passing software tests does not change those research and product states.

**Decision served by this audit:** what to finish next before calling the discovery engine an evaluator-ready deliverable. The relevant alternative is to treat a polished, honest read-only research demonstration as a partial delivery if the model/evidence gates cannot be passed by the deadline. The reversal condition is a permitted real-source pilot with acceptable quality and approved source-linked findings.

## Reproduced current state

- `37 stored rows = 34 user-voice excerpts + 3 controls + 0 context documents`. These are rows, **not investors**.
- By family: `13 Reddit seed rows` (not locally cleared), `21 investing-forum rows` (17 locally cleared), and `3 Other controls`; App Store, Play Store, YouTube and social have no stored rows. Seven family lanes are documented, but only the forum lane has a usable local text route. The 13 Reddit seed rows are inventory only, not analysed user evidence.
- `37 rows = 5 coded assistant proposals + 32 uncoded`; the five proposals cover four forum topic roots. `0` accepted source records, `0` public-use-cleared records, `0` confirmed first-time Groww target records, `0/9` approved question answers and `0` accepted opportunity candidates.
- The current SQLite `runs` table contains `0` model-run entries. Separate earlier development receipts document Groq Free calls on synthetic/reused items; they are not an independently measured corpus run. The local `/api/batch` and `/api/classify` routes, and the Worker live classifier, return held/unavailable states.
- The saved evaluation metadata says `20` assistant-labelled excerpt references, `0` predictions, `20` unrun items and no calculable recall/agreement. Those references comprise `13 Reddit + 4 forum + 3 Other` items; they are **not** an independent, permitted 20-item golden set. Synthetic quality checks and a prior post-AI development comparison failed to establish reliable extraction.
- `public/snapshot.json` is an older 31 October file with `0` items. The current snapshot writer still serializes full classification objects, including fields outside the publication allowlist in the [Phase 0 contract](PHASE_0_CONTRACT_2026-11-04.md); a new public snapshot must not be released before that serializer and its tests are repaired.
- Today, `pnpm.cmd test` passed **108/108** automated tests and `pnpm.cmd build` passed. These verify code behavior and compilation, not investor findings, model accuracy, reviewer comprehension, or deployment. The current checkout has no configured Git remote; recent checkpoints are local commits.

## Requirement and phase audit

### Built and locally checked

1. **Problem and output contract (Phase 0):** NSM, cohort caution, nine questions, seven source lanes, exclusion rules, answer format and privacy/publication criteria are recorded. The app's opening guide explains its intended research job. Phase 0's local contract gate is met.
2. **One permitted source intake path (Phase 1):** a dated manual TradingQ&A screen, source links/locators, terms decision and privacy-screened local inputs exist. The intake gate is met; source sufficiency for Groww's first-year cohort is not. Other families are marked unavailable or unrun rather than filled with mock accounts.
3. **Normalization and counting foundations (Phase 2):** CSV checks, PII screening, source-unit and topic-root grouping, duplicate handling, source ledger and reconciliation are implemented and tested. The historical accounting is `42 tracked decisions/inputs = 17 admitted + 20 pending + 5 excluded`, where `37 stored + 5 excluded = 42`; these units are decisions/rows, not people. The technical Phase 2 gate is met.
4. **Review and answer mechanics (part of Phase 4):** local original-text review, correction logging, nine bounded question packets, researcher answer approval rules, source links and zero-evidence states exist. They correctly refuse to mark the present material as approved findings.
5. **Phase 5 scaffolding:** a no-score opportunity-comparison contract, deterministic root counts, deck export columns and an evaluation function exist. The [provisional source comparison](research/phase_five_2026-11-04/PROVISIONAL_SOURCE_COMPARISON.md) documents three rival investigation questions with sources and limits. It is assistant analysis, not an accepted Groww opportunity comparison.

### Built but failed or held

1. **AI extraction (Phase 3):** the strict lean schema, offsets/anchors and provider adapter exist. The [development report](research/phase_three_2026-11-04/PHASE_3_REPORT.md) records successful JSON transport but unresolved focal-event/tag errors. The real permitted pilot was not run under the latest prompt. The local batch and tester remain disabled. Phase 3's reliability gate is **not met**.
2. **Source sufficiency (Phase 1 research outcome):** the permitted forum accounts are mostly Coin/other-platform experiences or have unknown cohort status. A first-person Groww starting account was found through read-only web research, but it does not state later successful SIP payments. The local corpus has **no confirmed target-cohort account** and no matched first-year interruption/continuer pair. This blocks a supported Groww opportunity choice; it does not prove the problem is absent.
3. **Nine answers (Phase 4):** the cards render, but all nine are `answer_not_approved`. No source has been accepted, and the first-year Groww denominator remains zero. This is an honest coverage outcome, not nine substantive answers. Phase 4's answer gate is **not met**.

### Prepared, not executed

1. **Opportunity comparison and AI quality (Phase 5):** no accepted evidence-derived candidate, no independent golden-set comparison, no measured model agreement, no complete AI Evidence Log, and no claimed real AI corrections. The 20 old assistant references and the preliminary three-explanation note do not complete Phase 5.
2. **Evaluator path (Phase 6):** the navigation and source drill-down exist, but the tester button is disabled and no fresh evaluator has completed the planned two-minute understanding/source-audit task. The local layout and revised plain-English flow still need a specific Phase 6 check.
3. **Publication (Phase 7):** no reviewed public snapshot, GitHub remote/push, Cloudflare deployment, public test link, or externally verified parity. The snapshot allowlist repair is a release blocker. Local acceptance must precede the push/deploy sequence the user requested.

## What the Phase 5 readiness note means

[PHASE_5_READINESS.md](research/phase_five_2026-11-04/PHASE_5_READINESS.md) is a **dated decision and prerequisites note**. It records why the comparison and quality report could not be claimed on 4 November and which parts could be prepared. It is not an implementation report, golden-set result, approved opportunity or Phase 5 exit sign-off. The later provisional comparison is a source-screen, not an evidence-approved selection.

**Can Phase 5 start now? Yes, in parallel:** simplify/freeze a real permitted evaluation pack, prepare source-linked candidate cards and an evidence log shell, and independently check the next source inputs. **Can it be completed now? No:** accepted source accounts and meaningful evidence packets are needed for the comparison; a frozen human-labelled permitted set and actual model predictions are needed for the quality claim. The code framework already exists, so another placeholder document alone does not advance the gate.

## Critical path from 5 November to the 9 November, 3:59 PM IST deadline

1. **Today: resolve the evidence bottleneck.** Screen a small number of permitted, first-hand Groww first-year accounts for an event, action and next actual instalment outcome, plus an ordinary continuer. Preserve direct/adjacent/unknown and source-use status. Use the nine existing written survey responses only as a separately labelled secondary lane, and check the consent basis before any external model processing. Do not collect restricted Reddit/App Store text or synthesize people to fill a count.
2. **Then: finish one real end-to-end answer.** Review a source against its original, correct the material labels, assemble one question packet, show a concise answer with a rival and unknown, and verify its link/count in the local app. Repeat only where actual evidence supports the other questions; leave unsupported questions open. This tests the workflow's purpose more directly than adding more empty views.
3. **In parallel: run a bounded model-quality decision.** Freeze permitted real inputs and independent human labels before predictions. Run the lean model only through a prechecked free/permission path, record actual per-field results, and apply the registered severe-error, recall, unknown-preservation and processing-failure gates. If it fails, keep the live classifier off and describe the engine as a reviewed manual evidence workspace with an unvalidated AI proposal layer. Do not claim an AI accuracy rate from post-AI assistant labels.
4. **Only after reviewed evidence: compare candidates.** Show independent source roots, target fit, reported consequence/workaround, possible NSM pathway, existing Groww control, strongest rival, reach unknown and next test. Do not rank by complaint count or choose the final user problem inside the engine.
5. **Before publication: test the two-minute evaluator path, repair the snapshot allowlist, generate and inspect a safe nonempty snapshot, obtain the user's local-version confirmation, then set up GitHub and Cloudflare and verify the public link.** Produce the one-slide workflow explanation and accurate AI Evidence Log. If the evidence/model gate remains unmet, publish only what is truthful and mark the missing deliverable clearly.

**Intervention needed from the Fellow:** independent blind labels/adjudication on a small, plain-language frozen pack if the submission will claim a human-checked AI agreement rate; final review of the concrete local evaluator flow before GitHub/Cloudflare. The assistant can do source search, permission screening, intake, provisional coding, test execution, safe UI repair and the draft comparison without that intervention. No new API key or paid plan is required for this audit.

**Scope boundary:** the separate user-facing AI-native MVP, three-user test, final problem choice, experiment metrics, risks and ten-slide deck are later graduation-project work. Completing this engine would not silently complete those deliverables.
