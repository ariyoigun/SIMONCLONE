<?php
/**
 * ==============================================================================
 * BACKEND REST API BRIDGE: SIMON - SATUPUTARU
 * Endpoint Terpadu untuk Sinkronisasi Data MySQL Hostinger
 * ==============================================================================
 */

require_once __DIR__ . '/config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

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
        . " * Konfigurasi Database Lokal Hostinger SIMON - SATUPUTARU\n"
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
        $settings = $stmtSettings->fetch();
        if ($settings) {
            if (!empty($settings['galeri_json'])) {
                $settings['galeri'] = json_decode($settings['galeri_json'], true);
            }
            if (!empty($settings['custom_texts_json'])) {
                $settings['customTexts'] = json_decode($settings['custom_texts_json'], true);
            }
            if (!empty($settings['bidang_descriptions_json'])) {
                $settings['bidangDescriptions'] = json_decode($settings['bidang_descriptions_json'], true);
            }
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
                'paguAnggaran' => (float)$p['pagu_anggaran'],
                'hps' => (float)$p['hps'],
                'kecamatan' => $p['kecamatan'],
                'desa' => $p['desa'],
                'lokasiLengkap' => $p['lokasi_lengkap'],
                'latitude' => $p['latitude'],
                'longitude' => $p['longitude'],
                'tags' => !empty($p['tags_json']) ? json_decode($p['tags_json'], true) : [],
                'isPublicHighlight' => (bool)$p['is_public_highlight'],
                'dataKontrak' => [
                    'nomorKontrak' => $p['nomor_kontrak'],
                    'tanggalKontrak' => $p['tanggal_kontrak'],
                    'tanggalMulai' => $p['tanggal_mulai'],
                    'tanggalSelesai' => $p['tanggal_selesai'],
                    'nilaiKontrak' => (float)$p['nilai_kontrak'],
                    'namaPenyedia' => $p['pelaksana_nama'],
                    'bankRekanan' => $p['pelaksana_bank'],
                    'rekeningRekanan' => $p['pelaksana_rekening'],
                    'npwpRekanan' => $p['pelaksana_npwp']
                ],
                'statusTahapPraKontrak' => $p['status_tahap_pra_kontrak'],
                'dataPraKontrak' => !empty($p['pra_kontrak_json']) ? json_decode($p['pra_kontrak_json'], true) : null,
                'dataFisik' => [
                    'progresRencana' => (float)$p['progres_rencana'],
                    'progresRealisasi' => (float)$p['progres_realisasi'],
                    'deviasiFisik' => (float)$p['deviasi_fisik'],
                    'statusDeviasi' => $p['status_deviasi'],
                    'mingguan' => !empty($p['kurva_s_json']) ? json_decode($p['kurva_s_json'], true) : []
                ],
                'dataKeuangan' => [
                    'totalPencairan' => (float)$p['total_pencairan'],
                    'persenKeuangan' => (float)$p['persen_keuangan'],
                    'sisaAnggaran' => (float)$p['sisa_anggaran'],
                    'terminHistory' => !empty($p['termin_json']) ? json_decode($p['termin_json'], true) : []
                ],
                'spjStatus' => $p['spj_status'],
                'dataSpj' => !empty($p['spj_checklist_json']) ? json_decode($p['spj_checklist_json'], true) : null,
            ];
        }, $projectsRaw);

        echo json_encode([
            'status' => 'success',
            'data' => [
                'systemSettings' => $settings,
                'users' => $users,
                'tags' => $tags,
                'projects' => $projects,
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
            progres_rencana, progres_realisasi, deviasi_fisik, status_deviasi, kurva_s_json,
            total_pencairan, persen_keuangan, sisa_anggaran, termin_json, spj_status, spj_checklist_json
        ) VALUES (
            :id, :tahun_anggaran, :bidang_id, :sub_bagian, :sub_kegiatan_id, :kode_sub_kegiatan, :nama_paket, :kategori_pekerjaan, :jenis_anggaran, :sumber_dana,
            :kode_rup, :tipe_pengadaan, :pagu_anggaran, :hps, :nilai_kontrak, :nomor_kontrak,
            :tanggal_kontrak, :tanggal_mulai, :tanggal_selesai, :pelaksana_nama, :pelaksana_bank,
            :pelaksana_rekening, :pelaksana_npwp, :kecamatan, :desa, :lokasi_lengkap, :latitude,
            :longitude, :tags_json, :is_public_highlight, :status_tahap_pra_kontrak, :pra_kontrak_json,
            :progres_rencana, :progres_realisasi, :deviasi_fisik, :status_deviasi, :kurva_s_json,
            :total_pencairan, :persen_keuangan, :sisa_anggaran, :termin_json, :spj_status, :spj_checklist_json
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
            total_pencairan = VALUES(total_pencairan),
            persen_keuangan = VALUES(persen_keuangan),
            sisa_anggaran = VALUES(sisa_anggaran),
            termin_json = VALUES(termin_json),
            spj_status = VALUES(spj_status),
            spj_checklist_json = VALUES(spj_checklist_json)";

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
            ':total_pencairan' => (float)($q['totalPencairan'] ?? 0),
            ':persen_keuangan' => (float)($q['persenKeuangan'] ?? 0),
            ':sisa_anggaran' => (float)($q['sisaAnggaran'] ?? 0),
            ':termin_json' => json_encode($q['terminHistory'] ?? []),
            ':spj_status' => $p['spjStatus'] ?? 'belum_diajukan',
            ':spj_checklist_json' => json_encode($p['dataSpj'] ?? [])
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
            ':nama_sistem' => $input['namaSistem'] ?? 'SIMON - SATUPUTARU',
            ':instansi' => $input['instansi'] ?? 'Dinas Pekerjaan Umum dan Penataan Ruang',
            ':pemerintah_daerah' => $input['pemerintahDaerah'] ?? 'Pemerintah Kabupaten Demak',
            ':alamat' => $input['alamat'] ?? '',
            ':telepon' => $input['telepon'] ?? '',
            ':email' => $input['email'] ?? '',
            ':website' => $input['website'] ?? '',
            ':nama_kepala_dinas' => $input['namaKepalaDinas'] ?? '',
            ':nip_kepala_dinas' => $input['nipKepalaDinas'] ?? '',
            ':pangkat_kepala_dinas' => $input['pangkatKepalaDinas'] ?? '',
            ':jabatan_kepala_dinas' => $input['jabatanKepalaDinas'] ?? '',
            ':nama_sekretaris' => $input['namaSekretaris'] ?? '',
            ':nip_sekretaris' => $input['nipSekretaris'] ?? '',
            ':pangkat_sekretaris' => $input['pangkatSekretaris'] ?? '',
            ':jabatan_sekretaris' => $input['jabatanSekretaris'] ?? '',
            ':max_public_highlights' => (int)($input['maxPublicHighlights'] ?? 10)
        ];

        try {
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
                max_public_highlights = :max_public_highlights,
                custom_texts_json = :custom_texts_json,
                bidang_descriptions_json = :bidang_descriptions_json
                WHERE id = 1";

            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_merge($params, [
                ':custom_texts_json' => !empty($input['customTexts']) ? json_encode($input['customTexts']) : null,
                ':bidang_descriptions_json' => !empty($input['bidangDescriptions']) ? json_encode($input['bidangDescriptions']) : null
            ]));
        } catch (Exception $colEx) {
            // Fallback jika kolom json belum ditambahkan ke tabel
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
