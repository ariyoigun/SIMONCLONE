/**
 * Preset Logo Resmi untuk DINPUTARU Kabupaten Demak
 * Format: Data URI SVG murni (ringan, scalable, tidak membutuhkan koneksi internet)
 */

export const LOGO_PRESETS = [
  {
    id: 'pupr_official',
    name: 'Lambang Resmi DINPUTARU / PUPR',
    description: 'Logo Cakra Kencana Kementerian PUPR dengan Baling-baling Kuning Emas & Lingkaran Biru Laut',
    category: 'Kedinasan',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <defs>
    <radialGradient id="puprBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="70%" stop-color="#0f2452" />
      <stop offset="100%" stop-color="#071329" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#f59e0b" />
      <stop offset="70%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Outer Ring Emas -->
  <circle cx="80" cy="80" r="77" fill="url(#goldRing)" filter="url(#shadow)" />
  <circle cx="80" cy="80" r="72" fill="#ffffff" />
  
  <!-- Lingkaran Biru PUPR -->
  <circle cx="80" cy="80" r="68" fill="url(#puprBg)" />
  <circle cx="80" cy="80" r="66" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.6"/>

  <!-- Baling-Baling / Cakra PUPR Emas (8 Sayap Daun Cakra) -->
  <g transform="translate(80,80) scale(0.92)" filter="url(#shadow)">
    <!-- 4 Daun Sudut Utama -->
    <path d="M 0,-14 C 20,-36 32,-38 32,-18 C 32,-8 20,-4 0,0 Z" fill="url(#goldGrad)" transform="rotate(0)"/>
    <path d="M 0,-14 C 20,-36 32,-38 32,-18 C 32,-8 20,-4 0,0 Z" fill="url(#goldGrad)" transform="rotate(45)"/>
    <path d="M 0,-14 C 20,-36 32,-38 32,-18 C 32,-8 20,-4 0,0 Z" fill="url(#goldGrad)" transform="rotate(90)"/>
    <path d="M 0,-14 C 20,-36 32,-38 32,-18 C 32,-8 20,-4 0,0 Z" fill="url(#goldGrad)" transform="rotate(135)"/>
    <path d="M 0,-14 C 20,-36 32,-38 32,-18 C 32,-8 20,-4 0,0 Z" fill="url(#goldGrad)" transform="rotate(180)"/>
    <path d="M 0,-14 C 20,-36 32,-38 32,-18 C 32,-8 20,-4 0,0 Z" fill="url(#goldGrad)" transform="rotate(225)"/>
    <path d="M 0,-14 C 20,-36 32,-38 32,-18 C 32,-8 20,-4 0,0 Z" fill="url(#goldGrad)" transform="rotate(270)"/>
    <path d="M 0,-14 C 20,-36 32,-38 32,-18 C 32,-8 20,-4 0,0 Z" fill="url(#goldGrad)" transform="rotate(315)"/>
    
    <!-- Lingkaran Tengah Cakra Gigi -->
    <circle cx="0" cy="0" r="16" fill="url(#puprBg)" stroke="url(#goldGrad)" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="9" fill="url(#goldGrad)" />
    <circle cx="0" cy="0" r="4.5" fill="#0f2452" />
  </g>

  <!-- Gelombang Air & Jembatan Lengkung di Bawah -->
  <path d="M 32,108 Q 80,126 128,108" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-linecap="round"/>
  <path d="M 44,116 Q 80,132 116,116" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>

  <!-- Teks Melingkar Bawah Kecil -->
  <text x="80" y="146" font-family="'Inter', sans-serif" font-size="7.5" font-weight="900" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="1.2">
    DINPUTARU DEMAK
  </text>
</svg>
`)}`
  },
  {
    id: 'demak_regency',
    name: 'Lambang Daerah Kabupaten Demak',
    description: 'Logo Resmi Pemerintah Kabupaten Demak (Masjid Agung Demak, Bintang Emas, Padi & Kapas)',
    category: 'Pemerintah Daerah',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <defs>
    <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="60%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#075985" />
    </linearGradient>
    <linearGradient id="goldDemak" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="greenPlant" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#86efac" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
  </defs>

  <!-- Bentuk Perisai Segilima Demak -->
  <path d="M 80,8 L 138,26 L 126,110 Q 80,154 80,154 Q 80,154 34,110 L 22,26 Z" 
        fill="url(#shieldBg)" stroke="url(#goldDemak)" stroke-width="4" stroke-linejoin="round"/>
  
  <!-- Garis Tepi Dalam -->
  <path d="M 80,14 L 132,30 L 122,106 Q 80,146 80,146 Q 80,146 38,106 L 28,30 Z" 
        fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>

  <!-- Bintang Segilima Emas (Ketuhanan) -->
  <polygon points="80,24 83.5,33 93,33.5 85.5,39 88,48 80,43 72,48 74.5,39 67,33.5 76.5,33" fill="url(#goldDemak)" stroke="#fff" stroke-width="0.5"/>

  <!-- Padi dan Kapas (Kemakmuran) -->
  <path d="M 46,98 C 40,70 50,48 64,42" fill="none" stroke="url(#goldDemak)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 114,98 C 120,70 110,48 96,42" fill="none" stroke="url(#greenPlant)" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Siluet Ikonik Masjid Agung Demak (Atap Tumpang Tiga) -->
  <g transform="translate(80, 82) scale(0.95)">
    <!-- Atap Tingkat 1 (Puncak/Mustoko) -->
    <polygon points="0,-36 9,-24 -9,-24" fill="#fbbf24" stroke="#78350f" stroke-width="0.8"/>
    <circle cx="0" cy="-38" r="2.5" fill="#fef08a"/>
    <!-- Atap Tingkat 2 -->
    <polygon points="0,-24 18,-12 -18,-12" fill="#d97706" stroke="#78350f" stroke-width="0.8"/>
    <!-- Atap Tingkat 3 -->
    <polygon points="0,-12 28,2 -28,2" fill="#b45309" stroke="#78350f" stroke-width="0.8"/>
    <!-- Bangunan Dinding Utama -->
    <rect x="-24" y="2" width="48" height="18" fill="#f8fafc" stroke="#334155" stroke-width="1"/>
    <!-- Pintu Masuk / Gerbang Gladag -->
    <path d="M -7,20 L -7,9 Q 0,4 7,9 L 7,20 Z" fill="#0f172a"/>
  </g>

  <!-- Gelombang Air Laut & Sungai Demak -->
  <path d="M 44,112 Q 62,106 80,112 Q 98,118 116,112" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <path d="M 50,118 Q 65,114 80,118 Q 95,122 110,118" fill="none" stroke="#bae6fd" stroke-width="2" stroke-linecap="round"/>

  <!-- Pita Semboyan Bawah -->
  <path d="M 42,130 Q 80,138 118,130 L 114,140 Q 80,147 46,140 Z" fill="#ffffff" stroke="url(#goldDemak)" stroke-width="1.5"/>
  <text x="80" y="137.5" font-family="'Inter', sans-serif" font-size="6.8" font-weight="900" fill="#0f2c59" text-anchor="middle" letter-spacing="1.5">
    DEMAK
  </text>
</svg>
`)}`
  },
  {
    id: 'satuputaru_modern',
    name: 'Monogram SATU PUTARU Smart City',
    description: 'Logo Modern Bernuansa Teknologi Pemantauan Infrastruktur Terintegrasi (Bina Marga, Cipta Karya, SDA, Tata Ruang)',
    category: 'Modern Branding',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <defs>
    <linearGradient id="cyberBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a192f" />
      <stop offset="50%" stop-color="#0f2c59" />
      <stop offset="100%" stop-color="#021024" />
    </linearGradient>
    <linearGradient id="neonGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>

  <!-- Squircle Background -->
  <rect x="8" y="8" width="144" height="144" rx="36" fill="url(#cyberBg)" stroke="url(#neonGold)" stroke-width="2.5"/>

  <!-- Grid Koordinat Halus -->
  <circle cx="80" cy="80" r="54" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4,4"/>
  <circle cx="80" cy="80" r="36" fill="none" stroke="#1e293b" stroke-width="1.5"/>

  <!-- Jalur Sinyal Hexagon Infrastruktur -->
  <polygon points="80,28 124,54 124,106 80,132 36,106 36,54" fill="none" stroke="url(#neonCyan)" stroke-width="2" opacity="0.4"/>

  <!-- Logo Huruf 'P' & 'U' Geometris Saling Bertaut (PUPR SATU) -->
  <g transform="translate(44, 40)">
    <!-- Jalan Melingkar / Jembatan 'P' -->
    <path d="M 12,68 L 12,6 C 12,6 38,6 48,16 C 58,26 54,42 40,46 L 12,46" 
          fill="none" stroke="url(#neonGold)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Alur Gelombang Air & Konstruksi 'U' -->
    <path d="M 38,36 L 46,36 C 58,36 64,46 64,56 C 64,68 52,72 38,72 L 24,72" 
          fill="none" stroke="url(#neonCyan)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Titik Node Sinyal Monitoring -->
    <circle cx="12" cy="6" r="4.5" fill="#fef08a"/>
    <circle cx="48" cy="16" r="4" fill="#38bdf8"/>
    <circle cx="12" cy="68" r="4.5" fill="#fbbf24"/>
    <circle cx="24" cy="72" r="3.5" fill="#38bdf8"/>
  </g>

  <!-- Tagline Mini SIMON -->
  <text x="80" y="138" font-family="'Inter', sans-serif" font-size="8.5" font-weight="900" fill="#f8fafc" text-anchor="middle" letter-spacing="2">
    SIMON PU
  </text>
</svg>
`)}`
  }
];

export const DEFAULT_APP_LOGO = LOGO_PRESETS[0].svgDataUri;
