import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST } from '../data/constants';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Building2,
  FileText,
  DollarSign,
  Activity,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import * as xlsx from 'xlsx';

// Format currency without decimals, plain numbers full down to units
const formatRupiah = (val) => {
  const num = typeof val === 'number' ? val : parseFloat(val) || 0;
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
};

const BIDANG_COLOR_MAP = {
  bina_marga: {
    nama: 'Bina Marga',
    singkatan: 'BM',
    warna: '#0284c7',
    bg: '#e0f2fe',
    border: '#bae6fd'
  },
  cipta_karya: {
    nama: 'Cipta Karya',
    singkatan: 'CK',
    warna: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a'
  },
  sda_bk: {
    nama: 'SDA & Bangunan Koko',
    singkatan: 'SDA-BK',
    warna: '#059669',
    bg: '#d1fae5',
    border: '#a7f3d0'
  },
  tata_ruang: {
    nama: 'Tata Ruang',
    singkatan: 'TRP',
    warna: '#7c3aed',
    bg: '#ede9fe',
    border: '#ddd6fe'
  },
  sekretariat: {
    nama: 'Sekretariat',
    singkatan: 'Sekre',
    warna: '#475569',
    bg: '#f1f5f9',
    border: '#e2e8f0'
  }
};

const KATEGORI_CONFIG = [
  { id: 'ALL', label: 'Semua Kategori', badge: '478' },
  { id: 'fisik', label: '1. Pekerjaan Konstruksi (Fisik)', badge: '284', keyMatch: 'Konstruksi' },
  { id: 'jakon', label: '2. Jasa Konsultansi', badge: '135', keyMatch: 'Konsultansi' },
  { id: 'barang', label: '3. Pengadaan Barang', badge: '53', keyMatch: 'Barang' },
  { id: 'jasa_lainnya', label: '4. Jasa Lainnya', badge: '6', keyMatch: 'Jasa Lainnya' }
];

