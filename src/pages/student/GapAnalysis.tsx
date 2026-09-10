import { useState, useMemo } from "react";
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
  Legend,
  PieChart,
  Pie,
} from "recharts";
import { C, FONT } from "@/tokens";
import { useCompetency } from "@/context/CompetencyContext";
import { useAuth } from "@/context/AuthContext";
import { getCoursesByTitlesOrIds, type IGOTCatalogCourse } from "@/services/karmayogiCoursesService";
import { getCourseProgress } from "@/services/courseProgressService";

function gapColor(gap: number) {
  if (gap > 25) return C.s4;      // Critical gap (Red/Terracotta)
  if (gap >= 10) return C.accent;  // Minor gap (Amber/Gold)
  return C.s1;                    // Met Benchmark (Forest Green)
}

const severityStyle = (sev: string): React.CSSProperties => {
  if (sev === "Critical") return { background: "#FDECEA", color: C.s4, border: `1px solid ${C.s4}` };
  if (sev === "Minor") return { background: "#FEF3E2", color: C.accent, border: `1px solid ${C.accent}` };
  return { background: "#E6F4EC", color: C.s1, border: `1px solid ${C.s1}` };
};

// Course catalog mapped to domain IDs
const DOMAIN_COURSE_MAP: Record<string, { title: string; courseCode: string; duration: string; provider: string; estHours: number }> = {
  stats: {
    title: "Advanced Sampling Theory & NSS Survey Methodology",
    courseCode: "NSSTA-ST-401",
    duration: "12h",
    provider: "NSSTA TPAC",
    estHours: 12,
  },
  sql: {
    title: "Enterprise SQL & High-Volume Microdata Aggregations for CPI/IIP",
    courseCode: "DIID-DB-203",
    duration: "8h",
    provider: "DIID MoSPI",
    estHours: 8,
  },
  python: {
    title: "Python Data Science for Official Statistics & PLFS Cleansing",
    courseCode: "MOSPI-PY-301",
    duration: "10h",
    provider: "NSSTA iGOT",
    estHours: 10,
  },
  gis: {
    title: "QGIS Spatial Sampling Frame Construction & Geo-tagging",
    courseCode: "FOD-GIS-102",
    duration: "9h",
    provider: "FOD / Survey Academy",
    estHours: 9,
  },
  ethics: {
    title: "DPDP Act 2023 Statutory Compliance & UN Statistical Ethics",
    courseCode: "NSSTA-ETH-501",
    duration: "6h",
    provider: "Ministry Legal Cell",
    estHours: 6,
  },
  policy: {
    title: "General Financial Rules (GFR 2017) & Public Procurement",
    courseCode: "ISTM-GFR-101",
    duration: "7h",
    provider: "ISTM DoPT",
    estHours: 7,
  },
  digital: {
    title: "Digital India Architecture & E-Governance Systems",
    courseCode: "NIC-EGOV-201",
    duration: "6h",
    provider: "NIC / MeitY",
    estHours: 6,
  },
};

