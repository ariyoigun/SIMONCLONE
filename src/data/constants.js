export const BIDANG_LIST = [
  {
    id: 'cipta_karya',
    nama: 'Bidang Cipta Karya',
    singkatan: 'CK',
    deskripsi: 'Gedung Pemerintahan, Sanitasi, Air Minum & Penataan Kawasan Permukiman',
    warna: '#2563EB',
    bgLight: 'rgba(37, 99, 235, 0.1)',
    subBagian: []
  },
  {
    id: 'sda_bk',
    nama: 'Bidang Sumber Daya Air & Bina Konstruksi (SDA BK)',
    singkatan: 'SDA-BK',
    deskripsi: 'Irigasi, Normalisasi Sungai, Embung, Drainase Utama & Jasa Konstruksi',
    warna: '#0284C7',
    bgLight: 'rgba(2, 132, 199, 0.1)',
    subBagian: []
  },
  {
    id: 'bina_marga',
    nama: 'Bidang Bina Marga',
    singkatan: 'BM',
    deskripsi: 'Pembangunan & Preservasi Jalan Kabupaten, Jembatan serta Fasilitas Pendukung',
    warna: '#D97706',
    bgLight: 'rgba(217, 119, 6, 0.1)',
    subBagian: []
  },
  {
    id: 'tata_ruang',
    nama: 'Bidang Tata Ruang & Pertanahan',
    singkatan: 'TRP',
    deskripsi: 'RTRW, RDTR, KKPR, Pengendalian Pemanfaatan Ruang & Fasilitasi Pertanahan',
    warna: '#7C3AED',
    bgLight: 'rgba(124, 58, 237, 0.1)',
    subBagian: []
  },
  {
    id: 'sekretariat',
    nama: 'Sekretariat Dinas',
    singkatan: 'SEKR',
    deskripsi: 'Sub Bagian Umum & Kepegawaian serta Sub Bagian Program & Keuangan',
    warna: '#0F766E',
    bgLight: 'rgba(15, 118, 110, 0.1)',
    subBagian: ['Sub Bagian Umum & Kepegawaian', 'Sub Bagian Program & Keuangan']
  }
];

