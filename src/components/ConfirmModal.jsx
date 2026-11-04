import React from 'react';
import { HelpCircle, AlertTriangle, CheckCircle2, Trash2, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'primary', // 'primary' | 'danger' | 'warning' | 'success'
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 size={24} color="#dc2626" />;
      case 'warning':
        return <AlertTriangle size={24} color="#f59e0b" />;
      case 'success':
        return <CheckCircle2 size={24} color="#10b981" />;
      default:
        return <HelpCircle size={24} color="#0284c7" />;
    }
  };

  const getHeaderBg = () => {
    switch (type) {
      case 'danger':
        return '#fef2f2';
      case 'warning':
        return '#fffbeb';
      case 'success':
        return '#f0fdf4';
      default:
        return '#f0f9ff';
    }
  };

  const getConfirmBtnClass = () => {
    switch (type) {
      case 'danger':
        return 'btn btn-danger';
      case 'success':
        return 'btn btn-success';
      case 'warning':
        return 'btn btn-warning';
      default:
        return 'btn btn-primary';
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 1050, background: 'rgba(15, 23, 42, 0.7)' }}
      onClick={onCancel}
    >
      <div
        className="modal-dialog"
        style={{
          maxWidth: 460,
          width: '90%',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '20px 24px',
            background: getHeaderBg(),
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              flexShrink: 0
            }}
          >
            {getIcon()}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f2c59' }}>
              {title}
            </h4>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: 4
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
          {message}
        </div>

        <div
          style={{
            padding: '16px 24px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12
          }}
        >
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            style={{ minWidth: 90 }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={getConfirmBtnClass()}
            onClick={onConfirm}
            style={{ minWidth: 120 }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
