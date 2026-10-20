import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';

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

  const totalProjectsCount = projects.length;

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
            Diagram tahapan siklus proyek mulai dari SiRUP, HPS, Pemilihan Penyedia (PBJ), SPPBJ, Fisik, hingga Selesai PHO 100%. <strong>Klik pada diagram atau kartu tahap untuk memfilter daftar pekerjaan di bawahnya.</strong>
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
              Proporsi Distribusi Tahapan Proyek ({totalProjectsCount} Total Pekerjaan):
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
                  : 'Menampilkan seluruh paket pekerjaan lintas tahapan siklus proyek dinas.'}
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

          {/* Data Table */}
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40, textAlign: 'center' }}>No</th>
                  <th>Nama Paket & Lokasi</th>
                  <th>Bidang & Seksi</th>
                  <th>Tipe Pengadaan</th>
                  <th>Rekanan Penyedia / CV</th>
                  <th>Pagu & Nilai Kontrak</th>
                  <th>Status Progres di Tahap Ini</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      <AlertCircle size={28} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                      <div>Tidak ada pekerjaan pada tahap ini yang sesuai dengan kriteria pencarian.</div>
                      {(selectedStage || selectedKecamatan !== 'ALL' || selectedAnggaran !== 'ALL' || selectedBidang !== 'ALL') && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setSelectedStage(null);
                            setSelectedBidang('ALL');
                            setSelectedKecamatan('ALL');
                            setSelectedAnggaran('ALL');
                            setSearchQuery('');
                          }}
                          style={{ marginTop: 12 }}
                        >
                          Reset Semua Filter
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p, idx) => {
                    const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
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
                          <div style={{ fontWeight: 700, color: '#0f2c59', maxWidth: 280 }}>
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

                        {/* Bidang */}
                        <td>
                          <span
                            className="badge badge-bidang"
                            style={{ background: bidang?.bgLight, color: bidang?.warna }}
                          >
                            {bidang?.singkatan}
                          </span>
                          {p.bidangId === 'sekretariat' && p.subBagian && (
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                              {p.subBagian}
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
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageProgressDiagram;
