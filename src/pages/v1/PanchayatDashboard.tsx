import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2, ArrowLeft, Send, UserCheck, Eye, CheckCircle, Clock,
  Sparkles, ChevronRight, Shield, Ruler, Bot, FileCheck, ClipboardList,
  MapPin, Camera, CheckSquare, ArrowRight, PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoToggle } from "@/components/DemoToggle";

type Phase = "clerk" | "engineer" | "secretary" | "done";

const siteEngineers = ["Er. Pradeep Nair", "Er. Kavitha Raj", "Er. Manoj Kumar", "Er. Vinod Pillai", "Er. Reshma S"];

const tabs: { key: Phase; label: string; icon: typeof ClipboardList; step: number }[] = [
  { key: "clerk", label: "Clerk", icon: ClipboardList, step: 1 },
  { key: "engineer", label: "Site Engineer", icon: Ruler, step: 2 },
  { key: "secretary", label: "Secretary", icon: FileCheck, step: 3 },
];

const application = {
  id: "BSN-2025-0042",
  applicant: "Ramesh Kumar",
  scheme: "Building Section Number",
  village: "Kottayam South",
  survey: "142/3A",
  date: "28 Feb 2025",
  area: "1,200 sq.ft",
  floors: "G+1",
  type: "Residential",
  licensedEngineer: "Er. Sunil Menon (CEN/KL/2847)",
};

