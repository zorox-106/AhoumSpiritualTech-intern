import { useState, useEffect } from 'react';
import { signInWithGoogle } from '../firebase';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleLogin = async (provider) => {
    setLoadingProvider(provider);
    try {
      let token;

      if (provider === 'google') {
        token = await signInWithGoogle();
      }

      const res = await axios.post('/api/users/auth/oauth/', { provider, token });
      login(res.data.access);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.code === 'auth/popup-closed-by-user'
        ? 'Popup closed. Please try again.'
        : err.response?.data?.error || err.message || 'Login failed';
      alert(msg);
    } finally {
      setLoadingProvider(null);
    }
  };

  const OAuthButton = ({ provider, label, icon }) => {
    const isLoading = loadingProvider === provider;
    return (
      <button
        onClick={() => handleLogin(provider)}
        disabled={!!loadingProvider}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '11px 16px', borderRadius: 10, border: '1.5px solid #e0dbd3',
          background: '#fff', color: '#1a1a2e', fontSize: 14, fontWeight: 600,
          cursor: loadingProvider ? 'not-allowed' : 'pointer',
          opacity: loadingProvider && !isLoading ? 0.5 : 1,
          transition: 'border-color 0.15s, background 0.15s',
          fontFamily: 'Inter, sans-serif', width: '100%'
        }}
        onMouseOver={e => { if (!loadingProvider) { e.currentTarget.style.borderColor = '#1a1a2e'; e.currentTarget.style.background = '#f8f7f4'; }}}
        onMouseOut={e => { e.currentTarget.style.borderColor = '#e0dbd3'; e.currentTarget.style.background = '#fff'; }}
      >
        {isLoading ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 16, border: '2px solid #e0dbd3', borderTopColor: '#1a1a2e', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            Connecting...
          </span>
        ) : (
          <>{icon} {label}</>
        )}
      </button>
    );
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
            <circle cx="12" cy="12" r="10" stroke="#1a1a2e" strokeWidth="1.5"/>
            <path d="M12 6c0 3.31-2.69 6-6 6 3.31 0 6 2.69 6 6 0-3.31 2.69-6 6-6-3.31 0-6-2.69-6-6z" fill="#1a1a2e"/>
          </svg>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', marginBottom: 6 }}>Sign in to Ahoum</h1>
          <p style={{ color: '#9c9799', fontSize: 14 }}>Continue to the Sessions Marketplace</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <OAuthButton provider="google" label="Continue with Google" icon={<GoogleIcon />} />
          </div>

          <div style={{ background: '#f8f7f4', border: '1px solid #e8e5df', borderRadius: 10, padding: '12px 14px', fontSize: 12.5, color: '#7a7585', lineHeight: 1.6, marginTop: 20 }}>
            <strong style={{ color: '#1a1a2e' }}>Real OAuth active</strong> — Clicking above opens an actual Google popup. Your credentials are handled by Firebase, never by this app.
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#c5c0b8', fontSize: 12, marginTop: 20 }}>
          By continuing, you agree to the Terms of Service.
        </p>
      </div>
    </div>
  );
}
