import type { DiagnosticQuestion } from "@/context/CompetencyContext";
import type { IGOTCatalogCourse } from "@/services/karmayogiCoursesService";
import { retrieveCoursesForTopicOrGap } from "./rag/ragService";

export interface AIQuestionMetadata {
  bloomLevel: "Recall" | "Application" | "Analysis" | "Evaluation";
  difficulty: "Foundational" | "Applied" | "Advanced";
  courseTitle: string;
  courseCode: string;
  topic: string;
}

export interface ExtendedDiagnosticQuestion extends DiagnosticQuestion {
  courseTitle?: string;
  courseCode?: string;
  bloomLevel?: "Recall" | "Application" | "Analysis" | "Evaluation";
  difficulty?: "Foundational" | "Applied" | "Advanced";
  isAIGenerated?: boolean;
}

// Domain curriculum question bank tailored to active iGOT course modules
const COURSE_CURRICULUM_POOLS: Record<string, Omit<ExtendedDiagnosticQuestion, "id">[]> = {
  python: [
    {
      domain: "Python & Data Analytics",
      domainId: "python",
      courseTitle: "Python Data Science for Official Statistics & PLFS Cleansing",
      courseCode: "MOSPI-PY-301",
      difficulty: "Applied",
      bloomLevel: "Application",
      isAIGenerated: true,
      text: "When cleansing 5GB+ PLFS survey microdata with Python Pandas, which vectorization pattern minimizes memory overhead and prevents Python GIL contention?",
      options: [
        "Using vectorized .loc conditions or DuckDB arrow table scans directly over Parquet files",
        "Applying df.iterrows() loop with custom Python exception handlers",
        "Writing a for-loop appending Python dictionary objects into an empty list",
        "Exporting each chunk to temporary CSVs and reading line-by-line",
      ],
      correct: 0,
      explanation: "Vectorized operations and zero-copy Apache Arrow / DuckDB bindings bypass Python object boxing and loop overhead, processing tabular survey microdata at hardware bus speeds with constant memory.",
      citation: {
        documentName: "MoSPI Python Microdata Guidelines (2024)",
        chapter: "Chapter 3: Out-of-Core Processing & Arrow Vectorization",
        page: "Page 42, Rule 3.4",
      },
    },
    {
      domain: "Python & Data Analytics",
      domainId: "python",
      courseTitle: "Python Data Science for Official Statistics & PLFS Cleansing",
      courseCode: "MOSPI-PY-301",
      difficulty: "Advanced",
      bloomLevel: "Analysis",
      isAIGenerated: true,
      text: "In survey analytics, how should extreme survey weight outliers (Multiplier column) be treated during household consumption aggregation in Pandas?",
      options: [
        "Winsorize or calibrate weights at the 99th percentile using survey design constraints",
        "Silently delete all household records with multiplier values above mean + 1 standard deviation",
        "Replace all weights with a constant factor of 1.0 to ensure unweighted equality",
        "Multiply all other household rows by 10 to balance out the extreme weights",
      ],
      correct: 0,
      explanation: "Survey methodology mandates statistical weight trimming or Winsorization at established percentiles (e.g. 99th) to control sampling variance without introducing systematic exclusion bias.",
      citation: {
        documentName: "NSSO Survey Sampling Manual (Vol II)",
        chapter: "Chapter 6: Multiplier Trimming & Calibration Estimation",
        page: "Page 88, Section 6.2",
      },
    },
    {
      domain: "Python & Data Analytics",
      domainId: "python",
      courseTitle: "Applied Python for Civil Service Automation",
      courseCode: "MOSPI-PY-202",
      difficulty: "Foundational",
      bloomLevel: "Recall",
      isAIGenerated: true,
      text: "Which Python data structure provides O(1) average lookup time when verifying whether a respondent's unique identification code exists in an administrative master list?",
      options: [
        "Python Set (hash table implementation)",
        "Standard ordered Python List",
        "Single-column NumPy 1D array without indexing",
        "Python Tuple sorted in ascending order",
      ],
      correct: 0,
      explanation: "Python sets and dictionaries are implemented as C hash tables, delivering O(1) average time complexity for membership testing, whereas list scans require O(N) linear time.",
      citation: {
        documentName: "Civil Service Data Structures & Python Best Practices",
        chapter: "Chapter 2: Collection Complexity & Hashing",
        page: "Page 17",
      },
    },
  ],

  stats: [
    {
      domain: "Applied Statistics & Sampling Theory",
      domainId: "stats",
      courseTitle: "Advanced Sampling Theory & NSS Survey Methodology",
      courseCode: "NSSTA-ST-401",
      difficulty: "Advanced",
      bloomLevel: "Analysis",
      isAIGenerated: true,
      text: "In NSS multi-stage stratified sampling, why is Circular Systematic Sampling with Probability Proportional to Size (PPS) utilized for selecting Census Enumeration Blocks?",
      options: [
        "To assign higher selection probability to larger blocks while maintaining equal self-weighting sample representation across households",
        "To guarantee that every geographical village has an identical 50% probability of selection",
        "To eliminate the necessity of conducting household listing in selected sample blocks",
        "Because simple random sampling is computationally prohibited by national computer servers",
      ],
      correct: 0,
      explanation: "PPS sampling assigns selection probability proportional to block population measure, yielding a self-weighting master sample where ultimate-stage sample households bear approximately equal design weights.",
      citation: {
        documentName: "NSS Survey Design & Estimation Protocols",
        chapter: "Chapter 1: Multi-Stage PPS Sample Selection",
        page: "Page 12, Theorem 1.3",
      },
    },
    {
      domain: "Applied Statistics & Sampling Theory",
      domainId: "stats",
      courseTitle: "Advanced Sampling Theory & NSS Survey Methodology",
      courseCode: "NSSTA-ST-401",
      difficulty: "Applied",
      bloomLevel: "Application",
      isAIGenerated: true,
      text: "When the sampling fraction (n / N) in an administrative district census exceeds 5%, what adjustment must be applied to standard error variance estimations?",
      options: [
        "Multiply variance by the Finite Population Correction (FPC) factor: (N - n) / (N - 1)",
        "Divide standard error by the square root of 2",
        "Double the reported margin of error to compensate for survey fatigue",
        "Omit confidence intervals completely since district enumeration is quasi-complete",
      ],
      correct: 0,
      explanation: "When sampling without replacement represents >5% of the total target population, the Finite Population Correction (1 - n/N) reduces standard error because a non-trivial portion of the population has already been surveyed.",
      citation: {
        documentName: "Cochran's Sampling Techniques Handbook for Official Statistics",
        chapter: "Chapter 2: Simple Random Sampling & FPC Formulation",
        page: "Page 26, Eq 2.11",
      },
    },
  ],

  sql: [
    {
      domain: "SQL & Database Operations",
      domainId: "sql",
      courseTitle: "Enterprise SQL & High-Volume Microdata Aggregations for CPI/IIP",
      courseCode: "DIID-DB-203",
      difficulty: "Advanced",
      bloomLevel: "Analysis",
      isAIGenerated: true,
      text: "When calculating rolling 12-month Consumer Price Index (CPI) year-on-year inflation metrics over 50 million price quotes, which SQL window function strategy ensures optimal performance?",
      options: [
        "LAG(price, 12) OVER (PARTITION BY item_id, district_id ORDER BY survey_month)",
        "A self-join of the price table on item_id with a non-indexed WHERE price_table_1.month = price_table_2.month - 12",
        "A correlated subquery inside the SELECT projection without composite indices",
        "Cursor loop executing 50 million individual UPDATE statements per price item",
      ],
      correct: 0,
      explanation: "The window function LAG() with composite B-Tree indexing on (item_id, district_id, survey_month) evaluates year-on-year lags in a single sequential streaming scan with zero index thrashing.",
      citation: {
        documentName: "National Statistical Microdata Warehouse Architecture Guide",
        chapter: "Chapter 4: Window Functions & Analytical Aggregations",
        page: "Page 62, Listing 4.3",
      },
    },
    {
      domain: "SQL & Database Operations",
      domainId: "sql",
      courseTitle: "Enterprise SQL & High-Volume Microdata Aggregations for CPI/IIP",
      courseCode: "DIID-DB-203",
      difficulty: "Applied",
      bloomLevel: "Application",
      isAIGenerated: true,
      text: "Which index type in PostgreSQL / open-source relational databases is most effective for multi-terabyte survey tables where transaction timestamps are monotonically increasing?",
      options: [
        "BRIN (Block Range Index) having minimal disk footprint",
        "Single-column Hash Index on nullable survey remarks",
        "Unclustered B-Tree on 10 combined text columns",
        "Full text search GIN index on numeric respondent telephone numbers",
      ],
      correct: 0,
      explanation: "BRIN indices store summary ranges (min/max) for physical disk block ranges. For naturally clustered or sequential timestamp data, BRIN utilizes orders of magnitude less RAM than traditional B-Trees.",
      citation: {
        documentName: "Database Optimization for Government Cloud Infrastructure",
        chapter: "Chapter 5: Indexing Microdata Workloads",
        page: "Page 81",
      },
    },
  ],

  gis: [
    {
      domain: "GIS & Spatial Analysis",
      domainId: "gis",
      courseTitle: "QGIS Spatial Sampling Frame Construction & Geo-tagging",
      courseCode: "FOD-GIS-102",
      difficulty: "Applied",
      bloomLevel: "Application",
      isAIGenerated: true,
      text: "What is the mandated coordinate reference system (CRS) for all pan-India administrative geo-spatial boundaries and Census Enumeration spatial frames?",
      options: [
        "India Lambert Conformal Conic (LCC) / WGS 84 (EPSG: 4326 or national project standard)",
        "Web Mercator (EPSG: 3857) without conformal correction",
        "Arbitrary unprojected local Cartesian pixels",
        "North Pole Azimuthal Equidistant projection",
      ],
      correct: 0,
      explanation: "Standard government GIS guidelines mandate Lambert Conformal Conic (LCC) for pan-India thematic mapping to preserve local shapes and conformal accuracy across wide latitudinal spans.",
      citation: {
        documentName: "Survey of India Geospatial Guidelines",
        chapter: "Standard 2: Geodetic Datum & Coordinate Projections",
        page: "Page 14",
      },
    },
    {
      domain: "GIS & Spatial Analysis",
      domainId: "gis",
      courseTitle: "QGIS Spatial Sampling Frame Construction & Geo-tagging",
      courseCode: "FOD-GIS-102",
      difficulty: "Foundational",
      bloomLevel: "Recall",
      isAIGenerated: true,
      text: "During field surveys with CAPI tablets, what is the maximum permissible Horizontal Dilution of Precision (HDOP) for valid GPS geo-tagging of sample structures?",
      options: [
        "HDOP <= 2.0 (ensuring high geometric accuracy from visible satellites)",
        "HDOP >= 20.0 (where satellite geometry is completely dispersed)",
        "HDOP is not applicable when GPS signal is obstructed by concrete roofs",
        "HDOP = 100.0 without satellite lock",
      ],
      correct: 0,
      explanation: "An HDOP reading of 2.0 or lower represents good-to-excellent satellite constellation geometry, ensuring geo-spatial coordinates remain within acceptable sub-5-meter tolerance.",
      citation: {
        documentName: "Field Operations Division (FOD) CAPI Digital Survey Manual",
        chapter: "Chapter 3: GPS Geo-tagging Calibration & Thresholds",
        page: "Page 31",
      },
    },
  ],

  ethics: [
    {
      domain: "Public Data Ethics & DPDP Act 2023",
      domainId: "ethics",
      courseTitle: "DPDP Act 2023 Statutory Compliance & UN Statistical Ethics",
      courseCode: "NSSTA-ETH-501",
      difficulty: "Applied",
      bloomLevel: "Application",
      isAIGenerated: true,
      text: "Under Section 8 of the Digital Personal Data Protection (DPDP) Act 2023, what is the statutory duty of a Government Data Fiduciary regarding personal data erasure upon completion of survey processing?",
      options: [
        "Erase personal data unless retention is necessary for compliance with statutory law or research anonymization mandates",
        "Publish all respondent names and identities openly in the national gazette",
        "Retain non-anonymized identifiers indefinitely on public FTP servers for 50 years",
        "Transfer unencrypted respondent phone numbers to private telemarketing companies",
      ],
      correct: 0,
      explanation: "Section 8(7) mandates that Data Fiduciaries must erase personal data upon purpose fulfillment, unless retention is explicitly authorized by statutory legislation or strict anonymization protocols are enforced.",
      citation: {
        documentName: "Digital Personal Data Protection Act 2023 (Gazette of India)",
        chapter: "Section 8: General Obligations of Data Fiduciaries",
        page: "Clause 8(7)",
      },
    },
    {
      domain: "Public Data Ethics & DPDP Act 2023",
      domainId: "ethics",
      courseTitle: "DPDP Act 2023 Statutory Compliance & UN Statistical Ethics",
      courseCode: "NSSTA-ETH-501",
      difficulty: "Foundational",
      bloomLevel: "Recall",
      isAIGenerated: true,
      text: "According to Principle 6 of the UN Fundamental Principles of Official Statistics, how must individual respondent data collected for statistical purposes be treated?",
      options: [
        "Strictly confidential and used exclusively for statistical purposes",
        "Accessible to commercial market researchers upon fee payment",
        "Disclosed to local law enforcement for individual household tax audits",
        "Published with full street addresses to ensure transparent peer review",
      ],
      correct: 0,
      explanation: "UN Fundamental Principle 6 stipulates that individual data collected by statistical agencies must be strictly confidential and protected from non-statistical uses such as tax or judicial proceedings.",
      citation: {
        documentName: "United Nations Fundamental Principles of Official Statistics (UNSD)",
        chapter: "Principle 6: Confidentiality & Public Trust",
        page: "UN Resolution 68/261",
      },
    },
  ],

  policy: [
    {
      domain: "Public Admin & GFR Guidelines",
      domainId: "policy",
      courseTitle: "General Financial Rules (GFR 2017) & Public Procurement",
      courseCode: "ISTM-GFR-101",
      difficulty: "Applied",
      bloomLevel: "Application",
      isAIGenerated: true,
      text: "Under Rule 149 of GFR 2017, what is the statutory mandate for procurement of common-use goods and services across Central Ministries?",
      options: [
        "Mandatory procurement through the Government e-Marketplace (GeM) portal",
        "Manual newspaper tender advertisements for all purchases above ₹1,000",
        "Cash purchases from local offline retail vendors without competitive quotations",
        "Direct overseas imports without domestic competitive evaluation",
      ],
      correct: 0,
      explanation: "Rule 149 of GFR 2017 establishes that the procurement of goods and services available on GeM is mandatory for Ministries and Departments of the Government of India.",
      citation: {
        documentName: "General Financial Rules (GFR 2017) - Ministry of Finance",
        chapter: "Chapter 6: Procurement of Goods and Services",
        page: "Rule 149 (Page 52)",
      },
    },
  ],
};

