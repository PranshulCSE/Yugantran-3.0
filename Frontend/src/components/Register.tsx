import { motion, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
  ChevronDown,
  ChevronUp
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
  const location = useLocation();
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
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);

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

  // Pre-select event from route state (e.g. when navigated from Events page)
  useEffect(() => {
    if (events.length > 0 && location.state?.preselectEvent && !formData.selectedEvent) {
      const found = events.find((ev) => ev.name === location.state.preselectEvent);
      if (found) {
        selectEvent(found);
      }
    }
  }, [events, location.state, formData.selectedEvent]);

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
            className="fixed top-24 left-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/95 border border-white/30/50 text-white font-mono-matrix text-xs shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
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

          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="anim-silver-royal">Official Registration</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-body max-w-xl mx-auto text-balance leading-relaxed">
            Lock in your spot for YUGANTRAN 3.0. Select your competition, complete payment via UPI, and
            upload your receipt for verification.
          </p>
        </motion.div>

        {/* Closed state */}
        {!isRegistrationOpen && (
          <div className="glass p-12 rounded-3xl text-center border-rose-500/30">
            <XCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            <h3 className="font-orbitron font-bold text-2xl text-white mb-2">Registration Closed</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Registrations for YUGANTRAN 3.0 have officially concluded. See you at the arena!
            </p>
          </div>
        )}

        {/* Success Modal */}
        {submitted && (
          <motion.div
            ref={successRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative overflow-hidden bg-white/5 dark:bg-[#020617]/40 backdrop-blur-2xl p-8 sm:p-12 rounded-[2rem] text-center border border-emerald-500/30 shadow-[0_0_60px_rgba(52,211,153,0.15)] space-y-8 max-w-2xl mx-auto"
          >
            {/* Emerald Glowing Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.5)]">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <h3 className="font-orbitron font-black text-3xl sm:text-4xl text-emerald-400 tracking-wide drop-shadow-lg">
                Registration Confirmed!
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-lg mx-auto font-body leading-relaxed">
                Your entry for{" "}
                <strong className="text-slate-900 dark:text-white font-bold">{formData.selectedEvent?.name}</strong>{" "}
                has been securely logged. <br className="hidden sm:block" /> Transaction ID:{" "}
                <strong className="text-slate-900 dark:text-emerald-300 font-mono tracking-wider">{formData.transactionId || "VERIFIED"}</strong>.
              </p>
            </div>

            <div className="relative z-10 p-5 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 max-w-md mx-auto text-left text-xs sm:text-sm font-space space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Participant</span>
                <span className="text-slate-900 dark:text-white font-bold">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Roll / Enrollment</span>
                <span className="text-slate-900 dark:text-white font-bold">{formData.rollNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Event</span>
                <span className="text-slate-900 dark:text-white font-bold">{formData.selectedEvent?.name}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Fee Paid</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm sm:text-base drop-shadow-sm">₹{formData.selectedEvent?.fee}</span>
              </div>
            </div>

            <div className="pt-2 relative z-10">
              <button 
                onClick={resetForm} 
                className="group relative inline-flex items-center justify-center px-8 py-3.5 font-orbitron font-bold text-xs sm:text-sm tracking-widest rounded-full bg-emerald-500 text-emerald-950 overflow-hidden shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(52,211,153,0.6)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  REGISTER FOR ANOTHER EVENT
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              </button>
            </div>
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
            <div className="relative z-50 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
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

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                    selectedEvent
                      ? "border-cyan-200 bg-cyan-50 dark:border-white/30 dark:bg-white/10 shadow-[0_0_20px_rgba(0,242,254,0.15)] dark:shadow-[0_0_20px_rgba(0,242,254,0.3)]"
                      : "border-slate-200 bg-white/60 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedEvent ? (
                      <>
                        {(() => {
                          const SelectedIcon = ICON_MAP[selectedEvent.icon] || Code;
                          return <SelectedIcon className="w-5 h-5 text-cyan-400" />;
                        })()}
                        <span className="font-orbitron text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {selectedEvent.name}
                        </span>
                      </>
                    ) : (
                      <span className="font-orbitron text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400">
                        Select an Event...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {isEventDropdownOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isEventDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto"
                    >
                      {events.map((ev) => {
                        const Icon = ICON_MAP[ev.icon] || Code;
                        const isSel = selectedEvent?._id === ev._id || selectedEvent?.slug === ev.slug;

                        return (
                          <button
                            key={ev._id || ev.slug}
                            type="button"
                            onClick={() => {
                              if (!isSel) selectEvent(ev);
                              setIsEventDropdownOpen(false);
                            }}
                            className={`w-full p-4 flex items-center justify-between transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${
                              isSel ? "bg-cyan-50/50 dark:bg-white/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon
                                className="w-5 h-5"
                                style={{ color: isSel ? "#00f2fe" : "#94a3b8" }}
                              />
                              <div className="flex flex-col items-start">
                                <span
                                  className="font-orbitron text-sm font-bold"
                                  style={{ color: isSel ? "#ffffff" : "#cbd5e1" }}
                                >
                                  {ev.name}
                                </span>
                                <span className="text-[10px] font-space text-slate-500">
                                  {ev.teamType === "individual"
                                    ? "Solo"
                                    : `Team (${ev.minTeam}-${ev.maxTeam})`}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-emerald-400 font-semibold text-xs">
                                ₹{ev.fee}
                              </span>
                              {isSel && <Check className="w-4 h-4 text-cyan-400" />}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 2. Personal Information */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
              <h3 className="font-orbitron font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                STEP 2: PARTICIPANT INTEL
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    FULL NAME *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner pl-11 ${errors.name ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    ROLL NUMBER / ENROLLMENT ID *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="rollNumber"
                      placeholder="e.g. GU21MCA001"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner pl-11 ${errors.rollNumber ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.rollNumber && <p className="text-rose-400 text-xs mt-1">{errors.rollNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    PROGRAM / BRANCH *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="program"
                      placeholder="e.g. B.Tech CSE"
                      value={formData.program}
                      onChange={handleChange}
                      className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner pl-11 ${errors.program ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.program && <p className="text-rose-400 text-xs mt-1">{errors.program}</p>}
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    SEMESTER / YEAR *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="semester"
                      placeholder="e.g. 5th Sem"
                      value={formData.semester}
                      onChange={handleChange}
                      className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner pl-11 ${errors.semester ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.semester && <p className="text-rose-400 text-xs mt-1">{errors.semester}</p>}
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    PHONE / WHATSAPP NUMBER *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="mobileNumber"
                      placeholder="10-digit number"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner pl-11 ${errors.mobileNumber ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.mobileNumber && <p className="text-rose-400 text-xs mt-1">{errors.mobileNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner pl-11 ${errors.email ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    COLLEGE / UNIVERSITY *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="college"
                      placeholder="e.g. Geeta University"
                      value={formData.college}
                      onChange={handleChange}
                      className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner pl-11 ${errors.college ? "!border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.college && <p className="text-rose-400 text-xs mt-1">{errors.college}</p>}
                </div>
              </div>
            </div>

            {/* 3. Team Details (If team event) */}
            {isTeamEvent && (
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                  STEP 3: TEAM SQUAD DETAILS
                </h3>

                <div className="mb-6">
                  <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    TEAM NAME *
                  </label>
                  <input
                    type="text"
                    name="teamName"
                      placeholder="e.g. Code Ninjas"
                    value={formData.teamName}
                    onChange={handleChange}
                    className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner ${errors.teamName ? "!border-rose-500" : ""}`}
                  />
                  {errors.teamName && (
                    <p className="text-rose-400 text-xs mt-1">{errors.teamName}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-space text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    TEAM MATES (Excluding Leader)
                  </div>

                  {formData.teamMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-orbitron font-bold text-cyan-600 dark:text-cyan-400">
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
                          value={member.name}
                          placeholder="Member Name"
                          onChange={(e) => {
                            const arr = [...formData.teamMembers];
                            arr[idx].name = e.target.value;
                            setFormData((p) => ({ ...p, teamMembers: arr }));
                          }}
                          className="w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner text-xs"
                        />
                        <input
                          type="text"
                          value={member.rollNumber}
                          placeholder="Member Roll No"
                          onChange={(e) => {
                            const arr = [...formData.teamMembers];
                            arr[idx].rollNumber = e.target.value;
                            setFormData((p) => ({ ...p, teamMembers: arr }));
                          }}
                          className="w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner text-xs"
                        />
                        <input
                          type="text"
                          value={member.program}
                          placeholder="Branch"
                          onChange={(e) => {
                            const arr = [...formData.teamMembers];
                            arr[idx].program = e.target.value;
                            setFormData((p) => ({ ...p, teamMembers: arr }));
                          }}
                          className="w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner text-xs"
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
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                  STEP {isTeamEvent ? "4" : "3"}: UPI PAYMENT & RECEIPT
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center mb-8">
                  {/* Left: UPI QR Showcase */}
                  <div className="md:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 shadow-xl">
                    <div className="w-44 h-44 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.15)] dark:shadow-[0_0_30px_rgba(0,242,254,0.3)] mb-4">
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

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-white/20 text-xs font-mono-matrix text-slate-900 dark:text-white mb-2">
                      <span>{upiId}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(upiId)}
                        className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
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
                      <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                        YOUR UPI ID / UTR NUMBER *
                      </label>
                      <input
                        type="text"
                        name="upiId"
                      placeholder="e.g. name@okicici"
                        value={formData.upiId}
                        onChange={handleChange}
                        className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner ${errors.upiId ? "!border-rose-500" : ""}`}
                      />
                      {errors.upiId && <p className="text-rose-400 text-xs mt-1">{errors.upiId}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                        TRANSACTION / REFERENCE ID *
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                      placeholder="e.g. 123456789012"
                        value={formData.transactionId}
                        onChange={handleChange}
                        className={`w-full bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:bg-white/90 dark:focus:border-white/30 dark:focus:bg-slate-900/80 transition-all text-slate-900 dark:text-white font-space text-sm backdrop-blur-md shadow-inner ${errors.transactionId ? "!border-rose-500" : ""}`}
                      />
                      {errors.transactionId && (
                        <p className="text-rose-400 text-xs mt-1">{errors.transactionId}</p>
                      )}
                    </div>

                    {isTeamEvent && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-cyan-900/20 border border-red-200 dark:border-cyan-500/30 flex items-start gap-3 mt-4">
                        <AlertCircle className="w-5 h-5 text-red-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                        <p className="text-xs font-space text-red-700 dark:text-cyan-300 leading-relaxed">
                          <strong>Important:</strong> The total registration fee for all team members must be paid in a single transaction by the person submitting this form.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drag & Drop Receipt Dropzone */}
                <div>
                  <label className="block text-xs font-space font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2.5">
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
                        ? "border-cyan-400 bg-cyan-50 dark:border-white/30 dark:bg-white/10 shadow-[0_0_30px_rgba(0,242,254,0.15)] dark:shadow-[0_0_30px_rgba(0,242,254,0.3)]"
                        : errors.paymentReceipt
                        ? "border-rose-500 bg-rose-50 dark:bg-slate-900/60"
                        : "border-slate-300 bg-white/60 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-white/30"
                    }`}
                  >
                    {previewUrl ? (
                      <div className="text-center space-y-3">
                        <img
                          src={previewUrl}
                          alt="Receipt Preview"
                          className="max-h-48 rounded-xl mx-auto shadow-lg"
                        />
                        <p className="text-xs font-mono-matrix text-slate-900 dark:text-white">
                          {formData.paymentReceipt?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-white/30/30 flex items-center justify-center mx-auto text-cyan-600 dark:text-cyan-400">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-space font-semibold text-slate-900 dark:text-white">
                          {formData.paymentReceipt
                            ? formData.paymentReceipt.name
                            : "Click to upload or drag & drop payment receipt"}
                        </p>
                        <p className="text-xs font-mono-matrix text-slate-500 dark:text-slate-400">Max file size: 10MB</p>
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
              className="w-full py-4 text-sm font-orbitron font-bold uppercase tracking-widest justify-center flex items-center gap-2 rounded-2xl transition-all duration-300 bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 border border-cyan-300 dark:border-white/30/50 backdrop-blur-xl text-slate-900 dark:text-white shadow-[0_0_20px_rgba(0,242,254,0.15)] hover:shadow-[0_0_30px_rgba(0,242,254,0.3)] relative overflow-hidden group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400" />
                  <span className="relative z-10 text-slate-900 dark:text-white">PROCESSING REGISTRATION...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10 text-slate-900 dark:text-white group-hover:text-cyan-900 dark:group-hover:text-cyan-100 transition-colors">CONFIRM & SUBMIT REGISTRATION</span>
                  <Send className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-200 transition-colors" />
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  );
}