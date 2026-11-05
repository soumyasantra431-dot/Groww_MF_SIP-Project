# AI Evidence Log — working draft

**Date:** 6 November 2026. **Purpose:** show what real source material entered the local Groww SIP discovery workspace, what the AI actually attempted, what was rejected, and what remains unvalidated. This is an honest draft for the graduation submission, not a completed golden-set report.

## Source and volume accounting

- **50 stored rows = 47 user-voice input rows + 3 non-investor controls.** A stored row is not an analysed account or a unique investor.
- **30 distinct locally usable source units** are present, all under the **Investing forums** source family. Local use does not grant public redistribution.
- **13 source-linked assistant coding proposals** have been made from those inputs: **11 TradingQ&A posts + 2 Personal Finance & Money Stack Exchange questions**, grouped into **11 dependent topic/question roots**. These are assistant source reviews, not AI model predictions or independently accepted labels. Open each source through the local Evidence page. Examples: [first-SIP initial order](https://tradingqna.com/t/sip-cancel-on-mf/190338/1), [Coin payment-route follow-up](https://tradingqna.com/t/peculiar-payment-problem-in-coin/156840/9), [stopped contributions versus redemption](https://money.stackexchange.com/questions/102035/icici-redeem-mutual-fund-sips-through-net-banking).
- **37 stored rows have no classification.** Historical Reddit seed rows are not cleared for the model or public evidence. App Store, Play Store, social and YouTube have **zero analysed items** here. Separate company/industry research and the written survey do not pad user-voice volume.
- **0 accepted source records, 0 approved nine-question answers, 0 strict first-time Groww next-payment outcomes.** Eight questions have narrow, source-linked working readings; Q4 checking cadence remains open. The four research situations are unscored proposals, not selected opportunities.

## Model run and quality

The earlier frozen **ten-item development reuse** ran **10 Groq Free requests**, all with a structurally valid response and **0 whole-item processing failures**. Actual provider usage summed to **13,223 tokens** and reported latency summed to **14,024 ms** across those calls. The reference labels were not an independent Fellow blind set, so these figures are a development comparison, **not an accuracy claim**.

For source-text material fields, `K = C + W + A = 12 + 14 + 18 = 44` supported reference fields. The model exactly matched **12/44 = 27.3%**; it produced a different supported value for **14/44**, and abstained on **18/44**. It preserved **28/34 = 82.4%** fields marked unknown in the reference. This is below the preregistered prototype gates of at least **70% explicit-field recall** and **90% unknown preservation**. Exact wording mismatches are not yet semantic error judgments; the result still cannot be presented as validated extraction. Live batch and paste classification remain disabled. No paid call was made in this checkpoint.

## Actual rejected or flagged model fields

The validation record contains **three real field rejections**, not fabricated examples:

1. `P01 / action_status`: the returned source quote was absent from the original input; the field was rejected.
2. `P01 / continuer`: the returned source quote was absent from the original input; the field was rejected.
3. `P07 / journey_stage`: the returned value failed the local stage check; the field was rejected.

`P02 / platform` also had a repeated, ambiguous anchor and remained flagged for review. These are automatic validation outcomes. **No human correction or independently adjudicated semantic invention is claimed.** The exact input and diagnostic receipts are kept in the gitignored local development folder; source text and identifiers are not published.

## Golden set and next gate

The brief asks for roughly **20 real hand-labelled items** and agreement reporting. A ten-item frozen development pack exists, but the independent 20-item golden set is **not complete**. The current model result failed its development gate. The next safe sequence is: improve extraction on synthetic edge cases; freeze a permitted varied real set; obtain independent labels before seeing model predictions; then report supported-field recall, unknown preservation, severe errors, processing failures and item-level corrections. If those gates do not pass, retain the genuine local source walkthrough and report AI classification as unvalidated. Do not substitute synthetic investor stories for source evidence or use corpus mention counts as Groww retention.

## PM interpretation and strongest rival

The assistant-reviewed accounts expose **questions** around first-versus-next payment meaning, payment-route recovery, control consequences and trust/support. All coded accounts are adjacent to or unconfirmed for the first-time Groww cohort. The closest rival to an app-caused continuation failure is normal first-time learning, an upstream bank/mandate condition, or an informed investor pause with no lost scheduled payment. Public accounts cannot settle the relative reach of those explanations or the month-12 North Star. The next discriminating evidence is a direct first-year Groww episode with the **next scheduled instalment outcome**, plus a comparable continuer.
