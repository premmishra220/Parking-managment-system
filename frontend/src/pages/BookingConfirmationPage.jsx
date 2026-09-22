import { Link, useLocation } from 'react-router-dom';

export default function BookingConfirmationPage({ user }) {
  const location = useLocation();
  const booking = location.state?.booking || {};

  return (
    <div className="container page-shell">
      <div className="card-surface confirmation-panel">
        <span className="success-badge">Booking confirmed</span>
        <h1>Parking secured.</h1>
        <p>Your booking has been confirmed and saved to your account.</p>

        <div className="confirmation-grid">
          <div><span>Building</span><strong>{booking.building}</strong></div>
          <div><span>Slot</span><strong>{booking.slot}</strong></div>
          <div><span>Vehicle</span><strong>{booking.vehicleNumber}</strong></div>
          <div><span>Date</span><strong>{booking.bookingDate}</strong></div>
          <div><span>Time</span><strong>{booking.startTime} - {booking.endTime}</strong></div>
          <div><span>Payment status</span><strong>{booking.paymentStatus}</strong></div>
          <div><span>Booking ID</span><strong>{booking._id}</strong></div>
        </div>

        <div className="confirmation-actions">
          <Link to="/bookings" className="button button-primary">View My Bookings</Link>
          <Link to="/dashboard" className="button button-muted">Back to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
