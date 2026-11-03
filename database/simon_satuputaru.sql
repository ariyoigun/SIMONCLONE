-- ==============================================================================
-- DATABASE SCHEMA & SEED DATA: SIMON - SATUPUTARU
-- Sistem Informasi Monitoring Pekerjaan Terpadu
-- Dinas Pekerjaan Umum dan Penataan Ruang (DINPUTARU) Kabupaten Demak
-- 
-- Kompatibel dengan: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- Didesain khusus untuk Web Hosting Hostinger (phpMyAdmin Import Ready)
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- 1. TABEL: system_settings
-- Menyimpan identitas instansi, nama sistem, pimpinan dinas, dan kuota beranda
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `nama_sistem` varchar(100) NOT NULL DEFAULT 'SIMON - SATUPUTARU',
  `instansi` varchar(150) NOT NULL DEFAULT 'Dinas Pekerjaan Umum dan Penataan Ruang',
  `pemerintah_daerah` varchar(150) NOT NULL DEFAULT 'Pemerintah Kabupaten Demak',
  `alamat` text DEFAULT NULL,
  `telepon` varchar(50) DEFAULT '(0291) 685123',
  `email` varchar(100) DEFAULT 'dinputaru@demakkab.go.id',
  `website` varchar(100) DEFAULT 'https://dinputaru.demakkab.go.id',
  `nama_kepala_dinas` varchar(150) NOT NULL DEFAULT 'Ir. NANANG TASUNAR DAVID NARUTOMO, MM',
  `nip_kepala_dinas` varchar(50) NOT NULL DEFAULT '196702101993031009',
  `pangkat_kepala_dinas` varchar(100) NOT NULL DEFAULT 'Pembina Utama Madya (IV/d)',
  `jabatan_kepala_dinas` varchar(150) NOT NULL DEFAULT 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang',
  `nama_sekretaris` varchar(150) NOT NULL DEFAULT 'NANING PRIH HATININGRUM, S.IP,M.Si',
  `nip_sekretaris` varchar(50) NOT NULL DEFAULT '197801082010012019',
  `pangkat_sekretaris` varchar(100) NOT NULL DEFAULT 'Pembina Tingkat I (IV/b)',
  `jabatan_sekretaris` varchar(150) NOT NULL DEFAULT 'Sekretaris DINPUTARU',
  `max_public_highlights` int(11) NOT NULL DEFAULT 10,
  `galeri_json` longtext DEFAULT NULL,
  `custom_texts_json` longtext DEFAULT NULL,
  `bidang_descriptions_json` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data Pengaturan Sistem
INSERT INTO `system_settings` (`id`, `nama_sistem`, `instansi`, `pemerintah_daerah`, `alamat`, `telepon`, `email`, `website`, `nama_kepala_dinas`, `nip_kepala_dinas`, `pangkat_kepala_dinas`, `jabatan_kepala_dinas`, `nama_sekretaris`, `nip_sekretaris`, `pangkat_sekretaris`, `jabatan_sekretaris`, `max_public_highlights`) 
VALUES (
  1,
  'SIMON - SATUPUTARU',
  'Dinas Pekerjaan Umum dan Penataan Ruang',
  'Pemerintah Kabupaten Demak',
  'Jl. Kyai Jebat No. 35 Bintoro Kec. Demak',
  '(0291) 685123',
  'dinputaru@demakkab.go.id',
  'https://dinputaru.demakkab.go.id',
  'Ir. NANANG TASUNAR DAVID NARUTOMO, MM',
  '196702101993031009',
  'Pembina Utama Madya (IV/d)',
  'Kepala Dinas Pekerjaan Umum dan Penataan Ruang',
  'NANING PRIH HATININGRUM, S.IP,M.Si',
  '197801082010012019',
  'Pembina Tingkat I (IV/b)',
  'Sekretaris DINPUTARU',
  10
) ON DUPLICATE KEY UPDATE `nama_sistem` = VALUES(`nama_sistem`);

-- --------------------------------------------------------
-- 2. TABEL: bidang
-- Master 4 Bidang Teknis DINPUTARU
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bidang` (
  `id` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `singkatan` varchar(20) NOT NULL,
  `kode` varchar(10) NOT NULL,
  `warna` varchar(20) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bidang` (`id`, `nama`, `singkatan`, `kode`, `warna`, `deskripsi`) VALUES
