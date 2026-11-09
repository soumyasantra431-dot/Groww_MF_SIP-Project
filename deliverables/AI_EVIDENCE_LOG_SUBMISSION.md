# AI Evidence Log — Groww SIP project

**9 November 2026.** This log separates retrieved records, source-reviewed accounts, assistant/model outputs, and independently validated findings. The [public discovery engine](https://sip-research-viewer.soumyasantra431.workers.dev/) and [Continuity Map MVP](https://sip-research-viewer.soumyasantra431.workers.dev/sip-map.html) are academic prototypes, unaffiliated with Groww.

## Source and volume ledger

| Lane | Actual count | What the count means | What it cannot prove |
| --- | ---: | --- | --- |
| App review intake | 932 review IDs retrieved in the later intake | Retrieved identifiers across source exports, subject to deduplication and SIP screening | 932 relevant SIP stories, unique investors, or first-time Groww users |
| Local source workspace | 103 rows as of 7 Nov = 100 user-voice rows + 3 controls | Stored research inputs | 103 independent or validated investor episodes |
| Locally usable source units | 31 | Distinct units cleared for local analysis at the 7 Nov checkpoint | Permission for raw public republication or model processing |
| Assistant coding proposals | 15 | Proposed structured readings, not accepted labels | Model accuracy or approved findings |
| Accepted source-level records | 0 | No independently accepted local coding record had been logged | That all nine questions are validated |
| Nine-question readings | 9 provisional, source-linked directions | Research starting points | Prevalence, causal effect, month-12 retention |
| Opportunity leads | 4 unscored situations | Cases for comparison and further validation | A ranked Groww problem list |
| Primary survey | 9 submitted; 8 participation eligible; 5/8 attempted SIP; 1 broad target screen | Secondary, small-sample context | Five or six interviews or a cohort rate |
| Target interviews / target-user MVP tasks | 0 / 0 | No completed real task evidence in these lanes | Opportunity validation or usability success |

The public engine has seven named source-family lanes. **Store reviews and investing forums** contribute to the collection record; public social and YouTube have **zero analysed items** in this submission. Company help is capability/context, not investor voice. Source-family count must not be used as a proxy for quality. Public source text, names, account details, PAN and exact balances are not redistributed.

## Source-linked episodes used for the case study

1. [Groww writer reporting repeated AutoPay repair](https://www.reddit.com/r/MutualfundsIndia/comments/1wtfugh/grow_autopay_failure_help/). Public self-report: previously working routine, several failed attempts, manual investing, bank/Groww contact, replacement-mandate attempt. **Unknown:** first-ever-MF status, bank/order record, failing actor, next successful scheduled payment.
2. [Groww writer reporting same-cycle recovery](https://www.reddit.com/r/MutualfundsIndia/comments/1t2f3wm/grow_auto_pay_failed/). Public self-report: one of several plans debited; others manually caught up. **Unknown:** following automatic cycle and month-12 person status.
3. [Skip then paid month](https://www.reddit.com/r/IndianStockMarket/comments/1hcgq2k/can_i_skip_sip_instalments_in_alternate_month/). Public self-report: an intentional skip can be followed by a payment. **Unknown:** strict cohort fit and final qualifying order status.
4. [Continuing despite return concern](https://www.reddit.com/r/MutualfundsIndia/comments/1scucrj/need_review_of_my_mutual_fund_portfolio_groww/). Public self-report: concern can coexist with stated continuation. **Unknown:** verified instalments and first-ever-MF fit.
5. [Groww processing after bank debit](https://groww.in/help/mutual-funds/order/why-is-my-sip-order-not-completed-1), [pending SIP payment](https://groww.in/help/mutual-funds/mf-sip/how-do-i-pay-for-my-sip-installment-if-the-autopay-debit-has-failed--40), and [AutoPay linkage](https://groww.in/help/mutual-funds/searchable/my-autopay-is-approved-even-then-my-sip-failed). Company-documented capabilities. They do **not** show whether a particular investor found or understood them.

## AI evaluation: actual results, with arithmetic

The discovery engine's earlier **V7 development reuse** made 10 Groq Free calls, used 13,223 provider-reported tokens, and returned 10 structurally valid items. Source-text supported fields: `44 = 12 exact matches + 14 different values + 18 abstentions`; exact supported-field recall `12/44 = 27.3%`. Unknown preservation `28/34 = 82.4%`. The V12 development reuse had 10 structurally valid items, but on eight episode items `41 = 12 exact + 12 different + 17 abstentions`; exact recall `12/41 = 29.3%`; unknown preservation `28/29 = 96.6%`. These reused reference labels were **not an independent human blind golden set**. The development extraction gate failed; live discovery classification stayed disabled. See the [full development record](https://github.com/soumyasantra431-dot/Groww_MF_SIP-Project/blob/main/AI_EVIDENCE_LOG_DRAFT_2026-11-06.md) and local repair memo.

The **Continuity Map** has six task-specific fields and a separate scorer. It passed 148 automated repository tests after the map addition. One synthetic Groq Free development request returned a six-field proposal with source phrases in about 0.8 seconds. That checks transport and structure only. Independent real-item accuracy: **not measured**. Its public AI route remains off; the fixed map and safe fallback work. The current map gate asks for about 20 independently hand-labelled real items, six fields each: `total field decisions = 20 × 6 = 120`. Thresholds: 0 severe errors, explicit recall ≥70%, unknown preservation ≥90%, and ≤1 processing failure per 10. No percentage is reported when its human denominator is missing.

## Actual AI outputs rejected or corrected

- `P01 / action_status`: model quote absent from the input. Validator rejected the field.
- `P01 / continuer`: model quote absent from the input. Validator rejected the field.
- `P07 / journey_stage`: value failed the local stage check. Validator rejected the field.

An external AI research draft was separately corrected after it treated a *scheduled* payment as metric-positive. The brief requires a **successful SIP instalment** in the 30 days before month 12. This was a research-aid correction, not a discovery-engine golden-set result. No automatic field rejection above is claimed as a Fellow's independent manual correction.

## Decision and remaining evidence

The case study selects the automation-reliant routine restorer as a **reversible design hypothesis**: reported repeated repair burden merits a bounded task test, while strict cohort fit, incidence, technical cause and retention effect remain unknown. The strongest rivals are bank/rail failure, successful use of existing Groww help, an informed pause, and another SIP already keeping the person active. Needed next: real first-year Groww incident and comparable continuer with following scheduled outcome; 5–6 target interviews; independent ~20-item map labels; and 3 target-user MVP tasks. No synthetic story or desk review is counted in those lanes.
