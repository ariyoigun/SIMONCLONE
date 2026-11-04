/**
 * MASTER DATA NOMENKLATUR SIPD KEMENDAGRI (DINPUTARU KABUPATEN DEMAK)
 * Berdasarkan Klasifikasi/Kodefikasi Standar SIPD RI Kemendagri & Excel Rencana Kerja 2026
 * Total Program: 11
 * Total Kegiatan: 22
 * Total Sub Kegiatan: 88
 */

export const INITIAL_SIPD_PROGRAMS = [
  {
    "id": "prog_sekretariat_1_03_01",
    "kodeProgram": "1.03.01",
    "namaProgram": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
    "bidangId": "sekretariat",
    "deskripsi": "Perencanaan, penganggaran, administrasi keuangan, kepegawaian, pengadaan sarana dan pemeliharaan BMD DINPUTARU"
  },
  {
    "id": "prog_sda_bk_1_03_02",
    "kodeProgram": "1.03.02",
    "namaProgram": "PROGRAM PENGELOLAAN SUMBER DAYA AIR (SDA)",
    "bidangId": "sda_bk",
    "deskripsi": "Pengelolaan sungai, waduk/embung, pintu air, stasiun pompa banjir, dan jaringan irigasi pertanian"
  },
  {
    "id": "prog_cipta_karya_1_03_03",
    "kodeProgram": "1.03.03",
    "namaProgram": "PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM PENYEDIAAN AIR MINUM",
    "bidangId": "cipta_karya",
    "deskripsi": "Pembangunan dan peningkatan SPAM jaringan perpipaan serta sambungan rumah bagi masyarakat"
  },
  {
    "id": "prog_cipta_karya_1_03_05",
    "kodeProgram": "1.03.05",
    "namaProgram": "PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM AIR LIMBAH",
    "bidangId": "cipta_karya",
    "deskripsi": "Pembangunan tangki septik individu/komunal, TPS3R, dan instalasi pengolahan limbah domestik"
  },
  {
    "id": "prog_cipta_karya_1_03_06",
    "kodeProgram": "1.03.06",
    "namaProgram": "PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM DRAINASE",
    "bidangId": "cipta_karya",
    "deskripsi": "Pembangunan, rehabilitasi sistem drainase perkotaan dan saluran pembuang primer/sekunder"
  },
  {
    "id": "prog_cipta_karya_1_03_08",
    "kodeProgram": "1.03.08",
    "namaProgram": "PROGRAM PENATAAN BANGUNAN GEDUNG",
    "bidangId": "cipta_karya",
    "deskripsi": "Pembangunan dan rehabilitasi gedung kantor, fasilitas umum, dan kawasan permukiman"
  },
  {
    "id": "prog_bina_marga_1_03_10",
    "kodeProgram": "1.03.10",
    "namaProgram": "PROGRAM PENYELENGGARAAN JALAN",
    "bidangId": "bina_marga",
    "deskripsi": "Pembangunan, rekonstruksi, pelebaran jalan kabupaten dan pemeliharaan jembatan"
  },
  {
    "id": "prog_sda_bk_1_03_11",
    "kodeProgram": "1.03.11",
    "namaProgram": "PROGRAM PENGEMBANGAN JASA KONSTRUKSI",
    "bidangId": "sda_bk",
    "deskripsi": "Pelatihan tenaga kerja terampil konstruksi, pembinaan kelembagaan dan sertifikasi kompetensi"
  },
  {
    "id": "prog_tata_ruang_1_03_12",
    "kodeProgram": "1.03.12",
    "namaProgram": "PROGRAM PENYELENGGARAAN PENATAAN RUANG",
    "bidangId": "tata_ruang",
    "deskripsi": "Persetujuan substansi RTRW/RDTR, KKPR, sinkronisasi pemanfaatan ruang, dan forum penataan ruang"
  },
  {
    "id": "prog_tata_ruang_2_10_01",
    "kodeProgram": "2.10.01",
    "namaProgram": "PROGRAM REDISTRIBUSI TANAH, DAN GANTI KERUGIAN PROGRAM TANAH KELEBIHAN MAKSIMUM DAN TANAH ABSENTEE",
    "bidangId": "tata_ruang",
    "deskripsi": "Gugus Tugas Reforma Agraria (GTRA) dan redistribusi tanah di Kabupaten Demak"
  },
  {
    "id": "prog_tata_ruang_2_10_02",
    "kodeProgram": "2.10.02",
    "namaProgram": "PROGRAM PENATAGUNAAN TANAH",
    "bidangId": "tata_ruang",
    "deskripsi": "Koordinasi konsolidasi tanah dan penataan penguasaan tanah daerah"
  }
];

