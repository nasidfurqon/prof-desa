# User Experience (UX) & Animation Guidelines

Website harus memiliki pengalaman pengguna (User Experience) yang modern, halus, dan profesional. Hindari tampilan yang kaku atau perubahan halaman yang terasa mendadak.

## General Animation

Gunakan animasi ringan (subtle animation) pada setiap elemen yang muncul di layar.

Animasi harus:

- Halus
- Cepat (200–500 ms)
- Tidak berlebihan
- Konsisten di seluruh halaman

---

## Scroll Reveal Animation

Ketika pengguna melakukan scroll ke bawah, elemen akan muncul secara bertahap menggunakan animasi.

Contoh elemen yang menggunakan animasi:

- Section Title
- Card Organisasi
- Card UMKM
- Card Sekolah
- Card Berita
- Maps
- Gallery
- Statistik
- Footer

Animasi yang direkomendasikan:

- Fade In
- Fade Up
- Fade Left
- Fade Right
- Scale In

Animasi hanya dijalankan ketika elemen pertama kali masuk ke viewport.

---

## Hover Animation

Semua card memiliki efek hover.

Contoh:

- Card sedikit terangkat
- Shadow bertambah
- Gambar sedikit zoom
- Tombol berubah warna

Hover harus terasa natural dan tidak terlalu agresif.

---

## Image Animation

Thumbnail memiliki efek:

- Smooth Zoom
- Overlay Gradient
- Hover Brightness

---

## Button Animation

Seluruh button memiliki:

- Smooth Transition
- Hover Color
- Scale 1.03x
- Active State

---

## Navbar

Navbar bersifat sticky.

Ketika halaman di-scroll:

- Background berubah menjadi solid
- Shadow muncul secara halus
- Transition sekitar 300 ms

---

## Carousel Animation

Carousel "Jelajahi Desa Bawu" menggunakan efek cover flow.

Card tengah:

- Lebih besar
- Shadow lebih kuat
- Sedikit lebih tinggi

Card samping:

- Lebih kecil
- Sedikit blur atau opacity lebih rendah

Perpindahan carousel menggunakan animasi yang halus.

---

## Loading State

Seluruh halaman menggunakan Skeleton Loading.

Jangan menggunakan spinner sebagai loading utama.

Contoh:

- Skeleton Card
- Skeleton Image
- Skeleton Text

---

## Page Transition

Perpindahan halaman menggunakan animasi transisi singkat.

Contoh:

- Fade
- Slide
- Opacity Transition

Durasi sekitar 200–300 ms.

---

## Empty State

Jika data kosong, tampilkan ilustrasi sederhana beserta pesan yang informatif.

Contoh:

"Belum ada data yang tersedia."

---

## Error State

Jika terjadi kesalahan saat mengambil data:

- Tampilkan ilustrasi error
- Tombol "Coba Lagi"

---

## Responsive Animation

Animasi harus tetap berjalan dengan baik di:

- Desktop
- Tablet
- Mobile

---

## Accessibility

Hormati preferensi pengguna yang mengaktifkan `prefers-reduced-motion`.

Jika fitur tersebut aktif, animasi harus dikurangi atau dinonaktifkan.

---

## Recommended Libraries

Frontend disarankan menggunakan:

- Framer Motion
- GSAP (hanya jika diperlukan)
- Swiper.js untuk carousel
- React Intersection Observer untuk Scroll Reveal

Prioritaskan Framer Motion sebagai library animasi utama.