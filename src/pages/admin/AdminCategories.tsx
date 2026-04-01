import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { subscribeCategories, saveCategories } from "../../lib/db";
import type { Category } from "../../types";

const EMOJIS = ["💡","🆓","📱","💻","🪄","💰","🎬","📲","🔐","🤖","🌐","📚","🔥","⚡","🎯","🛠️","📡","🎮","🔑","🌟","📰","🧩","🚀","💎","🎵"];
const COLORS = ["#6c5ce7","#00b894","#0071eb","#e17055","#fd79a8","#f39c12","#e50914","#e84393","#2d3436","#00cec9","#a29bfe","#55efc4","#fab1a0","#74b9ff"];

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { const unsub = subscribeCategories(setCats); return () => unsub(); }, []);

  const upd = (id:string, k:keyof Category, v:any) => setCats(prev => prev.map(c => c.id===id?{...c,[k]:v}:c));
  const add = () => setCats(prev => [...prev, { id:`cat_${Date.now()}`, name:"New Category", icon:"📝", color:"#888", description:"", order:prev.length+1 }]);
  const del = (id:string) => setCats(prev => prev.filter(c=>c.id!==id));

  async function handleSave() {
    setSaving(true);
    await saveCategories(cats);
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000);
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black" style={{ fontFamily:"var(--font-display)", color:"var(--color-text)" }}>Categories</h1>
        <button onClick={add} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background:"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
          <Plus size={15}/> Add
        </button>
      </div>
      <div className="space-y-3">
        {cats.map(cat => (
          <div key={cat.id} className="p-4 rounded-2xl space-y-3" style={{ background:"var(--color-surface)", border:"1px solid #1f1f2a" }}>
            <div className="flex items-center gap-3 flex-wrap">
              <select value={cat.icon} onChange={e=>upd(cat.id,"icon",e.target.value)}
                className="text-xl px-2 py-1 rounded-xl outline-none" style={{ background:"var(--color-bg)", border:"1px solid #2a2a3a", color:"var(--color-text)" }}>
                {EMOJIS.map(e=><option key={e} value={e}>{e}</option>)}
              </select>
              <input value={cat.name} onChange={e=>upd(cat.id,"name",e.target.value)} className="input flex-1 font-bold min-w-[120px]" placeholder="Category name" />
              <div className="flex items-center gap-1.5">
                <input type="color" value={cat.color} onChange={e=>upd(cat.id,"color",e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
                <div className="flex gap-1 flex-wrap max-w-[100px]">
                  {COLORS.slice(0,8).map(c=>(
                    <button key={c} onClick={()=>upd(cat.id,"color",c)} className="w-4 h-4 rounded-full border-2 transition-all"
                      style={{ background:c, borderColor:cat.color===c?"white":"transparent" }} />
                  ))}
                </div>
              </div>
              <button onClick={()=>del(cat.id)} className="p-2 rounded-xl" style={{ background:"#2a1111", color:"#e50914" }}><Trash2 size={14}/></button>
            </div>
            <input value={cat.description} onChange={e=>upd(cat.id,"description",e.target.value)} className="input w-full text-xs" placeholder="Short description..." />
            <div className="flex items-center gap-2">
              <span className="cat-badge" style={{ background:cat.color+"22", color:cat.color }}>{cat.icon} {cat.name}</span>
              <span className="text-xs" style={{ color:"var(--color-muted)" }}>{cat.description}</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
        style={{ background:saved?"#00b894":"linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}>
        <Save size={16}/>{saving?"Saving...":saved?"✓ Categories Saved!":"Save Categories"}
      </button>
    </div>
  );
}
