const fs = require('fs');
const { BIDANG_LIST, DEFAULT_TAGS, DEFAULT_YEARS, DEFAULT_SYSTEM_SETTINGS } = require('../src/data/constants.js');
const { INITIAL_USERS } = require('../src/data/initialData.js');
const { INITIAL_SIPD_PROGRAMS, INITIAL_SIPD_KEGIATAN, INITIAL_SIPD_SUB_KEGIATAN } = require('../src/data/sipdData.js');
const { MONITORING_PAKET_2026 } = require('../src/data/monitoringPaket2026.js');

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return isNaN(val) ? '0' : val.toString();
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"": case "'": case "\\": case "%":
        return "\\"+char;
      default: return char;
    }
  })}'`;
  return `'${val.toString().replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"": case "'": case "\\": case "%":
        return "\\"+char;
      default: return char;
    }
  })}'`;
}

let sql = `-- ==============================================================================
-- DATABASE RESMI SIMON - SATUPUTARU
-- Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak
-- Server: Hostinger MySQL / MariaDB (simon.satuputarudemak.id)
-- Database: u490770675_simona
-- Tanggal Pembuatan: ${new Date().toISOString()}
-- Total Paket Monitoring TA 2026: ${MONITORING_PAKET_2026.length} Paket
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
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`system_settings\`;
CREATE TABLE \`system_settings\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nama_sistem\` varchar(150) NOT NULL DEFAULT 'SIMON - SATUPUTARU',
  \`sub_nama\` varchar(255) DEFAULT 'Sistem Informasi Monitoring Progres Pekerjaan DINPUTARU',
  \`instansi\` varchar(255) NOT NULL DEFAULT 'Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak',
  \`pemerintah_daerah\` varchar(150) DEFAULT 'Pemerintah Kabupaten Demak',
  \`alamat\` text DEFAULT 'Jl. Kyai Jebat No. 35 Bintoro Kec. Demak',
  \`telepon\` varchar(50) DEFAULT '(0291) 685123',
  \`email\` varchar(100) DEFAULT 'dinputaru@demakkab.go.id',
  \`website\` varchar(150) DEFAULT 'https://dinputaru.demakkab.go.id',
  \`logo_url\` longtext DEFAULT NULL,
  \`nama_kepala_dinas\` varchar(150) DEFAULT 'Ir. NANANG TASUNAR DAVID NARUTOMO, MM',
  \`nip_kepala_dinas\` varchar(50) DEFAULT '196702101993031009',
  \`pangkat_kepala_dinas\` varchar(100) DEFAULT 'Pembina Utama Madya (IV/d)',
  \`jabatan_kepala_dinas\` varchar(150) DEFAULT 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang',
  \`nama_sekretaris\` varchar(150) DEFAULT 'NANING PRIH HATININGRUM, S.IP,M.Si',
  \`nip_sekretaris\` varchar(50) DEFAULT '197801082010012019',
  \`pangkat_sekretaris\` varchar(100) DEFAULT 'Pembina Tingkat I (IV/b)',
  \`jabatan_sekretaris\` varchar(150) DEFAULT 'Sekretaris DINPUTARU',
  \`max_public_highlights\` int(11) NOT NULL DEFAULT 10,
  \`show_galeri_slideshow\` tinyint(1) NOT NULL DEFAULT 0,
  \`show_slideshow_unggulan\` tinyint(1) NOT NULL DEFAULT 1,
  \`show_peta_koordinat\` tinyint(1) NOT NULL DEFAULT 0,
  \`slideshow_unggulan_json\` longtext DEFAULT NULL,
  \`custom_texts_json\` longtext DEFAULT NULL,
  \`bidang_descriptions_json\` longtext DEFAULT NULL,
  \`galeri_json\` longtext DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`system_settings\` (
  \`id\`, \`nama_sistem\`, \`sub_nama\`, \`instansi\`, \`pemerintah_daerah\`, \`alamat\`, \`telepon\`, \`email\`, \`website\`,
  \`logo_url\`, \`nama_kepala_dinas\`, \`nip_kepala_dinas\`, \`pangkat_kepala_dinas\`, \`jabatan_kepala_dinas\`,
  \`nama_sekretaris\`, \`nip_sekretaris\`, \`pangkat_sekretaris\`, \`jabatan_sekretaris\`, \`max_public_highlights\`,
  \`show_galeri_slideshow\`, \`show_slideshow_unggulan\`, \`show_peta_koordinat\`, \`slideshow_unggulan_json\`,
  \`custom_texts_json\`, \`bidang_descriptions_json\`, \`galeri_json\`
) VALUES (
  1,
  ${esc(DEFAULT_SYSTEM_SETTINGS.namaSistem)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.subNama)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.instansi)},
  'Pemerintah Kabupaten Demak',
  ${esc(DEFAULT_SYSTEM_SETTINGS.alamat)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.telepon)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.email)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.website)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.logoUrl)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.namaKepalaDinas)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.nipKepalaDinas)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.pangkatKepalaDinas)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.jabatanKepalaDinas)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.namaSekretaris)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.nipSekretaris)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.pangkatSekretaris)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.jabatanSekretaris)},
  10,
  0,
  1,
  0,
  ${esc(DEFAULT_SYSTEM_SETTINGS.slideshowUnggulan)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.customTexts)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.bidangDescriptions)},
  ${esc(DEFAULT_SYSTEM_SETTINGS.galeri)}
);

-- --------------------------------------------------------
-- 2. TABEL: bidang
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`bidang\`;
CREATE TABLE \`bidang\` (
  \`id\` varchar(50) NOT NULL,
  \`nama\` varchar(150) NOT NULL,
  \`singkatan\` varchar(20) NOT NULL,
  \`deskripsi\` text DEFAULT NULL,
  \`warna\` varchar(20) DEFAULT '#0284c7',
  \`bg_light\` varchar(50) DEFAULT 'rgba(2, 132, 199, 0.1)',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`bidang\` (\`id\`, \`nama\`, \`singkatan\`, \`deskripsi\`, \`warna\`, \`bg_light\`) VALUES
`;

