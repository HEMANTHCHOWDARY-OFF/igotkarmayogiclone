# GyanMarg AI — Project Memory & Continuity Log

**Location:** `project details/MEMORY.md`  
**Last Updated:** 2026-09-08  
**Platform Version:** 1.0.1  
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

### B. Student Course Selection Onboarding System
Implemented a dedicated, persistent, and demo-session-calibrated **Interested Courses Onboarding Flow** (`/student/interested-courses`):
1. **Flow Enforcement:**
   - On student login or registration, students are redirected to `/student/interested-courses` before entering `StudentLayout` or `/student/dashboard`.
   - Admin/mentor logins remain strictly isolated and proceed to `/admin/dashboard`.
2. **Persistent Data vs Demo Session State Decoupling:**
   - **Persistent Preferences:** Saved to Supabase user metadata via `supabase.auth.updateUser` and cached in `localStorage` (`gyanmarg_course_prefs_{userId}`). Existing preferences are pre-populated on load.
   - **Demo Session State:** Tracked via `sessionStorage` (`gyanmarg_onboarding_completed_{userId}`). In repeated SIH demo sessions, the onboarding screen is reliably presented on each new session without wiping stored database preferences.
   - **Route Guards:** `ProtectedRoute` intercepts direct visits to `/student/dashboard` (or other student layout routes) if session onboarding is incomplete, redirecting immediately to `/student/interested-courses`.

---

## 4. Key File Map

| Path | Purpose |
| :--- | :--- |
| `src/context/AuthContext.tsx` | Real-time Supabase Auth state, profile resolution, course preferences sync & session actions. |
| `src/components/ProtectedRoute.tsx` | Role-based route guard, session loader & student onboarding gatekeeper. |
| `src/utils/coursePreferences.ts` | Utilities for Supabase/local persistent preferences and demo-session onboarding state. |
| `src/pages/student/InterestedCourses.tsx` | Dedicated student course selection onboarding screen with domain filters, search & card selection. |
| `src/app/routes.tsx` | Application route tree with protected student & admin branches. |
| `src/pages/Login.tsx` | Email/password sign-in, Google OAuth button, error banners, demo login & onboarding redirects. |
| `src/pages/Register.tsx` | Multi-step registration submitting user profile metadata and routing to course onboarding. |
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
  6. Student onboarding flow verified: Login → `/student/interested-courses` → `/student/dashboard`.
  7. Demo session reset verified: every new demo session presents onboarding while keeping persistent preferences intact.

---

## 6. Core MVP Priority Roadmap (11 Core Features)
Formally established `MVP_FEATURES.md` defining the 11 core MVP features with high priority:
1. **User Authentication & Profiles** (Completed with live Supabase & Google OAuth).
2. **Competency Assessment** (MoSPI baseline diagnostic test).
3. **AI Competency Gap Analysis** (Deterministic gap matrix vs role benchmarks & radar visualization).
4. **Upload Learning Materials (PDF/DOC)** (Statistical manuals ingestion).
5. **AI-Generated MCQs** (Structured generation with exact page/section citations & HITL review).
6. **Quiz Taking** (Interactive test execution interface).
7. **Automatic Evaluation** (Deterministic grading & dynamic profile score update).
8. **Personalized Course Recommendations** (Gap-prioritized remediation recommendations).
9. **iGOT Course / Resource Mapping (Mock Only)** (Curated 20+ courses with NSSTA TPAC badges).
10. **Learner Progress Dashboard** (Real-time Skill Health Score, weekly progress velocity, and milestones).
11. **Learning Paths / Roadmaps** (Sequenced 4-phase milestone roadmap based on individual gap severity).

All engineering protocols in `RULES.md`, `PHASES.md`, `PRD.md`, and `README.md` have been updated to align strictly with this 11-feature contract.

---

## 7. Phased MVP Execution: Phase A Completed (2026-09-07)

### Summary of Deliverables
Divided the 11 Core MVP features into 5 sequential phases with explicit approval gates. Completed **Phase A: Competency Diagnostic & Auto-Evaluation** (*Features 2 & 7a*):

