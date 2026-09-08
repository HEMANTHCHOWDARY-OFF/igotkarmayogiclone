import { useState } from "react";
import { C, FONT } from "@/tokens";
import { exportToExcel, exportToCSV } from "@/utils/exportUtils";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface ReportItem {
  id: string;
  name: string;
  type: "Competency" | "Enrollment" | "Gap Analysis" | "Completion";
  date: string;
  format: "PDF" | "Excel" | "CSV";
  size: string;
  department: string;
  month: string;
}

const REPORT_TYPES = [
  { label: "Competency Report", icon: "📊", desc: "Domain scores across cohorts", type: "Competency" as const },
  { label: "Enrollment Report", icon: "📈", desc: "Enrollment & growth trends", type: "Enrollment" as const },
  { label: "Completion Report", icon: "✅", desc: "Completion & certification by cohort", type: "Completion" as const },
  { label: "Gap Analysis Report", icon: "🔍", desc: "Competency deficits & interventions", type: "Gap Analysis" as const },
];

const MONTHS = ["April", "May", "June", "July", "August", "September"];
const FORMATS: ("PDF" | "Excel" | "CSV")[] = ["PDF", "Excel", "CSV"];
const COHORTS_FILTER = [
  "All Learner Cohorts",
  "Higher Education / University",
  "Civil Services & Policy Aspirants",
  "In-Service Civil Servants",
  "Data Science & AI Scholars",
  "Working Professionals",
];

const BASE_COMPETENCY_DATA = [
  { domain: "Ethics & Integrity", University: 82, CivilServices: 90, DataScience: 78, Professional: 85, score: 84 },
  { domain: "Governance & Policy", University: 74, CivilServices: 88, DataScience: 65, Professional: 76, score: 76 },
  { domain: "Data Science & AI", University: 86, CivilServices: 58, DataScience: 94, Professional: 80, score: 80 },
  { domain: "Applied Engineering", University: 88, CivilServices: 52, DataScience: 91, Professional: 84, score: 78 },
  { domain: "Constitutional Law", University: 68, CivilServices: 86, DataScience: 50, Professional: 64, score: 67 },
  { domain: "Public Finance", University: 60, CivilServices: 80, DataScience: 56, Professional: 82, score: 70 },
];

const BASE_ENROLLMENT_DATA = [
  { month: "Apr", count: 980 },
  { month: "May", count: 1120 },
  { month: "Jun", count: 1340 },
  { month: "Jul", count: 1280 },
  { month: "Aug", count: 1520 },
  { month: "Sep", count: 1680 },
];

const BASE_COMPLETION_PIE = [
  { name: "University Scholars", value: 94, students: 4880 },
  { name: "Civil Services Aspirants", value: 92, students: 3340 },
  { name: "In-Service Civil Servants", value: 96, students: 2310 },
  { name: "Tech & AI Scholars", value: 91, students: 1540 },
  { name: "Working Professionals", value: 88, students: 770 },
];

const BASE_GAP_RADAR = [
  { domain: "Ethics & Integrity", required: 80, actual: 84 },
  { domain: "Governance", required: 75, actual: 76 },
  { domain: "Data & AI", required: 75, actual: 80 },
  { domain: "Engineering", required: 75, actual: 78 },
  { domain: "Constitutional Law", required: 70, actual: 67 },
  { domain: "Public Finance", required: 70, actual: 70 },
];

const PIE_COLORS = [C.s1, C.s3, C.s2, C.s4, "#8C3B17"];

const INITIAL_RECENT_REPORTS: ReportItem[] = [
  { id: "rep-1", name: "Universal Competency Audit — August 2026", type: "Competency", date: "Sep 1, 2026", format: "PDF", size: "2.4 MB", department: "All Learner Cohorts", month: "August" },
  { id: "rep-2", name: "Higher Ed & Tech Enrollment Report — Q2 2026", type: "Enrollment", date: "Aug 15, 2026", format: "Excel", size: "1.1 MB", department: "Higher Education / University", month: "July" },
  { id: "rep-3", name: "Civil Services & Public Policy Gap Analysis", type: "Gap Analysis", date: "Aug 10, 2026", format: "PDF", size: "3.2 MB", department: "Civil Services & Policy Aspirants", month: "August" },
  { id: "rep-4", name: "All-Student Completion Metrics — July 2026", type: "Completion", date: "Aug 5, 2026", format: "CSV", size: "0.8 MB", department: "All Learner Cohorts", month: "July" },
  { id: "rep-5", name: "AI & Tech Scholars Skill Benchmark — Q1 2026", type: "Competency", date: "Apr 30, 2026", format: "PDF", size: "2.9 MB", department: "Data Science & AI Scholars", month: "April" },
];

