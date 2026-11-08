import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST } from '../data/constants';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Plus,
  Trash2,
  FolderTree,
  Building2,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles
} from 'lucide-react';
import * as xlsx from 'xlsx';

const formatRupiah = (val) => {
  const num = typeof val === 'number' ? val : parseFloat(val) || 0;
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
};

const BIDANG_COLOR_MAP = {
  bina_marga: { nama: 'Bina Marga', singkatan: 'BM', warna: '#0284c7', bg: '#e0f2fe', border: '#bae6fd' },
  cipta_karya: { nama: 'Cipta Karya', singkatan: 'CK', warna: '#d97706', bg: '#fef3c7', border: '#fde68a' },
  sda_bk: { nama: 'SDA & Bangunan Koko', singkatan: 'SDA-BK', warna: '#059669', bg: '#d1fae5', border: '#a7f3d0' },
  tata_ruang: { nama: 'Tata Ruang', singkatan: 'TRP', warna: '#7c3aed', bg: '#ede9fe', border: '#ddd6fe' },
  sekretariat: { nama: 'Sekretariat', singkatan: 'Sekre', warna: '#475569', bg: '#f1f5f9', border: '#e2e8f0' }
};

const KATEGORI_CONFIG = [
  { id: 'ALL', label: 'Semua Kategori', badge: '478' },
  { id: 'fisik', label: '1. Pekerjaan Konstruksi (Fisik)', badge: '284', keyMatch: 'Konstruksi' },
  { id: 'jakon', label: '2. Jasa Konsultansi', badge: '135', keyMatch: 'Konsultansi' },
  { id: 'barang', label: '3. Pengadaan Barang', badge: '53', keyMatch: 'Barang' },
  { id: 'jasa_lainnya', label: '4. Jasa Lainnya', badge: '6', keyMatch: 'Jasa Lainnya' }
];

