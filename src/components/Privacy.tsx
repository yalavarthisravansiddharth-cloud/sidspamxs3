import React from 'react';
import { Shield, Lock, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          TRANSPARENCY & DATA HYGIENE
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Last updated: October 2026 • Student Cybersecurity Education Platform
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Strict Prohibition on Sensitive Data:</strong> SpamShield is an educational simulator. Never submit real passwords, one-time authentication codes (OTPs), social security numbers, banking information, or payment card details.
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-xl space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>1. What Account Information Is Stored</span>
          </h2>
          <p>
            When you register for an optional account on SpamShield, we store:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
            <li><strong>Display Name:</strong> Chosen name to personalize your dashboard.</li>
            <li><strong>Email Address:</strong> Used strictly for account authentication and identification.</li>
            <li><strong>Cryptographic Password Hash:</strong> Passwords are never stored in plaintext; they are salted and hashed using Node.js <code>crypto.scrypt</code>.</li>
            <li><strong>Training Session Records:</strong> Selected difficulty, score, percentage, and completion timestamps.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>2. Why Information Is Stored</span>
          </h2>
          <p>
            Your account information is stored solely to calculate your personal accuracy metrics, render your performance charts, track unlocked security achievements, and provide the Admin Studio telemetry for instructor review. We do not sell, rent, or share personal data with any third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>3. How AI Features (ShieldAI) Work</span>
          </h2>
          <p>
            When you interact with the <strong>🤖 ShieldAI</strong> mentor or the <strong>🔍 AI Message Analyzer</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
            <li>Requests are processed server-side through Google Gemini 3.8 Flash via the official <code>@google/genai</code> SDK.</li>
            <li>Queries are ephemeral and used solely to generate the immediate defensive explanation and risk analysis.</li>
            <li>Queries submitted to the message analyzer are not stored permanently in the database.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>4. Fictional Simulator Data</span>
          </h2>
          <p>
            All simulated email addresses, sender entities, tracking numbers, and hyperlink destinations in SpamShield are completely fictional. Hyperlinks utilize the standard IETF RFC 2606 reserved top-level domain <code>.invalid</code> to ensure they can never resolve or connect to any live computer network.
          </p>
        </section>
      </div>
    </div>
  );
};
