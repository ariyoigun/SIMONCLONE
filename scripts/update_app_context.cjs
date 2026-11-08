const fs = require('fs');
let c = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// 1. Bump version from 2026_real_v3 to 2026_real_v4
c = c.replace(/2026_real_v3/g, '2026_real_v4');

// 2. Add settings fields to systemSettings parsed check
if (!c.includes('showGaleriSlideshow:')) {
  c = c.replace(
    "galeri: Array.isArray(parsed.galeri) && parsed.galeri.length > 0 ? parsed.galeri : DEFAULT_SYSTEM_SETTINGS.galeri,",
    `galeri: Array.isArray(parsed.galeri) && parsed.galeri.length > 0 ? parsed.galeri : DEFAULT_SYSTEM_SETTINGS.galeri,
            showGaleriSlideshow: parsed.showGaleriSlideshow !== undefined ? parsed.showGaleriSlideshow : DEFAULT_SYSTEM_SETTINGS.showGaleriSlideshow,
            showSlideshowUnggulan: parsed.showSlideshowUnggulan !== undefined ? parsed.showSlideshowUnggulan : DEFAULT_SYSTEM_SETTINGS.showSlideshowUnggulan,
            showPetaKoordinat: parsed.showPetaKoordinat !== undefined ? parsed.showPetaKoordinat : DEFAULT_SYSTEM_SETTINGS.showPetaKoordinat,
            slideshowUnggulan: Array.isArray(parsed.slideshowUnggulan) && parsed.slideshowUnggulan.length > 0 ? parsed.slideshowUnggulan : DEFAULT_SYSTEM_SETTINGS.slideshowUnggulan,`
  );
}

// 3. Ensure tahapanPencairan is preserved and has safe fallback
if (!c.includes('tahapanPencairan: p.tahapanPencairan')) {
  c = c.replace(
    "logs: Array.isArray(p.logs) ? p.logs : []",
    `tahapanPencairan: p.tahapanPencairan || {
          berkasBelumMasuk: !isKontrak && totalCair === 0,
          berkasMasuk: totalCair > 0 || fRealisasi > 0,
          koreksi: false,
          berkasRevisiMasuk: false,
          spm: totalCair > 0,
          selesai: fRealisasi >= 100 && totalCair >= baseValue,
          catatanPencairan: ''
        },
        logs: Array.isArray(p.logs) ? p.logs : []`
  );
}

fs.writeFileSync('src/context/AppContext.jsx', c, 'utf8');
console.log('AppContext.jsx updated successfully!');

