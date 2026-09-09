import taxonomyData from "@/data/igotTaxonomy.json";
import allCoursesData from "@/data/igotAllCourses.json";
import { IGOT_COURSES, type IGOTCourse } from "@/data/igotCourses";

export interface IGOTSubDomain {
  name: string;
  count: number;
}

export interface IGOTDomain {
  name: string;
  area: string;
  totalCourses: number;
  subDomains: IGOTSubDomain[];
}

export interface IGOTCatalogCourse {
  id: string;
  code: string;
  title: string;
  desc: string;
  domain: string;
  subDomain: string;
  area: string;
  org: string;
  duration: number; // hours
  level: string;
  rating: number;
  posterImage: string;
  url: string;
  keywords: string[];
  tpacEndorsed: boolean;
  aiRecommended?: boolean;
  recommendationReason?: string;
  outcomes?: string[];
  modulesCount?: number;
  instructor?: {
    name: string;
    title: string;
    avatar: string;
  };
}

// Convert specialized MoSPI / NSSO courses into standard IGOTCatalogCourse format
const convertedSpecializedCourses: IGOTCatalogCourse[] = IGOT_COURSES.map((c) => ({
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
  posterImage: "",
  url: c.href || `https://igotkarmayogi.gov.in/app/toc/${c.courseCode}/overview`,
  keywords: c.outcomes || [c.domain, c.dept],
  tpacEndorsed: c.tpacEndorsed,
  outcomes: c.outcomes,
  modulesCount: c.modulesCount,
  instructor: c.instructor,
}));

// Full unified course list (5,390 + 18 specialized courses = 5,408 courses)
const rawAllCourses: IGOTCatalogCourse[] = allCoursesData as IGOTCatalogCourse[];

// Deduplicate by id and title
const courseMap = new Map<string, IGOTCatalogCourse>();
// Add specialized first so they can be looked up easily by numeric ID or code
convertedSpecializedCourses.forEach((c) => {
  courseMap.set(c.id, c);
  courseMap.set(c.code.toLowerCase(), c);
});
rawAllCourses.forEach((c) => {
  if (!courseMap.has(c.id)) {
    courseMap.set(c.id, c);
  }
});

export const igotAllCourses: IGOTCatalogCourse[] = [
  ...convertedSpecializedCourses,
  ...rawAllCourses,
];

// Ensure taxonomy includes specialized statistical domains if not already present
const rawTaxonomy: IGOTDomain[] = taxonomyData as IGOTDomain[];
const domainNamesInTax = new Set(rawTaxonomy.map((d) => d.name));

const additionalDomains: IGOTDomain[] = [
  {
    name: "Applied Statistics & Sampling Theory",
    area: "Domain",
    totalCourses: 6,
    subDomains: [
      { name: "Survey Sampling & Multi-Stage Design", count: 3 },
      { name: "Estimation & Variance Estimation", count: 3 },
    ],
  },
  {
    name: "SQL & Database Operations",
    area: "Domain",
    totalCourses: 4,
    subDomains: [
      { name: "Relational Queries & Indexing", count: 2 },
      { name: "Microdata Ingestion & Window Functions", count: 2 },
    ],
  },
  {
    name: "Python & Data Analytics",
    area: "Domain",
    totalCourses: 4,
    subDomains: [
      { name: "Pandas Microdata Cleansing", count: 2 },
      { name: "Machine Learning in Public Sector", count: 2 },
    ],
  },
  {
    name: "GIS & Spatial Analysis",
    area: "Domain",
    totalCourses: 2,
    subDomains: [
      { name: "QGIS & Cadastral Mapping", count: 1 },
      { name: "Spatial Sampling Frames", count: 1 },
    ],
  },
  {
    name: "Public Data Ethics & DPDP Act 2023",
    area: "Domain",
    totalCourses: 2,
    subDomains: [
      { name: "DPDP Act Statutory Compliance", count: 1 },
      { name: "UN Fundamental Principles of Official Stats", count: 1 },
    ],
  },
];

export const igotTaxonomy: IGOTDomain[] = [
  ...rawTaxonomy,
  ...additionalDomains.filter((ad) => !domainNamesInTax.has(ad.name)),
];

/**
 * Total course count in the unified comprehensive iGOT Karmayogi catalog
 */
export const TOTAL_IGOT_COURSES_COUNT = igotAllCourses.length;

/**
 * Retrieve all unified courses
 */
export function getAllUnifiedCourses(): IGOTCatalogCourse[] {
  return igotAllCourses;
}