1. **Reactive Competency Provider (`src/context/CompetencyContext.tsx`)**:
   - Modeled the 5 official MoSPI FrAC competency domains:
     - *Applied Statistics & Sampling Theory* (85% benchmark)
     - *SQL & Database Operations* (80% benchmark)
     - *Python & Data Analytics* (75% benchmark)
     - *GIS & Spatial Analysis* (80% benchmark)
     - *Public Data Ethics & DPDP Act 2023* (90% benchmark)
   - Integrated 10 domain-specific diagnostic questions authored directly from official MoSPI manuals, DPDP Act 2023 statutory guidelines, and NSSTA literature.
   - Built real-time deterministic grading engine calculating domain-wise demonstrated scores and total percentage.
   - Implemented composite Skill Health Score formula and localStorage persistence (`gyanmarg_competency_state_v1`).
   - Wrapped at application root in `src/App.tsx`.

2. **Diagnostic Assessment Interface (`src/pages/student/Assessment.tsx`)**:
   - Redesigned with MoSPI FrAC badging and Statistical Officer role context.
   - 20-minute countdown timer with auto-submit safeguard and urgent styling.
   - Domain progress sidebar and interactive 10-question grid.
   - Added "⚡ Demo Quick-Fill" helper to accelerate jury and developer evaluation.

3. **Real-Time Auto-Evaluation Interface (`src/pages/student/AssessmentResults.tsx`)**:
   - Live score gauge calculating exact percentage and percentile tier.
   - Recharts Bar Chart showing performance across all 5 MoSPI FrAC domains vs target benchmarks.
   - Automated insight banners identifying critical gaps vs strong foundations.
   - Complete Question-by-Question Review with user choice, correct option, explanatory rationale, and **verifiable document citations** (*Document Name, Chapter, Page/Section*).
   - Direct action buttons routing to `/student/gap-analysis` and `/student/learning-path`.

### Verification
- `npm run build`: Production build passes cleanly with 0 TypeScript/ESLint errors in 838ms.
- Dev server running and verified responsive on `http://localhost:8443`.
- User manually tested and approved Phase A on 2026-09-07.

---

## 8. Phased MVP Execution: Phase B Completed (2026-09-07)

### Summary of Deliverables
Completed **Phase B: AI Competency Gap Analysis & Dynamic Radar Chart** (*Feature 3*):

1. **Dynamic Gap Formulation & Benchmarking (`src/pages/student/GapAnalysis.tsx`)**:
   - Integrated deterministic gap formulation directly from `useCompetency()`:
     $$\text{Gap} = \max(0, \text{Target Role Benchmark} - \text{Current Demonstrated Score})$$
   - Implemented 3-tier severity classification:
     - 🔴 **Critical Gap:** Variance $> 25\%$ (Requires immediate remediation).
     - 🟡 **Minor Gap:** Variance between $10\%$ and $25\%$ (Requires micro-learning).
     - 🟢 **Met Benchmark:** Variance $< 10\%$ (Benchmark satisfied).
   - Dynamic overview metrics: Net Average Gap, Critical Gaps count, Minor Gaps count, and Priority Focus Areas.

2. **Interactive Competency Visualizations**:
   - **Multi-Axis Radar Chart**: Renders dual overlay comparing Demonstrated Score vs. MoSPI Target Benchmark across all 5 MoSPI FrAC domains.
   - **Gap Variance Bar Chart**: Horizontal bar chart showing exact deficit points required per domain to meet official role benchmarks.

3. **MoSPI Gap Matrix Table & Remediation Sequence**:
   - Structured table listing domain, score, benchmark, net deficit with color coding, severity pill, and priority rank.
   - AI Prescribed Remediation Sequence with actionable developmental steps for each domain.
   - Curated remedial courses feed mapped directly to the user's largest measured gaps with duration, provider, and enrollment CTAs.
   - Added "↻ Retake Diagnostic" trigger to allow evaluating different baseline scores.

### Verification
- `npm run build`: Production build passes cleanly with 0 TypeScript/ESLint errors in 774ms.
- Dev server verified responsive on `http://localhost:8443`.
- User manually tested and approved Phase B on 2026-09-07.

---

## 9. Phased MVP Execution: Phase C Completed (2026-09-07)

### Summary of Deliverables
Completed **Phase C: Personalized Recommendations, iGOT 22+ Course Mapping & 4-Phase Roadmap** (*Features 8, 9 & 11*):

