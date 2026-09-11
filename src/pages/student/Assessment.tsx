import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { C, FONT } from "@/tokens";
import { useCompetency } from "@/context/CompetencyContext";
import { useAuth } from "@/context/AuthContext";
import { getCoursesByTitlesOrIds, getAllUnifiedCourses, type IGOTCatalogCourse } from "@/services/karmayogiCoursesService";
import {
  generateAssessmentQuestionsForCourses,
  generateMCQsWithRAG,
  type ExtendedDiagnosticQuestion,
} from "@/services/aiQuestionGeneratorService";

const TOTAL_SECONDS = 20 * 60;

const domainColors: Record<string, string> = {
  "Applied Statistics & Sampling Theory": "#1B3D29",
  "SQL & Database Operations": "#0F5C5C",
  "Python & Data Analytics": "#C6851B",
  "GIS & Spatial Analysis": "#8C3B17",
  "Public Data Ethics & DPDP Act 2023": "#3F51B5",
  "Public Admin & GFR Guidelines": "#2E7D32",
};

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const card: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: "24px 28px",
};

export default function Assessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { submitDiagnosticAssessment } = useCompetency();

  // Navigation state passed when completing a course or opening direct assessment
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isExamRoute = location.pathname.endsWith("/exam") || searchParams.get("mode") === "exam";

  const targetCourseId = (location.state?.courseId as string | undefined) || searchParams.get("courseId") || undefined;
  const targetCourseTitle = (location.state?.courseTitle as string | undefined) || searchParams.get("courseTitle") || undefined;
  const fromCompletion = Boolean(location.state?.fromCompletion) || searchParams.get("fromCompletion") === "true";

  // Resolved currently learning courses from profile or fallback catalog
  const userCourseIds = useMemo(() => {
    return (profile?.interestedCourses || []).map(String);
  }, [profile?.interestedCourses]);

  const currentlyLearningCourses: IGOTCatalogCourse[] = useMemo(() => {
    const userCourses = getCoursesByTitlesOrIds(userCourseIds);
    if (userCourses.length > 0) return userCourses;
    // Fallback default core cadre courses if none enrolled yet
    return getAllUnifiedCourses().slice(0, 3);
  }, [userCourseIds]);

  // Selected course filter for assessment (all vs specific)
  const [selectedAssessmentCourseId, setSelectedAssessmentCourseId] = useState<string | "all">(
    targetCourseId || "all"
  );

  // Pre-assessment notice / briefing screen state (auto-start if in exam route / mode=exam)
  const [isStarted, setIsStarted] = useState(isExamRoute);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [launchedInNewTab, setLaunchedInNewTab] = useState(false);

  useEffect(() => {
    if (isExamRoute) {
      setIsStarted(true);
    }
  }, [isExamRoute]);

  // Dynamically generate AI questions based on the currently learning courses via RAG
  const [questions, setQuestions] = useState<ExtendedDiagnosticQuestion[]>(() => {
    return generateAssessmentQuestionsForCourses(
      currentlyLearningCourses,
      10,
      selectedAssessmentCourseId === "all" ? undefined : selectedAssessmentCourseId
    );
  });

  // Automatically query RAG knowledge base for selected course and synthesize grounded MCQs
  useEffect(() => {
    // Immediate baseline questions to prevent loading flicker
    setQuestions(
      generateAssessmentQuestionsForCourses(
        currentlyLearningCourses,
        10,
        selectedAssessmentCourseId === "all" ? undefined : selectedAssessmentCourseId
      )
    );

    let isMounted = true;
    const loadRAGGroundedQuestions = async () => {
      const activeCourseObj =
        selectedAssessmentCourseId !== "all"
          ? currentlyLearningCourses.find((c) => String(c.id) === selectedAssessmentCourseId)
          : currentlyLearningCourses[0];

      const topicOrCourse = activeCourseObj ? activeCourseObj.title : profile?.track || "Public Administration";
      try {
        const ragQuestions = await generateMCQsWithRAG({
          courseOrTopic: topicOrCourse,
          activeCourses: currentlyLearningCourses,
          targetLevel: activeCourseObj?.level || "Applied",
          totalQuestionsCount: 10,
        });

        if (isMounted && ragQuestions && ragQuestions.length > 0) {
          setQuestions(ragQuestions);
        }
      } catch (err) {
        console.warn("RAG question load fallback:", err);
      }
    };

    loadRAGGroundedQuestions();
    return () => {
      isMounted = false;
    };
  }, [currentlyLearningCourses, selectedAssessmentCourseId]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);

  // Reset answers and flags when questions change
  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
    setFlagged(new Array(questions.length).fill(false));
    setCurrent(0);
  }, [questions]);

  // Timer: ONLY starts when isStarted is true and not submitted
  useEffect(() => {
    if (!isStarted || submitted) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isStarted, submitted]);

  const q = questions[current] || questions[0];
  const selected = answers[current];

  function select(idx: number) {
    if (submitted) return;
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  function toggleFlag(index: number) {
    setFlagged((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  function handleSubmit() {
    setSubmitted(true);
    const timeTaken = TOTAL_SECONDS - timeLeft;
    const submission = submitDiagnosticAssessment(answers, timeTaken, questions);

    const payload = {
      submission,
      answers,
      timeTaken,
      questions,
      completedAt: Date.now(),
    };

    try {
      localStorage.setItem("gyanmarg_latest_assessment_result", JSON.stringify(payload));
      localStorage.setItem("gyanmarg_assessment_completed_trigger", String(Date.now()));
    } catch (e) {
      console.error("Failed to store assessment payload", e);
    }

    // If taking exam in new tab, redirect previous (parent) tab and close this tab
    if (isExamRoute) {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.location.href = "/student/assessment/results";
          window.opener.focus();
        }
      } catch (err) {
        console.warn("Unable to redirect opener window directly:", err);
      }

      try {
        window.close();
      } catch (err) {
        console.warn("window.close() restricted:", err);
      }

      // Safe fallback if window didn't close
      navigate("/student/assessment/results", {
        state: payload,
      });
      return;
    }

    navigate("/student/assessment/results", {
      state: payload,
    });
  }

  // Cross-tab listener: if this is the parent briefing tab, listen for the exam tab's completion trigger
  useEffect(() => {
    if (isExamRoute) return;

    function handleStorageChange(e: StorageEvent) {
      if (e.key === "gyanmarg_assessment_completed_trigger" && e.newValue) {
        const saved = localStorage.getItem("gyanmarg_latest_assessment_result");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            navigate("/student/assessment/results", { state: parsed });
            return;
          } catch (err) {
            console.error(err);
          }
        }
        navigate("/student/assessment/results");
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isExamRoute, navigate]);

  function handleLaunchAssessmentInNewTab() {
    setShowConfirmModal(false);
    setLaunchedInNewTab(true);

    const params = new URLSearchParams();
    if (selectedAssessmentCourseId && selectedAssessmentCourseId !== "all") {
      params.set("courseId", selectedAssessmentCourseId);
    }
    if (targetCourseTitle) {
      params.set("courseTitle", targetCourseTitle);
    }
    if (fromCompletion) {
      params.set("fromCompletion", "true");
    }
    params.set("mode", "exam");

    const newTabUrl = `/student/assessment/exam?${params.toString()}`;
    window.open(newTabUrl, "_blank");
  }

  const answered = answers.filter((a) => a !== null).length;
  const progress = questions.length > 0 ? (answered / questions.length) * 100 : 0;

  // Domain summary
  const domainMap: Record<string, { total: number; done: number; color: string }> = {};
  questions.forEach((q2, i) => {
    if (!domainMap[q2.domain]) {
      domainMap[q2.domain] = { total: 0, done: 0, color: domainColors[q2.domain] || C.muted };
    }
    domainMap[q2.domain].total++;
    if (answers[i] !== null) domainMap[q2.domain].done++;
  });

  const timerUrgent = timeLeft < 120;

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 1: PRE-ASSESSMENT BRIEFING, NOTICES & STARTING INDICATIONS
  // ──────────────────────────────────────────────────────────────────────────
  if (!isStarted) {
    return (
      <div style={{ fontFamily: FONT.body, color: C.dark, padding: "28px 32px", maxWidth: 1040, margin: "0 auto" }}>
        {/* Notice Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: fromCompletion ? "#E6F4EC" : "#1B3D2915",
                color: fromCompletion ? C.s1 : "#1B3D29",
                padding: "4px 10px",
                borderRadius: 4,
                border: `1px solid ${fromCompletion ? C.s1 + "40" : "transparent"}`,
              }}
            >
              {fromCompletion ? "🎉 Post-Course Competency Validation" : "📋 Assessment Briefing & Examination Indications"}
            </span>
            <span style={{ fontSize: 12.5, color: C.muted }}>
              Track: <strong>{profile?.track || "Higher Education / University Student"}</strong>
            </span>
          </div>

          <h1 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: C.dark }}>
            National Competency Diagnostic Assessment
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
            {fromCompletion
              ? `Congratulations on completing "${targetCourseTitle || "your course"}"! Please review the assessment guidelines below before launching your competency validation test.`
              : "Read the official notices, examination guidelines, and syllabus scope below. The timer will only commence once you click 'Start Assessment Now'."}
          </p>
        </div>

        {/* Banner when exam is running in a new tab */}
        {launchedInNewTab && (
          <div
            style={{
              background: "#E6F4EC",
              border: `1.5px solid ${C.s1}`,
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 26 }}>🚀</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: C.s1 }}>
                  Assessment Session Launched in New Tab
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
                  Your 20-minute timed AI evaluation is currently active in another window/tab. Complete your questions there.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleLaunchAssessmentInNewTab}
                style={{
                  padding: "8px 16px",
                  background: C.s1,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>Re-open Exam Tab</span>
                <span>↗</span>
              </button>
              <button
                onClick={() => {
                  setIsStarted(true);
                  setTimeLeft(TOTAL_SECONDS);
                }}
                style={{
                  padding: "8px 14px",
                  background: "transparent",
                  border: `1px solid ${C.s1}`,
                  color: C.s1,
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Take in this tab instead
              </button>
            </div>
          </div>
        )}

        {/* Post-Course Completion Congratulatory Banner (if navigated from course) */}
        {fromCompletion && (
          <div
            style={{
              background: "#E8F5E9",
              border: `1.5px solid ${C.s1}`,
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ fontSize: 28 }}>🎓</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1B5E20" }}>
                Course Completed: {targetCourseTitle || "iGOT Remedial Module"}
              </div>
              <div style={{ fontSize: 12.5, color: "#2E7D32", marginTop: 2 }}>
                Your progress is 100% recorded. This AI-synthesized assessment will validate your newly mastered competencies, update your Demonstrated Skill Scores, and close your Competency Gaps.
              </div>
            </div>
          </div>
        )}

        {/* 4 Crucial Notice & Examination Indicator Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {/* Notice Card 1 */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "18px 20px",
              borderTop: `3px solid ${C.dark}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>⏱️</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Duration & Timing</div>
            <div style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: C.dark, margin: "4px 0" }}>
              20 Minutes
            </div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Timer starts only upon clicking 'Start Assessment'</div>
          </div>

          {/* Notice Card 2 */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "18px 20px",
              borderTop: `3px solid ${C.accent}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>📝</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Question Format</div>
            <div style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: C.accent, margin: "4px 0" }}>
              10 Dynamic MCQs
            </div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Single correct answer with technical citations</div>
          </div>

          {/* Notice Card 3 */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "18px 20px",
              borderTop: `3px solid ${C.s1}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>⚖️</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Marking Standard</div>
            <div style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: C.s1, margin: "4px 0" }}>
              +1 / No Negative
            </div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Target passing benchmark: 75% Mastery</div>
          </div>

          {/* Notice Card 4 */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "18px 20px",
              borderTop: `3px solid #3F51B5`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>🤖</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Generation Engine</div>
            <div style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: "#3F51B5", margin: "4px 0" }}>
              AI Synthesized
            </div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Derived directly from your active course modules</div>
          </div>
        </div>

        {/* Currently Learning Courses Evaluated in this Session */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 26px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, color: C.dark }}>
                Currently Learning Courses Tested in this Session
              </div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
                AI generates multiple-choice questions matching the practical syllabus and competency domains of these active courses
              </div>
            </div>

            {currentlyLearningCourses.length > 1 && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: C.muted }}>Scope:</span>
                <select
                  value={selectedAssessmentCourseId}
                  onChange={(e) => setSelectedAssessmentCourseId(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${C.border}`,
                    background: "#fff",
                    fontFamily: FONT.body,
                    fontSize: 12.5,
                    color: C.dark,
                    cursor: "pointer",
                  }}
                >
                  <option value="all">Comprehensive (All Enrolled Courses)</option>
                  {currentlyLearningCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {currentlyLearningCourses.map((course) => {
              const isTargeted = String(course.id) === String(targetCourseId);
              return (
                <div
                  key={course.id}
                  style={{
                    background: isTargeted ? "#FAF4E8" : C.bg,
                    border: `1.5px solid ${isTargeted ? C.accent : C.border}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        background: C.dark,
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {course.org || "iGOT Karmayogi"}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: C.s1,
                        background: "#E6F4EC",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      🤖 AI Questions Active
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: 13.5, color: C.dark, lineHeight: 1.3 }}>
                    {course.title}
                  </div>

                  <div style={{ fontSize: 11.5, color: C.muted, display: "flex", justifyContent: "space-between" }}>
                    <span>Domain: <strong>{course.domain}</strong></span>
                    <span>Code: <strong>{course.code || course.id}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Candidate Rules & Instructions Checklist */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 26px", marginBottom: 28 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15.5, fontWeight: 700, color: C.dark, marginBottom: 12 }}>
            Official Candidate Instructions & Exam Integrity Rules
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12.5, color: C.muted }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span>✓</span>
              <span><strong>Timed Session:</strong> Once started, the 20-minute countdown cannot be paused. Automatic submission occurs when time expires.</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span>✓</span>
              <span><strong>Question Navigation:</strong> Use the right-hand Question Palette to jump to any question or review flagged items.</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span>✓</span>
              <span><strong>Competency Impact:</strong> Results immediately recalculate your Demonstrated Skill Health and update your Gap Radar chart.</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span>✓</span>
              <span><strong>Technical Citations:</strong> Full official manual citations and rationale will be revealed upon final submission.</span>
            </div>
          </div>
        </div>

        {/* Start Assessment Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "12px 24px",
              background: "transparent",
              border: `1.5px solid ${C.border}`,
              borderRadius: 8,
              fontFamily: FONT.body,
              fontSize: 13.5,
              fontWeight: 600,
              color: C.dark,
              cursor: "pointer",
            }}
          >
            ← Return to Previous Page
          </button>

          <div>
            <button
              onClick={() => setShowConfirmModal(true)}
              style={{
                padding: "14px 36px",
                background: C.dark,
                color: "#FAF7F0",
                border: "none",
                borderRadius: 9,
                fontFamily: FONT.display,
                fontSize: 15.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 4px 16px rgba(27, 61, 41, 0.3)",
              }}
            >
              <span>🚀 Start AI Assessment Now (20:00)</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Confirmation Modal Pop-Up Dialog */}
        {showConfirmModal && (
          <div
            onClick={() => setShowConfirmModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(19, 43, 29, 0.65)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: C.surface,
                border: `1.5px solid ${C.border}`,
                borderRadius: 16,
                maxWidth: 480,
                width: "100%",
                padding: "26px 28px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
              }}
            >
              {/* Modal Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: `${C.accent}20`,
                    border: `1.5px solid ${C.accent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  ⏱️
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 19,
                      fontWeight: 800,
                      margin: 0,
                      color: C.dark,
                    }}
                  >
                    Confirm Assessment Launch
                  </h3>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    Official 20-minute timed evaluation session
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.55, margin: "0 0 16px" }}>
                You are about to begin the <strong>National Competency Diagnostic Assessment</strong>. Once confirmed, the 20-minute timer will commence immediately.
              </p>

              {/* Confirmation Checkpoints */}
              <div
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginBottom: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  fontSize: 12.5,
                  color: C.dark,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: C.accent, fontWeight: 700 }}>•</span>
                  <span><strong>10 AI-Generated MCQs</strong> mapped to active course competencies</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: C.s4, fontWeight: 700 }}>•</span>
                  <span><strong>20:00 Timer</strong> starts immediately and cannot be paused</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: C.s1, fontWeight: 700 }}>•</span>
                  <span><strong>No Negative Marking</strong> · Target benchmark: 75% Mastery</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#3F51B5", fontWeight: 700 }}>•</span>
                  <span><strong>Opens in New Tab</strong> · Dedicated, distraction-free examination window</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    padding: "10px 18px",
                    background: "transparent",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    fontFamily: FONT.body,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.dark,
                    cursor: "pointer",
                  }}
                >
                  Cancel / Review Notes
                </button>
                <button
                  onClick={handleLaunchAssessmentInNewTab}
                  style={{
                    padding: "10px 22px",
                    background: C.dark,
                    color: "#FAF7F0",
                    border: "none",
                    borderRadius: 8,
                    fontFamily: FONT.display,
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 2px 8px rgba(27, 61, 41, 0.3)",
                  }}
                >
                  <span>Yes, Start Assessment 🚀</span>
                  <span style={{ fontSize: 13, opacity: 0.85 }}>↗</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 2: ACTIVE TIMED ASSESSMENT
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: FONT.body,
        color: C.dark,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Dedicated Clean Exam Top Header (shown in standalone new tab mode) */}
      {isExamRoute && (
        <header
          style={{
            height: 60,
            background: "#1B3D29",
            color: "#FAF7F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: C.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 32 32" fill="none" width={16} height={16}>
                <path d="M16 3C16 3 8 9 8 17a8 8 0 0016 0C24 9 16 3 16 3z" fill="#fff" />
                <circle cx="16" cy="17" r="3" fill={C.accent} />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>
                GyanMarg <span style={{ color: C.accent }}>AI</span> · Examination Environment
              </div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)" }}>
                National Competency Diagnostic Evaluation · Candidate: <strong>{profile?.fullName || "Candidate"}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(255,255,255,0.12)",
                color: "#E6F4EC",
                padding: "4px 10px",
                borderRadius: 99,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>🔒</span> Proctored Exam Mode
            </span>
            <button
              onClick={() => {
                if (window.confirm("Fill sample answers to accelerate testing?")) {
                  const mockAnswers = questions.map((dq, idx) => {
                    if (idx === 2 || idx === 6 || idx === 7) return (dq.correct + 1) % 4;
                    return dq.correct;
                  });
                  setAnswers(mockAnswers);
                }
              }}
              style={{
                padding: "5px 11px",
                background: "rgba(198, 133, 27, 0.2)",
                border: `1px solid ${C.accent}`,
                borderRadius: 6,
                color: C.accent,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ⚡ Demo Quick-Fill
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to exit the exam? Unsaved progress will be lost.")) {
                  if (window.opener) {
                    window.close();
                  } else {
                    window.location.href = "/student/assessment";
                  }
                }
              }}
              style={{
                padding: "5px 12px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 6,
                color: "#fff",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✕ Exit Exam
            </button>
          </div>
        </header>
      )}

      {/* Main Assessment Viewport */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 32px 40px",
          maxWidth: 1240,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: "#1B3D2915",
                  color: "#1B3D29",
                  padding: "3px 8px",
                  borderRadius: 4,
                }}
              >
                Active AI Assessment Session
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>Track: {profile?.track || "Higher Education / University Student"}</span>
            </div>
            <h1
              style={{
                fontFamily: FONT.display,
                fontSize: 24,
                fontWeight: 700,
                margin: 0,
                color: C.dark,
              }}
            >
              National Competency Diagnostic Assessment
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>
              Evaluating functional mastery across your enrolled courses and core civil service competency pillars.
            </p>
          </div>

          {!isExamRoute && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => {
                  if (window.confirm("Fill sample answers to accelerate testing?")) {
                    const mockAnswers = questions.map((dq, idx) => {
                      if (idx === 2 || idx === 6 || idx === 7) return (dq.correct + 1) % 4;
                      return dq.correct;
                    });
                    setAnswers(mockAnswers);
                  }
                }}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: `1px dashed ${C.accent}`,
                  borderRadius: 6,
                  color: C.accent,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ⚡ Demo Quick-Fill
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to exit the exam? Unsaved progress will be lost.")) {
                    navigate("/student/assessment");
                  }
                }}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  color: C.muted,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ✕ Exit Exam
              </button>
            </div>
          )}
        </div>

      {/* Progress bar + timer row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: C.faint,
              marginBottom: 5,
            }}
          >
            <span>
              Question {current + 1} of {questions.length}
            </span>
            <span>
              {answered} of {questions.length} Answered ({Math.round(progress)}%)
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: C.border,
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: C.s1,
                borderRadius: 99,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Timer Card */}
        <div
          style={{
            background: timerUrgent ? C.s4 : "#1B3D29",
            color: "#fff",
            borderRadius: 8,
            padding: "8px 16px",
            fontFamily: FONT.mono,
            fontSize: 16,
            fontWeight: 700,
            minWidth: 80,
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          }}
        >
          {fmtTime(timeLeft)}
        </div>
      </div>

      {/* Main layout: question + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20 }}>
        {/* Question card */}
        <div style={card}>
          {/* Top Info Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  background: domainColors[q.domain] ?? C.muted,
                  padding: "4px 12px",
                  borderRadius: 99,
                }}
              >
                {q.domain}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.accent,
                  background: "#FEF3C7",
                  border: `1px solid ${C.accent}40`,
                  padding: "3px 10px",
                  borderRadius: 6,
                }}
              >
                🤖 AI Synthesized for: {q.courseTitle || "Enrolled Course"}
              </span>
            </div>

            <button
              onClick={() => toggleFlag(current)}
              style={{
                background: flagged[current] ? "#F3E8FF" : "transparent",
                border: `1px solid ${flagged[current] ? "#9333EA" : C.border}`,
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 11.5,
                fontWeight: 600,
                color: flagged[current] ? "#9333EA" : C.muted,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{flagged[current] ? "🚩 Flagged" : "🏳️ Flag for Review"}</span>
            </button>
          </div>

          {/* Question Text */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1.6,
              color: C.dark,
              marginBottom: 22,
            }}
          >
            {q.text}
          </div>

          {/* Options List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {q.options.map((opt, idx) => {
              const isChosen = selected === idx;
              const letter = String.fromCharCode(65 + idx);

              return (
                <div
                  key={idx}
                  onClick={() => select(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    borderRadius: 10,
                    border: `1.5px solid ${isChosen ? C.accent : C.border}`,
                    background: isChosen ? "#FAF4E8" : C.surface,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: isChosen ? C.accent : C.surfaceAlt,
                      color: isChosen ? "#fff" : C.muted,
                      fontWeight: 700,
                      fontSize: 12.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {letter}
                  </div>
                  <span style={{ fontSize: 14, color: isChosen ? C.dark : C.dark, fontWeight: isChosen ? 600 : 400, lineHeight: 1.4 }}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: current === 0 ? C.surfaceAlt : "#fff",
                color: current === 0 ? C.faint : C.dark,
                fontFamily: FONT.body,
                fontSize: 13,
                fontWeight: 600,
                cursor: current === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Previous Question
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                style={{
                  padding: "9px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: C.dark,
                  color: "#fff",
                  fontFamily: FONT.body,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(27, 61, 41, 0.2)",
                }}
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  padding: "9px 26px",
                  borderRadius: 8,
                  border: "none",
                  background: C.s1,
                  color: "#fff",
                  fontFamily: FONT.body,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(27, 107, 64, 0.3)",
                }}
              >
                Submit Assessment ✓
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Question Palette & Domain Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Question Palette Matrix */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>Question Palette</span>
              <span style={{ fontSize: 11, color: C.muted }}>{answered}/{questions.length} done</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 14 }}>
              {questions.map((_, idx) => {
                const isCurrent = current === idx;
                const isAnswered = answers[idx] !== null;
                const isFlagged = flagged[idx];

                let bg = C.surfaceAlt;
                let textCol = C.muted;
                let border = `1px solid ${C.border}`;

                if (isAnswered) {
                  bg = C.s1;
                  textCol = "#fff";
                  border = `1px solid ${C.s1}`;
                }
                if (isCurrent) {
                  border = `2px solid ${C.accent}`;
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    style={{
                      aspectRatio: "1/1",
                      borderRadius: 6,
                      background: bg,
                      color: textCol,
                      border,
                      fontFamily: FONT.mono,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span
                        style={{
                          position: "absolute",
                          top: -3,
                          right: -3,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#9333EA",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 10.5, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: C.s1 }} />
                <span>Answered</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: C.surfaceAlt, border: `2px solid ${C.accent}` }} />
                <span>Current Question</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#9333EA" }} />
                <span>Flagged for Review</span>
              </div>
            </div>
          </div>

          {/* Domain Breakdown */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 10 }}>
              Tested Competency Domains
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(domainMap).map(([dom, info]) => (
                <div key={dom} style={{ fontSize: 11.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ color: C.dark, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                      {dom}
                    </span>
                    <span style={{ fontWeight: 700, color: info.color }}>
                      {info.done}/{info.total}
                    </span>
                  </div>
                  <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${(info.done / info.total) * 100}%`,
                        background: info.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Submit */}
          <button
            onClick={handleSubmit}
            style={{
              padding: "12px 0",
              background: C.s1,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontFamily: FONT.body,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: "pointer",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(27, 107, 64, 0.25)",
            }}
          >
            Submit Assessment ✓
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
