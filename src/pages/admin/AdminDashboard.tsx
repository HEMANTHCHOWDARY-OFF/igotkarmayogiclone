import { useState } from "react";
import { useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface ActivityItem {
  id: number;
  action: string;
  name: string;
  detail: string;
  time: string;
  type: "enroll" | "assess" | "cert";
  track: string;
  institution: string;
  score?: number;
  certId?: string;
}

const ALL_ACTIVITIES: ActivityItem[] = [
  { id: 1, action: "Student Enrolled", name: "Aarav Sharma", detail: "Data-Driven Decision Making & Analytics", time: "2 min ago", type: "enroll", track: "University / College", institution: "IIT Delhi (B.Tech Data Science)" },
  { id: 2, action: "Assessment Completed", name: "Ananya Iyer", detail: "Applied Statistics & Sampling — Score: 94%", time: "8 min ago", type: "assess", track: "University / College", institution: "Delhi University (M.Sc Statistics)", score: 94 },
  { id: 3, action: "Certificate Issued", name: "Rohan Verma", detail: "Constitutional Law & Administration", time: "15 min ago", type: "cert", track: "Civil Services Aspirant", institution: "UPSC Comprehensive Prep (Jamia Millia)", certId: "CERT-GOV-2026-8941" },
  { id: 4, action: "Course Enrolled", name: "Priya Sharma", detail: "Public Finance Management", time: "22 min ago", type: "enroll", track: "In-Service Civil Servant", institution: "Ministry of Finance (IAS Cadre)" },
  { id: 5, action: "Assessment Completed", name: "Sneha Kulkarni", detail: "Python for Data Science — Score: 96%", time: "31 min ago", type: "assess", track: "Tech & Professional", institution: "Pune University (AI & ML Lab)", score: 96 },
  { id: 6, action: "Student Enrolled", name: "Vikram Singh", detail: "Leadership & Change Management", time: "45 min ago", type: "enroll", track: "In-Service Civil Servant", institution: "Ministry of Home (IPS Cadre)" },
  { id: 7, action: "Certificate Issued", name: "Deepa Reddy", detail: "Ethics & Integrity in Public Service", time: "1 hr ago", type: "cert", track: "Civil Services Aspirant", institution: "State PSC Academy (Hyderabad)", certId: "CERT-ETH-2026-3392" },
  { id: 8, action: "Assessment Completed", name: "Tanmay Deshmukh", detail: "Digital Governance & India Stack — Score: 88%", time: "1.5 hr ago", type: "assess", track: "University / College", institution: "Anna University (B.Tech IT)", score: 88 },
  { id: 9, action: "Course Enrolled", name: "Kavita Rao", detail: "Advanced Sampling Theory & Official Statistics", time: "2 hr ago", type: "enroll", track: "In-Service Civil Servant", institution: "MoSPI (ISS Cadre)" },
  { id: 10, action: "Certificate Issued", name: "Meera Nair", detail: "Policy Analysis & Formulation", time: "2.5 hr ago", type: "cert", track: "Tech & Professional", institution: "Public Policy Research Lab (Bengaluru)", certId: "CERT-POL-2026-1184" },
  { id: 11, action: "Assessment Completed", name: "Rajesh Kumar", detail: "Ethics & Integrity — Score: 88%", time: "3 hr ago", type: "assess", track: "In-Service Civil Servant", institution: "MHA (IPS Cadre)", score: 88 },
  { id: 12, action: "Student Enrolled", name: "Karthik Raja", detail: "GIS & Spatial Governance", time: "4 hr ago", type: "enroll", track: "University / College", institution: "BHU (Varanasi - Geospatial Sciences)" },
];

const PERIOD_METRICS: Record<string, { total: string; active: string; comp: string; assess: string; certs: string; multiplier: number }> = {
  "Last 30 Days": { total: "12,840", active: "8,420", comp: "93.4%", assess: "3,240", certs: "3,420", multiplier: 1 },
  "Q3 2026":      { total: "14,150", active: "9,680", comp: "92.1%", assess: "5,890", certs: "4,120", multiplier: 1.15 },
  "Year-to-Date": { total: "18,400", active: "12,300", comp: "91.8%", assess: "14,420", certs: "8,950", multiplier: 1.4 },
};

const BASE_ENROLLMENT = [
  { month: "Apr", enrolled: 980, completed: 820 },
  { month: "May", enrolled: 1120, completed: 960 },
  { month: "Jun", enrolled: 1340, completed: 1100 },
  { month: "Jul", enrolled: 1280, completed: 1080 },
  { month: "Aug", enrolled: 1520, completed: 1320 },
  { month: "Sep", enrolled: 1680, completed: 1480 },
];

// Learner Track Distribution across all learning students
const TRACK_DISTRIBUTION = [
  { name: "University & College Students", value: 38 },
  { name: "Competitive & Civil Aspirants", value: 26 },
  { name: "In-Service Civil Servants", value: 18 },
  { name: "Data Science & AI Scholars", value: 12 },
  { name: "Working Professionals & Upskillers", value: 6 },
];

const TRACK_COLORS = [C.s1, C.accent, C.s2, C.s3, "#8C3B17"];

const COMPLETION_BY_TRACK = [
  { track: "University Students", rate: 92 },
  { track: "Civil Aspirants", rate: 95 },
  { track: "Civil Servants", rate: 96 },
  { track: "Tech Scholars", rate: 89 },
  { track: "Professionals", rate: 84 },
];

const DOMAIN_SCORES = [
  { domain: "Applied Statistics", score: 82 },
  { domain: "Data Science & AI", score: 79 },
  { domain: "Ethics & Integrity", score: 85 },
  { domain: "Public Governance", score: 76 },
  { domain: "Policy Analysis", score: 72 },
  { domain: "Public Finance", score: 68 },
];

const ACTION_TYPE_COLOR: Record<string, string> = {
  enroll: C.s1,
  assess: C.s2,
  cert: C.s3,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Last 30 Days");
  const [trackFilter, setTrackFilter] = useState("All Learner Tracks");
  const [activityType, setActivityType] = useState<"all" | "enroll" | "assess" | "cert">("all");
  const [activitySearch, setActivitySearch] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentMetrics = PERIOD_METRICS[period];
  const mult = currentMetrics.multiplier;

  // Dynamically scaled enrollment chart based on period multiplier
  const dynamicEnrollment = BASE_ENROLLMENT.map((d) => ({
    month: d.month,
    enrolled: Math.round(d.enrolled * mult),
    completed: Math.round(d.completed * mult),
  }));

  // Filtered recent activities
  const filteredActivities = ALL_ACTIVITIES.filter((item) => {
    const matchType = activityType === "all" || item.type === activityType;
    const matchTrack =
      trackFilter === "All Learner Tracks" ||
      item.track.toLowerCase().includes(trackFilter.toLowerCase()) ||
      trackFilter.toLowerCase().includes(item.track.toLowerCase());
    const matchSearch =
      activitySearch.trim() === "" ||
      item.name.toLowerCase().includes(activitySearch.toLowerCase()) ||
      item.detail.toLowerCase().includes(activitySearch.toLowerCase()) ||
      item.institution.toLowerCase().includes(activitySearch.toLowerCase());
    return matchType && matchTrack && matchSearch;
  });

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
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ background: C.dark, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
              Universal Learning & Administration
            </span>
            <span style={{ fontSize: 12, color: C.s1, fontWeight: 600, background: "#E6F4EC", padding: "2px 8px", borderRadius: 12 }}>
              ● Live Sync Active
            </span>
          </div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0, color: C.dark }}>
            Admin Dashboard
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, color: C.muted }}>Welcome back, Dr. Anand Kumar</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.faint }} />
            <span style={{ fontSize: 13, color: C.faint }}>{today}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.faint }} />
            <span style={{ fontSize: 12, color: C.muted }}>
              Monitoring <strong>12,840+ Students & Learners</strong> nationwide
            </span>
          </div>
        </div>

        {/* Track & Timeframe Filters */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <select style={selectStyle} value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)}>
            {[
              "All Learner Tracks",
              "University / College",
              "Civil Services Aspirant",
              "In-Service Civil Servant",
              "Tech & Professional",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select style={selectStyle} value={period} onChange={(e) => setPeriod(e.target.value)}>
            {["Last 30 Days", "Q3 2026", "Year-to-Date"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Action Shortcuts Banner */}
      <div
        style={{
          background: C.surface,
          borderRadius: 12,
          padding: "12px 20px",
          marginBottom: 24,
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
          ⚡ Platform Management Shortcuts:
        </span>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/admin/students")}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>+ Add Student / Learner</span>
          </button>
          <button
            onClick={() => navigate("/admin/courses")}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>+ Create Course</span>
          </button>
          <button
            onClick={() => navigate("/admin/assessments")}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>✨ Synthesize MCQs</span>
          </button>
          <button
            onClick={() => navigate("/admin/reports")}
            style={{
              background: C.accent,
              border: "none",
              borderRadius: 8,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>📊 Detailed Analytics</span>
          </button>
        </div>
      </div>

      {/* Dynamic KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Enrolled Students", value: currentMetrics.total, sub: trackFilter === "All Learner Tracks" ? "Higher Ed, Aspirants & Civil Servants" : `${trackFilter} Cohort`, color: C.s1 },
          { label: "Active Daily Learners", value: currentMetrics.active, sub: "65.6% active engagement rate", color: C.s2 },
          { label: "Avg Course Completion", value: currentMetrics.comp, sub: "+2.1% improvement vs target", color: C.s3 },
          { label: "Diagnostic Assessments", value: currentMetrics.assess, sub: "evaluated across academic & FrAC domains", color: C.s4 },
          { label: "Certificates Awarded", value: currentMetrics.certs, sub: "lifetime blockchain-verified credentials", color: "#8C3B17" },
        ].map((k) => (
          <div key={k.label} style={{ background: C.surface, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, color: C.dark }}>
              Monthly Student Enrollments & Completions ({period})
            </div>
            <span style={{ fontSize: 11, color: C.muted, background: C.bg, padding: "3px 8px", borderRadius: 6 }}>
              Target: 90%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dynamicEnrollment}>
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
              <Area type="monotone" dataKey="enrolled" name="Enrolled Students" stroke={C.s1} fill="url(#gradEnr)" strokeWidth={2} />
              <Area type="monotone" dataKey="completed" name="Completed Modules" stroke={C.s2} fill="url(#gradComp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16, color: C.dark }}>
            Learner Stream Distribution
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={TRACK_DISTRIBUTION} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${value}%`}>
                {TRACK_DISTRIBUTION.map((_, i) => (
                  <Cell key={i} fill={TRACK_COLORS[i % TRACK_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16, color: C.dark }}>
            Completion Rate by Learner Stream
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={COMPLETION_BY_TRACK}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="track" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Bar dataKey="rate" name="Completion %" fill={C.s1} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, marginBottom: 16, color: C.dark }}>
            Domain Competency Scores (Academic & Governance)
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DOMAIN_SCORES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis dataKey="domain" type="category" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} width={115} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Bar dataKey="score" name="Avg Proficiency" fill={C.s2} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Recent Activity Table */}
      <div style={{ background: C.surface, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.dark }}>Recent Multi-Stream Learner Activity</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Real-time audit log across University Colleges, Competitive Aspirants & Public Administration</div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Filter Pills */}
            <div style={{ display: "flex", gap: 4, background: C.bg, padding: 3, borderRadius: 8, border: `1px solid ${C.border}` }}>
              {[
                { id: "all", label: "All" },
                { id: "enroll", label: "Enrollments" },
                { id: "assess", label: "Assessments" },
                { id: "cert", label: "Certificates" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivityType(tab.id as any)}
                  style={{
                    background: activityType === tab.id ? C.dark : "transparent",
                    color: activityType === tab.id ? "#fff" : C.muted,
                    border: "none",
                    borderRadius: 6,
                    padding: "5px 10px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT.body,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              placeholder="Search student or institution..."
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                fontFamily: FONT.body,
                outline: "none",
                width: 210,
              }}
            />
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
              {["Action", "Student / Scholar", "Learner Stream & Institution", "Learning Event", "Timestamp", "Action"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredActivities.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: C.muted, fontSize: 13 }}>
                  No student activity found matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredActivities.map((row, i) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: i < filteredActivities.length - 1 ? `1px solid ${C.border}` : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF8F4")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACTION_TYPE_COLOR[row.type], flexShrink: 0 }} />
                      {row.action}
                    </span>
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, fontWeight: 600, color: C.dark }}>{row.name}</td>
                  <td style={{ padding: "12px 12px", fontSize: 12, color: C.muted }}>
                    <span style={{ fontWeight: 600, color: C.dark }}>{row.track}</span> · {row.institution}
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: C.muted }}>{row.detail}</td>
                  <td style={{ padding: "12px 12px", fontSize: 12, color: C.faint }}>{row.time}</td>
                  <td style={{ padding: "12px 12px" }}>
                    <button
                      onClick={() => setSelectedActivity(row)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 12,
                        color: C.dark,
                        cursor: "pointer",
                        fontFamily: FONT.body,
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && (
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
          onClick={() => setSelectedActivity(null)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 520,
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: ACTION_TYPE_COLOR[selectedActivity.type] }} />
                <h2 style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, margin: 0, color: C.dark }}>
                  {selectedActivity.action} Record
                </h2>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.dark, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>
                  {selectedActivity.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>{selectedActivity.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    {selectedActivity.track} · {selectedActivity.institution}
                  </div>
                </div>
              </div>

              <div style={{ background: C.bg, borderRadius: 10, padding: "16px", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase" }}>Learner Track</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginTop: 2 }}>{selectedActivity.track}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase" }}>Recorded Time</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginTop: 2 }}>{selectedActivity.time}</div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase" }}>Event Summary</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.dark, marginTop: 2 }}>{selectedActivity.detail}</div>
                  </div>
                  {selectedActivity.score && (
                    <div>
                      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase" }}>Demonstrated Score</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.s1, marginTop: 2 }}>{selectedActivity.score}% (Proficient)</div>
                    </div>
                  )}
                  {selectedActivity.certId && (
                    <div style={{ gridColumn: "span 2" }}>
                      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase" }}>Credential Verification ID</div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", color: C.accent, marginTop: 2 }}>{selectedActivity.certId}</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    setSelectedActivity(null);
                    navigate("/admin/students");
                  }}
                  style={{
                    flex: 1,
                    background: C.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT.body,
                  }}
                >
                  View Learner Dossier
                </button>
                <button
                  onClick={() => setSelectedActivity(null)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 18px",
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
