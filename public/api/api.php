<?php
/**
 * ==============================================================================
 * BACKEND REST API BRIDGE: SIMON - SATU PUTARU
 * Endpoint Terpadu untuk Sinkronisasi Data MySQL Hostinger
 * ==============================================================================
 */

require_once __DIR__ . '/config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Pastikan kolom-kolom baru otomatis dibuat jika belum ada di Hostinger
if ($pdo) {
    try {
        $pdo->exec("ALTER TABLE users MODIFY COLUMN avatar LONGTEXT DEFAULT NULL");
        $pdo->exec("ALTER TABLE system_settings MODIFY COLUMN logo_url LONGTEXT DEFAULT NULL");
        $pdo->exec("ALTER TABLE system_settings MODIFY COLUMN galeri_json LONGTEXT DEFAULT NULL");
        $pdo->exec("ALTER TABLE system_settings MODIFY COLUMN slideshow_unggulan_json LONGTEXT DEFAULT NULL");
        try {
            $pdo->exec("ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS show_galeri_slideshow TINYINT(1) DEFAULT 0");
            $pdo->exec("ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS show_slideshow_unggulan TINYINT(1) DEFAULT 1");
            $pdo->exec("ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS show_peta_koordinat TINYINT(1) DEFAULT 0");
            $pdo->exec("ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS show_kurva_s TINYINT(1) DEFAULT 0");
            $pdo->exec("ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS slideshow_unggulan_json LONGTEXT DEFAULT NULL");
        } catch (Exception $ex) {}
        try {
            $pdo->exec("ALTER TABLE projects ADD COLUMN IF NOT EXISTS foto_dokumentasi_json LONGTEXT DEFAULT NULL");
            $pdo->exec("ALTER TABLE projects ADD COLUMN IF NOT EXISTS kurva_s_json LONGTEXT DEFAULT NULL");
        } catch (Exception $ex2) {}
        try {
            $pdo->exec("ALTER TABLE monitoring_paket ADD COLUMN IF NOT EXISTS foto_dokumentasi_json LONGTEXT DEFAULT NULL");
            $pdo->exec("ALTER TABLE monitoring_paket ADD COLUMN IF NOT EXISTS kurva_s_json LONGTEXT DEFAULT NULL");
        } catch (Exception $ex3) {}
    } catch (Exception $e) {}
}

// 1.05 API Otentikasi Login Terpadu Langsung ke Database MySQL
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $rawId = trim($input['identifier'] ?? '');
    $rawPass = trim($input['password'] ?? '');

    if ($rawId === '' || $rawPass === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Username/NIP dan Password wajib diisi!']);
        exit;
    }

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Koneksi database MySQL belum siap: ' . ($db_connection_error ?? 'Offline')]);
        exit;
    }

    try {
        $cleanId = strtolower($rawId);
        $cleanNip = preg_replace('/\s+/', '', $rawId);

        // Cari akun di tabel users
        $stmt = $pdo->prepare("SELECT id, username, password, nama, nip, jabatan, role, bidang_id AS bidangId, email, avatar 
            FROM users 
            WHERE LOWER(username) = :u 
               OR LOWER(email) = :e 
               OR REPLACE(nip, ' ', '') = :n 
            LIMIT 5");
        $stmt->execute([':u' => $cleanId, ':e' => $cleanId, ':n' => $cleanNip]);
        $matched = $stmt->fetchAll();

        // Fallback untuk koor.sekre1 / koor.sekre2
        if (empty($matched) && $cleanId === 'koor.sekre1') {
            $stmt = $pdo->prepare("SELECT id, username, password, nama, nip, jabatan, role, bidang_id AS bidangId, email, avatar FROM users WHERE username = 'koor.sekre2' LIMIT 1");
            $stmt->execute();
            $matched = $stmt->fetchAll();
        }

        if (empty($matched)) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Akun dengan username / NIP / email tersebut tidak ditemukan di sistem!']);
            exit;
        }

        // Cari user yang password-nya cocok jika ada beberapa akun dengan NIP yang sama
        $user = null;
        foreach ($matched as $m) {
            $uPass = $m['password'] ?? 'pupr2025';
            if ($uPass === $rawPass) {
                $user = $m;
                break;
            }
        }

        if (!$user) {
            $expected = $matched[0]['password'] ?? 'pupr2025';
            if ($expected !== $rawPass) {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'Kata sandi / Password salah! Silakan periksa kembali.']);
                exit;
            }
            $user = $matched[0];
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Login berhasil!',
            'user' => $user
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Kesalahan server saat verifikasi akun: ' . $e->getMessage()]);
    }
    exit;
}

// 1. Cek Koneksi / Health Check
if ($action === 'health') {
    if ($pdo) {
        echo json_encode([
            'status' => 'success',
            'connected' => true,
            'message' => 'Koneksi database MySQL Hostinger Berhasil!',
            'server_time' => date('Y-m-d H:i:s')
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'connected' => false,
            'message' => 'Koneksi database gagal atau kredensial di config.php belum disesuaikan: ' . ($db_connection_error ?? 'Unknown error'),
            'tip' => 'Silakan sesuaikan $db_name, $db_user, dan $db_pass di file api/config.php'
        ]);
    }
    exit;
}

// 1.1 Ambil Konfigurasi Database Saat Ini (Superadmin)
if ($action === 'get_db_config') {
    echo json_encode([
        'status' => 'success',
        'config' => [
            'db_host' => $db_host ?? 'localhost',
            'db_port' => $db_port ?? '3306',
            'db_name' => $db_name ?? 'u490770675_simona',
            'db_user' => $db_user ?? 'u490770675_adminsimon',
            'db_pass' => $db_pass ?? '*Demak2026',
            'domain' => 'simon.satuputarudemak.id',
            'url' => 'https://simon.satuputarudemak.id'
        ],
        'connected' => $pdo !== null,
        'message' => $pdo ? 'Terhubung ke database MySQL Hostinger' : 'Database belum terhubung',
        'error_detail' => $db_connection_error ?? null
    ]);
    exit;
}

