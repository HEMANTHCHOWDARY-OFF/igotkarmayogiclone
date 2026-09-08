import { C, FONT } from "@/tokens";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const competencyOverTime = [
  { week: "Wk 1", overall: 58, assessment: 52, quiz: 60 },
  { week: "Wk 2", overall: 61, assessment: 56, quiz: 64 },
  { week: "Wk 3", overall: 63, assessment: 60, quiz: 67 },
  { week: "Wk 4", overall: 67, assessment: 64, quiz: 70 },
  { week: "Wk 5", overall: 70, assessment: 67, quiz: 74 },
  { week: "Wk 6", overall: 72, assessment: 70, quiz: 76 },
  { week: "Wk 7", overall: 74, assessment: 72, quiz: 79 },
  { week: "Wk 8", overall: 76, assessment: 75, quiz: 82 },
];

const domainScores = [
  { domain: "Digital", score: 32 },
  { domain: "Technical", score: 38 },
  { domain: "Policy", score: 56 },
  { domain: "Communication", score: 75 },
  { domain: "Ethics", score: 82 },
  { domain: "Leadership", score: 68 },
];

function domainColor(score: number) {
  if (score >= 80) return C.s1;
  if (score >= 60) return C.accent;
  return C.s4;
}

const weeklyHours = [
  { week: "Wk 1", hours: 2.5 },
  { week: "Wk 2", hours: 3.0 },
  { week: "Wk 3", hours: 2.0 },
  { week: "Wk 4", hours: 3.5 },
  { week: "Wk 5", hours: 4.0 },
  { week: "Wk 6", hours: 3.0 },
  { week: "Wk 7", hours: 3.5 },
  { week: "Wk 8", hours: 3.0 },
];

const activities = [
  { type: "Assessment", desc: "Competency Assessment — Full Battery", date: "Jun 5, 2026", score: "76/100", icon: "📋" },
  { type: "Course", desc: "Digital Governance Fundamentals — started", date: "Jun 4, 2026", score: "—", icon: "📚" },
  { type: "Quiz", desc: "Ethics & Governance Basics — Module 3 Quiz", date: "Jun 3, 2026", score: "88%", icon: "✏️" },
  { type: "Badge", desc: "Earned: Communication Achiever badge", date: "Jun 2, 2026", score: "—", icon: "🏅" },
  { type: "Course", desc: "Communication & Analytical Thinking — completed", date: "Jun 1, 2026", score: "100%", icon: "✅" },
  { type: "Quiz", desc: "Ethics & Governance Basics — Module 2 Quiz", date: "May 30, 2026", score: "92%", icon: "✏️" },
];

const insights = [
  {
    icon: "📈",
    title: "Steady Improvement",
    text: "Your overall score has improved by 18 points over 8 weeks — a pace that puts you on track to reach the target of 85 by week 14.",
  },
  {
    icon: "⏰",
    title: "Peak Study Time",
    text: "You study most effectively on Tuesdays and Thursdays between 7–9 PM. Your quiz scores on those days average 11% higher.",
  },
  {
    icon: "🎯",
    title: "Quiz Accuracy Rising",
    text: "Your quiz accuracy improved from 70% to 82% this month. Continuing at this rate, you can hit 90% by end of July.",
  },
  {
    icon: "⚡",
    title: "Focus Recommendation",
    text: "You haven't started Policy Analysis Framework yet. Completing it in the next 10 days keeps your Phase 2 schedule on track.",
  },
];

