import React from 'react';
import { Shield, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          LEGAL & DISCLAIMER
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Educational Cybersecurity Platform Usage Agreement
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-xl space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>1. Educational Nature of SpamShield</span>
          </h2>
          <p>
            <strong>SpamShield</strong> is strictly an educational cybersecurity awareness platform created for student learning, portfolio demonstrations, and training purposes. It is NOT an enterprise email security gateway, antivirus tool, spam filter, or certified threat intelligence service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>2. No Warranty for Real-World Phishing Detection</span>
          </h2>
          <p>
            The assessments provided by the simulation exercises and the ShieldAI Message Analyzer are educational aids intended to teach conceptual awareness of common scam patterns. You must never rely solely on SpamShield to declare a real email or message "Safe."
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>3. Duty to Verify Through Official Channels</span>
          </h2>
          <p>
            When handling real emails, text messages, phone calls, or website links in your daily life, you agree to always verify suspicious communications through official out-of-band channels—such as telephoning your bank using the number on your credit card or accessing your school/employer portal through direct bookmarks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>4. Fictional Content & Non-Affiliation</span>
          </h2>
          <p>
            All brand mentions, simulated corporate entities, institutions, and names referenced within training scenarios are used purely as non-functional educational examples. SpamShield has no formal affiliation with Apple, Microsoft, Google, PayPal, Netflix, or any third-party company mentioned in simulated exercises.
          </p>
        </section>
      </div>
    </div>
  );
};
