import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../App.jsx';

export default function LoginPage({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/login', form);
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (submitError) {
      setError(submitError.response?.data?.error || 'Unable to sign in right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Park Connect</span>
          <h1>Welcome back.</h1>
          <p>Book campus parking in minutes and keep your day moving.</p>
        </div>

        <form className="form-panel" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <div className="alert error">{error}</div>}

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>

          <button type="submit" className="button button-primary full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Login'}
          </button>

          <p className="small-note">
            Need an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
