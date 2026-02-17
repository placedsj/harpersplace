## 2024-05-23 - Build Failure on Colocated Component/Type Files
**Learning:** Colocating non-page component or type files (e.g., `evidence-list.tsx`, `evidence-log-types.ts`) directly within Next.js App Router directories (`src/app/...`) can sometimes trigger build failures or confusion in certain CI environments (like Netlify) or with specific tooling.
**Action:** Move shared components to `src/components/` and types to `src/lib/types.ts` or `src/types/` to ensure a clean separation of concerns and avoid build ambiguity.
