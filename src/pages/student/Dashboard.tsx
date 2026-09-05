import { useNavigate, Link } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { C, FONT } from "@/tokens";

const chartData = [
  { week: "W1", score: 58 },
  { week: "W2", score: 62 },
  { week: "W3", score: 65 },
  { week: "W4", score: 68 },
  { week: "W5", score: 71 },
  { week: "W6", score: 76 },
];

const courses = [
  {
    id: 1,
    title: "Foundations of Digital Governance",
    progress: 68,
    module: "Module 4 of 6",
    href: "/student/learning-path",
  },
  {
    id: 2,
    title: "Ethics & Integrity in Public Service",
    progress: 45,
    module: "Module 3 of 8",
    href: "/student/learning-path",
  },
  {
    id: 3,
    title: "Leadership & Team Management",
    progress: 20,
    module: "Module 1 of 5",
    href: "/student/learning-path",
  },
];

const recommendations = [
  {
    id: 1,
    title: "Advanced Policy Formulation",
    reason: "Bridges your gap in policy domain",
    priority: "High",
  },
  {
    id: 2,
    title: "Data-Driven Decision Making",
    reason: "Complements your digital skills",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Public Finance Management",
    reason: "Recommended for your role level",
    priority: "Low",
  },
];

const deadlines = [
  {
    id: 1,
    title: "Digital Governance Assessment",
    date: "Sep 08, 2026",
    status: "Due Soon",
    statusColor: C.s4,
  },
  {
    id: 2,
    title: "Ethics Module Quiz",
    date: "Sep 12, 2026",
    status: "Upcoming",
    statusColor: C.s2,
  },
  {
    id: 3,
    title: "Leadership Capstone Submission",
    date: "Sep 20, 2026",
    status: "On Track",
    statusColor: C.s1,
  },
];

const activity = [
  {
    id: 1,
    icon: "📘",
    text: 'Completed "Introduction to e-Governance" lesson',
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: "✅",
    text: "Passed Ethics Module 2 quiz with 84%",
    time: "Yesterday, 3:45 PM",
  },
  {
    id: 3,
    icon: "🤖",
    text: "AI Mentor session: Leadership styles deep-dive",
    time: "Yesterday, 11:00 AM",
  },
  {
    id: 4,
    icon: "📄",
    text: 'Downloaded certificate: "Digital Literacy Basics"',
    time: "2 days ago",
  },
  {
    id: 5,
    icon: "🎯",
    text: "Updated learning path based on assessment results",
    time: "3 days ago",
  },
];

const priorityColor: Record<string, string> = {
  High: C.s4,
  Medium: C.s2,
  Low: C.s1,
};

const card: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: "20px 22px",
};

export default function Dashboard() {
  const navigate = useNavigate();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Overall Competency Score",
      value: "72/100",
      sub: "+4 pts this week",
      stripe: C.s2,
      icon: "↑",
    },
    {
      label: "Courses In Progress",
      value: "3",
      sub: "2 due this week",
      stripe: C.s1,
      icon: null,
    },
    {
      label: "Assessment Score",
      value: "78%",
      sub: "Last taken: 3 days ago",
      stripe: C.s3,
      icon: null,
    },
    {
      label: "Certificates Earned",
      value: "2",
      sub: "1 pending",
      stripe: C.s4,
      icon: null,
    },
  ];

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: FONT.display,
              fontSize: 26,
              fontWeight: 700,
              margin: 0,
              color: C.dark,
            }}
          >
            Good morning, Priya 👋
          </h1>
          <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 14 }}>
            Here&apos;s your learning summary for today.
          </p>
        </div>
        <div
          style={{
            textAlign: "right",
            fontSize: 13,
            color: C.faint,
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontWeight: 600, color: C.muted }}>{dateStr}</div>
          <div>Karmayogi Shiksha AI</div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              ...card,
              padding: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ height: 4, background: s.stripe }} />
            <div style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: C.faint, marginBottom: 6 }}>
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.dark,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: s.stripe,
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {s.icon && <span style={{ fontWeight: 700 }}>{s.icon}</span>}
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column main */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Competency Progress chart */}
          <div style={card}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Competency Progress
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart
                data={chartData}
                margin={{ top: 4, right: 12, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={C.accent}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={C.accent}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: C.faint }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: C.faint }}
                  axisLine={false}
                  tickLine={false}
                  domain={[50, 85]}
                />
                <Tooltip
                  contentStyle={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    fontFamily: FONT.body,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={C.accent}
                  strokeWidth={2.5}
                  fill="url(#scoreGrad)"
                  dot={{ r: 4, fill: C.accent, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Continue Learning */}
          <div style={card}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Continue Learning
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {courses.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: C.bg,
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                        {c.title}
                      </div>
                      <div
                        style={{ fontSize: 11, color: C.faint, marginTop: 2 }}
                      >
                        {c.module}
                      </div>
                    </div>
                    <Link
                      to={c.href}
                      style={{
                        fontSize: 12,
                        color: C.accent,
                        fontWeight: 600,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        marginLeft: 12,
                      }}
                    >
                      Continue →
                    </Link>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: C.border,
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${c.progress}%`,
                        background: C.s1,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.faint,
                      marginTop: 4,
                      textAlign: "right",
                    }}
                  >
                    {c.progress}% complete
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* AI Recommendations */}
          <div style={card}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              🤖 AI Recommendations
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recommendations.map((r) => (
                <div
                  key={r.id}
                  style={{
                    borderLeft: `3px solid ${priorityColor[r.priority]}`,
                    paddingLeft: 10,
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                    {r.title}
                  </div>
                  <div
                    style={{ fontSize: 11, color: C.faint, marginTop: 2 }}
                  >
                    {r.reason}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      color: priorityColor[r.priority],
                      background: priorityColor[r.priority] + "18",
                      padding: "1px 7px",
                      borderRadius: 99,
                    }}
                  >
                    {r.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div style={card}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              Upcoming Deadlines
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {deadlines.map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    paddingBottom: 10,
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                    {d.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 11, color: C.faint }}>
                      {d.date}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: d.statusColor,
                        background: d.statusColor + "18",
                        padding: "1px 7px",
                        borderRadius: 99,
                      }}
                    >
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={card}>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Quick Actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => navigate("/student/assessment")}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  background: C.dark,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: FONT.body,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                📝 Take Assessment
              </button>
              <button
                onClick={() => navigate("/student/ai-mentor")}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  background: C.accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: FONT.body,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                🤖 Chat with AI Mentor
              </button>
              <button
                onClick={() => navigate("/student/learning-path")}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  background: "transparent",
                  color: C.dark,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontFamily: FONT.body,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                🗺️ View Learning Path
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={card}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Recent Activity
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {activity.map((a, i) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                paddingBottom: 14,
                marginBottom: i < activity.length - 1 ? 14 : 0,
                borderBottom:
                  i < activity.length - 1
                    ? `1px solid ${C.border}`
                    : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: C.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {a.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.dark }}>{a.text}</div>
                <div style={{ fontSize: 11, color: C.faint, marginTop: 3 }}>
                  {a.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
