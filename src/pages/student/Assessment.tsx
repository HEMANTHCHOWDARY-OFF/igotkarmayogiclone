import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { C, FONT } from "@/tokens";

interface Question {
  id: number;
  domain: string;
  text: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    id: 1,
    domain: "Digital",
    text: "Which of the following is a feature of India's DigiLocker?",
    options: [
      "Cloud storage for personal documents",
      "Physical document archive",
      "Only for vehicle documents",
      "Requires manual verification",
    ],
    correct: 0,
  },
  {
    id: 2,
    domain: "Ethics",
    text: "Under the Prevention of Corruption Act, what constitutes a 'public servant'?",
    options: [
      "Only IAS and IPS officers",
      "Any person in the service or pay of the Government",
      "Elected representatives only",
      "Employees of central government exclusively",
    ],
    correct: 1,
  },
  {
    id: 3,
    domain: "Leadership",
    text: "Which management style involves delegating authority to subordinates?",
    options: [
      "Autocratic leadership",
      "Transactional leadership",
      "Laissez-faire leadership",
      "Bureaucratic leadership",
    ],
    correct: 2,
  },
  {
    id: 4,
    domain: "Policy",
    text: "What is the full form of PFMS used in government financial management?",
    options: [
      "Public Financial Management System",
      "Private Fund Management Scheme",
      "Policy Framework for Municipal Services",
      "Performance Funds Management System",
    ],
    correct: 0,
  },
  {
    id: 5,
    domain: "Technical",
    text: "Which Indian IT Act section deals with electronic signatures?",
    options: [
      "Section 43",
      "Section 66",
      "Section 5",
      "Section 72",
    ],
    correct: 2,
  },
  {
    id: 6,
    domain: "Digital",
    text: "What does API stand for in digital governance context?",
    options: [
      "Automated Process Interface",
      "Application Programming Interface",
      "Administrative Protocol Integration",
      "Access Permission Index",
    ],
    correct: 1,
  },
  {
    id: 7,
    domain: "Ethics",
    text: "The Central Vigilance Commission was established in which year?",
    options: ["1960", "1964", "1972", "1988"],
    correct: 1,
  },
  {
    id: 8,
    domain: "Leadership",
    text: "Which approach emphasizes setting clear SMART goals for team performance?",
    options: [
      "Situational leadership",
      "Transformational leadership",
      "Management by Objectives (MBO)",
      "Servant leadership",
    ],
    correct: 2,
  },
  {
    id: 9,
    domain: "Domain Knowledge",
    text: "Under which constitutional article do Directive Principles of State Policy fall?",
    options: [
      "Article 36–51",
      "Article 12–35",
      "Article 52–78",
      "Article 79–122",
    ],
    correct: 0,
  },
  {
    id: 10,
    domain: "Digital",
    text: "What is the purpose of the UMANG app?",
    options: [
      "Unified Mobile Application for New-age Governance",
      "Universal Mobile Access to National Government",
      "Urban Mobile Analytics Network Group",
      "Unified Management for Aadhaar Networks",
    ],
    correct: 0,
  },
];

const TOTAL_SECONDS = 20 * 60;

const domainColors: Record<string, string> = {
  Digital: C.s3,
  Ethics: C.s1,
  Leadership: C.s2,
  Policy: C.s4,
  Technical: "#7B5EA7",
  "Domain Knowledge": C.dark,
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
  padding: "20px 24px",
};

export default function Assessment() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
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

  const q = questions[current];
  const selected = answers[current];

  function select(idx: number) {
    if (submitted) return;
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  function handleSubmit() {
    setSubmitted(true);
    navigate("/student/assessment/results", {
      state: { answers, timeTaken: TOTAL_SECONDS - timeLeft },
    });
  }

  const answered = answers.filter((a) => a !== null).length;
  const progress = ((current + 1) / questions.length) * 100;

  // Domain summary
  const domainMap: Record<string, { total: number; done: number }> = {};
  questions.forEach((q2, i) => {
    if (!domainMap[q2.domain]) domainMap[q2.domain] = { total: 0, done: 0 };
    domainMap[q2.domain].total++;
    if (answers[i] !== null) domainMap[q2.domain].done++;
  });

  const timerUrgent = timeLeft < 120;

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontFamily: FONT.display,
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Competency Assessment
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>
          Answer all questions honestly. Your results shape your learning path.
        </p>
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
              Question {current + 1} of {questions.length}
            </span>
            <span>{answered} answered</span>
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
        <div
          style={{
            background: timerUrgent ? C.s4 : C.dark,
            color: "#fff",
            borderRadius: 8,
            padding: "6px 14px",
            fontFamily: FONT.mono,
            fontSize: 16,
            fontWeight: 600,
            minWidth: 72,
            textAlign: "center",
          }}
        >
          {fmtTime(timeLeft)}
        </div>
      </div>

      {/* Main layout: question + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 20 }}>
        {/* Question card */}
        <div style={card}>
          {/* Domain tag + number */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                background: domainColors[q.domain] ?? C.muted,
                padding: "3px 10px",
                borderRadius: 99,
              }}
            >
              {q.domain}
            </span>
            <span style={{ fontSize: 12, color: C.faint }}>
              Q{q.id} / {questions.length}
            </span>
          </div>

          {/* Question text */}
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1.5,
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
                    padding: "12px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: FONT.body,
                    fontSize: 14,
                    color,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: `1.5px solid ${selected === idx ? C.accent : C.border}`,
                      background:
                        selected === idx ? C.accent : "transparent",
                      color: selected === idx ? "#fff" : C.muted,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
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
              marginTop: 28,
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

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((c) => c + 1)}
                style={{
                  padding: "9px 20px",
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
                  padding: "9px 24px",
                  background: C.s1,
                  border: "none",
                  borderRadius: 8,
                  fontFamily: FONT.body,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Submit Assessment ✓
              </button>
            )}
          </div>
        </div>

        {/* Right sidebar: domain breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              ...card,
              padding: "16px 16px",
            }}
          >
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              Domain Progress
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(domainMap).map(([domain, { total, done }]) => (
                <div key={domain}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: C.muted, fontWeight: 500 }}>
                      {domain}
                    </span>
                    <span style={{ color: C.faint }}>
                      {done}/{total}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: C.border,
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(done / total) * 100}%`,
                        background: domainColors[domain] ?? C.muted,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question navigator */}
          <div style={{ ...card, padding: "16px 16px" }}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Questions
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 6,
              }}
            >
              {questions.map((_, i) => (
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
                        ? C.accent + "22"
                        : answers[i] !== null
                        ? C.s1 + "18"
                        : "transparent",
                    fontFamily: FONT.mono,
                    fontSize: 11,
                    fontWeight: 600,
                    color:
                      i === current
                        ? C.accent
                        : answers[i] !== null
                        ? C.s1
                        : C.faint,
                    cursor: "pointer",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
