## 2024-05-24 - Missing Input Sanitization on Firestore Writes
**Vulnerability:** Feature pages writing to Firestore (e.g., EvidenceLogPage, HealthPage) currently bypass input sanitization, leading to Stored XSS vulnerabilities when user inputs are rendered.
**Learning:** React escapes text by default, but when raw data from Firestore is rendered as HTML or used in unsafely structured components, it can cause XSS. Furthermore, data consistency and sanitization should occur at the boundary (before insertion) to prevent malicious payloads from living in the database.
**Prevention:** Always use `sanitizeText` from `@/lib/input-sanitization` on all user-provided strings before calling `addDoc` or `updateDoc` in feature pages.
