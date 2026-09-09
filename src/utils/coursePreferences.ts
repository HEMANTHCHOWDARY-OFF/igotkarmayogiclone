import { supabase } from "@/lib/supabase";

const SESSION_ONBOARDING_KEY_PREFIX = "gyanmarg_onboarding_completed_";
const LOCAL_PREFERENCES_KEY_PREFIX = "gyanmarg_course_prefs_";
const LOCAL_CALIBRATION_KEY_PREFIX = "gyanmarg_learner_calibration_";

export interface LearnerCalibrationData {
  courseIds: (string | number)[];
  domains: string[];
  subDomains: string[];
  aiAnalysis?: any;
  updatedAt?: string;
}

/**
 * Check if the student has completed the interested courses selection
 * for the current demo/browser session.
 */
export function isSessionOnboardingCompleted(userId?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = userId ? `${SESSION_ONBOARDING_KEY_PREFIX}${userId}` : `${SESSION_ONBOARDING_KEY_PREFIX}guest`;
    return sessionStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

/**
 * Mark the current demo/browser session as having completed course selection.
 */
export function setSessionOnboardingCompleted(userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = userId ? `${SESSION_ONBOARDING_KEY_PREFIX}${userId}` : `${SESSION_ONBOARDING_KEY_PREFIX}guest`;
    sessionStorage.setItem(key, "true");
  } catch (err) {
    console.warn("Failed to set session onboarding state:", err);
  }
}

/**
 * Clear the demo session onboarding state (e.g. on logout) so that
 * the next session will display the Interested Courses screen again.
 */
export function clearSessionOnboarding(userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    if (userId) {
      sessionStorage.removeItem(`${SESSION_ONBOARDING_KEY_PREFIX}${userId}`);
    }
    sessionStorage.removeItem(`${SESSION_ONBOARDING_KEY_PREFIX}guest`);
    Object.keys(sessionStorage).forEach((k) => {
      if (k.startsWith(SESSION_ONBOARDING_KEY_PREFIX)) {
        sessionStorage.removeItem(k);
      }
    });
  } catch (err) {
    console.warn("Failed to clear session onboarding state:", err);
  }
}

/**
 * Retrieve persistently saved course preferences for a student.
 */
export function getSavedCoursePreferences(userId?: string, metadataCourses?: (string | number)[]): (string | number)[] {
  if (metadataCourses && Array.isArray(metadataCourses) && metadataCourses.length > 0) {
    return metadataCourses;
  }

  const isDemo = !userId || userId.startsWith("demo-") || userId.startsWith("google-");
  if (typeof window === "undefined" || !userId) return isDemo ? DEFAULT_DEMO_COURSE_IDS : [];

  try {
    const stored = localStorage.getItem(`${LOCAL_PREFERENCES_KEY_PREFIX}${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Error reading stored course preferences:", err);
  }

  return isDemo ? DEFAULT_DEMO_COURSE_IDS : [];
}

export const DEFAULT_DEMO_COURSE_IDS: string[] = [
  "do_11436630529769472011719", // Bhashini and Digital India: Bridging Languages in Citizen Services
  "do_114017409019920384165", // General Financial Rules
  "do_1143484463299624961375", // Digital Transformation: Public Financial Management System
  "do_1140894369871216641130", // BNSS And CRPC
  "do_1142075775888261121504", // Anger Management and Effective Public Interaction
];

export const DEFAULT_DEMO_DOMAINS: string[] = [
  "Technology",
  "Public Procurement (GFR)",
  "Financial Management",
  "Governance",
  "Collaborative Leadership",
];

export const DEFAULT_DEMO_SUBDOMAINS: string[] = [
  "Electronics and Information Technology",
  "Procurement Mgmt. through GeM",
  "PFMS Portal Management",
  "Justice",
  "Conflict Management",
];

/**
 * Retrieve full calibration (domains, sub-domains, courses, AI analysis)
 */
export function getSavedLearnerCalibration(userId?: string): LearnerCalibrationData {
  const isDemo = !userId || userId.startsWith("demo-") || userId.startsWith("google-");
  const fallback: LearnerCalibrationData = {
    courseIds: isDemo ? DEFAULT_DEMO_COURSE_IDS : [],
    domains: isDemo ? DEFAULT_DEMO_DOMAINS : [],
    subDomains: isDemo ? DEFAULT_DEMO_SUBDOMAINS : [],
  };

  if (typeof window === "undefined" || !userId) return fallback;

  try {
    const stored = localStorage.getItem(`${LOCAL_CALIBRATION_KEY_PREFIX}${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        courseIds: (parsed.courseIds && parsed.courseIds.length > 0) ? parsed.courseIds : (isDemo ? DEFAULT_DEMO_COURSE_IDS : []),
        domains: (parsed.domains && parsed.domains.length > 0) ? parsed.domains : (isDemo ? DEFAULT_DEMO_DOMAINS : []),
        subDomains: (parsed.subDomains && parsed.subDomains.length > 0) ? parsed.subDomains : (isDemo ? DEFAULT_DEMO_SUBDOMAINS : []),
        aiAnalysis: parsed.aiAnalysis,
        updatedAt: parsed.updatedAt,
      };
    }
  } catch (err) {
    console.warn("Error reading learner calibration:", err);
  }

  return fallback;
}

/**
 * Persist full learner calibration (domains, sub-domains, selected courses, AI recommendations)
 * both to Supabase auth user_metadata and local persistent storage.
 */
export async function saveLearnerCalibration(
  userId: string,
  data: LearnerCalibrationData,
  isDemoUser: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: LearnerCalibrationData = {
      courseIds: Array.from(new Set(data.courseIds || [])),
      domains: Array.from(new Set(data.domains || [])),
      subDomains: Array.from(new Set(data.subDomains || [])),
      aiAnalysis: data.aiAnalysis,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(`${LOCAL_CALIBRATION_KEY_PREFIX}${userId}`, JSON.stringify(payload));
      localStorage.setItem(`${LOCAL_PREFERENCES_KEY_PREFIX}${userId}`, JSON.stringify(payload.courseIds));
    }

    if (!isDemoUser) {
      const { error } = await supabase.auth.updateUser({
        data: {
          interested_courses: payload.courseIds,
          interested_domains: payload.domains,
          interested_subdomains: payload.subDomains,
          ai_recommendations: payload.aiAnalysis,
          updated_at: payload.updatedAt,
        },
      });

      if (error) {
        console.warn("Could not sync calibration to Supabase user_metadata:", error.message);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to save learner calibration:", err);
    return { success: false, error: err?.message || "Failed to persist preferences" };
  }
}

/**
 * Backward-compatible helper for saving course preferences
 */
export async function saveCoursePreferences(
  userId: string,
  courseIds: (string | number)[],
  isDemoUser: boolean = false
): Promise<{ success: boolean; error?: string }> {
  const existing = getSavedLearnerCalibration(userId);
  return saveLearnerCalibration(
    userId,
    {
      ...existing,
      courseIds,
    },
    isDemoUser
  );
}
