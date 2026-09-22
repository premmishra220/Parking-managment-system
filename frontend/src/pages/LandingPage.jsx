import { Link } from 'react-router-dom';

const buildings = [
  '1st Year Building',
  '2nd Year Building',
  'Library Building'
];

export default function LandingPage() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Smart campus parking</span>
            <h1>Reserve a space before you arrive.</h1>
            <p className="hero-copy">
              Park Connect simplifies campus parking with fast booking, clear availability, and secure payments for every visit.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="button button-primary">Find Parking</Link>
              <a href="#how-it-works" className="button button-muted">View How It Works</a>
            </div>
          </div>
          <div className="hero-panel card-surface">
            <div className="mini-card">
              <span>Next available</span>
              <strong>1st Year Building</strong>
              <small>12 spaces open today</small>
            </div>
            <div className="mini-visual">
              <div className="slot-row">
                <span>A01</span>
                <span>A02</span>
                <span>A03</span>
              </div>
              <div className="slot-row">
                <span>A04</span>
                <span className="slot-occupied">A05</span>
                <span>A06</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-block" id="buildings">
        <div className="section-header">
          <span className="eyebrow">Locations</span>
          <h2>Three parking buildings, one simple flow.</h2>
        </div>
        <div className="building-grid">
          {buildings.map((building) => (
            <article key={building} className="card-surface building-card">
              <div className="building-tag">Campus parking</div>
              <h3>{building}</h3>
              <p>{building === '1st Year Building' ? 'Closest to student housing and teaching blocks.' : building === '2nd Year Building' ? 'High-demand parking for staff and daily commuters.' : 'Convenient access for library visitors and study sessions.'}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section-block" id="how-it-works">
        <div className="section-header">
          <span className="eyebrow">How it works</span>
          <h2>Fast, simple, and secure.</h2>
        </div>
        <div className="steps-grid">
          {['Choose Building', 'Select Slot', 'Make Payment', 'Park Easily'].map((step, index) => (
            <div key={step} className="card-surface step-card">
              <span className="step-number">0{index + 1}</span>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-block" id="features">
        <div className="section-header">
          <span className="eyebrow">Features</span>
          <h2>Built for real parking operations.</h2>
        </div>
        <div className="feature-grid">
          <div className="card-surface feature-card">
            <h3>Live availability</h3>
            <p>See which slots are available before you book, with backend checks to stop conflicts.</p>
          </div>
          <div className="card-surface feature-card">
            <h3>Secure payment</h3>
            <p>Bookings move through Razorpay test-mode checkout with payment verification on the backend.</p>
          </div>
          <div className="card-surface feature-card">
            <h3>Role-based access</h3>
            <p>Users manage personal bookings while administrators oversee bookings, parking, and reporting.</p>
          </div>
        </div>
      </section>
    </>
  );
}
