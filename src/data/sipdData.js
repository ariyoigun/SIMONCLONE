/**
 * MASTER DATA NOMENKLATUR SIPD KEMENDAGRI (DINPUTARU KABUPATEN DEMAK)
 * Berisi struktur hierarki baku:
 * 1. Program
 * 2. Kegiatan (di bawah Program)
 * 3. Sub Kegiatan (di bawah Kegiatan)
 * 4. Paket Pekerjaan (di bawah Sub Kegiatan)
 */

export const INITIAL_SIPD_PROGRAMS = [
  // --- BINA MARGA ---
  {
    id: 'prog_bm_jalan',
    kodeProgram: '1.03.02',
    namaProgram: 'PROGRAM PENYELENGGARAAN JALAN',
    bidangId: 'bina_marga',
    deskripsi: 'Penyelenggaraan jalan kabupaten, jembatan, dan sarana prasarana konektivitas wilayah'
  },

  // --- SUMBER DAYA AIR & BINA KONSTRUKSI ---
  {
    id: 'prog_sda_air',
    kodeProgram: '1.03.03',
    namaProgram: 'PROGRAM PENGELOLAAN SUMBER DAYA AIR (SDA)',
    bidangId: 'sda_bk',
    deskripsi: 'Pengelolaan sungai, waduk/embung, drainase utama, dan jaringan irigasi pertanian'
  },
  {
    id: 'prog_sda_jakon',
    kodeProgram: '1.03.07',
    namaProgram: 'PROGRAM PENYELENGGARAAN BINA KONSTRUKSI',
    bidangId: 'sda_bk',
    deskripsi: 'Pembinaan, pengawasan tertib konstruksi, dan sertifikasi tenaga kerja konstruksi'
  },

  // --- CIPTA KARYA ---
  {
    id: 'prog_ck_gedung',
    kodeProgram: '1.03.04',
    namaProgram: 'PROGRAM PENATAAN BANGUNAN GEDUNG',
    bidangId: 'cipta_karya',
    deskripsi: 'Pembangunan, rehabilitasi gedung pelayanan publik, dan penataan kawasan permukiman'
  },
  {
    id: 'prog_ck_spam',
    kodeProgram: '1.03.05',
    namaProgram: 'PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM PENYEDIAAN AIR MINUM (SPAM)',
    bidangId: 'cipta_karya',
    deskripsi: 'Penyediaan dan pengembangan jaringan distribusi air minum perpipaan perkotaan dan perdesaan'
  },
  {
    id: 'prog_ck_sanitasi',
    kodeProgram: '1.03.06',
    namaProgram: 'PROGRAM PENGEMBANGAN SISTEM DAN PENGELOLAAN PERSAMPAHAN & AIR LIMBAH DOMESTIK',
    bidangId: 'cipta_karya',
    deskripsi: 'Pembangunan SPALD terpusat dan fasilitas pengolahan sampah sirkular TPS3R'
  },

  // --- TATA RUANG & PERTANAHAN ---
  {
    id: 'prog_trp_tataruang',
    kodeProgram: '1.03.08',
    namaProgram: 'PROGRAM PENYELENGGARAAN PENATAAN RUANG',
    bidangId: 'tata_ruang',
    deskripsi: 'Penyusunan RTRW, RDTR, KKPR, pemetaan GIS dan pengendalian pemanfaatan ruang'
  },
  {
    id: 'prog_trp_tanah',
    kodeProgram: '1.03.09',
    namaProgram: 'PROGRAM PENGELOLAAN PERTANAHAN',
    bidangId: 'tata_ruang',
    deskripsi: 'Fasilitasi pengadaan tanah dan pengukuran teknis tanah untuk infrastruktur publik'
  },

  // --- SEKRETARIAT ---
  {
    id: 'prog_sek_penunjang',
    kodeProgram: '1.03.01',
    namaProgram: 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA',
    bidangId: 'sekretariat',
    deskripsi: 'Perencanaan, administrasi keuangan, kepegawaian, pengadaan sarana IT dan aset kantor'
  }
];

