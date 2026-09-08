import { useState } from "react";
import { C, FONT } from "@/tokens";

export interface CourseItem {
  id: number;
  title: string;
  source: "Standard" | "Elective";
  domain: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  enrolled: number;
  completion: number;
  status: "Active" | "Draft" | "Archived";
  instructor: string;
  desc: string;
  modulesCount: number;
}

const INITIAL_COURSES: CourseItem[] = [
  {
    id: 1,
    title: "Foundation Course in Governance",
    source: "Standard",
    domain: "Governance",
    level: "Beginner",
    duration: "20 hrs",
    enrolled: 3420,
    completion: 94,
    status: "Active",
    instructor: "LBSNAA Faculty Council",
    desc: "Comprehensive orientation to public administration, constitutional foundations, and ethical executive decision making in Indian administrative services.",
    modulesCount: 8,
  },
  {
    id: 2,
    title: "Ethics & Integrity in Public Service",
    source: "Elective",
    domain: "Ethics",
    level: "Intermediate",
    duration: "15 hrs",
    enrolled: 2840,
    completion: 88,
    status: "Active",
    instructor: "Central Vigilance Commission Training Wing",
    desc: "Frameworks for resolving ethical dilemmas, anti-corruption vigilance mechanisms, and fostering moral leadership in governance.",
    modulesCount: 6,
  },
  {
    id: 3,
    title: "Digital Governance Fundamentals",
    source: "Standard",
    domain: "Digital",
    level: "Beginner",
    duration: "12 hrs",
    enrolled: 2200,
    completion: 72,
    status: "Active",
    instructor: "National e-Governance Division (NeGD)",
    desc: "Foundations of India Stack, DigiLocker, Aadhaar authentication, API architecture, and paperless administrative processes.",
    modulesCount: 5,
  },
  {
    id: 4,
    title: "Public Finance Management",
    source: "Elective",
    domain: "Finance",
    level: "Advanced",
    duration: "30 hrs",
    enrolled: 1800,
    completion: 65,
    status: "Active",
    instructor: "National Institute of Financial Management",
    desc: "General Financial Rules (GFR), Government e-Marketplace (GeM) procurement, outcome budgeting, and fiscal deficit management.",
    modulesCount: 10,
  },
  {
    id: 5,
    title: "Constitutional Law & Administration",
    source: "Standard",
    domain: "Legal",
    level: "Intermediate",
    duration: "25 hrs",
    enrolled: 1560,
    completion: 80,
    status: "Active",
    instructor: "National Law University & DOPT Legal Cell",
    desc: "Fundamental rights jurisprudence, writ petitions, administrative tribunal proceedings, and statutory compliance frameworks.",
    modulesCount: 8,
  },
  {
    id: 6,
    title: "Policy Analysis & Formulation",
    source: "Elective",
    domain: "Policy",
    level: "Advanced",
    duration: "20 hrs",
    enrolled: 1240,
    completion: 58,
    status: "Draft",
    instructor: "NITI Aayog Policy Cell",
    desc: "Evidence-based policy formulation, cost-benefit analysis, regulatory impact assessments, and stakeholder consultation protocols.",
    modulesCount: 7,
  },
  {
    id: 7,
    title: "Data-Driven Decision Making",
    source: "Standard",
    domain: "Digital",
    level: "Intermediate",
    duration: "18 hrs",
    enrolled: 980,
    completion: 45,
    status: "Draft",
    instructor: "DIID & MoSPI Analytics Directorate",
    desc: "Survey microdata interpretation, national sample survey estimation, data visualization dashboards, and predictive public policy modeling.",
    modulesCount: 6,
  },
  {
    id: 8,
    title: "Leadership & Change Management",
    source: "Elective",
    domain: "Governance",
    level: "Advanced",
    duration: "22 hrs",
    enrolled: 760,
    completion: 0,
    status: "Archived",
    instructor: "Indian Institute of Public Administration (IIPA)",
    desc: "Leading organizational reform, stakeholder alignment, managing administrative resistance, and empathetic civil service leadership.",
    modulesCount: 6,
  },
  {
    id: 9,
    title: "Transparency & Information Access",
    source: "Standard",
    domain: "Legal",
    level: "Beginner",
    duration: "8 hrs",
    enrolled: 3100,
    completion: 91,
    status: "Active",
    instructor: "Central Information Commission (CIC)",
    desc: "Mastery of the Right to Information (RTI) Act, proactive disclosures, exemption clauses under Section 8, and appellate guidelines.",
    modulesCount: 4,
  },
  {
    id: 10,
    title: "Regional Development Models",
    source: "Elective",
    domain: "Policy",
    level: "Intermediate",
    duration: "16 hrs",
    enrolled: 420,
    completion: 0,
    status: "Archived",
    instructor: "Tribal Affairs & Panchayati Raj Institute",
    desc: "Aspirational districts programme, decentralised planning frameworks, and grassroots tribal development strategies.",
    modulesCount: 5,
  },
  {
    id: 11,
    title: "Advanced Sampling Theory & NSS Estimation",
    source: "Standard",
    domain: "Finance",
    level: "Advanced",
    duration: "24 hrs",
    enrolled: 1890,
    completion: 86,
    status: "Active",
    instructor: "National Statistical Systems Training Academy (NSSTA)",
    desc: "Stratified multi-stage sampling, finite population corrections, variance estimation via Jackknife, and MoSPI survey weights calibration.",
    modulesCount: 8,
  },
];

