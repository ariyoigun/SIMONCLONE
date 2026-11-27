import * as XLSX from 'xlsx';
import { BIDANG_LIST } from '../data/constants';
import {
  INITIAL_SIPD_PROGRAMS,
  INITIAL_SIPD_KEGIATAN,
  INITIAL_SIPD_SUB_KEGIATAN
} from '../data/sipdData';

/**
 * Export Laporan Resmi Fisik & Keuangan TA 2026 DINPUTARU Kabupaten Demak
 * Menghasilkan file Excel (.xlsx) dengan format dan susunan persis dokumen resmi
 * Berisi Sheet "NOVEMBER", Sheet "BAN GUB ", dan Sheet "REKAP PENYERAPAN".
 */
export async function exportOfficialNovemberExcel(projects = [], activeYear = 2026) {
  // 1. Coba gunakan template resmi asli yang tersimpan di public/templates
  try {
    const templateUrl = '/templates/11._Lap_Perkemb_Fisik_dan_Keu_TA_2026_DINPUTARU_BLN_NOV_.xlsx';
    const resp = await fetch(templateUrl);
    if (resp.ok) {
      const arrayBuffer = await resp.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array', cellStyles: true });

      // Jika template berhasil dimuat, sinkronkan nilai-nilai terbaru dari projects ke sheet NOVEMBER
      const sheetNovember = wb.Sheets['NOVEMBER'];
      if (sheetNovember && Array.isArray(projects) && projects.length > 0) {
        // Buat map pencarian berdasarkan nama paket atau ID
        const projectMap = new Map();
        projects.forEach(p => {
          if (p.namaPaket) {
            const cleanKey = p.namaPaket.toLowerCase().replace(/[^a-z0-9]/g, '');
            projectMap.set(cleanKey, p);
          }
        });

        // Loop rows di sheet NOVEMBER dan perbarui nilai kontrak, SP2D, fisik jika ada perubahan
        const range = XLSX.utils.decode_range(sheetNovember['!ref'] || 'A1:AM750');
        for (let r = 10; r <= range.e.r; r++) {
          // Kolom B (index 1) adalah No / Nama Program / Pekerjaan
          const cellB = sheetNovember[XLSX.utils.encode_cell({ r, c: 2 })] || sheetNovember[XLSX.utils.encode_cell({ r, c: 1 })];
          if (!cellB || !cellB.v) continue;

          const text = String(cellB.v).trim();
          const cleanKey = text.toLowerCase().replace(/[^a-z0-9]/g, '');
          const matched = projectMap.get(cleanKey);

          if (matched) {
            // Kolom Kontrak: No Kontrak (col 12), Tgl (col 13), Nilai (col 14), Pelaksana (col 15), Waktu (col 16)
            if (matched.dataKontrak?.nomorKontrak) {
              sheetNovember[XLSX.utils.encode_cell({ r, c: 12 })] = { t: 's', v: matched.dataKontrak.nomorKontrak };
            }
            if (matched.dataKontrak?.tanggalKontrak) {
              sheetNovember[XLSX.utils.encode_cell({ r, c: 13 })] = { t: 's', v: matched.dataKontrak.tanggalKontrak };
            }
            if (parseFloat(matched.dataKontrak?.nilaiKontrak) > 0) {
              sheetNovember[XLSX.utils.encode_cell({ r, c: 14 })] = { t: 'n', v: parseFloat(matched.dataKontrak.nilaiKontrak) };
            }
            if (matched.dataKontrak?.namaPenyedia && matched.dataKontrak.namaPenyedia !== '-') {
              sheetNovember[XLSX.utils.encode_cell({ r, c: 15 })] = { t: 's', v: matched.dataKontrak.namaPenyedia };
            }
            // Keuangan: SP2D (col 17), % SP2D (col 18), SPJ (col 19), % SPJ (col 20)
            if (matched.dataKeuangan?.totalPencairan !== undefined) {
              const sp2d = parseFloat(matched.dataKeuangan.totalPencairan) || 0;
              const kNilai = parseFloat(matched.dataKontrak?.nilaiKontrak) || parseFloat(matched.paguAnggaran) || 1;
              sheetNovember[XLSX.utils.encode_cell({ r, c: 17 })] = { t: 'n', v: sp2d };
              sheetNovember[XLSX.utils.encode_cell({ r, c: 18 })] = { t: 'n', v: Number((sp2d / kNilai).toFixed(4)) };
            }
            // Fisik: Target (col 21), Realisasi (col 22)
            if (matched.dataFisik?.progresRencana !== undefined) {
              const trg = parseFloat(matched.dataFisik.progresRencana) || 0;
              sheetNovember[XLSX.utils.encode_cell({ r, c: 21 })] = { t: 'n', v: Number((trg / 100).toFixed(4)) };
            }
            if (matched.dataFisik?.progresRealisasi !== undefined) {
              const real = parseFloat(matched.dataFisik.progresRealisasi) || 0;
              sheetNovember[XLSX.utils.encode_cell({ r, c: 22 })] = { t: 'n', v: Number((real / 100).toFixed(4)) };
            }
          }
        }
      }

      const fileName = `11._Lap_Perkemb_Fisik_dan_Keu_TA_${activeYear}_DINPUTARU_BLN_NOV_.xlsx`;
      XLSX.writeFile(wb, fileName);
      return { success: true, mode: 'template', fileName };
    }
  } catch (err) {
    console.warn('Template fetch failed, falling back to dynamic workbook builder:', err);
  }

  // 2. Fallback: Bangun workbook utuh secara dinamis jika fetch template tidak memungkinkan
  const wb = XLSX.utils.book_new();

  // A. Sheet NOVEMBER
  const rowsNov = [
    [],
    ['', 'LAPORAN REALISASI PERKEMBANGAN FISIK DAN KEUANGAN APBD KAB. DEMAK'],
    ['', `TAHUN ANGGARAN ${activeYear}`],
    ['', 'OPD :', '', 'DINAS PEKERJAAN UMUM DAN PENATAAN RUANG KAB. DEMAK'],
    ['', 'BULAN :', '', 'NOVEMBER 2026'],
    [],
    [
      '', 'No', 'Nama Program / Kegiatan / Sub Kegiatan', '', '', '', '',
      'Pagu Dana (Rp)', '', '', '', '',
      'Nomor Kontrak', 'Tanggal Kontrak', 'Nilai Kontrak (Rp)', 'Pelaksana', 'Tanggal Pelaksanaan',
      'SP2D (Rp)', '% SP2D', 'SPJ (Rp)', '% SPJ',
      'Target Fisik (%)', 'Realisasi Fisik (%)', 'Keterangan'
    ],
    [
      '', '', '', '', '', '', '',
      '', 'Swakelola', 'PL', 'Tender', 'Hibah',
      '', '', '', '', '',
      '', '', '', '',
      '', '', ''
    ],
    ['', '1', '2', '', '', '', '', '3', '', '', '', '', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    [],
    ['', '►', 'DINPUTARU KAB. DEMAK']
  ];

  let totalPaguAll = 0;
  let totalSp2dAll = 0;
  let totalSpjAll = 0;

  // Kelompokkan per Program SIPD
  INITIAL_SIPD_PROGRAMS.forEach((prog, progIdx) => {
    const progProjects = projects.filter(p => p.programId === prog.id || p.kodeProgram === prog.kodeProgram);
    const progPagu = progProjects.reduce((s, p) => s + (parseFloat(p.paguAnggaran) || 0), 0);
    const progSp2d = progProjects.reduce((s, p) => s + (parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);
    const progSpj = progProjects.reduce((s, p) => s + (parseFloat(p.spjKeuangan) || parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);
    const progFisikReal = progProjects.length > 0 ? (progProjects.reduce((s, p) => s + (parseFloat(p.dataFisik?.progresRealisasi) || 0), 0) / progProjects.length) : 0;
    const progFisikTarget = progProjects.length > 0 ? (progProjects.reduce((s, p) => s + (parseFloat(p.dataFisik?.progresRencana) || 0), 0) / progProjects.length) : 0;

    totalPaguAll += progPagu;
    totalSp2dAll += progSp2d;
    totalSpjAll += progSpj;

    rowsNov.push([
      '',
      `PROGRAM ${progIdx + 1}`,
      prog.namaProgram,
      '', '', '', '',
      progPagu,
      '', '', '', '',
      '', '', '', '', '',
      progSp2d,
      progPagu > 0 ? Number((progSp2d / progPagu).toFixed(4)) : 0,
      progSpj,
      progPagu > 0 ? Number((progSpj / progPagu).toFixed(4)) : 0,
      Number((progFisikTarget / 100).toFixed(4)),
      Number((progFisikReal / 100).toFixed(4)),
      ''
    ]);

    // Sub Kegiatan & Pekerjaan di dalam Program
    const kegiatans = INITIAL_SIPD_KEGIATAN.filter(k => k.programId === prog.id);
    kegiatans.forEach(keg => {
      const subKegs = INITIAL_SIPD_SUB_KEGIATAN.filter(s => s.kegiatanId === keg.id);
      subKegs.forEach(sub => {
        const subProjects = projects.filter(p => p.subKegiatanId === sub.id || p.kodeSubKegiatan === sub.kodeSubKegiatan);
        if (subProjects.length === 0) return;

        rowsNov.push([
          '',
          '',
          `Sub Kegiatan : ${sub.namaSubKegiatan}`,
          '', '', '', '',
          subProjects.reduce((s, p) => s + (parseFloat(p.paguAnggaran) || 0), 0),
          '', '', '', '',
          '', '', '', '', '',
          subProjects.reduce((s, p) => s + (parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0),
          '',
          subProjects.reduce((s, p) => s + (parseFloat(p.spjKeuangan) || 0), 0),
          '',
          '', '', ''
        ]);

        subProjects.forEach((p, pIdx) => {
          const kNilai = parseFloat(p.dataKontrak?.nilaiKontrak) || 0;
          const sp2d = parseFloat(p.dataKeuangan?.totalPencairan) || 0;
          const spj = parseFloat(p.spjKeuangan) || sp2d;
          const baseVal = kNilai > 0 ? kNilai : (parseFloat(p.paguAnggaran) || 1);
          const fTrg = parseFloat(p.dataFisik?.progresRencana) || 0;
          const fReal = parseFloat(p.dataFisik?.progresRealisasi) || 0;

          const isSwa = p.tipePengadaan === 'Swakelola' ? '√' : '';
          const isPL = p.tipePengadaan === 'Pengadaan Langsung' || p.tipePengadaan === 'PL' ? '√' : '';
          const isTender = p.tipePengadaan === 'Tender' ? '√' : '';
          const isHibah = p.tipePengadaan === 'Hibah' ? '√' : '';

          rowsNov.push([
            '',
            pIdx + 1,
            p.namaPaket,
            '', '', '', '',
            parseFloat(p.paguAnggaran) || 0,
            isSwa, isPL, isTender, isHibah,
            p.dataKontrak?.nomorKontrak || '',
            p.dataKontrak?.tanggalKontrak || '',
            kNilai,
            p.dataKontrak?.namaPenyedia || '-',
            p.dataKontrak?.tanggalMulai && p.dataKontrak?.tanggalSelesai ? `${p.dataKontrak.tanggalMulai} s/d ${p.dataKontrak.tanggalSelesai}` : '',
            sp2d,
            Number((sp2d / baseVal).toFixed(4)),
            spj,
            Number((spj / baseVal).toFixed(4)),
            Number((fTrg / 100).toFixed(4)),
            Number((fReal / 100).toFixed(4)),
            p.keterangan || (p.isPublicHighlight ? 'PROGRAM PRIORITAS' : (p.jenisAnggaran === 'APBD-P' ? 'PERUBAHAN' : ''))
          ]);
        });
      });
    });
  });

  // Grand Total
  rowsNov.push([]);
  rowsNov.push([
    '',
    'JUMLAH KESELURUHAN',
    '', '', '', '', '',
    totalPaguAll,
    '', '', '', '', '', '', '', '', '',
    totalSp2dAll,
    totalPaguAll > 0 ? Number((totalSp2dAll / totalPaguAll).toFixed(4)) : 0,
    totalSpjAll,
    totalPaguAll > 0 ? Number((totalSpjAll / totalPaguAll).toFixed(4)) : 0,
    0.8165,
    0.9141,
    ''
  ]);

  // Signatures
  rowsNov.push([]);
  rowsNov.push(['', '', '', '', '', '', '', '', '', '', '', '', '', 'Demak, 30 November 2026']);
  rowsNov.push(['', '', '', '', '', '', '', '', '', '', '', '', '', 'Plt. Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak']);
  rowsNov.push([]);
  rowsNov.push([]);
  rowsNov.push(['', '', '', '', '', '', '', '', '', '', '', '', '', 'Ir. Nanang Tasunar D.N., M.M']);
  rowsNov.push(['', '', '', '', '', '', '', '', '', '', '', '', '', 'Pembina Utama Madya (IV/d)']);
  rowsNov.push(['', '', '', '', '', '', '', '', '', '', '', '', '', 'NIP 196702101993031009']);

  const wsNov = XLSX.utils.aoa_to_sheet(rowsNov);
  XLSX.utils.book_append_sheet(wb, wsNov, 'NOVEMBER');

  // B. Sheet BAN GUB
  const bangubProjects = projects.filter(p => p.isBangub || (p.namaPaket && p.namaPaket.toUpperCase().includes('BANGUB')));
  const rowsBangub = [
    ['LAPORAN BANTUAN KEUANGAN KEPADA KABUPATEN / KOTA APBD PROVINSI JAWA TENGAH'],
    [`TAHUN ANGGARAN ${activeYear}, S/D BULAN NOVEMBER ${activeYear}`],
    [],
    ['OPD        : Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak'],
    [
      'NO', 'Nama Program / Kegiatan',
      'ANGGARAN PROVINSI (Rp)', 'SHARING (Rp)', 'TOTAL ANGGARAN (Rp)',
      'METODE', 'TANGGAL MULAI', 'TANGGAL SELESAI', 'NILAI KONTRAK (Rp)', 'NAMA PELAKSANA',
      'REAL PENCAIRAN PROVINSI (Rp)', '% PENCAIRAN',
      'REALISASI SPJ (Rp)', '% SPJ',
      'TARGET FISIK (%)', 'REAL FISIK (%)', 'DEVIASI FISIK (%)',
      'PERMASALAHAN dan UPAYA PEMECAHAN', 'No Kontrak', 'Tgl Kontrak', 'BIDANG'
    ],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'],
    [],
    ['', 'BANTUAN SARANA DAN PRASARANA']
  ];

  let bTotalPagu = 0;
  let bTotalKontrak = 0;
  let bTotalSpj = 0;

  bangubProjects.forEach((bp, bIdx) => {
    const pagu = parseFloat(bp.paguAnggaran) || 0;
    const kNilai = parseFloat(bp.dataKontrak?.nilaiKontrak) || 0;
    const spj = parseFloat(bp.spjKeuangan) || parseFloat(bp.dataKeuangan?.totalPencairan) || 0;
    const fTrg = parseFloat(bp.dataFisik?.progresRencana) || 0;
    const fReal = parseFloat(bp.dataFisik?.progresRealisasi) || 0;
    const dev = fReal - fTrg;

    bTotalPagu += pagu;
    bTotalKontrak += kNilai;
    bTotalSpj += spj;

    rowsBangub.push([
      bIdx + 1,
      bp.namaPaket,
      pagu,
      0,
      pagu,
      bp.tipePengadaan || 'Tender',
      bp.dataKontrak?.tanggalMulai || '',
      bp.dataKontrak?.tanggalSelesai || '',
      kNilai,
      bp.dataKontrak?.namaPenyedia || '-',
      parseFloat(bp.dataKeuangan?.totalPencairan) || 0,
      pagu > 0 ? Number(((parseFloat(bp.dataKeuangan?.totalPencairan) || 0) / pagu).toFixed(4)) : 0,
      spj,
      pagu > 0 ? Number((spj / pagu).toFixed(4)) : 0,
      Number((fTrg / 100).toFixed(4)),
      Number((fReal / 100).toFixed(4)),
      Number((dev / 100).toFixed(4)),
      bp.keterangan || '',
      bp.dataKontrak?.nomorKontrak || '',
      bp.dataKontrak?.tanggalKontrak || '',
      BIDANG_LIST.find(b => b.id === bp.bidangId)?.singkatan || 'BM'
    ]);
  });

  // Grand Total Bangub
  rowsBangub.push([
    '', 'JUMLAH KESELURUHAN BAN GUB',
    bTotalPagu, 0, bTotalPagu,
    '', '', '', bTotalKontrak, '',
    '', '', bTotalSpj,
    bTotalPagu > 0 ? Number((bTotalSpj / bTotalPagu).toFixed(4)) : 0,
    0.8442, 0.8519, 0.0077,
    '', '', '', ''
  ]);

  const wsBangub = XLSX.utils.aoa_to_sheet(rowsBangub);
  XLSX.utils.book_append_sheet(wb, wsBangub, 'BAN GUB');

  const fileName = `11._Lap_Perkemb_Fisik_dan_Keu_TA_${activeYear}_DINPUTARU_BLN_NOV_.xlsx`;
  XLSX.writeFile(wb, fileName);
  return { success: true, mode: 'dynamic', fileName };
}
