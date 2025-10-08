# Familyverse - Next.js Application

## Overview
A Next.js 15 family management application with Firebase authentication and AI-powered features. Successfully migrated from Vercel to Replit on October 8, 2025.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.3.3 (App Router)
- **UI**: React 18 with Radix UI components
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI**: Google Genkit integration
- **Package Manager**: npm

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components and UI elements
- `src/firebase/` - Firebase configuration and hooks
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and shared logic
- `src/ai/` - AI/Genkit integration

## Development Configuration

### Port Configuration
- Development server runs on port 5000 (bound to 0.0.0.0)
- Scripts configured in package.json:
  - `npm run dev` - Development server on port 5000
  - `npm run build` - Production build
  - `npm run start` - Production server on port 5000

### Environment Variables
Required Firebase configuration (stored in .env.local):
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

### Replit-Specific Configuration
- **Cross-Origin Handling**: Configured `allowedDevOrigins` in next.config.ts to handle Replit's iframe-based development environment
- **Network Binding**: Server binds to 0.0.0.0 to allow external access in Replit's cloud environment

## Deployment
- **Type**: Autoscale (stateless web application)
- **Build**: `npm run build`
- **Start**: `npm run start`

## Recent Changes
- **October 8, 2025**: Migrated from Vercel to Replit
  - Configured ports for Replit environment (5000, bound to 0.0.0.0)
  - Added allowedDevOrigins for cross-origin request handling
  - Set up Firebase environment variables
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
