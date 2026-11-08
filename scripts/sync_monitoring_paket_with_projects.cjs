const fs = require('fs');
const path = require('path');
const { REAL_PROJECTS_2026 } = require('../src/data/realProjects2026.js');
const { MONITORING_PAKET_2026 } = require('../src/data/monitoringPaket2026.js');

function clean(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[,\.\-\_\(\)\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCoreName(s) {
  const parts = s.split(/[-–—:]/);
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1].trim();
    if (lastPart.length >= 10) return lastPart;
  }
  return s;
}

function findMatchInProjects(mp) {
  const cMp = clean(mp.namaPaket);
  // 1. Exact clean match
  let p = REAL_PROJECTS_2026.find(x => clean(x.namaPaket) === cMp);
  if (p) return p;

  // 2. Core name match
  const coreMp = clean(extractCoreName(mp.namaPaket));
  p = REAL_PROJECTS_2026.find(x => {
    const cP = clean(x.namaPaket);
    const coreP = clean(extractCoreName(x.namaPaket));
    return cP === coreMp || coreP === coreMp;
  });
  if (p) return p;

  // 3. Substring match (min 15 chars, and same bidang if possible)
  if (cMp.length >= 15) {
    p = REAL_PROJECTS_2026.find(x => {
      const cP = clean(x.namaPaket);
      return (cP.includes(cMp) || cMp.includes(cP)) && (x.bidangId === mp.bidangId || mp.bidangId === 'sekretariat');
    });
    if (p) return p;
  }

  return null;
}

let syncCount = 0;
let contractCount = 0;
let fisikCount = 0;

