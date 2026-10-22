import {
  User,
  TrainingQuestion,
  DifficultyLevel,
  TrainingAttempt,
  TrainingSession,
  DashboardStats,
  AdminStats,
  MessageAnalysis
} from './types.ts';

const TOKEN_KEY = 'spamshield_auth_token';
const GUEST_ID_KEY = 'spamshield_guest_id';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getGuestId(): string {
  let gid = localStorage.getItem(GUEST_ID_KEY);
  if (!gid) {
    gid = 'guest_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem(GUEST_ID_KEY, gid);
  }
  return gid;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers.set('x-guest-id', getGuestId());
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data as T;
}

// Auth API
export async function apiRegister(payload: { displayName: string; email: string; password: string }): Promise<{ user: User; token: string }> {
  const res = await request<{ user: User; token: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  setStoredToken(res.token);
  return res;
}

export async function apiLogin(payload: { email: string; password: string }): Promise<{ user: User; token: string }> {
  const res = await request<{ user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  setStoredToken(res.token);
  return res;
}

export async function apiGetCurrentUser(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const res = await request<{ user: User }>('/api/auth/me');
    return res.user;
  } catch {
    setStoredToken(null);
    return null;
  }
}

export async function apiLogout(): Promise<void> {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } catch {
    // Ignore error
  } finally {
    setStoredToken(null);
  }
}

export async function apiUpdateProfile(payload: { displayName: string; email: string }): Promise<User> {
  const res = await request<{ user: User }>('/api/auth/update-profile', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return res.user;
}

export async function apiUpdatePassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
  await request('/api/auth/update-password', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// Training API
export async function apiGetQuestions(difficulty?: DifficultyLevel): Promise<TrainingQuestion[]> {
  const query = difficulty ? `?difficulty=${difficulty}` : '';
  const res = await request<{ questions: TrainingQuestion[] }>(`/api/training/questions${query}`);
  return res.questions;
}

export async function apiSaveSession(payload: {
  difficulty: DifficultyLevel;
  score: number;
  total_questions: number;
  attempts: TrainingAttempt[];
}): Promise<{ session: TrainingSession; savedForUser: boolean }> {
  return await request<{ session: TrainingSession; savedForUser: boolean }>('/api/training/session', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// User Dashboard API
export async function apiGetDashboardStats(): Promise<DashboardStats> {
  const res = await request<{ stats: DashboardStats }>('/api/dashboard/stats');
  return res.stats;
}

// Admin API
export async function apiGetAdminStats(): Promise<AdminStats> {
  const res = await request<{ stats: AdminStats }>('/api/admin/stats');
  return res.stats;
}

export async function apiCreateQuestion(payload: Partial<TrainingQuestion>): Promise<TrainingQuestion> {
  const res = await request<{ question: TrainingQuestion }>('/api/admin/questions', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return res.question;
}

export async function apiUpdateQuestion(id: string, payload: Partial<TrainingQuestion>): Promise<TrainingQuestion> {
  const res = await request<{ question: TrainingQuestion }>(`/api/admin/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return res.question;
}

export async function apiDeleteQuestion(id: string): Promise<void> {
  await request(`/api/admin/questions/${id}`, {
    method: 'DELETE'
  });
}

// AI Integration API
export async function apiExplainQuestion(payload: {
  questionText: string;
  sender: string;
  correctAnswer: string;
  userAnswer?: string;
  userQuery?: string;
}): Promise<string> {
  const res = await request<{ explanation: string }>('/api/ai/explain', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return res.explanation;
}

export async function apiAnalyzeMessage(message: string): Promise<MessageAnalysis> {
  const res = await request<{ analysis: MessageAnalysis }>('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ message })
  });
  return res.analysis;
}
