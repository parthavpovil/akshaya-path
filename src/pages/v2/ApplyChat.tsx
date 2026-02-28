import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = { role: "user" | "assistant"; content: string };

const ApplyChat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const schemeId = searchParams.get("scheme_id");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{
        role: "assistant",
        content: "Namaste! 🙏 I'm your Akshaya Agent.\n\n⚠️ The AI backend is not yet connected. Switch to **Demo mode** to see a working conversation.\n\nOnce the backend is live, I'll be able to help you find schemes, check eligibility, and apply online.",
      }]);
    }, 400);
    return () => clearTimeout(timer);
  }, [schemeId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);
    // TODO: call edge function here
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Backend not connected. Please switch to **Demo mode** to see sample responses, or connect your AI backend." }]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="mesh-gradient" />
      <div className="relative z-10 glass border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/schemes")} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="h-9 w-9 rounded-xl gradient-saffron flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-sm font-semibold text-foreground">Akshaya Agent</h1>
              <p className="text-xs text-muted-foreground font-body">Backend pending</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            Offline
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="max-w-3xl mx-auto px-4 py-6 space-y-4 min-h-full">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && <div className="h-8 w-8 rounded-lg gradient-saffron flex items-center justify-center shrink-0 mt-0.5"><Bot className="h-4 w-4 text-primary-foreground" /></div>}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "gradient-saffron text-primary-foreground rounded-br-md" : "glass-card text-foreground rounded-bl-md"}`}>
                  {msg.content.split(/(\*\*.*?\*\*)/).map((part, j) => part.startsWith("**") && part.endsWith("**") ? <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong> : <span key={j}>{part}</span>)}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="h-8 w-8 rounded-lg gradient-saffron flex items-center justify-center shrink-0"><Bot className="h-4 w-4 text-primary-foreground" /></div>
                <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground font-mono">Thinking…</span>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="relative z-10 glass border-t border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-start gap-2">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about schemes, eligibility, documents…" rows={1} className="flex-1 resize-none bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" style={{ maxHeight: "120px" }} />
            <Button onClick={sendMessage} disabled={!input.trim() || isTyping} size="icon" className="h-11 w-11 rounded-xl gradient-saffron text-primary-foreground hover:opacity-90 transition-opacity shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyChat;
