# PHASES.md

# GyanMarg --- Development Phases & Execution Roadmap

**Version:** 1.0\
**Status:** Active Planning Document\
**Project:** GyanMarg\
**Target:** Smart India Hackathon (SIH)\
**Primary Objective:** Build and demonstrate a complete
competency-driven, AI-powered learning platform.

------------------------------------------------------------------------

# 1. Purpose

`PHASES.md` defines the execution roadmap for GyanMarg.

It converts the product requirements into a sequence of implementable
phases so that the team can build the system incrementally without
losing the core product objective.

This document answers:

-   What should we build first?
-   What dependencies exist between features?
-   What should be completed before moving to the next phase?
-   What should be tested at each stage?
-   What should be documented?
-   What should be committed to Git?
-   What is MVP-critical?
-   What can be postponed?

------------------------------------------------------------------------

# 2. Execution Philosophy

GyanMarg should be built around the **competency loop**, not around
isolated screens.

The core loop is:

``` text
ASSESS
   ↓
DIAGNOSE
   ↓
PERSONALIZE
   ↓
LEARN
   ↓
PRACTICE
   ↓
REASSESS
   ↓
MEASURE IMPROVEMENT
   ↓
ROLE READINESS
```

The development roadmap must eventually produce this complete loop.

Do not spend most of the project building:

-   Landing-page animations
-   Decorative dashboards
-   Complex infrastructure
-   Advanced AI features
-   Unnecessary integrations

before the competency loop actually works.

------------------------------------------------------------------------

# 3. Phase Overview

[COMPLETED - ALL 11 CORE MVP FEATURES]
✓ PHASE 0  → Project Foundation & Planning
✓ PHASE 1  → Repository & Development Environment
✓ PHASE 2  → Supabase Backend Foundation
✓ PHASE 3  → Authentication & User Management (Email/Password & Google OAuth)
✓ PHASE A  → (Features 2 & 7a) Competency Diagnostic & Assessment Engine (MoSPI FrAC & Auto-Evaluation) [APPROVED]
✓ PHASE B  → (Feature 3) AI Competency Gap Analysis Engine & Dynamic Radar Chart [APPROVED]
✓ PHASE C  → (Features 8, 9 & 11) Personalized Recommendations, 22 iGOT Courses & roadmap.sh Interactive Path [APPROVED]
✓ PHASE D  → (Features 4 & 5) Admin Document Ingestion & AI Question Generation (Verifiable Citations & HITL Review) [APPROVED]
✓ PHASE E  → (Features 6, 7b & 10) Closed-Loop Micro-Module Quiz Taking, Instant Evaluation & Dashboard Skill Health Score [COMPLETED - AWAITING USER APPROVAL]

[OPTIONAL ADVANCED POST-MVP EXTENSIONS]
  PHASE F  → (Phases 10, 11, 13, 14) Full-scale pgvector RAG Embedding Pipeline, Verifiable PDF Certificates & Pan-Ministry Aggregates
```

------------------------------------------------------------------------

# 4. Dependency Map

The major dependency chain is:

``` text
Foundation
    ↓
Database + Auth
    ↓
Competency Framework
    ↓
Assessment
    ↓
Competency Scoring
    ↓
Gap Analysis
    ↓
Learning Resources
    ↓
Personalized Learning
    ↓
Practice
    ↓
Reassessment
    ↓
Updated Competency
    ↓
Role Readiness
```

AI/RAG depends primarily on:

``` text
Learning Resources
       ↓
Knowledge Ingestion
       ↓
Embeddings
       ↓
Vector Search
       ↓
RAG
       ↓
AI Assistant
```

The AI assistant should therefore **not be built first**.

------------------------------------------------------------------------

# 5. Completed Milestones (Phase 0 – Phase 3)

The following foundational phases have been fully executed, verified, and documented:

### ✓ Phase 0 — Project Foundation & Planning [DONE]
- Finalized product name (**GyanMarg AI**), vision, target users, and MVP scope.
- Established primary documentation (`PRD.md`, `DESIGN.md`, `RULES.md`, `ARCHITECTURE.md`, `MEMORY.md`, `CONTEXT.md`).
- Established the 8-step Competency Loop as the platform's core operating philosophy.

### ✓ Phase 1 — Repository & Development Environment [DONE]
- Repository configured with React 19, TypeScript, Vite, and strict code quality checks (`npm run build` passing with 0 errors).
- Design token system and typography palette initialized in `src/tokens.ts` and `src/index.css`.
- Dev server running on `http://localhost:8443`.

