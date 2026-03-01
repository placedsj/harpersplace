## 2025-02-23 - Duplicate Data Fetching in Dashboard
**Learning:** The `MainDashboard` component was fetching the same data twice: once via the `useCount` hook (efficient) and again via a manual `useEffect` with `getCountFromServer` (redundant). This caused double network requests and potential double rendering ("00").
**Action:** Always check if existing hooks (`useCount`, `useCollection`) already provide the data before adding manual fetching logic. When refactoring, ensure old fetching logic is fully removed.

## 2025-02-28 - Optimizing Mixed Form and List Views
**Learning:** In components combining input forms and expensive list rendering (like EvidenceLogPage), inline rendering of list items causes O(N) re-renders on every keystroke in the form.
**Action:** Extract list items into separate components wrapped in React.memo (e.g., EvidenceEventCard) to isolate list rendering from form state updates, significantly improving form input performance.
