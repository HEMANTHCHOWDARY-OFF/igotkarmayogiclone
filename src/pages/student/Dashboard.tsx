import { useNavigate, Link } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { C, FONT } from "@/tokens";
import { useCompetency } from "@/context/CompetencyContext";
import { IGOT_COURSES } from "@/data/igotCourses";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    domains,
    getSkillHealthScore,
    getGapMetrics,
    lastAssessment,
    assessmentCompleted,
    practiceSubmissions,
  } = useCompetency();

  const skillHealth = getSkillHealthScore();
  const gapMetrics = getGapMetrics();
  const topGap = gapMetrics.length > 0 ? gapMetrics[0] : null;

  // Chart data: current vs target across 5 MoSPI domains
  const chartData = domains.map((d) => ({
    name: d.short,
    Current: d.currentScore,
    Target: d.targetBenchmark,
    color: d.color,
  }));

  // Recommended course based on top gap
  const recommendedCourse = topGap
    ? IGOT_COURSES.find((c) => c.domainId === topGap.domainId) || IGOT_COURSES[0]
    : IGOT_COURSES[0];

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const card: React.CSSProperties = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: "20px 22px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Officer";

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, paddingBottom: 48 }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span
              style={{
                background: C.dark,
                color: "#FAF7F0",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              MoSPI Statistical Cadre
            </span>
            <span
              style={{
                background: "#E6F4EC",
                color: C.s1,
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              FrAC Competency Track
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT.display,
              fontSize: 26,
              fontWeight: 700,
              margin: 0,
              color: C.dark,
            }}
          >
            Welcome back, {displayName} 👋
          </h1>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 14 }}>
            Here is your live civil service competency growth and gap remediation summary.
          </p>
        </div>

        <div style={{ textAlign: "right", fontSize: 13, color: C.faint, lineHeight: 1.5 }}>
          <div style={{ fontWeight: 600, color: C.muted }}>{dateStr}</div>
          <div style={{ color: C.accent, fontWeight: 700 }}>GyanMarg AI Platform</div>
        </div>
      </div>

      {/* TOP GAP REMEDIATION ALERT BANNER */}
      {topGap && topGap.gap > 0 && (
        <div
          style={{
            background: "#FEF3C7",
            border: `1.5px solid ${C.accent}`,
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            boxShadow: "0 2px 8px rgba(198,133,27,0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: C.accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🎯
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>
                Priority Competency Gap: {topGap.domain} ({topGap.gap}% deficit)
              </div>
              <div style={{ fontSize: 12, color: "#78350F", marginTop: 2 }}>
                Current demonstrated: <strong>{topGap.current}%</strong> vs Target benchmark: <strong>{topGap.target}%</strong>. Recommended remedy: <em>{topGap.action}</em>.
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/student/courses/${recommendedCourse.id}/learn`)}
            style={{
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "9px 18px",
              fontFamily: FONT.body,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Start Remediation Module →
          </button>
        </div>
      )}

      {/* Quick KPI Stats Row (Feature 10) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Composite Skill Health */}
        <div
          style={{
            ...card,
            padding: 0,
            overflow: "hidden",
            borderLeft: `4px solid ${
              skillHealth >= 70 ? C.s1 : skillHealth >= 50 ? C.accent : C.s4
            }`,
          }}
        >
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              Composite Skill Health
            </div>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 32,
                fontWeight: 700,
                color: C.dark,
                lineHeight: 1,
                marginTop: 6,
              }}
            >
              {skillHealth}
              <span style={{ fontSize: 16, color: C.faint, fontWeight: 400 }}> / 100</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: skillHealth >= 70 ? C.s1 : C.accent,
                marginTop: 8,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{skillHealth >= 70 ? "● Strong Cadre Readiness" : "▲ Remediation Active"}</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Assessment */}
        <div
          style={{
            ...card,
            padding: 0,
            overflow: "hidden",
            borderLeft: `4px solid ${C.s1}`,
          }}
        >
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              Diagnostic Status
            </div>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 32,
                fontWeight: 700,
                color: C.dark,
                lineHeight: 1,
                marginTop: 6,
              }}
            >
              {assessmentCompleted && lastAssessment ? `${lastAssessment.score}%` : "Verified"}
            </div>
            <div style={{ fontSize: 11, color: C.s1, marginTop: 8, fontWeight: 700 }}>
              {assessmentCompleted ? "✓ Evaluated with Citations" : "Baseline Active"}
            </div>
          </div>
        </div>

        {/* Practice Quizzes Taken */}
        <div
          style={{
            ...card,
            padding: 0,
            overflow: "hidden",
            borderLeft: `4px solid ${C.accent}`,
          }}
        >
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              Remediation Quizzes
            </div>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 32,
                fontWeight: 700,
                color: C.dark,
                lineHeight: 1,
                marginTop: 6,
              }}
            >
              {practiceSubmissions.length} Completed
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
              {practiceSubmissions.length > 0
                ? `Last: +${practiceSubmissions[0].deltaDomain} pts growth`
                : "Awaiting micro-quizzes"}
            </div>
          </div>
        </div>

        {/* Priority Gaps Left */}
        <div
          style={{
            ...card,
            padding: 0,
            overflow: "hidden",
            borderLeft: `4px solid ${C.s4}`,
          }}
        >
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              Critical Gaps Remaining
            </div>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 32,
                fontWeight: 700,
                color: C.dark,
                lineHeight: 1,
                marginTop: 6,
              }}
            >
              {gapMetrics.filter((m) => m.severity === "Critical").length}
            </div>
            <div style={{ fontSize: 11, color: C.s4, marginTop: 8, fontWeight: 700 }}>
              {gapMetrics.filter((m) => m.severity === "Critical").length === 0
                ? "All Critical Gaps Bridged!"
                : "Targeted in Phase 2 Roadmap"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Competency Bar Chart & Action Central */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {/* Left: Competency Growth & Target Comparison */}
        <div style={card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontSize: 16,
                  fontWeight: 700,
                  color: C.dark,
                }}
              >
                Demonstrated Competency vs Target Benchmark
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                Real-time scores across official MoSPI FrAC competency domains.
              </div>
            </div>
            <Link
              to="/student/gap-analysis"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.accent,
                textDecoration: "none",
              }}
            >
              View Radar Chart →
            </Link>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: C.dark, fontWeight: 600 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.faint }} />
              <Tooltip
                contentStyle={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: FONT.body,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Current" fill={C.s1} radius={[4, 4, 0, 0]} name="Current Demonstrated" />
              <Bar dataKey="Target" fill={C.border} radius={[4, 4, 0, 0]} name="Target Benchmark" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Quick Actions & Cadre Tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={card}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 12,
                color: C.dark,
              }}
            >
              Civil Service Core Tools
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => navigate("/student/assessment")}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: C.dark,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>📝</span>
                <span>Take Diagnostic Assessment</span>
              </button>

              <button
                onClick={() => navigate("/student/gap-analysis")}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: C.surfaceAlt,
                  color: C.dark,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>🎯</span>
                <span>AI Competency Gap Analysis</span>
              </button>

              <button
                onClick={() => navigate("/student/learning-path")}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: C.surfaceAlt,
                  color: C.dark,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>🗺️</span>
                <span>roadmap.sh Learning Path</span>
              </button>

              <button
                onClick={() => navigate("/student/courses")}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: C.surfaceAlt,
                  color: C.dark,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>📚</span>
                <span>Browse 22 iGOT Courses</span>
              </button>
            </div>
          </div>

          {/* Active Course Card */}
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase" }}>
              Active Remediation Course
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginTop: 4 }}>
              {recommendedCourse.title}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
              {recommendedCourse.duration} • {recommendedCourse.level}
            </div>
            <div style={{ marginTop: 12 }}>
              <Link
                to={`/student/courses/${recommendedCourse.id}/learn`}
                style={{
                  display: "inline-block",
                  width: "100%",
                  textAlign: "center",
                  background: C.accent,
                  color: "#fff",
                  padding: "8px 0",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Resume Learning & Quiz →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Remediation & Practice History Feed */}
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
              color: C.dark,
            }}
          >
            Verified Competency Growth & Evaluation Timeline
          </div>
          <span style={{ fontSize: 12, color: C.muted }}>
            Instant evaluation tracking
          </span>
        </div>

        {practiceSubmissions.length === 0 && !lastAssessment ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: C.muted, fontSize: 13 }}>
            No recent submissions yet. Take the diagnostic or a course knowledge check to build your timeline.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {practiceSubmissions.map((p) => (
              <div
                key={p.id}
                style={{
                  background: C.bg,
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderLeft: `3px solid ${C.s1}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>
                    Knowledge Check: {p.courseTitle} ({p.domainName})
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    Demonstrated score improved from {p.oldDomainScore}% → {p.newDomainScore}% (
                    +{p.deltaDomain} pts). Composite Health: {p.newSkillHealth}%.
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      background: "#E6F4EC",
                      color: C.s1,
                      fontWeight: 700,
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {p.score}% Mastery
                  </span>
                  <div style={{ fontSize: 10, color: C.faint, marginTop: 4 }}>
                    {new Date(p.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}

            {lastAssessment && (
              <div
                style={{
                  background: C.bg,
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderLeft: `3px solid ${C.accent}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>
                    Initial MoSPI FrAC Diagnostic Assessment
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    Established baseline across 5 statistical domains with document citations.
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      background: "#FEF3C7",
                      color: "#92400E",
                      fontWeight: 700,
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {lastAssessment.score}% Baseline
                  </span>
                  <div style={{ fontSize: 10, color: C.faint, marginTop: 4 }}>
                    {new Date(lastAssessment.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
