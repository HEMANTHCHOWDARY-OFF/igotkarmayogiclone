export interface RecommendedCourseItem {
  title: string;
  domain: string;
  subDomain?: string;
  reason: string;
  priority: "High" | "Medium" | "Foundational";
  courseId?: string;
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
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
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
}): Promise<GroqRecommendationResult> {
  const {
    selectedDomains = [],
    selectedSubDomains = [],
    userInterestPrompt = "",
    learnerName = "Learner",
    learnerTrack = "Public Service & Modern Administration Aspirant",
    sampleCatalogTitles = [],
  } = params;

  const systemPrompt = `You are the chief AI Competency & Learning Advisor for India's official capacity-building platform (GyanMarg AI / iGOT Karmayogi).
Your objective is to analyze a learner's expressed interests, career aspirations, and/or chosen domains, and produce:
1. An executive Competency Analysis summary (2-3 sentences explaining their skill trajectory).
2. A list of 2-4 recommended official iGOT domains ("recommendedDomains") matching their interests.
3. A list of 2-4 recommended sub-domains ("recommendedSubDomains").
4. 4-6 prioritized Course Recommendations with clear pedagogical justifications ('reason') for each.
5. A 4-phase sequential Learning Path Roadmap (Foundations -> Intermediate Specialization -> Advanced Practical Execution -> Capstone / Certification).

Strictly output valid JSON matching this exact structure:
{
  "competencyAnalysis": "string",
  "recommendedDomains": ["string", "string"],
  "recommendedSubDomains": ["string", "string"],
  "recommendedCourses": [
    {
      "title": "string",
      "domain": "string",
      "subDomain": "string",
      "reason": "string",
      "priority": "High" | "Medium" | "Foundational"
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

User's Expressed Learning Interest & Goals:
"${userInterestPrompt || "I want to develop comprehensive competencies in data-driven public administration, digital governance, and practical analytics."}"

Currently Selected Domains:
${selectedDomains.length > 0 ? selectedDomains.join(", ") : "None yet - please recommend the best domains."}

Currently Selected Sub-Domains:
${selectedSubDomains.length > 0 ? selectedSubDomains.join(", ") : "None yet - please recommend matching sub-domains."}

Sample Reference Catalog Topics:
${sampleCatalogTitles.slice(0, 25).join("; ")}

Please recommend matching domains, sub-domains, tailored courses with pedagogical reasons, and a 4-phase sequential learning roadmap.`;

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

    // Ensure fallback arrays if missing
    if (!Array.isArray(parsed.recommendedDomains)) {
      parsed.recommendedDomains = selectedDomains.length > 0 ? selectedDomains : ["Data Analytics", "Governance"];
    }
    if (!Array.isArray(parsed.recommendedSubDomains)) {
      parsed.recommendedSubDomains = selectedSubDomains.length > 0 ? selectedSubDomains : ["Digital Governance"];
    }

    return parsed;
  } catch (error: any) {
    console.warn("Groq recommendation failed, generating intelligent domain-grounded fallback:", error);
    return generateFallbackRecommendations(
      selectedDomains,
      selectedSubDomains,
      userInterestPrompt,
      learnerTrack
    );
  }
}

function generateFallbackRecommendations(
  domains: string[],
  subDomains: string[],
  userPrompt: string,
  track: string
): GroqRecommendationResult {
  const lowerPrompt = (userPrompt || "").toLowerCase();

  // Intelligent domain detection based on user interest keywords
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

  if (lowerPrompt.includes("disaster") || lowerPrompt.includes("relief") || lowerPrompt.includes("ndrf") || lowerPrompt.includes("police")) {
    if (!detectedDomains.includes("Security and Foreign Affairs")) detectedDomains.push("Security and Foreign Affairs");
    if (!detectedSubDomains.includes("Home Affairs")) detectedSubDomains.push("Home Affairs");
  }

  if (detectedDomains.length === 0) {
    detectedDomains = ["Data Analytics", "Governance", "Technology"];
    detectedSubDomains = ["Digital Governance", "Public Administration"];
  }

  const domainText = detectedDomains.join(", ");
  const subText = detectedSubDomains.slice(0, 3).join(", ");

  return {
    competencyAnalysis: `Based on your stated interests in "${userPrompt || track}", your personalized learning trajectory targets high-impact proficiencies in ${domainText} (${subText}) to empower evidence-based administrative capability.`,
    recommendedDomains: detectedDomains,
    recommendedSubDomains: detectedSubDomains,
    recommendedCourses: [
      {
        title: "Advanced Sampling Theory & Multi-Stage Sample Design",
        domain: "Applied Statistics & Sampling Theory",
        subDomain: "Survey Sampling",
        reason: "Essential foundation for understanding nationwide official survey frameworks and statistical inference.",
        priority: "High",
      },
      {
        title: "Relational SQL Data Extraction & Administrative Database Operations",
        domain: "Technology",
        subDomain: "Database Operations",
        reason: "Crucial for querying large-scale departmental databases and compiling automated microdata reports.",
        priority: "High",
      },
      {
        title: "Digital India Architecture, DigiLocker & Government APIs",
        domain: "Technology",
        subDomain: "Digital Governance",
        reason: "Empowers modern paperless administrative operations and interoperable public delivery architectures.",
        priority: "Medium",
      },
      {
        title: "DPDP Act 2023 Statutory Compliance & UN Statistical Ethics",
        domain: "Data Protection",
        subDomain: "Statutory Compliance",
        reason: "Mandatory compliance standards for data privacy, citizen confidentiality, and ethical governance.",
        priority: "Foundational",
      },
    ],
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
  };
}
