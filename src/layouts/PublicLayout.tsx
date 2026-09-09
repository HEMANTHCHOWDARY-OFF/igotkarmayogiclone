import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import LanguageSelector from "@/components/LanguageSelector";
import { TutorialProvider, useTutorial } from "@/context/TutorialContext";
import { TutorialOverlay } from "@/components/tutorial";
import { useLanguage } from "@/context/LanguageContext";
import { C, FONT } from "@/tokens";

function PublicLayoutContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { startTutorial } = useTutorial();

  const isLanding = location.pathname === "/";

  // Check if URL query asks for tour (?tour=true)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("tour") === "true") {
      // Small timeout to allow landing elements to paint
      const timer = setTimeout(() => {
        startTutorial();
        // Clean query param from URL without reloading
        window.history.replaceState({}, "", location.pathname);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.search, startTutorial]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT.body,
        background: C.bg,
        position: "relative",
      }}
    >
      {/* ── Top Header on Non-Landing Public Pages (Login, Register, Onboarding) ── */}
      {!isLanding && (
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "#0E1813",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "0 4%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
            backdropFilter: "blur(12px)",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Logo & Platform Name */}
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <img
              src="/gyanmarg_logo.jpg"
              alt="GyanMarg AI Logo"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1.5px solid rgba(198, 133, 27, 0.75)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                }}
              >
                GyanMarg
              </span>
              <span
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  color: C.accent,
                  background: "rgba(198, 133, 27, 0.22)",
                  border: "1px solid rgba(198, 133, 27, 0.5)",
                  borderRadius: 6,
                  padding: "1px 6px",
                }}
              >
                AI
              </span>
            </div>
          </div>

          {/* Right Controls: Tour button, Language Selector, Back to Home */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={() => navigate("/?tour=true")}
              style={{
                background: "rgba(198, 133, 27, 0.16)",
                border: `1.5px solid ${C.accent}60`,
                borderRadius: 20,
                padding: "7px 16px",
                fontFamily: FONT.body,
                fontSize: 13,
                fontWeight: 700,
                color: C.accent,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = C.accent;
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(198, 133, 27, 0.16)";
                (e.currentTarget as HTMLButtonElement).style.color = C.accent;
              }}
            >
              {t("take_tour")}
            </button>

            <LanguageSelector variant="compact" />

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: FONT.body,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: 8,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255, 255, 255, 0.8)";
              }}
            >
              {t("back_to_home")}
            </button>
          </div>
        </header>
      )}

      {/* Main Outlet */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>

      {/* Interactive Guided Tutorial Overlay (Works on all public pages) */}
      <TutorialOverlay />
    </div>
  );
}

export default function PublicLayout() {
  return (
    <TutorialProvider>
      <PublicLayoutContent />
    </TutorialProvider>
  );
}
