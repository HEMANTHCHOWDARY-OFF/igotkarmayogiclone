import { useState } from "react";
import { C, FONT } from "@/tokens";

const COURSES = [
  { id: 1, title: "Foundation Course in Governance", source: "iGOT", domain: "Governance", level: "Beginner", duration: "20 hrs", enrolled: 3420, completion: 94, status: "Active" },
  { id: 2, title: "Ethics & Integrity in Public Service", source: "Internal", domain: "Ethics", level: "Intermediate", duration: "15 hrs", enrolled: 2840, completion: 88, status: "Active" },
  { id: 3, title: "Digital Governance Fundamentals", source: "iGOT", domain: "Digital", level: "Beginner", duration: "12 hrs", enrolled: 2200, completion: 72, status: "Active" },
  { id: 4, title: "Public Finance Management", source: "Internal", domain: "Finance", level: "Advanced", duration: "30 hrs", enrolled: 1800, completion: 65, status: "Active" },
  { id: 5, title: "Constitutional Law & Administration", source: "iGOT", domain: "Legal", level: "Intermediate", duration: "25 hrs", enrolled: 1560, completion: 80, status: "Active" },
  { id: 6, title: "Policy Analysis & Formulation", source: "Internal", domain: "Policy", level: "Advanced", duration: "20 hrs", enrolled: 1240, completion: 58, status: "Draft" },
  { id: 7, title: "Data-Driven Decision Making", source: "iGOT", domain: "Digital", level: "Intermediate", duration: "18 hrs", enrolled: 980, completion: 45, status: "Draft" },
  { id: 8, title: "Leadership & Change Management", source: "Internal", domain: "Governance", level: "Advanced", duration: "22 hrs", enrolled: 760, completion: 0, status: "Archived" },
  { id: 9, title: "RTI & Transparency", source: "iGOT", domain: "Legal", level: "Beginner", duration: "8 hrs", enrolled: 3100, completion: 91, status: "Active" },
  { id: 10, title: "Rural Development Schemes", source: "Internal", domain: "Policy", level: "Intermediate", duration: "16 hrs", enrolled: 420, completion: 0, status: "Archived" },
];

const TABS = ["All Courses", "iGOT Mapped", "Internal", "Archived"];
const DOMAINS = ["All Domains", "Governance", "Ethics", "Digital", "Finance", "Legal", "Policy"];
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const STATUSES_FILTER = ["All Statuses", "Active", "Draft", "Archived"];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Active: { bg: "#E6F4EC", color: C.s1 },
  Draft: { bg: "#FEF5E7", color: C.s2 },
  Archived: { bg: "#EBEBEB", color: "#666" },
};

export default function CourseManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All Domains");
  const [level, setLevel] = useState("All Levels");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selected, setSelected] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");

  const filtered = COURSES.filter((c) => {
    const tabMatch =
      activeTab === 0 ||
      (activeTab === 1 && c.source === "iGOT") ||
      (activeTab === 2 && c.source === "Internal") ||
      (activeTab === 3 && c.status === "Archived");
    const searchMatch = c.title.toLowerCase().includes(search.toLowerCase());
    const domainMatch = domain === "All Domains" || c.domain === domain;
    const levelMatch = level === "All Levels" || c.level === level;
    const statusMatch = statusFilter === "All Statuses" || c.status === statusFilter;
    return tabMatch && searchMatch && domainMatch && levelMatch && statusMatch;
  });

  const toggleSelect = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((c) => c.id));

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
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0 }}>Course Management</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>450 courses in the catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontFamily: FONT.body, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          + Add Course
        </button>
      </div>

      {/* Add Course Inline Card */}
      {showAddModal && (
        <div style={{ background: C.surface, border: `1px solid ${C.accent}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 600 }}>Add New Course</div>
            <button onClick={() => setShowAddModal(false)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>x</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {["Course Title", "Domain", "Source (iGOT / Internal)", "Level", "Duration (hrs)", "Status"].map((f) => (
              <div key={f}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{f}</div>
                <input placeholder={`Enter ${f.toLowerCase()}`} style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 14, fontFamily: FONT.body, fontWeight: 600, cursor: "pointer" }}>Save Course</button>
            <button onClick={() => setShowAddModal(false)} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 20px", fontSize: 14, fontFamily: FONT.body, color: C.muted, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

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
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={selectStyle} value={domain} onChange={(e) => setDomain(e.target.value)}>
          {DOMAINS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select style={selectStyle} value={level} onChange={(e) => setLevel(e.target.value)}>
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUSES_FILTER.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Bulk action */}
      {selected.length > 0 && (
        <div style={{ background: C.dark, color: "#fff", borderRadius: 8, padding: "10px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13 }}>{selected.length} course(s) selected</span>
          <select
            style={{ background: C.surface, border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 13, color: C.dark, fontFamily: FONT.body }}
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
          >
            <option value="">Set Status...</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
          <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: FONT.body }}>Apply</button>
          <button style={{ background: "transparent", color: "#aaa", border: "none", fontSize: 13, cursor: "pointer", marginLeft: "auto" }} onClick={() => setSelected([])}>Clear</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: C.surface, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              <th style={{ width: 40, padding: "12px 14px" }}>
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
              </th>
              {["Course Title", "Source", "Domain", "Level", "Duration", "Enrolled", "Completion", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", background: selected.includes(c.id) ? "#F0EDE4" : "transparent" }}>
                <td style={{ padding: "12px 14px" }}>
                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 500, maxWidth: 240 }}>
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ background: c.source === "iGOT" ? "#E8F0FE" : "#F3EDE0", color: c.source === "iGOT" ? "#1A56DB" : C.s2, borderRadius: 6, padding: "3px 8px", fontSize: 12, fontWeight: 600 }}>{c.source}</span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13 }}>{c.domain}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: C.muted }}>{c.level}</td>
                <td style={{ padding: "12px 14px", fontSize: 13 }}>{c.duration}</td>
                <td style={{ padding: "12px 14px", fontSize: 13 }}>{c.enrolled.toLocaleString()}</td>
                <td style={{ padding: "12px 14px", minWidth: 120 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${c.completion}%`, background: c.completion >= 80 ? C.s1 : c.completion >= 50 ? C.s2 : C.s4, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: C.muted }}>{c.completion}%</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ ...STATUS_STYLE[c.status], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{c.status}</span>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["Edit", "Archive", "Preview"].map((a) => (
                      <button key={a} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.dark, cursor: "pointer", fontFamily: FONT.body }}>{a}</button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 13, color: C.muted }}>Showing {filtered.length} of 450 courses</span>
        </div>
      </div>
    </div>
  );
}
