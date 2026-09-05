import { C, FONT } from "@/tokens";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const enrollmentData = [
  { month: "Apr", enrolled: 980, completed: 820 },
  { month: "May", enrolled: 1120, completed: 960 },
  { month: "Jun", enrolled: 1340, completed: 1100 },
  { month: "Jul", enrolled: 1280, completed: 1080 },
  { month: "Aug", enrolled: 1520, completed: 1320 },
  { month: "Sep", enrolled: 1680, completed: 1480 },
];

const deptDistribution = [
  { name: "IAS", value: 30 },
  { name: "IPS", value: 20 },
  { name: "IRS", value: 25 },
  { name: "IFS", value: 15 },
  { name: "Others", value: 10 },
];

const deptColors = [C.s1, C.s2, C.s3, C.s4, "#8C3B17"];

const completionByDept = [
  { dept: "IAS", rate: 96 },
  { dept: "IPS", rate: 91 },
  { dept: "IRS", rate: 94 },
  { dept: "IFS", rate: 88 },
  { dept: "Others", rate: 82 },
];

const domainScores = [
  { domain: "Ethics", score: 84 },
  { domain: "Governance", score: 78 },
  { domain: "Policy", score: 72 },
  { domain: "Legal", score: 68 },
  { domain: "Finance", score: 65 },
  { domain: "Digital", score: 48 },
];

const recentActivity = [
  { id: 1, action: "Student Enrolled", name: "Priya Sharma", detail: "Foundation Course in Governance", time: "2 min ago", type: "enroll" },
  { id: 2, action: "Assessment Completed", name: "Rajesh Kumar", detail: "Ethics & Integrity — Score: 88%", time: "8 min ago", type: "assess" },
  { id: 3, action: "Certificate Issued", name: "Anita Verma", detail: "Digital Governance Fundamentals", time: "15 min ago", type: "cert" },
  { id: 4, action: "Course Enrolled", name: "Suresh Nair", detail: "Public Finance Management", time: "22 min ago", type: "enroll" },
  { id: 5, action: "Assessment Completed", name: "Meena Pillai", detail: "Policy Analysis — Score: 92%", time: "31 min ago", type: "assess" },
  { id: 6, action: "Student Enrolled", name: "Vikram Singh", detail: "Leadership & Management", time: "45 min ago", type: "enroll" },
  { id: 7, action: "Certificate Issued", name: "Deepa Reddy", detail: "Ethics & Integrity", time: "1 hr ago", type: "cert" },
  { id: 8, action: "Assessment Completed", name: "Arjun Mehta", detail: "Digital Skills — Score: 74%", time: "1.5 hr ago", type: "assess" },
  { id: 9, action: "Course Enrolled", name: "Sunita Joshi", detail: "Constitutional Law", time: "2 hr ago", type: "enroll" },
  { id: 10, action: "Certificate Issued", name: "Ravi Patel", detail: "Policy Analysis", time: "2.5 hr ago", type: "cert" },
];

const kpis = [
  { label: "Total Students", value: "12,840", sub: "+234 this week", color: C.s1 },
  { label: "Active Learners", value: "8,420", sub: "65.6% of total", color: C.s2 },
  { label: "Avg Completion Rate", value: "94%", sub: "+2.1% vs last month", color: C.s3 },
  { label: "Assessments This Week", value: "1,240", sub: "across all domains", color: C.s4 },
  { label: "Certificates Issued", value: "3,420", sub: "total lifetime", color: "#8C3B17" },
];

const actionTypeColor: Record<string, string> = {
  enroll: C.s1,
  assess: C.s2,
  cert: C.s3,
};

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0, color: C.dark }}>Admin Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6 }}>
          <span style={{ fontSize: 15, color: C.muted }}>Welcome back, Dr. Anand Kumar</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.faint, display: "inline-block" }} />
          <span style={{ fontSize: 14, color: C.faint }}>{today}</span>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 28 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: C.surface, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ height: 4, background: k.color }} />
            <div style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: FONT.display, color: C.dark }}>{k.value}</div>
              <div style={{ fontSize: 12, color: C.faint, marginTop: 4 }}>{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16, color: C.dark }}>Monthly Enrollment & Completions</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="gradEnr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.s1} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.s1} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.s2} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.s2} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: FONT.body }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="enrolled" name="Enrolled" stroke={C.s1} fill="url(#gradEnr)" strokeWidth={2} />
              <Area type="monotone" dataKey="completed" name="Completed" stroke={C.s2} fill="url(#gradComp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16, color: C.dark }}>Department Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={deptDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {deptDistribution.map((_, i) => (
                  <Cell key={i} fill={deptColors[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16, color: C.dark }}>Completion Rate by Department</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={completionByDept}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="dept" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Bar dataKey="rate" name="Rate %" fill={C.s1} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16, color: C.dark }}>Domain Competency Scores (Avg)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={domainScores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis dataKey="domain" type="category" tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Bar dataKey="score" name="Score" fill={C.s2} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16, color: C.dark }}>Recent Activity</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Action", "Student", "Detail", "Time"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: i < recentActivity.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: actionTypeColor[row.type], flexShrink: 0 }} />
                    {row.action}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 500 }}>{row.name}</td>
                <td style={{ padding: "10px 12px", fontSize: 13, color: C.muted }}>{row.detail}</td>
                <td style={{ padding: "10px 12px", fontSize: 12, color: C.faint }}>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
