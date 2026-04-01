export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;           // HTML/markdown content
  thumbnail: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
  pinned: boolean;
  views: number;
  likes: string[];           // user IDs
  status: 'published' | 'draft';
  links: PostLink[];         // download/external links
  embedUrl?: string;         // YouTube or any embed
  embedType?: 'youtube' | 'iframe' | 'none';
  downloadLinks?: DownloadLink[];
}

export interface PostLink {
  label: string;
  url: string;
  type: 'download' | 'external' | 'telegram' | 'drive' | 'apk' | 'website';
}

export interface DownloadLink {
  label: string;
  url: string;
  size?: string;
  version?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  order: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  createdAt: string;
  lastSeen: string;
  isBlocked: boolean;
  blockedAt?: string;
  readHistory: string[];
  bookmarks: string[];
  likedPosts: string[];
}

export interface UserRequest {
  id: string;
  uid: string;
  userName: string;
  type: 'post_request' | 'bug_report' | 'feedback' | 'other';
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminReply?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  faviconUrl: string;
  logoUrl: string;
  logoIcon: string;
  adminPassword: string;
  theme: 'dark' | 'light' | 'amoled';
  colorPrimary: string;
  colorAccent: string;
  fontDisplay: string;
  fontBody: string;
  googleFontsUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  requireUserName: boolean;
  showUserRequests: boolean;
  maintenanceMode: boolean;
  footerText: string;
  customCSS: string;
  socialLinks: {
    youtube?: string;
    telegram?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    github?: string;
  };
  announcementBar: string;
  announcementBarEnabled: boolean;
}
