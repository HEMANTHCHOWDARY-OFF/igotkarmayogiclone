import { useState } from "react";
import { useParams, Link } from "react-router";
import { C, FONT } from "@/tokens";

const modules = [
  {
    id: 1, title: "Introduction to Data Governance", lessons: [
      { id: 1, title: "What is Data-Driven Governance?", done: true },
      { id: 2, title: "Key Datasets in Indian Government", done: true },
      { id: 3, title: "Reading Statistical Reports", done: false },
    ]
  },
  {
    id: 2, title: "Data Analysis Fundamentals", lessons: [
      { id: 4, title: "Basic Statistics for Policy Makers", done: false },
      { id: 5, title: "Working with Spreadsheets", done: false },
      { id: 6, title: "Data Visualization Principles", done: false },
      { id: 7, title: "Case Study: PMGSY Dashboard", done: false },
    ]
  },
  {
    id: 3, title: "Applying Data in Your Department", lessons: [
      { id: 8, title: "Identifying Data Sources", done: false },
      { id: 9, title: "Building a Department Dashboard", done: false },
      { id: 10, title: "Ethics of Data Use in Government", done: false },
    ]
  },
  {
    id: 4, title: "Communicating Insights", lessons: [
      { id: 11, title: "Writing Data-Backed Briefs", done: false },
      { id: 12, title: "Presentation Skills for Data", done: false },
      { id: 13, title: "Final Project & Assessment", done: false },
    ]
  },
];

const allLessons = modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleTitle: m.title })));

