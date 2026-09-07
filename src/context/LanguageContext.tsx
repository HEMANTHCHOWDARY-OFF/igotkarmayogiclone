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
    "gov_india": "OPEN LEARNING PLATFORM",
    "gov_india_sub": "Adaptive Skill Diagnostic & Mastery",
    "igot_ecosystem": "Competency Learning Platform",
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
    "ask_ai_mentor": "AI Study Mentor",
    
    // Hero Section
    "hero_badge": "Continuous Skill Diagnostic & Learning Platform",
    "hero_kicker": "Continuous Diagnostic & Adaptive Learning for Every Learner",
    "hero_h1_1": "Diagnose Skill Gaps.",
    "hero_h1_2": "Master Core Competencies.",
    "hero_h1_3": "For Every Learner.",
    "hero_desc": "An intelligent skill assessment and learning platform engineered for students, scholars, and lifelong learners. Conduct baseline diagnostics, quantify proficiency gaps against structured competency benchmarks, generate source-cited practice quizzes from course literature, and advance through personalized adaptive pathways.",
    "hero_pill_comp": "Competency Matrix",
    "hero_pill_quizzes": "Source-Cited Quizzes",
    "hero_pill_roadmaps": "Adaptive Roadmaps",
    "hero_pill_matrix": "Skill Gap Matrix",
    "cta_assessment": "Start Free Assessment →",
    "cta_explore": "Explore Architecture ↓",
    "student_portal_btn": "Student Portal",
    "admin_portal_btn": "Admin Portal",
    "trust_strip": "CONTINUOUS DIAGNOSTIC BASELINE, SOURCE-CITED QUIZZES & ADAPTIVE PATHWAYS",
    
    // Stats
    "stat_learners": "Active Learners & Students",
    "stat_courses": "Courses Mapped to Standards",
    "stat_rate": "Completion & Success Rate",
    "stat_assessments": "Diagnostic AI Assessments",
    "stat_depts": "Academic & Skill Tracks",
    
    // Steps
    "how_it_works": "How It Works",
    "how_it_works_sub": "A structured four-stage intelligence workflow transforming course literature and diagnostic benchmarks into verified skill mastery.",
    "step_1_title": "Take Assessment",
    "step_1_desc": "Complete an adaptive competency diagnostic evaluating baseline proficiency across domain and functional requirements.",
    "step_2_title": "AI Gap Analysis",
    "step_2_desc": "Quantifies multi-axis skill gaps by benchmarking baseline performance directly against structured competency matrices.",
    "step_3_title": "Get Learning Path",
    "step_3_desc": "Receive a curated, sequenced learning pathway mapped to accredited academic curricula, domain coursework, and industry standards.",
    "step_4_title": "Learn, Practice & Master",
    "step_4_desc": "Study modular courses, practice with AI-generated quizzes featuring exact page citations, and track dynamic skill health.",
    
    // Features
    "features_heading": "Intelligent Learning Architecture for All",
    "features_sub": "Combining structured competency alignment, semantic vector search, multimodal RAG quiz generation, and closed-loop skill health tracking.",
  },
  hi: {
    // Top bar & Header
    "gov_india": "ओपन लर्निंग प्लेटफॉर्म",
    "gov_india_sub": "कौशल निदान एवं अनुकूली शिक्षण",
    "igot_ecosystem": "दक्षता शिक्षण मंच",
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
    "ask_ai_mentor": "AI अध्ययन सलाहकार",
    
    // Hero Section
    "hero_badge": "कौशल निदान एवं अनुकूली शिक्षण मंच",
    "hero_kicker": "सभी शिक्षार्थियों के लिए निरंतर नैदानिक व अनुकूली शिक्षण",
    "hero_h1_1": "कौशल अंतर पहचानें।",
    "hero_h1_2": "दक्षता में महारत पाएं।",
    "hero_h1_3": "हर शिक्षार्थी के लिए।",
    "hero_desc": "छात्रों, शोधकर्ताओं और आजीवन शिक्षार्थियों के लिए निर्मित एक बुद्धिमान कौशल मूल्यांकन और शिक्षण मंच। अपनी दक्षताओं का निदान करें, संरचित मानकों के साथ कौशल अंतर मापें, अध्ययन सामग्री से स्रोत-प्रमाणित क्विज़ हल करें और व्यक्तिगत अनुकूली शिक्षण पथों के साथ प्रगति करें।",
    "hero_pill_comp": "कौशल मैट्रिक्स",
    "hero_pill_quizzes": "स्रोत-प्रमाणित क्विज़",
    "hero_pill_roadmaps": "अनुकूली शिक्षण पथ",
    "hero_pill_matrix": "कौशल अंतर मैट्रिक्स",
    "cta_assessment": "निःशुल्क मूल्यांकन शुरू करें →",
    "cta_explore": "प्रणाली संरचना देखें ↓",
    "student_portal_btn": "छात्र पोर्टल",
    "admin_portal_btn": "प्रशासक पोर्टल",
    "trust_strip": "नैदानिक मूल्यांकन, स्रोत-प्रमाणित क्विज़ एवं अनुकूली शिक्षण पथ",
    
    // Stats
    "stat_learners": "सक्रिय शिक्षार्थी व छात्र",
    "stat_courses": "मानकों से मैप किए गए पाठ्यक्रम",
    "stat_rate": "सफलता व समापन दर",
    "stat_assessments": "AI नैदानिक मूल्यांकन",
    "stat_depts": "अकादमिक व कौशल ट्रैक",
    
    // Steps
    "how_it_works": "यह कैसे काम करता है",
    "how_it_works_sub": "पाठ्यक्रम सामग्री और नैदानिक परीक्षणों को प्रमाणित दक्षता में बदलने के चार चरण।",
    "step_1_title": "मूल्यांकन करें",
    "step_1_desc": "अपने अध्ययन क्षेत्र या विशेषज्ञता के अनुरूप AI-संचालित योग्यता निदान पूरा करें।",
    "step_2_title": "AI अंतर विश्लेषण",
    "step_2_desc": "हमारा AI संरचित भूमिका मानकों के विरुद्ध आपकी दक्षताओं का विश्लेषण करके कौशल अंतर की सटीक गणना करता है।",
    "step_3_title": "सीखने का मार्ग प्राप्त करें",
    "step_3_desc": "अपनी विशिष्ट कमियों को दूर करने के लिए मानकीकृत शैक्षणिक पाठ्यक्रमों से मैप किया गया व्यक्तिगत शिक्षण पथ प्राप्त करें।",
    "step_4_title": "सीखें, अभ्यास करें और महारत पाएं",
    "step_4_desc": "पाठ्यक्रम पूरे करें, सटीक पृष्ठ उद्धरणों वाले AI क्विज़ का अभ्यास करें, और अपने दक्षता स्कोर को ट्रैक करें।",
    
    // Features
    "features_heading": "सभी के लिए बुद्धिमान शिक्षण संरचना",
    "features_sub": "संरचित योग्यता संरेखण, सिमेंटिक वेक्टर खोज, मल्टीमॉडल RAG क्विज़ निर्माण और डायनामिक कौशल ट्रैकिंग।",
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
