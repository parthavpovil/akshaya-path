import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoToggle } from "@/components/DemoToggle";

const Applications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="mesh-gradient" />
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            <span className="text-gradient-saffron">Akshaya</span> <span className="text-foreground">Agent</span>
          </h2>
          <div className="flex items-center gap-4 text-sm font-body">
            <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
            <DemoToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-body">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            My <span className="text-gradient-saffron">Applications</span>
          </h1>
          <p className="text-muted-foreground font-body">Your applications will appear here once the backend is connected.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass-card rounded-2xl p-16 text-center">
          <Loader2 className="h-8 w-8 text-muted-foreground/40 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-body">No applications to display.</p>
          <p className="text-xs text-muted-foreground/60 font-mono mt-2">Switch to Demo mode to see sample data.</p>
        </motion.div>
      </main>
    </div>
  );
};

export default Applications;
