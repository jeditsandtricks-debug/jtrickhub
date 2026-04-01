import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, Eye, Heart, Pin } from "lucide-react";
import { subscribePosts, deletePost, subscribeCategories } from "../../lib/db";
import type { Post, Category } from "../../types";

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const u1 = subscribePosts(setPosts);
    const u2 = subscribeCategories(setCats);
    return () => { u1(); u2(); };
  }, []);

  const catMap = Object.fromEntries(cats.map(c=>[c.id,c]));

  const filtered = posts.filter(p => {
    const ms = p.title.toLowerCase().includes(search.toLowerCase());
    const mc = filterCat ? p.category===filterCat : true;
    const mst = filterStatus ? p.status===filterStatus : true;
    return ms && mc && mst;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    await deletePost(id);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Posts</h1>
        <Link to="/admin/posts/new" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90"
          style={{ background:"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
          <Plus size={16} /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--color-muted)" }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{ background:"var(--color-surface)", color:"var(--color-text)", border:"1px solid #2a2a3a" }} />
        </div>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm outline-none"
          style={{ background:"var(--color-surface)", color:"var(--color-text)", border:"1px solid #2a2a3a" }}>
          <option value="">All Categories</option>
          {cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm outline-none"
          style={{ background:"var(--color-surface)", color:"var(--color-text)", border:"1px solid #2a2a3a" }}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom:"1px solid #1f1f2a", color:"var(--color-muted)" }}>
                <th className="text-left px-4 py-3 font-medium">Post</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Views</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Likes</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cat = catMap[p.category];
                return (
                  <tr key={p.id} style={{ borderBottom:"1px solid #1a1a2a" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.thumbnail
                          ? <img src={p.thumbnail} alt="" className="w-14 h-9 object-cover rounded-lg shrink-0" style={{ background:"#222" }} />
                          : <div className="w-14 h-9 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ background:"var(--color-bg)" }}>{cat?.icon||"📝"}</div>
                        }
                        <div className="min-w-0">
                          <p className="font-semibold text-xs truncate max-w-[160px]" style={{ color:"var(--color-text)" }}>{p.title}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {p.pinned && <span className="text-xs" style={{ color:"var(--color-primary)" }}>📌</span>}
                            {p.featured && <span className="text-xs" style={{ color:"#f39c12" }}>⭐</span>}
                            {p.links?.length>0 && <span className="text-xs" style={{ color:"var(--color-muted)" }}>{p.links.length} links</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {cat && <span className="cat-badge" style={{ background:cat.color+"22", color:cat.color }}>{cat.icon} {cat.name}</span>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="flex items-center gap-1 text-xs" style={{ color:"var(--color-muted)" }}><Eye size={11}/>{p.views||0}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="flex items-center gap-1 text-xs" style={{ color:"var(--color-muted)" }}><Heart size={11}/>{p.likes?.length||0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background:p.status==="published"?"#00b89422":"#f39c1222", color:p.status==="published"?"#00b894":"#f39c12" }}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/post/${p.id}`} target="_blank" className="p-1.5 rounded-lg hover:opacity-80" style={{ background:"#1f1f2a", color:"var(--color-muted)" }}>
                          <Eye size={13} />
                        </Link>
                        <Link to={`/admin/posts/edit/${p.id}`} className="p-1.5 rounded-lg hover:opacity-80" style={{ background:"#1f1f2a", color:"var(--color-muted)" }}>
                          <Pencil size={13} />
                        </Link>
                        <button onClick={()=>handleDelete(p.id)} className="p-1.5 rounded-lg hover:opacity-80" style={{ background:"#2a1111", color:"#e50914" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div className="py-12 text-center" style={{ color:"var(--color-muted)" }}>
              No posts found. <Link to="/admin/posts/new" style={{ color:"var(--color-primary)" }}>Create one →</Link>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs" style={{ color:"var(--color-muted)" }}>{filtered.length} of {posts.length} posts</p>
    </div>
  );
}
