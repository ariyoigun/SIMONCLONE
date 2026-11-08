const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('MonitoringPaketView')) {
  // 1. Import
  c = c.replace(
    "import MasterPekerjaanView from './views/MasterPekerjaanView';",
    "import MasterPekerjaanView from './views/MasterPekerjaanView';\r\nimport MonitoringPaketView from './views/MonitoringPaketView';"
  );

  // 2. Route render
  c = c.replace(
    "{activeTab === 'master_pekerjaan' && (",
    `{activeTab === 'monitoring_paket' && (
            <MonitoringPaketView
              onOpenProjectModal={handleOpenProjectModal}
              onViewProject={handleViewProject}
              onQuickUpdate={handleQuickUpdate}
            />
          )}

          {activeTab === 'master_pekerjaan' && (`
  );

  // 3. Floating pill tabs list
  c = c.replace(
    "['dashboard', 'prakontrak',",
    "['dashboard', 'monitoring_paket', 'prakontrak',"
  );

  fs.writeFileSync('src/App.jsx', c, 'utf8');
  console.log('App.jsx updated successfully!');
} else {
  console.log('App.jsx already contains MonitoringPaketView');
}

