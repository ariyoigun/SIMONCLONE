import fs from 'fs';
import path from 'path';
import { INITIAL_USERS } from '../src/data/initialData.js';
import {
  INITIAL_SIPD_PROGRAMS,
  INITIAL_SIPD_KEGIATAN,
  INITIAL_SIPD_SUB_KEGIATAN
} from '../src/data/sipdData.js';
import { REAL_PROJECTS_2026 } from '../src/data/realProjects2026.js';
import {
  DEFAULT_YEARS,
  DEFAULT_TAGS,
  DEFAULT_KATEGORI_PEKERJAAN
} from '../src/data/constants.js';

const INDO_MONTHS = {
  januari: '01', feb: '02', februari: '02', mar: '03', maret: '03',
  apr: '04', april: '04', mei: '05', jun: '06', juni: '06',
  jul: '07', juli: '07', agustus: '08', agt: '08', agu: '08',
  sep: '09', september: '09', okt: '10', oktober: '10',
  nov: '11', november: '11', des: '12', desember: '12'
};

function normalizeDate(str) {
  if (!str) return null;
  let s = String(str).trim().replace(/^['"]+|['"]+$/g, '');
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})\s*([a-zA-Z]+)\s*(\d{4})$/);
  if (m) {
    const day = m[1].padStart(2, '0');
    const monthName = m[2].toLowerCase();
    const year = m[3];
    const month = INDO_MONTHS[monthName];
    if (month) return `${year}-${month}-${day}`;
  }
  if (s.toUpperCase().includes('CV.') || s.toUpperCase().includes('PT.')) return null;
  return s;
}

function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') {
    return isNaN(val) ? '0' : String(val);
  }
  if (typeof val === 'boolean') {
    return val ? '1' : '0';
  }
  if (typeof val === 'object') {
    val = JSON.stringify(val);
  }
  const str = String(val)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\x00/g, '\\0');
  return `'${str}'`;
}

console.log('Building full SQL database dump...');
console.log(`Users: ${INITIAL_USERS.length}`);
console.log(`SIPD Programs: ${INITIAL_SIPD_PROGRAMS.length}`);
console.log(`SIPD Kegiatan: ${INITIAL_SIPD_KEGIATAN.length}`);
console.log(`SIPD Sub Kegiatan: ${INITIAL_SIPD_SUB_KEGIATAN.length}`);
console.log(`Projects 2026: ${REAL_PROJECTS_2026.length}`);

