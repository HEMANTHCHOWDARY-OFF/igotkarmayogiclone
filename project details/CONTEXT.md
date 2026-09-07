# CONTEXT.md — Project Continuity & Current State

**Project:** GyanMarg AI  
**Status:** Active  
**Last Updated:** 2026-09-07  
**See also:** `MEMORY.md` (root directory)

---

## Current Architecture & System State

### 1. Technology Baseline
- **Application Type:** React 19 Single-Page Application (Vite, TypeScript, React Router v8).
- **Backend & Database:** Supabase (`https://wztsczaaaiceaoerdbfr.supabase.co`).
- **Development Server:** Running on port 8443 (`http://localhost:8443`).

### 2. State Management & Authentication
- Real-time authentication is operational via `src/context/AuthContext.tsx`.
- Uses Supabase client listener `supabase.auth.onAuthStateChange` to capture sign-in, token refresh, and sign-out events instantaneously.
- Route protection is enforced via `src/components/ProtectedRoute.tsx` across student and admin interfaces.
- Live Google OAuth 2.0 is connected via Google Cloud Client ID `971786699526-qfq30i6gej9fhdld2her8j75clg4pb7u.apps.googleusercontent.com` and Supabase callback `https://wztsczaaaiceaoerdbfr.supabase.co/auth/v1/callback`.

### 3. Key Completed Modules
- **Public:** Landing page, Register with learner profile metadata, Login with live password & Google OAuth.
- **Student Portal:** Protected student routes, live dynamic sidebar/header user info, instant sign-out.
- **Admin Portal:** Protected admin routes, role isolation.

Refer to [MEMORY.md](file:///c:/Users/chowd/Documents/igotkarmayogiclone-main/MEMORY.md) for full implementation history and technical specifications.
