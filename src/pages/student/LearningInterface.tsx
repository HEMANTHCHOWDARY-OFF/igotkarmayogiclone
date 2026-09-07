import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import { useCompetency } from "@/context/CompetencyContext";
import { IGOT_COURSES } from "@/data/igotCourses";

export default function LearningInterface() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    generatedQuestions,
    diagnosticQuestions,
    submitPracticeQuiz,
    domains,
  } = useCompetency();

  // Find course from canonical catalog or fallback to first
  const course = useMemo(() => {
    const courseId = Number(id);
    return IGOT_COURSES.find((c) => c.id === courseId) || IGOT_COURSES[0];
  }, [id]);

  const courseDomain = domains.find((d) => d.id === course.domainId) || domains[0];

  // Active view state: either a lesson id or "quiz"
  const [activeTab, setActiveTab] = useState<"lesson" | "quiz">("lesson");
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [aiChat, setAiChat] = useState<{ sender: "ai" | "user"; text: string }[]>([
    {
      sender: "ai",
      text: `Namaste! I am your MoSPI AI Learning Mentor for ${course.title}. Ask me anything about methodology, formulas, or standard operating procedures.`,
    },
  ]);
  const [aiInput, setAiInput] = useState("");

  // Quiz questions: filter from generatedQuestions matching this domain, fallback to diagnostic
  const quizQuestions = useMemo(() => {
    const matched = generatedQuestions.filter(
      (q) => q.domainId === course.domainId && q.status === "approved"
    );
    if (matched.length >= 2) {
      return matched.slice(0, 3);
    }
    const allDomainGen = generatedQuestions.filter((q) => q.domainId === course.domainId);
    if (allDomainGen.length >= 2) {
      return allDomainGen.slice(0, 3);
    }
    // Fallback to diagnostic questions for this domain
    const fallbackDiag = diagnosticQuestions.filter((q) => q.domainId === course.domainId);
    return fallbackDiag.length > 0 ? fallbackDiag.slice(0, 3) : diagnosticQuestions.slice(0, 3);
  }, [generatedQuestions, diagnosticQuestions, course.domainId]);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    new Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Lesson catalog
  const modules = [
    {
      id: 1,
      title: "Module 1: Foundations & Statutory Framework",
      lessons: [
        { id: 1, title: "1.1 Core Principles & Official Statistical Standards", done: true },
        { id: 2, title: "1.2 Sampling Frames & Primary Administrative Units", done: true },
      ],
    },
    {
      id: 2,
      title: "Module 2: Practical Procedures & Microdata Architecture",
      lessons: [
        { id: 3, title: "2.1 Field Operations & CAPI Tablet Protocols", done: false },
        { id: 4, title: "2.2 Anonymization & DPDP Act 2023 Safeguards", done: false },
      ],
    },
    {
      id: 3,
      title: "Module 3: Advanced Analytical Applications",
      lessons: [
        { id: 5, title: "3.1 Microdata Transformation with Pandas & SQL", done: false },
        { id: 6, title: "3.2 Outlier Detection & Calibration Weights", done: false },
      ],
    },
  ];

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const handleQuickFill = () => {
    setUserAnswers(quizQuestions.map((q) => q.correct));
  };

  const handleSubmitQuiz = () => {
    const result = submitPracticeQuiz(course.domainId, userAnswers, quizQuestions, course.title);
    setSubmissionResult(result);
    setQuizSubmitted(true);
  };

  const handleSendAi = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiChat((prev) => [...prev, { sender: "user", text: userMsg }]);
    setAiInput("");

    setTimeout(() => {
      setAiChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `In ${course.title}, official guidelines emphasize rigorous documentation and compliance with MoSPI statistical directives. Remember to verify the FPC threshold and consult the relevant volume for formula proofs.`,
        },
      ]);
    }, 600);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: C.bg,
        fontFamily: FONT.body,
        position: "relative",
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          padding: "0 24px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            to={`/student/courses/${course.id}`}
            style={{
              color: C.muted,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ← Course Details
          </Link>
          <span style={{ color: C.border }}>|</span>
          <span
            style={{
              background: C.dark,
              color: "#FAF7F0",
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 4,
              fontFamily: FONT.mono,
            }}
          >
            {course.courseCode}
          </span>
          <span style={{ fontSize: 13, color: C.dark, fontWeight: 700 }}>
            {course.title}
          </span>
          {course.tpacEndorsed && (
            <span
              style={{
                background: "#E6F4EC",
                color: C.s1,
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              ★ NSSTA TPAC Endorsed
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              background: activeTab === "quiz" ? "#E6F4EC" : C.surfaceAlt,
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              color: activeTab === "quiz" ? C.s1 : C.muted,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{activeTab === "quiz" ? "🎯 Knowledge Check Mode" : "📖 Instructional Mode"}</span>
          </div>

          <button
            onClick={() => setShowAI(!showAI)}
            style={{
              padding: "6px 14px",
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: FONT.body,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🤖 AI Mentor
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: "flex", flex: 1, marginTop: 58 }}>
        {/* Left Sidebar: Syllabus & Quiz Selector */}
        <aside
          style={{
            width: 280,
            flexShrink: 0,
            background: C.surface,
            borderRight: `1px solid ${C.border}`,
            overflowY: "auto",
            height: "calc(100vh - 58px)",
            position: "sticky",
            top: 58,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              borderBottom: `1px solid ${C.border}`,
              background: C.surfaceAlt,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>
              FrAC Domain Remediation
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginTop: 2 }}>
              {courseDomain.name}
            </div>
            <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>
              Current Score: <strong>{courseDomain.currentScore}%</strong> / Target: {courseDomain.targetBenchmark}%
            </div>
          </div>

          {/* Module Navigation */}
          <div style={{ flex: 1, padding: "12px 0" }}>
            {modules.map((m) => (
              <div key={m.id} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    padding: "6px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    textTransform: "uppercase",
                  }}
                >
                  {m.title}
                </div>
                {m.lessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setActiveTab("lesson");
                      setActiveLessonId(l.id);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 18px",
                      background:
                        activeTab === "lesson" && activeLessonId === l.id
                          ? "#EBF5F0"
                          : "transparent",
                      border: "none",
                      borderLeft:
                        activeTab === "lesson" && activeLessonId === l.id
                          ? `3px solid ${C.s1}`
                          : "3px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: l.done ? C.s1 : "transparent",
                        border: `1.5px solid ${l.done ? C.s1 : C.border}`,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                    >
                      {l.done ? "✓" : ""}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: activeTab === "lesson" && activeLessonId === l.id ? C.dark : C.muted,
                        fontWeight: activeTab === "lesson" && activeLessonId === l.id ? 700 : 400,
                        lineHeight: 1.3,
                      }}
                    >
                      {l.title}
                    </span>
                  </button>
                ))}
              </div>
            ))}

            {/* Special Knowledge Check Milestone (Feature 6) */}
            <div style={{ padding: "0 14px", marginTop: 8 }}>
              <div
                onClick={() => setActiveTab("quiz")}
                style={{
                  background: activeTab === "quiz" ? "#FEF3C7" : C.surfaceAlt,
                  border: `1.5px solid ${activeTab === "quiz" ? C.accent : C.border}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: C.accent,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  🎯
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.dark }}>
                    Interactive Knowledge Check
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                    {quizQuestions.length} Cited MCQs • Evaluates Gap
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
          {/* TAB A: INSTRUCTIONAL LESSON VIEWER */}
          {activeTab === "lesson" && (
            <div style={{ maxWidth: 880 }}>
              {/* Media Player Showcase */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "#132B1D",
                  borderRadius: 14,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  position: "relative",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "14px solid transparent",
                      borderBottom: "14px solid transparent",
                      borderLeft: "24px solid #fff",
                      marginLeft: 4,
                    }}
                  />
                </div>
                <div style={{ color: "#FAF7F0", fontSize: 13, fontWeight: 600, marginTop: 12 }}>
                  NSSTA Official Lecture: {course.title}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 20,
                    right: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <span>04:15 / 28:00</span>
                  <span>National Statistical Systems Training Academy (NSSTA)</span>
                </div>
              </div>

              {/* Lesson Overview */}
              <h2
                style={{
                  fontFamily: FONT.display,
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.dark,
                  margin: "0 0 10px",
                }}
              >
                Lesson 1.2: Sampling Frames & Primary Administrative Units
              </h2>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
                In this module, civil statistical officers examine how primary sampling units (Census Villages and Urban Enumeration Blocks) are stratified according to the latest administrative updates. Correctly structuring the frame prevents coverage bias and satisfies NSSTA operational quality benchmarks.
              </p>

              {/* Key Concept Cards */}
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  marginBottom: 24,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 10 }}>
                  Statutory Principles & Guidelines
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    "Multi-Stage Stratified Sampling",
                    "Finite Population Correction (FPC)",
                    "DPDP Act 2023 Microdata Masking",
                    "HDOP <= 2.0 GPS Geo-tagging",
                    "Pandas Outlier Detection",
                  ].map((kw) => (
                    <span
                      key={kw}
                      style={{
                        background: C.surfaceAlt,
                        color: C.dark,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Banner to take Knowledge Check */}
              <div
                style={{
                  background: "#FEF3C7",
                  border: `1px solid ${C.accent}`,
                  borderRadius: 12,
                  padding: "18px 22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 28,
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>
                    Ready to bridge your competency gap?
                  </div>
                  <div style={{ fontSize: 12, color: "#78350F", marginTop: 2 }}>
                    Take the interactive knowledge check to re-evaluate your demonstrated score in {courseDomain.name}.
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("quiz")}
                  style={{
                    background: C.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px 20px",
                    fontFamily: FONT.body,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Take Knowledge Check 🎯
                </button>
              </div>

              {/* Personal Notes */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                  Learner Study Notes
                </div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record insights or questions for your mentor session..."
                  style={{
                    width: "100%",
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    color: C.dark,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB B: INTERACTIVE PRACTICE QUIZ & INSTANT EVALUATION (Core MVP Features 6 & 7b) */}
          {activeTab === "quiz" && (
            <div style={{ maxWidth: 880 }}>
              {/* Quiz Header Banner */}
              <div
                style={{
                  background: C.surface,
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  padding: "20px 24px",
                  marginBottom: 24,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        background: C.dark,
                        color: "#FAF7F0",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      FrAC Knowledge Check
                    </span>
                    <span
                      style={{
                        background: "#E6F4EC",
                        color: C.s1,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {courseDomain.name}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 20,
                      fontWeight: 700,
                      margin: 0,
                      color: C.dark,
                    }}
                  >
                    Competency Remediation Assessment
                  </h2>
                  <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>
                    Answer the multiple-choice questions directly synthesized from official MoSPI manuals. Submitting re-evaluates your competency gap in real time.
                  </p>
                </div>

                {!quizSubmitted && (
                  <button
                    onClick={handleQuickFill}
                    style={{
                      background: C.surfaceAlt,
                      color: C.dark,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: "8px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>⚡</span> Demo Quick-Fill
                  </button>
                )}
              </div>

              {/* POST-SUBMISSION INSTANT EVALUATION HERO (Feature 7b) */}
              {quizSubmitted && submissionResult && (
                <div
                  style={{
                    background: "#E6F4EC",
                    borderRadius: 14,
                    border: `1.5px solid ${C.s1}`,
                    padding: "24px 28px",
                    marginBottom: 28,
                    boxShadow: "0 4px 16px rgba(27,107,64,0.12)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: C.s1,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        🎉 Evaluation Verified
                      </div>
                      <h3
                        style={{
                          fontFamily: FONT.display,
                          fontSize: 24,
                          fontWeight: 700,
                          margin: "4px 0 6px",
                          color: C.dark,
                        }}
                      >
                        Remediation Check Passed: {submissionResult.score}% Mastery!
                      </h3>
                      <p style={{ fontSize: 13, color: C.dark, margin: 0, lineHeight: 1.5 }}>
                        You answered {submissionResult.correctAnswers} of {submissionResult.totalQuestions} questions correctly.
                      </p>
                    </div>

                    {/* Score Improvement Badge */}
                    <div
                      style={{
                        background: "#fff",
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        padding: "12px 18px",
                        textAlign: "center",
                        minWidth: 160,
                      }}
                    >
                      <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>
                        Domain Demonstrated Score
                      </div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          fontFamily: FONT.display,
                          color: C.s1,
                          marginTop: 2,
                        }}
                      >
                        {submissionResult.oldDomainScore}% → {submissionResult.newDomainScore}%
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.s1, marginTop: 2 }}>
                        +{submissionResult.deltaDomain} pts Growth 📈
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 12,
                      color: C.dark,
                      marginBottom: 18,
                    }}
                  >
                    <strong>Composite Skill Health Score Impact: </strong>
                    Increased from <strong>{submissionResult.oldSkillHealth}%</strong> to{" "}
                    <strong style={{ color: C.s1 }}>{submissionResult.newSkillHealth}%</strong> (
                    +{submissionResult.deltaSkillHealth} pts). This will be reflected on your{" "}
                    <strong>Dashboard</strong> and <strong>AI Gap Analysis</strong>.
                  </div>

                  {/* CTAs */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => navigate("/student/gap-analysis")}
                      style={{
                        background: C.s1,
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "9px 18px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      View Updated Gap Radar →
                    </button>
                    <button
                      onClick={() => navigate("/student/dashboard")}
                      style={{
                        background: C.dark,
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "9px 18px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Go to Dashboard 📊
                    </button>
                    <button
                      onClick={() => navigate("/student/learning-path")}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.s1}`,
                        color: C.s1,
                        borderRadius: 8,
                        padding: "9px 18px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Return to Learning Path
                    </button>
                  </div>
                </div>
              )}

              {/* Questions Stream */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {quizQuestions.map((q: any, qIdx: number) => {
                  const selectedOpt = userAnswers[qIdx];
                  const isCorrect = selectedOpt === q.correct;

                  return (
                    <div
                      key={q.id || qIdx}
                      style={{
                        background: C.surface,
                        borderRadius: 12,
                        border: `1px solid ${
                          quizSubmitted
                            ? isCorrect
                              ? C.s1 + "88"
                              : C.s4 + "88"
                            : C.border
                        }`,
                        padding: "20px 24px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                      }}
                    >
                      {/* Top Bar of question */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: C.accent,
                          }}
                        >
                          Question {qIdx + 1} of {quizQuestions.length}
                        </span>

                        {quizSubmitted && (
                          <span
                            style={{
                              background: isCorrect ? "#E6F4EC" : "#FEE2E2",
                              color: isCorrect ? C.s1 : "#991B1B",
                              padding: "2px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {isCorrect ? "✓ Correct" : "✕ Incorrect"}
                          </span>
                        )}
                      </div>

                      {/* Stem */}
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          lineHeight: 1.5,
                          color: C.dark,
                          marginBottom: 16,
                        }}
                      >
                        {q.text || q.question}
                      </div>

                      {/* Options */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                        {q.options.map((opt: string, optIdx: number) => {
                          const isSelected = selectedOpt === optIdx;
                          const isRightAnswer = optIdx === q.correct;

                          let bg = C.bg;
                          let border = C.border;
                          let textColor = C.dark;

                          if (quizSubmitted) {
                            if (isRightAnswer) {
                              bg = "#E6F4EC";
                              border = C.s1;
                              textColor = C.s1;
                            } else if (isSelected && !isRightAnswer) {
                              bg = "#FEE2E2";
                              border = "#991B1B";
                              textColor = "#991B1B";
                            }
                          } else if (isSelected) {
                            bg = "#FEF3C7";
                            border = C.accent;
                          }

                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleOptionSelect(qIdx, optIdx)}
                              style={{
                                background: bg,
                                border: `1px solid ${border}`,
                                borderRadius: 8,
                                padding: "12px 16px",
                                cursor: quizSubmitted ? "default" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                transition: "all 0.15s ease",
                              }}
                            >
                              <span
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: "50%",
                                  background: isSelected ? C.accent : C.border,
                                  color: isSelected ? "#fff" : C.muted,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  flexShrink: 0,
                                }}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span style={{ fontSize: 13, color: textColor, flex: 1 }}>{opt}</span>
                              {quizSubmitted && isRightAnswer && (
                                <span style={{ fontSize: 11, fontWeight: 700, color: C.s1 }}>
                                  Correct Option ✓
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Verifiable Citation & Rationale (Core MVP Feature 7b) */}
                      {quizSubmitted && (
                        <div style={{ marginTop: 14 }}>
                          {q.citation && (
                            <div
                              style={{
                                background: C.surfaceAlt,
                                borderRadius: 8,
                                padding: "10px 14px",
                                borderLeft: `3px solid ${C.accent}`,
                                fontSize: 12,
                                marginBottom: 8,
                              }}
                            >
                              <strong>📄 Verifiable Official Citation: </strong>
                              <span>{q.citation.documentName}</span> •{" "}
                              <span style={{ color: C.muted }}>{q.citation.chapter}</span> •{" "}
                              <strong style={{ color: C.accent }}>{q.citation.page}</strong>
                            </div>
                          )}

                          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                            <strong style={{ color: C.dark }}>Technical Rationale: </strong>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Quiz CTA */}
              {!quizSubmitted && (
                <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <button
                    onClick={() => setActiveTab("lesson")}
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: "10px 20px",
                      fontSize: 13,
                      fontFamily: FONT.body,
                      color: C.muted,
                      cursor: "pointer",
                    }}
                  >
                    Back to Lessons
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={userAnswers.some((a) => a === null)}
                    style={{
                      background: userAnswers.some((a) => a === null) ? C.border : C.s1,
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 24px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: userAnswers.some((a) => a === null) ? "not-allowed" : "pointer",
                    }}
                  >
                    Submit Knowledge Check 🎯
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floating AI Mentor Panel */}
      {showAI && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 340,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxHeight: 460,
          }}
        >
          <div
            style={{
              background: C.dark,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ color: "#FAF7F0", fontWeight: 700, fontSize: 13 }}>
              🤖 MoSPI AI Learning Mentor
            </div>
            <button
              onClick={() => setShowAI(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: "14px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxHeight: 280,
            }}
          >
            {aiChat.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  background: m.sender === "user" ? C.dark : C.surfaceAlt,
                  color: m.sender === "user" ? "#FAF7F0" : C.dark,
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  maxWidth: "85%",
                  lineHeight: 1.4,
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              gap: 8,
              background: C.bg,
            }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendAi()}
              style={{
                flex: 1,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 12,
                outline: "none",
                fontFamily: FONT.body,
              }}
            />
            <button
              onClick={handleSendAi}
              style={{
                background: C.accent,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
