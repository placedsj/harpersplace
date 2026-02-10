## 2025-02-19 - [Security Headers & Code Restoration]
**Vulnerability:** Missing standard security headers (HSTS, X-Frame-Options, X-Content-Type-Options, etc.) on API routes handled by Express.
**Learning:** In a shallow clone or limited environment, corrupted files cannot be restored via `git checkout`. When a file is found corrupted by previous operations (e.g. `_mod` artifacts), manual reconstruction based on imports and remaining context is necessary to fix the build.
**Prevention:** Always verify file integrity before and after operations. Use `read_file` extensively.
