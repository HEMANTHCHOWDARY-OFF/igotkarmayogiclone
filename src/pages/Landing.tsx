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
  { value: "12,840+", label: "Civil Servants Trained" },
  { value: "450+", label: "Courses Mapped to iGOT" },
  { value: "94%", label: "Completion Rate" },
  { value: "3,200+", label: "Skill Assessments" },
  { value: "28", label: "Departments Onboarded" },
];

// ── Steps ────────────────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    emoji: "📋",
    title: "Take Assessment",
    desc: "Complete our AI-powered competency assessment tailored to your role and department.",
    accent: C.dark,
  },
  {
    num: "02",
    emoji: "🧠",
    title: "AI Gap Analysis",
    desc: "Our AI identifies your skill gaps by comparing your results against role benchmarks.",
    accent: C.accent,
  },
  {
    num: "03",
    emoji: "🗺️",
    title: "Get Learning Path",
    desc: "Receive a personalized, iGOT-mapped learning path curated for your specific gaps.",
    accent: C.dark,
  },
  {
    num: "04",
    emoji: "📈",
    title: "Learn & Track",
    desc: "Complete courses, track your progress, and watch your competency scores grow over time.",
    accent: C.accent,
  },
];

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    emoji: "🧠",
    title: "AI Competency Assessment",
    desc: "Role-specific assessments powered by AI that map directly to the iGOT Karmayogi competency framework.",
    tag: "Core AI",
  },
  {
    emoji: "🗺️",
    title: "Personalized Learning Paths",
    desc: "Curated learning journeys tailored to your identified gaps, department, and career goals.",
    tag: "Personalization",
  },
  {
    emoji: "📝",
    title: "Smart Quiz Generation",
    desc: "Upload any document and instantly generate MCQs, fill-in-the-blanks, and scenario-based questions.",
    tag: "AI Tools",
  },
  {
    emoji: "🤖",
    title: "AI Learning Assistant",
    desc: "Chat with an AI tutor trained on government policies, frameworks, and best practices 24/7.",
    tag: "AI Tools",
  },
  {
    emoji: "📊",
    title: "Progress Dashboards",
    desc: "Real-time analytics on competency growth, course completion, and department-wide training insights.",
    tag: "Analytics",
  },
  {
    emoji: "🔗",
    title: "iGOT Integration",
    desc: "Seamlessly sync your learning progress with the iGOT Karmayogi platform for unified tracking.",
    tag: "Integration",
  },
];

// ── iGOT Courses ─────────────────────────────────────────────────────────────
const igotCourses = [
  {
    dept: "Ministry of Personnel",
    title: "Ethics in Governance",
    hours: "8 hrs",
    level: "Foundation",
  },
  {
    dept: "DOPT",
    title: "Data Analytics for Officers",
    hours: "12 hrs",
    level: "Intermediate",
  },
  {
    dept: "MeitY",
    title: "Digital Transformation",
    hours: "6 hrs",
    level: "Foundation",
  },
  {
    dept: "Ministry of Finance",
    title: "Financial Management",
    hours: "10 hrs",
    level: "Advanced",
  },
];

// ── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "Karmayogi Shiksha AI identified my skill gaps in digital governance within minutes. The personalized path helped me complete 4 iGOT courses in just 6 weeks.",
    name: "Priya Sharma",
    role: "Deputy Secretary, DOPT",
    initials: "PS",
    color: C.s1,
  },
  {
    quote:
      "The AI quiz generator saved our training team 40+ hours per month. We now produce high-quality assessments for every new policy circular automatically.",
    name: "Rajesh Kumar",
    role: "Director, NIC Training Cell",
    initials: "RK",
    color: C.accent,
  },
  {
    quote:
      "As a district collector, I needed targeted upskilling. The platform's iGOT integration means my learning counts toward official training records seamlessly.",
    name: "Anita Verma",
    role: "District Collector, Maharashtra",
    initials: "AV",
    color: C.s3,
  },
];

// ── Quiz data ─────────────────────────────────────────────────────────────────
const quizQuestion = {
  q: "Under the Right to Information Act, 2005, within how many days must a Public Information Officer respond to an application?",
  options: [
    "15 days",
    "30 days",
    "45 days",
    "60 days",
  ],
  correct: 1,
};

