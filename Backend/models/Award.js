import mongoose from "mongoose";

const AwardSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "Trophy" }, // Lucide icon name
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    desc: { type: String, required: true },
    color: { type: String, default: "#00f2fe" }, // hex accent color
    prize: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Award", AwardSchema);
