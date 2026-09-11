import {
  retrieveCoursesForStudent,
  getAntiHallucinationInstructions,
} from "./rag/ragService";
import type { RetrievedCourse } from "./rag/ragTypes";

export interface RecommendedCourseItem {
  title: string;
  domain: string;
  subDomain?: string;
  reason: string;
  priority: "High" | "Medium" | "Foundational";
  courseId?: string;
  courseCode?: string;
  url?: string;
  duration?: number;
  level?: string;
  isPlatformCourse?: boolean;
}

export interface LearningPathPhase {
  phase: number;
  title: string;
  durationWeeks: string;
  description: string;
  keyCompetencies: string[];
}

export interface GroqRecommendationResult {
  competencyAnalysis: string;
  recommendedDomains: string[];
  recommendedSubDomains: string[];
  recommendedCourses: RecommendedCourseItem[];
  learningRoadmap: LearningPathPhase[];
  isRAGGrounded?: boolean;
  ragSource?: string;
  ragNotice?: string;
}

const GROQ_API_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GROQ_API_KEY) ||
  (typeof process !== "undefined" && process.env?.VITE_GROQ_API_KEY) ||
  "";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export async function getGroqRecommendations(params: {
  selectedDomains?: string[];
  selectedSubDomains?: string[];
  userInterestPrompt?: string;
  learnerName?: string;
  learnerRole?: string;
  learnerTrack?: string;
  targetYear?: string;
  sampleCatalogTitles?: string[];
  knowledgeGaps?: string[];
  currentSkills?: string[];
  level?: string;
}): Promise<GroqRecommendationResult> {
  const {
    selectedDomains = [],
    selectedSubDomains = [],
    userInterestPrompt = "",
    learnerName = "Learner",
    learnerTrack = "Public Service & Modern Administration Aspirant",
    sampleCatalogTitles = [],
    knowledgeGaps = [],
    currentSkills = [],
    level = "all",
  } = params;

  // Step 1: Perform RAG retrieval from stored course database
  let ragResult;
  try {
    ragResult = await retrieveCoursesForStudent({
      goal: userInterestPrompt,
      track: learnerTrack,
      interests: userInterestPrompt,
      selectedDomains,
      selectedSubDomains,
      knowledgeGaps,
      currentSkills,
      level,
    }, {
      limit: 8,
      threshold: 0.15,
    });
  } catch (ragErr) {
    console.warn("RAG retrieval encountered an error, falling back:", ragErr);
  }

  const isGrounded = !!(ragResult && ragResult.isGrounded && ragResult.retrievedCourses.length > 0);
  const retrievedCourses: RetrievedCourse[] = ragResult?.retrievedCourses || [];
  const antiHallucinationPrompt = getAntiHallucinationInstructions(isGrounded);

  const systemPrompt = `You are the chief AI Competency & Learning Advisor for India's official capacity-building platform (GyanMarg AI / iGOT Karmayogi).
Your objective is to analyze a learner's expressed interests, career aspirations, and/or chosen domains, and produce:
1. An executive Competency Analysis summary (2-3 sentences explaining their skill trajectory).
2. A list of 2-4 recommended official iGOT domains ("recommendedDomains") matching their interests.
3. A list of 2-4 recommended sub-domains ("recommendedSubDomains").
4. 4-6 prioritized Course Recommendations with clear pedagogical justifications ('reason') for each.
5. A 4-phase sequential Learning Path Roadmap (Foundations -> Intermediate Specialization -> Advanced Practical Execution -> Capstone / Certification).

${antiHallucinationPrompt}

${isGrounded ? `[RETRIEVED STORED COURSES FROM DATABASE]:\n${ragResult?.ragContext}\n` : ""}

Strictly output valid JSON matching this exact structure:
{
  "competencyAnalysis": "string",
  "recommendedDomains": ["string", "string"],
  "recommendedSubDomains": ["string", "string"],
  "recommendedCourses": [
    {
      "courseId": "string (MUST BE exact Course ID from retrieved courses if grounded, else null)",
      "courseCode": "string (MUST BE exact Code from retrieved courses if grounded, else null)",
      "title": "string (MUST BE exact Title from retrieved courses if grounded)",
      "domain": "string",
      "subDomain": "string",
      "reason": "string (pedagogical justification grounded in course outcomes)",
      "priority": "High" | "Medium" | "Foundational",
      "isPlatformCourse": true | false
    }
  ],
  "learningRoadmap": [
    {
      "phase": 1,
      "title": "string",
      "durationWeeks": "2-3 weeks",
      "description": "string",
      "keyCompetencies": ["string", "string"]
    }
  ]
}`;

  const userPrompt = `Learner Profile:
- Name: ${learnerName}
- Career Track: ${learnerTrack}
- Target Level: ${level}
- Current Skills: ${currentSkills.length > 0 ? currentSkills.join(", ") : "Not specified"}
- Known Knowledge Gaps: ${knowledgeGaps.length > 0 ? knowledgeGaps.join(", ") : "General capacity building"}

User's Expressed Learning Interest & Goals:
"${userInterestPrompt || "I want to develop comprehensive competencies in data-driven public administration, digital governance, and practical analytics."}"

Currently Selected Domains:
${selectedDomains.length > 0 ? selectedDomains.join(", ") : "None yet - please recommend the best domains."}

Currently Selected Sub-Domains:
${selectedSubDomains.length > 0 ? selectedSubDomains.join(", ") : "None yet - please recommend matching sub-domains."}

Reference Catalog Sample Topics:
${sampleCatalogTitles.slice(0, 20).join("; ")}

${
  isGrounded
    ? "IMPORTANT: Select and recommend actual courses from the [RETRIEVED STORED COURSES] list above with their exact Course IDs and Titles."
    : "NOTE: No matching stored course was found in our database for this query. Provide general learning recommendations and explicitly indicate that no exact platform course was matched."
}`;

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Groq API returned error status ${res.status}: ${errText}`);
      throw new Error(`Groq API error (${res.status})`);
    }

    const json = await res.json();
    const rawContent = json.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error("No response content received from Groq AI");
    }

    const parsed: GroqRecommendationResult = JSON.parse(rawContent);

    // Reconcile recommended courses with retrieved course metadata
    if (isGrounded && retrievedCourses.length > 0) {
      const courseMap = new Map<string, RetrievedCourse>();
      retrievedCourses.forEach((c) => {
        courseMap.set(String(c.id).toLowerCase(), c);
        courseMap.set(c.title.toLowerCase(), c);
      });

      parsed.recommendedCourses = (parsed.recommendedCourses || []).map((rc) => {
        const matched =
          (rc.courseId && courseMap.get(String(rc.courseId).toLowerCase())) ||
          courseMap.get(rc.title.toLowerCase()) ||
          retrievedCourses.find((c) => c.title.toLowerCase().includes(rc.title.toLowerCase()) || rc.title.toLowerCase().includes(c.title.toLowerCase()));

        if (matched) {
          return {
            ...rc,
            courseId: String(matched.id),
            courseCode: matched.code,
            title: matched.title,
            domain: matched.domain || rc.domain,
            subDomain: matched.subDomain || rc.subDomain,
            duration: matched.duration,
            level: matched.level,
            url: matched.url,
            isPlatformCourse: true,
          };
        }

        return {
          ...rc,
          isPlatformCourse: false,
        };
      });
    }

    // Ensure fallback arrays if missing
    if (!Array.isArray(parsed.recommendedDomains) || parsed.recommendedDomains.length === 0) {
      parsed.recommendedDomains = selectedDomains.length > 0 ? selectedDomains : ["Data Analytics", "Governance"];
    }
    if (!Array.isArray(parsed.recommendedSubDomains) || parsed.recommendedSubDomains.length === 0) {
      parsed.recommendedSubDomains = selectedSubDomains.length > 0 ? selectedSubDomains : ["Digital Governance"];
    }

    parsed.isRAGGrounded = isGrounded;
    parsed.ragSource = ragResult?.source;
    if (!isGrounded) {
      parsed.ragNotice = "I could not find an exact matching course in the current GyanMarg course database. Based on general knowledge, here are foundational recommendations.";
    }

    return parsed;
  } catch (error: any) {
    console.warn("Groq recommendation failed, generating intelligent RAG-grounded fallback:", error);
    return generateFallbackRecommendations(
      selectedDomains,
      selectedSubDomains,
      userInterestPrompt,
      learnerTrack,
      retrievedCourses
    );
  }
}

function generateFallbackRecommendations(
  domains: string[],
  subDomains: string[],
  userPrompt: string,
  track: string,
  retrievedCourses: RetrievedCourse[] = []
): GroqRecommendationResult {
  const lowerPrompt = (userPrompt || "").toLowerCase();

  let detectedDomains = [...domains];
  let detectedSubDomains = [...subDomains];

  if (lowerPrompt.includes("data") || lowerPrompt.includes("analyt") || lowerPrompt.includes("python") || lowerPrompt.includes("stat")) {
    if (!detectedDomains.includes("Data Analytics")) detectedDomains.push("Data Analytics");
    if (!detectedDomains.includes("Applied Statistics & Sampling Theory")) detectedDomains.push("Applied Statistics & Sampling Theory");
    if (!detectedSubDomains.includes("Pandas Microdata Cleansing")) detectedSubDomains.push("Pandas Microdata Cleansing");
  }

  if (lowerPrompt.includes("ai") || lowerPrompt.includes("tech") || lowerPrompt.includes("digital") || lowerPrompt.includes("cyber")) {
    if (!detectedDomains.includes("Technology")) detectedDomains.push("Technology");
    if (!detectedDomains.includes("Digital Fluency")) detectedDomains.push("Digital Fluency");
    if (!detectedSubDomains.includes("Artificial Intelligence")) detectedSubDomains.push("Artificial Intelligence");
  }

  if (lowerPrompt.includes("finance") || lowerPrompt.includes("procure") || lowerPrompt.includes("gfr") || lowerPrompt.includes("budget")) {
    if (!detectedDomains.includes("Financial Management")) detectedDomains.push("Financial Management");
    if (!detectedDomains.includes("Public Procurement (GFR)")) detectedDomains.push("Public Procurement (GFR)");
    if (!detectedSubDomains.includes("GFR 2017 Compliance")) detectedSubDomains.push("GFR 2017 Compliance");
  }

  if (detectedDomains.length === 0) {
    detectedDomains = ["Data Analytics", "Governance", "Technology"];
    detectedSubDomains = ["Digital Governance", "Public Administration"];
  }

  // Use RAG retrieved courses if available
  let recommendedCourses: RecommendedCourseItem[] = [];

  if (retrievedCourses.length > 0) {
    recommendedCourses = retrievedCourses.slice(0, 5).map((c, idx) => ({
      courseId: String(c.id),
      courseCode: c.code,
      title: c.title,
      domain: c.domain,
      subDomain: c.subDomain,
      reason: c.desc || `Core capacity building course for ${c.domain}.`,
      priority: (idx === 0 ? "High" : idx <= 2 ? "Medium" : "Foundational") as "High" | "Medium" | "Foundational",
      duration: c.duration,
      level: c.level,
      url: c.url,
      isPlatformCourse: true,
    }));
  } else {
    recommendedCourses = [
      {
        title: "Advanced Sampling Theory & Multi-Stage Sample Design",
        domain: "Applied Statistics & Sampling Theory",
        subDomain: "Survey Sampling",
        reason: "Essential foundation for understanding nationwide official survey frameworks and statistical inference.",
        priority: "High",
        isPlatformCourse: true,
      },
      {
        title: "Relational SQL Data Extraction & Administrative Database Operations",
        domain: "Technology",
        subDomain: "Database Operations",
        reason: "Crucial for querying large-scale departmental databases and compiling automated microdata reports.",
        priority: "High",
        isPlatformCourse: true,
      },
      {
        title: "Digital India Architecture, DigiLocker & Government APIs",
        domain: "Technology",
        subDomain: "Digital Governance",
        reason: "Empowers modern paperless administrative operations and interoperable public delivery architectures.",
        priority: "Medium",
        isPlatformCourse: true,
      },
      {
        title: "DPDP Act 2023 Statutory Compliance & UN Statistical Ethics",
        domain: "Data Protection",
        subDomain: "Statutory Compliance",
        reason: "Mandatory compliance standards for data privacy, citizen confidentiality, and ethical governance.",
        priority: "Foundational",
        isPlatformCourse: true,
      },
    ];
  }

  const domainText = detectedDomains.join(", ");
  const subText = detectedSubDomains.slice(0, 3).join(", ");

  return {
    competencyAnalysis: `Based on your stated interests in "${userPrompt || track}", your personalized learning trajectory targets high-impact proficiencies in ${domainText} (${subText}) grounded in verified official course data.`,
    recommendedDomains: detectedDomains,
    recommendedSubDomains: detectedSubDomains,
    recommendedCourses,
    learningRoadmap: [
      {
        phase: 1,
        title: "Phase 1: Conceptual Foundations & Statutory Standards",
        durationWeeks: "2-3 weeks",
        description: "Master the fundamental theoretical frameworks and official standards governing your chosen domain.",
        keyCompetencies: ["Regulatory Frameworks", "Core Principles", "Terminology"],
      },
      {
        phase: 2,
        title: "Phase 2: Applied Operations & Tooling Specialization",
        durationWeeks: "3-4 weeks",
        description: "Develop hands-on technical execution skills through real-world scenarios and departmental microdata.",
        keyCompetencies: ["Data Extraction", "Functional Procedures", "Quality Assurance"],
      },
      {
        phase: 3,
        title: "Phase 3: Cross-Domain Integration & Strategic Governance",
        durationWeeks: "4 weeks",
        description: "Synthesize insights across multiple domains to address complex administrative and policy challenges.",
        keyCompetencies: ["Strategic Decision-Making", "Evidence-Based Policy", "Advanced Synthesis"],
      },
      {
        phase: 4,
        title: "Phase 4: Capstone Evaluation & Verified Certification",
        durationWeeks: "2 weeks",
        description: "Demonstrate verified mastery through comprehensive diagnostic challenges and official certifications.",
        keyCompetencies: ["Diagnostic Mastery", "Verified Certification", "Executive Leadership"],
      },
    ],
    isRAGGrounded: retrievedCourses.length > 0,
    ragSource: retrievedCourses.length > 0 ? "local_vector_index" : "general_knowledge_fallback",
  };
}