// 1.2 Tes Koneksi Database Langsung (Superadmin Test Connection)
if ($action === 'test_db' || $action === 'test_connection') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $t_host = !empty($input['db_host']) ? trim($input['db_host']) : ($db_host ?? 'localhost');
    $t_port = !empty($input['db_port']) ? trim($input['db_port']) : ($db_port ?? '3306');
    $t_name = !empty($input['db_name']) ? trim($input['db_name']) : ($db_name ?? 'u490770675_simona');
    $t_user = !empty($input['db_user']) ? trim($input['db_user']) : ($db_user ?? 'u490770675_adminsimon');
    $t_pass = isset($input['db_pass']) && $input['db_pass'] !== '' ? trim($input['db_pass']) : ($db_pass ?? '*Demak2026');

    $startTime = microtime(true);
    try {
        $t_dsn = "mysql:host={$t_host};port={$t_port};dbname={$t_name};charset=utf8mb4";
        $t_pdo = new PDO($t_dsn, $t_user, $t_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5
        ]);
        $latency = round((microtime(true) - $startTime) * 1000, 2);
        $serverVersion = $t_pdo->query("SELECT VERSION()")->fetchColumn();

        // Cek tabel penting
        $expected = ['system_settings', 'bidang', 'users', 'projects', 'sipd_programs', 'sipd_kegiatan', 'sipd_sub_kegiatan', 'years'];
        $tblResults = [];
        foreach ($expected as $tbl) {
            try {
                $c = $t_pdo->query("SELECT COUNT(*) FROM `{$tbl}`")->fetchColumn();
                $tblResults[$tbl] = ['exists' => true, 'rows' => (int)$c];
            } catch (Exception $e) {
                $tblResults[$tbl] = ['exists' => false, 'rows' => 0];
            }
        }

        echo json_encode([
            'status' => 'success',
            'connected' => true,
            'message' => "Koneksi ke database MySQL Hostinger ({$t_name}) Berhasil!",
            'latency_ms' => $latency,
            'server_version' => $serverVersion,
            'database' => $t_name,
            'user' => $t_user,
            'host' => $t_host,
            'tables' => $tblResults
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'status' => 'error',
            'connected' => false,
            'message' => 'Gagal terhubung ke MySQL Hostinger: ' . $e->getMessage(),
            'database' => $t_name,
            'user' => $t_user,
            'host' => $t_host,
            'troubleshooting' => [
                '1. Pastikan nama database, user, dan password di hPanel Hostinger sudah sesuai.',
                '2. Pastikan user MySQL sudah diberikan semua hak akses (All Privileges) pada database.',
                '3. Pastikan host adalah "localhost" (standar Hostinger).',
                '4. Jika tabel belum ada, silakan impor database/simon_satuputaru.sql melalui phpMyAdmin di Hostinger.'
            ]
        ]);
    }
    exit;
}

// 1.3 Simpan Konfigurasi Database ke config.local.php (Superadmin Save DB)
if ($action === 'save_db_config' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['db_name']) || empty($input['db_user'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Nama database dan username MySQL wajib diisi!']);
        exit;
    }

    $s_host = addslashes(trim($input['db_host'] ?? 'localhost'));
    $s_port = addslashes(trim($input['db_port'] ?? '3306'));
    $s_name = addslashes(trim($input['db_name'] ?? 'u490770675_simona'));
    $s_user = addslashes(trim($input['db_user'] ?? 'u490770675_adminsimon'));
    $s_pass = addslashes(trim($input['db_pass'] ?? '*Demak2026'));

    $configFile = __DIR__ . '/config.local.php';
    $phpCode = "<?php\n"
        . "/**\n"
        . " * Konfigurasi Database Lokal Hostinger SIMON - SATU PUTARU\n"
        . " * Domain: https://simon.satuputarudemak.id\n"
        . " * Disimpan oleh Superadmin: " . date('Y-m-d H:i:s') . "\n"
        . " */\n"
        . "\$db_host = '{$s_host}';\n"
        . "\$db_port = '{$s_port}';\n"
        . "\$db_name = '{$s_name}';\n"
        . "\$db_user = '{$s_user}';\n"
        . "\$db_pass = '{$s_pass}';\n";

    $res = @file_put_contents($configFile, $phpCode);
    if ($res !== false) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Konfigurasi database MySQL Hostinger berhasil disimpan ke config.local.php!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal menulis file config.local.php. Periksa izin akses (permission 755/644) folder public/api di hosting.'
        ]);
    }
    exit;
}

// Jika koneksi belum tersedia, kembalikan response informatif
if (!$pdo) {
    echo json_encode([
        'status' => 'offline',
        'connected' => false,
        'message' => 'Database MySQL Hostinger belum terkonfigurasi. Menggunakan data lokal (LocalStorage).',
        'error_detail' => $db_connection_error ?? 'No connection'
    ]);
    exit;
}

