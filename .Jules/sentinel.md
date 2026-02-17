# Sentinel's Journal - Critical Security Learnings

## 2026-02-17 - Overly Permissive CORS Configuration
**Vulnerability:** The custom Express server was configured with `cors({ origin: true, credentials: true })`. This setup reflects the `Origin` header of the request, effectively allowing any domain to make authenticated requests if the user is logged in (acting like a CSRF bypass via CORS).
**Learning:** Defaulting to convenient CORS settings during development (like `origin: true`) can easily slip into production code if not explicitly guarded. Custom server setups in Next.js bypass standard Next.js config (like `next.config.js` headers), requiring manual security implementation.
**Prevention:** Always implement an explicit origin whitelist. Use a helper function (like `createCorsOriginCheck`) that validates against a known list of domains (e.g., from `REPLIT_DOMAINS` or environment variables) and strictly limits localhost access to development environments.
