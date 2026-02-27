import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Subtle ambient glow */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(38 92% 50% / 0.08) 0%, transparent 70%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2.5, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <motion.div className="flex flex-col items-center gap-6 relative">
          {/* Minimal geometric logo mark */}
          <div className="relative h-14 w-14 flex items-center justify-center">
            {/* Rotating outer square */}
            <motion.div
              className="absolute inset-0 rounded-xl border border-primary/40"
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Inner "A" shape using two converging lines */}
            <svg viewBox="0 0 40 40" className="h-8 w-8 relative z-10">
              <motion.path
                d="M20 8 L10 32"
                stroke="hsl(38 92% 50%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              />
              <motion.path
                d="M20 8 L30 32"
                stroke="hsl(38 92% 50%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              />
              <motion.path
                d="M14 23 L26 23"
                stroke="hsl(38 92% 50%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
              />
            </svg>
          </div>

          {/* Wordmark */}
          <motion.div
            className="flex items-baseline gap-2 font-display tracking-tight"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="text-gradient-saffron text-xl font-bold">Akshaya</span>
            <span className="text-foreground/70 text-xl font-medium">Agent</span>
          </motion.div>

          {/* Thin loading line */}
          <motion.div
            className="w-12 h-[1.5px] rounded-full bg-primary/20 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 0.6,
                delay: 0.7,
                ease: "easeInOut",
              }}
              onAnimationComplete={onComplete}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