### ✓ Phase 2 — Supabase Backend Foundation [DONE]
- Supabase cloud project connected via `.env` (`https://wztsczaaaiceaoerdbfr.supabase.co`).
- Supabase JS client initialized (`src/lib/supabase.ts`) with active session restore support.

### ✓ Phase 3 — Authentication & User Management [DONE]
- **Real-Time Context (`src/context/AuthContext.tsx`)**: Reactive `onAuthStateChange` tracking user sign-in, token refresh, and sign-out events instantaneously.
- **Route Guards (`src/components/ProtectedRoute.tsx`)**: Enforces authentication and role boundaries (`student` vs `admin`) with target redirect preservation.
- **Live Authentication Pages (`src/pages/Login.tsx`, `src/pages/Register.tsx`)**:
  - Live email/password login with actionable error alerts.
  - Multi-step registration capturing learner track, institution, and target year.
  - 1-click Demo mode fallback for rapid offline review.
- **Live Google OAuth 2.0 Integration**:
  - Configured Supabase Google provider and Google Cloud OAuth Client credentials.
  - Verified authorized redirect URI (`https://wztsczaaaiceaoerdbfr.supabase.co/auth/v1/callback`).
  - Tested live browser redirect to `accounts.google.com` and automatic token return.
- **Dynamic Session Layouts (`src/layouts/StudentLayout.tsx`, `src/layouts/AdminLayout.tsx`)**:
  - Real user display name, avatar, initials, and track displayed in sidebar and header.
  - Real-time `signOut()` destroying sessions and returning to `/login`.

------------------------------------------------------------------------

# 6. Phase 4 --- Competency Framework

## Objective

Build the core domain model.

This phase is foundational because almost every major feature depends on
competencies.

## Data Model

``` text
Role
 └── Competency
       ├── Required Level
       ├── Weight
       ├── Prerequisites
       ├── Assessments
       └── Learning Resources
```

## Tasks

-   Create roles.
-   Create competencies.
-   Create competency hierarchy.
-   Define proficiency levels.
-   Map competencies to roles.
-   Define competency weights.
-   Define prerequisites.
-   Define initial seed data.

## Proficiency Model

Example:

``` text
0–39   Beginner
40–59  Developing
60–74  Proficient
75–89  Strong
90–100 Advanced
```

The exact thresholds should remain configurable.

## Exit Criteria

The system can answer:

> What competencies are required for this role?

and:

> What proficiency level is required for each competency?

------------------------------------------------------------------------

# 10. Phase 5 --- Assessment Engine

## Objective

Measure learner competency.

## MVP Assessment Types

``` text
MCQ
Multiple Select
True/False
Short Answer
```

## Future

``` text
Coding
SQL
Projects
Case Studies
Mentor Evaluation
```

## Tasks

-   Assessment creation.
-   Question bank.
-   Competency mapping.
-   Assessment delivery.
-   Answer submission.
-   Attempt tracking.
-   Time handling.
-   Result calculation.
-   Assessment history.

## Data Flow

``` text
Assessment
    ↓
Questions
    ↓
Learner Answers
    ↓
Scoring
    ↓
Competency Evidence
```

## Exit Criteria

A learner can:

``` text
Start assessment
→ Answer questions
→ Submit
→ Receive results
→ Generate competency evidence
```

------------------------------------------------------------------------

# 11. Phase 6 --- Competency Scoring & Gap Analysis

## Objective

Convert assessment evidence into an understandable competency profile.

## Competency Score

A competency score should be derived from available evidence rather than
simply copying one quiz score.

Possible inputs:

``` text
Assessment Results
Practice Results
Reassessment Results
Project Evidence
Mentor Evidence
```

The initial MVP can use a simpler weighted assessment model.

## Gap Calculation

``` text
Gap = Required Proficiency - Current Proficiency
```

Clamp negative gaps appropriately.

Example:

``` text
Required = 80
Current  = 61

Gap = 19
```

## Priority

Priority should consider:

-   Gap size
-   Role importance
-   Prerequisites
-   Confidence

## Output

``` text
Critical Gap
High Gap
Moderate Gap
Near Target
Target Achieved
```

## Exit Criteria

The system produces:

``` text
Competency Profile
+
Gap Matrix
+
Priority Ranking
```

------------------------------------------------------------------------

# 12. Phase 7 --- Learning Content & Resource System

## Objective

Connect competency gaps to useful learning material.

## Resource Types

``` text
Text
PDF
Video
Exercise
Quiz
Project
Reference
```

## Resource Metadata

``` text
Title
Description
Type
URL / Storage Path
Competencies
Role
Difficulty
Duration
Source
Status
```

## Tasks

-   Create resource schema.
-   Build admin resource creation.
-   Map resources to competencies.
-   Create learner resource view.
-   Add progress tracking.
-   Seed initial content.

## Important Rule

Do not wait for hundreds of resources.

For the MVP, build a **small but high-quality competency/resource
dataset** for the selected demonstration role(s).

## Exit Criteria

A learner with a competency gap can see relevant resources mapped to
that gap.

------------------------------------------------------------------------

# 13. Phase 8 --- Personalized Learning Path

## Objective

Turn the gap matrix into a structured learning journey.

## Initial Recommendation Strategy

Use deterministic rules first.

``` text
Gap
+
Priority
+
Prerequisites
+
Available Resources
=
Learning Path
```

AI can later improve explanation and personalization.

## Learning Path Structure

``` text
Learning Path
 ├── Module 1
 │    ├── Resource
 │    ├── Practice
 │    └── Checkpoint
 │
 ├── Module 2
 │    ├── Resource
 │    ├── Practice
 │    └── Checkpoint
 │
 └── Module 3
```

## Tasks

-   Generate path.
-   Order competencies.
-   Resolve prerequisites.
-   Attach resources.
-   Track progress.
-   Allow resume.
-   Mark completion.

## Exit Criteria

A learner receives a learning path directly connected to identified
gaps.

------------------------------------------------------------------------

# 14. Phase 9 --- Practice & Reassessment

## Objective

Close the learning loop.

## Practice

Practice should be competency-specific.

``` text
Gap
 ↓
Practice
 ↓
Evidence
```

## Reassessment

``` text
Baseline
 ↓
Learning
 ↓
Practice
 ↓
Reassessment
 ↓
New Competency
```

## Tasks

-   Practice question sets.
-   Practice attempts.
-   Immediate feedback.
-   Hints.
-   Explanations.
-   Reassessment assessments.
-   Competency score updates.
-   Historical tracking.

## Exit Criteria

The system can demonstrate:

``` text
Before: 46%
After: 69%

Improvement: +23 percentage points
```

This is a critical SIH demonstration moment.

------------------------------------------------------------------------

# 15. Phase 10 --- RAG Knowledge System

## Objective

Create the trusted knowledge retrieval layer for the AI assistant.

## Architecture

``` text
Approved Documents
       ↓
Storage
       ↓
Text Extraction
       ↓
Chunking
       ↓
Metadata
       ↓
Embeddings
       ↓
pgvector
```

## Metadata

At minimum:

``` text
document_id
title
source
role
competency_id
chunk_index
created_at
```

## Retrieval

Query flow:

``` text
Learner Question
      ↓
Embedding
      ↓
Vector Search
      ↓
Metadata Filtering
      ↓
Top Relevant Chunks
```

## Tasks

-   Document upload.
-   Text extraction.
-   Chunking.
-   Embedding generation.
-   Vector storage.
-   Similarity search.
-   Metadata filtering.
-   Retrieval testing.

## Exit Criteria

Given a learner question, the system can retrieve relevant approved
learning content.

------------------------------------------------------------------------

# 16. Phase 11 --- AI Learning Assistant

## Objective

Build a contextual AI tutor on top of the RAG layer.

## Assistant Context

The assistant should know, where authorized:

``` text
Current learner
Target role
Current competency
Current learning topic
Current resource
Relevant retrieved content
```

## Interaction

``` text
Learner Question
       ↓
Retrieve Context
       ↓
Construct Prompt
       ↓
LLM
       ↓
Grounded Answer
       ↓
Sources
```

## Suggested Actions

``` text
Explain simply
Give an example
Give me a hint
Quiz me
Help me revise
Why is this important?
```

## Guardrails

The AI must not directly:

-   Change competency scores.
-   Grant certificates.
-   Change permissions.
-   Override assessments.
-   Reveal private data.

## Exit Criteria