let sql = `-- ==============================================================================
-- DATABASE SCHEMA & SEED DATA: SIMON - SATUPUTARU
-- Sistem Informasi Monitoring Pekerjaan Terpadu
-- Dinas Pekerjaan Umum dan Penataan Ruang (DINPUTARU) Kabupaten Demak
-- 
-- Kompatibel dengan: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+, MariaDB 11.x
-- Didesain khusus untuk Web Hosting Hostinger (phpMyAdmin Import Ready)
-- Total Pekerjaan 2026: ${REAL_PROJECTS_2026.length} Paket
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
CREATE TABLE IF NOT EXISTS \`system_settings\` (
  \`id\` int(11) NOT NULL DEFAULT 1,
  \`nama_sistem\` varchar(100) NOT NULL DEFAULT 'SIMON - SATUPUTARU',
  \`instansi\` varchar(150) NOT NULL DEFAULT 'Dinas Pekerjaan Umum dan Penataan Ruang',
  \`pemerintah_daerah\` varchar(150) NOT NULL DEFAULT 'Pemerintah Kabupaten Demak',
  \`alamat\` text DEFAULT NULL,
  \`telepon\` varchar(50) DEFAULT '(0291) 685123',
  \`email\` varchar(100) DEFAULT 'dinputaru@demakkab.go.id',
  \`website\` varchar(100) DEFAULT 'https://dinputaru.demakkab.go.id',
  \`nama_kepala_dinas\` varchar(150) NOT NULL DEFAULT 'Ir. NANANG TASUNAR DAVID NARUTOMO, MM',
  \`nip_kepala_dinas\` varchar(50) NOT NULL DEFAULT '196702101993031009',
  \`pangkat_kepala_dinas\` varchar(100) NOT NULL DEFAULT 'Pembina Utama Madya (IV/d)',
  \`jabatan_kepala_dinas\` varchar(150) NOT NULL DEFAULT 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang',
  \`nama_sekretaris\` varchar(150) NOT NULL DEFAULT 'NANING PRIH HATININGRUM, S.IP,M.Si',
  \`nip_sekretaris\` varchar(50) NOT NULL DEFAULT '197801082010012019',
  \`pangkat_sekretaris\` varchar(100) NOT NULL DEFAULT 'Pembina Tingkat I (IV/b)',
  \`jabatan_sekretaris\` varchar(150) NOT NULL DEFAULT 'Sekretaris DINPUTARU',
  \`max_public_highlights\` int(11) NOT NULL DEFAULT 10,
  \`galeri_json\` longtext DEFAULT NULL,
  \`custom_texts_json\` longtext DEFAULT NULL,
  \`bidang_descriptions_json\` longtext DEFAULT NULL,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`system_settings\` (\`id\`, \`nama_sistem\`, \`instansi\`, \`pemerintah_daerah\`, \`alamat\`, \`telepon\`, \`email\`, \`website\`, \`nama_kepala_dinas\`, \`nip_kepala_dinas\`, \`pangkat_kepala_dinas\`, \`jabatan_kepala_dinas\`, \`nama_sekretaris\`, \`nip_sekretaris\`, \`pangkat_sekretaris\`, \`jabatan_sekretaris\`, \`max_public_highlights\`) 
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
) ON DUPLICATE KEY UPDATE \`nama_sistem\` = VALUES(\`nama_sistem\`);

-- --------------------------------------------------------
-- 2. TABEL: bidang
-- Master 4 Bidang Teknis & 1 Sekretariat DINPUTARU
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`bidang\` (
  \`id\` varchar(50) NOT NULL,
  \`nama\` varchar(100) NOT NULL,
  \`singkatan\` varchar(20) NOT NULL,
  \`kode\` varchar(10) NOT NULL,
  \`warna\` varchar(20) NOT NULL,
  \`deskripsi\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`bidang\` (\`id\`, \`nama\`, \`singkatan\`, \`kode\`, \`warna\`, \`deskripsi\`) VALUES
('bina_marga', 'Bidang Bina Marga', 'BM', 'BM', '#0284c7', 'Pembangunan, peningkatan, dan preservasi jalan dan jembatan'),
('cipta_karya', 'Bidang Cipta Karya', 'CK', 'CK', '#10b981', 'Tata bangunan, air minum, sanitasi, dan kawasan permukiman'),
('sda_bk', 'Bidang SDA & Bina Konstruksi', 'SDA-BK', 'SDA', '#f59e0b', 'Irigasi, sungai, drainase, waduk/embung, pengendalian banjir, dan jasa konstruksi'),
('tata_ruang', 'Bidang Tata Ruang & Pertanahan', 'TRP', 'TRP', '#8b5cf6', 'Perencanaan tata ruang, pemanfaatan ruang, perizinan, dan pertanahan'),
('sekretariat', 'Sekretariat DINPUTARU', 'SEK', 'SEK', '#0f2c59', 'Pelayanan administrasi perkantoran, umum, kepegawaian, program, dan keuangan dinas')
ON DUPLICATE KEY UPDATE \`nama\` = VALUES(\`nama\`);

-- --------------------------------------------------------
-- 3. TABEL: users
-- Data pengguna dan hak akses peran
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` varchar(50) NOT NULL,
  \`username\` varchar(50) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`nama\` varchar(150) NOT NULL,
  \`nip\` varchar(50) NOT NULL,
  \`jabatan\` varchar(150) NOT NULL,
  \`role\` varchar(50) NOT NULL DEFAULT 'koordinator',
  \`bidang_id\` varchar(50) DEFAULT NULL,
  \`email\` varchar(100) NOT NULL,
  \`avatar\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_users_username\` (\`username\`),
  KEY \`fk_users_bidang\` (\`bidang_id\`),
  CONSTRAINT \`fk_users_bidang\` FOREIGN KEY (\`bidang_id\`) REFERENCES \`bidang\` (\`id\`)\r
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`users\` (\`id\`, \`username\`, \`password\`, \`nama\`, \`nip\`, \`jabatan\`, \`role\`, \`bidang_id\`, \`email\`, \`avatar\`) VALUES
`;

