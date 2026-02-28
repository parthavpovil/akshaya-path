import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const schemes: Record<string, { name: string; description: string; category: string }> = {
  "pm-kisan": { name: "PM-KISAN", description: "Income support of ₹6,000/year for small and marginal farmers.", category: "Agriculture" },
  "ayushman-bharat": { name: "Ayushman Bharat", description: "Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care.", category: "Health" },
  "pm-awas-yojana": { name: "PM Awas Yojana", description: "Financial assistance for construction of pucca houses for eligible rural households.", category: "Housing" },
  "scholarship-sc-st": { name: "SC/ST Scholarship", description: "Post-matric scholarship for students belonging to Scheduled Castes and Scheduled Tribes.", category: "Education" },
  "ujjwala-yojana": { name: "Ujjwala Yojana", description: "Free LPG connections for women from Below Poverty Line households.", category: "Welfare" },
  "mudra-loan": { name: "MUDRA Loan", description: "Collateral-free loans up to ₹10 lakh for micro and small enterprises.", category: "Finance" },
};

type Message = { role: "user" | "assistant"; content: string };

const ApplyChat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const schemeId = searchParams.get("scheme_id");
  const scheme = schemeId ? schemes[schemeId] : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial greeting
  useEffect(() => {
    const greeting: Message = scheme
      ? {
          role: "assistant",
          content: `Namaste! 🙏 I'm your Akshaya Agent.\n\nI see you're interested in **${scheme.name}** — ${scheme.description}\n\nI can help you understand eligibility, required documents, and guide you through the application process. What would you like to know?`,
        }
      : {
          role: "assistant",
          content: `Namaste! 🙏 I'm your Akshaya Agent.\n\nI can help you find the right government scheme, check your eligibility, and guide you through the application process.\n\nTell me — what kind of support are you looking for? (e.g., housing, health, education, farming, loans)`,
        };

    const timer = setTimeout(() => {
      setMessages([greeting]);
    }, 400);
    return () => clearTimeout(timer);
  }, [scheme]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // TODO: Replace with actual backend call
    // Send `messages` array + scheme context to your edge function
    setTimeout(() => {
      const mockReply: Message = {
        role: "assistant",
        content: getMockReply(text, scheme?.name),
      };
      setMessages((prev) => [...prev, mockReply]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="mesh-gradient" />

      {/* Header */}
      <div className="relative z-10 glass border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/schemes")}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="h-9 w-9 rounded-xl gradient-saffron flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-sm font-semibold text-foreground">Akshaya Agent</h1>
              {scheme && (
                <p className="text-xs text-muted-foreground font-mono">{scheme.name} · {scheme.category}</p>
              )}
              {!scheme && (
                <p className="text-xs text-muted-foreground font-body">Scheme Discovery</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-success font-mono">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="max-w-3xl mx-auto px-4 py-6 space-y-4 min-h-full">
            {/* Scheme context badge */}
            {scheme && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center mb-2"
              >
                <span className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="h-3 w-3" />
                  Context: {scheme.name}
                </span>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-lg gradient-saffron flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "gradient-saffron text-primary-foreground rounded-br-md"
                        : "glass-card text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content.split(/(\*\*.*?\*\*)/).map((part, j) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="h-8 w-8 rounded-lg gradient-saffron flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground font-mono">Thinking…</span>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input area */}
      <div className="relative z-10 glass border-t border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-start gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about schemes, eligibility, documents…"
                rows={1}
                className="w-full resize-none bg-muted/50 border border-border rounded-xl px-4 py-3 pr-12 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                style={{ maxHeight: "120px" }}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-11 w-11 rounded-xl gradient-saffron text-primary-foreground hover:opacity-90 transition-opacity shrink-0 flex items-center justify-center"
            >
              <Send className="h-4 w-4 block" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono text-center mt-2 opacity-60">
            Akshaya Agent · AI-powered scheme assistant
          </p>
        </div>
      </div>
    </div>
  );
};

// Mock replies — will be replaced by actual AI backend
function getMockReply(userText: string, schemeName?: string): string {
  const lower = userText.toLowerCase();

  // Scheme-specific detailed replies
  const schemeDetails: Record<string, Record<string, string>> = {
    "PM-KISAN": {
      eligibility: `For **PM-KISAN**, you are eligible if:\n\n• You are a small/marginal farmer (land ≤ 2 hectares)\n• You hold cultivable land in your name\n• Annual family income is below ₹2,00,000\n• You are NOT a government employee, income tax payer, or institutional landowner\n\n✅ If you meet these criteria, you can receive **₹6,000/year** in 3 installments of ₹2,000 each.\n\nWould you like me to check your eligibility based on your details?`,
      documents: `For **PM-KISAN**, you'll need these documents:\n\n📄 **Mandatory:**\n• Aadhaar Card (linked to mobile)\n• Land ownership records (Khasra/Khatauni)\n• Bank passbook (with IFSC code)\n• Mobile number linked to Aadhaar\n\n📄 **Supporting:**\n• Ration card (for family size verification)\n• Income certificate from Tehsildar\n\n⏱️ Verification usually takes **7-10 working days** after submission.`,
      apply: `Here's your step-by-step guide for **PM-KISAN**:\n\n**Step 1:** Visit your nearest CSC or go to pmkisan.gov.in\n**Step 2:** Click on "New Farmer Registration"\n**Step 3:** Enter your Aadhaar number and captcha\n**Step 4:** Fill in personal details — name, address, category\n**Step 5:** Enter land details — survey number, area in hectares\n**Step 6:** Add bank account details for DBT\n**Step 7:** Upload land records and submit\n\n📱 You can also apply via the PM-KISAN mobile app.\n\n💰 First installment typically arrives within **30-45 days** of approval.\n\nShall I help you gather the documents?`,
    },
    "Ayushman Bharat": {
      eligibility: `For **Ayushman Bharat (PMJAY)**, eligibility is based on:\n\n• Your family must be listed in the **SECC 2011** database\n• OR belong to any of these categories:\n  - Rural: Kutcha house, no adult earning member, SC/ST household, landless\n  - Urban: Rag picker, street vendor, domestic worker, construction worker\n• Annual family income below ₹5,00,000\n\n✅ Coverage: **₹5 lakh per family per year** for hospitalization\n🏥 Valid at **25,000+ empanelled hospitals** across India\n\nI can verify your eligibility using your Aadhaar or ration card number.`,
      documents: `For **Ayushman Bharat** card:\n\n📄 **Required:**\n• Aadhaar Card (all family members)\n• Ration Card / SECC reference number\n• Mobile number\n• Passport-size photos\n\n📄 **At hospital (for treatment):**\n• Ayushman Bharat e-card\n• Government-issued ID\n• Referral letter (if applicable)\n\n🆓 The card itself is **FREE** — no charges at any stage.\n\nWant me to find empanelled hospitals near you?`,
      apply: `Here's how to get your **Ayushman Bharat** card:\n\n**Step 1:** Check eligibility at mera.pmjay.gov.in using your mobile/ration card\n**Step 2:** Visit nearest Ayushman Mitra at empanelled hospital or CSC\n**Step 3:** Complete Aadhaar-based eKYC verification\n**Step 4:** Get your e-card generated on the spot (takes ~10 mins)\n**Step 5:** Card is activated immediately for use\n\n🏥 You can use it at any empanelled hospital — no advance payment needed.\n📞 Helpline: **14555** for any queries\n\nWould you like me to locate the nearest Ayushman Mitra?`,
    },
    "PM Awas Yojana": {
      eligibility: `For **PM Awas Yojana (PMAY-G)**, eligibility:\n\n• Household must be in the **Awaas+ housing deprivation list**\n• No pucca house anywhere in India\n• Annual household income ≤ ₹3,00,000\n• Priority: SC/ST, freed bonded labourers, minorities, single women\n\n✅ Assistance: **₹1,20,000** in plains, **₹1,30,000** in hilly areas\n🏠 Plus 90 days of MGNREGA wages for construction\n\nShall I check if your household is in the eligible list?`,
      documents: `For **PM Awas Yojana**:\n\n📄 **Required:**\n• Aadhaar Card (all family members)\n• Land ownership/allotment documents\n• BPL certificate\n• Income certificate\n• Bank account details (for DBT)\n• Passport photos\n\n📄 **Additional (if applicable):**\n• Caste certificate (SC/ST)\n• Disability certificate\n• No-property declaration\n\n📸 Construction progress photos will be needed at each stage for fund release.`,
      apply: `Applying for **PM Awas Yojana**:\n\n**Step 1:** Check your name in the PMAY-G beneficiary list at pmayg.nic.in\n**Step 2:** If listed, visit your Gram Panchayat office\n**Step 3:** Fill out the application form with household details\n**Step 4:** Submit land documents and income certificate\n**Step 5:** Gram Sabha verification and prioritization\n**Step 6:** Sanction order issued after approval\n\n💰 **Payment in installments:**\n• 1st: ₹30,000 (foundation)\n• 2nd: ₹30,000 (lintel level)\n• 3rd: ₹30,000 (roof level)\n• 4th: ₹30,000 (completion)\n\nEach release requires geotagged progress photos.`,
    },
  };

  // Check for scheme-specific responses
  if (schemeName && schemeDetails[schemeName]) {
    const details = schemeDetails[schemeName];
    if (lower.includes("eligib") || lower.includes("qualify") || lower.includes("am i")) {
      return details.eligibility;
    }
    if (lower.includes("document") || lower.includes("docs") || lower.includes("paper") || lower.includes("proof")) {
      return details.documents;
    }
    if (lower.includes("apply") || lower.includes("how") || lower.includes("process") || lower.includes("step")) {
      return details.apply;
    }
  }

  // Generic responses
  if (lower.includes("eligib") || lower.includes("qualify")) {
    return schemeName
      ? `For **${schemeName}**, the general eligibility criteria include:\n\n• Indian citizen with valid Aadhaar\n• Income within prescribed limits\n• Category-specific requirements apply\n\nTell me your approximate annual income and state, and I'll check your exact eligibility.`
      : `I'd be happy to check eligibility! Please share:\n\n1. Your **approximate annual income**\n2. Your **state/district**\n3. Your **category** (General/OBC/SC/ST)\n4. What type of help you need (housing, health, education, etc.)\n\nI'll match you with the best schemes.`;
  }
  if (lower.includes("document") || lower.includes("docs")) {
    return `Most government schemes require:\n\n📄 **Universal:**\n• Aadhaar Card\n• Income Certificate\n• Bank Passbook (for DBT)\n\n📄 **Common:**\n• Ration Card\n• Caste Certificate (if applicable)\n• Passport-size Photos\n• Domicile Certificate\n\nThe exact list depends on the scheme. Which scheme are you applying for?`;
  }
  if (lower.includes("apply") || lower.includes("how")) {
    return `Here's the general process:\n\n1️⃣ **Check eligibility** — I can do this for you\n2️⃣ **Gather documents** — I'll give you the exact list\n3️⃣ **Submit application** — via CSC, online portal, or Panchayat office\n4️⃣ **Track progress** — real-time updates on your dashboard\n\n⏱️ Most applications are processed within **15-30 days**.\n\nWhich scheme would you like to apply for? I'll guide you step-by-step.`;
  }
  if (lower.includes("income") || lower.includes("salary") || lower.includes("earn")) {
    return `Based on income brackets, here are schemes you might qualify for:\n\n💰 **Below ₹1.5L/year:**\n• Ujjwala Yojana (Free LPG)\n• PM Awas Yojana (Housing)\n• PM-KISAN (₹6,000/year)\n\n💰 **Below ₹2.5L/year:**\n• SC/ST Scholarship\n• PM-KISAN\n\n💰 **Below ₹5L/year:**\n• Ayushman Bharat (₹5L health cover)\n\n💼 **Any income:**\n• MUDRA Loan (up to ₹10L)\n\nWhat is your approximate annual income?`;
  }
  if (lower.includes("status") || lower.includes("track") || lower.includes("check")) {
    return `You can track your applications in the **My Applications** section.\n\nCurrently you have:\n✅ 2 Approved (PM-KISAN, SC/ST Scholarship)\n🔄 2 In Progress (Ayushman Bharat, MUDRA Loan)\n⚠️ 1 Action Needed (PM Awas Yojana — upload land records)\n❌ 1 Rejected (Ujjwala Yojana — duplicate connection)\n\nWould you like me to help resolve the pending items?`;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("namaste")) {
    return schemeName
      ? `Namaste! 🙏 Welcome! I see you're looking at **${schemeName}**.\n\nI can help you with:\n• ✅ **Eligibility check** — are you qualified?\n• 📄 **Documents needed** — what to prepare\n• 📝 **Application process** — step by step guide\n\nWhat would you like to start with?`
      : `Namaste! 🙏 Welcome to Akshaya Agent!\n\nI'm your AI-powered scheme assistant. I can help you:\n\n🔍 **Discover** the right government scheme for you\n✅ **Check** your eligibility instantly\n📄 **List** all required documents\n📝 **Guide** you through the application\n\nTell me — what kind of support are you looking for?`;
  }
  if (lower.includes("thank")) {
    return `You're welcome! 🙏 Happy to help.\n\nRemember, you can:\n• Come back anytime to check application status\n• Ask me about any other schemes\n• Visit your nearest CSC for in-person help\n\n📞 Helpline: **1800-111-555** (toll-free)\n\nIs there anything else I can assist you with?`;
  }
  return schemeName
    ? `Great question about **${schemeName}**! I can help you with:\n\n• **"Am I eligible?"** — instant eligibility check\n• **"What documents do I need?"** — complete checklist\n• **"How to apply?"** — step-by-step walkthrough\n• **"Track my application"** — real-time status\n\nWhat would you like to know?`
    : `I'd love to help! To find the best schemes for you, tell me:\n\n1. 🏠 What kind of support? (housing, health, education, farming, loans)\n2. 💰 Approximate annual income?\n3. 📍 Which state are you in?\n4. 👤 Your category? (General/OBC/SC/ST)\n\nOr just describe your situation and I'll find matching schemes!`;
}

export default ApplyChat;
