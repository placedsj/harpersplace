## 2024-05-22 - Firestore Query Stability
**Learning:** `JSON.stringify` on Firestore `Query` objects is unsafe and inefficient for dependency tracking in hooks, as it can cause circular reference errors and unnecessary re-renders/subscriptions.
**Action:** Always use `queryEqual` from the Firestore SDK combined with a `useStableQuery` pattern (updating a ref during render based on deep equality) to memoize queries for `useEffect` dependencies.

## 2024-05-22 - Redundant Data Fetching Pattern
**Learning:** Components using both a custom hook (like `useCount`) AND a manual `useEffect` to fetch the same data cause duplicate network requests and potential race conditions/UI flickering.
**Action:** Audit components for duplicate data fetching logic. Trust the custom hooks (if implemented correctly) or refactor them to be reliable, rather than adding manual fallbacks that double the load.

## 2024-05-22 - Netlify Build Failures & Type Exports
**Learning:** Exporting types from Next.js Page components (e.g., `src/app/(main)/log/page.tsx`) and importing them elsewhere (e.g., `dashboard/page.tsx`) can cause Netlify build failures ("Pages changed", "Header rules") due to circular dependencies or server/client boundary violations.
**Action:** Always define shared types in `src/lib/types.ts` or similar shared modules, never in Page components.

## 2024-05-22 - Empty Files in Netlify Build
**Learning:** Empty page files (e.g., `src/app/(main)/fund/page.tsx`) can cause obscure Netlify build failures ("Pages changed", "Header rules", "Redirect rules") that mimic routing or configuration errors.
**Action:** Ensure all page files export a valid React component, even if it's just a placeholder, to prevent build crashes.
