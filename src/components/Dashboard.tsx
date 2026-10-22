import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiGetDashboardStats } from '../api.ts';
import { DashboardStats, Achievement } from '../types.ts';
import {
  Shield,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Clock,
  Target,
  Zap,
  Lock,
  User,
  Loader2
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string, extra?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, openAuthModal } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await apiGetDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed loading dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, [user]);

  // If user is not logged in, show an interactive Guest Preview with a 1-click Sign In prompt
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Sign In to Access Your Security Dashboard
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          Track your personal training progress, earn achievements, view score analytics across Beginner, Intermediate, and Hard levels.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            Log In / Demo Access
          </button>
          <button
            onClick={() => onNavigate('training')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all"
          >
            Train as Guest
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading your cybersecurity stats...</p>
      </div>
    );
  }

  // Calculate achievements based on user stats
  const totalCompleted = stats?.questionsCompleted || 0;
  const accuracy = stats?.accuracy || 0;
  const sessionsCount = stats?.totalSessions || 0;
  const bestHard = stats?.bestScores.hard.percentage || 0;

  const achievements: Achievement[] = [
    {
      id: 'ach-first',
      title: 'First Training',
      description: 'Complete your first training session.',
      icon: '🏅',
      unlocked: sessionsCount >= 1,
      progress: `${Math.min(sessionsCount, 1)} / 1`
    },
    {
      id: 'ach-perfect',
      title: 'Perfect Score',
      description: 'Achieve 100% accuracy on any difficulty run.',
      icon: '🎯',
      unlocked: (stats?.bestScores.beginner.percentage === 100) ||
                (stats?.bestScores.intermediate.percentage === 100) ||
                (stats?.bestScores.hard.percentage === 100),
      progress: (stats?.bestScores.beginner.percentage === 100) ? 'Unlocked!' : 'Best: ' + Math.max(stats?.bestScores.beginner.percentage || 0, stats?.bestScores.intermediate.percentage || 0, stats?.bestScores.hard.percentage || 0) + '%'
    },
    {
      id: 'ach-learner',
      title: 'Security Learner',
      description: 'Complete at least 20 training questions.',
      icon: '🧠',
      unlocked: totalCompleted >= 20,
      progress: `${Math.min(totalCompleted, 20)} / 20`
    },
    {
      id: 'ach-hard',
      title: 'Advanced Defender',
      description: 'Score 70% or higher on Hard inspection mode.',
      icon: '🔥',
      unlocked: bestHard >= 70,
      progress: `${bestHard}% / 70%`
    },
    {
      id: 'ach-streak',
      title: 'Spotter Elite',
      description: 'Attain an overall platform accuracy of 80% or higher.',
      icon: '🛡️',
      unlocked: accuracy >= 80 && totalCompleted >= 10,
      progress: `${accuracy}% / 80%`
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            CYBER CADET PROFILE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user.display_name} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Account: <span className="text-slate-300 font-mono">{user.email}</span> • Role:{' '}
            <span className="text-cyan-400 font-bold uppercase">{user.role}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('training')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Start Training</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('analyzer')}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800 border border-slate-700 hover:bg-slate-750 transition-colors"
          >
            AI Analyzer
          </button>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Questions Completed</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats?.questionsCompleted || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across all difficulty levels</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Correct Answers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{stats?.correctAnswers || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Confirmed threat catches</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Overall Accuracy</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats?.accuracy || 0}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Lifetime precision rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Training Sessions</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats?.totalSessions || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Completed simulation runs</div>
        </div>
      </div>

      {/* Best Scores Section */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Best Scores by Difficulty</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Beginner Best */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span>🟢</span> Beginner
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {stats?.bestScores.beginner.score || 0} / {stats?.bestScores.beginner.total || 10}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${stats?.bestScores.beginner.percentage || 0}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Accuracy: {stats?.bestScores.beginner.percentage || 0}%</span>
              <button
                onClick={() => onNavigate('training', { difficulty: 'beginner' })}
                className="text-cyan-400 hover:underline"
              >
                Retrain →
              </button>
            </div>
          </div>

          {/* Intermediate Best */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span>🟡</span> Intermediate
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {stats?.bestScores.intermediate.score || 0} / {stats?.bestScores.intermediate.total || 10}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${stats?.bestScores.intermediate.percentage || 0}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Accuracy: {stats?.bestScores.intermediate.percentage || 0}%</span>
              <button
                onClick={() => onNavigate('training', { difficulty: 'intermediate' })}
                className="text-cyan-400 hover:underline"
              >
                Retrain →
              </button>
            </div>
          </div>

          {/* Hard Best */}
          <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <span>🔴</span> Hard Mode
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {stats?.bestScores.hard.score || 0} / {stats?.bestScores.hard.total || 10}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-rose-500 transition-all"
                style={{ width: `${stats?.bestScores.hard.percentage || 0}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Accuracy: {stats?.bestScores.hard.percentage || 0}%</span>
              <button
                onClick={() => onNavigate('training', { difficulty: 'hard' })}
                className="text-cyan-400 hover:underline"
              >
                Inspect →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Security Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all ${
                ach.unlocked
                  ? 'bg-slate-950/80 border-cyan-500/40 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-50 text-slate-500'
              }`}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <h4 className={`text-xs font-bold mb-1 ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                {ach.title}
              </h4>
              <p className="text-[11px] leading-relaxed mb-3">{ach.description}</p>
              <div className="text-[10px] font-mono flex items-center justify-between border-t border-slate-800/60 pt-2">
                <span>{ach.unlocked ? 'Unlocked' : 'In Progress'}</span>
                <span className={ach.unlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {ach.progress}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Training Activity Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Recent Training Activity</span>
        </h3>

        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats.recentActivity.map((session, idx) => (
                  <tr key={session.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {new Date(session.completed_at).toLocaleDateString()}{' '}
                      <span className="text-slate-500 text-[10px]">
                        {new Date(session.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        session.difficulty === 'beginner'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : session.difficulty === 'intermediate'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {session.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {session.score} / {session.total_questions}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={session.percentage >= 80 ? 'text-emerald-400' : session.percentage >= 60 ? 'text-amber-400' : 'text-rose-400'}>
                        {session.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Logged
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No recent activity recorded yet. Start your first simulation!
          </div>
        )}
      </div>
    </div>
  );
};
