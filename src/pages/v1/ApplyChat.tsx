import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Bot, User, Sparkles, Loader2, CheckCircle, Upload, Building2, MapPin, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TYPE_SPEED = 30;
const BOT_DELAY = 1200;
const AUTO_TYPE_START_DELAY = 800;

type Message = { role: "user" | "assistant"; content: string };

type ScriptEntry = { role: "user" | "assistant"; content: string };

const demoScript: ScriptEntry[] = [
  {
    role: "assistant",
    content: `Namaste! 🙏 I'm your **Akshaya Agent**.\n\nI can help you with government services — building permits, certificates, land records, and more.\n\nWhat would you like help with today?`,
  },
  {
    role: "user",
    content: "I want to get a section number for my new building",
  },
  {
    role: "assistant",
    content: `Great! Getting a **Building Section Number** involves **3 steps**:\n\n🏗️ **Step 1 — Permit File**\nA licensed civil engineer (licensee) submits your building plan. The Panchayat assigns a site engineer to inspect your land. If everything checks out, the Secretary approves the permit.\n\n✅ **Step 2 — Completion Certificate**\nOnce construction is complete, you notify the Panchayat. The site engineer re-inspects to ensure the building matches the approved plan. If approved, the Secretary issues a **Completion Certificate** and **Occupancy Certificate**.\n\n🔢 **Step 3 — Section Number**\nWith all documents in hand, you apply for the final Section Number for your building.\n\n🤖 **How Akshaya helps:** Our AI agents handle assignments and inspections — **no bribing, no middlemen**, fully transparent.\n\nWould you like to know the documents required, or start applying right away?`,
  },
  {
    role: "user",
    content: "What documents do I need?",
  },
  {
    role: "assistant",
    content: `Here are the documents needed for **Building Permit File** (Step 1):\n\n📄 **Required Documents:**\n• Land deed / ownership proof (Patta)\n• Building plan (prepared by licensed engineer)\n• Licensed engineer details & registration certificate\n• Aadhaar Card of the owner\n• Tax receipt of the land\n• Site plan with dimensions\n\n📄 **Additional (if applicable):**\n• NOC from neighbors (for shared walls)\n• Environmental clearance (for large constructions)\n• Water & electricity connection plans\n\n⏱️ **Timeline:** Typically **15-20 working days** from submission to permit approval.\n\n💰 **Fee:** ₹500-₹2,000 depending on building size.\n\nWould you like to **start the application** for the Permit File now?`,
  },
  {
    role: "user",
    content: "Yes, I want to apply for the permit file",
  },
  {
    role: "assistant",
    content: `🚀 Starting your application for **Building Permit File**...\n\nI'll guide you through a quick form. Most fields are pre-filled from your profile — just verify and submit!\n\nLoading application form...`,
  },
];

// Application form data
const formSteps = ["Owner Details", "Land & Building", "Documents", "Review & Submit"];

const dummyOwner = {
  name: "Rajesh Kumar",
  aadhaar: "XXXX-XXXX-4829",
  phone: "+91 98765 43210",
  address: "Ward 7, Kottayam Panchayat, Kerala",
};

const dummyLand = {
  surveyNo: "142/3A",
  area: "2,400 sq.ft",
  zone: "Residential",
  plotAddress: "Plot No. 42, Green Valley Layout, Ward 7",
};

const dummyDocs = [
  { name: "Land_Deed_Patta.pdf", size: "2.4 MB", uploaded: true },
  { name: "Building_Plan_v2.pdf", size: "5.1 MB", uploaded: true },
  { name: "Aadhaar_Card.pdf", size: "1.2 MB", uploaded: true },
  { name: "Tax_Receipt_2025.pdf", size: "0.8 MB", uploaded: true },
  { name: "Engineer_License.pdf", size: "1.5 MB", uploaded: true },
  { name: "Site_Plan.pdf", size: "3.2 MB", uploaded: true },
];

