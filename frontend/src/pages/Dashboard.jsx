import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const IconArrow = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const promises = [
      axios.get('/api/marketplace/bookings/').then(res => setBookings(res.data))
    ];
    if (user.role === 'CREATOR') {
      promises.push(
        axios.get('/api/marketplace/sessions/my_sessions/').then(res => setMySessions(res.data))
      );
    }
    Promise.all(promises).finally(() => setLoading(false));
  }, [user]);

  if (!user || loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>

      {/* Profile Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid #ede9e2' }}>
        <img
          src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + user.last_name)}&size=80&background=1a1a2e&color=fff`}
          alt=""
          style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e8e5df' }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', marginBottom: 4 }}>
            {user.first_name} {user.last_name}
          </h1>
          <div style={{ fontSize: 13, color: '#9c9799' }}>{user.email}</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ textAlign: 'center', padding: '10px 18px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>{bookings.length}</div>
            <div style={{ fontSize: 11, color: '#b5b0a8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bookings</div>
          </div>
          {user.role === 'CREATOR' && (
            <div style={{ textAlign: 'center', padding: '10px 18px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>{mySessions.length}</div>
              <div style={{ fontSize: 11, color: '#b5b0a8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sessions</div>
            </div>
          )}
        </div>
        <span className={`pill ${user.role === 'CREATOR' ? 'pill-blue' : 'pill-green'}`}>
          {user.role}
        </span>
      </div>

      {/* Tabs — only for Creators */}
      {user.role === 'CREATOR' && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #ede9e2' }}>
          {[
            { key: 'bookings', label: 'Bookings' },
            { key: 'sessions', label: 'My Sessions' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                color: activeTab === tab.key ? '#1a1a2e' : '#b5b0a8',
                borderBottom: activeTab === tab.key ? '2px solid #1a1a2e' : '2px solid transparent',
                marginBottom: -1, transition: 'color 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Bookings list */}
      {(activeTab === 'bookings' || user.role !== 'CREATOR') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
              {user.role === 'CREATOR' ? 'Bookings on my sessions' : 'My Bookings'}
            </h2>
          </div>

          {bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#f0ece6', borderRadius: 12, overflow: 'hidden', border: '1px solid #e8e5df' }}>
              {bookings.map((booking, idx) => (
                <div key={booking.id} style={{ background: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 3 }}>{booking.session?.title}</div>
                    <div style={{ fontSize: 12, color: '#9c9799' }}>
                      {user.role === 'CREATOR'
                        ? `Booked by ${booking.user?.first_name} ${booking.user?.last_name}`
                        : `Host: ${booking.session?.creator?.first_name} ${booking.session?.creator?.last_name}`
                      }
                      {booking.session?.start_time && (
                        <span> · {new Date(booking.session.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      )}
                    </div>
                  </div>
                  <span className="pill pill-green">{booking.status || 'Confirmed'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', border: '1.5px dashed #e0dbd3', borderRadius: 12 }}>
              <div style={{ fontSize: 13, color: '#b5b0a8', marginBottom: 16 }}>No bookings yet</div>
              <button className="btn-primary" onClick={() => navigate('/')} style={{ padding: '9px 20px', fontSize: 13, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Browse sessions <IconArrow />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Creator sessions list */}
      {user.role === 'CREATOR' && activeTab === 'sessions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Created Sessions</h2>
          </div>

          {mySessions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#f0ece6', borderRadius: 12, overflow: 'hidden', border: '1px solid #e8e5df' }}>
              {mySessions.map(session => (
                <div key={session.id} style={{ background: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 3 }}>{session.title}</div>
                    <div style={{ fontSize: 12, color: '#9c9799' }}>
                      {new Date(session.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      {' · '}
                      ${session.price}
                      {' · '}
                      {session.max_capacity} spots
                    </div>
                  </div>
                  <span className={`pill ${session.is_active ? 'pill-green' : 'pill-gray'}`}>
                    {session.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', border: '1.5px dashed #e0dbd3', borderRadius: 12 }}>
              <div style={{ fontSize: 13, color: '#b5b0a8' }}>No sessions created yet</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
