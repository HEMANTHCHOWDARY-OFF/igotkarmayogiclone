import { useNavigate } from "react-router";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { C, FONT } from "@/tokens";

const phases = [
  { id: 1, name: "Foundation", weeks: "Weeks 1–3", status: "COMPLETED" },
  { id: 2, name: "Core Skills", weeks: "Weeks 4–7", status: "IN_PROGRESS" },
  { id: 3, name: "Advanced Application", weeks: "Weeks 8–10", status: "LOCKED" },
  { id: 4, name: "Certification", weeks: "Weeks 11–12", status: "LOCKED" },
];

const phaseCourses = {
  1: [
    { title: "Ethics & Governance Basics", source: "Core", duration: "6h", competency: "Ethics", status: "Completed", progress: 100 },
    { title: "Communication for Civil Services", source: "Internal", duration: "4h", competency: "Communication", status: "Completed", progress: 100 },
  ],
  2: [
    { title: "Digital Governance Fundamentals", source: "Core", duration: "8h", competency: "Digital", status: "In Progress", progress: 65 },
    { title: "Policy Analysis Framework", source: "Core", duration: "10h", competency: "Policy", status: "Not Started", progress: 0 },
    { title: "Leadership Essentials", source: "Internal", duration: "6h", competency: "Leadership", status: "In Progress", progress: 30 },
  ],
  3: [
    { title: "Advanced Digital Administration", source: "Core", duration: "12h", competency: "Digital", status: "Locked", progress: 0 },
    { title: "Data Analytics for Policy", source: "Core", duration: "12h", competency: "Policy", status: "Locked", progress: 0 },
  ],
  4: [
    { title: "Core Competency Certification", source: "Core", duration: "4h", competency: "All Domains", status: "Locked", progress: 0 },
  ],
};

const pieData = [
  { name: "Completed", value: 2, color: C.s1 },
  { name: "In Progress", value: 2, color: C.accent },
  { name: "Locked", value: 4, color: C.border },
];

function phaseColors(status: string) {
  if (status === "COMPLETED") return { bg: "#E6F4EC", border: C.s1, text: C.s1, badge: { bg: C.s1, color: "#fff" } };
  if (status === "IN_PROGRESS") return { bg: "#FEF3E2", border: C.accent, text: C.accent, badge: { bg: C.accent, color: "#fff" } };
  return { bg: C.surface, border: C.border, text: C.faint, badge: { bg: C.border, color: C.muted } };
}

function statusLabel(status: string) {
  if (status === "COMPLETED") return "Completed";
  if (status === "IN_PROGRESS") return "In Progress";
  return "Locked";
}

function courseActionLabel(status: string, progress: number) {
  if (status === "Completed") return null;
  if (status === "Locked") return null;
  if (progress > 0) return "Continue →";
  return "Start →";
}

function sourceTag(source: string) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: source === "Core" ? C.s3 : C.s1,
        background: source === "Core" ? "#E0F4F2" : "#E6F4EC",
        padding: "2px 7px",
        borderRadius: 20,
      }}
    >
      {source}
    </span>
  );
}

