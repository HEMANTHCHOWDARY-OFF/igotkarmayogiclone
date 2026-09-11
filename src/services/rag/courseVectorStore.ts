import { supabase } from "@/lib/supabase";
import { igotAllCourses, type IGOTCatalogCourse } from "@/services/karmayogiCoursesService";
import {
  generateEmbedding,
  cosineSimilarity,
  formatCourseForEmbedding,
} from "./embeddingService";
import type { RetrievedCourse, RAGRetrievalOptions } from "./ragTypes";

interface CachedCourseEmbedding {
  course: IGOTCatalogCourse;
  embedding: number[];
}

class CourseVectorStore {
  private localIndex: Map<string, CachedCourseEmbedding> = new Map();
  private isInitialized = false;
  private supabaseAvailable = true;

  constructor() {
    // Initial lazy setup
  }

  /**
   * Initializes the vector index for core curated courses and catalog data
   */
  public initializeLocalIndex(): void {
    if (this.isInitialized) return;

    // Index specialized MoSPI courses and first batch of representative courses
    const initialBatch = igotAllCourses.slice(0, 150);
    for (const course of initialBatch) {
      const denseText = formatCourseForEmbedding(course);
      const embedding = generateEmbedding(denseText);
      this.localIndex.set(String(course.id), { course, embedding });
    }

    this.isInitialized = true;
  }

  /**
   * Indexes or updates a single course embedding in both memory and Supabase
   */
  public async upsertCourse(course: IGOTCatalogCourse): Promise<void> {
    const denseText = formatCourseForEmbedding(course);
    const embedding = generateEmbedding(denseText);

    // Update local cache
    this.localIndex.set(String(course.id), { course, embedding });

    // Sync to Supabase if connected
    try {
      const { error } = await supabase.from("courses").upsert({
        id: String(course.id),
        code: course.code,
        title: course.title,
        description: course.desc,
        domain: course.domain,
        sub_domain: course.subDomain,
        area: course.area,
        org: course.org,
        duration: course.duration,
        level: course.level,
        rating: course.rating,
        url: course.url,
        keywords: course.keywords || [],
        learning_outcomes: course.outcomes || [],
        embedding: embedding,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        // Table might not exist yet; gracefully keep local
        this.supabaseAvailable = false;
      }
    } catch {
      this.supabaseAvailable = false;
    }
  }

  /**
   * Removes a course and its embedding from the index
   */
  public async deleteCourse(courseId: string): Promise<void> {
    this.localIndex.delete(String(courseId));

    try {
      await supabase.from("courses").delete().eq("id", String(courseId));
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Searches for courses by vector similarity
   * Tries Supabase pgvector RPC first; falls back to local vector index
   */
  public async search(
    queryEmbedding: number[],
    options: RAGRetrievalOptions = {}
  ): Promise<{ results: RetrievedCourse[]; source: "supabase_pgvector" | "local_vector_index" }> {
    const limit = options.limit || 6;
    const threshold = options.threshold || 0.25;
    const domainFilter = options.domainFilter;
    const levelFilter = options.levelFilter;

    // 1. Try Supabase pgvector RPC
    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.rpc("match_courses", {
          query_embedding: queryEmbedding,
          match_threshold: threshold,
          match_count: limit,
          filter_domain: domainFilter || null,
          filter_level: levelFilter || null,
        });

        if (!error && Array.isArray(data) && data.length > 0) {
          const mappedResults: RetrievedCourse[] = data.map((row: any) => ({
            id: String(row.id),
            code: row.code || "",
            title: row.title,
            desc: row.description || "",
            domain: row.domain || "",
            subDomain: row.sub_domain || "",
            area: row.area || "Domain",
            org: row.org || "iGOT Karmayogi",
            duration: Number(row.duration) || 2,
            level: row.level || "Beginner",
            rating: Number(row.rating) || 4.5,
            posterImage: "",
            url: row.url || `https://igotkarmayogi.gov.in/app/toc/${row.code || row.id}/overview`,
            keywords: row.keywords || [],
            tpacEndorsed: true,
            outcomes: row.learning_outcomes || [],
            similarity: Number(row.similarity) || 0,
            matchReason: `Matched via Supabase pgvector (${Math.round((row.similarity || 0) * 100)}% semantic similarity)`,
          }));

          return { results: mappedResults, source: "supabase_pgvector" };
        } else if (error) {
          // Mark Supabase RPC as unavailable for fallback
          this.supabaseAvailable = false;
        }
      } catch {
        this.supabaseAvailable = false;
      }
    }

    // 2. Local vector index fallback
    this.initializeLocalIndex();

    // Ensure relevant domain courses from igotAllCourses are loaded into index
    if (domainFilter) {
      const domainMatches = igotAllCourses.filter(
        (c) => c.domain.toLowerCase() === domainFilter.toLowerCase() && !this.localIndex.has(String(c.id))
      );
      for (const c of domainMatches.slice(0, 50)) {
        const denseText = formatCourseForEmbedding(c);
        const emb = generateEmbedding(denseText);
        this.localIndex.set(String(c.id), { course: c, embedding: emb });
      }
    }

    const scored: RetrievedCourse[] = [];

    this.localIndex.forEach(({ course, embedding }) => {
      // Domain filter check
      if (domainFilter && course.domain.toLowerCase() !== domainFilter.toLowerCase()) {
        return;
      }

      // Level filter check
      if (levelFilter && levelFilter !== "all" && course.level.toLowerCase() !== levelFilter.toLowerCase()) {
        return;
      }

      const similarity = cosineSimilarity(queryEmbedding, embedding);
      if (similarity >= threshold) {
        scored.push({
          ...course,
          similarity,
          matchReason: `Matched ${Math.round(similarity * 100)}% with learner trajectory in ${course.domain}`,
        });
      }
    });

    // Sort by descending similarity
    scored.sort((a, b) => b.similarity - a.similarity);

    return {
      results: scored.slice(0, limit),
      source: "local_vector_index",
    };
  }

  public getStoredCount(): number {
    return this.localIndex.size;
  }
}

export const courseVectorStore = new CourseVectorStore();
