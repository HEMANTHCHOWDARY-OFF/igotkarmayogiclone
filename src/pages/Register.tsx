import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { C, FONT } from "@/tokens";

const depts = ["IAS", "IPS", "IFS", "IRS", "IRTS", "IPoS", "IA&AS", "IDAS", "Other"];
const ministries = ["Ministry of Education", "Ministry of Finance", "Home Ministry", "External Affairs", "DOPT", "MeitY", "Other"];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", dept: "", ministry: "", batch: "", agree: false,
  });
  const [loading, setLoading] = useState(false);

  const f = (k: keyof typeof form, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(2); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/onboarding"); }, 900);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
    border: `1.5px solid ${C.border}`, background: C.surface, color: C.dark,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: FONT.body }}>

      {/* Left panel */}
      <div style={{ width: "42%", flexShrink: 0, background: C.dark, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 52px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 32 32" fill="none" width={20} height={20}>
              <path d="M16 3C16 3 8 9 8 17a8 8 0 0016 0C24 9 16 3 16 3z" fill="#fff"/>
              <circle cx="16" cy="17" r="3" fill={C.accent}/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: "#fff" }}>
              Karmayogi Shiksha <span style={{ color: C.accent }}>AI</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.40)" }}>Powered by iGOT Karmayogi</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.accent, marginBottom: 20 }}>Getting Started</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
            Your AI-Powered<br/>Learning Begins Here
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "🎯", text: "Take an AI-powered competency assessment" },
              { icon: "🔍", text: "Discover your skill gaps instantly" },
              { icon: "🗺️", text: "Get a personalized learning roadmap" },
              { icon: "📈", text: "Track progress with real-time dashboards" },
            ].map(pt => (
              <div key={pt.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{pt.icon}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{pt.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>© 2026 Government of India · Karmayogi Shiksha AI</div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: step >= s ? C.dark : C.border, color: step >= s ? "#fff" : C.faint,
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>{s < step ? "✓" : s}</div>
                {s < 2 && <div style={{ width: 60, height: 2, background: step > s ? C.dark : C.border }} />}
              </div>
            ))}
            <div style={{ marginLeft: 16, fontSize: 13, color: C.muted }}>
              Step {step} of 2 — {step === 1 ? "Account Details" : "Service Information"}
            </div>
          </div>

          <h1 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
            {step === 1 ? "Create your account" : "Your service details"}
          </h1>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>
            {step === 1
              ? <>Already registered? <Link to="/login" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Sign in</Link></>
              : "Help us personalize your learning experience"}
          </p>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Full Name</label>
                  <input type="text" required placeholder="Priya Sharma" value={form.name} onChange={e => f("name", e.target.value)} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Official Email</label>
                  <input type="email" required placeholder="priya.sharma@ias.gov.in" value={form.email} onChange={e => f("email", e.target.value)} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Password</label>
                  <input type="password" required placeholder="Min. 8 characters" value={form.password} onChange={e => f("password", e.target.value)} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Civil Service</label>
                    <select value={form.dept} onChange={e => f("dept", e.target.value)} required style={{ ...inputStyle, appearance: "none" }}>
                      <option value="">Select service</option>
                      {depts.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Batch Year</label>
                    <input type="text" placeholder="e.g. 2021" value={form.batch} onChange={e => f("batch", e.target.value)} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)} />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Ministry / Department</label>
                  <select value={form.ministry} onChange={e => f("ministry", e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="">Select ministry</option>
                    {ministries.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24 }}>
                  <input type="checkbox" id="agree" checked={form.agree} onChange={e => f("agree", e.target.checked)} required style={{ accentColor: C.accent, width: 15, height: 15, cursor: "pointer", marginTop: 2 }} />
                  <label htmlFor="agree" style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, cursor: "pointer" }}>
                    I agree to the <a href="#" style={{ color: C.accent }}>Terms of Service</a> and confirm this is my official government email address.
                  </label>
                </div>
              </>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700,
              background: loading ? C.muted : C.accent, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? "Creating account..." : step === 1 ? "Continue →" : "Create Account →"}
            </button>
          </form>

          {step === 1 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ fontSize: 12, color: C.faint }}>or</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>
              <button style={{
                width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: C.surface, color: C.dark, border: `1.5px solid ${C.border}`, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }} onClick={() => navigate("/onboarding")}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 32 32" fill="none" width={12} height={12}>
                    <path d="M16 3C16 3 8 9 8 17a8 8 0 0016 0C24 9 16 3 16 3z" fill={C.accent}/>
                    <circle cx="16" cy="17" r="2.5" fill="#fff"/>
                  </svg>
                </div>
                Register with iGOT Karmayogi SSO
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
