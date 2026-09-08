import { useState } from "react";
import { C, FONT } from "@/tokens";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface DomainDetail {
  domain: string;
  benchmark: number;
  universityScore: number;
  aspirantScore: number;
  civilServantScore: number;
  techScholarScore: number;
  subCompetencies: { name: string; score: number; target: number }[];
  gapSeverity: "Critical" | "Minor" | "Benchmark Met";
  recommendedCourse: string;
  targetLearners: string;
}

const DOMAIN_DETAILS: Record<string, DomainDetail> = {
  Statistics: {
    domain: "Applied Statistics & Sampling",
    benchmark: 75,
    universityScore: 88,
    aspirantScore: 68,
    civilServantScore: 84,
    techScholarScore: 82,
    gapSeverity: "Benchmark Met",
    recommendedCourse: "Advanced Sampling Theory & NSS Estimation Procedures",
    targetLearners: "Civil Services Aspirants & University Researchers",
    subCompetencies: [
      { name: "Stratified Multi-Stage Sampling Design", score: 85, target: 80 },
      { name: "Variance Estimation & Finite Population Correction", score: 80, target: 75 },
      { name: "Survey Weight Calibration", score: 78, target: 75 },
      { name: "Hypothesis Testing & Statistical Inference", score: 86, target: 80 },
    ],
  },
  PythonAI: {
    domain: "Python, Data Science & AI",
    benchmark: 75,
    universityScore: 92,
    aspirantScore: 50,
    civilServantScore: 62,
    techScholarScore: 95,
    gapSeverity: "Minor",
    recommendedCourse: "Python for Data Science & Machine Learning Foundations",
    targetLearners: "In-Service Officers & Public Administration Aspirants",
    subCompetencies: [
      { name: "Pandas/NumPy Data Processing", score: 88, target: 80 },
      { name: "Machine Learning & Predictive Modeling", score: 82, target: 75 },
      { name: "API Integration & Automated Data Pipelines", score: 76, target: 75 },
      { name: "Data Visualization & Dashboarding", score: 84, target: 80 },
    ],
  },
  Governance: {
    domain: "Public Governance & Administration",
    benchmark: 75,
    universityScore: 72,
    aspirantScore: 90,
    civilServantScore: 92,
    techScholarScore: 65,
    gapSeverity: "Benchmark Met",
    recommendedCourse: "Foundation Course in Governance & Policy Formulation",
    targetLearners: "University Students & Technical Scholars",
    subCompetencies: [
      { name: "Constitutional Framework & Separation of Powers", score: 88, target: 80 },
      { name: "Administrative Structures & Citizen Charters", score: 80, target: 75 },
      { name: "Decentralized Planning & Panchayati Raj", score: 78, target: 75 },
      { name: "Grievance Redressal Mechanisms (CPGRAMS)", score: 82, target: 75 },
    ],
  },
  Ethics: {
    domain: "Ethics & Integrity",
    benchmark: 80,
    universityScore: 82,
    aspirantScore: 88,
    civilServantScore: 90,
    techScholarScore: 80,
    gapSeverity: "Benchmark Met",
    recommendedCourse: "Ethics & Integrity in Public Service",
    targetLearners: "All Student & Candidate Streams",
    subCompetencies: [
      { name: "Moral Reasoning & Ethical Dilemmas", score: 86, target: 80 },
      { name: "Code of Conduct & Professional Integrity", score: 88, target: 85 },
      { name: "Conflict of Interest Resolution", score: 84, target: 80 },
      { name: "Transparency & Whistleblower Protection", score: 82, target: 75 },
    ],
  },
  DigitalGov: {
    domain: "Digital Governance & Cybersecurity",
    benchmark: 75,
    universityScore: 85,
    aspirantScore: 60,
    civilServantScore: 54,
    techScholarScore: 90,
    gapSeverity: "Critical",
    recommendedCourse: "Digital Governance Fundamentals & India Stack",
    targetLearners: "In-Service Civil Servants & Policy Aspirants",
    subCompetencies: [
      { name: "India Stack Ecosystem (Aadhaar/UPI/DigiLocker)", score: 70, target: 80 },
      { name: "Digital Personal Data Protection (DPDP Act)", score: 58, target: 75 },
      { name: "Cybersecurity Protocols & Threat Prevention", score: 62, target: 75 },
      { name: "Open Data Platforms & e-Office Systems", score: 68, target: 75 },
    ],
  },
  Finance: {
    domain: "Public Finance & Fiscal Management",
    benchmark: 70,
    universityScore: 68,
    aspirantScore: 78,
    civilServantScore: 88,
    techScholarScore: 60,
    gapSeverity: "Minor",
    recommendedCourse: "Public Finance Management & GeM Procurement Mastery",
    targetLearners: "University Students & Non-Finance Aspirants",
    subCompetencies: [
      { name: "General Financial Rules (GFR 2017)", score: 75, target: 75 },
      { name: "Outcome Budgeting & Financial Auditing", score: 72, target: 70 },
      { name: "Government e-Marketplace (GeM) Procurement", score: 70, target: 70 },
      { name: "Macro-Fiscal Indicators & Economic Survey Analysis", score: 76, target: 75 },
    ],
  },
};

