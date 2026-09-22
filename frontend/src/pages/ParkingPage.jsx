import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../App.jsx';

const BUILDINGS = ['1st Year Building', '2nd Year Building', 'Library Building'];

export default function ParkingPage({ user }) {
  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const buildingInfo = useMemo(
    () => ({
      '1st Year Building': { rate: '₹4.50/hr', note: 'Closest to classrooms and labs.' },
      '2nd Year Building': { rate: '₹3.75/hr', note: 'Popular for commuting staff and students.' },
      'Library Building': { rate: '₹2.90/hr', note: 'Ideal for study sessions and reading hours.' }
    }),
    []
  );

  useEffect(() => {
    setIsLoading(true);
    setError('');
    api
      .get(`/api/parking/slots/${encodeURIComponent(selectedBuilding)}`)
      .then((response) => {
        setSlots(response.data.slots || []);
        setSelectedSlot('');
      })
      .catch(() => {
        setError('Unable to load parking slots. Please try again.');
        setSlots([]);
      })
      .finally(() => setIsLoading(false));
  }, [selectedBuilding]);

  const handleContinue = () => {
    if (!selectedSlot) {
      setError('Please select a slot before continuing.');
      return;
    }

    navigate('/booking', { state: { building: selectedBuilding, slot: selectedSlot } });
  };

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Parking</span>
          <h1>Select a building and slot.</h1>
        </div>
      </div>

      <div className="building-strip">
        {BUILDINGS.map((building) => (
          <button
            key={building}
            type="button"
            className={`building-toggle ${selectedBuilding === building ? 'active' : ''}`}
            onClick={() => setSelectedBuilding(building)}
          >
            {building}
          </button>
        ))}
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="two-column-layout">
        <section className="card-surface panel-block">
          <div className="panel-header">
            <h2>{selectedBuilding}</h2>
            <span>{buildingInfo[selectedBuilding].rate}</span>
          </div>
          <p className="muted-text">{buildingInfo[selectedBuilding].note}</p>

          {isLoading ? (
            <div className="empty-box">Loading available parking...</div>
          ) : (
            <div className="slot-grid">
              {slots.length ? (
                slots.map((slot) => (
                  <button
                    key={slot._id}
                    type="button"
                    className={`slot-button ${selectedSlot === slot.slotNumber ? 'selected' : ''} ${slot.status === 'occupied' ? 'occupied' : ''}`} 
                    onClick={() => slot.status === 'available' && setSelectedSlot(slot.slotNumber)}
                    disabled={slot.status !== 'available'}
                  >
                    <span>{slot.slotNumber}</span>
                    <small>{slot.status}</small>
                  </button>
                ))
              ) : (
                <div className="empty-box">No slots available at the moment.</div>
              )}
            </div>
          )}
        </section>

        <aside className="card-surface panel-block">
          <div className="panel-header">
            <h2>Selection</h2>
          </div>
          <div className="selection-summary">
            <div><span>Building</span><strong>{selectedBuilding}</strong></div>
            <div><span>Slot</span><strong>{selectedSlot || 'Not selected'}</strong></div>
            <div><span>Rate</span><strong>{buildingInfo[selectedBuilding].rate}</strong></div>
          </div>
          <button type="button" className="button button-primary full" onClick={handleContinue}>
            Continue booking
          </button>
        </aside>
      </div>
    </div>
  );
}
