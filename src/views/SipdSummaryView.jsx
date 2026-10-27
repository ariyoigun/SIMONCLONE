import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, DEFAULT_CUSTOM_TEXTS } from '../data/constants';
import { buildSipdTree } from '../data/sipdData';
import {
  FolderTree,
  ChevronDown,
  ChevronRight,
  Search,
  Layers,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Settings,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  MapPin,
  Maximize2,
  Minimize2,
  BarChart3,
  PieChart,
  Activity,
  ArrowRight,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import SipdMasterModal from '../components/SipdMasterModal';
import DonutPieChart from '../components/DonutPieChart';
import * as XLSX from 'xlsx';

const SipdSummaryView = ({ onOpenProjectModal, onViewProject }) => {
  const {
    accessibleProjects,
    activeYear,
    sipdPrograms = [],
    sipdKegiatans = [],
    sipdSubKegiatans = [],
    currentUser,
    canCreateProject,
    canManageSipd,
    systemSettings
  } = useApp();

  // Filters State
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);

  // Diagram Kotak Program State
  const [showProgramBoxes, setShowProgramBoxes] = useState(true);
  const [programBoxSort, setProgramBoxSort] = useState('pagu_desc'); // 'pagu_desc' | 'fisik_desc' | 'keu_desc' | 'deviasi_desc' | 'nama_asc'

  // Diagram Analytics State
  const [showCharts, setShowCharts] = useState(true);
  const [chartLevel, setChartLevel] = useState('program'); // 'program' | 'kegiatan' | 'sub_kegiatan'
  const [chartType, setChartType] = useState('fisik_keu'); // 'fisik_keu' | 'anggaran' | 'donut'
  const [chartSortBy, setChartSortBy] = useState('pagu_desc'); // 'pagu_desc' | 'fisik_desc' | 'keu_desc' | 'deviasi_desc' | 'nama_asc'

  // Expanded nodes state: maps id -> boolean
  // Default: all programs expanded
  const [expandedNodes, setExpandedNodes] = useState(() => {
    const initial = {};
    sipdPrograms.forEach((p) => {
      initial[`prog_${p.id}`] = true;
    });
    return initial;
  });

  const toggleNode = (nodeKey) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  const expandAll = () => {
    const all = {};
    sipdPrograms.forEach((p) => {
      all[`prog_${p.id}`] = true;
    });
    sipdKegiatans.forEach((k) => {
      all[`keg_${k.id}`] = true;
    });
    sipdSubKegiatans.forEach((s) => {
      all[`sub_${s.id}`] = true;
    });
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  // Build the complete tree
  const fullTree = useMemo(() => {
    return buildSipdTree(sipdPrograms, sipdKegiatans, sipdSubKegiatans, accessibleProjects);
  }, [sipdPrograms, sipdKegiatans, sipdSubKegiatans, accessibleProjects]);

  // Filter the tree based on selectedBidang and searchQuery
  const filteredTree = useMemo(() => {
    return fullTree
      .filter((prog) => {
        if (selectedBidang !== 'ALL' && prog.bidangId !== selectedBidang) return false;
        return true;
      })
      .map((prog) => {
        if (!searchQuery.trim()) return prog;

        const q = searchQuery.toLowerCase();
        const progMatch = prog.namaProgram.toLowerCase().includes(q) || prog.kodeProgram.toLowerCase().includes(q);

        const matchingKegiatans = prog.kegiatans
          .map((keg) => {
            const kegMatch = keg.namaKegiatan.toLowerCase().includes(q) || keg.kodeKegiatan.toLowerCase().includes(q);

            const matchingSub = keg.subKegiatans
              .map((sub) => {
                const subMatch =
                  sub.namaSubKegiatan.toLowerCase().includes(q) ||
                  sub.kodeSubKegiatan.toLowerCase().includes(q) ||
                  (sub.kinerjaIndikator && sub.kinerjaIndikator.toLowerCase().includes(q));

                const matchingProjects = sub.projects.filter((prj) => {
                  return (
                    prj.namaPaket.toLowerCase().includes(q) ||
                    prj.id.toLowerCase().includes(q) ||
                    (prj.dataKontrak?.namaPenyedia && prj.dataKontrak.namaPenyedia.toLowerCase().includes(q)) ||
                    (prj.desa && prj.desa.toLowerCase().includes(q)) ||
                    (prj.kecamatan && prj.kecamatan.toLowerCase().includes(q))
                  );
                });

                if (progMatch || kegMatch || subMatch || matchingProjects.length > 0) {
                  return {
                    ...sub,
                    projects: progMatch || kegMatch || subMatch ? sub.projects : matchingProjects
                  };
                }
                return null;
              })
              .filter(Boolean);

            if (progMatch || kegMatch || matchingSub.length > 0) {
              return {
                ...keg,
                subKegiatans: matchingSub
              };
            }
            return null;
          })
          .filter(Boolean);

        if (progMatch || matchingKegiatans.length > 0) {
          return {
            ...prog,
            kegiatans: matchingKegiatans
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [fullTree, selectedBidang, searchQuery]);

  // Overall Aggregate KPIs
  const totalProgramsCount = sipdPrograms.length;
  const totalKegiatansCount = sipdKegiatans.length;
  const totalSubKegiatansCount = sipdSubKegiatans.length;
  const totalProjectsCount = accessibleProjects.length;
  const totalPaguAll = accessibleProjects.reduce((sum, p) => sum + (parseFloat(p.paguAnggaran) || 0), 0);
  const totalKontrakAll = accessibleProjects.reduce((sum, p) => sum + (parseFloat(p.dataKontrak?.nilaiKontrak) || 0), 0);
  const totalPencairanAll = accessibleProjects.reduce((sum, p) => sum + (parseFloat(p.dataKeuangan?.totalPencairan) || 0), 0);

  // Program Boxes Data Memo
  const programBoxesData = useMemo(() => {
    const list = filteredTree.map((prog) => {
      const bidang = BIDANG_LIST.find((b) => b.id === prog.bidangId);
      const porsiPagu = totalPaguAll > 0 ? parseFloat(((prog.totalPagu / totalPaguAll) * 100).toFixed(1)) : 0;
      const deviasi = parseFloat(((prog.avgFisik || 0) - (prog.persenKeuangan || 0)).toFixed(1));
      const totalSub = prog.kegiatans.reduce((sum, k) => sum + k.subKegiatans.length, 0);
      const persenKontrak = prog.totalPagu > 0 ? parseFloat(((prog.totalKontrak / prog.totalPagu) * 100).toFixed(1)) : 0;
      const persenCair = prog.totalKontrak > 0 ? parseFloat(((prog.totalPencairan / prog.totalKontrak) * 100).toFixed(1)) : 0;
      const sisaPagu = Math.max(0, prog.totalPagu - prog.totalKontrak);
      return {
        ...prog,
        bidang,
        porsiPagu,
        deviasi,
        totalSub,
        persenKontrak,
        persenCair,
        sisaPagu
      };
    });

    return list.sort((a, b) => {
      if (programBoxSort === 'pagu_desc') return b.totalPagu - a.totalPagu;
      if (programBoxSort === 'fisik_desc') return b.avgFisik - a.avgFisik;
      if (programBoxSort === 'keu_desc') return b.persenKeuangan - a.persenKeuangan;
      if (programBoxSort === 'deviasi_desc') return b.deviasi - a.deviasi;
      if (programBoxSort === 'nama_asc') return a.namaProgram.localeCompare(b.namaProgram);
      return 0;
    });
  }, [filteredTree, totalPaguAll, programBoxSort]);

  const handleJumpToProgram = (progId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [`prog_${progId}`]: true
    }));
    setTimeout(() => {
      const el = document.getElementById(`prog-node-${progId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.transition = 'all 0.3s ease';
        el.style.boxShadow = '0 0 0 3px #0284c7, 0 10px 25px rgba(2, 132, 199, 0.25)';
        setTimeout(() => {
          el.style.boxShadow = '';
        }, 2200);
      }
    }, 100);
  };

  // Extract and format chart dataset based on selected level (program, kegiatan, sub_kegiatan)
  const chartData = useMemo(() => {
    const items = [];

    if (chartLevel === 'program') {
      filteredTree.forEach((prog) => {
        items.push({
          id: prog.id,
          level: 'program',
          code: prog.kodeProgram,
          name: prog.namaProgram,
          bidangId: prog.bidangId,
          parentName: '',
          pagu: prog.totalPagu,
          kontrak: prog.totalKontrak,
          pencairan: prog.totalPencairan,
          persenFisik: prog.avgFisik,
          persenKeuangan: prog.persenKeuangan,
          projectCount: prog.projectCount,
          deviasi: parseFloat((prog.avgFisik - prog.persenKeuangan).toFixed(1))
        });
      });
    } else if (chartLevel === 'kegiatan') {
      filteredTree.forEach((prog) => {
        prog.kegiatans.forEach((keg) => {
          items.push({
            id: keg.id,
            level: 'kegiatan',
            code: keg.kodeKegiatan,
            name: keg.namaKegiatan,
            bidangId: keg.bidangId,
            parentName: prog.namaProgram,
            pagu: keg.totalPagu,
            kontrak: keg.totalKontrak,
            pencairan: keg.totalPencairan,
            persenFisik: keg.avgFisik,
            persenKeuangan: keg.persenKeuangan,
            projectCount: keg.projectCount,
            deviasi: parseFloat((keg.avgFisik - keg.persenKeuangan).toFixed(1))
          });
        });
      });
    } else if (chartLevel === 'sub_kegiatan') {
      filteredTree.forEach((prog) => {
        prog.kegiatans.forEach((keg) => {
          keg.subKegiatans.forEach((sub) => {
            items.push({
              id: sub.id,
              level: 'sub_kegiatan',
              code: sub.kodeSubKegiatan,
              name: sub.namaSubKegiatan,
              bidangId: sub.bidangId,
              parentName: keg.namaKegiatan,
              grandParentName: prog.namaProgram,
              pagu: sub.totalPagu,
              kontrak: sub.totalKontrak,
              pencairan: sub.totalPencairan,
              persenFisik: sub.avgFisik,
              persenKeuangan: sub.persenKeuangan,
              projectCount: sub.projectCount,
              deviasi: parseFloat((sub.avgFisik - sub.persenKeuangan).toFixed(1))
            });
          });
        });
      });
    }

    // Sorting
    return items.sort((a, b) => {
      if (chartSortBy === 'pagu_desc') return b.pagu - a.pagu;
      if (chartSortBy === 'fisik_desc') return b.persenFisik - a.persenFisik;
      if (chartSortBy === 'keu_desc') return b.persenKeuangan - a.persenKeuangan;
      if (chartSortBy === 'deviasi_desc') return b.deviasi - a.deviasi;
      if (chartSortBy === 'nama_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [filteredTree, chartLevel, chartSortBy]);

  // Maximum values for proportional bar scaling
  const maxPaguInChart = useMemo(() => {
    return Math.max(...chartData.map((d) => d.pagu), 1);
  }, [chartData]);

  // Donut Chart Dataset
  const donutData = useMemo(() => {
    const palette = [
      '#0284c7', // Sky
      '#059669', // Emerald
      '#d97706', // Amber
      '#7c3aed', // Purple
      '#dc2626', // Red
      '#0891b2', // Cyan
      '#4f46e5', // Indigo
      '#ea580c', // Orange
      '#16a34a', // Green
      '#2563eb'  // Blue
    ];
    return chartData
      .filter((item) => item.pagu > 0)
      .map((item, idx) => ({
        id: item.id,
        label: `${item.code} - ${item.name}`,
        value: item.pagu,
        color: palette[idx % palette.length],
        percentage: totalPaguAll > 0 ? parseFloat(((item.pagu / totalPaguAll) * 100).toFixed(1)) : 0
      }));
  }, [chartData, totalPaguAll]);

  const formatRpCompact = (val) => {
    const num = parseFloat(val) || 0;
    if (num >= 1e9) {
      return `Rp ${(num / 1e9).toFixed(2)} M`;
    }
    if (num >= 1e6) {
      return `Rp ${(num / 1e6).toFixed(1)} Jt`;
    }
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  // Export to Excel
  const handleExportSipdExcel = () => {
    const headers = [
      'Bidang Dinas',
      'Kode Program',
      'Nama Program SIPD',
      'Kode Kegiatan',
      'Nama Kegiatan',
      'Kode Sub Kegiatan',
      'Nama Sub Kegiatan',
      'Indikator Output',
      'Kode Paket Pekerjaan',
      'Nama Paket Pekerjaan',
      'Penyedia (CV/PT)',
      'Kecamatan',
      'Desa',
      'Pagu Anggaran (Rp)',
      'Nilai Kontrak (Rp)',
      'Realisasi Keuangan (Rp)',
      'Progres Fisik (%)',
      'Status Deviasi',
      'Status SPJ'
    ];

    const rows = [];
    filteredTree.forEach((prog) => {
      const bidangInfo = BIDANG_LIST.find((b) => b.id === prog.bidangId)?.nama || prog.bidangId;
      prog.kegiatans.forEach((keg) => {
        keg.subKegiatans.forEach((sub) => {
          if (sub.projects.length === 0) {
            rows.push([
              bidangInfo,
              prog.kodeProgram,
              prog.namaProgram,
              keg.kodeKegiatan,
              keg.namaKegiatan,
              sub.kodeSubKegiatan,
              sub.namaSubKegiatan,
              sub.kinerjaIndikator || '-',
              '-',
              '(Belum ada paket pekerjaan terikat)',
              '-',
              '-',
              '-',
              0,
              0,
              0,
              0,
              '-',
              '-'
            ]);
          } else {
            sub.projects.forEach((p) => {
              rows.push([
                bidangInfo,
                prog.kodeProgram,
                prog.namaProgram,
                keg.kodeKegiatan,
                keg.namaKegiatan,
                sub.kodeSubKegiatan,
                sub.namaSubKegiatan,
                sub.kinerjaIndikator || '-',
                p.id,
                p.namaPaket,
                p.dataKontrak?.namaPenyedia || '-',
                p.kecamatan || '-',
                p.desa || '-',
                parseFloat(p.paguAnggaran || 0),
                parseFloat(p.dataKontrak?.nilaiKontrak || 0),
                parseFloat(p.dataKeuangan?.totalPencairan || 0),
                parseFloat(p.dataFisik?.progresRealisasi || 0),
                p.dataFisik?.statusDeviasi || 'Aman',
                p.administrasiSPJ?.status || 'belum_masuk'
              ]);
            });
          }
        });
      });
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws['!cols'] = [
      { wch: 22 },
      { wch: 14 },
      { wch: 40 },
      { wch: 16 },
      { wch: 42 },
      { wch: 20 },
      { wch: 45 },
      { wch: 32 },
      { wch: 20 },
      { wch: 50 },
      { wch: 30 },
      { wch: 16 },
      { wch: 16 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 16 },
      { wch: 14 },
      { wch: 18 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `RINGKASAN_SIPD_${activeYear}`);
    XLSX.writeFile(wb, `Laporan_Ringkasan_SIPD_DINPUTARU_TA_${activeYear}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div>
      {/* 1. Header Kontrol */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-header-title">
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
                color: '#fff',
                boxShadow: '0 4px 14px rgba(3, 105, 161, 0.25)'
              }}
            >
              <FolderTree size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 22, margin: 0 }}>
                  {systemSettings?.customTexts?.internal_sipd_title || DEFAULT_CUSTOM_TEXTS.internal_sipd_title}
                </h1>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    letterSpacing: 0.5
                  }}
                >
                  {systemSettings?.customTexts?.internal_sipd_badge || DEFAULT_CUSTOM_TEXTS.internal_sipd_badge}
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b' }}>
                {systemSettings?.customTexts?.internal_sipd_desc || `Pohon Hierarki Kinerja: Program → Kegiatan → Sub Kegiatan → Daftar Paket Pekerjaan (TA ${activeYear})`}
              </p>
            </div>
          </div>
        </div>

        <div className="page-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {canManageSipd && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsMasterModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 14px',
                fontWeight: 700,
                fontSize: 13,
                borderColor: '#0284c7',
                color: '#0284c7',
                background: '#ffffff'
              }}
              title="Atur, tambah, edit atau hapus master Program, Kegiatan & Sub Kegiatan"
            >
              <Settings size={15} />
              <span>Kelola Master SIPD</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExportSipdExcel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 14px',
              fontWeight: 700,
              fontSize: 13,
              borderColor: '#059669',
              color: '#059669',
              background: '#ffffff'
            }}
            title="Download rekapitulasi hierarki SIPD ke file Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet size={15} />
            <span>Export Excel SIPD</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 18px',
              fontWeight: 800,
              fontSize: 13,
              boxShadow: '0 4px 12px rgba(15, 44, 89, 0.25)'
            }}
          >
            <Printer size={15} />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* 2. Ringkasan Metrik KPI SIPD */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 20
        }}
      >
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderTree size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>PROGRAM SIPD</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0f2c59', marginTop: 2 }}>{totalProgramsCount} Program</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Kepmendagri DINPUTARU</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>KEGIATAN & SUB KEGIATAN</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0f2c59', marginTop: 2 }}>
              <span style={{ color: '#0284c7' }}>{totalKegiatansCount} Keg</span> • <span style={{ color: '#059669' }}>{totalSubKegiatansCount} Sub</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Nomenklatur Baku</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>TOTAL PAKET TERIKAT</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#166534', marginTop: 2 }}>{totalProjectsCount} Paket</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>100% Terklasifikasi SIPD</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>TOTAL PAGU INDUK</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0f2c59', marginTop: 2 }}>
              Rp {(totalPaguAll / 1e9).toFixed(2)} M
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Kontrak: Rp {(totalKontrakAll / 1e9).toFixed(2)} M</div>
          </div>
        </div>
      </div>

      {/* 2.4. DIAGRAM KOTAK: KOMPARASI REALISASI & SEBARAN ANGGARAN PROGRAM */}
      <div
        className="card"
        style={{
          marginBottom: 22,
          background: '#ffffff',
          borderRadius: 16,
          border: '1.5px solid #cbd5e1',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(15, 44, 89, 0.06)'
        }}
      >
        {/* Header Diagram Kotak */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091e3a 0%, #0f2c59 60%, #1e3a8a 100%)',
            padding: '16px 20px',
            color: '#ffffff',
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
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#f8fafc', letterSpacing: -0.2 }}>
                  {systemSettings?.customTexts?.internal_sipd_box_title || DEFAULT_CUSTOM_TEXTS.internal_sipd_box_title}
                </h3>
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999
                  }}
                >
                  {programBoxesData.length} Program
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                {systemSettings?.customTexts?.internal_sipd_box_desc || DEFAULT_CUSTOM_TEXTS.internal_sipd_box_desc}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Sort Dropdown */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.08)',
                padding: '4px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <SlidersHorizontal size={13} color="#93c5fd" />
              <span style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 600 }}>Urutkan:</span>
              <select
                value={programBoxSort}
                onChange={(e) => setProgramBoxSort(e.target.value)}
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 11.5,
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="pagu_desc" style={{ color: '#0f172a', background: '#fff' }}>Pagu Terbesar</option>
                <option value="fisik_desc" style={{ color: '#0f172a', background: '#fff' }}>Fisik Tertinggi</option>
                <option value="keu_desc" style={{ color: '#0f172a', background: '#fff' }}>Serapan SP2D Tertinggi</option>
                <option value="deviasi_desc" style={{ color: '#0f172a', background: '#fff' }}>Deviasi Positif</option>
                <option value="nama_asc" style={{ color: '#0f172a', background: '#fff' }}>Nama Program (A-Z)</option>
              </select>
            </div>

            {/* Toggle Collapse */}
            <button
              type="button"
              onClick={() => setShowProgramBoxes(!showProgramBoxes)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {showProgramBoxes ? (
                <>
                  <ChevronUp size={14} />
                  <span>Sembunyikan</span>
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  <span>Tampilkan Kotak</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Kotak-Kotak Grid */}
        {showProgramBoxes && (
          <div style={{ padding: '20px', background: '#f8fafc' }}>
            {programBoxesData.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                Tidak ada program yang sesuai dengan filter pencarian.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 16
                }}
              >
                {programBoxesData.map((prog) => {
                  const bidangColor = prog.bidang?.warna || '#0284c7';
                  const bidangLight = prog.bidang?.bgLight || '#e0f2fe';
                  const isFisikAhead = prog.avgFisik >= prog.persenKeuangan;

                  return (
                    <div
                      key={prog.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: 14,
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 2px 10px rgba(15, 44, 89, 0.04)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 44, 89, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 44, 89, 0.04)';
                      }}
                    >
                      {/* Top Accent Strip */}
                      <div style={{ height: 4, background: `linear-gradient(90deg, ${bidangColor}, #0f2c59)` }} />

                      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                        {/* Header Box: Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span
                              style={{
                                background: bidangLight,
                                color: bidangColor,
                                border: `1px solid ${bidangColor}40`,
                                fontSize: 10.5,
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: 6,
                                textTransform: 'uppercase'
                              }}
                            >
                              {prog.bidang?.singkatan || prog.bidangId}
                            </span>
                            <span
                              style={{
                                background: '#f1f5f9',
                                color: '#334155',
                                fontSize: 11,
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: 6,
                                fontFamily: 'monospace'
                              }}
                            >
                              {prog.kodeProgram}
                            </span>
                          </div>

                          <span
                            style={{
                              background: '#eff6ff',
                              color: '#1e40af',
                              fontSize: 11,
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 9999
                            }}
                          >
                            {prog.projectCount} Paket
                          </span>
                        </div>

                        {/* Program Name */}
                        <div>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: 13.5,
                              fontWeight: 800,
                              color: '#0f2c59',
                              lineHeight: 1.35,
                              minHeight: 36
                            }}
                            title={prog.namaProgram}
                          >
                            {prog.namaProgram}
                          </h4>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                            {prog.kegiatans.length} Kegiatan • {prog.totalSub} Sub Kegiatan
                          </div>
                        </div>

                        {/* Pagu Anggaran & Porsi Dinas */}
                        <div
                          style={{
                            background: '#f8fafc',
                            borderRadius: 10,
                            padding: '10px 12px',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>PAGU PROGRAM</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7' }}>
                              {prog.porsiPagu}% Dinas
                            </span>
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: '#0f2c59', letterSpacing: -0.2 }}>
                            {formatRpCompact(prog.totalPagu)}
                          </div>
                          {/* Proportion Bar */}
                          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden', marginTop: 6 }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${Math.min(100, prog.porsiPagu)}%`,
                                background: `linear-gradient(90deg, ${bidangColor}, #2563eb)`,
                                borderRadius: 9999
                              }}
                            />
                          </div>
                        </div>

                        {/* Dual Realisasi Progress Meters: Fisik & Keuangan */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {/* Progres Fisik */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 3 }}>
                              <span style={{ color: '#475569', fontWeight: 600 }}>Realisasi Fisik</span>
                              <strong style={{ color: '#0369a1', fontWeight: 800 }}>{prog.avgFisik}%</strong>
                            </div>
                            <div style={{ height: 8, background: '#e0f2fe', borderRadius: 9999, overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${Math.min(100, Math.max(0, prog.avgFisik))}%`,
                                  background: 'linear-gradient(90deg, #38bdf8, #0284c7)',
                                  borderRadius: 9999,
                                  transition: 'width 0.4s ease'
                                }}
                              />
                            </div>
                          </div>

                          {/* Serapan Keuangan / SP2D */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 3 }}>
                              <span style={{ color: '#475569', fontWeight: 600 }}>Serapan SP2D Keuangan</span>
                              <strong style={{ color: '#7c3aed', fontWeight: 800 }}>{prog.persenKeuangan}%</strong>
                            </div>
                            <div style={{ height: 8, background: '#ede9fe', borderRadius: 9999, overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${Math.min(100, Math.max(0, prog.persenKeuangan))}%`,
                                  background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                                  borderRadius: 9999,
                                  transition: 'width 0.4s ease'
                                }}
                              />
                            </div>
                          </div>

                          {/* Deviasi Indicator Badge */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                            <span style={{ fontSize: 10.5, color: '#64748b', fontWeight: 600 }}>Status Deviasi Kinerja:</span>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: 6,
                                background: isFisikAhead ? '#dcfce7' : '#fef3c7',
                                color: isFisikAhead ? '#15803d' : '#b45309',
                                border: isFisikAhead ? '1px solid #bbf7d0' : '1px solid #fde68a',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              {isFisikAhead ? `+${prog.deviasi}% Fisik Unggul` : `-${Math.abs(prog.deviasi)}% SP2D Unggul`}
                            </span>
                          </div>
                        </div>

                        {/* Financial Sub-breakdown Row */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 6,
                            padding: '10px 8px',
                            background: '#f1f5f9',
                            borderRadius: 10,
                            textAlign: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 9.5, color: '#64748b', fontWeight: 700 }}>KONTRAK</div>
                            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#b45309', marginTop: 1 }}>
                              {formatRpCompact(prog.totalKontrak)}
                            </div>
                            <div style={{ fontSize: 9.5, color: '#94a3b8' }}>{prog.persenKontrak}% Pagu</div>
                          </div>
                          <div style={{ borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: 9.5, color: '#64748b', fontWeight: 700 }}>SP2D CAIR</div>
                            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#059669', marginTop: 1 }}>
                              {formatRpCompact(prog.totalPencairan)}
                            </div>
                            <div style={{ fontSize: 9.5, color: '#94a3b8' }}>{prog.persenCair}% Ktr</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 9.5, color: '#64748b', fontWeight: 700 }}>SISA PAGU</div>
                            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#475569', marginTop: 1 }}>
                              {formatRpCompact(prog.sisaPagu)}
                            </div>
                            <div style={{ fontSize: 9.5, color: '#94a3b8' }}>Efisiensi</div>
                          </div>
                        </div>

                        {/* Interactive Jump Button */}
                        <button
                          type="button"
                          onClick={() => handleJumpToProgram(prog.id)}
                          style={{
                            marginTop: 'auto',
                            width: '100%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            padding: '8px 12px',
                            borderRadius: 8,
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#0369a1',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#e0f2fe';
                            e.currentTarget.style.borderColor = '#0284c7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                          }}
                        >
                          <span>Buka & Telusuri di Pohon</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2.5. DASHBOARD DIAGRAM & ANALITIK KINERJA SIPD */}
      <div
        className="card"
        style={{
          marginBottom: 22,
          background: '#ffffff',
          borderRadius: 16,
          border: '1.5px solid #cbd5e1',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(15, 44, 89, 0.06)'
        }}
      >
        {/* Header Visual Analytics Dashboard */}
        <div
          style={{
            background: 'linear-gradient(135deg, #071527 0%, #0f2c59 60%, #1e3a8a 100%)',
            padding: '16px 20px',
            color: '#ffffff',
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
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <BarChart3 size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#f8fafc', letterSpacing: -0.2 }}>
                  {systemSettings?.customTexts?.internal_sipd_analytics_title || DEFAULT_CUSTOM_TEXTS.internal_sipd_analytics_title}
                </h3>
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999
                  }}
                >
                  TA {activeYear}
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                {systemSettings?.customTexts?.internal_sipd_analytics_desc || `Komparasi Progres Fisik vs Keuangan dan Distribusi Pagu per ${chartLevel === 'program' ? 'Program' : chartLevel === 'kegiatan' ? 'Kegiatan' : 'Sub Kegiatan'}`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowCharts((prev) => !prev)}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {showCharts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span>{showCharts ? 'Sembunyikan Diagram' : 'Tampilkan Diagram'}</span>
            </button>
          </div>
        </div>

        {showCharts && (
          <div style={{ padding: '18px 20px', background: '#f8fafc' }}>
            {/* Toolbar Kontrol Level & Tipe Diagram */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: '1px solid #e2e8f0'
              }}
            >
              {/* 1. Level Nomenklatur Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginRight: 4 }}>
                  Tingkat Data:
                </span>
                <button
                  type="button"
                  onClick={() => setChartLevel('program')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: chartLevel === 'program' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    background: chartLevel === 'program' ? '#0284c7' : '#ffffff',
                    color: chartLevel === 'program' ? '#ffffff' : '#334155',
                    boxShadow: chartLevel === 'program' ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🏢 Per Program ({filteredTree.length})
                </button>
                <button
                  type="button"
                  onClick={() => setChartLevel('kegiatan')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: chartLevel === 'kegiatan' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    background: chartLevel === 'kegiatan' ? '#0284c7' : '#ffffff',
                    color: chartLevel === 'kegiatan' ? '#ffffff' : '#334155',
                    boxShadow: chartLevel === 'kegiatan' ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  📑 Per Kegiatan ({chartData.length && chartLevel === 'kegiatan' ? chartData.length : sipdKegiatans.length})
                </button>
                <button
                  type="button"
                  onClick={() => setChartLevel('sub_kegiatan')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: chartLevel === 'sub_kegiatan' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    background: chartLevel === 'sub_kegiatan' ? '#0284c7' : '#ffffff',
                    color: chartLevel === 'sub_kegiatan' ? '#ffffff' : '#334155',
                    boxShadow: chartLevel === 'sub_kegiatan' ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  📌 Per Sub Kegiatan ({chartData.length && chartLevel === 'sub_kegiatan' ? chartData.length : sipdSubKegiatans.length})
                </button>
              </div>

              {/* 2. Jenis Tampilan Diagram */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginRight: 4 }}>
                  Tampilan:
                </span>
                <button
                  type="button"
                  onClick={() => setChartType('fisik_keu')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: chartType === 'fisik_keu' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    background: chartType === 'fisik_keu' ? '#eff6ff' : '#ffffff',
                    color: chartType === 'fisik_keu' ? '#1d4ed8' : '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <Activity size={13} />
                  <span>Fisik vs Keuangan (%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('anggaran')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: chartType === 'anggaran' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                    background: chartType === 'anggaran' ? '#ecfdf5' : '#ffffff',
                    color: chartType === 'anggaran' ? '#047857' : '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <DollarSign size={13} />
                  <span>Sebaran Anggaran (Rp)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('donut')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: chartType === 'donut' ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                    background: chartType === 'donut' ? '#f5f3ff' : '#ffffff',
                    color: chartType === 'donut' ? '#6d28d9' : '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <PieChart size={13} />
                  <span>Proporsi Donut Pagu</span>
                </button>

                {/* Sort dropdown */}
                {chartType !== 'donut' && (
                  <select
                    value={chartSortBy}
                    onChange={(e) => setChartSortBy(e.target.value)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: 12,
                      color: '#334155',
                      background: '#ffffff',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pagu_desc">Sortir: Pagu Terbesar</option>
                    <option value="fisik_desc">Sortir: Fisik Tertinggi</option>
                    <option value="keu_desc">Sortir: Keuangan Tertinggi</option>
                    <option value="deviasi_desc">Sortir: Deviasi Terbesar</option>
                    <option value="nama_asc">Sortir: Nama A-Z</option>
                  </select>
                )}
              </div>
            </div>

            {/* Konten Diagram 1: Realisasi Fisik vs Keuangan (%) */}
            {chartType === 'fisik_keu' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {chartData.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    Tidak ada data diagram yang sesuai dengan filter pencarian.
                  </div>
                ) : (
                  chartData.map((item) => {
                    const bidang = BIDANG_LIST.find((b) => b.id === item.bidangId);
                    const isFisikAhead = item.deviasi >= 0;

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: 12,
                          border: '1px solid #e2e8f0',
                          padding: '16px 18px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Header Item */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontSize: 11,
                                fontWeight: 800,
                                background: '#f1f5f9',
                                color: '#0f2c59',
                                padding: '2px 8px',
                                borderRadius: 6,
                                border: '1px solid #e2e8f0'
                              }}
                            >
                              {item.code}
                            </span>
                            {bidang && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  background: bidang.bgLight || '#f1f5f9',
                                  color: bidang.warna || '#0284c7',
                                  padding: '2px 8px',
                                  borderRadius: 9999
                                }}
                              >
                                {bidang.singkatan}
                              </span>
                            )}
                            <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a' }}>
                              {item.name}
                            </span>
                            {item.parentName && (
                              <span style={{ fontSize: 11.5, color: '#64748b' }}>
                                (Induk: {item.parentName})
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                padding: '1px 7px',
                                borderRadius: 9999,
                                color: '#475569'
                              }}
                            >
                              {item.projectCount} Paket
                            </span>
                          </div>

                          {/* Deviasi Pill */}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '3px 10px',
                              borderRadius: 9999,
                              fontSize: 11.5,
                              fontWeight: 800,
                              background: isFisikAhead ? '#dcfce7' : '#fef3c7',
                              color: isFisikAhead ? '#15803d' : '#b45309',
                              border: `1px solid ${isFisikAhead ? '#86efac' : '#fde68a'}`
                            }}
                          >
                            <TrendingUp size={13} />
                            <span>
                              Deviasi: {isFisikAhead ? `+${item.deviasi}%` : `${item.deviasi}%`}
                              <span style={{ fontWeight: 600, marginLeft: 4 }}>
                                ({isFisikAhead ? 'Fisik Mendahului' : 'Keuangan Mendahului'})
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Dual Progress Bars */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                          {/* Track 1: Progres Fisik */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#0369a1', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }} />
                                Realisasi Fisik
                              </span>
                              <span style={{ fontSize: 13, fontWeight: 900, color: '#0284c7' }}>
                                {item.persenFisik}%
                              </span>
                            </div>
                            <div style={{ height: 12, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden', position: 'relative' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${Math.min(item.persenFisik, 100)}%`,
                                  background: 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
                                  borderRadius: 9999,
                                  transition: 'width 0.4s ease',
                                  boxShadow: '0 1px 4px rgba(2, 132, 199, 0.4)'
                                }}
                              />
                            </div>
                          </div>

                          {/* Track 2: Realisasi Keuangan */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#047857', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                                Realisasi Keuangan (SP2D Cair)
                              </span>
                              <span style={{ fontSize: 13, fontWeight: 900, color: '#059669' }}>
                                {item.persenKeuangan}%
                              </span>
                            </div>
                            <div style={{ height: 12, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden', position: 'relative' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${Math.min(item.persenKeuangan, 100)}%`,
                                  background: 'linear-gradient(90deg, #34d399 0%, #059669 100%)',
                                  borderRadius: 9999,
                                  transition: 'width 0.4s ease',
                                  boxShadow: '0 1px 4px rgba(5, 150, 105, 0.4)'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Footer Mini-Stats */}
                        <div
                          style={{
                            marginTop: 10,
                            paddingTop: 8,
                            borderTop: '1px dashed #e2e8f0',
                            display: 'flex',
                            gap: 16,
                            flexWrap: 'wrap',
                            fontSize: 11.5,
                            color: '#64748b'
                          }}
                        >
                          <span>Pagu: <strong>{formatRpCompact(item.pagu)}</strong></span>
                          <span>Nilai Kontrak: <strong style={{ color: '#0f2c59' }}>{formatRpCompact(item.kontrak)}</strong></span>
                          <span>SP2D Cair: <strong style={{ color: '#059669' }}>{formatRpCompact(item.pencairan)}</strong></span>
                          <span>Sisa Pagu: <strong style={{ color: '#dc2626' }}>{formatRpCompact(item.pagu - item.pencairan)}</strong></span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Konten Diagram 2: Sebaran Anggaran (Pagu vs Nilai Kontrak vs SP2D) */}
            {chartType === 'anggaran' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {chartData.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    Tidak ada data anggaran yang sesuai dengan filter pencarian.
                  </div>
                ) : (
                  chartData.map((item) => {
                    const bidang = BIDANG_LIST.find((b) => b.id === item.bidangId);
                    const paguWidth = maxPaguInChart > 0 ? Math.max((item.pagu / maxPaguInChart) * 100, 3) : 0;
                    const kontrakWidth = maxPaguInChart > 0 ? Math.max((item.kontrak / maxPaguInChart) * 100, 3) : 0;
                    const sp2dWidth = maxPaguInChart > 0 ? Math.max((item.pencairan / maxPaguInChart) * 100, 3) : 0;

                    const persenKontrakDariPagu = item.pagu > 0 ? ((item.kontrak / item.pagu) * 100).toFixed(1) : 0;
                    const persenPencairanDariKontrak = item.kontrak > 0 ? ((item.pencairan / item.kontrak) * 100).toFixed(1) : 0;
                    const efisiensiLelang = Math.max(item.pagu - item.kontrak, 0);

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: 12,
                          border: '1px solid #e2e8f0',
                          padding: '16px 18px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                        }}
                      >
                        {/* Header Item */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontSize: 11,
                                fontWeight: 800,
                                background: '#f1f5f9',
                                color: '#0f2c59',
                                padding: '2px 8px',
                                borderRadius: 6
                              }}
                            >
                              {item.code}
                            </span>
                            {bidang && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  background: bidang.bgLight || '#f1f5f9',
                                  color: bidang.warna || '#0284c7',
                                  padding: '2px 8px',
                                  borderRadius: 9999
                                }}
                              >
                                {bidang.singkatan}
                              </span>
                            )}
                            <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a' }}>
                              {item.name}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                            <span
                              style={{
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                padding: '2px 8px',
                                borderRadius: 6,
                                fontWeight: 700
                              }}
                            >
                              Pagu: {formatRpCompact(item.pagu)}
                            </span>
                            {efisiensiLelang > 0 && (
                              <span
                                style={{
                                  background: '#ecfdf5',
                                  color: '#047857',
                                  padding: '2px 8px',
                                  borderRadius: 6,
                                  fontWeight: 700
                                }}
                              >
                                Efisiensi: {formatRpCompact(efisiensiLelang)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 3 Tiered Proportional Horizontal Bars */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {/* 1. Bar Pagu */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#475569', marginBottom: 3 }}>
                              <span>Pagu Anggaran Induk</span>
                              <strong style={{ color: '#0f2c59' }}>{formatRpCompact(item.pagu)}</strong>
                            </div>
                            <div style={{ height: 10, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${paguWidth}%`,
                                  background: 'linear-gradient(90deg, #1e3a8a 0%, #0f2c59 100%)',
                                  borderRadius: 9999,
                                  transition: 'width 0.4s ease'
                                }}
                              />
                            </div>
                          </div>

                          {/* 2. Bar Nilai Kontrak */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#475569', marginBottom: 3 }}>
                              <span>Nilai Kontrak Terikat ({persenKontrakDariPagu}% dari Pagu)</span>
                              <strong style={{ color: '#b45309' }}>{formatRpCompact(item.kontrak)}</strong>
                            </div>
                            <div style={{ height: 10, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${kontrakWidth}%`,
                                  background: 'linear-gradient(90deg, #fbbf24 0%, #d97706 100%)',
                                  borderRadius: 9999,
                                  transition: 'width 0.4s ease'
                                }}
                              />
                            </div>
                          </div>

                          {/* 3. Bar SP2D Pencairan */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#475569', marginBottom: 3 }}>
                              <span>Realisasi SP2D Cair ({persenPencairanDariKontrak}% dari Kontrak)</span>
                              <strong style={{ color: '#047857' }}>{formatRpCompact(item.pencairan)}</strong>
                            </div>
                            <div style={{ height: 10, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${sp2dWidth}%`,
                                  background: 'linear-gradient(90deg, #34d399 0%, #059669 100%)',
                                  borderRadius: 9999,
                                  transition: 'width 0.4s ease'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Konten Diagram 3: Proporsi Donut Pagu */}
            {chartType === 'donut' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 20,
                  alignItems: 'center'
                }}
              >
                {/* Donut Chart Component */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 14,
                    padding: '24px 20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <DonutPieChart
                    data={donutData}
                    size={260}
                    thickness={40}
                    centerValue={totalPaguAll}
                    centerLabel="Total Pagu"
                    isCurrency={true}
                    legendPosition="bottom"
                  />
                </div>

                {/* Highlight Cards & Ringkasan Komposisi */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Card Highlight Pagu Dominan */}
                  {chartData.length > 0 && (
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        padding: '16px 18px',
                        border: '1px solid #e2e8f0',
                        borderLeft: '5px solid #0284c7'
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Alokasi Pagu Anggaran Terbesar
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#0f2c59', marginTop: 4 }}>
                        {chartData[0]?.name}
                      </div>
                      <div style={{ fontSize: 13, color: '#0284c7', fontWeight: 800, marginTop: 2 }}>
                        {formatRpCompact(chartData[0]?.pagu)} ({totalPaguAll > 0 ? ((chartData[0]?.pagu / totalPaguAll) * 100).toFixed(1) : 0}% dari Total Pagu)
                      </div>
                    </div>
                  )}

                  {/* Card Highlight Realisasi Fisik Terbaik */}
                  {chartData.length > 0 && (() => {
                    const bestFisik = [...chartData].sort((a, b) => b.persenFisik - a.persenFisik)[0];
                    return (
                      <div
                        style={{
                          background: '#ffffff',
                          borderRadius: 12,
                          padding: '16px 18px',
                          border: '1px solid #e2e8f0',
                          borderLeft: '5px solid #16a34a'
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                          Capaian Fisik Tertinggi
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: '#0f2c59', marginTop: 4 }}>
                          {bestFisik?.name}
                        </div>
                        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 800, marginTop: 2 }}>
                          Realisasi Fisik: {bestFisik?.persenFisik}% • Keuangan: {bestFisik?.persenKeuangan}%
                        </div>
                      </div>
                    );
                  })()}

                  {/* Ringkasan Efisiensi Pengadaan */}
                  <div
                    style={{
                      background: '#ffffff',
                      borderRadius: 12,
                      padding: '16px 18px',
                      border: '1px solid #e2e8f0',
                      borderLeft: '5px solid #d97706'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Total Efisiensi Lelang Kontrak (Seluruh Entitas)
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#b45309', marginTop: 4 }}>
                      {formatRpCompact(Math.max(totalPaguAll - totalKontrakAll, 0))}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      Realisasi SP2D Cair: <strong>{formatRpCompact(totalPencairanAll)}</strong> ({totalKontrakAll > 0 ? ((totalPencairanAll / totalKontrakAll) * 100).toFixed(1) : 0}% dari Nilai Kontrak)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Filter Bar & Tree Navigation Controls */}
      <div className="table-controls" style={{ marginBottom: 18 }}>
        <div className="search-filter-group" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          {/* Search Box */}
          <div className="search-box" style={{ minWidth: 280 }}>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Cari program, sub kegiatan, nama paket..."
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

          {/* Expand / Collapse Controls */}
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={expandAll}
              style={{ fontSize: 12, padding: '7px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}
              title="Buka seluruh pohon hierarki hingga tingkat paket pekerjaan"
            >
              <Maximize2 size={13} />
              <span>Buka Semua</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={collapseAll}
              style={{ fontSize: 12, padding: '7px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}
              title="Tutup pohon ke tingkat Program"
            >
              <Minimize2 size={13} />
              <span>Tutup Semua</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Hierarchical SIPD Tree View */}
      {filteredTree.length === 0 ? (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
          <FolderTree size={42} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0f2c59' }}>Tidak ada nomenklatur atau pekerjaan yang cocok</div>
          <p style={{ margin: '6px 0 0', fontSize: 13 }}>
            Coba ubah kata kunci pencarian atau bersihkan filter bidang yang dipilih.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {filteredTree.map((prog) => {
            const isProgExpanded = !!expandedNodes[`prog_${prog.id}`];
            const bidang = BIDANG_LIST.find((b) => b.id === prog.bidangId);

            return (
              <div
                key={prog.id}
                id={`prog-node-${prog.id}`}
                className="card"
                style={{
                  border: isProgExpanded ? '1.5px solid #93c5fd' : '1px solid #e2e8f0',
                  boxShadow: isProgExpanded ? '0 8px 24px rgba(15, 44, 89, 0.08)' : 'var(--shadow-sm)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* LEVEL 1: HEADER PROGRAM */}
                <div
                  onClick={() => toggleNode(`prog_${prog.id}`)}
                  style={{
                    background: isProgExpanded
                      ? 'linear-gradient(135deg, #0f2c59 0%, #1e3a8a 100%)'
                      : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    color: isProgExpanded ? '#ffffff' : '#0f172a',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 280 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: isProgExpanded ? 'rgba(255, 255, 255, 0.2)' : '#e0f2fe',
                        color: isProgExpanded ? '#ffffff' : '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {isProgExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 900,
                            fontSize: 12,
                            padding: '2px 8px',
                            borderRadius: 6,
                            background: isProgExpanded ? 'rgba(255, 255, 255, 0.25)' : '#dbeafe',
                            color: isProgExpanded ? '#ffffff' : '#1d4ed8'
                          }}
                        >
                          PROGRAM {prog.kodeProgram}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 9999,
                            background: isProgExpanded ? 'rgba(255, 255, 255, 0.15)' : (bidang?.bgLight || '#f1f5f9'),
                            color: isProgExpanded ? '#93c5fd' : (bidang?.warna || '#475569')
                          }}
                        >
                          {bidang?.nama || prog.bidangId}
                        </span>
                      </div>
                      <h3 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800 }}>
                        {prog.namaProgram}
                      </h3>
                      {prog.deskripsi && (
                        <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>
                          {prog.deskripsi}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Program Aggregate Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10.5, opacity: 0.8, textTransform: 'uppercase' }}>PAGU PROGRAM</div>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>
                        Rp {prog.totalPagu.toLocaleString('id-ID')}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.85 }}>
                        {prog.projectCount} Paket Pekerjaan
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: 100 }}>
                      <div style={{ fontSize: 10.5, opacity: 0.8, textTransform: 'uppercase' }}>RATA-RATA FISIK</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: isProgExpanded ? '#4ade80' : '#16a34a' }}>
                        {prog.avgFisik}%
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.85 }}>
                        Keuangan: {prog.persenKeuangan}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* LEVEL 2: KEGIATAN LIST */}
                {isProgExpanded && (
                  <div style={{ background: '#ffffff', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {prog.kegiatans.length === 0 ? (
                      <div style={{ padding: 16, color: '#94a3b8', fontStyle: 'italic', fontSize: 13 }}>
                        Belum ada Kegiatan yang terdaftar di bawah program ini.
                      </div>
                    ) : (
                      prog.kegiatans.map((keg) => {
                        const isKegExpanded = !!expandedNodes[`keg_${keg.id}`];

                        return (
                          <div
                            key={keg.id}
                            style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: 12,
                              overflow: 'hidden',
                              background: '#ffffff'
                            }}
                          >
                            {/* KEGIATAN HEADER */}
                            <div
                              onClick={() => toggleNode(`keg_${keg.id}`)}
                              style={{
                                background: isKegExpanded ? '#f1f5f9' : '#f8fafc',
                                padding: '12px 16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 12,
                                borderBottom: isKegExpanded ? '1px solid #cbd5e1' : 'none'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                                <div
                                  style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 6,
                                    background: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    color: '#334155',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  {isKegExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                </div>

                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span
                                      style={{
                                        fontFamily: 'monospace',
                                        fontWeight: 800,
                                        fontSize: 11,
                                        color: '#166534',
                                        background: '#dcfce7',
                                        padding: '1px 6px',
                                        borderRadius: 4
                                      }}
                                    >
                                      KEGIATAN {keg.kodeKegiatan}
                                    </span>
                                    <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0f2c59' }}>
                                      {keg.namaKegiatan}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ textAlign: 'right', fontSize: 12 }}>
                                  <span style={{ color: '#64748b' }}>Pagu: </span>
                                  <strong style={{ color: '#0f2c59' }}>
                                    Rp {keg.totalPagu.toLocaleString('id-ID')}
                                  </strong>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: 12 }}>
                                  <span style={{ color: '#64748b' }}>Fisik: </span>
                                  <strong style={{ color: '#0284c7' }}>{keg.avgFisik}%</strong>
                                </div>
                                <span
                                  style={{
                                    background: '#e2e8f0',
                                    color: '#334155',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: 9999
                                  }}
                                >
                                  {keg.subKegiatans.length} Sub Kegiatan
                                </span>
                              </div>
                            </div>

                            {/* LEVEL 3: SUB KEGIATAN LIST */}
                            {isKegExpanded && (
                              <div style={{ padding: '14px 16px', background: '#fafbfc', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {keg.subKegiatans.length === 0 ? (
                                  <div style={{ padding: 12, color: '#94a3b8', fontStyle: 'italic', fontSize: 12 }}>
                                    Belum ada Sub Kegiatan di bawah kegiatan ini.
                                  </div>
                                ) : (
                                  keg.subKegiatans.map((sub) => {
                                    const isSubExpanded = !!expandedNodes[`sub_${sub.id}`];

                                    return (
                                      <div
                                        key={sub.id}
                                        style={{
                                          border: isSubExpanded ? '1.5px solid #38bdf8' : '1px solid #e2e8f0',
                                          borderRadius: 10,
                                          background: '#ffffff',
                                          overflow: 'hidden'
                                        }}
                                      >
                                        {/* SUB KEGIATAN HEADER */}
                                        <div
                                          onClick={() => toggleNode(`sub_${sub.id}`)}
                                          style={{
                                            background: isSubExpanded ? '#f0f9ff' : '#ffffff',
                                            padding: '12px 14px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 12,
                                            borderBottom: isSubExpanded ? '1px solid #bae6fd' : 'none'
                                          }}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                                            <div
                                              style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 6,
                                                background: isSubExpanded ? '#0284c7' : '#f1f5f9',
                                                color: isSubExpanded ? '#ffffff' : '#64748b',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                              }}
                                            >
                                              {isSubExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            </div>

                                            <div>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                <span
                                                  style={{
                                                    fontFamily: 'monospace',
                                                    fontWeight: 800,
                                                    fontSize: 11,
                                                    color: '#0369a1',
                                                    background: '#e0f2fe',
                                                    padding: '1px 6px',
                                                    borderRadius: 4
                                                  }}
                                                >
                                                  SUB KEGIATAN {sub.kodeSubKegiatan}
                                                </span>
                                                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f2c59' }}>
                                                  {sub.namaSubKegiatan}
                                                </span>
                                              </div>
                                              {sub.kinerjaIndikator && (
                                                <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
                                                  🎯 Indikator Output: <strong>{sub.kinerjaIndikator}</strong> {sub.satuanTarget ? `(${sub.satuanTarget})` : ''}
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{ textAlign: 'right', fontSize: 12 }}>
                                              <div style={{ color: '#64748b', fontSize: 10 }}>PAGU SUB KEGIATAN</div>
                                              <strong style={{ color: '#0f2c59' }}>
                                                Rp {sub.totalPagu.toLocaleString('id-ID')}
                                              </strong>
                                            </div>

                                            <div style={{ textAlign: 'right', fontSize: 12 }}>
                                              <div style={{ color: '#64748b', fontSize: 10 }}>FISIK</div>
                                              <strong style={{ color: sub.avgFisik >= 100 ? '#16a34a' : '#0284c7' }}>
                                                {sub.avgFisik}%
                                              </strong>
                                            </div>

                                            <span
                                              style={{
                                                background: sub.projects.length > 0 ? '#dcfce7' : '#f1f5f9',
                                                color: sub.projects.length > 0 ? '#15803d' : '#64748b',
                                                fontWeight: 800,
                                                fontSize: 11,
                                                padding: '3px 8px',
                                                borderRadius: 6
                                              }}
                                            >
                                              {sub.projects.length} Paket
                                            </span>
                                          </div>
                                        </div>

                                        {/* LEVEL 4: DAFTAR PAKET PEKERJAAN */}
                                        {isSubExpanded && (
                                          <div style={{ padding: '12px 14px', background: '#ffffff' }}>
                                            {sub.projects.length === 0 ? (
                                              <div
                                                style={{
                                                  padding: '16px',
                                                  background: '#f8fafc',
                                                  borderRadius: 8,
                                                  textAlign: 'center',
                                                  color: '#64748b',
                                                  fontSize: 12.5
                                                }}
                                              >
                                                Belum ada paket pekerjaan yang dialokasikan pada Sub Kegiatan ini.
                                                {canCreateProject() && (
                                                  <div style={{ marginTop: 8 }}>
                                                    <button
                                                      type="button"
                                                      className="btn btn-outline"
                                                      onClick={() => onOpenProjectModal(null)}
                                                      style={{ fontSize: 11.5, padding: '4px 10px' }}
                                                    >
                                                      <Plus size={12} style={{ marginRight: 4 }} />
                                                      Input Pekerjaan Baru
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}>
                                                <table className="data-table" style={{ fontSize: 12 }}>
                                                  <thead>
                                                    <tr style={{ background: '#f8fafc' }}>
                                                      <th style={{ width: 130 }}>Kode Paket</th>
                                                      <th>Nama Paket Pekerjaan</th>
                                                      <th>Lokasi (Kecamatan & Desa)</th>
                                                      <th>Pagu & Kontrak (Rp)</th>
                                                      <th>Penyedia Rekanan (CV/PT)</th>
                                                      <th style={{ textAlign: 'center' }}>Fisik & Deviasi</th>
                                                      <th style={{ textAlign: 'center' }}>Keuangan (SP2D)</th>
                                                      <th style={{ textAlign: 'center', width: 90 }}>Aksi</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {sub.projects.map((p) => {
                                                      const kNilai = parseFloat(p.dataKontrak?.nilaiKontrak || 0);
                                                      const fRealisasi = parseFloat(p.dataFisik?.progresRealisasi || 0);
                                                      const fRencana = parseFloat(p.dataFisik?.progresRencana || 0);
                                                      const deviasi = parseFloat((fRealisasi - fRencana).toFixed(1));

                                                      return (
                                                        <tr key={p.id}>
                                                          <td>
                                                            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0f2c59' }}>
                                                              {p.id}
                                                            </span>
                                                          </td>
                                                          <td>
                                                            <div style={{ fontWeight: 700, color: '#0f2c59' }}>
                                                              {p.namaPaket}
                                                            </div>
                                                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                                              {p.tipePengadaan} • {p.sumberDana}
                                                            </div>
                                                          </td>
                                                          <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                              <MapPin size={12} color="#64748b" />
                                                              <span>{p.kecamatan || '-'}{p.desa ? `, Desa ${p.desa}` : ''}</span>
                                                            </div>
                                                          </td>
                                                          <td>
                                                            <div style={{ fontWeight: 700, color: '#0f2c59' }}>
                                                              Pagu: Rp {parseFloat(p.paguAnggaran || 0).toLocaleString('id-ID')}
                                                            </div>
                                                            <div style={{ fontSize: 11, color: kNilai > 0 ? '#166534' : '#94a3b8' }}>
                                                              {kNilai > 0 ? `Kontrak: Rp ${kNilai.toLocaleString('id-ID')}` : 'Belum Kontrak'}
                                                            </div>
                                                          </td>
                                                          <td>
                                                            <div style={{ fontWeight: 600 }}>{p.dataKontrak?.namaPenyedia || '-'}</div>
                                                            {p.dataKontrak?.nomorKontrak && (
                                                              <div style={{ fontSize: 10.5, color: '#64748b' }}>
                                                                SPK: {p.dataKontrak.nomorKontrak}
                                                              </div>
                                                            )}
                                                          </td>
                                                          <td style={{ textAlign: 'center' }}>
                                                            <div style={{ fontWeight: 800, color: fRealisasi >= 100 ? '#16a34a' : '#0284c7' }}>
                                                              {fRealisasi}%
                                                            </div>
                                                            <span
                                                              style={{
                                                                fontSize: 10.5,
                                                                fontWeight: 700,
                                                                color: deviasi < -5 ? '#dc2626' : deviasi < 0 ? '#d97706' : '#16a34a'
                                                              }}
                                                            >
                                                              {deviasi > 0 ? `+${deviasi}%` : `${deviasi}%`}
                                                            </span>
                                                          </td>
                                                          <td style={{ textAlign: 'center' }}>
                                                            <div style={{ fontWeight: 700 }}>
                                                              {p.dataKeuangan?.persenKeuangan || 0}%
                                                            </div>
                                                            <span
                                                              style={{
                                                                fontSize: 10.5,
                                                                padding: '1px 6px',
                                                                borderRadius: 4,
                                                                background: '#f1f5f9',
                                                                color: '#475569'
                                                              }}
                                                            >
                                                              {(p.administrasiSPJ?.status || 'belum_masuk').replace(/_/g, ' ')}
                                                            </span>
                                                          </td>
                                                          <td style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                                              <button
                                                                type="button"
                                                                className="btn-icon"
                                                                onClick={() => onViewProject(p)}
                                                                title="Lihat Rincian Paket"
                                                              >
                                                                <Eye size={14} />
                                                              </button>
                                                              {canCreateProject() && (
                                                                <button
                                                                  type="button"
                                                                  className="btn-icon"
                                                                  onClick={() => onOpenProjectModal(p)}
                                                                  style={{ color: '#0284c7' }}
                                                                  title="Edit Paket"
                                                                >
                                                                  <Edit size={14} />
                                                                </button>
                                                              )}
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      );
                                                    })}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Pengaturan Master SIPD */}
      <SipdMasterModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
      />
    </div>
  );
};

export default SipdSummaryView;
