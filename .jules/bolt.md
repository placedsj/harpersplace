## 2025-02-23 - Duplicate Data Fetching in Dashboard
**Learning:** The `MainDashboard` component was fetching the same data twice: once via the `useCount` hook (efficient) and again via a manual `useEffect` with `getCountFromServer` (redundant). This caused double network requests and potential double rendering ("00").
**Action:** Always check if existing hooks (`useCount`, `useCollection`) already provide the data before adding manual fetching logic. When refactoring, ensure old fetching logic is fully removed.

## 2025-02-23 - React Hooks Stable Reference Pattern
**Learning:** When using object dependencies (like Firestore Queries) in `useEffect`, avoid `JSON.stringify` or manual subscription management inside the effect (which breaks in Strict Mode). Instead, use `useRef` to store a "stable" version of the object that only updates when a deep/semantic check (e.g., `queryEqual`) passes.
**Action:** Use the pattern: `const ref = useRef(val); if (!equal(val, ref.current)) ref.current = val; useEffect(..., [ref.current]);`.