// ── Markdown-bold renderer ──
const RenderContent = ({ content }: { content: string }) => (
  <>
    {content.split(/(\*\*.*?\*\*)/).map((part, j) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
      ) : (
        <span key={j}>{part}</span>
      )
    )}
  </>
);

// ── Application Form ──
const ApplicationForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [step, setStep] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 py-6 space-y-6"
    >
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>Step {step + 1} of {formSteps.length}</span>
          <span>{formSteps[step]}</span>
        </div>
        <Progress value={((step + 1) / formSteps.length) * 100} className="h-2" />
        <div className="flex gap-1">
          {formSteps.map((s, i) => (
            <div
              key={s}
              className={`flex-1 text-center text-[10px] font-mono py-1 rounded ${
                i <= step ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {i < step ? "✓" : ""} {s}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Owner Details
              </h3>
              <p className="text-xs text-muted-foreground font-body">Pre-filled from your profile. Verify and continue.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">Full Name</Label>
                  <Input defaultValue={dummyOwner.name} readOnly className="bg-muted/50 font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">Aadhaar Number</Label>
                  <Input defaultValue={dummyOwner.aadhaar} readOnly className="bg-muted/50 font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">Phone</Label>
                  <Input defaultValue={dummyOwner.phone} readOnly className="bg-muted/50 font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">Address</Label>
                  <Input defaultValue={dummyOwner.address} readOnly className="bg-muted/50 font-body" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Land & Building Details
              </h3>
              <p className="text-xs text-muted-foreground font-body">Details from your land records.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">Survey Number</Label>
                  <Input defaultValue={dummyLand.surveyNo} readOnly className="bg-muted/50 font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">Plot Area</Label>
                  <Input defaultValue={dummyLand.area} readOnly className="bg-muted/50 font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">Zone</Label>
                  <Input defaultValue={dummyLand.zone} readOnly className="bg-muted/50 font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono text-muted-foreground">Plot Address</Label>
                  <Input defaultValue={dummyLand.plotAddress} readOnly className="bg-muted/50 font-body" />
                </div>
              </div>
              <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-mono text-muted-foreground">Licensed Engineer</p>
                  <p className="text-sm font-body text-foreground">Er. Suresh Nair — Lic. #KL-CE-2847</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" /> Documents
              </h3>
              <p className="text-xs text-muted-foreground font-body">All required documents have been uploaded.</p>
              <div className="space-y-2">
                {dummyDocs.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-foreground truncate">{doc.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{doc.size}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Review & Submit
              </h3>
              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Application Type</span>
                  <span className="text-foreground font-semibold">Building Permit File</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Applicant</span>
                  <span className="text-foreground">{dummyOwner.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Survey No.</span>
                  <span className="text-foreground">{dummyLand.surveyNo}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Plot Area</span>
                  <span className="text-foreground">{dummyLand.area}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Licensed Engineer</span>
                  <span className="text-foreground">Er. Suresh Nair</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Documents</span>
                  <span className="text-foreground">{dummyDocs.length} uploaded</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="text-foreground font-semibold">₹1,500</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">
                By submitting, you confirm all details are accurate. The Panchayat will assign a site engineer for inspection within 7 working days.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="font-display">
            Back
          </Button>
        ) : (
          <div />
        )}
        {step < formSteps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} className="gradient-saffron text-primary-foreground font-display">
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onSubmit} className="gradient-saffron text-primary-foreground font-display animate-glow-pulse">
            Submit Application <Send className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Component ──
const ApplyChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [autoTyping, setAutoTyping] = useState(false);
  const [autoTypeComplete, setAutoTypeComplete] = useState(false);
  const [phase, setPhase] = useState<"chat" | "application" | "success">("chat");
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoTypeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (autoTypeRef.current) clearInterval(autoTypeRef.current);
    };
  }, []);

  // Process script entries
  const processNextScript = useCallback(() => {
    if (scriptIndex >= demoScript.length) return;
    const entry = demoScript[scriptIndex];

    if (entry.role === "assistant") {
      // Show typing indicator, then add message
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: entry.content }]);
        setIsTyping(false);
        setScriptIndex((i) => i + 1);
      }, BOT_DELAY);
    } else {
      // Auto-type user message into input
      setTimeout(() => {
        setAutoTyping(true);
        setAutoTypeComplete(false);
        let charIndex = 0;
        const text = entry.content;
        setInput("");
        autoTypeRef.current = setInterval(() => {
          charIndex++;
          setInput(text.slice(0, charIndex));
          if (charIndex >= text.length) {
            if (autoTypeRef.current) clearInterval(autoTypeRef.current);
            autoTypeRef.current = null;
            setAutoTyping(false);
            setAutoTypeComplete(true);
          }
        }, TYPE_SPEED);
      }, AUTO_TYPE_START_DELAY);
    }
  }, [scriptIndex]);

  // Trigger script processing when scriptIndex changes
  useEffect(() => {
    if (phase !== "chat") return;
    processNextScript();
  }, [scriptIndex, processNextScript, phase]);

  // Send message (user clicks send)
  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping || autoTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setAutoTypeComplete(false);

    // Check if this is the last user message triggering transition
    const currentEntry = demoScript[scriptIndex];
    if (currentEntry?.role === "user") {
      setScriptIndex((i) => i + 1);

      // If next entry is the last assistant message, transition after it
      const nextIndex = scriptIndex + 1;
      if (nextIndex === demoScript.length - 1) {
        // Last bot message — transition to form after it appears
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "assistant", content: demoScript[nextIndex].content }]);
          setIsTyping(false);
          setTimeout(() => setPhase("application"), 1500);
        }, BOT_DELAY);
        setScriptIndex(demoScript.length); // prevent further processing
        return;
      }
    }
  };

  const handleSubmit = () => {
    setPhase("success");
    setTimeout(() => navigate("/applications"), 2500);
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
              <p className="text-xs text-muted-foreground font-body">
                {phase === "application" ? "Building Permit Application" : "Building Section Number"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-mono">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Success state */}
      {phase === "success" && (
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="h-20 w-20 rounded-full gradient-saffron flex items-center justify-center mx-auto"
            >
              <CheckCircle className="h-10 w-10 text-primary-foreground" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-foreground">Application Submitted!</h2>
            <p className="text-muted-foreground font-body text-sm max-w-sm mx-auto">
              Your Building Permit File application has been submitted successfully. A site engineer will be assigned within 7 working days.
            </p>
            <p className="text-xs text-muted-foreground font-mono">Application ID: BPF-2026-00847</p>
            <p className="text-xs text-muted-foreground font-mono animate-pulse">Redirecting to applications…</p>
          </motion.div>
        </div>
      )}

      {/* Application form phase */}
      {phase === "application" && (
        <div className="relative z-10 flex-1 overflow-auto">
          <ApplicationForm onSubmit={handleSubmit} />
        </div>
      )}

      {/* Chat phase */}
      {phase === "chat" && (
        <>
          <div className="relative z-10 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div ref={scrollRef} className="max-w-3xl mx-auto px-4 py-6 space-y-4 min-h-full">
                {/* Context badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center mb-2"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="h-3 w-3" />
                    Building Section Number
                  </span>
                </motion.div>

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
                        <RenderContent content={msg.content} />
                      </div>
                      {msg.role === "user" && (
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
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
                    value={input}
                    readOnly={autoTyping}
                    onChange={(e) => !autoTyping && setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask about schemes, eligibility, documents…"
                    rows={1}
                    className="w-full resize-none bg-muted/50 border border-border rounded-xl px-4 py-3 pr-12 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    style={{ maxHeight: "120px" }}
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping || autoTyping}
                  size="icon"
                  className={`h-11 w-11 rounded-xl gradient-saffron text-primary-foreground hover:opacity-90 transition-opacity shrink-0 flex items-center justify-center ${
                    autoTypeComplete ? "animate-glow-pulse" : ""
                  }`}
                >
                  <Send className="h-4 w-4 block" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono text-center mt-2 opacity-60">
                Akshaya Agent · AI-powered scheme assistant
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplyChat;
