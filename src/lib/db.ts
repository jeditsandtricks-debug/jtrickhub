import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc,
  query, orderBy, where, onSnapshot, increment, writeBatch,
  limit, Unsubscribe
} from "firebase/firestore";
import { db } from "./firebase";
import type { Post, Category, SiteSettings, UserProfile, UserRequest } from "../types";

// ─── Sanitize undefined values ───────────────────────────────────────────────
const san = (o: any) => JSON.parse(JSON.stringify(o, (_,v) => v === undefined ? null : v));

// ─── User helpers ─────────────────────────────────────────────────────────────
export function getLocalUid(): string {
  let uid = localStorage.getItem("jtrick_uid");
  if (!uid) { uid = `u_${Date.now()}_${Math.random().toString(36).slice(2)}`; localStorage.setItem("jtrick_uid", uid); }
  return uid;
}
export function getLocalName(): string { return localStorage.getItem("jtrick_name") || ""; }
export function setLocalName(n: string) { localStorage.setItem("jtrick_name", n); }

// ─── Defaults ────────────────────────────────────────────────────────────────
export const defaultSettings: SiteSettings = {
  siteName: "J Trick Hub",
  siteTagline: "Tech Tips • Free Apps • Tricks & More",
  faviconUrl: "", logoUrl: "", logoIcon: "⚡",
  adminPassword: "admin123",
  theme: "dark",
  colorPrimary: "#6c5ce7",
  colorAccent: "#00cec9",
  fontDisplay: "Syne",
  fontBody: "Inter",
  googleFontsUrl: "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap",
  heroTitle: "J Trick Hub",
  heroSubtitle: "Tech Tips, Free Apps, Tricks & Much More 🚀",
  requireUserName: true,
  showUserRequests: true,
  maintenanceMode: false,
  footerText: "",
  customCSS: "",
  socialLinks: {},
  announcementBar: "",
  announcementBarEnabled: false,
};

export const defaultCategories: Category[] = [
  { id: "tech-tips",       name: "Tech Tips",        icon: "💡", color: "#6c5ce7", description: "Latest tech tricks & tips", order: 1 },
  { id: "free-platforms",  name: "Free Platforms",   icon: "🆓", color: "#00b894", description: "Free streaming & tools", order: 2 },
  { id: "apks",            name: "APKs",             icon: "📱", color: "#0071eb", description: "Android apps & mods", order: 3 },
  { id: "software",        name: "Software",         icon: "💻", color: "#e17055", description: "PC software & tools", order: 4 },
  { id: "tricks",          name: "Tricks",           icon: "🪄", color: "#fd79a8", description: "Hidden tricks & hacks", order: 5 },
  { id: "earning",         name: "Earn Online",      icon: "💰", color: "#f39c12", description: "Online earning methods", order: 6 },
  { id: "entertainment",   name: "Entertainment",    icon: "🎬", color: "#e50914", description: "Movies & streaming", order: 7 },
  { id: "social-media",    name: "Social Media",     icon: "📲", color: "#e84393", description: "Instagram, YouTube tips", order: 8 },
  { id: "cybersecurity",   name: "Cybersecurity",    icon: "🔐", color: "#2d3436", description: "Privacy & security", order: 9 },
  { id: "ai-tools",        name: "AI Tools",         icon: "🤖", color: "#00cec9", description: "AI apps & prompts", order: 10 },
];

