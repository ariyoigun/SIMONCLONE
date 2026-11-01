import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  TrendingUp,
  Target,
  Calendar,
  Filter,
  Plus,
  Search,
  Download,
  Printer,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Sliders,
  RotateCcw,
  Receipt,
  Eye,
  X,
  CreditCard,
  Layers,
  ArrowUpRight,
  Sparkles,
  Info
} from 'lucide-react';
import { NAMA_BULAN } from '../data/pendapatanData';

const emptyTransactionForm = {
  kategori: 'sewa_alat_berat',
  namaPenyewa: '',
  tanggal: new Date().toISOString().split('T')[0],
  nominal: '',
  noBukti: '',
  metodePembayaran: 'Transfer Kasda (Bank Jateng)',
  keterangan: '',
  status: 'Terverifikasi Kasda'
};

const PendapatanView = () => {
  const {
    pendapatanTransactions = [],
    pendapatanTargetConfig,
    kategoriPendapatanList = [],
    addPendapatanTransaction,
    updatePendapatanTransaction,
    deletePendapatanTransaction,
    updatePendapatanTarget,
    resetPendapatanToDemo,
    canInputPendapatan,
    currentUser,
    activeYear = 2026,
    formatCurrency,
    systemSettings
  } = useApp();

  // Filter States
  const [selectedKategori, setSelectedKategori] = useState('all');
  const [selectedBulan, setSelectedBulan] = useState('all'); // 'all' or 1..12
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChartTab, setActiveChartTab] = useState('monthly'); // 'monthly' | 'cumulative' | 'category'

  // Modal States
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTrxId, setEditingTrxId] = useState(null);
  const [formData, setFormData] = useState(emptyTransactionForm);

  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetForm, setTargetForm] = useState({
    targetTahunanTotal: pendapatanTargetConfig?.targetTahunanTotal || 6000000000,
    targetPerKategori: { ...(pendapatanTargetConfig?.targetPerKategori || {}) }
  });

  const [detailModalTrx, setDetailModalTrx] = useState(null);

  // Transactions strictly for active year
  const activeYearTransactions = useMemo(() => {
    return pendapatanTransactions.filter(
      (t) => (t.tahun || parseInt(t.tanggal?.split('-')[0], 10)) === activeYear
    );
  }, [pendapatanTransactions, activeYear]);

  // Filtered transactions for display
  const filteredTransactions = useMemo(() => {
    return activeYearTransactions.filter((t) => {
      // Category filter
      if (selectedKategori !== 'all' && t.kategori !== selectedKategori) return false;
      // Month filter
      if (selectedBulan !== 'all') {
        const bln = t.bulan || parseInt(t.tanggal?.split('-')[1], 10);
        if (bln !== parseInt(selectedBulan, 10)) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nama = (t.namaPenyewa || '').toLowerCase();
        const bukti = (t.noBukti || '').toLowerCase();
        const ket = (t.keterangan || '').toLowerCase();
        if (!nama.includes(q) && !bukti.includes(q) && !ket.includes(q)) return false;
      }
      return true;
    });
  }, [activeYearTransactions, selectedKategori, selectedBulan, searchQuery]);

  // Aggregated Statistics
  const targetTahunanTotal = pendapatanTargetConfig?.targetTahunanTotal || 6000000000;
  const totalRealisasi = useMemo(() => {
    return activeYearTransactions.reduce((sum, item) => sum + (parseFloat(item.nominal) || 0), 0);
  }, [activeYearTransactions]);

  const persenCapaian = targetTahunanTotal > 0
    ? parseFloat(((totalRealisasi / targetTahunanTotal) * 100).toFixed(2))
    : 0;

  const sisaTarget = Math.max(0, targetTahunanTotal - totalRealisasi);

  // Monthly breakdown (Jan - Nov / Dec)
  const monthlyData = useMemo(() => {
    // 12 months array
    const monthlyTargetAverage = Math.round(targetTahunanTotal / 12);
    return Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const monthTransactions = activeYearTransactions.filter((t) => {
        const bln = t.bulan || parseInt(t.tanggal?.split('-')[1], 10);
        return bln === monthNum;
      });
      const realisasiBulan = monthTransactions.reduce(
        (sum, t) => sum + (parseFloat(t.nominal) || 0),
        0
      );
      return {
        bulan: monthNum,
        namaBulan: NAMA_BULAN[i],
        target: monthlyTargetAverage,
        realisasi: realisasiBulan,
        persen: monthlyTargetAverage > 0 ? parseFloat(((realisasiBulan / monthlyTargetAverage) * 100).toFixed(1)) : 0,
        jumlahTrx: monthTransactions.length
      };
    });
  }, [activeYearTransactions, targetTahunanTotal]);

  // Calculate Average monthly realization (calculated on passed months up to Nov = 11)
  const rataRataBulanan = useMemo(() => {
    const passedMonths = monthlyData.slice(0, 11).filter((m) => m.realisasi > 0).length || 1;
    return Math.round(totalRealisasi / passedMonths);
  }, [monthlyData, totalRealisasi]);

  // Category breakdown
  const categoryStats = useMemo(() => {
    return kategoriPendapatanList.map((kat) => {
      const katTarget = pendapatanTargetConfig?.targetPerKategori?.[kat.id] || kat.targetDefault || 0;
      const katTrx = activeYearTransactions.filter((t) => t.kategori === kat.id);
      const katRealisasi = katTrx.reduce((sum, t) => sum + (parseFloat(t.nominal) || 0), 0);
      const katPersen = katTarget > 0 ? parseFloat(((katRealisasi / katTarget) * 100).toFixed(2)) : 0;
      return {
        ...kat,
        target: katTarget,
        realisasi: katRealisasi,
        persen: katPersen,
        count: katTrx.length
      };
    });
  }, [kategoriPendapatanList, pendapatanTargetConfig, activeYearTransactions]);

  // Handle Form Open for Add
  const handleOpenAdd = () => {
    if (!canInputPendapatan) {
      alert('Akses Ditolak: Hanya pengguna dengan izin Monitoring Pendapatan atau Koordinator Pendapatan yang dapat menginput.');
      return;
    }
    const nextSeq = activeYearTransactions.length + 1;
    const padSeq = String(nextSeq).padStart(3, '0');
    const now = new Date();
    const padBln = String(now.getMonth() + 1).padStart(2, '0');

    setFormData({
      ...emptyTransactionForm,
      noBukti: `STS/DPU/${activeYear}/${padBln}/${padSeq}`
    });
    setIsEditMode(false);
    setEditingTrxId(null);
    setIsInputModalOpen(true);
  };

  // Handle Form Open for Edit
  const handleOpenEdit = (trx) => {
    if (!canInputPendapatan) {
      alert('Akses Ditolak: Anda tidak memiliki wewenang untuk mengubah transaksi pendapatan.');
      return;
    }
    setFormData({
      kategori: trx.kategori,
      namaPenyewa: trx.namaPenyewa,
      tanggal: trx.tanggal,
      nominal: trx.nominal,
      noBukti: trx.noBukti,
      metodePembayaran: trx.metodePembayaran,
      keterangan: trx.keterangan || '',
      status: trx.status || 'Terverifikasi Kasda'
    });
    setIsEditMode(true);
    setEditingTrxId(trx.id);
    setIsInputModalOpen(true);
  };

  // Handle Submit Transaction
  const handleSubmitTransaction = (e) => {
    e.preventDefault();
    if (!formData.namaPenyewa.trim()) {
      alert('Nama Penyewa / Pemohon wajib diisi!');
      return;
    }
    const num = parseFloat(formData.nominal);
    if (isNaN(num) || num <= 0) {
      alert('Nominal penerimaan harus berupa angka lebih dari 0!');
      return;
    }

    if (isEditMode && editingTrxId) {
      updatePendapatanTransaction(editingTrxId, formData);
    } else {
      addPendapatanTransaction(formData);
    }
    setIsInputModalOpen(false);
  };

  // Handle Save Target
  const handleSaveTarget = (e) => {
    e.preventDefault();
    const total = parseFloat(targetForm.targetTahunanTotal) || 0;
    if (total <= 0) {
      alert('Target tahunan total harus lebih dari 0!');
      return;
    }
    updatePendapatanTarget(targetForm);
    setIsTargetModalOpen(false);
  };

  // Quick export to CSV
  const handleExportCSV = () => {
    const headers = ['No', 'ID Transaksi', 'No Bukti', 'Tanggal', 'Kategori', 'Nama Penyewa / Pembayar', 'Nominal (Rp)', 'Metode Pembayaran', 'Keterangan', 'Status'];
    const rows = filteredTransactions.map((t, idx) => {
      const kat = kategoriPendapatanList.find((k) => k.id === t.kategori)?.nama || t.kategori;
      return [
        idx + 1,
        `"${t.id}"`,
        `"${t.noBukti || '-'}"`,
        `"${t.tanggal}"`,
        `"${kat}"`,
        `"${(t.namaPenyewa || '').replace(/"/g, '""')}"`,
        t.nominal,
        `"${t.metodePembayaran || '-'}"`,
        `"${(t.keterangan || '').replace(/"/g, '""')}"`,
        `"${t.status || 'Terverifikasi'}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Pendapatan_DINPUTARU_${activeYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Window
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="view-container">
      {/* HEADER SECTION */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(13, 148, 136, 0.12)',
                color: '#0d9488',
                padding: '3px 10px',
                borderRadius: 9999,
                fontSize: 11.5,
                fontWeight: 800,
                letterSpacing: 0.5
              }}
            >
              <Coins size={14} />
              FITUR MENU KE-6 DINPUTARU
            </span>
            <span
              style={{
                background: '#0f2c59',
                color: '#fff',
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 6,
                fontWeight: 700
              }}
            >
              TA {activeYear}
            </span>
            {canInputPendapatan ? (
              <span
                style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <CheckCircle2 size={12} />
                Mode Input & Editor Aktif
              </span>
            ) : (
              <span
                style={{
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontWeight: 600
                }}
              >
                Mode Pemantauan (Read-Only)
              </span>
            )}
          </div>
          <h2>Monitoring Pendapatan Asli Daerah (PAD) & Retribusi</h2>
          <p>
            Pengendalian target tahun berjalan (Rp {targetTahunanTotal.toLocaleString('id-ID')}) vs realisasi penerimaan retribusi 5 kategori: Setor Tinja, PBG, SLF, Sewa Alat Berat, dan Sewa Cor Drill.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="header-actions">
          {canInputPendapatan && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              Tambah Penerimaan
            </button>
          )}

          {canInputPendapatan && (
            <button
              className="btn btn-outline"
              onClick={() => {
                setTargetForm({
                  targetTahunanTotal,
                  targetPerKategori: { ...(pendapatanTargetConfig?.targetPerKategori || {}) }
                });
                setIsTargetModalOpen(true);
              }}
              title="Atur target tahun berjalan dan target per kategori"
            >
              <Target size={15} color="#0d9488" />
              Atur Target (6 Miliar)
            </button>
          )}

          <button className="btn btn-outline" onClick={handleExportCSV} title="Ekspor data transaksi ke spreadsheet CSV">
            <Download size={15} />
            Ekspor CSV
          </button>

          <button className="btn btn-outline" onClick={handlePrint} title="Cetak Rekapitulasi PAD">
            <Printer size={15} />
            Cetak
          </button>
        </div>
      </div>

      {/* 6 MAIN KPI CARDS (DENGAN NOMINAL SAMPAI DIGIT SATUAN & FONT SIZE PRESISI) */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {/* Card 1: Target Tahunan Total */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Target Penerimaan TA {activeYear}</span>
            <div className="kpi-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Target size={20} />
            </div>
          </div>
          <div
            className="kpi-value"
            style={{ fontSize: 'clamp(18px, 1.4vw, 21px)', color: '#0284c7', whiteSpace: 'nowrap' }}
          >
            Rp {targetTahunanTotal.toLocaleString('id-ID')}
          </div>
          <div className="kpi-subtext">
            <span>Dinas PUTARU Demak</span>
          </div>
          <div className="kpi-progress-bar">
            <div className="kpi-progress-bar-fill" style={{ width: '100%', background: '#0284c7' }} />
          </div>
        </div>

        {/* Card 2: Total Realisasi Penerimaan (Jan - Nov) */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #0d9488' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Realisasi Penerimaan</span>
            <div className="kpi-icon-wrap" style={{ background: '#ccfbf1', color: '#0d9488' }}>
              <Coins size={20} />
            </div>
          </div>
          <div
            className="kpi-value"
            style={{ fontSize: 'clamp(18px, 1.4vw, 21px)', color: '#0d9488', whiteSpace: 'nowrap' }}
          >
            Rp {totalRealisasi.toLocaleString('id-ID')}
          </div>
          <div className="kpi-subtext">
            <span style={{ color: '#0d9488', fontWeight: 700 }}>
              {persenCapaian}% dari Target 6 Miliar
            </span>
          </div>
          <div className="kpi-progress-bar">
            <div
              className="kpi-progress-bar-fill"
              style={{
                width: `${Math.min(100, persenCapaian)}%`,
                background: '#0d9488'
              }}
            />
          </div>
        </div>

        {/* Card 3: Persentase Capaian & Status */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Persentase Capaian</span>
            <div className="kpi-icon-wrap" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div
            className="kpi-value"
            style={{ fontSize: 'clamp(20px, 1.6vw, 24px)', color: '#16a34a' }}
          >
            {persenCapaian}%
          </div>
          <div className="kpi-subtext">
            <span
              style={{
                background: persenCapaian >= 80 ? '#dcfce7' : '#fef3c7',
                color: persenCapaian >= 80 ? '#15803d' : '#b45309',
                padding: '2px 8px',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 11
              }}
            >
              {persenCapaian >= 80 ? '✓ Sangat Baik / On Track' : '⚡ Perlu Akselerasi'}
            </span>
          </div>
          <div className="kpi-progress-bar">
            <div
              className="kpi-progress-bar-fill"
              style={{
                width: `${Math.min(100, persenCapaian)}%`,
                background: '#16a34a'
              }}
            />
          </div>
        </div>

        {/* Card 4: Sisa Target yang Harus Dipenuhi */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Sisa Target Belum Tercapai</span>
            <div className="kpi-icon-wrap" style={{ background: '#ffedd5', color: '#ea580c' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div
            className="kpi-value"
            style={{ fontSize: 'clamp(18px, 1.4vw, 21px)', color: '#ea580c', whiteSpace: 'nowrap' }}
          >
            Rp {sisaTarget.toLocaleString('id-ID')}
          </div>
          <div className="kpi-subtext">
            <span>Sisa waktu per November: 1 Bulan</span>
          </div>
          <div className="kpi-progress-bar">
            <div
              className="kpi-progress-bar-fill"
              style={{
                width: `${Math.max(0, 100 - persenCapaian)}%`,
                background: '#ea580c'
              }}
            />
          </div>
        </div>

        {/* Card 5: Rata-Rata Bulanan */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Rata-Rata Penerimaan / Bulan</span>
            <div className="kpi-icon-wrap" style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div
            className="kpi-value"
            style={{ fontSize: 'clamp(18px, 1.4vw, 21px)', color: '#7c3aed', whiteSpace: 'nowrap' }}
          >
            Rp {rataRataBulanan.toLocaleString('id-ID')}
          </div>
          <div className="kpi-subtext">
            <span>Rata-rata dari Jan s/d Nov {activeYear}</span>
          </div>
          <div className="kpi-progress-bar">
            <div className="kpi-progress-bar-fill" style={{ width: '85%', background: '#7c3aed' }} />
          </div>
        </div>

        {/* Card 6: Total Transaksi Terverifikasi */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #0f766e' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Transaksi Terverifikasi</span>
            <div className="kpi-icon-wrap" style={{ background: '#ccfbf1', color: '#0f766e' }}>
              <Receipt size={20} />
            </div>
          </div>
          <div
            className="kpi-value"
            style={{ fontSize: 'clamp(20px, 1.6vw, 24px)', color: '#0f766e' }}
          >
            {activeYearTransactions.length} Transaksi
          </div>
          <div className="kpi-subtext">
            <span>Status: 100% Lunas Kasda</span>
          </div>
          <div className="kpi-progress-bar">
            <div className="kpi-progress-bar-fill" style={{ width: '100%', background: '#0f766e' }} />
          </div>
        </div>
      </div>

      {/* TAMPILAN GRAFIK TARGET VS REALISASI & DIAGRAM KOMPOSISI */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1.5px solid #e2e8f0',
          padding: '22px 24px',
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        {/* Chart Header & Tab Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TrendingUp size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f2c59' }}>
                Visualisasi Grafik & Diagram: Target vs Realisasi Retribusi PAD
              </h3>
            </div>
            <p style={{ margin: '4px 0 0 40px', fontSize: 12.5, color: '#64748b' }}>
              Komparasi capaian target bulanan dan akumulatif per kategori retribusi DINPUTARU Kabupaten Demak
            </p>
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', padding: 4, borderRadius: 10, gap: 4 }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setActiveChartTab('monthly')}
              style={{
                background: activeChartTab === 'monthly' ? '#ffffff' : 'transparent',
                color: activeChartTab === 'monthly' ? '#0f2c59' : '#64748b',
                fontWeight: activeChartTab === 'monthly' ? 800 : 600,
                boxShadow: activeChartTab === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                borderRadius: 7,
                fontSize: 12,
                padding: '6px 12px'
              }}
            >
              📊 Bulanan (Jan - Nov)
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setActiveChartTab('cumulative')}
              style={{
                background: activeChartTab === 'cumulative' ? '#ffffff' : 'transparent',
                color: activeChartTab === 'cumulative' ? '#0f2c59' : '#64748b',
                fontWeight: activeChartTab === 'cumulative' ? 800 : 600,
                boxShadow: activeChartTab === 'cumulative' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                borderRadius: 7,
                fontSize: 12,
                padding: '6px 12px'
              }}
            >
              📈 Kurva Akumulasi
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setActiveChartTab('category')}
              style={{
                background: activeChartTab === 'category' ? '#ffffff' : 'transparent',
                color: activeChartTab === 'category' ? '#0f2c59' : '#64748b',
                fontWeight: activeChartTab === 'category' ? 800 : 600,
                boxShadow: activeChartTab === 'category' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                borderRadius: 7,
                fontSize: 12,
                padding: '6px 12px'
              }}
            >
              🥧 Komposisi 5 Kategori
            </button>
          </div>
        </div>

        {/* TAB 1: GRAFIK BULANAN (TARGET VS REALISASI JAN - NOV) */}
        {activeChartTab === 'monthly' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 18, fontSize: 12, fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: '#cbd5e1' }} />
                  <span style={{ color: '#475569' }}>Target Bulanan: Rp {(targetTahunanTotal / 12).toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: '#0d9488' }} />
                  <span style={{ color: '#0d9488' }}>Realisasi Penerimaan Aktual (Jan - Nov)</span>
                </div>
              </div>
              <span style={{ fontSize: 11.5, color: '#64748b' }}>
                Arahkan kursor pada batang grafik untuk melihat rincian digit rupiah satuan
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div style={{ overflowX: 'auto', paddingBottom: 10 }}>
              <div style={{ minWidth: 680, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12, alignItems: 'flex-end', height: 260, padding: '20px 10px 10px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                {monthlyData.map((m) => {
                  const maxRef = Math.max(700000000, ...monthlyData.map((d) => d.realisasi));
                  const heightTarget = (m.target / maxRef) * 190;
                  const heightRealisasi = (m.realisasi / maxRef) * 190;
                  const isNovember = m.bulan === 11;
                  const isFuture = m.bulan === 12;

                  return (
                    <div
                      key={m.bulan}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                        position: 'relative'
                      }}
                      title={`${m.namaBulan} ${activeYear}:\nTarget: Rp ${m.target.toLocaleString('id-ID')}\nRealisasi: Rp ${m.realisasi.toLocaleString('id-ID')}\nCapaian: ${m.persen}%\nJumlah Transaksi: ${m.jumlahTrx}`}
                    >
                      {/* Percent Badge on top of bar */}
                      {m.realisasi > 0 && (
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: m.persen >= 100 ? '#15803d' : '#0d9488',
                            background: m.persen >= 100 ? '#dcfce7' : '#ccfbf1',
                            padding: '1px 5px',
                            borderRadius: 4,
                            marginBottom: 4,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {m.persen}%
                        </div>
                      )}

                      {/* Twin Bars (Target vs Realisasi) */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, width: '100%', justifyContent: 'center' }}>
                        {/* Target Bar */}
                        <div
                          style={{
                            width: 14,
                            height: Math.max(4, heightTarget),
                            background: '#cbd5e1',
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s ease'
                          }}
                        />
                        {/* Realisasi Bar */}
                        <div
                          style={{
                            width: 20,
                            height: Math.max(2, heightRealisasi),
                            background: isFuture
                              ? '#e2e8f0'
                              : isNovember
                              ? 'linear-gradient(180deg, #14b8a6 0%, #0d9488 100%)'
                              : m.persen >= 100
                              ? 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)'
                              : 'linear-gradient(180deg, #0d9488 0%, #0f766e 100%)',
                            borderRadius: '4px 4px 0 0',
                            boxShadow: m.realisasi > 0 ? '0 2px 6px rgba(13,148,136,0.2)' : 'none',
                            transition: 'height 0.3s ease'
                          }}
                        />
                      </div>

                      {/* Month Label */}
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 11,
                          fontWeight: isNovember ? 800 : 600,
                          color: isNovember ? '#0d9488' : isFuture ? '#94a3b8' : '#334155',
                          textAlign: 'center'
                        }}
                      >
                        {m.namaBulan.slice(0, 3)}
                      </div>

                      {/* Nominal Display down to satuan (compact font) */}
                      <div
                        style={{
                          fontSize: 9.5,
                          color: isFuture ? '#cbd5e1' : '#64748b',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          marginTop: 2
                        }}
                      >
                        {m.realisasi > 0 ? `Rp ${(m.realisasi / 1000000).toFixed(1)}Jt` : '-'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '12px 16px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <span style={{ fontSize: 12.5, color: '#166534', fontWeight: 600 }}>
                  Realisasi s/d November 2026 telah mencapai <strong>Rp {totalRealisasi.toLocaleString('id-ID')}</strong> ({persenCapaian}% dari target 6 Miliar). Rata-rata penerimaan per bulan <strong>Rp {rataRataBulanan.toLocaleString('id-ID')}</strong>.
                </span>
              </div>
              <span style={{ fontSize: 11, background: '#16a34a', color: '#fff', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                Data Terverifikasi Jan - Nov {activeYear}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: KURVA AKUMULASI (TARGET KUMULATIF VS REALISASI KUMULATIF) */}
        {activeChartTab === 'cumulative' && (
          <div>
            <div style={{ marginBottom: 14, fontSize: 12.5, color: '#475569' }}>
              Kurva perbandingan pertumbuhan akumulatif target tahunan vs realisasi kas daerah dari bulan Januari hingga November:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {monthlyData.slice(0, 11).map((m, idx) => {
                const targetKumulatif = Math.round(((idx + 1) * targetTahunanTotal) / 12);
                const realisasiKumulatif = monthlyData
                  .slice(0, idx + 1)
                  .reduce((sum, item) => sum + item.realisasi, 0);
                const persenKumulatif = targetKumulatif > 0
                  ? parseFloat(((realisasiKumulatif / targetKumulatif) * 100).toFixed(1))
                  : 0;

                return (
                  <div
                    key={m.bulan}
                    style={{
                      background: '#f8fafc',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      padding: '12px 14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: 13, color: '#0f2c59' }}>
                        s/d Bulan {m.namaBulan}
                      </strong>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: 9999,
                          background: persenKumulatif >= 100 ? '#dcfce7' : '#e0f2fe',
                          color: persenKumulatif >= 100 ? '#15803d' : '#0369a1'
                        }}
                      >
                        {persenKumulatif}% Capaian
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: '#64748b', display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span>Realisasi Akumulatif:</span>
                      <strong style={{ color: '#0d9488' }}>Rp {realisasiKumulatif.toLocaleString('id-ID')}</strong>
                    </div>

                    <div style={{ fontSize: 11.5, color: '#94a3b8', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span>Target Akumulatif:</span>
                      <span>Rp {targetKumulatif.toLocaleString('id-ID')}</span>
                    </div>

                    <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, persenKumulatif)}%`,
                          height: '100%',
                          background: persenKumulatif >= 100 ? '#16a34a' : '#0d9488',
                          borderRadius: 9999
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DIAGRAM KOMPOSISI 5 KATEGORI RETRIBUSI */}
        {activeChartTab === 'category' && (
          <div>
            <div style={{ marginBottom: 16, fontSize: 13, color: '#475569' }}>
              Rincian komparasi Target vs Realisasi untuk 5 Kategori Sumber Pendapatan DINPUTARU Kabupaten Demak:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 14 }}>
              {categoryStats.map((cat) => {
                const sisaKat = Math.max(0, cat.target - cat.realisasi);
                return (
                  <div
                    key={cat.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: 12,
                      border: `1.5px solid ${cat.warna}40`,
                      padding: '16px 18px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: cat.warna
                            }}
                          />
                          <strong style={{ fontSize: 14, color: '#0f2c59' }}>{cat.nama}</strong>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{cat.labelLengkap}</div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 9999,
                          background: cat.bgLight,
                          color: cat.warna
                        }}
                      >
                        {cat.persen}%
                      </span>
                    </div>

                    {/* Nominal Realisasi down to satuan */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Realisasi Penerimaan:</div>
                      <div
                        style={{
                          fontSize: 'clamp(16px, 1.3vw, 19px)',
                          fontWeight: 800,
                          color: cat.warna,
                          letterSpacing: -0.3
                        }}
                      >
                        Rp {cat.realisasi.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div style={{ fontSize: 11.5, color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>Target Anggaran:</span>
                      <strong>Rp {cat.target.toLocaleString('id-ID')}</strong>
                    </div>

                    <div style={{ fontSize: 11, color: '#64748b', display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Sisa yang harus dicapai:</span>
                      <span>Rp {sisaKat.toLocaleString('id-ID')}</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: 7, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, cat.persen)}%`,
                          height: '100%',
                          background: cat.warna,
                          borderRadius: 9999
                        }}
                      />
                    </div>

                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#94a3b8' }}>
                      <span>{cat.count} Transaksi</span>
                      <span>{cat.satuanTarif}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FILTER & PENCARIAN TRANSAKSI */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1.5px solid #e2e8f0',
          padding: '16px 20px',
          marginBottom: 20,
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={18} color="#0d9488" />
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f2c59' }}>
              Filter & Pencarian Rincian Penerimaan Kas Retribusi
            </h4>
          </div>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            Menampilkan <strong>{filteredTransactions.length}</strong> dari {activeYearTransactions.length} transaksi TA {activeYear}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama penyewa, nomor bukti, keterangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 34, fontSize: 12.5 }}
            />
          </div>

          {/* Filter Kategori */}
          <div>
            <select
              className="form-control"
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              style={{ fontSize: 12.5 }}
            >
              <option value="all">Semua Kategori Retribusi (5 Kategori)</option>
              {kategoriPendapatanList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} ({k.labelLengkap})
                </option>
              ))}
            </select>
          </div>

          {/* Filter Bulan */}
          <div>
            <select
              className="form-control"
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
              style={{ fontSize: 12.5 }}
            >
              <option value="all">Semua Bulan (Januari - November)</option>
              {NAMA_BULAN.map((bln, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  Bulan {idx + 1}: {bln}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filter Button */}
          {(selectedKategori !== 'all' || selectedBulan !== 'all' || searchQuery.trim() !== '') && (
            <div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%', fontSize: 12 }}
                onClick={() => {
                  setSelectedKategori('all');
                  setSelectedBulan('all');
                  setSearchQuery('');
                }}
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABEL DATA TRANSAKSI PENERIMAAN RETRIBUSI */}
      <div className="table-container" style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 45, textAlign: 'center' }}>No</th>
              <th>No. Bukti / SKRD</th>
              <th>Tanggal</th>
              <th>Kategori Retribusi</th>
              <th>Nama Penyewa / Pemohon</th>
              <th style={{ textAlign: 'right' }}>Nominal Penerimaan (Rp)</th>
              <th>Metode Pembayaran</th>
              <th>Keterangan / Rincian Layanan</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '36px 20px', color: '#94a3b8' }}>
                  Tidak ada data transaksi pendapatan yang cocok dengan kriteria filter.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((trx, idx) => {
                const katInfo = kategoriPendapatanList.find((k) => k.id === trx.kategori) || {};
                const nominalNum = parseFloat(trx.nominal) || 0;

                return (
                  <tr key={trx.id}>
                    <td style={{ textAlign: 'center', color: '#64748b', fontSize: 12 }}>{idx + 1}</td>
                    <td>
                      <code style={{ fontSize: 11.5, fontWeight: 700, color: '#0284c7' }}>
                        {trx.noBukti || trx.id}
                      </code>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: '#334155' }}>
                      {trx.tanggal}
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          background: katInfo.bgLight || '#f1f5f9',
                          color: katInfo.warna || '#334155',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {katInfo.nama || trx.kategori}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: 12.5, color: '#0f2c59', display: 'block' }}>
                        {trx.namaPenyewa}
                      </strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 13,
                          fontWeight: 800,
                          color: '#0d9488',
                          letterSpacing: -0.3
                        }}
                      >
                        Rp {nominalNum.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11.5, color: '#475569' }}>
                        {trx.metodePembayaran || 'Transfer Kasda'}
                      </span>
                    </td>
                    <td style={{ maxWidth: 260 }}>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: '#64748b',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={trx.keterangan}
                      >
                        {trx.keterangan || '-'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => setDetailModalTrx(trx)}
                          title="Lihat Kwitansi / Rincian Setoran"
                          style={{ color: '#0284c7' }}
                        >
                          <Eye size={15} />
                        </button>

                        {canInputPendapatan && (
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => handleOpenEdit(trx)}
                            title="Edit Transaksi Pendapatan"
                            style={{ color: '#d97706' }}
                          >
                            <Edit2 size={15} />
                          </button>
                        )}

                        {canInputPendapatan && (
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => {
                              if (window.confirm(`Hapus transaksi ${trx.namaPenyewa} (Rp ${nominalNum.toLocaleString('id-ID')})?`)) {
                                deletePendapatanTransaction(trx.id);
                              }
                            }}
                            title="Hapus Transaksi"
                            style={{ color: '#dc2626' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filteredTransactions.length > 0 && (
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                <td colSpan="5" style={{ textAlign: 'right', padding: '12px 16px', color: '#0f2c59' }}>
                  TOTAL PENERIMAAN TERFILTER:
                </td>
                <td style={{ textAlign: 'right', padding: '12px 16px', color: '#0d9488', fontSize: 14 }}>
                  Rp {filteredTransactions.reduce((sum, t) => sum + (parseFloat(t.nominal) || 0), 0).toLocaleString('id-ID')}
                </td>
                <td colSpan="3" style={{ fontSize: 11.5, color: '#64748b' }}>
                  {filteredTransactions.length} Transaksi
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* MODAL INPUT & EDIT TRANSAKSI PENDAPATAN */}
      {isInputModalOpen && (
        <div className="modal-overlay" onClick={() => setIsInputModalOpen(false)}>
          <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{isEditMode ? 'Ubah Transaksi Penerimaan Pendapatan' : 'Input Penerimaan Pendapatan Baru'}</h3>
                <p>Lengkapi formulir retribusi daerah DINPUTARU Kabupaten Demak TA {activeYear}</p>
              </div>
              <button className="btn-icon" onClick={() => setIsInputModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitTransaction}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    Kategori Sumber Pendapatan <span className="required">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    required
                  >
                    {kategoriPendapatanList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama} — {k.labelLengkap}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Nama Penyewa / Pemohon / Wajib Retribusi <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: CV Surya Demak Konstruksi / Bpk. H. Sukirman"
                    value={formData.namaPenyewa}
                    onChange={(e) => setFormData({ ...formData, namaPenyewa: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">
                      Tanggal Penerimaan / Sewa <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Nomor Bukti Setor / STS / SKRD <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`STS/DPU/${activeYear}/...`}
                      value={formData.noBukti}
                      onChange={(e) => setFormData({ ...formData, noBukti: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Nominal Penerimaan (Rp) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Contoh: 500000"
                    value={formData.nominal}
                    onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                    required
                    min="1"
                    step="1"
                    style={{ fontSize: 15, fontWeight: 700, color: '#0d9488' }}
                  />
                  {formData.nominal && !isNaN(formData.nominal) && (
                    <span className="form-help" style={{ color: '#0d9488', fontWeight: 600 }}>
                      Terbilang: Rp {parseFloat(formData.nominal || 0).toLocaleString('id-ID')} Rupiah
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Metode Pembayaran</label>
                  <select
                    className="form-control"
                    value={formData.metodePembayaran}
                    onChange={(e) => setFormData({ ...formData, metodePembayaran: e.target.value })}
                  >
                    <option value="Transfer Kasda (Bank Jateng)">Transfer Kasda (Bank Jateng)</option>
                    <option value="Virtual Account Kasda">Virtual Account Kasda</option>
                    <option value="QRIS Dinas DINPUTARU">QRIS Dinas DINPUTARU</option>
                    <option value="Setoran Tunai via Kasir / Teller Bank Jateng">Setoran Tunai via Kasir / Teller Bank Jateng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Keterangan / Rincian Layanan / Sewa</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Contoh: Sewa Excavator PC200 selama 3 hari pekerjaan pembersihan saluran Desa Bintoro"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsInputModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} />
                  {isEditMode ? 'Simpan Perubahan' : 'Catat Penerimaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PENGATURAN TARGET TAHUNAN */}
      {isTargetModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTargetModalOpen(false)}>
          <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Pengaturan Target Pendapatan Retribusi TA {activeYear}</h3>
                <p>Sesuaikan target total (misal 6 Miliar) dan alokasi target masing-masing 5 kategori retribusi.</p>
              </div>
              <button className="btn-icon" onClick={() => setIsTargetModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTarget}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    Target Tahunan Total (Rp) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={targetForm.targetTahunanTotal}
                    onChange={(e) => setTargetForm({ ...targetForm, targetTahunanTotal: parseFloat(e.target.value) || 0 })}
                    required
                    style={{ fontSize: 16, fontWeight: 800, color: '#0284c7' }}
                  />
                  <span className="form-help" style={{ color: '#0284c7', fontWeight: 600 }}>
                    Terbilang: Rp {(parseFloat(targetForm.targetTahunanTotal) || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f2c59', marginBottom: 10 }}>
                    Rincian Target per Kategori Retribusi:
                  </div>

                  {kategoriPendapatanList.map((kat) => (
                    <div key={kat.id} className="form-group" style={{ marginBottom: 12 }}>
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{kat.nama}</span>
                        <span style={{ color: '#64748b', fontSize: 11 }}>{kat.satuanTarif}</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={targetForm.targetPerKategori?.[kat.id] || 0}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setTargetForm({
                            ...targetForm,
                            targetPerKategori: {
                              ...targetForm.targetPerKategori,
                              [kat.id]: val
                            }
                          });
                        }}
                      />
                      <span className="form-help">
                        Rp {(targetForm.targetPerKategori?.[kat.id] || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsTargetModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} />
                  Simpan Target Anggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL KWITANSI / BUKTI PENERIMAAN */}
      {detailModalTrx && (
        <div className="modal-overlay" onClick={() => setDetailModalTrx(null)}>
          <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Bukti Penerimaan Retribusi Daerah</h3>
                <p>Surat Tanda Setoran (STS) Kas Daerah DINPUTARU Kabupaten Demak</p>
              </div>
              <button className="btn-icon" onClick={() => setDetailModalTrx(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Receipt Style Card */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: 12,
                  padding: '20px'
                }}
              >
                <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>PEMERINTAH KABUPATEN DEMAK</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#0f2c59' }}>
                    DINAS PEKERJAAN UMUM DAN PENATAAN RUANG
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    {systemSettings?.alamat || 'Jl. Kyai Jebat No. 35 Demak'}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, marginBottom: 14 }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Nomor Bukti STS:</span>
                    <strong style={{ color: '#0284c7' }}>{detailModalTrx.noBukti || detailModalTrx.id}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Tanggal Penerimaan:</span>
                    <strong>{detailModalTrx.tanggal}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Kategori PAD:</span>
                    <strong>{kategoriPendapatanList.find((k) => k.id === detailModalTrx.kategori)?.nama || detailModalTrx.kategori}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Metode Pembayaran:</span>
                    <strong>{detailModalTrx.metodePembayaran}</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginBottom: 14 }}>
                  <span style={{ color: '#64748b', fontSize: 12, display: 'block' }}>Wajib Retribusi / Penyewa:</span>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0f2c59' }}>
                    {detailModalTrx.namaPenyewa}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                    {detailModalTrx.keterangan || '-'}
                  </div>
                </div>

                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 8,
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1e40af' }}>Jumlah Diterima:</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#0d9488' }}>
                    Rp {parseFloat(detailModalTrx.nominal || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: '#059669', fontWeight: 700 }}>
                  ✓ Status: Terverifikasi Masuk Kas Daerah Kabupaten Demak
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setDetailModalTrx(null)}>
                Tutup
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                <Printer size={15} />
                Cetak Bukti STS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendapatanView;
