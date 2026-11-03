import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const wb = XLSX.readFile('./Program_Kegiatan_2026.xlsx');
const ws = wb.Sheets['OKTOBER SPJ IN'];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

console.log('Read rows:', rows.length);

function getBidangId(progName) {
  const p = progName.toUpperCase();
  if (p.includes('PENUNJANG')) return 'sekretariat';
  if (p.includes('JALAN')) return 'bina_marga';
  if (p.includes('SUMBER DAYA AIR') || p.includes('KONSTRUKSI')) return 'sda_bk';
  if (p.includes('AIR MINUM') || p.includes('AIR LIMBAH') || p.includes('DRAINASE') || p.includes('BANGUNAN GEDUNG')) return 'cipta_karya';
  if (p.includes('PENATAAN RUANG') || p.includes('TANAH') || p.includes('PERTANAHAN')) return 'tata_ruang';
  return 'bina_marga';
}

const PROGRAM_META = [
  {
    pattern: /PENUNJANG/i,
    kode: '1.03.01',
    nama: 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA',
    bidangId: 'sekretariat',
    deskripsi: 'Perencanaan, penganggaran, administrasi keuangan, kepegawaian, pengadaan sarana dan pemeliharaan BMD DINPUTARU'
  },
  {
    pattern: /SUMBER DAYA AIR/i,
    kode: '1.03.02',
    nama: 'PROGRAM PENGELOLAAN SUMBER DAYA AIR (SDA)',
    bidangId: 'sda_bk',
    deskripsi: 'Pengelolaan sungai, waduk/embung, pintu air, stasiun pompa banjir, dan jaringan irigasi pertanian'
  },
  {
    pattern: /AIR MINUM/i,
    kode: '1.03.03',
    nama: 'PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM PENYEDIAAN AIR MINUM',
    bidangId: 'cipta_karya',
    deskripsi: 'Pembangunan dan peningkatan SPAM jaringan perpipaan serta sambungan rumah bagi masyarakat'
  },
  {
    pattern: /AIR LIMBAH/i,
    kode: '1.03.05',
    nama: 'PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM AIR LIMBAH',
    bidangId: 'cipta_karya',
    deskripsi: 'Pembangunan tangki septik individu/komunal, TPS3R, dan instalasi pengolahan limbah domestik'
  },
  {
    pattern: /DRAINASE/i,
    kode: '1.03.06',
    nama: 'PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM DRAINASE',
    bidangId: 'cipta_karya',
    deskripsi: 'Pembangunan, rehabilitasi sistem drainase perkotaan dan saluran pembuang primer/sekunder'
  },
  {
    pattern: /BANGUNAN GEDUNG/i,
    kode: '1.03.08',
    nama: 'PROGRAM PENATAAN BANGUNAN GEDUNG',
    bidangId: 'cipta_karya',
    deskripsi: 'Pembangunan dan rehabilitasi gedung kantor, fasilitas umum, dan kawasan permukiman'
  },
  {
    pattern: /JALAN/i,
    kode: '1.03.10',
    nama: 'PROGRAM PENYELENGGARAAN JALAN',
    bidangId: 'bina_marga',
    deskripsi: 'Pembangunan, rekonstruksi, pelebaran jalan kabupaten dan pemeliharaan jembatan'
  },
  {
    pattern: /JASA KONSTRUKSI/i,
    kode: '1.03.11',
    nama: 'PROGRAM PENGEMBANGAN JASA KONSTRUKSI',
    bidangId: 'sda_bk',
    deskripsi: 'Pelatihan tenaga kerja terampil konstruksi, pembinaan kelembagaan dan sertifikasi kompetensi'
  },
  {
    pattern: /PENATAAN RUANG/i,
    kode: '1.03.12',
    nama: 'PROGRAM PENYELENGGARAAN PENATAAN RUANG',
    bidangId: 'tata_ruang',
    deskripsi: 'Persetujuan substansi RTRW/RDTR, KKPR, sinkronisasi pemanfaatan ruang, dan forum penataan ruang'
  },
  {
    pattern: /REDISTRIBUSI TANAH/i,
    kode: '2.10.01',
    nama: 'PROGRAM REDISTRIBUSI TANAH, DAN GANTI KERUGIAN PROGRAM TANAH KELEBIHAN MAKSIMUM DAN TANAH ABSENTEE',
    bidangId: 'tata_ruang',
    deskripsi: 'Gugus Tugas Reforma Agraria (GTRA) dan redistribusi tanah di Kabupaten Demak'
  },
  {
    pattern: /PENATAGUNAAN TANAH/i,
    kode: '2.10.02',
    nama: 'PROGRAM PENATAGUNAAN TANAH',
    bidangId: 'tata_ruang',
    deskripsi: 'Koordinasi konsolidasi tanah dan penataan penguasaan tanah daerah'
  }
];

