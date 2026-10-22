import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, KECAMATAN_DEMAK, JENIS_ANGGARAN } from '../data/constants';
import DonutPieChart from '../components/DonutPieChart';
import {
  TrendingUp,
  Search,
  Filter,
  Eye,
  Sliders,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  Activity,
  Plus,
  MapPin,
  ExternalLink,
  Sparkles,
  Edit3,
  Trash2,
  Database
} from 'lucide-react';
import { getLatestProjectUpdateFormatted } from '../utils/dateUtils';

const PhysicalProgressView = ({ onViewProject, onQuickUpdate, onOpenProjectModal }) => {
  const {
    accessibleProjects,
    activeYear,
    canEditProject,
    canCreateProject,
    currentUser,
    deleteProject,
    togglePublicHighlight,
    setActiveTab,
    systemSettings
  } = useApp();

  const latestUpdateFormatted = getLatestProjectUpdateFormatted(accessibleProjects, activeYear);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedAnggaran, setSelectedAnggaran] = useState('ALL');

  // Only contract projects participate in physical monitoring (0-100%)
  const contractProjects = accessibleProjects.filter((p) => p.isKontrak);

  const filteredProjects = contractProjects.filter((p) => {
    // Bidang filter
    if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;

    // Status Deviasi filter
    if (selectedStatus !== 'ALL' && p.dataFisik?.statusDeviasi !== selectedStatus) return false;

    // Kecamatan filter
    if (selectedKecamatan !== 'ALL' && p.kecamatan !== selectedKecamatan) return false;

    // Jenis Anggaran filter (Murni / APBD-P)
    if (selectedAnggaran !== 'ALL') {
      if (selectedAnggaran === 'APBD-P' || selectedAnggaran === 'Perubahan') {
        if (p.jenisAnggaran !== 'APBD-P' && p.jenisAnggaran !== 'Perubahan') return false;
      } else if (p.jenisAnggaran !== selectedAnggaran) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.namaPaket?.toLowerCase().includes(q);
      const matchCV = p.dataKontrak?.namaPenyedia?.toLowerCase().includes(q);
      const matchNoKontrak = p.dataKontrak?.nomorKontrak?.toLowerCase().includes(q);
      const matchLokasi = p.lokasi?.toLowerCase().includes(q);
      const matchKec = p.kecamatan?.toLowerCase().includes(q);
      const matchDesa = p.desa?.toLowerCase().includes(q);
      if (!matchName && !matchCV && !matchNoKontrak && !matchLokasi && !matchKec && !matchDesa) return false;
    }

    return true;
  });

  // Summary counts for Status Deviasi Donut Chart
  const countAman = contractProjects.filter((p) => p.dataFisik?.statusDeviasi === 'Aman').length;
  const countPerhatian = contractProjects.filter((p) => p.dataFisik?.statusDeviasi === 'Perhatian').length;
  const countKritis = contractProjects.filter((p) => p.dataFisik?.statusDeviasi === 'Kritis').length;
  const countSelesai = contractProjects.filter((p) => (p.dataFisik?.progresRealisasi || 0) >= 100).length;

  const deviasiDonutData = [
    { label: 'Aman (≥ 0%)', value: countAman, color: '#16a34a', filterKey: 'Aman' },
    { label: 'Perhatian (-0.1% s/d -5%)', value: countPerhatian, color: '#d97706', filterKey: 'Perhatian' },
    { label: 'Kritis (< -5%)', value: countKritis, color: '#dc2626', filterKey: 'Kritis' },
    { label: 'Selesai (100%)', value: countSelesai, color: '#0284c7', filterKey: 'Selesai' }
  ];

  // Summary counts for Range Fisik Donut Chart
  const r1 = contractProjects.filter((p) => (p.dataFisik?.progresRealisasi || 0) <= 25).length;
  const r2 = contractProjects.filter((p) => (p.dataFisik?.progresRealisasi || 0) > 25 && (p.dataFisik?.progresRealisasi || 0) <= 50).length;
  const r3 = contractProjects.filter((p) => (p.dataFisik?.progresRealisasi || 0) > 50 && (p.dataFisik?.progresRealisasi || 0) < 100).length;
  const r4 = contractProjects.filter((p) => (p.dataFisik?.progresRealisasi || 0) >= 100).length;

  const rentangFisikDonutData = [
    { label: 'Tahap Awal (0% - 25%)', value: r1, color: '#94a3b8' },
    { label: 'Tahap Pertengahan (26% - 50%)', value: r2, color: '#0284c7' },
    { label: 'Tahap Lanjutan (51% - 99%)', value: r3, color: '#d97706' },
    { label: 'Tuntas Serah Terima (100%)', value: r4, color: '#10b981' }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Menu 2: Monitoring Progres Fisik Pekerjaan (0% - 100%)</h1>
          <p>
            {systemSettings?.customTexts?.internal_fisik_desc || `Pantau realisasi fisik lapangan vs target rencana, deviasi pekerjaan (Aman, Perhatian, Kritis), Kurva S, dan foto dokumentasi TA ${activeYear}`}
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => setActiveTab('master_pekerjaan')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, background: '#fff' }}
            title="Input dan registrasi data paket baru dilakukan di Master Data"
          >
            <Database size={15} color="#0284c7" />
            <span>Ke Master Data Pekerjaan</span>
          </button>
        </div>
      </div>

      {/* Visualisasi Diagram Lingkaran (Donut Charts) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        <DonutPieChart
          title="Diagram Lingkaran: Status Deviasi Fisik"
          subtitle="Distribusi deviasi progres fisik lapangan (Aman, Perhatian, Kritis, Selesai)"
          data={deviasiDonutData}
          centerLabel="Paket Terkontrak"
          onSegmentClick={(seg) => {
            setSelectedStatus((prev) => (prev === seg.filterKey ? 'ALL' : seg.filterKey));
          }}
          activeFilter={selectedStatus}
        />

        <DonutPieChart
          title="Diagram Lingkaran: Rentang Capaian Progres Fisik"
          subtitle="Tahapan pelaksanaan fisik 0% hingga serah terima 100%"
          data={rentangFisikDonutData}
          centerLabel="Total Paket"
        />
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          {/* Search */}
          <div className="search-input-wrap">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari paket, nomor kontrak, desa, rekanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Bidang Filter */}
          {currentUser.role !== 'koordinator' && currentUser.role !== 'kabid' && (
            <select
              className="select-filter"
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
            >
              <option value="ALL">Semua Bidang Dinas</option>
              {BIDANG_LIST.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.singkatan} - {b.nama}
                </option>
              ))}
            </select>
          )}

          {/* Kecamatan Demak Filter */}
          <select
            className="select-filter"
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
          >
            <option value="ALL">Semua Kecamatan (14 Kec)</option>
            {KECAMATAN_DEMAK.map((kec) => (
              <option key={kec} value={kec}>
                Kec. {kec}
              </option>
            ))}
          </select>

          {/* Jenis Anggaran Filter */}
          <select
            className="select-filter"
            value={selectedAnggaran}
            onChange={(e) => setSelectedAnggaran(e.target.value)}
          >
            <option value="ALL">Semua Jenis Anggaran</option>
            {JENIS_ANGGARAN.map((j) => (
              <option key={j} value={j}>
                {j === 'Murni' ? 'APBD Murni' : '(APBD-P) Perubahan'}
              </option>
            ))}
          </select>

          {/* Status Deviasi Filter */}
          <select
            className="select-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">Semua Status Deviasi</option>
            <option value="Aman">Aman (≥ 0%)</option>
            <option value="Perhatian">Perhatian (-0.1% s/d -5%)</option>
            <option value="Kritis">Kritis (&lt; -5%)</option>
            <option value="Selesai">Selesai (100%)</option>
          </select>
        </div>

        <div style={{ fontSize: 12.5, color: '#64748b' }}>
          Menampilkan: <strong>{filteredProjects.length} Paket Pekerjaan</strong>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Paket & Nomor Kontrak</th>
                  <th>Bidang & Rekanan (CV / PT)</th>
                  <th>Waktu Pelaksanaan</th>
                  <th>Rencana vs Realisasi Fisik (0-100%)</th>
                  <th>Deviasi (%)</th>
                  <th>Status & Dokumentasi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      Tidak ada paket pekerjaan fisik yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => {
                    const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                    const fRealisasi = parseFloat(p.dataFisik?.progresRealisasi || 0);
                    const fRencana = parseFloat(p.dataFisik?.progresRencana || 0);
                    const deviasi = parseFloat(p.dataFisik?.deviasiFisik || 0);
                    const status = p.dataFisik?.statusDeviasi || 'Aman';
                    const canEdit = canEditProject(p);
                    const fotoCount = p.dataFisik?.fotoDokumentasi?.length || 0;

                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: 4,
                                background: (p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '#fef3c7' : '#e0f2fe',
                                color: (p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '#b45309' : '#0369a1',
                                border: `1px solid ${(p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '#fde68a' : '#bae6fd'}`
                              }}
                            >
                              {(p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '(APBD-P)' : 'APBD Murni'}
                            </span>
                            {p.kecamatan && (
                              <span
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 600,
                                  padding: '2px 7px',
                                  borderRadius: 4,
                                  background: '#f1f5f9',
                                  color: '#334155',
                                  border: '1px solid #cbd5e1'
                                }}
                              >
                                Kec. {p.kecamatan} {p.desa ? `• Ds. ${p.desa}` : ''}
                              </span>
                            )}
                          </div>

                          <div style={{ fontWeight: 700, color: '#0f2c59', maxWidth: 300, fontSize: 13 }}>
                            {p.namaPaket}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            SPK: <strong>{p.dataKontrak?.nomorKontrak || '-'}</strong>
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            {p.lokasi || '-'}
                          </div>
                          {(p.latitude || p.koordinat?.lat) && (
                            <div style={{ marginTop: 3 }}>
                              <a
                                href={`https://www.google.com/maps?q=${p.latitude || p.koordinat?.lat},${p.longitude || p.koordinat?.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: 10.5,
                                  color: '#0284c7',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  textDecoration: 'none'
                                }}
                                title="Buka Titik Koordinat di Google Maps"
                              >
                                <MapPin size={11} color="#ef4444" />
                                <span>{p.latitude || p.koordinat?.lat}, {p.longitude || p.koordinat?.lng}</span>
                                <ExternalLink size={9} />
                              </a>
                            </div>
                          )}
                          {p.tags && p.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
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

                        <td>
                          <span
                            className="badge badge-bidang"
                            style={{ background: bidang?.bgLight, color: bidang?.warna }}
                          >
                            {bidang?.singkatan}
                          </span>
                          <div style={{ fontWeight: 700, color: '#0f2c59', fontSize: 12.5, marginTop: 4 }}>
                            {p.dataKontrak?.namaPenyedia || '-'}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            Pengawas: {p.dataKontrak?.konsultanPengawas || '-'}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>
                            {p.dataKontrak?.waktuPelaksanaan || '-'} Hari Kalender
                          </div>
                          <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>
                            {p.dataKontrak?.tanggalMulai || '-'} s/d {p.dataKontrak?.tanggalSelesai || '-'}
                          </div>
                        </td>

                        <td style={{ minWidth: 200 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                            <span>Target: <strong>{fRencana}%</strong></span>
                            <span>Realisasi: <strong style={{ color: fRealisasi >= 100 ? '#0284c7' : '#059669' }}>{fRealisasi}%</strong></span>
                          </div>
                          <div style={{ height: 8, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden', position: 'relative' }}>
                            {/* Rencana marker */}
                            <div
                              style={{
                                position: 'absolute',
                                left: `${Math.min(100, fRencana)}%`,
                                top: 0,
                                bottom: 0,
                                width: 2,
                                background: '#0284c7',
                                zIndex: 2
                              }}
                            />
                            {/* Realisasi bar */}
                            <div
                              style={{
                                width: `${Math.min(100, fRealisasi)}%`,
                                height: '100%',
                                background:
                                  fRealisasi >= 100
                                    ? 'linear-gradient(90deg, #0284c7, #38bdf8)'
                                    : deviasi < -5
                                    ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                                    : deviasi < 0
                                    ? 'linear-gradient(90deg, #d97706, #f59e0b)'
                                    : 'linear-gradient(90deg, #059669, #10b981)',
                                borderRadius: 9999
                              }}
                            />
                          </div>
                        </td>

                        <td>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: 14,
                              color: deviasi >= 0 ? '#16a34a' : deviasi < -5 ? '#dc2626' : '#d97706'
                            }}
                          >
                            {deviasi >= 0 ? `+${deviasi}%` : `${deviasi}%`}
                          </div>
                        </td>

                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span className={`badge badge-${status.toLowerCase()}`}>
                              {status === 'Selesai' ? 'Selesai 100%' : status}
                            </span>
                            {fotoCount > 0 ? (
                              <span style={{ fontSize: 10.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Camera size={12} />
                                {fotoCount} Foto Lapangan
                              </span>
                            ) : (
                              <span style={{ fontSize: 10.5, color: '#94a3b8' }}>Belum ada foto</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => onViewProject(p)}
                              title="Lihat Kurva S & Detail"
                            >
                              <Eye size={13} />
                              Kurva S
                            </button>

                            {canEdit && (
                              <>
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => onQuickUpdate(p)}
                                  title="Update Cepat Progres Fisik"
                                >
                                  <Sliders size={13} />
                                  Cepat
                                </button>

                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => onOpenProjectModal(p)}
                                  title="Ubah Semua Data Paket (Koordinat, Kontrak, dll)"
                                >
                                  <Edit3 size={13} />
                                  Ubah
                                </button>

                                <button
                                  type="button"
                                  onClick={() => togglePublicHighlight(p.id)}
                                  title={p.isPublicHighlight !== false ? 'Sedang tayang di Beranda Publik. Klik untuk sembunyikan' : 'Khusus internal. Klik untuk tampilkan di Beranda Publik'}
                                  style={{
                                    background: p.isPublicHighlight !== false ? '#fef3c7' : '#f8fafc',
                                    color: p.isPublicHighlight !== false ? '#b45309' : '#94a3b8',
                                    border: '1px solid',
                                    borderColor: p.isPublicHighlight !== false ? '#fde68a' : '#cbd5e1',
                                    borderRadius: 6,
                                    padding: '4px 7px',
                                    cursor: 'pointer',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3
                                  }}
                                >
                                  <Sparkles size={11} color={p.isPublicHighlight !== false ? '#d97706' : '#94a3b8'} />
                                  <span>{p.isPublicHighlight !== false ? 'Sorotan' : 'Internal'}</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  style={{ color: '#dc2626', borderColor: '#fecaca', padding: '4px 8px' }}
                                  title="Hapus Paket Pekerjaan dari Master Data"
                                  onClick={() => {
                                    if (window.confirm(`Hapus paket pekerjaan "${p.namaPaket}" dari Master Data?`)) {
                                      deleteProject(p.id);
                                    }
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
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

        {/* Footer Card Monitoring Progres Fisik dengan Time Stamp di Pojok Kiri Bawah */}
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
              ● Fisik Terpantau
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: 12 }}>
            Menampilkan <strong>{filteredProjects.length}</strong> dari <strong>{contractProjects.length}</strong> paket fisik terkontrak TA {activeYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalProgressView;
