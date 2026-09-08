import { Outlet, NavLink, useNavigate } from "react-router";
import { C, FONT } from "@/tokens";
import LanguageSelector from "@/components/LanguageSelector";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { to: "/student/dashboard",     icon: "⊞",  label: "Dashboard"            },
  { to: "/student/profile",       icon: "◎",  label: "Skill Profile"        },
  { to: "/student/assessment",    icon: "✎",  label: "Assessment"           },
  { to: "/student/gap-analysis",  icon: "⬡",  label: "Gap Analysis"         },
  { to: "/student/learning-path", icon: "⤑",  label: "Learning Path"        },
  { to: "/student/courses",       icon: "⊟",  label: "Course Discovery"     },
  { to: "/student/progress",      icon: "↗",  label: "Progress & Analytics" },
  { to: "/student/achievements",  icon: "◈",  label: "Achievements"         },
];

const bottom = [
  { to: "/student/settings", icon: "⚙", label: "Settings" },
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const { profile, signOut, isDemo } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: FONT.body, background: C.bg }}>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: C.sidebarBg,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg viewBox="0 0 32 32" fill="none" width={18} height={18}>
                <path d="M16 3C16 3 8 9 8 17a8 8 0 0016 0C24 9 16 3 16 3z" fill="#fff"/>
                <circle cx="16" cy="17" r="3" fill={C.accent}/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
                GyanMarg <span style={{ color: C.accent }}>AI</span>
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Student Portal</div>
            </div>
          </div>
        </div>

        {/* Student info */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: C.s1,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
            overflow: "hidden",
          }}>
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              profile?.initials || "PS"
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile?.fullName || "Student Learner"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.40)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile?.track || "University Scholar"} {isDemo && <span style={{ color: C.accent, fontSize: 9 }}>(Demo)</span>}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
          {nav.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              textDecoration: "none",
              background: isActive ? `${C.accent}22` : "transparent",
              color: isActive ? C.accent : "rgba(255,255,255,0.55)",
              fontWeight: isActive ? 600 : 400,
              fontSize: 13,
              transition: "all 0.15s",
              borderLeft: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
            })}
              onMouseEnter={e => {
                if (!(e.currentTarget as HTMLElement).style.borderLeft.includes(C.accent)) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                if (!el.style.borderLeft.includes(C.accent)) {
                  el.style.background = "transparent";
                  el.style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "10px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {bottom.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, marginBottom: 4,
              textDecoration: "none",
              background: isActive ? `${C.accent}22` : "transparent",
              color: isActive ? C.accent : "rgba(255,255,255,0.45)",
              fontSize: 13,
            })}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 8, width: "100%",
            background: "transparent", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.35)", fontSize: 13, textAlign: "left",
          }}>
            <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>⏻</span>
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          height: 56, flexShrink: 0,
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.faint }}>Student Portal</span>
            <span style={{ color: C.border }}>›</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>GyanMarg AI</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <LanguageSelector variant="compact" />
            <div
              onClick={() => navigate("/student/settings")}
              title={profile?.fullName || "Profile"}
              style={{
                width: 32, height: 32, borderRadius: "50%", background: C.s1,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                profile?.initials || "PS"
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
