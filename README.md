# Groww first-year SIP discovery engine

This is a research workbench for the graduation brief, not an investing assistant. Its job is to examine permitted, source-linked accounts of mutual-fund SIP experiences; show what happened, what remains unknown, and which possible first-year situations deserve further investigation. It does not calculate Groww retention or select a final customer problem.

Start with [Problem Statement.md](Problem%20Statement.md), the [one-LLM architecture](architecture.md), and the [phase-wise implementation plan](implementation-plan.md). The [Phase 0 contract and measured baseline](PHASE_0_CONTRACT_2026-11-04.md) records the current decision, source access states, quality checks and remaining gaps. [Edge cases](edge%20case.md) cover unusual or ambiguous inputs.

**Current state, 4 November 2026:** Phase 0 is complete locally. The workspace contains 22 seed/control rows: 19 user-voice seeds and three controls. Two rows have unreviewed, assistant-made coding proposals; none is an accepted Groww first-year finding. No nine-question narrative answer or opportunity decision is approved. The source register covers all seven families, but there is no live seven-platform scrape. The live model batch and public tester are held. Read the actual local workspace before using these dated counts in a later report.

The build order is permitted real-source intake → cleaning and duplicate control → lean one-LLM proposals → human review and nine evidence-bounded answers → independent quality evaluation → local evaluator check → privacy-safe public snapshot. Survey responses stay separate; synthetic examples test code only. No paid model mode is planned.

Run locally with `pnpm.cmd dev`; check code with `pnpm.cmd test` and `pnpm.cmd build`. Do not publish the existing `public/snapshot.json` as a current research result; the Phase 0 contract records its status and the release gate.
