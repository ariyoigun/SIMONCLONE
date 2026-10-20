import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST } from '../data/constants';
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
  X
} from 'lucide-react';

const LandingView = ({ onGoToLogin, onBackToInternal }) => {
  const { projects = [], activeYear, isLoggedIn, currentUser, systemSettings } = useApp();

  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectDetail, setActiveProjectDetail] = useState(null);

  // Gallery Filter & Modal State
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('SEMUA');
  const [activeGalleryModal, setActiveGalleryModal] = useState(null);

  const galleryList = useMemo(() => systemSettings?.galeri || [], [systemSettings?.galeri]);
  const filteredGallery = useMemo(() => {
    if (selectedGalleryCategory === 'SEMUA') return galleryList;
    return galleryList.filter((item) => item.kategori === selectedGalleryCategory);
  }, [galleryList, selectedGalleryCategory]);

  // Filter projects that are marked as public highlight (or fallback to active projects if none marked)
  const highlightedProjects = useMemo(() => {
    const list = projects.filter((p) => p.isPublicHighlight !== false);
    return list.length > 0 ? list : projects;
  }, [projects]);

  // Filter based on selected tab and search
  const filteredProjects = useMemo(() => {
    return highlightedProjects.filter((p) => {
      if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.namaPaket?.toLowerCase().includes(q);
        const matchLoc = p.lokasi?.toLowerCase().includes(q);
        const matchSub = p.subBagian?.toLowerCase().includes(q);
        const matchKec = p.kecamatan?.toLowerCase().includes(q);
        const matchDesa = p.desa?.toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchSub && !matchKec && !matchDesa) return false;
      }
      return true;
    });
  }, [highlightedProjects, selectedBidang, searchQuery]);

  // Max Public Highlights (bisa diatur di panel Super Admin, default 10)
  const maxHighlights =
    systemSettings?.maxPublicHighlights !== undefined ? parseInt(systemSettings.maxPublicHighlights, 10) : 10;

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, maxHighlights);
  }, [filteredProjects, maxHighlights]);

  // Aggregate Public Stats (No financial data!)
  const totalCount = projects.length;
  const contractedCount = projects.filter((p) => p.isKontrak).length;
  const completedCount = projects.filter((p) => (p.dataFisik?.progresRealisasi || 0) >= 100).length;
  const avgPhysical =
    contractedCount > 0
      ? (
          projects
            .filter((p) => p.isKontrak)
            .reduce((sum, p) => sum + (parseFloat(p.dataFisik?.progresRealisasi) || 0), 0) /
          contractedCount
        ).toFixed(1)
      : '0.0';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'inherit' }}>
      {/* 1. TOP PUBLIC NAVBAR */}
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
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {systemSettings?.logoUrl ? (
              <img
                src={systemSettings.logoUrl}
                alt="Logo Dinas"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  objectFit: 'contain',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#071527',
                  boxShadow: '0 4px 10px rgba(245, 158, 11, 0.35)'
                }}
              >
                PU
              </div>
            )}
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

          {/* Nav Links & Login Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 13, fontWeight: 600, color: '#475569' }} className="landing-desktop-nav">
              <a href="#sorotan" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.target.style.color = '#0284c7')} onMouseLeave={(e) => (e.target.style.color = 'inherit')}>
                Pekerjaan Sorotan
              </a>
              <a href="#galeri" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.target.style.color = '#0284c7')} onMouseLeave={(e) => (e.target.style.color = 'inherit')}>
                🏛️ Galeri Bangunan DINPUTARU
              </a>
              <a href="#tentang" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.target.style.color = '#0284c7')} onMouseLeave={(e) => (e.target.style.color = 'inherit')}>
                Bidang Layanan
              </a>
              <a href="#peta" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.target.style.color = '#0284c7')} onMouseLeave={(e) => (e.target.style.color = 'inherit')}>
                Peta Koordinat
              </a>
            </nav>

            {/* Login Internal / Return to Dashboard Button */}
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
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 8
                }}
              >
                <LogIn size={15} />
                <span>Login Internal Pegawai</span>
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
          padding: '64px 24px 80px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow ambient background */}
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
          <div style={{ maxWidth: 780 }}>
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
              <span>Transparansi Pembangunan Infrastruktur Daerah</span>
            </div>

            <h1
              style={{
                fontSize: 38,
                fontWeight: 900,
                lineHeight: 1.25,
                margin: '0 0 16px',
                letterSpacing: -0.5
              }}
            >
              Portal Pemantauan Progres Pekerjaan <br />
              <span style={{ color: '#38bdf8' }}>{systemSettings?.instansi || 'Dinas Pekerjaan Umum & Tata Ruang Kab. Demak'}</span>
            </h1>

            <p style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 28, maxWidth: 680 }}>
              {systemSettings?.deskripsi || 'Sistem resmi keterbukaan informasi publik untuk memantau kemajuan fisik, lokasi koordinat, dan tahapan pekerjaan infrastruktur jalan, jembatan, gedung, irigasi, dan penataan ruang secara akuntabel.'}
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a
                href="#sorotan"
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#071527',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 14,
                  padding: '12px 24px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>Jelajahi Proyek Sorotan</span>
                <ArrowRight size={16} />
              </a>

              <button
                type="button"
                onClick={isLoggedIn ? (onBackToInternal || onGoToLogin) : onGoToLogin}
                className="btn btn-outline"
                style={{
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.06)',
                  fontSize: 14,
                  fontWeight: 700,
                  padding: '12px 22px',
                  borderRadius: 10,
                  backdropFilter: 'blur(8px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {isLoggedIn ? (
                  <>
                    <LayoutDashboard size={15} />
                    <span>Masuk ke Panel Internal</span>
                  </>
                ) : (
                  <span>Akses Pegawai DINPUTARU</span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Statistics Counter Banner */}
          <div
            style={{
              marginTop: 48,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 16,
              padding: '20px 24px',
              backdropFilter: 'blur(10px)'
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
              <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>RATA-RATA FISIK TERLAKSANA</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#4ade80', marginTop: 4 }}>
                {avgPhysical}%
              </div>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>Realisasi di lapangan</div>
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

      {/* 3. SECTION: 4 BIDANG UTAMA PELAYANAN */}
      <section id="tentang" style={{ padding: '64px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7', letterSpacing: 1, textTransform: 'uppercase' }}>
            BIDANG PELAYANAN INFRASTRUKTUR
          </span>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2c59', marginTop: 6 }}>
            Pembangunan Berkelanjutan di 4 Bidang Teknis
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 640, margin: '8px auto 0' }}>
            Setiap bidang di Dinas Pekerjaan Umum dan Penataan Ruang bertanggung jawab dalam memastikan kualitas dan ketepatan waktu proyek strategis daerah.
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
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: b.bgLight,
                  color: b.warna,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  marginBottom: 16
                }}
              >
                {b.singkatan}
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f2c59', marginBottom: 8 }}>
                {b.nama}
              </h3>

              <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5, flex: 1 }}>
                {b.id === 'bina_marga' && 'Pembangunan jalan kabupaten, rekonstruksi ruas poros, pemeliharaan jembatan, dan konektivitas transportasi.'}
                {b.id === 'cipta_karya' && 'Pembangunan gedung workshop & kantor pelayanan, sanitasi masyarakat, serta penyediaan sarana air minum pedesaan.'}
                {b.id === 'sda_bk' && 'Normalisasi sungai, rehabilitasi jaringan irigasi bendung, pencegahan banjir, dan pembinaan tenaga konstruksi.'}
                {b.id === 'tata_ruang' && 'Perencanaan tata ruang wilayah (RTRW/RDTR), kesesuaian kegiatan pemanfaatan ruang, dan tertib administrasi pertanahan.'}
              </p>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#64748b' }}>
                  {projects.filter((p) => p.bidangId === b.id).length} Paket Terdaftar
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBidang(b.id);
                    document.getElementById('sorotan')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: b.warna,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Lihat Proyek →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: GALERI BANGUNAN & INFRASTRUKTUR DINPUTARU KABUPATEN DEMAK */}
      <section id="galeri" style={{ padding: '72px 24px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: 1 }}>
              <Building2 size={15} color="#0284c7" />
              <span>DOKUMENTASI INFRASTRUKTUR KABUPATEN DEMAK</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f2c59', marginTop: 6 }}>
              Galeri Bangunan & Infrastruktur DINPUTARU
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 680, margin: '8px auto 0' }}>
              Dokumentasi pembangunan gedung kantor dinas, workshop teknis, jalan poros antar-kecamatan, jembatan, sarana air minum, dan tanggul pengendali banjir di Kabupaten Demak.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {['SEMUA', 'Gedung Kantor', 'Bina Marga', 'Cipta Karya', 'Sumber Daya Air', 'Tata Ruang'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedGalleryCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 9999,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: selectedGalleryCategory === cat ? '1px solid #0f2c59' : '1px solid #e2e8f0',
                  background: selectedGalleryCategory === cat ? '#0f2c59' : '#f8fafc',
                  color: selectedGalleryCategory === cat ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat === 'SEMUA' ? `Semua Galeri (${galleryList.length})` : cat}
              </button>
            ))}
          </div>

          {/* Gallery Cards Grid */}
          {filteredGallery.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', background: '#f8fafc', borderRadius: 16 }}>
              Belum ada foto pada kategori ini.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveGalleryModal(item)}
                  style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.04)';
                  }}
                >
                  <div style={{ height: 180, position: 'relative', overflow: 'hidden', background: '#e2e8f0' }}>
                    <img
                      src={item.url}
                      alt={item.judul}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        padding: '3px 10px',
                        borderRadius: 6,
                        background: 'rgba(15, 44, 89, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        fontSize: 10.5,
                        fontWeight: 800
                      }}
                    >
                      {item.kategori}
                    </div>
                    {item.tahun && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(245, 158, 11, 0.9)',
                          color: '#071527',
                          fontSize: 10.5,
                          fontWeight: 800
                        }}
                      >
                        TA {item.tahun}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f2c59', marginBottom: 6, lineHeight: 1.35 }}>
                      {item.judul}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#0284c7', marginBottom: 8, fontWeight: 600 }}>
                      <MapPin size={13} />
                      <span>{item.lokasi || 'Kabupaten Demak'}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, margin: 0, flex: 1 }}>
                      {item.deskripsi}
                    </p>
                    <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>DINPUTARU Demak</span>
                      <span style={{ fontSize: 11.5, color: '#0284c7', fontWeight: 700 }}>
                        Perbesar Foto ↗
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. SECTION: PEKERJAAN SOROTAN TIAP BIDANG (PUBLIC HIGHLIGHTS) */}
      <section id="sorotan" style={{ padding: '64px 24px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: 1 }}>
                <Sparkles size={14} color="#f59e0b" />
                <span>SOROTAN PUBLIK DINPUTARU</span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2c59', marginTop: 4 }}>
                Pekerjaan Unggulan & Progres Terkini
              </h2>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: '4px 0 0' }}>
                Daftar pekerjaan yang dipublikasikan secara terbuka untuk pengawasan partisipatif masyarakat (Maksimal {maxHighlights} paket sorotan)
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

          {/* Bidang Tabs Filter */}
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
              Semua Bidang ({highlightedProjects.length})
            </button>

            {BIDANG_LIST.filter((b) => b.id !== 'sekretariat').map((b) => {
              const count = highlightedProjects.filter((p) => p.bidangId === b.id).length;
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
                  {b.singkatan} ({count})
                </button>
              );
            })}
          </div>

          {/* Project Cards Grid (NO FINANCIAL DATA!) */}
          {displayedProjects.length === 0 ? (
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
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f2c59' }}>Tidak ada pekerjaan yang cocok</h4>
              <p style={{ fontSize: 13, marginTop: 4 }}>Coba ubah kata kunci pencarian atau pilih kategori bidang lainnya.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
              {displayedProjects.map((p) => {
                const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                const dataFisik = p.dataFisik || {};
                const fRealisasi = parseFloat(dataFisik.progresRealisasi || 0);
                const fRencana = parseFloat(dataFisik.progresRencana || 0);
                const deviasi = parseFloat(dataFisik.deviasiFisik || 0);

                // Thumbnail photo (0%, 50%, 100%)
                const heroPhoto =
                  dataFisik.fotoDokumentasi && dataFisik.fotoDokumentasi.length > 0
                    ? dataFisik.fotoDokumentasi[dataFisik.fotoDokumentasi.length - 1].url
                    : null;

                // Coordinates
                const lat = p.latitude || p.koordinat?.lat;
                const lng = p.longitude || p.koordinat?.lng;
                const hasCoordinates = lat && lng;

                return (
                  <div
                    key={p.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: 16,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 44, 89, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                    }}
                  >
                    {/* Project Photo / Image Banner */}
                    <div
                      style={{
                        height: 160,
                        background: heroPhoto
                          ? `url(${heroPhoto}) center/cover no-repeat`
                          : 'linear-gradient(135deg, #0f2c59, #1e3a8a)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        padding: '12px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(0, 0, 0, 0.65)',
                          color: '#ffffff',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        {bidang?.singkatan || 'Dinas'}
                      </span>

                      {/* Status Pengadaan / Fisik Badge */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 9999,
                          background: p.isKontrak
                            ? fRealisasi >= 100
                              ? '#dcfce7'
                              : '#eff6ff'
                            : '#fef3c7',
                          color: p.isKontrak
                            ? fRealisasi >= 100
                              ? '#15803d'
                              : '#1d4ed8'
                            : '#b45309'
                        }}
                      >
                        {p.isKontrak
                          ? fRealisasi >= 100
                            ? 'Selesai 100%'
                            : 'Pelaksanaan Fisik'
                          : 'Tahap Pemilihan'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f2c59', marginBottom: 8, lineHeight: 1.4 }}>
                        {p.namaPaket}
                      </h3>

                      {/* Lokasi & Koordinat */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                        <MapPin size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{p.lokasi || 'Lokasi pekerjaan dalam perencanaan'}</span>
                      </div>

                      {/* Coordinates pill */}
                      {hasCoordinates && (
                        <div style={{ marginBottom: 14 }}>
                          <a
                            href={`https://www.google.com/maps?q=${lat},${lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              color: '#0284c7',
                              background: '#f0f9ff',
                              border: '1px solid #bae6fd',
                              padding: '3px 8px',
                              borderRadius: 6,
                              textDecoration: 'none'
                            }}
                          >
                            <Navigation size={11} />
                            <span>Titik: {lat}, {lng} (Buka Peta)</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      )}

                      {/* Progres Fisik Section */}
                      <div
                        style={{
                          background: '#f8fafc',
                          padding: '12px 14px',
                          borderRadius: 10,
                          border: '1px solid #e2e8f0',
                          marginTop: 'auto',
                          marginBottom: 16
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f2c59' }}>
                            Capaian Fisik Lapangan:
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 900, color: fRealisasi >= 100 ? '#15803d' : '#0284c7' }}>
                            {fRealisasi}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(100, fRealisasi)}%`,
                              height: '100%',
                              background:
                                fRealisasi >= 100
                                  ? 'linear-gradient(90deg, #10b981, #059669)'
                                  : 'linear-gradient(90deg, #38bdf8, #0284c7)',
                              borderRadius: 9999
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginTop: 6 }}>
                          <span>Target Rencana: {fRencana}%</span>
                          <span style={{ fontWeight: 600, color: deviasi < 0 ? '#b91c1c' : '#15803d' }}>
                            Deviasi: {deviasi >= 0 ? `+${deviasi}%` : `${deviasi}%`}
                          </span>
                        </div>
                      </div>

                      {/* Detail CTA Button */}
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
          )}
        </div>
      </section>

      {/* 5. SECTION: PETA SEBARAN KOORDINAT PEKERJAAN */}
      <section id="peta" style={{ padding: '64px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#0284c7', letterSpacing: 1, textTransform: 'uppercase' }}>
            GEOGRAFIS & PEMETAAN
          </span>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2c59', marginTop: 4 }}>
            Peta Titik Koordinat Pekerjaan
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748b', maxWidth: 640, margin: '6px auto 0' }}>
            Masyarakat dapat memverifikasi langsung lokasi fisik pekerjaan di lapangan melalui integrasi koordinat latitude dan longitude.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}
        >
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Paket Pekerjaan</th>
                  <th>Bidang</th>
                  <th>Lokasi</th>
                  <th>Titik Koordinat (Lat, Lng)</th>
                  <th>Progres Fisik</th>
                  <th>Aksi Peta</th>
                </tr>
              </thead>
              <tbody>
                {highlightedProjects.map((p) => {
                  const bidang = BIDANG_LIST.find((b) => b.id === p.bidangId);
                  const lat = p.latitude || p.koordinat?.lat || '-6.9923';
                  const lng = p.longitude || p.koordinat?.lng || '110.4285';
                  const fRealisasi = p.dataFisik?.progresRealisasi || 0;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f2c59' }}>{p.namaPaket}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Metode: {p.tipePengadaan}</div>
                      </td>
                      <td>
                        <span className="badge badge-bidang" style={{ background: bidang?.bgLight, color: bidang?.warna }}>
                          {bidang?.singkatan}
                        </span>
                      </td>
                      <td style={{ fontSize: 12.5, color: '#475569' }}>{p.lokasi || '-'}</td>
                      <td>
                        <code style={{ fontSize: 12, color: '#0284c7', background: '#f0f9ff', padding: '3px 8px', borderRadius: 6 }}>
                          {lat}, {lng}
                        </code>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: fRealisasi >= 100 ? '#15803d' : '#0284c7' }}>
                          {fRealisasi}%
                        </span>
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
        </div>
      </section>

      {/* 6. PUBLIC FOOTER */}
      <footer style={{ background: '#091e3a', color: '#cbd5e1', padding: '48px 24px 32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              {systemSettings?.logoUrl ? (
                <img
                  src={systemSettings.logoUrl}
                  alt="Logo Dinas"
                  style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'contain', background: '#fff' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 900,
                    color: '#071527'
                  }}
                >
                  PU
                </div>
              )}
              <span style={{ fontSize: 18, fontWeight: 900, color: '#ffffff' }}>
                {systemSettings?.namaSistem || 'SIMON - SATUPUTARU'}
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#94a3b8' }}>
              {systemSettings?.deskripsi || 'Sistem Informasi Monitoring Pekerjaan Dinas Pekerjaan Umum dan Penataan Ruang. Menyajikan data progres fisik dan status pengadaan infrastruktur daerah secara terbuka dan bertanggung jawab.'}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>Kontak & Pelayanan</h4>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: '#94a3b8' }}>
              <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{systemSettings?.instansi || 'Dinas Pekerjaan Umum dan Penataan Ruang'}</div>
              <div>{systemSettings?.alamat || 'Jl. Kyai Singkil No. 7, Bintoro, Kec. Demak'}</div>
              <div>Email: {systemSettings?.email || 'dinputaru@demakkab.go.id'}</div>
              <div>Telp: {systemSettings?.telepon || '(0291) 685123'}</div>
              {systemSettings?.website && <div>Web: {systemSettings.website}</div>}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>Akses Terbatas</h4>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 14 }}>
              Panel khusus bagi ASN, Pejabat Pembuat Komitmen (PPK), PPTK, dan Tim Verifikator Keuangan.
            </p>
            <button
              type="button"
              onClick={isLoggedIn ? (onBackToInternal || onGoToLogin) : onGoToLogin}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}
            >
              {isLoggedIn ? (
                <>
                  <LayoutDashboard size={15} />
                  <span>Buka Panel Internal</span>
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Login Internal Pegawai</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          {systemSettings?.namaSistem || 'SIMON - SATUPUTARU'} • Hak Cipta © {activeYear} {systemSettings?.instansi || 'Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak'}.
        </div>
      </footer>

      {/* MODAL PREVIEW GALERI FOTO */}
      {activeGalleryModal && (
        <div className="modal-overlay" onClick={() => setActiveGalleryModal(null)} style={{ zIndex: 100 }}>
          <div className="modal-dialog" style={{ maxWidth: 720, padding: 0, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative', maxHeight: '60vh', overflow: 'hidden', background: '#000' }}>
              <img
                src={activeGalleryModal.url}
                alt={activeGalleryModal.judul}
                style={{ width: '100%', height: '100%', maxHeight: '60vh', objectFit: 'contain' }}
              />
              <button
                className="btn-icon"
                onClick={() => setActiveGalleryModal(null)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ padding: '2px 8px', borderRadius: 4, background: '#eff6ff', color: '#1d4ed8', fontSize: 11, fontWeight: 800 }}>
                  {activeGalleryModal.kategori}
                </span>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Tahun Anggaran {activeGalleryModal.tahun || activeYear}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f2c59', marginBottom: 8 }}>
                {activeGalleryModal.judul}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#0284c7', marginBottom: 12, fontWeight: 600 }}>
                <MapPin size={14} />
                <span>{activeGalleryModal.lokasi || 'Kabupaten Demak'}</span>
              </div>
              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {activeGalleryModal.deskripsi}
              </p>
              <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setActiveGalleryModal(null)}>
                  Tutup Galeri
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. PUBLIC PROJECT DETAIL MODAL (NO FINANCIAL DATA!) */}
      {activeProjectDetail && (
        <div className="modal-overlay" onClick={() => setActiveProjectDetail(null)}>
          <div className="modal-dialog" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0284c7' }}>INFORMASI PEKERJAAN PUBLIK</span>
                <h3 style={{ fontSize: 17, color: '#0f2c59', marginTop: 2 }}>{activeProjectDetail.namaPaket}</h3>
              </div>
              <button className="btn-icon" onClick={() => setActiveProjectDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Lokasi & Koordinat */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>LOKASI & KOORDINAT PEKERJAAN:</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f2c59', marginTop: 3 }}>
                  {activeProjectDetail.lokasi || '-'}
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

              {/* Status Progres Fisik */}
              <div style={{ background: '#f0fdf4', padding: '14px 16px', borderRadius: 10, border: '1px solid #bbf7d0', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>Realisasi Progres Fisik Terkini:</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#15803d' }}>
                    {activeProjectDetail.dataFisik?.progresRealisasi || 0}%
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>
                  Target Rencana: {activeProjectDetail.dataFisik?.progresRencana || 0}% • Status: <strong>{activeProjectDetail.dataFisik?.statusDeviasi || 'Aman'}</strong>
                </div>
                {activeProjectDetail.dataFisik?.kendalaLapangan && (
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 8, fontStyle: 'italic' }}>
                    Catatan: "{activeProjectDetail.dataFisik.kendalaLapangan}"
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
