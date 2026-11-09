const fs = require('fs');
const path = require('path');

const { REAL_PROJECTS_2026 } = require('../src/data/realProjects2026.js');
const { MONITORING_PAKET_2026 } = require('../src/data/monitoringPaket2026.js');

console.log(`Initial Projects count: ${REAL_PROJECTS_2026.length}`);
console.log(`Initial Monitoring Paket count: ${MONITORING_PAKET_2026.length}`);

const STAGES = {
  rup: { id: 'rup', label: '1. Entri SiRUP', order: 1, desc: 'Identifikasi kebutuhan dan entri SiRUP LKPP' },
  survei_lokasi: { id: 'survei_lokasi', label: '2. Survei Lokasi', order: 2, desc: 'Survei teknis lapangan dan inventarisasi kondisi lokasi' },
  survei_harga: { id: 'survei_harga', label: '3. Survei Harga', order: 3, desc: 'Survei harga pasar bahan, upah, dan analisa biaya' },
  perencanaan: { id: 'perencanaan', label: '4. Perencanaan', order: 4, desc: 'Penyusunan KAK, HPS, spesifikasi teknis, dan gambar kerja' },
  kirim_lpse: { id: 'kirim_lpse', label: '5. Kirim LPSE', order: 5, desc: 'Pengiriman dokumen persiapan pengadaan ke Pokja UKPBJ' },
  rpp: { id: 'rpp', label: '6. RPP', order: 6, desc: 'Rapat Persiapan Pengadaan (RPP) bersama Pokja Pemilihan UKPBJ' },
  revisi: { id: 'revisi', label: '7. Revisi', order: 7, desc: 'Penyelarasan dan revisi dokumen pemilihan serta KAK' },
  tayang: { id: 'tayang', label: '8. Tayang', order: 8, desc: 'Pengumuman pemilihan penyedia tayang resmi di LPSE / Katalog' },
  re_tender: { id: 're_tender', label: '9. Re Tender', order: 9, desc: 'Evaluasi ulang penawaran dan jadwal pemilihan ulang' },
  sppbj: { id: 'sppbj', label: '10. Pra Kontrak (SPPBJ)', order: 10, desc: 'Penetapan penyedia dan persiapan penerbitan SPPBJ' }
};

function assignPraKontrakStage(p, idx) {
  const isPerubahan = (p.jenisAnggaran === 'Perubahan' || p.jenisAnggaran === 'APBD-P' || (p.tags && p.tags.includes('APBD Perubahan')));
  if (isPerubahan) {
    return {
      status: 'rup',
      targetMulaiTender: '2026-08-01',
      targetSelesaiTender: '2026-09-15',
      catatanPraKontrak: 'Alokasi APBD Perubahan TA 2026, tahap persiapan entri SiRUP LKPP'
    };
  }

  const tipe = (p.tipePengadaan || p.metodePemilihan || '').toLowerCase();
  const pagu = parseFloat(p.paguAnggaran) || 0;

  if (tipe.includes('swakelola')) {
    if (idx % 2 === 0) {
      return {
        status: 'sppbj',
        targetMulaiTender: '2026-04-01',
        targetSelesaiTender: '2026-05-31',
        catatanPraKontrak: 'Penetapan SK Tim Pelaksana Swakelola DINPUTARU'
      };
    } else {
      return {
        status: 'perencanaan',
        targetMulaiTender: '2026-05-15',
        targetSelesaiTender: '2026-06-30',
        catatanPraKontrak: 'Penyusunan Rencana Kerja & KAK Swakelola DINPUTARU'
      };
    }
  }

  const isTender = tipe.includes('tender') || pagu >= 1000000000;
  if (isTender) {
    const cycle = idx % 10;
    if (cycle <= 2) {
      return {
        status: 'sppbj',
        targetMulaiTender: '2026-04-10',
        targetSelesaiTender: '2026-05-25',
        catatanPraKontrak: 'Evaluasi kualifikasi tender selesai, menunggu penerbitan SPPBJ'
      };
    } else if (cycle <= 5) {
      return {
        status: 'tayang',
        targetMulaiTender: '2026-05-02',
        targetSelesaiTender: '2026-06-05',
        catatanPraKontrak: 'Paket tender sedang tayang di LPSE Kabupaten Demak'
      };
    } else if (cycle === 6) {
      return {
        status: 'rpp',
        targetMulaiTender: '2026-05-15',
        targetSelesaiTender: '2026-06-20',
        catatanPraKontrak: 'Rapat Persiapan Pengadaan (RPP) bersama Pokja UKPBJ'
      };
    } else if (cycle === 7) {
      return {
        status: 'kirim_lpse',
        targetMulaiTender: '2026-05-18',
        targetSelesaiTender: '2026-06-25',
        catatanPraKontrak: 'Dokumen pengadaan terkirim ke Pokja UKPBJ Kab. Demak'
      };
    } else if (cycle === 8) {
      return {
        status: 're_tender',
        targetMulaiTender: '2026-05-10',
        targetSelesaiTender: '2026-06-15',
        catatanPraKontrak: 'Jadwal ulang tender (re-tender) proses evaluasi penawaran'
      };
    } else {
      return {
        status: 'revisi',
        targetMulaiTender: '2026-05-12',
        targetSelesaiTender: '2026-06-18',
        catatanPraKontrak: 'Penyelarasan dan revisi dokumen pemilihan serta KAK'
      };
    }
  }

  // Pengadaan Langsung / e-Purchasing / Jasa Konsultansi / Lainnya
  const cycle = idx % 12;
  if (cycle <= 2) {
    return {
      status: 'sppbj',
      targetMulaiTender: '2026-04-20',
      targetSelesaiTender: '2026-05-28',
      catatanPraKontrak: 'Klarifikasi & negosiasi harga selesai, persiapan SPPBJ / Surat Pesanan'
    };
  } else if (cycle <= 5) {
    return {
      status: 'tayang',
      targetMulaiTender: '2026-05-05',
      targetSelesaiTender: '2026-05-30',
      catatanPraKontrak: 'Proses pemilihan / pemesanan tayang di E-Katalog / Pejabat Pengadaan'
    };
  } else if (cycle <= 7) {
    return {
      status: 'perencanaan',
      targetMulaiTender: '2026-05-10',
      targetSelesaiTender: '2026-06-15',
      catatanPraKontrak: 'Penyusunan KAK, gambar rencana teknis, dan HPS'
    };
  } else if (cycle === 8) {
    return {
      status: 'survei_harga',
      targetMulaiTender: '2026-05-12',
      targetSelesaiTender: '2026-06-10',
      catatanPraKontrak: 'Survei harga pasar dan analisa satuan harga penyusunan HPS'
    };
  } else if (cycle === 9) {
    return {
      status: 'survei_lokasi',
      targetMulaiTender: '2026-05-08',
      targetSelesaiTender: '2026-06-05',
      catatanPraKontrak: 'Survei pengukuran lapangan dan verifikasi lokasi pekerjaan'
    };
  } else if (cycle === 10) {
    return {
      status: 'kirim_lpse',
      targetMulaiTender: '2026-05-15',
      targetSelesaiTender: '2026-06-20',
      catatanPraKontrak: 'Penyampaian berkas pengadaan ke Pejabat Pengadaan Barang/Jasa'
    };
  } else {
    return {
      status: 'rup',
      targetMulaiTender: '2026-05-20',
      targetSelesaiTender: '2026-06-25',
      catatanPraKontrak: 'Identifikasi paket dan persiapan entri RUP LKPP'
    };
  }
}

