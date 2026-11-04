# Phase 4 implementation — review and bounded answers

**Date:** 4 November 2026. **Status:** review workflow implemented locally; research answer gate remains open. The app is at `http://127.0.0.1:4320/`. No source or answer was accepted on the Fellow's behalf. No Groq call, new web collection, GitHub push or deployment occurred in this phase.

## Decision served

Which of the nine brief questions can the currently admitted corpus answer after a person checks the original? A model's valid JSON, a source URL, or a question tag is not an approved research answer. The unit counted is a dependency-grouped source root, not a Groww investor.

## Implemented

1. `engine/question-cards.mjs` creates nine evidence packets from accepted, locally permitted, in-scope user-voice records. It counts record and source-root denominators, source mix and target/adjacent/unknown fit separately. Every card keeps a specific rival, unknown and next question. A question tag alone cannot produce direct prose.
2. The local evidence detail now loads a de-identified original from ignored local storage only when bounded local use is cleared. The reviewer can compare it with the external source link. The public Worker has no original-text route.
3. Accepting a record requires an actual classification, local-use clearance, a source-based reason and the reviewer confirming they checked the original. A corrected supported material field requires a short value and one exact, unique clause from the local original. Unknown and not applicable remain distinct.
4. `engine/answer-review.mjs` saves a researcher's bounded answer only with accepted question-linked source IDs, a direct point, counterexample or rival, unknown, next question and two explicit review confirmations. The saved source revisions invalidate the answer after any later correction. A locally usable source may have public redistribution held; only answers whose sources have publication clearance can enter a public snapshot.
5. The UI shows approved citations separately from all potential source links. No answer is automatically generated or ranked. The Free model remains disabled after Phase 3's quality failure.

## Actual state and arithmetic

- 37 stored input rows = 2 coded assistant review proposals + 35 uncoded rows.
- 2 assistant review proposals = 2 adjacent-platform forum accounts; **0** accepted records.
- 9 question cards = **0** researcher-approved answers + **9** open answers.
- The accepted local source-root denominator is **0**. This does not mean the nine user questions have a zero-frequency answer; it means no source has passed review yet.
- Direct first-time Groww target accounts accepted: **0**. The Phase 1 source screen found no confirmed direct target account among its selected forum candidates. Neither public-post counts nor source roots estimate Groww's month-12 NSM.
- One local walkthrough traced Q1 → its contributing proposal → original forum text → review control. It showed a prospective question about setting up a SIP on another platform. That is a candidate account for understanding expectations, not proof of a completed SIP or Groww continuation. The other proposal describes a failed mandate approval on another platform with no confirmed later SIP payment. Both remain proposals.

## Verification and boundary

All **107** automated tests pass, and the TypeScript/Vite production build passes. A local API check returned nine cards and rejected an attempted acceptance without original-source confirmation; the record stayed `proposal`. The public route still excludes the original text. These checks validate implementation and review gates, **not** research conclusions or AI extraction accuracy.

The Phase 4 exit gate is **not met**: there are no accepted source records or researcher-approved answer wordings. Q1–Q9 therefore say insufficient reviewed evidence. The strongest near-term research gap is a real first-year Groww SIP episode with intention, event, action and ending, plus a comparable continuer account; the current forum proposals are adjacent and cannot establish the target cohort. The nine existing written survey responses remain a separate secondary lane.

## Next review action

In the local **Evidence** view, inspect the two existing proposals and their original text before accepting, correcting or rejecting them. The prospective setup account is [TradingQ&A post 1](https://tradingqna.com/t/coin-sip-vs-amc-sip/127618/1); the mandate account is [TradingQ&A post 3](https://tradingqna.com/t/introducing-upi-autopay-for-sip-payments/173064/3). Check speaker, platform, actual versus intended action, initiating event, outcome and question tags. Preserve the adjacent-platform label. A local acceptance can support a bounded comparison; public publication still requires a separate rights decision. The next source intake should seek directly relevant first-year Groww experiences rather than filling Q1–Q9 with these two adjacent accounts.

**Unrun:** source acceptance; approved narrative answers; within-person before/after reconstruction; Q4 explicit checking cadence; Q7 comparable continuer versus interruption; participant-level validation; public answer publication. No new API key is needed for this review.
