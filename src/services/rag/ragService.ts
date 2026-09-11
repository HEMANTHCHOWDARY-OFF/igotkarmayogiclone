import { generateEmbedding } from "./embeddingService";
import { courseVectorStore } from "./courseVectorStore";
import type {
  RetrievedCourse,
  StudentQueryContext,
  RAGRetrievalOptions,
  RAGRetrievalResult,
} from "./ragTypes";

/**
 * Builds a comprehensive search query string by combining student context facets
 */
export function buildQueryFromStudentContext(context: StudentQueryContext): string {
  const parts: string[] = [];

  if (context.goal) {
    parts.push(`Career Goal: ${context.goal}`);
  }

  if (context.track) {
    parts.push(`Cadre Track: ${context.track}`);
  }

  if (context.interests) {
    parts.push(`Expressed Learning Interests: ${context.interests}`);
  }

  if (context.knowledgeGaps && context.knowledgeGaps.length > 0) {
    parts.push(`Knowledge Gaps to Remediate: ${context.knowledgeGaps.join(", ")}`);
  }

  if (context.currentSkills && context.currentSkills.length > 0) {
    parts.push(`Current Skills: ${context.currentSkills.join(", ")}`);
  }

  if (context.selectedDomains && context.selectedDomains.length > 0) {
    parts.push(`Focus Domains: ${context.selectedDomains.join(", ")}`);
  }

  if (context.selectedSubDomains && context.selectedSubDomains.length > 0) {
    parts.push(`Sub-Domains: ${context.selectedSubDomains.join(", ")}`);
  }

  if (context.level && context.level !== "all") {
    parts.push(`Proficiency Target: ${context.level}`);
  }

  return parts.join("\n");
}

/**
 * Converts retrieved database courses into formatted RAG context for Groq
 */
export function buildRAGPromptContext(courses: RetrievedCourse[]): string {
  if (!courses || courses.length === 0) {
    return "NO STORED COURSES RETRIEVED FROM DATABASE.";
  }

  return courses
    .map((c, idx) => {
      const outcomes = c.outcomes && c.outcomes.length > 0 ? c.outcomes.join("; ") : "Not specified";
      const keywords = c.keywords && c.keywords.length > 0 ? c.keywords.join(", ") : "N/A";

      return `[COURSE ${idx + 1}]
- Course ID: "${c.id}"
- Course Code: "${c.code}"
- Title: "${c.title}"
- Domain: "${c.domain}"
- Sub-Domain: "${c.subDomain || ""}"
- Organization/Provider: "${c.org || "iGOT Karmayogi"}"
- Duration: ${c.duration} hours
- Difficulty Level: "${c.level}"
- Official URL: "${c.url}"
- Learning Outcomes: ${outcomes}
- Key Topics/Keywords: ${keywords}
- Description: ${c.desc || "Comprehensive capacity building module."}`;
    })
    .join("\n\n");
}

/**
 * Generates strict anti-hallucination rules for Groq LLM
 */
export function getAntiHallucinationInstructions(isGrounded: boolean): string {
  if (isGrounded) {
    return `CRITICAL ANTI-HALLUCINATION & RAG GROUNDING RULES:
1. All course recommendations, course titles, course IDs, URLs, domains, and durations MUST strictly come from the [RETRIEVED STORED COURSES] provided above.
2. DO NOT fabricate, hallucinate, or alter any course title, course ID, or URL. Use the exact "Course ID" and exact "Title" from the retrieved list.
3. You may use your general administrative/pedagogical intelligence for sequencing, reasoning, and competency descriptions, but the actual course offerings MUST be grounded in the retrieved courses.
4. If a student's interest requires a concept covered in a retrieved course, reference that retrieved course.`;
  }

  return `FALLBACK / GENERAL KNOWLEDGE INSTRUCTIONS:
1. No matching courses were found in the official GyanMarg course knowledge base for this specific request.
2. You MUST clearly state to the user: "I could not find an exact matching course in the current GyanMarg course database. Based on general knowledge, here are foundational recommendations..."
3. Distinguish clearly between general recommendations and verified platform courses.
4. DO NOT invent or fabricate fake course IDs or fake iGOT platform course URLs.
5. Provide actionable general guidance, skills to learn, and pedagogical advice based on broader domain standards.`;
}

/**
 * Orchestrates RAG retrieval using student context
 */
export async function retrieveCoursesForStudent(
  context: StudentQueryContext,
  options: RAGRetrievalOptions = {}
): Promise<RAGRetrievalResult> {
  const queryText = buildQueryFromStudentContext(context);
  const queryEmbedding = generateEmbedding(queryText);

  const searchResponse = await courseVectorStore.search(queryEmbedding, {
    limit: options.limit || 6,
    threshold: options.threshold || 0.20,
    domainFilter: options.domainFilter,
    levelFilter: options.levelFilter,
  });

  const isGrounded = searchResponse.results.length > 0;
  const ragContext = buildRAGPromptContext(searchResponse.results);

  return {
    queryText,
    isGrounded,
    retrievedCourses: searchResponse.results,
    ragContext,
    source: isGrounded ? searchResponse.source : "general_knowledge_fallback",
  };
}

/**
 * Orchestrates RAG retrieval for a specific knowledge gap or learning topic
 */
export async function retrieveCoursesForTopicOrGap(
  topicOrGap: string,
  options: RAGRetrievalOptions = {}
): Promise<RAGRetrievalResult> {
  const queryEmbedding = generateEmbedding(topicOrGap);

  const searchResponse = await courseVectorStore.search(queryEmbedding, {
    limit: options.limit || 4,
    threshold: options.threshold || 0.18,
    domainFilter: options.domainFilter,
    levelFilter: options.levelFilter,
  });

  const isGrounded = searchResponse.results.length > 0;
  const ragContext = buildRAGPromptContext(searchResponse.results);

  return {
    queryText: topicOrGap,
    isGrounded,
    retrievedCourses: searchResponse.results,
    ragContext,
    source: isGrounded ? searchResponse.source : "general_knowledge_fallback",
  };
}
