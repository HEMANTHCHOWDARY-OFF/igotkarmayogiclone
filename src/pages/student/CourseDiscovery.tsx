import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import {
  queryKarmayogiCourses,
  igotTaxonomy,
  TOTAL_IGOT_COURSES_COUNT,
  type IGOTCatalogCourse,
} from "@/services/karmayogiCoursesService";
import { useCompetency } from "@/context/CompetencyContext";
import { useAuth } from "@/context/AuthContext";

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
  const { profile, saveCalibration } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedSubDomain, setSelectedSubDomain] = useState<string>("all");
  const [selLevels, setSelLevels] = useState<string[]>([]);
  const [selDurations, setSelDurations] = useState<string[]>([]);
  const [onlyTPAC, setOnlyTPAC] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState("Recommended");

  // Track locally selected courses
  const selectedCourseIds = useMemo(() => {
    return (profile?.interestedCourses || []).map(String);
  }, [profile?.interestedCourses]);

  const gapMetrics = getGapMetrics();
  const gapMap = useMemo(() => {
    const map: Record<string, { gap: number; severity: "Critical" | "Minor" | "Met" }> = {};
    gapMetrics.forEach((m) => {
      map[m.domainId] = { gap: m.gap, severity: m.severity };
    });
    return map;
  }, [gapMetrics]);

  // Sub-domains for currently active domain
  const activeSubDomains = useMemo(() => {
    if (selectedDomain === "all") return [];
    const dom = igotTaxonomy.find((d) => d.name === selectedDomain);
    return dom?.subDomains || [];
  }, [selectedDomain]);

  // Recommended titles from profile AI recommendations
  const recommendedTitles = useMemo(() => {
    const recs = profile?.aiRecommendations?.recommendedCourses;
    if (Array.isArray(recs)) {
      return recs.map((r: any) => r.title);
    }
    return [];
  }, [profile?.aiRecommendations]);

  // Filter courses via queryKarmayogiCourses
  const catalogResult = useMemo(() => {
    const domainsFilter = selectedDomain !== "all" ? [selectedDomain] : [];
    const subDomainsFilter = selectedSubDomain !== "all" ? [selectedSubDomain] : [];
    const levelFilter = selLevels.length === 1 ? selLevels[0] : "all";

    return queryKarmayogiCourses({
      query: search,
      domains: domainsFilter,
      subDomains: subDomainsFilter,
      level: levelFilter,
      page,
      pageSize: 18,
      recommendedTitles,
    });
  }, [search, selectedDomain, selectedSubDomain, selLevels, page, recommendedTitles]);

  // Handle toggling course into/out of student's learning path
  const handleToggleCourse = async (courseId: string) => {
    const isCurrentlySelected = selectedCourseIds.includes(courseId);
    const newCourseIds = isCurrentlySelected
      ? selectedCourseIds.filter((id) => id !== courseId)
      : [...selectedCourseIds, courseId];

    await saveCalibration({
      courseIds: newCourseIds,
      domains: profile?.interestedDomains || [],
      subDomains: profile?.interestedSubDomains || [],
      aiAnalysis: profile?.aiRecommendations,
    });
  };

  const highestGapMetric = gapMetrics[0];

  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body, display: "flex", gap: 24 }}>
      {/* Left Filter Sidebar */}
      <aside
        style={{
          width: 250,
          flexShrink: 0,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "20px 18px",
          alignSelf: "flex-start",
          position: "sticky",
          top: 24,
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: C.dark, fontSize: 15, fontFamily: FONT.display }}>
            Catalog Filters
          </div>
          {(selectedDomain !== "all" || search || selLevels.length > 0) && (
            <button
              onClick={() => {
                setSelectedDomain("all");
                setSelectedSubDomain("all");
                setSearch("");
                setSelLevels([]);
                setPage(1);
              }}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 11,
                color: C.accent,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Reset All
            </button>
          )}
        </div>

        {/* Quick Search */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
            Search Curriculum
          </div>
          <input
            type="text"
            placeholder="Title, keyword, ministry..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              fontSize: 13,
              fontFamily: FONT.body,
              outline: "none",
              background: C.bg,
              color: C.dark,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Domain Filter */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
            Domain ({igotTaxonomy.length})
          </div>
          <select
            value={selectedDomain}
            onChange={(e) => {
              setSelectedDomain(e.target.value);
              setSelectedSubDomain("all");
              setPage(1);
            }}
            style={{
              width: "100%",
              padding: "9px 10px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.bg,
              fontSize: 12.5,
              fontFamily: FONT.body,
              color: C.dark,
              fontWeight: 500,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Domains ({TOTAL_IGOT_COURSES_COUNT.toLocaleString()})</option>
            {igotTaxonomy.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.totalCourses})
              </option>
            ))}
          </select>
        </div>

        {/* Sub-Domain Filter (if domain chosen) */}
        {activeSubDomains.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
              Sub-Domain
            </div>
            <select
              value={selectedSubDomain}
              onChange={(e) => {
                setSelectedSubDomain(e.target.value);
                setPage(1);
              }}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.bg,
                fontSize: 12,
                fontFamily: FONT.body,
                color: C.dark,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Sub-Domains ({activeSubDomains.length})</option>
              {activeSubDomains.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.count})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Difficulty Level */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
            Proficiency Level
          </div>
          {levels.map((lvl) => {
            const isChecked = selLevels.includes(lvl);
            return (
              <label
                key={lvl}
                onClick={() => {
                  setSelLevels((prev) =>
                    prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
                  );
                  setPage(1);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  marginBottom: 6,
                  fontSize: 12.5,
                  color: C.dark,
                }}
              >
                <input type="checkbox" checked={isChecked} readOnly style={{ accentColor: C.s1 }} />
                <span>{lvl}</span>
              </label>
            );
          })}
        </div>

        {/* TPAC Endorsement */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          <label
            onClick={() => setOnlyTPAC(!onlyTPAC)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 600,
              color: "#1B3D29",
            }}
          >
            <input type="checkbox" checked={onlyTPAC} readOnly style={{ accentColor: "#1B3D29" }} />
            <span>🎖️ TPAC Endorsed Only</span>
          </label>
        </div>

        {/* Action button to Interested Courses */}
        <div style={{ marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={() => navigate("/student/interested-courses")}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: `${C.accent}15`,
              color: C.accent,
              border: `1px solid ${C.accent}40`,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            ✨ AI Selection Advisor
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header Banner */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
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
                  iGOT Karmayogi National Catalog
                </span>
                <span style={{ fontSize: 12, color: C.muted }}>
                  {TOTAL_IGOT_COURSES_COUNT.toLocaleString()} Verified Programs • 47 Domains
                </span>
              </div>
              <h1 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 800, margin: 0, color: C.dark }}>
                Course Discovery & Capacity Building
              </h1>
            </div>

            {/* Selected Courses Counter / Nav to Roadmap */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: selectedCourseIds.length > 0 ? "#EBF5F0" : C.surface,
                  border: `1px solid ${selectedCourseIds.length > 0 ? C.s1 : C.border}`,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: selectedCourseIds.length > 0 ? C.s1 : C.muted,
                }}
              >
                🎯 {selectedCourseIds.length} Selected in Your Learning Path
              </div>
              <button
                onClick={() => navigate("/student/learning-path")}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: C.accent,
                  color: "#fff",
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                View Roadmap →
              </button>
            </div>
          </div>

          {/* AI Gap Remediation Alert Banner */}
          {highestGapMetric && highestGapMetric.gap > 0 && (
            <div
              style={{
                background: "#1B3D29",
                borderRadius: 12,
                padding: "14px 18px",
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
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>
                    Targeted Remediation Recommendation
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
                <div style={{ fontSize: 12.5, color: "#D4E8D8" }}>
                  Bridges your <strong>{highestGapMetric.gap}% measured gap</strong> in{" "}
                  <strong>{highestGapMetric.domain}</strong>. Select aligned courses below to include them in your dynamic roadmap.
                </div>
              </div>
              <button
                onClick={() => navigate("/student/gap-analysis")}
                style={{
                  padding: "6px 14px",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 8,
                  fontSize: 12,
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

        {/* Results Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: C.muted }}>
            Showing <strong>{catalogResult.courses.length}</strong> of{" "}
            <strong>{catalogResult.totalMatches.toLocaleString()}</strong> matching courses
            {selectedDomain !== "all" && ` in "${selectedDomain}"`}
          </div>

          {/* Pagination Controls */}
          {catalogResult.totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  background: page <= 1 ? C.bg : C.surface,
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  fontSize: 12,
                  color: page <= 1 ? C.muted : C.dark,
                  fontWeight: 600,
                }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: 12, color: C.dark, fontWeight: 600 }}>
                Page {catalogResult.currentPage} of {catalogResult.totalPages}
              </span>
              <button
                disabled={page >= catalogResult.totalPages}
                onClick={() => setPage((p) => Math.min(catalogResult.totalPages, p + 1))}
                style={{
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  background: page >= catalogResult.totalPages ? C.bg : C.surface,
                  cursor: page >= catalogResult.totalPages ? "not-allowed" : "pointer",
                  fontSize: 12,
                  color: page >= catalogResult.totalPages ? C.muted : C.dark,
                  fontWeight: 600,
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Course Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
          {catalogResult.courses.map((course) => {
            const isSelected = selectedCourseIds.includes(course.id);
            const isRec = course.aiRecommended;

            return (
              <div
                key={course.id}
                style={{
                  background: C.surface,
                  border: `1.5px solid ${isSelected ? C.s1 : isRec ? C.accent + "80" : C.border}`,
                  borderRadius: 14,
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  position: "relative",
                  boxShadow: isSelected
                    ? "0 4px 14px rgba(27, 61, 41, 0.12)"
                    : "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "all 0.15s ease",
                }}
              >
                {/* Top Badges Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
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
                      {course.level || "Beginner"}
                    </span>

                    {course.tpacEndorsed && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#1B3D29",
                          background: "#E6F4EC",
                          border: "1px solid #1B3D2944",
                          padding: "2px 7px",
                          borderRadius: 4,
                        }}
                      >
                        🎖️ TPAC
                      </span>
                    )}

                    {isRec && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.accent,
                          background: `${C.accent}15`,
                          border: `1px solid ${C.accent}40`,
                          padding: "2px 7px",
                          borderRadius: 4,
                        }}
                      >
                        ✨ AI Pick
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono, fontWeight: 600 }}>
                    {course.code}
                  </span>
                </div>

                {/* Course Title & Organization */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 5px", fontSize: 15.5, fontWeight: 700, color: C.dark, lineHeight: 1.35 }}>
                    <Link to={`/student/courses/${course.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {course.title}
                    </Link>
                  </h3>
                  <div style={{ fontSize: 12, color: C.muted, display: "flex", gap: 6, alignItems: "center" }}>
                    <span>{course.org || "iGOT Karmayogi"}</span>
                    <span>•</span>
                    <span style={{ color: C.accent, fontWeight: 500 }}>{course.domain}</span>
                  </div>
                </div>

                {/* Brief description snippet */}
                {course.desc && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      color: C.muted,
                      lineHeight: 1.45,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.desc}
                  </p>
                )}

                {/* Meta details (duration, rating) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span>⏱️ {course.duration || 6}h</span>
                    <span>⭐ {course.rating || 4.8}</span>
                    {course.subDomain && <span>📁 {course.subDomain}</span>}
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => handleToggleCourse(course.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: isSelected ? `1px solid ${C.s1}` : `1px solid ${C.border}`,
                      background: isSelected ? C.s1 : C.surface,
                      color: isSelected ? "#fff" : C.dark,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isSelected ? "✓ In My Path" : "+ Add to Path"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination */}
        {catalogResult.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 14 }}>
            <button
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: page <= 1 ? C.bg : C.surface,
                cursor: page <= 1 ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ← Previous Page
            </button>
            <span style={{ fontSize: 13, color: C.dark, fontWeight: 600 }}>
              Page {catalogResult.currentPage} of {catalogResult.totalPages}
            </span>
            <button
              disabled={page >= catalogResult.totalPages}
              onClick={() => {
                setPage((p) => Math.min(catalogResult.totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: page >= catalogResult.totalPages ? C.bg : C.surface,
                cursor: page >= catalogResult.totalPages ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Next Page →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
