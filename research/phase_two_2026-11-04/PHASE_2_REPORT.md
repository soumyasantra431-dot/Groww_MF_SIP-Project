# Phase 2 — source identity, duplicate control and intake reconciliation

**Date:** 4 November 2026 IST
**Decision served:** Can we trust the units and source drill-down before an AI answer or opportunity comparison is shown?

## Result and arithmetic

The repeatable local check is `node scripts/reconcile-phase-two.mjs`. It reads the ignored SQLite inventory and the metadata-only [Phase 1 source screen](../phase_one_2026-11-04/source_screen.csv), then writes a private receipt to `.local/phase2/reconciliation.json`. It sends no text to a model, downloads no source, and exports no original post body. The local Sources view runs the same reconciliation on each refresh.

- `42 tracked decisions and stored inputs = 17 locally admitted + 20 pending + 5 excluded`. They are **records/decisions, not people**. The total also reconciles as `37 stored inputs + 5 excluded locators`.
- The dated Phase 1 run is `20 screened post units = 15 currently admitted + 0 pending + 5 excluded`; its recorded duplicate **attempts** were `0`. Older import attempts lack a comparable logged denominator, so their duplicate-attempt rate is **unknown**.
- `37 stored inputs = 34 user-voice + 0 context + 3 controls + 0 unresolved lane`. Within the 17 locally admitted user-voice inputs there are 17 distinct source-unit keys but only **10 thread roots**. These counts do not establish 17 investors.
- The 15 newly screened MF-SIP candidates are **assistant-made screening proposals**, not accepted classifications. After the correction below, `15 = 0 confirmed direct first-year Groww + 14 adjacent-platform + 1 platform/cohort-fit unknown`. All nine question answers and all material findings remain unreviewed; `0` are accepted and public-use-cleared.
- `5` older pending seed rows share only `2` source-unit locators: one Reddit thread root has two stored excerpts; one forum post URL has three. The stored metadata cannot establish whether those are separate source posts or speakers. They remain pending and visibly flagged. No row was deleted. There are `0` exact long-text cross-source copy groups in this inventory; paraphrased reposts remain untested.

The distinction matters: an item is one stored excerpt, a source unit is a particular post/review locator, a root is a thread or review dependency group, and an investor is a person we cannot count from these records. Several posts in one thread can still describe different people. Thread grouping is a conservative corroboration denominator, not a claim of shared identity.

## What the code now checks

Canonical forum identity combines topic ID with an explicit `post-N` locator or URL post ID; a page URL and a post permalink now resolve to the same source unit. Different replies stay separate units but share a thread root. Existing Reddit, store-review and YouTube identifiers remain distinct. Exact same-unit, normalized-text repeats are import aliases rather than new inputs. A *different* excerpt offered for an existing locator stops before a raw file is written, pending a source-version decision. Long exact text across sites is retained in both source rows and flagged for dependency review; it is not silently treated as two independent confirmations.

CSV validation rejects bad dates, malformed/private URLs, missing text, unexpected columns, obvious PAN/account/contact patterns and invalid families. The source-screen ledger adds explicit `relevance_screen` and `target_fit`; a stock SIP or mixed instrument does not become a mutual-fund candidate merely because it was admitted for local use. The Sources view exposes each admission state, source link and locator, item/root key, tentative scope, review state and unresolved dependency flag. A rights-pending input remains in inventory but cannot become a reviewed finding by arithmetic.

## Five original-page spot checks and correction

This was an **assistant source audit**, not independent Fellow verification or a participant interview. The original pages were inspected; the stored source screen was checked for post locator, date, speaker position, SIP relevance and target-fit limits. No author names or original prose are reproduced here.

1. [First-SIP cancellation, post 1](https://tradingqna.com/t/sip-cancel-on-mf/190338): the author reports cancelling an initial buy after uncertainty about the next instalment. The platform is not stated by that author; a later staff reply discusses Coin. **Correction:** `adjacent_platform → unknown` in the current source screen. First-ever MF status, refund completion and investor-level SIP inactivity remain unknown.
2. [Payment problem, posts 1 and 9](https://tradingqna.com/t/peculiar-payment-problem-in-coin/156840): the thread starter later reports using another UPI app successfully. The later post is now marked `thread_starter_followup`, without storing a username. This is a reported workaround in an adjacent platform, not verified instalment finality or a first-year Groww outcome.
3. [Alternative-platform discussion, post 7](https://tradingqna.com/t/best-alternative-to-zerodha-coin/136294): an experienced Paytm Money user reports two rejected SIPs and a change in transaction-checking behaviour. Two instalments are not two investors, and the account does not say the investor stopped all SIPs.
4. [UPI AutoPay discussion, post 48](https://tradingqna.com/t/introducing-upi-autopay-for-sip-payments/173064?page=3): the author reports only some of several mandates debiting. A ticket identifier appears on the original page and was omitted from the stored excerpt. The actor and final payment outcome remain unresolved.
5. [UPI AutoPay discussion, post 60](https://tradingqna.com/t/introducing-upi-autopay-for-sip-payments/173064?page=3): the author reports suspending AutoPay after a disputed debit sequence. That does not establish a permanent SIP cancellation or completed refund. The first-year Groww cohort is not evidenced.

## Gate and remaining limits

The technical Phase 2 gate is met: source units and roots are explicit, the intake equations reconcile, source links sit behind every screened decision, the first real batch has a documented spot check, and ambiguous older seeds stay pending. All **99 local tests** and the production build pass. The Sources page was verified at `http://127.0.0.1:4318/`, including the 17-admitted drill-down and a narrow-screen overflow check. This **does not** validate any nine-question answer, the lean LLM, the direct Groww cohort, or the month-12 metric. An exact-copy detector cannot identify paraphrased cross-posts; manual review remains necessary. The next phase can work on extraction proposals, but its output must stay unreviewed until source checking and the independent quality gate.
