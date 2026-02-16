## 2024-05-22 - Firestore Query Stability
**Learning:** `JSON.stringify` on Firestore `Query` objects is unsafe and inefficient for dependency tracking in hooks, as it can cause circular reference errors and unnecessary re-renders/subscriptions.
**Action:** Always use `queryEqual` from the Firestore SDK combined with a `useStableQuery` pattern (updating a ref during render based on deep equality) to memoize queries for `useEffect` dependencies.

## 2024-05-22 - Redundant Data Fetching Pattern
**Learning:** Components using both a custom hook (like `useCount`) AND a manual `useEffect` to fetch the same data cause duplicate network requests and potential race conditions/UI flickering.
**Action:** Audit components for duplicate data fetching logic. Trust the custom hooks (if implemented correctly) or refactor them to be reliable, rather than adding manual fallbacks that double the load.
