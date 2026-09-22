import { useEffect, useState } from 'react';
import { api } from '../App.jsx';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/bookings/my')
      .then((response) => setBookings(response.data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">My bookings</span>
          <h1>Booking history</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="empty-box">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-box">No bookings yet.</div>
      ) : (
        <div className="table-wrap card-surface">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Building</th>
                <th>Slot</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id.slice(-8)}</td>
                  <td>{booking.building}</td>
                  <td>{booking.slot}</td>
                  <td>{booking.vehicleNumber}</td>
                  <td>{booking.bookingDate}</td>
                  <td>{booking.startTime} - {booking.endTime}</td>
                  <td>₹{Number(booking.amount || 0).toFixed(2)}</td>
                  <td>{booking.paymentStatus}</td>
                  <td>{booking.bookingStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
