import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, KECAMATAN_DEMAK, JENIS_ANGGARAN } from '../data/constants';
import DonutPieChart from '../components/DonutPieChart';
import {
  DollarSign,
  Search,
  Filter,
  Eye,
  Plus,
  CreditCard,
  Building2,
  TrendingUp,
  Receipt,
  FileCheck,
  Edit3,
  Trash2,
  PieChart as PieChartIcon,
  Database,
  Clock
} from 'lucide-react';
import { getLatestProjectUpdateFormatted } from '../utils/dateUtils';

const FinancialProgressView = ({ onViewProject, onQuickUpdate, onOpenProjectModal }) => {
  const {
    accessibleProjects,
    activeYear,
    canEditProject,
    canCreateProject,
    currentUser,
    deleteProject,
    setActiveTab,
    systemSettings
  } = useApp();

  const latestUpdateFormatted = getLatestProjectUpdateFormatted(accessibleProjects, activeYear);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedAnggaran, setSelectedAnggaran] = useState('ALL');

  // Filter to contract projects (or show all with pagu)
  const contractProjects = accessibleProjects.filter((p) => p.isKontrak);

  const filteredProjects = contractProjects.filter((p) => {
    // Bidang filter
    if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;

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
      const matchKec = p.kecamatan?.toLowerCase().includes(q);
      const matchDesa = p.desa?.toLowerCase().includes(q);
      const matchSP2D = p.dataKeuangan?.terminHistory?.some((t) =>
        t.nomorSP2D?.toLowerCase().includes(q)
      );
      if (!matchName && !matchCV && !matchSP2D && !matchKec && !matchDesa) return false;
    }

    return true;
  });

  // Financial aggregates
  const totalPagu = filteredProjects.reduce(
    (sum, p) => sum + (parseFloat(p.paguAnggaran) || 0),
    0
  );
  const totalKontrak = filteredProjects.reduce(
    (sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0),
    0
  );
  const totalPencairan = filteredProjects.reduce(
    (sum, p) => sum + (parseFloat(p.dataKeuangan?.totalPencairan) || 0),
    0
  );
  const totalSisa = Math.max(0, totalKontrak - totalPencairan);
  const persenPenyerapan = totalKontrak > 0 ? ((totalPencairan / totalKontrak) * 100).toFixed(1) : 0;

  // Donut Chart 1 Data: Realisasi SP2D vs Sisa Kontrak
  const penyerapanDonutData = [
    { label: 'Realisasi Pencairan (SP2D)', value: totalPencairan, color: '#16a34a' },
    { label: 'Sisa Belum Cair', value: totalSisa, color: '#d97706' }
  ];

  // Donut Chart 2 Data: Pagu APBD Murni vs Perubahan
  const paguMurni = contractProjects
    .filter((p) => (p.jenisAnggaran || 'Murni') === 'Murni')
    .reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);

  const paguPerubahan = contractProjects
    .filter((p) => p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan')
    .reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);

  const paguDonutData = [
    { label: 'Pagu APBD Murni', value: paguMurni, color: '#0284c7', filterKey: 'Murni' },
    { label: 'Pagu (APBD-P)', value: paguPerubahan, color: '#d97706', filterKey: 'APBD-P' }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Menu 3: Monitoring Progres Keuangan & Pencairan SP2D</h1>
          <p>
            {systemSettings?.customTexts?.internal_keuangan_desc || `Monitor realisasi pencairan anggaran, pagu, nilai kontrak, nama rekanan (CV/PT), termin SP2D tim keuangan, dan sisa pagu TA ${activeYear}`}
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

      {/* Visualisasi Diagram Lingkaran (Donut Charts Keuangan) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        <DonutPieChart
          title="Diagram Lingkaran: Realisasi SP2D vs Sisa Kontrak"
          subtitle="Penyerapan anggaran pencairan SP2D oleh tim keuangan"
          data={penyerapanDonutData}
          isCurrency={true}
          centerLabel="Total Kontrak"
        />

        <DonutPieChart
          title="Diagram Lingkaran: Proporsi Pagu (Murni vs APBD-P)"
          subtitle="Alokasi pagu APBD Murni awal tahun vs (APBD-P) Perubahan"
          data={paguDonutData}
          isCurrency={true}
          centerLabel="Pagu Terkontrak"
          onSegmentClick={(seg) => {
            setSelectedAnggaran((prev) => (prev === seg.filterKey ? 'ALL' : seg.filterKey));
          }}
          activeFilter={selectedAnggaran}
        />
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          {/* Search */}
          <div className="search-input-wrap" style={{ minWidth: 260 }}>
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari CV rekanan, paket, desa, SP2D..."
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
        </div>

        <div style={{ fontSize: 12.5, color: '#64748b' }}>
          Menampilkan: <strong>{filteredProjects.length} Rekanan & Pekerjaan</strong>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Rekanan (CV / PT)</th>
                  <th>Paket Pekerjaan & Bidang</th>
                  <th>Pagu & Nilai Kontrak (Rp)</th>
                  <th>Realisasi Pencairan (SP2D)</th>
                  <th>Sisa Anggaran (Rp)</th>
                  <th>Fisik vs Keuangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      Tidak ada data keuangan pekerjaan yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => {
                    const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                    const kNilai = parseFloat(p.dataKontrak?.nilaiKontrak || 0);
                    const kCair = parseFloat(p.dataKeuangan?.totalPencairan || 0);
                    const kPersen = p.dataKeuangan?.persenKeuangan || 0;
                    const sisa = Math.max(0, kNilai - kCair);
                    const fRealisasi = parseFloat(p.dataFisik?.progresRealisasi || 0);
                    const canEdit = canEditProject(p);
                    const terminList = p.dataKeuangan?.terminHistory || [];
                    const lastTermin = terminList.length > 0 ? terminList[terminList.length - 1] : null;

                    return (
                      <tr key={p.id}>
                        {/* CV Rekanan */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                background: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0f2c59',
                                flexShrink: 0
                              }}
                            >
                              <Building2 size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: '#0f2c59', fontSize: 13.5 }}>
                                {p.dataKontrak?.namaPenyedia || '-'}
                              </div>
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                NPWP: {p.dataKontrak?.npwpPenyedia || '-'}
                              </div>
                              <div style={{ fontSize: 10.5, color: '#94a3b8' }}>
                                Bank: {p.dataKontrak?.bankPenyedia || '-'} ({p.dataKontrak?.nomorRekening || '-'})
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Nama Paket & Lokasi */}
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

                          <div style={{ fontWeight: 700, color: '#0f2c59', maxWidth: 260, fontSize: 13 }}>
                            {p.namaPaket}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <span
                              className="badge badge-bidang"
                              style={{ background: bidang?.bgLight, color: bidang?.warna }}
                            >
                              {bidang?.singkatan}
                            </span>
                            <span style={{ fontSize: 11, color: '#64748b' }}>
                              SPK: {p.dataKontrak?.nomorKontrak || '-'}
                            </span>
                          </div>
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

                        {/* Pagu vs Kontrak */}
                        <td>
                          <div style={{ fontSize: 11.5, color: '#64748b' }}>
                            Pagu: Rp {parseFloat(p.paguAnggaran || 0).toLocaleString('id-ID')}
                          </div>
                          <div style={{ fontWeight: 800, color: '#0284c7', fontSize: 13, marginTop: 2 }}>
                            Kontrak: Rp {kNilai.toLocaleString('id-ID')}
                          </div>
                        </td>

                        {/* Realisasi Cair */}
                        <td>
                          <div style={{ fontWeight: 800, color: '#16a34a', fontSize: 13.5 }}>
                            Rp {kCair.toLocaleString('id-ID')}
                          </div>
                          <div style={{ fontSize: 11.5, color: '#d97706', fontWeight: 700, marginTop: 2 }}>
                            {kPersen}% Terbayar ({terminList.length} SP2D)
                          </div>
                          {lastTermin && (
                            <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>
                              Terakhir: {lastTermin.terminKe}
                            </div>
                          )}
                        </td>

                        {/* Sisa */}
                        <td>
                          <div style={{ fontWeight: 700, color: '#b45309', fontSize: 13 }}>
                            Rp {sisa.toLocaleString('id-ID')}
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                            {kNilai > 0 ? ((sisa / kNilai) * 100).toFixed(1) : 0}% Belum Cair
                          </div>
                        </td>

                        {/* Fisik vs Keuangan comparison */}
                        <td style={{ minWidth: 150 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4 }}>
                            <span>Fisik: <strong style={{ color: '#059669' }}>{fRealisasi}%</strong></span>
                            <span>Uang: <strong style={{ color: '#d97706' }}>{kPersen}%</strong></span>
                          </div>
                          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${Math.min(100, kPersen)}%`,
                                height: '100%',
                                background: '#d97706',
                                borderRadius: 9999
                              }}
                            />
                          </div>
                          <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 3 }}>
                            {fRealisasi >= kPersen ? (
                              <span style={{ color: '#16a34a' }}>✓ Fisik mendahului SP2D</span>
                            ) : (
                              <span style={{ color: '#d97706' }}>⚠ Pencairan mendahului fisik</span>
                            )}
                          </div>
                        </td>

                        {/* Aksi */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => onViewProject(p)}
                              title="Rincian SP2D & Riwayat"
                            >
                              <Receipt size={13} />
                              SP2D
                            </button>

                            {canEdit && (
                              <>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => onQuickUpdate(p)}
                                  title="Catat Termin Pencairan Baru"
                                >
                                  <Plus size={13} />
                                  Cairkan
                                </button>

                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => onOpenProjectModal(p)}
                                  title="Ubah Semua Data Paket Pekerjaan"
                                >
                                  <Edit3 size={13} />
                                  Ubah
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

        {/* Footer Card Monitoring Keuangan dengan Time Stamp di Pojok Kiri Bawah */}
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
                background: '#fef3c7',
                color: '#d97706',
                fontWeight: 700
              }}
            >
              ● SP2D Terintegrasi
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: 12 }}>
            Menampilkan <strong>{filteredProjects.length}</strong> dari <strong>{contractProjects.length}</strong> paket SP2D keuangan terkontrak TA {activeYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialProgressView;
