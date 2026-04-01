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

  const set = (k: keyof Post, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  function makeSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleTitleChange(v: string) {
    set("title", v);
    if (!isEdit) set("slug", makeSlug(v));
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) { set("tags", [...form.tags, t]); setTagInput(""); }
  }

  function addLink() {
    set("links", [...(form.links||[]), { label: "Download", url: "", type: "download" }]);
  }
  function updateLink(i: number, k: keyof PostLink, v: string) {
    const updated = [...(form.links||[])];
    updated[i] = { ...updated[i], [k]: v };
    set("links", updated);
  }
  function removeLink(i: number) { set("links", (form.links||[]).filter((_,idx) => idx!==i)); }

  function addDownload() {
    set("downloadLinks", [...(form.downloadLinks||[]), { label: "Download v1.0", url: "", size: "", version: "" }]);
  }
  function updateDownload(i: number, k: keyof DownloadLink, v: string) {
    const updated = [...(form.downloadLinks||[])];
    updated[i] = { ...updated[i], [k]: v };
    set("downloadLinks", updated);
  }
  function removeDownload(i: number) { set("downloadLinks", (form.downloadLinks||[]).filter((_,idx)=>idx!==i)); }

  function handleThumb(file: File) {
    const reader = new FileReader();
    reader.onload = e => set("thumbnail", e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave(status?: "published"|"draft") {
    if (!form.title.trim()) { alert("Title is required"); return; }
    if (!form.category) { alert("Category is required"); return; }
    setSaving(true);
    const toSave = { ...form, status: status || form.status, updatedAt: new Date().toISOString() };
    if (!isEdit) toSave.publishedAt = new Date().toISOString();
    await savePost(toSave);
    setSaving(false); setSaved(true);
    setTimeout(() => navigate("/admin/posts"), 700);
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => navigate("/admin/posts")} className="p-2 rounded-xl hover:opacity-80" style={{ background:"var(--color-surface)" }}>
          <ArrowLeft size={18} style={{ color:"var(--color-muted)" }} />
        </button>
        <h1 className="text-xl font-black flex-1" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>
          {isEdit ? "Edit Post" : "New Post"}
        </h1>
        <button onClick={() => setPreview(!preview)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm hover:opacity-80"
          style={{ background:"var(--color-surface)", color:"var(--color-muted)", border:"1px solid #2a2a3a" }}>
          {preview ? <EyeOff size={15}/> : <Eye size={15}/>} {preview?"Edit":"Preview"}
        </button>
        <button onClick={() => handleSave("draft")} disabled={saving}
          className="px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-80"
          style={{ background:"var(--color-surface)", color:"var(--color-muted)", border:"1px solid #2a2a3a" }}>
          Save Draft
        </button>
        <button onClick={() => handleSave("published")} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90"
          style={{ background: saved?"#00b894":"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
          <Save size={15} />{saving?"Saving...":saved?"✓ Saved!":"Publish"}
        </button>
      </div>

      {preview ? (
        /* Content Preview */
        <div className="rounded-2xl p-6" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
          <h2 className="text-2xl font-black mb-2" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{form.title || "Post Title"}</h2>
          {form.thumbnail && <img src={form.thumbnail} alt="" className="w-full max-h-64 object-cover rounded-xl mb-4" />}
          <div className="post-content" dangerouslySetInnerHTML={{ __html: form.content || "<p>No content yet...</p>" }} />
        </div>
      ) : (
        <>
          {/* Basic Info */}
          <Card title="📝 Basic Info">
            <div>
              <label className="label">Title *</label>
              <input value={form.title} onChange={e => handleTitleChange(e.target.value)}
                placeholder="Post title..." className="input w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Category *</label>
                <select value={form.category} onChange={e => set("category", e.target.value)} className="input w-full">
                  <option value="">Select category...</option>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">URL Slug</label>
                <input value={form.slug} onChange={e => set("slug", e.target.value)} className="input w-full font-mono text-xs" />
              </div>
            </div>
            <div>
              <label className="label">Short Excerpt (shown in cards)</label>
              <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} rows={2}
                placeholder="Brief description of the post..." className="input w-full resize-none" />
            </div>
          </Card>

          {/* Thumbnail */}
          <Card title="🖼️ Thumbnail">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Thumbnail URL</label>
                <input value={form.thumbnail} onChange={e => set("thumbnail", e.target.value)}
                  placeholder="https://..." className="input w-full" />
              </div>
              <div>
                <input ref={thumbRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && handleThumb(e.target.files[0])} />
                <button onClick={() => thumbRef.current?.click()}
                  className="w-full h-[42px] rounded-xl border-2 border-dashed flex items-center justify-center gap-2 hover:opacity-80 text-sm"
                  style={{ borderColor:"#2a2a3a", color:"var(--color-muted)" }}>
                  <Upload size={15}/> Upload Image
                </button>
              </div>
            </div>
            {form.thumbnail && <img src={form.thumbnail} alt="" className="mt-2 h-32 object-cover rounded-xl w-full" style={{ background:"#222" }} />}
          </Card>

          {/* Content Editor */}
          <Card title="✍️ Content (HTML supported)">
            <div className="space-y-2">
              {/* Toolbar shortcuts */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  ["H2","<h2>Heading</h2>"],["H3","<h3>Sub Heading</h3>"],["Bold","<strong>bold text</strong>"],
                  ["Code","<code>code here</code>"],["List","<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>"],
                  ["Link","<a href='URL'>Link Text</a>"],["Quote","<blockquote>Quote here</blockquote>"],
                  ["HR","<hr/>"],["IMG","<img src='URL' alt='desc'/>"],
                ].map(([label, snippet]) => (
                  <button key={label} onClick={() => set("content", form.content + "\n" + snippet)}
                    className="px-2 py-1 rounded-lg text-xs font-mono hover:opacity-80"
                    style={{ background:"var(--color-bg)", color:"var(--color-primary)", border:"1px solid #2a2a3a" }}>
                    {label}
                  </button>
                ))}
              </div>
              <textarea value={form.content} onChange={e => set("content", e.target.value)}
                rows={16} placeholder="Write your post content here. HTML tags supported!&#10;&#10;<h2>Section Title</h2>&#10;<p>Your paragraph here...</p>&#10;&#10;<ul>&#10;  <li>Bullet point</li>&#10;</ul>"
                className="input w-full resize-y font-mono text-xs"
                style={{ fontFamily:"monospace", lineHeight:"1.6" }} />
              <p className="text-xs" style={{ color:"var(--color-muted)" }}>
                💡 HTML supported: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;code&gt;, &lt;a&gt;, &lt;img&gt;, &lt;blockquote&gt;
              </p>
            </div>
          </Card>

          {/* Embed Video */}
          <Card title="🎥 Embed Video (optional)">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Embed Type</label>
                <select value={form.embedType||"none"} onChange={e => set("embedType", e.target.value)} className="input w-full">
                  <option value="none">None</option>
                  <option value="youtube">YouTube</option>
                  <option value="iframe">iFrame / Embed</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">
                  {form.embedType==="youtube" ? "YouTube URL" : form.embedType==="iframe" ? "Embed URL" : "Video URL (select type first)"}
                </label>
                <input value={form.embedUrl||""} onChange={e => set("embedUrl", e.target.value)}
                  placeholder={form.embedType==="youtube" ? "https://youtube.com/watch?v=..." : "https://..."}
                  disabled={!form.embedType||form.embedType==="none"} className="input w-full" />
              </div>
            </div>
          </Card>

          {/* External Links */}
          <Card title="🔗 Links (Download / External / Telegram etc.)">
            <div className="space-y-3">
              {(form.links||[]).map((link, i) => (
                <div key={i} className="p-3 rounded-xl space-y-2" style={{ background:"var(--color-bg)", border:"1px solid #2a2a3a" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="label">Type</label>
                      <select value={link.type} onChange={e => updateLink(i,"type",e.target.value)} className="input w-full">
                        {LINK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Button Label</label>
                      <input value={link.label} onChange={e => updateLink(i,"label",e.target.value)} placeholder="Download Now" className="input w-full" />
                    </div>
                    <div className="relative">
                      <label className="label">URL</label>
                      <input value={link.url} onChange={e => updateLink(i,"url",e.target.value)} placeholder="https://..." className="input w-full pr-8" />
                      <button onClick={() => removeLink(i)} className="absolute right-2 top-7" style={{ color:"#e50914" }}><X size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addLink} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:opacity-80"
                style={{ background:"var(--color-bg)", color:"var(--color-primary)", border:"1px solid var(--color-primary)40" }}>
                <Plus size={15}/> Add Link
              </button>
            </div>
          </Card>

          {/* Download Links */}
          <Card title="⬇️ Download Links (with version & size)">
            <div className="space-y-3">
              {(form.downloadLinks||[]).map((dl, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background:"var(--color-bg)", border:"1px solid #2a2a3a" }}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="label">Label</label>
                      <input value={dl.label} onChange={e => updateDownload(i,"label",e.target.value)} placeholder="Download" className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Version</label>
                      <input value={dl.version||""} onChange={e => updateDownload(i,"version",e.target.value)} placeholder="v2.1.0" className="input w-full" />
                    </div>
                    <div>
                      <label className="label">File Size</label>
                      <input value={dl.size||""} onChange={e => updateDownload(i,"size",e.target.value)} placeholder="45 MB" className="input w-full" />
                    </div>
                    <div className="relative">
                      <label className="label">URL</label>
                      <input value={dl.url} onChange={e => updateDownload(i,"url",e.target.value)} placeholder="https://..." className="input w-full pr-8" />
                      <button onClick={() => removeDownload(i)} className="absolute right-2 top-7" style={{ color:"#e50914" }}><X size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addDownload} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:opacity-80"
                style={{ background:"var(--color-bg)", color:"#00b894", border:"1px solid #00b89440" }}>
                <Plus size={15}/> Add Download
              </button>
            </div>
          </Card>

          {/* Tags */}
          <Card title="🏷️ Tags">
            <div className="flex gap-2 mb-3">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && (e.preventDefault(), addTag())}
                placeholder="Type tag + Enter..." className="input flex-1" />
              <button onClick={addTag} className="px-4 py-2 rounded-xl font-bold text-white text-sm" style={{ background:"var(--color-primary)" }}>
                <Plus size={15}/>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(t => (
                <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background:"var(--color-bg)", color:"var(--color-muted)", border:"1px solid #2a2a3a" }}>
                  #{t}<button onClick={() => set("tags", form.tags.filter(x=>x!==t))}><X size={11}/></button>
                </span>
              ))}
            </div>
          </Card>

          {/* Options */}
          <Card title="⚙️ Post Options">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Toggle label="⭐ Featured Post" checked={form.featured} onChange={v => set("featured",v)} />
              <Toggle label="📌 Pinned (Top of home)" checked={form.pinned} onChange={v => set("pinned",v)} />
              <div>
                <label className="label">Publish Status</label>
                <select value={form.status} onChange={e => set("status", e.target.value)} className="input w-full">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Save bottom bar */}
      <div className="flex gap-3 sticky bottom-4">
        <button onClick={() => handleSave("draft")} disabled={saving}
          className="flex-1 py-3 rounded-xl text-sm font-semibold hover:opacity-80"
          style={{ background:"var(--color-surface)", color:"var(--color-muted)", border:"1px solid #2a2a3a" }}>
          Save as Draft
        </button>
        <button onClick={() => handleSave("published")} disabled={saving}
          className="flex-1 py-3 rounded-xl font-bold text-white hover:opacity-90"
          style={{ background: saved?"#00b894":"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
          {saving?"Saving to Firebase...":saved?"✓ Saved!":"Publish Post"}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
      <h3 className="font-bold text-sm" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>{title}</h3>
      {children}
    </div>
  );
}
function Toggle({ label, checked, onChange }: { label:string; checked:boolean; onChange:(v:boolean)=>void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div onClick={()=>onChange(!checked)} className="relative w-11 h-6 rounded-full transition-colors cursor-pointer" style={{ background:checked?"var(--color-primary)":"#333" }}>
        <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left:checked?"24px":"4px" }} />
      </div>
      <span className="text-sm" style={{ color:"var(--color-text)" }}>{label}</span>
    </label>
  );
}
