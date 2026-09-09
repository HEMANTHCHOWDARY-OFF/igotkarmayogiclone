import React from "react";
import { TutorialStepDefinition } from "./tutorialSteps";
import { useTutorial } from "@/context/TutorialContext";
import { useLanguage } from "@/context/LanguageContext";
import { C, FONT } from "@/tokens";

interface TutorialCardProps {
  step: TutorialStepDefinition;
  targetRect: DOMRect | null;
}

export default function TutorialCard({ step, targetRect }: TutorialCardProps) {
  const { currentStepIndex, totalSteps, nextStep, prevStep, skipTutorial, goToStep } = useTutorial();
  const { t } = useLanguage();

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  // Compute card positioning relative to viewport
  const getCardStyle = (): React.CSSProperties => {
    // Default / Center fallback
    if (!targetRect || step.preferredPosition === "center" || window.innerWidth < 640) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(480px, 92vw)",
        zIndex: 10002,
      };
    }

    const cardWidth = 460;
    const cardEstHeight = 440;
    const padding = 20;

    let top = targetRect.bottom + 16;
    let left = targetRect.left + targetRect.width / 2 - cardWidth / 2;

    // Check preferred position
    if (step.preferredPosition === "top") {
      top = targetRect.top - cardEstHeight - 16;
    } else if (step.preferredPosition === "left") {
      left = targetRect.left - cardWidth - 20;
      top = targetRect.top + targetRect.height / 2 - cardEstHeight / 2;
    } else if (step.preferredPosition === "right") {
      left = targetRect.right + 20;
      top = targetRect.top + targetRect.height / 2 - cardEstHeight / 2;
    }

    // Viewport clamping
    if (left < padding) left = padding;
    if (left + cardWidth > window.innerWidth - padding) {
      left = window.innerWidth - cardWidth - padding;
    }

    if (top < padding) {
      // Flip to below if top overflows
      top = targetRect.bottom + 16;
    }
    if (top + cardEstHeight > window.innerHeight - padding) {
      // Flip to above if bottom overflows
      top = Math.max(padding, targetRect.top - cardEstHeight - 16);
    }

    return {
      position: "fixed",
      top: Math.max(padding, top),
      left: Math.max(padding, left),
      width: `min(${cardWidth}px, 92vw)`,
      zIndex: 10002,
    };
  };

  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div
      style={{
        ...getCardStyle(),
        background: "#FAF7F0",
        border: `2px solid ${C.accent}`,
        borderRadius: 20,
        boxShadow: "0 24px 60px -12px rgba(14, 24, 19, 0.45), 0 0 0 1px rgba(198, 133, 27, 0.25)",
        padding: "24px 26px 20px",
        fontFamily: FONT.body,
        color: C.dark,
        animation: "tourPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: "auto",
      }}
    >
      {/* Header bar: Stage badge & Skip Tour */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 16,
              background: "rgba(198, 133, 27, 0.16)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${C.accent}40`,
            }}
          >
            {step.icon}
          </span>
          <span
            style={{
              fontFamily: "'Unbounded', 'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 800,
              color: C.accent,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(198, 133, 27, 0.12)",
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            {t("tutorial_mission_badge", { step: currentStepIndex + 1, total: totalSteps })}
          </span>
        </div>

        <button
          type="button"
          onClick={skipTutorial}
          title={t("tutorial_btn_skip")}
          style={{
            background: "transparent",
            border: "none",
            color: C.muted,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 6,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = C.dark;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = C.muted;
          }}
        >
          {t("tutorial_btn_skip")} ✕
        </button>
      </div>

      {/* Title & Subtitle */}
      <h3
        style={{
          fontFamily: FONT.display,
          fontSize: 20,
          fontWeight: 800,
          color: C.dark,
          lineHeight: 1.3,
          marginBottom: 4,
        }}
      >
        {t(step.titleKey)}
      </h3>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: C.accentHov,
          marginBottom: 16,
        }}
      >
        {t(step.subtitleKey)}
      </p>

      {/* 3 Core Explanation Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {/* What it does */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: C.dark,
              marginBottom: 3,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>💡</span> {t("tutorial_what_it_does")}
          </div>
          <p style={{ fontSize: 13, color: C.dark, lineHeight: 1.45, margin: 0 }}>
            {t(step.whatKey)}
          </p>
        </div>

        {/* How to use */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: C.accentHov,
              marginBottom: 3,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>🎮</span> {t("tutorial_how_to_use")}
          </div>
          <p style={{ fontSize: 13, color: C.dark, lineHeight: 1.45, margin: 0 }}>
            {t(step.howKey)}
          </p>
        </div>

        {/* Why it's useful */}
        <div
          style={{
            background: "rgba(27, 61, 41, 0.05)",
            border: "1px solid rgba(27, 61, 41, 0.12)",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: C.good,
              marginBottom: 3,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>⭐</span> {t("tutorial_why_useful")}
          </div>
          <p style={{ fontSize: 13, color: C.dark, lineHeight: 1.45, margin: 0 }}>
            {t(step.whyKey)}
          </p>
        </div>
      </div>

      {/* XP Level Progress Bar */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>
            {t("tutorial_progress_label")}
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: C.accent }}>
            {Math.round(progressPercent)}% XP
          </span>
        </div>
        <div
          style={{
            height: 6,
            background: "rgba(27, 61, 41, 0.12)",
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${C.accent}, #E6A23C)`,
              borderRadius: 3,
              transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </div>

        {/* Interactive Step Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 10,
          }}
        >
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isDotActive = idx === currentStepIndex;
            const isDotPast = idx < currentStepIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goToStep(idx)}
                title={`Go to Step ${idx + 1}`}
                style={{
                  width: isDotActive ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: isDotActive
                    ? C.accent
                    : isDotPast
                    ? C.dark
                    : "rgba(27, 61, 41, 0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.2s ease",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={prevStep}
          disabled={isFirst}
          style={{
            fontFamily: FONT.body,
            fontSize: 13.5,
            fontWeight: 700,
            color: isFirst ? "rgba(90, 107, 94, 0.4)" : C.dark,
            background: isFirst ? "transparent" : "rgba(255, 255, 255, 0.8)",
            border: `1.5px solid ${isFirst ? "transparent" : C.border}`,
            borderRadius: 12,
            padding: "10px 18px",
            cursor: isFirst ? "default" : "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {t("tutorial_btn_back")}
        </button>

        <button
          type="button"
          onClick={nextStep}
          style={{
            fontFamily: FONT.body,
            fontSize: 14,
            fontWeight: 800,
            color: "#FFFFFF",
            background: isLast ? C.good : C.accent,
            border: "none",
            borderRadius: 12,
            padding: "11px 24px",
            cursor: "pointer",
            boxShadow: isLast
              ? "0 4px 14px rgba(27, 107, 64, 0.4)"
              : "0 4px 14px rgba(198, 133, 27, 0.4)",
            transition: "all 0.18s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          {isLast ? t("tutorial_btn_finish") : t("tutorial_btn_next")}
        </button>
      </div>

      {/* Keyboard Hint */}
      <div
        style={{
          fontSize: 10.5,
          color: C.muted,
          textAlign: "center",
          marginTop: 12,
          fontWeight: 500,
        }}
      >
        {t("tutorial_keyboard_hint")}
      </div>
    </div>
  );
}
