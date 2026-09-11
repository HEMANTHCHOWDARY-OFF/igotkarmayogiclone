import type { IGOTCatalogCourse } from "@/services/karmayogiCoursesService";

export interface CourseVectorRecord {
  id: string;
  code: string;
  title: string;
  description: string;
  domain: string;
  subDomain: string;
  area?: string;
  org?: string;
  duration?: number;
  level: string;
  rating?: number;
  url?: string;
  keywords: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  embedding: number[];
  updatedAt?: string;
}

export interface RetrievedCourse extends IGOTCatalogCourse {
  similarity: number;
  matchReason?: string;
}

export interface StudentQueryContext {
  goal?: string;
  track?: string;
  currentSkills?: string[];
  knowledgeGaps?: string[];
  interests?: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "all" | string;
  selectedDomains?: string[];
  selectedSubDomains?: string[];
}

export interface RAGRetrievalOptions {
  limit?: number;
  threshold?: number;
  domainFilter?: string;
  levelFilter?: string;
}

export interface RAGRetrievalResult {
  queryText: string;
  isGrounded: boolean;
  retrievedCourses: RetrievedCourse[];
  ragContext: string;
  source: "supabase_pgvector" | "local_vector_index" | "general_knowledge_fallback";
}