('bina_marga', 'Bidang Bina Marga', 'BM', 'BM', '#0284c7', 'Pembangunan, peningkatan, dan preservasi jalan dan jembatan'),
('cipta_karya', 'Bidang Cipta Karya', 'CK', 'CK', '#10b981', 'Tata bangunan, air minum, sanitasi, dan kawasan permukiman'),
('sda_bk', 'Bidang SDA & Bina Konstruksi', 'SDA-BK', 'SDA', '#f59e0b', 'Irigasi, sungai, drainase, waduk/embung, pengendalian banjir, dan jasa konstruksi'),
('tata_ruang', 'Bidang Tata Ruang & Pertanahan', 'TRP', 'TRP', '#8b5cf6', 'Perencanaan tata ruang, pemanfaatan ruang, perizinan, dan pertanahan'),
('sekretariat', 'Sekretariat DINPUTARU', 'SEK', 'SEK', '#0f2c59', 'Pelayanan administrasi perkantoran, umum, kepegawaian, program, dan keuangan dinas')
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);

-- --------------------------------------------------------
-- 3. TABEL: users
-- Data pengguna dan hak akses peran
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `nip` varchar(50) NOT NULL,
  `jabatan` varchar(150) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'koordinator',
  `bidang_id` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `avatar` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_username` (`username`),
  KEY `fk_users_bidang` (`bidang_id`),
  CONSTRAINT `fk_users_bidang` FOREIGN KEY (`bidang_id`) REFERENCES `bidang` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `username`, `password`, `nama`, `nip`, `jabatan`, `role`, `bidang_id`, `email`, `avatar`) VALUES
('usr_superadmin', 'superadmin', '*Dinput4ru_07', 'GUNARIYO, S.Kom.', '198909212025041001', 'Pranata Komputer / Superadmin Sistem', 'superadmin', NULL, 'gunariyo@demakkab.go.id', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'),
('usr_kadin', 'kadin.dinputaru', '*Dinput4ru_01', 'Ir. NANANG TASUNAR DAVID NARUTOMO, MM', '196702101993031009', 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang', 'kadin', NULL, 'kadin.dinputaru@demakkab.go.id', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'),
('usr_sekretaris', 'sekdin.dinputaru', '*Dinput4ru_02', 'NANING PRIH HATININGRUM, S.IP,M.Si', '197801082010012019', 'Sekretaris Dinas Pekerjaan Umum dan Penataan Ruang', 'sekretaris', NULL, 'sekdin.dinputaru@demakkab.go.id', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'),
('usr_prokeu', 'prokeu.dinputaru', '*Dinput4ru_03', 'BAGAS SATRIA ANGGRIAWAN, S.T., M.M.', '199106122015021002', 'Kasubag Program & Keuangan', 'kasubag_program_keuangan', 'sekretariat', 'prokeu.dinputaru@demakkab.go.id', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'),
('usr_umpeg', 'umpeg.dinputaru', '*Dinput4ru_04', 'BAGAS SATRIA ANGGRIAWAN, S.T., M.M.', '199106122015021002', 'Kasubag Umum & Kepegawaian', 'kasubag_umpeg', 'sekretariat', 'umpeg.dinputaru@demakkab.go.id', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'),
('usr_koor_sekre1', 'koor.sekre1', '*Dinput4ru_05', 'RIZKY PRAHARDINI, S.E.', '198607282025212082', 'Koordinator Sekretariat (Program & Keuangan)', 'koordinator_sekretariat', 'sekretariat', 'koor.sekre1@demakkab.go.id', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'),
('usr_koor_sekre2', 'koor.sekre2', '*Dinput4ru_06', 'RANI NURHAYATI, S.Sos', '199707102025212091', 'Koordinator Sekretariat (Umum & Kepegawaian)', 'koordinator_sekretariat', 'sekretariat', 'koor.sekre2@demakkab.go.id', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'),
('usr_kabid_bm', 'kabid.bm', '*Dinput4ru_08', 'S. EKO WIDIANTORO, ST', '197506012010011012', 'Kepala Bidang Bina Marga', 'kabid', 'bina_marga', 'kabid.bm@demakkab.go.id', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'),
('usr_koor_bm', 'koor.bm', '*Dinput4ru_09', 'TIA ARYUNINGRUM, ST', '199406262020122025', 'Koordinator Bidang Bina Marga', 'koordinator', 'bina_marga', 'koor.bm@demakkab.go.id', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'),
('usr_kabid_sdabk', 'kabid.sdabk', '*Dinput4ru_10', 'NANING PRIH HATININGRUM, S.IP,M.Si', '197801082010012019', 'Sekretaris Dinas / Plt. Kepala Bidang SDA & Bina Konstruksi', 'kabid', 'sda_bk', 'kabid.sdabk@demakkab.go.id', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'),
('usr_koor_sdabk', 'koor.sdabk', '*Dinput4ru_11', 'RESI DIANSISMITA, S.T.', '199805242024212018', 'Koordinator Bidang SDA & Bina Konstruksi', 'koordinator', 'sda_bk', 'koor.sdabk@demakkab.go.id', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'),
('usr_kabid_trp', 'kabid.trp', '*Dinput4ru_12', 'S. EKO WIDIANTORO, ST', '197506012010011012', 'Plt. Kepala Bidang Tata Ruang & Pertanahan', 'kabid', 'tata_ruang', 'kabid.trp@demakkab.go.id', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'),
('usr_koor_trp', 'koor.trp', '*Dinput4ru_13', 'INSANIA MULIA JUNAEDI, S.T.', '200111212025042001', 'Koordinator Bidang Tata Ruang & Pertanahan', 'koordinator', 'tata_ruang', 'koor.trp@demakkab.go.id', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'),
('usr_kabid_ck', 'kabid.ck', '*Dinput4ru_14', 'ANDI ERWIN PRASETYO, ST.', '19720914 2003121002', 'Kepala Bidang Cipta Karya', 'kabid', 'cipta_karya', 'kabid.ck@demakkab.go.id', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80'),
('usr_koor_ck', 'koor.ck', '*Dinput4ru_15', 'CHINTYA CAHYANINGRUM, S.T.', '200207052025042001', 'Koordinator Bidang Cipta Karya', 'koordinator', 'cipta_karya', 'koor.ck@demakkab.go.id', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'),
('usr_koord_pendapatan', 'pendapatan', '*Dinput4ru_pad', 'Tri Wahyudi, SE', '19850620 201001 1 012', 'Koordinator Pengelola Pendapatan Daerah & Retribusi', 'koordinator_pendapatan', 'sekretariat', 'pendapatan.dinputaru@demakkab.go.id', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80')
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`), `password` = VALUES(`password`), `role` = VALUES(`role`), `nip` = VALUES(`nip`), `jabatan` = VALUES(`jabatan`);


