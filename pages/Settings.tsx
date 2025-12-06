

import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';

export const Settings: React.FC = () => {
  const { 
    userProfile, updateUserProfile, 
    academicInfo, updateAcademicInfo, 
    appSettings, updateAppSettings,
    termSettings, updateTermSettings,
    showToast
  } = useData();
  const [activeTab, setActiveTab] = useState('profile');

  // Refs for Date Pickers (for safe triggering)
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const examStartRef = useRef<HTMLInputElement>(null);
  const examEndRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profil bilgileriniz güncellendi.');
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: 'person' },
    { id: 'academic', label: 'Akademik Bilgiler', icon: 'school' },
    { id: 'terms', label: 'Dönem Ayarları', icon: 'date_range' },
    { id: 'theme', label: 'Tema Ayarları', icon: 'palette' },
    { id: 'notifications', label: 'Bildirimler', icon: 'notifications' },
    { id: 'backup', label: 'Veri Yedekleme', icon: 'backup' },
    { id: 'sync', label: 'Sync & Export', icon: 'sync' },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 relative">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activeTab === tab.id 
                ? 'bg-white shadow-sm text-primary-600 font-bold' 
                : 'text-gray-500 hover:bg-white/50 hover:text-gray-800'
            }`}
          >
            <span className="material-icons-round text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-[1.5rem] p-8 shadow-sm min-h-[500px]">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profil Ayarları</h2>
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                   <img src={userProfile.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50" />
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-icons-round text-white">edit</span>
                   </div>
                </div>
                <div>
                  <button type="button" className="text-primary-600 font-bold text-sm hover:underline">Fotoğrafı Değiştir</button>
                  <p className="text-xs text-gray-400 mt-1">Max 2MB. JPG, PNG.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Ad Soyad</label>
                  <input 
                    type="text" 
                    value={userProfile.name} 
                    onChange={e => updateUserProfile({...userProfile, name: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                  <input 
                    type="email" 
                    value={userProfile.email} 
                    onChange={e => updateUserProfile({...userProfile, email: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="px-6 py-2 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-orange-100">Kaydet</button>
                <button type="button" className="px-6 py-2 bg-transparent text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-colors">İptal</button>
              </div>
            </form>
          </div>
        )}

        {/* Academic Settings */}
        {activeTab === 'academic' && (
           <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Akademik Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Üniversite</label>
                  <input 
                    type="text" 
                    value={academicInfo.university} 
                    onChange={e => updateAcademicInfo({...academicInfo, university: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Bölüm / Program</label>
                  <input 
                    type="text" 
                    value={academicInfo.major} 
                    onChange={e => updateAcademicInfo({...academicInfo, major: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Sınıf</label>
                  <select 
                    value={academicInfo.year}
                    onChange={e => updateAcademicInfo({...academicInfo, year: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-gray-900"
                  >
                    <option>Hazırlık</option>
                    <option>1. Sınıf</option>
                    <option>2. Sınıf</option>
                    <option>3. Sınıf</option>
                    <option>4. Sınıf</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Not Sistemi</label>
                  <select 
                    value={academicInfo.gradingSystem}
                    onChange={e => updateAcademicInfo({...academicInfo, gradingSystem: e.target.value as any})}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-semibold text-gray-900"
                  >
                    <option value="4.0">4.0'lük Sistem (AA/BA)</option>
                    <option value="100">100'lük Sistem</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                 <button onClick={() => showToast('Akademik bilgiler güncellendi.')} className="px-6 py-2 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-orange-100">Kaydet</button>
              </div>
           </div>
        )}

        {/* Advanced Term Settings */}
        {activeTab === 'terms' && (
           <div className="space-y-8 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Gelişmiş Dönem Ayarları</h2>
                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold border border-primary-100">Active</span>
              </div>
              
              {/* General Config Card */}
              <div className="bg-gray-50 p-6 rounded-2xl space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons-round text-gray-400">tune</span>
                    <h3 className="font-bold text-gray-800">Genel Yapılandırma</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Akademik Yıl</label>
                      <select 
                        value={termSettings.academicYear}
                        onChange={e => updateTermSettings({...termSettings, academicYear: e.target.value})}
                        className="w-full bg-white border-none rounded-xl p-3 text-sm font-semibold text-gray-900 shadow-sm"
                      >
                        <option value="2022-2023">2022-2023</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2025-2026">2025-2026</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Sistem Tipi</label>
                      <select 
                        value={termSettings.systemType || 'Semester'}
                        onChange={e => updateTermSettings({...termSettings, systemType: e.target.value as any})}
                        className="w-full bg-white border-none rounded-xl p-3 text-sm font-semibold text-gray-900 shadow-sm"
                      >
                        <option value="Semester">Semester (Dönemlik)</option>
                        <option value="Trimester">Trimester (3 Dönem)</option>
                        <option value="Quarter">Quarter (Çeyrek)</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Aktif Dönem</label>
                      <select 
                        value={termSettings.currentTerm}
                        onChange={e => updateTermSettings({...termSettings, currentTerm: e.target.value})}
                        className="w-full bg-white border-none rounded-xl p-3 text-sm font-semibold text-gray-900 shadow-sm"
                      >
                        <option>Güz</option>
                        <option>Bahar</option>
                        <option>Yaz</option>
                      </select>
                    </div>
                 </div>
              </div>

              {/* Timeline Config Card */}
              <div className="bg-gray-50 p-6 rounded-2xl space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons-round text-gray-400">date_range</span>
                    <h3 className="font-bold text-gray-800">Dönem Zaman Çizelgesi</h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Dönem Başlangıcı</label>
                      <div className="relative group">
                         <input 
                           ref={startDateRef}
                           type="date"
                           value={termSettings.startDate}
                           onChange={e => updateTermSettings({...termSettings, startDate: e.target.value})}
                           onClick={() => startDateRef.current?.showPicker?.()}
                           className="w-full bg-white border-none rounded-xl p-3 text-sm font-semibold text-gray-900 shadow-sm pl-10 cursor-pointer"
                         />
                         <span className="material-icons-round absolute left-3 top-3 text-gray-400 text-sm pointer-events-none">event</span>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Dönem Bitişi</label>
                       <div className="relative group">
                         <input 
                           ref={endDateRef}
                           type="date"
                           value={termSettings.endDate}
                           onChange={e => updateTermSettings({...termSettings, endDate: e.target.value})}
                           onClick={() => endDateRef.current?.showPicker?.()}
                           className="w-full bg-white border-none rounded-xl p-3 text-sm font-semibold text-gray-900 shadow-sm pl-10 cursor-pointer"
                         />
                         <span className="material-icons-round absolute left-3 top-3 text-gray-400 text-sm pointer-events-none">event_busy</span>
                      </div>
                   </div>
                 </div>

                 <div className="h-[1px] bg-gray-200 w-full my-4"></div>

                 <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase text-red-400">Sınav Dönemi Başlangıç</label>
                      <div className="relative group">
                         <input 
                           ref={examStartRef}
                           type="date"
                           value={termSettings.examStartDate || ''}
                           onChange={e => updateTermSettings({...termSettings, examStartDate: e.target.value})}
                           onClick={() => examStartRef.current?.showPicker?.()}
                           className="w-full bg-white border-none rounded-xl p-3 text-sm font-semibold text-gray-900 shadow-sm pl-10 cursor-pointer"
                         />
                         <span className="material-icons-round absolute left-3 top-3 text-red-400 text-sm pointer-events-none">flag</span>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase text-red-400">Sınav Dönemi Bitiş</label>
                      <div className="relative group">
                         <input 
                           ref={examEndRef}
                           type="date"
                           value={termSettings.examEndDate || ''}
                           onChange={e => updateTermSettings({...termSettings, examEndDate: e.target.value})}
                           onClick={() => examEndRef.current?.showPicker?.()}
                           className="w-full bg-white border-none rounded-xl p-3 text-sm font-semibold text-gray-900 shadow-sm pl-10 cursor-pointer"
                         />
                         <span className="material-icons-round absolute left-3 top-3 text-red-400 text-sm pointer-events-none">sports_score</span>
                      </div>
                   </div>
                 </div>
              </div>

              {/* Preferences */}
              <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons-round text-gray-400">dashboard</span>
                    <h3 className="font-bold text-gray-800">Tercihler</h3>
                 </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Dashboard Varsayılan Görünümü</label>
                  <div className="flex bg-white p-1 rounded-xl shadow-sm">
                      {['Today', 'Week', 'Month'].map(view => (
                         <button
                           key={view}
                           onClick={() => updateTermSettings({...termSettings, defaultView: view as any})}
                           className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                              termSettings.defaultView === view 
                                ? 'bg-gray-900 text-white shadow-md' 
                                : 'text-gray-500 hover:bg-gray-100'
                           }`}
                         >
                           {view}
                         </button>
                      ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                 <button onClick={() => showToast('Dönem yapılandırması başarıyla kaydedildi.', 'success')} className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-orange-200">
                    Yapılandırmayı Kaydet
                 </button>
              </div>
           </div>
        )}

        {/* Theme Settings */}
        {activeTab === 'theme' && (
           <div className="space-y-8 animate-fade-in-up">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tema Ayarları</h2>
              
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-500 uppercase">Mod</label>
                 <div className="flex gap-4">
                    {['light', 'dark', 'system'].map(mode => (
                       <div 
                        key={mode}
                        onClick={() => updateAppSettings({...appSettings, theme: mode as any})}
                        className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                           appSettings.theme === mode ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'
                        }`}
                       >
                          <span className="material-icons-round capitalize">{mode === 'system' ? 'settings_brightness' : mode === 'light' ? 'light_mode' : 'dark_mode'}</span>
                          <span className="text-xs font-bold capitalize">{mode}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-500 uppercase">Vurgu Rengi</label>
                 <div className="flex gap-4">
                    {['#f97316', '#0ea5e9', '#8b5cf6', '#10b981', '#ec4899'].map(color => (
                       <div 
                          key={color} 
                          onClick={() => updateAppSettings({...appSettings, accentColor: color})}
                          className={`w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${appSettings.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                          style={{ backgroundColor: color }}
                       >
                          {appSettings.accentColor === color && <span className="material-icons-round text-white text-sm">check</span>}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
           <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Bildirim Ayarları</h2>
              <div className="space-y-4">
                 {[
                    { id: 'email', label: 'Email Bildirimleri', desc: 'Önemli güncellemeler ve haftalık özetler.' },
                    { id: 'examReminders', label: 'Sınav Hatırlatıcıları', desc: 'Sınavdan 2 gün önce bildirim gönder.' },
                    { id: 'taskReminders', label: 'Görev Hatırlatıcıları', desc: 'Son teslim tarihi yaklaşan görevler için uyar.' },
                 ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                       <div>
                          <p className="font-bold text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.desc}</p>
                       </div>
                       <div 
                          onClick={() => updateAppSettings({
                             ...appSettings, 
                             notifications: { 
                                ...appSettings.notifications, 
                                [item.id]: !appSettings.notifications[item.id as keyof typeof appSettings.notifications] 
                             }
                          })}
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                             appSettings.notifications[item.id as keyof typeof appSettings.notifications] ? 'bg-primary-500' : 'bg-gray-200'
                          }`}
                       >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                             appSettings.notifications[item.id as keyof typeof appSettings.notifications] ? 'translate-x-6' : ''
                          }`}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* Backup */}
        {activeTab === 'backup' && (
           <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Veri Yedekleme</h2>
              <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-between mb-6">
                 <div>
                    <p className="font-bold text-gray-800">Son Yedekleme</p>
                    <p className="text-sm text-gray-500">{appSettings.lastBackup || 'Never'}</p>
                 </div>
                 <button onClick={() => showToast('Yedekleme başarıyla oluşturuldu.')} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                    Şimdi Yedekle
                 </button>
              </div>
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-gray-800">Otomatik Yedekleme</h3>
                 <div className="flex gap-4">
                    {['daily', 'weekly', 'manual'].map(freq => (
                       <button
                          key={freq}
                          onClick={() => updateAppSettings({...appSettings, backupFrequency: freq as any})}
                          className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                             appSettings.backupFrequency === freq ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-gray-100 text-gray-400 hover:border-gray-200'
                          }`}
                       >
                          {freq}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* Sync & Export */}
        {activeTab === 'sync' && (
           <div className="space-y-8 animate-fade-in-up">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Entegrasyon & Dışa Aktarma</h2>
              
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-gray-800">Bağlantılar</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <span className="material-icons-round text-blue-500">calendar_today</span>
                          <div>
                             <p className="text-sm font-bold text-gray-900">Google Calendar</p>
                             <p className="text-xs text-gray-400">Son senkron: 10 dk önce</p>
                          </div>
                       </div>
                       <button onClick={() => showToast('Bağlantı kesildi.', 'info')} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Bağlantıyı Kes</button>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between opacity-60">
                       <div className="flex items-center gap-3">
                          <span className="material-icons-round text-gray-800">laptop_mac</span>
                          <div>
                             <p className="text-sm font-bold text-gray-900">Apple Calendar</p>
                             <p className="text-xs text-gray-400">Bağlı değil</p>
                          </div>
                       </div>
                       <button onClick={() => showToast('Bağlantı isteği gönderildi.', 'info')} className="text-xs font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">Bağlan</button>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-gray-800">Veri Dışa Aktarma</h3>
                 <div className="flex flex-wrap gap-3">
                    <button onClick={() => showToast('Dersler PDF olarak indiriliyor...')} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                       <span className="material-icons-round text-sm text-red-500">picture_as_pdf</span> Dersler (PDF)
                    </button>
                    <button onClick={() => showToast('Sınavlar CSV olarak indiriliyor...')} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                       <span className="material-icons-round text-sm text-green-500">table_chart</span> Sınavlar (CSV)
                    </button>
                    <button onClick={() => showToast('Görevler PDF olarak indiriliyor...')} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                       <span className="material-icons-round text-sm text-blue-500">task</span> Görevler (PDF)
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};