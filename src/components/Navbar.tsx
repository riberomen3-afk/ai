import React, { useState } from 'react';
import { Layout, BarChart, Search, Users, UserCircle, Wand2, LogOut } from 'lucide-react';
import { useFirebase } from './FirebaseProvider';
import { loginWithGoogle, logout } from '../services/firebase';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useFirebase();
  const [showDropdown, setShowDropdown] = useState(false);

  const tabs = [
    { id: 'landing', label: '홈', icon: Layout },
    { id: 'build', label: 'AI 빌드', icon: Wand2 },
    { id: 'dashboard', label: '대시보드', icon: BarChart },
    { id: 'search', label: '검색', icon: Search },
    { id: 'parties', label: '나의 파티', icon: Users },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-surface-container-high z-50 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('landing')}>
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full border-2 border-primary" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tighter">
          Champion's <span className="text-primary">Party</span>
        </h1>
      </div>

      <div className="hidden md:flex gap-8">
        {tabs.slice(1).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors relative ${
              activeTab === tab.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute -bottom-[22px] h-0.5 w-full bg-primary rounded-full transition-all" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 relative">
        {user ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 pl-3 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors"
            >
              <span className="text-xs font-bold text-on-surface truncate max-w-[100px]">{user.displayName || user.email}</span>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-primary shadow-sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {user.displayName?.[0] || user.email?.[0]}
                </div>
              )}
            </button>
            
            {showDropdown && (
              <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-2xl border border-surface-container p-2 flex flex-col gap-1 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-300">
                <button 
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2 p-3 text-sm font-bold text-error hover:bg-error-container rounded-lg transition-colors w-full text-left"
                >
                  <LogOut size={18} />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => loginWithGoogle()}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-full font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <UserCircle size={20} />
            로그인
          </button>
        )}
      </div>
    </nav>
  );
};
