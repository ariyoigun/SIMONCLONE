import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, KECAMATAN_DEMAK, JENIS_ANGGARAN } from '../data/constants';
import {
  Printer,
  Download,
  Filter,
  FileText,
  CheckCircle2,
  Tag,
  Layers,
  MapPin,
  Clock,
  TrendingUp,
  DollarSign,
  Receipt,
  Settings,
  Building2,
  Award,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { exportProjectsToExcel } from '../utils/excelUtils';
import AppLogo from '../components/AppLogo';

const REPORT_TYPES = [
  {
    id: 'komprehensif',
    label: '1. Rekapitulasi Umum (Eksekutif)',
    deskripsi: 'Laporan menyeluruh gabungan pagu, kontrak, fisik, keuangan, rekanan, dan deviasi',
    icon: FileText
  },
  {
    id: 'tagging',
    label: '2. Rekap per Tagging Prioritas',
    deskripsi: 'Laporan paket strategis: DBHCHT, Kemiskinan, DAK, Stunting, IJD, Program Bupati',
    icon: Tag
  },
  {
    id: 'label_anggaran',
    label: '3. Rekap per Label Anggaran (Murni vs APBD-P)',
    deskripsi: 'Perbandingan paket alokasi APBD Murni vs (APBD-P)',
    icon: Layers
  },
  {
    id: 'wilayah',
    label: '4. Rekap per Wilayah (Kecamatan & Desa)',
    deskripsi: 'Sebaran paket pembangunan di 14 kecamatan dan desa se-Kabupaten Demak',
    icon: MapPin
  },
  {
    id: 'prakontrak',
    label: '5. Rekap Pra-Kontrak & Pengadaan',
    deskripsi: 'Proses pengadaan tender, PL, E-Katalog, swakelola, dan progres sebelum kontrak',
    icon: Clock
  },
  {
    id: 'fisik_deviasi',
    label: '6. Evaluasi Progres Fisik & Deviasi',
    deskripsi: 'Pengendalian kontrak fisik, fokus pada deviasi kritis (< -5%), perhatian, dan selesai',
    icon: TrendingUp
  },
  {
    id: 'keuangan_rekanan',
    label: '7. Realisasi Keuangan & Rekanan CV/PT',
    deskripsi: 'Histori pencairan termin SP2D, sisa kas anggaran, dan kinerja rekanan pelaksana',
    icon: DollarSign
  },
  {
    id: 'administrasi_spj',
    label: '8. Status Administrasi SPJ Keuangan',
    deskripsi: 'Monitoring berkas pertanggungjawaban akhir tahun: Belum Masuk, Koreksi, SPM, SP2D',
    icon: Receipt
  }
];

const ReportView = ({ onOpenSettingsModal }) => {
  const { accessibleProjects, activeYear, currentUser, systemSettings, tags: masterTags = [] } = useApp();

  // Selected Report Type
  const [selectedReportType, setSelectedReportType] = useState('komprehensif');

  // Filters State
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedAnggaran, setSelectedAnggaran] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedDeviasiFilter, setSelectedDeviasiFilter] = useState('ALL');
  const [penandatanganMode, setPenandatanganMode] = useState('kadin_sekretaris'); // 'kadin_sekretaris' | 'kadin_pptk'

  // Officials from systemSettings (full control by Superadmin)
  const namaKadin = systemSettings?.namaKepalaDinas || 'Ir. H. Achmad Syafii, CES, MT';
  const nipKadin = systemSettings?.nipKepalaDinas || '19680514 199303 1 002';
  const pangkatKadin = systemSettings?.pangkatKepalaDinas || 'Pembina Utama Madya (IV/d)';
  const jabatanKadin = systemSettings?.jabatanKepalaDinas || 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang';

  const namaSekretaris = systemSettings?.namaSekretaris || 'Dra. Hj. Siti Nurhasanah, MM';
  const nipSekretaris = systemSettings?.nipSekretaris || '19720819 199803 2 003';
  const pangkatSekretaris = systemSettings?.pangkatSekretaris || 'Pembina Tingkat I (IV/b)';
  const jabatanSekretaris = systemSettings?.jabatanSekretaris || 'Sekretaris DINPUTARU';

  // Filter Projects based on selected criteria
  const filteredProjects = useMemo(() => {
    return accessibleProjects.filter((p) => {
      // Bidang
      if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;

      // Tagging Filter (if in Tagging Report or general filter)
      if (selectedTag !== 'ALL') {
        const pTags = p.tags || [];
        if (!pTags.includes(selectedTag)) return false;
      }

      // Label Anggaran Filter
      if (selectedAnggaran !== 'ALL') {
        if (selectedAnggaran === 'APBD-P' || selectedAnggaran === 'Perubahan') {
          if (p.jenisAnggaran !== 'APBD-P' && p.jenisAnggaran !== 'Perubahan') return false;
        } else if (p.jenisAnggaran !== selectedAnggaran) {
          return false;
        }
      }

      // Kecamatan Filter
      if (selectedKecamatan !== 'ALL' && p.kecamatan !== selectedKecamatan) return false;

      // Deviasi Filter
      if (selectedDeviasiFilter !== 'ALL') {
        if (selectedDeviasiFilter === 'Kritis' && p.dataFisik?.statusDeviasi !== 'Kritis') return false;
        if (selectedDeviasiFilter === 'Perhatian' && p.dataFisik?.statusDeviasi !== 'Perhatian') return false;
        if (selectedDeviasiFilter === 'Aman' && p.dataFisik?.statusDeviasi !== 'Aman') return false;
        if (selectedDeviasiFilter === 'Selesai' && (p.dataFisik?.progresRealisasi || 0) < 100) return false;
      }

      return true;
    });
  }, [accessibleProjects, selectedBidang, selectedTag, selectedAnggaran, selectedKecamatan, selectedDeviasiFilter]);

  // Aggregate Metrics
  const totalPagu = filteredProjects.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
  const totalKontrak = filteredProjects.reduce((sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0), 0);
  const totalCair = filteredProjects.reduce((sum, p) => sum + (parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);
  const totalSisa = Math.max(0, totalKontrak - totalCair);

  const avgFisik =
    filteredProjects.length > 0
      ? (
          filteredProjects.reduce((sum, p) => sum + (parseFloat(p.dataFisik?.progresRealisasi) || 0), 0) /
          filteredProjects.length
        ).toFixed(1)
      : '0.0';

  const persenKeuangan = totalKontrak > 0 ? ((totalCair / totalKontrak) * 100).toFixed(1) : '0.0';
  const printDateStr = useMemo(() => new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), []);

  // Export to CSV based on active report type
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];

    const activeReportObj = REPORT_TYPES.find((r) => r.id === selectedReportType) || REPORT_TYPES[0];

    if (selectedReportType === 'tagging') {
      headers = ['No', 'Kode Paket', 'Bidang', 'Nama Paket Pekerjaan', 'Tagging Program', 'Kecamatan', 'Pagu (Rp)', 'Nilai Kontrak (Rp)', 'Fisik (%)', 'Pencairan SP2D (Rp)', 'Status'];
      rows = filteredProjects.map((p, idx) => {
        const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId)?.singkatan || '-';
        return [
          idx + 1,
          `"${p.id}"`,
          `"${bidang}"`,
          `"${p.namaPaket.replace(/"/g, '""')}"`,
          `"${(p.tags || []).join('; ')}"`,
          `"${p.kecamatan || '-'}"`,
          parseFloat(p.paguAnggaran || 0),
          parseFloat(p.dataKontrak?.nilaiKontrak || 0),
          parseFloat(p.dataFisik?.progresRealisasi || 0),
          parseFloat(p.dataKeuangan?.totalPencairan || 0),
          `"${p.isKontrak ? 'Terkontrak' : 'Pra-Kontrak'}"`
        ];
      });
    } else if (selectedReportType === 'label_anggaran') {
      headers = ['No', 'Kode Paket', 'Jenis Anggaran', 'Bidang', 'Nama Paket', 'Pagu (Rp)', 'Nilai Kontrak (Rp)', 'Fisik (%)', 'Realisasi Keuangan (Rp)'];
      rows = filteredProjects.map((p, idx) => {
        const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId)?.singkatan || '-';
        return [
          idx + 1,
          `"${p.id}"`,
          `"${(p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '(APBD-P)' : 'APBD Murni'}"`,
          `"${bidang}"`,
          `"${p.namaPaket.replace(/"/g, '""')}"`,
          parseFloat(p.paguAnggaran || 0),
          parseFloat(p.dataKontrak?.nilaiKontrak || 0),
          parseFloat(p.dataFisik?.progresRealisasi || 0),
          parseFloat(p.dataKeuangan?.totalPencairan || 0)
        ];
      });
    } else if (selectedReportType === 'wilayah') {
      headers = ['No', 'Kode Paket', 'Kecamatan', 'Desa', 'Nama Paket', 'Bidang', 'Latitude', 'Longitude', 'Pagu (Rp)', 'Fisik (%)'];
      rows = filteredProjects.map((p, idx) => {
        const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId)?.singkatan || '-';
        return [
          idx + 1,
          `"${p.id}"`,
          `"${p.kecamatan || '-'}"`,
          `"${p.desa || '-'}"`,
          `"${p.namaPaket.replace(/"/g, '""')}"`,
          `"${bidang}"`,
          `"${p.latitude || '-'}"`,
          `"${p.longitude || '-'}"`,
          parseFloat(p.paguAnggaran || 0),
          parseFloat(p.dataFisik?.progresRealisasi || 0)
        ];
      });
    } else if (selectedReportType === 'administrasi_spj') {
      headers = ['No', 'Kode Paket', 'Bidang', 'Nama Paket', 'Rekanan Pelaksana', 'Nilai Kontrak (Rp)', 'Status Berkas SPJ', 'Tanggal Masuk', 'No SPM', 'Verifikator'];
      rows = filteredProjects.map((p, idx) => {
        const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId)?.singkatan || '-';
        const spj = p.administrasiSPJ || {};
        return [
          idx + 1,
          `"${p.id}"`,
          `"${bidang}"`,
          `"${p.namaPaket.replace(/"/g, '""')}"`,
          `"${(p.dataKontrak?.namaPenyedia || '-').replace(/"/g, '""')}"`,
          parseFloat(p.dataKontrak?.nilaiKontrak || 0),
          `"${(spj.status || 'belum_masuk').replace(/_/g, ' ')}"`,
          `"${spj.tanggalMasuk || '-'}"`,
          `"${spj.nomorSPM || '-'}"`,
          `"${spj.petugasVerifikator || '-'}"`
        ];
      });
    } else {
      // Default / Komprehensif
      headers = [
        'No',
        'Kode Paket',
        'Bidang',
        'Nama Paket Pekerjaan',
        'Label Anggaran',
        'Tipe Pengadaan',
        'Rekanan Pelaksana (CV/PT)',
        'Nomor Kontrak',
        'Pagu Anggaran (Rp)',
        'Nilai Kontrak (Rp)',
        'Progres Rencana (%)',
        'Progres Realisasi (%)',
        'Deviasi Fisik (%)',
        'Status Deviasi',
        'Total Pencairan (Rp)',
        'Persen Keuangan (%)',
        'Sisa Anggaran (Rp)'
      ];
      rows = filteredProjects.map((p, idx) => {
        const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId)?.nama || '-';
        const kNilai = parseFloat(p.dataKontrak?.nilaiKontrak || 0);
        const kCair = parseFloat(p.dataKeuangan?.totalPencairan || 0);
        return [
          idx + 1,
          `"${p.id}"`,
          `"${bidang}"`,
          `"${p.namaPaket.replace(/"/g, '""')}"`,
          `"${(p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '(APBD-P)' : 'APBD Murni'}"`,
          `"${p.tipePengadaan}"`,
          `"${(p.dataKontrak?.namaPenyedia || '-').replace(/"/g, '""')}"`,
          `"${p.dataKontrak?.nomorKontrak || '-'}"`,
          parseFloat(p.paguAnggaran || 0),
          kNilai,
          parseFloat(p.dataFisik?.progresRencana || 0),
          parseFloat(p.dataFisik?.progresRealisasi || 0),
          parseFloat(p.dataFisik?.deviasiFisik || 0),
          `"${p.dataFisik?.statusDeviasi || '-'}"`,
          kCair,
          parseFloat(p.dataKeuangan?.persenKeuangan || 0),
          Math.max(0, kNilai - kCair)
        ];
      });
    }

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Laporan_${selectedReportType}_TA_${activeYear}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    exportProjectsToExcel(
      filteredProjects,
      activeYear,
      `Laporan_${selectedReportType}_TA_${activeYear}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const activeReport = REPORT_TYPES.find((r) => r.id === selectedReportType) || REPORT_TYPES[0];

  return (
    <div>
      {/* 1. Header Kontrol (Tersembunyi saat dicetak) */}
      <div className="page-header" style={{ marginBottom: 18 }}>
        <div className="page-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0f2c59, #1e40af)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(15, 44, 89, 0.2)'
              }}
            >
              <Printer size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, margin: 0 }}>
                {systemSettings?.customTexts?.internal_report_title || 'Cetak & Rekapitulasi Laporan Kedinasan'}
              </h1>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b' }}>
                {systemSettings?.customTexts?.internal_report_desc || `Format laporan resmi kedinasan siap cetak/PDF dan ekspor spreadsheet untuk TA ${activeYear}`}
              </p>
            </div>
          </div>
        </div>

        <div className="page-header-actions" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {currentUser.role === 'superadmin' && onOpenSettingsModal && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onOpenSettingsModal}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
              title="Atur Nama & NIP Kepala Dinas serta Sekretaris di Panel Super Admin"
            >
              <Award size={14} color="#0284c7" />
              <span>Atur Nama Kadin & Sekretaris</span>
            </button>
          )}

          <button
            className="btn btn-outline"
            onClick={handleExportExcel}
            style={{
              display: 'inline-flex',
              gap: 6,
              alignItems: 'center',
              fontSize: 13,
              borderColor: '#059669',
              color: '#059669',
              background: '#ffffff'
            }}
            title="Download laporan dalam format Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet size={15} color="#059669" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            className="btn btn-outline"
            onClick={handleExportCSV}
            style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 13 }}
            title="Download laporan dalam format teks CSV (.csv)"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              gap: 6,
              alignItems: 'center',
              padding: '10px 20px',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(15, 44, 89, 0.25)'
            }}
          >
            <Printer size={16} />
            <span>Cetak Lembar Resmi (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. Pilihan 8 Jenis Laporan Lengkap (Pills Selector) */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          PILIH JENIS REKAPITULASI LAPORAN YANG INGIN DICETAK:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {REPORT_TYPES.map((rep) => {
            const Icon = rep.icon;
            const isSelected = selectedReportType === rep.id;

            return (
              <button
                key={rep.id}
                type="button"
                onClick={() => setSelectedReportType(rep.id)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: isSelected ? '#0284c7' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={14} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: isSelected ? '#0369a1' : '#0f172a' }}>
                    {rep.label}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 1.35, paddingLeft: 36 }}>
                  {rep.deskripsi}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Parameter Filter Laporan */}
      <div
        className="card"
        style={{
          padding: '14px 20px',
          marginBottom: 20,
          background: '#f8fafc',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Filter size={14} />
              Filter Data Cetakan:
            </span>

            {/* Filter Bidang */}
            {currentUser.role !== 'koordinator' && currentUser.role !== 'kabid' && (
              <select
                className="select-filter"
                value={selectedBidang}
                onChange={(e) => setSelectedBidang(e.target.value)}
                style={{ background: '#fff' }}
              >
                <option value="ALL">Semua Bidang Dinas</option>
                {BIDANG_LIST.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.singkatan} - {b.nama}
                  </option>
                ))}
              </select>
            )}

            {/* Filter Tagging (muncul jika laporan tagging atau umum) */}
            <select
              className="select-filter"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="ALL">Semua Tagging Program</option>
              {masterTags.map((t, idx) => (
                <option key={idx} value={t}>
                  Tag: {t}
                </option>
              ))}
            </select>

            {/* Filter Jenis Anggaran */}
            <select
              className="select-filter"
              value={selectedAnggaran}
              onChange={(e) => setSelectedAnggaran(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="ALL">Semua Label (Murni & APBD-P)</option>
              {JENIS_ANGGARAN.map((j) => (
                <option key={j} value={j}>
                  {j === 'Murni' ? 'APBD Murni' : '(APBD-P) Perubahan'}
                </option>
              ))}
            </select>

            {/* Filter Kecamatan */}
            <select
              className="select-filter"
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="ALL">Semua Kecamatan (14 Kec)</option>
              {KECAMATAN_DEMAK.map((kec) => (
                <option key={kec} value={kec}>
                  Kec. {kec}
                </option>
              ))}
            </select>

            {/* Filter Deviasi Fisik */}
            <select
              className="select-filter"
              value={selectedDeviasiFilter}
              onChange={(e) => setSelectedDeviasiFilter(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="ALL">Semua Deviasi Progres</option>
              <option value="Kritis">Deviasi Kritis (&lt; -5%)</option>
              <option value="Perhatian">Perhatian (-5% s.d 0%)</option>
              <option value="Aman">Aman (&gt;= 0%)</option>
              <option value="Selesai">Paket Selesai (100%)</option>
            </select>

            {/* Opsi Penandatangan Lembar Laporan */}
            <select
              className="select-filter"
              value={penandatanganMode}
              onChange={(e) => setPenandatanganMode(e.target.value)}
              style={{ background: '#fff', borderColor: '#0284c7' }}
              title="Pilih Pejabat yang menandatangani laporan"
            >
              <option value="kadin_sekretaris">Penandatangan: Kepala Dinas & Sekretaris</option>
              <option value="kadin_pptk">Penandatangan: Kepala Dinas & Koordinator / PPTK</option>
            </select>
          </div>

          <div style={{ fontSize: 12.5, color: '#64748b' }}>
            Data Tercetak: <strong>{filteredProjects.length} Paket Pekerjaan</strong>
          </div>
        </div>
      </div>

      {/* 4. KONTEN CETAK RESMI (PRINTABLE OFFICIAL CONTAINER) */}
      <div
        className="card official-printable-document"
        style={{
          background: '#ffffff',
          padding: '40px 48px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #cbd5e1',
          borderRadius: 8
        }}
      >
        {/* Kop Surat Resmi DINPUTARU */}
        <div
          style={{
            borderBottom: '3px double #000000',
            paddingBottom: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: 20
          }}
        >
          {/* Logo Instansi */}
          <div style={{ width: 80, height: 80, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AppLogo
              logoUrl={systemSettings?.logoUrl}
              size={76}
              shape="rounded"
              bordered={false}
              background="transparent"
              alt={systemSettings?.singkatanInstansi || 'DINPUTARU Demak'}
            />
          </div>

          {/* Text Kop */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              PEMERINTAH KABUPATEN DEMAK
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 1.2, textTransform: 'uppercase', color: '#0f2c59', marginTop: 2 }}>
              {systemSettings?.instansi || 'DINAS PEKERJAAN UMUM DAN PENATAAN RUANG'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: 1 }}>
              {systemSettings?.namaSistem || 'SIMON - SATUPUTARU'}
            </div>
            <div style={{ fontSize: 11.5, color: '#334155', marginTop: 4, lineHeight: 1.4 }}>
              {systemSettings?.alamat || 'Jl. Kyai Jebat No. 35 Bintoro Kec. Demak'} • Telp: {systemSettings?.telepon || '(0291) 685123'} • Email: {systemSettings?.email || 'dinputaru@demakkab.go.id'}
            </div>
          </div>
        </div>

        {/* Judul Laporan Kedinasan */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', textDecoration: 'underline', color: '#000000', margin: 0 }}>
            {activeReport.label.replace(/^\d+\.\s*/, 'LAPORAN ')}
          </h2>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', marginTop: 6 }}>
            TAHUN ANGGARAN {activeYear} • Posisi Cetak Data: {printDateStr}
          </div>
          {selectedBidang !== 'ALL' && (
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', marginTop: 2 }}>
              BIDANG: {BIDANG_LIST.find((b) => b.id === selectedBidang)?.nama?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Ringkasan Angka Rekapitulasi */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: '12px 16px',
            marginBottom: 20
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>JUMLAH PAKET</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#0f2c59' }}>{filteredProjects.length} Paket</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL PAGU</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#0f2c59' }}>Rp {totalPagu.toLocaleString('id-ID')}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL PENCAIRAN (SP2D)</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#16a34a' }}>Rp {totalCair.toLocaleString('id-ID')} ({persenKeuangan}%)</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>RATA-RATA FISIK</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#0284c7' }}>{avgFisik}%</div>
          </div>
        </div>

        {/* Tabel Data Rekapitulasi Cetakan */}
        <div className="table-container" style={{ border: '1px solid #000000', borderRadius: 0, marginBottom: 28 }}>
          <table className="data-table" style={{ fontSize: 11, width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #000000' }}>
                <th style={{ borderRight: '1px solid #94a3b8', width: 32, textAlign: 'center' }}>No</th>
                <th style={{ borderRight: '1px solid #94a3b8', width: 85 }}>Bidang</th>
                <th style={{ borderRight: '1px solid #94a3b8' }}>Nama Paket Pekerjaan</th>
                <th style={{ borderRight: '1px solid #94a3b8', width: 90 }}>Label & Tag</th>
                <th style={{ borderRight: '1px solid #94a3b8', width: 110 }}>Lokasi</th>
                <th style={{ borderRight: '1px solid #94a3b8', width: 140 }}>Penyedia (CV/PT) & Kontrak</th>
                <th style={{ borderRight: '1px solid #94a3b8', textAlign: 'right', width: 110 }}>Pagu (Rp)</th>
                <th style={{ borderRight: '1px solid #94a3b8', textAlign: 'right', width: 110 }}>Nilai Kontrak (Rp)</th>
                <th style={{ borderRight: '1px solid #94a3b8', textAlign: 'center', width: 60 }}>Fisik (%)</th>
                <th style={{ borderRight: '1px solid #94a3b8', textAlign: 'center', width: 55 }}>Dev (%)</th>
                <th style={{ textAlign: 'right', width: 110 }}>Cair SP2D (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    Tidak ada data pekerjaan yang sesuai dengan kriteria filter cetak.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p, idx) => {
                  const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                  const dev = parseFloat(p.dataFisik?.deviasiFisik || 0);
                  const fRealisasi = parseFloat(p.dataFisik?.progresRealisasi || 0);

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                      {/* No */}
                      <td style={{ borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>

                      {/* Bidang */}
                      <td style={{ borderRight: '1px solid #cbd5e1', fontWeight: 700 }}>
                        {bidang?.singkatan || '-'}
                      </td>

                      {/* Nama Paket */}
                      <td style={{ borderRight: '1px solid #cbd5e1' }}>
                        <div style={{ fontWeight: 700, color: '#000' }}>{p.namaPaket}</div>
                        <div style={{ fontSize: 9.5, color: '#64748b' }}>ID: {p.id}</div>
                      </td>

                      {/* Label & Tag */}
                      <td style={{ borderRight: '1px solid #cbd5e1' }}>
                        <span style={{ fontWeight: 700, fontSize: 10, color: (p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '#b45309' : '#0369a1' }}>
                          {(p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '(APBD-P)' : 'APBD Murni'}
                        </span>
                        {p.tags && p.tags.length > 0 && (
                          <div style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>
                            {p.tags.join(', ')}
                          </div>
                        )}
                      </td>

                      {/* Lokasi */}
                      <td style={{ borderRight: '1px solid #cbd5e1', fontSize: 10.5 }}>
                        <div>Kec. {p.kecamatan || '-'}</div>
                        <div style={{ color: '#64748b' }}>Desa {p.desa || '-'}</div>
                      </td>

                      {/* Penyedia */}
                      <td style={{ borderRight: '1px solid #cbd5e1', fontSize: 10.5 }}>
                        {p.isKontrak ? (
                          <>
                            <div style={{ fontWeight: 700 }}>{p.dataKontrak?.namaPenyedia || '-'}</div>
                            <div style={{ fontSize: 9.5, color: '#64748b' }}>SPK: {p.dataKontrak?.nomorKontrak || '-'}</div>
                          </>
                        ) : (
                          <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Tahap Pra-Kontrak</div>
                        )}
                      </td>

                      {/* Pagu */}
                      <td style={{ borderRight: '1px solid #cbd5e1', textAlign: 'right' }}>
                        {parseFloat(p.paguAnggaran || 0).toLocaleString('id-ID')}
                      </td>

                      {/* Nilai Kontrak */}
                      <td style={{ borderRight: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 600 }}>
                        {p.isKontrak ? parseFloat(p.dataKontrak?.nilaiKontrak || 0).toLocaleString('id-ID') : '-'}
                      </td>

                      {/* Fisik */}
                      <td style={{ borderRight: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>
                        {p.isKontrak ? `${fRealisasi}%` : '-'}
                      </td>

                      {/* Deviasi */}
                      <td
                        style={{
                          borderRight: '1px solid #cbd5e1',
                          textAlign: 'center',
                          fontWeight: 700,
                          color: dev >= 0 ? '#15803d' : dev < -5 ? '#dc2626' : '#b45309'
                        }}
                      >
                        {p.isKontrak ? (dev >= 0 ? `+${dev}%` : `${dev}%`) : '-'}
                      </td>

                      {/* Pencairan SP2D */}
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>
                        {p.isKontrak ? (
                          <div>
                            <div>{parseFloat(p.dataKeuangan?.totalPencairan || 0).toLocaleString('id-ID')}</div>
                            <div style={{ fontSize: 9.5, color: '#64748b' }}>({p.dataKeuangan?.persenKeuangan || 0}%)</div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })
              )}

              {/* Total Row */}
              <tr style={{ background: '#f8fafc', fontWeight: 900, borderTop: '2px solid #000000' }}>
                <td colSpan="6" style={{ textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>
                  JUMLAH TOTAL REKAPITULASI KESELURUHAN
                </td>
                <td style={{ textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>
                  Rp {totalPagu.toLocaleString('id-ID')}
                </td>
                <td style={{ textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>
                  Rp {totalKontrak.toLocaleString('id-ID')}
                </td>
                <td style={{ textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>
                  {avgFisik}%
                </td>
                <td style={{ textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>-</td>
                <td style={{ textAlign: 'right' }}>
                  Rp {totalCair.toLocaleString('id-ID')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan Pejabat Resmi (Disinkronkan dengan Pengaturan Super Admin) */}
        <div
          style={{
            marginTop: '36px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            lineHeight: 1.6,
            pageBreakInside: 'avoid'
          }}
        >
          {/* Pejabat Kiri: Sekretaris Dinas / PPK */}
          <div style={{ textAlign: 'center', width: 280 }}>
            <div>Mengetahui / Memverifikasi,</div>
            <div style={{ fontWeight: 800 }}>
              {penandatanganMode === 'kadin_sekretaris' ? jabatanSekretaris : 'Koordinator / Pejabat Pembuat Komitmen'}
            </div>
            <div style={{ height: 80 }} />
            <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: 13 }}>
              {penandatanganMode === 'kadin_sekretaris' ? namaSekretaris : currentUser.nama}
            </div>
            <div>
              NIP. {penandatanganMode === 'kadin_sekretaris' ? nipSekretaris : currentUser.nip || '19840215 200902 1 005'}
            </div>
            <div style={{ fontSize: 11, color: '#475569' }}>
              {penandatanganMode === 'kadin_sekretaris' ? pangkatSekretaris : 'Penata Tingkat I (III/d)'}
            </div>
          </div>

          {/* Pejabat Kanan: Kepala Dinas */}
          <div style={{ textAlign: 'center', width: 280 }}>
            <div>Demak, {printDateStr}</div>
            <div>Menyetujui,</div>
            <div style={{ fontWeight: 800 }}>{jabatanKadin}</div>
            <div style={{ height: 80 }} />
            <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: 13 }}>
              {namaKadin}
            </div>
            <div>NIP. {nipKadin}</div>
            <div style={{ fontSize: 11, color: '#475569' }}>{pangkatKadin}</div>
          </div>
        </div>

        {/* Catatan Kaki Cetak */}
        <div style={{ marginTop: 32, paddingTop: 12, borderTop: '1px solid #e2e8f0', fontSize: 10, color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
          <span>Dicetak secara otomatis melalui SIMON - SATUPUTARU Kabupaten Demak</span>
          <span>Halaman 1 dari 1 • Status Dokumen: Sah & Terverifikasi Kedinasan</span>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
