import { useEffect, useState } from 'react';
import { api } from '../App.jsx';

export default function AdminParkingPage() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    api.get('/api/admin/parking').then((response) => setSlots(response.data.slots || [])).catch(() => setSlots([]));
  }, []);

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin parking</span>
          <h1>Parking overview</h1>
        </div>
      </div>

      <div className="table-wrap card-surface">
        <table>
          <thead>
            <tr>
              <th>Building</th>
              <th>Slot</th>
              <th>Status</th>
              <th>Vehicle type</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot._id}>
                <td>{slot.building}</td>
                <td>{slot.slotNumber}</td>
                <td>{slot.status}</td>
                <td>{slot.vehicleType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
