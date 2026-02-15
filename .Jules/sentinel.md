## 2025-02-21 - [Replit Auth & CORS]
**Vulnerability:** Default CORS configuration (`origin: true`) allowed any site to make authenticated requests, exposing the app to CSRF and data theft.
**Learning:** `REPLIT_DOMAINS` environment variable is the single source of truth for allowed domains in this architecture. Authentication logic (`replitAuth.ts`) also depends on it.
**Prevention:** Always restrict CORS origins to trusted domains. Use `REPLIT_DOMAINS` for this purpose in this codebase.

## 2025-02-21 - [CI Failure & Netlify Deployment]
**Vulnerability:** N/A (Build Failure)
**Learning:** Netlify deployment of Next.js 15 requires `sharp` in `dependencies` and `@netlify/plugin-nextjs` in `devDependencies`. Also, `src/app/(main)/fund/page.tsx` corruption causes build failures.
**Prevention:** Ensure these dependencies are present and files are intact before deploying.
