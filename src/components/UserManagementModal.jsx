import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, ROLE_DEFINITIONS, SYSTEM_MENUS } from '../data/constants';
import {
  Users,
  UserPlus,
  Trash2,
  Edit2,
  Shield,
  X,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  UserCheck,
  Camera,
  Upload,
  Coins
} from 'lucide-react';

const emptyForm = {
  nama: '',
  nip: '',
  username: '',
  jabatan: '',
  role: 'koordinator',
  bidangId: 'cipta_karya',
  email: '',
  password: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  allowedMenus: ['dashboard', 'master_pekerjaan', 'prakontrak', 'fisik', 'keuangan', 'pendapatan', 'laporan'],
  canInputPendapatan: false
};

const UserManagementModal = ({ isOpen, onClose }) => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useApp();

  // 'add' | 'edit' | null
  const [formMode, setFormMode] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswordRowId, setVisiblePasswordRowId] = useState(null);

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setFormMode('add');
    setEditingUserId(null);
    setFormData({
      ...emptyForm,
      password: 'pupr' + Math.floor(100 + Math.random() * 900), // Suggested strong default password
      allowedMenus: ['dashboard', 'master_pekerjaan', 'prakontrak', 'fisik', 'keuangan', 'pendapatan', 'laporan'],
      canInputPendapatan: false
    });
    setShowPassword(true);
  };

  const handleStartEdit = (user) => {
    setFormMode('edit');
    setEditingUserId(user.id);
    const defaultAllowed = user.role === 'koordinator_pendapatan'
      ? ['dashboard', 'pendapatan', 'laporan']
      : SYSTEM_MENUS.map((m) => m.id);

    setFormData({
      nama: user.nama || '',
      nip: user.nip || '',
      username: user.username || user.email?.split('@')[0] || '',
      jabatan: user.jabatan || '',
      role: user.role || 'koordinator',
      bidangId: user.bidangId || 'cipta_karya',
      email: user.email || '',
      password: user.password || 'pupr2025',
      avatar: user.avatar || emptyForm.avatar,
      allowedMenus: Array.isArray(user.allowedMenus) && user.allowedMenus.length > 0 ? user.allowedMenus : defaultAllowed,
      canInputPendapatan: user.canInputPendapatan !== undefined
        ? user.canInputPendapatan
        : (user.role === 'koordinator_pendapatan' || user.role === 'superadmin')
    });
    setShowPassword(true);
  };

  const handleCancelForm = () => {
    setFormMode(null);
    setEditingUserId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.jabatan.trim()) {
      alert('Nama dan Jabatan wajib diisi!');
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      alert('Kata sandi / Password minimal 4 karakter!');
      return;
    }

    // Determine bidang assignment based on role
    let bidangId = formData.bidangId;
    if (['superadmin', 'kadin', 'sekretaris', 'koordinator_pendapatan'].includes(formData.role)) {
      bidangId = formData.role === 'koordinator_pendapatan' ? 'sekretariat' : null;
    } else if (['kasubag_program_keuangan', 'koordinator_program_keuangan', 'kasubag_umpeg', 'koordinator_umpeg'].includes(formData.role)) {
      bidangId = 'sekretariat';
    }

    const payload = {
      ...formData,
      username: formData.username.trim() || formData.email.split('@')[0] || `user_${Date.now().toString().slice(-4)}`,
      bidangId,
      allowedMenus: Array.isArray(formData.allowedMenus) && formData.allowedMenus.length > 0
        ? formData.allowedMenus
        : ['dashboard', 'pendapatan', 'laporan'],
      canInputPendapatan: Boolean(formData.canInputPendapatan || formData.role === 'koordinator_pendapatan' || formData.role === 'superadmin')
    };

    if (formMode === 'edit') {
      updateUser(editingUserId, payload);
    } else {
      addUser(payload);
    }

    handleCancelForm();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Manajemen Akun, Hak Akses & Kredensial Pengguna</h3>
            <p>
              Kelola seluruh pegawai dinas, ubah peran, perbarui data profil, dan atur/reset kata sandi (password) akun.
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
              Total Terdaftar: <strong>{users.length} Akun Pegawai</strong>
            </span>
            {!formMode && (
              <button className="btn btn-primary btn-sm" onClick={handleStartAdd}>
                <UserPlus size={15} />
                Tambah Pengguna Baru
              </button>
            )}
          </div>

          {/* Form Create / Edit User */}
          {formMode && (
            <div
              style={{
                background: formMode === 'edit' ? '#f0fdf4' : '#f8fafc',
                padding: '20px',
                borderRadius: 12,
                border: formMode === 'edit' ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                marginBottom: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: formMode === 'edit' ? '#22c55e' : '#0284c7',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {formMode === 'edit' ? <Edit2 size={16} /> : <UserPlus size={16} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0f2c59', margin: 0 }}>
                      {formMode === 'edit' ? `Ubah Data & Password: ${formData.nama}` : 'Input Pengguna & Kata Sandi Baru'}
                    </h4>
                    <span style={{ fontSize: 11.5, color: '#64748b' }}>
                      {formMode === 'edit'
                        ? 'Super Admin dapat mengubah seluruh komponen user termasuk reset kata sandi'
                        : 'Lengkapi formulir akun baru dan tentukan kata sandi login awal'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  ✕ Batal
                </button>
              </div>

              <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Nama Lengkap & Gelar <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Ir. Muhammad Yusuf, MT"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="19800101 200501 1 001"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Username / ID Login <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: myusuf / admin / kadin"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                  <span className="form-help">Digunakan untuk login ke sistem</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Jabatan Kedinasan <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Koordinator Bidang Cipta Karya / PPK"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Peran Sistem (Role) <span className="required">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      let nextAllowed = formData.allowedMenus || SYSTEM_MENUS.map((m) => m.id);
                      let nextCanInput = formData.canInputPendapatan;
                      if (newRole === 'koordinator_pendapatan') {
                        nextAllowed = ['dashboard', 'pendapatan', 'laporan'];
                        nextCanInput = true;
                      } else if (newRole === 'superadmin') {
                        nextAllowed = SYSTEM_MENUS.map((m) => m.id);
                        nextCanInput = true;
                      }
                      setFormData({
                        ...formData,
                        role: newRole,
                        allowedMenus: nextAllowed,
                        canInputPendapatan: nextCanInput
                      });
                    }}
                  >
                    <option value="koordinator">Koordinator Bidang Teknis (Input & Edit Bidang Terkait)</option>
                    <option value="kabid">Kepala Bidang Teknis (Viewer Bidang Terkait)</option>
                    <option value="koordinator_pendapatan">Koordinator Pendapatan (Pengelola & Input Retribusi PAD)</option>
                    <option value="kasubag_program_keuangan">Kepala Sub Bagian Program & Keuangan (Akses Menu SPJ)</option>
                    <option value="koordinator_program_keuangan">Koordinator / Verifikator Program & Keuangan (Edit SPJ)</option>
                    <option value="kasubag_umpeg">Kepala Sub Bagian Umum & Kepegawaian (Umpeg)</option>
                    <option value="koordinator_umpeg">Koordinator Sub Bagian Umum & Kepegawaian</option>
                    <option value="sekretaris">Sekretaris Dinas (Melihat Semua Bidang Dinas)</option>
                    <option value="kadin">Kepala Dinas (Melihat Semua Bidang Dinas)</option>
                    <option value="superadmin">Super Admin (Akses Penuh Semua Pengaturan)</option>
                  </select>
                </div>

                {['koordinator', 'kabid'].includes(formData.role) && (
                  <div className="form-group">
                    <label className="form-label">
                      Penugasan Bidang Teknis <span className="required">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={formData.bidangId}
                      onChange={(e) => setFormData({ ...formData, bidangId: e.target.value })}
                    >
                      {BIDANG_LIST.filter((b) => b.id !== 'sekretariat').map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Email Kedinasan</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="nama@kabupaten.go.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div className="form-group" style={{ background: '#fff', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0f2c59', fontWeight: 700 }}>
                    <Key size={14} color="#0284c7" />
                    <span>Kata Sandi (Password Akun) <span className="required">*</span></span>
                  </label>
                  <div style={{ display: 'flex', gap: 6, position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Masukkan kata sandi akun..."
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b'
                      }}
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="form-help" style={{ marginTop: 4 }}>
                    {formMode === 'edit'
                      ? 'Ketik password baru untuk mengubah / reset kata sandi pengguna ini.'
                      : 'Password awal yang digunakan pengguna untuk masuk ke sistem.'}
                  </span>
                </div>

                <div className="form-group form-grid-full">
                  <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Camera size={15} color="#0284c7" />
                    <span>Foto Profil Pegawai (Upload File dari Perangkat)</span>
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                      background: '#ffffff',
                      border: '1.5px dashed #cbd5e1',
                      borderRadius: 12,
                      padding: '14px 18px'
                    }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={
                          formData.avatar ||
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
                        }
                        alt="Preview Foto Profil"
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #0284c7',
                          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)'
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <label
                          className="btn btn-primary btn-sm"
                          style={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '7px 14px',
                            fontSize: 12.5,
                            fontWeight: 700
                          }}
                        >
                          <Upload size={14} />
                          <span>Pilih Foto dari Perangkat</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) {
                                  alert('Ukuran foto maksimal 2MB.');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setFormData((prev) => ({ ...prev, avatar: event.target.result }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {formData.avatar && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
                              }))
                            }
                            style={{ color: '#ef4444', borderColor: '#fca5a5', fontSize: 12 }}
                          >
                            Reset ke Default
                          </button>
                        )}
                      </div>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>
                        Unggah foto resmi pegawai (JPG, PNG, WEBP, maks. 2MB). Foto akan tersimpan langsung di dalam sistem.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hak Akses Menu & Izin Input Sistem (Permintaan Khusus Admin) */}
                <div
                  className="form-group form-grid-full"
                  style={{
                    background: '#f8fafc',
                    padding: '16px 18px',
                    borderRadius: 12,
                    border: '1.5px solid #cbd5e1',
                    marginTop: 6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <label className="form-label" style={{ fontWeight: 800, color: '#0f2c59', margin: 0, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🎯 Pengaturan Akses Menu Sistem</span>
                        <span style={{ fontSize: 11, background: '#e0f2fe', color: '#0284c7', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>
                          {(formData.allowedMenus || []).length} Menu Terpilih
                        </span>
                      </label>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>
                        Admin dapat memilih menu apa saja yang dapat dilihat & diakses oleh user ini saat login
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 11, padding: '4px 8px', background: '#fff' }}
                        onClick={() => setFormData({ ...formData, allowedMenus: SYSTEM_MENUS.map((m) => m.id) })}
                      >
                        Pilih Semua Menu
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 11, padding: '4px 8px', color: '#0d9488', borderColor: '#5eead4', background: '#fff' }}
                        onClick={() => setFormData({ ...formData, allowedMenus: ['dashboard', 'pendapatan', 'laporan'], canInputPendapatan: true })}
                      >
                        Khusus Pendapatan
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
                    {SYSTEM_MENUS.map((menu) => {
                      const isChecked = (formData.allowedMenus || []).includes(menu.id);
                      return (
                        <label
                          key={menu.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: isChecked ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                            background: isChecked ? '#eff6ff' : '#ffffff',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: isChecked ? 700 : 500,
                            color: isChecked ? '#0369a1' : '#475569',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const current = formData.allowedMenus || [];
                              const updated = e.target.checked
                                ? [...current, menu.id]
                                : current.filter((m) => m !== menu.id);
                              setFormData({ ...formData, allowedMenus: updated });
                            }}
                          />
                          <span>{menu.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Izin Khusus Input Monitoring Pendapatan */}
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: formData.canInputPendapatan ? '#ecfdf5' : '#ffffff',
                        border: formData.canInputPendapatan ? '1.5px solid #10b981' : '1px solid #cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(formData.canInputPendapatan)}
                        onChange={(e) => setFormData({ ...formData, canInputPendapatan: e.target.checked })}
                        style={{ width: 17, height: 17, accentColor: '#10b981' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: formData.canInputPendapatan ? '#065f46' : '#1e293b' }}>
                          <Coins size={16} color={formData.canInputPendapatan ? '#059669' : '#64748b'} />
                          <span>Izin Input & Kelola Transaksi Pendapatan Daerah (Fitur Menu ke-6)</span>
                          {formData.canInputPendapatan && (
                            <span style={{ fontSize: 10.5, background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                              DIIZINKAN INPUT
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
                          Centang opsi ini agar user dapat menginput data sewa alat berat, PBG, SLF, retribusi tinja, sewa cor drill, serta mengedit target tahunan.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div
                  className="form-grid-full"
                  style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px solid #e2e8f0' }}
                >
                  <button type="button" className="btn btn-outline" onClick={handleCancelForm}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    {formMode === 'edit' ? 'Simpan Perubahan Pengguna' : 'Simpan Pengguna Baru'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pengguna & Akun</th>
                  <th>Jabatan & NIP</th>
                  <th>Peran Sistem (Role)</th>
                  <th>Bidang Tugas</th>
                  <th>Kata Sandi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const bidang = BIDANG_LIST.find((b) => b.id === u.bidangId);
                  const isCurrent = currentUser?.id === u.id;
                  const isBeingEdited = editingUserId === u.id;
                  const roleDef = ROLE_DEFINITIONS[u.role] || {};
                  const isPasswordVisible = visiblePasswordRowId === u.id;

                  const isProgKeu = u.role.includes('program_keuangan');
                  const isUmpeg = u.role.includes('umpeg');

                  return (
                    <tr key={u.id} style={{ background: isBeingEdited ? '#f0fdf4' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={u.avatar}
                            alt=""
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #e2e8f0'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f2c59' }}>
                              {u.nama} {isCurrent && <span style={{ color: '#059669', fontSize: 11 }}>(Anda)</span>}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#64748b' }}>
                              User: <code style={{ fontWeight: 600, color: '#0284c7' }}>{u.username || u.email?.split('@')[0]}</code>
                            </div>
                            <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, fontSize: 12.5, color: '#1e293b' }}>{u.jabatan}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>NIP. {u.nip || '-'}</div>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              u.role === 'superadmin'
                                ? '#fee2e2'
                                : u.role === 'koordinator_pendapatan'
                                ? '#ccfbf1'
                                : isProgKeu
                                ? '#f3e8ff'
                                : isUmpeg
                                ? '#fef3c7'
                                : u.role === 'kadin' || u.role === 'sekretaris'
                                ? '#e0f2fe'
                                : '#f1f5f9',
                            color:
                              u.role === 'superadmin'
                                ? '#991b1b'
                                : u.role === 'koordinator_pendapatan'
                                ? '#0f766e'
                                : isProgKeu
                                ? '#7e22ce'
                                : isUmpeg
                                ? '#92400e'
                                : u.role === 'kadin' || u.role === 'sekretaris'
                                ? '#0369a1'
                                : '#334155'
                          }}
                        >
                          {roleDef.nama || u.role}
                        </span>

                        {(u.canInputPendapatan || u.role === 'koordinator_pendapatan') && (
                          <div style={{ marginTop: 4 }}>
                            <span
                              style={{
                                fontSize: 10,
                                background: '#ecfdf5',
                                color: '#047857',
                                border: '1px solid #a7f3d0',
                                padding: '1px 6px',
                                borderRadius: 4,
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3
                              }}
                            >
                              <Coins size={10} />
                              Input PAD
                            </span>
                          </div>
                        )}

                        {Array.isArray(u.allowedMenus) && (
                          <div style={{ marginTop: 2, fontSize: 10.5, color: '#64748b' }}>
                            {u.allowedMenus.length} Menu Diizinkan
                          </div>
                        )}
                      </td>

                      <td>
                        {bidang ? (
                          <span className="badge badge-bidang" style={{ background: bidang.bgLight, color: bidang.warna }}>
                            {bidang.nama}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11.5, color: '#059669', fontWeight: 600 }}>
                            Semua Bidang Dinas
                          </span>
                        )}
                      </td>

                      {/* Password Column */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontFamily: isPasswordVisible ? 'monospace' : 'inherit',
                              fontSize: isPasswordVisible ? 12 : 14,
                              fontWeight: isPasswordVisible ? 700 : 900,
                              color: isPasswordVisible ? '#0f2c59' : '#94a3b8',
                              letterSpacing: isPasswordVisible ? 0 : 2
                            }}
                          >
                            {isPasswordVisible ? (u.password || 'pupr2025') : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setVisiblePasswordRowId(isPasswordVisible ? null : u.id)
                            }
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#64748b',
                              padding: 2
                            }}
                            title={isPasswordVisible ? 'Sembunyikan password' : 'Lihat password'}
                          >
                            {isPasswordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Ubah Data & Password"
                            onClick={() => handleStartEdit(u)}
                            style={{ color: '#0284c7', background: '#f0f9ff' }}
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            type="button"
                            className="btn-icon"
                            title="Hapus Pengguna"
                            disabled={isCurrent}
                            onClick={() => {
                              if (window.confirm(`Hapus pengguna ${u.nama}? Tindakan ini tidak dapat dibatalkan.`)) {
                                deleteUser(u.id);
                              }
                            }}
                            style={{
                              opacity: isCurrent ? 0.3 : 1,
                              cursor: isCurrent ? 'not-allowed' : 'pointer',
                              color: '#dc2626',
                              background: isCurrent ? 'transparent' : '#fef2f2'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

export default UserManagementModal;
