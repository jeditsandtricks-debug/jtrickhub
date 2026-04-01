import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import RequestModal from "../components/RequestModal";
import HomePage from "./HomePage";
import PostPage from "./PostPage";
import CategoryPage from "./CategoryPage";
import SearchPage from "./SearchPage";

export default function PublicLayout() {
  const [showRequest, setShowRequest] = useState(false);

  return (
    <>
      <Navbar onRequest={() => setShowRequest(true)} />
      {showRequest && <RequestModal onClose={() => setShowRequest(false)} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
}