-- --------------------------------------------------------
-- 4. TABEL: master_tags
-- Master Label Tagging Prioritas Kedinasan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `master_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_tag` varchar(100) NOT NULL,
  `kategori` varchar(50) DEFAULT 'Program Prioritas',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_tag_nama` (`nama_tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `master_tags` (`id`, `nama_tag`, `kategori`) VALUES
(1, 'Penanganan Rob & Banjir', 'Prioritas'),
(2, 'DAK Fisik Tematik', 'Sumber Dana'),
(3, 'Penurunan Stunting & Sanitasi', 'Prioritas'),
(4, 'Konektivitas Poros Antar Kecamatan', 'Infrastruktur'),
(5, 'Revitalisasi Kawasan Wisata Religi', 'Pariwisata'),
(6, 'Pemberdayaan LPSE / Katalog Elektronik', 'Pengadaan'),
(7, 'Fasilitasi Kawasan Industri Sayung', 'Investasi')
ON DUPLICATE KEY UPDATE `kategori` = VALUES(`kategori`);

-- --------------------------------------------------------
-- 5. TABEL: master_kategori_pekerjaan
-- Kategori Pekerjaan & Jenis Pengadaan SOP DINPUTARU
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `master_kategori_pekerjaan` (
  `id` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `jenis_pengadaan_json` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `master_kategori_pekerjaan` (`id`, `nama`, `deskripsi`, `jenis_pengadaan_json`) VALUES
('fisik', 'Fisik', 'Pekerjaan konstruksi fisik bangunan, jalan, jembatan, saluran, dan tata ruang', '["Tender","Pengadaan Langsung","Minikom"]'),
('jakon', 'Jakon', 'Jasa Konsultansi Konstruksi (perencanaan, pengawasan teknis, studi kelayakan)', '["Pengadaan Langsung","Seleksi"]'),
('barang', 'Barang', 'Pengadaan barang, material, perlengkapan, dan peralatan kantor/teknis', '["e-Purchasing","Dikecualikan"]'),
('jasa_lainnya', 'Jasa Lainnya', 'Layanan jasa teknis, pemeliharaan rutin, kebersihan, dan operasional lainnya', '["Pengadaan Langsung","e-Purchasing"]'),
('swakelola', 'Swakelola', 'Pekerjaan yang direncanakan, dikerjakan, dan diawasi sendiri tanpa penyedia luar', '[]')
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);

