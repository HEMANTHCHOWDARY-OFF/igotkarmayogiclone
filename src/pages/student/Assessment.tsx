import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import { useCompetency } from "@/context/CompetencyContext";
import { useAuth } from "@/context/AuthContext";

const TOTAL_SECONDS = 20 * 60;

const domainColors: Record<string, string> = {
  "Applied Statistics & Sampling Theory": "#1B3D29",
  "SQL & Database Operations": "#0F5C5C",
  "Python & Data Analytics": "#C6851B",
  "GIS & Spatial Analysis": "#8C3B17",
  "Public Data Ethics & DPDP Act 2023": "#3F51B5",
};

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const card: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: "24px 28px",
};

export default function Assessment() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { diagnosticQuestions, submitDiagnosticAssessment } = useCompetency();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(diagnosticQuestions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [submitted]);

  const q = diagnosticQuestions[current];
  const selected = answers[current];

  function select(idx: number) {
    if (submitted) return;
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  function handleSubmit() {
    setSubmitted(true);
    const timeTaken = TOTAL_SECONDS - timeLeft;
    const submission = submitDiagnosticAssessment(answers, timeTaken);
    navigate("/student/assessment/results", {
      state: { submission, answers, timeTaken },
    });
  }

  const answered = answers.filter((a) => a !== null).length;
  const progress = ((answered) / diagnosticQuestions.length) * 100;

  // Domain summary
  const domainMap: Record<string, { total: number; done: number; color: string }> = {};
  diagnosticQuestions.forEach((q2, i) => {
    if (!domainMap[q2.domain]) {
      domainMap[q2.domain] = { total: 0, done: 0, color: domainColors[q2.domain] || C.muted };
    }
    domainMap[q2.domain].total++;
    if (answers[i] !== null) domainMap[q2.domain].done++;
  });

  const timerUrgent = timeLeft < 120;

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: "#1B3D2915",
                color: "#1B3D29",
                padding: "3px 8px",
                borderRadius: 4,
              }}
            >
              Adaptive Skill Baseline Engine
            </span>
            <span style={{ fontSize: 12, color: C.muted }}>Track: {profile?.track || "Higher Education / University Student"}</span>
          </div>
          <h1
            style={{
              fontFamily: FONT.display,
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              color: C.dark,
            }}
          >
            National Competency Diagnostic Assessment
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>
            Evaluating functional mastery across 5 core domains: Applied Statistics, SQL, Python Analytics, GIS, and DPDP Act 2023.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => {
              if (window.confirm("Fill sample answers to accelerate testing?")) {
                // Pre-fill answers with a realistic distribution (7/10 correct)
                const mockAnswers = diagnosticQuestions.map((dq, idx) => {
                  if (idx === 2 || idx === 6 || idx === 7) return (dq.correct + 1) % 4; // miss SQL moving avg and GIS questions to induce realistic gap
                  return dq.correct;
                });
                setAnswers(mockAnswers);
              }
            }}
            style={{
              padding: "6px 12px",
              background: "transparent",
              border: `1px dashed ${C.accent}`,
              borderRadius: 6,
              color: C.accent,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ⚡ Demo Quick-Fill
          </button>
        </div>
      </div>

      {/* Progress bar + timer row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: C.faint,
              marginBottom: 5,
            }}
          >
            <span>
              Question {current + 1} of {diagnosticQuestions.length}
            </span>
            <span>
              {answered} of {diagnosticQuestions.length} Answered ({Math.round(progress)}%)
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: C.border,
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: C.s1,
                borderRadius: 99,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Timer Card */}
        <div
          style={{
            background: timerUrgent ? C.s4 : "#1B3D29",
            color: "#fff",
            borderRadius: 8,
            padding: "8px 16px",
            fontFamily: FONT.mono,
            fontSize: 16,
            fontWeight: 700,
            minWidth: 80,
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          }}
        >
          {fmtTime(timeLeft)}
        </div>
      </div>

      {/* Main layout: question + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 20 }}>
        {/* Question card */}
        <div style={card}>
          {/* Domain tag + citation notice */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  background: domainColors[q.domain] ?? C.muted,
                  padding: "4px 12px",
                  borderRadius: 99,
                }}
              >
                {q.domain}
              </span>
              <span style={{ fontSize: 12, color: C.faint }}>
                Question {current + 1} of {diagnosticQuestions.length}
              </span>
            </div>

            <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono }}>
              FrAC Competency ID: FRAC-{q.domainId.toUpperCase()}-0{q.id}
            </div>
          </div>

          {/* Question text */}
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1.6,
              marginBottom: 24,
              color: C.dark,
            }}
          >
            {q.text}
          </p>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, idx) => {
              let bg = C.bg;
              let border = `1.5px solid ${C.border}`;
              let color = C.dark;

              if (selected === idx) {
                bg = C.accent + "18";
                border = `1.5px solid ${C.accent}`;
                color = C.dark;
              }

              return (
                <button
                  key={idx}
                  onClick={() => select(idx)}
                  style={{
                    background: bg,
                    border,
                    borderRadius: 10,
                    padding: "14px 18px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: FONT.body,
                    fontSize: 14,
                    color,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: `1.5px solid ${selected === idx ? C.accent : C.border}`,
                      background:
                        selected === idx ? C.accent : "transparent",
                      color: selected === idx ? "#fff" : C.muted,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 32,
              paddingTop: 18,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <button
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
              style={{
                padding: "9px 20px",
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                fontFamily: FONT.body,
                fontSize: 13,
                fontWeight: 600,
                color: current === 0 ? C.faint : C.dark,
                cursor: current === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Previous
            </button>

            {current < diagnosticQuestions.length - 1 ? (
              <button
                onClick={() => setCurrent((c) => c + 1)}
                style={{
                  padding: "9px 24px",
                  background: C.dark,
                  border: "none",
                  borderRadius: 8,
                  fontFamily: FONT.body,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  padding: "10px 26px",
                  background: C.s1,
                  border: "none",
                  borderRadius: 8,
                  fontFamily: FONT.body,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(27, 61, 41, 0.3)",
                }}
              >
                Submit Diagnostic Assessment ✓
              </button>
            )}
          </div>
        </div>

        {/* Right sidebar: domain breakdown & navigator */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Domain Breakdown */}
          <div
            style={{
              ...card,
              padding: "18px 18px",
            }}
          >
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 14,
                color: C.dark,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Domain Progress</span>
              <span style={{ fontSize: 11, color: C.muted }}>5 Domains</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(domainMap).map(([domain, { total, done, color }]) => (
                <div key={domain}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        color: C.dark,
                        fontWeight: 600,
                        maxWidth: 140,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={domain}
                    >
                      {domain}
                    </span>
                    <span style={{ color: C.muted, fontWeight: 600 }}>
                      {done}/{total}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: C.border,
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(done / total) * 100}%`,
                        background: color,
                        borderRadius: 99,
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Navigator */}
          <div style={{ ...card, padding: "18px 18px" }}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 12,
                color: C.dark,
              }}
            >
              Question Grid
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 8,
              }}
            >
              {diagnosticQuestions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 6,
                    border: `1.5px solid ${
                      i === current
                        ? C.accent
                        : answers[i] !== null
                        ? C.s1
                        : C.border
                    }`,
                    background:
                      i === current
                        ? C.accent + "25"
                        : answers[i] !== null
                        ? C.s1 + "20"
                        : "transparent",
                    fontFamily: FONT.mono,
                    fontSize: 12,
                    fontWeight: 700,
                    color:
                      i === current
                        ? C.accent
                        : answers[i] !== null
                        ? C.s1
                        : C.faint,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: C.muted }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: C.s1 }} />
                <span>Answered</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: C.accent }} />
                <span>Current Question</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, border: `1px solid ${C.border}` }} />
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
