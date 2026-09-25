import { motion } from "motion/react";
import type { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pt-24 sm:pt-28 pb-16 sm:pb-20 w-full min-h-[calc(100vh-140px)] flex-1 relative z-10"
    >
      {children}
    </motion.div>
  );
}
