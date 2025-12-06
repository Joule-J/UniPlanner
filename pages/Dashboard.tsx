
import React, { useState } from 'react';
import { WEEK_DAYS, UPCOMING_EXAMS, RECENT_ACTIVITIES } from '../constants';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [scheduleMode, setScheduleMode] = useState<'Week' | 'Day'>('Week');
  const [activeDayIndex, setActiveDayIndex] = useState(2); // Wednesday (Mock Today)

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* LEFT COLUMN (8 cols) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
        
        {/* Hero Card */}
        <div className="relative bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden min-h-[280px] flex flex-col justify-center group">
          {/* Decorative Background */}
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-orange-50 to-transparent opacity-60 pointer-events-none"></div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold mb-4">
              Weekly Insight
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
              Keep pushing, <br/>finals are 3 weeks away!
            </h2>
            <p className="text-gray-500 mb-6 font-medium">
              You have completed 80% of your tasks for this week. Great job maintaining your streak.
            </p>
            <button 
              onClick={() => navigate('/calendar')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              Check Schedule
            </button>
          </div>
        </div>

        {/* Weekly Horizontal Schedule */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">This Week</h3>
            <div className="flex bg-white rounded-full p-1 shadow-sm">
                <button 
                  onClick={() => setScheduleMode('Week')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${scheduleMode === 'Week' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setScheduleMode('Day')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${scheduleMode === 'Day' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  Day
                </button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {WEEK_DAYS.map((day, idx) => {
              const isActive = idx === activeDayIndex; 
              return (
                <div 
                  key={day.day} 
                  onClick={() => setActiveDayIndex(idx)}
                  className={`flex-shrink-0 w-32 p-3 rounded-3xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${isActive ? 'bg-gray-900 text-white border-gray-900 shadow-xl scale-105' : 'bg-white border-transparent text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                >
                  <span className="text-xs font-medium opacity-60">{day.day}</span>
                  <span className={`text-xl font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>{day.date}</span>
                  
                  {/* Mini Event Dots */}
                  <div className="flex gap-1 mt-1">
                    {idx % 2 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
                    {idx === 2 && <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>}
                    {idx === 4 && <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Today's Events List (Mock) */}
          <div className="mt-4 space-y-3">
             <div onClick={() => navigate('/courses/2')} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <span className="material-icons-round">science</span>
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-gray-800">Physics Lab Session</h4>
                   <p className="text-sm text-gray-400">14:00 - 16:00 • Lab Complex B</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Lab</span>
             </div>
             <div onClick={() => navigate('/courses/1')} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-orange-100 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <span className="material-icons-round">menu_book</span>
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-gray-800">Intro to Programming</h4>
                   <p className="text-sm text-gray-400">09:00 - 11:00 • Room 204</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">Theory</span>
             </div>
          </div>
        </div>

        {/* Upcoming Exams List */}
        <div>
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Upcoming Exams</h3>
            <button 
              onClick={() => navigate('/exams')}
              className="text-primary-600 text-sm font-bold hover:underline"
            >
              See All
            </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {UPCOMING_EXAMS.map(exam => (
                <div 
                  key={exam.id} 
                  onClick={() => navigate('/exams')}
                  className="bg-white p-5 rounded-3xl border border-gray-100 relative overflow-hidden group hover:border-primary-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center material-icons-round group-hover:bg-red-100 transition-colors">
                      event_note
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-500 uppercase">
                      {new Date(exam.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900">{exam.courseName}</h4>
                  <p className="text-sm text-gray-500 mb-4">{exam.title}</p>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                     <span className="material-icons-round text-sm">schedule</span>
                     {new Date(exam.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     <span className="mx-1">•</span>
                     <span>{exam.location}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* RIGHT COLUMN (4 cols) */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* Greeting / Profile Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-transparent hover:border-gray-100 transition-colors">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-800">Have a good day,<br/>Alex! 👋</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => navigate('/tasks', { state: { openModal: true } })}
                className="bg-gray-50 hover:bg-orange-50 hover:text-orange-600 p-3 rounded-2xl flex flex-col items-center gap-2 transition-colors group active:scale-95"
              >
                 <span className="material-icons-round text-gray-400 group-hover:text-orange-500">add_task</span>
                 <span className="text-xs font-bold">Add Task</span>
              </button>
              <button 
                onClick={() => navigate('/exams', { state: { openModal: true } })}
                className="bg-gray-50 hover:bg-blue-50 hover:text-blue-600 p-3 rounded-2xl flex flex-col items-center gap-2 transition-colors group active:scale-95"
              >
                 <span className="material-icons-round text-gray-400 group-hover:text-blue-500">post_add</span>
                 <span className="text-xs font-bold">Add Exam</span>
              </button>
           </div>
           
           <div 
             onClick={() => navigate('/courses/4')}
             className="flex items-center justify-between bg-primary-500 text-white p-4 rounded-2xl shadow-lg shadow-orange-200 cursor-pointer hover:bg-primary-600 transition-colors active:scale-95"
           >
              <div className="flex flex-col">
                 <span className="text-xs font-medium opacity-80">Next Class</span>
                 <span className="font-bold">Linear Algebra</span>
                 <span className="text-xs opacity-80 mt-1">Starts in 15 mins</span>
              </div>
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                 <span className="material-icons-round">arrow_forward</span>
              </div>
           </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
           {/* Replaced GPA with Attendance/Credits since GPA Calculator is removed */}
           <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow cursor-default">
              <span className="text-xs text-gray-400 font-bold uppercase">Credits</span>
              <span className="text-2xl font-black text-gray-800">14</span>
              <span className="text-[10px] text-green-500 font-bold flex items-center">
                 <span className="material-icons-round text-[12px]">check_circle</span> Active
              </span>
           </div>
           <div onClick={() => navigate('/tasks')} className="bg-white p-4 rounded-3xl shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-green-200">
              <span className="text-xs text-gray-400 font-bold uppercase">Done</span>
              <span className="text-2xl font-black text-gray-800">12</span>
              <span className="text-[10px] text-gray-400 font-bold">tasks this week</span>
           </div>
        </div>

        {/* Timeline / Activity */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex-1 border border-transparent hover:border-gray-100 transition-colors">
           <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Activity</h3>
           <div className="space-y-6 relative">
              {/* Line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

              {RECENT_ACTIVITIES.map(activity => (
                 <div key={activity.id} className="relative pl-8 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg -ml-2 -mr-2 transition-colors">
                    <div className={`absolute left-2 top-3 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 ${
                       activity.type === 'grade' ? 'bg-green-400' :
                       activity.type === 'exam' ? 'bg-red-400' : 'bg-blue-400'
                    }`}></div>
                    <p className="text-sm font-bold text-gray-800 leading-snug group-hover:text-primary-600 transition-colors">{activity.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};
