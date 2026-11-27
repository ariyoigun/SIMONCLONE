import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, KECAMATAN_DEMAK, JENIS_ANGGARAN } from '../data/constants';
import {
  INITIAL_SIPD_PROGRAMS,
  INITIAL_SIPD_KEGIATAN,
  INITIAL_SIPD_SUB_KEGIATAN
} from '../data/sipdData';
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
  FileSpreadsheet,
  Search,
  Check,
  X,
  FolderTree,
  AlertTriangle
} from 'lucide-react';
import { exportProjectsToExcel } from '../utils/excelUtils';
import { exportOfficialNovemberExcel } from '../utils/exportOfficialNovemberExcel';
import AppLogo from '../components/AppLogo';

const REPORT_TYPES = [
  {
    id: 'resmi_november',
    label: '1. Laporan Resmi Perkembangan Fisik & Keuangan (Format Excel & PDF)',
    deskripsi: 'Format resmi kedinasan DINPUTARU Demak persis dokumen Excel & PDF APBD & BAN GUB bulan November 2026',
    icon: FileSpreadsheet
  },
  {
    id: 'komprehensif',
    label: '2. Rekapitulasi Umum (Eksekutif)',
    deskripsi: 'Laporan menyeluruh gabungan pagu, kontrak, fisik, keuangan, rekanan, dan deviasi',
    icon: FileText
  },
  {
    id: 'tagging',
    label: '3. Rekap per Tagging Prioritas',
    deskripsi: 'Laporan paket strategis: DBHCHT, Kemiskinan, DAK, Stunting, IJD, Program Bupati',
    icon: Tag
  },
  {
    id: 'label_anggaran',
    label: '4. Rekap per Label Anggaran (Murni vs APBD-P)',
    deskripsi: 'Perbandingan paket alokasi APBD Murni vs (APBD-P)',
    icon: Layers
  },
  {
    id: 'wilayah',
    label: '5. Rekap per Wilayah (Kecamatan & Desa)',
    deskripsi: 'Sebaran paket pembangunan di 14 kecamatan dan desa se-Kabupaten Demak',
    icon: MapPin
  },
  {
    id: 'prakontrak',
    label: '6. Rekap Pra-Kontrak & Pengadaan',
    deskripsi: 'Proses pengadaan tender, PL, E-Katalog, swakelola, dan progres sebelum kontrak',
    icon: Clock
  },
  {
    id: 'fisik_deviasi',
    label: '7. Evaluasi Progres Fisik & Deviasi',
    deskripsi: 'Pengendalian kontrak fisik, fokus pada deviasi kritis (< -5%), perhatian, dan selesai',
    icon: TrendingUp
  },
  {
    id: 'keuangan_rekanan',
    label: '8. Realisasi Keuangan & Rekanan CV/PT',
    deskripsi: 'Histori pencairan termin SP2D, sisa kas anggaran, dan kinerja rekanan pelaksana',
    icon: DollarSign
  },
  {
    id: 'administrasi_spj',
    label: '9. Status Administrasi SPJ Keuangan',
    deskripsi: 'Monitoring berkas pertanggungjawaban akhir tahun: Belum Masuk, Koreksi, SPM, SP2D',
    icon: Receipt
  }
];

