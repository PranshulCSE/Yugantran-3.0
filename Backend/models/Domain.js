import mongoose from "mongoose";

const DomainSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "Cpu" }, // Lucide icon name
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true },
    color: { type: String, default: "#00f2fe" }, // hex accent color
    badge: { type: String, default: "TRACK" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Domain", DomainSchema);
