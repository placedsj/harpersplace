## 2025-02-27 - Redundant Data Fetching Patterns
**Learning:** "Optimizing" by manually fetching data in `useEffect` to avoid hook overhead can backfire if the original hooks are not removed. This leads to double network requests and race conditions. Always audit component data fetching to ensure a single source of truth.
**Action:** When refactoring data fetching, verify that old patterns (hooks vs effects) are completely replaced, not just augmented.
