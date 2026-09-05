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

        {/* Center content */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: C.accent, marginBottom: 20 }}>
            Welcome Back
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            Continue Your<br/>Learning Journey
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 36 }}>
            Access your personalized learning path, check your competency progress, and continue where you left off.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32 }}>
            {[["12,840+", "Learners"], ["94%", "Completion Rate"], ["450+", "Courses"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: FONT.mono, fontSize: 22, fontWeight: 700, color: C.accent }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.40)" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
          © 2026 Government of India · Karmayogi Shiksha AI
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <h1 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 6 }}>Sign in</h1>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>
            Don't have an account? <Link to="/register" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Register here</Link>
          </p>

          {/* Role toggle */}
          <div style={{ display: "flex", background: C.surface, borderRadius: 10, padding: 4, marginBottom: 28, border: `1px solid ${C.border}` }}>
            {(["student", "admin"] as const).map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: "8px", borderRadius: 7, border: "none", cursor: "pointer",
                background: role === r ? C.dark : "transparent",
                color: role === r ? "#fff" : C.muted,
                fontWeight: 600, fontSize: 13, transition: "all 0.15s",
                textTransform: "capitalize",
              }}>{r === "student" ? "👤 Student" : "🏛️ Administrator"}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Email Address</label>
              <input
                type="email" required placeholder="your.name@gov.in"
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <input type="checkbox" id="remember" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} style={{ accentColor: C.accent, width: 15, height: 15, cursor: "pointer" }} />
              <label htmlFor="remember" style={{ fontSize: 13, color: C.muted, cursor: "pointer" }}>Remember me for 30 days</label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700,
              background: loading ? C.muted : C.accent, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}>
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 12, color: C.faint }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* iGOT SSO */}
          <button style={{
            width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600,
            background: C.surface, color: C.dark, border: `1.5px solid ${C.border}`,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.dark)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            onClick={() => navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard")}
          >
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 32 32" fill="none" width={12} height={12}>
                <path d="M16 3C16 3 8 9 8 17a8 8 0 0016 0C24 9 16 3 16 3z" fill={C.accent}/>
                <circle cx="16" cy="17" r="2.5" fill="#fff"/>
              </svg>
            </div>
            Sign in with iGOT Karmayogi SSO
          </button>

          <p style={{ textAlign: "center", fontSize: 11, color: C.faint, marginTop: 24 }}>
            By signing in, you agree to the <a href="#" style={{ color: C.accent }}>Terms of Service</a> and <a href="#" style={{ color: C.accent }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
