import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import ParkingSlot from '../models/ParkingSlot.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', async (request, response, next) => {
  try {
    const [totalUsers, totalBookings, activeBookings, completedBookings, revenueResult, availableSlots, occupiedSlots] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: { $in: ['pending', 'confirmed'] } }),
      Booking.countDocuments({ bookingStatus: 'completed' }),
      Booking.aggregate([{ $group: { _id: null, revenue: { $sum: '$amount' } } }]),
      ParkingSlot.countDocuments({ status: 'available' }),
      ParkingSlot.countDocuments({ status: 'occupied' })
    ]);

    response.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        activeBookings,
        completedBookings,
        revenue: revenueResult[0]?.revenue || 0,
        availableSlots,
        occupiedSlots
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (request, response, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    response.json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

router.get('/bookings', async (request, response, next) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').sort({ createdAt: -1 }).lean();
    response.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
});

router.get('/parking', async (request, response, next) => {
  try {
    const slots = await ParkingSlot.find().sort({ building: 1, slotNumber: 1 }).lean();
    response.json({ success: true, slots });
  } catch (error) {
    next(error);
  }
});

export default router;
