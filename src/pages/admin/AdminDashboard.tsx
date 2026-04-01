import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Users, MessageSquare, Eye, Heart, Plus, TrendingUp } from "lucide-react";
import { subscribePosts, subscribeUsers, subscribeRequests } from "../../lib/db";
import type { Post, UserProfile, UserRequest } from "../../types";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<UserRequest[]>([]);

  useEffect(() => {
    const u1 = subscribePosts(setPosts);
    const u2 = subscribeUsers(setUsers);
    const u3 = subscribeRequests(setRequests);
    return () => { u1(); u2(); u3(); };
  }, []);

  const totalViews = posts.reduce((a,p) => a+(p.views||0), 0);
  const totalLikes = posts.reduce((a,p) => a+(p.likes?.length||0), 0);
  const pendingReqs = requests.filter(r => r.status==="pending").length;
  const published = posts.filter(p => p.status==="published").length;

  const STATS = [
    { icon:FileText,    label:"Published Posts",  value:published,               color:"#6c5ce7", link:"/admin/posts" },
    { icon:Users,       label:"Total Users",       value:users.length,            color:"#00b894", link:"/admin/users" },
    { icon:Eye,         label:"Total Views",       value:totalViews.toLocaleString(), color:"#0071eb", link:null },
    { icon:Heart,       label:"Total Likes",       value:totalLikes,              color:"#e84393", link:null },
    { icon:MessageSquare,label:"Pending Requests", value:pendingReqs,             color:"#f39c12", link:"/admin/requests" },
  ];

  const recent = posts.slice(0,6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Dashboard</h1>
        <Link to="/admin/posts/new" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90"
          style={{ background:"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
          <Plus size={16} /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATS.map(({ icon:Icon, label, value, color, link }) => {
          const card = (
            <div className="p-4 rounded-2xl" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background:color+"22" }}>
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-2xl font-black" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color:"var(--color-muted)" }}>{label}</p>
            </div>
          );
          return link
            ? <Link to={link} key={label} className="hover:scale-105 transition-transform block">{card}</Link>
            : <div key={label}>{card}</div>;
        })}
      </div>

      {/* Recent Posts */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid #1f1f2a" }}>
          <h2 className="font-bold" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Recent Posts</h2>
          <Link to="/admin/posts" className="text-sm hover:underline" style={{ color:"var(--color-primary)" }}>All posts →</Link>
        </div>
        <div className="divide-y" style={{ borderColor:"#1f1f2a" }}>
          {recent.map(p => (
            <div key={p.id} className="px-5 py-3 flex items-center gap-3">
              {p.thumbnail
                ? <img src={p.thumbnail} alt="" className="w-12 h-8 object-cover rounded-lg shrink-0" style={{ background:"#222" }} />
                : <div className="w-12 h-8 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background:"var(--color-bg)" }}>{p.category==="tech-tips"?"💡":p.category==="apks"?"📱":"📝"}</div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color:"var(--color-text)" }}>{p.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs" style={{ color:"var(--color-muted)" }}>{p.category}</span>
                  <span className="text-xs flex items-center gap-0.5" style={{ color:"var(--color-muted)" }}><Eye size={11}/>{p.views||0}</span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
                style={{ background:p.status==="published"?"#00b89422":"#f39c1222", color:p.status==="published"?"#00b894":"#f39c12" }}>
                {p.status}
              </span>
              <Link to={`/admin/posts/edit/${p.id}`} className="text-xs px-2 py-1 rounded-lg shrink-0 hover:opacity-80"
                style={{ background:"var(--color-bg)", color:"var(--color-muted)", border:"1px solid #2a2a3a" }}>Edit</Link>
            </div>
          ))}
          {recent.length===0 && (
            <div className="px-5 py-10 text-center" style={{ color:"var(--color-muted)" }}>
              No posts yet. <Link to="/admin/posts/new" style={{ color:"var(--color-primary)" }}>Create your first →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"New Post", to:"/admin/posts/new", icon:"✍️" },
          { label:"Categories", to:"/admin/categories", icon:"📂" },
          { label:"Theme", to:"/admin/theme", icon:"🎨" },
          { label:"Settings", to:"/admin/settings", icon:"⚙️" },
        ].map(a => (
          <Link key={a.label} to={a.to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl text-sm font-semibold text-center hover:opacity-80 transition-opacity"
            style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a", color:"var(--color-text)" }}>
            <span className="text-2xl">{a.icon}</span>{a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
