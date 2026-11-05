import React from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, ROLE_DEFINITIONS } from '../data/constants';
import { Shield, UserCheck, Eye, X, CheckCircle2, Building, AlertCircle } from 'lucide-react';

const RoleSwitcherModal = ({ isOpen, onClose }) => {
  const { users, currentUser, switchUser } = useApp();

  if (!isOpen) return null;
  if (currentUser?.role !== 'superadmin') return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Simulasi Hak Akses & Pengguna (Role Switcher)</h3>
            <p>
              Pilih akun di bawah ini untuk menguji hak akses (Superadmin, Koordinator Bidang, Kepala Bidang, Sekretaris, atau Kepala Dinas)
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              padding: '12px 16px',
              background: '#f8fafc',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              marginBottom: 20,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <AlertCircle size={20} color="#0284c7" style={{ flexShrink: 0 }} />
            <div>
              <strong>Aturan Hak Akses DINPUTARU (Struktur Baru):</strong>
              <div style={{ color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                • <strong>Sub Bagian Program & Keuangan:</strong> Kasubag & Koordinator memiliki wewenang khusus mengakses <em>Menu 4 (Administrasi SPJ Keuangan)</em> untuk verifikasi berkas akhir tahun, koreksi, pengembalian, SPM, dan SP2D.<br />
                • <strong>Koordinator Pendapatan:</strong> Memiliki wewenang menginput dan mengelola <em>Menu 6 (Monitoring Pendapatan & Retribusi PAD)</em> seperti Sewa Alat Berat, PBG, SLF, Tinja, dan Cor Drill.<br />
                • <strong>Sub Bagian Umum & Kepegawaian (Umpeg):</strong> Kasubag & Koordinator mengelola paket pengadaan operasional kantor & kepegawaian.<br />
                • <strong>Bidang Teknis (CK, SDA, BM, TRP):</strong> Koordinator menginput/mengubah paket bidangnya, Kasie/Kabid memantau progres.<br />
                • <strong>Sekretaris & Kepala Dinas:</strong> Dapat memantau pekerjaan & administrasi SPJ <em>seluruh bidang</em> (Read-Only).<br />
                • <strong>Superadmin:</strong> Akses penuh semua bidang, manajemen user, tahun anggaran & pengaturan keberlanjutan.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 14
            }}
          >
            {users.map((u) => {
              const roleDef = ROLE_DEFINITIONS[u.role] || {};
              const bidang = BIDANG_LIST.find((b) => b.id === u.bidangId);
              const isActive = currentUser?.id === u.id;

              const isProgKeu = u.role.includes('program_keuangan');
              const isUmpeg = u.role.includes('umpeg');
              const isPendapatan = u.role === 'koordinator_pendapatan';

              return (
                <div
                  key={u.id}
                  onClick={() => {
                    switchUser(u);
                    onClose();
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: isActive ? '2px solid #0f2c59' : '1px solid #e2e8f0',
                    background: isActive ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    boxShadow: isActive ? '0 4px 12px rgba(15, 44, 89, 0.12)' : '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={u.avatar}
                      alt={u.nama}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {u.nama}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>{u.jabatan}</div>
                    </div>
                    {isActive && (
                      <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0 }} />
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 11.5
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 9999,
                        background:
                          u.role === 'superadmin'
                            ? '#fee2e2'
                            : isPendapatan
                            ? '#ccfbf1'
                            : isProgKeu
                            ? '#f3e8ff'
                            : isUmpeg
                            ? '#fef3c7'
                            : u.role === 'kadin' || u.role === 'sekretaris'
                            ? '#e0f2fe'
                            : u.role === 'koordinator'
                            ? '#fef3c7'
                            : '#f1f5f9',
                        color:
                          u.role === 'superadmin'
                            ? '#991b1b'
                            : isPendapatan
                            ? '#0f766e'
                            : isProgKeu
                            ? '#7e22ce'
                            : isUmpeg
                            ? '#92400e'
                            : u.role === 'kadin' || u.role === 'sekretaris'
                            ? '#075985'
                            : u.role === 'koordinator'
                            ? '#92400e'
                            : '#334155',
                        fontWeight: 700
                      }}
                    >
                      {u.role === 'superadmin' ? (
                        <Shield size={12} />
                      ) : u.role === 'koordinator' || u.role === 'koordinator_program_keuangan' || u.role === 'koordinator_umpeg' || isPendapatan ? (
                        <UserCheck size={12} />
                      ) : (
                        <Eye size={12} />
                      )}
                      {roleDef.nama || u.role}
                    </span>

                    <span style={{ color: '#64748b', fontWeight: 600 }}>
                      {bidang ? bidang.singkatan : 'Seluruh Bidang'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcherModal;
