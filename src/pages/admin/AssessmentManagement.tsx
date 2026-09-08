import { useState } from "react";
import { C, FONT } from "@/tokens";
import { useCompetency, IngestedDocument, AIGeneratedMCQ } from "@/context/CompetencyContext";

export default function AssessmentManagement() {
  const {
    ingestedDocuments,
    generatedQuestions,
    uploadDocument,
    generateMCQsFromDoc,
    approveQuestion,
    rejectQuestion,
    editQuestion,
    domains,
  } = useCompetency();

  const [activeTab, setActiveTab] = useState<"ingest" | "generator" | "hitl" | "bank">("hitl");

  // Filter state for HITL
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state for Question Bank
  const [bankSearch, setBankSearch] = useState("");
  const [bankDomain, setBankDomain] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Ingest Document Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFormData, setUploadFormData] = useState({
    name: "",
    format: "pdf" as "pdf" | "docx" | "doc",
    fileSize: "5.4 MB",
    pagesCount: 88,
    chaptersCount: 5,
    domainId: "stats",
    tocInput: "Ch 1: Introduction\nCh 2: Sampling Framework\nCh 3: Estimation Procedures\nCh 4: Variance Estimation\nCh 5: Appendices",
  });

  // Table of Contents viewer drawer
  const [viewingDocToc, setViewingDocToc] = useState<IngestedDocument | null>(null);

  // AI Generator state
  const [selectedDocForGen, setSelectedDocForGen] = useState<string>(
    ingestedDocuments[0]?.id || "doc_mospi_sample_v4"
  );
  const [genCount, setGenCount] = useState<number>(2);
  const [genDifficulty, setGenDifficulty] = useState<string>("Intermediate Operational");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStepText, setGenStepText] = useState("");
  const [justGenerated, setJustGenerated] = useState<AIGeneratedMCQ[]>([]);

  // Question Editing Modal state
  const [editingQuestion, setEditingQuestion] = useState<AIGeneratedMCQ | null>(null);
  const [editFormData, setEditFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    explanation: "",
    citationDoc: "",
    citationChapter: "",
    citationPage: "",
  });

  // Derived counts
  const pendingCount = generatedQuestions.filter((q) => q.status === "pending").length;
  const approvedCount = generatedQuestions.filter((q) => q.status === "approved").length;
  const rejectedCount = generatedQuestions.filter((q) => q.status === "rejected").length;

  // Filtered questions for HITL
  const filteredQuestions = generatedQuestions.filter((q) => {
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    const matchDomain = domainFilter === "all" || q.domainId === domainFilter;
    const matchSearch =
      searchQuery.trim() === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.citation.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.citation.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchDomain && matchSearch;
  });

  // Filtered questions for published bank
  const publishedQuestions = generatedQuestions.filter((q) => {
    const isApproved = q.status === "approved";
    const matchDomain = bankDomain === "all" || q.domainId === bankDomain;
    const matchSearch =
      bankSearch.trim() === "" ||
      q.question.toLowerCase().includes(bankSearch.toLowerCase()) ||
      q.citation.documentName.toLowerCase().includes(bankSearch.toLowerCase()) ||
      q.citation.chapter.toLowerCase().includes(bankSearch.toLowerCase());
    return isApproved && matchDomain && matchSearch;
  });

  // Question Bank Export to CSV
  const handleExportBankCSV = () => {
    const header = "ID,Domain,Question,Option A,Option B,Option C,Option D,Correct Option,Document,Chapter,Page,Explanation\n";
    const rows = publishedQuestions
      .map((q) => {
        const optA = `"${(q.options[0] || "").replace(/"/g, '""')}"`;
        const optB = `"${(q.options[1] || "").replace(/"/g, '""')}"`;
        const optC = `"${(q.options[2] || "").replace(/"/g, '""')}"`;
        const optD = `"${(q.options[3] || "").replace(/"/g, '""')}"`;
        const correctOpt = `"${(q.options[q.correct] || "").replace(/"/g, '""')}"`;
        const qText = `"${q.question.replace(/"/g, '""')}"`;
        const doc = `"${q.citation.documentName.replace(/"/g, '""')}"`;
        const ch = `"${q.citation.chapter.replace(/"/g, '""')}"`;
        const pg = `"${q.citation.page.replace(/"/g, '""')}"`;
        const expl = `"${q.explanation.replace(/"/g, '""')}"`;
        return `"${q.id}","${q.domain}",${qText},${optA},${optB},${optC},${optD},${correctOpt},${doc},${ch},${pg},${expl}`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mospi_published_questions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${publishedQuestions.length} published questions to CSV.`);
  };

  // Recall Question from Published Bank
  const handleRecallQuestion = (qId: string) => {
    rejectQuestion(qId);
    showToast("Question recalled from published bank and staged for HITL curation.");
  };

  // Handle document upload simulation
  const handleStartUpload = () => {
    if (!uploadFormData.name.trim()) return;
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 20;
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            const targetDomain = domains.find((d) => d.id === uploadFormData.domainId);
            const tocLines = uploadFormData.tocInput
              .split("\n")
              .map((l) => l.trim())
              .filter((l) => l.length > 0);

            uploadDocument({
              name: uploadFormData.name,
              format: uploadFormData.format,
              fileSize: uploadFormData.fileSize,
              pagesCount: Number(uploadFormData.pagesCount) || 50,
              chaptersCount: tocLines.length || 4,
              domainId: uploadFormData.domainId,
              domain: targetDomain ? targetDomain.name : "Applied Statistics",
              tableOfContents: tocLines,
            });

            setUploadProgress(null);
            setShowUploadModal(false);
            setUploadFormData({
              name: "",
              format: "pdf",
              fileSize: "5.4 MB",
              pagesCount: 88,
              chaptersCount: 5,
              domainId: "stats",
              tocInput: "Ch 1: Introduction\nCh 2: Sampling Framework\nCh 3: Estimation Procedures\nCh 4: Variance Estimation\nCh 5: Appendices",
            });
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 250);
  };

  // Handle AI Question Generation trigger
  const handleTriggerAIGeneration = () => {
    setIsGenerating(true);
    setJustGenerated([]);
    setGenStepText("1/3: Reading ingested document semantic structure...");

    setTimeout(() => {
      setGenStepText("2/3: Formulating domain test stems and distractors...");
      setTimeout(() => {
        setGenStepText("3/3: Attaching verifiable verbatim page citations...");
        setTimeout(() => {
          const generated = generateMCQsFromDoc(selectedDocForGen, genCount);
          setJustGenerated(generated);
          setIsGenerating(false);
          setGenStepText("");
        }, 600);
      }, 700);
    }, 600);
  };

  // Open Edit Modal
  const handleOpenEdit = (q: AIGeneratedMCQ) => {
    setEditingQuestion(q);
    setEditFormData({
      question: q.question,
      options: [...q.options],
      correct: q.correct,
      explanation: q.explanation,
      citationDoc: q.citation.documentName,
      citationChapter: q.citation.chapter,
      citationPage: q.citation.page,
    });
  };

  // Save Edit
  const handleSaveEdit = () => {
    if (!editingQuestion) return;
    editQuestion(editingQuestion.id, {
      question: editFormData.question,
      options: editFormData.options,
      correct: editFormData.correct,
      explanation: editFormData.explanation,
      citation: {
        documentName: editFormData.citationDoc,
        chapter: editFormData.citationChapter,
        page: editFormData.citationPage,
      },
    });
    setEditingQuestion(null);
  };

  // Approve all pending
  const handleApproveAllPending = () => {
    filteredQuestions.forEach((q) => {
      if (q.status === "pending") {
        approveQuestion(q.id);
      }
    });
  };

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, paddingBottom: 48 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span
              style={{
                background: C.dark,
                color: "#FAF7F0",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 20,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              MoSPI Administrator Suite
            </span>
            <span
              style={{
                background: "#E6F4EC",
                color: C.s1,
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              FrAC Competency Hub
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT.display,
              fontSize: 26,
              fontWeight: 700,
              margin: 0,
              color: C.dark,
            }}
          >
            Assessment & Material Curation Engine
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: C.muted, maxWidth: 640 }}>
            Upload official MoSPI manuals (PDF/DOC), synthesize AI assessment MCQs directly with verifiable page citations, and execute Human-In-The-Loop (HITL) quality reviews before publication.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              background: C.surface,
              color: C.dark,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "10px 18px",
              fontFamily: FONT.body,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <span>📄</span> Upload Learning Material
          </button>
          <button
            onClick={() => {
              setActiveTab("generator");
            }}
            style={{
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontFamily: FONT.body,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 2px 8px rgba(198,133,27,0.25)",
            }}
          >
            <span>✨</span> AI Question Synthesizer
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: C.surface,
            borderRadius: 12,
            padding: "18px 20px",
            border: `1px solid ${C.border}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Ingested Manuals & SOPs</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: FONT.display,
              color: C.dark,
              marginTop: 4,
            }}
          >
            {ingestedDocuments.length} Documents
          </div>
          <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>
            PDF & DOCX microdata formats parsed
          </div>
        </div>

        <div
          style={{
            background: C.surface,
            borderRadius: 12,
            padding: "18px 20px",
            border: `1px solid ${C.border}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
            borderLeft: `4px solid ${C.accent}`,
          }}
        >
          <div style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>Awaiting HITL Review</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: FONT.display,
              color: C.accent,
              marginTop: 4,
            }}
          >
            {pendingCount} MCQs
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
            Generated from official source text
          </div>
        </div>

        <div
          style={{
            background: C.surface,
            borderRadius: 12,
            padding: "18px 20px",
            border: `1px solid ${C.border}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
            borderLeft: `4px solid ${C.s1}`,
          }}
        >
          <div style={{ fontSize: 12, color: C.s1, fontWeight: 700 }}>Approved & Published</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: FONT.display,
              color: C.s1,
              marginTop: 4,
            }}
          >
            {approvedCount} Questions
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
            Available in Learner Diagnostic Engine
          </div>
        </div>

        <div
          style={{
            background: C.surface,
            borderRadius: 12,
            padding: "18px 20px",
            border: `1px solid ${C.border}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Verifiable Citation Rate</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: FONT.display,
              color: C.dark,
              marginTop: 4,
            }}
          >
            100%
          </div>
          <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>
            All questions cite doc, chapter & page
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${C.border}`,
          marginBottom: 24,
          gap: 8,
        }}
      >
        {[
          { id: "hitl", label: `✍️ HITL Review & Curation (${pendingCount} pending)` },
          { id: "ingest", label: `📑 Document Ingestion Workstation (${ingestedDocuments.length})` },
          { id: "generator", label: "🤖 AI Question Synthesizer" },
          { id: "bank", label: `🏛️ Published Question Bank (${approvedCount})` },
        ].map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: isActive ? `3px solid ${C.accent}` : "3px solid transparent",
                padding: "12px 18px",
                fontFamily: FONT.body,
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? C.dark : C.muted,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: HITL REVIEW & CURATION */}
      {activeTab === "hitl" && (
        <div>
          {/* Controls Bar */}
          <div
            style={{
              background: C.surface,
              borderRadius: 12,
              padding: "16px 20px",
              border: `1px solid ${C.border}`,
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            {/* Status pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { id: "pending", label: `Pending Review (${pendingCount})` },
                { id: "approved", label: `Approved (${approvedCount})` },
                { id: "rejected", label: `Rejected (${rejectedCount})` },
                { id: "all", label: `All Questions (${generatedQuestions.length})` },
              ].map((pill) => {
                const isSelected = statusFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setStatusFilter(pill.id as any)}
                    style={{
                      background: isSelected ? C.dark : C.surfaceAlt,
                      color: isSelected ? "#fff" : C.muted,
                      border: "none",
                      borderRadius: 20,
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Right filter & batch actions */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 12,
                  fontFamily: FONT.body,
                  color: C.dark,
                  outline: "none",
                }}
              >
                <option value="all">All FrAC Domains</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search stem or citation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 12,
                  fontFamily: FONT.body,
                  color: C.dark,
                  width: 200,
                  outline: "none",
                }}
              />

              {statusFilter === "pending" && pendingCount > 0 && (
                <button
                  onClick={handleApproveAllPending}
                  style={{
                    background: C.s1,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✓ Approve All Pending
                </button>
              )}
            </div>
          </div>

          {/* Questions Stream */}
          {filteredQuestions.length === 0 ? (
            <div
              style={{
                background: C.surface,
                borderRadius: 12,
                padding: "48px 24px",
                textAlign: "center",
                border: `1px dashed ${C.border}`,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>
                No questions match the current filter
              </div>
              <p style={{ fontSize: 13, color: C.muted, margin: "6px auto 16px", maxWidth: 420 }}>
                Try selecting "All Questions" or generate new MCQs from the AI Question Synthesizer.
              </p>
              <button
                onClick={() => setActiveTab("generator")}
                style={{
                  background: C.accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Synthesize New Questions
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredQuestions.map((q, idx) => {
                const domainObj = domains.find((d) => d.id === q.domainId);
                return (
                  <div
                    key={q.id}
                    style={{
                      background: C.surface,
                      borderRadius: 12,
                      border: `1px solid ${
                        q.status === "pending"
                          ? C.accent + "88"
                          : q.status === "approved"
                          ? C.s1 + "55"
                          : C.border
                      }`,
                      padding: "20px 24px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    {/* Top Row: Domain, Status, Timestamp */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span
                          style={{
                            background: (domainObj?.color || C.dark) + "18",
                            color: domainObj?.color || C.dark,
                            borderRadius: 6,
                            padding: "3px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {q.domain}
                        </span>
                        <span
                          style={{
                            background:
                              q.status === "approved"
                                ? "#E6F4EC"
                                : q.status === "pending"
                                ? "#FEF3C7"
                                : "#FEE2E2",
                            color:
                              q.status === "approved"
                                ? C.s1
                                : q.status === "pending"
                                ? "#92400E"
                                : "#991B1B",
                            borderRadius: 20,
                            padding: "2px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "capitalize",
                          }}
                        >
                          ● {q.status}
                        </span>
                        <span style={{ fontSize: 11, color: C.faint }}>
                          Generated {new Date(q.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        {q.status !== "approved" && (
                          <button
                            onClick={() => approveQuestion(q.id)}
                            style={{
                              background: "#E6F4EC",
                              color: C.s1,
                              border: `1px solid ${C.s1}`,
                              borderRadius: 6,
                              padding: "5px 12px",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ✓ Approve & Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(q)}
                          style={{
                            background: "transparent",
                            border: `1px solid ${C.border}`,
                            borderRadius: 6,
                            padding: "5px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            color: C.dark,
                            cursor: "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>
                        {q.status !== "rejected" && (
                          <button
                            onClick={() => rejectQuestion(q.id)}
                            style={{
                              background: "transparent",
                              border: `1px solid ${C.border}`,
                              borderRadius: 6,
                              padding: "5px 12px",
                              fontSize: 12,
                              fontWeight: 600,
                              color: C.muted,
                              cursor: "pointer",
                            }}
                          >
                            ✕ Reject
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Stem */}
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        lineHeight: 1.5,
                        color: C.dark,
                        marginBottom: 14,
                      }}
                    >
                      <span style={{ color: C.accent, marginRight: 6 }}>Q{idx + 1}.</span>
                      {q.question}
                    </div>

                    {/* Options list */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        marginBottom: 14,
                      }}
                    >
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === q.correct;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              background: isCorrect ? "#E6F4EC" : C.bg,
                              border: `1px solid ${isCorrect ? C.s1 : C.border}`,
                              borderRadius: 8,
                              padding: "10px 14px",
                              fontSize: 13,
                              color: isCorrect ? C.s1 : C.dark,
                              fontWeight: isCorrect ? 600 : 400,
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <span
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: isCorrect ? C.s1 : C.border,
                                color: "#fff",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span style={{ flex: 1 }}>{opt}</span>
                            {isCorrect && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: C.s1 }}>
                                Correct Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Verifiable Citation Callout */}
                    <div
                      style={{
                        background: C.surfaceAlt,
                        borderRadius: 8,
                        padding: "10px 14px",
                        borderLeft: `3px solid ${C.accent}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10,
                        fontSize: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: C.dark }}>
                        📄 Verified Citation:
                      </span>
                      <span style={{ fontWeight: 600, color: C.dark }}>
                        {q.citation.documentName}
                      </span>
                      <span style={{ color: C.muted }}>• {q.citation.chapter}</span>
                      <span
                        style={{
                          background: C.surface,
                          border: `1px solid ${C.border}`,
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontWeight: 600,
                          color: C.accent,
                        }}
                      >
                        {q.citation.page}
                      </span>
                    </div>

                    {/* Explanation */}
                    <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                      <strong style={{ color: C.dark }}>Rationale: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DOCUMENT INGESTION WORKSTATION */}
      {activeTab === "ingest" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <div>
              <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0 }}>
                MoSPI Ingested Curriculum Repository
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>
                Statutory manuals, survey guidelines, and standard operating procedures parsed for question generation.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                background: C.accent,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Ingest New Document
            </button>
          </div>

          <div
            style={{
              background: C.surface,
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.surfaceAlt, borderBottom: `1px solid ${C.border}` }}>
                  {[
                    "Document Title",
                    "Target FrAC Domain",
                    "Format / Size",
                    "Pages",
                    "Chapters",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.dark,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ingestedDocuments.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    style={{
                      borderBottom:
                        idx < ingestedDocuments.length - 1 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>
                      <div style={{ color: C.dark }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
                        Ingested: {doc.uploadDate}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12 }}>
                      <span
                        style={{
                          background: C.surfaceAlt,
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontWeight: 600,
                          color: C.dark,
                        }}
                      >
                        {doc.domain}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12 }}>
                      <span
                        style={{
                          background: doc.format === "pdf" ? "#FEE2E2" : "#DBEAFE",
                          color: doc.format === "pdf" ? "#991B1B" : "#1E40AF",
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          marginRight: 6,
                        }}
                      >
                        {doc.format}
                      </span>
                      <span style={{ color: C.muted }}>{doc.fileSize}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.dark }}>
                      {doc.pagesCount} pages
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.dark }}>
                      {doc.chaptersCount} chapters
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12 }}>
                      <span
                        style={{
                          background: "#E6F4EC",
                          color: C.s1,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        ● {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => setViewingDocToc(doc)}
                          style={{
                            background: "transparent",
                            border: `1px solid ${C.border}`,
                            borderRadius: 6,
                            padding: "4px 10px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: C.dark,
                            cursor: "pointer",
                          }}
                        >
                          View TOC
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocForGen(doc.id);
                            setActiveTab("generator");
                          }}
                          style={{
                            background: C.accent,
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 10px",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          ✨ Generate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AI QUESTION GENERATION ENGINE */}
      {activeTab === "generator" && (
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              border: `1px solid ${C.border}`,
              padding: "28px 32px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.accent,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                ✨
              </div>
              <div>
                <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, margin: 0 }}>
                  AI Question Synthesizer & Citation Engine
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: C.muted }}>
                  Select an ingested MoSPI document to synthesize multiple-choice test questions with verbatim page citations.
                </p>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "18px 0" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Document selector */}
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 6 }}>
                  Source Document / Manual *
                </label>
                <select
                  value={selectedDocForGen}
                  onChange={(e) => setSelectedDocForGen(e.target.value)}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    color: C.dark,
                    width: "100%",
                    outline: "none",
                  }}
                >
                  {ingestedDocuments.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.domain})
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Questions */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 6 }}>
                  Questions to Generate
                </label>
                <select
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    color: C.dark,
                    width: "100%",
                    outline: "none",
                  }}
                >
                  <option value={1}>1 Question</option>
                  <option value={2}>2 Questions</option>
                  <option value={3}>3 Questions</option>
                  <option value={4}>4 Questions</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 6 }}>
                  Target Competency Complexity
                </label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value)}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    color: C.dark,
                    width: "100%",
                    outline: "none",
                  }}
                >
                  <option>Foundational (Level 1)</option>
                  <option>Intermediate Operational (Level 2)</option>
                  <option>Advanced Analytical (Level 3)</option>
                </select>
              </div>
            </div>

            {/* Generation CTA or Progress */}
            <div style={{ marginTop: 24 }}>
              {isGenerating ? (
                <div
                  style={{
                    background: C.surfaceAlt,
                    borderRadius: 10,
                    padding: "16px 20px",
                    border: `1px solid ${C.accent}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: `2px solid ${C.accent}`,
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>
                      {genStepText}
                    </span>
                  </div>
                  <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        background: C.accent,
                        width: genStepText.startsWith("1")
                          ? "35%"
                          : genStepText.startsWith("2")
                          ? "70%"
                          : "95%",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleTriggerAIGeneration}
                  style={{
                    background: C.dark,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontFamily: FONT.body,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>✨</span> Synthesize Questions with Verifiable Citations
                </button>
              )}
            </div>
          </div>

          {/* Just Generated Feedback */}
          {justGenerated.length > 0 && (
            <div
              style={{
                background: "#E6F4EC",
                borderRadius: 12,
                border: `1px solid ${C.s1}`,
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: C.s1 }}>
                  🎉 Successfully Synthesized {justGenerated.length} Questions with Page Citations!
                </div>
                <button
                  onClick={() => setActiveTab("hitl")}
                  style={{
                    background: C.s1,
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Review in HITL Tab →
                </button>
              </div>
              <div style={{ fontSize: 12, color: C.dark }}>
                All questions have been staged in the <strong>Pending Review</strong> pipeline. You can review stems, options, and page citations in the HITL Curation tab.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PUBLISHED QUESTION BANK */}
      {activeTab === "bank" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0 }}>
                Published MoSPI Question Bank ({publishedQuestions.length})
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>
                Peer-reviewed and approved multiple choice questions deployed to the Learner Assessment Engine.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={handleExportBankCSV}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.dark,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>📥</span> Export Bank CSV
              </button>
              <span
                style={{
                  background: "#E6F4EC",
                  color: C.s1,
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Live in Learner Diagnostics
              </span>
            </div>
          </div>

          {/* Search & Domain Filter Bar */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
            <input
              placeholder="Search questions or citations..."
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                fontFamily: FONT.body,
                outline: "none",
                width: 260,
              }}
            />
            <select
              value={bankDomain}
              onChange={(e) => setBankDomain(e.target.value)}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                fontFamily: FONT.body,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All FrAC Domains</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {(bankSearch || bankDomain !== "all") && (
              <button
                onClick={() => {
                  setBankSearch("");
                  setBankDomain("all");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.muted,
                  fontSize: 12,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {publishedQuestions.length === 0 ? (
              <div style={{ background: C.surface, borderRadius: 12, padding: "32px", textAlign: "center", border: `1px solid ${C.border}`, color: C.muted }}>
                No published questions match the filter criteria.
              </div>
            ) : (
              publishedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    background: C.surface,
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: C.surfaceAlt,
                          color: C.dark,
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {q.domain}
                      </span>
                      <span style={{ fontSize: 11, color: C.muted }}>
                        Citation: {q.citation.documentName} ({q.citation.page})
                      </span>
                      <span style={{ fontSize: 11, color: C.faint }}>· {q.citation.chapter}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>
                      {idx + 1}. {q.question}
                    </div>
                    <div style={{ fontSize: 12, color: C.s1, marginTop: 4, fontWeight: 600 }}>
                      Answer: {q.options[q.correct]}
                    </div>
                    {q.explanation && (
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontStyle: "italic" }}>
                        Rationale: {q.explanation}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleOpenEdit(q)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.dark,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRecallQuestion(q.id)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.s4,
                        cursor: "pointer",
                      }}
                    >
                      Recall
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Global Assessment Management Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 99999,
            background: C.dark,
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span style={{ color: C.s1, fontSize: 16 }}>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL (Feature 4) */}
      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              border: `1px solid ${C.border}`,
              width: "100%",
              maxWidth: 580,
              padding: "24px 28px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0 }}>
                Upload Learning Material (PDF/DOC)
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                  color: C.muted,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 4 }}>
                  Document Title / Standard Operating Procedure *
                </label>
                <input
                  type="text"
                  placeholder="e.g. MoSPI Price Statistics Compilation Manual (Vol II)"
                  value={uploadFormData.name}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, name: e.target.value })}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    color: C.dark,
                    width: "100%",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 4 }}>
                    FrAC Competency Domain *
                  </label>
                  <select
                    value={uploadFormData.domainId}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, domainId: e.target.value })}
                    style={{
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontSize: 13,
                      fontFamily: FONT.body,
                      color: C.dark,
                      width: "100%",
                      outline: "none",
                    }}
                  >
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 4 }}>
                    Format & Size
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <select
                      value={uploadFormData.format}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, format: e.target.value as any })}
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: "9px 12px",
                        fontSize: 13,
                        fontFamily: FONT.body,
                        color: C.dark,
                        outline: "none",
                        flex: 1,
                      }}
                    >
                      <option value="pdf">PDF (.pdf)</option>
                      <option value="docx">Word (.docx)</option>
                      <option value="doc">Word (.doc)</option>
                    </select>
                    <input
                      type="text"
                      value={uploadFormData.fileSize}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, fileSize: e.target.value })}
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: "9px 10px",
                        fontSize: 13,
                        fontFamily: FONT.body,
                        color: C.dark,
                        width: 80,
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 4 }}>
                  Table of Contents (One chapter/module per line)
                </label>
                <textarea
                  rows={4}
                  value={uploadFormData.tocInput}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, tocInput: e.target.value })}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 12,
                    fontFamily: FONT.mono,
                    color: C.dark,
                    width: "100%",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {uploadProgress !== null && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                    <span>Parsing structure & extracting citation markers...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        background: C.s1,
                        width: `${uploadProgress}%`,
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 18px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    color: C.muted,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartUpload}
                  disabled={uploadProgress !== null || !uploadFormData.name.trim()}
                  style={{
                    background: C.dark,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px 20px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    fontWeight: 700,
                    cursor: uploadProgress !== null ? "not-allowed" : "pointer",
                  }}
                >
                  {uploadProgress !== null ? "Ingesting..." : "Ingest & Parse Document"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOC DRAWER / MODAL */}
      {viewingDocToc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              border: `1px solid ${C.border}`,
              width: "100%",
              maxWidth: 520,
              padding: "24px 28px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <h3 style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, margin: 0 }}>
                  Table of Contents
                </h3>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                  {viewingDocToc.name}
                </div>
              </div>
              <button
                onClick={() => setViewingDocToc(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                  color: C.muted,
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                background: C.bg,
                borderRadius: 8,
                padding: "12px 16px",
                border: `1px solid ${C.border}`,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxHeight: 320,
                overflowY: "auto",
                marginBottom: 18,
              }}
            >
              {viewingDocToc.tableOfContents.map((ch, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 13,
                    color: C.dark,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ color: C.accent, fontWeight: 700 }}>•</span>
                  <span>{ch}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setViewingDocToc(null)}
              style={{
                background: C.dark,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
              }}
            >
              Close TOC
            </button>
          </div>
        </div>
      )}

      {/* EDIT QUESTION MODAL (Feature 5 HITL) */}
      {editingQuestion && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              border: `1px solid ${C.border}`,
              width: "100%",
              maxWidth: 640,
              padding: "24px 28px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0 }}>
                Edit Assessment Question (HITL Override)
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                  color: C.muted,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 4 }}>
                  Question Stem *
                </label>
                <textarea
                  rows={3}
                  value={editFormData.question}
                  onChange={(e) => setEditFormData({ ...editFormData, question: e.target.value })}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    color: C.dark,
                    width: "100%",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 6 }}>
                  Options & Correct Answer (Select radio for correct)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {editFormData.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={editFormData.correct === oIdx}
                        onChange={() => setEditFormData({ ...editFormData, correct: oIdx })}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, width: 20 }}>
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...editFormData.options];
                          newOpts[oIdx] = e.target.value;
                          setEditFormData({ ...editFormData, options: newOpts });
                        }}
                        style={{
                          background: C.bg,
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          padding: "7px 10px",
                          fontSize: 13,
                          fontFamily: FONT.body,
                          color: C.dark,
                          flex: 1,
                          outline: "none",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Citation Details */}
              <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 8 }}>
                  Verifiable Source Citation
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ gridColumn: "1/-1" }}>
                    <input
                      type="text"
                      placeholder="Document Name"
                      value={editFormData.citationDoc}
                      onChange={(e) => setEditFormData({ ...editFormData, citationDoc: e.target.value })}
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        padding: "7px 10px",
                        fontSize: 12,
                        fontFamily: FONT.body,
                        color: C.dark,
                        width: "100%",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Chapter / Module"
                      value={editFormData.citationChapter}
                      onChange={(e) => setEditFormData({ ...editFormData, citationChapter: e.target.value })}
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        padding: "7px 10px",
                        fontSize: 12,
                        fontFamily: FONT.body,
                        color: C.dark,
                        width: "100%",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Page / Section"
                      value={editFormData.citationPage}
                      onChange={(e) => setEditFormData({ ...editFormData, citationPage: e.target.value })}
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        padding: "7px 10px",
                        fontSize: 12,
                        fontFamily: FONT.body,
                        color: C.dark,
                        width: "100%",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.dark, display: "block", marginBottom: 4 }}>
                  Explanation / Rationale
                </label>
                <textarea
                  rows={2}
                  value={editFormData.explanation}
                  onChange={(e) => setEditFormData({ ...editFormData, explanation: e.target.value })}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 12,
                    fontFamily: FONT.body,
                    color: C.dark,
                    width: "100%",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  onClick={() => setEditingQuestion(null)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 18px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    color: C.muted,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    background: C.s1,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px 20px",
                    fontSize: 13,
                    fontFamily: FONT.body,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