export const ROLE_DEFINITIONS = {
  superadmin: {
    id: 'superadmin',
    nama: 'Super Admin',
    badge: 'Superadmin System',
    canSeeAllBidang: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
    canManageYears: true,
    canManageSettings: true,
    canAccessSPJ: true,
    canEditSPJ: true,
    readOnly: false,
    keterangan: 'Akses penuh seluruh bidang, manajemen akun, manajemen tahun anggaran, dan pengaturan keberlanjutan sistem.'
  },
  kadin: {
    id: 'kadin',
    nama: 'Kepala Dinas',
    badge: 'Eksekutif Kepala Dinas',
    canSeeAllBidang: true,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canManageYears: false,
    canManageSettings: false,
    canAccessSPJ: true,
    canEditSPJ: false,
    readOnly: true,
    keterangan: 'Pemantauan eksekutif pimpinan tertinggi untuk seluruh pekerjaan di semua bidang dan administrasi SPJ (Read-Only).'
  },
  sekretaris: {
    id: 'sekretaris',
    nama: 'Sekretaris Dinas',
    badge: 'Eksekutif Sekretaris',
    canSeeAllBidang: true,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canManageYears: false,
    canManageSettings: false,
    canAccessSPJ: true,
    canEditSPJ: false,
    readOnly: true,
    keterangan: 'Memantau seluruh pekerjaan di semua bidang teknis, Sekretariat, dan administrasi keuangan (Read-Only).'
  },
  kabid: {
    id: 'kabid',
    nama: 'Kepala Bidang',
    badge: 'Viewer Bidang',
    canSeeAllBidang: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canManageYears: false,
    canManageSettings: false,
    canAccessSPJ: false,
    canEditSPJ: false,
    readOnly: true,
    keterangan: 'Memantau dan melihat rekap pekerjaan khusus bidang yang dipimpin (Read-Only).'
  },
  koordinator: {
    id: 'koordinator',
    nama: 'Koordinator Bidang Teknis',
    badge: 'Input & Editor Bidang',
    canSeeAllBidang: false,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: false,
    canManageYears: false,
    canManageSettings: false,
    canAccessSPJ: false,
    canEditSPJ: false,
    readOnly: false,
    keterangan: 'Dapat menginput dan mengubah data pekerjaan pra-kontrak, fisik, dan keuangan di bidangnya.'
  },
  kasubag_program_keuangan: {
    id: 'kasubag_program_keuangan',
    nama: 'Kasubag Program & Keuangan',
    badge: 'Pimpinan Tim Keuangan',
    canSeeAllBidang: true,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canManageYears: false,
    canManageSettings: false,
    canAccessSPJ: true,
    canEditSPJ: true,
    readOnly: false,
    keterangan: 'Memantau dan memverifikasi administrasi berkas SPJ, status koreksi, dan penerbitan SPM seluruh dinas.'
  },
  koordinator_program_keuangan: {
    id: 'koordinator_program_keuangan',
    nama: 'Koordinator / Verifikator SPJ Keuangan',
    badge: 'Verifikator SPJ Keuangan',
    canSeeAllBidang: true,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
    canManageYears: false,
    canManageSettings: false,
    canAccessSPJ: true,
    canEditSPJ: true,
    readOnly: false,
    keterangan: 'Menerima, mengoreksi, mengembalikan, dan menerbitkan SPM/SP2D untuk berkas SPJ pekerjaan dinas.'
  },
  kasubag_umpeg: {
    id: 'kasubag_umpeg',
    nama: 'Kasubag Umum & Kepegawaian',
    badge: 'Viewer Subag Umpeg',
    canSeeAllBidang: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canManageYears: false,
    canManageSettings: false,
    canAccessSPJ: false,
    canEditSPJ: false,
    readOnly: true,
    keterangan: 'Memantau paket pekerjaan pengadaan dan fasilitas di Sub Bagian Umum & Kepegawaian (Read-Only).'
  },
  koordinator_umpeg: {
    id: 'koordinator_umpeg',
    nama: 'Koordinator Sub Bagian Umum & Kepegawaian',
    badge: 'Input Subag Umpeg',
    canSeeAllBidang: false,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: false,
    canManageYears: false,
    canManageSettings: false,
    canAccessSPJ: false,
    canEditSPJ: false,
    readOnly: false,
    keterangan: 'Menginput dan mengelola paket pengadaan barang/jasa penunjang kantor di Sub Bagian Umpeg.'
  }
};

export const DEFAULT_TAGS = [
  'Program Prioritas Bupati',
  'DBHCHT',
  'Penanggulangan Kemiskinan',
  'Dana Alokasi Khusus (DAK)',
  'Penanganan Stunting',
  'Inpres Jalan Daerah (IJD)',
  'Siaga Bencana Banjir',
  'Kawasan Strategis Kabupaten (KSK)',
  'Pemberdayaan Masyarakat'
];

export const STATUS_SPJ_KEUANGAN = [
  {
    id: 'belum_masuk',
    label: 'Belum Mengajukan SPJ',
    warna: '#64748b',
    bgLight: '#f1f5f9',
    borderColor: '#cbd5e1',
    badgeClass: 'badge-belum',
    deskripsi: 'Penyedia atau PPTK belum menyerahkan berkas SPJ ke Tim Keuangan'
  },
  {
    id: 'sudah_masuk',
    label: 'Berkas SPJ Sudah Masuk',
    warna: '#0284c7',
    bgLight: '#e0f2fe',
    borderColor: '#7dd3fc',
    badgeClass: 'badge-selesai',
    deskripsi: 'Berkas fisik SPJ telah diterima di meja Sub Bagian Program & Keuangan, antre verifikasi'
  },
  {
    id: 'sudah_koreksi',
    label: 'Sedang Dikoreksi / Verifikasi',
    warna: '#6366f1',
    bgLight: '#eef2ff',
    borderColor: '#a5b4fc',
    badgeClass: 'badge-perhatian',
    deskripsi: 'Verifikator keuangan sedang memeriksa bukti pengeluaran, pajak, dan kelengkapan teknis'
  },
  {
    id: 'dikembalikan',
    label: 'Dikembalikan (Perlu Revisi)',
    warna: '#dc2626',
    bgLight: '#fee2e2',
    borderColor: '#fca5a5',
    badgeClass: 'badge-kritis',
    deskripsi: 'Berkas SPJ dikembalikan ke rekanan/bidang karena salah perhitungan pajak atau bukti belum lengkap'
  },
  {
    id: 'spj_lengkap',
    label: 'SPJ Lengkap & Disetujui',
    warna: '#059669',
    bgLight: '#d1fae5',
    borderColor: '#6ee7b7',
    badgeClass: 'badge-aman',
    deskripsi: 'Verifikasi keuangan selesai dan disetujui, siap penerbitan Surat Perintah Membayar (SPM)'
  },
  {
    id: 'sudah_spm',
    label: 'Sudah Terbit SPM',
    warna: '#7c3aed',
    bgLight: '#ede9fe',
    borderColor: '#c4b5fd',
    badgeClass: 'badge-selesai',
    deskripsi: 'Surat Perintah Membayar (SPM) telah diterbitkan dan disampaikan ke BPKAD / Kas Daerah'
  },
  {
    id: 'sudah_sp2d',
    label: 'Sudah Terbit SP2D (Selesai Cair)',
    warna: '#0f766e',
    bgLight: '#ccfbf1',
    borderColor: '#5eead4',
    badgeClass: 'badge-aman',
    deskripsi: 'SP2D telah terbit dari Kas Daerah dan dana telah masuk ke rekening penyedia'
  }
];

