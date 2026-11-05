import React from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, ROLE_DEFINITIONS } from '../data/constants';
import { Calendar, Shield, User, ChevronDown, RotateCcw, Sparkles, LogOut, Globe } from 'lucide-react';

const Navbar = ({ onOpenYearModal, onOpenRoleModal, onOpenPublicPortal }) => {
  const { activeYear, currentUser, resetToDemoData, logout } = useApp();

  const roleDef = ROLE_DEFINITIONS[currentUser?.role] || {};
  const bidang = BIDANG_LIST.find((b) => b.id === currentUser?.bidangId);

  return (
    <>
      {/* Top Simulation Banner - Hanya Tampil Untuk Superadmin */}
      {currentUser?.role === 'superadmin' && (
        <div className="quick-switcher-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="#f59e0b" />
          <span>
            Mode Pengguna Aktif: <strong>{currentUser?.nama}</strong> — {roleDef.nama || currentUser?.role}
            {bidang ? ` (${bidang.nama})` : ' (Seluruh Bidang Dinas)'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <button
            className="btn-switch-role"
            onClick={onOpenRoleModal}
            title="Ganti akun untuk melihat batasan akses"
          >
            Ganti Peran / Role Switcher
          </button>
        </div>
      </div>
      )}

      {/* Main Navbar */}
      <header className="navbar-header">
        <div className="navbar-left">
          {/* Active Year Badge */}
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

          <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Status Akses:</span>
            <span
              style={{
                fontSize: 11.5,
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

        <div className="navbar-right">
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
