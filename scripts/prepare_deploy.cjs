const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}

const deployDir = path.join(__dirname, '..', 'deploy_simon_satuputaru');
const distDir = path.join(__dirname, '..', 'dist');
const apiSrcDir = path.join(__dirname, '..', 'public', 'api');
const apiDestDir = path.join(deployDir, 'api');
const dbFile = path.join(__dirname, '..', 'database', 'simon_satuputaru.sql');

if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

// Copy dist to deployDir
copyFolderRecursiveSync(distDir, deployDir);
console.log('Copied dist/ to deploy_simon_satuputaru/');

// Copy public/api to deploy_simon_satuputaru/api
copyFolderRecursiveSync(apiSrcDir, apiDestDir);
console.log('Copied public/api to deploy_simon_satuputaru/api/');

// Ensure .htaccess in deployDir root for SPA routing if needed
const htaccessPath = path.join(deployDir, '.htaccess');
const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^api/ - [L]
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
`;
fs.writeFileSync(htaccessPath, htaccessContent, 'utf8');
console.log('Created deploy_simon_satuputaru/.htaccess');

// Copy database sql to deploy directory database folder
const deployDbDir = path.join(deployDir, 'database');
if (!fs.existsSync(deployDbDir)) fs.mkdirSync(deployDbDir, { recursive: true });
fs.copyFileSync(dbFile, path.join(deployDbDir, 'simon_satuputaru.sql'));
console.log('Copied database/simon_satuputaru.sql to deploy_simon_satuputaru/database/');

console.log('Deploy directory is completely prepared!');