const bidangValues = BIDANG_LIST.map(b => 
  `(${esc(b.id)}, ${esc(b.nama)}, ${esc(b.singkatan)}, ${esc(b.deskripsi)}, ${esc(b.warna)}, ${esc(b.bgLight)})`
).join(',\n');
sql += bidangValues + ';\n\n';

sql += `-- --------------------------------------------------------
-- 3. TABEL: users
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` varchar(50) NOT NULL,
  \`username\` varchar(100) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`nama\` varchar(150) NOT NULL,
  \`nip\` varchar(50) DEFAULT NULL,
  \`jabatan\` varchar(150) DEFAULT NULL,
  \`role\` varchar(50) NOT NULL DEFAULT 'koordinator',
  \`bidang_id\` varchar(50) DEFAULT NULL,
  \`email\` varchar(100) DEFAULT NULL,
  \`avatar\` longtext DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_username\` (\`username\`),
  KEY \`idx_users_role\` (\`role\`),
  KEY \`idx_users_bidang\` (\`bidang_id\`),
  CONSTRAINT \`fk_users_bidang\` FOREIGN KEY (\`bidang_id\`) REFERENCES \`bidang\` (\`id\`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`users\` (\`id\`, \`username\`, \`password\`, \`nama\`, \`nip\`, \`jabatan\`, \`role\`, \`bidang_id\`, \`email\`, \`avatar\`) VALUES
`;

const userValues = INITIAL_USERS.map(u => 
  `(${esc(u.id)}, ${esc(u.username)}, ${esc(u.password)}, ${esc(u.nama)}, ${esc(u.nip)}, ${esc(u.jabatan)}, ${esc(u.role)}, ${esc(u.bidangId)}, ${esc(u.email)}, ${esc(u.avatar)})`
).join(',\n');
sql += userValues + ';\n\n';

