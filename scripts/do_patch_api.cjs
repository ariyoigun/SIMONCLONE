const fs = require('fs');

let s = fs.readFileSync('public/api/api.php', 'utf8');

const codeToAdd = `        // Ambil Paket Pekerjaan jika tabel monitoring_paket ada
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
        } catch (Exception $e) {}\n\n`;

const targetIndex = s.indexOf("echo json_encode([");
if (targetIndex !== -1) {
    s = s.substring(0, targetIndex) + codeToAdd + s.substring(targetIndex);
    s = s.replace("'projects' => $projects,", "'projects' => $projects,\n                'paketPekerjaanList' => $paketPekerjaanList,");
    fs.writeFileSync('public/api/api.php', s, 'utf8');
    console.log('SUCCESS: public/api/api.php updated with monitoring_paket load');
} else {
    console.log('ERROR: targetIndex not found');
}

