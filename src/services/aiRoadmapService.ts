import { IGOTCatalogCourse } from "./karmayogiCoursesService";

export interface RoadmapSubItem {
  id: string;
  title: string;
  details?: string[];
  status: "todo" | "learning" | "done" | "skip";
}

export interface RoadmapBranchGroup {
  id: string;
  title?: string;
  side: "left" | "right";
  items: RoadmapSubItem[];
}

export interface RoadmapCourseBlock {
  id: string;
  courseId: string;
  courseTitle: string;
  domain: string;
  blockNumber: number;
  blockTitle: string;
  shortDesc: string;
  durationHours: number;
  status: "todo" | "learning" | "done" | "skip";
  importance: "Core" | "Advanced" | "Recommended";
  leftBranches: RoadmapBranchGroup[];
  rightBranches: RoadmapBranchGroup[];
  learningOutcomes: string[];
}

export interface FullCourseRoadmapData {
  courseId: string;
  courseTitle: string;
  domain: string;
  overview: string;
  blocks: RoadmapCourseBlock[];
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Procedural fallback roadmap block generator based on domain & course title keywords
 */
export function generateProceduralRoadmapForCourse(course: IGOTCatalogCourse): FullCourseRoadmapData {
  const title = course.title;
  const domain = course.domain || "Governance & Administration";
  const words = title.split(" ").filter((w) => w.length > 3);
  const coreKey = words[0] || "Competency";
  const subKey = words[1] || "Framework";

  const blocks: RoadmapCourseBlock[] = [
    {
      id: `block-${course.id}-1`,
      courseId: String(course.id),
      courseTitle: course.title,
      domain,
      blockNumber: 1,
      blockTitle: `Foundations of ${coreKey}`,
      shortDesc: `Core definitions, statutory context, and foundational architecture for ${title}.`,
      durationHours: 2,
      status: "todo",
      importance: "Core",
      leftBranches: [
        {
          id: `b-${course.id}-1-l`,
          title: "Conceptual Principles",
          side: "left",
          items: [
            { id: `item-1-1`, title: `What is ${coreKey}?`, status: "todo" },
            { id: `item-1-2`, title: `Statutory Scope & Legal Mandate`, status: "todo" },
          ],
        },
      ],
      rightBranches: [
        {
          id: `b-${course.id}-1-r`,
          title: "Context & Objectives",
          side: "right",
          items: [
            { id: `item-1-3`, title: `Evolution in Public Governance`, status: "todo" },
            { id: `item-1-4`, title: `Standard Operating Procedures (SOP)`, status: "todo" },
          ],
        },
      ],
      learningOutcomes: [
        `Understand the statutory basis and organizational role of ${coreKey}`,
        `Identify primary governance stakeholders and statutory responsibilities`,
      ],
    },
    {
      id: `block-${course.id}-2`,
      courseId: String(course.id),
      courseTitle: course.title,
      domain,
      blockNumber: 2,
      blockTitle: `${subKey} Operational Architecture & Workflows`,
      shortDesc: `Hands-on execution workflows, operational mechanics, and standard toolkits.`,
      durationHours: 3,
      status: "todo",
      importance: "Core",
      leftBranches: [
        {
          id: `b-${course.id}-2-l`,
          title: "Execution Models",
          side: "left",
          items: [
            { id: `item-2-1`, title: "Sequential Workflow", status: "todo" },
            { id: `item-2-2`, title: "Direct Verification Protocol", status: "todo" },
            { id: `item-2-3`, title: "Exception Handling Matrix", status: "todo" },
          ],
        },
      ],
      rightBranches: [
        {
          id: `b-${course.id}-2-r`,
          title: "Compliance & Metrics",
          side: "right",
          items: [
            { id: `item-2-4`, title: "Auditing & Traceability", status: "todo" },
            { id: `item-2-5`, title: "Quality Benchmarks & SLAs", status: "todo" },
          ],
        },
      ],
      learningOutcomes: [
        `Execute standard administrative workflows with 100% compliance`,
        `Apply anomaly detection and dispute handling mechanisms`,
      ],
    },
    {
      id: `block-${course.id}-3`,
      courseId: String(course.id),
      courseTitle: course.title,
      domain,
      blockNumber: 3,
      blockTitle: "Cross-System Integration & Digital Public Infrastructure",
      shortDesc: `Interoperability with Central/State digital platforms (DigiLocker, GeM, PFMS, Bhashini).`,
      durationHours: 3,
      status: "todo",
      importance: "Advanced",
      leftBranches: [
        {
          id: `b-${course.id}-3-l`,
          title: "System Interoperability",
          side: "left",
          items: [
            { id: `item-3-1`, title: "Open API Standards", status: "todo" },
            { id: `item-3-2`, title: "Data Security & DPDP Compliance", status: "todo" },
          ],
        },
      ],
      rightBranches: [
        {
          id: `b-${course.id}-3-r`,
          title: "Field Deployment",
          side: "right",
          items: [
            { id: `item-3-3`, title: "Citizen-Centric Interface", status: "todo" },
            { id: `item-3-4`, title: "Scalability & Resiliency", status: "todo" },
          ],
        },
      ],
      learningOutcomes: [
        `Integrate data pipelines with national infrastructure standards`,
        `Enforce strict data protection and confidentiality mandates`,
      ],
    },
    {
      id: `block-${course.id}-4`,
      courseId: String(course.id),
      courseTitle: course.title,
      domain,
      blockNumber: 4,
      blockTitle: "Practical Case Studies, Auditing & Capstone Assessment",
      shortDesc: `Real-world scenario simulations, forensic audit drills, and certification exam.`,
      durationHours: 2,
      status: "todo",
      importance: "Recommended",
      leftBranches: [
        {
          id: `b-${course.id}-4-l`,
          title: "Simulation & Drills",
          side: "left",
          items: [
            { id: `item-4-1`, title: "Live Scenario Analysis", status: "todo" },
            { id: `item-4-2`, title: "Risk Mitigation Protocol", status: "todo" },
          ],
        },
      ],
      rightBranches: [
        {
          id: `b-${course.id}-4-r`,
          title: "Evaluation & Capstone",
          side: "right",
          items: [
            { id: `item-4-3`, title: "Diagnostic Final MCQ", status: "todo" },
            { id: `item-4-4`, title: "Official iGOT Certification", status: "todo" },
          ],
        },
      ],
      learningOutcomes: [
        `Evaluate complex administrative edge cases and derive actionable decisions`,
        `Attain formal Karmayogi competency credential for career progression`,
      ],
    },
  ];

  return {
    courseId: String(course.id),
    courseTitle: course.title,
    domain,
    overview: course.desc || `Structured capacity-building path for ${course.title}`,
    blocks,
  };
}

/**
 * Use Groq AI to divide any course into roadmap.sh style blocks and sub-branches
 */
export async function generateAIRoadmapForCourse(
  course: IGOTCatalogCourse,
  customFocus?: string
): Promise<FullCourseRoadmapData> {
  const fallback = generateProceduralRoadmapForCourse(course);

  if (!GROQ_API_KEY) {
    return fallback;
  }

  const prompt = `You are an expert curriculum architect for India's iGOT Karmayogi civil service and capacity-building initiative.
Generate a structured, step-by-step Learning Path Roadmap in the style of roadmap.sh for the course:
"${course.title}"
Domain: "${course.domain}"
Course Context: "${(course.desc || "").slice(0, 300)}"
${customFocus ? `Learner Custom Focus: "${customFocus}"` : ""}

Divide this course into 3 to 4 sequential main milestone blocks (like the central spine of roadmap.sh).
For each milestone block, provide:
- blockTitle: concise title of the core topic/module
- shortDesc: 1 sentence summary
- durationHours: estimated hours (1-4)
- leftBranches: 1-2 branch cards to the left side with 2-3 specific sub-concepts/practical tools each
- rightBranches: 1-2 branch cards to the right side with 2-3 specific sub-concepts/rules/metrics each
- learningOutcomes: 2 concrete bullet points

Output strictly valid JSON matching this schema:
{
  "overview": "string",
  "blocks": [
    {
      "blockNumber": 1,
      "blockTitle": "string",
      "shortDesc": "string",
      "durationHours": 3,
      "importance": "Core",
      "leftBranches": [
        {
          "title": "string",
          "items": ["string", "string"]
        }
      ],
      "rightBranches": [
        {
          "title": "string",
          "items": ["string", "string"]
        }
      ],
      "learningOutcomes": ["string", "string"]
    }
  ]
}`;

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 1800,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You generate roadmap.sh style hierarchical curriculum graphs in strictly valid JSON format.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      console.warn("Groq AI Roadmap call failed with status", res.status);
      return fallback;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallback;

    const parsed = JSON.parse(content);
    if (!parsed.blocks || !Array.isArray(parsed.blocks) || parsed.blocks.length === 0) {
      return fallback;
    }

    const blocks: RoadmapCourseBlock[] = parsed.blocks.map((b: any, idx: number) => {
      const blockId = `block-${course.id}-${idx + 1}`;
      const status: "todo" = "todo";

      const leftBranches: RoadmapBranchGroup[] = (b.leftBranches || []).map((lb: any, lIdx: number) => ({
        id: `b-${course.id}-${idx + 1}-l-${lIdx}`,
        title: lb.title || "Core Mechanics",
        side: "left" as const,
        items: (lb.items || []).map((itemText: string, iIdx: number) => ({
          id: `item-${idx + 1}-l-${lIdx}-${iIdx}`,
          title: typeof itemText === "string" ? itemText : (itemText as any)?.title || "Concept",
          status: "todo",
        })),
      }));

      const rightBranches: RoadmapBranchGroup[] = (b.rightBranches || []).map((rb: any, rIdx: number) => ({
        id: `b-${course.id}-${idx + 1}-r-${rIdx}`,
        title: rb.title || "Metrics & Standards",
        side: "right" as const,
        items: (rb.items || []).map((itemText: any, iIdx: number) => ({
          id: `item-${idx + 1}-r-${rIdx}-${iIdx}`,
          title: typeof itemText === "string" ? itemText : (itemText as any)?.title || "Concept",
          status: status,
        })),
      }));

      return {
        id: blockId,
        courseId: String(course.id),
        courseTitle: course.title,
        domain: course.domain,
        blockNumber: b.blockNumber || idx + 1,
        blockTitle: b.blockTitle || `Module ${idx + 1}`,
        shortDesc: b.shortDesc || "",
        durationHours: b.durationHours || 3,
        status: status,
        importance: (b.importance as any) || (idx === 0 ? "Core" : "Advanced"),
        leftBranches,
        rightBranches,
        learningOutcomes: b.learningOutcomes || [],
      };
    });

    return {
      courseId: String(course.id),
      courseTitle: course.title,
      domain: course.domain,
      overview: parsed.overview || course.desc || "",
      blocks,
    };
  } catch (err) {
    console.warn("Error calling Groq for AI roadmap:", err);
    return fallback;
  }
}

