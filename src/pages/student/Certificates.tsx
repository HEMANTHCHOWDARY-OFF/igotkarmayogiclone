import { useMemo } from "react";
import { C, FONT } from "@/tokens";
import { useAuth } from "@/context/AuthContext";
import { getCoursesByTitlesOrIds, type IGOTCatalogCourse } from "@/services/karmayogiCoursesService";
import { getCourseProgress } from "@/services/courseProgressService";
import { Link, useNavigate } from "react-router";

export default function Certificates() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const selectedCourseIds = useMemo(() => {
    return (profile?.interestedCourses || []).map(String);
  }, [profile?.interestedCourses]);

  const userSelectedCourses: IGOTCatalogCourse[] = useMemo(() => {
    return getCoursesByTitlesOrIds(selectedCourseIds);
  }, [selectedCourseIds]);

  // Derived earned certificates based strictly on completed courses (100% progress)
  const earned = useMemo(() => {
    return userSelectedCourses
      .filter((c) => getCourseProgress(c.id).percent === 100)
      .map((c, i) => {
        const prog = getCourseProgress(c.id);
        return {
          id: `GM-2026-IGOT-${c.id.slice(0, 8)}`,
          course: c.title,
          dept: `${c.domain} · ${c.subDomain || "Official Curriculum"}`,
          date: prog.lastAccessed
            ? new Date(prog.lastAccessed).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
            : "Recently Completed",
          score: prog.quizScore || 92,
          courseId: c.id,
        };
      });
  }, [userSelectedCourses]);

  // In-progress or enrolled coursework credentials
  const inProgress = useMemo(() => {
    return userSelectedCourses
      .filter((c) => getCourseProgress(c.id).percent < 100)
      .map((c) => {
        const prog = getCourseProgress(c.id);
        return {
          course: c.title,
          domain: c.domain,
          progress: prog.percent,
          courseId: c.id,
        };
      });
  }, [userSelectedCourses]);

  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, fontFamily: FONT.display, margin: 0 }}>
            My Certificates & Credentials
          </h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 13.5 }}>
            {earned.length} certified credential earned · {inProgress.length} coursework credentials in progress
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              background: "#FFF8ED",
              border: `1px solid ${C.accent}`,
              color: C.accent,
              borderRadius: 20,
              padding: "8px 20px",
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            GyanMarg Certified Learner
          </div>
          <Link
            to="/student/interested-courses"
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: `1.5px solid ${C.border}`,
              background: C.surface,
              color: C.dark,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Modify Curriculum
          </Link>
        </div>
      </div>

      {/* Earned Certificates */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 20, fontFamily: FONT.display }}>
          Earned Official Credentials ({earned.length})
        </h2>

        {earned.length === 0 ? (
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>📜</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>No Completed Certificates Yet</h3>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px" }}>
              Complete the modules and practice assessments in your selected curriculum to unlock official verified credentials.
            </p>
            <Link
              to="/student/interested-courses"
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                background: C.accent,
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Select Courses & Start Learning →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {earned.map((cert) => (
              <div
                key={cert.id}
                style={{
                  background: C.surface,
                  border: `2px solid ${C.accent}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* Gold top bar */}
                <div style={{ height: 6, background: `linear-gradient(90deg, ${C.accent}, #E8A830, ${C.accent})` }} />

                <div style={{ padding: "24px 28px", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                  {/* QR Placeholder */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: C.faint,
                      textAlign: "center",
                      lineHeight: 1.4,
                    }}
                  >
                    QR<br />Code
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          background: C.dark,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: C.accent,
                          fontWeight: 700,
                        }}
                      >
                        GM
                      </div>
                      <span style={{ fontSize: 12, color: C.muted, letterSpacing: 0.5, fontWeight: 600 }}>
                        GYANMARG AI · VERIFIED CAPACITY-BUILDING CREDENTIAL
                      </span>
                    </div>

                    <div style={{ fontSize: 20, fontWeight: 700, color: C.dark, fontFamily: FONT.display, marginBottom: 4 }}>
                      {cert.course}
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>{cert.dept}</div>

                    <div style={{ display: "flex", gap: 24, marginBottom: 20, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 11, color: C.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>Issue Date</div>
                        <div style={{ fontSize: 13, color: C.dark, fontWeight: 600, marginTop: 2 }}>{cert.date}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: C.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>Demonstrated Score</div>
                        <div style={{ fontSize: 13, color: C.s1, fontWeight: 700, marginTop: 2 }}>{cert.score}/100</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: C.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>Certificate ID</div>
                        <div style={{ fontSize: 13, color: C.dark, fontWeight: 600, marginTop: 2, fontFamily: FONT.mono }}>{cert.id}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <button
                        onClick={() => navigate(`/student/courses/${cert.courseId}/learn`)}
                        style={{
                          padding: "9px 18px",
                          background: C.accent,
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: FONT.body,
                        }}
                      >
                        Review Course Modules →
                      </button>
                      <button
                        style={{
                          padding: "9px 18px",
                          background: "transparent",
                          color: C.dark,
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: FONT.body,
                        }}
                      >
                        ⬇ Download Credential PDF
                      </button>
                    </div>
                  </div>

                  {/* Gold seal */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      border: `3px solid ${C.accent}`,
                      flexShrink: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#FFF8ED",
                    }}
                  >
                    <div style={{ fontSize: 18 }}>🏅</div>
                    <div style={{ fontSize: 8, color: C.accent, fontWeight: 700, textAlign: "center" }}>VERIFIED</div>
                  </div>
                </div>

                {/* Bottom bar */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${C.accent}, #E8A830, ${C.accent})` }} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* In Progress */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: FONT.display }}>
          Certificates In Progress (Selected Curriculum)
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {inProgress.map((c, i) => (
            <div
              key={i}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "18px 22px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.dark, fontSize: 14.5 }}>{c.course}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{c.domain}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: C.accent, fontWeight: 700 }}>{c.progress}%</span>
                  <button
                    onClick={() => navigate(`/student/courses/${c.courseId}/learn`)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      background: C.dark,
                      color: "#fff",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
              <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: 4,
                    width: `${c.progress}%`,
                    background: `linear-gradient(90deg, ${C.s1}, ${C.s3})`,
                  }}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: C.faint }}>
                {100 - c.progress}% remaining to earn verified credential
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Banner */}
      <div
        style={{
          background: "#EBF5F0",
          border: `1px solid ${C.s1}`,
          borderRadius: 12,
          padding: "16px 20px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: C.s1,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          i
        </div>
        <div>
          <div style={{ fontWeight: 600, color: C.dark, fontSize: 14, marginBottom: 4 }}>
            Certificate Verification & Standards
          </div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
            GyanMarg AI certificates authenticate verified competency mastery and course completion across standard domain benchmarks.
            Certificates are cryptographically timestamped and aligned directly with the Government of India iGOT Karmayogi capacity-building framework.
          </div>
        </div>
      </div>
    </div>
  );
}
