## 2025-05-23 - Show/Hide Password Toggle
**Learning:** Password visibility toggles are critical for mobile users and those with cognitive impairments. Masking characters by default increases typing errors, leading to frustration and abandonment. A toggle reduces cognitive load by allowing verification before submission.
**Action:** Always include a show/hide toggle on password inputs, especially on mobile-first designs. Use clear iconography (Eye/EyeOff) and accessible labels.

## 2025-05-23 - Flash of Empty State
**Learning:** Checking `logs && logs.length > 0` immediately renders the empty state while data is loading (logs is undefined). This causes a jarring flash of "No recent activity" before the content loads.
**Action:** Always explicitely check `loading` state before rendering the empty state condition. Use skeleton loaders to maintain layout stability during data fetch.

## 2025-05-23 - CI/CD Compatibility
**Learning:** Netlify deployment via  is incompatible with  in . Additionally,  can cause configuration conflicts.
**Action:** Always verify  for these settings when encountering "Redirect rules" or "Header rules" build failures on Netlify. Also, be wary of syntax errors in config files that might slip through if local typechecking is unavailable.

## 2025-05-23 - CI/CD Compatibility
**Learning:** Netlify deployment via `@netlify/plugin-nextjs` is incompatible with `output: 'standalone'` in `next.config.ts`. Additionally, `allowedDevOrigins` can cause configuration conflicts.
**Action:** Always verify `next.config.ts` for these settings when encountering "Redirect rules" or "Header rules" build failures on Netlify. Also, be wary of syntax errors in config files that might slip through if local typechecking is unavailable.

## 2025-05-23 - Netlify Headers
**Learning:** Moving security headers from `next.config.ts` to `netlify.toml` resolves "Header rules" build failures by bypassing the Netlify plugin's configuration generation step, which can be brittle.
**Action:** When deploying to Netlify, prefer `netlify.toml` for static headers and redirects over Next.js config to ensure reliability.
