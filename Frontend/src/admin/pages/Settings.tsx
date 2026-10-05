import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import {
  Save, ToggleLeft, ToggleRight, CheckCircle2, QrCode,
  Calendar, MapPin, Sparkles, Trophy, Mail, Instagram,
  Linkedin, Shield, AlertCircle
} from "lucide-react";

function CompactField({
  label,
  value,
  onChange,
  type = "text",
  hint = "",
  placeholder = "",
}: {
  label: string;
  value: unknown;
  onChange: (val: string) => void;
  type?: string;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-space font-semibold text-slate-300 uppercase tracking-wider mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        // @ts-ignore
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input"
      />
      {hint && <p className="text-[10px] text-slate-500 mt-1 font-space">{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => setSettings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (key: string, value: unknown) =>
    setSettings((prev: Record<string, unknown>) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save settings", e);
      alert("Failed to save settings. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Header with Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron font-bold text-lg sm:text-xl text-white tracking-wide">
              GLOBAL FESTIVAL CONTROLS
            </h1>
            <span className="text-[10px] font-mono-matrix px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold">
              SYSTEM CONFIG
            </span>
          </div>
          <p className="text-slate-400 font-space text-xs mt-0.5">
            Configure registration switch, payment gateway, festival dates, and social links.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`btn-primary text-xs py-2 px-4 flex items-center gap-2 transition-all ${
              saved ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-emerald-500/20" : "shadow-cyan-500/20"
            }`}
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving Config..." : saved ? "Config Saved ✓" : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* 2. Master Registration Gate */}
      <div className="bg-slate-900/50 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              settings?.isRegistrationOpen
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                : "bg-rose-950/60 border-rose-500/40 text-rose-400"
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-sm text-white">
                MASTER REGISTRATION GATE
              </h2>
              <p className="text-slate-400 text-xs font-space mt-0.5">
                Current status:{" "}
                <span
                  className={`font-semibold ${
                    settings?.isRegistrationOpen ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {settings?.isRegistrationOpen ? "OPEN — Accepting registrations" : "CLOSED — Public forms disabled"}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => set("isRegistrationOpen", !settings?.isRegistrationOpen)}
            className="hover:scale-105 transition-transform self-start sm:self-auto"
          >
            {settings?.isRegistrationOpen ? (
              <ToggleRight className="w-9 h-9 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Two-Column Grid: Identity & Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Festival Identity */}
        <div className="bg-slate-900/50 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
              Festival Identity & Venue
            </h2>
          </div>

          <div className="space-y-3">
            <CompactField
              label="Fest Official Title"
              value={settings?.festName}
              onChange={(v) => set("festName", v)}
              placeholder="YUGANTRAN 3.0"
            />
            <CompactField
              label="Theme / Tagline"
              value={settings?.theme}
              onChange={(e) => set("theme", e)}
              placeholder="Annual Technical Fest of SCSE"
            />
            <CompactField
              label="Official Campus Venue"
              value={settings?.venue}
              onChange={(e) => set("venue", e)}
              placeholder="Main Auditorium & Lab Complex"
            />
            <CompactField
              label="Total Prize Pool Tag"
              value={settings?.totalPrizePool}
              onChange={(e) => set("totalPrizePool", e)}
              hint="Shown in hero & ribbons (e.g. ₹73,000+)"
              placeholder="₹73,000+"
            />
          </div>
        </div>

        {/* Schedule & Deadlines */}
        <div className="bg-slate-900/50 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h2 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
              Event Dates & Countdown Cutoff
            </h2>
          </div>

          <div className="space-y-3">
            <CompactField
              label="Event Start Date (ISO String)"
              value={settings?.eventDateStart}
              onChange={(v) => set("eventDateStart", v)}
              hint="e.g. 2026-10-27T09:00:00+05:30"
              placeholder="2026-10-27T09:00:00+05:30"
            />
            <CompactField
              label="Event End Date (ISO String)"
              value={settings?.eventDateEnd}
              onChange={(v) => set("eventDateEnd", v)}
              hint="e.g. 2026-10-28T17:00:00+05:30"
              placeholder="2026-10-28T17:00:00+05:30"
            />
            <CompactField
              label="Registration Cutoff Deadline (ISO)"
              value={settings?.registrationDeadline}
              onChange={(v) => set("registrationDeadline", v)}
              hint="Controls hero countdown timer deadline"
              placeholder="2026-10-26T23:59:59+05:30"
            />
          </div>
        </div>
      </div>

      {/* 4. Payment Gateway & QR Preview */}
      <div className="bg-slate-900/50 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <QrCode className="w-4 h-4 text-cyan-400" />
          <h2 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
            UPI Payment Gateway & QR Code
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2 space-y-3">
            <CompactField
              label="Festival UPI VPA ID"
              value={settings?.upiId}
              onChange={(v) => set("upiId", v)}
              hint="Candidates pay fees directly to this UPI address"
              placeholder="yugantran@okhdfcbank"
            />
            <CompactField
              label="Hosted QR Code Image URL"
              value={settings?.upiQrImageUrl}
              onChange={(v) => set("upiQrImageUrl", v)}
              hint="Direct link to hosted QR image file"
              placeholder="https://..."
            />
          </div>

          {/* QR Code Live Preview */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-space font-semibold text-slate-400 uppercase mb-2">
              Live QR Preview
            </span>
            {settings?.upiQrImageUrl ? (
              <img
                src={settings.upiQrImageUrl}
                alt="UPI QR Code"
                className="w-24 h-24 object-contain rounded-lg bg-white p-1 border border-cyan-500/30 shadow-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                <QrCode className="w-8 h-8" />
              </div>
            )}
            <span className="text-[10px] font-mono-matrix text-cyan-400 mt-2 truncate max-w-[150px]">
              {settings?.upiId || "No VPA ID"}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Contact & Social Handles */}
      <div className="bg-slate-900/50 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Mail className="w-4 h-4 text-cyan-400" />
          <h2 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
            Contact Channels & Social Media
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <CompactField
            label="Official Contact Email"
            value={settings?.contactEmail}
            onChange={(v) => set("contactEmail", v)}
            placeholder="yugantran.fest@gmail.com"
          />
          <CompactField
            label="Instagram URL"
            value={settings?.instagram}
            onChange={(v) => set("instagram", v)}
            placeholder="https://instagram.com/yugantran"
          />
          <CompactField
            label="LinkedIn URL"
            value={settings?.linkedin}
            onChange={(v) => set("linkedin", v)}
            placeholder="https://linkedin.com/company/yugantran"
          />
        </div>
      </div>
    </div>
  );
}
