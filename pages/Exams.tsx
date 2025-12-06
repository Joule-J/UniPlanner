import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { Exam } from '../types';

export const Exams: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exams, courses, addExam, showToast } = useData();
  const [view, setView] = useState<'List' | 'Calendar'>('List');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examCourseId, setExamCourseId] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examType, setExamType] = useState<Exam['type']>('Midterm');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examLocation, setExamLocation] = useState('');
  const [examWeight, setExamWeight] = useState(20);

  // Date Picker Ref
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
     if (location.state && (location.state as any).openModal) {
        setIsModalOpen(true);
        // Clear state
        window.history.replaceState({}, document.title);
     }
  }, [location]);

  // Sort exams by date (Nearest first)
  const sortedExams = [...exams].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const handleAddExam = () => {
    if (!examCourseId || !examTitle) return;
    const course = courses.find(c => c.id === examCourseId);
    
    const newExam: Exam = {
      id: Date.now().toString(),
      courseId: examCourseId,
      courseName: course ? course.code : 'Unknown',
      title: examTitle,
      type: examType,
      date: `${examDate}T${examTime}:00`,
      time: examTime,
      location: examLocation,
      weight: examWeight,
      difficulty: 'Medium', // Default
      topics: [],
    };
    addExam(newExam);
    setIsModalOpen(false);
    showToast('Sınav başarıyla oluşturuldu.');
  };

  const handleCreateStudyPlan = (examTitle: string) => {
     showToast(`Study Plan for ${examTitle} created!`, 'info');
  };

  return (
    <div className="flex flex-col gap-6">
       {/* Toolbar */}
       <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm">
          <div className="flex gap-2">
             <button 
               onClick={() => setView('List')}
               className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'List' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
             >
               List View
             </button>
             <button 
               onClick={() => { setView('Calendar'); navigate('/calendar'); }}
               className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'Calendar' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
             >
               Calendar View
             </button>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 text-primary-600 font-bold text-sm hover:underline px-2">
               <span className="material-icons-round text-sm">filter_list</span> Filter
             </button>
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-primary-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-orange-200 hover:bg-primary-600"
             >
                + Yeni Sınav
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedExams.map(exam => (
             <div key={exam.id} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden group hover:border-primary-100 hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="material-icons-round text-6xl text-primary-500">event</span>
                </div>
                
                <div className="mb-4">
                   <h5 className="text-xs font-bold text-primary-500 uppercase tracking-wide mb-1">{exam.courseName}</h5>
                   <h3 className="text-xl font-extrabold text-gray-900">{exam.title}</h3>
                </div>

                <div className="space-y-3 mb-6">
                   <div className="flex items-center gap-3">
                      <span className="material-icons-round text-gray-400 text-lg">calendar_today</span>
                      <span className="text-sm font-bold text-gray-700">
                         {new Date(exam.date).toLocaleDateString(undefined, {weekday: 'long', month: 'short', day: 'numeric'})}
                      </span>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="material-icons-round text-gray-400 text-lg">schedule</span>
                      <span className="text-sm font-bold text-gray-700">
                         {new Date(exam.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="material-icons-round text-gray-400 text-lg">location_on</span>
                      <span className="text-sm font-bold text-gray-700">{exam.location}</span>
                   </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50">
                   <button 
                     onClick={() => handleCreateStudyPlan(exam.title)}
                     className="w-full py-3 bg-white border-2 border-primary-100 text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                      <span className="material-icons-round text-sm">school</span>
                      Create Study Plan
                   </button>
                </div>
             </div>
          ))}
       </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Sınav Ekle">
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bağlı Olduğu Ders</label>
               <select 
                  value={examCourseId} 
                  onChange={e => setExamCourseId(e.target.value)} 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold"
               >
                  <option value="">Seçiniz</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sınav Adı</label>
               <input type="text" value={examTitle} onChange={e => setExamTitle(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" placeholder="Midterm 1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarih</label>
                  <div className="relative group">
                     <input 
                        ref={dateInputRef}
                        type="date" 
                        value={examDate} 
                        onChange={e => setExamDate(e.target.value)} 
                        onClick={() => dateInputRef.current?.showPicker?.()}
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
               <button onClick={handleAddExam} className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">Sınavı Oluştur</button>
               <button onClick={() => setIsModalOpen(false)} className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">İptal</button>
            </div>
         </div>
      </Modal>
    </div>
  );
};