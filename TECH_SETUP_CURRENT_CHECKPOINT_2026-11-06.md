# Tech setup checkpoint for the active Groww SIP checkout

**Checked 6 November 2026.** This note reconciles the [November 3 tech setup guide](C:/Users/DELL/.codex/worktrees/7648/3rd%20%26%20Final%20Graduation%20Project/TECH_SETUP_GUIDE.md) from chat 3 with the active OneDrive checkout. The older guide is useful for sequence and safeguards; its worktree inventory is not the state of this checkout.

## What is configured here

- Local research app at `http://127.0.0.1:4317/`; latest local database response: 102 stored rows = 99 public-conversation entries + 3 test controls. These are saved entries, not approved user findings or distinct investors. Play Store has 50 provisional candidate reviews, App Store has 2 provisional candidate reviews. Nine approved answers: 0.
- `wrangler.jsonc` **already names** the Worker `sip-research-viewer` and points to `worker/index.mjs` plus Vite static assets. This corrects the older guide's statement that no name exists.
- Ignored `.dev.vars` exists. Groq Free is marked confirmed, while `ALLOW_MODEL_CALLS=false` and `MODEL_KILL_SWITCH=true`; no key value was read into this note. The public Worker still responds 503 to live classification. This is deliberate until source-fidelity evaluation passes.
- `public/snapshot.json` exists locally but is ignored by Git. Its existence does not mean a reviewed public snapshot will be deployed. No Git remote is configured; Wrangler is not pinned/installed in this checkout. GitHub CLI is available.
- Current tests: 120 pass; type-check and frontend build pass. These verify software behavior, not AI extraction accuracy or the investor problem.

## Setup decisions carried forward

1. Keep raw or de-identified original text in ignored local intake; publish only a reviewed derived snapshot. A spreadsheet is an intake format, not proof that an account is genuine.
2. Do not request Play or Apple developer review API keys for Groww: those APIs serve the app owner's reviews. The available YouTube key does not by itself resolve derived-use terms or comment relevance. Reddit remains held pending a valid research route.
3. Source review and the lean model's fidelity gate precede approved nine-question answers and live paste. The prior ten-item development reuse did not pass that gate; it is not a validated accuracy score.
4. After localhost works with a publication-safe snapshot, create/connect a private GitHub remote and a Cloudflare Worker build. Verify the public URL and its `/api/workspace` response before calling the engine deployed. The read-only viewer requires no public model secret; a separately validated live tester would require a Cloudflare secret and rate limits.

## Current PM consequence

The next evidence task is source verification and review of decision-relevant Play/forum accounts, with first-time status, initiating event, actual next instalment outcome and rival explanation kept separate. More retrieved reviews alone do not supply Groww's investor-level month-12 retention numerator or denominator. The next engineering task is to make the coded, source-linked question path legible and test any lean extraction repair on synthetic fixtures before a frozen real-item measurement run. No cohort, opportunity or feature is selected by the present inventory.
