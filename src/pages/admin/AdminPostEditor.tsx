import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload, Eye, EyeOff } from "lucide-react";
import { getPost, savePost, subscribeCategories } from "../../lib/db";
import type { Post, Category } from "../../types";

const EMPTY_POST: Post = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: "",
  category: "",
  tags: [],
  author: "Admin",
  publishedAt: new Date().toISOString(),
  featured: false,
  pinned: false,
  views: 0,
  likes: [],
  status: "published",
  links: [],
  embedUrl: "",
  embedType: "none",
  downloadLinks: [],
};

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== "new" && Boolean(id);

  const [form, setForm] = useState<Post>({
    ...EMPTY_POST,
    id: `post_${Date.now()}`
  });

  const [cats, setCats] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const thumbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = subscribeCategories(setCats);

    if (isEdit && id) {
      getPost(id).then(p => {
        if (p) setForm(p);
      });
    }

    return () => unsub();
  }, [id]);

  const set = (k: keyof Post, v: any) =>
    setForm(prev => ({ ...prev, [k]: v }));

  function makeSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(v: string) {
    set("title", v);
    if (!isEdit) set("slug", makeSlug(v));
  }

  function handleThumb(file: File) {
    const reader = new FileReader();
    reader.onload = e => set("thumbnail", e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!form.title.trim()) return alert("Title required");
    if (!form.category) return alert("Category required");

    setSaving(true);

    const toSave = {
      ...form,
      updatedAt: new Date().toISOString(),
      publishedAt: form.publishedAt || new Date().toISOString()
    };

    await savePost(toSave);

    setSaving(false);
    navigate("/admin/posts");
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/admin/posts")}>
          <ArrowLeft />
        </button>

        <h1 className="text-xl font-bold flex-1 text-white">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>

        <button onClick={() => setPreview(!preview)}>
          {preview ? <EyeOff /> : <Eye />}
        </button>

        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-xl text-white flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Publish"}
        </button>
      </div>

      {preview ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{form.title}</h2>
          {form.thumbnail && (
            <img src={form.thumbnail} className="rounded-xl" />
          )}
          <div className="text-gray-300 whitespace-pre-wrap">
            {form.content}
          </div>
        </div>
      ) : (
        <>
          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-400">Title</label>
            <input
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Enter post title"
              className="w-full mt-1 p-3 rounded-xl bg-[#0f0f17] border border-[#1f1f2a] text-white"
            />
          </div>

          {/* CATEGORY ✅ FIXED */}
          <div>
            <label className="text-sm text-gray-400">Category</label>
            <select
              value={form.category}
              onChange={e => set("category", e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-[#0f0f17] border border-[#1f1f2a] text-white"
            >
              <option value="">Select category</option>

              {cats.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* SLUG */}
          <div>
            <label className="text-sm text-gray-400">Slug</label>
            <input
              value={form.slug}
              onChange={e => set("slug", e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-[#0f0f17] border border-[#1f1f2a] text-white"
            />
          </div>

          {/* THUMBNAIL */}
          <div>
            <label className="text-sm text-gray-400">Thumbnail URL</label>
            <input
              value={form.thumbnail}
              onChange={e => set("thumbnail", e.target.value)}
              placeholder="Paste image URL"
              className="w-full mt-1 p-3 rounded-xl bg-[#0f0f17] border border-[#1f1f2a] text-white"
            />
          </div>

          <input
            ref={thumbRef}
            type="file"
            hidden
            onChange={e =>
              e.target.files?.[0] && handleThumb(e.target.files[0])
            }
          />

          <button
            onClick={() => thumbRef.current?.click()}
            className="flex items-center gap-2 text-sm text-blue-400"
          >
            <Upload size={16} /> Upload Image
          </button>

          {/* CONTENT */}
          <div>
            <label className="text-sm text-gray-400">Content</label>
            <textarea
              value={form.content}
              onChange={e => set("content", e.target.value)}
              rows={8}
              placeholder="Write your post..."
              className="w-full mt-1 p-3 rounded-xl bg-[#0f0f17] border border-[#1f1f2a] text-white"
            />
          </div>
        </>
      )}
    </div>
  );
}
