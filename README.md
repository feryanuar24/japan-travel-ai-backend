Japan Travel AI Backend
=======================

Deskripsi
---------

Backend API sederhana untuk proyek "Japan Travel AI". Menyediakan endpoint otentikasi, profil, dan itinerary.

Quickstart
----------

- Prasyarat: `Node.js` v18+ dan `npm` atau `pnpm`.
- Install dependensi:

```bash
npm install
```

- Menjalankan aplikasi (development):

```bash
npm run dev
```

Testing
-------

- Menjalankan test unit dengan `vitest`:

```bash
npm test
```

Konfigurasi
-----------

- Salin variabel environment dari `.env.example` (jika ada) dan atur konfigurasi database serta email di `config/`.

Struktur Singkat
----------------

- `src/` : kode sumber
- `src/controllers` : logika endpoint
- `src/routes` : definisi route
- `src/services` : layanan seperti pengiriman email
- `src/models` : model data

Kontak
------

Untuk pertanyaan, buat issue di repository atau hubungi pemilik proyek.

Lisensi
-------

Periksa file `LICENSE` jika tersedia.
