## 2025-05-23 - Show/Hide Password Toggle
**Learning:** Password visibility toggles are critical for mobile users and those with cognitive impairments. Masking characters by default increases typing errors, leading to frustration and abandonment. A toggle reduces cognitive load by allowing verification before submission.
**Action:** Always include a show/hide toggle on password inputs, especially on mobile-first designs. Use clear iconography (Eye/EyeOff) and accessible labels.

## 2025-05-23 - Flash of Empty State
**Learning:** Checking `logs && logs.length > 0` immediately renders the empty state while data is loading (logs is undefined). This causes a jarring flash of "No recent activity" before the content loads.
**Action:** Always explicitely check `loading` state before rendering the empty state condition. Use skeleton loaders to maintain layout stability during data fetch.

## 2025-05-24 - Empty State Call-to-Action
**Learning:** Empty states without actions are dead ends. When users encounter an empty list, providing a direct "Create" button within the empty state reduces friction and guides them to the primary action.
**Action:** Always include a primary action button (e.g., "Create First Entry") in empty state components, rather than relying solely on the main page action button.
