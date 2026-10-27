import * as XLSX from 'xlsx';
import { BIDANG_LIST, DEFAULT_TAGS, KECAMATAN_DEMAK } from '../data/constants';
import {
  INITIAL_SIPD_SUB_KEGIATAN,
  INITIAL_SIPD_KEGIATAN,
  INITIAL_SIPD_PROGRAMS,
  matchProjectToSubKegiatan
} from '../data/sipdData';

// Pemetaan sinonim nama kolom header Excel / CSV ke atribut internal
const COLUMN_SYNONYMS = {
  namaPaket: [
    'nama paket', 'nama paket pekerjaan', 'paket pekerjaan', 'nama kegiatan',
    'pekerjaan', 'kegiatan', 'nama proyek', 'paket', 'judul pekerjaan'
  ],
  id: [
    'id', 'kode paket', 'kode pekerjaan', 'kode proyek', 'no paket', 'nomor id'
  ],
  tahunAnggaran: [
    'tahun', 'tahun anggaran', 'ta', 'tahun kegiatan', 'tahun ang'
  ],
  bidangId: [
    'bidang', 'bidang dinas', 'nama bidang', 'kode bidang', 'seksi', 'bagian'
  ],
  kodeSubKegiatan: [
    'kode sub kegiatan', 'kode subkegiatan', 'kode sub-kegiatan', 'sub kegiatan kode', 'kode sipd'
  ],
  namaSubKegiatan: [
    'sub kegiatan', 'sub kegiatan sipd', 'nama sub kegiatan', 'subkegiatan', 'sub-kegiatan', 'nama subkegiatan'
  ],
  namaKegiatan: [
    'kegiatan sipd', 'nama kegiatan sipd'
  ],
  namaProgram: [
    'program sipd', 'nama program sipd'
  ],
  kategoriPekerjaan: [
    'kategori', 'kategori pekerjaan', 'jenis pekerjaan', 'klasifikasi pekerjaan', 'kategori pengadaan'
  ],
  subBagian: [
    'sub bagian', 'subbag', 'sub bidang', 'bagian sekretariat'
  ],
  jenisAnggaran: [
    'jenis anggaran', 'label anggaran', 'anggaran', 'klasifikasi anggaran', 'murni / perubahan', 'sumber pagu'
  ],
  sumberDana: [
    'sumber dana', 'sumber pendanaan', 'asal dana', 'dana'
  ],
  kodeRUP: [
    'kode rup', 'rup', 'kode sirup', 'id rup', 'sirup'
  ],
  tipePengadaan: [
    'tipe pengadaan', 'metode pengadaan', 'jenis pengadaan', 'pengadaan', 'metode pemilihan'
  ],
  paguAnggaran: [
    'pagu', 'pagu anggaran', 'pagu (rp)', 'nilai pagu', 'anggaran pagu', 'pagu rp'
  ],
  hps: [
    'hps', 'hps (rp)', 'harga perkiraan sendiri', 'nilai hps', 'hps rp'
  ],
  kecamatan: [
    'kecamatan', 'kec', 'wilayah kecamatan'
  ],
  desa: [
    'desa', 'kelurahan', 'desa / kelurahan', 'desa/kelurahan', 'kel'
  ],
  lokasi: [
    'lokasi', 'lokasi pekerjaan', 'alamat', 'titik lokasi'
  ],
  latitude: [
    'latitude', 'lat', 'koordinat lat', 'lintang'
  ],
  longitude: [
    'longitude', 'lng', 'long', 'koordinat lng', 'bujur'
  ],
  tags: [
    'tagging', 'tags', 'tag', 'program prioritas', 'label program', 'prioritas'
  ],
  isPublicHighlight: [
    'sorotan publik', 'highlight publik', 'tampil di beranda', 'publik', 'sorotan', 'is public'
  ],
  tahapPraKontrakStatus: [
    'tahap pra-kontrak', 'status pra-kontrak', 'tahapan', 'status pbj', 'tahap pbj', 'proses pengadaan'
  ],
  catatanPraKontrak: [
    'catatan pra-kontrak', 'catatan pbj', 'keterangan pengadaan', 'keterangan pra-kontrak'
  ],
  targetMulaiTender: [
    'target mulai tender', 'tgl mulai tender', 'target tender', 'jadwal mulai pbj'
  ],
  targetSelesaiTender: [
    'target selesai tender', 'tgl selesai tender', 'jadwal selesai pbj'
  ],
  nomorKontrak: [
    'nomor kontrak', 'no kontrak', 'nomor spk', 'no spk', 'surat perjanjian'
  ],
  tanggalKontrak: [
    'tanggal kontrak', 'tgl kontrak', 'tgl spk', 'tanggal spk'
  ],
  nilaiKontrak: [
    'nilai kontrak', 'nilai kontrak (rp)', 'kontrak (rp)', 'kontrak rp', 'harga kontrak'
  ],
  namaPenyedia: [
    'nama penyedia', 'penyedia', 'rekanan', 'pelaksana', 'nama rekanan', 'penyedia jasa', 'cv/pt', 'nama pelaksana'
  ],
  npwpPenyedia: [
    'npwp penyedia', 'npwp rekanan', 'npwp', 'npwp cv/pt'
  ],
  bankPenyedia: [
    'bank penyedia', 'bank rekanan', 'bank', 'nama bank'
  ],
  nomorRekening: [
    'nomor rekening', 'no rekening', 'no rek', 'nomor rekening penyedia'
  ],
  waktuPelaksanaan: [
    'waktu pelaksanaan', 'waktu pelaksanaan (hari)', 'jangka waktu', 'hari kalender', 'durasi (hari)'
  ],
  tanggalMulai: [
    'tanggal mulai', 'tgl mulai', 'spmk', 'tgl spmk', 'tanggal mulai pelaksanaan'
  ],
  tanggalSelesai: [
    'tanggal selesai', 'tgl selesai', 'target pho', 'tanggal selesai pelaksanaan'
  ],
  konsultanPengawas: [
    'konsultan pengawas', 'pengawas', 'konsultan', 'supervisi'
  ],
  progresRencana: [
    'progres rencana', 'progres rencana (%)', 'rencana fisik (%)', 'rencana (%)', 'target fisik (%)'
  ],
  progresRealisasi: [
    'progres realisasi', 'progres realisasi (%)', 'realisasi fisik (%)', 'realisasi (%)', 'fisik saat ini (%)'
  ],
  kendalaLapangan: [
    'kendala lapangan', 'kendala', 'masalah lapangan', 'catatan fisik', 'hambatan'
  ],
  totalPencairan: [
    'total pencairan', 'total pencairan (rp)', 'realisasi keuangan (rp)', 'pencairan keuangan', 'keuangan cair (rp)'
  ],
  spjStatus: [
    'status spj', 'status berkas spj', 'administrasi spj', 'spj keuangan'
  ],
  nomorSPM: [
    'nomor spm', 'no spm', 'spm'
  ],
  catatanVerifikator: [
    'catatan spj', 'catatan verifikator', 'keterangan spj'
  ]
};

