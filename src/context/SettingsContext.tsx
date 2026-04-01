import React, { createContext, useContext, useEffect, useState } from "react";
import type { SiteSettings } from "../types";
import { saveSettings, subscribeSettings, defaultSettings } from "../lib/db";

interface Ctx { settings: SiteSettings; update: (s: Partial<SiteSettings>) => Promise<void>; loading: boolean; }
const C = createContext<Ctx>({ settings: defaultSettings, update: async () => {}, loading: true });

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, set] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  function applyTheme(s: SiteSettings) {
    const r = document.documentElement;
    r.style.setProperty("--color-primary", s.colorPrimary);
    r.style.setProperty("--color-accent", s.colorAccent);
    if (s.theme === "dark") {
      r.style.setProperty("--color-bg","#0a0a0f"); r.style.setProperty("--color-surface","#13131a");
      r.style.setProperty("--color-text","#ffffff"); r.style.setProperty("--color-muted","#888899");
    } else if (s.theme === "amoled") {
      r.style.setProperty("--color-bg","#000000"); r.style.setProperty("--color-surface","#0d0d0d");
      r.style.setProperty("--color-text","#ffffff"); r.style.setProperty("--color-muted","#666677");
    } else {
      r.style.setProperty("--color-bg","#f0f0f5"); r.style.setProperty("--color-surface","#ffffff");
      r.style.setProperty("--color-text","#111122"); r.style.setProperty("--color-muted","#555566");
    }
    r.style.setProperty("--font-display",`'${s.fontDisplay}', sans-serif`);
    r.style.setProperty("--font-body",`'${s.fontBody}', sans-serif`);
    const gf = document.getElementById("gfonts") as HTMLLinkElement;
    if (gf && s.googleFontsUrl) gf.href = s.googleFontsUrl;
    if (s.faviconUrl) { const fav=document.getElementById("dynamic-favicon") as HTMLLinkElement; if(fav) fav.href=s.faviconUrl; }
    document.title = s.siteName;
    let el = document.getElementById("jott-css") as HTMLStyleElement;
    if (!el) { el=document.createElement("style"); el.id="jott-css"; document.head.appendChild(el); }
    el.textContent = s.customCSS || "";
  }

  async function update(partial: Partial<SiteSettings>) {
    const updated = { ...settings, ...partial };
    set(updated); applyTheme(updated);
    await saveSettings(updated);
  }

  useEffect(() => {
    const unsub = subscribeSettings(s => { set(s); applyTheme(s); setLoading(false); });
    return () => unsub();
  }, []);

  return <C.Provider value={{ settings, update, loading }}>{children}</C.Provider>;
}

export const useSettings = () => useContext(C);
