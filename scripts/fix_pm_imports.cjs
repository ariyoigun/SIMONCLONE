const fs = require('fs');

let code = fs.readFileSync('src/components/ProjectModal.jsx', 'utf8');

code = code.replace(
  /(\s*FolderTree,\r?\n\s*Layers\r?\n\} from 'lucide-react';)/m,
  "  FolderTree,\n  Layers,\n  Camera,\n  Upload,\n  Image as ImageIcon\n} from 'lucide-react';"
);

fs.writeFileSync('src/components/ProjectModal.jsx', code, 'utf8');
console.log('Added Camera and Upload to lucide-react imports');
