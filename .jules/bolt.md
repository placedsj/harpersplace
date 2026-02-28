## 2025-02-23 - Duplicate Data Fetching in Dashboard
**Learning:** The `MainDashboard` component was fetching the same data twice: once via the `useCount` hook (efficient) and again via a manual `useEffect` with `getCountFromServer` (redundant). This caused double network requests and potential double rendering ("00").
**Action:** Always check if existing hooks (`useCount`, `useCollection`) already provide the data before adding manual fetching logic. When refactoring, ensure old fetching logic is fully removed.

## 2025-02-28 - Firestore Query Object Serialization Performance Pitfall
**Learning:** Using `JSON.stringify()` on Firestore `Query` objects to detect changes in React hooks (like `useCollection`) is extremely slow, risks throwing TypeErrors on circular references, and can cause a bug where the effect returns early on initial mount because `JSON.stringify(query) === JSON.stringify(query)`.
**Action:** Always use Firestore's native `queryEqual` function and a `useRef` storing the actual `Query` object (initialized to `null`) for efficient O(1) comparison of Firestore query objects.
