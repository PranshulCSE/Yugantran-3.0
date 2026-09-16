import { motion, AnimatePresence } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { publicApi } from "../lib/api";
import {
  User, Phone, Building2, Send, CheckCircle, Loader2,
  Code, FolderOpen, Hash, Briefcase, BookOpen, IndianRupee,
  Check, Users, Mail, XCircle, Bot, Shield, Terminal, Bug,
  GitBranch, Search, Rocket, Cpu, Zap, Car, Trophy, Gamepad2, Swords,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Bot, Shield, Terminal, Bug, GitBranch, Search, Rocket, Cpu, Zap,
  Car, Trophy, Gamepad2, Swords, Code,
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
    publicApi.getEvents().then((r) => setEvents(r.data)).catch(() => {});
    publicApi.getSettings().then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  // Listen for event selection from Events section
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
        name: "", rollNumber: "", program: "", semester: "", college: "",
      })),
    }));
    showToast(`✓ ${event.name} selected`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFile = useCallback((file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!file) { setFormData((p) => ({ ...p, paymentReceipt: null })); setPreviewUrl(null); return; }
    setFormData((p) => ({ ...p, paymentReceipt: file }));
    if (file.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  }, [previewUrl]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Full name required.";
    if (!formData.rollNumber.trim()) errs.rollNumber = "Roll number required.";
    if (!formData.program.trim()) errs.program = "Program required.";
    if (!formData.semester.trim()) errs.semester = "Semester required.";
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) errs.mobileNumber = "Enter valid 10-digit mobile.";
    if (!formData.college.trim()) errs.college = "College required.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Valid email required.";
    if (!formData.selectedEvent) errs.eventType = "Please select an event.";
    if (!formData.paymentReceipt) errs.paymentReceipt = "Payment receipt required.";
    if (!formData.upiId.trim()) errs.upiId = "UPI ID / UTR required.";
    if (!formData.transactionId.trim()) errs.transactionId = "Transaction ID required.";
    if (formData.selectedEvent?.teamType === "team") {
      if (!formData.teamName.trim()) errs.teamName = "Team name required.";
      const bad = formData.teamMembers.some((m) => !m.name.trim() || !m.rollNumber.trim() || !m.program.trim());
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
        form.append("paymentReceipt", formData.paymentReceipt, `${base.replace(/\s+/g, "_")}${ext}`);
      }
      await publicApi.register(form);
      setSubmitted(true);
      setTimeout(() => successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
      setFormData({ name: "", rollNumber: "", program: "", semester: "", mobileNumber: "", college: "", email: "", selectedEvent: null, teamName: "", teamMembers: [{ name: "", rollNumber: "", program: "", semester: "", college: "" }], paymentReceipt: null, upiId: "", transactionId: "" });
      setPreviewUrl(null);
      setErrors({});
      setTimeout(() => setSubmitted(false), 15000);
    } catch {
      showToast("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isRegistrationOpen = settings?.isRegistrationOpen !== false;
  const selectedEvent = formData.selectedEvent;
  const isTeamEvent = selectedEvent?.teamType === "team";

  const Field = ({ label, name, placeholder, type = "text", icon: Icon }: any) => (
    <div>
      <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(0,255,65,0.35)]" />}
        <input
          type={type}
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`admin-input ${Icon ? "pl-10" : ""} ${errors[name] ? "!border-[rgba(255,68,68,0.45)]" : ""}`}
        />
      </div>
      {errors[name] && <p className="text-[#ff6666] font-mono-matrix text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <section id="register" ref={ref} className="relative py-24 overflow-visible scroll-mt-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="section-tag">// REGISTRATION</span>
          <h2 className="font-orbitron text-4xl md:text-5xl mt-6 mb-4">
            Join <span className="gradient-text">YUGANTRAN 3.0</span>
          </h2>
          <p className="text-[rgba(176,255,176,0.5)]">
            Select your event, fill details, pay via UPI and upload receipt.
          </p>
        </motion.div>

        {/* Closed */}
        {!isRegistrationOpen && (
          <div className="text-center py-16 glass rounded-2xl">
            <XCircle className="w-16 h-16 text-[#ff6666] mx-auto mb-4" />
            <h3 className="font-orbitron text-2xl text-[#ff6666] mb-2">Registration Closed</h3>
            <p className="text-[rgba(176,255,176,0.5)]">Registration is currently closed. Stay tuned for updates.</p>
          </div>
        )}

        {/* Success */}
        {submitted && (
          <motion.div
            ref={successRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 text-center mb-8"
          >
            <CheckCircle className="w-16 h-16 text-[#00ff41] mx-auto mb-4 text-glow-green" />
            <h3 className="font-orbitron text-2xl text-[#00ff41] mb-3">Registration Received!</h3>
            <p className="text-[rgba(176,255,176,0.6)]">
              Thank you! A confirmation email has been sent to your email address.
            </p>
          </motion.div>
        )}

        {/* Form */}
        {isRegistrationOpen && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Event Selection */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-orbitron text-sm text-[#00ff41] tracking-widest mb-5">[ SELECT EVENT ]</h3>
              {errors.eventType && <p className="text-[#ff6666] font-mono-matrix text-xs mb-3">{errors.eventType}</p>}
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
                      onClick={() => isSel ? setFormData((p) => ({ ...p, selectedEvent: null })) : selectEvent(ev)}
                      className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                        isSel
                          ? "border-[#00ff41] bg-[rgba(0,255,65,0.1)]"
                          : "border-[rgba(0,255,65,0.12)] bg-[rgba(0,255,65,0.03)] hover:border-[rgba(0,255,65,0.25)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isSel ? "#00ff41" : "rgba(0,255,65,0.45)" }} />
                        <span className="font-orbitron text-xs truncate" style={{ color: isSel ? "#00ff41" : "#b0ffb0" }}>
                          {ev.name}
                        </span>
                        {isSel && <Check className="w-3 h-3 text-[#00ff41] ml-auto flex-shrink-0" />}
                      </div>
                      <div className="font-mono-matrix text-xs text-[rgba(176,255,176,0.4)]">
                        ₹{ev.fee} &nbsp;|&nbsp;{" "}
                        {ev.teamType === "individual" ? "Solo" : `Team ${ev.minTeam === ev.maxTeam ? `of ${ev.minTeam}` : `${ev.minTeam}-${ev.maxTeam}`}`}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {selectedEvent && (
                <div className="mt-4 p-4 rounded-lg bg-[rgba(0,255,65,0.06)] border border-[rgba(0,255,65,0.2)] flex items-center justify-between">
                  <span className="font-mono-matrix text-sm text-[#00ff41]">Selected: {selectedEvent.name}</span>
                  <span className="font-orbitron text-lg text-[#00ff41]">₹{selectedEvent.fee}</span>
                </div>
              )}
            </div>

            {/* Personal Info */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-orbitron text-sm text-[#00ff41] tracking-widest mb-5">[ YOUR DETAILS ]</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Full Name *" name="name" placeholder="Your full name" icon={User} />
                <Field label="Roll Number *" name="rollNumber" placeholder="e.g. GU21MCA001" icon={Hash} />
                <Field label="Program *" name="program" placeholder="e.g. MCA / B.Tech CSE" icon={BookOpen} />
                <Field label="Semester *" name="semester" placeholder="e.g. 5th Sem" icon={Briefcase} />
                <Field label="Mobile Number *" name="mobileNumber" placeholder="10-digit mobile" icon={Phone} type="tel" />
                <Field label="Email *" name="email" placeholder="your@email.com" icon={Mail} type="email" />
                <div className="md:col-span-2">
                  <Field label="College / University *" name="college" placeholder="e.g. Geeta University, Panipat" icon={Building2} />
                </div>
              </div>
            </div>

            {/* Team Details */}
            {isTeamEvent && (
              <div className="glass rounded-xl p-6">
                <h3 className="font-orbitron text-sm text-[#00ff41] tracking-widest mb-5">[ TEAM DETAILS ]</h3>
                <div className="mb-5">
                  <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">TEAM NAME *</label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="Your team name"
                    className={`admin-input ${errors.teamName ? "!border-[rgba(255,68,68,0.45)]" : ""}`}
                  />
                  {errors.teamName && <p className="text-[#ff6666] font-mono-matrix text-xs mt-1">{errors.teamName}</p>}
                </div>
                <p className="font-mono-matrix text-xs text-[rgba(176,255,176,0.35)] mb-4 tracking-wider">
                  TEAM MEMBERS (excluding yourself) — {selectedEvent.minTeam - 1} to {selectedEvent.maxTeam - 1} members required
                </p>
                {errors.teamMembers && <p className="text-[#ff6666] font-mono-matrix text-xs mb-3">{errors.teamMembers}</p>}
                {formData.teamMembers.map((member, i) => (
                  <div key={i} className="mb-4 p-4 rounded-lg border border-[rgba(0,255,65,0.1)] bg-[rgba(0,255,65,0.02)]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono-matrix text-xs text-[rgba(0,255,65,0.55)] tracking-widest">MEMBER {i + 1}</span>
                      {formData.teamMembers.length > selectedEvent.minTeam - 1 && (
                        <button type="button"
                          onClick={() => setFormData((p) => ({ ...p, teamMembers: p.teamMembers.filter((_, j) => j !== i) }))}
                          className="text-[#ff6666] hover:text-[#ff8888] transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {["name", "rollNumber", "program", "semester", "college"].map((field) => (
                        <input
                          key={field}
                          type="text"
                          placeholder={field === "rollNumber" ? "Roll Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                          value={member[field as keyof typeof member]}
                          onChange={(e) => {
                            const updated = [...formData.teamMembers];
                            updated[i] = { ...updated[i], [field]: e.target.value };
                            setFormData((p) => ({ ...p, teamMembers: updated }));
                          }}
                          className="admin-input text-sm"
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {formData.teamMembers.length < selectedEvent.maxTeam - 1 && (
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, teamMembers: [...p.teamMembers, { name: "", rollNumber: "", program: "", semester: "", college: "" }] }))}
                    className="btn-outline text-sm py-2 px-5 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" /> Add Member
                  </button>
                )}
              </div>
            )}

            {/* Payment */}
            {selectedEvent && (
              <div className="glass rounded-xl p-6">
                <h3 className="font-orbitron text-sm text-[#00ff41] tracking-widest mb-5">[ PAYMENT ]</h3>
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  {/* QR */}
                  <div className="flex-shrink-0 text-center">
                    <div className="w-40 h-40 border border-[rgba(0,255,65,0.2)] rounded-xl bg-white flex items-center justify-center overflow-hidden mx-auto">
                      {settings?.upiQrImageUrl
                        ? <img src={settings.upiQrImageUrl} alt="UPI QR" className="w-full h-full object-contain" />
                        : <div className="text-[rgba(0,0,0,0.35)] text-xs text-center p-3">QR Code<br />(Admin will add)</div>
                      }
                    </div>
                    <div className="mt-3 font-mono-matrix text-sm text-[#00ff41]">{settings?.upiId || "yugantran@upi"}</div>
                    <div className="font-orbitron text-2xl text-[#00ff41] mt-1">₹{selectedEvent.fee}</div>
                  </div>
                  {/* Fields */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">UPI ID / UTR NUMBER *</label>
                      <input type="text" name="upiId" value={formData.upiId} onChange={handleChange}
                        placeholder="yourname@bank or UTR..." className={`admin-input ${errors.upiId ? "!border-[rgba(255,68,68,0.45)]" : ""}`} />
                      {errors.upiId && <p className="text-[#ff6666] font-mono-matrix text-xs mt-1">{errors.upiId}</p>}
                    </div>
                    <div>
                      <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">TRANSACTION ID *</label>
                      <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange}
                        placeholder="Transaction ID from payment app" className={`admin-input ${errors.transactionId ? "!border-[rgba(255,68,68,0.45)]" : ""}`} />
                      {errors.transactionId && <p className="text-[#ff6666] font-mono-matrix text-xs mt-1">{errors.transactionId}</p>}
                    </div>
                  </div>
                </div>

                {/* Receipt Upload */}
                <div>
                  <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">PAYMENT RECEIPT *</label>
                  <label
                    htmlFor="receiptFile"
                    onDrop={(e) => { e.preventDefault(); setIsDragActive(false); handleFile(e.dataTransfer.files[0] || null); }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={() => setIsDragActive(false)}
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
                      isDragActive ? "border-[#00ff41] bg-[rgba(0,255,65,0.08)]"
                        : "border-[rgba(0,255,65,0.2)] hover:border-[rgba(0,255,65,0.35)] bg-[rgba(0,255,65,0.02)]"
                    } ${errors.paymentReceipt ? "!border-[rgba(255,68,68,0.35)]" : ""}`}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Receipt preview" className="max-h-40 rounded-lg" />
                    ) : (
                      <>
                        <FolderOpen className="w-10 h-10 text-[rgba(0,255,65,0.35)] mb-3" />
                        <p className="text-[rgba(176,255,176,0.45)] text-sm text-center">
                          {formData.paymentReceipt ? formData.paymentReceipt.name : "Drag & drop or click to upload receipt"}
                        </p>
                        <p className="font-mono-matrix text-xs text-[rgba(176,255,176,0.25)] mt-1">PNG, JPG, PDF — max 10MB</p>
                      </>
                    )}
                  </label>
                  <input id="receiptFile" type="file" accept="image/*,.pdf" className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] || null)} />
                  {formData.paymentReceipt && (
                    <button type="button" onClick={() => handleFile(null)}
                      className="mt-2 text-xs text-[#ff6666] font-mono-matrix hover:text-[#ff8888] transition-colors">
                      Remove ×
                    </button>
                  )}
                  {errors.paymentReceipt && <p className="text-[#ff6666] font-mono-matrix text-xs mt-1">{errors.paymentReceipt}</p>}
                </div>
              </div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> SUBMITTING...</>
                : <><Send className="w-5 h-5" /> SUBMIT REGISTRATION</>}
            </motion.button>
          </motion.form>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full glass border border-[rgba(0,255,65,0.3)] font-mono-matrix text-sm text-[#00ff41] whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}