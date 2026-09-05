import { useState } from "react";
import { Link } from "react-router";
import { C, FONT } from "@/tokens";

const allCourses = [
  { id: 1, icon: "📊", title: "Data-Driven Governance", dept: "DoPT", source: "iGOT", level: "Intermediate", duration: 6, domain: "Digital", desc: "Learn to leverage data analytics for effective policy making and governance decisions." },
  { id: 2, icon: "📜", title: "Public Policy Essentials", dept: "DAR&PG", source: "iGOT", level: "Beginner", duration: 3, domain: "Policy", desc: "Foundational concepts of public policy formulation, implementation, and evaluation." },
  { id: 3, icon: "💻", title: "Foundational Digital Literacy", dept: "MeitY", source: "iGOT", level: "Beginner", duration: 2, domain: "Digital", desc: "Essential digital skills for modern civil servants in a technology-driven government." },
  { id: 4, icon: "🤝", title: "Citizen-Centric Service Delivery", dept: "DARPG", source: "Internal", level: "Intermediate", duration: 5, domain: "Service", desc: "Design and deliver government services that truly meet citizens' needs and expectations." },
  { id: 5, icon: "🏛️", title: "Constitutional Framework of India", dept: "MoLJ", source: "iGOT", level: "Advanced", duration: 10, domain: "Governance", desc: "Deep dive into constitutional provisions relevant to civil service administration." },
  { id: 6, icon: "💰", title: "Public Finance Management", dept: "MoF", source: "iGOT", level: "Advanced", duration: 8, domain: "Finance", desc: "Budgeting, expenditure management, and financial accountability in government." },
  { id: 7, icon: "🌱", title: "Sustainable Development Goals", dept: "NITI Aayog", source: "Internal", level: "Beginner", duration: 3, domain: "Policy", desc: "India's commitment to the UN SDGs and the role of civil servants in achieving them." },
  { id: 8, icon: "🗣️", title: "Effective Communication", dept: "DoPT", source: "iGOT", level: "Intermediate", duration: 4, domain: "Service", desc: "Communication strategies for civil servants in meetings, reports, and public engagement." },
];

const domains = ["Digital", "Policy", "Governance", "Finance", "Service", "Ethics"];
const levels = ["Beginner", "Intermediate", "Advanced"];
const durations = ["< 4h", "4–8h", "8h+"];
const sources = ["iGOT", "Internal"];

const levelColor = (level: string) => {
  if (level === "Beginner") return { bg: "#EBF5F0", color: C.s1 };
  if (level === "Intermediate") return { bg: "#FFF3DC", color: C.accent };
  return { bg: "#FFE8E2", color: C.s4 };
};

