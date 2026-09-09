import { useNavigate } from "react-router";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
import { useCompetency } from "@/context/CompetencyContext";
import { useAuth } from "@/context/AuthContext";

function gapColor(gap: number) {
  if (gap > 25) return C.s4;      // Critical gap (Red/Coral)
  if (gap >= 10) return C.accent;  // Minor gap (Amber/Gold)
  return C.s1;                    // Met Benchmark (Forest Green)
}

const severityStyle = (sev: string): React.CSSProperties => {
  if (sev === "Critical") return { background: "#FDECEA", color: C.s4, border: `1px solid ${C.s4}` };
  if (sev === "Minor") return { background: "#FEF3E2", color: C.accent, border: `1px solid ${C.accent}` };
  return { background: "#E6F4EC", color: C.s1, border: `1px solid ${C.s1}` };
};

// Course catalog mapped to domain IDs
const DOMAIN_COURSE_MAP: Record<string, { title: string; courseCode: string; duration: string; provider: string }> = {
  stats: {
    title: "Advanced Sampling Theory & NSS Survey Methodology",
    courseCode: "NSSTA-ST-401",
    duration: "12h",
    provider: "NSSTA TPAC",
  },
  sql: {
    title: "Enterprise SQL & High-Volume Microdata Aggregations for CPI/IIP",
    courseCode: "DIID-DB-203",
    duration: "8h",
    provider: "DIID MoSPI",
  },
  python: {
    title: "Python Data Science for Official Statistics & PLFS Cleansing",
    courseCode: "MOSPI-PY-301",
    duration: "10h",
    provider: "NSSTA iGOT",
  },
  gis: {
    title: "QGIS Spatial Sampling Frame Construction & Geo-tagging",
    courseCode: "FOD-GIS-102",
    duration: "9h",
    provider: "FOD / Survey Academy",
  },
  ethics: {
    title: "DPDP Act 2023 Statutory Compliance & UN Statistical Ethics",
    courseCode: "NSSTA-ETH-501",
    duration: "6h",
    provider: "Ministry Legal Cell",
  },
};

import { useMemo } from "react";
import { getCoursesByTitlesOrIds, type IGOTCatalogCourse } from "@/services/karmayogiCoursesService";
import { getCourseProgress } from "@/services/courseProgressService";