/**
 * Retrieve a single course resiliently by ID, numeric ID, or code
 */
export function getCourseById(id: string | number | undefined): IGOTCatalogCourse | undefined {
  if (id === undefined || id === null) return undefined;
  const strId = String(id).trim();
  const lowerId = strId.toLowerCase();

  // 1. Direct match by ID
  const direct = igotAllCourses.find(
    (c) => c.id === strId || c.id.toLowerCase() === lowerId || c.code.toLowerCase() === lowerId
  );
  if (direct) return direct;

  // 2. Numeric index match
  const num = Number(strId);
  if (!isNaN(num) && num >= 1 && num <= IGOT_COURSES.length) {
    const spec = convertedSpecializedCourses.find((c) => c.id === String(num));
    if (spec) return spec;
  }

  // 3. Substring title or partial code match fallback
  return igotAllCourses.find(
    (c) => c.title.toLowerCase().includes(lowerId) || c.code.toLowerCase().includes(lowerId)
  );
}

/**
 * Get courses matching specific titles or ids
 */
export function getCoursesByTitlesOrIds(identifiers: (string | number)[]): IGOTCatalogCourse[] {
  if (!identifiers || identifiers.length === 0) return [];
  const set = new Set(identifiers.map((i) => String(i).trim().toLowerCase()));

  return igotAllCourses.filter(
    (c) =>
      set.has(c.id.toLowerCase()) ||
      set.has(c.code.toLowerCase()) ||
      set.has(c.title.toLowerCase())
  );
}

/**
 * Filter courses by search query, selected domains, and subdomains with pagination
 */
export function queryKarmayogiCourses(params: {
  query?: string;
  domains?: string[];
  subDomains?: string[];
  level?: string;
  page?: number;
  pageSize?: number;
  recommendedTitles?: string[];
}): {
  courses: IGOTCatalogCourse[];
  totalMatches: number;
  totalPages: number;
  currentPage: number;
} {
  const {
    query = "",
    domains = [],
    subDomains = [],
    level,
    page = 1,
    pageSize = 24,
    recommendedTitles = [],
  } = params;

  const q = query.trim().toLowerCase();
  const lowerRecTitles = recommendedTitles.map((t) => t.toLowerCase());

  // Filter courses
  let filtered = igotAllCourses.filter((course) => {
    // Search query
    if (q) {
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchCode = course.code.toLowerCase().includes(q);
      const matchDesc = course.desc.toLowerCase().includes(q);
      const matchOrg = course.org.toLowerCase().includes(q);
      const matchDomain = course.domain.toLowerCase().includes(q);
      const matchSub = course.subDomain.toLowerCase().includes(q);
      const matchKw = course.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false;
      if (!matchTitle && !matchCode && !matchDesc && !matchOrg && !matchDomain && !matchSub && !matchKw) {
        return false;
      }
    }

    // Domain filter
    if (domains.length > 0 && !domains.includes(course.domain)) {
      return false;
    }

    // Sub-domain filter
    if (subDomains.length > 0 && !subDomains.includes(course.subDomain)) {
      return false;
    }

    // Level filter
    if (level && level !== "all" && course.level.toLowerCase() !== level.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Attach AI recommendations & sort recommended items to top
  if (lowerRecTitles.length > 0) {
    filtered = filtered.map((c) => {
      const isRec = lowerRecTitles.some(
        (rt) => c.title.toLowerCase().includes(rt) || rt.includes(c.title.toLowerCase())
      );
      return isRec ? { ...c, aiRecommended: true } : c;
    });

    filtered.sort((a, b) => {
      if (a.aiRecommended && !b.aiRecommended) return -1;
      if (!a.aiRecommended && b.aiRecommended) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
  }

  const totalMatches = filtered.length;
  const totalPages = Math.ceil(totalMatches / pageSize) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  return {
    courses: paginated,
    totalMatches,
    totalPages,
    currentPage: validPage,
  };
}

/**
 * Retrieve list of all domains with total course counts
 */
export function getDomainsWithCounts(): { name: string; totalCourses: number; subDomainsCount: number }[] {
  return igotTaxonomy.map((d) => ({
    name: d.name,
    totalCourses: d.totalCourses,
    subDomainsCount: d.subDomains?.length || 0,
  }));
}

/**
 * Retrieve all sub-domains for a given domain
 */
export function getSubDomainsForDomain(domainName: string): IGOTSubDomain[] {
  const dom = igotTaxonomy.find((d) => d.name === domainName);
  return dom?.subDomains || [];
}
