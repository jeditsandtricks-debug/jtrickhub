import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, X, Upload, Link2, Eye, EyeOff } from "lucide-react";
import { getPost, savePost, subscribeCategories } from "../../lib/db";
import type { Post, PostLink, DownloadLink, Category } from "../../types";

const LINK_TYPES = ["download","external","telegram","drive","apk","website"] as const;

const EMPTY_POST: Post = {
  id: "", title: "", slug: "", excerpt: "", content: "", thumbnail: "",
  category: "", tags: [], author: "Admin", publishedAt: new Date().toISOString(),
  featured: false, pinned: false, views: 0, likes: [], status: "published",
  links: [], embedUrl: "", embedType: "none", downloadLinks: [],
};

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== "new" && Boolean(id);

  const [form, setForm] = useState<Post>({ ...EMPTY_POST, id: `post_${Date.now()}` });
  const [cats, setCats] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);

  const thumbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = subscribeCategories(setCats);
    if (isEdit && id) getPost(id).then(p => { if (p) setForm(p); });
    return () => unsub();
  }, [id]);

  const set = (k: keyof Post, v: any) =>
    setForm(prev => ({ ...prev, [k]: v }));

  function makeSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleTitleChange(v: string) {
    set("title", v);
    if (!isEdit) set("slug", makeSlug(v));
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
      setTagInput("");
    }
  }

  function addLink() {
    set("links", [...(form.links||[]), { label: "Download", url: "", type: "download" }]);
  }

  function updateLink(i: number, k: keyof PostLink, v: string) {
    const updated = [...(form.links||[])];
    updated[i] = { ...updated[i], [k]: v };
    set("links", updated);
  }

  function removeLink(i: number) {
    set("links", (form.links||[]).filter((_,idx)=>idx!==i));
  }

  function addDownload() {
    set("downloadLinks", [...(form.downloadLinks||[]), { label:"Download", url:"", size:"", version:"" }]);
  }

  function updateDownload(i:number,k:keyof DownloadLink,v:string) {
    const updated=[...(form.downloadLinks||[])];
    updated[i]={...updated[i],[k]:v};
    set("downloadLinks",updated);
  }

  function removeDownload(i:number){
    set("downloadLinks",(form.downloadLinks||[]).filter((_,idx)=>idx!==i));
  }

  function handleThumb(file: File) {
    const reader=new FileReader();
    reader.onload=e=>set("thumbnail",e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave(status?: "published"|"draft") {
    if (!form.title.trim()) return alert("Title required");
    if (!form.category) return alert("Category required");

    // 🔥 SLUG AUTO FIX
    if (!form.slug) {
      form.slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    setSaving(true);

    const toSave = {
      ...form,
      status: status || form.status,
      updatedAt: new Date().toISOString()
    };

    if (!isEdit) {
      toSave.publishedAt = new Date().toISOString();
    }

    await savePost(toSave);

    setSaving(false);
    setSaved(true);

    setTimeout(() => navigate("/admin/posts"), 700);
  }

  return (
    <div className="max-w-4xl space-y-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={()=>navigate("/admin/posts")}><ArrowLeft/></button>

        <h1 className="text-xl font-bold flex-1">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>

        <button onClick={()=>setPreview(!preview)}>
          {preview ? <EyeOff/> : <Eye/>}
        </button>

        <button onClick={()=>handleSave("published")}>
          <Save/> {saving ? "Saving..." : "Publish"}
        </button>
      </div>

      {preview ? (
        <div>
          <h2>{form.title}</h2>
          {form.thumbnail && <img src={form.thumbnail}/>}
          <div dangerouslySetInnerHTML={{__html:form.content}}/>
        </div>
      ) : (
        <>
          <input
            value={form.title}
            onChange={e=>handleTitleChange(e.target.value)}
            placeholder="Title"
            className="input w-full"
          />

          {/* CATEGORY */}
          <select
            value={form.category}
            onChange={e=>set("category",e.target.value)}
            className="input w-full"
          >
            <option value="">Select category</option>
            {cats.map(c=>(
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* SLUG */}
          <input
            value={form.slug}
            onChange={e=>set("slug",e.target.value)}
            placeholder="slug-auto-create"
            className="input w-full"
          />

          {/* THUMB */}
          <input
            value={form.thumbnail}
            onChange={e=>set("thumbnail",e.target.value)}
            placeholder="Thumbnail URL"
            className="input w-full"
          />

          <input
            ref={thumbRef}
            type="file"
            hidden
            onChange={e=>e.target.files?.[0] && handleThumb(e.target.files[0])}
          />

          <button onClick={()=>thumbRef.current?.click()}>
            <Upload/> Upload Image
          </button>

          {/* CONTENT */}
          <textarea
            value={form.content}
            onChange={e=>set("content",e.target.value)}
            rows={10}
            className="input w-full"
          />
        </>
      )}

    </div>
  );
}
