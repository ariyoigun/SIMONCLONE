import fs from 'fs';
import path from 'path';

const apiPath = path.resolve('public/api/api.php');
let apiContent = fs.readFileSync(apiPath, 'utf8');

// 1. Update load_all to fetch SIPD and Years, and map subKegiatanId & kodeSubKegiatan
const oldLoadAllTarget = `        // Ambil Projects
        $stmtProjects = $pdo->query("SELECT * FROM projects ORDER BY tahun_anggaran DESC, id ASC");
        $projectsRaw = $stmtProjects->fetchAll();

        $projects = array_map(function($p) {
            return [
                'id' => $p['id'],
                'tahunAnggaran' => (int)$p['tahun_anggaran'],
                'bidangId' => $p['bidang_id'],
                'subBagian' => $p['sub_bagian'],
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
                'projects' => $projects
            ]
        ]);`;

const newLoadAllCode = `        // Ambil SIPD Programs jika ada
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
        ]);`;

// Normalize line endings for replacement
const normalizeLF = (s) => s.replace(/\r\n/g, '\n');
const toCRLF = (s) => s.replace(/\n/g, '\r\n');

if (normalizeLF(apiContent).includes(normalizeLF(oldLoadAllTarget))) {
  apiContent = toCRLF(normalizeLF(apiContent).replace(normalizeLF(oldLoadAllTarget), normalizeLF(newLoadAllCode)));
  console.log('load_all replaced successfully in api.php');
} else {
  console.log('WARNING: oldLoadAllTarget not matched in api.php');
}

// 2. Update save_project to include sub_kegiatan_id, kode_sub_kegiatan, kategori_pekerjaan
const oldSaveSql = `        $sql = "INSERT INTO projects (
            id, tahun_anggaran, bidang_id, sub_bagian, nama_paket, jenis_anggaran, sumber_dana,
            kode_rup, tipe_pengadaan, pagu_anggaran, hps, nilai_kontrak, nomor_kontrak,
            tanggal_kontrak, tanggal_mulai, tanggal_selesai, pelaksana_nama, pelaksana_bank,
            pelaksana_rekening, pelaksana_npwp, kecamatan, desa, lokasi_lengkap, latitude,
            longitude, tags_json, is_public_highlight, status_tahap_pra_kontrak, pra_kontrak_json,
            progres_rencana, progres_realisasi, deviasi_fisik, status_deviasi, kurva_s_json,
            total_pencairan, persen_keuangan, sisa_anggaran, termin_json, spj_status, spj_checklist_json
        ) VALUES (
            :id, :tahun_anggaran, :bidang_id, :sub_bagian, :nama_paket, :jenis_anggaran, :sumber_dana,
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
            nama_paket = VALUES(nama_paket),
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
            ':nama_paket' => $p['namaPaket'] ?? '',
            ':jenis_anggaran' => $p['jenisAnggaran'] ?? 'Murni',
            ':sumber_dana' => $p['sumberDana'] ?? 'APBD Murni (DAU)',
            ':kode_rup' => $p['kodeRup'] ?? '',
            ':tipe_pengadaan' => $p['tipePengadaan'] ?? 'Tender / Seleksi Umum',`;

const newSaveSql = `        $katPekerjaan = $p['kategoriPekerjaan'] ?? (($p['tipePengadaan'] ?? '') === 'Swakelola' ? 'Swakelola' : ((($p['tipePengadaan'] ?? '') === 'e-Purchasing') ? 'Barang' : 'Fisik'));

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
            ':tipe_pengadaan' => $p['tipePengadaan'] ?? 'Tender / Seleksi Umum',`;

if (normalizeLF(apiContent).includes(normalizeLF(oldSaveSql))) {
  apiContent = toCRLF(normalizeLF(apiContent).replace(normalizeLF(oldSaveSql), normalizeLF(newSaveSql)));
  console.log('save_project replaced successfully in api.php');
} else {
  console.log('WARNING: oldSaveSql not matched in api.php');
}

fs.writeFileSync(apiPath, apiContent, 'utf8');
console.log('public/api/api.php saved!');
