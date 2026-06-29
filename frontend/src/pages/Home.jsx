import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const IconClock = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const IconUsers = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/marketplace/sessions/')
      .then(res => setSessions(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

      {/* Hero */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ display: 'inline-block', background: '#fff', border: '1px solid #e0dbd3', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600, color: '#8c7b6e', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 20 }}>
          Spiritual Marketplace
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.1, letterSpacing: '-0.03em', maxWidth: 620, marginBottom: 16 }}>
          Find and book sessions with top spiritual guides
        </h1>
        <p style={{ color: '#7a7585', fontSize: 17, lineHeight: 1.7, maxWidth: 500 }}>
          Meditation, yoga, healing and more — browse from curated sessions led by verified creators.
        </p>
      </div>

      {/* Section header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>
          Available Sessions
          <span style={{ marginLeft: 8, fontWeight: 400, color: '#b5b0a8', fontSize: 14 }}>({sessions.length})</span>
        </h2>
        <span style={{ fontSize: 13, color: '#b5b0a8' }}>Sorted by date</span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {sessions.map(session => (
          <div key={session.id} className="session-card" onClick={() => navigate(`/session/${session.id}`)}>
            {/* Top color strip */}
            <div style={{ height: 4, background: `hsl(${session.id * 60}, 60%, 60%)`, borderRadius: '16px 16px 0 0' }} />

            <div style={{ padding: '20px 22px 22px' }}>
              {/* Creator row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <img
                  src={session.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.creator?.first_name || 'C')}&size=40&background=1a1a2e&color=fff`}
                  alt=""
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>
                    {session.creator?.first_name} {session.creator?.last_name}
                  </div>
                  <div style={{ fontSize: 12, color: '#b5b0a8' }}>Session Host</div>
                </div>
                <span className="price-badge">${session.price}</span>
              </div>

              {/* Title + desc */}
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8, lineHeight: 1.3 }}>
                {session.title}
              </h3>
              <p style={{ fontSize: 13.5, color: '#7a7585', lineHeight: 1.6, marginBottom: 18, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {session.description}
              </p>

              {/* Footer row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #f0ece6' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9c9799' }}>
                    <IconClock />
                    {new Date(session.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9c9799' }}>
                    <IconUsers />
                    {session.max_capacity} spots
                  </span>
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '7px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, borderRadius: 8 }}
                  onClick={e => { e.stopPropagation(); navigate(`/session/${session.id}`); }}
                >
                  View <IconArrow />
                </button>
              </div>
            </div>
          </div>
        ))}

        {sessions.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: '#b5b0a8' }}>
            <div style={{ fontSize: 32, marginBottom: 12, color: '#d4cfc7' }}>
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{margin:'0 auto'}}>
                <circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-2 4-2 4 2 4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <p style={{ fontSize: 15 }}>No sessions available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