let curProg = null;
let curKeg = null;
let curSubKeg = null;

const programs = [];
const kegiatans = [];
const subKegiatans = [];
const projects = [];

for (let i = 8; i < rows.length; i++) {
  const r = rows[i] || [];
  const col1 = String(r[1] !== null && r[1] !== undefined ? r[1] : '').trim();
  const col2 = String(r[2] !== null && r[2] !== undefined ? r[2] : '').trim();
  const col3 = String(r[3] !== null && r[3] !== undefined ? r[3] : '').trim();
  const col4 = String(r[4] !== null && r[4] !== undefined ? r[4] : '').trim();
  const col5 = String(r[5] !== null && r[5] !== undefined ? r[5] : '').trim();
  const col6 = String(r[6] !== null && r[6] !== undefined ? r[6] : '').trim();
  const col7 = r[7];
  const col38 = String(r[38] !== null && r[38] !== undefined ? r[38] : '').trim();

  const fullText = `${col1} | ${col2} | ${col3} | ${col4} | ${col5} | ${col6}`.toUpperCase();

  // 1. Check Program
  if (fullText.includes('PROGRAM ') && (col1.match(/^[I|V|X]+[\.]?$/) || col2.toUpperCase().startsWith('PROGRAM '))) {
    let name = col2.toUpperCase().startsWith('PROGRAM ') ? col2 : col6;
    if (!name || !name.toUpperCase().includes('PROGRAM')) {
      name = [col2, col3, col6].find(c => c && c.toUpperCase().includes('PROGRAM')) || fullText;
    }
    name = name.replace(/^[I|V|X\.\s]+/, '').trim();
    if (!name.toUpperCase().startsWith('PROGRAM ')) {
      name = 'PROGRAM ' + name;
    }
    if (name.includes('DRAINASE')) {
      name = 'PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM DRAINASE';
    }

    const matchedMeta = PROGRAM_META.find(m => m.pattern.test(name)) || {
      kode: `1.03.${String(programs.length + 1).padStart(2, '0')}`,
      nama: name,
      bidangId: getBidangId(name),
      deskripsi: name
    };

    curProg = {
      id: `prog_${matchedMeta.bidangId}_${matchedMeta.kode.replace(/\./g, '_')}`,
      kodeProgram: matchedMeta.kode,
      namaProgram: matchedMeta.nama,
      bidangId: matchedMeta.bidangId,
      deskripsi: matchedMeta.deskripsi
    };
    programs.push(curProg);
    curKeg = null;
    curSubKeg = null;
    continue;
  }

  // 2. Check Sub Kegiatan
  if (fullText.includes('SUB KEGIATAN')) {
    let subName = [col4, col5, col6, col3].find(c => c && c.toLowerCase().includes('sub kegiatan')) || col6 || col4;
    if (subName && subName.toLowerCase().includes('sub kegiatan')) {
      subName = subName.substring(subName.indexOf(':') + 1).trim();
    }
    // Clean string
    subName = subName.replace(/\r?\n/g, ' ').trim();
    if (!subName) continue;

    // Determine clean code
    let kodeSub = '';
    if (col38) {
      const match = col38.match(/(\d+\.\d+)\s*\.\s*(\d+)$/);
      if (match && curKeg) {
        kodeSub = `${curKeg.kodeKegiatan}.${match[2].padStart(2, '0')}`;
      }
    }
    if (!kodeSub && curKeg) {
      const existingInKeg = subKegiatans.filter(s => s.kegiatanId === curKeg.id).length + 1;
      kodeSub = `${curKeg.kodeKegiatan}.${String(existingInKeg).padStart(2, '0')}`;
    }

    const subId = `sub_${curProg ? curProg.bidangId : 'gen'}_${subKegiatans.length + 1}`;
    const pagu = typeof col7 === 'number' ? col7 : (parseFloat(String(col7).replace(/[^\d.-]/g, '')) || 0);
    const pencairan = typeof r[17] === 'number' ? r[17] : (parseFloat(String(r[17] || '').replace(/[^\d.-]/g, '')) || 0);
    const fTarget = typeof r[21] === 'number' ? r[21] * 100 : (parseFloat(String(r[21] || '').replace('%', '')) || 0);
    const fRealisasi = typeof r[22] === 'number' ? r[22] * 100 : (parseFloat(String(r[22] || '').replace('%', '')) || 0);

    curSubKeg = {
      id: subId,
      programId: curProg ? curProg.id : null,
      kegiatanId: curKeg ? curKeg.id : null,
      kodeSubKegiatan: kodeSub,
      namaSubKegiatan: subName,
      bidangId: curProg ? curProg.bidangId : 'sekretariat'
    };
    subKegiatans.push(curSubKeg);

    // USER RULE:
    // "Perlu diingat untuk pekerjaan di program penunjang adalah nama sub kegiatan tersebut."
    if (curProg && curProg.bidangId === 'sekretariat') {
      const dev = fRealisasi - fTarget;
      const statusDev = dev >= 0 ? 'Aman' : (dev >= -10 ? 'Waspada' : 'Kritis');
      const persenKeu = pagu > 0 ? parseFloat(((pencairan / pagu) * 100).toFixed(2)) : 0;

      projects.push({
        id: `prj_sek_${projects.length + 1}`,
        tahunAnggaran: 2026,
        bidangId: 'sekretariat',
        subBagian: curKeg ? curKeg.namaKegiatan : 'Sub Bagian Umum & Kepegawaian',
        namaPaket: subName,
        jenisAnggaran: 'Murni',
        sumberDana: 'APBD Murni (DAU)',
        kodeRup: `RUP-2026-SEK-${String(projects.length + 1).padStart(4, '0')}`,
        tipePengadaan: 'Swakelola',
        paguAnggaran: pagu,
        hps: pagu,
        kecamatan: 'Demak',
        desa: 'Bintoro',
        lokasiLengkap: 'Kantor DINPUTARU Kabupaten Demak, Jl. Kyai Singkil No. 7 Demak',
        latitude: -6.8944,
        longitude: 110.6385,
        tags: ['Kegiatan Penunjang Perangkat Daerah'],
        isPublicHighlight: false,
        subKegiatanId: curSubKeg.id,
        kodeSubKegiatan: curSubKeg.kodeSubKegiatan,
        statusTahapPraKontrak: 'pelaksanaan_kontrak',
        dataPraKontrak: {
          tahapSaatIni: 'pelaksanaan_kontrak',
          jadwalPraKontrak: { targetMulaiPekerjaan: '2026-01-02' }
        },
        dataKontrak: {
          nomorKontrak: '',
          tanggalKontrak: '2026-01-02',
          tanggalMulai: '2026-01-02',
          tanggalSelesai: '2026-12-31',
          nilaiKontrak: pagu,
          namaPenyedia: 'Swakelola / DINPUTARU Kab. Demak',
          bankRekanan: 'Bank Jateng',
          rekeningRekanan: '',
          npwpRekanan: ''
        },
        dataFisik: {
          progresRencana: parseFloat(fTarget.toFixed(2)),
          progresRealisasi: parseFloat(fRealisasi.toFixed(2)),
          deviasiFisik: parseFloat(dev.toFixed(2)),
          statusDeviasi: statusDev,
          mingguan: []
        },
        dataKeuangan: {
          totalPencairan: pencairan,
          persenKeuangan: persenKeu,
          sisaAnggaran: Math.max(0, pagu - pencairan),
          terminHistory: []
        },
        spjStatus: pencairan > 0 ? 'sp2d_terbit' : 'belum_diajukan'
      });
    }
    continue;
  }

  // 3. Check Kegiatan
  if (fullText.includes('KEGIATAN :') || (col2.match(/^[A-Z]\.$/) && col3.toLowerCase().includes('kegiatan'))) {
    let kegName = [col3, col4, col6].find(c => c && c.toLowerCase().includes('kegiatan')) || col6;
    if (kegName && kegName.toLowerCase().includes('kegiatan :')) {
      kegName = kegName.substring(kegName.indexOf(':') + 1).trim();
    }
    kegName = kegName.replace(/\r?\n/g, ' ').trim();
    if (!kegName) continue;

    let kodeKeg = '';
    if (col38) {
      const match = col38.match(/(\d\.\d{2})$/);
      if (match && curProg) {
        kodeKeg = `${curProg.kodeProgram}.${match[1]}`;
      }
    }
    if (!kodeKeg && curProg) {
      const existingInProg = kegiatans.filter(k => k.programId === curProg.id).length + 1;
      kodeKeg = `${curProg.kodeProgram}.2.${String(existingInProg).padStart(2, '0')}`;
    }

    const kegId = `keg_${curProg ? curProg.bidangId : 'gen'}_${kegiatans.length + 1}`;
    curKeg = {
      id: kegId,
      programId: curProg ? curProg.id : null,
      kodeKegiatan: kodeKeg,
      namaKegiatan: kegName,
      bidangId: curProg ? curProg.bidangId : 'sekretariat'
    };
    kegiatans.push(curKeg);
    curSubKeg = null;
    continue;
  }

  // 4. Check Pekerjaan (Technical Programs)
  if (curSubKeg && curProg && curProg.bidangId !== 'sekretariat') {
    const jobText = col5 || (col4 && !col4.toLowerCase().includes('sub kegiatan') ? col4 : '') || (col6 && !col6.toLowerCase().includes('sub kegiatan') && !col6.toLowerCase().includes('kegiatan') ? col6 : '');
    const cleanJob = jobText.replace(/^[P|p]ekerjaan\s*:\s*/, '').replace(/\r?\n/g, ' ').trim();

    if (cleanJob && cleanJob.length > 2 && (col7 || r[12] || r[14] || r[15] || (col4 && col4.match(/^\d+$/)))) {
      const pagu = typeof col7 === 'number' ? col7 : (parseFloat(String(col7).replace(/[^\d.-]/g, '')) || 0);
      const noKontrak = r[12] ? String(r[12]).trim().replace(/\r?\n/g, ' ') : '';
      const tglKontrak = r[13] ? String(r[13]).trim() : '';
      const nilaiKontrak = typeof r[14] === 'number' ? r[14] : (parseFloat(String(r[14] || '').replace(/[^\d.-]/g, '')) || 0);
      const pelaksana = r[15] ? String(r[15]).trim().replace(/\r?\n/g, ' ') : '';
      const waktuPelaksanaan = r[16] ? String(r[16]).trim().replace(/\r?\n/g, ' ') : '';
      const pencairan = typeof r[17] === 'number' ? r[17] : (parseFloat(String(r[17] || '').replace(/[^\d.-]/g, '')) || 0);
      const fTarget = typeof r[21] === 'number' ? r[21] * 100 : (parseFloat(String(r[21] || '').replace('%', '')) || 0);
      const fRealisasi = typeof r[22] === 'number' ? r[22] * 100 : (parseFloat(String(r[22] || '').replace('%', '')) || 0);
      const keterangan = r[23] ? String(r[23]).trim() : '';

      let tipePengadaan = 'Pengadaan Langsung';
      if (r[8] === '√' || r[8] === 'v' || r[8] === 'V') tipePengadaan = 'Swakelola';
      else if (r[9] === '√' || r[9] === 'v' || r[9] === 'V') tipePengadaan = 'Pengadaan Langsung';
      else if (r[10] === '√' || r[10] === 'v' || r[10] === 'V' || noKontrak.toUpperCase().includes('TENDER')) tipePengadaan = 'Tender / Seleksi Umum';
      else if (r[11] === '√' || r[11] === 'v' || r[11] === 'V') tipePengadaan = 'Hibah';

      const dev = fRealisasi - fTarget;
      const statusDev = dev >= 0 ? 'Aman' : (dev >= -10 ? 'Waspada' : 'Kritis');
      const baseValue = nilaiKontrak > 0 ? nilaiKontrak : (pagu > 0 ? pagu : 1);
      const persenKeu = parseFloat(((pencairan / baseValue) * 100).toFixed(2));

      const tags = [];
      if (keterangan.toUpperCase().includes('PRIORITAS')) tags.push('Program Prioritas Bupati');
      if (keterangan.toUpperCase().includes('PERUBAHAN')) tags.push('APBD Perubahan');
      if (pagu >= 1000000000) tags.push('Proyek Strategis');

      let kecamatan = 'Demak';
      const kecList = ['Mranggen', 'Karangawen', 'Guntur', 'Sayung', 'Karangtengah', 'Bonang', 'Demak', 'Wonosalam', 'Dempet', 'Gajah', 'Karanganyar', 'Mijen', 'Wedung', 'Kebonagung'];
      for (const k of kecList) {
        if (new RegExp(`\\b${k}\\b`, 'i').test(cleanJob)) {
          kecamatan = k;
          break;
        }
      }

      projects.push({
        id: `prj_${curProg.bidangId}_${projects.length + 1}`,
        tahunAnggaran: 2026,
        bidangId: curProg.bidangId,
        subBagian: curKeg ? curKeg.namaKegiatan : '',
        namaPaket: cleanJob,
        jenisAnggaran: keterangan.toUpperCase().includes('PERUBAHAN') ? 'Perubahan' : 'Murni',
        sumberDana: 'APBD Murni (DAU)',
        kodeRup: `RUP-2026-${curProg.bidangId.toUpperCase().substring(0, 3)}-${String(projects.length + 1).padStart(4, '0')}`,
        tipePengadaan,
        paguAnggaran: pagu,
        hps: pagu > 0 ? pagu : nilaiKontrak,
        kecamatan,
        desa: '',
        lokasiLengkap: `Kabupaten Demak, Jawa Tengah (Kecamatan ${kecamatan})`,
        latitude: -6.8944,
        longitude: 110.6385,
        tags,
        isPublicHighlight: pagu >= 1000000000 || tags.includes('Program Prioritas Bupati'),
        subKegiatanId: curSubKeg.id,
        kodeSubKegiatan: curSubKeg.kodeSubKegiatan,
        statusTahapPraKontrak: noKontrak ? 'pelaksanaan_kontrak' : 'identifikasi_kebutuhan',
        dataPraKontrak: {
          tahapSaatIni: noKontrak ? 'pelaksanaan_kontrak' : 'identifikasi_kebutuhan',
          jadwalPraKontrak: {
            targetMulaiPekerjaan: tglKontrak || '2026-04-01'
          }
        },
        dataKontrak: {
          nomorKontrak: noKontrak,
          tanggalKontrak: tglKontrak || '',
          tanggalMulai: '2026-03-01',
          tanggalSelesai: '2026-11-30',
          nilaiKontrak,
          namaPenyedia: pelaksana || (noKontrak ? 'Penyedia Jasa Konstruksi' : '-'),
          bankRekanan: 'Bank Jateng',
          rekeningRekanan: '',
          npwpRekanan: ''
        },
        dataFisik: {
          progresRencana: parseFloat(fTarget.toFixed(2)),
          progresRealisasi: parseFloat(fRealisasi.toFixed(2)),
          deviasiFisik: parseFloat(dev.toFixed(2)),
          statusDeviasi: statusDev,
          mingguan: []
        },
        dataKeuangan: {
          totalPencairan: pencairan,
          persenKeuangan: persenKeu,
          sisaAnggaran: Math.max(0, (nilaiKontrak > 0 ? nilaiKontrak : pagu) - pencairan),
          terminHistory: []
        },
        spjStatus: pencairan > 0 ? 'sp2d_terbit' : 'belum_diajukan'
      });
    }
  }
}