// ─── Posts ────────────────────────────────────────────────────────────────────
export function subscribePosts(cb: (posts: Post[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, "trick_posts"), orderBy("publishedAt", "desc")),
    snap => cb(snap.docs.map(d => ({ ...d.data(), id: d.id } as Post))),
    e => { console.error(e); cb([]); }
  );
}
export function subscribePostsByCategory(catId: string, cb: (posts: Post[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, "trick_posts"), where("category","==",catId), where("status","==","published"), orderBy("publishedAt","desc")),
    snap => cb(snap.docs.map(d => ({ ...d.data(), id: d.id } as Post))),
    () => cb([])
  );
}
export async function getPost(id: string): Promise<Post | null> {
  const snap = await getDoc(doc(db, "trick_posts", id));
  return snap.exists() ? { ...snap.data(), id: snap.id } as Post : null;
}
export async function savePost(post: Post): Promise<void> {
  const { id, ...rest } = post;
  await setDoc(doc(db, "trick_posts", id), san(rest), { merge: true });
}
export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, "trick_posts", id));
}
export async function incrementPostViews(id: string): Promise<void> {
  try { await updateDoc(doc(db, "trick_posts", id), { views: increment(1) }); } catch {}
}
export async function toggleLike(postId: string): Promise<boolean> {
  const uid = getLocalUid();
  const ref = doc(db, "trick_posts", postId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  const likes: string[] = snap.data().likes || [];
  const liked = likes.includes(uid);
  await updateDoc(ref, { likes: liked ? likes.filter(u => u !== uid) : [...likes, uid] });
  return !liked;
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function subscribeCategories(cb: (cats: Category[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, "trick_categories"), orderBy("order")),
    async snap => {
      if (snap.empty) { await seedCategories(); cb(defaultCategories); }
      else cb(snap.docs.map(d => ({ ...d.data(), id: d.id } as Category)));
    },
    () => cb(defaultCategories)
  );
}
export async function saveCategories(cats: Category[]): Promise<void> {
  const batch = writeBatch(db);
  const snap = await getDocs(collection(db, "trick_categories"));
  snap.docs.forEach(d => batch.delete(d.ref));
  cats.forEach(c => batch.set(doc(db, "trick_categories", c.id), san(c)));
  await batch.commit();
}
async function seedCategories() {
  const batch = writeBatch(db);
  defaultCategories.forEach(c => batch.set(doc(db, "trick_categories", c.id), san(c)));
  await batch.commit();
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export function subscribeSettings(cb: (s: SiteSettings) => void): Unsubscribe {
  return onSnapshot(
    doc(db, "trick_config", "settings"),
    snap => cb(snap.exists() ? { ...defaultSettings, ...snap.data() } as SiteSettings : defaultSettings),
    () => cb(defaultSettings)
  );
}
export async function saveSettings(s: SiteSettings): Promise<void> {
  await setDoc(doc(db, "trick_config", "settings"), san(s), { merge: true });
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function getOrCreateUser(uid: string, name: string): Promise<UserProfile> {
  const ref = doc(db, "trick_users", uid);
  const snap = await getDoc(ref);
  const now = new Date().toISOString();
  if (snap.exists()) {
    await setDoc(ref, { displayName: name || snap.data().displayName, lastSeen: now }, { merge: true });
    return { ...snap.data(), uid, displayName: name || snap.data().displayName } as UserProfile;
  }
  const profile: UserProfile = { uid, displayName: name, createdAt: now, lastSeen: now, isBlocked: false, readHistory: [], bookmarks: [], likedPosts: [] };
  await setDoc(ref, san(profile));
  return profile;
}
export function subscribeUsers(cb: (u: UserProfile[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, "trick_users"), orderBy("lastSeen","desc")),
    snap => cb(snap.docs.map(d => ({ ...d.data(), uid: d.id } as UserProfile))),
    () => cb([])
  );
}
export async function blockUser(uid: string) { await setDoc(doc(db,"trick_users",uid),{isBlocked:true,blockedAt:new Date().toISOString()},{merge:true}); }
export async function unblockUser(uid: string) { await setDoc(doc(db,"trick_users",uid),{isBlocked:false,blockedAt:null},{merge:true}); }
export async function isUserBlocked(uid: string): Promise<boolean> {
  try { const s=await getDoc(doc(db,"trick_users",uid)); return s.exists()?(s.data() as UserProfile).isBlocked:false; } catch { return false; }
}

// ─── Requests ──────────────────────────────────────────────────────────────────
export async function submitRequest(req: Omit<UserRequest,"id">): Promise<void> {
  const id=`req_${Date.now()}`;
  await setDoc(doc(db,"trick_requests",id),san({...req,id}));
}
export function subscribeRequests(cb: (r: UserRequest[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db,"trick_requests"),orderBy("createdAt","desc")),
    snap=>cb(snap.docs.map(d=>d.data() as UserRequest)),
    ()=>cb([])
  );
}
export async function updateRequestStatus(id:string,status:"approved"|"rejected",reply?:string) {
  await setDoc(doc(db,"trick_requests",id),{status,adminReply:reply||null},{merge:true});
}
export async function deleteRequest(id:string) { await deleteDoc(doc(db,"trick_requests",id)); }

// ─── Bookmarks ────────────────────────────────────────────────────────────────
export async function toggleBookmark(postId: string): Promise<boolean> {
  const uid = getLocalUid();
  const ref = doc(db,"trick_users",uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  const bm: string[] = snap.data().bookmarks || [];
  const has = bm.includes(postId);
  await setDoc(ref,{bookmarks: has?bm.filter(b=>b!==postId):[...bm,postId]},{merge:true});
  return !has;
}
export async function getBookmarks(uid: string): Promise<string[]> {
  const snap = await getDoc(doc(db,"trick_users",uid));
  return snap.exists()?(snap.data().bookmarks||[]):[];
}

// ─── Festival Icons ───────────────────────────────────────────────────────────
export const FESTIVAL_ICONS = [
  {icon:"⚡",name:"Lightning",cat:"Tech"},{icon:"🚀",name:"Rocket",cat:"Tech"},{icon:"💡",name:"Bulb",cat:"Tech"},
  {icon:"🤖",name:"Robot",cat:"Tech"},{icon:"💻",name:"Laptop",cat:"Tech"},{icon:"🔥",name:"Fire",cat:"Tech"},
  {icon:"💎",name:"Diamond",cat:"Tech"},{icon:"🌟",name:"Star",cat:"Tech"},{icon:"🎯",name:"Target",cat:"Tech"},
  {icon:"🪔",name:"Diwali",cat:"Indian"},{icon:"🎆",name:"Fireworks",cat:"Indian"},{icon:"🌸",name:"Pongal",cat:"Indian"},
  {icon:"🐘",name:"Ganesh",cat:"Indian"},{icon:"🕉️",name:"Om",cat:"Indian"},{icon:"🪷",name:"Lotus",cat:"Indian"},
  {icon:"☪️",name:"Eid",cat:"Indian"},{icon:"🏮",name:"Karthigai",cat:"Indian"},{icon:"🌙",name:"Ramadan",cat:"Indian"},
  {icon:"🎄",name:"Christmas",cat:"World"},{icon:"🎅",name:"Santa",cat:"World"},{icon:"🎃",name:"Halloween",cat:"World"},
  {icon:"🧧",name:"Chinese NY",cat:"World"},{icon:"💝",name:"Valentine",cat:"World"},{icon:"🎉",name:"New Year",cat:"World"},
];
export const ICON_CATS = ["Tech","Indian","World"];

// ─── Font Presets ─────────────────────────────────────────────────────────────
export const FONT_PRESETS = [
  {display:"Syne",body:"Inter",url:"https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"},
  {display:"Space Grotesk",body:"DM Sans",url:"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"},
  {display:"Outfit",body:"Nunito",url:"https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap"},
  {display:"Raleway",body:"Lato",url:"https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&family=Lato:wght@400;700&display=swap"},
  {display:"Bebas Neue",body:"Open Sans",url:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:wght@400;600&display=swap"},
  {display:"Oxanium",body:"Exo 2",url:"https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700&family=Exo+2:wght@400;500;600&display=swap"},
  {display:"Josefin Sans",body:"Mulish",url:"https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600;700&family=Mulish:wght@400;500;600&display=swap"},
  {display:"Kanit",body:"Sarabun",url:"https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Sarabun:wght@400;500;600&display=swap"},
];
