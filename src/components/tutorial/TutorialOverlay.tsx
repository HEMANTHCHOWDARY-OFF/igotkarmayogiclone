import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTutorial } from "@/context/TutorialContext";
import { useLanguage } from "@/context/LanguageContext";
import TutorialCard from "./TutorialCard";
import { C, FONT } from "@/tokens";

export default function TutorialOverlay() {
  const navigate = useNavigate();
  const {
    isActive,
    currentStep,
    isCompleted,
    nextStep,
    prevStep,
    skipTutorial,
    dismissCompletion,
    replayTutorial,
  } = useTutorial();
  const { t } = useLanguage();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Update target element bounding rect and scroll into view
  useEffect(() => {
    if (!isActive || !currentStep) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    };

    // Scroll element smoothly into center view
    const el = document.querySelector(currentStep.targetSelector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Short timeout to measure accurately after smooth scroll settles
      const timer = setTimeout(updateRect, 300);
      updateRect();

      window.addEventListener("resize", updateRect);
      window.addEventListener("scroll", updateRect, { passive: true });

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateRect);
        window.removeEventListener("scroll", updateRect);
      };
    } else {
      setTargetRect(null);
    }
  }, [isActive, currentStep]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive && !isCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isActive) skipTutorial();
        if (isCompleted) dismissCompletion();
      } else if (isActive) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nextStep();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevStep();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, isCompleted, nextStep, prevStep, skipTutorial, dismissCompletion]);

  // Return nothing if neither tutorial nor completion modal is active
  if (!isActive && !isCompleted) return null;

  const pad = 10;
  const spotlightTop = targetRect ? Math.max(0, targetRect.top - pad) : 0;
  const spotlightLeft = targetRect ? Math.max(0, targetRect.left - pad) : 0;
  const spotlightWidth = targetRect ? targetRect.width + pad * 2 : 0;
  const spotlightHeight = targetRect ? targetRect.height + pad * 2 : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        pointerEvents: "auto",
      }}
    >
      <style>{`
        @keyframes tourPulseRing {
          0% { box-shadow: 0 0 0 0 rgba(198, 133, 27, 0.7), 0 0 20px rgba(198, 133, 27, 0.4); }
          70% { box-shadow: 0 0 0 14px rgba(198, 133, 27, 0), 0 0 30px rgba(198, 133, 27, 0.6); }
          100% { box-shadow: 0 0 0 0 rgba(198, 133, 27, 0), 0 0 20px rgba(198, 133, 27, 0.4); }
        }
        @keyframes tourPopIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* SVG Mask Spotlight Overlay */}
      {isActive && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "auto",
          }}
          onClick={skipTutorial}
        >
          <defs>
            <mask id="spotlight-mask">
              {/* White fills everything (masked opaque) */}
              <rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
              {/* Black cutout reveals the target element */}
              {targetRect && (
                <rect
                  x={spotlightLeft}
                  y={spotlightTop}
                  width={spotlightWidth}
                  height={spotlightHeight}
                  rx="14"
                  ry="14"
                  fill="#000000"
                />
              )}
            </mask>
          </defs>
          {/* Dark backdrop using mask */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(14, 24, 19, 0.78)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      )}

      {/* Pulsing Highlight Frame around target element */}
      {isActive && targetRect && (
        <div
          style={{
            position: "fixed",
            top: spotlightTop,
            left: spotlightLeft,
            width: spotlightWidth,
            height: spotlightHeight,
            borderRadius: 14,
            border: `2.5px solid ${C.accent}`,
            animation: "tourPulseRing 2s infinite ease-out",
            pointerEvents: "none",
            zIndex: 10001,
            transition: "top 0.25s ease-out, left 0.25s ease-out, width 0.25s ease-out, height 0.25s ease-out",
          }}
        />
      )}

      {/* Active Step Tutorial Card */}
      {isActive && currentStep && (
        <TutorialCard step={currentStep} targetRect={targetRect} />
      )}

      {/* Celebratory Completion Modal */}
      {isCompleted && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(14, 24, 19, 0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 10010,
          }}
        >
          <div
            style={{
              background: "#FAF7F0",
              border: `2.5px solid ${C.accent}`,
              borderRadius: 24,
              boxShadow: "0 28px 70px -15px rgba(0, 0, 0, 0.5)",
              padding: "36px 32px 30px",
              width: "min(500px, 92vw)",
              textAlign: "center",
              fontFamily: FONT.body,
              color: C.dark,
              animation: "tourPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Trophy Icon */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(198, 133, 27, 0.16)",
                border: `2px solid ${C.accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                margin: "0 auto 18px",
                boxShadow: "0 8px 24px rgba(198, 133, 27, 0.3)",
              }}
            >
              🏆
            </div>

            <span
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontSize: 11,
                fontWeight: 800,
                color: C.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "rgba(198, 133, 27, 0.12)",
                padding: "4px 12px",
                borderRadius: 20,
                display: "inline-block",
                marginBottom: 10,
              }}
            >
              MISSION ACCOMPLISHED
            </span>

            <h2
              style={{
                fontFamily: FONT.display,
                fontSize: 26,
                fontWeight: 800,
                color: C.dark,
                marginBottom: 6,
              }}
            >
              {t("tut_complete_title")}
            </h2>

            <p
              style={{
                fontSize: 14.5,
                fontWeight: 600,
                color: C.accentHov,
                marginBottom: 14,
              }}
            >
              {t("tut_complete_subtitle")}
            </p>

            <p
              style={{
                fontSize: 14,
                color: C.muted,
                lineHeight: 1.6,
                marginBottom: 26,
                maxWidth: 420,
                margin: "0 auto 26px",
              }}
            >
              {t("tut_complete_desc")}
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  dismissCompletion();
                  navigate("/student/dashboard");
                }}
                style={{
                  fontFamily: FONT.body,
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  background: C.accent,
                  border: "none",
                  borderRadius: 14,
                  padding: "14px 28px",
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(198, 133, 27, 0.4)",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = C.accentHov;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = C.accent;
                }}
              >
                {t("tut_complete_action")}
              </button>

              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    dismissCompletion();
                    replayTutorial();
                  }}
                  style={{
                    background: "transparent",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontFamily: FONT.body,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.dark,
                    cursor: "pointer",
                  }}
                >
                  {t("replay_tutorial")}
                </button>

                <button
                  type="button"
                  onClick={dismissCompletion}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontFamily: FONT.body,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.muted,
                    cursor: "pointer",
                  }}
                >
                  {t("tut_complete_secondary")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
