import { Outlet, useLocation } from "react-router";
import LanguageSelector from "@/components/LanguageSelector";
import { C, FONT } from "@/tokens";

export default function PublicLayout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

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
      {/* If not on the landing page (e.g. login, register, onboarding), provide the language selector at the top-right */}
      {!isLanding && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 24,
            zIndex: 100,
          }}
        >
          <LanguageSelector variant="compact" />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>
    </div>
  );
}
