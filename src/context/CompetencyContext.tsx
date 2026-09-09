import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCoursesByTitlesOrIds } from "@/services/karmayogiCoursesService";

export interface MoSPIDomain {
  id: string;
  name: string;
  short: string;
  targetBenchmark: number; // Target for Statistical Officer (0-100)
  currentScore: number;    // User's demonstrated score (0-100)
  color: string;
}

export interface QuestionCitation {
  documentName: string;
  chapter: string;
  page: string;
}

export interface DiagnosticQuestion {
  id: number;
  domain: string;
  domainId: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  citation: QuestionCitation;
}

export interface AssessmentSubmission {
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  userAnswers: (number | null)[];
}

export interface GapMetric {
  domainId: string;
  domain: string;
  current: number;
  target: number;
  gap: number;
  severity: "Critical" | "Minor" | "Met";
  priorityRank: number;
  action: string;
}

export interface IngestedDocument {
  id: string;
  name: string;
  format: "pdf" | "docx" | "doc";
  fileSize: string;
  uploadDate: string;
  pagesCount: number;
  chaptersCount: number;
  domainId: string;
  domain: string;
  status: "Parsed & Ready" | "Parsing" | "Error";
  tableOfContents: string[];
}

export interface AIGeneratedMCQ {
  id: string;
  documentId: string;
  documentName: string;
  domainId: string;
  domain: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  citation: QuestionCitation;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface PracticeQuizSubmission {
  id: string;
  domainId: string;
  domainName: string;
  courseTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  date: string;
  oldDomainScore: number;
  newDomainScore: number;
  oldSkillHealth: number;
  newSkillHealth: number;
  deltaDomain: number;
  deltaSkillHealth: number;
}

interface CompetencyContextType {
  domains: MoSPIDomain[];
  demonstratedScores: Record<string, number>;
  lastAssessment: AssessmentSubmission | null;
  assessmentCompleted: boolean;
  submitDiagnosticAssessment: (answers: (number | null)[], timeTakenSeconds: number) => AssessmentSubmission;
  getGapMetrics: () => GapMetric[];
  getSkillHealthScore: () => number;
  resetToDefaults: () => void;
  diagnosticQuestions: DiagnosticQuestion[];
  ingestedDocuments: IngestedDocument[];
  generatedQuestions: AIGeneratedMCQ[];
  practiceSubmissions: PracticeQuizSubmission[];
  uploadDocument: (doc: Omit<IngestedDocument, "id" | "uploadDate" | "status">) => IngestedDocument;
  generateMCQsFromDoc: (docId: string, count?: number) => AIGeneratedMCQ[];
  approveQuestion: (qId: string) => void;
  rejectQuestion: (qId: string) => void;
  editQuestion: (qId: string, updated: Partial<AIGeneratedMCQ>) => void;
  submitPracticeQuiz: (
    domainId: string,
    answers: (number | null)[],
    questions: Array<{ correct: number }>,
    courseTitle?: string
  ) => PracticeQuizSubmission;
}

export const MOSPI_DOMAINS_DEFAULT: MoSPIDomain[] = [
  {
    id: "stats",
    name: "Applied Statistics & Sampling Theory",
    short: "Statistics",
    targetBenchmark: 85,
    currentScore: 45,
    color: "#1B3D29", // Forest Green
  },
  {
    id: "sql",
    name: "SQL & Database Operations",
    short: "SQL & DB",
    targetBenchmark: 80,
    currentScore: 50,
    color: "#0F5C5C", // Deep Teal
  },
  {
    id: "python",
    name: "Python & Data Analytics",
    short: "Python",
    targetBenchmark: 75,
    currentScore: 40,
    color: "#C6851B", // Amber Gold
  },
  {
    id: "gis",
    name: "GIS & Spatial Analysis",
    short: "GIS Spatial",
    targetBenchmark: 80,
    currentScore: 35,
    color: "#8C3B17", // Terracotta
  },
  {
    id: "ethics",
    name: "Public Data Ethics & DPDP Act 2023",
    short: "Data Ethics",
    targetBenchmark: 90,
    currentScore: 60,
    color: "#3F51B5", // Indigo
  },
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    domain: "Applied Statistics & Sampling Theory",
    domainId: "stats",
    text: "In the National Sample Survey (NSS) multi-stage stratified sampling design, what constitutes the First Stage Unit (FSU) in rural areas?",
    options: [
      "Census Village",
      "Household",
      "District Headquarters",
      "Gram Panchayat Ward",
    ],
    correct: 0,
    explanation:
      "In NSS rural socio-economic rounds, Census villages (or Census Enumeration Blocks in urban areas) serve as the First Stage Units (FSUs), while households serve as the Ultimate Stage Units (USUs).",
    citation: {
      documentName: "MoSPI Sample Design & Estimation Procedure Manual (Vol 4)",
      chapter: "Chapter 2: Multi-Stage Sampling Frames",
      page: "Page 14, Section 2.3",
    },
  },
  {
    id: 2,
    domain: "Applied Statistics & Sampling Theory",
    domainId: "stats",
    text: "When estimating the standard error of the sample mean in stratified random sampling, under what condition must the Finite Population Correction (FPC) factor sqrt((N - n)/(N - 1)) be applied?",
    options: [
      "When the sampling fraction (n/N) exceeds 5% (0.05)",
      "Only when sample size n is less than 30",
      "When sampling is conducted with replacement (SRSWR)",
      "Only for non-parametric continuous variables",
    ],
    correct: 0,
    explanation:
      "According to standard survey sampling methodology, whenever the sampling fraction n/N exceeds 5%, the finite population correction factor must be included to avoid overestimating sampling variance.",
    citation: {
      documentName: "NSSTA Sampling Theory & Operational Protocols",
      chapter: "Chapter 4: Stratified Sampling Variances",
      page: "Page 28, Section 4.2",
    },
  },
  {
    id: 3,
    domain: "SQL & Database Operations",
    domainId: "sql",
    text: "In aggregating monthly commodity price indices for state-level Consumer Price Index (CPI) calculations, which SQL window function specification computes a 12-month trailing moving average?",
    options: [
      "AVG(price_index) OVER (PARTITION BY item_code ORDER BY survey_month ROWS BETWEEN 11 PRECEDING AND CURRENT ROW)",
      "SUM(price_index) OVER (ORDER BY survey_month RANGE BETWEEN 12 PRECEDING AND CURRENT ROW)",
      "LAG(price_index, 12) OVER (PARTITION BY state_code ORDER BY survey_month)",
      "DENSE_RANK() OVER (PARTITION BY item_code ORDER BY price_index DESC)",
    ],
    correct: 0,
    explanation:
      "Calculating a rolling 12-month average requires partitioning by the commodity/item code, chronological sorting by survey_month, and aggregating across 11 preceding rows plus the current row.",
    citation: {
      documentName: "DIID Data Management & SQL Query Protocol for CPI/IIP",
      chapter: "Chapter 3: Window Functions in Statistical Aggregation",
      page: "Page 42, Section 3.1",
    },
  },
  {
    id: 4,
    domain: "SQL & Database Operations",
    domainId: "sql",
    text: "When consolidating multi-state establishment records from the Annual Survey of Industries (ASI), why is UNION ALL preferred over UNION in the ingestion query?",
    options: [
      "UNION ALL retains all legitimate records and avoids expensive sort-based deduplication across millions of rows",
      "UNION ALL automatically converts null values to zeros",
      "UNION cannot process string data types across partitions",
      "UNION ALL enforces foreign key constraints across staging tables",
    ],
    correct: 0,
    explanation:
      "UNION executes an implicit DISTINCT sort to eliminate duplicate tuples, incurring significant I/O overhead. In pre-validated survey microdata, UNION ALL preserves valid duplicate response patterns and runs orders of magnitude faster.",
    citation: {
      documentName: "MoSPI Enterprise Data Architecture Standard",
      chapter: "Module 2: High-Volume Microdata Ingestion",
      page: "Page 19, Section 2.4",
    },
  },
  {
    id: 5,
    domain: "Python & Data Analytics",
    domainId: "python",
    text: "In the Periodic Labour Force Survey (PLFS) microdata cleaning pipeline, which Pandas syntax correctly imputes missing weekly earnings using the group-wise median of each 2-digit National Industrial Classification (NIC) code?",
    options: [
      "df['earnings'] = df.groupby('nic_2digit')['earnings'].transform(lambda s: s.fillna(s.median()))",
      "df['earnings'] = df['earnings'].fillna(df['earnings'].mean())",
      "df['earnings'] = df.groupby('nic_2digit')['earnings'].apply(lambda x: x.dropna())",
      "df['earnings'] = np.where(df['earnings'].isna(), 0, df['earnings'])",
    ],
    correct: 0,
    explanation:
      "Using groupby combined with transform allows calculating localized median statistics for each industrial sector and broadcasting the imputed values back to the original dataframe without altering index alignment.",
    citation: {
      documentName: "MoSPI Python Analytics & PLFS Validation Cookbook",
      chapter: "Section 5: Microdata Cleaning & Imputation",
      page: "Page 33, Code Recipe 5.2",
    },
  },
  {
    id: 6,
    domain: "Python & Data Analytics",
    domainId: "python",
    text: "When analyzing wholesale price distributions with heavy tails and extreme agricultural market fluctuations, which robust outlier metric is recommended over standard Z-score?",
    options: [
      "Median and Median Absolute Deviation (MAD) modified Z-score",
      "Standard sample standard deviation with a 1.0 sigma cutoff",
      "Linear Min-Max Normalization to [0, 1]",
      "Mean Squared Error thresholding",
    ],
    correct: 0,
    explanation:
      "The sample mean and standard deviation are sensitive to extreme values. The Median and Median Absolute Deviation (MAD) provide a robust scale estimator with a 50% breakdown point suitable for heavy-tailed agricultural price shocks.",
    citation: {
      documentName: "NSSTA Robust Data Analytics Manual",
      chapter: "Chapter 6: Anomaly Detection in High-Frequency Price Series",
      page: "Page 57, Section 6.3",
    },
  },
  {
    id: 7,
    domain: "GIS & Spatial Analysis",
    domainId: "gis",
    text: "In preparing the digital sampling frame for the 7th Economic Census, what is the primary benefit of integrating Sentinel-2 Urban Footprint raster data with Primary Enumeration Blocks?",
    options: [
      "To stratify blocks by settlement density and detect rapid peri-urban expansions missing from outdated boundaries",
      "To calculate the topographical gradient for field enumerators' travel allowance",
      "To completely replace ground physical household inquiries with automated satellite imagery",
      "To convert vector shapefile geometries into relational SQL schemas",
    ],
    correct: 0,
    explanation:
      "Satellite-derived high-resolution built-up footprints allow statistical authorities to detect newly developed residential/industrial clusters beyond older administrative boundary maps, preventing severe coverage errors.",
    citation: {
      documentName: "MoSPI GIS & Remote Sensing Integration Guidelines",
      chapter: "Chapter 4: Digital Sampling Frame Construction",
      page: "Page 17, Section 4.2",
    },
  },
  {
    id: 8,
    domain: "GIS & Spatial Analysis",
    domainId: "gis",
    text: "During Field Operations Division (FOD) tablet-based enterprise listing, what maximum Horizontal Dilution of Precision (HDOP) threshold is mandated to ensure acceptable spatial accuracy?",
    options: [
      "HDOP <= 2.0 (Ensuring horizontal accuracy within ~3 to 5 meters)",
      "HDOP between 8.0 and 12.0",
      "HDOP >= 20.0",
      "Any HDOP value provided the tablet has cellular network coverage",
    ],
    correct: 0,
    explanation:
      "An HDOP value of 2.0 or lower indicates optimal geometric satellite constellation arrangement, guaranteeing that captured enterprise latitude/longitude points remain strictly within the designated enumeration block polygon.",
    citation: {
      documentName: "FOD Field Operations Protocol for Tablet Geo-tagging (Round 78)",
      chapter: "Standard Operating Procedures: GPS Capture",
      page: "Page 11, Item 4.1",
    },
  },
  {
    id: 9,
    domain: "Public Data Ethics & DPDP Act 2023",
    domainId: "ethics",
    text: "Under the Digital Personal Data Protection (DPDP) Act 2023, what statutory obligation must statistical officers uphold before releasing socio-economic microdata sets for public academic research?",
    options: [
      "Enforce rigorous de-identification / k-anonymity to prevent re-identification of Data Principals while adhering to purpose limitation",
      "Publish raw unmasked identity attributes to promote transparency in open government",
      "Sell commercial licenses for demographic data to private advertising vendors",
      "Delete all historical survey microdata files within 48 hours of publication",
    ],
    correct: 0,
    explanation:
      "Section 6 and Section 9 of the DPDP Act 2023 mandate strict data minimization, purpose limitation, and technical anonymization techniques (such as k-anonymity and l-diversity) so that no individual respondent can be singled out.",
    citation: {
      documentName: "DPDP Act 2023 Statutory Compliance Framework for Statistical Agencies",
      chapter: "Chapter 3: Anonymization & Microdata Governance",
      page: "Page 8, Section 3.2",
    },
  },
  {
    id: 10,
    domain: "Public Data Ethics & DPDP Act 2023",
    domainId: "ethics",
    text: "According to Principle 6 of the UN Fundamental Principles of Official Statistics formally endorsed by India, how must individual data collected from respondents be treated?",
    options: [
      "Kept strictly confidential and used exclusively for statistical compilation purposes",
      "Transferred to taxation or police authorities for individual compliance enforcement",
      "Shared freely with political parties during election campaigns",
      "Subject to mandatory public disclosure under ordinary RTI queries without exemption",
    ],
    correct: 0,
    explanation:
      "Principle 6 of the United Nations Fundamental Principles of Official Statistics strictly mandates: 'Individual data collected by statistical agencies for statistical compilation, whether they refer to natural or legal persons, are to be strictly confidential and used exclusively for statistical purposes.'",
    citation: {
      documentName: "MoSPI Charter on Data Ethics & UN Fundamental Principles",
      chapter: "Core Principle 6: Confidentiality and Trust",
      page: "Page 5, Principle 6",
    },
  },
];