const TABS = ["All Courses", "Standard Mapped", "Electives", "Archived"];
const DOMAINS = ["All Domains", "Governance", "Ethics", "Digital", "Finance", "Legal", "Policy"];
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const STATUSES_FILTER = ["All Statuses", "Active", "Draft", "Archived"];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Active: { bg: "#E6F4EC", color: C.s1 },
  Draft: { bg: "#FEF5E7", color: C.s2 },
  Archived: { bg: "#EBEBEB", color: "#666" },
};

export default function CourseManagement() {
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All Domains");
  const [level, setLevel] = useState("All Levels");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selected, setSelected] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewingCourse, setPreviewingCourse] = useState<CourseItem | null>(null);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // New Course Form state
  const [newCourse, setNewCourse] = useState({
    title: "",
    source: "Standard" as "Standard" | "Elective",
    domain: "Governance",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    duration: "15 hrs",
    instructor: "DOPT National Training Council",
    status: "Active" as "Active" | "Draft" | "Archived",
    desc: "",
    modulesCount: 6,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = courses.filter((c) => {
    const tabMatch =
      activeTab === 0 ||
      (activeTab === 1 && c.source === "Standard") ||
      (activeTab === 2 && c.source === "Elective") ||
      (activeTab === 3 && c.status === "Archived");
    const searchMatch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const domainMatch = domain === "All Domains" || c.domain === domain;
    const levelMatch = level === "All Levels" || c.level === level;
    const statusMatch = statusFilter === "All Statuses" || c.status === statusFilter;
    return tabMatch && searchMatch && domainMatch && levelMatch && statusMatch;
  });

  const toggleSelect = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((c) => c.id));

  // Add Course
  const handleSaveNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;

    const created: CourseItem = {
      id: Date.now(),
      title: newCourse.title.trim(),
      source: newCourse.source,
      domain: newCourse.domain,
      level: newCourse.level,
      duration: newCourse.duration || "15 hrs",
      enrolled: 0,
      completion: 0,
      status: newCourse.status,
      instructor: newCourse.instructor || "Civil Service Academy",
      desc: newCourse.desc || "Comprehensive capacity building module aligned with MoSPI FrAC standards.",
      modulesCount: Number(newCourse.modulesCount) || 5,
    };

    setCourses([created, ...courses]);
    setShowAddModal(false);
    setNewCourse({
      title: "",
      source: "Standard",
      domain: "Governance",
      level: "Beginner",
      duration: "15 hrs",
      instructor: "DOPT National Training Council",
      status: "Active",
      desc: "",
      modulesCount: 6,
    });
    showToast(`Course "${created.title}" successfully added to catalog.`);
  };

  // Edit Course Save
  const handleSaveEditCourse = () => {
    if (!editingCourse) return;
    setCourses((prev) =>
      prev.map((c) => (c.id === editingCourse.id ? { ...editingCourse } : c))
    );
    showToast(`Updated course "${editingCourse.title}".`);
    setEditingCourse(null);
  };

  // Archive / Restore Toggle
  const handleToggleArchive = (course: CourseItem) => {
    const nextStatus = course.status === "Archived" ? "Active" : "Archived";
    setCourses((prev) =>
      prev.map((c) => (c.id === course.id ? { ...c, status: nextStatus } : c))
    );
    showToast(`Course "${course.title}" marked as ${nextStatus}.`);
  };

  // Delete Course
  const handleDeleteCourse = () => {
    if (deletingCourseId === null) return;
    setCourses((prev) => prev.filter((c) => c.id !== deletingCourseId));
    setSelected((prev) => prev.filter((id) => id !== deletingCourseId));
    showToast("Course removed from catalog.");
    setDeletingCourseId(null);
  };

  // Bulk Status Update
  const handleApplyBulkStatus = () => {
    if (!bulkStatus || selected.length === 0) return;
    setCourses((prev) =>
      prev.map((c) => (selected.includes(c.id) ? { ...c, status: bulkStatus as any } : c))
    );
    showToast(`Updated status to "${bulkStatus}" for ${selected.length} course(s).`);
    setSelected([]);
    setBulkStatus("");
  };

  // Export Catalog CSV
  const handleExportCatalogCSV = () => {
    const header = "ID,Course Title,Source,Domain,Level,Duration,Enrolled,Completion Rate,Status,Instructor\n";
    const rows = filtered
      .map(
        (c) =>
          `"${c.id}","${c.title}","${c.source}","${c.domain}","${c.level}","${c.duration}","${c.enrolled}","${c.completion}%","${c.status}","${c.instructor}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "igot_course_catalog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} courses to CSV.`);
  };

  const selectStyle = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: FONT.body,
    color: C.dark,
    outline: "none",
  };

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, position: "relative" }}>
      {/* Toast Alert */}
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

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0 }}>Course Management</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>
            {courses.length} courses in the iGOT Karmayogi administrative catalog
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleExportCatalogCSV}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "10px 18px",
              fontFamily: FONT.body,
              fontSize: 13,
              fontWeight: 600,
              color: C.dark,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>📥</span> Export Catalog CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontFamily: FONT.body,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>+ Add Course</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: activeTab === i ? `2px solid ${C.accent}` : "2px solid transparent",
              padding: "10px 20px",
              fontFamily: FONT.body,
              fontSize: 14,
              fontWeight: activeTab === i ? 600 : 400,
              color: activeTab === i ? C.dark : C.muted,
              cursor: "pointer",
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <input
          style={{ ...selectStyle, width: 240 }}
          placeholder="Search courses or instructors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={selectStyle} value={domain} onChange={(e) => setDomain(e.target.value)}>
          {DOMAINS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select style={selectStyle} value={level} onChange={(e) => setLevel(e.target.value)}>
          {LEVELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUSES_FILTER.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Bulk action */}
      {selected.length > 0 && (
        <div style={{ background: C.dark, color: "#fff", borderRadius: 8, padding: "10px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{selected.length} course(s) selected</span>
          <select
            style={{ background: C.surface, border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 13, color: C.dark, fontFamily: FONT.body }}
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
          >
            <option value="">Set Status...</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
          <button
            onClick={handleApplyBulkStatus}
            style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: FONT.body, fontWeight: 600 }}
          >
            Apply
          </button>
          <button
            onClick={() => {
              setCourses((prev) => prev.filter((c) => !selected.includes(c.id)));
              showToast(`Deleted ${selected.length} course(s).`);
              setSelected([]);
            }}
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
          >
            Delete Selected
          </button>
          <button style={{ background: "transparent", color: "#aaa", border: "none", fontSize: 13, cursor: "pointer", marginLeft: "auto" }} onClick={() => setSelected([])}>
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: C.surface, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", border: `1px solid ${C.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              <th style={{ width: 40, padding: "12px 14px" }}>
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
              </th>
              {["Course Title", "Source", "Domain", "Level", "Duration", "Enrolled", "Completion", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: "32px", textAlign: "center", color: C.muted, fontSize: 14 }}>
                  No courses found matching the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                    background: selected.includes(c.id) ? "#F0EDE4" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected.includes(c.id)) e.currentTarget.style.background = "#FAF8F4";
                  }}
                  onMouseLeave={(e) => {
                    if (!selected.includes(c.id)) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, maxWidth: 260 }}>
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: C.dark }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.instructor}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        background: c.source === "Standard" ? "#E8F0FE" : "#F3EDE0",
                        color: c.source === "Standard" ? "#1A56DB" : C.s2,
                        borderRadius: 6,
                        padding: "3px 8px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {c.source}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13 }}>{c.domain}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: C.muted }}>{c.level}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13 }}>{c.duration}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600 }}>{c.enrolled.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px", minWidth: 120 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${c.completion}%`,
                            background: c.completion >= 80 ? C.s1 : c.completion >= 50 ? C.s2 : C.s4,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: C.muted }}>{c.completion}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ ...STATUS_STYLE[c.status], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => setPreviewingCourse(c)}
                        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.dark, cursor: "pointer", fontFamily: FONT.body }}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setEditingCourse(c)}
                        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.dark, cursor: "pointer", fontFamily: FONT.body }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleArchive(c)}
                        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.muted, cursor: "pointer", fontFamily: FONT.body }}
                      >
                        {c.status === "Archived" ? "Restore" : "Archive"}
                      </button>
                      <button
                        onClick={() => setDeletingCourseId(c.id)}
                        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.s4, cursor: "pointer", fontFamily: FONT.body }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: C.muted }}>
            Showing {filtered.length} of {courses.length} courses
          </span>
        </div>
      </div>

      {/* ── Add Course Modal ─────────────────────────────────────────── */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 600,
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0, color: C.dark }}>
                Add New Course to Catalog
              </h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewCourse} style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Course Title *</label>
                  <input
                    required
                    placeholder="e.g. Statistical Inference & NSS Microdata Analysis"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Domain *</label>
                  <select
                    value={newCourse.domain}
                    onChange={(e) => setNewCourse({ ...newCourse, domain: e.target.value })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    {DOMAINS.filter((d) => d !== "All Domains").map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Source *</label>
                  <select
                    value={newCourse.source}
                    onChange={(e) => setNewCourse({ ...newCourse, source: e.target.value as any })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    <option value="Standard">Standard Mapped</option>
                    <option value="Elective">Elective</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Level *</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value as any })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Duration *</label>
                  <input
                    placeholder="e.g. 18 hrs"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Instructor / Institution</label>
                  <input
                    placeholder="e.g. NSSTA Faculty Cell"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Publication Status</label>
                  <select
                    value={newCourse.status}
                    onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value as any })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Curriculum Description</label>
                  <textarea
                    rows={3}
                    placeholder="Outline learning objectives, pedagogical methods, and expected capacity impact..."
                    value={newCourse.desc}
                    onChange={(e) => setNewCourse({ ...newCourse, desc: e.target.value })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box", resize: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 18px", fontSize: 13, color: C.muted, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Course Modal ────────────────────────────────────────── */}
      {editingCourse && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setEditingCourse(null)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 560,
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0, color: C.dark }}>
                Edit Course Details
              </h2>
              <button onClick={() => setEditingCourse(null)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Course Title</label>
                  <input
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Domain</label>
                  <select
                    value={editingCourse.domain}
                    onChange={(e) => setEditingCourse({ ...editingCourse, domain: e.target.value })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    {DOMAINS.filter((d) => d !== "All Domains").map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value as any })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Duration</label>
                  <input
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Status</label>
                  <select
                    value={editingCourse.status}
                    onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value as any })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Instructor</label>
                  <input
                    value={editingCourse.instructor}
                    onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                    style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setEditingCourse(null)}
                  style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 18px", fontSize: 13, color: C.muted, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditCourse}
                  style={{ background: C.s1, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Course Preview Modal ─────────────────────────────────────── */}
      {previewingCourse && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setPreviewingCourse(null)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 600,
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    background: previewingCourse.source === "Standard" ? "#E8F0FE" : "#F3EDE0",
                    color: previewingCourse.source === "Standard" ? "#1A56DB" : C.s2,
                    borderRadius: 6,
                    padding: "3px 8px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {previewingCourse.source}
                </span>
                <span style={{ fontSize: 12, color: C.muted }}>· {previewingCourse.domain} Domain</span>
              </div>
              <button onClick={() => setPreviewingCourse(null)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: C.dark }}>
                {previewingCourse.title}
              </h2>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
                Provided by <strong>{previewingCourse.instructor}</strong>
              </div>

              <div style={{ background: C.bg, borderRadius: 10, padding: "16px", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.muted }}>Duration</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginTop: 2 }}>{previewingCourse.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: C.muted }}>Enrolled</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginTop: 2 }}>{previewingCourse.enrolled.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: C.muted }}>Avg Completion</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.s1, marginTop: 2 }}>{previewingCourse.completion}%</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 6 }}>Curriculum Overview</div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                  {previewingCourse.desc}
                </p>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 8 }}>Included Modules ({previewingCourse.modulesCount})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Array.from({ length: previewingCourse.modulesCount }, (_, i) => (
                    <div key={i} style={{ background: C.bg, padding: "8px 12px", borderRadius: 6, fontSize: 12, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}` }}>
                      <span style={{ color: C.accent, fontWeight: 700 }}>Module {i + 1}:</span>
                      <span>Topic {i + 1} Foundations & Practical Case Studies</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "14px 24px", background: C.bg, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setPreviewingCourse(null)}
                style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Course Modal ──────────────────────────────────────── */}
      {deletingCourseId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setDeletingCourseId(null)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 420,
              padding: "24px",
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: C.dark, marginBottom: 8 }}>Remove Course?</div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, margin: "0 0 20px" }}>
              Are you sure you want to remove this course from the public catalog? Any active student progress will be preserved in archival logs.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setDeletingCourseId(null)}
                style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, color: C.muted, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                style={{ background: C.s4, color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
