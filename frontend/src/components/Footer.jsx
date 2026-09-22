export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand-lockup footer-brand">
            <span className="brand-mark">P</span>
            <span>Park Connect</span>
          </div>
          <p>Smart parking for daily commutes, campus access, and campus operations.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li>Home</li>
            <li>Features</li>
            <li>How It Works</li>
          </ul>
        </div>
        <div>
          <h4>Parking</h4>
          <ul>
            <li>1st Year Building</li>
            <li>2nd Year Building</li>
            <li>Library Building</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Park Connect</span>
        <span>Parking management system</span>
      </div>
    </footer>
  );
}