const PanchayatDashboard = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("clerk");
  const [assigning, setAssigning] = useState(false);
  const [assignedEngineer, setAssignedEngineer] = useState<string | null>(null);
  const [summaryRevealed, setSummaryRevealed] = useState(false);
  const [verificationChecks, setVerificationChecks] = useState<boolean[]>([false, false, false, false]);
  const [engineerNote, setEngineerNote] = useState("");
  const [forwarded, setForwarded] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleAssign = () => {
    setAssigning(true);
    setTimeout(() => {
      const eng = siteEngineers[Math.floor(Math.random() * siteEngineers.length)];
      setAssignedEngineer(eng);
      setAssigning(false);
      setTimeout(() => setPhase("engineer"), 800);
    }, 2000);
  };

  const allChecked = verificationChecks.every(Boolean);

  const handleForwardToSecretary = () => {
    setForwarded(true);
    setTimeout(() => setPhase("secretary"), 800);
  };

  const handleApprove = () => {
    setApproved(true);
    setTimeout(() => setPhase("done"), 1200);
  };

  const toggleCheck = (i: number) => {
    setVerificationChecks((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const checklistItems = [
    "Setback distances match submitted plan",
    `Plot boundaries verified per survey ${application.survey}`,
    "Foundation alignment matches approved layout",
    "Site photographs captured (4 directions)",
  ];

  const phaseIndex = phase === "done" ? 3 : tabs.findIndex((t) => t.key === phase);

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            <span className="text-gradient-saffron">Akshaya</span>{" "}
            <span className="text-foreground">Agent</span>
            <span className="ml-2 text-xs font-mono bg-success/10 text-success px-2 py-0.5 rounded-md">Panchayat</span>
          </h2>
          <div className="flex items-center gap-3">
            <DemoToggle />
            <ThemeToggle />
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
              <ArrowLeft className="h-4 w-4" /> Home
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            <Building2 className="inline h-8 w-8 mr-2 text-success" />
            Panchayat <span className="text-gradient-saffron">Dashboard</span>
          </h1>
          <p className="text-muted-foreground font-body text-sm">Building Section Number — Application Workflow</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center gap-0">
            {tabs.map((t, i) => {
              const isActive = t.key === phase;
              const isDone = i < phaseIndex;
              return (
                <div key={t.key} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-semibold transition-all ${
                    isActive ? "gradient-saffron text-primary-foreground shadow-lg" :
                    isDone ? "bg-success/10 text-success" :
                    "glass-card text-muted-foreground"
                  }`}>
                    {isDone ? <CheckCircle className="h-4 w-4" /> : <t.icon className="h-4 w-4" />}
                    <span className="hidden sm:inline">{t.label}</span>
                    <span className="sm:hidden text-xs">Step {t.step}</span>
                  </div>
                  {i < tabs.length - 1 && (
                    <div className={`w-6 sm:w-10 h-0.5 mx-1 transition-colors ${isDone ? "bg-success" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Application Card — always visible */}
        <motion.div layout className="glass-card rounded-2xl overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-foreground">{application.id}</p>
                  <p className="text-xs text-muted-foreground font-body">{application.scheme}</p>
                </div>
              </div>
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md ${
                phase === "clerk" ? "bg-primary/10 text-primary" :
                phase === "engineer" ? "bg-pending/10 text-pending" :
                phase === "secretary" ? "bg-secondary/10 text-secondary" :
                "bg-success/10 text-success"
              }`}>
                {phase === "clerk" ? "Pending Assignment" :
                 phase === "engineer" ? "Site Verification" :
                 phase === "secretary" ? "Awaiting Approval" :
                 "Permit Ready"}
              </span>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-body">
              {phase !== "engineer" && (
                <div>
                  <span className="text-muted-foreground">Applicant</span>
                  <p className="text-foreground font-medium">{application.applicant}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Village</span>
                <p className="text-foreground font-medium">{application.village}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Survey No</span>
                <p className="text-foreground font-medium">{application.survey}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Type</span>
                <p className="text-foreground font-medium">{application.type} · {application.floors}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Area</span>
                <p className="text-foreground font-medium">{application.area}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted</span>
                <p className="text-foreground font-medium">{application.date}</p>
              </div>
            </div>
            {assignedEngineer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs font-body">
                <span className="text-muted-foreground">Assigned Engineer: </span>
                <span className="text-foreground font-medium">{assignedEngineer}</span>
              </motion.div>
            )}
            {phase === "engineer" && (
              <p className="text-[10px] font-mono text-muted-foreground/50 mt-2 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Owner identity anonymised for transparency
              </p>
            )}
          </div>
        </motion.div>

        {/* Phase-specific Actions */}
        <AnimatePresence mode="wait">
          {/* ─── CLERK ─── */}
          {phase === "clerk" && (
            <motion.div key="clerk" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" /> Clerk Action
              </h3>
              <p className="text-sm text-muted-foreground font-body mb-4">
                This application needs to be forwarded. A site engineer will be randomly assigned to ensure transparency and prevent bias.
              </p>

              <AnimatePresence>
                {assigning ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-xl border border-secondary/30 bg-secondary/5">
                    <div className="h-5 w-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-body text-secondary">Randomising site engineer assignment…</p>
                  </motion.div>
                ) : assignedEngineer ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-4 rounded-xl border border-success/30 bg-success/5">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-body text-success font-medium">Assigned to {assignedEngineer}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">Moving to site engineer…</p>
                    </div>
                  </motion.div>
                ) : (
                  <Button onClick={handleAssign} className="gradient-saffron text-primary-foreground font-display font-semibold rounded-xl hover:opacity-90">
                    <Send className="mr-2 h-4 w-4" /> Assign & Forward
                  </Button>
                )}
              </AnimatePresence>

              <p className="text-[10px] text-muted-foreground/60 font-mono mt-3 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Engineer assignment is randomised — clerk cannot choose
              </p>
            </motion.div>
          )}

          {/* ─── ENGINEER ─── */}
          {phase === "engineer" && (
            <motion.div key="engineer" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">
              {/* AI Summary */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-secondary" /> Agentic Summary
                  <Sparkles className="h-3 w-3 text-secondary animate-pulse" />
                </h3>

                {!summaryRevealed ? (
                  <Button size="sm" variant="outline" onClick={() => setSummaryRevealed(true)} className="text-xs border-secondary/30 text-secondary hover:bg-secondary/10">
                    <Eye className="mr-1 h-3 w-3" /> Generate Briefing
                  </Button>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-3 text-sm font-body">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg bg-muted p-3">
                        <span className="text-muted-foreground">Plan</span>
                        <p className="text-foreground font-medium">{application.type} · {application.floors} · {application.area}</p>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <span className="text-muted-foreground">Licensed Engineer</span>
                        <p className="text-foreground font-medium">{application.licensedEngineer}</p>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <span className="text-muted-foreground">Location</span>
                        <p className="text-foreground font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> Survey {application.survey}, {application.village}</p>
                      </div>
                      <div className="rounded-lg bg-success/5 border border-success/20 p-3">
                        <p className="text-xs font-mono text-success flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> All 4 documents verified
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary/5 border border-secondary/20 p-3 text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground mb-1">Agent Notes:</p>
                      <p>Permit file submitted with valid licensed engineer credentials. Land ownership verified via revenue records. Building plan complies with zoning regulations for residential G+1 structures. No encroachment flags detected on survey {application.survey}.</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Verification Checklist */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-pending" /> Site Verification Checklist
                </h3>
                <div className="space-y-2">
                  {checklistItems.map((item, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      onClick={() => toggleCheck(i)}
                      className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border transition-all text-sm font-body ${
                        verificationChecks[i]
                          ? "border-success/30 bg-success/5 text-success"
                          : "border-border bg-background text-muted-foreground hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        verificationChecks[i] ? "border-success bg-success" : "border-muted-foreground/30"
                      }`}>
                        {verificationChecks[i] && <CheckCircle className="h-3 w-3 text-success-foreground" />}
                      </div>
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Engineer Notes */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-3">Engineer Remarks (optional)</h3>
                <textarea
                  value={engineerNote}
                  onChange={(e) => setEngineerNote(e.target.value)}
                  placeholder="Add any observations from the site visit…"
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Forward */}
              <div className="flex justify-end">
                <AnimatePresence>
                  {forwarded ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-sm text-success font-body">
                      <CheckCircle className="h-4 w-4" /> Forwarded to Secretary
                    </motion.div>
                  ) : (
                    <Button
                      onClick={handleForwardToSecretary}
                      disabled={!allChecked}
                      className="gradient-saffron text-primary-foreground font-display font-semibold rounded-xl hover:opacity-90 disabled:opacity-40"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" /> Forward to Secretary
                    </Button>
                  )}
                </AnimatePresence>
              </div>
              {!allChecked && !forwarded && (
                <p className="text-[10px] text-muted-foreground/60 font-mono text-right">Complete all checklist items to proceed</p>
              )}
            </motion.div>
          )}

          {/* ─── SECRETARY ─── */}
          {phase === "secretary" && (
            <motion.div key="secretary" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-secondary" /> Secretary Review
              </h3>

              <div className="space-y-3 mb-6">
                <div className="rounded-xl bg-success/5 border border-success/20 p-4 text-xs font-body space-y-1">
                  <p className="text-success font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Site Verification Complete</p>
                  <p className="text-muted-foreground">Engineer: {assignedEngineer} — All 4 checklist items verified</p>
                  {engineerNote && <p className="text-muted-foreground italic">"{engineerNote}"</p>}
                </div>
                <div className="rounded-xl bg-muted p-4 text-xs font-body space-y-1">
                  <p className="text-foreground font-semibold">Application Summary</p>
                  <p className="text-muted-foreground">{application.applicant} · {application.type} {application.floors} · {application.area} · Survey {application.survey}, {application.village}</p>
                  <p className="text-muted-foreground">Licensed Engineer: {application.licensedEngineer}</p>
                </div>
              </div>

              <AnimatePresence>
                {approved ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-4 rounded-xl border border-success/30 bg-success/5">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-sm font-body text-success font-medium">Approved — Permit File Ready</p>
                      <p className="text-[10px] font-mono text-muted-foreground">Section number will be issued to applicant</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex gap-3">
                    <Button onClick={handleApprove} className="bg-success text-success-foreground font-display font-semibold rounded-xl hover:bg-success/90">
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve & Issue Permit
                    </Button>
                    <Button variant="outline" className="rounded-xl text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
                      Request Revision
                    </Button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ─── DONE ─── */}
          {phase === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <PartyPopper className="h-12 w-12 text-primary mx-auto mb-4" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Permit File Issued!</h2>
              <p className="text-sm text-muted-foreground font-body mb-1">
                Building Section Number for <span className="font-semibold text-foreground">{application.id}</span> has been approved.
              </p>
              <p className="text-xs text-muted-foreground font-body mb-6">
                The applicant ({application.applicant}) will be notified and can download the permit.
              </p>
              <Button variant="outline" onClick={() => { setPhase("clerk"); setAssigning(false); setAssignedEngineer(null); setSummaryRevealed(false); setVerificationChecks([false,false,false,false]); setEngineerNote(""); setForwarded(false); setApproved(false); }} className="rounded-xl font-display">
                Reset Demo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PanchayatDashboard;
