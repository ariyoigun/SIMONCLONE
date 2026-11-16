import React from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, ROLE_DEFINITIONS } from '../data/constants';
import {
  Calendar,
  Shield,
  User,
  ChevronDown,
  RotateCcw,
  Sparkles,
  LogOut,
  Globe,
  Clock,
  Megaphone,
  RefreshCw
} from 'lucide-react';
import { getActiveMondayFormatted } from '../utils/dateUtils';

const Navbar = ({ onOpenYearModal, onOpenRoleModal, onOpenPublicPortal }) => {
  const {
    activeYear,
    currentUser,
    systemSettings,
    refreshDataFromDatabase,
    isRefreshingRemote,
    logout
  } = useApp();

  const roleDef = ROLE_DEFINITIONS[currentUser?.role] || {};
  const bidang = BIDANG_LIST.find((b) => b.id === currentUser?.bidangId);

  // Keterangan update selalu berubah mengikuti hari Senin pada minggu aktif
  const activeMondayDateStr = getActiveMondayFormatted();

  const runningTextContent =
    systemSettings?.runningText?.trim() ||
    'Admin Data melakukan update setiap hari Senin Jam 08.00-10.00 WIB | Verifikasi Data Jam 10.00-12.00 WIB';

  return (
    <>
      {/* Top Banner: Mode Pengguna Aktif & Running Text Pengumuman Sistem */}
      <div className="quick-switcher-banner" style={{ flexDirection: 'column', padding: 0 }}>
        {/* Baris 1: Mode Pengguna Aktif & Aksi Cepat */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 24px',
            width: '100%',
            gap: 12,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <Sparkles size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Mode Pengguna Aktif: <strong style={{ color: '#f8fafc' }}>{currentUser?.nama}</strong> — {roleDef.nama || currentUser?.role}
              {bidang ? ` (${bidang.nama})` : ' (Seluruh Bidang Dinas)'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {onOpenPublicPortal && (
              <button
                type="button"
                className="btn-switch-role"
                onClick={onOpenPublicPortal}
                style={{
                  background: '#f59e0b',
                  color: '#071527',
                  border: 'none',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5
                }}
                title="Lihat Tampilan Beranda Publik untuk Masyarakat"
              >
                <Globe size={13} />
                <span>Lihat Beranda Publik</span>
              </button>
            )}
            {currentUser?.role === 'superadmin' && (
              <button
                className="btn-switch-role"
                onClick={onOpenRoleModal}
                title="Ganti akun untuk melihat batasan akses peran lain"
              >
                Ganti Peran / Role Switcher
              </button>
            )}
          </div>
        </div>

        {/* Baris 2: Running Text Kecil di Bawah Mode Pengguna Aktif */}
        <div className="running-ticker-container">
          <div className="running-ticker-badge" title="Jadwal Update & Verifikasi Data">
            <Megaphone size={12} color="#fbbf24" />
            <span>PENGUMUMAN</span>
          </div>
          <div className="running-ticker-track" title="Arahkan kursor untuk menjeda teks pengumuman">
            <div className="running-ticker-text">
              {runningTextContent} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {runningTextContent}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="navbar-header">
        <div className="navbar-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
          {/* Baris Atas: Selector Tahun Anggaran & Status Akses */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              className="year-pill-selector"
              onClick={onOpenYearModal}
              title="Klik untuk memilih atau menambah tahun anggaran"
            >
              <Calendar size={15} color="#0f2c59" />
              <span className="label">Tahun Anggaran:</span>
              <span className="active-year">{activeYear}</span>
              <ChevronDown size={14} color="#64748b" />
            </div>

            <div style={{ fontSize: 12.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Status Akses:</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: roleDef.readOnly ? '#0284c7' : '#059669',
                  background: roleDef.readOnly ? '#e0f2fe' : '#dcfce7',
                  padding: '2px 8px',
                  borderRadius: 9999
                }}
              >
                {roleDef.readOnly ? 'Hanya Memantau (Read-Only)' : 'Dapat Input & Edit'}
              </span>
            </div>
          </div>

          {/* Kotak Dialog Update Terakhir di Bawah Tahun Anggaran (Muncul di Setiap Menu / Halaman) */}
          <div
            className="update-dialog-box"
            title="Keterangan update data otomatis mengikuti hari Senin pada minggu aktif berjalan"
          >
            <Clock size={12} color="#0284c7" />
            <span>
              Update Data Terakhir : <strong style={{ color: '#0f2c59', fontWeight: 800 }}>{activeMondayDateStr}</strong>
            </span>
          </div>
        </div>

        <div className="navbar-right">
          {/* Tombol Sinkronisasi Data Remote */}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => refreshDataFromDatabase && refreshDataFromDatabase(false)}
            disabled={isRefreshingRemote}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              borderColor: '#cbd5e1',
              color: '#0f2c59',
              padding: '7px 12px',
              fontSize: 12,
              fontWeight: 600,
              background: '#ffffff'
            }}
            title="Sinkronisasi data langsung dari database pusat (MySQL)"
          >
            <RefreshCw size={13} className={isRefreshingRemote ? 'spin-animation' : ''} color="#0284c7" />
            <span>{isRefreshingRemote ? 'Menyinkronkan...' : 'Sinkron Data'}</span>
          </button>

          {onOpenPublicPortal && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onOpenPublicPortal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                borderColor: '#cbd5e1',
                color: '#0f2c59',
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 700,
                background: '#ffffff'
              }}
              title="Lihat Tampilan Beranda Publik untuk Masyarakat"
            >
              <Globe size={14} color="#0284c7" />
              <span>Portal Publik</span>
            </button>
          )}

          {/* User profile dropdown / trigger */}
          <div
            className="user-profile-badge"
            onClick={currentUser?.role === 'superadmin' ? onOpenRoleModal : undefined}
            style={{ cursor: currentUser?.role === 'superadmin' ? 'pointer' : 'default' }}
            title={currentUser?.role === 'superadmin' ? "Ganti peran pengguna (Superadmin)" : currentUser?.nama}
          >
            <img src={currentUser?.avatar} alt="" className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{currentUser?.nama}</span>
              <span className="user-role-tag">
                <Shield size={11} />
                {roleDef.nama} • {bidang ? bidang.singkatan : 'DINPUTARU'}
              </span>
            </div>
            {currentUser?.role === 'superadmin' && <ChevronDown size={14} color="#94a3b8" />}
          </div>

          {/* Logout Button */}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              if (window.confirm(`Keluar dari akun ${currentUser?.nama}?`)) {
                logout();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#dc2626',
              borderColor: '#fca5a5',
              padding: '7px 12px',
              fontSize: 12
            }}
            title="Keluar dari akun"
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      </header>
    </>
  );
};

export default Navbar;
