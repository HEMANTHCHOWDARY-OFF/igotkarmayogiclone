import { useNavigate } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { C, FONT } from "@/tokens";

const domainScores = [
  { domain: "Digital", short: "Digital", score: 45 },
  { domain: "Ethics", short: "Ethics", score: 90 },
  { domain: "Leadership", short: "Lead.", score: 75 },
  { domain: "Policy", short: "Policy", score: 80 },
  { domain: "Technical", short: "Tech.", score: 60 },
  { domain: "Domain Knowledge", short: "Domain", score: 85 },
];

const wrongAnswers = [
  {
    id: 1,
    domain: "Digital",
    question: "Which of the following is a feature of India's DigiLocker?",
    yourAnswer: "Physical document archive",
    correctAnswer: "Cloud storage for personal documents",
    explanation:
      "DigiLocker is a cloud-based platform under the Digital India initiative that provides citizens with a secure cloud storage space for storing and sharing official documents issued by government agencies.",
  },
  {
    id: 2,
    domain: "Technical",
    question: "Which Indian IT Act section deals with electronic signatures?",
    yourAnswer: "Section 43",
    correctAnswer: "Section 5",
    explanation:
      "Section 5 of the Information Technology Act, 2000 gives legal recognition to electronic signatures, making them equivalent to handwritten signatures for the purposes of authentication.",
  },
];

function domainColor(score: number) {
  if (score >= 80) return C.s1;
  if (score >= 60) return C.s2;
  return C.s4;
}

const card: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: "20px 24px",
};