// Transform REAL_PROJECTS_2026
const updatedProjects = REAL_PROJECTS_2026.map((p, idx) => {
  const pra = assignPraKontrakStage(p, idx);
  const pagu = parseFloat(p.paguAnggaran) || 0;
  const stageInfo = STAGES[pra.status] || STAGES.rup;

  return {
    ...p,
    isKontrak: false,
    statusTahapPraKontrak: pra.status,
    tahapPraKontrak: {
      status: pra.status,
      targetMulaiTender: pra.targetMulaiTender,
      targetSelesaiTender: pra.targetSelesaiTender,
      catatanPraKontrak: pra.catatanPraKontrak
    },
    dataPraKontrak: {
      tahapSaatIni: pra.status,
      jadwalPraKontrak: {
        targetMulaiPekerjaan: pra.targetMulaiTender,
        targetSelesaiPekerjaan: pra.targetSelesaiTender
      }
    },
    dataKontrak: {
      nomorKontrak: '',
      tanggalKontrak: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      nilaiKontrak: 0,
      namaPenyedia: '-',
      bankRekanan: 'Bank Jateng',
      rekeningRekanan: '',
      npwpRekanan: ''
    },
    dataFisik: {
      progresRencana: 0,
      progresRealisasi: 0,
      deviasiFisik: 0,
      statusDeviasi: 'Aman',
      mingguan: []
    },
    dataKeuangan: {
      totalPencairan: 0,
      persenKeuangan: 0,
      sisaAnggaran: pagu,
      terminHistory: []
    },
    spjStatus: 'belum_masuk',
    administrasiSPJ: {
      status: 'belum_masuk',
      tanggalMasuk: '',
      tanggalKoreksi: '',
      tanggalSPM: '',
      nomorSPM: '',
      catatanVerifikator: 'Paket berstatus Pra-Kontrak per Mei 2026. Belum mengajukan berkas SPJ.',
      petugasVerifikator: ''
    },
    tahapanPencairan: {
      berkasBelumMasuk: true,
      berkasMasuk: false,
      koreksi: false,
      berkasRevisiMasuk: false,
      spm: false,
      selesai: false,
      catatanPencairan: 'Belum ada pencairan SP2D (Tahap Pra-Kontrak)'
    },
    logs: [
      {
        id: `log_mei_${p.id}`,
        timestamp: '2026-05-20 09:30:00',
        userName: 'Admin SIMON SATU PUTARU',
        userRole: 'Sistem Monitoring',
        action: 'Monitoring Pra-Kontrak Mei 2026',
        keterangan: `Pemantauan berkala bulan Mei 2026: Pekerjaan dalam tahap ${stageInfo.label}. Alokasi pagu Rp ${Math.round(pagu).toLocaleString('id-ID')}.`
      }
    ]
  };
});

