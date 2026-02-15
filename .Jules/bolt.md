## 2025-02-19 - Type Mismatches in Server Actions
**Learning:** A type mismatch in a Server Action (e.g., passing `imageBase64` to a function expecting `imageDataUri`) can cause build failures in Next.js, often manifesting as generic "Pages changed" errors in Netlify if the build aborts silently or produces partial output.
**Action:** Carefully check argument names and types when calling server-side functions from Client Components, especially when using Zod schemas for validation.