const BASE_RADAR_DATA = [
  { domain: "Statistics", University: 88, Aspirants: 68, CivilServants: 84, TechScholars: 82, Benchmark: 75 },
  { domain: "Python & AI", University: 92, Aspirants: 50, CivilServants: 62, TechScholars: 95, Benchmark: 75 },
  { domain: "Governance", University: 72, Aspirants: 90, CivilServants: 92, TechScholars: 65, Benchmark: 75 },
  { domain: "Ethics", University: 82, Aspirants: 88, CivilServants: 90, TechScholars: 80, Benchmark: 80 },
  { domain: "Digital Gov", University: 85, Aspirants: 60, CivilServants: 54, TechScholars: 90, Benchmark: 75 },
  { domain: "Finance", University: 68, Aspirants: 78, CivilServants: 88, TechScholars: 60, Benchmark: 70 },
];

const BASE_TREND_DATA = [
  { week: "W1", overall: 68, university: 72, aspirants: 65, civilServants: 70 },
  { week: "W2", overall: 70, university: 74, aspirants: 68, civilServants: 72 },
  { week: "W3", overall: 72, university: 76, aspirants: 70, civilServants: 73 },
  { week: "W4", overall: 74, university: 78, aspirants: 72, civilServants: 75 },
  { week: "W5", overall: 75, university: 80, aspirants: 73, civilServants: 76 },
  { week: "W6", overall: 77, university: 82, aspirants: 75, civilServants: 78 },
  { week: "W7", overall: 79, university: 84, aspirants: 77, civilServants: 80 },
  { week: "W8", overall: 81, university: 86, aspirants: 79, civilServants: 82 },
];

const GAP_MATRIX = [
  { domain: "Applied Statistics", key: "Statistics", University: 88, Aspirants: 68, CivilServants: 84, TechScholars: 82 },
  { domain: "Python, Data Science & AI", key: "PythonAI", University: 92, Aspirants: 50, CivilServants: 62, TechScholars: 95 },
  { domain: "Public Governance", key: "Governance", University: 72, Aspirants: 90, CivilServants: 92, TechScholars: 65 },
  { domain: "Ethics & Integrity", key: "Ethics", University: 82, Aspirants: 88, CivilServants: 90, TechScholars: 80 },
  { domain: "Digital Gov & Cyber", key: "DigitalGov", University: 85, Aspirants: 60, CivilServants: 54, TechScholars: 90 },
  { domain: "Public Finance", key: "Finance", University: 68, Aspirants: 78, CivilServants: 88, TechScholars: 60 },
];

const STREAMS_LIST = ["University", "Aspirants", "CivilServants", "TechScholars"];

const STREAM_DISPLAY_NAMES: Record<string, string> = {
  University: "University Students",
  Aspirants: "Civil Aspirants",
  CivilServants: "Civil Servants",
  TechScholars: "Tech Scholars",
};

