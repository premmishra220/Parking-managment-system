import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../App.jsx';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="topbar-wrap">
      <div className="container nav-row">
        <Link to="/" className="brand-lockup" aria-label="Park Connect home">
          <span className="brand-mark">P</span>
          <span>Park Connect</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link>
              <Link to="/bookings">Bookings</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="button button-primary small">Get Started</Link>
            </>
          )}
        </nav>

        {user ? (
          <div className="nav-user">
            <span className="user-pill">{user.name}</span>
            <button type="button" className="button button-muted small" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="nav-user">
            <Link to="/login" className="button button-muted small">Login</Link>
            <Link to="/register" className="button button-primary small">Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
}
