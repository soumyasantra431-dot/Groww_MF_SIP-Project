# Phase 3 development check — lean AI extraction

**Date:** 4 November 2026. **Decision:** hold the live classifier and real-source scale-up. The model can return source-anchored proposals, but this run did not establish that it reliably preserves the event distinctions needed by the Groww SIP brief. This is a development result, not an investor finding or an independent accuracy evaluation.

## Why this test was run

The discovery engine must distinguish a first SIP from its first successful instalment, one cancelled SIP from investor-wide inactivity, an initiating failure from a later workaround, and an informed pause from an unwanted interruption. Wrong tags would contaminate the node × exit-form counts and all nine research answers. The decision was whether the existing Groq Free, one-LLM path was safe enough to propose labels for permitted source review.

The earlier ten-item development reuse had 10/10 structurally valid outputs but only 12/44 exact explicit-field matches and retained 28/34 unknown source fields. Those are source-comparison development diagnostics, not blind human accuracy. They justified a synthetic repair before further real-source calls.

## What was built

- Strict JSON lean wire schema and field-level source quote checks remain in place. Prompt profiles `2026-11-04-lean-explicit-facts-v8` and one repair, `2026-11-04-lean-focal-event-v9`, are versioned in `engine/request.mjs` and `engine/lean.mjs`.
- The local proposal now retains UTF-16 source offsets for each supported field. It stores derived labels and offsets, not original text or copied quotes. The original remains in the ignored local input folder for researcher review. No production snapshot or API response was enabled.
- Contradictory node/stage pairs are held for review. A narrow guard now rejects a `first_instalment` or `first_payment` tag whose own anchor says only “first SIP” rather than explicitly “first instalment/payment/debit.” These guards catch known mistakes; they cannot prove semantic correctness.
- `scripts/run-phase3-synthetic.mjs` freezes a small, assistant-authored engineering rubric before model output, records per-call telemetry, and writes receipts only under ignored `.local/`. Synthetic fixtures remain excluded from corpus and research denominators.

## Actual run accounting

| Run | Fixture calls | HTTP/JSON structure | Predeclared checks at run time | Invalid fields held | Actual tokens | Provider latency | 429 / truncation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| v8, six synthetic cases | 6 | 6/6 | 23/29 | 2 | 7,154 = 4,697 prompt + 2,457 completion | 7,905 ms total | 0 / 0 |
| v9, four **reused** failing cases | 4 | 4/4 | 17/20 | 1 | 5,805 = 3,810 prompt + 1,995 completion | 6,376 ms total | 0 / 0 |
| Total development calls | 10 | 10/10 | Not pooled as accuracy | 3 | 12,959 | 14,281 ms total | 0 / 0 |

All calls returned finish reason `stop`, HTTP 200, and $0 under the configured Free plan. These ten fixture calls are **not** ten independent participant examples. The v9 cases were chosen because v8 exposed errors, so 17/20 is not a holdout score. The rubric covered selected tags and missed at least one wrong v8 journey-stage label; even its check proportion overstates quality. Raw fixture text was not written to the receipts.

### Per-call receipt summary

| Profile | ID | Prompt + completion tokens | Latency ms | Failed predeclared fields | Validator rejection |
| --- | --- | ---: | ---: | --- | --- |
| v8 | SYN01 | 784 + 441 | 1,643 | metric_node, exit_form | none |
| v8 | SYN03 | 784 + 555 | 1,609 | none | journey_stage: invalid_value |
| v8 | SYN04 | 780 + 439 | 1,438 | metric_node, exit_form, continuer | none |
| v8 | SYN05 | 789 + 495 | 1,550 | none | none; later manual inspection found a wrong setup stage |
| v8 | SYN12 | 771 + 48 | 368 | none | none |
| v8 | SYN13 | 789 + 479 | 1,297 | exit_form | journey_stage: invalid_value |
| v9 reuse | SYN01 | 951 + 545 | 1,842 | exit_form | none |
| v9 reuse | SYN04 | 947 + 508 | 1,628 | metric_node | none |
| v9 reuse | SYN05 | 956 + 494 | 1,327 | none | none |
| v9 reuse | SYN13 | 956 + 448 | 1,579 | metric_node | journey_stage: invalid_value |

After the run, an offline replay of the new ordinal guard holds SYN13's unsupported `first_instalment` tag. This is a safety improvement, **not** a retroactive model pass. SYN04 still lacks a focal metric node, and SYN01 still lacks a continuer exit form. SYN03's wording can itself be read as the second SIP rather than the second instalment, so that fixture needs clearer wording in any future independent suite. No real-source pilot was run in this phase; earlier frozen public/first-hand development calls are not rerun or counted here.

## PM interpretation and next gate

The safe path is **AI proposal → anchor and consistency check → researcher source review → code counts**. JSON validity only establishes that the response can be parsed. It does not establish that the author meant the label, that the person belongs to Groww's first-year cohort, or that an instalment succeeded. The rival explanation for a missed tag is either model uncertainty or an ambiguous source; the current fixture suite cannot always separate those. The engine should retain unknown and request review rather than silently turn either into a target-cohort fact.

The Phase 3 structural path exists locally, but the **reliability exit gate is not passed**. Keep `/api/classify` and `/api/batch` disabled. The next task is researcher review of a small permitted source set with the original text and offsets visible locally, correction of material tags, and a genuinely independent golden set before claiming validated AI extraction. Use the admitted manual evidence path for the nine question cards if the model remains weak. Do not enlarge the corpus with synthetic stories or claim Groww retention from these calls.

**Reversal condition:** enable a limited local real-source pilot only after a fresh, source-reviewed check shows no severe first-SIP/first-instalment, focal-event, or investor-versus-SIP errors and the pre-registered recall/unknown gates pass. The old development cases cannot serve as that independent gate.

**Unrun:** real permitted-source pilot under v9; human semantic review; 20-item independent golden set; Tier B episode extraction; nine reviewed answers; opportunity comparison; public tester/deployment. **No API key or paid service is needed for the next local review step.**
