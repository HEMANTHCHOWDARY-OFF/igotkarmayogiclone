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
import {
  getCoursesByTitlesOrIds,
  getCourseById,
  getAllUnifiedCourses,
  type IGOTCatalogCourse,
} from "@/services/karmayogiCoursesService";
import { getCourseProgress } from "@/services/courseProgressService";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
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

  // Selected courses resolved from profile
  const selectedCourseIds = useMemo(() => {
    return (profile?.interestedCourses || []).map(String);
  }, [profile?.interestedCourses]);

  const userSelectedCourses: IGOTCatalogCourse[] = useMemo(() => {
    return getCoursesByTitlesOrIds(selectedCourseIds);
  }, [selectedCourseIds]);

  // Chart data: current vs target across active domains
  const chartData = useMemo(() => {
    if (profile?.interestedDomains && profile.interestedDomains.length > 0) {
      return profile.interestedDomains.slice(0, 5).map((dom, i) => {
        const match = domains.find((d) => d.name.toLowerCase() === dom.toLowerCase());
        return {
          name: dom.length > 14 ? dom.slice(0, 13) + "…" : dom,
          Current: match ? match.currentScore : Math.min(85, 45 + (i * 12) % 40),
          Target: match ? match.targetBenchmark : 80,
          color: match ? match.color : i % 2 === 0 ? C.s1 : C.accent,
        };
      });
    }
    return domains.map((d) => ({
      name: d.short,
      Current: d.currentScore,
      Target: d.targetBenchmark,
      color: d.color,
    }));
  }, [profile?.interestedDomains, domains]);

  // Recommended course based on user's active selected courses or top gap
  const recommendedCourse = useMemo(() => {
    if (userSelectedCourses.length > 0) {
      return userSelectedCourses[0];
    }
    return topGap
      ? getCourseById(topGap.domainId) || getAllUnifiedCourses()[0]
      : getAllUnifiedCourses()[0];
  }, [userSelectedCourses, topGap]);

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

  const displayName = profile?.fullName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student Learner";
  const learnerTrack = profile?.track || "Higher Education / University Student";
  const learnerInstitution = profile?.institution || "Academic Learning Track";

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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <span
              style={{
                background: C.dark,
                color: "#FAF7F0",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 10px",
                borderRadius: 4,
              }}
            >
              {learnerTrack}
            </span>
            <span
              style={{
                background: "#E6F4EC",
                color: C.s1,
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 10px",
                borderRadius: 4,
              }}
            >
              {learnerInstitution}
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
            Here is your personalized competency growth, diagnostic benchmarks, and skill gap remediation summary.
          </p>
        </div>

        <div style={{ textAlign: "right", fontSize: 13, color: C.faint, lineHeight: 1.5 }}>
          <div style={{ fontWeight: 600, color: C.muted }}>{dateStr}</div>
          <div style={{ color: C.accent, fontWeight: 700 }}>GyanMarg AI Platform</div>
        </div>
      </div>

      {/* iGOT KARMAYOGI CALIBRATION & GROQ AI RECOMMENDATIONS BANNER */}
      {((profile?.interestedDomains && profile.interestedDomains.length > 0) || profile?.aiRecommendations) && (
        <div
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            color: "#FFFFFF",
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 24,
            boxShadow: "0 4px 18px rgba(15, 23, 42, 0.16)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>
                  iGOT Karmayogi Calibrated Path (Powered by Groq AI)
                </div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)" }}>
                  Curriculum dynamically aligned with your selected competencies &amp; career aspirations
                </div>
              </div>
            </div>

            <Link
              to="/student/interested-courses"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#FCD34D",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                padding: "6px 12px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✎ Calibrate Domains &amp; Courses
            </Link>
          </div>

          {profile?.aiRecommendations?.competencyAnalysis && (
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.85)",
                margin: "0 0 14px",
              }}
            >
              {profile.aiRecommendations.competencyAnalysis}
            </p>
          )}

          {/* Domains and Sub-domains chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#FCD34D", textTransform: "uppercase" }}>
              Active Focus:
            </span>
            {profile?.interestedDomains?.map((d) => (
              <span
                key={d}
                style={{
                  background: "rgba(245, 158, 11, 0.2)",
                  color: "#FEF3C7",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 99,
                }}
              >
                {d}
              </span>
            ))}
            {profile?.interestedSubDomains?.slice(0, 4).map((sd) => (
              <span
                key={sd}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 99,
                }}
              >
                {sd}
              </span>
            ))}
            {(profile?.interestedSubDomains?.length || 0) > 4 && (
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                +{profile!.interestedSubDomains!.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

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

      {/* MY SELECTED LEARNING PATH & COURSES SECTION */}
      <div style={{ ...card, marginBottom: 28, padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🎓</span>
              <h2 style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 800, margin: 0, color: C.dark }}>
                My Selected Learning Path &amp; Courses ({userSelectedCourses.length})
              </h2>
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>
              Your active competency trajectory based on your selected domains and courses.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              to="/student/interested-courses"
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: C.accent,
                background: `${C.accent}14`,
                border: `1px solid ${C.accent}40`,
                padding: "6px 12px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>⚙️</span>
              <span>Modify Selection</span>
            </Link>

            <Link
              to="/student/learning-path"
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: "#fff",
                background: "#1B3D29",
                padding: "6px 14px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>🗺️</span>
              <span>View Full Roadmap</span>
            </Link>
          </div>
        </div>

        {userSelectedCourses.length === 0 ? (
          <div
            style={{
              padding: "24px 20px",
              textAlign: "center",
              background: C.bg,
              borderRadius: 10,
              border: `1px dashed ${C.border}`,
            }}
          >
            <span style={{ fontSize: 28 }}>🧭</span>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.dark, marginTop: 8 }}>
              No Courses Selected Yet
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4, maxWidth: 480, margin: "4px auto 14px" }}>
              Explore our 5,400+ official iGOT Karmayogi catalog or ask our AI mentor to recommend courses tailored to your goals.
            </div>
            <Link
              to="/student/interested-courses"
              style={{
                display: "inline-block",
                padding: "9px 20px",
                background: C.accent,
                color: "#fff",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Select Courses with AI →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {userSelectedCourses.map((c) => {
              const prog = getCourseProgress(c.id);
              const progressPct = prog.percent;
              const statusLabel =
                progressPct === 100 ? "Completed" : progressPct > 0 ? "In Progress" : "Not Started";

              return (
                <div
                  key={c.id}
                  style={{
                    background: C.bg,
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: c.level === "Advanced" ? "#FFE8E2" : "#EBF5F0",
                          color: c.level === "Advanced" ? C.s4 : C.s1,
                        }}
                      >
                        {c.level || "Beginner"}
                      </span>
                      <span style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono }}>
                        ⏱️ {c.duration || 6}h
                      </span>
                    </div>

                    <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: C.dark, lineHeight: 1.35 }}>
                      <Link to={`/student/courses/${c.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {c.title}
                      </Link>
                    </h4>

                    <div style={{ fontSize: 11.5, color: C.muted }}>
                      {c.domain} {c.subDomain && `• ${c.subDomain}`}
                    </div>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                      <span>{statusLabel}</span>
                      <span style={{ fontWeight: 700, color: progressPct > 0 ? C.s1 : C.muted }}>{progressPct}%</span>
                    </div>
                    <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ height: "100%", width: `${progressPct}%`, background: C.s1 }} />
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <Link
                        to={`/student/courses/${c.id}/learn`}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          padding: "7px 0",
                          borderRadius: 6,
                          background: C.accent,
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        {progressPct === 100 ? "Review Module" : progressPct > 0 ? "Resume Learning →" : "Start Learning →"}
                      </Link>
                      <Link
                        to={`/student/courses/${c.id}`}
                        style={{
                          padding: "7px 10px",
                          borderRadius: 6,
                          background: C.surface,
                          border: `1px solid ${C.border}`,
                          color: C.dark,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Syllabus
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
              <span>{skillHealth >= 70 ? "● Strong Benchmark Readiness" : "▲ Remediation Active"}</span>
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
                Real-time scores across core technical and foundational competency domains.
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
              <Bar dataKey="Current" fill={C.s1} radius={[4, 4, 0, 0]} name="Current Demonstrated" barSize={36} maxBarSize={48} />
              <Bar dataKey="Target" fill={C.border} radius={[4, 4, 0, 0]} name="Target Benchmark" barSize={36} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Quick Actions & Core Tools */}
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
              Core Learning & Career Tools
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
                <span>Explore 5,400+ Catalog Courses</span>
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
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
              <span>Progress:</span>
              <strong style={{ color: getCourseProgress(recommendedCourse.id).percent > 0 ? C.s1 : C.muted }}>
                {getCourseProgress(recommendedCourse.id).percent === 0
                  ? "Not Started (0%)"
                  : `${getCourseProgress(recommendedCourse.id).percent}% Completed`}
              </strong>
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
                {getCourseProgress(recommendedCourse.id).percent > 0
                  ? "Resume Learning & Quiz →"
                  : "Start Learning & Quiz →"}
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
                    Initial Diagnostic Competency Assessment
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    Established baseline across core competency domains with curriculum citations.
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
