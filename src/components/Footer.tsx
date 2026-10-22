import React from 'react';
import { Shield, Lock, ExternalLink, Heart, AlertTriangle } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 mt-auto">
      {/* Educational Notice Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/60 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Educational Training Simulator:</strong> All emails, SMS messages, and domain names are fictional (.invalid) simulations. Never share real passwords, OTPs, or bank details.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-cyan-400">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                🛡️ SpamShield
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Cybersecurity Awareness Training Platform designed to help students, developers, and everyday users detect phishing, social engineering, and online scams in safe, zero-risk simulations.
            </p>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold tracking-wide">
              <span>Learn</span>
              <span className="text-slate-600">•</span>
              <span>Think</span>
              <span className="text-slate-600">•</span>
              <span>Verify</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Training & Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('training')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Training Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  🔍 AI Message Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  My Security Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('red-flags')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Red Flag Detection Cards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety-tips')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Safety Tips & Best Practices
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  About SpamShield
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} SpamShield. Developed for Cybersecurity Awareness & Student Training.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-cyan-400" /> Safe Educational Environment
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Powered by Gemini AI Defense</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
