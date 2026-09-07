# Product Requirements Document (PRD)

## AI-Powered Competency-Based Learning & Skill Gap Platform

**Document:** `PRD.md`\
**Version:** 1.0\
**Status:** Proposed\
**Target:** Smart India Hackathon (SIH)\
**Primary Audience:** Learners, institutions, administrators, mentors,
and government/skill-development stakeholders

------------------------------------------------------------------------

## 1. Product Overview

### 1.1 Product Vision

Build a competency-driven, AI-powered learning platform that
continuously measures what a learner knows, identifies competency gaps
against a target role, generates a personalized learning path, provides
grounded AI assistance, validates learning through practice and
reassessment, and determines role readiness.

### 1.2 Core Idea

The platform follows a closed-loop model:

``` text
Assess
  ↓
Build Competency Profile
  ↓
Identify Skill Gaps
  ↓
Personalize Learning
  ↓
Practice
  ↓
Reassess
  ↓
Update Competency
  ↓
Measure Role Readiness
  ↓
Certify & Recommend Next Steps
```

The product is not intended to be a conventional Learning Management
System (LMS). Its differentiating capability is **competency
measurement + gap analysis + personalized remediation + continuous
validation**.

### 1.3 Core MVP Features (Authoritative Contract)

For the Smart India Hackathon prototype, development is strictly focused on the **11 Core MVP Features** detailed in `MVP_FEATURES.md`:
1. **User Authentication & Profiles**
2. **Competency Assessment**
3. **AI Competency Gap Analysis**
4. **Upload Learning Materials (PDF/DOC)**
5. **AI-Generated MCQs (With Citations)**
6. **Quiz Taking**
7. **Automatic Evaluation**
8. **Personalized Course Recommendations**
9. **iGOT Course / Resource Mapping (Mock Only)**
10. **Learner Progress Dashboard**
11. **Learning Paths / Roadmaps**

All other capabilities are secondary or post-MVP extensions.

------------------------------------------------------------------------

# 2. Problem Statement

Traditional learning platforms primarily measure:

-   Course enrollment
-   Video/content consumption
-   Course completion
-   Quiz scores

These metrics do not reliably answer:

> **What can the learner actually do, what competencies are missing for
> their target role, and what should they learn next?**

Learners often face:

-   Generic learning paths
-   Large amounts of irrelevant content
-   Poor visibility into skill gaps
-   No continuous competency tracking
-   Weak connection between learning and employability
-   Limited feedback after assessments

Institutions and skill-development organizations face a different
problem:

-   Difficulty measuring competency at scale
-   Limited visibility into regional/institutional skill gaps
-   Difficulty mapping learners to role requirements
-   Fragmented learning and assessment data

The proposed platform addresses these problems through a
competency-centered, AI-assisted learning lifecycle.

------------------------------------------------------------------------

# 3. Product Goals

## 3.1 Primary Goals

1.  Create a measurable competency profile for each learner.
2.  Assess learners against defined competencies.
3.  Identify gaps between current and required competency.
4.  Generate personalized learning paths.
5.  Provide a grounded AI learning assistant using RAG.
6.  Enable practical learning and competency validation.
7.  Continuously reassess learners and update competency profiles.
8.  Estimate readiness for a selected target role.
9.  Provide certificates and achievement records.
10. Provide institutional analytics for administrators.

## 3.2 Secondary Goals

-   Support multiple domains and career roles.
-   Make the system extensible to new competency frameworks.
-   Maintain explainable recommendations.
-   Provide a professional, government-ready user experience.
-   Design the architecture for future scale.

------------------------------------------------------------------------

# 4. Non-Goals

The MVP will not attempt to:

-   Replace professional instructors completely.
-   Guarantee employment.
-   Act as a general-purpose chatbot.
-   Generate unrestricted educational content without validation.
-   Replace official government certification systems.
-   Support every possible career role from day one.
-   Build a full social networking platform.

------------------------------------------------------------------------

# 5. Target Users

## 5.1 Learner

The primary user.

Needs to:

-   Understand current capabilities.
-   Discover competency gaps.
-   Follow a personalized learning path.
-   Ask questions and receive explanations.
-   Practice skills.
-   Track progress.
-   Demonstrate competency.
-   Understand readiness for a target role.

