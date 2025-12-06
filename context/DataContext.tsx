

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Course, Exam, Task, UserProfile, AcademicInfo, AppSettings, TermSettings, ToastMessage, Assignment } from '../types';
import { COURSES, UPCOMING_EXAMS, TASKS, ASSIGNMENTS } from '../constants';

interface DataContextType {
  courses: Course[];
  exams: Exam[];
  tasks: Task[];
  assignments: Assignment[];
  userProfile: UserProfile;
  academicInfo: AcademicInfo;
  appSettings: AppSettings;
  termSettings: TermSettings;
  toast: ToastMessage | null;
  
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  reorderCourses: (courses: Course[]) => void;
  addExam: (exam: Exam) => void;
  addTask: (task: Task) => void;
  addAssignment: (assignment: Assignment) => void;
  updateTask: (task: Task) => void;
  updateUserProfile: (profile: UserProfile) => void;
  updateAcademicInfo: (info: AcademicInfo) => void;
  updateAppSettings: (settings: AppSettings) => void;
  updateTermSettings: (settings: TermSettings) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [exams, setExams] = useState<Exam[]>(UPCOMING_EXAMS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Student',
    email: 'alex@uni.edu',
    avatar: 'https://picsum.photos/seed/alex/200/200',
    university: 'Tech University'
  });

  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    university: 'Tech University',
    major: 'Computer Science',
    year: '3rd Year',
    gradingSystem: '4.0'
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'system',
    accentColor: '#f97316',
    notifications: {
      email: true,
      examReminders: true,
      taskReminders: false
    },
    backupFrequency: 'weekly',
    lastBackup: '2023-11-01 14:30'
  });

  const [termSettings, setTermSettings] = useState<TermSettings>({
    academicYear: '2023-2024',
    systemType: 'Semester',
    currentTerm: 'Fall 2023',
    startDate: '2023-09-15',
    endDate: '2024-01-15',
    examStartDate: '2024-01-02',
    examEndDate: '2024-01-14',
    defaultView: 'Week'
  });

  const addCourse = (course: Course) => setCourses([...courses, course]);
  
  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const reorderCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
  };

  const addExam = (exam: Exam) => setExams([...exams, exam]);
  const addTask = (task: Task) => setTasks([task, ...tasks]);
  const addAssignment = (assignment: Assignment) => setAssignments([...assignments, assignment]);
  
  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const updateUserProfile = (profile: UserProfile) => setUserProfile(profile);
  const updateAcademicInfo = (info: AcademicInfo) => setAcademicInfo(info);
  const updateAppSettings = (settings: AppSettings) => setAppSettings(settings);
  const updateTermSettings = (settings: TermSettings) => setTermSettings(settings);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(current => current?.id === id ? null : current);
    }, 3000);
  };

  return (
    <DataContext.Provider value={{
      courses, exams, tasks, assignments, userProfile, academicInfo, appSettings, termSettings, toast,
      addCourse, deleteCourse, reorderCourses, addExam, addTask, addAssignment, updateTask, updateUserProfile, updateAcademicInfo, updateAppSettings, updateTermSettings, showToast
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};