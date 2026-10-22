import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, UserProfile } from './server/db.ts';
import { explainQuestionAI, analyzeMessageAI } from './server/ai.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '2mb' }));

// Auth middleware helper
interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }

  req.user = user;
  next();
}

function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    const user = db.getUserByToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied: Administrator privileges required' });
  }
  next();
}

// -------------------------------------------------------------
// AUTH ROUTES
// -------------------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { displayName, email, password } = req.body;
    if (!displayName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const newUser = db.createUser(displayName, email, password, 'USER');
    const token = db.createSessionToken(newUser.id);

    return res.status(201).json({
      user: {
        id: newUser.id,
        user_id: newUser.user_id,
        display_name: newUser.display_name,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create user account' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.verifyCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = db.createSessionToken(user.id);

    return res.json({
      user: {
        id: user.id,
        user_id: user.user_id,
        display_name: user.display_name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  return res.json({
    user: {
      id: req.user.id,
      user_id: req.user.user_id,
      display_name: req.user.display_name,
      email: req.user.email,
      role: req.user.role,
      created_at: req.user.created_at
    }
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (token) {
    db.destroyToken(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/update-profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { displayName, email } = req.body;
  if (!displayName || !email) {
    return res.status(400).json({ error: 'Display name and email are required' });
  }

  // Check if email taken by someone else
  const other = db.getUserByEmail(email);
  if (other && other.id !== req.user.id) {
    return res.status(409).json({ error: 'Email already in use by another account' });
  }

  const updated = db.updateProfile(req.user.id, displayName, email);
  if (!updated) return res.status(404).json({ error: 'User not found' });

  return res.json({
    user: {
      id: updated.id,
      user_id: updated.user_id,
      display_name: updated.display_name,
      email: updated.email,
      role: updated.role,
      created_at: updated.created_at
    }
  });
});

app.post('/api/auth/update-password', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  const valid = db.verifyCredentials(req.user.email, currentPassword);
  if (!valid) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  db.updatePassword(req.user.id, newPassword);
  return res.json({ success: true, message: 'Password updated successfully' });
});

// -------------------------------------------------------------
// TRAINING QUESTIONS & SESSIONS
// -------------------------------------------------------------
app.get('/api/training/questions', (req: Request, res: Response) => {
  const difficulty = req.query.difficulty as string | undefined;
  const questions = db.getAllQuestions(difficulty);
  return res.json({ questions });
});

app.get('/api/training/questions/:id', (req: Request, res: Response) => {
  const question = db.getQuestionById(req.params.id);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  return res.json({ question });
});

app.post('/api/training/session', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { difficulty, score, total_questions, attempts } = req.body;
    if (!difficulty || typeof score !== 'number' || typeof total_questions !== 'number') {
      return res.status(400).json({ error: 'Missing session parameters' });
    }

    const userId = req.user ? req.user.id : 'guest-' + (req.headers['x-guest-id'] || 'anonymous');
    const session = db.saveTrainingSession(
      userId,
      difficulty,
      score,
      total_questions,
      Array.isArray(attempts) ? attempts : []
    );

    return res.status(201).json({
      session,
      savedForUser: Boolean(req.user)
    });
  } catch (error) {
    console.error('Save session error:', error);
    return res.status(500).json({ error: 'Failed to save training session' });
  }
});

// -------------------------------------------------------------
// USER DASHBOARD
// -------------------------------------------------------------
app.get('/api/dashboard/stats', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const stats = db.getUserDashboardStats(req.user.id);
  return res.json({ stats });
});

// -------------------------------------------------------------
// ADMIN MANAGEMENT (PROTECTED)
// -------------------------------------------------------------
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getAdminStats();
  return res.json({ stats });
});

app.post('/api/admin/questions', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      difficulty,
      category,
      sender,
      sender_email,
      message_type,
      message,
      fictional_link,
      correct_answer,
      explanation,
      warning_signs,
      inspection_details
    } = req.body;

    if (!difficulty || !category || !sender || !message || !correct_answer || !explanation) {
      return res.status(400).json({ error: 'Missing required question fields' });
    }

    const newQuestion = db.createQuestion({
      difficulty,
      category,
      sender,
      sender_email: sender_email || 'noreply@simulated-domain.invalid',
      message_type: message_type || 'Email',
      message,
      fictional_link: fictional_link || '',
      correct_answer,
      explanation,
      warning_signs: Array.isArray(warning_signs) ? warning_signs : [explanation],
      inspection_details: inspection_details || (difficulty === 'hard' ? {
        sender_domain: 'simulated-domain.invalid',
        urgency_level: 'Medium',
        requested_info: 'Credentials or Action',
        context: 'Simulation exercise',
        flags: ['Educational simulation']
      } : undefined)
    });

    return res.status(201).json({ question: newQuestion });
  } catch (error) {
    console.error('Error creating question:', error);
    return res.status(500).json({ error: 'Failed to create question' });
  }
});

app.put('/api/admin/questions/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateQuestion(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.json({ question: updated });
  } catch (error) {
    console.error('Error updating question:', error);
    return res.status(500).json({ error: 'Failed to update question' });
  }
});

app.delete('/api/admin/questions/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = db.deleteQuestion(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ error: 'Failed to delete question' });
  }
});

// -------------------------------------------------------------
// AI INTEGRATION (SHIELDAI & MESSAGE ANALYZER)
// -------------------------------------------------------------
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  try {
    const { questionText, sender, correctAnswer, userAnswer, userQuery } = req.body;
    if (!questionText || !sender || !correctAnswer) {
      return res.status(400).json({ error: 'Missing required context' });
    }

    const explanation = await explainQuestionAI({
      questionText,
      sender,
      correctAnswer,
      userAnswer,
      userQuery
    });

    return res.json({ explanation });
  } catch (error) {
    console.error('AI Explain error:', error);
    return res.status(500).json({ error: 'Failed to retrieve AI explanation' });
  }
});

app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a message to analyze' });
    }

    if (message.length > 4000) {
      return res.status(400).json({ error: 'Message exceeds maximum length of 4000 characters' });
    }

    const analysis = await analyzeMessageAI(message);
    return res.json({ analysis });
  } catch (error) {
    console.error('AI Analyze error:', error);
    return res.status(500).json({ error: 'Failed to analyze message' });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER / STATIC ASSETS
// -------------------------------------------------------------
async function setupServer() {
  if (!isProduction) {
    // Dynamic import to keep build lean
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ SpamShield server is running on http://0.0.0.0:${PORT} [${isProduction ? 'PROD' : 'DEV'}]`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
