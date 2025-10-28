# 🧑‍💻 Copilot Instructions for Harper's Place

## Big Picture Architecture
- **Next.js 15 App Router**: All main features live in `src/app/(main)/` and authentication in `src/app/(auth)/`. Pages are organized by domain (dashboard, calendar, chat, etc.).
- **Firebase Integration**: Auth, Firestore, and Storage are configured in `src/firebase/`. The app supports demo mode if credentials are missing.
- **AI Features**: Genkit flows in `src/ai/flows/` power child-focused tools (schedule optimizer, communication coach, document analyzer, etc.).
- **UI/UX**: Tailwind CSS and Radix UI for styling. All components in `src/components/` and `src/components/ui/` follow strict accessibility and responsive design.
- **Data Flow**: React context providers (`src/firebase/provider.tsx`, `src/hooks/use-auth.tsx`) manage user/auth state and cross-component communication.

## Developer Workflows
- **Local Dev**: `npm install` then `npm run dev` (default port 5000)
- **Type Checking**: `npm run typecheck`
- **Linting**: `npm run lint`
- **Build**: `npm run build` (Next.js production)
- **AI Dev**: `npm run genkit:dev` for Genkit flows
- **Environment Setup**: Copy `.env.local.example` to `.env.local` and fill in Firebase/AI keys
- **Testing**: No formal test suite yet; use manual browser testing and error boundaries (`src/components/error-boundary.tsx`)

## Project-Specific Patterns
- **Child-Centered Design**: All features, data, and UI copy must prioritize child safety and well-being. See `README.md` and `docs/NEW_BRUNSWICK_GUIDE.md` for philosophy.
- **Demo Mode**: If Firebase credentials are missing, the app runs in local-only mode. Check `src/firebase/config.ts` and `src/firebase/index.ts` for fallback logic.
- **AI Flows**: Each Genkit flow in `src/ai/flows/` is a standalone TypeScript module. Use them via API calls or direct import.
- **UI Components**: Use Tailwind utility classes and Radix primitives. All new UI should go in `src/components/ui/` unless domain-specific.
- **Error Handling**: Use `src/components/error-boundary.tsx` for React error boundaries. Input sanitization in `src/lib/input-sanitization.ts`.
- **Accessibility**: Follow WCAG 2.1 AA. Use ARIA labels, focus indicators, and semantic HTML. See `src/lib/accessibility.ts` for helpers.

## Integration Points
- **Firebase**: All auth and data flows go through context providers. Use hooks (`useAuth`, `useFirestore`) for access.
- **Genkit AI**: API keys in `.env.local`. Flows in `src/ai/flows/`.
- **External APIs**: Only Google Gemini/Genkit and Firebase are used. No other third-party integrations.

## Examples
- **Add a new AI tool**: Create a flow in `src/ai/flows/`, add a UI component in `src/components/`, and link from dashboard.
- **Add a new page**: Place in `src/app/(main)/[your-page]/`, update navigation in `src/components/main-nav.tsx`.
- **Add a new context provider**: Place in `src/hooks/` or `src/firebase/` and wrap in `src/app/layout.tsx`.

## Key Files & Directories
- `src/app/(main)/dashboard/page.tsx` — Main dashboard, child-centered actions
- `src/components/dashboard-card.tsx` — Reusable card component
- `src/firebase/config.ts` & `src/firebase/index.ts` — Firebase setup and demo mode logic
- `src/ai/flows/` — Genkit AI flows
- `src/components/error-boundary.tsx` — Error handling
- `src/lib/accessibility.ts` — Accessibility helpers
- `README.md` — Project philosophy and quick start
- `docs/NEW_BRUNSWICK_GUIDE.md` — Child-centered design principles

---

**Always prioritize child safety, clarity, and professionalism in all code and UI.**
