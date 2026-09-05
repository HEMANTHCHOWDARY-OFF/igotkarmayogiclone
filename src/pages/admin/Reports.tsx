import { useState } from "react";
import { C, FONT } from "@/tokens";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const REPORT_TYPES = [
  { label: "Competency Report", icon: "📊", desc: "Domain scores by dept" },
  { label: "Enrollment Report", icon: "📈", desc: "Enrollment trends" },
  { label: "Completion Report", icon: "✅", desc: "Completion by dept" },
  { label: "Gap Analysis Report", icon: "🔍", desc: "Competency gaps" },
];

const MONTHS = ["April", "May", "June", "July", "August", "September"];
const FORMATS = ["PDF", "Excel", "CSV"];
const DEPTS_FILTER = ["All Departments", "IAS", "IPS", "IRS", "IFS"];

// Chart data
const competencyBarData = [
  { domain: "Ethics", score: 82 },
  { domain: "Governance", score: 78 },
  { domain: "Policy", score: 72 },
  { domain: "Legal", score: 68 },
  { domain: "Finance", score: 65 },
  { domain: "Digital", score: 48 },
];

const enrollmentLineData = [
  { month: "Apr", count: 980 },
  { month: "May", count: 1120 },
  { month: "Jun", count: 1340 },
  { month: "Jul", count: 1280 },
  { month: "Aug", count: 1520 },
  { month: "Sep", count: 1680 },
];

const completionPieData = [
  { name: "IAS", value: 96 },
  { name: "IPS", value: 91 },
  { name: "IRS", value: 94 },
  { name: "IFS", value: 88 },
  { name: "Others", value: 82 },
];

const gapRadarData = [
  { domain: "Ethics", required: 85, actual: 72 },
  { domain: "Governance", required: 80, actual: 68 },
  { domain: "Policy", required: 80, actual: 65 },
  { domain: "Legal", required: 75, actual: 58 },
  { domain: "Finance", required: 70, actual: 55 },
  { domain: "Digital", required: 75, actual: 48 },
];

const PIE_COLORS = [C.s1, C.s3, C.s2, C.s4, "#8C3B17"];

const RECENT_REPORTS = [
  { name: "Competency Report — August 2026", type: "Competency", date: "Sep 1, 2026", format: "PDF", size: "2.4 MB" },
  { name: "Enrollment Report — Q2 2026", type: "Enrollment", date: "Aug 15, 2026", format: "Excel", size: "1.1 MB" },
  { name: "Gap Analysis — IAS Batch 2020", type: "Gap Analysis", date: "Aug 10, 2026", format: "PDF", size: "3.2 MB" },
  { name: "Completion Report — July 2026", type: "Completion", date: "Aug 5, 2026", format: "CSV", size: "0.8 MB" },
  { name: "Competency Report — Q1 2026", type: "Competency", date: "Apr 30, 2026", format: "PDF", size: "2.9 MB" },
];

const formatIconStyle = (fmt: string): { bg: string; color: string } => {
  if (fmt === "PDF") return { bg: "#FDEEE9", color: C.s4 };
  if (fmt === "Excel") return { bg: "#E6F4EC", color: C.s1 };
  return { bg: "#FEF5E7", color: C.s2 };
};

