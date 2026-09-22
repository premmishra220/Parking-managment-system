import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../App.jsx';

export default function PaymentPage({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.booking || {};
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingData || !bookingData._id) {
      navigate('/parking');
    }
  }, [bookingData, navigate]);

  const handlePayment = async () => {
    setError('');
    setIsCreatingOrder(true);

    try {
      const response = await api.post('/api/payment/create-order', {
        bookingId: bookingData._id,
        amount: Number(bookingData.amount || 0)
      });

      const { keyId, orderId, amount, currency } = response.data;

      const razorpayOptions = {
        key: keyId,
        amount: Math.round(amount * 100),
        currency,
        name: 'Park Connect',
        description: `${bookingData.building} • ${bookingData.slot}`,
        order_id: orderId,
        handler: async function (razorpayResponse) {
          try {
            const verifyResponse = await api.post('/api/payment/verify', {
              bookingId: bookingData._id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature
            });

            navigate('/confirmation', { state: { booking: verifyResponse.data.booking } });
          } catch (verifyError) {
            setError(verifyError.response?.data?.error || 'Payment verification failed.');
          }
        },
        theme: { color: '#0d1b2a' },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled. No booking was confirmed.');
          }
        }
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (payError) {
      setError(payError.response?.data?.error || 'Unable to create Razorpay order.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Payment</span>
          <h1>Complete your payment.</h1>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="two-column-layout">
        <section className="card-surface panel-block">
          <div className="panel-header">
            <h2>Park Connect</h2>
          </div>
          <div className="selection-summary">
            <div><span>Building</span><strong>{bookingData.building}</strong></div>
            <div><span>Slot</span><strong>{bookingData.slot}</strong></div>
            <div><span>Vehicle</span><strong>{bookingData.vehicleNumber}</strong></div>
            <div><span>Date</span><strong>{bookingData.bookingDate}</strong></div>
            <div><span>Time</span><strong>{bookingData.startTime} - {bookingData.endTime}</strong></div>
          </div>
        </section>

        <aside className="card-surface panel-block payment-card">
          <div className="panel-header">
            <h2>Amount Payable</h2>
            <strong>₹{Number(bookingData.amount || 0).toFixed(2)}</strong>
          </div>
          <button type="button" className="button button-primary full" onClick={handlePayment} disabled={isCreatingOrder}>
            {isCreatingOrder ? 'Preparing payment...' : 'Pay with Razorpay'}
          </button>
        </aside>
      </div>
    </div>
  );
}