sql += `-- --------------------------------------------------------
-- 4. TABEL: master_tags
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`master_tags\`;
CREATE TABLE \`master_tags\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nama_tag\` varchar(100) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_tag\` (\`nama_tag\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`master_tags\` (\`nama_tag\`) VALUES
`;
const tagValues = DEFAULT_TAGS.map(t => `(${esc(t)})`).join(',\n');
sql += tagValues + ';\n\n';

sql += `-- --------------------------------------------------------
-- 5. TABEL: years
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`years\`;
CREATE TABLE \`years\` (
  \`tahun\` int(11) NOT NULL,
  PRIMARY KEY (\`tahun\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`years\` (\`tahun\`) VALUES (2024), (2025), (2026), (2027);\n\n`;

sql += `-- --------------------------------------------------------
-- 6. TABEL: sipd_programs
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`sipd_programs\`;
CREATE TABLE \`sipd_programs\` (
  \`id\` varchar(50) NOT NULL,
  \`kode_program\` varchar(50) NOT NULL,
  \`nama_program\` text NOT NULL,
  \`bidang_id\` varchar(50) NOT NULL,
  \`deskripsi\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`sipd_programs\` (\`id\`, \`kode_program\`, \`nama_program\`, \`bidang_id\`, \`deskripsi\`) VALUES
`;
const progValues = INITIAL_SIPD_PROGRAMS.map(p => 
  `(${esc(p.id)}, ${esc(p.kodeProgram)}, ${esc(p.namaProgram)}, ${esc(p.bidangId)}, ${esc(p.deskripsi)})`
).join(',\n');
sql += progValues + ';\n\n';

sql += `-- --------------------------------------------------------
-- 7. TABEL: sipd_kegiatan
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`sipd_kegiatan\`;
CREATE TABLE \`sipd_kegiatan\` (
  \`id\` varchar(50) NOT NULL,
  \`program_id\` varchar(50) NOT NULL,
  \`kode_kegiatan\` varchar(50) NOT NULL,
  \`nama_kegiatan\` text NOT NULL,
  \`bidang_id\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`sipd_kegiatan\` (\`id\`, \`program_id\`, \`kode_kegiatan\`, \`nama_kegiatan\`, \`bidang_id\`) VALUES
`;
const kegValues = INITIAL_SIPD_KEGIATAN.map(k => 
  `(${esc(k.id)}, ${esc(k.programId)}, ${esc(k.kodeKegiatan)}, ${esc(k.namaKegiatan)}, ${esc(k.bidangId)})`
).join(',\n');
sql += kegValues + ';\n\n';

sql += `-- --------------------------------------------------------
-- 8. TABEL: sipd_sub_kegiatan
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`sipd_sub_kegiatan\`;
CREATE TABLE \`sipd_sub_kegiatan\` (
  \`id\` varchar(100) NOT NULL,
  \`program_id\` varchar(50) NOT NULL,
  \`kegiatan_id\` varchar(50) NOT NULL,
  \`kode_sub_kegiatan\` varchar(50) NOT NULL,
  \`nama_sub_kegiatan\` text NOT NULL,
  \`bidang_id\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`sipd_sub_kegiatan\` (\`id\`, \`program_id\`, \`kegiatan_id\`, \`kode_sub_kegiatan\`, \`nama_sub_kegiatan\`, \`bidang_id\`) VALUES
`;
const subValues = INITIAL_SIPD_SUB_KEGIATAN.map(s => 
  `(${esc(s.id)}, ${esc(s.programId)}, ${esc(s.kegiatanId)}, ${esc(s.kodeSubKegiatan)}, ${esc(s.namaSubKegiatan)}, ${esc(s.bidangId)})`
).join(',\n');
sql += subValues + ';\n\n';

