import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Tag,
  Clock,
  Receipt,
  Plus,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Building2,
  Image as ImageIcon,
  Globe,
  Save,
  MapPin,
  ExternalLink,
  Award,
  UserCheck,
  Briefcase,
  Layers,
  RotateCcw,
  DollarSign,
  Coins
} from 'lucide-react';

const SystemSettingsModal = ({ isOpen, onClose }) => {
  const {
    tags,
    addTag,
    deleteTag,
    kategoriPekerjaanList = [],
    addKategoriPekerjaan,
    deleteKategoriPekerjaan,
    addJenisPengadaanToKategori,
    deleteJenisPengadaanFromKategori,
    resetKategoriPekerjaan,
    sumberDanaList = [],
    addSumberDana,
    deleteSumberDana,
    resetSumberDana,
    praKontrakStages,
    addPraKontrakStage,
    deletePraKontrakStage,
    spjStatuses,
    addSpjStatus,
    deleteSpjStatus,
    systemSettings,
    updateSystemSettings,
    addGalleryItem,
    deleteGalleryItem,
    canManageSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState('identitas'); // 'identitas' | 'pimpinan' | 'galeri' | 'kategori' | 'sumberdana' | 'prakontrak' | 'tagging' | 'spj'

  // Input states
  const [newTagInput, setNewTagInput] = useState('');
  const [newStageInput, setNewStageInput] = useState('');
  const [newSumberDanaInput, setNewSumberDanaInput] = useState('');
  const [newKategoriInput, setNewKategoriInput] = useState({ nama: '', deskripsi: '' });
  const [newJenisInputs, setNewJenisInputs] = useState({});
  const [newSpjInput, setNewSpjInput] = useState({
    label: '',
    deskripsi: '',
    warna: '#0284c7'
  });

  // Identity Form State
  const [identityForm, setIdentityForm] = useState({
    namaSistem: '',
    subNama: '',
    instansi: '',
    singkatanInstansi: '',
    deskripsi: '',
    logoUrl: '',
    maxPublicHighlights: 10,
    alamat: '',
    telepon: '',
    email: '',
    website: ''
  });

  // Officials (Kadin & Sekdin) Form State
  const [officialsForm, setOfficialsForm] = useState({
    namaKepalaDinas: '',
    nipKepalaDinas: '',
    pangkatKepalaDinas: '',
    jabatanKepalaDinas: '',
    namaSekretaris: '',
    nipSekretaris: '',
    pangkatSekretaris: '',
    jabatanSekretaris: ''
  });

  // Gallery Form State
  const [newGalleryInput, setNewGalleryInput] = useState({
    judul: '',
    kategori: 'Gedung Kantor',
    lokasi: '',
    tahun: 2025,
    deskripsi: '',
    url: ''
  });

  // Sync identity and officials form with systemSettings on mount or settings change
  useEffect(() => {
    if (systemSettings) {
      setIdentityForm({
        namaSistem: systemSettings.namaSistem || 'SIMON - SATUPUTARU',
        subNama: (systemSettings.subNama || 'Sistem Informasi Monitoring Progres Pekerjaan DINPUTARU').replace(/Dinas PUPR/g, 'DINPUTARU').replace(/PUPR/g, 'DINPUTARU'),
        instansi: systemSettings.instansi || 'Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak',
        singkatanInstansi: systemSettings.singkatanInstansi || 'DINPUTARU Demak',
        deskripsi: systemSettings.deskripsi || '',
        logoUrl: systemSettings.logoUrl || '',
        maxPublicHighlights: systemSettings.maxPublicHighlights !== undefined ? systemSettings.maxPublicHighlights : 10,
        alamat: systemSettings.alamat || '',
        telepon: systemSettings.telepon || '',
        email: systemSettings.email || '',
        website: systemSettings.website || ''
      });

      setOfficialsForm({
        namaKepalaDinas: systemSettings.namaKepalaDinas || 'Ir. H. Achmad Syafii, CES, MT',
        nipKepalaDinas: systemSettings.nipKepalaDinas || '19680514 199303 1 002',
        pangkatKepalaDinas: systemSettings.pangkatKepalaDinas || 'Pembina Utama Madya (IV/d)',
        jabatanKepalaDinas: systemSettings.jabatanKepalaDinas || 'Kepala Dinas Pekerjaan Umum dan Penataan Ruang',
        namaSekretaris: systemSettings.namaSekretaris || 'Dra. Hj. Siti Nurhasanah, MM',
        nipSekretaris: systemSettings.nipSekretaris || '19720819 199803 2 003',
        pangkatSekretaris: systemSettings.pangkatSekretaris || 'Pembina Tingkat I (IV/b)',
        jabatanSekretaris: (systemSettings.jabatanSekretaris || 'Sekretaris DINPUTARU').replace(/PUPR/g, 'DINPUTARU')
      });
    }
  }, [systemSettings, isOpen]);

  if (!isOpen || !canManageSettings) return null;

  const handleAddTagSubmit = (e) => {
    e.preventDefault();
    if (addTag(newTagInput)) {
      setNewTagInput('');
    }
  };

  const handleAddStageSubmit = (e) => {
    e.preventDefault();
    if (!newStageInput.trim()) return;
    addPraKontrakStage({
      label: newStageInput.trim()
    });
    setNewStageInput('');
  };

  const handleAddSumberDanaSubmit = (e) => {
    e.preventDefault();
    if (!newSumberDanaInput.trim()) return;
    if (addSumberDana(newSumberDanaInput.trim())) {
      setNewSumberDanaInput('');
    }
  };

  const handleAddSpjSubmit = (e) => {
    e.preventDefault();
    if (!newSpjInput.label.trim()) return;
    addSpjStatus({
      label: newSpjInput.label.trim(),
      deskripsi: newSpjInput.deskripsi.trim() || 'Status verifikasi SPJ',
      warna: newSpjInput.warna,
      bgLight: `${newSpjInput.warna}15`,
      borderColor: `${newSpjInput.warna}40`
    });
    setNewSpjInput({ label: '', deskripsi: '', warna: '#0284c7' });
  };

  const handleSaveIdentity = (e) => {
    e.preventDefault();
    updateSystemSettings(identityForm);
  };

  const handleAddGallerySubmit = (e) => {
    e.preventDefault();
    if (!newGalleryInput.judul.trim() || !newGalleryInput.url.trim()) {
      alert('Judul foto dan URL gambar wajib diisi!');
      return;
    }
    addGalleryItem(newGalleryInput);
    setNewGalleryInput({
      judul: '',
      kategori: 'Gedung Kantor',
      lokasi: '',
      tahun: 2025,
      deskripsi: '',
      url: ''
    });
  };

  const handleAddKategoriSubmit = (e) => {
    e.preventDefault();
    if (!newKategoriInput.nama.trim()) return;
    if (addKategoriPekerjaan(newKategoriInput)) {
      setNewKategoriInput({ nama: '', deskripsi: '' });
    }
  };

  const handleAddJenisSubmit = (kategoriId, e) => {
    e.preventDefault();
    const val = newJenisInputs[kategoriId];
    if (!val || !val.trim()) return;
    if (addJenisPengadaanToKategori(kategoriId, val.trim())) {
      setNewJenisInputs((prev) => ({ ...prev, [kategoriId]: '' }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860 }}>
        <div className="modal-header">
          <div>
            <h3>Pengaturan Master & Keberlanjutan Sistem (Super Admin)</h3>
            <p>
              Konfigurasi identitas sistem, deskripsi, logo, galeri landing page, master tagging, alur pra-kontrak, tipe pekerjaan & pengadaan, dan status SPJ
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Nav */}
        <div style={{ padding: '0 24px', background: '#fafbfc', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <div className="tab-nav" style={{ marginBottom: 0, flexWrap: 'nowrap', minWidth: 'max-content' }}>
            <button
              className={`tab-btn ${activeTab === 'identitas' ? 'active' : ''}`}
              onClick={() => setActiveTab('identitas')}
            >
              <Globe size={15} />
              1. Identitas & Beranda
            </button>
            <button
              className={`tab-btn ${activeTab === 'pimpinan' ? 'active' : ''}`}
              onClick={() => setActiveTab('pimpinan')}
            >
              <Award size={15} />
              2. Pimpinan Dinas (Kadin & Sekdin)
            </button>
            <button
              className={`tab-btn ${activeTab === 'galeri' ? 'active' : ''}`}
              onClick={() => setActiveTab('galeri')}
            >
              <ImageIcon size={15} />
              3. Galeri Bangunan DINPUTARU ({(systemSettings?.galeri || []).length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'kategori' ? 'active' : ''}`}
              onClick={() => setActiveTab('kategori')}
            >
              <Briefcase size={15} />
              4. Tipe Pekerjaan & Pengadaan ({kategoriPekerjaanList.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'sumberdana' ? 'active' : ''}`}
              onClick={() => setActiveTab('sumberdana')}
            >
              <Coins size={15} />
              5. Sumber Pendanaan ({sumberDanaList.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'prakontrak' ? 'active' : ''}`}
              onClick={() => setActiveTab('prakontrak')}
            >
              <Clock size={15} />
              6. Alur Pra-Kontrak ({praKontrakStages.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'tagging' ? 'active' : ''}`}
              onClick={() => setActiveTab('tagging')}
            >
              <Tag size={15} />
              7. Master Tagging ({tags.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'spj' ? 'active' : ''}`}
              onClick={() => setActiveTab('spj')}
            >
              <Receipt size={15} />
              8. Status SPJ ({spjStatuses.length})
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* TAB: IDENTITAS & LOGO SISTEM */}
          {activeTab === 'identitas' && (
            <div>
              <form onSubmit={handleSaveIdentity}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  {/* Nama Sistem */}
                  <div className="form-group">
                    <label className="form-label">Nama Aplikasi / Sistem</label>
                    <input
                      type="text"
                      className="form-control"
                      value={identityForm.namaSistem}
                      onChange={(e) => setIdentityForm({ ...identityForm, namaSistem: e.target.value })}
                      required
                    />
                  </div>

                  {/* Sub Nama */}
                  <div className="form-group">
                    <label className="form-label">Sub Judul / Tagline Sistem</label>
                    <input
                      type="text"
                      className="form-control"
                      value={identityForm.subNama}
                      onChange={(e) => setIdentityForm({ ...identityForm, subNama: e.target.value })}
                    />
                  </div>

                  {/* Instansi */}
                  <div className="form-group">
                    <label className="form-label">Nama Dinas / Instansi Lengkap</label>
                    <input
                      type="text"
                      className="form-control"
                      value={identityForm.instansi}
                      onChange={(e) => setIdentityForm({ ...identityForm, instansi: e.target.value })}
                      required
                    />
                  </div>

                  {/* Singkatan Instansi */}
                  <div className="form-group">
                    <label className="form-label">Singkatan Dinas</label>
                    <input
                      type="text"
                      className="form-control"
                      value={identityForm.singkatanInstansi}
                      onChange={(e) => setIdentityForm({ ...identityForm, singkatanInstansi: e.target.value })}
                    />
                  </div>

                  {/* Maksimal Highlight Beranda Publik */}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">
                      Batas Maksimal Highlight Pekerjaan di Landing Page Publik (Default: 10 Paket)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        className="form-control"
                        style={{ width: 140 }}
                        value={identityForm.maxPublicHighlights}
                        onChange={(e) =>
                          setIdentityForm({
                            ...identityForm,
                            maxPublicHighlights: parseInt(e.target.value, 10) || 10
                          })
                        }
                        required
                      />
                      <span style={{ fontSize: 12.5, color: '#64748b' }}>
                        Menentukan berapa banyak paket pekerjaan berstatus sorotan publik yang ditampilkan di halaman depan masyarakat.
                      </span>
                    </div>
                  </div>

                  {/* Logo URL */}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Logo Sistem (URL Gambar / Foto Lambang Dinas)</label>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="Contoh: https://dinputaru.demakkab.go.id/logo.png (Kosongkan untuk lambang PU default)"
                        value={identityForm.logoUrl}
                        onChange={(e) => setIdentityForm({ ...identityForm, logoUrl: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          border: '1.5px solid #cbd5e1',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: identityForm.logoUrl ? '#ffffff' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#fff',
                          fontWeight: 900
                        }}
                      >
                        {identityForm.logoUrl ? (
                          <img
                            src={identityForm.logoUrl}
                            alt="Logo Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          'PU'
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: 11.5, color: '#64748b', marginTop: 4, display: 'block' }}>
                      Logo ini akan tampil pada Navbar Landing Page, Header Panel Internal, dan Kop Cetakan Laporan.
                    </span>
                  </div>

                  {/* Deskripsi Sistem */}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Deskripsi Sistem (Tampil di Landing Page Publik)</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={identityForm.deskripsi}
                      onChange={(e) => setIdentityForm({ ...identityForm, deskripsi: e.target.value })}
                      placeholder="Jelaskan tujuan, fungsi, dan cakupan sistem monitoring dinas..."
                      required
                    />
                  </div>

                  {/* Alamat Dinas */}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Alamat Kantor Dinas</label>
                    <input
                      type="text"
                      className="form-control"
                      value={identityForm.alamat}
                      onChange={(e) => setIdentityForm({ ...identityForm, alamat: e.target.value })}
                    />
                  </div>

                  {/* Telepon */}
                  <div className="form-group">
                    <label className="form-label">Nomor Telepon Kantor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={identityForm.telepon}
                      onChange={(e) => setIdentityForm({ ...identityForm, telepon: e.target.value })}
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">Email Resmi Dinas</label>
                    <input
                      type="email"
                      className="form-control"
                      value={identityForm.email}
                      onChange={(e) => setIdentityForm({ ...identityForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                    <Save size={15} />
                    Simpan Identitas & Beranda Sistem
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: PIMPINAN DINAS & PENANDATANGAN RESMI (KADIN & SEKRETARIS) */}
          {activeTab === 'pimpinan' && (
            <div>
              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12
                }}
              >
                <Award size={22} color="#0284c7" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 13, color: '#0369a1', lineHeight: 1.5 }}>
                  <strong>Kontrol Penuh Super Admin untuk Pimpinan Dinas:</strong> Anda dapat mengatur nama, NIP, pangkat/golongan, dan jabatan resmi untuk <strong>Kepala Dinas</strong> dan <strong>Sekretaris Dinas</strong>. Data ini akan otomatis digunakan pada <strong>lembar cetak Laporan Kedinasan</strong> serta <strong>profil akun Kepala Dinas & Sekretaris</strong>.
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateSystemSettings(officialsForm);
                }}
              >
                {/* 1. KEPALA DINAS */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 14,
                    padding: '20px 24px',
                    marginBottom: 20
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #0f2c59, #1e40af)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 14
                      }}
                    >
                      1
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f2c59', margin: 0 }}>
                        Kepala Dinas Pekerjaan Umum dan Penataan Ruang
                      </h4>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Pejabat Pengguna Anggaran (PA) / Pimpinan Tertinggi</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Nama Lengkap & Gelar Kepala Dinas</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Ir. H. Achmad Syafii, CES, MT"
                        value={officialsForm.namaKepalaDinas}
                        onChange={(e) => setOfficialsForm({ ...officialsForm, namaKepalaDinas: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">NIP Kepala Dinas</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: 19680514 199303 1 002"
                        value={officialsForm.nipKepalaDinas}
                        onChange={(e) => setOfficialsForm({ ...officialsForm, nipKepalaDinas: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pangkat / Golongan Ruang</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Pembina Utama Madya (IV/d)"
                        value={officialsForm.pangkatKepalaDinas}
                        onChange={(e) => setOfficialsForm({ ...officialsForm, pangkatKepalaDinas: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Jabatan Kedinasan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={officialsForm.jabatanKepalaDinas}
                        onChange={(e) => setOfficialsForm({ ...officialsForm, jabatanKepalaDinas: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SEKRETARIS DINAS */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 14,
                    padding: '20px 24px',
                    marginBottom: 20
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 14
                      }}
                    >
                      2
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f2c59', margin: 0 }}>
                        Sekretaris DINPUTARU
                      </h4>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Koordinator Administrasi, Program & Keuangan</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Nama Lengkap & Gelar Sekretaris Dinas</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Dra. Hj. Siti Nurhasanah, MM"
                        value={officialsForm.namaSekretaris}
                        onChange={(e) => setOfficialsForm({ ...officialsForm, namaSekretaris: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">NIP Sekretaris Dinas</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: 19720819 199803 2 003"
                        value={officialsForm.nipSekretaris}
                        onChange={(e) => setOfficialsForm({ ...officialsForm, nipSekretaris: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pangkat / Golongan Ruang</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Pembina Tingkat I (IV/b)"
                        value={officialsForm.pangkatSekretaris}
                        onChange={(e) => setOfficialsForm({ ...officialsForm, pangkatSekretaris: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Jabatan Kedinasan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={officialsForm.jabatanSekretaris}
                        onChange={(e) => setOfficialsForm({ ...officialsForm, jabatanSekretaris: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                    <Save size={15} />
                    Simpan Data Pimpinan Dinas
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: GALERI BANGUNAN DINPUTARU */}
          {activeTab === 'galeri' && (
            <div>
              {/* Form Tambah Foto Galeri */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '18px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  marginBottom: 24
                }}
              >
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f2c59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={16} color="#0284c7" />
                  Tambah Foto Bangunan / Infrastruktur Baru ke Galeri Landing Page
                </h4>

                <form onSubmit={handleAddGallerySubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                    <div>
                      <label className="form-label">Nama Bangunan / Infrastruktur</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Gedung Workshop DINPUTARU Demak"
                        value={newGalleryInput.judul}
                        onChange={(e) => setNewGalleryInput({ ...newGalleryInput, judul: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Kategori Infrastruktur</label>
                      <select
                        className="form-control"
                        value={newGalleryInput.kategori}
                        onChange={(e) => setNewGalleryInput({ ...newGalleryInput, kategori: e.target.value })}
                      >
                        <option value="Gedung Kantor">Gedung Kantor / Fasilitas Pelayanan</option>
                        <option value="Bina Marga">Bina Marga (Jalan & Jembatan)</option>
                        <option value="Cipta Karya">Cipta Karya (Bangunan Gedung & Air Minum)</option>
                        <option value="Sumber Daya Air">Sumber Daya Air (Irigasi & Pengendali Banjir)</option>
                        <option value="Tata Ruang">Tata Ruang & Penataan Kawasan</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Lokasi Bangunan (Desa / Kecamatan)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Jl. Kyai Singkil, Kec. Demak"
                        value={newGalleryInput.lokasi}
                        onChange={(e) => setNewGalleryInput({ ...newGalleryInput, lokasi: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Tahun Pelaksanaan / Berdiri</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newGalleryInput.tahun}
                        onChange={(e) => setNewGalleryInput({ ...newGalleryInput, tahun: parseInt(e.target.value, 10) || 2025 })}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">URL Foto Bangunan (Format JPG/PNG)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://images.unsplash.com/... atau URL foto dinas"
                        value={newGalleryInput.url}
                        onChange={(e) => setNewGalleryInput({ ...newGalleryInput, url: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Deskripsi Bangunan / Fasilitas</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Keterangan singkat fungsi dan kapasitas gedung/infrastruktur..."
                        value={newGalleryInput.deskripsi}
                        onChange={(e) => setNewGalleryInput({ ...newGalleryInput, deskripsi: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Plus size={15} />
                      Simpan & Tampilkan di Landing Page
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Foto Galeri yang Ada */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="form-label" style={{ fontWeight: 800 }}>
                  Daftar Foto Galeri Landing Page ({(systemSettings?.galeri || []).length} Foto)
                </span>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Foto di bawah ini tampil di halaman publik Landing Page untuk masyarakat
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                {(systemSettings?.galeri || []).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ height: 130, background: '#f1f5f9', position: 'relative' }}>
                      <img
                        src={item.url}
                        alt={item.judul}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(15, 23, 42, 0.75)',
                          color: '#ffffff',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        {item.kategori}
                      </span>
                    </div>

                    <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: '#0f2c59', marginBottom: 4 }}>
                        {item.judul}
                      </div>
                      <div style={{ fontSize: 11, color: '#0284c7', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        <MapPin size={11} />
                        <span>{item.lokasi || 'Kabupaten Demak'} ({item.tahun})</span>
                      </div>
                      <p style={{ fontSize: 11.5, color: '#64748b', margin: '0 0 10px', lineHeight: 1.4, flex: 1 }}>
                        {item.deskripsi}
                      </p>

                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '3px 8px', fontSize: 11 }}
                          onClick={() => {
                            if (window.confirm(`Hapus foto "${item.judul}" dari galeri landing page?`)) {
                              deleteGalleryItem(item.id);
                            }
                          }}
                        >
                          <Trash2 size={12} />
                          Hapus Foto
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TIPE PEKERJAAN & JENIS PENGADAAN */}
          {activeTab === 'kategori' && (
            <div>
              <div
                style={{
                  background: '#f8fafc',
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  marginBottom: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Briefcase size={18} color="#0284c7" />
                    Manajemen Kategori Pekerjaan & Jenis Pengadaan
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#64748b' }}>
                    Kelola klasifikasi paket pekerjaan (Fisik, Jakon, Barang, Jasa Lainnya, Swakelola) serta opsi jenis pengadaan per kategori.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    if (window.confirm('Kembalikan seluruh Kategori Pekerjaan dan Jenis Pengadaan ke format SOP DINPUTARU standar?')) {
                      resetKategoriPekerjaan();
                    }
                  }}
                  title="Reset ke data default SOP"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                >
                  <RotateCcw size={13} />
                  Reset ke Default SOP
                </button>
              </div>

              {/* Form Tambah Kategori Baru */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: '1px solid #cbd5e1',
                  marginBottom: 24,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <form onSubmit={handleAddKategoriSubmit}>
                  <label className="form-label" style={{ fontWeight: 700, marginBottom: 8, display: 'block' }}>
                    Tambah Kategori / Tipe Pekerjaan Baru:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) auto', gap: 10, alignItems: 'end' }}>
                    <div>
                      <span style={{ fontSize: 11, color: '#64748b', marginBottom: 4, display: 'block' }}>Nama Kategori:</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Misal: Konsultansi Perencanaan..."
                        value={newKategoriInput.nama}
                        onChange={(e) => setNewKategoriInput({ ...newKategoriInput, nama: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: '#64748b', marginBottom: 4, display: 'block' }}>Deskripsi Singkat:</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Keterangan singkat kategori pekerjaan..."
                        value={newKategoriInput.deskripsi}
                        onChange={(e) => setNewKategoriInput({ ...newKategoriInput, deskripsi: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap', height: 38 }}>
                      <Plus size={15} />
                      Tambah Kategori
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Kategori & Jenis Pengadaan Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {kategoriPekerjaanList.map((kat, index) => {
                  const isSwakelola = kat.id === 'swakelola' || kat.nama.toLowerCase().includes('swakelola');
                  return (
                    <div
                      key={kat.id || index}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        padding: '18px 20px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 800, fontSize: 15, color: '#0f2c59' }}>
                              {index + 1}. {kat.nama}
                            </span>
                            <span style={{ fontSize: 11, background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 9999, fontWeight: 700 }}>
                              ID: {kat.id}
                            </span>
                          </div>
                          {kat.deskripsi && (
                            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#64748b' }}>
                              {kat.deskripsi}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Hapus Kategori Ini"
                          onClick={() => {
                            if (window.confirm(`Hapus kategori "${kat.nama}" beserta seluruh jenis pengadaannya?`)) {
                              deleteKategoriPekerjaan(kat.id);
                            }
                          }}
                          style={{ color: '#dc2626' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Section Jenis Pengadaan */}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
                          Jenis Pengadaan Terkait ({kat.jenisPengadaan?.length || 0}):
                        </div>

                        {isSwakelola ? (
                          <div style={{ fontSize: 12, color: '#0369a1', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '8px 12px', borderRadius: 8, fontStyle: 'italic' }}>
                            ℹ️ Kategori Swakelola tidak memiliki jenis pengadaan terpisah — langsung berstatus pengadaan Swakelola.
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                              {kat.jenisPengadaan && kat.jenisPengadaan.length > 0 ? (
                                kat.jenisPengadaan.map((jp, jpIdx) => (
                                  <span
                                    key={jpIdx}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 6,
                                      padding: '5px 12px',
                                      borderRadius: 9999,
                                      fontSize: 12,
                                      fontWeight: 600,
                                      background: '#f8fafc',
                                      color: '#0f2c59',
                                      border: '1px solid #cbd5e1'
                                    }}
                                  >
                                    <span>{jp}</span>
                                    <button
                                      type="button"
                                      onClick={() => deleteJenisPengadaanFromKategori(kat.id, jp)}
                                      title={`Hapus ${jp}`}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                      onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                                    >
                                      <X size={13} />
                                    </button>
                                  </span>
                                ))
                              ) : (
                                <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                                  Belum ada jenis pengadaan untuk kategori ini.
                                </span>
                              )}
                            </div>

                            {/* Inline input untuk tambah jenis pengadaan */}
                            <form
                              onSubmit={(e) => handleAddJenisSubmit(kat.id, e)}
                              style={{ display: 'flex', gap: 8, maxWidth: 420 }}
                            >
                              <input
                                type="text"
                                className="form-control"
                                placeholder={`+ Tambah jenis pengadaan untuk ${kat.nama}...`}
                                value={newJenisInputs[kat.id] || ''}
                                onChange={(e) =>
                                  setNewJenisInputs({
                                    ...newJenisInputs,
                                    [kat.id]: e.target.value
                                  })
                                }
                                style={{ fontSize: 12, padding: '6px 12px', height: 34 }}
                              />
                              <button
                                type="submit"
                                className="btn btn-outline btn-sm"
                                style={{ whiteSpace: 'nowrap', fontSize: 12 }}
                              >
                                <Plus size={14} />
                                Tambah
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: SUMBER PENDANAAN */}
          {activeTab === 'sumberdana' && (
            <div>
              <div
                style={{
                  background: '#f8fafc',
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  marginBottom: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Coins size={18} color="#0284c7" />
                    Manajemen Sumber Pendanaan Anggaran
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#64748b' }}>
                    Super Admin dapat menambah, menghapus, atau mereset daftar sumber dana APBD yang muncul di formulir input paket pekerjaan dinas.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    if (window.confirm('Kembalikan daftar Sumber Pendanaan ke format standar DINPUTARU Kabupaten Demak?')) {
                      resetSumberDana();
                    }
                  }}
                  title="Reset ke data default standar"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                >
                  <RotateCcw size={13} />
                  Reset ke Standar
                </button>
              </div>

              {/* Form Tambah Sumber Dana Baru */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: '1px solid #cbd5e1',
                  marginBottom: 24,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <form onSubmit={handleAddSumberDanaSubmit}>
                  <label className="form-label" style={{ fontWeight: 700, marginBottom: 8, display: 'block' }}>
                    Tambah Sumber Pendanaan Baru:
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Dana Desa (DD), Hibah Luar Negeri, DBH-DR, dll..."
                      value={newSumberDanaInput}
                      onChange={(e) => setNewSumberDanaInput(e.target.value)}
                      style={{ flex: 1 }}
                      required
                    />
                    <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                      <Plus size={15} />
                      Tambah Sumber Dana
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Sumber Dana */}
              <label className="form-label" style={{ marginBottom: 12, display: 'block', fontWeight: 800 }}>
                Daftar Sumber Pendanaan Aktif ({sumberDanaList.length} Sumber):
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                {sumberDanaList.map((dana, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#16a34a'
                        }}
                      >
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f2c59' }}>{dana}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Urutan #{idx + 1}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-icon"
                      title={`Hapus sumber dana "${dana}"`}
                      onClick={() => {
                        if (window.confirm(`Hapus sumber pendanaan "${dana}" dari sistem?`)) {
                          deleteSumberDana(dana);
                        }
                      }}
                      style={{ color: '#dc2626' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: MASTER TAGGING */}
          {activeTab === 'tagging' && (
            <div>
              <div
                style={{
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  marginBottom: 20
                }}
              >
                <form onSubmit={handleAddTagSubmit}>
                  <label className="form-label">Tambah Tagging / Label Program Baru:</label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: DBHCHT, Penanganan Stunting, Program Prioritas..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                      <Plus size={15} />
                      Tambah Tagging
                    </button>
                  </div>
                </form>
              </div>

              <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>
                Daftar Tagging Tersedia ({tags.length} Label):
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {tags.map((tag, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 14px',
                      borderRadius: 8,
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#0f2c59'
                    }}
                  >
                    <span>🏷️ {tag}</span>
                    <button
                      type="button"
                      onClick={() => deleteTag(tag)}
                      title="Hapus Tagging"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: 2,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ALUR TAHAPAN PRA-KONTRAK */}
          {activeTab === 'prakontrak' && (
            <div>
              <div
                style={{
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  marginBottom: 20
                }}
              >
                <form onSubmit={handleAddStageSubmit}>
                  <label className="form-label">Tambah Alur / Tahapan Pra-Kontrak Baru:</label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Review Pokja Khusus, Aanwijzing Lapangan, dll..."
                      value={newStageInput}
                      onChange={(e) => setNewStageInput(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                      <Plus size={15} />
                      Tambah Tahapan
                    </button>
                  </div>
                </form>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>Urutan</th>
                      <th>Nama Tahapan Pra-Kontrak</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {praKontrakStages.map((st, idx) => (
                      <tr key={st.id || idx}>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: '#0f2c59' }}>
                          {idx + 1}
                        </td>
                        <td style={{ fontWeight: 600 }}>{st.label}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Hapus Tahapan"
                            onClick={() => {
                              if (window.confirm(`Hapus tahapan ${st.label}?`)) {
                                deletePraKontrakStage(st.id);
                              }
                            }}
                            style={{ color: '#dc2626' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STATUS ADMINISTRASI SPJ */}
          {activeTab === 'spj' && (
            <div>
              <div
                style={{
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  marginBottom: 20
                }}
              >
                <form onSubmit={handleAddSpjSubmit}>
                  <label className="form-label">Tambah Status Administrasi SPJ Baru:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 100px auto', gap: 10, marginTop: 8 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Label Status (mis. Verifikasi BPK)"
                      value={newSpjInput.label}
                      onChange={(e) => setNewSpjInput({ ...newSpjInput, label: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Deskripsi singkat"
                      value={newSpjInput.deskripsi}
                      onChange={(e) => setNewSpjInput({ ...newSpjInput, deskripsi: e.target.value })}
                    />
                    <input
                      type="color"
                      className="form-control"
                      value={newSpjInput.warna}
                      onChange={(e) => setNewSpjInput({ ...newSpjInput, warna: e.target.value })}
                      title="Pilih Warna Status"
                      style={{ height: 40, padding: 4 }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                      <Plus size={15} />
                      Tambah
                    </button>
                  </div>
                </form>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Status Administrasi</th>
                      <th>Deskripsi</th>
                      <th>Warna Label</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spjStatuses.map((st, idx) => (
                      <tr key={st.id || idx}>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: 9999,
                              fontSize: 12,
                              fontWeight: 800,
                              background: st.bgLight || '#f1f5f9',
                              color: st.warna || '#0f2c59',
                              border: `1px solid ${st.borderColor || '#cbd5e1'}`
                            }}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: '#64748b' }}>{st.deskripsi}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 14, height: 14, borderRadius: '50%', background: st.warna }} />
                            <code style={{ fontSize: 11 }}>{st.warna}</code>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Hapus Status SPJ"
                            onClick={() => {
                              if (window.confirm(`Hapus status SPJ ${st.label}?`)) {
                                deleteSpjStatus(st.id);
                              }
                            }}
                            style={{ color: '#dc2626' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsModal;
