import React, { useState } from 'react';
import { DEFAULT_APP_LOGO } from '../data/logoPresets';

/**
 * AppLogo - Komponen Logo Resmi Terstandarisasi untuk DINPUTARU Demak
 * Menggantikan badge teks 'PU' dengan logo kustom atau lambang resmi PUPR beresolusi tinggi.
 */
const AppLogo = ({
  logoUrl = '',
  size = 40,
  alt = 'Logo Dinas',
  className = '',
  style = {},
  shape = 'rounded', // 'rounded' | 'circle' | 'square'
  bordered = true,
  background = '#ffffff'
}) => {
  const [hasError, setHasError] = useState(false);

  // Jika logoUrl diatur dan belum error, gunakan logoUrl tersebut.
  // Jika kosong atau error saat memuat, gunakan DEFAULT_APP_LOGO (Lambang Resmi DINPUTARU PUPR).
  const effectiveSrc = !hasError && logoUrl && logoUrl.trim() !== '' ? logoUrl.trim() : DEFAULT_APP_LOGO;

  const borderRadius =
    shape === 'circle' ? '50%' : shape === 'square' ? 0 : Math.max(6, Math.round(size * 0.24));

  return (
    <div
      className={`app-logo-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius,
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: background || '#ffffff',
        border: bordered ? '1px solid rgba(203, 213, 225, 0.8)' : 'none',
        boxShadow: bordered ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
        position: 'relative',
        boxSizing: 'border-box',
        ...style
      }}
    >
      <img
        src={effectiveSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
        }}
      />
    </div>
  );
};

export default AppLogo;