// 2. LOAD SEMUA DATA (Settings, Users, Projects, Tags)
if ($action === 'load_all') {
    try {
        // Ambil System Settings
        $stmtSettings = $pdo->query("SELECT * FROM system_settings WHERE id = 1 LIMIT 1");
        $settingsRaw = $stmtSettings->fetch();
        $settings = null;
        if ($settingsRaw) {
            $settings = $settingsRaw;
            $settings['namaSistem'] = $settingsRaw['nama_sistem'] ?? 'SIMON - SATU PUTARU';
            $settings['subNama'] = $settingsRaw['sub_nama'] ?? 'Sistem Informasi Monitoring Progres Pekerjaan DINPUTARU';
            $settings['instansi'] = $settingsRaw['instansi'] ?? 'Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak';
            $settings['pemerintahDaerah'] = $settingsRaw['pemerintah_daerah'] ?? 'Pemerintah Kabupaten Demak';
            $settings['alamat'] = $settingsRaw['alamat'] ?? '';
            $settings['telepon'] = $settingsRaw['telepon'] ?? '';
            $settings['email'] = $settingsRaw['email'] ?? '';
            $settings['website'] = $settingsRaw['website'] ?? '';
            $settings['logoUrl'] = $settingsRaw['logo_url'] ?? '';
            $settings['namaKepalaDinas'] = $settingsRaw['nama_kepala_dinas'] ?? '';
            $settings['nipKepalaDinas'] = $settingsRaw['nip_kepala_dinas'] ?? '';
            $settings['pangkatKepalaDinas'] = $settingsRaw['pangkat_kepala_dinas'] ?? '';
            $settings['jabatanKepalaDinas'] = $settingsRaw['jabatan_kepala_dinas'] ?? '';
            $settings['namaSekretaris'] = $settingsRaw['nama_sekretaris'] ?? '';
            $settings['nipSekretaris'] = $settingsRaw['nip_sekretaris'] ?? '';
            $settings['pangkatSekretaris'] = $settingsRaw['pangkat_sekretaris'] ?? '';
            $settings['jabatanSekretaris'] = $settingsRaw['jabatan_sekretaris'] ?? '';
            $settings['maxPublicHighlights'] = (int)($settingsRaw['max_public_highlights'] ?? 12);
            $settings['showGaleriSlideshow'] = isset($settingsRaw['show_galeri_slideshow']) ? (bool)$settingsRaw['show_galeri_slideshow'] : false;
            $settings['showSlideshowUnggulan'] = isset($settingsRaw['show_slideshow_unggulan']) ? (bool)$settingsRaw['show_slideshow_unggulan'] : true;
            $settings['showPetaKoordinat'] = isset($settingsRaw['show_peta_koordinat']) ? (bool)$settingsRaw['show_peta_koordinat'] : false;
            $settings['showKurvaS'] = isset($settingsRaw['show_kurva_s']) ? (bool)$settingsRaw['show_kurva_s'] : false;
            $settings['slideshowUnggulan'] = !empty($settingsRaw['slideshow_unggulan_json']) ? json_decode($settingsRaw['slideshow_unggulan_json'], true) : [];
            $settings['galeri'] = !empty($settingsRaw['galeri_json']) ? json_decode($settingsRaw['galeri_json'], true) : [];
            $settings['customTexts'] = !empty($settingsRaw['custom_texts_json']) ? json_decode($settingsRaw['custom_texts_json'], true) : [];
            $settings['bidangDescriptions'] = !empty($settingsRaw['bidang_descriptions_json']) ? json_decode($settingsRaw['bidang_descriptions_json'], true) : [];
        }

        // Ambil Users
        $stmtUsers = $pdo->query("SELECT id, username, password, nama, nip, jabatan, role, bidang_id AS bidangId, email, avatar FROM users ORDER BY id ASC");
        $users = $stmtUsers->fetchAll();

        // Ambil Master Tags
        $stmtTags = $pdo->query("SELECT nama_tag FROM master_tags ORDER BY id ASC");
        $tagsRows = $stmtTags->fetchAll();
        $tags = array_map(function($r) { return $r['nama_tag']; }, $tagsRows);

        // Ambil SIPD Programs jika ada
        $sipdPrograms = [];
        try {
            $stmtProg = $pdo->query("SELECT id, kode_program AS kodeProgram, nama_program AS namaProgram, bidang_id AS bidangId, deskripsi FROM sipd_programs ORDER BY kode_program ASC");
            $sipdPrograms = $stmtProg->fetchAll();
        } catch (Exception $e) {}

        // Ambil SIPD Kegiatan jika ada
        $sipdKegiatan = [];
        try {
            $stmtKeg = $pdo->query("SELECT id, program_id AS programId, kode_kegiatan AS kodeKegiatan, nama_kegiatan AS namaKegiatan, bidang_id AS bidangId FROM sipd_kegiatan ORDER BY kode_kegiatan ASC");
            $sipdKegiatan = $stmtKeg->fetchAll();
        } catch (Exception $e) {}

        // Ambil SIPD Sub Kegiatan jika ada
        $sipdSubKegiatan = [];
        try {
            $stmtSub = $pdo->query("SELECT id, program_id AS programId, kegiatan_id AS kegiatanId, kode_sub_kegiatan AS kodeSubKegiatan, nama_sub_kegiatan AS namaSubKegiatan, bidang_id AS bidangId FROM sipd_sub_kegiatan ORDER BY kode_sub_kegiatan ASC");
            $sipdSubKegiatan = $stmtSub->fetchAll();
        } catch (Exception $e) {}

        // Ambil Years jika ada
        $years = [];
        try {
            $stmtYears = $pdo->query("SELECT tahun FROM years ORDER BY tahun ASC");
            $yearsRows = $stmtYears->fetchAll();
            $years = array_map(function($r) { return (int)$r['tahun']; }, $yearsRows);
        } catch (Exception $e) {}

        // Ambil Projects
        $stmtProjects = $pdo->query("SELECT * FROM projects ORDER BY tahun_anggaran DESC, id ASC");
        $projectsRaw = $stmtProjects->fetchAll();

        $projects = array_map(function($p) {
            $totalCair = (float)$p['total_pencairan'];
            $fRealisasi = (float)$p['progres_realisasi'];
            $kNilai = (float)$p['nilai_kontrak'];
            $pagu = (float)$p['pagu_anggaran'];
            $baseVal = $kNilai > 0 ? $kNilai : ($pagu > 0 ? $pagu : 1);

            $hasContract = ($p['status_tahap_pra_kontrak'] === 'kontrak' || 
                            $p['status_tahap_pra_kontrak'] === 'pelaksanaan_kontrak' || 
                            $kNilai > 0 || 
                            !empty($p['tanggal_kontrak']) || 
                            !empty($p['nomor_kontrak']) ||
                            (!empty($p['pelaksana_nama']) && $p['pelaksana_nama'] !== '-' && $p['pelaksana_nama'] !== 'Belum Ditunjuk / Tahap Pemilihan') ||
                            ($totalCair > 0) || 
                            ($fRealisasi > 0));

            $isKontrak = $hasContract;
            $statusTahap = $isKontrak ? 'kontrak' : ($p['status_tahap_pra_kontrak'] ?? 'rup');

            $rawSpj = $p['spj_status'] ?? 'belum_masuk';
            if ($rawSpj === 'sp2d_terbit' || $rawSpj === 'belum_diajukan' || empty($rawSpj)) {
                if ($totalCair > 0 && $totalCair >= $baseVal) {
                    $rawSpj = 'sudah_sp2d';
                } elseif ($totalCair > 0) {
                    $rawSpj = 'sudah_masuk';
                } else {
                    $rawSpj = 'belum_masuk';
                }
            }

            $praKontrakObj = !empty($p['pra_kontrak_json']) ? json_decode($p['pra_kontrak_json'], true) : null;
            if (!$praKontrakObj || empty($praKontrakObj['status'])) {
                $praKontrakObj = [
                    'status' => $statusTahap,
                    'targetMulaiTender' => $p['tanggal_mulai'] ?? '',
                    'targetSelesaiTender' => $p['tanggal_selesai'] ?? '',
                    'catatanPraKontrak' => $isKontrak ? 'Kontrak pelaksanaan pekerjaan telah berjalan' : 'Tahapan persiapan RUP'
                ];
            }

            $spjObj = !empty($p['spj_checklist_json']) ? json_decode($p['spj_checklist_json'], true) : null;
            if (!$spjObj || empty($spjObj['status'])) {
                $spjObj = [
                    'status' => $rawSpj,
                    'tanggalMasuk' => $rawSpj !== 'belum_masuk' ? (!empty($p['tanggal_kontrak']) ? $p['tanggal_kontrak'] : '2026-10-15') : '',
                    'tanggalKoreksi' => '',
                    'tanggalSPM' => $rawSpj === 'sudah_sp2d' ? '2026-10-25' : '',
                    'nomorSPM' => $rawSpj === 'sudah_sp2d' ? (!empty($p['nomor_kontrak']) ? '900/SPM/' . $p['nomor_kontrak'] : '900/SPM/DPU/2026') : '',
                    'catatanVerifikator' => $rawSpj === 'sudah_sp2d' ? 'Berkas SPJ lengkap & SP2D lunas 100%' : ($rawSpj === 'sudah_masuk' ? 'Berkas SPJ termin masuk, proses verifikasi SP2D' : 'Belum mengajukan berkas SPJ'),
                    'petugasVerifikator' => $rawSpj !== 'belum_masuk' ? 'Tim Verifikasi SPJ Keuangan' : ''
                ];
            }

            $terminHistory = !empty($p['termin_json']) ? json_decode($p['termin_json'], true) : [];
            if (empty($terminHistory) && $totalCair > 0) {
                $terminHistory = [
                    [
                        'id' => 'TRM-' . $p['id'] . '-1',
                        'terminKe' => $totalCair >= $baseVal ? 'Pelunasan SP2D 100%' : 'Pencairan SP2D Termin',
                        'nomorSP2D' => !empty($p['nomor_kontrak']) ? 'SP2D-' . $p['nomor_kontrak'] : 'SP2D-2026-OKT',
                        'tanggalSP2D' => !empty($p['tanggal_kontrak']) ? $p['tanggal_kontrak'] : '2026-10-31',
                        'jumlah' => $totalCair,
                        'persen' => (float)$p['persen_keuangan'],
                        'keterangan' => 'Pencairan SP2D Keuangan s/d Oktober 2026'
                    ]
                ];
            }

            return [
                'id' => $p['id'],
                'tahunAnggaran' => (int)$p['tahun_anggaran'],
                'bidangId' => $p['bidang_id'],
                'subBagian' => $p['sub_bagian'],
                'subKegiatanId' => $p['sub_kegiatan_id'] ?? null,
                'kodeSubKegiatan' => $p['kode_sub_kegiatan'] ?? null,
                'kategoriPekerjaan' => $p['kategori_pekerjaan'] ?? 'Fisik',
                'namaPaket' => $p['nama_paket'],
                'jenisAnggaran' => $p['jenis_anggaran'],
                'sumberDana' => $p['sumber_dana'],
                'kodeRup' => $p['kode_rup'],
                'tipePengadaan' => $p['tipe_pengadaan'],
                'paguAnggaran' => $pagu,
                'hps' => (float)$p['hps'],
                'kecamatan' => $p['kecamatan'],
                'desa' => $p['desa'],
                'lokasiLengkap' => $p['lokasi_lengkap'],
                'latitude' => $p['latitude'],
                'longitude' => $p['longitude'],
                'tags' => !empty($p['tags_json']) ? json_decode($p['tags_json'], true) : [],
                'isPublicHighlight' => (bool)$p['is_public_highlight'],
                'isKontrak' => $isKontrak,
                'tahapPraKontrak' => $praKontrakObj,
                'dataKontrak' => [
                    'nomorKontrak' => $p['nomor_kontrak'],
                    'tanggalKontrak' => $p['tanggal_kontrak'],
                    'tanggalMulai' => $p['tanggal_mulai'],
                    'tanggalSelesai' => $p['tanggal_selesai'],
                    'nilaiKontrak' => $kNilai,
                    'namaPenyedia' => $p['pelaksana_nama'],
                    'bankRekanan' => $p['pelaksana_bank'],
                    'rekeningRekanan' => $p['pelaksana_rekening'],
                    'npwpRekanan' => $p['pelaksana_npwp']
                ],
                'statusTahapPraKontrak' => $statusTahap,
                'dataPraKontrak' => $praKontrakObj,
                'dataFisik' => [
                    'progresRencana' => (float)$p['progres_rencana'],
                    'progresRealisasi' => $fRealisasi,
                    'deviasiFisik' => (float)$p['deviasi_fisik'],
                    'statusDeviasi' => $p['status_deviasi'],
                    'mingguan' => !empty($p['kurva_s_json']) ? json_decode($p['kurva_s_json'], true) : [],
                    'fotoDokumentasi' => !empty($p['foto_dokumentasi_json']) ? json_decode($p['foto_dokumentasi_json'], true) : []
                ],
                'fotoDokumentasi' => !empty($p['foto_dokumentasi_json']) ? json_decode($p['foto_dokumentasi_json'], true) : [],
                'dataKeuangan' => [
                    'totalPencairan' => $totalCair,
                    'persenKeuangan' => (float)$p['persen_keuangan'],
                    'sisaAnggaran' => (float)$p['sisa_anggaran'],
                    'terminHistory' => $terminHistory
                ],
                'spjStatus' => $rawSpj,
                'administrasiSPJ' => $spjObj,
                'dataSpj' => $spjObj,
                'logs' => !empty($p['logs_json']) ? json_decode($p['logs_json'], true) : [],
            ];
        }, $projectsRaw);

        // Ambil Paket Pekerjaan jika tabel monitoring_paket ada
        $paketPekerjaanList = [];
        try {
            $stmtPaket = $pdo->query("SELECT * FROM monitoring_paket ORDER BY kategori_paket_id ASC, no_urut_kategori ASC, id ASC");
            $paketRows = $stmtPaket->fetchAll();
            $paketPekerjaanList = array_map(function($p) {
                return [
                    'id' => $p['id'],
                    'tahunAnggaran' => (int)($p['tahun_anggaran'] ?? 2026),
                    'noUrutKategori' => (int)($p['no_urut_kategori'] ?? 0),
                    'kategoriPaket' => $p['kategori_paket'] ?? '',
                    'kategoriPaketId' => $p['kategori_paket_id'] ?? '',
                    'bidangId' => $p['bidang_id'],
                    'subBagian' => $p['sub_bagian'] ?? '',
                    'subKegiatan' => $p['sub_kegiatan'] ?? '',
                    'namaPaket' => $p['nama_paket'],
                    'kategoriPekerjaan' => $p['kategori_pekerjaan'] ?? 'Fisik',
                    'jenisPengadaan' => $p['jenis_pengadaan'] ?? '',
                    'metodePemilihan' => $p['metode_pemilihan'] ?? '',
                    'tipePengadaan' => $p['tipe_pengadaan'] ?? 'Tender',
                    'paguAnggaran' => (float)($p['pagu_anggaran'] ?? 0),
                    'hps' => (float)($p['hps'] ?? 0),
                    'isPublicHighlight' => !empty($p['is_public_highlight']),
                    'isKontrak' => ((float)($p['nilai_kontrak'] ?? 0) > 0 || !empty($p['nomor_kontrak']) || !empty($p['tanggal_kontrak'])),
                    'statusTahapPraKontrak' => $p['status_tahap_pra_kontrak'] ?? 'rup',
                    'dataKontrak' => [
                        'nilaiKontrak' => (float)($p['nilai_kontrak'] ?? 0),
                        'nomorKontrak' => $p['nomor_kontrak'] ?? '',
                        'tanggalKontrak' => $p['tanggal_kontrak'] ?? '',
                        'tanggalMulai' => $p['tanggal_mulai'] ?? '',
                        'tanggalSelesai' => $p['tanggal_selesai'] ?? '',
                        'namaPenyedia' => $p['pelaksana_nama'] ?? '-',
                        'bankRekanan' => $p['pelaksana_bank'] ?? 'Bank Jateng',
                        'rekeningRekanan' => $p['pelaksana_rekening'] ?? '',
                        'npwpRekanan' => $p['pelaksana_npwp'] ?? ''
                    ],
                    'kecamatan' => $p['kecamatan'] ?? 'Demak',
                    'desa' => $p['desa'] ?? 'Bintoro',
                    'lokasiLengkap' => $p['lokasi_lengkap'] ?? '',
                    'latitude' => $p['latitude'] ?? null,
                    'longitude' => $p['longitude'] ?? null,
                    'tags' => !empty($p['tags_json']) ? json_decode($p['tags_json'], true) : [],
                    'dataFisik' => [
                        'progresRencana' => (float)($p['progres_rencana'] ?? 0),
                        'progresRealisasi' => (float)($p['progres_realisasi'] ?? 0),
                        'deviasiFisik' => (float)($p['deviasi_fisik'] ?? 0),
                        'statusDeviasi' => $p['status_deviasi'] ?? 'Aman',
                        'mingguan' => !empty($p['kurva_s_json']) ? json_decode($p['kurva_s_json'], true) : [],
                        'fotoDokumentasi' => !empty($p['foto_dokumentasi_json']) ? json_decode($p['foto_dokumentasi_json'], true) : []
                    ],
                    'dataKeuangan' => [
                        'totalPencairan' => (float)($p['total_pencairan'] ?? 0),
                        'persenKeuangan' => (float)($p['persen_keuangan'] ?? 0),
                        'sisaAnggaran' => (float)($p['sisa_anggaran'] ?? 0),
                        'terminHistory' => !empty($p['termin_json']) ? json_decode($p['termin_json'], true) : []
                    ],
                    'spjStatus' => $p['spj_status'] ?? 'belum_masuk',
                    'administrasiSPJ' => !empty($p['spj_checklist_json']) ? json_decode($p['spj_checklist_json'], true) : null,
                    'tahapanPencairan' => !empty($p['tahapan_pencairan_json']) ? json_decode($p['tahapan_pencairan_json'], true) : null,
                    'logs' => !empty($p['logs_json']) ? json_decode($p['logs_json'], true) : []
                ];
            }, $paketRows);
        } catch (Exception $e) {}

        echo json_encode([
            'status' => 'success',
            'data' => [
                'systemSettings' => $settings,
                'users' => $users,
                'tags' => $tags,
                'projects' => $projects,
                'paketPekerjaanList' => $paketPekerjaanList,
                'sipdPrograms' => $sipdPrograms,
                'sipdKegiatans' => $sipdKegiatan,
                'sipdSubKegiatans' => $sipdSubKegiatan,
                'years' => $years
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// 3. SIMPAN / UPDATE PROYEK (POST JSON)
if ($action === 'save_project' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data proyek atau ID tidak valid']);
        exit;
    }

    try {
        $p = $input;
        $k = $p['dataKontrak'] ?? [];
        $f = $p['dataFisik'] ?? [];
        $q = $p['dataKeuangan'] ?? [];

        $katPekerjaan = $p['kategoriPekerjaan'] ?? (($p['tipePengadaan'] ?? '') === 'Swakelola' ? 'Swakelola' : ((($p['tipePengadaan'] ?? '') === 'e-Purchasing') ? 'Barang' : 'Fisik'));

        $sql = "INSERT INTO projects (
            id, tahun_anggaran, bidang_id, sub_bagian, sub_kegiatan_id, kode_sub_kegiatan, nama_paket, kategori_pekerjaan, jenis_anggaran, sumber_dana,
            kode_rup, tipe_pengadaan, pagu_anggaran, hps, nilai_kontrak, nomor_kontrak,
            tanggal_kontrak, tanggal_mulai, tanggal_selesai, pelaksana_nama, pelaksana_bank,
            pelaksana_rekening, pelaksana_npwp, kecamatan, desa, lokasi_lengkap, latitude,
            longitude, tags_json, is_public_highlight, status_tahap_pra_kontrak, pra_kontrak_json,
            progres_rencana, progres_realisasi, deviasi_fisik, status_deviasi, kurva_s_json, foto_dokumentasi_json,
            total_pencairan, persen_keuangan, sisa_anggaran, termin_json, spj_status, spj_checklist_json, logs_json
        ) VALUES (
            :id, :tahun_anggaran, :bidang_id, :sub_bagian, :sub_kegiatan_id, :kode_sub_kegiatan, :nama_paket, :kategori_pekerjaan, :jenis_anggaran, :sumber_dana,
            :kode_rup, :tipe_pengadaan, :pagu_anggaran, :hps, :nilai_kontrak, :nomor_kontrak,
            :tanggal_kontrak, :tanggal_mulai, :tanggal_selesai, :pelaksana_nama, :pelaksana_bank,
            :pelaksana_rekening, :pelaksana_npwp, :kecamatan, :desa, :lokasi_lengkap, :latitude,
            :longitude, :tags_json, :is_public_highlight, :status_tahap_pra_kontrak, :pra_kontrak_json,
            :progres_rencana, :progres_realisasi, :deviasi_fisik, :status_deviasi, :kurva_s_json, :foto_dokumentasi_json,
            :total_pencairan, :persen_keuangan, :sisa_anggaran, :termin_json, :spj_status, :spj_checklist_json, :logs_json
        ) ON DUPLICATE KEY UPDATE
            tahun_anggaran = VALUES(tahun_anggaran),
            bidang_id = VALUES(bidang_id),
            sub_bagian = VALUES(sub_bagian),
            sub_kegiatan_id = VALUES(sub_kegiatan_id),
            kode_sub_kegiatan = VALUES(kode_sub_kegiatan),
            nama_paket = VALUES(nama_paket),
            kategori_pekerjaan = VALUES(kategori_pekerjaan),
            jenis_anggaran = VALUES(jenis_anggaran),
            sumber_dana = VALUES(sumber_dana),
            kode_rup = VALUES(kode_rup),
            tipe_pengadaan = VALUES(tipe_pengadaan),
            pagu_anggaran = VALUES(pagu_anggaran),
            hps = VALUES(hps),
            nilai_kontrak = VALUES(nilai_kontrak),
            nomor_kontrak = VALUES(nomor_kontrak),
            tanggal_kontrak = VALUES(tanggal_kontrak),
            tanggal_mulai = VALUES(tanggal_mulai),
            tanggal_selesai = VALUES(tanggal_selesai),
            pelaksana_nama = VALUES(pelaksana_nama),
            pelaksana_bank = VALUES(pelaksana_bank),
            pelaksana_rekening = VALUES(pelaksana_rekening),
            pelaksana_npwp = VALUES(pelaksana_npwp),
            kecamatan = VALUES(kecamatan),
            desa = VALUES(desa),
            lokasi_lengkap = VALUES(lokasi_lengkap),
            latitude = VALUES(latitude),
            longitude = VALUES(longitude),
            tags_json = VALUES(tags_json),
            is_public_highlight = VALUES(is_public_highlight),
            status_tahap_pra_kontrak = VALUES(status_tahap_pra_kontrak),
            pra_kontrak_json = VALUES(pra_kontrak_json),
            progres_rencana = VALUES(progres_rencana),
            progres_realisasi = VALUES(progres_realisasi),
            deviasi_fisik = VALUES(deviasi_fisik),
            status_deviasi = VALUES(status_deviasi),
            kurva_s_json = VALUES(kurva_s_json),
            foto_dokumentasi_json = VALUES(foto_dokumentasi_json),
            total_pencairan = VALUES(total_pencairan),
            persen_keuangan = VALUES(persen_keuangan),
            sisa_anggaran = VALUES(sisa_anggaran),
            termin_json = VALUES(termin_json),
            spj_status = VALUES(spj_status),
            spj_checklist_json = VALUES(spj_checklist_json),
            logs_json = VALUES(logs_json)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $p['id'],
            ':tahun_anggaran' => (int)($p['tahunAnggaran'] ?? 2026),
            ':bidang_id' => $p['bidangId'] ?? 'bina_marga',
            ':sub_bagian' => $p['subBagian'] ?? '',
            ':sub_kegiatan_id' => $p['subKegiatanId'] ?? null,
            ':kode_sub_kegiatan' => $p['kodeSubKegiatan'] ?? null,
            ':nama_paket' => $p['namaPaket'] ?? '',
            ':kategori_pekerjaan' => $katPekerjaan,
            ':jenis_anggaran' => $p['jenisAnggaran'] ?? 'Murni',
            ':sumber_dana' => $p['sumberDana'] ?? 'APBD Murni (DAU)',
            ':kode_rup' => $p['kodeRup'] ?? '',
            ':tipe_pengadaan' => $p['tipePengadaan'] ?? 'Tender / Seleksi Umum',
            ':pagu_anggaran' => (float)($p['paguAnggaran'] ?? 0),
            ':hps' => (float)($p['hps'] ?? 0),
            ':nilai_kontrak' => (float)($k['nilaiKontrak'] ?? 0),
            ':nomor_kontrak' => $k['nomorKontrak'] ?? '',
            ':tanggal_kontrak' => !empty($k['tanggalKontrak']) ? $k['tanggalKontrak'] : null,
            ':tanggal_mulai' => !empty($k['tanggalMulai']) ? $k['tanggalMulai'] : null,
            ':tanggal_selesai' => !empty($k['tanggalSelesai']) ? $k['tanggalSelesai'] : null,
            ':pelaksana_nama' => $k['namaPenyedia'] ?? '',
            ':pelaksana_bank' => $k['bankRekanan'] ?? '',
            ':pelaksana_rekening' => $k['rekeningRekanan'] ?? '',
            ':pelaksana_npwp' => $k['npwpRekanan'] ?? '',
            ':kecamatan' => $p['kecamatan'] ?? '',
            ':desa' => $p['desa'] ?? '',
            ':lokasi_lengkap' => $p['lokasiLengkap'] ?? '',
            ':latitude' => $p['latitude'] ?? '',
            ':longitude' => $p['longitude'] ?? '',
            ':tags_json' => json_encode($p['tags'] ?? []),
            ':is_public_highlight' => !empty($p['isPublicHighlight']) ? 1 : 0,
            ':status_tahap_pra_kontrak' => $p['statusTahapPraKontrak'] ?? 'identifikasi_kebutuhan',
            ':pra_kontrak_json' => json_encode($p['dataPraKontrak'] ?? []),
            ':progres_rencana' => (float)($f['progresRencana'] ?? 0),
            ':progres_realisasi' => (float)($f['progresRealisasi'] ?? 0),
            ':deviasi_fisik' => (float)($f['deviasiFisik'] ?? 0),
            ':status_deviasi' => $f['statusDeviasi'] ?? 'Aman',
            ':kurva_s_json' => json_encode($f['mingguan'] ?? []),
            ':foto_dokumentasi_json' => json_encode($f['fotoDokumentasi'] ?? []),
            ':total_pencairan' => (float)($q['totalPencairan'] ?? 0),
            ':persen_keuangan' => (float)($q['persenKeuangan'] ?? 0),
            ':sisa_anggaran' => (float)($q['sisaAnggaran'] ?? 0),
            ':termin_json' => json_encode($q['terminHistory'] ?? []),
            ':spj_status' => $p['spjStatus'] ?? 'belum_diajukan',
            ':spj_checklist_json' => json_encode($p['dataSpj'] ?? []),
            ':logs_json' => json_encode($p['logs'] ?? [])
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Paket pekerjaan berhasil disimpan ke database']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// 4. HAPUS PROYEK (DELETE)
if ($action === 'delete_project') {
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID proyek diperlukan']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['status' => 'success', 'message' => 'Proyek berhasil dihapus dari database']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// 4.5 SIMPAN / UPDATE MASTER PAKET PEKERJAAN (POST JSON)
if ($action === 'save_paket_pekerjaan' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data paket pekerjaan tidak valid']);
        exit;
    }

    try {
        $p = $input;
        $k = $p['dataKontrak'] ?? [];
        $f = $p['dataFisik'] ?? [];
        $q = $p['dataKeuangan'] ?? [];
        $tp = $p['tahapanPencairan'] ?? null;

        $sql = "INSERT INTO monitoring_paket (
            id, tahun_anggaran, no_urut_kategori, kategori_paket, kategori_paket_id, bidang_id,
            sub_bagian, sub_kegiatan, nama_paket, kategori_pekerjaan, jenis_pengadaan, metode_pemilihan,
            tipe_pengadaan, pagu_anggaran, hps, nilai_kontrak, nomor_kontrak, tanggal_kontrak,
            tanggal_mulai, tanggal_selesai, pelaksana_nama, pelaksana_bank, pelaksana_rekening, pelaksana_npwp,
            kecamatan, desa, lokasi_lengkap, latitude, longitude, tags_json, is_public_highlight,
            status_tahap_pra_kontrak, progres_rencana, progres_realisasi, deviasi_fisik, status_deviasi, kurva_s_json,
            total_pencairan, persen_keuangan, sisa_anggaran, termin_json, spj_status, spj_checklist_json,
            tahapan_pencairan_json, logs_json
        ) VALUES (
            :id, :tahun_anggaran, :no_urut_kategori, :kategori_paket, :kategori_paket_id, :bidang_id,
            :sub_bagian, :sub_kegiatan, :nama_paket, :kategori_pekerjaan, :jenis_pengadaan, :metode_pemilihan,
            :tipe_pengadaan, :pagu_anggaran, :hps, :nilai_kontrak, :nomor_kontrak, :tanggal_kontrak,
            :tanggal_mulai, :tanggal_selesai, :pelaksana_nama, :pelaksana_bank, :pelaksana_rekening, :pelaksana_npwp,
            :kecamatan, :desa, :lokasi_lengkap, :latitude, :longitude, :tags_json, :is_public_highlight,
            :status_tahap_pra_kontrak, :progres_rencana, :progres_realisasi, :deviasi_fisik, :status_deviasi, :kurva_s_json,
            :total_pencairan, :persen_keuangan, :sisa_anggaran, :termin_json, :spj_status, :spj_checklist_json,
            :tahapan_pencairan_json, :logs_json
        ) ON DUPLICATE KEY UPDATE
            tahun_anggaran = VALUES(tahun_anggaran),
            no_urut_kategori = VALUES(no_urut_kategori),
            kategori_paket = VALUES(kategori_paket),
            kategori_paket_id = VALUES(kategori_paket_id),
            bidang_id = VALUES(bidang_id),
            sub_bagian = VALUES(sub_bagian),
            sub_kegiatan = VALUES(sub_kegiatan),
            nama_paket = VALUES(nama_paket),
            kategori_pekerjaan = VALUES(kategori_pekerjaan),
            jenis_pengadaan = VALUES(jenis_pengadaan),
            metode_pemilihan = VALUES(metode_pemilihan),
            tipe_pengadaan = VALUES(tipe_pengadaan),
            pagu_anggaran = VALUES(pagu_anggaran),
            hps = VALUES(hps),
            nilai_kontrak = VALUES(nilai_kontrak),
            nomor_kontrak = VALUES(nomor_kontrak),
            tanggal_kontrak = VALUES(tanggal_kontrak),
            tanggal_mulai = VALUES(tanggal_mulai),
            tanggal_selesai = VALUES(tanggal_selesai),
            pelaksana_nama = VALUES(pelaksana_nama),
            pelaksana_bank = VALUES(pelaksana_bank),
            pelaksana_rekening = VALUES(pelaksana_rekening),
            pelaksana_npwp = VALUES(pelaksana_npwp),
            kecamatan = VALUES(kecamatan),
            desa = VALUES(desa),
            lokasi_lengkap = VALUES(lokasi_lengkap),
            latitude = VALUES(latitude),
            longitude = VALUES(longitude),
            tags_json = VALUES(tags_json),
            is_public_highlight = VALUES(is_public_highlight),
            status_tahap_pra_kontrak = VALUES(status_tahap_pra_kontrak),
            progres_rencana = VALUES(progres_rencana),
            progres_realisasi = VALUES(progres_realisasi),
            deviasi_fisik = VALUES(deviasi_fisik),
            status_deviasi = VALUES(status_deviasi),
            kurva_s_json = VALUES(kurva_s_json),
            total_pencairan = VALUES(total_pencairan),
            persen_keuangan = VALUES(persen_keuangan),
            sisa_anggaran = VALUES(sisa_anggaran),
            termin_json = VALUES(termin_json),
            spj_status = VALUES(spj_status),
            spj_checklist_json = VALUES(spj_checklist_json),
            tahapan_pencairan_json = VALUES(tahapan_pencairan_json),
            logs_json = VALUES(logs_json)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $p['id'],
            ':tahun_anggaran' => (int)($p['tahunAnggaran'] ?? 2026),
            ':no_urut_kategori' => (int)($p['noUrutKategori'] ?? 0),
            ':kategori_paket' => $p['kategoriPaket'] ?? null,
            ':kategori_paket_id' => $p['kategoriPaketId'] ?? null,
            ':bidang_id' => $p['bidangId'],
            ':sub_bagian' => $p['subBagian'] ?? null,
            ':sub_kegiatan' => $p['subKegiatan'] ?? null,
            ':nama_paket' => $p['namaPaket'],
            ':kategori_pekerjaan' => $p['kategoriPekerjaan'] ?? 'Fisik',
            ':jenis_pengadaan' => $p['jenisPengadaan'] ?? null,
            ':metode_pemilihan' => $p['metodePemilihan'] ?? null,
            ':tipe_pengadaan' => $p['tipePengadaan'] ?? 'Tender',
            ':pagu_anggaran' => (float)($p['paguAnggaran'] ?? 0),
            ':hps' => (float)($p['hps'] ?? 0),
            ':nilai_kontrak' => (float)($k['nilaiKontrak'] ?? 0),
            ':nomor_kontrak' => $k['nomorKontrak'] ?? null,
            ':tanggal_kontrak' => $k['tanggalKontrak'] ?? null,
            ':tanggal_mulai' => $k['tanggalMulai'] ?? null,
            ':tanggal_selesai' => $k['tanggalSelesai'] ?? null,
            ':pelaksana_nama' => $k['namaPenyedia'] ?? null,
            ':pelaksana_bank' => $k['bankRekanan'] ?? null,
            ':pelaksana_rekening' => $k['rekeningRekanan'] ?? null,
            ':pelaksana_npwp' => $k['npwpRekanan'] ?? null,
            ':kecamatan' => $p['kecamatan'] ?? null,
            ':desa' => $p['desa'] ?? null,
            ':lokasi_lengkap' => $p['lokasiLengkap'] ?? null,
            ':latitude' => isset($p['latitude']) ? (string)$p['latitude'] : null,
            ':longitude' => isset($p['longitude']) ? (string)$p['longitude'] : null,
            ':tags_json' => !empty($p['tags']) ? json_encode($p['tags'], JSON_UNESCAPED_UNICODE) : null,
            ':is_public_highlight' => !empty($p['isPublicHighlight']) ? 1 : 0,
            ':status_tahap_pra_kontrak' => $p['statusTahapPraKontrak'] ?? 'rup',
            ':progres_rencana' => (float)($f['progresRencana'] ?? 0),
            ':progres_realisasi' => (float)($f['progresRealisasi'] ?? 0),
            ':deviasi_fisik' => (float)($f['deviasiFisik'] ?? 0),
            ':status_deviasi' => $f['statusDeviasi'] ?? 'Aman',
            ':kurva_s_json' => !empty($f['mingguan']) ? json_encode($f['mingguan'], JSON_UNESCAPED_UNICODE) : null,
            ':total_pencairan' => (float)($q['totalPencairan'] ?? 0),
            ':persen_keuangan' => (float)($q['persenKeuangan'] ?? 0),
            ':sisa_anggaran' => (float)($q['sisaAnggaran'] ?? 0),
            ':termin_json' => !empty($q['terminHistory']) ? json_encode($q['terminHistory'], JSON_UNESCAPED_UNICODE) : null,
            ':spj_status' => $p['spjStatus'] ?? 'belum_masuk',
            ':spj_checklist_json' => !empty($p['administrasiSPJ']) ? json_encode($p['administrasiSPJ'], JSON_UNESCAPED_UNICODE) : null,
            ':tahapan_pencairan_json' => !empty($tp) ? json_encode($tp, JSON_UNESCAPED_UNICODE) : null,
            ':logs_json' => !empty($p['logs']) ? json_encode($p['logs'], JSON_UNESCAPED_UNICODE) : null,
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Paket pekerjaan berhasil disimpan ke database']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// 4.6 HAPUS PAKET PEKERJAAN (DELETE)
if ($action === 'delete_paket_pekerjaan') {
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID paket pekerjaan diperlukan']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM monitoring_paket WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['status' => 'success', 'message' => 'Paket pekerjaan berhasil dihapus dari database']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// 5. SIMPAN PENGATURAN SISTEM & PIMPINAN DINAS
if ($action === 'save_settings' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data pengaturan tidak valid']);
        exit;
    }

    try {
        $params = [
            ':nama_sistem' => $input['namaSistem'] ?? 'SIMON - SATU PUTARU',
            ':sub_nama' => $input['subNama'] ?? 'Sistem Informasi Monitoring Progres Pekerjaan DINPUTARU',
            ':instansi' => $input['instansi'] ?? 'Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak',
            ':pemerintah_daerah' => $input['pemerintahDaerah'] ?? 'Pemerintah Kabupaten Demak',
            ':alamat' => $input['alamat'] ?? '',
            ':telepon' => $input['telepon'] ?? '',
            ':email' => $input['email'] ?? '',
            ':website' => $input['website'] ?? '',
            ':logo_url' => $input['logoUrl'] ?? '',
            ':nama_kepala_dinas' => $input['namaKepalaDinas'] ?? '',
            ':nip_kepala_dinas' => $input['nipKepalaDinas'] ?? '',
            ':pangkat_kepala_dinas' => $input['pangkatKepalaDinas'] ?? '',
            ':jabatan_kepala_dinas' => $input['jabatanKepalaDinas'] ?? '',
            ':nama_sekretaris' => $input['namaSekretaris'] ?? '',
            ':nip_sekretaris' => $input['nipSekretaris'] ?? '',
            ':pangkat_sekretaris' => $input['pangkatSekretaris'] ?? '',
            ':jabatan_sekretaris' => $input['jabatanSekretaris'] ?? '',
            ':max_public_highlights' => (int)($input['maxPublicHighlights'] ?? 12)
        ];

        try {
            $sql = "UPDATE system_settings SET
                nama_sistem = :nama_sistem,
                sub_nama = :sub_nama,
                instansi = :instansi,
                pemerintah_daerah = :pemerintah_daerah,
                alamat = :alamat,
                telepon = :telepon,
                email = :email,
                website = :website,
                logo_url = :logo_url,
                nama_kepala_dinas = :nama_kepala_dinas,
                nip_kepala_dinas = :nip_kepala_dinas,
                pangkat_kepala_dinas = :pangkat_kepala_dinas,
                jabatan_kepala_dinas = :jabatan_kepala_dinas,
                nama_sekretaris = :nama_sekretaris,
                nip_sekretaris = :nip_sekretaris,
                pangkat_sekretaris = :pangkat_sekretaris,
                jabatan_sekretaris = :jabatan_sekretaris,
                max_public_highlights = :max_public_highlights,
                custom_texts_json = :custom_texts_json,
                bidang_descriptions_json = :bidang_descriptions_json,
                show_galeri_slideshow = :show_galeri_slideshow,
                show_slideshow_unggulan = :show_slideshow_unggulan,
                show_peta_koordinat = :show_peta_koordinat,
                show_kurva_s = :show_kurva_s,
                slideshow_unggulan_json = :slideshow_unggulan_json,
                galeri_json = :galeri_json
                WHERE id = 1";

            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_merge($params, [
                ':custom_texts_json' => !empty($input['customTexts']) ? json_encode($input['customTexts']) : null,
                ':bidang_descriptions_json' => !empty($input['bidangDescriptions']) ? json_encode($input['bidangDescriptions']) : null,
                ':show_galeri_slideshow' => !empty($input['showGaleriSlideshow']) ? 1 : 0,
                ':show_slideshow_unggulan' => isset($input['showSlideshowUnggulan']) && !$input['showSlideshowUnggulan'] ? 0 : 1,
                ':show_peta_koordinat' => !empty($input['showPetaKoordinat']) ? 1 : 0,
                ':show_kurva_s' => !empty($input['showKurvaS']) ? 1 : 0,
                ':slideshow_unggulan_json' => !empty($input['slideshowUnggulan']) ? json_encode($input['slideshowUnggulan']) : null,
                ':galeri_json' => !empty($input['galeri']) ? json_encode($input['galeri']) : null
            ]));
        } catch (Exception $colEx) {
            // Fallback jika ada kolom yang belum ada
            $sql = "UPDATE system_settings SET
                nama_sistem = :nama_sistem,
                instansi = :instansi,
                pemerintah_daerah = :pemerintah_daerah,
                alamat = :alamat,
                telepon = :telepon,
                email = :email,
                website = :website,
                nama_kepala_dinas = :nama_kepala_dinas,
                nip_kepala_dinas = :nip_kepala_dinas,
                pangkat_kepala_dinas = :pangkat_kepala_dinas,
                jabatan_kepala_dinas = :jabatan_kepala_dinas,
                nama_sekretaris = :nama_sekretaris,
                nip_sekretaris = :nip_sekretaris,
                pangkat_sekretaris = :pangkat_sekretaris,
                jabatan_sekretaris = :jabatan_sekretaris,
                max_public_highlights = :max_public_highlights
                WHERE id = 1";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        echo json_encode(['status' => 'success', 'message' => 'Pengaturan sistem & pimpinan dinas tersimpan']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// 6. SIMPAN PENGGUNA (SAVE USER)
if ($action === 'save_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $u = json_decode(file_get_contents('php://input'), true);
    if (!$u || empty($u['id']) || empty($u['nama'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data pengguna tidak lengkap']);
        exit;
    }

    try {
        $sql = "INSERT INTO users (id, username, password, nama, nip, jabatan, role, bidang_id, email, avatar)
            VALUES (:id, :username, :password, :nama, :nip, :jabatan, :role, :bidang_id, :email, :avatar)
            ON DUPLICATE KEY UPDATE
            username = VALUES(username),
            password = IF(VALUES(password) != '', VALUES(password), password),
            nama = VALUES(nama),
            nip = VALUES(nip),
            jabatan = VALUES(jabatan),
            role = VALUES(role),
            bidang_id = VALUES(bidang_id),
            email = VALUES(email),
            avatar = VALUES(avatar)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $u['id'],
            ':username' => $u['username'] ?? (!empty($u['email']) ? explode('@', $u['email'])[0] : 'user_' . substr(time(), -4)),
            ':password' => $u['password'] ?? 'pupr2025',
            ':nama' => $u['nama'],
            ':nip' => $u['nip'] ?? '',
            ':jabatan' => $u['jabatan'] ?? '',
            ':role' => $u['role'] ?? 'koordinator',
            ':bidang_id' => !empty($u['bidangId']) ? $u['bidangId'] : null,
            ':email' => $u['email'] ?? '',
            ':avatar' => $u['avatar'] ?? null
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Data pengguna berhasil disimpan ke database']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// 7. HAPUS PENGGUNA (DELETE USER)
if ($action === 'delete_user') {
    $id = $_GET['id'] ?? '';
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID pengguna diperlukan']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['status' => 'success', 'message' => 'Pengguna berhasil dihapus dari database']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Endpoint tidak ditemukan']);
