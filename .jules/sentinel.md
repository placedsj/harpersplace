## 2025-02-19 - [Security Headers & Code Restoration]
**Vulnerability:** Missing standard security headers (HSTS, X-Frame-Options, X-Content-Type-Options, etc.) on API routes handled by Express.
**Learning:** In a shallow clone or limited environment, corrupted files cannot be restored via `git checkout`. When a file is found corrupted by previous operations (e.g. `_mod` artifacts), manual reconstruction based on imports and remaining context is necessary to fix the build.
**Prevention:** Always verify file integrity before and after operations. Use `read_file` extensively.

## 2025-02-19 - [CI/Build Fixes - Genkit & Firebase]
**Vulnerability:** Client-side exposure of server-only modules (`net`, `fs`, `tls`) via direct import of Genkit flows in Client Components. This breaks the build and potentially exposes server logic structure.
**Learning:** Next.js App Router creates a boundary between Server and Client components. Server-side libraries like `@genkit-ai/flow` (which use Node.js internals) cannot be imported directly into Client Components (`'use client'`). They must be wrapped in Server Actions (`'use server'`) or API routes.
**Prevention:** Always wrap server-side logic (AI flows, DB calls) in Server Actions when calling from Client Components.
**Learning:** `FirebaseProvider` context is required for `useFirestore` and other Firebase hooks. Missing provider in `layout.tsx` causes runtime errors even if build succeeds (or fails during static generation).
**Prevention:** Ensure `FirebaseProvider` wraps the application root.
