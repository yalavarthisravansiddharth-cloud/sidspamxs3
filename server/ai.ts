import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export interface MessageAnalysisResult {
  verdict: 'Safe' | 'Suspicious' | 'Spam';
  risk_score: number; // 0 to 100
  confidence: 'High' | 'Medium' | 'Low';
  summary: string;
  indicators: Array<{
    category: string;
    detected: boolean;
    severity: 'Critical' | 'Warning' | 'Low';
    details: string;
  }>;
  recommendation: string;
  safe_verification_steps: string[];
}

export async function explainQuestionAI(params: {
  questionText: string;
  sender: string;
  correctAnswer: string;
  userAnswer?: string;
  userQuery?: string;
}): Promise<string> {
  const { questionText, sender, correctAnswer, userAnswer, userQuery } = params;

  if (!ai) {
    return generateFallbackExplanation(params);
  }

  const systemInstruction = `You are ShieldAI, an expert cybersecurity awareness mentor for university students and general users.
Your mission is DEFENSIVE cybersecurity education:
- Teach users to spot phishing, smishing, social engineering, and spam.
- Explain deceptive domain tricks, urgency patterns, credential theft hooks, and safe out-of-band verification.
- STRICT SAFETY RULE: Never generate executable exploit code, actual phishing payloads, or advice on conducting cyberattacks.
- Keep answers clear, encouraging, structured with bullet points, and concise (under 250 words).`;

  const prompt = `Cybersecurity Scenario Context:
- Sender: "${sender}"
- Message Content: "${questionText}"
- Correct Classification: "${correctAnswer}"
${userAnswer ? `- User's Chosen Answer: "${userAnswer}"` : ''}
${userQuery ? `- User's Specific Question: "${userQuery}"` : 'Please explain why this message is classified as ' + correctAnswer + ', what warning signs were present, and how a user can verify it safely.'}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4
      }
    });

    return response.text || generateFallbackExplanation(params);
  } catch (error) {
    console.error('Error generating ShieldAI explanation:', error);
    return generateFallbackExplanation(params);
  }
}

export async function analyzeMessageAI(messageText: string): Promise<MessageAnalysisResult> {
  if (!ai) {
    return generateFallbackAnalysis(messageText);
  }

  const systemInstruction = `You are ShieldAI Message Risk Analyzer.
Analyze the provided simulated or fictional message for cybersecurity red flags:
- Urgency triggers
- Suspicious or lookalike links
- Credential requests (passwords, PINs, tokens)
- Payment/gift card demands
- Impersonation of authority (IT, CEO, Bank, Police, Tax agency)
- OTP or verification code requests

IMPORTANT: Return a structured JSON object matching the requested schema.
Be defensive, educational, and thorough.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Analyze this message for spam/phishing risk:\n"""\n${messageText}\n"""`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              description: "Must be 'Safe', 'Suspicious', or 'Spam'"
            },
            risk_score: {
              type: Type.INTEGER,
              description: "Risk score from 0 (completely safe) to 100 (confirmed malicious spam)"
            },
            confidence: {
              type: Type.STRING,
              description: "'High', 'Medium', or 'Low'"
            },
            summary: {
              type: Type.STRING,
              description: "Brief 2-3 sentence overview of why this message presents risk or is safe"
            },
            indicators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: {
                    type: Type.STRING,
                    description: "Category: Urgency, Suspicious Links, Credential Request, Payment Request, Impersonation, OTP Request, Unexpected Attachment, or Unknown Sender"
                  },
                  detected: { type: Type.BOOLEAN },
                  severity: {
                    type: Type.STRING,
                    description: "'Critical', 'Warning', or 'Low'"
                  },
                  details: {
                    type: Type.STRING,
                    description: "Specific explanation of this indicator in the text"
                  }
                },
                required: ["category", "detected", "severity", "details"]
              }
            },
            recommendation: {
              type: Type.STRING,
              description: "Immediate safety advice for the recipient"
            },
            safe_verification_steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 actionable steps to safely verify this message without clicking links"
            }
          },
          required: ["verdict", "risk_score", "confidence", "summary", "indicators", "recommendation", "safe_verification_steps"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.verdict && parsed.indicators) {
      // Normalize verdict
      const v = String(parsed.verdict).toLowerCase();
      parsed.verdict = v.includes('safe') ? 'Safe' : v.includes('suspicious') ? 'Suspicious' : 'Spam';
      return parsed as MessageAnalysisResult;
    }
    return generateFallbackAnalysis(messageText);
  } catch (err) {
    console.error('Error analyzing message with Gemini:', err);
    return generateFallbackAnalysis(messageText);
  }
}

