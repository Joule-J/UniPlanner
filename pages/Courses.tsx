
import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { CourseType, Course, WeeklyScheduleItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/Modal';

export const Courses: React.FC = () => {
  const navigate = useNavigate();
  const { courses, addCourse, deleteCourse, reorderCourses, showToast } = useData();
  const [filter, setFilter] = useState<'All' | 'Mandatory' | 'Elective' | 'With Labs'>('All');
  const [term, setTerm] = useState('Fall 2023');

  // Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Drag and Drop Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseSection, setNewCourseSection] = useState(1);
  const [newCourseType, setNewCourseType] = useState<CourseType>(CourseType.THEORY);
  const [newCourseDesc, setNewCourseDesc] = useState('');
  
  // Schedule Builder State
  const [scheduleRows, setScheduleRows] = useState<WeeklyScheduleItem[]>([
     { day: 'Mon', startTime: '09:00', endTime: '10:50', location: '' }
  ]);

  // Grading Weights State
  const [gradingWeights, setGradingWeights] = useState({
     midterm: 30,
     final: 40,
     quiz: 10,
     project: 20,
     lab: 0,
     assignment: 0
  });

  const getCourseBadgeColor = (type: CourseType) => {
    switch (type) {
      case CourseType.THEORY: return 'bg-orange-100 text-orange-600';
      case CourseType.LAB: return 'bg-blue-100 text-blue-600';
      case CourseType.PROJECT: return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAddCourse = () => {
    if (!newCourseName.trim() || !newCourseCode.trim()) return;
    
    // Filter out incomplete schedule rows
    const validSchedule = scheduleRows.filter(r => r.day && r.startTime && r.endTime);

    const newCourse: Course = {
      id: Date.now().toString(),
      name: newCourseName,
      code: newCourseCode,
      credits: newCourseCredits,
      instructor: newCourseInstructor || 'TBA',
      section: newCourseSection,
      type: newCourseType,
      avatar: `https://picsum.photos/seed/${newCourseCode}/100/100`,
      attendance: 0,
      term: term,
      description: newCourseDesc,
      weeklySchedule: validSchedule,
      gradingWeights: gradingWeights
    };
    addCourse(newCourse);
    setIsModalOpen(false);
    showToast(`${newCourseCode} başarıyla eklendi!`, 'success');
    
    // Reset form
    setNewCourseName('');
    setNewCourseCode('');
    setScheduleRows([{ day: 'Mon', startTime: '09:00', endTime: '10:50', location: '' }]);
  };

  const handleDeleteCourse = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`${name} dersini silmek istediğinize emin misiniz?`)) {
      deleteCourse(id);
      showToast('Ders silindi.', 'info');
    }
    setActiveMenuId(null);
  };

  const handleMenuToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMenuId(activeMenuId === id ? null : id);
  }

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    // Only allow drag if menu is not open to avoid conflicts
    if (activeMenuId) {
        e.preventDefault();
        return;
    }
    dragItem.current = position;
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    e.preventDefault();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
        const _courses = [...courses];
        const draggedItemContent = _courses[dragItem.current];
        _courses.splice(dragItem.current, 1);
        _courses.splice(dragOverItem.current, 0, draggedItemContent);
        reorderCourses(_courses);
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Schedule Builder Handlers
  const addScheduleRow = () => {
     setScheduleRows([...scheduleRows, { day: 'Mon', startTime: '09:00', endTime: '10:50', location: '' }]);
  };

  const removeScheduleRow = (index: number) => {
     const newRows = [...scheduleRows];
     newRows.splice(index, 1);
     setScheduleRows(newRows);
  };

  const updateScheduleRow = (index: number, field: keyof WeeklyScheduleItem, value: string) => {
     const newRows = [...scheduleRows];
     newRows[index] = { ...newRows[index], [field]: value };
     setScheduleRows(newRows);
  };

  const filteredCourses = courses.filter(c => {
    if (filter === 'All') return true;
    if (filter === 'With Labs') return c.type === CourseType.LAB;
    if (filter === 'Mandatory') return [CourseType.THEORY, CourseType.LAB].includes(c.type);
    if (filter === 'Elective') return c.type === CourseType.PROJECT;
    return true;
  });

  const FilterButton = ({ label, value }: { label: string, value: typeof filter }) => (
    <button 
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
        filter === value 
          ? 'bg-gray-900 text-white shadow-md' 
          : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
         <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterButton label="All Courses" value="All" />
            <FilterButton label="Mandatory" value="Mandatory" />
            <FilterButton label="Elective" value="Elective" />
            <div className="h-6 w-[1px] bg-gray-300 mx-2"></div>
            <FilterButton label="With Labs" value="With Labs" />
         </div>
         <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-500">Term:</span>
            <select 
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="bg-white border-none text-sm font-bold text-gray-800 rounded-lg p-2 focus:ring-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
               <option>Fall 2023</option>
               <option>Spring 2024</option>
            </select>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full shadow-lg shadow-orange-200 ml-2 active:scale-95 transition-transform"
            >
               <span className="material-icons-round text-sm">add</span>
            </button>
         </div>
      </div>
      
      {filter === 'All' && (
        <p className="text-xs text-gray-400 font-medium italic flex items-center gap-1">
          <span className="material-icons-round text-sm">info</span>
          Drag and drop cards to reorder them.
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course, index) => (
           <div 
             key={course.id} 
             onClick={() => navigate(`/courses/${course.id}`)}
             draggable={filter === 'All' && activeMenuId === null}
             onDragStart={(e) => handleDragStart(e, index)}
             onDragEnter={(e) => handleDragEnter(e, index)}
             onDragEnd={handleDragEnd}
             onDragOver={(e) => e.preventDefault()}
             className={`bg-white rounded-[1.5rem] p-6 shadow-sm border border-transparent hover:border-gray-200 hover:shadow-lg transition-all cursor-pointer group flex flex-col relative ${
                // Removed active:scale to prevent z-index stacking context issues with dropdown
                filter === 'All' ? 'cursor-grab active:cursor-grabbing' : ''
             } ${activeMenuId === course.id ? 'z-50 ring-2 ring-primary-100' : 'z-0'}`}
           >
              <div className="flex justify-between items-start mb-4 relative z-10">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCourseBadgeColor(course.type)}`}>
                    {course.type}
                 </span>
                 
                 {/* Options Menu */}
                 <div className="relative">
                   <button 
                      onClick={(e) => handleMenuToggle(e, course.id)}
                      className={`p-1 rounded-full transition-colors ${activeMenuId === course.id ? 'bg-gray-100 text-gray-900' : 'text-gray-300 hover:text-gray-600 hover:bg-gray-50'}`}
                   >
                      <span className="material-icons-round">more_vert</span>
                   </button>
                   
                   {activeMenuId === course.id && (
                     <div 
                        className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[100] animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()} // Prevent card click
                     >
                        <button 
                          onClick={(e) => handleDeleteCourse(e, course.id, course.name)}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 flex items-center gap-2"
                        >
                          <span className="material-icons-round text-sm">delete</span> Delete
                        </button>
                     </div>
                   )}
                 </div>
              </div>

              {/* Click outside backdrop for menu */}
              {activeMenuId === course.id && (
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }}
                ></div>
              )}

              <div className="mb-6 flex-1">
                 <h4 className="text-gray-400 text-xs font-bold uppercase mb-1">{course.code}</h4>
                 <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
                    {course.name}
                 </h3>
              </div>

              <div className="flex items-center gap-3 mb-6">
                 <img src={course.avatar} alt={course.instructor} className="w-8 h-8 rounded-full bg-gray-200" />
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800">{course.instructor}</span>
                    <span className="text-[10px] text-gray-400">Section {course.section}</span>
                 </div>
              </div>

              <div className="mt-auto">
                 <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                    <span>Attendance</span>
                    <span>{course.attendance}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div 
                     className={`h-full rounded-full ${course.attendance > 80 ? 'bg-green-400' : 'bg-orange-400'}`} 
                     style={{ width: `${course.attendance}%`}}
                    ></div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-500">Average Grade</span>
                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-xs font-black text-gray-800 shadow-sm">
                       {course.averageGrade || 'N/A'}
                    </span>
                 </div>
              </div>
           </div>
        ))}

        {/* Add New Course Placeholder */}
        <button 
           onClick={() => setIsModalOpen(true)}
           className="border-2 border-dashed border-gray-200 rounded-[1.5rem] p-6 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 transition-all min-h-[300px] group"
        >
           <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center transition-colors">
              <span className="material-icons-round text-2xl">add</span>
           </div>
           <span className="font-bold text-sm">Add New Course</span>
        </button>
      </div>

      {/* Add Course Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Ders Ekle">
         <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Temel Bilgiler</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ders Kodu</label>
                     <input type="text" value={newCourseCode} onChange={e => setNewCourseCode(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" placeholder="CS 101" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ders Adı</label>
                     <input type="text" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" placeholder="Intro to..." />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kredi</label>
                     <input type="number" value={newCourseCredits} onChange={e => setNewCourseCredits(Number(e.target.value))} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section</label>
                     <input type="number" value={newCourseSection} onChange={e => setNewCourseSection(Number(e.target.value))} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Öğretim Üyesi</label>
                  <input type="text" value={newCourseInstructor} onChange={e => setNewCourseInstructor(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" placeholder="Dr. Name Surname" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ders Türü</label>
                  <select 
                     value={newCourseType}
                     onChange={(e) => setNewCourseType(e.target.value as CourseType)}
                     className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold cursor-pointer"
                  >
                     <option value={CourseType.THEORY}>Teorik</option>
                     <option value={CourseType.LAB}>Lab'lı</option>
                     <option value={CourseType.PROJECT}>Projeli</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Açıklama</label>
                  <textarea 
                     value={newCourseDesc} 
                     onChange={e => setNewCourseDesc(e.target.value)} 
                     className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold h-20 resize-none" 
                     placeholder="Ders hakkında kısa bilgi..."
                  />
               </div>
            </div>

            {/* Schedule Builder */}
            <div className="space-y-4">
               <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-sm font-bold text-gray-800">Haftalık Program</h4>
                  <button onClick={addScheduleRow} className="text-xs font-bold text-primary-600 hover:underline">+ Saat Ekle</button>
               </div>
               <div className="space-y-2">
                  {scheduleRows.map((row, idx) => (
                     <div key={idx} className="flex gap-2 items-center">
                        <select 
                           value={row.day}
                           onChange={(e) => updateScheduleRow(idx, 'day', e.target.value)}
                           className="bg-gray-50 border-none rounded-lg p-2 text-xs font-bold w-24"
                        >
                           {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input 
                           type="time" 
                           value={row.startTime} 
                           onChange={(e) => updateScheduleRow(idx, 'startTime', e.target.value)}
                           className="bg-gray-50 border-none rounded-lg p-2 text-xs font-bold w-24" 
                        />
                        <span className="text-gray-400">-</span>
                        <input 
                           type="time" 
                           value={row.endTime} 
                           onChange={(e) => updateScheduleRow(idx, 'endTime', e.target.value)}
                           className="bg-gray-50 border-none rounded-lg p-2 text-xs font-bold w-24" 
                        />
                        <input 
                           type="text" 
                           value={row.location || ''} 
                           onChange={(e) => updateScheduleRow(idx, 'location', e.target.value)}
                           placeholder="Yer/Oda"
                           className="bg-gray-50 border-none rounded-lg p-2 text-xs font-bold flex-1" 
                        />
                        <button onClick={() => removeScheduleRow(idx)} className="text-gray-400 hover:text-red-500">
                           <span className="material-icons-round text-lg">delete</span>
                        </button>
                     </div>
                  ))}
               </div>
            </div>

            {/* Grading Weights */}
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Notlandırma Sistemi (%)</h4>
               <div className="grid grid-cols-3 gap-3">
                  {Object.keys(gradingWeights).map(key => (
                     <div key={key}>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 capitalize">{key}</label>
                        <input 
                           type="number" 
                           value={gradingWeights[key as keyof typeof gradingWeights]}
                           onChange={(e) => setGradingWeights({...gradingWeights, [key]: Number(e.target.value)})}
                           className="w-full bg-gray-50 border-none rounded-xl p-2 text-sm font-semibold" 
                        />
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex gap-3 pt-4">
               <button onClick={handleAddCourse} className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">Dersi Oluştur</button>
               <button onClick={() => setIsModalOpen(false)} className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">İptal</button>
            </div>
         </div>
      </Modal>
    </div>
  );
};
