import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, default: "-" },
  rollNumber: { type: String, default: "-" },
  program: { type: String, default: "-" },
  semester: { type: String, default: "-" },
  college: { type: String, default: "-" },
});

const RegistrationSchema = new mongoose.Schema(
  {
    // Registrant (Leader) Info
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    program: { type: String, required: true, trim: true },
    semester: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true },
    college: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },

    // Event Info
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    eventName: { type: String, required: true },
    teamType: { type: String, enum: ["individual", "team"], required: true },
    teamName: { type: String, default: "" },
    teamMembers: [TeamMemberSchema],

    // Payment Info
    upiId: { type: String, required: true },
    transactionId: { type: String, required: true },
    paymentReceiptUrl: { type: String, default: "" }, // Google Drive link
    paymentReceiptFileId: { type: String, default: "" }, // Drive file ID

    // Links
    whatsappLink: { type: String, default: "#" },

    // Admin Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", RegistrationSchema);