Learner can ask a question during learning and receive a relevant,
grounded response with source context.

------------------------------------------------------------------------

# 17. Phase 12 --- Progress & Role Readiness

## Objective

Make improvement and employability-oriented readiness visible.

## Progress

Show:

-   Competency growth
-   Assessment history
-   Learning progress
-   Practice progress
-   Improvement

## Role Readiness

Example:

``` text
Data Analyst

Role Readiness: 73%

Strong
✓ SQL

Developing
△ Python

Priority Gaps
! Statistics
! Visualization
```

## Readiness Model

Initial model:

``` text
Role Readiness =
weighted competency achievement
```

Weights should come from the role competency framework.

## Important

Readiness is an analytical indicator, not an employment guarantee.

## Exit Criteria

The learner can clearly understand:

-   Current readiness.
-   Why the score exists.
-   Which competencies are holding it back.
-   What to do next.

------------------------------------------------------------------------

# 18. Phase 13 --- Certificates & Achievements

## Objective

Recognize meaningful competency milestones.

## Achievement Types

``` text
Competency Achieved
Assessment Milestone
Learning Milestone
Improvement Milestone
Role Readiness Milestone
```

## Certificates

MVP:

-   Certificate record.
-   Learner information.
-   Achievement information.
-   Issue date.
-   Verification identifier.

Future:

-   QR verification.
-   Public verification.
-   Digital signatures.

## Exit Criteria

Configured competency/achievement conditions can generate a certificate
or achievement record.

------------------------------------------------------------------------

# 19. Phase 14 --- Admin Portal & Analytics

## Objective

Provide platform administration and institutional insight.

## Admin Features

``` text
Users
Roles
Competencies
Assessments
Questions
Resources
Knowledge Base
Certificates
Analytics
Audit Logs
```

## Analytics

### Platform

-   Learners
-   Active learners
-   Assessment completion
-   Learning progress

### Competency

-   Average competency
-   Skill gaps
-   Role readiness

### Content

-   Most-used resources
-   Resource completion
-   Assessment performance

## Exit Criteria

An administrator can manage the core content model without direct
database manipulation.

------------------------------------------------------------------------

# 20. Phase 15 --- UI/UX Integration & Polish

## Objective

Turn the functional application into a coherent GyanMarg product.

This phase should happen after core workflows are functional, not
instead of building them.

## Areas

### Public

-   Landing page
-   How it works
-   Product overview
-   Trust/methodology
-   CTA

### Learner

-   Onboarding
-   Dashboard
-   Assessment
-   Results
-   Competencies
-   Skill gaps
-   Learning
-   AI assistant
-   Practice
-   Progress
-   Readiness
-   Certificates

### Admin

-   Dashboard
-   Management pages
-   Analytics
-   Content tools

## Requirements

Follow `DESIGN.md`.

Maintain:

``` text
Deep Green
Saffron Gold
Warm Ivory
Soft White
```

## Exit Criteria

The entire primary learner journey feels like one coherent product.

------------------------------------------------------------------------

# 21. Phase 16 --- Security, Testing & Reliability

## Objective

Make the MVP dependable enough for real demonstration and evaluation.

## Security

Review:

-   Authentication
-   RLS
-   Storage permissions
-   API authorization
-   Environment secrets
-   AI credentials
-   Input validation
-   File uploads
-   Admin permissions

## AI Security

Test:

-   Prompt injection
-   Data leakage
-   Unsupported questions
-   Retrieval failure
-   Malicious content

## Testing

### Unit

``` text
Scoring
Gap Calculation
Readiness
Recommendation Rules
```

### Integration

``` text
Auth
Assessment
Database
RAG
AI
Certificates
```

### E2E

``` text
Signup
→ Assessment
→ Gap
→ Learning
→ Practice
→ Reassessment
→ Readiness
```

## Exit Criteria

Critical workflows pass tests and no known high-severity security issue
remains.

------------------------------------------------------------------------

# 22. Phase 17 --- Deployment & Production Readiness

## Objective

Deploy a stable demonstration environment.

## Recommended Infrastructure

``` text
GitHub
   ↓
CI/CD
   ↓
Vercel
   ↓
Next.js

Supabase
   ├── Auth
   ├── PostgreSQL
   ├── Storage
   ├── Edge Functions
   └── pgvector
```

## Tasks

