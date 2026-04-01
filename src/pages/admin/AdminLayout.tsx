import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, FileText, FolderOpen, Users, MessageSquare, Palette, Settings, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

const NAV = [
  { to:"/admin/dashboard", icon:LayoutDashboard, label:"Dashboard" },
  { to:"/admin/posts",     icon:FileText,         label:"Posts" },
  { to:"/admin/categories",icon:FolderOpen,       label:"Categories" },
  { to:"/admin/users",     icon:Users,            label:"Users" },
  { to:"/admin/requests",  icon:MessageSquare,    label:"Requests" },
  { to:"/admin/theme",     icon:Palette,          label:"Theme" },
  { to:"/admin/settings",  icon:Settings,         label:"Settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);

  useEffect(() => { if (sessionStorage.getItem("jtrick_admin")!=="true") navigate("/admin"); }, []);

  const logout = () => { sessionStorage.removeItem("jtrick_admin"); window.dispatchEvent(new Event("focus")); navigate("/admin"); };

  return (
    <div className="flex min-h-screen" style={{ background:"var(--color-bg)" }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${open?"translate-x-0":"-translate-x-full"}`}
        style={{ background:"var(--color-surface)", borderRight:"1px solid #1f1f2a" }}>
        <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid #1f1f2a" }}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ background:"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
              {settings.logoUrl ? <img src={settings.logoUrl} alt="" className="w-6 h-6 object-contain" /> : settings.logoIcon||"⚡"}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{settings.siteName}</p>
              <p className="text-xs" style={{ color:"var(--color-muted)" }}>Admin Panel</p>
            </div>
          </div>
          <button onClick={()=>setOpen(false)} className="lg:hidden" style={{ color:"var(--color-muted)" }}><X size={16} /></button>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({to,icon:Icon,label}) => (
            <NavLink key={to} to={to}
              className={({isActive})=>`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive?"admin-nav-active":"hover:opacity-80"}`}
              style={({isActive})=>isActive?{}:{color:"var(--color-muted)"}}
              onClick={()=>setOpen(false)}>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-3 space-y-0.5" style={{ borderTop:"1px solid #1f1f2a" }}>
          <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:opacity-80" style={{ color:"var(--color-muted)" }}><ExternalLink size={16} />View Site</Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:opacity-80" style={{ color:"#e50914" }}><LogOut size={16} />Logout</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 lg:hidden" style={{ background:"rgba(0,0,0,0.6)" }} onClick={()=>setOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 px-4 h-14 flex items-center gap-3" style={{ background:"var(--color-surface)", borderBottom:"1px solid #1f1f2a" }}>
          <button onClick={()=>setOpen(true)} className="lg:hidden" style={{ color:"var(--color-muted)" }}><Menu size={20} /></button>
          <span className="text-sm font-semibold" style={{ color:"var(--color-text)" }}>Admin · {settings.siteName}</span>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