export default function GapAnalysis() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { domains, getGapMetrics, lastAssessment } = useCompetency();

  const studentTrack = profile?.track || "Higher Education / University Student";
  const gapMetrics = getGapMetrics();

  // Selected courses resolved from profile
  const selectedCourseIds = useMemo(() => {
    return (profile?.interestedCourses || []).map(String);
  }, [profile?.interestedCourses]);

  const userSelectedCourses: IGOTCatalogCourse[] = useMemo(() => {
    return getCoursesByTitlesOrIds(selectedCourseIds);
  }, [selectedCourseIds]);

  // Radar chart data comparing User Current vs Target Benchmark
  // Multi-axis polar geometry in Recharts requires >= 3 points to render a closed 2D polygon.
  // When the student selects 1 or 2 domains, we synthesize standard civil service reference pillars
  // and clearly flag the student's enrolled domain with "★" so the radar web never collapses into a single line.
  const radarData = useMemo(() => {
    const rawList = (profile?.interestedDomains && profile.interestedDomains.length > 0)
      ? profile.interestedDomains
      : domains.map((d) => d.name);

    if (rawList.length >= 3) {
      return rawList.slice(0, 6).map((dom) => {
        const match = domains.find((d) => d.name.toLowerCase() === dom.toLowerCase());
        return {
          domain: dom.length > 14 ? dom.slice(0, 13) + "…" : dom,
          current: match ? match.currentScore : 45,
          target: match ? match.targetBenchmark : 85,
          fullName: dom,
          isUserFocus: true,
        };
      });
    }

    // 1 or 2 domains selected: build a complete 5-pillar civil service competency polygon
    const userItems = rawList.map((dom) => {
      const match = domains.find((d) => d.name.toLowerCase() === dom.toLowerCase());
      return {
        domain: `★ ${dom.length > 12 ? dom.slice(0, 11) + "…" : dom}`,
        current: match ? match.currentScore : 45,
        target: match ? match.targetBenchmark : 85,
        fullName: `${dom} (Enrolled Focus)`,
        isUserFocus: true,
      };
    });

    const foundationalCadrePillars = [
      { domain: "Policy & GFR", current: 55, target: 80, fullName: "Public Administration & GFR", isUserFocus: false },
      { domain: "Digital E-Gov", current: 50, target: 80, fullName: "Digital India & Public Systems", isUserFocus: false },
      { domain: "Statutory Ethics", current: 60, target: 85, fullName: "Civil Service Ethics & DPDP", isUserFocus: false },
      { domain: "Research Ops", current: 52, target: 80, fullName: "Applied Statistical Research", isUserFocus: false },
    ];

    const combined = [...userItems];
    for (const pillar of foundationalCadrePillars) {
      if (combined.length >= 5) break;
      if (!combined.some((c) => c.fullName.toLowerCase().includes(pillar.domain.toLowerCase()))) {
        combined.push(pillar);
      }
    }
    return combined;
  }, [profile?.interestedDomains, domains]);

  // Bar chart data for gap size
  const gapBarData = gapMetrics.map((m) => ({
    domain: m.domain,
    short: domains.find((d) => d.id === m.domainId)?.short || m.domain,
    gap: m.gap,
    severity: m.severity,
  }));

  // Overview metrics
  const criticalCount = gapMetrics.filter((m) => m.severity === "Critical").length;
  const minorCount = gapMetrics.filter((m) => m.severity === "Minor").length;
  const totalGapPoints = gapMetrics.reduce((acc, curr) => acc + curr.gap, 0);
  const avgGap = Math.round(totalGapPoints / gapMetrics.length);

  const topPriorityAreas = gapMetrics
    .filter((m) => m.gap > 0)
    .slice(0, 2)
    .map((m) => domains.find((d) => d.id === m.domainId)?.short || m.domain)
    .join(", ");

  const assessmentDate = lastAssessment?.date
    ? new Date(lastAssessment.date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Initial Baseline Setup";

  // Priority course recommendations based on student's selected courses and highest gap
  const prioritizedCourses = gapMetrics.map((m) => {
    // Check if user has an enrolled course in this domain
    const matchedUserCourse = userSelectedCourses.find(
      (uc) =>
        uc.domain.toLowerCase().includes(m.domain.toLowerCase()) ||
        m.domain.toLowerCase().includes(uc.domain.toLowerCase())
    );

    if (matchedUserCourse) {
      return {
        title: matchedUserCourse.title,
        courseCode: matchedUserCourse.code,
        duration: `${matchedUserCourse.duration || 8}h`,
        provider: matchedUserCourse.org || "Enrolled Curriculum",
        courseId: matchedUserCourse.id,
        gap: m.domain,
        domainId: m.domainId,
        gapPoints: m.gap,
        severity: m.severity,
      };
    }

    const courseMeta = DOMAIN_COURSE_MAP[m.domainId] || {
      title: `${m.domain} Capacity Building Module`,
      courseCode: "IGOT-MOD-101",
      duration: "6h",
      provider: "iGOT Karmayogi",
    };

    return {
      ...courseMeta,
      courseId: m.domainId,
      gap: m.domain,
      domainId: m.domainId,
      gapPoints: m.gap,
      severity: m.severity,
    };
  });

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
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
              Student Competency Intelligence
            </span>
            <span style={{ fontSize: 12, color: C.muted }}>Target Track: {studentTrack}</span>
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, margin: 0, color: C.dark }}>
            AI Competency Gap Analysis & Benchmarking
          </h2>
          <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 14 }}>
            Deterministic gap quantification vs. target competency benchmarks:{" "}
            <code style={{ fontFamily: FONT.mono, background: C.border, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>
              Gap = max(0, Benchmark - Demonstrated)
            </code>
            {" · "}Last evaluated: {assessmentDate}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/student/interested-courses")}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: `1.5px solid ${C.accent}`,
              background: `${C.accent}15`,
              color: C.accent,
              fontFamily: FONT.body,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ⚙️ Modify Course Selection ({userSelectedCourses.length})
          </button>

          <button
            onClick={() => navigate("/student/assessment")}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: `1.5px solid ${C.border}`,
              background: C.surface,
              color: C.dark,
              fontFamily: FONT.body,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ↻ Retake Diagnostic
          </button>
        </div>
      </div>

      {/* Overview stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Net Average Deficit", value: `${avgGap} pts`, note: "Average variance from role benchmark", color: avgGap > 20 ? C.s4 : C.accent },
          { label: "Critical Deficits (>25%)", value: `${criticalCount}`, note: `${criticalCount} domain(s) require immediate remediation`, color: criticalCount > 0 ? C.s4 : C.s1 },
          { label: "Minor Deficits (10–25%)", value: `${minorCount}`, note: "Suitable for focused micro-learning", color: C.accent },
          { label: "Priority Focus Areas", value: topPriorityAreas || "None (All Met)", note: "Prioritized in remedial learning roadmap", color: "#1B3D29" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "18px 20px",
              borderTop: `3px solid ${card.color}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 700, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>{card.note}</div>
          </div>
        ))}
      </div>

      {/* Precision Mathematical Analysis Callout: Clarifies Deficit vs Completion */}
      <div
        style={{
          background: "#FAF7EE",
          border: `1.5px solid ${C.accent}40`,
          borderRadius: 12,
          padding: "18px 22px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ flex: "1 1 500px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                background: `${C.accent}25`,
                color: C.accent,
                padding: "2px 8px",
                borderRadius: 4,
                letterSpacing: "0.05em",
              }}
            >
              Calculation Clarity Engine
            </span>
            <span style={{ fontSize: 12, color: C.muted }}>
              Distinguishing Competency Deficit vs. Course Learning Completion
            </span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>
            Competency Deficit = Benchmark ({gapMetrics[0]?.target || 85}%) − Demonstrated Baseline ({gapMetrics[0]?.current || 45}%) = {gapMetrics[0]?.gap || 40}% Deficit
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>
            A <strong>{gapMetrics[0]?.gap || 40}% deficit</strong> reflects the skill gap identified in your baseline diagnostic against the civil service cadre requirement. Because you have just enrolled in your selected courses and haven't started modules yet, your <strong>Course Learning Progress is strictly 0%</strong>. Enrolled courses bridge this gap as you complete lessons and quizzes.
          </p>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ textAlign: "center", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px" }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Identified Deficit</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.s4 }}>-{gapMetrics[0]?.gap || 40}%</div>
            <div style={{ fontSize: 10, color: C.faint }}>Target: {gapMetrics[0]?.target || 85}%</div>
          </div>
          <div style={{ textAlign: "center", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px" }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Course Progress</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.s1 }}>
              {userSelectedCourses.length > 0
                ? Math.round(
                    userSelectedCourses.reduce((acc, c) => acc + getCourseProgress(c.id).percent, 0) /
                      userSelectedCourses.length
                  )
                : 0}
              %
            </div>
            <div style={{ fontSize: 10, color: C.faint }}>
              {userSelectedCourses.some((c) => getCourseProgress(c.id).percent > 0) ? "In Progress" : "Not Started (0%)"}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column main */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.1fr", gap: 20, marginBottom: 28 }}>
        {/* Left column: Radar & Gap charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Radar chart */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.dark }}>
                  Multi-Axis Competency Radar Chart
                </div>
                <div style={{ fontSize: 13, color: C.muted }}>
                  Real-time visualization of Demonstrated Score vs. Target Benchmark across core learning domains
                </div>
              </div>
            </div>

            {/* Legend & Aux Notice */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "14px 0 8px", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: C.accent, opacity: 0.9 }} />
                  <span style={{ color: C.dark, fontWeight: 600 }}>Demonstrated Score (%)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: "#1B3D29", opacity: 0.4 }} />
                  <span style={{ color: C.dark, fontWeight: 600 }}>Target Role Benchmark (%)</span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: C.muted }}>★ Enrolled Focus Domain</span>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} margin={{ top: 15, right: 30, bottom: 15, left: 30 }}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis
                  dataKey="domain"
                  tick={{ fill: C.dark, fontSize: 12, fontFamily: FONT.body, fontWeight: 600 }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: C.faint }} axisLine={false} />
                <Radar
                  name="Target Role Benchmark"
                  dataKey="target"
                  stroke="#1B3D29"
                  fill="#1B3D29"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name="Demonstrated Score"
                  dataKey="current"
                  stroke={C.accent}
                  fill={C.accent}
                  fillOpacity={0.35}
                  strokeWidth={2.5}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: FONT.body,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val, name) => [`${val}%`, name]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart: gap size */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 4, color: C.dark }}>
              Measured Competency Gap Variance
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
              Deficit percentage required to satisfy target benchmark requirements
            </div>
            <ResponsiveContainer width="100%" height={Math.max(160, gapBarData.length * 55)}>
              <BarChart data={gapBarData} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" domain={[0, 60]} tick={{ fontSize: 11, fill: C.muted, fontFamily: FONT.body }} />
                <YAxis
                  type="category"
                  dataKey="short"
                  tick={{ fontSize: 12, fill: C.dark, fontFamily: FONT.body, fontWeight: 500 }}
                  width={100}
                />
                <Tooltip
                  formatter={(val: any) => [`${val}% Deficit to Bridge`, "Variance"]}
                  contentStyle={{ fontFamily: FONT.body, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="gap" radius={[0, 4, 4, 0]} barSize={28} maxBarSize={36}>
                  {gapBarData.map((entry) => (
                    <Cell key={entry.domain} fill={gapColor(entry.gap)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column: Gap Matrix Table & AI Priority Order */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Gap Severity Matrix Table */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.dark }}>
                  Competency Gap Matrix Table
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>Standardized competency mastery breakdown</div>
              </div>
              <span style={{ fontSize: 11, color: C.muted }}>Ranked by Deficit</span>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr>
                  {["Domain", "Score", "Benchmark", "Gap", "Severity"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 6px",
                        color: C.faint,
                        fontWeight: 600,
                        borderBottom: `1px solid ${C.border}`,
                        whiteSpace: "nowrap",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gapMetrics.map((row, i) => (
                  <tr key={row.domainId} style={{ background: i % 2 === 0 ? "transparent" : "#F5F1E888" }}>
                    <td style={{ padding: "10px 6px", color: C.dark, fontWeight: 600 }}>
                      <div>{row.domain}</div>
                      <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 400 }}>Rank #{row.priorityRank}</div>
                    </td>
                    <td style={{ padding: "10px 6px", color: C.dark }}>{row.current}%</td>
                    <td style={{ padding: "10px 6px", color: C.muted }}>{row.target}%</td>
                    <td style={{ padding: "10px 6px", fontWeight: 700, color: gapColor(row.gap) }}>
                      {row.gap > 0 ? `-${row.gap}%` : "Met"}
                    </td>
                    <td style={{ padding: "10px 6px" }}>
                      <span
                        style={{
                          ...severityStyle(row.severity),
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Priority Remediation Sequence */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 4, color: C.dark }}>
              AI Prescribed Remediation Sequence
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
              Targeted remediation actions automatically generated by the gap engine
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {gapMetrics.slice(0, 4).map((item) => (
                <div
                  key={item.domainId}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: "12px 14px",
                    background: C.bg,
                    borderRadius: 8,
                    border: `1px solid ${item.severity === "Critical" ? C.s4 + "44" : C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: item.severity === "Critical" ? C.s4 : C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {item.priorityRank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: C.dark }}>{item.domain}</span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: item.severity === "Critical" ? C.s4 : C.accent,
                        }}
                      >
                        {item.gap > 0 ? `${item.gap}% Deficit (Needs Study)` : "Satisfied"}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.4 }}>
                      {item.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations (Course Feed Mapped to Gaps) */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.dark }}>
              Curated Remedial Courses (iGOT & NSSTA Integration)
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
              Courses prioritized dynamically to bridge your measured critical competency deficits first
            </div>
          </div>
          <button
            onClick={() => navigate("/student/courses")}
            style={{
              padding: "7px 14px",
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              color: C.dark,
              cursor: "pointer",
            }}
          >
            Explore Full Catalog (5,400+ Courses) →
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {prioritizedCourses.slice(0, 3).map((c) => {
            const courseProg = getCourseProgress(c.courseId);
            return (
              <div
                key={c.courseCode}
                style={{
                  background: C.bg,
                  border: `1px solid ${c.severity === "Critical" ? C.s4 + "55" : C.border}`,
                  borderRadius: 10,
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#fff",
                      background: "#1B3D29",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {c.provider}
                  </span>
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono }}>
                    {c.courseCode}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: 14, color: C.dark, lineHeight: 1.4 }}>
                  {c.title}
                </div>

                <div style={{ fontSize: 12, color: C.muted }}>
                  Duration: <strong>{c.duration}</strong> · Addresses: <strong>{c.gap}</strong>
                </div>

                {/* Real Course Learning Progress */}
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                    <span>Course Progress:</span>
                    <strong style={{ color: courseProg.percent > 0 ? C.s1 : C.muted }}>
                      {courseProg.percent}% ({courseProg.percent === 0 ? "Not Started" : courseProg.percent === 100 ? "Completed" : "In Progress"})
                    </strong>
                  </div>
                  <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${courseProg.percent}%`, background: C.s1 }} />
                  </div>
                </div>

                <div
                  style={{
                    padding: "6px 10px",
                    background: c.severity === "Critical" ? "#FDECEA" : "#FEF3E2",
                    borderRadius: 6,
                    fontSize: 11.5,
                    color: c.severity === "Critical" ? C.s4 : C.accent,
                    fontWeight: 600,
                  }}
                >
                  🎯 Bridges your {c.gapPoints}% measured competency gap
                </div>

                <button
                  onClick={() => navigate(c.courseId ? `/student/courses/${c.courseId}/learn` : "/student/courses")}
                  style={{
                    marginTop: "auto",
                    padding: "9px 0",
                    background: C.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 7,
                    fontFamily: FONT.body,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "center",
                    boxShadow: "0 2px 6px rgba(198, 133, 27, 0.2)",
                  }}
                >
                  {courseProg.percent === 0 ? "Start Module & Bridge Gap →" : `Resume Module (${courseProg.percent}%) →`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA to Sequenced Roadmap */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <button
          onClick={() => navigate("/student/learning-path")}
          style={{
            padding: "14px 40px",
            background: "#1B3D29",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(27, 61, 41, 0.3)",
          }}
        >
          View 4-Phase Personalized Roadmap →
        </button>
      </div>
    </div>
  );
}
