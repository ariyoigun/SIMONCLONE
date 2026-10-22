import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, TIPE_PENGADAAN, TAHAPAN_PRA_KONTRAK, KECAMATAN_DEMAK, JENIS_ANGGARAN } from '../data/constants';
import DonutPieChart from '../components/DonutPieChart';
import {
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  FileCheck,
  Building,
  ArrowRight,
  MapPin,
  ExternalLink,
  Sparkles,
  Trash2,
  PieChart as PieChartIcon,
  Database,
  XCircle,
  Briefcase
} from 'lucide-react';
import { getLatestProjectUpdateFormatted } from '../utils/dateUtils';

const STAGE_COLORS = {
  sirup: '#0284c7',
  survei_lokasi: '#06b6d4',
  survei_harga: '#0ea5e9',
  perencanaan: '#3b82f6',
  kirim_lpse: '#6366f1',
  rpp: '#8b5cf6',
  revisi: '#ec4899',
  tayang: '#f59e0b',
  retender: '#f97316',
  pra_kontrak: '#10b981',
  kontrak: '#059669',
  batal: '#ef4444'
};

const PreContractView = ({ onOpenProjectModal, onViewProject }) => {
  const {
    accessibleProjects,
    activeYear,
    canCreateProject,
    canEditProject,
    currentUser,
    updateProject,
    deleteProject,
    togglePublicHighlight,
    setActiveTab,
    praKontrakStages = TAHAPAN_PRA_KONTRAK,
    kategoriPekerjaanList = [],
    systemSettings
  } = useApp();

  const latestUpdateFormatted = getLatestProjectUpdateFormatted(accessibleProjects, activeYear);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedKategori, setSelectedKategori] = useState('ALL');
  const [selectedTipe, setSelectedTipe] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedAnggaran, setSelectedAnggaran] = useState('ALL');

  // Filter projects (include both pre-contract AND projects that originated from pre-contract)
  const filteredProjects = accessibleProjects.filter((p) => {
    // Bidang filter
    if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;

    // Kategori Pekerjaan filter
    if (selectedKategori !== 'ALL' && p.kategoriPekerjaan !== selectedKategori) return false;

    // Tipe Pengadaan filter
    if (selectedTipe !== 'ALL' && p.tipePengadaan !== selectedTipe) return false;

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

    // Status filter
    if (selectedStatus === 'PRE_ONLY' && (p.isKontrak || p.statusDeviasi === 'Batal')) return false;
    if (selectedStatus === 'KONTRAK_ONLY' && !p.isKontrak) return false;
    if (selectedStatus === 'kontrak' && !p.isKontrak && p.tahapPraKontrak?.status !== 'kontrak') return false;
    if (selectedStatus === 'batal' && p.tahapPraKontrak?.status !== 'batal' && p.statusDeviasi !== 'Batal') return false;
    if (
      selectedStatus !== 'ALL' &&
      selectedStatus !== 'PRE_ONLY' &&
      selectedStatus !== 'KONTRAK_ONLY' &&
      selectedStatus !== 'kontrak' &&
      selectedStatus !== 'batal'
    ) {
      if (p.tahapPraKontrak?.status !== selectedStatus) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.namaPaket?.toLowerCase().includes(q);
      const matchKode = p.kodeRUP?.toLowerCase().includes(q);
      const matchLokasi = p.lokasi?.toLowerCase().includes(q);
      const matchKec = p.kecamatan?.toLowerCase().includes(q);
      const matchDesa = p.desa?.toLowerCase().includes(q);
      const matchPenyedia = p.dataKontrak?.namaPenyedia?.toLowerCase().includes(q);
      if (!matchName && !matchKode && !matchLokasi && !matchPenyedia && !matchKec && !matchDesa) return false;
    }

    return true;
  });

  // Dynamic Data for Donut Chart 1: Tahapan Pra-Kontrak (12 Tahap)
  const allStagesData = praKontrakStages.map((stage) => {
    let count = 0;
    if (stage.id === 'kontrak') {
      count = accessibleProjects.filter((p) => p.isKontrak || p.tahapPraKontrak?.status === 'kontrak').length;
    } else if (stage.id === 'batal') {
      count = accessibleProjects.filter(
        (p) => p.tahapPraKontrak?.status === 'batal' || p.statusDeviasi === 'Batal'
      ).length;
    } else {
      count = accessibleProjects.filter(
        (p) => !p.isKontrak && p.tahapPraKontrak?.status === stage.id && p.statusDeviasi !== 'Batal'
      ).length;
    }
    return {
      label: stage.label,
      value: count,
      color: STAGE_COLORS[stage.id] || '#64748b',
      filterKey: stage.id
    };
  });

  const activeStageDonutData = allStagesData.filter((item) => item.value > 0);
  const stageDonutData = activeStageDonutData.length > 0 ? activeStageDonutData : allStagesData.slice(0, 5);

  // Data for Donut Chart 2: Jenis Anggaran (Murni vs APBD-P)
  const countMurni = accessibleProjects.filter((p) => (p.jenisAnggaran || 'Murni') === 'Murni').length;
  const countPerubahan = accessibleProjects.filter((p) => p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan').length;

  const anggaranDonutData = [
    { label: 'APBD Murni (Awal Tahun)', value: countMurni, color: '#0284c7', filterKey: 'Murni' },
    { label: '(APBD-P) Perubahan', value: countPerubahan, color: '#d97706', filterKey: 'APBD-P' }
  ];

  // Pre-contract counts
  const countPre = accessibleProjects.filter((p) => !p.isKontrak).length;
  const countTender = accessibleProjects.filter((p) => !p.isKontrak && p.tipePengadaan?.includes('Tender')).length;
  const countPL = accessibleProjects.filter((p) => !p.isKontrak && p.tipePengadaan?.includes('Pengadaan Langsung')).length;
  const countEkat = accessibleProjects.filter((p) => !p.isKontrak && p.tipePengadaan?.includes('Katalog')).length;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Menu 1: Monitoring Pekerjaan Sebelum Kontrak (Pra-Kontrak)</h1>
          <p>
            {systemSettings?.customTexts?.internal_prakontrak_desc || `Pantau seluruh paket pekerjaan dari perencanaan SiRUP, penyusunan HPS, proses tender/seleksi, Pengadaan Langsung (PL), hingga Minikompetisi E-Katalog TA ${activeYear}`}
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
          title="Diagram Lingkaran: Sebaran Tahapan Pengadaan"
          subtitle="Distribusi paket dari perencanaan SiRUP hingga terbit kontrak"
          data={stageDonutData}
          centerLabel="Total Paket"
          onSegmentClick={(seg) => {
            setSelectedStatus((prev) => (prev === seg.filterKey ? 'ALL' : seg.filterKey));
          }}
          activeFilter={selectedStatus}
        />

        <DonutPieChart
          title="Diagram Lingkaran: Jenis Anggaran (Murni vs APBD-P)"
          subtitle="Proporsi paket APBD Murni awal tahun vs (APBD-P) Perubahan"
          data={anggaranDonutData}
          centerLabel="Paket"
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
          <div className="search-input-wrap">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari paket, desa, kecamatan, RUP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Bidang Filter (if allowed) */}
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

          {/* Kategori Pekerjaan Filter */}
          <select
            className="select-filter"
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
          >
            <option value="ALL">Semua Kategori (Fisik, Jakon, dll)</option>
            {kategoriPekerjaanList.map((kat) => (
              <option key={kat.id} value={kat.nama}>
                {kat.nama}
              </option>
            ))}
          </select>

          {/* Tipe Pengadaan Filter */}
          <select
            className="select-filter"
            value={selectedTipe}
            onChange={(e) => setSelectedTipe(e.target.value)}
          >
            <option value="ALL">Semua Tipe Pengadaan</option>
            {TIPE_PENGADAAN.map((tipe, idx) => (
              <option key={idx} value={tipe}>
                {tipe}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="select-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">Semua Status Pra-Kontrak (12 Tahap)</option>
            <option value="PRE_ONLY">Hanya Yang Belum Kontrak</option>
            <option value="KONTRAK_ONLY">Sudah Terbit Kontrak</option>
            {praKontrakStages.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: 12.5, color: '#64748b' }}>
          Menampilkan: <strong>{filteredProjects.length} Paket</strong>
        </div>
      </div>

      {/* Main Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Paket & Lokasi</th>
                  <th>Bidang & Sub Bagian</th>
                  <th>Kategori & Pengadaan</th>
                  <th>Pagu & HPS (Rp)</th>
                  <th>Tahapan Pra-Kontrak</th>
                  <th>Jadwal / Catatan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      Tidak ada pekerjaan pra-kontrak yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => {
                    const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                    const praKontrak = p.tahapPraKontrak || {};
                    const canEdit = canEditProject(p);

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
                          <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 3 }}>
                            {p.lokasi || '-'} • RUP: <code>{p.kodeRUP || '-'}</code>
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
                          {p.bidangId === 'sekretariat' && p.subBagian && (
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                              {p.subBagian}
                            </div>
                          )}
                        </td>

                        <td>
                          {p.kategoriPekerjaan && (
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: 10,
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: 4,
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                marginBottom: 4
                              }}
                            >
                              {p.kategoriPekerjaan}
                            </span>
                          )}
                          <div style={{ fontWeight: 600, color: '#0f2c59' }}>{p.tipePengadaan}</div>
                          <div style={{ fontSize: 11, color: '#0284c7', marginTop: 2 }}>
                            {p.sumberDana}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 700, color: '#0f2c59' }}>
                            Rp {parseFloat(p.paguAnggaran || 0).toLocaleString('id-ID')}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            HPS: Rp {parseFloat(p.hps || 0).toLocaleString('id-ID')}
                          </div>
                        </td>

                        <td>
                          {p.tahapPraKontrak?.status === 'batal' || p.statusDeviasi === 'Batal' ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '4px 8px',
                                borderRadius: 4,
                                background: '#fee2e2',
                                color: '#991b1b',
                                border: '1px solid #fecaca',
                                fontSize: 11.5,
                                fontWeight: 800
                              }}
                            >
                              <XCircle size={12} />
                              12. Batal Pelaksanaan
                            </span>
                          ) : p.isKontrak || p.tahapPraKontrak?.status === 'kontrak' ? (
                            <div>
                              <span className="badge badge-selesai" style={{ gap: 4, marginBottom: 4 }}>
                                <CheckCircle size={12} />
                                11. Sudah Kontrak
                              </span>
                              {p.dataKontrak?.tanggalMulai && (
                                <div style={{ fontSize: 10.5, color: '#059669', fontWeight: 600 }}>
                                  Mulai: {p.dataKontrak.tanggalMulai}
                                </div>
                              )}
                              {p.dataKontrak?.tanggalSelesai && (
                                <div style={{ fontSize: 10.5, color: '#047857' }}>
                                  Akhir: {p.dataKontrak.tanggalSelesai}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '4px 9px',
                                  borderRadius: 4,
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  border: '1px solid #fde68a',
                                  fontSize: 11.5,
                                  fontWeight: 700
                                }}
                              >
                                {praKontrakStages.find((t) => t.id === praKontrak.status)?.label ||
                                  praKontrak.status ||
                                  'Proses Persiapan'}
                              </span>
                            </div>
                          )}
                        </td>

                        <td>
                          <div style={{ fontSize: 11.5, color: '#475569', maxWidth: 220 }}>
                            {praKontrak.catatanPraKontrak || '-'}
                          </div>
                          {praKontrak.targetMulaiTender && (
                            <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 3 }}>
                              Target: {praKontrak.targetMulaiTender} s/d {praKontrak.targetSelesaiTender || '-'}
                            </div>
                          )}
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => onViewProject(p)}
                              title="Detail"
                            >
                              <Eye size={13} />
                              Detail
                            </button>

                            {canEdit && (
                              <>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => onOpenProjectModal(p)}
                                  title="Ubah Data / Terbitkan Kontrak"
                                >
                                  <Edit size={13} />
                                  {p.isKontrak ? 'Edit' : 'SPK/Kontrak'}
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

        {/* Footer Card Monitoring Pra-Kontrak dengan Time Stamp di Pojok Kiri Bawah */}
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
              ● Pra-Kontrak SiRUP/PBJ
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: 12 }}>
            Menampilkan <strong>{filteredProjects.length}</strong> dari <strong>{preContractProjects.length}</strong> paket dalam tahapan pra-kontrak TA {activeYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreContractView;
