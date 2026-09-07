import { useState, useEffect } from "react";
import { FONT } from "@/tokens";

// ── Curated palette per slide ─────────────────────────────────────────────────
const PALETTE = {
  s1: {
    bg: "#1B2E22",
    bg2: "#2A3D2E",
    border: "rgba(198,133,27,0.22)",
    accent: "#C6851B",
    accentMuted: "rgba(198,133,27,0.13)",
    accentBorder: "rgba(198,133,27,0.3)",
    text: "#F5EDD8",
    textMuted: "rgba(245,237,216,0.55)",
    pill: "rgba(198,133,27,0.16)",
    pillBorder: "rgba(198,133,27,0.36)",
    dot: "#C6851B",
    imgBg: "rgba(198,133,27,0.07)",
  },
  s2: {
    bg: "#1B2533",
    bg2: "#243046",
    border: "rgba(148,180,220,0.2)",
    accent: "#94B4DC",
    accentMuted: "rgba(148,180,220,0.1)",
    accentBorder: "rgba(148,180,220,0.27)",
    text: "#E8EFF8",
    textMuted: "rgba(232,239,248,0.52)",
    pill: "rgba(148,180,220,0.13)",
    pillBorder: "rgba(148,180,220,0.3)",
    dot: "#94B4DC",
    imgBg: "rgba(148,180,220,0.07)",
  },
  s3: {
    bg: "#2E1F14",
    bg2: "#3D2818",
    border: "rgba(200,120,60,0.2)",
    accent: "#D4834A",
    accentMuted: "rgba(200,120,60,0.1)",
    accentBorder: "rgba(200,120,60,0.28)",
    text: "#FAF0E6",
    textMuted: "rgba(250,240,230,0.53)",
    pill: "rgba(200,120,60,0.14)",
    pillBorder: "rgba(200,120,60,0.34)",
    dot: "#D4834A",
    imgBg: "rgba(200,120,60,0.07)",
  },
  s4: {
    bg: "#162923",
    bg2: "#1E3830",
    border: "rgba(110,185,155,0.2)",
    accent: "#6EB99B",
    accentMuted: "rgba(110,185,155,0.1)",
    accentBorder: "rgba(110,185,155,0.26)",
    text: "#E4F5EF",
    textMuted: "rgba(228,245,239,0.52)",
    pill: "rgba(110,185,155,0.13)",
    pillBorder: "rgba(110,185,155,0.3)",
    dot: "#6EB99B",
    imgBg: "rgba(110,185,155,0.07)",
  },
};

const slides = [
  {
    id: 1,
    palette: PALETTE.s1,
    badgeHindi: "कर्मयोगी भारत",
    badgeEng: "Mission Karmayogi",
    emoji: "🇮🇳",
    title: "National Capacity\nBuilding",
    subTitle: "Civil Services — 1.72 Cr+ Officers",
    tagline:
      "Learn. Network. Grow — iGOT Karmayogi connects every civil servant to the right course at the right time.",
    pills: ["1.72 Cr+ Enrolled", "6,280 Courses", "Mission Karmayogi"],
    stat: { value: "1.72 Cr+", label: "Officers Onboarded" },
    image: "/slide1.jpg",
  },
  {
    id: 2,
    palette: PALETTE.s2,
    badgeHindi: "डिजिटल सांख्यिकी",
    badgeEng: "Applied Statistics",
    emoji: "📊",
    title: "Statistical & Data\nModernization",
    subTitle: "Advanced Statistical Analysis & Sampling",
    tagline:
      "Empowering 12,000+ analysts and researchers in modern survey methodologies and big data analytics.",
    pills: ["Applied Statistics", "Data Modeling", "Survey Analysis"],
    stat: { value: "12,000+", label: "Active Researchers" },
    image: "/slide2.jpg",
  },
  {
    id: 3,
    palette: PALETTE.s3,
    badgeHindi: "विकसित भारत @2047",
    badgeEng: "Viksit Bharat Vision",
    emoji: "🏛️",
    title: "Future-Ready\nCivil Services",
    subTitle: "Integrity · Accountability · Smart Governance",
    tagline:
      "Transforming rule-based governance to role-based excellence — building transparent, citizen-centric institutions.",
    pills: ["Integrity", "Accountability", "Smart Governance"],
    stat: { value: "2047", label: "Vision India" },
    image: "/slide3.jpg",
  },
  {
    id: 4,
    palette: PALETTE.s4,
    badgeHindi: "AI शिक्षण मंच",
    badgeEng: "Karmayogi Shiksha AI",
    emoji: "🤖",
    title: "AI-Powered\nLearning Engine",
    subTitle: "Zero-hallucination MCQs with exact page citations",
    tagline:
      "Upload any PDF or training manual and instantly generate assessed quizzes with source-verified citations.",
    pills: ["RAG Citations", "HITL Review", "Adaptive Scoring"],
    stat: { value: "94%", label: "Completion Rate" },
    image: "/slide4.jpg",
  },
];

