import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { C, FONT } from "@/tokens";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { isSessionOnboardingCompleted } from "@/utils/coursePreferences";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { signIn, signInWithGoogle, loginWithGoogle, loginAsDemo, isAuthenticated, profile } = useAuth();
  
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Google OAuth Chooser Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [isCustomGoogle, setIsCustomGoogle] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  const destination = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  useEffect(() => {
    if (isAuthenticated && profile) {
      if (profile.role === "admin") {
        const target = destination || "/admin/dashboard";
        navigate(target, { replace: true });
      } else {
        const hasCompletedOnboarding = isSessionOnboardingCompleted(profile.id);
        const target = hasCompletedOnboarding
          ? (destination || "/student/dashboard")
          : "/student/interested-courses";
        navigate(target, { replace: true });
      }
    }
  }, [isAuthenticated, profile, destination, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("Invalid email or password. Please check your credentials or register a new account.");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMsg("Please verify your email before signing in, or use Instant Demo mode below.");
        } else {
          setErrorMsg(error.message);
        }
      } else {
        if (role === "admin") {
          navigate(destination || "/admin/dashboard");
        } else {
          navigate("/student/interested-courses");
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg(null);
      setLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to initiate Google sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoogleAccount = (email: string, name?: string) => {
    loginWithGoogle(email, name);
    setShowGoogleModal(false);
    navigate("/student/interested-courses");
  };

  const handleDemoLogin = (demoRole: "student" | "admin") => {
    loginAsDemo(demoRole);
    if (demoRole === "admin") {
      navigate(destination || "/admin/dashboard");
    } else {
      navigate("/student/interested-courses");
    }
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

          {/* Platform Highlights */}
          <div style={{ display: "flex", gap: 32 }}>
            {[["100%", "Source Citations"], ["Multi-Axis", "Gap Diagnostics"], ["Adaptive", "Curriculum Paths"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: FONT.mono, fontSize: 22, fontWeight: 700, color: C.accent }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          © 2026 GyanMarg AI. All rights reserved.
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <h1 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
            {role === "admin" ? "Administrator Portal" : t("auth_welcome_back")}
          </h1>
          {role === "student" ? (
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>
              {t("auth_no_account")} <Link to="/register" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>{t("auth_sign_up_link")}</Link>
            </p>
          ) : (
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
              Authorized personnel only · Accounts provisioned by department
            </p>
          )}

          {/* Role toggle */}
          <div style={{ display: "flex", background: C.surface, borderRadius: 10, padding: 4, marginBottom: 20, border: `1px solid ${C.border}` }}>
            {(["student", "admin"] as const).map(r => (
              <button key={r} onClick={() => { setRole(r); setErrorMsg(null); }} style={{
                flex: 1, padding: "8px", borderRadius: 7, border: "none", cursor: "pointer",
                background: role === r ? C.dark : "transparent",
                color: role === r ? "#fff" : C.muted,
                fontWeight: 600, fontSize: 13, transition: "all 0.15s",
              }}>{r === "student" ? t("auth_role_student") : t("auth_role_admin")}</button>
            ))}
          </div>

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

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>{t("auth_email_label")}</label>
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
                <label style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{t("auth_password_label")}</label>
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
              {loading ? "Signing in..." : t("auth_sign_in_btn")}
            </button>

            {/* Continue with Google for Student */}
            {role === "student" && (
              <>
                <div style={{ display: "flex", alignItems: "center", margin: "18px 0 14px", gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                  <span style={{ fontSize: 11.5, color: C.muted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                    or
                  </span>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: FONT.body,
                    background: "#FFFFFF",
                    color: C.dark,
                    border: `1.5px solid ${C.border}`,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "all 0.18s ease",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = C.accent;
                    e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  {t("auth_google_btn")}
                </button>

                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.muted,
                      fontSize: 11.5,
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Or select a test Google account
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Quick Demo Access Buttons */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, textAlign: "center" }}>
              {t("auth_demo_header")}
            </div>
            <div>
              {role === "student" ? (
                <button
                  type="button"
                  onClick={() => handleDemoLogin("student")}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontWeight: 600,
                    background: C.surface,
                    color: C.dark,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                >
                  Student Demo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontWeight: 600,
                    background: C.surface,
                    color: C.dark,
                    border: `1.5px solid ${C.border}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#94B4DC")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                >
                  Admin Demo
                </button>
              )}
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: C.faint, marginTop: 20 }}>
            By signing in, you agree to the <a href="#" style={{ color: C.accent }}>Terms of Service</a> and <a href="#" style={{ color: C.accent }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Google OAuth Chooser Modal */}
      {showGoogleModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
          onClick={() => setShowGoogleModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#FFFFFF",
              borderRadius: 16,
              boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
              padding: "26px 28px 22px",
              position: "relative",
              border: `1px solid ${C.border}`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowGoogleModal(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "transparent",
                border: "none",
                fontSize: 18,
                color: C.muted,
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 6,
              }}
            >
              ✕
            </button>

            {/* Google Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.dark }}>Sign in with Google</h3>
                <div style={{ fontSize: 12, color: C.muted }}>Choose an account to continue to GyanMarg AI</div>
              </div>
            </div>

            <div style={{ height: 1, background: C.border, margin: "16px 0 14px" }} />

            {/* Account List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Priya Sharma", email: "priya.sharma@gmail.com", initial: "P", bg: "#4285F4" },
                { name: "Rajesh Kumar", email: "rajesh.kumar@gmail.com", initial: "R", bg: "#34A853" },
              ].map(acc => (
                <div
                  key={acc.email}
                  onClick={() => handleSelectGoogleAccount(acc.email, acc.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = C.accent;
                    e.currentTarget.style.background = "#F8FAFC";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.background = C.surface;
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: acc.bg,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {acc.initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{acc.name}</div>
                    <div style={{ fontSize: 11.5, color: C.muted }}>{acc.email}</div>
                  </div>
                  <span style={{ fontSize: 16, color: C.faint }}>→</span>
                </div>
              ))}

              {/* Custom Google Account Toggle */}
              {!isCustomGoogle ? (
                <button
                  type="button"
                  onClick={() => setIsCustomGoogle(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1px dashed ${C.border}`,
                    background: "transparent",
                    color: C.dark,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 16 }}>＋</span>
                  Use another Google account...
                </button>
              ) : (
                <div style={{ marginTop: 8, padding: 12, borderRadius: 10, background: "#F8FAFC", border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 8 }}>Enter Google Account:</div>
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Ananya Rao)"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      fontSize: 13,
                      border: `1px solid ${C.border}`,
                      marginBottom: 8,
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      fontSize: 13,
                      border: `1px solid ${C.border}`,
                      marginBottom: 10,
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      disabled={!customEmail.trim()}
                      onClick={() => handleSelectGoogleAccount(customEmail, customName)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 6,
                        background: customEmail.trim() ? C.accent : C.muted,
                        color: "#fff",
                        border: "none",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: customEmail.trim() ? "pointer" : "not-allowed",
                      }}
                    >
                      Continue →
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomGoogle(false)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        background: "transparent",
                        color: C.muted,
                        border: `1px solid ${C.border}`,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Informational badge about Supabase OAuth Provider */}
            <div
              style={{
                marginTop: 16,
                padding: "10px 12px",
                borderRadius: 8,
                background: "#FEF3C7",
                border: "1px solid #FCD34D",
                fontSize: 11,
                color: "#92400E",
                lineHeight: 1.45,
              }}
            >
              <strong>⚡ Supabase Setup Note:</strong> Google OAuth provider is not yet enabled in the Supabase Dashboard. To direct users straight to Google's live consent screen, enable Google Provider under <em>Authentication → Providers → Google</em> in your Supabase project.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
