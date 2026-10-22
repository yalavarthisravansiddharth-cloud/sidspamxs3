export type DifficultyLevel = 'beginner' | 'intermediate' | 'hard';
export type AnswerType = 'Safe' | 'Suspicious' | 'Spam';
export type MessageType = 'Email' | 'SMS' | 'Chat Message';

export interface User {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  created_at: string;
}

export interface InspectionDetails {
  sender_domain: string;
  link_domain?: string;
  urgency_level: 'Low' | 'Medium' | 'Critical';
  requested_info: string;
  context: string;
  flags: string[];
}

export interface TrainingQuestion {
  id: string;
  difficulty: DifficultyLevel;
  category: string;
  sender: string;
  sender_email: string;
  message_type: MessageType;
  message: string;
  fictional_link?: string;
  correct_answer: AnswerType;
  explanation: string;
  warning_signs: string[];
  inspection_details?: InspectionDetails;
  created_at?: string;
}

export interface TrainingAttempt {
  question_id: string;
  selected_answer: AnswerType;
  correct: boolean;
}

export interface TrainingSession {
  id: string;
  user_id: string;
  difficulty: DifficultyLevel;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
  user_name?: string;
  user_email?: string;
}

export interface DashboardStats {
  questionsCompleted: number;
  correctAnswers: number;
  accuracy: number;
  totalSessions: number;
  bestScores: {
    beginner: { score: number; total: number; percentage: number };
    intermediate: { score: number; total: number; percentage: number };
    hard: { score: number; total: number; percentage: number };
  };
  recentActivity: TrainingSession[];
}

export interface AdminStats {
  totalUsers: number;
  totalSessions: number;
  totalQuestions: number;
  totalQuestionsAnswered: number;
  averageAccuracy: number;
  difficultyBreakdown: {
    beginner: { questions: number; sessions: number };
    intermediate: { questions: number; sessions: number };
    hard: { questions: number; sessions: number };
  };
  recentSessions: TrainingSession[];
}

export interface RiskIndicator {
  category: string;
  detected: boolean;
  severity: 'Critical' | 'Warning' | 'Low';
  details: string;
}

export interface MessageAnalysis {
  verdict: AnswerType;
  risk_score: number;
  confidence: 'High' | 'Medium' | 'Low';
  summary: string;
  indicators: RiskIndicator[];
  recommendation: string;
  safe_verification_steps: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: string;
}