1. **Comprehensive iGOT Course Catalog (`src/data/igotCourses.ts`)**:
   - Developed canonical catalog of 22 civil service capacity-building courses across all 5 MoSPI FrAC domains.
   - Prominently integrated **NSSTA TPAC Endorsement Badges** (*Training Programme Advisory Committee of the National Statistical Systems Training Academy*).
   - Added course codes (e.g. `NSSTA-ST-401`, `DIID-DB-203`, `MOSPI-PY-301`, `FOD-GIS-102`), durations, ratings, enrollment numbers, and instructor details.

2. **Personalized Course Recommendations (`src/pages/student/CourseDiscovery.tsx`)**:
   - Implemented gap-driven priority sorting placing courses that bridge the user's largest measured competency gap first.
   - Explicit gap justification banners on course cards (e.g., *"🔴 Critical Remediation: Bridges your 35% competency gap in GIS & Spatial Analysis"*).
   - Multi-dimensional filtering: Search, MoSPI FrAC domain, difficulty level, duration, and TPAC endorsement.
   - Deep-link simulation buttons for official iGOT Karmayogi single-sign-on integration.

3. **Dynamic Course Details View (`src/pages/student/CourseDetails.tsx`)**:
   - Dynamic routing for all 22 courses displaying detailed module lists, learning outcomes, instructor credentials, and launch actions.

