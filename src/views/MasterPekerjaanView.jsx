import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, KECAMATAN_DEMAK, JENIS_ANGGARAN } from '../data/constants';
import {
  Database,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Tag,
  MapPin,
  ExternalLink,
  Star,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  AlertCircle,
  Building2,
  Layers
} from 'lucide-react';
import { getLatestProjectUpdateFormatted } from '../utils/dateUtils';

const MasterPekerjaanView = ({ onOpenProjectModal, onViewProject }) => {
  const {
    accessibleProjects,
    activeYear,
    currentUser,
    canCreateProject,
    canEditProject,
    deleteProject,
    togglePublicHighlight,
    tags: masterTags = [],
    kategoriPekerjaanList = []
  } = useApp();

  const latestUpdateFormatted = getLatestProjectUpdateFormatted(accessibleProjects, activeYear);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedKategori, setSelectedKategori] = useState('ALL');
  const [selectedAnggaran, setSelectedAnggaran] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedKontrakStatus, setSelectedKontrakStatus] = useState('ALL');
  const [selectedHighlightOnly, setSelectedHighlightOnly] = useState(false);

  // Filtered dataset
  const filteredProjects = useMemo(() => {
    return accessibleProjects.filter((p) => {
      // Bidang
      if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;

      // Kategori Pekerjaan
      if (selectedKategori !== 'ALL' && p.kategoriPekerjaan !== selectedKategori) return false;

      // Jenis Anggaran (Murni vs APBD-P)
      if (selectedAnggaran !== 'ALL') {
        if (selectedAnggaran === 'APBD-P' || selectedAnggaran === 'Perubahan') {
          if (p.jenisAnggaran !== 'APBD-P' && p.jenisAnggaran !== 'Perubahan') return false;
        } else if (p.jenisAnggaran !== selectedAnggaran) {
          return false;
        }
      }

      // Tagging
      if (selectedTag !== 'ALL') {
        const pTags = p.tags || [];
        if (!pTags.includes(selectedTag)) return false;
      }

      // Kecamatan
      if (selectedKecamatan !== 'ALL' && p.kecamatan !== selectedKecamatan) return false;

      // Status Kontrak
      if (selectedKontrakStatus === 'KONTRAK' && !p.isKontrak) return false;
      if (selectedKontrakStatus === 'PRA_KONTRAK' && p.isKontrak) return false;

      // Highlight Only
      if (selectedHighlightOnly && p.isPublicHighlight === false) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.namaPaket?.toLowerCase().includes(q);
        const matchId = p.id?.toLowerCase().includes(q);
        const matchVendor = p.dataKontrak?.namaPenyedia?.toLowerCase().includes(q);
        const matchDesa = p.desa?.toLowerCase().includes(q);
        const matchKec = p.kecamatan?.toLowerCase().includes(q);
        const matchNoSPK = p.dataKontrak?.nomorKontrak?.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchVendor && !matchDesa && !matchKec && !matchNoSPK) {
          return false;
        }
      }

      return true;
    });
  }, [
    accessibleProjects,
    selectedBidang,
    selectedAnggaran,
    selectedTag,
    selectedKecamatan,
    selectedKontrakStatus,
    selectedHighlightOnly,
    searchQuery
  ]);

  // Aggregate Metrics for Header
  const totalCount = accessibleProjects.length;
  const countMurni = accessibleProjects.filter((p) => (p.jenisAnggaran || 'Murni') === 'Murni').length;
  const countPerubahan = accessibleProjects.filter((p) => p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan').length;
  const countKontrak = accessibleProjects.filter((p) => p.isKontrak).length;
  const countPra = totalCount - countKontrak;
  const totalPagu = accessibleProjects.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
  const countHighlight = accessibleProjects.filter((p) => p.isPublicHighlight !== false).length;

  const handleDelete = (project) => {
    if (!canEditProject(project)) {
      alert('Anda tidak memiliki wewenang untuk menghapus paket ini.');
      return;
    }
    if (
      window.confirm(
        `Yakin ingin menghapus paket "${project.namaPaket}" dari Master Data? Data di seluruh modul monitoring juga akan terhapus.`
      )
    ) {
      deleteProject(project.id);
    }
  };

  return (
    <div>
      {/* 1. Page Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0f2c59, #1e40af)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(15, 44, 89, 0.2)'
              }}
            >
              <Database size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, margin: 0 }}>Master Data Pekerjaan (Basis Data Induk)</h1>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b' }}>
                Pusat registrasi dan manajemen data dasar seluruh paket pekerjaan DINPUTARU TA {activeYear} (Terintegrasi ke 4 Menu Monitoring)
              </p>
            </div>
          </div>
        </div>

        <div className="page-header-actions">
          {canCreateProject() && (
            <button
              className="btn btn-primary"
              onClick={() => onOpenProjectModal(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(15, 44, 89, 0.25)'
              }}
            >
              <Plus size={16} />
              <span>Registrasi Paket Pekerjaan Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Single Source of Truth Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
          border: '1.5px solid #bfdbfe',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#2563eb',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Layers size={18} />
        </div>
        <div style={{ flex: 1, fontSize: 13, color: '#1e3a8a', lineHeight: 1.55 }}>
          <strong>Arsitektur Single Source of Truth (Data Induk Tunggal):</strong> Setiap bidang cukup menginput data pekerjaan <strong>satu kali</strong> di menu Master Data ini. Data otomatis terdistribusi ke:
          <span style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap', marginTop: 4, marginLeft: 6 }}>
            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '1px 8px', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
              1. Pra-Kontrak
            </span>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '1px 8px', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
              2. Progres Fisik
            </span>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '1px 8px', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
              3. Progres Keuangan
            </span>
            <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '1px 8px', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
              4. Administrasi SPJ
            </span>
          </span>
        </div>
      </div>

      {/* 3. Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 24
        }}
      >
        {/* Card 1: Total */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>TOTAL PAKET TERDAFTAR</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#0f2c59', marginTop: 2 }}>{totalCount} Paket</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Tahun Anggaran {activeYear}</div>
          </div>
        </div>

        {/* Card 2: Murni vs Perubahan */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>KLASIFIKASI ANGGARAN</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0f2c59', marginTop: 2 }}>
              <span style={{ color: '#0284c7' }}>{countMurni} Murni</span> • <span style={{ color: '#d97706' }}>{countPerubahan} (APBD-P)</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>APBD Induk & (APBD-P)</div>
          </div>
        </div>

        {/* Card 3: Status Kontrak */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>STATUS KONTRAK</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0f2c59', marginTop: 2 }}>
              <span style={{ color: '#16a34a' }}>{countKontrak} Kontrak</span> • <span style={{ color: '#f59e0b' }}>{countPra} Pra</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Pelaksanaan vs Pemilihan</div>
          </div>
        </div>

        {/* Card 4: Total Pagu */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>TOTAL PAGU ANGGARAN</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0f2c59', marginTop: 2 }}>
              Rp {(totalPagu / 1e9).toFixed(2)} M
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Rp {totalPagu.toLocaleString('id-ID')}</div>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Bar */}
      <div className="table-controls" style={{ marginBottom: 18 }}>
        <div className="search-filter-group" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          {/* Search Box */}
          <div className="search-box" style={{ minWidth: 260 }}>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Cari kode, paket, CV rekanan, desa, SPK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Bidang */}
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

          {/* Filter Kategori Pekerjaan */}
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

          {/* Filter Jenis Anggaran (Murni vs Perubahan) */}
          <select
            className="select-filter"
            value={selectedAnggaran}
            onChange={(e) => setSelectedAnggaran(e.target.value)}
          >
            <option value="ALL">Semua Label Anggaran</option>
            {JENIS_ANGGARAN.map((j) => (
              <option key={j} value={j}>
                {j === 'Murni' ? 'APBD Murni' : '(APBD-P) Perubahan'}
              </option>
            ))}
          </select>

          {/* Filter Tagging Prioritas */}
          <select
            className="select-filter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="ALL">Semua Tagging Program</option>
            {masterTags.map((t, idx) => (
              <option key={idx} value={t}>
                Tag: {t}
              </option>
            ))}
          </select>

          {/* Filter Kecamatan Demak */}
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

          {/* Filter Status Kontrak */}
          <select
            className="select-filter"
            value={selectedKontrakStatus}
            onChange={(e) => setSelectedKontrakStatus(e.target.value)}
          >
            <option value="ALL">Semua Status Kontrak</option>
            <option value="KONTRAK">Sudah Kontrak (Fisik Berjalan)</option>
            <option value="PRA_KONTRAK">Belum Kontrak (Pra-Kontrak)</option>
          </select>

          {/* Toggle Sorotan Publik */}
          <button
            type="button"
            className={`btn ${selectedHighlightOnly ? 'btn-primary' : 'btn-outline'}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              padding: '8px 12px'
            }}
            onClick={() => setSelectedHighlightOnly(!selectedHighlightOnly)}
          >
            <Star size={13} fill={selectedHighlightOnly ? '#f59e0b' : 'none'} color={selectedHighlightOnly ? '#f59e0b' : '#64748b'} />
            <span>{selectedHighlightOnly ? 'Hanya Sorotan Publik' : 'Filter Sorotan Publik'}</span>
          </button>
        </div>

        <div style={{ fontSize: 12.5, color: '#64748b' }}>
          Menampilkan: <strong>{filteredProjects.length} Paket</strong> dari total {totalCount} paket
        </div>
      </div>

      {/* 5. Master Data Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 140 }}>Kode & Klasifikasi</th>
                  <th>Nama Paket Pekerjaan & Bidang</th>
                  <th>Lokasi (Kecamatan & Desa)</th>
                  <th>Pagu & Sumber Dana</th>
                  <th>Rekanan & No. SPK</th>
                  <th style={{ textAlign: 'center' }}>Sinkronisasi 4 Modul</th>
                  <th style={{ textAlign: 'center', width: 90 }}>Sorotan Publik</th>
                  <th style={{ textAlign: 'center', width: 120 }}>Aksi Master</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '48px 24px', color: '#94a3b8' }}>
                      <Database size={36} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0f2c59' }}>Tidak ada data pekerjaan yang cocok</div>
                      <div style={{ fontSize: 13, marginTop: 4 }}>
                        Coba sesuaikan kata kunci pencarian atau filter yang dipilih.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => {
                    const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                    const kNilai = parseFloat(p.dataKontrak?.nilaiKontrak || 0);
                    const kFisik = parseFloat(p.dataFisik?.progresRealisasi || 0);
                    const kKeuangan = parseFloat(p.dataKeuangan?.persenKeuangan || 0);
                    const lat = p.latitude;
                    const lng = p.longitude;

                    return (
                      <tr key={p.id}>
                        {/* Kode & Label Anggaran */}
                        <td>
                          <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 12, color: '#0f2c59' }}>
                            {p.id}
                          </div>
                          <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: 4,
                                background: (p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '#fef3c7' : '#e0f2fe',
                                color: (p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '#b45309' : '#0369a1',
                                border: `1px solid ${(p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '#fde68a' : '#bae6fd'}`
                              }}
                            >
                              {(p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan') ? '(APBD-P)' : 'Murni'}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: 4,
                                background: p.isKontrak ? '#dcfce7' : '#fffbeb',
                                color: p.isKontrak ? '#15803d' : '#b45309',
                                border: `1px solid ${p.isKontrak ? '#bbf7d0' : '#fef3c7'}`
                              }}
                            >
                              {p.isKontrak ? 'Kontrak' : 'Pra'}
                            </span>
                          </div>
                        </td>

                        {/* Nama Paket & Bidang */}
                        <td style={{ minWidth: 260 }}>
                          <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0f2c59', marginBottom: 4, lineHeight: 1.4 }}>
                            {p.namaPaket}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#64748b' }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: bidang?.warna || '#64748b',
                                display: 'inline-block'
                              }}
                            />
                            <strong>{bidang?.singkatan}</strong>{p.bidangId === 'sekretariat' && p.subBagian ? ` • ${p.subBagian}` : ''}
                          </div>

                          {/* Tagging pills */}
                          {p.tags && p.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                              {p.tags.map((t, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    padding: '1px 6px',
                                    borderRadius: 3,
                                    background: '#f1f5f9',
                                    color: '#475569',
                                    border: '1px solid #e2e8f0'
                                  }}
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Lokasi (Kecamatan & Desa) */}
                        <td style={{ minWidth: 170 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, fontSize: 12, color: '#0f172a' }}>
                            <MapPin size={13} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <div style={{ fontWeight: 700 }}>Kec. {p.kecamatan || 'Demak'}</div>
                              <div style={{ color: '#64748b', fontSize: 11.5 }}>Desa {p.desa || '-'}</div>
                            </div>
                          </div>

                          {lat && lng && (
                            <a
                              href={`https://www.google.com/maps?q=${lat},${lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 10.5,
                                color: '#0284c7',
                                textDecoration: 'none',
                                marginTop: 4,
                                fontWeight: 700
                              }}
                            >
                              <span>Buka Maps</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </td>

                        {/* Pagu & Sumber Dana */}
                        <td style={{ minWidth: 160 }}>
                          <div style={{ fontSize: 11, color: '#64748b' }}>Pagu Anggaran:</div>
                          <div style={{ fontWeight: 800, fontSize: 13, color: '#0f2c59' }}>
                            Rp {parseFloat(p.paguAnggaran || 0).toLocaleString('id-ID')}
                          </div>
                          <div style={{ fontSize: 11, color: '#0284c7', fontWeight: 600, marginTop: 2 }}>
                            {p.sumberDana || 'APBD'}
                          </div>
                          <div style={{ marginTop: 3 }}>
                            {p.kategoriPekerjaan && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '1px 6px',
                                  borderRadius: 3,
                                  background: '#eff6ff',
                                  color: '#1d4ed8',
                                  border: '1px solid #bfdbfe',
                                  marginRight: 4
                                }}
                              >
                                {p.kategoriPekerjaan}
                              </span>
                            )}
                            <span style={{ fontSize: 10.5, color: '#64748b' }}>
                              {p.tipePengadaan || 'Pengadaan'}
                            </span>
                          </div>
                        </td>

                        {/* Rekanan & No SPK */}
                        <td style={{ minWidth: 160 }}>
                          {p.isKontrak ? (
                            <>
                              <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0f2c59' }}>
                                {p.dataKontrak?.namaPenyedia || '-'}
                              </div>
                              <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>
                                No. {p.dataKontrak?.nomorKontrak || '-'}
                              </div>
                              <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, marginTop: 2 }}>
                                Nilai: Rp {kNilai.toLocaleString('id-ID')}
                              </div>
                            </>
                          ) : (
                            <div style={{ fontSize: 11.5, color: '#94a3b8', fontStyle: 'italic' }}>
                              Masih Tahap Pra-Kontrak ({p.tahapPraKontrak?.namaTahap || 'Pemilihan'})
                            </div>
                          )}
                        </td>

                        {/* Sinkronisasi 4 Modul */}
                        <td style={{ textAlign: 'center', minWidth: 160 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                            {/* Modul Pra-kontrak */}
                            <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 4, background: '#f8fafc', border: '1px solid #e2e8f0', width: '100%', textAlign: 'left' }}>
                              <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
                              Pra: <strong>{p.tahapPraKontrak?.namaTahap || 'SiRUP'}</strong>
                            </span>

                            {/* Modul Fisik */}
                            <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 4, background: '#f8fafc', border: '1px solid #e2e8f0', width: '100%', textAlign: 'left' }}>
                              <TrendingUp size={10} style={{ display: 'inline', marginRight: 4 }} />
                              Fisik: <strong>{kFisik}%</strong>
                            </span>

                            {/* Modul Keuangan */}
                            <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 4, background: '#f8fafc', border: '1px solid #e2e8f0', width: '100%', textAlign: 'left' }}>
                              <DollarSign size={10} style={{ display: 'inline', marginRight: 4 }} />
                              Uang: <strong>{kKeuangan}%</strong>
                            </span>

                            {/* Modul SPJ */}
                            <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 4, background: '#f8fafc', border: '1px solid #e2e8f0', width: '100%', textAlign: 'left' }}>
                              <Receipt size={10} style={{ display: 'inline', marginRight: 4 }} />
                              SPJ: <strong>{p.administrasiSPJ?.status?.replace(/_/g, ' ') || 'Belum SPJ'}</strong>
                            </span>
                          </div>
                        </td>

                        {/* Sorotan Publik Toggle */}
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => togglePublicHighlight(p.id)}
                            style={{
                              background: p.isPublicHighlight !== false ? '#fffbeb' : '#f8fafc',
                              border: `1.5px solid ${p.isPublicHighlight !== false ? '#f59e0b' : '#cbd5e1'}`,
                              borderRadius: 8,
                              padding: '6px 10px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              color: p.isPublicHighlight !== false ? '#b45309' : '#94a3b8'
                            }}
                            title="Klik untuk mengubah status tayang di beranda masyarakat"
                          >
                            <Star size={13} fill={p.isPublicHighlight !== false ? '#f59e0b' : 'none'} color={p.isPublicHighlight !== false ? '#f59e0b' : '#94a3b8'} />
                            <span>{p.isPublicHighlight !== false ? 'Aktif' : 'Off'}</span>
                          </button>
                        </td>

                        {/* Aksi Master */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            {/* Detail */}
                            <button
                              className="btn-icon"
                              title="Lihat Rincian Lengkap Paket"
                              onClick={() => onViewProject(p)}
                            >
                              <Eye size={15} />
                            </button>

                            {/* Edit */}
                            {canEditProject(p) && (
                              <button
                                className="btn-icon"
                                title="Edit Master Data Paket"
                                onClick={() => onOpenProjectModal(p)}
                                style={{ color: '#0284c7' }}
                              >
                                <Edit size={15} />
                              </button>
                            )}

                            {/* Delete */}
                            {canEditProject(p) && (
                              <button
                                className="btn-icon"
                                title="Hapus Paket dari Master Data"
                                onClick={() => handleDelete(p)}
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
            </table>
          </div>
        </div>

        {/* Footer Card Master Data dengan Time Stamp di Pojok Kiri Bawah */}
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
              ● Master Data
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: 12 }}>
            Menampilkan <strong>{filteredProjects.length}</strong> dari <strong>{accessibleProjects.length}</strong> total paket terdaftar TA {activeYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterPekerjaanView;
