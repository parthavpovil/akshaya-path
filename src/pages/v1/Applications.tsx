import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle, Clock, XCircle, AlertCircle, Eye, IndianRupee, X, Bot, UserCheck, MapPin, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoToggle } from "@/components/DemoToggle";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

type ApplicationStatus = "approved" | "pending" | "in_progress" | "rejected" | "documents_required";

interface TimelineStep {
  step: string;
  date: string;
  done: boolean;
}

interface Application {
  id: string;
  scheme: string;
  category: string;
  applicant: string;
  village: string;
  submittedDate: string;
  lastUpdated: string;
  status: ApplicationStatus;
  statusText: string;
  amount: string;
  timeline: TimelineStep[];
  details: {
    ownerName: string;
    surveyNumber: string;
    landArea: string;
    engineer: string;
    engineerLicense: string;
  };
}

const applications: Application[] = [
  {
    id: "APP-2025-001",
    scheme: "Building Section Number",
    category: "Revenue / Land",
    applicant: "Ramesh Kumar",
    village: "Anantapur, Ward 3",
    submittedDate: "28 Feb 2025",
    lastUpdated: "28 Feb 2025",
    status: "pending" as ApplicationStatus,
    statusText: "Submitted — a site engineer will be assigned shortly for verification. Assignment is randomised to ensure transparency.",
    amount: "—",
    timeline: [
      { step: "Application Submitted", date: "28 Feb 2025", done: true },
      { step: "Permit File Review", date: "In Progress", done: false },
      { step: "Site Engineer Assignment", date: "—", done: false },
      { step: "Site Verification", date: "—", done: false },
      { step: "Section Number Issued", date: "—", done: false },
    ],
    details: {
      ownerName: "Ramesh Kumar",
      surveyNumber: "142/3A",
      landArea: "2,400 sq.ft",
      engineer: "Venkatesh Reddy (CE-4521)",
      engineerLicense: "AP/CE/2019/4521",
    },
  },
];