export default function AssessmentResults() {
  const navigate = useNavigate();
  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    { label: "Score", value: "76 / 100", color: C.s2 },
    { label: "Questions Correct", value: "8 / 10", color: C.s1 },
    { label: "Time Taken", value: "14:32", color: C.s3 },
    { label: "Rank", value: "Top 23%", color: C.dark },
  ];

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Success hero */}
      <div
        style={{
          ...card,
          display: "flex",
          alignItems: "center",
          gap: 32,
          marginBottom: 24,
          background: C.dark,
          border: "none",
        }}
      >
        {/* Score circle */}
        <div
          style={{
            position: "relative",
            width: 110,
            height: 110,
            flexShrink: 0,
          }}
        >
          <svg
            width="110"
            height="110"
            viewBox="0 0 110 110"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="55"
              cy="55"
              r="46"
              fill="none"
              stroke={C.s1 + "44"}
              strokeWidth="8"
            />
            <circle
              cx="55"
              cy="55"
              r="46"
              fill="none"
              stroke={C.s1}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 46}`}
              strokeDashoffset={`${2 * Math.PI * 46 * (1 - 0.76)}`}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT.display,
                fontSize: 24,
                fontWeight: 800,
                color: C.accent,
              }}
            >
              76%
            </span>
          </div>
        </div>

        {/* Text */}
        <div>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 4,
            }}
          >
            Assessment Complete! 🎉
          </div>
          <div style={{ fontSize: 13, color: C.faint, marginBottom: 8 }}>
            {date}
          </div>
          <div style={{ fontSize: 13.5, color: "#D4E8D8", lineHeight: 1.6 }}>
            You performed well overall. Focus on <strong style={{ color: C.accent }}>Digital</strong> and{" "}
            <strong style={{ color: C.accent }}>Technical</strong> domains to boost your score.
          </div>
        </div>
      </div>

      {/* 4 stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ ...card, textAlign: "center" }}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 26,
                fontWeight: 800,
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: C.faint, marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column: domain breakdown + insights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Domain breakdown */}
        <div style={card}>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            Domain Breakdown
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={domainScores}
              margin={{ top: 0, right: 8, left: -24, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis
                dataKey="short"
                tick={{ fontSize: 11, fill: C.faint }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: C.faint }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontFamily: FONT.body,
                  fontSize: 12,
                }}
                formatter={(v) => [`${v}%`, "Score"]}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {domainScores.map((d) => (
                  <Cell key={d.domain} fill={domainColor(d.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "≥ 80% Strong", color: C.s1 },
              { label: "60–79% Moderate", color: C.s2 },
              { label: "< 60% Needs Work", color: C.s4 },
            ].map((l) => (
              <div
                key={l.label}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: l.color,
                  }}
                />
                <span style={{ fontSize: 11, color: C.faint }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Score rows */}
          <div
            style={{
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {domainScores.map((d) => (
              <div
                key={d.domain}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ width: 110, fontSize: 12, color: C.muted }}>
                  {d.domain}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 5,
                    background: C.border,
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${d.score}%`,
                      background: domainColor(d.score),
                      borderRadius: 99,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 34,
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: 600,
                    color: domainColor(d.score),
                  }}
                >
                  {d.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What this means + CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={card}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              What This Means For You
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  icon: "⚠️",
                  text: "Your Digital domain score (45%) is significantly below threshold. Prioritise e-Governance fundamentals, DigiLocker, and UMANG platform modules immediately.",
                  color: C.s4,
                },
                {
                  icon: "🔧",
                  text: "Technical competency (60%) needs attention — revisit the IT Act provisions and electronic records framework for stronger foundational knowledge.",
                  color: C.s2,
                },
                {
                  icon: "✅",
                  text: "Excellent performance in Ethics (90%) and Domain Knowledge (85%) — your grounding in constitutional provisions and public service values is strong.",
                  color: C.s1,
                },
              ].map((ins, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 14px",
                    background: ins.color + "0F",
                    borderRadius: 10,
                    borderLeft: `3px solid ${ins.color}`,
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>
                    {ins.icon}
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      color: C.dark,
                    }}
                  >
                    {ins.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <button
              onClick={() => navigate("/student/gap-analysis")}
              style={{
                padding: "16px 14px",
                background: C.dark,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: FONT.body,
              }}
            >
              <div
                style={{ fontSize: 18, marginBottom: 6 }}
              >
                📊
              </div>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#fff",
                  marginBottom: 2,
                }}
              >
                View Gap Analysis
              </div>
              <div style={{ fontSize: 11, color: C.faint }}>
                Detailed breakdown →
              </div>
            </button>
            <button
              onClick={() => navigate("/student/learning-path")}
              style={{
                padding: "16px 14px",
                background: C.accent,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: FONT.body,
              }}
            >
              <div
                style={{ fontSize: 18, marginBottom: 6 }}
              >
                🗺️
              </div>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#fff",
                  marginBottom: 2,
                }}
              >
                Start Learning Path
              </div>
              <div style={{ fontSize: 11, color: "#fff9" }}>
                Personalized plan →
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Wrong answers review */}
      <div style={card}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Review Incorrect Answers
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {wrongAnswers.map((w) => (
            <div
              key={w.id}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                    background: C.s4,
                    padding: "2px 9px",
                    borderRadius: 99,
                  }}
                >
                  {w.domain}
                </span>
                <span style={{ fontSize: 11, color: C.faint }}>
                  Question {w.id}
                </span>
              </div>

              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                {w.question}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "8px 12px",
                    background: C.s4 + "15",
                    borderRadius: 8,
                    borderLeft: `3px solid ${C.s4}`,
                  }}
                >
                  <span style={{ fontSize: 13, flexShrink: 0 }}>✗</span>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.s4,
                        fontWeight: 600,
                        marginBottom: 1,
                      }}
                    >
                      Your Answer
                    </div>
                    <div style={{ fontSize: 12.5, color: C.dark }}>
                      {w.yourAnswer}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "8px 12px",
                    background: C.s1 + "15",
                    borderRadius: 8,
                    borderLeft: `3px solid ${C.s1}`,
                  }}
                >
                  <span style={{ fontSize: 13, flexShrink: 0 }}>✓</span>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.s1,
                        fontWeight: 600,
                        marginBottom: 1,
                      }}
                    >
                      Correct Answer
                    </div>
                    <div style={{ fontSize: 12.5, color: C.dark }}>
                      {w.correctAnswer}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "10px 12px",
                  background: C.surface,
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Explanation
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12.5,
                    color: C.dark,
                    lineHeight: 1.6,
                  }}
                >
                  {w.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
