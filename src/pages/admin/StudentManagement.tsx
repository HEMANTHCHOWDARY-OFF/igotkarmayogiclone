import { useState } from "react";
import { C, FONT } from "@/tokens";

const STUDENTS = [
  { id: 1, name: "Priya Sharma", initials: "PS", service: "IAS", dept: "Ministry of Finance", batch: 2019, courses: 6, completion: 94, lastActive: "Today", status: "Active" },
  { id: 2, name: "Rajesh Kumar", initials: "RK", service: "IPS", dept: "MHA", batch: 2020, courses: 4, completion: 87, lastActive: "Yesterday", status: "Active" },
  { id: 3, name: "Anita Verma", initials: "AV", service: "IRS", dept: "Ministry of Revenue", batch: 2018, courses: 8, completion: 98, lastActive: "Today", status: "Active" },
  { id: 4, name: "Suresh Nair", initials: "SN", service: "IFS", dept: "MEA", batch: 2021, courses: 3, completion: 45, lastActive: "5 days ago", status: "At-Risk" },
  { id: 5, name: "Meena Pillai", initials: "MP", service: "IAS", dept: "DOPT", batch: 2017, courses: 10, completion: 100, lastActive: "Today", status: "Active" },
  { id: 6, name: "Vikram Singh", initials: "VS", service: "IPS", dept: "Ministry of Home", batch: 2022, courses: 2, completion: 30, lastActive: "12 days ago", status: "At-Risk" },
  { id: 7, name: "Deepa Reddy", initials: "DR", service: "IRS", dept: "CBDT", batch: 2019, courses: 5, completion: 80, lastActive: "3 days ago", status: "Active" },
  { id: 8, name: "Arjun Mehta", initials: "AM", service: "IAS", dept: "Planning Commission", batch: 2020, courses: 1, completion: 0, lastActive: "30 days ago", status: "Inactive" },
  { id: 9, name: "Sunita Joshi", initials: "SJ", service: "IFS", dept: "Ministry of External Affairs", batch: 2021, courses: 4, completion: 72, lastActive: "2 days ago", status: "Active" },
  { id: 10, name: "Ravi Patel", initials: "RP", service: "IRS", dept: "CBIC", batch: 2018, courses: 7, completion: 91, lastActive: "Today", status: "Active" },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Active: { bg: "#E6F4EC", color: C.s1 },
  Inactive: { bg: "#EBEBEB", color: "#666" },
  "At-Risk": { bg: "#FDEEE9", color: C.s4 },
};

const DEPTS = ["All Departments", "Ministry of Finance", "MHA", "Ministry of Revenue", "MEA", "DOPT", "Ministry of Home", "CBDT", "CBIC"];
const SERVICES = ["All Services", "IAS", "IPS", "IRS", "IFS"];
const BATCHES = ["All Batches", "2017", "2018", "2019", "2020", "2021", "2022"];

export default function StudentManagement() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [service, setService] = useState("All Services");
  const [batch, setBatch] = useState("All Batches");
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.dept.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "All Departments" || s.dept === dept;
    const matchService = service === "All Services" || s.service === service;
    const matchBatch = batch === "All Batches" || String(s.batch) === batch;
    return matchSearch && matchDept && matchService && matchBatch;
  });

  const toggleSelect = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((s) => s.id));

  const inputStyle = {
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
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0 }}>Student Management</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>12,840 students enrolled across all departments</p>
        </div>
        <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontFamily: FONT.body, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Add Student
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Active Students", value: "8,420", color: C.s1 },
          { label: "Inactive Students", value: "3,980", color: C.faint },
          { label: "At-Risk Students", value: "440", color: C.s4 },
        ].map((s) => (
          <div key={s.label} style={{ background: C.surface, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: FONT.display, color: C.dark }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <input
          style={{ ...inputStyle, width: 220 }}
          placeholder="Search by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={inputStyle} value={service} onChange={(e) => setService(e.target.value)}>
          {SERVICES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select style={inputStyle} value={dept} onChange={(e) => setDept(e.target.value)}>
          {DEPTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select style={inputStyle} value={batch} onChange={(e) => setBatch(e.target.value)}>
          {BATCHES.map((b) => <option key={b}>{b}</option>)}
        </select>
        <button style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontFamily: FONT.body, color: C.muted, cursor: "pointer" }}>
          Export CSV
        </button>
      </div>

      {/* Bulk action */}
      {selected.length > 0 && (
        <div style={{ background: C.dark, color: "#fff", borderRadius: 8, padding: "10px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13 }}>{selected.length} student(s) selected</span>
          <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: FONT.body }}>
            Assign Course
          </button>
          <button style={{ background: "transparent", color: "#aaa", border: "none", fontSize: 13, cursor: "pointer", marginLeft: "auto" }} onClick={() => setSelected([])}>
            Clear
          </button>
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
              {["Student", "Service", "Dept / Ministry", "Batch", "Courses", "Completion", "Last Active", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", background: selected.includes(s.id) ? "#F0EDE4" : "transparent" }}>
                <td style={{ padding: "12px 14px" }}>
                  <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} />
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {s.initials}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13 }}>{s.service}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: C.muted }}>{s.dept}</td>
                <td style={{ padding: "12px 14px", fontSize: 13 }}>{s.batch}</td>
                <td style={{ padding: "12px 14px", fontSize: 13 }}>{s.courses}</td>
                <td style={{ padding: "12px 14px", minWidth: 140 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.completion}%`, background: s.completion >= 80 ? C.s1 : s.completion >= 50 ? C.s2 : C.s4, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: C.muted, minWidth: 32 }}>{s.completion}%</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: C.faint }}>{s.lastActive}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ ...STATUS_COLORS[s.status], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.dark, cursor: "pointer", fontFamily: FONT.body }}>View</button>
                    <button style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.dark, cursor: "pointer", fontFamily: FONT.body }}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: C.muted }}>Showing 1–{filtered.length} of 12,840 students</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3, "...", 1284].map((p, i) => (
              <button key={i} style={{ width: 32, height: 32, border: `1px solid ${p === 1 ? C.dark : C.border}`, borderRadius: 6, background: p === 1 ? C.dark : "transparent", color: p === 1 ? "#fff" : C.muted, fontSize: 13, cursor: "pointer", fontFamily: FONT.body }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