## 5.2 Administrator

Manages the platform and its knowledge structure.

Needs to:

-   Manage users and roles.
-   Configure competency frameworks.
-   Manage courses and resources.
-   Manage assessments.
-   Monitor analytics.
-   Manage certificates.
-   Manage AI knowledge sources.

## 5.3 Mentor / Expert

Optional role for later phases.

Needs to:

-   Review learner progress.
-   Review assignments/projects.
-   Provide feedback.
-   Validate selected competencies.

## 5.4 Institution / Government Stakeholder

Needs aggregated insights into:

-   Learner participation.
-   Competency levels.
-   Skill gaps.
-   Role readiness.
-   Learning outcomes.
-   Institutional/regional trends.

------------------------------------------------------------------------

# 6. Core Product Features

## 6.1 User & Role Management

### Requirements

-   Registration and login.
-   Secure authentication.
-   Profile management.
-   Role-based access control.
-   Target career/role selection.
-   Learning preferences.
-   Goal management.

### Initial Roles

``` text
LEARNER
ADMIN
MENTOR (future)
INSTITUTION (future)
```

------------------------------------------------------------------------

## 6.2 Competency Framework

The platform must represent skills in a structured hierarchy.

Example:

``` text
Role: Data Analyst
│
├── SQL
│   ├── SELECT
│   ├── JOIN
│   ├── Aggregation
│   └── Subqueries
│
├── Python
│   ├── Fundamentals
│   ├── Functions
│   └── Data Processing
│
├── Statistics
│   ├── Probability
│   ├── Descriptive Statistics
│   └── Inferential Statistics
│
└── Data Visualization
    ├── Chart Selection
    ├── Dashboard Design
    └── Data Storytelling
```

Each competency should support:

-   Name
-   Description
-   Domain
-   Parent competency
-   Difficulty level
-   Required proficiency
-   Assessment mapping
-   Learning-resource mapping
-   Weight/importance
-   Version

------------------------------------------------------------------------

# 7. Competency Assessment

The assessment engine determines the learner's demonstrated proficiency.

## Supported Assessment Types

### Knowledge

-   MCQ
-   Multiple-select
-   True/False
-   Short answer

### Technical

-   Coding problems
-   SQL problems
-   Debugging tasks

### Practical

-   Projects
-   Case studies
-   Scenario-based tasks

### Future

-   Oral/communication assessment
-   Portfolio evaluation
-   Mentor evaluation

## Assessment Output

Each assessment should produce:

``` text
Competency
Current Score
Confidence
Attempt Count
Evidence
Assessment Date
```

Example:

``` text
SQL
Score: 78%
Confidence: High
Evidence: 24 assessed questions
```

------------------------------------------------------------------------

# 8. Competency Gap Analysis

The gap engine compares:

``` text
Required Competency
        vs
Current Demonstrated Competency
```

Example:

  Competency        Required   Current   Gap Priority
  --------------- ---------- --------- ----- ----------
  SQL                    80%       76%    4% Low
  Python                 85%       60%   25% Medium
  Statistics             80%       48%   32% High
  Visualization          75%       40%   35% Critical

Gap priority should consider:

-   Gap magnitude
-   Role importance
-   Competency dependency
-   Assessment confidence
-   Learning prerequisites

------------------------------------------------------------------------

# 9. AI-Powered Personalized Learning

The recommendation engine converts competency gaps into an ordered
learning path.

## Inputs

-   Learner competency profile
-   Target role
-   Competency gaps
-   Learning history
-   Assessment history
-   Prerequisites
-   Available learning resources
-   Learner preferences

## Outputs

-   Recommended topics
-   Recommended resources
-   Practice activities
-   Revision activities
-   Assessment schedule
-   Estimated learning sequence

Example:

``` text
Current State
    ↓
Statistics Gap
    ↓
Probability Fundamentals
    ↓
Descriptive Statistics
    ↓
Practice
    ↓
Applied Statistics
    ↓
Assessment
```

The system should prioritize **what the learner needs**, not simply what
content is available.

------------------------------------------------------------------------

# 10. RAG-Based AI Learning Assistant

The AI assistant should provide contextual and grounded learning
support.

## Purpose

The assistant helps learners:

