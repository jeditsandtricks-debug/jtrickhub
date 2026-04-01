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
  const { settings } = useSettings();
  const { needsName, isBlocked } = useUser();
  const [showRequest, setShowRequest] = useState(false);

  if (settings.maintenanceMode) return (
    <div style={{ minHeight:"100vh", background:"var(--color-bg)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>🔧</div>
        <h1 style={{ fontFamily:"var(--font-display)", color:"var(--color-text)", fontSize:"1.8rem", fontWeight:900 }}>{settings.siteName}</h1>
        <p style={{ color:"var(--color-muted)", marginTop:"0.5rem" }}>We'll be back soon!</p>
        <a href="/admin" style={{ color:"var(--color-primary)", marginTop:"1rem", display:"inline-block" }}>Admin Login</a>
      </div>
    </div>
  );

  if (isBlocked) return <BlockedScreen />;

  return (
    <>
      {settings.requireUserName && needsName && <UserNameModal />}
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
      {/* Admin Login */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Admin Pages — wrapped in AdminLayout */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="dashboard"      element={<AdminDashboard />} />
        <Route path="posts"          element={<AdminPosts />} />
        <Route path="posts/new"      element={<AdminPostEditor />} />
        <Route path="posts/edit/:id" element={<AdminPostEditor />} />
        <Route path="categories"     element={<AdminCategories />} />
        <Route path="users"          element={<AdminUsers />} />
        <Route path="requests"       element={<AdminRequests />} />
        <Route path="theme"          element={<AdminTheme />} />
        <Route path="settings"       element={<AdminSettings />} />
        <Route path=""               element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Public site — ALL other routes */}
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  );
}
