import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  Navigation,
  FileSpreadsheet
} from 'lucide-react';
import * as xlsx from 'xlsx';
import { BIDANG_LIST } from '../data/constants';

const BIDANG_COLOR_MAP = {
  bina_marga: { nama: 'Bina Marga', singkatan: 'BM', warna: '#0284c7', bg: '#e0f2fe', border: '#bae6fd' },
  cipta_karya: { nama: 'Cipta Karya', singkatan: 'CK', warna: '#d97706', bg: '#fef3c7', border: '#fde68a' },
  sda_bk: { nama: 'SDA & Bina Konstruksi', singkatan: 'SDA-BK', warna: '#059669', bg: '#d1fae5', border: '#a7f3d0' },
  tata_ruang: { nama: 'Tata Ruang', singkatan: 'TRP', warna: '#7c3aed', bg: '#ede9fe', border: '#ddd6fe' },
  sekretariat: { nama: 'Sekretariat', singkatan: 'Sekre', warna: '#475569', bg: '#f1f5f9', border: '#e2e8f0' }
};

const KATEGORI_CONFIG = [
  { id: 'ALL', label: 'Semua Kategori' },
  { id: 'fisik', label: '1. Pekerjaan Konstruksi (Fisik)', keyMatch: 'Konstruksi' },
  { id: 'jakon', label: '2. Jasa Konsultansi', keyMatch: 'Konsultansi' },
  { id: 'barang', label: '3. Pengadaan Barang', keyMatch: 'Barang' },
  { id: 'jasa_lainnya', label: '4. Jasa Lainnya', keyMatch: 'Lainnya' }
];

