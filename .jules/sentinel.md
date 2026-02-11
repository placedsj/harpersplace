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

## 2025-02-19 - [Deployment Stability - Firebase Admin]
**Vulnerability:** Build-time crashes due to missing environment variables (`FIREBASE_ADMIN_CREDENTIALS`) when server-side modules initialize services at the top level.
**Learning:** Top-level initialization of services (like `admin.initializeApp()`) runs as soon as the module is imported, even during the build process (e.g., static generation). If the required secrets are not present in the build environment, the build fails.
**Prevention:** Lazily initialize services inside the functions/actions that use them, or wrap initialization in a helper function that is only called at runtime.
**Learning:** Dependencies like `firebase-admin` must be explicitly listed in `package.json` `dependencies`, not just relied upon transitively or installed locally but missing from the manifest. This causes "Module not found" errors in CI/CD environments.
**Prevention:** Run `npm install <package>` to update `package.json` correctly.
