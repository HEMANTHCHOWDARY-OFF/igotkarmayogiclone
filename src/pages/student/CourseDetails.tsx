import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { C, FONT } from "@/tokens";

const COURSE = {
  id: 1,
  title: "Data-Driven Governance",
  dept: "Department of Personnel & Training",
  level: "Intermediate",
  duration: "6 hours",
  enrolled: 4820,
  rating: 4.6,
  reviews: 312,
  description: "This course equips civil servants with the skills to leverage data analytics for evidence-based policy making and effective governance. Participants will learn to interpret dashboards, work with government datasets, and present data-backed recommendations to senior officials.",
  outcomes: [
    "Understand key data analytics concepts relevant to governance",
    "Interpret statistical reports and dashboards used in government",
    "Apply data to identify policy gaps and prioritize interventions",
    "Present data-driven insights to stakeholders effectively",
    "Use digital tools for data collection and analysis",
  ],
  modules: [
    {
      id: 1, title: "Introduction to Data Governance", lessons: [
        "What is Data-Driven Governance?",
        "Key Datasets in Indian Government",
        "Reading Statistical Reports",
      ]
    },
    {
      id: 2, title: "Data Analysis Fundamentals", lessons: [
        "Basic Statistics for Policy Makers",
        "Working with Spreadsheets",
        "Data Visualization Principles",
        "Case Study: PMGSY Dashboard",
      ]
    },
    {
      id: 3, title: "Applying Data in Your Department", lessons: [
        "Identifying Data Sources",
        "Building a Department Dashboard",
        "Ethics of Data Use in Government",
      ]
    },
    {
      id: 4, title: "Communicating Insights", lessons: [
        "Writing Data-Backed Briefs",
        "Presentation Skills for Data",
        "Final Project & Assessment",
      ]
    },
  ],
  instructor: {
    name: "Dr. Ananya Krishnan",
    title: "Senior Policy Analyst, NITI Aayog",
    avatar: "AK",
  }
};

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openModule, setOpenModule] = useState<number | null>(1);
  const enrolled = true;
  const progress = 65;

  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: C.muted }}>
        <Link to="/student/courses" style={{ color: C.muted, textDecoration: "none" }}>Courses</Link>
        <span>›</span>
        <span style={{ color: C.dark, fontWeight: 500 }}>{COURSE.title}</span>
      </div>

      {/* Hero */}
      <div style={{
        background: C.dark, borderRadius: 16, padding: "28px 32px", marginBottom: 28,
        color: "#fff"
      }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <span style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "4px 12px",
            fontSize: 12, fontWeight: 600
          }}>{COURSE.level}</span>
          <span style={{
            background: "rgba(198,133,27,0.3)", color: "#F5C866", borderRadius: 12, padding: "4px 12px",
            fontSize: 12, fontWeight: 600
          }}>Standard Curriculum</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", fontFamily: FONT.display }}>
          {COURSE.title}
        </h1>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 18 }}>
          {COURSE.dept}
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            COURSE.duration,
            `${COURSE.enrolled.toLocaleString()} enrolled`,
            `${COURSE.rating} / 5.0 (${COURSE.reviews} reviews)`,
          ].map((label) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
        {/* Left */}
        <div>
          {/* Description */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "22px 24px", marginBottom: 20
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 12, fontFamily: FONT.display }}>
              About This Course
            </h2>
            <p style={{ color: C.muted, lineHeight: 1.7, fontSize: 14, margin: 0 }}>
              {COURSE.description}
            </p>
          </div>

          {/* What you'll learn */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "22px 24px", marginBottom: 20
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 14, fontFamily: FONT.display }}>
              What You Will Learn
            </h2>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {COURSE.outcomes.map((o, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", background: "#EBF5F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: C.s1, flexShrink: 0, marginTop: 1
                  }}>✓</div>
                  <span style={{ fontSize: 14, color: C.dark, lineHeight: 1.5 }}>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "22px 24px", marginBottom: 20
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 14, fontFamily: FONT.display }}>
              Curriculum
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {COURSE.modules.map(mod => (
                <div key={mod.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                    style={{
                      width: "100%", padding: "14px 16px", background: openModule === mod.id ? "#EBF5F0" : "transparent",
                      border: "none", display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer", fontFamily: FONT.body
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>
                      Module {mod.id}: {mod.title}
                    </span>
                    <span style={{ color: C.muted, fontSize: 13 }}>
                      {mod.lessons.length} lessons {openModule === mod.id ? "▲" : "▼"}
                    </span>
                  </button>
                  {openModule === mod.id && (
                    <div style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
                      {mod.lessons.map((lesson, li) => (
                        <div key={li} style={{
                          padding: "10px 20px", borderBottom: li < mod.lessons.length - 1 ? `1px solid ${C.border}` : "none",
                          display: "flex", alignItems: "center", gap: 10
                        }}>
                          <span style={{ fontSize: 13, color: C.faint }}>▶</span>
                          <span style={{ fontSize: 13, color: C.muted }}>{lesson}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructor */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "22px 24px"
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 14, fontFamily: FONT.display }}>
              Instructor
            </h2>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%", background: C.dark,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0
              }}>
                {COURSE.instructor.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>{COURSE.instructor.name}</div>
                <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{COURSE.instructor.title}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar */}
        <div style={{ position: "sticky", top: 24 }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden"
          }}>
            {/* Card image area */}
            <div style={{
              height: 120, background: C.dark,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48
            }}>
              📊
            </div>

            <div style={{ padding: "22px 20px" }}>
              {enrolled && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.muted }}>Your Progress</span>
                    <span style={{ fontSize: 13, color: C.s1, fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div style={{ height: 8, background: C.border, borderRadius: 4 }}>
                    <div style={{
                      height: "100%", borderRadius: 4, background: C.s1, width: `${progress}%`
                    }} />
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/student/courses/1/learn")}
                style={{
                  width: "100%", padding: "13px", background: C.accent, color: "#fff",
                  border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", marginBottom: 12, fontFamily: FONT.body
                }}
              >
                {enrolled ? "Continue Learning →" : "Enroll Now"}
              </button>

              {!enrolled && (
                <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginBottom: 16 }}>
                  Free • No expiry • Certificate included
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                {[
                  ["⏱", "Duration", COURSE.duration],
                  ["📖", "Lessons", "13 lessons across 4 modules"],
                  ["🏅", "Certificate", "Upon completion (min 70%)"],
                ].map(([icon, label, val]) => (
                  <div key={label} style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: C.faint }}>{label}</div>
                      <div style={{ fontSize: 13, color: C.dark, fontWeight: 500 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
