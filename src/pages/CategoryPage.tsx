import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { subscribePosts, subscribeCategories } from "../lib/db";

export default function CategoryPage() {
  const { id } = useParams();

  const [posts, setPosts] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    const unsubPosts = subscribePosts(setPosts);
    const unsubCats = subscribeCategories(setCats);

    return () => {
      unsubPosts();
      unsubCats();
    };
  }, []);

  // 🔥 category detect
  const category = cats.find(
    c => c.slug === id || c.id === id
  );

  // 🔥 filter posts (old + new support)
  const filteredPosts = posts.filter(
    p => p.category === id || p.category === category?.id
  );

  return (
    <div className="p-4 md:p-6">

      {/* 🔥 Category Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white mb-1">
          {category?.icon} {category?.name || "Category"}
        </h1>
        <p className="text-gray-400 text-sm">
          {filteredPosts.length} posts
        </p>
      </div>

      {/* ❌ Empty */}
      {filteredPosts.length === 0 ? (
        <p className="text-gray-400">No posts in this category yet.</p>
      ) : (

        // 🔥 GRID LAYOUT
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {filteredPosts.map(p => {
            const cat = cats.find(c => c.slug === p.category || c.id === p.category);

            return (
              <div
                key={p.id}
                className="bg-[#0f0f17] border border-[#1f1f2a] rounded-2xl p-4 hover:scale-[1.03] transition-all duration-300"
              >

                {/* Thumbnail */}
                <div className="w-full h-40 flex items-center justify-center bg-[#111] rounded-xl mb-4 overflow-hidden">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">💡</span>
                  )}
                </div>

                {/* Category badge */}
                <span className="text-xs px-3 py-1 rounded-full bg-[#1a1a2e] text-blue-400">
                  {cat?.icon} {cat?.name}
                </span>

                {/* Title */}
                <h2 className="text-lg font-bold text-white mt-3 mb-2">
                  {p.title}
                </h2>

                {/* Date */}
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(p.publishedAt || Date.now()).toDateString()}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>👁 {p.views || 0}</span>
                  <span>❤️ {p.likes?.length || 0}</span>
                </div>

                {/* Button */}
                <a
                  href={`/post/${p.id}`}
                  className="inline-block mt-3 text-sm px-3 py-1 rounded-lg bg-red-500 text-white"
                >
                  Read More
                </a>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}
