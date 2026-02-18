## 2024-05-23 - [Dashboard Performance & Stability]
**Learning:** Found `DashboardPage` manually fetching data in `useEffect` while also using `useCount` hook for the same data, causing double network requests. Also found `useEffect` calling undefined `setIsClient`, likely causing silent crashes or dead code. Firestore queries were created inline, defeating `useCount` internal optimization.
**Action:** Always check for redundant manual fetches when hooks are available. Wrap Firestore queries in `useMemo` to ensure referential stability for hooks.
