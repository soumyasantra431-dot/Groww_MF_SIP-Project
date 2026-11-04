# Discovery engine: collection to nine answers

**Parked on 4 November:** this later engine contract remains available for reference. The active PM starting point is the [31 October baseline](ACTIVE_PM_BASELINE_2026-10-31.md).

**Status on 3 November 2026:** this is the working contract and a truthful progress ledger, not a claim that collection or the AI analysis is complete. The assignment metric is the share of first-time mutual-fund investors with at least one successful SIP instalment in the 30 days before month 12. Public text cannot supply Groww's investor-level numerator or denominator.

## What the engine is for

The engine should help a Growth PM find **which reported first-year SIP situations deserve focused validation**. It must answer the brief's nine questions from traceable accounts, show unknowns and counterexamples, then compare candidate problems by evidence, possible metric pathway and next test. It does not automatically choose a segment, cause or product feature. The later customer MVP is a separate decision.

## What the numbers currently mean

- **22 stored rows** = 19 public-conversation excerpts + 3 deliberate exclusion controls. They are a seed and test inventory, not 22 analysed investors.
- Of the 19 conversation rows, **2 TradingQ&A source units** have a recorded basis for bounded local analysis. They are assistant-coded proposals about another platform. **17 rows** do not have local-use clearance; 13 of those are historical Reddit seeds. Zero proposals are accepted as Groww findings.
- **7 written survey submissions** are a separate, private secondary lane. They are not inside the 22 and do not measure month-12 continuation. Company and industry research exists in project documents but **zero context documents** have been loaded into this local corpus; the UI's zero describes the database, not all project research.
- **0 of 9 grounded narrative answers**, **0 reviewed first-year Groww accounts**, **0 selected opportunities**. The failed ten-input model development check is not an accuracy result. AI batch and live paste remain held. No seven-platform live scrape has run.
- **Read-only store screen on 3 November:** 10 visible App Store cards and 20 Play Store “Most relevant” cards were inspected on their original public listings. The selected screens yielded no confirmed first-year Groww MF-SIP account and no imported review. These are screen counts, not corpus counts or representative denominators. The source-screen note is in ignored `research/SOURCE_SCREEN_STORES_2026-11-03.md`.

## Collection routes: all seven named families

| Family | Relevant unit and likely yield | Current route | Actual engine status |
| --- | --- | --- | --- |
| Play Store | SIP-specific review; often a short payment/status report | Inspect original public reviews or obtain a source-cleared export. The Google Play Developer review API is for an app the caller manages; a free key does not grant Groww review access. | 0 collected here |
| App Store | SIP-specific review; short app experience | Inspect public original reviews or obtain a source-cleared export. App Store Connect customer-review API concerns the developer's own app. | 0 collected here |
| Reddit | First-person intention, life event, recovery or continuation narrative | Approved Reddit for Researchers route; historical seed excerpts are held. Manual copying is not a bypass of the current policy. | 13 stored seeds, 0 cleared/processed |
| Investing forums | Original post and speaker-separated replies; an episode may be longer | Bounded TradingQ&A original-page intake under the dated local academic-use interpretation; each post retains a topic/post locator. Other forums need individual review. | 2 local proposals, both adjacent; 4 more old rows unresolved |
| Public social | A named, public post with a stated SIP experience or influence | Choose a platform, then check that platform's collection and reuse terms. Do not take private-group material. | 0 collected |
| YouTube comments | Commenter account of influence, SIP action or concern; creator advice is context | Official `commentThreads.list` adapter is prepared but has not run. A YouTube Data API key and a source-use decision would be required for the endpoint. | 0 collected |
| Other public conversations | Published first-person reader Q&A or story; expert answer stays context | Inspect each publisher and original account; record a reuse basis before importing original text for model analysis. | 1 read-only Groww lead, 0 imported |

The user wants coverage across every family. We will track all seven separately. A platform with no permitted source route must show **zero analysed** and an access gap. We will not fill that gap with invented Excel rows or label mock interviews as investor evidence. Synthetic rows may demonstrate code behavior in an isolated test lane.

## What “collect” and “process” mean in this build

1. **Query and select.** Build a queue by brief question × first-year journey window × reported state. Seek ordinary continuation and recovery as well as failures and informed pauses. Log query, date, candidates inspected, admitted and rejected, with source links.
2. **Retrieve.** Use an approved official endpoint where available. Otherwise inspect selected public originals and prepare a local CSV with `source_family,url,date,text,source_locator`. A link without original text is a lead, not an analysed item. API access is not assumed from the existence of an API.
3. **Screen and clean.** Remove identifiers before storage; exclude generic brokerage complaints, advice-only content and irrelevant instruments. Preserve the author's negation, uncertainty, language and event order. Record direct/adjacent/unknown Groww cohort fit; never infer it from the platform name alone.
4. **Normalize and deduplicate.** Normalize source URLs and stable post/review locators. An exact repeat is one item. A forum thread remains one dependency group for breadth counts even if several posts are examined. Mark possible cross-post copies for manual review. Keep people, posts, SIPs, instalments and money as different units.
5. **Tier A.** Propose SIP relevance, journey/metric node, exit form, reason families and a concise set of material fields. Every stated field needs a source anchor; unknown and not-applicable are valid. The Groq Free lean extractor failed its development quality gate, so current source coding is manual proposal only. Do not scale AI output until a new validated extraction path exists.
6. **Tier B.** From source-cleared, trigger-and-action narratives, reconstruct expectation → circumstance → initiating event → action → reported outcome. Separate reported reason, supported situation and PM driver hypothesis. Preserve protective factors and a rival explanation. Deep extraction is a bounded 3–5-item stretch until the lean path works reliably.
7. **Review and count.** A researcher accepts, corrects or rejects proposed labels against the original. Count accepted, distinct source roots by question, metric node and exit form. Show the denominator and source mix. These are corpus counts, never estimated prevalence among Groww beginners.
8. **Answer and compare.** Each of the nine answers must contain a direct bounded statement, linked supporting accounts, count/denominator, counterexample, unknown and next discriminating method. Compare researcher-named candidate problems without an automatic score. If evidence cannot support an answer, show the gap rather than fluent filler.

## Source-to-question fit

- **Q1, Q3, Q6:** first-person narratives and written follow-ups can explain stated starting aims, interruptions, workarounds and off-app action. Short store reviews may identify a reported event but often omit motive or ending.
- **Q2, Q7:** require a sequence or comparable continuation/recovery and interruption accounts. Isolated complaints cannot show how a person changed over months or what separates continuers.
- **Q4:** checking frequency needs an explicit reference period; public silence cannot establish it. A diary or focused written follow-up is the likely next method.
- **Q5:** a SIP-specific screen, status or control and its reported consequence. General app dissatisfaction stays outside this question.
- **Q8:** age, income pattern, funding source and influence only when stated. Missing dimensions remain unknown; no demographic inference from language or forum membership.
- **Q9:** a repeated, supported desired progress plus consequence and current alternative. This yields a *candidate need*, not a chosen solution.

## Immediate PM decision

The next useful work is a small, source-cleared corpus with at least one direct first-year Groww account, ordinary-success contrast and a specific interruption or informed pause. Then perform a human source review and write one bounded question answer. If the direct cohort remains unobservable publicly, use the separate consented written-response lane for event reconstruction and state the limit. A larger pile of uncoded or rights-unresolved rows would not improve the decision.
