import { useDemoMode } from "@/contexts/DemoContext";
import { FlaskConical, Globe } from "lucide-react";

export const DemoToggle = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <button
      onClick={toggleDemoMode}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all duration-200"
      style={{
        borderColor: isDemoMode ? "hsl(var(--secondary))" : "hsl(var(--primary))",
        background: isDemoMode ? "hsl(var(--secondary) / 0.1)" : "hsl(var(--primary) / 0.1)",
        color: isDemoMode ? "hsl(var(--secondary))" : "hsl(var(--primary))",
      }}
      title={isDemoMode ? "Switch to Live mode (v2)" : "Switch to Demo mode (v1)"}
    >
      {isDemoMode ? (
        <>
          <FlaskConical className="h-3.5 w-3.5" />
          Demo (v1)
        </>
      ) : (
        <>
          <Globe className="h-3.5 w-3.5" />
          Live (v2)
        </>
      )}
    </button>
  );
};
