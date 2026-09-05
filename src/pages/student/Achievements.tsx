import { C, FONT } from "@/tokens";

const earnedBadges = [
  { id: 1, label: "First Assessment", icon: "🎯", date: "Mar 12, 2026" },
  { id: 2, label: "7-Day Streak", icon: "🔥", date: "Apr 3, 2026" },
  { id: 3, label: "Digital Pioneer", icon: "💻", date: "May 20, 2026" },
];

const lockedBadges = [
  { id: 4, label: "Course Master", icon: "📚", progress: 60, hint: "Complete 5 courses" },
  { id: 5, label: "Speed Learner", icon: "⚡", progress: 30, hint: "Finish a course in 1 day" },
  { id: 6, label: "Perfect Score", icon: "💯", progress: 80, hint: "Score 100 on any assessment" },
  { id: 7, label: "Night Owl", icon: "🦉", progress: 10, hint: "Study after 9 PM" },
  { id: 8, label: "Team Player", icon: "🤝", progress: 45, hint: "Join 3 group sessions" },
  { id: 9, label: "Policy Pro", icon: "📜", progress: 20, hint: "Complete Policy domain" },
  { id: 10, label: "Data Guru", icon: "📊", progress: 55, hint: "Complete Data Analytics module" },
  { id: 11, label: "Leader", icon: "🏅", progress: 5, hint: "Top 10% in department" },
  { id: 12, label: "Marathon", icon: "🏃", progress: 38, hint: "30-day learning streak" },
];

const milestones = [
  { label: "Account Created", date: "Mar 1, 2026", done: true },
  { label: "First Assessment", date: "Mar 12, 2026", done: true },
  { label: "First Course Complete", date: "Apr 28, 2026", done: true },
  { label: "First Certificate", date: "Pending", done: false },
];

function generateHeatmap() {
  return Array.from({ length: 30 }, (_, i) => {
    const r = Math.random();
    return r > 0.6 ? 3 : r > 0.35 ? 2 : r > 0.15 ? 1 : 0;
  });
}

const heatmapData = generateHeatmap();

const heatColor = (level: number) => {
  if (level === 3) return C.dark;
  if (level === 2) return C.s1;
  if (level === 1) return "#A8D5B5";
  return C.border;
};

export default function Achievements() {
  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, fontFamily: FONT.display, margin: 0 }}>
            Achievements
          </h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 14 }}>3 of 12 badges earned</p>
        </div>
        <div style={{
          background: C.dark, color: "#fff", borderRadius: 20, padding: "8px 20px",
          fontSize: 14, fontWeight: 600
        }}>
          🏆 Level 2 — Developing
        </div>
      </div>

      {/* Earned Badges */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: FONT.display }}>
          Earned Badges
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {earnedBadges.map(b => (
            <div key={b.id} style={{
              background: C.dark, borderRadius: 12, padding: "24px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10
            }}>
              <div style={{ fontSize: 40 }}>{b.icon}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "center", fontFamily: FONT.display }}>
                {b.label}
              </div>
              <div style={{
                background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px",
                color: "#D5F0DE", fontSize: 12
              }}>
                Earned {b.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Locked Badges */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: FONT.display }}>
          Locked Badges
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {lockedBadges.map(b => (
            <div key={b.id} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: "18px 16px", display: "flex", flexDirection: "column", gap: 10
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 28, opacity: 0.35 }}>{b.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.muted, fontWeight: 600, fontSize: 13 }}>{b.label}</div>
                  <div style={{ color: C.faint, fontSize: 11, marginTop: 2 }}>🔒 {b.hint}</div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.faint }}>Progress</span>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{b.progress}%</span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 4 }}>
                  <div style={{
                    height: "100%", borderRadius: 4, background: C.faint, width: `${b.progress}%`
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Streaks */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: FONT.display }}>
          Learning Streaks
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px",
            display: "flex", alignItems: "center", gap: 16
          }}>
            <div style={{ fontSize: 36 }}>🔥</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.s1, fontFamily: FONT.display }}>12</div>
              <div style={{ color: C.muted, fontSize: 13 }}>Current Streak (days)</div>
            </div>
          </div>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px",
            display: "flex", alignItems: "center", gap: 16
          }}>
            <div style={{ fontSize: 36 }}>⭐</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, fontFamily: FONT.display }}>18</div>
              <div style={{ color: C.muted, fontSize: 13 }}>Best Streak (days)</div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px"
        }}>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Last 30 days activity</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {heatmapData.map((level, i) => (
              <div key={i} style={{
                width: 18, height: 18, borderRadius: 4,
                background: heatColor(level)
              }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <span style={{ fontSize: 11, color: C.faint }}>Less</span>
            {[0, 1, 2, 3].map(l => (
              <div key={l} style={{ width: 14, height: 14, borderRadius: 3, background: heatColor(l) }} />
            ))}
            <span style={{ fontSize: 11, color: C.faint }}>More</span>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 20, fontFamily: FONT.display }}>
          Milestones
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              {/* Timeline line + dot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: m.done ? C.s1 : C.border,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: m.done ? "#fff" : C.faint, fontWeight: 700,
                  flexShrink: 0
                }}>
                  {m.done ? "✓" : "○"}
                </div>
                {i < milestones.length - 1 && (
                  <div style={{ width: 2, height: 36, background: m.done ? C.s1 : C.border }} />
                )}
              </div>
              <div style={{ paddingTop: 6, paddingBottom: 24 }}>
                <div style={{ fontWeight: 600, color: m.done ? C.dark : C.faint, fontSize: 14 }}>{m.label}</div>
                <div style={{ color: C.faint, fontSize: 12, marginTop: 2 }}>{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
