## 2025-02-19 - Circular Dependencies in Next.js Pages
**Learning:** Importing types directly from page components (e.g., `import { DailyLog } from '@/app/(main)/log/page'`) into other components causes circular dependencies that can break Netlify builds with generic errors like "Pages changed" or "Header rules".
**Action:** Always define shared types in `src/lib/types.ts` or similar shared modules, and import them from there in both the defining page and consuming components.
