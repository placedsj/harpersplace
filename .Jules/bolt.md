## 2024-05-23 - Form Input Lag due to List Re-renders
**Learning:** Forms sharing state with large lists in the same component cause the list to re-render on every keystroke, leading to input lag.
**Action:** Extract the list into a separate component wrapped in `React.memo` to isolate it from form state updates.
