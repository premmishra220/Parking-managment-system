import { useEffect, useState } from 'react';
import { api } from '../App.jsx';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/api/admin/bookings').then((response) => setBookings(response.data.bookings || [])).catch(() => setBookings([]));
  }, []);

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin bookings</span>
          <h1>All bookings</h1>
        </div>
      </div>

      <div className="table-wrap card-surface">
        <table>
          <thead>
            <tr>
              <th>Booking</th>
              <th>User</th>
              <th>Building</th>
              <th>Slot</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.user?.name || 'Unknown user'}</td>
                <td>{booking.building}</td>
                <td>{booking.slot}</td>
                <td>₹{Number(booking.amount || 0).toFixed(2)}</td>
                <td>{booking.bookingStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
