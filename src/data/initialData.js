import { generateDemakProjects } from './demakDummyProjects';

export const INITIAL_USERS = [
  {
    id: 'usr_superadmin',
    username: 'admin',
    password: 'pupr2025',
    nama: 'Budi Santoso, ST, M.Eng',
    nip: '19790312 200501 1 004',
    jabatan: 'Pranata Komputer Madya / Administrator Sistem',
    role: 'superadmin',
    bidangId: null,
    email: 'admin.pupr@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_kadin',
    username: 'kadin',
    password: 'pupr2025',
    nama: 'Ir. H. Achmad Syafii, CES, MT',
    nip: '19680514 199303 1 002',
    jabatan: 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang',
    role: 'kadin',
    bidangId: null,
    email: 'kadin.pupr@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_sekretaris',
    username: 'sekretaris',
    password: 'pupr2025',
    nama: 'Dra. Hj. Siti Nurhasanah, MM',
    nip: '19720819 199803 2 003',
    jabatan: 'Sekretaris DINPUTARU',
    role: 'sekretaris',
    bidangId: null,
    email: 'sekretaris.dinputaru@demakkab.go.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_kabid_bm',
    username: 'kabid.bm',
    password: 'pupr2025',
    nama: 'Ir. Dwi Prasetyo, MT',
    nip: '19750422 200212 1 003',
    jabatan: 'Kepala Bidang Bina Marga',
    role: 'kabid',
    bidangId: 'bina_marga',
    email: 'kabid.bm@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_koord_bm',
    username: 'koord.bm',
    password: 'pupr2025',
    nama: 'Agus Suryanto, ST',
    nip: '19840215 200902 1 005',
    jabatan: 'Koordinator / PPK Bidang Bina Marga',
    role: 'koordinator',
    bidangId: 'bina_marga',
    email: 'koord.bm@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_kabid_ck',
    username: 'kabid.ck',
    password: 'pupr2025',
    nama: 'Ir. Bambang Hermanto, MT',
    nip: '19740118 200112 1 001',
    jabatan: 'Kepala Bidang Cipta Karya',
    role: 'kabid',
    bidangId: 'cipta_karya',
    email: 'kabid.ck@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_koord_ck',
    username: 'koord.ck',
    password: 'pupr2025',
    nama: 'Ir. Hendra Wijaya, MT',
    nip: '19820611 200801 1 007',
    jabatan: 'Koordinator / PPK Bidang Cipta Karya',
    role: 'koordinator',
    bidangId: 'cipta_karya',
    email: 'koord.ck@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_kabid_sda',
    username: 'kabid.sda',
    password: 'pupr2025',
    nama: 'Dr. Ir. H. Mulyono, M.Eng',
    nip: '19710925 199703 1 004',
    jabatan: 'Kepala Bidang Sumber Daya Air & Bina Konstruksi',
    role: 'kabid',
    bidangId: 'sda_bk',
    email: 'kabid.sda@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_koord_sda',
    username: 'koord.sda',
    password: 'pupr2025',
    nama: 'Rina Wulandari, ST',
    nip: '19871103 201101 2 009',
    jabatan: 'Koordinator / PPK Bidang SDA & Bina Konstruksi',
    role: 'koordinator',
    bidangId: 'sda_bk',
    email: 'koord.sda@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_kabid_trp',
    username: 'kabid.trp',
    password: 'pupr2025',
    nama: 'Anisa Rahmawati, ST, M.Sc',
    nip: '19810319 200604 2 012',
    jabatan: 'Kepala Bidang Tata Ruang & Pertanahan',
    role: 'kabid',
    bidangId: 'tata_ruang',
    email: 'kabid.trp@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_koord_trp',
    username: 'koord.trp',
    password: 'pupr2025',
    nama: 'Fajar Nugroho, ST',
    nip: '19850914 201001 1 008',
    jabatan: 'Koordinator / PPTK Bidang Tata Ruang & Pertanahan',
    role: 'koordinator',
    bidangId: 'tata_ruang',
    email: 'koord.trp@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_kasubag_progkeu',
    username: 'kasubag.progkeu',
    password: 'pupr2025',
    nama: 'Drs. H. Agus Mulyadi, M.Si',
    nip: '19760812 200312 1 002',
    jabatan: 'Kepala Sub Bagian Program & Keuangan',
    role: 'kasubag_program_keuangan',
    bidangId: 'sekretariat',
    email: 'kasubag.progkeu@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_koord_progkeu',
    username: 'koord.progkeu',
    password: 'pupr2025',
    nama: 'Sri Wahyuni, SE, M.Si',
    nip: '19830528 200701 2 011',
    jabatan: 'Koordinator / Verifikator SPJ Sub Bagian Program & Keuangan',
    role: 'koordinator_program_keuangan',
    bidangId: 'sekretariat',
    email: 'verifikator.keuangan@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_kasubag_umpeg',
    username: 'kasubag.umpeg',
    password: 'pupr2025',
    nama: 'Eko Prasetyo, S.Sos, MM',
    nip: '19780219 200501 1 005',
    jabatan: 'Kepala Sub Bagian Umum & Kepegawaian',
    role: 'kasubag_umpeg',
    bidangId: 'sekretariat',
    email: 'kasubag.umpeg@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_koord_umpeg',
    username: 'koord.umpeg',
    password: 'pupr2025',
    nama: 'Bambang Triyono, S.AP',
    nip: '19860410 201001 1 014',
    jabatan: 'Koordinator Sub Bagian Umum & Kepegawaian',
    role: 'koordinator_umpeg',
    bidangId: 'sekretariat',
    email: 'koord.umpeg@kabupaten.go.id',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PROJECTS = generateDemakProjects();
