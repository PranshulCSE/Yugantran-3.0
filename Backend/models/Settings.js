import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    festName: { type: String, default: "YUGANTRAN 3.0" },
    theme: { type: String, default: "Innovate. Build. Compete. Transform." },
    eventDateStart: { type: Date, default: new Date("2026-10-27T09:00:00+05:30") },
    eventDateEnd: { type: Date, default: new Date("2026-10-28T17:00:00+05:30") },
    registrationDeadline: { type: Date, default: new Date("2026-10-25T23:59:00+05:30") },
    isRegistrationOpen: { type: Boolean, default: true },
    venue: { type: String, default: "Geeta University, Panipat, Haryana" },
    totalPrizePool: { type: String, default: "₹73,000+" },
    upiId: { type: String, default: "" },
    upiQrImageUrl: { type: String, default: "" },
    contactEmail: { type: String, default: "yugantran@geetauniversity.edu.in" },
    contactPhone: { type: [String], default: ["+91 92110 67540", "+91 90537 09750"] },
    instagram: { type: String, default: "https://www.instagram.com/geetauniversitypanipat/" },
    linkedin: { type: String, default: "https://www.linkedin.com/school/geeta-university-official/" },
    brochureUrl: { type: String, default: "/docs/eventBrochure.pdf" },
    ruleBookUrl: { type: String, default: "/docs/ruleBook.pdf" },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", SettingsSchema);
