import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, Users, FileCheck, AlertTriangle, TrendingUp, ArrowLeft, ClipboardList, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoToggle } from "@/components/DemoToggle";

const stats = [
  { label: "Total Applications", value: "342", icon: ClipboardList, color: "text-primary" },
  { label: "Approved", value: "289", icon: FileCheck, color: "text-success" },
  { label: "Pending Review", value: "38", icon: AlertTriangle, color: "text-primary" },
  { label: "Beneficiaries", value: "1,024", icon: Users, color: "text-secondary" },
];

const recentApplications = [
  { citizen: "Ramesh Kumar", scheme: "PM-KISAN", status: "approved", time: "10 min ago" },
  { citizen: "Lakshmi Sundari", scheme: "Ujjwala Yojana", status: "pending", time: "25 min ago" },
  { citizen: "Suresh Mohan", scheme: "PM Awas Yojana", status: "in_progress", time: "1 hr ago" },
  { citizen: "Anita Devi", scheme: "Ayushman Bharat", status: "approved", time: "2 hrs ago" },
  { citizen: "Venkat Rao", scheme: "SC/ST Scholarship", status: "rejected", time: "3 hrs ago" },
  { citizen: "Priya Kumari", scheme: "MUDRA Loan", status: "approved", time: "4 hrs ago" },
  { citizen: "Arvind Singh", scheme: "Jan Dhan Yojana", status: "approved", time: "5 hrs ago" },
  { citizen: "Meena Bai", scheme: "MGNREGA", status: "in_progress", time: "6 hrs ago" },
];

const statusBadge: Record<string, string> = {
  approved: "bg-success/10 text-success",
  pending: "bg-primary/10 text-primary",
  in_progress: "bg-secondary/10 text-secondary",
  rejected: "bg-destructive/10 text-destructive",
};

const PanchayatDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
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
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            <Building2 className="inline h-8 w-8 mr-2 text-success" />
            Panchayat <span className="text-gradient-saffron">Dashboard</span>
          </h1>
          <p className="text-muted-foreground font-body">Overview of scheme applications in your jurisdiction.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-body">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-3 mb-10"
        >
          <Button
            onClick={() => navigate("/schemes")}
            className="gradient-saffron text-primary-foreground font-display font-semibold rounded-xl hover:opacity-90"
          >
            <Send className="mr-2 h-4 w-4" /> New Application
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/schemes")}
            className="border-border text-foreground font-display rounded-xl hover:bg-muted/50"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> View Reports
          </Button>
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Recent Applications</h2>
          <div className="glass-card rounded-2xl divide-y divide-border">
            {recentApplications.map((app, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground font-body">{app.citizen}</p>
                    <p className="text-xs text-muted-foreground font-body">{app.scheme}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono px-2 py-1 rounded-md capitalize ${statusBadge[app.status] ?? "bg-muted text-muted-foreground"}`}>
                    {app.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono hidden sm:block">{app.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PanchayatDashboard;
