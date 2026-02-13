## 2024-05-22 - [Server-Side Security Configuration]
**Vulnerability:** Permissive CORS (reflection) and missing security headers.
**Learning:** Netlify deployment quirks caused removal of Next.js config headers. Security headers must be enforced at the custom server level (Express) to cover all routes including API endpoints, ensuring consistency regardless of deployment platform nuances.
**Prevention:** Centralized security middleware in `server/security.ts` for both CORS and headers.