export default function LearningInterface() {
  const { id } = useParams();
  const [activeLesson, setActiveLesson] = useState(3);
  const [openModules, setOpenModules] = useState<number[]>([1, 2]);
  const [notes, setNotes] = useState("");
  const [showAI, setShowAI] = useState(false);

  const currentLesson = allLessons.find(l => l.id === activeLesson) || allLessons[0];
  const currentIdx = allLessons.findIndex(l => l.id === activeLesson);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
  const totalDone = allLessons.filter(l => l.done).length;
  const progressPct = Math.round((totalDone / allLessons.length) * 100);

  const toggleModule = (mid: number) => {
    setOpenModules(prev => prev.includes(mid) ? prev.filter(x => x !== mid) : [...prev, mid]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: C.bg, fontFamily: FONT.body, position: "relative" }}>
      {/* Top Bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 16
      }}>
        <Link to="/student/courses/1" style={{ color: C.muted, textDecoration: "none", fontSize: 13 }}>
          ← Courses
        </Link>
        <span style={{ color: C.border }}>›</span>
        <span style={{ fontSize: 13, color: C.dark, fontWeight: 500, flex: 1 }}>Data-Driven Governance</span>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 140, height: 6, background: C.border, borderRadius: 3 }}>
            <div style={{ height: "100%", borderRadius: 3, background: C.s1, width: `${progressPct}%` }} />
          </div>
          <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>{progressPct}% complete</span>
        </div>

        <button
          onClick={() => setShowAI(!showAI)}
          style={{
            padding: "7px 16px", background: C.accent, color: "#fff",
            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: FONT.body, display: "flex", alignItems: "center", gap: 6
          }}
        >
          🤖 Ask AI
        </button>
      </div>

      {/* Main content below top bar */}
      <div style={{ display: "flex", flex: 1, marginTop: 56 }}>
        {/* Left: Module Nav */}
        <aside style={{
          width: 260, flexShrink: 0, background: C.surface,
          borderRight: `1px solid ${C.border}`, overflowY: "auto",
          height: "calc(100vh - 56px)", position: "sticky", top: 56
        }}>
          <div style={{ padding: "16px 16px 0", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>
            Course Content
          </div>
          {modules.map(mod => {
            const isOpen = openModules.includes(mod.id);
            const modDone = mod.lessons.filter(l => l.done).length;
            return (
              <div key={mod.id}>
                <button
                  onClick={() => toggleModule(mod.id)}
                  style={{
                    width: "100%", padding: "12px 16px", background: "transparent",
                    border: "none", display: "flex", justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer", fontFamily: FONT.body, borderBottom: `1px solid ${C.border}`
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12, color: C.faint, marginBottom: 2 }}>
                      Module {mod.id}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{mod.title}</div>
                    <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
                      {modDone}/{mod.lessons.length} complete
                    </div>
                  </div>
                  <span style={{ color: C.faint, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && mod.lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson.id)}
                    style={{
                      width: "100%", padding: "10px 16px 10px 24px",
                      background: activeLesson === lesson.id ? "#EBF5F0" : "transparent",
                      border: "none", borderLeft: activeLesson === lesson.id ? `3px solid ${C.s1}` : "3px solid transparent",
                      display: "flex", alignItems: "center", gap: 10,
                      cursor: "pointer", fontFamily: FONT.body, textAlign: "left"
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      background: lesson.done ? C.s1 : "transparent",
                      border: `2px solid ${lesson.done ? C.s1 : C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: "#fff"
                    }}>
                      {lesson.done ? "✓" : ""}
                    </div>
                    <span style={{
                      fontSize: 12, color: activeLesson === lesson.id ? C.dark : C.muted,
                      fontWeight: activeLesson === lesson.id ? 600 : 400, lineHeight: 1.4
                    }}>
                      {lesson.title}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </aside>

        {/* Right: Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {/* Video Placeholder */}
          <div style={{
            width: "100%", aspectRatio: "16/9", background: "#1A1A2E",
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 24, position: "relative", overflow: "hidden"
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)", display: "flex",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "background 0.2s"
            }}>
              <div style={{
                width: 0, height: 0,
                borderTop: "18px solid transparent",
                borderBottom: "18px solid transparent",
                borderLeft: "30px solid rgba(255,255,255,0.9)",
                marginLeft: 6
              }} />
            </div>
            <div style={{
              position: "absolute", bottom: 16, left: 20, right: 20,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: FONT.mono }}>
                0:00 / 12:45
              </span>
              <div style={{ display: "flex", gap: 12 }}>
                {["⛶", "CC", "⚙"].map(icon => (
                  <span key={icon} style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, cursor: "pointer" }}>{icon}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, fontFamily: FONT.display, marginBottom: 8 }}>
            {currentLesson.title}
          </h2>
          <p style={{ color: C.muted, lineHeight: 1.7, fontSize: 14, marginBottom: 24 }}>
            In this lesson, we explore how learners and researchers can access and interpret key structured datasets.
            You will understand data architectures, sampling frameworks, and how to analyze open data repositories and statistical dashboards.
          </p>

          {/* Key Concepts */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "16px 20px", marginBottom: 24
          }}>
            <div style={{ fontWeight: 700, color: C.dark, fontSize: 13, marginBottom: 10 }}>Key Concepts</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Statistical Systems", "Data Architectures", "Public Data Repositories", "Sampling Methods", "Data Literacy"].map(kw => (
                <span key={kw} style={{
                  background: "#EBF5F0", color: C.s1, fontSize: 12, fontWeight: 600,
                  padding: "4px 10px", borderRadius: 12
                }}>{kw}</span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 700, color: C.dark, fontSize: 14, marginBottom: 8 }}>My Notes</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Take notes while you learn…"
              style={{
                width: "100%", height: 120, padding: "12px 14px",
                border: `1px solid ${C.border}`, borderRadius: 10,
                fontSize: 14, color: C.dark, background: C.surface,
                resize: "vertical", fontFamily: FONT.body, outline: "none",
                lineHeight: 1.6, boxSizing: "border-box"
              }}
            />
          </div>

          {/* Lesson Nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => prevLesson && setActiveLesson(prevLesson.id)}
              disabled={!prevLesson}
              style={{
                padding: "11px 22px", background: prevLesson ? C.surface : "transparent",
                border: `1.5px solid ${prevLesson ? C.border : "transparent"}`,
                borderRadius: 9, fontSize: 14, fontWeight: 600, color: prevLesson ? C.dark : C.faint,
                cursor: prevLesson ? "pointer" : "default", fontFamily: FONT.body
              }}
            >
              ← Previous Lesson
            </button>

            <button style={{
              padding: "11px 22px", background: C.s1, border: "none",
              borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#fff",
              cursor: "pointer", fontFamily: FONT.body
            }}>
              Mark Complete ✓
            </button>

            <button
              onClick={() => nextLesson && setActiveLesson(nextLesson.id)}
              disabled={!nextLesson}
              style={{
                padding: "11px 22px", background: nextLesson ? C.accent : "transparent",
                border: `1.5px solid ${nextLesson ? C.accent : "transparent"}`,
                borderRadius: 9, fontSize: 14, fontWeight: 600, color: nextLesson ? "#fff" : C.faint,
                cursor: nextLesson ? "pointer" : "default", fontFamily: FONT.body
              }}
            >
              Next Lesson →
            </button>
          </div>
        </main>
      </div>

      {/* AI Mentor FAB */}
      <button
        onClick={() => setShowAI(!showAI)}
        style={{
          position: "fixed", bottom: 28, right: 28, width: 56, height: 56,
          background: C.dark, border: "none", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          zIndex: 200
        }}
      >
        🤖
      </button>

      {/* AI Panel */}
      {showAI && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, width: 320,
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)", zIndex: 200,
          display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          <div style={{
            background: C.dark, padding: "14px 18px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>🤖 AI Learning Mentor</div>
            <button onClick={() => setShowAI(false)} style={{
              background: "transparent", border: "none", color: "rgba(255,255,255,0.6)",
              cursor: "pointer", fontSize: 18, fontFamily: FONT.body
            }}>✕</button>
          </div>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, background: "#F0FBF4" }}>
            <div style={{ fontSize: 13, color: C.s1 }}>
              Hi! I can help you understand this lesson. Ask me anything about Data-Driven Governance.
            </div>
          </div>
          <div style={{ padding: "14px 18px", display: "flex", gap: 8 }}>
            <input
              placeholder="Ask a question…"
              style={{
                flex: 1, padding: "9px 12px", border: `1px solid ${C.border}`,
                borderRadius: 8, fontSize: 13, fontFamily: FONT.body, outline: "none",
                background: C.bg, color: C.dark
              }}
            />
            <button style={{
              padding: "9px 14px", background: C.accent, border: "none",
              borderRadius: 8, color: "#fff", cursor: "pointer", fontFamily: FONT.body
            }}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}