const ALL_TOP_LEARNERS = [
  { name: "Ananya Iyer", track: "University / College", score: 98, institution: "Delhi University (M.Sc Statistics)" },
  { name: "Sneha Kulkarni", track: "Data Science & AI", score: 96, institution: "Pune University (M.Tech AI)" },
  { name: "Meena Pillai", track: "In-Service Civil Servant", score: 96, institution: "DOPT (Director)" },
  { name: "Aarav Sharma", track: "University / College", score: 95, institution: "IIT Delhi (B.Tech Data Science)" },
  { name: "Rohan Verma", track: "Civil Services Aspirant", score: 94, institution: "Jamia Millia Academy" },
  { name: "Kavita Rao", track: "In-Service Civil Servant", score: 95, institution: "MoSPI (Joint Director)" },
  { name: "Priya Sharma", track: "In-Service Civil Servant", score: 94, institution: "Ministry of Finance" },
];

const ALL_AT_RISK_LEARNERS = [
  { name: "Vikram Singh", track: "In-Service Civil Servant", score: 38, institution: "Ministry of Home (IPS)" },
  { name: "Suresh Nair", track: "Civil Services Aspirant", score: 45, institution: "Kerala State PSC Academy" },
  { name: "Arjun Mehta", track: "University / College", score: 42, institution: "Mumbai University" },
  { name: "Karan Johar", track: "Data Science & AI", score: 48, institution: "Open Vocational Learner" },
  { name: "Deepa Reddy", track: "In-Service Civil Servant", score: 58, institution: "CBDT" },
];

function scoreColor(v: number) {
  if (v >= 80) return { bg: "#E6F4EC", color: C.s1 };
  if (v >= 65) return { bg: "#FEF5E7", color: C.s2 };
  return { bg: "#FDEEE9", color: C.s4 };
}

