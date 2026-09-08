import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import { IGOT_COURSES, IGOTCourse } from "@/data/igotCourses";
import { useCompetency } from "@/context/CompetencyContext";

const domains = [
  "Applied Statistics & Sampling Theory",
  "SQL & Database Operations",
  "Python & Data Analytics",
  "GIS & Spatial Analysis",
  "Public Data Ethics & DPDP Act 2023",
];

const levels = ["Beginner", "Intermediate", "Advanced"];
const durations = ["< 6h", "6–10h", "10h+"];

const levelColor = (level: string) => {
  if (level === "Beginner") return { bg: "#EBF5F0", color: C.s1 };
  if (level === "Intermediate") return { bg: "#FFF3DC", color: C.accent };
  return { bg: "#FFE8E2", color: C.s4 };
};

export default function CourseDiscovery() {
  const navigate = useNavigate();
  const { getGapMetrics } = useCompetency();

  const [search, setSearch] = useState("");
  const [selDomains, setSelDomains] = useState<string[]>([]);
  const [selLevels, setSelLevels] = useState<string[]>([]);
  const [selDurations, setSelDurations] = useState<string[]>([]);
  const [onlyTPAC, setOnlyTPAC] = useState(false);
  const [sort, setSort] = useState("GapPriority");

  const gapMetrics = useCompetency().getGapMetrics();
  const gapMap = useMemo(() => {
    const map: Record<string, { gap: number; severity: "Critical" | "Minor" | "Met" }> = {};
    gapMetrics.forEach((m) => {
      map[m.domainId] = { gap: m.gap, severity: m.severity };
    });
    return map;
  }, [gapMetrics]);

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = IGOT_COURSES.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.desc.toLowerCase().includes(search.toLowerCase()) && !c.courseCode.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selDomains.length && !selDomains.includes(c.domain)) return false;
      if (selLevels.length && !selLevels.includes(c.level)) return false;
      if (onlyTPAC && !c.tpacEndorsed) return false;
      if (selDurations.length) {
        const matched = selDurations.some((d) => {
          if (d === "< 6h") return c.duration < 6;
          if (d === "6–10h") return c.duration >= 6 && c.duration <= 10;
          return c.duration > 10;
        });
        if (!matched) return false;
      }
      return true;
    });

    if (sort === "GapPriority") {
      result.sort((a, b) => {
        const gapA = gapMap[a.domainId]?.gap || 0;
        const gapB = gapMap[b.domainId]?.gap || 0;
        return gapB - gapA; // Largest gap first
      });
    } else if (sort === "Rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "Enrolled") {
      result.sort((a, b) => b.enrolled - a.enrolled);
    } else if (sort === "DurationAsc") {
      result.sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [search, selDomains, selLevels, selDurations, onlyTPAC, sort, gapMap]);

  // Identify highest gap domain for recommendation banner
  const highestGapMetric = gapMetrics[0];

  const CheckItem = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8 }}>
      <div
        onClick={onChange}
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `2px solid ${checked ? C.s1 : C.border}`,
          background: checked ? C.s1 : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        {checked && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
      </div>
      <span style={{ fontSize: 12.5, color: C.dark, lineHeight: 1.3 }}>{label}</span>
    </label>
  );

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body, display: "flex", gap: 24 }}>
      {/* Left Filter Sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "20px 18px",
          alignSelf: "flex-start",
          position: "sticky",
          top: 24,
        }}
      >
        <div style={{ fontWeight: 700, color: C.dark, fontSize: 15, marginBottom: 16, fontFamily: FONT.display }}>
          Catalog Filters
        </div>

        {/* Search */}
        <div style={{ marginBottom: 18 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 20+ courses…"
            style={{
              width: "100%",
              padding: "8px 10px",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 12.5,
              color: C.dark,
              background: C.bg,
              outline: "none",
              boxSizing: "border-box",
              fontFamily: FONT.body,
            }}
          />
        </div>

        {/* TPAC Endorsement Filter */}
        <div style={{ marginBottom: 18, padding: "10px", background: "#1B3D290F", borderRadius: 8, border: "1px solid #1B3D2925" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={onlyTPAC}
              onChange={(e) => setOnlyTPAC(e.target.checked)}
              style={{ width: 15, height: 15, accentColor: "#1B3D29" }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1B3D29" }}>
              🎖️ NSSTA TPAC Endorsed Only
            </span>
          </label>
        </div>

        <FilterSection title="Competency Domain">
          {domains.map((d) => (
            <CheckItem
              key={d}
              label={d}
              checked={selDomains.includes(d)}
              onChange={() => toggle(selDomains, d, setSelDomains)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Difficulty Level">
          {levels.map((l) => (
            <CheckItem
              key={l}
              label={l}
              checked={selLevels.includes(l)}
              onChange={() => toggle(selLevels, l, setSelLevels)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Duration">
          {durations.map((d) => (
            <CheckItem
              key={d}
              label={d}
              checked={selDurations.includes(d)}
              onChange={() => toggle(selDurations, d, setSelDurations)}
            />
          ))}
        </FilterSection>

        <button
          onClick={() => {
            setSearch("");
            setSelDomains([]);
            setSelLevels([]);
            setSelDurations([]);
            setOnlyTPAC(false);
          }}
          style={{
            width: "100%",
            padding: "8px",
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            fontSize: 12,
            color: C.muted,
            cursor: "pointer",
            fontFamily: FONT.body,
          }}
        >
          Reset Filters
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header & Gap Recommendation Banner */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    background: "#1B3D29",
                    color: "#fff",
                    padding: "3px 8px",
                    borderRadius: 4,
                  }}
                >
                  GyanMarg Universal Learning Catalog
                </span>
                <span style={{ fontSize: 12, color: C.muted }}>22 Specialized Programs</span>
              </div>
              <h1 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 800, margin: 0, color: C.dark }}>
                Personalized Course Recommendations
              </h1>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: C.muted }}>Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  fontSize: 13,
                  fontFamily: FONT.body,
                  color: C.dark,
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="GapPriority">🎯 Personalized (Gap Priority)</option>
                <option value="Rating">⭐ Rating (Highest)</option>
                <option value="Enrolled">👥 Most Enrolled</option>
                <option value="DurationAsc">⏱️ Duration (Shortest)</option>
              </select>
            </div>
          </div>

          {/* AI Gap Remediation Alert Banner */}
          {highestGapMetric && highestGapMetric.gap > 0 && (
            <div
              style={{
                background: "#1B3D29",
                borderRadius: 12,
                padding: "16px 20px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                boxShadow: "0 4px 12px rgba(27, 61, 41, 0.15)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 16 }}>🎯</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>
                    AI Remediation Engine Active
                  </span>
                  <span
                    style={{
                      background: C.accent,
                      color: "#1B3D29",
                      padding: "1px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    Priority #1
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#D4E8D8" }}>
                  Courses addressing your <strong>{highestGapMetric.gap}% measured gap</strong> in{" "}
                  <strong>{highestGapMetric.domain}</strong> are highlighted and ranked first in the feed below.
                </div>
              </div>
              <button
                onClick={() => navigate("/student/gap-analysis")}
                style={{
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Review Gap Radar →
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div style={{ fontSize: 13, color: C.muted }}>
          Showing <strong>{filteredCourses.length}</strong> available programs
        </div>

        {/* Course Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
          {filteredCourses.map((course) => {
            const gapInfo = gapMap[course.domainId];
            const hasGap = gapInfo && gapInfo.gap > 0;
            const isCritical = gapInfo?.severity === "Critical";

            return (
              <div
                key={course.id}
                style={{
                  background: C.surface,
                  border: `1.5px solid ${isCritical ? C.s4 + "55" : hasGap ? C.accent + "55" : C.border}`,
                  borderRadius: 14,
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  position: "relative",
                  boxShadow: isCritical ? "0 2px 10px rgba(186, 26, 26, 0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                {/* Top Badges Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: levelColor(course.level).color,
                        background: levelColor(course.level).bg,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {course.level}
                    </span>

                    {course.tpacEndorsed && (
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: "#1B3D29",
                          background: "#E6F4EC",
                          border: "1px solid #1B3D2944",
                          padding: "2px 8px",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        🎖️ NSSTA TPAC Endorsed
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono, fontWeight: 600 }}>
                    {course.courseCode}
                  </span>
                </div>

                {/* Course Title */}
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: C.dark, lineHeight: 1.35 }}>
                    <Link to={`/student/courses/${course.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {course.title}
                    </Link>
                  </h3>
                  <div style={{ fontSize: 12, color: C.muted }}>{course.dept}</div>
                </div>

                {/* Gap Justification Banner (Feature 8 Specification) */}
                {hasGap ? (
                  <div
                    style={{
                      padding: "8px 12px",
                      background: isCritical ? "#FDECEA" : "#FEF3E2",
                      borderRadius: 8,
                      borderLeft: `3px solid ${isCritical ? C.s4 : C.accent}`,
                      fontSize: 12,
                      color: C.dark,
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: isCritical ? C.s4 : C.accent }}>
                      {isCritical ? "🔴 Critical Remediation: " : "🟡 Targeted Remediation: "}
                    </span>
                    Bridges your <strong>{gapInfo.gap}% competency gap</strong> in {course.domain}.
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "6px 12px",
                      background: "#E6F4EC66",
                      borderRadius: 8,
                      fontSize: 11.5,
                      color: C.s1,
                      fontWeight: 500,
                    }}
                  >
                    ✓ FrAC Benchmark met ({course.domain}) · Recommended for continuous proficiency.
                  </div>
                )}

                {/* Description */}
                <p style={{ margin: 0, fontSize: 13, color: C.dark, lineHeight: 1.5, opacity: 0.85 }}>
                  {course.desc}
                </p>

                {/* Meta details: Duration, Enrolled, Rating */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontSize: 12,
                    color: C.muted,
                    paddingTop: 10,
                    borderTop: `1px solid ${C.border}`,
                  }}
                >
                  <span>⏱️ <strong>{course.duration}h</strong> total</span>
                  <span>👥 <strong>{course.enrolled.toLocaleString()}</strong> enrolled students</span>
                  <span>⭐ <strong>{course.rating}</strong> ({course.reviews})</span>
                  <span>📚 {course.modulesCount} modules</span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                  <button
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      background: "#1B3D29",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: FONT.body,
                      textAlign: "center",
                    }}
                  >
                    Enroll & Begin Module →
                  </button>

                  <button
                    onClick={() => {
                      alert(`[iGOT Karmayogi Deep Link]\nSimulating direct single-sign-on launch to course ${course.courseCode} on the official iGOT Karmayogi portal.`);
                    }}
                    title="Simulate official iGOT Karmayogi portal deep link"
                    style={{
                      padding: "10px 14px",
                      background: "transparent",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.dark,
                      cursor: "pointer",
                      fontFamily: FONT.body,
                    }}
                  >
                    iGOT ↗
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
