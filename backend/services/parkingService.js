import Booking from '../models/Booking.js';
import ParkingSlot from '../models/ParkingSlot.js';
import { AppError } from '../utils/errors.js';

export const getBuildings = () => [
  '1st Year Building',
  '2nd Year Building',
  'Library Building'
];

export const getSlotsForBuilding = async (buildingName) => {
  if (!getBuildings().includes(buildingName)) {
    throw new AppError('Invalid building name.', 400, true);
  }

  const slots = await ParkingSlot.find({ building: buildingName }).sort({ slotNumber: 1 }).lean();
  return slots;
};

export const ensureSlotAvailability = async ({ building, slotNumber, bookingDate, startTime, endTime, excludeBookingId = null }) => {
  const existingBooking = await Booking.findOne({
    building,
    slot: slotNumber,
    bookingStatus: { $in: ['pending', 'confirmed', 'completed'] },
    _id: { $ne: excludeBookingId || null },
    bookingDate,
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  if (existingBooking) {
    throw new AppError('This parking slot is already booked for the selected time.', 409, true);
  }
};

export const seedParkingSlots = async () => {
  const buildingNames = getBuildings();

  for (const building of buildingNames) {
    const existing = await ParkingSlot.countDocuments({ building });
    if (existing > 0) continue;

    const slotNumbers = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06'];
    const entries = slotNumbers.map((slotNumber, index) => ({
      building,
      slotNumber,
      status: index % 3 === 0 ? 'reserved' : 'available',
      vehicleType: index % 2 === 0 ? 'Car' : 'Motorcycle'
    }));

    await ParkingSlot.insertMany(entries);
  }
};