// Pemetaan Bidang (Nama/Singkatan ke ID internal)
export const mapBidangToId = (input) => {
  if (!input) return 'bina_marga';
  const val = String(input).trim().toLowerCase();
  if (val.includes('bina marga') || val === 'bm' || val === 'jalan' || val === 'jembatan') {
    return 'bina_marga';
  }
  if (val.includes('cipta karya') || val === 'ck' || val.includes('gedung') || val.includes('permukiman')) {
    return 'cipta_karya';
  }
  if (val.includes('sumber daya air') || val.includes('sda') || val.includes('irigasi') || val.includes('sungai')) {
    return 'sda_bk';
  }
  if (val.includes('tata ruang') || val === 'trp' || val.includes('pertanahan') || val.includes('rdtr')) {
    return 'tata_ruang';
  }
  if (val.includes('sekretariat') || val === 'sek' || val === 'sekr' || val.includes('umum') || val.includes('kepegawaian') || val.includes('keuangan')) {
    return 'sekretariat';
  }
  // Default jika tidak cocok
  return 'bina_marga';
};

// Normalisasi Status Tahap Pra-Kontrak
export const mapTahapPraKontrak = (input) => {
  if (!input) return 'rup';
  const val = String(input).trim().toLowerCase();
  if (val.includes('sirup') || val.includes('rup')) return 'rup';
  if (val.includes('lokasi')) return 'survei_lokasi';
  if (val.includes('harga')) return 'survei_harga';
  if (val.includes('rencana') || val.includes('perencanaan') || val.includes('hps') || val.includes('kak')) return 'perencanaan';
  if (val.includes('kirim') || val.includes('lpse')) return 'kirim_lpse';
  if (val.includes('rpp')) return 'rpp';
  if (val.includes('revisi')) return 'revisi';
  if (val.includes('tayang') || val.includes('pemilihan') || val.includes('lelang') || val.includes('tender')) return 'tayang';
  if (val.includes('re tender') || val.includes('retender')) return 're_tender';
  if (val.includes('sppbj') || val.includes('penetapan')) return 'sppbj';
  if (val.includes('kontrak') || val.includes('spk') || val.includes('pelaksanaan')) return 'kontrak';
  if (val.includes('batal') || val.includes('dibatalkan')) return 'batal';
  return 'rup';
};

// Normalisasi Status SPJ Keuangan
export const mapSpjStatus = (input) => {
  if (!input) return 'belum_masuk';
  const val = String(input).trim().toLowerCase();
  if (val.includes('sp2d') || val.includes('cair')) return 'sudah_sp2d';
  if (val.includes('spm')) return 'sudah_spm';
  if (val.includes('lengkap') || val.includes('setuju')) return 'spj_lengkap';
  if (val.includes('kembali') || val.includes('revisi')) return 'dikembalikan';
  if (val.includes('koreksi') || val.includes('verifikasi')) return 'sudah_koreksi';
  if (val.includes('sudah') || val.includes('masuk') || val.includes('antre')) return 'sudah_masuk';
  return 'belum_masuk';
};