const MasterPaketPekerjaanView = () => {
  const {
    paketPekerjaanList = [],
    accessiblePaketPekerjaan = [],
    updatePaketPekerjaan,
    addPaketPekerjaan,
    deletePaketPekerjaan,
    currentUser,
    canCreateProject
  } = useApp();

  const dataList = paketPekerjaanList.length > 0 ? paketPekerjaanList : accessiblePaketPekerjaan;

  const [activeKategori, setActiveKategori] = useState('ALL');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [editItemModal, setEditItemModal] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State for Add New Paket
  const [newPaketForm, setNewPaketForm] = useState({
    namaPaket: '',
    subKegiatan: '',
    bidangId: 'cipta_karya',
    kategoriPaket: 'Pekerjaan Konstruksi (Fisik)',
    kategoriPaketId: 'fisik',
    jenisPengadaan: 'Pekerjaan Konstruksi',
    metodePemilihan: 'Pengadaan Langsung',
    paguAnggaran: 0,
    kecamatan: 'Demak',
    desa: 'Bintoro'
  });

  // Filter list
  const filteredList = useMemo(() => {
    return dataList.filter((p) => {
      if (activeKategori !== 'ALL') {
        const catCfg = KATEGORI_CONFIG.find((k) => k.id === activeKategori);
        const matchCat =
          p.kategoriPaketId === activeKategori ||
          (catCfg && (
            (p.kategoriPaket || '').toLowerCase().includes(catCfg.keyMatch.toLowerCase()) ||
            (p.kategoriPekerjaan || '').toLowerCase().includes(catCfg.keyMatch.toLowerCase()) ||
            (p.jenisPengadaan || '').toLowerCase().includes(catCfg.keyMatch.toLowerCase())
          ));
        if (!matchCat) return false;
      }

      if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nama = (p.namaPaket || '').toLowerCase();
        const sub = (p.subKegiatan || p.subBagian || '').toLowerCase();
        const pelaksana = (p.dataKontrak?.namaPenyedia || '').toLowerCase();
        const noKontrak = (p.dataKontrak?.nomorKontrak || '').toLowerCase();
        if (!nama.includes(q) && !sub.includes(q) && !pelaksana.includes(q) && !noKontrak.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [dataList, activeKategori, selectedBidang, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalPagu = dataList.reduce((acc, p) => acc + (parseFloat(p.paguAnggaran) || 0), 0);
    const countFisik = dataList.filter((p) => (p.kategoriPaketId === 'fisik' || (p.kategoriPaket || '').includes('Konstruksi'))).length;
    const countJakon = dataList.filter((p) => (p.kategoriPaketId === 'jakon' || (p.kategoriPaket || '').includes('Konsultansi'))).length;
    const countBarang = dataList.filter((p) => (p.kategoriPaketId === 'barang' || (p.kategoriPaket || '').includes('Barang'))).length;
    const countJasaLainnya = dataList.filter((p) => (p.kategoriPaketId === 'jasa_lainnya' || (p.kategoriPaket || '').includes('Lainnya'))).length;

    return { totalPagu, countFisik, countJakon, countBarang, countJasaLainnya };
  }, [dataList]);

  // Export Excel
  const handleExportExcel = () => {
    const rows = filteredList.map((p, idx) => ({
      'No. Urut': p.noUrutKategori || idx + 1,
      'Kategori Pengadaan': p.kategoriPaket || 'Pekerjaan Konstruksi',
      'Bidang Dinas': BIDANG_COLOR_MAP[p.bidangId]?.nama || p.bidangId,
      'Sub Kegiatan': p.subKegiatan || p.subBagian || '-',
      'Nama Paket Pekerjaan': p.namaPaket,
      'Jenis Pengadaan': p.jenisPengadaan || '-',
      'Metode Pemilihan': p.metodePemilihan || p.tipePengadaan || '-',
      'Pagu Anggaran (Rp)': p.paguAnggaran || 0,
      'Status Kontrak': p.isKontrak ? 'Sudah Kontrak' : 'Belum Kontrak',
      'Nilai Kontrak (Rp)': p.dataKontrak?.nilaiKontrak || 0,
      'Pelaksana / Rekanan': p.dataKontrak?.namaPenyedia || '-',
      'Nomor Kontrak': p.dataKontrak?.nomorKontrak || '-',
      'Tanggal Kontrak': p.dataKontrak?.tanggalKontrak || '-',
      'Progres Fisik (%)': p.dataFisik?.progresRealisasi || 0,
      'Realisasi SP2D (Rp)': p.dataKeuangan?.totalPencairan || 0
    }));

    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Master_Paket_2026');
    xlsx.writeFile(wb, `Master_Paket_Pekerjaan_2026_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Handle Save New Paket
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newPaketForm.namaPaket.trim()) return;

    const id = `mp_custom_${Date.now()}`;
    const newPaket = {
      ...newPaketForm,
      id,
      tahunAnggaran: 2026,
      noUrutKategori: dataList.length + 1,
      isKontrak: false,
      dataKontrak: {
        nomorKontrak: '',
        tanggalKontrak: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        nilaiKontrak: 0,
        namaPenyedia: '-'
      },
      dataFisik: { progresRencana: 0, progresRealisasi: 0, deviasiFisik: 0, statusDeviasi: 'Aman' },
      dataKeuangan: { totalPencairan: 0, persenKeuangan: 0, sisaAnggaran: newPaketForm.paguAnggaran },
      tahapanPencairan: { berkasBelumMasuk: true, berkasMasuk: false, koreksi: false, berkasRevisiMasuk: false, spm: false, selesai: false },
      logs: [{
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        userName: currentUser?.nama || 'Admin Sistem',
        userRole: currentUser?.role || 'Superadmin',
        action: 'Registrasi Master Paket Baru',
        keterangan: `Paket ${newPaketForm.namaPaket} didaftarkan ke Master Paket TA 2026.`
      }]
    };

    addPaketPekerjaan(newPaket);
    setIsCreateModalOpen(false);
    setNewPaketForm({
      namaPaket: '',
      subKegiatan: '',
      bidangId: 'cipta_karya',
      kategoriPaket: 'Pekerjaan Konstruksi (Fisik)',
      kategoriPaketId: 'fisik',
      jenisPengadaan: 'Pekerjaan Konstruksi',
      metodePemilihan: 'Pengadaan Langsung',
      paguAnggaran: 0,
      kecamatan: 'Demak',
      desa: 'Bintoro'
    });
    alert('Paket pekerjaan baru berhasil didaftarkan ke Master Paket!');
  };

  // Handle Delete
  const handleDelete = (id, nama) => {
    if (window.confirm(`Hapus paket "${nama}" dari Master Data Paket Pekerjaan?`)) {
      deletePaketPekerjaan(id);
      alert('Paket pekerjaan berhasil dihapus dari Master Data Paket.');
    }
  };

  // Handle Edit Save
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editItemModal) return;

    updatePaketPekerjaan(editItemModal.id, {
      namaPaket: editItemModal.namaPaket,
      subKegiatan: editItemModal.subKegiatan,
      bidangId: editItemModal.bidangId,
      metodePemilihan: editItemModal.metodePemilihan,
      paguAnggaran: parseFloat(editItemModal.paguAnggaran) || 0
    });

    setEditItemModal(null);
    alert('Perubahan data paket berhasil disimpan!');
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. HEADER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #0284c7 100%)',
          borderRadius: 16,
          padding: '24px 28px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: '0 8px 24px rgba(15, 44, 89, 0.25)'
        }}
      >
        <div style={{ maxWidth: 800 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, background: 'rgba(255,255,255,0.12)', fontSize: 11.5, fontWeight: 700, color: '#fde68a', marginBottom: 8 }}>
            <FolderTree size={14} />
            <span>BASIS DATA INDUK PAKET PEKERJAAN TA 2026</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 6px', letterSpacing: -0.3 }}>
            Master Data Paket Pekerjaan Dinas
          </h1>
          <p style={{ fontSize: 13.5, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            Registrasi data pokok pengadaan paket pekerjaan DINPUTARU Kabupaten Demak TA 2026 yang terbagi dalam 4 kategori resmi pengadaan dan 5 bidang dinas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {canCreateProject && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
              style={{ padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={16} />
              <span>Tambah Paket Baru</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExportExcel}
            style={{ padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, background: '#ffffff', color: '#0f2c59', border: 'none' }}
          >
            <Download size={15} />
            <span>Ekspor Master Excel</span>
          </button>
        </div>
      </div>

      {/* 2. STATS SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Seluruh Paket</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0f2c59', marginTop: 6 }}>{dataList.length} Paket</div>
          <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 600, marginTop: 4 }}>{formatRupiah(stats.totalPagu)}</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>1. Konstruksi (Fisik)</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#0284c7', marginTop: 6 }}>{stats.countFisik} Paket</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Pekerjaan Lapangan / Fisik</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>2. Jasa Konsultansi</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#d97706', marginTop: 6 }}>{stats.countJakon} Paket</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Perencanaan & Pengawasan</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>3. Pengadaan Barang</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#059669', marginTop: 6 }}>{stats.countBarang} Paket</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Sarana & Perlengkapan</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>4. Jasa Lainnya</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#7c3aed', marginTop: 6 }}>{stats.countJasaLainnya} Paket</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Jasa Pendukung Operasional</div>
        </div>
      </div>

      {/* 3. CATEGORY SWITCHER TABS */}
      <div style={{ background: '#ffffff', borderRadius: 14, padding: '8px 10px', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        {KATEGORI_CONFIG.map((cat) => {
          const isActive = activeKategori === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveKategori(cat.id)}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #0f2c59, #0284c7)' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '1px 7px',
                  borderRadius: 9999,
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#475569'
                }}
              >
                {cat.id === 'ALL' ? dataList.length : dataList.filter((p) => (p.kategoriPaket || '').includes(cat.keyMatch) || (p.jenisPengadaan || '').includes(cat.keyMatch)).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. FILTERS & SEARCH */}
      <div style={{ background: '#ffffff', borderRadius: 14, padding: '16px 20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          {/* Filter Bidang */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Filter Bidang:</span>
            <button
              type="button"
              onClick={() => setSelectedBidang('ALL')}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 11.5,
                fontWeight: selectedBidang === 'ALL' ? 800 : 600,
                border: `1px solid ${selectedBidang === 'ALL' ? '#0f2c59' : '#cbd5e1'}`,
                background: selectedBidang === 'ALL' ? '#0f2c59' : '#ffffff',
                color: selectedBidang === 'ALL' ? '#ffffff' : '#475569',
                cursor: 'pointer'
              }}
            >
              Semua Bidang
            </button>

            {Object.entries(BIDANG_COLOR_MAP).map(([bKey, bVal]) => {
              const isSelected = selectedBidang === bKey;
              return (
                <button
                  key={bKey}
                  type="button"
                  onClick={() => setSelectedBidang(bKey)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    fontSize: 11.5,
                    fontWeight: isSelected ? 800 : 700,
                    border: `1px solid ${isSelected ? bVal.warna : bVal.border}`,
                    background: isSelected ? bVal.warna : bVal.bg,
                    color: isSelected ? '#ffffff' : bVal.warna,
                    cursor: 'pointer'
                  }}
                >
                  {bVal.singkatan}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: 340, maxWidth: '100%' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama paket, sub kegiatan, pelaksana..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 38, height: 38, fontSize: 12.5, borderRadius: 8 }}
            />
          </div>
        </div>
      </div>

      {/* 5. TABLE MASTER PAKET */}
      <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto', maxHeight: '720px' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc' }}>
              <tr>
                <th style={{ width: 60, textAlign: 'center' }}>No</th>
                <th style={{ minWidth: 280 }}>Nama Paket Pekerjaan</th>
                <th style={{ minWidth: 140 }}>Bidang</th>
                <th style={{ minWidth: 160 }}>Sub Kegiatan</th>
                <th style={{ minWidth: 140 }}>Metode Pemilihan</th>
                <th style={{ minWidth: 140, textAlign: 'right' }}>Pagu Anggaran</th>
                <th style={{ minWidth: 160 }}>Status Kontrak</th>
                <th style={{ width: 100, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px 24px', color: '#94a3b8' }}>
                    <FolderTree size={36} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontWeight: 700, color: '#475569' }}>Tidak ada paket yang sesuai dengan filter</div>
                  </td>
                </tr>
              ) : (
                filteredList.map((p, idx) => {
                  const bCol = BIDANG_COLOR_MAP[p.bidangId] || BIDANG_COLOR_MAP.sekretariat;
                  const isKontrak = p.isKontrak || (p.dataKontrak?.nilaiKontrak > 0);

                  return (
                    <tr key={p.id}>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                        {p.noUrutKategori || idx + 1}
                      </td>

                      <td>
                        <div style={{ fontWeight: 800, color: '#0f2c59', lineHeight: 1.4 }}>
                          {p.namaPaket}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          Kategori: <strong>{p.kategoriPaket || 'Pekerjaan Konstruksi'}</strong>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 800,
                            background: bCol.bg,
                            color: bCol.warna,
                            border: `1px solid ${bCol.border}`,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {bCol.singkatan} • {bCol.nama}
                        </span>
                      </td>

                      <td style={{ fontSize: 12, color: '#475569' }}>
                        {p.subKegiatan || p.subBagian || '-'}
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: '#f1f5f9',
                            color: '#334155',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          {p.metodePemilihan || p.tipePengadaan || 'Pengadaan'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#0f2c59' }}>
                        {formatRupiah(p.paguAnggaran)}
                      </td>

                      <td>
                        {isKontrak ? (
                          <div>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: '#dcfce7', color: '#15803d' }}>
                              KONTRAK AKTIF
                            </span>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0f2c59', marginTop: 2 }}>
                              {p.dataKontrak?.namaPenyedia || '-'}
                            </div>
                            <div style={{ fontSize: 11, color: '#059669', fontWeight: 800 }}>
                              {formatRupiah(p.dataKontrak?.nilaiKontrak)}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                            Belum Kontrak
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => setSelectedItemDetail(p)}
                            style={{ color: '#0284c7', background: '#e0f2fe', borderRadius: 6, padding: 6 }}
                            title="Lihat Detail Paket"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => setEditItemModal(p)}
                            style={{ color: '#d97706', background: '#fef3c7', borderRadius: 6, padding: 6 }}
                            title="Edit Data Pokok"
                          >
                            <Edit3 size={14} />
                          </button>

                          {canCreateProject && (
                            <button
                              type="button"
                              className="btn-icon"
                              onClick={() => handleDelete(p.id, p.namaPaket)}
                              style={{ color: '#ef4444', background: '#fee2e2', borderRadius: 6, padding: 6 }}
                              title="Hapus Paket"
                            >
                              <Trash2 size={14} />
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

      {/* MODAL TAMBAH PAKET */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-dialog" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, color: '#0f2c59' }}>Registrasi Master Paket Baru</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>Tambah paket pengadaan TA 2026 ke Master Data Paket Pekerjaan</p>
              </div>
              <button className="btn-icon" onClick={() => setIsCreateModalOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="form-label">Nama Paket Pekerjaan</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Peningkatan Jalan Demak - Sayung"
                    value={newPaketForm.namaPaket}
                    onChange={(e) => setNewPaketForm({ ...newPaketForm, namaPaket: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">Bidang Dinas</label>
                    <select
                      className="form-control"
                      value={newPaketForm.bidangId}
                      onChange={(e) => setNewPaketForm({ ...newPaketForm, bidangId: e.target.value })}
                    >
                      {BIDANG_LIST.map((b) => (
                        <option key={b.id} value={b.id}>{b.nama}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Kategori Pengadaan</label>
                    <select
                      className="form-control"
                      value={newPaketForm.kategoriPaket}
                      onChange={(e) => {
                        const val = e.target.value;
                        const catId = val.includes('Konstruksi') ? 'fisik' : val.includes('Konsultansi') ? 'jakon' : val.includes('Barang') ? 'barang' : 'jasa_lainnya';
                        setNewPaketForm({ ...newPaketForm, kategoriPaket: val, kategoriPaketId: catId, jenisPengadaan: val });
                      }}
                    >
                      <option value="Pekerjaan Konstruksi (Fisik)">1. Pekerjaan Konstruksi (Fisik)</option>
                      <option value="Jasa Konsultansi">2. Jasa Konsultansi</option>
                      <option value="Pengadaan Barang">3. Pengadaan Barang</option>
                      <option value="Jasa Lainnya">4. Jasa Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Sub Kegiatan</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nama Sub Kegiatan Nomenklatur"
                    value={newPaketForm.subKegiatan}
                    onChange={(e) => setNewPaketForm({ ...newPaketForm, subKegiatan: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">Metode Pemilihan</label>
                    <select
                      className="form-control"
                      value={newPaketForm.metodePemilihan}
                      onChange={(e) => setNewPaketForm({ ...newPaketForm, metodePemilihan: e.target.value })}
                    >
                      <option value="Pengadaan Langsung">Pengadaan Langsung</option>
                      <option value="Tender">Tender</option>
                      <option value="e-Purchasing">e-Purchasing</option>
                      <option value="Seleksi">Seleksi</option>
                      <option value="Minikom">Minikom</option>
                      <option value="Swakelola">Swakelola</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Pagu Anggaran (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newPaketForm.paguAnggaran}
                      onChange={(e) => setNewPaketForm({ ...newPaketForm, paguAnggaran: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsCreateModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Daftarkan Paket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT DATA POKOK PAKET */}
      {editItemModal && (
        <div className="modal-overlay" onClick={() => setEditItemModal(null)}>
          <div className="modal-dialog" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, color: '#0f2c59' }}>Edit Data Pokok Paket</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>Ubah informasi paket pengadaan</p>
              </div>
              <button className="btn-icon" onClick={() => setEditItemModal(null)}><X size={18} /></button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="form-label">Nama Paket Pekerjaan</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editItemModal.namaPaket}
                    onChange={(e) => setEditItemModal({ ...editItemModal, namaPaket: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Sub Kegiatan</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editItemModal.subKegiatan || ''}
                    onChange={(e) => setEditItemModal({ ...editItemModal, subKegiatan: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">Bidang Dinas</label>
                    <select
                      className="form-control"
                      value={editItemModal.bidangId}
                      onChange={(e) => setEditItemModal({ ...editItemModal, bidangId: e.target.value })}
                    >
                      {BIDANG_LIST.map((b) => (
                        <option key={b.id} value={b.id}>{b.nama}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Metode Pemilihan</label>
                    <select
                      className="form-control"
                      value={editItemModal.metodePemilihan || 'Pengadaan Langsung'}
                      onChange={(e) => setEditItemModal({ ...editItemModal, metodePemilihan: e.target.value })}
                    >
                      <option value="Pengadaan Langsung">Pengadaan Langsung</option>
                      <option value="Tender">Tender</option>
                      <option value="e-Purchasing">e-Purchasing</option>
                      <option value="Seleksi">Seleksi</option>
                      <option value="Minikom">Minikom</option>
                      <option value="Swakelola">Swakelola</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Pagu Anggaran (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editItemModal.paguAnggaran || 0}
                    onChange={(e) => setEditItemModal({ ...editItemModal, paguAnggaran: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setEditItemModal(null)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PAKET */}
      {selectedItemDetail && (
        <div className="modal-overlay" onClick={() => setSelectedItemDetail(null)}>
          <div className="modal-dialog" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0284c7' }}>RINCIAN MASTER PAKET</span>
                <h3 style={{ margin: '2px 0 0', color: '#0f2c59', fontSize: 16 }}>{selectedItemDetail.namaPaket}</h3>
              </div>
              <button className="btn-icon" onClick={() => setSelectedItemDetail(null)}><X size={18} /></button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12.5 }}>
                <div>
                  <span style={{ color: '#64748b' }}>Kategori:</span>
                  <div style={{ fontWeight: 800, color: '#0f2c59' }}>{selectedItemDetail.kategoriPaket}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Bidang Dinas:</span>
                  <div style={{ fontWeight: 800, color: '#0f2c59' }}>{BIDANG_COLOR_MAP[selectedItemDetail.bidangId]?.nama || selectedItemDetail.bidangId}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Pagu Anggaran:</span>
                  <div style={{ fontWeight: 900, color: '#0284c7' }}>{formatRupiah(selectedItemDetail.paguAnggaran)}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Metode Pemilihan:</span>
                  <div style={{ fontWeight: 800, color: '#334155' }}>{selectedItemDetail.metodePemilihan || '-'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#64748b' }}>Sub Kegiatan:</span>
                  <div style={{ fontWeight: 700, color: '#334155' }}>{selectedItemDetail.subKegiatan || selectedItemDetail.subBagian || '-'}</div>
                </div>
              </div>

              {selectedItemDetail.isKontrak && (
                <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 10, border: '1px solid #bbf7d0', fontSize: 12.5 }}>
                  <div style={{ fontWeight: 800, color: '#166534', marginBottom: 8 }}>Informasi Kontrak & Pelaksana:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>Pelaksana: <strong>{selectedItemDetail.dataKontrak?.namaPenyedia || '-'}</strong></div>
                    <div>Nilai Kontrak: <strong style={{ color: '#15803d' }}>{formatRupiah(selectedItemDetail.dataKontrak?.nilaiKontrak)}</strong></div>
                    <div>No. Kontrak: <strong>{selectedItemDetail.dataKontrak?.nomorKontrak || '-'}</strong></div>
                    <div>Tgl Kontrak: <strong>{selectedItemDetail.dataKontrak?.tanggalKontrak || '-'}</strong></div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedItemDetail(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterPaketPekerjaanView;

