
import React, { useState } from 'react';
import { COURSES } from '../constants';
import { CourseType } from '../types';
import { useData } from '../context/DataContext';

export const GPA: React.FC = () => {
  const { showToast } = useData();
  const [courses, setCourses] = useState(COURSES.map(c => ({
    ...c,
    grade: c.averageGrade || 'AA'
  })));

  const gradePoints: Record<string, number> = {
    'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FF': 0.0
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      totalPoints += (gradePoints[c.grade] || 0) * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
  };

  const gpa = calculateGPA();
  const gpaValue = parseFloat(gpa);

  // SVG Gauge Calculations
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Progress calc
  const progress = (gpaValue / 4.0) * 50; 
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
       {/* Calculator */}
       <div className="flex-1 bg-white rounded-[1.5rem] shadow-sm p-8 w-full">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-gray-900">GPA Calculator</h2>
             <button 
                onClick={() => showToast('Transkript içe aktarıldı.', 'success')}
                className="text-primary-600 text-sm font-bold flex items-center gap-1 hover:underline"
             >
                <span className="material-icons-round text-sm">file_download</span> Import Transcript
             </button>
          </div>

          <table className="w-full text-left border-collapse">
             <thead>
                <tr>
                   <th className="py-3 text-xs font-bold text-gray-400 uppercase border-b border-gray-100">Course</th>
                   <th className="py-3 text-xs font-bold text-gray-400 uppercase border-b border-gray-100">Type</th>
                   <th className="py-3 text-xs font-bold text-gray-400 uppercase border-b border-gray-100 text-center">Credit</th>
                   <th className="py-3 text-xs font-bold text-gray-400 uppercase border-b border-gray-100 text-right">Grade</th>
                </tr>
             </thead>
             <tbody>
                {courses.map((course, idx) => (
                   <tr key={course.id} className="group">
                      <td className="py-4 border-b border-gray-50 font-bold text-gray-800">{course.name}</td>
                      <td className="py-4 border-b border-gray-50">
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                            course.type === CourseType.THEORY ? 'bg-orange-100 text-orange-600' : 
                            course.type === CourseType.LAB ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                         }`}>{course.type}</span>
                      </td>
                      <td className="py-4 border-b border-gray-50 text-center font-medium text-gray-600">{course.credits}</td>
                      <td className="py-4 border-b border-gray-50 text-right">
                         <select 
                           className="bg-gray-50 border-none rounded-lg text-sm font-bold text-gray-800 py-1 pl-3 pr-8 focus:ring-2 focus:ring-primary-200 cursor-pointer"
                           value={course.grade}
                           onChange={(e) => {
                             const newCourses = [...courses];
                             newCourses[idx].grade = e.target.value;
                             setCourses(newCourses);
                           }}
                         >
                            {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                         </select>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>

          <button 
             onClick={() => showToast('Ders ekleme modülü açılıyor...', 'info')}
             className="mt-6 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
          >
             <span className="material-icons-round">add</span> Add Course Manually
          </button>
       </div>

       {/* Result Card */}
       <div className="w-full lg:w-96 bg-white rounded-[1.5rem] shadow-sm p-8 flex flex-col items-center sticky top-6">
          <h3 className="text-lg font-bold text-gray-800 mb-8">Estimated GPA</h3>
          
          <div className="relative w-64 h-32 overflow-hidden mb-4">
             {/* Gauge Container */}
             <div className="absolute top-0 left-0 w-full h-64 bg-gray-100 rounded-full"></div>
             {/* The SVG Gauge */}
             <svg
               height={radius * 2}
               width={radius * 2}
               className="absolute top-0 left-1/2 -translate-x-1/2 rotate-[180deg] transform"
             >
               <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#fb923c" />
                     <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
               </defs>
               <circle
                  stroke="url(#gradient)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference} ${circumference}`}
                  style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  strokeLinecap="round"
               />
             </svg>
             
             {/* Text in middle */}
             <div className="absolute bottom-0 left-0 w-full text-center">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">{gpa}</span>
             </div>
          </div>
          
          <p className="text-center text-sm text-gray-500 font-medium mb-8 px-4">
             If you get <strong className="text-gray-900">AA</strong> in Linear Algebra, your term GPA will rise to <strong className="text-green-500">3.52</strong>.
          </p>

          <div className="flex flex-col w-full gap-3">
             <button 
                onClick={() => showToast('Hesaplama kaydedildi.', 'success')}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-300 hover:scale-[1.02] transition-transform"
             >
                Save Calculation
             </button>
             <button 
                onClick={() => showToast('Rapor PDF olarak indiriliyor...', 'info')}
                className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50"
             >
                Download PDF
             </button>
          </div>
       </div>
    </div>
  );
};