export default function CompetencyAnalytics() {
  const [stream, setStream] = useState("All");
  const [dateRange, setDateRange] = useState("Last 3 Months");
  const [selectedDomain, setSelectedDomain] = useState<DomainDetail | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const currentStreamAvg =
    stream === "University"
      ? 81
      : stream === "Aspirants"
      ? 72
      : stream === "CivilServants"
      ? 78
      : stream === "TechScholars"
      ? 84
      : 78;

  const kpis = [
    { label: "Cohort Avg Competency", value: `${currentStreamAvg}`, unit: "/100 target", color: C.s1 },
    { label: "Highest Domain", value: stream === "University" ? "Python & AI" : stream === "Aspirants" ? "Governance" : "Statistics", unit: "88+", color: C.s2 },
    { label: "Priority Remediation Area", value: stream === "CivilServants" ? "Digital Gov" : stream === "Aspirants" ? "Python/Data" : "Public Finance", unit: "Critical Gap", color: C.s4 },
    { label: "Skill Velocity", value: "+14.2%", unit: "diagnostic gain", color: C.s3 },
  ];

  // Export Matrix
  const handleExportGapMatrix = () => {
    const header = "Domain,Benchmark,University Students,Civil Aspirants,In-Service Civil Servants,Tech Scholars\n";
    const rows = GAP_MATRIX.map((g) => {
      return `"${g.domain}","75","${g.University}","${g.Aspirants}","${g.CivilServants}","${g.TechScholars}"`;
    }).join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `GyanMarg_Universal_Competency_Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported Universal Competency Gap Matrix to CSV.`);
  };

  const selectStyle = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: FONT.body,
    color: C.dark,
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, position: "relative" }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 99999,
            background: C.dark,
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span style={{ color: C.s1, fontSize: 16 }}>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0 }}>
            Universal Competency Analytics
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>
            Multi-stream diagnostic intelligence covering University Students, Competitive Aspirants, Tech Scholars & Civil Servants
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <select style={selectStyle} value={stream} onChange={(e) => setStream(e.target.value)}>
            <option value="All">All Student Streams</option>
            <option value="University">University & College Scholars</option>
            <option value="Aspirants">Civil Services Aspirants</option>
            <option value="CivilServants">In-Service Civil Servants</option>
            <option value="TechScholars">Data Science & AI Scholars</option>
          </select>
          <select style={selectStyle} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            {["Last Month", "Last 3 Months", "Last 6 Months", "This Year"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={handleExportGapMatrix}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>📥</span> Export Matrix CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: C.surface, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${k.color}`, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: FONT.display, color: C.dark }}>{k.value}</div>
            <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{k.unit}</div>
          </div>
        ))}
      </div>

      {/* Radar Comparison Chart */}
      <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600 }}>
            {stream === "All"
              ? "Cross-Stream Competency Comparison (Universities vs Aspirants vs Civil Servants vs Tech Scholars)"
              : `${STREAM_DISPLAY_NAMES[stream] || stream} vs National Target Benchmark`}
          </div>
          <span style={{ fontSize: 12, color: C.muted }}>Click any domain below for curriculum deep-dive</span>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={BASE_RADAR_DATA} cx="50%" cy="50%" outerRadius={120}>
            <PolarGrid stroke={C.border} />
            <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12, fill: C.muted }} />
            {stream === "All" ? (
              <>
                <Radar name="University Students" dataKey="University" stroke={C.s1} fill={C.s1} fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Civil Aspirants" dataKey="Aspirants" stroke={C.accent} fill={C.accent} fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Civil Servants" dataKey="CivilServants" stroke={C.s2} fill={C.s2} fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Tech Scholars" dataKey="TechScholars" stroke={C.s3} fill={C.s3} fillOpacity={0.15} strokeWidth={2} />
              </>
            ) : (
              <>
                <Radar name={STREAM_DISPLAY_NAMES[stream] || stream} dataKey={stream} stroke={C.s1} fill={C.s1} fillOpacity={0.25} strokeWidth={2.5} />
                <Radar name="National Benchmark" dataKey="Benchmark" stroke={C.s4} fill={C.s4} fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
              </>
            )}
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Two Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Learning Progression Curves ({dateRange})
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={BASE_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 90]} tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="university" name="University Students" stroke={C.s1} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="aspirants" name="Civil Aspirants" stroke={C.accent} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="civilServants" name="Civil Servants" stroke={C.s2} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Domain Proficiencies ({stream === "All" ? "Across All Streams" : STREAM_DISPLAY_NAMES[stream]})
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BASE_RADAR_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="domain" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {stream === "All" ? (
                <>
                  <Bar dataKey="University" name="University" fill={C.s1} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Aspirants" name="Aspirants" fill={C.accent} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="CivilServants" name="Civil Servants" fill={C.s2} radius={[3, 3, 0, 0]} />
                </>
              ) : (
                <>
                  <Bar dataKey={stream} name={STREAM_DISPLAY_NAMES[stream]} fill={C.s1} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Benchmark" name="Target Benchmark" fill={C.s4} radius={[3, 3, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Gap Analysis Matrix Table */}
      <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.dark }}>
              Multi-Stream Competency Gap Matrix
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              Comprehensive evaluation of technical & administrative competencies across all learning cohorts
            </div>
          </div>
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>👆 Click Any Domain to Inspect</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
              <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: C.muted }}>Domain Area</th>
              <th style={{ textAlign: "center", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: C.muted }}>Benchmark</th>
              {STREAMS_LIST.map((s) => (
                <th key={s} style={{ textAlign: "center", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: stream === s ? C.accent : C.muted }}>
                  {STREAM_DISPLAY_NAMES[s]} {stream === s && "★"}
                </th>
              ))}
              <th style={{ textAlign: "center", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: C.muted }}>Remediation</th>
            </tr>
          </thead>
          <tbody>
            {GAP_MATRIX.map((row, i) => {
              const detail = DOMAIN_DETAILS[row.key];
              return (
                <tr
                  key={row.domain}
                  onClick={() => setSelectedDomain(detail)}
                  style={{
                    borderBottom: i < GAP_MATRIX.length - 1 ? `1px solid ${C.border}` : "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF8F4")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: C.dark }}>
                    {row.domain}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "center", fontSize: 13, fontWeight: 600, color: C.muted }}>
                    {detail?.benchmark || 75}%
                  </td>
                  {STREAMS_LIST.map((s) => {
                    const val = row[s as keyof typeof row] as number;
                    const { bg, color } = scoreColor(val);
                    return (
                      <td key={s} style={{ padding: "12px 14px", textAlign: "center" }}>
                        <span style={{ background: bg, color, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                          {val}
                        </span>
                      </td>
                    );
                  })}
                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                    <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>Deep Dive →</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ marginTop: 14, display: "flex", gap: 16, fontSize: 12, color: C.muted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, background: C.s1, borderRadius: 2 }} /> 80+ Benchmark Met
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, background: C.s2, borderRadius: 2 }} /> 65–79 Minor Intervention Needed
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, background: C.s4, borderRadius: 2 }} /> Below 65 Critical Gap
          </span>
        </div>
      </div>

      {/* Top Performers + Needs Attention */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 14, color: C.s1 }}>
            Top Performing Scholars & Officers
          </div>
          {ALL_TOP_LEARNERS.map((p, i) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < ALL_TOP_LEARNERS.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.s1, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.faint }}>{p.track} · {p.institution}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.s1 }}>{p.score}%</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 14, color: C.s4 }}>
            Priority Support & Intervention Needed
          </div>
          {ALL_AT_RISK_LEARNERS.map((p, i) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < ALL_AT_RISK_LEARNERS.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FDEEE9", color: C.s4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.faint }}>{p.track} · {p.institution}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.s4 }}>{p.score}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Domain Deep-Dive Modal ────────────────────────────────────── */}
      {selectedDomain && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setSelectedDomain(null)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 640,
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.accent, letterSpacing: "0.06em" }}>
                  Competency Domain Inspection
                </span>
                <h2 style={{ fontFamily: FONT.display, fontSize: 19, fontWeight: 700, margin: "2px 0 0", color: C.dark }}>
                  {selectedDomain.domain}
                </h2>
              </div>
              <button onClick={() => setSelectedDomain(null)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20, textAlign: "center" }}>
                <div style={{ background: C.bg, padding: "10px", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: C.muted }}>Benchmark</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginTop: 2 }}>{selectedDomain.benchmark}%</div>
                </div>
                <div style={{ background: C.bg, padding: "10px", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: C.muted }}>University</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: selectedDomain.universityScore >= selectedDomain.benchmark ? C.s1 : C.s4, marginTop: 2 }}>
                    {selectedDomain.universityScore}%
                  </div>
                </div>
                <div style={{ background: C.bg, padding: "10px", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: C.muted }}>Aspirants</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: selectedDomain.aspirantScore >= selectedDomain.benchmark ? C.s1 : C.s4, marginTop: 2 }}>
                    {selectedDomain.aspirantScore}%
                  </div>
                </div>
                <div style={{ background: C.bg, padding: "10px", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: C.muted }}>Civil Servants</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: selectedDomain.civilServantScore >= selectedDomain.benchmark ? C.s1 : C.s4, marginTop: 2 }}>
                    {selectedDomain.civilServantScore}%
                  </div>
                </div>
              </div>

              {/* Sub-competencies progress bars */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 10 }}>Underlying Sub-Competencies</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selectedDomain.subCompetencies.map((sub) => (
                    <div key={sub.name} style={{ background: C.bg, padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: C.dark }}>{sub.name}</span>
                        <span>
                          <strong style={{ color: sub.score >= sub.target ? C.s1 : C.s4 }}>{sub.score}%</strong> / Target {sub.target}%
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
                        <div style={{ width: `${sub.score}%`, height: "100%", background: sub.score >= sub.target ? C.s1 : C.s4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Course & Target Audience */}
              <div style={{ background: "#F5F2EB", borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>Recommended Remediation Course</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginTop: 4 }}>
                  {selectedDomain.recommendedCourse}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                  Primary Target: <strong>{selectedDomain.targetLearners}</strong>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => {
                    showToast(`Remediation recommendation dispatched for "${selectedDomain.domain}".`);
                    setSelectedDomain(null);
                  }}
                  style={{
                    background: C.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px 20px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT.body,
                  }}
                >
                  Recommend to Target Cohort
                </button>
                <button
                  onClick={() => setSelectedDomain(null)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 16px",
                    fontSize: 13,
                    color: C.muted,
                    cursor: "pointer",
                    fontFamily: FONT.body,
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
