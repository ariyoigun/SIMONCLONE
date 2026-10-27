import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Lock,
  User,
  Key,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import AppLogo from '../components/AppLogo';

const LoginView = ({ onBackToLanding }) => {
  const { login, users, systemSettings } = useApp();

  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('pupr2025');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Math Challenge State (Addition, Subtraction, Multiplication, Division)
  const [mathProblem, setMathProblem] = useState({
    num1: 6,
    num2: 4,
    operator: '×',
    answer: 24
  });
  const [userMathAnswer, setUserMathAnswer] = useState('');
  const [mathError, setMathError] = useState(false);

  // Generate clean random math problem (+, -, ×, ÷)
  const generateMathProblem = () => {
    const operators = ['+', '-', '×', '÷'];
    const chosenOp = operators[Math.floor(Math.random() * operators.length)];

    let n1 = 0;
    let n2 = 0;
    let ans = 0;

    switch (chosenOp) {
      case '+': {
        n1 = Math.floor(Math.random() * 20) + 4; // 4 to 23
        n2 = Math.floor(Math.random() * 15) + 3; // 3 to 17
        ans = n1 + n2;
        break;
      }
      case '-': {
        n1 = Math.floor(Math.random() * 25) + 12; // 12 to 36
        n2 = Math.floor(Math.random() * (n1 - 3)) + 2; // ensures positive result >= 1
        ans = n1 - n2;
        break;
      }
      case '×': {
        n1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
        n2 = Math.floor(Math.random() * 7) + 2; // 2 to 8
        ans = n1 * n2;
        break;
      }
      case '÷': {
        n2 = Math.floor(Math.random() * 6) + 2; // 2 to 7
        ans = Math.floor(Math.random() * 7) + 2; // 2 to 8 (integer result)
        n1 = n2 * ans; // ensures clean division
        break;
      }
      default:
        n1 = 5;
        n2 = 5;
        ans = 10;
    }

    setMathProblem({
      num1: n1,
      num2: n2,
      operator: chosenOp,
      answer: ans
    });
    setUserMathAnswer('');
    setMathError(false);
  };

  useEffect(() => {
    generateMathProblem();
  }, []);

  const handleQuickSelectUser = (u) => {
    setIdentifier(u.username || u.email?.split('@')[0] || u.email);
    setPassword(u.password || 'pupr2025');
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setMathError(false);

    // 1. Verify Math Answer
    const submittedAnswer = parseInt(userMathAnswer.trim(), 10);

    if (isNaN(submittedAnswer) || submittedAnswer !== mathProblem.answer) {
      setMathError(true);
      setErrorMessage(
        `Hasil perhitungan salah! Silakan coba lagi: ${mathProblem.num1} ${mathProblem.operator} ${mathProblem.num2} = ?`
      );
      generateMathProblem();
      return;
    }

    // 2. Verify Credentials
    setIsLoading(true);
    setTimeout(() => {
      const result = login(identifier, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message);
        generateMathProblem();
      }
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #040d1a 0%, #0a1f3d 40%, #0f2c59 80%, #07192f 100%)',
        position: 'relative',
        padding: '28px 16px',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Ambient Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(0,0,0,0) 70%)',
          top: '-200px',
          right: '-200px',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, rgba(0,0,0,0) 70%)',
          bottom: '-150px',
          left: '-150px',
          pointerEvents: 'none'
        }}
      />

      {/* Top Bar Navigation Back to Landing Page */}
      {onBackToLanding && (
        <div style={{ width: '100%', maxWidth: 480, marginBottom: 14, display: 'flex', justifyContent: 'flex-start' }}>
          <button
            type="button"
            onClick={onBackToLanding}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: 9999,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Beranda Publik</span>
          </button>
        </div>
      )}

      {/* Main Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#ffffff',
          borderRadius: 24,
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091e3a 0%, #0f2c59 60%, #1e3a8a 100%)',
            padding: '34px 32px 28px',
            color: '#ffffff',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Brand Badge Icon / Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <AppLogo
              logoUrl={systemSettings?.logoUrl}
              size={64}
              alt={systemSettings?.singkatanInstansi || 'DINPUTARU Demak'}
              style={{
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(255,255,255,0.4)'
              }}
            />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
            {systemSettings?.namaSistem || 'SIMON - SATUPUTARU'}
          </h2>
          <p style={{ fontSize: 13, color: '#93c5fd', marginTop: 4, marginBottom: 0, fontWeight: 500 }}>
            {systemSettings?.subNama || 'Sistem Informasi Monitoring Progres Pekerjaan DINPUTARU'}
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 12,
              padding: '4px 14px',
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.12)',
              fontSize: 11.5,
              color: '#e2e8f0',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <Building2 size={13} color="#f59e0b" />
            <span>{systemSettings?.instansi || 'Dinas Pekerjaan Umum dan Penataan Ruang'}</span>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: '32px' }}>
          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px 14px',
                borderRadius: 10,
                fontSize: 12.5,
                marginBottom: 20
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Username / Email */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#0f2c59',
                  marginBottom: 6
                }}
              >
                Identitas Akun Pegawai (Username / Email / NIP)
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                  }}
                >
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: admin / kadin / email@kabupaten.go.id"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  style={{ paddingLeft: 40, height: 44, fontSize: 13.5 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#0f2c59',
                  marginBottom: 6
                }}
              >
                Kata Sandi (Password)
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                  }}
                >
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: 40, paddingRight: 40, height: 44, fontSize: 13.5 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* DYNAMIC MATH CHALLENGE (NO CAPTCHA WORDING) */}
            <div
              style={{
                background: mathError ? '#fff1f2' : '#f8fafc',
                border: mathError ? '1.5px solid #fda4af' : '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '16px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: mathError ? '#be123c' : '#0f2c59',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Shield size={14} color={mathError ? '#be123c' : '#0284c7'} />
                  <span>Verifikasi Keamanan (Hitung Hasil Operasi):</span>
                </label>
                <button
                  type="button"
                  onClick={generateMathProblem}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600
                  }}
                  title="Ganti kombinasi angka"
                >
                  <RotateCcw size={12} />
                  Ganti Soal
                </button>
              </div>

              {/* Math Display Stamp Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div
                  style={{
                    padding: '8px 18px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #091e3a 0%, #1e3a8a 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: 20,
                    fontFamily: 'monospace',
                    letterSpacing: 2,
                    userSelect: 'none',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3), 0 2px 6px rgba(15, 44, 89, 0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 150
                  }}
                >
                  {mathProblem.num1} {mathProblem.operator} {mathProblem.num2} = ?
                </div>

                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Hasil..."
                    value={userMathAnswer}
                    onChange={(e) => setUserMathAnswer(e.target.value)}
                    required
                    style={{
                      height: 44,
                      fontSize: 16,
                      fontWeight: 800,
                      textAlign: 'center',
                      borderColor: mathError ? '#f43f5e' : '#cbd5e1'
                    }}
                  />
                </div>
              </div>

              <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
                Selesaikan operasi hitung di atas untuk melanjutkan masuk ke sistem internal.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: 46,
                fontSize: 14.5,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 4
              }}
            >
              <span>{isLoading ? 'Memverifikasi Akun...' : 'Masuk ke Sistem Monitoring'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Role Picker for Easy Testing */}
          <div
            style={{
              marginTop: 26,
              paddingTop: 18,
              borderTop: '1px solid #f1f5f9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Sparkles size={14} color="#f59e0b" />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b' }}>
                AKUN UJI COBA INTERNAL (KLIK UNTUK PENGISIAN CEPAT):
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 8
              }}
            >
              {users.slice(0, 6).map((u) => {
                const isSelected =
                  identifier === (u.username || u.email?.split('@')[0]);

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickSelectUser(u)}
                    style={{
                      padding: '7px 10px',
                      borderRadius: 8,
                      border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0f9ff' : '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.15s'
                    }}
                  >
                    <img
                      src={u.avatar}
                      alt=""
                      style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#0f2c59',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {u.nama.split(',')[0]}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>
                        {u.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            padding: '12px 32px',
            textAlign: 'center',
            fontSize: 11,
            color: '#94a3b8'
          }}
        >
          SIMON-DINPUTARU v2.4 • Dinas Pekerjaan Umum dan Penataan Ruang © 2025
        </div>
      </div>
    </div>
  );
};

export default LoginView;
