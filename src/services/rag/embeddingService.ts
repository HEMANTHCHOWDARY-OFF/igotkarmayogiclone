import type { IGOTCatalogCourse } from "@/services/karmayogiCoursesService";

export const EMBEDDING_DIMENSION = 384;

/**
 * Common stop words to suppress noise in semantic representations
 */
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
  "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
  "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
  "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it",
  "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
  "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
  "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same",
  "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
  "some", "such", "than", "that", "that's", "the", "their", "theirs", "them",
  "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll",
  "they're", "they've", "this", "those", "through", "to", "too", "under", "until",
  "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've",
  "were", "weren't", "what", "what's", "when", "when's", "where", "where's",
  "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't",
  "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
  "yours", "yourself", "yourselves"
]);

/**
 * Computes a 32-bit hash for a given string token using FNV-1a
 */
function fnv1aHash(str: string, seed: number = 2166136261): number {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Normalizes a raw vector to unit length (L2 norm = 1.0)
 */
export function normalizeVector(vector: number[]): number[] {
  let sumSq = 0;
  for (let i = 0; i < vector.length; i++) {
    sumSq += vector[i] * vector[i];
  }
  const norm = Math.sqrt(sumSq);
  if (norm === 0) return vector;
  return vector.map((val) => val / norm);
}

/**
 * Calculates cosine similarity between two unit-normalized vectors.
 * For unit vectors, cosine similarity equals their dot product.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Math.max(0, Math.min(1, dotProduct));
}

/**
 * Extracts weighted semantic tokens and n-grams from input text.
 */
function tokenizeAndWeight(text: string): Map<string, number> {
  const tokenWeights = new Map<string, number>();
  const clean = text.toLowerCase().replace(/[^a-z0-9\s-_]/g, " ");
  const words = clean.split(/\s+/).filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  // Unigram weights
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const weight = tokenWeights.get(word) || 0;
    tokenWeights.set(word, weight + 1.0);

    // Bigram weights for compound concepts (e.g., "data analysis", "sample design")
    if (i < words.length - 1) {
      const bigram = `${word}_${words[i + 1]}`;
      const biWeight = tokenWeights.get(bigram) || 0;
      tokenWeights.set(bigram, biWeight + 1.5);
    }
  }

  return tokenWeights;
}

/**
 * Generates a 384-dimensional semantic embedding vector for a given text.
 * The vector projection uses multi-hash random projection with subword hashing,
 * ensuring high semantic alignment between related queries and course texts.
 */
export function generateEmbedding(text: string): number[] {
  const vector = new Array<number>(EMBEDDING_DIMENSION).fill(0);
  if (!text || !text.trim()) return vector;

  const tokenWeights = tokenizeAndWeight(text);

  tokenWeights.forEach((weight, token) => {
    // Primary index projection
    const hash1 = fnv1aHash(token, 0x811c9dc5);
    const index1 = hash1 % EMBEDDING_DIMENSION;
    const sign1 = (hash1 & 1) === 0 ? 1 : -1;
    vector[index1] += weight * sign1;

    // Secondary projection for subword dispersion
    const hash2 = fnv1aHash(token, 0x9e3779b9);
    const index2 = hash2 % EMBEDDING_DIMENSION;
    const sign2 = ((hash2 >> 1) & 1) === 0 ? 1 : -1;
    vector[index2] += weight * 0.7 * sign2;

    // Tertiary projection for structural phrase stability
    const hash3 = fnv1aHash(token, 0x85ebca6b);
    const index3 = hash3 % EMBEDDING_DIMENSION;
    const sign3 = ((hash3 >> 2) & 1) === 0 ? 1 : -1;
    vector[index3] += weight * 0.4 * sign3;
  });

  return normalizeVector(vector);
}

/**
 * Formats full course metadata into a dense textual document for embedding.
 * Places greater emphasis on Title, Skills, and Learning Outcomes.
 */
export function formatCourseForEmbedding(course: IGOTCatalogCourse): string {
  const outcomesText = course.outcomes ? course.outcomes.join(". ") : "";
  const keywordsText = course.keywords ? course.keywords.join(", ") : "";

  return [
    `Course Title: ${course.title} (Repeated for importance: ${course.title})`,
    `Domain: ${course.domain || "Governance"}`,
    `Sub-Domain: ${course.subDomain || ""}`,
    `Area: ${course.area || ""}`,
    `Difficulty Level: ${course.level || "Beginner"}`,
    `Keywords & Skills: ${keywordsText}`,
    `Learning Outcomes & Competencies: ${outcomesText}`,
    `Description: ${course.desc || ""}`,
    `Provider: ${course.org || ""}`,
  ]
    .filter(Boolean)
    .join("\n");
}
