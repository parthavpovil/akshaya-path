import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2, ArrowLeft, Users, FileCheck, ClipboardList, Send,
  UserCheck, Eye, CheckCircle, Clock, AlertTriangle, Sparkles,
  ChevronRight, Shield, MapPin, Ruler, User, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoToggle } from "@/components/DemoToggle";

// ─── Mock Data ───────────────────────────────────────────────
const applications = [
  {
    id: "BSN-2025-0042",
    applicant: "Ramesh Kumar",
    scheme: "Building Section Number",
    village: "Kottayam South",
    survey: "142/3A",
    date: "28 Feb 2025",
    status: "pending_assignment",
    assignedTo: null,
    engineer: null,
    area: "1,200 sq.ft",
    floors: "G+1",
    type: "Residential",
    licensedEngineer: "Er. Sunil Menon (CEN/KL/2847)",
  },
  {
    id: "BSN-2025-0041",
    applicant: "Lakshmi Sundari",
    scheme: "Building Section Number",
    village: "Thrissur East",
    survey: "88/1B",
    date: "27 Feb 2025",
    status: "assigned_engineer",
    assignedTo: "Secretary B",
    engineer: "Er. Pradeep Nair",
    area: "950 sq.ft",
    floors: "G",
    type: "Residential",
    licensedEngineer: "Er. Arun Das (CEN/KL/1923)",
  },
  {
    id: "BSN-2025-0040",
    applicant: "Suresh Mohan",
    scheme: "Building Section Number",
    village: "Ernakulam West",
    survey: "201/7",
    date: "26 Feb 2025",
    status: "site_review",
    assignedTo: "Secretary A",
    engineer: "Er. Kavitha Raj",
    area: "2,400 sq.ft",
    floors: "G+2",
    type: "Commercial",
    licensedEngineer: "Er. Ravi Shankar (CEN/KL/3102)",
  },
  {
    id: "BSN-2025-0039",
    applicant: "Anita Devi",
    scheme: "Building Section Number",
    village: "Palakkad North",
    survey: "55/2C",
    date: "25 Feb 2025",
    status: "approved",
    assignedTo: "Secretary A",
    engineer: "Er. Manoj Kumar",
    area: "1,800 sq.ft",
    floors: "G+1",
    type: "Residential",
    licensedEngineer: "Er. Deepa Mohan (CEN/KL/2201)",
  },
];

const siteEngineers = ["Er. Pradeep Nair", "Er. Kavitha Raj", "Er. Manoj Kumar", "Er. Vinod Pillai", "Er. Reshma S"];

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  pending_assignment: { label: "Pending Assignment", color: "text-primary", bg: "bg-primary/10" },
  assigned_engineer: { label: "Engineer Assigned", color: "text-secondary", bg: "bg-secondary/10" },
  site_review: { label: "Site Review", color: "text-pending", bg: "bg-pending/10" },
  approved: { label: "Approved", color: "text-success", bg: "bg-success/10" },
  rejected: { label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
};

// ─── Tabs ────────────────────────────────────────────────────
type TabKey = "clerk" | "secretary" | "engineer";

const tabs: { key: TabKey; label: string; icon: typeof ClipboardList; desc: string }[] = [
  { key: "clerk", label: "Clerk", icon: ClipboardList, desc: "Assign applications" },
  { key: "secretary", label: "Secretary", icon: FileCheck, desc: "Approve applications" },
  { key: "engineer", label: "Site Engineer", icon: Ruler, desc: "Review & verify" },
];

