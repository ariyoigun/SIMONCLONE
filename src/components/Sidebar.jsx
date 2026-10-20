import React from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, ROLE_DEFINITIONS } from '../data/constants';
import {
  LayoutDashboard,
  Clock,
  TrendingUp,
  DollarSign,
  ReceiptText,
  Printer,
  Users,
  Calendar,
  Sliders,
  Layers,
  ChevronRight,
  ShieldAlert,
  Building2,
  LogOut,
  Globe,
  Database
} from 'lucide-react';

const Sidebar = ({
  onOpenYearModal,
  onOpenUserModal,
  onOpenRoleModal,
  onOpenSettingsModal,
  onOpenPublicPortal
}) => {
  const {
    activeTab,
    setActiveTab,
    accessibleProjects,
    activeYear,
    currentUser,
    systemSettings,
    canManageUsers,
    canManageYears,
    canManageSettings,
    canAccessSPJMenu,
    logout
  } = useApp();

  const roleDef = ROLE_DEFINITIONS[currentUser?.role] || {};
  const bidang = BIDANG_LIST.find((b) => b.id === currentUser?.bidangId);

  // Count projects
  const countTotal = accessibleProjects.length;
  const countPreContract = accessibleProjects.filter((p) => !p.isKontrak).length;
  const countFisik = accessibleProjects.filter((p) => p.isKontrak).length;
  const countSpjActive = accessibleProjects.filter(
    (p) => p.administrasiSPJ?.status && p.administrasiSPJ?.status !== 'Belum Mengajukan SPJ'
  ).length;

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        {systemSettings?.logoUrl ? (
          <img
            src={systemSettings.logoUrl}
            alt="Logo"
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain', background: '#fff', border: '1px solid #cbd5e1' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="sidebar-logo-icon">PU</div>
        )}
        <div className="sidebar-brand-text">
          <h2>{systemSettings?.namaSistem || 'SIMON - SATUPUTARU'}</h2>
          <p>{systemSettings?.singkatanInstansi || 'DINPUTARU Demak'}</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Ringkasan Eksekutif</div>

        <a
          href="#dashboard"
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dashboard');
          }}
        >
          <LayoutDashboard className="icon" />
          <span>Dashboard Eksekutif</span>
        </a>

        {/* Master Data Section */}
        <div className="nav-section-title">Data Pokok & Master</div>

        <a
          href="#master_pekerjaan"
          className={`nav-item ${activeTab === 'master_pekerjaan' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('master_pekerjaan');
          }}
          style={{
            background: activeTab === 'master_pekerjaan' ? 'rgba(37, 99, 235, 0.15)' : undefined,
            fontWeight: activeTab === 'master_pekerjaan' ? 800 : undefined
          }}
        >
          <Database className="icon" style={{ color: '#0284c7' }} />
          <span>Master Data Pekerjaan</span>
          <span className="nav-badge-count" style={{ background: '#0284c7', color: '#fff' }}>
            {countTotal}
          </span>
        </a>

        <div className="nav-section-title">Modul Monitoring Progres</div>

        <a
          href="#prakontrak"
          className={`nav-item ${activeTab === 'prakontrak' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('prakontrak');
          }}
        >
          <Clock className="icon" />
          <span>1. Pekerjaan Pra-Kontrak</span>
          {countPreContract > 0 && (
            <span
              className="nav-badge-count"
              style={{ background: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}
            >
              {countPreContract}
            </span>
          )}
        </a>

        <a
          href="#fisik"
          className={`nav-item ${activeTab === 'fisik' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('fisik');
          }}
        >
          <TrendingUp className="icon" />
          <span>2. Progres Fisik (0-100%)</span>
          <span className="nav-badge-count">{countFisik}</span>
        </a>

        <a
          href="#keuangan"
          className={`nav-item ${activeTab === 'keuangan' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('keuangan');
          }}
        >
          <DollarSign className="icon" />
          <span>3. Progres Keuangan (SP2D)</span>
          <span className="nav-badge-count">{countFisik}</span>
        </a>

        {canAccessSPJMenu && (
          <a
            href="#spj_keuangan"
            className={`nav-item ${activeTab === 'spj_keuangan' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('spj_keuangan');
            }}
          >
            <ReceiptText className="icon" />
            <span>4. Administrasi SPJ Keuangan</span>
            <span
              className="nav-badge-count"
              style={{ background: 'rgba(168, 85, 247, 0.25)', color: '#c084fc' }}
            >
              {countSpjActive}
            </span>
          </a>
        )}

        <div className="nav-section-title">Laporan & Evaluasi</div>

        <a
          href="#laporan"
          className={`nav-item ${activeTab === 'laporan' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('laporan');
          }}
        >
          <Printer className="icon" />
          <span>Rekapitulasi & Cetak</span>
        </a>

        {/* Public Portal Quick Access */}
        {onOpenPublicPortal && (
          <>
            <div className="nav-section-title">Keterbukaan Informasi</div>
            <button
              type="button"
              className="nav-item"
              style={{ width: '100%', textAlign: 'left', background: 'none' }}
              onClick={onOpenPublicPortal}
              title="Lihat Tampilan Beranda Publik untuk Masyarakat"
            >
              <Globe className="icon" style={{ color: '#0284c7' }} />
              <span>Beranda Publik</span>
              <span className="nav-badge-count" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                Publik
              </span>
            </button>
          </>
        )}

        {/* Superadmin Settings Section */}
        {canManageUsers && (
          <>
            <div className="nav-section-title">Administrasi Sistem</div>

            <button
              type="button"
              className="nav-item"
              style={{ width: '100%', textAlign: 'left', background: 'none' }}
              onClick={onOpenSettingsModal}
            >
              <Sliders className="icon" />
              <span>Pengaturan Keberlanjutan</span>
            </button>

            <button
              type="button"
              className="nav-item"
              style={{ width: '100%', textAlign: 'left', background: 'none' }}
              onClick={onOpenUserModal}
            >
              <Users className="icon" />
              <span>Manajemen Akun User</span>
            </button>

            <button
              type="button"
              className="nav-item"
              style={{ width: '100%', textAlign: 'left', background: 'none' }}
              onClick={onOpenYearModal}
            >
              <Calendar className="icon" />
              <span>Kelola Tahun Anggaran</span>
            </button>
          </>
        )}
      </nav>

      {/* Sidebar Footer Role & Scope Indicator */}
      <div className="sidebar-footer">
        <div className="sidebar-role-indicator">
          <div className="role-title">
            <span>{roleDef.nama}</span>
            <span
              style={{
                fontSize: 10,
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: 4
              }}
            >
              TA {activeYear}
            </span>
          </div>
          <div className="role-desc">
            {roleDef.canSeeAllBidang
              ? 'Wewenang: Melihat pekerjaan SEMUA BIDANG (Dinas).'
              : `Wewenang: Terbatas hanya untuk ${bidang?.nama || 'bidang terkait'}.`}
          </div>
          <button
            type="button"
            onClick={onOpenRoleModal}
            style={{
              marginTop: 8,
              width: '100%',
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: '#f59e0b',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4
            }}
          >
            <span>Simulasi Peran Lain</span>
            <ChevronRight size={13} />
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Keluar dari akun ${currentUser.nama}?`)) {
                logout();
              }
            }}
            style={{
              marginTop: 6,
              width: '100%',
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 600,
              color: '#fca5a5',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
            title="Keluar dari akun"
          >
            <LogOut size={12} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
