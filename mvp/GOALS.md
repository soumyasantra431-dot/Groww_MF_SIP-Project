# MVP goals and acceptance criteria

## Goal

Help a tester distinguish a reported SIP-payment event from a confirmed successful SIP and from the *following scheduled* payment, then find the right official check without being pushed to invest.

## Observable prototype outcomes

1. A tester can enter one de-identified payment story or use a clearly labelled sample.
2. The AI proposes one finite current state with an exact supporting phrase, or says unknown; a tester can correct it.
3. The receipt separates **reported now**, **not verified**, and **check next scheduled payment**. It never says the actual SIP or next AutoPay succeeded.
4. The official Groww route is fixed by the accepted state. Mixed bank-debit/failure signals, missing facts, private input, and advice-like content resolve to a safe fallback.
5. A non-AI guide remains usable when the model is off or fails. The UI explains when AI was used and that no account was accessed.

## Quality and decision rule

Engineering tests must pass privacy, negation, conflicting-status, multiple-SIP and intentional-pause cases. On approximately 20 independently human-labelled real items, report correct, wrong, abstained, invented and missed fields with denominators. **Any** invented final payment success, unsafe duplicate-payment suggestion, fund advice or continuation pressure blocks the public AI path. AI stays experimental until this independent result exists; a passing synthetic fixture is not that result. Compare current Groww help, the fixed guide and AI on identical tasks. Keep AI only if it adds useful understanding without worse safety.

## Explicit non-goals

Repair AutoPay, diagnose bank/rail fault, fetch order history, save a user's story, calculate Groww retention, recommend investments, infer affordability, or call a mock task an interview. A real next-cycle outcome or month-12 lift needs Groww data or follow-up and remains unknown here.
