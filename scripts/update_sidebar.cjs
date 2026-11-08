const fs = require('fs');
let c = fs.readFileSync('src/components/Sidebar.jsx', 'utf8');

if (!c.includes("activeTab === 'monitoring_paket'")) {
  c = c.replace(
    /{\s*hasMenuAccess\('prakontrak'\) && \(\s*<a\s*href="#prakontrak"/,
    `{hasMenuAccess('monitoring_paket') && (
          <a
            href="#monitoring_paket"
            className={\`nav-item \${activeTab === 'monitoring_paket' ? 'active' : ''}\`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('monitoring_paket');
            }}
            style={{
              background: activeTab === 'monitoring_paket' ? 'rgba(16, 185, 129, 0.15)' : undefined,
              fontWeight: activeTab === 'monitoring_paket' ? 800 : undefined
            }}
          >
            <Layers className="icon" style={{ color: '#10b981' }} />
            <span>Monitoring Paket Pekerjaan</span>
            <span
              className="nav-badge-count"
              style={{ background: '#10b981', color: '#fff' }}
            >
              {accessibleProjects.length}
            </span>
          </a>
        )}

        {hasMenuAccess('prakontrak') && (
          <a
            href="#prakontrak"`
  );

  fs.writeFileSync('src/components/Sidebar.jsx', c, 'utf8');
  console.log('Sidebar.jsx updated successfully with nav link!');
} else {
  console.log('Sidebar.jsx already contains monitoring_paket');
}
