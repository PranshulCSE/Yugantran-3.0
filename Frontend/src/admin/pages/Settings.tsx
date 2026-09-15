import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import { Save, ToggleLeft, ToggleRight } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getSettings()
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
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const Field = ({ label, field, type = "text", hint = "" }: any) => (
    <div>
      <label className="block font-mono-matrix text-xs text-[rgba(176,255,176,0.45)] tracking-widest mb-2">{label}</label>
      <input
        type={type}
        value={settings?.[field] ?? ""}
        onChange={(e) => set(field, e.target.value)}
        className="admin-input"
      />
      {hint && <p className="text-[rgba(176,255,176,0.3)] text-xs mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-orbitron text-2xl text-[#00ff41] tracking-widest">SETTINGS</h1>
          <p className="text-[rgba(176,255,176,0.35)] font-mono-matrix text-sm mt-1">Global fest configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 py-2 px-5">
          <Save className="w-4 h-4" />
          {saving ? "SAVING..." : saved ? "✓ SAVED" : "SAVE CHANGES"}
        </button>
      </div>

      {/* Registration Status */}
      <div className="admin-card p-6 rounded-xl">
        <h2 className="font-orbitron text-sm text-[#00ff41] tracking-widest mb-4">REGISTRATION STATUS</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#b0ffb0] font-medium">
              Registration is currently{" "}
              <span className={settings?.isRegistrationOpen ? "text-[#00ff41]" : "text-[#ff6666]"}>
                {settings?.isRegistrationOpen ? "OPEN" : "CLOSED"}
              </span>
            </p>
            <p className="text-[rgba(176,255,176,0.4)] text-sm mt-1">
              Toggle to open or close registrations for all events instantly.
            </p>
          </div>
          <button onClick={() => set("isRegistrationOpen", !settings?.isRegistrationOpen)}>
            {settings?.isRegistrationOpen
              ? <ToggleRight className="w-12 h-12 text-[#00ff41]" />
              : <ToggleLeft className="w-12 h-12 text-[rgba(176,255,176,0.25)]" />}
          </button>
        </div>
      </div>

      {/* Fest Info */}
      <div className="admin-card p-6 rounded-xl space-y-4">
        <h2 className="font-orbitron text-sm text-[#00ff41] tracking-widest mb-2">FEST INFORMATION</h2>
        <Field label="Fest Name" field="festName" />
        <Field label="Theme / Tagline" field="theme" />
        <Field label="Venue" field="venue" />
        <Field label="Total Prize Pool" field="totalPrizePool" hint="e.g. ₹73,000+" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Event Start (ISO)" field="eventDateStart" hint="e.g. 2026-10-27T09:00:00+05:30" />
          <Field label="Event End (ISO)" field="eventDateEnd" hint="e.g. 2026-10-28T17:00:00+05:30" />
        </div>
        <Field label="Registration Deadline (ISO)" field="registrationDeadline" />
      </div>

      {/* Payment */}
      <div className="admin-card p-6 rounded-xl space-y-4">
        <h2 className="font-orbitron text-sm text-[#00ff41] tracking-widest mb-2">PAYMENT</h2>
        <Field label="UPI ID" field="upiId" hint="e.g. yugantran@upi" />
        <Field label="UPI QR Image URL" field="upiQrImageUrl" hint="Paste URL of hosted QR code image" />
      </div>

      {/* Contact & Social */}
      <div className="admin-card p-6 rounded-xl space-y-4">
        <h2 className="font-orbitron text-sm text-[#00ff41] tracking-widest mb-2">CONTACT & SOCIAL</h2>
        <Field label="Contact Email" field="contactEmail" />
        <Field label="Instagram URL" field="instagram" />
        <Field label="LinkedIn URL" field="linkedin" />
      </div>
    </div>
  );
}
