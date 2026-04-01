import { useState } from "react";
import { Save } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { FONT_PRESETS, FESTIVAL_ICONS, ICON_CATS } from "../../lib/db";

const COLOR_THEMES = [
  { name:"Purple Tech",  primary:"#6c5ce7", accent:"#00cec9" },
  { name:"Neon Green",   primary:"#00b894", accent:"#00cec9" },
  { name:"Fire Red",     primary:"#e50914", accent:"#f39c12" },
  { name:"Ocean Blue",   primary:"#0071eb", accent:"#00cec9" },
  { name:"Pink Cyber",   primary:"#e84393", accent:"#a29bfe" },
  { name:"Gold Black",   primary:"#f39c12", accent:"#fdcb6e" },
  { name:"Midnight",     primary:"#a29bfe", accent:"#6c5ce7" },
  { name:"Teal Fresh",   primary:"#00cec9", accent:"#55efc4" },
];

export default function AdminTheme() {
  const { settings, update } = useSettings();
  const [local, setLocal] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [iconCat, setIconCat] = useState("Tech");

  const setL = (k: string, v: any) => setLocal(prev => ({ ...prev, [k]: v }));

  async function handleSave() {
    setSaving(true);
    await update(local);
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-black" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Theme & Fonts</h1>

      {/* Theme Mode */}
      <Section title="🌙 Theme Mode">
        <div className="grid grid-cols-3 gap-3">
          {(["dark","amoled","light"] as const).map(t => (
            <button key={t} onClick={()=>setL("theme",t)} className="py-3 rounded-xl text-sm font-bold capitalize transition-all"
              style={{ background:local.theme===t?"var(--color-primary)":"var(--color-bg)", color:local.theme===t?"#fff":"var(--color-muted)", border:local.theme===t?"2px solid var(--color-primary)":"1px solid #2a2a3a" }}>
              {t==="dark"?"🌑 Dark":t==="amoled"?"⬛ AMOLED":"☀️ Light"}
            </button>
          ))}
        </div>
      </Section>

      {/* Color Presets */}
      <Section title="🎨 Color Theme">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {COLOR_THEMES.map(t => (
            <button key={t.name} onClick={()=>{setL("colorPrimary",t.primary);setL("colorAccent",t.accent);}}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:scale-105 transition-all"
              style={{ border:"1px solid #2a2a3a", background:"var(--color-bg)" }}>
              <div className="flex gap-1">
                <div className="w-6 h-6 rounded-full" style={{ background:t.primary }} />
                <div className="w-6 h-6 rounded-full" style={{ background:t.accent }} />
              </div>
              <span className="text-xs" style={{ color:"var(--color-muted)" }}>{t.name}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={local.colorPrimary} onChange={e=>setL("colorPrimary",e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
              <input value={local.colorPrimary} onChange={e=>setL("colorPrimary",e.target.value)} className="input flex-1 font-mono text-xs" />
            </div>
          </div>
          <div>
            <label className="label">Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={local.colorAccent} onChange={e=>setL("colorAccent",e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
              <input value={local.colorAccent} onChange={e=>setL("colorAccent",e.target.value)} className="input flex-1 font-mono text-xs" />
            </div>
          </div>
        </div>
      </Section>

      {/* Logo Icon */}
      <Section title="✨ Logo Icon (Festival / Seasonal)">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{local.logoIcon||"⚡"}</span>
          <p className="text-sm" style={{ color:"var(--color-muted)" }}>Showing on Navbar & site icon</p>
        </div>
        <div className="flex gap-2 mb-3">
          {ICON_CATS.map(c=>(
            <button key={c} onClick={()=>setIconCat(c)} className="px-3 py-1 rounded-lg text-xs font-semibold"
              style={{ background:iconCat===c?"var(--color-primary)":"var(--color-bg)", color:iconCat===c?"#fff":"var(--color-muted)", border:"1px solid #2a2a3a" }}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-1.5 max-h-36 overflow-y-auto">
          {FESTIVAL_ICONS.filter(f=>f.cat===iconCat).map(f=>(
            <button key={f.icon} onClick={()=>setL("logoIcon",f.icon)} title={f.name}
              className="w-9 h-9 rounded-xl text-xl flex items-center justify-center hover:scale-110 transition-transform"
              style={{ background:local.logoIcon===f.icon?"var(--color-primary)33":"var(--color-bg)", border:local.logoIcon===f.icon?"2px solid var(--color-primary)":"1px solid #2a2a3a" }}>
              {f.icon}
            </button>
          ))}
        </div>
      </Section>

      {/* Font Presets */}
      <Section title="🔤 Font Presets">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {FONT_PRESETS.map(f=>(
            <button key={f.display} onClick={()=>{setL("fontDisplay",f.display);setL("fontBody",f.body);setL("googleFontsUrl",f.url);}}
              className="p-3 rounded-xl border text-left hover:scale-105 transition-all"
              style={{ border:local.fontDisplay===f.display?"2px solid var(--color-primary)":"1px solid #2a2a3a", background:"var(--color-bg)" }}>
              <p className="text-sm font-bold" style={{ fontFamily:`'${f.display}',sans-serif`, color:"var(--color-text)" }}>{f.display}</p>
              <p className="text-xs" style={{ fontFamily:`'${f.body}',sans-serif`, color:"var(--color-muted)" }}>{f.body}</p>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Display Font</label><input value={local.fontDisplay} onChange={e=>setL("fontDisplay",e.target.value)} className="input w-full" /></div>
          <div><label className="label">Body Font</label><input value={local.fontBody} onChange={e=>setL("fontBody",e.target.value)} className="input w-full" /></div>
        </div>
        <div><label className="label">Google Fonts URL</label><input value={local.googleFontsUrl} onChange={e=>setL("googleFontsUrl",e.target.value)} className="input w-full text-xs font-mono" /></div>
      </Section>

      {/* Live Preview */}
      <Section title="👁️ Live Preview">
        <div className="p-4 rounded-xl" style={{ background:local.theme==="light"?"#f0f0f5":"#0a0a0f" }}>
          <h2 className="font-black text-2xl mb-1" style={{ fontFamily:`'${local.fontDisplay}',sans-serif`, background:`linear-gradient(135deg, ${local.colorPrimary}, ${local.colorAccent})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {settings.siteName}
          </h2>
          <p style={{ fontFamily:`'${local.fontBody}',sans-serif`, color:local.theme==="light"?"#555":"#888", fontSize:"13px" }}>{settings.siteTagline}</p>
          <button className="mt-3 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background:local.colorPrimary, fontFamily:`'${local.fontDisplay}',sans-serif` }}>Read More</button>
        </div>
      </Section>

      <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
        style={{ background:saved?"#00b894":"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
        <Save size={16}/>{saving?"Saving...":saved?"✓ Theme Applied!":"Apply & Save Theme"}
      </button>
    </div>
  );
}
function Section({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
      <h3 className="font-bold text-sm" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{title}</h3>
      {children}
    </div>
  );
}