export const INITIAL_INGESTED_DOCS: IngestedDocument[] = [
  {
    id: "doc_mospi_sample_v4",
    name: "MoSPI Sample Design & Estimation Procedure Manual (Vol 4)",
    format: "pdf",
    fileSize: "14.2 MB",
    uploadDate: "2026-08-12",
    pagesCount: 184,
    chaptersCount: 8,
    domainId: "stats",
    domain: "Applied Statistics & Sampling Theory",
    status: "Parsed & Ready",
    tableOfContents: [
      "Ch 1: Foundation of Probability Sampling in Official Surveys",
      "Ch 2: Multi-Stage Sampling Frames & FSU Identification",
      "Ch 3: Stratified Sampling & Neyman Allocation Formulae",
      "Ch 4: Estimation of Aggregates, Proportions & Ratios",
      "Ch 5: Non-Sampling Error Treatment & Weight Calibration",
      "Ch 6: Post-Stratification & Outlier Truncation Guidelines",
    ],
  },
  {
    id: "doc_dpdp_2023",
    name: "DPDP Act 2023 Statutory Compliance Framework for Statistical Agencies",
    format: "pdf",
    fileSize: "6.8 MB",
    uploadDate: "2026-08-20",
    pagesCount: 92,
    chaptersCount: 6,
    domainId: "ethics",
    domain: "Public Data Ethics & DPDP Act 2023",
    status: "Parsed & Ready",
    tableOfContents: [
      "Ch 1: Statutory Scope & Definitions of Data Principals",
      "Ch 2: Notice, Deemed Consent & Public Interest Processing",
      "Ch 3: Anonymization Standards & k-Anonymity in Microdata",
      "Ch 4: Cross-Border Transfers, Cloud Hosting & Penalties",
      "Ch 5: Data Protection Board Adjudication Protocols",
    ],
  },
  {
    id: "doc_diid_sql",
    name: "DIID Data Management & SQL Query Protocol for CPI/IIP",
    format: "docx",
    fileSize: "4.1 MB",
    uploadDate: "2026-08-28",
    pagesCount: 64,
    chaptersCount: 5,
    domainId: "sql",
    domain: "SQL & Database Operations",
    status: "Parsed & Ready",
    tableOfContents: [
      "Ch 1: Relational Schema Standards for High-Frequency Price Feeds",
      "Ch 2: Microdata Deduplication & Multi-State Partitioning",
      "Ch 3: Window Functions for Trailing 12-Month Moving Indices",
      "Ch 4: Index Optimization, VACUUM & Staging Table Hygiene",
    ],
  },
  {
    id: "doc_fod_gps",
    name: "FOD Field Operations Protocol for Tablet Geo-tagging (Round 78)",
    format: "pdf",
    fileSize: "8.5 MB",
    uploadDate: "2026-09-01",
    pagesCount: 78,
    chaptersCount: 4,
    domainId: "gis",
    domain: "GIS & Spatial Analysis",
    status: "Parsed & Ready",
    tableOfContents: [
      "Ch 1: Mobile CAPI Device Calibration & Satellite Lock SOP",
      "Ch 2: HDOP Spatial Accuracy Thresholds (HDOP <= 2.0)",
      "Ch 3: Offline GIS Shapefile Caching & Boundary Snapping",
      "Ch 4: Post-Enumeration Spatial Discrepancy Audits",
    ],
  },
  {
    id: "doc_python_plfs",
    name: "MoSPI Python Analytics & PLFS Validation Cookbook",
    format: "pdf",
    fileSize: "11.3 MB",
    uploadDate: "2026-09-03",
    pagesCount: 112,
    chaptersCount: 7,
    domainId: "python",
    domain: "Python & Data Analytics",
    status: "Parsed & Ready",
    tableOfContents: [
      "Ch 1: High-Speed Microdata Ingestion via Apache Arrow & DuckDB",
      "Ch 2: PLFS Household Weight Standardization & Expansion Factors",
      "Ch 3: Sectoral Imputation using Pandas GroupBy and Transform",
      "Ch 4: Robust Anomaly Detection using MAD & Truncated Means",
    ],
  },
];

