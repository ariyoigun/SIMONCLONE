import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, DEFAULT_CUSTOM_TEXTS, DEFAULT_BIDANG_DESCRIPTIONS } from '../data/constants';
import {
  Building2,
  MapPin,
  ExternalLink,
  Search,
  Eye,
  LogIn,
  ArrowRight,
  Sparkles,
  Navigation,
  LayoutDashboard,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  FileText
} from 'lucide-react';
import AppLogo from '../components/AppLogo';

const LandingView = ({ onGoToLogin, onBackToInternal }) => {
  const { projects = [], activeYear, isLoggedIn, currentUser, systemSettings } = useApp();

  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectDetail, setActiveProjectDetail] = useState(null);

  // 1. Slideshow Pekerjaan Unggulan (Hero Carousel)
  const [currentSlideUnggulan, setCurrentSlideUnggulan] = useState(0);
  const [isUnggulanPaused, setIsUnggulanPaused] = useState(false);

  // 2. Old Galeri Slideshow (Optional toggle)
  const [currentSlideGaleri, setCurrentSlideGaleri] = useState(0);
  const [isGaleriPaused, setIsGaleriPaused] = useState(false);
  const [selectedBidangPeta, setSelectedBidangPeta] = useState('ALL');

  // Slideshow Unggulan Data
  const slidesUnggulan = useMemo(() => {
    const list = systemSettings?.slideshowUnggulan || [];
    if (list.length > 0) return list;
    return [
      {
        id: 'slide-1',
        projectId: 'prj_sda_bk_54',
        judul: 'Rehabilitasi Saluran Pembuang Stasiun - Tembiring - Tuntang Lama',
        subKegiatan: 'Normalisasi/Restorasi Sungai',
        bidangId: 'sda_bk',
        kategori: 'Pekerjaan Konstruksi (Fisik)',
        paguAnggaran: 1950036600,
        nilaiKontrak: 1911946000,
        pelaksana: 'CV. ANUGRAH MEKAR JAYA',
        nomorKontrak: '000.3.3/008/SP/TENDER/SDABK/VIII/2026',
        progresFisik: 30,
        progresKeuangan: 30,
        sp2d: 573583800,
        lokasi: 'Kecamatan Demak (Pusat Kota)',
        deskripsi: 'Pekerjaan strategis normalisasi dan rehabilitasi saluran pembuang air pengendali banjir perkotaan kawasan Stasiun, Tembiring hingga Tuntang Lama.',
        url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&auto=format&fit=crop&q=80'
      }
    ];
  }, [systemSettings?.slideshowUnggulan]);

  // Auto-play for Slideshow Unggulan
  useEffect(() => {
    if (slidesUnggulan.length <= 1 || isUnggulanPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideUnggulan((prev) => (prev + 1) % slidesUnggulan.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slidesUnggulan.length, isUnggulanPaused]);

  // Gallery Slides
  const gallerySlides = useMemo(() => {
    const list = systemSettings?.galeri || [];
    return list.length > 0
      ? list
      : [
          {
            id: 'gal-def-1',
            judul: 'Gedung Kantor DINPUTARU Kabupaten Demak',
            kategori: 'Gedung Kantor',
            lokasi: 'Jl. Kyai Jebat No. 35 Bintoro Kec. Demak',
            tahun: activeYear,
            deskripsi: 'Gedung induk pelayanan administrasi teknis dan penataan ruang DINPUTARU Kab. Demak.',
            url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80'
          }
        ];
  }, [systemSettings?.galeri, activeYear]);

  // Auto-play for old Galeri Slideshow
  useEffect(() => {
    if (gallerySlides.length <= 1 || isGaleriPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideGaleri((prev) => (prev + 1) % gallerySlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [gallerySlides.length, isGaleriPaused]);

  // Highlight 3 Pekerjaan Per Bidang dengan Nominal Tertinggi
  const top3PerBidang = useMemo(() => {
    const getNominal = (p) => (p.dataKontrak?.nilaiKontrak > 0 ? p.dataKontrak.nilaiKontrak : (parseFloat(p.paguAnggaran) || 0));

    // Bidang Teknis
    const targetBidangList = selectedBidang === 'ALL'
      ? BIDANG_LIST.filter((b) => b.id !== 'sekretariat')
      : BIDANG_LIST.filter((b) => b.id === selectedBidang);

    return targetBidangList.map((b) => {
      let bProjects = projects.filter((p) => p.bidangId === b.id);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        bProjects = bProjects.filter((p) =>
          (p.namaPaket?.toLowerCase() || '').includes(q) ||
          (p.subKegiatan?.toLowerCase() || '').includes(q) ||
          (p.kecamatan?.toLowerCase() || '').includes(q) ||
          (p.desa?.toLowerCase() || '').includes(q)
        );
      }
      // Urutkan nominal tertinggi
      const sorted = [...bProjects].sort((p1, p2) => getNominal(p2) - getNominal(p1));
      const top3 = sorted.slice(0, 3).map((p, idx) => ({
        ...p,
        rankNominal: idx + 1,
        nominalBersih: getNominal(p)
      }));

      return {
        bidang: b,
        items: top3,
        totalPaket: bProjects.length
      };
    }).filter((grp) => grp.items.length > 0);
  }, [projects, selectedBidang, searchQuery]);

  // Peta filtered projects per Bidang
  const petaFilteredProjects = useMemo(() => {
    if (selectedBidangPeta === 'ALL') return projects;
    return projects.filter((p) => p.bidangId === selectedBidangPeta);
  }, [projects, selectedBidangPeta]);

  // Aggregate Public Stats
  const totalCount = projects.length;
  const contractedCount = projects.filter((p) => p.isKontrak).length;
  const completedCount = projects.filter((p) => (p.dataFisik?.progresRealisasi || 0) >= 100).length;

  // Handle click on slide to open full detail
  const handleOpenSlideDetail = (slide) => {
    const matched = projects.find((p) => p.id === slide.projectId || p.namaPaket === slide.judul);
    if (matched) {
      setActiveProjectDetail(matched);
    } else {
      setActiveProjectDetail({
        id: slide.projectId || 'slide_detail',
        namaPaket: slide.judul,
        subKegiatan: slide.subKegiatan,
        subBagian: slide.subKegiatan,
        bidangId: slide.bidangId || 'sda_bk',
        kategoriPekerjaan: 'Fisik',
        paguAnggaran: slide.paguAnggaran,
        hps: slide.paguAnggaran,
        isKontrak: true,
        dataKontrak: {
          nomorKontrak: slide.nomorKontrak || '',
          nilaiKontrak: slide.nilaiKontrak || 0,
          namaPenyedia: slide.pelaksana || '-',
          tanggalKontrak: '2026-08-18',
          tanggalMulai: '2026-08-18',
          tanggalSelesai: '2026-11-25'
        },
        dataFisik: {
          progresRencana: 50,
          progresRealisasi: slide.progresFisik || 30,
          deviasiFisik: -20,
          statusDeviasi: 'Kritis'
        },
        dataKeuangan: {
          totalPencairan: slide.sp2d || 573583800,
          persenKeuangan: slide.progresKeuangan || 30,
          sisaAnggaran: (slide.nilaiKontrak || 1911946000) - (slide.sp2d || 573583800),
          terminHistory: [
            {
              id: 'TRM-1',
              terminKe: 'Pencairan SP2D Termin',
              nomorSP2D: 'SP2D-' + (slide.nomorKontrak || '2026'),
              tanggalSP2D: '2026-08-18',
              jumlah: slide.sp2d || 573583800,
              persen: slide.progresKeuangan || 30,
              keterangan: 'Pencairan SP2D Keuangan s/d Oktober 2026'
            }
          ]
        },
        kecamatan: 'Demak',
        desa: 'Bintoro',
        lokasiLengkap: slide.lokasi || 'Kabupaten Demak',
        latitude: -6.8944,
        longitude: 110.6385,
        tags: ['Proyek Strategis', 'Pekerjaan Unggulan'],
        administrasiSPJ: {
          status: 'sudah_masuk',
          catatanVerifikator: 'Berkas SPJ termin masuk, proses verifikasi SP2D'
        },
        logs: [
          {
            id: 'log-1',
            timestamp: '2026-10-31 16:30:00',
            userName: 'Koordinator Bidang',
            userRole: 'Koordinator',
            action: 'Update Progres',
            keterangan: 'Fisik mencapai ' + (slide.progresFisik || 30) + '% dan SP2D Rp ' + ((slide.sp2d || 573583800).toLocaleString('id-ID'))
          }
        ]
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'inherit' }}>
      {/* 1. TOP PUBLIC NAVBAR (Clean: Nama Web di kiri, Tombol Login di kanan) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo Brand & Nama Web */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <AppLogo
              logoUrl={systemSettings?.logoUrl}
              size={44}
              alt={systemSettings?.singkatanInstansi || 'DINPUTARU Demak'}
            />
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#0f2c59', letterSpacing: -0.3, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{systemSettings?.namaSistem || 'SIMON - SATUPUTARU'}</span>
                <span style={{ fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '1px 6px', borderRadius: 4 }}>
                  Portal Publik
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>
                {systemSettings?.instansi || 'Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak'} (TA {activeYear})
              </div>
            </div>
          </div>

          {/* Tombol Login di Sudut Kanan */}
          <div>
            {isLoggedIn ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onBackToInternal || onGoToLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 8
                }}
              >
                <LayoutDashboard size={15} />
                <span>Panel Internal ({currentUser?.nama?.split(',')[0]})</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onGoToLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 22px',
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                }}
              >
                <LogIn size={15} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, #071527 0%, #0f2c59 50%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '56px 24px 64px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(0,0,0,0) 70%)',
            top: '-150px',
            right: '-150px',
            pointerEvents: 'none'
          }}
        />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: 820 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 9999,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: 12,
                fontWeight: 600,
                color: '#fde68a',
                marginBottom: 16
              }}
            >
              <Sparkles size={14} color="#f59e0b" />
              <span>{systemSettings?.customTexts?.landing_hero_tagline || DEFAULT_CUSTOM_TEXTS.landing_hero_tagline}</span>
            </div>

            <h1
              style={{
                fontSize: 36,
                fontWeight: 900,
                lineHeight: 1.25,
                margin: '0 0 16px',
                letterSpacing: -0.5
              }}
            >
              {systemSettings?.customTexts?.landing_hero_title || DEFAULT_CUSTOM_TEXTS.landing_hero_title} <br />
              <span style={{ color: '#38bdf8' }}>{systemSettings?.instansi || 'Dinas Pekerjaan Umum & Tata Ruang Kab. Demak'}</span>
            </h1>

            <p style={{ fontSize: 15.5, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 28, maxWidth: 680 }}>
              {systemSettings?.customTexts?.landing_hero_desc || systemSettings?.deskripsi || DEFAULT_CUSTOM_TEXTS.landing_hero_desc}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 16,
              padding: '20px 24px',
              backdropFilter: 'blur(8px)',
              marginTop: 12
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>TOTAL PAKET PEKERJAAN</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#ffffff', marginTop: 4 }}>
                {totalCount} Paket
              </div>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>Tahun Anggaran {activeYear}</div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>PEKERJAAN TERKONTRAK</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#38bdf8', marginTop: 4 }}>
                {contractedCount} Paket
              </div>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>Sedang berjalan & rampung</div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>SELESAI 100% (PHO)</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fde047', marginTop: 4 }}>
                {completedCount} Paket
              </div>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>Siap dimanfaatkan publik</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SLIDESHOW PEKERJAAN UNGGULAN (HERO SHOWCASE / TOGGLE ON/OFF DI SUPERADMIN) */}
      {systemSettings?.showSlideshowUnggulan !== false && slidesUnggulan.length > 0 && (
        <section
          style={{
            maxWidth: 1280,
            margin: '-28px auto 44px',
            padding: '0 24px',
            position: 'relative',
            zIndex: 20
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 20px 45px -10px rgba(15, 44, 89, 0.35)',
              border: '4px solid #ffffff',
              background: '#071527',
              minHeight: 460
            }}
            onMouseEnter={() => setIsUnggulanPaused(true)}
            onMouseLeave={() => setIsUnggulanPaused(false)}
          >
            {slidesUnggulan.map((slide, sIdx) => {
              const isCurrent = sIdx === currentSlideUnggulan;
              const b = BIDANG_LIST.find((x) => x.id === slide.bidangId);

              return (
                <div
                  key={slide.id || sIdx}
                  style={{
                    position: isCurrent ? 'relative' : 'absolute',
                    inset: 0,
                    opacity: isCurrent ? 1 : 0,
                    transition: 'opacity 0.6s ease-in-out',
                    pointerEvents: isCurrent ? 'auto' : 'none',
                    display: isCurrent ? 'block' : 'none'
                  }}
                >
                  {/* Background Image with Dark Overlay */}
                  <div style={{ position: 'relative', height: 460, width: '100%', overflow: 'hidden' }}>
                    <img
                      src={slide.url}
                      alt={slide.judul}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to right, rgba(7, 21, 39, 0.96) 0%, rgba(7, 21, 39, 0.88) 45%, rgba(7, 21, 39, 0.4) 100%)'
                      }}
                    />

                    {/* Content Layer */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        padding: '36px 44px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: '#ffffff'
                      }}
                    >
                      {/* Top Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 800,
                            padding: '5px 12px',
                            borderRadius: 6,
                            background: '#f59e0b',
                            color: '#071527',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5
                          }}
                        >
                          <Sparkles size={13} />
                          PEKERJAAN UNGGULAN DAERAH
                        </span>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 800,
                            padding: '5px 12px',
                            borderRadius: 6,
                            background: b?.warna || '#0284c7',
                            color: '#ffffff'
                          }}
                        >
                          {b?.nama || slide.kategori || 'Pekerjaan Konstruksi'}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '5px 10px',
                            borderRadius: 6,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          {slide.subKegiatan || 'Infrastruktur Strategis'}
                        </span>
                      </div>

                      {/* Main Title & Description */}
                      <div style={{ maxWidth: 760, margin: '14px 0' }}>
                        <h2
                          style={{
                            fontSize: 26,
                            fontWeight: 900,
                            lineHeight: 1.3,
                            color: '#ffffff',
                            margin: '0 0 10px',
                            textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                          }}
                        >
                          {slide.judul}
                        </h2>
                        <p
                          style={{
                            fontSize: 13.5,
                            color: '#cbd5e1',
                            lineHeight: 1.6,
                            margin: '0 0 16px',
                            maxWidth: 700
                          }}
                        >
                          {slide.deskripsi || 'Pekerjaan infrastruktur strategis peningkatan sarana dan prasarana publik di Kabupaten Demak.'}
                        </p>

                        {/* Numeric Indicators (Full Down to Units) */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: 12,
                            background: 'rgba(15, 44, 89, 0.75)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 12,
                            padding: '12px 16px',
                            backdropFilter: 'blur(6px)'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                              Pagu Anggaran
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8', marginTop: 2 }}>
                              Rp {(slide.paguAnggaran || 0).toLocaleString('id-ID')}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                              Nilai Kontrak
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 900, color: '#4ade80', marginTop: 2 }}>
                              Rp {(slide.nilaiKontrak || 0).toLocaleString('id-ID')}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                              Pelaksana / Rekanan
                            </div>
                            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
                              {slide.pelaksana || '-'}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                              Realisasi Fisik & SP2D
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#fde047', marginTop: 2 }}>
                              Fisik {slide.progresFisik || 0}% • SP2D {slide.progresKeuangan || 0}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action & Location */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#94a3b8' }}>
                          <MapPin size={15} color="#38bdf8" />
                          <span>{slide.lokasi || 'Kabupaten Demak, Jawa Tengah'}</span>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleOpenSlideDetail(slide)}
                          style={{
                            padding: '10px 22px',
                            fontSize: 13,
                            fontWeight: 800,
                            borderRadius: 10,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: '#0284c7',
                            border: 'none',
                            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={16} />
                          <span>Lihat Detil Pekerjaan</span>
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Slide Navigation Controls */}
            {slidesUnggulan.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentSlideUnggulan((prev) => (prev - 1 + slidesUnggulan.length) % slidesUnggulan.length)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 14,
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 20
                  }}
                  title="Slide Sebelumnya"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentSlideUnggulan((prev) => (prev + 1) % slidesUnggulan.length)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: 14,
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 20
                  }}
                  title="Slide Selanjutnya"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Dot Indicators */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    right: 28,
                    display: 'flex',
                    gap: 6,
                    zIndex: 20
                  }}
                >
                  {slidesUnggulan.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentSlideUnggulan(dotIdx)}
                      style={{
                        width: dotIdx === currentSlideUnggulan ? 24 : 8,
                        height: 8,
                        borderRadius: 9999,
                        background: dotIdx === currentSlideUnggulan ? '#38bdf8' : 'rgba(255,255,255,0.4)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.25s ease'
                      }}
                      title={`Pindah ke slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* 4. OLD GALERI FOTO SLIDESHOW (HANYA MUNCUL JIKA TOGGLE ON DI SUPERADMIN) */}
      {systemSettings?.showGaleriSlideshow === true && (
        <section
          id="slideshow"
          style={{
            maxWidth: 1280,
            margin: '0 auto 48px',
            padding: '0 24px'
          }}
        >
          <div
            style={{
              position: 'relative',
              height: 400,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(15, 44, 89, 0.2)',
              border: '3px solid #ffffff',
              background: '#071527'
            }}
            onMouseEnter={() => setIsGaleriPaused(true)}
            onMouseLeave={() => setIsGaleriPaused(false)}
          >
            {gallerySlides.map((slide, sIdx) => {
              const isCurrent = sIdx === currentSlideGaleri;
              return (
                <div
                  key={slide.id || sIdx}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: isCurrent ? 1 : 0,
                    transition: 'opacity 0.7s ease-in-out',
                    pointerEvents: isCurrent ? 'auto' : 'none'
                  }}
                >
                  <img
                    src={slide.url}
                    alt={slide.judul}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(7, 21, 39, 0.94) 0%, rgba(7, 21, 39, 0.45) 50%, rgba(7, 21, 39, 0.1) 100%)'
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 32px', color: '#ffffff' }}>
                    <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: '#0284c7', marginBottom: 8 }}>
                      {slide.kategori || 'Galeri Foto'}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{slide.judul}</h3>
                    <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, maxWidth: 650 }}>{slide.deskripsi}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. SECTION: 4 BIDANG UTAMA PELAYANAN (Tanpa jumlah paket & tanpa link lihat pekerjaan) */}
      <section id="tentang" style={{ padding: '36px 24px 54px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7', letterSpacing: 1, textTransform: 'uppercase' }}>
            {systemSettings?.customTexts?.landing_bidang_badge || DEFAULT_CUSTOM_TEXTS.landing_bidang_badge}
          </span>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2c59', marginTop: 6 }}>
            {systemSettings?.customTexts?.landing_bidang_title || DEFAULT_CUSTOM_TEXTS.landing_bidang_title}
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 640, margin: '8px auto 0' }}>
            {systemSettings?.customTexts?.landing_bidang_desc || DEFAULT_CUSTOM_TEXTS.landing_bidang_desc}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {BIDANG_LIST.filter((b) => b.id !== 'sekretariat').map((b) => (
            <div
              key={b.id}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Badge Singkatan */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: b.bgLight,
                    color: b.warna,
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                    width: 'fit-content',
                    border: `1px solid ${b.warna}33`
                  }}
                >
                  {b.id === 'sda_bk' ? 'SDA-BK' : b.singkatan}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: b.warna,
                    background: b.bgLight,
                    padding: '3px 8px',
                    borderRadius: 6
                  }}
                >
                  Teknis
                </span>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f2c59', marginBottom: 8, lineHeight: 1.3 }}>
                {b.nama}
              </h3>

              <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.55, flex: 1, margin: 0 }}>
                {systemSettings?.bidangDescriptions?.[b.id] || DEFAULT_BIDANG_DESCRIPTIONS[b.id] || ''}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SECTION: HIGHLIGHT 3 PEKERJAAN NOMINAL TERTINGGI PER BIDANG */}
      <section id="sorotan" style={{ padding: '56px 24px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: 1 }}>
                <Award size={15} color="#f59e0b" />
                <span>HIGHLIGHT PEKERJAAN STRATEGIS PER BIDANG</span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2c59', marginTop: 4 }}>
                Pekerjaan dengan Alokasi Nominal Tertinggi (Top 3 Per Bidang)
              </h2>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: '4px 0 0' }}>
                Pemantauan paket strategis berskala prioritas tinggi untuk pengawasan transparansi pembangunan daerah.
              </p>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: 300, maxWidth: '100%' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Cari pekerjaan / lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 36, height: 40, fontSize: 13, background: '#ffffff' }}
              />
            </div>
          </div>

          {/* Bidang Filter Tabs */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setSelectedBidang('ALL')}
              style={{
                padding: '8px 16px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: selectedBidang === 'ALL' ? '#0f2c59' : '#ffffff',
                color: selectedBidang === 'ALL' ? '#ffffff' : '#475569',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              Semua 4 Bidang Teknis
            </button>

            {BIDANG_LIST.filter((b) => b.id !== 'sekretariat').map((b) => {
              const isSelected = selectedBidang === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBidang(b.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 9999,
                    fontSize: 13,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: isSelected ? b.warna : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {b.id === 'sda_bk' ? 'SDA-BK' : b.singkatan}
                </button>
              );
            })}
          </div>

          {/* Top 3 Cards Grouped By Bidang */}
          {top3PerBidang.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                padding: '48px 24px',
                borderRadius: 16,
                textAlign: 'center',
                color: '#64748b'
              }}
            >
              <Building2 size={36} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f2c59' }}>Tidak ada paket pekerjaan yang ditemukan</h4>
              <p style={{ fontSize: 13, marginTop: 4 }}>Coba ubah kata kunci pencarian atau reset filter bidang.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {top3PerBidang.map((group) => {
                const b = group.bidang;

                return (
                  <div key={b.id}>
                    {/* Header Group Bidang */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span
                        style={{
                          background: b.bgLight,
                          color: b.warna,
                          fontWeight: 800,
                          fontSize: 12,
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: `1px solid ${b.warna}33`
                        }}
                      >
                        {b.id === 'sda_bk' ? 'SDA-BK' : b.singkatan}
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f2c59', margin: 0 }}>
                        {b.nama}
                      </h3>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        (Top 3 dari {group.totalPaket} Paket)
                      </span>
                    </div>

                    {/* 3 Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                      {group.items.map((p) => {
                        const fRealisasi = parseFloat(p.dataFisik?.progresRealisasi || 0);
                        const kNilai = p.dataKontrak?.nilaiKontrak || 0;
                        const pagu = parseFloat(p.paguAnggaran) || 0;
                        const displayNominal = kNilai > 0 ? kNilai : pagu;
                        const pelaksana = p.dataKontrak?.namaPenyedia || '-';

                        return (
                          <div
                            key={p.id}
                            style={{
                              background: '#ffffff',
                              borderRadius: 16,
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-3px)';
                              e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 44, 89, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.04)';
                            }}
                          >
                            <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                              {/* Header Card: Rank Badge & Sub Kegiatan */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                    background: p.rankNominal === 1 ? '#fef3c7' : p.rankNominal === 2 ? '#e0f2fe' : '#f1f5f9',
                                    color: p.rankNominal === 1 ? '#b45309' : p.rankNominal === 2 ? '#0369a1' : '#475569',
                                    border: p.rankNominal === 1 ? '1px solid #fde68a' : '1px solid #cbd5e1'
                                  }}
                                >
                                  {p.rankNominal === 1 ? '⭐ Peringkat #1 Nominal Tertinggi' : `Peringkat #${p.rankNominal} Tertinggi`}
                                </span>
                                <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>
                                  {p.metodePemilihan || p.tipePengadaan || 'Pengadaan'}
                                </span>
                              </div>

                              {/* Title */}
                              <h4
                                style={{
                                  fontSize: 15,
                                  fontWeight: 800,
                                  color: '#0f2c59',
                                  margin: '0 0 10px',
                                  lineHeight: 1.4,
                                  minHeight: 42
                                }}
                              >
                                {p.namaPaket}
                              </h4>

                              {/* Sub Kegiatan */}
                              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
                                Sub: <strong>{p.subKegiatan || p.subBagian || '-'}</strong>
                              </div>

                              {/* Nominal Box (Full Unit Format down to Satuan) */}
                              <div
                                style={{
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: 10,
                                  padding: '12px 14px',
                                  marginBottom: 14
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                  <span style={{ fontSize: 11.5, color: '#64748b' }}>
                                    {kNilai > 0 ? 'Nilai Kontrak:' : 'Pagu Anggaran:'}
                                  </span>
                                  <span style={{ fontSize: 13.5, fontWeight: 900, color: '#0f2c59' }}>
                                    Rp {displayNominal.toLocaleString('id-ID')}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#64748b' }}>
                                  <span>Pelaksana:</span>
                                  <span style={{ fontWeight: 700, color: '#334155' }}>
                                    {pelaksana}
                                  </span>
                                </div>
                              </div>

                              {/* Progres Fisik Bar */}
                              <div style={{ marginTop: 'auto', marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                  <span style={{ color: '#64748b', fontWeight: 600 }}>Realisasi Fisik</span>
                                  <span style={{ fontWeight: 800, color: fRealisasi >= 100 ? '#15803d' : '#0284c7' }}>
                                    {fRealisasi}%
                                  </span>
                                </div>
                                <div style={{ height: 7, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                                  <div
                                    style={{
                                      width: `${Math.min(100, fRealisasi)}%`,
                                      height: '100%',
                                      background: fRealisasi >= 100 ? '#10b981' : '#0284c7',
                                      borderRadius: 9999
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Button Detail */}
                              <button
                                type="button"
                                onClick={() => setActiveProjectDetail(p)}
                                style={{
                                  width: '100%',
                                  padding: '9px',
                                  borderRadius: 8,
                                  fontSize: 12.5,
                                  fontWeight: 700,
                                  color: '#0f2c59',
                                  background: '#ffffff',
                                  border: '1.5px solid #cbd5e1',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 6
                                }}
                              >
                                <Eye size={14} />
                                <span>Lihat Rincian Publik & Foto</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 7. SECTION: GEOGRAFIS & PEMETAAN (HANYA MUNCUL JIKA TOGGLE ON DI SUPERADMIN) */}
      {systemSettings?.showPetaKoordinat === true && (
        <section id="peta" style={{ padding: '64px 24px', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7', letterSpacing: 1, textTransform: 'uppercase' }}>
              {systemSettings?.customTexts?.landing_peta_badge || DEFAULT_CUSTOM_TEXTS.landing_peta_badge}
            </span>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2c59', marginTop: 4 }}>
              {systemSettings?.customTexts?.landing_peta_title || DEFAULT_CUSTOM_TEXTS.landing_peta_title}
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748b', maxWidth: 640, margin: '6px auto 0' }}>
              {systemSettings?.customTexts?.landing_peta_desc || DEFAULT_CUSTOM_TEXTS.landing_peta_desc}
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: 14,
              padding: '14px 20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Navigation size={15} color="#0284c7" />
                <span>Filter Berdasarkan Bidang:</span>
              </span>
              <select
                className="form-control"
                value={selectedBidangPeta}
                onChange={(e) => setSelectedBidangPeta(e.target.value)}
                style={{ width: 220, height: 36, fontSize: 13, padding: '4px 10px' }}
              >
                <option value="ALL">Semua Bidang Teknis</option>
                {BIDANG_LIST.filter((b) => b.id !== 'sekretariat').map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
              Menampilkan {petaFilteredProjects.length} Lokasi Proyek
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              overflow: 'hidden'
            }}
          >
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>Nama Paket Pekerjaan</th>
                  <th style={{ width: '15%' }}>Bidang</th>
                  <th style={{ width: '18%' }}>Lokasi</th>
                  <th style={{ width: '15%' }}>Koordinat</th>
                  <th style={{ width: '14%' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {petaFilteredProjects.slice(0, 15).map((p) => {
                  const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                  const lat = p.latitude || '-6.8944';
                  const lng = p.longitude || '110.6385';

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f2c59' }}>{p.namaPaket}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Metode: {p.metodePemilihan || p.tipePengadaan}</div>
                      </td>
                      <td>
                        <span
                          className="badge badge-bidang"
                          style={{
                            background: bidang?.bgLight,
                            color: bidang?.warna,
                            whiteSpace: 'nowrap',
                            display: 'inline-flex'
                          }}
                        >
                          {bidang?.id === 'sda_bk' ? 'SDA-BK' : bidang?.singkatan}
                        </span>
                      </td>
                      <td style={{ fontSize: 12.5, color: '#475569' }}>{p.lokasiLengkap || p.kecamatan || '-'}</td>
                      <td>
                        <code style={{ fontSize: 12, color: '#0284c7', background: '#f0f9ff', padding: '3px 8px', borderRadius: 6 }}>
                          {lat}, {lng}
                        </code>
                      </td>
                      <td>
                        <a
                          href={`https://www.google.com/maps?q=${lat},${lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 11.5,
                            padding: '4px 10px'
                          }}
                        >
                          <Navigation size={12} />
                          <span>Buka Peta</span>
                          <ExternalLink size={11} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 8. PUBLIC FOOTER */}
      <footer style={{ background: '#091e3a', color: '#cbd5e1', padding: '48px 24px 32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <AppLogo
                logoUrl={systemSettings?.logoUrl}
                size={38}
                alt={systemSettings?.singkatanInstansi || 'DINPUTARU Demak'}
              />
              <span style={{ fontSize: 18, fontWeight: 900, color: '#ffffff' }}>
                {systemSettings?.namaSistem || 'SIMON - SATUPUTARU'}
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#94a3b8' }}>
              {systemSettings?.customTexts?.landing_footer_desc || systemSettings?.deskripsi || DEFAULT_CUSTOM_TEXTS.landing_footer_desc}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>Kontak & Pelayanan</h4>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: '#94a3b8' }}>
              <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{systemSettings?.instansi || 'Dinas Pekerjaan Umum dan Penataan Ruang'}</div>
              <div>{systemSettings?.alamat || 'Jl. Kyai Jebat No. 35 Bintoro Kec. Demak'}</div>
              <div>Email: {systemSettings?.email || 'dinputaru@demakkab.go.id'}</div>
              <div>Telp: {systemSettings?.telepon || '(0291) 685123'}</div>
              {systemSettings?.website && <div>Web: {systemSettings.website}</div>}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>Akses Kedinasan</h4>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14 }}>
              {systemSettings?.customTexts?.landing_footer_access_desc || DEFAULT_CUSTOM_TEXTS.landing_footer_access_desc}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          {systemSettings?.namaSistem || 'SIMON - SATUPUTARU'} • Hak Cipta © {activeYear} {systemSettings?.instansi || 'Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak'}.
        </div>
      </footer>

      {/* 9. PUBLIC PROJECT DETAIL MODAL */}
      {activeProjectDetail && (
        <div className="modal-overlay" onClick={() => setActiveProjectDetail(null)}>
          <div className="modal-dialog" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                  INFORMASI LENGKAP PEKERJAAN
                </span>
                <h3 style={{ fontSize: 17, color: '#0f2c59', marginTop: 2, lineHeight: 1.35 }}>
                  {activeProjectDetail.namaPaket}
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setActiveProjectDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Ringkasan Anggaran & Rekanan */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                  background: '#f8fafc',
                  padding: '14px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  marginBottom: 16
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>PAGU ANGGARAN:</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#0f2c59', marginTop: 2 }}>
                    Rp {(parseFloat(activeProjectDetail.paguAnggaran) || 0).toLocaleString('id-ID')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>NILAI KONTRAK:</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#16a34a', marginTop: 2 }}>
                    {activeProjectDetail.dataKontrak?.nilaiKontrak > 0
                      ? `Rp ${activeProjectDetail.dataKontrak.nilaiKontrak.toLocaleString('id-ID')}`
                      : 'Tahap Pemilihan'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>PENYEDIA / PELAKSANA:</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', marginTop: 2 }}>
                    {activeProjectDetail.dataKontrak?.namaPenyedia || '-'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>NOMOR KONTRAK:</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginTop: 2 }}>
                    {activeProjectDetail.dataKontrak?.nomorKontrak || '-'}
                  </div>
                </div>
              </div>

              {/* Status Progres Fisik & Keuangan */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 14,
                  marginBottom: 16
                }}
              >
                <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>Progres Fisik Lapangan:</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#15803d' }}>
                      {activeProjectDetail.dataFisik?.progresRealisasi || 0}%
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#475569', marginTop: 4 }}>
                    Rencana: {activeProjectDetail.dataFisik?.progresRencana || 0}% • Status: <strong>{activeProjectDetail.dataFisik?.statusDeviasi || 'Aman'}</strong>
                  </div>
                </div>

                <div style={{ background: '#eff6ff', padding: '14px', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e40af' }}>Realisasi Keuangan (SP2D):</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#1d4ed8' }}>
                      {activeProjectDetail.dataKeuangan?.persenKeuangan || 0}%
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#475569', marginTop: 4 }}>
                    Total Cair: <strong>Rp {(activeProjectDetail.dataKeuangan?.totalPencairan || 0).toLocaleString('id-ID')}</strong>
                  </div>
                </div>
              </div>

              {/* Lokasi & Koordinat */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>LOKASI & KOORDINAT PEKERJAAN:</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f2c59', marginTop: 3 }}>
                  {activeProjectDetail.lokasiLengkap || activeProjectDetail.lokasi || `${activeProjectDetail.desa || 'Demak'}, Kec. ${activeProjectDetail.kecamatan || 'Demak'}`}
                </div>
                {(activeProjectDetail.latitude || activeProjectDetail.koordinat?.lat) && (
                  <div style={{ marginTop: 8 }}>
                    <a
                      href={`https://www.google.com/maps?q=${activeProjectDetail.latitude || activeProjectDetail.koordinat?.lat},${activeProjectDetail.longitude || activeProjectDetail.koordinat?.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <Navigation size={12} color="#0284c7" />
                      <span>
                        Titik Koordinat: {activeProjectDetail.latitude || activeProjectDetail.koordinat?.lat}, {activeProjectDetail.longitude || activeProjectDetail.koordinat?.lng}
                      </span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>

              {/* Foto Dokumentasi Lapangan */}
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59', marginBottom: 10 }}>
                  Dokumentasi Foto Lapangan (0%, 50%, 100%):
                </h4>
                {(!activeProjectDetail.dataFisik?.fotoDokumentasi || activeProjectDetail.dataFisik.fotoDokumentasi.length === 0) ? (
                  <div style={{ padding: '18px', textAlign: 'center', background: '#f8fafc', borderRadius: 10, color: '#94a3b8', fontSize: 12.5 }}>
                    Belum ada foto dokumentasi lapangan yang dipublikasikan.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                    {activeProjectDetail.dataFisik.fotoDokumentasi.map((foto, idx) => (
                      <div key={idx} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff' }}>
                        <img src={foto.url} alt={foto.label} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                        <div style={{ padding: '6px 8px' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, background: '#0f2c59', color: '#fff', padding: '1px 5px', borderRadius: 3 }}>
                            {foto.tahap}
                          </span>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', marginTop: 3 }}>{foto.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setActiveProjectDetail(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingView;
