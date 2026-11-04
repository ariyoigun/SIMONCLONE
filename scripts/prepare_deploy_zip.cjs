const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach((element) => {
    const fromStat = fs.lstatSync(path.join(from, element));
    const toPath = path.join(to, element);
    if (fromStat.isFile()) {
      fs.copyFileSync(path.join(from, element), toPath);
    } else if (fromStat.isDirectory()) {
      copyFolderSync(path.join(from, element), toPath);
    }
  });
}

// 1. Copy dist -> deploy_simon_satuputaru
copyFolderSync('dist', 'deploy_simon_satuputaru');

// 2. Ensure api and database are copied
copyFolderSync('public/api', 'deploy_simon_satuputaru/api');
if (!fs.existsSync('deploy_simon_satuputaru/database')) {
  fs.mkdirSync('deploy_simon_satuputaru/database', { recursive: true });
}
fs.copyFileSync('database/simon_satuputaru.sql', 'deploy_simon_satuputaru/database/simon_satuputaru.sql');

console.log('Copied all latest files into deploy_simon_satuputaru/');

// 3. Compress to deploy_simon_satuputaru.zip
try {
  if (fs.existsSync('deploy_simon_satuputaru.zip')) {
    fs.unlinkSync('deploy_simon_satuputaru.zip');
  }
  execSync('powershell Compress-Archive -Path deploy_simon_satuputaru/* -DestinationPath deploy_simon_satuputaru.zip -Force');
  console.log('Successfully created deploy_simon_satuputaru.zip');
} catch (e) {
  console.error('Error creating zip:', e.message);
}

