import { motion } from "motion/react";
import Register from "../components/Register";
import { Zap, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* 1. Header */}
      <section className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
        <div className="section-tag mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>SQUAD ENROLLMENT</span>
        </div>

        <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mb-4">
          Festival <span className="gradient-text">Registration</span>
        </h1>

        <p className="text-slate-300 text-lg font-body leading-relaxed">
          Select your track, complete the payment via UPI QR code, and upload the screenshot for
          immediate spot allocation.
        </p>
      </section>

      {/* 2. Registration Terminal Component */}
      <Register />
    </div>
  );
}
