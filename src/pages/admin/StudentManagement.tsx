import { useState } from "react";
import { C, FONT } from "@/tokens";
import { exportToExcel, exportToCSV } from "@/utils/exportUtils";

interface Student {
  id: number;
  name: string;
  email: string;
  initials: string;
  track: string; // "University / College", "Civil Services Aspirant", "In-Service Civil Servant", "Data Science & AI", "Working Professional"
  institution: string;
  program: string;
  batchYear: number;
  courses: number;
  completion: number;
  lastActive: string;
  status: "Active" | "Inactive" | "At-Risk";
  enrolledCoursesList: { title: string; progress: number }[];
  competencyScores: { domain: string; score: number }[];
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@iitd.ac.in",
    initials: "AS",
    track: "University / College",
    institution: "IIT Delhi",
    program: "B.Tech Computer Science & Data Analytics",
    batchYear: 2026,
    courses: 5,
    completion: 92,
    lastActive: "Today",
    status: "Active",
    enrolledCoursesList: [
      { title: "Python for Data Science & Machine Learning", progress: 100 },
      { title: "Data-Driven Decision Making & Microdata", progress: 95 },
      { title: "Applied Statistics & Sampling Frameworks", progress: 85 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 92 },
      { domain: "Python & AI", score: 95 },
      { domain: "Database & SQL", score: 90 },
      { domain: "Public Governance", score: 75 },
      { domain: "Ethics", score: 85 },
      { domain: "Finance", score: 70 },
    ],
  },
  {
    id: 2,
    name: "Ananya Iyer",
    email: "ananya.iyer@du.ac.in",
    initials: "AI",
    track: "University / College",
    institution: "Delhi University",
    program: "M.Sc Statistics & Econometrics",
    batchYear: 2025,
    courses: 6,
    completion: 96,
    lastActive: "Today",
    status: "Active",
    enrolledCoursesList: [
      { title: "Advanced Sampling Theory & NSS Estimation", progress: 100 },
      { title: "Statistical Inference & Probability Modeling", progress: 100 },
      { title: "Data-Driven Decision Making", progress: 90 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 98 },
      { domain: "Python & AI", score: 88 },
      { domain: "Database & SQL", score: 85 },
      { domain: "Public Governance", score: 80 },
      { domain: "Ethics", score: 90 },
      { domain: "Finance", score: 86 },
    ],
  },
  {
    id: 3,
    name: "Rohan Verma",
    email: "rohan.verma@upscprep.org",
    initials: "RV",
    track: "Civil Services Aspirant",
    institution: "Jamia Millia Academy",
    program: "Civil Services Examination (IAS/IPS Aspirant)",
    batchYear: 2026,
    courses: 7,
    completion: 88,
    lastActive: "Yesterday",
    status: "Active",
    enrolledCoursesList: [
      { title: "Foundation Course in Governance", progress: 100 },
      { title: "Constitutional Law & Administration", progress: 95 },
      { title: "Ethics & Integrity in Public Service", progress: 90 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 76 },
      { domain: "Python & AI", score: 65 },
      { domain: "Database & SQL", score: 68 },
      { domain: "Public Governance", score: 94 },
      { domain: "Ethics", score: 92 },
      { domain: "Finance", score: 82 },
    ],
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@ias.nic.in",
    initials: "PS",
    track: "In-Service Civil Servant",
    institution: "Ministry of Finance",
    program: "Deputy Secretary (IAS Cadre)",
    batchYear: 2019,
    courses: 8,
    completion: 94,
    lastActive: "Today",
    status: "Active",
    enrolledCoursesList: [
      { title: "Public Finance Management", progress: 100 },
      { title: "Foundation Course in Governance", progress: 95 },
      { title: "Data-Driven Decision Making", progress: 88 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 84 },
      { domain: "Python & AI", score: 72 },
      { domain: "Database & SQL", score: 75 },
      { domain: "Public Governance", score: 94 },
      { domain: "Ethics", score: 90 },
      { domain: "Finance", score: 95 },
    ],
  },
  {
    id: 5,
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@unipune.ac.in",
    initials: "SK",
    track: "Data Science & AI",
    institution: "Pune University",
    program: "M.Tech Artificial Intelligence & Analytics",
    batchYear: 2025,
    courses: 5,
    completion: 90,
    lastActive: "Today",
    status: "Active",
    enrolledCoursesList: [
      { title: "Data-Driven Decision Making", progress: 100 },
      { title: "Applied Machine Learning & Neural Networks", progress: 95 },
      { title: "SQL & Big Data Architecture", progress: 90 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 88 },
      { domain: "Python & AI", score: 96 },
      { domain: "Database & SQL", score: 94 },
      { domain: "Public Governance", score: 70 },
      { domain: "Ethics", score: 82 },
      { domain: "Finance", score: 65 },
    ],
  },
  {
    id: 6,
    name: "Tanmay Deshmukh",
    email: "tanmay.d@annauniv.edu",
    initials: "TD",
    track: "University / College",
    institution: "Anna University",
    program: "B.Tech Information Technology",
    batchYear: 2026,
    courses: 4,
    completion: 82,
    lastActive: "2 days ago",
    status: "Active",
    enrolledCoursesList: [
      { title: "Digital Governance Fundamentals", progress: 100 },
      { title: "Cybersecurity & India Stack", progress: 85 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 78 },
      { domain: "Python & AI", score: 85 },
      { domain: "Database & SQL", score: 88 },
      { domain: "Public Governance", score: 75 },
      { domain: "Ethics", score: 80 },
      { domain: "Finance", score: 62 },
    ],
  },
  {
    id: 7,
    name: "Kavita Rao",
    email: "kavita.rao@mospi.gov.in",
    initials: "KR",
    track: "In-Service Civil Servant",
    institution: "MoSPI",
    program: "Joint Director (ISS Cadre - National Accounts)",
    batchYear: 2017,
    courses: 9,
    completion: 98,
    lastActive: "Today",
    status: "Active",
    enrolledCoursesList: [
      { title: "National Accounts Statistics (SNA 2008)", progress: 100 },
      { title: "Advanced Sampling Theory", progress: 100 },
      { title: "Data-Driven Decision Making", progress: 95 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 98 },
      { domain: "Python & AI", score: 85 },
      { domain: "Database & SQL", score: 88 },
      { domain: "Public Governance", score: 90 },
      { domain: "Ethics", score: 92 },
      { domain: "Finance", score: 96 },
    ],
  },
  {
    id: 8,
    name: "Suresh Nair",
    email: "suresh.nair@aspirant.in",
    initials: "SN",
    track: "Civil Services Aspirant",
    institution: "State Public Service Academy (Kerala)",
    program: "Kerala Administrative Service & UPSC",
    batchYear: 2025,
    courses: 3,
    completion: 45,
    lastActive: "5 days ago",
    status: "At-Risk",
    enrolledCoursesList: [
      { title: "Constitutional Law & Administration", progress: 60 },
      { title: "Policy Analysis & Formulation", progress: 30 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 55 },
      { domain: "Python & AI", score: 45 },
      { domain: "Database & SQL", score: 50 },
      { domain: "Public Governance", score: 68 },
      { domain: "Ethics", score: 70 },
      { domain: "Finance", score: 52 },
    ],
  },
  {
    id: 9,
    name: "Vikram Singh",
    email: "vikram.singh@mha.nic.in",
    initials: "VS",
    track: "In-Service Civil Servant",
    institution: "Ministry of Home",
    program: "Superintendent of Police (IPS Cadre)",
    batchYear: 2022,
    courses: 2,
    completion: 35,
    lastActive: "12 days ago",
    status: "At-Risk",
    enrolledCoursesList: [
      { title: "Ethics & Integrity in Public Service", progress: 50 },
      { title: "Leadership & Change Management", progress: 20 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 52 },
      { domain: "Python & AI", score: 40 },
      { domain: "Database & SQL", score: 45 },
      { domain: "Public Governance", score: 65 },
      { domain: "Ethics", score: 72 },
      { domain: "Finance", score: 50 },
    ],
  },
  {
    id: 10,
    name: "Karthik Raja",
    email: "karthik.r@bhu.ac.in",
    initials: "KR",
    track: "University / College",
    institution: "Banaras Hindu University (BHU)",
    program: "M.Sc Geospatial Science & Remote Sensing",
    batchYear: 2026,
    courses: 4,
    completion: 78,
    lastActive: "Yesterday",
    status: "Active",
    enrolledCoursesList: [
      { title: "GIS & Spatial Analytics in Governance", progress: 95 },
      { title: "Python for Geospatial Data", progress: 80 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 82 },
      { domain: "Python & AI", score: 88 },
      { domain: "Database & SQL", score: 84 },
      { domain: "Public Governance", score: 72 },
      { domain: "Ethics", score: 80 },
      { domain: "Finance", score: 60 },
    ],
  },
  {
    id: 11,
    name: "Meera Patel",
    email: "meera.patel@analytics.org",
    initials: "MP",
    track: "Working Professional",
    institution: "NITI Aayog Policy Cell (Fellowship)",
    program: "Public Policy & Data Analytics Fellow",
    batchYear: 2024,
    courses: 6,
    completion: 86,
    lastActive: "Today",
    status: "Active",
    enrolledCoursesList: [
      { title: "Policy Analysis & Evidence-Based Design", progress: 100 },
      { title: "Data-Driven Decision Making", progress: 90 },
      { title: "Public Finance Management", progress: 75 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 85 },
      { domain: "Python & AI", score: 80 },
      { domain: "Database & SQL", score: 78 },
      { domain: "Public Governance", score: 90 },
      { domain: "Ethics", score: 88 },
      { domain: "Finance", score: 82 },
    ],
  },
  {
    id: 12,
    name: "Arjun Mehta",
    email: "arjun.mehta@alumni.ac.in",
    initials: "AM",
    track: "University / College",
    institution: "Mumbai University",
    program: "B.A Economics & Public Administration",
    batchYear: 2025,
    courses: 1,
    completion: 0,
    lastActive: "28 days ago",
    status: "Inactive",
    enrolledCoursesList: [
      { title: "Foundation Course in Governance", progress: 0 },
    ],
    competencyScores: [
      { domain: "Applied Statistics", score: 45 },
      { domain: "Python & AI", score: 35 },
      { domain: "Database & SQL", score: 40 },
      { domain: "Public Governance", score: 55 },
      { domain: "Ethics", score: 60 },
      { domain: "Finance", score: 42 },
    ],
  },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Active: { bg: "#E6F4EC", color: C.s1 },
  Inactive: { bg: "#EBEBEB", color: "#666" },
  "At-Risk": { bg: "#FDEEE9", color: C.s4 },
};

