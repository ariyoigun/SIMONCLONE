/**
 * Data Dummy 80 Pekerjaan Kabupaten Demak (2024 - 2027)
 * 4 Bidang x 5 Pekerjaan per Tahun = 80 Paket Lengkap
 * Dilengkapi kolom kecamatan, desa, jenisAnggaran (Murni / Perubahan), koordinat, Kurva S, dan Administrasi SPJ.
 */

const DEMAK_PACKAGES_TEMPLATE = [
  // --- BINA MARGA (5 template lokasi khas Demak) ---
  {
    bidangId: 'bina_marga',
    kategoriPekerjaan: 'Fisik',
    subBagian: '',
    baseNames: [
      'Peningkatan Jalan Poros Ruas Trengguli - Mijen (Hotmix & Pelebaran Bahu)',
      'Rekonstruksi Jalan Sayung - Morosari (Peninggian Rigid Pavement Anti Rob)',
      'Peningkatan Jalan Ruas Karanganyar - Gajah (Overlay AC-WC & Saluran)',
      'Pembangunan Jembatan Kracaan Penghubung Dempet - Kebonagung',
      'Pemeliharaan Berkala Jalan Ruas Buyaran - Guntur (Rigid & Aspal Hotmix)'
    ],
    kecamatans: ['Mijen', 'Sayung', 'Karanganyar', 'Dempet', 'Guntur'],
    desas: ['Bakung', 'Sriwulan', 'Ketanjung', 'Kedungori', 'Bumiharjo'],
    coords: [
      { lat: '-6.8521', lng: '110.6712' },
      { lat: '-6.9241', lng: '110.4932' },
      { lat: '-6.8834', lng: '110.7421' },
      { lat: '-6.9421', lng: '110.6934' },
      { lat: '-6.9741', lng: '110.5821' }
    ],
    tipePengadaan: ['Tender', 'Tender', 'Minikom', 'Tender', 'Pengadaan Langsung'],
    paguBase: [4200000000, 5800000000, 3100000000, 7500000000, 195000000]
  },

  // --- CIPTA KARYA (5 template lokasi khas Demak) ---
  {
    bidangId: 'cipta_karya',
    kategoriPekerjaan: 'Fisik',
    subBagian: '',
    baseNames: [
      'Penataan Kawasan Alun-Alun Simpang Enam Demak & Koridor Masjid Agung',
      'Pembangunan Jaringan Distribusi Air Minum SPAM Ibukota Kec. Wedung',
      'Pembangunan Sistem Pengolahan Air Limbah Domestik (SPALD-T) Bintoro',
      'Rehabilitasi Fasilitas Gedung DINPUTARU & Bangunan Pelayanan Publik',
      'Pembangunan TPS3R Sirkular Ekonomi & Pengolahan Sampah Terpadu Betokan'
    ],
    kecamatans: ['Demak', 'Wedung', 'Demak', 'Demak', 'Demak'],
    desas: ['Bintoro', 'Babalan', 'Bintoro', 'Bintoro', 'Betokan'],
    coords: [
      { lat: '-6.8942', lng: '110.6385' },
      { lat: '-6.7921', lng: '110.5732' },
      { lat: '-6.8912', lng: '110.6421' },
      { lat: '-6.8965', lng: '110.6354' },
      { lat: '-6.9032', lng: '110.6512' }
    ],
    tipePengadaan: ['Tender', 'Tender', 'Minikom', 'Pengadaan Langsung', 'Minikom'],
    paguBase: [3850000000, 4600000000, 1750000000, 185000000, 850000000]
  },

  // --- SUMBER DAYA AIR & BINA KONSTRUKSI (5 template lokasi khas Demak) ---
  {
    bidangId: 'sda_bk',
    kategoriPekerjaan: 'Fisik',
    subBagian: '',
    baseNames: [
      'Normalisasi Sungai Wulan & Perkuatan Tanggul Kritis Ketanjung Karanganyar',
      'Pembangunan Embung Konservasi Air Tawar Pesisir Desa Timbulsloko',
      'Rehabilitasi Jaringan Irigasi D.I. Klambu Kiri Saluran Sekunder Dempet',
      'Pembangunan Tanggul & Pengendalian Banjir Sungai Tuntang Lama Guntur',
      'Peningkatan Saluran Drainase Perkotaan & Kolam Retensi Morodemak'
    ],
    kecamatans: ['Karanganyar', 'Sayung', 'Dempet', 'Guntur', 'Bonang'],
    desas: ['Ketanjung', 'Timbulsloko', 'Dempet', 'Guntur', 'Morodemak'],
    coords: [
      { lat: '-6.8792', lng: '110.7512' },
      { lat: '-6.9123', lng: '110.4812' },
      { lat: '-6.9382', lng: '110.6841' },
      { lat: '-6.9821', lng: '110.5932' },
      { lat: '-6.8321', lng: '110.5421' }
    ],
    tipePengadaan: ['Tender', 'Tender', 'Pengadaan Langsung', 'Minikom', 'Tender'],
    paguBase: [6200000000, 2900000000, 1450000000, 3700000000, 190000000]
  },

  // --- TATA RUANG & PERTANAHAN (5 template lokasi khas Demak) ---
  {
    bidangId: 'tata_ruang',
    kategoriPekerjaan: 'Jakon',
    subBagian: '',
    baseNames: [
      'Penyusunan Rencana Detail Tata Ruang (RDTR) Koridor Industri Sayung',
      'Kajian Teknis Tata Ruang Tanggul Laut Mitigasi Rob Pesisir Morodemak',
      'Penyusunan Dokumen KKPR & Pemetaan GIS Kawasan Pertumbuhan Mranggen',
      'Fasilitasi Pengukuran Teknis Pertanahan Jalan & Saluran Irigasi',
      'Kajian Evaluasi Daya Dukung Lingkungan RTRW Kabupaten Demak'
    ],
    kecamatans: ['Sayung', 'Bonang', 'Mranggen', 'Wonosalam', 'Karangtengah'],
    desas: ['Bedono', 'Morodemak', 'Batursari', 'Jogoloyo', 'Dukun'],
    coords: [
      { lat: '-6.9312', lng: '110.5123' },
      { lat: '-6.8291', lng: '110.5512' },
      { lat: '-7.0341', lng: '110.5214' },
      { lat: '-6.9152', lng: '110.6621' },
      { lat: '-6.9121', lng: '110.6123' }
    ],
    tipePengadaan: ['Seleksi', 'Pengadaan Langsung', 'Seleksi', 'Pengadaan Langsung', 'Seleksi'],
    paguBase: [950000000, 4500000000, 480000000, 190000000, 350000000]
  },

  // --- SEKRETARIAT (Sub Bagian hanya untuk Sekretariat) ---
  {
    bidangId: 'sekretariat',
    kategoriPekerjaan: 'Barang',
    subBagian: 'Sub Bagian Umum & Kepegawaian',
    baseNames: [
      'Pengadaan Server Database & Integrasi Sistem Jaringan SIMON SATUPUTARU',
      'Pengadaan Kendaraan Operasional Lapangan Pengawasan Infrastruktur Demak',
      'Penyusunan Dokumen Renja, RKT & LAKIP Akuntabilitas Kinerja DINPUTARU',
      'Pemeliharaan Rutin Sarana Prasarana Gedung Pelayanan DINPUTARU',
      'Pengadaan Perlengkapan Kantor & ATK Pendukung Administrasi Kedinasan'
    ],
    subBagians: [
      'Sub Bagian Umum & Kepegawaian',
      'Sub Bagian Umum & Kepegawaian',
      'Sub Bagian Program & Keuangan',
      'Sub Bagian Umum & Kepegawaian',
      'Sub Bagian Program & Keuangan'
    ],
    kecamatans: ['Demak', 'Demak', 'Demak', 'Demak', 'Demak'],
    desas: ['Bintoro', 'Bintoro', 'Bintoro', 'Bintoro', 'Bintoro'],
    coords: [
      { lat: '-6.8945', lng: '110.6380' },
      { lat: '-6.8945', lng: '110.6380' },
      { lat: '-6.8945', lng: '110.6380' },
      { lat: '-6.8945', lng: '110.6380' },
      { lat: '-6.8945', lng: '110.6380' }
    ],
    tipePengadaan: ['e-Purchasing', 'e-Purchasing', 'Pengadaan Langsung', 'Pengadaan Langsung', 'e-Purchasing'],
    paguBase: [450000000, 780000000, 120000000, 185000000, 95000000]
  }
];

