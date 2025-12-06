import React, { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

interface LayoutProps {
  children: ReactNode;
}

const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
          isActive
            ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg shadow-primary-500/30'
            : 'text-gray-500 hover:bg-white hover:text-gray-900'
        }`
      }
    >
      <span className="material-icons-round text-[20px]">{icon}</span>
      <span className="font-semibold text-sm tracking-wide">{label}</span>
    </NavLink>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, toast, showToast, termSettings } = useData();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/courses': return 'My Courses';
      case '/exams': return 'Exams';
      case '/tasks': return 'Task Manager';
      case '/calendar': return 'Schedule';
      case '/settings': return 'Settings';
      default: 
        if(location.pathname.startsWith('/courses/')) return 'Course Detail';
        return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F6F7FB] overflow-hidden font-sans text-dark relative">
      {/* Global Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[60] animate-fade-in-up">
           <div className={`px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 
              toast.type === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-900 text-white'
           }`}>
              <span className="material-icons-round text-lg">
                {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
              </span>
              <span className="font-bold text-sm">{toast.message}</span>
           </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col p-6 h-full">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 px-4 mb-10 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-yellow-400 flex items-center justify-center text-white font-bold text-lg">
            U
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">UniPlanner</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon="dashboard" label="Overview" />
          <NavItem to="/courses" icon="book" label="Courses" />
          <NavItem to="/exams" icon="assignment" label="Exams" />
          <NavItem to="/tasks" icon="check_circle" label="Tasks" />
          <NavItem to="/calendar" icon="calendar_today" label="Calendar" />
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-2">
          <button 
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-gray-500 hover:bg-white hover:text-gray-900"
          >
             <span className="material-icons-round text-[20px]">settings</span>
             <span className="font-semibold text-sm tracking-wide">Settings</span>
          </button>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-4 mt-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-full -mr-4 -mt-4"></div>
            <p className="text-xs font-medium text-gray-300 mb-1">Pro Plan</p>
            <p className="text-sm font-bold mb-3">Upgrade for more features</p>
            <button 
              onClick={() => showToast('Redirecting to Pricing...', 'info')}
              className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {/* Topbar */}
        <header className="h-20 px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-0.5">
               <span className="material-icons-round text-base text-primary-500">school</span>
               <span>Academic Year <span className="text-gray-600 font-bold">{termSettings.academicYear}</span></span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="hidden md:flex items-center bg-white px-4 py-2.5 rounded-full shadow-sm w-80 focus-within:ring-2 focus-within:ring-primary-100 transition-shadow">
              <span className="material-icons-round text-gray-400 text-lg">search</span>
              <input 
                type="text" 
                placeholder="Search courses, exams..." 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder-gray-400 text-gray-700"
                onKeyDown={(e) => e.key === 'Enter' && showToast(`Searching for: ${e.currentTarget.value}`, 'info')}
              />
            </div>

            {/* Actions */}
            <button 
              onClick={() => showToast('No new notifications', 'info')}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-icons-round">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F6F7FB]"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800">{userProfile.name}</p>
                  <p className="text-xs text-gray-400">{userProfile.university}</p>
               </div>
               <img 
                src={userProfile.avatar}
                alt="Profile" 
                onClick={() => navigate('/settings')}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover cursor-pointer hover:opacity-80 transition-opacity"
               />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-32">
           {children}
        </div>
      </main>
    </div>
  );
};