# Sentinel's Journal

## 2024-05-22 - [Project Initiation]
**Vulnerability:** N/A
**Learning:** Initial setup of Sentinel security journal.
**Prevention:** N/A

## 2024-05-22 - [Genkit Flow Input Validation]
**Vulnerability:** Unbounded string inputs in Genkit AI flows allowing potential Denial of Service (DoS) and excessive LLM costs.
**Learning:** Genkit flows using `z.string()` do not automatically enforce length limits. Input schemas must explicitly chain `.min()` and `.max()` constraints.
**Prevention:** Always apply `.max(N)` to string inputs in AI flows, where N is a reasonable upper bound for the expected content (e.g., 500 for short text, 5000 for longer logs).
