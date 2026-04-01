import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useSettings } from "../context/SettingsContext";
import { Zap } from "lucide-react";

export function UserNameModal() {
  const { setName } = useUser();
  const { settings } = useSettings();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = input.trim();
    if (n.length < 2) return;
    setLoading(true);
    await setName(n);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)" }}>
      <div className="w-full max-w-sm rounded-2xl p-7" style={{ background: "var(--color-surface)", border: "1px solid #2a2a3a" }}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
            {settings.logoIcon || "⚡"}
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>Welcome!</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>Enter your name to explore {settings.siteName}</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Your name..." autoFocus maxLength={30}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "var(--color-bg)", color: "var(--color-text)", border: "1px solid #2a2a3a" }} />
          <button type="submit" disabled={loading || input.trim().length < 2}
            className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", fontFamily: "var(--font-display)" }}>
            {loading ? "Joining..." : "Let's Go 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function BlockedScreen() {
  const { settings } = useSettings();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}>Access Blocked</h1>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>Contact admin for support.</p>
      </div>
    </div>
  );
}
