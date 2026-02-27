import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Landing from "./pages/Landing";
import DemoLogin from "./pages/DemoLogin";
import Dashboard from "./pages/Dashboard";
import Schemes from "./pages/Schemes";
import PanchayatDashboard from "./pages/PanchayatDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen
              key="splash"
              onComplete={() => setTimeout(() => setShowSplash(false), 600)}
            />
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/demo-login" element={<DemoLogin />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/schemes" element={<Schemes />} />
                  <Route path="/panchayat" element={<PanchayatDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