// ─── AI Summary Component ────────────────────────────────────
const AISummary = ({ app }: { app: typeof applications[0] }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-4 rounded-xl border border-secondary/20 bg-secondary/5 p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Bot className="h-4 w-4 text-secondary" />
        <span className="text-xs font-display font-semibold text-secondary">AI-Generated Summary</span>
        <Sparkles className="h-3 w-3 text-secondary animate-pulse" />
      </div>
      {!revealed ? (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setRevealed(true)}
          className="text-xs border-secondary/30 text-secondary hover:bg-secondary/10"
        >
          <Eye className="mr-1 h-3 w-3" /> Generate Briefing
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 text-sm font-body text-muted-foreground"
        >
          <p>
            <span className="font-semibold text-foreground">Plan type:</span> {app.type} — {app.floors}, {app.area}
          </p>
          <p>
            <span className="font-semibold text-foreground">Licensed Engineer:</span> {app.licensedEngineer}
          </p>
          <p>
            <span className="font-semibold text-foreground">Survey No:</span> {app.survey}, {app.village}
          </p>
          <div className="mt-3 rounded-lg bg-success/5 border border-success/20 p-3">
            <p className="text-xs font-mono text-success flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Document verification: All 4 documents verified
            </p>
          </div>
          <div className="rounded-lg bg-muted p-3 mt-2">
            <p className="text-xs font-body text-muted-foreground">
              <span className="font-semibold text-foreground">Checklist for site visit:</span>
            </p>
            <ul className="text-xs mt-1 space-y-1 text-muted-foreground list-disc list-inside">
              <li>Verify setback distances match submitted plan</li>
              <li>Confirm plot boundaries per survey {app.survey}</li>
              <li>Check foundation alignment with approved layout</li>
              <li>Photograph site from 4 cardinal directions</li>
            </ul>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground/50 mt-2">
            <Shield className="inline h-3 w-3 mr-1" />
            Owner identity anonymised for transparency
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Application Card ────────────────────────────────────────
const AppCard = ({
  app,
  tab,
  onAssign,
  onApprove,
}: {
  app: typeof applications[0];
  tab: TabKey;
  onAssign?: (id: string) => void;
  onApprove?: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const st = statusMap[app.status] ?? statusMap.pending_assignment;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground font-body truncate">{app.id}</p>
            <p className="text-xs text-muted-foreground font-body">
              {tab === "engineer" ? `Survey ${app.survey}, ${app.village}` : `${app.applicant} · ${app.village}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-[11px] font-mono px-2 py-1 rounded-md ${st.bg} ${st.color}`}>
            {st.label}
          </span>
          <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border/50 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-body">
                <div>
                  <span className="text-muted-foreground">Type</span>
                  <p className="text-foreground font-medium">{app.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Area</span>
                  <p className="text-foreground font-medium">{app.area}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Floors</span>
                  <p className="text-foreground font-medium">{app.floors}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Survey No</span>
                  <p className="text-foreground font-medium">{app.survey}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Submitted</span>
                  <p className="text-foreground font-medium">{app.date}</p>
                </div>
                {app.engineer && (
                  <div>
                    <span className="text-muted-foreground">Site Engineer</span>
                    <p className="text-foreground font-medium">{app.engineer}</p>
                  </div>
                )}
              </div>

              {/* Clerk: Assign button */}
              {tab === "clerk" && app.status === "pending_assignment" && onAssign && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                  <Button
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onAssign(app.id); }}
                    className="gradient-saffron text-primary-foreground font-display font-semibold rounded-xl hover:opacity-90 text-xs"
                  >
                    <Send className="mr-1 h-3 w-3" /> Assign to Secretary
                  </Button>
                  <p className="text-[10px] text-muted-foreground/60 font-mono mt-1.5">
                    <Shield className="inline h-3 w-3 mr-0.5" /> Site engineer will be randomised automatically
                  </p>
                </motion.div>
              )}

              {/* Secretary: Approve button */}
              {tab === "secretary" && (app.status === "assigned_engineer" || app.status === "site_review") && onApprove && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onApprove(app.id); }}
                    className="bg-success text-success-foreground font-display font-semibold rounded-xl hover:bg-success/90 text-xs"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" /> Approve & Issue Section No.
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
                    Request Revision
                  </Button>
                </motion.div>
              )}

              {/* Engineer: AI Summary */}
              {tab === "engineer" && <AISummary app={app} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Component ──────────────────────────────────────────
const PanchayatDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("clerk");
  const [appData, setAppData] = useState(applications);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const handleAssign = (id: string) => {
    setAssigningId(id);
    setTimeout(() => {
      const engineer = siteEngineers[Math.floor(Math.random() * siteEngineers.length)];
      setAppData((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "assigned_engineer", assignedTo: "Secretary A", engineer } : a
        )
      );
      setAssigningId(null);
    }, 1500);
  };

  const handleApprove = (id: string) => {
    setAppData((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a))
    );
  };

  const filtered = {
    clerk: appData,
    secretary: appData.filter((a) => a.status !== "pending_assignment"),
    engineer: appData.filter((a) => a.status === "assigned_engineer" || a.status === "site_review"),
  };

  const counts = {
    pending: appData.filter((a) => a.status === "pending_assignment").length,
    assigned: appData.filter((a) => a.status === "assigned_engineer").length,
    review: appData.filter((a) => a.status === "site_review").length,
    approved: appData.filter((a) => a.status === "approved").length,
  };

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
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            <Building2 className="inline h-8 w-8 mr-2 text-success" />
            Panchayat <span className="text-gradient-saffron">Dashboard</span>
          </h1>
          <p className="text-muted-foreground font-body">Manage building permit applications across roles.</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Pending", value: counts.pending, icon: Clock, color: "text-primary" },
            { label: "Assigned", value: counts.assigned, icon: UserCheck, color: "text-secondary" },
            { label: "In Review", value: counts.review, icon: Eye, color: "text-pending" },
            { label: "Approved", value: counts.approved, icon: CheckCircle, color: "text-success" },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted-foreground font-body">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-1"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-semibold transition-all shrink-0 ${
                activeTab === t.key
                  ? "gradient-saffron text-primary-foreground shadow-lg"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              <span className="text-[10px] font-mono opacity-70 hidden sm:inline">· {t.desc}</span>
            </button>
          ))}
        </motion.div>

        {/* Assigning Overlay */}
        <AnimatePresence>
          {assigningId && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 rounded-xl border border-secondary/30 bg-secondary/5 p-4 flex items-center gap-3"
            >
              <div className="h-5 w-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-body text-secondary">
                Randomising site engineer assignment for <span className="font-mono font-semibold">{assigningId}</span>…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered[activeTab].length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl p-12 text-center"
              >
                <p className="text-muted-foreground font-body">No applications in this view.</p>
              </motion.div>
            ) : (
              filtered[activeTab].map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  tab={activeTab}
                  onAssign={handleAssign}
                  onApprove={handleApprove}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default PanchayatDashboard;
