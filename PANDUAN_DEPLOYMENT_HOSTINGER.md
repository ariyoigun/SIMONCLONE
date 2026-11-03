# 🚀 PANDUAN LENGKAP DEPLOYMENT & KONEKSI DATABASE HOSTINGER
## Sistem Informasi Monitoring Pekerjaan (SIMON - SATUPUTARU 2026)
**Dinas Pekerjaan Umum dan Penataan Ruang (DINPUTARU) Kabupaten Demak**
Alamat Web App: **`https://simon.satuputarudemak.id`**

Dokumen ini memuat panduan komprehensif bagi Administrator Sistem (Superadmin) dan Tim IT Dinas untuk mendeploy aplikasi ke **Web Hosting Hostinger**, menghubungkan basis data MySQL, menguji koneksi langsung, serta referensi data akun pengguna dan nomenklatur paket pekerjaan 2026.

---

## 📋 DAFTAR ISI
1. [Spesifikasi & Kredensial Database Hostinger](#1-spesifikasi--kredensial-database-hostinger)
2. [Fitur Pengaturan Database di Panel Superadmin](#2-fitur-pengaturan-database-di-panel-superadmin)
3. [Panduan Langkah demi Langkah Menghubungkan Web App & Database](#3-panduan-langkah-demi-langkah-menghubungkan-web-app--database)
4. [Daftar Akun Pengguna Resmi Sistem (15 Akun)](#4-daftar-akun-pengguna-resmi-sistem-15-akun)
5. [Struktur Nomenklatur SIPD & Paket Pekerjaan 2026](#5-struktur-nomenklatur-sipd--paket-pekerjaan-2026)
6. [Troubleshooting & Solusi Kendala](#6-troubleshooting--solusi-kendala)

---

## 1. Spesifikasi & Kredensial Database Hostinger

Aplikasi web SIMON telah dikonfigurasikan secara terpadu untuk berjalan di infrastruktur hosting Hostinger dengan kredensial berikut:

| Parameter | Nilai Konfigurasi Resmi | Keterangan |
| :--- | :--- | :--- |
| **Domain Web App** | `simon.satuputarudemak.id` | URL Resmi Sistem Monitoring DINPUTARU Demak |
| **MySQL Host** | `localhost` | Standar server Hostinger (atau `127.0.0.1`) |
| **MySQL Port** | `3306` | Port default MySQL/MariaDB |
| **MySQL Database**| `u490770675_simona` | Nama Database di hPanel Hostinger |
| **MySQL Username**| `u490770675_adminsimon` | Nama Pengguna Database MySQL |
| **MySQL Password**| `*Demak2026` | Kata Sandi User Database MySQL |
| **File Skema SQL**| `database/simon_satuputaru.sql` | Berkas impor struktur tabel & data awal |
| **File Config API**| `public/api/config.php` | Konfigurasi koneksi PDO PHP |

---

## 2. Fitur Pengaturan Database di Panel Superadmin

Menu **Pengaturan Database** kini tersedia secara resmi di Panel Superadmin:
1. Login sebagai Superadmin (Username: `superadmin` / Password: `*Dinput4ru_07`).
2. Klik tombol **Pengaturan Sistem (Superadmin)** pada sidebar atau icon gear.
3. Pilih menu tab **Pengaturan Database** (Kategori: *INFRASTRUKTUR & DATABASE*).
4. Di panel ini Anda dapat:
   - **Melihat Status Koneksi Real-time**: Memantau apakah database MySQL Hostinger sedang terhubung (*Online*) atau menggunakan *LocalStorage Fallback*.
   - **Mengubah Kredensial Database**: Mengisi Host, Port, Nama Database, Username, dan Password dengan proteksi show/hide.
   - **Tes Koneksi Database**: Menguji koneksi langsung ke MySQL dengan mengukur latensi (ms), versi server MariaDB/MySQL, dan memverifikasi ketersediaan tabel (`system_settings`, `bidang`, `users`, `projects`, `master_tags`).
   - **Simpan Konfigurasi**: Menyimpan pengaturan ke file server `config.local.php` secara otomatis tanpa perlu membuka file manager.
   - **Buka Diagnostik Web**: Membuka tool diagnostik interaktif di URL `https://simon.satuputarudemak.id/api/test_db.php`.

---

## 3. Panduan Langkah demi Langkah Menghubungkan Web App & Database

### Langkah 1: Buat Database MySQL di hPanel Hostinger
1. Masuk ke panel kendali Hostinger di [https://hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Pilih hosting untuk domain `simon.satuputarudemak.id`.
3. Buka menu **Databases** &gt; **Kelola Database** (atau **MySQL Databases**).
4. Di formulir **Buat Database & Pengguna MySQL Baru**, masukkan:
   - **Nama Database**: `simona` (Hostinger akan menambahkan prefix menjadi `u490770675_simona`)
   - **Nama Pengguna**: `adminsimon` (Nama lengkap menjadi `u490770675_adminsimon`)
   - **Kata Sandi**: `*Demak2026`
5. Klik tombol **Buat**. Pastikan user telah terhubung dengan database tersebut dengan hak akses penuh (*All Privileges*).

### Langkah 2: Impor Skema Database via phpMyAdmin
1. Pada tabel daftar database di hPanel Hostinger, temukan database `u490770675_simona`.
2. Klik tombol **phpMyAdmin** (atau tombol *Masuk ke phpMyAdmin*).
3. Setelah phpMyAdmin terbuka, pastikan nama database `u490770675_simona` terpilih di panel kiri.
4. Klik tab **Import** (Impor) di menu atas.
5. Klik **Choose File** (Pilih File) dan arahkan ke file:
   📂 `database/simon_satuputaru.sql`
6. Biarkan format tetap **SQL** dan klik tombol **Go** / **Kirim** di bagian bawah.
7. Tunggu hingga muncul notifikasi hijau bertuliskan *"Import has been successfully finished"*.

### Langkah 3: Deploy Berkas Web App ke `public_html`
1. Buka **File Manager** Hostinger &gt; masuk ke folder `public_html` domain `simon.satuputarudemak.id`.
2. Unggah berkas arsip:
   📦 `deploy_simon_satuputaru.zip`
3. Ekstrak (Extract) file zip tersebut di `public_html`.
4. Pastikan struktur berkas tersusun rapi:
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
5. Berkas `config.php` telah berisi konfigurasi default `u490770675_simona` dan kata sandi `*Demak2026`.

### Langkah 4: Uji Koneksi Database
Buka browser dan akses halaman diagnostik:
🔗 **`https://simon.satuputarudemak.id/api/test_db.php`**

Jika berhasil, halaman akan menampilkan kartu hijau:
`✅ Koneksi ke database MySQL berhasil! (MySQL/MariaDB X.X.X)`
beserta status seluruh tabel data siap digunakan.

---

## 4. Daftar Akun Pengguna Resmi Sistem (15 Akun)

Menu pengisian cepat akun demo di bawah form login telah dihapus demi keamanan sistem. Berikut adalah 15 akun resmi yang tersimpan di dalam sistem (juga tersedia di file `AKUN_SISTEM_SIMON_2026.txt`):

| No | Nama Lengkap | NIP | Username | Password | Role Sistem | Jabatan / Bidang |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Ir. NANANG TASUNAR DAVID NARUTOMO, MM | 196702101993031009 | `kadin.dinputaru` | `*Dinput4ru_01` | Kepala Dinas | Kepala Dinas DINPUTARU |
| 2 | NANING PRIH HATININGRUM, S.IP,M.Si | 197801082010012019 | `sekdin.dinputaru` | `*Dinput4ru_02` | Sekretaris Dinas | Sekretaris DINPUTARU |
| 3 | BAGAS SATRIA ANGGRIAWAN, S.T., M.M. | 199106122015021002 | `prokeu.dinputaru` | `*Dinput4ru_03` | Kasubag Progkeu | Kasubag Program & Keuangan |
| 4 | BAGAS SATRIA ANGGRIAWAN, S.T., M.M. | 199106122015021002 | `umpeg.dinputaru` | `*Dinput4ru_04` | Kasubag Umpeg | Kasubag Umum & Kepegawaian |
| 5 | RIZKY PRAHARDINI, S.E. | 198607282025212082 | `koor.sekre1` | `*Dinput4ru_05` | Koordinator Sekre | Koordinator / Verifikator SPJ Progkeu |
| 6 | RANI NURHAYATI, S.Sos | 199707102025212091 | `koor.sekre2` | `*Dinput4ru_06` | Koordinator Sekre | Koordinator Umpeg & SPJ |
| 7 | GUNARIYO, S.Kom. | 198909212025041001 | `superadmin` | `*Dinput4ru_07` | Superadmin | Pranata Komputer / Superadmin Sistem |
| 8 | S. EKO WIDIANTORO, ST | 197506012010011012 | `kabid.bm` | `*Dinput4ru_08` | Kabid Bina Marga | Kepala Bidang Bina Marga |
| 9 | TIA ARYUNINGRUM, ST | 199406262020122025 | `koor.bm` | `*Dinput4ru_09` | Koordinator BM | Koordinator Bidang Bina Marga |
| 10 | NANING PRIH HATININGRUM, S.IP,M.Si | 197801082010012019 | `kabid.sdabk` | `*Dinput4ru_10` | Kabid SDABK | Plt. Kepala Bidang SDA & Bina Konstruksi |
| 11 | RESI DIANSISMITA, S.T. | 199805242024212018 | `koor.sdabk` | `*Dinput4ru_11` | Koordinator SDABK | Koordinator Bidang SDA & Bina Konstruksi |
| 12 | S. EKO WIDIANTORO, ST | 197506012010011012 | `kabid.trp` | `*Dinput4ru_12` | Kabid TRP | Plt. Kepala Bidang Tata Ruang & Pertanahan |
| 13 | INSANIA MULIA JUNAEDI, S.T. | 200111212025042001 | `koor.trp` | `*Dinput4ru_13` | Koordinator TRP | Koordinator Bidang Tata Ruang & Pertanahan |
| 14 | ANDI ERWIN PRASETYO, ST. | 19720914 2003121002 | `kabid.ck` | `*Dinput4ru_14` | Kabid Cipta Karya | Kepala Bidang Cipta Karya |
| 15 | CHINTYA CAHYANINGRUM, S.T. | 200207052025042001 | `koor.ck` | `*Dinput4ru_15` | Koordinator CK | Koordinator Bidang Cipta Karya |

*Catatan: Login dapat dilakukan menggunakan **Username** atau **Nomor Induk Pegawai (NIP)**.*

---

## 5. Struktur Nomenklatur SIPD & Paket Pekerjaan 2026

Data master telah diekstrak langsung dari berkas resmi:
📁 `Program Kegiatan Sub kegaitan Pekerjaan 2026.xlsx`

### Rekapitulasi Dataset:
- **Total Program**: 11 Program Urusan Pekerjaan Umum dan Penataan Ruang serta Pertanahan
- **Total Kegiatan**: 22 Kegiatan
- **Total Sub Kegiatan**: 88 Sub Kegiatan
- **Total Paket Pekerjaan Terdaftar**: **558 Paket Pekerjaan** (Tahun Anggaran 2026)

### Pembagian Pekerjaan per Bidang:
1. **Sekretariat (29 Paket)**: Seluruh Sub Kegiatan Program Penunjang dijadikan paket pekerjaan sesuai instruksi kedinasan.
2. **Bidang Bina Marga (240 Paket)**: Pembangunan, rekonstruksi, pelebaran jalan poros antar kecamatan dan jembatan.
3. **Bidang Cipta Karya (142 Paket)**: Pembangunan gedung kantor, SPAM perdesaan, sanitasi/air limbah, dan drainase perkotaan.
4. **Bidang SDA & Bina Konstruksi (125 Paket)**: Rumah pompa terpadu banjir, rehabilitasi pintu air/bendung, tanggul sungai, dan pelatihan jasa konstruksi.
5. **Bidang Tata Ruang & Pertanahan (22 Paket)**: Persetujuan substansi RTRW/RDTR, forum penataan ruang, dan Reforma Agraria (GTRA).

### Kodefikasi Baku SIPD RI Kemendagri:
- `1.03.01` : Program Penunjang Urusan Pemerintahan Daerah
- `1.03.02` : Program Pengelolaan Sumber Daya Air (SDA)
- `1.03.03` : Program Pengelolaan dan Pengembangan Sistem Penyediaan Air Minum (SPAM)
- `1.03.05` : Program Pengelolaan dan Pengembangan Sistem Air Limbah
- `1.03.06` : Program Pengelolaan dan Pengembangan Sistem Drainase
- `1.03.08` : Program Penataan Bangunan Gedung
- `1.03.10` : Program Penyelenggaraan Jalan
- `1.03.11` : Program Pengembangan Jasa Konstruksi
- `1.03.12` : Program Penyelenggaraan Penataan Ruang
- `2.10.01` : Program Redistribusi Tanah dan Ganti Kerugian Tanah
- `2.10.02` : Program Penatagunaan Tanah

---

## 6. Troubleshooting & Solusi Kendala

| Gejala | Penyebab Umum | Solusi |
| :--- | :--- | :--- |
| **Pesan "Access Denied for user..."** | Kata sandi atau nama user database salah | Buka menu *Pengaturan Database* di Superadmin, pastikan user adalah `u490770675_adminsimon` dan password `*Demak2026`. |
| **Pesan "Unknown database..."** | Nama database belum dibuat di hPanel | Buat database `u490770675_simona` di menu Databases Hostinger hPanel. |
| **Tabel belum ada / Data kosong** | Berkas SQL belum diimpor | Buka phpMyAdmin, pilih database `u490770675_simona`, klik tab *Import* dan pilih file `database/simon_satuputaru.sql`. |
| **Error 404 saat akses halaman internal** | Modul rewrite `.htaccess` belum aktif | Pastikan file `.htaccess` berada di direktori `public_html/`. |
| **Aplikasi berjalan dalam mode Offline** | Database hosting sedang tidak aktif | SIMON otomatis menyimpan data di LocalStorage agar sistem tetap dapat digunakan tanpa gangguan. Begitu database online, koneksi tersambung otomatis. |
