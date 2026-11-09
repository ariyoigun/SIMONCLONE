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
  Database,
  FileSpreadsheet,
  FolderTree,
  Coins
} from 'lucide-react';
import { getLatestProjectUpdateFormatted } from '../utils/dateUtils';
import AppLogo from './AppLogo';

const Sidebar = ({
  onOpenYearModal,
  onOpenUserModal,
  onOpenRoleModal,
  onOpenSettingsModal,
  onOpenPublicPortal,
  onOpenImportExportModal
}) => {
  const {
    activeTab,
    setActiveTab,
    accessibleProjects,
    paketPekerjaanList = [],
    activeYear,
    currentUser,
    systemSettings,
    canManageUsers,
    canManageYears,
    canManageSettings,
    canAccessSPJMenu,
    hasMenuAccess,
    pendapatanTransactions = [],
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

  const latestUpdateFormatted = getLatestProjectUpdateFormatted(accessibleProjects, activeYear);

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <AppLogo
          logoUrl={systemSettings?.logoUrl}
          size={36}
          alt={systemSettings?.singkatanInstansi || 'DINPUTARU Demak'}
        />
        <div className="sidebar-brand-text">
          <h2>{systemSettings?.namaSistem || 'SIMON - SATU PUTARU'}</h2>
          <p>{systemSettings?.singkatanInstansi || 'DINPUTARU Demak'}</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {hasMenuAccess('dashboard') && (
          <>
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
          </>
        )}

        {/* Master Data Section */}
        {(hasMenuAccess('master_pekerjaan') || hasMenuAccess('master_paket')) && (
          <>
            <div className="nav-section-title">Data Pokok & Master</div>

            {hasMenuAccess('master_pekerjaan') && (
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
            )}

            {hasMenuAccess('master_paket') && (
              <a
                href="#master_paket"
                className={`nav-item ${activeTab === 'master_paket' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('master_paket');
                }}
                style={{
                  background: activeTab === 'master_paket' ? 'rgba(217, 119, 6, 0.15)' : undefined,
                  fontWeight: activeTab === 'master_paket' ? 800 : undefined
                }}
              >
                <FolderTree className="icon" style={{ color: '#d97706' }} />
                <span>Master Data Paket Pekerjaan</span>
                <span className="nav-badge-count" style={{ background: '#d97706', color: '#fff' }}>
                  {paketPekerjaanList.length || 478}
                </span>
              </a>
            )}

            {onOpenImportExportModal && (
              <button
                type="button"
                className="nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenImportExportModal('import');
                }}
                style={{
                  paddingLeft: 36,
                  fontSize: 12,
                  color: '#94a3b8',
                  border: 'none',
                  background: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                title="Import data dari file Excel / CSV atau Export data paket"
              >
                <FileSpreadsheet className="icon" size={14} style={{ color: '#10b981' }} />
                <span>Import / Export Excel</span>
              </button>
            )}
          </>
        )}

        {(hasMenuAccess('monitoring_paket') ||
          hasMenuAccess('prakontrak') ||
          hasMenuAccess('fisik') ||
          hasMenuAccess('keuangan') ||
          hasMenuAccess('spj_keuangan') ||
          hasMenuAccess('sipd_summary') ||
          hasMenuAccess('pendapatan')) && (
          <div className="nav-section-title">Modul Monitoring Progres</div>
        )}

        {hasMenuAccess('monitoring_paket') && (
          <a
            href="#monitoring_paket"
            className={`nav-item ${activeTab === 'monitoring_paket' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('monitoring_paket');
            }}
            style={{
              background: activeTab === 'monitoring_paket' ? 'rgba(16, 185, 129, 0.15)' : undefined,
              fontWeight: activeTab === 'monitoring_paket' ? 800 : undefined
            }}
          >
            <Layers className="icon" style={{ color: '#10b981' }} />
            <span>Monitoring Paket Pekerjaan</span>
            <span
              className="nav-badge-count"
              style={{ background: '#10b981', color: '#fff' }}
            >
              {paketPekerjaanList.length || 478}
            </span>
          </a>
        )}

        {hasMenuAccess('prakontrak') && (
          <a
            href="#prakontrak"
            className={`nav-item ${activeTab === 'prakontrak' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('prakontrak');
            }}
          >
            <Clock className="icon" />
            <span>Pekerjaan Pra-Kontrak</span>
            {countPreContract > 0 && (
              <span
                className="nav-badge-count"
                style={{ background: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}
              >
                {countPreContract}
              </span>
            )}
          </a>
        )}

        {hasMenuAccess('fisik') && (
          <a
            href="#fisik"
            className={`nav-item ${activeTab === 'fisik' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('fisik');
            }}
          >
            <TrendingUp className="icon" />
            <span>Progres Fisik</span>
            <span className="nav-badge-count">{countFisik}</span>
          </a>
        )}

        {hasMenuAccess('keuangan') && (
          <a
            href="#keuangan"
            className={`nav-item ${activeTab === 'keuangan' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('keuangan');
            }}
          >
            <DollarSign className="icon" />
            <span>Progres Keuangan</span>
            <span className="nav-badge-count">{countFisik}</span>
          </a>
        )}

        {hasMenuAccess('spj_keuangan') && canAccessSPJMenu && (
          <a
            href="#spj_keuangan"
            className={`nav-item ${activeTab === 'spj_keuangan' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('spj_keuangan');
            }}
          >
            <ReceiptText className="icon" />
            <span>Administrasi SPJ Keuangan</span>
            <span
              className="nav-badge-count"
              style={{ background: 'rgba(168, 85, 247, 0.25)', color: '#c084fc' }}
            >
              {countSpjActive}
            </span>
          </a>
        )}

        {hasMenuAccess('sipd_summary') && (
          <a
            href="#sipd_summary"
            className={`nav-item ${activeTab === 'sipd_summary' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('sipd_summary');
            }}
            title="Ringkasan Hierarki SIPD: Program, Kegiatan, Sub Kegiatan, dan Paket Pekerjaan"
          >
            <FolderTree className="icon" style={{ color: '#0284c7' }} />
            <span>Ringkasan SIPD</span>
            <span
              className="nav-badge-count"
              style={{
                background: activeTab === 'sipd_summary' ? '#0284c7' : 'rgba(2, 132, 199, 0.15)',
                color: activeTab === 'sipd_summary' ? '#ffffff' : '#0284c7'
              }}
            >
              Tree
            </span>
          </a>
        )}

        {/* Menu ke-6: Monitoring Pendapatan Daerah */}
        {hasMenuAccess('pendapatan') && (
          <a
            href="#pendapatan"
            className={`nav-item ${activeTab === 'pendapatan' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('pendapatan');
            }}
            title="Monitoring Target & Realisasi Penerimaan Retribusi Daerah DINPUTARU (Setor Tinja, PBG, SLF, Sewa Alat Berat, Sewa Cor Drill)"
            style={{
              background: activeTab === 'pendapatan' ? 'rgba(13, 148, 136, 0.18)' : undefined,
              fontWeight: activeTab === 'pendapatan' ? 800 : undefined
            }}
          >
            <Coins className="icon" style={{ color: '#0d9488' }} />
            <span>Monitoring Pendapatan</span>
            <span
              className="nav-badge-count"
              style={{
                background: activeTab === 'pendapatan' ? '#0d9488' : 'rgba(13, 148, 136, 0.2)',
                color: activeTab === 'pendapatan' ? '#ffffff' : '#0d9488'
              }}
            >
              {pendapatanTransactions.length}
            </span>
          </a>
        )}

        {hasMenuAccess('laporan') && (
          <>
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
          </>
        )}

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
        {/* Info Terakhir Diupdate di Pojok Kiri Bawah Sidebar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 10px',
            marginBottom: 10,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 11,
            color: '#cbd5e1'
          }}
          title={`Pembaruan data terakhir: ${latestUpdateFormatted}`}
        >
          <Clock size={12} color="#38bdf8" />
          <span>Update: <strong style={{ color: '#ffffff' }}>{latestUpdateFormatted}</strong></span>
        </div>

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
          {currentUser?.role === 'superadmin' && (
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
          )}

          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Keluar dari akun ${currentUser?.nama}?`)) {
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