console.log('Results:');
console.log('Programs count:', programs.length);
console.log('Kegiatans count:', kegiatans.length);
console.log('SubKegiatans count:', subKegiatans.length);
console.log('Projects count:', projects.length);

// Write to realProjects2026.js
const projectFileContent = `/**
 * DATA REAL PAKET PEKERJAAN 2026
 * Dihasilkan dari Dokumen Excel: Program Kegiatan Sub Kegiatan Pekerjaan 2026
 * DINPUTARU KABUPATEN DEMAK
 * Total Pekerjaan: ${projects.length} Paket
 */

export const REAL_PROJECTS_2026 = ${JSON.stringify(projects, null, 2)};
`;

fs.writeFileSync('./src/data/realProjects2026.js', projectFileContent, 'utf-8');
console.log('Successfully written to src/data/realProjects2026.js');

// Also update sipdData.js with these real programs, kegiatans, subKegiatans
const sipdContent = `/**
 * MASTER DATA NOMENKLATUR SIPD KEMENDAGRI (DINPUTARU KABUPATEN DEMAK)
 * Berdasarkan Klasifikasi/Kodefikasi Standar SIPD RI Kemendagri & Excel Rencana Kerja 2026
 * Total Program: ${programs.length}
 * Total Kegiatan: ${kegiatans.length}
 * Total Sub Kegiatan: ${subKegiatans.length}
 */

export const INITIAL_SIPD_PROGRAMS = ${JSON.stringify(programs, null, 2)};

export const INITIAL_SIPD_KEGIATAN = ${JSON.stringify(kegiatans, null, 2)};

export const INITIAL_SIPD_SUB_KEGIATAN = ${JSON.stringify(subKegiatans, null, 2)};

/**
 * Mencocokkan paket pekerjaan dengan sub kegiatan SIPD
 */
export const matchProjectToSubKegiatan = (project, subKegiatanList) => {
  if (!project || !Array.isArray(subKegiatanList) || subKegiatanList.length === 0) return null;

  if (project.subKegiatanId) {
    const found = subKegiatanList.find((s) => s.id === project.subKegiatanId);
    if (found) return found;
  }

  if (project.kodeSubKegiatan) {
    const found = subKegiatanList.find((s) => s.kodeSubKegiatan === project.kodeSubKegiatan);
    if (found) return found;
  }

  const nama = (project.namaPaket || '').toLowerCase();
  const bId = project.bidangId;

  // Filter sub kegiatan pada bidang yang bersangkutan
  const candidates = subKegiatanList.filter((s) => !bId || s.bidangId === bId);

  // Pencocokan cerdas berdasarkan kata kunci nama paket
  if (nama.includes('jembatan')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('jembatan'));
    if (match) return match;
  }
  if (nama.includes('rekonstruksi') || nama.includes('rigid') || nama.includes('peninggian')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('rekonstruksi'));
    if (match) return match;
  }
  if (nama.includes('pelebaran') || nama.includes('poros')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('pelebaran'));
    if (match) return match;
  }
  if (nama.includes('pemeliharaan') && (bId === 'bina_marga' || nama.includes('jalan'))) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('pemeliharaan'));
    if (match) return match;
  }
  if (nama.includes('air minum') || nama.includes('spam')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('air minum') || s.namaSubKegiatan.toLowerCase().includes('spam'));
    if (match) return match;
  }
  if (nama.includes('limbah') || nama.includes('spald') || nama.includes('septik') || nama.includes('sanitasi')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('limbah') || s.namaSubKegiatan.toLowerCase().includes('setempat'));
    if (match) return match;
  }
  if (nama.includes('gedung') || nama.includes('bangunan')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('gedung') || s.namaSubKegiatan.toLowerCase().includes('bangunan'));
    if (match) return match;
  }
  if (nama.includes('pompa') || nama.includes('banjir')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('pompa') || s.namaSubKegiatan.toLowerCase().includes('sungai'));
    if (match) return match;
  }
  if (nama.includes('sungai') || nama.includes('normalisasi')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('sungai') || s.namaSubKegiatan.toLowerCase().includes('tanggul'));
    if (match) return match;
  }
  if (nama.includes('embung') || nama.includes('waduk')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('embung'));
    if (match) return match;
  }
  if (nama.includes('irigasi') || nama.includes('d.i.')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('irigasi'));
    if (match) return match;
  }
  if (nama.includes('drainase') || nama.includes('saluran')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('drainase'));
    if (match) return match;
  }
  if (nama.includes('rtrw') || nama.includes('rdtr') || nama.includes('tata ruang')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('rtrw') || s.namaSubKegiatan.toLowerCase().includes('rdtr') || s.namaSubKegiatan.toLowerCase().includes('tata ruang'));
    if (match) return match;
  }
  if (nama.includes('tanah') || nama.includes('reforma') || nama.includes('gtra')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('tanah') || s.namaSubKegiatan.toLowerCase().includes('reforma'));
    if (match) return match;
  }

  return candidates.length > 0 ? candidates[0] : subKegiatanList[0];
};

/**
 * Membangun struktur pohon hierarki Program -> Kegiatan -> Sub Kegiatan -> Pekerjaan
 */
export const buildSipdTree = (programs, kegiatans, subKegiatans, projects) => {
  const projectMapBySubKeg = {};
  projects.forEach((prj) => {
    const subKeg = matchProjectToSubKegiatan(prj, subKegiatans);
    const subKegId = subKeg ? subKeg.id : 'unassigned';
    if (!projectMapBySubKeg[subKegId]) {
      projectMapBySubKeg[subKegId] = [];
    }
    projectMapBySubKeg[subKegId].push({
      ...prj,
      matchedSubKegiatan: subKeg
    });
  });

  return programs.map((prog) => {
    const progKegiatans = kegiatans.filter((k) => k.programId === prog.id);

    let progTotalPagu = 0;
    let progTotalKontrak = 0;
    let progTotalPencairan = 0;
    let progFisikSum = 0;
    let progProjectCount = 0;

    const formattedKegiatans = progKegiatans.map((keg) => {
      const kegSubKegiatans = subKegiatans.filter((s) => s.kegiatanId === keg.id);

      let kegTotalPagu = 0;
      let kegTotalKontrak = 0;
      let kegTotalPencairan = 0;
      let kegFisikSum = 0;
      let kegProjectCount = 0;

      const formattedSubKegiatans = kegSubKegiatans.map((sub) => {
        const subProjects = projectMapBySubKeg[sub.id] || [];

        const subTotalPagu = subProjects.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
        const subTotalKontrak = subProjects.reduce((sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0), 0);
        const subTotalPencairan = subProjects.reduce((sum, p) => sum + (parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);
        const subFisikSum = subProjects.reduce((sum, p) => sum + (parseFloat(p.dataFisik?.progresRealisasi) || 0), 0);
        const subAvgFisik = subProjects.length > 0 ? parseFloat((subFisikSum / subProjects.length).toFixed(1)) : 0;
        const subPersenKeu = subTotalKontrak > 0 ? parseFloat(((subTotalPencairan / subTotalKontrak) * 100).toFixed(1)) : (subTotalPagu > 0 ? parseFloat(((subTotalPencairan / subTotalPagu) * 100).toFixed(1)) : 0);

        kegTotalPagu += subTotalPagu;
        kegTotalKontrak += subTotalKontrak;
        kegTotalPencairan += subTotalPencairan;
        kegFisikSum += subFisikSum;
        kegProjectCount += subProjects.length;

        return {
          ...sub,
          projects: subProjects,
          totalPagu: subTotalPagu,
          totalKontrak: subTotalKontrak,
          totalPencairan: subTotalPencairan,
          persenKeuangan: subPersenKeu,
          avgFisik: subAvgFisik,
          projectCount: subProjects.length
        };
      });

      const kegAvgFisik = kegProjectCount > 0 ? parseFloat((kegFisikSum / kegProjectCount).toFixed(1)) : 0;
      const kegPersenKeu = kegTotalKontrak > 0 ? parseFloat(((kegTotalPencairan / kegTotalKontrak) * 100).toFixed(1)) : (kegTotalPagu > 0 ? parseFloat(((kegTotalPencairan / kegTotalPagu) * 100).toFixed(1)) : 0);

      progTotalPagu += kegTotalPagu;
      progTotalKontrak += kegTotalKontrak;
      progTotalPencairan += kegTotalPencairan;
      progFisikSum += kegFisikSum;
      progProjectCount += kegProjectCount;

      return {
        ...keg,
        subKegiatans: formattedSubKegiatans,
        totalPagu: kegTotalPagu,
        totalKontrak: kegTotalKontrak,
        totalPencairan: kegTotalPencairan,
        persenKeuangan: kegPersenKeu,
        avgFisik: kegAvgFisik,
        projectCount: kegProjectCount
      };
    });

    const progAvgFisik = progProjectCount > 0 ? parseFloat((progFisikSum / progProjectCount).toFixed(1)) : 0;
    const progPersenKeu = progTotalKontrak > 0 ? parseFloat(((progTotalPencairan / progTotalKontrak) * 100).toFixed(1)) : (progTotalPagu > 0 ? parseFloat(((progTotalPencairan / progTotalPagu) * 100).toFixed(1)) : 0);

    return {
      ...prog,
      kegiatans: formattedKegiatans,
      totalPagu: progTotalPagu,
      totalKontrak: progTotalKontrak,
      totalPencairan: progTotalPencairan,
      persenKeuangan: progPersenKeu,
      avgFisik: progAvgFisik,
      projectCount: progProjectCount
    };
  });
};
`;

fs.writeFileSync('./src/data/sipdData.js', sipdContent, 'utf-8');
console.log('Successfully written to src/data/sipdData.js');

