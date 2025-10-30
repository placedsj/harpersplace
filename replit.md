# PLACED - Next.js Co-Parenting Application

## Overview
"Your team, our home" - A Next.js 15 co-parenting application with Replit Auth and AI-powered features. Successfully migrated from Vercel to Replit on October 8, 2025, and from Firebase to Replit Auth on October 30, 2025.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.3.3 (App Router) + Express backend
- **UI**: React 18 with Radix UI components
- **Styling**: Tailwind CSS
- **Authentication**: Replit Auth (OpenID Connect)
- **Database**: PostgreSQL (Neon-backed) via Drizzle ORM
- **AI**: Google Genkit integration
- **Package Manager**: npm

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components and UI elements
- `src/hooks/` - Custom React hooks (including useAuth for Replit Auth)
- `src/lib/` - Utility functions and shared logic
- `src/ai/` - AI/Genkit integration
- `server/` - Express backend with authentication routes
- `shared/` - Shared types and database schema (Drizzle ORM)

## Development Configuration

### Port Configuration
- Development server runs on port 5000 (bound to 0.0.0.0)
- Scripts configured in package.json:
  - `npm run dev` - Development server on port 5000
  - `npm run build` - Production build
  - `npm run start` - Production server on port 5000

### Environment Variables
Required configuration:
- DATABASE_URL - PostgreSQL connection string (automatically provided by Replit)
- SESSION_SECRET - Secret key for session encryption (automatically generated)
- REPLIT_DEPLOYMENT - Set to '1' in production

### Replit-Specific Configuration
- **Cross-Origin Handling**: Configured `allowedDevOrigins` in next.config.ts to handle Replit's iframe-based development environment
- **Network Binding**: Server binds to 0.0.0.0 to allow external access in Replit's cloud environment

## Deployment
- **Type**: Autoscale (stateless web application)
- **Build**: `npm run build`
- **Start**: `npm run start`

## Recent Changes
- **October 30, 2025**: Migrated from Firebase to Replit Auth
  - Replaced Firebase Auth with Replit's OpenID Connect authentication
  - Added Express backend to serve Next.js and handle authentication routes
  - Set up PostgreSQL database with Drizzle ORM for users and sessions
  - Implemented secure session management with CSRF protection (sameSite cookies)
  - Updated useAuth hook to work with React Query and server-side auth
  - Rebranded from "Familyverse" to "PLACED" with new gradient design
  
- **October 8, 2025**: Migrated from Vercel to Replit
  - Configured ports for Replit environment (5000, bound to 0.0.0.0)
  - Added allowedDevOrigins for cross-origin request handling
  - Configured deployment for production

## Features
The application includes:
- User authentication (sign up/login)
- Dashboard
- Family tree management
- Journal and milestone tracking
- Document analyzer
- Health tracking
- Calendar and scheduling
- AI-powered tools (communication coach, schedule optimizer, sleep suggestions)
- Evidence logging
- Emergency contacts
- Shared lists
