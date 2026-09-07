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
  { value: "12,840+", label: "Active Learners & Students" },
  { value: "450+", label: "Curated & Mapped Courses" },
  { value: "94%", label: "Completion & Success Rate" },
  { value: "3,200+", label: "Diagnostic AI Assessments" },
  { value: "28+", label: "Academic & Tech Tracks" },
];

// ── Steps ────────────────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    emoji: "📋",
    title: "Diagnostic Assessment",
    desc: "Complete an adaptive competency diagnostic tailored to your academic field, target role, or career specialization.",
    accent: C.dark,
  },
  {
    num: "02",
    emoji: "🧠",
    title: "AI Gap Quantification",
    desc: "Our AI computes precise skill gaps across Domain, Functional, and Analytical competencies using FrAC standards.",
    accent: C.accent,
  },
  {
    num: "03",
    emoji: "🗺️",
    title: "Personalized Roadmap",
    desc: "Receive an auto-sequenced learning path linking iGOT Karmayogi, NSSTA, and foundational industry modules.",
    accent: C.dark,
  },
  {
    num: "04",
    emoji: "📈",
    title: "Practice & Master",
    desc: "Practice with AI quizzes cited directly from study materials, and watch your skill score dynamically climb.",
    accent: C.accent,
  },
];

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    emoji: "🧠",
    title: "FrAC Competency Diagnostic",
    desc: "Standardized assessments evaluating Domain, Functional, and Behavioral skills tailored to your career track.",
    tag: "Core AI",
  },
  {
    emoji: "🗺️",
    title: "Adaptive Learning Pathways",
    desc: "Curated learning journeys automatically sequenced to close your top critical gaps with zero wasted time.",
    tag: "Personalization",
  },
  {
    emoji: "📝",
    title: "RAG Quiz Generator with Citations",
    desc: "Upload textbooks, research papers, or manuals to generate verified MCQs with exact page citations.",
    tag: "Zero-Hallucination",
  },
  {
    emoji: "🤖",
    title: "24/7 AI Conversational Mentor",
    desc: "Instant explanations, formula breakdowns, and contextual academic guidance from your AI study tutor.",
    tag: "AI Tutor",
  },
  {
    emoji: "📊",
    title: "Dual Stakeholder Dashboards",
    desc: "Personalized radar analytics for learners alongside macro cohort heatmaps for educators and administrators.",
    tag: "Analytics",
  },
  {
    emoji: "🔗",
    title: "iGOT & Open Learning Sync",
    desc: "Seamlessly map courses to the national iGOT Karmayogi catalogue and verified competency standards.",
    tag: "Integration",
  },
];

// ── Curated Courses Mapped to Competency Tracks ─────────────────────────────
const igotCourses = [
  {
    dept: "Data Science & AI",
    title: "Python for Data Analysis & Modeling",
    hours: "12 hrs",
    level: "Foundation",
  },
  {
    dept: "MoSPI & NSSTA",
    title: "Applied Statistical Inference & Sampling",
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
    dept: "Public Policy & Ethics",
    title: "Evidence-Based Policy & Digital Governance",
    hours: "8 hrs",
    level: "Advanced",
  },
];

// ── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "GyanMarg AI pinpointed my exact weak points in Applied Statistics and Python within 15 minutes. The personalized pathway guided me through focused courses and significantly boosted my placement test scores.",
    name: "Aakash Verma",
    role: "Computer Science & Data Scholar, NIT",
    initials: "AV",
    color: C.s1,
  },
  {
    quote:
      "The zero-hallucination quiz generator is game-changing. I uploaded my 120-page macroeconomics syllabus and got exam-ready MCQs with exact page citations. It cut my revision time in half.",
    name: "Sneha Mukherjee",
    role: "Public Policy & Economics Aspirant",
    initials: "SM",
    color: C.accent,
  },
  {
    quote:
      "As an institutional coordinator, the macro competency heatmap gives me instant clarity on cohort skill distributions. We can identify talent shortages and assign remedial modules effortlessly.",
    name: "Dr. K. Ramanathan",
    role: "Dean of Academic Training & Capacity",
    initials: "KR",
    color: C.s3,
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

// ─────────────────────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [quizTab, setQuizTab] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

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
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Direct Student Portal button */}
          <button
            onClick={() => navigate("/student/dashboard")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 700,
              fontSize: 13,
              color: "#fff",
              background: "rgba(42, 79, 58, 0.7)",
              border: "1px solid rgba(110, 185, 155, 0.4)",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(42, 79, 58, 1)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(42, 79, 58, 0.7)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(110, 185, 155, 0.4)";
            }}
          >
            <span>🎓</span>
            <span>{t("student_portal_btn")}</span>
          </button>

          {/* Direct Admin Portal button */}
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              fontFamily: language === "hi" ? "'Noto Sans Devanagari', 'Hind', sans-serif" : FONT.body,
              fontWeight: 700,
              fontSize: 13,
              color: "#fff",
              background: "rgba(36, 48, 70, 0.7)",
              border: "1px solid rgba(148, 180, 220, 0.4)",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(36, 48, 70, 1)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#94B4DC";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(36, 48, 70, 0.7)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(148, 180, 220, 0.4)";
            }}
          >
            <span>🏛️</span>
            <span>{t("admin_portal_btn")}</span>
          </button>

          <LanguageSelector variant="topbar" />

          <button
            onClick={() => navigate("/login")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 600,
              fontSize: 14,
              color: "#FFFFFF",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1.5px solid rgba(255, 255, 255, 0.24)",
              borderRadius: 20,
              padding: "8px 18px",
              cursor: "pointer",
              transition: "all 0.2s",
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
          {/* Introductory Eyebrow & Value Proposition at the starting */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "linear-gradient(135deg, rgba(198, 133, 27, 0.14) 0%, rgba(27, 61, 41, 0.08) 100%)",
                border: "1px solid rgba(198, 133, 27, 0.38)",
                borderRadius: 24,
                padding: "7px 18px",
                marginBottom: 10,
                boxShadow: "0 2px 10px rgba(198, 133, 27, 0.08)",
              }}
            >
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.accent, boxShadow: `0 0 10px ${C.accent}` }} />
              <span
                style={{
                  fontFamily: language === "hi" ? "'Noto Sans Devanagari', 'Hind', sans-serif" : FONT.body,
                  fontSize: 12,
                  fontWeight: 800,
                  color: C.dark,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {t("hero_badge")}
              </span>
            </div>
            <div
              style={{
                fontFamily: language === "hi" ? "'Noto Sans Devanagari', 'Hind', sans-serif" : FONT.display,
                fontSize: 14,
                fontWeight: 700,
                color: C.accent,
                letterSpacing: "0.02em",
                lineHeight: 1.5,
              }}
            >
              {t("hero_kicker")}
            </div>
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
              marginBottom: 20,
              maxWidth: 580,
            }}
          >
            {t("hero_desc")}
          </p>

          {/* Core Pillars Highlight Pills at the starting */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            {[
              { icon: "🎯", label: t("hero_pill_frac") },
              { icon: "📖", label: t("hero_pill_quizzes") },
              { icon: "🗺️", label: t("hero_pill_roadmaps") },
              { icon: "📊", label: t("hero_pill_matrix") },
            ].map((pill) => (
              <span
                key={pill.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: language === "hi" ? "'Noto Sans Devanagari', 'Hind', sans-serif" : FONT.body,
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.dark,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: "5px 13px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
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

          {/* Trust strip */}
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 16,
            }}
          >
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: 11,
                fontWeight: 700,
                color: C.faint,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Aligned Frameworks &amp; Ecosystem Partners
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["MoSPI DIID", "NSSTA Academy", "iGOT Karmayogi", "FrAC Competency Model", "Digital India"].map((org) => (
                <span
                  key={org}
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.muted,
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    padding: "3px 10px",
                  }}
                >
                  {org}
                </span>
              ))}
            </div>
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



      {/* ── 7-STAGE PIPELINE (From Documentation) ─────────────────────────── */}
      <section
        id="pipeline"
        style={{
          background: C.surface,
          padding: "80px 5%",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
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
              End-to-End Functional Architecture
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
              The 7-Stage Competency Intelligence Pipeline
            </h2>
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: 16,
                color: C.muted,
                maxWidth: 640,
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              How our system processes learner profiles, diagnoses gaps, maps courses, and verifies mastery.
            </p>
          </div>

          {/* Boxed Loop Container with Perimeter Flow & Arrows */}
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
                style={{
                  position: "relative",
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "22px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                }}
              >
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
                  <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                    User &amp; Role Profile
                  </h4>
                  <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                    Captures academic track, current skills, educational baseline, and target career aspirations.
                  </p>
                </div>
                {/* Arrow Right to 02 */}
                <div
                  style={{
                    position: "absolute",
                    right: -16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
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
                style={{
                  position: "relative",
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "22px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                }}
              >
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
                  <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                    Diagnostic Assessment
                  </h4>
                  <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                    Administers adaptive diagnostic testing across core technical and functional domain areas.
                  </p>
                </div>
                {/* Arrow Right to 03 */}
                <div
                  style={{
                    position: "absolute",
                    right: -16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
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
                style={{
                  position: "relative",
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "22px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                }}
              >
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
                  <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                    AI Gap Quantification
                  </h4>
                  <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                    Computes multi-axis variance between current proficiency and benchmark role thresholds.
                  </p>
                </div>
                {/* Arrow Down to 04 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
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

              {/* ── LOOP RETURN CHANNEL (Row 2, Col 1) ── */}
              <div
                style={{
                  position: "relative",
                  background: "linear-gradient(180deg, rgba(27,61,41,0.06) 0%, rgba(198,133,27,0.08) 100%)",
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
                <div>
                  <div style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, color: C.dark }}>
                    Continuous Loop Return
                  </div>
                  <p style={{ fontFamily: FONT.body, fontSize: 11.5, color: C.muted, margin: 0, lineHeight: 1.4 }}>
                    Stage 07 growth feed immediately recalibrates Stage 01 user profiles.
                  </p>
                </div>
                {/* Arrow Up into 01 */}
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
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

              {/* ── CENTER CLOSED-LOOP CORE (Row 2, Col 2) ── */}
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
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 6 }}>🔄</div>
                <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                  Closed-Loop Competency Core
                </div>
                <p style={{ fontFamily: FONT.body, fontSize: 12, color: "#A8C7B2", margin: 0, lineHeight: 1.5 }}>
                  Continuous cycle: learning, diagnosing, matching, testing, and real-time gap closing.
                </p>
              </div>

              {/* ── STAGE 04 (Row 2, Col 3) ── */}
              <div
                style={{
                  position: "relative",
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "22px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                }}
              >
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
                  <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                    Vector Course Matching
                  </h4>
                  <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                    Uses semantic embeddings to match identified gaps with iGOT Karmayogi and NSSTA courses.
                  </p>
                </div>
                {/* Arrow Down to 05 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
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

              {/* ── STAGE 07 (Row 3, Col 1) ── */}
              <div
                style={{
                  position: "relative",
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "22px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                }}
              >
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
                  07
                </div>
                <div>
                  <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                    Dynamic Growth Analytics
                  </h4>
                  <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                    Updates learner skill health in real time while feeding institutional macro heatmaps.
                  </p>
                </div>
                {/* Arrow Up into Loop Return Channel */}
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
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
                style={{
                  position: "relative",
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "22px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                }}
              >
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
                  <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                    AI Assessment &amp; Practice
                  </h4>
                  <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                    Ingests study materials and generates verified quizzes with page-specific source citations.
                  </p>
                </div>
                {/* Arrow Left to 07 */}
                <div
                  style={{
                    position: "absolute",
                    left: -16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
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
                style={{
                  position: "relative",
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "22px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                }}
              >
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
                  <h4 style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                    Personalized Roadmap
                  </h4>
                  <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                    Generates an auto-sequenced milestone pathway curated to resolve critical deficits first.
                  </p>
                </div>
                {/* Arrow Left to 06 */}
                <div
                  style={{
                    position: "absolute",
                    left: -16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
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
            From assessment to mastery in four guided steps — fully powered by AI.
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
                  fontSize: 28,
                  boxShadow: `0 8px 24px ${step.accent}40`,
                }}
              >
                {step.emoji}
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
            Upload Any Material.
            <br />
            <span style={{ color: C.accent }}>Generate Instant Quizzes.</span>
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
            Transform any textbook chapter, syllabus PDF, lecture notes, or research manual
            into rich, exam-ready questions with verified source citations in seconds.
          </p>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: 36 }}>
            {[
              "📄 Upload study PDFs, Word docs, textbooks, or lecture notes",
              "🧠 Multimodal AI extracts core concepts, formulas & definitions",
              "📍 Zero-hallucination page & section citations on every question",
              "📤 Practice instantly, export as PDF, or sync to your skill profile",
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
                {point}
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
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📄</div>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 14,
                      color: C.faint,
                      marginBottom: 4,
                    }}
                  >
                    Drop your textbook, PDF, or notes here
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
                  { icon: "📥", label: "Material Uploaded (MoSPI Sampling Handbook.pdf)", done: true },
                  { icon: "🔍", label: "Extracting Statistical Formulas & Concepts", done: true },
                  { icon: "🧠", label: "Generating Questions with Page Citations", done: true },
                  { icon: "✅", label: "Reviewing & Verifying Citations", done: true },
                  { icon: "📤", label: "Ready for Practice & Assessment", done: true },
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
                    <span style={{ fontSize: 16 }}>{step.icon}</span>
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
                      📍 Cited: MoSPI Handbook p. 42
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
                    🤖 AI Competency Recommendation
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

      {/* ── 7. CURATED COURSES & IGOT INTEGRATION ───────────────────────── */}
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
            {igotCourses.map((course) => (
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
                    ⏱ {course.hours}
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
            <span style={{ color: C.accent }}>Mapped to National Standards</span>
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
            We bridge the gap between your diagnostic skill deficits and high-yield courseware across iGOT Karmayogi, NSSTA Academy, and industry standard curricula. Your progress syncs dynamically.
          </p>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: 36 }}>
            {[
              "🔗 Open access for students, researchers, upskillers, and professionals",
              "📊 Automatic synchronization updating your dynamic competency profile",
              "🎯 AI filters 450+ courses down to your top 5 critical gaps",
              "🏆 Verifiable completion certificates recognized across institutions",
            ].map((point) => (
              <li
                key={point}
                style={{
                  fontFamily: FONT.body,
                  fontSize: 15,
                  color: C.muted,
                  marginBottom: 14,
                  paddingLeft: 4,
                }}
              >
                {point}
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
              Dual Stakeholder Architecture
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
            Choose Your Portal: Student &amp; Admin Modules
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
              <div style={{ fontSize: 40, marginBottom: 14 }}>🎓</div>
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
              <div style={{ fontSize: 40, marginBottom: 14 }}>🏛️</div>
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

      {/* ── 9. TESTIMONIALS ──────────────────────────────────────────────── */}
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
            Trusted by Learners, Students &amp; Academic Leaders
          </p>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 38,
              fontWeight: 800,
              color: C.dark,
            }}
          >
            What Our Community Says
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "32px 28px",
                position: "relative",
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  fontFamily: FONT.display,
                  fontSize: 80,
                  color: C.accent,
                  opacity: 0.25,
                  lineHeight: 0.7,
                  marginBottom: 16,
                  fontWeight: 900,
                }}
              >
                "
              </div>

              <p
                style={{
                  fontFamily: FONT.body,
                  fontSize: 15,
                  color: C.muted,
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  marginBottom: 24,
                }}
              >
                "{t.quote}"
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: t.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT.display,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.dark,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 12,
                      color: C.faint,
                    }}
                  >
                    {t.role}
                  </div>
                </div>
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
          Join 12,840+ students, professionals, and institutions accelerating their competencies with AI-driven, citation-backed learning.
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
              India's national AI-powered competency intelligence and adaptive learning platform for all learners, students, and institutions. Built for Smart India Hackathon (SIH26101) with MoSPI DIID and iGOT Karmayogi ecosystem alignment.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 12 }}>
              {["𝕏", "in", "▶", "📧"].map((icon, i) => (
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
              title: "Frameworks & Standards",
              links: [
                "MoSPI DIID (SIH26101)",
                "iGOT Karmayogi",
                "NSSTA Training Academy",
                "FrAC Competency Model",
                "Digital India Standards",
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
            © 2026 GyanMarg AI. Built for Smart India Hackathon (SIH26101). All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Use", "Accessibility", "FrAC Standards"].map(
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
    emoji: string;
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
            fontSize: 26,
          }}
        >
          {feature.emoji}
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
