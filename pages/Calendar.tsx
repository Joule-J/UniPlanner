import React, { useState, useRef } from 'react';
import { Modal } from '../components/Modal';
import { useData } from '../context/DataContext';

// Helpers for mock calendar logic
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const Calendar: React.FC = () => {
  const { showToast, courses, exams, assignments } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'Day' | 'Week' | 'Month'>('Week');
  
  // Sidebar Filters State
  const [filters, setFilters] = useState({
    exams: true,
    lessons: true,
    labs: true,
    projects: true,
    assignments: true,
    academic: true,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('10:00');
  const [eventType, setEventType] = useState('lessons');

  // Refs for Date Picker
  const dateInputRef = useRef<HTMLInputElement>(null);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Navigation Logic
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'Day') newDate.setDate(newDate.getDate() - 1);
    if (view === 'Week') newDate.setDate(newDate.getDate() - 7);
    if (view === 'Month') newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'Day') newDate.setDate(newDate.getDate() + 1);
    if (view === 'Week') newDate.setDate(newDate.getDate() + 7);
    if (view === 'Month') newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddEvent = () => {
     if(!eventTitle) return;
     showToast(`Etkinlik eklendi: ${eventTitle}`, 'success');
     setIsModalOpen(false);
     setEventTitle('');
  };

  // Generate days for view
  const getDaysForView = () => {
    const startOfWeek = new Date(currentDate);
    // Adjust to Monday
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
    startOfWeek.setDate(diff);

    if (view === 'Day') {
      return [new Date(currentDate)];
    }

    if (view === 'Week') {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        days.push(d);
      }
      return days;
    }

    // Month view logic (simplified grid)
    if (view === 'Month') {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        // Start padding
        const startDay = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1; 
        
        const days = [];
        // Previous month padding
        for (let i = 0; i < startDay; i++) days.push(null);
        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
           days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }
        return days;
    }

    return [];
  };

  const currentDays = getDaysForView();

  // --- Helper to get events for a specific day ---
  const getEventsForDay = (date: Date) => {
    if (!date || isNaN(date.getTime())) return { lessons: [], exams: [], assignments: [] };

    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
    
    // Correctly handle timezone for ISO string comparison (using local YYYY-MM-DD)
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    const dateStr = localDate.toISOString().split('T')[0];

    const todaysLessons: any[] = [];
    if (filters.lessons) {
       courses.forEach(course => {
          if (course.weeklySchedule) {
             course.weeklySchedule.forEach(item => {
                if (item.day === dayName) {
                   todaysLessons.push({ ...item, courseName: course.name, courseCode: course.code, color: 'bg-orange-50 border-orange-500 text-orange-700' });
                }
             });
          }
       });
    }

    const todaysExams = filters.exams ? exams.filter(e => e.date.startsWith(dateStr)) : [];
    const todaysAssignments = filters.assignments ? assignments.filter(a => a.dueDate === dateStr) : [];

    return { lessons: todaysLessons, exams: todaysExams, assignments: todaysAssignments };
  };

  return (
    <div className="flex h-full gap-6 overflow-hidden">
      {/* Sidebar (Left) */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pb-4">
        
        {/* Add Event Button */}
        <button 
           onClick={() => setIsModalOpen(true)}
           className="w-full py-3 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          Add Event <span className="material-icons-round text-sm">add</span>
        </button>

        {/* Mini Calendar (Interactive) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h4 className="font-bold text-gray-800">{currentDate.toLocaleDateString(undefined, {month:'long', year:'numeric'})}</h4>
             <div className="flex gap-1">
                <button onClick={handlePrev} className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"><span className="material-icons-round text-sm">chevron_left</span></button>
                <button onClick={handleNext} className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"><span className="material-icons-round text-sm">chevron_right</span></button>
             </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold mb-2 text-gray-400">
             {['S','M','T','W','T','F','S'].map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-sm font-medium">
             {Array.from({length: 30}, (_, i) => i + 1).map(d => (
                <span 
                  key={d} 
                  onClick={() => {
                     const newDate = new Date(currentDate);
                     newDate.setDate(d);
                     setCurrentDate(newDate);
                  }}
                  className={`py-2 rounded-full cursor-pointer hover:bg-gray-50 ${d === currentDate.getDate() ? 'bg-primary-500 text-white hover:bg-primary-600' : 'text-gray-700'}`}
                >
                  {d}
                </span>
             ))}
          </div>
        </div>

        {/* Specific Event Filters */}
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h4 className="font-bold text-gray-800">Event Types</h4>
          </div>
          <div className="space-y-3">
             {[
               { key: 'exams', label: 'Sınavlar', color: 'bg-red-500' },
               { key: 'lessons', label: 'Dersler', color: 'bg-orange-500' },
               { key: 'labs', label: 'Lablar', color: 'bg-blue-500' },
               { key: 'projects', label: 'Proje Teslim', color: 'bg-purple-500' },
               { key: 'assignments', label: 'Ödev Teslim', color: 'bg-green-500' },
               { key: 'academic', label: 'Akademik Takvim', color: 'bg-gray-500' },
             ].map((item) => (
                <div 
                  key={item.key} 
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => toggleFilter(item.key as any)}
                >
                   <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color} ${!filters[item.key as keyof typeof filters] ? 'opacity-30' : ''}`}></div>
                      <span className={`text-sm font-medium ${filters[item.key as keyof typeof filters] ? 'text-gray-800' : 'text-gray-400'}`}>{item.label}</span>
                   </div>
                   <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${filters[item.key as keyof typeof filters] ? 'bg-primary-500 border-primary-500' : 'border-gray-200'}`}>
                      {filters[item.key as keyof typeof filters] && <span className="material-icons-round text-white text-[12px]">check</span>}
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Main Grid (Right) */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm flex flex-col min-h-0 overflow-hidden relative">
         {/* Header */}
         <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0 bg-white z-20">
            <div className="flex items-center gap-4">
               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                 {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                 {view !== 'Month' && <span className="text-gray-400 text-base font-medium border-l border-gray-200 pl-3">Week {Math.ceil(currentDate.getDate() / 7)}</span>}
               </h2>
               <div className="flex gap-2">
                  <button onClick={handlePrev} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-95"><span className="material-icons-round text-sm">chevron_left</span></button>
                  <button onClick={handleNext} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-95"><span className="material-icons-round text-sm">chevron_right</span></button>
                  <button onClick={handleToday} className="px-3 py-1 bg-gray-50 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-100 ml-2">Today</button>
               </div>
            </div>
            
            <div className="flex bg-gray-50 p-1 rounded-xl">
                <button 
                onClick={() => setView('Day')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${view === 'Day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                >
                Day
                </button>
                <button 
                onClick={() => setView('Week')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${view === 'Week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                >
                Week
                </button>
                <button 
                onClick={() => setView('Month')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${view === 'Month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                >
                Month
                </button>
            </div>
         </div>

         {/* Calendar Grid Render Logic */}
         <div className="flex-1 overflow-y-auto relative">
            {/* MONTH VIEW */}
            {view === 'Month' && (
               <div className="grid grid-cols-7 min-h-full auto-rows-fr">
                   {/* Days Header */}
                   {DAYS_OF_WEEK.map(day => (
                      <div key={day} className="p-3 border-b border-r border-gray-100 text-center text-xs font-bold text-gray-400 bg-gray-50/50 sticky top-0 z-10">
                         {day}
                      </div>
                   ))}
                   {/* Calendar Cells */}
                   {currentDays.map((date, i) => {
                      const events = date ? getEventsForDay(date) : { lessons: [], exams: [], assignments: [] };
                      return (
                         <div key={i} className={`border-b border-r border-gray-100 p-2 min-h-[100px] relative group hover:bg-gray-50 transition-colors ${!date ? 'bg-gray-50/30' : ''}`}>
                            {date && (
                               <>
                                 <span className={`text-sm font-bold inline-block mb-1 ${date.toDateString() === new Date().toDateString() ? 'bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-700'}`}>
                                    {date.getDate()}
                                 </span>
                                 <div className="mt-1 space-y-1">
                                    {events.lessons.slice(0, 2).map((l, idx) => (
                                       <div key={idx} className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded truncate font-bold">{l.courseCode}</div>
                                    ))}
                                    {events.exams.map(e => (
                                       <div key={e.id} className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded truncate font-bold">{e.title}</div>
                                    ))}
                                    {events.assignments.map(a => (
                                       <div key={a.id} className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded truncate font-bold">{a.title}</div>
                                    ))}
                                 </div>
                               </>
                            )}
                         </div>
                      );
                   })}
               </div>
            )}

            {/* WEEK / DAY VIEW */}
            {(view === 'Week' || view === 'Day') && (
               <div className="min-w-full">
                   <div 
                     className="grid border-b border-gray-100 sticky top-0 bg-white z-30 shadow-sm"
                     style={{ gridTemplateColumns: view === 'Week' ? '60px repeat(7, 1fr)' : '60px 1fr' }}
                   >
                        {/* Empty Top-Left Corner */}
                        <div className="p-4 border-r border-gray-100 text-xs font-bold text-gray-400 text-center bg-white">
                           GMT+3
                        </div>
                        {currentDays.map((day, idx) => (
                            <div key={idx} className="p-3 border-r border-gray-100 text-center bg-white">
                                <div className="text-xs text-gray-400 uppercase font-bold">{day?.toLocaleDateString(undefined, {weekday: 'short'})}</div>
                                <div className={`text-xl font-bold mt-1 ${day?.toDateString() === new Date().toDateString() ? 'text-primary-600' : 'text-gray-800'}`}>
                                {day?.getDate()}
                                </div>
                            </div>
                        ))}
                   </div>

                   {/* Scrollable Time Grid */}
                   <div className="relative">
                       {HOURS.map(hour => (
                          <div 
                            key={hour} 
                            className="grid border-b border-gray-100 min-h-[80px]"
                            style={{ gridTemplateColumns: view === 'Week' ? '60px repeat(7, 1fr)' : '60px 1fr' }}
                          >
                             {/* Time Label */}
                             <div className="border-r border-gray-100 p-2 text-xs font-bold text-gray-400 text-center sticky left-0 bg-white z-10">
                                {hour}:00
                             </div>
                             
                             {/* Day Columns for this Hour */}
                             {currentDays.map((day, dayIdx) => {
                                if (!day) return <div key={dayIdx} className="border-r border-gray-100"></div>;
                                const events = getEventsForDay(day);
                                return (
                                   <div key={dayIdx} className="border-r border-gray-100 relative group hover:bg-gray-50 transition-colors p-1">
                                      {/* Real Lessons Mapping */}
                                      {events.lessons.map((lesson, lid) => {
                                          const startHour = parseInt(lesson.startTime.split(':')[0]);
                                          // Only render if this slot matches start time
                                          if (startHour === hour) {
                                             return (
                                                <div key={lid} className="mb-1 bg-orange-50 border-l-4 border-primary-500 rounded-r-md p-2 text-xs overflow-hidden cursor-pointer hover:shadow-md transition-all z-10 h-full">
                                                   <div className="font-bold text-primary-700">{lesson.courseName}</div>
                                                   <div className="text-primary-500 text-[10px]">{lesson.location}</div>
                                                </div>
                                             );
                                          }
                                          return null;
                                      })}
                                      
                                      {/* Real Exams Mapping */}
                                      {events.exams.map((exam, eid) => {
                                         const examHour = parseInt(exam.time ? exam.time.split(':')[0] : '10'); // Default to 10 if no time
                                          if (examHour === hour) {
                                             return (
                                                <div key={eid} className="mb-1 bg-red-50 border-l-4 border-red-500 rounded-r-md p-2 text-xs overflow-hidden z-20 cursor-pointer hover:shadow-md transition-all">
                                                   <div className="font-bold text-red-700">{exam.courseName} Exam</div>
                                                   <div className="text-red-500 text-[10px]">{exam.location}</div>
                                                </div>
                                             );
                                          }
                                          return null;
                                      })}
                                   </div>
                                );
                             })}
                          </div>
                       ))}
                   </div>
               </div>
            )}
         </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Event">
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Title</label>
               <input 
                  type="text" 
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-primary-100"
                  placeholder="Study Session"
               />
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                  <div className="relative group">
                     <input 
                        ref={dateInputRef}
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        onClick={() => dateInputRef.current?.showPicker?.()} 
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-primary-100 pl-10 cursor-pointer"
                     />
                     <span 
                        className="material-icons-round absolute left-3 top-3 text-gray-400 text-sm group-hover:text-primary-500 pointer-events-none"
                    >
                        calendar_today
                    </span>
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                  <input 
                     type="time"
                     value={eventTime}
                     onChange={(e) => setEventTime(e.target.value)}
                     className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-primary-100"
                  />
               </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type</label>
               <div className="flex flex-wrap gap-2">
                  {['lessons', 'exams', 'labs', 'projects'].map(t => (
                     <button
                        key={t}
                        onClick={() => setEventType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                           eventType === t 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                     >
                        {t}
                     </button>
                  ))}
               </div>
            </div>
            <div className="flex gap-3 pt-4">
               <button onClick={handleAddEvent} className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">Add Event</button>
               <button onClick={() => setIsModalOpen(false)} className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
            </div>
         </div>
      </Modal>
    </div>
  );
};