export const INITIAL_SIPD_KEGIATAN = [
  // --- BINA MARGA ---
  {
    id: 'keg_bm_penyelenggaraan_jalan',
    programId: 'prog_bm_jalan',
    kodeKegiatan: '1.03.02.2.01',
    namaKegiatan: 'Penyelenggaraan Jalan Kabupaten/Kota',
    bidangId: 'bina_marga'
  },

  // --- SUMBER DAYA AIR & BINA KONSTRUKSI ---
  {
    id: 'keg_sda_sungai_pantai',
    programId: 'prog_sda_air',
    kodeKegiatan: '1.03.03.2.01',
    namaKegiatan: 'Pengelolaan SDA dan Bangunan Pengaman Pantai pada Wilayah Sungai',
    bidangId: 'sda_bk'
  },
  {
    id: 'keg_sda_irigasi',
    programId: 'prog_sda_air',
    kodeKegiatan: '1.03.03.2.02',
    namaKegiatan: 'Pengembangan dan Pengelolaan Sistem Irigasi',
    bidangId: 'sda_bk'
  },
  {
    id: 'keg_sda_bina_konstruksi',
    programId: 'prog_sda_jakon',
    kodeKegiatan: '1.03.07.2.01',
    namaKegiatan: 'Penyelenggaraan Pelatihan dan Tertib Jasa Konstruksi',
    bidangId: 'sda_bk'
  },

  // --- CIPTA KARYA ---
  {
    id: 'keg_ck_penyelenggaraan_gedung',
    programId: 'prog_ck_gedung',
    kodeKegiatan: '1.03.04.2.01',
    namaKegiatan: 'Penyelenggaraan Bangunan Gedung di Wilayah Daerah Kabupaten/Kota',
    bidangId: 'cipta_karya'
  },
  {
    id: 'keg_ck_pengembangan_spam',
    programId: 'prog_ck_spam',
    kodeKegiatan: '1.03.05.2.01',
    namaKegiatan: 'Pengelolaan dan Pengembangan Sistem Penyediaan Air Minum (SPAM)',
    bidangId: 'cipta_karya'
  },
  {
    id: 'keg_ck_air_limbah_persampahan',
    programId: 'prog_ck_sanitasi',
    kodeKegiatan: '1.03.06.2.01',
    namaKegiatan: 'Pengembangan Sistem Pengolahan Air Limbah Domestik & Persampahan',
    bidangId: 'cipta_karya'
  },

  // --- TATA RUANG & PERTANAHAN ---
  {
    id: 'keg_trp_perencanaan_ruang',
    programId: 'prog_trp_tataruang',
    kodeKegiatan: '1.03.08.2.01',
    namaKegiatan: 'Perencanaan Tata Ruang Wilayah dan Rencana Rinci Tata Ruang',
    bidangId: 'tata_ruang'
  },
  {
    id: 'keg_trp_pengendalian_ruang',
    programId: 'prog_trp_tataruang',
    kodeKegiatan: '1.03.08.2.02',
    namaKegiatan: 'Pemanfaatan dan Pengendalian Ruang Wilayah Daerah',
    bidangId: 'tata_ruang'
  },
  {
    id: 'keg_trp_pengadaan_tanah',
    programId: 'prog_trp_tanah',
    kodeKegiatan: '1.03.09.2.01',
    namaKegiatan: 'Fasilitasi Pengadaan dan Pengukuran Tanah Kepentingan Umum',
    bidangId: 'tata_ruang'
  },

  // --- SEKRETARIAT ---
  {
    id: 'keg_sek_perencanaan_keuangan',
    programId: 'prog_sek_penunjang',
    kodeKegiatan: '1.03.01.2.01',
    namaKegiatan: 'Perencanaan, Penganggaran, dan Evaluasi Kinerja Perangkat Daerah',
    bidangId: 'sekretariat'
  },
  {
    id: 'keg_sek_administrasi_umum',
    programId: 'prog_sek_penunjang',
    kodeKegiatan: '1.03.01.2.06',
    namaKegiatan: 'Administrasi Umum dan Perlengkapan Perangkat Daerah',
    bidangId: 'sekretariat'
  },
  {
    id: 'keg_sek_pengadaan_bmd',
    programId: 'prog_sek_penunjang',
    kodeKegiatan: '1.03.01.2.07',
    namaKegiatan: 'Pengadaan Barang Milik Daerah Penunjang Urusan Pemerintah Daerah',
    bidangId: 'sekretariat'
  },
  {
    id: 'keg_sek_pemeliharaan_bmd',
    programId: 'prog_sek_penunjang',
    kodeKegiatan: '1.03.01.2.08',
    namaKegiatan: 'Pemeliharaan Barang Milik Daerah Penunjang Urusan Pemerintah Daerah',
    bidangId: 'sekretariat'
  }
];

