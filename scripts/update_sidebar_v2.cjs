const fs = require('fs');
let c = fs.readFileSync('src/components/Sidebar.jsx', 'utf8');

// 1. Destructure paketPekerjaanList from useApp
if (!c.includes('paketPekerjaanList = [],')) {
  c = c.replace(
    'accessibleProjects,',
    'accessibleProjects,\r\n    paketPekerjaanList = [],'
  );
}

// 2. Add Master Data Paket Pekerjaan menu item
if (!c.includes("activeTab === 'master_paket'")) {
  c = c.replace(
    `            <a
              href="#master_pekerjaan"`,
    `            <a
              href="#master_pekerjaan"`
  );

  c = c.replace(
    `              <span className="nav-badge-count" style={{ background: '#0284c7', color: '#fff' }}>
                {countTotal}
              </span>
            </a>`,
    `              <span className="nav-badge-count" style={{ background: '#0284c7', color: '#fff' }}>
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
            </a>`
  );
}

// 3. In Monitoring Paket Pekerjaan badge, use paketPekerjaanList.length
c = c.replace(
  "{accessibleProjects.length}\r\n            </span>\r\n          </a>\r\n        )}\r\n\r\n        {hasMenuAccess('prakontrak')",
  "{paketPekerjaanList.length || 478}\r\n            </span>\r\n          </a>\r\n        )}\r\n\r\n        {hasMenuAccess('prakontrak')"
);

fs.writeFileSync('src/components/Sidebar.jsx', c, 'utf8');
console.log('Sidebar.jsx updated with Master Data Paket Pekerjaan!');

