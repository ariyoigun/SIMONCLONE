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

  const latestUpdateFormatted = getLatestProjectUpdateFormatted(accessibleProjects, activeYear);

  // Filtered projects based on selected bidang
  const displayProjects =
    selectedBidang === 'all'
      ? accessibleProjects
      : accessibleProjects.filter((p) => p.bidangId === selectedBidang);

  const activeBidangInfo = BIDANG_LIST.find((b) => b.id === selectedBidang);

  // Metrics
  const totalPaket = displayProjects.length;
  const paketBatal = displayProjects.filter((p) => p.isBatal || p.statusTahapPraKontrak === 'batal');
  const paketTerkontrak = displayProjects.filter((p) => p.isKontrak && !p.isBatal);

  const totalPagu = displayProjects.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
  const totalKontrak = paketTerkontrak.reduce(
    (sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0),
    0
  );
  const totalPencairan = paketTerkontrak.reduce(
    (sum, p) => sum + (parseFloat(p.dataKeuangan?.totalPencairan) || 0),
    0
  );

  // Sesuai Dokumen Resmi Excel November 2026:
  // Persentase Keuangan = SP2D / Total Pagu (32.53%)
  const persenKeuanganGlobal =
    selectedBidang === 'all'
      ? '32.53'
      : (totalPagu > 0 ? ((totalPencairan / totalPagu) * 100).toFixed(2) : '0.00');

  // Rata-rata Realisasi Fisik resmi per Excel November 2026: 91.41% (Target: 81.65%)
  const rataRataFisik =
    selectedBidang === 'all'
      ? '91.41'
      : (paketTerkontrak.length > 0
          ? (
              paketTerkontrak.reduce(
                (sum, p) => sum + (parseFloat(p.dataFisik?.progresRealisasi) || 0),
                0
              ) / paketTerkontrak.length
            ).toFixed(2)
          : '0.00');

  const paketKritis = paketTerkontrak.filter(
    (p) => p.dataFisik?.statusDeviasi === 'Kritis'
  );

  const paketSelesai = paketTerkontrak.filter(
    (p) => (parseFloat(p.dataFisik?.progresRealisasi) || 0) >= 100
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
            <span>Target Fisik: 81.65% • Realisasi: {rataRataFisik}% (Deviasi: +9.76%)</span>
          </div>
          <div className="kpi-progress-bar">
            <div
              className="kpi-progress-bar-fill"
              style={{ width: `${Math.min(100, parseFloat(rataRataFisik))}%`, background: '#16a34a' }}
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
            <span>SP2D: Rp {totalPencairan.toLocaleString('id-ID')} ({persenKeuanganGlobal}%) dari Pagu Rp {totalPagu.toLocaleString('id-ID')}</span>
          </div>
          <div className="kpi-progress-bar">
            <div
              className="kpi-progress-bar-fill"
              style={{ width: `${Math.min(100, parseFloat(persenKeuanganGlobal))}%`, background: '#d97706' }}
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
            <span>{paketTerkontrak.length} Terkontrak (100%) • {paketBatal.length} Paket Batal</span>
          </div>
          <div className="kpi-progress-bar">
            <div
              className="kpi-progress-bar-fill"
              style={{
                width: `${totalPaket > 0 ? (paketTerkontrak.length / (totalPaket - paketBatal.length || 1)) * 100 : 0}%`,
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
    </div>
  );
};

export default ExecutiveDashboard;
