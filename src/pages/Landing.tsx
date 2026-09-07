import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { C, FONT } from "@/tokens";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

// ── Competency radar data ────────────────────────────────────────────────────
const radarData = [
  { subject: "Leadership", value: 68 },
  { subject: "Technical", value: 38 },
  { subject: "Communication", value: 75 },
  { subject: "Ethics", value: 82 },
  { subject: "Digital", value: 32 },
  { subject: "Policy", value: 56 },
];

// ── Progress area chart data ─────────────────────────────────────────────────
const progressData = [
  { week: "W1", score: 42 },
  { week: "W2", score: 49 },
  { week: "W3", score: 55 },
  { week: "W4", score: 61 },
  { week: "W5", score: 68 },
  { week: "W6", score: 76 },
];

// ── Gap bars ─────────────────────────────────────────────────────────────────
const gapBars = [
  { label: "Digital Skills", value: 32 },
  { label: "Technical", value: 38 },
  { label: "Policy Writing", value: 56 },
];

// ── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: "100%", label: "Source-Cited Grounding" },
  { value: "Multi-Axis", label: "Competency Diagnostics" },
  { value: "Dynamic", label: "Adaptive Learning Paths" },
  { value: "Closed-Loop", label: "Skill Gap Remediation" },
  { value: "Zero", label: "Hallucination Quiz Engine" },
];

// ── Steps ────────────────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    icon: (
      <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: "Diagnostic Assessment",
    desc: "Complete an adaptive competency diagnostic evaluating baseline proficiency across domain and functional requirements.",
    accent: C.dark,
  },
  {
    num: "02",
    icon: (
      <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "AI Gap Quantification",
    desc: "Quantifies multi-axis proficiency gaps by benchmarking baseline performance against structured competency standards.",
    accent: C.accent,
  },
  {
    num: "03",
    icon: (
      <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="3" />
        <path d="M9 19h8.5a4.5 4.5 0 0 0 0-9H7a4 4 0 0 1 0-8h11" />
        <circle cx="18" cy="5" r="3" />
      </svg>
    ),
    title: "Personalized Roadmap",
    desc: "Receive an auto-sequenced milestone pathway linking national curriculum benchmarks, specializations, and foundational courses.",
    accent: C.dark,
  },
  {
    num: "04",
    icon: (
      <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15l-2 5l4-2l4 2l-2-5" />
        <circle cx="12" cy="9" r="6" />
      </svg>
    ),
    title: "Practice & Master",
    desc: "Practice with AI-synthesized quizzes cited directly from syllabus materials, and continuously track skill mastery.",
    accent: C.accent,
  },
];

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: "Domain Competency Diagnostic",
    desc: "Standardized assessments evaluating Domain, Functional, and Behavioral skills tailored to your specialized career track.",
    tag: "Core Diagnostic",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="3" />
        <path d="M9 19h8.5a4.5 4.5 0 0 0 0-9H7a4 4 0 0 1 0-8h11" />
        <circle cx="18" cy="5" r="3" />
      </svg>
    ),
    title: "Adaptive Learning Pathways",
    desc: "Curated learning journeys automatically sequenced to target diagnosed competency gaps in prioritized progression order.",
    tag: "Adaptive Paths",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "RAG Quiz Generator with Citations",
    desc: "Upload textbooks, research papers, or syllabus documents to synthesize validated diagnostic questions with exact source citations.",
    tag: "Source Verified",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Contextual Academic Mentor",
    desc: "Direct explanations, formula derivations, and structured academic remediation from a dedicated conversational study assistant.",
    tag: "Study Mentor",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Dual Stakeholder Dashboards",
    desc: "Personalized radar analytics for learners alongside institutional cohort heatmaps for academic administrators.",
    tag: "Analytics",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Curricular Standard Alignment",
    desc: "Systematically map courseware against structured competency standards and modular learning objectives.",
    tag: "Standards",
  },
];

// ── Curated Courses Mapped to Competency Tracks ─────────────────────────────
const curatedCourses = [
  {
    dept: "Data Science & AI",
    title: "Python for Data Analysis & Modeling",
    hours: "12 hrs",
    level: "Foundation",
  },
  {
    dept: "Applied Statistics",
    title: "Statistical Inference & Sampling Methods",
    hours: "16 hrs",
    level: "Intermediate",
  },
  {
    dept: "Spatial Computing",
    title: "GIS & Geo-Spatial Data Analytics",
    hours: "10 hrs",
    level: "Intermediate",
  },
  {
    dept: "Public Policy & Governance",
    title: "Evidence-Based Policy & Digital Governance",
    hours: "8 hrs",
    level: "Advanced",
  },
];

// ── Core Platform Architecture Pillars ───────────────────────────────────────
const platformPillars = [
  {
    num: "01",
    tag: "Objective Measurement",
    title: "Zero-Guesswork Skill Quantification",
    desc: "Standardized diagnostic assessments evaluate concrete conceptual proficiency across defined competency tiers rather than relying on self-reported surveys or superficial completions.",
    points: [
      "Multi-axis proficiency scoring (Domain, Analytical, Practical)",
      "Pinpoints exact conceptual deficits in minutes",
      "Calibrated difficulty curve adapted to learner performance",
    ],
    accent: C.s1,
  },
  {
    num: "02",
    tag: "Source Grounding",
    title: "Strict Page-Level Citation Verification",
    desc: "The assessment engine extracts core formulations directly from syllabus literature and reference materials, ensuring every question and explanation includes verifiable citations.",
    points: [
      "Chunk-level semantic retrieval with direct source provenance",
      "Eliminates hallucinated facts and unsupported quiz answers",
      "Direct reference citations for immediate material review",
    ],
    accent: C.accent,
  },
  {
    num: "03",
    tag: "Adaptive Feedback",
    title: "Targeted Remediation & Closed-Loop Growth",
    desc: "Instead of static course lists, the platform dynamically re-sequences learning paths based on assessment outcomes, prioritizing high-severity skill gaps with focused modular content.",
    points: [
      "Dynamic competency radar updating after each assessment",
      "Modular micro-learning units focused on diagnosed deficits",
      "Transparent progression toward verifiable mastery credentials",
    ],
    accent: C.s3,
  },
];

// ── Quiz data ─────────────────────────────────────────────────────────────────
const quizQuestion = {
  q: "In Stratified Random Sampling, which condition ensures optimal allocation (Neyman allocation) across survey strata?",
  options: [
    "Sample size is proportional only to stratum total population size",
    "Sample size is proportional to stratum size multiplied by stratum standard deviation",
    "Sample size is equal across all strata regardless of variance",
    "Sample size is inversely proportional to stratum measurement error",
  ],
  correct: 1,
};

const quizResults = [
  { domain: "Sampling Theory & Design", score: 92 },
  { domain: "Exploratory Data Analysis", score: 78 },
  { domain: "Machine Learning Foundations", score: 64 },
];

