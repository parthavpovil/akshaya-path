import { createContext, useContext, useState, ReactNode } from "react";

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (value: boolean) => void;
}

const DemoContext = createContext<DemoContextType>({
  isDemoMode: true,
  toggleDemoMode: () => {},
  setDemoMode: () => {},
});

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(true);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode: () => setIsDemoMode((prev) => !prev),
        setDemoMode: setIsDemoMode,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoMode = () => useContext(DemoContext);
