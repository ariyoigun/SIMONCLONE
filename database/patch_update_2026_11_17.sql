-- ==============================================================================
-- PATCH UPDATE SIMON - SATU PUTARU (17 November 2026)
-- Menambahkan Kolom running_text pada Tabel system_settings
-- Serta Sinkronisasi Fitur Jadwal Update & Running Text Pengumuman
-- ==============================================================================

-- 1. Tambah kolom running_text jika belum ada
ALTER TABLE `system_settings` 
ADD COLUMN IF NOT EXISTS `running_text` TEXT NULL 
AFTER `logo_url`;

-- 2. Set teks default pengumuman update mingguan
UPDATE `system_settings` 
SET `running_text` = 'Admin Data melakukan update setiap hari Senin Jam 08.00-10.00 WIB | Verifikasi Data Jam 10.00-12.00 WIB'
WHERE `running_text` IS NULL OR `running_text` = '';

SELECT 'Patch Update Berhasil Diterapkan ke Database!' AS status;
