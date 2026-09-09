# Project Features & Requirements Breakdown
## MoSPI AI-Powered Competency Intelligence & Learning Platform (SIH26101)

Aligned with the **Smart India Hackathon (SIH) 2026 Problem Statement SIH26101** for the **Ministry of Statistics & Programme Implementation (MoSPI)** — Data Informatics & Innovation Division (DIID), National Statistical Systems Training Academy (NSSTA), and the **iGOT Karmayogi** ecosystem.

---

## 1. Core High-Priority Features (Platform Pillars)

### 1.1 User & Role Baseline Profile Management
- **FrAC Competency Framework:** Aligned with the official Karmayogi Framework for Roles, Activities, and Competencies (Domain, Functional, Behavioral).
- **Profile Data Ingestion:** Captures designation (e.g., Statistical Officer, Senior Statistical Officer, Director), posting/division (FOD, SDRD, NAD, ESD), education, past training records, and target career trajectories.
- **Target Role Benchmarking:** Dynamic mapping against required skill thresholds for emerging statistical tracks (Data Science, GIS Spatial Analytics, Big Data, Machine Learning).

### 1.2 Competency Assessment & Diagnostic Engine
- **Initial Diagnostic Assessment:** Baseline testing across core statistical domains and digital tooling.
- **Multi-dimensional Scoring:** Real-time calculation of functional proficiency vs. role benchmarks.
- **Historical Tracking:** Progression tracking across assessment cycles.

### 1.3 Competency Gap Identification & Prioritization
- **Gap Matrix Calculation:** Quantifies positive and negative variances ($\text{Benchmark} - \text{Current}$).
- **Criticality Prioritization:** Flags gaps as *Met Benchmark*, *Minor Gap*, or *Critical Gap* with automated priority weighting.
- **Visual Competency Radar Chart:** Interactive multi-axis visual comparison of current skills vs. target requirements.

### 1.4 AI Recommendation & Course Mapping Engine
- **Semantic Vector Search:** Deep vector embeddings to match learner gap profiles against course descriptions and syllabus modules.
- **iGOT Karmayogi Integration:** Deep link integration with official iGOT Karmayogi course catalogues.
- **NSSTA / TPAC Prioritization:** Special algorithmic weightage and badging for courses endorsed by the Training Programme Advisory Committee (TPAC) of NSSTA.
- **Personalized Learning Pathways:** Auto-sequenced modules with estimated completion timelines and milestone goals.

### 1.5 AI-Powered Intelligent Assessment & Quiz Generator
- **Multimodal Learning Material Ingestion:** Ingests official PDF, DOCX, PPTX training manuals, and video transcripts (e.g., *"Introduction to Sampling Techniques.pdf"*).
- **Automated Generation with Strict JSON Schema:**
  - Standard Single-Choice MCQs
  - Multi-select and Complex Scenario-based Statistical Case Quizzes
  - Comprehensive rationales and step-by-step explanations
  - **Zero-hallucination Page/Section Citations** linking every question directly back to source documents.
- **Human-in-the-Loop (HITL) Review Studio:** Faculty/trainers can review, edit, approve, reject, or regenerate questions before publishing to learners.

### 1.6 Continuous Learning & Dynamic Progression
- **Closed-Loop Feedback:** As learners take AI-generated quizzes and complete courses, their competency baseline dynamically updates, closing identified gaps.
- **Skill Health Score:** Real-time index (0–100%) indicating readiness for specific statistical projects and deployments.

### 1.7 Stakeholder Analytics Dashboards
- **Learner Dashboard:**
  - Competency Radar Chart
  - Personalized Learning Roadmap
  - Skill Health Score & Milestone Badges
  - AI Statistical Tutor / Mentor (contextual assistance for statistical methods and formulas)
- **Administrator & Faculty Dashboard (MoSPI / DIID / NSSTA):**
  - **Macro Capacity Heatmaps:** Department-wide and regional competency distributions (FOD zones, divisions).
  - **Predictive Skill Shortage Alerts:** Early detection of structural talent shortages in emerging tech (GIS, Big Data, ML).
  - **Training ROI & Velocity:** Metrics on enrollment, completion rates, and pre/post-assessment score improvements.
  - **Course Effectiveness Index:** Empirical ranking of courses that drive the highest measurable skill gains.

### 1.8 Security, Authentication & Government Compliance
- **Parichay / NIC SSO:** Single Sign-On integration for Indian government civil servants.
- **Role-Based Access Control (RBAC):** Distinct permissions for Learners (Statistical Officers), Faculty/Trainers (NSSTA), and Administrators (DIID/MoSPI).
- **Data Protection & Encryption:** TLS 1.3 in transit, AES-256 at rest, conforming to CERT-In and DPDP Act standards.

### 1.9 Centralized Internationalization (i18n) & Accessibility
- **Multi-Language Architecture:** Centralized dictionary system supporting English (`en`), Hindi (`hi`), Telugu (`te`), and Tamil (`ta`), engineered for straightforward expansion across all 22 official Indian languages.
- **Instant Reactive Switching:** Immediate localized updates across all Public Layout components (Navbar, Hero, Steps, Courses, Quizzes, Portals, CTA, Footer, and Auth forms) with zero page reload.
- **English Fallback & Interpolation:** Robust fallback to English when keys are unpopulated in regional dialects; parameter interpolation for dynamic values.
- **Accessible Language Selector:** Accessible segmented toggle and keyboard-operable dropdown menu (`listbox`, `Escape`, `ArrowUp`/`ArrowDown`).

