import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import { getCourseById, getAllUnifiedCourses } from "@/services/karmayogiCoursesService";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openModule, setOpenModule] = useState<number | null>(1);

  const fallbackCourse = getAllUnifiedCourses()[0];
  const course = getCourseById(id) || fallbackCourse;
  const enrolled = true;
  const progress = 45;

  const modulesCount = course.modulesCount || Math.max(3, Math.min(8, Math.round((course.duration || 6) / 2)));

  const mockModules = Array.from({ length: modulesCount }, (_, i) => ({
    id: i + 1,
    title: `Core Competency Module ${i + 1}: ${course.domain ? course.domain.split(" ")[0] : "Domain"} Fundamentals & Application`,
    lessons: [
      `Lesson ${i + 1}.1: Regulatory Framework & Official Guidelines`,
      `Lesson ${i + 1}.2: Methodological Principles & Standard Operating Procedures`,
      `Lesson ${i + 1}.3: Microdata Processing & Analytical Exercises`,
      `Lesson ${i + 1}.4: Practical Implementation Lab & Case Study`,
    ],
  }));

  const outcomes =
    course.outcomes && course.outcomes.length > 0
      ? course.outcomes
      : course.keywords && course.keywords.length > 0
      ? course.keywords.slice(0, 4).map((k) => `Master core proficiency in ${k}`)
      : [
          `Understand foundational principles of ${course.title}`,
          `Implement best administrative and practical workflows`,
          `Evaluate real-world governance scenarios and datasets`,
        ];

  const instructorName = course.instructor?.name || (course.org ? `Faculty Directorate, ${course.org}` : "National iGOT Faculty Lead");
  const instructorTitle = course.instructor?.title || `Senior Specialist & Curriculum Advisor, ${course.domain || "iGOT Karmayogi"}`;
  const instructorAvatar = course.instructor?.avatar || (course.org ? course.org.slice(0, 2).toUpperCase() : "IG");

  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: C.muted }}>
        <Link to="/student/courses" style={{ color: C.muted, textDecoration: "none" }}>Courses</Link>
        <span>›</span>
        <span style={{ color: C.dark, fontWeight: 500 }}>{course.title}</span>
      </div>

      {/* Hero */}
      <div
        style={{
          background: "#1B3D29",
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 28,
          color: "#fff",
          boxShadow: "0 6px 20px rgba(27, 61, 41, 0.2)",
        }}
      >
        <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: 12,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {course.level || "Beginner"}
          </span>

          {course.tpacEndorsed && (
            <span
              style={{
                background: C.accent,
                color: "#1B3D29",
                borderRadius: 12,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              🎖️ TPAC Endorsed Program
            </span>
          )}

          <span
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "4px 12px",
              fontSize: 12,
              fontFamily: FONT.mono,
            }}
          >
            {course.code || "IGOT-STD"}
          </span>

          {course.subDomain && (
            <span
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "4px 12px",
                fontSize: 12,
              }}
            >
              {course.subDomain}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px", fontFamily: FONT.display }}>
          {course.title}
        </h1>
        <div style={{ color: "#D4E8D8", fontSize: 14, marginBottom: 18 }}>
          Domain: <strong>{course.domain}</strong> · Provider: <strong>{course.org || "iGOT Karmayogi"}</strong>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            `⏱️ ${course.duration || 6} hours self-paced`,
            `⭐ ${course.rating || 4.8} / 5.0 rating`,
            `🎯 Competency: ${course.domain}`,
            `🏛️ Ministry/Org: ${course.org || "National Civil Service"}`,
          ].map((label) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#fff" }}>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        {/* Left Content */}
        <div>
          {/* Description */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "22px 24px",
              marginBottom: 20,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 12, fontFamily: FONT.display }}>
              Course Overview & Official Alignment
            </h2>
            <p style={{ color: C.dark, lineHeight: 1.7, fontSize: 14, margin: 0, opacity: 0.9 }}>
              {course.desc || "Comprehensive capacity building course designed according to official capacity guidelines, providing structured competency growth and practical governance applications."}
            </p>
          </div>

          {/* What you'll learn */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "22px 24px",
              marginBottom: 20,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 14, fontFamily: FONT.display }}>
              Target Competencies & Learning Outcomes
            </h2>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {outcomes.map((o, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#EBF5F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: C.s1,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ fontSize: 14, color: C.dark, lineHeight: 1.5 }}>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "22px 24px",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, margin: 0, fontFamily: FONT.display }}>
                Modular Curriculum
              </h2>
              <span style={{ fontSize: 12, color: C.muted }}>{mockModules.length} Modules · {mockModules.length * 4} Lessons</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {mockModules.map((mod) => (
                <div key={mod.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: openModule === mod.id ? "#EBF5F0" : "transparent",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      fontFamily: FONT.body,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>
                      {mod.title}
                    </span>
                    <span style={{ color: C.muted, fontSize: 13 }}>
                      {mod.lessons.length} lessons {openModule === mod.id ? "▲" : "▼"}
                    </span>
                  </button>
                  {openModule === mod.id && (
                    <div style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
                      {mod.lessons.map((lesson, li) => (
                        <div
                          key={li}
                          style={{
                            padding: "10px 20px",
                            borderBottom: li < mod.lessons.length - 1 ? `1px solid ${C.border}` : "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span style={{ fontSize: 12, color: C.s1 }}>▶</span>
                          <span style={{ fontSize: 13, color: C.dark }}>{lesson}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructor / Authority */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "22px 24px",
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 14, fontFamily: FONT.display }}>
              Course Instructor & Content Directorate
            </h2>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#1B3D29",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {instructorAvatar}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>{instructorName}</div>
                <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{instructorTitle}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar */}
        <div style={{ position: "sticky", top: 24 }}>
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            {/* Header Banner */}
            <div
              style={{
                height: 100,
                background: "#1B3D29",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                position: "relative",
              }}
            >
              {course.posterImage ? (
                <img
                  src={course.posterImage}
                  alt={course.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, position: "absolute" }}
                />
              ) : null}
              <span style={{ fontSize: 30, zIndex: 1 }}>🎓</span>
              <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4, fontWeight: 700, zIndex: 1 }}>
                iGOT Karmayogi Program
              </span>
            </div>

            <div style={{ padding: "22px 20px" }}>
              {enrolled && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.muted }}>Remediation Progress</span>
                    <span style={{ fontSize: 13, color: C.s1, fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div style={{ height: 8, background: C.border, borderRadius: 4 }}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 4,
                        background: C.s1,
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate(`/student/courses/${course.id}/learn`)}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: C.accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginBottom: 10,
                  fontFamily: FONT.body,
                  boxShadow: "0 2px 8px rgba(198, 133, 27, 0.25)",
                }}
              >
                Launch Learning Interface →
              </button>

              <button
                onClick={() => {
                  if (course.url) {
                    window.open(course.url, "_blank", "noopener,noreferrer");
                  } else {
                    alert(`Navigating to iGOT Portal for course ${course.code}`);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "transparent",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.dark,
                  cursor: "pointer",
                  marginBottom: 14,
                  fontFamily: FONT.body,
                }}
              >
                Open in iGOT Karmayogi ↗
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                {[
                  ["⏱️", "Duration", `${course.duration || 6} Hours self-paced`],
                  ["📚", "Curriculum", `${mockModules.length} Modules across topics`],
                  ["🏅", "Credential", "iGOT Verified Digital Badge"],
                  ["🎯", "FrAC Domain", course.domain || "Governance"],
                ].map(([icon, label, val]) => (
                  <div key={label} style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: C.faint }}>{label}</div>
                      <div style={{ fontSize: 12.5, color: C.dark, fontWeight: 600 }}>{val}</div>
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
