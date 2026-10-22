import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Sparkles,
  Bot,
  Zap,
  Lock,
  Mail,
  Smartphone,
  ExternalLink,
  Search,
  BookOpen,
  Award
} from 'lucide-react';

interface HomeProps {
  onNavigate: (view: string, extra?: any) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user, openAuthModal } = useAuth();

  const redFlags = [
    { title: 'Unexpected Links', desc: 'Links pointing to unofficial lookalikes or shortened URLs.', icon: '🔗' },
    { title: 'Urgent Language', desc: 'Threats like "Account locked in 10 mins" to bypass critical thought.', icon: '⏰' },
    { title: 'Password Requests', desc: 'Legitimate companies will NEVER ask for your password by email or chat.', icon: '🔑' },
    { title: 'OTP / Verification Codes', desc: 'Attackers trick you into forwarding 2FA one-time security codes.', icon: '📲' },
    { title: 'Fake Prizes & Rewards', desc: 'Claims that you won a lottery or smartphone you never entered.', icon: '🎁' },
    { title: 'Unknown Senders & Relays', desc: 'Email addresses that don\'t match the claimed corporate brand.', icon: '👤' },
    { title: 'Suspicious Domains', desc: 'Typo-squatting like "login-microsoft-secure.invalid".', icon: '🌐' },
    { title: 'Demands for Money / Gift Cards', desc: 'Asking for wire transfers, gift cards, or crypto vouchers.', icon: '💳' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background cyber grid & gradient glows */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              CYBERSECURITY TRAINING
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Learn to Spot <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                Spam & Scams
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl font-medium text-cyan-300/90 italic">
              “Learn to Spot Spam Before It Tricks You.”
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Test your ability to identify suspicious emails, SMS messages, and online scams in a safe, interactive training environment. Developed with real-world scenarios and defensive AI analysis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('training')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2.5 cursor-pointer cyber-glow-cyan"
              >
                <span>🚀 Start Training</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('safety-tips')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm sm:text-base text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Explore Safety Tips</span>
              </button>
            </div>

            {/* Quick Metrics ticker */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xl sm:text-2xl font-extrabold text-white">36+</div>
                <div className="text-[11px] text-slate-400">Real Scenarios</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xl sm:text-2xl font-extrabold text-cyan-400">3</div>
                <div className="text-[11px] text-slate-400">Skill Levels</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">100%</div>
                <div className="text-[11px] text-slate-400">Safe Lab</div>
              </div>
            </div>
          </div>

          {/* Right Hero Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/20 blur-xl" />
              
              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700 p-6 shadow-2xl backdrop-blur-xl">
                {/* Header bar of simulated security station */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">SpamShield::LiveRadar</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    DEFENSE ACTIVE
                  </span>
                </div>

                {/* Animated Cyber Shield Visual */}
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-25" />
                    <div className="absolute inset-2 rounded-full border border-dashed border-blue-500/40 animate-spin" style={{ animationDuration: '20s' }} />
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-1 shadow-xl shadow-cyan-500/30 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                        <Shield className="w-14 h-14" />
                      </div>
                    </div>
                  </div>

                  {/* Simulated interactive mini-card */}
                  <div className="w-full bg-slate-950 rounded-xl p-3.5 border border-slate-800 text-left space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Sample Simulation:</span>
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> High Threat
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                      "Account will be deleted in 10 mins! Click: parcel-update.invalid"
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-cyan-400">Warning sign: False Urgency</span>
                      <span className="text-[10px] text-slate-500">Inspection: Lookalike domain</span>
                    </div>
                  </div>
                </div>

                {/* Feature checklist */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-around text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fictional Links
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Zero Credentials
                  </span>
                  <span className="flex items-center gap-1 text-blue-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI Mentor
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            METHODOLOGY
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            How SpamShield Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            A three-step interactive cycle that trains your natural cyber instincts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              1️⃣
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Read</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Read a simulated email, SMS, or direct chat message crafted to mirror real-world attack vectors.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              2️⃣
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Analyze</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Look for suspicious signs: inspect sender identity, urgency hooks, credential harvesting, or lookalike links.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              3️⃣
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Decide</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Choose: <strong>Safe</strong>, <strong>Suspicious</strong>, or <strong>Spam</strong>. Receive instant educational explanations and warning sign recaps.
            </p>
          </div>
        </div>
      </section>

      {/* ================= DIFFICULTY LEVELS ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            TRAINING TIERS
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Choose Your Training Difficulty
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Progress from obvious spam lures to high-grade spear-phishing with deep message inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Beginner */}
          <div className="relative rounded-2xl bg-slate-900/80 border border-emerald-500/30 p-7 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/10 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🟢</span>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  BEGINNER
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn the Basics</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Identify obvious spam and scam messages using common warning signs like fake prizes, urgent countdowns, and blunt password requests.
              </p>
              <div className="space-y-2 mb-8 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Obvious fake lottery & smartphone prizes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>"10-minute deletion" panic alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct requests for OTP verification codes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('training', { difficulty: 'beginner' })}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Beginner Training</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Intermediate */}
          <div className="relative rounded-2xl bg-slate-900/80 border border-amber-500/30 p-7 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🟡</span>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  INTERMEDIATE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Test Your Attention</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Analyze realistic-looking messages where warning signs are less obvious. Requires context analysis and link domain scrutiny.
              </p>
              <div className="space-y-2 mb-8 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Professional courier & delivery notices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Cloud storage & streaming billing alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Subtle lookalike domain names</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('training', { difficulty: 'intermediate' })}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Intermediate Training</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hard */}
          <div className="relative rounded-2xl bg-slate-900/80 border border-rose-500/40 p-7 flex flex-col justify-between hover:shadow-xl hover:shadow-rose-500/10 transition-all">
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-md">
              WITH MESSAGE INSPECTION
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🔴</span>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  HARD MODE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Challenge Your Skills</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Inspect sophisticated spear-phishing with our <strong>🔍 Inspect Message</strong> tool. Audit sender domains, link domains, and pretext authority.
              </p>
              <div className="space-y-2 mb-8 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Campus security & academic holds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Vendor bank wire diversion scams</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>MFA push interception & IT impersonation</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('training', { difficulty: 'hard' })}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Hard Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= AI SHIELDAI SPOTLIGHT ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Bot className="w-3.5 h-3.5" />
                POWERED BY SHIELDAI
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Meet ShieldAI — Your Defensive Cybersecurity Mentor
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Need to understand why a simulated email was suspicious? Want to test a custom message you received? ShieldAI provides breakdown of psychological urgency triggers, lookalike domains, credential hooks, and verified defensive steps.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Open AI Message Analyzer</span>
                </button>
                <button
                  onClick={() => onNavigate('training')}
                  className="px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-800 border border-slate-700 hover:bg-slate-750 transition-all"
                >
                  Ask ShieldAI During Simulation
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Bot className="w-4 h-4" /> ShieldAI Defense Rules:
                </div>
                <div className="text-[11px] text-slate-400 space-y-1.5 font-mono">
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Explains red flags & psychological triggers</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Recommends safe out-of-band verification</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Refuses to generate offensive phishing payloads</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RED FLAGS SECTION ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
              WARNING SIGNS
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Common Spam Warning Signs
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Over 90% of cyber attacks start with social engineering. Master these signature red flags.
            </p>
          </div>
          <button
            onClick={() => onNavigate('red-flags')}
            className="mt-4 md:mt-0 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group"
          >
            <span>View Detailed Red Flag Guide</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {redFlags.map((flag, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('red-flags')}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="text-2xl mb-3">{flag.icon}</div>
              <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                {flag.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {flag.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-xl mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Shield className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to test your cybersecurity skills?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Join students and professionals practicing safe phishing identification. Measure your accuracy across 30+ interactive scenarios.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('training')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🚀 Start Training</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {!user && (
              <button
                onClick={() => openAuthModal('signup')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm sm:text-base text-slate-200 hover:text-white bg-slate-900 border border-slate-700/80 rounded-xl transition-all"
              >
                Create Free Account
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
