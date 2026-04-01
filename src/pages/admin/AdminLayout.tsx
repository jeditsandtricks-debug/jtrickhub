import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, FileText, FolderOpen, Users, MessageSquare, Palette, Settings, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

const NAV = [
  { to:"/admin/dashboard", icon:LayoutDashboard, label:"Dashboard" },
  { to:"/admin/posts", icon:FileText, label:"Posts" },
  { to:"/admin/categories", icon:FolderOpen, label:"Categories" },
  { to:"/admin/users", icon:Users, label:"Users" },
  { to:"/admin/requests", icon:MessageSquare, label:"Requests" },
  { to:"/admin/theme", icon:Palette, label:"Theme" },
  { to:"/admin/settings", icon:Settings, label:"Settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);

  // 🔐 FIXED AUTH CHECK
  useEffect(() => {
    const auth = sessionStorage.getItem("jtrick_admin");
    if (auth !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem("jtrick_admin");
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen" style={{ background:"var(--color-bg)" }}>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${open?"translate-x-0":"-translate-x-full"}`}
        style={{ background:"var(--color-surface)", borderRight:"1px solid #1f1f2a" }}>

        <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid #1f1f2a" }}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ background:"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
              {settings.logoUrl
                ? <img src={settings.logoUrl} className="w-6 h-6 object-contain" />
                : settings.logoIcon || "⚡"}
            </div>
            <div>
              <p className="font-bold text-sm">{settings.siteName}</p>
              <p className="text-xs">Admin Panel</p>
            </div>
          </div>

          <button onClick={()=>setOpen(false)} className="lg:hidden">
            <X size={16} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {NAV.map(({to,icon:Icon,label}) => (
            <NavLink key={to} to={to}
              className={({isActive})=>`flex items-center gap-3 px-3 py-2 rounded text-sm ${isActive?"bg-white/10":"hover:opacity-80"}`}>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 space-y-1">
          <Link to="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm">
            <ExternalLink size={16} /> View Site
          </Link>

          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/60" onClick={()=>setOpen(false)} />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center px-4 border-b">
          <button onClick={()=>setOpen(true)} className="lg:hidden mr-2">
            <Menu size={20} />
          </button>
          <span>Admin · {settings.siteName}</span>
        </header>

        {/* 🔥 VERY IMPORTANT */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
