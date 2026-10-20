# 🚀 PANDUAN LENGKAP DEPLOYMENT KE HOSTINGER & SETTING DATABASE
## Sistem Informasi Monitoring Pekerjaan (SIMON - SATUPUTARU)
**Dinas Pekerjaan Umum dan Penataan Ruang (DINPUTARU) Kabupaten Demak**

Dokumen ini memuat panduan langkah-demi-langkah bagi Administrator Sistem / Tim IT Dinas untuk mempublikasikan aplikasi **SIMON - SATUPUTARU** ke layanan web hosting **Hostinger** (baik paket *Single/Premium/Business Web Hosting* maupun *Cloud Hosting*).

---

## 📋 DAFTAR ISI
1. Hasil Pengujian Sistem (Testing & Verifikasi)
2. Arsitektur Deployment Hostinger
3. Langkah 1: Menyiapkan File Bundle Produksi (`dist/`)
4. Langkah 2: Membuat Database MySQL di Hostinger hPanel
5. Langkah 3: Import Skema Database via phpMyAdmin Hostinger
6. Langkah 4: Konfigurasi File Koneksi Database (`api/config.php`)
7. Langkah 5: Upload Berkas ke Folder `public_html` Hostinger
8. Langkah 6: Memastikan File `.htaccess` Terpasang
9. Langkah 7: Pengujian Live & Akun Akses Awal
10. Troubleshooting & Pemecahan Masalah

---

## 1. Hasil Pengujian Sistem (Testing & Verifikasi)

Pengujian menyeluruh telah dijalankan pada seluruh modul aplikasi:
- **Kompilasi & Build Produksi**: Perintah `npm run build` berjalan **100% SUKSES** tanpa error dalam **895 ms**.
- **Audit Kode & Linter**: **0 Sintaks Error**.
- **Fitur Baru & Penyempurnaan yang Teruji**:
  1. **Master Data Pekerjaan**: Berfungsi sebagai *Single Source of Truth*. Tombol tambah paket di 4 menu monitoring telah dialihkan secara disiplin ke Master Data.
  2. **Identitas & Branding**: Nama aplikasi telah resmi diselaraskan menjadi **SIMON - SATUPUTARU** di seluruh antarmuka dan laporan.
  3. **Sorotan Beranda Publik**: Dibatasi maksimal **10 paket** secara default, dan kuota ini dapat diatur oleh Super Admin melalui panel pengaturan.
  4. **Pimpinan Dinas di Super Admin**: Pengaturan Nama Lengkap, Gelar, NIP, Pangkat/Golongan, dan Jabatan untuk **Kepala Dinas** dan **Sekretaris Dinas** tersinkronisasi otomatis ke lembar tanda tangan cetak.
  5. **8 Format Laporan Kedinasan**: Berjalan responsif lengkap dengan filter bidang, tagging, label murni/perubahan, sebaran kecamatan, deviasi kritis, serta ekspor CSV dan cetak PDF kop resmi.

---

## 2. Arsitektur Deployment Hostinger

Aplikasi didesain menggunakan **Hybrid Storage Architecture**:
- **Frontend**: Single Page Application (React 19 + Vite), sangat ringan dan cepat diakses.
- **Backend API**: PHP 8.x Native (bawaan Hostinger, tanpa perlu install Node.js server atau VPS).
- **Database**: MySQL / MariaDB Hostinger yang terpusat sehingga data yang diinput Koordinator Bidang langsung terlihat oleh Kepala Dinas dan Sekretaris secara real-time.
- **Cadangan Offline**: Browser LocalStorage secara otomatis mencadangkan data lokal jika koneksi ke server sedang mengalami gangguan.

---

## Langkah 1: Menyiapkan File Bundle Produksi (`dist/`)

Sebelum mengunggah, pastikan Anda telah menjalankan perintah build di komputer lokal:
```bash
npm run build
```

