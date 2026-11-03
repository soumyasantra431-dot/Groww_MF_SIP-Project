# SIP Research Workspace

**Latest checkpoint:** [Architecture decision](research/ENGINE_ARCHITECTURE_LOCK_2026-11-02.md) sets the discovery engine's output and processing contract. [Resume state](PROJECT_STATE.md) records the current build. The local workspace has 20 historical inputs, zero coded results and no completed nine-question answers. Six provider attempts are recorded, with zero USD spend; none produced a validated research extraction. The separate lean pilot remains gated. The old full-packet batch, CLI prediction and live-paste routes are held, including in the production Worker, until the lean path is validated and integrated.

Independent academic research instrument for Groww's first-year MF/SIP continuation brief. No investment advice or fund/stock recommendations. No automatic opportunity selection or public-post prevalence estimates.

**Scope:** seven source families are supported through permission-checked local intake, but they are not seven live connections. A historical 280–350 Tier A collection target remains aspirational; report achieved counts. The detailed 13-bundle Tier B pass is now an optional 3–5 case stretch. Synthetic fixtures, expert context and consented survey accounts have separate lanes. No segment, cause or customer feature has been selected.

## Start locally

Requires Node 24+ (tested with 24.22.1), pnpm. From this directory:

```powershell
pnpm.cmd install
pnpm.cmd seed
pnpm.cmd dev
```

Open http://127.0.0.1:4317. If pnpm is not on PATH, this machine's bundled executable is `C:\Users\DELL\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd`. It is not a project dependency and should not be assumed on another computer.

First startup creates a local SQLite database and an ignored `.dev.vars` copied from `.env.example`. The default is **AI disabled**, cap zero, kill switch on. The seed imports twenty previously recorded original excerpts, including three unrelated-documentation controls. These are not the final corpus or full-post evidence. No provider calls occur during setup, seed, build or unit tests.

## Free-only model configuration

The Groq key is already configured locally. Keep any key in ignored `.dev.vars`, never in chat, Git or a public snapshot:

```dotenv
MODEL_PROVIDER=groq
GROQ_API_KEY=your_key_here
MODEL_ID=openai/gpt-oss-120b
MODEL_SPEND_CAP_USD=0
ALLOW_MODEL_CALLS=false
MODEL_KILL_SWITCH=true
```

The owner confirmed the key's Free plan. The project remains Free-only with zero monetary cap and no paid fallback. The pilot's source, privacy and structure gates still apply. Enabling the model setting alone cannot open the held batch or live tester. Keys stay server-side; never use a `VITE_` prefix for secrets.

No Reddit, Apple, Google Play, GitHub or Cloudflare key is needed for manual original-text CSV intake. The optional YouTube route needs a separate `YOUTUBE_API_KEY` and a valid source-specific permission basis; its documented derived-data restrictions are unresolved. The store tool filters a lawful local export; it does not crawl Groww reviews. GitHub/Cloudflare access comes later at publication. A third-party data key cannot override source permissions. See the collection contract before executing a collector.

## Research workflow

CSV template: `templates/corpus.csv`. Raw CSV goes only to ignored `.local/raw`. Metadata, proposed labels and short paraphrases go to `.local/workspace.sqlite`. A URL without original text is rejected; no link-only collection or analysis path exists. A live tester paste is never stored.

```powershell
pnpm.cmd pipeline import path-to-local-corpus.csv
pnpm.cmd pipeline select
pnpm.cmd pipeline export
```

`run-a`, `run-b` and `predict-gold` currently stop without model calls because they use the superseded full-packet path. `evaluate` needs predictions that do not yet exist. The separate frozen lean runner remains blocked until a synthetic result passes its structure gate. The supplied 130 post-audit labels are in ignored `.local/smoke-pilot/v1/post-audit-reference.json`; they were adjudicated after AI outputs were seen and are a development reference, not blind gold. The original `fellow-labels.json` remains incomplete. Review semantic matches and invented values against originals before any quality claim.

Review source originals, labels, rights and paraphrases locally. Public snapshots include only accepted corpus items marked terms-cleared, not the raw text. The local UI supports tag/material-field corrections and source-specific terms-decision logs. Terms clearance requires an actual source-based permission review; setting a label does not create permission. Do not edit database rows to pretend permission exists. Raw snapshots are never created from every proposal.

## Verification and production boundary

```powershell
pnpm.cmd test
pnpm.cmd build
```

Tests use synthetic fixtures and fake provider responses. They are engineering checks, not model or participant evaluation. `worker/index.mjs` has no corpus upload, batch, review or admin APIs; its live paste route is held until validation. No deployment has occurred. No Queues or Cloudflare Access.

Actual state and remaining gaps: [Project state](PROJECT_STATE.md). The user-facing deadline is 9 November 2026, 3:59 PM IST.
