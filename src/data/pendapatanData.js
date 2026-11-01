// Master Data & Dummy Generator Monitoring Pendapatan DINPUTARU Kabupaten Demak
// Target Tahun Berjalan: Rp 6.000.000.000 (6 Miliar)
// 5 Sumber Pendapatan:
// 1. Setor Tinja (Layanan IPLT)
// 2. PBG (Persetujuan Bangunan Gedung)
// 3. SLF (Sertifikat Laik Fungsi)
// 4. Sewa Alat Berat (Excavator, Tandem Roller, Grader, Dump Truck, dll.)
// 5. Sewa Cor Drill (Pengujian Laboratorium Konstruksi)

export const KATEGORI_PENDAPATAN = [
  {
    id: 'setor_tinja',
    kode: 'PAD-01',
    nama: 'Setor Tinja',
    labelLengkap: 'Layanan Pengolahan / Penyedotan Tinja (IPLT)',
    singkatan: 'Tinja',
    deskripsi: 'Retribusi pelayanan penyedotan dan pengolahan lumpur tinja pada Instalasi Pengolahan Lumpur Tinja (IPLT).',
    warna: '#0d9488', // teal
    bgLight: 'rgba(13, 148, 136, 0.1)',
    targetDefault: 500000000, // Rp 500 Juta
    satuanTarif: 'per rit / m³'
  },
  {
    id: 'pbg',
    kode: 'PAD-02',
    nama: 'PBG',
    labelLengkap: 'Persetujuan Bangunan Gedung (PBG)',
    singkatan: 'PBG',
    deskripsi: 'Retribusi persetujuan teknis dan izin pendirian/perubahan bangunan gedung hunian, usaha, dan sosial.',
    warna: '#2563eb', // blue
    bgLight: 'rgba(37, 99, 235, 0.1)',
    targetDefault: 2500000000, // Rp 2,5 Miliar
    satuanTarif: 'per m² luas lantai'
  },
  {
    id: 'slf',
    kode: 'PAD-03',
    nama: 'SLF',
    labelLengkap: 'Sertifikat Laik Fungsi (SLF)',
    singkatan: 'SLF',
    deskripsi: 'Retribusi pengujian dan penerbitan sertifikat kelaikan teknis fungsi bangunan gedung bertingkat/komersial.',
    warna: '#7c3aed', // purple
    bgLight: 'rgba(124, 58, 237, 0.1)',
    targetDefault: 1200000000, // Rp 1,2 Miliar
    satuanTarif: 'per dokumen uji laik'
  },
  {
    id: 'sewa_alat_berat',
    kode: 'PAD-04',
    nama: 'Sewa Alat Berat',
    labelLengkap: 'Sewa Alat Berat & Mesin Konstruksi Dinas',
    singkatan: 'Alat Berat',
    deskripsi: 'Retribusi pemakaian kekayaan daerah untuk sewa Excavator, Tandem Roller, Motor Grader, Bulldozer, Dump Truck.',
    warna: '#d97706', // amber
    bgLight: 'rgba(217, 119, 6, 0.1)',
    targetDefault: 1300000000, // Rp 1,3 Miliar
    satuanTarif: 'per shift / hari kerja'
  },
  {
    id: 'sewa_cor_drill',
    kode: 'PAD-05',
    nama: 'Sewa Cor Drill',
    labelLengkap: 'Sewa Alat Core Drill & Pengujian Laboratorium',
    singkatan: 'Cor Drill',
    deskripsi: 'Retribusi pengujian mutu ketebalan dan kekuatan beton/aspal jalan menggunakan mesin core drill laboratorium bahan.',
    warna: '#e11d48', // rose
    bgLight: 'rgba(225, 29, 72, 0.1)',
    targetDefault: 500000000, // Rp 500 Juta
    satuanTarif: 'per titik uji sampel'
  }
];

