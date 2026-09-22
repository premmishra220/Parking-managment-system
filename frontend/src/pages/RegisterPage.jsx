import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../App.jsx';

export default function RegisterPage({ setUser }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const response = await api.post('/api/auth/register', form);
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError.response?.data?.error || 'Unable to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Park Connect</span>
          <h1>Create your account.</h1>
          <p>Set up a secure profile and book parking in a few steps.</p>
        </div>

        <form className="form-panel" onSubmit={handleSubmit}>
          <h2>Register</h2>
          {error && <div className="alert error">{error}</div>}

          <label>
            Full name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
          </label>

          <button type="submit" className="button button-primary full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="small-note">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