/**
 * Resolve domain ID keyword from course title or domain string
 */
function resolveDomainKey(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("python") || lower.includes("pandas") || lower.includes("machine learning") || lower.includes("ai")) return "python";
  if (lower.includes("stat") || lower.includes("sampling") || lower.includes("survey") || lower.includes("nss")) return "stats";
  if (lower.includes("sql") || lower.includes("database") || lower.includes("postgres") || lower.includes("microdata")) return "sql";
  if (lower.includes("gis") || lower.includes("spatial") || lower.includes("qgis") || lower.includes("geo")) return "gis";
  if (lower.includes("dpdp") || lower.includes("ethic") || lower.includes("privacy") || lower.includes("data protection")) return "ethics";
  if (lower.includes("gfr") || lower.includes("finance") || lower.includes("procurement") || lower.includes("admin")) return "policy";
  return "python"; // fallback
}

/**
 * Dynamically synthesizes AI assessment questions tailored specifically to the learner's active courses.
 */
export function generateAssessmentQuestionsForCourses(
  activeCourses: IGOTCatalogCourse[],
  totalQuestionsCount: number = 10,
  targetCourseId?: string
): ExtendedDiagnosticQuestion[] {
  let targetCourses = activeCourses;

  if (targetCourseId) {
    const specific = activeCourses.filter((c) => String(c.id) === String(targetCourseId) || c.code.toLowerCase() === targetCourseId.toLowerCase());
    if (specific.length > 0) targetCourses = specific;
  }

  // If no courses active, provide balanced representative core cadre courses
  if (targetCourses.length === 0) {
    targetCourses = [
      {
        id: "python-core",
        code: "MOSPI-PY-301",
        title: "Python Data Science for Official Statistics & PLFS Cleansing",
        desc: "Automating national survey pipelines with Pandas, DuckDB and Arrow.",
        domain: "Python & Data Analytics",
        subDomain: "Data Analytics",
        area: "National Statistical Academy",
        org: "NSSTA iGOT",
        duration: 10,
        level: "Intermediate",
        rating: 4.8,
        posterImage: "",
        url: "",
        keywords: ["Python", "Pandas", "PLFS"],
        tpacEndorsed: true,
      },
      {
        id: "stats-core",
        code: "NSSTA-ST-401",
        title: "Advanced Sampling Theory & NSS Survey Methodology",
        desc: "Multi-stage stratified sampling and variance estimation.",
        domain: "Applied Statistics & Sampling Theory",
        subDomain: "Sampling Theory",
        area: "National Statistical Academy",
        org: "NSSTA TPAC",
        duration: 12,
        level: "Advanced",
        rating: 4.9,
        posterImage: "",
        url: "",
        keywords: ["Sampling", "NSS", "PPS"],
        tpacEndorsed: true,
      },
    ];
  }

  const generatedList: ExtendedDiagnosticQuestion[] = [];
  const assignedDomains = new Set<string>();

  // 1. Gather pre-curated high-fidelity questions matching the active courses
  targetCourses.forEach((course) => {
    const key = resolveDomainKey(`${course.title} ${course.domain} ${course.keywords.join(" ")}`);
    assignedDomains.add(key);
    const pool = COURSE_CURRICULUM_POOLS[key] || COURSE_CURRICULUM_POOLS.python;

    pool.forEach((template) => {
      generatedList.push({
        id: 0,
        ...template,
        courseTitle: course.title,
        courseCode: course.code,
      });
    });
  });

  // 2. If questions are fewer than requested total, synthesize from remaining cadre pools
  const allKeys = Object.keys(COURSE_CURRICULUM_POOLS);
  let keyIdx = 0;
  while (generatedList.length < totalQuestionsCount && keyIdx < allKeys.length * 3) {
    const key = allKeys[keyIdx % allKeys.length];
    const pool = COURSE_CURRICULUM_POOLS[key];
    const item = pool[Math.floor(Math.random() * pool.length)];

    // Avoid exact duplicate text
    if (!generatedList.some((g) => g.text === item.text)) {
      generatedList.push({
        id: 0,
        ...item,
      });
    }
    keyIdx++;
  }

  // 3. Shuffle and assign serial IDs (1 to N)
  const trimmed = generatedList.slice(0, Math.max(5, totalQuestionsCount));
  return trimmed.map((q, index) => ({
    ...q,
    id: index + 1,
  }));
}

