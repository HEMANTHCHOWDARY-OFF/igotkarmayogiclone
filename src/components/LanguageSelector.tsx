import React, { useState, useRef, useEffect } from "react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { C, FONT } from "@/tokens";

interface LanguageSelectorProps {
  variant?: "topbar" | "navbar" | "compact";
}

export default function LanguageSelector({ variant = "topbar" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; subLabel: string; nativeName: string }[] = [
    { code: "en", label: "English", subLabel: "English", nativeName: "EN" },
    { code: "hi", label: "हिन्दी", subLabel: "Hindi", nativeName: "हि" },
  ];

  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        fontFamily: FONT.body,
        userSelect: "none",
      }}
    >
      {/* Quick Segmented Switch / Button */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: variant === "topbar" ? "rgba(255, 255, 255, 0.08)" : "rgba(27, 61, 41, 0.06)",
          border: variant === "topbar" ? "1.5px solid rgba(255, 255, 255, 0.22)" : `1.5px solid ${C.border}`,
          borderRadius: 24,
          padding: "4px 8px",
          gap: 6,
        }}
      >
        {/* English Button */}
        <button
          type="button"
          onClick={() => setLanguage("en")}
          style={{
            fontFamily: FONT.body,
            fontSize: 14.5,
            fontWeight: language === "en" ? 700 : 600,
            color: language === "en"
              ? "#FFFFFF"
              : variant === "topbar" ? "rgba(255, 255, 255, 0.75)" : C.muted,
            background: language === "en"
              ? (variant === "topbar" ? C.accent : C.dark)
              : "transparent",
            border: "none",
            borderRadius: 20,
            padding: "8px 18px",
            cursor: "pointer",
            transition: "all 0.18s ease",
            outline: "none",
          }}
        >
          English
        </button>

        {/* Hindi Button */}
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          style={{
            fontFamily: FONT.body,
            fontSize: 14.5,
            fontWeight: language === "hi" ? 700 : 600,
            color: language === "hi"
              ? "#FFFFFF"
              : variant === "topbar" ? "rgba(255, 255, 255, 0.75)" : C.muted,
            background: language === "hi"
              ? (variant === "topbar" ? C.accent : C.dark)
              : "transparent",
            border: "none",
            borderRadius: 20,
            padding: "8px 18px",
            cursor: "pointer",
            transition: "all 0.18s ease",
            outline: "none",
          }}
        >
          हिन्दी
        </button>

        {/* Dropdown Chevron toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="Language options"
          aria-expanded={isOpen}
          style={{
            background: "transparent",
            border: "none",
            color: variant === "topbar" ? "rgba(255, 255, 255, 0.8)" : C.muted,
            cursor: "pointer",
            fontSize: 11,
            padding: "0 8px 0 2px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#FFFFFF",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.18), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            padding: 6,
            minWidth: 160,
            zIndex: 1000,
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          <div
            style={{
              padding: "4px 8px 6px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: C.faint,
              borderBottom: `1px solid ${C.border}`,
              marginBottom: 4,
            }}
          >
            Select Language / भाषा चुनें
          </div>

          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: isSelected ? `${C.accent}14` : "transparent",
                  color: isSelected ? C.accentHov : C.dark,
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: 12,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#F4EFE6";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: isSelected ? C.accent : "#E5E7EB",
                      color: isSelected ? "#fff" : "#4B5563",
                      fontSize: 10,
                      fontWeight: 700,
                      textAlign: "center",
                      lineHeight: "20px",
                    }}
                  >
                    {item.nativeName}
                  </span>
                  <div>
                    <div>{item.label}</div>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>{item.subLabel}</div>
                  </div>
                </div>
                {isSelected && <span style={{ color: C.accent, fontSize: 13, fontWeight: 800 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
