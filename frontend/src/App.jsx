import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SessionDetail from './pages/SessionDetail';

const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#1a1a2e" strokeWidth="1.5"/>
            <path d="M12 6c0 3.31-2.69 6-6 6 3.31 0 6 2.69 6 6 0-3.31 2.69-6 6-6-3.31 0-6-2.69-6-6z" fill="#1a1a2e"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#1a1a2e', letterSpacing: '-0.03em' }}>Ahoum</span>
        </Link>

        {/* Center nav */}
        <div style={{ display: 'flex', gap: 4 }}>
          <Link to="/" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#5a5870' }}>Sessions</Link>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#5a5870' }}>Dashboard</Link>
              <div style={{ width: 1, height: 20, background: '#e0dbd3', margin: '0 4px' }} />
              <img
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.first_name}&background=1a1a2e&color=fff&size=64`}
                alt="Avatar"
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e8e5df' }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{user.first_name}</span>
              <button
                onClick={logout}
                style={{ fontSize: 13, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: '#5a5870', padding: '6px 14px' }}>Sign in</Link>
              <Link to="/login" className="btn-primary" style={{ fontSize: 14, padding: '8px 18px', borderRadius: 8, display: 'inline-block' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/session/:id" element={<SessionDetail />} />
            </Routes>
          </main>
          <footer style={{ borderTop: '1px solid #e8e5df', padding: '20px 24px', textAlign: 'center', color: '#b5b0a8', fontSize: 13 }}>
            Ahoum Sessions &mdash; Spiritual Marketplace
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
