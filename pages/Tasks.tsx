import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Task } from '../types';
import { Modal } from '../components/Modal';
import { useLocation } from 'react-router-dom';

export const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, courses } = useData();
  const [filter, setFilter] = useState<'All' | 'Todo' | 'Done'>('All');
  const location = useLocation();
  
  // Quick Input State
  const [quickInput, setQuickInput] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskStatus, setNewTaskStatus] = useState<'Todo' | 'InProgress' | 'Done'>('Todo');

  const [points, setPoints] = useState(1240);
  const [streak, setStreak] = useState(5);

  // Date Picker Ref
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
     if (location.state && (location.state as any).openModal) {
        openAddModal();
        window.history.replaceState({}, document.title);
     }
  }, [location]);

  const openAddModal = () => {
     // Pre-fill Title with quick input instead of Description
     setNewTaskTitle(quickInput); 
     setNewTaskDesc('');
     setNewTaskCourse('');
     setNewTaskDate(new Date().toISOString().split('T')[0]);
     setNewTaskPriority('Medium');
     setNewTaskStatus('Todo');
     setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDesc,
      courseId: newTaskCourse,
      status: newTaskStatus,
      dueDate: newTaskDate,
      priority: newTaskPriority,
      points: 20, 
    };
    addTask(newTask);
    setQuickInput(''); // Clear quick input
    setIsModalOpen(false);
  };

  const toggleTaskStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const isCompleting = task.status !== 'Done';
    updateTask({
       ...task,
       status: isCompleting ? 'Done' : 'Todo',
    });

    if (isCompleting) {
       const earnedPoints = Math.floor(Math.random() * 30) + 20; 
       setPoints(prev => prev + earnedPoints);
    }
  };

  const filteredTasks = tasks.filter(t => {
     if (filter === 'All') return true;
     if (filter === 'Todo') return t.status !== 'Done';
     if (filter === 'Done') return t.status === 'Done';
     return true;
  });

  const handleQuickInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && quickInput.trim()) {
       openAddModal();
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 h-full">
      {/* Gamification Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden flex-shrink-0">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="flex flex-col">
               <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Score</span>
               <span className="text-4xl font-black text-yellow-400 flex items-center gap-2">
                  <span className="material-icons-round text-3xl">emoji_events</span> {points}
               </span>
            </div>
            <div className="h-10 w-[1px] bg-gray-700"></div>
            <div className="flex flex-col">
               <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Daily Streak</span>
               <span className="text-4xl font-black text-orange-500 flex items-center gap-2">
                  <span className="material-icons-round text-3xl">local_fire_department</span> {streak}
               </span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
         {/* Task List Section */}
         <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-0">
            
            {/* Quick Input Bar */}
            <div className="flex justify-between items-center bg-white p-2 pl-4 pr-2 rounded-full shadow-sm flex-shrink-0">
               <input 
                  type="text" 
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  onKeyDown={handleQuickInputKeyDown}
                  placeholder="Manage your tasks... (press Enter to create)"
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-700 placeholder-gray-400 mr-4"
               />
               <button 
                 onClick={openAddModal}
                 className="w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center"
               >
                 <span className="material-icons-round">add</span>
               </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
               {['All', 'Todo', 'Done'].map(f => (
                  <button
                     key={f}
                     onClick={() => setFilter(f as any)}
                     className={`pb-2 text-sm font-bold transition-all ${filter === f ? 'text-gray-900 border-b-2 border-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                     {f}
                  </button>
               ))}
            </div>

            {/* Tasks Scrollable List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
               {filteredTasks.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 font-medium">No tasks found.</div>
               ) : (
                  filteredTasks.map(task => (
                     <div key={task.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all group">
                        <button 
                           onClick={() => toggleTaskStatus(task.id)}
                           className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
                              task.status === 'Done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-primary-400'
                           }`}
                        >
                           {task.status === 'Done' && <span className="material-icons-round text-sm">check</span>}
                        </button>
                        <div className="flex-1">
                           <h4 className={`font-bold text-gray-800 ${task.status === 'Done' ? 'line-through text-gray-400' : ''}`}>
                              {task.title}
                           </h4>
                           <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                           
                           <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                 task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                                 task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                              }`}>
                                 {task.priority} Priority
                              </span>
                              {task.courseId && (
                                 <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-600">
                                    {courses.find(c => c.id === task.courseId)?.code || 'Course'}
                                 </span>
                              )}
                              <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded-md">
                                 <span className="material-icons-round text-[12px]">calendar_today</span>
                                 {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* Right Column: Status Board */}
         <div className="hidden lg:flex flex-col gap-4">
            <h3 className="font-bold text-gray-800">Status Overview</h3>
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">To Do</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{tasks.filter(t => t.status === 'Todo').length}</span>
               </div>
               <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-400 h-full rounded-full" style={{ width: `${(tasks.filter(t => t.status === 'Todo').length / tasks.length) * 100}%` }}></div>
               </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">In Progress</span>
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">{tasks.filter(t => t.status === 'InProgress').length}</span>
               </div>
               <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(tasks.filter(t => t.status === 'InProgress').length / tasks.length) * 100}%` }}></div>
               </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Done</span>
                  <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs font-bold">{tasks.filter(t => t.status === 'Done').length}</span>
               </div>
               <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-400 h-full rounded-full" style={{ width: `${(tasks.filter(t => t.status === 'Done').length / tasks.length) * 100}%` }}></div>
               </div>
            </div>
         </div>
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Görev Ekle">
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Görev Başlığı</label>
               <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold" placeholder="Read Chapter 5" />
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Açıklama</label>
               <textarea value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold h-20 resize-none" placeholder="Details about the task..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ders (Opsiyonel)</label>
                  <select value={newTaskCourse} onChange={e => setNewTaskCourse(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold">
                     <option value="">Seçiniz</option>
                     {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Son Tarih</label>
                  <div className="relative group">
                     <input 
                        ref={dateInputRef}
                        type="date"
                        value={newTaskDate}
                        onChange={e => setNewTaskDate(e.target.value)}
                        onClick={() => dateInputRef.current?.showPicker?.()}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold pl-10 cursor-pointer" 
                     />
                     <span className="material-icons-round absolute left-3 top-3 text-gray-400 text-sm group-hover:text-primary-500 pointer-events-none">calendar_today</span>
                  </div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Önem Derecesi</label>
                  <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as any)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold">
                     <option value="Low">Low</option>
                     <option value="Medium">Medium</option>
                     <option value="High">High</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Başlangıç Durumu</label>
                  <select value={newTaskStatus} onChange={e => setNewTaskStatus(e.target.value as any)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold">
                     <option value="Todo">To Do</option>
                     <option value="InProgress">In Progress</option>
                     <option value="Done">Completed</option>
                  </select>
               </div>
            </div>
            
            <div className="flex gap-3 pt-4">
               <button onClick={handleCreateTask} className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">Görevi Oluştur</button>
               <button onClick={() => setIsModalOpen(false)} className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">İptal</button>
            </div>
         </div>
      </Modal>
    </div>
  );
};