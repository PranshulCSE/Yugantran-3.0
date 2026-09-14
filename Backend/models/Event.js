import mongoose from "mongoose";

const RoundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: [
        "ai",
        "cybersecurity",
        "coding",
        "swe",
        "iot",
        "innovation",
        "gaming",
        "interactive",
        "flagship",
      ],
    },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    icon: { type: String, default: "Code" }, // Lucide icon name
    gradient: { type: String, default: "from-green-500 to-emerald-600" },
    fee: { type: Number, required: true, min: 0 },
    prize: { type: String, required: true },
    teamType: { type: String, enum: ["individual", "team"], required: true },
    minTeam: { type: Number, default: 1 },
    maxTeam: { type: Number, default: 1 },
    rounds: [RoundSchema],
    whatsappLink: { type: String, default: "#" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
