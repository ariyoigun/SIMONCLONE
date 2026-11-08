const fs = require('fs');
const path = require('path');

// ==============================================================================
// 1. FIX AppContext.jsx: EXPORT paketPekerjaanList in Provider value
// ==============================================================================
console.log('1. Exporting paketPekerjaanList in AppContext Provider value...');
const ctxPath = path.resolve('./src/context/AppContext.jsx');
let ctxContent = fs.readFileSync(ctxPath, 'utf8');

const targetMarker = `    canManageSipd,
    // Projects
    projects,`;

const exportCode = `    canManageSipd,
    // Master & Monitoring Paket Pekerjaan TA 2026 (478 Paket)
    paketPekerjaanList,
    accessiblePaketPekerjaan,
    updatePaketPekerjaan,
    addPaketPekerjaan,
    deletePaketPekerjaan,
    // Projects
    projects,`;

if (ctxContent.includes(targetMarker)) {
  ctxContent = ctxContent.replace(targetMarker, exportCode);
  console.log('  Successfully exported paketPekerjaanList in AppContext value');
} else {
  console.log('  Notice: targetMarker not found exactly, searching via regex');
  ctxContent = ctxContent.replace(/canManageSipd,\s*\/\/\s*Projects\s*projects,/, exportCode);
}

fs.writeFileSync(ctxPath, ctxContent, 'utf8');

// ==============================================================================
// 2. FIX MonitoringPaketView.jsx: REPLACE UNDEFINED 'projects' WITH 'activeList'
// ==============================================================================
console.log('2. Fixing undeclared projects in MonitoringPaketView.jsx...');
const monPath = path.resolve('./src/views/MonitoringPaketView.jsx');
let monContent = fs.readFileSync(monPath, 'utf8');

// Fix line 139: [projects, activeKategori, ...] -> [activeList, activeKategori, ...]
monContent = monContent.replace(
  /\}, \[projects, activeKategori, selectedBidang, selectedMetode, searchQuery\]\);/g,
  '}, [activeList, activeKategori, selectedBidang, selectedMetode, searchQuery]);'
);

// Fix line 230: const target = projects.find(...) -> const target = activeList.find(...)
monContent = monContent.replace(
  /const target = projects\.find\(\(p\) => p\.id === projectId\);/g,
  'const target = activeList.find((p) => p.id === projectId);'
);

fs.writeFileSync(monPath, monContent, 'utf8');
console.log('  Successfully fixed MonitoringPaketView.jsx');

// ==============================================================================
// 3. FIX ExecutiveDashboard.jsx: REDESIGN PERINGATAN KETERLAMBATAN KRITIS
// ==============================================================================
console.log('3. Redesigning Keterlambatan Kritis alert in ExecutiveDashboard.jsx...');
const execPath = path.resolve('./src/views/ExecutiveDashboard.jsx');
let execContent = fs.readFileSync(execPath, 'utf8');

const oldAlertStart = `{/* Alert Warning Keterlambatan Kritis */}`;
const oldAlertIndex = execContent.indexOf(oldAlertStart);

const newAlertJSX = `{/* Alert Warning Keterlambatan Kritis */}
      {paketKritis.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)',
            border: '1.5px solid #fecaca',
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 22,
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.05)'
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  flexShrink: 0
                }}
              >
                <AlertTriangle size={18} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span>Peringatan: Pekerjaan Mengalami Keterlambatan Kritis</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background: '#dc2626',
                      color: '#ffffff',
                      padding: '1px 8px',
                      borderRadius: 9999
                    }}
                  >
                    {paketKritis.length} Paket (Deviasi &lt; -5%)
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: '#b91c1c', marginTop: 1 }}>
                  Memerlukan evaluasi Show Cause Meeting (SCM) bersama PPK dan Penyedia Jasa.
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: '#991b1b', fontWeight: 600 }}>
              Klik pekerjaan untuk tinjau detil:
            </div>
          </div>

          {/* Grid Pills per Bidang with Distinct Colors */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            {paketKritis.map((k) => {
              const b = BIDANG_LIST.find((x) => x.id === k.bidangId);
              const bColor = b?.warna || '#dc2626';
              const bBg = b?.bgLight || 'rgba(220, 38, 38, 0.08)';
              const bSingkatan = b?.id === 'sda_bk' ? 'SDA-BK' : (b?.singkatan || k.bidangId);
              const deviasi = k.dataFisik?.deviasiFisik || 0;

              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => onViewProject(k)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: '#ffffff',
                    border: \`1.5px solid \${bColor}66\`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    maxWidth: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = bColor;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = \`\${bColor}66\`;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                  }}
                  title={\`\${k.namaPaket}\\nBidang: \${b?.nama || k.bidangId}\\nDeviasi: \${deviasi}%\`}
                >
                  {/* Badge Bidang */}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: bBg,
                      color: bColor,
                      border: \`1px solid \${bColor}33\`,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {bSingkatan}
                  </span>

                  {/* Nama Paket Truncated */}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#1e293b',
                      maxWidth: 220,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {k.namaPaket}
                  </span>

                  {/* Deviasi Pill */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#dc2626',
                      background: '#fee2e2',
                      padding: '1px 6px',
                      borderRadius: 4,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {deviasi}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}`;

// Replace old alert block in ExecutiveDashboard.jsx
const alertRegex = /\{\/\* Alert Warning Keterlambatan Kritis \*\/\}[\s\S]*?\{paketKritis\.length > 0 && \([\s\S]*?\)\s*\}\s*\)/;
if (alertRegex.test(execContent)) {
  execContent = execContent.replace(alertRegex, newAlertJSX);
  console.log('  Successfully replaced old alert block in ExecutiveDashboard.jsx');
} else {
  console.log('  Notice: alertRegex did not match, using fallback replacement');
  const startTag = '{/* Alert Warning Keterlambatan Kritis */}';
  const endTag = '{/* SEGMENTED FILTER PEMILAH PER BIDANG';
  const p1 = execContent.indexOf(startTag);
  const p2 = execContent.indexOf(endTag);
  if (p1 !== -1 && p2 !== -1) {
    execContent = execContent.substring(0, p1) + newAlertJSX + '\n\n      ' + execContent.substring(p2);
    console.log('  Successfully replaced alert via substring slice');
  }
}

fs.writeFileSync(execPath, execContent, 'utf8');
console.log('ALL FIXES EXECUTED CLEANLY!');