/**
 * Ask the Roadmap AI Tutor a question about a specific block or concept
 */
export async function askRoadmapAITutor(params: {
  question: string;
  blockTitle?: string;
  courseTitle?: string;
  domain?: string;
}): Promise<string> {
  const { question, blockTitle = "General Roadmap", courseTitle = "Karmayogi Curriculum", domain = "Public Administration" } = params;

  if (!GROQ_API_KEY) {
    return `In ${domain} and ${courseTitle}, mastering ${blockTitle} requires understanding foundational SOPs, standard regulatory compliance, and periodic field review. Focus on practicing the key workflows and case studies in your module.`;
  }

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              "You are the GyanMarg AI Learning Tutor for iGOT Karmayogi. Give concise (2-4 sentences), highly actionable, encouraging answers that directly explain the student's question in the context of Indian public service, policy, and digital governance standards.",
          },
          {
            role: "user",
            content: `Course: "${courseTitle}" (Domain: ${domain})\nRoadmap Block: "${blockTitle}"\nStudent Question: "${question}"`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return `This concept in ${blockTitle} covers essential operational procedures. Refer to the official curriculum materials or consult the lesson guide.`;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No explanation returned from AI tutor.";
  } catch (err) {
    console.warn("AI Tutor error:", err);
    return `To master ${blockTitle}, focus on practical application of guidelines, verify edge cases, and complete the module practice quiz.`;
  }
}
