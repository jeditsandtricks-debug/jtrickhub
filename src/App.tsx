import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPostEditor from "./pages/admin/AdminPostEditor";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminTheme from "./pages/admin/AdminTheme";
import AdminSettings from "./pages/admin/AdminSettings";

// 👉 ADD THIS (IMPORTANT)
import PublicLayout from "./pages/PublicLayout";

// 🔐 PROTECTED ROUTE
function ProtectedRoute({ children }: any) {
  const isAuth = sessionStorage.getItem("jtrick_admin");

  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>

      {/* 🔐 LOGIN */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* 🔥 PROTECTED ADMIN */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />

      <Route path="/admin/posts" element={
        <ProtectedRoute><AdminPosts /></ProtectedRoute>
      } />

      <Route path="/admin/posts/new" element={
        <ProtectedRoute><AdminPostEditor /></ProtectedRoute>
      } />

      <Route path="/admin/posts/edit/:id" element={
        <ProtectedRoute><AdminPostEditor /></ProtectedRoute>
      } />

      <Route path="/admin/categories" element={
        <ProtectedRoute><AdminCategories /></ProtectedRoute>
      } />

      <Route path="/admin/users" element={
        <ProtectedRoute><AdminUsers /></ProtectedRoute>
      } />

      <Route path="/admin/requests" element={
        <ProtectedRoute><AdminRequests /></ProtectedRoute>
      } />

      <Route path="/admin/theme" element={
        <ProtectedRoute><AdminTheme /></ProtectedRoute>
      } />

      <Route path="/admin/settings" element={
        <ProtectedRoute><AdminSettings /></ProtectedRoute>
      } />

      {/* 🌐 PUBLIC WEBSITE (IMPORTANT FIX) */}
      <Route path="/*" element={<PublicLayout />} />

    </Routes>
  );
}
