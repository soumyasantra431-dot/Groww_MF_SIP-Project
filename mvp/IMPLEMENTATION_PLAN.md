# MVP implementation sequence

1. **Freeze contract:** use [CONTEXT.md](CONTEXT.md), [GOALS.md](GOALS.md), [ARCHITECTURE.md](ARCHITECTURE.md), and the project [solution decision](../FINAL_MVP_SOLUTION_CONTRACT_2026-11-09.md). Do not broaden into a chatbot or automatic payment repair.
2. **Complete local path:** add labelled samples, editable state correction, fixed non-AI guide, current-cycle receipt and separate next-cycle self-report. Preserve privacy, official-link mapping and no-advice text.
3. **Check engineering:** run state and Worker tests for safe fallback, negation, conflict, intentional pause and inaccessible model; build and inspect the local UI.
4. **Evaluate AI:** freeze de-identified real inputs and independent human labels before predictions; report field-level counts and severe errors. Synthetic fixtures are only development checks. Keep the public AI kill switch on if this gate is incomplete or fails.
5. **Release:** reconcile the current dirty checkout with the deployed engine branch; publish the tested safe path; verify the public task, fallback and link. Record actual URL and limitations.
6. **Learn:** compare existing help, fixed guide and AI on the same tasks; seek three real target users if possible. Without them, report the brief's user-testing requirement unmet. Do not infer month-12 effect from prototype completion.