-   Understand concepts.
-   Ask questions.
-   Get examples.
-   Summarize approved learning material.
-   Receive hints.
-   Identify relevant resources.
-   Revise weak competencies.

## RAG Pipeline

``` text
Approved Learning Sources
        ↓
Document Ingestion
        ↓
Text Extraction
        ↓
Chunking
        ↓
Embeddings
        ↓
Vector Storage
        ↓
Semantic Retrieval
        ↓
Relevant Context
        ↓
LLM
        ↓
Grounded Response
```

## Knowledge Sources

-   Platform-authored lessons
-   PDFs
-   Official documentation
-   Approved educational resources
-   Course material
-   Institutional content

## RAG Requirements

-   Store document metadata.
-   Store source references.
-   Support semantic search.
-   Filter retrieval by domain/role/competency where applicable.
-   Return source references to the UI.
-   Prevent unsupported claims where possible.
-   Keep private/user-specific information separated from shared
    knowledge.

------------------------------------------------------------------------

# 11. Learning Content

Supported content:

-   Text lessons
-   PDFs
-   Videos
-   Examples
-   Quizzes
-   Exercises
-   Projects
-   Reference material

Each learning resource should map to one or more competencies.

Example:

``` text
Resource:
"SQL Joins Fundamentals"

Maps to:
- SQL
- Joins
- Data Retrieval
```

------------------------------------------------------------------------

# 12. Practice Engine

The platform should provide competency-focused practice.

## Features

-   Topic-specific questions
-   Difficulty levels
-   Adaptive practice
-   Immediate feedback
-   Hints
-   Explanations
-   Attempt history
-   Weak-area practice

## Technical Practice

For coding/SQL evaluation, the architecture should isolate execution
from the main application.

``` text
User Submission
      ↓
Validation
      ↓
Sandbox / Code Execution Service
      ↓
Test Cases
      ↓
Result
      ↓
Competency Evidence
```

Untrusted code must never execute directly inside the main application
server.

------------------------------------------------------------------------

# 13. Continuous Reassessment

Learning should update the competency profile.

``` text
Initial Assessment
       ↓
Learning
       ↓
Practice
       ↓
Reassessment
       ↓
Updated Score
       ↓
New Gap Analysis
       ↓
Next Learning Recommendation
```

The system should retain assessment history so improvement can be
visualized over time.

------------------------------------------------------------------------

# 14. Role Readiness

The learner can select a target role.

Example:

``` text
Target Role:
Data Analyst
```

The system calculates readiness based on the required competency
framework.

Possible output:

``` text
Overall Role Readiness: 82%

Strong:
✓ SQL
✓ Excel

Developing:
△ Python

Needs Improvement:
! Statistics
! Data Visualization
```

Readiness should be explainable and traceable to underlying competency
evidence.

It must not be presented as a guarantee of employment.

------------------------------------------------------------------------

# 15. Progress Dashboard

The learner dashboard should display:

-   Overall competency
-   Target role
-   Role readiness
-   Skill gaps
-   Learning path
-   Learning progress
-   Assessment history
-   Competency growth
-   Achievements
-   Certificates
-   Recommended next action

The primary dashboard action should answer:

> **What should I do next?**

------------------------------------------------------------------------

# 16. Certificates & Achievements

The platform may generate:

-   Course completion certificates
-   Competency badges
-   Skill achievements
-   Role-readiness certificates

Certificates should contain verifiable metadata.

Future enhancement:

-   QR verification
-   Public verification page
-   Signed certificate metadata
-   Blockchain/DID integration only if there is a demonstrated
    requirement

Blockchain is **not required for the MVP**.

------------------------------------------------------------------------

# 17. Admin Portal

## User Management

-   Search users
-   View profiles
-   Manage roles
-   Activate/deactivate accounts

## Competency Management

-   Create roles
-   Create competencies
-   Define proficiency levels
-   Map competencies to assessments
-   Map competencies to learning resources

## Content Management

-   Upload documents
-   Add lessons
-   Add videos/resources
-   Tag resources
-   Manage knowledge-base sources

## Assessment Management

-   Create questions
-   Create assessments
-   Configure scoring
-   Configure competency mapping

## Analytics