export const DEFAULT_TARGET_CONFIG = {
  tahunAnggaran: 2026,
  targetTahunanTotal: 6000000000, // 6 Miliar
  targetPerKategori: {
    setor_tinja: 500000000,
    pbg: 2500000000,
    slf: 1200000000,
    sewa_alat_berat: 1300000000,
    sewa_cor_drill: 500000000
  },
  keterangan: 'Target Penerimaan Asli Daerah (PAD) Retribusi DINPUTARU Kabupaten Demak TA 2026'
};

export const METODE_PEMBAYARAN = [
  'Transfer Kasda (Bank Jateng)',
  'Virtual Account Kasda',
  'QRIS Dinas DINPUTARU',
  'Setoran Tunai via Kasir / Teller Bank Jateng'
];

export const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

// Generator dummy data penerimaan dari Januari hingga November
export const generateDummyPendapatanTransactions = (year = 2026) => {
  const transactions = [];
  let seq = 1;

  const rawDataTemplates = [
    // --- JANUARI ---
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'PT Surya Demak Konstruksi',
      hari: 5,
      bulan: 1,
      nominal: 8500000,
      noBukti: `STS/DPU/${year}/01/001`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Excavator PC200 3 hari pembersihan saluran pembuang Kec. Karangtengah'
    },
    {
      kategori: 'pbg',
      penyewa: 'PT Graha Makmur Sejahtera (Perumahan Pesona Demak)',
      hari: 8,
      bulan: 1,
      nominal: 92450000,
      noBukti: `STS/DPU/${year}/01/002`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG 42 Unit Rumah Tinggal Cluster Tahap I Jl. Sunan Kalijaga'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'CV Bersih Sejahtera (Jasa Sedot Tinja Mitra)',
      hari: 12,
      bulan: 1,
      nominal: 1850000,
      noBukti: `STS/DPU/${year}/01/003`,
      metode: 'QRIS Dinas DINPUTARU',
      keterangan: 'Setoran pembuangan lumpur tinja tangki 5 rit ke IPLT Kalikondang'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'CV Karya Utama Kontraktor',
      hari: 15,
      bulan: 1,
      nominal: 4200000,
      noBukti: `STS/DPU/${year}/01/004`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Pengujian Core Drill 12 titik mutu beton rigid jalan ruas Guntur - Karangawen'
    },
    {
      kategori: 'slf',
      penyewa: 'PT Sumber Alfaria Trijaya (Gudang Logistik Sayung)',
      hari: 20,
      bulan: 1,
      nominal: 48000000,
      noBukti: `STS/DPU/${year}/01/005`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Penerbitan SLF Gedung Fasilitas Pergudangan Modern Km 12 Sayung'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'Bpk. H. Sutrisno (CV Duta Bahari)',
      hari: 24,
      bulan: 1,
      nominal: 12000000,
      noBukti: `STS/DPU/${year}/01/006`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Tandem Roller & Dump Truck 4 hari perbaikan jalan tambak Wedung'
    },
    {
      kategori: 'pbg',
      penyewa: 'Drs. H. Mulyono (Ruko & Toko Sembako)',
      hari: 28,
      bulan: 1,
      nominal: 18750000,
      noBukti: `STS/DPU/${year}/01/007`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG Bangunan Komersial Ruko 3 Lantai Bintoro Demak'
    },

    // --- FEBRUARI ---
    {
      kategori: 'pbg',
      penyewa: 'PT Djarum Logistik Indonesia',
      hari: 4,
      bulan: 2,
      nominal: 145000000,
      noBukti: `STS/DPU/${year}/02/008`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG Perluasan Pabrik dan Area Bongkar Muat Kawasan Sayung'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'PT Bina Karya Prasarana',
      hari: 7,
      bulan: 2,
      nominal: 6500000,
      noBukti: `STS/DPU/${year}/02/009`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Pengujian Core Drill 18 sampel aspal hotmix ruas Demak - Bonang'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'RSUD Sunan Kalijaga Demak',
      hari: 11,
      bulan: 2,
      nominal: 4500000,
      noBukti: `STS/DPU/${year}/02/010`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Pelayanan pengolahan limbah lumpur tinja sanitasi rumah sakit 10 rit'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'CV Wahyu Abadi Jaya',
      hari: 16,
      bulan: 2,
      nominal: 21500000,
      noBukti: `STS/DPU/${year}/02/011`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Motor Grader & Tandem Roller 7 hari perataan base course jalan poros desa'
    },
    {
      kategori: 'slf',
      penyewa: 'Hotel Amantis Demak (PT Amantis Graha)',
      hari: 22,
      bulan: 2,
      nominal: 35000000,
      noBukti: `STS/DPU/${year}/02/012`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Perpanjangan Sertifikat Laik Fungsi (SLF) Gedung Hotel Bintang 3'
    },
    {
      kategori: 'pbg',
      penyewa: 'Bpk. Ahmad Fauzi (Rumah Tinggal Mewah)',
      hari: 26,
      bulan: 2,
      nominal: 8650000,
      noBukti: `STS/DPU/${year}/02/013`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG Rumah Tinggal Luas 340 m² Mangunjiwan'
    },

    // --- MARET ---
    {
      kategori: 'setor_tinja',
      penyewa: 'CV Sumber Rejeki Sanitasi',
      hari: 3,
      bulan: 3,
      nominal: 2400000,
      noBukti: `STS/DPU/${year}/03/014`,
      metode: 'QRIS Dinas DINPUTARU',
      keterangan: 'Setoran lumpur tinja sedot WC permukiman Kec. Demak 6 rit'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'PT Cahaya Bangun Konstruksi',
      hari: 9,
      bulan: 3,
      nominal: 32000000,
      noBukti: `STS/DPU/${year}/03/015`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Excavator Long Arm 10 hari normalisasi saluran drainase primer'
    },
    {
      kategori: 'pbg',
      penyewa: 'Yayasan Pendidikan Al-Irsyad Demak',
      hari: 14,
      bulan: 3,
      nominal: 24500000,
      noBukti: `STS/DPU/${year}/03/016`,
      metode: 'Virtual Account Kasda',
      keterangan: 'PBG Pembangunan Gedung Laboratorium dan Perpustakaan 3 Lantai'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'CV Tunas Mandiri Kontraktor',
      hari: 19,
      bulan: 3,
      nominal: 5400000,
      noBukti: `STS/DPU/${year}/03/017`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Uji Core Drill mutu beton K-350 jembatan ruas Kebonagung'
    },
    {
      kategori: 'slf',
      penyewa: 'Pabrik Tekstil PT Grand Best Indonesia',
      hari: 25,
      bulan: 3,
      nominal: 85000000,
      noBukti: `STS/DPU/${year}/03/018`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'SLF Gedung Produksi Garment & Gudang Ekspor Kawasan Karangawen'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'CV Mitra Pembangunan',
      hari: 28,
      bulan: 3,
      nominal: 14000000,
      noBukti: `STS/DPU/${year}/03/019`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Vibro Roller 10 ton 5 hari pemadatan jalan lingkungan Mranggen'
    },

    // --- APRIL ---
    {
      kategori: 'pbg',
      penyewa: 'PT Demak Kawasan Industri Nusantara',
      hari: 5,
      bulan: 4,
      nominal: 185000000,
      noBukti: `STS/DPU/${year}/04/020`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG Kompleks Pergudangan Logistik Sayung Tahap 2'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'Puskesmas Bonang I & II',
      hari: 10,
      bulan: 4,
      nominal: 3200000,
      noBukti: `STS/DPU/${year}/04/021`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Pengolahan lumpur tinja sanitasi Puskesmas Rawat Inap'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'CV Sarana Bina Karya',
      hari: 16,
      bulan: 4,
      nominal: 4800000,
      noBukti: `STS/DPU/${year}/04/022`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Uji Core Drill 14 sampel rigid pavement jalan alternatif Buyaran - Karangawen'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'Bpk. Ir. Joko Waluyo (PPK Swakelola)',
      hari: 21,
      bulan: 4,
      nominal: 18500000,
      noBukti: `STS/DPU/${year}/04/023`,
      metode: 'Setoran Tunai via Kasir / Teller Bank Jateng',
      keterangan: 'Sewa Dump Truck 3 unit 6 hari pengangkutan tanah urug tanggul Sayung'
    },
    {
      kategori: 'slf',
      penyewa: 'Rumah Sakit Islam NU Demak',
      hari: 26,
      bulan: 4,
      nominal: 55000000,
      noBukti: `STS/DPU/${year}/04/024`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'SLF Gedung Paviliun Rawat Inap 5 Lantai'
    },

    // --- MEI ---
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'PT Karya Makmur Abadi',
      hari: 4,
      bulan: 5,
      nominal: 27500000,
      noBukti: `STS/DPU/${year}/05/025`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Excavator Standar & Bulldozer 8 hari penyiapan lahan sentra bibit'
    },
    {
      kategori: 'pbg',
      penyewa: 'PT Mitra Perumahan Sejahtera',
      hari: 9,
      bulan: 5,
      nominal: 112000000,
      noBukti: `STS/DPU/${year}/05/026`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG 56 unit perumahan subsidi Wonosalam Indah'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'CV Mitra Jasa Lestari',
      hari: 15,
      bulan: 5,
      nominal: 2800000,
      noBukti: `STS/DPU/${year}/05/027`,
      metode: 'QRIS Dinas DINPUTARU',
      keterangan: 'Pembuangan lumpur tinja ke IPLT Kalikondang 7 rit'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'CV Adhi Perkasa Konstruksi',
      hari: 20,
      bulan: 5,
      nominal: 5800000,
      noBukti: `STS/DPU/${year}/05/028`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Uji laboratorium Core Drill 16 titik rekonstruksi jalan Karanganyar'
    },
    {
      kategori: 'slf',
      penyewa: 'Superindo Bintoro Plaza Demak',
      hari: 27,
      bulan: 5,
      nominal: 42000000,
      noBukti: `STS/DPU/${year}/05/029`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Penerbitan Sertifikat Laik Fungsi Gedung Pusat Perbelanjaan'
    },

    // --- JUNI ---
    {
      kategori: 'pbg',
      penyewa: 'PT Demak Cold Storage & Processing',
      hari: 3,
      bulan: 6,
      nominal: 168000000,
      noBukti: `STS/DPU/${year}/06/030`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG Fasilitas Pabrik Pembekuan Ikan Laut Morodemak Bonang'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'CV Bumi Nusantara',
      hari: 10,
      bulan: 6,
      nominal: 35000000,
      noBukti: `STS/DPU/${year}/06/031`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Excavator PC200 & Tandem Roller 12 hari normalisasi tanggul sungai'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'Koperasi Karyawan Pemkab Demak',
      hari: 14,
      bulan: 6,
      nominal: 3100000,
      noBukti: `STS/DPU/${year}/06/032`,
      metode: 'QRIS Dinas DINPUTARU',
      keterangan: 'Pelayanan sedot tinja kantor perumda & dinas otonom'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'PT Hutama Mitra Pratama',
      hari: 18,
      bulan: 6,
      nominal: 7200000,
      noBukti: `STS/DPU/${year}/06/033`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Pengujian Core Drill 20 sampel tebal aspal HRS-WC jalan lingkar Demak'
    },
    {
      kategori: 'slf',
      penyewa: 'PT Surya Indo Plastik Karangawen',
      hari: 24,
      bulan: 6,
      nominal: 68000000,
      noBukti: `STS/DPU/${year}/06/034`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'SLF Gedung Manufaktur Kemasan & Gudang Bahan Baku'
    },

    // --- JULI ---
    {
      kategori: 'pbg',
      penyewa: 'PT Bintang Mitra Sejahtera (SPBU Pertamina)',
      hari: 4,
      bulan: 7,
      nominal: 54000000,
      noBukti: `STS/DPU/${year}/07/035`,
      metode: 'Virtual Account Kasda',
      keterangan: 'PBG Pembangunan SPBU & Rest Area Jl. Raya Pantura Sayung'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'CV Artha Mulia Sejahtera',
      hari: 9,
      bulan: 7,
      nominal: 29000000,
      noBukti: `STS/DPU/${year}/07/036`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Motor Grader & Wheel Loader 9 hari pekerjaan timbunan pilihan'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'CV Berkah Bersih Mandiri',
      hari: 14,
      bulan: 7,
      nominal: 2900000,
      noBukti: `STS/DPU/${year}/07/037`,
      metode: 'QRIS Dinas DINPUTARU',
      keterangan: 'Layanan buang tinja mobil tangki swasta ke IPLT 7 rit'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'CV Cipta Karya Lestari',
      hari: 19,
      bulan: 7,
      nominal: 6100000,
      noBukti: `STS/DPU/${year}/07/038`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Uji Core Drill beton K-300 jembatan Kedungori Dempet'
    },
    {
      kategori: 'slf',
      penyewa: 'Pondok Pesantren Girikusumo Mranggen',
      hari: 25,
      bulan: 7,
      nominal: 28000000,
      noBukti: `STS/DPU/${year}/07/039`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'SLF Gedung Asrama Santri & Aula Utama 4 Lantai'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'Bpk. H. Bambang Irawan (Petani Tambak)',
      hari: 29,
      bulan: 7,
      nominal: 9500000,
      noBukti: `STS/DPU/${year}/07/040`,
      metode: 'Setoran Tunai via Kasir / Teller Bank Jateng',
      keterangan: 'Sewa Excavator Mini 3 hari pengerukan saluran tambak bandeng'
    },

    // --- AGUSTUS ---
    {
      kategori: 'pbg',
      penyewa: 'PT Central Java Logistik Raya',
      hari: 6,
      bulan: 8,
      nominal: 210000000,
      noBukti: `STS/DPU/${year}/08/041`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG Gudang Distribusi E-Commerce Sayung 24.000 m²'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'PT Surya Prima Konstruksi',
      hari: 12,
      bulan: 8,
      nominal: 38000000,
      noBukti: `STS/DPU/${year}/08/042`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Excavator Long Arm & Tandem Roller 14 hari proyek normalisasi'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'Pondok Pesantren Al-Fattah Setinggil',
      hari: 16,
      bulan: 8,
      nominal: 3800000,
      noBukti: `STS/DPU/${year}/08/043`,
      metode: 'QRIS Dinas DINPUTARU',
      keterangan: 'Pengurasan septik tank komunal asrama santri 9 rit'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'CV Wahyu Bangun Persada',
      hari: 21,
      bulan: 8,
      nominal: 7500000,
      noBukti: `STS/DPU/${year}/08/044`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Core drill 22 sampel beton rigid jalan lingkar luar Mranggen'
    },
    {
      kategori: 'slf',
      penyewa: 'PT Polytron Elektronik (Showroom & Service)',
      hari: 26,
      bulan: 8,
      nominal: 45000000,
      noBukti: `STS/DPU/${year}/08/045`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'SLF Gedung Showroom Komersial dan Gudang Suku Cadang Bintoro'
    },

    // --- SEPTEMBER ---
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'CV Graha Cipta Mandiri',
      hari: 4,
      bulan: 9,
      nominal: 26000000,
      noBukti: `STS/DPU/${year}/09/046`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Tandem Roller & Grader 8 hari pelebaran bahu jalan poros Gajah'
    },
    {
      kategori: 'pbg',
      penyewa: 'PT Kharisma Surya Abadi (Showroom Mobil)',
      hari: 10,
      bulan: 9,
      nominal: 68500000,
      noBukti: `STS/DPU/${year}/09/047`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG Showroom Otomotif & Bengkel Resmi Jl. Sultan Fatah'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'CV Bersih Indah Cemerlang',
      hari: 15,
      bulan: 9,
      nominal: 3400000,
      noBukti: `STS/DPU/${year}/09/048`,
      metode: 'QRIS Dinas DINPUTARU',
      keterangan: 'Setoran pembuangan lumpur tinja IPLT 8 rit'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'CV Duta Teknik Mandiri',
      hari: 19,
      bulan: 9,
      nominal: 6800000,
      noBukti: `STS/DPU/${year}/09/049`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Core drill 19 sampel beton saluran irigasi sekunder Guntur'
    },
    {
      kategori: 'slf',
      penyewa: 'PT Sayung Industrial Estate (Kawasan Industri)',
      hari: 25,
      bulan: 9,
      nominal: 110000000,
      noBukti: `STS/DPU/${year}/09/050`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'SLF Kawasan Pabrik Manufaktur Baja Ringan Km 14 Pantura'
    },

    // --- OKTOBER ---
    {
      kategori: 'pbg',
      penyewa: 'PT Demak Marina Permai (Perumahan Tepi Pantai)',
      hari: 5,
      bulan: 10,
      nominal: 135000000,
      noBukti: `STS/DPU/${year}/10/051`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG 68 unit rumah tinggal dan fasilitas dermaga mini'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'PT Jaya Abadi Infrastruktur',
      hari: 11,
      bulan: 10,
      nominal: 42000000,
      noBukti: `STS/DPU/${year}/10/052`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Excavator PC200 & Vibro Roller 15 hari tanggap darurat rob Sayung'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'Pabrik Sepatu PT Parkland World Karangawen',
      hari: 15,
      bulan: 10,
      nominal: 5200000,
      noBukti: `STS/DPU/${year}/10/053`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Pengurasan dan pengolahan lumpur tinja sanitasi 6.000 pekerja'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'CV Berkah Abadi Kontraktor',
      hari: 20,
      bulan: 10,
      nominal: 8100000,
      noBukti: `STS/DPU/${year}/10/054`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Core drill 24 titik pengujian mutu aspal AC-BC dan AC-WC Banprov'
    },
    {
      kategori: 'slf',
      penyewa: 'Demak Green Garden (Taman Wisata & Resto)',
      hari: 26,
      bulan: 10,
      nominal: 52000000,
      noBukti: `STS/DPU/${year}/10/055`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'SLF Gedung Restoran, Convention Hall, dan Wahana Rekreasi'
    },

    // --- NOVEMBER ---
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'CV Mitra Sejati Mandiri',
      hari: 3,
      bulan: 11,
      nominal: 500000, // Sesuai contoh di instruksi user: "MisaL sEWA aLAT BERAT 500.000"
      noBukti: `STS/DPU/${year}/11/056`,
      metode: 'QRIS Dinas DINPUTARU',
      keterangan: 'Sewa alat berat Jack Hammer & Stamper pemadat parit 1 shift pemeliharaan rutin'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'PT Demak Putra Konstruksi',
      hari: 6,
      bulan: 11,
      nominal: 31500000,
      noBukti: `STS/DPU/${year}/11/057`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Excavator Standar 10 hari pengurugan oprit jembatan Kracaan'
    },
    {
      kategori: 'pbg',
      penyewa: 'PT Sumber Berkah Pergudangan Sayung',
      hari: 10,
      bulan: 11,
      nominal: 175000000,
      noBukti: `STS/DPU/${year}/11/058`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG Gudang Pendingin Hasil Pertanian Bawang Merah Demak'
    },
    {
      kategori: 'setor_tinja',
      penyewa: 'CV Sejahtera Sanitasi Lingkungan',
      hari: 14,
      bulan: 11,
      nominal: 3600000,
      noBukti: `STS/DPU/${year}/11/059`,
      metode: 'QRIS Dinas DINPUTARU',
      keterangan: 'Layanan setoran lumpur tinja IPLT Kalikondang 9 rit'
    },
    {
      kategori: 'sewa_cor_drill',
      penyewa: 'CV Rekayasa Bina Jalan',
      hari: 18,
      bulan: 11,
      nominal: 6900000,
      noBukti: `STS/DPU/${year}/11/060`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Uji Core Drill 19 sampel beton K-350 ruas Trengguli - Karanganyar'
    },
    {
      kategori: 'slf',
      penyewa: 'PT Bintoro Swalayan Makmur',
      hari: 22,
      bulan: 11,
      nominal: 64000000,
      noBukti: `STS/DPU/${year}/11/061`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sertifikat Laik Fungsi Gedung Pasar Modern dan Wahana Bermain'
    },
    {
      kategori: 'sewa_alat_berat',
      penyewa: 'Bpk. Sugiyanto (Kelompok Petani Tirto Mulyo)',
      hari: 25,
      bulan: 11,
      nominal: 8500000,
      noBukti: `STS/DPU/${year}/11/062`,
      metode: 'Transfer Kasda (Bank Jateng)',
      keterangan: 'Sewa Excavator Mini 3 hari normalisasi saluran tersier persawahan'
    },
    {
      kategori: 'pbg',
      penyewa: 'Hj. Siti Aminah (Klinik Pratama Rawat Inap)',
      hari: 28,
      bulan: 11,
      nominal: 28400000,
      noBukti: `STS/DPU/${year}/11/063`,
      metode: 'Virtual Account Kasda',
      keterangan: 'Retribusi PBG Pembangunan Gedung Klinik 3 Lantai Kec. Bonang'
    }
  ];

  // Tambahkan transaksi tambahan yang variatif agar akumulasi Jan-Nov mencapai ~Rp 5,12 Miliar (realistis ~85.3% dari target 6M)
  const additionalTransactions = [
    // Jan
    { kat: 'pbg', pen: 'Bpk. H. Rahmat (Gedung Sarang Burung Walet)', bln: 1, d: 22, nom: 16500000, ket: 'PBG Bangunan Walet 4 Lantai Wedung' },
    { kat: 'sewa_cor_drill', pen: 'CV Citra Konstruksi', bln: 1, d: 29, nom: 3500000, ket: 'Uji Core drill 10 titik beton' },
    // Feb
    { kat: 'setor_tinja', pen: 'CV Lancar Tinja Mitra DPU', bln: 2, d: 18, nom: 2100000, ket: 'Setoran lumpur tinja 5 rit' },
    { kat: 'pbg', pen: 'PT Sejahtera Logistik Sayung', bln: 2, d: 24, nom: 78000000, ket: 'PBG Hanggar Penumpukan Petikemas' },
    // Mar
    { kat: 'sewa_alat_berat', pen: 'CV Sumber Makmur Mandiri', bln: 3, d: 11, nom: 18500000, ket: 'Sewa Tandem Roller 6 hari' },
    { kat: 'pbg', pen: 'PT Griya Dempet Asri', bln: 3, d: 22, nom: 64000000, ket: 'PBG 32 Unit Rumah Subsidi' },
    // Apr
    { kat: 'slf', pen: 'PT Semarang Demak Gas Station', bln: 4, d: 14, nom: 38000000, ket: 'SLF Stasiun Pengisian Bahan Bakar Gas' },
    { kat: 'sewa_cor_drill', pen: 'PT Adhi Megah Persada', bln: 4, d: 29, nom: 5200000, ket: 'Core drill 15 sampel aspal' },
    // Mei
    { kat: 'pbg', pen: 'Bpk. H. Sukarno (Mini Market)', bln: 5, d: 12, nom: 19500000, ket: 'PBG Toko Swalayan Lokal Karangtengah' },
    { kat: 'sewa_alat_berat', pen: 'CV Sinar Jaya Konstruksi', bln: 5, d: 23, nom: 24000000, ket: 'Sewa Excavator Long Arm 7 hari' },
    // Jun
    { kat: 'pbg', pen: 'PT Sayung Mega Logistik', bln: 6, d: 16, nom: 125000000, ket: 'PBG Kompleks Depo Logistik' },
    { kat: 'setor_tinja', pen: 'Hotel Grand Demak Bintoro', bln: 6, d: 27, nom: 4200000, ket: 'Sedot tinja septik tank hotel 9 rit' },
    // Jul
    { kat: 'slf', pen: 'PT Karangawen Garmen Industri', bln: 7, d: 11, nom: 75000000, ket: 'SLF Gedung Fabrikasi Kain & Pengepakan' },
    { kat: 'sewa_cor_drill', pen: 'CV Pilar Bangun Mandiri', bln: 7, d: 22, nom: 4900000, ket: 'Core drill uji beton drainase' },
    // Agu
    { kat: 'pbg', pen: 'PT Demak Indo Pangan (Gudang Beras)', bln: 8, d: 18, nom: 86000000, ket: 'PBG Silo & Pengeringan Gabah Modern' },
    { kat: 'sewa_alat_berat', pen: 'CV Jaya Perkasa Konstruksi', bln: 8, d: 28, nom: 19500000, ket: 'Sewa Motor Grader 6 hari' },
    // Sep
    { kat: 'pbg', pen: 'PT Sayung Mega Niaga', bln: 9, d: 12, nom: 142000000, ket: 'PBG Gedung Distribusi Farmasi' },
    { kat: 'setor_tinja', pen: 'CV Sedot Sejahtera Mandiri', bln: 9, d: 22, nom: 3800000, ket: 'Layanan pembuangan IPLT 8 rit' },
    // Okt
    { kat: 'sewa_cor_drill', pen: 'PT Mega Beton Sejahtera', bln: 10, d: 14, nom: 7200000, ket: 'Core drill 20 titik jembatan Sayung' },
    { kat: 'slf', pen: 'PT Surya Indo Kertas Karangawen', bln: 10, d: 29, nom: 68000000, ket: 'SLF Gedung Daur Ulang Pulp Kertas' },
    // Nov
    { kat: 'pbg', pen: 'PT Bintoro Industri Perkasa', bln: 11, d: 15, nom: 155000000, ket: 'PBG Fasilitas Pabrik Pengolahan Hasil Laut' },
    { kat: 'sewa_cor_drill', pen: 'CV Mitra Uji Mandiri', bln: 11, d: 26, nom: 5600000, ket: 'Pengujian Core Drill 15 titik beton' }
  ];

  // Susun semua data
  rawDataTemplates.forEach((item) => {
    const padBulan = String(item.bulan).padStart(2, '0');
    const padHari = String(item.hari).padStart(2, '0');
    transactions.push({
      id: `TRX-${year}-${String(seq).padStart(3, '0')}`,
      kategori: item.kategori,
      namaPenyewa: item.penyewa,
      tanggal: `${year}-${padBulan}-${padHari}`,
      nominal: item.nominal,
      noBukti: item.noBukti,
      metodePembayaran: item.metode,
      keterangan: item.keterangan,
      status: 'Terverifikasi Kasda',
      tahun: year,
      bulan: item.bulan,
      createdAt: `${year}-${padBulan}-${padHari} 09:30:00`,
      updatedBy: 'Tri Wahyudi, SE (Koordinator Pendapatan)'
    });
    seq++;
  });

  additionalTransactions.forEach((add) => {
    const padBulan = String(add.bln).padStart(2, '0');
    const padHari = String(add.d).padStart(2, '0');
    const katInfo = KATEGORI_PENDAPATAN.find((k) => k.id === add.kat);
    transactions.push({
      id: `TRX-${year}-${String(seq).padStart(3, '0')}`,
      kategori: add.kat,
      namaPenyewa: add.pen,
      tanggal: `${year}-${padBulan}-${padHari}`,
      nominal: add.nom,
      noBukti: `STS/DPU/${year}/${padBulan}/${String(seq).padStart(3, '0')}`,
      metodePembayaran: add.nom > 50000000 ? 'Virtual Account Kasda' : 'Transfer Kasda (Bank Jateng)',
      keterangan: add.ket,
      status: 'Terverifikasi Kasda',
      tahun: year,
      bulan: add.bln,
      createdAt: `${year}-${padBulan}-${padHari} 11:15:00`,
      updatedBy: 'Tri Wahyudi, SE (Koordinator Pendapatan)'
    });
    seq++;
  });

  // Urutkan kronologis tanggal
  return transactions.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
};
