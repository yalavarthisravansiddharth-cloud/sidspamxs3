import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  DifficultyLevel,
  AnswerType,
  TrainingQuestion,
  TrainingAttempt
} from '../types.ts';
import { apiGetQuestions, apiSaveSession, apiExplainQuestion } from '../api.ts';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Bot,
  Search,
  ExternalLink,
  Mail,
  Smartphone,
  MessageSquare,
  Lock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  Loader2
} from 'lucide-react';

interface TrainingSimulatorProps {
  initialDifficulty?: DifficultyLevel;
  onNavigate: (view: string) => void;
}

export const TrainingSimulator: React.FC<TrainingSimulatorProps> = ({
  initialDifficulty,
  onNavigate
}) => {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(
    initialDifficulty || null
  );
  const [questions, setQuestions] = useState<TrainingQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerType | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<TrainingAttempt[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [isSavingSession, setIsSavingSession] = useState<boolean>(false);

  // Hard mode inspection state
  const [isInspecting, setIsInspecting] = useState<boolean>(false);

  // ShieldAI interaction state
  const [shieldAiResponse, setShieldAiResponse] = useState<string | null>(null);
  const [isShieldAiLoading, setIsShieldAiLoading] = useState<boolean>(false);
  const [customShieldAiPrompt, setCustomShieldAiPrompt] = useState<string>('');

  // Track missed warning signs for the results page
  const [missedWarningSigns, setMissedWarningSigns] = useState<string[]>([]);

  // Load questions whenever difficulty changes
  useEffect(() => {
    if (!selectedDifficulty) return;

    let isMounted = true;
    async function fetchQuestions() {
      setIsLoadingQuestions(true);
      try {
        const fetched = await apiGetQuestions(selectedDifficulty!);
        if (isMounted) {
          // Shuffle questions slightly for variety, take up to 10
          const shuffled = [...fetched].sort(() => 0.5 - Math.random()).slice(0, 10);
          setQuestions(shuffled);
          setCurrentIndex(0);
          setScore(0);
          setSelectedAnswer(null);
          setHasAnswered(false);
          setIsCompleted(false);
          setAttempts([]);
          setMissedWarningSigns([]);
          setIsInspecting(false);
          setShieldAiResponse(null);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load questions', 'error', 'Error');
      } finally {
        if (isMounted) setIsLoadingQuestions(false);
      }
    }

    fetchQuestions();
    return () => {
      isMounted = false;
    };
  }, [selectedDifficulty]);

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = (answer: AnswerType) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedAnswer(answer);
    setHasAnswered(true);

    const isCorrect = answer === currentQuestion.correct_answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      // Record missed warning signs
      if (currentQuestion.warning_signs && currentQuestion.warning_signs.length > 0) {
        setMissedWarningSigns(prev => [...prev, ...currentQuestion.warning_signs]);
      }
    }

    setAttempts(prev => [
      ...prev,
      {
        question_id: currentQuestion.id,
        selected_answer: answer,
        correct: isCorrect
      }
    ]);
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setIsInspecting(false);
      setShieldAiResponse(null);
      setCustomShieldAiPrompt('');
    } else {
      // Final question answered - finish level!
      await finishTrainingSession();
    }
  };

  const finishTrainingSession = async () => {
    setIsCompleted(true);
    const finalScore = score + (selectedAnswer === currentQuestion?.correct_answer ? 1 : 0);
    const totalQ = questions.length || 10;
    const finalPercentage = Math.round((finalScore / totalQ) * 100);

    if (finalPercentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Save session to backend
    setIsSavingSession(true);
    try {
      await apiSaveSession({
        difficulty: selectedDifficulty!,
        score: finalScore,
        total_questions: totalQ,
        attempts
      });
    } catch (err) {
      console.error('Failed saving session:', err);
    } finally {
      setIsSavingSession(false);
    }
  };

  const handleRestartLevel = () => {
    if (selectedDifficulty) {
      const currentDiff = selectedDifficulty;
      setSelectedDifficulty(null);
      setTimeout(() => {
        setSelectedDifficulty(currentDiff);
      }, 50);
    }
  };

  // ShieldAI interaction
  const handleAskShieldAi = async (queryText: string) => {
    if (!currentQuestion) return;
    setIsShieldAiLoading(true);
    try {
      const response = await apiExplainQuestion({
        questionText: currentQuestion.message,
        sender: currentQuestion.sender,
        correctAnswer: currentQuestion.correct_answer,
        userAnswer: selectedAnswer || undefined,
        userQuery: queryText
      });
      setShieldAiResponse(response);
    } catch (err: any) {
      showToast('ShieldAI was unable to answer right now.', 'warning', 'AI Assistant');
    } finally {
      setIsShieldAiLoading(false);
    }
  };

  // =========================================================================
  // VIEW: DIFFICULTY SELECTOR
  // =========================================================================
  if (!selectedDifficulty) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            CHOOSE SIMULATION MODE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Training Difficulty
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Each level contains 10 interactive scenarios. Read the simulated messages, analyze warning signs, and make your call.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Beginner Card */}
          <div
            onClick={() => setSelectedDifficulty('beginner')}
            className="group relative rounded-2xl bg-slate-900/80 border border-emerald-500/30 p-7 hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🟢</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LEVEL 1
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Beginner
              </h3>
              <p className="text-xs font-medium text-emerald-400/90 mb-3">Learn the Basics</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Identify obvious spam and scam messages using common warning signs like fake prizes, urgent countdowns, and password requests.
              </p>
              <div className="text-[11px] text-slate-400 space-y-1.5 font-mono mb-6">
                <div>• 10 questions per run</div>
                <div>• Obvious red flag cues</div>
                <div>• Instant educational recaps</div>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 group-hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5">
              <span>Start Beginner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Intermediate Card */}
          <div
            onClick={() => setSelectedDifficulty('intermediate')}
            className="group relative rounded-2xl bg-slate-900/80 border border-amber-500/30 p-7 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🟡</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  LEVEL 2
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Intermediate
              </h3>
              <p className="text-xs font-medium text-amber-400/90 mb-3">Test Your Attention</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Analyze realistic-looking messages where the warning signs are less obvious. Requires context analysis and link domain scrutiny.
              </p>
              <div className="text-[11px] text-slate-400 space-y-1.5 font-mono mb-6">
                <div>• 10 realistic scenarios</div>
                <div>• Account & delivery lures</div>
                <div>• Context-sensitive indicators</div>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 group-hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5">
              <span>Start Intermediate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hard Card */}
          <div
            onClick={() => setSelectedDifficulty('hard')}
            className="group relative rounded-2xl bg-slate-900/80 border border-rose-500/40 p-7 hover:border-rose-400 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🔴</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  LEVEL 3 • HARD
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                Hard Mode
              </h3>
              <p className="text-xs font-medium text-rose-400/90 mb-3">Challenge Your Skills</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Inspect sophisticated-looking messages. Use the <strong>🔍 Inspect Message</strong> tool to analyze sender headers, raw domains, and pretext authority.
              </p>
              <div className="text-[11px] text-slate-400 space-y-1.5 font-mono mb-6">
                <div>• 10 advanced spear-phishing cases</div>
                <div>• Header & domain inspector included</div>
                <div>• IT & MFA bypass scenarios</div>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-500 text-slate-950 group-hover:bg-rose-400 transition-colors flex items-center justify-center gap-1.5">
              <span>Launch Hard Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingQuestions) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-1">Loading Training Scenarios...</h3>
        <p className="text-xs text-slate-400">Bootstrapping safe simulated emails and SMS vectors</p>
      </div>
    );
  }

  // =========================================================================
  // VIEW: RESULTS SCREEN (COMPLETED)
  // =========================================================================
  if (isCompleted) {
    const totalQ = questions.length || 10;
    const finalPercentage = Math.round((score / totalQ) * 100);
    const uniqueMissedSigns = Array.from(new Set(missedWarningSigns));

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 mx-auto mb-6 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-3xl">
              🏆
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
            Training Complete
          </h2>
          <p className="text-xs uppercase font-mono tracking-wider text-cyan-400 mb-6">
            Difficulty: {selectedDifficulty.toUpperCase()}
          </p>

          {/* Score card grid */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl font-extrabold text-white">{score} / {totalQ}</div>
              <div className="text-[11px] text-slate-400 font-medium">Score</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className={`text-2xl font-extrabold ${finalPercentage >= 80 ? 'text-emerald-400' : finalPercentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {finalPercentage}%
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Accuracy</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-2xl font-extrabold text-cyan-400">{totalQ}</div>
              <div className="text-[11px] text-slate-400 font-medium">Completed</div>
            </div>
          </div>

          {/* User notification about saving */}
          <div className="mb-8 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {user
                ? `Results saved to your profile (${user.display_name}).`
                : 'Session completed as guest. Create an account to log lifetime progress!'}
            </span>
          </div>

          {/* Warning signs to remember */}
          {uniqueMissedSigns.length > 0 && (
            <div className="text-left mb-8 p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 max-w-xl mx-auto">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wide mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Warning signs you should remember:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {uniqueMissedSigns.slice(0, 5).map((sign, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartLevel}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Level</span>
            </button>
            <button
              onClick={() => setSelectedDifficulty(null)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Choose Another Level</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: ACTIVE QUESTION SIMULATOR
  // =========================================================================
  const totalQuestions = questions.length || 10;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const getDifficultyColor = () => {
    if (selectedDifficulty === 'beginner') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (selectedDifficulty === 'intermediate') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getMessageTypeIcon = () => {
    if (currentQuestion?.message_type === 'SMS') return <Smartphone className="w-4 h-4 text-cyan-400" />;
    if (currentQuestion?.message_type === 'Chat Message') return <MessageSquare className="w-4 h-4 text-purple-400" />;
    return <Mail className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Simulator Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-xs uppercase font-mono font-bold px-3 py-1 rounded-full border ${getDifficultyColor()}`}>
            {selectedDifficulty.toUpperCase()}
          </span>
          <span className="text-sm font-bold text-white">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Score: <span className="text-cyan-400">{score}</span>
          </div>
          <button
            onClick={() => setSelectedDifficulty(null)}
            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Exit Level</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-6 border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Message Container Styled Like Email / SMS Client */}
      <div className="rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden mb-6">
        {/* Header Ribbon */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
              {getMessageTypeIcon()}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{currentQuestion.sender}</span>
                <span className="text-[10px] text-slate-400 font-mono">({currentQuestion.sender_email})</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Channel: <span className="text-slate-300">{currentQuestion.message_type}</span> • Category: <span className="text-cyan-400">{currentQuestion.category}</span>
              </div>
            </div>
          </div>

          {/* Hard Mode Message Inspector Toggle */}
          {selectedDifficulty === 'hard' && (
            <button
              onClick={() => setIsInspecting(!isInspecting)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isInspecting
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-cyan-500/30'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isInspecting ? 'Hide Inspector' : '🔍 Inspect Message'}</span>
            </button>
          )}
        </div>

        {/* Hard Mode Inspection Drawer */}
        {isInspecting && currentQuestion.inspection_details && (
          <div className="p-4 sm:p-5 bg-slate-950 border-b border-cyan-500/30 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
              <Search className="w-4 h-4" />
              <span>Hard Mode Deep Security Inspector</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Sender Domain</span>
                <span className="text-slate-200 font-mono break-all">{currentQuestion.inspection_details.sender_domain}</span>
              </div>
              {currentQuestion.inspection_details.link_domain && (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Link Destination Domain</span>
                  <span className="text-amber-300 font-mono break-all">{currentQuestion.inspection_details.link_domain}</span>
                </div>
              )}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Urgency Rating</span>
                <span className={`font-bold ${currentQuestion.inspection_details.urgency_level === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                  {currentQuestion.inspection_details.urgency_level}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Requested Information</span>
                <span className="text-slate-200">{currentQuestion.inspection_details.requested_info}</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Pretext & Context</span>
              <p className="text-slate-300">{currentQuestion.inspection_details.context}</p>
            </div>
          </div>
        )}

        {/* Message Body Content */}
        <div className="p-6 sm:p-8">
          <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans whitespace-pre-line mb-6">
            {currentQuestion.message}
          </div>

          {/* Fictional Link Preview Pill */}
          {currentQuestion.fictional_link && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-mono text-cyan-300 truncate">
                  {currentQuestion.fictional_link}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0 uppercase tracking-wider font-mono">
                Fictional Link (Safe)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Decision Buttons (Safe / Suspicious / Spam) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* SAFE BUTTON */}
        <button
          onClick={() => handleSelectAnswer('Safe')}
          disabled={hasAnswered}
          className={`py-4 px-5 rounded-2xl font-bold text-sm sm:text-base border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            hasAnswered
              ? currentQuestion.correct_answer === 'Safe'
                ? 'bg-emerald-900/60 border-emerald-400 text-emerald-100 cyber-glow-safe'
                : selectedAnswer === 'Safe'
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 opacity-80'
                : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-40'
              : 'bg-slate-900 hover:bg-emerald-950/50 text-slate-200 hover:text-emerald-300 border-slate-700/80 hover:border-emerald-500/60 active:scale-98'
          }`}
        >
          <span className="text-lg">✅</span>
          <span>Safe</span>
        </button>

        {/* SUSPICIOUS BUTTON */}
        <button
          onClick={() => handleSelectAnswer('Suspicious')}
          disabled={hasAnswered}
          className={`py-4 px-5 rounded-2xl font-bold text-sm sm:text-base border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            hasAnswered
              ? currentQuestion.correct_answer === 'Suspicious'
                ? 'bg-amber-900/60 border-amber-400 text-amber-100 cyber-glow-warning'
                : selectedAnswer === 'Suspicious'
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 opacity-80'
                : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-40'
              : 'bg-slate-900 hover:bg-amber-950/50 text-slate-200 hover:text-amber-300 border-slate-700/80 hover:border-amber-500/60 active:scale-98'
          }`}
        >
          <span className="text-lg">⚠️</span>
          <span>Suspicious</span>
        </button>

        {/* SPAM BUTTON */}
        <button
          onClick={() => handleSelectAnswer('Spam')}
          disabled={hasAnswered}
          className={`py-4 px-5 rounded-2xl font-bold text-sm sm:text-base border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            hasAnswered
              ? currentQuestion.correct_answer === 'Spam'
                ? 'bg-rose-900/60 border-rose-400 text-rose-100 cyber-glow-danger'
                : selectedAnswer === 'Spam'
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 opacity-80'
                : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-40'
              : 'bg-slate-900 hover:bg-rose-950/50 text-slate-200 hover:text-rose-300 border-slate-700/80 hover:border-rose-500/60 active:scale-98'
          }`}
        >
          <span className="text-lg">🚨</span>
          <span>Spam</span>
        </button>
      </div>

      {/* FEEDBACK & EDUCATIONAL EXPLANATION (When Answered) */}
      {hasAnswered && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div
            className={`p-6 rounded-2xl border ${
              selectedAnswer === currentQuestion.correct_answer
                ? 'bg-emerald-950/40 border-emerald-500/40'
                : 'bg-rose-950/40 border-rose-500/40'
            }`}
          >
            {/* Status Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-base font-bold text-emerald-300">Correct! (+1 Point)</span>
                      <p className="text-xs text-slate-300">
                        This message is indeed classified as <strong>{currentQuestion.correct_answer}</strong>.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-base font-bold text-rose-300">Incorrect (+0)</span>
                      <p className="text-xs text-slate-300">
                        You chose <strong>{selectedAnswer}</strong>, but the correct answer is{' '}
                        <strong className="text-white">{currentQuestion.correct_answer}</strong>.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Explanation text */}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
              {currentQuestion.explanation}
            </div>

            {/* Warning Signs List */}
            {currentQuestion.warning_signs && currentQuestion.warning_signs.length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  Key Warning Signs Identified:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.warning_signs.map((sign, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300"
                    >
                      ⚠️ {sign}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive "Ask ShieldAI" Panel */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>🤖 Ask ShieldAI Mentor</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Gemini-Powered</span>
            </div>

            {/* Quick Prompt Buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => handleAskShieldAi('What warning signs did I miss?')}
                disabled={isShieldAiLoading}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                "What warning signs did I miss?"
              </button>
              <button
                onClick={() => handleAskShieldAi('Why was this suspicious?')}
                disabled={isShieldAiLoading}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                "Why was this suspicious?"
              </button>
              <button
                onClick={() => handleAskShieldAi('How can I verify this safely?')}
                disabled={isShieldAiLoading}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                "How can I verify this safely?"
              </button>
            </div>

            {/* Custom Query Input */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={customShieldAiPrompt}
                onChange={e => setCustomShieldAiPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customShieldAiPrompt.trim()) {
                    handleAskShieldAi(customShieldAiPrompt);
                    setCustomShieldAiPrompt('');
                  }
                }}
                placeholder="Ask ShieldAI any cybersecurity question about this..."
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => {
                  if (customShieldAiPrompt.trim()) {
                    handleAskShieldAi(customShieldAiPrompt);
                    setCustomShieldAiPrompt('');
                  }
                }}
                disabled={isShieldAiLoading || !customShieldAiPrompt.trim()}
                className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* ShieldAI Loading Spinner */}
            {isShieldAiLoading && (
              <div className="p-3 rounded-xl bg-slate-950 flex items-center gap-2 text-xs text-cyan-300">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>ShieldAI is analyzing the scenario...</span>
              </div>
            )}

            {/* ShieldAI Response Box */}
            {shieldAiResponse && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line animate-in fade-in">
                {shieldAiResponse}
              </div>
            )}
          </div>

          {/* NEXT QUESTION BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              className="py-3 px-8 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'Next Question →' : 'View Final Results 🏆'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
