import React, { useState } from 'react';
import { apiAnalyzeMessage } from '../api.ts';
import { MessageAnalysis } from '../types.ts';
import { useToast } from '../context/ToastContext.tsx';
import {
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Bot,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  Info,
  Loader2,
  RotateCcw
} from 'lucide-react';

export const MessageAnalyzer: React.FC = () => {
  const { showToast } = useToast();
  const [inputMessage, setInputMessage] = useState<string>('');
  const [analysis, setAnalysis] = useState<MessageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const sampleMessages = [
    {
      title: '📦 Delivery Smishing',
      text: 'Your package #US-8821 could not be delivered due to an incomplete street address. Confirm your address immediately at https://delivery-confirm.invalid/address to avoid returning to sender.'
    },
    {
      title: '🏦 Urgent Bank Alert',
      text: 'BANK NOTICE: Your account has been temporarily restricted due to unauthorized login attempts. Please verify your identity and enter your PIN immediately at https://unlock-card-portal.invalid/pin to prevent permanent suspension.'
    },
    {
      title: '🎁 Smartphone Prize',
      text: 'CONGRATULATIONS! You have been selected as today\'s 1st place winner of a brand new 512GB Smartphone! Claim your free gift now by providing your full legal name and social security number at https://claim-prize.invalid/winner'
    },
    {
      title: '✈️ Legitimate Flight Ticket',
      text: 'Your reservation for Flight #AA-402 from Chicago to San Francisco has been confirmed. Passenger: Sravan Siddharth. Terminal 3, Seat 14B. Check in 24 hours prior to departure via the airline mobile app.'
    }
  ];

  const handleAnalyze = async (msgText: string = inputMessage) => {
    if (!msgText.trim()) {
      showToast('Please paste or type a message to analyze.', 'warning', 'Empty Input');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await apiAnalyzeMessage(msgText);
      setAnalysis(res);
      showToast('Message risk evaluation complete.', 'success', 'Analysis Done');
    } catch (err: any) {
      showToast(err.message || 'Failed to analyze message', 'error', 'Analysis Error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = (sampleText: string) => {
    setInputMessage(sampleText);
    setAnalysis(null);
  };

  const getVerdictStyle = (verdict: string) => {
    if (verdict === 'Safe') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (verdict === 'Suspicious') return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Bot className="w-3.5 h-3.5" />
          SHIELDAI SCANNER
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Message Risk Analyzer
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
          Paste any suspicious email, SMS, or direct message to dissect red flags, emotional urgency hooks, and credential harvesting patterns.
        </p>
      </div>

      {/* Mandatory Safety Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 mb-8">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold block mb-0.5">Defensive Educational Simulator Notice:</strong>
          Do not enter passwords, OTPs, payment information, or other sensitive personal information. All analysis is strictly educational.
        </div>
      </div>

      {/* Input Box & Sample Presets */}
      <div className="rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-xl mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <span>Paste Simulated Message Below:</span>
          </label>
          <div className="text-[11px] text-slate-500">
            {inputMessage.length} / 4000 chars
          </div>
        </div>

        {/* Sample Loaders */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] text-slate-400 font-medium">Try Sample:</span>
          {sampleMessages.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(sample.text)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
            >
              {sample.title}
            </button>
          ))}
        </div>

        <textarea
          rows={5}
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Paste message content here (e.g. 'Your delivery is pending address confirmation...')"
          className="w-full p-4 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed font-sans"
        />

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => {
              setInputMessage('');
              setAnalysis(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing || !inputMessage.trim()}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ShieldAI Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analyze Message</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ANALYSIS RESULTS PANEL */}
      {analysis && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl">
            {/* Top Score Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Overall Classification
                </span>
                <div className="flex items-center gap-3">
                  <span className={`text-xl sm:text-2xl font-extrabold px-4 py-1.5 rounded-xl border ${getVerdictStyle(analysis.verdict)}`}>
                    {analysis.verdict === 'Safe' ? '✅ SAFE' : analysis.verdict === 'Suspicious' ? '⚠️ SUSPICIOUS' : '🚨 SPAM'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Confidence: <strong>{analysis.confidence}</strong>
                  </span>
                </div>
              </div>

              {/* Risk Meter Gauge */}
              <div className="w-full sm:w-56 text-left sm:text-right">
                <div className="flex items-center justify-between sm:justify-end gap-2 mb-1.5">
                  <span className="text-xs text-slate-400">Risk Score:</span>
                  <span className={`text-lg font-extrabold font-mono ${analysis.risk_score > 60 ? 'text-rose-400' : analysis.risk_score > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {analysis.risk_score} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      analysis.risk_score > 60
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : analysis.risk_score > 30
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${analysis.risk_score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="py-6 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Executive Assessment
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            {/* Risk Indicators Breakdown */}
            <div className="py-6 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                Risk Indicators Detected
              </h4>
              <div className="space-y-3">
                {analysis.indicators.map((ind, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      ind.detected
                        ? ind.severity === 'Critical'
                          ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                          : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    {ind.detected ? (
                      ind.severity === 'Critical' ? (
                        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      )
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500/60 shrink-0 mt-0.5" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{ind.category}</span>
                        {ind.detected && (
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${ind.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {ind.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300">{ind.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Verification Steps */}
            <div className="pt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Defensive Verification Steps</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.safe_verification_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
