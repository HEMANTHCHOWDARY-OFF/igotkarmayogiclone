import { useState } from "react";
import { useNavigate } from "react-router";
import { C, FONT } from "@/tokens";

const goals = [
  { id: "promotion",    icon: "⬆️", label: "Prepare for promotion",      desc: "Focus on leadership and management competencies" },
  { id: "performance",  icon: "📊", label: "Improve performance appraisal", desc: "Strengthen functional and domain knowledge" },
  { id: "policy",       icon: "📜", label: "Master policy implementation",  desc: "Deepen policy analysis and governance skills" },
  { id: "digital",      icon: "💻", label: "Build digital skills",          desc: "Digital governance, data analytics, e-services" },
  { id: "leadership",   icon: "🎯", label: "Develop leadership skills",     desc: "Strategic thinking, team management, decision-making" },
  { id: "certification",icon: "🎓", label: "Earn certifications",           desc: "Complete courses mapped to iGOT Karmayogi" },
];

const domains = [
  { id: "domain",    icon: "🏛️", label: "Domain / Technical Knowledge" },
  { id: "leadership",icon: "🎯", label: "Leadership & Management"      },
  { id: "behavioural",icon: "🤝", label: "Behavioural Competencies"    },
  { id: "functional",icon: "⚙️", label: "Functional Competencies"      },
  { id: "digital",   icon: "💻", label: "Digital Competency"           },
  { id: "ethics",    icon: "⚖️", label: "Ethics & Integrity"           },
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
            Karmayogi Shiksha <span style={{ color: C.accent }}>AI</span>
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
              <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
              <h1 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: C.dark, marginBottom: 14 }}>
                Welcome to Karmayogi Shiksha AI
              </h1>
              <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>
                Let's set up your personalized learning profile. This takes about 2 minutes and helps our AI build the perfect learning path for you.
              </p>
              <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                {[["🎯", "Personalized Assessment"], ["🗺️", "AI Learning Path"], ["📊", "Progress Tracking"]].map(([icon, label]) => (
                  <div key={label} style={{ background: C.surface, borderRadius: 14, padding: "20px 24px", border: `1px solid ${C.border}`, minWidth: 160, textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{label}</div>
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
                        <span style={{ fontSize: 22 }}>{g.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{g.label}</span>
                        {sel && <span style={{ marginLeft: "auto", color: C.dark, fontSize: 14 }}>✓</span>}
                      </div>
                      <p style={{ fontSize: 12, color: C.muted, margin: 0, paddingLeft: 34 }}>{g.desc}</p>
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
                      <div style={{ fontSize: 28, marginBottom: 10 }}>{d.icon}</div>
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
