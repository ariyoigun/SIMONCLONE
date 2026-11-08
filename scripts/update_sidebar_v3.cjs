const fs = require('fs');
let c = fs.readFileSync('src/components/Sidebar.jsx', 'utf8');

c = c.replace(
  /(\s*<span>Master Data Pekerjaan<\/span>\s*<span className="nav-badge-count"[^>]*>\s*\{countTotal\}\s*<\/span>\s*<\/a>)/,
  `$1

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

fs.writeFileSync('src/components/Sidebar.jsx', c, 'utf8');
console.log('Sidebar.jsx updated with Master Data Paket Pekerjaan via regex!');
