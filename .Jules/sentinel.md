## 2025-02-21 - [Replit Auth & CORS]
**Vulnerability:** Default CORS configuration (`origin: true`) allowed any site to make authenticated requests, exposing the app to CSRF and data theft.
**Learning:** `REPLIT_DOMAINS` environment variable is the single source of truth for allowed domains in this architecture. Authentication logic (`replitAuth.ts`) also depends on it.
**Prevention:** Always restrict CORS origins to trusted domains. Use `REPLIT_DOMAINS` for this purpose in this codebase.
