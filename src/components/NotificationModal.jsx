import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationModal = ({
  isOpen,
  title = 'Pemberitahuan',
  message = 'Operasi berhasil dilakukan.',
  type = 'success', // 'success' | 'error' | 'info'
  btnText = 'OK, Selesai',
  onClose
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={28} color="#ef4444" />;
      case 'info':
        return <Info size={28} color="#0284c7" />;
      default:
        return <CheckCircle2 size={28} color="#10b981" />;
    }
  };

  const getHeaderBg = () => {
    switch (type) {
      case 'error':
        return '#fef2f2';
      case 'info':
        return '#f0f9ff';
      default:
        return '#f0fdf4';
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 1060, background: 'rgba(15, 23, 42, 0.75)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        style={{
          maxWidth: 440,
          width: '90%',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '28px 24px 20px',
            background: getHeaderBg(),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            {getIcon()}
          </div>
          <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f2c59' }}>
            {title}
          </h4>
        </div>

        <div style={{ padding: '20px 24px', fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
          {message}
        </div>

        <div
          style={{
            padding: '16px 24px 20px',
            background: '#ffffff',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
            style={{ minWidth: 140, padding: '10px 24px', fontWeight: 700 }}
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