// Fallback rule-based educator when API key is unavailable or during network hiccups
function generateFallbackExplanation(params: {
  questionText: string;
  sender: string;
  correctAnswer: string;
  userAnswer?: string;
  userQuery?: string;
}): string {
  const { sender, correctAnswer, userQuery } = params;

  if (userQuery && userQuery.toLowerCase().includes('verify')) {
    return `### 🛡️ ShieldAI Safe Verification Guide
To safely verify a message like this from "${sender}":
1. **Never use the contact details provided in the message:** Do not click links, reply to the email, or call phone numbers written inside the alert.
2. **Navigate independently:** Open a fresh browser window and manually type the known official domain (e.g., your institution or bank's portal).
3. **Use Out-of-Band confirmation:** Call the customer service or IT number printed on the back of your physical card or listed in your organization directory.
4. **Inspect authentication headers:** Check if the sender address ends in the true domain rather than an external relay or lookalike.`;
  }

  if (userQuery && userQuery.toLowerCase().includes('warning sign')) {
    return `### ⚠️ Warning Signs Breakdown
Key red flags to inspect in this scenario:
- **Artificial Urgency:** Demands for immediate action before accounts get locked or offers expire.
- **Credential Requests:** Demanding passwords, OTP codes, or PIN numbers is a definitive spam indicator.
- **Domain Discrepancies:** The sender name claims to be a trusted entity, but the domain does not match.
- **Uninitiated Action:** Receiving unexpected notices for transactions or orders you never initiated.`;
  }

  return `### 🤖 ShieldAI Analysis
This message is classified as **${correctAnswer}**.
- **Context Assessment:** The sender "${sender}" is using common social-engineering patterns designed to prompt emotional haste rather than rational verification.
- **Defensive Rule:** When in doubt, treat unverified requests as hostile until confirmed through independent official channels.
- **Next Step:** Never click unexpected links or enter credentials on unverified third-party domains.`;
}

function generateFallbackAnalysis(messageText: string): MessageAnalysisResult {
  const text = messageText.toLowerCase();

  const hasUrgency = /immediate|urgent|within \d+|suspended|10 minutes|threat|terminate|expire|final notice|freeze/i.test(text);
  const hasCredential = /password|pin|ssn|social security|login|verify account|confirm your identity|otp|verification code/i.test(text);
  const hasPayment = /gift card|bitcoin|crypto|wire transfer|payment|deposit|\$\d+/i.test(text);
  const hasLink = /http|https|\.com|\.invalid|\.net|\.xyz|click here|link below|portal/i.test(text);
  const hasPrize = /winner|won|lottery|prize|reward|congratulations|free/i.test(text);

  let risk = 10;
  if (hasUrgency) risk += 25;
  if (hasCredential) risk += 35;
  if (hasPayment) risk += 25;
  if (hasLink) risk += 15;
  if (hasPrize) risk += 30;

  risk = Math.min(risk, 98);

  const verdict: 'Safe' | 'Suspicious' | 'Spam' = risk >= 65 ? 'Spam' : risk >= 35 ? 'Suspicious' : 'Safe';

  const indicators = [
    {
      category: 'Urgency & Pressure Tactics',
      detected: hasUrgency,
      severity: hasUrgency ? ('Critical' as const) : ('Low' as const),
      details: hasUrgency ? 'Uses high-pressure language or short deadlines to induce panic.' : 'No excessive urgency triggers detected.'
    },
    {
      category: 'Credential & Identity Harvesting',
      detected: hasCredential,
      severity: hasCredential ? ('Critical' as const) : ('Low' as const),
      details: hasCredential ? 'Directly or indirectly mentions passwords, credentials, OTP codes, or personal identification.' : 'No explicit credential requests detected.'
    },
    {
      category: 'Financial & Payment Requests',
      detected: hasPayment,
      severity: hasPayment ? ('Warning' as const) : ('Low' as const),
      details: hasPayment ? 'References monetary payments, gift cards, or wire transfers.' : 'No financial transaction requests found.'
    },
    {
      category: 'Unverified External Links',
      detected: hasLink,
      severity: hasLink ? ('Warning' as const) : ('Low' as const),
      details: hasLink ? 'Contains URLs or prompts the user to follow an external web link.' : 'No external URLs detected.'
    },
    {
      category: 'Prize & Promotional Lures',
      detected: hasPrize,
      severity: hasPrize ? ('Critical' as const) : ('Low' as const),
      details: hasPrize ? 'Promises unexpected prizes, lottery winnings, or free gifts to entice action.' : 'No suspicious prize lures found.'
    }
  ];

  return {
    verdict,
    risk_score: risk,
    confidence: 'High',
    summary: verdict === 'Safe'
      ? 'The message does not display major automated indicators of phishing or scam lures. However, always exercise baseline caution.'
      : `High-risk indicators identified. The message exhibits patterns typical of ${verdict === 'Spam' ? 'malicious spam or phishing' : 'suspicious social engineering'}.`,
    indicators,
    recommendation: verdict === 'Safe'
      ? 'Verify sender context. If unexpected, confirm through known official channels.'
      : 'Do not click any links, open attachments, or reply with credentials or financial information.',
    safe_verification_steps: [
      'Do not click embedded links or call phone numbers in the message body.',
      'Check the official website or mobile app directly by typing the known URL.',
      'Contact your IT helpdesk or service provider using official directory numbers.',
      'Report the message to your security team or built-in mail spam filter.'
    ]
  };
}
