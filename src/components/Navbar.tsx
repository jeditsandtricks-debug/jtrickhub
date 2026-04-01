import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Send, Bookmark, Bell } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useUser } from "../context/UserContext";
import { subscribeCategories } from "../lib/db";
import type { Category } from "../types";

export default function Navbar({ onRequest }: { onRequest: () => void }) {
  const { settings } = useSettings();
  const { name } = useUser();
  const [cats, setCats] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("jtrick_admin") === "true");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = subscribeCategories(c => setCats(c.slice(0, 6)));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => { unsub(); window.removeEventListener("scroll", onScroll); };
  }, []);

  // Refresh isAdmin when sessionStorage changes (after login/logout)
  useEffect(() => {
    const check = () => setIsAdmin(sessionStorage.getItem("jtrick_admin") === "true");
    window.addEventListener("focus", check);
    return () => window.removeEventListener("focus", check);
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query)}`); setSearchOpen(false); setQuery(""); }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(10,10,15,0.97)" : "rgba(10,10,15,0.8)", backdropFilter: "blur(16px)", borderBottom: scrolled ? "1px solid #1f1f2a" : "1px solid transparent" }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
          {settings.logoUrl
            ? <img src={settings.logoUrl} alt="" className="h-8 w-auto" />
            : <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                  {settings.logoIcon || "⚡"}
                </div>
                <span className="font-bold text-base hidden sm:block" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                  {settings.siteName}
                </span>
              </div>
          }
        </Link>

        {/* Desktop category links */}
        <div className="hidden lg:flex items-center gap-1 flex-1 overflow-hidden">
          {cats.map(c => (
            <Link key={c.id} to={`/category/${c.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all hover:opacity-100"
              style={{ color: location.pathname === `/category/${c.id}` ? "var(--color-primary)" : "var(--color-muted)", background: location.pathname === `/category/${c.id}` ? "var(--color-primary)15" : "transparent" }}>
              {c.icon} {c.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Search */}
          {searchOpen
            ? <form onSubmit={search} className="flex items-center gap-2">
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search posts..."
                  className="px-3 py-1.5 rounded-lg text-sm outline-none w-44"
                  style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid #2a2a3a" }} />
                <button type="button" onClick={() => setSearchOpen(false)}><X size={16} style={{ color: "var(--color-muted)" }} /></button>
              </form>
            : <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:opacity-80" style={{ color: "var(--color-muted)" }}><Search size={18} /></button>
          }

          {/* User chip */}
          {name && !searchOpen && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
              style={{ background: "var(--color-surface)", border: "1px solid #2a2a3a" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                {name[0]?.toUpperCase()}
              </div>
              <span className="text-xs font-medium max-w-[70px] truncate" style={{ color: "var(--color-text)" }}>{name}</span>
            </div>
          )}

          {/* Request */}
          {settings.showUserRequests && !searchOpen && (
            <button onClick={onRequest} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-80"
              style={{ background: "var(--color-surface)", color: "var(--color-muted)", border: "1px solid #2a2a3a" }}>
              <Send size={12} /> Request
            </button>
          )}

          {/* Admin — only visible after login */}
          {!searchOpen && isAdmin && (
            <Link to="/admin/dashboard" className="px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-80"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
              Admin
            </Link>
          )}

          {/* Hamburger */}
          <button className="lg:hidden p-2 rounded-lg" onClick={() => setMenuOpen(!menuOpen)} style={{ color: "var(--color-text)" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto" style={{ background: "var(--color-surface)", borderBottom: "1px solid #1f1f2a" }}>
          {name && (
            <div className="flex items-center gap-2 py-3 mb-1" style={{ borderBottom: "1px solid #2a2a3a" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
                {name[0]?.toUpperCase()}
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{name}</span>
            </div>
          )}
          <Link to="/" onClick={() => setMenuOpen(false)} className="py-2.5 text-sm font-medium" style={{ color: "var(--color-text)" }}>🏠 Home</Link>
          {cats.map(c => (
            <Link key={c.id} to={`/category/${c.id}`} onClick={() => setMenuOpen(false)} className="py-2.5 text-sm" style={{ color: "var(--color-muted)" }}>
              {c.icon} {c.name}
            </Link>
          ))}
          {settings.showUserRequests && (
            <button onClick={() => { onRequest(); setMenuOpen(false); }} className="py-2.5 text-sm text-left flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
              <Send size={14} /> Send Request
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
