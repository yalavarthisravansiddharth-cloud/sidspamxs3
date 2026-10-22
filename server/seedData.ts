export interface TrainingQuestion {
  id: string;
  difficulty: 'beginner' | 'intermediate' | 'hard';
  category: string;
  sender: string;
  sender_email: string;
  message_type: 'Email' | 'SMS' | 'Chat Message';
  message: string;
  fictional_link?: string;
  correct_answer: 'Safe' | 'Suspicious' | 'Spam';
  explanation: string;
  warning_signs: string[];
  inspection_details?: {
    sender_domain: string;
    link_domain?: string;
    urgency_level: 'Low' | 'Medium' | 'Critical';
    requested_info: string;
    context: string;
    flags: string[];
  };
  created_at: string;
}

export const SEED_QUESTIONS: TrainingQuestion[] = [
  // ===================== BEGINNER (12 questions) =====================
  {
    id: "q-beg-01",
    difficulty: "beginner",
    category: "Delivery",
    sender: "QuickParcel Express",
    sender_email: "noreply@delivery-parcel99.invalid",
    message_type: "SMS",
    message: "Your package #US-8821 could not be delivered due to an incomplete street address. Confirm your address immediately to avoid returning the package to sender.",
    fictional_link: "https://delivery-confirm.invalid/address",
    correct_answer: "Suspicious",
    explanation: "This is a classic 'smishing' (SMS phishing) lure. The message creates fake urgency and provides an unverified external link instead of asking you to check via the official tracking portal.",
    warning_signs: [
      "Artificial urgency ('immediately to avoid return')",
      "Generic delivery notification with no order number or purchase context",
      "Suspicious link domain ('delivery-confirm.invalid')"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-02",
    difficulty: "beginner",
    category: "Prizes & Rewards",
    sender: "Lucky Winner Promo",
    sender_email: "prizes@win-smartphone-free.invalid",
    message_type: "Email",
    message: "CONGRATULATIONS! You have been chosen as today's 1st place winner of a brand-new 512GB Smartphone! Claim your prize now by entering your full name, home address, and social security number.",
    fictional_link: "https://claim-prize.invalid/winner",
    correct_answer: "Spam",
    explanation: "You cannot win a contest or lottery you never entered. Scammers use grandiose prize promises to harvest sensitive personal data (like SSN) for identity theft.",
    warning_signs: [
      "Too good to be true prize offer",
      "Contest you never participated in",
      "Requests highly sensitive personal identity info (SSN)"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-03",
    difficulty: "beginner",
    category: "Account Security",
    sender: "URGENT SECURITY ALERT",
    sender_email: "support@account-system-warn.invalid",
    message_type: "Email",
    message: "FINAL WARNING: Your email account will be permanently deleted in 10 minutes! Send your current password and 6-digit phone verification code immediately to keep your mailbox active.",
    fictional_link: "https://account-warning.invalid/login",
    correct_answer: "Spam",
    explanation: "Legitimate email providers NEVER ask you to reply with your password or one-time verification code, and they never issue arbitrary 10-minute deletion deadlines.",
    warning_signs: [
      "Extreme panic countdown ('deleted in 10 minutes')",
      "Explicit request for password and two-factor OTP",
      "Aggressive all-caps intimidation tactics"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-04",
    difficulty: "beginner",
    category: "Work & School",
    sender: "Campus Bookstore",
    sender_email: "orders@university.edu",
    message_type: "Email",
    message: "Your textbook reservation for Biology 101 has been confirmed. You can pick up your order at the campus center during regular business hours (Mon-Fri 9am-5pm). Receipt #BK-4921.",
    correct_answer: "Safe",
    explanation: "This is a legitimate informational confirmation from an official .edu university domain. It does not demand passwords, money, or clicks on dubious links.",
    warning_signs: [
      "No suspicious links or attachments",
      "Sent from legitimate campus domain (@university.edu)",
      "Normal pickup instructions without urgency"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-05",
    difficulty: "beginner",
    category: "Banking & Finance",
    sender: "Online Bank Support",
    sender_email: "security@alert-bank-secure.invalid",
    message_type: "SMS",
    message: "BANK ALERT: Your debit card has been locked due to suspicious fraud in Miami, FL. Call 1-800-555-0199 now or click the link to enter your PIN and restore card access.",
    fictional_link: "https://unlock-card-portal.invalid/pin",
    correct_answer: "Spam",
    explanation: "Banks will never send an SMS requesting that you enter your ATM PIN on a website or call a random number sent in a text. Always dial the phone number on the back of your physical card.",
    warning_signs: [
      "Request for secret PIN / credentials",
      "Fear-inducing claim of fraud to provoke rash action",
      "Third-party unofficial URL"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-06",
    difficulty: "beginner",
    category: "Social Engineering",
    sender: "Office CEO",
    sender_email: "ceo.executive.direct@free-mail-service.invalid",
    message_type: "Chat Message",
    message: "Hey, are you at your desk? I am currently trapped in an all-day board meeting and cannot talk. I need you to quietly purchase five $100 Apple gift cards for a client presentation. Scratch off the backs and email me the PIN codes.",
    correct_answer: "Spam",
    explanation: "This is the classic CEO gift card scam (Business Email Compromise). Executives will never demand subordinate staff buy retail gift cards and email voucher PINs.",
    warning_signs: [
      "Executive claiming they 'cannot talk or take calls'",
      "Demands retail gift cards / untraceable currency",
      "Sent from a free email service rather than corporate system"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-07",
    difficulty: "beginner",
    category: "Account Security",
    sender: "National Tech Helpdesk",
    sender_email: "antivirus-bot@pc-scanner.invalid",
    message_type: "Email",
    message: "VIRUS DETECTED: 17 Trojan malware files detected on your Windows PC! Your webcam is compromised. Click below to download our Emergency Cleaner tool now.",
    fictional_link: "https://clean-virus-fast.invalid/download.exe",
    correct_answer: "Spam",
    explanation: "Websites and unsolicited emails cannot scan your local machine for viruses. Downloading the linked executable (.exe) will actually install malware or ransomware.",
    warning_signs: [
      "Scareware tactic claiming remote infection",
      "Prompts to download an unknown executable (.exe)",
      "Unsolicited claim without you running an antivirus"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-08",
    difficulty: "beginner",
    category: "Prizes & Rewards",
    sender: "Supermarket Rewards",
    sender_email: "rewards@grocery-loyalty.com",
    message_type: "Email",
    message: "Thank you for shopping with us yesterday! Your loyalty card earned 42 reward points on your recent purchase. Log into your account anytime at our official website to view your total balance.",
    correct_answer: "Safe",
    explanation: "This email contains no urgent demands, no requests for payment or credentials, and does not push any questionable external links. It is a standard receipt loyalty update.",
    warning_signs: [
      "No high-pressure tactics",
      "No sensitive data requested",
      "Authentic merchant notification"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-09",
    difficulty: "beginner",
    category: "Work & School",
    sender: "Student Job Placement",
    sender_email: "easyjobs@student-careers-online.invalid",
    message_type: "Email",
    message: "Immediate Remote Student Opening! Earn $95/hour working from home for 2 hours a week. No resume, interview, or experience necessary. To secure your spot, wire a $75 equipment deposit.",
    fictional_link: "https://student-careers-online.invalid/deposit",
    correct_answer: "Spam",
    explanation: "Real employment does not pay $95/hr for zero experience with no interview, nor do legitimate employers ask job candidates to wire money for equipment deposits.",
    warning_signs: [
      "Unrealistic salary promises for minimal effort",
      "Candidate asked to pay money upfront to get hired",
      "No formal interview or company credential"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-10",
    difficulty: "beginner",
    category: "Banking & Finance",
    sender: "Tax Refund Bureau",
    sender_email: "refunds@tax-returns-agency.invalid",
    message_type: "SMS",
    message: "IRS Notice: You have an unclaimed tax rebate of $1,420.50 pending approval. Enter your bank routing and account number on our portal before midnight to receive direct deposit.",
    fictional_link: "https://tax-refund-gov-portal.invalid/claim",
    correct_answer: "Spam",
    explanation: "Tax agencies (such as the IRS or HMRC) never initiate contact with taxpayers via unsolicited SMS or email to distribute surprise refunds with midnight deadlines.",
    warning_signs: [
      "Government agency supposedly communicating via SMS",
      "Promises unexpected government cash rebate",
      "Requests bank routing numbers via text link"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-11",
    difficulty: "beginner",
    category: "Delivery",
    sender: "Global Express",
    sender_email: "tracking@globalexpress.com",
    message_type: "Email",
    message: "Your shipment #GE-90214 has shipped via Ground Shipping. Estimated delivery date: Thursday by 8:00 PM. Track status at globalexpress.com or directly inside your merchant account.",
    correct_answer: "Safe",
    explanation: "The email contains standard shipment details matching typical logistics communication, with no strange redirected links or coercive prompts.",
    warning_signs: [
      "Standard logistics update",
      "Mentions standard tracking through official channels",
      "No alarmist tone"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-beg-12",
    difficulty: "beginner",
    category: "Account Security",
    sender: "Social Media Platform",
    sender_email: "admin@insta-verify-badge-vip.invalid",
    message_type: "Chat Message",
    message: "Hey! Your profile has been pre-approved for an official Blue Verification Badge. Click the link within 24 hours and enter your password to activate the badge before it is passed to someone else.",
    fictional_link: "https://insta-verify-badge-vip.invalid/badge",
    correct_answer: "Suspicious",
    explanation: "Social media networks do not reach out through direct messages offering free badges while asking for your password on an unofficial third-party domain.",
    warning_signs: [
      "Direct message offering prestige status / badges",
      "Directs to an unverified domain to harvest login credentials",
      "Creates artificial fear of missing out (FOMO)"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },

  // ===================== INTERMEDIATE (12 questions) =====================
  {
    id: "q-int-01",
    difficulty: "intermediate",
    category: "Delivery",
    sender: "Parcel Courier Services",
    sender_email: "dispatch@parcel-update.invalid",
    message_type: "Email",
    message: "Your delivery is waiting for address confirmation. A courier attempted delivery but was unable to locate unit number. Please review the delivery details within 48 hours to avoid a package return fee.",
    fictional_link: "https://parcel-update.invalid/details",
    correct_answer: "Suspicious",
    explanation: "The message looks polished and uses polite phrasing, but it comes from an unverified domain ('parcel-update.invalid') and lacks specific recipient order details. You should look up tracking on the retailer's original app.",
    warning_signs: [
      "Unexpected external link for address confirmation",
      "Vague delivery information with no merchant name",
      "Domain does not match legitimate national postal carriers"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-02",
    difficulty: "intermediate",
    category: "Account Security",
    sender: "Cloud Account Security",
    sender_email: "no-reply@security-review.invalid",
    message_type: "Email",
    message: "We noticed unusual activity on your cloud account from an unrecognized IP address (St. Petersburg, Russia). Verify your identity immediately to prevent temporary restrictions on your documents.",
    fictional_link: "https://security-review.invalid/verify",
    correct_answer: "Suspicious",
    explanation: "Scammers frequently spoof security alerts using foreign IP addresses to trigger panic. While genuine alerts exist, the sender domain 'security-review.invalid' is not the actual cloud service.",
    warning_signs: [
      "Fear trigger citing foreign location login",
      "Sender domain is generic rather than provider's authentic domain",
      "Direct link to login instead of instructing you to visit provider directly"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-03",
    difficulty: "intermediate",
    category: "Prizes & Rewards",
    sender: "Customer Loyalty Group",
    sender_email: "appreciation@reward-confirm.invalid",
    message_type: "Email",
    message: "You have been selected for our quarterly customer appreciation reward ($50 store credit). To confirm your eligibility and credit balance, please review your account profile.",
    fictional_link: "https://reward-confirm.invalid",
    correct_answer: "Spam",
    explanation: "This is a subtle phishing hook that relies on curiosity and modest rewards rather than extreme sums. The destination link leads to a credential phishing form.",
    warning_signs: [
      "Unsolicited reward selection",
      "Generic sender with no corporate branding",
      "Directs to unfamiliar domain to harvest login details"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-04",
    difficulty: "intermediate",
    category: "Work & School",
    sender: "HR Benefits Portal",
    sender_email: "benefits@company-internal.com",
    message_type: "Email",
    message: "Annual open enrollment begins next Monday, November 3rd. Please review the 2026 Healthcare Plan summary document on the employee intranet at intranet.company-internal.com/hr. No action is required if you wish to keep your existing plan.",
    correct_answer: "Safe",
    explanation: "Sent from the recognized corporate domain, references realistic internal schedule, and explicitly states 'No action is required if you wish to keep existing plan', indicating non-coercive legitimate HR communication.",
    warning_signs: [
      "Points to known internal intranet",
      "Legitimate company communication schedule",
      "No artificial urgency or credential harvesting"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-05",
    difficulty: "intermediate",
    category: "Banking & Finance",
    sender: "Accounting Department",
    sender_email: "billing@vendor-invoicing-net.invalid",
    message_type: "Email",
    message: "Invoice #INV-2026-889 is past due. An outstanding balance of $380.00 remains on your account. Review the attached PDF invoice and update your payment method via the link below to avoid service interruption.",
    fictional_link: "https://vendor-invoicing-net.invalid/pay",
    correct_answer: "Suspicious",
    explanation: "Invoice fraud targets individuals and businesses with realistic small dollar amounts. The sender domain does not belong to any vendor you actually trade with.",
    warning_signs: [
      "Threat of service interruption over unknown past due bill",
      "Link directs to an external payment processor",
      "Recipient has no record of doing business with this entity"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-06",
    difficulty: "intermediate",
    category: "Account Security",
    sender: "Streaming Service",
    sender_email: "billing-update@stream-accounts-auth.invalid",
    message_type: "Email",
    message: "We were unable to process your monthly membership payment. Your subscription is temporarily suspended. Update your credit card information within 24 hours to resume watching uninterrupted.",
    fictional_link: "https://stream-accounts-auth.invalid/billing",
    correct_answer: "Suspicious",
    explanation: "Subscription renewal scams mimic Netflix, Spotify, or Disney+. The domain 'stream-accounts-auth.invalid' is a lookalike designed to steal payment card details.",
    warning_signs: [
      "Spoofed streaming brand notification",
      "Short deadline threatening immediate suspension",
      "Requests full payment card entry through untrusted link"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-07",
    difficulty: "intermediate",
    category: "Work & School",
    sender: "IT Helpdesk Notice",
    sender_email: "helpdesk@it-system-upgrade.invalid",
    message_type: "Email",
    message: "Scheduled Server Maintenance: We are migrating email quotas to Office 365 Cloud. All staff must validate their login session to avoid mailbox de-synchronization.",
    fictional_link: "https://it-system-upgrade.invalid/validate",
    correct_answer: "Suspicious",
    explanation: "IT departments handle mail migration on server infrastructure without asking users to click a link and 'validate' credentials on external third-party sites.",
    warning_signs: [
      "Technical jargon used to induce compliance",
      "External domain pretending to be internal IT",
      "Credential validation lure"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-08",
    difficulty: "intermediate",
    category: "Social Engineering",
    sender: "Flight Reservations",
    sender_email: "reservations@airline-booking.com",
    message_type: "Email",
    message: "Your e-ticket for Flight #AA-402 from Chicago (ORD) to San Francisco (SFO) is confirmed. Passenger: Sravan Siddharth. Terminal 3, Seat 14B. Check in 24 hours before departure on our mobile app.",
    correct_answer: "Safe",
    explanation: "This is a legitimate confirmation for a travel booking you initiated. It has accurate flight routing, passenger context, and points to the official airline app.",
    warning_signs: [
      "Expected communication matching a user purchase",
      "Standard airline reservation details",
      "No suspicious links or credential requests"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-09",
    difficulty: "intermediate",
    category: "Banking & Finance",
    sender: "Mobile Pay Service",
    sender_email: "notifications@pay-transaction-review.invalid",
    message_type: "SMS",
    message: "You sent $280.00 to 'Alex Martinez'. If you did not authorize this transaction, cancel it immediately at pay-transaction-review.invalid/dispute within 15 minutes.",
    fictional_link: "https://pay-transaction-review.invalid/dispute",
    correct_answer: "Spam",
    explanation: "This is a classic 'phantom transaction' lure. Because you never sent money, your immediate impulse is to panic and click 'cancel', which takes you to a fake bank login form.",
    warning_signs: [
      "Fabricated money transfer designed to provoke panic",
      "Urgent 15-minute cancellation window",
      "Third-party link instead of opening your verified payment app"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-10",
    difficulty: "intermediate",
    category: "Work & School",
    sender: "University Library",
    sender_email: "circulation@library.university.edu",
    message_type: "Email",
    message: "Friendly reminder: 'Computer Networking: A Top-Down Approach' is due in 3 days on Oct 25. You can renew items online through the student portal or return it to the 1st floor book drop.",
    correct_answer: "Safe",
    explanation: "Genuine campus library notification. It uses a polite tone, specifies the exact book title, gives a reasonable timeline, and originates from official .edu servers.",
    warning_signs: [
      "Legitimate educational domain (.edu)",
      "Accurate non-panicked notification",
      "Does not require clicking any strange link"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-11",
    difficulty: "intermediate",
    category: "Social Engineering",
    sender: "Social Media Copyright Team",
    sender_email: "appeals@copyright-infringement-meta.invalid",
    message_type: "Email",
    message: "Copyright Infringement Notice: A post on your page violated intellectual property guidelines. If you believe this is a mistake, submit an appeal form within 24 hours or your profile will be permanently deactivated.",
    fictional_link: "https://copyright-infringement-meta.invalid/appeal",
    correct_answer: "Suspicious",
    explanation: "Targeted attack against content creators and regular users. Impersonates legal/copyright teams to frighten users into handing over two-factor backup codes and passwords.",
    warning_signs: [
      "Intimidating copyright violation claim",
      "24-hour threat of permanent account deletion",
      "Domain spoofing brand names ('meta.invalid')"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-int-12",
    difficulty: "intermediate",
    category: "Account Security",
    sender: "Cloud Storage Quota",
    sender_email: "support@drive-cloud-storage.invalid",
    message_type: "Email",
    message: "Your cloud drive storage is 99% full (14.9 GB of 15 GB used). Incoming emails and uploads will be blocked starting tomorrow. Upgrade or clean your storage quota via the portal.",
    fictional_link: "https://drive-cloud-storage.invalid/upgrade",
    correct_answer: "Suspicious",
    explanation: "Scammers spoof storage limit alerts to capture single-sign-on (SSO) credentials. Check your storage status by navigating directly to drive.google.com or onedrive.live.com.",
    warning_signs: [
      "Vague cloud service without naming the actual provider",
      "Threat of blocking incoming communication",
      "Generic non-provider link"
    ],
    created_at: "2026-01-01T00:00:00.000Z"
  },

  // ===================== HARD (12 questions) =====================
  {
    id: "q-hrd-01",
    difficulty: "hard",
    category: "Work & School",
    sender: "Campus Security Team",
    sender_email: "security@campus-support.invalid",
    message_type: "Email",
    message: "Mandatory campus security update: All active students and faculty accounts must complete the multi-factor authentication enrollment audit by Friday 5 PM. Review your account profile to verify device compatibility.",
    fictional_link: "https://campus-security.invalid/login",
    correct_answer: "Suspicious",
    explanation: "Sophisticated spear-phishing scenario mimicking university IT. While the message mimics standard institutional compliance, the sender domain 'campus-support.invalid' does not match the university's authentic '.edu' infrastructure.",
    warning_signs: [
      "Lookalike domain ('campus-support.invalid' instead of official '.edu')",
      "Mandatory institutional compliance tone",
      "External portal asking for campus SSO login"
    ],
    inspection_details: {
      sender_domain: "campus-support.invalid (Unverified external registrar, not affiliated with university.edu)",
      link_domain: "campus-security.invalid (Hosted on external VPS in offshore jurisdiction)",
      urgency_level: "Medium",
      requested_info: "Campus Single-Sign-On (SSO) username and password",
      context: "Sent during midterms week when security compliance audits are common",
      flags: [
        "Domain mismatch with real academic institution",
        "Headers fail DKIM/DMARC authentication",
        "External login prompt mimicking internal CAS/Shibboleth SSO"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-02",
    difficulty: "hard",
    category: "Work & School",
    sender: "Enterprise IT Helpdesk",
    sender_email: "helpdesk@corporate-sso-gateway.invalid",
    message_type: "Chat Message",
    message: "Hi there, this is Marcus from corporate IT Tier-2. We are resolving an ongoing sync glitch with your workstation security token. A 6-digit MFA prompt just triggered on your authenticator app—please read me that code so I can approve the ticket.",
    correct_answer: "Spam",
    explanation: "This is a direct 'MFA interception' social engineering attack. No legitimate IT professional will ever ask you to verbally disclose or message a multi-factor passcode. The attacker is actively logging into your account.",
    warning_signs: [
      "Direct request for live 6-digit MFA token",
      "Impersonates internal support staff over chat",
      "Exploits employee trust to bypass 2-Factor Authentication"
    ],
    inspection_details: {
      sender_domain: "corporate-sso-gateway.invalid (Self-registered external chat handle)",
      urgency_level: "Critical",
      requested_info: "Live One-Time Password (OTP) / Authenticator 6-digit token",
      context: "Attacker has already guessed or bought your password and needs your 2FA token right now before it expires",
      flags: [
        "Violates fundamental IT policy: never share OTP codes",
        "MFA prompt was triggered by attacker, not you",
        "Attempts to establish artificial rapport ('Marcus from Tier-2')"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-03",
    difficulty: "hard",
    category: "Account Security",
    sender: "Google Accounts",
    sender_email: "no-reply@accounts.google.com",
    message_type: "Email",
    message: "Security alert: A new sign-in was detected on your account from Chrome on macOS in Seattle, WA. If this was you, you can ignore this email. If this wasn't you, you can secure your account at myaccount.google.com/security.",
    correct_answer: "Safe",
    explanation: "This is an authentic security alert from Google's genuine domain (accounts.google.com). It does not threaten immediate account termination, provides accurate device details, and points to Google's official first-party security dashboard.",
    warning_signs: [
      "Sent from authentic domain with valid SPF/DKIM/DMARC",
      "Points directly to legitimate Google security portal (myaccount.google.com)",
      "Does not ask you to enter credentials on third-party links"
    ],
    inspection_details: {
      sender_domain: "accounts.google.com (Cryptographically signed via DKIM=pass, DMARC=pass)",
      link_domain: "myaccount.google.com (Official Google domain with valid SSL certificate)",
      urgency_level: "Low",
      requested_info: "None. Advises user to self-audit settings if unrecognized",
      context: "User recently logged in from a new browser or VPN",
      flags: [
        "Cryptographic signatures match Google authority",
        "No high-pressure deadlines",
        "Standard industry security practice"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-04",
    difficulty: "hard",
    category: "Social Engineering",
    sender: "Prof. Arthur Pendelton (Department Chair)",
    sender_email: "arthur.pendelton.edu@g-mail-relay.invalid",
    message_type: "Email",
    message: "Hello Siddharth. I need a quick favor before my 2 PM faculty symposium. Are you available to review a draft proposal for our upcoming cybersecurity symposium grant? Open the attached Google Doc to review.",
    fictional_link: "https://docs-google-preview.invalid/grant-proposal",
    correct_answer: "Suspicious",
    explanation: "This is a targeted spear-phishing attack. The sender's display name matches your department professor, but inspection of the actual email header reveals it originates from 'g-mail-relay.invalid', and the link leads to a phishing replica.",
    warning_signs: [
      "Display name spoofing (professor's name with an external relay domain)",
      "Subtle fake Google Docs link ('docs-google-preview.invalid')",
      "Targets specific academic relationships"
    ],
    inspection_details: {
      sender_domain: "g-mail-relay.invalid (External spoofing relay, not university.edu)",
      link_domain: "docs-google-preview.invalid (Phishing page mimicking Google Drive)",
      urgency_level: "Medium",
      requested_info: "Google Workspace credentials to 'view document'",
      context: "Targeted spear-phishing exploiting hierarchy and academic authority",
      flags: [
        "Sender email does not match official faculty directory",
        "Domain mimics Google Docs branding",
        "Payload attempts credential harvesting"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-05",
    difficulty: "hard",
    category: "Banking & Finance",
    sender: "University Payroll Office",
    sender_email: "payroll-disbursements@univ-payroll-portal.invalid",
    message_type: "Email",
    message: "Important tax document update: Form W-2 / 1099 wage statements for the recent fiscal quarter are now ready for download. Please log in to confirm your direct deposit routing to prevent tax withholding penalties.",
    fictional_link: "https://univ-payroll-portal.invalid/w2",
    correct_answer: "Suspicious",
    explanation: "Payroll diversion scams are among the highest grossing phishing attacks. Attackers redirect employee direct deposits to offshore prepaid cards by tricking staff into logging into fake payroll portals.",
    warning_signs: [
      "Spoofed university payroll portal",
      "Combines tax form notice with direct deposit modification lure",
      "Domain is unverified third-party host"
    ],
    inspection_details: {
      sender_domain: "univ-payroll-portal.invalid (Lookalike domain registered 4 days ago)",
      link_domain: "univ-payroll-portal.invalid (Cloned Workday/ADP login page)",
      urgency_level: "Medium",
      requested_info: "Employee portal credentials and banking direct deposit routing",
      context: "Quarterly payroll distribution window",
      flags: [
        "Newly registered domain (WHOIS < 7 days old)",
        "Direct deposit modification prompt via unsolicited email",
        "Mimics official college portal graphics"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-06",
    difficulty: "hard",
    category: "Account Security",
    sender: "GitHub Security",
    sender_email: "noreply@github.com",
    message_type: "Email",
    message: "[GitHub] A personal access token (classic) 'deployment-key-2025' on your account has expired. You can generate a replacement token in your developer settings on github.com.",
    correct_answer: "Safe",
    explanation: "Legitimate automated notification from GitHub. It specifies the exact token name, does not contain high-pressure deadlines, provides no suspect external links, and suggests navigating through standard settings.",
    warning_signs: [
      "Official domain with SPF and DKIM pass",
      "Accurate account asset metadata",
      "No urgency, advises checking official account settings"
    ],
    inspection_details: {
      sender_domain: "github.com (Validated DKIM signature: github.com)",
      urgency_level: "Low",
      requested_info: "None",
      context: "User had a 90-day personal access token reach its expiry date",
      flags: [
        "Cryptographically authentic email",
        "Clean, standard notification style",
        "No credential harvesting"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-07",
    difficulty: "hard",
    category: "Work & School",
    sender: "Registrar Office",
    sender_email: "records@academic-holds-system.invalid",
    message_type: "Email",
    message: "ACADEMIC HOLD: An administrative prerequisite audit has placed an enrollment hold on your student profile for the upcoming term. Sign in to your student records portal to appeal before course registration closes.",
    fictional_link: "https://academic-holds-system.invalid/student-login",
    correct_answer: "Suspicious",
    explanation: "This attack exploits student anxiety about course registration and academic standing. Always access your student portal directly via your university bookmark, never through unverified links.",
    warning_signs: [
      "High emotional trigger ('academic hold')",
      "Domain is not an official university .edu domain",
      "Urgency tied to course registration deadline"
    ],
    inspection_details: {
      sender_domain: "academic-holds-system.invalid (Private registration in foreign jurisdiction)",
      link_domain: "academic-holds-system.invalid (Phishing page)",
      urgency_level: "Critical",
      requested_info: "Student portal login credentials",
      context: "Sent during the university's course registration priority week",
      flags: [
        "Not sent from an official institutional domain",
        "Lacks specific student identification ID number",
        "Generic threat to spark emotional haste"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-08",
    difficulty: "hard",
    category: "Banking & Finance",
    sender: "Vendor Procurement Partner",
    sender_email: "accounts-payable@techparts-supply-corp.com",
    message_type: "Email",
    message: "Attention Accounts Payable: Please note that effective immediately, our bank remittance account details have changed due to our corporate bank merger. Please route all pending invoice payments to our new account at First Horizon Bank.",
    correct_answer: "Suspicious",
    explanation: "This is a classic 'Vendor Email Compromise' (VEC) bank account redirection scam. Either the vendor's email was hacked or lookalike spoofing was used. Never change banking routing without out-of-band phone verification using a known trusted number.",
    warning_signs: [
      "Sudden notification of changed banking remittance details",
      "High financial risk requiring out-of-band phone verification",
      "No prior executive notice of banking changes"
    ],
    inspection_details: {
      sender_domain: "techparts-supply-corp.com (Possible compromised inbox or lookalike spoof)",
      urgency_level: "Critical",
      requested_info: "Redirecting corporate wire transfers to a fraudulent bank account",
      context: "Follows an ongoing project billing cycle to seem natural",
      flags: [
        "High-risk wire transfer destination change",
        "Requires mandatory secondary phone verification before any action",
        "Common vector for multi-thousand dollar cyber theft"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-09",
    difficulty: "hard",
    category: "Account Security",
    sender: "Microsoft 365 Security",
    sender_email: "account-protection@login-microsoft-secure.invalid",
    message_type: "Email",
    message: "Multiple failed sign-in attempts detected for your Microsoft 365 organization account. A temporary sign-in token has been issued. Click below to verify your device certificate.",
    fictional_link: "https://login-microsoft-secure.invalid/device-sync",
    correct_answer: "Suspicious",
    explanation: "This email uses subtle domain typo-squatting ('login-microsoft-secure.invalid' rather than 'login.microsoftonline.com'). The 'device certificate' jargon is designed to confuse users into approving a malicious OAuth app or entering credentials.",
    warning_signs: [
      "Spoofed Microsoft 365 authentication domain",
      "Misleading technical pretext ('device certificate verification')",
      "Attempts Adversary-in-the-Middle (AiTM) session hijacking"
    ],
    inspection_details: {
      sender_domain: "login-microsoft-secure.invalid (Spoofed domain attempting AiTM proxying)",
      link_domain: "login-microsoft-secure.invalid (Reverse proxy tool like Evilginx)",
      urgency_level: "Critical",
      requested_info: "M365 credentials and live session cookies",
      context: "Enterprise workforce targeting",
      flags: [
        "AiTM phishing framework signature detected",
        "Attempts to bypass even hardware FIDO2 or SMS 2FA",
        "Domain does not belong to Microsoft Corp"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-10",
    difficulty: "hard",
    category: "Social Engineering",
    sender: "Conference Organizing Committee",
    sender_email: "chairs@ieee-cyberconf2026.org",
    message_type: "Email",
    message: "Dear Author: Congratulations! Your paper submission #CYBER-109 'Resilient Protocols for Distributed Identity' has been accepted for presentation at IEEE CyberConf 2026. The full reviewer comments and camera-ready formatting guidelines are attached on the conference portal at ieee-cyberconf2026.org/portal.",
    correct_answer: "Safe",
    explanation: "Authentic academic conference notification. It contains precise paper submission ID, specific paper title, realistic acceptance details, and points to the official conference submission portal.",
    warning_signs: [
      "Matches user's actual academic research submission",
      "Contains specific paper title and review metadata",
      "Originates from verified professional organization domain"
    ],
    inspection_details: {
      sender_domain: "ieee-cyberconf2026.org (Legitimate academic association domain)",
      link_domain: "ieee-cyberconf2026.org",
      urgency_level: "Low",
      requested_info: "Camera-ready manuscript submission",
      context: "User submitted a paper to this conference 2 months ago",
      flags: [
        "Legitimate communication matching user activity",
        "No suspicious redirects or credential demands"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-11",
    difficulty: "hard",
    category: "Account Security",
    sender: "Authentication Guardian",
    sender_email: "alerts@guardian-2fa-push.invalid",
    message_type: "SMS",
    message: "[AUTH NOTIFICATION] Did you request a sign-in from Austin, TX? Reply '1' to approve or '9' to block and reset your account credentials.",
    correct_answer: "Suspicious",
    explanation: "This is a two-way SMS manipulation attack. If you reply '9', the attacker immediately phones you posing as the fraud department to 'help reset your password' and obtain your 2FA code.",
    warning_signs: [
      "SMS prompt asking user to reply with numbers to approve/block logins",
      "Unsolicited 2FA authentication notification",
      "Prepares the victim for a follow-up vishing (voice phishing) phone call"
    ],
    inspection_details: {
      sender_domain: "guardian-2fa-push.invalid (Shortcode SMS gateway relay)",
      urgency_level: "Critical",
      requested_info: "Interaction reply to validate active phone number and initiate vishing stage",
      context: "Attacker has gathered phone numbers from a recent data breach",
      flags: [
        "Multi-stage social engineering trigger",
        "Legitimate providers do not use interactive reply numbers to manage critical security",
        "Signals attacker is probing response readiness"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "q-hrd-12",
    difficulty: "hard",
    category: "Work & School",
    sender: "Research Office Grants Desk",
    sender_email: "grants-desk@university-research-foundation.invalid",
    message_type: "Email",
    message: "Grant Disbursement Advisory: National Science Foundation (NSF) Grant Award #204918 has released quarterly sub-award funding. Please sign the electronic disbursement disclosure via DocuSign.",
    fictional_link: "https://university-research-foundation.invalid/docusign-auth",
    correct_answer: "Suspicious",
    explanation: "Impersonates university research foundations and DocuSign workflows. DocuSign notifications always originate from docusign.net or docusign.com, never through third-party redirectors.",
    warning_signs: [
      "DocuSign pretext using an unverified domain",
      "Targets faculty and student researchers",
      "Spoofs institutional research foundation"
    ],
    inspection_details: {
      sender_domain: "university-research-foundation.invalid (Not affiliated with university.edu)",
      link_domain: "university-research-foundation.invalid (DocuSign login clone)",
      urgency_level: "Medium",
      requested_info: "Corporate SSO or DocuSign credentials",
      context: "Fiscal quarter grant disbursement timeline",
      flags: [
        "DocuSign notification not originating from docusign.net",
        "Sender domain is newly registered lookalike",
        "Aimed at harvesting institutional credentials"
      ]
    },
    created_at: "2026-01-01T00:00:00.000Z"
  }
];
