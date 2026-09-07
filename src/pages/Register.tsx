import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { C, FONT } from "@/tokens";
import { useAuth } from "@/context/AuthContext";

const learnerTracks = [
  "Higher Education / University Student",
  "Data Science & AI Scholar",
  "Public Sector & Policy Aspirant",
  "Working Professional / Upskiller",
  "Statistical & Economic Researcher",
  "Civil Servant / Public Administrator",
  "Other Lifelong Learner",
];

const institutionTypes = [
  "University / Academic College",
  "Research Institution (Institute / Lab)",
  "Enterprise / Industry Organization",
  "Professional Training Academy",
  "Independent Self-Paced Learner",
  "Other",
];

export default function Register() {
  const navigate = useNavigate();
  const { signUp, loginAsDemo } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", track: "", institution: "", year: "", agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const f = (k: keyof typeof form, v: string | boolean) => {
    setErrorMsg(null);
    setForm(p => ({ ...p, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (step < 2) {
      if (!form.name.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!form.email.trim()) {
        setErrorMsg("Please enter your email address.");
        return;
      }
      if (form.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      setStep(2);
      return;
    }

    if (!form.agree) {
      setErrorMsg("Please agree to the Terms of Service to continue.");
      return;
    }

    setLoading(true);
    try {
      const { error, needsEmailConfirmation } = await signUp({
        email: form.email,
        password: form.password,
        fullName: form.name,
        track: form.track,
        institution: form.institution,
        year: form.year,
        role: "student",
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (needsEmailConfirmation) {
        setInfoMsg("Account registered successfully! A confirmation link has been sent to your email. Please check your inbox and verify to sign in.");
      } else {
        navigate("/onboarding");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => navigate("/")}>
          <img
            src="/gyanmarg_logo.jpg"
            alt="GyanMarg AI Logo"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(198, 133, 27, 0.7)",
              boxShadow: "0 0 14px rgba(198, 133, 27, 0.35)",
            }}
          />
          <div>
            <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: "#fff" }}>
              GyanMarg <span style={{ color: C.accent }}>AI</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.40)" }}>Skill Diagnostic & Adaptive Learning</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.accent, marginBottom: 20 }}>Empowering Every Learner</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
            Your Intelligent<br/>Learning Journey Begins
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Quantitative gap matrix mapped directly to target role competencies",
              "Multimodal assessment generator with page-level source citations",
              "Adaptive learning roadmaps sequenced to structured competency standards",
              "Continuous mastery tracking across domain and analytical skills",
            ].map(text => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>© 2026 GyanMarg AI. All rights reserved.</div>
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
              Step {step} of 2 — {step === 1 ? "Account Details" : "Learner Profile"}
            </div>
          </div>

          <h1 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
            {step === 1 ? "Create your account" : "Your learning profile"}
          </h1>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>
            {step === 1
              ? <>Already registered? <Link to="/login" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Sign in</Link></>
              : "Help us calibrate the AI diagnostic to your background & goals"}
          </p>

          {/* Real-time Error Alert */}
          {errorMsg && (
            <div style={{
              background: "#FDF2F2",
              border: "1px solid #F87171",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 18,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}>
              <span style={{ color: "#DC2626", fontSize: 16, lineHeight: 1 }}>⚠</span>
              <div style={{ fontSize: 12.5, color: "#991B1B", lineHeight: 1.45, flex: 1 }}>
                {errorMsg}
              </div>
            </div>
          )}

          {/* Info Alert (e.g. Email verification required) */}
          {infoMsg && (
            <div style={{
              background: "#EFF6FF",
              border: "1px solid #60A5FA",
              borderRadius: 8,
              padding: "12px 14px",
              marginBottom: 18,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}>
              <span style={{ color: "#2563EB", fontSize: 16, lineHeight: 1 }}>✉</span>
              <div style={{ fontSize: 12.5, color: "#1E40AF", lineHeight: 1.45, flex: 1 }}>
                {infoMsg}
                <div style={{ marginTop: 8 }}>
                  <Link to="/login" style={{ color: C.accent, fontWeight: 700, textDecoration: "underline" }}>Proceed to Sign In →</Link>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Full Name</label>
                  <input type="text" required placeholder="Priya Sharma" value={form.name} onChange={e => f("name", e.target.value)} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Email Address</label>
                  <input type="email" required placeholder="priya.sharma@example.edu / .gov.in" value={form.email} onChange={e => f("email", e.target.value)} style={inputStyle}
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
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Learner Track</label>
                    <select value={form.track} onChange={e => f("track", e.target.value)} required style={{ ...inputStyle, appearance: "none" }}>
                      <option value="">Select your track</option>
                      {learnerTracks.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Target Year</label>
                    <input type="text" placeholder="e.g. 2026" value={form.year} onChange={e => f("year", e.target.value)} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = C.accent)} onBlur={e => (e.target.style.borderColor = C.border)} />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Institution / Affiliation Type</label>
                  <select value={form.institution} onChange={e => f("institution", e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="">Select affiliation</option>
                    {institutionTypes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24 }}>
                  <input type="checkbox" id="agree" checked={form.agree} onChange={e => f("agree", e.target.checked)} required style={{ accentColor: C.accent, width: 15, height: 15, cursor: "pointer", marginTop: 2 }} />
                  <label htmlFor="agree" style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, cursor: "pointer" }}>
                    I agree to the <a href="#" style={{ color: C.accent }}>Terms of Service</a> and <a href="#" style={{ color: C.accent }}>Privacy Policy</a> for GyanMarg AI.
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
              <button
                type="button"
                style={{
                  width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                  background: C.surface, color: C.dark, border: `1.5px solid ${C.border}`, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
                onClick={() => {
                  loginAsDemo("student");
                  navigate("/onboarding");
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 32 32" fill="none" width={12} height={12}>
                    <path d="M16 3C16 3 8 9 8 17a8 8 0 0016 0C24 9 16 3 16 3z" fill={C.accent}/>
                    <circle cx="16" cy="17" r="2.5" fill="#fff"/>
                  </svg>
                </div>
                Quick Student Assessment Demo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
