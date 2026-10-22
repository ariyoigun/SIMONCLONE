import React, { useState, useEffect } from 'react';
import { LIFECYCLE_STAGES, getProjectLifecycleStage, BIDANG_LIST, KECAMATAN_DEMAK, JENIS_ANGGARAN } from '../data/constants';
import {
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  Sliders,
  Edit,
  Search,
  X,
  Building2,
  TrendingUp,
  FileText,
  AlertCircle,
  HelpCircle,
  MapPin,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Folder
} from 'lucide-react';
import { getLatestProjectUpdateFormatted } from '../utils/dateUtils';

const StageProgressDiagram = ({
  projects = [],
  onViewProject,
  onQuickUpdate,
  onOpenProjectModal,
  canEditProject
}) => {
  const [selectedStage, setSelectedStage] = useState(null); // null = all stages
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedAnggaran, setSelectedAnggaran] = useState('ALL');

  // State dropdown accordion untuk daftar pekerjaan per bidang
  const [expandedBidangs, setExpandedBidangs] = useState({});

  // Auto-expand bidang jika dipilih secara spesifik dari filter
  useEffect(() => {
    if (selectedBidang && selectedBidang !== 'ALL') {
      setExpandedBidangs((prev) => ({
        ...prev,
        [selectedBidang]: true
      }));
    }
  }, [selectedBidang]);

  const toggleBidang = (bidangId) => {
    setExpandedBidangs((prev) => ({
      ...prev,
      [bidangId]: !prev[bidangId]
    }));
  };

  const expandAllBidangs = () => {
    const all = {};
    BIDANG_LIST.forEach((b) => {
      all[b.id] = true;
    });
    setExpandedBidangs(all);
  };

  const collapseAllBidangs = () => {
    setExpandedBidangs({});
  };

  const totalProjectsCount = projects.length;
  const latestUpdateFormatted = getLatestProjectUpdateFormatted(projects);

  // Calculate statistics per stage
  const stageStats = LIFECYCLE_STAGES.map((stage) => {
    const stageProjects = projects.filter((p) => getProjectLifecycleStage(p) === stage.id);
    const count = stageProjects.length;
    const paguTotal = stageProjects.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
    const kontrakTotal = stageProjects.reduce((sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0), 0);
    const persen = totalProjectsCount > 0 ? ((count / totalProjectsCount) * 100).toFixed(1) : 0;

    return {
      ...stage,
      count,
      paguTotal,
      kontrakTotal,
      persen: parseFloat(persen),
      projects: stageProjects
    };
  });

  // Filter projects for the table below
  const filteredProjects = projects.filter((p) => {
    // Stage filter
    if (selectedStage && getProjectLifecycleStage(p) !== selectedStage) {
      return false;
    }

    // Bidang filter
    if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) {
      return false;
    }

    // Kecamatan filter
    if (selectedKecamatan !== 'ALL' && p.kecamatan !== selectedKecamatan) {
      return false;
    }

    // Jenis Anggaran filter
    if (selectedAnggaran !== 'ALL' && p.jenisAnggaran !== selectedAnggaran) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.namaPaket?.toLowerCase().includes(q);
      const matchCV = p.dataKontrak?.namaPenyedia?.toLowerCase().includes(q);
      const matchLokasi = p.lokasi?.toLowerCase().includes(q);
      const matchKec = p.kecamatan?.toLowerCase().includes(q);
      const matchDesa = p.desa?.toLowerCase().includes(q);
      const matchRUP = p.kodeRUP?.toLowerCase().includes(q);
      if (!matchName && !matchCV && !matchLokasi && !matchRUP && !matchKec && !matchDesa) return false;
    }

    return true;
  });

  const activeStageObj = LIFECYCLE_STAGES.find((s) => s.id === selectedStage);

  return (
    <div className="card" style={{ marginBottom: 32, overflow: 'visible' }}>
      {/* Card Header */}
      <div className="card-header">
        <div>
          <h3>
            <Layers size={19} color="#0f2c59" />
            Rekapitulasi Progres Alur Pekerjaan Per Tahap (Pipeline Diagram)
          </h3>
          <p>
            Diagram tahapan siklus pekerjaan mulai dari SiRUP, HPS, Pemilihan Penyedia (PBJ), SPPBJ, Fisik, hingga Selesai PHO 100%. <strong>Klik pada diagram atau kartu tahap untuk memfilter daftar pekerjaan di bawahnya.</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {selectedStage && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSelectedStage(null)}
              style={{ color: '#0f2c59', fontWeight: 700 }}
            >
              <X size={14} />
              Tampilkan Semua Tahap ({totalProjectsCount})
            </button>
          )}
        </div>
      </div>

      <div className="card-body">
        {/* 1. DIAGRAM BATANG DISTRIBUSI PROGRES PER TAHAP */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Proporsi Distribusi Tahapan Pekerjaan ({totalProjectsCount} Total Pekerjaan):
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              Klik segmen diagram untuk menyaring data
            </span>
          </div>

          {/* Multi-segment distribution bar */}
          <div
            style={{
              height: 28,
              borderRadius: 10,
              background: '#f1f5f9',
              overflow: 'hidden',
              display: 'flex',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0'
            }}
          >
            {stageStats.map((st) => {
              if (st.count === 0) return null;
              const isSelected = selectedStage === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStage(selectedStage === st.id ? null : st.id)}
                  title={`${st.nama}: ${st.count} Paket (${st.persen}%) - Klik untuk filter`}
                  style={{
                    width: `${st.persen}%`,
                    minWidth: 32,
                    height: '100%',
                    background: st.warna,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    opacity: selectedStage && !isSelected ? 0.35 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    borderRight: '1px solid rgba(255,255,255,0.4)',
                    transform: isSelected ? 'scaleY(1.08)' : 'scaleY(1)',
                    boxShadow: isSelected ? '0 0 0 2px #0f2c59 inset' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedStage) e.currentTarget.style.opacity = '0.85';
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedStage) e.currentTarget.style.opacity = '1';
                  }}
                >
                  {st.count}
                </div>
              );
            })}
          </div>

          {/* Legend under the bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: 10,
              fontSize: 11.5
            }}
          >
            {stageStats.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStage(selectedStage === st.id ? null : st.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: selectedStage === st.id ? st.bgLight : 'transparent',
                  fontWeight: selectedStage === st.id ? 800 : 500,
                  color: selectedStage === st.id ? st.warna : '#475569',
                  border: selectedStage === st.id ? `1px solid ${st.borderColor}` : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: st.warna
                  }}
                />
                <span>{st.singkatan} ({st.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. DIAGRAM INTERAKTIF KARTU ALUR TAHAPAN (FLOW PIPELINE STEPPER) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 12,
            marginBottom: 28
          }}
        >
          {stageStats.map((st, idx) => {
            const isSelected = selectedStage === st.id;

            return (
              <div
                key={st.id}
                onClick={() => setSelectedStage(isSelected ? null : st.id)}
                style={{
                  background: isSelected ? '#ffffff' : '#f8fafc',
                  border: isSelected
                    ? `2.5px solid ${st.warna}`
                    : '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected
                    ? `0 8px 20px -4px ${st.bgLight}, 0 4px 8px -2px rgba(0,0,0,0.06)`
                    : '0 1px 3px rgba(0,0,0,0.04)',
                  transform: isSelected ? 'translateY(-3px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = st.borderColor;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.background = '#f8fafc';
                  }
                }}
              >
                {/* Top Badge & Order */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: st.bgLight,
                      color: st.warna,
                      letterSpacing: 0.3
                    }}
                  >
                    Tahap {st.order}
                  </span>

                  {isSelected && (
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        background: st.warna,
                        color: '#ffffff',
                        padding: '1px 6px',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}
                    >
                      <CheckCircle2 size={11} /> Filter Aktif
                    </span>
                  )}
                </div>

                {/* Stage Name */}
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: isSelected ? st.warna : '#0f2c59',
                    lineHeight: 1.25,
                    marginBottom: 8
                  }}
                >
                  {st.nama}
                </div>

                {/* Count & Value */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: '#0f2c59' }}>
                    {st.count}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                    Paket ({st.persen}%)
                  </span>
                </div>

                {/* Rupiah Value */}
                <div style={{ fontSize: 12, fontWeight: 700, color: st.warna }}>
                  {st.id === 'fisik' || st.id === 'selesai'
                    ? `Rp ${(st.kontrakTotal / 1000000000).toFixed(2)} M Kontrak`
                    : `Rp ${(st.paguTotal / 1000000000).toFixed(2)} M Pagu`}
                </div>

                {/* Description */}
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 8, lineHeight: 1.35 }}>
                  {st.deskripsi}
                </div>

                {/* Click indicator */}
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: '1px dashed #e2e8f0',
                    fontSize: 11,
                    fontWeight: 700,
                    color: isSelected ? st.warna : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{isSelected ? 'Klik untuk batal filter' : 'Klik untuk lihat daftar'}</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. SECTION DAFTAR PEKERJAAN HASIL FILTER TAHAP */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          {/* Header Section Filter */}
          <div
            style={{
              padding: '16px 20px',
              background: activeStageObj ? activeStageObj.bgLight : '#fafbfc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 9999,
                    fontSize: 12,
                    fontWeight: 800,
                    background: activeStageObj ? activeStageObj.warna : '#0f2c59',
                    color: '#ffffff'
                  }}
                >
                  {activeStageObj ? `Tahap: ${activeStageObj.nama}` : 'Semua Tahapan Progres'}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59' }}>
                  Ditemukan: <strong>{filteredProjects.length} Paket Pekerjaan</strong>
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                {activeStageObj
                  ? activeStageObj.deskripsi
                  : 'Menampilkan seluruh paket pekerjaan lintas tahapan siklus pekerjaan dinas.'}
              </p>
            </div>

            {/* Quick Filter Controls inside Table Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* Search */}
              <div className="search-input-wrap" style={{ minWidth: 200 }}>
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Cari paket, desa, rekanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '6px 10px 6px 32px', fontSize: 12 }}
                />
              </div>

              {/* Kecamatan Select */}
              <select
                className="select-filter"
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                style={{ padding: '6px 10px', fontSize: 12 }}
              >
                <option value="ALL">Semua Kec. (Demak)</option>
                {KECAMATAN_DEMAK.map((kec) => (
                  <option key={kec} value={kec}>
                    Kec. {kec}
                  </option>
                ))}
              </select>

              {/* Jenis Anggaran Select */}
              <select
                className="select-filter"
                value={selectedAnggaran}
                onChange={(e) => setSelectedAnggaran(e.target.value)}
                style={{ padding: '6px 10px', fontSize: 12 }}
              >
                <option value="ALL">Semua Anggaran</option>
                {JENIS_ANGGARAN.map((ja) => (
                  <option key={ja} value={ja}>
                    APBD {ja}
                  </option>
                ))}
              </select>

              {/* Bidang Select */}
              <select
                className="select-filter"
                value={selectedBidang}
                onChange={(e) => setSelectedBidang(e.target.value)}
                style={{ padding: '6px 10px', fontSize: 12 }}
              >
                <option value="ALL">Semua Bidang</option>
                {BIDANG_LIST.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.singkatan}
                  </option>
                ))}
              </select>

              {(selectedStage || selectedBidang !== 'ALL' || selectedKecamatan !== 'ALL' || selectedAnggaran !== 'ALL' || searchQuery) && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setSelectedStage(null);
                    setSelectedBidang('ALL');
                    setSelectedKecamatan('ALL');
                    setSelectedAnggaran('ALL');
                    setSearchQuery('');
                  }}
                  title="Reset semua filter"
                >
                  <X size={13} />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Dropdown List Pekerjaan Terpisah Per Bidang */}
          {(() => {
            const groupedBidangs = BIDANG_LIST.map((bidang) => {
              const bProjects = filteredProjects.filter((p) => p.bidangId === bidang.id);
              const bTerkontrak = bProjects.filter((p) => p.isKontrak);
              const bTotalPagu = bProjects.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
              const bTotalKontrak = bTerkontrak.reduce((sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0), 0);
              const bRataFisik =
                bTerkontrak.length > 0
                  ? (
                      bTerkontrak.reduce(
                        (sum, p) => sum + (parseFloat(p.dataFisik?.progresRealisasi) || 0),
                        0
                      ) / bTerkontrak.length
                    ).toFixed(1)
                  : 0;
              const bKritis = bTerkontrak.filter((p) => p.dataFisik?.statusDeviasi === 'Kritis');

              return {
                bidang,
                projects: bProjects,
                terkontrakCount: bTerkontrak.length,
                totalPagu: bTotalPagu,
                totalKontrak: bTotalKontrak,
                rataFisik: bRataFisik,
                kritisCount: bKritis.length
              };
            }).filter((group) => {
              if (selectedBidang !== 'ALL' && group.bidang.id !== selectedBidang) {
                return false;
              }
              return group.projects.length > 0;
            });

            if (filteredProjects.length === 0) {
              return (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: '#94a3b8' }}>
                  <AlertCircle size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#475569' }}>
                    Tidak ada pekerjaan pada kriteria ini.
                  </div>
                  <p style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}>
                    Coba sesuaikan kata kunci pencarian, filter tahap, kecamatan, atau bidang dinas.
                  </p>
                  {(selectedStage || selectedKecamatan !== 'ALL' || selectedAnggaran !== 'ALL' || selectedBidang !== 'ALL' || searchQuery) && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedStage(null);
                        setSelectedBidang('ALL');
                        setSelectedKecamatan('ALL');
                        setSelectedAnggaran('ALL');
                        setSearchQuery('');
                      }}
                      style={{ marginTop: 14 }}
                    >
                      Reset Semua Filter
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div>
                {/* Action Bar: Buka Semua / Tutup Semua Dropdown Bidang */}
                <div
                  style={{
                    padding: '12px 20px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building2 size={16} color="#0f2c59" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59' }}>
                      Daftar Pekerjaan per Bidang ({groupedBidangs.length} Bidang Aktif)
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      • Klik bidang untuk membuka atau menutup daftar paket
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={expandAllBidangs}
                      style={{ fontSize: 11.5, padding: '4px 10px', background: '#fff' }}
                      title="Buka seluruh dropdown daftar pekerjaan semua bidang"
                    >
                      <FolderOpen size={13} color="#0284c7" />
                      <span>Buka Semua Bidang</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={collapseAllBidangs}
                      style={{ fontSize: 11.5, padding: '4px 10px', background: '#fff' }}
                      title="Tutup seluruh dropdown daftar pekerjaan agar ringkas di dashboard"
                    >
                      <Folder size={13} color="#64748b" />
                      <span>Tutup Semua Bidang</span>
                    </button>
                  </div>
                </div>

                {/* List Dropdown Group per Bidang */}
                <div style={{ padding: '16px 20px' }}>
                  {groupedBidangs.map((group) => {
                    const isExpanded = !!expandedBidangs[group.bidang.id];

                    return (
                      <div
                        key={group.bidang.id}
                        className={`bidang-accordion-item ${isExpanded ? 'is-expanded' : ''}`}
                        style={{
                          borderLeft: `5px solid ${group.bidang.warna}`
                        }}
                      >
                        {/* Header Bidang (Klik untuk Dropdown) */}
                        <div
                          className="bidang-accordion-header"
                          onClick={() => toggleBidang(group.bidang.id)}
                          style={{
                            background: isExpanded ? 'rgba(255,255,255,1)' : 'rgba(248,250,252,0.85)'
                          }}
                        >
                          {/* Sisi Kiri: Identitas Bidang */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                background: group.bidang.bgLight || `${group.bidang.warna}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: group.bidang.warna
                              }}
                            >
                              <Building2 size={18} />
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0f2c59' }}>
                                  {group.bidang.nama}
                                </span>
                                <span
                                  style={{
                                    fontSize: 10.5,
                                    fontWeight: 800,
                                    padding: '2px 7px',
                                    borderRadius: 9999,
                                    background: group.bidang.warna,
                                    color: '#ffffff'
                                  }}
                                >
                                  {group.bidang.singkatan}
                                </span>
                              </div>
                              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
                                {group.bidang.deskripsi}
                              </div>
                            </div>
                          </div>

                          {/* Sisi Kanan: Ringkasan Metrik & Tombol Dropdown */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                padding: '4px 10px',
                                borderRadius: 6,
                                background: '#f1f5f9',
                                color: '#334155'
                              }}
                            >
                              <strong>{group.projects.length}</strong> Paket
                            </span>

                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                padding: '4px 10px',
                                borderRadius: 6,
                                background: '#e0f2fe',
                                color: '#0369a1'
                              }}
                            >
                              Pagu: Rp {(group.totalPagu / 1000000000).toFixed(2)} M
                            </span>

                            {group.terkontrakCount > 0 && (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  padding: '4px 10px',
                                  borderRadius: 6,
                                  background: '#dcfce7',
                                  color: '#15803d'
                                }}
                              >
                                Fisik: {group.rataFisik}%
                              </span>
                            )}

                            {group.kritisCount > 0 && (
                              <span
                                style={{
                                  fontSize: 11.5,
                                  fontWeight: 800,
                                  padding: '4px 9px',
                                  borderRadius: 6,
                                  background: '#fee2e2',
                                  color: '#dc2626'
                                }}
                              >
                                ⚠️ {group.kritisCount} Kritis
                              </span>
                            )}

                            {/* Tombol Dropdown List */}
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '5px 12px',
                                background: isExpanded ? group.bidang.warna : '#ffffff',
                                color: isExpanded ? '#ffffff' : group.bidang.warna,
                                borderColor: group.bidang.warna,
                                boxShadow: isExpanded ? `0 2px 6px ${group.bidang.warna}30` : 'none',
                                transition: 'all 0.15s ease'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBidang(group.bidang.id);
                              }}
                            >
                              <span>{isExpanded ? 'Tutup Daftar' : 'Buka Daftar'}</span>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* Konten Dropdown: Tabel Pekerjaan Khusus Bidang Ini */}
                        {isExpanded && (
                          <div style={{ borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
                            <div className="table-container" style={{ border: 'none', borderRadius: 0, margin: 0 }}>
                              <table className="data-table">
                                <thead>
                                  <tr>
                                    <th style={{ width: 40, textAlign: 'center' }}>No</th>
                                    <th>Nama Paket & Lokasi</th>
                                    <th>Tipe Pengadaan</th>
                                    <th>Rekanan Penyedia / CV</th>
                                    <th>Pagu & Nilai Kontrak</th>
                                    <th>Status Progres di Tahap Ini</th>
                                    <th style={{ textAlign: 'center' }}>Aksi</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {group.projects.map((p, idx) => {
                                    const stageKey = getProjectLifecycleStage(p);
                                    const stageObj = LIFECYCLE_STAGES.find((s) => s.id === stageKey);
                                    const canEdit = canEditProject(p);
                                    const fRealisasi = parseFloat(p.dataFisik?.progresRealisasi || 0);

                                    return (
                                      <tr key={p.id}>
                                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b' }}>
                                          {idx + 1}
                                        </td>

                                        {/* Nama Paket */}
                                        <td>
                                          <div style={{ fontWeight: 700, color: '#0f2c59', maxWidth: 300 }}>
                                            {p.namaPaket}
                                          </div>
                                          
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                                            <span
                                              style={{
                                                fontSize: 10,
                                                fontWeight: 800,
                                                padding: '2px 6px',
                                                borderRadius: 4,
                                                background: p.jenisAnggaran === 'Perubahan' ? '#fef3c7' : '#e0f2fe',
                                                color: p.jenisAnggaran === 'Perubahan' ? '#b45309' : '#0369a1',
                                                border: `1px solid ${p.jenisAnggaran === 'Perubahan' ? '#fde68a' : '#bae6fd'}`
                                              }}
                                            >
                                              {p.jenisAnggaran === 'Perubahan' ? 'APBD-P' : 'Murni'}
                                            </span>
                                            <span style={{ fontSize: 11, color: '#64748b' }}>
                                              RUP: <code>{p.kodeRUP || '-'}</code>
                                            </span>
                                            {p.subBagian && (
                                              <span style={{ fontSize: 10.5, color: '#64748b', fontStyle: 'italic' }}>
                                                ({p.subBagian})
                                              </span>
                                            )}
                                          </div>

                                          {/* Lokasi Desa & Kecamatan Demak */}
                                          {(p.desa || p.kecamatan) && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0369a1', marginTop: 4, fontWeight: 600 }}>
                                              <MapPin size={11} />
                                              <span>{p.desa ? `${p.desa}, ` : ''}Kec. {p.kecamatan || '-'}</span>
                                            </div>
                                          )}

                                          {p.tags && p.tags.length > 0 && (
                                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                                              {p.tags.map((tg, i) => (
                                                <span
                                                  key={i}
                                                  style={{
                                                    fontSize: 10,
                                                    background: 'rgba(37, 99, 235, 0.08)',
                                                    color: '#1d4ed8',
                                                    border: '1px solid rgba(37, 99, 235, 0.25)',
                                                    padding: '1px 6px',
                                                    borderRadius: 9999,
                                                    fontWeight: 600
                                                  }}
                                                >
                                                  🏷️ {tg}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </td>

                                        {/* Tipe Pengadaan */}
                                        <td>
                                          <span style={{ fontWeight: 600, fontSize: 12 }}>{p.tipePengadaan}</span>
                                          <div style={{ fontSize: 10.5, color: '#0284c7', marginTop: 2 }}>
                                            {p.sumberDana}
                                          </div>
                                        </td>

                                        {/* Rekanan Penyedia */}
                                        <td>
                                          <div style={{ fontWeight: 700, color: '#0f2c59', fontSize: 12.5 }}>
                                            {p.dataKontrak?.namaPenyedia || (
                                              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>
                                                Belum ada penyedia (Tahap {stageObj?.singkatan})
                                              </span>
                                            )}
                                          </div>
                                          {p.dataKontrak?.nomorKontrak && p.dataKontrak?.nomorKontrak !== '-' && (
                                            <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>
                                              SPK: {p.dataKontrak.nomorKontrak}
                                            </div>
                                          )}
                                        </td>

                                        {/* Pagu & Nilai */}
                                        <td>
                                          <div style={{ fontSize: 11.5, color: '#64748b' }}>
                                            Pagu: Rp {parseFloat(p.paguAnggaran || 0).toLocaleString('id-ID')}
                                          </div>
                                          {p.isKontrak && (
                                            <div style={{ fontWeight: 700, color: '#0284c7', fontSize: 12, marginTop: 2 }}>
                                              Kontrak: Rp {parseFloat(p.dataKontrak?.nilaiKontrak || 0).toLocaleString('id-ID')}
                                            </div>
                                          )}
                                        </td>

                                        {/* Status di Tahap Ini */}
                                        <td>
                                          {p.isKontrak ? (
                                            <div>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 12.5 }}>
                                                <span style={{ color: fRealisasi >= 100 ? '#0284c7' : '#059669' }}>
                                                  Fisik: {fRealisasi}%
                                                </span>
                                                <span className={`badge badge-${(p.dataFisik?.statusDeviasi || 'aman').toLowerCase()}`}>
                                                  {p.dataFisik?.statusDeviasi || 'Aman'}
                                                </span>
                                              </div>
                                              <div style={{ width: 110, height: 6, background: '#e2e8f0', borderRadius: 9999, marginTop: 4, overflow: 'hidden' }}>
                                                <div
                                                  style={{
                                                    width: `${Math.min(100, fRealisasi)}%`,
                                                    height: '100%',
                                                    background: fRealisasi >= 100 ? '#0284c7' : '#10b981',
                                                    borderRadius: 9999
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          ) : (
                                            <div>
                                              <span
                                                style={{
                                                  display: 'inline-block',
                                                  padding: '2px 8px',
                                                  borderRadius: 4,
                                                  background: stageObj?.bgLight || '#fef3c7',
                                                  color: stageObj?.warna || '#92400e',
                                                  fontSize: 11,
                                                  fontWeight: 700
                                                }}
                                              >
                                                {stageObj?.nama || 'Pra-Kontrak'}
                                              </span>
                                              <div style={{ fontSize: 11, color: '#475569', marginTop: 3, maxWidth: 200 }}>
                                                {p.tahapPraKontrak?.catatanPraKontrak || 'Sedang proses verifikasi'}
                                              </div>
                                            </div>
                                          )}
                                        </td>

                                        {/* Aksi */}
                                        <td style={{ textAlign: 'center' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                            <button
                                              className="btn btn-outline btn-sm"
                                              onClick={() => onViewProject(p)}
                                              title="Lihat Detail Lengkap"
                                            >
                                              <Eye size={13} />
                                              Detail
                                            </button>

                                            {canEdit && (
                                              <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => (p.isKontrak ? onQuickUpdate(p) : onOpenProjectModal(p))}
                                                title={p.isKontrak ? 'Update Progres Cepat' : 'Ubah Data / Terbitkan SPK'}
                                              >
                                                {p.isKontrak ? <Sliders size={13} /> : <Edit size={13} />}
                                                {p.isKontrak ? 'Update' : 'Edit'}
                                              </button>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>

                            {/* Sub-footer per Bidang */}
                            <div
                              style={{
                                padding: '10px 18px',
                                background: '#fafbfc',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: 12,
                                color: '#64748b'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Clock size={13} color="#0284c7" />
                                <span>Terakhir diupdate: <strong>{latestUpdateFormatted}</strong></span>
                              </div>
                              <div style={{ fontWeight: 600 }}>
                                Total <strong>{group.projects.length}</strong> pekerjaan pada {group.bidang.nama}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Footer Card Rekapitulasi dengan Time Stamp di Pojok Kiri Bawah */}
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
                  background: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 700
                }}
              >
                ● Live Data
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: 12 }}>
              Total <strong>{filteredProjects.length}</strong> paket pekerjaan tersaring dari <strong>{totalProjectsCount}</strong> total paket dinas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageProgressDiagram;
