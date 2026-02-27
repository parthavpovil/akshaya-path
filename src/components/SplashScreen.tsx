import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={() => {}}
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={onComplete}
        >
          {/* Logo mark */}
          <motion.div className="relative flex items-center justify-center">
            {/* Outer ring */}
            <motion.div
              className="absolute h-16 w-16 rounded-full border-2 border-primary/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            {/* Inner dot */}
            <motion.div
              className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2, type: "spring", stiffness: 300 }}
            />
            {/* Pulse ring */}
            <motion.div
              className="absolute h-16 w-16 rounded-full border border-primary/20"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            className="flex items-baseline gap-1.5 font-display text-2xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span className="text-gradient-saffron">Akshaya</span>
            <span className="text-foreground">Agent</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
