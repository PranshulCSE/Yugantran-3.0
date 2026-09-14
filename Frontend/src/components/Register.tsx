import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { useInView } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  User,
  Phone,
  Building2,
  Send,
  CheckCircle,
  Loader2,
  Bug,
  Search,
  Gamepad2,
  Monitor,
  TrendingUp,
  Image,
  HelpCircle,
  XCircle,
  Gamepad,
  Code,
  FolderOpen,
  Hash,
  Briefcase,
  BookOpen,
  IndianRupee,
  Check,
  Users,
  Mail,
  AlertTriangle,
} from "lucide-react";

export default function Register() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const successRef = useRef<HTMLDivElement>(null);

  /* -----------------------------
     EVENT INFO CONFIG
  ----------------------------- */
  const eventInfo: Record<
    string,
    {
      type: "individual" | "team";
      fee: number;
      minTeam: number;
      maxTeam?: number;
      whatsapp: string;
    }
  > = {
    "Tech Treasure": {
      type: "team",
      fee: 50,
      minTeam: 2,
      maxTeam:2,
      whatsapp: "https://chat.whatsapp.com/Ee7oNF4JvkwKuIdomRRxpj",
    },
    BGMI: {
      type: "team",
      fee: 100,
      minTeam: 4,
      maxTeam: 4,
      whatsapp: "https://chat.whatsapp.com/Busn9D6I7wa14z5VbI8W4A",
    },
    "BGMI(Solo)": {
      type: "individual",
      fee: 30,
      minTeam: 1,
      whatsapp: "https://chat.whatsapp.com/Busn9D6I7wa14z5VbI8W4A",
    },
    "Tech Show": {
      type: "team",
      fee: 50, // default fee for Tech Show is 100 (for team of 4). Special-case for team of 3 handled in fee calculation.
      minTeam: 1,
      maxTeam: 2,
      whatsapp: "https://chat.whatsapp.com/LoMClqq4vGa90vNYV2IDt7",
    },
    "Startup Bid": {
      type: "team",
      fee: 100,
      minTeam: 1,
      maxTeam: 4,
      whatsapp: "https://chat.whatsapp.com/HypSXtHqVcY18mKmKBcIdZ",
    },
    "Poster Making": {
      type: "individual",
      fee: 25,
      minTeam: 1,
      whatsapp: "https://chat.whatsapp.com/Lt04XGiL4E7L83yMVAOFgN",
    },
    "Tech Quiz": {
      type: "individual",
      fee: 25,
      minTeam: 1,
      whatsapp: "https://chat.whatsapp.com/F0YqBqx65x69tTzd1ASrpL",
    },
    "Tekken 7": {
      type: "individual",
      fee: 50,
      minTeam: 1,
      whatsapp: "https://chat.whatsapp.com/CMuQzhMFln6KsXRHVCly8M",
    },
    "Code Relay": {
      type: "team",
      fee: 50,
      minTeam: 2,
      maxTeam: 2,
      whatsapp: "https://chat.whatsapp.com/CC17GJQQ6buDc00EGDBOr2",
    },
    "Free Fire": {
      type: "team",
      fee: 100,
      minTeam: 4,
      maxTeam: 4,
      whatsapp: "https://chat.whatsapp.com/Ief26wFIkgTHVJF1x7qaU5",
    },
    "Free Fire(Solo)": {
      type: "individual",
      fee: 30,
      minTeam: 1,
      whatsapp: "https://chat.whatsapp.com/Ief26wFIkgTHVJF1x7qaU5",
    },
  };

  /* -----------------------------
     Solo-event notes (these will be shown in a modal for emphasis)
     - keeps the important "Note:" text very visible before selection
  ----------------------------- */
  const soloNotes: Record<string, string> = {
    "Free Fire(Solo)":
      "IMPORTANT: This is a squad-based event. You will be placed into a squad with other solo participants. Make sure you are comfortable playing in a team and communicating with squad-mates — you'll rely on them and they will rely on you.",
    "BGMI(Solo)":
      "IMPORTANT: This is a squad-based event. You will be teamed up with a squad of other solo participants. Please be aware that match outcome depends on squad coordination — joining means you accept being placed in a squad.",
  };

  /* -----------------------------
     ICON MAP (for toast & buttons)
     - fixed "Code Relay" key typo
  ----------------------------- */
  const icons: Record<string, any> = {
    "Tech Treasure": Search,
    BGMI: Gamepad2,
    "BGMI(Solo)": Gamepad2,
    "Tech Show": Monitor,
    "Startup Bid": TrendingUp,
    "Poster Making": Image,
    "Tech Quiz": HelpCircle,
    "Tekken 7": Gamepad,
    "Code Relay": Code,
    "Free Fire": Gamepad2,
    "Free Fire(Solo)": Gamepad2,
  };

  /* -----------------------------
     STATE
  ----------------------------- */
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    program: "",
    semester: "",
    mobileNumber: "",
    college: "",
    email: "", // leader's email (only leader supplies this)
    eventType: [] as string[],
    teamName: "",
    teamMembers: [{ name: "", rollNumber: "", program: "", semester: "", college: "" }] as Array<{
      name: string;
      rollNumber: string;
      program: string;
      semester: string;
      college: string;
    }>,
    paymentReceipt: null as File | null,
    teamType: "",
    upiId: "",
    transactionId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastRegisteredEvent, setLastRegisteredEvent] = useState<string | null>(
    null
  );

  // For toast popup (bottom-center, motion-based)
  const [toast, setToast] = useState<{ label: string; Icon?: any; subtitle?: string } | null>(null);

  const [totalFee, setTotalFee] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Team size modal states
  const [showTeamSizeModal, setShowTeamSizeModal] = useState(false);
  const [modalEventLabel, setModalEventLabel] = useState<string | null>(null);
  const [chosenTeamSize, setChosenTeamSize] = useState<number | null>(null);
  const [chosenTeamEvent, setChosenTeamEvent] = useState<string | null>(null);

  // Solo-note modal states (new)
  const [showSoloNoteModal, setShowSoloNoteModal] = useState(false);
  const [modalSoloEventLabel, setModalSoloEventLabel] = useState<string | null>(null);

  /* -----------------------------
     FEE CALCULATION
  ----------------------------- */
  useEffect(() => {
    const teamEvent = formData.eventType.find((ev) => eventInfo[ev]?.type === "team");
    if (teamEvent) {
      if (teamEvent === "Tech Show") {
        if (chosenTeamSize === 2) {
          setTotalFee(50);
        } else {
          setTotalFee(eventInfo[teamEvent].fee);
        }
      } else {
        setTotalFee(eventInfo[teamEvent].fee);
      }
    } else {
      const total = formData.eventType.reduce((sum, ev) => {
        const info = eventInfo[ev];
        return info && info.type === "individual" ? sum + info.fee : sum;
      }, 0);
      setTotalFee(total);
    }
  }, [formData.eventType, chosenTeamSize, chosenTeamEvent]);

  /* -----------------------------
     FLOATING TOAST (form only)
  ----------------------------- */
  const showFloatingToast = (msg: string) => {
    const toastEl = document.createElement("div");
    toastEl.textContent = msg;
    toastEl.style.position = "fixed";
    toastEl.style.bottom = "30px";
    toastEl.style.left = "50%";
    toastEl.style.transform = "translateX(-50%)";
    toastEl.style.background = "rgba(0, 180, 255, 0.15)";
    toastEl.style.color = "#00e6ff";
    toastEl.style.padding = "10px 22px";
    toastEl.style.borderRadius = "10px";
    toastEl.style.fontFamily = "Orbitron, sans-serif";
    toastEl.style.border = "1px solid rgba(0, 255, 255, 0.3)";
    toastEl.style.boxShadow = "0 0 12px rgba(0,255,255,0.3)";
    toastEl.style.zIndex = "9999";
    toastEl.style.fontSize = "14px";
    toastEl.style.backdropFilter = "blur(8px)";
    toastEl.style.transition = "opacity 0.5s ease";
    document.body.appendChild(toastEl);
    setTimeout(() => (toastEl.style.opacity = "0"), 1500);
    setTimeout(() => toastEl.remove(), 2000);
  };

  /* -----------------------------
     Prevent body scroll while modal(s) are open
  ----------------------------- */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (showTeamSizeModal || showSoloNoteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prevOverflow || "";
    }
    return () => {
      document.body.style.overflow = prevOverflow || "";
    };
  }, [showTeamSizeModal, showSoloNoteModal]);

  /* -----------------------------
     Close modal on Escape (handles both modals)
  ----------------------------- */
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        if (showTeamSizeModal) cancelTeamSizeModal();
        else if (showSoloNoteModal) cancelSoloNoteModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showTeamSizeModal, showSoloNoteModal]);

  /* -----------------------------
     Helper: selected team info & fixed-size detection
  ----------------------------- */
  const selectedTeamInfo = formData.eventType[0] ? eventInfo[formData.eventType[0]] : null;
  const fixedTeamSize =
    Boolean(selectedTeamInfo && selectedTeamInfo.type === "team" && selectedTeamInfo.maxTeam != null && selectedTeamInfo.minTeam === selectedTeamInfo.maxTeam);

  const teamSizeLocked = Boolean(
    fixedTeamSize ||
      (chosenTeamSize != null && chosenTeamEvent === formData.eventType[0])
  );

  /* -----------------------------
     TOGGLE EVENT (form click only / external)
     - Team events remain exclusive (single selection).
     - Individual events are now single-select (exclusive).
     - For certain individual events (solo variants) we show an IMPORTANT-note modal before confirming.
  ----------------------------- */
  const confirmSelectIndividual = (label: string, external = false) => {
    setFormData((prev) => ({
      ...prev,
      eventType: [label],
      teamType: "individual",
      teamName: "",
      teamMembers: [{ name: "", rollNumber: "", program: "", semester: "", college: "" }],
    }));

    setChosenTeamSize(null);
    setChosenTeamEvent(null);

    showFloatingToast(`${label} selected ✅`);
  };

  const toggleEvent = (label: string, isExternal = false) => {
    const info = eventInfo[label];
    if (!info) return;

    const currentlySelected = formData.eventType.includes(label);

    // If deselecting, remove and reset team-related fields
    if (currentlySelected) {
      const newEventType = formData.eventType.filter((e) => e !== label);
      const newTeamType =
        newEventType.some((e) => eventInfo[e]?.type === "team")
          ? "team"
          : "individual";

      if (chosenTeamEvent === label) {
        setChosenTeamSize(null);
        setChosenTeamEvent(null);
      }

      setModalEventLabel(null);

      setFormData((prev) => ({
        ...prev,
        eventType: newEventType,
        teamName: "",
        // reset members with empty college fields (no auto-fill)
        teamMembers: [{ name: "", rollNumber: "", program: "", semester: "", college: "" }],
        teamType: newTeamType,
      }));

      showFloatingToast(`${label} deselected ❌`);
      return;
    }

    // Selecting a team event => exclusive, open modal or auto-confirm fixed size
    if (info.type === "team") {
      if (info.maxTeam != null && info.minTeam === info.maxTeam) {
        confirmTeamSize(label, info.minTeam);
        showFloatingToast(`${label} selected — Fixed team of ${info.minTeam} players ✅`);
        return;
      }

      setModalEventLabel(label);
      setShowTeamSizeModal(true);

      setFormData((prev) => ({
        ...prev,
        eventType: [label],
        teamName: "",
        teamMembers: [{ name: "", rollNumber: "", program: "", semester: "", college: "" }],
        teamType: "team",
      }));
      showFloatingToast(`Choose team size for ${label}`);
      return;
    }

    // Individual event: check for solo-note modal requirement
    if (info.type === "individual") {
      if (label in soloNotes) {
        // Show solo caution modal first; selection will happen only on confirm
        setModalSoloEventLabel(label);
        setShowSoloNoteModal(true);
        return;
      }

      // otherwise confirm immediately
      confirmSelectIndividual(label, isExternal);
      return;
    }
  };

  /* -----------------------------
     Confirm team size from modal
  ----------------------------- */
  const confirmTeamSize = (label: string, size: number) => {
    setShowTeamSizeModal(false);
    setModalEventLabel(null);

    if (size === 1) {
      setChosenTeamSize(null);
      setChosenTeamEvent(null);

      setFormData((prev) => ({
        ...prev,
        eventType: [label],
        teamName: "",
        teamMembers: [{ name: "", rollNumber: "", program: "", semester: "", college: "" }],
        teamType: "individual",
      }));
      showFloatingToast(`${label} selected as individual ✅`);
      return;
    }

    setChosenTeamSize(size);
    setChosenTeamEvent(label);

    setFormData((prev) => ({
      ...prev,
      eventType: [label],
      teamType: "team",
      teamMembers: Array.from({ length: size - 1 }, () => ({ name: "", rollNumber: "", program: "", semester: "", college: "" })),
    }));
    showFloatingToast(`${label} selected — Team of ${size} players ✅`);
  };

  /* -----------------------------
     Cancel team size modal
  ----------------------------- */
  const cancelTeamSizeModal = () => {
    setShowTeamSizeModal(false);
    setModalEventLabel(null);
  };

  /* -----------------------------
     Solo-note modal handlers (new)
     - confirm will finalize selection (same behaviour as choosing an individual event)
  ----------------------------- */
  const confirmSoloNoteAndSelect = (label: string | null) => {
    if (label) confirmSelectIndividual(label);
    setShowSoloNoteModal(false);
    setModalSoloEventLabel(null);
  };

  const cancelSoloNoteModal = () => {
    setShowSoloNoteModal(false);
    setModalSoloEventLabel(null);
  };

  /* -----------------------------
     INPUT CHANGE
  ----------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* -----------------------------
     FILE HANDLING
  ----------------------------- */
  const handleFile = useCallback(
    (file: File | null) => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (!file) {
        setFormData((prev) => ({ ...prev, paymentReceipt: null }));
        setPreviewUrl(null);
        return;
      }

      setFormData((prev) => ({ ...prev, paymentReceipt: file }));

      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    },
    [previewUrl]
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      handleFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, paymentReceipt: null }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    const input = document.getElementById("paymentReceiptInput") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /* -----------------------------
     VALIDATION
  ----------------------------- */
  const validate = (data: typeof formData) => {
    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = "Full name is required.";
    if (!data.rollNumber.trim()) newErrors.rollNumber = "Roll number is required.";
    if (!data.program.trim()) newErrors.program = "Program is required.";
    if (!data.semester.trim()) newErrors.semester = "Semester is required.";
    if (!/^[0-9]{10}$/.test(data.mobileNumber))
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
    if (!data.college.trim()) newErrors.college = "College/University is required.";

    // leader's email validation (only leader supplies email)
    if (!data.email || !data.email.trim()) {
      newErrors.email = "Email is required (leader's email).";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        newErrors.email = "Enter a valid email address.";
      }
    }

    if (data.eventType.length === 0) newErrors.eventType = "Select at least one event.";
    if (!data.paymentReceipt) newErrors.paymentReceipt = "Please upload your payment receipt.";

    if (data.eventType.length > 0) {
      const upi = (data as any).upiId?.trim() ?? "";
      const tx = (data as any).transactionId?.trim() ?? "";

      if (!upi) {
        newErrors.upiId = "UPI ID/UTR ID is required.";
      } else {
        const upiRegex = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/;
        const utrLike = /^[0-9A-Za-z]{6,40}$/;
        if (!upiRegex.test(upi) && !utrLike.test(upi)) {
          newErrors.upiId = "Enter a valid UPI ID (e.g. name@bank) or a valid UTR/ID.";
        }
      }

      if (!tx) {
        newErrors.transactionId = "Transaction ID is required.";
      } else {
        const txRegex = /^[A-Za-z0-9\-_]{6,40}$/;
        if (!txRegex.test(tx)) {
          newErrors.transactionId = "Transaction ID looks invalid (alphanumeric, 6-40 chars).";
        }
      }
    }

    // Team validation
    const teamSelected = data.eventType.some((e) => eventInfo[e]?.type === "team");
    if (teamSelected) {
      if (!data.teamName.trim()) newErrors.teamName = "Team name is required.";

      const emptyFound = data.teamMembers.some(
        (m) =>
          !m.name.trim() ||
          !m.rollNumber.trim() ||
          !m.program.trim() ||
          !m.semester.trim() ||
          !m.college.trim()
      );
      if (emptyFound) newErrors.teamMembers = "All team member fields are required.";

      const selectedEvent = data.eventType[0];
      const chosenApplies = chosenTeamSize != null && chosenTeamEvent === selectedEvent;

      if (chosenApplies && chosenTeamSize != null) {
        if (data.teamMembers.length !== chosenTeamSize - 1) {
          newErrors.teamMembers = `Exactly ${chosenTeamSize - 1} member(s) (excluding you) required for this team size.`;
        }
      } else {
        const max = Math.max(...data.eventType.map((e) => eventInfo[e]?.maxTeam || 1));
        if (data.teamMembers.length > Math.max(max - 1, 0))
          newErrors.teamMembers = `Maximum ${Math.max(max - 1, 0)} members (excluding you) allowed.`;
        const min = Math.min(...data.eventType.map((e) => eventInfo[e]?.minTeam || 1));
        if (max >= 1 && min > 1) {
          if (data.teamMembers.length < min - 1) {
            newErrors.teamMembers = `Minimum ${min - 1} members (excluding you) required.`;
          }
        }
      }
    }

    setErrors(newErrors);
    const errorMessages = Object.values(newErrors);
    if (errorMessages.length > 0) {
      showFloatingToast(errorMessages[0]);
    }

    return Object.keys(newErrors).length === 0;
  };

  const getSelectedWhatsappLink = () => {
    const selected = formData.eventType[0];
    return selected && eventInfo[selected] ? eventInfo[selected].whatsapp : "";
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;
    setLoading(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("rollNumber", formData.rollNumber);
      form.append("program", formData.program);
      form.append("semester", formData.semester);
      form.append("mobileNumber", formData.mobileNumber);
      form.append("college", formData.college);
      form.append("email", formData.email);
      form.append("eventType", formData.eventType[0] ?? "");
      form.append("teamType", formData.teamType);
      form.append("teamName", formData.teamName);
      form.append("upiId", formData.upiId);
      form.append("transactionId", formData.transactionId);
      form.append("teamMembers", JSON.stringify(formData.teamMembers));
      form.append("whatsappLink", getSelectedWhatsappLink());

      if (formData.paymentReceipt instanceof File) {
        const isTeam = formData.eventType.some((e) => eventInfo[e]?.type === "team") && formData.teamType === "team";
        const baseName = isTeam ? (formData.teamName || formData.name || "team") : (formData.name || "participant");
        const extMatch = formData.paymentReceipt.name.match(/\.[a-zA-Z0-9]+$/);
        const ext = extMatch ? extMatch[0] : "";
        form.append("paymentReceipt", formData.paymentReceipt, `${baseName}${ext}`);
      }

      const res = await fetch(`${backendUrl}/submit`, {
        method: "POST",
        body: form,
      });

      const resultText = await res.text();

      if (res.ok) {
        setSubmitted(true);
        setLastRegisteredEvent(formData.eventType[0] || null);

        setTimeout(() => {
          successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);

        // Reset all fields
        setFormData({
          name: "",
          rollNumber: "",
          program: "",
          semester: "",
          mobileNumber: "",
          college: "",
          email: "",
          eventType: [],
          teamName: "",
          teamMembers: [{ name: "", rollNumber: "", program: "", semester: "", college: "" }],
          paymentReceipt: null,
          teamType: "",
          upiId: "",
          transactionId: "",
        });

        setChosenTeamSize(null);
        setChosenTeamEvent(null);

        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setErrors({});
        setTimeout(() => setSubmitted(false), 15000);
      } else {
        showFloatingToast("Registration failed! Try again.");
      }
    } catch (err) {
      showFloatingToast("Network/server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Helper: is team event selected
  ----------------------------- */
  const isTeamEventSelected = formData.eventType.some((e) => eventInfo[e]?.type === "team" && formData.teamType === "team");

  const currentMaxTeam = (() => {
    if (isTeamEventSelected) {
      if (chosenTeamSize != null && chosenTeamEvent === formData.eventType[0]) return chosenTeamSize;
      return Math.max(...formData.eventType.map((e) => eventInfo[e]?.maxTeam || 1));
    }
    return 1;
  })();

  const events = Object.keys(eventInfo).map((label) => {
    const Icon = icons[label] || Code;
    return { label, Icon };
  });

  const individualEvents = events.filter((e) => eventInfo[e.label]?.type === "individual");
  const teamEvents = events.filter((e) => eventInfo[e.label]?.type === "team");

  /* -----------------------------
     External event selection (listens to window eventSelected)
  ----------------------------- */
  useEffect(() => {
    const normalize = (s?: string | null) =>
      (s ?? "")
        .toString()
        .trim()
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .toLowerCase();

    const findMatchingLabel = (incoming?: string | null) => {
      if (!incoming) return null;
      const asString = incoming.toString().trim();
      if (asString in eventInfo) return asString;
      const n = normalize(asString);
      for (const k of Object.keys(eventInfo)) {
        if (normalize(k) === n) return k;
      }
      return null;
    };

    const handleEventSelect = (e: Event) => {
      const detail = (e as CustomEvent<any>).detail;
      let incoming: string | null = null;

      if (detail == null) {
        incoming = null;
      } else if (typeof detail === "string") {
        incoming = detail;
      } else if (typeof detail === "object" && detail.label) {
        incoming = detail.label;
      } else if (typeof detail === "object" && detail.event) {
        incoming = detail.event;
      } else {
        incoming = String(detail);
      }

      console.debug("[Register] eventSelected incoming detail:", detail, "normalized->", incoming);

      const matched = findMatchingLabel(incoming);
      if (matched) {
        toggleEvent(matched, true);
      } else {
        console.warn(`[Register] Unrecognized external event label: "${incoming}". Available: ${Object.keys(eventInfo).join(", ")}`);
        showFloatingToast(`Unknown event: ${incoming}`);
      }
    };

    window.addEventListener("eventSelected", handleEventSelect as EventListener);
    return () => window.removeEventListener("eventSelected", handleEventSelect as EventListener);
  }, [eventInfo, formData.eventType, chosenTeamEvent, chosenTeamSize]);

  /* -----------------------------
     Helpers for UI display name
  ----------------------------- */
  const fileDisplayName = (() => {
    if (!formData.paymentReceipt) return "No file selected";
    const origName = formData.paymentReceipt.name;
    const extMatch = origName.match(/(\.[a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[0] : "";
    if (isTeamEventSelected) {
      const name = formData.teamName?.trim() || formData.name?.trim() || origName.replace(ext, "");
      return `${name}${ext}`;
    } else {
      const name = formData.name?.trim() || origName.replace(ext, "");
      return `${name}${ext}`;
    }
  })();

  const fileSizeKB = formData.paymentReceipt ? `${(formData.paymentReceipt.size / 1024).toFixed(1)} KB` : "";

const registrationDeadline = new Date(2025, 10, 27, 16, 0, 0);
const isRegistrationClosed = new Date() > registrationDeadline;


  /* -----------------------------
     UI
  ----------------------------- */
  return (
    <section id="register" className="relative py-24 overflow-visible bg-transparent" ref={ref}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full blur-3xl opacity-8" />

      <div className="container mx-auto px-4 lg:px-8 relative z-1">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut"}}
          className="text-center mb-16"
        >
          <span className="px-4 py-2 glass rounded-full text-sm text-cyan-400 inline-block mb-4">
            Registration
          </span>
          {isRegistrationClosed ? (
  <>
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-orbitron mb-6">
      <span className="gradient-text">Registrations</span> Closed
    </h2>

    <p className="text-gray-400 max-w-3xl mx-auto text-lg">
      The registration period for <span className="text-cyan-400 font-semibold"> Yugantran 2.0 </span> has concluded. We extend our sincere appreciation for the tremendous participation.
    </p>
  </>
) : (
  <>
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-orbitron mb-6">
      <span className="gradient-text">Join</span> YUGANTRAN2.0 2025
    </h2>

    <p className="text-gray-400 max-w-3xl mx-auto text-lg">
      Register now to secure your spot at the most exciting tech fest of
      the year! Fill details & upload payment receipt to complete.
    </p>
  </>
)}

        </motion.div>

        <div className="max-w-2xl mx-auto glass p-6 md:p-12 rounded-2xl glow-blue">

  {/* 🔥 AUTO CLOSE REGISTRATION CHECK */}
  {isRegistrationClosed ? (
    // -----------------------------
    // REGISTRATION CLOSED UI
    // -----------------------------
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <XCircle className="w-20 h-20 text-red-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]" />

      <h3 className="text-3xl font-orbitron gradient-text mb-4">
        Registrations Closed!
      </h3>

      <p className="text-gray-400 text-lg mb-3">
        The registration window for
        <span className="text-cyan-400 font-semibold"> Yugantran 2.0 </span>
        has officially ended.
      </p>

      <p className="text-gray-500 text-sm">
        Thank you for your overwhelming response.  
        Stay tuned for updates & schedules.
      </p>
    </motion.div>
  ) : (
    // -----------------------------
    // IF NOT CLOSED → SHOW YOUR OLD LOGIC
    // -----------------------------
    <>
      {!submitted ? (
        // 🔥🔥🔥 ENTIRE YOUR EXISTING FORM STARTS HERE (UNCHANGED)
        <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  error={errors.name}
                  icon={<User className="text-cyan-400" />}
                />
                <InputField
                  label="Roll Number"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  error={errors.rollNumber}
                  icon={<Hash className="text-cyan-400" />}
                />
                <InputField
                  label="Program"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  placeholder="Enter Program"
                  error={errors.program}
                  icon={<Briefcase className="text-cyan-400" />}
                />
                <InputField
                  label="Semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="Enter semester"
                  error={errors.semester}
                  icon={<BookOpen className="text-cyan-400" />}
                />
                <InputField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter Mobile Number"
                  error={errors.mobileNumber}
                  icon={<Phone className="text-cyan-400" />}
                />
                <InputField
                  label="College / University"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college"
                  error={errors.college}
                  icon={<Building2 className="text-cyan-400" />}
                />

                {/* Leader's Email (only leader fills this) */}
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  error={errors.email}
                  icon={<Mail className="text-cyan-400" />}
                />
              </div>

              {/* Event Selection */}
              <div className="mt-6 bg-[#0a0f1c]/70 border border-cyan-500/20 rounded-2xl p-8 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
                <h3 className="text-xl font-semibold text-center mb-8 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
                  Select Your Events
                </h3>

                <div className="flex flex-col gap-8">
                  <div className="block sm:hidden space-y-8">
                    <div className="border border-cyan-500/30 rounded-xl p-4 bg-[#0b1220]/60">
                      <h4 className="text-base font-semibold mb-4 text-cyan-300 text-center">
                        Individual Events
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {individualEvents.map(({ label, Icon }) => {
                          const selected = formData.eventType.includes(label);
                          const selectedStyle = selected
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white"
                            : "bg-[#0f1724] border-cyan-500/20 text-gray-300 hover:border-cyan-400/40";
                          return (
                            <motion.button
                              key={label}
                              type="button"
                              onClick={() => toggleEvent(label)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg border text-xs font-medium ${selectedStyle}`}
                            >
                              {selected ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Icon className="w-3 h-3 text-cyan-300" />
                              )}
                              {label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border border-cyan-500/30 rounded-xl p-4 bg-[#0b1220]/60">
                      <h4 className="text-base font-semibold mb-4 text-cyan-300 text-center">
                        Team Events
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {teamEvents.map(({ label, Icon }) => {
                          const selected = formData.eventType.includes(label);
                          const selectedStyle = selected
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white"
                            : "bg-[#0f1724] border-cyan-500/20 text-gray-300 hover:border-cyan-400/40";
                          return (
                            <motion.button
                              key={label}
                              type="button"
                              onClick={() => toggleEvent(label)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg border text-xs font-medium ${selectedStyle}`}
                            >
                              {selected ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Icon className="w-3 h-3 text-cyan-300" />
                              )}
                              {label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col gap-8">
                    <div className="border border-cyan-500/30 rounded-xl p-6 bg-[#0b1220]/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
                      <h4 className="text-lg font-semibold mb-5 text-cyan-300 text-center">
                        Individual Events
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-2">
                        {individualEvents.map(({ label, Icon }) => {
                          const selected = formData.eventType.includes(label);
                          const selectedStyle = selected
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white"
                            : "bg-[#0f1724] border-cyan-500/20 text-gray-300 hover:border-cyan-400/40";
                          return (
                            <motion.button
                              key={label}
                              type="button"
                              onClick={() => toggleEvent(label)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex items-center justify-center gap-2 py-3 px-5 rounded-lg border text-sm font-medium ${selectedStyle}`}
                            >
                              {selected ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Icon className="w-4 h-4 text-cyan-300" />
                              )}
                              {label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border border-cyan-500/30 rounded-xl p-6 bg-[#0b1220]/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
                      <h4 className="text-lg font-semibold mb-5 text-cyan-300 text-center">
                        Team Events
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-2">
                        {teamEvents.map(({ label, Icon }) => {
                          const selected = formData.eventType.includes(label);
                          const selectedStyle = selected
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white"
                            : "bg-[#0f1724] border-cyan-500/20 text-gray-300 hover:border-cyan-400/40";
                          return (
                            <motion.button
                              key={label}
                              type="button"
                              onClick={() => toggleEvent(label)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex items-center justify-center gap-2 py-3 px-5 rounded-lg border text-sm font-medium ${selectedStyle}`}
                            >
                              {selected ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Icon className="w-4 h-4 text-cyan-300" />
                              )}
                              {label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {errors.eventType && (
                  <p className="text-red-400 text-sm mt-3 text-center">
                    {errors.eventType}
                  </p>
                )}
              </div>

              <p className="text-sm mt-6 text-center text-cyan-300/90 font-medium tracking-wide drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                ⚡ Choose individual event or a team event.
              </p>

              {/* Team Section */}
              {formData.teamType === "team" && isTeamEventSelected && (
                <div className="p-3 border border-cyan-500/20 rounded-xl bg-[#0f1724] space-y-3">
                  <InputField
                    label="Team Name"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="Enter team name"
                    error={errors.teamName}
                    icon={<Users className="text-cyan-400" />}
                  />

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      Team Members (excluding yourself) — provide Name, Program, Roll Number, Semester, College/University
                    </label>

                    {formData.teamMembers.map((member, i) => (
                      <div key={i} className="border border-cyan-500/10 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-medium text-cyan-200">Team Member {i + 1}</div>
                          {!teamSizeLocked && formData.teamMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.teamMembers.filter((_, idx) => idx !== i);
                                setFormData({
                                  ...formData,
                                  teamMembers: updated.length ? updated : [{ name: "", rollNumber: "", program: "", semester: "", college: "" }],
                                });
                              }}
                              className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded"
                              aria-label={`Remove team member ${i + 1}`}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          <IconInput
                            value={member.name}
                            onChange={(v) => {
                              const updated = [...formData.teamMembers];
                              updated[i] = { ...updated[i], name: v };
                              setFormData({ ...formData, teamMembers: updated });
                            }}
                            placeholder="Full Name"
                            Icon={<User className="w-4 h-4" />}
                          />

                          <IconInput
                            value={member.program}
                            onChange={(v) => {
                              const updated = [...formData.teamMembers];
                              updated[i] = { ...updated[i], program: v };
                              setFormData({ ...formData, teamMembers: updated });
                            }}
                            placeholder="Program"
                            Icon={<Briefcase className="w-4 h-4" />}
                          />

                          <IconInput
                            value={member.rollNumber}
                            onChange={(v) => {
                              const updated = [...formData.teamMembers];
                              updated[i] = { ...updated[i], rollNumber: v };
                              setFormData({ ...formData, teamMembers: updated });
                            }}
                            placeholder="Roll Number"
                            Icon={<Hash className="w-4 h-4" />}
                          />

                          <IconInput
                            value={member.semester}
                            onChange={(v) => {
                              const updated = [...formData.teamMembers];
                              updated[i] = { ...updated[i], semester: v };
                              setFormData({ ...formData, teamMembers: updated });
                            }}
                            placeholder="Semester"
                            Icon={<BookOpen className="w-4 h-4" />}
                          />

                          <IconInput
                            value={member.college}
                            onChange={(v) => {
                              const updated = [...formData.teamMembers];
                              updated[i] = { ...updated[i], college: v };
                              setFormData({ ...formData, teamMembers: updated });
                            }}
                            placeholder="College / University"
                            Icon={<Building2 className="w-4 h-4" />}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add Member button */}
                    {(() => {
                      const selectedCount = chosenTeamSize ?? currentMaxTeam;
                      const isLocked = teamSizeLocked;
                      if (!isLocked && formData.teamMembers.length < Math.max(selectedCount - 1, 0)) {
                        return (
                          <button
                            type="button"
                            onClick={() => {
                              const selectedCountNow = chosenTeamSize ?? currentMaxTeam;
                              if (formData.teamMembers.length < selectedCountNow - 1) {
                                setFormData({ ...formData, teamMembers: [...formData.teamMembers, { name: "", rollNumber: "", program: "", semester: "", college: "" }] });
                              } else {
                                showFloatingToast(`Maximum ${selectedCountNow - 1} members allowed.`);
                              }
                            }}
                            className="text-cyan-400 text-sm hover:underline"
                          >
                            + Add Member
                          </button>
                        );
                      }
                      return null;
                    })()}

                    {errors.teamMembers && <p className="text-red-400 text-sm mt-1">{errors.teamMembers}</p>}
                  </div>
                </div>
              )}

              {/* Payment Section */}
              {formData.eventType.length > 0 && (
                <div className="p-3 rounded-xl border border-cyan-500/20 bg-[#0f1724] text-center space-y-3">
                  <p className="text-white-500 flex items-center justify-center gap-2">
                    <IndianRupee className="w-5 h-5 text-cyan-400" />
                    <span className="text-lg font-medium">Total Registration Fee: ₹{totalFee}</span>
                  </p>

                  <div>
                    <p className="text-gray-400 text-sm">Scan the QR below to pay</p>
                    <img
                      src="/images/bot/yashQR1.jpg"
                      alt="Payment QR"
                      className="mx-auto w-14 h-14 rounded-lg border border-cyan-500/20"
                    />
                  </div>

                  <div className="text-left w-full max-w-xl mx-auto">
                    <label className="block text-sm mb-2 text-gray-300">Upload Payment Receipt</label>

                    <input
                      id="paymentReceiptInput"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <label
                      htmlFor="paymentReceiptInput"
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      className={`group cursor-pointer block w-full border-2 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between bg-[#071025] border-cyan-500/30 hover:border-cyan-400 transition ${isDragActive ? "bg-cyan-600/5 border-cyan-400" : ""}`}
                      title="Click or drop a file here to upload payment receipt (image or PDF)"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md flex items-center justify-center bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md flex-shrink-0">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 16V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="3" y="12" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">Click or drop screenshot / PDF here</div>
                          <div className="text-xs text-gray-400">Accepted: JPG, PNG, PDF.</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 sm:flex-row flex-col sm:flex-nowrap">
                        {formData.paymentReceipt ? (
                          <div className="text-right max-w-[220px] sm:max-w-[220px]">
                            <div className="text-sm font-medium text-cyan-300 truncate">{fileDisplayName}</div>
                            <div className="text-xs text-gray-400">{fileSizeKB} • {formData.paymentReceipt?.type.split("/")[1]}</div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400">No file selected</div>
                        )}
                        <div className="px-3 py-2 rounded-md bg-cyan-600/10 text-cyan-300 text-xs font-semibold whitespace-nowrap">
                          Browse
                        </div>
                      </div>
                    </label>

                    {isDragActive && (
                      <div className="mt-2 text-xs text-cyan-300">Release to upload the file</div>
                    )}

                    {formData.paymentReceipt && (
                      <div className="mt-4">
                        <div className="relative w-full max-w-full rounded-md border border-cyan-500/30 overflow-hidden bg-[#071025]">
                          <div className="flex flex-col sm:flex-row items-stretch">
                            <div className="flex-shrink-0 w-full sm:w-[480px] h-44 sm:h-[220px] overflow-hidden bg-[#0b1220]">
                              {previewUrl ? (
                                <img src={previewUrl} alt="Receipt preview" className="w-full h-full object-cover block" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs p-2 text-center">PDF Document</div>
                              )}
                            </div>

                            <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                              <div className="text-sm font-semibold text-white truncate">{fileDisplayName}</div>
                              <div className="text-xs text-gray-400 mt-1">{fileSizeKB}</div>
                              {errors.paymentReceipt && <p className="text-red-400 text-sm mt-2">{errors.paymentReceipt}</p>}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={removeFile}
                            className="absolute top-3 right-3 bg-black/70 text-white hover:text-gray-300 px-3 py-1 rounded text-sm backdrop-blur-sm"
                          >
                            Remove
                          </button>

                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.eventType.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="UPI ID / UTR ID"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="Enter your UPI ID or UTR ID"
                      error={errors.upiId}
                      icon={<IndianRupee className="text-cyan-400" />}
                    />
                    <InputField
                      label="Transaction ID"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter your Transaction ID"
                      error={errors.transactionId}
                      icon={<Hash className="text-cyan-400" />}
                    />
                  </div>
                </>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={
                  loading ||
                  !formData.paymentReceipt ||
                  !formData.upiId.trim() ||
                  !formData.transactionId.trim() ||
                  !formData.email.trim()
                }
                className={`w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-orbitron text-white flex items-center justify-center gap-2 mt-2 ${(!formData.paymentReceipt ||
                    !formData.upiId.trim() ||
                    !formData.transactionId.trim() ||
                    !formData.email.trim() ||
                    loading)
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Register Now
                  </>
                )}
              </motion.button>
            </form>
      ) : (
        // -----------------------------
        // SUCCESS MESSAGE (UNCHANGED)
        // -----------------------------
        <motion.div
          ref={successRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h3 className="text-3xl font-orbitron gradient-text mb-4">
            Registration Successful!
          </h3>
          <p className="text-gray-400 mb-6">
            Thank you for registering! Your payment receipt has been received.
          </p>

          {(() => {
            const eventName = lastRegisteredEvent;
            const whatsapp = eventName ? eventInfo[eventName]?.whatsapp : null;
            return whatsapp ? (
              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-cyan-300 font-medium">
                  Join the WhatsApp group for{" "}
                  <span className="font-bold">{eventName}</span>!
                </p>

                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition"
                >
                  Join WhatsApp Group
                </a>

                <p className="text-xs text-gray-400 mt-2">
                  Please join the group to receive important updates.
                </p>
              </div>
            ) : null;
          })()}
        </motion.div>
          )}
        </>
      )}   {/* closes isRegistrationClosed ? ... : ... */}
    </div>
      </div>

      {/* Toast popup */}
      <div className="pointer-events-none fixed inset-0 flex items-end justify-center px-4 pb-8 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={toast ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 700, damping: 30, duration: 0.25 }}
          className={`min-w-[220px] max-w-sm pointer-events-auto`}
          aria-live="polite"
        >
          {toast && (
            <div className="bg-[#071023] border border-cyan-500/30 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 flex items-center justify-center bg-cyan-600/10 rounded-full">
                {toast.Icon ? <toast.Icon className="w-5 h-5 text-cyan-300" /> : <Search className="w-5 h-5 text-cyan-300" />}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">{toast.label}</div>
                {toast.subtitle && <div className="text-xs text-gray-400">{toast.subtitle}</div>}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* TEAM SIZE MODAL */}
      {showTeamSizeModal && modalEventLabel &&
        (() => {
          const EventIcon = icons[modalEventLabel] || Code;
          return createPortal(
            <div className="fixed inset-0 flex items-center justify-center px-4" aria-modal="true" role="dialog" style={{ zIndex: 99999 }}>
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={cancelTeamSizeModal}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="relative max-w-lg w-full bg-gradient-to-br from-gray-950 to-black border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.4)] text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-600/10 flex items-center justify-center">
                    <EventIcon className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-md text-white-400">Event</div>
                    <div className="text-lg font-semibold text-white truncate">{modalEventLabel}</div>
                  </div>
                </div>

                <CheckCircle className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
                <h3 className="text-2xl font-orbitron gradient-text mb-2">Select Team Size</h3>
                <p className="text-gray-400 mb-6">Choose how many players will participate (including you).</p>
                <p className="text-gray-400 mb-6">After choosing plz, fill Team Name and Team Members name below.</p>

                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {(() => {
                    const info = eventInfo[modalEventLabel];
                    if (!info) return null;
                    const min = info.minTeam ?? 1;
                    const max = info.maxTeam ?? Math.max(min, 1);
                    return Array.from({ length: max - min + 1 }, (_, i) => i + min).map((s) => (
                      <button
                        key={s}
                        onClick={() => confirmTeamSize(modalEventLabel, s)}
                        className="px-4 py-2 rounded-lg bg-cyan-600/10 text-cyan-300 border border-cyan-500/20 font-medium transition-all duration-200 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,255,255,0.6)]"
                      >
                        {s} {s === 1 ? "Player" : "Players"}
                      </button>
                    ));
                  })()}
                </div>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={cancelTeamSizeModal}
                    className="px-4 py-2 rounded-lg bg-transparent border border-cyan-500/20 text-gray-300 hover:bg-white/2"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>,
            document.body
          );
        })()
      }

      {/* SOLO-NOTE MODAL (for Free Fire(Solo) & BGMI(Solo)) */}
      {showSoloNoteModal && modalSoloEventLabel &&
        (() => {
          const EventIcon = icons[modalSoloEventLabel] || Code;
          const note = soloNotes[modalSoloEventLabel] ?? "";
          return createPortal(
            <div className="fixed inset-0 flex items-center justify-center px-4" aria-modal="true" role="dialog" style={{ zIndex: 99999 }}>
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={cancelSoloNoteModal}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="relative max-w-lg w-full bg-gradient-to-br from-gray-950 to-black border border-yellow-300/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(250,200,60,0.12)] text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center">
                    <EventIcon className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-md text-gray-200">Event</div>
                    <div className="text-lg font-semibold text-white truncate">{modalSoloEventLabel}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-yellow-50/90 border border-yellow-300 rounded-xl p-4 shadow-[0_0_18px_rgba(250,180,60,0.08)]">
                  <AlertTriangle className="w-6 h-6 text-yellow-700 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-yellow-800">Important note</div>
                    <div className="mt-2 whitespace-pre-line text-sm text-yellow-900 leading-snug">{note}</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={cancelSoloNoteModal}
                    className="px-4 py-2 rounded-lg bg-transparent border border-cyan-500/20 text-gray-300 hover:bg-white/2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmSoloNoteAndSelect(modalSoloEventLabel)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-400 text-black font-semibold"
                  >
                    I understand — Continue
                  </button>
                </div>
              </motion.div>
            </div>,
            document.body
          );
        })()
      }
    </section>
  );
}

/* -----------------------------
   IconInput COMPONENT
----------------------------- */
function IconInput({
  value,
  onChange,
  placeholder,
  Icon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  Icon?: JSX.Element;
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 w-6 h-6 flex items-center justify-center pointer-events-none z-10">
        {Icon}
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0f1724] border border-cyan-500/20 rounded-lg pl-12 pr-4 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
      />
    </div>
  );
}

/* -----------------------------
   INPUT FIELD COMPONENT
----------------------------- */
function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  placeholder: string;
  error?: string;
  icon?: JSX.Element;
}) {
  return (
    <div className="w-full">
      <label className="block text-xs md:text-sm mb-1 text-gray-300 font-medium tracking-wide">
        {label}
      </label>

      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 group-focus-within:text-cyan-300 transition-colors duration-200 w-5 h-5 flex items-center justify-center pointer-events-none z-10">
            {icon}
          </div>
        )}

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-transparent border border-cyan-500/40 rounded-lg py-3 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 ${icon ? "pl-12 pr-4" : "px-4"
            }`}
        />
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}