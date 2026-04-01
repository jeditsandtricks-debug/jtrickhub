import { Link } from "react-router-dom";
import { Eye, Heart, Bookmark, Clock, ExternalLink } from "lucide-react";
import type { Post, Category } from "../types";

interface Props { post: Post; category?: Category; compact?: boolean; }

export default function PostCard({ post, category, compact = false }: Props) {
  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff/86400000);
    if (days===0) return "Today";
    if (days===1) return "Yesterday";
    if (days<7) return `${days}d ago`;
    if (days<30) return `${Math.floor(days/7)}w ago`;
    return `${Math.floor(days/30)}mo ago`;
  };

  if (compact) return (
    <Link to={`/post/${post.id}`} className="post-card flex gap-3 p-3 rounded-xl hover:opacity-90 transition-all"
      style={{ background: "var(--color-surface)", border: "1px solid #1f1f2a" }}>
      {post.thumbnail && <img src={post.thumbnail} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" style={{ background: "#222" }} />}
      <div className="flex-1 min-w-0">
        {category && <span className="cat-badge mb-1" style={{ background: category.color+"22", color: category.color }}>{category.icon} {category.name}</span>}
        <h3 className="text-sm font-semibold line-clamp-2 mt-1" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>{post.title}</h3>
        <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{timeAgo(post.publishedAt)}</p>
      </div>
    </Link>
  );

  return (
    <Link to={`/post/${post.id}`} className="post-card flex flex-col rounded-2xl overflow-hidden group"
      style={{ background: "var(--color-surface)", border: "1px solid #1f1f2a" }}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {post.thumbnail
          ? <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
          : <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, var(--color-primary)22, var(--color-accent)22)" }}>
              {category?.icon || "📝"}
            </div>
        }
        {post.pinned && <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white" style={{ background: "var(--color-primary)" }}>📌 Pinned</span>}
        {post.embedUrl && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.5)" }}><div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: "var(--color-primary)" }}>▶</div></div>}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {category && (
          <span className="cat-badge mb-2 self-start" style={{ background: category.color+"22", color: category.color }}>
            {category.icon} {category.name}
          </span>
        )}
        <h2 className="font-bold text-sm line-clamp-2 mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>{post.title}</h2>
        {post.excerpt && <p className="text-xs line-clamp-2 mb-3 flex-1" style={{ color: "var(--color-muted)" }}>{post.excerpt}</p>}

        {/* Links preview */}
        {post.links && post.links.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.links.slice(0, 3).map((l, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium"
                style={{ background: "var(--color-accent)15", color: "var(--color-accent)", border: "1px solid var(--color-accent)30" }}>
                <ExternalLink size={10} />{l.label}
              </span>
            ))}
            {post.links.length > 3 && <span className="text-xs" style={{ color: "var(--color-muted)" }}>+{post.links.length-3}</span>}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid #1f1f2a" }}>
          <span className="text-xs" style={{ color: "var(--color-muted)" }}>{timeAgo(post.publishedAt)}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-muted)" }}><Eye size={12} />{post.views||0}</span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-muted)" }}><Heart size={12} />{post.likes?.length||0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
