import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  apiGetAdminStats,
  apiGetQuestions,
  apiCreateQuestion,
  apiUpdateQuestion,
  apiDeleteQuestion
} from '../api.ts';
import { AdminStats, TrainingQuestion, DifficultyLevel, AnswerType, MessageType } from '../types.ts';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Database,
  BarChart2,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  X,
  Check,
  AlertTriangle,
  Lock,
  Loader2,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, quickLogin } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [questions, setQuestions] = useState<TrainingQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // Modal states
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<TrainingQuestion | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  // Form State
  const [formDifficulty, setFormDifficulty] = useState<DifficultyLevel>('beginner');
  const [formCategory, setFormCategory] = useState<string>('Delivery');
  const [formSender, setFormSender] = useState<string>('');
  const [formSenderEmail, setFormSenderEmail] = useState<string>('');
  const [formMessageType, setFormMessageType] = useState<MessageType>('Email');
  const [formMessage, setFormMessage] = useState<string>('');
  const [formFictionalLink, setFormFictionalLink] = useState<string>('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<AnswerType>('Suspicious');
  const [formExplanation, setFormExplanation] = useState<string>('');
  const [formWarningSigns, setFormWarningSigns] = useState<string>('');
  const [isSavingQuestion, setIsSavingQuestion] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      if (!user || user.role !== 'ADMIN') {
        setIsLoading(false);
        return;
      }
      try {
        const [statsData, questionsData] = await Promise.all([
          apiGetAdminStats(),
          apiGetQuestions()
        ]);
        setStats(statsData);
        setQuestions(questionsData);
      } catch (err) {
        console.error('Failed loading admin data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  // Authorization Guard: Non-Admin Access Denied
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          Admin Access Required
        </h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          The Admin Studio route is restricted to authorized platform administrators. You cannot access question management without the <code>ADMIN</code> role.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => quickLogin('ADMIN')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md"
          >
            1-Click Demo Admin Login
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 hover:text-white"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading SecOps Admin Portal...</p>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormDifficulty('beginner');
    setFormCategory('Delivery');
    setFormSender('');
    setFormSenderEmail('');
    setFormMessageType('Email');
    setFormMessage('');
    setFormFictionalLink('');
    setFormCorrectAnswer('Suspicious');
    setFormExplanation('');
    setFormWarningSigns('');
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditModal = (q: TrainingQuestion) => {
    setEditingQuestion(q);
    setFormDifficulty(q.difficulty);
    setFormCategory(q.category);
    setFormSender(q.sender);
    setFormSenderEmail(q.sender_email);
    setFormMessageType(q.message_type);
    setFormMessage(q.message);
    setFormFictionalLink(q.fictional_link || '');
    setFormCorrectAnswer(q.correct_answer);
    setFormExplanation(q.explanation);
    setFormWarningSigns(q.warning_signs ? q.warning_signs.join(', ') : '');
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingQuestion(true);

    const signs = formWarningSigns
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      if (editingQuestion) {
        const updated = await apiUpdateQuestion(editingQuestion.id, {
          difficulty: formDifficulty,
          category: formCategory,
          sender: formSender,
          sender_email: formSenderEmail,
          message_type: formMessageType,
          message: formMessage,
          fictional_link: formFictionalLink,
          correct_answer: formCorrectAnswer,
          explanation: formExplanation,
          warning_signs: signs
        });

        setQuestions(prev => prev.map(q => (q.id === updated.id ? updated : q)));
        showToast('Question updated successfully', 'success', 'Admin Studio');
      } else {
        const created = await apiCreateQuestion({
          difficulty: formDifficulty,
          category: formCategory,
          sender: formSender,
          sender_email: formSenderEmail || 'noreply@simulated-domain.invalid',
          message_type: formMessageType,
          message: formMessage,
          fictional_link: formFictionalLink,
          correct_answer: formCorrectAnswer,
          explanation: formExplanation,
          warning_signs: signs.length > 0 ? signs : ['Generic suspicious indicators']
        });

        setQuestions(prev => [created, ...prev]);
        showToast('New question created in database', 'success', 'Admin Studio');
      }

      setIsQuestionModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed saving question', 'error', 'Error');
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await apiDeleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      setDeletingQuestionId(null);
      showToast('Question permanently deleted', 'info', 'Admin Studio');
    } catch (err: any) {
      showToast(err.message || 'Failed deleting question', 'error', 'Error');
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesDiff = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    const matchesSearch =
      q.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Admin Studio Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            🛡️ SECOPS MANAGEMENT PORTAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Studio & Question Manager
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Audit platform-wide training telemetry, add/edit simulation questions, and configure defensive curriculum.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Platform Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Registered Students</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats?.totalUsers || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active student profiles</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Total Simulations Run</span>
            <BarChart2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats?.totalSessions || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Completed student attempts</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Average Platform Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{stats?.averageAccuracy || 0}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Benchmark student score</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Questions in Database</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{questions.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Beginner, Interm. & Hard</div>
        </div>
      </div>

      {/* Difficulty Breakdown Pill Row */}
      {stats?.difficultyBreakdown && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 block">🟢 Beginner Tier</span>
              <span className="text-xs text-slate-400">{stats.difficultyBreakdown.beginner.sessions} sessions completed</span>
            </div>
            <span className="text-sm font-mono font-bold text-white px-2.5 py-1 bg-slate-950 rounded-lg">
              {stats.difficultyBreakdown.beginner.questions} questions
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 block">🟡 Intermediate Tier</span>
              <span className="text-xs text-slate-400">{stats.difficultyBreakdown.intermediate.sessions} sessions completed</span>
            </div>
            <span className="text-sm font-mono font-bold text-white px-2.5 py-1 bg-slate-950 rounded-lg">
              {stats.difficultyBreakdown.intermediate.questions} questions
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-400 block">🔴 Hard Mode</span>
              <span className="text-xs text-slate-400">{stats.difficultyBreakdown.hard.sessions} sessions completed</span>
            </div>
            <span className="text-sm font-mono font-bold text-white px-2.5 py-1 bg-slate-950 rounded-lg">
              {stats.difficultyBreakdown.hard.questions} questions
            </span>
          </div>
        </div>
      )}

      {/* Question Management Table & Filter Toolbar */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Curriculum Question Manager ({filteredQuestions.length})
          </h3>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search questions or senders..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter difficulty */}
            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Diff</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Sender & Message</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Verdict</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredQuestions.map(q => (
                <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      q.difficulty === 'beginner'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : q.difficulty === 'intermediate'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">{q.category}</td>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-bold text-white truncate">{q.sender}</div>
                    <div className="text-[11px] text-slate-400 truncate">{q.message}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{q.message_type}</td>
                  <td className="py-3 px-3 font-bold font-mono">
                    <span className={
                      q.correct_answer === 'Safe'
                        ? 'text-emerald-400'
                        : q.correct_answer === 'Suspicious'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }>
                      {q.correct_answer}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Question"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingQuestionId(q.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM DELETE DIALOG */}
      {deletingQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Confirm Deletion</h4>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to delete this training scenario? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingQuestionId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuestion(deletingQuestionId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Delete Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT QUESTION MODAL */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8">
            <button
              onClick={() => setIsQuestionModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-6">
              {editingQuestion ? 'Edit Simulation Question' : 'Add New Simulation Question'}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={e => setFormDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    placeholder="e.g. Delivery, Banking, Work"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Message Type</label>
                  <select
                    value={formMessageType}
                    onChange={e => setFormMessageType(e.target.value as MessageType)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="Chat Message">Chat Message</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sender Name</label>
                  <input
                    type="text"
                    required
                    value={formSender}
                    onChange={e => setFormSender(e.target.value)}
                    placeholder="e.g. Campus Security"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sender Email / Handle</label>
                  <input
                    type="text"
                    value={formSenderEmail}
                    onChange={e => setFormSenderEmail(e.target.value)}
                    placeholder="e.g. security@campus-support.invalid"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Message Body</label>
                <textarea
                  rows={4}
                  required
                  value={formMessage}
                  onChange={e => setFormMessage(e.target.value)}
                  placeholder="The simulated message text..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fictional Link (Optional)</label>
                  <input
                    type="text"
                    value={formFictionalLink}
                    onChange={e => setFormFictionalLink(e.target.value)}
                    placeholder="https://example.invalid/link"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Correct Answer</label>
                  <select
                    value={formCorrectAnswer}
                    onChange={e => setFormCorrectAnswer(e.target.value as AnswerType)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-bold"
                  >
                    <option value="Safe">Safe</option>
                    <option value="Suspicious">Suspicious</option>
                    <option value="Spam">Spam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Educational Explanation</label>
                <textarea
                  rows={3}
                  required
                  value={formExplanation}
                  onChange={e => setFormExplanation(e.target.value)}
                  placeholder="Explain why this message is safe/suspicious/spam..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Warning Signs (comma separated)
                </label>
                <input
                  type="text"
                  value={formWarningSigns}
                  onChange={e => setFormWarningSigns(e.target.value)}
                  placeholder="e.g. Lookalike domain, High urgency, Password request"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingQuestion}
                  className="px-6 py-2 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSavingQuestion ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