// Parser Angka Aman (menghapus Rp, koma, titik desimal/ribuan format ID)
export const parseCleanNumber = (val) => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).trim();
  // Hilangkan 'Rp', spasi, strip
  let cleaned = str.replace(/[^\d.,-]/g, '');
  if (!cleaned) return 0;

  // Jika format Indonesia e.g. "1.500.000,50"
  if (cleaned.includes('.') && cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.')) {
    // Bisa jadi ribuan 1.500.000 atau desimal 12.5
    const parts = cleaned.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      cleaned = cleaned.replace(/\./g, '');
    }
  } else if (cleaned.includes(',')) {
    cleaned = cleaned.replace(',', '.');
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

// Format tanggal ke YYYY-MM-DD
export const formatCleanDate = (val) => {
  if (!val) return '';
  if (typeof val === 'number') {
    // Excel serial date to JS Date
    try {
      const date = new Date(Math.round((val - 25569) * 86400 * 1000));
      return date.toISOString().slice(0, 10);
    } catch {
      return '';
    }
  }
  const str = String(val).trim();
  if (!str || str === '-') return '';

  // Pola YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  // Pola DD/MM/YYYY atau DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Coba parse dengan Date biasa
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return str;
};

// Deteksi nama kolom internal berdasarkan nama header di file excel
const findInternalField = (rawHeader) => {
  if (!rawHeader) return null;
  const cleanHeader = String(rawHeader).trim().toLowerCase();
  for (const [field, synonyms] of Object.entries(COLUMN_SYNONYMS)) {
    if (synonyms.some((syn) => cleanHeader === syn || cleanHeader.includes(syn))) {
      return field;
    }
  }
  return null;
};

/**
 * Membaca dan memvalidasi file Excel (.xlsx, .xls) atau CSV
 */
export const parseExcelOrCsvFile = async (file, defaultYear = 2026) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        // Ambil sheet pertama atau sheet dengan nama 'TEMPLATE_IMPORT' / 'DATA_PEKERJAAN'
        const sheetName =
          workbook.SheetNames.find((s) => s.toUpperCase().includes('TEMPLATE') || s.toUpperCase().includes('DATA')) ||
          workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          resolve({
            success: false,
            message: 'Lembar kerja (Sheet) di dalam file tidak ditemukan atau kosong.'
          });
          return;
        }

        // Konversi ke format array of objects (baris data)
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

        if (!rawRows || rawRows.length === 0) {
          resolve({
            success: false,
            message: 'File Excel / CSV tidak memiliki baris data untuk diimpor.'
          });
          return;
        }

        // Analisis header kolom baris pertama
        const firstRowKeys = Object.keys(rawRows[0] || {});
        const headerMapping = {};
        firstRowKeys.forEach((key) => {
          const matchedField = findInternalField(key);
          if (matchedField) {
            headerMapping[key] = matchedField;
          }
        });

        const validRows = [];
        const invalidRows = [];
        const warnings = [];

        rawRows.forEach((row, index) => {
          const rowNum = index + 2; // +1 untuk header, +1 untuk 1-indexed

          // Map atribut row
          const item = {};
          Object.keys(row).forEach((k) => {
            const field = headerMapping[k];
            if (field) {
              item[field] = row[k];
            }
          });

          // Fallback: jika 'namaPaket' tidak ditemukan lewat header mapping, coba cek apakah ada kolom nama yang terisi
          if (!item.namaPaket) {
            for (const k of Object.keys(row)) {
              if (k.toLowerCase().includes('paket') || k.toLowerCase().includes('pekerjaan') || k.toLowerCase().includes('nama')) {
                item.namaPaket = String(row[k]).trim();
                break;
              }
            }
          }

          const namaPaket = (item.namaPaket || '').trim();
          if (!namaPaket) {
            // Lewati jika seluruh baris kosong
            const isCompletelyEmpty = Object.values(row).every((v) => !v || String(v).trim() === '');
            if (!isCompletelyEmpty) {
              invalidRows.push({
                rowNumber: rowNum,
                reason: 'Nama Paket Pekerjaan kosong (Wajib diisi)',
                data: row
              });
            }
            return;
          }

          // Tahun Anggaran
          const rawYear = parseCleanNumber(item.tahunAnggaran);
          const tahunAnggaran = rawYear >= 2020 && rawYear <= 2040 ? Math.round(rawYear) : defaultYear;

          // Bidang
          const bidangId = mapBidangToId(item.bidangId);
          const bidangInfo = BIDANG_LIST.find((b) => b.id === bidangId);

          // Pagu & HPS
          const paguAnggaran = parseCleanNumber(item.paguAnggaran);
          const hps = parseCleanNumber(item.hps) || (paguAnggaran > 0 ? Math.round(paguAnggaran * 0.985) : 0);

          // Kontrak
          const nilaiKontrak = parseCleanNumber(item.nilaiKontrak);
          const nomorKontrak = (item.nomorKontrak || '').trim();
          const namaPenyedia = (item.namaPenyedia || '').trim();

          // Status Tahap Pra-Kontrak
          let statusTahap = mapTahapPraKontrak(item.tahapPraKontrakStatus);
          const isBatal = statusTahap === 'batal';
          let isKontrak = !isBatal && (statusTahap === 'kontrak' || nilaiKontrak > 0 || !!nomorKontrak);
          if (isKontrak) {
            statusTahap = 'kontrak';
          }

          // Progres Fisik
          let progresRencana = parseCleanNumber(item.progresRencana);
          let progresRealisasi = parseCleanNumber(item.progresRealisasi);
          if (progresRencana > 100) progresRencana = 100;
          if (progresRealisasi > 100) progresRealisasi = 100;
          if (!isKontrak && !progresRencana && !progresRealisasi) {
            progresRencana = 0;
            progresRealisasi = 0;
          }

          const deviasiFisik = parseFloat((progresRealisasi - progresRencana).toFixed(2));
          let statusDeviasi = 'Aman';
          if (isBatal) {
            statusDeviasi = 'Batal';
          } else if (progresRealisasi >= 100) {
            statusDeviasi = 'Selesai';
          } else if (deviasiFisik < -5.0) {
            statusDeviasi = 'Kritis';
          } else if (deviasiFisik < 0) {
            statusDeviasi = 'Perhatian';
          }

          // Progres Keuangan
          const totalPencairan = parseCleanNumber(item.totalPencairan);
          const persenKeuangan = nilaiKontrak > 0 ? parseFloat(((totalPencairan / nilaiKontrak) * 100).toFixed(2)) : 0;

          // Administrasi SPJ
          const spjStatus = mapSpjStatus(item.spjStatus || (isKontrak && progresRealisasi >= 100 ? 'sudah_sp2d' : 'belum_masuk'));

          // Kategori Pekerjaan & Tipe Pengadaan
          const kategoriPekerjaan = (item.kategoriPekerjaan || '').trim() || (bidangId === 'tata_ruang' ? 'Jakon' : 'Fisik');
          const tipePengadaan = (item.tipePengadaan || '').trim() || 'Tender';

          // Jenis Anggaran (Murni vs APBD-P)
          let jenisAnggaran = 'Murni';
          const jAnggStr = String(item.jenisAnggaran || '').toUpperCase();
          if (jAnggStr.includes('P') || jAnggStr.includes('PERUBAHAN')) {
            jenisAnggaran = 'APBD-P';
          }

          // Tags
          let tags = [];
          if (item.tags) {
            tags = String(item.tags)
              .split(/[,;]/)
              .map((t) => t.trim())
              .filter(Boolean);
          }
          if (tags.length === 0) {
            tags = [jenisAnggaran === 'APBD-P' ? '(APBD-P)' : 'Program Prioritas DINPUTARU'];
          }

          // Sorotan Publik
          let isPublicHighlight = true;
          if (item.isPublicHighlight !== undefined && item.isPublicHighlight !== '') {
            const hStr = String(item.isPublicHighlight).trim().toLowerCase();
            isPublicHighlight = !(hStr === 'tidak' || hStr === 'false' || hStr === '0' || hStr === 'no');
          }

          // ID Pekerjaan
          const customId = (item.id || '').trim();
          const autoCode = bidangInfo?.singkatan || 'DPU';
          const generatedId = customId || `PRJ-${tahunAnggaran}-${autoCode}-${Date.now().toString().slice(-4)}${index + 1}`;

          // Lokasi & Koordinat
          const kecamatan = (item.kecamatan || '').trim() || 'Demak';
          const desa = (item.desa || '').trim();
          const lokasi = (item.lokasi || '').trim() || (desa ? `Desa ${desa}, Kec. ${kecamatan}, Kab. Demak` : `Kecamatan ${kecamatan}, Kab. Demak`);
          const latitude = String(item.latitude || '-6.8942').trim();
          const longitude = String(item.longitude || '110.6385').trim();

          // SIPD Matcher
          const rawKodeSub = (item.kodeSubKegiatan || '').trim();
          const rawNamaSub = (item.namaSubKegiatan || '').trim();
          let matchedSub = null;
          if (rawKodeSub) {
            matchedSub = INITIAL_SIPD_SUB_KEGIATAN.find((s) => s.kodeSubKegiatan === rawKodeSub);
          }
          if (!matchedSub && rawNamaSub) {
            matchedSub = INITIAL_SIPD_SUB_KEGIATAN.find((s) => s.namaSubKegiatan.toLowerCase().includes(rawNamaSub.toLowerCase()));
          }
          if (!matchedSub) {
            matchedSub = matchProjectToSubKegiatan({ namaPaket, bidangId, kategoriPekerjaan }, INITIAL_SIPD_SUB_KEGIATAN);
          }

          const finalProject = {
            id: generatedId,
            tahunAnggaran,
            bidangId,
            programId: matchedSub?.programId || '',
            kegiatanId: matchedSub?.kegiatanId || '',
            subKegiatanId: matchedSub?.id || '',
            kodeSubKegiatan: rawKodeSub || matchedSub?.kodeSubKegiatan || '',
            namaSubKegiatan: rawNamaSub || matchedSub?.namaSubKegiatan || '',
            kategoriPekerjaan,
            subBagian: (item.subBagian || '').trim(),
            namaPaket,
            jenisAnggaran,
            sumberDana: (item.sumberDana || '').trim() || (jenisAnggaran === 'APBD-P' ? 'APBD-P (Perubahan)' : 'APBD Murni (DAU)'),
            kodeRUP: (item.kodeRUP || '').trim() || `RUP-${tahunAnggaran}-${autoCode}-${1000 + index}`,
            tipePengadaan,
            paguAnggaran,
            hps,
            kecamatan,
            desa,
            lokasi,
            latitude,
            longitude,
            tags,
            isPublicHighlight,
            tahapPraKontrak: {
              status: statusTahap,
              targetMulaiTender: formatCleanDate(item.targetMulaiTender),
              targetSelesaiTender: formatCleanDate(item.targetSelesaiTender),
              catatanPraKontrak: (item.catatanPraKontrak || '').trim() || (isBatal ? 'Pekerjaan dibatalkan' : isKontrak ? 'Kontrak telah ditandatangani' : 'Dalam proses pemilihan pengadaan')
            },
            isKontrak,
            dataKontrak: {
              nomorKontrak,
              tanggalKontrak: formatCleanDate(item.tanggalKontrak),
              nilaiKontrak,
              namaPenyedia,
              npwpPenyedia: (item.npwpPenyedia || '').trim(),
              bankPenyedia: (item.bankPenyedia || '').trim() || (namaPenyedia ? 'Bank Jateng Cabang Demak' : ''),
              nomorRekening: (item.nomorRekening || '').trim(),
              waktuPelaksanaan: parseCleanNumber(item.waktuPelaksanaan) || 120,
              tanggalMulai: formatCleanDate(item.tanggalMulai),
              tanggalSelesai: formatCleanDate(item.tanggalSelesai),
              konsultanPengawas: (item.konsultanPengawas || '').trim()
            },
            dataFisik: {
              progresRencana,
              progresRealisasi,
              deviasiFisik,
              statusDeviasi,
              kendalaLapangan: (item.kendalaLapangan || '').trim() || (statusDeviasi === 'Kritis' ? 'Perlu percepatan pengerjaan di lapangan.' : 'Pekerjaan berjalan lancar.'),
              fotoDokumentasi: [],
              mingguanKurvaS: []
            },
            dataKeuangan: {
              terminHistory: totalPencairan > 0 ? [
                {
                  id: `TRM-IMP-${Date.now()}-${index}`,
                  terminKe: 'Pencairan Kumulatif',
                  tanggalSP2D: formatCleanDate(item.tanggalSelesai) || `${tahunAnggaran}-10-20`,
                  nomorSP2D: `SP2D/${tahunAnggaran}/${autoCode}/IMP-${index + 1}`,
                  jumlah: totalPencairan,
                  persentase: persenKeuangan,
                  catatan: 'Hasil impor data spreadsheet'
                }
              ] : [],
              totalPencairan,
              persenKeuangan
            },
            administrasiSPJ: {
              status: spjStatus,
              tanggalMasuk: formatCleanDate(item.tanggalSelesai) || '',
              tanggalKoreksi: '',
              tanggalSPM: '',
              nomorSPM: (item.nomorSPM || '').trim(),
              catatanVerifikator: (item.catatanVerifikator || '').trim(),
              petugasVerifikator: 'Tim Verifikasi SPJ'
            },
            updatedAt: new Date().toLocaleString('id-ID'),
            updatedBy: 'Import Spreadsheet (Excel/CSV)'
          };

          validRows.push(finalProject);
        });

        resolve({
          success: true,
          sheetName,
          totalRows: rawRows.length,
          validCount: validRows.length,
          invalidCount: invalidRows.length,
          validRows,
          invalidRows,
          warnings
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Membuat Workbook Template Excel (.xlsx) dengan Contoh Data dan Lembar Petunjuk
 */
export const createTemplateWorkbook = () => {
  const wb = XLSX.utils.book_new();

  // 1. Data Sampel untuk Sheet TEMPLATE_IMPORT
  const templateHeaders = [
    'Kode Paket (Opsional)',
    'Tahun Anggaran',
    'Bidang Dinas',
    'Kode Sub Kegiatan SIPD (Opsional)',
    'Sub Kegiatan SIPD (Opsional)',
    'Kategori Pekerjaan',
    'Sub Bagian (Khusus Sekretariat)',
    'Nama Paket Pekerjaan (Wajib)',
    'Jenis Anggaran (Murni / APBD-P)',
    'Sumber Dana',
    'Kode RUP',
    'Tipe Pengadaan',
    'Pagu Anggaran (Rp)',
    'HPS (Rp)',
    'Kecamatan',
    'Desa',
    'Lokasi Lengkap',
    'Latitude',
    'Longitude',
    'Tagging Program',
    'Tampil Beranda Publik (Ya/Tidak)',
    'Tahap Pra-Kontrak',
    'Nomor Kontrak / SPK',
    'Tanggal Kontrak (YYYY-MM-DD)',
    'Nilai Kontrak (Rp)',
    'Nama Penyedia (CV / PT)',
    'NPWP Penyedia',
    'Bank Penyedia',
    'Nomor Rekening',
    'Waktu Pelaksanaan (Hari)',
    'Tanggal Mulai (YYYY-MM-DD)',
    'Tanggal Selesai (YYYY-MM-DD)',
    'Konsultan Pengawas',
    'Progres Rencana (%)',
    'Progres Realisasi (%)',
    'Kendala Lapangan',
    'Total Pencairan (Rp)',
    'Status Berkas SPJ',
    'Nomor SPM'
  ];

  const sampleRows = [
    [
      'PRJ-2026-BM-01',
      2026,
      'Bina Marga',
      '1.03.02.2.01.0016',
      'Rekonstruksi Jalan',
      'Fisik',
      '',
      'Peningkatan Jalan Ruas Trengguli - Mijen (Pelebaran & Hotmix AC-WC)',
      'Murni',
      'Dana Alokasi Khusus (DAK) Fisik',
      'RUP-2026-BM-1001',
      'Tender',
      4200000000,
      4120000000,
      'Mijen',
      'Bakung',
      'Desa Bakung, Kec. Mijen, Kab. Demak',
      '-6.8521',
      '110.6712',
      'Program Prioritas Bupati, DAK Fisik',
      'Ya',
      'Kontrak',
      '602.1/101/SP-BM/DINPUTARU/2026',
      '2026-03-10',
      3980000000,
      'PT. Sarana Marga Persada Demak',
      '01.428.910.4-521.000',
      'Bank Jateng Cabang Demak',
      '1002-8829-1029',
      150,
      '2026-03-15',
      '2026-08-15',
      'CV. Rekayasa Teknik Konsultan',
      60,
      62.5,
      'Pekerjaan berjalan lancar sesuai jadwal',
      1194000000,
      'sudah_sp2d',
      'SPM/2026/BM/101'
    ],
    [
      'PRJ-2026-CK-02',
      2026,
      'Cipta Karya',
      '1.03.04.2.01.0006',
      'Pembangunan Bangunan Gedung',
      'Fisik',
      '',
      'Penataan Kawasan Alun-Alun Simpang Enam Demak & Koridor Masjid Agung',
      'Murni',
      'APBD Murni (DAU)',
      'RUP-2026-CK-1002',
      'Tender',
      3850000000,
      3780000000,
      'Demak',
      'Bintoro',
      'Kawasan Simpang Enam Bintoro, Kec. Demak',
      '-6.8942',
      '110.6385',
      'Program Prioritas Bupati',
      'Ya',
      'Kontrak',
      '602.1/102/SP-CK/DINPUTARU/2026',
      '2026-03-12',
      3650000000,
      'CV. Bintoro Bangun Utama',
      '02.512.789.1-521.000',
      'Bank Mandiri Demak',
      '135-00-1928371-2',
      180,
      '2026-03-18',
      '2026-09-18',
      'PT. Griya Rancang Selaras',
      45,
      43.8,
      'Hujan lebat sempat memperlambat pengecoran paving plaza',
      1095000000,
      'sudah_koreksi',
      ''
    ],
    [
      'PRJ-2026-SDA-03',
      2026,
      'SDA',
      '1.03.03.2.01.0003',
      'Pembangunan Tanggul Sungai',
      'Fisik',
      '',
      'Normalisasi Sungai Wulan & Perkuatan Tanggul Kritis Ketanjung Karanganyar',
      'APBD-P',
      'APBD-P (Perubahan)',
      'RUP-2026-SDA-1003',
      'Tender',
      6200000000,
      6100000000,
      'Karanganyar',
      'Ketanjung',
      'Bantaran Sungai Wulan Desa Ketanjung, Kec. Karanganyar',
      '-6.8792',
      '110.7512',
      'Siaga Bencana Banjir, (APBD-P)',
      'Ya',
      'Kontrak',
      '602.1/103/SP-SDA/DINPUTARU/2026',
      '2026-03-20',
      5900000000,
      'PT. Tuntang Graha Mandiri',
      '01.998.223.4-521.000',
      'Bank BRI Kanca Demak',
      '0082-01-002918-50-3',
      150,
      '2026-03-25',
      '2026-08-25',
      'CV. Hidro Rekayasa Semesta',
      55,
      56.0,
      'Elevasi air sungai normal, alat berat beroperasi penuh',
      1770000000,
      'sudah_masuk',
      ''
    ],
    [
      'PRJ-2026-TRP-04',
      2026,
      'Tata Ruang',
      '1.03.08.2.01.0004',
      'Penyusunan Rencana Detail Tata Ruang (RDTR)',
      'Jakon',
      '',
      'Penyusunan Rencana Detail Tata Ruang (RDTR) Koridor Industri Sayung',
      'Murni',
      'APBD Murni (DAU)',
      'RUP-2026-TRP-1004',
      'Pengadaan Langsung',
      195000000,
      192000000,
      'Sayung',
      'Bedono',
      'Kawasan Industri Pantura Desa Bedono, Kec. Sayung',
      '-6.9312',
      '110.5123',
      'Program Prioritas Bupati',
      'Ya',
      'Kontrak',
      '602.1/104/SP-TRP/DINPUTARU/2026',
      '2026-04-05',
      188000000,
      'CV. Pesisir Sejahtera Konsultan',
      '03.112.443.2-521.000',
      'Bank Jateng Capem Mranggen',
      '2019-4412-8819',
      90,
      '2026-04-10',
      '2026-07-10',
      '-',
      75,
      78.0,
      'FGD dan survei lapangan telah selesai dilaksanakan',
      94000000,
      'sudah_spm',
      'SPM/2026/TRP/045'
    ],
    [
      'PRJ-2026-SEK-05',
      2026,
      'Sekretariat',
      '1.03.01.2.06.0002',
      'Penyediaan Sarana Gedung Kantor / Aset',
      'Barang',
      'Sub Bagian Umum & Kepegawaian',
      'Pengadaan Peralatan Studio Pemetaan & Perangkat IT Penunjang DINPUTARU',
      'Murni',
      'APBD Murni (DAU)',
      'RUP-2026-SEK-1005',
      'e-Purchasing',
      250000000,
      245000000,
      'Demak',
      'Bintoro',
      'Gedung Kantor DINPUTARU Kabupaten Demak',
      '-6.8945',
      '110.6380',
      'Pemberdayaan Masyarakat',
      'Tidak',
      'Entri SiRUP',
      '',
      '',
      0,
      '',
      '',
      '',
      '',
      30,
      '',
      '',
      '',
      0,
      0,
      'Proses penyusunan spesifikasi teknis e-Katalog',
      0,
      'belum_masuk',
      ''
    ]
  ];

  const wsTemplate = XLSX.utils.aoa_to_sheet([templateHeaders, ...sampleRows]);

  // Set lebar kolom otomatis agar rapi saat dibuka di Microsoft Excel
  wsTemplate['!cols'] = [
    { wch: 22 }, // Kode Paket
    { wch: 14 }, // Tahun
    { wch: 18 }, // Bidang
    { wch: 20 }, // Kode Sub Kegiatan SIPD
    { wch: 38 }, // Sub Kegiatan SIPD
    { wch: 18 }, // Kategori
    { wch: 28 }, // Sub Bagian
    { wch: 55 }, // Nama Paket
    { wch: 22 }, // Jenis Anggaran
    { wch: 28 }, // Sumber Dana
    { wch: 20 }, // Kode RUP
    { wch: 20 }, // Tipe Pengadaan
    { wch: 20 }, // Pagu
    { wch: 20 }, // HPS
    { wch: 18 }, // Kecamatan
    { wch: 18 }, // Desa
    { wch: 45 }, // Lokasi
    { wch: 14 }, // Lat
    { wch: 14 }, // Long
    { wch: 32 }, // Tagging
    { wch: 20 }, // Sorotan
    { wch: 20 }, // Tahap Pra
    { wch: 32 }, // No Kontrak
    { wch: 18 }, // Tgl Kontrak
    { wch: 20 }, // Nilai Kontrak
    { wch: 34 }, // Rekanan
    { wch: 22 }, // NPWP
    { wch: 26 }, // Bank
    { wch: 22 }, // Rekening
    { wch: 16 }, // Waktu
    { wch: 18 }, // Tgl Mulai
    { wch: 18 }, // Tgl Selesai
    { wch: 30 }, // Pengawas
    { wch: 16 }, // Rencana
    { wch: 16 }, // Realisasi
    { wch: 45 }, // Kendala
    { wch: 20 }, // Pencairan
    { wch: 22 }, // Status SPJ
    { wch: 22 }  // No SPM
  ];

  XLSX.utils.book_append_sheet(wb, wsTemplate, 'TEMPLATE_IMPORT');

  // 2. Sheet PETUNJUK_PENGISIAN
  const guideHeaders = ['Kolom Template', 'Kategori', 'Keterangan & Nilai yang Diizinkan', 'Contoh Nilai'];
  const guideRows = [
    ['Nama Paket Pekerjaan', 'Wajib', 'Nama lengkap paket pekerjaan/kegiatan pembangunan.', 'Peningkatan Jalan Ruas Trengguli - Mijen'],
    ['Tahun Anggaran', 'Opsional', 'Tahun anggaran 4 digit (misal: 2026). Jika dikosongkan memakai tahun aktif sistem.', '2026'],
    ['Bidang Dinas', 'Wajib', 'Pilihan: Bina Marga, Cipta Karya, SDA (SDA-BK), Tata Ruang, Sekretariat.', 'Bina Marga'],
    ['Kode Sub Kegiatan SIPD', 'Opsional', 'Kode Sub Kegiatan SIPD Kemendagri RI (misal: 1.03.02.2.01.0016).', '1.03.02.2.01.0016'],
    ['Sub Kegiatan SIPD', 'Opsional', 'Nama Sub Kegiatan SIPD. Jika kosong, sistem otomatis mencocokkan.', 'Rekonstruksi Jalan'],
    ['Kategori Pekerjaan', 'Opsional', 'Pilihan: Fisik, Jakon, Barang, Jasa Lainnya, Swakelola (Default: Fisik).', 'Fisik'],
    ['Sub Bagian', 'Opsional', 'Khusus Bidang Sekretariat: Sub Bagian Umum & Kepegawaian ATAU Sub Bagian Program & Keuangan.', 'Sub Bagian Umum & Kepegawaian'],
    ['Jenis Anggaran', 'Opsional', 'Pilihan: Murni ATAU APBD-P (Perubahan). Default: Murni.', 'Murni'],
    ['Sumber Dana', 'Opsional', 'APBD Murni (DAU), DAK Fisik, DBH, Banprov, APBD-P (Perubahan), DIF, dll.', 'Dana Alokasi Khusus (DAK) Fisik'],
    ['Tipe Pengadaan', 'Opsional', 'Pilihan: Tender, Pengadaan Langsung, Minikom, Seleksi, e-Purchasing, Swakelola.', 'Tender'],
    ['Pagu Anggaran (Rp)', 'Opsional', 'Angka nominal tanpa titik/koma ribuan atau format angka Excel.', '4200000000'],
    ['Kecamatan', 'Opsional', 'Pilihan 14 Kecamatan di Kab. Demak: Demak, Sayung, Karanganyar, Mijen, Bonang, Wedung, dll.', 'Mijen'],
    ['Desa', 'Opsional', 'Nama desa/kelurahan lokasi pekerjaan.', 'Bakung'],
    ['Tagging Program', 'Opsional', 'Label program prioritas dipisahkan koma: Program Prioritas Bupati, DBHCHT, DAK, Kemiskinan, dll.', 'Program Prioritas Bupati, DAK Fisik'],
    ['Tampil Beranda Publik', 'Opsional', 'Pilihan: Ya atau Tidak. Jika "Ya", paket ini disorot di Landing Page publik.', 'Ya'],
    ['Tahap Pra-Kontrak', 'Opsional', 'Pilihan: Entri SiRUP, Survei Lokasi, Perencanaan, Tayang, SPPBJ, Kontrak, Batal.', 'Kontrak'],
    ['Nomor Kontrak / SPK', 'Opsional', 'Nomor surat perjanjian / kontrak kerja.', '602.1/101/SP-BM/DINPUTARU/2026'],
    ['Nilai Kontrak (Rp)', 'Opsional', 'Nomor kontrak riil yang disepakati dengan rekanan.', '3980000000'],
    ['Nama Penyedia (CV / PT)', 'Opsional', 'Nama perusahaan/badan usaha pemenang pengadaan.', 'PT. Sarana Marga Persada Demak'],
    ['Progres Rencana (%)', 'Opsional', 'Persentase jadwal rencana kerja kumulatif (0 s/d 100).', '60'],
    ['Progres Realisasi (%)', 'Opsional', 'Persentase kemajuan fisik lapangan riil (0 s/d 100).', '62.5'],
    ['Total Pencairan (Rp)', 'Opsional', 'Jumlah kumulatif SP2D yang telah dicairkan.', '1194000000'],
    ['Status Berkas SPJ', 'Opsional', 'Pilihan: belum_masuk, sudah_masuk, sudah_koreksi, dikembalikan, spj_lengkap, sudah_spm, sudah_sp2d.', 'sudah_sp2d']
  ];

  const wsGuide = XLSX.utils.aoa_to_sheet([guideHeaders, ...guideRows]);
  wsGuide['!cols'] = [
    { wch: 25 },
    { wch: 14 },
    { wch: 55 },
    { wch: 35 }
  ];
  XLSX.utils.book_append_sheet(wb, wsGuide, 'PETUNJUK_PENGISIAN');

  return wb;
};

/**
 * Unduh Template Excel (.xlsx)
 */
export const downloadExcelTemplate = () => {
  const wb = createTemplateWorkbook();
  XLSX.writeFile(wb, `Template_Import_Pekerjaan_DINPUTARU_${new Date().getFullYear()}.xlsx`);
};

/**
 * Unduh Template CSV (.csv)
 */
export const downloadCsvTemplate = () => {
  const wb = createTemplateWorkbook();
  const ws = wb.Sheets['TEMPLATE_IMPORT'];
  const csvContent = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Template_Import_Pekerjaan_DINPUTARU_${new Date().getFullYear()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data pekerjaan yang ada ke file Excel (.xlsx)
 */
export const exportProjectsToExcel = (projects, activeYear = 2026, filename = null) => {
  const headers = [
    'No',
    'Kode Paket',
    'Tahun Anggaran',
    'Bidang Dinas',
    'Program SIPD',
    'Kegiatan SIPD',
    'Kode Sub Kegiatan',
    'Sub Kegiatan SIPD',
    'Kategori Pekerjaan',
    'Sub Bagian',
    'Nama Paket Pekerjaan',
    'Jenis Anggaran',
    'Sumber Dana',
    'Kode RUP',
    'Tipe Pengadaan',
    'Pagu Anggaran (Rp)',
    'HPS (Rp)',
    'Kecamatan',
    'Desa',
    'Lokasi Lengkap',
    'Latitude',
    'Longitude',
    'Tagging Program',
    'Sorotan Publik',
    'Status Tahap Pra-Kontrak',
    'Nomor Kontrak',
    'Tanggal Kontrak',
    'Nilai Kontrak (Rp)',
    'Penyedia Jasa (CV/PT)',
    'NPWP Penyedia',
    'Bank Rekanan',
    'Nomor Rekening',
    'Waktu Pelaksanaan (Hari)',
    'Tanggal Mulai',
    'Tanggal Selesai',
    'Konsultan Pengawas',
    'Progres Rencana (%)',
    'Progres Realisasi (%)',
    'Deviasi Fisik (%)',
    'Status Deviasi',
    'Kendala Lapangan',
    'Total Pencairan (Rp)',
    'Persen Keuangan (%)',
    'Sisa Anggaran (Rp)',
    'Status Administrasi SPJ',
    'Nomor SPM',
    'Tanggal Update Terakhir',
    'Petugas Pembaru'
  ];

  const rows = projects.map((p, idx) => {
    const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId)?.nama || p.bidangId;
    const kNilai = parseFloat(p.dataKontrak?.nilaiKontrak || 0);
    const kCair = parseFloat(p.dataKeuangan?.totalPencairan || 0);
    const kSisa = Math.max(0, kNilai - kCair);

    const progNama = p.namaProgram || (INITIAL_SIPD_PROGRAMS.find((pr) => pr.id === p.programId)?.namaProgram || '');
    const kegNama = p.namaKegiatan || (INITIAL_SIPD_KEGIATAN.find((k) => k.id === p.kegiatanId)?.namaKegiatan || '');
    const subObj = INITIAL_SIPD_SUB_KEGIATAN.find((s) => s.id === p.subKegiatanId);
    const subKode = p.kodeSubKegiatan || subObj?.kodeSubKegiatan || '';
    const subNama = p.namaSubKegiatan || subObj?.namaSubKegiatan || '';

    return [
      idx + 1,
      p.id || '',
      p.tahunAnggaran || activeYear,
      bidang,
      progNama,
      kegNama,
      subKode,
      subNama,
      p.kategoriPekerjaan || 'Fisik',
      p.subBagian || '',
      p.namaPaket || '',
      (p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? 'APBD-P' : 'Murni',
      p.sumberDana || '',
      p.kodeRUP || '',
      p.tipePengadaan || '',
      parseFloat(p.paguAnggaran || 0),
      parseFloat(p.hps || 0),
      p.kecamatan || '',
      p.desa || '',
      p.lokasi || '',
      p.latitude || '',
      p.longitude || '',
      (p.tags || []).join(', '),
      p.isPublicHighlight ? 'Ya' : 'Tidak',
      p.tahapPraKontrak?.status || '',
      p.dataKontrak?.nomorKontrak || '',
      p.dataKontrak?.tanggalKontrak || '',
      kNilai,
      p.dataKontrak?.namaPenyedia || '',
      p.dataKontrak?.npwpPenyedia || '',
      p.dataKontrak?.bankPenyedia || '',
      p.dataKontrak?.nomorRekening || '',
      p.dataKontrak?.waktuPelaksanaan || 0,
      p.dataKontrak?.tanggalMulai || '',
      p.dataKontrak?.tanggalSelesai || '',
      p.dataKontrak?.konsultanPengawas || '',
      parseFloat(p.dataFisik?.progresRencana || 0),
      parseFloat(p.dataFisik?.progresRealisasi || 0),
      parseFloat(p.dataFisik?.deviasiFisik || 0),
      p.dataFisik?.statusDeviasi || 'Aman',
      p.dataFisik?.kendalaLapangan || '',
      kCair,
      parseFloat(p.dataKeuangan?.persenKeuangan || 0),
      kSisa,
      p.administrasiSPJ?.status || 'belum_masuk',
      p.administrasiSPJ?.nomorSPM || '',
      p.updatedAt || '',
      p.updatedBy || ''
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = [
    { wch: 6 },  // No
    { wch: 22 }, // Kode Paket
    { wch: 14 }, // Tahun
    { wch: 26 }, // Bidang
    { wch: 32 }, // Program SIPD
    { wch: 36 }, // Kegiatan SIPD
    { wch: 20 }, // Kode Sub Kegiatan
    { wch: 42 }, // Sub Kegiatan SIPD
    { wch: 16 }, // Kategori
    { wch: 26 }, // Sub Bagian
    { wch: 50 }, // Nama Paket
    { wch: 16 }, // Jenis Anggaran
    { wch: 24 }, // Sumber Dana
    { wch: 20 }, // Kode RUP
    { wch: 18 }, // Tipe Pengadaan
    { wch: 18 }, // Pagu
    { wch: 18 }, // HPS
    { wch: 16 }, // Kecamatan
    { wch: 16 }, // Desa
    { wch: 38 }, // Lokasi
    { wch: 12 }, // Lat
    { wch: 12 }, // Long
    { wch: 28 }, // Tagging
    { wch: 14 }, // Sorotan
    { wch: 22 }, // Tahap Pra
    { wch: 30 }, // No Kontrak
    { wch: 16 }, // Tgl Kontrak
    { wch: 18 }, // Nilai Kontrak
    { wch: 32 }, // Rekanan
    { wch: 20 }, // NPWP
    { wch: 24 }, // Bank
    { wch: 20 }, // Rekening
    { wch: 14 }, // Waktu
    { wch: 16 }, // Tgl Mulai
    { wch: 16 }, // Tgl Selesai
    { wch: 28 }, // Pengawas
    { wch: 14 }, // Rencana
    { wch: 14 }, // Realisasi
    { wch: 14 }, // Deviasi
    { wch: 14 }, // Status Deviasi
    { wch: 40 }, // Kendala
    { wch: 18 }, // Total Cair
    { wch: 16 }, // Persen Keuangan
    { wch: 18 }, // Sisa Anggaran
    { wch: 22 }, // Status SPJ
    { wch: 22 }, // No SPM
    { wch: 20 }, // Update
    { wch: 20 }  // Petugas
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `DATA_PEKERJAAN_${activeYear}`);

  const defaultFilename = filename || `Data_Pekerjaan_DINPUTARU_TA_${activeYear}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, defaultFilename);
};

/**
 * Export data pekerjaan yang ada ke file CSV (.csv)
 */
export const exportProjectsToCsv = (projects, activeYear = 2026, filename = null) => {
  const headers = [
    'No',
    'Kode Paket',
    'Tahun Anggaran',
    'Bidang Dinas',
    'Kode Sub Kegiatan',
    'Sub Kegiatan SIPD',
    'Kategori Pekerjaan',
    'Nama Paket Pekerjaan',
    'Jenis Anggaran',
    'Sumber Dana',
    'Tipe Pengadaan',
    'Pagu Anggaran (Rp)',
    'Kecamatan',
    'Desa',
    'Nomor Kontrak',
    'Nilai Kontrak (Rp)',
    'Penyedia Jasa (CV/PT)',
    'Progres Rencana (%)',
    'Progres Realisasi (%)',
    'Deviasi Fisik (%)',
    'Status Deviasi',
    'Total Pencairan (Rp)',
    'Persen Keuangan (%)',
    'Status Administrasi SPJ'
  ];

  const rows = projects.map((p, idx) => {
    const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId)?.singkatan || p.bidangId;
    const cleanStr = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
    const subObj = INITIAL_SIPD_SUB_KEGIATAN.find((s) => s.id === p.subKegiatanId);
    const subKode = p.kodeSubKegiatan || subObj?.kodeSubKegiatan || '';
    const subNama = p.namaSubKegiatan || subObj?.namaSubKegiatan || '';

    return [
      idx + 1,
      cleanStr(p.id),
      p.tahunAnggaran || activeYear,
      cleanStr(bidang),
      cleanStr(subKode),
      cleanStr(subNama),
      cleanStr(p.kategoriPekerjaan || 'Fisik'),
      cleanStr(p.namaPaket),
      cleanStr((p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? 'APBD-P' : 'Murni'),
      cleanStr(p.sumberDana),
      cleanStr(p.tipePengadaan),
      parseFloat(p.paguAnggaran || 0),
      cleanStr(p.kecamatan),
      cleanStr(p.desa),
      cleanStr(p.dataKontrak?.nomorKontrak),
      parseFloat(p.dataKontrak?.nilaiKontrak || 0),
      cleanStr(p.dataKontrak?.namaPenyedia),
      parseFloat(p.dataFisik?.progresRencana || 0),
      parseFloat(p.dataFisik?.progresRealisasi || 0),
      parseFloat(p.dataFisik?.deviasiFisik || 0),
      cleanStr(p.dataFisik?.statusDeviasi || 'Aman'),
      parseFloat(p.dataKeuangan?.totalPencairan || 0),
      parseFloat(p.dataKeuangan?.persenKeuangan || 0),
      cleanStr(p.administrasiSPJ?.status || 'belum_masuk')
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `Data_Pekerjaan_DINPUTARU_TA_${activeYear}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
