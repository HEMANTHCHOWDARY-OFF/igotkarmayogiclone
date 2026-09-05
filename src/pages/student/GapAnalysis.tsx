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
} from "recharts";
import { C, FONT } from "@/tokens";

const radarData = [
  { domain: "Digital", current: 32, target: 80 },
  { domain: "Technical", current: 38, target: 75 },
  { domain: "Policy", current: 56, target: 80 },
  { domain: "Communication", current: 75, target: 85 },
  { domain: "Ethics", current: 82, target: 90 },
  { domain: "Leadership", current: 68, target: 85 },
];

const gapBarData = [
  { domain: "Digital", gap: 48 },
  { domain: "Technical", gap: 37 },
  { domain: "Policy", gap: 24 },
  { domain: "Communication", gap: 10 },
  { domain: "Ethics", gap: 8 },
  { domain: "Leadership", gap: 17 },
];

function gapColor(gap: number) {
  if (gap > 30) return C.s4;
  if (gap >= 15) return C.accent;
  return C.s1;
}

const tableRows = [
  { domain: "Digital Competency", current: 32, target: 80, gap: 48, severity: "Critical" },
  { domain: "Technical Knowledge", current: 38, target: 75, gap: 37, severity: "Critical" },
  { domain: "Policy Analysis", current: 56, target: 80, gap: 24, severity: "Moderate" },
  { domain: "Communication", current: 75, target: 85, gap: 10, severity: "Low" },
  { domain: "Ethics & Integrity", current: 82, target: 90, gap: 8, severity: "Low" },
  { domain: "Leadership", current: 68, target: 85, gap: 17, severity: "Moderate" },
];

const severityStyle = (sev: string): React.CSSProperties => {
  if (sev === "Critical") return { background: "#FDECEA", color: C.s4, border: `1px solid ${C.s4}` };
  if (sev === "Moderate") return { background: "#FEF3E2", color: C.accent, border: `1px solid ${C.accent}` };
  return { background: "#E6F4EC", color: C.s1, border: `1px solid ${C.s1}` };
};

const priorityOrder = [
  { rank: 1, area: "Digital Competency", action: "Start Digital Governance Fundamentals course", weeks: 3 },
  { rank: 2, area: "Technical Knowledge", action: "Complete Technical Policy module on iGOT", weeks: 3 },
  { rank: 3, area: "Policy Analysis", action: "Enroll in Policy Analysis Framework", weeks: 2 },
  { rank: 4, area: "Leadership", action: "Leadership Essentials workshop series", weeks: 2 },
];

const courseRecs = [
  { title: "Digital Governance Fundamentals", source: "iGOT", duration: "8h", gap: "Digital Competency" },
  { title: "e-Governance & Digital India", source: "Internal", duration: "6h", gap: "Digital Competency" },
  { title: "Policy Analysis Framework", source: "iGOT", duration: "10h", gap: "Policy Analysis" },
  { title: "Technical Skills for Civil Servants", source: "iGOT", duration: "7h", gap: "Technical Knowledge" },
];

export default function GapAnalysis() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, margin: 0, color: C.dark }}>
            Competency Gap Analysis
          </h2>
          <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 14 }}>
            Based on your assessment of June 5, 2026
          </p>
        </div>
        <button
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            border: `1.5px solid ${C.accent}`,
            background: "transparent",
            color: C.accent,
            fontFamily: FONT.body,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reassess →
        </button>
      </div>

      {/* Overview stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Overall Gap Score", value: "28 pts", note: "Below target average" },
          { label: "Critical Gaps", value: "2", note: "Digital & Technical" },
          { label: "Priority Areas", value: "Digital, Technical", note: "Focus these first" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, color: C.dark }}>{card.value}</div>
            <div style={{ fontSize: 12, color: C.faint, marginTop: 4 }}>{card.note}</div>
          </div>
        ))}
      </div>

      {/* Two-column main */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Radar chart */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 4, color: C.dark }}>
              Competency Radar
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Current vs Target scores</div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: C.accent, opacity: 0.8 }} />
                <span style={{ color: C.muted }}>Current Score</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: C.dark, opacity: 0.6 }} />
                <span style={{ color: C.muted }}>Target Score</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="domain" tick={{ fill: C.muted, fontSize: 12, fontFamily: FONT.body }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Target" dataKey="target" stroke={C.dark} fill={C.dark} fillOpacity={0.1} strokeWidth={1.5} />
                <Radar name="Current" dataKey="current" stroke={C.accent} fill={C.accent} fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart: gap size */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 4, color: C.dark }}>
              Gap by Domain
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Points needed to reach target</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gapBarData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" domain={[0, 60]} tick={{ fontSize: 12, fill: C.muted, fontFamily: FONT.body }} />
                <YAxis type="category" dataKey="domain" tick={{ fontSize: 13, fill: C.dark, fontFamily: FONT.body }} width={80} />
                <Tooltip
                  formatter={(val: any) => [`${val} pts gap`, "Gap"]}
                  contentStyle={{ fontFamily: FONT.body, border: `1px solid ${C.border}`, borderRadius: 8 }}
                />
                <Bar dataKey="gap" radius={[0, 4, 4, 0]}>
                  {gapBarData.map((entry) => (
                    <Cell key={entry.domain} fill={gapColor(entry.gap)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Gap Severity table */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 16, color: C.dark }}>
              Gap Severity
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Domain", "Now", "Target", "Gap", "Severity"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "6px 8px",
                        color: C.faint,
                        fontWeight: 600,
                        borderBottom: `1px solid ${C.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.domain} style={{ background: i % 2 === 0 ? "transparent" : "#F5F1E8" }}>
                    <td style={{ padding: "8px 8px", color: C.dark, fontWeight: 500 }}>{row.domain}</td>
                    <td style={{ padding: "8px 8px", color: C.muted }}>{row.current}</td>
                    <td style={{ padding: "8px 8px", color: C.muted }}>{row.target}</td>
                    <td style={{ padding: "8px 8px", fontWeight: 700, color: C.dark }}>{row.gap}</td>
                    <td style={{ padding: "8px 8px" }}>
                      <span
                        style={{
                          ...severityStyle(row.severity),
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
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

          {/* AI Priority Order */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, marginBottom: 4, color: C.dark }}>
              AI Priority Order
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>What to work on first</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {priorityOrder.map((item) => (
                <div
                  key={item.rank}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: "12px",
                    background: C.bg,
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: C.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {item.rank}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.dark, marginBottom: 2 }}>{item.area}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{item.action}</div>
                    <div style={{ fontSize: 12, color: C.faint }}>~{item.weeks} weeks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 28,
        }}
      >
        <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, marginBottom: 4, color: C.dark }}>
          AI Recommendations
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
          Courses curated to close your identified gaps
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {courseRecs.map((c) => (
            <div
              key={c.title}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.source === "iGOT" ? C.s3 : C.s1,
                  background: c.source === "iGOT" ? "#E0F4F2" : "#E6F4EC",
                  padding: "2px 8px",
                  borderRadius: 20,
                  width: "fit-content",
                }}
              >
                {c.source}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.dark, lineHeight: 1.4 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{c.duration} · {c.gap}</div>
              <button
                style={{
                  marginTop: 8,
                  padding: "8px 0",
                  background: C.accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 7,
                  fontFamily: FONT.body,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Enroll →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => navigate("/student/learning-path")}
          style={{
            padding: "13px 36px",
            background: C.accent,
            color: "#fff",
            border: "none",
            borderRadius: 9,
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Start Learning Path →
        </button>
      </div>
    </div>
  );
}