export const DEFAULT_KATEGORI_PEKERJAAN = [
  {
    id: 'fisik',
    nama: 'Fisik',
    deskripsi: 'Pekerjaan konstruksi fisik jalan, jembatan, gedung, saluran irigasi, dan infrastruktur',
    jenisPengadaan: ['Tender', 'Pengadaan Langsung', 'Minikom']
  },
  {
    id: 'jakon',
    nama: 'Jakon',
    deskripsi: 'Jasa Konstruksi / Konsultansi (Perencanaan, Pengawasan, dan Studi Kelayakan)',
    jenisPengadaan: ['Pengadaan Langsung', 'Seleksi']
  },
  {
    id: 'barang',
    nama: 'Barang',
    deskripsi: 'Pengadaan barang, perlengkapan, material operasional, dan peralatan teknis',
    jenisPengadaan: ['e-Purchasing', 'Dikecualikan']
  },
  {
    id: 'jasa_lainnya',
    nama: 'Jasa Lainnya',
    deskripsi: 'Layanan jasa non-konstruksi, pemeliharaan rutin, kebersihan, dan sewa sarana',
    jenisPengadaan: ['Pengadaan Langsung', 'e-Purchasing']
  },
  {
    id: 'swakelola',
    nama: 'Swakelola',
    deskripsi: 'Pekerjaan yang direncanakan, dikerjakan, dan diawasi sendiri tanpa penyedia luar',
    jenisPengadaan: ['Swakelola']
  }
];

export const TIPE_PENGADAAN = [
  'Tender',
  'Pengadaan Langsung',
  'Minikom',
  'Seleksi',
  'e-Purchasing',
  'Dikecualikan',
  'Swakelola'
];

export const SUMBER_DANA = [
  'APBD Murni (DAU)',
  'Dana Alokasi Khusus (DAK) Fisik',
  'Dana Bagi Hasil (DBH)',
  'Bantuan Keuangan Provinsi (Banprov)',
  'APBD-P (Perubahan)',
  'Dana Insentif Fiskal (DIF)',
  'Pinjaman Daerah / Lainnya'
];

