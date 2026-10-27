import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  RefreshCw,
  Info,
  Filter,
  Check,
  Building2,
  Trash2
} from 'lucide-react';
import {
  parseExcelOrCsvFile,
  downloadExcelTemplate,
  downloadCsvTemplate,
  exportProjectsToExcel,
  exportProjectsToCsv
} from '../utils/excelUtils';
import { BIDANG_LIST } from '../data/constants';

const ImportExportModal = ({
  isOpen,
  onClose,
  initialTab = 'import', // 'import' | 'export' | 'template'
  filteredProjects = []
}) => {
  const {
    activeYear,
    accessibleProjects,
    bulkImportProjects,
    canCreateProject,
    currentUser,
    years
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab); // 'import' | 'export' | 'template'
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [importMode, setImportMode] = useState('append'); // 'append' | 'replace_year'
  const [targetYear, setTargetYear] = useState(activeYear);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessData, setImportSuccessData] = useState(null);
  const [searchPreview, setSearchPreview] = useState('');

  // Export options
  const [exportScope, setExportScope] = useState('filtered'); // 'all' | 'filtered'
  const [exportFormat, setExportFormat] = useState('xlsx'); // 'xlsx' | 'csv'

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const resetImportState = () => {
    setFile(null);
    setParseResult(null);
    setParseError(null);
    setIsParsing(false);
    setIsImporting(false);
    setImportSuccessData(null);
    setSearchPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);
    setParseError(null);
    setParseResult(null);
    setImportSuccessData(null);

    try {
      const result = await parseExcelOrCsvFile(selectedFile, targetYear);
      if (result.success) {
        setParseResult(result);
      } else {
        setParseError(result.message || 'Gagal memproses struktur file Excel/CSV.');
      }
    } catch (err) {
      console.error('Import parse error:', err);
      setParseError('Terjadi kesalahan saat membaca file. Pastikan format file .xlsx, .xls, atau .csv valid.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      if (['xlsx', 'xls', 'csv'].includes(ext)) {
        if (fileInputRef.current) {
          const dt = new DataTransfer();
          dt.items.add(droppedFile);
          fileInputRef.current.files = dt.files;
          handleFileChange({ target: { files: dt.files } });
        }
      } else {
        alert('Format file tidak didukung. Mohon unggah file dengan format .xlsx, .xls, atau .csv');
      }
    }
  };

  const handleConfirmImport = async () => {
    if (!parseResult || !parseResult.validRows || parseResult.validRows.length === 0) return;

    setIsImporting(true);
    try {
      // Adjust year if targetYear is chosen
      const rowsToImport = parseResult.validRows.map((r) => ({
        ...r,
        tahunAnggaran: targetYear || r.tahunAnggaran
      }));

      const success = bulkImportProjects(rowsToImport, importMode);
      if (success) {
        setImportSuccessData({
          count: rowsToImport.length,
          year: targetYear,
          mode: importMode
        });
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data import.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportNow = () => {
    const dataToExport = exportScope === 'filtered' ? filteredProjects : accessibleProjects;
    if (!dataToExport || dataToExport.length === 0) {
      alert('Tidak ada data paket pekerjaan untuk diexport!');
      return;
    }

    if (exportFormat === 'xlsx') {
      exportProjectsToExcel(dataToExport, activeYear);
    } else {
      exportProjectsToCsv(dataToExport, activeYear);
    }
    onClose();
  };

  // Preview filtering
  const previewRows = parseResult?.validRows?.filter((row) => {
    if (!searchPreview.trim()) return true;
    const q = searchPreview.toLowerCase();
    return (
      row.namaPaket?.toLowerCase().includes(q) ||
      row.id?.toLowerCase().includes(q) ||
      row.dataKontrak?.namaPenyedia?.toLowerCase().includes(q) ||
      row.kecamatan?.toLowerCase().includes(q)
    );
  }) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 960,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 16
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            background: 'linear-gradient(135deg, #0f2c59 0%, #1e40af 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            borderBottom: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)'
              }}
            >
              <FileSpreadsheet size={24} color="#f8fafc" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#ffffff' }}>
                Import & Export Data Pekerjaan
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#93c5fd' }}>
                Kelola data pekerjaan dalam jumlah banyak secara massal melalui spreadsheet Excel / CSV
              </p>
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              borderRadius: 8
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 24px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 18px',
              fontSize: 13.5,
              fontWeight: 700,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'import' ? '#0f2c59' : '#64748b',
              borderBottom: activeTab === 'import' ? '3px solid #0f2c59' : '3px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <Upload size={16} color={activeTab === 'import' ? '#2563eb' : '#94a3b8'} />
            <span>Import Data Massal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 18px',
              fontSize: 13.5,
              fontWeight: 700,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'export' ? '#0f2c59' : '#64748b',
              borderBottom: activeTab === 'export' ? '3px solid #0f2c59' : '3px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <Download size={16} color={activeTab === 'export' ? '#059669' : '#94a3b8'} />
            <span>Export Data ({accessibleProjects.length} Paket)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('template')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 18px',
              fontSize: 13.5,
              fontWeight: 700,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'template' ? '#0f2c59' : '#64748b',
              borderBottom: activeTab === 'template' ? '3px solid #0f2c59' : '3px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <HelpCircle size={16} color={activeTab === 'template' ? '#d97706' : '#94a3b8'} />
            <span>Unduh Template & Petunjuk</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* TAB 1: IMPORT DATA */}
          {activeTab === 'import' && (
            <div>
              {!canCreateProject() ? (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 12,
                    padding: 20,
                    textAlign: 'center',
                    color: '#991b1b'
                  }}
                >
                  <AlertCircle size={36} style={{ margin: '0 auto 10px', color: '#dc2626' }} />
                  <div style={{ fontWeight: 800, fontSize: 16 }}>Akses Impor Dibatasi</div>
                  <p style={{ margin: '6px 0 0', fontSize: 13 }}>
                    Akun Anda ({currentUser?.nama} - {currentUser?.role}) memiliki wewenang peninjauan (Read-Only).
                    Fitur impor data massal hanya dapat dilakukan oleh <strong>Koordinator Bidang</strong> atau <strong>Superadmin</strong>.
                  </p>
                </div>
              ) : importSuccessData ? (
                /* Success View */
                <div
                  style={{
                    textAlign: 'center',
                    padding: '36px 20px',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    borderRadius: 16,
                    border: '1.5px solid #86efac'
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: '#16a34a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    <Check size={36} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#166534', margin: 0 }}>
                    Impor Berhasil Dilakukan!
                  </h3>
                  <p style={{ fontSize: 14, color: '#15803d', margin: '8px 0 20px' }}>
                    Sebanyak <strong>{importSuccessData.count} paket pekerjaan</strong> berhasil diintegrasikan ke
                    Master Data Tahun Anggaran {importSuccessData.year} dan otomatis tersinkronisasi ke modul Pra-Kontrak, Fisik, Keuangan, & SPJ.
                  </p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={resetImportState}
                      style={{ background: '#ffffff' }}
                    >
                      <RefreshCw size={14} style={{ marginRight: 6 }} />
                      Impor File Lain
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={onClose}
                      style={{
                        background: '#16a34a',
                        borderColor: '#16a34a',
                        padding: '10px 24px',
                        fontWeight: 700
                      }}
                    >
                      Lihat Master Data Pekerjaan
                    </button>
                  </div>
                </div>
              ) : !parseResult ? (
                /* Step 1: Upload File & Template Helper */
                <div>
                  {/* Banner Unduh Template */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                      border: '1px solid #bfdbfe',
                      borderRadius: 12,
                      padding: '16px 20px',
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: '#2563eb',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <HelpCircle size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1e3a8a' }}>
                          Belum memiliki format file yang sesuai?
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                          Unduh template resmi DINPUTARU yang telah dilengkapi contoh data dan petunjuk pengisian.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={downloadExcelTemplate}
                        className="btn btn-outline"
                        style={{
                          background: '#ffffff',
                          borderColor: '#10b981',
                          color: '#047857',
                          fontSize: 12,
                          padding: '7px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <FileSpreadsheet size={14} color="#10b981" />
                        <span>Unduh Template Excel (.xlsx)</span>
                      </button>
                      <button
                        type="button"
                        onClick={downloadCsvTemplate}
                        className="btn btn-outline"
                        style={{
                          background: '#ffffff',
                          borderColor: '#3b82f6',
                          color: '#1d4ed8',
                          fontSize: 12,
                          padding: '7px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <FileText size={14} color="#3b82f6" />
                        <span>Unduh CSV (.csv)</span>
                      </button>
                    </div>
                  </div>

                  {/* Dropzone Upload */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #94a3b8',
                      borderRadius: 14,
                      padding: '40px 24px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.background = '#f0f7ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#94a3b8';
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />

                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 14,
                        background: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 14px'
                      }}
                    >
                      <Upload size={28} />
                    </div>

                    <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: '#0f2c59' }}>
                      Pilih atau Tarik (Drag & Drop) File Spreadsheet Disini
                    </h4>
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b' }}>
                      Mendukung format Microsoft Excel (<strong>.xlsx</strong>, <strong>.xls</strong>) dan text (<strong>.csv</strong>)
                    </p>
                    <span
                      className="btn btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 18px',
                        fontSize: 13
                      }}
                    >
                      <FileSpreadsheet size={16} />
                      Pilih File Dari Komputer
                    </span>
                  </div>

                  {/* Loading Parsing Indicator */}
                  {isParsing && (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b' }}>
                      <RefreshCw size={24} className="spin" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Sedang membaca dan menganalisis file spreadsheet...</div>
                    </div>
                  )}

                  {/* Error Notification */}
                  {parseError && (
                    <div
                      style={{
                        marginTop: 16,
                        background: '#fee2e2',
                        border: '1px solid #fca5a5',
                        borderRadius: 10,
                        padding: '14px 18px',
                        color: '#991b1b',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12
                      }}
                    >
                      <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong>Terjadi Kesalahan:</strong> {parseError}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Step 2: Live Preview & Validation */
                <div>
                  {/* File Info & KPI Header */}
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '16px 20px',
                      marginBottom: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileSpreadsheet size={18} color="#059669" />
                        <span style={{ fontWeight: 800, fontSize: 14, color: '#0f2c59' }}>
                          {file?.name}
                        </span>
                        <span
                          style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '2px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700
                          }}
                        >
                          {parseResult.validCount} Paket Siap Diimpor
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                        Sheet: <strong>{parseResult.sheetName}</strong> • Ukuran:{' '}
                        {(file?.size ? (file.size / 1024).toFixed(1) : 0)} KB
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={resetImportState}
                      style={{ fontSize: 12, padding: '6px 12px' }}
                    >
                      <RefreshCw size={13} style={{ marginRight: 6 }} />
                      Ganti File
                    </button>
                  </div>

                  {/* Warning jika ada baris tidak valid */}
                  {parseResult.invalidCount > 0 && (
                    <div
                      style={{
                        background: '#fef3c7',
                        border: '1px solid #fde68a',
                        borderRadius: 10,
                        padding: '12px 16px',
                        marginBottom: 16,
                        color: '#92400e',
                        fontSize: 12.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10
                      }}
                    >
                      <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong>{parseResult.invalidCount} Baris dilewati:</strong> Terdapat baris tanpa Nama Paket Pekerjaan atau kolom kosong.
                      </div>
                    </div>
                  )}

                  {/* Pengaturan Impor */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 18,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: 14
                    }}
                  >
                    <div>
                      <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>
                        Target Tahun Anggaran:
                      </label>
                      <select
                        className="form-control"
                        value={targetYear}
                        onChange={(e) => setTargetYear(parseInt(e.target.value, 10))}
                        style={{ height: 38 }}
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            Tahun Anggaran {y} {y === activeYear ? '(Aktif)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>
                        Metode Penggabungan Data:
                      </label>
                      <select
                        className="form-control"
                        value={importMode}
                        onChange={(e) => setImportMode(e.target.value)}
                        style={{ height: 38 }}
                      >
                        <option value="append">Tambahkan & Perbarui (Upsert / Append)</option>
                        <option value="replace_year">Gantikan Semua Data Tahun {targetYear} (Replace)</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Search Preview */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
                      Pratinjau Data yang Akan Diimpor ({previewRows.length} dari {parseResult.validCount})
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari dalam pratinjau..."
                      value={searchPreview}
                      onChange={(e) => setSearchPreview(e.target.value)}
                      style={{ width: 240, height: 32, fontSize: 12 }}
                    />
                  </div>

                  {/* Table Preview */}
                  <div
                    className="table-container"
                    style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}
                  >
                    <table className="data-table" style={{ fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Bidang</th>
                          <th>Nama Paket Pekerjaan</th>
                          <th>Kecamatan & Desa</th>
                          <th>Pagu (Rp)</th>
                          <th>Nilai Kontrak (Rp)</th>
                          <th>Penyedia (CV/PT)</th>
                          <th>Fisik (%)</th>
                          <th>SPJ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, idx) => {
                          const bInfo = BIDANG_LIST.find((b) => b.id === row.bidangId);
                          return (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>
                                <span
                                  style={{
                                    background: bInfo?.bgLight || '#eff6ff',
                                    color: bInfo?.warna || '#2563eb',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    fontWeight: 700,
                                    fontSize: 10.5
                                  }}
                                >
                                  {bInfo?.singkatan || row.bidangId}
                                </span>
                              </td>
                              <td style={{ fontWeight: 600, color: '#0f2c59', maxWidth: 220 }}>
                                {row.namaPaket}
                              </td>
                              <td>
                                {row.kecamatan}{row.desa ? `, ${row.desa}` : ''}
                              </td>
                              <td style={{ fontWeight: 700 }}>
                                Rp {parseFloat(row.paguAnggaran || 0).toLocaleString('id-ID')}
                              </td>
                              <td>
                                {row.dataKontrak?.nilaiKontrak > 0 ? (
                                  `Rp ${parseFloat(row.dataKontrak.nilaiKontrak).toLocaleString('id-ID')}`
                                ) : (
                                  <span style={{ color: '#94a3b8' }}>-</span>
                                )}
                              </td>
                              <td>{row.dataKontrak?.namaPenyedia || '-'}</td>
                              <td>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: row.dataFisik?.progresRealisasi >= 100 ? '#16a34a' : '#2563eb'
                                  }}
                                >
                                  {row.dataFisik?.progresRealisasi || 0}%
                                </span>
                              </td>
                              <td>
                                <span style={{ fontSize: 11, color: '#64748b' }}>
                                  {(row.administrasiSPJ?.status || 'belum_masuk').replace(/_/g, ' ')}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      marginTop: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={resetImportState}
                    >
                      Batal & Pilih File Lain
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleConfirmImport}
                      disabled={isImporting || parseResult.validCount === 0}
                      style={{
                        padding: '10px 24px',
                        fontWeight: 800,
                        background: '#2563eb',
                        borderColor: '#2563eb',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                      }}
                    >
                      {isImporting ? (
                        <>
                          <RefreshCw size={16} className="spin" />
                          <span>Menyimpan ke Master Data...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Simpan & Import {parseResult.validCount} Paket Pekerjaan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPORT DATA */}
          {activeTab === 'export' && (
            <div>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  padding: 24,
                  marginBottom: 20
                }}
              >
                <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: '#0f2c59' }}>
                  Pilih Lingkup & Format Data Ekspor
                </h4>

                {/* Scope selection */}
                <div style={{ marginBottom: 20 }}>
                  <label className="form-label" style={{ fontWeight: 700, marginBottom: 8, display: 'block' }}>
                    1. Lingkup Pekerjaan yang Diekspor:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                    <div
                      onClick={() => setExportScope('filtered')}
                      style={{
                        border: exportScope === 'filtered' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: exportScope === 'filtered' ? '#eff6ff' : '#ffffff',
                        borderRadius: 10,
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#0f2c59' }}>
                        Pekerjaan Sesuai Filter Aktif
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                        Hanya mengekspor <strong>{filteredProjects.length} paket</strong> yang saat ini tampil di tabel Master Data
                      </div>
                    </div>

                    <div
                      onClick={() => setExportScope('all')}
                      style={{
                        border: exportScope === 'all' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: exportScope === 'all' ? '#eff6ff' : '#ffffff',
                        borderRadius: 10,
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#0f2c59' }}>
                        Seluruh Paket TA {activeYear}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                        Mengekspor semua paket yang dapat Anda akses (<strong>{accessibleProjects.length} paket</strong>)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Format selection */}
                <div style={{ marginBottom: 24 }}>
                  <label className="form-label" style={{ fontWeight: 700, marginBottom: 8, display: 'block' }}>
                    2. Format Berkas Ekspor:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                    <div
                      onClick={() => setExportFormat('xlsx')}
                      style={{
                        border: exportFormat === 'xlsx' ? '2px solid #059669' : '1px solid #e2e8f0',
                        background: exportFormat === 'xlsx' ? '#f0fdf4' : '#ffffff',
                        borderRadius: 10,
                        padding: '14px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                      }}
                    >
                      <FileSpreadsheet size={28} color="#059669" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#166534' }}>
                          Microsoft Excel (.xlsx)
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748b' }}>
                          Format tabel rapi, lebar kolom otomatis, dan format angka IDR
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setExportFormat('csv')}
                      style={{
                        border: exportFormat === 'csv' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: exportFormat === 'csv' ? '#eff6ff' : '#ffffff',
                        borderRadius: 10,
                        padding: '14px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                      }}
                    >
                      <FileText size={28} color="#2563eb" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#1e40af' }}>
                          Comma-Separated Values (.csv)
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748b' }}>
                          Kompatibel dengan sistem eksternal & database (UTF-8 BOM)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download trigger */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleExportNow}
                  style={{
                    padding: '12px 24px',
                    fontWeight: 800,
                    fontSize: 14,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: exportFormat === 'xlsx' ? '#059669' : '#2563eb',
                    borderColor: exportFormat === 'xlsx' ? '#059669' : '#2563eb',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  <Download size={18} />
                  <span>
                    Unduh Berkas Sekarang ({exportScope === 'filtered' ? filteredProjects.length : accessibleProjects.length} Paket)
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: UNDUH TEMPLATE & PETUNJUK */}
          {activeTab === 'template' && (
            <div>
              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: 14,
                  padding: 24,
                  marginBottom: 24
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f2c59' }}>
                      Template Resmi Spreadsheet SIMON - SATUPUTARU
                    </h4>
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569' }}>
                      Gunakan template ini untuk mempermudah pengetikan data di komputer atau laptop. Tersedia 5 contoh riil untuk seluruh bidang dinas.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={downloadExcelTemplate}
                      className="btn btn-primary"
                      style={{
                        background: '#059669',
                        borderColor: '#059669',
                        padding: '10px 18px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                      }}
                    >
                      <FileSpreadsheet size={16} />
                      <span>Unduh Template Excel (.xlsx)</span>
                    </button>
                    <button
                      type="button"
                      onClick={downloadCsvTemplate}
                      className="btn btn-outline"
                      style={{
                        background: '#ffffff',
                        borderColor: '#0284c7',
                        color: '#0284c7',
                        padding: '10px 18px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <FileText size={16} />
                      <span>Unduh Format CSV (.csv)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabel Ringkasan Kolom & Nilai */}
              <h5 style={{ fontSize: 14, fontWeight: 800, color: '#0f2c59', marginBottom: 10 }}>
                Panduan Kolom & Nilai yang Diizinkan:
              </h5>

              <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}>
                <table className="data-table" style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 180 }}>Nama Kolom Header</th>
                      <th style={{ width: 100 }}>Status</th>
                      <th>Keterangan Nilai / Format</th>
                      <th>Contoh Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Nama Paket Pekerjaan</td>
                      <td><span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>WAJIB</span></td>
                      <td>Nama resmi kegiatan paket konstruksi/jasa/pengadaan</td>
                      <td>Peningkatan Jalan Trengguli - Mijen</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Bidang Dinas</td>
                      <td><span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>WAJIB</span></td>
                      <td>Pilihan: <strong>Bina Marga</strong>, <strong>Cipta Karya</strong>, <strong>SDA</strong>, <strong>Tata Ruang</strong>, <strong>Sekretariat</strong></td>
                      <td>Bina Marga</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Kategori Pekerjaan</td>
                      <td><span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>OPSIONAL</span></td>
                      <td>Pilihan: <strong>Fisik</strong>, <strong>Jakon</strong>, <strong>Barang</strong>, <strong>Jasa Lainnya</strong>, <strong>Swakelola</strong> (Default: Fisik)</td>
                      <td>Fisik</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Jenis Anggaran</td>
                      <td><span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>OPSIONAL</span></td>
                      <td>Pilihan: <strong>Murni</strong> atau <strong>APBD-P</strong> (Perubahan)</td>
                      <td>Murni</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Pagu Anggaran (Rp)</td>
                      <td><span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>OPSIONAL</span></td>
                      <td>Nominal pagu anggaran dalam bentuk angka rupiah</td>
                      <td>4200000000</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Kecamatan & Desa</td>
                      <td><span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>OPSIONAL</span></td>
                      <td>Nama kecamatan (14 kec se-Kab. Demak) dan desa/kelurahan</td>
                      <td>Mijen, Bakung</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Tahap Pra-Kontrak</td>
                      <td><span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>OPSIONAL</span></td>
                      <td>Entri SiRUP, Survei Lokasi, Survei Harga, Perencanaan, Kirim LPSE, RPP, Revisi, Tayang, Re Tender, SPPBJ, Kontrak, Batal</td>
                      <td>Kontrak</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Nama Penyedia (CV/PT)</td>
                      <td><span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>OPSIONAL</span></td>
                      <td>Nama perusahaan rekanan pemenang kontrak/SPK</td>
                      <td>PT. Sarana Marga Persada Demak</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Progres Fisik (%)</td>
                      <td><span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>OPSIONAL</span></td>
                      <td>Angka persentase rencana dan realisasi kerja lapangan (0 s/d 100)</td>
                      <td>60 (Rencana), 62.5 (Realisasi)</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700, color: '#0f2c59' }}>Status SPJ</td>
                      <td><span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10.5 }}>OPSIONAL</span></td>
                      <td>belum_masuk, sudah_masuk, sudah_koreksi, dikembalikan, spj_lengkap, sudah_spm, sudah_sp2d</td>
                      <td>sudah_sp2d</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;
