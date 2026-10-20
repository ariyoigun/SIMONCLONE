import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  BIDANG_LIST,
  TIPE_PENGADAAN,
  SUMBER_DANA,
  TAHAPAN_PRA_KONTRAK,
  JENIS_ANGGARAN,
  KECAMATAN_DEMAK,
  DESA_DEMAK_BY_KECAMATAN
} from '../data/constants';
import {
  X,
  Save,
  Plus,
  Trash2,
  FileText,
  CheckCircle,
  TrendingUp,
  Tag,
  ReceiptText,
  MapPin,
  Navigation,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, initialData = null }) => {
  const {
    addProject,
    updateProject,
    activeYear,
    currentUser,
    tags: masterTags = [],
    addTag,
    praKontrakStages = [],
    spjStatuses = [],
    kategoriPekerjaanList = [],
    sumberDanaList = []
  } = useApp();

  const isEdit = !!initialData;

  const defaultBidangId =
    currentUser.bidangId || (BIDANG_LIST.length > 0 ? BIDANG_LIST[0].id : 'cipta_karya');

  const [activeTab, setActiveTab] = useState('umum'); // 'umum' | 'kontrak' | 'fisik'
  const [newTagInput, setNewTagInput] = useState('');

  const [formData, setFormData] = useState({
    namaPaket: '',
    bidangId: defaultBidangId,
    kategoriPekerjaan: 'Fisik',
    subBagian: '',
    tipePengadaan: 'Tender',
    sumberDana: 'APBD Murni (DAU)',
    jenisAnggaran: 'Murni', // 'Murni' | 'Perubahan'
    kecamatan: 'Demak',    // Kolom Kecamatan Demak
    desa: '',              // Kolom Desa
    paguAnggaran: 0,
    hps: 0,
    lokasi: '',
    latitude: '-6.8942',
    longitude: '110.6385',
    isPublicHighlight: true,
    kodeRUP: '',
    tags: [],
    tahapPraKontrak: {
      status: 'rup',
      targetMulaiTender: '',
      targetSelesaiTender: '',
      catatanPraKontrak: ''
    },
    isKontrak: false,
    dataKontrak: {
      nomorKontrak: '',
      tanggalKontrak: '',
      nilaiKontrak: 0,
      namaPenyedia: '',
      npwpPenyedia: '',
      bankPenyedia: '',
      nomorRekening: '',
      waktuPelaksanaan: 120,
      tanggalMulai: '',
      tanggalSelesai: '',
      konsultanPengawas: ''
    },
    dataFisik: {
      progresRencana: 0,
      progresRealisasi: 0,
      kendalaLapangan: '',
      fotoDokumentasi: [],
      mingguanKurvaS: []
    },
    dataKeuangan: {
      terminHistory: []
    },
    administrasiSPJ: {
      status: 'Belum Mengajukan SPJ',
      tanggalMasuk: '',
      noSPM: '',
      tanggalSPM: '',
      noSP2D: '',
      tanggalSP2D: '',
      catatanVerifikasi: '',
      diverifikasiOleh: ''
    }
  });

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        kategoriPekerjaan: initialData.kategoriPekerjaan || (initialData.bidangId === 'tata_ruang' ? 'Jakon' : 'Fisik'),
        tipePengadaan: initialData.tipePengadaan || 'Tender',
        jenisAnggaran: initialData.jenisAnggaran || 'Murni',
        kecamatan: initialData.kecamatan || 'Demak',
        desa: initialData.desa || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags : [],
        paguAnggaran: initialData.paguAnggaran || 0,
        hps: initialData.hps || 0,
        latitude: initialData.latitude || initialData.koordinat?.lat || '-6.8942',
        longitude: initialData.longitude || initialData.koordinat?.lng || '110.6385',
        isPublicHighlight: initialData.isPublicHighlight !== undefined ? initialData.isPublicHighlight : true,
        dataKontrak: {
          ...initialData.dataKontrak,
          tanggalMulai: initialData.dataKontrak?.tanggalMulai || '',
          tanggalSelesai: initialData.dataKontrak?.tanggalSelesai || '',
          nilaiKontrak: initialData.dataKontrak?.nilaiKontrak || 0
        },
        dataFisik: {
          ...initialData.dataFisik,
          progresRencana: initialData.dataFisik?.progresRencana || 0,
          progresRealisasi: initialData.dataFisik?.progresRealisasi || 0
        },
        dataKeuangan: {
          ...initialData.dataKeuangan,
          terminHistory: initialData.dataKeuangan?.terminHistory || []
        },
        administrasiSPJ: initialData.administrasiSPJ || {
          status: 'Belum Mengajukan SPJ',
          tanggalMasuk: '',
          noSPM: '',
          tanggalSPM: '',
          noSP2D: '',
          tanggalSP2D: '',
          catatanVerifikasi: '',
          diverifikasiOleh: ''
        }
      });
    } else {
      const defaultKategori = defaultBidangId === 'tata_ruang' ? 'Jakon' : 'Fisik';
      setFormData({
        namaPaket: '',
        bidangId: defaultBidangId,
        kategoriPekerjaan: defaultKategori,
        subBagian: '',
        tipePengadaan: defaultKategori === 'Jakon' ? 'Seleksi' : 'Tender',
        sumberDana: 'APBD Murni (DAU)',
        jenisAnggaran: 'Murni',
        kecamatan: 'Demak',
        desa: '',
        paguAnggaran: 0,
        hps: 0,
        lokasi: '',
        latitude: '-6.8942',
        longitude: '110.6385',
        isPublicHighlight: true,
        kodeRUP: '',
        tags: [],
        tahapPraKontrak: {
          status: 'rup',
          targetMulaiTender: '',
          targetSelesaiTender: '',
          catatanPraKontrak: ''
        },
        isKontrak: false,
        dataKontrak: {
          nomorKontrak: '',
          tanggalKontrak: '',
          nilaiKontrak: 0,
          namaPenyedia: '',
          npwpPenyedia: '',
          bankPenyedia: '',
          nomorRekening: '',
          waktuPelaksanaan: 120,
          tanggalMulai: '',
          tanggalSelesai: '',
          konsultanPengawas: ''
        },
        dataFisik: {
          progresRencana: 0,
          progresRealisasi: 0,
          kendalaLapangan: '',
          fotoDokumentasi: [],
          mingguanKurvaS: []
        },
        dataKeuangan: {
          terminHistory: []
        },
        administrasiSPJ: {
          status: 'Belum Mengajukan SPJ',
          tanggalMasuk: '',
          noSPM: '',
          tanggalSPM: '',
          noSP2D: '',
          tanggalSP2D: '',
          catatanVerifikasi: '',
          diverifikasiOleh: ''
        }
      });
    }
    setActiveTab('umum');
    setNewTagInput('');
  }, [initialData, isOpen, defaultBidangId]);

  if (!isOpen) return null;

  // Selected bidang details
  const selectedBidang = BIDANG_LIST.find((b) => b.id === formData.bidangId) || BIDANG_LIST[0];

  // Helper when changing Kategori Pekerjaan
  const handleKategoriChange = (newKatNama) => {
    const katObj = (kategoriPekerjaanList || []).find((k) => k.nama === newKatNama);
    let newTipe = 'Tender';
    if (newKatNama === 'Swakelola') {
      newTipe = 'Swakelola';
    } else if (katObj && katObj.jenisPengadaan && katObj.jenisPengadaan.length > 0) {
      newTipe = katObj.jenisPengadaan[0];
    }
    setFormData((prev) => ({
      ...prev,
      kategoriPekerjaan: newKatNama,
      tipePengadaan: newTipe
    }));
  };

  // Currently selected category object with its available procurement types
  const currentCategoryObj =
    (kategoriPekerjaanList || []).find((k) => k.nama === formData.kategoriPekerjaan) ||
    (kategoriPekerjaanList || []).find((k) => k.id === formData.kategoriPekerjaan?.toLowerCase()) || {
      nama: formData.kategoriPekerjaan || 'Fisik',
      jenisPengadaan: ['Tender', 'Pengadaan Langsung', 'Minikom']
    };

  const handleAddNewTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    addTag(trimmed);
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).includes(trimmed) ? prev.tags : [...(prev.tags || []), trimmed]
    }));
    setNewTagInput('');
  };

  const handleToggleTag = (tag) => {
    setFormData((prev) => {
      const current = prev.tags || [];
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { ...prev, tags: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaPaket.trim()) {
      alert('Nama Paket Pekerjaan wajib diisi!');
      setActiveTab('umum');
      return;
    }

    const statusTahap = formData.tahapPraKontrak?.status;
    const isBatal = statusTahap === 'batal';
    // Auto-sync isKontrak if status pra-kontrak is 'kontrak'
    const isKontrak = !isBatal && (formData.isKontrak || statusTahap === 'kontrak');

    if (isKontrak) {
      if (!formData.dataKontrak?.tanggalMulai || !formData.dataKontrak?.tanggalSelesai) {
        alert('Untuk paket berstatus Kontrak, isian Tanggal Mulai Kontrak dan Tanggal Akhir Kontrak wajib diisi!');
        return;
      }
    }

    const payload = {
      ...formData,
      isKontrak,
      tahapPraKontrak: {
        ...formData.tahapPraKontrak,
        status: isBatal ? 'batal' : (isKontrak ? 'kontrak' : statusTahap)
      }
    };

    if (isEdit) {
      updateProject(initialData.id, payload);
    } else {
      addProject(payload);
    }

    onClose();
  };

  // Calculations for preview
  const deviasiFisik = (
    parseFloat(formData.dataFisik.progresRealisasi || 0) -
    parseFloat(formData.dataFisik.progresRencana || 0)
  ).toFixed(2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{isEdit ? 'Ubah Data Paket Pekerjaan' : 'Input Data Paket Pekerjaan Terpadu'}</h3>
            <p>
              Tahun Anggaran {activeYear} • Data digunakan bersama untuk Menu Pra-Kontrak, Fisik, dan Keuangan
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ padding: '0 28px', background: '#fafbfc', borderBottom: '1px solid #e2e8f0' }}>
          <div className="tab-nav" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'umum' ? 'active' : ''}`}
              onClick={() => setActiveTab('umum')}
            >
              <FileText size={16} />
              1. Informasi Umum & Pra-Kontrak
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'kontrak' ? 'active' : ''}`}
              onClick={() => setActiveTab('kontrak')}
            >
              <CheckCircle size={16} />
              2. Data Kontrak & Rekanan CV
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'fisik' ? 'active' : ''}`}
              onClick={() => setActiveTab('fisik')}
            >
              <TrendingUp size={16} />
              3. Progres Fisik (0-100%)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            {/* TAB 1: INFORMASI UMUM & PRA-KONTRAK */}
            {activeTab === 'umum' && (
              <div className="form-grid">
                <div className="form-group form-grid-full">
                  <label className="form-label">
                    Nama Paket Pekerjaan <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Peningkatan Jalan Poros Ruas Balamukti - Margasari"
                    value={formData.namaPaket}
                    onChange={(e) => setFormData({ ...formData, namaPaket: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Bidang Penanggung Jawab <span className="required">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.bidangId}
                    disabled={currentUser.role === 'koordinator'}
                    onChange={(e) =>
                      setFormData({ ...formData, bidangId: e.target.value, subBagian: '' })
                    }
                  >
                    {BIDANG_LIST.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </select>
                  {currentUser.role === 'koordinator' && (
                    <span className="form-help">Terkunci sesuai bidang tugas Anda</span>
                  )}
                </div>

                {formData.bidangId === 'sekretariat' && (
                  <div className="form-group">
                    <label className="form-label">Sub Bagian (Khusus Sekretariat)</label>
                    <select
                      className="form-control"
                      value={formData.subBagian}
                      onChange={(e) => setFormData({ ...formData, subBagian: e.target.value })}
                    >
                      <option value="">-- Pilih Sub Bagian --</option>
                      {(selectedBidang.subBagian || []).map((sub, i) => (
                        <option key={i} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                    <span className="form-help">Pilih Sub Bagian Umum & Kepegawaian atau Program & Keuangan</span>
                  </div>
                )}

                {/* KATEGORI PEKERJAAN */}
                <div className="form-group">
                  <label className="form-label">
                    Kategori / Tipe Pekerjaan <span className="required">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.kategoriPekerjaan || 'Fisik'}
                    onChange={(e) => handleKategoriChange(e.target.value)}
                    required
                  >
                    {(kategoriPekerjaanList && kategoriPekerjaanList.length > 0 ? kategoriPekerjaanList : [
                      { id: 'fisik', nama: 'Fisik' },
                      { id: 'jakon', nama: 'Jakon' },
                      { id: 'barang', nama: 'Barang' },
                      { id: 'jasa_lainnya', nama: 'Jasa Lainnya' },
                      { id: 'swakelola', nama: 'Swakelola' }
                    ]).map((kat) => (
                      <option key={kat.id} value={kat.nama}>
                        {kat.nama}
                      </option>
                    ))}
                  </select>
                  <span className="form-help">
                    1. Fisik • 2. Jakon • 3. Barang • 4. Jasa Lainnya • 5. Swakelola
                  </span>
                </div>

                {/* JENIS PENGADAAN PER PEKERJAAN */}
                <div className="form-group">
                  <label className="form-label">
                    Jenis Pengadaan <span className="required">*</span>
                  </label>
                  {formData.kategoriPekerjaan === 'Swakelola' ? (
                    <div
                      style={{
                        padding: '9px 12px',
                        borderRadius: 8,
                        background: '#f0fdf4',
                        border: '1.5px solid #86efac',
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>Langsung Kategori Swakelola (Tanpa Penyedia Luar)</span>
                    </div>
                  ) : (
                    <select
                      className="form-control"
                      value={formData.tipePengadaan}
                      onChange={(e) => setFormData({ ...formData, tipePengadaan: e.target.value })}
                      required
                    >
                      {(currentCategoryObj?.jenisPengadaan || ['Tender', 'Pengadaan Langsung']).map((tipe, idx) => (
                        <option key={idx} value={tipe}>
                          {tipe}
                        </option>
                      ))}
                    </select>
                  )}
                  <span className="form-help">
                    {formData.kategoriPekerjaan === 'Swakelola'
                      ? 'Kategori Swakelola tidak memerlukan pemilihan jenis pengadaan'
                      : `Metode pengadaan yang tersedia untuk kategori ${formData.kategoriPekerjaan}`}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Jenis Anggaran Pekerjaan <span className="required">*</span>
                  </label>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    {JENIS_ANGGARAN.map((jenis) => {
                      const isSelected =
                        formData.jenisAnggaran === jenis ||
                        (jenis === 'APBD-P' && formData.jenisAnggaran === 'Perubahan');
                      return (
                        <label
                          key={jenis}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: `2px solid ${isSelected ? (jenis === 'Murni' ? '#0284c7' : '#d97706') : '#cbd5e1'}`,
                            background: isSelected ? (jenis === 'Murni' ? '#f0f9ff' : '#fffbeb') : '#ffffff',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 800 : 600,
                            color: isSelected ? (jenis === 'Murni' ? '#0369a1' : '#b45309') : '#475569',
                            fontSize: 13,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <input
                            type="radio"
                            name="jenisAnggaran"
                            value={jenis}
                            checked={isSelected}
                            onChange={(e) => setFormData({ ...formData, jenisAnggaran: e.target.value })}
                            style={{ margin: 0 }}
                          />
                          <span>{jenis === 'Murni' ? 'APBD Murni (Awal Tahun)' : '(APBD-P) Perubahan'}</span>
                        </label>
                      );
                    })}
                  </div>
                  <span className="form-help">Pilih apakah paket bersumber dari APBD Murni atau tambahan APBD-P (Perubahan)</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Sumber Pendanaan</label>
                  <select
                    className="form-control"
                    value={formData.sumberDana}
                    onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value })}
                  >
                    {(sumberDanaList && sumberDanaList.length > 0 ? sumberDanaList : SUMBER_DANA).map((dana, idx) => (
                      <option key={idx} value={dana}>
                        {dana}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Pagu Anggaran (Rp) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={formData.paguAnggaran || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, paguAnggaran: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                  <span className="form-help">
                    Terbilang: Rp {(formData.paguAnggaran || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Nilai HPS (Harga Perkiraan Sendiri) (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={formData.hps || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, hps: parseFloat(e.target.value) || 0 })
                    }
                  />
                  <span className="form-help">
                    Terbilang: Rp {(formData.hps || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                {/* WILAYAH KABUPATEN DEMAK: KECAMATAN & DESA */}
                <div className="form-group">
                  <label className="form-label">
                    Kecamatan (Kab. Demak) <span className="required">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.kecamatan || 'Demak'}
                    onChange={(e) => {
                      const newKec = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        kecamatan: newKec,
                        // If current desa is not in new kecamatan, allow keep or reset
                        desa: prev.desa
                      }));
                    }}
                    required
                  >
                    {KECAMATAN_DEMAK.map((kec) => (
                      <option key={kec} value={kec}>
                        Kecamatan {kec}
                      </option>
                    ))}
                  </select>
                  <span className="form-help">Wilayah administrasi 14 kecamatan di Kabupaten Demak</span>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label className="form-label" style={{ margin: 0 }}>Desa / Kelurahan</label>
                    {(DESA_DEMAK_BY_KECAMATAN[formData.kecamatan] || []).length > 0 && (
                      <span style={{ fontSize: 11, color: '#0284c7', fontWeight: 600 }}>
                        {DESA_DEMAK_BY_KECAMATAN[formData.kecamatan].length} Desa/Kel. Terdaftar
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      list="desa-options"
                      className="form-control"
                      placeholder={`Ketik atau pilih desa di Kec. ${formData.kecamatan}...`}
                      value={formData.desa || ''}
                      onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <select
                      className="form-control"
                      style={{ width: '190px', background: '#f8fafc', fontSize: 12.5 }}
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData({ ...formData, desa: e.target.value });
                        }
                      }}
                      title="Pilih langsung dari daftar desa database kecamatan"
                    >
                      <option value="">-- Pilih dari Daftar --</option>
                      {(DESA_DEMAK_BY_KECAMATAN[formData.kecamatan] || []).map((desaNama) => (
                        <option key={desaNama} value={desaNama}>
                          {desaNama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <datalist id="desa-options">
                    {(DESA_DEMAK_BY_KECAMATAN[formData.kecamatan] || []).map((desaNama) => (
                      <option key={desaNama} value={desaNama} />
                    ))}
                  </datalist>
                  <span className="form-help">
                    Pilih desa dari daftar database Kecamatan {formData.kecamatan} atau ketik bebas nama lokasi.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Detail Ruas / Lokasi Pekerjaan</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Ruas Trengguli - Mijen KM 02+100 s/d 04+500"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kode SiRUP (LKPP)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="RUP-2025-..."
                    value={formData.kodeRUP}
                    onChange={(e) => setFormData({ ...formData, kodeRUP: e.target.value })}
                  />
                </div>

                {/* TITIK KOORDINAT GEOGRAFIS (LATITUDE & LONGITUDE) */}
                <div
                  className="form-group form-grid-full"
                  style={{
                    background: '#f0f9ff',
                    padding: '16px 18px',
                    borderRadius: 12,
                    border: '1px solid #bae6fd'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                    <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, color: '#0369a1', fontWeight: 800 }}>
                      <MapPin size={16} color="#0284c7" />
                      <span>Titik Koordinat Geografis Lapangan (Latitude & Longitude)</span>
                    </label>
                    {formData.latitude && formData.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 11.5,
                          background: '#ffffff',
                          color: '#0284c7',
                          borderColor: '#7dd3fc',
                          padding: '4px 10px'
                        }}
                      >
                        <Navigation size={12} />
                        <span>Buka Titik di Google Maps</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>

                  <p style={{ fontSize: 12, color: '#0369a1', marginBottom: 12 }}>
                    Masukkan koordinat lintang (latitude) dan bujur (longitude) untuk memudahkan pemetaan lokasi proyek di sistem dan peta masyarakat.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11.5, fontWeight: 700, color: '#0f2c59', display: 'block', marginBottom: 4 }}>
                        Latitude (Lintang, misal: -6.9854)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="-6.9854"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        style={{ background: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11.5, fontWeight: 700, color: '#0f2c59', display: 'block', marginBottom: 4 }}>
                        Longitude (Bujur, misal: 109.1245)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="109.1245"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        style={{ background: '#ffffff' }}
                      />
                    </div>
                  </div>
                </div>

                {/* PENGATURAN SOROTAN BERANDA PUBLIK (LANDING PAGE) */}
                <div
                  className="form-group form-grid-full"
                  style={{
                    background: formData.isPublicHighlight ? '#f0fdf4' : '#f8fafc',
                    padding: '16px 18px',
                    borderRadius: 12,
                    border: formData.isPublicHighlight ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          cursor: 'pointer',
                          fontSize: 13.5,
                          fontWeight: 800,
                          color: formData.isPublicHighlight ? '#15803d' : '#0f2c59'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.isPublicHighlight}
                          onChange={(e) => setFormData({ ...formData, isPublicHighlight: e.target.checked })}
                          style={{ width: 19, height: 19, accentColor: '#16a34a', cursor: 'pointer' }}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Sparkles size={16} color={formData.isPublicHighlight ? '#16a34a' : '#64748b'} />
                          Tampilkan sebagai Pekerjaan Sorotan di Beranda Publik (Landing Page)
                        </span>
                      </label>
                      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, margin: '8px 0 0 29px' }}>
                        Pengaturan ini diatur oleh <strong>Koordinator Bidang</strong> dan <strong>Superadmin</strong>. Jika dicentang, masyarakat umum dapat melihat nama pekerjaan, lokasi koordinat, tahapan pengadaan, dan persentase progres fisik di portal publik.
                      </p>
                      <div
                        style={{
                          margin: '8px 0 0 29px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#b45309',
                          background: '#fef3c7',
                          padding: '3px 10px',
                          borderRadius: 6
                        }}
                      >
                        🔒 Perlindungan Data Publik: Seluruh rincian keuangan (pagu, nilai kontrak, termin, SP2D) otomatis DISENSOR dari beranda publik.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group form-grid-full">
                  <label className="form-label">
                    Tahapan Pra-Kontrak Saat Ini <span className="required">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.tahapPraKontrak.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      const isBatal = newStatus === 'batal';
                      const isKtr = newStatus === 'kontrak';
                      setFormData({
                        ...formData,
                        isKontrak: isBatal ? false : (isKtr ? true : formData.isKontrak),
                        tahapPraKontrak: {
                          ...formData.tahapPraKontrak,
                          status: newStatus,
                          catatanPraKontrak: isBatal
                            ? (formData.tahapPraKontrak.catatanPraKontrak || 'Pekerjaan dibatalkan')
                            : formData.tahapPraKontrak.catatanPraKontrak
                        }
                      });
                    }}
                    style={{
                      fontWeight: 700,
                      borderColor:
                        formData.tahapPraKontrak.status === 'kontrak'
                          ? '#10b981'
                          : formData.tahapPraKontrak.status === 'batal'
                          ? '#ef4444'
                          : '#cbd5e1'
                    }}
                  >
                    {(praKontrakStages && praKontrakStages.length > 0 ? praKontrakStages : TAHAPAN_PRA_KONTRAK).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* KHUSUS TAHAP 11: KONTRAK (Wajib Input Tanggal Mulai & Akhir Kontrak) */}
                {formData.tahapPraKontrak.status === 'kontrak' && (
                  <div
                    className="form-group form-grid-full"
                    style={{
                      background: '#f0fdf4',
                      border: '2px solid #86efac',
                      borderRadius: 12,
                      padding: '16px 18px',
                      marginTop: 2
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, color: '#15803d', fontWeight: 800 }}>
                      <CheckCircle size={18} />
                      <span>Tahap 11: Kontrak Terpilih — Wajib Isi Tanggal Mulai dan Akhir Kontrak</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#166534', margin: '0 0 12px 0' }}>
                      Paket telah memasuki tahapan kontrak resmi. Isikan tanggal mulai kontrak (SPMK) dan batas akhir kontrak agar pemantauan progres fisik dan kurva S berjalan akurat.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#166534', display: 'block', marginBottom: 4 }}>
                          Tanggal Mulai Kontrak (SPMK) <span className="required">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.dataKontrak.tanggalMulai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dataKontrak: { ...formData.dataKontrak, tanggalMulai: e.target.value }
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: '#166534', display: 'block', marginBottom: 4 }}>
                          Tanggal Akhir Kontrak (Batas Selesai) <span className="required">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.dataKontrak.tanggalSelesai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dataKontrak: { ...formData.dataKontrak, tanggalSelesai: e.target.value }
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* KHUSUS TAHAP 12: BATAL */}
                {formData.tahapPraKontrak.status === 'batal' && (
                  <div
                    className="form-group form-grid-full"
                    style={{
                      background: '#fef2f2',
                      border: '2px solid #fca5a5',
                      borderRadius: 12,
                      padding: '16px 18px',
                      marginTop: 2
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, color: '#dc2626', fontWeight: 800 }}>
                      <span style={{ fontSize: 16 }}>⚠️</span>
                      <span>Tahap 12: Batal — Paket Pekerjaan Dibatalkan</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#991b1b', margin: '0 0 10px 0' }}>
                      Pekerjaan ini ditandai sebagai BATAL dan dikecualikan dari kurva fisik aktif. Mohon catat alasan pembatalan pekerjaan di bawah ini.
                    </p>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', display: 'block', marginBottom: 4 }}>
                        Alasan / Berita Acara Pembatalan
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Batal karena kegagalan tender ulang / relokasi alokasi anggaran perubahan"
                        value={formData.tahapPraKontrak.catatanPraKontrak}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tahapPraKontrak: { ...formData.tahapPraKontrak, catatanPraKontrak: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Jadwal Perkiraan Pemilihan</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="date"
                      className="form-control"
                      title="Mulai"
                      value={formData.tahapPraKontrak.targetMulaiTender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tahapPraKontrak: {
                            ...formData.tahapPraKontrak,
                            targetMulaiTender: e.target.value
                          }
                        })
                      }
                    />
                    <input
                      type="date"
                      className="form-control"
                      title="Selesai"
                      value={formData.tahapPraKontrak.targetSelesaiTender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tahapPraKontrak: {
                            ...formData.tahapPraKontrak,
                            targetSelesaiTender: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group form-grid-full">
                  <label className="form-label">Catatan / Status Pra-Kontrak</label>
                  <textarea
                    className="form-control"
                    placeholder="Contoh: Dokumen persiapan telah diverifikasi Pokja, proses upload SPSE..."
                    value={formData.tahapPraKontrak.catatanPraKontrak}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tahapPraKontrak: {
                          ...formData.tahapPraKontrak,
                          catatanPraKontrak: e.target.value
                        }
                      })
                    }
                  />
                </div>

                {/* TAGGING PEKERJAAN (OPSIONAL) */}
                <div
                  className="form-group form-grid-full"
                  style={{
                    background: '#f8fafc',
                    padding: '16px 18px',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    marginTop: 6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <label className="form-label" style={{ marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6, color: '#0f2c59', fontWeight: 700 }}>
                        <Tag size={15} color="#0284c7" />
                        <span>Tagging / Label Prioritas Pekerjaan (Opsional)</span>
                      </label>
                      <span className="form-help" style={{ margin: 0 }}>
                        Tandai paket pekerjaan ini (misal: <em>Program Prioritas</em>, <em>DBHCHT</em>, <em>Kemiskinan</em>, dll). Klik label untuk memilih atau membatalkan.
                      </span>
                    </div>
                  </div>

                  {/* Tag Chips Selection */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, marginBottom: 14 }}>
                    {(masterTags || []).map((tag) => {
                      const isSelected = (formData.tags || []).includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 14px',
                            borderRadius: 9999,
                            fontSize: 12.5,
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            border: isSelected ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                            background: isSelected ? '#eff6ff' : '#ffffff',
                            color: isSelected ? '#1d4ed8' : '#475569',
                            boxShadow: isSelected ? '0 1px 3px rgba(37,99,235,0.15)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add New Tag Directly */}
                  <div style={{ display: 'flex', gap: 8, maxWidth: 440 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+ Ketik nama tagging baru..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNewTag();
                        }
                      }}
                      style={{ padding: '6px 12px', fontSize: 12.5 }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={handleAddNewTag}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <Plus size={14} />
                      Tambah Tagging
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DATA KONTRAK & REKANAN CV */}
            {activeTab === 'kontrak' && (
              <div>
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 10,
                    background: formData.isKontrak ? '#f0fdf4' : '#fffbeb',
                    border: formData.isKontrak ? '1px solid #bbf7d0' : '1px solid #fde68a',
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 14 }}>
                      {formData.isKontrak
                        ? 'Status: Pekerjaan Sudah Masuk Tahap Kontrak'
                        : 'Status: Masih Tahap Pra-Kontrak'}
                    </strong>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      Centang status di samping jika tender/pengadaan telah selesai dan SPK/Kontrak telah ditandatangani.
                    </div>
                  </div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: 13
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.isKontrak}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isKontrak: e.target.checked,
                          tahapPraKontrak: {
                            ...formData.tahapPraKontrak,
                            status: e.target.checked ? 'kontrak' : formData.tahapPraKontrak.status
                          }
                        })
                      }
                      style={{ width: 18, height: 18, accentColor: '#059669' }}
                    />
                    Sudah Terkontrak
                  </label>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Nama Rekanan / Penyedia (CV / PT) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: CV. Mandiri Jaya Konstruksi"
                      value={formData.dataKontrak.namaPenyedia}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataKontrak: { ...formData.dataKontrak, namaPenyedia: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nomor Kontrak / SPK</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="602.1/.../SP/..."
                      value={formData.dataKontrak.nomorKontrak}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataKontrak: { ...formData.dataKontrak, nomorKontrak: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tanggal Penandatanganan Kontrak</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dataKontrak.tanggalKontrak}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataKontrak: { ...formData.dataKontrak, tanggalKontrak: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nilai Kontrak (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={formData.dataKontrak.nilaiKontrak || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataKontrak: {
                            ...formData.dataKontrak,
                            nilaiKontrak: parseFloat(e.target.value) || 0
                          }
                        })
                      }
                    />
                    <span className="form-help">
                      Terbilang: Rp {(formData.dataKontrak.nilaiKontrak || 0).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">NPWP Penyedia</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="00.000.000.0-000.000"
                      value={formData.dataKontrak.npwpPenyedia}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataKontrak: { ...formData.dataKontrak, npwpPenyedia: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rekening & Bank Rekanan</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nama Bank (mis. Bank Jateng)"
                        value={formData.dataKontrak.bankPenyedia}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dataKontrak: { ...formData.dataKontrak, bankPenyedia: e.target.value }
                          })
                        }
                        style={{ flex: 1 }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="No. Rekening"
                        value={formData.dataKontrak.nomorRekening}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dataKontrak: { ...formData.dataKontrak, nomorRekening: e.target.value }
                          })
                        }
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Waktu Pelaksanaan (Hari Kalender)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="120"
                      value={formData.dataKontrak.waktuPelaksanaan || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataKontrak: {
                            ...formData.dataKontrak,
                            waktuPelaksanaan: parseInt(e.target.value, 10) || 0
                          }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Periode Kontrak / SPMK (Mulai & Selesai) {formData.isKontrak && <span className="required">*</span>}
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="date"
                        className="form-control"
                        title="Tanggal Mulai Kontrak (SPMK)"
                        value={formData.dataKontrak.tanggalMulai}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dataKontrak: { ...formData.dataKontrak, tanggalMulai: e.target.value }
                          })
                        }
                        required={formData.isKontrak}
                      />
                      <input
                        type="date"
                        className="form-control"
                        title="Tanggal Akhir Kontrak (Batas Selesai)"
                        value={formData.dataKontrak.tanggalSelesai}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dataKontrak: { ...formData.dataKontrak, tanggalSelesai: e.target.value }
                          })
                        }
                        required={formData.isKontrak}
                      />
                    </div>
                    <span className="form-help">
                      Isian Tanggal Mulai dan Tanggal Selesai Kontrak wajib untuk status Kontrak
                    </span>
                  </div>

                  <div className="form-group form-grid-full">
                    <label className="form-label">Konsultan Pengawas / Tim Pengawas</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: CV. Bina Karya Konsultan"
                      value={formData.dataKontrak.konsultanPengawas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataKontrak: { ...formData.dataKontrak, konsultanPengawas: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROGRES FISIK (0 - 100%) */}
            {activeTab === 'fisik' && (
              <div className="form-grid">
                <div
                  className="form-grid-full"
                  style={{
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59' }}>
                      Ringkasan Status Deviasi Fisik
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Rencana: {formData.dataFisik.progresRencana}% • Realisasi: {formData.dataFisik.progresRealisasi}%
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        padding: '6px 14px',
                        borderRadius: 9999,
                        fontSize: 13,
                        fontWeight: 800,
                        background:
                          formData.dataFisik.progresRealisasi >= 100
                            ? '#dbeafe'
                            : parseFloat(deviasiFisik) < -5
                            ? '#fee2e2'
                            : parseFloat(deviasiFisik) < 0
                            ? '#fef3c7'
                            : '#dcfce7',
                        color:
                          formData.dataFisik.progresRealisasi >= 100
                            ? '#1d4ed8'
                            : parseFloat(deviasiFisik) < -5
                            ? '#b91c1c'
                            : parseFloat(deviasiFisik) < 0
                            ? '#b45309'
                            : '#15803d'
                      }}
                    >
                      Deviasi: {parseFloat(deviasiFisik) >= 0 ? `+${deviasiFisik}%` : `${deviasiFisik}%`} (
                      {formData.dataFisik.progresRealisasi >= 100
                        ? 'Selesai'
                        : parseFloat(deviasiFisik) < -5
                        ? 'Kritis / SCM'
                        : parseFloat(deviasiFisik) < 0
                        ? 'Perhatian'
                        : 'Aman'}
                      )
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Target Progres Rencana Kumulatif (%) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-control"
                    placeholder="0.00"
                    value={formData.dataFisik.progresRencana}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataFisik: {
                          ...formData.dataFisik,
                          progresRencana: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Realisasi Fisik Terkini (%) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="form-control"
                    placeholder="0.00"
                    value={formData.dataFisik.progresRealisasi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataFisik: {
                          ...formData.dataFisik,
                          progresRealisasi: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                  />
                </div>

                <div className="form-group form-grid-full">
                  <label className="form-label">Kendala Lapangan & Solusi Tindak Lanjut</label>
                  <textarea
                    className="form-control"
                    placeholder="Contoh: Terjadi hujan deras di lokasi selama 3 hari berturut-turut, kontraktor menambah jam kerja / lembur..."
                    value={formData.dataFisik.kendalaLapangan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataFisik: {
                          ...formData.dataFisik,
                          kendalaLapangan: e.target.value
                        }
                      })
                    }
                  />
                </div>
              </div>
            )}

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              {isEdit ? 'Simpan Perubahan' : 'Simpan Paket Pekerjaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
