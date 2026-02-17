## 2024-05-23 - Firestore Query Serialization Anti-Pattern
**Learning:** `JSON.stringify()` on Firestore `Query` objects is unreliable and can cause crashes or performance issues due to circular references and large object size.
**Action:** Always use `queryEqual()` from `firebase/firestore` to compare queries. Use a `useStableQuery` hook pattern to stabilize query references for `useEffect` dependencies.