const userValues = INITIAL_USERS.map(u => {
  return `(${sqlEscape(u.id)}, ${sqlEscape(u.username)}, ${sqlEscape(u.password)}, ${sqlEscape(u.nama)}, ${sqlEscape(u.nip)}, ${sqlEscape(u.jabatan)}, ${sqlEscape(u.role)}, ${sqlEscape(u.bidangId)}, ${sqlEscape(u.email)}, ${sqlEscape(u.avatar)})`;
}).join(',\n');

sql += userValues + `
ON DUPLICATE KEY UPDATE \`nama\` = VALUES(\`nama\`), \`password\` = VALUES(\`password\`), \`role\` = VALUES(\`role\`), \`nip\` = VALUES(\`nip\`), \`jabatan\` = VALUES(\`jabatan\`);

-- --------------------------------------------------------
-- 4. TABEL: master_tags
-- Master Label Tagging Prioritas Kedinasan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`master_tags\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nama_tag\` varchar(100) NOT NULL,
  \`kategori\` varchar(50) DEFAULT 'Program Prioritas',
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_tag_nama\` (\`nama_tag\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`master_tags\` (\`nama_tag\`, \`kategori\`) VALUES
('Penanganan Rob & Banjir', 'Prioritas'),
('DAK Fisik Tematik', 'Sumber Dana'),
('Penurunan Stunting & Sanitasi', 'Prioritas'),
('Konektivitas Poros Antar Kecamatan', 'Infrastruktur'),
('Revitalisasi Kawasan Wisata Religi', 'Pariwisata'),
('Pemberdayaan LPSE / Katalog Elektronik', 'Pengadaan'),
('Fasilitasi Kawasan Industri Sayung', 'Investasi'),
('Kegiatan Penunjang Perangkat Daerah', 'Rutin'),
('Operasional dan Pemeliharaan', 'Rutin')
ON DUPLICATE KEY UPDATE \`kategori\` = VALUES(\`kategori\`);

-- --------------------------------------------------------
-- 5. TABEL: master_kategori_pekerjaan
-- Kategori Pekerjaan & Jenis Pengadaan SOP DINPUTARU
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`master_kategori_pekerjaan\` (
  \`id\` varchar(50) NOT NULL,
  \`nama\` varchar(100) NOT NULL,
  \`deskripsi\` text DEFAULT NULL,
  \`jenis_pengadaan_json\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`master_kategori_pekerjaan\` (\`id\`, \`nama\`, \`deskripsi\`, \`jenis_pengadaan_json\`) VALUES
('fisik', 'Fisik', 'Pekerjaan konstruksi fisik bangunan, jalan, jembatan, saluran, dan tata ruang', '["Tender","Pengadaan Langsung","Minikom"]'),
('jakon', 'Jakon', 'Jasa Konsultansi Konstruksi (perencanaan, pengawasan teknis, studi kelayakan)', '["Pengadaan Langsung","Seleksi"]'),
('barang', 'Barang', 'Pengadaan barang, material, perlengkapan, dan peralatan kantor/teknis', '["e-Purchasing","Dikecualikan"]'),
('jasa_lainnya', 'Jasa Lainnya', 'Layanan jasa teknis, pemeliharaan rutin, kebersihan, dan operasional lainnya', '["Pengadaan Langsung","e-Purchasing"]'),
('swakelola', 'Swakelola', 'Pekerjaan yang direncanakan, dikerjakan, dan diawasi sendiri tanpa penyedia luar', '[]')
ON DUPLICATE KEY UPDATE \`nama\` = VALUES(\`nama\`);

-- --------------------------------------------------------
-- 6. TABEL: years
-- Master Tahun Anggaran Monitoring
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`years\` (
  \`tahun\` int(11) NOT NULL,
  \`label\` varchar(50) NOT NULL,
  \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
  \`deskripsi\` text DEFAULT NULL,
  PRIMARY KEY (\`tahun\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`years\` (\`tahun\`, \`label\`, \`is_active\`, \`deskripsi\`) VALUES
(2024, 'Tahun Anggaran 2024', 0, 'Arsip Dokumen Pelaksanaan Anggaran 2024'),
(2025, 'Tahun Anggaran 2025', 0, 'Arsip Dokumen Pelaksanaan Anggaran 2025'),
(2026, 'Tahun Anggaran 2026', 1, 'Tahun Berjalan Aktif (APBD Murni & Perubahan)'),
(2027, 'Tahun Anggaran 2027', 0, 'Rancangan Rencana Kerja (Renja) 2027')
ON DUPLICATE KEY UPDATE \`label\` = VALUES(\`label\`), \`is_active\` = VALUES(\`is_active\`);

-- --------------------------------------------------------
-- 7. TABEL: sipd_programs
-- Nomenklatur Program SIPD Kemendagri
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`sipd_programs\` (
  \`id\` varchar(100) NOT NULL,
  \`kode_program\` varchar(50) NOT NULL,
  \`nama_program\` text NOT NULL,
  \`bidang_id\` varchar(50) DEFAULT NULL,
  \`deskripsi\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_prog_kode\` (\`kode_program\`),
  KEY \`idx_prog_bidang\` (\`bidang_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`sipd_programs\` (\`id\`, \`kode_program\`, \`nama_program\`, \`bidang_id\`, \`deskripsi\`) VALUES
`;