export const TAHAPAN_PRA_KONTRAK = [
  { id: 'rup', label: '1. Entri SiRUP', order: 1, warna: '#0284c7', bgLight: '#e0f2fe' },
  { id: 'survei_lokasi', label: '2. Survei Lokasi', order: 2, warna: '#0369a1', bgLight: '#e0f2fe' },
  { id: 'survei_harga', label: '3. Survei Harga', order: 3, warna: '#0891b2', bgLight: '#cffafe' },
  { id: 'perencanaan', label: '4. Perencanaan', order: 4, warna: '#6366f1', bgLight: '#eef2ff' },
  { id: 'kirim_lpse', label: '5. Kirim LPSE', order: 5, warna: '#8b5cf6', bgLight: '#f3e8ff' },
  { id: 'rpp', label: '6. RPP', order: 6, warna: '#a855f7', bgLight: '#fae8ff' },
  { id: 'revisi', label: '7. Revisi', order: 7, warna: '#f59e0b', bgLight: '#fef3c7' },
  { id: 'tayang', label: '8. Tayang', order: 8, warna: '#d97706', bgLight: '#fef3c7' },
  { id: 're_tender', label: '9. Re Tender', order: 9, warna: '#ea580c', bgLight: '#ffedd5' },
  { id: 'sppbj', label: '10. Pra Kontrak (SPPBJ)', order: 10, warna: '#7c3aed', bgLight: '#ede9fe' },
  { id: 'kontrak', label: '11. Kontrak', order: 11, warna: '#059669', bgLight: '#d1fae5' },
  { id: 'batal', label: '12. Batal', order: 12, warna: '#dc2626', bgLight: '#fee2e2' }
];

export const LIFECYCLE_STAGES = [
  {
    id: 'rup',
    order: 1,
    nama: 'Entri SiRUP & Persiapan',
    singkatan: 'SiRUP & Persiapan',
    badgeText: 'Tahap 1: Perencanaan',
    deskripsi: 'Identifikasi kebutuhan, entri SiRUP LKPP, survei lokasi dan harga',
    warna: '#0284C7',
    warnaHover: '#0369A1',
    bgLight: 'rgba(2, 132, 199, 0.1)',
    borderColor: '#7dd3fc'
  },
  {
    id: 'perencanaan',
    order: 2,
    nama: 'Perencanaan & Dokumen',
    singkatan: 'Perencanaan',
    badgeText: 'Tahap 2: Perencanaan',
    deskripsi: 'Penyusunan KAK, HPS, gambar teknis, dan dokumen pemilihan',
    warna: '#6366F1',
    warnaHover: '#4F46E5',
    bgLight: 'rgba(99, 102, 241, 0.1)',
    borderColor: '#a5b4fc'
  },
  {
    id: 'pbj',
    order: 3,
    nama: 'Proses Pemilihan / LPSE',
    singkatan: 'LPSE & Tayang',
    badgeText: 'Tahap 3: Pemilihan PBJ',
    deskripsi: 'Kirim LPSE, RPP, Tayang Tender / Pengadaan Langsung / Minikom',
    warna: '#D97706',
    warnaHover: '#B45309',
    bgLight: 'rgba(217, 119, 6, 0.12)',
    borderColor: '#fcd34d'
  },
  {
    id: 'sppbj',
    order: 4,
    nama: 'Penetapan & SPPBJ',
    singkatan: 'SPPBJ',
    badgeText: 'Tahap 4: Penetapan',
    deskripsi: 'Evaluasi penawaran, penetapan calon pemenang, masa sanggah, & SPPBJ',
    warna: '#8B5CF6',
    warnaHover: '#7C3AED',
    bgLight: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#c4b5fd'
  },
  {
    id: 'fisik',
    order: 5,
    nama: 'Pelaksanaan Kontrak (Fisik)',
    singkatan: 'Fisik Kontrak',
    badgeText: 'Tahap 5: Pelaksanaan',
    deskripsi: 'Kontrak aktif ditandatangani, pelaksanaan fisik lapangan 0% s/d 99%',
    warna: '#059669',
    warnaHover: '#047857',
    bgLight: 'rgba(5, 150, 105, 0.1)',
    borderColor: '#6ee7b7'
  },
  {
    id: 'selesai',
    order: 6,
    nama: 'Selesai / PHO (100%)',
    singkatan: 'Selesai 100%',
    badgeText: 'Tahap 6: Serah Terima',
    deskripsi: 'Pekerjaan fisik selesai 100% dan penandatanganan Berita Acara PHO',
    warna: '#0F766E',
    warnaHover: '#115E59',
    bgLight: 'rgba(15, 118, 110, 0.12)',
    borderColor: '#5eead4'
  },
  {
    id: 'batal',
    order: 99,
    nama: 'Dibatalkan (Batal)',
    singkatan: 'Batal',
    badgeText: 'Status: Batal',
    deskripsi: 'Pekerjaan dibatalkan dan tidak dilanjutkan',
    warna: '#DC2626',
    warnaHover: '#B91C1C',
    bgLight: 'rgba(220, 38, 38, 0.1)',
    borderColor: '#fca5a5'
  }
];

