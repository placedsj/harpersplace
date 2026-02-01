# HarpersPlace - PLACED Enterprise Builder

HarpersPlace is a cutting-edge architectural configurator for modular structures, built on a robust stack of modern web technologies. It leverages AWS Amplify Gen 2 for backend services and Google Gemini for AI-driven design assistance.

## Architecture Overview

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/vite`)
- **State Management:** React Hooks + Context
- **Routing:** Component-based view switching (SPA)

### Backend Services (AWS Amplify Gen 2)
- **Authentication:** Amazon Cognito (User Pools)
- **Data Store:** AWS AppSync (GraphQL) + DynamoDB
- **Infrastructure as Code:** TypeScript-based definition (`amplify/`)

### AI Integration
- **Service:** Google Gemini Pro (`gemini-3-pro-preview`)
- **Function:** Real-time structural configuration and material optimization advice (LUNAI)

## Project Structure

- `amplify/`: Backend definition (Auth, Data).
- `components/`: React UI components (including `EnterpriseBuilder.tsx` core logic).
- `services/`: Encapsulated business logic and external API integrations.
  - `shedDesignService.ts`: Handles CRUD operations for shed designs via Amplify Data client.
  - `geminiService.ts`: Interface for Google Gemini AI.
- `lib/`: Shared utilities and configuration.
- `types.ts`: TypeScript definitions for the domain model.

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Create `.env.local` and set `GEMINI_API_KEY`.
   - Ensure `amplify_outputs.json` is present (generated via `npx ampx sandbox`).

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Deployment

Build the production assets:
```bash
npm run build
```

The output will be in `dist/`.

## Contributing

Please follow the existing code style and ensure all new features are typed correctly. Run `tsc` to verify type safety before committing.