const formatIconStyle = (fmt: string): { bg: string; color: string } => {
  if (fmt === "PDF") return { bg: "#FDEEE9", color: C.s4 };
  if (fmt === "Excel") return { bg: "#E6F4EC", color: C.s1 };
  return { bg: "#FEF5E7", color: C.s2 };
};

export default function Reports() {
  const [activeReport, setActiveReport] = useState(0);
  const [month, setMonth] = useState("September");
  const [dept, setDept] = useState("All Learner Cohorts");
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [recentReports, setRecentReports] = useState<ReportItem[]>(INITIAL_RECENT_REPORTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStepText, setGenStepText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const lastUpdated = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Dynamic preview competency data based on selected cohort
  const dynamicCompetencyData = BASE_COMPETENCY_DATA.map((r) => {
    let scoreVal = r.score;
    if (dept.includes("University")) scoreVal = r.University;
    else if (dept.includes("Civil Services")) scoreVal = r.CivilServices;
    else if (dept.includes("In-Service")) scoreVal = Math.min(r.CivilServices + 2, 98);
    else if (dept.includes("Data Science")) scoreVal = r.DataScience;
    else if (dept.includes("Professional")) scoreVal = r.Professional;
    return { domain: r.domain, score: scoreVal };
  });

  // Dynamic gap radar data based on selected cohort
  const dynamicGapRadar = BASE_GAP_RADAR.map((r) => {
    let factor = 1.0;
    if (dept.includes("Civil Services") || dept.includes("In-Service")) {
      if (r.domain.includes("Ethics") || r.domain.includes("Governance")) factor = 1.1;
      if (r.domain.includes("Data") || r.domain.includes("Engineering")) factor = 0.85;
    } else if (dept.includes("Data Science") || dept.includes("University")) {
      if (r.domain.includes("Data") || r.domain.includes("Engineering")) factor = 1.15;
      if (r.domain.includes("Law") || r.domain.includes("Finance")) factor = 0.88;
    }
    return {
      domain: r.domain,
      required: r.required,
      actual: Math.min(Math.round(r.actual * factor), 98),
    };
  });

  // File Downloader Generator
  const downloadReportFile = (rep: ReportItem) => {
    const timestamp = new Date().toISOString().split("T")[0];
    const safeTitle = rep.name.replace(/[^a-zA-Z0-9_-]/g, "_");

    if (rep.format === "Excel" || rep.format === "CSV") {
      let headers: string[] = [];
      let rows: (string | number)[][] = [];

      if (rep.type === "Competency") {
        headers = ["Domain", "University Scholars", "Civil Service Aspirants", "In-Service Civil Servants", "Data Science Scholars", "Working Professionals", "Benchmark Target", "Status"];
        rows = [
          ["Ethics & Integrity", 82, 88, 92, 78, 85, 80, "Benchmark Met"],
          ["Governance & Administration", 74, 86, 90, 65, 76, 75, "Benchmark Met"],
          ["Data Science & AI", 86, 55, 60, 94, 80, 75, "Benchmark Met"],
          ["Applied Engineering", 88, 50, 54, 91, 84, 75, "Benchmark Met"],
          ["Constitutional & Legal", 68, 85, 87, 50, 64, 70, "Minor Gap"],
          ["Public Finance & Management", 60, 78, 82, 56, 82, 70, "Target Met"],
        ];
      } else if (rep.type === "Enrollment") {
        headers = ["Month", "Cohort Track", "Total Enrolled", "Completed", "Active Learners", "Completion Rate"];
        rows = [
          ["Apr 2026", "All Student Cohorts", 980, 820, 890, "83.6%"],
          ["May 2026", "All Student Cohorts", 1120, 960, 1020, "85.7%"],
          ["Jun 2026", "All Student Cohorts", 1340, 1100, 1210, "82.0%"],
          ["Jul 2026", "All Student Cohorts", 1280, 1080, 1150, "84.3%"],
          ["Aug 2026", "All Student Cohorts", 1520, 1320, 1390, "86.8%"],
          ["Sep 2026", "All Student Cohorts", 1680, 1480, 1540, "88.0%"],
        ];
      } else if (rep.type === "Completion") {
        headers = ["Cohort Track", "Total Enrolled", "Completed", "Completion Rate", "Certified Students"];
        rows = [
          ["Higher Education / University Scholars", 4880, 4587, "94%", 4100],
          ["Civil Services & Policy Aspirants", 3340, 3072, "92%", 2850],
          ["In-Service Civil Servants", 2310, 2217, "96%", 2050],
          ["Data Science & AI Scholars", 1540, 1401, "91%", 1280],
          ["Working Professionals", 770, 677, "88%", 590],
        ];
      } else {
        headers = ["Domain", "Required Target", "Demonstrated Score", "Deficit Gap", "Recommended Action"];
        rows = [
          ["Data Science & AI (Non-Tech Cohorts)", 75, 58, -17, "Prescribe Applied AI Basics"],
          ["Constitutional & Admin Law (Tech Cohorts)", 70, 50, -20, "Prescribe Legal Primer"],
          ["Public Finance & GeM", 70, 65, -5, "Enroll in Public Procurement Module"],
          ["Applied Engineering", 75, 78, 3, "Benchmark Met"],
          ["Governance & Administration", 75, 76, 1, "Benchmark Met"],
          ["Ethics & Integrity", 80, 84, 4, "Benchmark Met"],
        ];
      }

      if (rep.format === "Excel") {
        exportToExcel(`${safeTitle}_${timestamp}`, [
          {
            sheetName: `${rep.type} Analysis`,
            headers,
            rows,
          },
        ]);
      } else {
        exportToCSV(`${safeTitle}_${timestamp}`, headers, rows);
      }
    } else {
      // PDF print window simulation / styled document download
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${rep.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1c2826; }
            h1 { color: #0f2318; border-bottom: 2px solid #C6851B; padding-bottom: 12px; }
            .meta { color: #666; margin-bottom: 24px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px 14px; text-align: left; }
            th { background-color: #f5f2eb; }
            .badge { background: #e6f4ec; color: #1E6B42; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>GyanMarg AI — ${rep.name}</h1>
          <div class="meta">
            <strong>Target Cohort:</strong> ${rep.department} | <strong>Reporting Period:</strong> ${rep.month} 2026 | <strong>Generated:</strong> ${new Date().toLocaleDateString()}
          </div>
          <p>This multi-disciplinary learning & competency evaluation report reflects verified assessment benchmarks across University Scholars, Civil Services Aspirants, In-Service Officers, and Technology Fellows.</p>
          <table>
            <thead>
              <tr><th>Domain / Metric</th><th>Required Target</th><th>Demonstrated Cohort Score</th><th>Evaluation Status</th></tr>
            </thead>
            <tbody>
              <tr><td>Ethics & Integrity</td><td>80%</td><td>84%</td><td><span class="badge">Benchmark Met</span></td></tr>
              <tr><td>Governance & Public Policy</td><td>75%</td><td>76%</td><td><span class="badge">Benchmark Met</span></td></tr>
              <tr><td>Data Science & AI</td><td>75%</td><td>80%</td><td><span class="badge">Benchmark Met</span></td></tr>
              <tr><td>Applied Engineering</td><td>75%</td><td>78%</td><td><span class="badge">Benchmark Met</span></td></tr>
              <tr><td>Constitutional Law</td><td>70%</td><td>67%</td><td>Minor Gap</td></tr>
              <tr><td>Public Finance & Management</td><td>70%</td><td>70%</td><td><span class="badge">Benchmark Met</span></td></tr>
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${safeTitle}_${timestamp}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    showToast(`Downloaded "${rep.name}" in ${rep.format} format.`);
  };

  // Generate Report Handler (Excel or CSV)
  const handleGenerateReport = (chosenFormat: "Excel" | "CSV") => {
    setShowFormatModal(false);
    const reportTypeObj = REPORT_TYPES[activeReport];
    setIsGenerating(true);
    setGenStepText(`1/3: Ingesting examination logs for ${dept}...`);

    setTimeout(() => {
      setGenStepText(`2/3: Applying multi-stream competency rubrics...`);
      setTimeout(() => {
        setGenStepText(`3/3: Formatting data into ${chosenFormat} extraction...`);
        setTimeout(() => {
          const newReport: ReportItem = {
            id: `rep-${Date.now()}`,
            name: `${reportTypeObj.label} — ${month} 2026 (${dept})`,
            type: reportTypeObj.type,
            date: "Today",
            format: chosenFormat,
            size: chosenFormat === "Excel" ? "1.4 MB" : "0.6 MB",
            department: dept,
            month: month,
          };

          setRecentReports([newReport, ...recentReports]);
          setIsGenerating(false);
          setGenStepText("");
          downloadReportFile(newReport);
          showToast(`Report "${newReport.name}" generated & downloaded in ${chosenFormat} format.`);
        }, 500);
      }, 500);
    }, 400);
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
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0 }}>Reports & Executive Analytics</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.faint }}>Last compiled: {lastUpdated}</p>
        </div>
        <button
          onClick={() => setShowFormatModal(true)}
          disabled={isGenerating}
          style={{
            background: C.accent,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontFamily: FONT.body,
            fontSize: 14,
            fontWeight: 600,
            cursor: isGenerating ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{isGenerating ? "⏳" : "⚡"}</span>
          {isGenerating ? "Compiling Report..." : "Generate Report"}
        </button>
      </div>

      {/* Generation Progress Banner */}
      {isGenerating && (
        <div style={{ background: "#F5F2EB", borderRadius: 10, padding: "14px 20px", marginBottom: 20, border: `1px solid ${C.accent}`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 20, height: 20, border: `3px solid ${C.accent}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{genStepText}</span>
        </div>
      )}

      {/* Report Type Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {REPORT_TYPES.map((r, i) => (
          <button
            key={r.label}
            onClick={() => setActiveReport(i)}
            style={{
              background: activeReport === i ? C.dark : C.surface,
              border: `2px solid ${activeReport === i ? C.dark : C.border}`,
              borderRadius: 12,
              padding: "16px 18px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>{r.icon}</div>
            <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 600, color: activeReport === i ? "#fff" : C.dark }}>{r.label}</div>
            <div style={{ fontSize: 12, color: activeReport === i ? "rgba(255,255,255,0.7)" : C.faint, marginTop: 2 }}>{r.desc}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center", background: C.surface, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: `1px solid ${C.border}`, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Month</div>
          <select style={selectStyle} value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Learner Cohort & Stream</div>
          <select style={selectStyle} value={dept} onChange={(e) => setDept(e.target.value)}>
            {COHORTS_FILTER.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>&nbsp;</div>
          <button
            onClick={() => setShowFormatModal(true)}
            disabled={isGenerating}
            style={{
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontSize: 14,
              fontFamily: FONT.body,
              fontWeight: 600,
              cursor: isGenerating ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⚡</span> Generate Report
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div style={{ background: C.surface, borderRadius: 12, padding: "24px", marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600 }}>
            Live Preview — {REPORT_TYPES[activeReport].label}
          </div>
          <span style={{ fontSize: 12, color: C.dark, background: C.bg, padding: "4px 12px", borderRadius: 20, border: `1px solid ${C.border}`, fontWeight: 600 }}>
            {month} 2026 · {dept} · Formats: Excel & CSV
          </span>
        </div>

        {/* Competency Report Preview */}
        {activeReport === 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Domain Scores ({dept})</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dynamicCompetencyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="domain" type="category" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
                  <Bar dataKey="score" fill={C.s1} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Summary Rubric Table</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Domain", "Score", "Evaluation"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dynamicCompetencyData.map((r) => (
                    <tr key={r.domain} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "8px 10px" }}>{r.domain}</td>
                      <td style={{ padding: "8px 10px", fontWeight: 600 }}>{r.score}%</td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ color: r.score >= 75 ? C.s1 : r.score >= 60 ? C.s2 : C.s4, fontWeight: 600, fontSize: 11 }}>
                          {r.score >= 75 ? "Benchmark Met" : r.score >= 60 ? "Average" : "Critical Gap"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enrollment Report Preview */}
        {activeReport === 1 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
              {[{ label: "Total Enrolled", value: "7,920" }, { label: `${month} Cohort`, value: "1,680" }, { label: "Growth Rate", value: "+12.5%" }].map((s) => (
                <div key={s.label} style={{ background: C.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT.display, color: C.dark, marginTop: 4 }}>{s.value}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={BASE_ENROLLMENT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" name="Enrolled Students" stroke={C.s1} strokeWidth={2.5} dot={{ r: 4, fill: C.s1 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Completion Report Preview */}
        {activeReport === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={BASE_COMPLETION_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({ name, value }) => `${name}: ${value}%`}>
                  {BASE_COMPLETION_PIE.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <table style={{ fontSize: 12, borderCollapse: "collapse", alignSelf: "center" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Learner Cohort", "Completion Rate", "Certified Students"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BASE_COMPLETION_PIE.map((r, i) => (
                  <tr key={r.name} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i] }} />
                      {r.name}
                    </td>
                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>{r.value}%</td>
                    <td style={{ padding: "8px 12px", color: C.muted }}>{r.students.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Gap Analysis Preview */}
        {activeReport === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={dynamicGapRadar} cx="50%" cy="50%" outerRadius={100}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12, fill: C.muted }} />
                <Radar name="Required" dataKey="required" stroke={C.s1} fill={C.s1} fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Actual" dataKey="actual" stroke={C.s4} fill={C.s4} fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ alignSelf: "center" }}>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Gap Summary ({dept})</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Domain", "Required", "Actual", "Deficit"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dynamicGapRadar.map((r) => {
                    const gap = r.required - r.actual;
                    return (
                      <tr key={r.domain} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "8px 10px" }}>{r.domain}</td>
                        <td style={{ padding: "8px 10px" }}>{r.required}%</td>
                        <td style={{ padding: "8px 10px" }}>{r.actual}%</td>
                        <td style={{ padding: "8px 10px", fontWeight: 600, color: gap > 15 ? C.s4 : gap > 0 ? C.s2 : C.s1 }}>
                          {gap > 0 ? `-${gap}%` : "Met"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent Reports Table with Real File Downloads */}
      <div style={{ background: C.surface, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", border: `1px solid ${C.border}` }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, fontFamily: FONT.display, fontSize: 15, fontWeight: 600 }}>
          Generated Executive Reports & Archive
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {["Report Name", "Type", "Focus", "Generated", "Format", "Size", "Action"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentReports.map((r, i) => (
              <tr
                key={r.id}
                style={{
                  borderBottom: i < recentReports.length - 1 ? `1px solid ${C.border}` : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF8F4")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: C.dark }}>{r.name}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: C.bg, color: C.muted, borderRadius: 6, padding: "3px 8px", fontSize: 12, fontWeight: 500 }}>
                    {r.type}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.muted }}>{r.department}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.faint }}>{r.date}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ ...formatIconStyle(r.format), borderRadius: 6, padding: "3px 8px", fontSize: 12, fontWeight: 600 }}>
                    {r.format}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.faint }}>{r.size}</td>
                <td style={{ padding: "12px 16px" }}>
                  <button
                    onClick={() => downloadReportFile(r)}
                    style={{
                      background: C.dark,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: FONT.body,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>📥</span> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate Report Format Selection Modal (Excel & CSV) */}
      {showFormatModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,35,24,0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowFormatModal(false)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 16,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0, color: C.dark }}>
                  Generate Report
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>
                  {REPORT_TYPES[activeReport].label} · {month} 2026 · {dept}
                </p>
              </div>
              <button
                onClick={() => setShowFormatModal(false)}
                style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ fontSize: 13, color: C.dark, fontWeight: 600, marginBottom: 16 }}>
                Select export format:
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {/* Excel Option */}
                <div
                  onClick={() => handleGenerateReport("Excel")}
                  style={{
                    border: `2px solid ${C.s1}`,
                    borderRadius: 12,
                    padding: "20px 16px",
                    cursor: "pointer",
                    background: "#F2FBF6",
                    textAlign: "center",
                    position: "relative",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(30,107,66,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: C.s1,
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 10,
                    }}
                  >
                    Recommended
                  </span>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📗</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.dark }}>Excel</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                    Microsoft Excel (.xlsx) spreadsheet
                  </div>
                </div>

                {/* CSV Option */}
                <div
                  onClick={() => handleGenerateReport("CSV")}
                  style={{
                    border: `2px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "20px 16px",
                    cursor: "pointer",
                    background: C.bg,
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.accent;
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(198,133,27,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.background = C.bg;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.dark }}>CSV</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                    Standard Comma Separated (.csv)
                  </div>
                </div>
              </div>

              <div style={{ background: "#F5F2EB", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.muted, display: "flex", gap: 8, alignItems: "center" }}>
                <span>💡</span>
                <span>Both formats extract all verified metrics and domain scores for {dept}.</span>
              </div>
            </div>

            <div style={{ padding: "12px 24px", background: C.bg, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowFormatModal(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontFamily: FONT.body,
                  color: C.muted,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