const PublicPaketListModal = ({
  isOpen,
  onClose,
  initialStatus = 'ALL', // 'ALL' | 'KONTRAK' | 'SELESAI' | 'PRAKONTRAK'
  paketList = [],
  activeYear = 2026
}) => {
  if (!isOpen) return null;

  // Filter States
  const [statusFilter, setStatusFilter] = useState(initialStatus || 'ALL');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedKategori, setSelectedKategori] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('fisik_desc'); // 'fisik_desc' | 'fisik_asc' | 'nama_asc' | 'nama_desc' | 'kontrak_first' | 'no_asc'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Compute Kecamatan List
  const kecamatanList = useMemo(() => {
    const setKec = new Set();
    paketList.forEach((p) => {
      if (p.kecamatan && p.kecamatan.trim() && p.kecamatan !== '-') {
        setKec.add(p.kecamatan.trim());
      }
    });
    return Array.from(setKec).sort();
  }, [paketList]);

  // Overall counts for tabs
  const tabCounts = useMemo(() => {
    const total = paketList.length;
    const kontrak = paketList.filter((p) => p.isKontrak).length;
    const selesai = paketList.filter((p) => (parseFloat(p.dataFisik?.progresRealisasi) || 0) >= 100).length;
    const prakontrak = paketList.filter((p) => !p.isKontrak).length;
    return { total, kontrak, selesai, prakontrak };
  }, [paketList]);

  // Filtered & Sorted List (Strictly without Pagu)
  const filteredList = useMemo(() => {
    let result = paketList.filter((p) => {
      // 1. Status Filter
      if (statusFilter === 'KONTRAK' && !p.isKontrak) return false;
      if (statusFilter === 'SELESAI') {
        const f = parseFloat(p.dataFisik?.progresRealisasi) || 0;
        if (f < 100) return false;
      }
      if (statusFilter === 'PRAKONTRAK' && p.isKontrak) return false;

      // 2. Bidang Filter
      if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;

      // 3. Kategori Pengadaan Filter
      if (selectedKategori !== 'ALL') {
        const cfg = KATEGORI_CONFIG.find((k) => k.id === selectedKategori);
        const matchCat =
          p.kategoriPaketId === selectedKategori ||
          (cfg && (
            (p.kategoriPaket || '').toLowerCase().includes(cfg.keyMatch.toLowerCase()) ||
            (p.kategoriPekerjaan || '').toLowerCase().includes(cfg.keyMatch.toLowerCase()) ||
            (p.jenisPengadaan || '').toLowerCase().includes(cfg.keyMatch.toLowerCase())
          ));
        if (!matchCat) return false;
      }

      // 4. Kecamatan Filter
      if (selectedKecamatan !== 'ALL' && (p.kecamatan || '').toLowerCase() !== selectedKecamatan.toLowerCase()) {
        return false;
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nama = (p.namaPaket || '').toLowerCase();
        const sub = (p.subKegiatan || p.subBagian || '').toLowerCase();
        const pelaksana = (p.dataKontrak?.namaPenyedia || '').toLowerCase();
        const noKontrak = (p.dataKontrak?.nomorKontrak || '').toLowerCase();
        const desa = (p.desa || '').toLowerCase();
        const kec = (p.kecamatan || '').toLowerCase();
        const lokasi = (p.lokasiLengkap || '').toLowerCase();

        if (
          !nama.includes(q) &&
          !sub.includes(q) &&
          !pelaksana.includes(q) &&
          !noKontrak.includes(q) &&
          !desa.includes(q) &&
          !kec.includes(q) &&
          !lokasi.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'fisik_desc') {
        const fa = parseFloat(a.dataFisik?.progresRealisasi) || 0;
        const fb = parseFloat(b.dataFisik?.progresRealisasi) || 0;
        return fb - fa;
      }
      if (sortBy === 'fisik_asc') {
        const fa = parseFloat(a.dataFisik?.progresRealisasi) || 0;
        const fb = parseFloat(b.dataFisik?.progresRealisasi) || 0;
        return fa - fb;
      }
      if (sortBy === 'nama_asc') {
        return (a.namaPaket || '').localeCompare(b.namaPaket || '');
      }
      if (sortBy === 'nama_desc') {
        return (b.namaPaket || '').localeCompare(a.namaPaket || '');
      }
      if (sortBy === 'kontrak_first') {
        if (a.isKontrak && !b.isKontrak) return -1;
        if (!a.isKontrak && b.isKontrak) return 1;
        return (parseFloat(b.dataFisik?.progresRealisasi) || 0) - (parseFloat(a.dataFisik?.progresRealisasi) || 0);
      }
      if (sortBy === 'no_asc') {
        return (a.noUrutKategori || 0) - (b.noUrutKategori || 0);
      }
      return 0;
    });

    return result;
  }, [paketList, statusFilter, selectedBidang, selectedKategori, selectedKecamatan, searchQuery, sortBy]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, selectedBidang, selectedKategori, selectedKecamatan, searchQuery, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Public Excel Export (Tanpa Pagu)
  const handleExportPublicExcel = () => {
    const rows = filteredList.map((p, idx) => ({
      'No.': idx + 1,
      'Nama Paket Pekerjaan': p.namaPaket || '-',
      'Kategori Pengadaan': p.kategoriPaket || p.jenisPengadaan || 'Pekerjaan Konstruksi',
      'Bidang Dinas': BIDANG_COLOR_MAP[p.bidangId]?.nama || p.bidangId,
      'Kecamatan': `Kec. ${p.kecamatan || 'Demak'}`,
      'Status Kontrak': p.isKontrak ? 'Sudah Kontrak' : 'Tahap Pra-Kontrak',
      'Penyedia / Pelaksana': p.isKontrak ? (p.dataKontrak?.namaPenyedia || '-') : 'Belum Kontrak',
      'Nomor Kontrak': p.isKontrak ? (p.dataKontrak?.nomorKontrak || '-') : '-',
      'Tanggal Kontrak': p.isKontrak ? (p.dataKontrak?.tanggalKontrak || '-') : '-',
      'Progres Fisik (%)': parseFloat(p.dataFisik?.progresRealisasi) || 0
    }));

    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Paket_Pekerjaan_Publik');
    xlsx.writeFile(wb, `Daftar_Paket_Pekerjaan_DINPUTARU_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #0f2c59 0%, #1e3a8a 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                Transparansi Publik
              </span>
              <span style={{ fontSize: '12px', color: '#cbd5e1' }}>TA {activeYear}</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '6px 0 2px', letterSpacing: '-0.01em' }}>
              Daftar Paket Pekerjaan DINPUTARU
            </h2>
            <p style={{ fontSize: '12.5px', color: '#93c5fd', margin: 0 }}>
              Monitoring progres fisik dan lokasi paket pekerjaan Dinas Pekerjaan Umum dan Penataan Ruang Kab. Demak
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleExportPublicExcel}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              title="Unduh data dalam format Excel (tanpa nominal)"
            >
              <FileSpreadsheet size={15} />
              <span>Ekspor Excel</span>
            </button>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              title="Tutup Jendela"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Status Bar */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto'
          }}
        >
          <button
            onClick={() => setStatusFilter('ALL')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'ALL' ? '2px solid #0284c7' : '1px solid #cbd5e1',
              backgroundColor: statusFilter === 'ALL' ? '#0284c7' : '#ffffff',
              color: statusFilter === 'ALL' ? '#ffffff' : '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            <span>Semua Paket</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: statusFilter === 'ALL' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: statusFilter === 'ALL' ? '#ffffff' : '#475569'
              }}
            >
              {tabCounts.total}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('KONTRAK')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'KONTRAK' ? '2px solid #0284c7' : '1px solid #cbd5e1',
              backgroundColor: statusFilter === 'KONTRAK' ? '#0284c7' : '#ffffff',
              color: statusFilter === 'KONTRAK' ? '#ffffff' : '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            <span>Paket Terkontrak</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: statusFilter === 'KONTRAK' ? 'rgba(255,255,255,0.25)' : '#e0f2fe',
                color: statusFilter === 'KONTRAK' ? '#ffffff' : '#0369a1'
              }}
            >
              {tabCounts.kontrak}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('SELESAI')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'SELESAI' ? '2px solid #059669' : '1px solid #cbd5e1',
              backgroundColor: statusFilter === 'SELESAI' ? '#059669' : '#ffffff',
              color: statusFilter === 'SELESAI' ? '#ffffff' : '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            <CheckCircle2 size={15} />
            <span>Selesai 100% (PHO)</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: statusFilter === 'SELESAI' ? 'rgba(255,255,255,0.25)' : '#d1fae5',
                color: statusFilter === 'SELESAI' ? '#ffffff' : '#047857'
              }}
            >
              {tabCounts.selesai}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('PRAKONTRAK')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'PRAKONTRAK' ? '2px solid #64748b' : '1px solid #cbd5e1',
              backgroundColor: statusFilter === 'PRAKONTRAK' ? '#64748b' : '#ffffff',
              color: statusFilter === 'PRAKONTRAK' ? '#ffffff' : '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            <Clock size={15} />
            <span>Tahap Pra-Kontrak</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: statusFilter === 'PRAKONTRAK' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: statusFilter === 'PRAKONTRAK' ? '#ffffff' : '#475569'
              }}
            >
              {tabCounts.prakontrak}
            </span>
          </button>
        </div>

        {/* Filter & Controls Panel */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Cari nama paket, lokasi desa/kecamatan, pelaksana..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                color: '#1e293b'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Bidang */}
          <div>
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '12.5px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontWeight: 600
              }}
            >
              <option value="ALL">Semua Bidang Dinas</option>
              {BIDANG_LIST.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id === 'sda_bk' ? 'SDA & Bina Konstruksi' : b.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Kategori Pengadaan */}
          <div>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '12.5px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontWeight: 600
              }}
            >
              {KATEGORI_CONFIG.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Kecamatan */}
          <div>
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '12.5px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontWeight: 600
              }}
            >
              <option value="ALL">Semua Kecamatan</option>
              {kecamatanList.map((kec) => (
                <option key={kec} value={kec}>
                  Kec. {kec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '12.5px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#0f2c59',
                fontWeight: 700
              }}
            >
              <option value="fisik_desc">Progres Fisik (Tertinggi)</option>
              <option value="fisik_asc">Progres Fisik (Terendah)</option>
              <option value="nama_asc">Nama Paket (A - Z)</option>
              <option value="nama_desc">Nama Paket (Z - A)</option>
              <option value="kontrak_first">Status: Terkontrak Dahulu</option>
              <option value="no_asc">Nomor Urut Paket</option>
            </select>
          </div>
        </div>

        {/* Counter Info Bar */}
        <div
          style={{
            padding: '8px 24px',
            backgroundColor: '#f1f5f9',
            fontSize: '12px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <div>
            Menampilkan <strong>{filteredList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> -{' '}
            <strong>{Math.min(currentPage * pageSize, filteredList.length)}</strong> dari{' '}
            <strong>{filteredList.length}</strong> Paket Pekerjaan
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            * Informasi pagu anggaran tidak dipublikasikan pada halaman transparansi publik
          </div>
        </div>

        {/* Table / List Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {filteredList.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#94a3b8'
                }}
              >
                <Search size={26} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>
                Tidak ada paket yang sesuai dengan filter
              </h4>
              <p style={{ fontSize: '13px', margin: 0, color: '#94a3b8' }}>
                Coba sesuaikan kata kunci pencarian, kategori bidang, atau status kontrak.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paginatedList.map((p, idx) => {
                const bInfo = BIDANG_COLOR_MAP[p.bidangId] || {
                  nama: p.bidangId,
                  singkatan: p.bidangId,
                  warna: '#475569',
                  bg: '#f1f5f9',
                  border: '#cbd5e1'
                };
                const progres = parseFloat(p.dataFisik?.progresRealisasi) || 0;
                const nomorUrut = (currentPage - 1) * pageSize + idx + 1;

                return (
                  <div
                    key={p.id || idx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      display: 'grid',
                      gridTemplateColumns: '44px 2.2fr 1.1fr 1.2fr 1.2fr',
                      gap: '16px',
                      alignItems: 'center',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0284c7';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
                    }}
                  >
                    {/* 1. No */}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#64748b',
                        textAlign: 'center'
                      }}
                    >
                      {nomorUrut}
                    </div>

                    {/* 2. Nama Paket & Kategori */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          {p.kategoriPaket || p.jenisPengadaan || 'Konstruksi'}
                        </span>
                        {p.metodePemilihan && (
                          <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>• {p.metodePemilihan}</span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 700,
                          color: '#0f2c59',
                          lineHeight: 1.35
                        }}
                      >
                        {p.namaPaket}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px' }}>
                        {p.subKegiatan || p.subBagian || '-'}
                      </div>
                    </div>

                    {/* 3. Bidang Dinas */}
                    <div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px',
                          backgroundColor: bInfo.bg,
                          color: bInfo.warna,
                          border: `1px solid ${bInfo.border}`,
                          display: 'inline-block'
                        }}
                      >
                        {bInfo.nama}
                      </span>
                    </div>

                    {/* 4. Lokasi Paket (Hanya Kecamatan) */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#1e293b'
                        }}
                      >
                        <MapPin size={14} color="#0284c7" style={{ flexShrink: 0 }} />
                        <span>Kec. {p.kecamatan || 'Demak'}</span>
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#64748b',
                          marginTop: '2px',
                          paddingLeft: '20px'
                        }}
                      >
                        Kabupaten Demak
                      </div>
                    </div>

                    {/* 5. Status & Progres Fisik */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: p.isKontrak ? '#dcfce7' : '#fef3c7',
                            color: p.isKontrak ? '#15803d' : '#b45309'
                          }}
                        >
                          {p.isKontrak ? 'Terkontrak' : 'Pra-Kontrak'}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: progres >= 100 ? '#15803d' : '#0284c7' }}>
                          {progres}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div
                        style={{
                          height: '6px',
                          width: '100%',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '9999px',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(100, Math.max(0, progres))}%`,
                            backgroundColor: progres >= 100 ? '#10b981' : (p.isKontrak ? '#0284c7' : '#94a3b8'),
                            borderRadius: '9999px',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>

                      {p.isKontrak && p.dataKontrak?.namaPenyedia && p.dataKontrak.namaPenyedia !== '-' && (
                        <div
                          style={{
                            fontSize: '10.5px',
                            color: '#475569',
                            marginTop: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={`Pelaksana: ${p.dataKontrak.namaPenyedia}`}
                        >
                          {p.dataKontrak.namaPenyedia}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#94a3b8' : '#334155',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={14} />
                <span>Sebelumnya</span>
              </button>

              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: isActive ? '1px solid #0284c7' : '1px solid #e2e8f0',
                        backgroundColor: isActive ? '#0284c7' : '#ffffff',
                        color: isActive ? '#ffffff' : '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages ? '#94a3b8' : '#334155',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                <span>Selanjutnya</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPaketListModal;

