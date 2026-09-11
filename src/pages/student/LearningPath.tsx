import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { C, FONT } from "@/tokens";
import { useAuth } from "@/context/AuthContext";
import { useCompetency } from "@/context/CompetencyContext";
import { getCoursesByTitlesOrIds, type IGOTCatalogCourse } from "@/services/karmayogiCoursesService";
import {
  generateProceduralRoadmapForCourse,
  generateAIRoadmapForCourse,
  generatePersonalizedLearningPathRAG,
  askRoadmapAITutor,
  type RoadmapCourseBlock,
  type FullCourseRoadmapData,
} from "@/services/aiRoadmapService";

const ROADMAP_PROGRESS_KEY = "gyanmarg_roadmap_progress_v2";

export default function LearningPath() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { getSkillHealthScore, getGapMetrics } = useCompetency();

  const skillHealth = getSkillHealthScore();

  // Resolve user's selected courses
  const selectedCourseIds = useMemo(() => {
    return (profile?.interestedCourses || []).map(String);
  }, [profile?.interestedCourses]);

  const userSelectedCourses: IGOTCatalogCourse[] = useMemo(() => {
    return getCoursesByTitlesOrIds(selectedCourseIds);
  }, [selectedCourseIds]);

  // Active course filter (or "all")
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Store roadmap data per course
  const [roadmapsByCourse, setRoadmapsByCourse] = useState<Record<string, FullCourseRoadmapData>>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiFocusPrompt, setAiFocusPrompt] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);

  // Selected node for inspector drawer
  const [inspectedBlock, setInspectedBlock] = useState<RoadmapCourseBlock | null>(null);

  // Node completion status overrides stored in state & localStorage
  const [blockStatuses, setBlockStatuses] = useState<Record<string, "todo" | "learning" | "done" | "skip">>(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_PROGRESS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // AI Tutor floating bar state
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiTutorAnswer, setAiTutorAnswer] = useState<string | null>(null);
  const [isAskingTutor, setIsAskingTutor] = useState(false);

  // Initialize roadmaps for selected courses
  useEffect(() => {
    if (userSelectedCourses.length === 0) return;

    setRoadmapsByCourse((prev) => {
      const updated = { ...prev };
      userSelectedCourses.forEach((c) => {
        const id = String(c.id);
        if (!updated[id]) {
          updated[id] = generateProceduralRoadmapForCourse(c);
        }
      });
      return updated;
    });
  }, [userSelectedCourses]);

  // Persist block status overrides
  const setBlockStatus = (blockId: string, status: "todo" | "learning" | "done" | "skip") => {
    setBlockStatuses((prev) => {
      const updated = { ...prev, [blockId]: status };
      try {
        localStorage.setItem(ROADMAP_PROGRESS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to persist roadmap status:", err);
      }
      return updated;
    });
  };

  // AI Roadmap Generation (Inherently grounded in Course Database & RAG)
  const handleRegenerateWithAI = async () => {
    setIsGeneratingAI(true);
    setShowAiModal(false);

    try {
      if (selectedCourseFilter === "all" || userSelectedCourses.length === 0) {
        const gapMetrics = getGapMetrics ? getGapMetrics() : [];
        const topGaps = gapMetrics.filter((g) => g.gap > 10).map((g) => g.domain);
        const ragPath = await generatePersonalizedLearningPathRAG(
          {
            goal: aiFocusPrompt || profile?.track || "Civil Service Capacity Building",
            track: profile?.track,
            knowledgeGaps: topGaps,
            selectedDomains: profile?.interestedDomains,
            selectedSubDomains: profile?.interestedSubDomains,
          },
          aiFocusPrompt
        );

        setRoadmapsByCourse((prev) => ({
          ...prev,
          all: ragPath,
        }));
        setSelectedCourseFilter("all");
      } else {
        const targetCourse =
          userSelectedCourses.find((c) => String(c.id) === selectedCourseFilter) || userSelectedCourses[0];

        const newRoadmap = await generateAIRoadmapForCourse(targetCourse, aiFocusPrompt);

        setRoadmapsByCourse((prev) => ({
          ...prev,
          [String(targetCourse.id)]: newRoadmap,
        }));
      }
    } catch (err) {
      console.warn("Failed AI generation:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Ask AI Tutor
  const handleAskAITutor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAskingTutor(true);
    setAiTutorAnswer(null);

    try {
      const activeBlock = inspectedBlock || displayedBlocks[0];
      const ans = await askRoadmapAITutor({
        question: aiQuestion,
        blockTitle: activeBlock?.blockTitle,
        courseTitle: activeBlock?.courseTitle,
        domain: activeBlock?.domain,
      });
      setAiTutorAnswer(ans);
    } catch {
      setAiTutorAnswer("Focus on the official guidelines, statutory standards, and complete the lesson quiz.");
    } finally {
      setIsAskingTutor(false);
    }
  };

  // Filtered displayed blocks
  const displayedBlocks: RoadmapCourseBlock[] = useMemo(() => {
    let list: RoadmapCourseBlock[] = [];

    if (selectedCourseFilter === "all") {
      userSelectedCourses.forEach((c) => {
        const r = roadmapsByCourse[String(c.id)];
        if (r && r.blocks) {
          list.push(...r.blocks);
        }
      });
    } else {
      const r = roadmapsByCourse[selectedCourseFilter];
      if (r && r.blocks) {
        list = [...r.blocks];
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.blockTitle.toLowerCase().includes(q) ||
          b.courseTitle.toLowerCase().includes(q) ||
          b.domain.toLowerCase().includes(q) ||
          b.leftBranches.some((br) => br.items.some((it) => it.title.toLowerCase().includes(q))) ||
          b.rightBranches.some((br) => br.items.some((it) => it.title.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [userSelectedCourses, roadmapsByCourse, selectedCourseFilter, searchQuery]);

  // Overall Roadmap stats
  const totalBlocks = displayedBlocks.length;
  const doneCount = displayedBlocks.filter((b) => (blockStatuses[b.id] || b.status) === "done").length;
  const learningCount = displayedBlocks.filter((b) => (blockStatuses[b.id] || b.status) === "learning").length;
  const progressPct = totalBlocks > 0 ? Math.round((doneCount / totalBlocks) * 100) : 0;

  return (
    <div
      style={{
        background: "#F9F8F5", // Clean warm roadmap.sh canvas
        minHeight: "100vh",
        padding: "24px 32px 100px",
        fontFamily: FONT.body,
        color: "#111",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto 28px",
          background: "#FFFFFF",
          border: "2px solid #111111",
          borderRadius: 12,
          padding: "20px 24px",
          boxShadow: "0 3px 0 #111111",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  background: "#FFE066",
                  color: "#111",
                  border: "1.5px solid #111",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                iGOT Curriculum Roadmap
              </span>
              <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>
                {userSelectedCourses.length} Enrolled Courses · {totalBlocks} Topic Blocks
              </span>
            </div>
            <h1 style={{ margin: "4px 0 6px", fontSize: 24, fontWeight: 800, fontFamily: FONT.display, color: "#111" }}>
              {selectedCourseFilter === "all"
                ? "Unified Capacity-Building Learning Path"
                : userSelectedCourses.find((c) => String(c.id) === selectedCourseFilter)?.title || "Course Roadmap"}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
              Structured, step-by-step block hierarchy divided into practical modules, sub-concepts, and statutory milestones.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowAiModal(true)}
              style={{
                background: "#FFE066",
                color: "#111",
                border: "2px solid #111",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 0 #111",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>✨</span>
              <span>{isGeneratingAI ? "AI Generating..." : "AI Enhance Roadmap"}</span>
            </button>

            <Link
              to="/student/interested-courses"
              style={{
                background: "#fff",
                color: "#111",
                border: "2px solid #111",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 0 #111",
              }}
            >
              Modify Courses ({userSelectedCourses.length})
            </Link>
          </div>
        </div>

        {/* Course Filter Tabs & Search Bar */}
        <div
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTop: "1.5px dashed #CCC",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Scrollable course pills */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", maxWidth: "70%", paddingBottom: 4 }}>
            <button
              onClick={() => setSelectedCourseFilter("all")}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: "1.5px solid #111",
                background: selectedCourseFilter === "all" ? "#111" : "#fff",
                color: selectedCourseFilter === "all" ? "#FFE066" : "#111",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              All Courses ({userSelectedCourses.length})
            </button>

            {userSelectedCourses.map((c) => {
              const active = selectedCourseFilter === String(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseFilter(String(c.id))}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 20,
                    border: "1.5px solid #111",
                    background: active ? "#FFE066" : "#fff",
                    color: "#111",
                    fontSize: 12,
                    fontWeight: active ? 700 : 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.title.length > 25 ? c.title.slice(0, 24) + "…" : c.title}
                </button>
              );
            })}
          </div>

          {/* Search filter */}
          <div style={{ position: "relative", minWidth: 200 }}>
            <input
              type="text"
              placeholder="Search blocks or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 12px 6px 28px",
                borderRadius: 6,
                border: "1.5px solid #111",
                fontSize: 12,
                fontFamily: FONT.body,
                outline: "none",
                background: "#FAF9F6",
              }}
            />
            <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}>
              🔍
            </span>
          </div>
        </div>

        {/* Progress Bar & Status Legend */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#333" }}>Roadmap Mastery: {progressPct}%</span>
            <div style={{ width: 140, height: 8, background: "#E5E5E5", borderRadius: 4, overflow: "hidden", border: "1px solid #111" }}>
              <div style={{ width: `${progressPct}%`, height: "100%", background: "#40C057", transition: "width 0.3s ease" }} />
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 14, fontSize: 11.5, fontWeight: 600, color: "#444" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "#FFE066", border: "1.5px solid #111" }} />
              Current Learning
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "#D3F9D8", border: "1.5px solid #111" }} />
              Completed
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "#FFF9DB", border: "1.5px solid #111" }} />
              Sub-Topic
            </span>
          </div>
        </div>
      </div>

      {/* Main Roadmap Tree Canvas */}
      {displayedBlocks.length === 0 ? (
        <div
          style={{
            maxWidth: 600,
            margin: "60px auto",
            background: "#fff",
            border: "2px solid #111",
            borderRadius: 12,
            padding: "36px",
            textAlign: "center",
            boxShadow: "0 3px 0 #111",
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 12 }}>🗺️</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>No Selected Courses Found</h3>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>
            Select courses from the 5,400+ iGOT Karmayogi catalog or use the AI Recommender to generate your interactive roadmap.
          </p>
          <Link
            to="/student/interested-courses"
            style={{
              padding: "10px 22px",
              background: "#FFE066",
              color: "#111",
              border: "2px solid #111",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 13.5,
              textDecoration: "none",
              boxShadow: "0 2px 0 #111",
            }}
          >
            Select Courses & Generate Path →
          </Link>
        </div>
      ) : (
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            position: "relative",
            padding: "20px 0 60px",
          }}
        >
          {/* Continuous Central Spine Vertical Line */}
          <div
            style={{
              position: "absolute",
              top: 40,
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              width: 3,
              background: "#111111",
              zIndex: 0,
            }}
          />

          {/* Sequential Blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 54, position: "relative", zIndex: 1 }}>
            {displayedBlocks.map((block, index) => {
              const currentStatus = blockStatuses[block.id] || block.status;
              const isLearning = currentStatus === "learning";
              const isDone = currentStatus === "done";
              const isSkip = currentStatus === "skip";

              // Color tokens matching roadmap.sh
              let blockBg = "#FFFDF0";
              if (isLearning) blockBg = "#FFE066"; // Roadmap yellow
              if (isDone) blockBg = "#D3F9D8"; // Soft green
              if (isSkip) blockBg = "#F1F3F5";

              return (
                <div key={block.id} style={{ position: "relative" }}>
                  {/* Grid row: Left branches | Center Milestone Block | Right branches */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto 1fr",
                      alignItems: "center",
                      gap: 0,
                    }}
                  >
                    {/* LEFT BRANCH (Sub-blocks) */}
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                      {block.leftBranches.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", maxWidth: 330 }}>
                          {/* Sub-blocks card */}
                          <div
                            style={{
                              background: "#FFF9DB",
                              border: "2px solid #111",
                              borderRadius: 8,
                              padding: "10px 14px",
                              boxShadow: "0 2px 0 #111",
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                              textAlign: "right",
                            }}
                          >
                            {block.leftBranches[0].title && (
                              <div
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 800,
                                  color: "#777",
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                }}
                              >
                                {block.leftBranches[0].title}
                              </div>
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {block.leftBranches[0].items.map((it) => (
                                <div
                                  key={it.id}
                                  onClick={() => setInspectedBlock(block)}
                                  style={{
                                    background: "#FFFFFF",
                                    border: "1.5px solid #111",
                                    borderRadius: 6,
                                    padding: "5px 10px",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#111",
                                    cursor: "pointer",
                                    boxShadow: "0 1px 0 #111",
                                    transition: "transform 0.1s ease",
                                  }}
                                >
                                  {it.title}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Dotted horizontal connector line from left card to center block */}
                          <div
                            style={{
                              width: 38,
                              height: 0,
                              borderTop: "2px dashed #111",
                              marginRight: -1,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* CENTER MILESTONE BLOCK (Main Spine Box) */}
                    <div
                      style={{
                        width: 290,
                        margin: "0 14px",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {/* Top connector dot */}
                      {index > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: -14,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#111",
                          }}
                        />
                      )}

                      {/* The Main Block Card */}
                      <div
                        style={{
                          background: blockBg,
                          border: "2px solid #111",
                          borderRadius: 8,
                          padding: "14px 16px",
                          boxShadow: isLearning ? "0 4px 0 #111" : "0 3px 0 #111",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          position: "relative",
                        }}
                      >
                        {/* Course badge if showing all courses */}
                        {selectedCourseFilter === "all" && (
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#666",
                              marginBottom: 4,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {block.courseTitle}
                          </div>
                        )}

                        <div
                          style={{
                            fontFamily: FONT.display,
                            fontSize: 15,
                            fontWeight: 800,
                            color: "#111",
                            lineHeight: 1.3,
                          }}
                        >
                          {block.blockTitle}
                        </div>

                        {/* Interactive Status Pills (Roadmap.sh signature) */}
                        <div
                          style={{
                            marginTop: 10,
                            paddingTop: 8,
                            borderTop: "1.5px dashed rgba(0,0,0,0.15)",
                            display: "flex",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBlockStatus(block.id, "learning");
                            }}
                            title="Mark as In Progress"
                            style={{
                              padding: "3px 8px",
                              borderRadius: 4,
                              border: "1.5px solid #111",
                              background: isLearning ? "#111" : "#fff",
                              color: isLearning ? "#FFE066" : "#111",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            📖 Learning
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBlockStatus(block.id, "done");
                            }}
                            title="Mark as Done"
                            style={{
                              padding: "3px 8px",
                              borderRadius: 4,
                              border: "1.5px solid #111",
                              background: isDone ? "#2B8A3E" : "#fff",
                              color: isDone ? "#fff" : "#111",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ✓ Done
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBlockStatus(block.id, "skip");
                            }}
                            title="Skip this module"
                            style={{
                              padding: "3px 8px",
                              borderRadius: 4,
                              border: "1.5px solid #111",
                              background: isSkip ? "#868E96" : "#fff",
                              color: isSkip ? "#fff" : "#666",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ✕ Skip
                          </button>
                        </div>
                      </div>

                      {/* Bottom connector indicator arrow */}
                      {index < displayedBlocks.length - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -18,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "5px solid transparent",
                            borderRight: "5px solid transparent",
                            borderTop: "7px solid #111",
                          }}
                        />
                      )}
                    </div>

                    {/* RIGHT BRANCH (Sub-blocks) */}
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                      {block.rightBranches.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", maxWidth: 330 }}>
                          {/* Dotted horizontal connector line from center block to right card */}
                          <div
                            style={{
                              width: 38,
                              height: 0,
                              borderTop: "2px dashed #111",
                              marginLeft: -1,
                            }}
                          />

                          {/* Sub-blocks card */}
                          <div
                            style={{
                              background: "#FFF9DB",
                              border: "2px solid #111",
                              borderRadius: 8,
                              padding: "10px 14px",
                              boxShadow: "0 2px 0 #111",
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                              textAlign: "left",
                            }}
                          >
                            {block.rightBranches[0].title && (
                              <div
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 800,
                                  color: "#777",
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                }}
                              >
                                {block.rightBranches[0].title}
                              </div>
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {block.rightBranches[0].items.map((it) => (
                                <div
                                  key={it.id}
                                  onClick={() => setInspectedBlock(block)}
                                  style={{
                                    background: "#FFFFFF",
                                    border: "1.5px solid #111",
                                    borderRadius: 6,
                                    padding: "5px 10px",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#111",
                                    cursor: "pointer",
                                    boxShadow: "0 1px 0 #111",
                                    transition: "transform 0.1s ease",
                                  }}
                                >
                                  {it.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM AI TUTOR BAR (Exact style of roadmap.sh reference screenshot) */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          width: "90%",
          maxWidth: 640,
        }}
      >
        <form
          onSubmit={handleAskAITutor}
          style={{
            background: "#111111",
            color: "#fff",
            border: "2px solid #333",
            borderRadius: 30,
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              background: "#FFE066",
              color: "#111",
              fontWeight: 800,
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            <span>🤖</span>
            <span>AI Tutor</span>
          </div>

          <input
            type="text"
            placeholder="Have a question about this roadmap? Type here..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontFamily: FONT.body,
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={isAskingTutor || !aiQuestion.trim()}
            style={{
              background: aiQuestion.trim() ? "#FFE066" : "#444",
              color: "#111",
              border: "none",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: aiQuestion.trim() ? "pointer" : "default",
              transition: "all 0.2s ease",
            }}
          >
            {isAskingTutor ? "Thinking..." : "Ask AI →"}
          </button>
        </form>

        {/* AI Answer Bubble */}
        {aiTutorAnswer && (
          <div
            style={{
              marginTop: 10,
              background: "#FFFFFF",
              border: "2px solid #111",
              borderRadius: 12,
              padding: "14px 18px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", gap: 6 }}>
                <span>💡</span>
                <span>GyanMarg AI Tutor Response</span>
              </div>
              <button
                onClick={() => setAiTutorAnswer(null)}
                style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#888" }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: 13, color: "#222", lineHeight: 1.55 }}>
              {aiTutorAnswer}
            </div>
          </div>
        )}
      </div>

      {/* NODE INSPECTOR DRAWER / MODAL */}
      {inspectedBlock && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 110,
          }}
          onClick={() => setInspectedBlock(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 460,
              background: "#FFFFFF",
              height: "100%",
              padding: "28px 28px",
              boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span
                  style={{
                    background: "#FFE066",
                    color: "#111",
                    border: "1.5px solid #111",
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  Block #{inspectedBlock.blockNumber} · {inspectedBlock.importance}
                </span>
                <button
                  onClick={() => setInspectedBlock(null)}
                  style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#555" }}
                >
                  ✕
                </button>
              </div>

              <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, fontFamily: FONT.display, color: "#111" }}>
                {inspectedBlock.blockTitle}
              </h2>
              <div style={{ fontSize: 12.5, color: "#666", marginBottom: 16 }}>
                {inspectedBlock.courseTitle} · {inspectedBlock.domain}
              </div>

              <p style={{ fontSize: 13.5, color: "#333", lineHeight: 1.55, marginBottom: 20 }}>
                {inspectedBlock.shortDesc}
              </p>

              {/* Learning Outcomes */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111", textTransform: "uppercase", marginBottom: 8 }}>
                  Key Learning Competencies
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {inspectedBlock.learningOutcomes.map((out, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#444" }}>
                      <span style={{ color: "#2B8A3E", fontWeight: 700 }}>✓</span>
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-Topics & Concepts Breakdown */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111", textTransform: "uppercase", marginBottom: 8 }}>
                  Curriculum Concepts
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    ...inspectedBlock.leftBranches.flatMap((b) => b.items),
                    ...inspectedBlock.rightBranches.flatMap((b) => b.items),
                  ].map((it) => (
                    <span
                      key={it.id}
                      style={{
                        padding: "5px 10px",
                        background: "#FFF9DB",
                        border: "1.5px solid #111",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#111",
                      }}
                    >
                      {it.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ borderTop: "1.5px solid #EEE", paddingTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => navigate(`/student/courses/${inspectedBlock.courseId}/learn`)}
                style={{
                  width: "100%",
                  padding: "11px 0",
                  background: "#FFE066",
                  color: "#111",
                  border: "2px solid #111",
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 2px 0 #111",
                }}
              >
                Launch Course Module in Player →
              </button>

              <button
                onClick={() => {
                  setAiQuestion(`Explain the key concepts of ${inspectedBlock.blockTitle}`);
                  setInspectedBlock(null);
                }}
                style={{
                  width: "100%",
                  padding: "9px 0",
                  background: "#FFFFFF",
                  color: "#111",
                  border: "1.5px solid #111",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Ask AI Tutor About This Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI ROADMAP RE-GENERATION MODAL */}
      {showAiModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 120,
            padding: 20,
          }}
          onClick={() => setShowAiModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              background: "#FFFFFF",
              border: "2.5px solid #111",
              borderRadius: 14,
              padding: "26px",
              boxShadow: "0 8px 0 #111",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>✨</span>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, fontFamily: FONT.display, color: "#111" }}>
                  AI Learning Path Generator
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
              Our Groq AI engine will analyze your selected course and decompose it into a customized, pedagogical block diagram with practical branch topics.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#222", marginBottom: 6 }}>
                Target Learning Focus or Specialization (Optional):
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Focus on practical procurement compliance, real-world case studies, and fast-track execution..."
                value={aiFocusPrompt}
                onChange={(e) => setAiFocusPrompt(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid #111",
                  fontSize: 13,
                  fontFamily: FONT.body,
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAiModal(false)}
                style={{
                  padding: "8px 16px",
                  background: "#fff",
                  border: "1.5px solid #111",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRegenerateWithAI()}
                disabled={isGeneratingAI}
                style={{
                  padding: "10px 22px",
                  background: "#FFE066",
                  color: "#111",
                  border: "2px solid #111",
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: 13.5,
                  cursor: isGeneratingAI ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 0 #111",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>✨</span>
                <span>{isGeneratingAI ? "Synthesizing AI Roadmap..." : "Generate AI Roadmap →"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
