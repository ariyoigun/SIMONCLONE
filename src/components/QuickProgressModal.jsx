import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmModal from './ConfirmModal';
import NotificationModal from './NotificationModal';
import { X, TrendingUp, DollarSign, Save, Camera, Upload, Trash2 } from 'lucide-react';

const QuickProgressModal = ({ project, isOpen, onClose }) => {
  const { updateProject, addTermin, addProjectLog, currentUser } = useApp();

  const [rencana, setRencana] = useState(project?.dataFisik?.progresRencana || 0);
  const [realisasi, setRealisasi] = useState(project?.dataFisik?.progresRealisasi || 0);
  const [kendala, setKendala] = useState(project?.dataFisik?.kendalaLapangan || '');

  // Dokumentasi Foto 0%, 50%, 100%
  const existingFotos = project?.dataFisik?.fotoDokumentasi || [];
  const dok = project?.dokumentasi || project?.fotoLapangan || {};
  const [foto0, setFoto0] = useState(() => existingFotos.find((f) => f.tahap === '0%')?.url || dok.foto0 || '');
  const [foto50, setFoto50] = useState(() => existingFotos.find((f) => f.tahap === '50%')?.url || dok.foto50 || '');
  const [foto100, setFoto100] = useState(() => existingFotos.find((f) => f.tahap === '100%')?.url || dok.foto100 || '');
  const [tanggal0, setTanggal0] = useState(() => existingFotos.find((f) => f.tahap === '0%')?.tanggal || dok.tanggal0 || '');
  const [tanggal50, setTanggal50] = useState(() => existingFotos.find((f) => f.tahap === '50%')?.tanggal || dok.tanggal50 || '');
  const [tanggal100, setTanggal100] = useState(() => existingFotos.find((f) => f.tahap === '100%')?.tanggal || dok.tanggal100 || '');

  const handlePhotoUpload = (tahap, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 10 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        const todayStr = new Date().toISOString().slice(0, 10);

        if (tahap === '0%') {
          setFoto0(compressedBase64);
          if (!tanggal0) setTanggal0(todayStr);
        } else if (tahap === '50%') {
          setFoto50(compressedBase64);
          if (!tanggal50) setTanggal50(todayStr);
        } else if (tahap === '100%') {
          setFoto100(compressedBase64);
          if (!tanggal100) setTanggal100(todayStr);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Add Termin quickly
  const [addTerminNow, setAddTerminNow] = useState(false);
  const [terminNama, setTerminNama] = useState('');
  const [nomorSP2D, setNomorSP2D] = useState('');
  const [jumlahCair, setJumlahCair] = useState('');

  // Confirmation & Notification modals
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Ya, Simpan',
    type: 'primary',
    onConfirm: () => {}
  });

  const [notifModal, setNotifModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    btnText: 'OK, Selesai'
  });

  if (!isOpen || !project) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Pembaruan Progres',
      message: (
        <div>
          <div>Apakah Anda yakin ingin memperbarui data progres pekerjaan ini?</div>
          <div style={{ marginTop: 10, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: 13, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>• Realisasi Fisik: <strong>{realisasi}%</strong> (Target: {rencana}%)</div>
            {addTerminNow && jumlahCair > 0 && (
              <div>• Pencairan SP2D Baru: <strong>Rp {Math.round(parseFloat(jumlahCair) || 0).toLocaleString('id-ID')}</strong> ({terminNama || 'Termin Baru'})</div>
            )}
            {kendala && <div>• Kendala Lapangan: <em>{kendala}</em></div>}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 6, fontSize: 12, color: '#64748b' }}>
              Diperbarui oleh: <strong>{currentUser?.nama || 'Petugas'}</strong>
            </div>
          </div>
        </div>
      ),
      confirmText: 'Ya, Simpan Progres',
      type: 'primary',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        const fRencana = parseFloat(rencana) || 0;
        const fRealisasi = parseFloat(realisasi) || 0;
        const cairNum = parseFloat(jumlahCair) || 0;

        // Auto audit logging
        let logDesc = `Koordinator ${currentUser?.nama || 'Petugas'} memperbarui progres fisik (Realisasi: ${fRealisasi}%, Rencana: ${fRencana}%)`;
        if (addTerminNow && cairNum > 0) {
          logDesc += ` serta mencatat pencairan SP2D ${terminNama || 'Baru'} sebesar Rp ${Math.round(cairNum).toLocaleString('id-ID')}`;
        }
        if (kendala) {
          logDesc += `. Catatan kendala: ${kendala}`;
        }

        addProjectLog(project.id, {
          aksi: 'Update Cepat Progres',
          keterangan: logDesc,
          dataChanged: {
            progresFisik: fRealisasi,
            sp2d: addTerminNow && cairNum > 0 ? cairNum : undefined,
            catatan: kendala
          }
        });

        const finalFotos = [
          foto0 ? { tahap: '0%', label: 'Kondisi 0% (Titik Nol)', url: foto0, tanggal: tanggal0 || new Date().toISOString().slice(0, 10) } : null,
          foto50 ? { tahap: '50%', label: 'Progres 50% (Pelaksanaan)', url: foto50, tanggal: tanggal50 || new Date().toISOString().slice(0, 10) } : null,
          foto100 ? { tahap: '100%', label: 'Progres 100% (Selesai Fisik)', url: foto100, tanggal: tanggal100 || new Date().toISOString().slice(0, 10) } : null
        ].filter(Boolean);

        // Update physical progress, notes & documentation photos
        updateProject(project.id, {
          dataFisik: {
            ...project.dataFisik,
            progresRencana: fRencana,
            progresRealisasi: fRealisasi,
            kendalaLapangan: kendala,
            fotoDokumentasi: finalFotos
          },
          dokumentasi: {
            foto0,
            foto50,
            foto100
          },
          fotoLapangan: {
            foto0,
            foto50,
            foto100
          }
        });

        // If adding a termin
        if (addTerminNow && cairNum > 0) {
          addTermin(project.id, {
            terminKe: terminNama || 'Pencairan Baru',
            nomorSP2D: nomorSP2D || '-',
            tanggalSP2D: new Date().toISOString().slice(0, 10),
            jumlah: cairNum,
            catatan: 'Dicatat via Update Cepat'
          });
        }

        setNotifModal({
          isOpen: true,
          title: 'Progres Berhasil Disimpan!',
          message: 'Data progres pekerjaan dan catatan riwayat log telah berhasil diperbarui ke sistem.',
          type: 'success',
          btnText: 'OK, Selesai'
        });
      }
    });
  };

  const deviasi = (parseFloat(realisasi || 0) - parseFloat(rencana || 0)).toFixed(2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <div>
            <h3>Update Cepat Progres Pekerjaan</h3>
            <p style={{ color: '#64748b', fontSize: 12.5 }}>
              {project.namaPaket}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 14,
                marginBottom: 16
              }}
            >
              <div className="form-group">
                <label className="form-label">Target Rencana Kumulatif (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="form-control"
                  value={rencana}
                  onChange={(e) => setRencana(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Realisasi Fisik Terkini (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="form-control"
                  value={realisasi}
                  onChange={(e) => setRealisasi(e.target.value)}
                  required
                />
              </div>
            </div>

            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: deviasi < -5 ? '#fee2e2' : deviasi < 0 ? '#fef3c7' : '#dcfce7',
                color: deviasi < -5 ? '#991b1b' : deviasi < 0 ? '#92400e' : '#166534',
                fontSize: 12.5,
                fontWeight: 700,
                marginBottom: 16
              }}
            >
              Deviasi Terhitung: {deviasi >= 0 ? `+${deviasi}%` : `${deviasi}%`} (
              {realisasi >= 100
                ? 'Selesai 100%'
                : deviasi < -5
                ? 'Kritis / Kontrak Kritis'
                : deviasi < 0
                ? 'Perhatian / Terlambat'
                : 'Aman Sesuai Jadwal'}
              )
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Catatan Kendala Lapangan Terkini</label>
              <textarea
                className="form-control"
                placeholder="Tulis kondisi cuaca, kendala material, atau progres mingguan..."
                value={kendala}
                onChange={(e) => setKendala(e.target.value)}
              />
            </div>

            
            {/* Dokumentasi Foto Lapangan (0%, 50%, 100%) */}
            <div
              style={{
                marginBottom: 16,
                padding: '16px',
                borderRadius: 12,
                border: '1.5px solid #cbd5e1',
                background: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Camera size={16} color="#0284c7" />
                  <span>Foto Dokumentasi (0%, 50%, 100%)</span>
                </div>
                <span style={{ fontSize: 11, color: '#64748b' }}>Pratinjau Instan</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {/* 0% */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#0f2c59', marginBottom: 4 }}>0% Titik Nol</div>
                  {foto0 ? (
                    <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
                      <img src={foto0} alt="0%" style={{ width: '100%', height: 75, objectFit: 'cover' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <label style={{ fontSize: 10, color: '#0284c7', fontWeight: 700, cursor: 'pointer' }}>
                          Ganti
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('0%', e.target.files?.[0])} />
                        </label>
                        <button type="button" onClick={() => setFoto0('')} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 10, cursor: 'pointer' }}>Hapus</button>
                      </div>
                    </div>
                  ) : (
                    <label style={{ height: 75, borderRadius: 6, border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc', color: '#64748b' }}>
                      <Upload size={14} color="#0284c7" />
                      <span style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>Upload 0%</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('0%', e.target.files?.[0])} />
                    </label>
                  )}
                </div>

                {/* 50% */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#0284c7', marginBottom: 4 }}>50% Progres</div>
                  {foto50 ? (
                    <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
                      <img src={foto50} alt="50%" style={{ width: '100%', height: 75, objectFit: 'cover' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <label style={{ fontSize: 10, color: '#0284c7', fontWeight: 700, cursor: 'pointer' }}>
                          Ganti
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('50%', e.target.files?.[0])} />
                        </label>
                        <button type="button" onClick={() => setFoto50('')} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 10, cursor: 'pointer' }}>Hapus</button>
                      </div>
                    </div>
                  ) : (
                    <label style={{ height: 75, borderRadius: 6, border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc', color: '#64748b' }}>
                      <Upload size={14} color="#0284c7" />
                      <span style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>Upload 50%</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('50%', e.target.files?.[0])} />
                    </label>
                  )}
                </div>

                {/* 100% */}
                <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', marginBottom: 4 }}>100% Selesai</div>
                  {foto100 ? (
                    <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
                      <img src={foto100} alt="100%" style={{ width: '100%', height: 75, objectFit: 'cover' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <label style={{ fontSize: 10, color: '#0284c7', fontWeight: 700, cursor: 'pointer' }}>
                          Ganti
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('100%', e.target.files?.[0])} />
                        </label>
                        <button type="button" onClick={() => setFoto100('')} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 10, cursor: 'pointer' }}>Hapus</button>
                      </div>
                    </div>
                  ) : (
                    <label style={{ height: 75, borderRadius: 6, border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc', color: '#64748b' }}>
                      <Upload size={14} color="#059669" />
                      <span style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>Upload 100%</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('100%', e.target.files?.[0])} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Termin Checkbox */}
            <div
              style={{
                padding: '14px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                background: '#f8fafc'
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={addTerminNow}
                  onChange={(e) => setAddTerminNow(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#0f2c59' }}
                />
                Sekaligus Catat Pencairan SP2D Baru (Keuangan)
              </label>

              {addTerminNow && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Termin (mis. Termin II)"
                      value={terminNama}
                      onChange={(e) => setTerminNama(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nomor SP2D"
                      value={nomorSP2D}
                      onChange={(e) => setNomorSP2D(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Jumlah Pencairan (Rp satuan lengkap)"
                      value={jumlahCair}
                      onChange={(e) => setJumlahCair(e.target.value)}
                    />
                    {jumlahCair > 0 && (
                      <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginTop: 4 }}>
                        = Rp {Math.round(parseFloat(jumlahCair) || 0).toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              Simpan Progres
            </button>
          </div>
        </form>

        {/* Pop Up Konfirmasi */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          type={confirmModal.type}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        />

        {/* Pop Up Notifikasi */}
        <NotificationModal
          isOpen={notifModal.isOpen}
          title={notifModal.title}
          message={notifModal.message}
          type={notifModal.type}
          btnText={notifModal.btnText}
          onClose={() => {
            setNotifModal((prev) => ({ ...prev, isOpen: false }));
            onClose();
          }}
        />
      </div>
    </div>
  );
};

export default QuickProgressModal;
