import React from 'react';
import { Shield, BookOpen, GraduationCap, Heart, Code2, Lock, Terminal, Cpu } from 'lucide-react';

interface AboutProps {
  onNavigate: (view: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          COLLEGE CYBERSECURITY PROJECT
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About SpamShield
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
          An interactive cybersecurity awareness platform designed to teach users how to spot spam, phishing, scam messages, and social-engineering attacks.
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 text-cyan-400 font-bold text-lg">
          <GraduationCap className="w-6 h-6" />
          <span>Project Purpose & Educational Mission</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          Over 90% of data breaches, credential compromises, and ransomware incidents originate with social engineering—deceptive emails, SMS lures ("smishing"), and fake login portals. Traditional cybersecurity training often consists of dry multiple-choice quizzes that fail to build practical, real-world defensive instincts.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong>SpamShield</strong> was built as a capstone student cybersecurity showcase to bridge that gap. Users interact with realistic, simulated communications across <strong>Beginner</strong>, <strong>Intermediate</strong>, and <strong>Hard</strong> tiers, learning to inspect headers, detect typo-squatted domains, resist emotional urgency, and employ out-of-band verification.
        </p>
      </div>

      {/* Technology Stack Grid */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          <span>Full-Stack Architecture & Engineering</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Frontend Engineering</span>
            <p className="text-slate-400 leading-relaxed">
              React 19 SPA, TypeScript, Tailwind CSS, Lucide Icons, and accessible cybersecurity UI design with responsive cards and smooth transitions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-blue-400 font-bold block mb-1">Backend & Server</span>
            <p className="text-slate-400 leading-relaxed">
              Express full-stack server running in dev with Vite middlewares, Scrypt password hashing, session tokens, and role-based access control (RBAC).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">Defensive AI Integration</span>
            <p className="text-slate-400 leading-relaxed">
              Powered by Google Gemini 3.8 Flash via <code>@google/genai</code> server-side proxy for contextual explanations and deep risk indicator breakdown.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">Zero-Harm Educational Lab</span>
            <p className="text-slate-400 leading-relaxed">
              All scenarios, links, and domains use the reserved <code>.invalid</code> top-level domain. No real credentials or sensitive financial data are ever collected.
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 text-center space-y-3">
        <div className="text-cyan-400 font-mono font-bold text-sm tracking-wide">
          “LEARN • THINK • VERIFY”
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Cyber defense starts with human awareness. Question unexpected requests, inspect domains, and verify before you click.
        </p>
      </div>
    </div>
  );
};
