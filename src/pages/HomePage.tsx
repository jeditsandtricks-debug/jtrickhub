import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ChevronRight, Zap } from "lucide-react";
import PostCard from "../components/PostCard";
import { subscribePosts, subscribeCategories } from "../lib/db";
import { useSettings } from "../context/SettingsContext";
import type { Post, Category } from "../types";

export default function HomePage() {
  const { settings } = useSettings();
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    const u1 = subscribePosts(p => setPosts(p.filter(x => x.status==="published")));
    const u2 = subscribeCategories(setCats);
    return () => { u1(); u2(); };
  }, []);

  const catMap = Object.fromEntries(cats.map(c => [c.id, c]));
  const pinned = posts.filter(p => p.pinned);
  const featured = posts.filter(p => p.featured && !p.pinned).slice(0,4);
  const recent = posts.filter(p => !p.pinned).slice(0, 20);

  return (
    <div style={{ background:"var(--color-bg)", minHeight:"100vh" }}>
      {/* Announcement Bar */}
      {settings.announcementBarEnabled && settings.announcementBar && (
        <div className="overflow-hidden py-2 text-xs font-medium text-white" style={{ background:"var(--color-primary)" }}>
          <div className="marquee-text">{settings.announcementBar}</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 space-y-12">

        {/* Hero */}
        <div className="text-center pt-4 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background:"var(--color-primary)20", color:"var(--color-primary)", border:"1px solid var(--color-primary)40" }}>
            <Zap size={12} /> Latest Tech Tricks & Tips
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3 gradient-text" style={{ fontFamily:"var(--font-display)" }}>
            {settings.heroTitle}
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color:"var(--color-muted)" }}>{settings.heroSubtitle}</p>
        </div>

        {/* Categories Scroll */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Browse Categories</h2>
          <div className="flex gap-3 flex-wrap">
            {cats.map(c => (
              <Link key={c.id} to={`/category/${c.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background:c.color+"18", color:c.color, border:`1px solid ${c.color}35` }}>
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Pinned posts */}
        {pinned.length > 0 && (
          <Section title="📌 Pinned">
            {pinned.slice(0,4).map(p => <PostCard key={p.id} post={p} category={catMap[p.category]} />)}
          </Section>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <Section title="🔥 Featured">
            {featured.map(p => <PostCard key={p.id} post={p} category={catMap[p.category]} />)}
          </Section>
        )}

        {/* All Recent */}
        <Section title="⚡ Latest Posts">
          {recent.map(p => <PostCard key={p.id} post={p} category={catMap[p.category]} />)}
        </Section>

        {/* Per-category sections */}
        {cats.map(cat => {
          const catPosts = posts.filter(p => p.category===cat.id && p.status==="published").slice(0,5);
          if (catPosts.length===0) return null;
          return (
            <Section key={cat.id} title={`${cat.icon} ${cat.name}`} href={`/category/${cat.id}`}>
              {catPosts.map(p => <PostCard key={p.id} post={p} category={cat} />)}
            </Section>
          );
        })}

        {posts.length===0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✍️</div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>No posts yet</h2>
            <p className="text-sm mb-4" style={{ color:"var(--color-muted)" }}>Go to Admin and create your first post!</p>
            <Link to="/admin" className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background:"var(--color-primary)" }}>Go to Admin</Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function Section({ title, href, children }: { title:string; href?:string; children:React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{title}</h2>
        {href && <Link to={href} className="flex items-center gap-1 text-sm font-medium hover:underline" style={{ color:"var(--color-primary)" }}>See all <ChevronRight size={14}/></Link>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{children}</div>
    </div>
  );
}

function Footer() {
  const { settings } = useSettings();
  const socials = settings.socialLinks || {};
  return (
    <footer className="mt-16 py-10" style={{ borderTop:"1px solid #1f1f2a" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{settings.logoIcon||"⚡"}</span>
            <span className="font-bold" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{settings.siteName}</span>
          </div>
          <div className="flex items-center gap-4">
            {socials.youtube && <a href={socials.youtube} target="_blank" rel="noopener" className="text-sm hover:opacity-80" style={{ color:"#ff0000" }}>▶ YouTube</a>}
            {socials.telegram && <a href={socials.telegram} target="_blank" rel="noopener" className="text-sm hover:opacity-80" style={{ color:"#0088cc" }}>✈ Telegram</a>}
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener" className="text-sm hover:opacity-80" style={{ color:"#e84393" }}>📷 Instagram</a>}
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener" className="text-sm hover:opacity-80" style={{ color:"#1da1f2" }}>𝕏 Twitter</a>}
            {socials.github && <a href={socials.github} target="_blank" rel="noopener" className="text-sm hover:opacity-80" style={{ color:"#aaa" }}>GitHub</a>}
            {socials.whatsapp && <a href={socials.whatsapp} target="_blank" rel="noopener" className="text-sm hover:opacity-80" style={{ color:"#25d366" }}>📱 WhatsApp</a>}
          </div>
          <p className="text-xs" style={{ color:"var(--color-muted)" }}>{settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName}`}</p>
        </div>
      </div>
    </footer>
  );
}
