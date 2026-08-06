# Website Profil Desa Bawu

Monorepo (npm workspaces) berisi:

- `backend/` — Express + TypeScript + Prisma (PostgreSQL)
- `frontend/` — React + Vite + TypeScript + TailwindCSS

## Prasyarat

- Node.js 18+
- PostgreSQL berjalan secara lokal, dengan sebuah database kosong (misal `desa_bawu`)

## Setup

1. Install semua dependency (root + workspaces):

   ```
   npm install
   ```

2. Konfigurasi backend:

   ```
   cd backend
   copy .env.example .env
   ```

   Edit `backend/.env` dan sesuaikan `DATABASE_URL` dengan kredensial PostgreSQL Anda, serta `JWT_SECRET` dengan string acak.

3. Jalankan migrasi dan seed database:

   ```
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

   Seed akan membuat akun admin default: **admin@desabawu.id** / **admin123**, serta konten halaman awal (Visi, Misi, Sejarah).

4. Konfigurasi frontend:

   ```
   cd ../frontend
   copy .env.example .env
   ```

   Sesuaikan `VITE_API_URL` bila backend tidak berjalan di `http://localhost:4000`.

## Menjalankan Aplikasi

Dari root folder, di dua terminal terpisah:

```
npm run dev:backend
npm run dev:frontend
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173
- Dashboard admin: http://localhost:5173/dashboard/login

## Status Implementasi

Fitur yang sudah lengkap (backend + frontend): autentikasi JWT, manajemen halaman (Visi/Misi/Sejarah), peta interaktif, dan CRUD Organisasi (lengkap dengan upload gambar dan koordinat lokasi) sebagai referensi pola untuk modul lain.

Modul UMKM, Sekolah, Berita, dan User masih berupa stub (skema database sudah tersedia, endpoint mengembalikan `501 Not Implemented`, halaman frontend menampilkan placeholder). Modul-modul ini mengikuti pola yang sama persis dengan modul Organisasi (`backend/src/{routes,controllers,services,repositories}/organization.*` dan `frontend/src/{pages/dashboard/Organizations.tsx,components/dashboard/OrganizationForm.tsx}`) dan dapat dikembangkan dengan mereplikasi pola tersebut.
