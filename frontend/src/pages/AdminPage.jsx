import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../App.jsx';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    revenue: 0,
    availableSlots: 0,
    occupiedSlots: 0
  });

  useEffect(() => {
    api
      .get('/api/admin/dashboard')
      .then((response) => setStats(response.data.stats || stats))
      .catch(() => setStats({
        totalUsers: 0,
        totalBookings: 0,
        activeBookings: 0,
        completedBookings: 0,
        revenue: 0,
        availableSlots: 0,
        occupiedSlots: 0
      }));
  }, []);

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <h1>Operations overview</h1>
        </div>
        <Link to="/admin/parking" className="button button-primary">Manage parking</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-value">{stats.totalUsers}</div></div>
        <div className="stat-card"><div className="stat-label">Total Bookings</div><div className="stat-value">{stats.totalBookings}</div></div>
        <div className="stat-card"><div className="stat-label">Active Bookings</div><div className="stat-value">{stats.activeBookings}</div></div>
        <div className="stat-card"><div className="stat-label">Completed Bookings</div><div className="stat-value">{stats.completedBookings}</div></div>
        <div className="stat-card"><div className="stat-label">Revenue</div><div className="stat-value">₹{Number(stats.revenue || 0).toFixed(2)}</div></div>
        <div className="stat-card"><div className="stat-label">Available Slots</div><div className="stat-value">{stats.availableSlots}</div></div>
        <div className="stat-card"><div className="stat-label">Occupied Slots</div><div className="stat-value">{stats.occupiedSlots}</div></div>
      </div>
    </div>
  );
}
