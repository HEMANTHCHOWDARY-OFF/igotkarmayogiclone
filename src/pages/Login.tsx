import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { C, FONT } from "@/tokens";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    }, 900);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: FONT.body }}>

      {/* Left — brand panel */}
      <div style={{
        width: "42%", flexShrink: 0, background: C.dark,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px 52px",
      }}>
        {/* Logo */}
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
            <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 800, color: "#fff" }}>
              GyanMarg <span style={{ color: C.accent }}>AI</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>Competency Intelligence &amp; Learning Platform</div>
          </div>
        </div>

        {/* Center content */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.accent, marginBottom: 20 }}>
            Unified Learning Access
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            Welcome to<br/>GyanMarg AI
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 36 }}>
            Designed for all learners — students, scholars, aspirants, and administrators. Access your diagnostic results, personalized roadmap, AI mentor, and institutional analytics.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32 }}>
            {[["12,840+", "Active Learners"], ["94%", "Completion Rate"], ["450+", "Courses Mapped"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: FONT.mono, fontSize: 22, fontWeight: 700, color: C.accent }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          © 2026 GyanMarg AI · SIH26101 · Government of India
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <h1 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 6 }}>Sign in</h1>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>
            Don't have an account? <Link to="/register" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Register here</Link>
          </p>

          {/* Role toggle */}
          <div style={{ display: "flex", background: C.surface, borderRadius: 10, padding: 4, marginBottom: 24, border: `1px solid ${C.border}` }}>
            {(["student", "admin"] as const).map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: "8px", borderRadius: 7, border: "none", cursor: "pointer",
                background: role === r ? C.dark : "transparent",
                color: role === r ? "#fff" : C.muted,
                fontWeight: 600, fontSize: 13, transition: "all 0.15s",
              }}>{r === "student" ? "🎓 Student / Learner" : "🏛️ Administrator"}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Email Address</label>
              <input
                type="email" required placeholder="your.name@example.com or user@gov.in"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
                  border: `1.5px solid ${C.border}`, background: C.surface, color: C.dark,
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = C.accent)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: C.accent, textDecoration: "none", fontWeight: 600 }}>Forgot password?</a>
              </div>
              <input
                type="password" required placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
                  border: `1.5px solid ${C.border}`, background: C.surface, color: C.dark,
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = C.accent)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
            </div>

            {/* Remember */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <input type="checkbox" id="remember" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} style={{ accentColor: C.accent, width: 15, height: 15, cursor: "pointer" }} />
              <label htmlFor="remember" style={{ fontSize: 13, color: C.muted, cursor: "pointer" }}>Remember me for 30 days</label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700,
              background: loading ? C.muted : C.accent, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}>
              {loading ? "Signing in..." : `Sign in as ${role === "admin" ? "Administrator" : "Student"} →`}
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, textAlign: "center" }}>
              Quick Direct Access (Instant Demo)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                type="button"
                onClick={() => navigate("/student/dashboard")}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: C.surface,
                  color: C.dark,
                  border: `1.5px solid ${C.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                <span>🎓</span> Student Demo
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: C.surface,
                  color: C.dark,
                  border: `1.5px solid ${C.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#94B4DC")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                <span>🏛️</span> Admin Demo
              </button>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: C.faint, marginTop: 20 }}>
            By signing in, you agree to the <a href="#" style={{ color: C.accent }}>Terms of Service</a> and <a href="#" style={{ color: C.accent }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
