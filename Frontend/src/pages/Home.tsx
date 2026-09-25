import { motion } from "motion/react";
import Hero from "../components/Hero";
import {
  WhyYugantran,
  AboutTeaser,
  FeaturedEvents,
  TimelinePreview,
  PrizePoolBanner,
  FinalCTA,
} from "../components/HomeSections";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      <Hero />
      <WhyYugantran />
      <AboutTeaser />
      <FeaturedEvents />
      <TimelinePreview />
      <PrizePoolBanner />
      <FinalCTA />
    </motion.div>
  );
}
