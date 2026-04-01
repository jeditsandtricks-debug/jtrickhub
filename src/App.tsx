import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useSettings } from "./context/SettingsContext";
import { useUser } from "./context/UserContext";
import { UserNameModal, BlockedScreen } from "./components/UserGate";
import Navbar from "./components/Navbar";
import RequestModal from "./components/RequestModal";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPostEditor from "./pages/admin/AdminPostEditor";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminTheme from "./pages/admin/AdminTheme";
import AdminSettings from "./pages/admin/AdminSettings";

function PublicLayout() {
  const { settings, loading } = useSettings();
  const { needsName, isBlocked } = useUser();
  const [showRequest, setShowRequest] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#0a0a0f" }}>
      <div className="text-center"><div className="text-4xl mb-2 animate-pulse">⚡</div><p className="text-sm" style={{ color:"#555" }}>Loading...</p></div>
    </div>
  );

  if (settings.maintenanceMode) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"var(--color-bg)" }}>
      <div className="text-center">
        <div className="text-6xl mb-4">🔧</div>
        <h1 className="text-3xl font-black mb-2" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{settings.siteName}</h1>
        <p className="mb-4" style={{ color:"var(--color-muted)" }}>We'll be back soon!</p>
        <a href="/admin" className="text-sm underline" style={{ color:"var(--color-primary)" }}>Admin Login</a>
      </div>
    </div>
  );

  if (isBlocked) return <BlockedScreen />;
  if (settings.requireUserName && needsName) return <UserNameModal />;

  return (
    <>
      <Navbar onRequest={() => setShowRequest(true)} />
      {showRequest && <RequestModal onClose={() => setShowRequest(false)} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Routes>

  {/* 🔐 ADMIN LOGIN */}
  <Route path="/admin" element={<AdminLogin />} />

  {/* 🔥 ADMIN PAGES */}
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/posts" element={<AdminPosts />} />
  <Route path="/admin/posts/new" element={<AdminPostEditor />} />
  <Route path="/admin/posts/edit/:id" element={<AdminPostEditor />} />
  <Route path="/admin/categories" element={<AdminCategories />} />
  <Route path="/admin/users" element={<AdminUsers />} />
  <Route path="/admin/requests" element={<AdminRequests />} />
  <Route path="/admin/theme" element={<AdminTheme />} />
  <Route path="/admin/settings" element={<AdminSettings />} />

</Routes>
  );
}