export const getProjectLifecycleStage = (project) => {
  const status = project.tahapPraKontrak?.status;
  if (status === 'batal') return 'batal';

  if (project.isKontrak || status === 'kontrak') {
    const fRealisasi = parseFloat(project.dataFisik?.progresRealisasi || 0);
    if (fRealisasi >= 100) {
      return 'selesai';
    }
    return 'fisik';
  }

  // Belum kontrak (Tahapan Pra-kontrak 1 - 10)
  if (status === 'rup' || status === 'survei_lokasi' || status === 'survei_harga') return 'rup';
  if (status === 'perencanaan' || status === 'hps') return 'perencanaan';
  if (status === 'kirim_lpse' || status === 'rpp' || status === 'revisi' || status === 'tayang' || status === 're_tender' || status === 'pemilihan' || status === 'pbj') return 'pbj';
  if (status === 'sppbj' || status === 'evaluasi') return 'sppbj';
  return 'rup';
};

export const DEFAULT_YEARS = [2024, 2025, 2026, 2027];

export const JENIS_ANGGARAN = ['Murni', 'APBD-P'];

export const KECAMATAN_DEMAK = [
  'Bonang',
  'Demak',
  'Dempet',
  'Gajah',
  'Guntur',
  'Karanganyar',
  'Karangawen',
  'Karangtengah',
  'Kebonagung',
  'Mijen',
  'Mranggen',
  'Sayung',
  'Wedung',
  'Wonosalam'
];

