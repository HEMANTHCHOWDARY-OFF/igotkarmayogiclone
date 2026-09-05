import { useState } from "react";
import { C, FONT } from "@/tokens";

type Tab = "Profile" | "Notifications" | "Learning Preferences" | "Security";

const TABS: Tab[] = ["Profile", "Notifications", "Learning Preferences", "Security"];

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div
    onClick={onChange}
    style={{
      width: 44, height: 24, borderRadius: 12,
      background: checked ? C.s1 : C.border,
      position: "relative", cursor: "pointer", transition: "background 0.2s",
      flexShrink: 0
    }}
  >
    <div style={{
      position: "absolute", top: 3, left: checked ? 23 : 3,
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
    }} />
  </div>
);

const FormField = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
      {label}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>{hint}</div>}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`,
  borderRadius: 8, fontSize: 14, color: C.dark, background: C.bg,
  outline: "none", fontFamily: FONT.body, boxSizing: "border-box"
};

const readOnlyStyle: React.CSSProperties = {
  ...inputStyle, background: "#F0EDE4", color: C.muted, cursor: "not-allowed"
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");

  // Profile state
  const [profile, setProfile] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@gov.in",
    service: "IAS",
    batch: "2019",
    ministry: "Ministry of Rural Development",
    phone: "+91 98765 43210",
    bio: "Civil servant committed to rural development and citizen-centric governance.",
  });

  // Notifications state
  const [notifs, setNotifs] = useState({
    emailNotifications: true,
    assessmentReminders: true,
    courseRecommendations: false,
    weeklyDigest: true,
  });

  // Learning Prefs state
  const [prefs, setPrefs] = useState({
    language: "English",
    dailyGoal: 1,
    learningStyle: "Mixed",
    digestFrequency: "Weekly",
  });

  // Security state
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sessions = [
    { device: "Chrome on Windows", location: "New Delhi, IN", time: "Active now" },
    { device: "Safari on iPhone", location: "New Delhi, IN", time: "2 hours ago" },
    { device: "Firefox on Linux", location: "Hyderabad, IN", time: "3 days ago" },
  ];

  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body }}>
      {/* Header */}
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, fontFamily: FONT.display, margin: "0 0 24px" }}>
        Settings
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: C.surface, padding: 4, borderRadius: 10, border: `1px solid ${C.border}`, width: "fit-content" }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 18px", border: "none", borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT.body,
              background: activeTab === tab ? C.dark : "transparent",
              color: activeTab === tab ? "#fff" : C.muted,
              transition: "all 0.15s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "28px 32px",
        maxWidth: 700
      }}>
        {/* PROFILE TAB */}
        {activeTab === "Profile" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.dark, fontFamily: FONT.display, marginBottom: 24, marginTop: 0 }}>
              Profile Information
            </h2>

            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", background: C.dark,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 24, flexShrink: 0
              }}>RK</div>
              <div>
                <button style={{
                  padding: "8px 16px", background: "transparent", border: `1.5px solid ${C.border}`,
                  borderRadius: 8, fontSize: 13, fontWeight: 600, color: C.dark,
                  cursor: "pointer", fontFamily: FONT.body, marginRight: 10
                }}>
                  Change Photo
                </button>
                <div style={{ fontSize: 12, color: C.faint, marginTop: 6 }}>JPG, PNG up to 2MB</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <FormField label="Full Name">
                <input
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Official Email" hint="Email cannot be changed">
                <input value={profile.email} readOnly style={readOnlyStyle} />
              </FormField>
              <FormField label="Service">
                <input
                  value={profile.service}
                  onChange={e => setProfile({ ...profile, service: e.target.value })}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Batch Year">
                <input
                  value={profile.batch}
                  onChange={e => setProfile({ ...profile, batch: e.target.value })}
                  style={inputStyle}
                />
              </FormField>
            </div>

            <FormField label="Ministry / Department">
              <input
                value={profile.ministry}
                onChange={e => setProfile({ ...profile, ministry: e.target.value })}
                style={inputStyle}
              />
            </FormField>
            <FormField label="Phone">
              <input
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                style={inputStyle}
              />
            </FormField>
            <FormField label="Bio">
              <textarea
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </FormField>

            <button
              onClick={handleSave}
              style={{
                padding: "11px 28px", background: saved ? C.s1 : C.accent, color: "#fff",
                border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: FONT.body, transition: "background 0.2s"
              }}
            >
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "Notifications" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.dark, fontFamily: FONT.display, marginBottom: 24, marginTop: 0 }}>
              Notification Preferences
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {(Object.entries(notifs) as [keyof typeof notifs, boolean][]).map(([key, val], i) => {
                const labels: Record<string, { title: string; desc: string }> = {
                  emailNotifications: { title: "Email Notifications", desc: "Receive important updates and alerts via email" },
                  assessmentReminders: { title: "Assessment Reminders", desc: "Get reminded before assessment deadlines" },
                  courseRecommendations: { title: "Course Recommendations", desc: "Receive AI-powered course suggestions based on your profile" },
                  weeklyDigest: { title: "Weekly Digest", desc: "A weekly summary of your learning activity" },
                };
                const info = labels[key];
                return (
                  <div key={key} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "18px 0", borderBottom: i < Object.keys(notifs).length - 1 ? `1px solid ${C.border}` : "none"
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: C.dark, fontSize: 14 }}>{info.title}</div>
                      <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{info.desc}</div>
                    </div>
                    <Toggle checked={val} onChange={() => setNotifs({ ...notifs, [key]: !val })} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LEARNING PREFERENCES TAB */}
        {activeTab === "Learning Preferences" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.dark, fontFamily: FONT.display, marginBottom: 24, marginTop: 0 }}>
              Learning Preferences
            </h2>

            <FormField label="Preferred Language">
              <select
                value={prefs.language}
                onChange={e => setPrefs({ ...prefs, language: e.target.value })}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi"].map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </FormField>

            <FormField label={`Daily Learning Goal: ${prefs.dailyGoal} hour${prefs.dailyGoal !== 1 ? "s" : ""}`}>
              <input
                type="range" min={0.5} max={4} step={0.5}
                value={prefs.dailyGoal}
                onChange={e => setPrefs({ ...prefs, dailyGoal: Number(e.target.value) })}
                style={{ width: "100%", accentColor: C.s1 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: C.faint }}>30 min</span>
                <span style={{ fontSize: 11, color: C.faint }}>4 hours</span>
              </div>
            </FormField>

            <FormField label="Learning Style">
              <div style={{ display: "flex", gap: 10 }}>
                {["Visual", "Reading", "Mixed"].map(style => (
                  <button
                    key={style}
                    onClick={() => setPrefs({ ...prefs, learningStyle: style })}
                    style={{
                      flex: 1, padding: "10px", border: `1.5px solid ${prefs.learningStyle === style ? C.s1 : C.border}`,
                      borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: prefs.learningStyle === style ? "#EBF5F0" : "transparent",
                      color: prefs.learningStyle === style ? C.s1 : C.muted,
                      fontFamily: FONT.body
                    }}
                  >
                    {style === "Visual" ? "🎥 " : style === "Reading" ? "📖 " : "🔄 "}{style}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField label="Email Digest Frequency">
              <select
                value={prefs.digestFrequency}
                onChange={e => setPrefs({ ...prefs, digestFrequency: e.target.value })}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {["Daily", "Weekly", "Fortnightly", "Never"].map(f => <option key={f}>{f}</option>)}
              </select>
            </FormField>

            <button
              onClick={handleSave}
              style={{
                padding: "11px 28px", background: saved ? C.s1 : C.accent, color: "#fff",
                border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: FONT.body, transition: "background 0.2s"
              }}
            >
              {saved ? "✓ Saved!" : "Save Preferences"}
            </button>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "Security" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.dark, fontFamily: FONT.display, marginBottom: 24, marginTop: 0 }}>
              Security
            </h2>

            {/* Change Password */}
            <div style={{
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: "20px 22px", marginBottom: 28
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.dark, margin: "0 0 18px", fontFamily: FONT.display }}>
                Change Password
              </h3>
              <FormField label="Current Password">
                <input
                  type="password"
                  value={pwForm.current}
                  onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                  placeholder="Enter current password"
                  style={inputStyle}
                />
              </FormField>
              <FormField label="New Password">
                <input
                  type="password"
                  value={pwForm.newPw}
                  onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })}
                  placeholder="Min 8 characters"
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Confirm New Password">
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                  placeholder="Re-enter new password"
                  style={inputStyle}
                />
              </FormField>
              <button style={{
                padding: "10px 22px", background: C.dark, color: "#fff",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT.body
              }}>
                Update Password
              </button>
            </div>

            {/* Active Sessions */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.dark, margin: "0 0 14px", fontFamily: FONT.display }}>
                Active Sessions
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sessions.map((s, i) => (
                  <div key={i} style={{
                    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
                    padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: C.dark, fontSize: 13 }}>{s.device}</div>
                      <div style={{ color: C.faint, fontSize: 12, marginTop: 2 }}>
                        {s.location} · {s.time}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {s.time === "Active now" && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: C.s1,
                          background: "#EBF5F0", padding: "3px 8px", borderRadius: 10
                        }}>Current</span>
                      )}
                      {s.time !== "Active now" && (
                        <button style={{
                          fontSize: 12, color: C.s4, background: "#FFE8E2",
                          border: "none", borderRadius: 6, padding: "5px 10px",
                          cursor: "pointer", fontFamily: FONT.body, fontWeight: 600
                        }}>
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button style={{
                marginTop: 14, padding: "9px 18px", background: "transparent",
                border: `1.5px solid ${C.s4}`, color: C.s4,
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT.body
              }}>
                Sign Out All Other Sessions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
