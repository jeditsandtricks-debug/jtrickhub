import { useEffect, useState } from "react";
import { Search, Shield, ShieldOff, Clock, Eye, BookMarked } from "lucide-react";
import { subscribeUsers, blockUser, unblockUser } from "../../lib/db";
import type { UserProfile } from "../../types";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all"|"blocked">("all");

  useEffect(() => { const unsub = subscribeUsers(setUsers); return ()=>unsub(); }, []);

  const ago = (d?:string) => { if(!d) return "-"; const m=Math.floor((Date.now()-new Date(d).getTime())/60000); return m<1?"Just now":m<60?`${m}m ago`:m<1440?`${Math.floor(m/60)}h ago`:`${Math.floor(m/1440)}d ago`; };

  const filtered = users.filter(u => {
    const ms = u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.uid.includes(search);
    const mf = filter==="blocked" ? u.isBlocked : true;
    return ms && mf;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Users</h1>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background:"var(--color-primary)" }}>{users.length} Total</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--color-muted)" }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or ID..."
            className="input w-full pl-9" />
        </div>
        <div className="flex gap-2">
          {(["all","blocked"] as const).map(f => (
            <button key={f} onClick={()=>setFilter(f)} className="px-3 py-2 rounded-xl text-sm font-medium capitalize"
              style={{ background:filter===f?"var(--color-primary)":"var(--color-surface)", color:filter===f?"#fff":"var(--color-muted)", border:"1px solid #2a2a3a" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ borderBottom:"1px solid #1f1f2a", color:"var(--color-muted)" }}>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Joined</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Last Seen</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Read</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Saved</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.uid} style={{ borderBottom:"1px solid #1a1a2a" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                        style={{ background:u.isBlocked?"#555":"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                        {u.displayName?.[0]?.toUpperCase()||"?"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color:u.isBlocked?"var(--color-muted)":"var(--color-text)" }}>{u.displayName||"Unknown"}</p>
                        <p className="text-xs font-mono" style={{ color:"var(--color-muted)" }}>{u.uid.slice(0,14)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs" style={{ color:"var(--color-muted)" }}>{u.createdAt?new Date(u.createdAt).toLocaleDateString():"-"}</td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="flex items-center gap-1 text-xs" style={{ color:"var(--color-muted)" }}><Clock size={11}/>{ago(u.lastSeen)}</span></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className="flex items-center gap-1 text-xs" style={{ color:"var(--color-muted)" }}><Eye size={11}/>{u.readHistory?.length||0}</span></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className="flex items-center gap-1 text-xs" style={{ color:"var(--color-muted)" }}><BookMarked size={11}/>{u.bookmarks?.length||0}</span></td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background:u.isBlocked?"#2a1111":"#112211", color:u.isBlocked?"#e50914":"#00b894" }}>
                      {u.isBlocked?"Blocked":"Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {u.isBlocked
                        ? <button onClick={()=>unblockUser(u.uid)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium hover:opacity-80" style={{ background:"#112211", color:"#00b894" }}><Shield size={12}/> Unblock</button>
                        : <button onClick={()=>confirm(`Block ${u.displayName}?`)&&blockUser(u.uid)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium hover:opacity-80" style={{ background:"#2a1111", color:"#e50914" }}><ShieldOff size={12}/> Block</button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="py-12 text-center text-sm" style={{ color:"var(--color-muted)" }}>No users yet.</div>}
        </div>
      </div>
    </div>
  );
}
