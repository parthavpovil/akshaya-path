import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle, Clock, XCircle, AlertCircle, Eye, Download, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoToggle } from "@/components/DemoToggle";

type ApplicationStatus = "approved" | "pending" | "in_progress" | "rejected" | "documents_required";

const applications = [
  {
    id: "APP-2025-001",
    scheme: "Building Section Number",
    category: "Revenue / Land",
    submittedDate: "28 Feb 2025",
    lastUpdated: "28 Feb 2025",
    status: "pending" as ApplicationStatus,
    statusText: "Submitted — permit file under initial review",
    amount: "—",
    timeline: [
      { step: "Application Submitted", date: "28 Feb 2025", done: true },
      { step: "Permit File Review", date: "In Progress", done: false },
      { step: "Site Verification", date: "—", done: false },
      { step: "Section Number Issued", date: "—", done: false },
    ],
  },
];

const statusConfig: Record<ApplicationStatus, { icon: typeof CheckCircle; color: string; bg: string }> = {
  approved: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  pending: { icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  in_progress: { icon: AlertCircle, color: "text-secondary", bg: "bg-secondary/10" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  documents_required: { icon: FileText, color: "text-pending", bg: "bg-pending/10" },
};

const Applications = () => {
  const navigate = useNavigate();

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
            {applications.length} applications · {applications.filter(a => a.status === "approved").length} approved · {applications.filter(a => a.status === "pending" || a.status === "in_progress").length} in progress
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
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />{app.amount}
                    </span>
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
                  <Button size="sm" variant="outline" className="text-xs rounded-lg font-body">
                    <Eye className="h-3 w-3 mr-1.5" /> View Details
                  </Button>
                  {app.status === "approved" && (
                    <Button size="sm" variant="outline" className="text-xs rounded-lg font-body">
                      <Download className="h-3 w-3 mr-1.5" /> Download Certificate
                    </Button>
                  )}
                  {app.status === "documents_required" && (
                    <Button size="sm" className="text-xs rounded-lg gradient-saffron text-primary-foreground font-body">
                      <FileText className="h-3 w-3 mr-1.5" /> Upload Documents
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Applications;
