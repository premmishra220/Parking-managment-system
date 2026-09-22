import express from 'express';
import { createBooking, fetchMyBookings, fetchBookingById, cancelBooking } from '../services/bookingService.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (request, response, next) => {
  try {
    const booking = await createBooking({
      userId: request.user._id,
      bookingData: request.body
    });

    response.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
});

router.get('/my', protect, async (request, response, next) => {
  try {
    const bookings = await fetchMyBookings(request.user._id);
    response.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (request, response, next) => {
  try {
    const booking = await fetchBookingById(request.params.id, request.user._id, request.user.role === 'admin');
    response.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/cancel', protect, async (request, response, next) => {
  try {
    const booking = await cancelBooking({
      id: request.params.id,
      userId: request.user._id,
      isAdmin: request.user.role === 'admin'
    });

    response.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
});

export default router;
