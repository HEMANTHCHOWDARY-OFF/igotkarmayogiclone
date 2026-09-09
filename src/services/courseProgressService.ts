/**
 * Centralized Service for Tracking Real Learner Progress across Courses and Lessons
 * Stored persistently in localStorage per user/session.
 * Default for any course is 0% (NOT STARTED) until the learner actually engages.
 */

const STORAGE_KEY = "gyanmarg_course_real_progress_v1";

export interface CourseProgressRecord {
  courseId: string;
  completedLessonIds: (string | number)[];
  totalLessons: number;
  percent: number;
  timeSpentSeconds: number;
  quizScore?: number;
  status: "not_started" | "in_progress" | "completed";
  lastAccessed?: string;
}

export function getAllProgressRecords(): Record<string, CourseProgressRecord> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.warn("Failed to load course progress records:", err);
    return {};
  }
}

export function getCourseProgress(courseId: string | number, totalLessonsCount: number = 6): CourseProgressRecord {
  const idStr = String(courseId);
  const all = getAllProgressRecords();
  if (all[idStr]) {
    return all[idStr];
  }

  // Default: strictly 0% when student hasn't started
  return {
    courseId: idStr,
    completedLessonIds: [],
    totalLessons: totalLessonsCount,
    percent: 0,
    timeSpentSeconds: 0,
    status: "not_started",
  };
}

export function markLessonCompleted(
  courseId: string | number,
  lessonId: string | number,
  totalLessonsCount: number = 6
): CourseProgressRecord {
  const idStr = String(courseId);
  const all = getAllProgressRecords();
  const current = all[idStr] || {
    courseId: idStr,
    completedLessonIds: [],
    totalLessons: totalLessonsCount,
    percent: 0,
    timeSpentSeconds: 0,
    status: "not_started",
  };

  const completedSet = new Set(current.completedLessonIds);
  completedSet.add(lessonId);
  const completedArray = Array.from(completedSet);
  const total = Math.max(totalLessonsCount, completedArray.length);
  const percent = Math.min(100, Math.round((completedArray.length / total) * 100));

  const updated: CourseProgressRecord = {
    ...current,
    completedLessonIds: completedArray,
    totalLessons: total,
    percent,
    status: percent === 100 ? "completed" : "in_progress",
    lastAccessed: new Date().toISOString(),
  };

  all[idStr] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn("Failed to save lesson progress:", err);
  }

  return updated;
}

export function saveQuizScoreForCourse(
  courseId: string | number,
  score: number,
  totalLessonsCount: number = 6
): CourseProgressRecord {
  const idStr = String(courseId);
  const all = getAllProgressRecords();
  const current = all[idStr] || {
    courseId: idStr,
    completedLessonIds: [],
    totalLessons: totalLessonsCount,
    percent: 0,
    timeSpentSeconds: 0,
    status: "not_started",
  };

  const updated: CourseProgressRecord = {
    ...current,
    quizScore: score,
    lastAccessed: new Date().toISOString(),
    status: current.status === "not_started" ? "in_progress" : current.status,
  };

  all[idStr] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn("Failed to save quiz score:", err);
  }

  return updated;
}

export function getCurriculumStats(courseIds: (string | number)[]): {
  totalCourses: number;
  startedCourses: number;
  completedCourses: number;
  overallPercent: number;
  totalStudyHours: number;
} {
  if (courseIds.length === 0) {
    return {
      totalCourses: 0,
      startedCourses: 0,
      completedCourses: 0,
      overallPercent: 0,
      totalStudyHours: 0,
    };
  }

  const all = getAllProgressRecords();
  let totalPercentSum = 0;
  let started = 0;
  let completed = 0;
  let totalSeconds = 0;

  courseIds.forEach((id) => {
    const idStr = String(id);
    const rec = all[idStr];
    if (rec) {
      totalPercentSum += rec.percent;
      totalSeconds += rec.timeSpentSeconds || 0;
      if (rec.percent > 0) started++;
      if (rec.percent >= 100) completed++;
    }
  });

  const overallPercent = Math.round(totalPercentSum / courseIds.length);
  const totalStudyHours = Math.round((totalSeconds / 3600) * 10) / 10;

  return {
    totalCourses: courseIds.length,
    startedCourses: started,
    completedCourses: completed,
    overallPercent,
    totalStudyHours,
  };
}
