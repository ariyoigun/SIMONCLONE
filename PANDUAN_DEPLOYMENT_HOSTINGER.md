# 🚀 PANDUAN LENGKAP DEPLOYMENT KE GITHUB & HOSTING (HOSTINGER / cPANEL)
## Sistem Informasi Monitoring Pekerjaan (SIMON - SATUPUTARU)
**Dinas Pekerjaan Umum dan Penataan Ruang (DINPUTARU) Kabupaten Demak**

Dokumen ini memuat panduan komprehensif bagi Administrator Sistem / Tim IT Dinas untuk mempublikasikan kode ke **GitHub**, mendeploy aplikasi ke **Web Hosting (Hostinger / cPanel)**, mengimpor database MySQL, serta melakukan **pengujian koneksi database secara visual dan otomatis**.

---

## 📋 DAFTAR ISI
1. [Ringkasan Perbaikan & Update Sistem](#1-ringkasan-perbaikan--update-sistem)
2. [Langkah 1: Deploy & Push Kode ke GitHub](#langkah-1-deploy--push-kode-ke-github)
3. [Langkah 2: Paket Siap Upload (deploy_simon_satuputaru.zip)](#langkah-2-paket-siap-upload-deploysimonsatuputaruzip)
4. [Langkah 3: Membuat Database MySQL di Hosting (Hostinger / cPanel)](#langkah-3-membuat-database-mysql-di-hosting-hostinger--cpanel)
5. [Langkah 4: Import Database via phpMyAdmin](#langkah-4-import-database-via-phpmyadmin)
6. [Langkah 5: Konfigurasi Kredensial Database (`api/config.php`)](#langkah-5-konfigurasi-kredensial-database-apiconfigphp)
7. [Langkah 6: Upload Berkas ke Folder `public_html`](#langkah-6-upload-berkas-ke-folder-public_html)
8. [Langkah 7: Testing Koneksi Database Interaktif (`/api/test_db.php`)](#langkah-7-testing-koneksi-database-interaktif-apitest_dbphp)
9. [Langkah 8: Akun Akses Awal & Kredensial Bawaan](#langkah-8-akun-akses-awal--kredensial-bawaan)
10. [Troubleshooting & Solusi Kendala](#troubleshooting--solusi-kendala)

---

## 1. Ringkasan Perbaikan & Update Sistem

Pembaruan terbaru yang telah diterapkan:
- **Perbaikan Menu Pra-Kontrak (Fixed Blank Screen)**:
  - Mengatasi error referensi variabel `preContractProjects` yang sebelumnya menyebabkan halaman Pra-Kontrak menjadi layar putih polos (*blank white*).
  - Menambahkan *status pills* informatif (Total Paket Belum Kontrak, Tender/Seleksi, Pengadaan Langsung/PL, dan E-Katalog).
- **Penghapusan Penomoran Urut Menu**:
  - Seluruh label navigasi di sidebar dan judul modul telah dibersihkan dari angka urut:
    - `Pekerjaan Pra-Kontrak` (sebelumnya *1. Pekerjaan Pra-Kontrak*)
    - `Progres Fisik` (sebelumnya *2. Progres Fisik*)
    - `Progres Keuangan` (sebelumnya *3. Progres Keuangan*)
    - `Administrasi SPJ Keuangan` (sebelumnya *4. Administrasi SPJ Keuangan*)
    - `Ringkasan SIPD` (sebelumnya *5. Ringkasan SIPD*)
- **Penambahan Skrip Diagnostik Database (`test_db.php`)**:
  - Skrip pengujian koneksi MySQL otomatis dan visual untuk memverifikasi host, user, database, dan tabel data secara real-time.

---

## Langkah 1: Deploy & Push Kode ke GitHub

Kode program terhubung ke repositori GitHub:
🔗 **`https://github.com/ariyoigun/Monitoring-Pekerjaan.git`** (Branch: `main`)

Jalankan perintah berikut di terminal (PowerShell atau Git Bash) di direktori proyek:

```bash
# 1. Pastikan seluruh perubahan file telah ditandai
git add .

# 2. Buat commit perubahan terbaru
git commit -m "Fix: Menu Pra-Kontrak blank screen, hilangkan penomoran menu, tambah test_db.php, dan update panduan deployment"

# 3. Kirim ke repositori GitHub
git push origin main
```

> [!NOTE]
> Jika sistem meminta kredensial GitHub, masukkan Personal Access Token (PAT) atau otorisasi via browser.

---

## Langkah 2: Paket Siap Upload (`deploy_simon_satuputaru.zip`)

Untuk mempermudah dan mempercepat proses tanpa perlu build manual di hosting, berkas ZIP siap pakai telah otomatis dibuat di root proyek:
📦 **`deploy_simon_satuputaru.zip`** (Ukuran ~365 KB)

Jika sewaktu-waktu Anda mengedit kode di komputer lokal dan ingin membuat ulang paket deployment:
```bash
# Jalankan kompilasi produksi
npm run build

# Kompres isi folder dist ke file ZIP (PowerShell)
Compress-Archive -Path "dist/*" -DestinationPath "deploy_simon_satuputaru.zip" -Force
```

Isi di dalam paket `deploy_simon_satuputaru.zip`:
```text
├── index.html                <- Titik masuk aplikasi React SPA
├── .htaccess                 <- Konfigurasi URL rewrite Apache Hostinger/cPanel
├── favicon.svg               <- Favicon resmi aplikasi
├── icons.svg                 <- Ikon vektor
├── assets/                   <- Bundle JavaScript & CSS teroptimasi
└── api/
    ├── config.php            <- Pengaturan koneksi MySQL
    ├── api.php               <- REST API simon
    └── test_db.php           <- Tools visual penguji koneksi database
```

---

## Langkah 3: Membuat Database MySQL di Hosting (Hostinger / cPanel)

### A. Jika Menggunakan Hostinger hPanel:
1. Buka [https://hpanel.hostinger.com](https://hpanel.hostinger.com) dan pilih paket hosting Anda.
2. Masuk ke menu **Databases** -> **Kelola Database** / **MySQL Databases**.
3. Di bagian **Buat Database & Pengguna MySQL Baru**:
   - **Nama Database**: masukkan misalnya `simon` (nama akhir akan menjadi `uXXXXX_simon`).
   - **Nama Pengguna**: masukkan misalnya `simon_admin` (nama akhir akan menjadi `uXXXXX_simon_admin`).
   - **Kata Sandi**: buat kata sandi yang kuat dan aman.
4. Klik tombol **Buat**.
5. **Catat 3 data penting**:
   - Nama Database lengkap: `uXXXXX_simon`
   - User Database lengkap: `uXXXXX_simon_admin`
   - Kata Sandi Database.

### B. Jika Menggunakan cPanel:
1. Buka cPanel hosting Anda -> menu **MySQL Database Wizard**.
2. Masukkan nama database (misal `namadomain_simon`) -> Next Step.
3. Masukkan username database & password -> Create User.
4. Centang **ALL PRIVILEGES** (Semua Hak Akses) -> Make Changes.

---

## Langkah 4: Import Database via phpMyAdmin

Skrip SQL lengkap beserta struktur tabel dan data awal master telah disediakan di direktori:
👉 `database/simon_satuputaru.sql`

Langkah-langkah import:
1. Di hPanel Hostinger / cPanel, klik tombol **Enter phpMyAdmin** di sebelah database yang baru dibuat.
2. Pilih nama database Anda di panel sebelah kiri.
3. Klik tab **Import** pada menu navigasi atas.
4. Klik tombol **Choose File** / **Browse**, lalu pilih berkas `database/simon_satuputaru.sql`.
5. Pastikan format adalah **SQL** dan encoding **utf-8**.
6. Gulir ke bawah lalu klik tombol **Import** / **Kirim**.
7. Tunggu beberapa detik sampai muncul notifikasi hijau:
   *`Import has been successfully finished, queries executed.`*

Tabel-tabel yang otomatis dibuat:
- `system_settings`: Identitas DINPUTARU, pimpinan dinas (Kadin & Sekdin), kuota sorotan.
- `bidang`: 4 Bidang teknis (Bina Marga, Cipta Karya, SDA-BK, Tata Ruang) + Sekretariat.
- `users`: Data login Superadmin, Kadin, Sekdin, Kabid, dan Koordinator/PPK.
- `projects`: Master Data Pekerjaan (paket kegiatan, anggaran, progres fisik, termin SP2D, administrasi SPJ).
- `sipd_programs`, `sipd_kegiatan`, `sipd_sub_kegiatan`: Nomenklatur hierarki SIPD.
- `years`: Master tahun anggaran (2024, 2025, 2026).

---

## Langkah 5: Konfigurasi Kredensial Database (`api/config.php`)

Agar sistem terhubung ke database hosting:

1. Buka file **`api/config.php`** (dapat diedit langsung lewat File Manager Hosting).
2. Ubah baris konfigurasi sesuai data database yang Anda buat di Langkah 3:
   ```php
   // Konfigurasi Kredensial Database Hosting
   $db_host = 'localhost';               // Default hosting biasanya 'localhost' atau '127.0.0.1'
   $db_name = 'uXXXXX_simon';            // Ganti dengan Nama Database hosting Anda
   $db_user = 'uXXXXX_simon_admin';      // Ganti dengan Nama Pengguna Database Anda
   $db_pass = 'KataSandiAnda123!';       // Ganti dengan Kata Sandi Database Anda
   $db_port = '3306';
   ```

> [!TIP]
> **Metode Alternatif `config.local.php`**:
> Anda juga dapat membuat file baru bernama **`config.local.php`** di dalam folder `api/` yang berisi variabel di atas. File ini telah dimasukkan ke dalam `.gitignore` sehingga aman dan tidak akan tertimpa saat melakukan update Git.

---

## Langkah 6: Upload Berkas ke Folder `public_html`

1. Buka **File Manager** di hPanel / cPanel -> masuk ke direktori **`public_html`**.
2. Jika ada berkas bawaan hosting (seperti `default.php`), silakan hapus atau pindahkan.
3. Klik tombol **Upload**, lalu pilih berkas:
   📦 **`deploy_simon_satuputaru.zip`**
4. Setelah terupload, klik kanan pada file `deploy_simon_satuputaru.zip` -> pilih **Extract**.
5. Pastikan susunan folder di `public_html/` adalah sebagai berikut:
   ```text
   public_html/
   ├── index.html
   ├── .htaccess
   ├── favicon.svg
   ├── icons.svg
   ├── api/
   │   ├── config.php
   │   ├── api.php
   │   └── test_db.php
   ├── assets/
   │   ├── index-xxxx.css
   │   └── index-xxxx.js
   └── templates/
   ```
6. Hapus file `deploy_simon_satuputaru.zip` dari server untuk menghemat ruang penyimpanan.

---

## Langkah 7: Testing Koneksi Database Interaktif (`/api/test_db.php`)

Kami telah menyediakan skrip pengujian visual khusus. Anda cukup membuka peramban web:

🌐 **`https://domain-anda.com/api/test_db.php`**

### Indikator Keberhasilan Pengujian:
1. **Status Banner**: Berwarna hijau bertuliskan:
   `✅ Koneksi ke database MySQL berhasil! (MySQL/MariaDB X.X.X)`
2. **Parameter Koneksi**: Menampilkan host, nama database, user, dan versi PHP hosting yang aktif.
3. **Status Tabel Database**:
   - `system_settings` -> Ready / Ada
   - `bidang` -> Ready / Ada
   - `users` -> Ready / Ada
   - `projects` -> Ready / Ada
   - `sipd_programs` -> Ready / Ada
   - `sipd_kegiatan` -> Ready / Ada
   - `sipd_sub_kegiatan` -> Ready / Ada
   - `years` -> Ready / Ada

> Jika terdapat kendala, halaman ini akan otomatis menampilkan kotak merah berisi rincian penyebab error beserta langkah perbaikannya secara jelas.

---

## Langkah 8: Akun Akses Awal & Kredensial Bawaan

Setelah koneksi database terverifikasi sukses, buka halaman utama:
🌐 **`https://domain-anda.com`**

Gunakan akun resmi berikut untuk masuk:

| Peran (Role) | Username | Password Default | Keterangan & Pejabat |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `pupr2025` | Administrator Sistem Dinas (Akses Penuh Master & Konfigurasi) |
| **Kepala Dinas** | `kadin` | `pupr2025` | Ir. H. Achmad Syafii, CES, MT (Dashboard & Pengambilan Kebijakan) |
| **Sekretaris Dinas** | `sekretaris` | `pupr2025` | Dra. Hj. Siti Nurhasanah, MM (Monitoring Terpadu & SPJ) |
| **Kabid Bina Marga** | `kabid.bm` | `pupr2025` | Ir. Dwi Prasetyo, MT (Pengendalian Bidang Bina Marga) |
| **Koordinator / PPK BM**| `koord.bm` | `pupr2025` | Agus Suryanto, ST (Input Progres & Kontrak) |
| **Tim SPJ Keuangan** | `kasubag.keu` | `pupr2025` | Kasubag Program & Keuangan (Verifikasi Berkas SPJ & SPM) |

*Catatan: Saat login, selesaikan tantangan matematika sederhana yang tertera di form login (captcha keamanan).*

---

## Troubleshooting & Solusi Kendala

| Gejala Masalah | Penyebab Utama | Solusi Penanganan |
| :--- | :--- | :--- |
| **Error 404 saat refresh halaman (F5)** | File `.htaccess` belum terunggah atau tersembunyi | Pastikan file `.htaccess` ada di `public_html/`. Aktifkan opsi *Show Hidden Files* di File Manager hosting. |
| **Koneksi Database Gagal (Access Denied)** | User atau password MySQL keliru | Buka `api/config.php` dan pastikan prefix username dan database (misal `uXXXXX_`) tertulis lengkap. |
| **Tabel belum ada saat test_db.php dibuka** | File SQL belum diimport | Buka phpMyAdmin di hosting dan lakukan import file `database/simon_satuputaru.sql`. |
| **Halaman blank putih saat dibuka** | File aset javascript belum terunggah sempurna | Pastikan folder `assets/` terunggah lengkap dari file zip. |
| **Peringatan Koneksi Tidak Aman (Not Secure)** | SSL HTTPS belum aktif | Masuk ke menu **Keamanan** -> **SSL** di hPanel / cPanel dan aktifkan **Force HTTPS**. |
