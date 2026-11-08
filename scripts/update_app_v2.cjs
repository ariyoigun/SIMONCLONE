const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('MasterPaketPekerjaanView')) {
  c = c.replace(
    "import MasterPekerjaanView from './views/MasterPekerjaanView';",
    "import MasterPekerjaanView from './views/MasterPekerjaanView';\r\nimport MasterPaketPekerjaanView from './views/MasterPaketPekerjaanView';"
  );

  c = c.replace(
    "{activeTab === 'master_pekerjaan' && (",
    `{activeTab === 'master_paket' && (
            <MasterPaketPekerjaanView />
          )}

          {activeTab === 'master_pekerjaan' && (`
  );

  c = c.replace(
    "['dashboard', 'monitoring_paket',",
    "['dashboard', 'master_paket', 'monitoring_paket',"
  );

  fs.writeFileSync('src/App.jsx', c, 'utf8');
  console.log('App.jsx updated with MasterPaketPekerjaanView!');
}
