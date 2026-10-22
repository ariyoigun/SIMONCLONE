import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, STATUS_SPJ_KEUANGAN, KECAMATAN_DEMAK, JENIS_ANGGARAN } from '../data/constants';
import DonutPieChart from '../components/DonutPieChart';
import {
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  FileText,
  Printer,
  Edit3,
  Eye,
  Tag,
  Calendar,
  X,
  Save,
  Building2,
  Send,
  Trash2,
  MapPin
} from 'lucide-react';
import { getLatestProjectUpdateFormatted } from '../utils/dateUtils';

const SpjAdministrationView = ({ onViewProject }) => {
  const {
    accessibleProjects,
    activeYear,
    currentUser,
    spjStatuses,
    tags,
    updateSPJStatus,
    canEditSPJ,
    deleteProject,
    systemSettings
  } = useApp();

  const latestUpdateFormatted = getLatestProjectUpdateFormatted(accessibleProjects, activeYear);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedAnggaran, setSelectedAnggaran] = useState('ALL');

  // Modal Update SPJ State
  const [editingSpjProject, setEditingSpjProject] = useState(null);
  const [spjFormData, setSpjFormData] = useState({
    status: 'belum_masuk',
    tanggalMasuk: '',
    tanggalKoreksi: '',
    nomorSPM: '',
    tanggalSPM: '',
    catatanVerifikator: ''
  });

  // Only contract projects usually undergo SPJ disbursement administration
  const targetProjects = accessibleProjects.filter((p) => p.isKontrak);

  // Filtered projects
  const filteredProjects = targetProjects.filter((p) => {
    const spj = p.administrasiSPJ || {};

    // Bidang filter
    if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;

    // Status SPJ filter
    if (selectedStatus !== 'ALL' && spj.status !== selectedStatus) return false;

    // Tag filter
    if (selectedTag !== 'ALL') {
      const pTags = p.tags || [];
      if (!pTags.includes(selectedTag)) return false;
    }

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
      const matchSPM = spj.nomorSPM?.toLowerCase().includes(q);
      const matchCatatan = spj.catatanVerifikator?.toLowerCase().includes(q);
      const matchKec = p.kecamatan?.toLowerCase().includes(q);
      const matchDesa = p.desa?.toLowerCase().includes(q);
      if (!matchName && !matchCV && !matchNoKontrak && !matchSPM && !matchCatatan && !matchKec && !matchDesa) return false;
    }

    return true;
  });

  // Counts for KPI Summary
  const countTotal = targetProjects.length;
  const countBelum = targetProjects.filter((p) => (p.administrasiSPJ?.status || 'belum_masuk') === 'belum_masuk').length;
  const countMasuk = targetProjects.filter((p) => p.administrasiSPJ?.status === 'sudah_masuk').length;
  const countKoreksi = targetProjects.filter((p) => p.administrasiSPJ?.status === 'sudah_koreksi').length;
  const countDikembalikan = targetProjects.filter((p) => p.administrasiSPJ?.status === 'dikembalikan').length;
  const countSPM = targetProjects.filter((p) => p.administrasiSPJ?.status === 'sudah_spm').length;
  const countSP2D = targetProjects.filter((p) => p.administrasiSPJ?.status === 'sudah_sp2d').length;

  const handleOpenSpjModal = (project) => {
    const spj = project.administrasiSPJ || {};
    setEditingSpjProject(project);
    setSpjFormData({
      status: spj.status || 'belum_masuk',
      tanggalMasuk: spj.tanggalMasuk || new Date().toISOString().slice(0, 10),
      tanggalKoreksi: spj.tanggalKoreksi || '',
      nomorSPM: spj.nomorSPM || '',
      tanggalSPM: spj.tanggalSPM || '',
      catatanVerifikator: spj.catatanVerifikator || ''
    });
  };

  const handleSaveSpj = (e) => {
    e.preventDefault();
    if (!editingSpjProject) return;

    if (spjFormData.status === 'dikembalikan' && !spjFormData.catatanVerifikator.trim()) {
      alert('Untuk berkas yang dikembalikan, catatan koreksi / kekurangan wajib diisi!');
      return;
    }

    updateSPJStatus(editingSpjProject.id, spjFormData);
    setEditingSpjProject(null);
  };

  // Donut Chart Data
  const spjChartData = spjStatuses.map(st => {
    const count = targetProjects.filter(p => (p.administrasiSPJ?.status || 'belum_masuk') === st.id).length;
    return {
      label: st.label,
      value: count,
      color: st.warna || '#64748b'
    };
  }).filter(d => d.value > 0);

  const anggaranChartData = [
    {
      label: 'APBD Murni',
      value: targetProjects.filter(p => (p.jenisAnggaran || 'Murni') === 'Murni').length,
      color: '#0284c7'
    },
    {
      label: '(APBD-P) Perubahan',
      value: targetProjects.filter(p => p.jenisAnggaran === 'APBD-P' || p.jenisAnggaran === 'Perubahan').length,
      color: '#f59e0b'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Menu 4: Administrasi Verifikasi Berkas SPJ & SPM Keuangan</h1>
          <p>
            {systemSettings?.customTexts?.internal_spj_desc || `Khusus Tim Sub Bagian Program & Keuangan untuk memantau kelengkapan berkas SPJ, koreksi teknis, pengembalian berkas, dan penerbitan SPM TA ${activeYear} (${systemSettings?.singkatanInstansi || 'DINPUTARU Kabupaten Demak'})`}
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={15} />
            Cetak Rekap SPJ Akhir Tahun
          </button>
        </div>
      </div>

      {/* Critical Alert if there are returned SPJ files */}
      {countDikembalikan > 0 && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={22} color="#dc2626" />
            <div>
              <div style={{ fontWeight: 800, color: '#991b1b', fontSize: 13.5 }}>
                Terdapat {countDikembalikan} Berkas SPJ Dikembalikan ke Bidang / Rekanan untuk Revisi!
              </div>
              <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 2 }}>
                Harap segera lakukan perbaikan kelengkapan bukti pengeluaran, faktur pajak, atau kuitansi termin agar pencairan tidak terhambat.
              </div>
            </div>
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setSelectedStatus('dikembalikan')}
          >
            Lihat Berkas Dikembalikan
          </button>
        </div>
      )}

      {/* Donut Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        <DonutPieChart
          title="Sebaran Berkas Administrasi SPJ"
          subtitle="Status verifikasi berkas pencairan di Sub Bagian Program & Keuangan"
          data={spjChartData}
          centerLabel="Total SPK"
          centerValue={`${targetProjects.length}`}
          onSliceClick={(item) => {
            const found = spjStatuses.find(s => s.label === item.label);
            if (found) setSelectedStatus(selectedStatus === found.id ? 'ALL' : found.id);
          }}
        />
        <DonutPieChart
          title="Proporsi Berkas SPJ Murni vs APBD-P"
          subtitle="Distribusi berkas berdasarkan penetapan APBD Murni / (APBD-P)"
          data={anggaranChartData}
          centerLabel="Total Paket"
          centerValue={`${targetProjects.length}`}
          onSliceClick={(item) => {
            const val = (item.label.includes('APBD-P') || item.label.includes('Perubahan')) ? 'APBD-P' : 'Murni';
            setSelectedAnggaran(selectedAnggaran === val ? 'ALL' : val);
          }}
        />
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        {/* Berkas Masuk */}
        <div
          className="kpi-card"
          onClick={() => setSelectedStatus(selectedStatus === 'sudah_masuk' ? 'ALL' : 'sudah_masuk')}
          style={{ cursor: 'pointer', border: selectedStatus === 'sudah_masuk' ? '2px solid #0284c7' : '1px solid #e2e8f0' }}
        >
          <div className="kpi-card-header">
            <span className="kpi-card-title">Berkas SPJ Masuk</span>
            <div className="kpi-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#0284c7' }}>
            {countMasuk}
          </div>
          <div className="kpi-subtext">Antre verifikasi tim keuangan</div>
        </div>

        {/* Sedang Koreksi */}
        <div
          className="kpi-card"
          onClick={() => setSelectedStatus(selectedStatus === 'sudah_koreksi' ? 'ALL' : 'sudah_koreksi')}
          style={{ cursor: 'pointer', border: selectedStatus === 'sudah_koreksi' ? '2px solid #6366f1' : '1px solid #e2e8f0' }}
        >
          <div className="kpi-card-header">
            <span className="kpi-card-title">Sedang Dikoreksi</span>
            <div className="kpi-icon-wrap" style={{ background: '#eef2ff', color: '#6366f1' }}>
              <FileText size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#6366f1' }}>
            {countKoreksi}
          </div>
          <div className="kpi-subtext">Pemeriksaan bukti pajak & teknis</div>
        </div>

        {/* Dikembalikan */}
        <div
          className="kpi-card"
          onClick={() => setSelectedStatus(selectedStatus === 'dikembalikan' ? 'ALL' : 'dikembalikan')}
          style={{ cursor: 'pointer', border: selectedStatus === 'dikembalikan' ? '2px solid #dc2626' : '1px solid #e2e8f0' }}
        >
          <div className="kpi-card-header">
            <span className="kpi-card-title">SPJ Dikembalikan</span>
            <div className="kpi-icon-wrap" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <RotateCcw size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#dc2626' }}>
            {countDikembalikan}
          </div>
          <div className="kpi-subtext">Perlu perbaikan oleh PPTK/Rekanan</div>
        </div>

        {/* Sudah Terbit SPM */}
        <div
          className="kpi-card"
          onClick={() => setSelectedStatus(selectedStatus === 'sudah_spm' ? 'ALL' : 'sudah_spm')}
          style={{ cursor: 'pointer', border: selectedStatus === 'sudah_spm' ? '2px solid #7c3aed' : '1px solid #e2e8f0' }}
        >
          <div className="kpi-card-header">
            <span className="kpi-card-title">Sudah Terbit SPM</span>
            <div className="kpi-icon-wrap" style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <Send size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#7c3aed' }}>
            {countSPM}
          </div>
          <div className="kpi-subtext">Menunggu terbit SP2D BPKAD</div>
        </div>

        {/* Selesai SP2D */}
        <div
          className="kpi-card"
          onClick={() => setSelectedStatus(selectedStatus === 'sudah_sp2d' ? 'ALL' : 'sudah_sp2d')}
          style={{ cursor: 'pointer', border: selectedStatus === 'sudah_sp2d' ? '2px solid #059669' : '1px solid #e2e8f0' }}
        >
          <div className="kpi-card-header">
            <span className="kpi-card-title">Selesai SP2D</span>
            <div className="kpi-icon-wrap" style={{ background: '#d1fae5', color: '#059669' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#059669' }}>
            {countSP2D}
          </div>
          <div className="kpi-subtext">Tuntas cair ke kas rekanan</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          {/* Search */}
          <div className="search-input-wrap" style={{ minWidth: 240 }}>
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari paket, nama CV, kecamatan, desa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status SPJ Filter */}
          <select
            className="select-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">Semua Status SPJ ({targetProjects.length})</option>
            {spjStatuses.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>

          {/* Jenis Anggaran */}
          <select
            className="select-filter"
            value={selectedAnggaran}
            onChange={(e) => setSelectedAnggaran(e.target.value)}
          >
            <option value="ALL">Semua Anggaran (Murni & APBD-P)</option>
            {JENIS_ANGGARAN.map((ja) => (
              <option key={ja} value={ja}>
                {ja === 'Murni' ? 'APBD Murni' : '(APBD-P) Perubahan'}
              </option>
            ))}
          </select>

          {/* Kecamatan Filter */}
          <select
            className="select-filter"
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
          >
            <option value="ALL">Semua Kecamatan (Kab. Demak)</option>
            {KECAMATAN_DEMAK.map((kec) => (
              <option key={kec} value={kec}>
                Kec. {kec}
              </option>
            ))}
          </select>

          {/* Tagging Filter */}
          <select
            className="select-filter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="ALL">Semua Tagging Program</option>
            {tags.map((tag, idx) => (
              <option key={idx} value={tag}>
                🏷️ {tag}
              </option>
            ))}
          </select>

          {/* Bidang Filter */}
          {currentUser.role !== 'koordinator' && currentUser.role !== 'kabid' && (
            <select
              className="select-filter"
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
            >
              <option value="ALL">Semua Bidang</option>
              {BIDANG_LIST.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.singkatan}
                </option>
              ))}
            </select>
          )}

          {(selectedStatus !== 'ALL' || selectedTag !== 'ALL' || selectedBidang !== 'ALL' || selectedKecamatan !== 'ALL' || selectedAnggaran !== 'ALL' || searchQuery) && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSelectedStatus('ALL');
                setSelectedTag('ALL');
                setSelectedBidang('ALL');
                setSelectedKecamatan('ALL');
                setSelectedAnggaran('ALL');
                setSearchQuery('');
              }}
            >
              <X size={13} />
              Reset Filter
            </button>
          )}
        </div>

        <div style={{ fontSize: 12.5, color: '#64748b' }}>
          Menampilkan: <strong>{filteredProjects.length} Berkas Pekerjaan</strong>
        </div>
      </div>

      {/* Main Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40, textAlign: 'center' }}>No</th>
                  <th>Paket Pekerjaan & Tagging</th>
                  <th>Penyedia Jasa (CV / PT)</th>
                  <th>Nilai Kontrak & SP2D Cair</th>
                  <th>Status Administrasi SPJ</th>
                  <th>Tanggal & No. SPM</th>
                  <th>Catatan Koreksi Tim Keuangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      Tidak ada data berkas SPJ pekerjaan yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p, idx) => {
                    const spj = p.administrasiSPJ || {};
                    const spjDef = spjStatuses.find((s) => s.id === spj.status) || spjStatuses[0];
                    const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                    const kNilai = parseFloat(p.dataKontrak?.nilaiKontrak || 0);
                    const kCair = parseFloat(p.dataKeuangan?.totalPencairan || 0);

                    return (
                      <tr key={p.id}>
                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b' }}>
                          {idx + 1}
                        </td>

                        {/* Nama Paket & Tags */}
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f2c59', maxWidth: 280 }}>
                            {p.namaPaket}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                            <span
                              className="badge badge-bidang"
                              style={{ background: bidang?.bgLight, color: bidang?.warna }}
                            >
                              {bidang?.singkatan}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
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
                            <span style={{ fontSize: 11, color: '#64748b' }}>
                              SPK: {p.dataKontrak?.nomorKontrak || '-'}
                            </span>
                          </div>

                          {/* Lokasi Desa & Kecamatan */}
                          {(p.desa || p.kecamatan) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0369a1', marginTop: 4, fontWeight: 600 }}>
                              <MapPin size={11} />
                              <span>{p.desa ? `${p.desa}, ` : ''}Kec. {p.kecamatan || '-'}</span>
                            </div>
                          )}

                          {/* Tagging pills */}
                          {p.tags && p.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                              {p.tags.map((t, tIdx) => (
                                <span
                                  key={tIdx}
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    background: '#f1f5f9',
                                    color: '#334155',
                                    border: '1px solid #cbd5e1'
                                  }}
                                >
                                  🏷️ {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Rekanan */}
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f2c59', fontSize: 12.5 }}>
                            {p.dataKontrak?.namaPenyedia || '-'}
                          </div>
                          <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>
                            NPWP: {p.dataKontrak?.npwpPenyedia || '-'}
                          </div>
                        </td>

                        {/* Nilai */}
                        <td>
                          <div style={{ fontWeight: 700, color: '#0284c7', fontSize: 12.5 }}>
                            Rp {kNilai.toLocaleString('id-ID')}
                          </div>
                          <div style={{ fontSize: 11, color: '#059669', marginTop: 2 }}>
                            Cair: Rp {kCair.toLocaleString('id-ID')}
                          </div>
                        </td>

                        {/* Status SPJ */}
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '4px 10px',
                              borderRadius: 9999,
                              fontSize: 11.5,
                              fontWeight: 800,
                              background: spjDef.bgLight || '#f1f5f9',
                              color: spjDef.warna || '#334155',
                              border: `1px solid ${spjDef.borderColor || '#cbd5e1'}`
                            }}
                          >
                            {spjDef.label}
                          </span>
                        </td>

                        {/* Tanggal & No SPM */}
                        <td>
                          {spj.nomorSPM ? (
                            <div>
                              <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#7c3aed' }}>
                                {spj.nomorSPM}
                              </span>
                              <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>
                                Tgl SPM: {spj.tanggalSPM || '-'}
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                              {spj.tanggalMasuk ? `Masuk: ${spj.tanggalMasuk}` : 'Belum ada SPM'}
                            </div>
                          )}
                        </td>

                        {/* Catatan Verifikator */}
                        <td>
                          <div style={{ fontSize: 11.5, color: spj.status === 'dikembalikan' ? '#dc2626' : '#475569', maxWidth: 220, lineHeight: 1.4 }}>
                            {spj.catatanVerifikator || (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                Belum ada catatan koreksi
                              </span>
                            )}
                          </div>
                          {spj.petugasVerifikator && (
                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
                              Verifikator: {spj.petugasVerifikator}
                            </div>
                          )}
                        </td>

                        {/* Aksi */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => onViewProject(p)}
                              title="Lihat Detail Paket"
                            >
                              <Eye size={13} />
                              Detail
                            </button>

                            {canEditSPJ && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleOpenSpjModal(p)}
                                title="Verifikasi & Update Status SPJ"
                              >
                                <Edit3 size={13} />
                                Verifikasi
                              </button>
                            )}

                            {(currentUser.role === 'superadmin' || currentUser.role === 'koordinator') && (
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                                onClick={() => {
                                  if (window.confirm(`Hapus pekerjaan "${p.namaPaket}" dari seluruh sistem?`)) {
                                    deleteProject(p.id);
                                  }
                                }}
                                title="Hapus Master Pekerjaan"
                              >
                                <Trash2 size={13} />
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

        {/* Footer Card Administrasi SPJ dengan Time Stamp di Pojok Kiri Bawah */}
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
                background: '#ede9fe',
                color: '#7c3aed',
                fontWeight: 700
              }}
            >
              ● Verifikasi SPJ
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: 12 }}>
            Menampilkan <strong>{filteredProjects.length}</strong> dari <strong>{accessibleProjects.length}</strong> berkas SPJ pekerjaan TA {activeYear}
          </div>
        </div>
      </div>

      {/* Modal Update Status SPJ */}
      {editingSpjProject && (
        <div className="modal-overlay" onClick={() => setEditingSpjProject(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <div>
                <h3>Verifikasi & Update Status Berkas SPJ</h3>
                <p style={{ color: '#64748b', fontSize: 12.5 }}>
                  {editingSpjProject.namaPaket} ({editingSpjProject.dataKontrak?.namaPenyedia})
                </p>
              </div>
              <button className="btn-icon" onClick={() => setEditingSpjProject(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSpj}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">
                    Status Administrasi Berkas SPJ <span className="required">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={spjFormData.status}
                    onChange={(e) => setSpjFormData({ ...spjFormData, status: e.target.value })}
                    required
                  >
                    {spjStatuses.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label} — ({st.deskripsi})
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    marginBottom: 16
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Tanggal Berkas Masuk</label>
                    <input
                      type="date"
                      className="form-control"
                      value={spjFormData.tanggalMasuk}
                      onChange={(e) => setSpjFormData({ ...spjFormData, tanggalMasuk: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tanggal Dikoreksi / Diperiksa</label>
                    <input
                      type="date"
                      className="form-control"
                      value={spjFormData.tanggalKoreksi}
                      onChange={(e) => setSpjFormData({ ...spjFormData, tanggalKoreksi: e.target.value })}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    marginBottom: 16
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Nomor SPM (Jika Terbit)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="900/.../SPM-LS/2025"
                      value={spjFormData.nomorSPM}
                      onChange={(e) => setSpjFormData({ ...spjFormData, nomorSPM: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tanggal Terbit SPM</label>
                    <input
                      type="date"
                      className="form-control"
                      value={spjFormData.tanggalSPM}
                      onChange={(e) => setSpjFormData({ ...spjFormData, tanggalSPM: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Catatan Verifikator / Alasan Pengembalian{' '}
                    {spjFormData.status === 'dikembalikan' && <span className="required">* (Wajib diisi)</span>}
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Contoh: Faktur pajak PPN 11% belum sesuai, kuitansi belum ditandatangani rekanan, bukti tes lab belum terlampir..."
                    value={spjFormData.catatanVerifikator}
                    onChange={(e) => setSpjFormData({ ...spjFormData, catatanVerifikator: e.target.value })}
                    style={{ minHeight: 90 }}
                    required={spjFormData.status === 'dikembalikan'}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setEditingSpjProject(null)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={15} />
                  Simpan Status SPJ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpjAdministrationView;