const updatedList = MONITORING_PAKET_2026.map(mp => {
  const matched = findMatchInProjects(mp);
  if (!matched) {
    return mp;
  }

  syncCount++;
  const pK = matched.dataKontrak || {};
  const pF = matched.dataFisik || {};
  const pQ = matched.dataKeuangan || {};
  const pSpj = matched.administrasiSPJ || {};

  const kNilai = parseFloat(pK.nilaiKontrak) > 0 ? parseFloat(pK.nilaiKontrak) : (parseFloat(matched.nilaiKontrak) || 0);
  const kNo = pK.nomorKontrak || matched.nomorKontrak || '';
  const kDate = pK.tanggalKontrak || matched.tanggalKontrak || '';
  const kPenyedia = (pK.namaPenyedia && pK.namaPenyedia !== '-') ? pK.namaPenyedia : (matched.pelaksana_nama || '-');
  const kMulai = pK.tanggalMulai || matched.tanggalMulai || '';
  const kSelesai = pK.tanggalSelesai || matched.tanggalSelesai || '';
  const kBank = pK.bankRekanan || matched.pelaksana_bank || 'Bank Jateng';
  const kRek = pK.rekeningRekanan || matched.pelaksana_rekening || '';
  const kNpwp = pK.npwpRekanan || matched.pelaksana_npwp || '';

  const isKontrak = Boolean(kNilai > 0 || kNo || kDate || matched.isKontrak || (kPenyedia && kPenyedia !== '-'));
  if (isKontrak) contractCount++;

  const fRencana = parseFloat(pF.progresRencana) || parseFloat(matched.progres_rencana) || 0;
  const fRealisasi = parseFloat(pF.progresRealisasi) || parseFloat(matched.progres_realisasi) || 0;
  if (fRealisasi > 0) fisikCount++;
  const fDeviasi = parseFloat(pF.deviasiFisik) || parseFloat((fRealisasi - fRencana).toFixed(2));
  const fStatus = pF.statusDeviasi || (fDeviasi < -10 ? 'Kritis' : (fDeviasi < 0 ? 'Terlambat' : 'Aman'));

  const qCair = parseFloat(pQ.totalPencairan) || parseFloat(matched.total_pencairan) || 0;
  const baseVal = kNilai > 0 ? kNilai : (parseFloat(mp.paguAnggaran) || 1);
  const qPersen = parseFloat(pQ.persenKeuangan) || (kNilai > 0 ? parseFloat(((qCair / kNilai) * 100).toFixed(2)) : 0);
  const qSisa = Math.max(0, baseVal - qCair);

  let spjStatus = matched.spjStatus || pSpj.status || 'belum_masuk';
  if (spjStatus === 'sp2d_terbit' || spjStatus === 'belum_diajukan' || !spjStatus) {
    if (qCair > 0 && qCair >= baseVal) spjStatus = 'sudah_sp2d';
    else if (qCair > 0) spjStatus = 'sudah_masuk';
    else spjStatus = 'belum_masuk';
  }

  const logs = Array.isArray(matched.logs) && matched.logs.length > 0 ? matched.logs : [
    {
      id: `log_sync_${mp.id}`,
      timestamp: '2026-10-31 16:00:00',
      userName: 'Sistem Terpadu SIMON',
      userRole: 'System',
      action: 'Sinkronisasi Master Pekerjaan',
      keterangan: `Data disinkronkan dengan Master Data Pekerjaan (Nilai Kontrak: Rp ${Math.round(kNilai).toLocaleString('id-ID')}, Realisasi Fisik: ${fRealisasi}%).`
    }
  ];

  return {
    ...mp,
    isKontrak,
    statusTahapPraKontrak: isKontrak ? 'kontrak' : (matched.statusTahapPraKontrak || mp.statusTahapPraKontrak || 'rup'),
    dataKontrak: {
      nomorKontrak: kNo,
      tanggalKontrak: kDate,
      tanggalMulai: kMulai,
      tanggalSelesai: kSelesai,
      nilaiKontrak: kNilai,
      namaPenyedia: kPenyedia,
      bankRekanan: kBank,
      rekeningRekanan: kRek,
      npwpRekanan: kNpwp
    },
    dataFisik: {
      progresRencana: fRencana,
      progresRealisasi: fRealisasi,
      deviasiFisik: fDeviasi,
      statusDeviasi: fStatus,
      mingguan: pF.mingguan || []
    },
    dataKeuangan: {
      totalPencairan: qCair,
      persenKeuangan: qPersen,
      sisaAnggaran: qSisa,
      terminHistory: pQ.terminHistory || []
    },
    spjStatus,
    administrasiSPJ: {
      status: spjStatus,
      tanggalMasuk: pSpj.tanggalMasuk || (spjStatus !== 'belum_masuk' ? (kDate || '2026-10-15') : ''),
      tanggalKoreksi: pSpj.tanggalKoreksi || '',
      tanggalSPM: pSpj.tanggalSPM || (spjStatus === 'sudah_sp2d' ? '2026-10-25' : ''),
      nomorSPM: pSpj.nomorSPM || (spjStatus === 'sudah_sp2d' ? (kNo ? `900/SPM/${kNo}` : '900/SPM/DPU/2026') : ''),
      catatanVerifikator: pSpj.catatanVerifikator || (spjStatus === 'sudah_sp2d' ? 'Berkas SPJ lengkap & SP2D lunas 100%' : (spjStatus === 'sudah_masuk' ? 'Berkas SPJ termin masuk, proses verifikasi SP2D' : 'Belum mengajukan berkas SPJ')),
      petugasVerifikator: pSpj.petugasVerifikator || (spjStatus !== 'belum_masuk' ? 'Tim Verifikasi SPJ Keuangan' : '')
    },
    tahapanPencairan: matched.tahapanPencairan || {
      berkasBelumMasuk: !isKontrak && qCair === 0,
      berkasMasuk: qCair > 0 || fRealisasi > 0,
      koreksi: false,
      berkasRevisiMasuk: false,
      spm: qCair > 0,
      selesai: fRealisasi >= 100 && qCair >= baseVal,
      catatanPencairan: qCair > 0 ? 'Pencairan SP2D sedang/telah berjalan' : 'Belum ada pencairan SP2D'
    },
    logs
  };
});

console.log(`Matched and synchronized: ${syncCount} / ${MONITORING_PAKET_2026.length} packages`);
console.log(`Packages with contract: ${contractCount}`);
console.log(`Packages with physical progress > 0: ${fisikCount}`);

const fileContent = `/**
 * ==============================================================================
 * MASTER DATA PAKET PEKERJAAN TA 2026 (478 PAKET DINPUTARU DEMAK)
 * Sumber: Monitoring Paket 2026.xlsx & Sinkronisasi Realisasi Master Pekerjaan
 * Kategori:
 * 1. Pekerjaan Konstruksi (Fisik)   : 284 Paket
 * 2. Jasa Konsultansi (Jakon)       : 135 Paket
 * 3. Pengadaan Barang               : 53 Paket
 * 4. Jasa Lainnya                   : 6 Paket
 * Total: 478 Paket Terverifikasi DINPUTARU Kabupaten Demak
 * ==============================================================================
 */

export const MONITORING_PAKET_2026 = ${JSON.stringify(updatedList, null, 2)};
`;

fs.writeFileSync(path.resolve('./src/data/monitoringPaket2026.js'), fileContent, 'utf8');
console.log('Successfully written to src/data/monitoringPaket2026.js');
