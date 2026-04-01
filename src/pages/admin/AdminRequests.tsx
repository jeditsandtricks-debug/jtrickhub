import { useEffect, useState } from "react";
import { Check, X, Trash2, Film, Bug, MessageSquare, HelpCircle } from "lucide-react";
import { subscribeRequests, updateRequestStatus, deleteRequest } from "../../lib/db";
import type { UserRequest } from "../../types";

const TYPE_MAP: Record<string,{icon:any,color:string,label:string}> = {
  post_request:{icon:Film,color:"#6c5ce7",label:"Post Request"},
  bug_report:{icon:Bug,color:"#e50914",label:"Bug Report"},
  feedback:{icon:MessageSquare,color:"#00b894",label:"Feedback"},
  other:{icon:HelpCircle,color:"#888",label:"Other"},
};

export default function AdminRequests() {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [filter, setFilter] = useState<"all"|"pending"|"approved"|"rejected">("all");
  const [replyId, setReplyId] = useState<string|null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => { const unsub = subscribeRequests(setRequests); return ()=>unsub(); }, []);

  const filtered = filter==="all" ? requests : requests.filter(r=>r.status===filter);
  const pending = requests.filter(r=>r.status==="pending").length;

  const approve = async (r:UserRequest) => { await updateRequestStatus(r.id,"approved",replyId===r.id?replyText:undefined); setReplyId(null);setReplyText(""); };
  const reject = async (r:UserRequest) => { await updateRequestStatus(r.id,"rejected",replyId===r.id?replyText:undefined); setReplyId(null);setReplyText(""); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Requests</h1>
        {pending>0 && <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background:"#e50914" }}>{pending} Pending</span>}
      </div>
      <div className="flex gap-2 flex-wrap">
        {(["all","pending","approved","rejected"] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className="px-3 py-1.5 rounded-xl text-sm font-medium capitalize"
            style={{ background:filter===f?"var(--color-primary)":"var(--color-surface)", color:filter===f?"#fff":"var(--color-muted)", border:"1px solid #2a2a3a" }}>
            {f} ({f==="all"?requests.length:requests.filter(r=>r.status===f).length})
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(r => {
          const T = TYPE_MAP[r.type]||TYPE_MAP.other;
          const Icon = T.icon;
          return (
            <div key={r.id} className="p-4 rounded-2xl" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:T.color+"22" }}>
                  <Icon size={17} style={{ color:T.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color:"var(--color-text)" }}>{r.userName}</span>
                      <span className="cat-badge" style={{ background:T.color+"22", color:T.color }}>{T.label}</span>
                    </div>
                    <span className="text-xs" style={{ color:"var(--color-muted)" }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color:"var(--color-muted)" }}>{r.message}</p>
                  {r.adminReply && (
                    <div className="p-2 rounded-xl mb-2 text-xs" style={{ background:"var(--color-bg)", border:"1px solid #2a2a3a" }}>
                      <span className="font-bold" style={{ color:"var(--color-primary)" }}>Admin: </span>
                      <span style={{ color:"var(--color-muted)" }}>{r.adminReply}</span>
                    </div>
                  )}
                  {replyId===r.id && (
                    <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Reply (optional)..." rows={2}
                      className="input w-full resize-none text-xs mb-2" />
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                      style={{ background:r.status==="pending"?"#1a1a00":r.status==="approved"?"#112211":"#2a1111", color:r.status==="pending"?"#f39c12":r.status==="approved"?"#00b894":"#e50914" }}>
                      {r.status}
                    </span>
                    {r.status==="pending" && <>
                      {replyId!==r.id && <button onClick={()=>setReplyId(r.id)} className="text-xs px-2 py-1 rounded-lg hover:opacity-80" style={{ background:"var(--color-bg)", color:"var(--color-muted)", border:"1px solid #2a2a3a" }}>Reply</button>}
                      <button onClick={()=>approve(r)} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:opacity-80" style={{ background:"#112211", color:"#00b894" }}><Check size={11}/>Approve</button>
                      <button onClick={()=>reject(r)} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:opacity-80" style={{ background:"#2a1111", color:"#e50914" }}><X size={11}/>Reject</button>
                    </>}
                    <button onClick={()=>deleteRequest(r.id)} className="ml-auto p-1 hover:opacity-80" style={{ color:"#444" }}><Trash2 size={13}/></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <div className="py-12 text-center" style={{ color:"var(--color-muted)" }}>No requests.</div>}
      </div>
    </div>
  );
}