export const INITIAL_SIPD_SUB_KEGIATAN = [
  // --- BINA MARGA (Penyelenggaraan Jalan) ---
  {
    id: 'subkeg_bm_pembangunan_jalan',
    kegiatanId: 'keg_bm_penyelenggaraan_jalan',
    programId: 'prog_bm_jalan',
    kodeSubKegiatan: '1.03.02.2.01.0001',
    namaSubKegiatan: 'Pembangunan Jalan',
    kinerjaIndikator: 'Panjang jalan baru yang dibangun',
    satuanTarget: 'Km',
    bidangId: 'bina_marga'
  },
  {
    id: 'subkeg_bm_rekonstruksi_jalan',
    kegiatanId: 'keg_bm_penyelenggaraan_jalan',
    programId: 'prog_bm_jalan',
    kodeSubKegiatan: '1.03.02.2.01.0003',
    namaSubKegiatan: 'Rekonstruksi Jalan (Peningkatan / Rigid Pavement)',
    kinerjaIndikator: 'Panjang jalan kabupaten yang direkonstruksi',
    satuanTarget: 'Km',
    bidangId: 'bina_marga'
  },
  {
    id: 'subkeg_bm_pelebaran_jalan',
    kegiatanId: 'keg_bm_penyelenggaraan_jalan',
    programId: 'prog_bm_jalan',
    kodeSubKegiatan: '1.03.02.2.01.0004',
    namaSubKegiatan: 'Pelebaran Jalan Menuju Standar',
    kinerjaIndikator: 'Panjang jalan yang diperlebar bahu dan perkerasan',
    satuanTarget: 'Km',
    bidangId: 'bina_marga'
  },
  {
    id: 'subkeg_bm_pembangunan_jembatan',
    kegiatanId: 'keg_bm_penyelenggaraan_jalan',
    programId: 'prog_bm_jalan',
    kodeSubKegiatan: '1.03.02.2.01.0009',
    namaSubKegiatan: 'Pembangunan Jembatan',
    kinerjaIndikator: 'Jumlah jembatan penghubung yang dibangun',
    satuanTarget: 'Unit / Meter',
    bidangId: 'bina_marga'
  },
  {
    id: 'subkeg_bm_pemeliharaan_berkala',
    kegiatanId: 'keg_bm_penyelenggaraan_jalan',
    programId: 'prog_bm_jalan',
    kodeSubKegiatan: '1.03.02.2.01.0013',
    namaSubKegiatan: 'Pemeliharaan Berkala Jalan',
    kinerjaIndikator: 'Panjang jalan yang dipelihara berkala / overlay aspal',
    satuanTarget: 'Km',
    bidangId: 'bina_marga'
  },

  // --- SUMBER DAYA AIR & BINA KONSTRUKSI ---
  {
    id: 'subkeg_sda_normalisasi_sungai',
    kegiatanId: 'keg_sda_sungai_pantai',
    programId: 'prog_sda_air',
    kodeSubKegiatan: '1.03.03.2.01.0001',
    namaSubKegiatan: 'Normalisasi Saluran Sungai dan Pengendalian Banjir',
    kinerjaIndikator: 'Panjang sungai yang dinormalisasi dan tanggul kritis diperkuat',
    satuanTarget: 'Km / Titik',
    bidangId: 'sda_bk'
  },
  {
    id: 'subkeg_sda_pembangunan_embung',
    kegiatanId: 'keg_sda_sungai_pantai',
    programId: 'prog_sda_air',
    kodeSubKegiatan: '1.03.03.2.01.0006',
    namaSubKegiatan: 'Pembangunan Embung dan Penampung Air Lainnya',
    kinerjaIndikator: 'Kapasitas tampung air tawar konservasi pesisir',
    satuanTarget: 'Unit / M3',
    bidangId: 'sda_bk'
  },
  {
    id: 'subkeg_sda_rehabilitasi_irigasi',
    kegiatanId: 'keg_sda_irigasi',
    programId: 'prog_sda_air',
    kodeSubKegiatan: '1.03.03.2.02.0001',
    namaSubKegiatan: 'Rehabilitasi Jaringan Irigasi Permukaan (D.I.)',
    kinerjaIndikator: 'Luas baku sawah irigasi yang terairi optimal',
    satuanTarget: 'Hektar / Meter',
    bidangId: 'sda_bk'
  },
  {
    id: 'subkeg_sda_tanggul_banjir',
    kegiatanId: 'keg_sda_sungai_pantai',
    programId: 'prog_sda_air',
    kodeSubKegiatan: '1.03.03.2.01.0003',
    namaSubKegiatan: 'Pembangunan Tanggul & Pengendalian Banjir Sungai',
    kinerjaIndikator: 'Panjang tanggul sungai penahan luapan banjir',
    satuanTarget: 'Meter',
    bidangId: 'sda_bk'
  },
  {
    id: 'subkeg_sda_drainase_perkotaan',
    kegiatanId: 'keg_sda_irigasi',
    programId: 'prog_sda_air',
    kodeSubKegiatan: '1.03.03.2.02.0003',
    namaSubKegiatan: 'Peningkatan Saluran Drainase Perkotaan & Kolam Retensi',
    kinerjaIndikator: 'Panjang drainase dan kapasitas kolam retensi perkotaan',
    satuanTarget: 'Meter / Unit',
    bidangId: 'sda_bk'
  },
  {
    id: 'subkeg_sda_pelatihan_jakon',
    kegiatanId: 'keg_sda_bina_konstruksi',
    programId: 'prog_sda_jakon',
    kodeSubKegiatan: '1.03.07.2.01.0001',
    namaSubKegiatan: 'Fasilitasi Sertifikasi dan Pembinaan Jasa Konstruksi',
    kinerjaIndikator: 'Jumlah tenaga kerja konstruksi tersertifikasi',
    satuanTarget: 'Orang',
    bidangId: 'sda_bk'
  },

  // --- CIPTA KARYA ---
  {
    id: 'subkeg_ck_penataan_kawasan',
    kegiatanId: 'keg_ck_penyelenggaraan_gedung',
    programId: 'prog_ck_gedung',
    kodeSubKegiatan: '1.03.04.2.01.0007',
    namaSubKegiatan: 'Penataan Kawasan Permukiman dan Ruang Terbuka Publik (Alun-Alun/Plaza)',
    kinerjaIndikator: 'Luas kawasan ruang publik yang ditata',
    satuanTarget: 'Kawasan / M2',
    bidangId: 'cipta_karya'
  },
  {
    id: 'subkeg_ck_distribusi_air_minum',
    kegiatanId: 'keg_ck_pengembangan_spam',
    programId: 'prog_ck_spam',
    kodeSubKegiatan: '1.03.05.2.01.0001',
    namaSubKegiatan: 'Pembangunan Jaringan Distribusi Air Minum SPAM Ibukota Kecamatan',
    kinerjaIndikator: 'Jumlah sambungan rumah (SR) terlayani air bersih',
    satuanTarget: 'SR / Meter',
    bidangId: 'cipta_karya'
  },
  {
    id: 'subkeg_ck_spald_t',
    kegiatanId: 'keg_ck_air_limbah_persampahan',
    programId: 'prog_ck_sanitasi',
    kodeSubKegiatan: '1.03.06.2.01.0001',
    namaSubKegiatan: 'Pembangunan Sistem Pengolahan Air Limbah Domestik (SPALD-T)',
    kinerjaIndikator: 'Kapasitas IPAL domestik terpusat permukiman padat',
    satuanTarget: 'Unit / KK',
    bidangId: 'cipta_karya'
  },
  {
    id: 'subkeg_ck_rehab_gedung',
    kegiatanId: 'keg_ck_penyelenggaraan_gedung',
    programId: 'prog_ck_gedung',
    kodeSubKegiatan: '1.03.04.2.01.0006',
    namaSubKegiatan: 'Rehabilitasi Fasilitas Gedung Kantor & Bangunan Pelayanan Publik',
    kinerjaIndikator: 'Jumlah fasilitas gedung yang direhabilitasi',
    satuanTarget: 'Unit Gedung',
    bidangId: 'cipta_karya'
  },
  {
    id: 'subkeg_ck_tps3r_sampah',
    kegiatanId: 'keg_ck_air_limbah_persampahan',
    programId: 'prog_ck_sanitasi',
    kodeSubKegiatan: '1.03.06.2.01.0004',
    namaSubKegiatan: 'Pembangunan Fasilitas TPS3R Sirkular Ekonomi & Pengolahan Sampah Terpadu',
    kinerjaIndikator: 'Fasilitas TPS3R beroperasi aktif',
    satuanTarget: 'Unit TPS3R',
    bidangId: 'cipta_karya'
  },

  // --- TATA RUANG & PERTANAHAN ---
  {
    id: 'subkeg_trp_rdtr_industri',
    kegiatanId: 'keg_trp_perencanaan_ruang',
    programId: 'prog_trp_tataruang',
    kodeSubKegiatan: '1.03.08.2.01.0002',
    namaSubKegiatan: 'Penyusunan Rencana Detail Tata Ruang (RDTR) Koridor Strategis/Industri',
    kinerjaIndikator: 'Dokumen Perkada RDTR tersusun dan terintegrasi OSS',
    satuanTarget: 'Dokumen',
    bidangId: 'tata_ruang'
  },
  {
    id: 'subkeg_trp_kajian_tanggul_laut',
    kegiatanId: 'keg_trp_pengendalian_ruang',
    programId: 'prog_trp_tataruang',
    kodeSubKegiatan: '1.03.08.2.02.0003',
    namaSubKegiatan: 'Kajian Teknis Tata Ruang Tanggul Laut Mitigasi Rob Pesisir',
    kinerjaIndikator: 'Laporan kajian daya dukung mitigasi rob pesisir',
    satuanTarget: 'Laporan Kajian',
    bidangId: 'tata_ruang'
  },
  {
    id: 'subkeg_trp_kkpr_gis',
    kegiatanId: 'keg_trp_pengendalian_ruang',
    programId: 'prog_trp_tataruang',
    kodeSubKegiatan: '1.03.08.2.02.0001',
    namaSubKegiatan: 'Penyusunan Dokumen KKPR & Pemetaan GIS Kawasan Pertumbuhan',
    kinerjaIndikator: 'Basis data peta geospasial tematik KKPR',
    satuanTarget: 'Peta / Titik',
    bidangId: 'tata_ruang'
  },
  {
    id: 'subkeg_trp_pengukuran_tanah',
    kegiatanId: 'keg_trp_pengadaan_tanah',
    programId: 'prog_trp_tanah',
    kodeSubKegiatan: '1.03.09.2.01.0001',
    namaSubKegiatan: 'Fasilitasi Pengukuran Teknis Pertanahan Jalan & Saluran Irigasi',
    kinerjaIndikator: 'Jumlah persil/bidang tanah jalan teridentifikasi',
    satuanTarget: 'Bidang / Persil',
    bidangId: 'tata_ruang'
  },
  {
    id: 'subkeg_trp_rtrw_kabupaten',
    kegiatanId: 'keg_trp_perencanaan_ruang',
    programId: 'prog_trp_tataruang',
    kodeSubKegiatan: '1.03.08.2.01.0001',
    namaSubKegiatan: 'Kajian Evaluasi Daya Dukung Lingkungan RTRW Kabupaten Demak',
    kinerjaIndikator: 'Dokumen evaluasi revisi Perda RTRW',
    satuanTarget: 'Dokumen',
    bidangId: 'tata_ruang'
  },

  // --- SEKRETARIAT ---
  {
    id: 'subkeg_sek_server_simon',
    kegiatanId: 'keg_sek_administrasi_umum',
    programId: 'prog_sek_penunjang',
    kodeSubKegiatan: '1.03.01.2.06.0001',
    namaSubKegiatan: 'Pengadaan Server Database & Integrasi Sistem Jaringan SIMON SATUPUTARU',
    kinerjaIndikator: 'Ketersediaan perangkat server terintegrasi',
    satuanTarget: 'Unit Perangkat',
    bidangId: 'sekretariat'
  },
  {
    id: 'subkeg_sek_kendaraan_operasional',
    kegiatanId: 'keg_sek_pengadaan_bmd',
    programId: 'prog_sek_penunjang',
    kodeSubKegiatan: '1.03.01.2.07.0001',
    namaSubKegiatan: 'Pengadaan Kendaraan Operasional Lapangan Pengawasan Infrastruktur',
    kinerjaIndikator: 'Jumlah kendaraan dinas lapangan pengawasan',
    satuanTarget: 'Unit Kendaraan',
    bidangId: 'sekretariat'
  },
  {
    id: 'subkeg_sek_renja_lakip',
    kegiatanId: 'keg_sek_perencanaan_keuangan',
    programId: 'prog_sek_penunjang',
    kodeSubKegiatan: '1.03.01.2.01.0001',
    namaSubKegiatan: 'Penyusunan Dokumen Renja, RKT & LAKIP Akuntabilitas Kinerja',
    kinerjaIndikator: 'Dokumen perencanaan & akuntabilitas kinerja SAKIP',
    satuanTarget: 'Dokumen',
    bidangId: 'sekretariat'
  },
  {
    id: 'subkeg_sek_pemeliharaan_gedung',
    kegiatanId: 'keg_sek_pemeliharaan_bmd',
    programId: 'prog_sek_penunjang',
    kodeSubKegiatan: '1.03.01.2.08.0001',
    namaSubKegiatan: 'Pemeliharaan Rutin Sarana Prasarana Gedung Pelayanan DINPUTARU',
    kinerjaIndikator: 'Gedung kantor terawat dengan layak',
    satuanTarget: 'Unit Gedung',
    bidangId: 'sekretariat'
  },
  {
    id: 'subkeg_sek_atk_kantor',
    kegiatanId: 'keg_sek_administrasi_umum',
    programId: 'prog_sek_penunjang',
    kodeSubKegiatan: '1.03.01.2.06.0002',
    namaSubKegiatan: 'Pengadaan Perlengkapan Kantor & ATK Pendukung Administrasi Kedinasan',
    kinerjaIndikator: 'Ketersediaan ATK penunjang seluruh bidang',
    satuanTarget: 'Paket Kebutuhan',
    bidangId: 'sekretariat'
  }
];

