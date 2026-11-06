# Lean extraction repair: development record

**Decision served:** Can one Free-tier LLM propose source-anchored SIP event facts reliably enough to justify a public paste-and-classify tester? This record is about extraction quality, not whether a Groww retention problem has been proven.

## Earlier check: what failed

The November 3 ten-item **development reuse** returned ten structurally valid packets, but its post-AI reference comparison found `K = C + W + A = 44 = 12 + 14 + 18` explicitly supported text fields. Exact recall was `12/44 = 27.3%`, versus the preset `70%` proposal gate. It retained `28/34 = 82.4%` reference-unknown fields, versus the `90%` gate. Six unsupported fields received proposed values; three fields failed quote/value validation. There were zero whole-item processing failures. These numbers are diagnostics, **not independent accuracy**: the reference was adjudicated after AI output, and exact free-text wording differences were not fully judged semantically. The Fellow's blind label pack is incomplete.

The field-level diagnostic script (`node scripts/diagnose-lean-development.mjs`) found that outcome, reported reason and trigger were especially weak under exact comparison. Source-family metadata was excluded from recall. A synthetic strict-JSON success before the ten-item run established only transport and structure, not source fidelity. The previous oversized 13-bundle packet is retired from this repair.

Even if **all 14** different-but-supported values were later judged semantically correct, the maximum supported-field recall would be `(12 + 14) / 44 = 26/44 = 59.1%`, still below `70%`. That is why the old run cannot be rescued by wording adjudication alone. Unknown preservation was also below its gate. The post-AI reference may itself contain errors, so this is a development decision rather than an independent model-quality estimate.

## Repair decision

Keep the agreed 10 material fields plus `metric_node` and `exit_form`, exact source quotes, unknown omission, one focal event, and code validation. Use the same Groq Free provider and strict JSON schema. Revise the prompt to check fields in a named order, distinguish initiating event from final outcome, and require literal copied phrases rather than approximate quotes. The first synthetic V10 cases exposed a missing non-episode admission flag, so V11 added a source-anchored disposition (`episode`, `flagged_non_episode`, `uncertain`). Its hypothetical check then proposed conditional reasons as actual-event fields. V12 blocks event tags, triggers, reported reasons, actor attribution, outcomes and continuer status on non-episodes in code as well as the prompt. Do not loosen the privacy or cohort rules, change the preset quality thresholds, or treat a prompt example as a successful independent case. `2026-11-06-lean-disposition-v12` is the request profile for the next frozen synthetic checks.

Constructed fixtures are development checks only. The first fixture is close to a prompt example and tests mechanics more than generalisation. The pause fixture's phrase “in month five” is ambiguous without a clear anchor to SIP age; an unknown month tag may be the more faithful reading. An additional fixture states its timing explicitly. Real inputs remain reserved for a frozen measurement after synthetic repair; they are not debug retries.

## Go/no-go still pending

The original gate remains: zero severe privacy/advice/fabricated-source/false exact-cohort errors; at least `70%` explicit-field recall; at least `90%` unknown preservation; at most one whole-item processing failure in ten; non-episodes flagged or excluded. Compare categorical values exactly and free-text fields by recorded source-based semantic adjudication without rewriting the frozen labels. Report both exact and adjudicated results. A reviewer must declare whether labels were Fellow-blind, assistant-blind, or post-AI development reuse. Only a real, varied, source-cleared measurement with a valid independent reference can enable live public proposals. Until then `/api/classify` remains held and the source walkthrough is the honest evaluator fallback.

No paid API calls or automatic retries are part of this repair.

## Actual constructed-case checks, 6 November

Six Groq Free requests were made on **constructed text only**: two V10, one V11 and three V12. All six returned strict JSON with `finish_reason=stop` and zero rejected fields. Total measured use was `1,452 + 1,491 + 1,528 + 1,312 + 1,771 + 1,764 = 9,318` tokens. The six measured latencies were 1,665, 1,440, 1,408, 844, 1,711 and 1,829 ms. Monetary spend was $0. One attempted invocation was held by the local 65-second pace rule **before** any provider request and is not a processing failure or seventh model call.

- V10 payment interruption: copied exact quotes and distinguished a failed scheduled second instalment from a later one-time manual payment. It did not claim SIP recovery. This case closely resembles the prompt example and is only a mechanics check.
- V10 pause: identified a voluntary, completed pause and a stated hospital-cost reason. It left “in month five” timing unknown; that wording could mean a calendar month, so the original constructed expectation was too certain. It also left investor-wide continuation unknown.
- V11 hypothetical: flagged the account as non-episode but still proposed a conditional job-loss reason as an event fact. This prompted the V12 admission repair.
- V12 hypothetical: flagged non-episode, left both metric tags and actual-event fields unknown. This is a constructed negative check, not a population result.
- V12 explicit-month pause: tagged an actual voluntary event in months 3–6 and the stated reason and reported payment result. It omitted the equivalent `journey_stage` and left the continuer flag unknown.
- V12 one-of-several: tagged the voluntary stop at months 7–12 and reported that another SIP paid, but omitted the matching `journey_stage` and explicit investor-wide continuation flag.

The repeated stage omission has a safe deterministic repair: `metric_node` and `journey_stage` map one-to-one in the agreed schema, so code now fills a missing partner from the **same source anchor**, records `derived_fields`, and never resolves a conflicting pair. It does not derive a continuer flag from an outcome phrase. This postprocessor is versioned as `2026-11-06-timing-completion-v1`; the three V12 responses were obtained before that postprocessor was added. They are development diagnostics, not a homogeneous frozen evaluation.

**Interim decision:** source-anchored structure and a non-episode guard worked on selected constructed cases. The old ten-input pack was then reused once with the revised extractor. The post-AI reference makes that reuse a development diagnostic, not an independent result.

## Reused real-input check after repair

The frozen ten-item pack ran once under V12, with the timing postprocessor. Actual results: **10/10** structurally valid requests, **0** whole-item processing failures, **5** rejected individual fields and **1** ambiguous source anchor. Provider use was **17,982 tokens** and **14,760 ms** summed latency across ten requests; Free monetary spend remained **$0**. Both reference non-episode items were flagged as non-episodes. The items were already used in earlier development, and the comparison labels were adjudicated after earlier AI outputs.

For the **eight reference episodes**, `K = C + W + A = 41 = 12 + 12 + 17` supported text fields. Exact recall was `12/41 = 29.3%`. Even accepting every different supported value as semantically correct would give at most `(12 + 12)/41 = 24/41 = 58.5%`, below the unchanged `70%` gate. Unknown preservation was `28/29 = 96.6%`, above its `90%` gate. One episode field was proposed where the reference had no supported value. Across all ten items, including the two non-episodes for historical comparability, exact recall was `13/44 = 29.5%` and unknown preservation `32/34 = 94.1%`; the episode-only view is the appropriate gate diagnostic. No model output was silently promoted to a verified finding.

**Decision:** stop tuning this extractor for the deadline. The explicit-field gate fails even under the generous semantic ceiling, and the reference is not independent human gold. Local batch and public live paste remain disabled. Keep the genuine source walkthrough as the evaluator fallback; continue source review, bounded nine-question answers and opportunity comparison with their actual evidence limits. A later independent, pre-output human-labelled set would be needed before enabling live public proposals.
