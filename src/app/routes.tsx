import { createBrowserRouter, Navigate } from "react-router";

import PublicLayout   from "@/layouts/PublicLayout";
import StudentLayout  from "@/layouts/StudentLayout";
import AdminLayout    from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Landing              from "@/pages/Landing";
import Login                from "@/pages/Login";
import Register             from "@/pages/Register";
import Onboarding           from "@/pages/Onboarding";

import StudentDashboard     from "@/pages/student/Dashboard";
import InterestedCourses    from "@/pages/student/InterestedCourses";
import SkillProfile         from "@/pages/student/SkillProfile";
import Assessment           from "@/pages/student/Assessment";
import AssessmentResults    from "@/pages/student/AssessmentResults";
import GapAnalysis          from "@/pages/student/GapAnalysis";
import LearningPath         from "@/pages/student/LearningPath";
import CourseDiscovery      from "@/pages/student/CourseDiscovery";
import CourseDetails        from "@/pages/student/CourseDetails";
import LearningInterface    from "@/pages/student/LearningInterface";
import AIMentor             from "@/pages/student/AIMentor";
import Progress             from "@/pages/student/Progress";
import Achievements         from "@/pages/student/Achievements";
import Certificates         from "@/pages/student/Certificates";
import Settings             from "@/pages/student/Settings";

import AdminDashboard         from "@/pages/admin/AdminDashboard";
import StudentManagement      from "@/pages/admin/StudentManagement";
import CompetencyAnalytics    from "@/pages/admin/CompetencyAnalytics";
import CourseManagement       from "@/pages/admin/CourseManagement";
import AssessmentManagement   from "@/pages/admin/AssessmentManagement";
import Reports                from "@/pages/admin/Reports";

export const router = createBrowserRouter([
  {
    Component: PublicLayout,
    children: [
      { path: "/",         Component: Landing    },
      { path: "/login",    Component: Login      },
      { path: "/register", Component: Register   },
      { path: "/onboarding", Component: Onboarding },
    ],
  },
  {
    path: "/student/interested-courses",
    element: (
      <ProtectedRoute requiredRole="student">
        <InterestedCourses />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/assessment/exam",
    element: (
      <ProtectedRoute requiredRole="student" requireOnboarding={true}>
        <Assessment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute requiredRole="student" requireOnboarding={true}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/student/dashboard" replace /> },
      { path: "dashboard",     Component: StudentDashboard  },
      { path: "profile",       Component: SkillProfile      },
      { path: "assessment",    Component: Assessment        },
      { path: "assessment/results", Component: AssessmentResults },
      { path: "gap-analysis",  Component: GapAnalysis       },
      { path: "learning-path", Component: LearningPath      },
      { path: "courses",       Component: CourseDiscovery   },
      { path: "courses/:id",   Component: CourseDetails     },
      { path: "courses/:id/learn", Component: LearningInterface },
      { path: "progress",      Component: Progress          },
      { path: "achievements",  Component: Achievements      },
      { path: "ai-mentor",     element: <Navigate to="/student/dashboard" replace /> },
      { path: "certificates",  element: <Navigate to="/student/dashboard" replace /> },
      { path: "settings",      Component: Settings          },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard",   Component: AdminDashboard       },
      { path: "students",    Component: StudentManagement    },
      { path: "analytics",   Component: CompetencyAnalytics  },
      { path: "courses",     Component: CourseManagement     },
      { path: "assessments", Component: AssessmentManagement },
      { path: "reports",     Component: Reports              },
    ],
  },
]);
