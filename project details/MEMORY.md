# GyanMarg AI — Project Memory & Continuity Log

**Location:** `project details/MEMORY.md`  
**Last Updated:** 2026-09-07  
**Platform Version:** 1.0.0  
**Current Active Environment:** Local Development (Vite on `http://localhost:8443`)  
**Backend:** Supabase Cloud (`https://wztsczaaaiceaoerdbfr.supabase.co`)  

---

## 1. Project Overview & Mission
GyanMarg AI is a Competency Intelligence & Adaptive Learning Platform designed for learners (students, researchers, civil service aspirants) and institutional administrators. It provides diagnostic gap matrices, dynamic roadmaps, multimodal assessments with source citations, AI mentorship, and institutional competency analytics.

---

## 2. Core Architecture & Tech Stack
- **Frontend Framework:** React 19 (SPA) with Vite & TypeScript.
- **Routing:** React Router v8 (`createBrowserRouter`).
- **Styling:** Design Tokens & Vanilla CSS / Modern UI system (`src/tokens.ts`, `src/index.css`).
- **Backend & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **State & Context:**
  - `AuthContext` (`src/context/AuthContext.tsx`) — Real-time reactive authentication & session state.
  - `LanguageContext` (`src/context/LanguageContext.tsx`) — Multilingual support.

---

## 3. Work Completed Up to Now

### A. Real-Time Authentication System
Replaced preliminary static timeouts and mock profiles with an end-to-end Supabase real-time authentication pipeline:

1. **Centralized Auth Provider (`src/context/AuthContext.tsx`)**:
   - Subscribes in real time to `supabase.auth.onAuthStateChange` (`SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`, `USER_UPDATED`).
   - Automatically initializes and restores sessions via `supabase.auth.getSession()`.
   - Exposes asynchronous actions: `signIn`, `signUp`, `signInWithGoogle`, `signOut`, `loginAsDemo`, and `updateProfileLocally`.
   - Automatically derives dynamic profiles:
     - Full name (from Supabase `user_metadata` or email fallback).
     - Role (`student` vs `admin`).
     - Track, Institution, and Target Year.
     - Dynamic initials and avatar image support.
   - Wrapped at application root in `src/App.tsx`.

2. **Route Guards & Protection (`src/components/ProtectedRoute.tsx`)**:
   - Intercepts unauthorized visits to `/student/*` and `/admin/*`, redirecting to `/login` while preserving intended destination (`state: { from: location }`).
   - Enforces role-based permissions (preventing cross-portal access between student and admin accounts).
   - Renders a branded loading indicator during session initialization.

3. **Login & Registration Workflows (`src/pages/Login.tsx`, `src/pages/Register.tsx`)**:
   - **Login**:
     - Real-time password sign-in with live error banners (invalid credentials, unconfirmed email).
     - Role selector (Student / Learner vs Administrator).
     - **Role-Aware Registration Display**: The public self-registration link (`"Don't have an account? Register here"`) is strictly hidden when **Administrator** role is selected, showing institutional access guidance (`"Authorized personnel only · Accounts provisioned by department"`) while remaining available for learners.
     - Instant Demo access buttons for 1-click evaluation.
   - **Register**:
     - Multi-step onboarding collecting name, email, password, learner track, institution, and target year.
     - Directly stores metadata into Supabase user attributes upon `signUp()`.
     - Displays real-time validation and confirmation notices.

4. **Live Google OAuth 2.0 Integration**:
   - **Supabase Backend Configuration**:
     - Configured Google OAuth Provider in Supabase Auth Dashboard.
   - **Google Cloud Console Configuration**:
     - OAuth 2.0 Client ID: `971786699526-qfq30i6gej9fhdld2her8j75clg4pb7u.apps.googleusercontent.com`.
     - Authorized Redirect URI: `https://wztsczaaaiceaoerdbfr.supabase.co/auth/v1/callback`.
     - Authorized JavaScript Origins: `http://localhost:8443` & `https://wztsczaaaiceaoerdbfr.supabase.co`.
   - **User Experience**:
     - Clicking "Continue with Google" triggers official Google Accounts consent dialog (`accounts.google.com`).
     - Successfully redirects back to `/student/dashboard` with Google account metadata (Google display name, profile photo, verified email).
     - Fallback Google test profile modal also included for offline testing.

5. **Dynamic Layouts & Settings (`src/layouts/StudentLayout.tsx`, `src/layouts/AdminLayout.tsx`, `src/pages/student/Settings.tsx`)**:
   - Replaced static names with live logged-in user names, track badges, and initials.
   - Connected **Log Out** button directly to `supabase.auth.signOut()`, destroying active sessions in real time.
   - Synchronized settings profile editor with active auth profile.

---

## 4. Key File Map

| Path | Purpose |
| :--- | :--- |
| `src/context/AuthContext.tsx` | Real-time Supabase Auth state, profile resolution & session actions. |
| `src/components/ProtectedRoute.tsx` | Role-based route guard and session loader. |
| `src/app/routes.tsx` | Application route tree with protected student & admin branches. |
| `src/pages/Login.tsx` | Email/password sign-in, Google OAuth button, error banners, demo login. |
| `src/pages/Register.tsx` | Multi-step registration submitting user profile metadata to Supabase. |
| `src/layouts/StudentLayout.tsx` | Student portal sidebar & topbar synced to live authenticated user. |
| `src/layouts/AdminLayout.tsx` | Admin portal sidebar & topbar synced to live authenticated administrator. |
| `src/lib/supabase.ts` | Supabase browser client initialization. |
| `.env` | Environment configuration with Supabase URL & anon publishable keys. |

---

## 5. Verification Log
- **Build Status:** `npm run build` passing with 0 TypeScript/ESLint errors.
- **Browser Tests Completed:**
  1. Live email/password validation with real-time error alerts.
  2. Live Google OAuth redirect to `accounts.google.com` verified without `redirect_uri_mismatch`.
  3. Session recovery and dynamic profile rendering in sidebar/topbar.
  4. Real-time sign-out destroying session and returning to `/login`.
  5. Direct route tampering blocked by `ProtectedRoute`.

---

## 6. Next Recommended Steps
- Connect course progress and assessment test submissions to Supabase database tables with Row Level Security (RLS).
- Add password reset / forgot password email flow with Supabase Auth.
- Implement role switching for admin users who also want to view the student perspective.
