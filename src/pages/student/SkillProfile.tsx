import { C, FONT } from "@/tokens";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Link } from "react-router";

const domains = [
  { key: "Digital", label: "Digital Literacy", icon: "💻", score: 72, target: 85, level: "Proficient", userAvg: 72, deptAvg: 65, natAvg: 60 },
  { key: "Policy", label: "Policy & Governance", icon: "📜", score: 58, target: 80, level: "Developing", userAvg: 58, deptAvg: 62, natAvg: 58 },
  { key: "Service", label: "Service Delivery", icon: "🤝", score: 81, target: 90, level: "Proficient", userAvg: 81, deptAvg: 70, natAvg: 68 },
  { key: "Finance", label: "Public Finance", icon: "💰", score: 45, target: 75, level: "Beginner", userAvg: 45, deptAvg: 55, natAvg: 52 },
  { key: "Ethics", label: "Ethics & Integrity", icon: "⚖️", score: 88, target: 95, level: "Expert", userAvg: 88, deptAvg: 80, natAvg: 76 },
  { key: "Leadership", label: "Leadership", icon: "🏛️", score: 63, target: 80, level: "Developing", userAvg: 63, deptAvg: 67, natAvg: 64 },
];

const radarData = domains.map(d => ({ subject: d.label, score: d.score, target: d.target }));

const levelColor = (level: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    Beginner: { bg: "#FFE8E2", color: C.s4 },
    Developing: { bg: "#FFF3DC", color: C.accent },
    Proficient: { bg: "#EBF5F0", color: C.s1 },
    Expert: { bg: "#E0F0FF", color: C.s3 },
  };
  return map[level] || { bg: C.border, color: C.muted };
};

export default function SkillProfile() {
  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body }}>
      {/* Header */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
        padding: "20px 24px", marginBottom: 28,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%", background: C.dark,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 22, flexShrink: 0
          }}>RK</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: C.dark, fontFamily: FONT.display }}>
              Rajesh Kumar
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>IAS (2019) · Ministry of Rural Development</div>
            <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>Batch 2019 · Dept: Rural Infrastructure</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: C.faint, marginBottom: 10 }}>
            Last Updated: June 5, 2026
          </div>
          <Link
            to="/student/assessment"
            style={{
              padding: "9px 18px", background: C.accent, color: "#fff",
              borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
              display: "inline-block"
            }}
          >
            Retake Assessment →
          </Link>
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
        padding: "24px 32px", marginBottom: 28
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 4, fontFamily: FONT.display }}>
          Competency Overview
        </h2>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
          Your competency scores across 6 core domains
        </p>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: C.muted, fontFamily: FONT.body }}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke={C.border}
                fill={C.border}
                fillOpacity={0.15}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke={C.s1}
                fill={C.s1}
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 4 }}>
          {[
            { color: C.s1, label: "Your Score" },
            { color: C.border, label: "Target" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
              <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Competency Cards */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: FONT.display }}>
          Domain Breakdown
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {domains.map(d => {
            const lc = levelColor(d.level);
            const pct = Math.round((d.score / d.target) * 100);
            return (
              <div key={d.key} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 18px 16px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 20 }}>{d.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: C.dark }}>{d.label}</span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 12,
                    background: lc.bg, color: lc.color
                  }}>{d.level}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: FONT.display }}>
                    {d.score}
                  </span>
                  <span style={{ fontSize: 13, color: C.faint, alignSelf: "flex-end", paddingBottom: 4 }}>
                    / {d.target} target
                  </span>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ height: 8, background: C.border, borderRadius: 4 }}>
                    <div style={{
                      height: "100%", borderRadius: 4, background: lc.color, width: `${pct}%`
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>{pct}% of target</div>
                </div>

                <Link
                  to="/student/courses"
                  style={{
                    fontSize: 12, color: C.accent, fontWeight: 600, textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 4
                  }}
                >
                  View Courses →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benchmark Comparison */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: FONT.display }}>
          National Benchmark Comparison
        </h2>
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px"
        }}>
          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { color: C.s1, label: "You" },
              { color: C.accent, label: "Dept. Average" },
              { color: C.s3, label: "National Average" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {domains.map(d => (
              <div key={d.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: C.dark, fontWeight: 500 }}>
                    {d.icon} {d.label}
                  </span>
                  <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
                    <span style={{ color: C.s1, fontWeight: 600 }}>You: {d.userAvg}</span>
                    <span style={{ color: C.accent }}>Dept: {d.deptAvg}</span>
                    <span style={{ color: C.s3 }}>Nat: {d.natAvg}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { val: d.userAvg, color: C.s1 },
                    { val: d.deptAvg, color: C.accent },
                    { val: d.natAvg, color: C.s3 },
                  ].map(({ val, color }, i) => (
                    <div key={i} style={{ height: 6, background: C.border, borderRadius: 3 }}>
                      <div style={{
                        height: "100%", borderRadius: 3, background: color, width: `${val}%`,
                        opacity: 0.85
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