Folder **`dist/`** yang dihasilkan telah berisi berkas lengkap berikut:
```text
dist/
├── .htaccess                 <- Konfigurasi URL rewriting Apache Hostinger
├── favicon.svg               <- Ikon resmi aplikasi
├── icons.svg                 <- Simbol visual
├── index.html                <- Titik masuk aplikasi web
├── api/
│   ├── config.php            <- Konfigurasi kredensial MySQL Hostinger
│   └── api.php               <- Handler REST API database terpusat
└── assets/
    ├── index-DIsXCrwj.css    <- Gaya CSS terkompresi
    └── index-DbV7KZak.js     <- Bundle JavaScript aplikasi terkompresi
```

---

## Langkah 2: Membuat Database MySQL di Hostinger hPanel

1. Masuk ke dashboard **Hostinger hPanel** (https://hpanel.hostinger.com).
2. Pilih paket hosting Anda, lalu klik menu **Databases** di bilah navigasi kiri -> **Manajemen Database**.
3. Di bagian **Buat Database MySQL Baru**:
   - **Nama Database**: Masukkan akhiran nama database, misalnya `simon` (Hostinger akan otomatis menambahkan prefix akun Anda, misal: `u123456789_simon`).
   - **Nama Pengguna Database**: Masukkan nama user, misal `simon_admin` (menjadi `u123456789_simon_admin`).
   - **Kata Sandi Database**: Buat kata sandi yang kuat (contoh: gabungan huruf besar, kecil, angka, dan simbol).
4. Klik tombol **Buat**.
5. **Catat 3 data penting ini**:
   - Nama Database lengkap: `u123456789_simon`
   - Nama Pengguna lengkap: `u123456789_simon_admin`
   - Kata Sandi yang baru Anda buat.

---

## Langkah 3: Import Skema Database via phpMyAdmin Hostinger

Berkas skrip SQL siap pakai telah disediakan di direktori:
👉 `database/simon_satuputaru.sql`

Langkah melakukan import:
1. Pada halaman **Manajemen Database** di hPanel, temukan database yang baru Anda buat.
2. Klik tombol **Enter phpMyAdmin** di sebelah kanan nama database.
3. Di jendela phpMyAdmin yang terbuka, klik tab **Import** pada menu navigasi atas.
4. Klik tombol **Choose File / Telusuri File**, lalu pilih file `database/simon_satuputaru.sql` dari komputer Anda.
5. Biarkan pengaturan lainnya secara default (*Format: SQL, UTF-8*).
6. Gulir ke bawah dan klik tombol **Import / Kirim**.
7. Pesan sukses hijau akan muncul:
   *`Import has been successfully finished, queries executed.`*

Tabel-tabel berikut otomatis terbentuk lengkap dengan data awal:
- `system_settings`: Pengaturan nama sistem, identitas dinas, dan pimpinan dinas.
- `users`: Daftar akun pengguna (Superadmin, Kadin, Sekdin, Kabid, Koordinator).
- `bidang`: Data 4 Bidang DINPUTARU.
- `master_tags`: Kategori tagging prioritas APBD Kabupaten Demak.
- `projects`: Master Data Pekerjaan lengkap dengan pagu, fisik, keuangan, dan status SPJ.

---

## Langkah 4: Konfigurasi File Koneksi Database (`api/config.php`)

Sebelum mengunggah, buka file `public/api/config.php` (atau buka langsung di File Manager Hostinger setelah diunggah).

Sesuaikan baris 14–17 dengan data yang Anda peroleh dari Langkah 2:
```php
// Konfigurasi Kredensial Database Hostinger
$db_host = 'localhost';               // Hostinger default adalah 'localhost'
$db_name = 'u123456789_simon';        // Ganti dengan Nama Database Hostinger Anda
$db_user = 'u123456789_simon_admin';  // Ganti dengan Nama Pengguna Database Anda
$db_pass = 'KataSandiAnda123!';       // Ganti dengan Kata Sandi Database Anda
$db_port = '3306';
```

---

## Langkah 5: Upload Berkas ke Folder `public_html` Hostinger

Anda dapat mengunggah file menggunakan **File Manager Hostinger** atau **FileZilla (FTP)**.

### Menggunakan File Manager hPanel (Paling Mudah):
1. Di hPanel Hostinger, buka menu **Files** -> **File Manager** -> Pilih domain Anda.
2. Buka folder **`public_html`**.
3. Jika terdapat file default Hostinger (seperti `default.php`), Anda dapat menghapusnya.
4. Di komputer lokal Anda, kompres seluruh isi folder **`dist/`** menjadi berkas `dist.zip`.
   *(Penting: Kompres isinya secara langsung, bukan folder luarnya)*.
5. Klik ikon **Upload** di bilah alat File Manager Hostinger, pilih file `dist.zip`.
6. Klik kanan pada file `dist.zip` yang terunggah, lalu pilih **Extract**.
7. Pastikan struktur di dalam `public_html/` adalah:
   - `public_html/index.html`
   - `public_html/.htaccess`
   - `public_html/api/`
   - `public_html/assets/`
8. Hapus file `dist.zip` setelah proses ekstrak selesai.

---

## Langkah 6: Memastikan File `.htaccess` Terpasang

Karena aplikasi SIMON dibangun menggunakan React Router (*Single Page Application*), file **`.htaccess`** sangat penting agar saat pengguna membuka link langsung (misal: `https://domainanda.com/master-pekerjaan`) atau menekan tombol F5 / Refresh browser, server tidak mengembalikan pesan error **404 Not Found**.

File `.htaccess` yang telah kami siapkan di dalam `public/` dan `dist/` memiliki konfigurasi standar Apache Rewrite:
```apache
Options -Indexes

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Abaikan rewrite untuk backend API
  RewriteCond %{REQUEST_URI} ^/api/ [NC]
  RewriteRule ^ - [L]

  # Lewatkan file statis nyata
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Arahkan semua request halaman kembali ke index.html
  RewriteRule ^ index.html [L]
</IfModule>
```

---

## Langkah 7: Pengujian Live & Akun Akses Awal

### 1. Uji Koneksi API Database
Buka peramban dan akses alamat berikut:
```text
https://namadomainanda.com/api/api.php?action=health
```
Jika konfigurasi database benar, browser akan menampilkan respon JSON sukses:
```json
{
  "status": "success",
  "connected": true,
  "message": "Koneksi database MySQL Hostinger Berhasil!",
  "server_time": "2026-10-19 16:15:00"
}
```

### 2. Akun Login Bawaan untuk Uji Coba:
| Peran (Role) | Username | Password Default | Pejabat Terkait |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` | `admin123` | Administrator Sistem Dinas |
| **Kepala Dinas** | `kadin` | `pupr2025` | Ir. H. Achmad Syafii, CES, MT |
| **Sekretaris Dinas** | `sekretaris` | `pupr2025` | Dra. Hj. Siti Nurhasanah, MM |
| **Kabid Bina Marga** | `kabid.bm` | `pupr2025` | Ir. Dwi Prasetyo, MT |
| **Koordinator / PPK BM**| `koord.bm` | `pupr2025` | Agus Suryanto, ST |

---

## Troubleshooting & Pemecahan Masalah

1. **Muncul Error "404 Not Found" Saat Halaman Direfresh**:
   Pastikan file `.htaccess` berada di dalam folder `public_html/`. Di File Manager Hostinger, aktifkan opsi *Show Hidden Files*.

2. **Respon API: "Koneksi database gagal: Access denied for user"**:
   Periksa kembali nama database, user, dan kata sandi di file `api/config.php`. Pastikan awalan akun Hostinger disertakan (misal `u123456789_simon`).

3. **Halaman Kosong (Blank Screen)**:
   Pastikan seluruh isi folder `dist/assets/` terunggah lengkap ke dalam `public_html/assets/`.

4. **Mengaktifkan SSL HTTPS Gratis**:
   Di hPanel Hostinger, masuk ke menu **Keamanan** -> **SSL**, lalu aktifkan opsi **Paksa HTTPS (Force HTTPS)**.
