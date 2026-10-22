import React, { useState } from 'react';
import {
  AlertTriangle,
  Link,
  Clock,
  KeyRound,
  Smartphone,
  Gift,
  UserX,
  Globe,
  FileQuestion,
  CreditCard,
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface RedFlagsProps {
  onNavigate: (view: string) => void;
}

export const RedFlags: React.FC<RedFlagsProps> = ({ onNavigate }) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(0);

  const redFlagsList = [
    {
      id: 0,
      title: 'Unexpected Links',
      icon: '🔗',
      category: 'Technical Indicator',
      severity: 'Critical',
      headline: 'Links directing to unofficial, lookalike, or shortened domains.',
      details: 'Attackers create fake domain names (e.g. "delivery-confirm.invalid") that closely resemble legitimate brands. Often they use link shorteners or URL redirectors to mask their true destination.',
      redFlagExample: 'Message: "Your package is held. Update address at: https://parcel-update.invalid/details"',
      defense: 'Never click links inside unverified messages. Open your browser and navigate directly to the official homepage.'
    },
    {
      id: 1,
      title: 'Urgent Language & Countdowns',
      icon: '⏰',
      category: 'Psychological Hook',
      severity: 'Critical',
      headline: 'Threatening messages with aggressive 10-minute or 24-hour countdowns.',
      details: 'Artificial urgency forces victims into panic mode so they stop thinking rationally. Phrases like "Immediate Action Required!", "Your account will be deleted in 10 minutes", or "Warrant issued for your arrest" are textbook social engineering.',
      redFlagExample: 'Message: "FINAL NOTICE: Account locked permanently in 15 minutes unless verified immediately!"',
      defense: 'Recognize that extreme urgency is almost always fabricated. Real service providers give days or weeks of advance notice.'
    },
    {
      id: 2,
      title: 'Password Requests',
      icon: '🔑',
      category: 'Credential Harvesting',
      severity: 'Critical',
      headline: 'Direct or indirect prompts to disclose passwords or security questions.',
      details: 'Legitimate companies NEVER ask users to send passwords via email, SMS, or chat. Any message stating "Reply with your password to keep your email active" is 100% malicious spam.',
      redFlagExample: 'Message: "System upgrade: Reply with username and password to validate your mailbox quota."',
      defense: 'Never type or send your password in any communication. Enter passwords only into verified browser address bars with authentic domain names.'
    },
    {
      id: 3,
      title: 'OTP / Verification Code Demands',
      icon: '📲',
      category: '2FA Bypass',
      severity: 'Critical',
      headline: 'Requests to forward or read back a two-factor authentication code.',
      details: 'When an attacker guesses your password, they trigger an SMS or authenticator prompt. They then contact you posing as support to trick you into reciting that code so they can log in.',
      redFlagExample: 'Message: "IT Helpdesk: We sent a 6-digit sync code to your phone. Please reply with that code to clear your ticket."',
      defense: 'One-time passcodes are for your eyes only. Support staff do not need your OTP to service your account.'
    },
    {
      id: 4,
      title: 'Fake Prizes & Lottery Winnings',
      icon: '🎁',
      category: 'Financial Scam',
      severity: 'High',
      headline: 'Offers of expensive smartphones, gift cards, or cash for unentered contests.',
      details: 'If you didn\'t enter a raffle, you didn\'t win. Scammers entice victims with exciting rewards, then demand personal information or a "small processing fee" to steal your identity.',
      redFlagExample: 'Message: "CONGRATULATIONS! You won an iPhone 16 Pro! Click here to claim your reward before midnight."',
      defense: 'Remember: if something sounds too good to be true, it is guaranteed to be a lure.'
    },
    {
      id: 5,
      title: 'Unknown Senders & Relays',
      icon: '👤',
      category: 'Identity Spoofing',
      severity: 'Medium',
      headline: 'Communications from unfamiliar email addresses pretending to be people you know.',
      details: 'Scammers create burner email accounts on free platforms (Gmail, Outlook, Yahoo) using a boss\'s, professor\'s, or vendor\'s display name to impersonate them.',
      redFlagExample: 'Message from: "Dean of Engineering <dean.campus.univ@free-mail.invalid>"',
      defense: 'Check the actual sender address. Legitimate campus or enterprise emails always end in the official corporate or .edu domain.'
    },
    {
      id: 6,
      title: 'Suspicious Domains & Typo-Squatting',
      icon: '🌐',
      category: 'Technical Indicator',
      severity: 'Critical',
      headline: 'Domains that replace letters, add hyphens, or use strange top-level domains.',
      details: 'Typo-squatting exploits visual similarity, such as "rnicrosoft.com" (rn looks like m) or "login-microsoft-secure.invalid".',
      redFlagExample: 'Link: "https://login-microsoft-secure.invalid/sso"',
      defense: 'Inspect the domain suffix carefully before clicking or logging in.'
    },
    {
      id: 7,
      title: 'Personal Information Harvesting',
      icon: '📋',
      category: 'Identity Theft',
      severity: 'High',
      headline: 'Unsolicited forms demanding SSN, date of birth, mother\'s maiden name, or tax IDs.',
      details: 'Scammers harvest complete identity dossiers that enable them to open fraudulent credit cards or take out loans in your name.',
      redFlagExample: 'Message: "Student tax rebate pending: Provide full legal name, date of birth, and SSN to approve."',
      defense: 'Guard your government identification numbers. Never submit sensitive identity documents through email or text links.'
    },
    {
      id: 8,
      title: 'Unexpected File Attachments',
      icon: '📎',
      category: 'Malware Vector',
      severity: 'Critical',
      headline: 'Unsolicited .zip, .exe, .scr, or macro-enabled documents.',
      details: 'Malicious attachments contain Trojans, ransomware, or keyloggers disguised as invoices, résumés, or shipping slips.',
      redFlagExample: 'Message: "Review attached overdue invoice: invoice_oct2026.pdf.exe"',
      defense: 'Never open double-extension files (e.g., .pdf.exe) or enable macros on unexpected Office files.'
    },
    {
      id: 9,
      title: 'Payment & Wire Transfer Demands',
      icon: '💳',
      category: 'Financial Fraud',
      severity: 'Critical',
      headline: 'Instructions to wire money, purchase gift cards, or send cryptocurrency.',
      details: 'Wire transfers and retail gift card scratch-offs are irreversible and untraceable. Attackers love them for business email compromise (BEC).',
      redFlagExample: 'Message: "I need you to urgently buy five $100 gift cards for our client presentation. Email me the scratch codes."',
      defense: 'No legitimate vendor, executive, or university department will request payment in retail store gift cards or Bitcoin.'
    }
  ];

  const activeFlag = redFlagsList[selectedCard !== null ? selectedCard : 0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
          THREAT INTELLIGENCE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Common Spam Warning Signs
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
          Click any red flag card to inspect real-world attacker pretexts, threat anatomy, and defensive counter-measures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: List of cards */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[620px] overflow-y-auto pr-2">
          {redFlagsList.map(flag => {
            const isSelected = selectedCard === flag.id;
            return (
              <div
                key={flag.id}
                onClick={() => setSelectedCard(flag.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{flag.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold">{flag.title}</h4>
                    <span className="text-[10px] text-slate-400">{flag.category}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                  flag.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {flag.severity}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Dive Details of the selected red flag */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeFlag.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeFlag.title}</h3>
                  <span className="text-xs text-cyan-400 font-mono">{activeFlag.category}</span>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                activeFlag.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {activeFlag.severity} Severity
              </span>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                Anatomy of the Warning Sign
              </h5>
              <p className="text-sm font-semibold text-slate-200 mb-2">
                {activeFlag.headline}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeFlag.details}
              </p>
            </div>

            {/* Example Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                🚨 Real-World Simulated Lure:
              </span>
              <p className="text-xs text-slate-300 font-mono italic">
                {activeFlag.redFlagExample}
              </p>
            </div>

            {/* Defensive Countermeasure */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                🛡️ Defensive Strategy:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeFlag.defense}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('training')}
                className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Test This Red Flag in Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
