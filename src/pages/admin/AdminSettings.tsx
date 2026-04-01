// src/pages/admin/AdminSettings.tsx  ← REPLACE your existing AdminSettings.tsx

import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { Save, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function AdminSettings() {
  const { settings, update } = useSettings();
  const [saved, setSaved] = useState(false);

  // Site info
  const [siteName, setSiteName]           = useState(settings.siteName || "J Trick Hub");
  const [logoEmoji, setLogoEmoji]         = useState(settings.logoEmoji || "⚡");
  const [tagline, setTagline]             = useState(settings.tagline || "Tech Tips, Free Apps, Tricks & Much More 🚀");
  const [announcement, setAnnouncement]   = useState(settings.announcement || "");
  const [maintenanceMode, setMaintenance] = useState(settings.maintenanceMode || false);
  const [requireUserName, setRequireUser] = useState(settings.requireUserName || false);

  // Password
  const [oldPw, setOldPw]       = useState("");
  const [newPw, setNewPw]       = useState("");
  const [confirmPw, setConfirm] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [pwMsg, setPwMsg]       = useState("");

  // Custom CSS
  const [customCSS, setCustomCSS] = useState(settings.customCSS || "");

  const saveSettings = async () => {
    await update({
      siteName, logoEmoji, tagline,
      announcement, maintenanceMode, requireUserName,
      customCSS,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = () => {
    const current = localStorage.getItem("jtrick_admin_pw") || "admin123";
    if (oldPw !== current) { setPwMsg("❌ Current password is wrong."); return; }
    if (newPw.length < 4)   { setPwMsg("❌ New password must be 4+ chars."); return; }
    if (newPw !== confirmPw) { setPwMsg("❌ Passwords don't match."); return; }
    localStorage.setItem("jtrick_admin_pw", newPw);
    setPwMsg("✅ Password changed successfully!");
    setOldPw(""); setNewPw(""); setConfirm("");
    setTimeout(() => setPwMsg(""), 3000);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl border p-5 space-y-4" style={{ background: "var(--color-surface)", borderColor: "#2a2a3a" }}>
      <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>{title}</h3>
      {children}
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="p-6 max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black gradient-text" style={{ fontFamily: "var(--font-display)" }}>Settings</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>Manage all website settings</p>
        </div>
        <button onClick={saveSettings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
          {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      {/* Site Info */}
      <Section title="🌐 Site Information">
        <Field label="Site Name">
          <input className="input w-full" value={siteName} onChange={e => setSiteName(e.target.value)} />
        </Field>
        <Field label="Logo Emoji">
          <input className="input w-24" value={logoEmoji} onChange={e => setLogoEmoji(e.target.value)} placeholder="⚡" />
        </Field>
        <Field label="Tagline / Hero subtitle">
          <input className="input w-full" value={tagline} onChange={e => setTagline(e.target.value)} />
        </Field>
        <Field label="Announcement Bar (leave empty to hide)">
          <input className="input w-full" value={announcement} onChange={e => setAnnouncement(e.target.value)}
            placeholder="🔥 New post dropped! Check it out..." />
        </Field>
      </Section>

      {/* Toggles */}
      <Section title="⚙️ Site Controls">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Maintenance Mode</p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>Show maintenance page to all users</p>
          </div>
          <button onClick={() => setMaintenance(!maintenanceMode)}
            className={`w-12 h-6 rounded-full transition-all relative ${maintenanceMode ? "bg-orange-500" : "bg-white/10"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${maintenanceMode ? "left-6" : "left-0.5"}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Require User Name</p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>Ask visitors to enter their name before browsing</p>
          </div>
          <button onClick={() => setRequireUser(!requireUserName)}
            className={`w-12 h-6 rounded-full transition-all relative ${requireUserName ? "" : "bg-white/10"}`}
            style={requireUserName ? { background: "var(--color-primary)" } : {}}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${requireUserName ? "left-6" : "left-0.5"}`} />
          </button>
        </div>
      </Section>

      {/* Custom CSS */}
      <Section title="🎨 Custom CSS">
        <Field label="Inject custom CSS into the site">
          <textarea
            className="input w-full font-mono text-xs"
            rows={8}
            value={customCSS}
            onChange={e => setCustomCSS(e.target.value)}
            placeholder="/* your custom CSS here */&#10;.post-card { border-radius: 20px; }"
          />
        </Field>
      </Section>

      {/* Change Password */}
      <Section title="🔒 Change Admin Password">
        <Field label="Current Password">
          <div className="relative">
            <input type={showPw ? "text" : "password"} className="input w-full pr-9"
              value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="Current password" />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-muted)" }} onClick={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>
        <Field label="New Password">
          <input type={showPw ? "text" : "password"} className="input w-full"
            value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password (min 4 chars)" />
        </Field>
        <Field label="Confirm New Password">
          <input type={showPw ? "text" : "password"} className="input w-full"
            value={confirmPw} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" />
        </Field>
        {pwMsg && (
          <p className="text-xs px-3 py-2 rounded-lg"
            style={{ background: pwMsg.startsWith("✅") ? "#00cec920" : "#ff000020", color: pwMsg.startsWith("✅") ? "#00cec9" : "#ff6b6b" }}>
            {pwMsg}
          </p>
        )}
        <button onClick={changePassword}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--color-primary)" }}>
          Update Password
        </button>
      </Section>
    </div>
  );
}
