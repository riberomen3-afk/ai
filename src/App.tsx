/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Build } from './pages/Build';
import { Dashboard } from './pages/Dashboard';
import { Parties } from './pages/Parties';
import { Search } from './pages/Search';
import { TeamCore } from './types';
import { useFirebase } from './components/FirebaseProvider';
import { DEFAULT_META_TEAMS } from './data/defaultTeams';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const { user, teams: firebaseTeams, saveTeam, deleteTeam } = useFirebase();
  const [localTeams, setLocalTeams] = useState<TeamCore[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    if (user && localTeams.length > 0) {
      const syncTeams = async () => {
        for (const team of localTeams) {
          await saveTeam(team);
        }
        setLocalTeams([]);
      };
      syncTeams();
    }
  }, [user, localTeams, saveTeam]);

  // If user is logged in, use firebaseTeams. If not, use localTeams.
  const teams = user ? firebaseTeams : localTeams;

  const handleDeleteTeam = async (id: string) => {
    if (user) {
      await deleteTeam(id);
    } else {
      setLocalTeams(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleDuplicateTeam = async (team: TeamCore) => {
    const newTeam = {
      ...team,
      id: Math.random().toString(36).substr(2, 9),
      name: `${team.name} (복사본)`,
      createdAt: undefined // Will be set by server if firebase
    };
    
    if (user) {
      await saveTeam(newTeam);
    } else {
      setLocalTeams(prev => [newTeam, ...prev]);
    }
  };

  const handleUpdateTeam = async (updatedTeam: TeamCore) => {
    if (user) {
      await saveTeam(updatedTeam);
    } else {
      setLocalTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    }
  };

  const handleSaveTeam = async (newTeam: TeamCore) => {
    if (user) {
      await saveTeam(newTeam);
    } else {
      setLocalTeams(prev => [newTeam, ...prev]);
    }
  };

  const handleAddMetaTeams = async () => {
    if (user) {
      for (const t of DEFAULT_META_TEAMS) {
        const newTeam = { ...t, id: Math.random().toString(36).substr(2, 9), createdAt: undefined };
        await saveTeam(newTeam);
      }
    } else {
      const newTeams = DEFAULT_META_TEAMS.map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9) }));
      setLocalTeams(prev => [...newTeams, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Pages */}
      <main className="transition-all duration-300">
        {activeTab === 'landing' && <Landing onStart={() => setActiveTab('build')} />}
        {activeTab === 'build' && (
          <Build 
            onSaveTeam={handleSaveTeam}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard />
        )}
        {activeTab === 'search' && (
          <Search />
        )}
        {activeTab === 'parties' && (
          <Parties 
            teams={teams} 
            onDelete={handleDeleteTeam} 
            onDuplicate={handleDuplicateTeam} 
            onUpdate={handleUpdateTeam}
            onAddMetaTeams={handleAddMetaTeams}
            onNavigate={setActiveTab}
          />
        )}
      </main>

      {/* Profile/Footer for Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          <div className="w-6 h-6 bg-white rounded-full border-4 border-primary" />
        </button>
      </div>
    </div>
  );
}