-   User growth
-   Assessment participation
-   Competency distribution
-   Major skill gaps
-   Learning outcomes
-   Role readiness

------------------------------------------------------------------------

# 18. Institutional Analytics

For future institutional deployment:

``` text
Institution
    ↓
Learner Population
    ↓
Competency Data
    ↓
Skill Gap Aggregation
    ↓
Institutional Dashboard
```

Analytics may include:

-   Average competency by domain
-   Most common skill gaps
-   Role readiness distribution
-   Learning completion
-   Assessment performance
-   Competency improvement
-   Participation trends

All institutional analytics must follow appropriate privacy and access
controls.

------------------------------------------------------------------------

# 19. Functional Requirements

## FR-01 Authentication

The system shall allow users to securely register, authenticate, sign
out, and manage sessions.

## FR-02 Authorization

The system shall enforce role-based access to protected resources.

## FR-03 Profile

The system shall maintain learner profile, goals, target role, and
learning history.

## FR-04 Competency Framework

The system shall store roles, competencies, proficiency requirements,
prerequisites, and mappings.

## FR-05 Assessment

The system shall deliver assessments and record competency evidence.

## FR-06 Gap Analysis

The system shall calculate competency gaps between demonstrated and
required proficiency.

## FR-07 Recommendation

The system shall generate personalized learning recommendations based on
identified gaps.

## FR-08 RAG Assistant

The system shall retrieve relevant approved knowledge and use it as
context for AI responses.

## FR-09 Practice

The system shall provide competency-specific practice activities.

## FR-10 Reassessment

The system shall update competency scores using subsequent assessment
evidence.

## FR-11 Readiness

The system shall calculate and explain role-readiness based on the
competency framework.

## FR-12 Certificates

The system shall record and issue achievement/certificate information
according to configured rules.

## FR-13 Analytics

The system shall provide role-appropriate learner and administrator
analytics.

------------------------------------------------------------------------

# 20. Non-Functional Requirements

## Security

-   Secure authentication.
-   Row-level authorization.
-   Server-side validation.
-   Least-privilege access.
-   Protected secrets.
-   Secure file access.
-   Audit logging for sensitive administrative operations.

## Performance

Target MVP experience:

-   Fast dashboard loading.
-   Low-latency normal API requests.
-   Streaming AI responses where appropriate.
-   Asynchronous processing for document ingestion and embeddings.

## Scalability

Architecture should allow:

-   More learners
-   More roles
-   More competencies
-   More learning resources
-   More AI requests
-   More institutions

without redesigning the core domain model.

## Reliability

-   Database backups.
-   Error handling.
-   Retry mechanisms for asynchronous jobs.
-   Observability.
-   Graceful failure for AI/provider outages.

## Accessibility

Target:

-   Responsive design
-   Keyboard navigation
-   Readable typography
-   Appropriate contrast
-   Accessible form controls
-   Semantic HTML
-   Screen-reader-friendly interfaces

## Privacy

-   Minimize personal data collection.
-   Separate user data from shared knowledge.
-   Apply role-based access.
-   Avoid exposing private learner information in institutional
    analytics.
-   Maintain clear data-retention policies.

------------------------------------------------------------------------

# 21. Proposed Technology Stack

The following stack is the recommended baseline for the MVP.

## Frontend

  Technology     Purpose
  -------------- ----------------------------------------------
  Next.js        Full-stack React framework / web application
  React          UI component architecture
  TypeScript     Type safety
  Tailwind CSS   Styling
  shadcn/ui      Reusable UI components
  Recharts       Dashboard analytics/visualizations

### Frontend Responsibilities

-   Application UI
-   Authentication flows
-   Learner dashboard
-   Assessment interface
-   Learning interface
-   AI assistant interface
-   Admin dashboard
-   Progress visualization

------------------------------------------------------------------------

## Backend / Platform

### Supabase

Use Supabase as the primary backend platform for:

-   PostgreSQL database
-   Authentication
-   Row Level Security
-   Storage
-   Edge Functions
-   Realtime capabilities where needed

Supabase should be treated as the primary backend/data platform rather
than creating an unnecessarily large custom backend for the MVP.

------------------------------------------------------------------------

## Database

### PostgreSQL

Primary relational database for:

-   Users
-   Profiles
-   Roles
-   Competencies
-   Assessments
-   Questions
-   Attempts
-   Learning resources
-   Learning paths
-   Progress
-   Certificates
-   AI metadata

### pgvector

Use PostgreSQL + pgvector for vector storage and semantic retrieval.

This reduces infrastructure complexity by keeping relational and vector
data in the same platform.

------------------------------------------------------------------------

# 22. AI Stack

## LLM

Use a production-capable LLM provider through a server-side abstraction.

The application should avoid tightly coupling business logic to one
model provider.

Example architecture:

``` text
Application
    ↓
AI Service Layer
    ↓
LLM Provider
```

This allows the provider/model to be changed later.

## Embeddings

Use an embedding model for:

-   Learning documents
-   Competency descriptions
-   Resource metadata
-   Knowledge-base chunks

## RAG

``` text
Supabase PostgreSQL
       +
pgvector
       +
Embedding Model
       +
LLM
```

------------------------------------------------------------------------

# 23. Recommended AI Architecture

``` text
                 ┌─────────────────────┐
                 │   Next.js Frontend  │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │  AI Service Layer  │
                 └──────────┬──────────┘
                            ↓
              ┌─────────────┴─────────────┐
              ↓                           ↓
       ┌──────────────┐            ┌──────────────┐
       │ RAG Pipeline │            │ LLM Provider │
       └──────┬───────┘            └──────────────┘
              ↓
       ┌──────────────┐
       │  pgvector    │
       └──────┬───────┘
              ↓
       ┌──────────────┐
       │ PostgreSQL   │
       └──────────────┘
```

------------------------------------------------------------------------

# 24. Backend Architecture

``` text
                    CLIENT
                      │
                      ▼
              ┌───────────────┐
              │    Next.js    │
              │   Frontend    │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ Authentication│
              │   Supabase    │
              └───────┬───────┘
                      │
              ┌───────┴────────┐
              ▼                ▼
       ┌────────────┐   ┌─────────────┐
       │ PostgreSQL │   │ Edge        │
       │ + pgvector │   │ Functions   │
       └─────┬──────┘   └──────┬──────┘
             │                 │
             │        ┌────────┴────────┐
             │        ▼                 ▼
             │   AI Services       Async Jobs
             │
             ▼
       Application Data
```

------------------------------------------------------------------------

# 25. Hosting & Deployment

## Recommended

### Frontend

Deploy Next.js on:

-   Vercel

### Backend

Use:

-   Supabase

### Source Control

-   GitHub

### CI/CD

-   GitHub Actions
-   Automated linting
-   Type checking
-   Tests
-   Build validation

### Deployment Flow

``` text
Developer
   ↓
Git
   ↓
GitHub
   ↓
CI Checks
   ↓
Production Deployment
```

------------------------------------------------------------------------

# 26. Storage Architecture

Supabase Storage can store:

-   Course documents
-   Learning PDFs
-   Images
-   Certificate assets
-   User-uploaded learning artifacts

Sensitive files should use protected buckets and controlled access
rather than public URLs.

------------------------------------------------------------------------

# 27. RAG Ingestion Architecture

``` text
Admin uploads document
        ↓
Storage
        ↓
Ingestion Edge Function / Worker
        ↓
Text Extraction
        ↓
Cleaning
        ↓
Chunking
        ↓
Metadata Assignment
        ↓
Embedding Generation
        ↓
pgvector
        ↓
Ready for Retrieval
```

Each chunk should retain metadata such as:

``` text
document_id
title
source
domain
role
competency_id
chunk_index
created_at
```

------------------------------------------------------------------------

# 28. Recommendation Architecture

The recommendation system should initially use a **hybrid approach**
rather than relying entirely on an LLM.

``` text
Competency Rules
      +
Gap Analysis
      +
Prerequisites
      +
Learning History
      +
Resource Metadata
      ↓
Recommendation Engine
      ↓
Ranked Learning Actions
      ↓
LLM Personalization Layer
```

The LLM should explain and personalize recommendations, while
deterministic business rules should control important competency logic.

This improves reliability and explainability.

------------------------------------------------------------------------

# 29. Data Model --- High-Level