const statusConfig: Record<ApplicationStatus, { icon: typeof CheckCircle; color: string; bg: string }> = {
  approved: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  pending: { icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  in_progress: { icon: AlertCircle, color: "text-secondary", bg: "bg-secondary/10" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  documents_required: { icon: FileText, color: "text-pending", bg: "bg-pending/10" },
};

// Simulated site engineer data
const siteEngineer = {
  name: "Srinivas Murthy",
  id: "SE-7832",
  phone: "+91 9****67890",
  zone: "Anantapur Zone B",
};

const ApplicationDetailDialog = ({ app, open, onClose }: { app: Application; open: boolean; onClose: () => void }) => {
  const [assignmentPhase, setAssignmentPhase] = useState<"searching" | "assigning" | "assigned">("searching");
  const [progress, setProgress] = useState(0);
  const [liveTimeline, setLiveTimeline] = useState<TimelineStep[]>(app.timeline);

  const runAssignment = useCallback(() => {
    setAssignmentPhase("searching");
    setProgress(0);
    setLiveTimeline(app.timeline);

    // Phase 1: Searching (0-60%)
    const searchInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 60) {
          clearInterval(searchInterval);
          return 60;
        }
        return p + 2;
      });
    }, 50);

    // Phase 2: Assigning (60-90%)
    setTimeout(() => {
      setAssignmentPhase("assigning");
      const assignInterval = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) {
            clearInterval(assignInterval);
            return 90;
          }
          return p + 3;
        });
      }, 60);

      // Phase 3: Assigned (100%)
      setTimeout(() => {
        setAssignmentPhase("assigned");
        setProgress(100);
        // Update timeline
        setLiveTimeline([
          { step: "Application Submitted", date: "28 Feb 2025", done: true },
          { step: "Permit File Review", date: "28 Feb 2025", done: true },
          { step: "Site Engineer Assigned", date: "Just now", done: true },
          { step: "Site Verification", date: "Scheduled", done: false },
          { step: "Section Number Issued", date: "—", done: false },
        ]);
      }, 1800);
    }, 1500);
  }, [app.timeline]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(runAssignment, 600);
      return () => clearTimeout(t);
    }
  }, [open, runAssignment]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border-border glass">
        <DialogTitle className="sr-only">Application Details — {app.id}</DialogTitle>
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">{app.scheme}</h3>
              <p className="text-xs font-mono text-muted-foreground">{app.id} · {app.category}</p>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground font-body">Applicant: {app.applicant} · {app.village}</p>
        </div>

        {/* Application Details */}
        <div className="p-6 space-y-5">
          {/* Property details */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-body">Application Details</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Owner", value: app.details.ownerName },
                { label: "Survey No.", value: app.details.surveyNumber },
                { label: "Land Area", value: app.details.landArea },
                { label: "Licensed Engineer", value: app.details.engineer },
              ].map((d) => (
                <div key={d.label} className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">{d.label}</p>
                  <p className="text-sm font-body text-foreground mt-0.5">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Agent Assignment */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-body flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-secondary" /> AI Agent — Site Engineer Assignment
            </h4>
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <AnimatePresence mode="wait">
                {assignmentPhase === "searching" && (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="h-4 w-4 border-2 border-secondary/30 border-t-secondary rounded-full"
                      />
                      <span className="text-sm font-body text-foreground">Scanning available site engineers...</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body">AI is analysing zone availability, workload, and randomising selection to prevent bias.</p>
                  </motion.div>
                )}
                {assignmentPhase === "assigning" && (
                  <motion.div
                    key="assigning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full"
                      />
                      <span className="text-sm font-body text-foreground">Assigning engineer from randomised pool...</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body">Matching zone proximity and schedule availability.</p>
                  </motion.div>
                )}
                {assignmentPhase === "assigned" && (
                  <motion.div
                    key="assigned"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-semibold font-body">Site Engineer Assigned</span>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-3.5 w-3.5 text-foreground" />
                        <span className="text-sm font-body text-foreground font-medium">{siteEngineer.name}</span>
                        <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{siteEngineer.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                        <MapPin className="h-3 w-3" /> {siteEngineer.zone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                        <Phone className="h-3 w-3" /> {siteEngineer.phone}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Shield className="h-3 w-3 text-success" />
                        <span className="text-[10px] font-mono text-success">Randomised assignment — anti-corruption verified</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Progress value={progress} className="h-1.5" />
              <p className="text-[10px] font-mono text-muted-foreground text-right">{progress}%</p>
            </div>
          </div>

          {/* Live Timeline */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-body">Progress Timeline</h4>
            <div className="space-y-0">
              {liveTimeline.map((step, j) => (
                <motion.div
                  key={`${step.step}-${step.done}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: j * 0.05 }}
                  className="flex items-start gap-3 relative"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: step.done ? "hsl(var(--success))" : "transparent",
                        borderColor: step.done ? "hsl(var(--success))" : "hsl(var(--muted-foreground) / 0.3)",
                      }}
                      transition={{ duration: 0.4 }}
                      className="h-3 w-3 rounded-full border-2 shrink-0 mt-0.5"
                    />
                    {j < liveTimeline.length - 1 && (
                      <div className={`w-0.5 h-8 ${step.done ? "bg-success" : "bg-muted-foreground/20"}`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-body ${step.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step.step}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/60">{step.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Engineer Summary */}
          <AnimatePresence>
            {assignmentPhase === "assigned" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-body">Engineer Briefing Summary</h4>
                <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-body text-foreground">
                    <span className="font-semibold">Assignment:</span> Verify building construction at Survey No. {app.details.surveyNumber}, owned by {app.details.ownerName}.
                  </p>
                  <p className="text-sm font-body text-foreground">
                    <span className="font-semibold">Land Area:</span> {app.details.landArea} — confirm matches permit file.
                  </p>
                  <p className="text-sm font-body text-foreground">
                    <span className="font-semibold">Licensed Engineer:</span> {app.details.engineer} — verify completion certificate.
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-2 italic">
                    Note: Owner identity is anonymised in the engineer's view to prevent direct contact or bribery.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Applications = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="mesh-gradient" />

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            <span className="text-gradient-saffron">Akshaya</span>{" "}
            <span className="text-foreground">Agent</span>
          </h2>
          <div className="flex items-center gap-4 text-sm font-body">
            <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
            <button onClick={() => navigate("/schemes")} className="text-muted-foreground hover:text-foreground transition-colors">Schemes</button>
            <DemoToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-16 px-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-body"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            My <span className="text-gradient-saffron">Applications</span>
          </h1>
          <p className="text-muted-foreground font-body">
            {applications.length} application{applications.length !== 1 ? "s" : ""} · {applications.filter(a => a.status === "approved").length} approved · {applications.filter(a => a.status === "pending" || a.status === "in_progress").length} in progress
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: applications.length, color: "text-foreground" },
            { label: "Approved", value: applications.filter(a => a.status === "approved").length, color: "text-success" },
            { label: "In Progress", value: applications.filter(a => a.status === "in_progress" || a.status === "pending").length, color: "text-secondary" },
            { label: "Action Needed", value: applications.filter(a => a.status === "documents_required").length, color: "text-pending" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="glass-card rounded-2xl p-5 text-center"
            >
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Application Cards */}
        <div className="space-y-4">
          {applications.map((app, i) => {
            const status = statusConfig[app.status];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                className="glass-card rounded-2xl p-6"
              >
                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl ${status.bg} flex items-center justify-center`}>
                      <StatusIcon className={`h-5 w-5 ${status.color}`} />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground">{app.scheme}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{app.id} · {app.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-3 py-1 rounded-full ${status.bg} ${status.color} capitalize`}>
                      {app.status.replace("_", " ")}
                    </span>
                    {app.amount !== "—" && (
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />{app.amount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status text */}
                <p className="text-sm text-muted-foreground font-body mb-4">{app.statusText}</p>

                {/* Timeline */}
                <div className="flex items-center gap-0 mb-4 overflow-x-auto">
                  {app.timeline.map((step, j) => (
                    <div key={j} className="flex items-center min-w-0">
                      <div className="flex flex-col items-center">
                        <div className={`h-3 w-3 rounded-full border-2 ${step.done ? "bg-success border-success" : "bg-transparent border-muted-foreground/30"}`} />
                        <p className="text-[10px] font-mono text-muted-foreground mt-1 text-center max-w-[80px] leading-tight">{step.step}</p>
                        <p className="text-[9px] font-mono text-muted-foreground/60">{step.date}</p>
                      </div>
                      {j < app.timeline.length - 1 && (
                        <div className={`h-0.5 w-8 sm:w-12 mx-1 mt-[-20px] ${step.done ? "bg-success" : "bg-muted-foreground/20"}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs rounded-lg font-body"
                    onClick={() => setSelectedApp(app)}
                  >
                    <Eye className="h-3 w-3 mr-1.5" /> View Details
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Detail Dialog */}
      {selectedApp && (
        <ApplicationDetailDialog
          app={selectedApp}
          open={!!selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default Applications;