4. **Sequenced 4-Phase Learning Roadmap in roadmap.sh Style (`src/pages/student/LearningPath.tsx`)**:
   - Redesigned into an interactive visual tree inspired by **roadmap.sh**:
     - Central vertical connecting SVG spine with milestone anchor hubs.
     - 4-Phase sequenced milestone curriculum:
       - *Phase 1:* Foundation (Statutory Ethics, DPDP Act 2023 & Survey Concepts) [Completed]
       - *Phase 2:* Critical Remediation (Directly mapped to user's top measured gaps with *"🎯 Bridges X% Gap"* highlight cards) [In Progress]
       - *Phase 3:* Advanced Applications (Satellite GIS & Big Data) [Locked]
       - *Phase 4:* MoSPI Verification (Capstone & Verified Digital Credential) [Locked]
     - Roadmap node cards featuring domain indicators, course codes, duration, difficulty, and subtopic tag chips.
     - Interactive slide-out **Inspector Drawer** displaying syllabus subtopics, official MoSPI citations, and launch buttons.
     - View mode toggle (*Flowchart View* vs *Grid View*), topic search bar, domain filter dropdown, and real-time Skill Health gauge.

### Verification
- `npm run build`: Production build passes cleanly with 0 TypeScript/ESLint errors in 522ms.
- Dev server verified responsive on `http://localhost:8443/student/courses` and `http://localhost:8443/student/learning-path`.
- User manually tested and approved Phase C on 2026-09-07.

---

## 10. Phased MVP Execution: Phase D Completed (2026-09-07)

### Summary of Deliverables
Completed **Phase D: Upload Learning Materials (PDF/DOC) & AI-Generated MCQs (With Citations & HITL Review)** (*Features 4 & 5*):

1. **Reactive Document & Question Store (`src/context/CompetencyContext.tsx`)**:
   - Seeded 5 official MoSPI curriculum documents across all 5 FrAC domains:
     - *MoSPI Sample Design & Estimation Procedure Manual (Vol 4)* (184 pages, 8 chapters, PDF)
     - *DPDP Act 2023 Statutory Compliance Framework for Statistical Agencies* (92 pages, 6 chapters, PDF)
     - *DIID Data Management & SQL Query Protocol for CPI/IIP* (64 pages, 5 chapters, DOCX)
     - *FOD Field Operations Protocol for Tablet Geo-tagging (Round 78)* (78 pages, 4 chapters, PDF)
     - *MoSPI Python Analytics & PLFS Validation Cookbook* (112 pages, 7 chapters, PDF)
   - Stored in persistent `localStorage` (`gyanmarg_ingested_docs_v1` and `gyanmarg_generated_mcqs_v1`).
   - Implemented helper methods: `uploadDocument`, `generateMCQsFromDoc`, `approveQuestion`, `rejectQuestion`, `editQuestion`.

2. **Admin Assessment & Material Curation Workstation (`src/pages/admin/AssessmentManagement.tsx`)**:
   - Rebuilt administrative hub with MoSPI FrAC branding and real-time metric counter cards (Ingested Manuals, Questions Awaiting HITL, Approved Questions, Verifiable Citation Rate: 100%).
   - **Tab 1: HITL Review & Curation Dashboard (Feature 5)**:
     - Status filtering: *Pending Review*, *Approved*, *Rejected*, and *All Questions*.
     - Domain filter dropdown and real-time stem/citation search.
     - Rich Review Cards displaying:
       - AI confidence & status badges (Amber for pending, Green for approved, Terracotta for rejected).
       - Question stem & 4 radio-style options with correct option highlighted in green.
       - **Verifiable Citation Callout**: Exact Document Title, Chapter/Module, and Page/Section (e.g. `📄 MoSPI Sample Design Manual (Vol 4) • Chapter 3 • Page 22`).
       - Technical explanation / rationale box.
       - Action buttons: *✓ Approve & Publish*, *✏️ Edit*, *✕ Reject*, and batch *✓ Approve All Pending*.
   - **Tab 2: Document Ingestion Workstation (Feature 4)**:
     - Document inventory table displaying format tags (`.pdf`, `.docx`), file size, page count, chapter count, and "Parsed & Ready" status badges.
     - Interactive **Table of Contents Viewer** modal showing chapter outlines for any manual.
     - Interactive **Upload Learning Material Modal** with format selector, target domain assignment, custom chapter outline input, and live simulated progress bar.
   - **Tab 3: AI Question Synthesizer (Feature 5)**:
     - Allows selecting any ingested document, configuring question count (1 to 4), and choosing target competency complexity (*Foundational Level 1*, *Intermediate Operational Level 2*, *Advanced Analytical Level 3*).
     - Animated 3-step synthesis sequence (*Reading structure → Formulating test stems & distractors → Attaching verbatim citations*).
     - Immediate celebration banner and direct shortcut to review generated questions in the HITL tab.
   - **Tab 4: Published Question Bank**:
     - Consolidated catalog of all approved MCQs deployed to the learner diagnostic and reassessment engines.
   - **Inline HITL Question Editor**:
     - Modal allowing admins to edit stem, individual options, toggle the correct answer radio button, and update the document, chapter, or page citations.

### Verification
- `npm run build`: Production build passes cleanly with 0 TypeScript/ESLint errors in 525ms.
- Dev server verified responsive on `http://localhost:8443/admin/assessments`.
- User manually tested and approved Phase D on 2026-09-07.

---

## 11. Phased MVP Execution: Phase E Completed (2026-09-07) — 100% Core MVP Complete

### Summary of Deliverables
Completed **Phase E: Interactive Learning Interface, Instant Evaluation & Learner Progress Dashboard** (*Features 6, 7b & 10*):

1. **Closed-Loop Practice Store Extension (`src/context/CompetencyContext.tsx`)**:
   - Implemented `PracticeQuizSubmission` interface and `practiceSubmissions` reactive state saved to `gyanmarg_practice_submissions_v1`.
   - Built `submitPracticeQuiz(domainId, answers, questions, courseTitle)`:
     - Automatically calculates score percentage.
     - Dynamically improves the demonstrated score of the target FrAC domain (+18-30 pts).
     - Live recalculation of the Composite Skill Health Score across all 5 MoSPI domains.
     - Records before-and-after scores and timestamped delta metrics.

2. **Interactive Learning & Practice Quiz Engine (`src/pages/student/LearningInterface.tsx`)**:
   - **Feature 6: Interactive Learning Interface**:
     - Dynamic route handling for all 22 courses (`/student/courses/:id/learn`), displaying real titles, course codes, domains, and NSSTA TPAC badges.
     - Left syllabus sidebar with instructional modules and a dedicated **"🎯 Interactive Knowledge Check"** milestone.
     - Instructional view includes official lecture media simulation, syllabus principles, learner study notes, and floating MoSPI AI Learning Mentor.
     - Interactive Knowledge Check features multiple-choice questions matching the course's domain, interactive radio options, and "⚡ Demo Quick-Fill".
   - **Feature 7b: Automatic Evaluation & Instant Feedback**:
     - Instant post-submission evaluation screen displaying percentage score, correct answers count, and a **Verified Competency Growth Badge** (e.g. `45% → 75% (+30 pts)`).
     - Impact callout showing the exact before-and-after change in Composite Skill Health.
     - Complete per-question review showing green/red indicators, selected vs correct options, detailed technical rationales, and **Official Verifiable Document Citations** (`📄 MoSPI Manual • Chapter • Page`).
     - Navigation shortcuts to Updated AI Gap Radar, Progress Dashboard, and Learning Path.

3. **Learner Progress Dashboard (`src/pages/student/Dashboard.tsx`)**:
   - **Feature 10: Learner Progress Dashboard & Live Skill Health Score**:
     - Connected directly to `useCompetency()`:
       - Displays real-time **Composite Skill Health Score** (e.g., `58 / 100`) with dynamic status badges.
       - Diagnostic Assessment score and verification badge.
       - Completed remediation quiz counter with latest growth delta.
       - Critical gaps remaining indicator.
     - **Demonstrated Competency vs Target Benchmark BarChart**:
       - Multi-bar Recharts visualization comparing the learner's actual current scores against MoSPI Statistical Officer benchmarks across all 5 FrAC domains.
     - **Dynamic Priority Gap Remediation Banner**:
       - Automatically identifies the learner's top measured gap and displays an actionable remedy with a direct 1-click CTA button to launch the remediation course.
     - **Verified Competency Growth & Evaluation Timeline**:
       - Activity feed listing all completed practice quizzes with timestamp, mastery score, and exact domain point improvement deltas.
     - Quick Action triggers for Diagnostic Assessment, AI Gap Analysis, roadmap.sh Learning Path, and 22 iGOT Courses.

### Verification
- `npm run build`: Production build passes cleanly with 0 TypeScript/ESLint errors in 468ms.
- Dev server verified responsive on `http://localhost:8443/student/dashboard` and `http://localhost:8443/student/courses/1/learn`.
- **Milestone Reached:** All 11 Core MVP Features in `MVP_FEATURES.md` are 100% implemented, integrated, and verified!

4. **Engineering Protocol Enhancement (`project details/RULES.md`)**:
   - Added **Rule 54: Feature Delivery, Expectation & Verification Protocol** mandating that every subsequent feature addition or refinement include:
     1. Summary of changes & architectural impact.
     2. Concrete UI visual & interactive expectations.
     3. Step-by-step browser testing walkthrough with exact URLs.
     4. Automated compilation & route verification proof.
     5. Context synchronization & explicit user approval pause.

---

## 12. Admin Management Suite, Report Extraction & Student Portal Generalization (2026-09-08)

### Summary of Deliverables

1. **Complete Functionality for Every Admin Component**:
   - **Course Management (`src/pages/admin/CourseManagement.tsx`)**: Real-time domain/level filtering, search, status toggles (Draft, Published, Archived), and course authoring modal.
   - **Assessment Management (`src/pages/admin/AssessmentManagement.tsx`)**: Ingestion of curriculum documents, 3-step AI question synthesis, and Human-in-the-Loop (HITL) approval/rejection workflows with inline editing.
   - **Student Management (`src/pages/admin/StudentManagement.tsx`)**: Comprehensive roster table, search, track filtering, and cohort export.
   - **Competency Analytics (`src/pages/admin/CompetencyAnalytics.tsx`)**: Cross-cohort competency distributions, institutional gap heatmaps, and radar benchmarks.
   - **Executive Dashboard & Reports (`src/pages/admin/AdminDashboard.tsx`, `src/pages/admin/Reports.tsx`)**: Real-time KPI summaries, chart visualizations, and historical report archives.

2. **Single-Action Report Generation Pattern (Excel & CSV Extractions)**:
   - Streamlined all reporting triggers across `Reports.tsx`, `AdminLayout.tsx`, and `StudentManagement.tsx` into a single, prominent **"⚡ Generate Report"** action button.
   - Replaced cluttered multi-button bars with a modal presenting exactly two choices:
     - **📗 Excel** (`.xlsx` multi-tab workbook generated via SheetJS `xlsx` and Blob array buffer).
     - **📊 CSV** (`.csv` tabular data with UTF-8 BOM encoding for seamless spreadsheet opening).
   - Created `src/utils/exportUtils.ts` providing reliable client-side export routines (`exportToExcel`, `exportToCSV`).

3. **Universal Student Portal Refactoring**:
   - Refactored the Student Portal from narrow civil-service officer cadre terminology to welcome **every learning student** (university scholars, data science and AI learners, academic researchers, competitive aspirants, and career upskillers).
   - Connected `useAuth()` to dynamically reflect the logged-in student's actual track and institution across:
     - **Dashboard (`src/pages/student/Dashboard.tsx`)**: Dynamic track badge, institution tag, "● Strong Benchmark Readiness" indicator, and "Core Learning & Career Tools".
     - **Gap Analysis (`src/pages/student/GapAnalysis.tsx`)**: "Student Competency Intelligence", dynamic track benchmarks, multi-axis radar chart, and standardized Competency Gap Matrix Table.
     - **Learning Path (`src/pages/student/LearningPath.tsx`)**: "Personalized Student Competency Roadmap", 4.0 Comprehensive Capstone, and standard curriculum citations.
     - **Assessment & Results (`src/pages/student/Assessment.tsx`, `src/pages/student/AssessmentResults.tsx`)**: "Adaptive Skill Baseline Engine" and track requirement deficit feedback.
     - **Skill Profile (`src/pages/student/SkillProfile.tsx`)**: Live student identity and peer/cohort benchmark comparisons.
     - **Course Discovery (`src/pages/student/CourseDiscovery.tsx`)**: Universal catalog and enrolled students counters.

4. **Removal of Certificates & AI Mentor Sections**:
   - Removed **AI Mentor** and **Certificates** from the student sidebar navigation (`src/layouts/StudentLayout.tsx`).
   - Removed the "Ask AI Mentor" button from the top navigation bar.
   - Redirected `/student/certificates` and `/student/ai-mentor` routes to `/student/dashboard` in `src/app/routes.tsx`.

### Verification
- `npm run build`: Production build passes cleanly with 0 TypeScript/ESLint errors in 678ms.
- Dev server verified responsive on `http://localhost:8443`.
- Live browser tests verified clean rendering across admin reports, gap analysis, and streamlined student navigation.

---

## 13. Public Layout Modernization: Fully Functional i18n & Game-Style Guided Tutorial (2026-09-09)

### Summary of Deliverables

1. **Centralized Internationalization Architecture (`src/i18n/`)**:
   - Built a type-safe, centralized i18n system eliminating hardcoded translations.
   - **Supported Languages (`src/i18n/types.ts`, `src/i18n/index.ts`)**:
     - English (`en`) — Default fallback dictionary (`src/i18n/locales/en.ts`).
     - Hindi (`hi`) — Comprehensive authentic translation (`src/i18n/locales/hi.ts`).
     - Telugu (`te`) & Tamil (`ta`) — Extensible Indian language foundations (`src/i18n/locales/te.ts`, `src/i18n/locales/ta.ts`).
   - **Fallback & Interpolation Engine**: Resolves `translations[lang][key] || translations['en'][key] || defaultText || key` and dynamically replaces template parameters (e.g., `{step}` of `{total}`).
   - **Language Context (`src/context/LanguageContext.tsx`)**:
     - Reactive state synced with `localStorage` (`gyanmarg_lang` with `karmayogi_lang` legacy support).
     - Dynamically synchronizes document language via `document.documentElement.lang`.
     - Zero page reload required — triggers instant UI updates across all components.
   - **Accessible Language Selector (`src/components/LanguageSelector.tsx`)**:
     - Dual-mode UI: Segmented quick switch (EN / हिन्दी) + dropdown for all supported Indian languages.
     - Full keyboard accessibility with ARIA attributes (`role="listbox"`, `aria-expanded`), `Escape` dismissal, and `ArrowUp`/`ArrowDown` navigation.
     - Compact variant designed for auth headers and mobile layouts.

2. **Interactive Game-Style Guided Tutorial (`src/components/tutorial/`, `src/context/TutorialContext.tsx`)**:
   - Developed an engaging quest-onboarding tour to guide new visitors through GyanMarg AI's core capabilities.
   - **6 Progressive Missions (`src/components/tutorial/tutorialSteps.ts`)**:
     - **Mission 01 — Welcome to GyanMarg AI** (`[data-tutorial="welcome"]`): Introduces diagnostic baseline, competency gap analysis, and personalized learning.
     - **Mission 02 — Explore Curated Competency Courses** (`[data-tutorial="courses"]`): Highlights competency-mapped curriculum modules.
     - **Mission 03 — Adaptive Diagnostic Assessment** (`[data-tutorial="assessment"]`): Spotlights the baseline diagnostic assessment trigger.
     - **Mission 04 — Skill Gap Matrix & Closed-Loop Roadmap** (`[data-tutorial="gap-analysis"]`): Showcases the cyclic competency workflow.
     - **Mission 05 — 24/7 Contextual AI Study Mentor** (`[data-tutorial="mentor"]`): Highlights the verified academic mentor feature.
     - **Mission 06 — Begin Your Personalized Journey** (`[data-tutorial="get-started"]`): Guides users to Sign In / Register.
   - **Game-Style Quest Card (`src/components/tutorial/TutorialCard.tsx`)**:
     - Stage badge with golden amber XP progress bar.
     - Structured micro-cards: 💡 *What it does*, 🎮 *How to use it*, and ⭐ *Why it matters*.
     - Interactive step indicator dots for direct step jumping.
     - Controls: `← Back`, `Next Mission →`, `Finish Quest 🏆`, and `Skip Tour`.
     - Keyboard navigation: `[← / →]` to navigate, `[Esc]` to exit.
     - Responsive smart viewport positioning with safety edge clamping.
   - **Dynamic SVG Spotlight Overlay (`src/components/tutorial/TutorialOverlay.tsx`)**:
     - Fullscreen SVG mask cutout that dims the page while spotlighting the active target.
     - Pulsing golden amber accent border (`#C6851B`).
     - Auto-scrolls target elements smoothly into center view (`scrollIntoView({ behavior: 'smooth', block: 'center' })`).
     - Listens to window resize and scroll events for accurate positioning.
   - **Celebratory Completion Screen**:
     - Achievement modal celebrating quest completion with 1-click CTA to launch the Learner Portal.
     - Persistent completion & skip states stored in `localStorage` (`gyanmarg_tutorial_completed`, `gyanmarg_tutorial_skipped`).
     - Permanent "Take a Tour 🎯" and "Replay Tutorial 🔄" triggers in navbar, public header, and footer.

3. **Public Layout & Auth Integration (`src/layouts/PublicLayout.tsx`)**:
   - Wrapped public layout with `TutorialProvider` and mounted `TutorialOverlay`.
   - Enhanced non-landing pages (`/login`, `/register`, `/onboarding`) with a branded top navigation header featuring GyanMarg AI logo, "Take a Tour 🎯" (redirects to `/?tour=true` and triggers tour), compact `LanguageSelector`, and "Back to Home" navigation.
   - Connected `useLanguage()` across `Login.tsx` and `Register.tsx` to translate auth headings, inputs, role toggles, and demo buttons.

### Verification
- `npm run build`: Verified clean production compilation in 593ms across 738 modules.
- Dev server responsive on `http://localhost:8443`.

---

## 14. 5,400+ iGOT Karmayogi Course Catalog Integration & AI Curriculum Recommendation (2026-09-09)

### Key Achievements
1. **Full-Scale 5,400+ Real Course Catalog Integration (`src/data/igotAllCourses.json`, `src/services/karmayogiCoursesService.ts`)**:
   - Expanded the previous limited static catalog into a comprehensive dataset of 5,400+ official iGOT Karmayogi and national academy courses across 14 central ministries and state administrative cadres.
   - Built a hierarchical domain taxonomy (`src/data/igotTaxonomy.json`) covering:
     - Public Administration, Policy & Good Governance
     - Financial Rules, GFR 2017 & GeM Public Procurement
     - Data Analytics, Applied Statistics & MoSPI Statistical Cadre
     - Digital India, Cyber Security & Government Tech Stack
     - Civil Service Ethics, Anti-Corruption & DPDP Act 2023
     - Disaster Management, Internal Security & Police Cadres
     - Rural Development, Agriculture, Health & Infrastructure Engineering
   - Created high-performance search, filtering, and multi-course resolver utilities (`getCoursesByTitlesOrIds`, `getAllUnifiedCourses`).

2. **Two-Section Dual-Mode Course Selection Interface (`src/pages/student/InterestedCourses.tsx`)**:
   - **Section 1: Self-Guided Hierarchical Catalog Explorer**:
     - 3-tier drilldown: Domains → Sub-domains → Courses.
     - Multi-selection checkboxes, keyword search, competency level badges, and course duration chips.
     - Sticky curriculum tray summarizing selected courses count with instant confirmation.
   - **Section 2: Interactive AI Curriculum Recommendation Engine**:
     - Conversational interest discovery powered by Groq LLaMA 3.3 70B (with instant local heuristic fallback).
     - Student specifies career aspirations, role goals, or skills of interest; AI analyzes the profile and generates customized curriculum recommendations with pedagogical rationale.
     - 1-click "Adopt AI Recommended Curriculum" to automatically configure enrolled competencies.

3. **End-to-End Curriculum Synchronization**:
   - Synced selected courses across `AuthContext`, Supabase metadata, `CompetencyContext`, and all student screens.
   - Dynamically adjusts active competency domains in the learner profile to match selected curriculum domains.

---

## 15. roadmap.sh Interactive Block Hierarchy & Deterministic Gap Analysis Engine (2026-09-09)

### Key Achievements
1. **Interactive Block-Based Roadmap Canvas (`src/pages/student/LearningPath.tsx`, `src/services/aiRoadmapService.ts`)**:
   - Transformed basic sequential lists into an engaging **roadmap.sh-style visual hierarchy**:
     - Topic blocks divided into practical modules, sub-concepts, and statutory milestones.
     - Left and right branch connectors, interactive status indicators (`todo`, `learning`, `done`), and phase badges.
   - Real-time Groq LLaMA 3.3 70B roadmap generator creating deep, contextual block structures per enrolled course.
   - Interactive Slide-Over Drawer with learning outcomes, prerequisites, and integrated 24/7 AI Chat Tutor.

2. **Real Course Progress Tracking Service (`src/services/courseProgressService.ts`)**:
   - Built a centralized service for authentic course and lesson progress stored persistently in `localStorage` (`gyanmarg_course_real_progress_v1`).
   - **Eliminated Fake/Mock Progress**: Newly enrolled courses strictly initialize at **0% progress** and `"not_started"` status with **0.0 study hours**.
   - Connected `markLessonCompleted`, `saveQuizScoreForCourse`, and `getCurriculumStats` across `Dashboard.tsx`, `Progress.tsx`, `SkillProfile.tsx`, and `Certificates.tsx`.

3. **Precision Mathematical Gap Analysis & Multi-Axis Geometry (`src/pages/student/GapAnalysis.tsx`)**:
   - **Resolved Collapsed Radar Chart**:
     - Recharts polar coordinates require $\ge 3$ vertices to draw a 2D closed polygon. When a student selects 1 or 2 domains (e.g. *Python & Data Analytics*), the radar chart previously collapsed into a single vertical line.
     - Implemented dynamic 5-pillar civil service competency polygon augmentation: the enrolled domain is highlighted with `★` and exact baseline vs target scores, framed by standard cadre baseline pillars (Policy & GFR, Digital Systems, Statutory Ethics, Research Ops).
   - **Precision Calculation Engine & Terminology Clarity**:
     - Added prominent mathematical breakdown cards and callouts clearly separating:
       - **Competency Gap Deficit** = Target Benchmark ($85\%$) − Demonstrated Baseline ($45\%$) = $40\%$ Deficit to bridge.
       - **Course Learning Progress** = Completed Modules / Total Modules = $0\%$ (strictly 0% until student begins coursework).
     - Replaced ambiguous badges like `"40% Gap"` with `"40% Deficit (Needs Study)"` to eliminate user confusion between gap variance and course completion.
   - **Curated Remedial Courses**:
     - Display authentic course progress bars and dynamic action buttons (`Start Module & Bridge Gap →` vs `Resume Module →`).

4. **Updated Dashboard, Progress & Certificates**:
   - Updated `Dashboard.tsx`: Enrolled course cards show real progress (0% / Not Started), fixed BarChart bar sizing with `barSize={36}` and `maxBarSize={48}`, and updated browse button to `"Explore 5,400+ Catalog Courses"`.
   - Updated `Progress.tsx`: Connected study hours to real tracked time (0.0h initially), authentic curriculum completion percentage (0%), and live activity feed.
   - Updated `Certificates.tsx`: Earned certificates require authentic 100% course completion; displays clean "No Completed Certificates Yet" empty state when newly enrolled.

### Verification
- `npm run build`: Production compilation passed with code 0 across 746 modules in 19.08s.
- Tested locally on `http://localhost:8443`.
