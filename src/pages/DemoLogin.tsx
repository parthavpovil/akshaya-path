import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const DEMO_USERNAME = "demo_judge";
const DEMO_PASSWORD = "••••••••";
const TYPE_SPEED = 45;

const DemoLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phase, setPhase] = useState<"idle" | "typing-user" | "typing-pass" | "ready" | "logging-in" | "done">("idle");
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase("typing-user"), 400);
    return () => clearTimeout(t);
  }, []);

  // Typewriter for username
  useEffect(() => {
    if (phase !== "typing-user") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setUsername(DEMO_USERNAME.slice(0, i));
      if (i >= DEMO_USERNAME.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("typing-pass"), 200);
      }
    }, TYPE_SPEED);
    return () => clearInterval(interval);
  }, [phase]);

  // Typewriter for password
  useEffect(() => {
    if (phase !== "typing-pass") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setPassword(DEMO_PASSWORD.slice(0, i));
      if (i >= DEMO_PASSWORD.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("ready"), 250);
      }
    }, TYPE_SPEED);
    return () => clearInterval(interval);
  }, [phase]);

  // Auto-click login
  useEffect(() => {
    if (phase !== "ready") return;
    const t = setTimeout(() => {
      setPhase("logging-in");
      setTimeout(() => {
        toast({
          title: "Login Successful",
          description: "Welcome back, Judge! Redirecting to dashboard...",
        });
        setPhase("done");
        setTimeout(() => navigate("/dashboard"), 600);
      }, 500);
    }, 350);
    return () => clearTimeout(t);
  }, [phase, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="mesh-gradient" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-6"
      >
        <div className="glass rounded-2xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-2">
              <span className="text-gradient-saffron">Akshaya</span>{" "}
              <span className="text-foreground">Agent</span>
            </h1>
            <p className="text-sm text-muted-foreground font-body">Demo Login</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2">
                <User className="h-4 w-4" /> Username
              </label>
              <Input
                value={username}
                readOnly
                className="bg-muted/50 border-border font-mono text-foreground h-12 rounded-xl focus-visible:ring-secondary"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2">
                <Lock className="h-4 w-4" /> Password
              </label>
              <Input
                value={password}
                readOnly
                type="text"
                className="bg-muted/50 border-border font-mono text-foreground h-12 rounded-xl focus-visible:ring-secondary"
                placeholder="Enter password"
              />
            </div>

            <Button
              ref={btnRef}
              disabled={phase === "logging-in" || phase === "done"}
              className={`w-full h-12 rounded-xl gradient-saffron text-primary-foreground font-display font-semibold text-base transition-all ${
                phase === "ready" ? "animate-glow-pulse" : ""
              }`}
            >
              {phase === "logging-in" || phase === "done" ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </div>

          {/* Footer hint */}
          <p className="text-xs text-muted-foreground text-center mt-6 font-body">
            This is an automated demo — sit back and watch ✨
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DemoLogin;
