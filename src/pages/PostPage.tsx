import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, Heart, Bookmark, Share2, ExternalLink, Download, Clock, Tag } from "lucide-react";
import { getPost, incrementPostViews, toggleLike, toggleBookmark, subscribeCategories } from "../lib/db";
import { useUser } from "../context/UserContext";
import { useSettings } from "../context/SettingsContext";
import type { Post, Category } from "../types";

const LINK_ICONS: Record<string, string> = { download:"⬇️", external:"🔗", telegram:"✈️", drive:"📁", apk:"📱", website:"🌐" };
const LINK_COLORS: Record<string, string> = { download:"#00b894", external:"#6c5ce7", telegram:"#0088cc", drive:"#f39c12", apk:"#e17055", website:"#00cec9" };

export default function PostPage() {
  const { id } = useParams();
  const { uid } = useUser();
  const { settings } = useSettings();
  const [post, setPost] = useState<Post | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPost(id).then(p => {
      setPost(p);
      if (p) { incrementPostViews(id); setLiked(p.likes?.includes(uid)||false); }
    });
    const unsub = subscribeCategories(setCats);
    return () => unsub();
  }, [id]);

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"var(--color-bg)" }}>
      <div className="text-4xl animate-pulse">⚡</div>
    </div>
  );

  const cat = cats.find(c => c.id === post.category);
  const timeAgo = (d: string) => { const diff=Date.now()-new Date(d).getTime(); const days=Math.floor(diff/86400000); return days===0?"Today":days===1?"Yesterday":`${days} days ago`; };

  async function handleLike() {
    const result = await toggleLike(post.id);
    setLiked(result);
    setPost(p => p ? { ...p, likes: result ? [...(p.likes||[]),uid] : (p.likes||[]).filter(u=>u!==uid) } : p);
  }

  async function handleBookmark() {
    const result = await toggleBookmark(post.id);
    setBookmarked(result);
  }

  function getYouTubeId(url: string) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
    return m ? m[1] : null;
  }

  return (
    <div style={{ background:"var(--color-bg)", minHeight:"100vh" }}>
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline" style={{ color:"var(--color-muted)" }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="w-full rounded-2xl overflow-hidden mb-6" style={{ aspectRatio:"16/9" }}>
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          {cat && (
            <Link to={`/category/${cat.id}`} className="cat-badge mb-3 inline-flex" style={{ background:cat.color+"22", color:cat.color }}>
              {cat.icon} {cat.name}
            </Link>
          )}
          <h1 className="text-2xl md:text-4xl font-black mb-3" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{post.title}</h1>
          {post.excerpt && <p className="text-base mb-4" style={{ color:"var(--color-muted)" }}>{post.excerpt}</p>}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-sm" style={{ color:"var(--color-muted)" }}>
              <span className="flex items-center gap-1"><Clock size={13} />{timeAgo(post.publishedAt)}</span>
              <span className="flex items-center gap-1"><Eye size={13} />{post.views||0} views</span>
              <span className="flex items-center gap-1"><Heart size={13} />{post.likes?.length||0} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleLike} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: liked?"var(--color-primary)":"var(--color-surface)", color: liked?"#fff":"var(--color-muted)", border:"1px solid #2a2a3a" }}>
                <Heart size={14} fill={liked?"currentColor":"none"} /> {liked?"Liked":"Like"}
              </button>
              <button onClick={handleBookmark} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: bookmarked?"var(--color-accent)":"var(--color-surface)", color: bookmarked?"#fff":"var(--color-muted)", border:"1px solid #2a2a3a" }}>
                <Bookmark size={14} fill={bookmarked?"currentColor":"none"} /> {bookmarked?"Saved":"Save"}
              </button>
              <button onClick={() => navigator.share?.({ title:post.title, url:window.location.href })}
                className="p-1.5 rounded-xl" style={{ background:"var(--color-surface)", color:"var(--color-muted)", border:"1px solid #2a2a3a" }}>
                <Share2 size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Embed Video */}
            {post.embedUrl && post.embedType !== "none" && (
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio:"16/9" }}>
                {post.embedType==="youtube"
                  ? <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${getYouTubeId(post.embedUrl)||post.embedUrl}?rel=0`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  : <iframe className="w-full h-full" src={post.embedUrl} allowFullScreen style={{ border:"none" }} />
                }
              </div>
            )}

            {/* Content */}
            {post.content && (
              <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background:"var(--color-surface)", color:"var(--color-muted)", border:"1px solid #2a2a3a" }}>
                    <Tag size={10} />#{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: links */}
          <div className="space-y-4">
            {/* Download / External Links */}
            {post.links && post.links.length > 0 && (
              <div className="p-4 rounded-2xl" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
                <h3 className="font-bold mb-3" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Links</h3>
                <div className="space-y-2">
                  {post.links.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener"
                      className="link-btn w-full justify-between"
                      style={{ background:( LINK_COLORS[l.type]||"#6c5ce7")+"18", color:LINK_COLORS[l.type]||"#6c5ce7", border:`1px solid ${LINK_COLORS[l.type]||"#6c5ce7"}30` }}>
                      <span>{LINK_ICONS[l.type]||"🔗"} {l.label}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Download links */}
            {post.downloadLinks && post.downloadLinks.length > 0 && (
              <div className="p-4 rounded-2xl" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
                <h3 className="font-bold mb-3" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Downloads</h3>
                <div className="space-y-2">
                  {post.downloadLinks.map((d,i) => (
                    <a key={i} href={d.url} target="_blank" rel="noopener"
                      className="link-btn w-full justify-between"
                      style={{ background:"#00b89418", color:"#00b894", border:"1px solid #00b89430" }}>
                      <div>
                        <div className="font-semibold">{d.label}</div>
                        {(d.version||d.size) && <div className="text-xs opacity-70">{d.version} {d.size}</div>}
                      </div>
                      <Download size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