``` text
users
profiles
roles
competencies
role_competencies
assessments
questions
question_competencies
assessment_attempts
responses
competency_scores
learning_resources
resource_competencies
learning_paths
learning_path_items
practice_attempts
certificates
achievements
documents
document_chunks
ai_conversations
ai_messages
audit_logs
```

Relationships:

``` text
Role
 └── Competencies
       ├── Assessments
       └── Learning Resources

User
 └── Profile
      ├── Target Role
      ├── Competency Scores
      ├── Learning Path
      ├── Attempts
      ├── Achievements
      └── Certificates
```

------------------------------------------------------------------------

# 30. Security Architecture

## Authentication

Supabase Auth.

## Authorization

PostgreSQL Row Level Security (RLS).

Example principle:

``` text
Learner
→ Can read/write their own learning data

Admin
→ Can manage configured platform resources

Institution
→ Can access only authorized aggregate data
```

## AI Security

API keys and provider credentials must remain server-side.

The browser must never receive privileged AI provider credentials.

## File Security

-   Private buckets for sensitive documents.
-   Signed URLs when temporary access is required.
-   Validate file types and sizes.
-   Restrict upload permissions.

## Code Execution Security

User-submitted code must run in an isolated execution environment.

------------------------------------------------------------------------

# 31. API / Service Boundaries

The MVP can use Next.js server-side routes/actions and Supabase Edge
Functions rather than introducing a separate microservice architecture.

Major service boundaries:

``` text
Authentication Service
Competency Service
Assessment Service
Recommendation Service
Learning Service
RAG Service
Certificate Service
Analytics Service
```

These are **logical service boundaries**, not necessarily separate
deployable microservices.

------------------------------------------------------------------------

# 32. Observability

The platform should capture:

-   Application errors
-   AI request failures
-   RAG retrieval failures
-   Assessment errors
-   Background job failures
-   Important administrative actions
-   Performance metrics

Recommended categories:

``` text
Logs
Metrics
Errors
Audit Events
```

------------------------------------------------------------------------

# 33. AI Guardrails

The AI assistant should:

1.  Prefer retrieved approved content when answering platform-specific
    questions.
2.  Clearly distinguish sourced information from generated explanation.
3.  Avoid fabricating platform policies or competency scores.
4.  Never modify competency scores directly through free-form
    conversation.
5.  Never issue certificates through chat alone.
6.  Respect user permissions.
7.  Avoid exposing private learner data.
8.  Escalate uncertain or unsupported answers appropriately.

------------------------------------------------------------------------

# 34. Explainability

AI-generated recommendations should provide a reason.

Example:

> **Recommended: Statistics Fundamentals**

Reason:

> Your current demonstrated proficiency is 48%, while the target Data
> Analyst role requires 80%. This competency is also a prerequisite for
> two upcoming learning modules.

This is preferable to:

> "AI recommends this course."

------------------------------------------------------------------------

# 35. MVP Scope

The SIH MVP should prioritize a complete working competency loop rather
than excessive features.

## Must Have

-   Authentication
-   Learner profile
-   Target role selection
-   Competency framework
-   Assessment engine
-   Competency scoring
-   Gap analysis
-   Personalized learning path
-   Learning resources
-   RAG-based AI assistant
-   Practice
-   Reassessment
-   Progress dashboard
-   Role readiness
-   Basic certificates
-   Admin content/competency management

## Should Have

-   Coding/SQL assessment
-   Advanced analytics
-   Adaptive practice
-   Mentor feedback
-   Certificate verification

## Could Have

-   Institution dashboards
-   Peer learning
-   Advanced recommendation models
-   Multilingual AI
-   Voice assistant
-   Mobile application

## Won't Have in Initial MVP

-   Blockchain credentials
-   Full social network
-   Complex microservice infrastructure
-   Large-scale multi-tenant government deployment
-   Fully autonomous AI curriculum generation

------------------------------------------------------------------------

# 36. Key User Journey

``` text
1. User registers
       ↓
2. Selects target role
       ↓
3. Takes baseline assessment
       ↓
4. Competency profile generated
       ↓
5. Skill gaps identified
       ↓
6. Personalized learning path generated
       ↓
7. User studies resources
       ↓
8. User asks AI assistant for help
       ↓
9. User completes practice
       ↓
10. User takes reassessment
       ↓
11. Competency profile updated
       ↓
12. Role readiness recalculated
       ↓
13. User earns achievements/certificate
       ↓
14. System recommends next development area
```