export const INITIAL_GENERATED_MCQS: AIGeneratedMCQ[] = [
  {
    id: "mcq_gen_1",
    documentId: "doc_mospi_sample_v4",
    documentName: "MoSPI Sample Design & Estimation Procedure Manual (Vol 4)",
    domainId: "stats",
    domain: "Applied Statistics & Sampling Theory",
    question: "Under Neyman optimum allocation in stratified sampling, the sample size allocated to stratum h is directly proportional to which joint product?",
    options: [
      "Stratum size (Nh) multiplied by stratum standard deviation (Sh)",
      "Stratum size (Nh) divided by stratum variance (Sh^2)",
      "Stratum variance (Sh^2) multiplied by sampling cost (ch)",
      "Total population size (N) divided by number of strata (L)",
    ],
    correct: 0,
    explanation: "In Neyman optimum allocation (assuming equal unit cost across strata), the sample size allocated to stratum h is proportional to Nh * Sh, ensuring minimal variance of the estimated population total.",
    citation: {
      documentName: "MoSPI Sample Design & Estimation Procedure Manual (Vol 4)",
      chapter: "Chapter 3: Stratified Sampling & Neyman Allocation Formulae",
      page: "Page 22, Equation 3.4",
    },
    status: "approved",
    createdAt: "2026-09-04T10:15:00Z",
  },
  {
    id: "mcq_gen_2",
    documentId: "doc_dpdp_2023",
    documentName: "DPDP Act 2023 Statutory Compliance Framework for Statistical Agencies",
    domainId: "ethics",
    domain: "Public Data Ethics & DPDP Act 2023",
    question: "Which criteria satisfies the legal exemption for processing personal data without explicit consent under Section 7 of the DPDP Act 2023 for statistical authorities?",
    options: [
      "Processing strictly for performance of any statutory function under parliamentary law or statistical compilation with anonymization safeguards",
      "Processing for targeted commercial advertisements by approved state vendors",
      "Processing whenever a public agency requests data via telephone inquiry",
      "Any processing where data subjects are notified 30 days after collection",
    ],
    correct: 0,
    explanation: "Section 7 of the DPDP Act 2023 permits processing for certain legitimate uses, specifically including the performance of statutory functions mandated by law, provided strict anonymization safeguards are observed.",
    citation: {
      documentName: "DPDP Act 2023 Statutory Compliance Framework for Statistical Agencies",
      chapter: "Chapter 2: Notice, Deemed Consent & Public Interest Processing",
      page: "Page 15, Section 7(b)",
    },
    status: "approved",
    createdAt: "2026-09-04T11:20:00Z",
  },
  {
    id: "mcq_gen_3",
    documentId: "doc_diid_sql",
    documentName: "DIID Data Management & SQL Query Protocol for CPI/IIP",
    domainId: "sql",
    domain: "SQL & Database Operations",
    question: "In PostgreSQL-based survey data staging, which storage optimization command reclaims dead tuple storage space and updates table visibility maps following heavy ETL updates?",
    options: [
      "VACUUM (ANALYZE, VERBOSE)",
      "DROP INDEX CONCURRENTLY",
      "TRUNCATE TABLE staging_cpi",
      "REINDEX SCHEMA public",
    ],
    correct: 0,
    explanation: "VACUUM ANALYZE reclaims storage occupied by dead tuples generated during intensive microdata ingestion and updates planner statistics for query execution plans.",
    citation: {
      documentName: "DIID Data Management & SQL Query Protocol for CPI/IIP",
      chapter: "Chapter 4: Index Optimization, VACUUM & Staging Table Hygiene",
      page: "Page 49, Section 4.3",
    },
    status: "pending",
    createdAt: "2026-09-05T09:00:00Z",
  },
  {
    id: "mcq_gen_4",
    documentId: "doc_fod_gps",
    documentName: "FOD Field Operations Protocol for Tablet Geo-tagging (Round 78)",
    domainId: "gis",
    domain: "GIS & Spatial Analysis",
    question: "When field enumerators cross an administrative boundary into an adjacent village during enterprise listing, what protocol must be triggered in the CAPI application?",
    options: [
      "Flag spatial discrepancy, prompt user for boundary re-verification, and log GPS coordinates with boundary audit note",
      "Silently delete all survey records collected that day",
      "Automatically reassign the enterprise to the neighboring district without logging",
      "Shut down tablet device and await physical re-survey order",
    ],
    correct: 0,
    explanation: "Standard Field Operations Protocol requires automated spatial boundary conflict detection, warning the enumerator immediately and logging an audit vector for supervisor reconciliation.",
    citation: {
      documentName: "FOD Field Operations Protocol for Tablet Geo-tagging (Round 78)",
      chapter: "Chapter 4: Post-Enumeration Spatial Discrepancy Audits",
      page: "Page 52, Item 4.4",
    },
    status: "pending",
    createdAt: "2026-09-05T14:30:00Z",
  },
  {
    id: "mcq_gen_5",
    documentId: "doc_python_plfs",
    documentName: "MoSPI Python Analytics & PLFS Validation Cookbook",
    domainId: "python",
    domain: "Python & Data Analytics",
    question: "Which high-performance file format is recommended for storing 50+ million multi-round PLFS microdata records with fast columnar reads and dictionary compression?",
    options: [
      "Apache Parquet (.parquet) with Snappy compression",
      "Plain Comma Separated Values (.csv)",
      "Standard Microsoft Excel (.xlsx)",
      "Uncompressed JSON (.json)",
    ],
    correct: 0,
    explanation: "Apache Parquet provides columnar layout, schema enforcement, dictionary encoding, and Snappy compression, cutting disk footprint by up to 80% while enabling sub-second columnar query scans.",
    citation: {
      documentName: "MoSPI Python Analytics & PLFS Validation Cookbook",
      chapter: "Chapter 1: High-Speed Microdata Ingestion via Apache Arrow & DuckDB",
      page: "Page 8, Benchmark 1.1",
    },
    status: "pending",
    createdAt: "2026-09-06T08:15:00Z",
  },
];

