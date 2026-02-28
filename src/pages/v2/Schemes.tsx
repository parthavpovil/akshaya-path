import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Sparkles, Loader2 } from "lucide-react";

const Schemes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="mesh-gradient" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-body">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Available <span className="text-gradient-saffron">Schemes</span>
          </h1>
          <p className="text-muted-foreground font-body">Fetching schemes from database...</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
          <button onClick={() => navigate("/apply")} className="w-full sm:w-auto glass-card rounded-2xl px-6 py-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200 group">
            <div className="h-10 w-10 rounded-xl gradient-saffron flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="font-display text-sm font-semibold text-foreground">Not sure which scheme fits you?</p>
              <p className="text-xs text-muted-foreground font-body">Chat with Akshaya Agent to discover the right scheme</p>
            </div>
            <Sparkles className="h-4 w-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass-card rounded-2xl p-16 text-center">
          <Loader2 className="h-8 w-8 text-muted-foreground/40 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Schemes will load from the backend once connected.</p>
          <p className="text-xs text-muted-foreground/60 font-mono mt-2">Switch to Demo mode to see sample data.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Schemes;
