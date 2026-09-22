import mongoose from 'mongoose';

const parkingSlotSchema = new mongoose.Schema(
  {
    building: {
      type: String,
      required: true,
      enum: ['1st Year Building', '2nd Year Building', 'Library Building']
    },
    slotNumber: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'occupied'],
      default: 'available'
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Motorcycle', 'EV'],
      default: 'Car'
    }
  },
  {
    timestamps: true
  }
);

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);
export default ParkingSlot;
