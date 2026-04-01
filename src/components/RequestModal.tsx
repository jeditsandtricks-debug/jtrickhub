import { useState } from "react";
import { X, Send } from "lucide-react";
import { useUser } from "../context/UserContext";
import { submitRequest } from "../lib/db";

export default function RequestModal({ onClose }: { onClose: () => void }) {
  const { uid, name } = useUser();
  const [type, setType] = useState<"post_request"|"bug_report"|"feedback"|"other">("post_request");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    setLoading(true);
    await submitRequest({ uid, userName: name, type, message: msg, status:"pending", createdAt: new Date().toISOString() });
    setLoading(false); setSent(true);
    setTimeout(onClose, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)" }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background:"var(--color-surface)", border:"1px solid #2a2a3a" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Send Request</h2>
          <button onClick={onClose} style={{ color:"var(--color-muted)" }}><X size={20} /></button>
        </div>
        {sent ? (
          <div className="text-center py-8"><div className="text-4xl mb-3">✅</div>
            <p className="font-semibold" style={{ color:"var(--color-text)" }}>Sent! Admin will review soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {([["post_request","📝 Post Request"],["bug_report","🐛 Bug Report"],["feedback","💬 Feedback"],["other","📌 Other"]] as const).map(([v,l]) => (
                <button key={v} type="button" onClick={() => setType(v as any)}
                  className="py-2 px-3 rounded-xl text-xs font-medium text-left"
                  style={{ background: type===v ? "var(--color-primary)" : "var(--color-bg)", color: type===v ? "#fff" : "var(--color-muted)", border: type===v ? "2px solid var(--color-primary)" : "1px solid #2a2a3a" }}>
                  {l}
                </button>
              ))}
            </div>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} required rows={4}
              placeholder={type==="post_request" ? "Which topic or app do you want a post about?" : "Describe..."}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{ background:"var(--color-bg)", color:"var(--color-text)", border:"1px solid #2a2a3a" }} />
            <button type="submit" disabled={loading || !msg.trim()}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background:"linear-gradient(135deg, var(--color-primary), var(--color-accent))", fontFamily:"var(--font-display)" }}>
              <Send size={16} />{loading ? "Sending..." : "Send Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
