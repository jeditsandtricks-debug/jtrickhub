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

  const category = cats.find(
    c => c.slug === id || c.id === id
  );

  const filteredPosts = posts.filter(
    p => p.category === id || p.category === category?.id
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">
        {category?.name || "Category"}
      </h1>

      <p className="mb-4">{filteredPosts.length} posts</p>

      {filteredPosts.length === 0 ? (
        <p>No posts in this category yet.</p>
      ) : (
        filteredPosts.map(p => (
          <div key={p.id} className="mb-3">
            {p.title}
          </div>
        ))
      )}
    </div>
  );
}
