import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SEED_QUESTIONS, TrainingQuestion } from './seedData.ts';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  password_hash: string;
  role: 'USER' | 'ADMIN';
  created_at: string;
  updated_at: string;
}

export interface TrainingAttempt {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: 'Safe' | 'Suspicious' | 'Spam';
  correct: boolean;
  created_at: string;
}

export interface TrainingSession {
  id: string;
  user_id: string;
  difficulty: 'beginner' | 'intermediate' | 'hard';
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

export interface DatabaseSchema {
  profiles: UserProfile[];
  training_questions: TrainingQuestion[];
  training_attempts: TrainingAttempt[];
  training_sessions: TrainingSession[];
  active_tokens: Record<string, { userId: string; expiresAt: number }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'spamshield_db.json');

// Password hashing helper
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
  } catch {
    return false;
  }
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.profiles && parsed.training_questions) {
          return parsed;
        }
      } catch (err) {
        console.error('Error reading database file, re-initializing default state:', err);
      }
    }

    // Default Seed state
    const demoAdminId = 'user-admin-01';
    const demoUserId = 'user-demo-01';

    const defaultAdmin: UserProfile = {
      id: demoAdminId,
      user_id: demoAdminId,
      display_name: 'Dr. Sarah Vance (SecOps Lead)',
      email: 'admin@spamshield.org',
      password_hash: hashPassword('AdminShield2026!'),
      role: 'ADMIN',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updated_at: new Date().toISOString()
    };

    const defaultUser: UserProfile = {
      id: demoUserId,
      user_id: demoUserId,
      display_name: 'Alex Rivera (Student)',
      email: 'user@spamshield.org',
      password_hash: hashPassword('CyberShield2026!'),
      role: 'USER',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updated_at: new Date().toISOString()
    };

    // Pre-populate some demo sessions for Alex Rivera to display rich dashboards
    const demoSessions: TrainingSession[] = [
      {
        id: 'sess-01',
        user_id: demoUserId,
        difficulty: 'beginner',
        score: 9,
        total_questions: 10,
        percentage: 90,
        completed_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      },
      {
        id: 'sess-02',
        user_id: demoUserId,
        difficulty: 'intermediate',
        score: 8,
        total_questions: 10,
        percentage: 80,
        completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: 'sess-03',
        user_id: demoUserId,
        difficulty: 'hard',
        score: 7,
        total_questions: 10,
        percentage: 70,
        completed_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
      }
    ];

    const initialData: DatabaseSchema = {
      profiles: [defaultAdmin, defaultUser],
      training_questions: SEED_QUESTIONS,
      training_attempts: [],
      training_sessions: demoSessions,
      active_tokens: {}
    };

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed writing initial DB file:', e);
    }

    return initialData;
  }

  private persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  // Auth & Token management
  createSessionToken(userId: string): string {
    const token = 'sps_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
    this.data.active_tokens[token] = { userId, expiresAt };
    this.persist();
    return token;
  }

  getUserByToken(token: string): UserProfile | null {
    if (!token) return null;
    const session = this.data.active_tokens[token];
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      delete this.data.active_tokens[token];
      this.persist();
      return null;
    }
    return this.data.profiles.find(p => p.id === session.userId) || null;
  }

  destroyToken(token: string) {
    if (this.data.active_tokens[token]) {
      delete this.data.active_tokens[token];
      this.persist();
    }
  }

  // Users
  getUserByEmail(email: string): UserProfile | null {
    return this.data.profiles.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
  }

  getUserById(id: string): UserProfile | null {
    return this.data.profiles.find(p => p.id === id) || null;
  }

  createUser(displayName: string, email: string, password: string, role: 'USER' | 'ADMIN' = 'USER'): UserProfile {
    const id = 'user-' + crypto.randomUUID();
    const newUser: UserProfile = {
      id,
      user_id: id,
      display_name: displayName.trim(),
      email: email.trim().toLowerCase(),
      password_hash: hashPassword(password),
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.profiles.push(newUser);
    this.persist();
    return newUser;
  }

  verifyCredentials(email: string, password: string): UserProfile | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;
    if (!verifyPassword(password, user.password_hash)) return null;
    return user;
  }

  updateProfile(id: string, displayName: string, email: string): UserProfile | null {
    const user = this.getUserById(id);
    if (!user) return null;
    user.display_name = displayName.trim();
    user.email = email.trim().toLowerCase();
    user.updated_at = new Date().toISOString();
    this.persist();
    return user;
  }

  updatePassword(id: string, newPass: string): boolean {
    const user = this.getUserById(id);
    if (!user) return false;
    user.password_hash = hashPassword(newPass);
    user.updated_at = new Date().toISOString();
    this.persist();
    return true;
  }

  // Questions
  getAllQuestions(difficulty?: string): TrainingQuestion[] {
    if (difficulty) {
      return this.data.training_questions.filter(q => q.difficulty === difficulty.toLowerCase());
    }
    return this.data.training_questions;
  }

  getQuestionById(id: string): TrainingQuestion | null {
    return this.data.training_questions.find(q => q.id === id) || null;
  }

  createQuestion(q: Omit<TrainingQuestion, 'id' | 'created_at'>): TrainingQuestion {
    const newQ: TrainingQuestion = {
      ...q,
      id: 'q-' + crypto.randomUUID().slice(0, 8),
      created_at: new Date().toISOString()
    };
    this.data.training_questions.push(newQ);
    this.persist();
    return newQ;
  }

  updateQuestion(id: string, updates: Partial<TrainingQuestion>): TrainingQuestion | null {
    const index = this.data.training_questions.findIndex(q => q.id === id);
    if (index === -1) return null;
    this.data.training_questions[index] = {
      ...this.data.training_questions[index],
      ...updates,
      id // preserve ID
    };
    this.persist();
    return this.data.training_questions[index];
  }

  deleteQuestion(id: string): boolean {
    const initialLen = this.data.training_questions.length;
    this.data.training_questions = this.data.training_questions.filter(q => q.id !== id);
    if (this.data.training_questions.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Training Sessions & Attempts
  saveTrainingSession(
    userId: string,
    difficulty: 'beginner' | 'intermediate' | 'hard',
    score: number,
    total_questions: number,
    attempts: Array<{ question_id: string; selected_answer: 'Safe' | 'Suspicious' | 'Spam'; correct: boolean }>
  ): TrainingSession {
    const percentage = total_questions > 0 ? Math.round((score / total_questions) * 100) : 0;
    const session: TrainingSession = {
      id: 'sess-' + crypto.randomUUID(),
      user_id: userId,
      difficulty,
      score,
      total_questions,
      percentage,
      completed_at: new Date().toISOString()
    };

    this.data.training_sessions.unshift(session);

    // Save individual attempts
    for (const att of attempts) {
      this.data.training_attempts.push({
        id: 'att-' + crypto.randomUUID(),
        user_id: userId,
        question_id: att.question_id,
        selected_answer: att.selected_answer,
        correct: att.correct,
        created_at: new Date().toISOString()
      });
    }

    this.persist();
    return session;
  }

  getUserSessions(userId: string): TrainingSession[] {
    return this.data.training_sessions
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  }

  getUserDashboardStats(userId: string) {
    const sessions = this.getUserSessions(userId);
    const userAttempts = this.data.training_attempts.filter(a => a.user_id === userId);

    const questionsCompleted = userAttempts.length > 0 ? userAttempts.length : sessions.reduce((acc, s) => acc + s.total_questions, 0);
    const correctAnswers = userAttempts.length > 0 ? userAttempts.filter(a => a.correct).length : sessions.reduce((acc, s) => acc + s.score, 0);
    const accuracy = questionsCompleted > 0 ? Math.round((correctAnswers / questionsCompleted) * 100) : 0;

    const beginnerSessions = sessions.filter(s => s.difficulty === 'beginner');
    const intermediateSessions = sessions.filter(s => s.difficulty === 'intermediate');
    const hardSessions = sessions.filter(s => s.difficulty === 'hard');

    const getBestScore = (list: TrainingSession[]) => {
      if (list.length === 0) return { score: 0, total: 10, percentage: 0 };
      const best = list.reduce((prev, curr) => (curr.percentage > prev.percentage ? curr : prev));
      return { score: best.score, total: best.total_questions, percentage: best.percentage };
    };

    return {
      questionsCompleted,
      correctAnswers,
      accuracy,
      totalSessions: sessions.length,
      bestScores: {
        beginner: getBestScore(beginnerSessions),
        intermediate: getBestScore(intermediateSessions),
        hard: getBestScore(hardSessions)
      },
      recentActivity: sessions.slice(0, 10)
    };
  }

  getAdminStats() {
    const totalUsers = this.data.profiles.filter(p => p.role === 'USER').length;
    const totalSessions = this.data.training_sessions.length;
    const totalQuestions = this.data.training_questions.length;

    const totalQuestionsAnswered = this.data.training_sessions.reduce((acc, s) => acc + s.total_questions, 0);
    const totalCorrect = this.data.training_sessions.reduce((acc, s) => acc + s.score, 0);
    const averageAccuracy = totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;

    const difficultyBreakdown = {
      beginner: {
        questions: this.data.training_questions.filter(q => q.difficulty === 'beginner').length,
        sessions: this.data.training_sessions.filter(s => s.difficulty === 'beginner').length
      },
      intermediate: {
        questions: this.data.training_questions.filter(q => q.difficulty === 'intermediate').length,
        sessions: this.data.training_sessions.filter(s => s.difficulty === 'intermediate').length
      },
      hard: {
        questions: this.data.training_questions.filter(q => q.difficulty === 'hard').length,
        sessions: this.data.training_sessions.filter(s => s.difficulty === 'hard').length
      }
    };

    return {
      totalUsers,
      totalSessions,
      totalQuestions,
      totalQuestionsAnswered,
      averageAccuracy,
      difficultyBreakdown,
      recentSessions: this.data.training_sessions.slice(0, 15).map(s => {
        const user = this.getUserById(s.user_id);
        return {
          ...s,
          user_name: user ? user.display_name : 'Guest User',
          user_email: user ? user.email : 'guest@local'
        };
      })
    };
  }
}

export const db = new Database();