export default function Progress() {
  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, margin: 0, color: C.dark }}>
            Progress & Analytics
          </h2>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 14 }}>
            Track your competency growth and learning activity
          </p>
        </div>
        {/* Filter row */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.surface,
              fontFamily: FONT.body,
              fontSize: 13,
              color: C.dark,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option>Last 30 days</option>
            <option>Last 60 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
          <select
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.surface,
              fontFamily: FONT.body,
              fontSize: 13,
              color: C.dark,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option>All Domains</option>
            <option>Digital</option>
            <option>Technical</option>
            <option>Policy</option>
            <option>Leadership</option>
          </select>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1.5px solid ${C.accent}`,
              background: "transparent",
              color: C.accent,
              fontFamily: FONT.body,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            ⬇ Export
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          {
            label: "Overall Score",
            value: "76",
            unit: "/ 100",
            delta: "+18 from start",
            deltaPositive: true,
            sparkline: [58, 61, 63, 67, 70, 72, 74, 76],
          },
          {
            label: "Study Time",
            value: "24h 30m",
            unit: "",
            delta: "+6h vs last month",
            deltaPositive: true,
            sparkline: null,
          },
          {
            label: "Quiz Accuracy",
            value: "82%",
            unit: "",
            delta: "↑ Trend up",
            deltaPositive: true,
            sparkline: null,
          },
          {
            label: "Study Streak",
            value: "12 days",
            unit: "",
            delta: "🔥 Keep it up!",
            deltaPositive: true,
            sparkline: null,
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "20px 22px",
            }}
          >
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{kpi.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
              <span style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, color: C.dark }}>{kpi.value}</span>
              {kpi.unit && <span style={{ fontSize: 14, color: C.faint }}>{kpi.unit}</span>}
            </div>
            {kpi.sparkline && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 24, marginBottom: 4 }}>
                {kpi.sparkline.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${((v - 55) / 25) * 100}%`,
                      minHeight: 3,
                      background: C.accent,
                      borderRadius: 2,
                      opacity: 0.6 + (i / kpi.sparkline!.length) * 0.4,
                    }}
                  />
                ))}
              </div>
            )}
            <div style={{ fontSize: 12, color: kpi.deltaPositive ? C.s1 : C.s4 }}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      {/* Large area chart */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, marginBottom: 4, color: C.dark }}>
          Competency Score Over Time
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
          Weekly trend across all score categories
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={competencyOverTime} margin={{ top: 5, right: 20, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.s1} stopOpacity={0.2} />
                <stop offset="95%" stopColor={C.s1} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAssessment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.accent} stopOpacity={0.15} />
                <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorQuiz" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.s3} stopOpacity={0.15} />
                <stop offset="95%" stopColor={C.s3} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: C.muted, fontFamily: FONT.body }} />
            <YAxis domain={[45, 90]} tick={{ fontSize: 12, fill: C.muted, fontFamily: FONT.body }} />
            <Tooltip
              contentStyle={{ fontFamily: FONT.body, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13 }}
            />
            <Legend
              wrapperStyle={{ fontFamily: FONT.body, fontSize: 13, paddingTop: 12 }}
            />
            <Area
              type="monotone"
              dataKey="overall"
              name="Overall Score"
              stroke={C.s1}
              fill="url(#colorOverall)"
              strokeWidth={2}
              dot={{ r: 3, fill: C.s1 }}
            />
            <Area
              type="monotone"
              dataKey="assessment"
              name="Assessment Score"
              stroke={C.accent}
              fill="url(#colorAssessment)"
              strokeWidth={2}
              dot={{ r: 3, fill: C.accent }}
            />
            <Area
              type="monotone"
              dataKey="quiz"
              name="Quiz Score"
              stroke={C.s3}
              fill="url(#colorQuiz)"
              strokeWidth={2}
              dot={{ r: 3, fill: C.s3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two side-by-side charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Domain scores bar chart */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 4, color: C.dark }}>
            Domain Scores
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
            Current score per competency domain
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={domainScores} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="domain" tick={{ fontSize: 12, fill: C.muted, fontFamily: FONT.body }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: C.muted, fontFamily: FONT.body }} />
              <Tooltip
                formatter={(val: any) => [`${val}`, "Score"]}
                contentStyle={{ fontFamily: FONT.body, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13 }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {domainScores.map((entry) => (
                  <Cell key={entry.domain} fill={domainColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly study hours */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 4, color: C.dark }}>
            Weekly Study Hours
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
            Hours logged per week
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyHours} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: C.muted, fontFamily: FONT.body }} />
              <YAxis domain={[0, 6]} tick={{ fontSize: 12, fill: C.muted, fontFamily: FONT.body }} />
              <Tooltip
                formatter={(val: any) => [`${val}h`, "Study Time"]}
                contentStyle={{ fontFamily: FONT.body, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13 }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke={C.s3}
                strokeWidth={2.5}
                dot={{ r: 5, fill: C.s3, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed + Insights */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Activity Feed */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 16, color: C.dark }}>
            Activity Feed
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Activity", "Description", "Date", "Score"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "6px 8px",
                      color: C.faint,
                      fontWeight: 600,
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map((act, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 18 }}>{act.icon}</span>
                    <span style={{ marginLeft: 6, color: C.dark, fontWeight: 600 }}>{act.type}</span>
                  </td>
                  <td style={{ padding: "10px 8px", color: C.muted, lineHeight: 1.4 }}>{act.desc}</td>
                  <td style={{ padding: "10px 8px", color: C.faint, whiteSpace: "nowrap" }}>{act.date}</td>
                  <td style={{ padding: "10px 8px", fontWeight: 700, color: act.score === "—" ? C.faint : C.s1 }}>
                    {act.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Improvement Insights */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 4, color: C.dark }}>
            Improvement Insights
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>AI-generated learning pattern analysis</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {insights.map((ins) => (
              <div
                key={ins.title}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 14,
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{ins.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.dark, marginBottom: 3 }}>{ins.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{ins.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
