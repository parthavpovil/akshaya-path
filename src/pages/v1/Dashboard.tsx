import { motion } from "framer-motion";
import { FileText, Send, ClipboardList, ArrowRight, Clock, CheckCircle, AlertCircle, XCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoToggle } from "@/components/DemoToggle";

type ApplicationStatus = "approved" | "pending" | "in_progress" | "rejected" | "documents_required";

const pendingApplications = [
  {
    id: "APP-2025-001",
    scheme: "Building Section Number",
    applicant: "Ramesh Kumar",
    village: "Anantapur, Ward 3",
    submittedDate: "28 Feb 2025",
    status: "pending" as ApplicationStatus,
    statusText: "Awaiting site engineer assignment",
    currentStep: "Permit File Review",
  },
  {
    id: "APP-2025-002",
    scheme: "Building Section Number",
    applicant: "Lakshmi Devi",
    village: "Kadiri, Ward 7",
    submittedDate: "27 Feb 2025",
    status: "in_progress" as ApplicationStatus,
    statusText: "Site engineer assigned — verification scheduled",
    currentStep: "Site Verification",
  },
  {
    id: "APP-2025-003",
    scheme: "Building Section Number",
    applicant: "Venkata Rao",
    village: "Dharmavaram, Ward 2",
    submittedDate: "25 Feb 2025",
    status: "in_progress" as ApplicationStatus,
    statusText: "Site verification complete — awaiting secretary approval",
    currentStep: "Section Number Issuance",
  },
];

const statusConfig: Record<ApplicationStatus, { icon: typeof CheckCircle; color: string; bg: string }> = {
  approved: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  pending: { icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  in_progress: { icon: AlertCircle, color: "text-secondary", bg: "bg-secondary/10" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  documents_required: { icon: FileText, color: "text-pending", bg: "bg-pending/10" },
};

const quickActions = [
  { label: "Browse Schemes", icon: ClipboardList, path: "/schemes" },
  { label: "Chat with Agent", icon: Send, path: "/apply" },
  { label: "All Applications", icon: FileText, path: "/applications" },
];

const stats = [
  { label: "Pending Review", value: "3", color: "text-primary" },
  { label: "In Progress", value: "2", color: "text-secondary" },
  { label: "Completed Today", value: "1", color: "text-success" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            <span className="text-gradient-saffron">Akshaya</span>{" "}
            <span className="text-foreground">Agent</span>
          </h2>
          <div className="flex items-center gap-4 text-sm font-body">
            <button onClick={() => navigate("/schemes")} className="text-muted-foreground hover:text-foreground transition-colors">Schemes</button>
            <button onClick={() => navigate("/applications")} className="text-muted-foreground hover:text-foreground transition-colors">Applications</button>
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">admin</span>
            <DemoToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Admin <span className="text-gradient-saffron">Dashboard</span>
          </h1>
          <p className="text-muted-foreground font-body">Overview of all citizen applications and their current status.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <span className="text-sm text-muted-foreground font-body">{s.label}</span>
              <p className={`font-display text-3xl font-bold ${s.color} mt-2`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((a) => (
              <Button
                key={a.label}
                variant="outline"
                onClick={() => navigate(a.path)}
                className="h-auto py-5 rounded-xl border-border hover:border-primary/30 hover:bg-primary/5 justify-start gap-3 font-body text-foreground"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{a.label}</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Pending Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Applications Requiring Attention
          </h2>
          <div className="space-y-4">
            {pendingApplications.map((app, i) => {
              const sc = statusConfig[app.status];
              const StatusIcon = sc.icon;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl ${sc.bg} flex items-center justify-center`}>
                        <StatusIcon className={`h-4 w-4 ${sc.color}`} />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-semibold text-foreground">{app.scheme}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{app.id} · {app.applicant} · {app.village}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 rounded-full ${sc.bg} ${sc.color} capitalize whitespace-nowrap`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-body">{app.statusText}</p>
                      <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">Current step: {app.currentStep} · Submitted: {app.submittedDate}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/applications")}
                      className="text-xs rounded-lg font-body shrink-0"
                    >
                      <Eye className="h-3 w-3 mr-1.5" /> View
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
