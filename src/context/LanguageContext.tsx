import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top bar & Header
    "gov_india": "GOVERNMENT OF INDIA",
    "gov_india_sub": "Ministry of Statistics & Programme Implementation (MoSPI)",
    "igot_ecosystem": "iGOT Karmayogi Ecosystem",
    "language": "Language",
    "lang_en": "English",
    "lang_hi": "हिन्दी",
    "select_language": "Select Language",
    
    // Navbar & Common
    "brand_name": "GyanMarg",
    "brand_ai": "AI",
    "sign_in": "Sign In",
    "get_started": "Get Started →",
    "explore": "Explore Platform",
    "log_out": "Log out",
    "ask_ai_mentor": "🤖 Ask AI Mentor",
    
    // Hero Section
    "hero_badge": "AI-Powered Competency Intelligence Platform",
    "hero_kicker": "✦ Continuous Diagnostic & Adaptive Learning for Every Learner",
    "hero_h1_1": "Diagnose Skill Gaps.",
    "hero_h1_2": "Master Core Competencies.",
    "hero_h1_3": "For Every Learner.",
    "hero_desc": "India's next-generation AI-powered learning intelligence platform built for all learners — students, scholars, job aspirants, and working professionals. Assess competencies, identify exact skill gaps with FrAC benchmarks, generate verified AI quizzes with source citations, and advance through personalized iGOT-mapped learning pathways.",
    "hero_pill_frac": "FrAC Framework",
    "hero_pill_quizzes": "Source-Cited Quizzes",
    "hero_pill_roadmaps": "Adaptive Roadmaps",
    "hero_pill_matrix": "Skill Gap Matrix",
    "cta_assessment": "Start Free Assessment →",
    "cta_explore": "Explore Project Overview ↓",
    "student_portal_btn": "Student Portal",
    "admin_portal_btn": "Admin Portal",
    "trust_strip": "ALIGNED WITH MOSPI DIID, NSSTA & IGOT KARMAYOGI LEARNING ECOSYSTEM",
    
    // Stats
    "stat_learners": "Active Learners & Students",
    "stat_courses": "Courses Mapped to Standards",
    "stat_rate": "Completion & Success Rate",
    "stat_assessments": "Diagnostic AI Assessments",
    "stat_depts": "Academic & Skill Tracks",
    
    // Steps
    "how_it_works": "How It Works",
    "how_it_works_sub": "Four intelligent stages turning raw learning materials into verified mastery — designed for every student and educator.",
    "step_1_title": "Take Assessment",
    "step_1_desc": "Complete an AI-driven competency diagnostic tailored to your field of study, role, or career specialization.",
    "step_2_title": "AI Gap Analysis",
    "step_2_desc": "Our AI quantifies your multi-axis skill gaps by benchmarking your baseline against FrAC competency standards.",
    "step_3_title": "Get Learning Path",
    "step_3_desc": "Receive a curated, sequenced learning path linking iGOT Karmayogi, NSSTA, and foundational industry courses.",
    "step_4_title": "Learn, Practice & Master",
    "step_4_desc": "Study modules, practice with AI-generated quizzes featuring exact page citations, and watch your skill score surge.",
    
    // Features
    "features_heading": "Intelligent Learning Architecture for All",
    "features_sub": "Combining FrAC competency alignment, semantic vector search, multimodal RAG quiz generation, and closed-loop skill health tracking.",
  },
  hi: {
    // Top bar & Header
    "gov_india": "भारत सरकार",
    "gov_india_sub": "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)",
    "igot_ecosystem": "आईगॉट कर्मयोगी इकोसिस्टम",
    "language": "भाषा",
    "lang_en": "English",
    "lang_hi": "हिन्दी",
    "select_language": "भाषा चुनें",
    
    // Navbar & Common
    "brand_name": "ज्ञानमार्ग",
    "brand_ai": "AI",
    "sign_in": "साइन इन",
    "get_started": "शुरू करें →",
    "explore": "मंच देखें",
    "log_out": "लॉग आउट",
    "ask_ai_mentor": "🤖 AI सलाहकार से पूछें",
    
    // Hero Section
    "hero_badge": "AI-संचालित योग्यता खुफिया मंच",
    "hero_kicker": "✦ सभी शिक्षार्थियों के लिए निरंतर नैदानिक व अनुकूली शिक्षण",
    "hero_h1_1": "कौशल अंतर पहचानें।",
    "hero_h1_2": "दक्षता में महारत पाएं।",
    "hero_h1_3": "हर शिक्षार्थी के लिए।",
    "hero_desc": "सभी शिक्षार्थियों — छात्रों, शोधकर्ताओं, नौकरी के आकांक्षियों और पेशेवरों के लिए निर्मित भारत का अत्याधुनिक AI शिक्षण मंच। अपनी दक्षताओं का मूल्यांकन करें, FrAC मानकों के साथ कौशल अंतर मापें, और व्यक्तिगत शिक्षण पथों के साथ आगे बढ़ें।",
    "hero_pill_frac": "FrAC ढांचा",
    "hero_pill_quizzes": "स्रोत-प्रमाणित क्विज़",
    "hero_pill_roadmaps": "अनुकूली शिक्षण पथ",
    "hero_pill_matrix": "कौशल अंतर मैट्रिक्स",
    "cta_assessment": "निःशुल्क मूल्यांकन शुरू करें →",
    "cta_explore": "परियोजना विवरण देखें ↓",
    "student_portal_btn": "छात्र पोर्टल",
    "admin_portal_btn": "प्रशासक पोर्टल",
    "trust_strip": "MoSPI DIID, NSSTA और iGOT कर्मयोगी शिक्षण इकोसिस्टम से संरेखित",
    
    // Stats
    "stat_learners": "सक्रिय शिक्षार्थी व छात्र",
    "stat_courses": "मानकों से मैप किए गए पाठ्यक्रम",
    "stat_rate": "सफलता व समापन दर",
    "stat_assessments": "AI नैदानिक मूल्यांकन",
    "stat_depts": "अकादमिक व कौशल ट्रैक",
    
    // Steps
    "how_it_works": "यह कैसे काम करता है",
    "how_it_works_sub": "अध्ययन सामग्री को प्रमाणित महारत में बदलने के चार बुद्धिमान चरण — छात्रों और शिक्षकों के लिए।",
    "step_1_title": "मूल्यांकन करें",
    "step_1_desc": "अपने अध्ययन क्षेत्र या करियर विशेषज्ञता के अनुरूप AI-संचालित योग्यता निदान पूरा करें।",
    "step_2_title": "AI अंतर विश्लेषण",
    "step_2_desc": "हमारा AI FrAC भूमिका मानकों के विरुद्ध आपकी दक्षताओं का विश्लेषण करके कौशल अंतर की गणना करता है।",
    "step_3_title": "सीखने का मार्ग प्राप्त करें",
    "step_3_desc": "अपनी विशिष्ट कमियों के लिए क्यूरेट किया गया iGOT और NSSTA-मैप किया गया व्यक्तिगत शिक्षण पथ प्राप्त करें।",
    "step_4_title": "सीखें, अभ्यास करें और महारत पाएं",
    "step_4_desc": "पाठ्यक्रम पूरे करें, सटीक पृष्ठ उद्धरणों वाले AI क्विज़ का अभ्यास करें, और अपने दक्षता स्कोर को बढ़ते हुए देखें।",
    
    // Features
    "features_heading": "सभी के लिए बुद्धिमान शिक्षण संरचना",
    "features_sub": "FrAC संरेखण, सिमेंटिक वेक्टर खोज, मल्टीमॉडल RAG क्विज़ निर्माण और डायनामिक कौशल ट्रैकिंग।",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (k: string) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("karmayogi_lang");
      return saved === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("karmayogi_lang", lang);
    } catch {
      // storage unavailable
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