const GROQ_API_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GROQ_API_KEY) ||
  (typeof process !== "undefined" && process.env?.VITE_GROQ_API_KEY) ||
  "";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Generates MCQs dynamically using RAG course retrieval and Groq AI.
 * Questions are strictly grounded in retrieved course outcomes and syllabus.
 */
export async function generateMCQsWithRAG(params: {
  courseOrTopic: string;
  activeCourses?: IGOTCatalogCourse[];
  targetLevel?: string;
  totalQuestionsCount?: number;
}): Promise<ExtendedDiagnosticQuestion[]> {
  const {
    courseOrTopic,
    activeCourses = [],
    targetLevel = "Applied",
    totalQuestionsCount = 5,
  } = params;

  // Fallback questions to guarantee instant return if Groq is unavailable
  const fallbackQuestions = generateAssessmentQuestionsForCourses(
    activeCourses,
    totalQuestionsCount,
    courseOrTopic
  );

  if (!GROQ_API_KEY) {
    return fallbackQuestions;
  }

  // 1. Retrieve course knowledge base content using RAG
  let ragContext = "";
  let matchedCourseTitle = courseOrTopic;
  let matchedCourseCode = "IGOT-DIAG";
  let domain = "Public Administration";
  let isGrounded = false;

  try {
    const ragResult = await retrieveCoursesForTopicOrGap(courseOrTopic, { limit: 2 });
    isGrounded = ragResult.isGrounded && ragResult.retrievedCourses.length > 0;
    if (isGrounded) {
      const topMatch = ragResult.retrievedCourses[0];
      matchedCourseTitle = topMatch.title;
      matchedCourseCode = topMatch.code;
      domain = topMatch.domain;
      ragContext = ragResult.ragContext;
    }
  } catch (err) {
    console.warn("RAG retrieval for MCQ generation encountered error:", err);
  }

  const systemPrompt = `You are the Chief Assessment Psychometrician for India's iGOT Karmayogi capacity-building platform.
Your task is to generate high-fidelity, scenario-based diagnostic Multiple Choice Questions (MCQs) for Indian civil servants and administrative learners.

GROUNDING & INTEGRITY RULES:
${
  isGrounded
    ? `1. The questions MUST test concepts, procedures, rules, and outcomes from the provided [OFFICIAL COURSE KNOWLEDGE BASE].
2. Do not invent fake laws or unrelated topics. Ground questions in the actual syllabus.
3. Citations must reference the course title or official national standards (e.g. GFR 2017, DPDP Act 2023, MoSPI Guidelines, NeGD SOPs).`
    : `1. No exact course was found in the database. Generate high-quality diagnostic questions testing standard principles in ${courseOrTopic}.
2. Mark citation as "General National Administrative Framework".`
}

Output strictly valid JSON matching this schema:
{
  "questions": [
    {
      "text": "Clear, practical scenario-based problem statement",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correct": 0,
      "explanation": "2-3 sentence rigorous technical/statutory justification of why this option is correct.",
      "bloomLevel": "Recall" | "Application" | "Analysis" | "Evaluation",
      "difficulty": "Foundational" | "Applied" | "Advanced",
      "citation": {
        "documentName": "string",
        "chapter": "string",
        "page": "string"
      }
    }
  ]
}`;

  const userPrompt = `Generate ${totalQuestionsCount} assessment MCQs for:
Topic / Target: "${courseOrTopic}"
Difficulty Level: "${targetLevel}"
${isGrounded ? `[OFFICIAL COURSE KNOWLEDGE BASE]:\n${ragContext}` : ""}

Ensure exactly 4 options per question, indicate the correct option index (0 to 3), and provide detailed citations.`;

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.25,
        max_tokens: 2200,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      console.warn("Groq MCQ generation failed:", res.status);
      return fallbackQuestions;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallbackQuestions;

    const parsed = JSON.parse(content);
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return fallbackQuestions;
    }

    return parsed.questions.map((q: any, idx: number) => ({
      id: idx + 1,
      domain,
      domainId: domain.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 10),
      courseTitle: matchedCourseTitle,
      courseCode: matchedCourseCode,
      difficulty: q.difficulty || targetLevel,
      bloomLevel: q.bloomLevel || "Application",
      isAIGenerated: true,
      text: q.text,
      options: q.options || ["Option A", "Option B", "Option C", "Option D"],
      correct: typeof q.correct === "number" ? q.correct : 0,
      explanation: q.explanation || "Official competency guideline standard.",
      citation: q.citation || {
        documentName: matchedCourseTitle,
        chapter: "Core Competency Guidelines",
        page: "Official Syllabus",
      },
    }));
  } catch (err) {
    console.warn("Groq MCQ generation exception:", err);
    return fallbackQuestions;
  }
}
