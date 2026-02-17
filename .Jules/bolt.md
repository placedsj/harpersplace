## 2024-05-23 - Build Failure on Unused Imports and Dynamic Pages
**Learning:** Next.js builds (especially on Netlify) can fail strictly on unused imports or when dynamic pages (using `useSearchParams`) lack `export const dynamic = 'force-dynamic'`.
**Action:** Always clean up unused imports before submission and explicitly mark pages as dynamic if they rely on runtime request data like search params or auth state.
