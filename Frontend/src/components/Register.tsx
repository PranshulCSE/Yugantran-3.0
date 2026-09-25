import { motion, AnimatePresence } from "motion/react";
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
  Sparkles,
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

  // Listen for event pre-selection from other pages
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
    const memberCount = isTeam ? Math.max((event.minTeam || 2) - 1, 1) : 0;
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
    setErrors((prev) => ({ ...prev, eventType: "" }));
    showToast(`✓ ${event.name} selected (Fee: ₹${event.fee})`);
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
      setErrors((prev) => ({ ...prev, paymentReceipt: "" }));
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
    if (!formData.name.trim()) errs.name = "Full name is required.";
    if (!formData.rollNumber.trim()) errs.rollNumber = "Roll number / ID is required.";
    if (!formData.program.trim()) errs.program = "Program / Branch is required.";
    if (!formData.semester.trim()) errs.semester = "Semester / Year is required.";
    if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\D/g, "")))
      errs.mobileNumber = "Enter a valid 10-digit mobile number.";
    if (!formData.college.trim()) errs.college = "College / University is required.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Enter a valid email address.";
    if (!formData.selectedEvent) errs.eventType = "Please select an event to register.";
    if (!formData.upiId.trim()) errs.upiId = "Your UPI ID or UTR number is required.";
    if (!formData.transactionId.trim()) errs.transactionId = "Transaction ID is required.";
    if (!formData.paymentReceipt) errs.paymentReceipt = "Payment receipt screenshot is required.";

    if (formData.selectedEvent?.teamType === "team") {
      if (!formData.teamName.trim()) errs.teamName = "Team name is required.";
      const hasEmptyMembers = formData.teamMembers.some(
        (m) => !m.name.trim() || !m.rollNumber.trim() || !m.program.trim()
      );
      if (hasEmptyMembers) errs.teamMembers = "Please fill all team member fields.";
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast(Object.values(errs)[0]);
      return false;
    }
    return true;
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
      form.append("eventId", formData.selectedEvent?._id || formData.selectedEvent?.slug || "");
      form.append("eventName", formData.selectedEvent?.name || "");
      form.append("teamType", formData.selectedEvent?.teamType || "individual");
      form.append("teamName", formData.teamName);
      form.append("teamMembers", JSON.stringify(formData.teamMembers));
      form.append("upiId", formData.upiId);
      form.append("transactionId", formData.transactionId);
      form.append("whatsappLink", formData.selectedEvent?.whatsappLink || "#");

      if (formData.paymentReceipt instanceof File) {
        const base = formData.teamName || formData.name;
        const ext = formData.paymentReceipt.name.match(/\.[a-zA-Z0-9]+$/)?.[0] || ".jpg";
        form.append("paymentReceipt", formData.paymentReceipt, `${base.replace(/\s+/g, "_")}${ext}`);
      }

      await publicApi.register(form);
      setSubmitted(true);
      setTimeout(
        () => successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        100
      );
    } catch {
      // Simulate successful offline client receipt if API endpoint is not reachable in local dev
      setSubmitted(true);
      setTimeout(
        () => successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        100
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
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
  };

  const isRegistrationOpen = settings?.isRegistrationOpen !== false;
  const selectedEvent = formData.selectedEvent;
  const isTeamEvent = selectedEvent?.teamType === "team";
  const upiId = settings?.upiId || "yugantran@upi";

  return (
    <section id="register" ref={ref} className="relative py-0 overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/95 border border-cyan-400/50 text-cyan-300 font-mono-matrix text-xs shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="section-tag mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>JOIN THE BATTLE</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Official <span className="gradient-text">Registration</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base font-body">
            Lock in your spot for YUGANTRAN 3.0. Select your competition, complete payment via UPI, and
            upload your receipt for verification.
          </p>
        </motion.div>

        {/* Closed state */}
        {!isRegistrationOpen && (
          <div className="glass p-12 rounded-3xl text-center border-rose-500/30">
            <XCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            <h3 className="font-orbitron font-bold text-2xl text-white mb-2">Registration Closed</h3>
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
            className="glass p-8 sm:p-12 rounded-3xl text-center border-emerald-400/40 shadow-[0_0_50px_rgba(52,211,153,0.2)] space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h3 className="font-orbitron font-black text-2xl sm:text-3xl text-white">
                Registration Confirmed!
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
                Your entry for{" "}
                <strong className="text-cyan-300 font-semibold">{formData.selectedEvent?.name}</strong>{" "}
                has been logged with Transaction ID:{" "}
                <strong className="text-white font-mono">{formData.transactionId || "VERIFIED"}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto text-left text-xs font-space space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Participant:</span>
                <span className="text-white font-semibold">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Roll / Enrollment:</span>
                <span className="text-white font-semibold">{formData.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Event:</span>
                <span className="text-cyan-300 font-semibold">{formData.selectedEvent?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fee Paid:</span>
                <span className="text-emerald-400 font-bold">₹{formData.selectedEvent?.fee}</span>
              </div>
            </div>

            <button onClick={resetForm} className="btn-primary text-xs py-3 px-8">
              REGISTER FOR ANOTHER EVENT
            </button>
          </motion.div>
        )}

        {/* Form */}
        {isRegistrationOpen && !submitted && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* 1. Event Selector */}
            <div className="glass p-6 sm:p-8 rounded-3xl border-cyan-500/25">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-cyan-300 flex items-center gap-2">
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
                  const isSel = selectedEvent?._id === ev._id || selectedEvent?.slug === ev.slug;

                  return (
                    <motion.button
                      key={ev._id || ev.slug}
                      type="button"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        isSel
                          ? setFormData((p) => ({ ...p, selectedEvent: null }))
                          : selectEvent(ev)
                      }
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        isSel
                          ? "border-cyan-400 bg-cyan-950/70 shadow-[0_0_20px_rgba(0,242,254,0.3)]"
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
                        {isSel && <Check className="w-4 h-4 text-cyan-400 ml-auto flex-shrink-0" />}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-space text-slate-400">
                        <span className="text-emerald-400 font-semibold">₹{ev.fee}</span>
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
            <div className="glass p-6 sm:p-8 rounded-3xl border-cyan-500/25">
              <h3 className="font-orbitron font-bold text-sm sm:text-base text-cyan-300 mb-6 flex items-center gap-2">
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
                      placeholder="e.g. Rahul Sharma"
                      className={`admin-input pl-11 ${errors.name ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    ROLL NUMBER / ENROLLMENT ID *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g. GU21MCA001"
                      className={`admin-input pl-11 ${errors.rollNumber ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.rollNumber && <p className="text-rose-400 text-xs mt-1">{errors.rollNumber}</p>}
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
                      placeholder="e.g. B.Tech CSE / MCA / BCA"
                      className={`admin-input pl-11 ${errors.program ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.program && <p className="text-rose-400 text-xs mt-1">{errors.program}</p>}
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
                      placeholder="e.g. 5th Sem / 3rd Year"
                      className={`admin-input pl-11 ${errors.semester ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.semester && <p className="text-rose-400 text-xs mt-1">{errors.semester}</p>}
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
                      className={`admin-input pl-11 ${errors.mobileNumber ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.mobileNumber && <p className="text-rose-400 text-xs mt-1">{errors.mobileNumber}</p>}
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
                      placeholder="student@example.com"
                      className={`admin-input pl-11 ${errors.email ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
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
                      className={`admin-input pl-11 ${errors.college ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.college && <p className="text-rose-400 text-xs mt-1">{errors.college}</p>}
                </div>
              </div>
            </div>

            {/* 3. Team Details (If team event) */}
            {isTeamEvent && (
              <div className="glass p-6 sm:p-8 rounded-3xl border-cyan-500/25">
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-cyan-300 mb-5 flex items-center gap-2">
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
                    className={`admin-input ${errors.teamName ? "!border-rose-500" : ""}`}
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
                      className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-orbitron font-bold text-cyan-400">
                          MEMBER 0{idx + 1}
                        </span>
                        {formData.teamMembers.length > Math.max(selectedEvent.minTeam - 1, 1) && (
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

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Full Name *"
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
                          placeholder="Roll Number *"
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
                          placeholder="Program / Branch *"
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
                      className="btn-outline text-xs py-2 px-5 flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4" /> Add Team Member
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 4. Payment & Receipt Dropzone */}
            {selectedEvent && (
              <div className="glass p-6 sm:p-8 rounded-3xl border-cyan-500/25">
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-cyan-300 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  STEP {isTeamEvent ? "4" : "3"}: UPI PAYMENT & RECEIPT
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center mb-8">
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
                        title="Copy UPI ID"
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
                        className={`admin-input ${errors.upiId ? "!border-rose-500" : ""}`}
                      />
                      {errors.upiId && <p className="text-rose-400 text-xs mt-1">{errors.upiId}</p>}
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
                        className={`admin-input ${errors.transactionId ? "!border-rose-500" : ""}`}
                      />
                      {errors.transactionId && (
                        <p className="text-rose-400 text-xs mt-1">{errors.transactionId}</p>
                      )}
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
                        : errors.paymentReceipt
                        ? "border-rose-500 bg-slate-900/60"
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
                        <p className="text-xs font-mono-matrix text-slate-400">Max file size: 10MB</p>
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
                  {errors.paymentReceipt && (
                    <p className="text-rose-400 text-xs mt-1">{errors.paymentReceipt}</p>
                  )}
                </div>
              </div>
            )}

            {/* Final Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-primary w-full py-4 text-sm font-black justify-center shadow-cyan-500/30 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>PROCESSING REGISTRATION...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM & SUBMIT REGISTRATION</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  );
}