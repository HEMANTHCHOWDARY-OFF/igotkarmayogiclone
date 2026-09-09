import { useMemo } from "react";
import { C, FONT } from "@/tokens";
import { useAuth } from "@/context/AuthContext";
import { useCompetency } from "@/context/CompetencyContext";
import { getCoursesByTitlesOrIds, type IGOTCatalogCourse } from "@/services/karmayogiCoursesService";
import { Link } from "react-router";

function generateHeatmap() {
  return Array.from({ length: 30 }, () => {
    const r = Math.random();
    return r > 0.6 ? 3 : r > 0.35 ? 2 : r > 0.15 ? 1 : 0;
  });
}

const heatmapData = generateHeatmap();

const heatColor = (level: number) => {
  if (level === 3) return C.dark;
  if (level === 2) return C.s1;
  if (level === 1) return "#A8D5B5";
  return C.border;
};

export default function Achievements() {
  const { profile } = useAuth();
  const { domains, lastAssessment, getSkillHealthScore } = useCompetency();

  const skillHealth = getSkillHealthScore();

  const selectedCourseIds = useMemo(() => {
    return (profile?.interestedCourses || []).map(String);
  }, [profile?.interestedCourses]);

  const userSelectedCourses: IGOTCatalogCourse[] = useMemo(() => {
    return getCoursesByTitlesOrIds(selectedCourseIds);
  }, [selectedCourseIds]);

  const primaryDomain = domains[0]?.name || "Core Domain";
  const secondaryDomain = domains[1]?.name || "Specialized Domain";

  const earnedBadges = useMemo(() => {
    return [
      { id: 1, label: "Curriculum Selected", icon: "🎯", date: "Recent", hint: `${userSelectedCourses.length} courses tailored` },
      { id: 2, label: "Diagnostic Milestone", icon: "📋", date: "Recent", hint: `${domains.length} domains assessed` },
      { id: 3, label: `${primaryDomain.split(" ")[0]} Explorer`, icon: "🏆", date: "May 2026", hint: `Foundational mastery in ${primaryDomain}` },
    ];
  }, [userSelectedCourses, domains, primaryDomain]);

  const lockedBadges = useMemo(() => {
    return [
      {
        id: 4,
        label: "Curriculum Finisher",
        icon: "📚",
        progress: userSelectedCourses.length > 0 ? 35 : 10,
        hint: `Complete all ${userSelectedCourses.length || 5} selected courses`,
      },
      {
        id: 5,
        label: `${secondaryDomain.split(" ")[0]} Specialist`,
        icon: "⚡",
        progress: 50,
        hint: `Achieve 80+ benchmark in ${secondaryDomain}`,
      },
      {
        id: 6,
        label: "Excellence in Assessment",
        icon: "💯",
        progress: lastAssessment ? lastAssessment.score : 70,
        hint: "Score 90% or above on domain diagnostic",
      },
      {
        id: 7,
        label: "Capacity Building Streak",
        icon: "🔥",
        progress: 60,
        hint: "Study 7 consecutive days",
      },
      {
        id: 8,
        label: "Public Service Leader",
        icon: "🏛️",
        progress: 40,
        hint: "Complete governance & leadership modules",
      },
      {
        id: 9,
        label: "iGOT Certified Scholar",
        icon: "🏅",
        progress: 25,
        hint: "Earn certificates across your selected curriculum",
      },
    ];
  }, [userSelectedCourses, secondaryDomain, lastAssessment]);

  const milestones = useMemo(() => {
    return [
      { label: "Account Created & Profile Setup", date: "Jun 1, 2026", done: true },
      { label: `Curriculum Selected (${userSelectedCourses.length} Courses)`, date: "Active", done: true },
      { label: `Domain Baseline Assessed (${domains.length} Domains)`, date: lastAssessment ? "Completed" : "In Progress", done: !!lastAssessment },
      { label: "First Course Certificate", date: "Pending Completion", done: false },
    ];
  }, [userSelectedCourses, domains, lastAssessment]);

  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, fontFamily: FONT.display, margin: 0 }}>
            Achievements & Milestones
          </h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 13.5 }}>
            {earnedBadges.length} of {earnedBadges.length + lockedBadges.length} badges earned · Based on your {userSelectedCourses.length} selected courses
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              background: C.dark,
              color: "#fff",
              borderRadius: 20,
              padding: "8px 20px",
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            🏆 Level 2 — {skillHealth >= 75 ? "Proficient" : "Developing"} ({skillHealth}%)
          </div>
          <Link
            to="/student/interested-courses"
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: `1.5px solid ${C.accent}`,
              color: C.accent,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Modify Courses
          </Link>
        </div>
      </div>

      {/* Earned Badges */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: FONT.display }}>
          Earned Badges
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {earnedBadges.map((b) => (
            <div
              key={b.id}
              style={{
                background: C.dark,
                borderRadius: 12,
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 40 }}>{b.icon}</div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  textAlign: "center",
                  fontFamily: FONT.display,
                }}
              >
                {b.label}
              </div>
              <div style={{ fontSize: 11.5, color: "#D5F0DE", textAlign: "center" }}>
                {b.hint}
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  color: "#D5F0DE",
                  fontSize: 11.5,
                }}
              >
                Earned {b.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Locked Badges */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: FONT.display }}>
          Curriculum Milestone Badges (In Progress)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {lockedBadges.map((b) => (
            <div
              key={b.id}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "18px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 28, opacity: 0.55 }}>{b.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.dark, fontWeight: 700, fontSize: 13.5 }}>{b.label}</div>
                  <div style={{ color: C.muted, fontSize: 11.5, marginTop: 2 }}>🔒 {b.hint}</div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.faint }}>Progress</span>
                  <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>{b.progress}%</span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 4,
                      background: C.accent,
                      width: `${b.progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones & Activity Heatmap */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Milestone Tracker */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: C.dark, fontFamily: FONT.display }}>
            Program Milestones
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: m.done ? C.s1 : C.border,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {m.done ? "✓" : idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: m.done ? C.dark : C.muted }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.faint }}>{m.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Activity Heatmap */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", color: C.dark, fontFamily: FONT.display }}>
            30-Day Learning Activity
          </h3>
          <p style={{ fontSize: 12.5, color: C.muted, margin: "0 0 16px" }}>
            Consistency on your selected capacity-building track
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 }}>
            {heatmapData.map((val, i) => (
              <div
                key={i}
                title={`Day ${i + 1}: ${val === 3 ? "Extensive" : val === 2 ? "Active" : val === 1 ? "Light" : "No"} activity`}
                style={{
                  height: 22,
                  borderRadius: 4,
                  background: heatColor(val),
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 14, fontSize: 11.5, color: C.muted }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.border }} /> Less
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#A8D5B5" }} />
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.s1 }} />
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.dark }} /> More
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
