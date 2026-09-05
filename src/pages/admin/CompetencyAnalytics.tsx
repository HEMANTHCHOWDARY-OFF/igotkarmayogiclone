import { useState } from "react";
import { C, FONT } from "@/tokens";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

const radarData = [
  { domain: "Ethics", IAS: 88, IRS: 80, IPS: 75 },
  { domain: "Governance", IAS: 82, IRS: 76, IPS: 78 },
  { domain: "Policy", IAS: 79, IRS: 72, IPS: 70 },
  { domain: "Legal", IAS: 74, IRS: 68, IPS: 72 },
  { domain: "Finance", IAS: 70, IRS: 85, IPS: 60 },
  { domain: "Digital", IAS: 55, IRS: 52, IPS: 48 },
];

const trendData = [
  { week: "W1", overall: 64, assessment: 60, quiz: 68 },
  { week: "W2", overall: 66, assessment: 63, quiz: 70 },
  { week: "W3", overall: 68, assessment: 65, quiz: 72 },
  { week: "W4", overall: 70, assessment: 67, quiz: 74 },
  { week: "W5", overall: 69, assessment: 66, quiz: 73 },
  { week: "W6", overall: 71, assessment: 69, quiz: 75 },
  { week: "W7", overall: 72, assessment: 70, quiz: 76 },
  { week: "W8", overall: 74, assessment: 72, quiz: 78 },
];

const domainDeptData = [
  { domain: "Ethics", IAS: 88, IRS: 80, IPS: 75 },
  { domain: "Governance", IAS: 82, IRS: 76, IPS: 78 },
  { domain: "Policy", IAS: 79, IRS: 72, IPS: 70 },
  { domain: "Legal", IAS: 74, IRS: 68, IPS: 72 },
  { domain: "Finance", IAS: 70, IRS: 85, IPS: 60 },
  { domain: "Digital", IAS: 55, IRS: 52, IPS: 48 },
];

const gapMatrix = [
  { domain: "Ethics",      IAS: 88, IPS: 75, IRS: 80, IFS: 77, Others: 70 },
  { domain: "Governance",  IAS: 82, IPS: 78, IRS: 76, IFS: 74, Others: 68 },
  { domain: "Policy",      IAS: 79, IPS: 70, IRS: 72, IFS: 68, Others: 65 },
  { domain: "Legal",       IAS: 74, IPS: 72, IRS: 68, IFS: 66, Others: 60 },
  { domain: "Finance",     IAS: 70, IPS: 60, IRS: 85, IFS: 62, Others: 58 },
  { domain: "Digital",     IAS: 55, IPS: 48, IRS: 52, IFS: 50, Others: 44 },
];

const DEPTS_MATRIX = ["IAS", "IPS", "IRS", "IFS", "Others"];

const topPerformers = [
  { name: "Meena Pillai", service: "IAS", score: 96, dept: "DOPT" },
  { name: "Anita Verma", service: "IRS", score: 94, dept: "Ministry of Revenue" },
  { name: "Priya Sharma", service: "IAS", score: 92, dept: "Ministry of Finance" },
  { name: "Ravi Patel", service: "IRS", score: 91, dept: "CBIC" },
  { name: "Sunita Joshi", service: "IFS", score: 89, dept: "MEA" },
];

const atRisk = [
  { name: "Vikram Singh", service: "IPS", score: 38, dept: "Ministry of Home" },
  { name: "Suresh Nair", service: "IFS", score: 44, dept: "MEA" },
  { name: "Arjun Mehta", service: "IAS", score: 46, dept: "Planning Commission" },
  { name: "Rohan Das", service: "IPS", score: 50, dept: "MHA" },
  { name: "Kavita Rao", service: "IRS", score: 52, dept: "CBDT" },
];

function scoreColor(v: number) {
  if (v >= 80) return { bg: "#E6F4EC", color: C.s1 };
  if (v >= 65) return { bg: "#FEF5E7", color: C.s2 };
  return { bg: "#FDEEE9", color: C.s4 };
}

