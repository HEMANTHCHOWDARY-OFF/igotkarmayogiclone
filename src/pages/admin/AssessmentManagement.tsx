import { useState } from "react";
import { C, FONT } from "@/tokens";

const ASSESSMENTS = [
  { id: 1, name: "Ethics & Integrity Fundamentals", domain: "Ethics", questions: 30, duration: "45 min", attempts: 1240, avgScore: 82, status: "Active" },
  { id: 2, name: "Governance & Public Administration", domain: "Governance", questions: 40, duration: "60 min", attempts: 980, avgScore: 76, status: "Active" },
  { id: 3, name: "Digital Skills Assessment", domain: "Digital", questions: 25, duration: "35 min", attempts: 860, avgScore: 68, status: "Active" },
  { id: 4, name: "Public Finance Quiz", domain: "Finance", questions: 20, duration: "30 min", attempts: 720, avgScore: 74, status: "Active" },
  { id: 5, name: "Policy Analysis Assessment", domain: "Policy", questions: 35, duration: "50 min", attempts: 640, avgScore: 79, status: "Active" },
  { id: 6, name: "Constitutional Law Test", domain: "Legal", questions: 45, duration: "70 min", attempts: 580, avgScore: 71, status: "Active" },
  { id: 7, name: "Leadership Competency Eval", domain: "Governance", questions: 28, duration: "40 min", attempts: 420, avgScore: 83, status: "Completed" },
  { id: 8, name: "RTI & Transparency Quiz", domain: "Legal", questions: 15, duration: "20 min", attempts: 1680, avgScore: 88, status: "Completed" },
];

