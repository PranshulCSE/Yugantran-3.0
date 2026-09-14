import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    department: { type: String, default: "SCSE", trim: true },
    image: { type: String, default: "" }, // URL or path
    linkedin: { type: String, default: "" },
    category: {
      type: String,
      enum: ["core", "subteam"],
      default: "core",
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Team", TeamSchema);