export const INITIAL_SIPD_KEGIATAN = [
  {
    "id": "keg_sekretariat_1",
    "programId": "prog_sekretariat_1_03_01",
    "kodeKegiatan": "1.03.01.2.01",
    "namaKegiatan": "Perencanaan, Penganggaran, dan Evaluasi Kinerja Perangkat Daerah",
    "bidangId": "sekretariat"
  },
  {
    "id": "keg_sekretariat_2",
    "programId": "prog_sekretariat_1_03_01",
    "kodeKegiatan": "1.03.01.2.02",
    "namaKegiatan": "Administrasi Keuangan Perangkat Daerah",
    "bidangId": "sekretariat"
  },
  {
    "id": "keg_sekretariat_3",
    "programId": "prog_sekretariat_1_03_01",
    "kodeKegiatan": "1.03.01.2.03",
    "namaKegiatan": "Administrasi Barang Milik Daerah pada Perangkat Daerah",
    "bidangId": "sekretariat"
  },
  {
    "id": "keg_sekretariat_4",
    "programId": "prog_sekretariat_1_03_01",
    "kodeKegiatan": "1.03.01.2.04",
    "namaKegiatan": "Administrasi Kepegawaian Perangkat Daerah",
    "bidangId": "sekretariat"
  },
  {
    "id": "keg_sekretariat_5",
    "programId": "prog_sekretariat_1_03_01",
    "kodeKegiatan": "1.03.01.2.06",
    "namaKegiatan": "Administrasi Umum Perangkat Daerah",
    "bidangId": "sekretariat"
  },
  {
    "id": "keg_sekretariat_6",
    "programId": "prog_sekretariat_1_03_01",
    "kodeKegiatan": "1.03.01.2.07",
    "namaKegiatan": "Pengadaan Barang Milik Daerah Penunjang Urusan Pemerintah Daerah",
    "bidangId": "sekretariat"
  },
  {
    "id": "keg_sekretariat_7",
    "programId": "prog_sekretariat_1_03_01",
    "kodeKegiatan": "1.03.01.2.08",
    "namaKegiatan": "Penyediaan Jasa Penunjang Urusan Pemerintahan Daerah",
    "bidangId": "sekretariat"
  },
  {
    "id": "keg_sekretariat_8",
    "programId": "prog_sekretariat_1_03_01",
    "kodeKegiatan": "1.03.01.2.09",
    "namaKegiatan": "Pemeliharaan Barang Milik Daerah Penunjang Urusan Pemerintahan Daerah",
    "bidangId": "sekretariat"
  },
  {
    "id": "keg_sda_bk_9",
    "programId": "prog_sda_bk_1_03_02",
    "kodeKegiatan": "1.03.02.2.01",
    "namaKegiatan": "Pengelolaan SDA dan Bangunan Pengaman Pantai pada Wilayah Sungai (WS) dalam 1 (satu) Daerah Kabupaten/Kota",
    "bidangId": "sda_bk"
  },
  {
    "id": "keg_sda_bk_10",
    "programId": "prog_sda_bk_1_03_02",
    "kodeKegiatan": "1.03.02.2.02",
    "namaKegiatan": "Pengembangan dan Pengelolaan Sistem Irigasi Primer dan Sekunder pada Daerah Irigasi yang Luasnya dibawah 1000 Ha dalam 1 (Satu) Daerah Kabupaten/Kota",
    "bidangId": "sda_bk"
  },
  {
    "id": "keg_cipta_karya_11",
    "programId": "prog_cipta_karya_1_03_03",
    "kodeKegiatan": "1.03.03.2.01",
    "namaKegiatan": "Pengelolaan dan Pengembangan Sistem Penyediaan Air Minum (SPAM) di Daerah Kabupaten/Kota",
    "bidangId": "cipta_karya"
  },
  {
    "id": "keg_cipta_karya_12",
    "programId": "prog_cipta_karya_1_03_05",
    "kodeKegiatan": "1.03.05.2.01",
    "namaKegiatan": "Pengelolaan dan Pengembangan Sistem Air Limbah Domestik dalam Daerah Kabupaten/Kota",
    "bidangId": "cipta_karya"
  },
  {
    "id": "keg_cipta_karya_13",
    "programId": "prog_cipta_karya_1_03_06",
    "kodeKegiatan": "1.03.06.2.01",
    "namaKegiatan": "Pengelolaan dan Pengembangan Sistem Drainase yang Terhubung Langsung dengan Sungai dalam daerah Kabupaten/Kota",
    "bidangId": "cipta_karya"
  },
  {
    "id": "keg_cipta_karya_14",
    "programId": "prog_cipta_karya_1_03_08",
    "kodeKegiatan": "1.03.08.2.01",
    "namaKegiatan": "Penyelenggaraan Bangunan Gedung di Wilayah Daerah Kabupaten/Kota, Pemberian Izin Mendirikan Bangunan (IMB) dan Sertifikat Laik Fungsi Bangunan Gedung",
    "bidangId": "cipta_karya"
  },
  {
    "id": "keg_bina_marga_15",
    "programId": "prog_bina_marga_1_03_10",
    "kodeKegiatan": "1.03.10.2.01",
    "namaKegiatan": "Penyelenggaraan Jalan Kabupaten/Kota",
    "bidangId": "bina_marga"
  },
  {
    "id": "keg_sda_bk_16",
    "programId": "prog_sda_bk_1_03_11",
    "kodeKegiatan": "1.03.11.2.01",
    "namaKegiatan": "Penyelenggaraan Pelatihan Tenaga Terampil Konstruksi",
    "bidangId": "sda_bk"
  },
  {
    "id": "keg_tata_ruang_17",
    "programId": "prog_tata_ruang_1_03_12",
    "kodeKegiatan": "1.03.12.2.01",
    "namaKegiatan": "Penetapan Rencana Tata Ruang Wilayah RTRW dan Rencana Rinci Tata Ruang RRTR Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "keg_tata_ruang_18",
    "programId": "prog_tata_ruang_1_03_12",
    "kodeKegiatan": "1.03.12.2.02",
    "namaKegiatan": "Koordinasi dan Sinkronisasi Perencanaan Tata Ruang Daerah Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "keg_tata_ruang_19",
    "programId": "prog_tata_ruang_1_03_12",
    "kodeKegiatan": "1.03.12.2.03",
    "namaKegiatan": "Koordinasi dan Sinkronisasi Pemanfaatan Ruang Daerah Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "keg_tata_ruang_20",
    "programId": "prog_tata_ruang_1_03_12",
    "kodeKegiatan": "1.03.12.2.04",
    "namaKegiatan": "Koordinasi dan Sinkronisasi Pengendalian Pemanfaatan Ruang Daerah Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "keg_tata_ruang_21",
    "programId": "prog_tata_ruang_2_10_01",
    "kodeKegiatan": "2.10.01.2.01",
    "namaKegiatan": "Penetapan Subjek dan Objek Redistribusi Tanah serta Ganti Kerugian Tanah Kelebihan Maksimum dan Tanah Absentee dalam 1 (Satu)",
    "bidangId": "tata_ruang"
  },
  {
    "id": "keg_tata_ruang_22",
    "programId": "prog_tata_ruang_2_10_02",
    "kodeKegiatan": "2.10.02.2.01",
    "namaKegiatan": "Penggunaan Tanah yang Hamparannya dalam satu Daerah Kabupaten/Kota",
    "bidangId": "tata_ruang"
  }
];