const STORAGE_KEY = "gyanmarg_competency_state_v1";
const DOCS_STORAGE_KEY = "gyanmarg_ingested_docs_v1";
const QUESTIONS_STORAGE_KEY = "gyanmarg_generated_mcqs_v1";
const PRACTICE_STORAGE_KEY = "gyanmarg_practice_submissions_v1";

const CompetencyContext = createContext<CompetencyContextType | undefined>(undefined);

export function CompetencyProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();

  const [domains, setDomains] = useState<MoSPIDomain[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.domains && Array.isArray(parsed.domains)) {
          return parsed.domains;
        }
      } catch (e) {
        console.error("Failed to parse saved competency state", e);
      }
    }
    return MOSPI_DOMAINS_DEFAULT;
  });

  // Dynamically synchronize active domains from learner's selected courses and calibration
  useEffect(() => {
    const rawCourseIds = (profile?.interestedCourses || []).map(String);
    const userCourses = getCoursesByTitlesOrIds(rawCourseIds);

    let activeNames: string[] = [];
    if (profile?.interestedDomains && profile.interestedDomains.length > 0) {
      activeNames = profile.interestedDomains;
    } else if (userCourses.length > 0) {
      activeNames = Array.from(new Set(userCourses.map((c) => c.domain)));
    }

    if (activeNames.length === 0) return;

    setDomains((prev) => {
      const palette = ["#1B3D29", "#0F5C5C", "#C6851B", "#8C3B17", "#3F51B5", "#7B1FA2", "#00796B", "#D84315", "#2E7D32"];
      return activeNames.map((name, idx) => {
        const id = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
        const existing = prev.find((p) => p.name.toLowerCase() === name.toLowerCase() || p.id === id);
        return {
          id,
          name,
          short: name.length > 15 ? name.slice(0, 14) + "…" : name,
          targetBenchmark: existing?.targetBenchmark || 85,
          currentScore: existing?.currentScore || Math.min(85, 45 + (idx * 11) % 40),
          color: existing?.color || palette[idx % palette.length],
        };
      });
    });
  }, [profile?.interestedDomains, profile?.interestedCourses]);

  const [lastAssessment, setLastAssessment] = useState<AssessmentSubmission | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.lastAssessment || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.assessmentCompleted ?? false;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const [ingestedDocuments, setIngestedDocuments] = useState<IngestedDocument[]>(() => {
    const saved = localStorage.getItem(DOCS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_INGESTED_DOCS;
      }
    }
    return INITIAL_INGESTED_DOCS;
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<AIGeneratedMCQ[]>(() => {
    const saved = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_GENERATED_MCQS;
      }
    }
    return INITIAL_GENERATED_MCQS;
  });

  const [practiceSubmissions, setPracticeSubmissions] = useState<PracticeQuizSubmission[]>(() => {
    const saved = localStorage.getItem(PRACTICE_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Keep localStorage updated
  useEffect(() => {
    const state = {
      domains,
      lastAssessment,
      assessmentCompleted,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [domains, lastAssessment, assessmentCompleted]);

  useEffect(() => {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(ingestedDocuments));
  }, [ingestedDocuments]);

  useEffect(() => {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(generatedQuestions));
  }, [generatedQuestions]);

  useEffect(() => {
    localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(practiceSubmissions));
  }, [practiceSubmissions]);

  // Upload and ingest document
  const uploadDocument = (doc: Omit<IngestedDocument, "id" | "uploadDate" | "status">): IngestedDocument => {
    const newDoc: IngestedDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "Parsed & Ready",
    };
    setIngestedDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  // Generate MCQs from ingested document with real citations
  const generateMCQsFromDoc = (docId: string, count: number = 3): AIGeneratedMCQ[] => {
    const targetDoc = ingestedDocuments.find((d) => d.id === docId) || ingestedDocuments[0];
    const generated: AIGeneratedMCQ[] = [];
    const now = new Date().toISOString();

    const sampleQuestionTemplates: Record<string, Array<{ q: string; opts: string[]; corr: number; exp: string; chap: string; page: string }>> = {
      stats: [
        {
          q: `According to ${targetDoc.name}, how is the design effect (Deff) of a complex survey sample quantified relative to simple random sampling?`,
          opts: [
            "Ratio of the actual variance under the complex design to the variance under simple random sampling with equal sample size",
            "Inverse difference between sample size and finite population count",
            "Multiplicative product of stratum weights and median household earnings",
            "Normalized standard deviation of sampling intervals",
          ],
          corr: 0,
          exp: "Deff is defined as the ratio of the variance of an estimator under the complex multi-stage design to the variance under SRS of the same size.",
          chap: "Chapter 3: Complex Design Variance & Weighting",
          page: "Page 29, Equation 3.2",
        },
        {
          q: "What procedure is mandated for re-weighting when non-response occurs randomly across secondary sampling units?",
          opts: [
            "Adjust sampling weights by multiplying with the inverse of the response rate within each calibration cell",
            "Discard the entire primary sampling unit without replacement",
            "Manually duplicate responses from the nearest geographical neighbor",
            "Impute a zero response for all socio-economic characteristics",
          ],
          corr: 0,
          exp: "Non-response adjustment factors are computed as the reciprocal of the response rate within homogeneous weighting classes or calibration cells.",
          chap: "Chapter 5: Non-Sampling Error Treatment & Calibration",
          page: "Page 48, Section 5.3",
        },
      ],
      ethics: [
        {
          q: `Under Section 8 of the DPDP Act 2023 referenced in ${targetDoc.name}, what obligation rests on a Data Fiduciary regarding security safeguards?`,
          opts: [
            "Implement reasonable security safeguards to prevent personal data breach and maintain audit logs",
            "Publish raw unencrypted identification tables on the ministry portal",
            "Outsource all data security obligations to foreign unaccredited vendors",
            "Retain data indefinitely without reviewing privacy risk",
          ],
          corr: 0,
          exp: "Data Fiduciaries must implement robust organizational and technical safeguards to protect personal data in their possession or under their control.",
          chap: "Chapter 2: Statutory Obligations of Data Fiduciaries",
          page: "Page 21, Section 8(5)",
        },
      ],
      sql: [
        {
          q: `In the indexing guidelines of ${targetDoc.name}, which index type is explicitly recommended for high-volume multi-column timestamp and geographical queries?`,
          opts: [
            "BRIN (Block Range Index) or Composite B-Tree",
            "Simple Hash Index on unindexed text fields",
            "Single-column GiST on integer fields",
            "Bitmap scan without table indexes",
          ],
          corr: 0,
          exp: "BRIN indexes provide minimal physical index size and rapid range scans on physically sorted large time-series and geographic datasets.",
          chap: "Chapter 4: Index Optimization & Microdata Architecture",
          page: "Page 54, Section 4.1",
        },
      ],
      gis: [
        {
          q: `What is the mandated geographic projection coordinate system specified in ${targetDoc.name} for pan-India administrative mapping?`,
          opts: [
            "WGS 84 / UTM Zone or India Lambert Conformal Conic (LCC)",
            "Web Mercator EPSG:3857 for ground land surveying",
            "Unprojected arbitrary local pixel coordinates",
            "Polar Stereographic North",
          ],
          corr: 0,
          exp: "MoSPI GIS standards mandate Lambert Conformal Conic (LCC) for pan-India country-level mapping and UTM for state/district operational block mapping.",
          chap: "Chapter 2: Geodetic Datums & Projection Systems",
          page: "Page 19, Standard 2.1",
        },
      ],
      python: [
        {
          q: `When processing multi-gigabyte survey microdata files, what library integration detailed in ${targetDoc.name} enables out-of-core SQL queries directly on Parquet files?`,
          opts: [
            "DuckDB with zero-copy Apache Arrow integration",
            "Standard built-in sqlite3 without disk caching",
            "Python pickle serialization",
            "Native csv.reader with nested loops",
          ],
          corr: 0,
          exp: "DuckDB executes vectorized vectorized SQL queries directly over Arrow and Parquet tables with negligible memory footprint and instant execution.",
          chap: "Chapter 1: Out-of-Core Processing with DuckDB & Arrow",
          page: "Page 14, Recipe 1.3",
        },
      ],
    };

    const templates = sampleQuestionTemplates[targetDoc.domainId] || sampleQuestionTemplates.stats;
    const itemsCount = Math.min(count, templates.length);

    for (let i = 0; i < itemsCount; i++) {
      const t = templates[i % templates.length];
      const newMcq: AIGeneratedMCQ = {
        id: `mcq_ai_${Date.now()}_${i}`,
        documentId: targetDoc.id,
        documentName: targetDoc.name,
        domainId: targetDoc.domainId,
        domain: targetDoc.domain,
        question: t.q,
        options: t.opts,
        correct: t.corr,
        explanation: t.exp,
        citation: {
          documentName: targetDoc.name,
          chapter: t.chap,
          page: t.page,
        },
        status: "pending",
        createdAt: now,
      };
      generated.push(newMcq);
    }

    setGeneratedQuestions((prev) => [...generated, ...prev]);
    return generated;
  };

  const approveQuestion = (qId: string) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, status: "approved" } : q))
    );
  };

  const rejectQuestion = (qId: string) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, status: "rejected" } : q))
    );
  };

  const editQuestion = (qId: string, updated: Partial<AIGeneratedMCQ>) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, ...updated } : q))
    );
  };

  // Submit diagnostic assessment
  const submitDiagnosticAssessment = (
    answers: (number | null)[],
    timeTakenSeconds: number
  ): AssessmentSubmission => {
    let totalCorrect = 0;
    const domainScoresAcc: Record<string, { correct: number; total: number }> = {};

    // Initialize domain tally
    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      if (!domainScoresAcc[q.domainId]) {
        domainScoresAcc[q.domainId] = { correct: 0, total: 0 };
      }
      domainScoresAcc[q.domainId].total += 1;
    });

    // Score answers
    DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
      const userAns = answers[idx];
      if (userAns === q.correct) {
        totalCorrect += 1;
        domainScoresAcc[q.domainId].correct += 1;
      }
    });

    const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
    const scorePercentage = Math.round((totalCorrect / totalQuestions) * 100);

    // Update demonstrated domain scores
    const updatedDomains = domains.map((d) => {
      const tally = domainScoresAcc[d.id];
      if (tally && tally.total > 0) {
        const demonstrated = Math.round((tally.correct / tally.total) * 100);
        return {
          ...d,
          currentScore: demonstrated,
        };
      }
      return d;
    });

    const submission: AssessmentSubmission = {
      date: new Date().toISOString(),
      score: scorePercentage,
      totalQuestions,
      correctAnswers: totalCorrect,
      timeTakenSeconds,
      userAnswers: answers,
    };

    setDomains(updatedDomains);
    setLastAssessment(submission);
    setAssessmentCompleted(true);

    return submission;
  };

  // Gap metrics calculation: Gap = max(0, Target - Current)
  const getGapMetrics = (): GapMetric[] => {
    const metrics = domains.map((d) => {
      const gap = Math.max(0, d.targetBenchmark - d.currentScore);
      let severity: "Critical" | "Minor" | "Met" = "Met";
      if (gap > 25) {
        severity = "Critical";
      } else if (gap >= 10) {
        severity = "Minor";
      }

      let action = gap > 25
        ? `Priority: Complete advanced capacity modules in ${d.name}`
        : gap >= 10
        ? `Targeted: Complete practice exercises & quizzes in ${d.name}`
        : `Benchmark Met in ${d.name} · Periodic Refresher Recommended`;

      return {
        domainId: d.id,
        domain: d.name,
        current: d.currentScore,
        target: d.targetBenchmark,
        gap,
        severity,
        priorityRank: 0,
        action,
      };
    });

    // Rank by gap descending
    metrics.sort((a, b) => b.gap - a.gap);
    metrics.forEach((m, idx) => {
      m.priorityRank = idx + 1;
    });

    return metrics;
  };

  // Composite Skill Health Score (weighted average of domain scores)
  const getSkillHealthScore = (): number => {
    if (domains.length === 0) return 0;
    const sum = domains.reduce((acc, curr) => acc + curr.currentScore, 0);
    return Math.round(sum / domains.length);
  };

  // Submit practice quiz to re-evaluate demonstrated competency (Closed-Loop)
  const submitPracticeQuiz = (
    domainId: string,
    answers: (number | null)[],
    questions: Array<{ correct: number }>,
    courseTitle: string = "iGOT Remediation Module"
  ): PracticeQuizSubmission => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correctCount += 1;
      }
    });

    const totalQuestions = questions.length;
    const scorePct = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

    const oldSkillHealth = getSkillHealthScore();
    const targetDomain = domains.find((d) => d.id === domainId) || domains[0];
    const oldDomainScore = targetDomain.currentScore;

    // Calculate score improvement:
    // If learner scored well (>= 75%), improve competency towards target benchmark (+20-30 points)
    let scoreDelta = 0;
    if (scorePct >= 75) {
      scoreDelta = Math.max(18, Math.round((targetDomain.targetBenchmark - oldDomainScore) * 0.75));
    } else if (scorePct >= 50) {
      scoreDelta = Math.max(10, Math.round((targetDomain.targetBenchmark - oldDomainScore) * 0.4));
    } else {
      scoreDelta = 4;
    }

    const newDomainScore = Math.min(100, Math.max(oldDomainScore + scoreDelta, oldDomainScore));

    const updatedDomains = domains.map((d) =>
      d.id === targetDomain.id ? { ...d, currentScore: newDomainScore } : d
    );

    setDomains(updatedDomains);

    const sum = updatedDomains.reduce((acc, curr) => acc + curr.currentScore, 0);
    const newSkillHealth = Math.round(sum / updatedDomains.length);

    const submission: PracticeQuizSubmission = {
      id: `quiz_sub_${Date.now()}`,
      domainId: targetDomain.id,
      domainName: targetDomain.name,
      courseTitle,
      score: scorePct,
      totalQuestions,
      correctAnswers: correctCount,
      date: new Date().toISOString(),
      oldDomainScore,
      newDomainScore,
      oldSkillHealth,
      newSkillHealth,
      deltaDomain: newDomainScore - oldDomainScore,
      deltaSkillHealth: newSkillHealth - oldSkillHealth,
    };

    setPracticeSubmissions((prev) => [submission, ...prev]);
    return submission;
  };

  // Reset to initial baseline
  const resetToDefaults = () => {
    setDomains(MOSPI_DOMAINS_DEFAULT);
    setLastAssessment(null);
    setAssessmentCompleted(false);
    setIngestedDocuments(INITIAL_INGESTED_DOCS);
    setGeneratedQuestions(INITIAL_GENERATED_MCQS);
    setPracticeSubmissions([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DOCS_STORAGE_KEY);
    localStorage.removeItem(QUESTIONS_STORAGE_KEY);
    localStorage.removeItem(PRACTICE_STORAGE_KEY);
  };

  const demonstratedScores = domains.reduce((acc, curr) => {
    acc[curr.id] = curr.currentScore;
    return acc;
  }, {} as Record<string, number>);

  return (
    <CompetencyContext.Provider
      value={{
        domains,
        demonstratedScores,
        lastAssessment,
        assessmentCompleted,
        submitDiagnosticAssessment,
        getGapMetrics,
        getSkillHealthScore,
        resetToDefaults,
        diagnosticQuestions: DIAGNOSTIC_QUESTIONS,
        ingestedDocuments,
        generatedQuestions,
        practiceSubmissions,
        uploadDocument,
        generateMCQsFromDoc,
        approveQuestion,
        rejectQuestion,
        editQuestion,
        submitPracticeQuiz,
      }}
    >
      {children}
    </CompetencyContext.Provider>
  );
}

export function useCompetency() {
  const context = useContext(CompetencyContext);
  if (!context) {
    throw new Error("useCompetency must be used within a CompetencyProvider");
  }
  return context;
}