-- --------------------------------------------------------
-- 6. TABEL: projects (Master Data Pekerjaan)
-- Single Source of Truth untuk seluruh data monitoring
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` varchar(50) NOT NULL,
  `tahun_anggaran` int(11) NOT NULL,
  `bidang_id` varchar(50) NOT NULL,
  `sub_bagian` varchar(150) DEFAULT NULL,
  `nama_paket` text NOT NULL,
  `kategori_pekerjaan` varchar(50) NOT NULL DEFAULT 'Fisik' COMMENT 'Fisik, Jakon, Barang, Jasa Lainnya, Swakelola',
  `jenis_anggaran` enum('Murni','Perubahan','APBD-P') NOT NULL DEFAULT 'Murni',
  `sumber_dana` varchar(100) DEFAULT 'APBD Murni (DAU)',
  `kode_rup` varchar(50) DEFAULT NULL,
  `tipe_pengadaan` varchar(100) DEFAULT 'Tender',
  `pagu_anggaran` decimal(18,2) NOT NULL DEFAULT 0.00,
  `hps` decimal(18,2) NOT NULL DEFAULT 0.00,
  `nilai_kontrak` decimal(18,2) NOT NULL DEFAULT 0.00,
  `nomor_kontrak` varchar(100) DEFAULT NULL,
  `tanggal_kontrak` date DEFAULT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `tanggal_selesai` date DEFAULT NULL,
  `pelaksana_nama` varchar(150) DEFAULT NULL,
  `pelaksana_bank` varchar(100) DEFAULT NULL,
  `pelaksana_rekening` varchar(100) DEFAULT NULL,
  `pelaksana_npwp` varchar(50) DEFAULT NULL,
  `kecamatan` varchar(100) DEFAULT NULL,
  `desa` varchar(100) DEFAULT NULL,
  `lokasi_lengkap` text DEFAULT NULL,
  `latitude` varchar(30) DEFAULT NULL,
  `longitude` varchar(30) DEFAULT NULL,
  `tags_json` text DEFAULT NULL,
  `is_public_highlight` tinyint(1) NOT NULL DEFAULT 1,
  
  -- Modul Pra-Kontrak (12 Tahap SOP)
  `status_tahap_pra_kontrak` varchar(50) DEFAULT 'sirup' COMMENT '12 Tahap: sirup, survei_lokasi, survei_harga, perencanaan, kirim_lpse, rpp, revisi, tayang, retender, pra_kontrak, kontrak, batal',
  `pra_kontrak_json` longtext DEFAULT NULL,
  
  -- Modul Progres Fisik
  `progres_rencana` decimal(6,2) NOT NULL DEFAULT 0.00,
  `progres_realisasi` decimal(6,2) NOT NULL DEFAULT 0.00,
  `deviasi_fisik` decimal(6,2) NOT NULL DEFAULT 0.00,
  `status_deviasi` varchar(50) NOT NULL DEFAULT 'Aman',
  `kurva_s_json` longtext DEFAULT NULL,
  
  -- Modul Progres Keuangan
  `total_pencairan` decimal(18,2) NOT NULL DEFAULT 0.00,
  `persen_keuangan` decimal(6,2) NOT NULL DEFAULT 0.00,
  `sisa_anggaran` decimal(18,2) NOT NULL DEFAULT 0.00,
  `termin_json` longtext DEFAULT NULL,
  
  -- Modul Administrasi SPJ
  `spj_status` varchar(50) NOT NULL DEFAULT 'belum_diajukan',
  `spj_checklist_json` longtext DEFAULT NULL,
  
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_proj_tahun` (`tahun_anggaran`),
  KEY `idx_proj_bidang` (`bidang_id`),
  KEY `idx_proj_jenis_anggaran` (`jenis_anggaran`),
  KEY `idx_proj_kategori` (`kategori_pekerjaan`),
  KEY `idx_proj_kecamatan` (`kecamatan`),
  CONSTRAINT `fk_projects_bidang` FOREIGN KEY (`bidang_id`) REFERENCES `bidang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- SEED DATA CONTOH PAKET PEKERJAAN KABUPATEN DEMAK
-- --------------------------------------------------------
INSERT INTO `projects` (
  `id`, `tahun_anggaran`, `bidang_id`, `sub_bagian`, `nama_paket`, `kategori_pekerjaan`, `jenis_anggaran`, `sumber_dana`, `kode_rup`, 
  `tipe_pengadaan`, `pagu_anggaran`, `hps`, `nilai_kontrak`, `nomor_kontrak`, `tanggal_kontrak`, `tanggal_mulai`, 
  `tanggal_selesai`, `pelaksana_nama`, `pelaksana_bank`, `pelaksana_rekening`, `kecamatan`, `desa`, `lokasi_lengkap`, 
  `latitude`, `longitude`, `tags_json`, `is_public_highlight`, `status_tahap_pra_kontrak`, `progres_rencana`, 
  `progres_realisasi`, `deviasi_fisik`, `status_deviasi`, `total_pencairan`, `persen_keuangan`, `sisa_anggaran`, `spj_status`
) VALUES
(
  'PRJ-2026-BM-01', 2026, 'bina_marga', NULL,
  'Peningkatan Jalan Poros Ruas Trengguli - Mijen (Hotmix & Pelebaran Bahu) TA 2026', 'Fisik', 'Murni',
  'Dana Alokasi Khusus (DAK) Fisik', 'RUP-2026-BM-901', 'Tender',
  4360000000.00, 4294600000.00, 4144289000.00, '602.1/045/SP/BM/2026', '2026-03-05', '2026-03-12', '2026-09-08',
  'PT. Sarana Marga Persada Demak', 'Bank Jateng Cabang Demak', '1002-8829-1029',
  'Mijen', 'Bakung', 'Desa Bakung, Kec. Mijen, Kab. Demak',
  '-6.8521', '110.6712', '["Konektivitas Poros Antar Kecamatan", "DAK Fisik Tematik"]', 1,
  'kontrak', 65.00, 68.40, 3.40, 'Aman',
  2072144500.00, 50.00, 2072144500.00, 'sudah_koreksi'
),
(
  'PRJ-2026-BM-02', 2026, 'bina_marga', NULL,
  'Rekonstruksi Jalan Sayung - Morosari (Peninggian Rigid Pavement Anti Rob) TA 2026', 'Fisik', 'APBD-P',
  'APBD-P (Perubahan)', 'RUP-2026-BM-902', 'Tender',
  5960000000.00, 5870600000.00, 5665129000.00, '602.1/048/SP/BM/2026', '2026-03-10', '2026-03-18', '2026-10-15',
  'CV. Bintoro Bangun Utama', 'Bank Mandiri Demak', '135-00-1928371-2',
  'Sayung', 'Sriwulan', 'Desa Sriwulan, Kec. Sayung, Kab. Demak',
  '-6.9241', '110.4932', '["Penanganan Rob & Banjir", "(APBD-P)"]', 1,
  'kontrak', 58.00, 51.50, -6.50, 'Kritis',
  1699538700.00, 30.00, 3965590300.00, 'belum_lengkap'
),
(
  'PRJ-2026-CK-01', 2026, 'cipta_karya', NULL,
  'Penataan Kawasan Alun-Alun Simpang Enam Demak & Koridor Masjid Agung TA 2026', 'Fisik', 'Murni',
  'Dana Alokasi Khusus (DAK) Fisik', 'RUP-2026-CK-801', 'Tender',
  4010000000.00, 3949850000.00, 3811605250.00, '640/021/SP/CK/2026', '2026-02-20', '2026-03-01', '2026-08-28',
  'PT. Tuntang Graha Mandiri', 'Bank BRI Kanca Demak', '0082-01-002918-50-3',
  'Demak', 'Bintoro', 'Desa Bintoro, Kec. Demak, Kab. Demak',
  '-6.8942', '110.6385', '["Revitalisasi Kawasan Wisata Religi"]', 1,
  'kontrak', 78.00, 81.20, 3.20, 'Aman',
  2668123675.00, 70.00, 1143481575.00, 'sudah_koreksi'
),
(
  'PRJ-2026-CK-02', 2026, 'cipta_karya', NULL,
  'Pembangunan Jaringan Distribusi Air Minum SPAM Ibukota Kec. Wedung TA 2026', 'Fisik', 'Murni',
  'APBD Murni (DAU)', 'RUP-2026-CK-802', 'Tender',
  4760000000.00, 4688600000.00, 4524499000.00, '640/026/SP/CK/2026', '2026-03-15', '2026-03-25', '2026-09-20',
  'CV. Pesisir Sejahtera Konstruksi', 'Bank Jateng Capem Mranggen', '2019-4412-8819',
  'Wedung', 'Babalan', 'Desa Babalan, Kec. Wedung, Kab. Demak',
  '-6.7921', '110.5732', '["Penurunan Stunting & Sanitasi", "DAK Fisik Tematik"]', 1,
  'kontrak', 52.00, 48.00, -4.00, 'Perhatian',
  1357349700.00, 30.00, 3167149300.00, 'masuk_verifikasi'
),
(
  'PRJ-2026-SDA-01', 2026, 'sda_bk', NULL,
  'Normalisasi Sungai Wulan & Perkuatan Tanggul Kritis Ketanjung Karanganyar TA 2026', 'Fisik', 'Murni',
  'Dana Alokasi Khusus (DAK) Fisik', 'RUP-2026-SDA-701', 'Tender',
  6360000000.00, 6264600000.00, 6045339000.00, '610/012/SP/SDA/2026', '2026-02-15', '2026-02-24', '2026-10-30',
  'PT. Surya Graha Kalicilik', 'Bank BNI Demak', '0829-1120-99',
  'Karanganyar', 'Ketanjung', 'Desa Ketanjung, Kec. Karanganyar, Kab. Demak',
  '-6.8792', '110.7512', '["Penanganan Rob & Banjir"]', 1,
  'kontrak', 60.00, 62.50, 2.50, 'Aman',
  3022669500.00, 50.00, 3022669500.00, 'sudah_koreksi'
),
(
  'PRJ-2026-TRP-01', 2026, 'tata_ruang', NULL,
  'Penyusunan Rencana Detail Tata Ruang (RDTR) Koridor Industri Sayung TA 2026', 'Jakon', 'Murni',
  'APBD Murni (DAU)', 'RUP-2026-TRP-601', 'Seleksi',
  1110000000.00, 1093350000.00, 1055082750.00, '650/004/SP/TR/2026', '2026-03-01', '2026-03-10', '2026-08-10',
  'CV. Tirta Wulan Mandiri', 'Bank Jateng Cabang Demak', '1002-9921-5521',
  'Sayung', 'Bedono', 'Desa Bedono, Kec. Sayung, Kab. Demak',
  '-6.9312', '110.5123', '["Fasilitasi Kawasan Industri Sayung"]', 1,
  'kontrak', 70.00, 72.00, 2.00, 'Aman',
  527541375.00, 50.00, 527541375.00, 'sudah_koreksi'
),
(
  'PRJ-2026-SEK-01', 2026, 'sekretariat', 'Sub Bagian Umum & Kepegawaian',
  'Pengadaan Server Database & Integrasi Sistem Jaringan SIMON SATUPUTARU TA 2026', 'Barang', 'Murni',
  'APBD Murni (DAU)', 'RUP-2026-SEK-501', 'e-Purchasing',
  450000000.00, 443250000.00, 427736250.00, '027/015/SPK/SEK/2026', '2026-01-20', '2026-01-25', '2026-04-25',
  'PT. Sarana Marga Persada Demak', 'Bank Jateng Cabang Demak', '1002-8829-1029',
  'Demak', 'Bintoro', 'Kantor DINPUTARU, Bintoro, Kec. Demak',
  '-6.8945', '110.6380', '["Program Prioritas Digitalisasi Kedinasan"]', 1,
  'kontrak', 100.00, 100.00, 0.00, 'Selesai',
  427736250.00, 100.00, 0.00, 'sudah_sp2d'
),
(
  'PRJ-2026-SEK-02', 2026, 'sekretariat', 'Sub Bagian Program & Keuangan',
  'Penyusunan Dokumen Renja, RKT & LAKIP Akuntabilitas Kinerja DINPUTARU TA 2026', 'Barang', 'APBD-P',
  'APBD-P (Perubahan)', 'RUP-2026-SEK-502', 'Pengadaan Langsung',
  120000000.00, 118200000.00, 114063000.00, '027/019/SPK/SEK/2026', '2026-07-10', '2026-07-15', '2026-10-15',
  'CV. Bintoro Bangun Utama', 'Bank Mandiri Demak', '135-00-1928371-2',
  'Demak', 'Bintoro', 'Kantor DINPUTARU, Bintoro, Kec. Demak',
  '-6.8945', '110.6380', '["Akuntabilitas Kinerja Instansi Pemerintah (AKIP)", "(APBD-P)"]', 1,
  'kontrak', 80.00, 85.00, 5.00, 'Aman',
  57031500.00, 50.00, 57031500.00, 'sudah_koreksi'
)
ON DUPLICATE KEY UPDATE `nama_paket` = VALUES(`nama_paket`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