const MonitoringPaketView = ({ onOpenProjectModal, onViewProject, onQuickUpdate }) => {
  const {
    paketPekerjaanList = [],
    accessiblePaketPekerjaan = [],
    canEditProject,
    currentUser,
    updatePaketPekerjaan
  } = useApp();
  const activeList = paketPekerjaanList.length > 0 ? paketPekerjaanList : accessiblePaketPekerjaan;

  const [activeKategori, setActiveKategori] = useState('ALL');
  const [viewMode, setViewMode] = useState('fisik'); // 'fisik' | 'pencairan' | 'semua'
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedMetode, setSelectedMetode] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editStatusItem, setEditStatusItem] = useState(null);

  // Filter 478 official monitoring packages, strictly ordered by Excel order
  const filteredList = useMemo(() => {
    return activeList.filter((p) => {
      // 1. Filter Kategori
      if (activeKategori !== 'ALL') {
        const catCfg = KATEGORI_CONFIG.find((k) => k.id === activeKategori);
        const matchCat =
          p.kategoriPaketId === activeKategori ||
          (catCfg && (
            (p.kategoriPaket || '').toLowerCase().includes(catCfg.keyMatch.toLowerCase()) ||
            (p.kategoriPekerjaan || '').toLowerCase().includes(catCfg.keyMatch.toLowerCase()) ||
            (p.jenisPengadaan || '').toLowerCase().includes(catCfg.keyMatch.toLowerCase())
          ));
        if (!matchCat) return false;
      }

      // 2. Filter Bidang
      if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) {
        return false;
      }

      // 3. Filter Metode Pemilihan
      if (selectedMetode !== 'ALL') {
        const m = p.metodePemilihan || p.tipePengadaan || '';
        if (!m.toLowerCase().includes(selectedMetode.toLowerCase())) {
          return false;
        }
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nama = (p.namaPaket || '').toLowerCase();
        const sub = (p.subKegiatan || p.subBagian || '').toLowerCase();
        const pel = (p.dataKontrak?.namaPenyedia || '').toLowerCase();
        const noK = (p.dataKontrak?.nomorKontrak || '').toLowerCase();
        if (!nama.includes(q) && !sub.includes(q) && !pel.includes(q) && !noK.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [projects, activeKategori, selectedBidang, selectedMetode, searchQuery]);

  // Summary Aggregates
  const stats = useMemo(() => {
    const list = filteredList;
    const totalPagu = list.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
    const totalKontrak = list.reduce((sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0), 0);
    const totalSP2D = list.reduce((sum, p) => sum + (parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);
    const countKontrak = list.filter((p) => p.isKontrak || (p.dataKontrak?.nilaiKontrak || 0) > 0).length;
    const sumFisik = list.reduce((sum, p) => sum + (parseFloat(p.dataFisik?.progresRealisasi) || 0), 0);
    const avgFisik = list.length > 0 ? (sumFisik / list.length).toFixed(1) : '0.0';

    const countSelesai = list.filter((p) => p.tahapanPencairan?.selesai || p.spjStatus === 'sudah_sp2d' || (parseFloat(p.dataFisik?.progresRealisasi) || 0) >= 100).length;
    const countSPM = list.filter((p) => p.tahapanPencairan?.spm || p.spjStatus === 'spm_terbit').length;
    const countMasuk = list.filter((p) => p.tahapanPencairan?.berkasMasuk || p.spjStatus === 'sudah_masuk').length;

    return {
      totalPaket: list.length,
      totalPagu,
      totalKontrak,
      totalSP2D,
      countKontrak,
      avgFisik,
      countSelesai,
      countSPM,
      countMasuk
    };
  }, [filteredList]);

  // Export Table to Excel (.xlsx) exactly according to the template
  const handleExportExcel = () => {
    const rows = [
      ['PROGRES MONITORING PAKET PEKERJAAN DINPUTARU KABUPATEN DEMAK TA 2026'],
      ['Tanggal Ekspor: ' + new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID')],
      [],
      [
        'No',
        'Kategori',
        'Bidang',
        'Sub Kegiatan',
        'Nama Paket',
        'Jenis Pengadaan',
        'Metode Pemilihan',
        'Pagu Anggaran Pengadaan (Rp)',
        'No Kontrak',
        'Tanggal Kontrak',
        'Nilai Kontrak (Rp)',
        'Pelaksana',
        'Tanggal Pelaksanaan',
        'Progres Fisik (%)',
        'Progres Keu / SP2D (Rp)',
        'Tahap: Berkas Masuk',
        'Tahap: Koreksi',
        'Tahap: SPM',
        'Tahap: Selesai / Lunas'
      ]
    ];

    filteredList.forEach((p, idx) => {
      const bInfo = BIDANG_COLOR_MAP[p.bidangId] || { nama: p.bidangId || 'Dinas' };
      rows.push([
        p.noUrutKategori || idx + 1,
        p.kategoriPaket || p.kategoriPekerjaan || 'Konstruksi',
        bInfo.nama,
        p.subKegiatan || p.subBagian || '',
        p.namaPaket,
        p.jenisPengadaan || 'Pekerjaan Konstruksi',
        p.metodePemilihan || p.tipePengadaan || 'Pengadaan Langsung',
        p.paguAnggaran || 0,
        p.dataKontrak?.nomorKontrak || '',
        p.dataKontrak?.tanggalKontrak || '',
        p.dataKontrak?.nilaiKontrak || 0,
        p.dataKontrak?.namaPenyedia || '',
        p.dataKontrak?.tanggalMulai || '',
        p.dataFisik?.progresRealisasi || 0,
        p.dataKeuangan?.totalPencairan || 0,
        p.tahapanPencairan?.berkasMasuk ? 'Ya' : 'Belum',
        p.tahapanPencairan?.koreksi ? 'Koreksi' : '-',
        p.tahapanPencairan?.spm ? 'SPM Terbit' : '-',
        p.tahapanPencairan?.selesai ? 'Lunas / Selesai' : 'Belum'
      ]);
    });

    const ws = xlsx.utils.aoa_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Monitoring Paket');
    xlsx.writeFile(wb, `Monitoring_Paket_Dinputaru_2026_${Date.now()}.xlsx`);
  };

  // Quick update pencairan stage (70% and 100%)
  const handleSavePencairanStage = (projectId, stageKey, value) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    const currentTahap = target.tahapanPencairan || {};
    const updatedTahap = {
      ...currentTahap,
      [stageKey]: value
    };

    if (stageKey === 'selesai' && value) {
      updatedTahap.spm = true;
      updatedTahap.berkasMasuk = true;
    }

    updatePaketPekerjaan(projectId, {
      tahapanPencairan: updatedTahap
    });

    setEditStatusItem(null);
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. TOP HEADER & INTRO */}
      <div
        style={{
          background: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #0284c7 100%)',
          borderRadius: 16,
          padding: '24px 28px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: '0 8px 24px rgba(15, 44, 89, 0.25)'
        }}
      >
        <div style={{ maxWidth: 800 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: 20,
                padding: '3px 12px',
                fontSize: 11.5,
                fontWeight: 800,
                letterSpacing: 0.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <FileSpreadsheet size={13} />
              <span>DOKUMEN RESMI PBJ TA 2026</span>
            </span>
            <span style={{ fontSize: 12, color: '#93c5fd' }}>• Dinas PU dan Penataan Ruang Kab. Demak</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: -0.5, color: '#ffffff' }}>
            Monitoring Paket Pekerjaan TA 2026
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#bfdbfe', lineHeight: 1.5 }}>
            Pengendalian 4 kategori paket pengadaan: <strong>Konstruksi Fisik</strong>, <strong>Jasa Konsultansi</strong>, <strong>Pengadaan Barang</strong>, dan <strong>Jasa Lainnya</strong> terintegrasi dengan progres fisik dan pencairan SP2D keuangan.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="btn"
            onClick={handleExportExcel}
            style={{
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(5, 150, 105, 0.3)'
            }}
          >
            <Download size={15} />
            <span>Ekspor Excel Sesuai Template</span>
          </button>
        </div>
      </div>

      {/* 2. STATS SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
        {/* Card 1: Total Pagu */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: 12, fontWeight: 700 }}>
            <span>TOTAL PAGU PENGADAAN</span>
            <DollarSign size={16} color="#0284c7" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#0f2c59', marginTop: 8 }}>
            {formatRupiah(stats.totalPagu)}
          </div>
          <div style={{ fontSize: 11.5, color: '#0284c7', marginTop: 4, fontWeight: 600 }}>
            {stats.totalPaket} Paket Terdata
          </div>
        </div>

        {/* Card 2: Total Kontrak */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: 12, fontWeight: 700 }}>
            <span>TOTAL NILAI KONTRAK</span>
            <Building2 size={16} color="#059669" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#059669', marginTop: 8 }}>
            {formatRupiah(stats.totalKontrak)}
          </div>
          <div style={{ fontSize: 11.5, color: '#059669', marginTop: 4, fontWeight: 600 }}>
            {stats.countKontrak} Paket Sudah Kontrak
          </div>
        </div>

        {/* Card 3: Progres Fisik Rata-rata */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: 12, fontWeight: 700 }}>
            <span>RATA-RATA FISIK</span>
            <Activity size={16} color="#d97706" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#d97706', marginTop: 8 }}>
            {stats.avgFisik}%
          </div>
          <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 4, fontWeight: 600 }}>
            {stats.countSelesai} Paket Selesai 100%
          </div>
        </div>

        {/* Card 4: Realisasi SP2D Keuangan */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: 12, fontWeight: 700 }}>
            <span>REALISASI KEUANGAN (SP2D)</span>
            <Receipt size={16} color="#7c3aed" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#7c3aed', marginTop: 8 }}>
            {formatRupiah(stats.totalSP2D)}
          </div>
          <div style={{ fontSize: 11.5, color: '#7c3aed', marginTop: 4, fontWeight: 600 }}>
            {stats.totalKontrak > 0 ? ((stats.totalSP2D / stats.totalKontrak) * 100).toFixed(1) : 0}% Terhadap Kontrak
          </div>
        </div>
      </div>

      {/* 3. CATEGORY SWITCHER TABS (4 KATEGORI RESMI EXCEL) */}
      <div style={{ background: '#ffffff', borderRadius: 14, padding: '8px 10px', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        {KATEGORI_CONFIG.map((cat) => {
          const isActive = activeKategori === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveKategori(cat.id)}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #0f2c59, #0284c7)' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  fontSize: 11,
                  padding: '1px 7px',
                  borderRadius: 12,
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontWeight: 800
                }}
              >
                {cat.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. SUB-VIEW CONTROLS & FILTER BAR */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          {/* Sub-view Mode Switcher: Fisik vs Pencairan vs Lengkap */}
          <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
            <button
              type="button"
              onClick={() => setViewMode('fisik')}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: viewMode === 'fisik' ? 800 : 600,
                border: 'none',
                background: viewMode === 'fisik' ? '#ffffff' : 'transparent',
                color: viewMode === 'fisik' ? '#0f2c59' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: viewMode === 'fisik' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Activity size={14} color={viewMode === 'fisik' ? '#0284c7' : '#94a3b8'} />
              <span>Monitoring Fisik Paket</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('pencairan')}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: viewMode === 'pencairan' ? 800 : 600,
                border: 'none',
                background: viewMode === 'pencairan' ? '#ffffff' : 'transparent',
                color: viewMode === 'pencairan' ? '#0f2c59' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: viewMode === 'pencairan' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Receipt size={14} color={viewMode === 'pencairan' ? '#059669' : '#94a3b8'} />
              <span>Monitoring Pencairan Paket (SP2D)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('semua')}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: viewMode === 'semua' ? 800 : 600,
                border: 'none',
                background: viewMode === 'semua' ? '#ffffff' : 'transparent',
                color: viewMode === 'semua' ? '#0f2c59' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: viewMode === 'semua' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <FileSpreadsheet size={14} color={viewMode === 'semua' ? '#7c3aed' : '#94a3b8'} />
              <span>Rekap Lengkap (Semua Kolom Excel)</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: 340, maxWidth: '100%' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama paket, sub kegiatan, pelaksana..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 38, height: 38, fontSize: 12.5, borderRadius: 8 }}
            />
          </div>
        </div>

        {/* Filter Dropdowns: Bidang & Metode Pemilihan */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} color="#64748b" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Filter Bidang Dinas:</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button
              type="button"
              onClick={() => setSelectedBidang('ALL')}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 11.5,
                fontWeight: selectedBidang === 'ALL' ? 800 : 600,
                border: `1px solid ${selectedBidang === 'ALL' ? '#0f2c59' : '#cbd5e1'}`,
                background: selectedBidang === 'ALL' ? '#0f2c59' : '#ffffff',
                color: selectedBidang === 'ALL' ? '#ffffff' : '#475569',
                cursor: 'pointer'
              }}
            >
              Semua Bidang
            </button>

            {Object.entries(BIDANG_COLOR_MAP).map(([bKey, bVal]) => {
              const isSelected = selectedBidang === bKey;
              return (
                <button
                  key={bKey}
                  type="button"
                  onClick={() => setSelectedBidang(bKey)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    fontSize: 11.5,
                    fontWeight: isSelected ? 800 : 700,
                    border: `1px solid ${isSelected ? bVal.warna : bVal.border}`,
                    background: isSelected ? bVal.warna : bVal.bg,
                    color: isSelected ? '#ffffff' : bVal.warna,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isSelected ? '#ffffff' : bVal.warna }} />
                  <span>{bVal.nama}</span>
                </button>
              );
            })}
          </div>

          {/* Metode Pemilihan Selector */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Metode:</span>
            <select
              className="form-control"
              value={selectedMetode}
              onChange={(e) => setSelectedMetode(e.target.value)}
              style={{ height: 34, fontSize: 12, padding: '4px 10px', borderRadius: 8, width: 170 }}
            >
              <option value="ALL">Semua Metode PBJ</option>
              <option value="Pengadaan Langsung">Pengadaan Langsung</option>
              <option value="Tender">Tender</option>
              <option value="e-Purchasing">e-Purchasing</option>
              <option value="Seleksi">Seleksi</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. DATA TABLE (STRICTLY PRESERVING EXCEL ORDER & BIDANG COLORING) */}
      <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Menampilkan <strong>{filteredList.length}</strong> dari 478 Paket Pekerjaan</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>(Urutan sesuai Excel per Kategori)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: '#64748b' }}>
            <span>Petunjuk Warna Bidang:</span>
            <span style={{ color: '#0284c7', fontWeight: 700 }}>● Bina Marga</span>
            <span style={{ color: '#d97706', fontWeight: 700 }}>● Cipta Karya</span>
            <span style={{ color: '#059669', fontWeight: 700 }}>● SDA & Bangunan Koko</span>
            <span style={{ color: '#7c3aed', fontWeight: 700 }}>● Tata Ruang</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#0f2c59', fontWeight: 800, borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ width: 50, textAlign: 'center', padding: '12px 8px' }}>No</th>
                <th style={{ width: 140, padding: '12px 10px' }}>Keterangan Bidang</th>
                <th style={{ minWidth: 260, padding: '12px 10px' }}>Nama Paket & Sub Kegiatan</th>
                <th style={{ width: 140, padding: '12px 10px' }}>Jenis / Metode</th>
                <th style={{ width: 135, textAlign: 'right', padding: '12px 10px' }}>Pagu Anggaran</th>

                {/* Columns for Monitoring Fisik Mode */}
                {(viewMode === 'fisik' || viewMode === 'semua') && (
                  <>
                    <th style={{ width: 140, padding: '12px 10px' }}>No & Tgl Kontrak</th>
                    <th style={{ width: 135, textAlign: 'right', padding: '12px 10px' }}>Nilai Kontrak</th>
                    <th style={{ width: 150, padding: '12px 10px' }}>Penyedia / Pelaksana</th>
                    <th style={{ width: 120, textAlign: 'center', padding: '12px 10px' }}>Progres Fisik</th>
                  </>
                )}

                {/* Columns for Monitoring Pencairan Mode */}
                {(viewMode === 'pencairan' || viewMode === 'semua') && (
                  <>
                    <th style={{ width: 135, textAlign: 'right', padding: '12px 10px' }}>SP2D Keuangan</th>
                    <th style={{ minWidth: 280, padding: '12px 10px' }}>Tahapan Pencairan (70% & 100%)</th>
                    <th style={{ width: 125, textAlign: 'right', padding: '12px 10px' }}>Sisa Anggaran</th>
                  </>
                )}

                <th style={{ width: 90, textAlign: 'center', padding: '12px 8px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={15} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <AlertCircle size={32} color="#94a3b8" />
                      <span style={{ fontSize: 14, fontWeight: 700 }}>Tidak ada paket pekerjaan yang cocok dengan filter.</span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setActiveKategori('ALL');
                          setSelectedBidang('ALL');
                          setSelectedMetode('ALL');
                          setSearchQuery('');
                        }}
                      >
                        Reset Seluruh Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((p, idx) => {
                  const bInfo = BIDANG_COLOR_MAP[p.bidangId] || {
                    nama: p.bidangId || 'Dinas',
                    singkatan: 'PU',
                    warna: '#475569',
                    bg: '#f1f5f9',
                    border: '#cbd5e1'
                  };

                  const paguVal = parseFloat(p.paguAnggaran) || 0;
                  const kNilai = parseFloat(p.dataKontrak?.nilaiKontrak) || 0;
                  const sp2dVal = parseFloat(p.dataKeuangan?.totalPencairan) || 0;
                  const persenKeu = parseFloat(p.dataKeuangan?.persenKeuangan) || 0;
                  const fRealisasi = parseFloat(p.dataFisik?.progresRealisasi) || 0;
                  const sisa = Math.max(0, (kNilai > 0 ? kNilai : paguVal) - sp2dVal);

                  const tahap = p.tahapanPencairan || {};
                  const isSelesai = tahap.selesai || sp2dVal >= (kNilai > 0 ? kNilai : paguVal) || fRealisasi >= 100;
                  const isSPM = isSelesai || tahap.spm || p.spjStatus === 'spm_terbit';
                  const isMasuk = isSPM || tahap.berkasMasuk || p.spjStatus === 'sudah_masuk';

                  return (
                    <tr
                      key={p.id || idx}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        borderLeft: `4px solid ${bInfo.warna}`,
                        background: idx % 2 === 0 ? '#ffffff' : '#fcfdfd',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#fcfdfd')}
                    >
                      {/* No Urut Excel */}
                      <td style={{ textAlign: 'center', padding: '12px 8px', fontWeight: 800, color: '#0f2c59' }}>
                        {p.noUrutKategori || idx + 1}
                      </td>

                      {/* Keterangan Bidang dengan Warna Beda */}
                      <td style={{ padding: '12px 10px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 800,
                            background: bInfo.bg,
                            color: bInfo.warna,
                            border: `1px solid ${bInfo.border}`,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: bInfo.warna }} />
                          <span>{bInfo.nama}</span>
                        </span>
                      </td>

                      {/* Nama Paket & Sub Kegiatan */}
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 700, color: '#0f2c59', lineHeight: 1.4 }}>
                          {p.namaPaket}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                          Sub Kegiatan: {p.subKegiatan || p.subBagian || '-'}
                        </div>
                      </td>

                      {/* Jenis & Metode Pemilihan */}
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#334155' }}>
                          {p.metodePemilihan || p.tipePengadaan || 'Pengadaan Langsung'}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>
                          {p.jenisPengadaan || p.kategoriPaket || 'Pekerjaan Konstruksi'}
                        </div>
                      </td>

                      {/* Pagu Anggaran (Nominal Penuh Satuan) */}
                      <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 800, color: '#0f2c59' }}>
                        {formatRupiah(paguVal)}
                      </td>

                      {/* Kolom Monitoring Fisik */}
                      {(viewMode === 'fisik' || viewMode === 'semua') && (
                        <>
                          <td style={{ padding: '12px 10px', fontSize: 11.5 }}>
                            {p.dataKontrak?.nomorKontrak ? (
                              <div>
                                <span style={{ fontWeight: 700, color: '#0f2c59' }}>{p.dataKontrak.nomorKontrak}</span>
                                <div style={{ fontSize: 10.5, color: '#64748b' }}>{p.dataKontrak.tanggalKontrak || '-'}</div>
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Belum Kontrak</span>
                            )}
                          </td>

                          <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 800, color: kNilai > 0 ? '#059669' : '#94a3b8' }}>
                            {kNilai > 0 ? formatRupiah(kNilai) : '-'}
                          </td>

                          <td style={{ padding: '12px 10px', fontSize: 11.5 }}>
                            <span style={{ fontWeight: 600, color: p.dataKontrak?.namaPenyedia && p.dataKontrak.namaPenyedia !== '-' ? '#1e293b' : '#94a3b8' }}>
                              {p.dataKontrak?.namaPenyedia || '-'}
                            </span>
                          </td>

                          <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                              <span style={{ fontWeight: 800, fontSize: 12.5, color: fRealisasi >= 100 ? '#059669' : fRealisasi > 0 ? '#0284c7' : '#64748b' }}>
                                {fRealisasi}%
                              </span>
                              <div style={{ width: 64, height: 6, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                                <div
                                  style={{
                                    width: `${Math.min(100, fRealisasi)}%`,
                                    height: '100%',
                                    background: fRealisasi >= 100 ? '#059669' : '#0284c7',
                                    borderRadius: 4
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                        </>
                      )}

                      {/* Kolom Monitoring Pencairan */}
                      {(viewMode === 'pencairan' || viewMode === 'semua') && (
                        <>
                          <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: sp2dVal > 0 ? '#7c3aed' : '#64748b' }}>
                              {formatRupiah(sp2dVal)}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                              {persenKeu}% dari Kontrak
                            </div>
                          </td>

                          {/* Tahapan Berkas Pencairan (70% & 100%) */}
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: isMasuk ? '#dcfce7' : '#f1f5f9',
                                  color: isMasuk ? '#166534' : '#64748b',
                                  border: `1px solid ${isMasuk ? '#86efac' : '#cbd5e1'}`
                                }}
                              >
                                {isMasuk ? '✓ Berkas Masuk' : 'Belum Masuk'}
                              </span>

                              {tahap.koreksi && (
                                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                                  Koreksi
                                </span>
                              )}

                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: isSPM ? '#e0e7ff' : '#f1f5f9',
                                  color: isSPM ? '#3730a3' : '#94a3b8',
                                  border: `1px solid ${isSPM ? '#c7d2fe' : '#e2e8f0'}`
                                }}
                              >
                                {isSPM ? '✓ SPM Terbit' : 'SPM'}
                              </span>

                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: isSelesai ? '#059669' : '#f1f5f9',
                                  color: isSelesai ? '#ffffff' : '#94a3b8',
                                  border: `1px solid ${isSelesai ? '#047857' : '#e2e8f0'}`
                                }}
                              >
                                {isSelesai ? '★ Selesai (Lunas)' : 'Tahap Selesai'}
                              </span>
                            </div>
                          </td>

                          <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#64748b', fontSize: 11.5 }}>
                            {formatRupiah(sisa)}
                          </td>
                        </>
                      )}

                      {/* Tombol Aksi */}
                      <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onViewProject && onViewProject(p)}
                            title="Lihat Rincian Lengkap Paket"
                            style={{ width: 28, height: 28, borderRadius: 6 }}
                          >
                            <Eye size={14} color="#0284c7" />
                          </button>

                          {canEditProject && canEditProject(p) && onQuickUpdate && (
                            <button
                              type="button"
                              className="btn-icon"
                              onClick={() => onQuickUpdate(p)}
                              title="Update Progres Fisik / SPJ"
                              style={{ width: 28, height: 28, borderRadius: 6 }}
                            >
                              <Edit3 size={14} color="#d97706" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPaketView;