export default function GapAnalysis() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { domains, getGapMetrics, lastAssessment } = useCompetency();

  const [activeTab, setActiveTab] = useState<"all" | "enrolled" | "spectrum" | "roi">("all");

  const studentTrack = profile?.track || "Higher Education / University Student";
  const rawGapMetrics = getGapMetrics();

  // Selected courses resolved from profile
  const selectedCourseIds = useMemo(() => {
    return (profile?.interestedCourses || []).map(String);
  }, [profile?.interestedCourses]);

  const userSelectedCourses: IGOTCatalogCourse[] = useMemo(() => {
    return getCoursesByTitlesOrIds(selectedCourseIds);
  }, [selectedCourseIds]);

  // Comprehensive Cadre Competency Dataset: Combines user's active/enrolled domains with cadre standards
  // ensures rich visualization analysis regardless of whether user selected 1 or 5 domains
  const comprehensiveDomainMetrics = useMemo(() => {
    const userDomainNames = (profile?.interestedDomains && profile.interestedDomains.length > 0)
      ? profile.interestedDomains
      : domains.map((d) => d.name);

    // Baseline civil service cadre benchmarks
    const cadreBaselines = [
      { id: "python", name: "Python & Data Analytics", short: "Python", target: 85, defaultScore: 45, estHours: 10 },
      { id: "stats", name: "Applied Statistics & Sampling", short: "Statistics", target: 85, defaultScore: 55, estHours: 12 },
      { id: "sql", name: "SQL & Database Operations", short: "SQL & DB", target: 80, defaultScore: 50, estHours: 8 },
      { id: "gis", name: "GIS & Spatial Sampling", short: "GIS Spatial", target: 80, defaultScore: 40, estHours: 9 },
      { id: "ethics", name: "Data Ethics & DPDP Act 2023", short: "Data Ethics", target: 90, defaultScore: 60, estHours: 6 },
      { id: "policy", name: "Public Admin & GFR Guidelines", short: "Policy & GFR", target: 80, defaultScore: 52, estHours: 7 },
    ];

    return cadreBaselines.map((base, idx) => {
      const isEnrolled = userDomainNames.some(
        (ud) => ud.toLowerCase().includes(base.short.toLowerCase()) || base.name.toLowerCase().includes(ud.toLowerCase())
      );

      // Check if there's a live domain in CompetencyContext
      const liveDomain = domains.find(
        (d) => d.name.toLowerCase().includes(base.short.toLowerCase()) || base.name.toLowerCase().includes(d.name.toLowerCase())
      );

      const currentScore = liveDomain ? liveDomain.currentScore : base.defaultScore;
      const targetBenchmark = liveDomain ? liveDomain.targetBenchmark : base.target;
      const gap = Math.max(0, targetBenchmark - currentScore);

      let severity: "Critical" | "Minor" | "Met" = "Met";
      if (gap > 25) severity = "Critical";
      else if (gap >= 10) severity = "Minor";

      const pointsPerHour = Number((gap / Math.max(1, base.estHours)).toFixed(1));

      return {
        id: base.id,
        domain: base.name,
        short: base.short,
        current: currentScore,
        target: targetBenchmark,
        gap,
        severity,
        isEnrolled,
        estHours: base.estHours,
        pointsPerHour,
        priorityRank: idx + 1,
        action: gap > 25
          ? `High Priority: Complete core remedial modules in ${base.short}`
          : gap >= 10
          ? `Targeted: Complete practice problem sets & quizzes in ${base.short}`
          : `Benchmark Satisfied in ${base.short} · Periodic refresher recommended`,
      };
    }).sort((a, b) => {
      // Primary: Enrolled first, then largest gap
      if (a.isEnrolled && !b.isEnrolled) return -1;
      if (!a.isEnrolled && b.isEnrolled) return 1;
      return b.gap - a.gap;
    }).map((item, idx) => ({ ...item, priorityRank: idx + 1 }));
  }, [profile?.interestedDomains, domains]);

  // Filtered dataset according to active tab
  const displayedMetrics = useMemo(() => {
    if (activeTab === "enrolled") {
      const enrolledOnly = comprehensiveDomainMetrics.filter((d) => d.isEnrolled);
      return enrolledOnly.length > 0 ? enrolledOnly : comprehensiveDomainMetrics.slice(0, 3);
    }
    return comprehensiveDomainMetrics;
  }, [activeTab, comprehensiveDomainMetrics]);

  // High-level KPI summary calculations
  const totalTargetPoints = displayedMetrics.reduce((sum, d) => sum + d.target, 0);
  const totalDemonstratedPoints = displayedMetrics.reduce((sum, d) => sum + d.current, 0);
  const overallReadinessPct = Math.round((totalDemonstratedPoints / Math.max(1, totalTargetPoints)) * 100);

  const criticalCount = displayedMetrics.filter((m) => m.severity === "Critical").length;
  const minorCount = displayedMetrics.filter((m) => m.severity === "Minor").length;
  const metCount = displayedMetrics.filter((m) => m.severity === "Met").length;

  const totalGapPoints = displayedMetrics.reduce((acc, curr) => acc + curr.gap, 0);
  const avgGap = Math.round(totalGapPoints / displayedMetrics.length);
  const totalEstHours = displayedMetrics.filter((d) => d.gap > 0).reduce((acc, curr) => acc + curr.estHours, 0);

  // Radar chart data comparing Demonstrated vs Benchmark
  const radarData = useMemo(() => {
    return comprehensiveDomainMetrics.map((d) => ({
      domain: d.isEnrolled ? `★ ${d.short}` : d.short,
      current: d.current,
      target: d.target,
      fullName: d.domain,
      isEnrolled: d.isEnrolled,
    }));
  }, [comprehensiveDomainMetrics]);

  // Dual Bar Chart comparison: Demonstrated vs Benchmark vs Gap
  const comparisonBarData = useMemo(() => {
    return displayedMetrics.map((d) => ({
      domain: d.short,
      fullName: d.domain,
      Demonstrated: d.current,
      Benchmark: d.target,
      Deficit: d.gap,
      isEnrolled: d.isEnrolled,
    }));
  }, [displayedMetrics]);

  // Donut chart data for Deficit Severity Breakdown
  const severityDonutData = useMemo(() => {
    return [
      { name: "Met Benchmark", value: metCount || 0, color: C.s1 },
      { name: "Minor Deficit (10–25%)", value: minorCount || 0, color: C.accent },
      { name: "Critical Deficit (>25%)", value: criticalCount || 0, color: C.s4 },
    ].filter((item) => item.value > 0);
  }, [metCount, minorCount, criticalCount]);

  // ROI / Efficiency data: Competency Points Lift vs Hours of Study
  const roiData = useMemo(() => {
    return displayedMetrics.filter((d) => d.gap > 0).map((d) => ({
      domain: d.short,
      gap: d.gap,
      hours: d.estHours,
      efficiency: d.pointsPerHour,
    })).sort((a, b) => b.efficiency - a.efficiency);
  }, [displayedMetrics]);

  const assessmentDate = lastAssessment?.date
    ? new Date(lastAssessment.date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Baseline Evaluation";

  // Prioritized Courses dynamically mapped to highest gaps
  const prioritizedCourses = useMemo(() => {
    return displayedMetrics.filter((d) => d.gap > 0).slice(0, 3).map((m) => {
      const matchedUserCourse = userSelectedCourses.find(
        (uc) =>
          uc.domain.toLowerCase().includes(m.domain.toLowerCase()) ||
          m.domain.toLowerCase().includes(uc.domain.toLowerCase()) ||
          uc.domain.toLowerCase().includes(m.short.toLowerCase())
      );

      if (matchedUserCourse) {
        return {
          title: matchedUserCourse.title,
          courseCode: matchedUserCourse.code,
          duration: `${matchedUserCourse.duration || m.estHours}h`,
          provider: matchedUserCourse.org || "Enrolled Curriculum",
          courseId: matchedUserCourse.id,
          gap: m.domain,
          gapPoints: m.gap,
          severity: m.severity,
          estHours: m.estHours,
        };
      }

      const courseMeta = DOMAIN_COURSE_MAP[m.id] || {
        title: `${m.domain} Capacity Building Module`,
        courseCode: `IGOT-${m.short.toUpperCase().slice(0, 3)}-201`,
        duration: `${m.estHours}h`,
        provider: "iGOT Karmayogi",
        estHours: m.estHours,
      };

      return {
        ...courseMeta,
        courseId: m.id,
        gap: m.domain,
        gapPoints: m.gap,
        severity: m.severity,
      };
    });
  }, [displayedMetrics, userSelectedCourses]);

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, padding: "28px 32px" }}>
      {/* Clean Header without redundant math formula clutter */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, margin: 0, color: C.dark }}>
            AI Competency Gap Analysis & Benchmarking
          </h2>
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
            ⚙️ Course Focus ({userSelectedCourses.length})
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

      {/* Modern High-Impact Visual KPI Cards Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* Card 1: Benchmark Readiness */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "18px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            borderTop: `3px solid ${overallReadinessPct >= 70 ? C.s1 : C.accent}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Cadre Readiness Index</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: overallReadinessPct >= 70 ? C.s1 : C.accent }}>
              {overallReadinessPct >= 70 ? "On Target" : "Remediation Mode"}
            </span>
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 800, color: C.dark, margin: "6px 0 8px" }}>
            {overallReadinessPct}%
          </div>
          <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${overallReadinessPct}%`,
                background: overallReadinessPct >= 70 ? C.s1 : C.accent,
                borderRadius: 3,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Card 2: Net Deficit */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "18px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            borderTop: `3px solid ${avgGap > 20 ? C.s4 : C.accent}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Net Average Deficit</span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: C.s4,
                background: "#FDECEA",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              -{avgGap} pts
            </span>
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 800, color: avgGap > 20 ? C.s4 : C.accent, margin: "6px 0 0" }}>
            {avgGap} <span style={{ fontSize: 15, fontWeight: 600 }}>points</span>
          </div>
        </div>

        {/* Card 3: Deficit Severity Breakdown */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "18px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            borderTop: `3px solid ${C.s4}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Deficit Severity</span>
            <span style={{ fontSize: 11, color: C.faint }}>{displayedMetrics.length} domains</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "6px 0 0" }}>
            <span style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 800, color: C.s4 }}>
              {criticalCount}
            </span>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Critical</span>
            <span style={{ color: C.border }}>|</span>
            <span style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: C.accent }}>
              {minorCount}
            </span>
            <span style={{ fontSize: 12, color: C.muted }}>Minor</span>
            <span style={{ color: C.border }}>|</span>
            <span style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.s1 }}>
              {metCount}
            </span>
            <span style={{ fontSize: 12, color: C.s1 }}>Met</span>
          </div>
        </div>

        {/* Card 4: Remediation Effort */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "18px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            borderTop: `3px solid #1B3D29`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Remediation Learning Load</span>
            <span style={{ fontSize: 11, color: "#1B3D29", fontWeight: 700 }}>⚡ High ROI</span>
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 800, color: "#1B3D29", margin: "6px 0 0" }}>
            ~{totalEstHours} <span style={{ fontSize: 15, fontWeight: 600 }}>Hours</span>
          </div>
        </div>
      </div>

      {/* Visual Analysis Tab Selector Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
          background: C.surfaceAlt,
          padding: "4px 6px",
          borderRadius: 10,
          border: `1px solid ${C.border}`,
          width: "fit-content",
        }}
      >
        {[
          { key: "all", label: "📊 Complete Cadre Benchmarks" },
          { key: "enrolled", label: `🎯 Enrolled Focus Track (${userSelectedCourses.length || 1})` },
          { key: "spectrum", label: "📈 Competency Maturity Spectrum" },
          { key: "roi", label: "⚡ Learning ROI & Time-to-Bridge" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: "7px 16px",
              borderRadius: 7,
              border: "none",
              background: activeTab === tab.key ? C.dark : "transparent",
              color: activeTab === tab.key ? "#fff" : C.muted,
              fontFamily: FONT.body,
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visual Analytics Grid: Row 1 (Radar Polygon & Dual-Bar Comparison) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1.35fr", gap: 20, marginBottom: 24 }}>
        {/* Chart 1: Multi-Axis Competency Radar Chart */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 16.5, fontWeight: 700, color: C.dark }}>
                Multi-Axis Competency Radar
              </div>
              <div style={{ fontSize: 12.5, color: C.muted }}>
                Equi-angular multi-variable geometry comparing demonstrated score against role benchmark
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 6px", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", gap: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: C.accent, opacity: 0.9 }} />
                <span style={{ color: C.dark, fontWeight: 600 }}>Demonstrated Score (%)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: "#1B3D29", opacity: 0.4 }} />
                <span style={{ color: C.dark, fontWeight: 600 }}>Target Role Benchmark (%)</span>
              </div>
            </div>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>★ Enrolled Track Focus</span>
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
                name="Target Benchmark"
                dataKey="target"
                stroke="#1B3D29"
                fill="#1B3D29"
                fillOpacity={0.16}
                strokeWidth={2}
              />
              <Radar
                name="Demonstrated Score"
                dataKey="current"
                stroke={C.accent}
                fill={C.accent}
                fillOpacity={0.4}
                strokeWidth={2.5}
              />
              <Tooltip
                contentStyle={{
                  fontFamily: FONT.body,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(val, name) => [`${val}%`, name]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Grouped Comparison Bar Chart (Demonstrated vs Benchmark vs Deficit) */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 16.5, fontWeight: 700, color: C.dark }}>
                Demonstrated vs. Target Benchmark Variance
              </div>
              <div style={{ fontSize: 12.5, color: C.muted }}>
                Side-by-side deficit visualization illustrating current mastery against prescribed civil service threshold
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, margin: "12px 0 10px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: C.accent }} />
              <span style={{ color: C.dark, fontWeight: 600 }}>Demonstrated</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "#1B3D29" }} />
              <span style={{ color: C.dark, fontWeight: 600 }}>Benchmark Target</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: C.s4 }} />
              <span style={{ color: C.dark, fontWeight: 600 }}>Deficit Gap (To Bridge)</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={comparisonBarData} margin={{ top: 10, right: 15, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis
                dataKey="domain"
                tick={{ fontSize: 11, fill: C.dark, fontFamily: FONT.body, fontWeight: 600 }}
                interval={0}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: C.muted, fontFamily: FONT.body }} />
              <Tooltip
                contentStyle={{
                  fontFamily: FONT.body,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(val, name) => [`${val}%`, name]}
              />
              <Bar dataKey="Demonstrated" fill={C.accent} radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="Benchmark" fill="#1B3D29" radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="Deficit" fill={C.s4} radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visual Analytics Grid: Row 2 (Severity Distribution Donut & Learning ROI Efficiency Chart) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.5fr", gap: 20, marginBottom: 24 }}>
        {/* Chart 3: Deficit Severity Donut Breakdown */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 16.5, fontWeight: 700, color: C.dark, marginBottom: 4 }}>
            Competency Deficit Distribution
          </div>
          <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 14 }}>
            Categorization of evaluated competencies by required remediation urgency
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={severityDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontFamily: FONT.body,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val, name) => [`${val} Domain(s)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Total Overlay */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 800, color: C.dark, lineHeight: 1 }}>
                {displayedMetrics.length}
              </div>
              <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600, marginTop: 3 }}>Domains</div>
            </div>
          </div>

          {/* Donut Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {severityDonutData.map((item) => (
              <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
                  <span style={{ color: C.dark, fontWeight: 500 }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: item.color }}>
                  {item.value} ({Math.round((item.value / displayedMetrics.length) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Learning Efficiency & Study ROI (Points Gained per Hour) */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 16.5, fontWeight: 700, color: C.dark }}>
                Remediation Return on Investment (ROI)
              </div>
              <div style={{ fontSize: 12.5, color: C.muted }}>
                Deficit points bridged per study hour · Prioritize high-velocity competency gains
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.s1,
                background: "#E6F4EC",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              Sorted by Point Gain Velocity
            </span>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={roiData} layout="vertical" margin={{ top: 10, right: 30, bottom: 5, left: 75 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis
                type="number"
                unit=" pts/h"
                tick={{ fontSize: 10.5, fill: C.muted, fontFamily: FONT.body }}
              />
              <YAxis
                type="category"
                dataKey="domain"
                tick={{ fontSize: 11.5, fill: C.dark, fontFamily: FONT.body, fontWeight: 600 }}
                width={75}
              />
              <Tooltip
                formatter={(val, name, props) => [
                  `${val} pts/hr (${props.payload.gap}% gap in ${props.payload.hours}h)`,
                  "Gain Velocity",
                ]}
                contentStyle={{
                  fontFamily: FONT.body,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="efficiency" radius={[0, 6, 6, 0]} maxBarSize={22}>
                {roiData.map((entry, index) => (
                  <Cell
                    key={`roi-${index}`}
                    fill={entry.efficiency >= 3.5 ? C.s1 : entry.efficiency >= 2.0 ? C.accent : C.s4}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontSize: 11.5, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
            <span>⚡ <strong>Optimal Strategy:</strong> Tackle <strong>Python</strong> & <strong>Statistics</strong> first for maximum immediate benchmark elevation.</span>
          </div>
        </div>
      </div>

      {/* Visual Competency Maturity Spectrum (Stage Continuum) */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, color: C.dark }}>
              Competency Maturity Spectrum & Continuum
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>
              Progressive stages from Baseline Foundation towards full Civil Service Cadre Accreditation
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 11.5, color: C.muted }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.s4 }} /> Foundation (0–39%)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent }} /> Practitioner (40–69%)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.s1 }} /> Cadre Benchmark (70–84%)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1B3D29" }} /> Mastery (85–100%)
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {displayedMetrics.map((item) => (
            <div
              key={item.id}
              style={{
                background: C.bg,
                border: `1px solid ${item.isEnrolled ? C.accent : C.border}`,
                borderRadius: 10,
                padding: "14px 18px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>{item.domain}</span>
                  {item.isEnrolled && (
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        background: `${C.accent}20`,
                        color: C.accent,
                        padding: "2px 8px",
                        borderRadius: 4,
                        border: `1px solid ${C.accent}40`,
                      }}
                    >
                      ★ Enrolled Focus
                    </span>
                  )}
                  <span
                    style={{
                      ...severityStyle(item.severity),
                      padding: "2px 7px",
                      borderRadius: 12,
                      fontSize: 10.5,
                      fontWeight: 700,
                    }}
                  >
                    {item.severity}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12.5 }}>
                  <span>Demonstrated: <strong style={{ color: C.dark }}>{item.current}%</strong></span>
                  <span style={{ color: C.border }}>|</span>
                  <span>Benchmark: <strong style={{ color: "#1B3D29" }}>{item.target}%</strong></span>
                  <span style={{ color: C.border }}>|</span>
                  <span style={{ fontWeight: 700, color: gapColor(item.gap) }}>
                    {item.gap > 0 ? `Deficit: -${item.gap}%` : "Benchmark Satisfied"}
                  </span>
                </div>
              </div>

              {/* Multi-stage continuum visual bar */}
              <div style={{ position: "relative", height: 16, background: C.surfaceAlt, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
                {/* 4 stage background indicators */}
                <div style={{ position: "absolute", left: 0, width: "40%", height: "100%", background: "#FDECEA25", borderRight: `1px dashed ${C.border}` }} />
                <div style={{ position: "absolute", left: "40%", width: "30%", height: "100%", background: "#FEF3E230", borderRight: `1px dashed ${C.border}` }} />
                <div style={{ position: "absolute", left: "70%", width: "15%", height: "100%", background: "#E6F4EC30", borderRight: `1px dashed ${C.border}` }} />
                <div style={{ position: "absolute", left: "85%", width: "15%", height: "100%", background: "#1B3D2910" }} />

                {/* Demonstrated Score progress fill */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    width: `${item.current}%`,
                    height: "100%",
                    background: item.current >= item.target ? C.s1 : C.accent,
                    borderRadius: "8px 0 0 8px",
                  }}
                />

                {/* Deficit gap indicator zone */}
                {item.gap > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${item.current}%`,
                      width: `${item.gap}%`,
                      height: "100%",
                      background: item.severity === "Critical" ? `${C.s4}50` : `${C.accent}40`,
                      backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)",
                    }}
                  />
                )}

                {/* Benchmark Target Marker Pin */}
                <div
                  style={{
                    position: "absolute",
                    left: `calc(${item.target}% - 1.5px)`,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: "#1B3D29",
                    zIndex: 2,
                  }}
                  title={`Target: ${item.target}%`}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, fontSize: 11, color: C.muted }}>
                <span>0% Foundation</span>
                <span>40% Practitioner</span>
                <span style={{ fontWeight: 700, color: "#1B3D29" }}>Target Benchmark: {item.target}%</span>
                <span>100% Mastery</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Bottom Row: Gap Matrix Table & Remedial Course Modules */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.2fr", gap: 20, marginBottom: 28 }}>
        {/* Competency Gap Matrix Table */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 16.5, fontWeight: 700, color: C.dark }}>
                Competency Gap Matrix Table
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>Standardized competency mastery breakdown</div>
            </div>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Ranked by Priority</span>
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
              {displayedMetrics.map((row, i) => (
                <tr key={row.id} style={{ background: i % 2 === 0 ? "transparent" : "#F5F1E888" }}>
                  <td style={{ padding: "10px 6px", color: C.dark, fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{row.domain}</span>
                      {row.isEnrolled && (
                        <span style={{ fontSize: 9.5, color: C.accent, fontWeight: 700 }}>★</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 400 }}>Rank #{row.priorityRank} · ~{row.estHours}h course</div>
                  </td>
                  <td style={{ padding: "10px 6px", color: C.dark, fontWeight: 600 }}>{row.current}%</td>
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

        {/* Curated Remedial Courses Mapped to Highest Gaps */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 16.5, fontWeight: 700, color: C.dark }}>
                Curated iGOT Remedial Courses
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>Direct learning modules to close highest deficit gaps</div>
            </div>
            <button
              onClick={() => navigate("/student/courses")}
              style={{
                padding: "5px 10px",
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 600,
                color: C.dark,
                cursor: "pointer",
              }}
            >
              Catalog →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {prioritizedCourses.map((c) => {
              const courseProg = getCourseProgress(c.courseId);
              return (
                <div
                  key={c.courseCode}
                  style={{
                    background: C.bg,
                    border: `1px solid ${c.severity === "Critical" ? `${C.s4}44` : C.border}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        background: "#1B3D29",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {c.provider}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: c.severity === "Critical" ? C.s4 : C.accent,
                      }}
                    >
                      🎯 Bridges {c.gapPoints}% Gap
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: 13, color: C.dark, lineHeight: 1.3 }}>
                    {c.title}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, color: C.muted }}>
                    <span>Duration: <strong>{c.duration}</strong></span>
                    <span>Progress: <strong>{courseProg.percent}%</strong></span>
                  </div>

                  <button
                    onClick={() => navigate(c.courseId ? `/student/courses/${c.courseId}/learn` : "/student/courses")}
                    style={{
                      marginTop: 4,
                      padding: "8px 0",
                      background: C.accent,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      fontFamily: FONT.body,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      textAlign: "center",
                      boxShadow: "0 2px 5px rgba(198, 133, 27, 0.2)",
                    }}
                  >
                    {courseProg.percent === 0 ? "Start Module & Bridge Gap →" : `Resume Module (${courseProg.percent}%) →`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Call to Action */}
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
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(27, 61, 41, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>View 4-Phase Personalized Roadmap</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

