import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CourseType, Exam, Assignment } from '../types';
import { Modal } from '../components/Modal';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, exams, assignments, addExam, addAssignment, addTask, showToast } = useData();
  const course = courses.find(c => c.id === id);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  // Exam Modal State
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [examType, setExamType] = useState<Exam['type']>('Midterm');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examLocation, setExamLocation] = useState('');
  const [examWeight, setExamWeight] = useState(20);

  // Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignFormat, setAssignFormat] = useState<Assignment['format']>('PDF');
  const [createTask, setCreateTask] = useState(true);

  // Refs
  const examDateRef = useRef<HTMLInputElement>(null);
  const assignDateRef = useRef<HTMLInputElement>(null);

  if (!course) return <div className="p-8 font-bold text-center text-gray-500">Course not found</div>;

  const handleAddExam = () => {
    if (!examTitle) return;
    const newExam: Exam = {
      id: Date.now().toString(),
      courseId: course.id,
      courseName: course.code,
      title: examTitle,
      type: examType,
      date: `${examDate}T${examTime}:00`,
      time: examTime,
      location: examLocation,
      weight: examWeight,
      difficulty: 'Medium',
      topics: [],
    };
    addExam(newExam);
    setIsExamModalOpen(false);
    showToast('Sınav başarıyla oluşturuldu.', 'success');
  };

  const handleAddAssignment = () => {
     if (!assignTitle || !assignDueDate) return;
     const newAssign: Assignment = {
        id: Date.now().toString(),
        courseId: course.id,
        title: assignTitle,
        description: assignDesc,
        dueDate: assignDueDate,
        status: 'Pending',
        format: assignFormat
     };
     addAssignment(newAssign);

     if (createTask) {
        addTask({
           id: `task-${Date.now()}`,
           title: assignTitle,
           description: assignDesc,
           courseId: course.id,
           status: 'Todo',
           dueDate: assignDueDate,
           priority: 'High',
           points: 30
        });
        showToast('Assignment and Task created!', 'success');
     } else {
        showToast('Assignment created!', 'success');
     }
     setIsAssignModalOpen(false);
  };

  const courseExams = exams.filter(e => e.courseId === course.id);
  const courseAssignments = assignments.filter(a => a.courseId === course.id);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <button onClick={() => navigate('/courses')} className="flex items-center gap-1 text-gray-400 text-xs font-bold hover:text-gray-600 mb-2">
               <span className="material-icons-round text-sm">arrow_back</span> Back to Courses
            </button>
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-extrabold text-gray-900">{course.name}</h1>
               <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-bold uppercase">{course.type}</span>
            </div>
            <p className="text-gray-500 font-medium">{course.code} • {course.credits} Credits</p>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 bg-white rounded-full shadow-sm border border-gray-100 transition-colors ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            >
               <span className="material-icons-round">{isFavorite ? 'star' : 'star_border'}</span>
            </button>
            <button 
               onClick={() => setIsExamModalOpen(true)}
               className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-200 hover:bg-primary-600 flex items-center gap-2 active:scale-95 transition-all"
            >
               <span className="material-icons-round text-sm">add</span> Sınav Ekle
            </button>
         </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
         <div className="flex gap-6 overflow-x-auto">
            {['overview', 'exams', 'assignments', 'projects', 'labs'].map(tab => {
               if (tab === 'labs' && course.type !== CourseType.LAB) return null;
               if (tab === 'projects' && course.type !== CourseType.PROJECT) return null;
               
               return (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`pb-3 text-sm font-bold capitalize transition-colors relative whitespace-nowrap ${
                        activeTab === tab ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                     }`}
                  >
                     {tab}
                     {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full"></div>}
                  </button>
               )
            })}
         </div>
      </div>

      {/* Content Area */}
      <div className="mt-2">
         {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                  {/* General Info Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-primary-100 transition-colors">
                     <h3 className="font-bold text-lg mb-4">Course Info</h3>
                     <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                           <span className="block text-gray-400 text-xs font-bold uppercase">Instructor</span>
                           <div className="flex items-center gap-2 mt-1">
                              <img src={course.avatar} className="w-6 h-6 rounded-full" alt="avatar" />
                              <span className="font-bold text-gray-800">{course.instructor}</span>
                           </div>
                        </div>
                        <div>
                           <span className="block text-gray-400 text-xs font-bold uppercase">Email</span>
                           <a href={`mailto:instructor@uni.edu`} className="font-bold text-primary-600 mt-1 block cursor-pointer hover:underline">contact@university.edu</a>
                        </div>
                     </div>
                  </div>

                  {/* Weekly Schedule Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Weekly Schedule</h3>
                        <span className="text-xs text-gray-400 font-medium">Synced with Calendar</span>
                     </div>
                     <div className="space-y-3">
                        {course.weeklySchedule && course.weeklySchedule.length > 0 ? (
                           course.weeklySchedule.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                 <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex flex-col items-center justify-center">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{item.day}</span>
                                    <span className="material-icons-round text-primary-500 text-sm">schedule</span>
                                 </div>
                                 <div className="flex-1">
                                    <p className="font-bold text-gray-800">{item.startTime} - {item.endTime}</p>
                                    <p className="text-xs text-gray-500">{item.location || 'Location TBA'}</p>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <p className="text-sm text-gray-400 italic">No weekly schedule set.</p>
                        )}
                     </div>
                  </div>
                  
                  {/* Desc */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                     <h3 className="font-bold text-lg mb-4">Description</h3>
                     <p className="text-gray-600 leading-relaxed text-sm">
                        {course.description || 'No description available.'}
                     </p>
                  </div>
               </div>

               <div className="space-y-6">
                  {/* Grade Distribution */}
                   <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                     <h3 className="font-bold text-lg mb-4">Grade Weight</h3>
                     <div className="space-y-4">
                        {course.gradingWeights ? (
                           Object.entries(course.gradingWeights).map(([key, value]) => (
                              value > 0 && (
                                 <div key={key}>
                                    <div className="flex justify-between text-sm font-bold text-gray-600 capitalize"><span>{key}</span><span>{value}%</span></div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                       <div className="bg-primary-500 h-full rounded-full" style={{ width: `${value}%` }}></div>
                                    </div>
                                 </div>
                              )
                           ))
                        ) : (
                           <p className="text-sm text-gray-400">Grading weights not set.</p>
                        )}
                     </div>
                   </div>
               </div>
            </div>
         )}
         
         {activeTab === 'exams' && (
             <div className="grid grid-cols-1 gap-4">
               {courseExams.length > 0 ? (
                  courseExams.map(exam => (
                     <div key={exam.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                           <h4 className="font-bold text-gray-900 text-lg">{exam.title}</h4>
                           <p className="text-gray-500 text-sm">{new Date(exam.date).toLocaleDateString()} • {exam.location}</p>
                           <div className="flex gap-2 mt-2">
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-md text-xs font-bold">{exam.difficulty}</span>
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-bold">{exam.weight}% Weight</span>
                           </div>
                        </div>
                        <button 
                           onClick={() => alert(`Edit Exam: ${exam.title}`)}
                           className="px-4 py-2 bg-gray-50 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors"
                        >
                           Edit
                        </button>
                     </div>
                  ))
               ) : (
                  <div className="p-12 text-center text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 border-dashed">No exams scheduled yet.</div>
               )}
             </div>
         )}

         {activeTab === 'assignments' && (
             <div className="space-y-4">
               <div className="flex justify-end">
                  <button 
                     onClick={() => setIsAssignModalOpen(true)}
                     className="px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-gray-800 flex items-center gap-2 transition-colors"
                  >
                     <span className="material-icons-round text-sm">add</span> Add Assignment
                  </button>
               </div>
               {courseAssignments.length > 0 ? (
                  courseAssignments.map(assign => (
                     <div key={assign.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                              assign.format === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                           }`}>
                              {assign.format?.substring(0,3)}
                           </div>
                           <div>
                              <h4 className="font-bold text-gray-900 text-lg">{assign.title}</h4>
                              <p className="text-gray-500 text-sm">Due: {new Date(assign.dueDate).toLocaleDateString()}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block ${
                                 assign.status === 'Submitted' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                              }`}>{assign.status}</span>
                           </div>
                        </div>
                        <button className="px-4 py-2 bg-primary-50 text-primary-600 font-bold text-sm rounded-xl hover:bg-primary-100 transition-colors">
                           Details
                        </button>
                     </div>
                  ))
               ) : (
                  <div className="p-12 text-center text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 border-dashed">
                     No assignments yet.
                  </div>
               )}
             </div>
         )}
         
         {/* Placeholder for other tabs */}
         {['projects', 'labs'].includes(activeTab) && (
            <div className="p-12 text-center text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 border-dashed">
               No {activeTab} available at the moment.
            </div>
         )}
      </div>

      {/* Add Exam Modal */}
      <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title="Bu Ders İçin Sınav Ekle">
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sınav Adı</label>
               <input type="text" value={examTitle} onChange={e => setExamTitle(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" placeholder="Midterm 1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarih</label>
                  <div className="relative group">
                     <input 
                        ref={examDateRef}
                        type="date"
                        value={examDate}
                        onChange={e => setExamDate(e.target.value)} 
                        onClick={() => examDateRef.current?.showPicker?.()}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold pl-10 cursor-pointer" 
                     />
                     <span className="material-icons-round absolute left-3 top-3 text-gray-400 text-sm group-hover:text-primary-500 pointer-events-none">calendar_today</span>
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Saat</label>
                  <input type="time" value={examTime} onChange={e => setExamTime(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yer</label>
                  <input type="text" value={examLocation} onChange={e => setExamLocation(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ağırlık (%)</label>
                  <input type="number" value={examWeight} onChange={e => setExamWeight(Number(e.target.value))} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" />
               </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sınav Türü</label>
               <select 
                  value={examType} 
                  onChange={e => setExamType(e.target.value as any)} 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold"
               >
                  <option value="Midterm">Midterm</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Final">Final</option>
                  <option value="Lab Exam">Lab Exam</option>
               </select>
            </div>
            <div className="flex gap-3 pt-4">
               <button onClick={handleAddExam} className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">Sınavı Kaydet</button>
               <button onClick={() => setIsExamModalOpen(false)} className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">İptal</button>
            </div>
         </div>
      </Modal>

      {/* Add Assignment Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Yeni Ödev Ekle">
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Başlık</label>
               <input type="text" value={assignTitle} onChange={e => setAssignTitle(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" placeholder="Lab Report 1" />
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Açıklama</label>
               <textarea value={assignDesc} onChange={e => setAssignDesc(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold h-20 resize-none" />
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Son Teslim Tarihi</label>
               <div className="relative group">
                   <input 
                    ref={assignDateRef}
                    type="date" 
                    value={assignDueDate} 
                    onChange={e => setAssignDueDate(e.target.value)} 
                    onClick={() => assignDateRef.current?.showPicker?.()}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold pl-10 cursor-pointer" 
                   />
                   <span className="material-icons-round absolute left-3 top-3 text-gray-400 text-sm group-hover:text-primary-500 pointer-events-none">calendar_today</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Format</label>
                  <select value={assignFormat} onChange={e => setAssignFormat(e.target.value as any)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold">
                     <option value="PDF">PDF</option>
                     <option value="DOCX">DOCX</option>
                     <option value="ZIP">ZIP</option>
                  </select>
               </div>
               <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" checked={createTask} onChange={e => setCreateTask(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm font-bold text-gray-600">Görev Olarak Ekle</span>
               </div>
            </div>
            <div className="flex gap-3 pt-4">
               <button onClick={handleAddAssignment} className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">Ödevi Kaydet</button>
               <button onClick={() => setIsAssignModalOpen(false)} className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">İptal</button>
            </div>
         </div>
      </Modal>
    </div>
  );
};