sql += `-- --------------------------------------------------------
-- 9. TABEL: projects (Master & Monitoring Paket TA 2026: ${MONITORING_PAKET_2026.length} Paket)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`projects\`;
CREATE TABLE \`projects\` (
  \`id\` varchar(100) NOT NULL,
  \`tahun_anggaran\` int(11) NOT NULL DEFAULT 2026,
  \`bidang_id\` varchar(50) NOT NULL,
  \`sub_bagian\` varchar(255) DEFAULT NULL,
  \`sub_kegiatan_id\` varchar(100) DEFAULT NULL,
  \`kode_sub_kegiatan\` varchar(50) DEFAULT NULL,
  \`nama_paket\` text NOT NULL,
  \`kategori_paket\` varchar(100) DEFAULT NULL,
  \`kategori_paket_id\` varchar(50) DEFAULT NULL,
  \`no_urut_kategori\` int(11) DEFAULT NULL,
  \`kategori_pekerjaan\` varchar(50) NOT NULL DEFAULT 'Fisik',
  \`jenis_pengadaan\` varchar(100) DEFAULT NULL,
  \`metode_pemilihan\` varchar(100) DEFAULT NULL,
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
  \`status_tahap_pra_kontrak\` varchar(50) DEFAULT 'rup',
  \`pra_kontrak_json\` longtext DEFAULT NULL,
  \`progres_rencana\` decimal(6,2) NOT NULL DEFAULT 0.00,
  \`progres_realisasi\` decimal(6,2) NOT NULL DEFAULT 0.00,
  \`deviasi_fisik\` decimal(6,2) NOT NULL DEFAULT 0.00,
  \`status_deviasi\` varchar(50) NOT NULL DEFAULT 'Aman',
  \`kurva_s_json\` longtext DEFAULT NULL,
  \`total_pencairan\` decimal(18,2) NOT NULL DEFAULT 0.00,
  \`persen_keuangan\` decimal(6,2) NOT NULL DEFAULT 0.00,
  \`sisa_anggaran\` decimal(18,2) NOT NULL DEFAULT 0.00,
  \`termin_json\` longtext DEFAULT NULL,
  \`tahapan_pencairan_json\` longtext DEFAULT NULL,
  \`spj_status\` varchar(50) NOT NULL DEFAULT 'belum_masuk',
  \`spj_checklist_json\` longtext DEFAULT NULL,
  \`logs_json\` longtext DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_proj_tahun\` (\`tahun_anggaran\`),
  KEY \`idx_proj_bidang\` (\`bidang_id\`),
  KEY \`idx_proj_kat_paket\` (\`kategori_paket_id\`),
  KEY \`idx_proj_no_urut\` (\`no_urut_kategori\`),
  CONSTRAINT \`fk_projects_bidang\` FOREIGN KEY (\`bidang_id\`) REFERENCES \`bidang\` (\`id\`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

// Insert projects in batches of 50
const batchSize = 50;
for (let i = 0; i < MONITORING_PAKET_2026.length; i += batchSize) {
  const batch = MONITORING_PAKET_2026.slice(i, i + batchSize);
  sql += `INSERT INTO \`projects\` (
  \`id\`, \`tahun_anggaran\`, \`bidang_id\`, \`sub_bagian\`, \`sub_kegiatan_id\`, \`kode_sub_kegiatan\`,
  \`nama_paket\`, \`kategori_paket\`, \`kategori_paket_id\`, \`no_urut_kategori\`, \`kategori_pekerjaan\`,
  \`jenis_pengadaan\`, \`metode_pemilihan\`, \`jenis_anggaran\`, \`sumber_dana\`, \`kode_rup\`, \`tipe_pengadaan\`,
  \`pagu_anggaran\`, \`hps\`, \`nilai_kontrak\`, \`nomor_kontrak\`, \`tanggal_kontrak\`, \`tanggal_mulai\`,
  \`tanggal_selesai\`, \`pelaksana_nama\`, \`pelaksana_bank\`, \`pelaksana_rekening\`, \`pelaksana_npwp\`,
  \`kecamatan\`, \`desa\`, \`lokasi_lengkap\`, \`latitude\`, \`longitude\`, \`tags_json\`, \`is_public_highlight\`,
  \`status_tahap_pra_kontrak\`, \`pra_kontrak_json\`, \`progres_rencana\`, \`progres_realisasi\`, \`deviasi_fisik\`,
  \`status_deviasi\`, \`kurva_s_json\`, \`total_pencairan\`, \`persen_keuangan\`, \`sisa_anggaran\`, \`termin_json\`,
  \`tahapan_pencairan_json\`, \`spj_status\`, \`spj_checklist_json\`, \`logs_json\`
) VALUES\n`;

  const rows = batch.map(p => {
    const k = p.dataKontrak || {};
    const f = p.dataFisik || {};
    const q = p.dataKeuangan || {};
    const spj = p.administrasiSPJ || {};

    return `(${esc(p.id)}, ${esc(p.tahunAnggaran || 2026)}, ${esc(p.bidangId)}, ${esc(p.subBagian || p.subKegiatan)}, ${esc(p.subKegiatanId)}, ${esc(p.kodeSubKegiatan)}, ` +
      `${esc(p.namaPaket)}, ${esc(p.kategoriPaket)}, ${esc(p.kategoriPaketId)}, ${esc(p.noUrutKategori)}, ${esc(p.kategoriPekerjaan || 'Fisik')}, ` +
      `${esc(p.jenisPengadaan)}, ${esc(p.metodePemilihan || p.tipePengadaan)}, ${esc(p.jenisAnggaran || 'Murni')}, ${esc(p.sumberDana || 'APBD Murni (DAU)')}, ` +
      `${esc(p.kodeRup)}, ${esc(p.tipePengadaan || p.metodePemilihan)}, ${esc(p.paguAnggaran || 0)}, ${esc(p.hps || p.paguAnggaran || 0)}, ` +
      `${esc(k.nilaiKontrak || 0)}, ${esc(k.nomorKontrak)}, ${esc(k.tanggalKontrak)}, ${esc(k.tanggalMulai)}, ${esc(k.tanggalSelesai)}, ` +
      `${esc(k.namaPenyedia)}, ${esc(k.bankRekanan || 'Bank Jateng')}, ${esc(k.rekeningRekanan)}, ${esc(k.npwpRekanan)}, ` +
      `${esc(p.kecamatan || 'Demak')}, ${esc(p.desa || 'Bintoro')}, ${esc(p.lokasiLengkap || 'Kabupaten Demak')}, ${esc(p.latitude || -6.8944)}, ` +
      `${esc(p.longitude || 110.6385)}, ${esc(p.tags || [])}, ${esc(p.isPublicHighlight ? 1 : 0)}, ${esc(p.statusTahapPraKontrak || 'kontrak')}, ` +
      `${esc(p.tahapPraKontrak || {})}, ${esc(f.progresRencana || 0)}, ${esc(f.progresRealisasi || 0)}, ${esc(f.deviasiFisik || 0)}, ` +
      `${esc(f.statusDeviasi || 'Aman')}, ${esc(f.mingguan || [])}, ${esc(q.totalPencairan || 0)}, ${esc(q.persenKeuangan || 0)}, ` +
      `${esc(q.sisaAnggaran || 0)}, ${esc(q.terminHistory || [])}, ${esc(p.tahapanPencairan || {})}, ${esc(p.spjStatus || 'belum_masuk')}, ` +
      `${esc(spj)}, ${esc(p.logs || [])})`;
  }).join(',\n');

  sql += rows + ';\n\n';
}

sql += `COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
`;

fs.writeFileSync('database/simon_satuputaru.sql', sql, 'utf8');
console.log('database/simon_satuputaru.sql successfully generated!');
console.log('Total monitoring packages included:', MONITORING_PAKET_2026.length);
console.log('File size:', (fs.statSync('database/simon_satuputaru.sql').size / 1024).toFixed(1), 'KB');