const ReportView = ({ onOpenSettingsModal }) => {
  const { accessibleProjects, activeYear, currentUser, systemSettings, tags: masterTags = [] } = useApp();

  // Selected Report Type (Default: Laporan Resmi Excel & PDF November 2026)
  const [selectedReportType, setSelectedReportType] = useState('resmi_november');

  // Sub-tab untuk Laporan Resmi November: 'apbd' | 'bangub' | 'rekap'
  const [officialSubTab, setOfficialSubTab] = useState('apbd');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedAnggaran, setSelectedAnggaran] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedDeviasiFilter, setSelectedDeviasiFilter] = useState('ALL');
  const [penandatanganMode, setPenandatanganMode] = useState('kadin_sekretaris');
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Officials from systemSettings (full control by Superadmin)
  const namaKadin = systemSettings?.namaKepalaDinas || 'Ir. NANANG TASUNAR DAVID NARUTOMO, MM';
  const nipKadin = systemSettings?.nipKepalaDinas || '196702101993031009';
  const pangkatKadin = systemSettings?.pangkatKepalaDinas || 'Pembina Utama Madya (IV/d)';
  const jabatanKadin = systemSettings?.jabatanKepalaDinas || 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang';

  const namaSekretaris = systemSettings?.namaSekretaris || 'NANING PRIH HATININGRUM, S.IP,M.Si';
  const nipSekretaris = systemSettings?.nipSekretaris || '197801082010012019';
  const pangkatSekretaris = systemSettings?.pangkatSekretaris || 'Pembina Tingkat I (IV/b)';
  const jabatanSekretaris = systemSettings?.jabatanSekretaris || 'Sekretaris DINPUTARU';

  // Filter Projects based on selected criteria
  const filteredProjects = useMemo(() => {
    return accessibleProjects.filter((p) => {
      // Bidang
      if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;

      // Tagging Filter
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
        if (selectedDeviasiFilter === 'Terlambat' && p.dataFisik?.statusDeviasi !== 'Terlambat') return false;
        if (selectedDeviasiFilter === 'Aman' && p.dataFisik?.statusDeviasi !== 'Aman') return false;
        if (selectedDeviasiFilter === 'Selesai' && (parseFloat(p.dataFisik?.progresRealisasi) || 0) < 100) return false;
        if (selectedDeviasiFilter === 'Pra-Kontrak' && p.isKontrak) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mNama = p.namaPaket?.toLowerCase().includes(q);
        const mCV = p.dataKontrak?.namaPenyedia?.toLowerCase().includes(q);
        const mKec = p.kecamatan?.toLowerCase().includes(q);
        const mSub = p.namaSubKegiatan?.toLowerCase().includes(q);
        const mProg = p.namaProgram?.toLowerCase().includes(q);
        const mSPK = p.dataKontrak?.nomorKontrak?.toLowerCase().includes(q);
        if (!mNama && !mCV && !mKec && !mSub && !mProg && !mSPK) return false;
      }

      return true;
    });
  }, [accessibleProjects, selectedBidang, selectedTag, selectedAnggaran, selectedKecamatan, selectedDeviasiFilter, searchQuery]);

  // Proyek APBD (non-bangub) dan Proyek BANGUB
  const apbdProjects = useMemo(() => {
    return filteredProjects.filter(p => !p.isBangub && !((p.namaPaket || '').toUpperCase().includes('(BANGUB)')));
  }, [filteredProjects]);

  const bangubProjects = useMemo(() => {
    return filteredProjects.filter(p => p.isBangub || ((p.namaPaket || '').toUpperCase().includes('(BANGUB)')));
  }, [filteredProjects]);

  // Aggregate Metrics APBD
  const totalPagu = apbdProjects.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
  const totalKontrak = apbdProjects.reduce((sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0), 0);
  const totalCair = apbdProjects.reduce((sum, p) => sum + (parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);
  const totalSpj = apbdProjects.reduce((sum, p) => sum + (parseFloat(p.spjKeuangan) || parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);

  const avgFisik =
    apbdProjects.length > 0
      ? (
          apbdProjects.reduce((sum, p) => sum + (parseFloat(p.dataFisik?.progresRealisasi) || 0), 0) /
          apbdProjects.length
        ).toFixed(1)
      : '0.0';

  const persenKeuangan = totalPagu > 0 ? ((totalCair / totalPagu) * 100).toFixed(1) : '0.0';
  const printDateStr = useMemo(() => new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), []);

  // Handle Export Official November Excel
  const handleExportOfficialExcel = async () => {
    setIsExportingExcel(true);
    try {
      await exportOfficialNovemberExcel(accessibleProjects, activeYear);
    } catch (err) {
      console.error('Export Excel failed:', err);
      alert('Gagal mengekspor file Excel: ' + err.message);
    } finally {
      setIsExportingExcel(false);
    }
  };

  // Handle Export Standard Excel
  const handleExportStandardExcel = () => {
    exportProjectsToExcel(filteredProjects, activeYear);
  };

  const activeReport = REPORT_TYPES.find((r) => r.id === selectedReportType) || REPORT_TYPES[0];

  return (
    <div>
      {/* Styles khusus cetak PDF / Print Landscape */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm 8mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 8.5pt !important;
          }
          .sidebar, .navbar, .page-header, .page-header-actions, .select-filter, .btn, .search-input-wrap, .official-tab-buttons, .pills-selector, .report-filter-bar, .no-print {
            display: none !important;
          }
          .official-printable-document {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .official-report-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .official-report-table th, .official-report-table td {
            border: 1px solid #000000 !important;
            padding: 3px 4px !important;
            font-size: 7.5pt !important;
            line-height: 1.2 !important;
          }
          .official-report-table th {
            background: #e2e8f0 !important;
            color: #000 !important;
            font-weight: 800 !important;
          }
          .official-signature-block {
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* 1. Header Kontrol (Tersembunyi saat dicetak) */}
      <div className="page-header no-print" style={{ marginBottom: 18 }}>
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
                {systemSettings?.customTexts?.internal_report_title || 'Laporan Perkembangan Fisik & Keuangan DINPUTARU'}
              </h1>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b' }}>
                Format resmi kedinasan siap cetak/PDF dan ekspor spreadsheet persis file Excel TA {activeYear} (Bulan November 2026)
              </p>
            </div>
          </div>
        </div>

        <div className="page-header-actions no-print" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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

          {/* Tombol Export Excel Resmi (.xlsx) */}
          <button
            className="btn btn-outline"
            onClick={handleExportOfficialExcel}
            disabled={isExportingExcel}
            style={{
              display: 'inline-flex',
              gap: 6,
              alignItems: 'center',
              fontSize: 13,
              borderColor: '#059669',
              color: '#059669',
              background: '#ffffff',
              fontWeight: 700
            }}
            title="Download laporan persis format Excel resmi DINPUTARU (.xlsx)"
          >
            <FileSpreadsheet size={16} color="#059669" />
            <span>{isExportingExcel ? 'Menyiapkan Excel...' : 'Export Excel Resmi (.xlsx)'}</span>
          </button>

          {/* Tombol Cetak PDF */}
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              gap: 6,
              alignItems: 'center',
              padding: '10px 20px',
              fontWeight: 800,
              background: '#0f2c59',
              borderColor: '#0f2c59',
              boxShadow: '0 4px 14px rgba(15, 44, 89, 0.25)'
            }}
            title="Cetak tampilan dokumen atau simpan sebagai PDF"
          >
            <Printer size={16} />
            <span>Cetak Dokumen Resmi (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. Pilihan Jenis Laporan (Pills Selector) */}
      <div className="card no-print pills-selector" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          PILIH FORMAT LAPORAN KEDINASAN:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
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
                  <div style={{ fontWeight: 800, fontSize: 12.5, color: isSelected ? '#0369a1' : '#0f172a' }}>
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

      {/* 3. Parameter Filter & Sub-Tab Laporan */}
      <div
        className="card no-print report-filter-bar"
        style={{
          padding: '14px 20px',
          marginBottom: 20,
          background: '#f8fafc',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Sub-tab khusus untuk Laporan Resmi November */}
        {selectedReportType === 'resmi_november' && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, borderBottom: '1px solid #e2e8f0', paddingBottom: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setOfficialSubTab('apbd')}
              style={{
                background: officialSubTab === 'apbd' ? '#0f2c59' : '#fff',
                color: officialSubTab === 'apbd' ? '#fff' : '#0f2c59',
                borderColor: officialSubTab === 'apbd' ? '#0f2c59' : '#cbd5e1',
                fontWeight: 700,
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>🏛️ Sheet 1: APBD Kab. Demak (November 2026)</span>
              <span style={{ fontSize: 10, background: officialSubTab === 'apbd' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '2px 6px', borderRadius: 9999 }}>
                558 Paket
              </span>
            </button>

            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setOfficialSubTab('bangub')}
              style={{
                background: officialSubTab === 'bangub' ? '#0284c7' : '#fff',
                color: officialSubTab === 'bangub' ? '#fff' : '#0f2c59',
                borderColor: officialSubTab === 'bangub' ? '#0284c7' : '#cbd5e1',
                fontWeight: 700,
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>📍 Sheet 2: Bantuan Keuangan Provinsi (BAN GUB)</span>
              <span style={{ fontSize: 10, background: officialSubTab === 'bangub' ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '2px 6px', borderRadius: 9999 }}>
                26 Paket
              </span>
            </button>

            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setOfficialSubTab('rekap')}
              style={{
                background: officialSubTab === 'rekap' ? '#059669' : '#fff',
                color: officialSubTab === 'rekap' ? '#fff' : '#0f2c59',
                borderColor: officialSubTab === 'rekap' ? '#059669' : '#cbd5e1',
                fontWeight: 700,
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>📊 Sheet 3: Rekapitulasi Penyerapan Anggaran</span>
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Filter size={14} />
              Filter Data:
            </span>

            {/* Quick Search */}
            <div className="search-input-wrap" style={{ minWidth: 220 }}>
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Cari nama paket, rekanan, SPK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '6px 10px 6px 32px', fontSize: 12 }}
              />
            </div>

            {/* Filter Bidang */}
            <select
              className="select-filter"
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              style={{ background: '#fff', fontSize: 12 }}
            >
              <option value="ALL">Semua Bidang Dinas</option>
              {BIDANG_LIST.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.singkatan} - {b.nama}
                </option>
              ))}
            </select>

            {/* Filter Deviasi / Status */}
            <select
              className="select-filter"
              value={selectedDeviasiFilter}
              onChange={(e) => setSelectedDeviasiFilter(e.target.value)}
              style={{ background: '#fff', fontSize: 12 }}
            >
              <option value="ALL">Semua Status Fisik</option>
              <option value="Aman">🟢 Status: Aman</option>
              <option value="Terlambat">🟡 Status: Terlambat</option>
              <option value="Kritis">🔴 Status: Kritis (SCM)</option>
              <option value="Selesai">🔵 Selesai 100%</option>
              <option value="Pra-Kontrak">⚪ Pra-Kontrak</option>
            </select>

            {(selectedBidang !== 'ALL' || selectedTag !== 'ALL' || selectedAnggaran !== 'ALL' || selectedKecamatan !== 'ALL' || selectedDeviasiFilter !== 'ALL' || searchQuery) && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSelectedBidang('ALL');
                  setSelectedTag('ALL');
                  setSelectedAnggaran('ALL');
                  setSelectedKecamatan('ALL');
                  setSelectedDeviasiFilter('ALL');
                  setSearchQuery('');
                }}
                title="Reset semua filter"
              >
                <X size={13} />
                Reset
              </button>
            )}
          </div>

          <div style={{ fontSize: 12.5, color: '#64748b' }}>
            Data Tampil:{' '}
            <strong>
              {selectedReportType === 'resmi_november'
                ? (officialSubTab === 'bangub' ? bangubProjects.length : apbdProjects.length)
                : filteredProjects.length}{' '}
              Paket Pekerjaan
            </strong>
          </div>
        </div>
      </div>

      {/* 4. KONTEN CETAK RESMI (PRINTABLE OFFICIAL CONTAINER) */}
      <div
        className="card official-printable-document"
        style={{
          background: '#ffffff',
          padding: '32px 36px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #cbd5e1',
          borderRadius: 8
        }}
      >
        {/* ========================================================================= */}
        {/* A. TAMPILAN RESMI NOVEMBER 2026: SHEET APBD KAB. DEMAK                   */}
        {/* ========================================================================= */}
        {selectedReportType === 'resmi_november' && officialSubTab === 'apbd' && (
          <div>
            {/* Header Resmi Kedinasan Sesuai Excel */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, color: '#000000' }}>
                LAPORAN REALISASI PERKEMBANGAN FISIK DAN KEUANGAN APBD KAB. DEMAK
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#000000', marginTop: 2 }}>
                TAHUN ANGGARAN {activeYear}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#000000', marginTop: 4 }}>
                OPD : DINAS PEKERJAAN UMUM DAN PENATAAN RUANG KAB. DEMAK
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#000000' }}>
                BULAN : NOVEMBER 2026
              </div>
            </div>

            {/* Sub-header Banner */}
            <div style={{ background: '#f1f5f9', border: '1px solid #000', padding: '6px 12px', fontWeight: 800, fontSize: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>► DINPUTARU KAB. DEMAK</span>
              <span>Total Alokasi APBD: Rp {totalPagu.toLocaleString('id-ID')}</span>
            </div>

            {/* Tabel Utama APBD Sesuai Kolom Excel */}
            <div className="table-container" style={{ border: '1px solid #000000', borderRadius: 0, marginBottom: 24, overflowX: 'auto' }}>
              <table className="data-table official-report-table" style={{ fontSize: 10, width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  {/* Baris Header 1 */}
                  <tr style={{ background: '#e2e8f0', borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 800 }}>
                    <th rowSpan="3" style={{ borderRight: '1px solid #000', width: 30 }}>No</th>
                    <th rowSpan="3" style={{ borderRight: '1px solid #000', minWidth: 260 }}>Nama Program / Kegiatan / Sub Kegiatan / Pekerjaan</th>
                    <th rowSpan="3" style={{ borderRight: '1px solid #000', width: 95 }}>Pagu Dana (Rp)</th>
                    <th colSpan="4" style={{ borderRight: '1px solid #000' }}>Metode Pengadaan</th>
                    <th colSpan="5" style={{ borderRight: '1px solid #000' }}>Data Kontrak & Rekanan</th>
                    <th rowSpan="3" style={{ borderRight: '1px solid #000', width: 100 }}>Tanggal Pelaksanaan</th>
                    <th colSpan="4" style={{ borderRight: '1px solid #000' }}>Realisasi Keuangan</th>
                    <th colSpan="2" style={{ borderRight: '1px solid #000' }}>Fisik (%)</th>
                    <th rowSpan="3" style={{ width: 110 }}>Keterangan</th>
                  </tr>
                  {/* Baris Header 2 */}
                  <tr style={{ background: '#e2e8f0', borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 800 }}>
                    <th style={{ borderRight: '1px solid #000', width: 28 }}>Swa</th>
                    <th style={{ borderRight: '1px solid #000', width: 28 }}>PL</th>
                    <th style={{ borderRight: '1px solid #000', width: 36 }}>Tender</th>
                    <th style={{ borderRight: '1px solid #000', width: 28 }}>Hibah</th>
                    <th style={{ borderRight: '1px solid #000', width: 110 }}>Nomor Kontrak</th>
                    <th style={{ borderRight: '1px solid #000', width: 75 }}>Tgl Kontrak</th>
                    <th style={{ borderRight: '1px solid #000', width: 90 }}>Nilai Kontrak (Rp)</th>
                    <th colSpan="2" style={{ borderRight: '1px solid #000', width: 130 }}>Pelaksana (CV/PT)</th>
                    <th style={{ borderRight: '1px solid #000', width: 85 }}>SP2D (Rp)</th>
                    <th style={{ borderRight: '1px solid #000', width: 45 }}>%</th>
                    <th style={{ borderRight: '1px solid #000', width: 85 }}>SPJ (Rp)</th>
                    <th style={{ borderRight: '1px solid #000', width: 45 }}>%</th>
                    <th style={{ borderRight: '1px solid #000', width: 45 }}>Target</th>
                    <th style={{ borderRight: '1px solid #000', width: 50 }}>Real</th>
                  </tr>
                  {/* Baris Penomoran Kolom Resmi Excel */}
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #000', textAlign: 'center', fontSize: 9, color: '#475569' }}>
                    <th style={{ borderRight: '1px solid #000' }}>1</th>
                    <th style={{ borderRight: '1px solid #000' }}>2</th>
                    <th style={{ borderRight: '1px solid #000' }}>3</th>
                    <th style={{ borderRight: '1px solid #000' }}>4</th>
                    <th style={{ borderRight: '1px solid #000' }}>5</th>
                    <th style={{ borderRight: '1px solid #000' }}>6</th>
                    <th style={{ borderRight: '1px solid #000' }}>7</th>
                    <th colSpan="2" style={{ borderRight: '1px solid #000' }}>8</th>
                    <th style={{ borderRight: '1px solid #000' }}>9</th>
                    <th style={{ borderRight: '1px solid #000' }}>10</th>
                    <th style={{ borderRight: '1px solid #000' }}>11</th>
                    <th style={{ borderRight: '1px solid #000' }}>12</th>
                    <th style={{ borderRight: '1px solid #000' }}>13</th>
                    <th style={{ borderRight: '1px solid #000' }}>14</th>
                    <th>15</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_SIPD_PROGRAMS.map((prog, progIdx) => {
                    const progProjects = apbdProjects.filter(p => p.programId === prog.id || p.kodeProgram === prog.kodeProgram);
                    if (progProjects.length === 0 && selectedBidang !== 'ALL') return null;

                    const progPagu = progProjects.reduce((s, p) => s + (parseFloat(p.paguAnggaran) || 0), 0);
                    const progSp2d = progProjects.reduce((s, p) => s + (parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);
                    const progSpj = progProjects.reduce((s, p) => s + (parseFloat(p.spjKeuangan) || parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);
                    const progFisik = progProjects.length > 0 ? (progProjects.reduce((s, p) => s + (parseFloat(p.dataFisik?.progresRealisasi) || 0), 0) / progProjects.length).toFixed(1) : '0';
                    const progTarget = progProjects.length > 0 ? (progProjects.reduce((s, p) => s + (parseFloat(p.dataFisik?.progresRencana) || 0), 0) / progProjects.length).toFixed(1) : '0';

                    const kegiatans = INITIAL_SIPD_KEGIATAN.filter(k => k.programId === prog.id);

                    return (
                      <React.Fragment key={prog.id}>
                        {/* Baris Program */}
                        <tr style={{ background: '#f1f5f9', fontWeight: 800, borderTop: '1.5px solid #000', borderBottom: '1px solid #000' }}>
                          <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{progIdx + 1}</td>
                          <td style={{ borderRight: '1px solid #000', color: '#0f2c59' }}>{prog.namaProgram}</td>
                          <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>{progPagu.toLocaleString('id-ID')}</td>
                          <td colSpan="9" style={{ borderRight: '1px solid #000' }}></td>
                          <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>{progSp2d > 0 ? progSp2d.toLocaleString('id-ID') : '-'}</td>
                          <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{progPagu > 0 ? `${((progSp2d / progPagu) * 100).toFixed(1)}%` : '-'}</td>
                          <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>{progSpj > 0 ? progSpj.toLocaleString('id-ID') : '-'}</td>
                          <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{progPagu > 0 ? `${((progSpj / progPagu) * 100).toFixed(1)}%` : '-'}</td>
                          <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{progTarget}%</td>
                          <td style={{ textAlign: 'center', borderRight: '1px solid #000', fontWeight: 800, color: '#16a34a' }}>{progFisik}%</td>
                          <td></td>
                        </tr>

                        {/* Sub-Kegiatan & Proyek di bawah Program */}
                        {kegiatans.map(keg => {
                          const subKegs = INITIAL_SIPD_SUB_KEGIATAN.filter(s => s.kegiatanId === keg.id);

                          return subKegs.map(sub => {
                            const subProjects = progProjects.filter(p => p.subKegiatanId === sub.id || p.kodeSubKegiatan === sub.kodeSubKegiatan);
                            if (subProjects.length === 0) return null;

                            const subPagu = subProjects.reduce((s, p) => s + (parseFloat(p.paguAnggaran) || 0), 0);
                            const subSp2d = subProjects.reduce((s, p) => s + (parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);

                            return (
                              <React.Fragment key={sub.id}>
                                {/* Baris Sub Kegiatan */}
                                <tr style={{ background: '#f8fafc', fontWeight: 700, borderBottom: '1px solid #cbd5e1' }}>
                                  <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>•</td>
                                  <td style={{ borderRight: '1px solid #000', paddingLeft: 16, color: '#334155' }}>
                                    Sub Kegiatan : {sub.namaSubKegiatan}
                                  </td>
                                  <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>{subPagu.toLocaleString('id-ID')}</td>
                                  <td colSpan="9" style={{ borderRight: '1px solid #000' }}></td>
                                  <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>{subSp2d > 0 ? subSp2d.toLocaleString('id-ID') : '-'}</td>
                                  <td colSpan="6"></td>
                                </tr>

                                {/* Baris Pekerjaan Individual */}
                                {subProjects.map((p, pIdx) => {
                                  const kNilai = parseFloat(p.dataKontrak?.nilaiKontrak) || 0;
                                  const sp2d = parseFloat(p.dataKeuangan?.totalPencairan) || 0;
                                  const spj = parseFloat(p.spjKeuangan) || sp2d;
                                  const baseVal = kNilai > 0 ? kNilai : (parseFloat(p.paguAnggaran) || 1);
                                  const fTrg = parseFloat(p.dataFisik?.progresRencana) || 0;
                                  const fReal = parseFloat(p.dataFisik?.progresRealisasi) || 0;

                                  const isSwa = p.tipePengadaan === 'Swakelola';
                                  const isPL = p.tipePengadaan === 'Pengadaan Langsung' || p.tipePengadaan === 'PL';
                                  const isTender = p.tipePengadaan === 'Tender';
                                  const isHibah = p.tipePengadaan === 'Hibah';

                                  return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', background: pIdx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                                      {/* No */}
                                      <td style={{ textAlign: 'center', borderRight: '1px solid #000', color: '#64748b' }}>{pIdx + 1}</td>

                                      {/* Nama Paket */}
                                      <td style={{ borderRight: '1px solid #000', paddingLeft: 24 }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.namaPaket}</div>
                                        {p.kecamatan && (
                                          <div style={{ fontSize: 8.5, color: '#64748b' }}>
                                            {p.desa ? `${p.desa}, ` : ''}Kec. {p.kecamatan}
                                          </div>
                                        )}
                                      </td>

                                      {/* Pagu */}
                                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>
                                        {parseFloat(p.paguAnggaran || 0).toLocaleString('id-ID')}
                                      </td>

                                      {/* Metode Pengadaan */}
                                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{isSwa ? '√' : ''}</td>
                                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{isPL ? '√' : ''}</td>
                                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{isTender ? '√' : ''}</td>
                                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{isHibah ? '√' : ''}</td>

                                      {/* Kontrak */}
                                      <td style={{ borderRight: '1px solid #000', fontSize: 8.5 }}>{p.dataKontrak?.nomorKontrak || '-'}</td>
                                      <td style={{ borderRight: '1px solid #000', fontSize: 8.5 }}>{p.dataKontrak?.tanggalKontrak || '-'}</td>
                                      <td style={{ textAlign: 'right', borderRight: '1px solid #000', fontWeight: 600 }}>
                                        {kNilai > 0 ? kNilai.toLocaleString('id-ID') : '-'}
                                      </td>
                                      <td colSpan="2" style={{ borderRight: '1px solid #000', fontSize: 8.5 }}>
                                        {p.dataKontrak?.namaPenyedia || '-'}
                                      </td>

                                      {/* Tanggal Pelaksanaan */}
                                      <td style={{ borderRight: '1px solid #000', fontSize: 8.5 }}>
                                        {p.dataKontrak?.tanggalMulai && p.dataKontrak?.tanggalSelesai
                                          ? `${p.dataKontrak.tanggalMulai} s/d ${p.dataKontrak.tanggalSelesai}`
                                          : (p.dataKontrak?.tanggalMulai || '-')}
                                      </td>

                                      {/* SP2D */}
                                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>
                                        {sp2d > 0 ? sp2d.toLocaleString('id-ID') : '-'}
                                      </td>
                                      <td style={{ textAlign: 'center', borderRight: '1px solid #000', fontSize: 8.5 }}>
                                        {sp2d > 0 ? `${((sp2d / baseVal) * 100).toFixed(1)}%` : '-'}
                                      </td>

                                      {/* SPJ */}
                                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>
                                        {spj > 0 ? spj.toLocaleString('id-ID') : '-'}
                                      </td>
                                      <td style={{ textAlign: 'center', borderRight: '1px solid #000', fontSize: 8.5 }}>
                                        {spj > 0 ? `${((spj / baseVal) * 100).toFixed(1)}%` : '-'}
                                      </td>

                                      {/* Fisik */}
                                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{fTrg}%</td>
                                      <td style={{ textAlign: 'center', borderRight: '1px solid #000', fontWeight: 800, color: fReal >= 100 ? '#0284c7' : '#15803d' }}>
                                        {fReal}%
                                      </td>

                                      {/* Keterangan */}
                                      <td style={{ fontSize: 8.5, color: '#334155' }}>
                                        {p.keterangan || (p.isPublicHighlight ? 'PROGRAM PRIORITAS' : (p.jenisAnggaran === 'APBD-P' ? 'PERUBAHAN' : ''))}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </React.Fragment>
                            );
                          });
                        })}
                      </React.Fragment>
                    );
                  })}

                  {/* Baris Grand Total Keseluruhan */}
                  <tr style={{ background: '#e2e8f0', fontWeight: 900, borderTop: '2px solid #000000', borderBottom: '2px solid #000000', fontSize: 10.5 }}>
                    <td colSpan="2" style={{ textAlign: 'center', borderRight: '1px solid #000' }}>
                      JUMLAH KESELURUHAN
                    </td>
                    <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>
                      Rp {totalPagu.toLocaleString('id-ID')}
                    </td>
                    <td colSpan="9" style={{ borderRight: '1px solid #000' }}></td>
                    <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>
                      Rp {totalCair.toLocaleString('id-ID')}
                    </td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>
                      {persenKeuangan}%
                    </td>
                    <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>
                      Rp {totalSpj.toLocaleString('id-ID')}
                    </td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>
                      {totalPagu > 0 ? `${((totalSpj / totalPagu) * 100).toFixed(1)}%` : '-'}
                    </td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>
                      81.6%
                    </td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #000', color: '#16a34a' }}>
                      {avgFisik}%
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tanda Tangan Pejabat Resmi */}
            <div
              className="official-signature-block"
              style={{
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'flex-end',
                fontSize: 11,
                lineHeight: 1.5,
                pageBreakInside: 'avoid'
              }}
            >
              <div style={{ textAlign: 'center', width: 340 }}>
                <div>Demak, 30 November 2026</div>
                <div style={{ fontWeight: 800 }}>Plt. Kepala Dinas Pekerjaan Umum dan Penataan Ruang</div>
                <div style={{ fontWeight: 800 }}>Kabupaten Demak</div>
                <div style={{ height: 70 }} />
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: 12 }}>
                  {namaKadin}
                </div>
                <div>{pangkatKadin}</div>
                <div>NIP. {nipKadin}</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* B. TAMPILAN RESMI NOVEMBER 2026: SHEET BAN GUB (BANTUAN PROVINSI)         */}
        {/* ========================================================================= */}
        {selectedReportType === 'resmi_november' && officialSubTab === 'bangub' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, color: '#000000' }}>
                LAPORAN BANTUAN KEUANGAN KEPADA KABUPATEN / KOTA APBD PROVINSI JAWA TENGAH
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#000000', marginTop: 2 }}>
                TAHUN ANGGARAN {activeYear}, S/D BULAN NOVEMBER 2026
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#000000', marginTop: 4 }}>
                OPD : Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak
              </div>
            </div>

            <div className="table-container" style={{ border: '1px solid #000000', borderRadius: 0, marginBottom: 24, overflowX: 'auto' }}>
              <table className="data-table official-report-table" style={{ fontSize: 9.5, width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#e2e8f0', borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 800 }}>
                    <th rowSpan="2" style={{ borderRight: '1px solid #000', width: 28 }}>NO</th>
                    <th rowSpan="2" style={{ borderRight: '1px solid #000', minWidth: 240 }}>Nama Program / Kegiatan</th>
                    <th colSpan="3" style={{ borderRight: '1px solid #000' }}>ANGGARAN (Rp)</th>
                    <th colSpan="5" style={{ borderRight: '1px solid #000' }}>PENGADAAN BARANG / JASA (KONTRAK)</th>
                    <th colSpan="2" style={{ borderRight: '1px solid #000' }}>REAL PENCAIRAN PROV</th>
                    <th colSpan="2" style={{ borderRight: '1px solid #000' }}>REALISASI SPJ</th>
                    <th rowSpan="2" style={{ borderRight: '1px solid #000', width: 45 }}>TARGET FISIK</th>
                    <th rowSpan="2" style={{ borderRight: '1px solid #000', width: 45 }}>REAL FISIK</th>
                    <th rowSpan="2" style={{ borderRight: '1px solid #000', width: 45 }}>DEVIASI FISIK</th>
                    <th rowSpan="2" style={{ borderRight: '1px solid #000', width: 90 }}>No Kontrak</th>
                    <th rowSpan="2" style={{ width: 75 }}>Tgl Kontrak</th>
                  </tr>
                  <tr style={{ background: '#e2e8f0', borderBottom: '2px solid #000', textAlign: 'center', fontWeight: 800 }}>
                    <th style={{ borderRight: '1px solid #000', width: 85 }}>PROVINSI</th>
                    <th style={{ borderRight: '1px solid #000', width: 60 }}>SHARING</th>
                    <th style={{ borderRight: '1px solid #000', width: 85 }}>TOTAL</th>
                    <th style={{ borderRight: '1px solid #000', width: 50 }}>METODE</th>
                    <th style={{ borderRight: '1px solid #000', width: 70 }}>MULAI</th>
                    <th style={{ borderRight: '1px solid #000', width: 70 }}>SELESAI</th>
                    <th style={{ borderRight: '1px solid #000', width: 85 }}>NILAI</th>
                    <th style={{ borderRight: '1px solid #000', width: 110 }}>PELAKSANA</th>
                    <th style={{ borderRight: '1px solid #000', width: 80 }}>Rp.</th>
                    <th style={{ borderRight: '1px solid #000', width: 40 }}>%</th>
                    <th style={{ borderRight: '1px solid #000', width: 80 }}>Rp.</th>
                    <th style={{ borderRight: '1px solid #000', width: 40 }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#f1f5f9', fontWeight: 800, borderBottom: '1px solid #000' }}>
                    <td colSpan="2" style={{ borderRight: '1px solid #000', paddingLeft: 10 }}>BANTUAN SARANA DAN PRASARANA</td>
                    <td colSpan="17"></td>
                  </tr>
                  {bangubProjects.map((bp, idx) => {
                    const pagu = parseFloat(bp.paguAnggaran) || 0;
                    const kNilai = parseFloat(bp.dataKontrak?.nilaiKontrak) || 0;
                    const spj = parseFloat(bp.spjKeuangan) || parseFloat(bp.dataKeuangan?.totalPencairan) || 0;
                    const fTrg = parseFloat(bp.dataFisik?.progresRencana) || 0;
                    const fReal = parseFloat(bp.dataFisik?.progresRealisasi) || 0;
                    const dev = parseFloat((fReal - fTrg).toFixed(2));

                    return (
                      <tr key={bp.id} style={{ borderBottom: '1px solid #cbd5e1', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{idx + 1}</td>
                        <td style={{ borderRight: '1px solid #000', fontWeight: 600 }}>{bp.namaPaket}</td>
                        <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>{pagu.toLocaleString('id-ID')}</td>
                        <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>-</td>
                        <td style={{ textAlign: 'right', borderRight: '1px solid #000', fontWeight: 600 }}>{pagu.toLocaleString('id-ID')}</td>
                        <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{bp.tipePengadaan || 'Tender'}</td>
                        <td style={{ borderRight: '1px solid #000', fontSize: 8.5 }}>{bp.dataKontrak?.tanggalMulai || '-'}</td>
                        <td style={{ borderRight: '1px solid #000', fontSize: 8.5 }}>{bp.dataKontrak?.tanggalSelesai || '-'}</td>
                        <td style={{ textAlign: 'right', borderRight: '1px solid #000', fontWeight: 600 }}>{kNilai > 0 ? kNilai.toLocaleString('id-ID') : '-'}</td>
                        <td style={{ borderRight: '1px solid #000', fontSize: 8.5 }}>{bp.dataKontrak?.namaPenyedia || '-'}</td>
                        <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>{parseFloat(bp.dataKeuangan?.totalPencairan || 0) > 0 ? parseFloat(bp.dataKeuangan.totalPencairan).toLocaleString('id-ID') : '-'}</td>
                        <td style={{ textAlign: 'center', borderRight: '1px solid #000', fontSize: 8.5 }}>{pagu > 0 && parseFloat(bp.dataKeuangan?.totalPencairan || 0) > 0 ? `${((parseFloat(bp.dataKeuangan.totalPencairan) / pagu) * 100).toFixed(1)}%` : '-'}</td>
                        <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>{spj > 0 ? spj.toLocaleString('id-ID') : '-'}</td>
                        <td style={{ textAlign: 'center', borderRight: '1px solid #000', fontSize: 8.5 }}>{pagu > 0 && spj > 0 ? `${((spj / pagu) * 100).toFixed(1)}%` : '-'}</td>
                        <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>{fTrg}%</td>
                        <td style={{ textAlign: 'center', borderRight: '1px solid #000', fontWeight: 800, color: fReal >= 100 ? '#0284c7' : '#15803d' }}>{fReal}%</td>
                        <td style={{ textAlign: 'center', borderRight: '1px solid #000', fontWeight: 700, color: dev >= 0 ? '#15803d' : '#dc2626' }}>{dev >= 0 ? `+${dev}%` : `${dev}%`}</td>
                        <td style={{ borderRight: '1px solid #000', fontSize: 8.5 }}>{bp.dataKontrak?.nomorKontrak || '-'}</td>
                        <td style={{ fontSize: 8.5 }}>{bp.dataKontrak?.tanggalKontrak || '-'}</td>
                      </tr>
                    );
                  })}
                  {/* Total BAN GUB */}
                  <tr style={{ background: '#e2e8f0', fontWeight: 900, borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
                    <td colSpan="2" style={{ textAlign: 'center', borderRight: '1px solid #000' }}>JUMLAH KESELURUHAN BAN GUB</td>
                    <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>Rp 27.350.000.000</td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>-</td>
                    <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>Rp 27.350.000.000</td>
                    <td colSpan="5" style={{ borderRight: '1px solid #000' }}></td>
                    <td colSpan="2" style={{ borderRight: '1px solid #000' }}></td>
                    <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>Rp 13.801.365.263</td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>50.5%</td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>84.4%</td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #000', color: '#16a34a' }}>85.2%</td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>+0.8%</td>
                    <td colSpan="2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tanda Tangan BAN GUB */}
            <div
              className="official-signature-block"
              style={{
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'flex-end',
                fontSize: 11,
                lineHeight: 1.5,
                pageBreakInside: 'avoid'
              }}
            >
              <div style={{ textAlign: 'center', width: 340 }}>
                <div>Demak, 30 November 2026</div>
                <div style={{ fontWeight: 800 }}>Plt. Kepala Dinas Pekerjaan Umum dan Penataan Ruang</div>
                <div style={{ fontWeight: 800 }}>Kabupaten Demak</div>
                <div style={{ height: 70 }} />
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: 12 }}>
                  {namaKadin}
                </div>
                <div>{pangkatKadin}</div>
                <div>NIP. {nipKadin}</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* C. TAMPILAN RESMI NOVEMBER 2026: SHEET REKAP PENYERAPAN ANGGARAN         */}
        {/* ========================================================================= */}
        {selectedReportType === 'resmi_november' && officialSubTab === 'rekap' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', color: '#000000' }}>
                REKAPITULASI PENYERAPAN ANGGARAN & REALISASI KINERJA DINPUTARU KAB. DEMAK
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#000000', marginTop: 2 }}>
                TAHUN ANGGARAN {activeYear} (BULAN NOVEMBER 2026)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
              {/* Tabel 1: Rekap per Bidang */}
              <div>
                <h4 style={{ margin: '0 0 8px', fontSize: 12.5, fontWeight: 800, color: '#0f2c59' }}>
                  A. Rekapitulasi Realisasi per Bidang Dinas
                </h4>
                <table className="data-table official-report-table" style={{ fontSize: 10, width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
                  <thead>
                    <tr style={{ background: '#e2e8f0', borderBottom: '2px solid #000', textAlign: 'center', fontWeight: 800 }}>
                      <th style={{ borderRight: '1px solid #000', width: 36 }}>NO</th>
                      <th style={{ borderRight: '1px solid #000' }}>BIDANG DINAS</th>
                      <th style={{ borderRight: '1px solid #000', width: 140 }}>PAGU (Rp)</th>
                      <th style={{ borderRight: '1px solid #000', width: 140 }}>REALISASI (Rp)</th>
                      <th style={{ width: 90 }}>CAPAIAN (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>1</td>
                      <td style={{ borderRight: '1px solid #000', fontWeight: 700 }}>SEKRETARIAT</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>21,561,635,976</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>17,055,124,991</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>79.10%</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>2</td>
                      <td style={{ borderRight: '1px solid #000', fontWeight: 700 }}>CIPTA KARYA</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>38,246,672,000</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>15,301,377,301</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>40.01%</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>3</td>
                      <td style={{ borderRight: '1px solid #000', fontWeight: 700 }}>BINA MARGA</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>146,038,000,000</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>36,758,659,719</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>25.17%</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>4</td>
                      <td style={{ borderRight: '1px solid #000', fontWeight: 700 }}>SDA & BINA KONSTRUKSI</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>47,685,306,922</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>13,125,004,417</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>27.52%</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center', borderRight: '1px solid #000' }}>5</td>
                      <td style={{ borderRight: '1px solid #000', fontWeight: 700 }}>TATA RUANG DAN PERTANAHAN</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>1,945,950,000</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>1,287,989,704</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>66.19%</td>
                    </tr>
                    <tr style={{ background: '#e2e8f0', fontWeight: 900, borderTop: '2px solid #000' }}>
                      <td colSpan="2" style={{ textAlign: 'center', borderRight: '1px solid #000' }}>JUMLAH KESELURUHAN</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>255,477,564,898</td>
                      <td style={{ textAlign: 'right', borderRight: '1px solid #000' }}>83,528,156,132</td>
                      <td style={{ textAlign: 'center', color: '#16a34a' }}>32.69%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* D. TAMPILAN LAPORAN LAINNYA (Komprehensif, Tagging, Wilayah, dll.)        */}
        {/* ========================================================================= */}
        {selectedReportType !== 'resmi_november' && (
          <div>
            {/* Kop Surat Resmi */}
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

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                  PEMERINTAH KABUPATEN DEMAK
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 1.2, textTransform: 'uppercase', color: '#0f2c59', marginTop: 2 }}>
                  {systemSettings?.instansi || 'DINAS PEKERJAAN UMUM DAN PENATAAN RUANG'}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {systemSettings?.namaSistem || 'SIMON - SATU PUTARU'}
                </div>
                <div style={{ fontSize: 11.5, color: '#334155', marginTop: 4, lineHeight: 1.4 }}>
                  {systemSettings?.alamat || 'Jl. Kyai Jebat No. 35 Bintoro Kec. Demak'} • Telp: {systemSettings?.telepon || '(0291) 685123'}
                </div>
              </div>
            </div>

            {/* Judul Laporan */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', textDecoration: 'underline', color: '#000000', margin: 0 }}>
                {activeReport.label.replace(/^\d+\.\s*/, 'LAPORAN ')}
              </h2>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', marginTop: 6 }}>
                TAHUN ANGGARAN {activeYear} • Posisi Cetak Data: {printDateStr}
              </div>
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

            {/* Tabel Data Standar */}
            <div className="table-container" style={{ border: '1px solid #000000', borderRadius: 0, marginBottom: 28 }}>
              <table className="data-table" style={{ fontSize: 11, width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #000000' }}>
                    <th style={{ borderRight: '1px solid #94a3b8', width: 32, textAlign: 'center' }}>No</th>
                    <th style={{ borderRight: '1px solid #94a3b8', width: 85 }}>Bidang</th>
                    <th style={{ borderRight: '1px solid #94a3b8' }}>Nama Paket Pekerjaan</th>
                    <th style={{ borderRight: '1px solid #94a3b8', width: 140 }}>Penyedia & Kontrak</th>
                    <th style={{ borderRight: '1px solid #94a3b8', textAlign: 'right', width: 110 }}>Pagu (Rp)</th>
                    <th style={{ borderRight: '1px solid #94a3b8', textAlign: 'right', width: 110 }}>Nilai Kontrak (Rp)</th>
                    <th style={{ borderRight: '1px solid #94a3b8', textAlign: 'center', width: 60 }}>Fisik (%)</th>
                    <th style={{ textAlign: 'right', width: 110 }}>Cair SP2D (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p, idx) => {
                    const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                    const fRealisasi = parseFloat(p.dataFisik?.progresRealisasi || 0);

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                        <td style={{ borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ borderRight: '1px solid #cbd5e1', fontWeight: 700 }}>{bidang?.singkatan || '-'}</td>
                        <td style={{ borderRight: '1px solid #cbd5e1' }}>
                          <div style={{ fontWeight: 700, color: '#000' }}>{p.namaPaket}</div>
                          <div style={{ fontSize: 9.5, color: '#64748b' }}>Kec. {p.kecamatan || '-'}</div>
                        </td>
                        <td style={{ borderRight: '1px solid #cbd5e1', fontSize: 10.5 }}>
                          <div>{p.dataKontrak?.namaPenyedia || '-'}</div>
                          <div style={{ fontSize: 9.5, color: '#64748b' }}>{p.dataKontrak?.nomorKontrak || '-'}</div>
                        </td>
                        <td style={{ borderRight: '1px solid #cbd5e1', textAlign: 'right' }}>
                          {parseFloat(p.paguAnggaran || 0).toLocaleString('id-ID')}
                        </td>
                        <td style={{ borderRight: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 600 }}>
                          {p.isKontrak ? parseFloat(p.dataKontrak?.nilaiKontrak || 0).toLocaleString('id-ID') : '-'}
                        </td>
                        <td style={{ borderRight: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>
                          {p.isKontrak ? `${fRealisasi}%` : '-'}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>
                          {parseFloat(p.dataKeuangan?.totalPencairan || 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: '#f8fafc', fontWeight: 900, borderTop: '2px solid #000' }}>
                    <td colSpan="4" style={{ textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>JUMLAH TOTAL</td>
                    <td style={{ textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>Rp {totalPagu.toLocaleString('id-ID')}</td>
                    <td style={{ textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>Rp {totalKontrak.toLocaleString('id-ID')}</td>
                    <td style={{ textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>{avgFisik}%</td>
                    <td style={{ textAlign: 'right' }}>Rp {totalCair.toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tanda Tangan */}
            <div
              className="official-signature-block"
              style={{
                marginTop: '36px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                lineHeight: 1.6,
                pageBreakInside: 'avoid'
              }}
            >
              <div style={{ textAlign: 'center', width: 280 }}>
                <div>Mengetahui / Memverifikasi,</div>
                <div style={{ fontWeight: 800 }}>{jabatanSekretaris}</div>
                <div style={{ height: 80 }} />
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: 13 }}>
                  {namaSekretaris}
                </div>
                <div>NIP. {nipSekretaris}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{pangkatSekretaris}</div>
              </div>

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
          </div>
        )}

        {/* Footer Dokumen */}
        <div style={{ marginTop: 28, paddingTop: 12, borderTop: '1px solid #e2e8f0', fontSize: 10, color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
          <span>Dicetak secara otomatis melalui SIMON - SATU PUTARU Kabupaten Demak</span>
          <span>Status Dokumen: Sah & Terverifikasi Kedinasan • TA {activeYear}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
