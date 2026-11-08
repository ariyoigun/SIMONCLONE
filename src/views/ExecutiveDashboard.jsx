import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, LIFECYCLE_STAGES, getProjectLifecycleStage } from '../data/constants';
import StageProgressDiagram from '../components/StageProgressDiagram';
import DonutPieChart from '../components/DonutPieChart';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Eye,
  Plus,
  Database,
  Filter,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FolderOpen
} from 'lucide-react';
import { getLatestProjectUpdateFormatted } from '../utils/dateUtils';

const ExecutiveDashboard = ({ onOpenProjectModal, onViewProject, onQuickUpdate }) => {
  const { accessibleProjects, activeYear, canCreateProject, canEditProject, currentUser, setActiveTab, systemSettings } = useApp();

  // State filter pemilah per bidang (Eksekutif Kadin & Sekretaris)
  const [selectedBidang, setSelectedBidang] = useState('all');

  // State dropdown list pekerjaan per bidang di tabel komparasi bidang
  const [expandedKomparasiBidang, setExpandedKomparasiBidang] = useState(null);

  const latestUpdateFormatted = getLatestProjectUpdateFormatted(accessibleProjects, activeYear);

  // Filtered projects based on selected bidang
  const displayProjects =
    selectedBidang === 'all'
      ? accessibleProjects
      : accessibleProjects.filter((p) => p.bidangId === selectedBidang);

  const activeBidangInfo = BIDANG_LIST.find((b) => b.id === selectedBidang);

  // Metrics
  const totalPaket = displayProjects.length;
  const paketPraKontrak = displayProjects.filter((p) => !p.isKontrak);
  const paketTerkontrak = displayProjects.filter((p) => p.isKontrak);

  const totalPagu = displayProjects.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
  const totalKontrak = paketTerkontrak.reduce(
    (sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0),
    0
  );
  const totalPencairan = paketTerkontrak.reduce(
    (sum, p) => sum + (parseFloat(p.dataKeuangan?.totalPencairan) || 0),
    0
  );

  const persenKeuanganGlobal =
    totalKontrak > 0 ? ((totalPencairan / totalKontrak) * 100).toFixed(1) : 0;

  const rataRataFisik =
    paketTerkontrak.length > 0
      ? (
          paketTerkontrak.reduce(
            (sum, p) => sum + (parseFloat(p.dataFisik?.progresRealisasi) || 0),
            0
          ) / paketTerkontrak.length
        ).toFixed(1)
      : 0;

  const paketKritis = paketTerkontrak.filter(
    (p) => p.dataFisik?.statusDeviasi === 'Kritis'
  );

  const paketSelesai = paketTerkontrak.filter(
    (p) => (p.dataFisik?.progresRealisasi || 0) >= 100
  );

  // Donut Chart Data
  const stageChartData = LIFECYCLE_STAGES.map((stage) => {
    const count = displayProjects.filter((p) => getProjectLifecycleStage(p) === stage.id).length;
    return {
      label: stage.nama,
      value: count,
      color: stage.warna
    };
  }).filter((d) => d.value > 0);

  const paguMurni = displayProjects
    .filter((p) => (p.jenisAnggaran || 'Murni') === 'Murni')
    .reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
  const paguPerubahan = displayProjects
    .filter((p) => p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan')
    .reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);

  const anggaranChartData = [
    {
      label: 'APBD Murni',
      value: paguMurni,
      color: '#0284c7'
    },
    {
      label: '(APBD-P) Perubahan',
      value: paguPerubahan,
      color: '#f59e0b'
    }
  ].filter((d) => d.value > 0);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>{systemSettings?.customTexts?.internal_dashboard_title || 'Dashboard Eksekutif Monitoring Pekerjaan'}</h1>
          <p>
            {systemSettings?.customTexts?.internal_dashboard_desc || `Ringkasan capaian pekerjaan pra-kontrak, fisik, dan keuangan ${systemSettings?.instansi || 'Dinas Pekerjaan Umum dan Penataan Ruang'} TA ${activeYear}`}
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => setActiveTab('master_pekerjaan')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, background: '#fff' }}
            title="Kelola seluruh basis data pekerjaan di Master Data"
          >
            <Database size={15} color="#0284c7" />
            <span>Master Data Pekerjaan</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if there are critical projects */}
      {paketKritis.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)',
            border: '1.5px solid #fecaca',
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 22,
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.05)'
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  flexShrink: 0
                }}
              >
                <AlertTriangle size={18} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span>Peringatan: Pekerjaan Mengalami Keterlambatan Kritis</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background: '#dc2626',
                      color: '#ffffff',
                      padding: '1px 8px',
                      borderRadius: 9999
                    }}
                  >
                    {paketKritis.length} Paket (Deviasi &lt; -5%)
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: '#b91c1c', marginTop: 1 }}>
                  Memerlukan evaluasi Show Cause Meeting (SCM) bersama PPK dan Penyedia Jasa.
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: '#991b1b', fontWeight: 600 }}>
              Klik pekerjaan untuk tinjau detil:
            </div>
          </div>

          {/* Grid Pills per Bidang with Distinct Colors */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            {paketKritis.map((k) => {
              const b = BIDANG_LIST.find((x) => x.id === k.bidangId);
              const bColor = b?.warna || '#dc2626';
              const bBg = b?.bgLight || 'rgba(220, 38, 38, 0.08)';
              const bSingkatan = b?.id === 'sda_bk' ? 'SDA-BK' : (b?.singkatan || k.bidangId);
              const deviasi = k.dataFisik?.deviasiFisik || 0;

              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => onViewProject(k)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: '#ffffff',
                    border: `1.5px solid ${bColor}66`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    maxWidth: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = bColor;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${bColor}66`;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                  }}
                  title={`${k.namaPaket}\nBidang: ${b?.nama || k.bidangId}\nDeviasi: ${deviasi}%`}
                >
                  {/* Badge Bidang */}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: bBg,
                      color: bColor,
                      border: `1px solid ${bColor}33`,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {bSingkatan}
                  </span>

                  {/* Nama Paket Truncated */}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#1e293b',
                      maxWidth: 220,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {k.namaPaket}
                  </span>

                  {/* Deviasi Pill */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#dc2626',
                      background: '#fee2e2',
                      padding: '1px 6px',
                      borderRadius: 4,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {deviasi}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SEGMENTED FILTER PEMILAH PER BIDANG (KHUSUS KADIN, SEKRETARIS & SUPERADMIN) */}
      <div
        style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 22,
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}
            >
              <Filter size={17} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f2c59' }}>
                Pemilah Tampilan per Bidang (Monitoring Khusus Kadin & Sekdin)
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>
                Kategorikan tampilan capaian dan paket pekerjaan per bidang dinas untuk pemantauan terfokus
              </div>
            </div>
          </div>

          {selectedBidang !== 'all' && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setSelectedBidang('all')}
              style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px' }}
            >
              <span>Tampilkan Semua Bidang ({accessibleProjects.length})</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            type="button"
            onClick={() => setSelectedBidang('all')}
            style={{
              padding: '8px 16px',
              borderRadius: 9999,
              fontSize: 12.5,
              fontWeight: selectedBidang === 'all' ? 800 : 600,
              cursor: 'pointer',
              border: selectedBidang === 'all' ? '2px solid #0f2c59' : '1px solid #cbd5e1',
              background: selectedBidang === 'all' ? '#0f2c59' : '#ffffff',
              color: selectedBidang === 'all' ? '#ffffff' : '#475569',
              boxShadow: selectedBidang === 'all' ? '0 2px 6px rgba(15,44,89,0.2)' : 'none',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>Semua Bidang</span>
            <span
              style={{
                fontSize: 11,
                padding: '2px 7px',
                borderRadius: 9999,
                background: selectedBidang === 'all' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: selectedBidang === 'all' ? '#ffffff' : '#475569',
                fontWeight: 800
              }}
            >
              {accessibleProjects.length}
            </span>
          </button>

          {BIDANG_LIST.map((bidang) => {
            const count = accessibleProjects.filter((p) => p.bidangId === bidang.id).length;
            const isSelected = selectedBidang === bidang.id;
            return (
              <button
                key={bidang.id}
                type="button"
                onClick={() => setSelectedBidang(bidang.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 9999,
                  fontSize: 12.5,
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  border: isSelected ? `2px solid ${bidang.warna}` : '1px solid #cbd5e1',
                  background: isSelected ? bidang.warna : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  boxShadow: isSelected ? `0 2px 8px ${bidang.warna}40` : 'none',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: isSelected ? '#ffffff' : bidang.warna
                  }}
                />
                <span>{bidang.nama}</span>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 7px',
                    borderRadius: 9999,
                    background: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#475569',
                    fontWeight: 800
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Bidang Highlight Bar */}
        {activeBidangInfo && selectedBidang !== 'all' && (
          <div
            style={{
              marginTop: 14,
              padding: '12px 16px',
              borderRadius: 10,
              background: activeBidangInfo.bgLight || 'rgba(37,99,235,0.06)',
              border: `1.5px solid ${activeBidangInfo.warna}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>📌</span>
              <div>
                <strong style={{ fontSize: 13, color: activeBidangInfo.warna }}>
                  Fokus Tampilan Bidang: {activeBidangInfo.nama} ({activeBidangInfo.singkatan})
                </strong>
                <div style={{ fontSize: 11.5, color: '#475569', marginTop: 1 }}>
                  {activeBidangInfo.deskripsi}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: activeBidangInfo.warna }}>
              {displayProjects.length} Pekerjaan Terfilter • Rp {totalPagu.toLocaleString('id-ID')} Pagu
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Total Pagu */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Pagu Anggaran</span>
            <div className="kpi-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Briefcase size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ fontSize: 'clamp(17px, 1.35vw, 22px)' }}>
            Rp {totalPagu.toLocaleString('id-ID')}
          </div>
          <div className="kpi-subtext">
            <span>Pagu Anggaran Tahun Berjalan</span>
          </div>
          <div className="kpi-progress-bar">
            <div className="kpi-progress-bar-fill" style={{ width: '100%', background: '#0284c7' }} />
          </div>
        </div>

        {/* Realisasi Fisik */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Rata-Rata Fisik</span>
            <div className="kpi-icon-wrap" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#16a34a' }}>
            {rataRataFisik}%
          </div>
          <div className="kpi-subtext">
            <span>{paketSelesai.length} dari {paketTerkontrak.length} paket selesai 100%</span>
          </div>
          <div className="kpi-progress-bar">
            <div
              className="kpi-progress-bar-fill"
              style={{ width: `${Math.min(100, rataRataFisik)}%`, background: '#16a34a' }}
            />
          </div>
        </div>

        {/* Realisasi Keuangan */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Penyerapan Keuangan</span>
            <div className="kpi-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#d97706' }}>
            {persenKeuanganGlobal}%
          </div>
          <div className="kpi-subtext">
            <span>Cair: Rp {totalPencairan.toLocaleString('id-ID')} dari Rp {totalKontrak.toLocaleString('id-ID')} Kontrak</span>
          </div>
          <div className="kpi-progress-bar">
            <div
              className="kpi-progress-bar-fill"
              style={{ width: `${Math.min(100, persenKeuanganGlobal)}%`, background: '#d97706' }}
            />
          </div>
        </div>

        {/* Status Kontrak */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Status Pekerjaan</span>
            <div className="kpi-icon-wrap" style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <Clock size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#7c3aed' }}>
            {paketTerkontrak.length} / {totalPaket}
          </div>
          <div className="kpi-subtext">
            <span>{paketTerkontrak.length} Terkontrak • {paketPraKontrak.length} Pra-Kontrak</span>
          </div>
          <div className="kpi-progress-bar">
            <div
              className="kpi-progress-bar-fill"
              style={{
                width: `${totalPaket > 0 ? (paketTerkontrak.length / totalPaket) * 100 : 0}%`,
                background: '#7c3aed'
              }}
            />
          </div>
        </div>
      </div>

      {/* Visualisasi Diagram Lingkaran Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
        <DonutPieChart
          title="Distribusi Tahapan Siklus Pekerjaan"
          subtitle="Sebaran pekerjaan di seluruh tahapan dinas (SiRUP s/d PHO 100%)"
          data={stageChartData}
          centerLabel="Total Paket"
          centerValue={`${totalPaket}`}
        />
        <DonutPieChart
          title="Proporsi Anggaran APBD Murni vs Perubahan"
          subtitle="Alokasi pagu anggaran penetapan murni vs pergeseran / perubahan"
          data={anggaranChartData}
          isCurrency={true}
          centerLabel="Total Pagu"
          centerValue={`Rp ${totalPagu.toLocaleString('id-ID')}`}
        />
      </div>

      {/* REKAP PROGRES PEKERJAAN PER TAHAP DENGAN DIAGRAM & FILTER INTERAKTIF */}
      <StageProgressDiagram
        projects={displayProjects}
        onViewProject={onViewProject}
        onQuickUpdate={onQuickUpdate}
        onOpenProjectModal={onOpenProjectModal}
        canEditProject={canEditProject}
      />

      {/* Perbandingan Progres per Bidang Dinas */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3>
              <Building2 size={18} color="#0f2c59" />
              Komparasi Capaian Progres per Bidang DINPUTARU
            </h3>
            <p>Klik nama bidang pada baris tabel untuk memfilter seluruh diagram dan capaian di atas</p>
          </div>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bidang</th>
                  <th>Jumlah Paket</th>
                  <th>Alokasi Pagu (Rp)</th>
                  <th>Nilai Kontrak (Rp)</th>
                  <th>Rata-Rata Fisik (%)</th>
                  <th>Capaian Keuangan (%)</th>
                  <th>Status Deviasi</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {BIDANG_LIST.map((bidang) => {
                  const bidangProjects = accessibleProjects.filter((p) => p.bidangId === bidang.id);
                  if (bidangProjects.length === 0 && currentUser.bidangId && currentUser.bidangId !== bidang.id) {
                    return null; // Don't show unauthorized fields if role is restricted
                  }

                  const isCurrentFilter = selectedBidang === bidang.id;
                  const bTerkontrak = bidangProjects.filter((p) => p.isKontrak);
                  const bPagu = bidangProjects.reduce((s, p) => s + (parseFloat(p.paguAnggaran) || 0), 0);
                  const bKontrak = bTerkontrak.reduce(
                    (s, p) => s + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0),
                    0
                  );
                  const bCair = bTerkontrak.reduce(
                    (s, p) => s + (parseFloat(p.dataKeuangan?.totalPencairan) || 0),
                    0
                  );

                  const bFisik =
                    bTerkontrak.length > 0
                      ? (
                          bTerkontrak.reduce(
                            (s, p) => s + (parseFloat(p.dataFisik?.progresRealisasi) || 0),
                            0
                          ) / bTerkontrak.length
                        ).toFixed(1)
                      : 0;

                  const bKeuangan = bKontrak > 0 ? ((bCair / bKontrak) * 100).toFixed(1) : 0;

                  const hasCritical = bTerkontrak.some(
                    (p) => p.dataFisik?.statusDeviasi === 'Kritis'
                  );

                  const isExpanded = expandedKomparasiBidang === bidang.id;

                  return (
                    <React.Fragment key={bidang.id}>
                      <tr
                        style={{
                          background: isExpanded ? 'rgba(37, 99, 235, 0.08)' : isCurrentFilter ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onClick={() => setExpandedKomparasiBidang(isExpanded ? null : bidang.id)}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: bidang.warna
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f2c59' }}>
                                {bidang.nama} {isCurrentFilter && <span style={{ color: '#2563eb', fontSize: 11 }}>● Aktif</span>}
                              </div>
                              <div style={{ fontSize: 11, color: '#64748b' }}>{bidang.singkatan}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700 }}>
                            {bidangProjects.length} Paket
                          </span>{' '}
                          <span style={{ fontSize: 11, color: '#64748b' }}>
                            ({bTerkontrak.length} Terkontrak)
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>Rp {bPagu.toLocaleString('id-ID')}</td>
                        <td style={{ fontWeight: 600, color: '#0284c7' }}>
                          Rp {bKontrak.toLocaleString('id-ID')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 80, height: 7, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${Math.min(100, bFisik)}%`,
                                  height: '100%',
                                  background: '#10b981',
                                  borderRadius: 9999
                                }}
                              />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 12.5 }}>{bFisik}%</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 80, height: 7, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${Math.min(100, bKeuangan)}%`,
                                  height: '100%',
                                  background: '#f59e0b',
                                  borderRadius: 9999
                                }}
                              />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 12.5 }}>{bKeuangan}%</span>
                          </div>
                        </td>
                        <td>
                          {hasCritical ? (
                            <span className="badge badge-kritis">Ada Kritis (SCM)</span>
                          ) : (
                            <span className="badge badge-aman">Aman Terkendali</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{
                                fontSize: 11,
                                padding: '4px 9px',
                                background: isExpanded ? bidang.warna : '#fff',
                                color: isExpanded ? '#fff' : '#0f2c59',
                                borderColor: isExpanded ? bidang.warna : '#cbd5e1',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedKomparasiBidang(isExpanded ? null : bidang.id);
                              }}
                              title="Buka dropdown daftar paket pekerjaan bidang ini"
                            >
                              <span>{isExpanded ? 'Tutup' : 'Lihat Paket'}</span>
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{
                                fontSize: 11,
                                padding: '4px 8px',
                                background: isCurrentFilter ? '#2563eb' : '#fff',
                                color: isCurrentFilter ? '#fff' : '#0f2c59',
                                borderColor: isCurrentFilter ? '#2563eb' : '#cbd5e1'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBidang(isCurrentFilter ? 'all' : bidang.id);
                              }}
                              title="Filter seluruh dashboard ke bidang ini"
                            >
                              {isCurrentFilter ? 'Reset' : 'Filter'}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Dropdown Baris Daftar Paket Pekerjaan Per Bidang */}
                      {isExpanded && (
                        <tr style={{ background: '#f8fafc' }}>
                          <td colSpan="8" style={{ padding: '16px 20px', borderTop: 'none' }}>
                            <div
                              style={{
                                background: '#ffffff',
                                border: `1.5px solid ${bidang.warna}30`,
                                borderRadius: 10,
                                padding: 14,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <FolderOpen size={16} color={bidang.warna} />
                                  <span style={{ fontWeight: 800, fontSize: 13, color: '#0f2c59' }}>
                                    Dropdown Daftar Paket Pekerjaan: {bidang.nama} ({bidangProjects.length} Paket)
                                  </span>
                                </div>
                                <span style={{ fontSize: 11.5, color: '#64748b' }}>
                                  Menampilkan paket pekerjaan {bidang.singkatan} TA {activeYear}
                                </span>
                              </div>

                              <div className="table-container" style={{ margin: 0, border: '1px solid #e2e8f0' }}>
                                <table className="data-table" style={{ fontSize: 12 }}>
                                  <thead>
                                    <tr style={{ background: '#f8fafc' }}>
                                      <th style={{ width: 36, textAlign: 'center' }}>No</th>
                                      <th>Nama Paket & Lokasi</th>
                                      <th>Penyedia Jasa</th>
                                      <th>Pagu / Nilai Kontrak</th>
                                      <th>Realisasi Fisik</th>
                                      <th>Status Deviasi</th>
                                      <th style={{ textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bidangProjects.map((bp, bidx) => (
                                      <tr key={bp.id}>
                                        <td style={{ textAlign: 'center', color: '#64748b' }}>{bidx + 1}</td>
                                        <td>
                                          <div style={{ fontWeight: 700, color: '#0f2c59' }}>{bp.namaPaket}</div>
                                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                            {bp.desa ? `${bp.desa}, ` : ''}Kec. {bp.kecamatan || '-'}
                                          </div>
                                        </td>
                                        <td>{bp.dataKontrak?.namaPenyedia || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Belum ada</span>}</td>
                                        <td>
                                          <div>Pagu: Rp {parseFloat(bp.paguAnggaran || 0).toLocaleString('id-ID')}</div>
                                          {bp.isKontrak && (
                                            <div style={{ color: '#0284c7', fontWeight: 600, fontSize: 11.5 }}>
                                              Kontrak: Rp {parseFloat(bp.dataKontrak?.nilaiKontrak || 0).toLocaleString('id-ID')}
                                            </div>
                                          )}
                                        </td>
                                        <td>
                                          {bp.isKontrak ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                              <span style={{ fontWeight: 700, color: (bp.dataFisik?.progresRealisasi || 0) >= 100 ? '#0284c7' : '#15803d' }}>
                                                {bp.dataFisik?.progresRealisasi || 0}%
                                              </span>
                                            </div>
                                          ) : (
                                            <span style={{ fontSize: 11, color: '#d97706', fontWeight: 700 }}>Pra-Kontrak</span>
                                          )}
                                        </td>
                                        <td>
                                          <span className={`badge badge-${(bp.dataFisik?.statusDeviasi || 'aman').toLowerCase()}`}>
                                            {bp.dataFisik?.statusDeviasi || 'Aman'}
                                          </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                          <button
                                            type="button"
                                            className="btn btn-outline btn-sm"
                                            style={{ padding: '3px 8px', fontSize: 11 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onViewProject(bp);
                                            }}
                                            title="Buka rincian lengkap pekerjaan"
                                          >
                                            <Eye size={12} />
                                            Detail
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Card Komparasi Bidang dengan Time Stamp di Pojok Kiri Bawah */}
        <div
          style={{
            padding: '14px 20px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12.5,
            flexWrap: 'wrap',
            gap: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#334155', fontWeight: 600 }}>
            <Clock size={16} color="#0284c7" />
            <span>Terakhir diupdate: <strong style={{ color: '#0f2c59' }}>{latestUpdateFormatted}</strong></span>
            <span
              style={{
                fontSize: 10.5,
                padding: '2px 8px',
                borderRadius: 9999,
                background: '#e0f2fe',
                color: '#0369a1',
                fontWeight: 700
              }}
            >
              TA {activeYear}
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: 12 }}>
            Data komparasi capaian dinas terintegrasi DINPUTARU Kabupaten Demak
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
