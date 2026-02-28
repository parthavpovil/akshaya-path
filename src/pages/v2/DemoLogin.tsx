import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const DemoLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({ title: "Error", description: "Please enter username and password.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // TODO: Replace with real authentication call
    toast({ title: "Backend not connected", description: "Authentication requires backend integration. Switch to Demo mode to see the flow.", variant: "destructive" });
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="mesh-gradient" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 w-full max-w-md mx-6">
        <div className="glass rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-2">
              <span className="text-gradient-saffron">Akshaya</span> <span className="text-foreground">Agent</span>
            </h1>
            <p className="text-sm text-muted-foreground font-body">Admin Login</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2"><User className="h-4 w-4" /> Username</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-muted/50 border-border font-mono text-foreground h-12 rounded-xl" placeholder="Enter username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground font-body flex items-center gap-2"><Lock className="h-4 w-4" /> Password</label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="bg-muted/50 border-border font-mono text-foreground h-12 rounded-xl" placeholder="Enter password" />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl gradient-saffron text-primary-foreground font-display font-semibold text-base">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-6 font-body">
            Switch to <strong>Demo mode</strong> for a walkthrough ✨
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DemoLogin;
