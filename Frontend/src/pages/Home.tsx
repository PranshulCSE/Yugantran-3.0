import { motion } from "motion/react";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Hero />
    </motion.div>
  );
}
