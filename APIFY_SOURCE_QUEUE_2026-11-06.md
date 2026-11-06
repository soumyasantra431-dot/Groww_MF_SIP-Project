# SIP source queue and Apify pilot — 6 November 2026

## Decision served

Find real, attributable MF/SIP conversations that can help the engine answer its nine discovery questions. Collection volume is an intake count, not the number of first-time Groww investors and not evidence of a retention rate. Count a post as analysed only after original text, source locator, source-use status, privacy screen, duplicate check, relevance coding and researcher review are recorded.

## Apify state verified in the user's Console

- Account: Free, $5 included monthly usage displayed; $0.00 used and zero Actor runs at inspection.
- Saved task: [Groww India Play review pilot — 100 candidates — not run](https://console.apify.com/actors/tasks/Tcer4TI9hxx5rOmuX/input).
- Existing community Actor: `code-node-tools/app-reviews-scraper`; this is a configured task, not a newly developed scraper. Inputs saved: `com.nextbillion.groww`, India, newest first, no star or keyword filter, date from 2025-05-01, maximum 100 reviews, maximum $0.10 of included credit per run. Runs: **0**. Exported reviews: **0**. Engine imports: **0**.
- Why no keyword filter at collection: first inspect the proportion of SIP/MF and ordinary-success accounts among a bounded recent sample. A negative-only search would hide continuers. Filter and code locally with an explicit denominator.
- Run gate: verify the Actor's actual collection method against Google Play terms and robots rules, confirm the export has durable per-review locators and dates, and keep it within the free credit. The Actor's Store listing does not establish permission or data quality. Google's robots file explicitly disallows `/store/getreviews` and `/store/xhr`; we cannot presume this third-party Actor avoids those routes. Do not run or mark `store_export` approved until that is established.

## Link triage

| Input | Decision | Why / use |
| --- | --- | --- |
| [Groww Play](https://play.google.com/store/apps/details?id=com.nextbillion.groww) | Correct target app | First collection candidate; app reviews still cannot establish first-ever MF status or a month-12 outcome unless the reviewer states it. |
| [Coin Play](https://play.google.com/store/apps/details?id=com.zerodha.coin) | Correct adjacent app | Comparator for payment, adjustment and status language; never enter Groww target-cohort counts. |
| Kuvera `com.kuvera.android` | Replace | Current listing is [Kuvera by CRED](https://play.google.com/store/apps/details?id=com.gooogle.android.kuvera.app). Adjacent. |
| ET Money `com.etmoney.android.app` | Replace | Current listing is [ET Money](https://play.google.com/store/apps/details?id=com.smartspends). Adjacent. |
| [Paytm Money](https://play.google.com/store/apps/details?id=com.paytmmoney) | Correct adjacent app | Lower priority than target Groww and one focused comparator. |
| [Fund Easy](https://play.google.com/store/apps/details?id=com.fundeasy.mutualfund) | Valid listing, defer | Its old product language and different advice-led proposition make it a weak present-day comparator for this brief. |
| Reddit subreddit search URLs | Discovery leads only | Search pages are not investor accounts. A result must be opened and checked; bulk Apify academic collection is not authorized by a public search URL. |
| [IndiaInvestments pause thread](https://www.reddit.com/r/IndiaInvestments/comments/e2shtc/should_i_continue_my_sips_or_should_i_pause_them/) | Real, adjacent context | Old discussion about whether to pause; no verified first-time Groww next-instalment outcome. |
| `.../personalfinanceindia/comments/16xyz/...` | Reject | Redirects to an unrelated online-video post. |
| `.../mutualfunds/comments/18xyz/...` | Reject | Redirects to an unrelated programming post. |
| TradingQ&A pause/cancel search URLs | Discovery leads | Forum has real MF/SIP threads. [Coin SIP not working](https://tradingqna.com/t/coin-sip-not-working/157190) shows a reported status/payment issue; [job-loss question](https://tradingqna.com/t/mutual-funds-sip/103470) is hypothetical. Both are adjacent Coin accounts. |
| ValuePickr search URLs | Defer | Initial search results mostly concern stock SIPs, return simulators or expert commentary rather than first-year mutual-fund payment episodes. Do not pad the user-voice count. |

## Source-use register for these routes

| Family | Checked source | Current collection decision |
| --- | --- | --- |
| Google Play | [Google terms](https://policies.google.com/terms), [Play robots](https://play.google.com/robots.txt), [publisher reviews API](https://developers.google.com/android-publisher/api-ref/rest/v3/reviews/list) | Third-party Actor method unresolved; saved task only. Publisher API does not give us Groww owner access. |
| Apple App Store | [Apple review guidance](https://developer.apple.com/app-store/ratings-and-reviews/), [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi/customer-reviews), [review guideline](https://developer.apple.com/app-store/review/guidelines/) | App Store Connect is for the app owner. Apple says approved RSS feeds may be used by apps, whereas scraping Apple sites is disallowed in its app review guideline. The public India RSS feed for Groww returned no review entries on this check; no App Store Actor run or import. |
| Reddit | [Reddit research access policy](https://support.reddithelp.com/hc/en-us/articles/14945211791892-Developer-Platform-Accessing-Reddit-Data) | No Apify Reddit Actor: Reddit says academic research through unauthorized third-party tools violates its policy. Existing historical links remain leads, not newly scraped corpus. |
| TradingQ&A | [Terms](https://tradingqna.com/tos) | User contributions have a CC BY-NC-SA 3.0 license. Review specific posts and collection path before bounded local use; attribute by thread link without usernames. |
| ValuePickr | [Terms](https://forum.valuepickr.com/tos) | Same user-content license, but the proposed queries have poor MF-SIP episode fit. No Actor. |
| Instagram / Facebook | [Meta's scraping statement](https://about.fb.com/news/2021/04/how-we-combat-scraping/) | No Apify comment Actor merely because it exists. Seek an authorized route or use published, attributable aggregate research as context. |
| YouTube | Existing project source-use gate and official API key | Keep a distinct YouTube lane. An API key alone is not a collection permission or evidence of relevance. No new run here. |

## Intake and coding rule after an authorized export exists

1. Keep the original export private and local. Do not copy reviewer names, profiles, financial identifiers or full review text to the public site or GitHub.
2. Map each review to `source_family,url,date,text,source_locator`, with an app-level URL plus a stable review ID only if the resulting source can be traced. Reject missing or unusable locators.
3. Split **Groww** from **adjacent competitor** before counting. Remove duplicates by source unit and normalized text; record raw, rejected and kept denominators.
4. Code relevance as `yes / no / uncertain`; route short store reviews to Tier A. A review mentioning SIP is still not automatically a first-time investor or a first-year episode.
5. Preserve continuers, recovery and informed pauses alongside interruptions. Use counts as `coded relevant / screened records`, never as prevalence among Groww investors.
6. Escalate source-linked narratives for deeper Tier B extraction, including initiating event, action, outcome, rival explanation and unknowns. The engine proposes labels; human review determines whether a claim enters an answer.

## Next execution gate

Confirm a permitted review-export route and inspect a small real output before scaling. If the Apify Actor's method cannot be established, use a lawful provider export or manual source-linked examples; do not claim Play/App coverage. For forums, screen specific thread roots for MF/SIP action and outcome before any bulk intake. The target is decision-useful episodes, not a 500-row badge.

## Source selection protocol — added 6 November

The researcher selects **source seeds and search rules**, not favourable individual answers. Every executed query gets a date, source, window, returned count and admitted count. Search in both interruption language (`failed`, `missed`, `pause`, `cancel`) and ordinary-success language (`continued`, `resumed`, `one year`, `paid next instalment`). An author saying "first SIP" does not establish first-ever MF investment or use of Groww.

1. **Groww app reviews, first if an allowed export is established.** Seed with the [Groww Play listing](https://play.google.com/store/apps/details?id=com.nextbillion.groww) and the [Groww India App Store listing](https://apps.apple.com/in/app/groww-stocks-mutual-fund-ipo/id1404871703). A store Actor takes the app ID and returns reviews; we do not need to paste hundreds of review URLs. No star-only or complaint-only filter in the pilot. Both routes are currently pending, not evidence.
2. **One focused comparator.** Seed with [Coin Play](https://play.google.com/store/apps/details?id=com.zerodha.coin) to test whether similar execution/status language exists elsewhere. Kuvera, ET Money and Paytm Money are reserve comparators, not automatic extra volume. Competitor reviews stay outside Groww target counts.
3. **Forum narratives.** The TradingQ&A search terms are discovery tools. Screen each result for a first-person MF/SIP event, a stated action, a date or sequence, and a source-post locator. First candidate roots to check are [initial buy-order cancellation](https://tradingqna.com/t/sip-cancel-on-mf/190338/1), [Coin payment/status problem](https://tradingqna.com/t/coin-sip-not-working/157190), [possible payment-route recovery](https://tradingqna.com/t/peculiar-payment-problem-in-coin/156840/9), and [hypothetical job-loss pause](https://tradingqna.com/t/mutual-funds-sip/103470). These are different evidence types; none is a verified first-year Groww month-12 account. Check against the existing local forum corpus before adding anything.
4. **YouTube comments, conditional on the recorded API-use decision.** Candidate videos are Groww's [start-SIP walkthrough](https://www.youtube.com/watch?v=ftsTHUMEUFM) and [failed-AutoPay walkthrough](https://www.youtube.com/watch?v=tEQVYxdf5JE). Video descriptions are company context; only attributable comments can become user voice. Sample both videos and record the relevant-comment yield before selecting more. The saved YouTube key does not override the current source-use hold.
5. **Reddit and social.** Search links can identify themes to test elsewhere but are not collector inputs. No Apify Reddit, Instagram or Facebook comment run under the currently documented access routes. Record zero analysed rather than treating public visibility as a license to bulk collect.
6. **Company help as system context.** [Groww's failed-instalment explanation](https://groww.in/help/mutual-funds/order/why-did-my-installment-fail--25), [missed-instalment payment options](https://groww.in/help/mutual-funds/mf-sip/how-do-i-pay-for-a-missed-installment-3), and [cancellation explanation](https://groww.in/help/mutual-funds/order/why-was-my-order-cancelled--68) help code possible system states. They do not show that any investor experienced them or how often.

**Pilot accounting order:** `raw fetched = invalid/privacy-rejected + valid`; `valid = duplicate + unique`; `unique = out-of-scope + uncertain + MF/SIP-relevant`; `MF/SIP-relevant = Groww-direct + adjacent + platform-unknown`. `human-reviewed` is a separately reported subset of relevant records. These identities describe this selected corpus only, never Groww's first-time-investor population.
