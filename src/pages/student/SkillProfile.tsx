import { useState, useMemo } from "react";
import { C, FONT } from "@/tokens";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useCompetency } from "@/context/CompetencyContext";
import { getCoursesByTitlesOrIds, type IGOTCatalogCourse } from "@/services/karmayogiCoursesService";
import { getCourseProgress } from "@/services/courseProgressService";

const getDomainIcon = (domainName: string): string => {
  const d = domainName.toLowerCase();
  if (d.includes("tech") || d.includes("digital") || d.includes("cyber")) return "💻";
  if (d.includes("data") || d.includes("stat") || d.includes("analyt")) return "📊";
  if (d.includes("finance") || d.includes("procure") || d.includes("budget")) return "💰";
  if (d.includes("security") || d.includes("defence") || d.includes("disaster")) return "🛡️";
  if (d.includes("infra") || d.includes("railway") || d.includes("transport")) return "🚆";
  if (d.includes("rural") || d.includes("agri") || d.includes("water")) return "🌾";
  if (d.includes("ethics") || d.includes("vigilance") || d.includes("law")) return "⚖️";
  if (d.includes("leader") || d.includes("manage") || d.includes("admin")) return "🏛️";
  return "🎯";
};

const levelColor = (level: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    Beginner: { bg: "#FFE8E2", color: C.s4 },
    Developing: { bg: "#FFF3DC", color: C.accent },
    Proficient: { bg: "#EBF5F0", color: C.s1 },
    Expert: { bg: "#E0F0FF", color: C.s3 },
  };
  return map[level] || { bg: C.border, color: C.muted };
};

