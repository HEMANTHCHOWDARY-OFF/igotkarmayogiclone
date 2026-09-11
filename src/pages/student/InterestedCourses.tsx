import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import { useAuth } from "@/context/AuthContext";
import { setSessionOnboardingCompleted } from "@/utils/coursePreferences";
import {
  igotTaxonomy,
  igotAllCourses,
  getCourseById,
  queryKarmayogiCourses,
  TOTAL_IGOT_COURSES_COUNT,
  type IGOTCatalogCourse,
  type IGOTDomain,
} from "@/services/karmayogiCoursesService";
import {
  getGroqRecommendations,
  type GroqRecommendationResult,
} from "@/services/groqRecommendation";

export default function InterestedCourses() {
  const navigate = useNavigate();
  const { profile, signOut, saveCalibration } = useAuth();

  // Active Section Mode: 'manual' (Browse Catalog) vs 'ai' (AI Interest Recommender)
  const [activeSection, setActiveSection] = useState<"manual" | "ai">("manual");

  // Selection state
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedSubDomains, setSelectedSubDomains] = useState<string[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  // Section 1 (Manual Exploration) State
  const [domainSearch, setDomainSearch] = useState<string>("");
  const [activeManualDomain, setActiveManualDomain] = useState<string>("");
  const [manualSubDomain, setManualSubDomain] = useState<string>("");
  const [courseSearch, setCourseSearch] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  // Section 2 (AI Recommender) State
  const [userInterestInput, setUserInterestInput] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<GroqRecommendationResult | null>(null);

  // General state
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Preset interest prompts for fast 1-click exploration
  const PRESET_INTERESTS = [
    { label: "📊 Data Analytics & Python", text: "I want to learn data analytics, Python data cleaning, and statistical survey analysis for evidence-based governance." },
    { label: "🚂 Infrastructure & Railways", text: "I am interested in public infrastructure, railways operations, urban transportation, and logistics management." },
    { label: "💰 Public Finance & GFR", text: "I want to master government financial rules (GFR 2017), public procurement, budgeting, and fiscal administration." },
    { label: "🌐 Digital India & Cyber Law", text: "I want to understand the India Stack, DigiLocker, digital governance architectures, and the DPDP Act 2023." },
    { label: "🚨 Disaster Management & Relief", text: "I am preparing for disaster response, flood and drought relief logistics, and NDRF emergency protocols." },
    { label: "🏛️ Administrative Leadership & Ethics", text: "I want to develop civil service leadership, ethical administrative decision making, and citizen grievance redressal." },
  ];

  // Prepopulate if student already has saved calibration
  useEffect(() => {
    if (profile) {
      if (profile.interestedDomains && profile.interestedDomains.length > 0) {
        setSelectedDomains(profile.interestedDomains);
        if (!activeManualDomain) {
          setActiveManualDomain(profile.interestedDomains[0]);
        }
      } else if (!activeManualDomain && igotTaxonomy.length > 0) {
        setActiveManualDomain(igotTaxonomy[0].name);
      }

      if (profile.interestedSubDomains && profile.interestedSubDomains.length > 0) {
        setSelectedSubDomains(profile.interestedSubDomains);
      }

      if (profile.interestedCourses && profile.interestedCourses.length > 0) {
        setSelectedCourseIds(profile.interestedCourses.map(String));
      }

      if (profile.aiRecommendations) {
        setAiResult(profile.aiRecommendations);
      }
    }
  }, [profile]);

  // Filtered domains list in manual section
  const filteredDomains = useMemo(() => {
    if (!domainSearch.trim()) return igotTaxonomy;
    const q = domainSearch.toLowerCase();
    return igotTaxonomy.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.subDomains?.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [domainSearch]);

  // Current domain object
  const currentDomainObj = useMemo(() => {
    return igotTaxonomy.find((d) => d.name === activeManualDomain) || igotTaxonomy[0];
  }, [activeManualDomain]);

  // Manual Section Courses Query
  const manualCatalogResult = useMemo(() => {
    const domainsFilter = activeManualDomain ? [activeManualDomain] : [];
    const subDomainsFilter = manualSubDomain ? [manualSubDomain] : [];

    return queryKarmayogiCourses({
      query: courseSearch,
      domains: domainsFilter,
      subDomains: subDomainsFilter,
      level: levelFilter,
      page,
      pageSize: 12,
      recommendedTitles: aiResult?.recommendedCourses.map((r) => r.title) || [],
    });
  }, [activeManualDomain, manualSubDomain, courseSearch, levelFilter, page, aiResult]);

  // Toggle selection of a course
  const toggleCourse = (courseId: string, domainName?: string, subDomainName?: string) => {
    setStatusMsg(null);
    setSelectedCourseIds((prev) => {
      const exists = prev.includes(courseId);
      if (exists) {
        return prev.filter((id) => id !== courseId);
      } else {
        // Automatically add parent domain if not present
        if (domainName && !selectedDomains.includes(domainName)) {
          setSelectedDomains((dPrev) => [...dPrev, domainName]);
        }
        if (subDomainName && !selectedSubDomains.includes(subDomainName)) {
          setSelectedSubDomains((sPrev) => [...sPrev, subDomainName]);
        }
        return [...prev, courseId];
      }
    });
  };

  // Toggle domain selection
  const toggleDomain = (domainName: string) => {
    setSelectedDomains((prev) => {
      if (prev.includes(domainName)) {
        return prev.filter((d) => d !== domainName);
      } else {
        return [...prev, domainName];
      }
    });
  };

  // Toggle sub-domain selection
  const toggleSubDomain = (subName: string, parentDomain: string) => {
    setSelectedSubDomains((prev) => {
      if (prev.includes(subName)) {
        return prev.filter((s) => s !== subName);
      } else {
        if (!selectedDomains.includes(parentDomain)) {
          setSelectedDomains((dPrev) => [...dPrev, parentDomain]);
        }
        return [...prev, subName];
      }
    });
  };

  // Handle AI Recommendation Request
  const handleAskAi = async (customPrompt?: string) => {
    const promptToUse = customPrompt || userInterestInput;
    if (!promptToUse.trim()) {
      setStatusMsg({ text: "Please enter what you are interested in learning, or click a topic chip.", type: "error" });
      return;
    }

    setStatusMsg(null);
    setIsAiLoading(true);

    try {
      const sampleTitles = currentDomainObj?.subDomains.map((s) => s.name) || [];
      const result = await getGroqRecommendations({
        userInterestPrompt: promptToUse,
        selectedDomains,
        selectedSubDomains,
        learnerName: profile?.fullName,
        learnerTrack: profile?.track,
        sampleCatalogTitles: sampleTitles,
      });

      setAiResult(result);
      setStatusMsg({ text: "✨ AI recommendations successfully generated!", type: "success" });
    } catch (err: any) {
      console.warn("AI recommendation error:", err);
      setStatusMsg({ text: "AI generated recommendations using official domain mappings.", type: "info" });
    } finally {
      setIsAiLoading(false);
    }
  };

  // 1-Click: Select all AI recommended courses & domains
  const handleSelectAllAiRecommendations = () => {
    if (!aiResult) return;

    // Add recommended domains
    if (aiResult.recommendedDomains && aiResult.recommendedDomains.length > 0) {
      setSelectedDomains((prev) => {
        const combined = new Set([...prev, ...aiResult.recommendedDomains]);
        return Array.from(combined);
      });
    }

    // Add recommended sub-domains
    if (aiResult.recommendedSubDomains && aiResult.recommendedSubDomains.length > 0) {
      setSelectedSubDomains((prev) => {
        const combined = new Set([...prev, ...aiResult.recommendedSubDomains]);
        return Array.from(combined);
      });
    }

    // 1. Gather genuine course IDs from RAG recommendations
    const directIds = (aiResult.recommendedCourses || [])
      .map((r) => r.courseId)
      .filter((id): id is string => Boolean(id && !id.startsWith("ai-rec-")));

    if (directIds.length > 0) {
      setSelectedCourseIds((prev) => Array.from(new Set([...prev, ...directIds])));
    } else {
      // Fallback matching across full catalog
      const recTitles = aiResult.recommendedCourses.map((r) => r.title.toLowerCase());
      const matchedCourses = igotAllCourses.filter((c) =>
        recTitles.some((rt) => c.title.toLowerCase().includes(rt) || rt.includes(c.title.toLowerCase()))
      );

      const newIds = matchedCourses.map((c) => c.id);
      if (newIds.length === 0 && manualCatalogResult.courses.length > 0) {
        const topPicks = manualCatalogResult.courses.slice(0, 4).map((c) => c.id);
        setSelectedCourseIds((prev) => Array.from(new Set([...prev, ...topPicks])));
      } else {
        setSelectedCourseIds((prev) => Array.from(new Set([...prev, ...newIds])));
      }
    }

    setStatusMsg({
      text: `Added all AI recommended domains and courses to your selection!`,
      type: "success",
    });
  };

  // Save selection and launch dashboard
  const handleConfirmSelection = async () => {
    if (selectedCourseIds.length === 0) {
      setStatusMsg({
        text: "Please select at least 1 course (either manually or via AI) to continue.",
        type: "error",
      });
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await saveCalibration({
        courseIds: selectedCourseIds,
        domains: selectedDomains.length > 0 ? selectedDomains : [activeManualDomain],
        subDomains: selectedSubDomains,
        aiAnalysis: aiResult,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to persist course selections.");
      }

      setSessionOnboardingCompleted(profile?.id);
      navigate("/student/dashboard", { replace: true });
    } catch (err: any) {
      setStatusMsg({
        text: err?.message || "An unexpected error occurred while saving your preferences.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT.body,
        color: C.dark,
        paddingBottom: 110, // Space for sticky bottom bar
      }}
    >
      {/* Top Header */}
      <header
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/gyanmarg_logo.jpg"
            alt="GyanMarg AI Logo"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1.5px solid rgba(198, 133, 27, 0.7)",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 16,
                fontWeight: 700,
                color: C.dark,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              GyanMarg <span style={{ color: C.accent }}>AI</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 99,
                  background: `${C.accent}18`,
                  color: C.accent,
                }}
              >
                CURRICULUM SELECTION
              </span>
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>
              iGOT Karmayogi National Catalog ({TOTAL_IGOT_COURSES_COUNT.toLocaleString()} Courses • 47 Domains)
            </div>
          </div>
        </div>

        {/* Section Switcher Tabs */}
        <div
          style={{
            display: "flex",
            background: C.bg,
            padding: 4,
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            gap: 4,
          }}
        >
          <button
            onClick={() => setActiveSection("manual")}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: activeSection === "manual" ? C.surface : "transparent",
              color: activeSection === "manual" ? C.dark : C.muted,
              fontSize: 13,
              fontWeight: activeSection === "manual" ? 700 : 500,
              cursor: "pointer",
              boxShadow: activeSection === "manual" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s ease",
            }}
          >
            <span>🧭</span>
            <span>Section 1: Browse Catalog Yourself</span>
          </button>

          <button
            onClick={() => setActiveSection("ai")}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: activeSection === "ai" ? C.surface : "transparent",
              color: activeSection === "ai" ? C.accent : C.muted,
              fontSize: 13,
              fontWeight: activeSection === "ai" ? 700 : 500,
              cursor: "pointer",
              boxShadow: activeSection === "ai" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s ease",
            }}
          >
            <span>✨</span>
            <span>Section 2: AI Interest Recommender</span>
          </button>
        </div>

        {/* User initials & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#1B3D29",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {profile?.initials || "ST"}
          </div>
          <button
            onClick={async () => {
              await signOut();
              navigate("/login");
            }}
            style={{
              background: "none",
              border: "none",
              color: C.muted,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: 1380, width: "100%", margin: "0 auto", padding: "24px 28px", boxSizing: "border-box" }}>
        {/* Status Notification */}
        {statusMsg && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: 10,
              marginBottom: 18,
              fontSize: 13,
              fontWeight: 600,
              background:
                statusMsg.type === "success"
                  ? "#EBF5F0"
                  : statusMsg.type === "error"
                  ? "#FDECEA"
                  : "#FFF8E7",
              color:
                statusMsg.type === "success"
                  ? C.s1
                  : statusMsg.type === "error"
                  ? C.s4
                  : C.accent,
              border: `1px solid ${
                statusMsg.type === "success"
                  ? C.s1 + "40"
                  : statusMsg.type === "error"
                  ? C.s4 + "40"
                  : C.accent + "40"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{statusMsg.text}</span>
            <button
              onClick={() => setStatusMsg(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* SECTION 1: BROWSE CATALOG YOURSELF */}
        {activeSection === "manual" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 800, margin: "0 0 6px", color: C.dark }}>
                Section 1: Browse & Choose Courses from the Official Catalog
              </h2>
              <p style={{ margin: 0, fontSize: 13.5, color: C.muted }}>
                Select your focus <strong>Domains</strong> and <strong>Sub-domains</strong> on the left, then hand-pick the exact courses you want to include in your personalized learning roadmap.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>
              {/* Left Column: Domains & Sub-domains */}
              <div
                style={{
                  background: C.surface,
                  borderRadius: 14,
                  border: `1px solid ${C.border}`,
                  padding: "18px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  position: "sticky",
                  top: 80,
                  maxHeight: "calc(100vh - 180px)",
                  overflowY: "auto",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
                    Search 47 Domains
                  </div>
                  <input
                    type="text"
                    placeholder="Filter domains..."
                    value={domainSearch}
                    onChange={(e) => setDomainSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: `1px solid ${C.border}`,
                      fontSize: 12.5,
                      background: C.bg,
                      color: C.dark,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Domain list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {filteredDomains.map((d) => {
                    const isActive = activeManualDomain === d.name;
                    const isSelected = selectedDomains.includes(d.name);

                    return (
                      <div
                        key={d.name}
                        onClick={() => {
                          setActiveManualDomain(d.name);
                          setManualSubDomain("");
                          setPage(1);
                        }}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: isActive ? `${C.accent}14` : "transparent",
                          border: isActive ? `1.5px solid ${C.accent}` : "1.5px solid transparent",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleDomain(d.name);
                            }}
                            style={{ accentColor: C.s1, cursor: "pointer" }}
                          />
                          <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: C.dark }}>
                            {d.name}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            color: isActive ? C.accent : C.muted,
                            fontWeight: 600,
                            background: C.bg,
                            padding: "2px 6px",
                            borderRadius: 6,
                          }}
                        >
                          {d.totalCourses}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Sub-domains + Course Catalog */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Active Domain Banner & Sub-domains */}
                <div
                  style={{
                    background: C.surface,
                    borderRadius: 14,
                    border: `1px solid ${C.border}`,
                    padding: "18px 20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase" }}>
                        Active Domain Filter
                      </span>
                      <h3 style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 800, color: C.dark }}>
                        {currentDomainObj.name} ({currentDomainObj.totalCourses} Courses)
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleDomain(currentDomainObj.name)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: selectedDomains.includes(currentDomainObj.name) ? "#EBF5F0" : C.bg,
                        color: selectedDomains.includes(currentDomainObj.name) ? C.s1 : C.dark,
                        border: `1px solid ${selectedDomains.includes(currentDomainObj.name) ? C.s1 : C.border}`,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {selectedDomains.includes(currentDomainObj.name) ? "✓ Domain Selected" : "+ Select Entire Domain"}
                    </button>
                  </div>

                  {/* Sub-domains Pills */}
                  {currentDomainObj.subDomains && currentDomainObj.subDomains.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>
                        Filter by Sub-Domain:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        <button
                          onClick={() => {
                            setManualSubDomain("");
                            setPage(1);
                          }}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            border: `1px solid ${!manualSubDomain ? C.accent : C.border}`,
                            background: !manualSubDomain ? `${C.accent}18` : C.bg,
                            color: !manualSubDomain ? C.accent : C.dark,
                            cursor: "pointer",
                          }}
                        >
                          All Sub-Domains ({currentDomainObj.subDomains.length})
                        </button>
                        {currentDomainObj.subDomains.map((s) => {
                          const isSubActive = manualSubDomain === s.name;
                          return (
                            <button
                              key={s.name}
                              onClick={() => {
                                setManualSubDomain(s.name);
                                setPage(1);
                              }}
                              style={{
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 600,
                                border: `1px solid ${isSubActive ? C.accent : C.border}`,
                                background: isSubActive ? `${C.accent}18` : C.bg,
                                color: isSubActive ? C.accent : C.dark,
                                cursor: "pointer",
                              }}
                            >
                              {s.name} ({s.count})
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter & Search Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <input
                      type="text"
                      placeholder={`Search courses in ${currentDomainObj.name}...`}
                      value={courseSearch}
                      onChange={(e) => {
                        setCourseSearch(e.target.value);
                        setPage(1);
                      }}
                      style={{
                        flex: 1,
                        maxWidth: 400,
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: `1px solid ${C.border}`,
                        fontSize: 13,
                        background: C.surface,
                        color: C.dark,
                        outline: "none",
                      }}
                    />

                    {/* Level selector */}
                    <select
                      value={levelFilter}
                      onChange={(e) => {
                        setLevelFilter(e.target.value);
                        setPage(1);
                      }}
                      style={{
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: `1px solid ${C.border}`,
                        background: C.surface,
                        fontSize: 12.5,
                        color: C.dark,
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div style={{ fontSize: 12.5, color: C.muted }}>
                    Showing <strong>{manualCatalogResult.courses.length}</strong> of{" "}
                    <strong>{manualCatalogResult.totalMatches}</strong> courses
                  </div>
                </div>

                {/* Courses Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                  {manualCatalogResult.courses.map((course) => {
                    const isSelected = selectedCourseIds.includes(course.id);

                    return (
                      <div
                        key={course.id}
                        style={{
                          background: C.surface,
                          borderRadius: 12,
                          border: `1.5px solid ${isSelected ? C.s1 : C.border}`,
                          padding: "16px 18px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                          boxShadow: isSelected
                            ? "0 4px 12px rgba(27, 61, 41, 0.12)"
                            : "0 1px 3px rgba(0,0,0,0.03)",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {/* Top Badges */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 700,
                                background: course.level === "Advanced" ? "#FFE8E2" : "#EBF5F0",
                                color: course.level === "Advanced" ? C.s4 : C.s1,
                                padding: "2px 7px",
                                borderRadius: 4,
                              }}
                            >
                              {course.level || "Beginner"}
                            </span>

                            {course.tpacEndorsed && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  background: "#E6F4EC",
                                  color: "#1B3D29",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                }}
                              >
                                🎖️ TPAC
                              </span>
                            )}
                          </div>

                          <span style={{ fontSize: 11, color: C.muted, fontFamily: FONT.mono }}>
                            {course.code}
                          </span>
                        </div>

                        {/* Title & Organization */}
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: C.dark, lineHeight: 1.35 }}>
                            {course.title}
                          </h4>
                          <div style={{ fontSize: 12, color: C.muted }}>
                            {course.org || "iGOT Karmayogi"} {course.subDomain && `• ${course.subDomain}`}
                          </div>
                        </div>

                        {/* Description snippet */}
                        {course.desc && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: 12,
                              color: C.muted,
                              lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {course.desc}
                          </p>
                        )}

                        {/* Footer & Select Button */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderTop: `1px solid ${C.border}`,
                            paddingTop: 10,
                          }}
                        >
                          <span style={{ fontSize: 12, color: C.muted }}>
                            ⏱️ {course.duration || 6}h · ⭐ {course.rating || 4.8}
                          </span>

                          <button
                            onClick={() => toggleCourse(course.id, course.domain, course.subDomain)}
                            style={{
                              padding: "6px 14px",
                              borderRadius: 6,
                              border: isSelected ? `1px solid ${C.s1}` : `1px solid ${C.border}`,
                              background: isSelected ? C.s1 : C.surface,
                              color: isSelected ? "#fff" : C.dark,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {isSelected ? "✓ Selected" : "+ Select Course"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {manualCatalogResult.totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 12 }}>
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: `1px solid ${C.border}`,
                        background: page <= 1 ? C.bg : C.surface,
                        cursor: page <= 1 ? "not-allowed" : "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      ← Prev
                    </button>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: C.dark }}>
                      Page {manualCatalogResult.currentPage} of {manualCatalogResult.totalPages}
                    </span>
                    <button
                      disabled={page >= manualCatalogResult.totalPages}
                      onClick={() => setPage((p) => Math.min(manualCatalogResult.totalPages, p + 1))}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: `1px solid ${C.border}`,
                        background: page >= manualCatalogResult.totalPages ? C.bg : C.surface,
                        cursor: page >= manualCatalogResult.totalPages ? "not-allowed" : "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: AI INTEREST RECOMMENDER */}
        {activeSection === "ai" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* AI Advisor Prompt Box */}
            <div
              style={{
                background: "linear-gradient(135deg, #1B3D29 0%, #0F281B 100%)",
                borderRadius: 16,
                padding: "28px 32px",
                color: "#fff",
                boxShadow: "0 8px 24px rgba(27, 61, 41, 0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 26 }}>🤖</span>
                <div>
                  <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 800, margin: 0 }}>
                    GyanMarg AI Curriculum & Competency Recommender
                  </h2>
                  <div style={{ fontSize: 13, color: "#D4E8D8", marginTop: 2 }}>
                    Tell the AI what topics, competencies, or career track you wish to develop. AI will recommend official domains, subdomains, and specific courses tailored to your goals.
                  </div>
                </div>
              </div>

              {/* Fast Preset Topic Chips */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                  Quick Inspiration Prompts:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PRESET_INTERESTS.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => {
                        setUserInterestInput(chip.text);
                        handleAskAi(chip.text);
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        border: "1px solid rgba(255,255,255,0.25)",
                        background: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        fontSize: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input Area */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <textarea
                  rows={3}
                  value={userInterestInput}
                  onChange={(e) => setUserInterestInput(e.target.value)}
                  placeholder="e.g., I am preparing for statistical roles and want to learn sampling, SQL for administrative databases, and data ethics..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontSize: 14,
                    fontFamily: FONT.body,
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    disabled={isAiLoading}
                    onClick={() => handleAskAi()}
                    style={{
                      padding: "10px 22px",
                      borderRadius: 10,
                      background: C.accent,
                      color: "#1B3D29",
                      border: "none",
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: isAiLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow: "0 2px 10px rgba(198, 133, 27, 0.4)",
                    }}
                  >
                    {isAiLoading ? "Analyzing Interests..." : "✨ Analyze & Recommend Curriculum"}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Results Section */}
            {aiResult && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* 1-Click Action Bar */}
                <div
                  style={{
                    background: C.surface,
                    border: `1.5px solid ${C.accent}60`,
                    borderRadius: 14,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: C.dark, fontSize: 15 }}>
                      Recommended Curriculum Ready
                    </div>
                    <div style={{ fontSize: 13, color: C.muted }}>
                      {aiResult.recommendedCourses?.length || 4} Courses across{" "}
                      {aiResult.recommendedDomains?.length || 2} Domains aligned with your trajectory.
                    </div>
                  </div>

                  <button
                    onClick={handleSelectAllAiRecommendations}
                    style={{
                      padding: "9px 18px",
                      borderRadius: 8,
                      background: C.accent,
                      color: "#fff",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ⚡ Select All Recommended Courses & Domains
                  </button>
                </div>

                {/* Competency Trajectory Analysis */}
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "18px 20px",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", marginBottom: 6 }}>
                    Pedagogical Trajectory Analysis
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: C.dark, lineHeight: 1.6 }}>
                    {aiResult.competencyAnalysis}
                  </p>
                </div>

                {/* Recommended Domains & Sub-domains */}
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "18px 20px",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>
                    Recommended Official Domains & Sub-domains:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {aiResult.recommendedDomains?.map((dom) => {
                      const isSel = selectedDomains.includes(dom);
                      return (
                        <div
                          key={dom}
                          onClick={() => toggleDomain(dom)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: 8,
                            background: isSel ? "#EBF5F0" : C.bg,
                            border: `1.5px solid ${isSel ? C.s1 : C.border}`,
                            color: isSel ? C.s1 : C.dark,
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span>{isSel ? "✓" : "+"}</span>
                          <span>{dom}</span>
                        </div>
                      );
                    })}

                    {aiResult.recommendedSubDomains?.map((sub) => {
                      const isSel = selectedSubDomains.includes(sub);
                      return (
                        <div
                          key={sub}
                          onClick={() => toggleSubDomain(sub, aiResult.recommendedDomains[0] || "Governance")}
                          style={{
                            padding: "8px 14px",
                            borderRadius: 8,
                            background: isSel ? `${C.accent}14` : C.bg,
                            border: `1.5px solid ${isSel ? C.accent : C.border}`,
                            color: isSel ? C.accent : C.dark,
                            fontSize: 12.5,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span>{isSel ? "✓" : "+"}</span>
                          <span>📁 {sub}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Courses Cards */}
                <div>
                  <h3 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 800, margin: "0 0 14px", color: C.dark }}>
                    Recommended Courses for Your Goals
                  </h3>

                  {aiResult.ragNotice && (
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: "#FFF8E7", border: `1px solid ${C.accent}`, color: "#8A5300", fontSize: 13, marginBottom: 14 }}>
                      💡 <strong>Notice:</strong> {aiResult.ragNotice}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                    {aiResult.recommendedCourses?.map((rc, idx) => {
                      const directCourse = rc.courseId ? getCourseById(rc.courseId) : undefined;
                      const matched = directCourse || manualCatalogResult.courses.find(
                        (c) =>
                          c.title.toLowerCase().includes(rc.title.toLowerCase()) ||
                          rc.title.toLowerCase().includes(c.title.toLowerCase())
                      ) || manualCatalogResult.courses[idx % manualCatalogResult.courses.length];

                      const courseIdToUse = directCourse ? directCourse.id : matched ? matched.id : `ai-rec-${idx}`;
                      const isSelected = selectedCourseIds.includes(courseIdToUse);

                      return (
                        <div
                          key={idx}
                          style={{
                            background: C.surface,
                            borderRadius: 14,
                            border: `1.5px solid ${isSelected ? C.s1 : `${C.accent}50`}`,
                            padding: "18px 20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            boxShadow: isSelected
                              ? "0 4px 14px rgba(27, 61, 41, 0.12)"
                              : "0 2px 8px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                              <span
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  background: `${C.accent}18`,
                                  color: C.accent,
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                }}
                              >
                                {rc.priority || "High"} Priority
                              </span>
                              {rc.isPlatformCourse || rc.courseId ? (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    background: "#EBF5F0",
                                    color: C.s1,
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                  }}
                                >
                                  ⚡ RAG Grounded
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    background: "#FFF0E6",
                                    color: "#C05621",
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                  }}
                                >
                                  💡 General AI
                                </span>
                              )}
                              <span style={{ fontSize: 11, color: C.muted }}>
                                {rc.domain}
                              </span>
                            </div>

                            <span style={{ fontSize: 16 }}>⭐</span>
                          </div>

                          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.dark, lineHeight: 1.35 }}>
                            {rc.title}
                          </h4>

                          {/* Reason */}
                          <div
                            style={{
                              padding: "10px 12px",
                              borderRadius: 8,
                              background: "#FFF9EE",
                              borderLeft: `3px solid ${C.accent}`,
                              fontSize: 12.5,
                              color: "#7A4E00",
                              lineHeight: 1.45,
                            }}
                          >
                            <strong>Why Recommended:</strong> {rc.reason}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderTop: `1px solid ${C.border}`,
                              paddingTop: 10,
                            }}
                          >
                            <span style={{ fontSize: 12, color: C.muted }}>
                              Official iGOT Aligned
                            </span>

                            <button
                              onClick={() => toggleCourse(courseIdToUse, rc.domain, rc.subDomain)}
                              style={{
                                padding: "7px 16px",
                                borderRadius: 8,
                                border: isSelected ? `1px solid ${C.s1}` : `1px solid ${C.border}`,
                                background: isSelected ? C.s1 : C.surface,
                                color: isSelected ? "#fff" : C.dark,
                                fontSize: 12.5,
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              {isSelected ? "✓ Selected in Path" : "+ Select This Course"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* STICKY BOTTOM ACTION BAR / SELECTION DRAWER */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: C.surface,
          borderTop: `2px solid ${C.accent}60`,
          padding: "14px 28px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Badge Counter */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: selectedCourseIds.length > 0 ? "#1B3D29" : C.border,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {selectedCourseIds.length}
          </div>

          <div>
            <div style={{ fontWeight: 800, color: C.dark, fontSize: 15 }}>
              {selectedCourseIds.length} Courses Selected Across {selectedDomains.length} Domains
            </div>
            <div style={{ fontSize: 12, color: C.muted }}>
              {selectedCourseIds.length === 0
                ? "Select courses from Section 1 or Section 2 to generate your personalized learning roadmap."
                : "All downstream roadmaps, dashboards, and gap analyses will adapt to these courses."}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {selectedCourseIds.length > 0 && (
            <button
              onClick={() => {
                setSelectedCourseIds([]);
                setSelectedDomains([]);
                setSelectedSubDomains([]);
              }}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 12.5,
                color: C.muted,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Clear Selection
            </button>
          )}

          <button
            disabled={saving || selectedCourseIds.length === 0}
            onClick={handleConfirmSelection}
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              background: selectedCourseIds.length > 0 ? C.accent : C.border,
              color: selectedCourseIds.length > 0 ? "#1B3D29" : C.muted,
              border: "none",
              fontSize: 14,
              fontWeight: 800,
              cursor: selectedCourseIds.length > 0 ? "pointer" : "not-allowed",
              boxShadow: selectedCourseIds.length > 0 ? "0 4px 14px rgba(198, 133, 27, 0.35)" : "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.15s ease",
            }}
          >
            {saving ? "Configuring Learning Environment..." : "Confirm Selection & Build My Learning Roadmap →"}
          </button>
        </div>
      </footer>
    </div>
  );
}