------------------------------------------------------------------------

# 37. Example End-to-End Scenario

### Learner

Target role: **Data Analyst**

### Initial Assessment

``` text
SQL              78%
Python           61%
Statistics       46%
Visualization    39%
```

### Gap Analysis

``` text
Critical:
- Visualization
- Statistics

Moderate:
- Python

Near Target:
- SQL
```

### Personalized Path

``` text
1. Statistics Fundamentals
2. Probability
3. Data Visualization Principles
4. Matplotlib
5. Dashboard Design
6. Python Data Analysis
7. Applied Project
```

### AI Assistant

Learner asks:

> "Why do I need probability for data analysis?"

RAG retrieves relevant approved learning material and produces a
level-appropriate explanation with source context.

### Reassessment

``` text
SQL              81%
Python           74%
Statistics       69%
Visualization    65%
```

### Updated Readiness

``` text
Previous: 51%
Current: 73%
```

The system then recommends the next highest-impact competency.

------------------------------------------------------------------------

# 38. Success Metrics

## Learner Metrics

-   Assessment completion rate
-   Learning path completion rate
-   Competency improvement
-   Reassessment improvement
-   Practice completion
-   Role-readiness improvement
-   AI assistant usefulness feedback

## Platform Metrics

-   Active learners
-   Assessment participation
-   Learning-resource usage
-   RAG retrieval success
-   AI response latency
-   System reliability

## Institutional Metrics

-   Average competency by role
-   Most common competency gaps
-   Competency improvement over time
-   Role-readiness distribution

### Most Important Product Metric

> **Measured competency improvement after personalized intervention.**

Course completion should not be the primary success metric.

------------------------------------------------------------------------

# 39. Acceptance Criteria

The MVP is considered successful when a learner can:

-   Create an account.
-   Select a target role.
-   Complete a baseline assessment.
-   Receive competency scores.
-   View identified skill gaps.
-   Receive a personalized learning path.
-   Open mapped learning resources.
-   Ask the AI assistant questions.
-   Receive RAG-grounded answers.
-   Complete practice.
-   Complete reassessment.
-   See updated competency scores.
-   See role-readiness.
-   Earn configured achievements/certificates.

An administrator must be able to:

-   Manage competencies.
-   Manage roles.
-   Manage learning resources.
-   Manage assessments.
-   View basic analytics.

------------------------------------------------------------------------

# 40. Development Priorities

The team should implement in this order:

### Phase 1 --- Foundation

``` text
Repository
↓
Next.js
↓
Supabase
↓
Authentication
↓
Database Schema
↓
RLS
```

### Phase 2 --- Competency Engine

``` text
Roles
↓
Competencies
↓
Assessments
↓
Scoring
↓
Gap Analysis
```

### Phase 3 --- Learning

``` text
Resources
↓
Learning Paths
↓
Practice
↓
Progress
```

### Phase 4 --- AI

``` text
Document Ingestion
↓
Embeddings
↓
pgvector
↓
Retrieval
↓
LLM
↓
RAG Assistant
```

### Phase 5 --- Validation

``` text
Reassessment
↓
Updated Competency
↓
Role Readiness
↓
Certificates
```

### Phase 6 --- Presentation & Hardening

``` text
Analytics
↓
UX Polish
↓
Security Review
↓
Performance
↓
Testing
↓
Deployment
```

------------------------------------------------------------------------

# 41. Testing Strategy

## Unit Testing

Test:

-   Competency calculations
-   Gap calculations
-   Readiness calculations
-   Recommendation rules
-   Validation logic

## Integration Testing

Test:

-   Authentication
-   Database operations
-   Assessment submission
-   RAG retrieval
-   AI service integration
-   Certificate generation

## End-to-End Testing

Test the complete learner journey:

``` text
Signup
→ Assessment
→ Gap
→ Learning
→ Practice
→ Reassessment
→ Readiness
```

## Security Testing

Test:

-   RLS policies
-   Unauthorized data access
-   File access
-   API authorization
-   Prompt injection scenarios
-   Malicious uploads
-   Code execution isolation

------------------------------------------------------------------------

