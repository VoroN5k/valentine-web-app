# 💖 Valentine Website (Next.js + Supabase)

A small private website for a couple: Valentine card, photo album, moments, and an admin panel for uploading and managing photos.

Built with **Next.js (App Router)** and **Supabase** (Auth + Database + Storage), with protected routes using **middleware**.

---

## 🚀 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **TailwindCSS**
- **Supabase**
  - Auth (email/password)
  - Database (Postgres)
  - Storage (bucket: `photos`)
- Route protection via `middleware.ts` using **`@supabase/ssr`**

---

## ✨ Features

### 🌸 Public Pages
- Home page (Valentine card)
- Moments page

### 🔒 Protected Pages (Authenticated Only)
- `/album` — photo album
- `/admin/dashboard` — admin panel:
  - Drag & Drop uploader
  - Upload modal (optional caption)
  - Gallery view
  - Delete photos (Storage + DB)
  - Logout

### 🛡️ Security / Access Control
- Middleware blocks protected pages if no session exists
- `/admin` automatically redirects to `/admin/dashboard` if already logged in
- Main navbar hides the **Album** link if the user is not authenticated

---

**Beta features**: public wishlist page