const progValues = INITIAL_SIPD_PROGRAMS.map(p => {
  return `(${sqlEscape(p.id)}, ${sqlEscape(p.kodeProgram)}, ${sqlEscape(p.namaProgram)}, ${sqlEscape(p.bidangId)}, ${sqlEscape(p.deskripsi)})`;
}).join(',\n');

sql += progValues + `
ON DUPLICATE KEY UPDATE \`nama_program\` = VALUES(\`nama_program\`), \`deskripsi\` = VALUES(\`deskripsi\`);

-- --------------------------------------------------------
-- 8. TABEL: sipd_kegiatan
-- Nomenklatur Kegiatan SIPD Kemendagri
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`sipd_kegiatan\` (
  \`id\` varchar(100) NOT NULL,
  \`program_id\` varchar(100) NOT NULL,
  \`kode_kegiatan\` varchar(50) NOT NULL,
  \`nama_kegiatan\` text NOT NULL,
  \`bidang_id\` varchar(50) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_keg_prog\` (\`program_id\`),
  KEY \`idx_keg_kode\` (\`kode_kegiatan\`),
  KEY \`idx_keg_bidang\` (\`bidang_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`sipd_kegiatan\` (\`id\`, \`program_id\`, \`kode_kegiatan\`, \`nama_kegiatan\`, \`bidang_id\`) VALUES
`;

const kegValues = INITIAL_SIPD_KEGIATAN.map(k => {
  return `(${sqlEscape(k.id)}, ${sqlEscape(k.programId)}, ${sqlEscape(k.kodeKegiatan)}, ${sqlEscape(k.namaKegiatan)}, ${sqlEscape(k.bidangId)})`;
}).join(',\n');

