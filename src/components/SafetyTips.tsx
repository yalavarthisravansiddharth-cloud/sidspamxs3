import React, { useState } from 'react';
import {
  Link,
  Lock,
  Clock,
  AlertTriangle,
  Smartphone,
  Mail,
  Brain,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface SafetyTipsProps {
  onNavigate: (view: string) => void;
}

export const SafetyTips: React.FC<SafetyTipsProps> = ({ onNavigate }) => {
  const [expandedTip, setExpandedTip] = useState<number | null>(0);

  const tips = [
    {
      id: 0,
      icon: <Link className="w-5 h-5 text-cyan-400" />,
      title: '🔗 Check Links Independently',
      short: "Don't click unexpected links. Verify websites independently.",
      full: `Attackers rely on you clicking the link provided in the message because it takes you directly to their counterfeit page.
      
• **Never trust hyperlinked text:** The display text can say "paypal.com" while the actual HTML destination points to a Russian or offshore malicious domain.
• **Hover before touching:** On a desktop computer, hover your mouse over the link to inspect the destination URL in your browser status bar.
• **Independent navigation:** If your bank or delivery service says an issue occurred, open a brand-new tab and manually type the known web address (e.g., ups.com or chase.com).`
    },
    {
      id: 1,
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      title: '🔐 Protect Passwords & OTP Codes',
      short: 'Never share passwords or one-time verification codes with anyone.',
      full: `Legitimate institutions and support teams will never contact you asking for your password, PIN, or multi-factor authentication (MFA) codes.
      
• **One-Time Passwords (OTPs) are for you only:** When a 6-digit text message says "Do not share this code with anyone", that includes people claiming to be bank fraud officers or campus IT staff.
• **Adversary-in-the-Middle:** Modern phishing setups clone login pages in real time to capture your 2FA code the moment you type it.
• **Use Authenticator Apps / FIDO Keys:** Prefer hardware security keys (like YubiKey) or app-based authenticator prompts over SMS wherever possible.`
    },
    {
      id: 2,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      title: "⏰ Don't Rush: Artificial Urgency",
      short: 'Urgency is designed to bypass your logical thinking and induce panic.',
      full: `Phishing relies heavily on psychological pressure. If a message tells you that you have "10 minutes" before account termination or legal action, pause and breathe.
      
• **Emotional Hijacking:** Scammers want you in a state of fear, excitement (you won a prize!), or anxiety so your brain skips normal safety checks.
• **Legitimate processes take time:** Real financial institutions, universities, and government agencies provide formal notices with ample appeal windows, not instant 15-minute ultimatums.
• **The 5-Minute Rule:** When an urgent email arrives, step away for five minutes before taking any action.`
    },
    {
      id: 3,
      icon: <Smartphone className="w-5 h-5 text-purple-400" />,
      title: '📱 Verify Through Official Apps',
      short: 'Always check notifications directly inside official apps rather than texts.',
      full: `If you receive an SMS stating "Your parcel is delayed" or "Unusual charge of $480 detected", never interact with the text message.
      
• **Open the merchant app:** Unlock your phone, tap your official Amazon, FedEx, or banking app, and inspect the in-app notification center.
• **If the app has no alert, the text is a scam:** Official companies synchronize legitimate alerts across their core applications.
• **Out-of-band verification:** Call customer service using the telephone number printed on the back of your physical card, not the number listed in the suspicious text.`
    },
    {
      id: 4,
      icon: <Mail className="w-5 h-5 text-blue-400" />,
      title: '📧 Check Sender Addresses & Domains',
      short: 'Inspect the full sender address, not just the display name.',
      full: `Attackers easily forge display names to read "Campus Security" or "Netflix Support".
      
• **Inspect what comes after the @ symbol:** An email from "Apple Support <support@apple-verify-service.invalid>" did NOT come from Apple; it came from "apple-verify-service.invalid".
• **Typo-squatting:** Watch for subtle misspellings like replacing letter 'o' with zero '0', or adding extra words like "paypal-security-alert.com".
• **Look for missing .edu or .gov:** Official campus communication originates from .edu domains, not free Gmail relays or unverified .coms.`
    },
    {
      id: 5,
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
      title: '📢 Report & Block Spam',
      short: 'Use built-in reporting to protect your fellow students and colleagues.',
      full: `Reporting phishing helps email security filters train their spam filters for everyone on campus and at work.
      
• **In Email:** Use the "Report Phishing" button in Gmail, Outlook, or Apple Mail.
• **In SMS:** Forward smishing text messages to 7726 (SPAM) in the US and Canada. It is free and alerts cellular carrier fraud engines.
• **Campus SOC:** If you received targeted spear-phishing on university email, forward it to your campus IT Security Operations Center (e.g., abuse@university.edu).`
    },
    {
      id: 6,
      icon: <Brain className="w-5 h-5 text-cyan-400" />,
      title: '🧠 Think Before You Click',
      short: 'Develop a habit of defensive curiosity and situational awareness.',
      full: `Cybersecurity is not just about tools; it is a mental habit.
      
• **Ask: Did I initiate this?** If you receive a password reset link but you never clicked "Forgot Password", somebody else or an automated bot is probing your account.
• **Ask: Why are they asking me this?** If a colleague asks you to buy gift cards or change banking details over a quick message, verify in person or via telephone.
• **Remember the golden rule:** When in doubt, delete or report.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          CYBERSECURITY PLAYBOOK
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Safety Tips & Defensive Principles
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
          Master the foundational rules of cyber hygiene to keep your accounts, identity, and devices safe.
        </p>
      </div>

      {/* Accordion / Cards List */}
      <div className="space-y-4 mb-12">
        {tips.map(tip => {
          const isOpen = expandedTip === tip.id;
          return (
            <div
              key={tip.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-slate-900 border-cyan-500/40 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedTip(isOpen ? null : tip.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {tip.short}
                    </p>
                  </div>
                </div>
                <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 shrink-0">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line animate-in fade-in">
                  {tip.full}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA to practice */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/30 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Put These Tips Into Practice</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Test your instincts in our interactive training simulator with safe simulated scenarios.
        </p>
        <button
          onClick={() => onNavigate('training')}
          className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          🚀 Start Training Simulator
        </button>
      </div>
    </div>
  );
};
