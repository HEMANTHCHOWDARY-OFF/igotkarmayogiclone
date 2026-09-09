export interface TutorialStepDefinition {
  id: string;
  targetSelector: string;
  badge: string;
  icon: string;
  titleKey: string;
  subtitleKey: string;
  whatKey: string;
  howKey: string;
  whyKey: string;
  preferredPosition?: "top" | "bottom" | "left" | "right" | "center";
}

export const TUTORIAL_STEPS: TutorialStepDefinition[] = [
  {
    id: "welcome",
    targetSelector: '[data-tutorial="welcome"]',
    badge: "MISSION 01",
    icon: "🎯",
    titleKey: "tut_welcome_title",
    subtitleKey: "tut_welcome_subtitle",
    whatKey: "tut_welcome_what",
    howKey: "tut_welcome_how",
    whyKey: "tut_welcome_why",
    preferredPosition: "center",
  },
  {
    id: "explore-courses",
    targetSelector: '[data-tutorial="courses"]',
    badge: "MISSION 02",
    icon: "📚",
    titleKey: "tut_courses_title",
    subtitleKey: "tut_courses_subtitle",
    whatKey: "tut_courses_what",
    howKey: "tut_courses_how",
    whyKey: "tut_courses_why",
    preferredPosition: "bottom",
  },
  {
    id: "assessment",
    targetSelector: '[data-tutorial="assessment"]',
    badge: "MISSION 03",
    icon: "📊",
    titleKey: "tut_assessment_title",
    subtitleKey: "tut_assessment_subtitle",
    whatKey: "tut_assessment_what",
    howKey: "tut_assessment_how",
    whyKey: "tut_assessment_why",
    preferredPosition: "bottom",
  },
  {
    id: "gap-analysis",
    targetSelector: '[data-tutorial="gap-analysis"]',
    badge: "MISSION 04",
    icon: "⚡",
    titleKey: "tut_gap_title",
    subtitleKey: "tut_gap_subtitle",
    whatKey: "tut_gap_what",
    howKey: "tut_gap_how",
    whyKey: "tut_gap_why",
    preferredPosition: "left",
  },
  {
    id: "mentor-support",
    targetSelector: '[data-tutorial="mentor"]',
    badge: "MISSION 05",
    icon: "🤖",
    titleKey: "tut_mentor_title",
    subtitleKey: "tut_mentor_subtitle",
    whatKey: "tut_mentor_what",
    howKey: "tut_mentor_how",
    whyKey: "tut_mentor_why",
    preferredPosition: "top",
  },
  {
    id: "get-started",
    targetSelector: '[data-tutorial="get-started"]',
    badge: "MISSION 06",
    icon: "🚀",
    titleKey: "tut_start_title",
    subtitleKey: "tut_start_subtitle",
    whatKey: "tut_start_what",
    howKey: "tut_start_how",
    whyKey: "tut_start_why",
    preferredPosition: "bottom",
  },
];
