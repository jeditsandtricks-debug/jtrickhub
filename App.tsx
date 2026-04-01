import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
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

/* 🌐 PUBLIC WEBSITE */
function PublicLayout() {
  const [showRequest, setShowRequest] = useState(false);

  return (
    <>
      <Navbar onRequest={() => setShowRequest(true)} />
      {showRequest && <RequestModal onClose={() => setShowRequest(false)} />}

      <Routes>
        <Route index element={<HomePage />} />
        <Route path="post/:id" element={<PostPage />} />
        <Route path="category/:id" element={<CategoryPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

/* 🚀 MAIN APP */
export default function App() {
  return (
    <Routes>

      {/* 🔐 ADMIN LOGIN */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* 🔥 ADMIN PANEL */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="posts/new" element={<AdminPostEditor />} />
        <Route path="posts/edit/:id" element={<AdminPostEditor />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="theme" element={<AdminTheme />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* 🌐 WEBSITE */}
      <Route path="/*" element={<PublicLayout />} />

    </Routes>
  );
}
