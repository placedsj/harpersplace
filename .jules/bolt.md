## 2024-05-23 - [Dashboard Performance & Stability]
**Learning:** Found `DashboardPage` manually fetching data in `useEffect` while also using `useCount` hook for the same data, causing double network requests. Also found `useEffect` calling undefined `setIsClient`, likely causing silent crashes or dead code. Firestore queries were created inline, defeating `useCount` internal optimization.
**Action:** Always check for redundant manual fetches when hooks are available. Wrap Firestore queries in `useMemo` to ensure referential stability for hooks.
## 2024-05-23 - [Build Stability]
**Learning:** Generic 'Pages changed' CI failures often mask underlying TypeScript compilation errors like duplicate identifiers or missing imports. Always verify with `npx tsc --noEmit` before submitting, even if the primary task seems unrelated.
**Action:** Include `npx tsc --noEmit` in the verification steps of every plan involving code changes.
## 2024-05-23 - [Next.js Route Config & Deployment]
**Learning:** Exporting `const dynamic = 'force-dynamic'` (or similar Route Segment Config) from a component marked with `'use client'` causes build/deployment failures, especially with the Netlify Next.js plugin.
**Action:** Use the 'Server Component Wrapper' pattern. Move the client logic to a separate file (e.g., `*-client.tsx`) and keep `page.tsx` as a Server Component that exports the config and renders the client component.
