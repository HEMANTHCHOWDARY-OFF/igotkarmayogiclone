import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  getSavedCoursePreferences,
  getSavedLearnerCalibration,
  saveLearnerCalibration,
  saveCoursePreferences,
  clearSessionOnboarding,
  DEFAULT_DEMO_COURSE_IDS,
  DEFAULT_DEMO_DOMAINS,
  DEFAULT_DEMO_SUBDOMAINS,
  type LearnerCalibrationData,
} from "@/utils/coursePreferences";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "student" | "admin";
  track?: string;
  institution?: string;
  year?: string;
  avatarUrl?: string;
  initials: string;
  interestedCourses?: (string | number)[];
  interestedDomains?: string[];
  interestedSubDomains?: string[];
  aiRecommendations?: any;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  role?: "student" | "admin";
  track?: string;
  institution?: string;
  year?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (params: SignUpParams) => Promise<{ error: AuthError | null; needsEmailConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  loginWithGoogle: (email: string, name?: string) => void;
  signOut: () => Promise<void>;
  loginAsDemo: (role: "student" | "admin") => void;
  updateProfileLocally: (updates: Partial<UserProfile>) => void;
  savePreferences: (courseIds: (string | number)[]) => Promise<{ success: boolean; error?: string }>;
  saveCalibration: (data: LearnerCalibrationData) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = "gyanmarg_demo_session";

function getInitials(name: string, fallbackEmail = ""): string {
  const clean = name.trim();
  if (!clean) {
    return (fallbackEmail.slice(0, 2) || "GM").toUpperCase();
  }
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function deriveProfile(user: User | null, demoProfile: UserProfile | null): UserProfile | null {
  if (demoProfile) {
    const calib = getSavedLearnerCalibration(demoProfile.id);
    return {
      ...demoProfile,
      interestedCourses: calib.courseIds.length > 0 ? calib.courseIds : demoProfile.interestedCourses || [],
      interestedDomains: calib.domains.length > 0 ? calib.domains : demoProfile.interestedDomains || [],
      interestedSubDomains: calib.subDomains.length > 0 ? calib.subDomains : demoProfile.interestedSubDomains || [],
      aiRecommendations: calib.aiAnalysis || demoProfile.aiRecommendations,
    };
  }
  if (!user) return null;

  const meta = user.user_metadata || {};
  const email = user.email || "";
  const fullName =
    meta.full_name ||
    meta.name ||
    (email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Learner");
  
  const role: "student" | "admin" =
    meta.role === "admin" || email.toLowerCase().includes("admin") ? "admin" : "student";

  const calib = getSavedLearnerCalibration(user.id);
  const courses = calib.courseIds.length > 0 ? calib.courseIds : (meta.interested_courses || []);
  const domains = calib.domains.length > 0 ? calib.domains : (meta.interested_domains || []);
  const subDomains = calib.subDomains.length > 0 ? calib.subDomains : (meta.interested_subdomains || []);
  const aiRecommendations = calib.aiAnalysis || meta.ai_recommendations;

  return {
    id: user.id,
    email,
    fullName,
    role,
    track: meta.track || (role === "admin" ? "Institutional Administration" : "Higher Education / University Student"),
    institution: meta.institution || (role === "admin" ? "Department of Personnel & Training" : "University / Academic College"),
    year: meta.year || "",
    avatarUrl: meta.avatar_url || meta.picture || "",
    initials: getInitials(fullName, email),
    interestedCourses: courses,
    interestedDomains: domains,
    interestedSubDomains: subDomains,
    aiRecommendations,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [demoProfile, setDemoProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. Initial session check from Supabase
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (mounted) {
        if (!error && initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          // Real Supabase session takes precedence over demo
          localStorage.removeItem(DEMO_STORAGE_KEY);
          setDemoProfile(null);
        }
        setLoading(false);
      }
    }).catch(err => {
      console.warn("Error getting initial session:", err);
      if (mounted) setLoading(false);
    });

    // 2. Real-time auth listener for sign-in, sign-out, token refresh, OAuth redirects
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession) {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        setDemoProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setDemoProfile(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      return { error };
    }

    setSession(data.session);
    setUser(data.user);
    setLoading(false);
    return { error: null };
  };

  const signUp = async ({ email, password, fullName, role = "student", track, institution, year }: SignUpParams) => {
    setLoading(true);
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setDemoProfile(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          track: track || "",
          institution: institution || "",
          year: year || "",
        },
      },
    });

    if (error) {
      setLoading(false);
      return { error };
    }

    const needsEmailConfirmation = !data.session;
    if (data.session) {
      setSession(data.session);
      setUser(data.user);
    }
    setLoading(false);
    return { error: null, needsEmailConfirmation };
  };

  const signInWithGoogle = async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setDemoProfile(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/student/dashboard`,
      },
    });
    return { error };
  };

  const loginWithGoogle = (email: string, name?: string) => {
    const cleanEmail = email.trim();
    const cleanName =
      name?.trim() ||
      cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    const googleProfile: UserProfile = {
      id: `google-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanName,
      role: "student",
      track: "Higher Education / University Student",
      institution: "Google Verified Learner",
      year: "2026",
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=4285F4`,
      initials: getInitials(cleanName, cleanEmail),
    };

    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(googleProfile));
    setDemoProfile(googleProfile);
    setUser(null);
    setSession(null);
  };

  const signOut = async () => {
    setLoading(true);
    clearSessionOnboarding(user?.id || demoProfile?.id);
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setDemoProfile(null);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase sign out error:", err);
    } finally {
      setUser(null);
      setSession(null);
      setLoading(false);
    }
  };

  const loginAsDemo = (role: "student" | "admin") => {
    const demo: UserProfile = role === "student" ? {
      id: "demo-student-001",
      email: "priya.sharma@example.gov.in",
      fullName: "Priya Sharma",
      role: "student",
      track: "Higher Education / University Student",
      institution: "Indian Institute of Public Administration",
      year: "2024",
      avatarUrl: "",
      initials: "PS",
      interestedCourses: DEFAULT_DEMO_COURSE_IDS,
      interestedDomains: DEFAULT_DEMO_DOMAINS,
      interestedSubDomains: DEFAULT_DEMO_SUBDOMAINS,
    } : {
      id: "demo-admin-001",
      email: "anand.kumar@gov.in",
      fullName: "Dr. Anand Kumar",
      role: "admin",
      track: "Institutional Administration",
      institution: "Training Director · DOPT",
      year: "",
      avatarUrl: "",
      initials: "DA",
    };

    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demo));
    setDemoProfile(demo);
    setUser(null);
    setSession(null);
  };

  const updateProfileLocally = (updates: Partial<UserProfile>) => {
    setDemoProfile(prev => {
      const updated = prev ? { ...prev, ...updates } : null;
      if (updated) {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const savePreferences = async (courseIds: (string | number)[]) => {
    const activeId = user?.id || demoProfile?.id;
    if (!activeId) return { success: false, error: "No active user session found" };
    const res = await saveCoursePreferences(activeId, courseIds, isDemo);
    if (res.success) {
      if (isDemo || demoProfile) {
        updateProfileLocally({ interestedCourses: courseIds });
      }
    }
    return res;
  };

  const saveCalibration = async (data: LearnerCalibrationData) => {
    const activeId = user?.id || demoProfile?.id;
    if (!activeId) return { success: false, error: "No active user session found" };
    const res = await saveLearnerCalibration(activeId, data, isDemo);
    if (res.success) {
      if (isDemo || demoProfile) {
        updateProfileLocally({
          interestedCourses: data.courseIds,
          interestedDomains: data.domains,
          interestedSubDomains: data.subDomains,
          aiRecommendations: data.aiAnalysis,
        });
      }
    }
    return res;
  };

  const profile = useMemo(() => deriveProfile(user, demoProfile), [user, demoProfile]);
  const isDemo = Boolean(demoProfile && !user);
  const isAuthenticated = Boolean(user || demoProfile);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      isAuthenticated,
      isDemo,
      signIn,
      signUp,
      signInWithGoogle,
      loginWithGoogle,
      signOut,
      loginAsDemo,
      updateProfileLocally,
      savePreferences,
      saveCalibration,
    }),
    [user, session, profile, loading, isAuthenticated, isDemo]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
