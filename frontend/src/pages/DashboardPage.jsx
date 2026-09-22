import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../App.jsx';

const getInitials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

export default function DashboardPage({ user }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/bookings/my')
      .then((response) => setBookings(response.data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setIsLoading(false));
  }, []);

  const currentBooking = bookings.find((booking) => booking.bookingStatus === 'confirmed') || bookings[0] || null;
  const upcoming = bookings.filter((booking) => booking.bookingStatus !== 'cancelled' && booking.bookingStatus !== 'completed').slice(0,2);

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Hello {user.name.split(' ')[0]}.</h1>
        </div>
        <Link to="/parking" className="button button-primary">Find parking</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Current booking</div>
          <div className="stat-value">{currentBooking ? currentBooking.bookingStatus : 'No active booking'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Upcoming bookings</div>
          <div className="stat-value">{upcoming.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Recent bookings</div>
          <div className="stat-value">{bookings.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total spend</div>
          <div className="stat-value">₹{bookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0).toFixed(2)}</div>
        </div>
      </div>

      <div className="two-column-layout">
        <section className="card-surface panel-block">
          <div className="panel-header">
            <h2>Current Booking</h2>
          </div>
          {isLoading ? (
            <div className="empty-box">Loading your bookings...</div>
          ) : currentBooking ? (
            <>
              <div className="booking-highlight">
                <div className="mini-user-badge">{getInitials(user.name)}</div>
                <div>
                  <h3>{currentBooking.building}</h3>
                  <p>{currentBooking.bookingDate} · {currentBooking.startTime} to {currentBooking.endTime}</p>
                </div>
              </div>
              <div className="detail-grid">
                <div><span>Slot</span><strong>{currentBooking.slot}</strong></div>
                <div><span>Vehicle</span><strong>{currentBooking.vehicleNumber}</strong></div>
                <div><span>Payment</span><strong>{currentBooking.paymentStatus}</strong></div>
              </div>
            </>
          ) : (
            <div className="empty-box">No bookings yet. Start with a new reservation.</div>
          )}
        </section>

        <section className="card-surface panel-block">
          <div className="panel-header">
            <h2>Upcoming</h2>
          </div>
          {upcoming.length ? (
            <div className="stack-list">
              {upcoming.map((booking) => (
                <div key={booking._id} className="list-item">
                  <strong>{booking.building}</strong>
                  <span>{booking.slot} · {booking.bookingDate}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-box">No upcoming bookings.</div>
          )}
        </section>
      </div>
    </div>
  );
}
