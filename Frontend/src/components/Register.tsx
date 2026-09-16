import { motion, AnimatePresence } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { publicApi } from "../lib/api";
import {
  User,
  Phone,
  Building2,
  Send,
  CheckCircle2,
  Loader2,
  Code,
  FolderOpen,
  Hash,
  Briefcase,
  BookOpen,
  IndianRupee,
  Check,
  Users,
  Mail,
  XCircle,
  Bot,
  Shield,
  Terminal,
  Bug,
  GitBranch,
  Search,
  Rocket,
  Cpu,
  Zap,
  Car,
  Trophy,
  Gamepad2,
  Swords,
  QrCode,
  Copy,
  Upload,
  AlertCircle,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Bot,
  Shield,
  Terminal,
  Bug,
  GitBranch,
  Search,
  Rocket,
  Cpu,
  Zap,
  Car,
  Trophy,
  Gamepad2,
  Swords,
  Code,
};

export default function Register() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const successRef = useRef<HTMLDivElement>(null);

  const [events, setEvents] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    program: "",
    semester: "",
    mobileNumber: "",
    college: "",
    email: "",
    selectedEvent: null as any,
    teamName: "",
    teamMembers: [{ name: "", rollNumber: "", program: "", semester: "", college: "" }] as any[],
    paymentReceipt: null as File | null,
    upiId: "",
    transactionId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    publicApi
      .getEvents()
      .then((r) => setEvents(r.data))
      .catch(() => {});
    publicApi
      .getSettings()
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  // Listen for event pre-selection from Events component
  useEffect(() => {
    const handler = (e: Event) => {
      const eventName = (e as CustomEvent).detail;
      const found = events.find((ev) => ev.name === eventName);
      if (found) selectEvent(found);
    };
    window.addEventListener("eventSelected", handler as EventListener);
    return () => window.removeEventListener("eventSelected", handler as EventListener);
  }, [events]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const selectEvent = (event: any) => {
    const isTeam = event.teamType === "team";
    const memberCount = isTeam ? Math.max(event.minTeam - 1, 0) : 0;
    setFormData((prev) => ({
      ...prev,
      selectedEvent: event,
      teamName: "",
      teamMembers: Array.from({ length: memberCount }, () => ({
        name: "",
        rollNumber: "",
        program: "",
        semester: "",
        college: "",
      })),
    }));
    showToast(`✓ ${event.name} selected`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFile = useCallback(
    (file: File | null) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (!file) {
        setFormData((p) => ({ ...p, paymentReceipt: null }));
        setPreviewUrl(null);
        return;
      }
      setFormData((p) => ({ ...p, paymentReceipt: file }));
      if (file.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(file));
      else setPreviewUrl(null);
    },
    [previewUrl]
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    showToast("UPI ID Copied to Clipboard!");
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Full name required.";
    if (!formData.rollNumber.trim()) errs.rollNumber = "Roll number required.";
    if (!formData.program.trim()) errs.program = "Program required.";
    if (!formData.semester.trim()) errs.semester = "Semester required.";
    if (!/^[0-9]{10}$/.test(formData.mobileNumber))
      errs.mobileNumber = "Enter valid 10-digit mobile.";
    if (!formData.college.trim()) errs.college = "College required.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Valid email required.";
    if (!formData.selectedEvent) errs.eventType = "Please select an event.";
    if (!formData.paymentReceipt) errs.paymentReceipt = "Payment receipt required.";
    if (!formData.upiId.trim()) errs.upiId = "UPI ID / UTR required.";
    if (!formData.transactionId.trim()) errs.transactionId = "Transaction ID required.";
    if (formData.selectedEvent?.teamType === "team") {
      if (!formData.teamName.trim()) errs.teamName = "Team name required.";
      const bad = formData.teamMembers.some(
        (m) => !m.name.trim() || !m.rollNumber.trim() || !m.program.trim()
      );
      if (bad) errs.teamMembers = "Fill all required team member fields.";
    }
    setErrors(errs);
    if (Object.keys(errs).length) showToast(Object.values(errs)[0]);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("rollNumber", formData.rollNumber);
      form.append("program", formData.program);
      form.append("semester", formData.semester);
      form.append("mobileNumber", formData.mobileNumber);
      form.append("college", formData.college);
      form.append("email", formData.email);
      form.append("eventId", formData.selectedEvent?._id || "");
      form.append("eventName", formData.selectedEvent?.name || "");
      form.append("teamType", formData.selectedEvent?.teamType || "individual");
      form.append("teamName", formData.teamName);
      form.append("teamMembers", JSON.stringify(formData.teamMembers));
      form.append("upiId", formData.upiId);
      form.append("transactionId", formData.transactionId);
      form.append("whatsappLink", formData.selectedEvent?.whatsappLink || "#");
      if (formData.paymentReceipt instanceof File) {
        const base = formData.teamName || formData.name;
        const ext = formData.paymentReceipt.name.match(/\.[a-zA-Z0-9]+$/)?.[0] || "";
        form.append(
          "paymentReceipt",
          formData.paymentReceipt,
          `${base.replace(/\s+/g, "_")}${ext}`
        );
      }
      await publicApi.register(form);
      setSubmitted(true);
      setTimeout(
        () => successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        100
      );
      setFormData({
        name: "",
        rollNumber: "",
        program: "",
        semester: "",
        mobileNumber: "",
        college: "",
        email: "",
        selectedEvent: null,
        teamName: "",
        teamMembers: [{ name: "", rollNumber: "", program: "", semester: "", college: "" }],
        paymentReceipt: null,
        upiId: "",
        transactionId: "",
      });
      setPreviewUrl(null);
      setErrors({});
    } catch {
      showToast("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isRegistrationOpen = settings?.isRegistrationOpen !== false;
  const selectedEvent = formData.selectedEvent;
  const isTeamEvent = selectedEvent?.teamType === "team";
  const upiId = settings?.upiId || "yugantran@upi";

  return (
    <section id="register" ref={ref} className="relative py-28 overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="section-tag mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>JOIN THE BATTLE</span>
          </div>

          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-4">
            Official <span className="gradient-text">Registration</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-body">
            Lock in your spot for YUGANTRAN 3.0. Select your event, complete payment via UPI, and
            upload your receipt for instant verification.
          </p>
        </motion.div>

        {/* Closed state */}
        {!isRegistrationOpen && (
          <div className="glass p-12 rounded-3xl text-center border-rose-500/30">
            <XCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            <h3 className="font-orbitron font-bold text-2xl text-white mb-2">
              Registration Closed
            </h3>
            <p className="text-slate-300">
              Registrations for YUGANTRAN 3.0 have officially concluded. See you at the arena!
            </p>
          </div>
        )}

        {/* Success Modal */}
        {submitted && (
          <motion.div
            ref={successRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 sm:p-12 rounded-3xl text-center mb-10 border-emerald-400/40 shadow-[0_0_50px_rgba(52,211,153,0.2)]"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <h3 className="font-orbitron font-black text-3xl text-white mb-3">
              Registration Received!
            </h3>

            <p className="text-slate-300 text-base max-w-lg mx-auto mb-6">
              Your details and payment receipt have been logged. A confirmation email has been
              dispatched to your inbox.
            </p>

            <button onClick={() => setSubmitted(false)} className="btn-primary text-xs py-3 px-8">
              REGISTER ANOTHER EVENT
            </button>
          </motion.div>
        )}

        {/* Form */}
        {isRegistrationOpen && !submitted && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* 1. Event Selector */}
            <div className="glass p-7 sm:p-8 rounded-3xl border-cyan-500/25">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron font-bold text-base text-cyan-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  STEP 1: SELECT YOUR COMPETITION
                </h3>
                {selectedEvent && (
                  <span className="text-xs font-orbitron font-bold text-amber-400">
                    FEE: ₹{selectedEvent.fee}
                  </span>
                )}
              </div>

              {errors.eventType && (
                <p className="text-rose-400 text-xs font-space mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {errors.eventType}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {events.map((ev) => {
                  const Icon = ICON_MAP[ev.icon] || Code;
                  const isSel = selectedEvent?._id === ev._id;

                  return (
                    <motion.button
                      key={ev._id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        isSel
                          ? setFormData((p) => ({ ...p, selectedEvent: null }))
                          : selectEvent(ev)
                      }
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        isSel
                          ? "border-cyan-400 bg-cyan-950/60 shadow-[0_0_20px_rgba(0,242,254,0.3)]"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <Icon
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: isSel ? "#00f2fe" : "#94a3b8" }}
                        />
                        <span
                          className="font-orbitron text-xs font-bold truncate"
                          style={{ color: isSel ? "#ffffff" : "#cbd5e1" }}
                        >
                          {ev.name}
                        </span>
                        {isSel && (
                          <Check className="w-4 h-4 text-cyan-400 ml-auto flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-space text-slate-400">
                        <span>₹{ev.fee}</span>
                        <span>
                          {ev.teamType === "individual"
                            ? "Solo"
                            : `Team (${ev.minTeam}-${ev.maxTeam})`}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2. Personal Information */}
            <div className="glass p-7 sm:p-8 rounded-3xl border-cyan-500/25">
              <h3 className="font-orbitron font-bold text-base text-cyan-300 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                STEP 2: PARTICIPANT INTEL
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    FULL NAME *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className={`admin-input pl-11 ${
                        errors.name ? "!border-rose-500/50" : ""
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    ROLL NUMBER / ENROLLMENT *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g. GU21MCA001"
                      className={`admin-input pl-11 ${
                        errors.rollNumber ? "!border-rose-500/50" : ""
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    PROGRAM / BRANCH *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech CSE / MCA"
                      className={`admin-input pl-11 ${
                        errors.program ? "!border-rose-500/50" : ""
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    SEMESTER / YEAR *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      placeholder="e.g. 5th Semester / 3rd Year"
                      className={`admin-input pl-11 ${
                        errors.semester ? "!border-rose-500/50" : ""
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    PHONE / WHATSAPP NUMBER *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={`admin-input pl-11 ${
                        errors.mobileNumber ? "!border-rose-500/50" : ""
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`admin-input pl-11 ${
                        errors.email ? "!border-rose-500/50" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    COLLEGE / UNIVERSITY *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. Geeta University, Panipat"
                      className={`admin-input pl-11 ${
                        errors.college ? "!border-rose-500/50" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Team Details (If team event selected) */}
            {isTeamEvent && (
              <div className="glass p-7 sm:p-8 rounded-3xl border-cyan-500/25">
                <h3 className="font-orbitron font-bold text-base text-cyan-300 mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  STEP 3: TEAM SQUAD DETAILS
                </h3>

                <div className="mb-6">
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    TEAM NAME *
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="e.g. CyberKnights"
                    className="admin-input"
                  />
                  {errors.teamName && (
                    <p className="text-rose-400 text-xs mt-1">{errors.teamName}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-space text-slate-400 uppercase tracking-wider">
                    TEAM MATES (Excluding Leader)
                  </div>

                  {formData.teamMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-orbitron font-bold text-cyan-400">
                          MEMBER 0{idx + 1}
                        </span>
                        {formData.teamMembers.length > selectedEvent.minTeam - 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                teamMembers: p.teamMembers.filter((_, j) => j !== idx),
                              }))
                            }
                            className="text-rose-400 hover:text-rose-300 text-xs"
                          >
                            Remove ×
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={member.name}
                          onChange={(e) => {
                            const arr = [...formData.teamMembers];
                            arr[idx].name = e.target.value;
                            setFormData((p) => ({ ...p, teamMembers: arr }));
                          }}
                          className="admin-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Roll Number"
                          value={member.rollNumber}
                          onChange={(e) => {
                            const arr = [...formData.teamMembers];
                            arr[idx].rollNumber = e.target.value;
                            setFormData((p) => ({ ...p, teamMembers: arr }));
                          }}
                          className="admin-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Program & Sem"
                          value={member.program}
                          onChange={(e) => {
                            const arr = [...formData.teamMembers];
                            arr[idx].program = e.target.value;
                            setFormData((p) => ({ ...p, teamMembers: arr }));
                          }}
                          className="admin-input text-xs"
                        />
                      </div>
                    </div>
                  ))}

                  {formData.teamMembers.length < selectedEvent.maxTeam - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          teamMembers: [
                            ...p.teamMembers,
                            { name: "", rollNumber: "", program: "", semester: "", college: "" },
                          ],
                        }))
                      }
                      className="btn-outline text-xs py-2 px-5"
                    >
                      <Users className="w-4 h-4" /> Add Team Member
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 4. Payment & Receipt Dropzone */}
            {selectedEvent && (
              <div className="glass p-7 sm:p-8 rounded-3xl border-cyan-500/25">
                <h3 className="font-orbitron font-bold text-base text-cyan-300 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  STEP {isTeamEvent ? "4" : "3"}: UPI PAYMENT & RECEIPT
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-8">
                  {/* Left: UPI QR Showcase */}
                  <div className="md:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-xl">
                    <div className="w-44 h-44 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.3)] mb-4">
                      {settings?.upiQrImageUrl ? (
                        <img
                          src={settings.upiQrImageUrl}
                          alt="UPI QR"
                          className="w-full h-full object-contain rounded-xl"
                        />
                      ) : (
                        <QrCode className="w-32 h-32 text-slate-800" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono-matrix text-cyan-300 mb-2">
                      <span>{upiId}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(upiId)}
                        className="hover:text-white transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-orbitron font-black text-2xl text-emerald-400">
                      ₹{selectedEvent.fee}
                    </div>
                  </div>

                  {/* Right: Payment Inputs */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        YOUR UPI ID / UTR NUMBER *
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        placeholder="e.g. yourname@okaxis or UTR123456"
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        TRANSACTION / REFERENCE ID *
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        placeholder="e.g. 428901238910"
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Drag & Drop Receipt Dropzone */}
                <div>
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                    PAYMENT SCREENSHOT / RECEIPT (PNG, JPG, PDF) *
                  </label>

                  <label
                    htmlFor="receiptUpload"
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragActive(false);
                      handleFile(e.dataTransfer.files[0] || null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragActive(true);
                    }}
                    onDragLeave={() => setIsDragActive(false)}
                    className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                      isDragActive
                        ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_30px_rgba(0,242,254,0.3)]"
                        : "border-slate-700 bg-slate-900/60 hover:border-cyan-500/50"
                    }`}
                  >
                    {previewUrl ? (
                      <div className="text-center space-y-3">
                        <img
                          src={previewUrl}
                          alt="Receipt Preview"
                          className="max-h-48 rounded-xl mx-auto shadow-lg"
                        />
                        <p className="text-xs font-mono-matrix text-cyan-300">
                          {formData.paymentReceipt?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-space font-semibold text-white">
                          {formData.paymentReceipt
                            ? formData.paymentReceipt.name
                            : "Click to upload or drag & drop payment receipt"}
                        </p>
                        <p className="text-xs font-mono-matrix text-slate-400">
                          Max file size: 10MB
                        </p>
                      </div>
                    )}
                  </label>

                  <input
                    id="receiptUpload"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] || null)}
                  />

                  {formData.paymentReceipt && (
                    <button
                      type="button"
                      onClick={() => handleFile(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-mono-matrix mt-2"
                    >
                      Remove receipt ×
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Final Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-5 text-base justify-center shadow-cyan-500/40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>TRANSMITTING REGISTRATION DATA...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>CONFIRM & SUBMIT REGISTRATION</span>
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </div>

      {/* Cyber Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-full bg-slate-950/95 border border-cyan-400/50 shadow-[0_0_30px_rgba(0,242,254,0.35)] backdrop-blur-xl text-cyan-300 font-space text-sm font-semibold flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}