export const DESA_DEMAK_BY_KECAMATAN = {
  Bonang: [
    'Betahwalang',
    'Bonangrejo',
    'Gebang',
    'Gebangarum',
    'Jali',
    'Jatimulyo',
    'Karangrejo',
    'Kertomulyo',
    'Margolinduk',
    'Morodemak',
    'Poncorejo',
    'Purworejo',
    'Rohobayan',
    'Serang',
    'Sukodono',
    'Sumberejo',
    'Tlogoboyo',
    'Tridonorejo',
    'Weding',
    'Wonosari'
  ],
  Demak: [
    'Bango',
    'Betokan (Kelurahan)',
    'Bintoro (Kelurahan)',
    'Bolo',
    'Cabean',
    'Donorejo',
    'Kadilangu (Kelurahan)',
    'Kalicilik (Kelurahan)',
    'Kalikondang',
    'Karangmlati',
    'Katonsari',
    'Kedondong',
    'Mangunjiwan (Kelurahan)',
    'Mulyorejo',
    'Raji',
    'Sedo',
    'Singorejo (Kelurahan)',
    'Tempuran',
    'Turirejo'
  ],
  Dempet: [
    'Balerejo',
    'Baleromo',
    'Botosengon',
    'Brakas',
    'Dempet',
    'Gempoldenok',
    'Harjowinangun',
    'Jerukgulung',
    'Karangrejo',
    'Kebonsari',
    'Kedungori',
    'Kramat',
    'Kuwu',
    'Merak',
    'Sidomulyo'
  ],
  Gajah: [
    'Banjarsari',
    'Boyolali',
    'Gajah',
    'Gedangalas',
    'Jatisono',
    'Kedondong',
    'Medini',
    'Mlaten',
    'Sambiroto',
    'Sambung',
    'Sari',
    'Surodadi',
    'Tambirejo',
    'Tanjunganyar',
    'Tlogopandogan',
    'Wilalung'
  ],
  Guntur: [
    'Bakalrejo',
    'Banjarejo',
    'Blerong',
    'Bogosari',
    'Bumiharjo',
    'Guntur',
    'Krandon',
    'Pamongan',
    'Sarirejo',
    'Sidoharjo',
    'Sidokumpul',
    'Sukorejo',
    'Tangkis',
    'Temuroso',
    'Tlogorejo',
    'Tlogoweru',
    'Trimulyo',
    'Turitempel',
    'Wonorejo'
  ],
  Karanganyar: [
    'Bandungrejo',
    'Cangkring',
    'Cangkring Pos',
    'Cangkring Rembang',
    'Karanganyar',
    'Kedungwaru Kidul',
    'Kedungwaru Lor',
    'Ketanjung',
    'Kotakan',
    'Ngaluran',
    'Ngemplik Wetan',
    'Tugu Lor',
    'Tuwang',
    'Undaan Kidul',
    'Undaan Lor',
    'Wonorejo'
  ],
  Karangawen: [
    'Brambang',
    'Bumirejo',
    'Jragung',
    'Karangawen',
    'Kuripan',
    'Margohayu',
    'Pundenarum',
    'Rejosari',
    'Sidomukti',
    'Teluk',
    'Tlogorejo',
    'Wonosekar'
  ],
  Karangtengah: [
    'Batu',
    'Donorejo',
    'Drono',
    'Grogol',
    'Karangsari',
    'Karangtowo',
    'Kedunguter',
    'Klitih',
    'Pidodo',
    'Ploso',
    'Pulosari',
    'Rejosari',
    'Sampang',
    'Tambakbulusan',
    'Wonoagung',
    'Wonokerto'
  ],
  Kebonagung: [
    'Babadan',
    'Kebonagung',
    'Klampok Lor',
    'Mangunrejo',
    'Megonten',
    'Mijen',
    'Pilangwetan',
    'Prigi',
    'Soko',
    'Solowire',
    'Tlogosih',
    'Werdoyo'
  ],
  Mijen: [
    'Bakung',
    'Bermi',
    'Geneng',
    'Jleper',
    'Mijen',
    'Mlaten',
    'Morosari',
    'Ngegot',
    'Ngelo Kulon',
    'Ngelo Wetan',
    'Pasir',
    'Pecuk',
    'Rejosari',
    'Tanggul'
  ],
  Mranggen: [
    'Banyumeneng',
    'Batursari',
    'Brumbung',
    'Candisari',
    'Jamus',
    'Kalitengah',
    'Kangkung',
    'Karangsono',
    'Kebonbatur',
    'Kembangarum',
    'Menur',
    'Mranggen',
    'Ngemplak',
    'Sumberejo',
    'Tamansari',
    'Tegalarum',
    'Waru',
    'Wringinjajar'
  ],
  Sayung: [
    'Banjarsari',
    'Bedono',
    'Bulusari',
    'Dombo',
    'Kalisari',
    'Karangasem',
    'Loireng',
    'Morosari',
    'Pilangsari',
    'Prampelan',
    'Sayung',
    'Sidogemah',
    'Sidorejo',
    'Sriwulan',
    'Surodadi',
    'Tambakroto',
    'Timbulsloko',
    'Tugu'
  ],
  Wedung: [
    'Babalan',
    'Berahan Kulon',
    'Berahan Wetan',
    'Buko',
    'Bungo',
    'Jetak',
    'Jungpasir',
    'Jungsemi',
    'Kedungkarang',
    'Kedungmutih',
    'Kenduren',
    'Mandung',
    'Mutih Kulon',
    'Mutih Wetan',
    'Ngawen',
    'Ruwit',
    'Tedunan',
    'Tempel',
    'Wedung'
  ],
  Wonosalam: [
    'Botorejo',
    'Bunderan',
    'Doreng',
    'Getas',
    'Jogoloyo',
    'Kalianyar',
    'Karangrejo',
    'Karangrowo',
    'Kendaldoyong',
    'Keranjinan',
    'Kuncir',
    'Lempuyang',
    'Mojodemak',
    'Pilangrejo',
    'Sidomulyo',
    'Tlogodowo',
    'Tlogorejo',
    'Trengguli',
    'Wonosalam'
  ]
};

