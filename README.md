# J Trick Hub ⚡

A complete Tech Blog & Content Platform with Admin Panel.

## Features
- 📝 Rich Post Editor (HTML, links, embed video, download links)
- 🎯 10+ Tech Categories (APKs, Tips, Earning, AI Tools etc.)
- 👥 User Management (block/unblock, name-gate)
- 📩 User Request System
- 🎨 Full Theme Customization (colors, fonts, dark/light/AMOLED)
- ✨ Festival Icons (Indian + World)
- 📡 Firebase real-time sync
- 🔒 Admin-only panel

## Setup

```bash
npm install
npm run dev
```

## Deploy

**GitHub Pages:**
1. Push to GitHub → Settings → Pages → GitHub Actions
2. Add Variable: VITE_BASE = `/j-trick-hub/`

**Vercel (Recommended):**
1. Import repo → Deploy → Done!

## Admin
Go to `/admin` — Default password: `admin123`
Change it in Settings after login!

## Firebase Rules (Required!)
In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
