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

---

## 2. Secondary & Enhanced Features

1. **Adaptive Difficulty Reassessment:** Dynamic question difficulty scaling based on learner response accuracy.
2. **AI Question Quality & Bias Control:** Pre-generation guardrails checking for question ambiguity, syllabus drift, and answer distribution balance.
3. **Automated Document Summarization:** Generates high-yield study revision briefs from dense statistical policy guidelines and manual PDFs.
4. **Interactive Flashcards:** Auto-generated formula and definition flashcards for rapid revision before assessments.
5. **AI Statistical Chat Mentor:** Conversational AI trained on official MoSPI definitions, methodology books, and guidelines.
6. **Smart Notifications & Nudges:** Milestone reminders and spaced repetition quiz notifications to prevent knowledge decay.

---

## 3. Core MVP Scope vs Full Scope

| Feature Area | MVP Implementation | Full Production Vision |
| :--- | :--- | :--- |
| **Authentication** | Demo Role Switcher + Mock Parichay SSO | Production Parichay / NIC OAuth2 Gateway |
| **Competency Model** | Core FrAC Taxonomy (5 Major Statistical Roles) | Full MoSPI Cadre Hierarchy (ISS, SSS, Contractual) |
| **AI Assessment** | Upload PDF/Doc + Generate MCQs with Citations | Multi-document cross-synthesis + Video transcript parsing |
| **Course Catalog** | Mock iGOT & NSSTA TPAC curated catalog (20+ courses) | Live iGOT Karmayogi API sync & webhook updates |
| **Quiz Evaluation** | Instant grading, citation verification & score update | Adaptive computerized testing (CAT) engine |
| **Dashboards** | Interactive Radar Chart, Roadmap & Admin Heatmap | Enterprise regional hierarchy drill-down across all Indian states |

---

## 4. End-to-End Workflow

```
[ 1. User Authentication & Role Selection ]
              │
              ▼
[ 2. Baseline Diagnostic Competency Assessment ]
              │
              ▼
[ 3. AI Gap Analysis & Radar Chart Generation ]
              │
              ▼
[ 4. Prioritization of Critical Gaps vs Target Role ]
              │
              ▼
[ 5. Personalized Path: Curated iGOT & NSSTA TPAC Courses ]
              │
              ▼
[ 6. Upload Training Materials & Trigger AI Assessment Engine ]
              │
              ▼
[ 7. Human-in-the-Loop Review (Admin/Faculty Approval) ]
              │
              ▼
[ 8. Learner Quiz Execution & Instant Auto-Evaluation ]
              │
              ▼
[ 9. Dynamic Baseline Update & Skill Health Progression ]
              │
              ▼
[ 10. Macro Workforce Heatmap & Predictive Shortage Analytics ]
```
