

export enum CourseType {
  THEORY = 'Theory',
  LAB = 'Lab',
  PROJECT = 'Project'
}

export interface WeeklyScheduleItem {
  day: string; // 'Mon', 'Tue', etc.
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  location?: string;
}

export interface GradingWeights {
  quiz?: number;
  midterm?: number;
  final?: number;
  project?: number;
  lab?: number;
  assignment?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  ects?: number;
  instructor: string;
  avatar: string; // URL
  type: CourseType;
  section: number;
  attendance: number; // Percentage
  attendanceRequired?: number;
  averageGrade?: string; // e.g., 'AA', 'BA'
  term?: string;
  weeklySchedule: WeeklyScheduleItem[];
  gradingWeights?: GradingWeights;
  description?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate: string; // ISO Date
  format?: 'PDF' | 'DOCX' | 'ZIP' | 'Link';
  status: 'Pending' | 'Submitted' | 'Graded';
  linkedTaskId?: string;
}

export interface Exam {
  id: string;
  courseId: string;
  courseName: string;
  title: string; // "Midterm", "Final", "Quiz 1"
  type: 'Quiz' | 'Midterm' | 'Final' | 'Lab Exam' | 'Other';
  date: string; // ISO String
  time?: string;
  location: string;
  difficulty: 'Easy' | 'Medium' | 'Hard'; // AI Predicted
  topics: string[];
  weight: number; // Percentage
  grade?: string;
  note?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  courseId?: string; // Optional linkage
  status: 'Todo' | 'InProgress' | 'Done';
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  points: number;
  completedDate?: string;
  category?: string;
  // Progress removed as requested
}

export interface GPACourseInput {
  id: string;
  name: string;
  credits: number;
  grade: string; // AA, BA, etc.
  type: CourseType;
}

export interface Activity {
  id: string;
  title: string;
  timestamp: string;
  type: 'exam' | 'grade' | 'task';
}

// Settings Interfaces
export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  university: string;
}

export interface AcademicInfo {
  university: string;
  major: string;
  year: string;
  gradingSystem: '4.0' | '100';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  notifications: {
    email: boolean;
    examReminders: boolean;
    taskReminders: boolean;
  };
  backupFrequency?: 'daily' | 'weekly' | 'manual';
  lastBackup?: string;
}

export interface TermSettings {
  academicYear: string; 
  systemType: 'Semester' | 'Trimester' | 'Quarter'; // New Field
  currentTerm: string;
  startDate: string;
  endDate: string;
  examStartDate?: string; // New Field
  examEndDate?: string; // New Field
  defaultView: 'Today' | 'Week' | 'Month';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}