import { motion } from "framer-motion";
import { FileText, Send, ClipboardList, TrendingUp, Users, CheckCircle, ArrowRight, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const stats = [
  { label: "Schemes Available", value: "24", icon: FileText, color: "text-primary" },
  { label: "Applications", value: "1,247", icon: Users, color: "text-secondary" },
  { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-success" },
];

const quickActions = [
  { label: "Browse Schemes", icon: ClipboardList, path: "/schemes" },
  { label: "Apply Now", icon: Send, path: "/apply" },
  { label: "My Applications", icon: FileText, path: "/applications" },
];

const recentActivity = [
  { text: "PM-KISAN application approved", time: "2 min ago", status: "approved" },
  { text: "Ayushman Bharat eligibility check", time: "15 min ago", status: "in_progress" },
  { text: "Scholarship documents verified", time: "1 hr ago", status: "approved" },
  { text: "Housing scheme application submitted", time: "3 hrs ago", status: "pending" },
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
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">demo_judge</span>
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
            Welcome back, <span className="text-gradient-saffron">Judge</span>
          </h1>
          <p className="text-muted-foreground font-body">Here's an overview of citizen service activity.</p>
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
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-body">{s.label}</span>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-secondary" /> Recent Activity
          </h2>
          <div className="glass-card rounded-2xl divide-y divide-border">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className={`h-4 w-4 ${
                    item.status === "approved" ? "text-success" :
                    item.status === "in_progress" ? "text-secondary" : "text-muted-foreground"
                  }`} />
                  <span className="text-sm text-foreground font-body">{item.text}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
