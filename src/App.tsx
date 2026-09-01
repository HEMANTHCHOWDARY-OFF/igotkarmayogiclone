import { useState } from "react";

// ── Social icon SVGs ────────────────────────────────────────────────────────

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ── Stat items ───────────────────────────────────────────────────────────────

const stats = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    value: "1,72,20,735",
    label: "Total Karmayogis Onboarded",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    ),
    value: "6,284",
    label: "Total Courses",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    ),
    value: "15,11,87,099",
    label: "Total Completions",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
    value: "16,14,142",
    label: "Monthly Active Users",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.08 15.92 0 13.36 0c-1.3 0-2.48.52-3.36 1.36C9.12.52 7.94 0 6.64 0 4.08 0 2 2.08 2 4.64c0 .48.11.92.18 1.36H0v14h20V6zm-6.64-4c1.4 0 2.64 1.16 2.64 2.64 0 1.36-.64 2.36-2 3.36H14c-1.32-1-2-2-2-3.36C12 3.16 13.24 2 13.36 2zm-6.72 0C7.96 2 9.2 3.16 9.2 4.64c0 1.36-.68 2.36-2 3.36H7.2C5.88 7 5.2 6 5.2 4.64 5.2 3.16 6.44 2 6.64 2zM18 18H2v-2h16v2zm0-4H2v-2h16v2zm0-4H2V8h16v2z" />
      </svg>
    ),
    value: "3,42,440",
    label: "Certificates Issued Yesterday",
  },
];

// ── Social links ─────────────────────────────────────────────────────────────

const socials = [
  { icon: <XIcon />, label: "X / Twitter" },
  { icon: <LinkedInIcon />, label: "LinkedIn" },
  { icon: <YouTubeIcon />, label: "YouTube" },
  { icon: <InstagramIcon />, label: "Instagram" },
  { icon: <FacebookIcon />, label: "Facebook" },
];

// ── Nav links ────────────────────────────────────────────────────────────────

const navLinks = ["About Us", "Newsroom", "Career", "Tenders", "Notifications", "Help Centre"];

