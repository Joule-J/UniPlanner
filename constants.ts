
import { Course, CourseType, Exam, Task, Activity, Assignment } from './types';

export const COURSES: Course[] = [
  {
    id: '1',
    code: 'CS 101',
    name: 'Intro to Programming',
    credits: 4,
    instructor: 'Dr. Sarah Connor',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    type: CourseType.THEORY,
    section: 1,
    attendance: 85,
    averageGrade: 'AA',
    weeklySchedule: [
      { day: 'Mon', startTime: '09:00', endTime: '11:00', location: 'Room 204' },
      { day: 'Wed', startTime: '09:00', endTime: '10:00', location: 'Room 204' }
    ],
    gradingWeights: { midterm: 30, final: 40, quiz: 20, assignment: 10 }
  },
  {
    id: '2',
    code: 'PHY 202',
    name: 'Physics II',
    credits: 4,
    instructor: 'Prof. Sheldon C.',
    avatar: 'https://picsum.photos/seed/sheldon/100/100',
    type: CourseType.LAB,
    section: 2,
    attendance: 92,
    averageGrade: 'BA',
    weeklySchedule: [
       { day: 'Tue', startTime: '14:00', endTime: '16:00', location: 'Lab Complex B' }
    ],
    gradingWeights: { lab: 40, midterm: 25, final: 35 }
  },
  {
    id: '3',
    code: 'DES 300',
    name: 'UI/UX Design',
    credits: 3,
    instructor: 'Ms. Ada Lovelace',
    avatar: 'https://picsum.photos/seed/ada/100/100',
    type: CourseType.PROJECT,
    section: 1,
    attendance: 78,
    averageGrade: 'BB',
    weeklySchedule: [
       { day: 'Wed', startTime: '10:00', endTime: '13:00', location: 'Design Studio' }
    ],
    gradingWeights: { project: 60, assignment: 20, quiz: 20 }
  },
  {
    id: '4',
    code: 'MAT 201',
    name: 'Linear Algebra',
    credits: 3,
    instructor: 'Dr. John Nash',
    avatar: 'https://picsum.photos/seed/nash/100/100',
    type: CourseType.THEORY,
    section: 1,
    attendance: 60,
    averageGrade: 'CB',
    weeklySchedule: [
       { day: 'Thu', startTime: '09:00', endTime: '11:00', location: 'Hall A' }
    ],
    gradingWeights: { midterm: 40, final: 60 }
  }
];

export const UPCOMING_EXAMS: Exam[] = [
  {
    id: 'e1',
    courseId: '1',
    courseName: 'CS 101',
    title: 'Midterm Exam',
    date: '2023-11-15T10:00:00',
    location: 'Bldg A - Room 204',
    difficulty: 'Medium',
    topics: ['Loops', 'Arrays', 'Pointers'],
    weight: 30,
    type: 'Midterm'
  },
  {
    id: 'e2',
    courseId: '2',
    courseName: 'PHY 202',
    title: 'Lab Final',
    date: '2023-11-20T14:00:00',
    location: 'Lab Complex B',
    difficulty: 'Hard',
    topics: ['Optics', 'Electromagnetism'],
    weight: 40,
    type: 'Final'
  }
];

export const ASSIGNMENTS: Assignment[] = [
   {
      id: 'a1',
      courseId: '3',
      title: 'Wireframe Prototype',
      description: 'Create low-fidelity wireframes for the mobile app.',
      dueDate: '2023-11-10',
      status: 'Pending',
      format: 'PDF'
   },
   {
      id: 'a2',
      courseId: '1',
      title: 'Algorithm Analysis Paper',
      description: 'Analyze sorting algorithms complexity.',
      dueDate: '2023-11-25',
      status: 'Submitted',
      format: 'DOCX'
   }
];

export const RECENT_ACTIVITIES: Activity[] = [
  { id: 'a1', title: 'Math II - Midterm grade announced', timestamp: '2 hours ago', type: 'grade' },
  { id: 'a2', title: 'Physics Lab Report submitted', timestamp: '5 hours ago', type: 'task' },
  { id: 'a3', title: 'CS 101 - Quiz 2 added', timestamp: '1 day ago', type: 'exam' },
];

export const TASKS: Task[] = [
  { id: 't1', title: 'Finish UI Prototype', courseId: '3', status: 'InProgress', dueDate: '2023-11-10', priority: 'High', points: 50 },
  { id: 't2', title: 'Read Chapter 4', courseId: '1', status: 'Todo', dueDate: '2023-11-12', priority: 'Low', points: 20 },
  { id: 't3', title: 'Lab Report 3', courseId: '2', status: 'Done', dueDate: '2023-11-01', priority: 'Medium', points: 30 },
];

export const WEEK_DAYS = [
  { day: 'Mon', date: '12' },
  { day: 'Tue', date: '13' },
  { day: 'Wed', date: '14' },
  { day: 'Thu', date: '15' },
  { day: 'Fri', date: '16' },
  { day: 'Sat', date: '17' },
  { day: 'Sun', date: '18' },
];
