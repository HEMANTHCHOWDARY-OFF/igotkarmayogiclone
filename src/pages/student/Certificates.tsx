import { C, FONT } from "@/tokens";

const earned = [
  {
    id: "GM-2026-KS-00421",
    course: "Foundational Digital Literacy",
    dept: "Applied Computing Track",
    date: "May 28, 2026",
    score: 92,
  },
  {
    id: "GM-2026-KS-00318",
    course: "Public Policy Essentials",
    dept: "Policy & Governance Track",
    date: "Apr 10, 2026",
    score: 88,
  },
];

const inProgress = [
  { course: "Data-Driven Governance", progress: 72 },
  { course: "Effective Communication & Presentation Skills", progress: 45 },
];

export default function Certificates() {
  return (
    <div style={{ padding: "28px 32px", background: C.bg, minHeight: "100vh", fontFamily: FONT.body }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, fontFamily: FONT.display, margin: 0 }}>
            My Certificates
          </h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 14 }}>2 certificates earned</p>
        </div>
        <div style={{
          background: "#FFF8ED", border: `1px solid ${C.accent}`, color: C.accent,
          borderRadius: 20, padding: "8px 20px", fontSize: 14, fontWeight: 600
        }}>
          GyanMarg Certified Learner
        </div>
      </div>

      {/* Earned Certificates */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 20, fontFamily: FONT.display }}>
          Earned Certificates
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {earned.map(cert => (
            <div key={cert.id} style={{
              background: C.surface,
              border: `2px solid ${C.accent}`,
              borderRadius: 16,
              overflow: "hidden",
              position: "relative",
            }}>
              {/* Gold top bar */}
              <div style={{
                height: 6, background: `linear-gradient(90deg, ${C.accent}, #E8A830, ${C.accent})`
              }} />

              <div style={{ padding: "24px 28px", display: "flex", gap: 24, alignItems: "flex-start" }}>
                {/* QR Placeholder */}
                <div style={{
                  width: 80, height: 80, background: C.border, borderRadius: 8,
                  flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: C.faint, textAlign: "center", lineHeight: 1.4
                }}>
                  QR<br />Code
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  {/* Issuer */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{
                      width: 20, height: 20, background: C.dark, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: C.accent, fontWeight: 700
                    }}>GM</div>
                    <span style={{ fontSize: 12, color: C.muted, letterSpacing: 0.5, fontWeight: 600 }}>
                      GYANMARG AI · VERIFIED CREDENTIAL
                    </span>
                  </div>

                  <div style={{
                    fontSize: 20, fontWeight: 700, color: C.dark, fontFamily: FONT.display, marginBottom: 4
                  }}>
                    {cert.course}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>{cert.dept}</div>

                  <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: C.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>Issue Date</div>
                      <div style={{ fontSize: 13, color: C.dark, fontWeight: 600, marginTop: 2 }}>{cert.date}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: C.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>Score</div>
                      <div style={{ fontSize: 13, color: C.s1, fontWeight: 700, marginTop: 2 }}>{cert.score}/100</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: C.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>Certificate ID</div>
                      <div style={{ fontSize: 13, color: C.dark, fontWeight: 600, marginTop: 2, fontFamily: FONT.mono }}>{cert.id}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button style={{
                      padding: "10px 20px", background: C.accent, color: "#fff",
                      border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", fontFamily: FONT.body
                    }}>
                      ⬇ Download PDF
                    </button>
                    <button style={{
                      padding: "10px 20px", background: "transparent",
                      color: C.dark, border: `1.5px solid ${C.border}`,
                      borderRadius: 8, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", fontFamily: FONT.body
                    }}>
                      🔗 Verify Online
                    </button>
                  </div>
                </div>

                {/* Gold seal */}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  border: `3px solid ${C.accent}`, flexShrink: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  background: "#FFF8ED"
                }}>
                  <div style={{ fontSize: 18 }}>🏅</div>
                  <div style={{ fontSize: 8, color: C.accent, fontWeight: 700, textAlign: "center" }}>VERIFIED</div>
                </div>
              </div>

              {/* Bottom bar */}
              <div style={{
                height: 4, background: `linear-gradient(90deg, ${C.accent}, #E8A830, ${C.accent})`
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* In Progress */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16, fontFamily: FONT.display }}>
          Certificates In Progress
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {inProgress.map((c, i) => (
            <div key={i} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 22px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontWeight: 600, color: C.dark, fontSize: 14 }}>{c.course}</div>
                <div style={{ fontSize: 13, color: C.accent, fontWeight: 700 }}>{c.progress}%</div>
              </div>
              <div style={{ height: 8, background: C.border, borderRadius: 4 }}>
                <div style={{
                  height: "100%", borderRadius: 4, width: `${c.progress}%`,
                  background: `linear-gradient(90deg, ${C.s1}, ${C.s3})`
                }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: C.faint }}>
                {100 - c.progress}% more to earn certificate
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Banner */}
      <div style={{
        background: "#EBF5F0", border: `1px solid ${C.s1}`, borderRadius: 12,
        padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start"
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: "50%", background: C.s1, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0
        }}>i</div>
        <div>
          <div style={{ fontWeight: 600, color: C.dark, fontSize: 14, marginBottom: 4 }}>
            Certificate Verification & Standards
          </div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
            GyanMarg AI certificates authenticate verified competency mastery and course completion across standard domain benchmarks.
            Certificates are cryptographically timestamped and can be independently verified via QR code inspection.
          </div>
        </div>
      </div>
    </div>
  );
}
