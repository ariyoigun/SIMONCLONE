const fs = require('fs');
const path = require('path');

const apiPath = path.resolve('./public/api/api.php');
let content = fs.readFileSync(apiPath, 'utf8');

// 1. In load_all, add loading of monitoring_paket table
const loadAllMarker = `        echo json_encode([
            'status' => 'success',
            'data' => [
                'systemSettings' => $settings,
                'users' => $users,
                'tags' => $tags,
                'projects' => $projects,`;

const paketLoadCode = `        // Ambil Paket Pekerjaan jika tabel monitoring_paket ada
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
                        'mingguan' => !empty($p['kurva_s_json']) ? json_decode($p['kurva_s_json'], true) : []
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
                'paketPekerjaanList' => $paketPekerjaanList,`;

if (content.includes(loadAllMarker)) {
  content = content.replace(loadAllMarker, paketLoadCode);
  console.log('Successfully updated load_all with paketPekerjaanList');
} else {
  console.log('Marker loadAllMarker not found');
}

// 2. Add save_paket_pekerjaan and delete_paket_pekerjaan endpoints before save_settings
const beforeSettingsMarker = `// 5. SIMPAN PENGATURAN SISTEM & PIMPINAN DINAS`;
const paketEndpointsCode = `// 4.5 SIMPAN / UPDATE MASTER PAKET PEKERJAAN (POST JSON)
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

// 5. SIMPAN PENGATURAN SISTEM & PIMPINAN DINAS`;

if (content.includes(beforeSettingsMarker)) {
  content = content.replace(beforeSettingsMarker, paketEndpointsCode);
  console.log('Successfully added save_paket_pekerjaan & delete_paket_pekerjaan endpoints');
} else {
  console.log('Marker beforeSettingsMarker not found');
}

fs.writeFileSync(apiPath, content, 'utf8');
console.log('Finished updating api.php');