export const INITIAL_SIPD_SUB_KEGIATAN = [
  {
    "id": "sub_sekretariat_1",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_1",
    "kodeSubKegiatan": "1.03.01.2.01.01",
    "namaSubKegiatan": "Penyusunan Dokumen Perencanaan Perangkat Daerah",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_2",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_1",
    "kodeSubKegiatan": "1.03.01.2.01.02",
    "namaSubKegiatan": "Koordinasi dan Penyusunan Dokumen RKA-SKPD",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_3",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_1",
    "kodeSubKegiatan": "1.03.01.2.01.03",
    "namaSubKegiatan": "Koordinasi dan Penyusunan DPA-SKPD",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_4",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_1",
    "kodeSubKegiatan": "1.03.01.2.01.06",
    "namaSubKegiatan": "Koordinasi dan   Penyusunan Laporan Capaian Kinerja dan Ikhtisar Realisasi Kinerja SKPD",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_5",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_2",
    "kodeSubKegiatan": "1.03.01.2.02.01",
    "namaSubKegiatan": "Penyediaan Gaji dan Tunjangan ASN",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_6",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_2",
    "kodeSubKegiatan": "1.03.01.2.02.02",
    "namaSubKegiatan": "Penyediaan Administrasi Pelaksanaan Tugas ASN",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_7",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_3",
    "kodeSubKegiatan": "1.03.01.2.03.01",
    "namaSubKegiatan": "Penyusunan Perencanaan Kebutuhan Barang Milik Daerah SKPD",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_8",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_4",
    "kodeSubKegiatan": "1.03.01.2.04.01",
    "namaSubKegiatan": "Pengadaan Pakaian Dinas Beserta Atribut Kelengkapannya",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_9",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_4",
    "kodeSubKegiatan": "1.03.01.2.04.02",
    "namaSubKegiatan": "Pendidikan dan Pelatihan Pegawai Berdasarkan Tugas dan Fungsi",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_10",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_5",
    "kodeSubKegiatan": "1.03.01.2.06.01",
    "namaSubKegiatan": "Penyediaan Komponen Instalasi Listrik/Penerangan Bangunan Kantor",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_11",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_5",
    "kodeSubKegiatan": "1.03.01.2.06.02",
    "namaSubKegiatan": "Penyediaan Peralatan dan Perlengkapan Kantor",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_12",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_5",
    "kodeSubKegiatan": "1.03.01.2.06.03",
    "namaSubKegiatan": "Penyediaan Peralatan Rumah Tangga",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_13",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_5",
    "kodeSubKegiatan": "1.03.01.2.06.05",
    "namaSubKegiatan": "Penyediaan Barang Cetakan dan Penggandaan",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_14",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_5",
    "kodeSubKegiatan": "1.03.01.2.06.09",
    "namaSubKegiatan": "Penyelenggaraan Rapat Koordinasi dan Konsultasi SKPD",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_15",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_5",
    "kodeSubKegiatan": "1.03.01.2.06.10",
    "namaSubKegiatan": "Penatausahaan Arsip Dinamis pada SKPD",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_16",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_6",
    "kodeSubKegiatan": "1.03.01.2.07.01",
    "namaSubKegiatan": "Pengadaan Kendaraan Dinas Operasional atau lapangan",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_17",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_6",
    "kodeSubKegiatan": "1.03.01.2.07.05",
    "namaSubKegiatan": "Pengadaan Mebel",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_18",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_6",
    "kodeSubKegiatan": "1.03.01.2.07.06",
    "namaSubKegiatan": "Pengadaan Peralatan dan Mesin Lainnya",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_19",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_7",
    "kodeSubKegiatan": "1.03.01.2.08.01",
    "namaSubKegiatan": "Penyediaan Jasa Surat Menyurat",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_20",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_7",
    "kodeSubKegiatan": "1.03.01.2.08.02",
    "namaSubKegiatan": "Penyediaan Jasa Komunikasi, Sumber Daya Air dan Listrik",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_21",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_7",
    "kodeSubKegiatan": "1.03.01.2.08.03",
    "namaSubKegiatan": "Penyediaan Jasa Peralatan dan Perlengkapan Kantor",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_22",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_8",
    "kodeSubKegiatan": "1.03.01.2.09.01",
    "namaSubKegiatan": "Penyediaan Jasa Pemeliharaan, Biaya Pemeliharaan,  dan Pajak Kendaraan Perorangan Dinas atau Kendaraan Dinas Jabatan",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_23",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_8",
    "kodeSubKegiatan": "1.03.01.2.09.02",
    "namaSubKegiatan": "Penyediaan Jasa Pemeliharaan, Biaya Pemeliharaan, Pajak, dan Perizinan Kendaraan Dinas Operasional atau Lapangan",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_24",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_8",
    "kodeSubKegiatan": "1.03.01.2.09.03",
    "namaSubKegiatan": "Penyediaan Jasa Pemeliharaan, Biaya Pemeliharaan dan Perizinan Alat Besar",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_25",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_8",
    "kodeSubKegiatan": "1.03.01.2.09.05",
    "namaSubKegiatan": "Pemeliharaan Mebel",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_26",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_8",
    "kodeSubKegiatan": "1.03.01.2.09.05",
    "namaSubKegiatan": "Pemeliharaan Peralatan dan Mesin Lainnya",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_27",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_8",
    "kodeSubKegiatan": "1.03.01.2.09.09",
    "namaSubKegiatan": "Pemeliharaan/Rehabilitasi Gedung Kantor dan Bangunan Lainnya",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_28",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_8",
    "kodeSubKegiatan": "1.03.01.2.09.10",
    "namaSubKegiatan": "Pemeliharaan/Rehabilitasi Sarana dan Prasarana Gedung Kantor atau Bangunan Lainnya",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sekretariat_29",
    "programId": "prog_sekretariat_1_03_01",
    "kegiatanId": "keg_sekretariat_8",
    "kodeSubKegiatan": "1.03.01.2.09.08",
    "namaSubKegiatan": "Pemeliharaan/Rehabilitasi Sarana dan Prasarana Pendukung Gedung Kantor atau Bangunan Lainnya",
    "bidangId": "sekretariat"
  },
  {
    "id": "sub_sda_bk_30",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.01",
    "namaSubKegiatan": "Pembangunan Stasiun Pompa Banjir",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_31",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.02",
    "namaSubKegiatan": "Rehabilitasi Pintu Air/Bendung Pengendali Banjir",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_32",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.03",
    "namaSubKegiatan": "Operasi dan Pemeliharaan Sungai",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_33",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.04",
    "namaSubKegiatan": "Koordinasi dan Sinkronisasi Peningkatan Kapasitas Kelembagaan Pengelolaan SDA Kewenangan Kabupaten/Kota",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_34",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.24",
    "namaSubKegiatan": "Operasi dan Pemeliharaan Check Dam",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_35",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.06",
    "namaSubKegiatan": "Operasi dan Pemeliharaan Stasiun Pompa Banjir",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_36",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.26",
    "namaSubKegiatan": "Operasi dan Pemeliharaan Embung dan Penampung Air lainnya",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_37",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.08",
    "namaSubKegiatan": "Normalisasi/Restorasi Sungai",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_38",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.09",
    "namaSubKegiatan": "Penyusunan Rencana Teknis dan Dokumen Lingkungan Hidup untuk Konstruksi Pengendali Banjir, Lahar, dan Pengaman Pantai",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_39",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.10",
    "namaSubKegiatan": "Pembangunan Embung dan Penampung Air Lainnya",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_40",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.11",
    "namaSubKegiatan": "Pembangunan Pintu Air/Bendung Pengendali Banjir",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_41",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.63",
    "namaSubKegiatan": "Rehabilitasi Tanggul Sungai",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_42",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_9",
    "kodeSubKegiatan": "1.03.02.2.01.13",
    "namaSubKegiatan": "Rehabilitasi Embung",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_43",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_10",
    "kodeSubKegiatan": "1.03.02.2.02.01",
    "namaSubKegiatan": "Rehabilitasi Jaringan Irigasi Permukaan",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_44",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_10",
    "kodeSubKegiatan": "1.03.02.2.02.02",
    "namaSubKegiatan": "Operasi dan Pemeliharaan Jaringan Irigasi Permukaan",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_45",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_10",
    "kodeSubKegiatan": "1.03.02.2.02.03",
    "namaSubKegiatan": "Operasi dan Pemeliharaan Jaringan Irigasi Tambak",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_46",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_10",
    "kodeSubKegiatan": "1.03.02.2.02.04",
    "namaSubKegiatan": "Penguatan Kapasitas Kelembagaan Pengelola Irigasi Kewenangan Kabupaten/Kota",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_47",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_10",
    "kodeSubKegiatan": "1.03.02.2.02.05",
    "namaSubKegiatan": "Penyusunan Dukungan Teknis bidang Irigasi dan Rawa",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_48",
    "programId": "prog_sda_bk_1_03_02",
    "kegiatanId": "keg_sda_bk_10",
    "kodeSubKegiatan": "1.03.02.2.02.06",
    "namaSubKegiatan": "Operasi dan Pemeliharaan Bendung Irigasi",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_cipta_karya_49",
    "programId": "prog_cipta_karya_1_03_03",
    "kegiatanId": "keg_cipta_karya_11",
    "kodeSubKegiatan": "1.03.03.2.01.01",
    "namaSubKegiatan": "Penyusunan Rencana, Kebijakan, Strategi dan Teknis Sistem Penyediaan Air Minum (SPAM)",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_50",
    "programId": "prog_cipta_karya_1_03_03",
    "kegiatanId": "keg_cipta_karya_11",
    "kodeSubKegiatan": "1.03.03.2.01.04",
    "namaSubKegiatan": "Peningkatan Sistem Penyediaan Air Minum (SPAM) Jaringan Perpipaan",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_51",
    "programId": "prog_cipta_karya_1_03_03",
    "kegiatanId": "keg_cipta_karya_11",
    "kodeSubKegiatan": "1.03.03.2.01.03",
    "namaSubKegiatan": "Pembangunan Sistem Penyediaan Air Minum (SPAM) Jaringan Perpipaan",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_52",
    "programId": "prog_cipta_karya_1_03_05",
    "kegiatanId": "keg_cipta_karya_12",
    "kodeSubKegiatan": "1.03.05.2.01.01",
    "namaSubKegiatan": "Operasi dan Pemeliharaan Sistem Pengelolaan Air Limbah Domestik (SPALD)",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_53",
    "programId": "prog_cipta_karya_1_03_05",
    "kegiatanId": "keg_cipta_karya_12",
    "kodeSubKegiatan": "1.03.05.2.01.02",
    "namaSubKegiatan": "Pembinaan dan Pemberdayaan Masyarakat dalam Pengembangan Sistem Pengelolaan Air Limbah Domestik (SPALD)",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_54",
    "programId": "prog_cipta_karya_1_03_05",
    "kegiatanId": "keg_cipta_karya_12",
    "kodeSubKegiatan": "1.03.05.2.01.06",
    "namaSubKegiatan": "Penyediaan Unit pengolahan setempat",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_55",
    "programId": "prog_cipta_karya_1_03_05",
    "kegiatanId": "keg_cipta_karya_12",
    "kodeSubKegiatan": "1.03.05.2.01.04",
    "namaSubKegiatan": "Penyusunan Rencana, Kebijakan, Strategi dan Teknis Sistem Pengelolaan Air Limbah Domestik (SPALD)",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_56",
    "programId": "prog_cipta_karya_1_03_06",
    "kegiatanId": "keg_cipta_karya_13",
    "kodeSubKegiatan": "1.03.06.2.01.01",
    "namaSubKegiatan": "Rehabilitasi Sistem Drainase Perkotaan",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_57",
    "programId": "prog_cipta_karya_1_03_06",
    "kegiatanId": "keg_cipta_karya_13",
    "kodeSubKegiatan": "1.03.06.2.01.09",
    "namaSubKegiatan": "Pembangunan Sistem Drainase Perkotaan",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_58",
    "programId": "prog_cipta_karya_1_03_06",
    "kegiatanId": "keg_cipta_karya_13",
    "kodeSubKegiatan": "1.03.06.2.01.03",
    "namaSubKegiatan": "Operasi dan Pemeliharaan Sistem Drainase Perkotaan",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_59",
    "programId": "prog_cipta_karya_1_03_08",
    "kegiatanId": "keg_cipta_karya_14",
    "kodeSubKegiatan": "1.03.08.2.01.02",
    "namaSubKegiatan": "Pemeliharaan, Perawatan, dan Pemeriksaan Berkala Bangunan Gedung untuk Kepentingan Strategis Daerah Kabupaten/Kota",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_60",
    "programId": "prog_cipta_karya_1_03_08",
    "kegiatanId": "keg_cipta_karya_14",
    "kodeSubKegiatan": "1.03.08.2.01.02",
    "namaSubKegiatan": "Pembangunan, Pemanfaatan, Pelestarian dan Pembongkaran Bangunan Gedung untuk Kepentingan Strategis Daerah Kabupaten/Kota",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_cipta_karya_61",
    "programId": "prog_cipta_karya_1_03_08",
    "kegiatanId": "keg_cipta_karya_14",
    "kodeSubKegiatan": "1.03.08.2.01.03",
    "namaSubKegiatan": "Penyelenggaraan Penerbitan Persetujuan Bangunan Gedung (PBG), Sertifikat Laik Fungsi (SLF), Surat Bukti Kepemilikan Bangunan Gedung (SBKBG), Rencana Teknis Pembongkaran Bangunan Gedung (RTB), Tim Profesi Ahli (TPA), Tim Penilai Teknis (TPT), Penilik, dan Pendataan Bangunan Gedung melalui SIMBG",
    "bidangId": "cipta_karya"
  },
  {
    "id": "sub_bina_marga_62",
    "programId": "prog_bina_marga_1_03_10",
    "kegiatanId": "keg_bina_marga_15",
    "kodeSubKegiatan": "1.03.10.2.01.01",
    "namaSubKegiatan": "Penyusunan Rencana, Kebijakan, Strategi dan Teknis Pengembangan Jaringan Jalan serta Perencanaan Teknis Penyelenggaraan Jalan dan Jembatan",
    "bidangId": "bina_marga"
  },
  {
    "id": "sub_bina_marga_63",
    "programId": "prog_bina_marga_1_03_10",
    "kegiatanId": "keg_bina_marga_15",
    "kodeSubKegiatan": "1.03.10.2.01.05",
    "namaSubKegiatan": "Pembangunan Jalan",
    "bidangId": "bina_marga"
  },
  {
    "id": "sub_bina_marga_64",
    "programId": "prog_bina_marga_1_03_10",
    "kegiatanId": "keg_bina_marga_15",
    "kodeSubKegiatan": "1.03.10.2.01.03",
    "namaSubKegiatan": "Rehabilitasi Jalan",
    "bidangId": "bina_marga"
  },
  {
    "id": "sub_bina_marga_65",
    "programId": "prog_bina_marga_1_03_10",
    "kegiatanId": "keg_bina_marga_15",
    "kodeSubKegiatan": "1.03.10.2.01.04",
    "namaSubKegiatan": "Rehabilitasi Jembatan",
    "bidangId": "bina_marga"
  },
  {
    "id": "sub_bina_marga_66",
    "programId": "prog_bina_marga_1_03_10",
    "kegiatanId": "keg_bina_marga_15",
    "kodeSubKegiatan": "1.03.10.2.01.05",
    "namaSubKegiatan": "Pengawasan Penyelenggaraan Jalan Kewenangan Kabupaten/Kota dan Desa",
    "bidangId": "bina_marga"
  },
  {
    "id": "sub_bina_marga_67",
    "programId": "prog_bina_marga_1_03_10",
    "kegiatanId": "keg_bina_marga_15",
    "kodeSubKegiatan": "1.03.10.2.01.06",
    "namaSubKegiatan": "Pelabaran Jalan Menuju Standar",
    "bidangId": "bina_marga"
  },
  {
    "id": "sub_bina_marga_68",
    "programId": "prog_bina_marga_1_03_10",
    "kegiatanId": "keg_bina_marga_15",
    "kodeSubKegiatan": "1.03.10.2.01.07",
    "namaSubKegiatan": "Pembangunan Jembatan",
    "bidangId": "bina_marga"
  },
  {
    "id": "sub_sda_bk_69",
    "programId": "prog_sda_bk_1_03_11",
    "kegiatanId": "keg_sda_bk_16",
    "kodeSubKegiatan": "1.03.11.2.01.01",
    "namaSubKegiatan": "Pembinaan dan Peningkatan Kapasitas Kelembagaan Jasa Konstruksi",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_sda_bk_70",
    "programId": "prog_sda_bk_1_03_11",
    "kegiatanId": "keg_sda_bk_16",
    "kodeSubKegiatan": "1.03.11.2.01.02",
    "namaSubKegiatan": "Pelatihan Tenaga Kerja Konstruksi Kualifikasi Jabatan Operator, Teknisi atau Analis",
    "bidangId": "sda_bk"
  },
  {
    "id": "sub_tata_ruang_71",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_17",
    "kodeSubKegiatan": "1.03.12.2.01.01",
    "namaSubKegiatan": "Pelaksanaan Persetujuan Substansi RTRW Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_72",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_17",
    "kodeSubKegiatan": "1.03.12.2.01.02",
    "namaSubKegiatan": "Pelaksanaan Persetujuan Substansi RDTR Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_73",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_17",
    "kodeSubKegiatan": "1.03.12.2.01.03",
    "namaSubKegiatan": "Penetapan RDTR Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_74",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_17",
    "kodeSubKegiatan": "1.03.12.2.01.04",
    "namaSubKegiatan": "Penetapan RTRW Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_75",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_17",
    "kodeSubKegiatan": "1.03.12.2.01.05",
    "namaSubKegiatan": "Sosialisasi Kebijakan dan Peraturan Perundang-Undangan Bidang Penataan Ruang",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_76",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_18",
    "kodeSubKegiatan": "1.03.12.2.02.01",
    "namaSubKegiatan": "Penyusunan Peta Dasar",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_77",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_18",
    "kodeSubKegiatan": "1.03.12.2.02.02",
    "namaSubKegiatan": "Penyusunan RDTR Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_78",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_18",
    "kodeSubKegiatan": "1.03.12.2.02.03",
    "namaSubKegiatan": "Peningkatan kompetensi SDM bidang penataan ruang",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_79",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_18",
    "kodeSubKegiatan": "1.03.12.2.02.04",
    "namaSubKegiatan": "Penyusunan RTRW Kabupaten/Kota",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_80",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_19",
    "kodeSubKegiatan": "1.03.12.2.03.01",
    "namaSubKegiatan": "Koordinasi Penyelenggaraan Penataan Ruang",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_81",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_19",
    "kodeSubKegiatan": "1.03.12.2.03.02",
    "namaSubKegiatan": "Pelaksanaan Persetujuan Kesesuaian Kegiatan Pemanfaatan Ruang",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_82",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_19",
    "kodeSubKegiatan": "1.03.12.2.03.03",
    "namaSubKegiatan": "Pelaksanaan Sinkronisasi Program Pemanfaatan Ruang",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_83",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_19",
    "kodeSubKegiatan": "1.03.12.2.03.04",
    "namaSubKegiatan": "Sistem informasi dan komunikasi penataan ruang",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_84",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_20",
    "kodeSubKegiatan": "1.03.12.2.04.01",
    "namaSubKegiatan": "Penilaian Pelaksanaan Kesesuaian Kegiatan Pemanfaatan Ruang dan/atau pernyataan mandiri pelaku UMK",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_85",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_20",
    "kodeSubKegiatan": "1.03.12.2.04.02",
    "namaSubKegiatan": "Operasionalisasi Tugas dan Fungsi Forum Penataan Ruang",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_86",
    "programId": "prog_tata_ruang_1_03_12",
    "kegiatanId": "keg_tata_ruang_20",
    "kodeSubKegiatan": "1.03.12.2.04.03",
    "namaSubKegiatan": "Pengawasan TURBINLAK dan Pengawasan Fungsi dan Manfaat",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_87",
    "programId": "prog_tata_ruang_2_10_01",
    "kegiatanId": "keg_tata_ruang_21",
    "kodeSubKegiatan": "2.10.01.2.01.03",
    "namaSubKegiatan": "Koordinasi Pembentukan dan Pelaksanaan Fungsi Gugus Tugas Reforma Agraria Tingkat Kabupaten/Kota.",
    "bidangId": "tata_ruang"
  },
  {
    "id": "sub_tata_ruang_88",
    "programId": "prog_tata_ruang_2_10_02",
    "kegiatanId": "keg_tata_ruang_22",
    "kodeSubKegiatan": "2.10.02.2.01.01",
    "namaSubKegiatan": "Koordinasi dan Sinkronisasi Pelaksanaan Konsolidasi Tanah Kabupaten/Kota",
    "bidangId": "tata_ruang"
  }
];

export function matchProjectToSubKegiatan(project, subKegiatanList = INITIAL_SIPD_SUB_KEGIATAN) {
  if (!project || !subKegiatanList || subKegiatanList.length === 0) return null;
  if (project.subKegiatanId) {
    const found = subKegiatanList.find(s => s.id === project.subKegiatanId);
    if (found) return found;
  }
  if (project.kodeSubKegiatan) {
    const found = subKegiatanList.find(s => s.kodeSubKegiatan === project.kodeSubKegiatan);
    if (found) return found;
  }
  return null;
}



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
