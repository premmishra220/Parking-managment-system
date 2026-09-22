import express from 'express';
import { createPaymentOrder, verifyPayment } from '../services/bookingService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', protect, async (request, response, next) => {
  try {
    const { bookingId, amount } = request.body;
    const result = await createPaymentOrder({
      userId: request.user._id,
      bookingId,
      amount
    });

    response.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

router.post('/verify', protect, async (request, response, next) => {
  try {
    const booking = await verifyPayment(request.body);
    response.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
});

export default router;
