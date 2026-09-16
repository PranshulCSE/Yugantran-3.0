import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { Save, ToggleLeft, ToggleRight, Sparkles, CheckCircle2 } from "lucide-react";

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

  const set = (key: string, value: any) =>
    setSettings((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
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

  const Field = ({ label, field, type = "text", hint = "" }: any) => (
    <div>
      <label className="block font-space text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        value={settings?.[field] ?? ""}
        onChange={(e) => set(field, e.target.value)}
        className="admin-input"
      />
      {hint && <p className="text-slate-400 text-xs mt-1.5 font-space">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-wider">
            GLOBAL FESTIVAL CONTROLS
          </h1>
          <p className="text-slate-400 font-space text-sm mt-1">
            Configure live registration status, payment identifiers, dates, and festival metadata.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-xs py-3 px-6 flex items-center gap-2 self-start sm:self-auto shadow-cyan-500/30"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "SAVING CONFIG..." : saved ? "CONFIG SAVED ✓" : "SAVE ALL CHANGES"}</span>
        </button>
      </div>

      {/* 1. Master Registration Switch */}
      <div className="glass p-7 sm:p-8 rounded-3xl border-cyan-500/25 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-orbitron font-bold text-base text-white mb-1">
              MASTER REGISTRATION GATE
            </h2>
            <p className="text-slate-400 text-sm font-space">
              Current state:{" "}
              <span
                className={`font-bold ${
                  settings?.isRegistrationOpen ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {settings?.isRegistrationOpen ? "OPEN & ACCEPTING ENTRIES" : "CLOSED TO PUBLIC"}
              </span>
            </p>
          </div>

          <button onClick={() => set("isRegistrationOpen", !settings?.isRegistrationOpen)}>
            {settings?.isRegistrationOpen ? (
              <ToggleRight className="w-12 h-12 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-12 h-12 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Fest Information */}
      <div className="glass p-7 sm:p-8 rounded-3xl border-cyan-500/25 shadow-xl space-y-5">
        <h2 className="font-orbitron font-bold text-sm text-cyan-300 tracking-wider uppercase">
          FESTIVAL IDENTITY & VENUE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Fest Official Title" field="festName" />
          <Field label="Theme / Tagline" field="theme" />
          <Field label="Official Campus Venue" field="venue" />
          <Field label="Total Prize Pool Tag" field="totalPrizePool" hint="e.g. ₹73,000+" />
          <Field label="Event Start Date (ISO)" field="eventDateStart" hint="e.g. 2026-10-27T09:00:00+05:30" />
          <Field label="Event End Date (ISO)" field="eventDateEnd" hint="e.g. 2026-10-28T17:00:00+05:30" />
        </div>

        <Field
          label="Registration Cutoff Deadline (ISO)"
          field="registrationDeadline"
          hint="Countdown timer on hero calculates from this date"
        />
      </div>

      {/* 3. Payment Gateway Config */}
      <div className="glass p-7 sm:p-8 rounded-3xl border-cyan-500/25 shadow-xl space-y-5">
        <h2 className="font-orbitron font-bold text-sm text-cyan-300 tracking-wider uppercase">
          UPI PAYMENT GATEWAY & QR
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Fest UPI VPA ID" field="upiId" hint="e.g. yugantran@okhdfcbank" />
          <Field label="Hosted QR Code Image URL" field="upiQrImageUrl" hint="Paste direct link to QR image" />
        </div>
      </div>

      {/* 4. Contact & Socials */}
      <div className="glass p-7 sm:p-8 rounded-3xl border-cyan-500/25 shadow-xl space-y-5">
        <h2 className="font-orbitron font-bold text-sm text-cyan-300 tracking-wider uppercase">
          CONTACT INTEL & SOCIAL HANDLES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Contact Email" field="contactEmail" />
          <Field label="Instagram URL" field="instagram" />
          <Field label="LinkedIn URL" field="linkedin" />
        </div>
      </div>
    </div>
  );
}
