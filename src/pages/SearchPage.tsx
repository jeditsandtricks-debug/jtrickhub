import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { subscribePosts, subscribeCategories } from "../lib/db";
import type { Post, Category } from "../types";

export default function SearchPage() {
  const [sp] = useSearchParams();
  const q = sp.get("q")||"";
  const [all, setAll] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    const u1 = subscribePosts(p => setAll(p.filter(x=>x.status==="published")));
    const u2 = subscribeCategories(setCats);
    return () => { u1(); u2(); };
  }, []);

  const results = all.filter(p => {
    const s = q.toLowerCase();
    return p.title.toLowerCase().includes(s)||p.excerpt?.toLowerCase().includes(s)||p.tags?.some(t=>t.toLowerCase().includes(s))||p.category.toLowerCase().includes(s);
  });
  const catMap = Object.fromEntries(cats.map(c=>[c.id,c]));

  return (
    <div style={{ background:"var(--color-bg)", minHeight:"100vh" }}>
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Search: "{q}"</h1>
        <p className="text-sm mb-8" style={{ color:"var(--color-muted)" }}>{results.length} results</p>
        {results.length===0
          ? <div className="text-center py-20" style={{ color:"var(--color-muted)" }}><p className="text-4xl mb-3">🔍</p><p>No results found for "{q}"</p></div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map(p=><PostCard key={p.id} post={p} category={catMap[p.category]} />)}
            </div>
        }
      </div>
    </div>
  );
}
