import { Outlet, NavLink, useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import LanguageSelector from "@/components/LanguageSelector";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { to: "/admin/dashboard",   icon: "⊞", label: "Dashboard"              },
  { to: "/admin/students",    icon: "◎", label: "Student Management"     },
  { to: "/admin/analytics",   icon: "↗", label: "Competency Analytics"   },
  { to: "/admin/courses",     icon: "⊟", label: "Course Management"      },
  { to: "/admin/assessments", icon: "✎", label: "Assessment Management"  },
  { to: "/admin/reports",     icon: "⬡", label: "Reports"                },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { profile, signOut, isDemo } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: FONT.body, background: C.bg }}>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside style={{ width: 240, flexShrink: 0, background: "#0F2318", display: "flex", flexDirection: "column" }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 32 32" fill="none" width={18} height={18}>
                <path d="M16 3C16 3 8 9 8 17a8 8 0 0016 0C24 9 16 3 16 3z" fill="#fff"/>
                <circle cx="16" cy="17" r="3" fill={C.accent}/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: "#fff" }}>
                GyanMarg <span style={{ color: C.accent }}>AI</span>
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Admin info */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: C.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
            overflow: "hidden",
          }}>
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              profile?.initials || "DA"
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile?.fullName || "Dr. Anand Kumar"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.40)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile?.institution || "Training Director · DOPT"} {isDemo && <span style={{ color: C.accent, fontSize: 9 }}>(Demo)</span>}
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 10px" }}>
          {nav.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              textDecoration: "none",
              background: isActive ? `${C.accent}22` : "transparent",
              color: isActive ? C.accent : "rgba(255,255,255,0.55)",
              fontWeight: isActive ? 600 : 400, fontSize: 13,
              borderLeft: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
            })}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "10px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 8, width: "100%",
            background: "transparent", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.35)", fontSize: 13,
          }}>
            <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>⏻</span>
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{
          height: 56, flexShrink: 0,
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.faint }}>Admin Portal</span>
            <span style={{ color: C.border }}>›</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>GyanMarg AI</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <LanguageSelector variant="compact" />
            <button style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: C.dark, cursor: "pointer" }}>Export Report</button>
            <div
              title={profile?.fullName || "Admin Profile"}
              style={{
                width: 32, height: 32, borderRadius: "50%", background: C.accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
                overflow: "hidden",
              }}
            >
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                profile?.initials || "DA"
              )}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
