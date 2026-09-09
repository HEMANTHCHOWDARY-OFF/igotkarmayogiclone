import React, { createContext, useContext, useState, useEffect } from "react";
import { TUTORIAL_STEPS, TutorialStepDefinition } from "@/components/tutorial/tutorialSteps";

interface TutorialContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TutorialStepDefinition | null;
  totalSteps: number;
  isCompleted: boolean;
  isSkipped: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  replayTutorial: () => void;
  dismissCompletion: () => void;
}

const TutorialContext = createContext<TutorialContextType>({
  isActive: false,
  currentStepIndex: 0,
  currentStep: null,
  totalSteps: TUTORIAL_STEPS.length,
  isCompleted: false,
  isSkipped: false,
  startTutorial: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  skipTutorial: () => {},
  completeTutorial: () => {},
  replayTutorial: () => {},
  dismissCompletion: () => {},
});

const COMPLETED_KEY = "gyanmarg_tutorial_completed";
const SKIPPED_KEY = "gyanmarg_tutorial_skipped";

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SKIPPED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const totalSteps = TUTORIAL_STEPS.length;
  const currentStep = isActive && currentStepIndex < totalSteps ? TUTORIAL_STEPS[currentStepIndex] : null;

  const startTutorial = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
      setIsActive(true);
      setIsCompleted(false);
    }
  };

  const skipTutorial = () => {
    setIsActive(false);
    setIsSkipped(true);
    try {
      localStorage.setItem(SKIPPED_KEY, "true");
    } catch {
      // storage unavailable
    }
  };

  const completeTutorial = () => {
    setIsActive(false);
    setIsCompleted(true);
    try {
      localStorage.setItem(COMPLETED_KEY, "true");
    } catch {
      // storage unavailable
    }
  };

  const replayTutorial = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsActive(true);
  };

  const dismissCompletion = () => {
    setIsCompleted(false);
  };

  // Prevent background scrolling while tutorial or completion modal is active
  useEffect(() => {
    if (isActive || isCompleted) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isActive, isCompleted]);

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        totalSteps,
        isCompleted,
        isSkipped,
        startTutorial,
        nextStep,
        prevStep,
        goToStep,
        skipTutorial,
        completeTutorial,
        replayTutorial,
        dismissCompletion,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return useContext(TutorialContext);
}