/**
 * Mencari atau mencocokkan sub kegiatan otomatis untuk proyek yang belum memiliki subKegiatanId
 */
export const matchProjectToSubKegiatan = (project, subKegiatanList = INITIAL_SIPD_SUB_KEGIATAN) => {
  if (!project) return null;

  // Jika sudah memiliki subKegiatanId yang valid di list
  if (project.subKegiatanId) {
    const found = subKegiatanList.find((s) => s.id === project.subKegiatanId || s.kodeSubKegiatan === project.subKegiatanId);
    if (found) return found;
  }

  // Jika memiliki kodeSubKegiatan
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
  if (nama.includes('limbah') || nama.includes('spald')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('spald') || s.namaSubKegiatan.toLowerCase().includes('limbah'));
    if (match) return match;
  }
  if (nama.includes('sampah') || nama.includes('tps3r')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('tps3r') || s.namaSubKegiatan.toLowerCase().includes('sampah'));
    if (match) return match;
  }
  if (nama.includes('alun-alun') || nama.includes('kawasan') || nama.includes('plaza')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('alun-alun') || s.namaSubKegiatan.toLowerCase().includes('penataan kawasan'));
    if (match) return match;
  }
  if (nama.includes('gedung') && bId === 'cipta_karya') {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('gedung'));
    if (match) return match;
  }
  if (nama.includes('sungai') || nama.includes('normalisasi')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('normalisasi'));
    if (match) return match;
  }
  if (nama.includes('embung')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('embung'));
    if (match) return match;
  }
  if (nama.includes('irigasi')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('irigasi'));
    if (match) return match;
  }
  if (nama.includes('tanggul')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('tanggul'));
    if (match) return match;
  }
  if (nama.includes('drainase') || nama.includes('retensi')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('drainase'));
    if (match) return match;
  }
  if (nama.includes('rdtr')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('rdtr'));
    if (match) return match;
  }
  if (nama.includes('rtrw')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('rtrw'));
    if (match) return match;
  }
  if (nama.includes('kkpr') || nama.includes('gis')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('kkpr'));
    if (match) return match;
  }
  if (nama.includes('pertanahan') || nama.includes('tanah')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('pertanahan') || s.namaSubKegiatan.toLowerCase().includes('tanah'));
    if (match) return match;
  }
  if (nama.includes('server') || nama.includes('jaringan') || nama.includes('simon')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('server'));
    if (match) return match;
  }
  if (nama.includes('kendaraan')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('kendaraan'));
    if (match) return match;
  }
  if (nama.includes('renja') || nama.includes('lakip')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('renja') || s.namaSubKegiatan.toLowerCase().includes('lakip'));
    if (match) return match;
  }
  if (nama.includes('atk') || nama.includes('kantor')) {
    const match = candidates.find((s) => s.namaSubKegiatan.toLowerCase().includes('atk'));
    if (match) return match;
  }

  // Fallback: kandidat pertama di bidang yang sama
  return candidates.length > 0 ? candidates[0] : subKegiatanList[0];
};

/**
 * Membangun struktur pohon hierarki Program -> Kegiatan -> Sub Kegiatan -> Pekerjaan
 */
export const buildSipdTree = (programs, kegiatans, subKegiatans, projects) => {
  // Mapping project ke sub kegiatan
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

  // Susun Pohon
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
        const subPersenKeu = subTotalKontrak > 0 ? parseFloat(((subTotalPencairan / subTotalKontrak) * 100).toFixed(1)) : 0;

        // Akumulasi ke Kegiatan
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
      const kegPersenKeu = kegTotalKontrak > 0 ? parseFloat(((kegTotalPencairan / kegTotalKontrak) * 100).toFixed(1)) : 0;

      // Akumulasi ke Program
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
    const progPersenKeu = progTotalKontrak > 0 ? parseFloat(((progTotalPencairan / progTotalKontrak) * 100).toFixed(1)) : 0;

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
