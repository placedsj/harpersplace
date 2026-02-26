## 2026-02-26 - Missing Input Validation in AI Flows
**Vulnerability:** Several AI flows (Server Actions) accept arbitrary text inputs without length validation, creating a DoS/Cost risk.
**Learning:** Genkit flows defined with `ai.defineFlow` use Zod schemas, but often default to `z.string()` which is unbounded.
**Prevention:** Always add `.min()` and `.max()` constraints to Zod string schemas for AI inputs, especially for public-facing server actions.
