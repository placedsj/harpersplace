## 2024-05-22 - SSR-Unsafe Sanitization Utility
**Vulnerability:** The `sanitizeText` utility used `document.createElement('textarea')` to decode HTML entities. This causes a runtime crash in Server-Side Rendering (SSR) environments (Node.js) where `document` is undefined. While currently unused in server code, any future import would break the build or runtime.
**Learning:** Shared utility libraries in Next.js/React frameworks must be environment-agnostic. Relying on browser-specific APIs (DOM) in code that *could* run on the server is a ticking time bomb.
**Prevention:** Use regex-based replacement or an environment-agnostic library (like `he` or `dompurify` with jsdom, though libraries add weight) for entity decoding in shared code. Always test utilities in a Node.js environment.
