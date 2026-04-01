import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { subscribePostsByCategory, subscribeCategories } from "../lib/db";
import type { Post, Category } from "../types";

export default function CategoryPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [cat, setCat] = useState<Category | null>(null);

  useEffect(() => {
    const u1 = subscribePostsByCategory(id||"", setPosts);
    const u2 = subscribeCategories(cats => setCat(cats.find(c=>c.id===id)||null));
    return () => { u1(); u2(); };
  }, [id]);

  return (
    <div style={{ background:"var(--color-bg)", minHeight:"100vh" }}>
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {cat && (
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl mb-4"
              style={{ background:cat.color+"18", border:`1px solid ${cat.color}30` }}>
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <h1 className="text-2xl font-black" style={{ fontFamily:"var(--font-display)", color:cat.color }}>{cat.name}</h1>
                <p className="text-sm" style={{ color:"var(--color-muted)" }}>{cat.description}</p>
              </div>
            </div>
            <p className="text-sm" style={{ color:"var(--color-muted)" }}>{posts.length} posts</p>
          </div>
        )}
        {posts.length === 0
          ? <div className="text-center py-20" style={{ color:"var(--color-muted)" }}><p className="text-4xl mb-3">📭</p><p>No posts in this category yet.</p></div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map(p => <PostCard key={p.id} post={p} category={cat||undefined} />)}
            </div>
        }
      </div>
    </div>
  );
}
