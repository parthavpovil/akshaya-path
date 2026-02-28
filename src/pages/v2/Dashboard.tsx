import { motion } from "framer-motion";
import { FileText, Send, ClipboardList, TrendingUp, Users, ArrowRight, Activity, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoToggle } from "@/components/DemoToggle";

const quickActions = [
  { label: "Browse Schemes", icon: ClipboardList, path: "/schemes" },
  { label: "Chat with Agent", icon: Send, path: "/apply" },
  { label: "My Applications", icon: FileText, path: "/applications" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            <span className="text-gradient-saffron">Akshaya</span> <span className="text-foreground">Agent</span>
          </h2>
          <div className="flex items-center gap-4 text-sm font-body">
            <button onClick={() => navigate("/schemes")} className="text-muted-foreground hover:text-foreground transition-colors">Schemes</button>
            <button onClick={() => navigate("/applications")} className="text-muted-foreground hover:text-foreground transition-colors">Applications</button>
            <DemoToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome to <span className="text-gradient-saffron">Akshaya Agent</span>
          </h1>
          <p className="text-muted-foreground font-body">Connect your backend to see live data here.</p>
        </motion.div>

        {/* Stats placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {["Schemes Available", "My Applications", "Success Rate"].map((label, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }} className="glass-card rounded-2xl p-6">
              <span className="text-sm text-muted-foreground font-body">{label}</span>
              <div className="flex items-center gap-2 mt-3">
                <Loader2 className="h-4 w-4 text-muted-foreground/40 animate-spin" />
                <span className="text-sm text-muted-foreground/50 font-mono">Awaiting backend</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mb-10">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((a) => (
              <Button key={a.label} variant="outline" onClick={() => navigate(a.path)} className="h-auto py-5 rounded-xl border-border hover:border-primary/30 hover:bg-primary/5 justify-start gap-3 font-body text-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{a.label}</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Activity placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-secondary" /> Recent Activity
          </h2>
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-muted-foreground font-body">No activity yet. Connect your backend to see real-time updates.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
