import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { api } from '../App.jsx';

const BUILDING_RATES = {
  '1st Year Building': 4.5,
  '2nd Year Building': 3.75,
  'Library Building': 2.9
};

export default function BookingPage({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingState = location.state || {};
  const [form, setForm] = useState({
    vehicleNumber: '',
    vehicleType: 'Car',
    bookingDate: new Date().toISOString().slice(0, 10),
    startTime: '09:00',
    endTime: '12:00'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amount = useMemo(() => {
    const start = new Date(`2025-01-01T${form.startTime}:00`);
    const end = new Date(`2025-01-01T${form.endTime}:00`);
    const hours = Math.max(1, Math.ceil((end - start) / 3600000));
    return Number((BUILDING_RATES[bookingState.building || '1st Year Building'] * hours).toFixed(2));
  }, [bookingState.building, form.startTime, form.endTime]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!bookingState.building || !bookingState.slot) {
      setError('Select a building and slot before continuing.');
      navigate('/parking');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        building: bookingState.building,
        slot: bookingState.slot,
        vehicleNumber: form.vehicleNumber,
        vehicleType: form.vehicleType,
        bookingDate: form.bookingDate,
        startTime: form.startTime,
        endTime: form.endTime,
        amount
      };

      const response = await api.post('/api/bookings', payload);
      const booking = response.data.booking;
      navigate('/payment', { state: { bookingId: booking._id, booking } });
    } catch (submitError) {
      setError(submitError.response?.data?.error || 'Unable to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Booking</span>
          <h1>Booking summary</h1>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="two-column-layout">
        <form onSubmit={handleSubmit} className="card-surface panel-block form-panel">
          <div className="panel-header">
            <h2>Vehicle details</h2>
          </div>

          <label>
            Vehicle number
            <input name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} required />
          </label>

          <label>
            Vehicle type
            <select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="EV">EV</option>
            </select>
          </label>

          <label>
            Booking date
            <input type="date" name="bookingDate" value={form.bookingDate} onChange={handleChange} required />
          </label>

          <div className="two-field-row">
            <label>
              Start time
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
            </label>
            <label>
              End time
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
            </label>
          </div>

          <button type="submit" className="button button-primary full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating booking...' : 'Continue Payment'}
          </button>
        </form>

        <aside className="card-surface panel-block">
          <div className="panel-header">
            <h2>Summary</h2>
          </div>
          <div className="selection-summary">
            <div><span>Building</span><strong>{bookingState.building}</strong></div>
            <div><span>Slot</span><strong>{bookingState.slot}</strong></div>
            <div><span>Vehicle type</span><strong>{form.vehicleType}</strong></div>
            <div><span>Date</span><strong>{form.bookingDate}</strong></div>
            <div><span>Time</span><strong>{form.startTime} - {form.endTime}</strong></div>
            <div><span>Amount</span><strong>₹{amount.toFixed(2)}</strong></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