-   Configure production environment.
-   Configure environment variables.
-   Deploy frontend.
-   Configure Supabase production project.
-   Run migrations.
-   Seed demonstration data.
-   Configure domain if available.
-   Test production authentication.
-   Test RAG.
-   Test certificates.
-   Test mobile responsiveness.

## Exit Criteria

A fresh user can access the deployed product and complete the core
journey.

------------------------------------------------------------------------

# 23. Phase 18 --- SIH Demo, Presentation & Evaluation

## Objective

Convert the working product into a compelling SIH demonstration.

## Demo Story

Do not demonstrate every feature.

Use one strong learner journey.

``` text
Learner
 ↓
Selects Data Analyst
 ↓
Takes Assessment
 ↓
Receives Competency Profile
 ↓
Sees Skill Gaps
 ↓
Gets Personalized Path
 ↓
Uses AI Tutor
 ↓
Completes Practice
 ↓
Reassesses
 ↓
Competency Improves
 ↓
Role Readiness Increases
 ↓
Achievement / Certificate
```

## The Demo Must Show

### 1. The Problem

Generic learning does not reveal precise competency gaps.

### 2. The Diagnosis

GyanMarg measures actual competency.

### 3. The Intervention

GyanMarg creates a personalized learning path.

### 4. The Intelligence

RAG-powered AI provides grounded assistance.

### 5. The Outcome

Competency improves and role readiness increases.

------------------------------------------------------------------------

# 24. SIH Presentation Priorities

Recommended priority:

``` text
Problem clarity
        ↓
Unique solution
        ↓
Working competency loop
        ↓
AI/RAG differentiation
        ↓
Real measurable outcome
        ↓
UI/UX quality
        ↓
Architecture
        ↓
Scalability
```

Do not let presentation visuals hide weak implementation.

------------------------------------------------------------------------

# 25. Phase 19 --- Post-MVP Expansion

Only after the MVP is stable.

## Potential Features

### Advanced Assessment

-   Adaptive testing
-   Coding evaluation
-   SQL sandbox
-   Project assessment
-   Portfolio analysis

### Advanced AI

-   Personalized tutoring
-   Multi-agent learning workflows
-   Adaptive explanations
-   Learning difficulty prediction

### Institutional

-   Institution dashboards
-   Regional skill-gap analysis
-   Cohort comparison
-   Workforce intelligence

### Accessibility

-   Multilingual learning
-   Voice interaction
-   Screen-reader enhancements
-   Regional language support

### Credentials

-   QR verification
-   Digital signatures
-   External credential interoperability

------------------------------------------------------------------------

# 26. MVP Definition

The MVP is strictly defined by the **11 Core MVP Features** detailed in `MVP_FEATURES.md`. The MVP is complete when the following unbroken end-to-end flow works:

``` text
1. USER AUTHENTICATION & PROFILES
 ↓
2. COMPETENCY ASSESSMENT (Diagnostic Baseline)
 ↓
3. AI COMPETENCY GAP ANALYSIS (Calculated vs Benchmark)
 ↓
8. PERSONALIZED COURSE RECOMMENDATIONS
 ↓
9. iGOT COURSE / RESOURCE MAPPING (Mock Only)
 ↓
11. LEARNING PATHS / ROADMAPS (Dynamic 4-Phase Path)
 ↓
4. UPLOAD LEARNING MATERIALS (PDF/DOC) (Admin/Faculty)
 ↓
5. AI-GENERATED MCQs (With Exact Citations & HITL Review)
 ↓
6. QUIZ TAKING (Interactive Testing Interface)
 ↓
7. AUTOMATIC EVALUATION (Instant Grading & Feedback)
 ↓
10. LEARNER PROGRESS DASHBOARD (Dynamic Score Update & Readiness)
```

If this flow does not work, the MVP is not complete regardless of how many individual screens exist.

------------------------------------------------------------------------

# 27. MVP Feature Priority (Aligned with MVP_FEATURES.md)

## P0 --- The 11 Core MVP Features (Non-Negotiable High Priority)

Refer to `MVP_FEATURES.md` for detailed technical specifications:

``` text
1. User Authentication & Profiles (Role switcher, Google OAuth, metadata)
2. Competency Assessment (MoSPI FrAC baseline test)
3. AI Competency Gap Analysis (Deterministic gap matrix & radar chart)
4. Upload Learning Materials (PDF/DOC manual & guidelines parser)
5. AI-Generated MCQs (Strict schema, rationales, verifiable citations)
6. Quiz Taking (Interactive test environment & answer recording)
7. Automatic Evaluation (Instant grading & dynamic profile score update)
8. Personalized Course Recommendations (Gap-prioritized course feed)
9. iGOT Course / Resource Mapping (Mock Only - 20+ courses & NSSTA badges)
10. Learner Progress Dashboard (Skill health score, progress velocity, metrics)
11. Learning Paths / Roadmaps (Sequenced 4-phase milestone timeline)
```

## P1 --- Critical MVP Enablers & UI Refinements

``` text
RAG Document Context Provider
AI Learning Assistant / Mentor
Human-in-the-Loop (HITL) Admin Review Studio
Verifiable Competency Certificates (QR code)
Admin Division Capacity Heatmaps
```

## P2 --- Secondary Enhancements

``` text
Adaptive Difficulty Practice
Coding / SQL Interactive Execution Sandbox
Mentor-Student Direct Assignment
Detailed Departmental Export Reports
```

## P3 --- Post-Hackathon / Production Vision

``` text
Production Parichay / NIC SSO Enterprise Gateway
Live Two-Way iGOT Karmayogi API Webhook Sync
Voice AI & Multi-lingual Speech
Mobile Application (React Native / Flutter)
Blockchain-backed Digital Credentials
```

------------------------------------------------------------------------

# 28. Parallel Development Strategy

The team can work in parallel after Phase 2.

Example:

``` text
                 ┌── Frontend Shell
                 │
Foundation ──────┼── Database
                 │
                 ├── Auth
                 │
                 └── Design System
                          ↓
                   Core Integration
```

After the competency model is stable:

``` text
Competency Framework
        │
        ├── Assessment Team
        │
        ├── Learning Content Team
        │
        ├── Dashboard Team
        │
        └── Recommendation Team
```

After learning resources are available:

``` text
Learning Resources
        │
        ├── Learning UI
        ├── RAG
        └── Personalized Path
```

------------------------------------------------------------------------

# 29. Recommended Team Ownership

For a small SIH team:

## Developer 1 --- Frontend / UX

Own:

-   Next.js
-   UI components
-   Learner dashboard
-   Assessment UI
-   Learning UI
-   Admin UI

## Developer 2 --- Backend / Database

Own:

-   Supabase
-   PostgreSQL
-   Migrations
-   RLS
-   APIs
-   Assessment persistence

## Developer 3 --- AI / RAG

Own:

-   Ingestion
-   Embeddings
-   Retrieval
-   LLM integration
-   AI assistant
-   AI evaluation

## Developer 4 --- Product / Integration

Own:

-   Competency framework
-   Recommendation logic
-   Testing
-   Analytics
-   Certificates
-   Integration

If the team is smaller, responsibilities can be combined.

------------------------------------------------------------------------

# 30. Git Strategy Across Phases

Each phase should produce logical commits.

Example:

``` text
feat: initialize gyanmarg application
feat: configure supabase database
feat: implement authentication
feat: add competency framework
feat: implement assessment engine
feat: implement competency gap analysis
feat: add learning resource system
feat: generate personalized learning paths
feat: implement practice and reassessment
feat: implement rag retrieval
feat: add ai learning assistant
feat: add role readiness dashboard
feat: add certificate generation
feat: add admin analytics
test: add competency engine tests
fix: secure learner data with rls
```

Do not create one enormous:

``` text
feat: build entire project
```

commit.

------------------------------------------------------------------------

# 31. Context Management Across Phases

After every meaningful phase milestone:

``` text
Complete Work
     ↓
Run Tests
     ↓
Update CONTEXT.md
     ↓
Review Git Diff
     ↓
Commit
     ↓
Continue
```

`CONTEXT.md` must record:

``` text
Current Phase
Current Objective
Completed Work
Work In Progress
Next Phase
Recent Decisions
Architecture Changes
Database Changes
AI/RAG Changes
UI/UX Changes
Git Branch
Known Issues
Blockers
```

This is especially important when different AI agents work on different
phases.

------------------------------------------------------------------------

# 32. Phase Handoff Template

Before another person or AI agent continues:

``` md
## Handoff

### Current Phase

Phase X — <name>

### Completed

- <item>
- <item>

### Current Work

- <item>

### Next

1. <item>
2. <item>

### Important Decisions

- <decision>

### Files Changed

- <file>
- <file>

### Database Changes

- <migration>

### Known Issues

- <issue>

### Git

- Branch: `<branch>`
- Status: `<clean/uncommitted>`
```

------------------------------------------------------------------------

# 33. Phase Completion Checklist

Every phase should satisfy:

``` text
[ ] Objective completed
[ ] Functional behavior implemented
[ ] Relevant edge cases handled
[ ] Tests added/updated
[ ] Security reviewed
[ ] Documentation updated
[ ] CONTEXT.md updated
[ ] Git diff reviewed
[ ] Commit created
[ ] Next phase identified
```

------------------------------------------------------------------------

# 34. What NOT To Do

Do not:

-   Build every feature simultaneously.
-   Start with the AI chatbot.
-   Build admin analytics before core learner functionality.
-   Spend weeks polishing the landing page before the core loop works.
-   Introduce microservices unnecessarily.
-   Add blockchain because it sounds impressive.
-   Generate huge amounts of low-quality AI content.
-   Treat course completion as competency.
-   Hard-code role/skill logic into UI components.
-   Put secrets in frontend code.
-   Skip RLS.
-   Skip testing of scoring logic.
-   Allow AI to control deterministic business rules.
-   Depend on previous AI chat history.

------------------------------------------------------------------------

# 35. Critical Milestones

## Milestone 1 --- Foundation

``` text
Repo
+
Supabase
+
Auth
+
Design System
```

## Milestone 2 --- Intelligence Core

``` text
Competencies
+
Assessment
+
Scoring
+
Gap Analysis
```

## Milestone 3 --- Learning Loop

``` text
Learning
+
Practice
+
Reassessment
```

## Milestone 4 --- AI

``` text
RAG
+
AI Assistant
```

## Milestone 5 --- Outcome

``` text
Progress
+
Role Readiness
+
Certificates
```

## Milestone 6 --- SIH Ready

``` text
Stable Deployment
+
Polished UX
+
Reliable Demo
+
Presentation
```

------------------------------------------------------------------------

# 36. Final Priority Rule

If time becomes limited, cut features from the bottom of the priority
list.

Never cut the core competency loop.

Priority:

``` text
                 MUST WORK
                     │
                     ▼
            Assessment
                     ↓
            Competency Profile
                     ↓
              Gap Analysis
                     ↓
          Personalized Learning
                     ↓
                Practice
                     ↓
              Reassessment
                     ↓
           Updated Competency
                     ↓
             Role Readiness
```

Then add:

``` text
RAG
AI Assistant
Certificates
Analytics
Advanced Features
```

The strongest SIH product is not the one with the most features.

It is the one that can **prove its central idea through a complete,
reliable, measurable workflow**.

------------------------------------------------------------------------

# 37. Final Definition of Project Completion

GyanMarg should be considered technically ready for SIH when:

``` text
A new learner
      ↓
can register
      ↓
select a target role
      ↓
take an assessment
      ↓
receive a competency profile
      ↓
see exactly where the gaps are
      ↓
receive a personalized learning path
      ↓
learn using platform resources
      ↓
ask the grounded AI assistant for help
      ↓
practice the weak competency
      ↓
take a reassessment
      ↓
see measurable improvement
      ↓
see updated role readiness
      ↓
receive an achievement/certificate
```

And an administrator can:

``` text
Manage roles
Manage competencies
Manage assessments
Manage learning resources
Manage knowledge sources
View analytics
```

while the complete system remains:

``` text
Secure
Tested
Documented
Deployable
Maintainable
Explainable
```

------------------------------------------------------------------------

# 38. Final Principle

> **Build the smallest complete competency-development system first.
> Then make it intelligent, beautiful, scalable, and impressive.**

The correct order is:

``` text
FUNCTIONALITY
     ↓
CORRECTNESS
     ↓
SECURITY
     ↓
INTELLIGENCE
     ↓
UX POLISH
     ↓
SCALE
```

Not:

``` text
BEAUTIFUL UI
     ↓
AI CHATBOT
     ↓
RANDOM FEATURES
     ↓
TRY TO CONNECT EVERYTHING
```

GyanMarg wins by demonstrating a clear transformation:

> **From "I don't know what I need to learn" to "I know my gaps, I know
> what to learn next, I can prove my improvement, and I know how ready I
> am for my target role."**
