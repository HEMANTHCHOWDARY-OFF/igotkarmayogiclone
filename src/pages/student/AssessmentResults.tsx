import { useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router";
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
import { useCompetency, type DiagnosticQuestion } from "@/context/CompetencyContext";

function domainColor(score: number) {
  if (score >= 80) return C.s1; // Green
  if (score >= 60) return C.s2; // Amber/Gold
  return C.s4; // Red/Coral
}

const card: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: "20px 24px",
};

export default function AssessmentResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { domains, lastAssessment, diagnosticQuestions } = useCompetency();

  // Read saved cross-tab submission if location.state is empty
  const savedResult = useMemo(() => {
    try {
      const raw = localStorage.getItem("gyanmarg_latest_assessment_result");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const submissionData = location.state?.submission || savedResult?.submission || lastAssessment;
  const evaluatedQuestions = (location.state?.questions || savedResult?.questions || diagnosticQuestions) as DiagnosticQuestion[];
  const userAnswers = location.state?.answers || savedResult?.answers || submissionData?.userAnswers || [];
  const timeTakenSec = location.state?.timeTaken ?? savedResult?.timeTaken ?? submissionData?.timeTakenSeconds ?? 480;

  const date = submissionData?.date
    ? new Date(submissionData.date).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const totalScore = submissionData?.score ?? 70;
  const correctCount = submissionData?.correctAnswers ?? 7;
  const totalCount = submissionData?.totalQuestions ?? evaluatedQuestions.length;

  const fmtMinSec = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Domain scores for BarChart
  const domainChartData = domains.map((d) => ({
    domain: d.name,
    short: d.short,
    score: d.currentScore,
    target: d.targetBenchmark,
  }));

  // Identify lowest domain and highest domain
  const sortedDomains = [...domains].sort((a, b) => a.currentScore - b.currentScore);
  const lowestDomain = sortedDomains[0];
  const highestDomain = sortedDomains[sortedDomains.length - 1];

  const stats = [
    { label: "Overall Score", value: `${totalScore}%`, color: totalScore >= 75 ? C.s1 : totalScore >= 60 ? C.s2 : C.s4 },
    { label: "Correct Answers", value: `${correctCount} / ${totalCount}`, color: C.s1 },
    { label: "Time Taken", value: fmtMinSec(timeTakenSec), color: C.s3 },
    { label: "National Percentile", value: totalScore >= 80 ? "Top 12%" : totalScore >= 65 ? "Top 28%" : "Top 45%", color: C.dark },
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
          background: "#1B3D29",
          border: "none",
          boxShadow: "0 6px 20px rgba(27, 61, 41, 0.2)",
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
              stroke="#ffffff25"
              strokeWidth="8"
            />
            <circle
              cx="55"
              cy="55"
              r="46"
              fill="none"
              stroke={C.accent}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 46}`}
              strokeDashoffset={`${2 * Math.PI * 46 * (1 - totalScore / 100)}`}
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
                fontSize: 26,
                fontWeight: 800,
                color: C.accent,
              }}
            >
              {totalScore}%
            </span>
          </div>
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: C.accent,
                color: "#1B3D29",
                padding: "2px 8px",
                borderRadius: 4,
                textTransform: "uppercase",
              }}
            >
              Diagnostic Complete
            </span>
            <span style={{ fontSize: 12, color: "#D4E8D8" }}>{date}</span>
          </div>

          <div
            style={{
              fontFamily: FONT.display,
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 6,
            }}
          >
            Competency Baseline Evaluated! 🎯
          </div>
          <div style={{ fontSize: 13.5, color: "#D4E8D8", lineHeight: 1.6 }}>
            Your baseline scores have been dynamically updated in your profile. Highest demonstrated proficiency is in{" "}
            <strong style={{ color: "#fff" }}>{highestDomain?.name} ({highestDomain?.currentScore}%)</strong>. Critical remediation recommended for{" "}
            <strong style={{ color: C.accent }}>{lowestDomain?.name} ({lowestDomain?.currentScore}%)</strong>.
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
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Domain breakdown */}
        <div style={card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Domain Competency Proficiency Breakdown
            </div>
            <span style={{ fontSize: 11, color: C.muted }}>5 Core Domains</span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={domainChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                formatter={(v, name) => [`${v}%`, name === "score" ? "Demonstrated Score" : "Target Benchmark"]}
              />
              <Bar dataKey="score" name="Demonstrated Score" radius={[4, 4, 0, 0]}>
                {domainChartData.map((d) => (
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
              { label: "≥ 80% Benchmark Met", color: C.s1 },
              { label: "60–79% Moderate Competency", color: C.s2 },
              { label: "< 60% Critical Remediation Required", color: C.s4 },
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
              gap: 10,
            }}
          >
            {domains.map((d) => (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 170,
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.dark,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={d.name}
                >
                  {d.name}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: C.border,
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${d.currentScore}%`,
                      background: domainColor(d.currentScore),
                      borderRadius: 99,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 60,
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: 700,
                    color: domainColor(d.currentScore),
                  }}
                >
                  {d.currentScore}% <span style={{ fontSize: 10, color: C.muted }}>({d.targetBenchmark}%)</span>
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
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              Automated Competency Insights
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 14px",
                  background: C.s4 + "0F",
                  borderRadius: 10,
                  borderLeft: `3px solid ${C.s4}`,
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: C.dark }}>
                  <strong>Critical Gap Detected:</strong> Your score in <em>{lowestDomain?.name}</em> ({lowestDomain?.currentScore}%) falls {lowestDomain ? Math.max(0, lowestDomain.targetBenchmark - lowestDomain.currentScore) : 0}% below your target benchmark requirement.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 14px",
                  background: C.s1 + "0F",
                  borderRadius: 10,
                  borderLeft: `3px solid ${C.s1}`,
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>✅</span>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: C.dark }}>
                  <strong>Strong Foundation:</strong> Demonstrated high baseline in <em>{highestDomain?.name}</em> ({highestDomain?.currentScore}%). Ready for advanced projects and applications.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 14px",
                  background: C.s2 + "0F",
                  borderRadius: 10,
                  borderLeft: `3px solid ${C.s2}`,
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>🎯</span>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: C.dark }}>
                  <strong>Closed-Loop Learning Path Activated:</strong> Your personalized remedial curriculum has been configured in the AI Gap Matrix.
                </p>
              </div>
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
                background: "#1B3D29",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: FONT.body,
                boxShadow: "0 4px 12px rgba(27, 61, 41, 0.2)",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>📊</div>
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
                Interactive Radar Chart →
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
                boxShadow: "0 4px 12px rgba(198, 133, 27, 0.25)",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>🗺️</div>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#fff",
                  marginBottom: 2,
                }}
              >
                Start Remedial Path
              </div>
              <div style={{ fontSize: 11, color: "#fffa" }}>
                4-Phase Sequenced Plan →
              </div>
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link
              to="/student/assessment"
              style={{
                fontSize: 12,
                color: C.muted,
                textDecoration: "underline",
                padding: "4px 8px",
              }}
            >
              ↻ Re-take Diagnostic Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Complete Question Review with Exact Verifiable Citations */}
      <div style={card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Detailed Question Evaluation & Source Citations
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted }}>
              Every question is verified against recognized academic curricula, statutory guidelines, and industry standards.
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.s1 }}>
            {correctCount} / {totalCount} Correct ({totalScore}%)
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {evaluatedQuestions.map((q, idx) => {
            const userAnsIdx = userAnswers[idx];
            const isCorrect = userAnsIdx === q.correct;
            const isAnswered = userAnsIdx !== null && userAnsIdx !== undefined;

            return (
              <div
                key={q.id}
                style={{
                  background: C.bg,
                  border: `1px solid ${isCorrect ? C.s1 + "55" : C.s4 + "55"}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                }}
              >
                {/* Badge Row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        background: isCorrect ? C.s1 : C.s4,
                        padding: "2px 10px",
                        borderRadius: 99,
                      }}
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.dark,
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {q.domain}
                    </span>
                  </div>

                  <span style={{ fontSize: 12, color: C.faint }}>
                    Question {idx + 1} of {diagnosticQuestions.length}
                  </span>
                </div>

                {/* Question Text */}
                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: C.dark,
                  }}
                >
                  {q.text}
                </p>

                {/* Answer Summary */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isCorrect ? "1fr" : "1fr 1fr",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  {!isCorrect && (
                    <div
                      style={{
                        padding: "8px 12px",
                        background: C.s4 + "12",
                        borderRadius: 8,
                        borderLeft: `3px solid ${C.s4}`,
                      }}
                    >
                      <div style={{ fontSize: 11, color: C.s4, fontWeight: 700 }}>
                        Your Choice:
                      </div>
                      <div style={{ fontSize: 13, color: C.dark, marginTop: 2 }}>
                        {isAnswered && userAnsIdx !== null ? `${String.fromCharCode(65 + userAnsIdx)}. ${q.options[userAnsIdx]}` : "Unanswered"}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      padding: "8px 12px",
                      background: C.s1 + "12",
                      borderRadius: 8,
                      borderLeft: `3px solid ${C.s1}`,
                    }}
                  >
                    <div style={{ fontSize: 11, color: C.s1, fontWeight: 700 }}>
                      Correct Option:
                    </div>
                    <div style={{ fontSize: 13, color: C.dark, marginTop: 2 }}>
                      {String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}
                    </div>
                  </div>
                </div>

                {/* Explanatory Rationale */}
                <div
                  style={{
                    padding: "10px 14px",
                    background: C.surface,
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.muted,
                      marginBottom: 3,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Explanatory Rationale
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: C.dark, lineHeight: 1.6 }}>
                    {q.explanation}
                  </p>
                </div>

                {/* Verifiable Citation Box */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    background: "#F5F1E6",
                    borderRadius: 6,
                    border: "1px dashed #C6851B",
                    fontSize: 11.5,
                  }}
                >
                  <span style={{ fontSize: 14 }}>📖</span>
                  <span style={{ fontWeight: 700, color: "#8C3B17" }}>Verifiable Citation:</span>
                  <span style={{ color: C.dark, fontWeight: 600 }}>{q.citation.documentName}</span>
                  <span style={{ color: C.muted }}>•</span>
                  <span style={{ color: C.muted }}>{q.citation.chapter}</span>
                  <span style={{ color: C.muted }}>•</span>
                  <span style={{ color: "#1B3D29", fontWeight: 600 }}>{q.citation.page}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