// ── Hero image (Rashtrapati Bhavan / govt building) ──────────────────────────
const HERO_IMG =
  "https://images.unsplash.com/photo-1760872646289-5da7cb893dd4?w=800&h=500&fit=crop&auto=format";

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "#F4EFE4",
        overflowX: "hidden",
      }}
    >
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="px-4 pt-5 pb-2">
        <nav
          className="mx-auto flex items-center justify-between px-6 py-3"
          style={{
            maxWidth: 1180,
            background: "#fff",
            borderRadius: 48,
            boxShadow: "0 2px 20px rgba(22,61,44,0.10)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#163D2C" }}
            >
              <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                <path
                  d="M16 4C16 4 8 10 8 18a8 8 0 0016 0C24 10 16 4 16 4z"
                  fill="#C8892C"
                />
                <circle cx="16" cy="18" r="3" fill="#fff" />
                <path d="M10 14q3-4 6-4t6 4" stroke="#fff" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#163D2C",
                  lineHeight: 1.1,
                }}
              >
                कर्मयोगी भारत
              </div>
              <div style={{ fontSize: 9, color: "#8BA090", letterSpacing: "0.04em" }}>
                लोकसेवा नया कलेवल
              </div>
            </div>
          </div>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="px-3 py-1.5 text-sm rounded-full transition-colors"
                  style={{ color: "#163D2C", fontWeight: 500 }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.background = "#EBF3EE")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.background = "transparent")
                  }
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Auth buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="px-5 py-2 rounded-full text-sm font-semibold border-2 transition-colors"
              style={{ borderColor: "#163D2C", color: "#163D2C", background: "transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#163D2C";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#163D2C";
              }}
            >
              Log in
            </button>
            <button
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ background: "#C8892C", color: "#fff" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#A87020")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#C8892C")
              }
            >
              Register
            </button>
          </div>
        </nav>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <main className="flex-1 relative" style={{ background: "#F4EFE4" }}>
        {/* Decorative shapes */}
        <div
          className="absolute pointer-events-none"
          style={{ top: 32, right: "calc(38% + 8px)", zIndex: 0 }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "#163D2C",
              borderRadius: 10,
              transform: "rotate(25deg)",
            }}
          />
        </div>
        <div
          className="absolute pointer-events-none"
          style={{ bottom: 60, right: "calc(38% - 48px)", zIndex: 0 }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: "#C8892C",
              borderRadius: 8,
              transform: "rotate(-15deg)",
            }}
          />
        </div>
        {/* Right corner accent */}
        <div
          className="absolute pointer-events-none"
          style={{ bottom: 80, right: 24, zIndex: 0 }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: "#C8892C",
              borderRadius: 8,
              transform: "rotate(20deg)",
            }}
          />
        </div>

        <div
          className="mx-auto flex flex-col md:flex-row items-center justify-between gap-12 px-6 py-14"
          style={{ maxWidth: 1180, position: "relative", zIndex: 1 }}
        >
          {/* Left: text + socials */}
          <div className="flex-1 min-w-0">
            <p
              className="mb-3 text-base font-semibold"
              style={{ color: "#163D2C", letterSpacing: "0.01em" }}
            >
              iGOT Karmayogi
            </p>
            <h1
              className="mb-8 leading-tight"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "#C8892C",
              }}
            >
              Transforming &amp;
              <br />
              Empowering Civil Servants
            </h1>

            <div>
              <p
                className="mb-4 text-sm font-semibold uppercase tracking-widest"
                style={{ color: "#163D2C" }}
              >
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <button
                    key={s.label}
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{ background: "#163D2C", color: "#F4EFE4" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#C8892C";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#163D2C";
                    }}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: hero card */}
          <div className="flex-1 flex flex-col items-center w-full md:w-auto" style={{ maxWidth: 540 }}>
            <div
              className="relative w-full overflow-hidden"
              style={{
                borderRadius: 16,
                border: "4px solid #fff",
                boxShadow: "0 8px 40px rgba(22,61,44,0.22)",
                background: "#163D2C",
                aspectRatio: "16/10",
              }}
            >
              {/* Image */}
              <img
                src={HERO_IMG}
                alt="Government of India — Karmayogi Bharat initiative"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.55 }}
              />

              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                {/* Mini logo pill */}
                <div
                  className="inline-flex items-center gap-2 self-start mb-4 px-3 py-1.5 rounded-full"
                  style={{ background: "#fff" }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#163D2C" }}
                  >
                    <svg viewBox="0 0 32 32" fill="none" className="w-3 h-3">
                      <path d="M16 4C16 4 8 10 8 18a8 8 0 0016 0C24 10 16 4 16 4z" fill="#C8892C" />
                      <circle cx="16" cy="18" r="3" fill="#fff" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 700,
                      fontSize: 11,
                      color: "#163D2C",
                    }}
                  >
                    कर्मयोगी भारत
                  </span>
                </div>

                <h2
                  className="font-bold uppercase mb-3"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    color: "#fff",
                    lineHeight: 1.1,
                  }}
                >
                  KARMAYOGI BHARAT
                </h2>

                <div
                  className="inline-block px-3 py-1 rounded mb-4 text-sm font-semibold"
                  style={{ background: "#C8892C", color: "#fff" }}
                >
                  National Program For Civil Services Capacity Building
                </div>

                <p
                  className="text-sm tracking-widest"
                  style={{ color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}
                >
                  Learn. Network. Grow Your Career
                </p>
              </div>
            </div>

            {/* Carousel dots */}
            <div className="flex gap-2 mt-5">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === activeSlide ? 28 : 10,
                    height: 10,
                    background: i === activeSlide ? "#C8892C" : "#163D2C",
                    opacity: i === activeSlide ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Stats Bar ───────────────────────────────────────────────────────── */}
      <footer style={{ background: "#163D2C" }}>
        <div
          className="mx-auto grid gap-px"
          style={{
            maxWidth: 1180,
            gridTemplateColumns: "repeat(5, 1fr)",
            padding: "0 24px",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-start gap-4 px-5 py-7"
              style={{
                borderRight: i < 4 ? "1px solid rgba(255,255,255,0.12)" : "none",
              }}
            >
              <div style={{ color: "#C8892C", flexShrink: 0, opacity: 0.9 }}>{stat.icon}</div>
              <div>
                <div
                  className="font-bold"
                  style={{
                    color: "#fff",
                    fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
                    fontFamily: "'Fraunces', serif",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-1"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 11,
                    lineHeight: 1.4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