const QUESTION_BANK = [
  { id: 1, text: "What is the primary objective of the Right to Information Act?", domain: "Legal", type: "MCQ" },
  { id: 2, text: "Explain the concept of 'Dharma' in public administration ethics.", domain: "Ethics", type: "Short Answer" },
  { id: 3, text: "Which article of the Indian Constitution deals with Directive Principles?", domain: "Legal", type: "MCQ" },
  { id: 4, text: "Define e-governance and its key components.", domain: "Digital", type: "Short Answer" },
  { id: 5, text: "What is the FRBM Act and its significance?", domain: "Finance", type: "MCQ" },
  { id: 6, text: "Describe the policy formulation process in Indian bureaucracy.", domain: "Policy", type: "Long Answer" },
  { id: 7, text: "What are the key principles of good governance?", domain: "Governance", type: "MCQ" },
  { id: 8, text: "Explain the concept of conflict of interest in public service.", domain: "Ethics", type: "Short Answer" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Active: { bg: "#E6F4EC", color: C.s1 },
  Completed: { bg: "#EEF2FF", color: "#4338CA" },
};

const DOMAIN_COLORS: Record<string, string> = {
  Ethics: C.s1,
  Governance: C.s3,
  Digital: "#4338CA",
  Finance: C.s2,
  Policy: C.s4,
  Legal: "#8C3B17",
};

const STEPS = ["Basic Info", "Select Questions", "Settings"];

export default function AssessmentManagement() {
  const [showCreate, setShowCreate] = useState(false);
  const [step, setStep] = useState(0);
  const [qSearch, setQSearch] = useState("");
  const [qDomainFilter, setQDomainFilter] = useState("All");
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [formData, setFormData] = useState({ title: "", domain: "Ethics", duration: "", passMark: "60", maxAttempts: "3", shuffleQ: true, showResults: true });

  const filteredQ = QUESTION_BANK.filter((q) => {
    const matchSearch = q.text.toLowerCase().includes(qSearch.toLowerCase());
    const matchDomain = qDomainFilter === "All" || q.domain === qDomainFilter;
    return matchSearch && matchDomain;
  });

  const toggleQ = (id: number) =>
    setSelectedQuestions((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const inputStyle = {
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13,
    fontFamily: FONT.body,
    color: C.dark,
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  const stats = [
    { label: "Total Assessments", value: "24", color: C.dark },
    { label: "Active", value: "8", color: C.s1 },
    { label: "Completed", value: "16", color: C.s3 },
    { label: "Avg Score", value: "76%", color: C.s2 },
  ];

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0 }}>Assessment Management</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>Create and manage competency assessments</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setStep(0); }}
          style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontFamily: FONT.body, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          + Create Assessment
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: C.surface, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: FONT.display, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Create Assessment Flow */}
      {showCreate && (
        <div style={{ background: C.surface, border: `1px solid ${C.accent}`, borderRadius: 12, padding: "24px", marginBottom: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 600 }}>Create New Assessment</div>
            <button onClick={() => setShowCreate(false)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>x</button>
          </div>

          {/* Step Indicators */}
          <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                  onClick={() => setStep(i)}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: i < step ? C.s1 : i === step ? C.dark : C.border,
                    color: i <= step ? "#fff" : C.muted,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 600,
                  }}>{i < step ? "✓" : i + 1}</div>
                  <span style={{ fontSize: 13, fontWeight: i === step ? 600 : 400, color: i === step ? C.dark : C.muted }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 40, height: 1, background: C.border, margin: "0 12px" }} />}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Assessment Title *</label>
                <input style={inputStyle} placeholder="e.g. Ethics & Governance Module 2" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Domain *</label>
                <select style={inputStyle} value={formData.domain} onChange={(e) => setFormData({ ...formData, domain: e.target.value })}>
                  {Object.keys(DOMAIN_COLORS).map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Duration (minutes) *</label>
                <input style={inputStyle} type="number" placeholder="e.g. 45" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
              </div>
            </div>
          )}

          {/* Step 2: Select Questions */}
          {step === 1 && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <input style={{ ...inputStyle, width: 240 }} placeholder="Search questions..." value={qSearch} onChange={(e) => setQSearch(e.target.value)} />
                <select style={{ ...inputStyle, width: "auto" }} value={qDomainFilter} onChange={(e) => setQDomainFilter(e.target.value)}>
                  {["All", ...Object.keys(DOMAIN_COLORS)].map((d) => <option key={d}>{d}</option>)}
                </select>
                <span style={{ marginLeft: "auto", fontSize: 13, color: C.muted, alignSelf: "center" }}>{selectedQuestions.length} selected</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
                {filteredQ.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => toggleQ(q.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      border: `1px solid ${selectedQuestions.includes(q.id) ? C.s1 : C.border}`,
                      borderRadius: 8, background: selectedQuestions.includes(q.id) ? "#E6F4EC" : C.bg,
                      cursor: "pointer",
                    }}
                  >
                    <input type="checkbox" checked={selectedQuestions.includes(q.id)} onChange={() => {}} />
                    <div style={{ flex: 1, fontSize: 13 }}>{q.text}</div>
                    <span style={{ background: DOMAIN_COLORS[q.domain] + "22", color: DOMAIN_COLORS[q.domain], borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{q.domain}</span>
                    <span style={{ fontSize: 11, color: C.faint, whiteSpace: "nowrap" }}>{q.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Pass Mark (%)</label>
                <input style={inputStyle} type="number" value={formData.passMark} onChange={(e) => setFormData({ ...formData, passMark: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>Max Attempts</label>
                <input style={inputStyle} type="number" value={formData.maxAttempts} onChange={(e) => setFormData({ ...formData, maxAttempts: e.target.value })} />
              </div>
              {[
                { label: "Shuffle Questions", key: "shuffleQ" },
                { label: "Show Results After Submission", key: "showResults" },
              ].map(({ label, key }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, gridColumn: "1/-1" }}>
                  <input type="checkbox" checked={formData[key as keyof typeof formData] as boolean} onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 13 }}>{label}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 20px", fontSize: 14, fontFamily: FONT.body, color: C.muted, cursor: "pointer" }}>Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} style={{ background: C.dark, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 14, fontFamily: FONT.body, fontWeight: 600, cursor: "pointer" }}>Next</button>
            ) : (
              <button onClick={() => setShowCreate(false)} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 14, fontFamily: FONT.body, fontWeight: 600, cursor: "pointer" }}>Create Assessment</button>
            )}
          </div>
        </div>
      )}

      {/* Assessments Table */}
      <div style={{ background: C.surface, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 28 }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, fontFamily: FONT.display, fontSize: 15, fontWeight: 600 }}>All Assessments</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {["Assessment Name", "Domain", "Questions", "Duration", "Attempts", "Avg Score", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ASSESSMENTS.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: i < ASSESSMENTS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{a.name}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: DOMAIN_COLORS[a.domain] + "22", color: DOMAIN_COLORS[a.domain], borderRadius: 6, padding: "3px 8px", fontSize: 12, fontWeight: 600 }}>{a.domain}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{a.questions}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.muted }}>{a.duration}</td>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{a.attempts.toLocaleString()}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: a.avgScore >= 80 ? C.s1 : a.avgScore >= 65 ? C.s2 : C.s4 }}>{a.avgScore}%</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ ...STATUS_STYLE[a.status], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{a.status}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["Edit", "View"].map((act) => (
                      <button key={act} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.dark, cursor: "pointer", fontFamily: FONT.body }}>{act}</button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Question Bank */}
      <div style={{ background: C.surface, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600 }}>Question Bank</div>
          <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontFamily: FONT.body, fontWeight: 600, cursor: "pointer" }}>+ Add Question</button>
        </div>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
          <input
            style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: FONT.body, color: C.dark, outline: "none", flex: 1 }}
            placeholder="Search questions..."
            value={qSearch}
            onChange={(e) => setQSearch(e.target.value)}
          />
          <select
            style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: FONT.body, color: C.dark, outline: "none" }}
            value={qDomainFilter}
            onChange={(e) => setQDomainFilter(e.target.value)}
          >
            {["All", ...Object.keys(DOMAIN_COLORS)].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          {filteredQ.map((q, i) => (
            <div key={q.id} style={{ padding: "14px 20px", borderBottom: i < filteredQ.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1, fontSize: 13 }}>{q.text}</div>
              <span style={{ background: DOMAIN_COLORS[q.domain] + "22", color: DOMAIN_COLORS[q.domain], borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>{q.domain}</span>
              <span style={{ fontSize: 11, color: C.faint, minWidth: 80 }}>{q.type}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {["Edit", "Use"].map((a) => (
                  <button key={a} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.dark, cursor: "pointer", fontFamily: FONT.body }}>{a}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
