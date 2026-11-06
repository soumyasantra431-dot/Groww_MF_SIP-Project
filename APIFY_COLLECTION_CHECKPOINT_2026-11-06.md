# Groww app-review collection checkpoint — 6 November 2026

## PM decision this serves

The engine needs real MF/SIP accounts to test its nine-question intake, especially reported payment, adjustment, continuation and recovery events. Store reviews are useful for spotting a concrete event or confusion. They usually cannot establish that the writer is a first-time mutual-fund investor, show their full first-year sequence or estimate Groww's month-12 active-SIP rate. No opportunity or segment is selected from these pilots.

## Runs and arithmetic

| Run | Collection rule | Review rows | Local topic/locator screen | Assistant read | Saved as provisional candidates | Approved findings |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| [Groww Play, broad pilot](https://console.apify.com/actors/wxnBtOSfBdHR4fbvV/runs/AVUJZotjgYUYNzBCl) | Newest, no keyword filter, first 10 actual reviews | 10 | 0 MF/SIP | 10 | 0 | 0 |
| [Groww Play, 50-row pilot](https://console.apify.com/actors/wgy1PBfaWeUL4q0q7/runs/k1mAGfD7tVruLmhsj) | India, English, newest since 2025-05-01; SIP, mutual fund, mandate, autopay, instalment, installment, XIRR | 50 | 50 | 50 | 14 | 0 |
| [Groww Play, expanded run](https://console.apify.com/actors/wgy1PBfaWeUL4q0q7/runs/wOVX8wprd60H8iCTp) | Same targeted rule, cap 400 | 303 | 301 | First 50 only | 14 within the first 50 | 0 |
| [Groww Apple India pilot](https://console.apify.com/actors/2ZZFKbm71jBwPzNlV/runs/rTjdZLKxsr1hmf7ET) | Newest 30, no star/keyword filter; local MF/SIP screen | 30 | 4 | 4 topic hits | 2 | 0 |

The Play 50-row pilot is entirely included in the 303-row run; it is **not** another 50 distinct reviews. The first Actor's 10 reviews are a separate unfiltered quality pilot and excluded from the main total because overlap is unresolved and none was MF/SIP-related. Main intake: **303 Play + 30 Apple = 333 retrieved review rows**. Mechanical topic/locator candidates: **301 Play + 4 Apple = 305**. This is a selected, search-biased set of review rows, not 305 SIP investors. The Play screen still has **251 unreviewed topic candidates**: 301 − 50. Saved local candidates: **14 Play + 2 Apple = 16**; all require source-use and research coding decisions. The two Apple candidates also lack independent original-page verification.

The 50 Play reviews were manually screened: 14 selected + 7 uncertain + 6 cross-instrument + 23 thin = 50. The four Apple topic hits were read: 2 SIP-adjustment accounts + 1 thin general MF praise + 1 stock-only XIRR false positive = 4. None explicitly establishes the brief's whole target cohort and month-12 outcome. Do not report these as prevalence, an answered research question or a validated Groww problem.

## Source trace and quality

The expanded Play export has 303 unique review IDs. One [Play SIP-payment review](https://play.google.com/store/apps/details?id=com.nextbillion.groww&reviewId=b94b83bb-16e9-4b69-b9a5-c6ad6b52874b) was opened on Google Play and its text, date and ID matched the export. It reports an AutoPay failure and a manual payment workaround; it does not report the next scheduled payment outcome. The 50-row pilot IDs are wholly contained in the expanded export. The Play normalizer rejected 2 keyword false positives, redacted exact rupee amounts in 2 texts, detected no duplicate IDs and staged 301 de-identified topic candidates privately.

The Apple Actor output has 30 unique review IDs and reports its source as `amp-api`. Its app-review page opened, but the URL fragment did not display the exact selected review in the browser. The two [Apple candidate](https://apps.apple.com/in/app/id1404871703?see-all=reviews#14740472073) [review locators](https://apps.apple.com/in/app/id1404871703?see-all=reviews#14734412063) therefore remain **original-page unverified**. The export reports a skip-SIP login loop and an inability to modify a SIP. A stated threat to move platform is not a completed migration; neither account establishes first-year status or a subsequent successful instalment.

No reviewer names were imported to the local engine. The four temporary Downloads exports, which included reviewer-name columns, were deleted after normalization; de-identified candidate CSVs and source-screen metadata remain under `.local/`, ignored by Git and blocked by the local server. The source-screen rules and scripts are versioned. No model calls were made for these reviews. Apify metering for the four pilot runs was $0.006 + $0.005 + $0.005 + $0.003 = **$0.019 of the included Free credit**, with $0 charged separately. Metering is an Actor-run observation, not a guarantee for future runs.

## Next bounded decision

Read the remaining 251 Play topic candidates in slices, preserving continuers and informed pauses; independently check source links for any item that will support an answer; keep Apple findings provisional unless their originals become inspectable. The engine can then propose episode labels, but the existing AI quality gate still blocks automatic approved answers. A larger review count alone will not identify the first-time, first-year cohort.