sql += kegValues + `
ON DUPLICATE KEY UPDATE \`nama_kegiatan\` = VALUES(\`nama_kegiatan\`);

-- --------------------------------------------------------
-- 9. TABEL: sipd_sub_kegiatan
-- Nomenklatur Sub Kegiatan SIPD Kemendagri
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`sipd_sub_kegiatan\` (
  \`id\` varchar(100) NOT NULL,
  \`program_id\` varchar(100) NOT NULL,
  \`kegiatan_id\` varchar(100) NOT NULL,
  \`kode_sub_kegiatan\` varchar(50) NOT NULL,
  \`nama_sub_kegiatan\` text NOT NULL,
  \`bidang_id\` varchar(50) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_sub_prog\` (\`program_id\`),
  KEY \`idx_sub_keg\` (\`kegiatan_id\`),
  KEY \`idx_sub_kode\` (\`kode_sub_kegiatan\`),
  KEY \`idx_sub_bidang\` (\`bidang_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`sipd_sub_kegiatan\` (\`id\`, \`program_id\`, \`kegiatan_id\`, \`kode_sub_kegiatan\`, \`nama_sub_kegiatan\`, \`bidang_id\`) VALUES
`;

const subValues = INITIAL_SIPD_SUB_KEGIATAN.map(s => {
  return `(${sqlEscape(s.id)}, ${sqlEscape(s.programId)}, ${sqlEscape(s.kegiatanId)}, ${sqlEscape(s.kodeSubKegiatan)}, ${sqlEscape(s.namaSubKegiatan)}, ${sqlEscape(s.bidangId)})`;
}).join(',\n');

sql += subValues + `
ON DUPLICATE KEY UPDATE \`nama_sub_kegiatan\` = VALUES(\`nama_sub_kegiatan\`);

-- --------------------------------------------------------
-- 10. TABEL: projects (Master Data Pekerjaan)
-- Single Source of Truth untuk seluruh data monitoring pekerjaan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`projects\` (
  \`id\` varchar(100) NOT NULL,
  \`tahun_anggaran\` int(11) NOT NULL DEFAULT 2026,
  \`bidang_id\` varchar(50) NOT NULL,
  \`sub_bagian\` varchar(255) DEFAULT NULL,
  \`sub_kegiatan_id\` varchar(100) DEFAULT NULL,
  \`kode_sub_kegiatan\` varchar(50) DEFAULT NULL,
  \`nama_paket\` text NOT NULL,
  \`kategori_pekerjaan\` varchar(50) NOT NULL DEFAULT 'Fisik' COMMENT 'Fisik, Jakon, Barang, Jasa Lainnya, Swakelola',
  \`jenis_anggaran\` varchar(50) NOT NULL DEFAULT 'Murni',
  \`sumber_dana\` varchar(100) DEFAULT 'APBD Murni (DAU)',
  \`kode_rup\` varchar(100) DEFAULT NULL,
  \`tipe_pengadaan\` varchar(100) DEFAULT 'Tender',
  \`pagu_anggaran\` decimal(18,2) NOT NULL DEFAULT 0.00,
  \`hps\` decimal(18,2) NOT NULL DEFAULT 0.00,
  \`nilai_kontrak\` decimal(18,2) NOT NULL DEFAULT 0.00,
  \`nomor_kontrak\` varchar(150) DEFAULT NULL,
  \`tanggal_kontrak\` varchar(50) DEFAULT NULL,
  \`tanggal_mulai\` varchar(50) DEFAULT NULL,
  \`tanggal_selesai\` varchar(50) DEFAULT NULL,
  \`pelaksana_nama\` varchar(255) DEFAULT NULL,
  \`pelaksana_bank\` varchar(100) DEFAULT NULL,
  \`pelaksana_rekening\` varchar(100) DEFAULT NULL,
  \`pelaksana_npwp\` varchar(100) DEFAULT NULL,
  \`kecamatan\` varchar(100) DEFAULT NULL,
  \`desa\` varchar(100) DEFAULT NULL,
  \`lokasi_lengkap\` text DEFAULT NULL,
  \`latitude\` varchar(50) DEFAULT NULL,
  \`longitude\` varchar(50) DEFAULT NULL,
  \`tags_json\` text DEFAULT NULL,
  \`is_public_highlight\` tinyint(1) NOT NULL DEFAULT 0,
  
  -- Modul Pra-Kontrak (12 Tahap SOP)
  \`status_tahap_pra_kontrak\` varchar(50) DEFAULT 'identifikasi_kebutuhan',
  \`pra_kontrak_json\` longtext DEFAULT NULL,
  
  -- Modul Progres Fisik
  \`progres_rencana\` decimal(6,2) NOT NULL DEFAULT 0.00,
  \`progres_realisasi\` decimal(6,2) NOT NULL DEFAULT 0.00,
  \`deviasi_fisik\` decimal(6,2) NOT NULL DEFAULT 0.00,
  \`status_deviasi\` varchar(50) NOT NULL DEFAULT 'Aman',
  \`kurva_s_json\` longtext DEFAULT NULL,
  
  -- Modul Progres Keuangan
  \`total_pencairan\` decimal(18,2) NOT NULL DEFAULT 0.00,
  \`persen_keuangan\` decimal(6,2) NOT NULL DEFAULT 0.00,
  \`sisa_anggaran\` decimal(18,2) NOT NULL DEFAULT 0.00,
  \`termin_json\` longtext DEFAULT NULL,
  
  -- Modul Administrasi SPJ
  \`spj_status\` varchar(50) NOT NULL DEFAULT 'belum_diajukan',
  \`spj_checklist_json\` longtext DEFAULT NULL,
  
  -- Modul Audit Log Riwayat Perubahan
  \`logs_json\` longtext DEFAULT NULL,
  
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_proj_tahun\` (\`tahun_anggaran\`),
  KEY \`idx_proj_bidang\` (\`bidang_id\`),
  KEY \`idx_proj_jenis_anggaran\` (\`jenis_anggaran\`),
  KEY \`idx_proj_kategori\` (\`kategori_pekerjaan\`),
  KEY \`idx_proj_subkeg\` (\`sub_kegiatan_id\`),
  KEY \`idx_proj_kodesub\` (\`kode_sub_kegiatan\`),
  CONSTRAINT \`fk_projects_bidang\` FOREIGN KEY (\`bidang_id\`) REFERENCES \`bidang\` (\`id\`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- SEED DATA REAL 2026 (${REAL_PROJECTS_2026.length} PAKET PEKERJAAN KABUPATEN DEMAK)
-- --------------------------------------------------------
`;

