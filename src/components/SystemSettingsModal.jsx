import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Tag,
  Clock,
  Receipt,
  Plus,
  Trash2,
  X,
  Image as ImageIcon,
  Globe,
  Save,
  MapPin,
  Award,
  Briefcase,
  Layers,
  RotateCcw,
  DollarSign,
  Coins,
  ChevronRight,
  Sliders,
  Type,
  FileText,
  Sparkles,
  AlignLeft,
  Check,
  Eye,
  Upload,
  FolderTree,
  Database,
  Printer,
  Server,
  RefreshCw,
  ExternalLink,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DEFAULT_CUSTOM_TEXTS, DEFAULT_BIDANG_DESCRIPTIONS, BIDANG_LIST } from '../data/constants';
import { LOGO_PRESETS } from '../data/logoPresets';
import AppLogo from './AppLogo';
import SipdMasterModal from './SipdMasterModal';

const SystemSettingsModal = ({ isOpen, onClose }) => {
  const {
    projects = [],
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
    canManageSettings,
    sipdPrograms = [],
    sipdKegiatans = [],
    sipdSubKegiatans = []
  } = useApp();

  const [activeTab, setActiveTab] = useState('identitas'); // 'identitas' | 'pimpinan' | 'galeri' | 'kategori' | 'sumberdana' | 'prakontrak' | 'tagging' | 'spj' | 'sipd_master'
  const [isSipdModalOpen, setIsSipdModalOpen] = useState(false);
  const logoFileInputRef = useRef(null);

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
  const [newSlideUnggulanInput, setNewSlideUnggulanInput] = useState({
    projectId: '',
    judul: '',
    subKegiatan: '',
    bidangId: 'sda_bk',
    kategori: 'Pekerjaan Konstruksi (Fisik)',
    paguAnggaran: 0,
    nilaiKontrak: 0,
    pelaksana: '',
    nomorKontrak: '',
    progresFisik: 0,
    progresKeuangan: 0,
    sp2d: 0,
    lokasi: '',
    deskripsi: '',
    url: ''
  });

  const handleSelectProjectForSlide = (projectId) => {
    const p = projects.find((x) => x.id === projectId);
    if (p) {
      setNewSlideUnggulanInput({
        projectId: p.id,
        judul: p.namaPaket,
        subKegiatan: p.subKegiatan || p.subBagian || '',
        bidangId: p.bidangId || 'sda_bk',
        kategori: p.kategoriPaket || p.kategoriPekerjaan || 'Pekerjaan Konstruksi (Fisik)',
        paguAnggaran: parseFloat(p.paguAnggaran) || 0,
        nilaiKontrak: p.dataKontrak?.nilaiKontrak || 0,
        pelaksana: p.dataKontrak?.namaPenyedia || '',
        nomorKontrak: p.dataKontrak?.nomorKontrak || '',
        progresFisik: parseFloat(p.dataFisik?.progresRealisasi) || 0,
        progresKeuangan: parseFloat(p.dataKeuangan?.persenKeuangan) || 0,
        sp2d: parseFloat(p.dataKeuangan?.totalPencairan) || 0,
        lokasi: p.lokasiLengkap || p.lokasi || `${p.desa || ''}, Kec. ${p.kecamatan || ''}`,
        deskripsi: `Pekerjaan strategis ${p.subKegiatan || p.namaPaket} di Kabupaten Demak.`,
        url: newSlideUnggulanInput.url || 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&auto=format&fit=crop&q=80'
      });
    }
  };

  const handleAddSlideUnggulanSubmit = (e) => {
    e.preventDefault();
    if (!newSlideUnggulanInput.judul.trim()) return;
    const newSlide = {
      ...newSlideUnggulanInput,
      id: `slide-${Date.now()}`
    };
    const currentList = systemSettings?.slideshowUnggulan || [];
    const updated = [...currentList, newSlide];
    updateSystemSettings({ slideshowUnggulan: updated });
    setNewSlideUnggulanInput({
      projectId: '',
      judul: '',
      subKegiatan: '',
      bidangId: 'sda_bk',
      kategori: 'Pekerjaan Konstruksi (Fisik)',
      paguAnggaran: 0,
      nilaiKontrak: 0,
      pelaksana: '',
      nomorKontrak: '',
      progresFisik: 0,
      progresKeuangan: 0,
      sp2d: 0,
      lokasi: '',
      deskripsi: '',
      url: ''
    });
    alert('Slide pekerjaan unggulan berhasil ditambahkan ke beranda publik!');
  };

  const handleDeleteSlideUnggulan = (slideId) => {
    if (window.confirm('Hapus slide pekerjaan unggulan ini dari beranda publik?')) {
      const currentList = systemSettings?.slideshowUnggulan || [];
      const updated = currentList.filter((s) => s.id !== slideId);
      updateSystemSettings({ slideshowUnggulan: updated });
    }
  };

  const [newGalleryInput, setNewGalleryInput] = useState({
    judul: '',
    kategori: 'Gedung Kantor',
    lokasi: '',
    tahun: 2025,
    deskripsi: '',
    url: ''
  });

  // Database Configuration State (Hostinger MySQL)
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    database: 'u490770675_simona',
    user: 'u490770675_adminsimon',
    password: '*Demak2026'
  });
  const [showDbPass, setShowDbPass] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isSavingDb, setIsSavingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState(null);

  // Custom Texts & Bidang Descriptions State (Superadmin)
  const [customTextsForm, setCustomTextsForm] = useState(DEFAULT_CUSTOM_TEXTS);
  const [bidangDescForm, setBidangDescForm] = useState(DEFAULT_BIDANG_DESCRIPTIONS);
  const [activeTextCategory, setActiveTextCategory] = useState('bidang_pelayanan');
  // 'bidang_pelayanan' | 'landing_hero' | 'landing_seksi' | 'landing_footer' | 'panel_internal'

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

      setCustomTextsForm({
        ...DEFAULT_CUSTOM_TEXTS,
        ...(systemSettings.customTexts || {})
      });

      setBidangDescForm({
        ...DEFAULT_BIDANG_DESCRIPTIONS,
        ...(systemSettings.bidangDescriptions || {})
      });
    }
  }, [systemSettings, isOpen]);

  const handleSaveTexts = (e) => {
    if (e) e.preventDefault();
    updateSystemSettings({
      customTexts: customTextsForm,
      bidangDescriptions: bidangDescForm
    });
  };

  const handleResetSingleText = (key) => {
    setCustomTextsForm((prev) => ({
      ...prev,
      [key]: DEFAULT_CUSTOM_TEXTS[key] || ''
    }));
  };

  const handleResetSingleBidang = (bidangId) => {
    setBidangDescForm((prev) => ({
      ...prev,
      [bidangId]: DEFAULT_BIDANG_DESCRIPTIONS[bidangId] || ''
    }));
  };

  const handleResetAllTexts = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh teks dan deskripsi bidang ke pengaturan awal sistem?')) {
      setCustomTextsForm(DEFAULT_CUSTOM_TEXTS);
      setBidangDescForm(DEFAULT_BIDANG_DESCRIPTIONS);
      updateSystemSettings({
        customTexts: DEFAULT_CUSTOM_TEXTS,
        bidangDescriptions: DEFAULT_BIDANG_DESCRIPTIONS
      });
    }
  };

  // Checked before render
  // if (!isOpen || !canManageSettings) return null;

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

  const handleLogoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert('Ukuran berkas logo terlalu besar (maksimal 2.5 MB). Silakan pilih gambar yang lebih ringan.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target?.result;
      if (base64Data) {
        setIdentityForm((prev) => ({ ...prev, logoUrl: base64Data }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPresetLogo = (preset) => {
    setIdentityForm((prev) => ({ ...prev, logoUrl: preset.svgDataUri }));
  };

  const handleResetLogo = () => {
    setIdentityForm((prev) => ({ ...prev, logoUrl: '' }));
  };

  // Database handlers
  useEffect(() => {
    if (isOpen && activeTab === 'database') {
      fetch('/api/api.php?action=get_db_config&_t=' + Date.now())
        .then((r) => r.json())
        .then((data) => {
          if (data && data.status === 'success' && data.config) {
            setDbConfig({
              host: data.config.db_host || 'localhost',
              port: data.config.db_port || '3306',
              database: data.config.db_name || 'u490770675_simona',
              user: data.config.db_user || 'u490770675_adminsimon',
              password: data.config.db_pass || '*Demak2026'
            });
            if (data.connected !== undefined) {
              setDbTestResult({
                connected: data.connected,
                message: data.message,
                troubleshooting: data.error_detail ? [data.error_detail] : []
              });
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen, activeTab]);

  const handleTestDbConnection = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    try {
      const res = await fetch('/api/api.php?action=test_db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          db_host: dbConfig.host,
          db_port: dbConfig.port,
          db_name: dbConfig.database,
          db_user: dbConfig.user,
          db_pass: dbConfig.password
        })
      });
      const data = await res.json();
      setDbTestResult(data);
    } catch (err) {
      setDbTestResult({
        connected: false,
        message: 'Gagal menghubungi endpoint pengujian database: ' + err.message,
        troubleshooting: ['Pastikan web server Apache / PHP Hostinger aktif dan folder /api/ dapat diakses.']
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleSaveDbConfig = async () => {
    setIsSavingDb(true);
    try {
      const res = await fetch('/api/api.php?action=save_db_config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          db_host: dbConfig.host,
          db_port: dbConfig.port,
          db_name: dbConfig.database,
          db_user: dbConfig.user,
          db_pass: dbConfig.password
        })
      });
      const data = await res.json();
      if (data && data.status === 'success') {
        alert('Konfigurasi database MySQL Hostinger berhasil disimpan!');
        handleTestDbConnection();
      } else {
        alert('Gagal menyimpan konfigurasi: ' + ((data && data.message) || 'Unknown error'));
      }
    } catch (err) {
      alert('Gagal mengirim konfigurasi: ' + err.message);
    } finally {
      setIsSavingDb(false);
    }
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

  const menuCategories = [
    {
      groupTitle: 'SISTEM & BERANDA',
      items: [
        {
          id: 'identitas',
          label: 'Identitas & Beranda',
          sub: 'Nama, Logo & Kontak Dinas',
          desc: 'Konfigurasi nama aplikasi SIMON, instansi dinas, logo, kontak telepon, email, serta alamat kantor dinas.',
          icon: Globe,
          badge: null
        },
        {
          id: 'pimpinan',
          label: 'Pimpinan Dinas',
          sub: 'Kadin & Sekretaris Dinas',
          desc: 'Pengaturan pejabat resmi penandatangan laporan (Kepala Dinas dan Sekretaris Dinas) termasuk NIP, pangkat, dan jabatan.',
          icon: Award,
          badge: null
        },
        {
          id: 'slideshow_unggulan',
          label: 'Slideshow Pekerjaan Unggulan',
          sub: 'Hero Slide & Detil Pekerjaan',
          desc: 'Pengaturan slideshow pekerjaan strategis unggulan yang tampil di hero landing page beranda publik serta link detil pekerjaan.',
          icon: Sparkles,
          badge: (systemSettings?.slideshowUnggulan || []).length || 1
        },
        {
          id: 'galeri',
          label: 'Slideshow Galeri Foto',
          sub: 'Foto Landing Page Publik',
          desc: 'Kelola foto-foto infrastruktur yang tampil pada slideshow bagian atas beranda portal publik. Bisa tambah dan hapus foto.',
          icon: ImageIcon,
          badge: (systemSettings?.galeri || []).length
        }
      ]
    },
    {
      groupTitle: 'KONTEN & COPYWRITING',
      items: [
        {
          id: 'teks_narasi',
          label: 'Manajemen Teks & Narasi',
          sub: 'Landing & Panel Internal',
          desc: 'Ubah seluruh tulisan, narasi modul internal, dan deskripsi 4 bidang pelayanan dinas langsung tanpa coding.',
          icon: Type,
          badge: 'Editor'
        }
      ]
    },
    {
      groupTitle: 'MASTER PENGADAAN & SIPD',
      items: [
        {
          id: 'sipd_master',
          label: 'Master Nomenklatur SIPD',
          sub: 'Program, Kegiatan & Sub',
          desc: 'Kelola kode dan nomenklatur Program, Kegiatan, dan Sub Kegiatan SIPD RI Kemendagri yang terikat pada paket pekerjaan.',
          icon: FolderTree,
          badge: `${sipdPrograms.length} Prog`
        },
        {
          id: 'kategori',
          label: 'Tipe Pekerjaan',
          sub: 'Kategori & Pengadaan',
          desc: 'Master kategori pekerjaan teknis dan metode pemilihan penyedia (Tender, E-Katalog, Pengadaan Langsung, dll).',
          icon: Briefcase,
          badge: kategoriPekerjaanList.length
        },
        {
          id: 'sumberdana',
          label: 'Sumber Pendanaan',
          sub: 'APBD, DAK, Banprov dll',
          desc: 'Daftar master sumber anggaran pendanaan paket pekerjaan di Kabupaten Demak.',
          icon: Coins,
          badge: sumberDanaList.length
        },
        {
          id: 'prakontrak',
          label: 'Alur Pra-Kontrak',
          sub: 'Tahapan Siklus PBJ',
          desc: 'Tahapan standar siklus persiapan dan pemilihan penyedia mulai SiRUP sampai penandatanganan SPPBJ/Kontrak.',
          icon: Clock,
          badge: praKontrakStages.length
        }
      ]
    },
    {
      groupTitle: 'VERIFIKASI & TAGGING',
      items: [
        {
          id: 'tagging',
          label: 'Master Tagging',
          sub: 'Label Klasifikasi Pekerjaan',
          desc: 'Koleksi label penanda khusus (Strategis Daerah, Prioritas Bupati, Multi-Years, Tanggap Darurat, dll).',
          icon: Tag,
          badge: tags.length
        },
        {
          id: 'spj',
          label: 'Status Berkas SPJ',
          sub: 'Alur Verifikasi Keuangan',
          desc: 'Tahapan verifikasi dan validasi kelengkapan dokumen Surat Pertanggungjawaban (SPJ) keuangan oleh verifikator.',
          icon: Receipt,
          badge: spjStatuses.length
        }
      ]
    },
    {
      groupTitle: 'SERVER & DATABASE HOSTINGER',
      items: [
        {
          id: 'database',
          label: 'Database MySQL Hostinger',
          sub: 'simon.satuputarudemak.id',
          desc: 'Pengaturan koneksi basis data MySQL production Hostinger (u490770675_simona), uji koneksi langsung, dan panduan integrasi.',
          icon: Database,
          badge: 'MySQL'
        }
      ]
    }
  ];

  const allMenuItems = menuCategories.flatMap((g) => g.items);
  const activeTabInfo = allMenuItems.find((m) => m.id === activeTab) || allMenuItems[0];

  if (!isOpen || !canManageSettings) return null;


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 1100,
          width: '96vw',
          height: '88vh',
          maxHeight: 860,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 16
        }}
      >
        {/* Modern Modal Header */}
        <div
          style={{
            padding: '16px 24px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0284c7, #0f2c59)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Settings size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f2c59', margin: 0 }}>
                  Pengaturan Master & Keberlanjutan Sistem
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fde68a'
                  }}
                >
                  Super Admin Control Panel
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                Pusat kendali master data, alur pra-kontrak, slideshow publik, pejabat dinas, dan parameter verifikasi SIMON DINPUTARU.
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ borderRadius: 8 }}>
            <X size={18} />
          </button>
        </div>

        {/* 2-Column Split: Sub-menu Left Sidebar & Right Content Panel */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* LEFT SUB-MENU SIDEBAR */}
          <aside
            style={{
              width: 275,
              background: 'linear-gradient(180deg, #071527 0%, #0f2c59 100%)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              borderRight: '1px solid rgba(255,255,255,0.1)',
              overflowY: 'auto'
            }}
          >
            <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  color: '#38bdf8',
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase'
                }}
              >
                <Sliders size={13} />
                <span>Pilih Sub-Menu Pengaturan</span>
              </div>
            </div>

            <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {menuCategories.map((group, gIdx) => (
                <div key={gIdx}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#93c5fd',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      padding: '4px 10px 6px'
                    }}
                  >
                    {group.groupTitle}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTab(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: 10,
                            border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
                            background: isActive
                              ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.28), rgba(59, 130, 246, 0.16))'
                              : 'transparent',
                            color: isActive ? '#ffffff' : '#cbd5e1',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                            boxShadow: isActive ? '0 3px 10px rgba(14, 165, 233, 0.25)' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.color = '#ffffff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#cbd5e1';
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <div
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                background: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.06)',
                                color: isActive ? '#38bdf8' : '#94a3b8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              <Icon size={15} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 12.5,
                                  fontWeight: 700,
                                  color: isActive ? '#ffffff' : '#e2e8f0',
                                  lineHeight: 1.25
                                }}
                              >
                                {item.label}
                              </div>
                              <div
                                style={{
                                  fontSize: 10.5,
                                  color: isActive ? '#93c5fd' : '#94a3b8',
                                  marginTop: 1,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {item.sub}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                            {item.badge !== null && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '1px 6px',
                                  borderRadius: 9999,
                                  background: isActive ? '#38bdf8' : 'rgba(255,255,255,0.12)',
                                  color: isActive ? '#071527' : '#cbd5e1'
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight size={13} color={isActive ? '#38bdf8' : '#64748b'} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* RIGHT CONTENT PANEL */}
          <main
            style={{
              flex: 1,
              minWidth: 0,
              overflowY: 'auto',
              padding: '24px 28px',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Active Sub-Menu Header Banner */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 12,
                padding: '16px 20px',
                border: '1px solid #e2e8f0',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f2c59', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{activeTabInfo?.label}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    Super Admin
                  </span>
                </h4>
                <p style={{ fontSize: 12.5, color: '#64748b', margin: '4px 0 0' }}>
                  {activeTabInfo?.desc}
                </p>
              </div>
            </div>
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

                  {/* Pengaturan Visualisasi Kurva S Pekerjaan */}
                  <div
                    className="form-group"
                    style={{
                      gridColumn: '1 / -1',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: 14,
                      padding: '16px 20px',
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>Visualisasi Kurva S pada Rincian Pekerjaan</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: systemSettings?.showKurvaS ? '#e0f2fe' : '#f1f5f9', color: systemSettings?.showKurvaS ? '#0369a1' : '#64748b' }}>
                          Default: Nonaktif (OFF)
                        </span>
                      </div>
                      <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>
                        Fungsi untuk menampilkan atau menyembunyikan visualisasi Kurva S (Rencana vs Realisasi) pada detail pekerjaan di seluruh sistem.
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: 8, padding: '6px 12px', borderRadius: 8, background: '#fff', border: '1px solid #cbd5e1' }}>
                        <input
                          type="checkbox"
                          checked={systemSettings?.showKurvaS === true}
                          onChange={(e) => updateSystemSettings({ showKurvaS: e.target.checked })}
                          style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#0284c7' }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 700, color: systemSettings?.showKurvaS ? '#0284c7' : '#64748b' }}>
                          {systemSettings?.showKurvaS ? 'Aktif (ON - Kurva S Ditampilkan)' : 'Nonaktif (OFF - Kurva S Disembunyikan)'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Modul Pengaturan Logo & Lambang Resmi Sistem */}
                  <div
                    className="form-group"
                    style={{
                      gridColumn: '1 / -1',
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: 14,
                      padding: '20px 22px',
                      marginTop: 6
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #0284c7, #0f2c59)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                          }}
                        >
                          <ImageIcon size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#0f2c59' }}>
                            Logo & Lambang Resmi Sistem
                          </div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>
                            Kustomisasi logo aplikasi untuk Sidebar, Navbar, Halaman Login, Landing Page, dan Kop Laporan.
                          </div>
                        </div>
                      </div>

                      {/* Tombol Aksi Cepat Upload & Reset */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="file"
                          ref={logoFileInputRef}
                          onChange={handleLogoFileUpload}
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => logoFileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 14px',
                            fontSize: 12.5,
                            fontWeight: 700,
                            background: '#0284c7',
                            borderColor: '#0284c7'
                          }}
                          title="Unggah berkas gambar logo (PNG, JPG, SVG, WebP) dari perangkat Anda"
                        >
                          <Upload size={14} />
                          <span>Unggah dari Komputer</span>
                        </button>

                        {identityForm.logoUrl && (
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={handleResetLogo}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '8px 12px',
                              fontSize: 12.5,
                              color: '#64748b',
                              borderColor: '#cbd5e1'
                            }}
                            title="Kembalikan logo ke lambang dinas bawaan (Official PUPR Emblem)"
                          >
                            <RotateCcw size={13} />
                            <span>Reset Default</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Pilihan Galeri Preset Logo Resmi */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 8 }}>
                        Pilih Preset Lambang Resmi (Klik 1-Kali untuk Menerapkan):
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                        {LOGO_PRESETS.map((preset) => {
                          const isSelected = identityForm.logoUrl === preset.svgDataUri;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleApplyPresetLogo(preset)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 14px',
                                borderRadius: 10,
                                border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                                background: isSelected ? '#eff6ff' : '#ffffff',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <AppLogo logoUrl={preset.svgDataUri} size={38} shape="rounded" />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12.5, fontWeight: 800, color: isSelected ? '#0369a1' : '#1e293b' }}>
                                  {preset.name}
                                </div>
                                <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {preset.description}
                                </div>
                              </div>
                              {isSelected && (
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={12} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Input Tautan URL Alternatif */}
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                        Atau Masukkan Tautan / URL Gambar Eksternal:
                      </label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://... atau data:image/... (Kosongkan untuk menggunakan lambang bawaan)"
                          value={identityForm.logoUrl?.startsWith('data:image/') ? `[Gambar Tersimpan Lokal (${(identityForm.logoUrl.length / 1024).toFixed(0)} KB)]` : identityForm.logoUrl}
                          onChange={(e) => {
                            if (!e.target.value.startsWith('[Gambar Tersimpan')) {
                              setIdentityForm({ ...identityForm, logoUrl: e.target.value });
                            }
                          }}
                          style={{ flex: 1, fontSize: 12.5 }}
                        />
                        {identityForm.logoUrl && (
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={handleResetLogo}
                            style={{ fontSize: 12, padding: '6px 12px' }}
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <span style={{ fontSize: 11.5, color: '#64748b', marginTop: 4, display: 'block' }}>
                        Mendukung gambar lokal (Base64) yang diunggah langsung dari komputer, tautan HTTPS, maupun vektor SVG.
                      </span>
                    </div>

                    {/* Live Preview Multi-Konteks (Sidebar, Navbar, Login, Kop Laporan) */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Pratinjau Langsung Tampilan Logo di Berbagai Halaman:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
                        {/* 1. Preview di Sidebar Gelap */}
                        <div
                          style={{
                            background: '#071527',
                            borderRadius: 10,
                            padding: '12px 14px',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            border: '1px solid #1e293b'
                          }}
                        >
                          <AppLogo logoUrl={identityForm.logoUrl} size={36} shape="rounded" />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {identityForm.namaSistem || 'SIMON - SATUPUTARU'}
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8' }}>Sidebar Panel</div>
                          </div>
                        </div>

                        {/* 2. Preview di Top Navbar */}
                        <div
                          style={{
                            background: '#ffffff',
                            borderRadius: 10,
                            padding: '12px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                          }}
                        >
                          <AppLogo logoUrl={identityForm.logoUrl} size={34} shape="rounded" />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#0f2c59' }}>
                              {identityForm.singkatanInstansi || 'DINPUTARU Demak'}
                            </div>
                            <div style={{ fontSize: 10, color: '#64748b' }}>Top Navbar</div>
                          </div>
                        </div>

                        {/* 3. Preview di Halaman Login & Landing */}
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #0f2c59 0%, #1e3a8a 100%)',
                            borderRadius: 10,
                            padding: '12px 14px',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            border: '1px solid #1e40af'
                          }}
                        >
                          <AppLogo logoUrl={identityForm.logoUrl} size={38} shape="rounded" />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#fbbf24' }}>
                              Portal Masuk
                            </div>
                            <div style={{ fontSize: 10, color: '#cbd5e1' }}>Halaman Login & Publik</div>
                          </div>
                        </div>

                        {/* 4. Preview di Kop Surat Laporan */}
                        <div
                          style={{
                            background: '#ffffff',
                            borderRadius: 10,
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            border: '1.5px dashed #94a3b8'
                          }}
                        >
                          <AppLogo logoUrl={identityForm.logoUrl} size={36} shape="square" bordered={false} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 10.5, fontWeight: 900, color: '#000000', lineHeight: 1.2 }}>
                              PEMKAB DEMAK
                            </div>
                            <div style={{ fontSize: 9.5, color: '#475569' }}>Kop Dokumen Resmi</div>
                          </div>
                        </div>
                      </div>
                    </div>
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
          
          {activeTab === 'slideshow_unggulan' && (
            <div>
              {/* Toggle On/Off Slideshow Unggulan */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={16} color="#f59e0b" />
                    <span>Tampilkan Slideshow Pekerjaan Unggulan di Beranda Publik</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                    Hero banner interaktif yang menampilkan pekerjaan prioritas dinas lengkap dengan spesifikasi dan foto.
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={systemSettings?.showSlideshowUnggulan !== false}
                    onChange={(e) => updateSystemSettings({ showSlideshowUnggulan: e.target.checked })}
                    style={{ width: 20, height: 20, cursor: 'pointer', accentColor: '#0284c7' }}
                  />
                  <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: (systemSettings?.showSlideshowUnggulan !== false) ? '#0284c7' : '#94a3b8' }}>
                    {(systemSettings?.showSlideshowUnggulan !== false) ? 'Aktif (ON)' : 'Nonaktif (OFF)'}
                  </span>
                </label>
              </div>

              {/* Form Tambah Slide dari Data Monitoring Paket */}
              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: 12,
                  padding: '18px 20px',
                  marginBottom: 24
                }}
              >
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0369a1', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={16} />
                  Tambah Slide Pekerjaan Unggulan dari Data Monitoring
                </h4>

                <form onSubmit={handleAddSlideUnggulanSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Pilih Paket Pekerjaan dari Monitoring Paket TA 2026</label>
                      <select
                        className="form-control"
                        value={newSlideUnggulanInput.projectId}
                        onChange={(e) => handleSelectProjectForSlide(e.target.value)}
                        style={{ fontWeight: 600 }}
                      >
                        <option value="">-- Pilih Paket Pekerjaan ({projects.length} Paket Tersedia) --</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.bidangId?.toUpperCase() || 'DINAS'}] {p.namaPaket} - Rp {(p.dataKontrak?.nilaiKontrak || p.paguAnggaran || 0).toLocaleString('id-ID')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Judul Slide Pekerjaan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newSlideUnggulanInput.judul}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, judul: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Sub Kegiatan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newSlideUnggulanInput.subKegiatan}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, subKegiatan: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Bidang</label>
                      <select
                        className="form-control"
                        value={newSlideUnggulanInput.bidangId}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, bidangId: e.target.value })}
                      >
                        {BIDANG_LIST.filter((b) => b.id !== 'sekretariat').map((b) => (
                          <option key={b.id} value={b.id}>{b.nama}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Pagu Anggaran (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newSlideUnggulanInput.paguAnggaran}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, paguAnggaran: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Nilai Kontrak (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newSlideUnggulanInput.nilaiKontrak}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, nilaiKontrak: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Pelaksana / Rekanan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newSlideUnggulanInput.pelaksana}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, pelaksana: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Nomor Kontrak</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newSlideUnggulanInput.nomorKontrak}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, nomorKontrak: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Progres Fisik (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={newSlideUnggulanInput.progresFisik}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, progresFisik: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Realisasi SP2D (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newSlideUnggulanInput.sp2d}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, sp2d: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">URL Foto Dokumentasi Slide (Format JPG/PNG)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://images.unsplash.com/... atau URL foto dinas"
                        value={newSlideUnggulanInput.url}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, url: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Deskripsi / Keterangan Singkat Slide</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={newSlideUnggulanInput.deskripsi}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, deskripsi: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Plus size={15} />
                      Simpan & Tambahkan ke Slideshow
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Slide Unggulan Aktif */}
              <div style={{ marginBottom: 12 }}>
                <span className="form-label" style={{ fontWeight: 800 }}>
                  Daftar Slide Pekerjaan Unggulan Aktif ({(systemSettings?.slideshowUnggulan || []).length} Slide)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(systemSettings?.slideshowUnggulan || []).map((slide, sIdx) => {
                  const b = BIDANG_LIST.find((x) => x.id === slide.bidangId);
                  return (
                    <div
                      key={slide.id || sIdx}
                      style={{
                        display: 'flex',
                        gap: 16,
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        padding: '14px',
                        background: '#ffffff',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src={slide.url}
                        alt={slide.judul}
                        style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: b?.bgLight || '#e0f2fe', color: b?.warna || '#0284c7' }}>
                            {b?.nama || slide.kategori}
                          </span>
                          <span style={{ fontSize: 11, color: '#64748b' }}>{slide.subKegiatan}</span>
                        </div>
                        <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f2c59', margin: '0 0 4px' }}>
                          {slide.judul}
                        </h4>
                        <div style={{ fontSize: 12, color: '#475569' }}>
                          Pagu: <strong>Rp {(slide.paguAnggaran || 0).toLocaleString('id-ID')}</strong> • Kontrak: <strong>Rp {(slide.nilaiKontrak || 0).toLocaleString('id-ID')}</strong> • Pelaksana: {slide.pelaksana || '-'}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#0284c7', marginTop: 2 }}>
                          Fisik: {slide.progresFisik || 0}% • SP2D: Rp {(slide.sp2d || 0).toLocaleString('id-ID')}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleDeleteSlideUnggulan(slide.id)}
                        style={{ color: '#ef4444', background: '#fee2e2', borderRadius: 8, padding: 8 }}
                        title="Hapus Slide Ini"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {activeTab === 'galeri' && (
            <div>
              
              {/* Toggle Tampilkan Galeri & Peta Koordinat di Beranda Publik */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 14,
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f2c59' }}>
                      Slideshow Galeri Foto di Beranda
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b' }}>
                      Tampilkan carousel foto infrastruktur
                    </div>
                  </div>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={systemSettings?.showGaleriSlideshow === true}
                      onChange={(e) => updateSystemSettings({ showGaleriSlideshow: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: '#0284c7' }}
                    />
                  </label>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f2c59' }}>
                      Peta Titik Koordinat di Beranda
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b' }}>
                      Tampilkan sebaran koordinat peta lapangan
                    </div>
                  </div>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={systemSettings?.showPetaKoordinat === true}
                      onChange={(e) => updateSystemSettings({ showPetaKoordinat: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: '#0284c7' }}
                    />
                  </label>
                </div>
              </div>

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
                        placeholder="Contoh: Jl. Kyai Jebat No. 35 Bintoro Kec. Demak"
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

          {/* TAB: MASTER NOMENKLATUR SIPD */}
          {activeTab === 'sipd_master' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Header Card */}
              <div
                style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #071527 0%, #0f2c59 60%, #1e3a8a 100%)',
                  borderRadius: 14,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                  boxShadow: '0 4px 14px rgba(15, 44, 89, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <FolderTree size={24} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#f8fafc' }}>
                        Pusat Kendali Master Nomenklatur SIPD RI
                      </h4>
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                          color: '#ffffff',
                          fontSize: 10.5,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 9999
                        }}
                      >
                        Kemendagri
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#cbd5e1' }}>
                      Kelola daftar induk Program, Kegiatan, dan Sub Kegiatan dinas untuk klasifikasi seluruh paket pekerjaan di Menu 5 & Menu Monitoring.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSipdModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: 13,
                    padding: '10px 18px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <Plus size={16} />
                  <span>Buka Editor Lengkap Master SIPD</span>
                </button>
              </div>

              {/* 3 Metric Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 14
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 12,
                    padding: '16px 18px',
                    border: '1.5px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FolderTree size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>PROGRAM TERDAFTAR</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#0f2c59' }}>{sipdPrograms.length} Program</div>
                  </div>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 12,
                    padding: '16px 18px',
                    border: '1.5px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>TOTAL KEGIATAN</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#0f2c59' }}>{sipdKegiatans.length} Kegiatan</div>
                  </div>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 12,
                    padding: '16px 18px',
                    border: '1.5px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>TOTAL SUB KEGIATAN</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#166534' }}>{sipdSubKegiatans.length} Sub Kegiatan</div>
                  </div>
                </div>
              </div>

              {/* Programs Quick List Table */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f2c59' }}>
                      Ringkasan Program SIPD Terdaftar
                    </h5>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                      Daftar Program induk dan sebaran kegiatan serta sub kegiatan per bidang teknis dinas.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSipdModalOpen(true)}
                    className="btn btn-outline"
                    style={{ fontSize: 12, padding: '5px 12px' }}
                  >
                    Kelola Nomenklatur
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th style={{ width: 120 }}>Kode Program</th>
                        <th>Nama Program SIPD</th>
                        <th style={{ width: 140 }}>Bidang Dinas</th>
                        <th style={{ width: 120, textAlign: 'center' }}>Kegiatan</th>
                        <th style={{ width: 120, textAlign: 'center' }}>Sub Kegiatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sipdPrograms.map((prog) => {
                        const bidang = BIDANG_LIST.find((b) => b.id === prog.bidangId);
                        const kegCount = sipdKegiatans.filter((k) => k.programId === prog.id).length;
                        const progKegIds = sipdKegiatans.filter((k) => k.programId === prog.id).map((k) => k.id);
                        const subCount = sipdSubKegiatans.filter((s) => progKegIds.includes(s.kegiatanId)).length;

                        return (
                          <tr key={prog.id}>
                            <td>
                              <span
                                style={{
                                  background: '#f1f5f9',
                                  color: '#0f172a',
                                  padding: '2px 8px',
                                  borderRadius: 6,
                                  fontFamily: 'monospace',
                                  fontSize: 12,
                                  fontWeight: 800
                                }}
                              >
                                {prog.kodeProgram}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#0f2c59', fontSize: 13 }}>
                                {prog.namaProgram}
                              </div>
                              {prog.deskripsi && (
                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                  {prog.deskripsi}
                                </div>
                              )}
                            </td>
                            <td>
                              <span
                                style={{
                                  background: bidang?.bgLight || '#f1f5f9',
                                  color: bidang?.warna || '#334155',
                                  border: `1px solid ${bidang?.warna || '#cbd5e1'}40`,
                                  fontSize: 11,
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: 6
                                }}
                              >
                                {bidang?.singkatan || prog.bidangId}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ fontWeight: 800, color: '#0284c7' }}>{kegCount}</span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ fontWeight: 800, color: '#059669' }}>{subCount}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Embedded SipdMasterModal */}
              {isSipdModalOpen && (
                <SipdMasterModal isOpen={isSipdModalOpen} onClose={() => setIsSipdModalOpen(false)} />
              )}
            </div>
          )}

          {/* TAB: MANAJEMEN TEKS & NARASI (LANDING & INTERNAL PANEL) */}
          {activeTab === 'teks_narasi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Top Banner */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                  borderRadius: 14,
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    <Type size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#065f46' }}>
                      Editor Seluruh Teks & Narasi Sistem DINPUTARU
                    </h4>
                    <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#047857' }}>
                      Ubah seluruh teks publik dan teks internal dinas langsung dari panel ini tanpa harus menyentuh source code.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={handleResetAllTexts}
                    className="btn btn-outline"
                    style={{
                      fontSize: 12,
                      padding: '6px 14px',
                      borderRadius: 8,
                      borderColor: '#cbd5e1',
                      background: '#ffffff',
                      color: '#64748b',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                    title="Kembalikan semua teks sistem ke teks bawaan awal"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Semua Bawaan</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTexts}
                    className="btn btn-primary"
                    style={{
                      fontSize: 12.5,
                      padding: '7px 18px',
                      borderRadius: 8,
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                    }}
                  >
                    <Save size={14} />
                    <span>Simpan Perubahan Teks</span>
                  </button>
                </div>
              </div>

              {/* Sub-Category Pills Navigation */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  overflowX: 'auto',
                  paddingBottom: 4,
                  borderBottom: '1px solid #e2e8f0'
                }}
              >
                {[
                  {
                    id: 'bidang_pelayanan',
                    label: '🏛️ 4 Bidang Pelayanan (Landing)',
                    count: 4,
                    hint: 'Deskripsi kartu Bina Marga, Cipta Karya, SDA-BK, Tata Ruang'
                  },
                  {
                    id: 'landing_hero',
                    label: '🌐 Landing: Hero & Header',
                    count: 5,
                    hint: 'Tagline, Judul Hero, Deskripsi, Tombol Aksi'
                  },
                  {
                    id: 'landing_seksi',
                    label: '⭐ Landing: Sorotan & Peta',
                    count: 6,
                    hint: 'Badge, Judul, Deskripsi Seksi Sorotan & Peta'
                  },
                  {
                    id: 'landing_footer',
                    label: '📜 Landing: Footer & Kedinasan',
                    count: 2,
                    hint: 'Deskripsi instansi footer & teks akses kedinasan ASN'
                  },
                  {
                    id: 'panel_internal',
                    label: '📊 Panel Internal: Modul Monitoring',
                    count: 14,
                    hint: 'Judul dan Narasi Dashboard, Pra-Kontrak, Fisik, Keuangan, SPJ, Master Data, Laporan'
                  },
                  {
                    id: 'sipd_menu',
                    label: '🌳 Menu 5: Nomenklatur & Analitik SIPD',
                    count: 7,
                    hint: 'Judul, Badge, Subtitle Pohon Hierarki, Diagram Kotak & Visual Analytics'
                  }
                ].map((cat) => {
                  const isCatActive = activeTextCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveTextCategory(cat.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        border: isCatActive ? '1px solid #0284c7' : '1px solid #e2e8f0',
                        background: isCatActive ? '#e0f2fe' : '#ffffff',
                        color: isCatActive ? '#0369a1' : '#475569',
                        fontSize: 12.5,
                        fontWeight: isCatActive ? 800 : 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                        boxShadow: isCatActive ? '0 1px 3px rgba(2, 132, 199, 0.15)' : 'none'
                      }}
                      title={cat.hint}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* KATEGORI 1: 🏛️ DESKRIPSI 4 BIDANG PELAYANAN (LANDING PAGE) */}
              {activeTextCategory === 'bidang_pelayanan' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Seksi Header Form */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '16px 20px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f2c59', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlignLeft size={16} color="#0284c7" />
                      <span>Teks Pengantar Seksi 4 Bidang di Beranda Portal Publik</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" style={{ margin: 0, fontSize: 12 }}>Badge Seksi Bidang</label>
                          <button
                            type="button"
                            onClick={() => handleResetSingleText('landing_bidang_badge')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer', padding: 0 }}
                          >
                            Reset Bawaan
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={customTextsForm.landing_bidang_badge || ''}
                          onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_bidang_badge: e.target.value })}
                          placeholder="BIDANG PELAYANAN INFRASTRUKTUR"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" style={{ margin: 0, fontSize: 12 }}>Judul Utama Seksi Bidang</label>
                          <button
                            type="button"
                            onClick={() => handleResetSingleText('landing_bidang_title')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer', padding: 0 }}
                          >
                            Reset Bawaan
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={customTextsForm.landing_bidang_title || ''}
                          onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_bidang_title: e.target.value })}
                          placeholder="Pembangunan Berkelanjutan di 4 Bidang Teknis"
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" style={{ margin: 0, fontSize: 12 }}>Deskripsi Subtitle Seksi Bidang</label>
                          <button
                            type="button"
                            onClick={() => handleResetSingleText('landing_bidang_desc')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer', padding: 0 }}
                          >
                            Reset Bawaan
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          className="form-control"
                          value={customTextsForm.landing_bidang_desc || ''}
                          onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_bidang_desc: e.target.value })}
                          placeholder="Setiap bidang di Dinas Pekerjaan Umum dan Penataan Ruang bertanggung jawab..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Cards Bidang Pelayanan Editor */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <h5 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#0f2c59' }}>
                          Deskripsi Masing-Masing Kartu Bidang Pelayanan (Landing Page)
                        </h5>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                          Teks ini tampil langsung pada 4 kartu interaktif portal depan publik DINPUTARU.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
                      {BIDANG_LIST.filter((b) => b.id !== 'sekretariat').map((b) => {
                        const desc = bidangDescForm[b.id] || '';
                        return (
                          <div
                            key={b.id}
                            style={{
                              background: '#ffffff',
                              border: `1.5px solid ${b.warna}40`,
                              borderRadius: 14,
                              padding: '18px 20px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 12
                            }}
                          >
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                  style={{
                                    padding: '5px 12px',
                                    borderRadius: 8,
                                    background: b.bgLight,
                                    color: b.warna,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    border: `1px solid ${b.warna}33`
                                  }}
                                >
                                  {b.id === 'sda_bk' ? 'SDA-BK' : b.singkatan}
                                </div>
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0f2c59' }}>
                                    {b.nama}
                                  </div>
                                  <div style={{ fontSize: 11, color: '#64748b' }}>
                                    Kode Bidang: <code>{b.id}</code>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleResetSingleBidang(b.id)}
                                className="btn-icon"
                                title="Kembalikan narasi bawaan bidang ini"
                                style={{
                                  fontSize: 11,
                                  color: '#0284c7',
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  background: '#f0f9ff'
                                }}
                              >
                                <RotateCcw size={12} />
                              </button>
                            </div>

                            {/* Textarea Field */}
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <label className="form-label" style={{ fontSize: 11.5, color: '#475569', margin: 0 }}>
                                  Narasi Deskripsi Kartu (Landing):
                                </label>
                                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                  {desc.length} Karakter
                                </span>
                              </div>
                              <textarea
                                rows={3}
                                className="form-control"
                                value={desc}
                                onChange={(e) =>
                                  setBidangDescForm({
                                    ...bidangDescForm,
                                    [b.id]: e.target.value
                                  })
                                }
                                style={{ fontSize: 12.5, lineHeight: 1.5 }}
                                placeholder={`Tuliskan narasi deskripsi bidang ${b.nama}...`}
                              />
                            </div>

                            {/* Live Preview Box */}
                            <div
                              style={{
                                background: '#f8fafc',
                                borderRadius: 10,
                                padding: '12px 14px',
                                border: '1px dashed #cbd5e1'
                              }}
                            >
                              <div style={{ fontSize: 10.5, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Eye size={12} />
                                <span>Pratinjau Kartu di Landing Page</span>
                              </div>
                              <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, margin: 0, fontStyle: desc ? 'normal' : 'italic' }}>
                                {desc || '(Teks deskripsi kosong - silakan ketik di atas)'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* KATEGORI 2: 🌐 LANDING: HERO & HEADER */}
              {activeTextCategory === 'landing_hero' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div
                    style={{
                      background: '#ffffff',
                      borderRadius: 14,
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    <h5 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={16} color="#f59e0b" />
                      <span>Pengaturan Teks Bagian Utama (Hero Banner) Beranda</span>
                    </h5>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                      {/* Tagline Hero */}
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" style={{ margin: 0 }}>
                            Badge Tagline Kecil (Atas Judul Hero)
                          </label>
                          <button
                            type="button"
                            onClick={() => handleResetSingleText('landing_hero_tagline')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                          >
                            Reset Bawaan
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={customTextsForm.landing_hero_tagline || ''}
                          onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_hero_tagline: e.target.value })}
                          placeholder="Transparansi Pembangunan Infrastruktur Daerah"
                        />
                      </div>

                      {/* Judul Hero */}
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" style={{ margin: 0 }}>
                            Judul Besar Hero Banner
                          </label>
                          <button
                            type="button"
                            onClick={() => handleResetSingleText('landing_hero_title')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                          >
                            Reset Bawaan
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={customTextsForm.landing_hero_title || ''}
                          onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_hero_title: e.target.value })}
                          placeholder="Portal Pemantauan Progres Pekerjaan"
                        />
                        <span style={{ fontSize: 11.5, color: '#64748b', marginTop: 4, display: 'block' }}>
                          Catatan: Nama Instansi Dinas akan otomatis disambung pada baris kedua judul.
                        </span>
                      </div>

                      {/* Deskripsi Hero */}
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" style={{ margin: 0 }}>
                            Deskripsi Paragraf Hero Banner
                          </label>
                          <button
                            type="button"
                            onClick={() => handleResetSingleText('landing_hero_desc')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                          >
                            Reset Bawaan
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          className="form-control"
                          value={customTextsForm.landing_hero_desc || ''}
                          onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_hero_desc: e.target.value })}
                          placeholder="Sistem resmi keterbukaan informasi publik untuk memantau kemajuan fisik..."
                        />
                      </div>

                      {/* Tombol 1 */}
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" style={{ margin: 0 }}>
                            Teks Tombol Aksi Utama (Kuning)
                          </label>
                          <button
                            type="button"
                            onClick={() => handleResetSingleText('landing_hero_btn_explore')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                          >
                            Reset Bawaan
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={customTextsForm.landing_hero_btn_explore || ''}
                          onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_hero_btn_explore: e.target.value })}
                          placeholder="Jelajahi Pekerjaan Sorotan"
                        />
                      </div>

                      {/* Tombol 2 */}
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label className="form-label" style={{ margin: 0 }}>
                            Teks Tombol Slideshow (Outline)
                          </label>
                          <button
                            type="button"
                            onClick={() => handleResetSingleText('landing_hero_btn_slideshow')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                          >
                            Reset Bawaan
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={customTextsForm.landing_hero_btn_slideshow || ''}
                          onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_hero_btn_slideshow: e.target.value })}
                          placeholder="Lihat Slideshow Foto"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Hero Preview */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #071527 0%, #0f2c59 100%)',
                      borderRadius: 14,
                      padding: '24px 28px',
                      color: '#ffffff',
                      boxShadow: '0 4px 16px rgba(15, 44, 89, 0.25)'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Eye size={13} />
                      <span>Pratinjau Tampilan Hero Banner di Beranda Publik</span>
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 9999,
                        background: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#fde68a',
                        marginBottom: 10
                      }}
                    >
                      <Sparkles size={12} color="#f59e0b" />
                      <span>{customTextsForm.landing_hero_tagline || 'Tagline Hero'}</span>
                    </div>

                    <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.3, marginBottom: 8 }}>
                      {customTextsForm.landing_hero_title || 'Portal Pemantauan Progres Pekerjaan'}<br />
                      <span style={{ color: '#38bdf8' }}>{identityForm.instansi || 'Dinas Pekerjaan Umum dan Penataan Ruang'}</span>
                    </div>

                    <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, maxWidth: 600, marginBottom: 16 }}>
                      {customTextsForm.landing_hero_desc || 'Deskripsi hero banner...'}
                    </p>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#071527',
                          fontWeight: 800,
                          fontSize: 12,
                          padding: '8px 16px',
                          borderRadius: 8,
                          display: 'inline-block'
                        }}
                      >
                        {customTextsForm.landing_hero_btn_explore || 'Jelajahi Pekerjaan'}
                      </span>
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          fontWeight: 700,
                          fontSize: 12,
                          padding: '8px 16px',
                          borderRadius: 8,
                          display: 'inline-block'
                        }}
                      >
                        {customTextsForm.landing_hero_btn_slideshow || 'Lihat Slideshow'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* KATEGORI 3: ⭐ LANDING: SEKSI SOROTAN & PETA */}
              {activeTextCategory === 'landing_seksi' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 18 }}>
                  {/* Seksi Pekerjaan Sorotan */}
                  <div
                    style={{
                      background: '#ffffff',
                      borderRadius: 14,
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={18} color="#0284c7" />
                      <h5 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f2c59' }}>
                        Seksi Pekerjaan Sorotan Publik
                      </h5>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 11.5 }}>Badge Seksi</label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('landing_sorotan_badge')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.landing_sorotan_badge || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_sorotan_badge: e.target.value })}
                        placeholder="SOROTAN PUBLIK DINPUTARU"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 11.5 }}>Judul Seksi Sorotan</label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('landing_sorotan_title')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.landing_sorotan_title || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_sorotan_title: e.target.value })}
                        placeholder="Pekerjaan Unggulan & Progres Terkini"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 11.5 }}>Deskripsi Seksi Sorotan</label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('landing_sorotan_desc')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={customTextsForm.landing_sorotan_desc || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_sorotan_desc: e.target.value })}
                        placeholder="Daftar pekerjaan yang dipublikasikan secara terbuka..."
                      />
                    </div>
                  </div>

                  {/* Seksi Geografis & Peta Koordinat */}
                  <div
                    style={{
                      background: '#ffffff',
                      borderRadius: 14,
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={18} color="#059669" />
                      <h5 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f2c59' }}>
                        Seksi Geografis & Peta Koordinat
                      </h5>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 11.5 }}>Badge Seksi Peta</label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('landing_peta_badge')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.landing_peta_badge || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_peta_badge: e.target.value })}
                        placeholder="GEOGRAFIS & PEMETAAN"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 11.5 }}>Judul Seksi Peta</label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('landing_peta_title')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.landing_peta_title || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_peta_title: e.target.value })}
                        placeholder="Peta Titik Koordinat Pekerjaan"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 11.5 }}>Deskripsi Seksi Peta</label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('landing_peta_desc')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={customTextsForm.landing_peta_desc || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_peta_desc: e.target.value })}
                        placeholder="Masyarakat dapat memverifikasi langsung lokasi fisik..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* KATEGORI 4: 📜 LANDING: FOOTER & KEDINASAN */}
              {activeTextCategory === 'landing_footer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div
                    style={{
                      background: '#ffffff',
                      borderRadius: 14,
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16
                    }}
                  >
                    <h5 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f2c59' }}>
                      Copywriting Footer & Akses Kedinasan ASN
                    </h5>

                    {/* Deskripsi Footer Instansi */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ margin: 0 }}>
                          Deskripsi Singkat Profil Instansi (Kolom Kiri Footer)
                        </label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('landing_footer_desc')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={customTextsForm.landing_footer_desc || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_footer_desc: e.target.value })}
                        placeholder="Sistem Informasi Monitoring Pekerjaan Dinas Pekerjaan Umum dan Penataan Ruang..."
                      />
                    </div>

                    {/* Teks Akses Kedinasan */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ margin: 0 }}>
                          Teks Informasi Akses Kedinasan (Kolom Kanan Footer)
                        </label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('landing_footer_access_desc')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={customTextsForm.landing_footer_access_desc || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, landing_footer_access_desc: e.target.value })}
                        placeholder="Panel khusus bagi ASN, Pejabat Pembuat Komitmen (PPK)..."
                      />
                      <span style={{ fontSize: 11.5, color: '#64748b', marginTop: 4, display: 'block' }}>
                        Teks ini mengarahkan ASN / Pejabat untuk mengklik tombol login di pojok kanan atas portal publik.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* KATEGORI 5: 📊 PANEL INTERNAL: DASHBOARD & MODUL */}
              {activeTextCategory === 'panel_internal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ marginBottom: 4 }}>
                    <h5 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#0f2c59' }}>
                      Judul & Narasi Subtitle Halaman Modul Monitoring
                    </h5>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                      Sesuaikan judul utama dan teks panduan/narasi yang tampil di header masing-masing modul internal dinas.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
                    {[
                      {
                        titleKey: 'internal_dashboard_title',
                        descKey: 'internal_dashboard_desc',
                        moduleName: 'Dashboard Eksekutif',
                        badge: 'Utama',
                        color: '#0284c7',
                        icon: Sparkles
                      },
                      {
                        titleKey: 'internal_prakontrak_title',
                        descKey: 'internal_prakontrak_desc',
                        moduleName: 'Monitoring Pra-Kontrak',
                        badge: 'Pra-Kontrak',
                        color: '#6366f1',
                        icon: Clock
                      },
                      {
                        titleKey: 'internal_fisik_title',
                        descKey: 'internal_fisik_desc',
                        moduleName: 'Monitoring Progres Fisik',
                        badge: 'Fisik',
                        color: '#059669',
                        icon: Layers
                      },
                      {
                        titleKey: 'internal_keuangan_title',
                        descKey: 'internal_keuangan_desc',
                        moduleName: 'Monitoring Progres Keuangan',
                        badge: 'Keuangan',
                        color: '#d97706',
                        icon: DollarSign
                      },
                      {
                        titleKey: 'internal_spj_title',
                        descKey: 'internal_spj_desc',
                        moduleName: 'Administrasi SPJ Keuangan',
                        badge: 'SPJ',
                        color: '#e11d48',
                        icon: Receipt
                      },
                      {
                        titleKey: 'internal_master_title',
                        descKey: 'internal_master_desc',
                        moduleName: 'Master Data Pekerjaan',
                        badge: 'Basis Data',
                        color: '#059669',
                        icon: Database
                      },
                      {
                        titleKey: 'internal_report_title',
                        descKey: 'internal_report_desc',
                        moduleName: 'Cetak & Rekapitulasi Laporan',
                        badge: 'Eksekutif',
                        color: '#0f2c59',
                        icon: Printer
                      }
                    ].map((mod) => {
                      const Icon = mod.icon;
                      const titleVal = customTextsForm[mod.titleKey] || '';
                      const descVal = customTextsForm[mod.descKey] || '';

                      return (
                        <div
                          key={mod.titleKey}
                          style={{
                            background: '#ffffff',
                            borderRadius: 14,
                            padding: '18px 20px',
                            border: `1.5px solid ${mod.color}33`,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 8,
                                  background: `${mod.color}15`,
                                  color: mod.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Icon size={16} />
                              </div>
                              <div>
                                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f2c59' }}>
                                  {mod.moduleName}
                                </div>
                                <span style={{ fontSize: 10.5, fontWeight: 700, color: mod.color }}>
                                  {mod.badge}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                handleResetSingleText(mod.titleKey);
                                handleResetSingleText(mod.descKey);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0284c7',
                                fontSize: 11,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title="Reset judul dan narasi modul ini ke bawaan"
                            >
                              <RotateCcw size={11} />
                              <span>Reset Bawaan</span>
                            </button>
                          </div>

                          {/* Judul Halaman Input */}
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <label className="form-label" style={{ margin: 0, fontSize: 11.5, color: '#334155', fontWeight: 700 }}>
                                Judul Halaman:
                              </label>
                              <button
                                type="button"
                                onClick={() => handleResetSingleText(mod.titleKey)}
                                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 10.5, cursor: 'pointer' }}
                              >
                                Reset Judul
                              </button>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              value={titleVal}
                              onChange={(e) => setCustomTextsForm({ ...customTextsForm, [mod.titleKey]: e.target.value })}
                              style={{ fontSize: 12.5 }}
                              placeholder={DEFAULT_CUSTOM_TEXTS[mod.titleKey] || `Judul ${mod.moduleName}...`}
                            />
                          </div>

                          {/* Narasi Subtitle Input */}
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <label className="form-label" style={{ margin: 0, fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>
                                Narasi Subtitle / Panduan:
                              </label>
                              <button
                                type="button"
                                onClick={() => handleResetSingleText(mod.descKey)}
                                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 10.5, cursor: 'pointer' }}
                              >
                                Reset Narasi
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              className="form-control"
                              value={descVal}
                              onChange={(e) => setCustomTextsForm({ ...customTextsForm, [mod.descKey]: e.target.value })}
                              style={{ fontSize: 12, lineHeight: 1.45 }}
                              placeholder={DEFAULT_CUSTOM_TEXTS[mod.descKey] || `Tuliskan subtitle penjelasan untuk ${mod.moduleName}...`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Informative Link to Menu 5 Tab */}
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: 12,
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <FolderTree size={20} color="#059669" />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>
                          Mencari Pengaturan Teks Menu 5 (Ringkasan SIPD)?
                        </div>
                        <div style={{ fontSize: 12, color: '#15803d', marginTop: 2 }}>
                          Menu 5 memiliki 7 pengaturan teks khusus (Judul, Badge, Subtitle Pohon, Diagram Kotak & Visual Analytics) pada tab sub-kategori tersendiri.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTextCategory('sipd_menu')}
                      className="btn btn-outline"
                      style={{ fontSize: 12, padding: '6px 14px', borderColor: '#059669', color: '#059669', background: '#ffffff', cursor: 'pointer' }}
                    >
                      Buka Teks Menu 5 SIPD →
                    </button>
                  </div>
                </div>
              )}

              {/* KATEGORI 6: 🌳 MENU 5: NOMENKLATUR & ANALITIK SIPD */}
              {activeTextCategory === 'sipd_menu' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                      borderRadius: 14,
                      padding: '16px 20px',
                      border: '1px solid #a7f3d0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #0284c7, #0f2c59)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <FolderTree size={20} />
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: '#065f46' }}>
                        Pengaturan Teks & Narasi Menu 5: Ringkasan Nomenklatur SIPD
                      </h5>
                      <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#047857' }}>
                        Sesuaikan seluruh tulisan judul, badge, deskripsi pohon hierarki, diagram kotak perbandingan program, serta modul analitik.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                    {/* 1. Judul Menu 5 */}
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        padding: '16px 18px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 12.5, fontWeight: 700 }}>
                          Judul Utama Halaman Menu 5
                        </label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('internal_sipd_title')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.internal_sipd_title || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, internal_sipd_title: e.target.value })}
                        placeholder="Menu 5: Ringkasan Nomenklatur SIPD"
                      />
                    </div>

                    {/* 2. Badge SIPD RI */}
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        padding: '16px 18px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 12.5, fontWeight: 700 }}>
                          Label Badge Header
                        </label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('internal_sipd_badge')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.internal_sipd_badge || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, internal_sipd_badge: e.target.value })}
                        placeholder="SIPD RI"
                      />
                    </div>

                    {/* 3. Subtitle Pohon Hierarki */}
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        padding: '16px 18px',
                        border: '1px solid #e2e8f0',
                        gridColumn: '1 / -1',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 12.5, fontWeight: 700 }}>
                          Deskripsi Subtitle Pohon Hierarki Kinerja
                        </label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('internal_sipd_desc')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        className="form-control"
                        value={customTextsForm.internal_sipd_desc || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, internal_sipd_desc: e.target.value })}
                        placeholder="Pohon Hierarki Kinerja: Program → Kegiatan → Sub Kegiatan → Daftar Paket Pekerjaan..."
                      />
                    </div>

                    {/* 4. Judul Diagram Kotak Program */}
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        padding: '16px 18px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 12.5, fontWeight: 700 }}>
                          Judul Diagram Kotak Komparasi Program
                        </label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('internal_sipd_box_title')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.internal_sipd_box_title || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, internal_sipd_box_title: e.target.value })}
                        placeholder="Diagram Kotak: Komparasi Realisasi & Sebaran Anggaran Program"
                      />
                    </div>

                    {/* 5. Deskripsi Diagram Kotak Program */}
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        padding: '16px 18px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 12.5, fontWeight: 700 }}>
                          Deskripsi Diagram Kotak Komparasi Program
                        </label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('internal_sipd_box_desc')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.internal_sipd_box_desc || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, internal_sipd_box_desc: e.target.value })}
                        placeholder="Perbandingan langsung pagu, nilai kontrak, serapan SP2D, realisasi fisik, dan deviasi kinerja antar Program..."
                      />
                    </div>

                    {/* 6. Judul Visual Analytics SIPD */}
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        padding: '16px 18px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 12.5, fontWeight: 700 }}>
                          Judul Modul Visual Analytics SIPD
                        </label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('internal_sipd_analytics_title')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.internal_sipd_analytics_title || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, internal_sipd_analytics_title: e.target.value })}
                        placeholder="Visual Analytics: Realisasi & Sebaran Anggaran SIPD"
                      />
                    </div>

                    {/* 7. Deskripsi Visual Analytics SIPD */}
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        padding: '16px 18px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ margin: 0, fontSize: 12.5, fontWeight: 700 }}>
                          Deskripsi Subtitle Modul Visual Analytics
                        </label>
                        <button
                          type="button"
                          onClick={() => handleResetSingleText('internal_sipd_analytics_desc')}
                          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 11, cursor: 'pointer' }}
                        >
                          Reset Bawaan
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={customTextsForm.internal_sipd_analytics_desc || ''}
                        onChange={(e) => setCustomTextsForm({ ...customTextsForm, internal_sipd_analytics_desc: e.target.value })}
                        placeholder="Komparasi Progres Fisik vs Keuangan dan Distribusi Pagu per Program, Kegiatan, dan Sub Kegiatan."
                      />
                    </div>
                  </div>

                  {/* Live Preview Header Menu 5 */}
                  <div
                    style={{
                      background: '#ffffff',
                      borderRadius: 14,
                      padding: '20px',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Eye size={13} />
                      <span>Pratinjau Langsung Tampilan Header Menu 5</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #0369a1 0%, #0f172a 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}
                      >
                        <FolderTree size={24} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <h4 style={{ fontSize: 18, margin: 0, fontWeight: 800, color: '#0f2c59' }}>
                            {customTextsForm.internal_sipd_title || 'Menu 5: Ringkasan Nomenklatur SIPD'}
                          </h4>
                          <span
                            style={{
                              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                              color: '#ffffff',
                              fontSize: 10.5,
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 9999
                            }}
                          >
                            {customTextsForm.internal_sipd_badge || 'SIPD RI'}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#64748b' }}>
                          {customTextsForm.internal_sipd_desc || 'Pohon Hierarki Kinerja: Program → Kegiatan → Sub Kegiatan → Daftar Paket Pekerjaan'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sticky / Floating Save Bar */}
              <div
                style={{
                  position: 'sticky',
                  bottom: -20,
                  marginTop: 10,
                  padding: '14px 20px',
                  background: '#ffffff',
                  border: '1px solid #bae6fd',
                  borderRadius: 12,
                  boxShadow: '0 4px 16px rgba(2, 132, 199, 0.12)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#0369a1' }}>
                  <Check size={16} color="#059669" />
                  <span>
                    Perubahan teks otomatis diterapkan seketika pada landing page & panel internal.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={handleResetAllTexts}
                    className="btn btn-outline"
                    style={{ fontSize: 12.5, padding: '7px 16px', borderRadius: 8 }}
                  >
                    Reset Semua
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTexts}
                    className="btn btn-primary"
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      padding: '8px 24px',
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
                    }}
                  >
                    <Save size={15} />
                    <span>Simpan Seluruh Perubahan Teks</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PENGATURAN DATABASE MYSQL HOSTINGER */}
          {activeTab === 'database' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Header Card */}
              <div
                style={{
                  padding: '20px 24px',
                  background: 'linear-gradient(135deg, #0a1f3d 0%, #0f2c59 50%, #0284c7 100%)',
                  borderRadius: 14,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                  boxShadow: '0 4px 16px rgba(15, 44, 89, 0.25)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.25)'
                    }}
                  >
                    <Database size={24} color="#38bdf8" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
                        Pengaturan Database MySQL Hostinger
                      </h3>
                      <span
                        style={{
                          background: 'rgba(56, 189, 248, 0.2)',
                          color: '#38bdf8',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          borderRadius: 20,
                          padding: '2px 10px',
                          fontSize: 11,
                          fontWeight: 700
                        }}
                      >
                        simon.satuputarudemak.id
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#93c5fd', lineHeight: 1.4 }}>
                      Kelola koneksi basis data MySQL server production Hostinger, uji koneksi PDO secara instan, dan panduan integrasi.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      background: dbTestResult?.connected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      border: `1px solid ${dbTestResult?.connected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      color: dbTestResult?.connected ? '#6ee7b7' : '#fcd34d'
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: dbTestResult?.connected ? '#10b981' : '#f59e0b',
                        boxShadow: `0 0 8px ${dbTestResult?.connected ? '#10b981' : '#f59e0b'}`
                      }}
                    />
                    <span>{dbTestResult?.connected ? 'MySQL Terhubung' : 'Standby / Local Fallback'}</span>
                  </div>
                </div>
              </div>

              {/* Form Input Kredensial Database */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  padding: '22px 24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Server size={18} color="#0284c7" />
                    <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: '#0f2c59' }}>
                      Kredensial Server Database MySQL
                    </h4>
                  </div>
                  <span style={{ fontSize: 11.5, color: '#64748b' }}>
                    Tersinkronisasi otomatis dengan file <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#0284c7' }}>public/api/config.php</code>
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {/* Host */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>
                      Host Database MySQL <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={dbConfig.host}
                      onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                      placeholder="localhost"
                      style={{ fontSize: 13 }}
                    />
                    <small style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                      Standar di Hostinger gunakan <code style={{ fontWeight: 700 }}>localhost</code> atau <code style={{ fontWeight: 700 }}>127.0.0.1</code>
                    </small>
                  </div>

                  {/* Port */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>
                      Port MySQL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={dbConfig.port}
                      onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                      placeholder="3306"
                      style={{ fontSize: 13 }}
                    />
                    <small style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                      Port default MySQL Hostinger adalah 3306
                    </small>
                  </div>

                  {/* Nama Database */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>
                      Nama Database MySQL <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={dbConfig.database}
                      onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                      placeholder="u490770675_simona"
                      style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59' }}
                    />
                    <small style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                      Sesuai database di hPanel Hostinger: <code style={{ fontWeight: 700 }}>u490770675_simona</code>
                    </small>
                  </div>

                  {/* Username MySQL */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>
                      Username Pengguna MySQL <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={dbConfig.user}
                      onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                      placeholder="u490770675_adminsimon"
                      style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59' }}
                    />
                    <small style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                      User berwenang Hostinger: <code style={{ fontWeight: 700 }}>u490770675_adminsimon</code>
                    </small>
                  </div>

                  {/* Password MySQL */}
                  <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
                    <label className="form-label" style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>
                      Kata Sandi (Password) Database MySQL <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showDbPass ? 'text' : 'password'}
                        className="form-control"
                        value={dbConfig.password}
                        onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                        placeholder="*Demak2026"
                        style={{ fontSize: 13, paddingRight: 42, letterSpacing: showDbPass ? 'normal' : '2px', fontWeight: 700 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowDbPass(!showDbPass)}
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: 4
                        }}
                      >
                        {showDbPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <small style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                      Kata sandi database Hostinger: <code style={{ fontWeight: 700 }}>*Demak2026</code>
                    </small>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 22,
                    paddingTop: 16,
                    borderTop: '1px solid #f1f5f9',
                    flexWrap: 'wrap',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      type="button"
                      onClick={handleTestDbConnection}
                      disabled={isTestingDb}
                      className="btn"
                      style={{
                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: isTestingDb ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                      }}
                    >
                      <RefreshCw size={15} className={isTestingDb ? 'spin' : ''} />
                      <span>{isTestingDb ? 'Menguji Koneksi...' : 'Tes Koneksi Database'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveDbConfig}
                      disabled={isSavingDb}
                      className="btn"
                      style={{
                        background: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: isSavingDb ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                      }}
                    >
                      <Save size={15} />
                      <span>{isSavingDb ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
                    </button>
                  </div>

                  <a
                    href="/api/test_db.php"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 12.5,
                      color: '#0284c7',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontWeight: 600
                    }}
                  >
                    <span>Buka Halaman Diagnostik Web (test_db.php)</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Hasil Tes Koneksi (Banner Diagnostik) */}
              {dbTestResult && (
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: dbTestResult.connected ? '#ecfdf5' : '#fef2f2',
                    border: `1.5px solid ${dbTestResult.connected ? '#10b981' : '#f87171'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {dbTestResult.connected ? (
                        <CheckCircle2 size={20} color="#059669" />
                      ) : (
                        <AlertCircle size={20} color="#dc2626" />
                      )}
                      <div>
                        <strong style={{ fontSize: 13.5, color: dbTestResult.connected ? '#065f46' : '#991b1b' }}>
                          {dbTestResult.message}
                        </strong>
                        {dbTestResult.latency_ms !== undefined && (
                          <span style={{ marginLeft: 8, fontSize: 11.5, color: '#059669' }}>
                            (Latensi: {dbTestResult.latency_ms} ms • Versi MySQL: {dbTestResult.server_version || 'MariaDB/MySQL'})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {dbTestResult.tables && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      {Object.entries(dbTestResult.tables).map(([tbl, info]) => (
                        <span
                          key={tbl}
                          style={{
                            fontSize: 11.5,
                            padding: '4px 8px',
                            borderRadius: 6,
                            background: info.exists ? '#d1fae5' : '#fee2e2',
                            color: info.exists ? '#065f46' : '#991b1b',
                            border: `1px solid ${info.exists ? '#a7f3d0' : '#fca5a5'}`
                          }}
                        >
                          {tbl}: {info.exists ? `${info.rows} baris` : 'Belum Ada'}
                        </span>
                      ))}
                    </div>
                  )}

                  {Array.isArray(dbTestResult.troubleshooting) && dbTestResult.troubleshooting.length > 0 && (
                    <div style={{ marginTop: 8, padding: '10px 14px', background: '#ffffff', borderRadius: 8, border: '1px solid #fca5a5' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>
                        Langkah Penyelesaian / Troubleshooting:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color: '#7f1d1d', lineHeight: 1.5 }}>
                        {dbTestResult.troubleshooting.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* PANDUAN LENGKAP MENGHUBUNGKAN WEB APP DAN DATABASE HOSTINGER */}
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  padding: '22px 24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <Award size={20} color="#0284c7" />
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f2c59' }}>
                    Panduan Menghubungkan Web App & Database di Hosting Hostinger
                  </h4>
                </div>
                <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, marginTop: 0 }}>
                  Aplikasi SIMON SATUPUTARU berjalan secara penuh di domain <strong>https://simon.satuputarudemak.id</strong>. Ikuti 5 tahapan praktis berikut untuk memastikan database terhubung 100%:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 14, marginTop: 14 }}>
                  {/* Step 1 */}
                  <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#0284c7', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                      <strong style={{ fontSize: 13, color: '#0f2c59' }}>Buat Database di hPanel</strong>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                      Buka <strong>hPanel Hostinger</strong> &gt; Masuk ke menu <strong>Databases</strong> &gt; <strong>Kelola Database</strong>. Buat database:
                      <div style={{ background: '#f1f5f9', padding: '6px 8px', borderRadius: 6, marginTop: 6, fontSize: 11.5, fontFamily: 'monospace' }}>
                        Database: u490770675_simona<br />
                        Username: u490770675_adminsimon<br />
                        Password: *Demak2026
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#0284c7', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                      <strong style={{ fontSize: 13, color: '#0f2c59' }}>Impor File SQL via phpMyAdmin</strong>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                      Di baris database <code style={{ color: '#0284c7' }}>u490770675_simona</code> pada hPanel, klik tombol <strong>phpMyAdmin</strong>.
                      Pilih tab <strong>Import</strong> (Impor), klik <em>Choose File</em> dan upload file:
                      <div style={{ background: '#f1f5f9', padding: '6px 8px', borderRadius: 6, marginTop: 6, fontSize: 11.5, fontFamily: 'monospace' }}>
                        database/simon_satuputaru.sql
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#0284c7', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                      <strong style={{ fontSize: 13, color: '#0f2c59' }}>Deploy File ke public_html</strong>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                      Pastikan build frontend (folder <code style={{ color: '#0284c7' }}>dist</code>) dan folder <code style={{ color: '#0284c7' }}>api</code> berada di direktori root domain:
                      <div style={{ background: '#f1f5f9', padding: '6px 8px', borderRadius: 6, marginTop: 6, fontSize: 11.5, fontFamily: 'monospace' }}>
                        public_html/api/config.php<br />
                        public_html/api/api.php<br />
                        public_html/index.html
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#0284c7', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
                      <strong style={{ fontSize: 13, color: '#0f2c59' }}>Uji Koneksi Langsung</strong>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                      Klik tombol <strong>"Tes Koneksi Database"</strong> di panel ini, atau akses langsung di peramban:
                      <div style={{ background: '#f1f5f9', padding: '6px 8px', borderRadius: 6, marginTop: 6, fontSize: 11.5, fontFamily: 'monospace' }}>
                        https://simon.satuputarudemak.id/api/test_db.php
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          </main>
        </div>

        <div className="modal-footer" style={{ padding: '12px 24px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Perubahan konfigurasi master disimpan otomatis ke database sistem DINPUTARU.
          </div>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '8px 22px', fontSize: 13, fontWeight: 700 }}>
            Selesai & Tutup Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsModal;
