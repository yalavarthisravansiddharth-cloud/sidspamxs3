import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { Home } from './components/Home.tsx';
import { TrainingSimulator } from './components/TrainingSimulator.tsx';
import { MessageAnalyzer } from './components/MessageAnalyzer.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { SafetyTips } from './components/SafetyTips.tsx';
import { RedFlags } from './components/RedFlags.tsx';
import { About } from './components/About.tsx';
import { Privacy } from './components/Privacy.tsx';
import { Terms } from './components/Terms.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { DifficultyLevel } from './types.ts';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [trainingDifficulty, setTrainingDifficulty] = useState<DifficultyLevel | undefined>(undefined);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Sync hash routing if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        if (hash.startsWith('training-')) {
          const diff = hash.replace('training-', '') as DifficultyLevel;
          setTrainingDifficulty(diff);
          setCurrentView('training');
        } else {
          setCurrentView(hash);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (view: string, extra?: { difficulty?: DifficultyLevel }) => {
    if (view === 'training') {
      setTrainingDifficulty(extra?.difficulty);
      window.location.hash = extra?.difficulty ? `training-${extra.difficulty}` : 'training';
    } else {
      window.location.hash = view;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070d18] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Sticky Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && <Home onNavigate={handleNavigate} />}
        
        {currentView === 'training' && (
          <TrainingSimulator
            key={trainingDifficulty || 'default'}
            initialDifficulty={trainingDifficulty}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'analyzer' && <MessageAnalyzer />}

        {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}

        {currentView === 'admin' && <AdminDashboard onNavigate={handleNavigate} />}

        {currentView === 'safety-tips' && <SafetyTips onNavigate={handleNavigate} />}

        {currentView === 'red-flags' && <RedFlags onNavigate={handleNavigate} />}

        {currentView === 'about' && <About onNavigate={handleNavigate} />}

        {currentView === 'privacy' && <Privacy />}

        {currentView === 'terms' && <Terms />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      <AuthModal />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
