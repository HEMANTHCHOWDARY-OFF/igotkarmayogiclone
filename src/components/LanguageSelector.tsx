import React, { useState, useRef, useEffect, useId } from "react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { C, FONT } from "@/tokens";

interface LanguageSelectorProps {
  variant?: "topbar" | "navbar" | "compact";
}

export default function LanguageSelector({ variant = "topbar" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        const currentIndex = SUPPORTED_LANGUAGES.findIndex((l) => l.code === language);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % SUPPORTED_LANGUAGES.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + SUPPORTED_LANGUAGES.length) % SUPPORTED_LANGUAGES.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < SUPPORTED_LANGUAGES.length) {
        setLanguage(SUPPORTED_LANGUAGES[highlightedIndex].code);
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Colors based on variant
  const isDark = variant === "topbar";
  const bgBadge = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(27, 61, 41, 0.06)";
  const borderBadge = isDark ? "rgba(255, 255, 255, 0.22)" : C.border;
  const textColor = isDark ? "#FFFFFF" : C.dark;
  const mutedText = isDark ? "rgba(255, 255, 255, 0.75)" : C.muted;

  return (
    <div
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        fontFamily: FONT.body,
        userSelect: "none",
      }}
    >
      {variant === "compact" ? (
        /* Compact Single Dropdown Pill for Auth / Mobile headers */
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          title="Select Language / भाषा चुनें"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: bgBadge,
            border: `1.5px solid ${borderBadge}`,
            borderRadius: 20,
            padding: "7px 14px",
            color: textColor,
            fontFamily: FONT.body,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            outline: "none",
            transition: "all 0.18s ease",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.accent;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = borderBadge;
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: C.accent,
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {current.nativeName}
          </span>
          <span>{current.label}</span>
          <span style={{ fontSize: 9, opacity: 0.8 }}>{isOpen ? "▲" : "▼"}</span>
        </button>
      ) : (
        /* Full Segmented Quick-Switch Bar with Dropdown Chevron */
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: bgBadge,
            border: `1.5px solid ${borderBadge}`,
            borderRadius: 24,
            padding: "3px 6px",
            gap: 4,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Quick EN button */}
          <button
            type="button"
            onClick={() => setLanguage("en")}
            aria-label="Switch to English"
            style={{
              fontFamily: FONT.body,
              fontSize: 13.5,
              fontWeight: language === "en" ? 700 : 500,
              color: language === "en" ? "#FFFFFF" : mutedText,
              background: language === "en" ? C.accent : "transparent",
              border: "none",
              borderRadius: 18,
              padding: "7px 14px",
              cursor: "pointer",
              transition: "all 0.18s ease",
              outline: "none",
            }}
          >
            EN
          </button>

          {/* Quick HI button */}
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            aria-label="हिन्दी में बदलें"
            style={{
              fontFamily: "'Noto Sans Devanagari', 'Hind', sans-serif",
              fontSize: 13.5,
              fontWeight: language === "hi" ? 700 : 500,
              color: language === "hi" ? "#FFFFFF" : mutedText,
              background: language === "hi" ? C.accent : "transparent",
              border: "none",
              borderRadius: 18,
              padding: "7px 14px",
              cursor: "pointer",
              transition: "all 0.18s ease",
              outline: "none",
            }}
          >
            हिन्दी
          </button>

          {/* Current language tag if neither EN nor HI */}
          {language !== "en" && language !== "hi" && (
            <span
              style={{
                fontFamily: FONT.body,
                fontSize: 12.5,
                fontWeight: 700,
                color: "#FFFFFF",
                background: C.accent,
                borderRadius: 18,
                padding: "6px 12px",
              }}
            >
              {current.label}
            </span>
          )}

          {/* Dropdown Chevron toggle */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            title="All Indian Languages / सभी भाषाएं"
            style={{
              background: "transparent",
              border: "none",
              color: mutedText,
              cursor: "pointer",
              fontSize: 11,
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              borderRadius: 14,
              outline: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = textColor;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = mutedText;
            }}
          >
            <span style={{ fontSize: 10 }}>{isOpen ? "▲" : "▼"}</span>
          </button>
        </div>
      )}

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Supported Languages"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "#FFFFFF",
            border: `1.5px solid ${C.border}`,
            borderRadius: 12,
            boxShadow: "0 14px 34px -6px rgba(0, 0, 0, 0.22), 0 8px 16px -4px rgba(0, 0, 0, 0.12)",
            padding: 8,
            minWidth: 200,
            zIndex: 1000,
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          <div
            style={{
              padding: "6px 10px 8px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: C.muted,
              borderBottom: `1px solid ${C.border}`,
              marginBottom: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Select Language / भाषा</span>
            <span style={{ fontSize: 10, color: C.faint, fontWeight: 500 }}>
              {SUPPORTED_LANGUAGES.length} Indian Languages
            </span>
          </div>

          {SUPPORTED_LANGUAGES.map((item, idx) => {
            const isSelected = language === item.code;
            const isHighlighted = idx === highlightedIndex;

            return (
              <div
                key={item.code}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: isSelected
                    ? `${C.accent}18`
                    : isHighlighted
                    ? "#F4EFE6"
                    : "transparent",
                  color: isSelected ? C.accentHov : C.dark,
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.12s ease",
                  outline: "none",
                  marginBottom: 2,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: isSelected ? C.accent : "#E6E2D6",
                      color: isSelected ? "#FFFFFF" : C.dark,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {item.nativeName}
                  </span>
                  <div>
                    <div style={{ lineHeight: 1.2 }}>{item.label}</div>
                    <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 400, marginTop: 2 }}>
                      {item.subLabel}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <span style={{ color: C.accent, fontSize: 14, fontWeight: 800 }}>✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