export default function IndiaSlidesCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(true); // for fade transition

  const goTo = (idx: number) => {
    if (idx === current) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(idx);
      setVisible(true);
    }, 200);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, current]);

  const slide = slides[current];
  const P = slide.palette;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: "relative",
        background: `linear-gradient(140deg, ${P.bg} 0%, ${P.bg2} 100%)`,
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${P.border}`,
        boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 2px 10px rgba(0,0,0,0.3)",
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT.body,
        transition: "background 0.4s ease",
      }}
    >
      {/* Tricolor top bar */}
      <div style={{ display: "flex", height: 3, flexShrink: 0 }}>
        <div style={{ flex: 1, background: "#E8740C" }} />
        <div style={{ flex: 1, background: "rgba(255,255,255,0.88)" }} />
        <div style={{ flex: 1, background: "#1A7A30" }} />
      </div>

      {/* Radial accent glow */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${P.accent}1A 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 0.4s ease",
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: "14px 20px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${P.border}`,
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
          transition: "border-color 0.4s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{slide.emoji}</span>
          <div>
            <div
              style={{
                fontFamily: FONT.display,
                fontSize: 13,
                fontWeight: 700,
                color: P.text,
                letterSpacing: "0.01em",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.25s ease",
              }}
            >
              {slide.badgeHindi}
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: P.accent,
                marginTop: 1,
                opacity: visible ? 1 : 0,
                transition: "opacity 0.25s ease",
              }}
            >
              {slide.badgeEng}
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: P.textMuted,
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${P.border}`,
            borderRadius: 10,
            padding: "3px 10px",
            letterSpacing: "0.04em",
          }}
        >
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      </div>

      {/* Body — split layout */}
      <div
        style={{
          flex: 1,
          display: "flex",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* LEFT — Text content */}
        <div
          style={{
            flex: "0 0 56%",
            padding: "22px 20px 18px 22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.28s ease, transform 0.28s ease",
          }}
        >
          <div>


            {/* Title */}
            <h3
              style={{
                fontFamily: FONT.display,
                fontSize: "clamp(17px, 1.8vw, 23px)",
                fontWeight: 800,
                color: P.text,
                lineHeight: 1.22,
                marginBottom: 10,
                letterSpacing: "-0.01em",
                whiteSpace: "pre-line",
              }}
            >
              {slide.title}
            </h3>

            {/* Tagline */}
            <p
              style={{
                fontSize: 12.5,
                lineHeight: 1.7,
                color: P.textMuted,
                marginBottom: 18,
              }}
            >
              {slide.tagline}
            </p>

            {/* Pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {slide.pills.map((pill, i) => (
                <span
                  key={pill}
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: i === 0 ? P.accent : P.text,
                    background: i === 0 ? P.pill : "rgba(255,255,255,0.05)",
                    border: `1px solid ${i === 0 ? P.pillBorder : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 6,
                    padding: "4px 10px",
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Stat + Controls */}
          <div
            style={{
              paddingTop: 14,
              borderTop: `1px solid ${P.border}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontSize: 20,
                  fontWeight: 800,
                  color: P.accent,
                  lineHeight: 1,
                }}
              >
                {slide.stat.value}
              </div>
              <div style={{ fontSize: 10, color: P.textMuted, marginTop: 3 }}>
                {slide.stat.label}
              </div>
            </div>

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Dot indicators */}
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    style={{
                      width: current === idx ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background:
                        current === idx ? P.dot : "rgba(255,255,255,0.2)",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      outline: "none",
                    }}
                  />
                ))}
              </div>

              {/* Prev / Next */}
              {(["◀", "▶"] as const).map((arrow, i) => (
                <button
                  key={arrow}
                  type="button"
                  onClick={() =>
                    goTo(
                      i === 0
                        ? (current - 1 + slides.length) % slides.length
                        : (current + 1) % slides.length
                    )
                  }
                  aria-label={i === 0 ? "Previous" : "Next"}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: "rgba(255,255,255,0.07)",
                    border: `1px solid ${P.border}`,
                    color: P.textMuted,
                    fontSize: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = P.accentMuted;
                    el.style.color = P.accent;
                    el.style.borderColor = P.accentBorder;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.07)";
                    el.style.color = P.textMuted;
                    el.style.borderColor = P.border;
                  }}
                >
                  {arrow}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div
          style={{
            width: 1,
            background: `linear-gradient(to bottom, transparent, ${P.border}, transparent)`,
            flexShrink: 0,
            margin: "16px 0",
          }}
        />

        {/* RIGHT — Illustration */}
        <div
          style={{
            flex: "0 0 44%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 12px",
            background: P.imgBg,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Soft inner glow behind image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at center, ${P.accent}12 0%, transparent 72%)`,
              pointerEvents: "none",
            }}
          />
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.badgeEng}
            style={{
              width: "100%",
              maxWidth: 220,
              height: "auto",
              objectFit: "contain",
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(8px)",
              transition: "opacity 0.32s ease, transform 0.32s ease",
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
