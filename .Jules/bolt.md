## 2025-02-19 - Redundant Data Fetching Pattern
**Learning:** The dashboard was fetching count data twice: once via `useCount` hook and once manually via `useEffect` + `getCountFromServer`. This doubled Firestore read costs and introduced race conditions. The manual fetch also referenced an undefined `setIsClient` function, causing runtime errors.
**Action:** Always check for redundant data fetching when multiple hooks or effects are used in the same component. Use consolidated hooks (like `useCount`) instead of manual effects where possible.
