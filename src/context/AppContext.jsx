import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS, INITIAL_PROJECTS } from '../data/initialData';
import {
  DEFAULT_YEARS,
  ROLE_DEFINITIONS,
  BIDANG_LIST,
  DEFAULT_TAGS,
  STATUS_SPJ_KEUANGAN,
  TAHAPAN_PRA_KONTRAK,
  DEFAULT_SYSTEM_SETTINGS,
  DEFAULT_CUSTOM_TEXTS,
  DEFAULT_BIDANG_DESCRIPTIONS,
  DEFAULT_KATEGORI_PEKERJAAN,
  SUMBER_DANA
} from '../data/constants';
import {
  INITIAL_SIPD_PROGRAMS,
  INITIAL_SIPD_KEGIATAN,
  INITIAL_SIPD_SUB_KEGIATAN,
  matchProjectToSubKegiatan
} from '../data/sipdData';
import {
  KATEGORI_PENDAPATAN,
  DEFAULT_TARGET_CONFIG,
  generateDummyPendapatanTransactions
} from '../data/pendapatanData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Data Versioning & Auto-Migration for Real 2026 Dataset & Users
  if (typeof window !== 'undefined') {
    const currentVersion = localStorage.getItem('simon_app_version_2026');
    if (currentVersion !== '2026_real_v1') {
      localStorage.removeItem('simon_users');
      localStorage.removeItem('simon_current_user');
      localStorage.removeItem('simon_projects_v2');
      localStorage.removeItem('simon_sipd_programs');
      localStorage.removeItem('simon_sipd_kegiatans');
      localStorage.removeItem('simon_sipd_sub_kegiatans');
      localStorage.setItem('simon_app_version_2026', '2026_real_v1');
    }
  }

  // Years State
  const [years, setYears] = useState(() => {
    const saved = localStorage.getItem('simon_years');
    return saved ? JSON.parse(saved) : DEFAULT_YEARS;
  });

  const [activeYear, setActiveYear] = useState(() => {
    const saved = localStorage.getItem('simon_active_year');
    return saved ? parseInt(saved, 10) : 2026;
  });

  // Master System Settings State (Superadmin)
  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('simon_system_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.namaSistem || parsed.instansi)) {
          return {
            ...DEFAULT_SYSTEM_SETTINGS,
            ...parsed,
            namaSistem:
              parsed.namaSistem === 'SIMON-PUPR Demak' || parsed.namaSistem === 'SIMON-PUPR'
                ? 'SIMON - SATUPUTARU'
                : parsed.namaSistem || 'SIMON - SATUPUTARU',
            subNama: (parsed.subNama || DEFAULT_SYSTEM_SETTINGS.subNama).replace(/Dinas PUPR/g, 'DINPUTARU').replace(/PUPR/g, 'DINPUTARU'),
            maxPublicHighlights:
              parsed.maxPublicHighlights !== undefined ? parseInt(parsed.maxPublicHighlights, 10) : 10,
            namaKepalaDinas: parsed.namaKepalaDinas || DEFAULT_SYSTEM_SETTINGS.namaKepalaDinas,
            nipKepalaDinas: parsed.nipKepalaDinas || DEFAULT_SYSTEM_SETTINGS.nipKepalaDinas,
            pangkatKepalaDinas: parsed.pangkatKepalaDinas || DEFAULT_SYSTEM_SETTINGS.pangkatKepalaDinas,
            jabatanKepalaDinas: parsed.jabatanKepalaDinas || DEFAULT_SYSTEM_SETTINGS.jabatanKepalaDinas,
            namaSekretaris: parsed.namaSekretaris || DEFAULT_SYSTEM_SETTINGS.namaSekretaris,
            nipSekretaris: parsed.nipSekretaris || DEFAULT_SYSTEM_SETTINGS.nipSekretaris,
            pangkatSekretaris: parsed.pangkatSekretaris || DEFAULT_SYSTEM_SETTINGS.pangkatSekretaris,
            jabatanSekretaris: (parsed.jabatanSekretaris || DEFAULT_SYSTEM_SETTINGS.jabatanSekretaris).replace(/PUPR/g, 'DINPUTARU'),
            galeri: Array.isArray(parsed.galeri) && parsed.galeri.length > 0 ? parsed.galeri : DEFAULT_SYSTEM_SETTINGS.galeri,
            customTexts: {
              ...DEFAULT_CUSTOM_TEXTS,
              ...(parsed.customTexts || {})
            },
            bidangDescriptions: {
              ...DEFAULT_BIDANG_DESCRIPTIONS,
              ...(parsed.bidangDescriptions || {})
            }
          };
        }
      } catch (e) {}
    }
    return DEFAULT_SYSTEM_SETTINGS;
  });

  // Users State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('simon_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const loaded = parsed.map((u) => ({
            ...u,
            username: u.username || u.email?.split('@')[0] || u.id,
            password: u.password || 'pupr2025'
          }));
          const existingIds = new Set(loaded.map((u) => u.id));
          const missing = INITIAL_USERS.filter((iu) => !existingIds.has(iu.id));
          return [...loaded, ...missing];
        }
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  // Active Logged-in User
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('simon_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          return {
            ...parsed,
            username: parsed.username || parsed.email?.split('@')[0] || parsed.id,
            password: parsed.password || 'pupr2025'
          };
        }
      } catch (e) {}
    }
    return INITIAL_USERS[0]; // Default Superadmin
  });

  // Login Session State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('simon_is_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  // Master Tagging State
  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem('simon_tags');
    return saved ? JSON.parse(saved) : DEFAULT_TAGS;
  });

  // Master Kategori Pekerjaan & Jenis Pengadaan (Superadmin)
  const [kategoriPekerjaanList, setKategoriPekerjaanList] = useState(() => {
    const saved = localStorage.getItem('simon_kategori_pekerjaan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4 && parsed.some((k) => k.nama === 'Swakelola')) {
          return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_KATEGORI_PEKERJAAN;
  });

  // Master Alur Pra-Kontrak (12 Tahapan Baru)
  const [praKontrakStages, setPraKontrakStages] = useState(() => {
    const saved = localStorage.getItem('simon_prakontrak_stages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validasi: pastikan memiliki 12 tahapan dan berisi tahap 'batal'
        if (Array.isArray(parsed) && parsed.length >= 10 && parsed.some((s) => s.id === 'batal')) {
          return parsed;
        }
      } catch (e) {}
    }
    return TAHAPAN_PRA_KONTRAK;
  });

  // Master Status Administrasi SPJ (Pengaturan Keberlanjutan)
  const [spjStatuses, setSpjStatuses] = useState(() => {
    const saved = localStorage.getItem('simon_spj_statuses');
    return saved ? JSON.parse(saved) : STATUS_SPJ_KEUANGAN;
  });

  // Master Sumber Pendanaan (Superadmin)
  const [sumberDanaList, setSumberDanaList] = useState(() => {
    const saved = localStorage.getItem('simon_sumber_dana');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return SUMBER_DANA;
  });

  // Master Nomenklatur SIPD Kemendagri State (Superadmin & Koordinator Bidang)
  const [sipdPrograms, setSipdPrograms] = useState(() => {
    const saved = localStorage.getItem('simon_sipd_programs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_SIPD_PROGRAMS;
  });

  const [sipdKegiatans, setSipdKegiatans] = useState(() => {
    const saved = localStorage.getItem('simon_sipd_kegiatans');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_SIPD_KEGIATAN;
  });

  const [sipdSubKegiatans, setSipdSubKegiatans] = useState(() => {
    const saved = localStorage.getItem('simon_sipd_sub_kegiatans');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_SIPD_SUB_KEGIATAN;
  });

  // Monitoring Pendapatan Retribusi State (Menu ke-6 DINPUTARU)
  const [pendapatanTransactions, setPendapatanTransactions] = useState(() => {
    const saved = localStorage.getItem('simon_pendapatan_trx');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return generateDummyPendapatanTransactions(2026);
  });

  const [pendapatanTargetConfig, setPendapatanTargetConfig] = useState(() => {
    const saved = localStorage.getItem('simon_pendapatan_target');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.targetTahunanTotal) return parsed;
      } catch (e) {}
    }
    return DEFAULT_TARGET_CONFIG;
  });

  // Projects State (Master Data Terpadu untuk 4 Menu + Menu 5 SIPD)
  const [projects, setProjects] = useState(() => {
    const mapProjectClean = (p) => {
      // Clean kategori pekerjaan
      const kategoriPekerjaan = p.kategoriPekerjaan || (p.bidangId === 'tata_ruang' ? 'Jakon' : 'Fisik');

      // Clean tipe pengadaan
      let tipePengadaan = p.tipePengadaan || 'Tender';
      if (tipePengadaan.includes('Tender / Seleksi')) {
        tipePengadaan = kategoriPekerjaan === 'Jakon' ? 'Seleksi' : 'Tender';
      } else if (tipePengadaan.includes('Katalog') || tipePengadaan.includes('Minikompetisi')) {
        tipePengadaan = kategoriPekerjaan === 'Barang' ? 'e-Purchasing' : 'Minikom';
      } else if (tipePengadaan.includes('Pengadaan Langsung')) {
        tipePengadaan = 'Pengadaan Langsung';
      } else if (tipePengadaan.includes('Penunjukan Langsung')) {
        tipePengadaan = 'Pengadaan Langsung';
      }

      // Clean tahap pra-kontrak
      let statusTahap = p.tahapPraKontrak?.status || 'rup';
      if (p.isKontrak) {
        statusTahap = 'kontrak';
      } else if (statusTahap === 'pemilihan' || statusTahap === 'pbj') {
        statusTahap = 'tayang';
      } else if (statusTahap === 'hps') {
        statusTahap = 'perencanaan';
      } else if (statusTahap === 'evaluasi') {
        statusTahap = 'sppbj';
      }

      const isBatal = statusTahap === 'batal';
      const isKontrak = !isBatal && (statusTahap === 'kontrak' || p.isKontrak);

      // SIPD Mapping
      let matchedSub = null;
      if (p.subKegiatanId) {
        matchedSub = INITIAL_SIPD_SUB_KEGIATAN.find((s) => s.id === p.subKegiatanId);
      }
      if (!matchedSub && p.kodeSubKegiatan) {
        matchedSub = INITIAL_SIPD_SUB_KEGIATAN.find((s) => s.kodeSubKegiatan === p.kodeSubKegiatan);
      }
      if (!matchedSub) {
        matchedSub = matchProjectToSubKegiatan(p, INITIAL_SIPD_SUB_KEGIATAN);
      }

      return {
        ...p,
        programId: p.programId || matchedSub?.programId || '',
        kegiatanId: p.kegiatanId || matchedSub?.kegiatanId || '',
        subKegiatanId: p.subKegiatanId || matchedSub?.id || '',
        kodeSubKegiatan: p.kodeSubKegiatan || matchedSub?.kodeSubKegiatan || '',
        namaSubKegiatan: p.namaSubKegiatan || matchedSub?.namaSubKegiatan || '',
        kategoriPekerjaan,
        tipePengadaan,
        isKontrak,
        jenisAnggaran: p.jenisAnggaran || 'Murni',
        kecamatan: p.kecamatan || 'Demak',
        desa: p.desa || 'Bintoro',
        tags: p.tags || [],
        latitude: p.latitude || '-6.8942',
        longitude: p.longitude || '110.6385',
        isPublicHighlight: p.isPublicHighlight !== undefined ? p.isPublicHighlight : true,
        tahapPraKontrak: {
          ...p.tahapPraKontrak,
          status: statusTahap,
          catatanPraKontrak: isBatal
            ? (p.tahapPraKontrak?.catatanPraKontrak || 'Pekerjaan dibatalkan')
            : (p.tahapPraKontrak?.catatanPraKontrak || '')
        },
        dataKontrak: {
          ...p.dataKontrak,
          tanggalMulai: p.dataKontrak?.tanggalMulai || '',
          tanggalSelesai: p.dataKontrak?.tanggalSelesai || ''
        },
        dataFisik: {
          ...p.dataFisik,
          statusDeviasi: isBatal ? 'Batal' : (p.dataFisik?.statusDeviasi || 'Aman')
        },
        administrasiSPJ: p.administrasiSPJ || {
          status: isKontrak && p.dataFisik?.progresRealisasi >= 100 ? 'sudah_sp2d' : 'belum_masuk',
          tanggalMasuk: '',
          tanggalKoreksi: '',
          tanggalSPM: '',
          nomorSPM: '',
          catatanVerifikator: '',
          petugasVerifikator: ''
        }
      };
    };

    const saved = localStorage.getItem('simon_projects_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PROJECTS.length) {
          return parsed.map(mapProjectClean);
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PROJECTS.map(mapProjectClean);
  });

  // Active Navigation Tab
  // 'dashboard' | 'prakontrak' | 'fisik' | 'keuangan' | 'spj_keuangan' | 'laporan'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Global Toast / Alert Notifications
  const [toast, setToast] = useState(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('simon_years', JSON.stringify(years));
  }, [years]);

  useEffect(() => {
    localStorage.setItem('simon_active_year', activeYear.toString());
  }, [activeYear]);

  useEffect(() => {
    localStorage.setItem('simon_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('simon_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('simon_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('simon_tags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('simon_prakontrak_stages', JSON.stringify(praKontrakStages));
  }, [praKontrakStages]);

  useEffect(() => {
    localStorage.setItem('simon_kategori_pekerjaan', JSON.stringify(kategoriPekerjaanList));
  }, [kategoriPekerjaanList]);

  useEffect(() => {
    localStorage.setItem('simon_spj_statuses', JSON.stringify(spjStatuses));
  }, [spjStatuses]);

  useEffect(() => {
    localStorage.setItem('simon_sumber_dana', JSON.stringify(sumberDanaList));
  }, [sumberDanaList]);

  useEffect(() => {
    localStorage.setItem('simon_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('simon_projects_v2', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('simon_sipd_programs', JSON.stringify(sipdPrograms));
  }, [sipdPrograms]);

  useEffect(() => {
    localStorage.setItem('simon_sipd_kegiatans', JSON.stringify(sipdKegiatans));
  }, [sipdKegiatans]);

  useEffect(() => {
    localStorage.setItem('simon_sipd_sub_kegiatans', JSON.stringify(sipdSubKegiatans));
  }, [sipdSubKegiatans]);

  useEffect(() => {
    localStorage.setItem('simon_pendapatan_trx', JSON.stringify(pendapatanTransactions));
  }, [pendapatanTransactions]);

  useEffect(() => {
    localStorage.setItem('simon_pendapatan_target', JSON.stringify(pendapatanTargetConfig));
  }, [pendapatanTargetConfig]);

  // Remote Database Sync (Hostinger MySQL API Bridge)
  useEffect(() => {
    let isMounted = true;
    const fetchRemoteData = async () => {
      try {
        const res = await fetch('/api/api.php?action=load_all');
        if (res.ok) {
          const json = await res.json();
          if (json && json.status === 'success' && json.data && isMounted) {
            if (Array.isArray(json.data.projects) && json.data.projects.length > 0) {
              setProjects(json.data.projects);
            }
            if (json.data.systemSettings) {
              setSystemSettings((prev) => ({ ...prev, ...json.data.systemSettings }));
            }
            if (Array.isArray(json.data.users) && json.data.users.length > 0) {
              setUsers(json.data.users);
            }
            if (Array.isArray(json.data.tags) && json.data.tags.length > 0) {
              setTags(json.data.tags);
            }
            if (Array.isArray(json.data.sipdPrograms) && json.data.sipdPrograms.length > 0) {
              setSipdPrograms(json.data.sipdPrograms);
            }
            if (Array.isArray(json.data.sipdKegiatans) && json.data.sipdKegiatans.length > 0) {
              setSipdKegiatans(json.data.sipdKegiatans);
            }
            if (Array.isArray(json.data.sipdSubKegiatans) && json.data.sipdSubKegiatans.length > 0) {
              setSipdSubKegiatans(json.data.sipdSubKegiatans);
            }
            if (Array.isArray(json.data.years) && json.data.years.length > 0) {
              setYears(json.data.years);
            }
          }
        }
      } catch (err) {
        // Fallback offline / local dev
      }
    };
    fetchRemoteData();
    return () => {
      isMounted = false;
    };
  }, []);

  const syncProjectToRemote = async (project) => {
    try {
      await fetch('/api/api.php?action=save_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
    } catch (e) {
      // offline fallback
    }
  };

  const deleteProjectFromRemote = async (projectId) => {
    try {
      await fetch(`/api/api.php?action=delete_project&id=${encodeURIComponent(projectId)}`);
    } catch (e) {
      // offline fallback
    }
  };

  const syncSettingsToRemote = async (settings) => {
    try {
      await fetch('/api/api.php?action=save_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (e) {
      // offline fallback
    }
  };

  const syncUserToRemote = async (user) => {
    try {
      await fetch('/api/api.php?action=save_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } catch (e) {
      // offline fallback
    }
  };

  const deleteUserFromRemote = async (userId) => {
    try {
      await fetch(`/api/api.php?action=delete_user&id=${encodeURIComponent(userId)}`);
    } catch (e) {
      // offline fallback
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Authentication: Login & Logout
  const login = (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Match users by username, email, or NIP
    let matchedUsers = users.filter((u) => {
      const uEmail = (u.email || '').toLowerCase();
      const uUser = (u.username || '').toLowerCase();
      const uNip = (u.nip || '').replace(/\s+/g, '');
      const cleanNip = cleanId.replace(/\s+/g, '');
      return uEmail === cleanId || uUser === cleanId || (uNip && uNip === cleanNip);
    });

    // Fallback for koor.sekre1 / koor.sekre2
    if (matchedUsers.length === 0 && cleanId === 'koor.sekre1') {
      const rani = users.find((u) => u.username === 'koor.sekre2');
      if (rani) matchedUsers = [rani];
    }

    if (matchedUsers.length === 0) {
      return { success: false, message: 'Akun dengan email / username / NIP tersebut tidak ditemukan!' };
    }

    // Pick user matching password if multiple matched (e.g. same NIP or dual roles)
    const user = matchedUsers.find((u) => (u.password || 'pupr2025') === cleanPass) || matchedUsers[0];

    const userPassword = user.password || 'pupr2025';
    if (userPassword !== cleanPass) {
      return { success: false, message: 'Kata sandi / Password salah! Silakan periksa kembali.' };
    }

    setCurrentUser(user);
    setIsLoggedIn(true);
    showToast(`Selamat datang kembali, ${user.nama}!`, 'success');
    return { success: true, user };
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Anda telah keluar dari sistem SIMON - SATUPUTARU (DINPUTARU).', 'info');
  };

  // Switch User
  const switchUser = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    showToast(`Beralih ke akun: ${user.nama} (${ROLE_DEFINITIONS[user.role]?.nama})`, 'info');
  };

  // Add Year (Superadmin only)
  const addYear = (year) => {
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      showToast('Tahun tidak valid!', 'error');
      return false;
    }
    if (years.includes(yearNum)) {
      showToast(`Tahun Anggaran ${yearNum} sudah terdaftar!`, 'error');
      return false;
    }
    const updated = [...years, yearNum].sort((a, b) => a - b);
    setYears(updated);
    setActiveYear(yearNum);
    showToast(`Tahun Anggaran ${yearNum} berhasil ditambahkan!`, 'success');
    return true;
  };

  // User Management (Superadmin only)
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: `usr_${Date.now()}`,
      username: userData.username || userData.email?.split('@')[0] || `user_${Date.now().toString().slice(-4)}`,
      password: userData.password || 'pupr2025'
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Pengguna baru ${newUser.nama} berhasil ditambahkan!`, 'success');
    syncUserToRemote(newUser);
    return true;
  };

  const updateUser = (userId, updatedData) => {
    let updatedUserObj = null;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const merged = { ...u, ...updatedData };
          // If password was empty in updatedData, preserve existing password
          if (!updatedData.password) {
            merged.password = u.password || 'pupr2025';
          }
          updatedUserObj = merged;
          return merged;
        }
        return u;
      })
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => {
        const merged = { ...prev, ...updatedData };
        if (!updatedData.password) {
          merged.password = prev.password || 'pupr2025';
        }
        return merged;
      });
    }
    showToast('Data pengguna & kredensial berhasil diperbarui!', 'success');
    if (updatedUserObj) {
      syncUserToRemote(updatedUserObj);
    }
    return true;
  };

  const deleteUser = (userId) => {
    if (users.length <= 1) {
      showToast('Minimal harus ada 1 pengguna di sistem!', 'error');
      return false;
    }
    if (currentUser.id === userId) {
      showToast('Tidak dapat menghapus akun yang sedang aktif digunakan!', 'error');
      return false;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('Pengguna berhasil dihapus.', 'info');
    deleteUserFromRemote(userId);
    return true;
  };

  // Tagging Management
  const addTag = (newTag) => {
    const trimmed = (newTag || '').trim();
    if (!trimmed) return false;
    if (tags.includes(trimmed)) {
      showToast(`Tagging "${trimmed}" sudah ada!`, 'info');
      return false;
    }
    setTags((prev) => [...prev, trimmed]);
    showToast(`Tagging "${trimmed}" berhasil ditambahkan!`, 'success');
    return true;
  };

  const deleteTag = (tagToDelete) => {
    setTags((prev) => prev.filter((t) => t !== tagToDelete));
    showToast(`Tagging "${tagToDelete}" berhasil dihapus.`, 'info');
    return true;
  };

  // Pre-Contract Stages Management (Pengaturan Keberlanjutan Superadmin)
  const addPraKontrakStage = (stageData) => {
    const newStage = {
      ...stageData,
      id: stageData.id || `stage_${Date.now()}`,
      order: praKontrakStages.length + 1
    };
    setPraKontrakStages((prev) => [...prev, newStage]);
    showToast(`Tahap pra-kontrak "${newStage.label}" berhasil ditambahkan!`, 'success');
    return true;
  };

  const deletePraKontrakStage = (stageId) => {
    if (praKontrakStages.length <= 2) {
      showToast('Minimal harus ada 2 tahapan pra-kontrak!', 'error');
      return false;
    }
    setPraKontrakStages((prev) => prev.filter((s) => s.id !== stageId));
    showToast('Tahap pra-kontrak berhasil dihapus.', 'info');
    return true;
  };

  // Master Kategori Pekerjaan & Jenis Pengadaan Management (Superadmin)
  const addKategoriPekerjaan = (kategoriData) => {
    if (!kategoriData?.nama?.trim()) {
      showToast('Nama kategori pekerjaan wajib diisi!', 'error');
      return false;
    }
    const cleanNama = kategoriData.nama.trim();
    const id = cleanNama.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const exists = kategoriPekerjaanList.some(
      (k) => k.id === id || k.nama.toLowerCase() === cleanNama.toLowerCase()
    );
    if (exists) {
      showToast(`Kategori "${cleanNama}" sudah terdaftar!`, 'error');
      return false;
    }
    const newCategory = {
      id: id || `kat_${Date.now()}`,
      nama: cleanNama,
      deskripsi: kategoriData.deskripsi?.trim() || '',
      jenisPengadaan: Array.isArray(kategoriData.jenisPengadaan) ? kategoriData.jenisPengadaan : []
    };
    setKategoriPekerjaanList((prev) => [...prev, newCategory]);
    showToast(`Kategori pekerjaan "${newCategory.nama}" berhasil ditambahkan!`, 'success');
    return true;
  };

  const deleteKategoriPekerjaan = (kategoriId) => {
    if (kategoriPekerjaanList.length <= 1) {
      showToast('Minimal harus ada 1 kategori pekerjaan di sistem!', 'error');
      return false;
    }
    setKategoriPekerjaanList((prev) => prev.filter((k) => k.id !== kategoriId));
    showToast('Kategori pekerjaan berhasil dihapus.', 'info');
    return true;
  };

  const addJenisPengadaanToKategori = (kategoriId, jenisNama) => {
    if (!jenisNama || !jenisNama.trim()) return false;
    const trimmed = jenisNama.trim();
    setKategoriPekerjaanList((prev) =>
      prev.map((k) => {
        if (k.id !== kategoriId) return k;
        if (k.jenisPengadaan.includes(trimmed)) {
          showToast(`Jenis pengadaan "${trimmed}" sudah ada di kategori ini!`, 'info');
          return k;
        }
        return {
          ...k,
          jenisPengadaan: [...k.jenisPengadaan, trimmed]
        };
      })
    );
    showToast(`Jenis pengadaan "${trimmed}" berhasil ditambahkan!`, 'success');
    return true;
  };

  const deleteJenisPengadaanFromKategori = (kategoriId, jenisNama) => {
    setKategoriPekerjaanList((prev) =>
      prev.map((k) => {
        if (k.id !== kategoriId) return k;
        return {
          ...k,
          jenisPengadaan: k.jenisPengadaan.filter((j) => j !== jenisNama)
        };
      })
    );
    showToast(`Jenis pengadaan "${jenisNama}" berhasil dihapus.`, 'info');
    return true;
  };

  const resetKategoriPekerjaan = () => {
    setKategoriPekerjaanList(DEFAULT_KATEGORI_PEKERJAAN);
    localStorage.setItem('simon_kategori_pekerjaan', JSON.stringify(DEFAULT_KATEGORI_PEKERJAAN));
    showToast('Kategori pekerjaan dan jenis pengadaan direset ke standar!', 'info');
  };

  // Master Sumber Pendanaan Management (Superadmin)
  const addSumberDana = (namaDana) => {
    const trimmed = (namaDana || '').trim();
    if (!trimmed) {
      showToast('Nama sumber pendanaan wajib diisi!', 'error');
      return false;
    }
    if (sumberDanaList.some((d) => d.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Sumber pendanaan "${trimmed}" sudah terdaftar!`, 'error');
      return false;
    }
    setSumberDanaList((prev) => [...prev, trimmed]);
    showToast(`Sumber pendanaan "${trimmed}" berhasil ditambahkan!`, 'success');
    return true;
  };

  const deleteSumberDana = (danaToDelete) => {
    if (sumberDanaList.length <= 1) {
      showToast('Minimal harus ada 1 sumber pendanaan di sistem!', 'error');
      return false;
    }
    setSumberDanaList((prev) => prev.filter((d) => d !== danaToDelete));
    showToast(`Sumber pendanaan "${danaToDelete}" berhasil dihapus.`, 'info');
    return true;
  };

  const resetSumberDana = () => {
    setSumberDanaList(SUMBER_DANA);
    localStorage.setItem('simon_sumber_dana', JSON.stringify(SUMBER_DANA));
    showToast('Daftar sumber pendanaan direset ke standar!', 'info');
  };

  // SPJ Statuses Management (Pengaturan Keberlanjutan Superadmin)
  const addSpjStatus = (statusData) => {
    const newStatus = {
      ...statusData,
      id: statusData.id || `spj_${Date.now()}`
    };
    setSpjStatuses((prev) => [...prev, newStatus]);
    showToast(`Status SPJ "${newStatus.label}" berhasil ditambahkan!`, 'success');
    return true;
  };

  const deleteSpjStatus = (statusId) => {
    setSpjStatuses((prev) => prev.filter((s) => s.id !== statusId));
    showToast('Status SPJ berhasil dihapus.', 'info');
    return true;
  };

  // Master System Settings & Landing Page Gallery Management (Superadmin)
  const updateSystemSettings = (newSettings) => {
    setSystemSettings((prev) => ({
      ...prev,
      ...newSettings
    }));

    // Otomatis sinkronkan nama & NIP Kepala Dinas dan Sekretaris ke daftar akun pengguna jika ada perubahan
    if (newSettings.namaKepalaDinas || newSettings.nipKepalaDinas || newSettings.namaSekretaris || newSettings.nipSekretaris) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.role === 'kadin' || u.id === 'usr_kadin') {
            return {
              ...u,
              nama: newSettings.namaKepalaDinas || u.nama,
              nip: newSettings.nipKepalaDinas || u.nip
            };
          }
          if (u.role === 'sekretaris' || u.id === 'usr_sekretaris') {
            return {
              ...u,
              nama: newSettings.namaSekretaris || u.nama,
              nip: newSettings.nipSekretaris || u.nip
            };
          }
          return u;
        })
      );
    }

    showToast('Pengaturan, Identitas Sistem, & Pimpinan Dinas berhasil disimpan!', 'success');
    syncSettingsToRemote({ ...systemSettings, ...newSettings });
    return true;
  };

  const addGalleryItem = (galleryItem) => {
    const newItem = {
      ...galleryItem,
      id: `gal-${Date.now()}`
    };
    setSystemSettings((prev) => ({
      ...prev,
      galeri: [newItem, ...(prev.galeri || [])]
    }));
    showToast('Foto bangunan dinas berhasil ditambahkan ke Galeri Landing Page!', 'success');
    return newItem;
  };

  const updateGalleryItem = (id, updatedItem) => {
    setSystemSettings((prev) => ({
      ...prev,
      galeri: (prev.galeri || []).map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    }));
    showToast('Foto galeri berhasil diperbarui!', 'success');
    return true;
  };

  const deleteGalleryItem = (id) => {
    setSystemSettings((prev) => ({
      ...prev,
      galeri: (prev.galeri || []).filter((item) => item.id !== id)
    }));
    showToast('Foto galeri berhasil dihapus.', 'info');
    return true;
  };

  // Update SPJ Status for a Project
  const updateSPJStatus = (projectId, spjData) => {
    let updatedTarget = null;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const merged = {
          ...p,
          administrasiSPJ: {
            ...p.administrasiSPJ,
            ...spjData,
            petugasVerifikator: currentUser.nama,
            tanggalUpdate: new Date().toLocaleDateString('id-ID')
          },
          updatedAt: new Date().toLocaleString('id-ID'),
          updatedBy: currentUser.nama
        };
        updatedTarget = merged;
        return merged;
      })
    );
    showToast(`Status berkas SPJ pekerjaan ${projectId} berhasil diperbarui!`, 'success');
    if (updatedTarget) {
      syncProjectToRemote(updatedTarget);
    }
    return true;
  };

  // Project Access Permissions & Filtering
  const userRoleDef = ROLE_DEFINITIONS[currentUser?.role] || ROLE_DEFINITIONS.superadmin;

  // Projects strictly for active year
  const activeYearProjects = projects.filter((p) => p.tahunAnggaran === activeYear);

  // Projects accessible by the current user:
  // - Superadmin, Sekretaris, Kepala Dinas, Kasubag ProgKeu, Koord ProgKeu: See ALL Bidang
  // - Kasubag Umpeg & Koord Umpeg: See Sekretariat Bidang
  // - Koordinator, Kepala Bidang: See ONLY their own Bidang!
  const accessibleProjects = activeYearProjects.filter((p) => {
    if (userRoleDef.canSeeAllBidang) return true;
    if (currentUser.role === 'kasubag_umpeg' || currentUser.role === 'koordinator_umpeg') {
      return p.bidangId === 'sekretariat';
    }
    return p.bidangId === currentUser.bidangId;
  });

  // Permission Checks
  const canEditProject = (project) => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;
    if (currentUser.role === 'koordinator' && project.bidangId === currentUser.bidangId) {
      return true;
    }
    if (
      (currentUser.role === 'koordinator_umpeg' || currentUser.role === 'koordinator_program_keuangan') &&
      project.bidangId === 'sekretariat'
    ) {
      return true;
    }
    return false;
  };

  const canCreateProject = () => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;
    if (
      currentUser.role === 'koordinator' ||
      currentUser.role === 'koordinator_umpeg' ||
      currentUser.role === 'koordinator_program_keuangan'
    ) {
      return true;
    }
    return false;
  };

  const canAccessSPJMenu = [
    'superadmin',
    'kasubag_program_keuangan',
    'koordinator_program_keuangan',
    'sekretaris',
    'kadin'
  ].includes(currentUser?.role);

  const canEditSPJ = [
    'superadmin',
    'kasubag_program_keuangan',
    'koordinator_program_keuangan'
  ].includes(currentUser?.role);

  const canManageUsers = currentUser?.role === 'superadmin';
  const canManageYears = currentUser?.role === 'superadmin';
  const canManageSettings = currentUser?.role === 'superadmin';
  const canManageSipd = [
    'superadmin',
    'koordinator',
    'koordinator_umpeg',
    'koordinator_program_keuangan',
    'kasubag_program_keuangan'
  ].includes(currentUser?.role);

  // Wewenang Khusus Monitoring Pendapatan Retribusi
  const canInputPendapatan = Boolean(
    currentUser?.role === 'superadmin' ||
    currentUser?.role === 'koordinator_pendapatan' ||
    currentUser?.canInputPendapatan === true
  );

  // Granular Menu Access Control
  const hasMenuAccess = (menuId) => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;

    // Jika admin mengatur custom allowedMenus pada user ini
    if (Array.isArray(currentUser.allowedMenus) && currentUser.allowedMenus.length > 0) {
      return currentUser.allowedMenus.includes(menuId);
    }

    // Default wewenang berdasarkan Peran Sistem (Role)
    if (menuId === 'spj_keuangan') {
      return canAccessSPJMenu;
    }
    if (currentUser.role === 'koordinator_pendapatan') {
      return ['dashboard', 'pendapatan', 'laporan'].includes(menuId);
    }
    return true;
  };

  // Helper format rupiah sampai digit satuan (lengkap dan presisi)
  const formatCurrency = (val) => {
    const num = Math.round(Number(val) || 0);
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  // --- SIPD PROGRAM CRUD ---
  const addSipdProgram = (programData) => {
    const id = programData.id || `prog_${Date.now()}`;
    const newProg = { ...programData, id };
    setSipdPrograms((prev) => [...prev, newProg]);
    showToast(`Program SIPD "${newProg.namaProgram}" berhasil ditambahkan!`, 'success');
    return newProg;
  };

  const updateSipdProgram = (id, programData) => {
    setSipdPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...programData } : p))
    );
    showToast('Program SIPD berhasil diperbarui!', 'success');
    return true;
  };

  const deleteSipdProgram = (id) => {
    const hasKegiatan = sipdKegiatans.some((k) => k.programId === id);
    if (hasKegiatan) {
      showToast('Program tidak dapat dihapus karena memiliki kegiatan di bawahnya!', 'error');
      return false;
    }
    setSipdPrograms((prev) => prev.filter((p) => p.id !== id));
    showToast('Program SIPD berhasil dihapus.', 'info');
    return true;
  };

  // --- SIPD KEGIATAN CRUD ---
  const addSipdKegiatan = (kegiatanData) => {
    const id = kegiatanData.id || `keg_${Date.now()}`;
    const newKeg = { ...kegiatanData, id };
    setSipdKegiatans((prev) => [...prev, newKeg]);
    showToast(`Kegiatan SIPD "${newKeg.namaKegiatan}" berhasil ditambahkan!`, 'success');
    return newKeg;
  };

  const updateSipdKegiatan = (id, kegiatanData) => {
    setSipdKegiatans((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...kegiatanData } : k))
    );
    showToast('Kegiatan SIPD berhasil diperbarui!', 'success');
    return true;
  };

  const deleteSipdKegiatan = (id) => {
    const hasSub = sipdSubKegiatans.some((s) => s.kegiatanId === id);
    if (hasSub) {
      showToast('Kegiatan tidak dapat dihapus karena memiliki sub kegiatan di bawahnya!', 'error');
      return false;
    }
    setSipdKegiatans((prev) => prev.filter((k) => k.id !== id));
    showToast('Kegiatan SIPD berhasil dihapus.', 'info');
    return true;
  };

  // --- SIPD SUB KEGIATAN CRUD ---
  const addSipdSubKegiatan = (subData) => {
    const id = subData.id || `sub_${Date.now()}`;
    const newSub = { ...subData, id };
    setSipdSubKegiatans((prev) => [...prev, newSub]);
    showToast(`Sub Kegiatan SIPD "${newSub.namaSubKegiatan}" berhasil ditambahkan!`, 'success');
    return newSub;
  };

  const updateSipdSubKegiatan = (id, subData) => {
    setSipdSubKegiatans((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...subData } : s))
    );
    setProjects((prev) =>
      prev.map((p) => {
        if (p.subKegiatanId === id) {
          return {
            ...p,
            kodeSubKegiatan: subData.kodeSubKegiatan || p.kodeSubKegiatan,
            namaSubKegiatan: subData.namaSubKegiatan || p.namaSubKegiatan
          };
        }
        return p;
      })
    );
    showToast('Sub Kegiatan SIPD berhasil diperbarui!', 'success');
    return true;
  };

  const deleteSipdSubKegiatan = (id) => {
    const isUsed = projects.some((p) => p.subKegiatanId === id);
    if (isUsed) {
      showToast('Sub Kegiatan tidak dapat dihapus karena sedang digunakan oleh paket pekerjaan!', 'error');
      return false;
    }
    setSipdSubKegiatans((prev) => prev.filter((s) => s.id !== id));
    showToast('Sub Kegiatan SIPD berhasil dihapus.', 'info');
    return true;
  };

  const resetSipdToDefault = () => {
    setSipdPrograms(INITIAL_SIPD_PROGRAMS);
    setSipdKegiatans(INITIAL_SIPD_KEGIATAN);
    setSipdSubKegiatans(INITIAL_SIPD_SUB_KEGIATAN);
    localStorage.removeItem('simon_sipd_programs');
    localStorage.removeItem('simon_sipd_kegiatans');
    localStorage.removeItem('simon_sipd_sub_kegiatans');
    showToast('Nomenklatur SIPD berhasil direset ke standar Kepmendagri DINPUTARU!', 'info');
  };

  // Helper to re-calculate deviation status
  const calculateDeviation = (rencana, realisasi) => {
    const deviasi = parseFloat((realisasi - rencana).toFixed(2));
    let statusDeviasi = 'Aman';
    if (realisasi >= 100) {
      statusDeviasi = 'Selesai';
    } else if (deviasi < -5.0) {
      statusDeviasi = 'Kritis';
    } else if (deviasi < 0) {
      statusDeviasi = 'Perhatian';
    } else {
      statusDeviasi = 'Aman';
    }
    return { deviasi, statusDeviasi };
  };

  // --- MONITORING PENDAPATAN RETRIBUSI CRUD ---
  const addPendapatanTransaction = (trxData) => {
    if (!canInputPendapatan) {
      showToast('Wewenang ditolak! Hanya Koordinator Pendapatan dan Superadmin yang dapat menginput penerimaan.', 'error');
      return false;
    }
    const nominal = parseFloat(trxData.nominal) || 0;
    if (nominal <= 0) {
      showToast('Nominal penerimaan harus lebih besar dari 0!', 'error');
      return false;
    }
    const tgl = trxData.tanggal || new Date().toISOString().split('T')[0];
    const bulan = parseInt(tgl.split('-')[1], 10) || (new Date().getMonth() + 1);
    const newTrx = {
      ...trxData,
      id: trxData.id || `TRX-${activeYear}-${Date.now().toString().slice(-4)}`,
      nominal,
      tanggal: tgl,
      bulan,
      tahun: activeYear,
      status: trxData.status || 'Terverifikasi Kasda',
      createdAt: new Date().toLocaleString('id-ID'),
      updatedBy: currentUser.nama
    };
    setPendapatanTransactions((prev) => [newTrx, ...prev]);
    showToast(`Penerimaan retribusi "${newTrx.namaPenyewa}" (Rp ${nominal.toLocaleString('id-ID')}) berhasil dicatat!`, 'success');
    return newTrx;
  };

  const updatePendapatanTransaction = (id, updatedData) => {
    if (!canInputPendapatan) {
      showToast('Wewenang ditolak untuk mengubah transaksi pendapatan!', 'error');
      return false;
    }
    setPendapatanTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nominal = updatedData.nominal !== undefined ? (parseFloat(updatedData.nominal) || 0) : t.nominal;
        const tgl = updatedData.tanggal || t.tanggal;
        const bulan = parseInt(tgl.split('-')[1], 10) || t.bulan;
        return {
          ...t,
          ...updatedData,
          nominal,
          tanggal: tgl,
          bulan,
          updatedAt: new Date().toLocaleString('id-ID'),
          updatedBy: currentUser.nama
        };
      })
    );
    showToast('Data penerimaan retribusi berhasil diperbarui!', 'success');
    return true;
  };

  const deletePendapatanTransaction = (id) => {
    if (!canInputPendapatan) {
      showToast('Wewenang ditolak untuk menghapus transaksi pendapatan!', 'error');
      return false;
    }
    setPendapatanTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Data transaksi penerimaan berhasil dihapus.', 'info');
    return true;
  };

  const updatePendapatanTarget = (newTargetConfig) => {
    if (!canInputPendapatan) {
      showToast('Wewenang ditolak untuk mengubah target pendapatan!', 'error');
      return false;
    }
    setPendapatanTargetConfig((prev) => ({
      ...prev,
      ...newTargetConfig,
      tahunAnggaran: activeYear
    }));
    showToast(`Target pendapatan daerah TA ${activeYear} berhasil diperbarui!`, 'success');
    return true;
  };

  const resetPendapatanToDemo = () => {
    const dummy = generateDummyPendapatanTransactions(activeYear || 2026);
    setPendapatanTransactions(dummy);
    setPendapatanTargetConfig(DEFAULT_TARGET_CONFIG);
    localStorage.setItem('simon_pendapatan_trx', JSON.stringify(dummy));
    localStorage.setItem('simon_pendapatan_target', JSON.stringify(DEFAULT_TARGET_CONFIG));
    showToast('Data monitoring pendapatan berhasil direset ke data awal!', 'info');
  };

  // Unified Project CRUD
  const addProject = (projectData) => {
    const statusTahap = projectData.tahapPraKontrak?.status || 'rup';
    const isBatal = statusTahap === 'batal';
    const isKontrak = !isBatal && (projectData.isKontrak || statusTahap === 'kontrak');
    const rencana = parseFloat(projectData.dataFisik?.progresRencana || 0);
    const realisasi = parseFloat(projectData.dataFisik?.progresRealisasi || 0);
    const { deviasi, statusDeviasi } = calculateDeviation(rencana, realisasi);

    const nilaiKontrak = parseFloat(projectData.dataKontrak?.nilaiKontrak || 0);
    const terminList = projectData.dataKeuangan?.terminHistory || [];
    const totalPencairan = terminList.reduce((sum, item) => sum + (parseFloat(item.jumlah) || 0), 0);
    const persenKeuangan = nilaiKontrak > 0 ? parseFloat(((totalPencairan / nilaiKontrak) * 100).toFixed(2)) : 0;

    // Resolve SIPD
    let subKeg = null;
    if (projectData.subKegiatanId) {
      subKeg = sipdSubKegiatans.find((s) => s.id === projectData.subKegiatanId);
    }
    if (!subKeg && projectData.kodeSubKegiatan) {
      subKeg = sipdSubKegiatans.find((s) => s.kodeSubKegiatan === projectData.kodeSubKegiatan);
    }
    if (!subKeg) {
      subKeg = matchProjectToSubKegiatan(projectData, sipdSubKegiatans);
    }

    const subKegiatanId = projectData.subKegiatanId || subKeg?.id || '';
    const kegiatanId = projectData.kegiatanId || subKeg?.kegiatanId || '';
    const programId = projectData.programId || subKeg?.programId || '';
    const kodeSubKegiatan = projectData.kodeSubKegiatan || subKeg?.kodeSubKegiatan || '';
    const namaSubKegiatan = projectData.namaSubKegiatan || subKeg?.namaSubKegiatan || '';

    const newProject = {
      ...projectData,
      id: projectData.id || `PRJ-${activeYear}-${projectData.bidangId?.toUpperCase() || 'DINPUTARU'}-${Date.now().toString().slice(-4)}`,
      tahunAnggaran: activeYear,
      programId,
      kegiatanId,
      subKegiatanId,
      kodeSubKegiatan,
      namaSubKegiatan,
      kategoriPekerjaan: projectData.kategoriPekerjaan || (projectData.bidangId === 'tata_ruang' ? 'Jakon' : 'Fisik'),
      tipePengadaan: projectData.tipePengadaan || 'Tender',
      isKontrak,
      jenisAnggaran: projectData.jenisAnggaran || 'Murni',
      kecamatan: projectData.kecamatan || 'Demak',
      desa: projectData.desa || '',
      latitude: projectData.latitude || '-6.8942',
      longitude: projectData.longitude || '110.6385',
      isPublicHighlight: projectData.isPublicHighlight !== undefined ? projectData.isPublicHighlight : true,
      tags: projectData.tags || [],
      tahapPraKontrak: {
        ...projectData.tahapPraKontrak,
        status: statusTahap,
        catatanPraKontrak: isBatal
          ? (projectData.tahapPraKontrak?.catatanPraKontrak || 'Pekerjaan dibatalkan')
          : (projectData.tahapPraKontrak?.catatanPraKontrak || '')
      },
      dataKontrak: {
        ...(projectData.dataKontrak || {}),
        tanggalMulai: projectData.dataKontrak?.tanggalMulai || '',
        tanggalSelesai: projectData.dataKontrak?.tanggalSelesai || ''
      },
      administrasiSPJ: projectData.administrasiSPJ || {
        status: isKontrak && realisasi >= 100 ? 'sudah_sp2d' : 'belum_masuk',
        tanggalMasuk: '',
        tanggalKoreksi: '',
        tanggalSPM: '',
        nomorSPM: '',
        catatanVerifikator: '',
        petugasVerifikator: ''
      },
      dataFisik: {
        ...projectData.dataFisik,
        progresRencana: rencana,
        progresRealisasi: realisasi,
        deviasiFisik: deviasi,
        statusDeviasi: isBatal ? 'Batal' : statusDeviasi,
        fotoDokumentasi: projectData.dataFisik?.fotoDokumentasi || [],
        mingguanKurvaS: projectData.dataFisik?.mingguanKurvaS || []
      },
      dataKeuangan: {
        ...projectData.dataKeuangan,
        terminHistory: terminList,
        totalPencairan,
        persenKeuangan
      },
      updatedAt: new Date().toLocaleString('id-ID'),
      updatedBy: currentUser.nama
    };

    setProjects((prev) => [newProject, ...prev]);
    showToast(`Paket pekerjaan "${newProject.namaPaket}" berhasil disimpan ke Master Data!`, 'success');
    syncProjectToRemote(newProject);
    return newProject;
  };

  const updateProject = (projectId, updatedData) => {
    let updatedTarget = null;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        const statusTahap = updatedData.tahapPraKontrak?.status ?? p.tahapPraKontrak?.status ?? 'rup';
        const isBatal = statusTahap === 'batal';
        const isKontrak = !isBatal && (updatedData.isKontrak !== undefined ? updatedData.isKontrak : (statusTahap === 'kontrak' || p.isKontrak));
        const rencana = parseFloat(updatedData.dataFisik?.progresRencana ?? p.dataFisik?.progresRencana ?? 0);
        const realisasi = parseFloat(updatedData.dataFisik?.progresRealisasi ?? p.dataFisik?.progresRealisasi ?? 0);
        const { deviasi, statusDeviasi } = calculateDeviation(rencana, realisasi);

        const nilaiKontrak = parseFloat(updatedData.dataKontrak?.nilaiKontrak ?? p.dataKontrak?.nilaiKontrak ?? 0);
        const terminList = updatedData.dataKeuangan?.terminHistory ?? p.dataKeuangan?.terminHistory ?? [];
        const totalPencairan = terminList.reduce((sum, item) => sum + (parseFloat(item.jumlah) || 0), 0);
        const persenKeuangan = nilaiKontrak > 0 ? parseFloat(((totalPencairan / nilaiKontrak) * 100).toFixed(2)) : 0;

        let subKeg = null;
        if (updatedData.subKegiatanId) {
          subKeg = sipdSubKegiatans.find((s) => s.id === updatedData.subKegiatanId);
        } else if (p.subKegiatanId) {
          subKeg = sipdSubKegiatans.find((s) => s.id === p.subKegiatanId);
        }
        if (!subKeg && (updatedData.kodeSubKegiatan || p.kodeSubKegiatan)) {
          const code = updatedData.kodeSubKegiatan || p.kodeSubKegiatan;
          subKeg = sipdSubKegiatans.find((s) => s.kodeSubKegiatan === code);
        }
        if (!subKeg) {
          subKeg = matchProjectToSubKegiatan({ ...p, ...updatedData }, sipdSubKegiatans);
        }

        const subKegiatanId = updatedData.subKegiatanId || p.subKegiatanId || subKeg?.id || '';
        const kegiatanId = updatedData.kegiatanId || p.kegiatanId || subKeg?.kegiatanId || '';
        const programId = updatedData.programId || p.programId || subKeg?.programId || '';
        const kodeSubKegiatan = updatedData.kodeSubKegiatan || p.kodeSubKegiatan || subKeg?.kodeSubKegiatan || '';
        const namaSubKegiatan = updatedData.namaSubKegiatan || p.namaSubKegiatan || subKeg?.namaSubKegiatan || '';

        const merged = {
          ...p,
          ...updatedData,
          programId,
          kegiatanId,
          subKegiatanId,
          kodeSubKegiatan,
          namaSubKegiatan,
          kategoriPekerjaan: updatedData.kategoriPekerjaan || p.kategoriPekerjaan || (p.bidangId === 'tata_ruang' ? 'Jakon' : 'Fisik'),
          tipePengadaan: updatedData.tipePengadaan || p.tipePengadaan || 'Tender',
          isKontrak,
          jenisAnggaran: updatedData.jenisAnggaran !== undefined ? updatedData.jenisAnggaran : (p.jenisAnggaran || 'Murni'),
          kecamatan: updatedData.kecamatan !== undefined ? updatedData.kecamatan : (p.kecamatan || 'Demak'),
          desa: updatedData.desa !== undefined ? updatedData.desa : (p.desa || ''),
          latitude: updatedData.latitude !== undefined ? updatedData.latitude : (p.latitude || '-6.8942'),
          longitude: updatedData.longitude !== undefined ? updatedData.longitude : (p.longitude || '110.6385'),
          isPublicHighlight: updatedData.isPublicHighlight !== undefined ? updatedData.isPublicHighlight : (p.isPublicHighlight !== undefined ? p.isPublicHighlight : true),
          tags: updatedData.tags ?? p.tags ?? [],
          tahapPraKontrak: {
            ...(p.tahapPraKontrak || {}),
            ...(updatedData.tahapPraKontrak || {}),
            status: statusTahap,
            catatanPraKontrak: isBatal
              ? (updatedData.tahapPraKontrak?.catatanPraKontrak || p.tahapPraKontrak?.catatanPraKontrak || 'Pekerjaan dibatalkan')
              : (updatedData.tahapPraKontrak?.catatanPraKontrak ?? p.tahapPraKontrak?.catatanPraKontrak ?? '')
          },
          dataKontrak: {
            ...(p.dataKontrak || {}),
            ...(updatedData.dataKontrak || {}),
            tanggalMulai: updatedData.dataKontrak?.tanggalMulai !== undefined ? updatedData.dataKontrak.tanggalMulai : (p.dataKontrak?.tanggalMulai || ''),
            tanggalSelesai: updatedData.dataKontrak?.tanggalSelesai !== undefined ? updatedData.dataKontrak.tanggalSelesai : (p.dataKontrak?.tanggalSelesai || '')
          },
          administrasiSPJ: {
            ...(p.administrasiSPJ || {}),
            ...(updatedData.administrasiSPJ || {})
          },
          dataFisik: {
            ...p.dataFisik,
            ...updatedData.dataFisik,
            progresRencana: rencana,
            progresRealisasi: realisasi,
            deviasiFisik: deviasi,
            statusDeviasi: isBatal ? 'Batal' : statusDeviasi
          },
          dataKeuangan: {
            ...p.dataKeuangan,
            ...updatedData.dataKeuangan,
            terminHistory: terminList,
            totalPencairan,
            persenKeuangan
          },
          updatedAt: new Date().toLocaleString('id-ID'),
          updatedBy: currentUser.nama
        };
        updatedTarget = merged;
        return merged;
      })
    );
    showToast('Data pekerjaan berhasil diperbarui di Master Data!', 'success');
    if (updatedTarget) {
      syncProjectToRemote(updatedTarget);
    }
    return true;
  };

  // Toggle Public Highlight Setting on Landing Page (Koordinator & Superadmin)
  const togglePublicHighlight = (projectId) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return false;
    if (!canEditProject(target)) {
      showToast('Wewenang ditolak! Hanya Koordinator bidang dan Superadmin yang dapat mengatur sorotan.', 'error');
      return false;
    }
    const nextState = target.isPublicHighlight === false ? true : false;
    updateProject(projectId, { isPublicHighlight: nextState });
    showToast(
      nextState
        ? `Paket "${target.namaPaket.slice(0, 35)}..." kini DITAMPILKAN di Beranda Publik!`
        : `Paket "${target.namaPaket.slice(0, 35)}..." kini DISEMBUNYIKAN dari Beranda Publik (Internal)`,
      'info'
    );
    return true;
  };

  const deleteProject = (projectId) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return false;
    if (!canEditProject(target)) {
      showToast('Anda tidak memiliki wewenang menghapus data ini!', 'error');
      return false;
    }
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    showToast('Paket pekerjaan berhasil dihapus.', 'info');
    deleteProjectFromRemote(projectId);
    return true;
  };

  // Bulk Import Projects (Excel/CSV Mass Import)
  const bulkImportProjects = (importedList, mode = 'append') => {
    if (!Array.isArray(importedList) || importedList.length === 0) {
      showToast('Tidak ada data paket untuk diimpor.', 'error');
      return false;
    }

    setProjects((prev) => {
      let nextProjects = [...prev];

      if (mode === 'replace_year') {
        const targetYears = [...new Set(importedList.map((p) => p.tahunAnggaran || activeYear))];
        nextProjects = nextProjects.filter((p) => !targetYears.includes(p.tahunAnggaran));
        nextProjects = [...importedList, ...nextProjects];
      } else {
        const importedMap = new Map();
        importedList.forEach((p) => {
          importedMap.set(p.id, p);
        });

        const updatedExisting = nextProjects.map((p) => {
          if (importedMap.has(p.id)) {
            const fresh = importedMap.get(p.id);
            importedMap.delete(p.id);
            return fresh;
          }
          return p;
        });

        const brandNew = Array.from(importedMap.values());
        nextProjects = [...brandNew, ...updatedExisting];
      }

      localStorage.setItem('simon_projects_v2', JSON.stringify(nextProjects));
      return nextProjects;
    });

    showToast(`Berhasil mengimpor ${importedList.length} paket pekerjaan ke Master Data!`, 'success');

    // Asynchronously sync to remote MySQL backend if available
    setTimeout(() => {
      importedList.forEach((proj) => {
        syncProjectToRemote(proj);
      });
    }, 100);

    return true;
  };

  // Add Termin Pencairan
  const addTermin = (projectId, terminData) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return false;
    if (!canEditProject(target)) {
      showToast('Wewenang ditolak untuk menambah termin!', 'error');
      return false;
    }

    const currentTermin = target.dataKeuangan?.terminHistory || [];
    const newTermin = {
      ...terminData,
      id: `TRM-${Date.now()}`
    };
    const updatedTermin = [...currentTermin, newTermin];
    const nilaiKontrak = parseFloat(target.dataKontrak?.nilaiKontrak || 0);
    const totalPencairan = updatedTermin.reduce((sum, item) => sum + (parseFloat(item.jumlah) || 0), 0);
    const persenKeuangan = nilaiKontrak > 0 ? parseFloat(((totalPencairan / nilaiKontrak) * 100).toFixed(2)) : 0;

    updateProject(projectId, {
      dataKeuangan: {
        ...target.dataKeuangan,
        terminHistory: updatedTermin,
        totalPencairan,
        persenKeuangan
      }
    });

    showToast(`Pencairan ${newTermin.terminKe} berhasil dicatat!`, 'success');
    return true;
  };

  // Reset to default sample data (for easy testing)
  const resetToDemoData = () => {
    localStorage.removeItem('simon_projects');
    localStorage.removeItem('simon_projects_v2');
    localStorage.removeItem('simon_system_settings');
    localStorage.removeItem('simon_users');
    localStorage.removeItem('simon_years');
    localStorage.removeItem('simon_tags');
    localStorage.removeItem('simon_kategori_pekerjaan');
    localStorage.removeItem('simon_prakontrak_stages');
    localStorage.removeItem('simon_spj_statuses');
    localStorage.removeItem('simon_sumber_dana');
    localStorage.removeItem('simon_sipd_programs');
    localStorage.removeItem('simon_sipd_kegiatans');
    localStorage.removeItem('simon_sipd_sub_kegiatans');
    localStorage.removeItem('simon_pendapatan_trx');
    localStorage.removeItem('simon_pendapatan_target');
    setProjects(INITIAL_PROJECTS);
    setSystemSettings(DEFAULT_SYSTEM_SETTINGS);
    setUsers(INITIAL_USERS);
    setYears(DEFAULT_YEARS);
    setTags(DEFAULT_TAGS);
    setKategoriPekerjaanList(DEFAULT_KATEGORI_PEKERJAAN);
    setPraKontrakStages(TAHAPAN_PRA_KONTRAK);
    setSpjStatuses(STATUS_SPJ_KEUANGAN);
    setSumberDanaList(SUMBER_DANA);
    setSipdPrograms(INITIAL_SIPD_PROGRAMS);
    setSipdKegiatans(INITIAL_SIPD_KEGIATAN);
    setSipdSubKegiatans(INITIAL_SIPD_SUB_KEGIATAN);
    setPendapatanTransactions(generateDummyPendapatanTransactions(2026));
    setPendapatanTargetConfig(DEFAULT_TARGET_CONFIG);
    setActiveYear(2026);
    setCurrentUser(INITIAL_USERS[0]);
    showToast('Data sistem telah direset ke data sampel DINPUTARU Kabupaten Demak!', 'info');
  };

  const value = {
    years,
    activeYear,
    setActiveYear,
    addYear,
    systemSettings,
    updateSystemSettings,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    users,
    currentUser,
    isLoggedIn,
    setIsLoggedIn,
    login,
    logout,
    switchUser,
    addUser,
    updateUser,
    deleteUser,
    tags,
    addTag,
    deleteTag,
    kategoriPekerjaanList,
    addKategoriPekerjaan,
    deleteKategoriPekerjaan,
    addJenisPengadaanToKategori,
    deleteJenisPengadaanFromKategori,
    resetKategoriPekerjaan,
    praKontrakStages,
    addPraKontrakStage,
    deletePraKontrakStage,
    sumberDanaList,
    addSumberDana,
    deleteSumberDana,
    resetSumberDana,
    spjStatuses,
    addSpjStatus,
    deleteSpjStatus,
    updateSPJStatus,
    // SIPD Nomenklatur Kemendagri
    sipdPrograms,
    sipdKegiatans,
    sipdSubKegiatans,
    addSipdProgram,
    updateSipdProgram,
    deleteSipdProgram,
    addSipdKegiatan,
    updateSipdKegiatan,
    deleteSipdKegiatan,
    addSipdSubKegiatan,
    updateSipdSubKegiatan,
    deleteSipdSubKegiatan,
    resetSipdToDefault,
    canManageSipd,
    // Projects
    projects,
    activeYearProjects,
    accessibleProjects,
    canEditProject,
    canCreateProject,
    canAccessSPJMenu,
    canEditSPJ,
    canManageUsers,
    canManageYears,
    canManageSettings,
    addProject,
    bulkImportProjects,
    updateProject,
    deleteProject,
    togglePublicHighlight,
    addTermin,
    activeTab,
    setActiveTab,
    toast,
    showToast,
    resetToDemoData,
    userRoleDef,
    // Monitoring Pendapatan Retribusi (Fitur Menu ke-6)
    pendapatanTransactions,
    pendapatanTargetConfig,
    kategoriPendapatanList: KATEGORI_PENDAPATAN,
    addPendapatanTransaction,
    updatePendapatanTransaction,
    deletePendapatanTransaction,
    updatePendapatanTarget,
    resetPendapatanToDemo,
    canInputPendapatan,
    hasMenuAccess,
    formatCurrency
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