export default function CompetencyAnalytics() {
  const [dept, setDept] = useState("All");
  const [dateRange, setDateRange] = useState("Last 3 Months");

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

  const kpis = [
    { label: "Avg Overall Score", value: "72", unit: "/100", color: C.s1 },
    { label: "Highest Domain", value: "Ethics", unit: "84", color: C.s2 },
    { label: "Lowest Domain", value: "Digital", unit: "48", color: C.s4 },
    { label: "Improvement Rate", value: "12%", unit: "vs last quarter", color: C.s3 },
  ];

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0 }}>Competency Analytics</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>Domain-wise performance across departments</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select style={selectStyle} value={dept} onChange={(e) => setDept(e.target.value)}>
            {["All", "IAS", "IPS", "IRS", "IFS"].map((d) => <option key={d}>{d}</option>)}
          </select>
          <select style={selectStyle} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            {["Last Month", "Last 3 Months", "Last 6 Months", "This Year"].map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: C.surface, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${k.color}` }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: FONT.display, color: C.dark }}>{k.value}</div>
            <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{k.unit}</div>
          </div>
        ))}
      </div>

      {/* Full-width Radar */}
      <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Department Competency Comparison (IAS vs IRS vs IPS)</div>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={120}>
            <PolarGrid stroke={C.border} />
            <PolarAngleAxis dataKey="domain" tick={{ fontSize: 13, fill: C.muted }} />
            <Radar name="IAS" dataKey="IAS" stroke={C.s1} fill={C.s1} fillOpacity={0.15} strokeWidth={2} />
            <Radar name="IRS" dataKey="IRS" stroke={C.s2} fill={C.s2} fillOpacity={0.15} strokeWidth={2} />
            <Radar name="IPS" dataKey="IPS" stroke={C.s3} fill={C.s3} fillOpacity={0.15} strokeWidth={2} />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Two Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Competency Score Trends</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 85]} tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="overall" name="Overall" stroke={C.s1} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="assessment" name="Assessment" stroke={C.s2} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="quiz" name="Quiz" stroke={C.s3} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Domain Scores by Department</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={domainDeptData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="domain" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="IAS" fill={C.s1} radius={[3, 3, 0, 0]} />
              <Bar dataKey="IRS" fill={C.s2} radius={[3, 3, 0, 0]} />
              <Bar dataKey="IPS" fill={C.s3} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gap Analysis Table */}
      <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Gap Analysis Summary</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: C.muted }}>Domain</th>
              {DEPTS_MATRIX.map((d) => (
                <th key={d} style={{ textAlign: "center", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: C.muted }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gapMatrix.map((row, i) => (
              <tr key={row.domain} style={{ borderBottom: i < gapMatrix.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500 }}>{row.domain}</td>
                {DEPTS_MATRIX.map((d) => {
                  const val = row[d as keyof typeof row] as number;
                  const { bg, color } = scoreColor(val);
                  return (
                    <td key={d} style={{ padding: "10px 14px", textAlign: "center" }}>
                      <span style={{ background: bg, color, borderRadius: 6, padding: "3px 10px", fontSize: 13, fontWeight: 600 }}>{val}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: 12, color: C.muted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: C.s1, borderRadius: 2 }} /> 80+ Good</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: C.s2, borderRadius: 2 }} /> 65–79 Average</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: C.s4, borderRadius: 2 }} /> Below 65 Needs Attention</span>
        </div>
      </div>

      {/* Top Performers + At Risk */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 14, color: C.s1 }}>Top Performers</div>
          {topPerformers.map((p, i) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < topPerformers.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.s1, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.faint }}>{p.service} · {p.dept}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.s1 }}>{p.score}%</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 14, color: C.s4 }}>Needs Attention</div>
          {atRisk.map((p, i) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < atRisk.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FDEEE9", color: C.s4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.faint }}>{p.service} · {p.dept}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.s4 }}>{p.score}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
