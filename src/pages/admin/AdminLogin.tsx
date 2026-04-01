import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function AdminLogin() {
  const { settings } = useSettings();
  const [pw, setPw] = useState(""); const [show, setShow] = useState(false); const [err, setErr] = useState("");
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === settings.adminPassword) { sessionStorage.setItem("jtrick_admin","true"); window.dispatchEvent(new Event("focus")); navigate("/admin/dashboard"); }
    else setErr("Wrong password.");
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background:"var(--color-bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{ background:"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
            {settings.logoIcon||"⚡"}
          </div>
          <h1 className="text-2xl font-black" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{settings.siteName}</h1>
          <p className="text-sm mt-1" style={{ color:"var(--color-muted)" }}>Admin Login</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--color-muted)" }} />
            <input type={show?"text":"password"} value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="Admin password"
              className="w-full pl-9 pr-10 py-3 rounded-xl text-sm outline-none"
              style={{ background:"var(--color-surface)", color:"var(--color-text)", border:err?"1px solid #e50914":"1px solid #2a2a3a" }} />
            <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2">{show?<EyeOff size={15} style={{color:"var(--color-muted)"}}/>:<Eye size={15} style={{color:"var(--color-muted)"}}/>}</button>
          </div>
          {err && <p className="text-sm text-center" style={{ color:"#e50914" }}>{err}</p>}
          <button type="submit" className="w-full py-3 rounded-xl font-bold text-white" style={{ background:"linear-gradient(135deg, var(--color-primary), var(--color-accent))", fontFamily:"var(--font-display)" }}>Login</button>
        </form>
        <p className="text-center text-xs mt-4" style={{ color:"var(--color-muted)" }}>Default: <code className="px-1 rounded" style={{ background:"#1a1a2a" }}>admin123</code></p>
      </div>
    </div>
  );
}