export default function Reports() {
  const [activeReport, setActiveReport] = useState(0);
  const [month, setMonth] = useState("September");
  const [dept, setDept] = useState("All Departments");
  const [format, setFormat] = useState("PDF");

  const lastUpdated = new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const selectStyle = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: FONT.body,
    color: C.dark,
    outline: "none",
  };

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0 }}>Reports</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.faint }}>Last updated: {lastUpdated}</p>
        </div>
        <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontFamily: FONT.body, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Generate Report
        </button>
      </div>

      {/* Report Type Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
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
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center", background: C.surface, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Month</div>
          <select style={selectStyle} value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Department</div>
          <select style={selectStyle} value={dept} onChange={(e) => setDept(e.target.value)}>
            {DEPTS_FILTER.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Format</div>
          <div style={{ display: "flex", gap: 6 }}>
            {FORMATS.map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                style={{
                  background: format === f ? C.dark : "transparent",
                  color: format === f ? "#fff" : C.muted,
                  border: `1px solid ${format === f ? C.dark : C.border}`,
                  borderRadius: 6,
                  padding: "7px 14px",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: FONT.body,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>&nbsp;</div>
          <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 14, fontFamily: FONT.body, fontWeight: 600, cursor: "pointer" }}>
            Generate
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div style={{ background: C.surface, borderRadius: 12, padding: "24px", marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600 }}>
            Preview — {REPORT_TYPES[activeReport].label}
          </div>
          <span style={{ fontSize: 12, color: C.faint, background: C.bg, padding: "4px 10px", borderRadius: 20 }}>
            {month} 2026 · {dept}
          </span>
        </div>

        {/* Competency Report Preview */}
        {activeReport === 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Average Domain Scores</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={competencyBarData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="domain" type="category" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
                  <Bar dataKey="score" fill={C.s1} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Summary Table</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Domain", "Avg Score", "Status"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competencyBarData.map((r) => (
                    <tr key={r.domain} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "8px 10px" }}>{r.domain}</td>
                      <td style={{ padding: "8px 10px", fontWeight: 600 }}>{r.score}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ color: r.score >= 75 ? C.s1 : r.score >= 60 ? C.s2 : C.s4, fontWeight: 600, fontSize: 11 }}>
                          {r.score >= 75 ? "Good" : r.score >= 60 ? "Average" : "Gap"}
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
              {[{ label: "Total Enrolled", value: "7,920" }, { label: "This Month", value: "1,680" }, { label: "Growth Rate", value: "+12.5%" }].map((s) => (
                <div key={s.label} style={{ background: C.bg, borderRadius: 10, padding: "14px 18px" }}>
                  <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT.display, color: C.dark, marginTop: 4 }}>{s.value}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={enrollmentLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" name="Enrolled" stroke={C.s1} strokeWidth={2.5} dot={{ r: 4, fill: C.s1 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Completion Report Preview */}
        {activeReport === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={completionPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({ name, value }) => `${name}: ${value}%`}>
                  {completionPieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <table style={{ fontSize: 12, borderCollapse: "collapse", alignSelf: "center" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Department", "Rate", "Students"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {completionPieData.map((r, i) => (
                  <tr key={r.name} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i] }} />
                      {r.name}
                    </td>
                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>{r.value}%</td>
                    <td style={{ padding: "8px 12px", color: C.muted }}>{[3860, 2560, 3210, 1924, 1286][i].toLocaleString()}</td>
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
              <RadarChart data={gapRadarData} cx="50%" cy="50%" outerRadius={100}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12, fill: C.muted }} />
                <Radar name="Required" dataKey="required" stroke={C.s1} fill={C.s1} fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Actual" dataKey="actual" stroke={C.s4} fill={C.s4} fillOpacity={0.2} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ alignSelf: "center" }}>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Gap Summary</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Domain", "Required", "Actual", "Gap"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gapRadarData.map((r) => (
                    <tr key={r.domain} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "8px 10px" }}>{r.domain}</td>
                      <td style={{ padding: "8px 10px" }}>{r.required}</td>
                      <td style={{ padding: "8px 10px" }}>{r.actual}</td>
                      <td style={{ padding: "8px 10px", fontWeight: 600, color: r.required - r.actual > 15 ? C.s4 : C.s2 }}>
                        -{r.required - r.actual}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent Reports */}
      <div style={{ background: C.surface, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, fontFamily: FONT.display, fontSize: 15, fontWeight: 600 }}>Recent Reports</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {["Report Name", "Type", "Generated", "Format", "Size", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_REPORTS.map((r, i) => (
              <tr key={r.name} style={{ borderBottom: i < RECENT_REPORTS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: C.bg, color: C.muted, borderRadius: 6, padding: "3px 8px", fontSize: 12 }}>{r.type}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.faint }}>{r.date}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ ...formatIconStyle(r.format), borderRadius: 6, padding: "3px 8px", fontSize: 12, fontWeight: 600 }}>{r.format}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.faint }}>{r.size}</td>
                <td style={{ padding: "12px 16px" }}>
                  <button style={{ background: C.dark, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: FONT.body }}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
