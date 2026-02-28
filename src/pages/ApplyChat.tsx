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
          <div className="flex items-end gap-2">
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
              className="h-11 w-11 rounded-xl gradient-saffron text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
            >
              <Send className="h-4 w-4" />
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
  if (lower.includes("eligib") || lower.includes("qualify")) {
    return schemeName
      ? `For **${schemeName}**, the general eligibility criteria include:\n\n• Indian citizen\n• Valid Aadhaar card\n• Income within the prescribed limit\n• Category-specific requirements\n\nWould you like me to check your specific eligibility?`
      : `I'd be happy to check eligibility for you! Could you tell me which scheme you're interested in, or describe what kind of support you need?`;
  }
  if (lower.includes("document") || lower.includes("docs")) {
    return `Typically you'll need:\n\n• Aadhaar Card\n• Income Certificate\n• Ration Card\n• Bank Passbook\n• Passport-size Photos\n\nThe exact documents depend on the scheme. Shall I list the specific ones?`;
  }
  if (lower.includes("apply") || lower.includes("how")) {
    return `Here's the general process:\n\n1. Gather required documents\n2. Visit your nearest CSC (Common Service Centre)\n3. Fill the application form\n4. Submit with supporting documents\n5. Track your application status\n\nI can guide you step-by-step. Ready to begin?`;
  }
  return schemeName
    ? `That's a great question about **${schemeName}**! I can help you with eligibility, documents needed, or the application process. What would you like to know?`
    : `I'd love to help! Could you tell me a bit more? For example:\n\n• What type of support are you looking for?\n• What is your approximate annual income?\n• Which state/district are you in?\n\nThis helps me find the best schemes for you.`;
}

export default ApplyChat;