const REKANAN_LIST = [
  { nama: 'PT. Sarana Marga Persada Demak', bank: 'Bank Jateng Cabang Demak', rek: '1002-8829-1029' },
  { nama: 'CV. Bintoro Bangun Utama', bank: 'Bank Mandiri Demak', rek: '135-00-1928371-2' },
  { nama: 'PT. Tuntang Graha Mandiri', bank: 'Bank BRI Kanca Demak', rek: '0082-01-002918-50-3' },
  { nama: 'CV. Pesisir Sejahtera Konstruksi', bank: 'Bank Jateng Capem Mranggen', rek: '2019-4412-8819' },
  { nama: 'PT. Surya Graha Kalicilik', bank: 'Bank BNI Demak', rek: '0829-1120-99' },
  { nama: 'CV. Tirta Wulan Mandiri', bank: 'Bank Jateng Cabang Demak', rek: '1002-9921-5521' }
];

export const generateDemakProjects = () => {
  const projects = [];
  const years = [2024, 2025, 2026, 2027];

  years.forEach((year) => {
    DEMAK_PACKAGES_TEMPLATE.forEach((group) => {
      for (let i = 0; i < 5; i++) {
        const idIndex = String(i + 1).padStart(2, '0');
        const codePrefix =
          group.bidangId === 'bina_marga'
            ? 'BM'
            : group.bidangId === 'cipta_karya'
            ? 'CK'
            : group.bidangId === 'sda_bk'
            ? 'SDA'
            : group.bidangId === 'tata_ruang'
            ? 'TRP'
            : 'SEK';
        const projectId = `PRJ-${year}-${codePrefix}-${idIndex}`;

        // Jenis Anggaran: 3 Murni, 2 APBD-P per bidang per tahun
        const jenisAnggaran = i < 3 ? 'Murni' : 'APBD-P';
        const sumberDana =
          jenisAnggaran === 'APBD-P'
            ? 'APBD-P (Perubahan)'
            : i === 0
            ? 'Dana Alokasi Khusus (DAK) Fisik'
            : 'APBD Murni (DAU)';

        const pagu = group.paguBase[i] + (year - 2024) * 80000000;
        const hps = Math.round(pagu * 0.985);
        const nilaiKontrak = Math.round(hps * 0.965);
        const rekanan = REKANAN_LIST[(i + year) % REKANAN_LIST.length];

        const kec = group.kecamatans[i];
        const desa = group.desas[i];
        const coord = group.coords[i];
        const namaPaket = `${group.baseNames[i]} TA ${year}`;
        const lokasi = `Desa ${desa}, Kec. ${kec}, Kab. Demak`;

        // Status per year logic
        let isKontrak = true;
        let tahapPraKontrakStatus = 'kontrak';
        let progresRencana = 100;
        let progresRealisasi = 100;
        let statusDeviasi = 'Selesai';
        let spjStatus = 'sudah_sp2d';
        let terminHistory = [];

        if (year === 2024) {
          // 2024: All finished, 100% physically & financially paid
          isKontrak = true;
          tahapPraKontrakStatus = 'kontrak';
          progresRencana = 100;
          progresRealisasi = 100;
          statusDeviasi = 'Selesai';
          spjStatus = 'sudah_sp2d';
          terminHistory = [
            { id: `TRM-${year}-${i}-1`, terminKe: 'Uang Muka (30%)', tanggalSP2D: `${year}-03-15`, nomorSP2D: `SP2D/${year}/${codePrefix}/012`, jumlah: Math.round(nilaiKontrak * 0.3), persentase: 30, catatan: 'Sesuai jaminan uang muka' },
            { id: `TRM-${year}-${i}-2`, terminKe: 'Termin I (50%)', tanggalSP2D: `${year}-06-20`, nomorSP2D: `SP2D/${year}/${codePrefix}/089`, jumlah: Math.round(nilaiKontrak * 0.4), persentase: 40, catatan: 'Fisik 60%' },
            { id: `TRM-${year}-${i}-3`, terminKe: 'Pelunasan (100%)', tanggalSP2D: `${year}-11-10`, nomorSP2D: `SP2D/${year}/${codePrefix}/245`, jumlah: Math.round(nilaiKontrak * 0.3), persentase: 30, catatan: 'Serah terima PHO 100%' }
          ];
        } else if (year === 2025) {
          // 2025: Near completion (85% to 100%), some in final SPJ
          isKontrak = true;
          tahapPraKontrakStatus = 'kontrak';
          if (i === 4) {
            // Selesai 100%
            progresRencana = 100;
            progresRealisasi = 100;
            statusDeviasi = 'Selesai';
            spjStatus = 'sudah_sp2d';
            terminHistory = [
              { id: `TRM-${year}-${i}-1`, terminKe: 'Uang Muka (30%)', tanggalSP2D: `${year}-03-20`, nomorSP2D: `SP2D/${year}/${codePrefix}/020`, jumlah: Math.round(nilaiKontrak * 0.3), persentase: 30, catatan: 'Uang Muka' },
              { id: `TRM-${year}-${i}-2`, terminKe: 'Pelunasan (100%)', tanggalSP2D: `${year}-10-18`, nomorSP2D: `SP2D/${year}/${codePrefix}/301`, jumlah: Math.round(nilaiKontrak * 0.7), persentase: 70, catatan: 'Pelunasan PHO' }
            ];
          } else if (i === 1) {
            // Perhatian (deviasi -2%)
            progresRencana = 88.0;
            progresRealisasi = 86.2;
            statusDeviasi = 'Perhatian';
            spjStatus = 'sudah_koreksi';
            terminHistory = [
              { id: `TRM-${year}-${i}-1`, terminKe: 'Uang Muka (30%)', tanggalSP2D: `${year}-03-18`, nomorSP2D: `SP2D/${year}/${codePrefix}/018`, jumlah: Math.round(nilaiKontrak * 0.3), persentase: 30, catatan: 'Uang Muka' },
              { id: `TRM-${year}-${i}-2`, terminKe: 'Termin I (50%)', tanggalSP2D: `${year}-07-12`, nomorSP2D: `SP2D/${year}/${codePrefix}/115`, jumlah: Math.round(nilaiKontrak * 0.35), persentase: 35, catatan: 'Termin I' }
            ];
          } else {
            // Aman
            progresRencana = 92.0;
            progresRealisasi = 94.5;
            statusDeviasi = 'Aman';
            spjStatus = 'sudah_spm';
            terminHistory = [
              { id: `TRM-${year}-${i}-1`, terminKe: 'Uang Muka (30%)', tanggalSP2D: `${year}-03-12`, nomorSP2D: `SP2D/${year}/${codePrefix}/011`, jumlah: Math.round(nilaiKontrak * 0.3), persentase: 30, catatan: 'Uang Muka' },
              { id: `TRM-${year}-${i}-2`, terminKe: 'Termin I (70%)', tanggalSP2D: `${year}-08-25`, nomorSP2D: `SP2D/${year}/${codePrefix}/190`, jumlah: Math.round(nilaiKontrak * 0.4), persentase: 40, catatan: 'Termin I' }
            ];
          }
        } else if (year === 2026) {
          // 2026: Active current year! Mixed stages (PBJ, Contract, Physical progress)
          if (i === 0) {
            // Kontrak berjalan aman (fisik 62%)
            isKontrak = true;
            tahapPraKontrakStatus = 'kontrak';
            progresRencana = 60.0;
            progresRealisasi = 64.5;
            statusDeviasi = 'Aman';
            spjStatus = 'sudah_masuk';
            terminHistory = [
              { id: `TRM-${year}-${i}-1`, terminKe: 'Uang Muka (30%)', tanggalSP2D: `${year}-03-10`, nomorSP2D: `SP2D/${year}/${codePrefix}/008`, jumlah: Math.round(nilaiKontrak * 0.3), persentase: 30, catatan: 'Uang Muka' }
            ];
          } else if (i === 1) {
            // Kontrak kritis keterlambatan cuaca/rob (fisik 38% vs 47%)
            isKontrak = true;
            tahapPraKontrakStatus = 'kontrak';
            progresRencana = 48.0;
            progresRealisasi = 40.5;
            statusDeviasi = 'Kritis';
            spjStatus = 'dikembalikan';
            terminHistory = [
              { id: `TRM-${year}-${i}-1`, terminKe: 'Uang Muka (30%)', tanggalSP2D: `${year}-04-02`, nomorSP2D: `SP2D/${year}/${codePrefix}/024`, jumlah: Math.round(nilaiKontrak * 0.3), persentase: 30, catatan: 'Uang Muka' }
            ];
          } else if (i === 2) {
            // Baru SPMK / Kontrak Awal (fisik 18%)
            isKontrak = true;
            tahapPraKontrakStatus = 'kontrak';
            progresRencana = 15.0;
            progresRealisasi = 16.5;
            statusDeviasi = 'Aman';
            spjStatus = 'belum_masuk';
            terminHistory = [
              { id: `TRM-${year}-${i}-1`, terminKe: 'Uang Muka (30%)', tanggalSP2D: `${year}-05-14`, nomorSP2D: `SP2D/${year}/${codePrefix}/045`, jumlah: Math.round(nilaiKontrak * 0.3), persentase: 30, catatan: 'Pencairan DP 30%' }
            ];
          } else if (i === 3) {
            // Pra-kontrak tahap Tayang LPSE
            isKontrak = false;
            tahapPraKontrakStatus = 'tayang';
            progresRencana = 0;
            progresRealisasi = 0;
            statusDeviasi = 'Aman';
            spjStatus = 'belum_masuk';
            terminHistory = [];
          } else {
            // Pra-kontrak: contoh satu paket Batal di Tata Ruang, lainnya Perencanaan
            isKontrak = false;
            tahapPraKontrakStatus = group.bidangId === 'tata_ruang' ? 'batal' : 'perencanaan';
            progresRencana = 0;
            progresRealisasi = 0;
            statusDeviasi = tahapPraKontrakStatus === 'batal' ? 'Batal' : 'Aman';
            spjStatus = 'belum_masuk';
            terminHistory = [];
          }
        } else if (year === 2027) {
          // 2027: Planning stage (Entri SiRUP / Survei Lokasi / Survei Harga / Perencanaan)
          isKontrak = false;
          progresRencana = 0;
          progresRealisasi = 0;
          statusDeviasi = 'Aman';
          spjStatus = 'belum_masuk';
          terminHistory = [];
          tahapPraKontrakStatus = i === 0 ? 'rup' : i === 1 ? 'survei_lokasi' : i === 2 ? 'survei_harga' : 'perencanaan';
        }

        const deviasiFisik = parseFloat((progresRealisasi - progresRencana).toFixed(1));
        const totalPencairan = terminHistory.reduce((sum, t) => sum + t.jumlah, 0);
        const persenKeuangan = nilaiKontrak > 0 ? parseFloat(((totalPencairan / nilaiKontrak) * 100).toFixed(1)) : 0;

        projects.push({
          id: projectId,
          tahunAnggaran: year,
          bidangId: group.bidangId,
          kategoriPekerjaan: group.kategoriPekerjaan || 'Fisik',
          subBagian: group.bidangId === 'sekretariat' ? (group.subBagians ? group.subBagians[i] : 'Sub Bagian Umum & Kepegawaian') : '',
          namaPaket,
          tipePengadaan: group.tipePengadaan[i],
          sumberDana,
          jenisAnggaran, // 'Murni' | 'APBD-P'
          kecamatan: kec, // Kolom Kecamatan
          desa: desa,     // Kolom Desa
          lokasi,
          latitude: coord.lat,
          longitude: coord.lng,
          paguAnggaran: pagu,
          hps,
          isPublicHighlight: true,
          kodeRUP: `RUP-${year}-${codePrefix}-${1000 + i}`,
          tags: [
            i % 2 === 0 ? 'Program Prioritas Bupati' : 'Dana Alokasi Khusus (DAK)',
            (jenisAnggaran === 'APBD-P' || jenisAnggaran === 'Perubahan') ? '(APBD-P)' : 'Siaga Bencana Banjir'
          ],
          tahapPraKontrak: {
            status: tahapPraKontrakStatus,
            targetMulaiTender: `${year}-02-15`,
            targetSelesaiTender: `${year}-03-30`,
            catatanPraKontrak: isKontrak ? 'Kontrak telah ditandatangani' : 'Dalam proses perencanaan/pemilihan pengadaan'
          },
          isKontrak,
          dataKontrak: {
            nomorKontrak: isKontrak ? `602.1/${100 + i}/SP-${codePrefix}/DINPUTARU/${year}` : '',
            tanggalKontrak: isKontrak ? `${year}-03-10` : '',
            nilaiKontrak: isKontrak ? nilaiKontrak : 0,
            namaPenyedia: isKontrak ? rekanan.nama : '',
            npwpPenyedia: '01.428.910.4-521.000',
            bankPenyedia: rekanan.bank,
            nomorRekening: rekanan.rek,
            waktuPelaksanaan: 150,
            tanggalMulai: isKontrak ? `${year}-03-15` : '',
            tanggalSelesai: isKontrak ? `${year}-08-15` : '',
            konsultanPengawas: 'CV. Rekayasa Teknik Konsultan Demak'
          },
          dataFisik: {
            progresRencana,
            progresRealisasi,
            deviasiFisik,
            statusDeviasi,
            kendalaLapangan: statusDeviasi === 'Kritis' ? 'Pasang rob air laut dan curah hujan tinggi memperlambat pemadatan tanah.' : 'Pekerjaan berjalan lancar sesuai jadwal pelaksanaan.',
            fotoDokumentasi: [
              { tahap: '0%', label: 'Kondisi Awal Lapangan', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=600&auto=format&fit=crop&q=80', tanggal: `${year}-03-15` },
              { tahap: '50%', label: 'Pekerjaan Struktur Utama', url: 'https://images.unsplash.com/photo-1584463699042-4fdfd8d06734?w=600&auto=format&fit=crop&q=80', tanggal: `${year}-05-20` }
            ],
            mingguanKurvaS: [
              { minggu: 1, rencana: 5, realisasi: isKontrak ? 6 : null },
              { minggu: 2, rencana: 12, realisasi: isKontrak ? 14 : null },
              { minggu: 3, rencana: 25, realisasi: isKontrak ? 27 : null },
              { minggu: 4, rencana: 42, realisasi: isKontrak ? (progresRealisasi > 40 ? 43 : 38) : null },
              { minggu: 5, rencana: 60, realisasi: progresRealisasi >= 60 ? progresRealisasi : null },
              { minggu: 6, rencana: 80, realisasi: progresRealisasi >= 80 ? progresRealisasi : null },
              { minggu: 7, rencana: 100, realisasi: progresRealisasi >= 100 ? 100 : null }
            ]
          },
          dataKeuangan: {
            terminHistory,
            totalPencairan,
            persenKeuangan
          },
          administrasiSPJ: {
            status: spjStatus,
            tanggalMasuk: isKontrak ? `${year}-04-10` : '',
            tanggalKoreksi: isKontrak ? `${year}-04-15` : '',
            tanggalSPM: isKontrak ? `${year}-04-20` : '',
            nomorSPM: isKontrak ? `SPM/${year}/${codePrefix}/${100 + i}` : '',
            catatanVerifikator: spjStatus === 'dikembalikan' ? 'Lampiran faktur pajak PPN 11% dan bukti uji kuat tekan beton belum lengkap.' : 'Berkas verifikasi SPJ lengkap dan memenuhi syarat pencairan.',
            petugasVerifikator: 'Sri Wahyuni, SE, M.Si'
          },
          updatedAt: `${year}-06-15 10:00`,
          updatedBy: 'Koordinator Bidang'
        });
      }
    });
  });

  return projects;
};
