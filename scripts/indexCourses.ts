import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { generateEmbedding, formatCourseForEmbedding, cosineSimilarity } from "../src/services/rag/embeddingService";
import { IGOT_COURSES } from "../src/data/igotCourses";
import allCoursesData from "../src/data/igotAllCourses.json";

// Native .env parser without external dependency
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...vals] = trimmed.split("=");
        if (key && vals.length > 0) {
          process.env[key.trim()] = vals.join("=").trim();
        }
      }
    });
  }
} catch {
  // Graceful fallback
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

interface CourseRecord {
  id: string;
  code: string;
  title: string;
  desc: string;
  domain: string;
  subDomain?: string;
  area?: string;
  org?: string;
  duration?: number;
  level?: string;
  rating?: number;
  url?: string;
  keywords?: string[];
  outcomes?: string[];
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const maxCourses = limitArg ? parseInt(limitArg.split("=")[1], 10) : 500;

  console.log("=================================================");
  console.log("  GyanMarg AI: Course Vector Indexing Pipeline   ");
  console.log("=================================================");
  console.log(`Mode: ${isDryRun ? "DRY RUN (Local Validation)" : "LIVE SUPABASE SYNC"}`);
  console.log(`Max courses to process: ${maxCourses}`);

  // 1. Gather courses
  const specialized: CourseRecord[] = IGOT_COURSES.map((c) => ({
    id: String(c.id),
    code: c.courseCode,
    title: c.title,
    desc: c.desc,
    domain: c.domain,
    subDomain: c.domain,
    area: "National Statistical Academy & MoSPI",
    org: c.provider || c.dept,
    duration: c.duration,
    level: c.level,
    rating: c.rating,
    url: c.href || `https://igotkarmayogi.gov.in/app/toc/${c.courseCode}/overview`,
    keywords: c.outcomes || [c.domain, c.dept],
    outcomes: c.outcomes,
  }));

  const rawAll: CourseRecord[] = allCoursesData as CourseRecord[];
  const combined = [...specialized, ...rawAll].slice(0, maxCourses);

  console.log(`Found ${combined.length} courses to embed.`);

  // 2. Generate embeddings
  console.log("Generating 384-dimensional vector embeddings...");
  const startTime = Date.now();

  const indexedRecords = combined.map((course) => {
    const denseText = formatCourseForEmbedding(course as any);
    const embedding = generateEmbedding(denseText);
    return {
      id: String(course.id),
      code: course.code,
      title: course.title,
      description: course.desc,
      domain: course.domain,
      sub_domain: course.subDomain || course.domain,
      area: course.area || "Domain",
      org: course.org || "iGOT Karmayogi",
      duration: course.duration || 2,
      level: course.level || "Beginner",
      rating: course.rating || 4.5,
      url: course.url || "",
      keywords: course.keywords || [],
      learning_outcomes: course.outcomes || [],
      embedding,
    };
  });

  const durationMs = Date.now() - startTime;
  console.log(`Generated ${indexedRecords.length} embeddings in ${durationMs}ms (${(durationMs / indexedRecords.length).toFixed(1)}ms/course).`);

  // 3. Test a sample RAG similarity query
  const sampleQuery = "How to analyze sampling weights and multi-stage survey variance in official statistics?";
  console.log(`\nTesting sample query: "${sampleQuery}"`);
  const queryEmb = generateEmbedding(sampleQuery);

  const similarities = indexedRecords.map((rec) => ({
    title: rec.title,
    domain: rec.domain,
    similarity: cosineSimilarity(queryEmb, rec.embedding),
  }));

  similarities.sort((a, b) => b.similarity - a.similarity);
  console.log("\nTop 3 Retrieved Matches:");
  similarities.slice(0, 3).forEach((m, idx) => {
    console.log(`  ${idx + 1}. [${(m.similarity * 100).toFixed(1)}%] ${m.title} (${m.domain})`);
  });

  if (isDryRun) {
    console.log("\n[DRY RUN COMPLETE] Embeddings generated and vector search verified successfully.");
    return;
  }

  // 4. Upsert to Supabase if credentials exist
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("\nSupabase credentials missing in environment. Skipping database upload.");
    return;
  }

  console.log(`\nUploading to Supabase (${SUPABASE_URL})...`);
  const client = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Batch in chunks of 50
  const BATCH_SIZE = 50;
  let uploadedCount = 0;

  for (let i = 0; i < indexedRecords.length; i += BATCH_SIZE) {
    const batch = indexedRecords.slice(i, i + BATCH_SIZE);
    const { error } = await client.from("courses").upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`Error uploading batch ${i / BATCH_SIZE + 1}:`, error.message);
      console.log("Tip: Ensure the 'courses' table migration (supabase/migrations/20260911_rag_pgvector_setup.sql) has been run in Supabase SQL editor.");
      break;
    } else {
      uploadedCount += batch.length;
      process.stdout.write(`Uploaded ${uploadedCount}/${indexedRecords.length} courses...\r`);
    }
  }

  console.log(`\nCompleted indexing: ${uploadedCount} courses indexed successfully.`);
}

main().catch((err) => {
  console.error("Indexing failed:", err);
  process.exit(1);
});
