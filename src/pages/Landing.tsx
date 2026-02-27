import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Eye, Shield, Users, Building2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  {
    icon: Shield,
    title: "AI Document Check",
    description: "Automatic verification of all required documents in seconds.",
  },
  {
    icon: Eye,
    title: "Live Progress",
    description: "Watch every step of your application in real-time.",
  },
  {
    icon: Zap,
    title: "Instant Decisions",
    description: "Agentic AI eligibility engine delivers results immediately.",
  },
];

const flows = [
  {
    icon: Users,
    title: "Public",
    description: "Browse government schemes, check eligibility, and apply online.",
    cta: "Browse Schemes",
    path: "/schemes",
    accent: "from-secondary to-secondary/70",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    icon: UserCog,
    title: "Admin",
    description: "Administrative demo with automated login for judges and evaluators.",
    cta: "Go to Demo",
    path: "/demo-login",
    accent: "from-primary to-primary/70",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Building2,
    title: "Panchayat",
    description: "Local governance dashboard for panchayat-level scheme management.",
    cta: "Open Dashboard",
    path: "/panchayat",
    accent: "from-success to-success/70",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="mesh-gradient" />

      {/* Theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-3xl mx-auto">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary font-body"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Agentic AI · Instant · Transparent
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-gradient-saffron">Akshaya</span>{" "}
          <span className="text-foreground">Agent</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-14 font-body"
        >
          Apply for government schemes in seconds. Our Agentic AI handles the rest — no paperwork, no waiting.
        </motion.p>

        {/* Three flow cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl"
        >
          {flows.map((flow, i) => (
            <motion.div
              key={flow.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.12 }}
              className="glass-card rounded-2xl p-6 flex flex-col items-center text-center group cursor-pointer hover:border-primary/20 transition-all duration-300"
              onClick={() => navigate(flow.path)}
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${flow.iconBg}`}>
                <flow.icon className={`h-7 w-7 ${flow.iconColor}`} />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{flow.title}</h3>
              <p className="text-sm text-muted-foreground font-body mb-5 leading-relaxed">{flow.description}</p>
              <Button
                size="sm"
                className={`mt-auto bg-gradient-to-r ${flow.accent} text-primary-foreground font-display font-semibold rounded-lg hover:opacity-90 transition-opacity w-full`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(flow.path);
                }}
              >
                {flow.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Feature strip */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.3 }}
        className="relative z-10 mt-20 w-full max-w-4xl mx-auto px-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + i * 0.15 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
