import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BIDANG_LIST,
  TIPE_PENGADAAN,
  SUMBER_DANA,
  TAHAPAN_PRA_KONTRAK,
  JENIS_ANGGARAN,
  KECAMATAN_DEMAK,
  DESA_DEMAK_BY_KECAMATAN,
  STATUS_SPJ_KEUANGAN
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
  Sparkles,
  FolderTree,
  Layers,
  Camera,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  DollarSign,
  FileCheck,
  Building2,
  AlertCircle,
  Info,
  Calendar
} from 'lucide-react';
import { matchProjectToSubKegiatan } from '../data/sipdData';
import SipdMasterModal from './SipdMasterModal';
import ConfirmModal from './ConfirmModal';
import NotificationModal from './NotificationModal';

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
    sumberDanaList = [],
    sipdPrograms = [],
    sipdKegiatans = [],
    sipdSubKegiatans = [],
    canManageSipd
  } = useApp();

  const [isSipdMasterModalOpen, setIsSipdMasterModalOpen] = useState(false);

  // Pop-up Konfirmasi & Notifikasi
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Ya, Simpan',
    type: 'primary',
    onConfirm: () => {}
  });

  const [notifModal, setNotifModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    btnText: 'OK, Selesai'
  });

  const isEdit = !!initialData;

  const defaultBidangId =
    currentUser.bidangId || (BIDANG_LIST.length > 0 ? BIDANG_LIST[0].id : 'cipta_karya');

  // Akordion Dropdown Vertikal - Default SEMUA TERBUKA (default langsung terbuka semua)
  const [openSections, setOpenSections] = useState({
    umum: true,
    prakontrak: true,
    kontrak: true,
    fisik: true,
    keuangan: true,
    spj: true
  });

  const toggleSection = (sec) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const expandAllSections = () => {
    setOpenSections({
      umum: true,
      prakontrak: true,
      kontrak: true,
      fisik: true,
      keuangan: true,
      spj: true
    });
  };

  const collapseAllSections = () => {
    setOpenSections({
      umum: false,
      prakontrak: false,
      kontrak: false,
      fisik: false,
      keuangan: false,
      spj: false
    });
  };

  const [newTagInput, setNewTagInput] = useState('');

  // Dokumentasi Foto Lapangan (0%, 50%, 100%)
  const [foto0, setFoto0] = useState('');
  const [foto50, setFoto50] = useState('');
  const [foto100, setFoto100] = useState('');
  const [tanggal0, setTanggal0] = useState('');
  const [tanggal50, setTanggal50] = useState('');
  const [tanggal100, setTanggal100] = useState('');

  // State Sub-form Tambah Termin SP2D
  const [newTermin, setNewTermin] = useState({
    terminKe: '',
    nomorSP2D: '',
    tanggalSP2D: '',
    jumlah: '',
    keterangan: ''
  });

  const [formData, setFormData] = useState({
    namaPaket: '',
    bidangId: defaultBidangId,
    programId: '',
    kegiatanId: '',
    subKegiatanId: '',
    kodeSubKegiatan: '',
    namaSubKegiatan: '',
    kategoriPekerjaan: 'Fisik',
    subBagian: '',
    tipePengadaan: 'Tender',
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
      bankPenyedia: 'Bank Jateng',
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
      totalPencairan: 0,
      persenKeuangan: 0,
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
      let subKeg = null;
      if (initialData.subKegiatanId) {
        subKeg = sipdSubKegiatans.find((s) => s.id === initialData.subKegiatanId);
      }
      if (!subKeg && initialData.kodeSubKegiatan) {
        subKeg = sipdSubKegiatans.find((s) => s.kodeSubKegiatan === initialData.kodeSubKegiatan);
      }
      if (!subKeg) {
        subKeg = matchProjectToSubKegiatan(initialData, sipdSubKegiatans);
      }

      // Ekstraksi Foto Dokumentasi Tersimpan
      const dFisik = initialData.dataFisik || {};
      const dFotos = Array.isArray(dFisik.fotoDokumentasi)
        ? dFisik.fotoDokumentasi
        : Array.isArray(initialData.fotoDokumentasi)
        ? initialData.fotoDokumentasi
        : [];

      const f0 =
        dFotos.find((f) => f && (f.tahap === '0%' || f.tahap === '0')) ||
        initialData.dokumentasi?.foto0 ||
        initialData.fotoLapangan?.foto0;
      const f50 =
        dFotos.find((f) => f && (f.tahap === '50%' || f.tahap === '50')) ||
        initialData.dokumentasi?.foto50 ||
        initialData.fotoLapangan?.foto50;
      const f100 =
        dFotos.find((f) => f && (f.tahap === '100%' || f.tahap === '100')) ||
        initialData.dokumentasi?.foto100 ||
        initialData.fotoLapangan?.foto100;

      const url0 = typeof f0 === 'string' ? f0 : f0?.url || '';
      const url50 = typeof f50 === 'string' ? f50 : f50?.url || '';
      const url100 = typeof f100 === 'string' ? f100 : f100?.url || '';

      setFoto0(url0);
      setTanggal0(f0?.tanggal || initialData.dokumentasi?.tanggal0 || '');
      setFoto50(url50);
      setTanggal50(f50?.tanggal || initialData.dokumentasi?.tanggal50 || '');
      setFoto100(url100);
      setTanggal100(f100?.tanggal || initialData.dokumentasi?.tanggal100 || '');

      const loadedTermin = Array.isArray(initialData.dataKeuangan?.terminHistory)
        ? initialData.dataKeuangan.terminHistory
        : Array.isArray(initialData.termin_json)
        ? initialData.termin_json
        : [];

      setFormData({
        ...initialData,
        programId: initialData.programId || subKeg?.programId || '',
        kegiatanId: initialData.kegiatanId || subKeg?.kegiatanId || '',
        subKegiatanId: initialData.subKegiatanId || subKeg?.id || '',
        kodeSubKegiatan: initialData.kodeSubKegiatan || subKeg?.kodeSubKegiatan || '',
        namaSubKegiatan: initialData.namaSubKegiatan || subKeg?.namaSubKegiatan || '',
        kategoriPekerjaan:
          initialData.kategoriPekerjaan || (initialData.bidangId === 'tata_ruang' ? 'Jakon' : 'Fisik'),
        tipePengadaan: initialData.tipePengadaan || 'Tender',
        jenisAnggaran: initialData.jenisAnggaran || 'Murni',
        sumberDana: initialData.sumberDana || 'APBD Murni (DAU)',
        kecamatan: initialData.kecamatan || 'Demak',
        desa: initialData.desa || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags : [],
        paguAnggaran: parseFloat(initialData.paguAnggaran) || 0,
        hps: parseFloat(initialData.hps) || 0,
        latitude: initialData.latitude || initialData.koordinat?.lat || '-6.8942',
        longitude: initialData.longitude || initialData.koordinat?.lng || '110.6385',
        isPublicHighlight:
          initialData.isPublicHighlight !== undefined ? initialData.isPublicHighlight : true,
        isKontrak:
          Boolean(initialData.isKontrak) ||
          initialData.tahapPraKontrak?.status === 'kontrak' ||
          initialData.statusTahapPraKontrak === 'kontrak',
        tahapPraKontrak: {
          status:
            initialData.tahapPraKontrak?.status ||
            initialData.statusTahapPraKontrak ||
            'rup',
          targetMulaiTender: initialData.tahapPraKontrak?.targetMulaiTender || '',
          targetSelesaiTender: initialData.tahapPraKontrak?.targetSelesaiTender || '',
          catatanPraKontrak: initialData.tahapPraKontrak?.catatanPraKontrak || ''
        },
        dataKontrak: {
          nomorKontrak: initialData.dataKontrak?.nomorKontrak || initialData.nomorKontrak || '',
          tanggalKontrak: initialData.dataKontrak?.tanggalKontrak || initialData.tanggalKontrak || '',
          tanggalMulai: initialData.dataKontrak?.tanggalMulai || initialData.tanggalMulai || '',
          tanggalSelesai: initialData.dataKontrak?.tanggalSelesai || initialData.tanggalSelesai || '',
          nilaiKontrak: parseFloat(initialData.dataKontrak?.nilaiKontrak) || 0,
          namaPenyedia: initialData.dataKontrak?.namaPenyedia || initialData.pelaksana || '',
          npwpPenyedia: initialData.dataKontrak?.npwpPenyedia || initialData.dataKontrak?.npwpRekanan || '',
          bankPenyedia: initialData.dataKontrak?.bankPenyedia || initialData.dataKontrak?.bankRekanan || 'Bank Jateng',
          nomorRekening: initialData.dataKontrak?.nomorRekening || initialData.dataKontrak?.rekeningRekanan || '',
          waktuPelaksanaan: initialData.dataKontrak?.waktuPelaksanaan || 120,
          konsultanPengawas: initialData.dataKontrak?.konsultanPengawas || ''
        },
        dataFisik: {
          progresRencana: parseFloat(initialData.dataFisik?.progresRencana) || 0,
          progresRealisasi: parseFloat(initialData.dataFisik?.progresRealisasi) || 0,
          kendalaLapangan: initialData.dataFisik?.kendalaLapangan || '',
          fotoDokumentasi: dFotos,
          mingguanKurvaS: initialData.dataFisik?.mingguanKurvaS || []
        },
        dataKeuangan: {
          totalPencairan: parseFloat(initialData.dataKeuangan?.totalPencairan) || 0,
          persenKeuangan: parseFloat(initialData.dataKeuangan?.persenKeuangan) || 0,
          terminHistory: loadedTermin
        },
        administrasiSPJ: initialData.administrasiSPJ || initialData.dataSpj || {
          status: initialData.spjStatus || 'Belum Mengajukan SPJ',
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
      const progForBidang = sipdPrograms.filter((p) => p.bidangId === defaultBidangId);
      const defaultProg = progForBidang.length > 0 ? progForBidang[0] : null;
      const kegForProg = defaultProg ? sipdKegiatans.filter((k) => k.programId === defaultProg.id) : [];
      const defaultKeg = kegForProg.length > 0 ? kegForProg[0] : null;
      const subForKeg = defaultKeg ? sipdSubKegiatans.filter((s) => s.kegiatanId === defaultKeg.id) : [];
      const defaultSub = subForKeg.length > 0 ? subForKeg[0] : null;

      setFormData({
        namaPaket: '',
        bidangId: defaultBidangId,
        programId: defaultProg?.id || '',
        kegiatanId: defaultKeg?.id || '',
        subKegiatanId: defaultSub?.id || '',
        kodeSubKegiatan: defaultSub?.kodeSubKegiatan || '',
        namaSubKegiatan: defaultSub?.namaSubKegiatan || '',
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
          bankPenyedia: 'Bank Jateng',
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
          totalPencairan: 0,
          persenKeuangan: 0,
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
      setFoto0('');
      setTanggal0('');
      setFoto50('');
      setTanggal50('');
      setFoto100('');
      setTanggal100('');
    }
    setNewTagInput('');
    // Default semua section terbuka
    setOpenSections({
      umum: true,
      prakontrak: true,
      kontrak: true,
      fisik: true,
      keuangan: true,
      spj: true
    });
  }, [initialData, isOpen, defaultBidangId, sipdPrograms, sipdKegiatans, sipdSubKegiatans]);

  // Filter Program, Kegiatan, Sub Kegiatan berdasarkan Bidang
  const filteredPrograms = useMemo(() => {
    if (!formData.bidangId) return sipdPrograms;
    const progInBidang = sipdPrograms.filter((p) => p.bidangId === formData.bidangId);
    return progInBidang.length > 0 ? progInBidang : sipdPrograms;
  }, [sipdPrograms, formData.bidangId]);

  const filteredKegiatans = useMemo(() => {
    if (formData.programId) {
      return sipdKegiatans.filter((k) => k.programId === formData.programId);
    }
    if (formData.bidangId) {
      return sipdKegiatans.filter((k) => k.bidangId === formData.bidangId);
    }
    return sipdKegiatans;
  }, [sipdKegiatans, formData.programId, formData.bidangId]);

  const filteredSubKegiatans = useMemo(() => {
    if (formData.kegiatanId) {
      return sipdSubKegiatans.filter((s) => s.kegiatanId === formData.kegiatanId);
    }
    if (formData.programId) {
      return sipdSubKegiatans.filter((s) => s.programId === formData.programId);
    }
    if (formData.bidangId) {
      return sipdSubKegiatans.filter((s) => s.bidangId === formData.bidangId);
    }
    return sipdSubKegiatans;
  }, [sipdSubKegiatans, formData.kegiatanId, formData.programId, formData.bidangId]);

  const handleBidangChange = (newBidangId) => {
    const progForBidang = sipdPrograms.filter((p) => p.bidangId === newBidangId);
    const newProg = progForBidang.length > 0 ? progForBidang[0] : null;
    const kegForProg = newProg ? sipdKegiatans.filter((k) => k.programId === newProg.id) : [];
    const newKeg = kegForProg.length > 0 ? kegForProg[0] : null;
    const subForKeg = newKeg ? sipdSubKegiatans.filter((s) => s.kegiatanId === newKeg.id) : [];
    const newSub = subForKeg.length > 0 ? subForKeg[0] : null;

    setFormData((prev) => ({
      ...prev,
      bidangId: newBidangId,
      subBagian: '',
      programId: newProg?.id || '',
      kegiatanId: newKeg?.id || '',
      subKegiatanId: newSub?.id || '',
      kodeSubKegiatan: newSub?.kodeSubKegiatan || '',
      namaSubKegiatan: newSub?.namaSubKegiatan || ''
    }));
  };

  if (!isOpen) return null;

  const selectedBidang = BIDANG_LIST.find((b) => b.id === formData.bidangId) || BIDANG_LIST[0];

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
      const updated = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
      return { ...prev, tags: updated };
    });
  };

  // Helper Kompresi Gambar Otomatis & Convert ke Base64 Data URL
  const handlePhotoUpload = (tahap, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        const todayStr = new Date().toISOString().slice(0, 10);

        if (tahap === '0%') {
          setFoto0(compressedBase64);
          if (!tanggal0) setTanggal0(todayStr);
        } else if (tahap === '50%') {
          setFoto50(compressedBase64);
          if (!tanggal50) setTanggal50(todayStr);
        } else if (tahap === '100%') {
          setFoto100(compressedBase64);
          if (!tanggal100) setTanggal100(todayStr);
        }
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Helper Tambah Termin Baru
  const handleAddTermin = (e) => {
    e.preventDefault();
    const jlh = parseFloat(newTermin.jumlah) || 0;
    if (jlh <= 0 && !newTermin.terminKe) {
      alert('Isikan minimal Tahap Termin dan Jumlah Pencairan (Rp).');
      return;
    }

    const baseVal =
      parseFloat(formData.dataKontrak?.nilaiKontrak) > 0
        ? parseFloat(formData.dataKontrak.nilaiKontrak)
        : parseFloat(formData.paguAnggaran) || 1;

    const currentHistory = Array.isArray(formData.dataKeuangan?.terminHistory)
      ? formData.dataKeuangan.terminHistory
      : [];

    const terminItem = {
      id: `TRM-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      terminKe: newTermin.terminKe || `Termin ${currentHistory.length + 1}`,
      nomorSP2D: newTermin.nomorSP2D || '',
      tanggalSP2D: newTermin.tanggalSP2D || new Date().toISOString().slice(0, 10),
      jumlah: jlh,
      persen: parseFloat(((jlh / baseVal) * 100).toFixed(2)),
      keterangan: newTermin.keterangan || ''
    };

    const updatedHistory = [...currentHistory, terminItem];
    const totalPencairanBaru = updatedHistory.reduce((sum, t) => sum + (parseFloat(t.jumlah) || 0), 0);
    const persenKeuanganBaru = parseFloat(((totalPencairanBaru / baseVal) * 100).toFixed(2));

    setFormData((prev) => ({
      ...prev,
      dataKeuangan: {
        ...prev.dataKeuangan,
        terminHistory: updatedHistory,
        totalPencairan: totalPencairanBaru,
        persenKeuangan: persenKeuanganBaru
      }
    }));

    setNewTermin({
      terminKe: '',
      nomorSP2D: '',
      tanggalSP2D: '',
      jumlah: '',
      keterangan: ''
    });
  };

  // Helper Hapus Termin
  const handleRemoveTermin = (terminId) => {
    const currentHistory = Array.isArray(formData.dataKeuangan?.terminHistory)
      ? formData.dataKeuangan.terminHistory
      : [];
    const updatedHistory = currentHistory.filter((t) => t.id !== terminId);

    const baseVal =
      parseFloat(formData.dataKontrak?.nilaiKontrak) > 0
        ? parseFloat(formData.dataKontrak.nilaiKontrak)
        : parseFloat(formData.paguAnggaran) || 1;

    const totalPencairanBaru = updatedHistory.reduce((sum, t) => sum + (parseFloat(t.jumlah) || 0), 0);
    const persenKeuanganBaru = parseFloat(((totalPencairanBaru / baseVal) * 100).toFixed(2));

    setFormData((prev) => ({
      ...prev,
      dataKeuangan: {
        ...prev.dataKeuangan,
        terminHistory: updatedHistory,
        totalPencairan: totalPencairanBaru,
        persenKeuangan: persenKeuanganBaru
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaPaket.trim()) {
      setNotifModal({
        isOpen: true,
        title: 'Form Belum Lengkap',
        message: 'Nama Paket Pekerjaan wajib diisi!',
        type: 'error',
        btnText: 'Tutup'
      });
      setOpenSections((prev) => ({ ...prev, umum: true }));
      return;
    }

    const statusTahap = formData.tahapPraKontrak?.status;
    const isBatal = statusTahap === 'batal';
    const isKontrak = !isBatal && (formData.isKontrak || statusTahap === 'kontrak');

    if (isKontrak) {
      if (!formData.dataKontrak?.tanggalMulai || !formData.dataKontrak?.tanggalSelesai) {
        setNotifModal({
          isOpen: true,
          title: 'Periode Kontrak Wajib Diisi',
          message:
            'Untuk paket berstatus Kontrak, isian Tanggal Mulai Kontrak dan Tanggal Akhir Kontrak wajib diisi!',
          type: 'error',
          btnText: 'Tutup'
        });
        setOpenSections((prev) => ({ ...prev, kontrak: true }));
        return;
      }
    }

    let subKeg = null;
    if (formData.subKegiatanId) {
      subKeg = sipdSubKegiatans.find((s) => s.id === formData.subKegiatanId);
    }
    if (!subKeg && formData.kodeSubKegiatan) {
      subKeg = sipdSubKegiatans.find((s) => s.kodeSubKegiatan === formData.kodeSubKegiatan);
    }
    if (!subKeg) {
      subKeg = matchProjectToSubKegiatan(formData, sipdSubKegiatans);
    }

    const finalFotos = [
      foto0
        ? {
            tahap: '0%',
            label: 'Kondisi 0% (Titik Nol)',
            url: foto0,
            tanggal: tanggal0 || new Date().toISOString().slice(0, 10)
          }
        : null,
      foto50
        ? {
            tahap: '50%',
            label: 'Progres 50% (Pelaksanaan)',
            url: foto50,
            tanggal: tanggal50 || new Date().toISOString().slice(0, 10)
          }
        : null,
      foto100
        ? {
            tahap: '100%',
            label: 'Progres 100% (Selesai Fisik)',
            url: foto100,
            tanggal: tanggal100 || new Date().toISOString().slice(0, 10)
          }
        : null
    ].filter(Boolean);

    const terminHistory = Array.isArray(formData.dataKeuangan?.terminHistory)
      ? formData.dataKeuangan.terminHistory
      : [];
    const baseVal =
      parseFloat(formData.dataKontrak?.nilaiKontrak) > 0
        ? parseFloat(formData.dataKontrak.nilaiKontrak)
        : parseFloat(formData.paguAnggaran) || 1;

    const autoTotalCair = terminHistory.reduce((sum, t) => sum + (parseFloat(t.jumlah) || 0), 0);
    const totalPencairan =
      parseFloat(formData.dataKeuangan?.totalPencairan) > 0
        ? parseFloat(formData.dataKeuangan.totalPencairan)
        : autoTotalCair;
    const persenKeuangan =
      parseFloat(formData.dataKeuangan?.persenKeuangan) > 0
        ? parseFloat(formData.dataKeuangan.persenKeuangan)
        : parseFloat(((totalPencairan / baseVal) * 100).toFixed(2));
    const sisaAnggaran = Math.max(0, baseVal - totalPencairan);

    const payload = {
      ...formData,
      programId: formData.programId || subKeg?.programId || '',
      kegiatanId: formData.kegiatanId || subKeg?.kegiatanId || '',
      subKegiatanId: formData.subKegiatanId || subKeg?.id || '',
      kodeSubKegiatan: formData.kodeSubKegiatan || subKeg?.kodeSubKegiatan || '',
      namaSubKegiatan: formData.namaSubKegiatan || subKeg?.namaSubKegiatan || '',
      isKontrak,
      tahapPraKontrak: {
        ...formData.tahapPraKontrak,
        status: isBatal ? 'batal' : isKontrak ? 'kontrak' : statusTahap
      },
      statusTahapPraKontrak: isBatal ? 'batal' : isKontrak ? 'kontrak' : statusTahap,
      dataFisik: {
        ...formData.dataFisik,
        fotoDokumentasi: finalFotos
      },
      fotoDokumentasi: finalFotos,
      dokumentasi: {
        foto0,
        foto50,
        foto100,
        tanggal0,
        tanggal50,
        tanggal100
      },
      fotoLapangan: {
        foto0,
        foto50,
        foto100
      },
      dataKeuangan: {
        ...formData.dataKeuangan,
        totalPencairan,
        persenKeuangan,
        sisaAnggaran,
        terminHistory
      },
      termin_json: terminHistory,
      administrasiSPJ: {
        ...formData.administrasiSPJ,
        status: formData.administrasiSPJ?.status || 'Belum Mengajukan SPJ'
      },
      spjStatus: formData.administrasiSPJ?.status || 'Belum Mengajukan SPJ'
    };

    setConfirmModal({
      isOpen: true,
      title: isEdit ? 'Konfirmasi Simpan Perubahan Paket' : 'Konfirmasi Tambah Paket Baru',
      message: (
        <div>
          <div>Apakah Anda yakin ingin {isEdit ? 'menyimpan perubahan pada' : 'mendaftarkan'} paket pekerjaan:</div>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              background: '#f8fafc',
              borderRadius: 8,
              fontSize: 13,
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}
          >
            <div>• Paket: <strong>{payload.namaPaket}</strong></div>
            <div>• Pagu: <strong>Rp {Math.round(parseFloat(payload.paguAnggaran) || 0).toLocaleString('id-ID')}</strong></div>
            {isKontrak && (
              <div>
                • Nilai Kontrak: <strong style={{ color: '#059669' }}>
                  Rp {Math.round(parseFloat(payload.dataKontrak?.nilaiKontrak) || 0).toLocaleString('id-ID')}
                </strong> ({payload.dataKontrak?.namaPenyedia || 'Penyedia'})
              </div>
            )}
            <div>• Realisasi Fisik: <strong>{payload.dataFisik?.progresRealisasi}%</strong></div>
            <div>• Realisasi SP2D Keuangan: <strong style={{ color: '#0891b2' }}>Rp {Math.round(totalPencairan).toLocaleString('id-ID')} ({persenKeuangan}%)</strong></div>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 6, fontSize: 12, color: '#64748b' }}>
              Pencatat: <strong>{currentUser?.nama || 'Petugas'}</strong>
            </div>
          </div>
        </div>
      ),
      confirmText: isEdit ? 'Ya, Simpan Perubahan' : 'Ya, Tambahkan Paket',
      type: 'primary',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        const now = new Date();
        const waktuStr =
          now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) +
          ' ' +
          now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        if (isEdit) {
          const existingLogs = Array.isArray(initialData?.logs) ? initialData.logs : [];
          const editLog = {
            id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            timestamp: now.toISOString(),
            waktu: waktuStr,
            userName: currentUser?.nama || 'Petugas',
            userRole: currentUser?.role || 'koordinator',
            userJabatan: currentUser?.jabatan || '',
            aksi: 'Ubah Data Paket',
            keterangan: `Koordinator ${currentUser?.nama || 'Petugas'} memperbarui data via Form Terpadu Vertikal (Fisik: ${payload.dataFisik?.progresRealisasi}%, Keuangan: ${persenKeuangan}%)`
          };
          payload.logs = [editLog, ...existingLogs];
          updateProject(initialData.id, payload);

          setNotifModal({
            isOpen: true,
            title: 'Perubahan Berhasil Disimpan!',
            message: `Data pekerjaan "${payload.namaPaket}" berhasil diperbarui dan disinkronkan ke sistem.`,
            type: 'success',
            btnText: 'OK, Selesai'
          });
        } else {
          const initLog = {
            id: `log_${Date.now()}_init`,
            timestamp: now.toISOString(),
            waktu: waktuStr,
            userName: currentUser?.nama || 'Petugas',
            userRole: currentUser?.role || 'koordinator',
            userJabatan: currentUser?.jabatan || '',
            aksi: 'Input Paket Baru',
            keterangan: `Paket pekerjaan didaftarkan pertama kali oleh ${currentUser?.nama || 'Petugas'}`
          };
          payload.logs = [initLog];
          addProject(payload);

          setNotifModal({
            isOpen: true,
            title: 'Paket Berhasil Ditambahkan!',
            message: `Paket pekerjaan baru "${payload.namaPaket}" berhasil didaftarkan ke sistem.`,
            type: 'success',
            btnText: 'OK, Selesai'
          });
        }
      }
    });
  };

  const deviasiFisik = (
    parseFloat(formData.dataFisik.progresRealisasi || 0) -
    parseFloat(formData.dataFisik.progresRencana || 0)
  ).toFixed(2);

  const baseKontrakOrPagu =
    parseFloat(formData.dataKontrak?.nilaiKontrak) > 0
      ? parseFloat(formData.dataKontrak.nilaiKontrak)
      : parseFloat(formData.paguAnggaran) || 0;

  const totalCairSekarang = Array.isArray(formData.dataKeuangan?.terminHistory)
    ? formData.dataKeuangan.terminHistory.reduce((s, t) => s + (parseFloat(t.jumlah) || 0), 0)
    : parseFloat(formData.dataKeuangan?.totalPencairan) || 0;

  const sisaDana = Math.max(0, baseKontrakOrPagu - totalCairSekarang);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1000px',
          width: '95%',
          maxHeight: '94vh',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header Modal */}
        <div
          className="modal-header"
          style={{
            background: 'linear-gradient(135deg, #0f2c59 0%, #1e40af 100%)',
            color: '#ffffff',
            borderBottom: 'none',
            padding: '18px 24px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Building2 size={22} color="#38bdf8" />
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: 18, fontWeight: 800 }}>
                {isEdit ? 'Ubah Data Paket Pekerjaan' : 'Input Data Paket Pekerjaan Terpadu'}
              </h3>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 9999,
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#7dd3fc',
                  border: '1px solid rgba(56, 189, 248, 0.4)'
                }}
              >
                TA {activeYear} • DINPUTARU Demak
              </span>
            </div>
            <p style={{ margin: '4px 0 0 32px', color: '#cbd5e1', fontSize: 12.5 }}>
              Formulir terpadu vertikal ber-akordion untuk data SIPD, Pengadaan, Kontrak, Fisik, Keuangan & Termin, serta SPJ.
            </p>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.1)', border: 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Toolbar: Expand / Collapse All Accordions */}
        <div
          style={{
            padding: '10px 24px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10
          }}
        >
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Info size={14} color="#0284c7" />
            <span>
              Setiap isian diatur berurutan ke bawah. Klik judul bagian untuk membuka/menutup isian.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={expandAllSections}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#0369a1',
                background: '#e0f2fe',
                border: '1px solid #bae6fd',
                padding: '4px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <ChevronDown size={14} /> Buka Semua Isian
            </button>
            <button
              type="button"
              onClick={collapseAllSections}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#475569',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '4px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <ChevronUp size={14} /> Tutup Semua Isian
            </button>
          </div>
        </div>

        {/* Form Body Scrollable */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
        >
          <div
            className="modal-body"
            style={{
              padding: '20px 24px 80px 24px',
              overflowY: 'auto',
              flex: 1,
              display: 'block'
            }}
          >
            {/* =========================================================================
                SECTION 1: INFORMASI UMUM, WILAYAH & SIPD (SKY BLUE THEME)
               ========================================================================= */}
            <div
              style={{
                borderRadius: 12,
                border: '1.5px solid #bae6fd',
                background: '#ffffff',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.04)',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
                marginBottom: 16
              }}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleSection('umum')}
                style={{
                  background: 'linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderBottom: openSections.umum ? '1px solid #bae6fd' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: '#0284c7',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 13
                    }}
                  >
                    1
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={17} color="#0284c7" />
                      <span>INFORMASI UMUM, WILAYAH & KLASIFIKASI SIPD</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#0284c7' }}>
                      Nama paket, bidang kerja, kodefikasi sub-kegiatan SIPD, pagu dana, dan lokasi geografis
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#bae6fd',
                      color: '#0369a1',
                      padding: '2px 8px',
                      borderRadius: 6
                    }}
                  >
                    Pagu: Rp {Math.round(parseFloat(formData.paguAnggaran) || 0).toLocaleString('id-ID')}
                  </span>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: 'rgba(2, 132, 199, 0.12)',
                      color: '#0284c7',
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {openSections.umum ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              {openSections.umum && (
                <div style={{ padding: '18px 20px', background: '#fafcff' }}>
                  <div className="form-grid">
                    <div className="form-group form-grid-full">
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
                        Nama Paket Pekerjaan <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Peningkatan Jalan Poros Ruas Balamukti - Margasari"
                        value={formData.namaPaket}
                        onChange={(e) => setFormData({ ...formData, namaPaket: e.target.value })}
                        required
                        style={{ fontSize: 14, fontWeight: 600 }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
                        Bidang Penanggung Jawab <span className="required">*</span>
                      </label>
                      <select
                        className="form-control"
                        value={formData.bidangId}
                        disabled={currentUser.role === 'koordinator'}
                        onChange={(e) => handleBidangChange(e.target.value)}
                      >
                        {BIDANG_LIST.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.nama}
                          </option>
                        ))}
                      </select>
                      {currentUser.role === 'koordinator' && (
                        <span className="form-help">Terkunci otomatis sesuai akun tugas Anda</span>
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
                        <span className="form-help">Pilih Bagian Umum atau Program & Keuangan</span>
                      </div>
                    )}

                    {/* Kategori Pekerjaan */}
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
                        Kategori / Tipe Pekerjaan <span className="required">*</span>
                      </label>
                      <select
                        className="form-control"
                        value={formData.kategoriPekerjaan || 'Fisik'}
                        onChange={(e) => handleKategoriChange(e.target.value)}
                        required
                      >
                        {(kategoriPekerjaanList && kategoriPekerjaanList.length > 0
                          ? kategoriPekerjaanList
                          : [
                              { id: 'fisik', nama: 'Fisik' },
                              { id: 'jakon', nama: 'Jakon' },
                              { id: 'barang', nama: 'Barang' },
                              { id: 'jasa_lainnya', nama: 'Jasa Lainnya' },
                              { id: 'swakelola', nama: 'Swakelola' }
                            ]
                        ).map((kat) => (
                          <option key={kat.id} value={kat.nama}>
                            {kat.nama}
                          </option>
                        ))}
                      </select>
                      <span className="form-help">
                        1. Fisik • 2. Jakon • 3. Barang • 4. Jasa Lainnya • 5. Swakelola
                      </span>
                    </div>

                    {/* Jenis Pengadaan */}
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
                        Jenis / Metode Pengadaan <span className="required">*</span>
                      </label>
                      {formData.kategoriPekerjaan === 'Swakelola' ? (
                        <div
                          style={{
                            padding: '9px 12px',
                            borderRadius: 8,
                            background: '#f0fdf4',
                            border: '1.5px solid #86efac',
                            fontSize: 12.5,
                            color: '#166534',
                            fontWeight: 700
                          }}
                        >
                          Terkunci: Swakelola (Dikerjakan Mandiri Dinas / Kelompok Masyarakat)
                        </div>
                      ) : (
                        <select
                          className="form-control"
                          value={formData.tipePengadaan}
                          onChange={(e) => setFormData({ ...formData, tipePengadaan: e.target.value })}
                          required
                        >
                          <option value="Tender">Tender</option>
                          <option value="Seleksi">Seleksi</option>
                          <option value="Pengadaan Langsung">Pengadaan Langsung</option>
                          <option value="e-Purchasing">e-Purchasing</option>
                          <option value="Minikom">Minikompetisi</option>
                          <option value="Swakelola">Swakelola</option>
                        </select>
                      )}
                    </div>

                    {/* Sumber Dana & Jenis Anggaran */}
                    <div className="form-group">
                      <label className="form-label">Sumber Dana <span className="required">*</span></label>
                      <select
                        className="form-control"
                        value={formData.sumberDana}
                        onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value })}
                        required
                      >
                        {(sumberDanaList && sumberDanaList.length > 0 ? sumberDanaList : SUMBER_DANA).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Jenis Anggaran <span className="required">*</span></label>
                      <select
                        className="form-control"
                        value={formData.jenisAnggaran}
                        onChange={(e) => setFormData({ ...formData, jenisAnggaran: e.target.value })}
                        required
                      >
                        <option value="Murni">APBD Murni</option>
                        <option value="Perubahan">APBD Perubahan</option>
                      </select>
                    </div>

                    {/* Pagu Anggaran & HPS */}
                    <div className="form-group">
                      <label className="form-label">Pagu Anggaran (Rp) <span className="required">*</span></label>
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

                    {/* Hierarki SIPD Kemendagri */}
                    <div
                      className="form-group form-grid-full"
                      style={{
                        background: '#f0f9ff',
                        padding: '16px 18px',
                        borderRadius: 12,
                        border: '1px solid #bae6fd'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, color: '#0369a1', fontWeight: 800 }}>
                          <FolderTree size={16} color="#0284c7" />
                          <span>Klasifikasi Nomenklatur SIPD Kemendagri (Program, Kegiatan, Sub Kegiatan)</span>
                        </label>
                        {canManageSipd && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setIsSipdMasterModalOpen(true)}
                            style={{ fontSize: 11.5, background: '#fff' }}
                          >
                            Kelola Master SIPD
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: 11.5, fontWeight: 700, color: '#0f2c59', display: 'block', marginBottom: 4 }}>
                            Program SIPD
                          </label>
                          <select
                            className="form-control"
                            value={formData.programId}
                            onChange={(e) => {
                              const pId = e.target.value;
                              const kegs = sipdKegiatans.filter((k) => k.programId === pId);
                              const kId = kegs.length > 0 ? kegs[0].id : '';
                              const subs = sipdSubKegiatans.filter((s) => s.kegiatanId === kId);
                              const sObj = subs.length > 0 ? subs[0] : null;
                              setFormData((prev) => ({
                                ...prev,
                                programId: pId,
                                kegiatanId: kId,
                                subKegiatanId: sObj?.id || '',
                                kodeSubKegiatan: sObj?.kodeSubKegiatan || '',
                                namaSubKegiatan: sObj?.namaSubKegiatan || ''
                              }));
                            }}
                          >
                            <option value="">-- Pilih Program SIPD --</option>
                            {filteredPrograms.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.kodeProgram ? `[${p.kodeProgram}] ` : ''}{p.namaProgram}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: 11.5, fontWeight: 700, color: '#0f2c59', display: 'block', marginBottom: 4 }}>
                            Kegiatan SIPD
                          </label>
                          <select
                            className="form-control"
                            value={formData.kegiatanId}
                            onChange={(e) => {
                              const kId = e.target.value;
                              const subs = sipdSubKegiatans.filter((s) => s.kegiatanId === kId);
                              const sObj = subs.length > 0 ? subs[0] : null;
                              setFormData((prev) => ({
                                ...prev,
                                kegiatanId: kId,
                                subKegiatanId: sObj?.id || '',
                                kodeSubKegiatan: sObj?.kodeSubKegiatan || '',
                                namaSubKegiatan: sObj?.namaSubKegiatan || ''
                              }));
                            }}
                          >
                            <option value="">-- Pilih Kegiatan SIPD --</option>
                            {filteredKegiatans.map((k) => (
                              <option key={k.id} value={k.id}>
                                {k.kodeKegiatan ? `[${k.kodeKegiatan}] ` : ''}{k.namaKegiatan}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: 11.5, fontWeight: 700, color: '#0f2c59', display: 'block', marginBottom: 4 }}>
                            Sub Kegiatan SIPD
                          </label>
                          <select
                            className="form-control"
                            value={formData.subKegiatanId}
                            onChange={(e) => {
                              const sId = e.target.value;
                              const subObj = sipdSubKegiatans.find((s) => s.id === sId);
                              setFormData((prev) => ({
                                ...prev,
                                subKegiatanId: sId,
                                kodeSubKegiatan: subObj?.kodeSubKegiatan || '',
                                namaSubKegiatan: subObj?.namaSubKegiatan || ''
                              }));
                            }}
                          >
                            <option value="">-- Pilih Sub Kegiatan SIPD --</option>
                            {filteredSubKegiatans.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.kodeSubKegiatan ? `[${s.kodeSubKegiatan}] ` : ''}{s.namaSubKegiatan}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Wilayah: Kecamatan & Desa */}
                    <div className="form-group">
                      <label className="form-label">Kecamatan (Kabupaten Demak) <span className="required">*</span></label>
                      <select
                        className="form-control"
                        value={formData.kecamatan || 'Demak'}
                        onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                        required
                      >
                        {KECAMATAN_DEMAK.map((kec) => (
                          <option key={kec} value={kec}>
                            Kecamatan {kec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Desa / Kelurahan</label>
                      <input
                        type="text"
                        list="desa-list"
                        className="form-control"
                        placeholder="Pilih atau ketik desa..."
                        value={formData.desa || ''}
                        onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                      />
                      <datalist id="desa-list">
                        {(DESA_DEMAK_BY_KECAMATAN[formData.kecamatan] || []).map((d) => (
                          <option key={d} value={d} />
                        ))}
                      </datalist>
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">Detail Ruas / Lokasi Lapangan</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Ruas Trengguli - Mijen KM 02+100 s/d 04+500"
                        value={formData.lokasi}
                        onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                      />
                    </div>

                    {/* Koordinat Geografis */}
                    <div className="form-group">
                      <label className="form-label">Titik Koordinat Lintang (Latitude)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="-6.8942"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Titik Koordinat Bujur (Longitude)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="110.6385"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-full">
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#0f2c59',
                          background: '#f8fafc',
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.isPublicHighlight}
                          onChange={(e) => setFormData({ ...formData, isPublicHighlight: e.target.checked })}
                          style={{ width: 17, height: 17, accentColor: '#16a34a' }}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Sparkles size={15} color="#16a34a" />
                          Tayangkan sebagai Paket Sorotan di Beranda Publik (Tanpa membocorkan keuangan)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =========================================================================
                SECTION 2: TAHAPAN PRA-KONTRAK & PENGADAAN (AMBER / ORANGE THEME)
               ========================================================================= */}
            <div
              style={{
                borderRadius: 12,
                border: '1.5px solid #fde68a',
                background: '#ffffff',
                boxShadow: '0 2px 4px rgba(217, 119, 6, 0.04)',
                overflow: 'hidden',
                marginBottom: 16
              }}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleSection('prakontrak')}
                style={{
                  background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderBottom: openSections.prakontrak ? '1px solid #fde68a' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: '#d97706',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 13
                    }}
                  >
                    2
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Layers size={17} color="#d97706" />
                      <span>TAHAPAN PRA-KONTRAK & PROSES PENGADAAN</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#d97706' }}>
                      Status progres dari RUP, persiapan, tender SPSE hingga penetapan pemenang
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#fde68a',
                      color: '#92400e',
                      padding: '2px 8px',
                      borderRadius: 6
                    }}
                  >
                    Status: {(praKontrakStages.find((s) => s.id === formData.tahapPraKontrak?.status)?.label) || formData.tahapPraKontrak?.status || 'RUP'}
                  </span>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: 'rgba(217, 119, 6, 0.12)',
                      color: '#d97706',
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {openSections.prakontrak ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              {openSections.prakontrak && (
                <div style={{ padding: '18px 20px', background: '#fffdfa' }}>
                  <div className="form-grid">
                    <div className="form-group form-grid-full">
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
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
                            isKontrak: isBatal ? false : isKtr ? true : formData.isKontrak,
                            tahapPraKontrak: {
                              ...formData.tahapPraKontrak,
                              status: newStatus
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

                    <div className="form-group">
                      <label className="form-label">Kode SiRUP (LKPP)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="RUP-2026-..."
                        value={formData.kodeRUP}
                        onChange={(e) => setFormData({ ...formData, kodeRUP: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Perkiraan Jadwal Pemilihan / Tender</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="date"
                          className="form-control"
                          title="Target Mulai"
                          value={formData.tahapPraKontrak.targetMulaiTender}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tahapPraKontrak: { ...formData.tahapPraKontrak, targetMulaiTender: e.target.value }
                            })
                          }
                        />
                        <input
                          type="date"
                          className="form-control"
                          title="Target Selesai"
                          value={formData.tahapPraKontrak.targetSelesaiTender}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tahapPraKontrak: { ...formData.tahapPraKontrak, targetSelesaiTender: e.target.value }
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">Catatan Tahapan Pengadaan / Pra-Kontrak</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Contoh: Dokumen persiapan telah diverifikasi Pokja, proses upload SPSE..."
                        value={formData.tahapPraKontrak.catatanPraKontrak}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tahapPraKontrak: { ...formData.tahapPraKontrak, catatanPraKontrak: e.target.value }
                          })
                        }
                      />
                    </div>

                    {/* Tagging / Label Prioritas */}
                    <div
                      className="form-group form-grid-full"
                      style={{
                        background: '#f8fafc',
                        padding: '14px 16px',
                        borderRadius: 10,
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0, fontWeight: 700, color: '#0f2c59' }}>
                        <Tag size={15} color="#d97706" />
                        <span>Tagging & Label Prioritas Pekerjaan (Opsional)</span>
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0' }}>
                        {(masterTags || []).map((tag) => {
                          const isSelected = (formData.tags || []).includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleTag(tag)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: 9999,
                                fontSize: 12,
                                fontWeight: isSelected ? 700 : 500,
                                cursor: 'pointer',
                                border: isSelected ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                                background: isSelected ? '#fef3c7' : '#ffffff',
                                color: isSelected ? '#b45309' : '#475569'
                              }}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ display: 'flex', gap: 8, maxWidth: 360 }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="+ Tambah tag label baru..."
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewTag();
                            }
                          }}
                          style={{ fontSize: 12 }}
                        />
                        <button type="button" className="btn btn-outline btn-sm" onClick={handleAddNewTag}>
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =========================================================================
                SECTION 3: DATA KONTRAK & REKANAN PENYEDIA (EMERALD GREEN THEME)
               ========================================================================= */}
            <div
              style={{
                borderRadius: 12,
                border: '1.5px solid #a7f3d0',
                background: '#ffffff',
                boxShadow: '0 2px 4px rgba(5, 150, 105, 0.04)',
                overflow: 'hidden',
                marginBottom: 16
              }}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleSection('kontrak')}
                style={{
                  background: 'linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderBottom: openSections.kontrak ? '1px solid #a7f3d0' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: '#059669',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 13
                    }}
                  >
                    3
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ReceiptText size={17} color="#059669" />
                      <span>DATA KONTRAK & REKANAN PENYEDIA (CV / PT)</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#059669' }}>
                      Nomor kontrak, tanggal SPK, nilai kontrak, nama pelaksana, dan waktu pelaksanaan
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#a7f3d0',
                      color: '#065f46',
                      padding: '2px 8px',
                      borderRadius: 6
                    }}
                  >
                    {formData.isKontrak
                      ? `Kontrak: Rp ${Math.round(parseFloat(formData.dataKontrak?.nilaiKontrak) || 0).toLocaleString('id-ID')}`
                      : 'Belum Berkontrak'}
                  </span>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: 'rgba(5, 150, 105, 0.12)',
                      color: '#059669',
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {openSections.kontrak ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              {openSections.kontrak && (
                <div style={{ padding: '18px 20px', background: '#fafdfb' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: formData.isKontrak ? '#f0fdf4' : '#fffbeb',
                      border: formData.isKontrak ? '1px solid #bbf7d0' : '1px solid #fde68a',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 13.5, color: formData.isKontrak ? '#166534' : '#92400e' }}>
                        {formData.isKontrak ? 'Status: Paket Sudah Menandatangani Kontrak' : 'Status: Masih Menunggu Hasil Tender/Pemilihan'}
                      </strong>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        Centang kotak di sebelah kanan jika SPK atau Kontrak pelaksanaan sudah terbit.
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
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
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
                        Nama Rekanan / Penyedia (CV / PT)
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
                        placeholder="000.3.3/.../SP/..."
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
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
                        Nilai Kontrak (Rp)
                      </label>
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
                      <label className="form-label">NPWP Rekanan Penyedia</label>
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
                          placeholder="Bank (mis. Bank Jateng)"
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
                        Periode Kontrak (Mulai SPMK & Selesai PHO) {formData.isKontrak && <span className="required">*</span>}
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="date"
                          className="form-control"
                          title="Tanggal Mulai SPMK"
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
                          title="Batas Selesai PHO"
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
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">Konsultan Pengawas / Tim Supervisi Lapangan</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: CV. Rancang Jaya Konsultan"
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
            </div>

            {/* =========================================================================
                SECTION 4: PROGRES FISIK & UPLOAD DOKUMENTASI FOTO (INDIGO THEME)
               ========================================================================= */}
            <div
              style={{
                borderRadius: 12,
                border: '1.5px solid #c7d2fe',
                background: '#ffffff',
                boxShadow: '0 2px 4px rgba(99, 102, 241, 0.04)',
                overflow: 'hidden',
                marginBottom: 16
              }}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleSection('fisik')}
                style={{
                  background: 'linear-gradient(90deg, #eef2ff 0%, #e0e7ff 100%)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderBottom: openSections.fisik ? '1px solid #c7d2fe' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: '#6366f1',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 13
                    }}
                  >
                    4
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#4338ca', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Camera size={17} color="#6366f1" />
                      <span>PROGRES FISIK & UPLOAD FOTO DOKUMENTASI (0%, 50%, 100%)</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#6366f1' }}>
                      Realisasi target fisik, deviasi, catatan lapangan, dan dokumentasi foto tersimpan ke database & web
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background:
                        formData.dataFisik.progresRealisasi >= 100
                          ? '#dcfce7'
                          : parseFloat(deviasiFisik) < -5
                          ? '#fee2e2'
                          : '#c7d2fe',
                      color:
                        formData.dataFisik.progresRealisasi >= 100
                          ? '#15803d'
                          : parseFloat(deviasiFisik) < -5
                          ? '#b91c1c'
                          : '#3730a3',
                      padding: '2px 8px',
                      borderRadius: 6
                    }}
                  >
                    Fisik: {formData.dataFisik.progresRealisasi}% ({parseFloat(deviasiFisik) >= 0 ? `+${deviasiFisik}%` : `${deviasiFisik}%`})
                  </span>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: '#6366f1',
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {openSections.fisik ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              {openSections.fisik && (
                <div style={{ padding: '18px 20px', background: '#fafbff' }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
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
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
                        Realisasi Fisik Terkini Lapangan (%) <span className="required">*</span>
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
                        rows={2}
                        placeholder="Contoh: Penyesuaian elevasi lapangan, kontraktor menambah tenaga kerja dan alat berat..."
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

                    {/* UPLOAD FOTO DOKUMENTASI (0%, 50%, 100%) */}
                    <div
                      className="form-group form-grid-full"
                      style={{
                        background: '#ffffff',
                        padding: '16px',
                        borderRadius: 12,
                        border: '1.5px solid #cbd5e1'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Camera size={16} color="#6366f1" />
                            <span>Unggah Foto Dokumentasi Lapangan (0%, 50%, 100%)</span>
                          </div>
                          <span style={{ fontSize: 11.5, color: '#64748b' }}>
                            Foto otomatis dikompresi optimal dan disimpan langsung ke database dan web.
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                        {/* Foto 0% */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, background: '#f8fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, background: '#0f2c59', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>
                              0% Titik Nol
                            </span>
                            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569' }}>Kondisi Awal</span>
                          </div>
                          {foto0 ? (
                            <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                              <img src={foto0} alt="0% Titik Nol" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                              <div style={{ padding: '6px 8px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: 11, color: '#0284c7', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <Upload size={11} /> Ganti
                                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('0%', e.target.files?.[0])} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => { setFoto0(''); setTanggal0(''); }}
                                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              style={{
                                height: 130,
                                borderRadius: 8,
                                border: '2px dashed #cbd5e1',
                                background: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#64748b',
                                gap: 4
                              }}
                            >
                              <Upload size={20} color="#6366f1" />
                              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0f2c59' }}>Pilih Foto 0%</span>
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('0%', e.target.files?.[0])} />
                            </label>
                          )}
                          <div style={{ marginTop: 8 }}>
                            <label style={{ fontSize: 10.5, color: '#64748b', fontWeight: 600 }}>Tanggal Pengambilan:</label>
                            <input
                              type="date"
                              className="form-control"
                              style={{ fontSize: 11.5, padding: '3px 6px', marginTop: 2 }}
                              value={tanggal0}
                              onChange={(e) => setTanggal0(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Foto 50% */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, background: '#f8fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, background: '#6366f1', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>
                              50% Progres
                            </span>
                            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569' }}>Pelaksanaan</span>
                          </div>
                          {foto50 ? (
                            <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                              <img src={foto50} alt="50% Progres" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                              <div style={{ padding: '6px 8px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: 11, color: '#0284c7', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <Upload size={11} /> Ganti
                                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('50%', e.target.files?.[0])} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => { setFoto50(''); setTanggal50(''); }}
                                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              style={{
                                height: 130,
                                borderRadius: 8,
                                border: '2px dashed #cbd5e1',
                                background: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#64748b',
                                gap: 4
                              }}
                            >
                              <Upload size={20} color="#6366f1" />
                              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0f2c59' }}>Pilih Foto 50%</span>
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('50%', e.target.files?.[0])} />
                            </label>
                          )}
                          <div style={{ marginTop: 8 }}>
                            <label style={{ fontSize: 10.5, color: '#64748b', fontWeight: 600 }}>Tanggal Pengambilan:</label>
                            <input
                              type="date"
                              className="form-control"
                              style={{ fontSize: 11.5, padding: '3px 6px', marginTop: 2 }}
                              value={tanggal50}
                              onChange={(e) => setTanggal50(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Foto 100% */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, background: '#f8fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>
                              100% Selesai
                            </span>
                            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569' }}>Hasil Akhir / PHO</span>
                          </div>
                          {foto100 ? (
                            <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                              <img src={foto100} alt="100% Selesai" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                              <div style={{ padding: '6px 8px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: 11, color: '#0284c7', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <Upload size={11} /> Ganti
                                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('100%', e.target.files?.[0])} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => { setFoto100(''); setTanggal100(''); }}
                                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              style={{
                                height: 130,
                                borderRadius: 8,
                                border: '2px dashed #cbd5e1',
                                background: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#64748b',
                                gap: 4
                              }}
                            >
                              <Upload size={20} color="#059669" />
                              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0f2c59' }}>Pilih Foto 100%</span>
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('100%', e.target.files?.[0])} />
                            </label>
                          )}
                          <div style={{ marginTop: 8 }}>
                            <label style={{ fontSize: 10.5, color: '#64748b', fontWeight: 600 }}>Tanggal Pengambilan:</label>
                            <input
                              type="date"
                              className="form-control"
                              style={{ fontSize: 11.5, padding: '3px 6px', marginTop: 2 }}
                              value={tanggal100}
                              onChange={(e) => setTanggal100(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =========================================================================
                SECTION 5: PROGRES KEUANGAN, NILAI SP2D, & RIWAYAT TERMIN (CYAN / TEAL THEME)
               ========================================================================= */}
            <div
              style={{
                borderRadius: 12,
                border: '1.5px solid #a5f3fc',
                background: '#ffffff',
                boxShadow: '0 2px 4px rgba(8, 145, 178, 0.04)',
                overflow: 'hidden',
                marginBottom: 16
              }}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleSection('keuangan')}
                style={{
                  background: 'linear-gradient(90deg, #ecfeff 0%, #cffafe 100%)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderBottom: openSections.keuangan ? '1px solid #a5f3fc' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: '#0891b2',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 13
                    }}
                  >
                    5
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0e7490', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <TrendingUp size={17} color="#0891b2" />
                      <span>PROGRES KEUANGAN, NILAI SP2D, & RIWAYAT TERMIN PENCAIRAN</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#0891b2' }}>
                      Realisasi SP2D, persentase keuangan, sisa dana, dan daftar riwayat pencairan termin
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background: '#a5f3fc',
                      color: '#155e75',
                      padding: '2px 8px',
                      borderRadius: 6
                    }}
                  >
                    Cair: Rp {Math.round(totalCairSekarang).toLocaleString('id-ID')} ({formData.dataKeuangan?.persenKeuangan || 0}%)
                  </span>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: 'rgba(8, 145, 178, 0.12)',
                      color: '#0891b2',
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {openSections.keuangan ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              {openSections.keuangan && (
                <div style={{ padding: '18px 20px', background: '#fafdff' }}>
                  {/* Summary Metric Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
                    <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: 11, color: '#166534', fontWeight: 700 }}>NILAI KONTRAK / DASAR</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#15803d', marginTop: 2 }}>
                        Rp {Math.round(baseKontrakOrPagu).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div style={{ background: '#ecfeff', padding: '12px 14px', borderRadius: 10, border: '1px solid #a5f3fc' }}>
                      <div style={{ fontSize: 11, color: '#0e7490', fontWeight: 700 }}>TOTAL PENCAIRAN SP2D</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#0891b2', marginTop: 2 }}>
                        Rp {Math.round(totalCairSekarang).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 11, color: '#475569', fontWeight: 700 }}>SISA ANGGARAN</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#334155', marginTop: 2 }}>
                        Rp {Math.round(sisaDana).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div style={{ background: '#eff6ff', padding: '12px 14px', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: 11, color: '#1e40af', fontWeight: 700 }}>PERSENTASE KEUANGAN</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#2563eb', marginTop: 2 }}>
                        {formData.dataKeuangan?.persenKeuangan || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Manual Override Fields (Opsional) */}
                  <div className="form-grid" style={{ marginBottom: 18 }}>
                    <div className="form-group">
                      <label className="form-label">Total Pencairan SP2D Kumulatif (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={formData.dataKeuangan?.totalPencairan || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const bVal = baseKontrakOrPagu > 0 ? baseKontrakOrPagu : 1;
                          const pct = parseFloat(((val / bVal) * 100).toFixed(2));
                          setFormData({
                            ...formData,
                            dataKeuangan: {
                              ...formData.dataKeuangan,
                              totalPencairan: val,
                              persenKeuangan: pct
                            }
                          });
                        }}
                      />
                      <span className="form-help">
                        Terbilang: Rp {(formData.dataKeuangan?.totalPencairan || 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Persen Realisasi Keuangan (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        className="form-control"
                        placeholder="0.00"
                        value={formData.dataKeuangan?.persenKeuangan || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dataKeuangan: {
                              ...formData.dataKeuangan,
                              persenKeuangan: parseFloat(e.target.value) || 0
                            }
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Riwayat Termin Table */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', background: '#ffffff', marginBottom: 16 }}>
                    <div
                      style={{
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59' }}>
                        Daftar Riwayat Termin SP2D ({formData.dataKeuangan?.terminHistory?.length || 0})
                      </span>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>
                        Tersinkron otomatis saat termin ditambahkan
                      </span>
                    </div>

                    {Array.isArray(formData.dataKeuangan?.terminHistory) && formData.dataKeuangan.terminHistory.length > 0 ? (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                              <th style={{ padding: '8px 12px' }}>Termin Ke</th>
                              <th style={{ padding: '8px 12px' }}>Nomor SP2D</th>
                              <th style={{ padding: '8px 12px' }}>Tanggal SP2D</th>
                              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Jumlah (Rp)</th>
                              <th style={{ padding: '8px 12px', textAlign: 'right' }}>%</th>
                              <th style={{ padding: '8px 12px' }}>Keterangan</th>
                              <th style={{ padding: '8px 12px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.dataKeuangan.terminHistory.map((t, idx) => (
                              <tr key={t.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f2c59' }}>{t.terminKe}</td>
                                <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 11.5 }}>{t.nomorSP2D || '-'}</td>
                                <td style={{ padding: '8px 12px' }}>{t.tanggalSP2D || '-'}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                                  Rp {Math.round(parseFloat(t.jumlah) || 0).toLocaleString('id-ID')}
                                </td>
                                <td style={{ padding: '8px 12px', textAlign: 'right' }}>{t.persen || 0}%</td>
                                <td style={{ padding: '8px 12px', color: '#64748b' }}>{t.keterangan || '-'}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTermin(t.id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#dc2626',
                                      cursor: 'pointer',
                                      padding: '2px 6px'
                                    }}
                                    title="Hapus Termin Ini"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: 12.5 }}>
                        Belum ada data riwayat termin SP2D tercatat. Gunakan formulir di bawah untuk menambah termin.
                      </div>
                    )}
                  </div>

                  {/* Sub-form Tambah Termin Baru */}
                  <div style={{ background: '#f0fdfa', border: '1px dashed #5eead4', padding: '14px', borderRadius: 10 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f766e', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Plus size={15} />
                      <span>+ Tambahkan Pencairan Termin SP2D Baru</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#134e4a', display: 'block', marginBottom: 2 }}>
                          Termin Ke (mis. Termin I 50%)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Termin I / Uang Muka"
                          value={newTermin.terminKe}
                          onChange={(e) => setNewTermin({ ...newTermin, terminKe: e.target.value })}
                          style={{ fontSize: 12 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#134e4a', display: 'block', marginBottom: 2 }}>
                          Nomor SP2D
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="SP2D-..."
                          value={newTermin.nomorSP2D}
                          onChange={(e) => setNewTermin({ ...newTermin, nomorSP2D: e.target.value })}
                          style={{ fontSize: 12 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#134e4a', display: 'block', marginBottom: 2 }}>
                          Tanggal SP2D
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={newTermin.tanggalSP2D}
                          onChange={(e) => setNewTermin({ ...newTermin, tanggalSP2D: e.target.value })}
                          style={{ fontSize: 12 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#134e4a', display: 'block', marginBottom: 2 }}>
                          Jumlah Pencairan (Rp)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0"
                          value={newTermin.jumlah}
                          onChange={(e) => setNewTermin({ ...newTermin, jumlah: e.target.value })}
                          style={{ fontSize: 12 }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#134e4a', display: 'block', marginBottom: 2 }}>
                          Keterangan / Berita Acara
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Pencairan termin sesuai BAP Fisik..."
                          value={newTermin.keterangan}
                          onChange={(e) => setNewTermin({ ...newTermin, keterangan: e.target.value })}
                          style={{ fontSize: 12 }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 10, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={handleAddTermin}
                        style={{
                          background: '#0d9488',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Plus size={14} /> Simpan ke Daftar Termin
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =========================================================================
                SECTION 6: ADMINISTRASI BERKAS SPJ & VERIFIKASI (ROSE / RED THEME)
               ========================================================================= */}
            <div
              style={{
                borderRadius: 12,
                border: '1.5px solid #fecdd3',
                background: '#ffffff',
                boxShadow: '0 2px 4px rgba(225, 29, 72, 0.04)',
                overflow: 'hidden',
                marginBottom: 24
              }}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleSection('spj')}
                style={{
                  background: 'linear-gradient(90deg, #fff1f2 0%, #ffe4e6 100%)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderBottom: openSections.spj ? '1px solid #fecdd3' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: '#e11d48',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 13
                    }}
                  >
                    6
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: '#be123c', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle size={17} color="#e11d48" />
                      <span>ADMINISTRASI BERKAS SPJ & VERIFIKASI KEUANGAN</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#e11d48' }}>
                      Status pengajuan berkas SPJ, verifikasi tim keuangan, tanggal berkas masuk, nomor SPM, dan catatan
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#fecdd3',
                      color: '#9f1239',
                      padding: '2px 8px',
                      borderRadius: 6
                    }}
                  >
                    Status: {formData.administrasiSPJ?.status || 'Belum Mengajukan SPJ'}
                  </span>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: 'rgba(225, 29, 72, 0.12)',
                      color: '#e11d48',
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {openSections.spj ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              {openSections.spj && (
                <div style={{ padding: '18px 20px', background: '#fffafa' }}>
                  <div className="form-grid">
                    <div className="form-group form-grid-full">
                      <label className="form-label" style={{ fontWeight: 700, color: '#0f2c59' }}>
                        Status Pengajuan Berkas SPJ Keuangan <span className="required">*</span>
                      </label>
                      <select
                        className="form-control"
                        value={formData.administrasiSPJ?.status || 'Belum Mengajukan SPJ'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            administrasiSPJ: {
                              ...formData.administrasiSPJ,
                              status: e.target.value
                            }
                          })
                        }
                        style={{ fontWeight: 700 }}
                      >
                        <option value="Belum Mengajukan SPJ">Belum Mengajukan SPJ</option>
                        <option value="Berkas Masuk (Proses Verifikasi)">Berkas Masuk (Proses Verifikasi)</option>
                        <option value="Perbaikan Berkas">Perbaikan Berkas</option>
                        <option value="Berkas Lengkap (Proses SPM)">Berkas Lengkap (Proses SPM)</option>
                        <option value="Terbit SPM">Terbit SPM</option>
                        <option value="Terbit SP2D (Selesai)">Terbit SP2D (Selesai)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tanggal Berkas SPJ Masuk</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.administrasiSPJ?.tanggalMasuk || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            administrasiSPJ: {
                              ...formData.administrasiSPJ,
                              tanggalMasuk: e.target.value
                            }
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Petugas / Tim Verifikator Keuangan</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nama Verifikator SPJ"
                        value={formData.administrasiSPJ?.diverifikasiOleh || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            administrasiSPJ: {
                              ...formData.administrasiSPJ,
                              diverifikasiOleh: e.target.value
                            }
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nomor & Tanggal SPM</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nomor SPM"
                          value={formData.administrasiSPJ?.noSPM || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              administrasiSPJ: {
                                ...formData.administrasiSPJ,
                                noSPM: e.target.value
                              }
                            })
                          }
                          style={{ flex: 1.5 }}
                        />
                        <input
                          type="date"
                          className="form-control"
                          title="Tanggal SPM"
                          value={formData.administrasiSPJ?.tanggalSPM || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              administrasiSPJ: {
                                ...formData.administrasiSPJ,
                                tanggalSPM: e.target.value
                              }
                            })
                          }
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nomor & Tanggal SP2D Utama</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nomor SP2D"
                          value={formData.administrasiSPJ?.noSP2D || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              administrasiSPJ: {
                                ...formData.administrasiSPJ,
                                noSP2D: e.target.value
                              }
                            })
                          }
                          style={{ flex: 1.5 }}
                        />
                        <input
                          type="date"
                          className="form-control"
                          title="Tanggal SP2D"
                          value={formData.administrasiSPJ?.tanggalSP2D || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              administrasiSPJ: {
                                ...formData.administrasiSPJ,
                                tanggalSP2D: e.target.value
                              }
                            })
                          }
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">Catatan Hasil Verifikasi SPJ</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Contoh: Berkas SPJ lengkap, kwitansi bermaterai, pajak PPh/PPN telah dipotong, proses pencairan SP2D..."
                        value={formData.administrasiSPJ?.catatanVerifikasi || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            administrasiSPJ: {
                              ...formData.administrasiSPJ,
                              catatanVerifikasi: e.target.value
                            }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Modal Action Buttons */}
          <div
            className="modal-footer"
            style={{
              padding: '14px 24px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Pastikan seluruh isian telah diverifikasi sebelum menyimpan.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-outline" onClick={onClose} style={{ padding: '8px 18px' }}>
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '8px 22px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 700
                }}
              >
                <Save size={16} />
                {isEdit ? 'Simpan Perubahan Paket' : 'Simpan Paket Pekerjaan'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal Pengaturan Master Program, Kegiatan, Sub Kegiatan SIPD */}
      {isSipdMasterModalOpen && (
        <SipdMasterModal
          isOpen={isSipdMasterModalOpen}
          onClose={() => setIsSipdMasterModalOpen(false)}
        />
      )}

      {/* Pop Up Konfirmasi */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Pop Up Notifikasi */}
      <NotificationModal
        isOpen={notifModal.isOpen}
        title={notifModal.title}
        message={notifModal.message}
        type={notifModal.type}
        btnText={notifModal.btnText}
        onClose={() => {
          setNotifModal((prev) => ({ ...prev, isOpen: false }));
          onClose();
        }}
      />
    </div>
  );
};

export default ProjectModal;