export default function CourseDiscovery() {
  const [search, setSearch] = useState("");
  const [selDomains, setSelDomains] = useState<string[]>([]);
  const [selLevels, setSelLevels] = useState<string[]>([]);
  const [selDurations, setSelDurations] = useState<string[]>([]);
  const [selSources, setSelSources] = useState<string[]>([]);
  const [sort, setSort] = useState("Relevance");

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const filtered = allCourses.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.desc.toLowerCase().includes(search.toLowerCase())) return false;
    if (selDomains.length && !selDomains.includes(c.domain)) return false;
    if (selLevels.length && !selLevels.includes(c.level)) return false;
    if (selSources.length && !selSources.includes(c.source)) return false;
    if (selDurations.length) {
      const matched = selDurations.some(d => {
        if (d === "< 4h") return c.duration < 4;
        if (d === "4–8h") return c.duration >= 4 && c.duration <= 8;
        return c.duration > 8;
      });
      if (!matched) return false;
    }
    return true;
  });

  const CheckItem = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8 }}>
      <div
        onClick={onChange}
        style={{
          width: 16, height: 16, borderRadius: 4,
          border: `2px solid ${checked ? C.s1 : C.border}`,
          background: checked ? C.s1 : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, cursor: "pointer"
        }}
      >
        {checked && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
      </div>
      <span style={{ fontSize: 13, color: C.dark }}>{label}</span>
    </label>
  );

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body, display: "flex", gap: 24 }}>
      {/* Left Filter Sidebar */}
      <aside style={{
        width: 200, flexShrink: 0, background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: 14,
        padding: "20px 16px", alignSelf: "flex-start",
        position: "sticky", top: 24
      }}>
        <div style={{ fontWeight: 700, color: C.dark, fontSize: 14, marginBottom: 16, fontFamily: FONT.display }}>
          Filters
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses…"
            style={{
              width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`,
              borderRadius: 8, fontSize: 13, color: C.dark, background: C.bg,
              outline: "none", boxSizing: "border-box", fontFamily: FONT.body
            }}
          />
        </div>

        <FilterSection title="Domain">
          {domains.map(d => (
            <CheckItem key={d} label={d} checked={selDomains.includes(d)} onChange={() => toggle(selDomains, d, setSelDomains)} />
          ))}
        </FilterSection>

        <FilterSection title="Level">
          {levels.map(l => (
            <CheckItem key={l} label={l} checked={selLevels.includes(l)} onChange={() => toggle(selLevels, l, setSelLevels)} />
          ))}
        </FilterSection>

        <FilterSection title="Duration">
          {durations.map(d => (
            <CheckItem key={d} label={d} checked={selDurations.includes(d)} onChange={() => toggle(selDurations, d, setSelDurations)} />
          ))}
        </FilterSection>

        <FilterSection title="Source">
          {sources.map(s => (
            <CheckItem key={s} label={s} checked={selSources.includes(s)} onChange={() => toggle(selSources, s, setSelSources)} />
          ))}
        </FilterSection>

        <button
          onClick={() => { setSearch(""); setSelDomains([]); setSelLevels([]); setSelDurations([]); setSelSources([]); }}
          style={{
            width: "100%", padding: "8px", background: "transparent",
            border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12,
            color: C.muted, cursor: "pointer", fontFamily: FONT.body
          }}
        >
          Clear All Filters
        </button>
      </aside>

      {/* Right: Course Grid */}
      <div style={{ flex: 1 }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.dark, fontFamily: FONT.display, margin: 0 }}>
              Course Catalog
            </h1>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
              {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: C.muted }}>Sort by:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                padding: "7px 12px", border: `1px solid ${C.border}`, borderRadius: 8,
                fontSize: 13, color: C.dark, background: C.surface,
                cursor: "pointer", fontFamily: FONT.body, outline: "none"
              }}
            >
              {["Relevance", "Newest", "Most Popular", "Duration (Low-High)"].map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {filtered.map(course => {
            const lc = levelColor(course.level);
            return (
              <div key={course.id} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: "20px 20px 18px", display: "flex",
                flexDirection: "column", gap: 10,
                transition: "box-shadow 0.2s"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 32 }}>{course.icon}</div>
                  <div style={{
                    background: course.source === "iGOT" ? "#EBF5F0" : "#F0EDFF",
                    color: course.source === "iGOT" ? C.s1 : "#6B4EFF",
                    fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 12
                  }}>
                    {course.source}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, color: C.dark, fontSize: 15, fontFamily: FONT.display, marginBottom: 4 }}>
                    {course.title}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>{course.dept}</div>
                </div>

                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, margin: 0, flexGrow: 1 }}>
                  {course.desc}
                </p>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 12,
                    background: lc.bg, color: lc.color
                  }}>
                    {course.level}
                  </span>
                  <span style={{ fontSize: 12, color: C.faint }}>⏱ {course.duration}h</span>
                </div>

                <Link
                  to="/student/courses/1"
                  style={{
                    display: "block", textAlign: "center", padding: "10px",
                    background: C.dark, color: "#fff", borderRadius: 8,
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                    marginTop: 4
                  }}
                >
                  Enroll →
                </Link>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: C.faint }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.muted }}>No courses match your filters</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting the filters or search term</div>
          </div>
        )}
      </div>
    </div>
  );
}