const quizResults = [
  { domain: "Constitutional Law", score: 88 },
  { domain: "RTI & Transparency", score: 72 },
  { domain: "Public Finance", score: 61 },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
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
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
          padding: "0 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 18,
            color: C.dark,
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <span style={{ color: C.dark }}>Karmayogi Shiksha</span>
          <span
            style={{
              color: C.accent,
              background: C.accent + "18",
              borderRadius: 6,
              padding: "1px 6px",
            }}
          >
            AI
          </span>
        </div>

        {/* Center links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Features", "Learning Path", "Resources", "iGOT Integration", "About Us"].map(
            (link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: FONT.body,
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.muted,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = C.dark)
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = C.muted)
                }
              >
                {link}
              </a>
            )
          )}
        </div>

        {/* Right buttons */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 600,
              fontSize: 14,
              color: C.dark,
              background: "transparent",
              border: `1.5px solid ${C.dark}`,
              borderRadius: 24,
              padding: "8px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = C.dark;
              (e.currentTarget as HTMLButtonElement).style.color = C.surface;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = C.dark;
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              fontFamily: FONT.body,
              fontWeight: 600,
              fontSize: 14,
              color: "#fff",
              background: C.accent,
              border: "none",
              borderRadius: 24,
              padding: "8px 20px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                C.accentHov)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                C.accent)
            }
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── 2. HERO SECTION ──────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "80px 5% 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
          minHeight: "90vh",
        }}
      >
        {/* Left */}
        <div>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.dark + "12",
              border: `1px solid ${C.dark}30`,
              borderRadius: 24,
              padding: "6px 16px",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 16 }}>🇮🇳</span>
            <span
              style={{
                fontFamily: FONT.body,
                fontSize: 13,
                fontWeight: 600,
                color: C.dark,
              }}
            >
              National Capacity Building Platform
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: FONT.display,
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: C.dark,
              marginBottom: 24,
            }}
          >
            Identify Your Gaps.
            <br />
            <span style={{ color: C.accent }}>Build Your Skills.</span>
            <br />
            Serve Better.
          </h1>

          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 17,
              lineHeight: 1.7,
              color: C.muted,
              marginBottom: 36,
              maxWidth: 500,
            }}
          >
            India's first AI-powered learning intelligence platform for civil servants.
            Assess competencies, identify gaps, and grow through personalized iGOT-mapped
            learning paths — all in one place.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                fontFamily: FONT.body,
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                background: C.accent,
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  C.accentHov)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  C.accent)
              }
            >
              Start Free Assessment →
            </button>
            <button
              style={{
                fontFamily: FONT.body,
                fontWeight: 600,
                fontSize: 15,
                color: C.dark,
                background: "transparent",
                border: `1.5px solid ${C.dark}`,
                borderRadius: 10,
                padding: "14px 28px",
                cursor: "pointer",
              }}
            >
              Explore Platform
            </button>
          </div>

          {/* Trust strip */}
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 20,
            }}
          >
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: 12,
                fontWeight: 600,
                color: C.faint,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Integrated &amp; Trusted By
            </p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["iGOT Karmayogi", "DOPT", "NIC", "MeitY", "DoPT"].map((org) => (
                <span
                  key={org}
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.muted,
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    padding: "4px 12px",
                  }}
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Platform Preview Card */}
        <div
          style={{
            background: C.sidebarBg,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
            border: `1px solid #ffffff10`,
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: C.dark,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT.display,
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
              }}
            >
              Your Competency Profile
            </span>
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: 10,
                fontWeight: 700,
                color: C.accent,
                background: C.accent + "22",
                border: `1px solid ${C.accent}44`,
                borderRadius: 4,
                padding: "3px 8px",
                letterSpacing: "0.06em",
              }}
            >
              AI ANALYSIS COMPLETE
            </span>
          </div>

          <div style={{ padding: "16px 20px 20px" }}>
            {/* Radar Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#ffffff15" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: C.faint,
                    fontSize: 11,
                    fontFamily: FONT.body,
                  }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke={C.accent}
                  fill={C.accent}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Gap Bars */}
            <div style={{ marginTop: 8, marginBottom: 16 }}>
              <p
                style={{
                  fontFamily: FONT.body,
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.s4,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                🔴 Gap Detected
              </p>
              {gapBars.map((bar) => (
                <div key={bar.label} style={{ marginBottom: 8 }}>
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
                        fontSize: 12,
                        color: "#ccc",
                      }}
                    >
                      {bar.label}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: 12,
                        color: C.s4,
                        fontWeight: 700,
                      }}
                    >
                      {bar.value}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "#ffffff15",
                      borderRadius: 3,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${bar.value}%`,
                        background: C.s4,
                        borderRadius: 3,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Chart */}
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: 11,
                fontWeight: 700,
                color: C.faint,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              6-Week Progress
            </p>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.s1} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={C.s1} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff08" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: C.faint, fontSize: 10, fontFamily: FONT.body }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide domain={[30, 90]} />
                <Tooltip
                  contentStyle={{
                    background: C.sidebarBg,
                    border: `1px solid ${C.border}40`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: FONT.body,
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={C.s1}
                  strokeWidth={2}
                  fill="url(#progressGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* AI Recommends */}
            <div
              style={{
                marginTop: 14,
                padding: 12,
                background: C.bg + "22",
                borderRadius: 10,
                border: `1px solid #ffffff10`,
              }}
            >
              <p
                style={{
                  fontFamily: FONT.body,
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.accent,
                  marginBottom: 8,
                }}
              >
                🤖 AI Recommends Next
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  "Digital Governance Basics",
                  "RTI Act Deep Dive",
                ].map((course) => (
                  <span
                    key={course}
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 11,
                      fontWeight: 500,
                      color: C.dark,
                      background: C.bg,
                      borderRadius: 6,
                      padding: "4px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
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

      {/* ── 5. CORE FEATURES ─────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "80px 5%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
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
            Platform Capabilities
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
            Core Features
          </h2>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 17,
              color: C.muted,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Everything you need for modern civil servant capacity building,
            powered by cutting-edge AI.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {features.map((f) => (
            <FeatureCard key={f.title} feature={f} />
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
            Upload. Generate.
            <br />
            <span style={{ color: C.accent }}>Learn.</span>
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
            Transform any government circular, policy document, or training material
            into rich, exam-ready questions in seconds.
          </p>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: 36 }}>
            {[
              "📄 Upload PDFs, Word docs, or paste text",
              "🧠 AI extracts key concepts & generates MCQs",
              "✏️ Edit, reorder, and customize questions",
              "📤 Export as PDF, share via iGOT, or use in assessments",
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
                    Drop your document here
                  </p>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 12,
                      color: "#55785e",
                    }}
                  >
                    PDF, DOCX, TXT — up to 20MB
                  </p>
                </div>

                {[
                  { icon: "📥", label: "Document Uploaded", done: true },
                  { icon: "🔍", label: "Extracting Text & Concepts", done: true },
                  { icon: "🧠", label: "Generating Questions with AI", done: true },
                  { icon: "✅", label: "Reviewing & Formatting", done: false },
                  { icon: "📤", label: "Ready to Export", done: false },
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
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 11,
                      color: C.accent,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    QUESTION 1 OF 12 · RTI Act, 2005
                  </p>
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
                    74%
                  </div>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 13,
                      color: "#7a9e88",
                    }}
                  >
                    Overall Score · 9 of 12 Correct
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
                    🤖 AI Recommendation
                  </p>
                  <p
                    style={{
                      fontFamily: FONT.body,
                      fontSize: 12,
                      color: "#7a9e88",
                      marginTop: 4,
                    }}
                  >
                    Focus on RTI & Transparency. We recommend "RTI Act Mastery"
                    on iGOT — 4hr course.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 7. iGOT INTEGRATION ──────────────────────────────────────────── */}
      <section
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
            iGOT Karmayogi Courses
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
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "18px 16px",
                  transition: "box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.1)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")
                }
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
                <a
                  href="#"
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.accent,
                    textDecoration: "none",
                  }}
                >
                  Enroll →
                </a>
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
            Your Learning Path,
            <br />
            <span style={{ color: C.accent }}>Mapped to iGOT</span>
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
            We bridge the gap between your skill gaps and the 450+ courses available
            on iGOT Karmayogi. Your progress syncs automatically.
          </p>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: 36 }}>
            {[
              "🔗 Seamless single sign-on with iGOT credentials",
              "📊 Progress syncs to your official iGOT profile",
              "🎯 AI filters 450+ courses to your top 5 gaps",
              "🏆 Completion certificates recognized by DOPT",
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
            }}
          >
            Explore iGOT Courses →
          </button>
        </div>
      </section>

      {/* ── 8. FOR EVERY ROLE ────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "80px 5%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 38,
              fontWeight: 800,
              color: C.dark,
              marginBottom: 12,
            }}
          >
            For Every Role
          </h2>
          <p
            style={{
              fontFamily: FONT.body,
              fontSize: 17,
              color: C.muted,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Whether you are a civil servant or a training administrator,
            Karmayogi Shiksha AI adapts to your needs.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {/* Civil Servants */}
          <div
            style={{
              background: C.dark,
              borderRadius: 20,
              padding: "40px 36px",
              color: "#fff",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 16 }}>👤</div>
            <h3
              style={{
                fontFamily: FONT.display,
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 20,
              }}
            >
              Civil Servants
            </h3>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
              {[
                "Discover your competency gaps instantly",
                "Get a personalized, iGOT-linked learning path",
                "Practice with AI-generated quizzes",
                "Chat with an AI learning assistant anytime",
                "Track your growth with visual dashboards",
              ].map((point) => (
                <li
                  key={point}
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 14,
                    color: "#a0c8b0",
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
            <button
              onClick={() => navigate("/register")}
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
                width: "100%",
              }}
            >
              Start Your Journey →
            </button>
          </div>

          {/* Training Administrators */}
          <div
            style={{
              background: C.surface,
              border: `1.5px solid ${C.border}`,
              borderRadius: 20,
              padding: "40px 36px",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 16 }}>🏛️</div>
            <h3
              style={{
                fontFamily: FONT.display,
                fontSize: 24,
                fontWeight: 800,
                color: C.dark,
                marginBottom: 20,
              }}
            >
              Training Administrators
            </h3>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
              {[
                "Monitor department-wide training progress",
                "Bulk generate assessments for your team",
                "Get AI insights on skill gaps by role",
                "Export compliance reports for DOPT",
                "Manage learner journeys from one dashboard",
              ].map((point) => (
                <li
                  key={point}
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 14,
                    color: C.muted,
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <span style={{ color: C.s1, fontWeight: 700 }}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/admin/dashboard")}
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
                width: "100%",
              }}
            >
              Admin Dashboard →
            </button>
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
            Trusted by Civil Servants
          </p>
          <h2
            style={{
              fontFamily: FONT.display,
              fontSize: 38,
              fontWeight: 800,
              color: C.dark,
            }}
          >
            What Officers Are Saying
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
          Ready to Transform Your
          <br />
          Learning Journey?
        </h2>
        <p
          style={{
            fontFamily: FONT.body,
            fontSize: 18,
            color: "#fff",
            opacity: 0.88,
            maxWidth: 520,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Join 12,840+ civil servants already building their competencies
          with AI-powered, iGOT-integrated learning.
        </p>

        <div
          style={{ display: "flex", gap: 16, justifyContent: "center" }}
        >
          <button
            onClick={() => navigate("/register")}
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
            Start Free Assessment →
          </button>
          <button
            onClick={() => navigate("/register")}
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
            Schedule a Demo
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
                fontSize: 18,
                color: "#fff",
                marginBottom: 14,
              }}
            >
              Karmayogi Shiksha{" "}
              <span style={{ color: C.accent }}>AI</span>
            </div>
            <p
              style={{
                fontFamily: FONT.body,
                fontSize: 14,
                color: "#7a9e88",
                lineHeight: 1.7,
                marginBottom: 20,
                maxWidth: 280,
              }}
            >
              India's national AI-powered learning platform for civil servants,
              integrated with iGOT Karmayogi for seamless capacity building.
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
              title: "Platform",
              links: [
                "Competency Assessment",
                "AI Learning Paths",
                "Quiz Generator",
                "Progress Analytics",
                "AI Assistant",
              ],
            },
            {
              title: "Resources",
              links: [
                "Documentation",
                "API Reference",
                "Case Studies",
                "Blog",
                "Webinars",
              ],
            },
            {
              title: "Government",
              links: [
                "iGOT Karmayogi",
                "DOPT",
                "NIC",
                "MeitY",
                "Ministry of Personnel",
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
            © 2026 Karmayogi Shiksha AI. Government of India initiative. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Use", "Accessibility", "RTI"].map(
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
