import crypto from 'crypto';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { AppError } from '../utils/errors.js';
import getRazorpayClient from '../config/razorpay.js';
import { ensureSlotAvailability } from './parkingService.js';

export const createBooking = async ({ userId, bookingData }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404, true);
  }

  const { building, slot, vehicleNumber, vehicleType, bookingDate, startTime, endTime, amount } = bookingData;

  if (!building || !slot || !vehicleNumber || !bookingDate || !startTime || !endTime || !amount) {
    throw new AppError('Booking details are incomplete.', 400, true);
  }

  await ensureSlotAvailability({
    building,
    slotNumber: slot,
    bookingDate,
    startTime,
    endTime
  });

  const booking = await Booking.create({
    user: userId,
    building,
    slot,
    vehicleNumber,
    vehicleType,
    bookingDate,
    startTime,
    endTime,
    amount,
    paymentStatus: 'pending',
    bookingStatus: 'pending'
  });

  return booking;
};

export const fetchMyBookings = async (userId) => {
  return Booking.find({ user: userId }).sort({ createdAt: -1 }).lean();
};

export const fetchBookingById = async (id, userId, isAdmin = false) => {
  const query = isAdmin ? { _id: id } : { _id: id, user: userId };
  const booking = await Booking.findOne(query).populate('user', 'name email role');

  if (!booking) {
    throw new AppError('Booking not found.', 404, true);
  }

  return booking;
};

export const cancelBooking = async ({ id, userId, isAdmin = false }) => {
  const booking = await fetchBookingById(id, userId, isAdmin);

  if (booking.bookingStatus === 'cancelled') {
    return booking;
  }

  booking.bookingStatus = 'cancelled';
  booking.paymentStatus = booking.paymentStatus === 'paid' ? 'paid' : 'cancelled';
  await booking.save();
  return booking;
};

export const createPaymentOrder = async ({ userId, bookingId, amount }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.user.toString() !== userId.toString()) {
    throw new AppError('Booking not found for this user.', 404, true);
  }

  const client = getRazorpayClient();
  const order = await client.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: 'INR',
    receipt: `booking_${bookingId}`,
    notes: {
      bookingId: bookingId.toString(),
      userId: userId.toString()
    }
  });

  booking.razorpayOrderId = order.id;
  booking.paymentStatus = 'pending';
  booking.bookingStatus = 'pending';
  await booking.save();

  return {
    orderId: order.id,
    amount: Number(amount),
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID
  };
};

export const verifyPayment = async ({ bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError('Incomplete payment verification payload.', 400, true);
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found.', 404, true);
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(razorpay_signature)
  );

  if (!isValid) {
    booking.paymentStatus = 'failed';
    booking.bookingStatus = 'pending';
    await booking.save();
    throw new AppError('Razorpay signature verification failed.', 400, true);
  }

  booking.paymentStatus = 'paid';
  booking.bookingStatus = 'confirmed';
  booking.razorpayPaymentId = razorpay_payment_id;
  await booking.save();

  return booking;
};
