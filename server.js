require('dotenv').config();

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const Razorpay = require('razorpay');

const app = express();
const port = Number(process.env.PORT || 3000);
const buildings = {
  '1st Year Building': 4.5,
  '2nd Year Building': 3.75,
  'Library Building': 2.9
};
const allowedOrigins = new Set((process.env.ALLOWED_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean));

app.use((request, response, next) => {
  const origin = request.get('Origin');
  if (origin && allowedOrigins.size && !allowedOrigins.has(origin)) return response.status(403).json({ error: 'Origin not allowed.' });
  if (origin && allowedOrigins.has(origin)) {
    response.set('Access-Control-Allow-Origin', origin);
    response.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Vary', 'Origin');
  }
  if (request.method === 'OPTIONS') return response.sendStatus(origin && allowedOrigins.has(origin) ? 204 : 403);
  next();
});
app.use(express.json({ limit: '32kb' }));

app.get('/config.js', (request, response) => {
  response.type('application/javascript').send(`window.PARK_CONNECT_CONFIG = { apiBaseUrl: ${JSON.stringify(process.env.PUBLIC_API_BASE_URL || '')} };`);
});
app.use(express.static(__dirname));

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.expose = true;
  return error;
}

function calculateHours(entry, exit) {
  const entryTime = new Date(`2026-01-01T${entry}`);
  const exitTime = new Date(`2026-01-01T${exit}`);
  if (Number.isNaN(entryTime.valueOf()) || Number.isNaN(exitTime.valueOf()) || exitTime <= entryTime) return 0;
  return Math.max(1, Math.ceil((exitTime - entryTime) / 3600000));
}

function normalizeBooking(input) {
  if (!input || typeof input !== 'object') throw validationError('Invalid booking details.');
  const booking = {
    name: String(input.name || '').trim(),
    phone: String(input.phone || '').trim(),
    vehicle: String(input.vehicle || '').trim(),
    vehicleType: String(input.vehicleType || 'Car').trim(),
    parking: String(input.parking || '').trim(),
    slot: String(input.slot || '').trim(),
    date: String(input.date || '').trim(),
    entry: String(input.entry || '').trim(),
    exit: String(input.exit || '').trim()
  };
  if (!buildings[booking.parking] || !/^[A-E][1-5]$/.test(booking.slot) || !/^\d{4}-\d{2}-\d{2}$/.test(booking.date) || !/^\d{2}:\d{2}$/.test(booking.entry) || !/^\d{2}:\d{2}$/.test(booking.exit)) throw validationError('Invalid booking details.');
  if (!booking.name || !/^[0-9+ -]{8,20}$/.test(booking.phone) || !booking.vehicle || !['Car', 'Motorcycle', 'EV'].includes(booking.vehicleType)) throw validationError('Invalid booking details.');
  if (calculateHours(booking.entry, booking.exit) < 1) throw validationError('Exit time must be after entry time.');
  return booking;
}

function calculateAmount(booking) {
  const hours = calculateHours(booking.entry, booking.exit);
  if (!buildings[booking.parking] || hours < 1) throw validationError('Invalid booking details.');
  return Number((buildings[booking.parking] * hours + 1.2).toFixed(2));
}

function razorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error('Payment service is not configured.');
    error.statusCode = 503;
    error.expose = true;
    throw error;
  }
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}

function safeError(response, error, fallback) {
  response.status(error.statusCode || 400).json({ error: error.expose ? error.message : fallback });
}

app.post('/api/payments/order', async (request, response) => {
  try {
    const booking = normalizeBooking(request.body.booking);
    const amount = calculateAmount(booking);
    const bookingId = `PK-${crypto.randomInt(100000, 1000000)}`;
    const order = await razorpayClient().orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `park-connect-${bookingId}`,
      notes: { bookingId, ...booking }
    });
    response.json({ keyId: process.env.RAZORPAY_KEY_ID, bookingId, orderId: order.id, amount, currency: order.currency, status: 'created' });
  } catch (error) {
    safeError(response, error, 'Unable to create payment order.');
  }
});

app.post('/api/payments/verify', async (request, response) => {
  try {
    const { booking, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = request.body;
    if (!orderId || !paymentId || !signature) throw validationError('Incomplete payment verification data.');
    const normalizedBooking = normalizeBooking(booking);
    const client = razorpayClient();
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
    if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))) throw validationError('Payment verification failed.');
    const order = await client.orders.fetch(orderId);
    const payment = await client.payments.fetch(paymentId);
    const notes = order.notes || {};
    const bookingMatchesOrder = Object.entries(normalizedBooking).every(([key, value]) => String(notes[key] || '') === value);
    if (order.id !== orderId || payment.order_id !== orderId || payment.status !== 'captured' || order.amount !== Math.round(calculateAmount(normalizedBooking) * 100) || !bookingMatchesOrder) throw validationError('Payment verification failed.');
    response.json({ booking: { ...normalizedBooking, id: String(notes.bookingId), amount: calculateAmount(normalizedBooking), status: 'Confirmed/Paid', paymentStatus: 'paid', orderId, paymentId } });
  } catch (error) {
    safeError(response, error, 'Payment verification failed.');
  }
});

app.use('/api', (request, response) => response.status(404).json({ error: 'API route not found.' }));
app.get('*', (request, response) => response.sendFile(path.join(__dirname, 'index.html')));

app.listen(port, () => console.log(`Park Connect server listening on port ${port}`));
