import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

// Stripe imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace this with your actual Stripe Publishable Key
const stripePromise = loadStripe('pk_test_51TnmF36a2lGifDTaSAb5o61UI3M3tEp2Ar2jckLPOagsbNT6OWLjY3q6PVxpN6bTw85fsAnHWAOgr6e6qQAU3soY00zzIxwYfC'); 

const IconChevronLeft = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const IconUsers = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
  </svg>
);
const IconGlobe = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconShield = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// New Component for the Stripe Form
const CheckoutForm = ({ session, clientSecret, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMsg(null);

    try {
      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMsg(submitError.message);
        setProcessing(false);
        return;
      }

      // Confirm Payment via Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.origin + '/dashboard',
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMsg(error.message);
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded! Now create the booking in our backend.
        try {
          await axios.post('/api/marketplace/bookings/', {
            session_id: session.id,
            payment_intent_id: paymentIntent.id
          });
          alert('Payment successful & Booking confirmed!');
          navigate('/dashboard');
        } catch (err) {
          console.error("Booking API Error:", err);
          const backendErr = err.response?.data;
          const fallback = typeof backendErr === 'string' ? 'Server returned HTML error (500)' : 'Booking failed to save in backend.';
          setErrorMsg(backendErr?.error || backendErr?.non_field_errors?.[0] || fallback);
          setProcessing(false);
        }
      } else {
        setProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred during payment.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {errorMsg && <div style={{ color: '#d93025', fontSize: 13, marginTop: 12 }}>{errorMsg}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
          disabled={processing}
          style={{ flex: 1, padding: '11px', fontSize: 14 }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          style={{
            flex: 2, padding: '11px', fontSize: 14, fontWeight: 700, borderRadius: 10, border: 'none',
            background: processing ? '#a0a0c0' : '#635BFF', color: '#fff',
            cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s'
          }}
        >
          {processing ? 'Processing...' : `Pay $${session.price}`}
        </button>
      </div>
    </form>
  );
};

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [fetchingSecret, setFetchingSecret] = useState(false);

  useEffect(() => {
    axios.get(`/api/marketplace/sessions/${id}/`)
      .then(res => setSession(res.data))
      .catch(() => { alert('Session not found'); navigate('/'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const initiateBooking = async () => {
    setFetchingSecret(true);
    try {
      const res = await axios.post('/api/marketplace/create-payment-intent/', { session_id: session.id });
      setClientSecret(res.data.clientSecret);
      setShowPayment(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to initialize payment');
    } finally {
      setFetchingSecret(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div className="spinner" />
    </div>
  );
  if (!session) return null;

  const durationMins = Math.round((new Date(session.end_time) - new Date(session.start_time)) / 60000);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#9c9799', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 32, padding: 0, fontFamily: 'Inter, sans-serif' }}
      >
        <IconChevronLeft /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>

        {/* Left */}
        <div>
          {/* Creator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f0ece6' }}>
            <img
              src={session.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent((session.creator?.first_name || 'C') + ' ' + (session.creator?.last_name || ''))}&size=56&background=1a1a2e&color=fff`}
              alt=""
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>
                {session.creator?.first_name} {session.creator?.last_name}
              </div>
              <div style={{ fontSize: 12, color: '#b5b0a8' }}>Verified Session Host</div>
            </div>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 20 }}>
            {session.title}
          </h1>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
            {[
              { icon: <IconClock />, text: new Date(session.start_time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' }) },
              { icon: <IconClock />, text: `${durationMins} min` },
              { icon: <IconUsers />, text: `${session.max_capacity} spots` },
              { icon: <IconGlobe />, text: 'Live Online' },
            ].map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#7a7585', background: '#fff', border: '1px solid #e8e5df', borderRadius: 20, padding: '5px 12px' }}>
                {item.icon} {item.text}
              </span>
            ))}
          </div>

          {/* About */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>About this session</h2>
            <p style={{ fontSize: 15, color: '#5a5870', lineHeight: 1.8 }}>{session.description}</p>
          </div>

          {/* Includes */}
          <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 12, padding: '18px 22px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>What's included</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Live session with the host', 'Session recording (24h access)', 'Q&A at the end', 'Guided materials'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#5a5870' }}>
                  <span style={{ color: '#1a7f54', flexShrink: 0 }}><IconCheck /></span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — sticky booking card */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 16, padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.07)' }}>
            <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: '1px solid #f0ece6' }}>
              <div style={{ fontSize: 12, color: '#b5b0a8', marginBottom: 4 }}>Price per session</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>${session.price}</div>
            </div>

            {user ? (
              <button 
                className="btn-primary" 
                onClick={initiateBooking} 
                disabled={fetchingSecret}
                style={{ width: '100%', padding: '12px', fontSize: 15, borderRadius: 10, marginBottom: 12, opacity: fetchingSecret ? 0.7 : 1 }}
              >
                {fetchingSecret ? 'Connecting...' : 'Book this session'}
              </button>
            ) : (
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ width: '100%', padding: '12px', fontSize: 15, borderRadius: 10, marginBottom: 12 }}>
                Sign in to book
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#b5b0a8', marginBottom: 18 }}>
              <IconShield /> Secure payment via Stripe
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Instant booking confirmation', 'Free cancellation up to 24h before', 'Session link sent by email'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#9c9799' }}>
                  <span style={{ color: '#1a7f54' }}><IconCheck /></span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal with real Stripe Elements */}
      {showPayment && clientSecret && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,20,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 450, boxShadow: '0 40px 80px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#635BFF', letterSpacing: '-0.02em' }}>stripe</div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1a7f54', background: '#f0faf5', border: '1px solid #b7e5ce', padding: '3px 8px', borderRadius: 6 }}>SECURE</span>
            </div>

            {/* Order summary */}
            <div style={{ background: '#f8f7f4', borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{session.title}</div>
                  <div style={{ fontSize: 12, color: '#9c9799', marginTop: 2 }}>1 session</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e' }}>${session.price}</div>
              </div>
            </div>

            {/* Stripe Elements Provider */}
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#1a1a2e' } } }}>
              <CheckoutForm session={session} clientSecret={clientSecret} onCancel={() => setShowPayment(false)} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}