const TRACK_OPTIONS = [
  "All Learner Tracks",
  "University / College",
  "Civil Services Aspirant",
  "In-Service Civil Servant",
  "Data Science & AI",
  "Working Professional",
];

const INSTITUTION_OPTIONS = [
  "All Institutions",
  "IIT Delhi",
  "Delhi University",
  "Jamia Millia Academy",
  "Ministry of Finance",
  "Pune University",
  "Anna University",
  "MoSPI",
  "Ministry of Home",
  "Banaras Hindu University (BHU)",
  "NITI Aayog Policy Cell",
  "Mumbai University",
];

const BATCH_OPTIONS = ["All Years", "2024", "2025", "2026", "2027"];

const AVAILABLE_COURSES = [
  "Python for Data Science & Machine Learning",
  "Applied Statistics & Sampling Frameworks",
  "Foundation Course in Governance",
  "Data-Driven Decision Making & Microdata",
  "Ethics & Integrity in Public Service",
  "Digital Governance Fundamentals",
  "Public Finance Management",
  "Constitutional Law & Administration",
];

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState("All Learner Tracks");
  const [institution, setInstitution] = useState("All Institutions");
  const [batch, setBatch] = useState("All Years");
  const [selected, setSelected] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<number | null>(null);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [courseToAssign, setCourseToAssign] = useState(AVAILABLE_COURSES[0]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Add Form state
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    track: "University / College",
    institution: "Delhi University",
    program: "B.Sc Statistics & Computer Science",
    batchYear: 2026,
    initialCourse: AVAILABLE_COURSES[0],
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.institution.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.program.toLowerCase().includes(search.toLowerCase());
    const matchTrack = track === "All Learner Tracks" || s.track === track;
    const matchInstitution = institution === "All Institutions" || s.institution === institution;
    const matchBatch = batch === "All Years" || String(s.batchYear) === batch;
    return matchSearch && matchTrack && matchInstitution && matchBatch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = filtered.slice(startIndex, startIndex + pageSize);

  const toggleSelect = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected(selected.length === paginatedStudents.length ? [] : paginatedStudents.map((s) => s.id));

  // Data Formatter for Exports
  const getStudentExportData = (exportList: Student[]) => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Track",
      "Institution / University",
      "Academic Program / Role",
      "Target Year",
      "Courses Enrolled",
      "Completion Rate",
      "Last Active",
      "Status",
    ];
    const rows = exportList.map((s) => [
      s.id,
      s.name,
      s.email,
      s.track,
      s.institution,
      s.program,
      s.batchYear,
      s.courses,
      `${s.completion}%`,
      s.lastActive,
      s.status,
    ]);
    return { headers, rows };
  };

  // CSV Exporter
  const handleExportCSV = (exportList: Student[], fileName: string) => {
    const { headers, rows } = getStudentExportData(exportList);
    exportToCSV(fileName, headers, rows);
    showToast(`Exported ${exportList.length} student & learner records to CSV.`);
  };

  // Excel (.xlsx) Exporter
  const handleExportExcel = (exportList: Student[], fileName: string) => {
    const { headers, rows } = getStudentExportData(exportList);
    exportToExcel(fileName, [
      {
        sheetName: "Learner Roster",
        headers,
        rows,
      },
    ]);
    showToast(`Exported ${exportList.length} student & learner records to Microsoft Excel (.xlsx).`);
  };

  // Add Student Handler
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim()) return;

    const initials = newStudent.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const createdStudent: Student = {
      id: Date.now(),
      name: newStudent.name.trim(),
      email: newStudent.email || `${newStudent.name.toLowerCase().replace(/\s+/g, ".")}@edu.in`,
      initials: initials || "ST",
      track: newStudent.track,
      institution: newStudent.institution,
      program: newStudent.program,
      batchYear: Number(newStudent.batchYear),
      courses: 1,
      completion: 10,
      lastActive: "Just now",
      status: "Active",
      enrolledCoursesList: [{ title: newStudent.initialCourse, progress: 10 }],
      competencyScores: [
        { domain: "Applied Statistics", score: 75 },
        { domain: "Python & AI", score: 70 },
        { domain: "Database & SQL", score: 68 },
        { domain: "Public Governance", score: 65 },
        { domain: "Ethics", score: 75 },
        { domain: "Finance", score: 60 },
      ],
    };

    setStudents([createdStudent, ...students]);
    setShowAddModal(false);
    setNewStudent({
      name: "",
      email: "",
      track: "University / College",
      institution: "Delhi University",
      program: "B.Sc Statistics & Computer Science",
      batchYear: 2026,
      initialCourse: AVAILABLE_COURSES[0],
    });
    showToast(`Learner ${createdStudent.name} registered successfully.`);
  };

  // Edit Student Handler
  const handleSaveEdit = () => {
    if (!editingStudent) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === editingStudent.id ? { ...editingStudent } : s))
    );
    showToast(`Updated profile for ${editingStudent.name}.`);
    setEditingStudent(null);
  };

  // Delete Student Handler
  const handleDeleteStudent = () => {
    if (deletingStudentId === null) return;
    setStudents((prev) => prev.filter((s) => s.id !== deletingStudentId));
    setSelected((prev) => prev.filter((id) => id !== deletingStudentId));
    showToast(`Student profile successfully removed.`);
    setDeletingStudentId(null);
  };

  // Bulk Course Assignment
  const handleBulkAssignCourse = () => {
    if (selected.length === 0) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (selected.includes(s.id)) {
          const alreadyEnrolled = s.enrolledCoursesList.some((c) => c.title === courseToAssign);
          const updatedCourses = alreadyEnrolled
            ? s.enrolledCoursesList
            : [...s.enrolledCoursesList, { title: courseToAssign, progress: 0 }];
          return {
            ...s,
            courses: updatedCourses.length,
            enrolledCoursesList: updatedCourses,
          };
        }
        return s;
      })
    );
    showToast(`Enrolled ${selected.length} student(s) into "${courseToAssign}".`);
    setShowBulkAssignModal(false);
    setSelected([]);
  };

  // Bulk Status Update
  const handleBulkStatusChange = (status: "Active" | "Inactive" | "At-Risk") => {
    setStudents((prev) =>
      prev.map((s) => (selected.includes(s.id) ? { ...s, status } : s))
    );
    showToast(`Set status to "${status}" for ${selected.length} student(s).`);
    setSelected([]);
  };

  const inputStyle = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: FONT.body,
    color: C.dark,
    outline: "none",
  };

  return (
    <div style={{ fontFamily: FONT.body, color: C.dark, position: "relative" }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 99999,
            background: C.dark,
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span style={{ color: C.s1, fontSize: 16 }}>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, margin: 0 }}>
            Student & Learner Management
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>
            Universal management covering {students.length} students across Higher Education, Civil Services Aspirants & Public Administration
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: C.accent,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontFamily: FONT.body,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>+ Add Student / Learner</span>
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Active Enrolled Learners", value: students.filter((s) => s.status === "Active").length.toString(), color: C.s1 },
          { label: "Inactive / Paused Scholars", value: students.filter((s) => s.status === "Inactive").length.toString(), color: C.faint },
          { label: "At-Risk (Intervention Needed)", value: students.filter((s) => s.status === "At-Risk").length.toString(), color: C.s4 },
        ].map((s) => (
          <div key={s.label} style={{ background: C.surface, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: `1px solid ${C.border}` }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT.display, color: C.dark }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <input
          style={{ ...inputStyle, width: 240 }}
          placeholder="Search student, college, email, degree..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          style={inputStyle}
          value={track}
          onChange={(e) => {
            setTrack(e.target.value);
            setCurrentPage(1);
          }}
        >
          {TRACK_OPTIONS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          style={inputStyle}
          value={institution}
          onChange={(e) => {
            setInstitution(e.target.value);
            setCurrentPage(1);
          }}
        >
          {INSTITUTION_OPTIONS.map((inst) => (
            <option key={inst}>{inst}</option>
          ))}
        </select>
        <select
          style={inputStyle}
          value={batch}
          onChange={(e) => {
            setBatch(e.target.value);
            setCurrentPage(1);
          }}
        >
          {BATCH_OPTIONS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <button
          onClick={() => setShowReportModal(true)}
          style={{
            marginLeft: "auto",
            background: C.accent,
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontSize: 13,
            fontFamily: FONT.body,
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>⚡</span> Generate Report ({filtered.length})
        </button>
      </div>

      {/* Bulk action toolbar */}
      {selected.length > 0 && (
        <div style={{ background: C.dark, color: "#fff", borderRadius: 8, padding: "10px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{selected.length} student(s) selected</span>
          <button
            onClick={() => setShowBulkAssignModal(true)}
            style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: FONT.body, fontWeight: 600 }}
          >
            Assign Course
          </button>
          <button
            onClick={() => handleBulkStatusChange("Active")}
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
          >
            Mark Active
          </button>
          <button
            onClick={() => handleBulkStatusChange("At-Risk")}
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
          >
            Mark At-Risk
          </button>
          <button
            onClick={() => {
              const selectedStudents = students.filter((s) => selected.includes(s.id));
              handleExportCSV(selectedStudents, "selected_students.csv");
            }}
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
          >
            Export Selected
          </button>
          <button
            style={{ background: "transparent", color: "#aaa", border: "none", fontSize: 13, cursor: "pointer", marginLeft: "auto" }}
            onClick={() => setSelected([])}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: C.surface, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", border: `1px solid ${C.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              <th style={{ width: 40, padding: "12px 14px" }}>
                <input
                  type="checkbox"
                  checked={paginatedStudents.length > 0 && selected.length === paginatedStudents.length}
                  onChange={toggleAll}
                />
              </th>
              {["Student / Scholar", "Learner Track", "Institution / University", "Program / Focus", "Year", "Courses", "Avg Progress", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: "32px", textAlign: "center", color: C.muted, fontSize: 14 }}>
                  No learners found matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((s, i) => (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: i < paginatedStudents.length - 1 ? `1px solid ${C.border}` : "none",
                    background: selected.includes(s.id) ? "#F0EDE4" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected.includes(s.id)) e.currentTarget.style.background = "#FAF8F4";
                  }}
                  onMouseLeave={(e) => {
                    if (!selected.includes(s.id)) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: C.dark,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {s.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        background:
                          s.track === "University / College"
                            ? "#E8F0FE"
                            : s.track === "Civil Services Aspirant"
                            ? "#FEF5E7"
                            : s.track === "In-Service Civil Servant"
                            ? "#E6F4EC"
                            : "#F3EDE0",
                        color:
                          s.track === "University / College"
                            ? "#1A56DB"
                            : s.track === "Civil Services Aspirant"
                            ? C.s2
                            : s.track === "In-Service Civil Servant"
                            ? C.s1
                            : C.dark,
                        borderRadius: 6,
                        padding: "3px 8px",
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.track}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 500 }}>{s.institution}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: C.muted, maxWidth: 200 }}>
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.program}</div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13 }}>{s.batchYear}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600 }}>{s.courses}</td>
                  <td style={{ padding: "12px 14px", minWidth: 120 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${s.completion}%`,
                            background: s.completion >= 80 ? C.s1 : s.completion >= 50 ? C.s2 : C.s4,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 11, color: C.muted }}>{s.completion}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ ...STATUS_COLORS[s.status], padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => setViewingStudent(s)}
                        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.dark, cursor: "pointer", fontFamily: FONT.body }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => setEditingStudent(s)}
                        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.dark, cursor: "pointer", fontFamily: FONT.body }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingStudentId(s.id)}
                        style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, color: C.s4, cursor: "pointer", fontFamily: FONT.body }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Working Pagination */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 13, color: C.muted }}>
            Showing {filtered.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} students & scholars
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                background: "transparent",
                color: currentPage <= 1 ? C.border : C.dark,
                padding: "6px 12px",
                fontSize: 12,
                cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  width: 32,
                  height: 32,
                  border: `1px solid ${p === currentPage ? C.dark : C.border}`,
                  borderRadius: 6,
                  background: p === currentPage ? C.dark : "transparent",
                  color: p === currentPage ? "#fff" : C.muted,
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: p === currentPage ? 700 : 400,
                }}
              >
                {p}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                background: "transparent",
                color: currentPage >= totalPages ? C.border : C.dark,
                padding: "6px 12px",
                fontSize: 12,
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Add Student Modal ────────────────────────────────────────── */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 580,
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0, color: C.dark }}>
                Register Student / Scholar
              </h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 6 }}>Full Name *</label>
                  <input
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 6 }}>Learner Track / Category *</label>
                  <select
                    value={newStudent.track}
                    onChange={(e) => setNewStudent({ ...newStudent, track: e.target.value })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    {TRACK_OPTIONS.filter((t) => t !== "All Learner Tracks").map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 6 }}>Academic / Target Year *</label>
                  <select
                    value={newStudent.batchYear}
                    onChange={(e) => setNewStudent({ ...newStudent, batchYear: Number(e.target.value) })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    {BATCH_OPTIONS.filter((b) => b !== "All Years").map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 6 }}>Institution / College / Department *</label>
                  <input
                    required
                    placeholder="e.g. IIT Delhi or Delhi University or MoSPI"
                    value={newStudent.institution}
                    onChange={(e) => setNewStudent({ ...newStudent, institution: e.target.value })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 6 }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 6 }}>Program / Degree / Specialization</label>
                  <input
                    placeholder="e.g. B.Tech Computer Science"
                    value={newStudent.program}
                    onChange={(e) => setNewStudent({ ...newStudent, program: e.target.value })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 6 }}>Initial Course Assignment</label>
                  <select
                    value={newStudent.initialCourse}
                    onChange={(e) => setNewStudent({ ...newStudent, initialCourse: e.target.value })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  >
                    {AVAILABLE_COURSES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 18px", fontSize: 13, color: C.muted, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Student Dossier Modal ────────────────────────────────── */}
      {viewingStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setViewingStudent(null)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 640,
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>
                  {viewingStudent.initials}
                </div>
                <div>
                  <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0, color: C.dark }}>
                    {viewingStudent.name}
                  </h2>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    {viewingStudent.track} · {viewingStudent.institution} · Target {viewingStudent.batchYear}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewingStudent(null)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "24px", overflowY: "auto" }}>
              {/* Profile Details */}
              <div style={{ background: C.bg, borderRadius: 10, padding: "16px", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                  <div>
                    <span style={{ color: C.muted }}>Program / Specialization:</span> <strong>{viewingStudent.program}</strong>
                  </div>
                  <div>
                    <span style={{ color: C.muted }}>Status:</span>{" "}
                    <span style={{ ...STATUS_COLORS[viewingStudent.status], padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                      {viewingStudent.status}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: C.muted }}>Email:</span> <strong>{viewingStudent.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: C.muted }}>Overall Progress:</span> <strong>{viewingStudent.completion}%</strong>
                  </div>
                </div>
              </div>

              {/* Multi-Domain Competency Scores */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 12 }}>
                  Demonstrated Competency Profile (Academic & Applied)
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {viewingStudent.competencyScores.map((c) => (
                    <div key={c.domain} style={{ background: C.bg, borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                        <span style={{ fontWeight: 600 }}>{c.domain}</span>
                        <span style={{ color: c.score >= 80 ? C.s1 : c.score >= 60 ? C.s2 : C.s4, fontWeight: 700 }}>{c.score}%</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: C.border, overflow: "hidden" }}>
                        <div style={{ width: `${c.score}%`, height: "100%", background: c.score >= 80 ? C.s1 : c.score >= 60 ? C.s2 : C.s4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enrolled Courses */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 12 }}>Enrolled Courses & Active Modules</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {viewingStudent.enrolledCoursesList.map((c) => (
                    <div key={c.title} style={{ background: C.bg, padding: "10px 14px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{c.title}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: c.progress === 100 ? C.s1 : C.muted }}>
                        {c.progress === 100 ? "Completed (100%)" : `${c.progress}% in-progress`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", background: C.bg, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => {
                  setEditingStudent(viewingStudent);
                  setViewingStudent(null);
                }}
                style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, color: C.dark, cursor: "pointer" }}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setViewingStudent(null)}
                style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Student Modal ────────────────────────────────────────── */}
      {editingStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setEditingStudent(null)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 540,
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0, color: C.dark }}>
                Edit Learner Details
              </h2>
              <button onClick={() => setEditingStudent(null)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Full Name</label>
                  <input
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Learner Track</label>
                    <select
                      value={editingStudent.track}
                      onChange={(e) => setEditingStudent({ ...editingStudent, track: e.target.value })}
                      style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                    >
                      {TRACK_OPTIONS.filter((t) => t !== "All Learner Tracks").map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Year / Batch</label>
                    <input
                      type="number"
                      value={editingStudent.batchYear}
                      onChange={(e) => setEditingStudent({ ...editingStudent, batchYear: Number(e.target.value) })}
                      style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Institution / College / Dept</label>
                  <input
                    value={editingStudent.institution}
                    onChange={(e) => setEditingStudent({ ...editingStudent, institution: e.target.value })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Program / Role</label>
                  <input
                    value={editingStudent.program}
                    onChange={(e) => setEditingStudent({ ...editingStudent, program: e.target.value })}
                    style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Status</label>
                    <select
                      value={editingStudent.status}
                      onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                      style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                    >
                      <option value="Active">Active</option>
                      <option value="At-Risk">At-Risk</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 4 }}>Avg Completion (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingStudent.completion}
                      onChange={(e) => setEditingStudent({ ...editingStudent, completion: Number(e.target.value) })}
                      style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
                <button
                  onClick={() => setEditingStudent(null)}
                  style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 18px", fontSize: 13, color: C.muted, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{ background: C.s1, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────── */}
      {deletingStudentId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setDeletingStudentId(null)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 420,
              padding: "24px",
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: C.dark, marginBottom: 8 }}>Remove Student Record?</div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, margin: "0 0 20px" }}>
              Are you sure you want to remove this learner from the roster? This action will archive their course enrollments and diagnostic progress.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setDeletingStudentId(null)}
                style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, color: C.muted, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                style={{ background: C.s4, color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Course Assign Modal ─────────────────────────────────── */}
      {showBulkAssignModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 24, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowBulkAssignModal(false)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 14,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, margin: 0, color: C.dark }}>
                Bulk Course Enrollment
              </h2>
              <button onClick={() => setShowBulkAssignModal(false)} style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>
                Enroll the {selected.length} selected student(s) into a standard curriculum module:
              </div>
              <select
                value={courseToAssign}
                onChange={(e) => setCourseToAssign(e.target.value)}
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: 20 }}
              >
                {AVAILABLE_COURSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setShowBulkAssignModal(false)}
                  style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 18px", fontSize: 13, color: C.muted, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAssignCourse}
                  style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Enroll Selected Cohort
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Format Modal (Excel & CSV) */}
      {showReportModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,35,24,0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowReportModal(false)}
        >
          <div
            style={{
              background: C.surface,
              borderRadius: 16,
              width: "100%",
              maxWidth: 460,
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, margin: 0, color: C.dark }}>
                  Generate Report
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>
                  Extracting roster for {filtered.length} active students
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ fontSize: 13, color: C.dark, fontWeight: 600, marginBottom: 16 }}>
                Select extraction format:
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                {/* Excel Option */}
                <div
                  onClick={() => {
                    handleExportExcel(filtered, "universal_student_roster.xlsx");
                    setShowReportModal(false);
                  }}
                  style={{
                    border: `2px solid ${C.s1}`,
                    borderRadius: 12,
                    padding: "20px 16px",
                    cursor: "pointer",
                    background: "#F2FBF6",
                    textAlign: "center",
                    position: "relative",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,107,66,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: C.s1,
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 10,
                    }}
                  >
                    Recommended
                  </span>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>📗</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.dark }}>Excel</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4, lineHeight: 1.3 }}>
                    Microsoft Excel (.xlsx) workbook
                  </div>
                </div>

                {/* CSV Option */}
                <div
                  onClick={() => {
                    handleExportCSV(filtered, "universal_student_roster.csv");
                    setShowReportModal(false);
                  }}
                  style={{
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "20px 16px",
                    cursor: "pointer",
                    background: C.bg,
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.accent;
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(198,133,27,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.background = C.bg;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 6 }}>📊</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.dark }}>CSV</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4, lineHeight: 1.3 }}>
                    Standard Comma Separated (.csv)
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 24px", background: C.bg, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowReportModal(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontFamily: FONT.body,
                  color: C.muted,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