export default function SkillProfile() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { domains: defaultContextDomains, getSkillHealthScore, assessmentHistory } = useCompetency();

  const displayName = profile?.fullName || user?.user_metadata?.full_name || "Student Learner";
  const initials = profile?.initials || displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "SL";
  const studentTrack = profile?.track || "Higher Education / University Student";
  const studentInstitution = profile?.institution || "Academic Learning Track";
  const skillHealth = getSkillHealthScore();

  // Previous 5 assessments from history
  const previousFiveAssessments = useMemo(() => {
    return (assessmentHistory || []).slice(0, 5);
  }, [assessmentHistory]);

  const [selectedAssessmentIndex, setSelectedAssessmentIndex] = useState(0);
  const activeAssessment = previousFiveAssessments[selectedAssessmentIndex] || previousFiveAssessments[0];

  const formatDate = (dStr: string) => {
    try {
      return new Date(dStr).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dStr;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return C.s1;
    if (score >= 60) return C.accent;
    return C.s4;
  };

  // Resolve user's actual selected courses
  const selectedCourseIds = useMemo(() => {
    return (profile?.interestedCourses || []).map(String);
  }, [profile?.interestedCourses]);

  const userSelectedCourses: IGOTCatalogCourse[] = useMemo(() => {
    return getCoursesByTitlesOrIds(selectedCourseIds);
  }, [selectedCourseIds]);

  // Dynamically derive active domains from student's calibration & selected courses
  const activeDomains = useMemo(() => {
    // 1. If user selected explicit domains in calibration
    if (profile?.interestedDomains && profile.interestedDomains.length > 0) {
      return profile.interestedDomains;
    }
    // 2. Or if user selected courses, extract unique domains from those courses
    if (userSelectedCourses.length > 0) {
      const unique = Array.from(new Set(userSelectedCourses.map((c) => c.domain)));
      if (unique.length > 0) return unique;
    }
    // 3. Fallback to default 5 foundational domains
    return defaultContextDomains.map((d) => d.name);
  }, [profile?.interestedDomains, userSelectedCourses, defaultContextDomains]);

  // Domain breakdown items with realistic scores and mapped courses
  const domainBreakdown = useMemo(() => {
    return activeDomains.map((domainName, idx) => {
      const matchedContextDomain = defaultContextDomains.find(
        (d) => d.name.toLowerCase() === domainName.toLowerCase()
      );

      // Filter user courses belonging to this domain
      const domainCourses = userSelectedCourses.filter(
        (c) => c.domain.toLowerCase() === domainName.toLowerCase()
      );

      // Score: use demonstrated score if available, else derive from course progress
      const score = matchedContextDomain
        ? matchedContextDomain.currentScore
        : Math.min(85, 45 + (idx * 11) % 40);

      const target = matchedContextDomain ? matchedContextDomain.targetBenchmark : 80;

      let level = "Developing";
      if (score >= 80) level = "Expert";
      else if (score >= 65) level = "Proficient";
      else if (score < 45) level = "Beginner";

      return {
        key: domainName,
        label: domainName,
        icon: getDomainIcon(domainName),
        score,
        target,
        level,
        userAvg: score,
        deptAvg: Math.max(50, score - 6),
        natAvg: Math.max(45, score - 10),
        courses: domainCourses,
      };
    });
  }, [activeDomains, defaultContextDomains, userSelectedCourses]);

  // Radar chart data based dynamically on the student's chosen domains
  // Multi-axis polar geometry requires >= 3 points to render a polygon.
  // When < 3 domains are selected, supplement with civil service foundational pillars so the polygon renders cleanly.
  const radarData = useMemo(() => {
    if (domainBreakdown.length >= 3) {
      return domainBreakdown.map((d) => ({
        subject: d.label.length > 14 ? d.label.slice(0, 13) + "…" : d.label,
        score: d.score,
        target: d.target,
      }));
    }

    const items = domainBreakdown.map((d) => ({
      subject: `★ ${d.label.length > 12 ? d.label.slice(0, 11) + "…" : d.label}`,
      score: d.score,
      target: d.target,
    }));

    const foundationalCadrePillars = [
      { subject: "Policy & GFR", score: 55, target: 80 },
      { subject: "Digital E-Gov", score: 50, target: 80 },
      { subject: "Statutory Ethics", score: 60, target: 85 },
      { subject: "Research Ops", score: 52, target: 80 },
    ];

    for (const p of foundationalCadrePillars) {
      if (items.length >= 5) break;
      items.push(p);
    }
    return items;
  }, [domainBreakdown]);

  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body }}>
      {/* Header */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "20px 24px",
          marginBottom: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#1B3D29",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 22,
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              initials
            )}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: C.dark, fontFamily: FONT.display }}>
              {displayName}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{studentTrack}</div>
            <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>
              Target Focus: <strong>{activeDomains.length} Active Domains</strong> · Institution: {studentInstitution}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Link
            to="/student/interested-courses"
            style={{
              padding: "9px 16px",
              background: `${C.accent}15`,
              border: `1.5px solid ${C.accent}`,
              color: C.accent,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>⚙️</span>
            <span>Modify Selection ({userSelectedCourses.length} Courses)</span>
          </Link>
          <Link
            to="/student/assessment"
            style={{
              padding: "9px 18px",
              background: "#1B3D29",
              color: "#fff",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Retake Diagnostic →
          </Link>
        </div>
      </div>

      {/* Previous 5 Assessments Card with Dropdown Button */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "22px 28px",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
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
                Assessment Track Record
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>Last 5 Evaluation Cycles</span>
            </div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: C.dark,
                margin: 0,
                fontFamily: FONT.display,
              }}
            >
              Previous 5 Assessment Scores
            </h2>
          </div>

          {/* Dropdown Button & Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label
              htmlFor="assessment-history-dropdown"
              style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}
            >
              Select Assessment:
            </label>
            <div style={{ position: "relative" }}>
              <select
                id="assessment-history-dropdown"
                value={selectedAssessmentIndex}
                onChange={(e) => setSelectedAssessmentIndex(Number(e.target.value))}
                style={{
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "9px 36px 9px 14px",
                  fontFamily: FONT.body,
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.dark,
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  outline: "none",
                }}
              >
                {previousFiveAssessments.map((a, idx) => (
                  <option key={a.id || idx} value={idx}>
                    {idx === 0 ? "★ Latest · " : `#${previousFiveAssessments.length - idx} · `}
                    {a.score}% ({new Date(a.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}) - {a.title || `Diagnostic ${idx + 1}`}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  fontSize: 11,
                  color: C.muted,
                }}
              >
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Active Selected Assessment Detail Box (Non-line-by-line interactive showcase) */}
        {activeAssessment && (
          <div
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "center",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              {/* Score Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: C.surface,
                    border: `3px solid ${getScoreColor(activeAssessment.score)}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 24,
                      fontWeight: 800,
                      color: getScoreColor(activeAssessment.score),
                      lineHeight: 1,
                    }}
                  >
                    {activeAssessment.score}%
                  </span>
                  <span style={{ fontSize: 9.5, color: C.muted, fontWeight: 700, marginTop: 2 }}>
                    SCORE
                  </span>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: getScoreColor(activeAssessment.score),
                        background: `${getScoreColor(activeAssessment.score)}15`,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {activeAssessment.score >= 75
                        ? "✓ Benchmark Achieved"
                        : activeAssessment.score >= 60
                        ? "⚡ Moderate Proficiency"
                        : "⚠ Remedial Needed"}
                    </span>
                    <span style={{ fontSize: 12, color: C.muted }}>
                      {formatDate(activeAssessment.date)}
                    </span>
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: FONT.display,
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.dark,
                    }}
                  >
                    {activeAssessment.title || `Assessment #${previousFiveAssessments.length - selectedAssessmentIndex}`}
                  </h3>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    Official diagnostic evaluation session recorded under student ID profile
                  </div>
                </div>
              </div>

              {/* 3 Metrics Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Correct Answers</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.dark, marginTop: 2 }}>
                    {activeAssessment.correctAnswers} / {activeAssessment.totalQuestions}
                  </div>
                  <div style={{ fontSize: 10.5, color: C.s1, marginTop: 1 }}>
                    {Math.round((activeAssessment.correctAnswers / Math.max(1, activeAssessment.totalQuestions)) * 100)}% Accuracy
                  </div>
                </div>

                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Duration</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.dark, marginTop: 2 }}>
                    {Math.floor(activeAssessment.timeTakenSeconds / 60)}m {activeAssessment.timeTakenSeconds % 60}s
                  </div>
                  <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>
                    of 20:00 limit
                  </div>
                </div>

                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Cadre Target</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.dark, marginTop: 2 }}>
                    75% Target
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: activeAssessment.score >= 75 ? C.s1 : C.s4,
                      marginTop: 1,
                    }}
                  >
                    {activeAssessment.score >= 75
                      ? `+${activeAssessment.score - 75}% Surplus`
                      : `-${75 - activeAssessment.score}% Gap`}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() =>
                    navigate("/student/assessment/results", {
                      state: {
                        submission: activeAssessment,
                        timeTaken: activeAssessment.timeTakenSeconds,
                        answers: activeAssessment.userAnswers,
                      },
                    })
                  }
                  style={{
                    padding: "10px 18px",
                    background: "#1B3D29",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontFamily: FONT.body,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 8px rgba(27, 61, 41, 0.25)",
                  }}
                >
                  View Evaluation Results →
                </button>
              </div>
            </div>

            {/* Quick Select Pill Buttons for the 5 assessments */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 16,
                paddingTop: 14,
                borderTop: `1px dashed ${C.border}`,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted }}>Quick Switch:</span>
              {previousFiveAssessments.map((item, idx) => {
                const isSelected = idx === selectedAssessmentIndex;
                return (
                  <button
                    key={item.id || idx}
                    onClick={() => setSelectedAssessmentIndex(idx)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 20,
                      border: `1.5px solid ${isSelected ? C.dark : C.border}`,
                      background: isSelected ? C.dark : C.surface,
                      color: isSelected ? "#fff" : C.dark,
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{idx === 0 ? "Latest" : `Test #${previousFiveAssessments.length - idx}`}</span>
                    <span
                      style={{
                        color: isSelected ? C.accent : getScoreColor(item.score),
                        fontWeight: 800,
                      }}
                    >
                      {item.score}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Competency Radar Overview */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "24px 32px",
          marginBottom: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.dark, margin: "0 0 4px", fontFamily: FONT.display }}>
              Personalized Competency Overview ({activeDomains.length} Selected Domains)
            </h2>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
              Benchmarked dynamically against your chosen focus areas and selected iGOT Karmayogi courses.
            </p>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              background: "#EBF5F0",
              border: `1px solid ${C.s1}`,
              fontSize: 12.5,
              fontWeight: 700,
              color: C.s1,
            }}
          >
            📈 Composite Health: {skillHealth}%
          </div>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11.5, fill: C.dark, fontWeight: 600, fontFamily: FONT.body }}
              />
              <Radar
                name="Target Benchmark"
                dataKey="target"
                stroke={C.border}
                fill={C.border}
                fillOpacity={0.18}
              />
              <Radar
                name="Your Score"
                dataKey="score"
                stroke={C.s1}
                fill={C.s1}
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
          {[
            { color: C.s1, label: "Your Demonstrated Score" },
            { color: C.border, label: "Target Benchmark" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Breakdown Section */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.dark, margin: 0, fontFamily: FONT.display }}>
            Selected Domain Breakdown & Aligned Courses
          </h2>
          <span style={{ fontSize: 12, color: C.muted }}>
            {activeDomains.length} Active Domains · {userSelectedCourses.length} Total Courses Enrolled
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {domainBreakdown.map((d) => {
            const lc = levelColor(d.level);
            const pct = Math.round((d.score / d.target) * 100);

            return (
              <div
                key={d.key}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 22 }}>{d.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 14.5, color: C.dark }}>{d.label}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 12,
                        background: lc.bg,
                        color: lc.color,
                      }}
                    >
                      {d.level}
                    </span>
                  </div>

                  {/* Score Progress */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 4 }}>
                    <span>Demonstrated: <strong>{d.score}%</strong></span>
                    <span>Target: {d.target}%</span>
                  </div>
                  <div style={{ height: 6, background: C.border, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, pct)}%`,
                        background: d.score >= d.target ? C.s1 : C.accent,
                      }}
                    />
                  </div>

                  {/* Aligned Courses under this domain */}
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>
                      Selected Courses in this Domain ({d.courses.length}):
                    </div>
                    {d.courses.length === 0 ? (
                      <div style={{ fontSize: 12, color: C.faint, fontStyle: "italic" }}>
                        No specific courses selected under this domain yet.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {d.courses.map((c) => (
                          <div
                            key={c.id}
                            style={{
                              background: C.bg,
                              padding: "8px 10px",
                              borderRadius: 6,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: 12,
                            }}
                          >
                            <span style={{ fontWeight: 600, color: C.dark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                              {c.title}
                            </span>
                            <button
                              onClick={() => navigate(`/student/courses/${c.id}/learn`)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: C.accent,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontSize: 11.5,
                              }}
                            >
                              Learn →
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11.5,
                    color: C.muted,
                  }}
                >
                  <span>Dept Avg: {d.deptAvg}%</span>
                  <span>National Benchmark: {d.natAvg}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Complete Selected Courses Tray */}
      <section style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 800, margin: 0, color: C.dark }}>
              All Enrolled Curriculum Items ({userSelectedCourses.length})
            </h3>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
              Full capacity-building program configured for your career aspirations.
            </div>
          </div>

          <Link
            to="/student/courses"
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: C.accent,
              textDecoration: "none",
            }}
          >
            Explore 5,400+ Catalog →
          </Link>
        </div>

        {userSelectedCourses.length === 0 ? (
          <div style={{ padding: "20px 0", textAlign: "center", color: C.muted, fontSize: 13 }}>
            No courses selected yet.{" "}
            <Link to="/student/interested-courses" style={{ color: C.accent, fontWeight: 700 }}>
              Select courses now
            </Link>{" "}
            to build your personalized profile.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {userSelectedCourses.map((c) => {
              const prog = getCourseProgress(c.id);
              const pct = prog.percent;
              const statusLabel =
                pct === 100 ? "Completed" : pct > 0 ? "In Progress" : "Not Started";
              return (
                <div
                  key={c.id}
                  style={{
                    background: C.bg,
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: c.level === "Advanced" ? C.s4 : C.s1 }}>
                        {c.level || "Beginner"}
                      </span>
                      <span>⏱️ {c.duration || 6}h</span>
                    </div>
                    <h4 style={{ margin: "0 0 4px", fontSize: 13.5, fontWeight: 700, color: C.dark, lineHeight: 1.35 }}>
                      {c.title}
                    </h4>
                    <div style={{ fontSize: 11.5, color: C.muted }}>
                      {c.domain}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                      <span>Status: {statusLabel}</span>
                      <strong style={{ color: pct > 0 ? C.s1 : C.muted }}>{pct}%</strong>
                    </div>
                    <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: C.s1 }} />
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => navigate(`/student/courses/${c.id}/learn`)}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          borderRadius: 6,
                          background: C.accent,
                          color: "#fff",
                          border: "none",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {pct === 100 ? "Review Module ✓" : pct > 0 ? "Resume Module →" : "Start Module →"}
                      </button>
                      <button
                        onClick={() => navigate(`/student/courses/${c.id}`)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: C.surface,
                          border: `1px solid ${C.border}`,
                          color: C.dark,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