### 1.10 Interactive Game-Style Guided Tutorial
- **Quest-Based Tour Onboarding:** 6-stage interactive quest (Welcome, Curated Courses, Diagnostic Assessment, Skill Gap Matrix, 24/7 AI Mentor, Get Started) introducing platform capabilities.
- **Dynamic Spotlight Cutout Overlay:** Viewport-clamped SVG mask dimming the page and highlighting target elements with an animated pulsing amber frame (`#C6851B`).
- **Game-Styled Quest Cards:** Stage counter, amber XP level progress bar, interactive step indicator dots, structured explanation chips (💡 *What it does*, 🎮 *How to use*, ⭐ *Why it matters*), and keyboard controls (`[← / →]`, `[Esc]`).
- **Celebratory Completion Screen:** Achievement modal celebrating quest completion with 1-click CTA to launch the Learner Portal.
- **Persistent State:** Saves completion and skip preferences in `localStorage` with permanent re-launch triggers in navbar, public header, and footer.

---

## 2. Secondary & Enhanced Features

1. **Adaptive Difficulty Reassessment:** Dynamic question difficulty scaling based on learner response accuracy.
2. **AI Question Quality & Bias Control:** Pre-generation guardrails checking for question ambiguity, syllabus drift, and answer distribution balance.
3. **Automated Document Summarization:** Generates high-yield study revision briefs from dense statistical policy guidelines and manual PDFs.
4. **Interactive Flashcards:** Auto-generated formula and definition flashcards for rapid revision before assessments.
5. **AI Statistical Chat Mentor:** Conversational AI trained on official MoSPI definitions, methodology books, and guidelines.
6. **Smart Notifications & Nudges:** Milestone reminders and spaced repetition quiz notifications to prevent knowledge decay.

---

## 3. Core MVP Scope (The 11 Core Features)

As established in `MVP_FEATURES.md`, the platform development is strictly focused on 11 high-priority core features for the Smart India Hackathon:

| # | Core MVP Feature | Scope in MVP | Deferred to Full Production |
| :-: | :--- | :--- | :--- |
| **1** | **User Authentication & Profiles** | Email/Password, Live Google OAuth, 1-Click Role Switcher, Statistical Cadre metadata | Production Parichay / NIC OAuth2 Enterprise Gateway |
| **2** | **Competency Assessment** | 5 Core FrAC Domains Diagnostic Test (Sampling, SQL, Python, GIS, Data Ethics) | Full multi-cadre civil service testing suite |
| **3** | **AI Competency Gap Analysis** | Real-time gap matrix vs role benchmarks + Interactive Competency Radar Chart | Predictive long-term career modeling |
| **4** | **Upload Learning Materials (PDF/DOC)** | Admin/Faculty manual & guideline document parser | Multi-GB video transcription & OCR handwriting |
| **5** | **AI-Generated MCQs (With Citations)** | Structured JSON schema, single/multi-choice, verifiable page/section citations | Dynamic cross-manual synthesis |
| **6** | **Quiz Taking** | Dedicated, responsive student test interface with instant response capture | Live proctoring & lockdown browser |
| **7** | **Automatic Evaluation** | Instant grading, question-by-question rationales, dynamic competency baseline update | Manual human grading workflow |
| **8** | **Personalized Course Recommendations** | Gap-weighted course prioritization matching highest measured deficits | Real-time AI retraining on external clickstreams |
| **9** | **iGOT Course / Resource Mapping** | Curated Mock catalog (20+ courses) with NSSTA / TPAC endorsement badges | Live two-way iGOT Karmayogi API webhook sync |
| **10** | **Learner Progress Dashboard** | Skill Health Score, weekly competency velocity, upcoming deadlines | National-level multi-state drill-downs |
| **11** | **Learning Paths / Roadmaps** | Sequenced 4-Phase milestone roadmap based on individual gap severity | Multi-branch dynamic graph re-routing |

---

## 4. End-to-End Core MVP Workflow

```
[ 1. User Authentication & Profiles ]
              │
              ▼
[ 2. Competency Assessment (Diagnostic) ]
              │
              ▼
[ 3. AI Competency Gap Analysis & Radar Chart ]
              │
              ▼
[ 8. Personalized Course Recommendations ]
              │
              ▼
[ 9. iGOT Course / Resource Mapping (Mock Only) ]
              │
              ▼
[ 11. Learning Paths / Roadmaps ]
              │
   ┌──────────┴──────────┐
   │                     │
   ▼                     ▼
[ 4. Upload Materials ] [ 6. Quiz Taking ]
   │                     │
   ▼                     ▼
[ 5. AI-Generated MCQs] [ 7. Automatic Evaluation ]
   (With Citations & HITL)  │
   │                     ▼
   └───────────────────► [ 10. Learner Progress Dashboard ]
                         (Dynamic Baseline Update & Skill Health)
```