# 42. Project Repository Structure

Recommended structure:

``` text
project-root/
│
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── assessment/
│   ├── learning/
│   ├── assistant/
│   ├── progress/
│   ├── certificates/
│   └── admin/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── assessment/
│   ├── learning/
│   └── assistant/
│
├── lib/
│   ├── supabase/
│   ├── ai/
│   ├── rag/
│   ├── competency/
│   ├── assessment/
│   └── recommendations/
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed/
│
├── types/
│
├── tests/
│
├── docs/
│
├── public/
│
├── .env.example
├── architecture.md
├── PRD.md
├── features.md
└── README.md
```

------------------------------------------------------------------------

# 43. Environment Configuration

Sensitive configuration must use environment variables.

Example categories:

``` text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

LLM_API_KEY
EMBEDDING_API_KEY

AI_MODEL
EMBEDDING_MODEL
```

Secrets must never be committed to Git.

------------------------------------------------------------------------

# 44. Architecture Principles

The project should follow these principles:

### 1. Competency First

Every major learning feature should connect back to competencies.

### 2. Evidence Over Claims

Competency should be based on assessment/practice evidence rather than
course completion alone.

### 3. Deterministic Core Logic

Critical scoring, gap, and readiness calculations should be rule-based
and testable.

### 4. AI as an Intelligence Layer

AI should enhance explanation, personalization, retrieval, and
recommendations---not control critical business logic blindly.

### 5. RAG Over Unrestricted Generation

Platform-specific answers should be grounded in approved knowledge.

### 6. Security by Default

Use RLS, protected storage, server-side secrets, and isolated code
execution.

### 7. Simple Infrastructure

Avoid premature microservices and unnecessary infrastructure in the SIH
MVP.

### 8. Explainable Recommendations

Every important recommendation should have a reason.

### 9. Extensible Competency Model

Adding a new role should not require rewriting the application.

### 10. Measure Outcomes

The platform should measure competency improvement, not just engagement.

------------------------------------------------------------------------

# 45. Risks & Mitigations

  -----------------------------------------------------------------------
  Risk                    Impact                  Mitigation
  ----------------------- ----------------------- -----------------------
  AI hallucination        High                    RAG + source
                                                  grounding + guardrails

  Incorrect competency    High                    Deterministic scoring +
  scoring                                         tests

  Poor recommendations    High                    Rule-based baseline +
                                                  feedback loop

  Large AI costs          Medium                  Caching + controlled
                                                  context + model routing

  Data leakage            High                    RLS + least privilege +
                                                  secure storage

  Malicious file uploads  High                    Validation + scanning +
                                                  isolated processing

  Unsafe code execution   Critical                Sandbox / isolated
                                                  execution service

  Vendor lock-in          Medium                  AI service abstraction

  Over-complex            High                    Modular monolith for
  architecture                                    MVP

  Insufficient content    High                    Curated initial
                                                  competency/resource
                                                  dataset
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 46. Future Roadmap

## Phase 2

-   Mentor workflows
-   Adaptive assessments
-   Advanced project evaluation
-   Multilingual support
-   Institutional dashboards
-   Better recommendation ranking

## Phase 3

-   Competency benchmarking
-   Skill-demand intelligence
-   Organization-level skill mapping
-   External credential integration
-   Portfolio integration
-   Workforce analytics

## Phase 4

-   Large-scale government/institution deployment
-   Multi-tenant architecture
-   Advanced AI tutoring
-   Predictive skill-gap analysis
-   Personalized career pathways

------------------------------------------------------------------------

# 47. Final Product Definition

The platform can be summarized as:

> **An AI-powered competency development platform that assesses what
> learners know, identifies the skills they lack for a target role,
> generates personalized learning pathways, provides grounded AI
> assistance, validates improvement through practice and reassessment,
> and measures role readiness.**

The fundamental product loop is:

``` text
MEASURE
   ↓
UNDERSTAND
   ↓
PERSONALIZE
   ↓
LEARN
   ↓
PRACTICE
   ↓
VALIDATE
   ↓
IMPROVE
   ↓
MEASURE AGAIN
```

This loop is the core of the product and should remain the central
design principle across the UI, backend, database, AI architecture, and
SIH presentation.