// Insert projects in batches of 50 to avoid overly large SQL statements for phpMyAdmin/MySQL
const batchSize = 50;
for (let i = 0; i < REAL_PROJECTS_2026.length; i += batchSize) {
  const batch = REAL_PROJECTS_2026.slice(i, i + batchSize);
  sql += `INSERT INTO \`projects\` (
  \`id\`, \`tahun_anggaran\`, \`bidang_id\`, \`sub_bagian\`, \`sub_kegiatan_id\`, \`kode_sub_kegiatan\`,
  \`nama_paket\`, \`kategori_pekerjaan\`, \`jenis_anggaran\`, \`sumber_dana\`, \`kode_rup\`, 
  \`tipe_pengadaan\`, \`pagu_anggaran\`, \`hps\`, \`nilai_kontrak\`, \`nomor_kontrak\`, \`tanggal_kontrak\`, \`tanggal_mulai\`, 
  \`tanggal_selesai\`, \`pelaksana_nama\`, \`pelaksana_bank\`, \`pelaksana_rekening\`, \`pelaksana_npwp\`, \`kecamatan\`, \`desa\`, \`lokasi_lengkap\`, 
  \`latitude\`, \`longitude\`, \`tags_json\`, \`is_public_highlight\`, \`status_tahap_pra_kontrak\`, \`pra_kontrak_json\`,
  \`progres_rencana\`, \`progres_realisasi\`, \`deviasi_fisik\`, \`status_deviasi\`, \`kurva_s_json\`,
  \`total_pencairan\`, \`persen_keuangan\`, \`sisa_anggaran\`, \`termin_json\`, \`spj_status\`, \`spj_checklist_json\`, \`logs_json\`
) VALUES
`;

  const rowsSql = batch.map(p => {
    const k = p.dataKontrak || {};
    const f = p.dataFisik || {};
    const q = p.dataKeuangan || {};
    const kat = p.kategoriPekerjaan || (p.tipePengadaan === 'Swakelola' ? 'Swakelola' : (p.tipePengadaan === 'e-Purchasing' ? 'Barang' : 'Fisik'));

    return `(
  ${sqlEscape(p.id)},
  ${sqlEscape(p.tahunAnggaran || 2026)},
  ${sqlEscape(p.bidangId)},
  ${sqlEscape(p.subBagian || null)},
  ${sqlEscape(p.subKegiatanId || null)},
  ${sqlEscape(p.kodeSubKegiatan || null)},
  ${sqlEscape(p.namaPaket)},
  ${sqlEscape(kat)},
  ${sqlEscape(p.jenisAnggaran || 'Murni')},
  ${sqlEscape(p.sumberDana || 'APBD Murni (DAU)')},
  ${sqlEscape(p.kodeRup || null)},
  ${sqlEscape(p.tipePengadaan || 'Tender')},
  ${sqlEscape(p.paguAnggaran || 0)},
  ${sqlEscape(p.hps || 0)},
  ${sqlEscape(k.nilaiKontrak || 0)},
  ${sqlEscape(k.nomorKontrak || null)},
  ${sqlEscape(normalizeDate(k.tanggalKontrak))},
  ${sqlEscape(normalizeDate(k.tanggalMulai))},
  ${sqlEscape(normalizeDate(k.tanggalSelesai))},
  ${sqlEscape(k.namaPenyedia || null)},
  ${sqlEscape(k.bankRekanan || null)},
  ${sqlEscape(k.rekeningRekanan || null)},
  ${sqlEscape(k.npwpRekanan || null)},
  ${sqlEscape(p.kecamatan || null)},
  ${sqlEscape(p.desa || null)},
  ${sqlEscape(p.lokasiLengkap || null)},
  ${sqlEscape(p.latitude ? String(p.latitude) : null)},
  ${sqlEscape(p.longitude ? String(p.longitude) : null)},
  ${sqlEscape(p.tags || [])},
  ${p.isPublicHighlight ? 1 : 0},
  ${sqlEscape(p.statusTahapPraKontrak || 'identifikasi_kebutuhan')},
  ${sqlEscape(p.dataPraKontrak || null)},
  ${sqlEscape(f.progresRencana || 0)},
  ${sqlEscape(f.progresRealisasi || 0)},
  ${sqlEscape(f.deviasiFisik || 0)},
  ${sqlEscape(f.statusDeviasi || 'Aman')},
  ${sqlEscape(f.mingguan || [])},
  ${sqlEscape(q.totalPencairan || 0)},
  ${sqlEscape(q.persenKeuangan || 0)},
  ${sqlEscape(q.sisaAnggaran || 0)},
  ${sqlEscape(q.terminHistory || [])},
  ${sqlEscape(p.spjStatus || 'belum_diajukan')},
  ${sqlEscape(p.dataSpj || null)},
  ${sqlEscape(p.logs || [])}
)`;
  }).join(',\n');

  sql += rowsSql + `
ON DUPLICATE KEY UPDATE 
  \`nama_paket\` = VALUES(\`nama_paket\`),
  \`pagu_anggaran\` = VALUES(\`pagu_anggaran\`),
  \`nilai_kontrak\` = VALUES(\`nilai_kontrak\`),
  \`progres_rencana\` = VALUES(\`progres_rencana\`),
  \`progres_realisasi\` = VALUES(\`progres_realisasi\`),
  \`total_pencairan\` = VALUES(\`total_pencairan\`);\n\n`;
}

sql += `COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
`;

const outputPath = path.resolve('./database/simon_satuputaru.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Successfully generated: ${outputPath} (${(sql.length / 1024).toFixed(1)} KB)`);

