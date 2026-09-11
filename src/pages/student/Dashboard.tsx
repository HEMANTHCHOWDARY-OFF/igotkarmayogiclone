import { useState, useMemo } from "react";
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
import { getCourseProgress, getCurriculumStats } from "@/services/courseProgressService";
import { useAuth } from "@/context/AuthContext";

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

  const [courseFilter, setCourseFilter] = useState<"all" | "in_progress" | "completed">("all");
  const [chartView, setChartView] = useState<"active" | "all">("active");

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

  const curriculumStats = useMemo(() => {
    return getCurriculumStats(selectedCourseIds);
  }, [selectedCourseIds]);

  // Categorize courses
  const coursesWithProgress = useMemo(() => {
    return userSelectedCourses.map((c) => {
      const prog = getCourseProgress(c.id);
      return {
        ...c,
        progress: prog.percent,
        status: prog.percent === 100 ? "completed" : prog.percent > 0 ? "in_progress" : "not_started",
      };
    });
  }, [userSelectedCourses]);

  const filteredCourses = useMemo(() => {
    if (courseFilter === "in_progress") {
      return coursesWithProgress.filter((c) => c.status === "in_progress");
    }
    if (courseFilter === "completed") {
      return coursesWithProgress.filter((c) => c.status === "completed");
    }
    return coursesWithProgress;
  }, [coursesWithProgress, courseFilter]);

  // Primary recommended / active course
  const heroCourse = useMemo(() => {
    const inProgress = coursesWithProgress.find((c) => c.status === "in_progress");
    if (inProgress) return inProgress;
    if (userSelectedCourses.length > 0) return userSelectedCourses[0];
    return topGap
      ? getCourseById(topGap.domainId) || getAllUnifiedCourses()[0]
      : getAllUnifiedCourses()[0];
  }, [coursesWithProgress, userSelectedCourses, topGap]);

  const heroCourseProgress = heroCourse ? getCourseProgress(heroCourse.id).percent : 0;

  // Chart data: current vs target across domains
  const chartData = useMemo(() => {
    if (chartView === "active" && profile?.interestedDomains && profile.interestedDomains.length > 0) {
      return profile.interestedDomains.slice(0, 6).map((dom, i) => {
        const match = domains.find((d) => d.name.toLowerCase() === dom.toLowerCase());
        return {
          name: dom.length > 16 ? dom.slice(0, 15) + "…" : dom,
          Current: match ? match.currentScore : Math.min(85, 45 + (i * 12) % 40),
          Target: match ? match.targetBenchmark : 80,
        };
      });
    }
    return domains.slice(0, 6).map((d) => ({
      name: d.short || d.name.slice(0, 12),
      Current: d.currentScore,
      Target: d.targetBenchmark,
    }));
  }, [profile?.interestedDomains, domains, chartView]);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const cardStyle: React.CSSProperties = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "20px 22px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  const displayName =
    profile?.fullName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student Learner";

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, paddingBottom: 48, maxWidth: 1280, margin: "0 auto" }}>
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: FONT.display,
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              color: C.dark,
              letterSpacing: "-0.3px",
            }}
          >
            Welcome back, {displayName}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>{dateStr}</span>
          <Link
            to="/student/interested-courses"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.accent,
              background: `${C.accent}12`,
              border: `1px solid ${C.accent}35`,
              padding: "7px 14px",
              borderRadius: 8,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "background 0.15s",
            }}
          >
            Calibrate Path
          </Link>
        </div>
      </div>

      {/* ── 2. Hero Spotlight ("Jump Back In") ────────────────────────── */}
      {heroCourse && (
        <div
          style={{
            background: "linear-gradient(135deg, #1B3D29 0%, #132B1D 100%)",
            borderRadius: 14,
            padding: "24px 28px",
            color: "#fff",
            marginBottom: 24,
            boxShadow: "0 4px 16px rgba(27, 61, 41, 0.15)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  background: "rgba(198, 133, 27, 0.25)",
                  color: "#FDE68A",
                  border: "1px solid rgba(198, 133, 27, 0.4)",
                  fontSize: 10.5,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "2px 9px",
                  borderRadius: 6,
                }}
              >
                {heroCourseProgress > 0 ? "Continue Learning" : "Recommended Next"}
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                {heroCourse.domain}
                {heroCourse.subDomain && heroCourse.subDomain !== heroCourse.domain
                  ? ` • ${heroCourse.subDomain}`
                  : ""}
              </span>
            </div>

            <h2
              style={{
                fontFamily: FONT.display,
                fontSize: 20,
                fontWeight: 700,
                color: "#FFFFFF",
                margin: "0 0 10px",
                lineHeight: 1.3,
              }}
            >
              {heroCourse.title}
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>
              <span>Duration: <strong>{heroCourse.duration ? `${heroCourse.duration}`.replace(/h$/i, "") + "h" : "6h"}</strong></span>
              <span>•</span>
              <span>Level: <strong>{heroCourse.level || "Intermediate"}</strong></span>
            </div>

            {/* Progress line */}
            <div style={{ marginTop: 14, maxWidth: 500 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 5 }}>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>Course Progress</span>
                <span style={{ fontWeight: 700, color: "#FDE68A" }}>{heroCourseProgress}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${heroCourseProgress}%`,
                    background: C.accent,
                    borderRadius: 4,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 170 }}>
            <Link
              to={`/student/courses/${heroCourse.id}/learn`}
              style={{
                background: C.accent,
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                textAlign: "center",
                padding: "11px 22px",
                borderRadius: 8,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(198, 133, 27, 0.3)",
                transition: "all 0.15s",
              }}
            >
              {heroCourseProgress > 0 ? "Resume Module →" : "Start Course →"}
            </Link>
            <Link
              to={`/student/courses/${heroCourse.id}`}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                fontSize: 12,
                textAlign: "center",
                padding: "8px 16px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              View Syllabus
            </Link>
          </div>
        </div>
      )}

      {/* ── 3. Unified KPI Stat Cards ─────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 26,
        }}
      >
        {/* Metric 1: Skill Health Score */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Overall Skill Health</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: skillHealth >= 70 ? C.s1 : C.accent,
                background: skillHealth >= 70 ? "#E8F2EC" : "#FEF3C7",
                padding: "2px 8px",
                borderRadius: 12,
              }}
            >
              {skillHealth >= 70 ? "On Track" : "Remediating"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 800, color: C.dark }}>
              {skillHealth}
            </span>
            <span style={{ fontSize: 14, color: C.faint, fontWeight: 500 }}>/ 100</span>
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>
            Demonstrated across {domains.length} evaluated domains
          </div>
        </div>

        {/* Metric 2: Courses in Progress */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Course Progression</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.s1,
                background: "#E8F2EC",
                padding: "2px 8px",
                borderRadius: 12,
              }}
            >
              {curriculumStats.overallPercent}% complete
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 800, color: C.dark }}>
              {curriculumStats.startedCourses}
            </span>
            <span style={{ fontSize: 14, color: C.faint, fontWeight: 500 }}>
              of {curriculumStats.totalCourses || userSelectedCourses.length} active
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>
            {curriculumStats.completedCourses} completed • {curriculumStats.totalStudyHours}h logged
          </div>
        </div>

        {/* Metric 3: Diagnostic Assessment Status */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Diagnostic Benchmark</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: assessmentCompleted ? C.s1 : C.accent,
                background: assessmentCompleted ? "#E8F2EC" : "#FEF3C7",
                padding: "2px 8px",
                borderRadius: 12,
              }}
            >
              {assessmentCompleted ? "Verified" : "Baseline"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 800, color: C.dark }}>
              {assessmentCompleted && lastAssessment ? `${lastAssessment.score}%` : "82%"}
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>
            {assessmentCompleted ? "Full diagnostic with citations" : "MoSPI syllabus baseline standard"}
          </div>
        </div>

        {/* Metric 4: Knowledge Checks */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Practice & Mastery</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.s1,
                background: "#E8F2EC",
                padding: "2px 8px",
                borderRadius: 12,
              }}
            >
              Active
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 800, color: C.dark }}>
              {practiceSubmissions.length}
            </span>
            <span style={{ fontSize: 14, color: C.faint, fontWeight: 500 }}>quizzes taken</span>
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>
            {practiceSubmissions.length > 0
              ? `Last boost: +${practiceSubmissions[0].deltaDomain} pts in ${practiceSubmissions[0].domainName}`
              : "Complete quizzes to boost skill scores"}
          </div>
        </div>
      </div>

      {/* ── 4. Main Two-Column Layout ──────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 22,
          alignItems: "start",
        }}
      >
        {/* ── LEFT COLUMN: Courses & Competency Chart ────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Courses Container */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 16,
                    fontWeight: 700,
                    margin: 0,
                    color: C.dark,
                  }}
                >
                  My Enrolled Courses &amp; Modules
                </h3>
              </div>

              {/* Filter Tabs */}
              <div
                style={{
                  display: "flex",
                  background: C.bg,
                  padding: 3,
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                }}
              >
                {(
                  [
                    { id: "all", label: `All (${userSelectedCourses.length})` },
                    {
                      id: "in_progress",
                      label: `In Progress (${coursesWithProgress.filter((c) => c.status === "in_progress").length})`,
                    },
                    {
                      id: "completed",
                      label: `Done (${coursesWithProgress.filter((c) => c.status === "completed").length})`,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCourseFilter(tab.id)}
                    style={{
                      border: "none",
                      background: courseFilter === tab.id ? C.surface : "transparent",
                      color: courseFilter === tab.id ? C.dark : C.muted,
                      fontWeight: courseFilter === tab.id ? 700 : 500,
                      fontSize: 11.5,
                      padding: "5px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      boxShadow: courseFilter === tab.id ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses List */}
            {filteredCourses.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "36px 20px",
                  background: C.bg,
                  borderRadius: 10,
                  border: `1px dashed ${C.border}`,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>
                  {courseFilter === "all" ? "No courses enrolled yet" : `No ${courseFilter.replace("_", " ")} courses`}
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, marginBottom: 16 }}>
                  Explore 5,400+ courses across government, technical, and leadership domains.
                </div>
                <Link
                  to="/student/courses"
                  style={{
                    display: "inline-block",
                    padding: "8px 18px",
                    background: C.accent,
                    color: "#fff",
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Explore Course Catalog →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredCourses.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 16px",
                      background: C.bg,
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 4,
                            background: c.level === "Advanced" ? "#FFE8E2" : "#E8F2EC",
                            color: c.level === "Advanced" ? C.s4 : C.s1,
                          }}
                        >
                          {c.level || "Intermediate"}
                        </span>
                        <span style={{ fontSize: 11, color: C.muted }}>
                          {c.domain}
                        </span>
                        <span style={{ fontSize: 11, color: C.faint }}>•</span>
                        <span style={{ fontSize: 11, color: C.muted }}>
                          {c.duration ? `${c.duration}`.replace(/h$/i, "") + "h" : "6h"}
                        </span>
                      </div>

                      <h4 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: C.dark }}>
                        <Link
                          to={`/student/courses/${c.id}`}
                          style={{ color: "inherit", textDecoration: "none" }}
                        >
                          {c.title}
                        </Link>
                      </h4>

                      {/* Mini Progress */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 280 }}>
                        <div
                          style={{
                            flex: 1,
                            height: 4,
                            background: C.border,
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${c.progress}%`,
                              background: c.progress === 100 ? C.s1 : C.accent,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: c.progress > 0 ? (c.progress === 100 ? C.s1 : C.accent) : C.muted,
                          }}
                        >
                          {c.progress === 100 ? "Completed" : `${c.progress}%`}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Link
                        to={`/student/courses/${c.id}/learn`}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 6,
                          background: c.progress === 100 ? C.surface : C.dark,
                          color: c.progress === 100 ? C.dark : "#fff",
                          border: c.progress === 100 ? `1px solid ${C.border}` : "none",
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.progress === 100 ? "Review" : c.progress > 0 ? "Resume" : "Start"}
                      </Link>
                      <Link
                        to={`/student/courses/${c.id}`}
                        style={{
                          padding: "7px 10px",
                          borderRadius: 6,
                          background: "transparent",
                          color: C.muted,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link
                to="/student/learning-path"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.dark,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>View Full Visual Learning Roadmap →</span>
              </Link>
              <Link
                to="/student/courses"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.accent,
                  textDecoration: "none",
                }}
              >
                + Add More Courses
              </Link>
            </div>
          </div>

          {/* Competency Comparison Chart */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: FONT.display,
                    fontSize: 16,
                    fontWeight: 700,
                    margin: 0,
                    color: C.dark,
                  }}
                >
                  Competency Benchmarks
                </h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    display: "flex",
                    background: C.bg,
                    padding: 2,
                    borderRadius: 6,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <button
                    onClick={() => setChartView("active")}
                    style={{
                      border: "none",
                      background: chartView === "active" ? C.surface : "transparent",
                      color: chartView === "active" ? C.dark : C.muted,
                      fontWeight: chartView === "active" ? 700 : 500,
                      fontSize: 11,
                      padding: "4px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Focus Domains
                  </button>
                  <button
                    onClick={() => setChartView("all")}
                    style={{
                      border: "none",
                      background: chartView === "all" ? C.surface : "transparent",
                      color: chartView === "all" ? C.dark : C.muted,
                      fontWeight: chartView === "all" ? 700 : 500,
                      fontSize: 11,
                      padding: "4px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    All Domains
                  </button>
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
                  Gap Analysis →
                </Link>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11.5, fill: C.dark, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.faint }} />
                <Tooltip
                  contentStyle={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: FONT.body,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11.5, paddingTop: 6 }} />
                <Bar
                  dataKey="Current"
                  fill={C.s1}
                  radius={[4, 4, 0, 0]}
                  name="Demonstrated Score"
                  barSize={32}
                />
                <Bar
                  dataKey="Target"
                  fill="#D5CEBC"
                  radius={[4, 4, 0, 0]}
                  name="Target Benchmark"
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Priority Focus, Milestones, AI Assistant ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Priority Growth Focus */}
          {topGap && topGap.gap > 0 ? (
            <div
              style={{
                ...cardStyle,
                borderTop: `4px solid ${C.accent}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: C.accent,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Targeted Growth Focus
                </span>
              </div>

              <h4 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: C.dark }}>
                {topGap.domain}
              </h4>
              <p style={{ margin: "0 0 12px", fontSize: 12.5, color: C.muted, lineHeight: 1.45 }}>
                {topGap.action || `Close the ${topGap.gap}% gap to reach your target benchmark.`}
              </p>

              {/* Score comparison pill */}
              <div
                style={{
                  background: C.bg,
                  padding: "10px 12px",
                  borderRadius: 8,
                  marginBottom: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase" }}>Current</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.s4 }}>{topGap.current}%</div>
                </div>
                <div style={{ fontSize: 16, color: C.border }}>→</div>
                <div>
                  <div style={{ fontSize: 10.5, color: C.faint, textTransform: "uppercase" }}>Target</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.s1 }}>{topGap.target}%</div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: "#FEF3C7",
                    color: "#92400E",
                    padding: "2px 7px",
                    borderRadius: 4,
                  }}
                >
                  -{topGap.gap}% Gap
                </span>
              </div>

              <button
                onClick={() => navigate(`/student/courses/${heroCourse?.id || ""}/learn`)}
                style={{
                  width: "100%",
                  background: C.accent,
                  color: "#fff",
                  border: "none",
                  padding: "9px 0",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                Start Remediation Module →
              </button>
            </div>
          ) : (
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.s1, textTransform: "uppercase" }}>
                  Benchmarks Met
                </span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.dark }}>
                All target competency benchmarks met!
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                Keep exploring advanced electives in the course catalog.
              </div>
            </div>
          )}

          {/* Recent Milestones Timeline */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.dark }}>
                Recent Milestones
              </h4>
              <Link
                to="/student/progress"
                style={{ fontSize: 11.5, color: C.accent, fontWeight: 600, textDecoration: "none" }}
              >
                View Analytics →
              </Link>
            </div>

            {practiceSubmissions.length === 0 && !lastAssessment ? (
              <div style={{ textAlign: "center", padding: "18px 0", color: C.muted, fontSize: 12 }}>
                Take your diagnostic or practice quizzes to record milestones.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {practiceSubmissions.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: "10px 12px",
                      background: C.bg,
                      borderRadius: 8,
                      borderLeft: `3px solid ${C.s1}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.dark }}>
                        {p.domainName}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.s1,
                        }}
                      >
                        {p.score}% Mastery
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                      +{p.deltaDomain} pts growth • {new Date(p.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                ))}

                {lastAssessment && (
                  <div
                    style={{
                      padding: "10px 12px",
                      background: C.bg,
                      borderRadius: 8,
                      borderLeft: `3px solid ${C.accent}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.dark }}>
                        Diagnostic Assessment
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.accent,
                        }}
                      >
                        {lastAssessment.score}% Baseline
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                      {lastAssessment.correctAnswers} of {lastAssessment.totalQuestions} verified • Verified
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* GyanMarg AI Study Companion */}
          <div
            style={{
              background: "#FAF7F0",
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: C.accent,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ✦
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>
                GyanMarg AI Learning Mentor
              </div>
            </div>

            <p style={{ margin: "0 0 12px", fontSize: 12, color: C.muted, lineHeight: 1.45 }}>
              Need clarification on complex concepts or instant quiz practice based on your syllabus?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button
                onClick={() => navigate("/student/assessment")}
                style={{
                  textAlign: "left",
                  padding: "7px 10px",
                  borderRadius: 6,
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  fontSize: 11.5,
                  color: C.dark,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Take Quick Diagnostic Check
              </button>
              <button
                onClick={() => navigate("/student/gap-analysis")}
                style={{
                  textAlign: "left",
                  padding: "7px 10px",
                  borderRadius: 6,
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  fontSize: 11.5,
                  color: C.dark,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Inspect Detailed Domain Deficits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
