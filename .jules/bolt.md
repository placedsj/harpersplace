## 2025-02-23 - Firestore Query Serialization Performance
**Learning:** Using `JSON.stringify(query)` to detect changes in Firestore queries is an anti-pattern. Not only is it slow (O(N) string serialization), but it can also fail on circular structures often found in complex objects. The Firestore SDK provides `queryEqual(q1, q2)` which is optimized for this exact purpose.
**Action:** Always use `queryEqual` for comparing Firestore queries in hooks like `useCollection` or `useCount`. Avoid `JSON.stringify` on any complex SDK objects.
