## 2025-05-23 - Show/Hide Password Toggle
**Learning:** Password visibility toggles are critical for mobile users and those with cognitive impairments. Masking characters by default increases typing errors, leading to frustration and abandonment. A toggle reduces cognitive load by allowing verification before submission.
**Action:** Always include a show/hide toggle on password inputs, especially on mobile-first designs. Use clear iconography (Eye/EyeOff) and accessible labels.

## 2025-05-23 - Flash of Empty State
**Learning:** Checking `logs && logs.length > 0` immediately renders the empty state while data is loading (logs is undefined). This causes a jarring flash of "No recent activity" before the content loads.
**Action:** Always explicitely check `loading` state before rendering the empty state condition. Use skeleton loaders to maintain layout stability during data fetch.

## 2026-02-22 - Infinite Loading on Mount
**Learning:** `useRef` initialization in `useCollection` matched the initial query string, causing `useEffect` to bail out early and preventing data subscription on mount. This resulted in an infinite loading state for the user.
**Action:** Initialize `useRef` with a sentinel value (e.g., `undefined`) distinct from the query's initial state to ensure the effect always runs at least once.
