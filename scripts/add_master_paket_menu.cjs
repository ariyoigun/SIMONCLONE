const fs = require('fs');
let c = fs.readFileSync('src/data/constants.js', 'utf8');
if (!c.includes("'master_paket'")) {
  c = c.replace(
    "{ id: 'master_pekerjaan', label: 'Master Data Pekerjaan', section: 'Data Pokok & Master' },",
    "{ id: 'master_pekerjaan', label: 'Master Data Pekerjaan', section: 'Data Pokok & Master' },\r\n  { id: 'master_paket', label: 'Master Data Paket Pekerjaan', section: 'Data Pokok & Master' },"
  );
  fs.writeFileSync('src/data/constants.js', c, 'utf8');
  console.log('Added master_paket to SYSTEM_MENUS in constants.js');
}
