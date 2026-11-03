# Discovery engine build handoff — paused for Fellow instructions

**Scope:** research engine only. The investor segment, underlying problem and customer MVP remain open. The Fellow asked to stop after this bounded handoff and will supply further build instructions. Do not extend the interface, collect new data, run a model, commit, create a remote or deploy before that steering arrives.

## Current stack

- **Local UI:** React 19 + TypeScript + Vite, served at `http://127.0.0.1:4317/`.
- **Local API and research workspace:** Node 24 HTTP server and built-in SQLite. The ignored `.local` folder holds the database and raw input; `.dev.vars` holds the Groq key and disabled Free-only settings.
- **Extraction:** a Groq provider adapter and Zod validation. The separate lean twelve-field pilot exists, but has not passed a synthetic structure check. The old full-packet batch and live-paste routes are held locally, in the CLI and in the Worker.
- **Public plan:** Cloudflare Worker + static read-only snapshot; a live tester only after validation. GitHub remote and Cloudflare deployment do not yet exist.
- **Versions:** the directory has Git initialized but **no commits and no remote**. GitHub CLI is authenticated. `.gitignore` excludes `.local`, `.dev.vars`, downloaded/source research, outputs and the generated snapshot by default. Create curated local checkpoints and inspect staged files before a later GitHub push, respecting the earlier localhost-review sequence.

## Data and answer boundary

Real, source-cleared public accounts or consented written responses can enter research. Record original locator, date, speaker, source permission, query/run count and cohort-fit uncertainty. Normalize and deduplicate source units; count forum roots, never assume unique investors. Model labels are proposals. Accepted evidence feeds nine question answers with source links, denominators, counterexamples and unknowns; researcher-named candidate problems are compared without an automatic winner. Public text cannot calculate Groww's month-12 investor retention.

The 12 existing synthetic cases are test fixtures, not interviews or investor evidence. No large fictional spreadsheet was generated. Synthetic material may later demonstrate the UI only in a separate, conspicuously labelled demo lane; it must never fill research counts, answers or deck findings. The current source-by-source access decision is in `research/SOURCE_ROUTE_DECISION_2026-11-02.md`. Play/App developer review APIs do not supply Groww owner access; Reddit research access is unresolved; the YouTube API exists but its project use decision remains unresolved. TradingQ&A has a bounded local-use interpretation.

## Verified state at pause

Local workspace: 20 historical inputs, 0 coded findings, 0 nine-question narrative answers, 0 candidate problems. Six prior provider attempts, no validated extraction, $0 recorded spend. The 130-label attachment was imported locally as a post-AI development reference, not blind gold. The last run before this handoff passed 81 engineering tests and the Vite/TypeScript build; no later model call or dataset import occurred. This handoff itself did not test a customer outcome. GitHub has not been changed.

**Next action after the Fellow's steering:** assess the proposed build instructions against this evidence contract, then take one bounded local implementation step and verify it. Do not represent a synthetic walkthrough as a research finding.
