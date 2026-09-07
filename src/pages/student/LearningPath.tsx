import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import { useCompetency } from "@/context/CompetencyContext";
import { IGOT_COURSES, IGOTCourse } from "@/data/igotCourses";

interface RoadmapNode {
  id: string;
  courseId: number;
  code: string;
  title: string;
  domain: string;
  domainId: string;
  phaseId: number;
  phaseName: string;
  status: "COMPLETED" | "IN_PROGRESS" | "LOCKED";
  progressPct: number;
  durationHours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  tpac: boolean;
  subtopics: string[];
  citation: string;
  isGapTarget?: boolean;
  gapPoints?: number;
  importance: "Mandatory" | "Recommended" | "Core Remediation";
}

export default function LearningPath() {
  const navigate = useNavigate();
  const { getGapMetrics, getSkillHealthScore } = useCompetency();

  const [viewMode, setViewMode] = useState<"flowchart" | "grid">("flowchart");
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeDomainFilter, setActiveDomainFilter] = useState("All");

  const gapMetrics = getGapMetrics();
  const skillHealth = getSkillHealthScore();

  // Build the roadmap nodes aligned with user's competency gaps
  const roadmapNodes: RoadmapNode[] = useMemo(() => {
    const gapMap = gapMetrics.reduce((acc, curr) => {
      acc[curr.domainId] = curr;
      return acc;
    }, {} as Record<string, typeof gapMetrics[0]>);

    return [
      // Milestone 1: Foundation (Weeks 1–3)
      {
        id: "node-1",
        courseId: 17,
        code: "NSSTA-ETH-501",
        title: "DPDP Act 2023 Statutory Compliance & UN Statistical Ethics",
        domain: "Public Data Ethics & DPDP Act 2023",
        domainId: "ethics",
        phaseId: 1,
        phaseName: "1.0 Foundation & Statutory Ethics",
        status: "COMPLETED",
        progressPct: 100,
        durationHours: 6,
        level: "Intermediate",
        tpac: true,
        subtopics: ["DPDP Act Section 6 & 9", "Data Fiduciary Mandates", "UN Principle 6 Confidentiality", "k-Anonymity Basics"],
        citation: "DPDP Act Statutory Guidelines, Chapter 3, p. 8",
        importance: "Mandatory",
      },
      {
        id: "node-2",
        courseId: 18,
        code: "DOPT-GOV-101",
        title: "Public Service Ethics, Conduct Rules & Integrity in Governance",
        domain: "Public Data Ethics & DPDP Act 2023",
        domainId: "ethics",
        phaseId: 1,
        phaseName: "1.0 Foundation & Statutory Ethics",
        status: "COMPLETED",
        progressPct: 100,
        durationHours: 4,
        level: "Beginner",
        tpac: false,
        subtopics: ["CCS Conduct Rules 1964", "Preventing Conflict of Interest", "Public Trust in Data", "Vigilance Procedures"],
        citation: "DoPT Administrative Handbook, Chapter 2",
        importance: "Mandatory",
      },
      {
        id: "node-3",
        courseId: 2,
        code: "NSSTA-SAM-102",
        title: "Fundamentals of Survey Sampling & NSS Estimation Procedures",
        domain: "Applied Statistics & Sampling Theory",
        domainId: "stats",
        phaseId: 1,
        phaseName: "1.0 Foundation & Statutory Ethics",
        status: "COMPLETED",
        progressPct: 100,
        durationHours: 6,
        level: "Beginner",
        tpac: true,
        subtopics: ["SRSWOR Principles", "Probability Proportional to Size (PPS)", "First Stage Units (FSUs)", "Listing Schedules"],
        citation: "MoSPI Sampling Theory Manual, Chapter 1, p. 12",
        importance: "Mandatory",
      },

      // Milestone 2: Critical Remediation (Weeks 4–7) — Dynamically prioritized by gap severity
      {
        id: "node-4",
        courseId: 13,
        code: "FOD-GIS-102",
        title: "QGIS Spatial Sampling Frame Construction & Geo-tagging",
        domain: "GIS & Spatial Analysis",
        domainId: "gis",
        phaseId: 2,
        phaseName: "2.0 Critical Competency Remediation",
        status: "IN_PROGRESS",
        progressPct: 55,
        durationHours: 9,
        level: "Intermediate",
        tpac: true,
        subtopics: ["Primary Sampling Unit Boundary Vectorization", "Sentinel-2 Built-Up Overlays", "HDOP <= 2.0 Tablet Standards", "Geo-fencing Polygons"],
        citation: "MoSPI GIS Integration Guidelines, Section 4.2, p. 17",
        isGapTarget: true,
        gapPoints: gapMap["gis"]?.gap || 45,
        importance: "Core Remediation",
      },
      {
        id: "node-5",
        courseId: 5,
        code: "DIID-DB-203",
        title: "Enterprise SQL & High-Volume Microdata Aggregations for CPI/IIP",
        domain: "SQL & Database Operations",
        domainId: "sql",
        phaseId: 2,
        phaseName: "2.0 Critical Competency Remediation",
        status: "IN_PROGRESS",
        progressPct: 40,
        durationHours: 8,
        level: "Intermediate",
        tpac: true,
        subtopics: ["Trailing 12-Month Moving Averages", "PARTITION BY Window Aggregations", "UNION ALL High-Speed Ingestion", "CPI Laspeyres Weighting"],
        citation: "DIID SQL Protocols for CPI/IIP, Section 3.1, p. 42",
        isGapTarget: true,
        gapPoints: gapMap["sql"]?.gap || 30,
        importance: "Core Remediation",
      },
      {
        id: "node-6",
        courseId: 9,
        code: "MOSPI-PY-301",
        title: "Python Data Science for Official Statistics & PLFS Cleansing",
        domain: "Python & Data Analytics",
        domainId: "python",
        phaseId: 2,
        phaseName: "2.0 Critical Competency Remediation",
        status: "IN_PROGRESS",
        progressPct: 30,
        durationHours: 10,
        level: "Intermediate",
        tpac: true,
        subtopics: ["Pandas Microdata Ingestion", "Group-wise Median Wage Imputation", "Robust Anomaly Detection (MAD)", "PLFS Validation Pipelines"],
        citation: "MoSPI Python PLFS Cookbook, Section 5, p. 33",
        isGapTarget: true,
        gapPoints: gapMap["python"]?.gap || 35,
        importance: "Core Remediation",
      },

      // Milestone 3: Advanced Applications (Weeks 8–10)
      {
        id: "node-7",
        courseId: 1,
        code: "NSSTA-ST-401",
        title: "Advanced Sampling Theory & Multi-Stage Sample Design",
        domain: "Applied Statistics & Sampling Theory",
        domainId: "stats",
        phaseId: 3,
        phaseName: "3.0 Advanced Spatial Analytics & Big Data",
        status: "LOCKED",
        progressPct: 0,
        durationHours: 12,
        level: "Advanced",
        tpac: true,
        subtopics: ["Finite Population Correction (FPC)", "Jackknife & Bootstrap Variances", "Complex Survey Weights Calibration", "Stratified Standard Errors"],
        citation: "NSSTA Operational Sampling Manual, Chapter 4, p. 28",
        importance: "Recommended",
      },
      {
        id: "node-8",
        courseId: 15,
        code: "MOSPI-GIS-304",
        title: "Satellite Imagery Integration & Urban Growth Footprint Analysis",
        domain: "GIS & Spatial Analysis",
        domainId: "gis",
        phaseId: 3,
        phaseName: "3.0 Advanced Spatial Analytics & Big Data",
        status: "LOCKED",
        progressPct: 0,
        durationHours: 12,
        level: "Advanced",
        tpac: true,
        subtopics: ["Multi-Spectral Sentinel-2 Classification", "Nighttime Lights Proxy Estimation", "Automated Zonal Clipping", "District Spatial Reporting"],
        citation: "ISRO/MoSPI Geomatics Standard, Chapter 5",
        importance: "Recommended",
      },
      {
        id: "node-9",
        courseId: 11,
        code: "MOSPI-ML-402",
        title: "Machine Learning & Automated Imputation in National Accounts",
        domain: "Python & Data Analytics",
        domainId: "python",
        phaseId: 3,
        phaseName: "3.0 Advanced Spatial Analytics & Big Data",
        status: "LOCKED",
        progressPct: 0,
        durationHours: 14,
        level: "Advanced",
        tpac: true,
        subtopics: ["Nowcasting Gross Value Added (GVA)", "Entity Matching in MCA21 Filings", "Isolation Forests for Data Audits", "Model Explainability (SHAP)"],
        citation: "NAD National Accounts Modernization Guidelines",
        importance: "Recommended",
      },

      // Milestone 4: Certification & Exit Capstone (Weeks 11–12)
      {
        id: "node-10",
        courseId: 22,
        code: "MOSPI-CERT-500",
        title: "MoSPI Statistical Officer Verification & Capstone Assessment",
        domain: "Public Data Ethics & DPDP Act 2023",
        domainId: "ethics",
        phaseId: 4,
        phaseName: "4.0 National Certification & Capstone",
        status: "LOCKED",
        progressPct: 0,
        durationHours: 16,
        level: "Advanced",
        tpac: true,
        subtopics: ["End-to-End Survey Cycle Simulation", "Multi-Domain Comprehensive Test", "Live Data Pipeline Capstone Defense", "NSSTA Digital Credential"],
        citation: "NSSTA Board of Examiners Statutory Protocol",
        importance: "Mandatory",
      },
    ];
  }, [gapMetrics]);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return roadmapNodes.filter((n) => {
      const matchSearch =
        searchFilter === "" ||
        n.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        n.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        n.subtopics.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase()));
      const matchDomain = activeDomainFilter === "All" || n.domain === activeDomainFilter;
      return matchSearch && matchDomain;
    });
  }, [roadmapNodes, searchFilter, activeDomainFilter]);

  // Group nodes by phase
  const groupedMilestones = useMemo(() => {
    const groups: Record<number, { name: string; weeks: string; status: string; nodes: RoadmapNode[] }> = {
      1: { name: "1.0 Foundation & Statutory Ethics", weeks: "Weeks 1–3", status: "COMPLETED", nodes: [] },
      2: { name: "2.0 Critical Competency Remediation", weeks: "Weeks 4–7", status: "ACTIVE", nodes: [] },
      3: { name: "3.0 Advanced Spatial Analytics & Official Big Data", weeks: "Weeks 8–10", status: "LOCKED", nodes: [] },
      4: { name: "4.0 National Statistical Officer Capstone", weeks: "Weeks 11–12", status: "LOCKED", nodes: [] },
    };

    filteredNodes.forEach((node) => {
      if (groups[node.phaseId]) {
        groups[node.phaseId].nodes.push(node);
      }
    });

    return groups;
  }, [filteredNodes]);

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, padding: "28px 32px", minHeight: "100vh", background: C.bg }}>
      {/* Roadmap Header (roadmap.sh style) */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: "#1B3D29",
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: 4,
                }}
              >
                roadmap.sh format · MoSPI FrAC
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>Role: Statistical Officer (Cadre SSS / ISS)</span>
            </div>
            <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 800, margin: "0 0 6px", color: C.dark }}>
              Statistical Officer Competency Roadmap
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: C.muted, maxWidth: 800 }}>
              Official developmental roadmap bridging measured competency deficits to meet the Ministry of Statistics & Programme Implementation (MoSPI) job role benchmark.
            </p>
          </div>

          {/* Quick Metrics & View Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* View Mode Toggle */}
            <div style={{ display: "flex", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3 }}>
              <button
                onClick={() => setViewMode("flowchart")}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  background: viewMode === "flowchart" ? "#1B3D29" : "transparent",
                  color: viewMode === "flowchart" ? "#fff" : C.dark,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🗺️ Flowchart View
              </button>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  background: viewMode === "grid" ? "#1B3D29" : "transparent",
                  color: viewMode === "grid" ? "#fff" : C.dark,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📋 Grid View
              </button>
            </div>

            {/* Skill Health Index Badge */}
            <div
              style={{
                background: "#1B3D29",
                color: "#fff",
                borderRadius: 10,
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 2px 8px rgba(27, 61, 41, 0.2)",
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: "#D4E8D8", textTransform: "uppercase", fontWeight: 700 }}>Skill Health</div>
                <div style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 800, color: C.accent }}>{skillHealth}%</div>
              </div>
              <span style={{ fontSize: 18 }}>📈</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Legend (roadmap.sh style) */}
        <div
          style={{
            marginTop: 20,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 260 }}>
            <span style={{ fontSize: 14, color: C.muted }}>🔍</span>
            <input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search topics, skills, codes (e.g. Sentinel-2, FPC, SQL)..."
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                fontSize: 13,
                fontFamily: FONT.body,
                color: C.dark,
                outline: "none",
              }}
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter("")}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted, fontSize: 13 }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Domain Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.muted }}>Domain:</span>
            <select
              value={activeDomainFilter}
              onChange={(e) => setActiveDomainFilter(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: `1px solid ${C.border}`,
                background: C.bg,
                fontSize: 12,
                color: C.dark,
                outline: "none",
                fontFamily: FONT.body,
              }}
            >
              <option value="All">All 5 FrAC Domains</option>
              <option value="Applied Statistics & Sampling Theory">Applied Statistics</option>
              <option value="SQL & Database Operations">SQL & Database</option>
              <option value="Python & Data Analytics">Python Analytics</option>
              <option value="GIS & Spatial Analysis">GIS & Spatial</option>
              <option value="Public Data Ethics & DPDP Act 2023">Data Ethics & DPDP</option>
            </select>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.s1 }} />
              <span style={{ color: C.dark, fontWeight: 500 }}>Completed</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.accent }} />
              <span style={{ color: C.dark, fontWeight: 500 }}>Active Track</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.s4 }} />
              <span style={{ color: C.dark, fontWeight: 700 }}>Critical Gap</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, border: `1px dashed ${C.border}`, background: C.surface }} />
              <span style={{ color: C.muted }}>Locked Milestone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap View */}
      {viewMode === "flowchart" ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "20px 0 60px" }}>
          {/* Vertical Connecting Spine (SVG) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 40,
              left: "50%",
              width: 4,
              transform: "translateX(-50%)",
              background: `linear-gradient(to bottom, ${C.s1} 0%, ${C.accent} 40%, ${C.border} 80%)`,
              zIndex: 1,
              borderRadius: 2,
            }}
          />

          {/* Render Milestone Stages */}
          {Object.entries(groupedMilestones).map(([phaseKey, milestone], pIdx) => {
            const phaseNum = Number(phaseKey);
            const isCompleted = milestone.status === "COMPLETED";
            const isActive = milestone.status === "ACTIVE";

            return (
              <div
                key={phaseKey}
                style={{
                  width: "100%",
                  maxWidth: 960,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 2,
                  marginBottom: 48,
                }}
              >
                {/* Milestone Hub Anchor (roadmap.sh hub box) */}
                <div
                  style={{
                    background: isCompleted ? "#1B3D29" : isActive ? "#C6851B" : C.surface,
                    color: isCompleted || isActive ? "#fff" : C.dark,
                    border: `2px solid ${isCompleted ? "#1B3D29" : isActive ? "#C6851B" : C.border}`,
                    borderRadius: 30,
                    padding: "10px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: isActive ? "0 4px 16px rgba(198, 133, 27, 0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
                    marginBottom: 24,
                    cursor: "default",
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    {isCompleted ? "✓" : isActive ? "⚡" : phaseNum}
                  </span>
                  <div>
                    <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 14, letterSpacing: "0.02em" }}>
                      {milestone.name}
                    </span>
                    <span style={{ fontSize: 12, opacity: 0.85, marginLeft: 8 }}>
                      ({milestone.weeks})
                    </span>
                  </div>
                </div>

                {/* Branch Nodes Container */}
                <div
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 20,
                    position: "relative",
                  }}
                >
                  {milestone.nodes.map((node, nIdx) => {
                    const isNodeCompleted = node.status === "COMPLETED";
                    const isNodeActive = node.status === "IN_PROGRESS";
                    const isNodeLocked = node.status === "LOCKED";
                    const isGapRemediation = node.isGapTarget;

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        style={{
                          background: C.surface,
                          border: `2px solid ${
                            isGapRemediation ? C.s4 : isNodeActive ? C.accent : isNodeCompleted ? C.s1 : C.border
                          }`,
                          borderRadius: 14,
                          padding: "18px 20px",
                          cursor: "pointer",
                          transition: "transform 0.15s ease, box-shadow 0.15s ease",
                          boxShadow: isGapRemediation
                            ? "0 4px 14px rgba(201, 78, 26, 0.15)"
                            : isNodeActive
                            ? "0 4px 14px rgba(198, 133, 27, 0.15)"
                            : "0 2px 6px rgba(0,0,0,0.04)",
                          position: "relative",
                          opacity: isNodeLocked ? 0.75 : 1,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {/* Header Badges */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                color: "#fff",
                                background: isNodeCompleted ? C.s1 : isNodeActive ? C.accent : "#5A6B5E",
                                padding: "2px 6px",
                                borderRadius: 4,
                                fontFamily: FONT.mono,
                              }}
                            >
                              {node.code}
                            </span>

                            {node.tpac && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#1B3D29",
                                  background: "#E6F4EC",
                                  border: "1px solid #1B3D2933",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                }}
                              >
                                NSSTA TPAC
                              </span>
                            )}

                            {isGapRemediation && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  color: "#fff",
                                  background: C.s4,
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                🎯 Bridges {node.gapPoints}% Gap
                              </span>
                            )}
                          </div>

                          <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>
                            {node.durationHours}h
                          </span>
                        </div>

                        {/* Node Title */}
                        <div style={{ fontWeight: 700, fontSize: 14.5, color: C.dark, lineHeight: 1.35, marginBottom: 8 }}>
                          {node.title}
                        </div>

                        {/* Domain Tag */}
                        <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 12 }}>
                          Domain: <strong style={{ color: C.dark }}>{node.domain}</strong>
                        </div>

                        {/* roadmap.sh style Subtopic Chips */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                          {node.subtopics.map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              style={{
                                fontSize: 11,
                                background: C.bg,
                                color: C.dark,
                                border: `1px solid ${C.border}`,
                                padding: "2px 7px",
                                borderRadius: 4,
                              }}
                            >
                              {sub}
                            </span>
                          ))}
                        </div>

                        {/* Bottom Status Row */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: 10,
                            borderTop: `1px solid ${C.border}`,
                            fontSize: 11.5,
                          }}
                        >
                          <span style={{ color: C.muted }}>
                            Status:{" "}
                            <strong style={{ color: isNodeCompleted ? C.s1 : isNodeActive ? C.accent : C.muted }}>
                              {isNodeCompleted ? "Completed ✓" : isNodeActive ? "In Progress ⚡" : "Locked 🔒"}
                            </strong>
                          </span>

                          <span style={{ color: C.accent, fontWeight: 700, fontSize: 12 }}>
                            Inspect Node →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid View Mode */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 16 }}>
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "18px 20px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: FONT.mono }}>{node.code}</span>
                <span style={{ fontSize: 11, color: C.faint }}>{node.durationHours}h</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 6 }}>{node.title}</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{node.domain}</div>
              <div style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>Click to inspect topic details →</div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-Out Inspector Drawer (roadmap.sh topic details modal) */}
      {selectedNode && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setSelectedNode(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: C.surface,
              height: "100%",
              padding: "28px 30px",
              boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#fff",
                    background: "#1B3D29",
                    padding: "3px 8px",
                    borderRadius: 4,
                    fontFamily: FONT.mono,
                  }}
                >
                  {selectedNode.code}
                </span>

                {selectedNode.tpac && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#1B3D29", background: "#E6F4EC", padding: "3px 8px", borderRadius: 4 }}>
                    🎖️ NSSTA TPAC
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: C.muted }}
              >
                ✕
              </button>
            </div>

            {/* Title & Domain */}
            <div>
              <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 800, color: C.dark, margin: "0 0 6px" }}>
                {selectedNode.title}
              </h2>
              <div style={{ fontSize: 13, color: C.muted }}>
                Domain: <strong>{selectedNode.domain}</strong> · {selectedNode.level} Level · {selectedNode.durationHours} Hours
              </div>
            </div>

            {/* Remediation Callout if applicable */}
            {selectedNode.isGapTarget && (
              <div
                style={{
                  background: "#FDECEA",
                  border: `1.5px solid ${C.s4}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontSize: 12.5,
                  color: C.dark,
                  lineHeight: 1.4,
                }}
              >
                <strong style={{ color: C.s4 }}>🔴 Critical Competency Remediation:</strong>
                <div>
                  This module directly addresses your <strong>{selectedNode.gapPoints}% measured deficit</strong> on the FrAC diagnostic test. Completion is essential to satisfy MoSPI Statistical Officer benchmarks.
                </div>
              </div>
            )}

            {/* Subtopics Checklist */}
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 10 }}>
                Roadmap Sub-topics & Skills:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedNode.subtopics.map((topic, tIdx) => (
                  <div key={tIdx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.dark }}>
                    <span style={{ color: selectedNode.status === "COMPLETED" ? C.s1 : C.accent, fontWeight: 700 }}>
                      {selectedNode.status === "COMPLETED" ? "✓" : "•"}
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Verifiable Citation */}
            <div style={{ padding: "12px 14px", background: "#F5F1E6", borderRadius: 8, border: "1px dashed #C6851B", fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: "#8C3B17", marginBottom: 3 }}>📖 Official MoSPI / NSSTA Reference:</div>
              <div style={{ color: C.dark }}>{selectedNode.citation}</div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => navigate(`/student/courses/${selectedNode.courseId}`)}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  background: "#1B3D29",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: FONT.body,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(27, 61, 41, 0.25)",
                }}
              >
                Open Course Curriculum →
              </button>

              <button
                onClick={() => {
                  alert(`[iGOT Karmayogi Deep Link]\nSimulating direct single-sign-on launch to course ${selectedNode.code} on the official iGOT Karmayogi portal.`);
                }}
                style={{
                  width: "100%",
                  padding: "10px 0",
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
                Launch on iGOT Karmayogi ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