export const DEFAULT_SYSTEM_SETTINGS = {
  namaSistem: 'SIMON - SATUPUTARU',
  subNama: 'Sistem Informasi Monitoring Progres Pekerjaan DINPUTARU',
  instansi: 'Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak',
  singkatanInstansi: 'DINPUTARU Demak',
  deskripsi:
    'Platform terpadu pemantauan dan pengendalian paket pekerjaan konstruksi, preservasi jalan, pengelolaan sumber daya air, cipta karya, dan penataan ruang di Kabupaten Demak dari perencanaan pra-kontrak hingga serah terima akhir.',
  logoUrl: '', // Kosong = gunakan logo dinas PU default beraksen emas
  maxPublicHighlights: 10, // Maksimal jumlah paket sorotan yang tampil di landing page publik
  alamat: 'Jl. Kyai Singkil No. 7, Bintoro, Kec. Demak, Kabupaten Demak, Jawa Tengah 59511',
  telepon: '(0291) 685123',
  email: 'dinputaru@demakkab.go.id',
  website: 'https://dinputaru.demakkab.go.id',
  // Pejabat Pimpinan Penandatangan Resmi (Dapat diubah Superadmin)
  namaKepalaDinas: 'Ir. H. Achmad Syafii, CES, MT',
  nipKepalaDinas: '19680514 199303 1 002',
  pangkatKepalaDinas: 'Pembina Utama Madya (IV/d)',
  jabatanKepalaDinas: 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang',
  namaSekretaris: 'Dra. Hj. Siti Nurhasanah, MM',
  nipSekretaris: '19720819 199803 2 003',
  pangkatSekretaris: 'Pembina Tingkat I (IV/b)',
  jabatanSekretaris: 'Sekretaris DINPUTARU',
  galeri: [
    {
      id: 'gal-1',
      judul: 'Gedung Kantor DINPUTARU Kabupaten Demak',
      kategori: 'Gedung Kantor',
      lokasi: 'Jl. Kyai Singkil No. 7, Kec. Demak',
      tahun: 2024,
      deskripsi: 'Gedung induk pelayanan administrasi teknis dan penataan ruang DINPUTARU Kab. Demak.',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'gal-2',
      judul: 'Penataan Kawasan Alun-Alun Simpang Enam Demak',
      kategori: 'Cipta Karya',
      lokasi: 'Kecamatan Demak (Pusat Kota)',
      tahun: 2024,
      deskripsi: 'Revitalisasi ruang terbuka hijau publik, pedestrian ramah disabilitas, dan ikon Kota Wali.',
      url: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'gal-3',
      judul: 'Pembangunan Jembatan Kracaan Dempet - Kebonagung',
      kategori: 'Bina Marga',
      lokasi: 'Kecamatan Dempet & Kebonagung',
      tahun: 2025,
      deskripsi: 'Jembatan gelagar beton pratekan bentang 40 meter penghubung sentra pertanian antar kecamatan.',
      url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'gal-4',
      judul: 'Tanggul Pengendali Banjir Sungai Wulan Karanganyar',
      kategori: 'Sumber Daya Air',
      lokasi: 'Desa Ketanjung, Kec. Karanganyar',
      tahun: 2024,
      deskripsi: 'Perkuatan parapet beton dan tanggul tanah kritis pencegah luapan banjir Sungai Wulan.',
      url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'gal-5',
      judul: 'Peninggian Jalan Rob & Tanggul Sayung - Morosari',
      kategori: 'Bina Marga',
      lokasi: 'Kecamatan Sayung (Pesisir)',
      tahun: 2025,
      deskripsi: 'Rekonstruksi jalan beton bertulang rigid pavement tahan genangan air rob pantai utara.',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'gal-6',
      judul: 'Pembangunan Embung Konservasi Air Tawar Timbulsloko',
      kategori: 'Sumber Daya Air',
      lokasi: 'Desa Timbulsloko, Kec. Sayung',
      tahun: 2025,
      deskripsi: 'Penyediaan cadangan air baku masyarakat pesisir di masa kemarau berkapasitas 45.000 m³.',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'gal-7',
      judul: 'Pusat Distribusi Air Minum SPAM Regional Wedung',
      kategori: 'Cipta Karya',
      lokasi: 'Kecamatan Wedung',
      tahun: 2024,
      deskripsi: 'Reservoir distribusi air bersih berkapasitas 50 liter/detik untuk 4.200 sambungan rumah.',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'gal-8',
      judul: 'Pengembangan Kawasan Industri & Logistik Sayung (RDTR)',
      kategori: 'Tata Ruang',
      lokasi: 'Koridor Tol Semarang - Demak Kec. Sayung',
      tahun: 2025,
      deskripsi: 'Perencanaan tata ruang terintegrasi simpul transportasi logistik dan sabuk mitigasi pesisir.',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80'
    }
  ]
};