export default function LearningPath() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, margin: 0, color: C.dark }}>
          Your AI-Generated Learning Path
        </h2>
        <p style={{ margin: "6px 0 16px", color: C.muted, fontSize: 14 }}>
          Personalized based on your gap analysis
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { icon: "📅", label: "12 Weeks" },
            { icon: "📚", label: "8 Courses" },
            { icon: "🏅", label: "3 Certifications" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 14,
                fontWeight: 600,
                color: C.dark,
              }}
            >
              <span>{s.icon}</span>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Phase stepper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "18px 24px",
          marginBottom: 28,
          gap: 0,
        }}
      >
        {phases.map((phase, idx) => {
          const col = phaseColors(phase.status);
          return (
            <div key={phase.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: phase.status === "COMPLETED" ? C.s1 : phase.status === "IN_PROGRESS" ? C.accent : C.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {phase.status === "COMPLETED" ? "✓" : phase.status === "LOCKED" ? "🔒" : phase.id}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: col.text }}>{phase.name}</div>
                  <div style={{ fontSize: 11, color: C.faint }}>{phase.weeks}</div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: col.badge.bg,
                      color: col.badge.color,
                      padding: "1px 7px",
                      borderRadius: 20,
                      marginTop: 2,
                      display: "inline-block",
                    }}
                  >
                    {statusLabel(phase.status)}
                  </span>
                </div>
              </div>
              {idx < phases.length - 1 && (
                <div
                  style={{
                    height: 2,
                    flex: "0 0 32px",
                    background: idx < 1 ? C.s1 : C.border,
                    margin: "0 4px",
                    borderRadius: 2,
                    alignSelf: "flex-start",
                    marginTop: 19,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main + sidebar layout */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Roadmap timeline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          {phases.map((phase) => {
            const col = phaseColors(phase.status);
            const courses = phaseCourses[phase.id as keyof typeof phaseCourses];
            const locked = phase.status === "LOCKED";
            return (
              <div
                key={phase.id}
                style={{
                  background: col.bg,
                  border: `1.5px solid ${col.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  opacity: locked ? 0.7 : 1,
                }}
              >
                {/* Phase header */}
                <div
                  style={{
                    padding: "14px 20px",
                    borderBottom: `1px solid ${col.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: locked ? C.border : col.border,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: locked ? C.muted : "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {phase.status === "COMPLETED" ? "✓" : locked ? "🔒" : phase.id}
                  </div>
                  <div>
                    <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 16, color: locked ? C.muted : C.dark }}>
                      Phase {phase.id}: {phase.name}
                    </span>
                    <span style={{ marginLeft: 12, fontSize: 12, color: C.faint }}>{phase.weeks}</span>
                  </div>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      fontWeight: 700,
                      background: col.badge.bg,
                      color: col.badge.color,
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {statusLabel(phase.status)}
                  </span>
                </div>

                {/* Courses */}
                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {courses.map((course) => {
                    const actionLabel = courseActionLabel(course.status, course.progress);
                    return (
                      <div
                        key={course.title}
                        style={{
                          background: C.surface,
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: "14px 18px",
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        {/* Icon */}
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: locked ? C.border : "#E6F4EC",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            flexShrink: 0,
                          }}
                        >
                          {course.status === "Locked" ? "🔒" : course.status === "Completed" ? "✅" : "📖"}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{course.title}</span>
                            {sourceTag(course.source)}
                          </div>
                          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>
                            {course.duration} · {course.competency}
                          </div>
                          {!locked && course.progress > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div
                                style={{
                                  flex: 1,
                                  height: 5,
                                  background: C.border,
                                  borderRadius: 3,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${course.progress}%`,
                                    height: "100%",
                                    background: course.progress === 100 ? C.s1 : C.accent,
                                    borderRadius: 3,
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: 12, color: C.muted, flexShrink: 0 }}>{course.progress}%</span>
                            </div>
                          )}
                        </div>

                        {/* Action */}
                        <div style={{ flexShrink: 0 }}>
                          {course.status === "Completed" && (
                            <span style={{ fontSize: 12, color: C.s1, fontWeight: 600 }}>✓ Done</span>
                          )}
                          {actionLabel && (
                            <button
                              style={{
                                padding: "8px 16px",
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
                              {actionLabel}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right sidebar */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            position: "sticky",
            top: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Progress donut */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 12 }}>
              Your Progress
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={pieData} innerRadius={32} outerRadius={52} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} courses`, name]}
                  contentStyle={{ fontFamily: FONT.body, fontSize: 12, border: `1px solid ${C.border}`, borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {pieData.map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                  <span style={{ color: C.muted }}>{d.name}</span>
                  <span style={{ marginLeft: "auto", fontWeight: 700, color: C.dark }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Mentor tip */}
          <div
            style={{
              background: "#E8F3ED",
              border: `1px solid ${C.s1}`,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: C.dark,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                AI
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: C.dark }}>AI Mentor Tip</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.6 }}>
              Focus on Digital Governance this week. Even 45 minutes daily can close your gap in 3 weeks!
            </p>
          </div>

          {/* Download */}
          <button
            style={{
              padding: "11px 0",
              background: "transparent",
              border: `1.5px solid ${C.accent}`,
              borderRadius: 8,
              color: C.accent,
              fontFamily: FONT.body,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              width: "100%",
            }}
          >
            ⬇ Download Roadmap PDF
          </button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
        <button
          onClick={() => navigate("/student/courses")}
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
          Explore Available Courses →
        </button>
      </div>
    </div>
  );
}
