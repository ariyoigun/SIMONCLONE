const fs = require('fs');
const path = require('path');

// 1. UPDATE AppContext.jsx
console.log('1. Updating AppContext.jsx...');
const ctxPath = path.resolve('./src/context/AppContext.jsx');
let ctxContent = fs.readFileSync(ctxPath, 'utf8');

// Bump version to 2026_real_v6
ctxContent = ctxContent.replace(/2026_real_v5/g, '2026_real_v6');

// Update hasMenuAccess
const oldHasMenuAccess = `  // Granular Menu Access Control
  const hasMenuAccess = (menuId) => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;

    // Jika admin mengatur custom allowedMenus pada user ini
    if (Array.isArray(currentUser.allowedMenus) && currentUser.allowedMenus.length > 0) {
      return currentUser.allowedMenus.includes(menuId);
    }

    // Default wewenang berdasarkan Peran Sistem (Role)
    if (menuId === 'spj_keuangan') {
      return canAccessSPJMenu;
    }
    if (currentUser.role === 'koordinator_pendapatan') {
      return ['dashboard', 'pendapatan', 'laporan'].includes(menuId);
    }
    return true;
  };`;

const newHasMenuAccess = `  // Granular Menu Access Control
  const hasMenuAccess = (menuId) => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;

    // Default wewenang berdasarkan Peran Sistem (Role)
    if (menuId === 'spj_keuangan') {
      return canAccessSPJMenu;
    }
    if (menuId === 'pendapatan') {
      return canAccessPendapatanMenu;
    }
    if (currentUser.role === 'koordinator_pendapatan') {
      return ['dashboard', 'pendapatan', 'laporan'].includes(menuId);
    }

    // Menu Master Paket dan Monitoring Paket terbuka untuk seluruh staf dinas
    if (menuId === 'monitoring_paket' || menuId === 'master_paket') {
      return true;
    }

    // Jika admin mengatur custom allowedMenus pada user ini
    if (Array.isArray(currentUser.allowedMenus) && currentUser.allowedMenus.length > 0) {
      return currentUser.allowedMenus.includes(menuId);
    }

    return true;
  };`;

if (ctxContent.includes(oldHasMenuAccess)) {
  ctxContent = ctxContent.replace(oldHasMenuAccess, newHasMenuAccess);
  console.log('  Updated hasMenuAccess successfully');
} else {
  // Regex fallback
  ctxContent = ctxContent.replace(/const hasMenuAccess = \(menuId\) => {[\s\S]*?return true;\s*};/, newHasMenuAccess.trim());
  console.log('  Updated hasMenuAccess via regex');
}

fs.writeFileSync(ctxPath, ctxContent, 'utf8');

// 2. UPDATE UserManagementModal.jsx
console.log('2. Updating UserManagementModal.jsx...');
const userModalPath = path.resolve('./src/components/UserManagementModal.jsx');
let userModalContent = fs.readFileSync(userModalPath, 'utf8');

userModalContent = userModalContent.replace(
  /allowedMenus: \['dashboard', 'master_pekerjaan', 'prakontrak', 'fisik', 'keuangan', 'pendapatan', 'laporan'\]/g,
  "allowedMenus: ['dashboard', 'master_pekerjaan', 'master_paket', 'monitoring_paket', 'prakontrak', 'fisik', 'keuangan', 'pendapatan', 'laporan']"
);
fs.writeFileSync(userModalPath, userModalContent, 'utf8');

// 3. UPDATE Sidebar.jsx
console.log('3. Updating Sidebar.jsx...');
const sidebarPath = path.resolve('./src/components/Sidebar.jsx');
let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

const oldMasterSection = `{hasMenuAccess('master_pekerjaan') && (
          <>
            <div className="nav-section-title">Data Pokok & Master</div>

            <a
              href="#master_pekerjaan"
              className={\`nav-item \${activeTab === 'master_pekerjaan' ? 'active' : ''}\`}
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

            <a
              href="#master_paket"
              className={\`nav-item \${activeTab === 'master_paket' ? 'active' : ''}\`}
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
            </a>`;

