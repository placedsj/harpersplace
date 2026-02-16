## 2024-05-22 - Strict CORS with REPLIT_DOMAINS
**Vulnerability:** The custom Express server was configured with `cors({ origin: true, credentials: true })`, allowing any site to make authenticated requests.
**Learning:** In Replit/Next.js custom server setups, `REPLIT_DOMAINS` is the source of truth for allowed origins. However, for local development, fallback to `localhost` is critical as `REPLIT_DOMAINS` might be missing. Trailing slash inconsistencies between config and Origin headers must be normalized.
**Prevention:** Use the `createCorsOriginCheck` helper in `server/security.ts` which encapsulates this logic (stripping trailing slashes, handling localhost/https protocols) and ensures consistent enforcement across the app.
