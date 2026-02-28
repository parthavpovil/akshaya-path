import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider, useDemoMode } from "@/contexts/DemoContext";
import SplashScreen from "./components/SplashScreen";
import NotFound from "./pages/NotFound";

// v1 — demo pages (static/dummy content)
import V1Landing from "./pages/v1/Landing";
import V1DemoLogin from "./pages/v1/DemoLogin";
import V1Dashboard from "./pages/v1/Dashboard";
import V1Schemes from "./pages/v1/Schemes";
import V1ApplyChat from "./pages/v1/ApplyChat";
import V1Applications from "./pages/v1/Applications";
import V1PanchayatDashboard from "./pages/v1/PanchayatDashboard";

// v2 — real pages (backend-ready skeletons)
import V2Landing from "./pages/v2/Landing";
import V2DemoLogin from "./pages/v2/DemoLogin";
import V2Dashboard from "./pages/v2/Dashboard";
import V2Schemes from "./pages/v2/Schemes";
import V2ApplyChat from "./pages/v2/ApplyChat";
import V2Applications from "./pages/v2/Applications";
import V2PanchayatDashboard from "./pages/v2/PanchayatDashboard";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isDemoMode } = useDemoMode();

  const Landing = isDemoMode ? V1Landing : V2Landing;
  const DemoLogin = isDemoMode ? V1DemoLogin : V2DemoLogin;
  const Dashboard = isDemoMode ? V1Dashboard : V2Dashboard;
  const Schemes = isDemoMode ? V1Schemes : V2Schemes;
  const ApplyChat = isDemoMode ? V1ApplyChat : V2ApplyChat;
  const Applications = isDemoMode ? V1Applications : V2Applications;
  const PanchayatDashboard = isDemoMode ? V1PanchayatDashboard : V2PanchayatDashboard;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/demo-login" element={<DemoLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/schemes" element={<Schemes />} />
      <Route path="/apply" element={<ApplyChat />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/panchayat" element={<PanchayatDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DemoProvider>
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
                  <AppRoutes />
                </BrowserRouter>
              </motion.div>
            )}
          </AnimatePresence>
        </DemoProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