const newMasterSection = `{(hasMenuAccess('master_pekerjaan') || hasMenuAccess('master_paket')) && (
          <>
            <div className="nav-section-title">Data Pokok & Master</div>

            {hasMenuAccess('master_pekerjaan') && (
              <a
                href="#master_pekerjaan"
                className={\`nav-item \${activeTab === 'master_pekerjaan' ? 'active' : ''}\`}
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
                className={\`nav-item \${activeTab === 'master_paket' ? 'active' : ''}\`}
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
            )}`;

if (sidebarContent.includes(oldMasterSection)) {
  sidebarContent = sidebarContent.replace(oldMasterSection, newMasterSection);
  console.log('  Updated Sidebar master section successfully');
} else {
  console.log('  Notice: Sidebar master section pattern varied, using regex');
  sidebarContent = sidebarContent.replace(/\{hasMenuAccess\('master_pekerjaan'\) && \(\s*<>\s*<div className="nav-section-title">Data Pokok & Master<\/div>[\s\S]*?<FolderTree className="icon" style={{ color: '#d97706' }} \/>[\s\S]*?<\/span>\s*<\/a>/, newMasterSection);
}

fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');

// 4. UPDATE MasterPaketPekerjaanView.jsx
console.log('4. Updating MasterPaketPekerjaanView.jsx...');
const mpViewPath = path.resolve('./src/views/MasterPaketPekerjaanView.jsx');
let mpViewContent = fs.readFileSync(mpViewPath, 'utf8');

// Ensure dataList uses paketPekerjaanList first, fallback to accessiblePaketPekerjaan
mpViewContent = mpViewContent.replace(
  /const dataList = accessiblePaketPekerjaan\.length > 0 \? accessiblePaketPekerjaan : paketPekerjaanList;/g,
  'const dataList = paketPekerjaanList.length > 0 ? paketPekerjaanList : accessiblePaketPekerjaan;'
);

// Ensure activeKategori matches p.kategoriPaketId === activeKategori
const oldCatMatch = `      if (activeKategori !== 'ALL') {
        const catCfg = KATEGORI_CONFIG.find((k) => k.id === activeKategori);
        if (catCfg) {
          const matchCat =
            (p.kategoriPaket || '').includes(catCfg.keyMatch) ||
            (p.kategoriPekerjaan || '').includes(catCfg.keyMatch) ||
            (p.jenisPengadaan || '').includes(catCfg.keyMatch);
          if (!matchCat) return false;
        }
      }`;

const newCatMatch = `      if (activeKategori !== 'ALL') {
        const catCfg = KATEGORI_CONFIG.find((k) => k.id === activeKategori);
        const matchCat =
          p.kategoriPaketId === activeKategori ||
          (catCfg && (
            (p.kategoriPaket || '').toLowerCase().includes(catCfg.keyMatch.toLowerCase()) ||
            (p.kategoriPekerjaan || '').toLowerCase().includes(catCfg.keyMatch.toLowerCase()) ||
            (p.jenisPengadaan || '').toLowerCase().includes(catCfg.keyMatch.toLowerCase())
          ));
        if (!matchCat) return false;
      }`;

if (mpViewContent.includes(oldCatMatch)) {
  mpViewContent = mpViewContent.replace(oldCatMatch, newCatMatch);
  console.log('  Updated category filter in MasterPaketPekerjaanView');
}

fs.writeFileSync(mpViewPath, mpViewContent, 'utf8');

// 5. UPDATE MonitoringPaketView.jsx
console.log('5. Updating MonitoringPaketView.jsx...');
const monViewPath = path.resolve('./src/views/MonitoringPaketView.jsx');
let monViewContent = fs.readFileSync(monViewPath, 'utf8');

monViewContent = monViewContent.replace(
  /const activeList = accessiblePaketPekerjaan\.length > 0 \? accessiblePaketPekerjaan : paketPekerjaanList;/g,
  'const activeList = paketPekerjaanList.length > 0 ? paketPekerjaanList : accessiblePaketPekerjaan;'
);

if (monViewContent.includes(oldCatMatch)) {
  monViewContent = monViewContent.replace(oldCatMatch, newCatMatch);
  console.log('  Updated category filter in MonitoringPaketView');
}

fs.writeFileSync(monViewPath, monViewContent, 'utf8');

console.log('ALL FIXES APPLIED SUCCESSFULLY!');
