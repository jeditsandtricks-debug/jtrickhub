import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPosts, subscribeCategories } from "../lib/db";

export default function CategoryPage() {
  const { id } = useParams(); // slug
  const [posts, setPosts] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
    const unsub = subscribeCategories(setCats);
    return () => unsub();
  }, []);

  const category = cats.find(
    c => c.slug === id || c.id === id
  );

  const filteredPosts = posts.filter(
    p => p.category === id || p.category === category?.id
  );

  return (
    <div>
      <h1>{category?.name}</h1>

      <p>{filteredPosts.length} posts</p>

      {filteredPosts.length === 0 ? (
        <p>No posts</p>
      ) : (
        filteredPosts.map(p => (
          <div key={p.id}>{p.title}</div>
        ))
      )}
    </div>
  );
}
