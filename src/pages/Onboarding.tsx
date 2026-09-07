import { useState } from "react";
import { useNavigate } from "react-router";
import { C, FONT } from "@/tokens";

const goals = [
  {
    id: "promotion",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    ),
    label: "Career Advancement",
    desc: "Focus on strategic leadership and managerial competencies"
  },
  {
    id: "performance",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    label: "Performance Enhancement",
    desc: "Strengthen functional domain proficiency and core capabilities"
  },
  {
    id: "policy",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    label: "Policy & Governance",
    desc: "Deepen public administration and evidence-based policy skills"
  },
  {
    id: "digital",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    label: "Digital & Data Analytics",
    desc: "Master digital governance, statistical modeling, and data skills"
  },
  {
    id: "leadership",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
    label: "Strategic Leadership",
    desc: "Analytical decision-making, team management, and problem solving"
  },
  {
    id: "certification",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    label: "Competency Certification",
    desc: "Complete courses mapped to structured competency standards"
  },
];

const domains = [
  {
    id: "domain",
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2z" />
      </svg>
    ),
    label: "Domain / Technical Knowledge"
  },
  {
    id: "leadership",
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    label: "Leadership & Management"
  },
  {
    id: "behavioural",
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Behavioural Competencies"
  },
  {
    id: "functional",
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    label: "Functional Competencies"
  },
  {
    id: "digital",
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    label: "Digital Competency"
  },
  {
    id: "ethics",
    icon: (
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    label: "Ethics & Integrity"
  },
];

const hours = ["< 2 hrs/week", "2–4 hrs/week", "4–8 hrs/week", "8+ hrs/week"];

const steps = ["Welcome", "Set Goals", "Focus Areas", "Learning Pace"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [pace, setPace] = useState("");

  const toggleGoal = (id: string) =>
    setSelectedGoals(p => p.includes(id) ? p.filter(g => g !== id) : [...p, id]);
  const toggleDomain = (id: string) =>
    setSelectedDomains(p => p.includes(id) ? p.filter(d => d !== id) : [...p, id]);

  const canProceed = step === 0 || (step === 1 && selectedGoals.length > 0) || (step === 2 && selectedDomains.length > 0) || (step === 3 && pace !== "");

  const proceed = () => {
    if (step < 3) setStep(s => s + 1);
    else navigate("/student/assessment");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT.body }}>

      {/* Top progress bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 32 32" fill="none" width={18} height={18}>
              <path d="M16 3C16 3 8 9 8 17a8 8 0 0016 0C24 9 16 3 16 3z" fill={C.accent}/>
              <circle cx="16" cy="17" r="3" fill="#fff"/>
            </svg>
          </div>
          <span style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.dark }}>
            GyanMarg <span style={{ color: C.accent }}>AI</span>
          </span>
        </div>

        {/* Step pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: i < step ? C.s1 : i === step ? C.dark : C.border,
                  color: i <= step ? "#fff" : C.faint,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                }}>{i < step ? "✓" : i + 1}</div>
                <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? C.dark : C.faint }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 24, height: 1, background: C.border }} />}
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/student/dashboard")} style={{ fontSize: 13, color: C.faint, background: "none", border: "none", cursor: "pointer" }}>
          Skip for now →
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 700, width: "100%" }}>

          {step === 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${C.accent}20`, border: `1.5px solid ${C.accent}50`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: C.dark, marginBottom: 14 }}>
                Welcome to GyanMarg AI
              </h1>
              <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>
                Let's set up your personalized competency profile. This takes about 2 minutes and helps configure your diagnostic baseline and adaptive learning path.
              </p>
              <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    ),
                    label: "Diagnostic Assessment"
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a4.5 4.5 0 0 0 0-9H7a4 4 0 0 1 0-8h11" /><circle cx="18" cy="5" r="3" />
                      </svg>
                    ),
                    label: "Adaptive Learning Path"
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 20V10M12 20V4M6 20v-6" />
                      </svg>
                    ),
                    label: "Competency Tracking"
                  }
                ].map(item => (
                  <div key={item.label} style={{ background: C.surface, borderRadius: 14, padding: "20px 24px", border: `1px solid ${C.border}`, minWidth: 160, textAlign: "center" }}>
                    <div style={{ width: 36, height: 36, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 8 }}>What are your learning goals?</h2>
                <p style={{ fontSize: 14, color: C.muted }}>Select all that apply — you can change these later.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {goals.map(g => {
                  const sel = selectedGoals.includes(g.id);
                  return (
                    <button key={g.id} onClick={() => toggleGoal(g.id)} style={{
                      padding: "18px 20px", borderRadius: 14, textAlign: "left", cursor: "pointer",
                      border: `2px solid ${sel ? C.dark : C.border}`,
                      background: sel ? `${C.dark}0E` : C.surface,
                      transition: "all 0.15s",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{g.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{g.label}</span>
                        {sel && <span style={{ marginLeft: "auto", color: C.dark, fontSize: 14 }}>✓</span>}
                      </div>
                      <p style={{ fontSize: 12, color: C.muted, margin: 0, paddingLeft: 32 }}>{g.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 8 }}>Which domains do you want to focus on?</h2>
                <p style={{ fontSize: 14, color: C.muted }}>Select your primary areas for improvement.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {domains.map(d => {
                  const sel = selectedDomains.includes(d.id);
                  return (
                    <button key={d.id} onClick={() => toggleDomain(d.id)} style={{
                      padding: "20px 16px", borderRadius: 14, textAlign: "center", cursor: "pointer",
                      border: `2px solid ${sel ? C.accent : C.border}`,
                      background: sel ? `${C.accent}12` : C.surface,
                      transition: "all 0.15s",
                    }}>
                      <div style={{ width: 36, height: 36, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{d.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{d.label}</div>
                      {sel && <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: C.accent }}>Selected ✓</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 8 }}>How much time can you dedicate to learning?</h2>
                <p style={{ fontSize: 14, color: C.muted }}>We'll pace your learning path accordingly.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, maxWidth: 500, margin: "0 auto" }}>
                {hours.map(h => (
                  <button key={h} onClick={() => setPace(h)} style={{
                    padding: "24px 20px", borderRadius: 14, textAlign: "center", cursor: "pointer",
                    border: `2px solid ${pace === h ? C.dark : C.border}`,
                    background: pace === h ? `${C.dark}0E` : C.surface,
                    fontSize: 15, fontWeight: 700, color: C.dark, transition: "all 0.15s",
                  }}>
                    {h}
                    {pace === h && <div style={{ fontSize: 11, color: C.muted, fontWeight: 400, marginTop: 4 }}>Selected ✓</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40 }}>
            <button onClick={() => step > 0 && setStep(s => s - 1)} style={{
              padding: "11px 24px", borderRadius: 99, fontSize: 14, fontWeight: 600,
              background: "transparent", border: `2px solid ${C.border}`, color: C.muted, cursor: "pointer",
              opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? "none" : "auto",
            }}>← Back</button>
            <button onClick={proceed} disabled={!canProceed} style={{
              padding: "12px 32px", borderRadius: 99, fontSize: 14, fontWeight: 700,
              background: canProceed ? C.accent : C.border, color: "#fff", border: "none", cursor: canProceed ? "pointer" : "not-allowed",
              transition: "background 0.15s",
            }}>
              {step < 3 ? "Continue →" : "Start My Assessment →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