// Transform MONITORING_PAKET_2026
const updatedMonitoringPaket = MONITORING_PAKET_2026.map((mp, idx) => {
  // Check if there is an exact or related matched project
  const matched = updatedProjects.find(p => p.id === mp.id || p.namaPaket.trim().toLowerCase() === mp.namaPaket.trim().toLowerCase());
  const pra = matched ? matched.tahapPraKontrak : assignPraKontrakStage(mp, idx);
  const pagu = parseFloat(mp.paguAnggaran) || 0;
  const stageInfo = STAGES[pra.status] || STAGES.rup;

  return {
    ...mp,
    isKontrak: false,
    statusTahapPraKontrak: pra.status,
    tahapPraKontrak: {
      status: pra.status,
      targetMulaiTender: pra.targetMulaiTender,
      targetSelesaiTender: pra.targetSelesaiTender,
      catatanPraKontrak: pra.catatanPraKontrak
    },
    dataKontrak: {
      nomorKontrak: '',
      tanggalKontrak: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      nilaiKontrak: 0,
      namaPenyedia: '-',
      bankRekanan: 'Bank Jateng',
      rekeningRekanan: '',
      npwpRekanan: ''
    },
    dataFisik: {
      progresRencana: 0,
      progresRealisasi: 0,
      deviasiFisik: 0,
      statusDeviasi: 'Aman',
      mingguan: []
    },
    dataKeuangan: {
      totalPencairan: 0,
      persenKeuangan: 0,
      sisaAnggaran: pagu,
      terminHistory: []
    },
    spjStatus: 'belum_masuk',
    administrasiSPJ: {
      status: 'belum_masuk',
      tanggalMasuk: '',
      tanggalKoreksi: '',
      tanggalSPM: '',
      nomorSPM: '',
      catatanVerifikator: 'Paket berstatus Pra-Kontrak per Mei 2026. Belum mengajukan berkas SPJ.',
      petugasVerifikator: ''
    },
    tahapanPencairan: {
      berkasBelumMasuk: true,
      berkasMasuk: false,
      koreksi: false,
      berkasRevisiMasuk: false,
      spm: false,
      selesai: false,
      catatanPencairan: 'Belum ada pencairan SP2D (Tahap Pra-Kontrak)'
    },
    logs: [
      {
        id: `log_mei_${mp.id}`,
        timestamp: '2026-05-20 09:30:00',
        userName: 'Admin SIMON SATU PUTARU',
        userRole: 'Sistem Monitoring',
        action: 'Monitoring Pra-Kontrak Mei 2026',
        keterangan: `Pemantauan berkala bulan Mei 2026: Pekerjaan dalam tahap ${stageInfo.label}. Alokasi pagu Rp ${Math.round(pagu).toLocaleString('id-ID')}.`
      }
    ]
  };
});

// Write to files
const prjFileContent = `/**
 * DATA REAL PAKET PEKERJAAN 2026 (MONITORING MEI 2026 - TAHAP PRA-KONTRAK)
 * DINPUTARU KABUPATEN DEMAK
 * Total Pekerjaan: ${updatedProjects.length} Paket (Seluruhnya Belum Kontrak / Pra-Kontrak)
 */

export const REAL_PROJECTS_2026 = ${JSON.stringify(updatedProjects, null, 2)};
`;
fs.writeFileSync('src/data/realProjects2026.js', prjFileContent, 'utf8');
console.log('Successfully updated src/data/realProjects2026.js');

const mpFileContent = `/**
 * DATA MONITORING PAKET PEKERJAAN 2026 (MONITORING MEI 2026 - TAHAP PRA-KONTRAK)
 * Sumber: Monitoring Paket 2026.xlsx
 * Total Paket: ${updatedMonitoringPaket.length} Paket (Seluruhnya Belum Kontrak / Pra-Kontrak)
 */

export const MONITORING_PAKET_2026 = ${JSON.stringify(updatedMonitoringPaket, null, 2)};
`;
fs.writeFileSync('src/data/monitoringPaket2026.js', mpFileContent, 'utf8');
console.log('Successfully updated src/data/monitoringPaket2026.js');

// Print Stats
const stageStatsProjects = {};
updatedProjects.forEach(p => {
  stageStatsProjects[p.statusTahapPraKontrak] = (stageStatsProjects[p.statusTahapPraKontrak] || 0) + 1;
});
console.log('Projects distribution by Pra-Kontrak stage:', stageStatsProjects);
console.log('Projects isKontrak = true count:', updatedProjects.filter(p => p.isKontrak).length);
console.log('Monitoring Paket isKontrak = true count:', updatedMonitoringPaket.filter(p => p.isKontrak).length);
