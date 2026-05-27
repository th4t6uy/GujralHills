import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import config from './config';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.accentColor} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '40px 32px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 14, background: config.primaryColor, marginBottom: 12 }}>
            <span style={{ fontSize: 26 }}>🏗️</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: 4 }}>{config.productName}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: config.primaryColor, letterSpacing: '-0.02em' }}>
            {config.projectName}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>{config.tagline}</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>RERA {config.reraNumber}</div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
              marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              placeholder="your@email.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151',
              marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              placeholder="••••••••" />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 12px',
              borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: config.primaryColor,
            color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Footer link */}
        <div style={{ marginTop: 24, padding: '12px', background: '#f8fafc',
          borderRadius: 10, fontSize: 11, color: '#6b7280', textAlign: 'center' }}>
          Customer plot map:{' '}
          <a href="/" style={{ color: config.primaryColor, fontWeight: 700 }}>
            {config.website}
          </a>
        </div>
      </div>
    </div>
  );
}
