const fs = require('fs');

let code = fs.readFileSync('src/components/ProjectModal.jsx', 'utf8');

// 1. Declare foto states right after line with [newTagInput, setNewTagInput]
const tagStateStr = "  const [newTagInput, setNewTagInput] = useState('');";
const fotoStatesStr = `  const [newTagInput, setNewTagInput] = useState('');

  // Dokumentasi Foto Lapangan (0%, 50%, 100%)
  const [foto0, setFoto0] = useState('');
  const [foto50, setFoto50] = useState('');
  const [foto100, setFoto100] = useState('');
  const [tanggal0, setTanggal0] = useState('');
  const [tanggal50, setTanggal50] = useState('');
  const [tanggal100, setTanggal100] = useState('');`;

if (!code.includes('const [foto0, setFoto0]')) {
  code = code.replace(tagStateStr, fotoStatesStr);
  console.log('Added foto states to ProjectModal.jsx');
}

// 2. Add handlePhotoUpload before handleToggleTag
const uploadHandlerCode = `
  // Helper Kompresi Gambar Otomatis & Convert ke Base64 Data URL
  const handlePhotoUpload = (tahap, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200; // Resolusi optimal tajam namun ringan
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        const todayStr = new Date().toISOString().slice(0, 10);

        if (tahap === '0%') {
          setFoto0(compressedBase64);
          if (!tanggal0) setTanggal0(todayStr);
        } else if (tahap === '50%') {
          setFoto50(compressedBase64);
          if (!tanggal50) setTanggal50(todayStr);
        } else if (tahap === '100%') {
          setFoto100(compressedBase64);
          if (!tanggal100) setTanggal100(todayStr);
        }
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };
`;

if (!code.includes('const handlePhotoUpload')) {
  code = code.replace(
    '  const handleToggleTag = (tag) => {',
    `${uploadHandlerCode}\n  const handleToggleTag = (tag) => {`
  );
  console.log('Added handlePhotoUpload to ProjectModal.jsx');
}

fs.writeFileSync('src/components/ProjectModal.jsx', code, 'utf8');
console.log('ProjectModal.jsx successfully updated!');