// ── Cyclic Competency Architecture (6 Stages + Re-Loop Detection) ───────────
const cyclicStages = [
  {
    num: "01",
    stepNum: 1,
    title: "1. PROFILE & ASSESS",
    shortTitle: "Profile & Assess",
    items: ["Skills • Interests", "Knowledge • Goals"],
    desc: "Captures baseline competencies, domain interests, existing knowledge foundations, and aspirational career goals.",
    tags: ["Skills", "Interests", "Knowledge", "Goals"],
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    num: "02",
    stepNum: 2,
    title: "2. COMPETENCY ANALYSIS",
    shortTitle: "Competency Analysis",
    items: ["Identify strengths &", "competency gaps"],
    desc: "Benchmarks current proficiency against role requirements to objectively isolate strengths and critical skill deficits.",
    tags: ["Identify Strengths", "Competency Gaps"],
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    num: "03",
    stepNum: 3,
    title: "3. PERSONALIZED LEARNING PATH",
    shortTitle: "Personalized Learning Path",
    items: ["Courses • Resources", "Projects • Practice"],
    desc: "Curates sequenced roadmaps matching identified deficits with accredited course modules, reference resources, and practice labs.",
    tags: ["Courses", "Resources", "Projects", "Practice"],
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="3" />
        <path d="M9 19h8.5a4.5 4.5 0 0 0 0-9H7a4 4 0 0 1 0-8h11" />
        <circle cx="18" cy="5" r="3" />
      </svg>
    ),
  },
  {
    num: "04",
    stepNum: 4,
    title: "4. LEARN & PRACTICE",
    shortTitle: "Learn & Practice",
    items: ["Content • Quizzes", "Projects • Assessments"],
    desc: "Immersive learning through modular reading, zero-hallucination AI quizzes with citations, and hands-on applied projects.",
    tags: ["Content", "Quizzes", "Projects", "Assessments"],
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    num: "05",
    stepNum: 5,
    title: "5. RE-ASSESS",
    shortTitle: "Re-Assess",
    items: ["Measure improvement &", "newly acquired skills"],
    desc: "Post-learning adaptive evaluation rigorously verifies mastery gain, retention depth, and newly acquired competencies.",
    tags: ["Measure Improvement", "Newly Acquired Skills"],
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    num: "06",
    stepNum: 6,
    title: "6. UPDATE SKILL PROFILE",
    shortTitle: "Update Skill Profile",
    items: ["Skills ↑ • Gaps ↓", "Achievements updated"],
    desc: "Dynamic real-time profile recalibration: measured skills increase, identified gaps shrink, and verified milestones log.",
    tags: ["Skills ↑", "Gaps ↓", "Achievements Updated"],
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20v-6M6 20V10M18 20V4" />
        <path d="M18 4l-3 3M18 4l3 3" />
      </svg>
    ),
  },
  {
    num: "LOOP",
    stepNum: 7,
    title: "NEW GAP / GOAL DETECTED",
    shortTitle: "New Gap / Goal Detected",
    items: ["Role shifts • Emerging goals", "Continuous cycle recalibration"],
    desc: "New organizational roles, advancing project mandates, or higher career aspirations trigger the next cycle automatically.",
    tags: ["Role Shift", "New Mandate", "Recalibrate Cycle"],
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [quizTab, setQuizTab] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [pipelineView, setPipelineView] = useState<"circuit" | "vertical">("circuit");
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  return (
    <div
      style={{
        fontFamily: FONT.body,
        background: C.bg,
        color: C.dark,
        overflowX: "hidden",
      }}
    >
      {/* ── 1. STICKY NAVBAR ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#0E1813",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "0 4%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 96,
          backdropFilter: "blur(12px)",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 800,
            fontSize: 28,
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            gap: 14,
            cursor: "pointer",
            letterSpacing: "-0.02em",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/gyanmarg_logo.jpg"
            alt="GyanMarg AI Logo"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(198, 133, 27, 0.75)",
              boxShadow: "0 0 18px rgba(198, 133, 27, 0.45)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#FFFFFF" }}>GyanMarg</span>
            <span
              style={{
                color: C.accent,
                background: "rgba(198, 133, 27, 0.22)",
                border: "1.5px solid rgba(198, 133, 27, 0.5)",
                borderRadius: 8,
                padding: "2px 10px",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.04em",
                fontFamily: "'Unbounded', sans-serif",
              }}
            >
              AI
            </span>
          </div>
        </div>



        {/* Right buttons: Direct Module Access & Auth */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {/* Direct Student Portal button */}
          <button
            onClick={() => navigate("/student/dashboard")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 700,
              fontSize: 15.5,
              color: "#fff",
              background: "rgba(42, 79, 58, 0.7)",
              border: "1.5px solid rgba(110, 185, 155, 0.45)",
              borderRadius: 24,
              padding: "13px 26px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(42, 79, 58, 1)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(42, 79, 58, 0.7)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(110, 185, 155, 0.45)";
            }}
          >
            <span>{t("student_portal_btn")}</span>
          </button>

          {/* Direct Admin Portal button */}
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              fontFamily: language === "hi" ? "'Noto Sans Devanagari', 'Hind', sans-serif" : FONT.body,
              fontWeight: 700,
              fontSize: 15.5,
              color: "#fff",
              background: "rgba(36, 48, 70, 0.7)",
              border: "1.5px solid rgba(148, 180, 220, 0.45)",
              borderRadius: 24,
              padding: "13px 26px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(36, 48, 70, 1)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#94B4DC";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(36, 48, 70, 0.7)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(148, 180, 220, 0.45)";
            }}
          >
            <span>{t("admin_portal_btn")}</span>
          </button>

          <LanguageSelector variant="topbar" />

          <button
            onClick={() => navigate("/login")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 700,
              fontSize: 15.5,
              color: "#FFFFFF",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1.5px solid rgba(255, 255, 255, 0.24)",
              borderRadius: 24,
              padding: "13px 26px",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 255, 255, 0.08)";
            }}
          >
            {t("sign_in")}
          </button>
        </div>
      </nav>

      {/* ── 2. HERO SECTION ──────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "64px 5% 64px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 48,
          alignItems: "center",
          minHeight: "86vh",
        }}
      >
        {/* Left */}
        <div>
          {/* Kicker */}
          <div
            style={{
              fontFamily: language === "hi" ? "'Noto Sans Devanagari', 'Hind', sans-serif" : FONT.display,
              fontSize: 15,
              fontWeight: 700,
              color: C.accent,
              letterSpacing: "0.02em",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            {t("hero_kicker")}
          </div>

          {/* H1 — Dedicated flex lines with script-aware line-height to eliminate Devanagari matra collisions */}
          <h1
            style={{
              fontFamily: language === "hi"
                ? "'Noto Sans Devanagari', 'Hind', system-ui, sans-serif"
                : FONT.display,
              fontSize: language === "hi" ? "clamp(28px, 3.2vw, 46px)" : "clamp(34px, 3.8vw, 54px)",
              fontWeight: 800,
              lineHeight: language === "hi" ? 1.45 : 1.25,
              color: C.dark,
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
              gap: language === "hi" ? 10 : 4,
            }}
          >
            <span>{t("hero_h1_1")}</span>
            <span style={{ color: C.accent }}>{t("hero_h1_2")}</span>
            <span>{t("hero_h1_3")}</span>
          </h1>

          <p
            style={{
              fontFamily: language === "hi" ? "'Noto Sans Devanagari', 'Hind', sans-serif" : FONT.body,
              fontSize: 16,
              lineHeight: language === "hi" ? 1.85 : 1.65,
              color: C.muted,
              marginBottom: 32,
              maxWidth: 580,
            }}
          >
            {t("hero_desc")}
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/student/dashboard")}
              style={{
                fontFamily: language === "hi" ? "'Noto Sans Devanagari', 'Hind', sans-serif" : FONT.body,
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                background: C.accent,
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
                boxShadow: "0 4px 14px rgba(198,133,27,0.35)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = C.accentHov;
                el.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = C.accent;
                el.style.transform = "translateY(0)";
              }}
            >
              {t("cta_assessment")}
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("pipeline") || document.getElementById("how-it-works");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                fontFamily: language === "hi" ? "'Noto Sans Devanagari', 'Hind', sans-serif" : FONT.body,
                fontWeight: 600,
                fontSize: 15,
                color: C.dark,
                background: "transparent",
                border: `1.5px solid ${C.dark}`,
                borderRadius: 10,
                padding: "14px 28px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  C.dark + "0a")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "transparent")
              }
            >
              {t("cta_explore")}
            </button>
          </div>
        </div>

        {/* Right: Hero Illustration */}
        <div
          style={{
            width: "100%",
            maxWidth: 580,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <img
            src="/hero-illustration.png"
            alt="Students and Learners on GyanMarg AI"
            style={{
              width: "100%",
              maxWidth: 580,
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.08))",
              userSelect: "none",
            }}
          />
        </div>
      </section>

      {/* ── 3. STATS BAR ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.dark,
          padding: "36px 5%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{ textAlign: "center", padding: "0 12px" }}
          >
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 36,
                fontWeight: 800,
                color: C.accent,
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: FONT.body,
                fontSize: 13,
                color: "#9eb8a5",
                fontWeight: 500,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </section>



      {/* ── CYCLIC COMPETENCY WORKFLOW (BOX-SHAPED CLOSED-LOOP) ───────────── */}
      <section
        id="pipeline"
        style={{
          background: C.surface,
          padding: "80px 5%",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: 12,
                fontWeight: 700,
                color: C.accent,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Continuous Closed-Loop Methodology
            </p>
            <h2
              style={{
                fontFamily: FONT.display,
                fontSize: 36,
                fontWeight: 800,
                color: C.dark,
                marginBottom: 14,
                letterSpacing: "-0.02em",
              }}
            >
              The Cyclic Competency Workflow
            </h2>
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: 15.5,
                color: C.muted,
                maxWidth: 680,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              An adaptive, closed-loop cycle: from baseline profile assessment and competency analysis to personalized paths, targeted practice, re-assessment, and real-time skill evolution.
            </p>

            {/* View Mode Switcher Pills */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: C.surfaceAlt,
                border: `1.5px solid ${C.border}`,
                borderRadius: 12,
                padding: "4px",
                marginTop: 24,
                gap: 4,
              }}
            >
              <button
                onClick={() => setPipelineView("circuit")}
                style={{
                  border: "none",
                  background: pipelineView === "circuit" ? C.dark : "transparent",
                  color: pipelineView === "circuit" ? "#FFFFFF" : C.muted,
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: FONT.body,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                }}
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                Box Loop Circuit
              </button>
              <button
                onClick={() => setPipelineView("vertical")}
                style={{
                  border: "none",
                  background: pipelineView === "vertical" ? C.dark : "transparent",
                  color: pipelineView === "vertical" ? "#FFFFFF" : C.muted,
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: FONT.body,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                }}
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="12" y1="3" x2="12" y2="21" />
                  <polyline points="8 17 12 21 16 17" />
                  <polyline points="8 7 12 3 16 7" />
                </svg>
                Vertical Process Flow
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* VIEW 1: BOX LOOP CIRCUIT (3x3 Perimeter Box Layout)               */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {pipelineView === "circuit" && (
            <div
              style={{
                position: "relative",
                maxWidth: 1100,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "28px 24px",
                  alignItems: "stretch",
                }}
              >
                {/* ── STAGE 01 (Row 1, Col 1) ── */}
                <div
                  onMouseEnter={() => setHoveredStage(1)}
                  onMouseLeave={() => setHoveredStage(null)}
                  style={{
                    position: "relative",
                    background: C.bg,
                    border: `1.5px solid ${hoveredStage === 1 ? C.accent : C.border}`,
                    borderRadius: 14,
                    padding: "22px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: hoveredStage === 1 ? "0 8px 24px rgba(198, 133, 27, 0.18)" : "0 4px 14px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    transform: hoveredStage === 1 ? "translateY(-3px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: C.dark,
                        color: C.accent,
                        fontFamily: FONT.mono,
                        fontSize: 13,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      01
                    </div>
                    <div>
                      <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 800, color: C.dark, margin: 0, letterSpacing: "-0.01em" }}>
                        1. PROFILE &amp; ASSESS
                      </h4>
                      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.accent, fontWeight: 700 }}>
                        DIAGNOSTIC INGESTION
                      </div>
                    </div>
                  </div>

                  {/* Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Skills • Interests
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Knowledge • Goals
                    </span>
                  </div>

                  <p style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.muted, lineHeight: 1.5, margin: 0 }}>
                    Captures educational baseline, current competencies, career aspirations, and initial diagnostic test results.
                  </p>

                  {/* Arrow Right to Stage 02 */}
                  <div
                    style={{
                      position: "absolute",
                      right: -16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      zIndex: 3,
                      boxShadow: "0 2px 8px rgba(198, 133, 27, 0.45)",
                    }}
                  >
                    →
                  </div>
                </div>

                {/* ── STAGE 02 (Row 1, Col 2) ── */}
                <div
                  onMouseEnter={() => setHoveredStage(2)}
                  onMouseLeave={() => setHoveredStage(null)}
                  style={{
                    position: "relative",
                    background: C.bg,
                    border: `1.5px solid ${hoveredStage === 2 ? C.accent : C.border}`,
                    borderRadius: 14,
                    padding: "22px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: hoveredStage === 2 ? "0 8px 24px rgba(198, 133, 27, 0.18)" : "0 4px 14px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    transform: hoveredStage === 2 ? "translateY(-3px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: C.dark,
                        color: C.accent,
                        fontFamily: FONT.mono,
                        fontSize: 13,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      02
                    </div>
                    <div>
                      <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 800, color: C.dark, margin: 0, letterSpacing: "-0.01em" }}>
                        2. COMPETENCY ANALYSIS
                      </h4>
                      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.accent, fontWeight: 700 }}>
                        GAP QUANTIFICATION
                      </div>
                    </div>
                  </div>

                  {/* Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Identify strengths &amp;
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      competency gaps
                    </span>
                  </div>

                  <p style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.muted, lineHeight: 1.5, margin: 0 }}>
                    Benchmarks proficiency against structured role thresholds to detect exact strengths and delta deficits.
                  </p>

                  {/* Arrow Right to Stage 03 */}
                  <div
                    style={{
                      position: "absolute",
                      right: -16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      zIndex: 3,
                      boxShadow: "0 2px 8px rgba(198, 133, 27, 0.45)",
                    }}
                  >
                    →
                  </div>
                </div>

                {/* ── STAGE 03 (Row 1, Col 3) ── */}
                <div
                  onMouseEnter={() => setHoveredStage(3)}
                  onMouseLeave={() => setHoveredStage(null)}
                  style={{
                    position: "relative",
                    background: C.bg,
                    border: `1.5px solid ${hoveredStage === 3 ? C.accent : C.border}`,
                    borderRadius: 14,
                    padding: "22px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: hoveredStage === 3 ? "0 8px 24px rgba(198, 133, 27, 0.18)" : "0 4px 14px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    transform: hoveredStage === 3 ? "translateY(-3px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: C.dark,
                        color: C.accent,
                        fontFamily: FONT.mono,
                        fontSize: 13,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      03
                    </div>
                    <div>
                      <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 800, color: C.dark, margin: 0, letterSpacing: "-0.01em" }}>
                        3. PERSONALIZED LEARNING PATH
                      </h4>
                      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.accent, fontWeight: 700 }}>
                        CURRICULAR SEQUENCING
                      </div>
                    </div>
                  </div>

                  {/* Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Courses • Resources
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Projects • Practice
                    </span>
                  </div>

                  <p style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.muted, lineHeight: 1.5, margin: 0 }}>
                    Auto-generates an optimal sequence of verified courses, modular resources, and applied projects.
                  </p>

                  {/* Arrow Down to Stage 04 */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -18,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      zIndex: 3,
                      boxShadow: "0 2px 8px rgba(198, 133, 27, 0.45)",
                    }}
                  >
                    ↓
                  </div>
                </div>

                {/* ── LOOP RETURN CONDUIT (Row 2, Col 1) ── */}
                <div
                  style={{
                    position: "relative",
                    background: "linear-gradient(180deg, rgba(27,61,41,0.05) 0%, rgba(198,133,27,0.08) 100%)",
                    border: `1.5px dashed ${C.accent}`,
                    borderRadius: 14,
                    padding: "20px 22px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: 8,
                  }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(198, 133, 27, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
                    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT.display, fontSize: 13.5, fontWeight: 800, color: C.dark }}>
                      Continuous Recalibration Loop
                    </div>
                    <p style={{ fontFamily: FONT.body, fontSize: 11.5, color: C.muted, margin: "4px 0 0", lineHeight: 1.45 }}>
                      New gaps &amp; goals detected feed upward to continuously recalibrate Stage 01 user profiles.
                    </p>
                  </div>

                  {/* Arrow Up into Stage 01 */}
                  <div
                    style={{
                      position: "absolute",
                      top: -18,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      zIndex: 3,
                      boxShadow: "0 2px 8px rgba(198, 133, 27, 0.45)",
                    }}
                  >
                    ↑
                  </div>
                </div>

                {/* ── CENTER CLOSED-LOOP CORE HUB (Row 2, Col 2) ── */}
                <div
                  style={{
                    background: "#16281E",
                    border: `1.5px solid ${C.accent}60`,
                    borderRadius: 14,
                    padding: "24px 22px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "#fff",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 10px #4ADE80" }} />
                    <span style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.08em" }}>
                      ACTIVE ENGINE
                    </span>
                  </div>
                  <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
                    Closed-Loop Competency Core
                  </div>
                  <p style={{ fontFamily: FONT.body, fontSize: 12, color: "#A8C7B2", margin: 0, lineHeight: 1.5 }}>
                    Seamless perimeter feedback: Profile ➔ Diagnose ➔ Learn ➔ Re-Assess ➔ Recalibrate.
                  </p>
                  <div
                    style={{
                      marginTop: 14,
                      padding: "6px 14px",
                      background: "rgba(198, 133, 27, 0.15)",
                      border: `1px solid ${C.accent}40`,
                      borderRadius: 8,
                      fontSize: 11.5,
                      fontFamily: FONT.mono,
                      color: "#FFE8B8",
                      fontWeight: 700,
                    }}
                  >
                    Zero Breakpoint Feedback Cycle
                  </div>
                </div>

                {/* ── STAGE 04 (Row 2, Col 3) ── */}
                <div
                  onMouseEnter={() => setHoveredStage(4)}
                  onMouseLeave={() => setHoveredStage(null)}
                  style={{
                    position: "relative",
                    background: C.bg,
                    border: `1.5px solid ${hoveredStage === 4 ? C.accent : C.border}`,
                    borderRadius: 14,
                    padding: "22px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: hoveredStage === 4 ? "0 8px 24px rgba(198, 133, 27, 0.18)" : "0 4px 14px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    transform: hoveredStage === 4 ? "translateY(-3px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: C.dark,
                        color: C.accent,
                        fontFamily: FONT.mono,
                        fontSize: 13,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      04
                    </div>
                    <div>
                      <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 800, color: C.dark, margin: 0, letterSpacing: "-0.01em" }}>
                        4. LEARN &amp; PRACTICE
                      </h4>
                      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.accent, fontWeight: 700 }}>
                        APPLIED MASTERY
                      </div>
                    </div>
                  </div>

                  {/* Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Content • Quizzes
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Projects • Assessments
                    </span>
                  </div>

                  <p style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.muted, lineHeight: 1.5, margin: 0 }}>
                    Study verified materials, take source-cited RAG quizzes, and complete real-world statistical projects.
                  </p>

                  {/* Arrow Down to Stage 05 */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -18,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      zIndex: 3,
                      boxShadow: "0 2px 8px rgba(198, 133, 27, 0.45)",
                    }}
                  >
                    ↓
                  </div>
                </div>

                {/* ── STAGE 07 / RE-TRIGGER (Row 3, Col 1) ── */}
                <div
                  onMouseEnter={() => setHoveredStage(7)}
                  onMouseLeave={() => setHoveredStage(null)}
                  style={{
                    position: "relative",
                    background: "#FAF4E8",
                    border: `1.5px solid ${hoveredStage === 7 ? C.dark : C.accent}`,
                    borderRadius: 14,
                    padding: "22px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: hoveredStage === 7 ? "0 8px 24px rgba(198, 133, 27, 0.25)" : "0 4px 14px rgba(198, 133, 27, 0.12)",
                    transition: "all 0.25s ease",
                    transform: hoveredStage === 7 ? "translateY(-3px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: C.accent,
                        color: "#FFFFFF",
                        fontFamily: FONT.mono,
                        fontSize: 11,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      LOOP
                    </div>
                    <div>
                      <h4 style={{ fontFamily: FONT.display, fontSize: 14.5, fontWeight: 800, color: C.dark, margin: 0, letterSpacing: "-0.01em" }}>
                        NEW GAP / GOAL DETECTED
                      </h4>
                      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.accentHov, fontWeight: 700 }}>
                        TRIGGER RECALIBRATION
                      </div>
                    </div>
                  </div>

                  {/* Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(198, 133, 27, 0.15)", padding: "4px 9px", borderRadius: 6 }}>
                      Role Shifts • Emerging Goals
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(198, 133, 27, 0.15)", padding: "4px 9px", borderRadius: 6 }}>
                      Continuous Cycle Restart
                    </span>
                  </div>

                  <p style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.muted, lineHeight: 1.5, margin: 0 }}>
                    Detects emerging organizational requirements or career ambition shifts to restart the cycle at Stage 01.
                  </p>

                  {/* Arrow Up into Return Conduit */}
                  <div
                    style={{
                      position: "absolute",
                      top: -18,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      zIndex: 3,
                      boxShadow: "0 2px 8px rgba(198, 133, 27, 0.45)",
                    }}
                  >
                    ↑
                  </div>
                </div>

                {/* ── STAGE 06 (Row 3, Col 2) ── */}
                <div
                  onMouseEnter={() => setHoveredStage(6)}
                  onMouseLeave={() => setHoveredStage(null)}
                  style={{
                    position: "relative",
                    background: C.bg,
                    border: `1.5px solid ${hoveredStage === 6 ? C.accent : C.border}`,
                    borderRadius: 14,
                    padding: "22px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: hoveredStage === 6 ? "0 8px 24px rgba(198, 133, 27, 0.18)" : "0 4px 14px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    transform: hoveredStage === 6 ? "translateY(-3px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: C.dark,
                        color: C.accent,
                        fontFamily: FONT.mono,
                        fontSize: 13,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      06
                    </div>
                    <div>
                      <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 800, color: C.dark, margin: 0, letterSpacing: "-0.01em" }}>
                        6. UPDATE SKILL PROFILE
                      </h4>
                      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.accent, fontWeight: 700 }}>
                        REAL-TIME HEALTH RECALIBRATION
                      </div>
                    </div>
                  </div>

                  {/* Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Skills ↑ • Gaps ↓
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Achievements updated
                    </span>
                  </div>

                  <p style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.muted, lineHeight: 1.5, margin: 0 }}>
                    Dynamically boosts skill health metrics, shrinks measured gap deficit, and commits validated badges.
                  </p>

                  {/* Arrow Left to New Gap Detected */}
                  <div
                    style={{
                      position: "absolute",
                      left: -16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      zIndex: 3,
                      boxShadow: "0 2px 8px rgba(198, 133, 27, 0.45)",
                    }}
                  >
                    ←
                  </div>
                </div>

                {/* ── STAGE 05 (Row 3, Col 3) ── */}
                <div
                  onMouseEnter={() => setHoveredStage(5)}
                  onMouseLeave={() => setHoveredStage(null)}
                  style={{
                    position: "relative",
                    background: C.bg,
                    border: `1.5px solid ${hoveredStage === 5 ? C.accent : C.border}`,
                    borderRadius: 14,
                    padding: "22px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: hoveredStage === 5 ? "0 8px 24px rgba(198, 133, 27, 0.18)" : "0 4px 14px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    transform: hoveredStage === 5 ? "translateY(-3px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: C.dark,
                        color: C.accent,
                        fontFamily: FONT.mono,
                        fontSize: 13,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      05
                    </div>
                    <div>
                      <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 800, color: C.dark, margin: 0, letterSpacing: "-0.01em" }}>
                        5. RE-ASSESS
                      </h4>
                      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.accent, fontWeight: 700 }}>
                        MASTERY VERIFICATION
                      </div>
                    </div>
                  </div>

                  {/* Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      Measure improvement &amp;
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT.body, color: C.dark, background: "rgba(27,61,41,0.08)", padding: "4px 9px", borderRadius: 6 }}>
                      newly acquired skills
                    </span>
                  </div>

                  <p style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.muted, lineHeight: 1.5, margin: 0 }}>
                    Administers post-training evaluation to quantitatively verify proficiency delta and knowledge retention.
                  </p>

                  {/* Arrow Left to Stage 06 */}
                  <div
                    style={{
                      position: "absolute",
                      left: -16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      zIndex: 3,
                      boxShadow: "0 2px 8px rgba(198, 133, 27, 0.45)",
                    }}
                  >
                    ←
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* VIEW 2: VERTICAL PROCESS FLOW (Box Cards with Loop Return Bus)     */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {pipelineView === "vertical" && (
            <div
              style={{
                position: "relative",
                maxWidth: 820,
                margin: "0 auto",
                paddingRight: 60,
              }}
            >
              {/* Sequential Stack of Box Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
                {cyclicStages.map((stage, idx) => {
                  const isLast = idx === cyclicStages.length - 1;
                  const isHovered = hoveredStage === stage.stepNum;

                  return (
                    <div key={stage.num} style={{ position: "relative" }}>
                      {/* Box Card */}
                      <div
                        onMouseEnter={() => setHoveredStage(stage.stepNum)}
                        onMouseLeave={() => setHoveredStage(null)}
                        style={{
                          background: stage.stepNum === 7 ? "#FAF4E8" : C.bg,
                          border: `1.5px solid ${isHovered ? C.accent : stage.stepNum === 7 ? C.accent : C.border}`,
                          borderRadius: 14,
                          padding: "20px 24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 20,
                          boxShadow: isHovered
                            ? "0 8px 24px rgba(198, 133, 27, 0.2)"
                            : "0 4px 14px rgba(0,0,0,0.04)",
                          transition: "all 0.25s ease",
                          transform: isHovered ? "translateY(-2px)" : "none",
                        }}
                      >
                        {/* Left: Number badge + titles */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              background: stage.stepNum === 7 ? C.accent : C.dark,
                              color: stage.stepNum === 7 ? "#FFFFFF" : C.accent,
                              fontFamily: FONT.mono,
                              fontSize: 13,
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          >
                            {stage.num}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                              <h4
                                style={{
                                  fontFamily: FONT.display,
                                  fontSize: 16,
                                  fontWeight: 800,
                                  color: C.dark,
                                  margin: 0,
                                  letterSpacing: "-0.01em",
                                }}
                              >
                                {stage.title}
                              </h4>
                            </div>

                            {/* Tags list */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                              {stage.items.map((item, itemIdx) => (
                                <span
                                  key={itemIdx}
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    fontFamily: FONT.body,
                                    color: C.dark,
                                    background: stage.stepNum === 7 ? "rgba(198,133,27,0.15)" : "rgba(27,61,41,0.08)",
                                    padding: "3px 10px",
                                    borderRadius: 6,
                                  }}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>

                            <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted, margin: "8px 0 0", lineHeight: 1.5 }}>
                              {stage.desc}
                            </p>
                          </div>
                        </div>

                        {/* Right: Icon */}
                        <div
                          style={{
                            color: stage.stepNum === 7 ? C.accent : C.dark,
                            opacity: 0.7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {stage.icon}
                        </div>
                      </div>

                      {/* Down Connector between boxes */}
                      {!isLast && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 38,
                            position: "relative",
                          }}
                        >
                          {/* Vertical Connector Line */}
                          <div
                            style={{
                              width: 2,
                              height: "100%",
                              background: C.accent,
                              opacity: 0.6,
                            }}
                          />
                          {/* Down Arrow Badge */}
                          <div
                            style={{
                              position: "absolute",
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              background: C.accent,
                              color: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 800,
                              boxShadow: "0 2px 6px rgba(198, 133, 27, 0.4)",
                            }}
                          >
                            ↓
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Loopback Conduit line (Right-hand circuit going up into Box 1) */}
              <div
                style={{
                  position: "absolute",
                  right: 10,
                  top: 36,
                  bottom: 36,
                  width: 36,
                  borderRight: `2px dashed ${C.accent}`,
                  borderBottom: `2px dashed ${C.accent}`,
                  borderTop: `2px dashed ${C.accent}`,
                  borderRadius: "0 16px 16px 0",
                  pointerEvents: "none",
                }}
              >
                {/* Arrow pointing left into Box 1 */}
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: -14,
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: C.accent,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    boxShadow: "0 2px 6px rgba(198, 133, 27, 0.4)",
                  }}
                >
                  ←
                </div>

                {/* Label on the vertical return bus */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: -95,
                    transform: "translateY(-50%) rotate(90deg)",
                    fontFamily: FONT.mono,
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: C.accent,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    background: C.surface,
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  Loop Recalibration
                </div>
              </div>
            </div>
          )}

          {/* Bottom Operational Summary Bar */}
          <div
            style={{
              marginTop: 48,
              background: C.surfaceAlt,
              border: `1.5px solid ${C.border}`,
              borderRadius: 14,
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: C.dark,
                  color: C.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: FONT.display, fontSize: 14.5, fontWeight: 800, color: C.dark }}>
                  Dynamic Closed-Loop Recalibration Engine
                </div>
                <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted }}>
                  Every quiz completed, module finished, or new career milestone achieved automatically updates the learner profile and shrinks target gaps.
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/login")}
              style={{
                background: C.accent,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontFamily: FONT.body,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(198, 133, 27, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Experience The Workflow
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ──────────────────────────────────────────────── */}
      <section
        style={{
          background: C.surface,
          padding: "80px 5%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 12,
              fontWeight: 700,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Simple Process
          </p>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 38,
              fontWeight: 800,
              color: C.dark,
              marginBottom: 16,
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 17,
              color: C.muted,
              maxWidth: 540,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            A structured four-stage intelligence workflow transforming course literature and diagnostic benchmarks into verified skill mastery.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
            position: "relative",
          }}
        >
          {/* Connector line */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: "12.5%",
              right: "12.5%",
              height: 2,
              background: `linear-gradient(to right, ${C.dark}, ${C.accent}, ${C.dark}, ${C.accent})`,
              zIndex: 0,
              opacity: 0.3,
            }}
          />

          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "32px 24px",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: step.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: `0 8px 24px ${step.accent}40`,
                }}
              >
                {step.icon}
              </div>

              <div
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 11,
                  fontWeight: 700,
                  color: step.accent,
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                STEP {step.num}
              </div>
              <h3
                style={{
                  fontFamily: FONT.display,
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.dark,
                  marginBottom: 10,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: FONT.body,
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. QUIZ GENERATOR ────────────────────────────────────────────── */}
      <section
        style={{
          background: C.dark,
          padding: "80px 5%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        {/* Left text */}
        <div>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 12,
              fontWeight: 700,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            AI Quiz Generator
          </p>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 38,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 20,
              lineHeight: 1.15,
            }}
          >
            Ingest Curricular Materials.
            <br />
            <span style={{ color: C.accent }}>Generate Verified Diagnostic Assessments.</span>
          </h2>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 16,
              color: "#9eb8a5",
              lineHeight: 1.7,
              marginBottom: 32,
            }}
          >
            Transform syllabus documents, textbooks, academic research papers, or technical guidelines into verified diagnostic questions with precise page-level citations.
          </p>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: 36 }}>
            {[
              "Ingests course PDFs, textbooks, syllabi, and lecture materials up to 25MB",
              "Multimodal engine extracts core analytical concepts, formulas, and definitions",
              "Deterministic page and section citations embedded directly into every question",
              "Diagnostic responses instantly sync to recalculate learner competency baselines",
            ].map((point) => (
              <li
                key={point}
                style={{
                  fontFamily: FONT.body,
                  fontSize: 15,
                  color: "#c5d9cb",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <span style={{ color: C.accent, fontWeight: 700, fontSize: 16 }}>•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/student/assessment")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 700,
              fontSize: 15,
              color: C.dark,
              background: C.accent,
              border: "none",
              borderRadius: 10,
              padding: "14px 28px",
              cursor: "pointer",
            }}
          >
            Try Quiz Generator →
          </button>
        </div>

        {/* Right: Tabbed card */}
        <div
          style={{
            background: C.sidebarBg,
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid #ffffff10`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              background: C.dark,
              padding: "4px",
              margin: "16px 16px 0",
              borderRadius: 10,
            }}
          >
            {["Upload", "Preview Questions", "Results"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setQuizTab(i)}
                style={{
                  flex: 1,
                  fontFamily: FONT.body,
                  fontWeight: 600,
                  fontSize: 13,
                  color: quizTab === i ? C.dark : "#7a9e88",
                  background: quizTab === i ? C.accent : "transparent",
                  border: "none",
                  borderRadius: 7,
                  padding: "8px 0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: 20 }}>
            {/* Tab 0: Upload */}
            {quizTab === 0 && (
              <div>
                <div
                  style={{
                    border: `2px dashed ${C.accent}55`,
                    borderRadius: 12,
                    padding: "32px 20px",
                    textAlign: "center",
                    marginBottom: 20,
                    background: C.accent + "08",
                  }}
                >
                  <div style={{ width: 44, height: 44, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 24 24" width={36} height={36} fill="none" stroke={C.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 14,
                      color: C.faint,
                      marginBottom: 4,
                    }}
                  >
                    Drop your textbook, PDF, or syllabus document here
                  </p>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 12,
                      color: "#55785e",
                    }}
                  >
                    PDF, DOCX, PPTX — up to 25MB
                  </p>
                </div>

                {[
                  { label: "Material Uploaded: Applied Statistics Handbook.pdf", done: true },
                  { label: "Extracting Statistical Formulas & Principles", done: true },
                  { label: "Synthesizing Questions with Source Citations", done: true },
                  { label: "Citation Verification & Standard Alignment", done: true },
                  { label: "Ready for Practice & Competency Assessment", done: true },
                ].map((step) => (
                  <div
                    key={step.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.s1 }} />
                    <span
                      style={{
                        fontFamily: FONT.body,
                        fontSize: 13,
                        color: step.done ? "#c5d9cb" : "#55785e",
                        flex: 1,
                      }}
                    >
                      {step.label}
                    </span>
                    {step.done && (
                      <span
                        style={{
                          fontFamily: FONT.mono,
                          fontSize: 11,
                          color: C.s1,
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 1: Preview Question */}
            {quizTab === 1 && (
              <div>
                <div
                  style={{
                    background: C.dark,
                    borderRadius: 10,
                    padding: "14px 16px",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <p
                      style={{
                        fontFamily: FONT.body,
                        fontSize: 11,
                        color: C.accent,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      QUESTION 1 OF 12 · APPLIED STATISTICS
                    </p>
                    <span
                      style={{
                        background: "rgba(110, 185, 155, 0.2)",
                        border: "1px solid rgba(110, 185, 155, 0.4)",
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontSize: 10,
                        color: "#a0d4b0",
                        fontFamily: FONT.mono,
                      }}
                    >
                      Source: Statistics Handbook, p. 42
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 14,
                      color: "#e0ece3",
                      lineHeight: 1.5,
                    }}
                  >
                    {quizQuestion.q}
                  </p>
                </div>

                {quizQuestion.options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedOption(i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background:
                        selectedOption === i
                          ? i === quizQuestion.correct
                            ? C.s1 + "30"
                            : C.s4 + "30"
                          : "#ffffff08",
                      border: `1px solid ${
                        selectedOption === i
                          ? i === quizQuestion.correct
                            ? C.s1
                            : C.s4
                          : "#ffffff15"
                      }`,
                      borderRadius: 8,
                      padding: "10px 14px",
                      cursor: "pointer",
                      marginBottom: 8,
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background:
                          selectedOption === i
                            ? i === quizQuestion.correct
                              ? C.s1
                              : C.s4
                            : "#ffffff20",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: FONT.mono,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT.body,
                        fontSize: 13,
                        color: "#c5d9cb",
                      }}
                    >
                      {opt}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Tab 2: Results */}
            {quizTab === 2 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 48,
                      fontWeight: 800,
                      color: C.accent,
                      lineHeight: 1,
                    }}
                  >
                    78%
                  </div>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 13,
                      color: "#7a9e88",
                    }}
                  >
                    Overall Score · 10 of 12 Correct
                  </p>
                </div>

                {quizResults.map((r) => (
                  <div key={r.domain} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT.body,
                          fontSize: 13,
                          color: "#c5d9cb",
                        }}
                      >
                        {r.domain}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT.mono,
                          fontSize: 13,
                          color: C.accent,
                          fontWeight: 700,
                        }}
                      >
                        {r.score}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "#ffffff10",
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${r.score}%`,
                          background:
                            r.score >= 80
                              ? C.s1
                              : r.score >= 60
                              ? C.accent
                              : C.s4,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    background: C.s1 + "20",
                    border: `1px solid ${C.s1}40`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginTop: 16,
                  }}
                >
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 13,
                      color: "#a0d4b0",
                      fontWeight: 600,
                    }}
                  >
                    Diagnostic Competency Recommendation
                  </p>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 12,
                      color: "#7a9e88",
                      marginTop: 4,
                    }}
                  >
                    Strong sampling fundamentals. To close your machine learning gap, we recommend the 16-hour "Applied Statistical Inference &amp; Modeling" course.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 7. CURATED COMPETENCY COURSES ───────────────────────── */}
      <section
        id="courses"
        style={{
          background: C.surface,
          padding: "80px 5%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        {/* Left: Course Cards Grid */}
        <div>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 12,
              fontWeight: 700,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Curated Competency Courses
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {curatedCourses.map((course) => (
              <div
                key={course.title}
                onClick={() => navigate("/student/courses")}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "18px 16px",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <span
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.dark,
                    background: C.dark + "15",
                    borderRadius: 4,
                    padding: "3px 8px",
                    display: "inline-block",
                    marginBottom: 10,
                  }}
                >
                  {course.dept}
                </span>
                <h4
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 15,
                    fontWeight: 700,
                    color: C.dark,
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  {course.title}
                </h4>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <span
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 11,
                      color: C.muted,
                      background: C.border + "80",
                      borderRadius: 4,
                      padding: "2px 8px",
                    }}
                  >
                    {course.hours}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 11,
                      color: C.muted,
                      background: C.border + "80",
                      borderRadius: 4,
                      padding: "2px 8px",
                    }}
                  >
                    {course.level}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.accent,
                  }}
                >
                  Explore Module →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Text */}
        <div>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 36,
              fontWeight: 800,
              color: C.dark,
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            Personalized Learning Pathways,
            <br />
            <span style={{ color: C.accent }}>Mapped to Accredited Curricula</span>
          </h2>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 16,
              color: C.muted,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            The platform bridges diagnosed competency deficits with verified modular courseware aligned with structured skill benchmarks and academic standards. Learner progression dynamically updates proficiency scores.
          </p>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: 36 }}>
            {[
              "Modular access for university students, researchers, and professional upskillers",
              "Automated synchronization updating your multi-axis competency profile in real time",
              "Algorithmic filtering prioritizing modules that target your highest-severity skill gaps",
              "Verifiable competency credentials authenticated against domain proficiency benchmarks",
            ].map((point) => (
              <li
                key={point}
                style={{
                  fontFamily: FONT.body,
                  fontSize: 15,
                  color: C.muted,
                  marginBottom: 14,
                  paddingLeft: 4,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <span style={{ color: C.accent, fontWeight: 700 }}>✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/student/courses")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 700,
              fontSize: 15,
              color: "#fff",
              background: C.dark,
              border: "none",
              borderRadius: 10,
              padding: "14px 28px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#132318")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = C.dark)}
          >
            Explore All Courses →
          </button>
        </div>
      </section>

      {/* ── 8. DUAL STAKEHOLDER PORTALS (STUDENT & ADMIN) ────────────────── */}
      <section
        id="portals"
        style={{
          background: C.bg,
          padding: "80px 5%",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.dark + "12",
              border: `1px solid ${C.dark}25`,
              borderRadius: 20,
              padding: "4px 14px",
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Dual Architecture
            </span>
          </div>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 38,
              fontWeight: 800,
              color: C.dark,
              marginBottom: 12,
            }}
          >
            Specialized Modules for Learners and Administrators
          </h2>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 17,
              color: C.muted,
              maxWidth: 680,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            GyanMarg AI is built with dedicated interfaces tailored to both sides of the learning ecosystem — empowers individual learners to upskill while giving institutions total governance.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {/* Student Portal Card */}
          <div
            style={{
              background: "#132419",
              borderRadius: 20,
              padding: "40px 36px",
              color: "#fff",
              border: "1.5px solid rgba(198, 133, 27, 0.4)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(198, 133, 27, 0.15)", border: "1px solid rgba(198, 133, 27, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: FONT.display,
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 6,
                }}
              >
                Student / Learner Module
              </h3>
              <p
                style={{
                  fontFamily: FONT.body,
                  fontSize: 14,
                  color: C.accent,
                  fontWeight: 600,
                  marginBottom: 20,
                }}
              >
                For Students, University Scholars, Aspirants &amp; Upskillers
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
                {[
                  "Interactive Competency Radar & diagnostic assessment",
                  "Personalized, milestone-driven learning roadmaps",
                  "AI Practice Quizzes with instant source page citations",
                  "24/7 Contextual AI Study Mentor tutor",
                  "Dynamic skill health tracking & verifiable badges",
                ].map((point) => (
                  <li
                    key={point}
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 14,
                      color: "#b4d8bf",
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ color: C.accent, fontWeight: 700 }}>✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => navigate("/student/dashboard")}
                style={{
                  flex: 1,
                  fontFamily: FONT.body,
                  fontWeight: 700,
                  fontSize: 14,
                  color: C.dark,
                  background: C.accent,
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 20px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = C.accentHov)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = C.accent)}
              >
                Enter Student Portal →
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  fontFamily: FONT.body,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#fff",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)")}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Admin Portal Card */}
          <div
            style={{
              background: "#1A2533",
              border: `1.5px solid rgba(148, 180, 220, 0.4)`,
              borderRadius: 20,
              padding: "40px 36px",
              color: "#fff",
              boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(148, 180, 220, 0.15)", border: "1px solid rgba(148, 180, 220, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#94B4DC" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2z" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: FONT.display,
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 6,
                }}
              >
                Admin &amp; Faculty Module
              </h3>
              <p
                style={{
                  fontFamily: FONT.body,
                  fontSize: 14,
                  color: "#94B4DC",
                  fontWeight: 600,
                  marginBottom: 20,
                }}
              >
                For Educators, Department Heads &amp; Institutional Leaders
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
                {[
                  "Macro Competency Heatmaps & regional skill distribution",
                  "Predictive talent shortage detection in emerging tech",
                  "Student & Cohort Management with progress drill-downs",
                  "Human-in-the-loop AI Quiz Review & Authoring Studio",
                  "Empirical course effectiveness & training ROI analytics",
                ].map((point) => (
                  <li
                    key={point}
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 14,
                      color: "#C5D8ED",
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ color: "#94B4DC", fontWeight: 700 }}>✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => navigate("/admin/dashboard")}
                style={{
                  flex: 1,
                  fontFamily: FONT.body,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#fff",
                  background: "#2D4263",
                  border: "1px solid rgba(148, 180, 220, 0.5)",
                  borderRadius: 10,
                  padding: "14px 20px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#3D5884")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#2D4263")}
              >
                Enter Admin Portal →
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{
                  fontFamily: FONT.body,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#fff",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. PLATFORM ARCHITECTURE PILLARS ─────────────────────────────── */}
      <section
        style={{
          background: C.surface,
          padding: "80px 5%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 12,
              fontWeight: 700,
              color: C.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Core Architecture &amp; Methodology
          </p>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 38,
              fontWeight: 800,
              color: C.dark,
              marginBottom: 14,
            }}
          >
            Built for Authentic Competency Mastery
          </h2>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 16,
              color: C.muted,
              maxWidth: 680,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            GyanMarg AI is engineered to eliminate guesswork in learning through structured diagnostics, verifiable source grounding, and continuous closed-loop feedback.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {platformPillars.map((p) => (
            <div
              key={p.title}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: 12,
                      fontWeight: 800,
                      color: p.accent,
                      background: p.accent + "18",
                      border: `1px solid ${p.accent}33`,
                      borderRadius: 6,
                      padding: "3px 10px",
                    }}
                  >
                    {p.num} · {p.tag}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 20,
                    fontWeight: 700,
                    color: C.dark,
                    marginBottom: 14,
                    lineHeight: 1.35,
                  }}
                >
                  {p.title}
                </h3>

                <p
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 14,
                    color: C.muted,
                    lineHeight: 1.7,
                    marginBottom: 24,
                  }}
                >
                  {p.desc}
                </p>
              </div>

              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {p.points.map((pt) => (
                  <div
                    key={pt}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 13,
                      fontFamily: FONT.body,
                      color: C.dark,
                      lineHeight: 1.4,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: p.accent,
                        flexShrink: 0,
                      }}
                    />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. CTA BANNER ───────────────────────────────────────────────── */}
      <section
        style={{
          background: C.accent,
          padding: "80px 5%",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: FONT.display,
            fontSize: 42,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 18,
            lineHeight: 1.15,
          }}
        >
          Ready to Accelerate Your
          <br />
          Learning Journey?
        </h2>
        <p
          style={{
            fontFamily: FONT.body,
            fontSize: 18,
            color: "#fff",
            opacity: 0.88,
            maxWidth: 580,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Accelerate your core competencies with objective diagnostics, verifiable citation-backed quizzes, and personalized learning roadmaps.
        </p>

        <div
          style={{ display: "flex", gap: 16, justifyContent: "center" }}
        >
          <button
            onClick={() => navigate("/student/dashboard")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 700,
              fontSize: 16,
              color: C.accent,
              background: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "16px 32px",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
            }
          >
            Launch Student Portal →
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 600,
              fontSize: 16,
              color: "#fff",
              background: "transparent",
              border: "2px solid #ffffff80",
              borderRadius: 10,
              padding: "16px 32px",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.borderColor = "#fff")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.borderColor =
                "#ffffff80")
            }
          >
            Launch Admin Console →
          </button>
        </div>
      </section>

      {/* ── 11. FOOTER ───────────────────────────────────────────────────── */}
      <footer
        style={{
          background: C.dark,
          padding: "60px 5% 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: FONT.display,
                fontWeight: 800,
                fontSize: 22,
                color: "#fff",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <img
                src="/gyanmarg_logo.jpg"
                alt="GyanMarg AI Logo"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1.5px solid rgba(198, 133, 27, 0.6)",
                }}
              />
              <span>
                GyanMarg <span style={{ color: C.accent }}>AI</span>
              </span>
            </div>
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: 14,
                color: "#7a9e88",
                lineHeight: 1.7,
                marginBottom: 20,
                maxWidth: 290,
              }}
            >
              An intelligent competency diagnostic and adaptive learning platform for students, researchers, and professional learners. Identifies skill deficits, generates source-cited practice assessments, and accelerates mastery through personalized learning pathways.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 12 }}>
              {["𝕏", "in", "▶", "✉"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#ffffff15",
                    border: "1px solid #ffffff20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT.body,
                    fontSize: 13,
                    color: "#7a9e88",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.background =
                      C.accent + "30")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.background =
                      "#ffffff15")
                  }
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            {
              title: "Learner Portal",
              links: [
                "Diagnostic Baseline",
                "Competency Radar",
                "Personalized Roadmap",
                "RAG Quiz Generator",
                "AI Study Mentor",
              ],
            },
            {
              title: "Admin Console",
              links: [
                "Institutional Dashboard",
                "Cohort Heatmaps",
                "Student Directory",
                "Quiz Review Studio",
                "Curriculum Analytics",
              ],
            },
            {
              title: "Key Capabilities",
              links: [
                "Diagnostic Baseline Engine",
                "Skill Gap Quantification",
                "Source-Cited RAG Quizzes",
                "Dynamic Roadmap Sequencing",
                "Cohort Mastery Analytics",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily: FONT.display,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 18,
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 10 }}>
                    <a
                      href="#"
                      style={{
                        fontFamily: FONT.body,
                        fontSize: 14,
                        color: "#7a9e88",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLAnchorElement).style.color = "#fff")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLAnchorElement).style.color = "#7a9e88")
                      }
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid #ffffff15`,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 13,
              color: "#55785e",
            }}
          >
            © 2026 GyanMarg AI. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Use", "Accessibility", "Documentation"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 13,
                    color: "#55785e",
                    textDecoration: "none",
                  }}
                >
                  {link}
                </a>
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-component: Feature Card ───────────────────────────────────────────────
function FeatureCard({
  feature,
}: {
  feature: {
    icon?: React.ReactNode;
    emoji?: string;
    title: string;
    desc: string;
    tag: string;
  };
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "28px 24px",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 40px rgba(27,61,41,0.12)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: C.dark + "10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {feature.icon || feature.emoji}
        </div>
        <span
          style={{
            fontFamily: FONT.body,
            fontSize: 10,
            fontWeight: 700,
            color: C.accent,
            background: C.accent + "15",
            border: `1px solid ${C.accent}30`,
            borderRadius: 4,
            padding: "3px 8px",
            letterSpacing: "0.06em",
          }}
        >
          {feature.tag}
        </span>
      </div>
      <h3
        style={{
          fontFamily: FONT.display,
          fontSize: 18,
          fontWeight: 700,
          color: C.dark,
          marginBottom: 10,
        }}
      >
        {feature.title}
      </h3>
      <p
        style={{
          fontFamily: FONT.body,
          fontSize: 14,
          color: C.muted,
          lineHeight: 1.65,
        }}
      >
        {feature.desc}
      </p>
    </div>
  );
}
