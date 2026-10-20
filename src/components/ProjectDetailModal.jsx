import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST, TAHAPAN_PRA_KONTRAK, STATUS_SPJ_KEUANGAN } from '../data/constants';
import ScurveChart from './ScurveChart';
import {
  X,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  ChevronRight,
  ReceiptText,
  Tag,
  Navigation,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const ProjectDetailModal = ({ project, isOpen, onClose, onEdit }) => {
  const { praKontrakStages = [] } = useApp();
  const [activeTab, setActiveTab] = useState('fisik'); // 'fisik' | 'keuangan' | 'spj' | 'prakontrak' | 'identitas'

  if (!isOpen || !project) return null;

  const bidang = BIDANG_LIST.find((b) => b.id === project.bidangId);
  const dataFisik = project.dataFisik || {};
  const dataKontrak = project.dataKontrak || {};
  const dataKeuangan = project.dataKeuangan || {};
  const praKontrak = project.tahapPraKontrak || {};
  const spj = project.administrasiSPJ || {};

  const deviasi = parseFloat(dataFisik.deviasiFisik || 0);
  const nilaiKontrak = parseFloat(dataKontrak.nilaiKontrak || 0);
  const pagu = parseFloat(project.paguAnggaran || 0);
  const totalCair = parseFloat(dataKeuangan.totalPencairan || 0);
  const persenKeuangan = parseFloat(dataKeuangan.persenKeuangan || 0);
  const sisaKontrak = Math.max(0, nilaiKontrak - totalCair);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span
                className="badge badge-bidang"
                style={{ background: bidang?.bgLight, color: bidang?.warna }}
              >
                {bidang?.nama || 'Bidang'}
              </span>
              {project.bidangId === 'sekretariat' && project.subBagian && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  {project.subBagian}
                </span>
              )}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: (project.jenisAnggaran === 'APBD-P' || project.jenisAnggaran === 'Perubahan') ? '#fef3c7' : '#e0f2fe',
                  color: (project.jenisAnggaran === 'APBD-P' || project.jenisAnggaran === 'Perubahan') ? '#b45309' : '#0369a1',
                  border: `1px solid ${(project.jenisAnggaran === 'APBD-P' || project.jenisAnggaran === 'Perubahan') ? '#fde68a' : '#bae6fd'}`
                }}
              >
                {(project.jenisAnggaran === 'APBD-P' || project.jenisAnggaran === 'Perubahan') ? '(APBD-P)' : 'APBD Murni'}
              </span>
              {project.kecamatan && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  Kec. {project.kecamatan} {project.desa ? `• Desa ${project.desa}` : ''}
                </span>
              )}
              <span style={{ fontSize: 12, color: '#64748b' }}>
                Kode: <strong>{project.id}</strong> • TA {project.tahunAnggaran}
              </span>
            </div>
            <h3 style={{ fontSize: 18, color: '#0f2c59', marginBottom: 6 }}>{project.namaPaket}</h3>

            {/* Tagging Badges */}
            {project.tags && project.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {project.tags.map((tg, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      background: 'rgba(37, 99, 235, 0.08)',
                      color: '#1d4ed8',
                      border: '1px solid rgba(37, 99, 235, 0.25)',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Tag size={10} />
                    {tg}
                  </span>
                ))}
              </div>
            )}

            {/* Lokasi, Koordinat & Highlight Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#475569' }}>
                <MapPin size={13} color="#ef4444" />
                {project.lokasi || 'Lokasi pekerjaan'}
              </span>

              {(project.latitude || project.koordinat?.lat) && (
                <a
                  href={`https://www.google.com/maps?q=${project.latitude || project.koordinat?.lat},${project.longitude || project.koordinat?.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    color: '#0284c7',
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                  title="Buka titik koordinat di Google Maps"
                >
                  <Navigation size={11} />
                  <span>Titik: {project.latitude || project.koordinat?.lat}, {project.longitude || project.koordinat?.lng}</span>
                  <ExternalLink size={10} />
                </a>
              )}

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: project.isPublicHighlight !== false ? '#f0fdf4' : '#f8fafc',
                  color: project.isPublicHighlight !== false ? '#15803d' : '#64748b',
                  border: project.isPublicHighlight !== false ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                }}
              >
                <Sparkles size={11} color={project.isPublicHighlight !== false ? '#16a34a' : '#94a3b8'} />
                {project.isPublicHighlight !== false ? 'Tayang di Beranda Publik' : 'Hanya Internal'}
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Header */}
        <div style={{ padding: '0 28px', background: '#fafbfc', borderBottom: '1px solid #e2e8f0' }}>
          <div className="tab-nav" style={{ marginBottom: 0 }}>
            <button
              className={`tab-btn ${activeTab === 'fisik' ? 'active' : ''}`}
              onClick={() => setActiveTab('fisik')}
            >
              <TrendingUp size={16} />
              Progres Fisik & Kurva S
            </button>
            <button
              className={`tab-btn ${activeTab === 'keuangan' ? 'active' : ''}`}
              onClick={() => setActiveTab('keuangan')}
            >
              <DollarSign size={16} />
              Progres Keuangan & Termin
            </button>
            <button
              className={`tab-btn ${activeTab === 'spj' ? 'active' : ''}`}
              onClick={() => setActiveTab('spj')}
            >
              <ReceiptText size={16} />
              Administrasi SPJ Keuangan
            </button>
            <button
              className={`tab-btn ${activeTab === 'prakontrak' ? 'active' : ''}`}
              onClick={() => setActiveTab('prakontrak')}
            >
              <Clock size={16} />
              Tahapan Pra-Kontrak
            </button>
            <button
              className={`tab-btn ${activeTab === 'identitas' ? 'active' : ''}`}
              onClick={() => setActiveTab('identitas')}
            >
              <Building2 size={16} />
              Rekanan & Kontrak
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* TAB 1: PROGRES FISIK & KURVA S */}
          {activeTab === 'fisik' && (
            <div>
              {/* Quick KPI stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 14,
                  marginBottom: 20
                }}
              >
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>TARGET RENCANA</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7', marginTop: 4 }}>
                    {dataFisik.progresRencana || 0}%
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>REALISASI FISIK</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginTop: 4 }}>
                    {dataFisik.progresRealisasi || 0}%
                  </div>
                </div>

                <div
                  style={{
                    background: deviasi < -5 ? '#fee2e2' : deviasi < 0 ? '#fef3c7' : '#dcfce7',
                    padding: '14px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ fontSize: 12, color: deviasi < 0 ? '#991b1b' : '#166534', fontWeight: 600 }}>
                    DEVIASI PEKERJAAN
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: deviasi < 0 ? '#b91c1c' : '#15803d',
                      marginTop: 4
                    }}
                  >
                    {deviasi >= 0 ? `+${deviasi}%` : `${deviasi}%`}
                  </div>
                </div>
              </div>

              {/* Kurva S Card */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  marginBottom: 20
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f2c59' }}>
                    Visualisasi Kurva S (Rencana vs Realisasi)
                  </h4>
                  <span className={`badge badge-${(dataFisik.statusDeviasi || 'aman').toLowerCase()}`}>
                    Status: {dataFisik.statusDeviasi || 'Aman'}
                  </span>
                </div>
                <ScurveChart data={dataFisik.mingguanKurvaS || []} height={260} />
              </div>

              {/* Kendala Lapangan */}
              <div
                style={{
                  background: '#fafbfc',
                  padding: '16px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  marginBottom: 20
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59', marginBottom: 6 }}>
                  Catatan Pengawasan & Kendala Lapangan:
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                  {dataFisik.kendalaLapangan || 'Belum ada kendala lapangan yang dilaporkan.'}
                </p>
              </div>

              {/* Galeri Foto Dokumentasi Lapangan */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f2c59', marginBottom: 12 }}>
                  Dokumentasi Foto Lapangan (0%, 50%, 100%)
                </h4>
                {(!dataFisik.fotoDokumentasi || dataFisik.fotoDokumentasi.length === 0) ? (
                  <div
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      borderRadius: 10,
                      border: '1px dashed #cbd5e1',
                      color: '#64748b',
                      fontSize: 13
                    }}
                  >
                    Belum ada foto dokumentasi lapangan yang diunggah.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                    {dataFisik.fotoDokumentasi.map((foto, idx) => (
                      <div
                        key={idx}
                        style={{
                          borderRadius: 10,
                          overflow: 'hidden',
                          border: '1px solid #e2e8f0',
                          background: '#fff'
                        }}
                      >
                        <img
                          src={foto.url}
                          alt={foto.label}
                          style={{ width: '100%', height: 140, objectFit: 'cover' }}
                        />
                        <div style={{ padding: '10px' }}>
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              background: '#0f2c59',
                              color: '#fff',
                              padding: '2px 6px',
                              borderRadius: 4
                            }}
                          >
                            {foto.tahap}
                          </span>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>
                            {foto.label}
                          </div>
                          {foto.tanggal && (
                            <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>
                              {foto.tanggal}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROGRES KEUANGAN & TERMIN */}
          {activeTab === 'keuangan' && (
            <div>
              {/* Financial Summary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 12,
                  marginBottom: 20
                }}
              >
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>PAGU DPA</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f2c59', marginTop: 4 }}>
                    Rp {pagu.toLocaleString('id-ID')}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>NILAI KONTRAK</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0284c7', marginTop: 4 }}>
                    Rp {nilaiKontrak.toLocaleString('id-ID')}
                  </div>
                </div>

                <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: 11, color: '#166534', fontWeight: 600 }}>PENCAIRAN SP2D</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d', marginTop: 4 }}>
                    Rp {totalCair.toLocaleString('id-ID')} ({persenKeuangan}%)
                  </div>
                </div>

                <div style={{ background: '#fffbeb', padding: '12px 14px', borderRadius: 10, border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>SISA ANGGARAN KONTRAK</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#b45309', marginTop: 4 }}>
                    Rp {sisaKontrak.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Progress comparison */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  marginBottom: 20
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12.5, fontWeight: 600 }}>
                  <span>Perbandingan Penyerapan:</span>
                  <span>Fisik: <strong>{dataFisik.progresRealisasi || 0}%</strong> vs Keuangan: <strong>{persenKeuangan}%</strong></span>
                </div>
                <div style={{ height: 10, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden', display: 'flex' }}>
                  <div
                    style={{
                      width: `${persenKeuangan}%`,
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      height: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Riwayat SP2D */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f2c59', marginBottom: 12 }}>
                  Riwayat Pencairan Termin / SP2D Tim Keuangan
                </h4>
                {(!dataKeuangan.terminHistory || dataKeuangan.terminHistory.length === 0) ? (
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      borderRadius: 10,
                      border: '1px dashed #cbd5e1',
                      color: '#64748b',
                      fontSize: 13
                    }}
                  >
                    Belum ada riwayat SP2D untuk pekerjaan ini.
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Termin</th>
                          <th>Nomor SP2D</th>
                          <th>Tanggal SP2D</th>
                          <th>Jumlah Pencairan (Rp)</th>
                          <th>Persentase</th>
                          <th>Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataKeuangan.terminHistory.map((t, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 700, color: '#0f2c59' }}>{t.terminKe}</td>
                            <td>
                              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0369a1' }}>
                                {t.nomorSP2D || '-'}
                              </span>
                            </td>
                            <td>{t.tanggalSP2D || '-'}</td>
                            <td style={{ fontWeight: 700, color: '#059669' }}>
                              Rp {(parseFloat(t.jumlah) || 0).toLocaleString('id-ID')}
                            </td>
                            <td>
                              <span style={{ fontWeight: 700 }}>
                                {nilaiKontrak > 0 ? ((parseFloat(t.jumlah) / nilaiKontrak) * 100).toFixed(1) : 0}%
                              </span>
                            </td>
                            <td style={{ fontSize: 12, color: '#64748b' }}>{t.catatan || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: ADMINISTRASI SPJ KEUANGAN */}
          {activeTab === 'spj' && (
            <div>
              {/* SPJ Status Banner */}
              <div
                style={{
                  background:
                    spj.status === 'Selesai SP2D'
                      ? '#f0fdf4'
                      : spj.status === 'Dikembalikan (Perlu Revisi)'
                      ? '#fef2f2'
                      : spj.status === 'Sudah Terbit SPM'
                      ? '#eff6ff'
                      : '#faf5ff',
                  border:
                    spj.status === 'Selesai SP2D'
                      ? '1px solid #bbf7d0'
                      : spj.status === 'Dikembalikan (Perlu Revisi)'
                      ? '1px solid #fecaca'
                      : spj.status === 'Sudah Terbit SPM'
                      ? '1px solid #bfdbfe'
                      : '1px solid #e9d5ff',
                  padding: '18px 20px',
                  borderRadius: 12,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>STATUS VERIFIKASI SPJ SAAT INI</div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color:
                        spj.status === 'Selesai SP2D'
                          ? '#15803d'
                          : spj.status === 'Dikembalikan (Perlu Revisi)'
                          ? '#dc2626'
                          : spj.status === 'Sudah Terbit SPM'
                          ? '#1d4ed8'
                          : '#7e22ce',
                      marginTop: 2
                    }}
                  >
                    {spj.status || 'Belum Mengajukan SPJ'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>Pemeriksa / Verifikator:</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59' }}>
                    {spj.diverifikasiOleh || 'Tim Sub Bagian Program & Keuangan'}
                  </div>
                </div>
              </div>

              {/* SPJ Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 14,
                  marginBottom: 20
                }}
              >
                <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>TANGGAL BERKAS MASUK</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f2c59', marginTop: 4 }}>
                    {spj.tanggalMasuk || '-'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>NOMOR & TANGGAL SPM</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f2c59', marginTop: 4 }}>
                    {spj.noSPM ? `${spj.noSPM} (${spj.tanggalSPM || '-'})` : 'Belum Terbit SPM'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>NOMOR & TANGGAL SP2D</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f2c59', marginTop: 4 }}>
                    {spj.noSP2D ? `${spj.noSP2D} (${spj.tanggalSP2D || '-'})` : '-'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>STATUS KOREKSI AKHIR TAHUN</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f2c59', marginTop: 4 }}>
                    {spj.status === 'Dikembalikan (Perlu Revisi)'
                      ? '⚠️ Membutuhkan Perbaikan Berkas'
                      : spj.status === 'Sedang Dikoreksi'
                      ? '🔍 Dalam Proses Koreksi Berkas'
                      : '✅ Sesuai Prosedur'}
                  </div>
                </div>
              </div>

              {/* Catatan Verifikator */}
              <div
                style={{
                  background: '#fafbfc',
                  padding: '16px 18px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f2c59', marginBottom: 6 }}>
                  Catatan Verifikasi & Catatan Koreksi SPJ:
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {spj.catatanVerifikasi || 'Tidak ada catatan koreksi untuk berkas ini.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TAHAPAN PRA-KONTRAK */}
          {activeTab === 'prakontrak' && (
            <div>
              <div
                style={{
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  marginBottom: 20
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>KATEGORI / TIPE PEKERJAAN</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f2c59', marginTop: 2 }}>
                      {project.kategoriPekerjaan || 'Fisik'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>JENIS PENGADAAN</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f2c59', marginTop: 2 }}>
                      {project.tipePengadaan}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>KODE RUP (SiRUP)</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f2c59', marginTop: 2 }}>
                      {project.kodeRUP || '-'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>STATUS SAAT INI</div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color:
                          project.statusDeviasi === 'Batal' || praKontrak.status === 'batal'
                            ? '#dc2626'
                            : project.isKontrak
                            ? '#059669'
                            : '#d97706',
                        marginTop: 2
                      }}
                    >
                      {project.statusDeviasi === 'Batal' || praKontrak.status === 'batal'
                        ? '❌ Batal Pelaksanaan'
                        : project.isKontrak
                        ? '✅ Sudah Terkontrak'
                        : 'Dalam Proses Alur Pra-Kontrak'}
                    </div>
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f2c59', marginBottom: 14 }}>
                Tahapan Alur Pengadaan (Pra-Kontrak - 12 Tahap):
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(praKontrakStages && praKontrakStages.length > 0 ? praKontrakStages : TAHAPAN_PRA_KONTRAK).map((t, idx) => {
                  const stagesList = praKontrakStages && praKontrakStages.length > 0 ? praKontrakStages : TAHAPAN_PRA_KONTRAK;
                  const isProjectCancelled = project.statusDeviasi === 'Batal' || praKontrak.status === 'batal';
                  const currentOrder =
                    stagesList.find((x) => x.id === praKontrak.status)?.order ||
                    (project.isKontrak ? 11 : 1);
                  const isDone = !isProjectCancelled && currentOrder >= t.order;
                  const isCurrent = isProjectCancelled ? t.id === 'batal' : currentOrder === t.order;
                  const isBatalStage = t.id === 'batal';

                  return (
                    <div
                      key={t.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: isCurrent
                          ? isBatalStage
                            ? '2px solid #dc2626'
                            : '2px solid #0f2c59'
                          : '1px solid #e2e8f0',
                        background: isCurrent
                          ? isBatalStage
                            ? '#fef2f2'
                            : '#f0fdf4'
                          : isDone
                          ? '#fafbfc'
                          : '#ffffff'
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          background: isCurrent && isBatalStage ? '#dc2626' : isDone ? '#059669' : '#e2e8f0',
                          color: isCurrent && isBatalStage ? '#ffffff' : isDone ? '#ffffff' : '#64748b'
                        }}
                      >
                        {isCurrent && isBatalStage ? '✕' : isDone ? '✓' : idx + 1}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: isCurrent ? 800 : 600,
                            color: isCurrent && isBatalStage ? '#dc2626' : isDone ? '#0f2c59' : '#94a3b8'
                          }}
                        >
                          {t.label}
                        </div>
                        {isCurrent && (
                          <div
                            style={{
                              fontSize: 11.5,
                              color: isBatalStage ? '#dc2626' : '#059669',
                              fontWeight: 600,
                              marginTop: 2
                            }}
                          >
                            {isBatalStage
                              ? `Alasan Batal: ${praKontrak.catatanPraKontrak || 'Pekerjaan dibatalkan'}`
                              : `Tahap Sedang Berjalan: ${praKontrak.catatanPraKontrak || 'Sedang diproses oleh PPK/Pokja'}`}
                          </div>
                        )}
                      </div>

                      {isDone && (
                        <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>
                          Selesai
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: REKANAN & KONTRAK */}
          {activeTab === 'identitas' && (
            <div className="form-grid">
              <div className="form-group form-grid-full">
                <div style={{ padding: '16px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>NAMA REKANAN PELAKSANA</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f2c59', marginTop: 4 }}>
                    {dataKontrak.namaPenyedia || 'Belum Ditunjuk / Tahap Pemilihan'}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, display: 'flex', gap: 16 }}>
                    <span>NPWP: <strong>{dataKontrak.npwpPenyedia || '-'}</strong></span>
                    <span>Bank: <strong>{dataKontrak.bankPenyedia || '-'}</strong> ({dataKontrak.nomorRekening || '-'})</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nomor Kontrak</label>
                <div style={{ fontWeight: 600, color: '#0f2c59' }}>{dataKontrak.nomorKontrak || '-'}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal Kontrak</label>
                <div style={{ fontWeight: 600, color: '#0f2c59' }}>{dataKontrak.tanggalKontrak || '-'}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Waktu Pelaksanaan</label>
                <div style={{ fontWeight: 600, color: '#0f2c59' }}>
                  {dataKontrak.waktuPelaksanaan ? `${dataKontrak.waktuPelaksanaan} Hari Kalender` : '-'}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Periode SPMK (Mulai & Selesai Kontrak)</label>
                <div style={{ fontWeight: 600, color: '#0f2c59' }}>
                  {dataKontrak.tanggalMulai || '-'} s/d {dataKontrak.tanggalSelesai || '-'}
                </div>
              </div>

              <div className="form-group form-grid-full">
                <label className="form-label">Konsultan Pengawas / Tim Pengawas</label>
                <div style={{ fontWeight: 600, color: '#0f2c59' }}>
                  {dataKontrak.konsultanPengawas || 'Pengawas Internal DINPUTARU'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {onEdit && (
            <button className="btn btn-outline" onClick={onEdit}>
              Ubah Data Ini
            </button>
          )}
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={15} />
            Cetak Lembar Monitoring
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
